const assert=require('node:assert/strict'),path=require('path'),fs=require('fs'),pw=require(path.resolve(path.dirname(process.execPath),'../node_modules/playwright'));
(async()=>{const b=await pw.chromium.launch({headless:true,executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'});try{
 const p=await b.newPage({viewport:{width:1500,height:1000}}),errors=[];p.on('pageerror',e=>errors.push(e.message));await p.goto(require('url').pathToFileURL(path.resolve('plan_cizim.html')).href);
 const source=JSON.parse(fs.readFileSync('cizimler/gulsum-84m2/veranda-5.9.97.json'));
 await p.evaluate(d=>{Studio.loadProject({...d,projectName:'A'});Studio.flush();Studio.openDocument({...d,projectName:'B'});planKaydet();Studio.openDocument({...d,projectName:'C'});},source);
 const state=await p.evaluate(()=>Studio.snapshot());
 await p.locator('[role=tab]').nth(0).dragTo(p.locator('[role=tab]').nth(2));
 assert.deepEqual(await p.evaluate(()=>Studio.documents().documents.map(d=>d.project.projectName)),['B','C','A']);assert.equal(await p.evaluate(()=>Studio.documents().active),1);assert.equal(await p.evaluate(()=>Studio.snapshot()),state);
 await p.reload();assert.deepEqual(await p.evaluate(()=>Studio.documents().documents.map(d=>d.project.projectName)),['B','C','A']);assert.equal(await p.inputValue('#projectName'),'C');
 assert.equal(await p.locator('.project-tab-close').nth(0).isVisible(),true);
 await p.evaluate(()=>{Studio.switchDocument(0);planKaydet();Studio.switchDocument(1);}); let asked='';p.once('dialog',async d=>{asked=d.message();await d.dismiss()});await p.locator('.project-tab-close').nth(0).click();assert.match(asked,/B.*çizim içeriyor/);assert.equal(await p.locator('[role=tab]').count(),3);assert.equal(await p.inputValue('#projectName'),'C');
 p.once('dialog',d=>d.accept());await p.locator('.project-tab-close').nth(0).click();assert.equal(await p.locator('[role=tab]').count(),2);assert.equal(await p.inputValue('#projectName'),'C');assert.equal(await p.evaluate(()=>Studio.documents().active),0);
 await p.locator('[role=tab]').nth(1).dragTo(p.locator('[role=tab]').nth(0));assert.deepEqual(await p.evaluate(()=>Studio.documents().documents.map(d=>d.project.projectName)),['A','C']);assert.equal(await p.inputValue('#projectName'),'C');assert.deepEqual(errors,[]);console.log('PASS drag both directions, persisted order, active project unchanged, saved inactive drawing confirmation/cancel/close');
}finally{await b.close()}})().catch(e=>{console.error(e);process.exitCode=1});
