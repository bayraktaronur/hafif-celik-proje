/* Finished underside only. RoofCore and all manufacturing lengths stay intact. */
(function(){
 function build(m,zones,C){const out=[];
  const ccw=poly=>poly.reduce((n,p,i)=>{const q=poly[(i+1)%poly.length];return n+p.x*q.y-q.x*p.y;},0)<0?poly.slice().reverse():poly;
  function subtract(poly,cutter){if(!C.intersect(poly,cutter).length)return [poly];let inside=poly;const parts=[];for(let i=0;i<cutter.length&&inside.length;i++){const p=cutter[i],q=cutter[(i+1)%cutter.length],a=p.y-q.y,b=q.x-p.x,c=q.y*p.x-q.x*p.y;const outside=C.clip(inside,-a,-b,-c);if(outside.length)parts.push(outside);inside=C.clip(inside,a,b,c);}return parts;}
  for(const face of roofFaces(m,zones,C)){const z=zones.find(z=>z.id===face.zoneId);if(!z||z.parapet)continue;
   const supports=zones.filter(other=>other.id===z.id).map(other=>ccw(other.childJoin?.support||C.basePolygon(other.attachment?.base||other).map(p=>C.transform(other.attachment?.base||other,p))));
   let pieces=[ccw(face.poly)];for(const support of supports.flatMap(p=>C.triangulate(p)))pieces=pieces.flatMap(p=>subtract(p,support));
   const bands=[];
   for(const poly of pieces){
    if(z.type==='besik'&&!z.outline&&!z.childJoin&&!z.attachment){
     const t=z.angle*Math.PI/180,a=Math.cos(t),b=Math.sin(t),c=-a*z.x-b*z.y;
     bands.push({poly:C.clip(C.clip(poly,a,b,c),-a,-b,z.w-c),gable:false});
     bands.push({poly:C.clip(poly,-a,-b,-c),gable:true},{poly:C.clip(poly,a,b,c-z.w),gable:true});
    }else bands.push({poly,gable:false});
   }
   for(const {poly,gable} of bands){if(C.area(poly)<.001)continue;
    const flat=!gable&&['besik','kirma'].includes(z.type)&&z.datum==='trim',under=flat?{a:0,b:0,c:z.wallTop??z.h}:{...face,c:face.c-(z.fasciaDepth??12)};
    let visible=[poly];
    // A lower neighbouring roof must not erase the upper gable return.
    for(const other of zones.filter(o=>o.id!==z.id&&o.group===z.group)){
     const support=ccw(other.childJoin?.support||C.basePolygon(other.attachment?.base||other).map(p=>C.transform(other.attachment?.base||other,p)));
     for(const cover of C.zoneFaces(other))for(const triangle of C.triangulate(support)){
      const cutter=C.clip(C.intersect(ccw(cover.poly),ccw(triangle)),cover.a-under.a,cover.b-under.b,cover.c-under.c-.01);
      if(cutter.length)visible=visible.flatMap(p=>subtract(p,cutter));
     }
    }
    for(const p of visible)if(C.area(p)>.001)out.push({kind:gable?'vergeBottom':'soffit',zone:z.id,mounted:true,poly:p.map(v=>({...v,z:C.height(under,v)})),color:'#d8dedc',shade:.88});
   }
  }
  // Close the vertical wedge where a horizontal eave meets a sloping gable.
  const surfaces=out.slice(),joins=new Set();
  for(const a of surfaces.filter(f=>f.kind==='soffit'))for(const b of surfaces.filter(f=>f.kind==='vergeBottom'&&f.zone===a.zone)){
   for(let i=0;i<a.poly.length;i++)for(let j=0;j<b.poly.length;j++){
    const p=a.poly[i],q=a.poly[(i+1)%a.poly.length],r=b.poly[j],t=b.poly[(j+1)%b.poly.length],dx=q.x-p.x,dy=q.y-p.y,L=Math.hypot(dx,dy);if(L<.001)continue;
    if(Math.abs(dx*(r.y-p.y)-dy*(r.x-p.x))>.001*L||Math.abs(dx*(t.y-p.y)-dy*(t.x-p.x))>.001*L)continue;
    const u=((r.x-p.x)*dx+(r.y-p.y)*dy)/(L*L),v=((t.x-p.x)*dx+(t.y-p.y)*dy)/(L*L),lo=Math.max(0,Math.min(u,v)),hi=Math.min(1,Math.max(u,v));if(hi-lo<.00001||Math.abs(u-v)<.00001)continue;
    const A=f=>({x:p.x+dx*f,y:p.y+dy*f,z:p.z+(q.z-p.z)*f}),B=f=>({...A(f),z:r.z+(t.z-r.z)*(f-u)/(v-u)}),poly=[A(lo),A(hi),B(hi),B(lo)];if(Math.max(Math.abs(poly[0].z-poly[3].z),Math.abs(poly[1].z-poly[2].z))<.01)continue;
    const key=JSON.stringify(poly.map(v=>[v.x,v.y,v.z].map(n=>Math.round(n*1000))).sort());if(joins.has(key))continue;joins.add(key);out.push({kind:'soffitCorner',zone:a.zone,mounted:true,poly,color:'#d8dedc',shade:.88});
   }
  }
return out;
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
