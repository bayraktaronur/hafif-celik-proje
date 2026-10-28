/* Draft only: proximity magnets, never containment constraints. All distances cm. */
(()=>{
 'use strict';
 const dot=(a,b)=>a.x*b.x+a.y*b.y,sub=(a,b)=>({x:a.x-b.x,y:a.y-b.y}),at=(o,u,t,v,n)=>({x:o.x+u.x*t+v.x*n,y:o.y+u.y*t+v.y*n});
 const tolerance=()=>Math.min(12,10/sc());
 const original=Kitchen.snapFixture;
 Kitchen.snapFixture=function(f,p){
  if(f.kind!=='fridge')return original(f,p);
  const tol=tolerance();let best=null;
  function offer(q,angle){const d=Math.hypot(q.x-p.x,q.y-p.y);if(d<=tol&&(!best||d<best.d))best={...q,angle,d};}
  for(const c of G.counters||[]){const cp=CounterEditor.params(c);
   for(const [i,r] of c.runs.entries()){
    const a=r.angle*Math.PI/180,u={x:Math.cos(a),y:Math.sin(a)},v={x:-u.y,y:u.x};
    const ref=i===0?sub(r,{x:(c.points[0].x+c.points[1].x)/2,y:(c.points[0].y+c.points[1].y)/2}):sub(c.runs[0],r);
    if(dot(ref,v)<0){v.x=-v.x;v.y=-v.y;}
    let t=dot(sub(p,r),u);const n=(f.d-cp.D)/2;
    if(Math.abs(t)>r.length/2+f.w/2+tol)continue;
    // Both sides of either end: inset (inside) or adjacent (outside).
    const targets=[-r.length/2-f.w/2,-r.length/2+f.w/2,r.length/2-f.w/2,r.length/2+f.w/2];
    const target=targets.sort((a,b)=>Math.abs(a-t)-Math.abs(b-t))[0];
    if(Math.abs(target-t)<=tol)t=target;
    offer(at(r,u,t,v,n),(Math.atan2(-v.x,v.y)*180/Math.PI+360)%360);
   }
  }
  if(best)return {x:best.x,y:best.y,angle:best.angle};
  // Face references work even after the appliance leaves the countertop.
  for(const s of G.segs){if(s.tip==='veranda')continue;const a=getNode(s.n1),b=getNode(s.n2),L=Math.hypot(b.x-a.x,b.y-a.y);if(!L)continue;
   const u={x:(b.x-a.x)/L,y:(b.y-a.y)/L},v={x:-u.y,y:u.x},t=dot(sub(p,a),u),n=dot(sub(p,a),v),side=n>=0?1:-1;
   if(t<0||t>L)continue;
   offer(at(a,u,t,v,side*(s.k/2+f.d/2)),(Math.atan2(-v.x*side,v.y*side)*180/Math.PI+360)%360);
  }
  return best?{x:best.x,y:best.y,angle:best.angle}:p;
 };
 function length(c,key,value,free=false){
  if(free)return value;
  const p=CounterEditor.params(c),axis=key==='L'?p.u:p.v,h=CounterEditor.handles(c).find(h=>h.key===key),sign=key==='L'&&p.side==='end'?-1:1,base=p[key],normal={x:-axis.y,y:axis.x},tol=tolerance();let best=value,delta=tol;
  const q=at(h,axis,sign*(value-base),normal,0);
  for(const s of G.segs){if(s.tip==='veranda')continue;const a=getNode(s.n1),b=getNode(s.n2),L=Math.hypot(b.x-a.x,b.y-a.y);if(!L)continue;const u={x:(b.x-a.x)/L,y:(b.y-a.y)/L},v={x:-u.y,y:u.x};
   // Endpoint/cap references and the two actual wall faces (not centre lines).
   const endpoint=(n,id,sign)=>G.segs.filter(g=>g.tip!=='veranda'&&(g.n1===id||g.n2===id)).length===1?at(n,u,sign*s.k/2,v,0):n;
   const start=endpoint(a,s.n1,-1),end=endpoint(b,s.n2,1);
   const points=[];for(const side of [-1,1]){const A=at(start,v,side*s.k/2,u,0),B=at(end,v,side*s.k/2,u,0);points.push(A,B);const den=dot(u,normal);if(Math.abs(den)>1e-8){const t=dot(sub(q,A),normal)/den;if(t>=0&&t<=L)points.push(at(A,u,t,v,0));}}
   for(const target of points){if(Math.abs(dot(sub(target,q),normal))>p.D/2+s.k/2+tol)continue;const d=dot(sub(target,q),axis);if(Math.abs(d)<delta){delta=Math.abs(d);best=value+sign*d;}}
  }
  return best;
 }
 window.KitchenSnap={length};
})();
