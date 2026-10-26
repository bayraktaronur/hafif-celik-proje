// Supplied sheet-metal / aluminium-PVC door assemblies. Preserve source geometry.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'../..'),models=[];
const sources=[
 {family:'sheet',file:'sac',sha256:'4c38fbec800cec831fdbf991502989fe40d016bc0439b2935d6f5c883d0e0b35',triangles:15116,components:9,hingeSide:-1},
 {family:'al-pvc',file:'aluminyum-pvc',sha256:'55be517f508deb9b7d686855e08d61e0d02e2ec2c0ccfd5b86bef16e1ef95a8d',triangles:16990,components:24,hingeSide:1}
];
for(const config of sources){
 const source='referanslar/2026-10-26-sac-al-pvc-kapi/250cm-280cm-300cm-'+config.file+'-kapi.stl',bytes=fs.readFileSync(path.join(root,source));
 assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'),config.sha256,'Inspect the new source before rebuilding');
 const count=bytes.readUInt32LE(80);assert.equal(bytes.length,84+count*50);
 const groups=[250,280,300].map(height=>({height,triangles:[]}));let referenceTriangles=0;
 for(let t=0;t<count;t++){
  const v=Array.from({length:9},(_,j)=>bytes.readFloatLE(84+t*50+12+j*4));assert.ok(v.every(Number.isFinite));
  // The two additional standalone studies at x>875 are not installed in any panel.
  if(Math.min(v[0],v[3],v[6])>800){referenceTriangles++;continue;}
  const group=Math.round(((v[0]+v[3]+v[6])/3-65.828)/250);assert.ok(groups[group]);
  for(let j=0;j<9;j+=3)v[j]-=group*250;groups[group].triangles.push(v);
 }
 assert.equal(referenceTriangles,35416);
 for(const {height,triangles}of groups){
  assert.equal(triangles.length,config.triangles);
  const parent=triangles.map((_,i)=>i),at=new Map();
  function find(i){while(parent[i]!==i){parent[i]=parent[parent[i]];i=parent[i];}return i;}
  triangles.forEach((v,i)=>{for(let j=0;j<9;j+=3){const key=v.slice(j,j+3).map(n=>Math.round(n*1e5)).join(',');if(at.has(key))parent[find(i)]=find(at.get(key));else at.set(key,i);}});
  const components=new Map();triangles.forEach((v,i)=>{const key=find(i);if(!components.has(key))components.set(key,[]);components.get(key).push(i);});assert.equal(components.size,config.components);
  const materials=['panel','doorFrame','doorLeaf','doorFill','glass','hardware','doorTrim'],materialIds=Buffer.alloc(triangles.length),partIds=Buffer.alloc(triangles.length),parts=[];
  for(const ids of components.values()){
   const lo=[Infinity,Infinity,Infinity],hi=[-Infinity,-Infinity,-Infinity];for(const i of ids)for(let j=0;j<9;j++){const k=j%3;lo[k]=Math.min(lo[k],triangles[i][j]);hi[k]=Math.max(hi[k],triangles[i][j]);}
   const dx=hi[0]-lo[0],dz=hi[2]-lo[2];
   const material=dx>124&&dz>249?'panel':dx>89&&dz>204?'doorFrame':dx>80&&dz>190?'doorLeaf':dx>70&&dz>80?(ids.length===112?'doorTrim':lo[2]>100?'glass':'doorFill'):'hardware';
   ids.forEach(i=>{materialIds[i]=materials.indexOf(material);partIds[i]=parts.length;});parts.push({material,triangles:ids.length,min:lo,max:hi});
  }
  const panel=parts.find(p=>p.material==='panel'),frame=parts.find(p=>p.material==='doorFrame');assert.equal(panel.triangles,84);assert.equal(panel.max[2],height);assert.ok(frame);
  // User confirmed 205 cm for aluminium/PVC. Keep source coordinates recoverable.
  // Connected hardware at the same height translates as a rigid group; never squash handles/hinges.
  const hardware=parts.filter(p=>p.material==='hardware').sort((a,b)=>a.min[2]-b.min[2]),clusters=[];
  for(const part of hardware){let cluster=clusters.at(-1);if(!cluster||part.min[2]>cluster.max+5){cluster={min:part.min[2],max:part.max[2],parts:[]};clusters.push(cluster);}cluster.parts.push(part);cluster.max=Math.max(cluster.max,part.max[2]);}
  for(const cluster of clusters)for(const part of cluster.parts)part.heightAnchor=(cluster.min+cluster.max)/2;
  const doorHeightScale=config.family==='al-pvc'?205/frame.max[2]:1;
  const panelXs=[...new Set(triangles.filter((_,i)=>materials[materialIds[i]]==='panel').flatMap(v=>[v[0],v[3],v[6]]))].sort((a,b)=>a-b);assert.equal(panelXs.length,4);
  const packed=Buffer.alloc(triangles.length*36);triangles.forEach((v,i)=>v.forEach((n,j)=>packed.writeFloatLE(n,i*36+j*4)));
  models.push({key:config.family+'-'+height,family:config.family,source,sha256:config.sha256,height,width:panel.max[0]-panel.min[0],
   centerX:(frame.min[0]+frame.max[0])/2,panelMinX:panel.min[0],panelMaxX:panel.max[0],wallCenterY:(panel.min[1]+panel.max[1])/2,
   frontSide:-1,hingeSide:config.hingeSide,nominalWidth:90,nominalHeight:205,doorHeightScale,
   frameWidth:frame.max[0]-frame.min[0],frameHeight:frame.max[2]-frame.min[2],sourcePanelOpeningHeight:205,
   panelOpeningX:panelXs.slice(1,3),frameMinX:frame.min[0],frameMaxX:frame.max[0],
   materials,parts,triangleCount:triangles.length,excludedReferenceTriangles:referenceTriangles,
   positionsBase64:packed.toString('base64'),materialIdsBase64:materialIds.toString('base64'),partIdsBase64:partIds.toString('base64')});
 }
}
fs.writeFileSync(path.join(__dirname,'other-door-models.js'),'/* Generated by build-other-doors.cjs; original cm coordinates. */\nwindow.OtherDoorSTLModels='+JSON.stringify(models)+';\n'+`
for(const m of window.OtherDoorSTLModels){
 const raw=Uint8Array.from(atob(m.positionsBase64),c=>c.charCodeAt(0)),view=new DataView(raw.buffer);
 m.vertices=Float32Array.from({length:raw.length/4},(_,i)=>view.getFloat32(i*4,true));
 m.materialIds=Uint8Array.from(atob(m.materialIdsBase64),c=>c.charCodeAt(0));
 m.partIds=Uint8Array.from(atob(m.partIdsBase64),c=>c.charCodeAt(0));
 delete m.positionsBase64;delete m.materialIdsBase64;delete m.partIdsBase64;
}
`);
console.log('Other doors: 3 sheet + 3 aluminium/PVC panels; 35416 standalone reference triangles excluded per file; source SHAs verified.');
