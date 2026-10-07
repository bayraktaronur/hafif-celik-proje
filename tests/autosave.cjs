const fs=require('fs'),path=require('path'),assert=require('node:assert/strict');let pw;try{pw=require('playwright')}catch{pw=require(path.resolve(path.dirname(process.execPath),'../node_modules/playwright'))}
(async()=>{const b=await pw.chromium.launch({headless:true,executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'});try{const p=await b.newPage(),url=require('url').pathToFileURL(path.resolve('dist/plan_studio.html')).href,errors=[];p.on('pageerror',e=>errors.push(e.message));let dismiss=false,dialogs=[];p.on('dialog',async d=>{dialogs.push(d.type());await(dismiss?d.dismiss():d.accept());});await p.goto(url);const data=JSON.parse(fs.readFileSync('cizimler/2026-10-08-panel-kapanis/orijinal.json','utf8'));await p.evaluate(d=>Studio.loadProject(d),data);await p.clock.install();await p.evaluate(()=>{Studio.rename('Yedek testi');});await p.clock.fastForward(11000);assert.equal(await p.evaluate(()=>JSON.parse(localStorage.getItem('prefabrikten.planstudio.recovery.v1')).project.projectName),'Yedek testi');
// Changes not routed through schedule still persist on the periodic fallback.
await p.evaluate(()=>{G.nodes[0].x+=1;});await p.clock.fastForward(10000);const saved=await p.evaluate(()=>Studio.snapshot());await p.reload();assert.equal(await p.evaluate(()=>Studio.snapshot()),saved);
dismiss=true;await p.keyboard.press('F5');assert.equal(dialogs.at(-1),'confirm');assert.equal(await p.evaluate(()=>Studio.snapshot()),saved);dismiss=false;await Promise.all([p.waitForEvent('load'),p.keyboard.press('Control+r')]);assert.equal(await p.evaluate(()=>Studio.snapshot()),saved);
await p.evaluate(()=>Studio.rename('Yeni sürüm'));await p.evaluate(()=>Studio.flush());await p.evaluate(()=>yeniPlan());await p.evaluate(()=>Studio.flush());assert.equal(await p.evaluate(()=>G.segs.length),0);assert.ok(await p.evaluate(()=>JSON.parse(localStorage.getItem('prefabrikten.planstudio.recovery.v1.history')).some(e=>e.project.projectName==='Yeni sürüm')));await p.reload();assert.equal(await p.evaluate(()=>G.segs.length),0);
await p.evaluate(()=>Studio.showBackups());await p.locator('dialog button').filter({hasText:'Yeni sürüm'}).first().click();assert.equal(await p.evaluate(()=>G.segs.length),data.s.length);
// Native navigation warns even when the browser backup is up to date.
await p.evaluate(()=>Studio.flush());dialogs=[];await p.reload();assert.ok(dialogs.includes('beforeunload'));
// Broken latest record falls back to a validated historic version.
await p.evaluate(()=>{localStorage.setItem('prefabrikten.planstudio.recovery.v1','broken');});await p.goto('about:blank'); // pagehide would overwrite only if changed
await p.goto(url);assert.ok(await p.evaluate(()=>G.segs.length)>0);
// Roof-only projects are recoverable even without a single wall.
await p.evaluate(()=>{const d=Studio.state();d.n=[];d.s=[];d.e=[];d.r=[];d.roofs=[RoofStudio.make({x:0,y:0,w:500,d:400})];Studio.loadProject(d);Studio.flush();});await p.reload();assert.equal(await p.evaluate(()=>G.roofs.length),1);assert.equal(await p.evaluate(()=>G.segs.length),0);
for(let i=0;i<12;i++)await p.evaluate(i=>{Studio.rename('Sürüm '+i);const d=Studio.state();Studio.loadProject(d);Studio.flush();},i);
assert.equal(await p.evaluate(()=>JSON.parse(localStorage.getItem('prefabrikten.planstudio.recovery.v1.history')).length),10);
await p.evaluate(()=>Studio.showBackups());await p.screenshot({path:'artifacts/autosave-history.png'});await p.locator('dialog[open] button').filter({hasText:'Kapat'}).click();
// A failed storage write is visible and never marked successful.
await p.evaluate(()=>{Storage.prototype.setItem=function(){throw Error('quota')};Studio.rename('Yazılamadı');});assert.equal(await p.evaluate(()=>Studio.flush()),false);assert.match(await p.locator('#saveState').innerText(),/Yedek alınamadı/);assert.deepEqual(errors,[]);console.log('autosave: interval, recovery, F5 cancel, Ctrl+R, native warning, history/new/restore, corrupt fallback, quota failure passed');}finally{await b.close();}})().catch(e=>{console.error(e);process.exit(1)});


