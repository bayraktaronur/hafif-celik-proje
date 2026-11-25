const fs=require('fs'),path=require('path'),assert=require('node:assert/strict'),{pathToFileURL}=require('url'),{chromium}=require(require.resolve('playwright',{paths:[path.dirname(process.execPath)]}));
// Usage: node drainage-mount-check.cjs current.html fixture.json previous.html
if(process.argv.length<5)throw Error('Provide current HTML, fixture JSON, previous HTML');
fs.mkdirSync('outputs',{recursive:true});
(async()=>{const b=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'});try{
const p=await b.newPage({viewport:{width:1600,height:1100}}),errors=[];p.on('pageerror',e=>errors.push(e.message));const d=JSON.parse(fs.readFileSync(process.argv[3],'utf8'));
const sample=()=>p.evaluate(()=>({bill:LoadingList.calculate().rows,roof:RoofStudio.summary(),state:Studio.state(),rain:RainDrainage.billRows(RoofStudio.model(),G.roofs,RoofCore,G.rainDrainage)}));
await p.goto(pathToFileURL(path.resolve(process.argv[4])).href);await p.evaluate(d=>Studio.loadProject(d),d);await p.click('#single-model');const before=await sample();
await p.goto(pathToFileURL(path.resolve(process.argv[2])).href);await p.evaluate(d=>Studio.loadProject(d),d);await p.click('#single-model');assert.deepEqual(await sample(),before);await p.click('#rainEditToggle');
const targets=await p.evaluate(()=>{const out=[];for(const r of RainEdit3D.layout().runs.filter(r=>r.active)){for(let t=10;t<r.len-5;t+=20)for(const f of RainMount.candidates(r,t))if(!out.some(o=>o.key===r.key&&o.id===f.id))out.push({key:r.key,id:f.id,kind:f.kind,offset:f.offset,distance:f.distance,len:r.len});}return out;});console.log('targets',targets.reduce((o,t)=>(o[t.kind]=(o[t.kind]||0)+1,o),{}));
for(const kind of ['post','corner','h','wall'])assert.ok(targets.some(t=>t.kind===kind),'missing '+kind);
const picked=await p.evaluate(()=>{const kinds=new Set();for(const r of RainEdit3D.layout().runs.filter(r=>r.active))for(let t=5;t<r.len-5;t+=3){const f=RainMount.pick(r,t,p=>({x:p.x,y:p.y}));if(f)kinds.add(f.kind);}return [...kinds];});for(const kind of ['post','corner','h','wall'])assert.ok(picked.includes(kind),'cannot automatically pick '+kind);
const target=targets.find(t=>t.kind==='post');target.start=target.offset+(target.start<target.len-5?45:-45);
// Put an existing downpipe away from the target, then drag toward it with real pointer events.
await p.evaluate(t=>{const r=RainEdit3D.layout().runs.find(r=>r.key===t.key);const old=r.pipes[0].offset;RainEdit3D.commit(t.key,old,t.start);},target);
let prior=await sample();await p.evaluate(()=>RoofStudio.setCamera({...RoofStudio.getCamera(),yaw:35,pitch:-12,projection:'perspective'}));
const coords=await p.evaluate(t=>({a:RainEdit3D.projectRun(t.key,t.start),b:RainEdit3D.projectRun(t.key,t.offset+1)}),target),rect=await p.locator('#roofCanvas').boundingBox();
await p.mouse.move(rect.x+coords.a.x,rect.y+coords.a.y);await p.mouse.down();await p.mouse.move(rect.x+coords.b.x,rect.y+coords.b.y,{steps:8});const caught=await p.evaluate(()=>RainEdit3D.snapTarget);assert.equal(caught?.kind,'post');await p.screenshot({path:'outputs/rain-mount-yakalama.png'});await p.mouse.up();
const after=await sample();assert.deepEqual(after.bill,before.bill);assert.deepEqual(after.roof,before.roof);assert.equal(after.rain.length,before.rain.length);
const mount=after.state.rainDrainage.runs[target.key].mounts;assert.ok(Object.values(mount).some(m=>m.kind==='post'));
const measured=await p.evaluate(t=>{const cfg=RainDrainage.settings(G.rainDrainage),r=RainEdit3D.layout().runs.find(r=>r.key===t.key),entry=Object.entries(cfg.runs[t.key].mounts)[0],offset=+entry[0],distance=RainMount.distance(r,offset,cfg),pipe=r.pipes.find(p=>p.offset===offset);return{distance,actual:pipe.extra+cfg.wallGap+9.19512};},target);assert.ok(Math.abs(measured.distance-measured.actual)<1e-6);
await p.click('#rainEditUndo');assert.deepEqual((await sample()).state,prior.state);await p.click('#rainEditRedo');assert.deepEqual((await sample()).state,after.state);
await p.evaluate(()=>Studio.flush());await p.reload();await p.click('#single-model');assert.deepEqual((await sample()).state,after.state);await p.evaluate(d=>Studio.loadProject(d),after.state);assert.deepEqual((await sample()).state,after.state);
// Resolve the selected face for every mounting category without touching the recipes.
for(const kind of ['corner','h','wall']){await p.evaluate(d=>Studio.loadProject(d),before.state);const result=await p.evaluate(kind=>{for(const r of RainEdit3D.layout().runs.filter(r=>r.active&&r.pipes.length)){for(let t=5;t<r.len-5;t+=10){for(const f of RainMount.candidates(r,t).filter(f=>f.kind===kind)){if(r.pipes.slice(1).some(p=>Math.abs(p.offset-f.offset)<12))continue;RainEdit3D.commit(r.key,r.pipes[0].offset,f.offset,f);const cfg=RainDrainage.settings(G.rainDrainage),pipe=RainEdit3D.layout().runs.find(x=>x.key===r.key).pipes.find(x=>x.offset===f.offset);return{stored:cfg.runs[r.key].mounts[String(f.offset)].kind,error:Math.abs(pipe.extra+cfg.wallGap+9.19512-f.distance)};}}}return null;},kind);assert.equal(result?.stored,kind);assert.ok(result.error<1e-6);assert.deepEqual((await sample()).bill,before.bill);}
await p.evaluate(d=>Studio.loadProject(d),after.state);
assert.deepEqual(errors,[]);console.log('PASS baseline recipes and quantities, all four target categories, actual automatic post drag, mounted face distance, undo/redo and persisted target');
}finally{await b.close();}})().catch(e=>{console.error(e);process.exitCode=1});
