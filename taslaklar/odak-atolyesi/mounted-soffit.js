/* Finished underside only. RoofCore and all manufacturing lengths stay intact. */
(function(){
 function build(m,zones,C){const out=[];
  const ccw=poly=>poly.reduce((n,p,i)=>{const q=poly[(i+1)%poly.length];return n+p.x*q.y-q.x*p.y;},0)<0?poly.slice().reverse():poly;
  function subtract(poly,cutter){if(!C.intersect(poly,cutter).length)return [poly];let inside=poly;const parts=[];for(let i=0;i<cutter.length&&inside.length;i++){const p=cutter[i],q=cutter[(i+1)%cutter.length],a=p.y-q.y,b=q.x-p.x,c=q.y*p.x-q.x*p.y;const outside=C.clip(inside,-a,-b,-c);if(outside.length)parts.push(outside);inside=C.clip(inside,a,b,c);}return parts;}
  for(const face of m.faces){const z=zones.find(z=>z.id===face.zoneId);if(!z||z.parapet)continue;
   const supports=zones.filter(other=>other.group===z.group).map(other=>ccw(other.childJoin?.support||C.basePolygon(other.attachment?.base||other).map(p=>C.transform(other.attachment?.base||other,p))));
   let pieces=[ccw(face.poly)];for(const support of supports.flatMap(p=>C.triangulate(p)))pieces=pieces.flatMap(p=>subtract(p,support));
   for(const poly of pieces){if(C.area(poly)<.001)continue;out.push({kind:'soffit',zone:z.id,mounted:true,poly:poly.map(p=>({...p,z:z.type==='kirma'&&z.datum==='trim'?z.h:C.height(face,p)-(z.fasciaDepth??12)})),color:'#d8dedc',shade:.88});}
  }return out;
 }window.MountedSoffit={build};
})();
