const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {pathToFileURL}=require('node:url');
const Project=require('../src/project.js');
let playwright;try{playwright=require('playwright');}catch{playwright=require(path.resolve(path.dirname(process.execPath),'../node_modules/playwright'));}
const {chromium}=playwright;
const results=[];
async function test(name,fn){try{await fn();results.push({name,passed:true});console.log('PASS '+name);}catch(e){results.push({name,passed:false,error:e.stack});console.error('FAIL '+name+'\n'+e.stack);}}
const near=(a,b,eps=1e-6)=>assert.ok(Math.abs(a-b)<eps,`${a} != ${b}`);
function fixture(points,edges,system='celik'){
 return {v:'5',projectName:'Test projesi',sistem:system,catiYon:'yatay',n:points.map(([x,y],i)=>({id:'e'+(i+1),x,y})),s:edges.map(([a,b],i)=>({id:'e'+(101+i),n1:'e'+a,n2:'e'+b,k:system==='prefabrik'?10:14,elemanlar:[]})),e:[],r:[],ky:280,dy:320,fire:10,opt:{...Project.DEFAULT_OPTIONS}};
}
const rectangle=()=>fixture([[0,0],[600,0],[600,400],[0,400]],[[1,2],[2,3],[3,4],[4,1]]);
const prefab=()=>fixture([[0,0],[753,0],[753,512],[0,512],[376.5,0],[376.5,512]],[[1,5],[5,2],[2,3],[3,6],[6,4],[4,1],[5,6]],'prefabrik');
async function main(){
 await test('Legacy v5 input receives explicit defaults',()=>{const d=rectangle();delete d.opt;delete d.fire;const parsed=Project.validate(d);assert.equal(parsed.fire,10);assert.equal(parsed.opt.ic,6);});
 await test('Malformed references, duplicates and non-finite coordinates are rejected',()=>{
  const a=rectangle();a.s[0].n1='missing';assert.throws(()=>Project.validate(a));
  const b=rectangle();b.n[1].id=b.n[0].id;assert.throws(()=>Project.validate(b));
  const c=rectangle();c.n[0].x=Infinity;assert.throws(()=>Project.validate(c));
 });
 await test('Prototype keys and invalid production dimensions are rejected',()=>{
  const a=JSON.parse(JSON.stringify(rectangle()).replace('"opt":{','"opt":{"__proto__":{},'));assert.throws(()=>Project.validate(a));
  const b=rectangle();b.opt.trapezEn=0;assert.throws(()=>Project.validate(b));
 });
  await test('Custom prefab panel configuration survives validation',()=>{const a=prefab();a.s[0].pnlCfg={dizi:[125.5,62.75,188.25]};assert.deepEqual(Project.validate(a).s[0].pnlCfg,a.s[0].pnlCfg);});
  await test('Legacy numeric option strings migrate without losing settings',()=>{const d=prefab();d.opt.h='300';d.opt.ic='10';const p=Project.validate(d);assert.equal(p.opt.h,300);assert.equal(p.opt.ic,10);});
 await test('Opening overlap, overflow, height and veranda checks are independent',()=>{
  const d=rectangle();d.e=[{id:'e200',tip_:'kapi',segId:'e101',t:.1,en:100,yuk:300},{id:'e201',tip_:'pencere',segId:'e101',t:.2,en:120,yuk:120},{id:'e202',tip_:'pencere',segId:'e102',t:.9,en:120,yuk:120}];d.s[1].tip='veranda';
  const codes=Project.analyze(d).map(i=>i.code);for(const code of ['overlap','overflow','height','veranda-opening'])assert.ok(codes.includes(code));
 });
 const browser=await chromium.launch({headless:true,executablePath:process.env.BROWSER_PATH||'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'});
 try{
  const context=await browser.newContext({viewport:{width:1536,height:960},deviceScaleFactor:1});
  const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('dialog',d=>d.accept());
  await page.goto(pathToFileURL(path.resolve('plan_cizim.html')).href);
  const load=async d=>page.evaluate(d=>Studio.loadProject(d),d);
  await test('Workspace starts without duplicate IDs or script errors',async()=>{assert.equal(await page.evaluate(()=>typeof Studio),'object');assert.deepEqual(await page.evaluate(()=>[...document.querySelectorAll('[id]')].map(e=>e.id).filter((id,i,a)=>a.indexOf(id)!==i)),[]);assert.deepEqual(errors,[]);});
  await test('Rectangle has correct axis area, inner-face area and external walls',async()=>{await load(rectangle());const d=await page.evaluate(()=>({rooms:G.rooms.length,axis:G.rooms[0].area,net:odaIcGeometri(G.rooms[0]).alan,external:G.segs.filter(s=>s.dis).length}));assert.equal(d.rooms,1);near(d.axis,24);near(d.net,5.86*3.86);assert.equal(d.external,4);});
  await test('T junction normalizes into shared wall and two rooms',async()=>{const d=rectangle();d.n.push({id:'e5',x:300,y:0},{id:'e6',x:300,y:400});d.s.push({id:'e105',n1:'e5',n2:'e6',k:10});await load(d);const r=await page.evaluate(()=>({rooms:G.rooms.map(r=>r.area),segments:G.segs.length,inside:G.segs.filter(s=>!s.dis).length}));assert.equal(r.segments,7);assert.equal(r.inside,1);assert.deepEqual(r.rooms,[12,12]);});
  await test('X junction creates one shared node and four rooms',async()=>{const d=rectangle();d.n.push({id:'e5',x:300,y:0},{id:'e6',x:300,y:400},{id:'e7',x:0,y:200},{id:'e8',x:600,y:200});d.s.push({id:'e105',n1:'e5',n2:'e6',k:10},{id:'e106',n1:'e7',n2:'e8',k:10});await load(d);const r=await page.evaluate(()=>({rooms:G.rooms.map(r=>r.area),center:G.nodes.filter(n=>n.x===300&&n.y===200).length}));assert.equal(r.center,1);assert.equal(r.rooms.length,4);r.rooms.forEach(a=>near(a,6));});
  await test('L-shaped room area and label remain inside polygon',async()=>{await load(fixture([[0,0],[600,0],[600,200],[300,200],[300,400],[0,400]],[[1,2],[2,3],[3,4],[4,5],[5,6],[6,1]]));const r=await page.evaluate(()=>{const r=G.rooms[0];return{area:r.area,inside:ptInPolygon(r.lx,r.ly,r.nodeIds.map(getNode))};});near(r.area,18);assert.equal(r.inside,true);});
  await test('Prefab full/half pitch and connection counts match original engine in both truss directions',async()=>{
   const baseline=await context.newPage();await baseline.goto(pathToFileURL(path.resolve('original/plan_cizim.v5.html')).href);
   for(const direction of ['yatay','dikey']){
    const d=prefab();d.catiYon=direction;await load(d);
    const get=()=>{const M=panelMetraj();return{dis:M.dis,ic:M.ic,bag:M.bag,custom:M.ozelList,rooms:G.rooms.map(r=>r.area)};};
    await baseline.evaluate(d=>{G.nodes=d.n;G.segs=d.s;G.elemanlar=[];G.rooms=[];G.catiYon=d.catiYon;G.opt=d.opt;ID=1000;setSistem('prefabrik',true);normalizeGraph();detectRooms();draw();},d);
    assert.deepEqual(await page.evaluate(get),await baseline.evaluate(get));
   }await baseline.close();
  });
  await test('Explicit numeric units follow common axes and support more than 40 panels',async()=>{await load(prefab());const r=await page.evaluate(()=>{G.inputUnit='panel';G.tool='duvar';const n=getNode('e1');return{parallel:numUzunluk(n,{x:1,y:0},4).L,perpendicular:numUzunluk(n,{x:0,y:1},4).L,large:numUzunluk(n,{x:1,y:0},41).L,cm:(G.inputUnit='cm',numUzunluk(n,{x:1,y:0},20).L)};});near(r.parallel,502);near(r.perpendicular,512);near(r.large,5145.5);near(r.cm,20);});
  await test('Custom thickness survives a T split',async()=>{const d=rectangle();d.s[0].k=18;d.s[0].kSabit=true;d.n.push({id:'e5',x:300,y:0},{id:'e6',x:300,y:200});d.s.push({id:'e105',n1:'e5',n2:'e6',k:10});await load(d);const r=await page.evaluate(()=>G.segs.filter(s=>getNode(s.n1).y===0&&getNode(s.n2).y===0).map(s=>[s.k,s.kSabit]));assert.deepEqual(r,[[18,true],[18,true]]);});
  await test('Undo/redo restores system, production options, fire and history branching',async()=>{
   await load(rectangle());
   assert.equal(await page.evaluate(()=>{setSistem('prefabrik');geriAl();return G.sistem;}),'celik');
   assert.equal(await page.evaluate(()=>{ileriAl();return G.sistem;}),'prefabrik');
   assert.equal(await page.evaluate(()=>{optUygula('ic',10);geriAl();return G.opt.ic;}),6);
   assert.equal(await page.evaluate(()=>{ileriAl();return G.opt.ic;}),10);
   assert.equal(await page.evaluate(()=>{Studio.projectField('fire',17);geriAl();return ALCI.FIRE;}),10);
   assert.equal(await page.evaluate(()=>{Studio.projectField('fire',12);ileriAl();return ALCI.FIRE;}),12);
  });
  await test('Production dropdowns accept browser string values and undo',async()=>{await load(prefab());await page.locator('#optIc select').first().selectOption('10');assert.equal(await page.evaluate(()=>G.opt.ic),10);await page.locator('#katYuk').fill('300');await page.locator('#katYuk').press('Tab');assert.equal(await page.evaluate(()=>+$('katYuk').value).catch(()=>page.locator('#katYuk').inputValue()).then(Number),300);await page.evaluate(()=>geriAl());assert.equal(await page.locator('#katYuk').inputValue(),'280');});
  await test('Property changes undo correctly and negative length is rejected',async()=>{await load(rectangle());const r=await page.evaluate(()=>{G.secili=getSeg('e101');G.seciliTip='seg';upSelSeg('k',20);const after=getSeg('e101').k;geriAl();const undo=getSeg('e101').k;G.secili=getSeg('e101');G.seciliTip='seg';resizeSeg(-100);return{after,undo,length:_segLen(getSeg('e101'))};});assert.deepEqual(r,{after:20,undo:14,length:600});});
  await test('Bulk thickness works with no selected object',async()=>{await load(rectangle());const r=await page.evaluate(()=>{G.secili=null;G.seciliTip=null;document.getElementById('topluH').value='hepsi';document.getElementById('topluK').value='18';topluKalinlikUygula();return G.segs.map(s=>s.k);});assert.deepEqual(r,[18,18,18,18]);});
  await test('Invalid file import is atomic and leaves current project intact',async()=>{await load(rectangle());const r=await page.evaluate(()=>{const before=Studio.snapshot(),d=Studio.state();d.s[0].n1='missing';try{Studio.loadProject(d);}catch{}return before===Studio.snapshot();});assert.equal(r,true);});
  await test('Import splitting through an opening fails atomically',async()=>{await load(rectangle());const bad=rectangle();bad.e=[{id:'e200',tip_:'kapi',segId:'e101',t:.4,en:100,yuk:210}];bad.n.push({id:'e5',x:300,y:0},{id:'e6',x:300,y:200});bad.s.push({id:'e105',n1:'e5',n2:'e6',k:10});const r=await page.evaluate(bad=>{const before=Studio.snapshot();let caught=false;try{Studio.loadProject(bad);}catch{caught=true;}return{caught,unchanged:before===Studio.snapshot()};},bad);assert.deepEqual(r,{caught:true,unchanged:true});});
  await test('Opening edits, placement and move reject overlaps',async()=>{
   const d=rectangle();d.e=[{id:'e200',tip_:'kapi',segId:'e101',t:.1,en:100,yuk:210},{id:'e201',tip_:'pencere',segId:'e101',t:.4,en:120,yuk:120}];await load(d);
   const r=await page.evaluate(()=>{G.secili=G.elemanlar[0];G.seciliTip='eleman';upSelEl('en',250);const width=G.elemanlar[0].en;const e=G.elemanlar[0],old=e.t;elemanKonumla(e,getSeg(e.segId),240,5);return{width,old,now:e.t,issues:Studio.issues().filter(i=>i.level==='error').length};});assert.equal(r.width,100);near(r.old,r.now);assert.equal(r.issues,0);
  });
  await test('JSON download round-trip retains production settings and project name',async()=>{await load(prefab());await page.evaluate(()=>{Studio.rename('Deneme 01');Studio.projectField('fire',17);optUygula('ic',10);});const dl=page.waitForEvent('download');await page.locator('.header-actions button').filter({hasText:'Kaydet'}).click();const file=await dl;const d=JSON.parse(fs.readFileSync(await file.path(),'utf8'));assert.equal(d.projectName,'Deneme 01');assert.equal(d.fire,17);assert.equal(d.opt.ic,10);Project.validate(d);await load(d);assert.equal(await page.evaluate(()=>ALCI.FIRE),17);});
  await test('Real mouse and keyboard draw a closed room; undo/redo works',async()=>{
   await load(fixture([],[]));await page.evaluate(()=>{G.zoom=1;G.pan={x:100,y:100};draw();});
   await page.locator('#t-duvar').click();const box=await page.locator('#cv').boundingBox();
   for(const [x,y] of [[100,100],[400,100],[400,400],[100,400],[100,100]]){await page.mouse.click(box.x+x,box.y+y);await page.waitForTimeout(70);}
   await page.keyboard.press('Escape');assert.equal(await page.evaluate(()=>G.rooms.length),1);
   await page.keyboard.press('Control+z');assert.equal(await page.evaluate(()=>G.rooms.length),0);
   await page.keyboard.press('Control+Shift+z');assert.equal(await page.evaluate(()=>G.rooms.length),1);
  });
  await test('PNG export produces a valid image without changing the model',async()=>{await load(prefab());const before=await page.evaluate(()=>Studio.snapshot());const pending=page.waitForEvent('download');await page.locator('.header-actions button').filter({hasText:'PNG çıktı'}).click();await page.locator('#exportSubmit').click();const d=await pending,buf=fs.readFileSync(await d.path());assert.equal(buf.subarray(1,4).toString(),'PNG');assert.equal(await page.evaluate(()=>Studio.snapshot()),before);fs.mkdirSync('artifacts',{recursive:true});fs.copyFileSync(await d.path(),'artifacts/plan-output.png');});
  await test('Legacy steel export labels approximate fields and includes real polygons',async()=>{await load(rectangle());const pending=page.waitForEvent('download');await page.locator('#hcBtn').click();const d=JSON.parse(fs.readFileSync(await(await pending).path(),'utf8'));assert.equal(d.rooms[0].olcuYontemi,'alan-esdegeri');assert.equal(d.rooms[0].geometry.axisPolygon.length,4);assert.equal(d.areaMethod,'wall-axis');});
  await test('Recovery banner restores the local project after reload',async()=>{await load(prefab());await page.evaluate(()=>{Studio.rename('Kurtarma testi');Studio.flush();});await page.reload();await page.getByRole('button',{name:'Çalışmayı geri getir'}).click();assert.equal(await page.locator('#projectName').inputValue(),'Kurtarma testi');assert.equal(await page.evaluate(()=>G.rooms.length),2);});
  await test('Layout remains within viewport at 1280 and 1920 pixels',async()=>{for(const width of [1280,1920]){await page.setViewportSize({width,height:900});await page.waitForTimeout(100);const r=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>window.innerWidth,canvas:cv.clientWidth,right:document.querySelector('.inspector').getBoundingClientRect().right}));assert.equal(r.overflow,false);assert.ok(r.canvas>450);assert.ok(r.right<=width+1);}});
  await test('High-DPI canvas preserves CSS coordinate scale',async()=>{const c=await browser.newContext({viewport:{width:1440,height:900},deviceScaleFactor:2});const p=await c.newPage();await p.goto(pathToFileURL(path.resolve('plan_cizim.html')).href);await p.waitForTimeout(100);const r=await p.evaluate(()=>({actual:cv.width,css:cv.clientWidth}));near(r.actual,r.css*2,2);await c.close();});
  await test('Cancelling a new wall leaves no orphan junction or phantom room',async()=>{await load(rectangle());await page.evaluate(()=>{setTool('duvar');const id=addNode(200,0);G.drawing=true;G.drawStart=id;setTool('sec');});assert.equal(await page.evaluate(()=>G.nodes.length),4);assert.equal(await page.evaluate(()=>G.segs.length),4);});
  await test('Standalone HTML works offline with no dependent files',async()=>{const p=await context.newPage(),errs=[];p.on('pageerror',e=>errs.push(e.message));await p.goto(pathToFileURL(path.resolve('dist/plan_studio.html')).href);await p.evaluate(()=>Studio.demo());assert.equal(await p.evaluate(()=>G.rooms.length),3);assert.equal(await p.locator('script[src],link[rel=stylesheet]').count(),0);assert.deepEqual(errs,[]);await p.close();});
  await test('No unhandled browser errors across all scenarios',()=>assert.deepEqual(errors,[]));
 }finally{await browser.close();}
 fs.mkdirSync('artifacts',{recursive:true});fs.writeFileSync('artifacts/test-results.json',JSON.stringify({date:new Date().toISOString(),results},null,2));
 console.log(`\n${results.filter(r=>r.passed).length}/${results.length} passed`);if(results.some(r=>!r.passed))process.exitCode=1;
}
main().catch(e=>{console.error(e);process.exitCode=1;});
