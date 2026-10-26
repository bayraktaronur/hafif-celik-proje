/* Per-project viewpoints. Pan is stored as a fraction of the viewport. */
(function(){
 'use strict';
 function validate(list){
  if(list==null)return;
  if(!Array.isArray(list)||list.length>24)throw Error('En fazla 24 kayıtlı bakış kullanılabilir.');
  const ids=new Set();
  for(const v of list){
   if(!v||typeof v.id!=='string'||!v.id||v.id.length>80||ids.has(v.id)||typeof v.name!=='string'||!v.name.trim()||v.name.length>60)throw Error('Kayıtlı bakış adı veya kimliği geçersiz.');
   ids.add(v.id);const c=v.camera;
   if(!c||!['parallel','perspective'].includes(c.projection))throw Error('Kayıtlı bakış izdüşümü geçersiz.');
   for(const [k,lo,hi]of [['yaw',-3600,3600],['pitch',-89,90],['zoom',.15,12],['panX',-100,100],['panY',-100,100]])if(!Number.isFinite(c[k])||c[k]<lo||c[k]>hi)throw Error('Kayıtlı bakış kamera değeri geçersiz: '+k);
  }
 }
 function capture(name){
  const c=RoofStudio.getCamera(),el=document.getElementById('roofCanvas'),v={id:crypto.randomUUID(),name:name.trim(),camera:{...c,panX:c.panX/Math.max(1,el.clientWidth),panY:c.panY/Math.max(1,el.clientHeight)}};
  validate([v]);return v;
 }
 function restore(v){validate([v]);const el=document.getElementById('roofCanvas');RoofStudio.setCamera({...v.camera,panX:v.camera.panX*el.clientWidth,panY:v.camera.panY*el.clientHeight});}
 window.CameraViews={validate,capture,restore};
})();
