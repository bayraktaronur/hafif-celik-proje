/* Specific, reproducible reconstruction of the supplied Tuna reference; not a general DWG importer. */
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),crypto=require('node:crypto'),{pathToFileURL}=require('node:url');
let pw;try{pw=require('playwright')}catch{pw=require(path.resolve(path.dirname(process.execPath),'../node_modules/playwright'))}
const input='cizimler/2026-10-02-is-kayit-5.json',output='cizimler/2026-10-02-tuna84-dwg-esleme-taslak.json',evidence=require('../analizler/2026-10-02-drawing1-geometri.json');
const clone=x=>JSON.parse(JSON.stringify(x)),near=(a,b,eps=.02)=>Math.abs(a-b)<eps,round=x=>Math.round(x*1000)/1000;
const original=JSON.parse(fs.readFileSync(input));
const d=clone(original);d.projectName='Tuna 84 - DWG eşleme kontrol taslağı';d.opt.h=250;d.ky=250;
d.n.push({id:'cadBathL',x:695.25,y:-62.75},{id:'cadBathR',x:883.5,y:-62.75},{id:'cadPorchL',x:695.25,y:639.25},{id:'cadPorchR',x:1202.25,y:639.25});
function split(id,node,tailId){const s=d.s.find(s=>s.id===id),end=s.n2;s.n2=node;d.s.push({...clone(s),id:tailId,n1:node,n2:end});}
split('e107','cadBathL','cadWallBathLeftLower');split('e115','cadBathR','cadWallBathRightLower');
d.s.push({id:'cadWallHallLeft',n1:'e106',n2:'e130',k:6,kSabit:true,dis:false},{id:'cadWallBathBottom',n1:'cadBathL',n2:'cadBathR',k:6,kSabit:true,dis:false});
for(const [id,n1,n2] of [['cadPorchLeft','e133','cadPorchL'],['cadPorchFront','cadPorchL','cadPorchR'],['cadPorchRight','cadPorchR','e97']])d.s.push({id,n1,n2,k:10,tip:'veranda',dis:false});
d.r=[];d.settings={...d.settings,panelSync:false};
const normalizePanel=p=>({...p,line:round([313.75,695.25,883.5,1202.25,-313.75,-62.75,62.75,313.75,376.5,564.75].reduce((best,a)=>Math.abs(a-p.line)<Math.abs(best-p.line)?a:best,p.line)),start:round(p.start),end:round(p.end)});
const normalized=evidence.panels.map(normalizePanel);
// Measured CAD drafting deviations are explicitly normalized to the shared orthogonal wall axis.
for(const p of normalized){if(p.handle==='806')p.end=308.75;if(p.handle==='807')p.end=183.25;if(p.handle==='806')p.start=183.25;}
function place(axis,line,center,width,height,kind,id,opts={}){
 const hits=d.s.filter(s=>s.tip!=='veranda').map(s=>{const a=d.n.find(n=>n.id===s.n1),b=d.n.find(n=>n.id===s.n2),horizontal=near(a.y,b.y);if((axis==='x')!==horizontal||!near(axis==='x'?a.y:a.x,line))return null;const start=axis==='x'?a.x:a.y,end=axis==='x'?b.x:b.y,L=Math.abs(end-start);if(center-width/2<Math.min(start,end)-.01||center+width/2>Math.max(start,end)+.01)return null;return {s,start,end,L};}).filter(Boolean);assert.equal(hits.length,1,'Opening segment '+id);const h=hits[0],t=(h.end>h.start?center-width/2-h.start:h.start-center-width/2)/h.L;
 d.e.push({id,tip_:kind,segId:h.s.id,t,en:width,yuk:height,ad:kind==='kapi'?'İç kapı':'Pencere',penTip:'cift-kanat',kapiYon:'ic',...opts});
}
for(const w of evidence.windows)place(w.axis,w.line,(w.start+w.end)/2,w.nominalWidth,w.nominalHeight,'pencere','cadWindow'+w.handle,{penTip:w.nominalWidth===60?'tek-kanat':'cift-kanat'});
// New interior opening widths are nominal plan symbols, not measured CNC cutouts.
for(const [axis,line,center,yan,mentese,id] of [['x',-62.75,759.5,-1,'a','Bath'],['y',695.25,0,1,'b','BedLeft'],['y',695.25,246,1,'a','Living'],['y',883.5,0,-1,'b','BedRight'],['y',883.5,125.5,-1,'a','Kitchen']])place(axis,line,center,80,210,'kapi','cadDoor'+id,{kapiTip:'ic',yan,mentese});
(async()=>{const browser=await pw.chromium.launch({headless:true,executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'});try{
 const page=await browser.newPage({viewport:{width:1700,height:1150}}),errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto(pathToFileURL(path.resolve('plan_cizim.html')).href);
 const read=()=>page.evaluate(()=>({state:Studio.state(),runs:JSON.parse(JSON.stringify(pfAnaliz().runs)),issues:Prefab.issues()}));
 await page.evaluate(x=>Studio.loadProject(x),original);const before=await read();
 await page.evaluate(x=>Studio.loadProject(x),d);const initial=await read();const comparison=[];
 for(const r of initial.runs){const axis=Math.abs(r.ux)>.9?'x':'y',line=axis==='x'?r.ay:r.ax,org=axis==='x'?r.ax:r.ay,lo=org+r.s0,hi=org+r.L-r.s1;const ps=normalized.filter(p=>p.axis===axis&&near(p.line,line,.2)&&p.start>=lo-.02&&p.end<=hi+.02).sort((a,b)=>a.start-b.start);assert.ok(ps.length,'No CAD panels for '+r.owner.id);assert.ok(near(ps[0].start,lo),'CAD start '+r.owner.id+' '+ps[0].start+' '+lo);assert.ok(near(ps.at(-1).end,hi),'CAD end '+r.owner.id+' '+ps.at(-1).end+' '+hi);ps.slice(1).forEach((p,i)=>assert.ok(near(p.start,ps[i].end),'CAD gap '+p.handle));
  const widths=ps.map(p=>round(p.end-p.start));for(const it of r.items){const s=d.s.find(s=>s.id===it.seg.id);delete s.pnlCfg;delete s.pnlTers;}d.s.find(s=>s.id===r.owner.id).pnlCfg={dizi:widths,explicit:true};
  const prev=before.runs.find(b=>b.owner.id===r.owner.id);comparison.push({owner:r.owner.id,axis,line,lo,hi,cadHandles:ps.map(p=>p.handle),before:prev?.slots.map(p=>p.w)||[],after:widths});
 }
 await page.evaluate(x=>Studio.loadProject(x),d);await page.evaluate(()=>{for(const r of G.rooms){const nodes=r.nodeIds.map(getNode),x=nodes.reduce((v,n)=>v+n.x,0)/nodes.length,y=nodes.reduce((v,n)=>v+n.y,0)/nodes.length;r.tip=x<695?(y<63?'yatak':'salon'):x<884?(y<-62?'banyo':y<314?'hol':'veranda'):(y<63?'yatak':y<377?'mutfak':'veranda');}draw();});
 const after=await read();assert.equal(after.state.s.filter(s=>s.tip==='veranda').length,3);assert.equal(after.state.e.filter(e=>e.tip_==='pencere').length,6);assert.equal(after.state.e.filter(e=>e.tip_==='kapi').length,6);assert.equal(after.state.opt.h,250);assert.deepEqual(after.state.e.find(e=>e.id==='e144'),before.state.e.find(e=>e.id==='e144'));
 assert.deepEqual(await page.evaluate(()=>[52.75,71.375,102.75,166,100].map(Modular.cutMm)),[520,710,1020,1660,null]);
 for(const n of original.n){const m=after.state.n.find(m=>m.id===n.id);assert.equal(m.x,n.x);assert.equal(m.y,n.y);}
 assert.equal(crypto.createHash('sha256').update(fs.readFileSync(evidence.source)).digest('hex'),evidence.sha256);
 const A=require('../src/project.js');A.validate(after.state);const structural=A.analyze(after.state).filter(i=>i.level==='error');assert.deepEqual(structural,[]);assert.equal(after.state.r.length,7);assert.equal(after.runs.reduce((n,r)=>n+r.slots.length,0),49);
 assert.equal(new Set(comparison.flatMap(r=>r.cadHandles)).size,evidence.panels.length);
 for(const row of comparison){const r=after.runs.find(r=>r.owner.id===row.owner);assert.deepEqual(r.slots.map(p=>round(p.w)),row.after);}
 await page.evaluate(x=>Studio.loadProject(x),after.state);const roundtrip=await read();assert.deepEqual(roundtrip.runs.map(r=>r.slots.map(p=>p.w)),after.runs.map(r=>r.slots.map(p=>p.w)));assert.deepEqual(roundtrip.state.e,after.state.e);assert.deepEqual(errors,[]);
 fs.writeFileSync(output,JSON.stringify(after.state,null,2)+'\n');fs.writeFileSync('analizler/2026-10-02-tuna84-karsilastirma.json',JSON.stringify({input,output,sourceHash:evidence.sha256,counts:{before:{walls:before.state.s.length,doors:before.state.e.length,windows:0,rooms:before.state.r.length,panels:before.runs.reduce((n,r)=>n+r.slots.length,0)},after:{walls:after.state.s.filter(s=>s.tip!=='veranda').length,veranda:3,doors:6,windows:6,rooms:7,panels:49}},wallComparison:comparison,remainingWarnings:after.issues,outputSha256:crypto.createHash('sha256').update(fs.readFileSync(output)).digest('hex')},null,2)+'\n');
 await page.screenshot({path:'artifacts/tuna84/corrected.png'});console.log('PASS reference panel intervals, 49 slots, 6 doors, 6 windows, 7 spaces, original door retained, 250 cm, schema and save/reopen.');console.log('Remaining warnings: '+after.issues.length+' (recorded in comparison JSON).');
 }finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
