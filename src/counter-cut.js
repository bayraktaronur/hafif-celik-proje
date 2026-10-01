/* Non-destructive planar subtraction of refrigerator footprints from countertops. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.CounterCut=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
 'use strict';
 const sub=(a,b)=>({x:a.x-b.x,y:a.y-b.y}),cross=(a,b)=>a.x*b.y-a.y*b.x;
 function inside(p,poly){let yes=false;for(let i=0,j=poly.length-1;i<poly.length;j=i++){const a=poly[i],b=poly[j];if((a.y>p.y)!==(b.y>p.y)&&p.x<(b.x-a.x)*(p.y-a.y)/(b.y-a.y)+a.x)yes=!yes;}return yes;}
 function footprint(f){const a=f.angle*Math.PI/180,c=Math.cos(a),s=Math.sin(a);return [[-1,-1],[1,-1],[1,1],[-1,1]].map(([x,y])=>({x:f.x+x*f.w/2*c-y*f.d/2*s,y:f.y+x*f.w/2*s+y*f.d/2*c}));}
 function difference(poly,holes){
   const occupied=p=>inside(p,poly)&&!holes.some(h=>inside(p,h));
   const edges=[poly,...holes].flatMap(p=>p.map((a,i)=>({a,b:p[(i+1)%p.length]}))),result=[],seen=new Set();
   for(const e of edges){const d=sub(e.b,e.a),len=Math.hypot(d.x,d.y);if(len<1e-8)continue;const cuts=[0,1];
     for(const o of edges){const v=sub(o.b,o.a),q=sub(o.a,e.a),den=cross(d,v);
       if(Math.abs(den)>1e-9){const t=cross(q,v)/den,u=cross(q,d)/den;if(t>0&&t<1&&u>=-1e-9&&u<=1+1e-9)cuts.push(t);}
       else if(Math.abs(cross(q,d))<1e-7){for(const p of [o.a,o.b]){const t=((p.x-e.a.x)*d.x+(p.y-e.a.y)*d.y)/(len*len);if(t>0&&t<1)cuts.push(t);}}
     }
     cuts.sort((a,b)=>a-b);for(let i=1;i<cuts.length;i++){const lo=cuts[i-1],hi=cuts[i];if((hi-lo)*len<1e-7)continue;
       const at=t=>({x:e.a.x+d.x*t,y:e.a.y+d.y*t}),m=at((lo+hi)/2),eps=Math.min(1e-5,(hi-lo)*len/10),n={x:-d.y/len*eps,y:d.x/len*eps};
       const left=occupied({x:m.x+n.x,y:m.y+n.y}),right=occupied({x:m.x-n.x,y:m.y-n.y});if(left===right)continue;
       const a=at(left?lo:hi),b=at(left?hi:lo),key=[a.x,a.y,b.x,b.y].map(v=>Math.round(v*1e7)).join(',');if(!seen.has(key)){seen.add(key);result.push({a,b});}
     }
   }
   return {edges:result,area:Math.abs(result.reduce((sum,e)=>sum+cross(e.a,e.b),0))/2,contains:occupied};
 }
 return {inside,footprint,difference};
});
