const assert=require('node:assert/strict'),path=require('node:path'),{pathToFileURL}=require('node:url');
let pw;try{pw=require('playwright')}catch{pw=require(path.resolve(path.dirname(process.execPath),'../node_modules/playwright'))}
(async()=>{
 const browser=await pw.chromium.launch({headless:true,executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'});
 try{
  const page=await browser.newPage({viewport:{width:1500,height:1000}}),errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto(pathToFileURL(path.resolve('dist/plan_studio.html')).href);
  await page.evaluate(()=>{
   const n=[[0,0],[1000,0],[1000,1200],[600,1200],[600,850],[300,850],[300,1000],[0,1000],[0,1200]].map(([x,y],i)=>({id:'n'+i,x,y}));
   const s=n.slice(0,8).map((v,i)=>({id:'s'+i,n1:v.id,n2:'n'+((i+1)%8),k:10}));s.push({id:'ver1',n1:'n7',n2:'n8',k:10,tip:'veranda'},{id:'ver2',n1:'n8',n2:'n3',k:10,tip:'veranda'});
   Studio.loadProject({v:'5',sistem:'prefabrik',settings:{panelDrawMode:'exception'},n,s,e:[],r:[]});RoofStudio.open();RoofStudio.fromPlan();RoofStudio.setView('3d');
  });
  const before=await page.evaluate(()=>RoofStudio.planStructure().filter(f=>f.kind!=='cladding'));
  assert.equal(before.length,8*5);assert.ok(before.every(f=>/^s[0-7]$/.test(f.segmentId)));assert.ok(before.every(f=>f.poly.every(p=>p.z===0||p.z===280)));
  await page.evaluate(()=>{RoofStudio.add(RoofStudio.make({x:-200,y:-200,w:1600,d:1600}));});
  assert.deepEqual(await page.evaluate(()=>RoofStudio.planStructure().filter(f=>f.kind!=='cladding')),before,'overlapping roof must not create or duplicate walls');
  await page.evaluate(()=>{Studio.edit(()=>{getNode('n5').y=800;getNode('n6').y=950;});});
  assert.notDeepEqual(await page.evaluate(()=>RoofStudio.planStructure().filter(f=>f.kind!=='cladding')),before);await page.evaluate(()=>geriAl());assert.deepEqual(await page.evaluate(()=>RoofStudio.planStructure().filter(f=>f.kind!=='cladding')),before);
  const saved=await page.evaluate(()=>Studio.state());await page.evaluate(d=>Studio.loadProject(d),saved);assert.deepEqual(await page.evaluate(()=>RoofStudio.planStructure().filter(f=>f.kind!=='cladding')),before);
  await page.evaluate(()=>{G.roofs.pop();RoofStudio.open();RoofStudio.setView('3d');});await page.screenshot({path:'artifacts/roof-plan-body.png'});assert.deepEqual(errors,[]);
  console.log('PASS concave floor-plan walls, open veranda, shared roof geometry, no duplicated walls, live edits, undo and persistence');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
