const fs=require('fs'),path=require('path'),assert=require('node:assert/strict'),{pathToFileURL}=require('url');let pw;try{pw=require('playwright')}catch{pw=require(path.resolve(path.dirname(process.execPath),'../node_modules/playwright'))}
(async()=>{const b=await pw.chromium.launch({headless:true,executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'});try{const p=await b.newPage({viewport:{width:1500,height:1000}}),errors=[];p.on('pageerror',e=>errors.push(e.message));await p.goto(pathToFileURL(path.resolve('dist/plan_studio.html')).href);await p.evaluate(()=>{Studio.loadProject({v:'5',sistem:'prefabrik',catiYon:'yatay',n:[{id:'a',x:0,y:0},{id:'b',x:1000,y:0},{id:'c',x:1000,y:800},{id:'d',x:0,y:800}],s:[{id:'ab',n1:'a',n2:'b',k:10,dis:true},{id:'bc',n1:'b',n2:'c',k:10,dis:true},{id:'cd',n1:'c',n2:'d',k:10,dis:true},{id:'da',n1:'d',n2:'a',k:10,dis:true}],e:[],r:[]});RoofStudio.open();});
await p.waitForTimeout(150);
await p.click('#roofBoundaryMain');
const checks=await p.evaluate(()=>{const cs=RoofWorkflow.exteriorCorners();return {cs,hits:cs.map(c=>[-4,4].flatMap(dx=>[-4,4].map(dy=>RoofWorkflow.snap({x:c.x+dx,y:c.y+dy}))))}});
assert.equal(checks.cs.length,4);for(let i=0;i<4;i++)for(const h of checks.hits[i])assert.deepEqual([h.x,h.y],[checks.cs[i].x,checks.cs[i].y]);
for(const reverse of [false,true]){await p.click('#roofBoundaryMain');const points=reverse?[[-5,-5],[-5,805],[1005,805],[1005,-5]]:[[-5,-5],[1005,-5],[1005,805],[-5,805]];
 for(const [x,y] of points){const pos=await p.evaluate(({x,y})=>{const q=RoofStudio.canvasPoint({x,y}),r=document.getElementById('roofCanvas').getBoundingClientRect();return{x:q.x+r.left+2,y:q.y+r.top+1}},{x,y});await p.mouse.move(pos.x,pos.y);await p.mouse.click(pos.x,pos.y);}
 const draft=await p.evaluate(()=>RoofWorkflow.getDraft().points);assert.equal(draft.length,4);assert.deepEqual(draft.map(q=>[q.x,q.y]),points);
 if(!reverse)await p.screenshot({path:'artifacts/roof-snap.png'});
 await p.keyboard.press('Enter');assert.equal(await p.evaluate(()=>RoofWorkflow.getDraft()),null);
}
assert.equal(await p.evaluate(()=>G.roofs.length),2);await p.evaluate(d=>Studio.loadProject(d),JSON.parse(fs.readFileSync('cizimler/2026-10-02-tuna84-dwg-esleme-taslak.json')));
const real=await p.evaluate(()=>{RoofWorkflow.start(false);const cs=RoofWorkflow.exteriorCorners();return {cs,free:G.nodes.filter(n=>{const es=G.segs.filter(s=>s.n1===n.id||s.n2===n.id);return es.length&&es.every(s=>s.tip==='veranda')}).map(n=>n.id)};});assert.equal(new Set(real.cs.map(c=>c.ref.nodeId)).size,real.cs.length);assert.ok(real.cs.length>4);for(const id of real.free){const c=real.cs.find(c=>c.ref.nodeId===id);assert.ok(c);assert.equal(Math.abs(c.ref.dx),5);assert.equal(Math.abs(c.ref.dy),5);}
assert.equal(errors.length,0);console.log('PASS near-corner clicks, both winding directions, four corners and Enter');
}finally{await b.close()}})().catch(e=>{console.error(e);process.exitCode=1});
