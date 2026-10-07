/* Plan-derived fabrication preview. Coordinates are centimetres. */
(function(){
'use strict';
function build(){
 const surfaces=[],parts=[],warnings=new Set(),height=Number(G.opt.h)||280,A=pfAnaliz();
 function box(poly,z0,z1,color,meta){if(z1<=z0)return;surfaces.push({...meta,poly:poly.map(p=>({...p,z:z1})),color,shade:1});poly.forEach((p,i)=>{const q=poly[(i+1)%poly.length];surfaces.push({...meta,poly:[{...p,z:z0},{...q,z:z0},{...q,z:z1},{...p,z:z1}],color,shade:.78+.18*Math.abs(q.x-p.x)/Math.max(.001,Math.hypot(q.x-p.x,q.y-p.y))});});}
 function rect(r,a,b,c,d,z0,z1,color,meta){const P=(x,y)=>({x:r.ax+r.ux*x-r.uy*y,y:r.ay+r.uy*x+r.ux*y});box([P(a,c),P(b,c),P(b,d),P(a,d)],z0,z1,color,meta);}
 for(const r of A.runs)for(const p of r.slots){
  const core=({6:4,10:8,15:13})[p.k],cut=LoadingCore.stockWidth(p.w,Modular.cutMm(p.w))?.cutMm;
  const id='panel:'+r.owner.id+':'+p.a+':'+p.b,meta={kind:'wallPanel',partId:id,panelLabel:p.no||'',segmentId:r.owner.id};
  if(core==null||p.acik||!cut){warnings.add('Açıklıklı veya kesimi tanımsız panolar şematik; PVC/kapı detayları bekleniyor.');rect(r,p.a,p.b,-p.k/2,p.k/2,0,height,'#758894',{...meta,schematic:true});parts.push({...meta,schematic:true});continue;}
  const w=cut/10,a=(p.a+p.b-w)/2,b=a+w,t=core+1.6;
  parts.push({...meta,widthMm:cut,thicknessMm:t*10,heightMm:height*10});
  rect(r,a,b,-core/2,core/2,0,height,'#d8d4bd',{...meta,layer:'eps'});
  rect(r,a,b,-t/2,-core/2,0,height,'#e3e0d3',{...meta,layer:'betopan'});
  rect(r,a,b,core/2,t/2,0,height,'#e3e0d3',{...meta,layer:'betopan'});
 }
 for(const j of A.bag){
  const id='joint:'+(j.nid||j.run.owner.id+':'+j.pos)+':'+j.tip,meta={kind:'wallJoint',partId:id,jointType:j.tip};
  if(j.tip==='H'&&+j.k===10){const r=j.run,a=j.pos;parts.push({...meta,sheetMm:1});rect(r,a-.05,a+.05,-5,5,0,height,'#657786',meta);for(const side of [-1,1])rect(r,a-2.7,a+2.7,side*5-.05,side*5+.05,0,height,'#657786',meta);}
  else if(j.tip==='kose'&&+j.k===10){const q=pfKoseRect(j.nid,10),r={ax:q.x,ay:q.y,ux:1,uy:0};parts.push({...meta,sheetMm:1,rect:q});for(const [a,b,c,d] of [[0,q.w,0,.1],[0,q.w,q.h-.1,q.h],[0,.1,0,q.h],[q.w-.1,q.w,0,q.h]])rect(r,a,b,c,d,0,height,'#657786',meta);
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
