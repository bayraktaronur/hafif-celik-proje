/* Foundation reference geometry only: never changes the wall/panel model. */
(function(root){
 'use strict';
 const EPS=1e-7,dist=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y),cross=(a,b)=>a.x*b.y-a.y*b.x;
 const sub=(a,b)=>({x:a.x-b.x,y:a.y-b.y}),lerp=(a,b,t)=>({x:a.x+(b.x-a.x)*t,y:a.y+(b.y-a.y)*t});
 const key=p=>Math.round(p.x*1e6)+','+Math.round(p.y*1e6);
 const signed=p=>p.reduce((s,a,i)=>{const b=p[(i+1)%p.length];return s+a.x*b.y-a.y*b.x;},0)/2;
 function inside(p,poly){let yes=false;for(let i=0,j=poly.length-1;i<poly.length;j=i++){const a=poly[i],b=poly[j];if((a.y>p.y)!==(b.y>p.y)&&p.x<(b.x-a.x)*(p.y-a.y)/(b.y-a.y)+a.x)yes=!yes;}return yes;}
 function rectangle(a,b,k,cap=0){const len=dist(a,b);if(len<EPS)return [];const u={x:(b.x-a.x)/len,y:(b.y-a.y)/len},n={x:-u.y,y:u.x};return [[-cap,-k/2],[len+cap,-k/2],[len+cap,k/2],[-cap,k/2]].map(([s,t])=>({x:a.x+u.x*s+n.x*t,y:a.y+u.y*s+n.y*t}));}
 function box(r){return [{x:r.x,y:r.y},{x:r.x+r.w,y:r.y},{x:r.x+r.w,y:r.y+r.h},{x:r.x,y:r.y+r.h}];}
 function projection(p,a,b){const d=sub(b,a),l=d.x*d.x+d.y*d.y,t=l?Math.max(0,Math.min(1,((p.x-a.x)*d.x+(p.y-a.y)*d.y)/l)):0;return lerp(a,b,t);}
 // Split intersecting rectangle edges, then retain only edges separating solid
 // from empty space. This includes concave returns and T junctions, not just nodes.
 function contours(polygons){
  const polys=polygons.filter(p=>p.length>=3).map(p=>signed(p)<0?p.slice().reverse():p);
  const boxes=polys.map(p=>({minX:Math.min(...p.map(q=>q.x)),maxX:Math.max(...p.map(q=>q.x)),minY:Math.min(...p.map(q=>q.y)),maxY:Math.max(...p.map(q=>q.y))}));
  const solid=p=>polys.some((q,i)=>p.x>=boxes[i].minX&&p.x<=boxes[i].maxX&&p.y>=boxes[i].minY&&p.y<=boxes[i].maxY&&inside(p,q));
  const edges=polys.flatMap(p=>p.map((a,i)=>({a,b:p[(i+1)%p.length],cuts:[0,1]})));
  for(let i=0;i<edges.length;i++)for(let j=i+1;j<edges.length;j++){
   const e=edges[i],f=edges[j],u=sub(e.b,e.a),v=sub(f.b,f.a),w=sub(f.a,e.a),det=cross(u,v);
   if(Math.abs(det)>EPS){const t=cross(w,v)/det,s=cross(w,u)/det;if(t>=-EPS&&t<=1+EPS&&s>=-EPS&&s<=1+EPS){e.cuts.push(Math.max(0,Math.min(1,t)));f.cuts.push(Math.max(0,Math.min(1,s)));}}
   else if(Math.abs(cross(w,u))<EPS){for(const [x,y] of [[e,f],[f,e]]){const d=sub(x.b,x.a),ll=d.x*d.x+d.y*d.y;if(ll<EPS)continue;for(const p of [y.a,y.b]){const t=((p.x-x.a.x)*d.x+(p.y-x.a.y)*d.y)/ll;if(t>EPS&&t<1-EPS)x.cuts.push(t);}}}
  }
  const segments=new Map();
  for(const e of edges){const ts=e.cuts.sort((a,b)=>a-b).filter((t,i,all)=>!i||t-all[i-1]>EPS);for(let i=1;i<ts.length;i++){
   let a=lerp(e.a,e.b,ts[i-1]),b=lerp(e.a,e.b,ts[i]);const len=dist(a,b);if(len<EPS)continue;const m=lerp(a,b,.5),delta=Math.min(.0001,len/100),nx=-(b.y-a.y)/len*delta,ny=(b.x-a.x)/len*delta;
   const left=solid({x:m.x+nx,y:m.y+ny}),right=solid({x:m.x-nx,y:m.y-ny});if(left===right)continue;if(!left)[a,b]=[b,a];segments.set(key(a)+'>'+key(b),{a,b});
  }}
  const remaining=new Set(segments.values()),starts=new Map();for(const e of remaining){const k=key(e.a);if(!starts.has(k))starts.set(k,[]);starts.get(k).push(e);}
  const loops=[];
  while(remaining.size){const first=remaining.values().next().value,loop=[],start=key(first.a);let e=first;
   for(let guard=0;guard<=segments.size;guard++){loop.push(e.a);remaining.delete(e);if(key(e.b)===start)break;const next=(starts.get(key(e.b))||[]).filter(q=>remaining.has(q));if(!next.length){loop.length=0;break;}
    // At a point contact follow the same solid on the left.
    const u=sub(e.b,e.a);next.sort((p,q)=>Math.atan2(cross(u,sub(q.b,q.a)),u.x*(q.b.x-q.a.x)+u.y*(q.b.y-q.a.y))-Math.atan2(cross(u,sub(p.b,p.a)),u.x*(p.b.x-p.a.x)+u.y*(p.b.y-p.a.y)));e=next[0];
   }
   if(loop.length<3)continue;let changed=true;while(changed&&loop.length>3){changed=false;for(let i=0;i<loop.length;i++){const a=loop[(i+loop.length-1)%loop.length],b=loop[i],c=loop[(i+1)%loop.length],u=sub(b,a),v=sub(c,b);if(Math.abs(cross(u,v))<EPS&&u.x*v.x+u.y*v.y>0){loop.splice(i,1);changed=true;break;}}}loops.push(loop);
  }
  return loops;
 }
 function build({nodes,segs,prefab=null,postRect=null}){
  const byId=new Map(nodes.map(n=>[String(n.id),n])),bodies=[],posts=[],joints=[],verandas=[];
  if(prefab){for(const r of prefab.runs){const point=t=>({x:r.ax+r.ux*t,y:r.ay+r.uy*t});for(const it of r.items){const a=Math.max(it.off,r.s0||0),b=Math.min(it.off+it.L,r.L-(r.s1||0));if(b>a+EPS)bodies.push(rectangle(point(a),point(b),+it.seg.k||10));}
    for(const j of r.ekler||[])joints.push({...point(j.pos),kind:j.tip,k:+r.slots.find(p=>Math.abs(p.a-j.pos)<.01)?.k||10,ux:r.ux,uy:r.uy});}
   for(const j of prefab.bag){const n=byId.get(String(j.nid));if(!n)continue;if(j.tip==='kose'&&postRect)posts.push({poly:box(postRect(j.nid,parseFloat(j.k)||10)),nodeId:j.nid});else if(j.tip!=='H')joints.push({x:n.x,y:n.y,kind:j.tip,k:parseFloat(j.k)||10});}
  }
  for(const s of segs){const a=byId.get(String(s.n1)),b=byId.get(String(s.n2));if(!a||!b)continue;if(s.tip==='veranda'){const poly=rectangle(a,b,+s.k||10,(+s.k||10)/2);verandas.push({a,b,poly});}else if(!prefab)bodies.push(rectangle(a,b,+s.k||10,(+s.k||10)/2));}
  const polygons=[...bodies,...posts.map(p=>p.poly),...verandas.map(p=>p.poly)],loops=contours(polygons),outer=loops.filter(p=>signed(p)>EPS),corners=[],edges=[];
  for(const loop of outer)loop.forEach((p,i)=>{const prev=loop[(i+loop.length-1)%loop.length],next=loop[(i+1)%loop.length],post=posts.some(q=>q.poly.some(v=>dist(v,p)<.001)),concave=cross(sub(p,prev),sub(next,p))<0;corners.push({...p,snap:post?'Köşe direği · dış köşe':concave?'İç dönüş · dış yüz':'Dış sınır köşesi'});edges.push({a:p,b:next});});
  return {bodies,posts,joints,verandas,loops,corners,edges};
 }
 function snap(raw,{reference,scale,anchor=null,ortho=false,enabled=true,points=[]}){
  const axis=anchor&&ortho?(Math.abs(raw.x-anchor.x)>=Math.abs(raw.y-anchor.y)?'x':'y'):null;
  let p={x:Math.round(raw.x),y:Math.round(raw.y)};if(axis)p[axis==='x'?'y':'x']=anchor[axis==='x'?'y':'x'];if(!enabled)return p;
  const aligned=q=>!axis||Math.abs(q[axis==='x'?'y':'x']-anchor[axis==='x'?'y':'x'])<.001;
  const aim=axis?{...raw,[axis==='x'?'y':'x']:anchor[axis==='x'?'y':'x']}:raw,metric=q=>dist(q,aim)*scale;
  // Exact corners beat projections onto an edge/axis, even at low zoom.
  const candidates=[...points.map(q=>({...q,snap:'Beton köşesi'})),...reference.corners].filter(q=>aligned(q)&&metric(q)<=12).sort((a,b)=>metric(a)-metric(b));
  if(candidates.length)return {...candidates[0]};
  const faces=[];
  for(const e of reference.edges){let q;if(axis){const fixed=axis==='x'?'y':'x',den=e.b[fixed]-e.a[fixed];if(Math.abs(den)>EPS){const t=(anchor[fixed]-e.a[fixed])/den;if(t<-EPS||t>1+EPS)continue;q=lerp(e.a,e.b,Math.max(0,Math.min(1,t)));}else{if(Math.abs(e.a[fixed]-anchor[fixed])>.001)continue;q=projection(p,e.a,e.b);}}else q=projection(raw,e.a,e.b);if(metric(q)<=10)faces.push({...q,snap:axis?'Dış yüz · dik hizalı':'Dış yüz'});}
  faces.sort((a,b)=>metric(a)-metric(b));return faces[0]||p;
 }
 root.FoundationReference={build,contours,snap};
})(typeof window==='undefined'?globalThis:window);
