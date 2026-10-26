// Offline quadric edge collapse for display meshes; original STL remains untouched.
// Open borders and extrema stay fixed. Reversed faces and nonmanifold collapses are rejected.
module.exports=function simplify(tris,tolerance=.05){
 const vertices=[],ids=new Map(),faces=[],edges=new Map(),heap=[];
 const sub=(a,b)=>a.map((v,i)=>v-b[i]),cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]],dot=(a,b)=>a.reduce((s,v,i)=>s+v*b[i],0);
 function normal(ps){const n=cross(sub(ps[1],ps[0]),sub(ps[2],ps[0])),l=Math.hypot(...n);return l>1e-9?n.map(v=>v/l):null;}
 for(const tri of tris){const vs=tri.map(p=>{const key=p.map(x=>Math.round(x*1e4)).join(',');if(!ids.has(key)){ids.set(key,vertices.length);vertices.push({p:[...p],q:Array(16).fill(0),faces:new Set(),alive:true,rev:0,locked:false});}return ids.get(key);});if(new Set(vs).size<3)continue;const n=normal(vs.map(i=>vertices[i].p));if(!n)continue;const plane=[...n,-dot(n,vertices[vs[0]].p)],id=faces.length;faces.push({vs,n,alive:true});for(const i of vs){const v=vertices[i];v.faces.add(id);for(let a=0;a<4;a++)for(let b=0;b<4;b++)v.q[a*4+b]+=plane[a]*plane[b];}vs.forEach((a,i)=>{const b=vs[(i+1)%3],key=a<b?a+','+b:b+','+a;edges.set(key,(edges.get(key)||0)+1);});}
 const mins=[0,1,2].map(k=>Math.min(...vertices.map(v=>v.p[k]))),maxs=[0,1,2].map(k=>Math.max(...vertices.map(v=>v.p[k])));
 for(const v of vertices)v.locked=v.p.some((x,k)=>Math.abs(x-mins[k])<1e-4||Math.abs(x-maxs[k])<1e-4);
 for(const [key,count] of edges)if(count!==2)key.split(',').forEach(i=>vertices[+i].locked=true);
 function push(v){heap.push(v);let i=heap.length-1;while(i){const j=(i-1)>>1;if(heap[j].cost<=v.cost)break;heap[i]=heap[j];i=j;}heap[i]=v;}
 function pop(){const result=heap[0],last=heap.pop();if(heap.length){let i=0;while(i*2+1<heap.length){let j=i*2+1;if(j+1<heap.length&&heap[j+1].cost<heap[j].cost)j++;if(heap[j].cost>=last.cost)break;heap[i]=heap[j];i=j;}heap[i]=last;}return result;}
 const cost=(q,p)=>{const h=[...p,1];let s=0;for(let a=0;a<4;a++)for(let b=0;b<4;b++)s+=h[a]*q[a*4+b]*h[b];return Math.max(0,s);};
 function candidate(a,b){const A=vertices[a],B=vertices[b];if(a===b||!A.alive||!B.alive||A.locked&&B.locked)return;const q=A.q.map((v,i)=>v+B.q[i]);let points=A.locked?[A.p]:B.locked?[B.p]:[A.p,B.p,A.p.map((v,i)=>(v+B.p[i])/2)];
  if(!A.locked&&!B.locked){const mat=Array.from({length:3},(_,i)=>[q[i*4],q[i*4+1],q[i*4+2],-q[i*4+3]]);let ok=true;for(let i=0;i<3;i++){let j=i;for(let k=i+1;k<3;k++)if(Math.abs(mat[k][i])>Math.abs(mat[j][i]))j=k;if(Math.abs(mat[j][i])<1e-9){ok=false;break;}[mat[i],mat[j]]=[mat[j],mat[i]];const d=mat[i][i];for(let k=i;k<4;k++)mat[i][k]/=d;for(let j=0;j<3;j++)if(j!==i){const f=mat[j][i];for(let k=i;k<4;k++)mat[j][k]-=f*mat[i][k];}}if(ok){const p=mat.map(a=>a[3]);if(p.every((v,k)=>v>=mins[k]-1e-5&&v<=maxs[k]+1e-5))points.push(p);}}
  const p=points.sort((a,b)=>cost(q,a)-cost(q,b))[0],c=cost(q,p);if(c<=tolerance*tolerance)push({a,b,p,q,cost:c,ar:A.rev,br:B.rev});
 }
 for(const key of edges.keys())candidate(...key.split(',').map(Number));
 let removed=0;
 while(heap.length){const c=pop(),A=vertices[c.a],B=vertices[c.b];if(!A.alive||!B.alive||A.rev!==c.ar||B.rev!==c.br)continue;const shared=[...A.faces].filter(i=>B.faces.has(i));if(shared.length!==2)continue;
  const neighbors=v=>new Set([...v.faces].flatMap(i=>faces[i].vs).filter(i=>i!==c.a&&i!==c.b)),an=neighbors(A),bn=neighbors(B);if([...an].filter(i=>bn.has(i)).length!==2)continue;
  const affected=new Set([...A.faces,...B.faces]);let valid=true;for(const i of affected){if(shared.includes(i))continue;const f=faces[i],ps=f.vs.map(j=>j===c.a||j===c.b?c.p:vertices[j].p),n=normal(ps);if(!n||dot(n,f.n)<.5){valid=false;break;}}if(!valid)continue;
  for(const i of affected){const f=faces[i];f.vs.forEach(j=>vertices[j].faces.delete(i));if(shared.includes(i)){f.alive=false;removed++;}else{f.vs=f.vs.map(j=>j===c.b?c.a:j);f.vs.forEach(j=>vertices[j].faces.add(i));}}
  A.p=[...c.p];A.q=c.q;A.locked=A.locked||B.locked;A.rev++;B.alive=false;B.faces.clear();B.rev++;const ns=neighbors(A);for(const j of ns){vertices[j].rev++;}
  const queued=new Set();for(const j of [c.a,...ns])for(const i of vertices[j].faces)for(const k of faces[i].vs)if(j!==k){const key=j<k?j+','+k:k+','+j;if(!queued.has(key)){queued.add(key);candidate(j,k);}}
 }
 return faces.filter(f=>f.alive).map(f=>f.vs.map(i=>vertices[i].p));
};
