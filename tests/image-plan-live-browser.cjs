// Opt-in integration with installed local model, never a mocked recognition response.
const fs=require('fs'),path=require('path'),assert=require('node:assert/strict'),{pathToFileURL}=require('url');
let pw;try{pw=require('playwright')}catch{pw=require(path.resolve(path.dirname(process.execPath),'../node_modules/playwright'))}
(async()=>{
 const browser=await pw.chromium.launch({headless:true,executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'});
 try{
  const page=await browser.newPage({viewport:{width:1400,height:1000}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(pathToFileURL(path.resolve('dist/plan_studio.html')).href);await page.evaluate(()=>Studio.demo());const before=await page.evaluate(()=>Studio.snapshot());
  await page.locator('#imagePlanOpen').click();
  const base={unit:'m',system:'prefabrik',policy:'nearest',width:8,depth:8,height:250,outer:10,inner:6,roofType:'besik',trussAxis:'x',pitch:33,notes:'Üstteki 3+2+3 dış 8 metreyi birlikte bölüştüren bölge ölçüleridir; sağdaki 4+4 dış 8 metreyi bölüştürür. Net oda eni olarak yorumlamayın.'};
  for(const [key,value] of Object.entries(base)){const field=page.locator('[name="'+key+'"]');if(['unit','system','policy','roofType','trussAxis'].includes(key))await field.selectOption(String(value));else await field.fill(String(value));}
  await page.locator('#ipFile').setInputFiles('referanslar/gorselden-plan/musteri-el-cizimi.png');await page.waitForFunction(()=>document.getElementById('ipImage').naturalWidth>0);
  const start=Date.now();await page.locator('#ivRead').click();await page.waitForFunction(()=>!document.getElementById('ivRead').disabled,{},{timeout:610000});
  const result={elapsedMs:Date.now()-start,status:await page.locator('#ivStatus').innerText(),preview:await page.locator('#ioResult').isVisible(),lines:await page.evaluate(()=>ImagePlanEditor.getLines())};
  assert.equal(await page.evaluate(()=>Studio.snapshot()),before,'Recognition must not alter existing drawing');
  if(result.preview){result.summary=await page.locator('#ioSummary').innerText();result.engine=await page.evaluate(({base,lines})=>{const b=ImagePlanCore.validate(base),d=ImagePlanJoint.solve(b,lines,ImagePlanJoint.parse(document.getElementById('ijX').value,100),ImagePlanJoint.parse(document.getElementById('ijY').value,100));const ok=Studio.applyTransaction(d.project);const r={ok,rooms:G.rooms.length,issues:Modular.inspect(),panels:pfAnaliz().runs.flatMap(r=>r.slots.map(s=>s.w))};if(ok)geriAl();return r;},{base,lines:result.lines});await page.locator('#ioResult').scrollIntoViewIfNeeded();}
  fs.mkdirSync('artifacts',{recursive:true});fs.writeFileSync('artifacts/local-plan-live-browser.json',JSON.stringify(result,null,2));await page.screenshot({path:'artifacts/local-plan-live-browser.png'});console.log(JSON.stringify(result));
  assert.equal(result.preview,true,'Actual model must produce a preview');assert.equal(result.engine.ok,true);assert.equal(result.engine.rooms,5,'This reference has two bedrooms, bathroom, corridor and living/kitchen');assert.deepEqual(result.engine.issues,[]);assert.ok(result.engine.panels.every(w=>w>0&&w<=125.51));assert.equal(await page.evaluate(()=>Studio.snapshot()),before);assert.deepEqual(errors,[]);console.log('PASS actual local model → browser preview → five-room panel model → undo');
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
