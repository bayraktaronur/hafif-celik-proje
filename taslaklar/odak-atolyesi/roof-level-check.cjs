const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),{pathToFileURL}=require('node:url');
const root=path.resolve(__dirname,'../..'),B=require(path.join(root,'src/roof-core.js')),plain=x=>JSON.parse(JSON.stringify(x));
const once=(s,a,b)=>{assert.equal(s.split(a).length,2,a);return s.replace(a,b);};
let source=fs.readFileSync(path.join(root,'src/roof-core.js'),'utf8');for(const f of ['roof-feedback-build','roof-level-build'])source=require('./'+f+'.cjs')('src/roof-core.js',source,once);
const context={module:{exports:{}}};vm.runInNewContext(source,context);const C=context.module.exports;
function fixture(angle=0,reverse=false,pitch=33){const frame={x:2000,y:2000,angle},parent=C.defaults({...frame,id:'p',w:1892.5,d:753.5,h:250,datum:'trim',eaves:[22,22,30,30]}),points=[{x:0,y:-30},{x:0,y:-135},{x:1014,y:-135},{x:1014,y:-30}].map(p=>C.transform(frame,p));if(reverse)points.reverse();return {parent,child:C.defaults({id:'c',h:250,datum:'trim',pitch,eaves:[22,0,30,30],childJoin:{points},production:{role:'child',parentId:'p',relative:90}})};}
for(const angle of [0,90,180,270])for(const reverse of [false,true]){
 const legacy=fixture(angle,reverse,24);assert.deepEqual(plain(C.connectChild(legacy.child,legacy.parent)),plain(B.connectChild(legacy.child,legacy.parent)));
 const invalid=fixture(angle,reverse);assert.throws(()=>C.connectChild(invalid.child,invalid.parent),e=>e.code==='roof-child-intersection');
 for(const target of ['child','parent']){
  const f=fixture(angle,reverse),z=f[target];z.h=z.roofElevation=target==='child'?200:300;const before=JSON.stringify(f),c=C.connectChild(f.child,f.parent);assert.equal(JSON.stringify(f),before);
  C.validate([f.parent,c]);assert.ok(C.calculate([f.parent,c]).area>170);assert.ok(c.childJoin.cladding.length>0);assert.deepEqual(plain(C.connectChild(c,f.parent)),plain(c));
  for(const poly of c.childJoin.cladding){assert.ok(poly.every(p=>Object.values(p).every(Number.isFinite)));assert.ok(poly[2].z>=poly[1].z-.001&&poly[3].z>=poly[0].z-.001);}
  assert.throws(()=>C.validate([{...f.parent,roofElevation:-1},c]),/özel saçak/);
 }
}
console.log('PASS default geometry unchanged; 16 explicit height joins in four directions and reversed U order, vertical closure, validation, idempotence');
const {chromium}=require(path.resolve(path.dirname(process.execPath),'../node_modules/playwright'));
(async()=>{const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'});try{
 const page=await browser.newPage({viewport:{width:1600,height:1000}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(pathToFileURL(path.join(__dirname,'index.html')).href);
 await page.evaluate(()=>{
  Studio.loadProject({v:'5',sistem:'prefabrik',catiYon:'dikey',opt:{h:250},n:[{id:'a',x:246.5,y:0},{id:'b',x:1135,y:0},{id:'c',x:1135,y:1014},{id:'d',x:246.5,y:1892.5}],s:[],e:[],r:[]});SingleStorey.show('roof');RoofStudio.add(RoofStudio.make({id:'parent',name:'Ana çatı 1',x:1000,y:0,angle:90,w:1892.5,d:753.5,h:250,wallTop:250,pitch:33,eaves:[22,22,30,30],eaveRule:{gableMm:220,sideMm:300},production:{role:'main',parentId:'',relative:0}}));RoofStudio.fit();
 });
 const saved=await page.evaluate(()=>Studio.state());
 await page.locator('details').filter({has:page.locator('#roofBoundaryChild')}).locator('summary').first().click();await page.click('#roofBoundaryChild');
 for(const p of [{x:1030,y:0},{x:1135,y:0},{x:1135,y:1014},{x:1030,y:1014}]){const q=await page.evaluate(p=>{const v=RoofStudio.canvasPoint(p),r=document.getElementById('roofCanvas').getBoundingClientRect();return{x:v.x+r.left,y:v.y+r.top};},p);await page.mouse.click(q.x,q.y);}
 const draft=await page.evaluate(()=>RoofWorkflow.getDraft());assert.equal(draft.points.length,4);assert.equal(await page.evaluate(()=>SingleRoofFeedback.result().code),'roof-child-intersection');
 await page.click('[data-roof-level=child]');assert.ok(await page.locator('#roofLevelDialog').isVisible());assert.equal(await page.inputValue('#roofLevelHeight'),'439.21');assert.ok(await page.isDisabled('#roofLevelApply'));
 await page.fill('#roofLevelHeight','390');assert.ok(await page.isEnabled('#roofLevelApply'),await page.locator('#roofLevelStatus').innerText());
 assert.deepEqual(await page.evaluate(()=>Studio.state()),saved);assert.deepEqual(await page.evaluate(()=>RoofWorkflow.getDraft()),draft);
 await page.screenshot({path:path.join(root,'artifacts/roof-level-child-preview.png')});
 await page.keyboard.press('Escape');assert.ok(!await page.locator('#roofLevelDialog').isVisible());assert.deepEqual(await page.evaluate(()=>RoofWorkflow.getDraft()),draft);assert.deepEqual(await page.evaluate(()=>Studio.state()),saved);
 await page.click('[data-roof-level=child]');await page.fill('#roofLevelAngle','90');await page.fill('#roofLevelHeight','390');assert.ok(await page.isDisabled('#roofLevelApply'));
 await page.fill('#roofLevelAngle','10');assert.ok(Math.abs(Number(await page.inputValue('#roofLevelPitch'))-17.632698)<.00001);assert.ok(await page.isEnabled('#roofLevelApply'));
 await page.fill('#roofLevelHeight','');assert.ok(await page.isDisabled('#roofLevelApply'));await page.fill('#roofLevelHeight','-1');assert.ok(await page.isDisabled('#roofLevelApply'));
 await page.click('#roofLevelReset');await page.fill('#roofLevelHeight','390');await page.keyboard.press('Enter');assert.deepEqual(await page.evaluate(()=>Studio.state()),saved);
 await page.click('#roofLevelApply');assert.equal(await page.evaluate(()=>G.roofs.length),2);assert.equal(await page.evaluate(()=>RoofWorkflow.getDraft()),null);assert.equal(await page.evaluate(()=>G.opt.h),250);assert.deepEqual(await page.evaluate(()=>G.roofs[0]),saved.roofs[0]);
 const lower=await page.evaluate(()=>Studio.state());assert.ok(Math.abs(await page.evaluate(()=>SingleRoofLevel.peak(G.roofs[1]))-390)<.001);assert.ok(lower.roofs[1].roofElevation<250);
 await page.evaluate(()=>geriAl());assert.deepEqual(await page.evaluate(()=>Studio.state()),saved);await page.evaluate(()=>ileriAl());assert.deepEqual(await page.evaluate(()=>Studio.state()),lower);
 await page.evaluate(d=>Studio.loadProject(d),lower);assert.deepEqual(await page.evaluate(()=>Studio.state()),lower);
 await page.click('#single-model');await page.screenshot({path:path.join(root,'artifacts/roof-level-lowered-3d.png')});await page.click('#single-roof');
 await page.evaluate(()=>RoofStudio.select(G.roofs[1].id));await page.click('#roofLevelEdit');await page.selectOption('#roofLevelTarget','parent');await page.fill('#roofLevelHeight','450');assert.ok(await page.isEnabled('#roofLevelApply'));
 await page.selectOption('#roofLevelTarget',lower.roofs[1].id);await page.check('#roofLevelAuto');assert.ok(await page.isEnabled('#roofLevelApply'),await page.locator('#roofLevelStatus').innerText());
 await page.selectOption('#roofLevelTarget','parent');await page.selectOption('#roofLevelReference','base');assert.ok(Math.abs(Number(await page.inputValue('#roofLevelHeight'))-303.7725)<.001);await page.selectOption('#roofLevelReference','peak');assert.equal(await page.inputValue('#roofLevelHeight'),'450');
 await page.screenshot({path:path.join(root,'artifacts/roof-level-parent-preview.png')});await page.click('#roofLevelApply');const raised=await page.evaluate(()=>Studio.state());assert.ok(Math.abs(raised.roofs[0].roofElevation-303.7725)<.00001);assert.equal(raised.roofs[1].roofElevation,undefined);assert.equal(raised.roofs[1].h,250);assert.equal(raised.opt.h,250);
 await page.evaluate(()=>geriAl());assert.deepEqual(await page.evaluate(()=>Studio.state()),lower);await page.evaluate(()=>ileriAl());assert.deepEqual(await page.evaluate(()=>Studio.state()),raised);await page.evaluate(d=>Studio.loadProject(d),raised);assert.deepEqual(await page.evaluate(()=>Studio.state()),raised);
 await page.click('#single-model');await page.screenshot({path:path.join(root,'artifacts/roof-level-raised-3d.png')});await page.click('#single-roof');
 await page.evaluate(()=>RoofStudio.select('parent'));await page.click('#roofLevelEdit');await page.check('#roofLevelAuto');assert.ok(await page.isDisabled('#roofLevelApply'),'Must block dependent child that no longer fits');assert.deepEqual(await page.evaluate(()=>Studio.state()),raised);await page.click('#roofLevelCancel');
 await page.click('#roofLevelEdit');await page.fill('#roofLevelHeight','470');await page.evaluate(()=>{G.roofs[0].name='Değişen çatı';});await page.click('#roofLevelApply');assert.match(await page.locator('#roofLevelStatus').innerText(),/Proje değişti/);assert.equal(await page.evaluate(()=>G.roofs[0].roofElevation),raised.roofs[0].roofElevation);await page.click('#roofLevelCancel');
 await page.evaluate(d=>Studio.loadProject(d),raised);await page.evaluate(()=>RoofStudio.select('parent'));await page.click('#roofLevelEdit');await page.setViewportSize({width:900,height:700});await page.screenshot({path:path.join(root,'artifacts/roof-level-compact.png')});
 assert.ok(await page.evaluate(()=>{const r=document.getElementById('roofLevelDialog').getBoundingClientRect();return r.left>=0&&r.right<=innerWidth&&r.top>=0&&r.bottom<=innerHeight;}));await page.click('#roofLevelCancel');
 // The parent action must also work before the child has ever been committed.
 await page.setViewportSize({width:1600,height:1000});await page.evaluate(d=>{Studio.loadProject(d);RoofStudio.fit();},saved);await page.click('#roofBoundaryChild');
 for(const p of [{x:1030,y:0},{x:1135,y:0},{x:1135,y:1014},{x:1030,y:1014}]){const q=await page.evaluate(p=>{const v=RoofStudio.canvasPoint(p),r=document.getElementById('roofCanvas').getBoundingClientRect();return{x:v.x+r.left,y:v.y+r.top};},p);await page.mouse.click(q.x,q.y);}
 assert.match(await page.locator('#singleRoofFeedback').innerText(),/43 cm fark/);await page.click('[data-roof-level=parent]');assert.equal(await page.inputValue('#roofLevelTarget'),'parent');await page.fill('#roofLevelHeight','450');assert.ok(await page.isEnabled('#roofLevelApply'));assert.deepEqual(await page.evaluate(()=>Studio.state()),saved);await page.click('#roofLevelApply');assert.equal(await page.evaluate(()=>G.roofs.length),2);assert.ok(Math.abs(await page.evaluate(()=>SingleRoofLevel.peak(G.roofs[0]))-450)<.001);assert.equal(await page.evaluate(()=>G.roofs[1].roofElevation),undefined);
 const fresh=await page.evaluate(()=>Studio.state());await page.reload();assert.deepEqual(await page.evaluate(()=>Studio.state()),fresh);assert.deepEqual(errors,[]);
 console.log('PASS live four-point U, child/parent controls, angle/pitch sync, peak/base conversion, invalid input, Enter/Escape/cancel, preview isolation, apply/undo/redo/JSON/3D, dependent failure, stale preview, compact modal');
 }finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
