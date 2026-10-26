/* Actual supplied steel doors. Only the prototype renderer calls this adapter. */
(function(){
 'use strict';
 const colors={steelFrame:'#675c53',steelLeaf:'#8a7664',steelInset:'#b19a83',hardware:'#bcc4ca'};
 function clip(poly,bound,above){const out=[];for(let i=0;i<poly.length;i++){const p=poly[i],q=poly[(i+1)%poly.length],pin=above?p.x>=bound:p.x<=bound,qin=above?q.x>=bound:q.x<=bound;if(pin)out.push(p);if(pin!==qin){const t=(bound-p.x)/(q.x-p.x);out.push({x:bound,y:p.y+(q.y-p.y)*t,z:p.z+(q.z-p.z)*t});}}return out;}
 function append({r,holes,models,height,prefab,surfaces,parts,warnings,panelColor}){
  if(!prefab)return;
  for(const o of holes){
   const e=o.e,cat=window.OpeningCatalog?.find(c=>c.id===e.catalogId);
   if(e.tip_!=='kapi'||(cat?.style||e.style||e.kapiTip)!=='steel')continue;
   const mesh=window.SteelDoorSTLModels?.find(m=>m.height===height),reasons=[];
   if(!mesh)reasons.push('pano yüksekliği 250, 280 veya 300 cm olmalı');
   if(Number(e.en)!==90||Number(e.yuk)!==205)reasons.push('kaynak model 90/205 katalog kapısı içindir');
   const center=(o.a+o.b)/2,a=Math.max(center-62.5,Math.min(...r.slots.map(p=>p.a))),b=Math.min(center+62.5,Math.max(...r.slots.map(p=>p.b)));
   if(r.slots.some(p=>p.b>a&&p.a<b&&Number(p.k)!==10))reasons.push('kaynak pano 10 cm duvar içindir');
   if(!r.slots.length||a>center-45.645+.001||b<center+45.645-.001)reasons.push('çelik kapı kasası duvar sınırına sığmıyor');
   if(holes.some(q=>q!==o&&q.b>a&&q.a<b)||models.some(m=>m.b>a&&m.a<b))reasons.push('kapı panosu başka açıklıkla çakışıyor');
   if(reasons.length){warnings.add('Çelik kapı: '+reasons.join('; ')+'. Şematik gösteriliyor.');continue;}
   const item=r.items.find(it=>it.seg.id===e.segId),direction=item?.rev?-1:1;
   // Match the actual plan hinge, including reversed/merged wall segments and mirrored doors.
   const hinge=(kapiMen(e)==='b'?1:-1)*direction,xFlip=hinge/mesh.hingeSide;
   const mid={x:r.ax+r.ux*center,y:r.ay+r.uy*center};
   const rooms=(G.rooms||[]).filter(q=>q.tip!=='veranda').map(q=>(q.nodeIds||[]).map(getNode)).filter(q=>q.length>=3&&q.every(Boolean));
   const inside=side=>rooms.some(poly=>ptInPolygon(mid.x-r.uy*side*6,mid.y+r.ux*side*6,poly));
   const plus=inside(1),minus=inside(-1),insideSide=plus!==minus?(plus?1:-1):null;
   // Decorative face looks outside. For an unclosed wall, infer from the plan's swing side.
   const frontSide=insideSide==null?-kapiYan(e)*direction*(e.kapiYon==='dis'?-1:1):-insideSide;
   const yFlip=frontSide/mesh.frontSide;
   const meta={kind:'steelDoorSTL',partId:'opening:'+e.id,openingId:e.id,source:mesh.source,modelKey:mesh.key,
    schematic:false,sourceHeightMm:height*10,extensionMm:0,insideSide,frontSide,hingeSide:hinge};
   models.push({o,a,b});parts.push({...meta,widthMm:(b-a)*10,sourceWidthMm:mesh.width*10,heightMm:height*10,frameWidthMm:mesh.frameWidth*10,nominalWidthMm:900,nominalHeightMm:2050});
   for(let i=0;i<mesh.vertices.length;i+=9){
    const material=mesh.materials[mesh.materialIds[i/9]];
    let local=[];for(let j=0;j<9;j+=3)local.push({x:center+(mesh.vertices[i+j]-mesh.centerX)*xFlip,y:(mesh.vertices[i+j+1]-mesh.wallCenterY)*yFlip,z:mesh.vertices[i+j+2]});
    // Cut only the surrounding board at an end wall; never stretch/cut the door assembly.
    if(material==='panel')local=clip(clip(local,a,true),b,false);if(local.length<3)continue;
    const poly=local.map(p=>({x:r.ax+r.ux*p.x-r.uy*p.y,y:r.ay+r.uy*p.x+r.ux*p.y,z:p.z}));
    const u=[poly[1].x-poly[0].x,poly[1].y-poly[0].y,poly[1].z-poly[0].z],v=[poly[2].x-poly[0].x,poly[2].y-poly[0].y,poly[2].z-poly[0].z];
    const n=[u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0]],len=Math.hypot(...n);
    if(len>1e-8)surfaces.push({...meta,poly,material,color:material==='panel'?panelColor:colors[material],alpha:1,shade:Math.abs(n[2])/len>.9?1:.78+.18*Math.abs(n[1])/len});
   }
  }
 }
 window.SteelDoor3D={append};
})();
