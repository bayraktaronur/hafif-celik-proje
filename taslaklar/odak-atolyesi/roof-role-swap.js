/* Higher perpendicular wing becomes the main roof; wall/panel geometry is untouched. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.RoofRoleSwap=api;})(globalThis,function(){
 const copy=x=>JSON.parse(JSON.stringify(x));
 const peak=(z,C)=>Math.max(...C.zoneFaces(z).flatMap(f=>f.poly.map(p=>C.height(f,p))));
 function validate(z){const p=z.roleSwap;if(!p)return;if(p.version!==1||typeof p.active!=='boolean'||typeof p.parentId!=='string'||p.parentId===z.id||!p.join||!Array.isArray(p.join.points)||p.join.points.length!==4||p.join.points.some(q=>!Number.isFinite(q.x)||!Number.isFinite(q.y))||!p.parentProduction||!p.childProduction)throw Error('Çatı rol bağlantısı geçersiz.');}
 function prepare(input,C){
  const zones=copy(input),claimed=new Set();
  for(const wing of zones){
   validate(wing);const pair=wing.roleSwap,parentId=pair?.parentId||(wing.childJoin?wing.production?.parentId:null);if(!parentId)continue;
   const parent=zones.find(z=>z.id===parentId);if(!parent)throw Error('Rol bağlantısının ana çatısı bulunamadı.');
   if(!pair&&!wing.levelControl&&!parent.levelControl)continue;
   const candidate={...copy(wing),childJoin:copy(pair?.join||wing.childJoin),production:copy(pair?.childProduction||wing.production)};delete candidate.roleSwap;
   const frame=C.connectChild(candidate,parent,{frameOnly:true}),higher=peak(frame,C)>peak(parent,C)+.01;
   if(!higher&&!pair)continue;
   if(claimed.has(parent.id))throw Error('Aynı ana çatı için birden çok yüksek yavru var; çatı bölümlerinin bağlantısını ayrı düzenleyin.');claimed.add(parent.id);
   const meta=pair||{version:1,parentId:parent.id,parentProduction:copy(parent.production||{role:'main',parentId:'',relative:0}),childProduction:copy(wing.production),join:copy(frame.childJoin),active:false};
   if(higher){
    const outline=C.basePolygon(parent),rectangular=outline.length===4&&outline.every(p=>[0,parent.w].some(v=>Math.abs(p.x-v)<.001)&&[0,parent.d].some(v=>Math.abs(p.y-v)<.001));
    if(!rectangular||!['besik','tek'].includes(parent.type)||meta.parentProduction.role==='child')throw Error('Bu rol değişimi dikdörtgen ana çatıya dik bağlanan beşik/tek eğimli yavru için kullanılabilir.');
    if(Math.abs(((frame.angle-parent.angle)%180+180)%180-90)>.01)throw Error('Ana/yavru rol değişimi için mahya doğrultuları dik olmalı.');
    const base=C.basePolygon(parent).map(p=>C.untransform(frame,C.transform(parent,p))),outer=C.footprint(parent).map(p=>C.untransform(frame,C.transform(parent,p)));
    const far=Math.max(...base.map(p=>p.x)),farEdge=Math.max(...outer.map(p=>p.x));
    if(far<=frame.w)throw Error('Yeni ana çatının devam edeceği duvar sınırı bulunamadı.');
    Object.assign(wing,frame,{w:far,roleSwap:{...meta,active:true},production:{role:'main',parentId:'',relative:0},eaves:[frame.eaves[0],Math.max(0,farEdge-far),frame.eaves[2],frame.eaves[3]]});
    delete wing.childJoin;
    parent.production={role:'child',parentId:wing.id,relative:((parent.angle-wing.angle)%180+180)%180};
   }else{
    Object.assign(wing,frame,{roleSwap:{...meta,active:false},production:copy(meta.childProduction)});parent.production=copy(meta.parentProduction);
   }
   wing.group=parent.group;
  }
  return zones;
 }
 function remove(input,id){
  const zones=copy(input),removed=zones.find(z=>z.id===id);
  if(removed?.roleSwap){const parent=zones.find(z=>z.id===removed.roleSwap.parentId);if(parent)parent.production=copy(removed.roleSwap.parentProduction);}
  for(const z of zones)if(z.roleSwap?.parentId===id&&z.roleSwap.active)delete z.roleSwap;
  return zones.filter(z=>z.id!==id);
 }
 function detached(z){const out=copy(z);delete out.roleSwap;delete out.childJoin;out.production={role:'main',parentId:'',relative:0};return out;}
 return {prepare,validate,remove,detached};
});
