const assert=require('node:assert/strict'),path=require('path'),fs=require('fs'),{pathToFileURL}=require('url');
const pw=require(path.resolve(path.dirname(process.execPath),'../node_modules/playwright'));
(async()=>{const browser=await pw.chromium.launch({headless:true,executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'});try{
 const p=await browser.newPage({viewport:{width:1600,height:1050}}),errors=[];p.on('pageerror',e=>errors.push(e.message));await p.goto(pathToFileURL(path.resolve('dist/plan_studio.html')).href);
 await p.evaluate(()=>Studio.loadProject({v:'5',sistem:'celik',n:[{id:'a',x:0,y:0},{id:'b',x:600,y:0},{id:'c',x:600,y:400},{id:'d',x:0,y:400}],s:[{id:'ab',n1:'a',n2:'b',k:14},{id:'bc',n1:'b',n2:'c',k:20},{id:'cd',n1:'c',n2:'d',k:14},{id:'da',n1:'d',n2:'a',k:14}],e:[{id:'w',segId:'ab',t:.2,en:160,yuk:120,tip_:'pencere',penTip:'cift-kanat'},{id:'door',segId:'bc',t:.3,en:90,yuk:210,tip_:'kapi'},{id:'back',segId:'cd',t:.2,en:120,yuk:120,tip_:'pencere'}],r:[],opt:{h:280}}));
 const result=await p.evaluate(()=>{const before=JSON.stringify(Studio.state()),m=Wall3D.build();return {parts:m.parts,surfaces:m.surfaces,unchanged:before===JSON.stringify(Studio.state())};});
 assert.ok(result.unchanged);assert.equal(result.parts.filter(x=>x.kind==='opening').length,3);assert.ok(!result.parts.some(x=>x.kind==='wallJoint'||x.kind==='windowSTL'));assert.deepEqual(result.parts.filter(x=>x.kind==='wallPanel').map(x=>x.thicknessMm),[140,200,140,140]);
 for(const f of result.surfaces.filter(x=>x.kind==='wallPanel'&&x.segmentId==='ab')){const x=f.poly.reduce((s,v)=>s+v.x,0)/f.poly.length,z=f.poly.reduce((s,v)=>s+v.z,0)/f.poly.length;assert.ok(!(x>120&&x<280&&z>90&&z<210),'window must not be covered');}
 assert.ok(result.surfaces.every(x=>x.poly.every(v=>Number.isFinite(v.x+v.y+v.z))));
 await p.evaluate(()=>RoofStudio.open());
 for(const type of ['besik','kirma','tek']){await p.selectOption('#roofBoundaryType',type);await p.fill('#roofDrawPitch','25');await p.click('#roofFromPlan');assert.equal(await p.evaluate(()=>G.roofs.at(-1).type),type);assert.equal(await p.evaluate(()=>G.roofs.at(-1).pitch),25);}
 const before=await p.evaluate(()=>JSON.stringify({n:G.nodes,s:G.segs,e:G.elemanlar}));await p.evaluate(()=>RoofWorkflow.direction(G.catiYon==='yatay'?'dikey':'yatay'));assert.equal(await p.evaluate(()=>JSON.stringify({n:G.nodes,s:G.segs,e:G.elemanlar})),before);
 await p.evaluate(()=>Studio.projectField('katYuk',300));assert.ok(await p.evaluate(()=>G.roofs.every(r=>r.wallTop===300)));
 const saved=await p.evaluate(()=>Studio.state());await p.evaluate(d=>Studio.loadProject(d),saved);assert.equal(await p.evaluate(()=>Wall3D.build().parts.filter(x=>x.kind==='opening').length),3);
 await p.evaluate(()=>{G.roofs=G.roofs.slice(0,1);RoofStudio.open();RoofStudio.setView('3d');});fs.mkdirSync('artifacts',{recursive:true});await p.screenshot({path:'artifacts/steel-3d.png'});assert.deepEqual(errors,[]);console.log('PASS steel 3D openings, reversed wall, thicknesses, roof types/pitch, direction, height and JSON');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exit(1)});
