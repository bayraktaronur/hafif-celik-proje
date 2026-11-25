const fs=require('fs'),path=require('path'),assert=require('node:assert/strict'),{pathToFileURL}=require('url'),{chromium}=require(require.resolve('playwright',{paths:[path.dirname(process.execPath)]}));
// Usage: node drainage-edit-check.cjs current.html fixture.json previous.html
if(process.argv.length<5)throw Error('Provide current HTML, fixture JSON, previous HTML');
fs.mkdirSync('outputs',{recursive:true});
(async()=>{const b=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'});try{
const p=await b.newPage({viewport:{width:1600,height:1100}}),errors=[];p.on('pageerror',e=>errors.push(e.message));const d=JSON.parse(fs.readFileSync(process.argv[3],'utf8'));
const sample=()=>p.evaluate(()=>({bill:LoadingList.calculate().rows,roof:RoofStudio.summary(),state:Studio.state(),rain:RainDrainage.layout(RoofStudio.model(),G.roofs,RoofCore,G.rainDrainage).totals}));
await p.goto(pathToFileURL(path.resolve(process.argv[4])).href);await p.evaluate(d=>Studio.loadProject(d),d);await p.click('#single-model');const before=await sample();
await p.goto(pathToFileURL(path.resolve(process.argv[2])).href);await p.evaluate(d=>Studio.loadProject(d),d);await p.click('#single-model');assert.deepEqual(await sample(),before);
await p.click('#rainEditToggle');await p.waitForTimeout(250);console.log('mode',await p.evaluate(()=>({mode:document.body.dataset.singleView,hits:RainEdit3D.hits.length})));
let item=await p.evaluate(()=>RainEdit3D.hits.find(h=>h.x>40&&h.y>30)||RainEdit3D.hits[0]);assert.ok(item);
const box=await p.locator('#roofCanvas').boundingBox();await p.mouse.click(box.x+item.x,box.y+item.y);assert.equal((await p.evaluate(()=>RainEdit3D.selection)).offset,item.offset);
// Numeric placement uses the same validated commit as the drag release.
await p.fill('#rainEditDistance',String(item.offset+35));await p.click('#rainEditMove');let moved=await sample();assert.notDeepEqual(moved.state,before.state);assert.equal(moved.rain.pipes,before.rain.pipes);assert.equal(moved.rain.gutter,before.rain.gutter);assert.deepEqual(moved.bill,before.bill);assert.deepEqual(moved.roof,before.roof);
await p.click('#rainEditUndo');assert.deepEqual((await sample()).state,before.state);await p.click('#rainEditRedo');assert.deepEqual((await sample()).state,moved.state);
// Actual pointer gesture with fixed camera and a non-axis-aligned perspective.
await p.evaluate(()=>RoofStudio.setCamera({...RoofStudio.getCamera(),yaw:35,pitch:-12,projection:'perspective'}));await p.waitForTimeout(100);
await p.selectOption('#rainEditPipe',String(item.offset+35));let coords=await p.evaluate(({key,offset})=>({a:RainEdit3D.projectRun(key,offset+35),b:RainEdit3D.projectRun(key,offset+70),cam:RoofStudio.getCamera()}),item);
let rect=await p.locator('#roofCanvas').boundingBox();await p.mouse.move(rect.x+coords.a.x,rect.y+coords.a.y);await p.mouse.down();await p.mouse.move(rect.x+coords.b.x,rect.y+coords.b.y,{steps:6});await p.mouse.up();
let dragged=await sample();assert.notDeepEqual(dragged.state,moved.state);assert.deepEqual(await p.evaluate(()=>RoofStudio.getCamera()),coords.cam);assert.deepEqual(dragged.bill,before.bill);
await p.click('#rainEditUndo');assert.deepEqual((await sample()).state,moved.state);await p.click('#rainEditRedo');assert.deepEqual((await sample()).state,dragged.state);
await p.selectOption('#rainEditPipe',String(await p.evaluate(()=>RainEdit3D.layout().runs.find(r=>r.key===document.getElementById('rainEditRun').value).pipes[0].offset)));
await p.click('#rainEditDelete');let deleted=await sample();assert.equal(deleted.rain.pipes,before.rain.pipes-1);await p.evaluate(()=>RoofStudio.render());assert.equal((await sample()).rain.pipes,deleted.rain.pipes);
await p.click('#rainEditUndo');assert.deepEqual((await sample()).state,dragged.state);
await p.click('#rainEditAdd');coords=await p.evaluate(key=>{const r=RainEdit3D.layout().runs.find(r=>r.key===key);return RainEdit3D.projectRun(key,r.len/2)},item.key);rect=await p.locator('#roofCanvas').boundingBox();await p.mouse.click(rect.x+coords.x,rect.y+coords.y);let added=await sample();assert.equal(added.rain.pipes,before.rain.pipes+1);assert.deepEqual(added.bill,before.bill);await p.click('#rainEditAdd');
await p.evaluate(()=>Studio.flush());const saved=JSON.parse(JSON.stringify(added.state));
await p.evaluate(()=>{window.showSaveFilePicker=undefined;}); // Exercise the real download fallback without an OS picker.
const dl=p.waitForEvent('download');await p.getByRole('button',{name:/^Kaydet/}).first().click();const download=await dl;const exported=JSON.parse(fs.readFileSync(await download.path(),'utf8'));assert.deepEqual(exported.rainDrainage,saved.rainDrainage);
await p.reload();await p.click('#single-model');assert.deepEqual((await sample()).state,saved);
await p.evaluate(d=>Studio.loadProject(d),before.state);await p.evaluate(d=>Studio.loadProject(d),saved);assert.deepEqual((await sample()).state,saved);
await p.click('#rainEditToggle');
const body=await p.evaluate(()=>{let pick;const old=RainEdit3D.draw;RainEdit3D.draw=(ctx,scene,project)=>{old(ctx,scene,project);const item=scene.items.find(i=>i.kind==='rainDownpipe'&&i.poly.reduce((s,v)=>s+v.z,0)/i.poly.length>50&&i.poly.reduce((s,v)=>s+v.z,0)/i.poly.length<170);if(item){const poly=item.poly.map(project);pick={x:poly.reduce((s,p)=>s+p.x,0)/poly.length,y:poly.reduce((s,p)=>s+p.y,0)/poly.length};}};RoofStudio.repaint();RainEdit3D.draw=old;return pick;});assert.ok(body);rect=await p.locator('#roofCanvas').boundingBox();await p.mouse.click(rect.x+body.x,rect.y+body.y);assert.ok(await p.evaluate(()=>RainEdit3D.selection));assert.deepEqual((await sample()).state,saved);
const invalid=await p.evaluate(key=>{try{RainEdit3D.commit(key,null,-100);return false;}catch(e){return true;}},item.key);assert.ok(invalid);assert.deepEqual((await sample()).state,saved);
await p.evaluate(()=>RoofStudio.setCamera({...RoofStudio.getCamera(),projection:'orthographic'}));
item=await p.evaluate(()=>RainEdit3D.hits.find(h=>h.x>100&&h.y>50));coords=await p.evaluate(h=>({a:RainEdit3D.projectRun(h.key,h.offset),b:RainEdit3D.projectRun(h.key,h.offset+25)}),item);rect=await p.locator('#roofCanvas').boundingBox();await p.mouse.move(rect.x+coords.a.x,rect.y+coords.a.y);await p.mouse.down();await p.mouse.move(rect.x+coords.b.x,rect.y+coords.b.y,{steps:3});await p.keyboard.press('Escape');await p.mouse.up();assert.deepEqual((await sample()).state,saved);
await p.screenshot({path:'outputs/rain-editor-duzenleme.png'});assert.deepEqual(errors,[]);console.log('PASS baseline invariants, numeric + pointer move, camera unchanged, add/delete, undo/redo, download, autosave reload, JSON roundtrip, invalid position, Escape cancellation');
fs.writeFileSync('outputs/rain-editor-kontrol.json',JSON.stringify({passed:true,loadingRows:before.bill.length,initialPipes:before.rain.pipes,addedPipes:added.rain.pipes,deletedPipes:deleted.rain.pipes,checks:['unchanged calculation code','loading rows unchanged','gutter length unchanged','pointer drag','undo redo','add delete','autosave reload','JSON roundtrip']},null,2));
}finally{await b.close();}})().catch(e=>{console.error(e);process.exitCode=1});
