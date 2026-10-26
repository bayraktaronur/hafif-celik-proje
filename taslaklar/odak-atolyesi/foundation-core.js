/* Prototype-only concrete geometry. Centimetres; the ground is Z=0. */
(function(root){
 'use strict';
 const EPS=1e-6, copy=x=>JSON.parse(JSON.stringify(x));
 const signed=p=>p.reduce((s,a,i)=>{const b=p[(i+1)%p.length];return s+a.x*b.y-b.x*a.y;},0)/2;
 const area=p=>Math.abs(signed(p));
 const cross=(a,b,c)=>(b.x-a.x)*(c.y-a.y)-(b.y-a.y)*(c.x-a.x);
 const ccw=p=>signed(p)<0?p.slice().reverse():p.slice();
 const distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
 function projection(p,a,b){const len=distance(a,b),t=Math.max(0,Math.min(1,((p.x-a.x)*(b.x-a.x)+(p.y-a.y)*(b.y-a.y))/(len*len||1)));return{x:a.x+t*(b.x-a.x),y:a.y+t*(b.y-a.y),t,distance:distance(p,{x:a.x+t*(b.x-a.x),y:a.y+t*(b.y-a.y)})};}
 function on(p,a,b){return Math.abs(cross(a,b,p))<EPS&&p.x>=Math.min(a.x,b.x)-EPS&&p.x<=Math.max(a.x,b.x)+EPS&&p.y>=Math.min(a.y,b.y)-EPS&&p.y<=Math.max(a.y,b.y)+EPS;}
 function crossing(a,b,c,d){const x=cross(a,b,c),y=cross(a,b,d),u=cross(c,d,a),v=cross(c,d,b);return x*y<0&&u*v<0||on(a,c,d)||on(b,c,d)||on(c,a,b)||on(d,a,b);}
 function inside(p,poly){return poly.some((a,i)=>on(p,a,poly[(i+1)%poly.length]))||root.RoofCore.pointIn(poly,p);}
 function number(v,min,max,label){if(!Number.isFinite(v)||v<min||v>max)throw Error(label+' '+min+'–'+max+' aralığında olmalı.');}
 function outline(poly){
  if(!Array.isArray(poly)||poly.length<3||poly.length>80)throw Error('Beton sınırını 3–80 köşeyle kapatın.');
  poly.forEach(p=>{if(!p||!Number.isFinite(p.x)||!Number.isFinite(p.y)||Math.abs(p.x)>50000||Math.abs(p.y)>50000)throw Error('Geçersiz beton köşesi.');});
  for(let i=0;i<poly.length;i++){
   const a=poly[i],b=poly[(i+1)%poly.length];if(distance(a,b)<1)throw Error('İki köşe arası en az 1 cm olmalı.');
   const prev=poly[(i+poly.length-1)%poly.length];if(Math.abs(cross(prev,a,b))<EPS&&(a.x-prev.x)*(b.x-a.x)+(a.y-prev.y)*(b.y-a.y)<0)throw Error('Beton sınırı kendi üzerine dönemez.');
   for(let j=i+1;j<poly.length;j++){if(j===i+1||i===0&&j===poly.length-1)continue;if(crossing(a,b,poly[j],poly[(j+1)%poly.length]))throw Error('Beton sınırı kendi üzerinden geçemez.');}
  }
  if(area(poly)<100)throw Error('Beton alanı en az 100 cm² olmalı.');
  root.RoofCore.triangulate(ccw(poly));return poly;
 }
 function boundary(f){const p=f.outline,sign=signed(p)>0?1:-1,lines=p.map((a,i)=>{const b=p[(i+1)%p.length],len=distance(a,b),u={x:(b.x-a.x)/len,y:(b.y-a.y)/len},d=f.edgeMargins?.[i]??f.margin??0;return{a:{x:a.x+u.y*sign*d,y:a.y-u.x*sign*d},u,d};});
  return lines.map((b,i)=>{const a=lines[(i+lines.length-1)%lines.length],den=a.u.x*b.u.y-a.u.y*b.u.x;if(Math.abs(den)<EPS){if(Math.abs(a.d-b.d)>.001)throw Error('Aynı doğrultudaki komşu kenarların beton payı eşit olmalı.');return{...b.a};}const dx=b.a.x-a.a.x,dy=b.a.y-a.a.y,t=(dx*b.u.y-dy*b.u.x)/den;return{x:a.a.x+a.u.x*t,y:a.a.y+a.u.y*t};});
 }
 function frame(f,edge){const poly=boundary(f),a=poly[edge],b=poly[(edge+1)%poly.length];if(!a||!b)throw Error('Sahanlığın bağlı olduğu kenar bulunamadı.');const len=distance(a,b),u={x:(b.x-a.x)/len,y:(b.y-a.y)/len},sign=signed(poly)>0?1:-1;return{a,b,len,u,n:{x:u.y*sign,y:-u.x*sign}};}
 function rect(f,l,start,end){const r=frame(f,l.edge),point=(x,y)=>({x:r.a.x+r.u.x*x+r.n.x*y,y:r.a.y+r.u.y*x+r.n.y*y});return ccw([point(l.offset,start),point(l.offset+l.width,start),point(l.offset+l.width,end),point(l.offset,end)]);}
 function parts(f){if(!f)return[];const out=[{id:'base',kind:'foundation',poly:ccw(boundary(f)),height:f.height}];
  for(const l of f.landings){out.push({id:l.id,kind:'foundationLanding',poly:rect(f,l,0,l.depth),height:f.height});for(let i=1;i<l.risers;i++)out.push({id:l.id+'-step-'+i,kind:'foundationStep',poly:rect(f,l,l.depth+(i-1)*l.tread,l.depth+i*l.tread),height:f.height*(l.risers-i)/l.risers});}return out;
 }
 function overlap(a,b){return root.RoofCore.triangulate(ccw(a)).reduce((sum,p)=>sum+root.RoofCore.triangulate(ccw(b)).reduce((s,q)=>s+area(root.RoofCore.intersect(p,q)),0),0);}
 let solidKey='',solidCache=null;
 function solid(f){const key=JSON.stringify(f);if(key!==solidKey||!solidCache){solidCache=root.FoundationSolid.build(parts(f));solidKey=key;}return solidCache;}
 const doorIds=l=>[...new Set([...(l.doorIds||[]),...(l.doorId?[l.doorId]:[])])];
 function addLanding(f,landing){
  // Compatible, touching landings on one edge become a single editable entrance.
  const next=copy(f),merged=copy(landing),ids=doorIds(merged);let changed=true,mergedIds=[];
  while(changed){changed=false;for(const l of next.landings){if(mergedIds.includes(l.id)||l.edge!==merged.edge||Math.abs(l.depth-merged.depth)>.001||l.risers!==merged.risers||Math.abs(l.tread-merged.tread)>.001||l.offset>merged.offset+merged.width+.001||merged.offset>l.offset+l.width+.001)continue;const start=Math.min(l.offset,merged.offset),end=Math.max(l.offset+l.width,merged.offset+merged.width);merged.offset=start;merged.width=end-start;ids.unshift(...doorIds(l));mergedIds.push(l.id);changed=true;}}
  if(mergedIds.length)merged.id=mergedIds[0];merged.doorIds=[...new Set(ids)];if(merged.doorIds.length)merged.doorId=merged.doorIds[0];else delete merged.doorId;
  const at=next.landings.findIndex(l=>mergedIds.includes(l.id));next.landings=next.landings.filter(l=>!mergedIds.includes(l.id));next.landings.splice(at<0?next.landings.length:at,0,merged);validate(next);return {foundation:next,landing:merged,mergedIds};
 }
 function validate(f){
  if(f==null)return;
  if(f.version!==1)throw Error('Desteklenmeyen zemin betonu kaydı.');
  number(f.height,1,1000,'Beton yüksekliği (cm)');outline(f.outline);number(f.margin??0,0,500,'Beton taşması (cm)');
  if(f.edgeMargins!==undefined){if(!Array.isArray(f.edgeMargins)||f.edgeMargins.length!==f.outline.length)throw Error('Kenar payları sınırla eşleşmiyor.');f.edgeMargins.forEach(d=>{if(d!==null)number(d,0,500,'Kenar beton payı (cm)');});}
  const outer=boundary(f);outline(outer);if(signed(outer)*signed(f.outline)<=0||area(outer)<area(f.outline)-EPS)throw Error('Beton payı bu sınırda uygulanamıyor; mesafeyi azaltın.');
  if(!Array.isArray(f.landings)||f.landings.length>40)throw Error('En fazla 40 sahanlık eklenebilir.');
  const ids=new Set();for(const l of f.landings){
   if(!l||typeof l.id!=='string'||l.id.length>80||ids.has(l.id))throw Error('Geçersiz sahanlık kimliği.');ids.add(l.id);
   if(!Number.isInteger(l.edge)||l.edge<0||l.edge>=f.outline.length)throw Error('Sahanlık kenarını seçin.');
   if(l.doorId!==undefined&&(typeof l.doorId!=='string'||l.doorId.length>80))throw Error('Geçersiz kapı bağlantısı.');
   if(l.doorIds!==undefined&&(!Array.isArray(l.doorIds)||l.doorIds.length>100||l.doorIds.some(id=>typeof id!=='string'||id.length>80)))throw Error('Geçersiz ortak sahanlık kapıları.');
   const r=frame(f,l.edge);number(l.offset,-10000,r.len,'Kenar başlangıcından mesafe (cm)');number(l.width,10,10000,'Sahanlık eni (cm)');number(l.depth,10,10000,'Sahanlık derinliği (cm)');number(l.tread,10,100,'Basamak derinliği (cm)');
   if(!Number.isInteger(l.risers)||l.risers<1||l.risers>40)throw Error('Rıht adedi 1–40 arasında tam sayı olmalı.');
   const end=l.offset+l.width;if(Math.min(end,r.len)-Math.max(l.offset,0)<10-EPS)throw Error('Sahanlık beton kenarına en az 10 cm bağlanmalı.');
   const excess=[];if(l.offset<-.001)excess.push(rect(f,{...l,width:-l.offset},0,l.depth));if(end>r.len+.001)excess.push(rect(f,{...l,offset:r.len,width:end-r.len},0,l.depth));
   if(excess.some(p=>area(p)-overlap(p,outer)>.01))throw Error('Sahanlık bu kenara sığmıyor; kenarı aşan bölüm yan betonun üzerinde olmalı.');
  }
  if(f.landings.reduce((n,l)=>n+l.risers,0)>400)throw Error('Toplam sahanlık / basamak sayısı 400’ü aşamaz.');
  // Overlaps are concrete unions, not errors. Exposed steps use the highest solid at each point.
 }
 function totals(f){if(!f)return{area:0,volume:0,landingArea:0,stairVolume:0};const p=solid(f).patches;return{area:area(boundary(f))/1e4,volume:p.reduce((s,r)=>s+area(r.poly)*r.height/1e6,0),landingArea:p.filter(r=>r.kind==='foundationLanding').reduce((s,r)=>s+area(r.poly)/1e4,0),stairVolume:p.filter(r=>r.kind==='foundationStep').reduce((s,r)=>s+area(r.poly)*r.height/1e6,0)};}
 function mesh(f){return f?solid(f).surfaces:[];}
 function compose(items,edges,f){if(!f)return{items,edges};const lift=p=>({...p,z:(p.z||0)+f.height});return{items:[...items.map(i=>({...i,poly:i.poly.map(lift)})),...mesh(f)],edges:[...edges.map(e=>({...e,...(e.p?{p:lift(e.p)}:{}),...(e.q?{q:lift(e.q)}:{}),...(e.poly?{poly:e.poly.map(lift)}:{})})),...solid(f).edges]};}
 function billRows(f){if(!f)return[];const t=totals(f),row=(kalem,olcu,birim,miktar)=>({grup:'Zemin betonu',kalem,olcu,birim,miktar});return[row('Beton sınırı alanı','Çizilmiş kapalı sınır','m²',t.area),row('Sahanlık alanı',f.landings.length+' giriş','m²',t.landingArea),row('Net beton hacmi','Gövde + sahanlık + dolu basamak · '+f.height+' cm','m³',t.volume)];}
 // Include wall faces and open veranda lines. Sampling also exposes a concave cutout under a wall.
 function unsupported(f,nodes,segs){if(!f)return[];const lookup=new Map(nodes.map(n=>[n.id,n])),polys=parts(f).filter(p=>p.height===f.height).map(p=>p.poly),bad=[];
  for(const s of segs){const a=lookup.get(s.n1),b=lookup.get(s.n2);if(!a||!b)continue;const length=distance(a,b),n={x:-(b.y-a.y)/(length||1),y:(b.x-a.x)/(length||1)},half=(+s.k||10)/2,steps=Math.max(1,Math.ceil(length/10));let ok=true;for(let i=0;i<=steps&&ok;i++)for(const d of [-half,0,half]){const p={x:a.x+(b.x-a.x)*i/steps+n.x*d,y:a.y+(b.y-a.y)*i/steps+n.y*d};if(!polys.some(poly=>inside(p,poly))){ok=false;break;}}if(!ok)bad.push(s.id);}return bad;
 }
 root.FoundationData={copy,signed,area,ccw,projection,inside,outline,boundary,frame,rect,parts,validate,totals,mesh,compose,billRows,unsupported,solid,doorIds,addLanding};
})(typeof window==='undefined'?globalThis:window);
