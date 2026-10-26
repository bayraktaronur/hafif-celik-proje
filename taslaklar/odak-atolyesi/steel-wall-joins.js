/* Render-only light-steel corner mitres. Drawn axes, openings and quantities stay unchanged. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.SteelWallJoins=api;})(globalThis,function(){
 'use strict';
 const cross=(a,b)=>a.x*b.y-a.y*b.x;
 function build(nodes,segs){
  const map=new Map(nodes.map(n=>[n.id,n])),ends=new Map(),result=new Map();
  for(const s of segs){if(s.tip==='veranda')continue;const a=map.get(s.n1),b=map.get(s.n2);if(!a||!b)continue;const length=Math.hypot(b.x-a.x,b.y-a.y);if(length<.001)continue;
   for(const [p,q] of [[a,b],[b,a]]){const arm={id:s.id,p,u:{x:(q.x-p.x)/length,y:(q.y-p.y)/length},half:Number(s.k)/2,length};if(!ends.has(p.id))ends.set(p.id,[]);ends.get(p.id).push(arm);}
  }
  function point(arm,side){const {p,u,half}=arm,base={x:p.x-u.y*half*side,y:p.y+u.x*half*side},arms=ends.get(p.id);
   // T/X junctions already overlap inside the continuous wall. Never extend a free end.
   if(arms.length!==2)return base;const other=arms.find(a=>a!==arm),v=other.u,det=cross(u,v);if(Math.abs(det)<1e-7)return base;
   const target={x:p.x+v.y*other.half*side,y:p.y-v.x*other.half*side},t=cross({x:target.x-base.x,y:target.y-base.y},v)/det,q={x:base.x+t*u.x,y:base.y+t*u.y};
   // An acute/very short return uses a shared bevel instead of an unbounded spike.
   const limit=Math.min(4*Math.max(half,other.half),arm.length*.45,other.length*.45);
   return Math.hypot(q.x-p.x,q.y-p.y)<=limit?q:{x:(base.x+target.x)/2,y:(base.y+target.y)/2};
  }
  for(const s of segs){const a=ends.get(s.n1)?.find(a=>a.id===s.id),b=ends.get(s.n2)?.find(a=>a.id===s.id);if(a&&b)result.set(s.id,[point(a,-1),point(b,1),point(b,-1),point(a,1)]);}
  return result;
 }
 function cell(poly,r,lo,hi,length){
  function clip(poly,limit,keepAbove){const out=[],d=p=>(p.x-r.ax)*r.ux+(p.y-r.ay)*r.uy-limit;
   for(let i=0;i<poly.length;i++){const a=poly[i],b=poly[(i+1)%poly.length],da=d(a),db=d(b),ia=keepAbove?da>=-1e-8:da<=1e-8,ib=keepAbove?db>=-1e-8:db<=1e-8;if(ia)out.push(a);if(ia!==ib){const t=da/(da-db);out.push({x:a.x+t*(b.x-a.x),y:a.y+t*(b.y-a.y)});}}return out;
  }
  let out=poly;if(lo>1e-7)out=clip(out,lo,true);if(hi<length-1e-7)out=clip(out,hi,false);return out;
 }
 function exterior(surfaces){
  // Adjacent opening cells are a single solid wall, not visible panel joints.
  const faces=new Map(),hidden=new Set(),key=p=>[p.x,p.y,p.z].map(v=>Math.round(v*1e6)).join(',');
  surfaces.forEach((face,i)=>{if(!face.steelSolid)return;const k=face.poly.map(key).sort().join('|'),other=faces.get(k);if(other===undefined)faces.set(k,i);else{hidden.add(other);hidden.add(i);faces.delete(k);}});
  return surfaces.filter((_,i)=>!hidden.has(i));
 }
 return {build,cell,exterior};
});
