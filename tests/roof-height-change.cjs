const fs=require('fs'),path=require('path'),assert=require('node:assert/strict');let pw;try{pw=require('playwright')}catch{pw=require(path.resolve(path.dirname(process.execPath),'../node_modules/playwright'))}
(async()=>{const b=await pw.chromium.launch({headless:true,executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'});try{const p=await b.newPage({viewport:{width:1700,height:1100}}),errors=[];p.on('pageerror',e=>errors.push(e.message));await p.goto(require('url').pathToFileURL(path.resolve('dist/plan_studio.html')).href);await p.evaluate(d=>Studio.loadProject(d),JSON.parse(fs.readFileSync('cizimler/2026-10-08-omega-aciklik/orijinal.json')));
const plan=await p.evaluate(()=>JSON.stringify({nodes:G.nodes,segs:G.segs,eaves:G.roofs.map(z=>z.eaves)}));
async function check(height){const r=await p.evaluate(()=>({height:G.opt.h,zones:G.roofs.map(z=>({h:z.h,wall:z.wallTop})),low:Math.min(...RoofStudio.fasciaSurfaces(RoofStudio.model()).flatMap(f=>f.poly.map(v=>v.z))),plan:JSON.stringify({nodes:G.nodes,segs:G.segs,eaves:G.roofs.map(z=>z.eaves)})}));assert.equal(r.height,height);assert.ok(r.zones.every(z=>z.h===height&&z.wall===height));assert.ok(Math.abs(r.low-height)<1e-6);assert.equal(r.plan,plan);}
await check(250);
for(const height of [280,300,250]){await p.evaluate(h=>Studio.projectField('katYuk',h),height);await check(height);}
await p.evaluate(()=>geriAl());await check(300);await p.evaluate(()=>ileriAl());await check(250);
await p.evaluate(()=>optUygula('h',280));await check(280);
const saved=await p.evaluate(()=>Studio.state());await p.evaluate(d=>Studio.loadProject(d),saved);await check(280);
// A record saved after the old bug (walls 300, roofs 250) also recovers on height edit.
await p.evaluate(()=>{G.opt.h=300;document.getElementById('katYuk').value=300;G.roofs.forEach(z=>{z.h=250;z.wallTop=250});Studio.projectField('katYuk',280);});await check(280);
await p.evaluate(()=>{RoofStudio.open();RoofStudio.setView('3d');RoofStudio.fit();});await p.screenshot({path:'artifacts/roof-height-280.png'});assert.deepEqual(errors,[]);console.log('PASS 250/280/300, both height entry points, child roofs, undo/redo, JSON reload, stale roof repair and unchanged horizontal plan');}finally{await b.close()}})().catch(e=>{console.error(e);process.exit(1)});
