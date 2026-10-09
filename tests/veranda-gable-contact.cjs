const assert=require('node:assert/strict'),fs=require('fs'),path=require('path'),C=require('../src/roof-core');
const source=JSON.parse(fs.readFileSync('cizimler/gulsum-84m2/veranda-kirisli-ornek-5.9.98.json'));
for(const rotation of [0,90,180,270]){
 const data=structuredClone(source),frame={x:120,y:-80,angle:rotation};
 for(const z of data.roofs){Object.assign(z,C.transform(frame,z),{angle:(z.angle+rotation)%360});if(z.attachment){const b=z.attachment.base;Object.assign(b,C.transform(frame,b),{angle:(b.angle+rotation)%360});}}
 const parent=data.roofs[0],child=C.attachVeranda(data.roofs[1],parent),m=C.calculate([parent,child]);
 assert.equal(child.attachmentJoin,'gable');
 // Right slope must cover the entire 22 cm overhang, down to betopan y=883.5.
 for(const y of [883.501,890,905.499,920]){const p=C.transform(frame,{x:380,y});assert.ok(m.faces.some(f=>f.zoneId===child.id&&C.contains(f.poly,p)),`gap at ${rotation}/${y}`);}
 assert.ok(!m.faces.some(f=>f.zoneId===child.id&&C.contains(f.poly,C.transform(frame,{x:380,y:880}))),'hidden sheet ends at support');
 // Left slope is a continuous plane, with no false verge across the old join.
 const p=C.transform(frame,{x:120,y:905.5}),cp=C.zoneFaces(child).find(f=>C.contains(f.poly,p)),hp=C.zoneFaces(parent).find(f=>C.contains(f.poly,p));assert.ok(Math.abs(C.height(cp,p)-C.height(hp,p))<1e-6);
 assert.ok(!m.edges.some(e=>e.type==='verge'&&Math.hypot((e.p.x+e.q.x)/2-p.x,(e.p.y+e.q.y)/2-p.y)<80));
 assert.deepEqual(C.attachVeranda(child,parent),child,'repeated synchronization must be stable');
}
(async()=>{const pw=require(path.resolve(path.dirname(process.execPath),'../node_modules/playwright')),b=await pw.chromium.launch({headless:true,executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'});try{
 const p=await b.newPage({viewport:{width:1700,height:1100}}),errors=[];p.on('pageerror',e=>errors.push(e.message));await p.goto(require('url').pathToFileURL(path.resolve('dist/plan_studio.html')).href);
 await p.evaluate(d=>{Studio.loadProject(d);RoofStudio.open();RoofStudio.setView('3d')},source);
 const saved=await p.evaluate(()=>Studio.state());assert.equal(saved.roofs.find(z=>z.sourceRoomId).attachmentJoin,'gable');assert.deepEqual(saved.n,source.n);assert.deepEqual(saved.s,source.s);assert.deepEqual(saved.roofs.find(z=>z.sourceRoomId).supports,source.roofs.find(z=>z.sourceRoomId).supports);
 await p.screenshot({path:'artifacts/veranda-gable-contact.png'});await p.evaluate(d=>Studio.loadProject(d),saved);assert.deepEqual(await p.evaluate(()=>Studio.state().roofs),saved.roofs);assert.deepEqual(errors,[]);
 console.log('PASS gable contact over 22 cm overhang, coplanar continuation, four directions, old JSON migration, unchanged walls/supports, round trip and 3D');
}finally{await b.close()}})().catch(e=>{console.error(e);process.exitCode=1});
