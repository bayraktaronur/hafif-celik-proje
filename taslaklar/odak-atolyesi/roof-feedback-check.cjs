const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),crypto=require('node:crypto'),{pathToFileURL}=require('node:url');
const root=path.resolve(__dirname,'../..'),C=require(path.join(root,'src/roof-core.js'));
const source=fs.readFileSync(path.join(root,'src/roof-core.js'),'utf8'),context={module:{exports:{}},console};vm.createContext(context);
const once=(s,a,b)=>{assert.equal(s.split(a).length,2,a);return s.replace(a,b);};
vm.runInContext(require('./roof-feedback-build.cjs')('src/roof-core.js',source,once),context);const D=context.module.exports,plain=x=>JSON.parse(JSON.stringify(x));
const make=(width,pitch,angle=0)=>{const frame={x:2000,y:2000,angle},parent=C.defaults({...frame,id:'p',w:1892.5,d:753.5,h:250,datum:'trim',eaves:[22,22,30,30]}),points=[{x:0,y:-30},{x:0,y:-135},{x:width,y:-135},{x:width,y:-30}].map(p=>C.transform(frame,p));return {parent,child:C.defaults({id:'c',h:250,datum:'trim',pitch,eaves:[22,0,30,30],childJoin:{points},production:{role:'child',parentId:'p',relative:90}})};};
for(const angle of [0,90,180,270])for(const reverse of [false,true])for(const [width,pitch]of [[1014,24],[753.5,33],[600,33],[300,33]]){
 const {child,parent}=make(width,pitch,angle);if(reverse)child.childJoin.points.reverse();
 assert.deepEqual(plain(D.connectChild(child,parent)),plain(C.connectChild(child,parent)));
}
for(const angle of [0,90,180,270])for(const reverse of [false,true]){
 const {child,parent}=make(1014,33,angle);if(reverse)child.childJoin.points.reverse();
 const before=JSON.stringify({child,parent});assert.throws(()=>C.connectChild(child,parent));
 assert.throws(()=>D.connectChild(child,parent),e=>{assert.equal(e.code,'roof-child-intersection');assert.ok(e.details.childHeight>e.details.parentPeak);assert.match(e.message,/U uçları bağlı/);assert.ok(Math.abs(e.details.parentPeak-396.2275)<.001);return true;});assert.equal(JSON.stringify({child,parent}),before);
}
for(const angle of [0,90,180,270]){
 const frame={x:2000,y:2000,angle},parent=C.defaults({...frame,id:'p',w:1000,d:800,datum:'trim'}),child=C.defaults({id:'c',datum:'trim',childJoin:{points:[{x:-30,y:0},{x:-400,y:0},{x:-400,y:500},{x:-30,y:500}].map(p=>C.transform(frame,p))},production:{role:'child',parentId:'p',relative:0}});
 assert.deepEqual(plain(D.connectChild(child,parent)),plain(C.connectChild(child,parent)));
}
{const {child,parent}=make(600,33);child.childJoin.points[1].y+=3;assert.throws(()=>D.connectChild(child,parent),e=>e.code==='roof-child-rectangle');}
console.log('PASS unchanged geometry: 32 valid valley joins + 4 gable joins; 8 impossible joins identify height, malformed boundary separate');
const {chromium}=require(path.resolve(path.dirname(process.execPath),'../node_modules/playwright'));
const hash=p=>crypto.createHash('sha256').update(fs.readFileSync(path.join(root,p))).digest('hex');
const protectedNames=[...Object.keys(JSON.parse(fs.readFileSync(path.join(__dirname,'single-engine-manifest.json'))).sources),'dist/plan_studio.html','taslaklar/odak-atolyesi/arakat.html'],before=Object.fromEntries(protectedNames.map(p=>[p,hash(p)]));
(async()=>{const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'});try{
 const page=await browser.newPage({viewport:{width:1600,height:1000}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(pathToFileURL(path.join(__dirname,'index.html')).href);
 await page.evaluate(()=>{
  Studio.loadProject({v:'5',sistem:'prefabrik',catiYon:'dikey',opt:{h:250},n:[{id:'a',x:246.5,y:0},{id:'b',x:1135,y:0},{id:'c',x:1135,y:1014},{id:'d',x:246.5,y:1892.5}],s:[],e:[],r:[]});
  SingleStorey.show('roof');RoofStudio.add(RoofStudio.make({id:'parent',name:'Ana çatı 1',x:1000,y:0,angle:90,w:1892.5,d:753.5,h:250,wallTop:250,pitch:33,eaves:[22,22,30,30],eaveRule:{gableMm:220,sideMm:300},production:{role:'main',parentId:'',relative:0}}));RoofStudio.fit();
 });
 const saved=await page.evaluate(()=>Studio.state());
 await page.locator('details').filter({has:page.locator('#roofBoundaryChild')}).locator('summary').first().click();
 await page.click('#roofBoundaryChild');
 async function click(x,y){const p=await page.evaluate(p=>{const v=RoofStudio.canvasPoint(p),r=document.getElementById('roofCanvas').getBoundingClientRect();return{x:v.x+r.left,y:v.y+r.top};},{x,y});await page.mouse.click(p.x,p.y);}
 for(const [x,y]of [[1030,0],[1135,0],[1135,1014]])await click(x,y);
 // Fourth click must actually touch the selected host edge.
 await click(1135,1014);assert.equal(await page.evaluate(()=>RoofWorkflow.getDraft().points.length),3);
 await click(1030,1014);assert.equal(await page.evaluate(()=>RoofWorkflow.getDraft().points.length),4);
 const result=await page.evaluate(()=>SingleRoofFeedback.result());assert.equal(result.code,'roof-child-intersection');
 assert.equal(await page.locator('#singleRoofFeedback').getAttribute('data-state'),'blocked');assert.ok(await page.locator('#roofBoundaryFinish').isDisabled());
 assert.deepEqual(await page.evaluate(()=>Studio.state()),saved);assert.match(await page.locator('#roofNotice').innerText(),/ana çatının en yüksek kotu/);
 // Moving the pointer after completion must not create a misleading fifth snap/point.
 await click(1150,850);await page.keyboard.press('Enter');assert.equal(await page.evaluate(()=>G.roofs.length),1);
 await page.evaluate(()=>{window.__roofLabels=[];const c=document.getElementById('roofCanvas').getContext('2d'),original=c.fillText;c.fillText=function(t,...a){window.__roofLabels.push(t);return original.call(this,t,...a);};});
 await page.mouse.move(1250,500);await page.evaluate(()=>RoofStudio.repaint());await page.waitForTimeout(70);
 assert.ok(!(await page.evaluate(()=>window.__roofLabels)).some(s=>String(s).includes('Bağlantı kenarındaki hedefi yakalayın')));
 await page.locator('#singleRoofFeedback').scrollIntoViewIfNeeded();await page.screenshot({path:path.join(root,'artifacts/roof-feedback-blocked.png')});
 const points=await page.evaluate(()=>RoofWorkflow.getDraft().points);
 await page.fill('#roofDrawPitch','');assert.ok(await page.locator('#roofBoundaryFinish').isDisabled());assert.match(await page.locator('#singleRoofFeedback').innerText(),/1–200/);
 await page.fill('#roofDrawPitch','24');assert.deepEqual(await page.evaluate(()=>RoofWorkflow.getDraft().points),points);assert.deepEqual(await page.evaluate(()=>Studio.state()),saved);
 assert.ok(await page.locator('#roofBoundaryFinish').isEnabled());assert.equal(await page.locator('#singleRoofFeedback').getAttribute('data-state'),'ready');
 await page.selectOption('#roofBoundaryType','kirma');assert.ok(await page.locator('#roofBoundaryFinish').isDisabled());assert.match(await page.locator('#singleRoofFeedback').innerText(),/beşik veya tek eğim/);
 await page.selectOption('#roofBoundaryType','besik');await page.fill('#roofDrawSide','');assert.ok(await page.locator('#roofBoundaryFinish').isDisabled());await page.fill('#roofDrawSide','300');assert.ok(await page.locator('#roofBoundaryFinish').isEnabled());
 await page.click('#roofBoundaryBack');assert.equal(await page.evaluate(()=>RoofWorkflow.getDraft().points.length),3);assert.ok(await page.locator('#roofBoundaryFinish').isDisabled());await click(1030,1014);assert.ok(await page.locator('#roofBoundaryFinish').isEnabled());assert.deepEqual(await page.evaluate(()=>Studio.state()),saved);
 await page.locator('#singleRoofFeedback').scrollIntoViewIfNeeded();await page.screenshot({path:path.join(root,'artifacts/roof-feedback-ready.png')});
 await page.click('#roofBoundaryFinish');assert.equal(await page.evaluate(()=>G.roofs.length),2);assert.equal(await page.evaluate(()=>RoofWorkflow.getDraft()),null);
 assert.deepEqual(await page.evaluate(()=>G.roofs[0]),saved.roofs[0]);assert.equal(await page.evaluate(()=>G.roofs[1].pitch),24);assert.ok(await page.evaluate(()=>RoofStudio.model().lengths.valley>0));
 const done=await page.evaluate(()=>Studio.state());await page.evaluate(()=>geriAl());assert.equal(await page.evaluate(()=>G.roofs.length),1);await page.evaluate(()=>ileriAl());assert.deepEqual(await page.evaluate(()=>Studio.state()),done);
 await page.evaluate(d=>Studio.loadProject(d),done);assert.deepEqual(await page.evaluate(()=>Studio.state()),done);
 await page.click('#single-model');await page.waitForTimeout(100);await page.screenshot({path:path.join(root,'artifacts/roof-feedback-3d.png')});
 await page.click('#single-roof');await page.click('#roofBoundaryChild');await click(1030,1400);await page.keyboard.press('Escape');assert.ok(await page.locator('#singleRoofFeedback').isHidden());
 assert.deepEqual(await page.evaluate(()=>Studio.state()),done);assert.deepEqual(errors,[]);
 for(const [p,h]of Object.entries(before))assert.equal(hash(p),h,p);
 console.log('PASS real 4-click failure with explanation, unchanged plan, no fifth snap, live pitch correction without redrawing, successful valley, undo/redo/JSON/3D/cancel, protected sources unchanged');
 }finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
