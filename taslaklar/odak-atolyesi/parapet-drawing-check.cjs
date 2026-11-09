const assert=require('node:assert/strict');
const path=require('node:path');
const {pathToFileURL}=require('node:url');
const {chromium}=require(path.resolve(path.dirname(process.execPath),'../node_modules/playwright'));

(async()=>{
 const browser=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'});
 try{
  const page=await browser.newPage({viewport:{width:1600,height:1050}});
  page.setDefaultTimeout(5000);
  const errors=[];page.on('pageerror',error=>errors.push(error.message));
  await page.goto(pathToFileURL(path.join(__dirname,'index.html')).href);
  for(const system of ['prefabrik','celik']){
   await page.evaluate(system=>{
    const corners=[[0,0],[600,0],[600,400],[0,400]];
    Studio.loadProject({v:'5',sistem:system,opt:{h:280},n:corners.map(([x,y],i)=>({id:'n'+i,x,y})),
     s:corners.map((_,i)=>({id:'s'+i,n1:'n'+i,n2:'n'+((i+1)%4),k:10})),r:[],e:[]});
    SingleStorey.show('roof');RoofStudio.fit();document.querySelector('.roof-create-group').open=true;
   },system);
   const state=()=>page.evaluate(()=>G.roofs.map(z=>[z.type,z.parapet,z.pitch,z.eaves]));
   await page.click('#drawParapetRoof');
   assert.equal(await page.locator('#roofBoundaryType').inputValue(),'parapet');
   await page.selectOption('#parapetDrawInner','besik');
   await page.fill('#parapetDrawHeight','32');await page.fill('#parapetDrawOffset','40');await page.fill('#roofDrawPitch','12');
   for(const [x,y] of [[-5,-5],[605,-5],[605,405],[-5,405]]){
    const pt=await page.evaluate(v=>{
     const p=RoofStudio.canvasPoint(v),r=document.getElementById('roofCanvas').getBoundingClientRect();return {x:r.left+p.x,y:r.top+p.y};
    },{x,y});await page.mouse.click(pt.x,pt.y);
   }
   assert.equal(await page.evaluate(()=>RoofWorkflow.getDraft().points.length),4);
   await page.keyboard.press('Enter');
   assert.deepEqual(await state(),[['besik',32,12,[40,40,40,40]]],await page.evaluate(()=>JSON.stringify({notice:document.getElementById('roofNotice').textContent,draft:RoofWorkflow.getDraft(),focus:document.activeElement.id})));
   assert.equal(await page.inputValue('#rz_type'),'parapet');
   await page.selectOption('#parapetEditInner','kirma');await page.click('#roofApply');
   assert.deepEqual(await state(),[['kirma',32,12,[40,40,40,40]]]);
   await page.evaluate(()=>{Studio.loadProject(JSON.parse(JSON.stringify(Studio.state())));RoofStudio.select(G.roofs[0].id);});
   assert.equal(await page.inputValue('#parapetEditInner'),'kirma');
   assert.match(await page.locator('#roofZones').innerText(),/Parapet çatı · Kırma/);
   await page.selectOption('#rz_type','tek');await page.click('#roofApply');
   assert.deepEqual(await state(),[['tek',0,12,[40,40,40,40]]]);
   await page.selectOption('#rz_type','parapet');await page.fill('#rz_parapet','25');await page.click('#roofApply');
   assert.deepEqual(await state(),[['tek',25,12,[40,40,40,40]]]);
   await page.selectOption('#parapetDrawInner','tek');await page.fill('#parapetDrawOffset','0');await page.fill('#parapetDrawHeight','0');
   await page.click('#roofFromPlan');assert.equal((await state()).length,1);
   await page.fill('#parapetDrawHeight','18');await page.click('#roofFromPlan');
   assert.deepEqual((await state())[1],['tek',18,12,[0,0,0,0]]);
   await page.selectOption('#roofBoundaryType','besik');await page.click('#roofFromPlan');
   assert.equal((await state())[2][1],0);
  }
  assert.deepEqual(errors,[]);
  console.log('PASS prefabricated and steel: draw parapet by clicking corners, edit concealed form, convert an existing roof, reload, rectangular roof, zero overhang and validation.');
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
