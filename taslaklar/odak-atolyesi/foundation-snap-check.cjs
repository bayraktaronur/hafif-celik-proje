const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),{pathToFileURL}=require('node:url');
require('./foundation-reference.js');const F=global.FoundationReference,approx=(a,b)=>assert.ok(Math.abs(a-b)<1e-5,`${a} != ${b}`),same=(a,b)=>{approx(a.x,b.x);approx(a.y,b.y);};
const poly=p=>p.map(([x,y])=>({x,y})),square=(x,y,w,h)=>poly([[x,y],[x+w,y],[x+w,y+h],[x,y+h]]),area=p=>p.reduce((s,a,i)=>{const b=p[(i+1)%p.length];return s+a.x*b.y-a.y*b.x;},0)/2;
for(const input of [[square(0,0,100,10),square(90,0,10,100)],[square(90,0,10,100).reverse(),square(0,0,100,10).reverse()]]){const loops=F.contours(input);assert.equal(loops.length,1);approx(area(loops[0]),1900);assert.ok(loops[0].some(p=>p.x===90&&p.y===10));}
const ring=F.contours([square(0,0,100,10),square(90,0,10,100),square(0,90,100,10),square(0,0,10,100)]);assert.equal(ring.length,2);approx(ring.reduce((s,p)=>s+area(p),0),3600);assert.equal(ring.filter(p=>area(p)>0).length,1);
assert.equal(F.contours([square(0,0,10,10),square(30,0,10,10)]).length,2);
const diag=F.contours([poly([[0,0],[100,100],[90,110],[-10,10]]),poly([[90,110],[100,100],[200,200],[190,210]])]);assert.equal(diag.length,1);approx(area(diag[0]),4000);
const reference={corners:[{x:100.25,y:50.75,snap:'Köşe direği · dış köşe'},{x:300.25,y:50.75,snap:'İç dönüş · dış yüz'}],edges:[{a:{x:100.25,y:50.75},b:{x:300.25,y:50.75}},{a:{x:300.25,y:50.75},b:{x:300.25,y:300}}]};
for(const scale of [.1,.25,1,4,10]){const raw={x:100.25+3/scale,y:50.75+2/scale},q=F.snap(raw,{reference,scale});same(q,reference.corners[0]);assert.match(q.snap,/direği/);same(F.snap({x:300.25+2/scale,y:50.75+2/scale},{reference,scale,anchor:reference.corners[0],ortho:true}),reference.corners[1]);}
same(F.snap({x:300,y:160},{reference,scale:1,anchor:{x:100,y:150},ortho:true}),{x:300.25,y:150});
same(F.snap({x:300,y:50},{reference,scale:1,anchor:{x:100,y:60},ortho:true}),{x:300.25,y:60}); // must not break axis to reach a nearby corner
assert.equal(F.snap({x:120,y:65},{reference,scale:1,enabled:false}).snap,undefined);
console.log('PASS union returns/rings/reversed polygons/diagonal/disconnected solids, corner priority over face, fractional precision, orthogonal intersections at 5 scales');
if(process.argv.includes('--core'))process.exit(0);
const {chromium}=require(path.resolve(path.dirname(process.execPath),'../node_modules/playwright'));
(async()=>{const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'});try{
 const p=await browser.newPage({viewport:{width:1600,height:1000}}),errors=[];p.on('pageerror',e=>errors.push(e.message));p.on('dialog',d=>d.accept());await p.goto(pathToFileURL(path.join(__dirname,'index.html')).href);const start=await p.evaluate(()=>{yeniPlan();return Studio.state();});
 const points=[[0,0],[600,0],[600,300],[400,300],[400,500],[0,500],[0,300]],fixture={...start,sistem:'prefabrik',n:points.map(([x,y],i)=>({id:'n'+i,x,y})),s:[[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,0],[6,3]].map(([a,b],i)=>({id:'s'+i,n1:'n'+a,n2:'n'+b,k:10,kSabit:true,dis:i<7})),e:[],r:[],roofs:[],foundation:null,opt:{...start.opt,h:250,ic:10,dis:10}};
 const pos=async q=>p.evaluate(q=>{const a=FoundationUI.canvasPoint(q),r=document.getElementById('foundationCanvas').getBoundingClientRect();return {x:a.x+r.left,y:a.y+r.top};},q);
 const perimeter=poly([[-5,-5],[605,-5],[605,305],[405,305],[405,505],[-5,505]]);
 for(const direction of ['yatay','dikey'])for(const flip of [false,true]){
  await p.evaluate(({fixture,direction,flip})=>{Studio.loadProject(fixture);G.catiYon=direction;G.nodes.forEach(n=>n.koseTers=flip);draw();}, {fixture,direction,flip});await p.click('#single-foundation');const r=await p.evaluate(()=>FoundationUI.getReference());
  for(const q of perimeter)assert.ok(r.corners.some(c=>Math.hypot(c.x-q.x,c.y-q.y)<1e-5),`${direction}/${flip} missing ${JSON.stringify(q)}: ${JSON.stringify(r.corners)}`);
  assert.ok(r.posts.length>=5);assert.ok(r.joints.some(j=>j.kind==='H'));assert.ok(r.joints.some(j=>j.kind==='U'||j.kind==='H3'));assert.ok(r.corners.some(c=>c.x===405&&c.y===305&&/İç dönüş/.test(c.snap)));
  const before=await p.evaluate(()=>JSON.stringify({nodes:G.nodes,segs:G.segs,bill:panelMetraj()}));
  for(const q of perimeter){const a=await pos(q);await p.mouse.move(a.x+2,a.y+2);await p.mouse.click(a.x+2,a.y+2);}const a=await pos(perimeter[0]);await p.mouse.click(a.x+1,a.y+1);assert.ok(await p.locator('#fdApply').isEnabled());const draft=await p.evaluate(()=>FoundationUI.getDraft());assert.equal(draft.outline.length,6);draft.outline.forEach((q,i)=>same(q,perimeter[i]));
  assert.equal(await p.evaluate(()=>JSON.stringify({nodes:G.nodes,segs:G.segs,bill:panelMetraj()})),before);await p.locator('#foundationCanvas').screenshot({path:path.join(__dirname,'../../artifacts/foundation-snap-perimeter.png')});await p.click('#fdCancel');
 }
 console.log('PASS actual prefab L/T return + post corners; both truss directions/local corner overrides; real pointer snap/closure; wall geometry and panel bill unchanged');
 // A partial edge starting midway on a wall still snaps to an exact face/axis intersection.
 await p.click('#single-foundation');let a=await pos({x:100,y:305});await p.mouse.click(a.x,a.y);a=await pos({x:405,y:305});await p.mouse.move(a.x+2,a.y+2);await p.mouse.click(a.x+2,a.y+2);const partial=await p.evaluate(()=>FoundationUI.getDraft().outline);assert.equal(partial.length,2);same(partial[1],{x:405,y:305});await p.click('#fdCancel');
 // Mouse-wheel zoom must never shift the exact fractional corner into an integer or axis.
 await p.evaluate(d=>{d.n.forEach(n=>{n.x+=.25;n.y+=.75;});Studio.loadProject(d);},fixture);
 for(const delta of [1200,-1200,-1200]){await p.click('#single-foundation');let a=await pos({x:605.25,y:305.75});await p.mouse.move(a.x,a.y);await p.mouse.wheel(0,delta);await p.waitForTimeout(60);a=await pos({x:605.25,y:305.75});await p.mouse.move(a.x+2,a.y+2);assert.match(await p.locator('#fdLive').innerText(),/dış köşe/);await p.mouse.click(a.x+2,a.y+2);same(await p.evaluate(()=>FoundationUI.getDraft().outline[0]),{x:605.25,y:305.75});await p.locator('#foundationCanvas').screenshot({path:path.join(__dirname,'../../artifacts/foundation-snap-corner.png')});await p.click('#fdCancel');}
 console.log('PASS midway alignment and actual mouse wheel: fractional post corner stays exact');
 // Open veranda: unclosed dashed reference still has usable outer return/end corners.
 await p.evaluate(d=>{d.n.push({id:'v1',x:800,y:0},{id:'v2',x:800,y:200});d.s.push({id:'vs1',n1:'n1',n2:'v1',k:10,dis:true,tip:'veranda'},{id:'vs2',n1:'v1',n2:'v2',k:10,dis:true,tip:'veranda'});Studio.loadProject(d);},fixture);await p.click('#single-foundation');assert.ok(await p.evaluate(()=>FoundationUI.getReference().corners.some(c=>c.x===805&&c.y===205)));a=await pos({x:805,y:205});await p.mouse.click(a.x+1,a.y+1);same(await p.evaluate(()=>FoundationUI.getDraft().outline[0]),{x:805,y:205});await p.click('#fdCancel');
 // Existing customer example with many partitions exercises contour complexity.
 await p.evaluate(()=>SingleStorey.loadExample(false));const saved=await p.evaluate(()=>JSON.stringify(Studio.state()));await p.click('#single-foundation');const ref=await p.evaluate(()=>FoundationUI.getReference());assert.ok(ref.posts.length>=4);assert.ok(ref.corners.length>=4);assert.ok(ref.corners.every(q=>Number.isFinite(q.x)&&Number.isFinite(q.y)));await p.locator('#foundationCanvas').screenshot({path:path.join(__dirname,'../../artifacts/foundation-snap-example.png')});assert.equal(await p.evaluate(()=>JSON.stringify(Studio.state())),saved);assert.deepEqual(errors,[]);
 console.log('PASS open veranda end, real prefab example, unchanged persisted project, no browser errors');
 }finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
