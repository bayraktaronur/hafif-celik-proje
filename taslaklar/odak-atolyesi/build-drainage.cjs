// Supplied STL in centimetres. Preserve the source; split only at extension joints.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const source='referanslar/2026-10-26-dere-inis-modeli.stl',b=fs.readFileSync(path.resolve(__dirname,'../..',source)),sha256=crypto.createHash('sha256').update(b).digest('hex');
assert.equal(sha256,'eda14f9ca64356a2403bdf647097610c1bfc261659ae917e5273ff97454f0c5c');
const n=b.readUInt32LE(80);assert.equal(b.length,84+50*n);
const tris=Array.from({length:n},(_,i)=>Array.from({length:3},(_,j)=>Array.from({length:3},(_,k)=>b.readFloatLE(84+i*50+12+j*12+k*4))));
const parent=tris.map((_,i)=>i),seen=new Map(),find=i=>parent[i]===i?i:(parent[i]=find(parent[i]));
tris.forEach((t,i)=>t.forEach(p=>{const k=p.map(v=>Math.round(v*1000)).join(',');if(seen.has(k))parent[find(i)]=find(seen.get(k));else seen.set(k,i);}));
const groups=new Map();tris.forEach((t,i)=>{const k=find(i);if(!groups.has(k))groups.set(k,[]);groups.get(k).push(t);});
const parts=[...groups.values()].sort((a,b)=>b.length-a.length).map(poly=>({poly,min:[0,1,2].map(k=>Math.min(...poly.flat().map(p=>p[k]))),max:[0,1,2].map(k=>Math.max(...poly.flat().map(p=>p[k])))}));assert.equal(parts.length,7);
// Merge planar connected triangles into convex polygons. Curves, holes and disconnected
// patches stay exact. This reduces per-frame work without substituting a generic pipe.
function compact(polys){
 const planes=new Map(),key=p=>p.map(v=>Math.round(v*1e4)).join(',');
 for(const poly of polys){const [a,b,c]=poly,u=b.map((v,k)=>v-a[k]),v=c.map((v,k)=>v-a[k]),norm=[u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0]],l=Math.hypot(...norm);if(l<1e-8)continue;const nn=norm.map(v=>v/l),d=nn.reduce((s,v,k)=>s+v*a[k],0),k=nn.map(v=>Math.round(v*1e4)).join(',')+':'+Math.round(d*1000);if(!planes.has(k))planes.set(k,[]);planes.get(k).push(poly);}
 const out=[];
 for(const group of planes.values()){
  if(group.length===1){out.push(...group);continue;}const edge=new Map();
  for(const poly of group)poly.forEach((p,i)=>{const q=poly[(i+1)%poly.length],a=key(p),b=key(q),k=[a,b].sort().join('|');if(edge.has(k))edge.delete(k);else edge.set(k,{a,b,p,q});});
  const es=[...edge.values()];if(es.length<3){out.push(...group);continue;}let poly=[es[0].p],at=es[0].b,used=new Set([0]);
  while(at!==es[0].a){const i=es.findIndex((e,i)=>!used.has(i)&&e.a===at);if(i<0)break;used.add(i);poly.push(es[i].p);at=es[i].b;}
  if(at!==es[0].a||used.size!==es.length){out.push(...group);continue;}
  let changed=true;while(changed&&poly.length>3){changed=false;poly=poly.filter((p,i)=>{const a=poly[(i+poly.length-1)%poly.length],b=poly[(i+1)%poly.length],u=p.map((v,k)=>v-a[k]),v=b.map((v,k)=>v-p[k]),c=[u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0]];if(Math.hypot(...c)<1e-5*Math.max(1,Math.hypot(...u)*Math.hypot(...v))){changed=true;return false;}return true;});}
  const a=poly[0],b=poly[1],c=poly[2],u=b.map((v,k)=>v-a[k]),v=c.map((v,k)=>v-b[k]),nn=[u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0]];
  const convex=poly.every((p,i)=>{const a=poly[(i+1)%poly.length],b=poly[(i+2)%poly.length],u=a.map((v,k)=>v-p[k]),v=b.map((v,k)=>v-a[k]),c=[u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0]];return c.reduce((s,v,k)=>s+v*nn[k],0)>=-1e-6;});
  out.push(...(convex?[poly]:group));
 }return out;
}
function clip(poly,z,above){const out=[];poly.forEach((p,i)=>{const q=poly[(i+1)%poly.length],a=above?p[2]>=z:p[2]<=z,c=above?q[2]>=z:q[2]<=z;if(a)out.push(p);if(a!==c){const t=(z-p[2])/(q[2]-p[2]);out.push([p[0]+(q[0]-p[0])*t,p[1]+(q[1]-p[1])*t,z]);}});return out;}
const simplify=require('./drainage-simplify.cjs'),displayPipe=simplify(parts[0].poly,.1);
const pipe=compact(displayPipe),upper=[],lower=[],bridge=[];
for(const poly of pipe){const a=clip(poly,227.5,true),b=clip(poly,227.5,false);if(a.length>=3)upper.push(a);if(b.length>=3)lower.push(b);if(a.length>=3&&b.length>=3){const cross=a.filter(p=>Math.abs(p[2]-227.5)<1e-7);if(cross.length===2)bridge.push(cross);}}
const model={source,sha256,triangles:n,displayPipeTriangles:displayPipe.length,quadricToleranceCm:.1,parts:parts.map(({min,max,poly})=>({min,max,triangles:poly.length})),gutter:compact(parts[1].poly),hanger:compact(simplify(parts[5].poly,.05)),clamp:compact(simplify(parts[2].poly,.05)),upper,lower,bridge};
fs.writeFileSync(path.join(__dirname,'drainage-model.js'),'/* Generated from the supplied STL; centimetres. */\nwindow.DrainageModel='+JSON.stringify(model)+';\n');
console.log('Drainage STL: '+n+' source triangles; '+displayPipe.length+' display pipe triangles; source SHA verified.');
