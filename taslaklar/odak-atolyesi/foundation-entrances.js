/* Door-guided landing suggestions. Explicit draft operations, no hidden model edits. */
(function(root){
 'use strict';
 const D=root.FoundationData,cross=(a,b)=>a.x*b.y-a.y*b.x;
 function ray(p,n,a,b){const u={x:b.x-a.x,y:b.y-a.y},v={x:a.x-p.x,y:a.y-p.y},det=cross(n,u);if(Math.abs(det)<1e-8)return null;const t=cross(v,u)/det,s=cross(v,n)/det;return t>=-.001&&s>=-.00001&&s<=1.00001?Math.max(0,t):null;}
 function doors(nodes,segs,openings,rooms){const lookup=new Map(nodes.map(n=>[n.id,n])),walls=new Map(segs.map(s=>[s.id,s])),polys=rooms.filter(r=>r.tip!=='veranda').map(r=>r.nodeIds.map(id=>lookup.get(id))).filter(p=>p.length>2&&p.every(Boolean));
  return openings.filter(e=>e.tip_==='kapi').flatMap((e,i)=>{const s=walls.get(e.segId),a=lookup.get(s?.n1),b=lookup.get(s?.n2);if(!s||!a||!b||s.tip==='veranda')return [];const len=Math.hypot(b.x-a.x,b.y-a.y);if(len<.01)return [];const u={x:(b.x-a.x)/len,y:(b.y-a.y)/len},normal={x:-u.y,y:u.x},at=t=>({x:a.x+u.x*t,y:a.y+u.y*t}),p=at(e.t*len+e.en/2),test=sign=>polys.some(poly=>D.inside({x:p.x+normal.x*sign*(s.k/2+2),y:p.y+normal.y*sign*(s.k/2+2)},poly)),plus=test(1),minus=test(-1),side=plus!==minus?(plus?-1:1):0;
   return [{id:e.id,label:'K'+(i+1),name:e.ad||'Kapı '+(i+1),p,a:at(e.t*len),b:at(e.t*len+e.en),width:e.en,thickness:s.k,u,n:{x:normal.x*side,y:normal.y*side},exterior:!!side&&!!s.dis,uncertain:!!s.dis&&!side}];});
 }
 function suggest(f,doorList,nodes,segs,rooms,settings={}){
  const side=settings.side??30,depth=settings.depth??100,risers=settings.risers??Math.max(1,Math.min(40,Math.round((f?.height||30)/15))),tread=settings.tread??30;
  if(!Number.isFinite(side)||side<0||side>500||!Number.isFinite(depth)||depth<10||depth>10000||!Number.isInteger(risers)||risers<1||risers>40||!Number.isFinite(tread)||tread<10||tread>100)throw Error('Öneri ölçülerini kontrol edin: yan pay 0–500, derinlik en az 10, rıht 1–40, basamak 10–100 cm.');
  D.validate(f);if(!f)throw Error('Önce beton sınırını çizin.');const lookup=new Map(nodes.map(n=>[n.id,n])),verandas=rooms.filter(r=>r.tip==='veranda').map(r=>r.nodeIds.map(id=>lookup.get(id))).filter(p=>p.length>2&&p.every(Boolean)),boundary=D.boundary(f),frames=f.outline.map((_,i)=>D.frame(f,i));
  return doorList.filter(d=>d.exterior||d.uncertain).map(d=>{
   const result={door:d,status:'blocked',message:'',landing:null,existing:null};
   const linked=f.landings.find(l=>D.doorIds(l).includes(d.id));if(linked)return {...result,status:'existing',message:(D.doorIds(linked).length>1?'Ortak sahanlık':'Ekli')+' · ölçülerini elle düzenleyebilirsin',existing:linked.id};
   if(d.uncertain)return {...result,message:'Dış yön belirsiz · girişi elle yerleştir'};
   if(!D.inside(d.p,boundary))return {...result,message:'Kapı beton sınırı dışında'};
   const hits=frames.map((r,edge)=>({r,edge,t:ray(d.p,d.n,r.a,r.b)})).filter(h=>h.t!==null).sort((a,b)=>a.t-b.t),hit=hits[0];if(!hit)return {...result,message:'Kapı karşısında beton kenarı bulunamadı'};
   const {r,edge,t}=hit,front={x:d.p.x+d.n.x*(d.thickness/2+2),y:d.p.y+d.n.y*(d.thickness/2+2)},onVeranda=verandas.some(poly=>D.inside(front,poly))||segs.some(s=>{if(s.tip!=='veranda')return false;const a=lookup.get(s.n1),b=lookup.get(s.n2);if(!a||!b)return false;const v=ray(d.p,d.n,a,b);return v!==null&&v>d.thickness/2&&v<=t+1;});
   if(onVeranda)return {...result,status:'veranda',message:'Verandaya açılıyor · veranda girişini elle yerleştir'};
   if(t-d.thickness/2>(f.edgeMargins?.[edge]??f.margin??0)+50)return {...result,message:'Kapı önünde geniş beton alanı var · girişi elle yerleştir'};
   if(r.n.x*d.n.x+r.n.y*d.n.y<.999)return {...result,message:'Beton kenarı kapıya paralel değil · elle düzenle'};
   const center=(d.p.x-r.a.x)*r.u.x+(d.p.y-r.a.y)*r.u.y,manual=f.landings.find(l=>l.edge===edge&&center-d.width/2>=l.offset-.01&&center+d.width/2<=l.offset+l.width+.01);
   if(manual)return {...result,status:'existing',message:'Bu kapının önünde ortak kullanılabilen giriş var',existing:manual.id};
   const width=d.width+2*side,offset=center-width/2;
   const baseId='door-'+d.id.slice(0,60),landing={id:baseId,doorId:d.id,edge,offset,width,depth,risers,tread};let suffix=1;while(f.landings.some(l=>l.id===landing.id))landing.id=baseId+'-'+suffix++;
   let added;try{added=D.addLanding(f,landing);}catch(e){return {...result,message:e.message};}
   const joinsBase=D.parts({...f,landings:[landing]}).some(p=>p.kind==='foundationLanding'&&p.poly.some(v=>D.inside({x:v.x+d.n.x*.001,y:v.y+d.n.y*.001},boundary)));
   return {...result,status:'ready',message:(added.mergedIds.length?'Mevcut girişle ortak sahanlık · ':joinsBase?'Yan betonla birleşir · ':'')+added.landing.width+' × '+depth+' cm · '+risers+' rıht',landing,merges:added.mergedIds};
  });
 }
 root.FoundationEntrances={doors,suggest};
})(typeof window==='undefined'?globalThis:window);
