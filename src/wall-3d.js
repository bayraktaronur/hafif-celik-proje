/* Plan-derived fabrication preview. Coordinates are centimetres. */
(function(){
'use strict';
function build(){
 const surfaces=[],parts=[],warnings=new Set(),height=Number(G.opt.h)||280,A=pfAnaliz();
 function box(poly,z0,z1,color,meta){if(z1<=z0)return;
 if(meta.kind==='wallJoint'&&!meta.clipped){const center=poly.reduce((a,p)=>({x:a.x+p.x/poly.length,y:a.y+p.y/poly.length}),{x:0,y:0});let ranges=[[z0,z1]];
 for(const e of G.elemanlar){const seg=getSeg(e.segId),a=seg&&getNode(seg.n1),b=seg&&getNode(seg.n2);if(!a||!b)continue;const L=Math.hypot(b.x-a.x,b.y-a.y),ux=(b.x-a.x)/L,uy=(b.y-a.y)/L,t=(center.x-a.x)*ux+(center.y-a.y)*uy,n=-(center.x-a.x)*uy+(center.y-a.y)*ux;if(t<=e.t*L||t>=e.t*L+e.en||Math.abs(n)>seg.k/2+.2)continue;const lo=e.tip_==='kapi'?0:210-e.yuk,hi=lo+e.yuk;ranges=ranges.flatMap(([x,y])=>[[x,Math.min(y,lo)],[Math.max(x,hi),y]].filter(([x,y])=>y>x));warnings.add('Açıklıkla çakışan birleşim yalnız açıklık dışında gösterilir; plan mesnetlerini kontrol edin.');}
 for(const [a,b] of ranges)box(poly,a,b,color,{...meta,clipped:true});return;}
surfaces.push({...meta,poly:poly.map(p=>({...p,z:z1})),color,shade:1});poly.forEach((p,i)=>{const q=poly[(i+1)%poly.length];surfaces.push({...meta,poly:[{...p,z:z0},{...q,z:z0},{...q,z:z1},{...p,z:z1}],color,shade:.78+.18*Math.abs(q.x-p.x)/Math.max(.001,Math.hypot(q.x-p.x,q.y-p.y))});});}
 function rect(r,a,b,c,d,z0,z1,color,meta){const P=(x,y)=>({x:r.ax+r.ux*x-r.uy*y,y:r.ay+r.uy*x+r.ux*y});box([P(a,c),P(b,c),P(b,d),P(a,d)],z0,z1,color,meta);}

 function openings(r){return r.items.flatMap(it=>G.elemanlar.filter(e=>e.segId===it.seg.id).map(e=>{const a=it.rev?it.off+it.L-e.t*it.L-e.en:it.off+e.t*it.L,z=e.tip_==='kapi'?0:210-e.yuk;return {e,a,b:a+e.en,z,top:z+e.yuk};}));}
 for(const r of A.runs){const holes=openings(r),models=[];
  for(const o of holes){if(o.e.tip_!=='pencere'||Math.abs(o.e.en-160)>.01||Math.abs(o.e.yuk-120)>.01||!window.WindowSTL)continue;
   const a=(o.a+o.b)/2-83,b=a+166;
   if(height!==250||r.slots.some(p=>p.b>a&&p.a<b&&p.k!==10)||!r.slots.length||a<r.slots[0].a-.5||b>r.slots[r.slots.length-1].b+.5||holes.some(q=>q!==o&&q.b>a&&q.a<b)){
    warnings.add('160×120 STL için 250 cm yüksekliğinde 10’luk duvar ve çakışmasız 166 cm pano alanı gerekir; bu açıklık temsilî gösterilir.');continue;
   }
   models.push({o,a,b});const mesh=WindowSTL,meta={kind:'windowSTL',partId:'opening:'+o.e.id,openingId:o.e.id,source:mesh.source,schematic:false};
   parts.push({...meta,widthMm:1660,heightMm:2500});
   for(let i=0;i<mesh.vertices.length;i+=9){const poly=[];for(let j=0;j<9;j+=3){const x=(o.a+o.b)/2+mesh.vertices[i+j]-mesh.centerX,y=mesh.vertices[i+j+1]-mesh.wallCenterY;poly.push({x:r.ax+r.ux*x-r.uy*y,y:r.ay+r.uy*x+r.ux*y,z:mesh.vertices[i+j+2]});}
    const u={x:poly[1].x-poly[0].x,y:poly[1].y-poly[0].y,z:poly[1].z-poly[0].z},v={x:poly[2].x-poly[0].x,y:poly[2].y-poly[0].y,z:poly[2].z-poly[0].z},nx=u.y*v.z-u.z*v.y,ny=u.z*v.x-u.x*v.z,nz=u.x*v.y-u.y*v.x,L=Math.hypot(nx,ny,nz);
    if(L>1e-8)surfaces.push({...meta,poly,color:'#dfdfd8',shade:.65+.35*Math.abs((nx*.3+ny*.4+nz*.866)/L)});
   }
   warnings.add('160×120 pano: gerçek STL, ölçek 1:1. STL malzeme bilgisi içermediği için renkler nötrdür.');
  }
  for(const p of r.slots){
   const core=({6:4,10:8,15:13})[p.k],cut=LoadingCore.stockWidth(p.w,Modular.cutMm(p.w))?.cutMm;
   const id='panel:'+r.owner.id+':'+p.a+':'+p.b,meta={kind:'wallPanel',partId:id,panelLabel:p.no||'',segmentId:r.owner.id};
   const schematic=core==null||!cut;if(schematic)warnings.add('Kesimi tanımsız panonun dış ölçüsü yerleşim aralığından gösterilir.');
   const w=cut?cut/10:p.b-p.a,a=(p.a+p.b-w)/2,b=a+w,t=core==null?p.k:core+1.6;
   parts.push({...meta,widthMm:cut||w*10,thicknessMm:t*10,heightMm:height*10,schematic});
   const xs=[a,b],zs=[0,height];for(const m of models){if(m.b>a&&m.a<b)xs.push(Math.max(a,m.a),Math.min(b,m.b));}for(const o of holes){if(o.b<=a||o.a>=b)continue;xs.push(Math.max(a,o.a),Math.min(b,o.b));zs.push(Math.max(0,Math.min(height,o.z)),Math.max(0,Math.min(height,o.top)));}
   xs.sort((a,b)=>a-b);zs.sort((a,b)=>a-b);
   for(let i=1;i<xs.length;i++)for(let j=1;j<zs.length;j++){const l=xs[i-1],u=xs[i],lo=zs[j-1],hi=zs[j];if(u-l<.001||hi-lo<.001||models.some(m=>(l+u)/2>m.a&&(l+u)/2<m.b)||holes.some(o=>(l+u)/2>o.a&&(l+u)/2<o.b&&(lo+hi)/2>o.z&&(lo+hi)/2<o.top))continue;
    if(core==null)rect(r,l,u,-t/2,t/2,lo,hi,'#e3e0d3',meta);else{rect(r,l,u,-core/2,core/2,lo,hi,'#d8d4bd',{...meta,layer:'eps'});rect(r,l,u,-t/2,-core/2,lo,hi,'#e3e0d3',{...meta,layer:'betopan'});rect(r,l,u,core/2,t/2,lo,hi,'#e3e0d3',{...meta,layer:'betopan'});}
   }
  }
  for(const o of holes){if(models.some(m=>m.o===o))continue;const e=o.e,door=e.tip_==='kapi',cat=OpeningCatalog.find(c=>c.id===e.catalogId),style=cat?.style||e.kapiTip,cols=cat?.cols||(['surme','cift-kanat'].includes(e.penTip)||['cift','double','double-glass','sliding'].includes(style)?2:1),meta={kind:'opening',partId:'opening:'+e.id,openingId:e.id,schematic:true};
   warnings.add('PVC/kapı kasa ve kanat kesitleri temsilî; pencere üst kotu210 cm.');
   if(o.z<0||o.top>height){warnings.add('Açıklık yüksekliği210 cm üst kotuna veya duvar yüksekliğine sığmıyor.');continue;}
   parts.push({...meta,widthMm:e.en*10,heightMm:e.yuk*10,sillMm:o.z*10,cols,type:cat?.opening||e.penTip||style});
   const f=Math.min(4,e.en/8,e.yuk/8),col='#eef0e9';
   rect(r,o.a,o.a+f,-3,3,o.z,o.top,col,meta);rect(r,o.b-f,o.b,-3,3,o.z,o.top,col,meta);rect(r,o.a,o.b,-3,3,o.top-f,o.top,col,meta);if(!door)rect(r,o.a,o.b,-3,3,o.z,o.z+f,col,meta);
   const low=o.z+(door?0:f),top=o.top-f,transom=cat?.transom?top-(top-low)*cat.transom:null;
   function mark(x0,z0,x1,z1){const dx=x1-x0,dz=z1-z0,L=Math.hypot(dx,dz);if(!L)return;for(const side of [-1,1]){const coords=[[x0-dz/L*.25,z0+dx/L*.25],[x1-dz/L*.25,z1+dx/L*.25],[x1+dz/L*.25,z1-dx/L*.25],[x0+dz/L*.25,z0-dx/L*.25]];surfaces.push({...meta,kind:'openingMark',poly:coords.map(([x,z])=>({x:r.ax+r.ux*x-r.uy*side*.5,y:r.ay+r.uy*x+r.ux*side*.5,z})),color:'#dbe6e9',shade:1});}}
   function pane(a,b,z0,z1,glass){if(b-a<=0||z1-z0<=0)return;rect(r,a,b,-.4,.4,z0,z1,glass?'#6b9da9':'#ae9680',meta);}
   for(let i=0;i<cols;i++){const a=o.a+f+(e.en-2*f)*i/cols,b=o.a+f+(e.en-2*f)*(i+1)/cols,high=transom||top;pane(a,b,low,high,!door||['pvc','al','double-glass'].includes(style));if(i)rect(r,a-f/2,a+f/2,-3,3,low,top,col,meta);
    if(!door){const active=cat?cat.active===i:e.penTip!=='sabit',tilt=cat?.opening==='tilt'||e.penTip==='vasistas',sliding=e.penTip==='surme';if(active){if(sliding){mark(a+5,(low+high)/2,b-5,(low+high)/2);mark(b-10,(low+high)/2+3,b-5,(low+high)/2);}else if(tilt){mark(a+3,low+3,(a+b)/2,high-3);mark((a+b)/2,high-3,b-3,low+3);}else{mark(a+3,low+3,b-3,(low+high)/2);mark(b-3,(low+high)/2,a+3,high-3);}}}
    if(!door&&((cat&&cat.active===i)||(!cat&&e.penTip!=='sabit'))){const x=b-f;rect(r,x,x+1,-3.6,3.6,(low+high)/2-3,(low+high)/2+3,'#56616b',meta);}
    if(door){const x=(e.hand==='sag'?a+f:b-f);rect(r,x,x+1,-3.6,3.6,95,101,'#56616b',meta);}
   }
   if(transom){rect(r,o.a+f,o.b-f,-3,3,transom-f/2,transom+f/2,col,meta);pane(o.a+f,o.b-f,transom+f/2,top,true);}
  }
 }
 for(const j of A.bag){
  const id='joint:'+(j.nid||j.run.owner.id+':'+j.pos)+':'+j.tip,meta={kind:'wallJoint',partId:id,jointType:j.tip};
  if(['H','H3','X','U'].includes(j.tip)){
 const k=parseFloat(j.k)||10,n=j.nid?getNode(j.nid):{x:j.run.ax+j.run.ux*j.pos,y:j.run.ay+j.run.uy*j.pos},r=j.run||{ax:n.x,ay:n.y,ux:1,uy:0},a=j.run?j.pos:0;
 const schematic=j.tip!=='H'||k!==10;parts.push({...meta,sheetMm:1,schematic});if(schematic)warnings.add('Üçlü H/U/dörtlü ve diğer kalınlık profilleri temsilî kesittir; büküm ölçüleri bekleniyor.');
 if(j.tip!=='U'){rect(r,a-.05,a+.05,-k/2,k/2,0,height,'#657786',meta);for(const side of [-1,1])rect(r,a-2.7,a+2.7,side*k/2-.05,side*k/2+.05,0,height,'#657786',meta);}
 if(j.tip!=='H')for(const seg of G.segs.filter(s=>s.tip!=='veranda'&&(s.n1===j.nid||s.n2===j.nid))){const v=getNode(seg.n1===j.nid?seg.n2:seg.n1),L=Math.hypot(v.x-n.x,v.y-n.y);if(!L)continue;const arm={ax:n.x,ay:n.y,ux:(v.x-n.x)/L,uy:(v.y-n.y)/L};if(j.run&&Math.abs(arm.ux*r.uy-arm.uy*r.ux)<.01)continue;const start=j.uc?0:k/2;rect(arm,start,start+.1,-seg.k/2,seg.k/2,0,height,'#657786',meta);for(const side of [-1,1])rect(arm,start,start+2.7,side*seg.k/2-.05,side*seg.k/2+.05,0,height,'#657786',meta);}
 }
  else if(j.tip==='kose'){const k=parseFloat(j.k)||10;if(k!==10)warnings.add('6/15lik köşe kesiti nominal ölçüye göre temsilîdir.');const q=pfKoseRect(j.nid,k),r={ax:q.x,ay:q.y,ux:1,uy:0};parts.push({...meta,sheetMm:1,rect:q});for(const [a,b,c,d] of [[0,q.w,0,.1],[0,q.w,q.h-.1,q.h],[0,.1,0,q.h],[q.w-.1,q.w,0,q.h]])rect(r,a,b,c,d,0,height,'#657786',meta);
   const n=getNode(j.nid),dirs=G.segs.filter(s=>s.tip!=='veranda'&&(s.n1===j.nid||s.n2===j.nid)).map(s=>{const v=getNode(s.n1===j.nid?s.n2:s.n1),L=Math.hypot(v.x-n.x,v.y-n.y);return {x:(v.x-n.x)/L,y:(v.y-n.y)/L}});
   for(const v of dirs){const horizontal=Math.abs(v.x)>.9,longitudinal=horizontal?q.w<q.h:q.h<q.w,len=longitudinal?7:3;
    if(horizontal){const x=v.x>0?q.w:0;for(const y of [0,q.h-.1])rect(r,Math.min(x,x+v.x*len),Math.max(x,x+v.x*len),y,y+.1,0,height,'#657786',meta);}
    else{const y=v.y>0?q.h:0;for(const x of [0,q.w-.1])rect(r,x,x+.1,Math.min(y,y+v.y*len),Math.max(y,y+v.y*len),0,height,'#657786',meta);}
   }
  }else warnings.add('Üçlü H, U ve diğer kalınlıkların profil geometrisi henüz detaylandırılmadı.');
 }
 return {surfaces,parts,warnings:[...warnings]};
}
window.Wall3D={build};
})();
