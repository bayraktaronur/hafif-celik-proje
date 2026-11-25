const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {chromium}=require(require.resolve('playwright',{paths:[path.dirname(process.execPath)]}));
(async()=>{const b=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'});try{
const p=await b.newPage({viewport:{width:1500,height:1000}}),errors=[];p.on('pageerror',e=>errors.push(e.message));await p.goto(require('node:url').pathToFileURL(path.join(__dirname,'prefabrik.html')).href);
await p.evaluate(d=>Studio.loadProject(d),JSON.parse(fs.readFileSync(path.join(__dirname,'../../cizimler/2026-11-25-tuna92-dwg-kontrol.json'),'utf8')));await p.click('#single-model');await p.click('#roof-task-output');await p.click('#roofElevationSheet');await p.waitForFunction(()=>!document.getElementById('elevationPNG').disabled);
assert.equal(await p.locator('#elevationDesign option').count(),5);
for(const design of ['technical','warmsketch','architectural','graywood','monochrome']){
 const before=await p.evaluate(()=>({project:Studio.snapshot(),camera:RoofStudio.getCamera(),scene:{...Scene3D.state}}));
 await p.selectOption('#elevationDesign',design);await p.waitForFunction(()=>!document.getElementById('elevationPNG').disabled);
 assert.deepEqual(await p.evaluate(()=>({project:Studio.snapshot(),camera:RoofStudio.getCamera(),scene:{...Scene3D.state}})),before);
 const stats=await p.evaluate(design=>{const c=document.createElement('canvas'),r=ElevationSheet.render(c,0,design);const v=c.getContext('2d').getImageData(480,145,1440,480).data;let ink=0,color=0;for(let i=0;i<v.length;i+=4){if(v[i]<100&&v[i+1]<100&&v[i+2]<100)ink++;if(v[i]!==v[i+1]||v[i]!==v[i+2])color++;}return {r,ink,color};},design);
 assert.ok(stats.r.every(r=>r.caption.y>r.cell.y+r.cell.h&&r.caption.y<1555));
 if(design==='technical'){assert.equal(stats.color,0);assert.ok(stats.ink>500);assert.ok(stats.r.every(r=>r.projection==='parallel'));}
 console.log(design,stats.ink,stats.color);
}
assert.deepEqual(errors,[]);console.log('PASS five designs, captions below drawings, technical monochrome edges, project/camera/display preserved');
}finally{await b.close();}})().catch(e=>{console.error(e);process.exitCode=1});
