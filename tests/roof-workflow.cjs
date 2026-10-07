const assert=require('node:assert/strict'),path=require('node:path'),{pathToFileURL}=require('node:url'),C=require('../src/roof-core');
const poly=[{x:0,y:0},{x:1000,y:0},{x:1000,y:1000},{x:600,y:1000},{x:600,y:600},{x:0,y:600}];
const near=(a,b)=>assert.ok(Math.abs(a-b)<1e-5,`${a} != ${b}`);
for(const type of ['besik','tek','kirma']){
 const z=C.defaults({outline:poly,w:1000,d:1000,type,datum:'eave'});C.validate([z]);const m=C.calculate([z]);near(m.planArea,88.36);assert.ok(m.faces.every(f=>f.poly.every(p=>Number.isFinite(C.height(f,p)))));
 assert.ok(!m.faces.some(f=>C.contains(f.poly,{x:300,y:850})));near(C.calculate([C.turn(z)]).planArea,m.planArea);
 const bigger={...z,eaves:[40,40,40,40]};near(C.calculate([bigger]).planArea,C.area(C.footprint(bigger))/10000);
 if(type==='kirma')assert.ok(m.lengths.valley>0);
}
assert.throws(()=>C.checkOutline([{x:0,y:0},{x:10,y:10},{x:0,y:20},{x:20,y:0}]));
let pw;try{pw=require('playwright')}catch{pw=require(path.resolve(path.dirname(process.execPath),'../node_modules/playwright'))}
(async()=>{const browser=await pw.chromium.launch({headless:true,executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'});try{
 const page=await browser.newPage({viewport:{width:1800,height:1150}}),errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto(pathToFileURL(path.resolve('dist/plan_studio.html')).href);
 await page.evaluate(()=>{Studio.loadProject({v:'5',sistem:'prefabrik',catiYon:'yatay',n:[{id:'extent',x:1200,y:1400}],s:[],e:[],r:[]});RoofStudio.open();});
 await page.evaluate(()=>{G.nodes.push({id:'extent',x:1200,y:1400},{id:'origin',x:0,y:0});RoofStudio.fit();});await page.click('#roofBoundaryMain');
 for(const point of poly){const p=await page.evaluate(p=>{const q=RoofStudio.canvasPoint(p),b=document.getElementById('roofCanvas').getBoundingClientRect();return{x:q.x+b.left,y:q.y+b.top};},point);await page.mouse.click(p.x,p.y);}
 await page.click('#roofBoundaryFinish');assert.equal(await page.evaluate(()=>G.roofs.length),1,await page.locator('#roofNotice').innerText());
 let z=await page.evaluate(()=>G.roofs[0]);assert.equal(z.outline.length,6,JSON.stringify(z));assert.equal(z.production.role,'main');
 const base=z.outline;await page.fill('#roofBoundaryEave','40');await page.click('#roofApply');assert.deepEqual(await page.evaluate(()=>G.roofs[0].outline),base);assert.deepEqual(await page.evaluate(()=>G.roofs[0].edgeEaves),[40,40,40,40,40,40]);
 const before=await page.evaluate(()=>JSON.stringify([G.nodes,G.segs]));await page.click('#roofTurn');assert.equal(await page.evaluate(()=>G.catiYon),'dikey');assert.equal(await page.evaluate(()=>G.roofs[0].angle%180),90);assert.equal(await page.evaluate(()=>JSON.stringify([G.nodes,G.segs])),before);
 await page.evaluate(()=>catiYonAyarla('yatay'));assert.equal(await page.evaluate(()=>G.roofs[0].angle%180),0);await page.evaluate(()=>geriAl());assert.equal(await page.evaluate(()=>G.catiYon),'dikey');assert.equal(await page.evaluate(()=>G.roofs[0].angle%180),90);await page.evaluate(()=>ileriAl());
 const child=await page.evaluate(()=>{const z=RoofWorkflow.makeOutline([{x:650,y:800},{x:950,y:800},{x:950,y:1250},{x:650,y:1250}],{parentId:G.roofs[0].id,relative:90,eave:30,type:'besik',pitch:33,h:280});RoofStudio.add(z);return z;});
 assert.equal(child.production.relative,90);assert.ok(child.edgeEaves.includes(0));assert.equal(await page.evaluate(()=>G.roofs[1].group===G.roofs[0].group),true);
 assert.ok(await page.evaluate(()=>RoofWorkflow.trusses(G.roofs[1]).length>0));
 const saved=await page.evaluate(()=>Studio.state());await page.evaluate(d=>Studio.loadProject(d),saved);assert.deepEqual(await page.evaluate(()=>G.roofs),saved.roofs);
 await page.evaluate(()=>{RoofStudio.open();RoofStudio.select(G.roofs[0].id);RoofStudio.setView('section');});await page.screenshot({path:'artifacts/roof-boundary-section.png'});await page.evaluate(()=>RoofStudio.setView('3d'));await page.screenshot({path:'artifacts/roof-boundary-3d.png'});await page.evaluate(()=>RoofStudio.setView('plan'));await page.screenshot({path:'artifacts/roof-boundary-plan.png'});
 // Corner allowances resize the frame while preserving the panel bays.
 await page.evaluate(()=>{Studio.loadProject({v:'5',sistem:'prefabrik',catiYon:'yatay',settings:{panelDrawMode:'mixed'},n:[{id:'a',x:0,y:0},{id:'b',x:502,y:0},{id:'c',x:502,y:512},{id:'d',x:0,y:512}],s:[['a','b'],['b','c'],['c','d'],['d','a']].map(([n1,n2],i)=>({id:'s'+i,n1,n2,k:10})),e:[],r:[]});});
 const wallState=()=>page.evaluate(()=>JSON.stringify({n:G.nodes.map(({id,x,y})=>({id,x,y})),e:G.elemanlar}));
 const state=await page.evaluate(()=>Studio.snapshot()),walls=await wallState();
 assert.equal(await page.evaluate(()=>RoofWorkflow.direction('dikey')),true,await page.evaluate(()=>({issues:Modular.inspect(),notice:document.getElementById('roofNotice').textContent})));
 assert.notEqual(await wallState(),walls);assert.equal(await page.evaluate(()=>G.catiYon),'dikey');
 const rotatedWalls=await wallState();assert.deepEqual(await page.evaluate(()=>[getNode('b').x,getNode('c').y]),[512,502]);
 await page.evaluate(()=>geriAl());assert.equal(await page.evaluate(()=>Studio.snapshot()),state);
 await page.evaluate(()=>ileriAl());assert.equal(await wallState(),rotatedWalls);
 const rotated=await page.evaluate(()=>Studio.state());await page.evaluate(d=>Studio.loadProject(d),rotated);assert.equal(await wallState(),rotatedWalls);
 assert.equal(await page.evaluate(()=>RoofWorkflow.direction('yatay')),true);assert.equal(await wallState(),walls);
 await page.evaluate(()=>{RoofStudio.open();RoofStudio.add(RoofStudio.make({x:-5,y:-5,w:512,d:522}));});
 const snap=await page.evaluate(()=>RoofWorkflow.snap({x:-4.5,y:-5.1}));near(snap.x,-5);near(snap.y,-5);assert.equal(snap.ref.nodeId,'a');
 await page.evaluate(()=>{document.getElementById('trussSelect').value='1';document.getElementById('trussPosition').value='140';Prefab.trussMove();});
 near(await page.evaluate(()=>makasAnaliz().makaslar[1].pos),140);const moved=await page.evaluate(()=>Studio.state());assert.equal(moved.settings.trussOverrides[0].zoneId,moved.roofs[0].id);await page.evaluate(d=>Studio.loadProject(d),moved);near(await page.evaluate(()=>makasAnaliz().makaslar[1].pos),140);
 await page.evaluate(()=>{RoofStudio.open();RoofWorkflow.start(false);});await page.keyboard.press('Escape');assert.equal(await page.evaluate(()=>RoofWorkflow.getDraft()),null);assert.equal(await page.locator('#roofDialog').isVisible(),true);
 // Concave 84 m² reference outline: changing the floor-plan button must not
 // change opening sizes or freeze the old corner direction and H grid.
 await page.evaluate(()=>{document.getElementById('roofClose').click();const pts=[[0,0],[878.5,0],[878.5,700.25],[564.75,700.25],[564.75,637.5],[376.5,637.5],[376.5,878.5],[0,878.5]];Studio.loadProject({v:'5',sistem:'prefabrik',catiYon:'yatay',settings:{panelDrawMode:'mixed'},n:pts.map(([x,y],i)=>({id:'n'+i,x,y})),s:pts.map((_,i)=>({id:'s'+i,n1:'n'+i,n2:'n'+((i+1)%pts.length),k:10})),e:[{id:'w1',segId:'s0',tip_:'pencere',en:80,yuk:120,t:.04}],r:[]});});
 const concave=await wallState();
 await page.click('#catiBtn');assert.equal(await page.evaluate(()=>G.catiYon),'dikey');assert.notEqual(await wallState(),concave);const turnedConcave=await wallState();
 assert.deepEqual(await page.evaluate(()=>G.nodes.filter(n=>n.koseTers)),[]);
 assert.equal(await page.evaluate(()=>Prefab.issues().some(i=>i.code==='truss-support')),false);
 await page.click('#catiBtn');assert.equal(await page.evaluate(()=>G.catiYon),'yatay');assert.equal(await wallState(),concave);
 await page.evaluate(()=>{RoofStudio.add(RoofStudio.make({x:-5,y:-5,w:888.5,d:888.5}));RoofStudio.open();});
 await page.click('#roofTurn');assert.equal(await page.evaluate(()=>G.catiYon),'dikey');assert.equal(await wallState(),turnedConcave);assert.equal(await page.evaluate(()=>G.roofs[0].angle%180),90);
 assert.deepEqual(errors,[]);console.log('PASS polygon offsets, roof joins, shared direction exchanges corner allowances, concave outline H alignment, undo, persistence and 3 views');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
