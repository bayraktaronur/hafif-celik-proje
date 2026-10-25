/* Reference images are visual aids, never walls, snap targets or bill items. Units: cm. */
(function(root){
 'use strict';
 const MAX_TOTAL=2*1024*1024,MAX_COUNT=4;
 function validate(items){
  if(items===undefined)return;
  const fail=()=>{throw Error('Referans görsel verisi geçersiz veya çok büyük.');};
  if(!Array.isArray(items)||items.length>MAX_COUNT)fail();
  let total=0;const ids=new Set();
  for(const r of items){
   if(!r||typeof r.id!=='string'||r.id.length>80||ids.has(r.id)||typeof r.name!=='string'||r.name.length>180)fail();ids.add(r.id);
   if(!Array.isArray(r.chunks)||r.chunks.length>270||r.chunks.some(c=>typeof c!=='string'||c.length>8000))fail();
   const data=r.chunks.join('');total+=data.length;
   if(!/^data:image\/(png|jpeg);base64,[A-Za-z0-9+/]+=*$/.test(data)||total>MAX_TOTAL)fail();
   for(const k of ['x','y','w','h','angle','opacity'])if(!Number.isFinite(r[k]))fail();
   if(Math.abs(r.x)>1e7||Math.abs(r.y)>1e7||r.w<1||r.h<1||r.w>1e6||r.h>1e6||Math.abs(r.angle)>360||r.opacity<.05||r.opacity>1)fail();
   if(!['scene','window'].includes(r.mode)||typeof r.visible!=='boolean'||typeof r.locked!=='boolean')fail();
  }
 }
 function corners(r){const a=r.angle*Math.PI/180,c=Math.cos(a),s=Math.sin(a);return [[0,0],[r.w,0],[r.w,r.h],[0,r.h]].map(([x,y])=>({x:r.x+x*c-y*s,y:r.y+x*s+y*c}));}
 function local(r,p){const a=-r.angle*Math.PI/180,x=p.x-r.x,y=p.y-r.y;return{x:x*Math.cos(a)-y*Math.sin(a),y:x*Math.sin(a)+y*Math.cos(a)};}
 function calibrate(r,a,b,cm){const measured=Math.hypot(b.x-a.x,b.y-a.y);if(measured<.001||!Number.isFinite(cm)||cm<=0)throw Error('İki ayrı nokta ve sıfırdan büyük bir ölçü seçin.');const f=cm/measured;return{...r,x:a.x+(r.x-a.x)*f,y:a.y+(r.y-a.y)*f,w:r.w*f,h:r.h*f};}
 const api={validate,corners,local,calibrate,MAX_TOTAL,MAX_COUNT};root.ReferenceImageData=api;if(typeof module==='object')module.exports=api;
})(globalThis);
