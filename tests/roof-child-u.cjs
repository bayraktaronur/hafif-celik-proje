const assert=require('node:assert/strict'),path=require('node:path'),{pathToFileURL}=require('node:url'),C=require('../src/roof-core');
const points=[{x:200,y:830},{x:200,y:1100},{x:500,y:1100},{x:500,y:830}];
for(const angle of [0,90,180,270])for(const reverse of [false,true]){
 const frame={x:2000,y:2000,angle},parent=C.defaults({...frame,id:'main',w:1000,d:800,datum:'eave'}),ps=points.map(p=>C.transform(frame,p));if(reverse)ps.reverse();
 const child=C.connectChild(C.defaults({id:'child',datum:'eave',childJoin:{points:ps},production:{role:'child',parentId:'main',relative:90}}),parent);
 assert.equal(child.angle,(angle+270)%360);assert.ok(child.w>440);assert.deepEqual(child.childJoin.support,ps);C.validate([parent,child]);const m=C.calculate([parent,child]);assert.ok(m.lengths.valley>0);assert.ok(!m.lengths.step,'joined surfaces must not have a vertical step');
 const before=JSON.stringify(child);assert.throws(()=>C.connectChild({...child,h:900},parent));assert.equal(JSON.stringify(child),before);
 const bad=structuredClone(child);bad.childJoin.points[0].y+=3;assert.throws(()=>C.connectChild(bad,parent));
}
// Regression: a second U on the gable end has no uphill host gradient.
for(const angle of [0,90,180,270])for(const reverse of [false,true]){
 const frame={x:2000,y:2000,angle},parent=C.defaults({...frame,id:'main',w:1056.75,d:773,datum:'eave'});
 const points=[{x:-30,y:0},{x:-550,y:0},{x:-550,y:627.5},{x:-30,y:627.5}].map(p=>C.transform(frame,p));if(reverse)points.reverse();
 const child=C.connectChild(C.defaults({id:'side',datum:'eave',childJoin:{points},production:{role:'child',parentId:'main',relative:0}}),parent);
 assert.equal(child.childJoin.mode,'gable');assert.equal(child.angle,angle);assert.ok(Math.abs(child.w-520)<.001);assert.ok(child.childJoin.cladding.length>0);C.validate([parent,child]);
 const m=C.calculate([parent,child]);assert.ok(Math.abs(m.planArea-(1116.75*833+550*687.5)/10000)<.001);
 assert.ok(child.childJoin.cladding.every(poly=>poly.every(p=>Math.abs(C.untransform(child,p).x-520)<.001)));
 const bad=structuredClone(child);bad.childJoin.points[2].x+=20;assert.throws(()=>C.connectChild(bad,parent));
}
{
 const parent=C.defaults({id:'p',w:617.5,d:454.25,datum:'eave'});
 const child=C.connectChild(C.defaults({id:'c',datum:'eave',childJoin:{points:[{x:315,y:-30},{x:315,y:-188.25},{x:627.5,y:-188.25},{x:627.5,y:-30}]},production:{role:'child',relative:90,parentId:'p'}}),parent);
 assert.ok(child.childJoin.cornerTrimmed);assert.ok(Math.abs(child.eaves[2]-20)<.001);assert.ok(C.calculate([parent,child]).lengths.valley>0);assert.ok(!C.calculate([parent,child]).lengths.step);assert.deepEqual(C.connectChild(child,parent),child);
}
let pw;try{pw=require('playwright')}catch{pw=require(path.resolve(path.dirname(process.execPath),'../node_modules/playwright'))}
(async()=>{const browser=await pw.chromium.launch({headless:true,executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'});try{
 const page=await browser.newPage({viewport:{width:1800,height:1100}}),errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto(pathToFileURL(path.resolve('dist/plan_studio.html')).href);
 await page.evaluate(()=>{Studio.loadProject({v:'5',sistem:'prefabrik',n:[],s:[],e:[],r:[]});RoofStudio.open();RoofStudio.add(RoofStudio.make({id:'main',w:1000,d:800,h:280,datum:'eave',production:{role:'main',parentId:'',relative:0}}));G.nodes.push({id:'extent',x:1000,y:1400});RoofStudio.fit();});
 await page.fill('#roofDrawHeight','280');await page.click('#roofBoundaryChild');assert.ok(await page.locator('#roofBoundaryFinish').isDisabled());assert.ok(await page.locator('#roofBoundaryBack').isDisabled());assert.match(await page.locator('#roofHint').innerText(),/1\/4/);const q=await page.evaluate(()=>RoofWorkflow.snap({x:200,y:827}));assert.equal(q.y,830);
 for(const pt of points){const p=await page.evaluate(p=>{const q=RoofStudio.canvasPoint(p),r=document.getElementById('roofCanvas').getBoundingClientRect();return{x:q.x+r.left,y:q.y+r.top};},pt);await page.mouse.click(p.x,p.y);}
 assert.ok(await page.locator('#roofBoundaryFinish').isEnabled());await page.click('#roofBoundaryBack');assert.ok(await page.locator('#roofBoundaryFinish').isDisabled());assert.match(await page.locator('#roofHint').innerText(),/4\/4/);await page.evaluate(()=>{RoofWorkflow.getDraft().points.push({x:500,y:830});RoofWorkflow.hint('plan');});await page.click('#roofBoundaryFinish');assert.equal(await page.evaluate(()=>G.roofs.length),2,await page.locator('#roofNotice').innerText());
 assert.equal(await page.evaluate(()=>G.roofs[1].angle),270);assert.ok(await page.locator('#roofTurn').isDisabled());
 const frames=await page.evaluate(()=>RoofWorkflow.trusses(G.roofs[1]));assert.ok(frames.length);assert.ok(frames.every(t=>Math.min(t.p.y,t.q.y)>=830-.01),'penetration must not extend support region');
 const saved=await page.evaluate(()=>Studio.state());await page.evaluate(d=>Studio.loadProject(d),saved);assert.deepEqual(await page.evaluate(()=>G.roofs),saved.roofs);
 const snap=await page.evaluate(()=>Studio.snapshot());const ok=await page.evaluate(()=>RoofStudio.commit(()=>{G.roofs[1].h=900;}));assert.equal(ok,false);assert.equal(await page.evaluate(()=>Studio.snapshot()),snap);
 await page.evaluate(()=>{G.nodes.push({id:'frontA',x:200,y:1100},{id:'frontB',x:500,y:1100});G.segs.push({id:'frontWall',n1:'frontA',n2:'frontB',k:10});RoofStudio.open();RoofStudio.notice('U bağlantısı: ana yüzeyle kesişim tamamlandı.');RoofStudio.setView('3d');});
 const cladding=await page.evaluate(()=>RoofStudio.planStructure().filter(f=>f.kind==='cladding'&&f.roofBoundary&&f.zone===G.roofs[1].id));assert.ok(cladding.length>=2);const wallTop=await page.evaluate(()=>G.opt.h);assert.ok(cladding.every(f=>f.poly.every(p=>p.z>=wallTop)));assert.ok(cladding.some(f=>f.poly.some(p=>p.z>320)));
await page.screenshot({path:'artifacts/roof-child-u-3d.png'});
 await page.evaluate(()=>{RoofStudio.setView('plan');G.nodes.push({id:'leftExtent',x:-600,y:0});RoofStudio.fit();});
 await page.click('#roofBoundaryChild');for(const pt of [{x:-30,y:0},{x:-550,y:0},{x:-550,y:620},{x:-30,y:620}]){const p=await page.evaluate(p=>{const q=RoofStudio.canvasPoint(p),r=document.getElementById('roofCanvas').getBoundingClientRect();return{x:q.x+r.left,y:q.y+r.top};},pt);await page.mouse.click(p.x,p.y);}
 await page.click('#roofBoundaryFinish');assert.equal(await page.evaluate(()=>G.roofs.length),3,await page.locator('#roofNotice').innerText());
 assert.equal(await page.evaluate(()=>G.roofs[2].childJoin.mode),'gable');assert.equal(await page.evaluate(()=>G.roofs[2].angle),0);assert.equal(await page.evaluate(()=>G.roofs[1].childJoin.mode),'valley');
 const three=await page.evaluate(()=>Studio.state());await page.evaluate(()=>geriAl());assert.equal(await page.evaluate(()=>G.roofs.length),2);await page.evaluate(()=>ileriAl());assert.equal(await page.evaluate(()=>G.roofs.length),3);
 await page.evaluate(d=>Studio.loadProject(d),three);assert.deepEqual(await page.evaluate(()=>G.roofs),three.roofs);
 assert.ok(await page.evaluate(()=>RoofStudio.planStructure().some(f=>f.kind==='cladding'&&f.zone===G.roofs[2].id)));
 await page.evaluate(()=>{RoofStudio.open();RoofStudio.setView('3d');});await page.screenshot({path:'artifacts/roof-second-child-gable.png'});assert.deepEqual(errors,[]);
 console.log('PASS U drawing and host snap, four inward directions, reverse traversal, continuous valleys, impossible join rejection, support frames, direction lock and persistence');
 }finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
