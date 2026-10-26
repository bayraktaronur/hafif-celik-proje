/* Union of concrete prisms rooted at Z=0. Only the exposed upper envelope is built. */
(function(root){
 'use strict';
 const EPS=1e-7,sub=(a,b)=>({x:a.x-b.x,y:a.y-b.y}),cross=(a,b)=>a.x*b.y-a.y*b.x,lerp=(a,b,t)=>({x:a.x+(b.x-a.x)*t,y:a.y+(b.y-a.y)*t}),key=p=>Math.round(p.x*1e6)+','+Math.round(p.y*1e6);
 const box=p=>({x:Math.min(...p.map(q=>q.x)),y:Math.min(...p.map(q=>q.y)),X:Math.max(...p.map(q=>q.x)),Y:Math.max(...p.map(q=>q.y))});
 const touching=(a,b)=>a.x<=b.X+EPS&&a.X>=b.x-EPS&&a.y<=b.Y+EPS&&a.Y>=b.y-EPS;
 function subtract(poly,cutter){const C=root.RoofCore;if(!touching(box(poly),box(cutter))||C.area(C.intersect(poly,cutter))<EPS)return [poly];let inner=poly;const out=[];for(let i=0;i<cutter.length&&inner.length;i++){const p=cutter[i],q=cutter[(i+1)%cutter.length],a=p.y-q.y,b=q.x-p.x,c=q.y*p.x-q.x*p.y,part=C.clip(inner,-a,-b,-c);if(part.length)out.push(part);inner=C.clip(inner,a,b,c);}return out;}
 function build(parts){
  const C=root.RoofCore,sorted=parts.map((p,i)=>({...p,index:i,bounds:box(p.poly)})).sort((a,b)=>b.height-a.height||a.index-b.index),patches=[],cutters=[];
  for(const part of sorted){const convex=C.triangulate(part.poly);let visible=convex;for(const cut of cutters){if(!touching(part.bounds,cut.bounds))continue;visible=visible.flatMap(p=>subtract(p,cut.poly));if(!visible.length)break;}for(const poly of visible)patches.push({id:part.id,kind:part.kind,height:part.height,poly});for(const poly of convex)cutters.push({poly,bounds:box(poly)});}
  const heightAt=p=>{for(const part of sorted)if(p.x>=part.bounds.x-EPS&&p.x<=part.bounds.X+EPS&&p.y>=part.bounds.y-EPS&&p.y<=part.bounds.Y+EPS&&C.pointIn(part.poly,p))return part.height;return 0;};
  const edges=parts.flatMap(part=>part.poly.map((a,i)=>{const b=part.poly[(i+1)%part.poly.length];return {a,b,cuts:[0,1],bounds:box([a,b])};}));
  for(let i=0;i<edges.length;i++)for(let j=i+1;j<edges.length;j++){
   const e=edges[i],f=edges[j];if(!touching(e.bounds,f.bounds))continue;const u=sub(e.b,e.a),v=sub(f.b,f.a),w=sub(f.a,e.a),det=cross(u,v);
   if(Math.abs(det)>EPS){const t=cross(w,v)/det,s=cross(w,u)/det;if(t>=-EPS&&t<=1+EPS&&s>=-EPS&&s<=1+EPS){e.cuts.push(Math.max(0,Math.min(1,t)));f.cuts.push(Math.max(0,Math.min(1,s)));}}
   else if(Math.abs(cross(w,u))<EPS){for(const [a,b] of [[e,f],[f,e]]){const d=sub(a.b,a.a),ll=d.x*d.x+d.y*d.y;if(ll<EPS)continue;for(const p of [b.a,b.b]){const t=((p.x-a.a.x)*d.x+(p.y-a.a.y)*d.y)/ll;if(t>EPS&&t<1-EPS)a.cuts.push(t);}}}
  }
  const sides=new Map();
  for(const e of edges){const ts=e.cuts.sort((a,b)=>a-b).filter((t,i,all)=>!i||t-all[i-1]>EPS);for(let i=1;i<ts.length;i++){
   let a=lerp(e.a,e.b,ts[i-1]),b=lerp(e.a,e.b,ts[i]);const len=Math.hypot(b.x-a.x,b.y-a.y);if(len<EPS)continue;const m=lerp(a,b,.5),d=Math.min(.0001,len/100),nx=-(b.y-a.y)/len*d,ny=(b.x-a.x)/len*d;let high=heightAt({x:m.x+nx,y:m.y+ny}),low=heightAt({x:m.x-nx,y:m.y-ny});if(Math.abs(high-low)<EPS)continue;if(high<low){[a,b]=[b,a];[high,low]=[low,high];}sides.set(key(a)+'>'+key(b),{a,b,low,high});
  }}
  const surfaces=[],lines=new Map(),verticals=new Map(),line=(p,q)=>{const a=key(p)+','+Math.round(p.z*1e6),b=key(q)+','+Math.round(q.z*1e6);lines.set(a<b?a+'>'+b:b+'>'+a,{p,q,color:'#7b858e',foundationEdge:true});};
  for(const p of patches){const meta={kind:p.kind,foundationId:p.id,foundationSurface:true};surfaces.push({...meta,poly:p.poly.map(q=>({...q,z:p.height})),color:'#d3d5d8'},{...meta,poly:p.poly.slice().reverse().map(q=>({...q,z:0})),color:'#adb2b8'});}
  for(const s of sides.values()){const {a,b,low,high}=s;surfaces.push({kind:'foundationSide',foundationSurface:true,poly:[{...a,z:low},{...b,z:low},{...b,z:high},{...a,z:high}],color:'#adb2b8'});for(const z of [low,high])line({...a,z},{...b,z});for(const p of [a,b]){const k=key(p);if(!verticals.has(k))verticals.set(k,{p,sides:[]});verticals.get(k).sides.push(s);}}
  // Remove coplanar subdivisions; retain actual corners and changes of step height.
  for(const {p,sides:incident} of verticals.values()){const zs=[...new Set(incident.flatMap(s=>[s.low,s.high]))].sort((a,b)=>a-b);for(let i=1;i<zs.length;i++){const mid=(zs[i-1]+zs[i])/2,active=incident.filter(s=>s.low<mid&&s.high>mid);if(active.length===2){const u=sub(active[0].b,active[0].a),v=sub(active[1].b,active[1].a);if(Math.abs(cross(u,v))<EPS)continue;}if(active.length)line({...p,z:zs[i-1]},{...p,z:zs[i]});}}
  return {patches,sides:[...sides.values()],surfaces,edges:[...lines.values()]};
 }
 root.FoundationSolid={build};
})(typeof window==='undefined'?globalThis:window);
