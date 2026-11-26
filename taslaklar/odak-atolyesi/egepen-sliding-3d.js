/* Extrude Dograma Atolyesi catalogue rings with its original mitre convention. */
(function(){
 'use strict';const cache=new Map();
 function build(width,height,door){
  const key=[width,height,door].join(':');if(cache.has(key))return cache.get(key);
  const d=EgepenSlidingSource.design(width,height,door),faces=[],members=[];
  function box(p){const {x,z,w,h,y,depth}=p,v=[[x,y,z],[x+w,y,z],[x+w,y,z+h],[x,y,z+h]],front=v.map(v=>({x:v[0],y:v[1],z:v[2]})),back=front.map(v=>({...v,y:v.y+depth}));faces.push({poly:front,mat:p.mat,code:p.name},{poly:back,mat:p.mat,code:p.name});for(let i=0;i<4;i++){const j=(i+1)%4;faces.push({poly:[front[i],front[j],back[j],back[i]],mat:p.mat,code:p.name});}}
  for(const p of d.parts){
   if(p.contour){
    const radial=p.contour[0].map(v=>v[0]),min=Math.min(...radial),max=Math.max(...radial);
    for(const side of p.sides||[0,1,2,3]){
     const corner=(i,[a,b])=>{const base=p.squareFoot?0:a;return[{x:a,y:b,z:base},{x:p.w-a,y:b,z:base},{x:p.w-a,y:b,z:p.h-a},{x:a,y:b,z:p.h-a}][i];};
     for(const loop of p.contour){const start=loop.map(v=>corner(side,v)),end=loop.map(v=>corner((side+1)%4,v));for(let i=0;i<loop.length;i++){const j=(i+1)%loop.length;faces.push({poly:[start[i],start[j],end[j],end[i]].map(v=>({x:v.x+p.x,y:v.y,z:v.z+p.z})),mat:p.mat,code:p.name,owner:p.owner});}}
     const length=side%2?p.h:p.w;members.push({owner:p.owner,code:p.name,side:['Alt','Sağ','Üst','Sol'][side],longMm:Math.round((length-2*min)*1000)/1000,shortMm:Math.round((length-2*max)*1000)/1000,angle:45});
    }
   }else if(p.face){const f=p.face,b=p.bottom;box({...p,w:f});box({...p,x:p.x+p.w-f,w:f});box({...p,x:p.x+f,w:p.w-2*f,h:b});box({...p,x:p.x+f,z:p.z+p.h-f,w:p.w-2*f,h:f});}
   else box(p);
  }
  const result={faces,members,assembly:d,source:'Doğrama Atölyesi / Egepen Sürme',codes:d.profileCodes};if(cache.size>50)cache.clear();cache.set(key,result);return result;
 }
 function append({o,r,surfaces,parts,warnings}){
  const e=o.e;let model;try{model=build(e.en*10,e.yuk*10,e.tip_==='kapi');}catch(err){warnings?.add('Egepen sürme: '+err.message+' Temsilî gösterim kullanılıyor.');return false;}
  const center=(o.a+o.b)/2,mid={x:r.ax+r.ux*center,y:r.ay+r.uy*center},rooms=(G.rooms||[]).filter(q=>q.tip!=='veranda').map(q=>(q.nodeIds||[]).map(getNode)).filter(q=>q.length>=3&&q.every(Boolean));
  const inside=side=>rooms.some(poly=>ptInPolygon(mid.x-r.uy*side*6,mid.y+r.ux*side*6,poly)),plus=inside(1),minus=inside(-1),outward=plus!==minus?(plus?-1:1):1;
  const color=window.ProjectSpecs?.windowHex()||'#ffffff',meta={kind:'opening',partId:'opening:'+e.id,openingId:e.id,system:'egepen-surme',schematic:false,catalogueProfiles:true,source:model.source};
  // The 74 mm frame is centered in the host wall; +Y in the source faces outside.
  for(const face of model.faces){const poly=face.poly.map(v=>{const x=o.a+v.x/10,y=(v.y-37)/10*outward;return{x:r.ax+r.ux*x-r.uy*y,y:r.ay+r.uy*x+r.ux*y,z:o.z+v.z/10};});surfaces.push({...meta,poly,profileCode:face.code,material:face.mat==='finish'?'pvc':face.mat,color:face.mat==='glass'?'#728083':face.mat==='metal'?'#707d83':face.mat==='seal'?'#333b3e':color,alpha:face.mat==='glass'?.32:1});}
  parts.push({...meta,widthMm:e.en*10,heightMm:e.yuk*10,tracks:2,profileCodes:model.codes,glassMm:24,hardwareComplete:false});return true;
 }
 window.EgepenSliding3D={build,append};
})();
