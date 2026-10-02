const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),{pathToFileURL}=require('node:url');let pw;try{pw=require('playwright')}catch{pw=require(path.resolve(path.dirname(process.execPath),'../node_modules/playwright'))}
const Core=require('../src/export-core.js');
// Wall breaks are real geometry, not opaque paper masks over intact walls.
const simple={n:[{id:'a',x:0,y:0},{id:'b',x:500,y:0}],s:[{id:'s',n1:'a',n2:'b',k:10,dis:true}],e:[{segId:'s',t:.2,en:80}]};
const pieces=Core.wallPieces(simple);assert.equal(pieces.length,2);assert.equal(pieces[0].points[1].x,100);assert.equal(pieces[1].points[0].x,180);assert.match(Core.dxf(pieces),/\r\n10\r\n5050\r\n/);
(async()=>{const b=await pw.chromium.launch({headless:true,executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'});try{
 const p=await b.newPage({viewport:{width:1700,height:1100}}),errors=[];p.on('pageerror',e=>errors.push(e.message));await p.goto(pathToFileURL(path.resolve('dist/plan_studio.html')).href);
 const source=JSON.parse(fs.readFileSync('cizimler/2026-10-02-tuna84-dwg-esleme-taslak.json'));source.annotations=[{id:'export-note',text:'Çatı ölçüsü\nÖzel panel: 42,5',x:100,y:50,size:12,angle:30}];
 await p.evaluate(d=>Studio.loadProject(d),source);const before=await p.evaluate(()=>Studio.state());
 const layout=await p.evaluate(()=>PlanExport.layout('A3','landscape',100));assert.equal(layout.w,420);assert.equal(layout.h,297);
 const oversized=await p.evaluate(()=>{try{PlanExport.layout('A4','portrait',20);return false}catch{return true}});assert.ok(oversized);
 const dxf=await p.evaluate(()=>PlanExport.makeDxf());assert.ok(dxf.endsWith('0\r\nEOF\r\n'));assert.match(dxf,/\$INSUNITS\r\n70\r\n4/);assert.match(dxf,/PANEL_BAGLANTI/);assert.match(dxf,/\\U\+00C7/);assert.match(dxf,/80\/210/);assert.doesNotMatch(dxf,/NaN|Infinity/);
 fs.mkdirSync('artifacts/export',{recursive:true});fs.writeFileSync('artifacts/export/tuna.dxf',dxf);
 await p.locator('#export-pdf').click();await p.locator('#exportScale').selectOption('100');assert.equal(await p.locator('#exportSubmit').isEnabled(),true);await p.screenshot({path:'artifacts/export/dialog.png'});
 const down=p.waitForEvent('download');await p.locator('#exportSubmit').click();const pdf=await down;assert.match(pdf.suggestedFilename(),/\.pdf$/);await pdf.saveAs('artifacts/export/tuna.pdf');
 assert.ok(fs.readFileSync('artifacts/export/tuna.pdf').subarray(0,8).toString().startsWith('%PDF-1.4'));
 const ddown=p.waitForEvent('download');await p.locator('#export-dxf').click();await p.locator('#exportSubmit').click();assert.match((await ddown).suggestedFilename(),/\.dxf$/);
 assert.deepEqual(await p.evaluate(()=>Studio.state()),before,'Export must not mutate model or filters');
 // Text/fixtures beyond walls participate in bounds. Export independent of screen zoom.
 const checks=await p.evaluate(()=>{const a=PlanExport.makeDxf();G.zoom=3;G.pan={x:731,y:-415};const b=PlanExport.makeDxf();G.annotations.push({id:'far',text:'UZAK',x:4000,y:2000,size:20,angle:90});const r=PlanExport.record(1);G.annotations.pop();return {same:a===b,far:r.bounds.maxX>3900};});assert.ok(checks.same);assert.ok(checks.far);
 const fixture=JSON.parse(fs.readFileSync('cizimler/2026-10-02-ev-kayit-11.json'));await p.evaluate(d=>Studio.loadProject(d),fixture);const fd=await p.evaluate(()=>PlanExport.makeDxf());fs.writeFileSync('artifacts/export/furniture.dxf',fd);assert.doesNotMatch(fd,/NaN|Infinity/);
 const furniturePdf=await p.evaluate(()=>Array.from(PlanExport.makePdf(PlanExport.layout('A3','landscape',100))));fs.writeFileSync('artifacts/export/furniture.pdf',Buffer.from(furniturePdf));
 // Explicit scale proof: isolated 500 cm wall, square end caps = 510 cm.
 await p.evaluate(d=>Studio.loadProject(d),{v:'5',...simple,e:[],r:[],sistem:'celik',ky:250,dy:320});
 const scaleProof=await p.evaluate(()=>{const l=PlanExport.layout('A4','landscape',50);return {bytes:Array.from(PlanExport.makePdf(l)),layout:l};});fs.writeFileSync('artifacts/export/scale.pdf',Buffer.from(scaleProof.bytes));fs.writeFileSync('artifacts/export/scale-layout.json',JSON.stringify(scaleProof.layout));
 assert.ok(Math.abs(100*scaleProof.layout.s/(96/25.4)-20)<1e-8);
 await p.evaluate(d=>Studio.loadProject(d),source);const filters=await p.evaluate(()=>{const a=PlanExport.record(1).items;G.viewFilters={...G.viewFilters,rooms:false,outerDims:false,innerDims:false,chains:false,panelColors:false,openings:false};G.makasGoster=false;const b=PlanExport.record(1).items;return {a:a.length,b:b.length,jointsA:a.filter(e=>e.layer==='PANEL_BAGLANTI').length,jointsB:b.filter(e=>e.layer==='PANEL_BAGLANTI').length,rooms:b.filter(e=>e.layer==='ODA'&&e.text).length};});assert.ok(filters.b<filters.a);assert.equal(filters.jointsA,filters.jointsB);assert.equal(filters.rooms,0);
 const presentation=await p.evaluate(()=>Array.from(PlanExport.makePdf(PlanExport.layout('A3','portrait',50))));fs.writeFileSync('artifacts/export/presentation.pdf',Buffer.from(presentation));
 // Failure must restore view and selection too, not leave export context active.
 assert.equal(await p.evaluate(()=>{const f=drawDims,old=ctx,pan=G.pan,z=G.zoom;window.drawDims=()=>{throw Error('test failure')};try{PlanExport.record();}catch{}finally{window.drawDims=f;}return ctx===old&&G.pan===pan&&G.zoom===z;}),true);
 assert.deepEqual(errors,[]);console.log('PASS PDF/DXF UI downloads, scale/overflow, wall opening geometry, Unicode, furniture, zoom independence and model preservation');
 }finally{await b.close()}})().catch(e=>{console.error(e);process.exitCode=1});
