const assert=require('node:assert/strict'),path=require('path'),Cut=require('../src/counter-cut.js');
const box=(x,y,w,h)=>[{x,y},{x:x+w,y},{x:x+w,y:y+h},{x,y:y+h}];
const base=box(0,0,400,60),hole=box(100,0,75,70);
assert.equal(Cut.difference(base,[]).area,24000);
assert.equal(Cut.difference(base,[hole]).area,19500);
assert.equal(Cut.difference(base,[hole,hole]).area,19500);
assert.equal(Cut.difference(base,[hole,box(150,0,75,70)]).area,16500);
assert.equal(Cut.difference(base,[box(-40,0,75,70)]).area,21900);
assert.equal(Cut.difference(base,[box(-10,-10,500,100)]).area,0);
assert.equal(Cut.difference(base,[box(500,0,75,70)]).area,24000);
assert.equal(Cut.difference(base,[hole]).contains({x:120,y:20}),false);
assert.equal(Cut.difference(base,[hole]).contains({x:80,y:20}),true);
const rotated=Cut.footprint({x:250,y:250,w:75,d:70,angle:37});assert.ok(Math.abs(Cut.difference(box(0,0,500,500),[rotated]).area-(250000-5250))<1e-6);
let pw;try{pw=require('playwright')}catch{pw=require(path.resolve(path.dirname(process.execPath),'../node_modules/playwright'))}
(async()=>{
 const b=await pw.chromium.launch({headless:true,executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'}),p=await b.newPage({viewport:{width:1600,height:1050}}),errors=[];p.on('pageerror',e=>errors.push(e.message));await p.goto(require('url').pathToFileURL(path.resolve('dist/plan_studio.html')).href);
 await p.evaluate(()=>{Studio.loadProject({v:'5',n:[{id:'a',x:0,y:0},{id:'b',x:500,y:0},{id:'c',x:500,y:400},{id:'d',x:0,y:400}],s:[{id:'ab',n1:'a',n2:'b',k:10},{id:'bc',n1:'b',n2:'c',k:10},{id:'cd',n1:'c',n2:'d',k:10},{id:'da',n1:'d',n2:'a',k:10}],e:[],r:[]});G.counters=[Kitchen.make(Kitchen.pick({x:200,y:10}),0,400,'start',240)];draw();});
 const at=async(x,y)=>p.evaluate(({x,y})=>{const r=cv.getBoundingClientRect(),a=toCv(x,y);return {x:r.left+a.x,y:r.top+a.y};},{x,y});
 const click=async(x,y)=>{const a=await at(x,y);await p.mouse.click(a.x,a.y);};
 // Orientation and rear alignment on all four walls and both L legs.
 const orientations=await p.evaluate(()=>{const old=G.counters,out=[];for(const [point,place] of [[{x:200,y:10},{x:200,y:40}],[{x:490,y:200},{x:460,y:200}],[{x:200,y:390},{x:200,y:360}],[{x:10,y:200},{x:40,y:200}]]){G.counters=[Kitchen.make(Kitchen.pick(point),0,380,'none',180)];out.push(Kitchen.snapFixture({kind:'fridge',w:75,d:70},place));}G.counters=old;out.push(Kitchen.snapFixture({kind:'fridge',w:75,d:70},{x:35,y:150}));return out;});
 assert.deepEqual(orientations.map(o=>o.angle),[0,90,180,270,270]);assert.equal(orientations[0].y,40);assert.equal(orientations[1].x,460);assert.equal(orientations[2].y,360);assert.equal(orientations[3].x,40);assert.equal(orientations[4].x,40);
 const before=await p.evaluate(()=>({area:Kitchen.effective(G.counters[0]).area,state:Studio.state()}));
 await p.click('#t-kitchen');await p.click('[data-product="fridge"]');await p.locator('#fixtureDialog button[type=submit]').click();await click(360,48);
 let f=await p.evaluate(()=>G.fixtures[0]);assert.equal(f.y,40);assert.equal(f.angle,0);assert.equal(await p.evaluate(()=>Kitchen.effective(G.counters[0]).area),before.area-4500);
 // Real drag to the vertical L leg: rear aligns to x=5, front to x=75.
 let a=await at(f.x,f.y),dest=await at(42,150);await p.mouse.move(a.x,a.y);await p.mouse.down();await p.mouse.move(dest.x,dest.y,{steps:5});await p.mouse.up();
 f=await p.evaluate(()=>G.fixtures[0]);assert.equal(f.x,40);assert.equal(f.angle,270);assert.equal(await p.evaluate(()=>Kitchen.effective(G.counters[0]).area),before.area-4500);
 assert.equal(await p.evaluate(()=>Kitchen.effective(G.counters[0]).contains({x:350,y:30})),true);
 assert.equal(await p.evaluate(()=>Kitchen.effective(G.counters[0]).contains({x:30,y:150})),false);
 await p.evaluate(()=>geriAl());assert.equal(await p.evaluate(()=>G.fixtures[0].angle),0);await p.evaluate(()=>ileriAl());assert.equal(await p.evaluate(()=>G.fixtures[0].angle),270);
 const saved=await p.evaluate(()=>Studio.state());await p.evaluate(d=>Studio.loadProject(d),saved);assert.equal(await p.evaluate(()=>Kitchen.effective(G.counters[0]).area),before.area-4500);assert.deepEqual(await p.evaluate(()=>G.counters),before.state.counters);
 await p.evaluate(()=>{G.secili=G.fixtures[0];G.seciliTip='fixture';Fixtures.remove();});assert.equal(await p.evaluate(()=>Kitchen.effective(G.counters[0]).area),before.area);await p.evaluate(()=>geriAl());
 // Click-to-move also snaps; moving away restores the full original counter.
 await p.evaluate(()=>{G.secili=G.fixtures[0];G.seciliTip='fixture';Fixtures.move();});await click(230,250);assert.equal(await p.evaluate(()=>Kitchen.effective(G.counters[0]).area),before.area);
 await p.evaluate(()=>{G.secili=G.fixtures[0];G.seciliTip='fixture';Fixtures.move();});await click(200,40);assert.equal(await p.evaluate(()=>Kitchen.effective(G.counters[0]).area),before.area-4500);
 assert.equal(await p.evaluate(()=>Kitchen.effective(G.counters[0]).contains({x:200,y:30})),false);
 await p.evaluate(()=>{G.secili=null;G.seciliTip=null;draw();});await p.screenshot({path:'artifacts/fridge-counter-5.9.12.png'});
 const dl=p.waitForEvent('download');await p.evaluate(()=>pngIndir());await p.locator('#exportSubmit').click();await(await dl).saveAs('artifacts/fridge-counter-export-5.9.12.png');
 assert.deepEqual(await p.evaluate(()=>({n:Studio.state().n,s:Studio.state().s})),{n:before.state.n,s:before.state.s});assert.deepEqual(errors,[]);
 console.log('PASS refrigerator rear alignment and orientation, four walls, L leg, drag/click move, cut area, restoration, undo/redo, JSON, PNG, overlapping and rotated cuts');await b.close();
})().catch(e=>{console.error(e);process.exit(1)});
