const assert=require('node:assert/strict'),path=require('path'),{pathToFileURL}=require('url');let pw;try{pw=require('playwright')}catch{pw=require(path.resolve(path.dirname(process.execPath),'../node_modules/playwright'))}
(async()=>{const b=await pw.chromium.launch({headless:true,executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'});try{const p=await b.newPage({viewport:{width:1550,height:1050}}),errors=[];p.on('pageerror',e=>errors.push(e.message));await p.goto(pathToFileURL(path.resolve('dist/plan_studio.html')).href);
await p.evaluate(()=>{Studio.loadProject({v:'5',sistem:'prefabrik',n:[],s:[],e:[],r:[]});RoofStudio.open();RoofStudio.add(RoofStudio.make({id:'a',w:1000,d:800,h:280,pitch:33}));});
const before=await p.evaluate(()=>({area:RoofStudio.model().area,eaves:G.roofs[0].eaves,trim:RoofStudio.trimSurfaces(RoofStudio.model()).map(x=>x.kind)}));assert.ok(before.trim.includes('ridgeCap'));assert.ok(before.trim.includes('vergeTrim'));assert.equal(await p.inputValue('#rz_vergeWidth'),'220');
await p.selectOption('#rz_vergeWidth','400');await p.locator('#roofForm button[type=submit]').click();
assert.equal(await p.evaluate(()=>G.roofs[0].vergeWidth),400);assert.equal(await p.evaluate(()=>RoofStudio.model().area),before.area);assert.deepEqual(await p.evaluate(()=>G.roofs[0].eaves),before.eaves);
await p.evaluate(()=>geriAl());assert.equal(await p.evaluate(()=>G.roofs[0].vergeWidth??220),220);await p.evaluate(()=>ileriAl());
const saved=await p.evaluate(()=>Studio.state());await p.evaluate(d=>Studio.loadProject(d),saved);assert.equal(await p.evaluate(()=>G.roofs[0].vergeWidth),400);
await p.evaluate(()=>RoofStudio.add(RoofStudio.make({id:'b',x:1400,w:500,d:400,vergeWidth:220})));
const rows=await p.evaluate(()=>LoadingList.calculate().rows.filter(r=>['Alın V','Aşık kapama U'].includes(r.name)));assert.equal(rows.filter(r=>r.name==='Alın V').length,2);assert.equal(rows.filter(r=>r.name==='Aşık kapama U').length,1);assert.equal(rows.find(r=>r.name==='Aşık kapama U').qty,rows.filter(r=>r.name==='Alın V').reduce((n,r)=>n+r.qty,0));assert.ok(rows.some(r=>r.size==='400 × 2800 mm'));
assert.equal(await p.evaluate(()=>{const d=Studio.state();d.roofs[0].vergeWidth=300;try{Studio.loadProject(d);return false;}catch{return true;}}),true);
await p.evaluate(d=>{Studio.loadProject(d);RoofStudio.open();RoofStudio.setView('3d');},saved);await p.screenshot({path:'artifacts/roof-trims-3d.png'});
assert.deepEqual(errors,[]);console.log('PASS trim visualization, 220/400 selector, unchanged overhang/roof area, undo/JSON, mixed-width stock rows, aggregated U and invalid width rejection');
}finally{await b.close()}})().catch(e=>{console.error(e);process.exitCode=1});
