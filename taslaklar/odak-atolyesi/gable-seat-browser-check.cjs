const fs=require('fs'),path=require('path'),assert=require('node:assert/strict'),{pathToFileURL}=require('url'),{chromium}=require(require.resolve('playwright',{paths:[path.dirname(process.execPath)]}));
(async()=>{const browser=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'});try{
 const p=await browser.newPage({viewport:{width:1600,height:1100}}),errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.goto(pathToFileURL(path.resolve('outputs/Balkan92-plan-v206-yedek.html')).href);await p.waitForFunction(()=>window.Studio&&window.RoofCore);
 const old=await p.evaluate(()=>{const d=Studio.state(),C=RoofCore;const parent=RoofStudio.make({id:'parent',name:'Ana çatı',x:906.5,y:0,w:892.5,d:906.5,angle:90,h:280,wallTop:280,datum:'trim',eaves:[40,40,30,30],production:{role:'main',parentId:'',relative:0}});
 const points=[{x:932.5,y:10},{x:1078.8,y:10},{x:1078.8,y:573.7},{x:932.5,y:573.7}].map(q=>C.transform(parent,q));
 const child=C.connectChild(RoofStudio.make({id:'child',name:'Yavru çatı',h:280,wallTop:280,datum:'trim',eaves:[40,0,30,30],childJoin:{points},production:{role:'child',parentId:'parent',relative:0}}),parent);d.catiYon='dikey';d.roofs=[parent,child];return d;});
 await p.goto(pathToFileURL(path.resolve('outputs/Balkan92-plan.html')).href);await p.waitForFunction(()=>window.Studio&&window.RoofCore);await p.evaluate(d=>Studio.loadProject(d),old);
 const saved=await p.evaluate(()=>Studio.state());console.log(JSON.stringify({before:old.roofs.map(z=>({w:z.w,angle:z.angle})),after:saved.roofs.map(z=>({w:z.w,angle:z.angle,seat:z.childJoin?.seatInset}))}));assert.deepEqual(saved.n,old.n);assert.deepEqual(saved.s,old.s);assert.deepEqual(saved.e,old.e);assert.ok(Math.abs(saved.roofs[1].w-old.roofs[1].w-40)<1e-6);
 assert.equal(saved.roofs[1].childJoin.mode,'gable');assert.ok(saved.roofs[1].childJoin.support.filter((_,i)=>i===0||i===3).every(q=>Math.abs(q.y-892.5)<1e-6));
 await p.evaluate(()=>{SingleStorey.show('roof');RoofStudio.setView('3d');RoofStudio.setCamera({...RoofStudio.getCamera(),yaw:315,pitch:25,projection:'perspective'});});await p.screenshot({path:'outputs/Balkan92-basmakas-baglanti-kontrol.png'});
 await p.evaluate(()=>RoofStudio.commit(()=>{G.roofs[1].pitch=25;}));const changed=await p.evaluate(()=>Studio.state());assert.equal(changed.roofs[1].pitch,25);
 await p.evaluate(()=>geriAl());assert.deepEqual(await p.evaluate(()=>Studio.state().roofs),saved.roofs);await p.evaluate(()=>ileriAl());assert.deepEqual(await p.evaluate(()=>Studio.state().roofs),changed.roofs);
 await p.evaluate(()=>{Studio.flush();window.showSaveFilePicker=undefined;});const pending=p.waitForEvent('download');await p.getByRole('button',{name:/^Kaydet/}).first().click();const dl=await pending,exported=JSON.parse(fs.readFileSync(await dl.path(),'utf8'));assert.deepEqual(exported.roofs,changed.roofs);
 await p.reload();assert.deepEqual(await p.evaluate(()=>Studio.state().roofs),changed.roofs);assert.deepEqual(errors,[]);
 console.log('PASS legacy load migrates actual gable support, plan walls/openings unchanged, roof pitch edit/undo/redo, JSON save and reload; isolated test only, live user project untouched.');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});


