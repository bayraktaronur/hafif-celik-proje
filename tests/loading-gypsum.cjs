const fs=require('fs'),path=require('path'),assert=require('node:assert/strict'),{pathToFileURL}=require('url');let pw;try{pw=require('playwright')}catch{pw=require(path.resolve(path.dirname(process.execPath),'../node_modules/playwright'))}
(async()=>{const b=await pw.chromium.launch({headless:true,executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'});try{const p=await b.newPage({viewport:{width:1500,height:1000}}),errors=[];p.on('pageerror',e=>errors.push(e.message));await p.goto(pathToFileURL(path.resolve('dist/plan_studio.html')).href);await p.evaluate(d=>Studio.loadProject(d),JSON.parse(fs.readFileSync('cizimler/2026-10-02-tuna84-dwg-esleme-taslak.json')));await p.evaluate(()=>G.roofs=[RoofStudio.make({w:1000,d:800,type:'besik',pitch:30,eaves:[30,30,30,30],material:'trapez',layers:[]})]);
for(const mode of ['yok','hepsi','secili']){
 const result=await p.evaluate(mode=>{G.opt.alciDuvar=mode;G.rooms.forEach((r,i)=>r.duvarAlci=i===0);const al=alcipanHesap(),rows=LoadingList.calculate().rows.filter(r=>r.sources.some(s=>s.gypsumRule));return {mode,rows,expected:Object.fromEntries(['beyazDuvar','beyazTavan','yesilDuvar','yesilTavan','verTavan'].map(k=>[k,al[k]>0?levhaAdet(al[k]):0]))}},mode);
 for(const [field,n] of Object.entries(result.expected)){const r=result.rows.find(r=>r.sources[0].gypsumRule.field===field);assert.equal(r?.qty||0,n);if(r){assert.equal(r.unit,'levha');assert.equal(r.spare,0);}}
 if(mode==='yok'){assert.ok(result.rows.some(r=>r.name==='Yeşil alçıpan — Duvar'&&r.qty>0));assert.ok(result.rows.every(r=>r.name!=='Beyaz alçıpan — Duvar'));}
 const wet=await p.evaluate(()=>['banyo','ebanyo','wc'].map(tip=>odaDuvarAlci({tip,duvarAlci:false})));assert.deepEqual(wet,[true,true,true]);
 if(mode==='hepsi')assert.ok(result.rows.some(r=>r.name.includes('Duvar')));
}
const screw=await p.evaluate(()=>{G.opt.alciDuvar='yok';return LoadingList.calculate().rows.find(r=>r.referenceId==='tuna-92')});assert.equal(screw.qty,500);assert.equal(screw.sources[0].screwRule.amount,19.3425);
await p.evaluate(()=>{ALCI.FIRE=40;G.roofs=[];});assert.equal(await p.evaluate(()=>LoadingList.calculate().rows.find(r=>r.referenceId==='tuna-92').qty),500);
await p.evaluate(()=>{G.opt.alciDuvar='hepsi'});assert.ok(await p.evaluate(()=>LoadingList.calculate().rows.some(r=>r.name.startsWith('Beyaz duvar alçıpan vidası')&&r.qty===null)));
await p.locator('#loadingOpen').click();await p.locator('#loadGroup').selectOption('Kaplama');assert.ok(await p.locator('#loadTable').innerText().then(t=>t.includes('alçıpan')));
const [dl]=await Promise.all([p.waitForEvent('download'),p.locator('#loadExcel').click()]);await dl.saveAs('artifacts/loading-gypsum.xlsx');assert.equal(errors.length,0);console.log('PASS existing gypsum quantities for no/all/selected walls, colors, veranda, UI and XLSX');
}finally{await b.close()}})().catch(e=>{console.error(e);process.exitCode=1});
