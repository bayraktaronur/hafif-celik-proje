const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),{pathToFileURL}=require('node:url');
let pw;try{pw=require('playwright');}catch{pw=require(path.resolve(path.dirname(process.execPath),'../node_modules/playwright'));}
const Project=require('../src/project.js');
const near=(a,b)=>assert.ok(Math.abs(a-b)<1e-6,`${a} != ${b}`);
const fixture=()=>({v:'5',settings:{panelDrawMode:'exception'},sistem:'prefabrik',projectName:'Panel düzenleme testi',catiYon:'yatay',ky:280,dy:320,fire:10,opt:{...Project.DEFAULT_OPTIONS},n:[{id:'e1',x:0,y:0},{id:'e2',x:564.75,y:0},{id:'e3',x:564.75,y:512},{id:'e4',x:0,y:512}],s:[{id:'e101',n1:'e1',n2:'e2',k:10},{id:'e102',n1:'e2',n2:'e3',k:10},{id:'e103',n1:'e3',n2:'e4',k:10},{id:'e104',n1:'e4',n2:'e1',k:10}],e:[],r:[]});
(async()=>{
 const browser=await pw.chromium.launch({headless:true,executablePath:process.env.BROWSER_PATH||'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'});
 try{
 const page=await browser.newPage({viewport:{width:1536,height:960}}),errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('dialog',d=>d.accept());await page.goto(pathToFileURL(path.resolve('plan_cizim.html')).href);
 const load=async d=>page.evaluate(d=>Studio.loadProject(d),d||fixture());

for(const rotated of [false,true])for(const reverse of [false,true])for(const [tip,en] of [['pencere',120],['pencere',160],['kapi',90]]){
 const d=fixture();d.settings.panelDrawMode='mixed';if(rotated){d.n.forEach(n=>{[n.x,n.y]=[n.y,n.x]});d.catiYon='dikey';}if(reverse)d.s.forEach(s=>{[s.n1,s.n2]=[s.n2,s.n1]});await load(d);
 const result=await page.evaluate(({tip,en,rotated})=>{const before=Studio.snapshot(),axes=JSON.stringify(makasAnaliz().makaslar),nodes=JSON.stringify(G.nodes),point=rotated?{x:0,y:251}:{x:251,y:0};openModal(tip,getSeg('e101'),point,point);document.getElementById('mEn').value=en;modalOk();const e=G.elemanlar[0],r=pfRunOf(getSeg('e101')).run;if(!e)return{error:document.getElementById('toast').textContent};const a=getNode(getSeg(e.segId).n1),b=getNode(getSeg(e.segId).n2),L=Math.hypot(b.x-a.x,b.y-a.y),t=e.t+e.en/2/L,center={x:a.x+(b.x-a.x)*t,y:a.y+(b.y-a.y)*t};return{before,center,point,axesSame:axes===JSON.stringify(makasAnaliz().makaslar),nodesSame:nodes===JSON.stringify(G.nodes),widths:r.slots.map(p=>p.w),saved:Studio.state()};},{tip,en,rotated});assert.ok(!result.error,JSON.stringify(result));near(result.center.x,result.point.x);near(result.center.y,result.point.y);assert.ok(result.axesSame);assert.ok(result.nodesSame);assert.ok(result.widths.some(w=>Math.abs(w-(en===160?166:125.5))<.01));await page.evaluate(()=>geriAl());assert.equal(await page.evaluate(()=>Studio.snapshot()),result.before);await load(result.saved);const restored=await page.evaluate(()=>{const e=G.elemanlar[0],seg=getSeg(e.segId),a=getNode(seg.n1),b=getNode(seg.n2),L=Math.hypot(b.x-a.x,b.y-a.y),t=e.t+e.en/2/L;return{x:a.x+(b.x-a.x)*t,y:a.y+(b.y-a.y)*t};});near(restored.x,result.point.x);near(restored.y,result.point.y);
}
assert.deepEqual(errors,[]);console.log('PASS 12 H-centred door/window variants: widths120/160, rotation, reverse segments, fixed trusses/nodes, undo and JSON');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exit(1)});
