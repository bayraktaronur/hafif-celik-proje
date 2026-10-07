const assert=require('node:assert/strict'),path=require('path'),{pathToFileURL}=require('url');let pw;try{pw=require('playwright')}catch{pw=require(path.resolve(path.dirname(process.execPath),'../node_modules/playwright'))}
(async()=>{const browser=await pw.chromium.launch({headless:true,executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'});try{
 const p=await browser.newPage({viewport:{width:1600,height:1100}}),errors=[];p.on('pageerror',e=>errors.push(e.message));await p.goto(pathToFileURL(path.resolve('dist/plan_studio.html')).href);
 await p.evaluate(()=>{Studio.loadProject({v:'5',sistem:'prefabrik',n:[],s:[],e:[],r:[]});RoofStudio.open();RoofStudio.add(RoofStudio.make({id:'main',w:1000,d:1000,h:280,datum:'eave',production:{role:'main',parentId:'',relative:0}}));});
 async function click(x,y){const q=await p.evaluate(({x,y})=>{const a=RoofStudio.canvasPoint({x,y}),r=document.getElementById('roofCanvas').getBoundingClientRect();return{x:r.left+a.x,y:r.top+a.y};},{x,y});await p.mouse.click(q.x,q.y);}
 async function draw(points){await p.locator('#roofCanvas').hover();await p.mouse.wheel(0,500);await p.click('#roofBoundaryChild');for(const [x,y] of points)await click(x,y);assert.equal(await p.evaluate(()=>RoofWorkflow.getDraft().points.length),4);await p.keyboard.press('Enter');assert.equal(await p.evaluate(()=>RoofWorkflow.getDraft()),null,await p.locator('#roofNotice').innerText());}
 await draw([[1030,50],[1125,50],[1125,950],[1030,950]]);
 const first=await p.evaluate(()=>G.roofs[1].id);assert.equal(await p.locator('#roofDrawParent option').count(),2);
 // Keep the old main selected, as in the report. First click must choose the
 // first child's outer edge, not reject it for being distant from the main.
 await p.selectOption('#roofDrawParent','main');
 await draw([[1157,200],[1450,200],[1450,600],[1157,600]]);
 assert.equal(await p.evaluate(()=>G.roofs.length),3);assert.equal(await p.evaluate(()=>G.roofs[2].production.parentId),first);
 assert.ok(await p.evaluate(()=>RoofStudio.model().faces.length>0));
 const saved=await p.evaluate(()=>Studio.state());await p.evaluate(()=>geriAl());assert.equal(await p.evaluate(()=>G.roofs.length),2);await p.evaluate(()=>ileriAl());assert.equal(await p.evaluate(()=>G.roofs.length),3);
 await p.evaluate(d=>{d.roofs.reverse();Studio.loadProject(d);RoofWorkflow.synchronize();},saved);
 assert.equal(await p.evaluate(()=>G.roofs.find(z=>z.production?.parentId!=='main'&&z.production?.role==='child').production.parentId),first);
 // Another sibling remains possible, even while the dropdown names a child.
 await p.selectOption('#roofDrawParent',first);await draw([[-30,200],[-250,200],[-250,500],[-30,500]]);
 assert.equal(await p.evaluate(()=>G.roofs.length),4);assert.equal(await p.evaluate(()=>G.roofs.at(-1).production.parentId),'main');
 const guards=await p.evaluate(()=>{const d=G.roofs.map(z=>JSON.parse(JSON.stringify(z))),a=d.find(z=>z.id==='main'),child=d.find(z=>z.production?.parentId==='main');a.production={role:'child',parentId:child.id,relative:0};try{RoofCore.validate(d,[]);return false;}catch{return true;}});assert.ok(guards);
 await p.screenshot({path:'artifacts/roof-child-chain.png'});assert.deepEqual(errors,[]);console.log('PASS consecutive child roofs, child-to-child host snap, sibling auto host, parent-first synchronization, undo/redo/JSON and cycle guard');
}finally{await browser.close()}})().catch(e=>{console.error(e);process.exitCode=1});
