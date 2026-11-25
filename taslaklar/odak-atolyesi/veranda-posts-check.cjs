const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {chromium}=require(require.resolve('playwright',{paths:[path.dirname(process.execPath)]}));
(async()=>{
 const browser=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'});
 try{
 const p=await browser.newPage({viewport:{width:1500,height:1000}}),errors=[];
 p.on('pageerror',e=>errors.push(e.message));
 await p.goto(require('node:url').pathToFileURL(path.join(__dirname,'prefabrik.html')).href);
 await p.evaluate(d=>{Studio.loadProject(d);Studio.flush();},JSON.parse(fs.readFileSync(path.join(__dirname,'../../cizimler/2026-11-25-tuna92-dwg-kontrol.json'),'utf8')));
 const check=()=>{const mesh=RoofStudio.planVerandaPosts(),ids=[...new Set(mesh.map(s=>s.sourceNodeId))];return ids.map(id=>{const v=mesh.filter(s=>s.sourceNodeId===id).flatMap(s=>s.poly);return {id,x:Math.max(...v.map(p=>p.x))-Math.min(...v.map(p=>p.x)),y:Math.max(...v.map(p=>p.y))-Math.min(...v.map(p=>p.y)),z:Math.max(...v.map(p=>p.z))-Math.min(...v.map(p=>p.z))};});};
 const before=await p.evaluate(()=>({bill:LoadingList.calculate().rows,project:Studio.state()}));
 const posts=await p.evaluate(check);
 assert.equal(posts.length,4);
 assert.deepEqual(posts.filter(p=>['n21','n22'].includes(p.id)),[{id:'n21',x:10,y:10,z:280},{id:'n22',x:10,y:10,z:280}]);
 await p.click('#single-model');await p.waitForTimeout(600);
 await p.evaluate(()=>RoofStudio.setCamera({...RoofStudio.getCamera(),yaw:145}));
 await p.waitForTimeout(350);

 assert.deepEqual(await p.evaluate(()=>LoadingList.calculate().rows),before.bill);
 await p.reload();
 assert.deepEqual(await p.evaluate(check),posts);
 assert.deepEqual(errors,[]);
 console.log('PASS front posts 100x100x2800mm, four free posts total, 3D render, reload, unchanged quantities',posts);
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
