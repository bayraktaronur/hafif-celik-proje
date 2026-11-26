/* Finished underside only. RoofCore and all manufacturing lengths stay intact. */
(function(){
 function build(m,zones,C){const out=[];
  const ccw=poly=>poly.reduce((n,p,i)=>{const q=poly[(i+1)%poly.length];return n+p.x*q.y-q.x*p.y;},0)<0?poly.slice().reverse():poly;
  function subtract(poly,cutter){if(!C.intersect(poly,cutter).length)return [poly];let inside=poly;const parts=[];for(let i=0;i<cutter.length&&inside.length;i++){const p=cutter[i],q=cutter[(i+1)%cutter.length],a=p.y-q.y,b=q.x-p.x,c=q.y*p.x-q.x*p.y;const outside=C.clip(inside,-a,-b,-c);if(outside.length)parts.push(outside);inside=C.clip(inside,a,b,c);}return parts;}
  for(const face of m.faces){const z=zones.find(z=>z.id===face.zoneId);if(!z||z.parapet)continue;
   const supports=zones.filter(other=>other.group===z.group).map(other=>ccw(other.childJoin?.support||C.basePolygon(other.attachment?.base||other).map(p=>C.transform(other.attachment?.base||other,p))));
   let pieces=[ccw(face.poly)];for(const support of supports.flatMap(p=>C.triangulate(p)))pieces=pieces.flatMap(p=>subtract(p,support));
   for(const poly of pieces){if(C.area(poly)<.001)continue;out.push({kind:'soffit',zone:z.id,mounted:true,poly:poly.map(p=>({...p,z:['besik','kirma'].includes(z.type)&&z.datum==='trim'?(z.wallTop??z.h):C.height(face,p)-(z.fasciaDepth??12)})),color:'#d8dedc',shade:.88});}
  }return out;
 }
 // Continue installed covering beneath an adjacent overhang. These patches
 // belong to the visual assembly only; cut lists retain their original faces.
 function roofFaces(m,zones,C){
  const result=m.faces.slice();
  function subtract(poly,cutter){if(!C.intersect(poly,cutter).length)return [poly];let inside=poly;const out=[];for(let i=0;i<cutter.length&&inside.length;i++){const p=cutter[i],q=cutter[(i+1)%cutter.length],a=p.y-q.y,b=q.x-p.x,c=q.y*p.x-q.x*p.y;const part=C.clip(inside,-a,-b,-c);if(part.length)out.push(part);inside=C.clip(inside,a,b,c);}return out;}
  for(const z of zones){
   if(z.type!=='besik'||z.outline||z.childJoin||z.attachment||z.parapet)continue;
   if(!zones.some(o=>o.id!==z.id&&o.group===z.group))continue;
   for(const raw of C.zoneFaces(z)){
    let patches=[raw.poly];
    for(const face of m.faces.filter(f=>f.zoneId===z.id))patches=patches.flatMap(p=>subtract(p,face.poly));
    for(const poly of patches)if(C.area(poly)>.001)result.push({...raw,poly,mountedContinuation:true});
   }
  }
  return result;
 }
 window.MountedSoffit={build,roofFaces};
})();
