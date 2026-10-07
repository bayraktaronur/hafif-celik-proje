const assert=require('node:assert/strict'),path=require('path'),fs=require('fs');let pw;try{pw=require('playwright')}catch{pw=require(path.resolve(path.dirname(process.execPath),'../node_modules/playwright'))}
(async()=>{const b=await pw.chromium.launch({headless:true,executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'});const p=await b.newPage({viewport:{width:1500,height:1000}});const errors=[];p.on('pageerror',e=>errors.push(e.message));await p.goto(require('url').pathToFileURL(path.resolve('dist/plan_studio.html')).href);await p.evaluate(()=>{Studio.loadProject({v:'5',n:[{id:'n1',x:0,y:0},{id:'n2',x:400,y:0},{id:'n3',x:400,y:300},{id:'n4',x:0,y:300}],s:[{id:'s1',n1:'n1',n2:'n2',k:10},{id:'s2',n1:'n2',n2:'n3',k:10},{id:'s3',n1:'n3',n2:'n4',k:10},{id:'s4',n1:'n4',n2:'n1',k:10}],e:[],r:[]});G.rooms[0].tip='banyo';draw();});
await p.click('#t-fixture');await p.selectOption('#fixtureKind','shower');await p.selectOption('#fixturePreset','80/100');await p.locator('#fixtureDialog button[type=submit]').click();
const pos=await p.evaluate(()=>{const r=cv.getBoundingClientRect(),p=toCv(110,100);return {x:r.left+p.x,y:r.top+p.y}});await p.mouse.move(pos.x,pos.y);await p.keyboard.press('r');await p.keyboard.press('m');await p.mouse.click(pos.x,pos.y);
let f=await p.evaluate(()=>Studio.state().fixtures[0]);assert.equal(f.w,80);assert.equal(f.d,100);assert.equal(f.angle,90);assert.equal(f.mirror,true);assert.equal(f.x,110);assert.equal(f.y,100);assert.equal(await p.evaluate(()=>G.segs.length),4);
await p.evaluate(()=>Fixtures.rotate());assert.equal(await p.evaluate(()=>G.fixtures[0].angle),180);await p.evaluate(()=>geriAl());assert.equal(await p.evaluate(()=>G.fixtures[0].angle),90);await p.evaluate(()=>ileriAl());assert.equal(await p.evaluate(()=>G.fixtures[0].angle),180);
await p.mouse.move(pos.x,pos.y);await p.mouse.down();await p.mouse.move(pos.x+32,pos.y+21);await p.mouse.up();assert.notEqual(await p.evaluate(()=>G.fixtures[0].x),110);
await p.evaluate(()=>{G.secili=G.fixtures[0];G.seciliTip='fixture';updateSidebar();});
await p.fill('#fixtureEditW','90');await p.fill('#fixtureEditD','110');await p.evaluate(()=>Fixtures.resize());assert.equal(await p.evaluate(()=>G.fixtures[0].w),90);assert.equal(await p.evaluate(()=>G.fixtures[0].d),110);
await p.evaluate(()=>{Fixtures.snap(0);Fixtures.move();});const free=await p.evaluate(()=>{const r=cv.getBoundingClientRect(),p=toCv(135.25,111.75);return {x:r.left+p.x,y:r.top+p.y}});await p.mouse.click(free.x,free.y);assert.ok(Math.abs((await p.evaluate(()=>G.fixtures[0].x))-135.25)<1, String(await p.evaluate(()=>G.fixtures[0].x)));
assert.equal(await p.evaluate(()=>Number.isInteger(G.fixtures[0].x)),false);
// Real pointer/keyboard regressions for both fixture move workflows.
for(const snap of [0,1])for(const [dx,dy,axis] of [[8,-45,'y'],[-8,45,'y'],[45,8,'x'],[-45,-8,'x']]){
 const before=await p.evaluate(snap=>{Fixtures.snap(snap);return {...G.fixtures[0]};},snap);
 const at=await p.evaluate(f=>{const r=cv.getBoundingClientRect(),a=toCv(f.x,f.y);return {x:r.left+a.x,y:r.top+a.y,scale:sc()};},before);
 await p.mouse.move(at.x,at.y);await p.mouse.down();await p.keyboard.down('Shift');await p.mouse.move(at.x+dx*at.scale,at.y+dy*at.scale);await p.mouse.up();await p.keyboard.up('Shift');
 const after=await p.evaluate(()=>G.fixtures[0]);assert.equal(after[axis==='y'?'x':'y'],before[axis==='y'?'x':'y']);assert.ok(Math.abs(after[axis]-before[axis])>35);await p.evaluate(()=>geriAl());
}
for(const release of [false,true]){
 const before=await p.evaluate(()=>{G.secili=G.fixtures[0];G.seciliTip='fixture';Fixtures.move();return {...G.fixtures[0]};});
 const at=await p.evaluate(f=>{const r=cv.getBoundingClientRect(),a=toCv(f.x+12,f.y-40);return {x:r.left+a.x,y:r.top+a.y};},before);
 await p.keyboard.down('Shift');await p.mouse.move(at.x,at.y);if(release)await p.keyboard.up('Shift');await p.mouse.click(at.x,at.y);await p.keyboard.up('Shift');const after=await p.evaluate(()=>G.fixtures[0]);
 if(release)assert.ok(Math.abs(after.x-before.x)>5);else assert.equal(after.x,before.x);assert.ok(after.y<before.y-30);await p.evaluate(()=>geriAl());
}
console.log('PASS fixture Shift lock in four directions, free/1 cm snapping, click-to-move and Shift release');
const saved=await p.evaluate(()=>Studio.state());await p.evaluate(d=>Studio.loadProject(d),saved);assert.deepEqual(await p.evaluate(()=>Studio.state().fixtures),saved.fixtures);
await p.screenshot({path:'artifacts/bathroom-fixtures.png'});
await p.evaluate(()=>{G.secili=G.fixtures[0];G.seciliTip='fixture';Fixtures.remove();});assert.equal(await p.evaluate(()=>G.fixtures.length),0);await p.evaluate(()=>geriAl());assert.equal(await p.evaluate(()=>G.fixtures.length),1);
const download=p.waitForEvent('download');await p.evaluate(()=>pngIndir());await p.locator('#exportSubmit').click();await (await download).saveAs('artifacts/bathroom-fixtures-export.png');assert.deepEqual(errors,[]);
await p.click('#t-fixture');for(const kind of ['wallwc','wc','basin','vanity','shower']){await p.selectOption('#fixtureKind',kind);if(['vanity','shower'].includes(kind)){await p.fill('#fixtureWidth','60');await p.fill('#fixtureDepth','70');}else{assert.equal(await p.locator('#fixtureWidth').isVisible(),false);assert.equal(await p.locator('#fixtureDepth').isVisible(),false);}assert.equal(await p.locator('#fixturePreview canvas').count(),1);}await p.click('#fixtureCancel');
for(const [kind,w,d,x] of [['basin',44.52,38.97,210],['wallwc',36.07,57.61,275],['wc',36.07,65.98,340]]){
 await p.click('#t-fixture');await p.selectOption('#fixtureKind',kind);await p.locator('#fixtureDialog button[type=submit]').click();const at=await p.evaluate(x=>{const r=cv.getBoundingClientRect(),p=toCv(x,90);return {x:r.left+p.x,y:r.top+p.y};},x);await p.mouse.click(at.x,at.y);const f=await p.evaluate(()=>G.fixtures.at(-1));assert.equal(f.w,w);assert.equal(f.d,d);assert.equal(await p.locator('#fixtureEditW').count(),0);
}
await p.evaluate(()=>{G.secili=null;G.seciliTip=null;draw();});await p.screenshot({path:'artifacts/standard-fixtures.png'});
const noLabels=await p.evaluate(()=>{const text=[],old=ctx.fillText;ctx.fillText=function(t,...args){text.push(t);return old.call(this,t,...args);};drawElemanlar();ctx.fillText=old;return text;});assert.deepEqual(noLabels,[]);
const labelSide=await p.evaluate(()=>{G.elemanlar.push({id:'window-test',tip_:'pencere',segId:'s1',t:.2,en:80,yuk:125});const points=[],old=ctx.fillText;ctx.fillText=function(t,x,y){if(t==='80/125'){const m=this.getTransform();points.push(m.f);}return old.call(this,t,x,y);};draw();ctx.fillText=old;return {y:points[0],wall:toCv(0,0).y*(devicePixelRatio||1)};});assert.ok(labelSide.y<labelSide.wall);
// Washer uses physical dimensions without dimension text and survives file reload.
await p.click('#t-fixture');await p.selectOption('#fixtureKind','washer');
assert.equal(await p.locator('#fixtureWidth').isVisible(),false);
await p.locator('#fixtureDialog button[type=submit]').click();
const washerAt=await p.evaluate(()=>{const r=cv.getBoundingClientRect(),a=toCv(220,210);return {x:r.left+a.x,y:r.top+a.y};});
await p.mouse.click(washerAt.x,washerAt.y);
const washer=await p.evaluate(()=>G.fixtures.at(-1));assert.equal(washer.kind,'washer');assert.equal(washer.w,60);assert.equal(washer.d,60);
await p.evaluate(()=>{Fixtures.rotate();Fixtures.mirror();});
const washerSaved=await p.evaluate(()=>Studio.state());await p.evaluate(d=>Studio.loadProject(d),washerSaved);
assert.deepEqual(await p.evaluate(()=>Studio.state().fixtures),washerSaved.fixtures);
const washerText=await p.evaluate(()=>{G.secili=null;G.seciliTip=null;const labels=[],old=ctx.fillText;ctx.fillText=function(t,...a){if(t==='Ç.M'){const m=this.getTransform();labels.push({t,a:m.a,b:m.b,c:m.c,d:m.d});}return old.call(this,t,...a);};draw();ctx.fillText=old;return labels;});
assert.equal(washerText.length,1);assert.ok(washerText[0].a>0&&washerText[0].d>0);assert.ok(Math.abs(washerText[0].b)<1e-8&&Math.abs(washerText[0].c)<1e-8);
await p.screenshot({path:'artifacts/washer-5.9.10.png'});
await p.evaluate(()=>{G.secili=G.fixtures.at(-1);G.seciliTip='fixture';Fixtures.remove();geriAl();});
assert.equal(await p.evaluate(()=>G.fixtures.at(-1).kind),'washer');
assert.equal(await p.evaluate(()=>G.segs.length),4);
assert.deepEqual(errors,[]);
console.log('PASS fixture placement, physical size, rotation, mirror, drag, undo/redo, persistence, delete and PNG');await b.close();})().catch(e=>{console.error(e);process.exit(1)});

