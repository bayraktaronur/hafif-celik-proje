const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),{pathToFileURL}=require('node:url');
const {chromium}=require(path.resolve(path.dirname(process.execPath),'../node_modules/playwright'));
const {task,create}=require('./roof-test-navigation.cjs'),root=path.resolve(__dirname,'../..'),artifact=n=>path.join(root,'artifacts',n);
const near=(a,b)=>assert.ok(Math.abs(a-b)<1e-7,`${a} != ${b}`);
(async()=>{const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'});try{
 const p=await browser.newPage({viewport:{width:1600,height:1000},acceptDownloads:true}),errors=[],requests=[],results={task:'DEV-172',fixtures:[],viewports:[]};
 p.setDefaultTimeout(8000);p.on('pageerror',e=>errors.push(e.message));p.on('dialog',d=>d.accept());p.on('request',r=>{if(/^https?:/.test(r.url()))requests.push(r.url());});await p.addInitScript(()=>window.showSaveFilePicker=undefined);
 await p.goto(pathToFileURL(path.join(__dirname,'index.html')).href);await p.click('#single-roof');await create(p);
 assert.deepEqual(await p.locator('.roof-task-bar button').allTextContents(),['Model','Malzeme','Işık','Kamera','Çıktı','Sığdır']);
 // Task changes preserve uncommitted values and the geometry/quantity model.
 const original=await p.evaluate(()=>Studio.state());await p.fill('#rz_name','Bekleyen çatı adı');
 for(const id of ['material','light','camera','output','model'])await p.click('#roof-task-'+id);
 assert.equal(await p.locator('#rz_name').inputValue(),'Bekleyen çatı adı');assert.deepEqual(await p.evaluate(()=>Studio.state()),original);
 await p.click('#roofApply');assert.equal(await p.evaluate(()=>G.roofs[0].name),'Bekleyen çatı adı');
 await p.locator('#roof-task-model').focus();await p.keyboard.press('ArrowRight');assert.equal(await p.evaluate(()=>RoofWorkspace.active()),'material');await p.keyboard.press('End');assert.equal(await p.evaluate(()=>document.activeElement.id),'roof-task-output');await p.keyboard.press('Home');assert.equal(await p.evaluate(()=>document.activeElement.id),'roof-task-model');
 console.log('PASS contextual controls, pending form values, keyboard task navigation');
 // Width and material are the same project data used for the roof and quantities.
 await task(p,'material');await p.selectOption('#rz_width','80');await p.click('#roofApply');
 const width80=await p.evaluate(()=>({width:G.opt.trapezEn,roof:G.roofs[0].width,totals:RoofStudio.model().totals,area:RoofStudio.model().area,geometry:JSON.stringify([G.nodes,G.segs])}));
 assert.equal(width80.width,80);assert.equal(width80.roof,80);assert.ok(width80.totals.every(t=>t.width===80));
 await p.selectOption('#rz_width','100');await p.click('#roofApply');const width100=await p.evaluate(()=>({totals:RoofStudio.model().totals,area:RoofStudio.model().area}));near(width80.area,width100.area);assert.ok(width80.totals[0].pieces>=width100.totals[0].pieces);
 await p.selectOption('#rz_material','sandvic');await p.click('#roofApply');assert.ok(await p.evaluate(()=>G.opt.kaplama==='sandvic'&&G.roofs.every(r=>r.material==='sandvic')&&RoofStudio.model().totals.every(t=>t.material==='sandvic')));
 for(const h of ['250','280','300']){await p.click('#single-plan');await p.selectOption('[data-spec=h]',h);assert.ok(await p.evaluate(h=>G.roofs.every(r=>r.wallTop===+h),h));assert.equal(await p.evaluate(()=>JSON.stringify([G.nodes,G.segs])),width80.geometry);}
 console.log('PASS 80/100 cm coverage, sandwich material and 250/280/300 cm shared height');
 await p.click('#single-model');await task(p,'camera');await p.selectOption('#roofProjection','perspective');await p.selectOption('#roofViewpoint','front');
 await p.click('#roofZoomIn');await p.locator('#roofCamera').fill('42');
 const canvas=await p.locator('#roofCanvas').boundingBox();await p.keyboard.down('Shift');await p.mouse.move(canvas.x+canvas.width/2,canvas.y+canvas.height/2);await p.mouse.down();await p.mouse.move(canvas.x+canvas.width/2+40,canvas.y+canvas.height/2-20,{steps:3});await p.mouse.up();await p.keyboard.up('Shift');
 const beforeView=await p.evaluate(()=>({camera:RoofStudio.getCamera(),bill:metrajKalemleri(),builds:RoofStudio.sceneStats.builds,state:Studio.state()}));
 await p.fill('#roofViewName','Ön cephe · müşteri');await p.click('#roofViewSave');assert.equal(await p.locator('.roof-saved-view button:first-child').innerText(),'Ön cephe · müşteri');
 const saved=await p.evaluate(()=>G.cameraViews[0]);near(saved.camera.yaw,beforeView.camera.yaw);assert.equal(saved.camera.projection,'perspective');
 await p.selectOption('#roofViewpoint','back');await p.click('#roofZoomOut');await p.locator('.roof-saved-view button:first-child').click();await p.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
 assert.deepEqual(await p.evaluate(()=>RoofStudio.getCamera()),beforeView.camera);assert.deepEqual(await p.evaluate(()=>metrajKalemleri()),beforeView.bill);assert.equal(await p.evaluate(()=>RoofStudio.sceneStats.builds),beforeView.builds);
 for(const width of [980,1280,1920]){
  await p.setViewportSize({width,height:960});await p.locator('.roof-saved-view button:first-child').click();await p.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
  const layout=await p.evaluate(()=>{const c=RoofStudio.getCamera(),el=document.getElementById('roofCanvas'),r=el.getBoundingClientRect(),right=document.querySelector('.roof-right').getBoundingClientRect(),bar=document.querySelector('.roof-task-bar');return {width:innerWidth,canvas:{width:r.width,height:r.height},bar:bar.clientHeight,overflow:document.documentElement.scrollWidth>innerWidth||bar.scrollWidth>bar.clientWidth+1,inspector:right.right<=innerWidth,panX:c.panX/el.clientWidth,panY:c.panY/el.clientHeight};});
  near(layout.panX,saved.camera.panX);near(layout.panY,saved.camera.panY);assert.ok(!layout.overflow&&layout.inspector&&layout.canvas.width>440&&layout.canvas.height>600);assert.ok(layout.bar<=45);results.viewports.push(layout);
 }
 await p.setViewportSize({width:1600,height:1000});await p.locator('.roof-saved-view button:first-child').click();await p.locator('.roof-saved-view button:last-child').click();assert.equal(await p.evaluate(()=>G.cameraViews.length),0);
 await p.click('#roofUndo');assert.equal(await p.evaluate(()=>G.cameraViews.length),1);await p.click('#roofRedo');assert.equal(await p.evaluate(()=>G.cameraViews.length),0);await p.click('#roofUndo');
 const download=p.waitForEvent('download');await p.click('.header-actions [onclick="planKaydet()"]');const json=JSON.parse(fs.readFileSync(await(await download).path(),'utf8'));assert.deepEqual(json.cameraViews,[saved]);
 await p.click('#single-plan');await p.click('.header-actions [onclick="yeniPlan()"]');assert.equal(await p.evaluate(()=>G.cameraViews.length),0);await p.setInputFiles('#fi',{name:'saved-views.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(json))});await p.waitForFunction(()=>G.cameraViews?.length===1);await p.evaluate(()=>Studio.flush());await p.reload();assert.deepEqual(await p.evaluate(()=>G.cameraViews),[saved]);
 const invalid=await p.evaluate(()=>{const data=Studio.state(),before=Studio.snapshot(),v=data.cameraViews[0],c=v.camera;let rejected=0;for(const views of [[v,v],[{...v,name:''}],[{...v,camera:{...c,projection:'bad'}}],[{...v,camera:{...c,zoom:0}}],[{...v,camera:{...c,panX:Infinity}}],Array.from({length:25},(_,i)=>({...v,id:'view'+i}))])try{Studio.loadProject({...data,cameraViews:views});}catch(e){rejected++;}return {rejected,same:Studio.snapshot()===before};});assert.equal(invalid.rejected,6);assert.ok(invalid.same);
 console.log('PASS real saved camera, normalized pan at 3 sizes, no geometry rebuild, delete/undo/redo, project isolation, JSON/recovery and invalid input');
 await p.click('#single-model');await task(p,'light');await p.selectOption('#presentationMode','presentation');await p.locator('[data-outline="35"]').click();await p.waitForTimeout(250);await p.screenshot({path:artifact('roof-workspace-final-light.png')});await task(p,'camera');await p.waitForTimeout(250);await p.screenshot({path:artifact('roof-workspace-final-camera.png')});
 await task(p,'output');await p.click('#roofPNG');await p.waitForFunction(()=>!document.getElementById('image3DDownload').disabled);const png=p.waitForEvent('download');await p.click('#image3DDownload');const file=await png,bytes=fs.readFileSync(await file.path());assert.deepEqual([bytes.readUInt32BE(16),bytes.readUInt32BE(20)],[3840,2160]);await file.saveAs(artifact('roof-workspace-4k.png'));await p.waitForFunction(()=>!document.getElementById('image3DDialog').hasAttribute('aria-busy'));await p.click('#image3DCancel');
 const csv=p.waitForEvent('download');await p.click('#roofCSV');assert.match((await csv).suggestedFilename(),/\.csv$/);
 await p.click('[data-roof-view="report"]');assert.ok((await p.locator('#roofReport').innerText()).length>100);await p.click('#roofReturnModel');assert.equal(await p.evaluate(()=>document.body.dataset.singleView),'model');
 await task(p,'output');await p.click('#roofAllBill');assert.ok((await p.locator('#metrajIc').innerText()).length>100);await p.click('#mbgMet .mcancel');
 await p.click('#single-model');await task(p,'output');await p.click('#roofPlanSheet');await p.click('#single-format-pdf');await p.waitForFunction(()=>!document.getElementById('exportSubmit').disabled);const pdf=p.waitForEvent('download');await p.click('#exportSubmit');assert.equal(fs.readFileSync(await(await pdf).path()).subarray(0,5).toString(),'%PDF-');
 console.log('PASS actual 4K PNG, CSV, roof report, complete quantities and PDF from contextual output panel');
 // Compare complete quantities to the last draft, including its drainage extension.
 // The protected main app intentionally has no such extension; single-check covers
 // parity with that app for their shared panel, joint and room calculations.
 const revision='26bd0bcc5188fae0a215c0cae884651e66301fca',dir=artifact('roof-baseline-171');fs.mkdirSync(dir,{recursive:true});
 const git=path.resolve(root,'../.sync-tools/git/cmd/git.exe'),show=f=>require('node:child_process').execFileSync(git,['show',revision+':taslaklar/odak-atolyesi/'+f],{cwd:root,maxBuffer:30*1024*1024,encoding:'utf8'});
 let html=show('index.html').replace('<head>','<head><base href="'+pathToFileURL(__dirname+path.sep).href+'">');
 for(const f of ['single-engine.js','single-storey.js','presentation-ui.js']){fs.writeFileSync(path.join(dir,f),show(f));html=html.replace('src="'+f+'"','src="'+pathToFileURL(path.join(dir,f)).href+'"');}fs.writeFileSync(path.join(dir,'index.html'),html);results.baselineRevision=revision;
 const base=await browser.newPage();await base.goto(pathToFileURL(path.join(dir,'index.html')).href);
 const read=()=>({panels:pfAnaliz().runs.map(r=>r.slots.map(s=>s.w)),joints:pfAnaliz().bag.map(j=>j.tip),bill:metrajKalemleri(),areas:G.rooms.map(r=>r.area)});
 for(const file of ['cizimler/2026-10-07-yavru-baglanti/orijinal.json','cizimler/2026-10-08-panel-kapanis/orijinal.json','cizimler/gulsum-84m2/veranda-kirisli-ornek-5.9.98.json']){
  const d=JSON.parse(fs.readFileSync(path.join(root,file),'utf8'));await p.evaluate(d=>Studio.loadProject(d),d);await base.evaluate(d=>Studio.loadProject(d),d);const a=await p.evaluate(read),b=await base.evaluate(read);assert.deepEqual(a,b,file);results.fixtures.push({file,panels:a.panels.flat().length,rooms:a.areas.length,billRows:a.bill.length});
 }
 await base.close();results.javascriptErrors=errors;results.remoteRequests=requests;results.png=[3840,2160];assert.deepEqual(errors,[]);assert.deepEqual(requests,[]);fs.writeFileSync(artifact('roof-workspace-test-result.json'),JSON.stringify(results,null,2));console.log('PASS 3 versioned customer/reference fixtures match the prior draft geometry, room area and complete bill; no runtime errors or remote requests');
 }finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
