const fs=require('fs'),path=require('path'),assert=require('node:assert/strict'),{pathToFileURL}=require('url');let pw;try{pw=require('playwright')}catch{pw=require(path.resolve(path.dirname(process.execPath),'../node_modules/playwright'))}
(async()=>{const b=await pw.chromium.launch({headless:true,executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'});try{const p=await b.newPage({viewport:{width:1500,height:1000}}),errors=[];p.on('pageerror',e=>errors.push(e.message));await p.goto(pathToFileURL(path.resolve('dist/plan_studio.html')).href);await p.evaluate(()=>{Studio.loadProject({v:'5',sistem:'prefabrik',catiYon:'yatay',n:[{id:'a',x:200,y:1100},{id:'b',x:500,y:1100}],s:[{id:'wall',n1:'a',n2:'b',k:10,dis:true}],e:[],r:[]});RoofStudio.open();RoofStudio.add(RoofStudio.make({id:'main',w:1000,d:800,h:280,datum:'eave',production:{role:'main',parentId:'',relative:0}}));RoofStudio.fit();});await p.waitForTimeout(100);
async function click(x,y){const q=await p.evaluate(({x,y})=>{const q=RoofStudio.canvasPoint({x,y}),r=document.getElementById('roofCanvas').getBoundingClientRect();return{x:q.x+r.left,y:q.y+r.top}},{x,y});await p.mouse.move(q.x,q.y);await p.mouse.click(q.x,q.y);}
await p.click('#roofBoundaryChild');await click(202,829);await click(197,1106);await click(507,1106);
// A wrong fourth point must not be accepted, nor close the draft on the first corner.
await click(197,1106);assert.equal(await p.evaluate(()=>RoofWorkflow.getDraft().points.length),3);
await click(508,834);const points=await p.evaluate(()=>RoofWorkflow.getDraft().points);assert.equal(points.length,4);assert.deepEqual(points.map(q=>[q.x,q.y]),[[195,830],[195,1105],[505,1105],[505,830]]);
await p.screenshot({path:'artifacts/roof-child-snap.png'});await p.keyboard.press('Enter');assert.equal(await p.evaluate(()=>G.roofs.length),2);assert.equal(await p.evaluate(()=>RoofWorkflow.getDraft()),null);assert.equal(errors.length,0);console.log('PASS child wall corner preservation, shifted start, exact host return and rejected invalid fourth click');
// Project a distant wall corner onto the constrained U front, in four directions.
for(let turn=0;turn<4;turn++){
 const a=turn*Math.PI/2,T=(x,y)=>({x:Math.cos(a)*x-Math.sin(a)*y,y:Math.sin(a)*x+Math.cos(a)*y});
 await p.evaluate(({turn,a,b})=>{Studio.loadProject({v:'5',sistem:'prefabrik',catiYon:turn%2?'dikey':'yatay',n:[{id:'a',...a},{id:'b',...b}],s:[{id:'wall',n1:'a',n2:'b',k:10,dis:true}],e:[],r:[]});RoofStudio.add(RoofStudio.make({id:'main',w:1000,d:1000,angle:turn*90,h:280,datum:'eave',production:{role:'main',parentId:'',relative:0}}));RoofStudio.open();RoofStudio.fit();},{turn,a:T(1400,200),b:T(1400,600)});
 await p.click('#roofBoundaryChild');
 for(const v of [T(1032,605),T(1200,605)])await click(v.x,v.y);
 const raw=T(1204,198),q=await p.evaluate(v=>RoofWorkflow.snap(v),raw),expected=T(1200,195);
 assert.ok(Math.hypot(q.x-expected.x,q.y-expected.y)<.001,JSON.stringify({turn,q,expected}));assert.equal(q.invalid,false);assert.match(q.snapLabel,/ana kenara dik/);
 await click(raw.x,raw.y);const last=T(1032,197);await click(last.x,last.y);
 const ps=await p.evaluate(()=>RoofWorkflow.getDraft().points);assert.equal(ps.length,4);
 for(let i=1;i<ps.length;i++)assert.ok(Math.min(Math.abs(ps[i].x-ps[i-1].x),Math.abs(ps[i].y-ps[i-1].y))<.001);
 await p.keyboard.press('Enter');assert.equal(await p.evaluate(()=>G.roofs.length),2);assert.equal(await p.evaluate(()=>RoofWorkflow.getDraft()),null);
}
assert.deepEqual(errors,[]);console.log('PASS distant corner alignment and exact perpendicular child return in four directions');
}finally{await b.close()}})().catch(e=>{console.error(e);process.exitCode=1});
