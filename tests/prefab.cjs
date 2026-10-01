const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),{pathToFileURL}=require('node:url');
let pw;try{pw=require('playwright');}catch{pw=require(path.resolve(path.dirname(process.execPath),'../node_modules/playwright'));}
const Project=require('../src/project.js'),results=[];
const near=(a,b)=>assert.ok(Math.abs(a-b)<1e-6,`${a} != ${b}`);
const fixture=()=>({v:'5',settings:{panelDrawMode:'exception'},sistem:'prefabrik',projectName:'Panel düzenleme testi',catiYon:'yatay',ky:280,dy:320,fire:10,opt:{...Project.DEFAULT_OPTIONS},n:[{id:'e1',x:0,y:0},{id:'e2',x:564.75,y:0},{id:'e3',x:564.75,y:512},{id:'e4',x:0,y:512}],s:[{id:'e101',n1:'e1',n2:'e2',k:10},{id:'e102',n1:'e2',n2:'e3',k:10},{id:'e103',n1:'e3',n2:'e4',k:10},{id:'e104',n1:'e4',n2:'e1',k:10}],e:[],r:[]});
async function test(name,fn){try{await fn();console.log('PASS '+name);results.push({name,passed:true});}catch(e){console.error('FAIL '+name+'\n'+e.stack);results.push({name,passed:false,error:e.stack});}}
(async()=>{
 const browser=await pw.chromium.launch({headless:true,executablePath:process.env.BROWSER_PATH||'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'});
 try{
 const page=await browser.newPage({viewport:{width:1536,height:960}}),errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('dialog',d=>d.accept());await page.goto(pathToFileURL(path.resolve('plan_cizim.html')).href);
 const load=async d=>page.evaluate(d=>Studio.loadProject(d),d||fixture());
 const widths=async id=>page.evaluate(id=>pfRunOf(getSeg(id)).run.slots.map(p=>p.w),id);
 await test('Exterior and interior 6/10/15 settings validate and persist',async()=>{for(const dis of [6,10,15])for(const ic of [6,10,15]){const d=fixture();d.opt.dis=dis;d.opt.ic=ic;Project.validate(d);await load(d);assert.equal(await page.evaluate(()=>PF.DIS),dis);assert.equal(await page.evaluate(()=>PF.IC),ic);assert.equal(await page.evaluate(()=>G.segs[0].k),dis);}});
 await test('Bulk exterior and interior filters preserve veranda and other walls',async()=>{
  const d=fixture();d.n.push({id:'e5',x:251,y:0},{id:'e6',x:251,y:512},{id:'e7',x:564.75,y:650},{id:'e8',x:0,y:650});d.s.push({id:'e105',n1:'e5',n2:'e6',k:6},{id:'e106',n1:'e3',n2:'e7',k:10,tip:'veranda'},{id:'e107',n1:'e7',n2:'e8',k:10,tip:'veranda'},{id:'e108',n1:'e8',n2:'e4',k:10,tip:'veranda'});await load(d);
  const r=await page.evaluate(()=>{topluKalinlik();document.getElementById('topluK').value='15';document.getElementById('topluH').value='dis';topluKalinlikUygula();topluKalinlik();document.getElementById('topluK').value='10';document.getElementById('topluH').value='ic';topluKalinlikUygula();return{ex:G.segs.filter(s=>s.dis&&s.tip!=='veranda').map(s=>s.k),inside:G.segs.filter(s=>!s.dis&&s.tip!=='veranda').map(s=>s.k),ver:G.segs.filter(s=>s.tip==='veranda').map(s=>s.k),opt:G.opt};});
  assert.ok(r.ex.every(k=>k===15));assert.ok(r.inside.length&&r.inside.every(k=>k===10));assert.deepEqual(r.ver,[10,10,10]);assert.equal(r.opt.dis,15);assert.equal(r.opt.ic,10);
 });
 await test('Panel mode selects one panel with real mouse, wall mode selects wall',async()=>{await load();await page.locator('#selectionMode').selectOption('panel');const point=await page.evaluate(()=>{const p=toCv(180,0),r=cv.getBoundingClientRect();return{x:p.x+r.left,y:p.y+r.top};});await page.mouse.click(point.x,point.y);assert.equal(await page.evaluate(()=>G.seciliTip),'panel');assert.match(await page.locator('#sbSelIc').innerText(),/Tam panel/);await page.locator('#selectionMode').selectOption('wall');await page.mouse.click(point.x,point.y);assert.equal(await page.evaluate(()=>G.seciliTip),'seg');});
 await test('Full panel splits into two halves on both bearing walls',async()=>{await load();const ok=await page.evaluate(()=>{Prefab.select('e101',1);return Prefab.split();});assert.equal(ok,true);assert.deepEqual(await widths('e101'),[125.5,62.75,62.75,125.5,125.5,62.75]);assert.deepEqual(await widths('e103'),await widths('e101'));});
 await test('Half panel merge restores full panel on both walls',async()=>{const ok=await page.evaluate(()=>{Prefab.select('e101',1);return Prefab.merge(1);});assert.equal(ok,true);assert.deepEqual(await widths('e101'),[125.5,125.5,125.5,125.5,62.75]);assert.deepEqual(await widths('e103'),await widths('e101'));});
 await test('Door panel swaps with terminal half and opposite window follows its panel',async()=>{
  const d=fixture();d.e=[{id:'e201',segId:'e101',tip_:'kapi',en:90,yuk:210,t:394.25/564.75,ad:'Giriş'},{id:'e202',segId:'e103',tip_:'pencere',en:90,yuk:120,t:(564.75-394.25-90)/564.75,ad:'Karşı pencere'}];await load(d);
  assert.equal(await page.evaluate(()=>{Prefab.select('e101',3);return Prefab.swap(1);}),true);
  const r=await page.evaluate(()=>({door:G.elemanlar[0].t*564.75,windowStart:564.75-G.elemanlar[1].t*564.75-90,trusses:makasAnaliz().makaslar.map(m=>m.pos),issues:Prefab.issues()}));near(r.door,457);near(r.windowStart,457);assert.deepEqual(await widths('e101'),[125.5,125.5,125.5,62.75,125.5]);assert.deepEqual(await widths('e103'),await widths('e101'));assert.deepEqual(r.trusses,[0,125.5,251,376.5,502,564.75]);assert.ok(r.issues.some(i=>i.code==='truss-support'));
 });
 await test('Swapping panels is a single undo step including opposite wall and trusses',async()=>{await page.evaluate(()=>geriAl());assert.deepEqual(await widths('e101'),[125.5,125.5,125.5,125.5,62.75]);near(await page.evaluate(()=>G.elemanlar[0].t*564.75),394.25);await page.evaluate(()=>ileriAl());near(await page.evaluate(()=>G.elemanlar[0].t*564.75),457);});
 await test('Panel configuration and matched truss positions survive JSON round trip',async()=>{const d=await page.evaluate(()=>Studio.state());Project.validate(d);await load(d);assert.deepEqual(await widths('e101'),[125.5,125.5,125.5,62.75,125.5]);assert.deepEqual(await page.evaluate(()=>makasAnaliz().makaslar.map(m=>m.pos)),[0,125.5,251,376.5,502,564.75]);});
 await test('Splitting through an opening is rejected without model changes',async()=>{const r=await page.evaluate(()=>{Prefab.select('e101',4);const before=Studio.snapshot(),ok=Prefab.split();return{ok,unchanged:before===Studio.snapshot()};});assert.deepEqual(r,{ok:false,unchanged:true});});
 await test('Door insertion at terminal half automatically changes both wall sequences',async()=>{await load();const r=await page.evaluate(()=>{openModal('kapi',getSeg('e101'),{x:550,y:0},{x:550,y:0});document.getElementById('mEn').value='90';modalOk();return{els:G.elemanlar.length,position:G.elemanlar[0]?.t*564.75,hist:G.hist.length,issues:Prefab.issues()};});assert.equal(r.els,1);near(r.position,457);assert.deepEqual(await widths('e103'),[125.5,125.5,125.5,62.75,125.5]);assert.equal(r.hist,1);assert.ok(r.issues.some(i=>i.code==='truss-support'));await page.evaluate(()=>geriAl());assert.equal(await page.evaluate(()=>G.elemanlar.length),0);assert.deepEqual(await widths('e103'),[125.5,125.5,125.5,125.5,62.75]);});
 await test('Removing a middle panel creates only its physical gap and is undoable',async()=>{await load();const r=await page.evaluate(()=>{Prefab.select('e101',1);const ok=Prefab.remove();return{ok,rooms:G.rooms.length,top:G.segs.filter(s=>getNode(s.n1).y===0&&getNode(s.n2).y===0).map(s=>[getNode(s.n1).x,getNode(s.n2).x]),walls:G.segs.length};});assert.equal(r.ok,true);assert.equal(r.rooms,0);assert.deepEqual(r.top,[[0,125.5],[251,564.75]]);assert.equal(r.walls,5);await page.evaluate(()=>geriAl());assert.equal(await page.evaluate(()=>G.rooms.length),1);assert.equal(await page.evaluate(()=>G.segs.length),4);});
 await test('Delete key in panel mode removes a panel rather than the complete wall',async()=>{await load();await page.evaluate(()=>{G.selectionMode='panel';Prefab.select('e101',2);});await page.locator('#cv').focus();await page.keyboard.press('Delete');assert.equal(await page.evaluate(()=>G.segs.length),5);assert.equal(await page.evaluate(()=>G.segs.filter(s=>getNode(s.n1).y===0&&getNode(s.n2).y===0).length),2);});
 await test('Locked snap ignores a non-H branch node 5 cm away from a real H',async()=>{const d=fixture();d.n.push({id:'e5',x:246,y:0},{id:'e6',x:246,y:300});d.s.push({id:'e105',n1:'e5',n2:'e6',k:6});await load(d);for(const zoom of [.4,1,2]){const r=await page.evaluate(zoom=>{G.zoom=zoom;G.duvarYakala='kilit';const p=toCv(247,0),hit=snapPoint(p.x,p.y);return{hit,kind:G._snapInfo.kind};},zoom);near(r.hit.x,251);near(r.hit.y,0);assert.equal(r.kind,'H');}});
 await test('Locked snap captures actual panel centre',async()=>{await load();const r=await page.evaluate(()=>{G.duvarYakala='kilit';const p=toCv(190,0);return snapPoint(p.x,p.y);});near(r.x,188.25);near(r.y,0);});
 await test('Free snap follows the requested step and reports distance to H',async()=>{await load();const r=await page.evaluate(()=>{G.duvarYakala='serbest';G.freeSnapStep=1;const p=toCv(247.1,0);const result=snapPoint(p.x,p.y);return{result,delta:G._snapInfo.delta,label:G._snapLbl};});near(r.result.x,247);near(r.delta,-4);assert.match(r.label,/H -4 cm/);});
 await test('Existing off-axis start is blocked rather than silently shifted beside H',async()=>{const d=fixture();d.n.push({id:'e5',x:246,y:512},{id:'e6',x:246,y:300});d.s.push({id:'e105',n1:'e5',n2:'e6',k:6});await load(d);const r=await page.evaluate(()=>{G.duvarYakala='kilit';G.drawing=true;G.drawStart='e6';G._basH=false;const p=toCv(247,0),hit=snapPoint(p.x,p.y);return{hit,blocked:G._snapBlocked,start:getNode('e6').x};});near(r.hit.x,251);assert.equal(r.blocked,true);near(r.start,246);});
 await test('Opting out of opposite alignment edits only the selected wall and reports support mismatch',async()=>{await load();const r=await page.evaluate(()=>{G.panelSync=false;Prefab.select('e101',3);Prefab.swap(1);return Prefab.issues();});assert.deepEqual(await widths('e101'),[125.5,125.5,125.5,62.75,125.5]);assert.deepEqual(await widths('e103'),[125.5,125.5,125.5,125.5,62.75]);assert.ok(r.some(i=>i.code==='truss-support'));});
  await test('Vertical truss direction reorders corresponding vertical walls',async()=>{const d=fixture();d.catiYon='dikey';d.n.forEach(n=>{[n.x,n.y]=[n.y,n.x];});await load(d);assert.equal(await page.evaluate(()=>{Prefab.select('e101',3);return Prefab.swap(1);}),true);assert.deepEqual(await widths('e103'),[125.5,125.5,125.5,62.75,125.5]);assert.deepEqual(await page.evaluate(()=>makasAnaliz().makaslar.map(m=>m.pos)),[0,125.5,251,376.5,502,564.75]);});
  await test('A separate building with the same axis range is not changed',async()=>{const d=fixture(),other=fixture();other.n.forEach(n=>{n.id='other_'+n.id;n.y+=900;});other.s.forEach(s=>{s.id='other_'+s.id;s.n1='other_'+s.n1;s.n2='other_'+s.n2;});d.n.push(...other.n);d.s.push(...other.s);await load(d);await page.evaluate(()=>{Prefab.select('e101',3);Prefab.swap(1);});assert.deepEqual(await widths('other_e101'),[125.5,125.5,125.5,125.5,62.75]);assert.deepEqual(await widths('e103'),[125.5,125.5,125.5,62.75,125.5]);});
  await test('Wall-level reverse also synchronizes counterpart panels',async()=>{await load();await page.evaluate(()=>{G.secili=getSeg('e101');G.seciliTip='seg';panelTersCevir();});assert.deepEqual(await widths('e101'),[62.75,125.5,125.5,125.5,125.5]);assert.deepEqual(await widths('e103'),await widths('e101'));});
  await test('Manual panel sequence synchronizes counterpart and persists explicit halves',async()=>{await load();await page.evaluate(()=>{G.secili=getSeg('e101');G.seciliTip='seg';pfDiziAyarla('62,75 + 62,75 + 125,5 + 125,5 + 125,5 + 62,75');});assert.deepEqual(await widths('e101'),[62.75,62.75,125.5,125.5,125.5,62.75]);assert.deepEqual(await widths('e103'),await widths('e101'));});
  await test('Panel quantities report actual 15 cm rather than default 10 cm',async()=>{await load();const r=await page.evaluate(()=>{G.secili=getSeg('e101');G.seciliTip='seg';upSelSeg('k',15);return metrajKalemleri();});assert.ok(r.some(row=>row.grup==='Paneller — Dış duvar (15 cm)'&&row.adet>0));assert.ok(r.some(row=>row.grup==='Duvar uzunlukları'&&row.olcu==='15 cm'&&row.adet>0));});
  await test('Removing a door panel removes its opening but preserves the other panels',async()=>{const d=fixture();d.e=[{id:'e201',segId:'e101',tip_:'kapi',en:90,yuk:210,t:394.25/564.75,ad:'Giriş'}];await load(d);await page.evaluate(()=>{Prefab.select('e101',3);Prefab.remove();});assert.equal(await page.evaluate(()=>G.elemanlar.length),0);assert.equal(await page.evaluate(()=>G.segs.length),5);await page.evaluate(()=>geriAl());assert.equal(await page.evaluate(()=>G.elemanlar.length),1,await page.locator('#toast').innerText());});
  await test('High zoom pointer click lands exactly on H, not on a nearby arbitrary node',async()=>{const d=fixture();d.n.push({id:'e5',x:246,y:0},{id:'e6',x:246,y:300});d.s.push({id:'e105',n1:'e5',n2:'e6',k:6});await load(d);await page.locator('#t-duvar').click();const point=await page.evaluate(()=>{G.zoom=1.82;G.pan={x:-200,y:160};draw();const p=toCv(247,0),b=cv.getBoundingClientRect();return{x:b.left+p.x,y:b.top+p.y};});await page.mouse.click(point.x,point.y);near(await page.evaluate(()=>getNode(G.drawStart).x),251);await page.keyboard.press('Escape');});
 await test('Snap settings switch H-only, centres, free step and off without moving the pointer',async()=>{
  await load();await page.evaluate(()=>{const p=toCv(190,0);snapPoint(p.x,p.y);});
  await page.locator('#yakalaSel').selectOption('h');near(await page.evaluate(()=>G.snapPt.x),251);assert.equal(await page.locator('#freeSnapStep').isDisabled(),true);
  await page.locator('#yakalaSel').selectOption('kilit');near(await page.evaluate(()=>G.snapPt.x),188.25);
  await page.locator('#yakalaSel').selectOption('serbest');assert.equal(await page.locator('#freeSnapStep').isDisabled(),false);
  await page.locator('#freeSnapStep').selectOption('10');near(await page.evaluate(()=>G.snapPt.x),190);
  await page.locator('#wallSnapEnabled').uncheck();assert.equal(await page.evaluate(()=>G.snapWall),false);assert.match(await page.locator('#snapReadout').innerText(),/kapalı/);
  await page.locator('#yakalaSel').selectOption('h');assert.equal(await page.locator('#wallSnapEnabled').isChecked(),true);
  const saved=await page.evaluate(()=>Studio.state());assert.equal(Project.validate(saved).settings.duvarYakala,'h');await load(saved);assert.equal(await page.locator('#yakalaSel').inputValue(),'h');
 });
 await test('Grid fallback outside wall hit area cannot bypass H lock',async()=>{
  await load();const r=await page.evaluate(()=>{G.zoom=2;G.gridCm=62.75;G.duvarYakala='h';const p=toCv(584,248);const hit=snapPoint(p.x,p.y);return{hit,kind:G._snapInfo?.kind};});near(r.hit.x,564.75);near(r.hit.y,256);assert.equal(r.kind,'H');
 });
 await test('Completed vertical-wall branch stays on the displayed H at multiple zoom levels',async()=>{
  for(const zoom of [.7,1.5,2]){
   await load();await page.locator('#t-duvar').click();await page.locator('#yakalaSel').selectOption('h');
   const points=await page.evaluate(zoom=>{G.scale=1;G.zoom=zoom;G.pan={x:460-564.75*sc(),y:320-256*sc()};draw();const b=cv.getBoundingClientRect();return[{x:564.75,y:251},{x:370,y:251}].map(v=>{const p=toCv(v.x,v.y);return{x:b.left+p.x,y:b.top+p.y};});},zoom);
   await page.mouse.click(points[0].x,points[0].y);near(await page.evaluate(()=>getNode(G.drawStart).y),256);
   await page.mouse.move(points[1].x,points[1].y);near(await page.evaluate(()=>G.snapPt.y),256);
   await page.mouse.click(points[1].x,points[1].y);await page.keyboard.press('Escape');
   const r=await page.evaluate(()=>{const branch=G.segs.find(s=>{const a=getNode(s.n1),b=getNode(s.n2);return Math.abs(a.y-256)<.001&&Math.abs(b.y-256)<.001;});const run=pfRunOf(G.segs.find(s=>getNode(s.n1).x===564.75&&getNode(s.n2).x===564.75)).run;return{exists:!!branch,joint:run.slots.some(p=>Math.abs(p.a-256)<.001),slots:run.slots.map(p=>p.a),s0:run.s0,ay:run.ay};});assert.equal(r.exists,true,JSON.stringify(r));assert.equal(r.joint,true,JSON.stringify(r));
  }
 });
 await test('Nearby non-H node cannot replace an exact H during creation or normalization',async()=>{
  const d=fixture();d.n.push({id:'near',x:251.5,y:0},{id:'below',x:251.5,y:100});d.s.push({id:'nearwall',n1:'near',n2:'below',k:6});await load(d);
  const r=await page.evaluate(()=>{const id=addNode(251,0),end=addNode(251,200);addSeg(id,end,6);return{exact:G.nodes.some(n=>Math.abs(n.x-251)<.001&&n.y===0),old:getNode('near')?.x};});assert.equal(r.exact,true);near(r.old,251.5);
 });
 await test('Panel controls remain visible at desktop widths',async()=>{await load();await page.evaluate(()=>{G.selectionMode='panel';Prefab.select('e101',3);Studio.fit();});fs.mkdirSync('artifacts',{recursive:true});await page.waitForTimeout(3600);await page.screenshot({path:'artifacts/06-panel-editor.png'});await page.locator('#selectionMode').selectOption('wall');await page.evaluate(()=>topluKalinlik());await page.screenshot({path:'artifacts/07-wall-thickness.png'});await page.evaluate(()=>document.getElementById('mbgK').classList.remove('open'));});
 await test('Independent 502 cm wall previews and commits four full panels in both axes and directions',async()=>{
  for(const vertical of [false,true])for(const direction of [-1,1])for(const withBuilding of [false,true]){
   const d=fixture();if(!withBuilding){d.n=[];d.s=[];}d.catiYon=vertical?'dikey':'yatay';await load(d);
   const r=await page.evaluate(({vertical,direction})=>{
    const a=vertical?{x:1000,y:62.75}:{x:62.75,y:1000};a.id=addNode(a.x,a.y);
    const b=vertical?{x:a.x,y:a.y+direction*502}:{x:a.x+direction*502,y:a.y};
    const labels=[],fill=ctx.fillText;ctx.fillText=function(text,...args){labels.push(text);return fill.call(this,text,...args);};
    try{drawPreviewPaneller(a,b);}finally{ctx.fillText=fill;}
    const id=addSeg(a.id,addNode(b.x,b.y),10);return{labels,widths:pfRunOf(getSeg(id)).run.slots.map(p=>p.w)};
   },{vertical,direction});assert.ok(r.labels.includes('4 tam'),JSON.stringify(r));assert.deepEqual(r.widths,[125.5,125.5,125.5,125.5]);
  }
 });
 await test('Attached wall retains necessary half-panel offsets for the building H grid',async()=>{
  const d=fixture();d.n.push({id:'anchor',x:62.75,y:0},{id:'branchEnd',x:62.75,y:800});d.s.push({id:'branch',n1:'anchor',n2:'branchEnd',k:6});await load(d);
  const labels=await page.evaluate(()=>{const a=getNode('branchEnd'),labels=[],fill=ctx.fillText;ctx.fillText=function(text,...args){labels.push(text);return fill.call(this,text,...args);};try{drawPreviewPaneller(a,{x:a.x+502,y:a.y});}finally{ctx.fillText=fill;}return labels;});assert.ok(labels.includes('3 tam + 2 yarım'),JSON.stringify(labels));
 });
 await test('Hovering, selecting and sub-threshold node jitter never change geometry or history',async()=>{
  await load();const before=await page.evaluate(()=>JSON.stringify(G.nodes));
  const p=await page.evaluate(()=>{G.scale=1;G.zoom=1;G.pan={x:100,y:100};draw();const b=cv.getBoundingClientRect();return{x:b.left+100,y:b.top+100};});
  await page.mouse.move(p.x+50,p.y);await page.mouse.move(p.x+2,p.y+2);assert.equal(await page.evaluate(()=>JSON.stringify(G.nodes)),before);
  await page.mouse.down();await page.mouse.move(p.x+4,p.y+3);await page.mouse.up();
  assert.equal(await page.evaluate(()=>JSON.stringify(G.nodes)),before);assert.equal(await page.evaluate(()=>G.hist.length),0);
 });
 await test('Wall move honors snap-off and actual H targets; tangential motion does not activate it',async()=>{
  for(const enabled of [false,true]){await load();const r=await page.evaluate(enabled=>{G.snapWall=enabled;G.snapGrid=false;G.moveAlign=false;G.moveModule=false;G.duvarYakala='h';const s=getSeg('e101');G.selSegs=[s.id];wallDragBegin(s,{x:200,y:0},200,100);wallDragMove({x:240,y:0},240,100);const idle=!G.wallDrag.active;wallDragMove({x:200,y:128.5},200,228.5);return{idle,off:G.wallDrag.off};},enabled);assert.equal(r.idle,true);near(r.off,enabled?130.5:128.5);}
 });
 await test('Real wall drag cancels with Escape and lost mouseup cannot move a wall on hover',async()=>{
  await load();const before=await page.evaluate(()=>JSON.stringify(G.nodes));const p=await page.evaluate(()=>{G.snapGrid=false;G.snapWall=false;G.scale=1;G.zoom=1;G.pan={x:100,y:100};draw();const b=cv.getBoundingClientRect();return{x:b.left+300,y:b.top+100};});
  await page.mouse.move(p.x,p.y);await page.mouse.down();await page.mouse.move(p.x,p.y+30);assert.notEqual(await page.evaluate(()=>JSON.stringify(G.nodes)),before);
  await page.keyboard.press('Escape');await page.mouse.up();assert.equal(await page.evaluate(()=>JSON.stringify(G.nodes)),before);assert.equal(await page.evaluate(()=>G.hist.length),0);
  await page.mouse.move(p.x,p.y);await page.mouse.down();await page.mouse.move(p.x,p.y+30);await page.mouse.up();
  assert.notEqual(await page.evaluate(()=>JSON.stringify(G.nodes)),before);assert.equal(await page.evaluate(()=>G.hist.length),1);
  await page.evaluate(()=>geriAl());assert.equal(await page.evaluate(()=>JSON.stringify(G.nodes)),before);
  await page.evaluate(()=>{G.dragging=true;G.wallDrag={active:false};});await page.mouse.move(p.x+40,p.y+40);
  assert.equal(await page.evaluate(()=>G.dragging),false);assert.equal(await page.evaluate(()=>JSON.stringify(G.nodes)),before);
 });
 await test('Custom snap checkboxes combine independently, ignore unchecked targets and persist',async()=>{
  await load();await page.locator('[data-snap-target="mid"]').check();assert.equal(await page.locator('#yakalaSel').inputValue(),'custom');
  await page.locator('[data-snap-target="h"]').uncheck();await page.locator('[data-snap-target="end"]').uncheck();
  let r=await page.evaluate(()=>{const p=toCv(250,0);return snapPoint(p.x,p.y);});near(r.x,188.25);
  await page.locator('[data-snap-target="h"]').check();r=await page.evaluate(()=>{const p=toCv(250,0);return snapPoint(p.x,p.y);});near(r.x,251);
  await page.locator('#moveModule').check();const saved=await page.evaluate(()=>Studio.state());const parsed=Project.validate(saved);assert.equal(parsed.settings.snapTargets.h,true);assert.equal(parsed.settings.snapTargets.end,false);assert.equal(parsed.settings.moveModule,true);await load(saved);assert.equal(await page.locator('[data-snap-target="h"]').isChecked(),true);assert.equal(await page.locator('[data-snap-target="end"]').isChecked(),false);
  await page.screenshot({path:'artifacts/09-multi-snap-settings.png'});
 });
 await test('Extending an explicit panel sequence divides the new length into manufactured modules',async()=>{
  const d=fixture();d.n=[{id:'e1',x:0,y:0},{id:'e2',x:188.25,y:0}];d.s=[{id:'e101',n1:'e1',n2:'e2',k:10,pnlCfg:{dizi:[125.5,62.75],explicit:true}}];await load(d);
  await page.evaluate(()=>{const end=addNode(690.25,0);addSeg('e2',end,10);});
  assert.deepEqual(await widths('e101'),[125.5,62.75,125.5,125.5,125.5,125.5]);
 });
 await test('Exterior corner keeps its panels and post when 6 or 10 cm interior wall joins via U',async()=>{
  for(const ic of [6,10])for(const rotated of [false,true]){
   const d=fixture();d.opt.ic=ic;d.catiYon=rotated?'dikey':'yatay';
   d.n=[[0,0],[600,0],[600,600],[313.75,600],[313.75,300],[0,300]].map(([x,y],i)=>({id:'e'+(i+1),x:rotated?y:x,y:rotated?x:y}));
   d.s=d.n.map((n,i)=>({id:'e'+(101+i),n1:n.id,n2:d.n[(i+1)%6].id,k:10}));await load(d);
   const before=await widths('e105');assert.deepEqual(before,[125.5,125.5,62.75]);
   const result=await page.evaluate(({ic,rotated})=>{const id=addNode(rotated?0:313.75,rotated?313.75:0);addSeg('e5',id,ic);const a=pfAnaliz(),b=a.bag.filter(b=>b.nid==='e5');return {b:b.map(b=>({tip:b.tip,k:b.k})),runs:a.runs.filter(r=>r.nodes.some(n=>n.nid==='e5')).length,model:Studio.state()};},{ic,rotated});
   assert.deepEqual(await widths('e105'),before);assert.equal(result.runs,3);assert.deepEqual(result.b,[{tip:'kose',k:'10'},{tip:'U',k:String(ic)}]);
   await load(result.model);assert.deepEqual(await widths('e105'),before);
  }
 });
 await test('Manual truss move is explicit, undoable, persisted and resettable',async()=>{
  await load();await page.locator('#trussSelect').selectOption('1');await page.locator('#trussPosition').fill('140');await page.locator('#trussMove').click();
  near(await page.evaluate(()=>makasAnaliz().makaslar[1].pos),140);assert.equal(await page.evaluate(()=>G.hist.length),1);
  await page.evaluate(()=>geriAl());near(await page.evaluate(()=>makasAnaliz().makaslar[1].pos),125.5);await page.evaluate(()=>ileriAl());near(await page.evaluate(()=>makasAnaliz().makaslar[1].pos),140);
  const d=await page.evaluate(()=>Studio.state());Project.validate(d);await load(d);near(await page.evaluate(()=>makasAnaliz().makaslar[1].pos),140);
  await page.locator('#trussSelect').selectOption('1');await page.locator('#trussPosition').fill('251');await page.locator('#trussMove').click();near(await page.evaluate(()=>makasAnaliz().makaslar[1].pos),140);
  await page.locator('#trussPosition').fill('-1');await page.locator('#trussMove').click();near(await page.evaluate(()=>makasAnaliz().makaslar[1].pos),140);
  await page.locator('#trussReset').click();near(await page.evaluate(()=>makasAnaliz().makaslar[1].pos),125.5);
 });
 await test('Panel edits preserve manual truss positions too',async()=>{
  await load();await page.evaluate(()=>{document.getElementById('trussSelect').value='1';document.getElementById('trussPosition').value='140';Prefab.trussMove();Prefab.select('e101',3);Prefab.swap(1);});
  assert.deepEqual(await page.evaluate(()=>makasAnaliz().makaslar.map(m=>m.pos)),[0,140,251,376.5,502,564.75]);
 });
 await test('Strict modular mode rejects arbitrary new panel lengths atomically; exception mode is explicit',async()=>{
  const d=fixture();d.n=[];d.s=[];d.settings={panelDrawMode:'mixed'};await load(d);
  const r=await page.evaluate(()=>{const before=Studio.snapshot();const ok=Studio.edit(()=>{addSeg(addNode(0,0),addNode(100,0),10);});return {ok,unchanged:before===Studio.snapshot()};});assert.deepEqual(r,{ok:false,unchanged:true});
  assert.equal(await page.evaluate(()=>Studio.edit(()=>{addSeg(addNode(0,0),addNode(125.5,0),10);})),true);
  await page.locator('#panelDrawMode').selectOption('exception');assert.equal(await page.evaluate(()=>Studio.edit(()=>{addSeg(addNode(0,300),addNode(100,300),10);})),true);
  assert.ok(await page.evaluate(()=>Modular.inspect().some(i=>i.code==='module-width')));
 });
 await test('Full panel drawing uses 125.5 cm step and settings survive saving',async()=>{
  const d=fixture();d.n=[];d.s=[];d.settings={panelDrawMode:'full'};await load(d);
  const r=await page.evaluate(()=>{const n={id:addNode(0,0),x:0,y:0};return pfCizimSnap(n,190,0);});near(r.x,251);
  const state=await page.evaluate(()=>Studio.state());assert.equal(Project.validate(state).settings.panelDrawMode,'full');
 });
 await test('Common H axes report staggered parallel walls without moving imported geometry',async()=>{
  const d=fixture();d.settings={panelDrawMode:'mixed'};d.n.push({id:'insideA',x:200,y:0},{id:'insideB',x:200,y:400});d.s.push({id:'inside',n1:'insideA',n2:'insideB',k:6,pnlCfg:{dizi:[110,125.5,125.5],explicit:true}});await load(d);
  const before=await page.evaluate(()=>JSON.stringify(G.nodes));assert.ok(await page.evaluate(()=>Modular.inspect().some(i=>i.code==='module-axis')));await page.evaluate(()=>Studio.analyze());assert.equal(await page.evaluate(()=>JSON.stringify(G.nodes)),before);
 });
 await test('Strict mouse drawing commits a full panel and rejects nonmodular numeric continuation',async()=>{
  const d=fixture();d.n=[];d.s=[];d.settings={panelDrawMode:'mixed'};await load(d);await page.locator('#t-duvar').click();
  const pts=await page.evaluate(()=>{G.scale=1;G.zoom=1;G.pan={x:100,y:100};draw();const b=cv.getBoundingClientRect();return [{x:b.left+100,y:b.top+100},{x:b.left+225.5,y:b.top+100}];});
  await page.mouse.click(pts[0].x,pts[0].y);await page.mouse.click(pts[1].x,pts[1].y);assert.equal(await page.evaluate(()=>G.segs.length),1);
  const before=await page.evaluate(()=>JSON.stringify(G.segs));await page.evaluate(()=>{G.inputUnit='cm';G.numBuf='100';G.drawPreviewPt={x:300,y:0};G.snapPt={x:300,y:0};numUygula();});assert.equal(await page.evaluate(()=>JSON.stringify(G.segs)),before);
 });
 await test('Perpendicular panel length keeps corner allowance despite nearby off-module node',async()=>{
  const d=fixture();d.settings={panelDrawMode:'mixed'};d.n.push({id:'off',x:900,y:313.75},{id:'off2',x:1000,y:313.75});d.s.push({id:'offwall',n1:'off',n2:'off2',k:10});await load(d);
  const r=await page.evaluate(()=>{G.zoom=1;G.scale=1;return pfCizimSnap(getNode('e1'),0,313.75);});near(r.y,318.75);
  const widthsAfterTurn=await page.evaluate(()=>{G.nodes=[{id:'a',x:0,y:0},{id:'b',x:502,y:0},{id:'c',x:502,y:318.75},{id:'d',x:0,y:318.75}];G.segs=[{id:'ab',n1:'a',n2:'b',k:10},{id:'bc',n1:'b',n2:'c',k:10,pfSnap:true}];G.defaultK=10;cizimKoseDuzelt(getNode('c'),getNode('d'),false);G.segs.push({id:'cd',n1:'c',n2:'d',k:10});return pfRunOf(getSeg('bc')).run.slots.map(p=>p.w);});assert.deepEqual(widthsAfterTurn,[125.5,125.5,62.75]);
 });
 await test('A wall started at an existing panel centre cannot be shifted to an off-axis opposite corner',async()=>{
  const d=fixture();d.n=[[0,0],[502,0],[502,576],[188.25,576],[188.25,313.75],[0,313.75]].map(([x,y],i)=>({id:'e'+(i+1),x,y}));d.s=d.n.map((n,i)=>({id:'e'+(101+i),n1:n.id,n2:d.n[(i+1)%6].id,k:10}));await load(d);
  const r=await page.evaluate(()=>{G.duvarYakala='kilit';const id=addNode(502,318.75);G.drawStart=id;G.drawing=true;G._basH=false;const p=toCv(0,313.75);snapPoint(p.x,p.y);return{y:getNode(id).y,shift:G._ekKaydir,blocked:G._snapBlocked};});near(r.y,318.75);assert.equal(r.shift,null);assert.equal(r.blocked,true);
 });
 await test('Stepped corners trim panels and keep the opposite H axis, including rotated plans',async()=>{
  for(const rotated of [false,true])for(const k of [6,10,15]){
   const d=fixture();d.settings={panelDrawMode:'mixed'};d.opt.dis=k;d.catiYon=rotated?'dikey':'yatay';
   const h=k/2;d.n=[[0,0],[502,0],[502,h+502],[0,h+125.5],[188.25,h+125.5]].map(([x,y],i)=>({id:'p'+i,x:rotated?y:x,y:rotated?x:y}));
   d.s=[{id:'top',n1:'p0',n2:'p1',k},{id:'right',n1:'p1',n2:'p2',k},{id:'left',n1:'p0',n2:'p3',k,pfSnap:true}];await load(d);
   const r=await page.evaluate(({rotated,k})=>{G.defaultK=k;const n=getNode('p3'),end=getNode(addNode(rotated?k/2+125.5:188.25,rotated?188.25:k/2+125.5)),before={x:n.x,y:n.y};cizimKoseDuzelt(n,end,false);addSeg(n.id,end.id,k);const a=pfRunOf(getSeg('left')).run,b=pfRunOf(getSeg('right')).run;return{before,after:{x:n.x,y:n.y},widths:a.slots.map(p=>p.w),oppositeH:(rotated?b.ax:b.ay)+b.slots[1].a,issues:Modular.inspect()};},{rotated,k});
   assert.deepEqual(r.after,r.before);assert.deepEqual(r.widths,[125.5-h]);near(r.oppositeH,h+125.5);assert.deepEqual(r.issues,[]);
  }
 });
 await test('Strict numeric and pointer module endpoints agree at the first corner',async()=>{
  const d=fixture();d.settings={panelDrawMode:'mixed'};d.n=d.n.slice(0,2);d.s=d.s.slice(0,1);await load(d);
  const r=await page.evaluate(()=>{G.inputUnit='panel';const n=getNode('e1');return{mouse:pfCizimSnap(n,0,130.5).y,numeric:numUzunluk(n,{x:0,y:1},1).L};});near(r.mouse,r.numeric);
 });
 await test('Stepped numeric outline keeps shared axes and preview matches committed panels',async()=>{
  for(const rotated of [false,true])for(const mirror of [1,-1])for(const k of [6,10,15]){
   const d=fixture();d.n=[];d.s=[];d.settings={panelDrawMode:'mixed'};d.opt.dis=k;d.catiYon=rotated?'dikey':'yatay';await load(d);
   const r=await page.evaluate(({rotated,mirror,k})=>{
    G.tool='duvar';G.defaultK=k;G.inputUnit='panel';G.drawStart=addNode(0,0);G.drawing=true;const steps=[];
    for(let [dx,dy,count] of [[1,0,2.5],[0,1,1.5],[1,0,2],[0,1,2],[-1,0,4.5],[0,-1,3.5]]){
     dx*=mirror;if(rotated)[dx,dy]=[dy,dx];
     const n=getNode(G.drawStart),u=numUzunluk(n,{x:dx,y:dy},count),ep={x:n.x+dx*u.L,y:n.y+dy*u.L};
     const before=Studio.snapshot(),preview=pfCizimOnizleme(n,ep),stable=before===Studio.snapshot();
     G.drawPreviewPt={x:n.x+dx*1000,y:n.y+dy*1000};G.snapPt=G.drawPreviewPt;G.numBuf=String(count);numUygula();
     const seg=G.segs.at(-1),run=pfRunOf(seg).run;
     steps.push({stable,preview:preview.slots.map(p=>p.w).sort((a,b)=>a-b),actual:run.slots.map(p=>p.w).sort((a,b)=>a-b),end:{x:getNode(G.drawStart).x,y:getNode(G.drawStart).y},expected:preview.end});
    }
    return{steps,rooms:G.rooms.length,segs:G.segs.length,issues:Modular.inspect()};
   },{rotated,mirror,k});
   assert.equal(r.segs,6,JSON.stringify(r));assert.equal(r.rooms,1,JSON.stringify(r));assert.deepEqual(r.issues,[],JSON.stringify(r));
   for(const s of r.steps){assert.equal(s.stable,true);assert.deepEqual(s.preview,s.actual);assert.deepEqual(s.end,s.expected);}
  }
 });
 await test('Mouse-drawn stepped outline closes without 52.75 cm remnants at different zooms',async()=>{
  for(const zoom of [.5,1]){
   const d=fixture();d.n=[];d.s=[];d.settings={panelDrawMode:'mixed'};await load(d);await page.locator('#t-duvar').click();
   await page.evaluate(zoom=>{G.scale=1;G.zoom=zoom;G.pan={x:60,y:60};draw();},zoom);
   for(const [x,y] of [[0,0],[313.75,0],[313.75,193.25],[564.75,193.25],[564.75,444.25],[0,444.25],[0,0]]){
    const p=await page.evaluate(({x,y})=>{const p=toCv(x,y),b=cv.getBoundingClientRect();return{x:p.x+b.left,y:p.y+b.top};},{x,y});await page.mouse.click(p.x,p.y);
   }
   const r=await page.evaluate(()=>({rooms:G.rooms.length,segs:G.segs.length,issues:Modular.inspect(),widths:pfAnaliz().runs.flatMap(r=>r.slots.map(p=>p.w))}));
   assert.equal(r.rooms,1,JSON.stringify(r));assert.equal(r.segs,6,JSON.stringify(r));assert.deepEqual(r.issues,[]);assert.ok(!r.widths.includes(52.75));
   await page.keyboard.press('Escape');const saved=await page.evaluate(()=>Studio.state());await page.evaluate(()=>geriAl());assert.equal(await page.evaluate(()=>G.rooms.length),0);await page.evaluate(()=>ileriAl());assert.equal(await page.evaluate(()=>G.rooms.length),1);await load(saved);assert.deepEqual(await page.evaluate(()=>Modular.inspect()),[]);
  }
 });
 await test('No unhandled browser errors in prefab scenarios',()=>assert.deepEqual(errors,[]));
 await test('P2 catalogue elevation survives reselecting its type and returning from another type',async()=>{
  await load();await page.evaluate(()=>openModal('pencere',getSeg('e101'),{x:188.25,y:0}));await page.locator('#windowPreset').selectOption({label:'P2 · 120 × 120 cm'});
  const svg=await page.locator('#windowPreview').innerHTML();await page.locator('#mPenTip').selectOption('tek-kanat');assert.equal(await page.locator('#windowPreview').innerHTML(),svg);
  await page.locator('#mPenTip').selectOption('sabit');await page.locator('#mPenTip').selectOption('tek-kanat');assert.equal(await page.locator('#windowPreview').innerHTML(),svg);await page.evaluate(()=>modalOk());assert.equal(await page.evaluate(()=>G.elemanlar[0].catalogId),'p2');
 });
 await test('Local half/full swap preserves other walls and allows a 120 cm window',async()=>{
  const d=fixture();d.settings={panelDrawMode:'mixed'};d.s[0].pnlCfg={dizi:[125.5,62.75,125.5,125.5,125.5],explicit:true};await load(d);const before=await page.evaluate(()=>Studio.snapshot()),other=await widths('e103'),axes=await page.evaluate(()=>makasAnaliz().makaslar.map(m=>m.pos));
  assert.equal(await page.evaluate(()=>{Prefab.select('e101',1);return Prefab.swapLocal(1);}),true);assert.deepEqual(await widths('e101'),[125.5,125.5,62.75,125.5,125.5]);assert.deepEqual(await widths('e103'),other);assert.deepEqual(await page.evaluate(()=>makasAnaliz().makaslar.map(m=>m.pos)),axes);
  await page.evaluate(()=>geriAl());assert.equal(await page.evaluate(()=>Studio.snapshot()),before);await page.evaluate(()=>ileriAl());await page.evaluate(()=>{openModal('pencere',getSeg('e101'),{x:188.25,y:0});document.getElementById('mEn').value='120';document.getElementById('mYuk').value='120';modalOk();});assert.equal(await page.evaluate(()=>G.elemanlar.length),1);
 });
 await test('160 cm window replaces three full panels with 105.25 + 166 + 105.25',async()=>{
  const d=fixture();d.settings={panelDrawMode:'mixed'};await load(d);const before=await page.evaluate(()=>Studio.snapshot()),other=await widths('e103'),axes=await page.evaluate(()=>makasAnaliz().makaslar.map(m=>m.pos));
  await page.evaluate(()=>{openModal('pencere',getSeg('e101'),{x:188.25,y:0});document.getElementById('mEn').value='160';document.getElementById('mYuk').value='180';modalOk();});
  assert.deepEqual(await widths('e101'),[105.25,166,105.25,125.5,62.75]);assert.deepEqual(await widths('e103'),other);assert.deepEqual(await page.evaluate(()=>makasAnaliz().makaslar.map(m=>m.pos)),axes);
  near(await page.evaluate(()=>G.elemanlar[0].t*564.75),108.25);await page.evaluate(()=>geriAl());assert.equal(await page.evaluate(()=>Studio.snapshot()),before);await page.evaluate(()=>ileriAl());
  const saved=await page.evaluate(()=>Studio.state());await load(saved);assert.deepEqual(await widths('e101'),[105.25,166,105.25,125.5,62.75]);
  const prior=await page.evaluate(()=>Studio.snapshot());await page.evaluate(()=>{G.secili=G.elemanlar[0];G.seciliTip='eleman';Prefab.fitWideWindow();});assert.equal(await page.evaluate(()=>Studio.snapshot()),prior);
 });
 await test('Wide window rejects a crossed junction atomically and can repair an existing opening',async()=>{
  const d=fixture();d.settings={panelDrawMode:'mixed'};d.n.push({id:'n5',x:125.5,y:0},{id:'n6',x:125.5,y:251});d.s.push({id:'s5',n1:'n5',n2:'n6',k:6,kSabit:true});await load(d);const before=await page.evaluate(()=>Studio.snapshot());
  await page.evaluate(()=>{openModal('pencere',getSeg('e101'),{x:188.25,y:0});document.getElementById('mEn').value='160';document.getElementById('mYuk').value='180';modalOk();});assert.equal(await page.evaluate(()=>Studio.snapshot()),before);await page.evaluate(()=>document.getElementById('mbg').classList.remove('open'));
  const old=fixture();old.settings={panelDrawMode:'mixed'};old.e=[{id:'wide',segId:'e101',tip_:'pencere',en:160,yuk:180,t:108.25/564.75}];await load(old);assert.equal(await page.evaluate(()=>{G.secili=G.elemanlar[0];G.seciliTip='eleman';return Prefab.fitWideWindow();}),true);assert.deepEqual(await widths('e101'),[105.25,166,105.25,125.5,62.75]);
 });
 await test('Local full-panel tool frees a 120 cm window without moving trusses or opposite panels',async()=>{
  const d=fixture();d.settings={panelDrawMode:'mixed'};d.s[0].pnlCfg={dizi:[62.75,125.5,125.5,125.5,125.5],explicit:true};await load(d);
  const before=await page.evaluate(()=>Studio.snapshot()),opposite=await widths('e103'),axes=await page.evaluate(()=>makasAnaliz().makaslar.map(m=>m.pos));
  assert.equal(await page.evaluate(()=>{Prefab.select('e101',0);return Prefab.makeFull(1);}),true);assert.deepEqual(await widths('e101'),[125.5,62.75,125.5,125.5,125.5]);assert.deepEqual(await widths('e103'),opposite);assert.deepEqual(await page.evaluate(()=>makasAnaliz().makaslar.map(m=>m.pos)),axes);
  await page.evaluate(()=>geriAl());assert.equal(await page.evaluate(()=>Studio.snapshot()),before);await page.evaluate(()=>ileriAl());
  await page.evaluate(()=>{openModal('pencere',getSeg('e101'),{x:62.75,y:0});document.getElementById('mEn').value='120';document.getElementById('mYuk').value='120';modalOk();});assert.equal(await page.evaluate(()=>G.elemanlar.length),1,await page.locator('#toast').innerText());
  const saved=await page.evaluate(()=>Studio.state());await load(saved);assert.equal(await page.evaluate(()=>getSeg('e101').pnlCfg.flexible),true);
  const state=await page.evaluate(()=>Studio.snapshot());assert.equal(await page.evaluate(()=>{Prefab.select('e101',0);return Prefab.makeFull(1);}),false);assert.equal(await page.evaluate(()=>Studio.snapshot()),state);
 });
 await test('Manufacturer catalogue applies window and handed door sizes and survives JSON round trip',async()=>{
  await load();assert.deepEqual(await page.evaluate(()=>[OpeningCatalog.filter(p=>p.tip_==='pencere').length,OpeningCatalog.filter(p=>p.tip_==='kapi').length]),[11,17]);
  await page.evaluate(()=>openModal('pencere',getSeg('e101'),{x:62.75,y:0}));await page.locator('#windowPreset').selectOption({label:'P6 · 80 × 125 cm'});assert.equal(await page.locator('#mEn').inputValue(),'80');assert.equal(await page.locator('#mYuk').inputValue(),'125');await page.evaluate(()=>modalOk());
  await page.evaluate(()=>openModal('kapi',getSeg('e103'),{x:300,y:512}));await page.locator('#windowPreset').selectOption({label:'Sağ çelik kapı · 90 × 205 cm'});assert.equal(await page.locator('#mMen').inputValue(),'sag');await page.evaluate(()=>modalOk());
  let d=await page.evaluate(()=>Studio.state());assert.deepEqual(d.e.map(e=>[e.catalogId,e.en,e.yuk]),[['p6',80,125],['steel-sag',90,205]]);await load(d);assert.deepEqual((await page.evaluate(()=>Studio.state())).e.map(e=>e.catalogId),['p6','steel-sag']);
  const variants=await page.evaluate(()=>OpeningCatalog.map(c=>OpeningViews.elevation({...c,catalogId:c.id})));assert.equal(new Set(variants).size,28);
  await page.evaluate(()=>{document.getElementById('windowPreview').innerHTML=OpeningCatalog.map(c=>'<div style="display:inline-block;width:230px">'+OpeningViews.elevation({...c,catalogId:c.id})+'</div>').join('');document.getElementById('mbg').classList.add('open');});
  await page.screenshot({path:'artifacts/opening-catalog-preview.png'});await page.evaluate(()=>document.getElementById('mbg').classList.remove('open'));
 });
 await test('Window picker repeats the last size, previews proportions and keeps actual opening width',async()=>{
  await load();await page.evaluate(()=>{openModal('pencere',getSeg('e101'),{x:62.75,y:0});document.getElementById('mEn').value='80';document.getElementById('mYuk').value='125';document.getElementById('mPenTip').value='tek-kanat';modalOk();openModal('pencere',getSeg('e101'),{x:313.75,y:0});});
  assert.equal(await page.locator('#mEn').inputValue(),'80');assert.equal(await page.locator('#mYuk').inputValue(),'125');assert.match(await page.locator('#windowPreview > svg').getAttribute('aria-label'),/80 × 125/);
  await page.locator('#windowPreset').selectOption('');await page.locator('#mEn').fill('60');await page.locator('#mYuk').fill('40');assert.match(await page.locator('#windowPreview > svg').getAttribute('aria-label'),/60 × 40/);
  await page.evaluate(()=>modalOk());const sizes=await page.evaluate(()=>G.elemanlar.map(e=>[e.en,e.yuk]));assert.deepEqual(sizes,[[80,125],[60,40]]);
  assert.match(await page.locator('#sbSelIc').innerText(),/pencere görünüşü/iu);
  await page.evaluate(()=>openModal('pencere',getSeg('e103'),{x:300,y:512}));await page.locator('#windowPreset').selectOption({label:'Projede · 80 × 125 cm · Tek kanatlı'});assert.equal(await page.locator('#mEn').inputValue(),'80');await page.evaluate(()=>document.getElementById('mbg').classList.remove('open'));
 });
 await test('Door repaneling compacts leftover halves into full or shortened panels and undoes atomically',async()=>{
  for(const tail of [[62.75,57.75],[62.75,62.75,57.75]]){
   const d=fixture(),seq=[62.75,125.5,...tail.slice(1)],len=seq.reduce((a,b)=>a+b,0);d.n[1].x=d.n[2].x=len;d.s[0].pnlCfg={dizi:seq,explicit:true};await load(d);
   const before=await page.evaluate(()=>Studio.snapshot());
   const r=await page.evaluate(()=>{const axes=makasAnaliz().makaslar.map(m=>m.pos);openModal('kapi',getSeg('e101'),{x:62.75,y:0},{x:62.75,y:0});document.getElementById('mEn').value='80';modalOk();return{count:G.elemanlar.length,widths:pfRunOf(getSeg('e101')).run.slots.map(p=>p.w),axes,after:makasAnaliz().makaslar.map(m=>m.pos)};});
   assert.equal(r.count,1);assert.deepEqual(r.widths,tail.length===2?[125.5,120.5]:[125.5,125.5,57.75]);assert.deepEqual(r.axes,r.after);
   await page.evaluate(()=>geriAl());assert.equal(await page.evaluate(()=>Studio.snapshot()),before);
  }
 });
 await test('Manual merge accepts a shortened half and preserves a T connection',async()=>{
  const d=fixture();d.n[1].x=d.n[2].x=246;d.s[0].pnlCfg={dizi:[125.5,62.75,57.75],explicit:true};await load(d);
  assert.equal(await page.evaluate(()=>{Prefab.select('e101',2);return Prefab.merge(-1);}),true);assert.deepEqual(await widths('e101'),[125.5,120.5]);
  const t=fixture();t.s[0].pnlCfg={dizi:[62.75,62.75,125.5,125.5,125.5,62.75],explicit:true};t.n.push({id:'t1',x:62.75,y:0},{id:'t2',x:62.75,y:251});t.s.push({id:'branch',n1:'t1',n2:'t2',k:6,kSabit:true});await load(t);
  const before=await page.evaluate(()=>Studio.snapshot());assert.equal(await page.evaluate(()=>{Prefab.select('e101',0);return Prefab.merge(1);}),false);assert.equal(await page.evaluate(()=>Studio.snapshot()),before);
 });
 await test('Production direction rejects incompatible panels without resizing the frame',async()=>{
  const d=fixture();d.settings={panelDrawMode:'mixed'};d.n=[{id:'a',x:0,y:0},{id:'b',x:1004,y:0},{id:'c',x:1004,y:1139.5},{id:'d',x:0,y:1139.5}];d.s=d.n.map((n,i)=>({id:'w'+i,n1:n.id,n2:d.n[(i+1)%4].id,k:10,kSabit:true}));await load(d);
  const before=await page.evaluate(()=>Studio.snapshot());assert.equal(await page.evaluate(()=>catiYonAyarla('dikey')),false);assert.equal(await page.evaluate(()=>Studio.snapshot()),before);
  await page.locator('#moduleEditor summary').click();await page.locator('#outerWidth').fill('1014');await page.locator('#outerHeight').fill('1139.5');await page.getByRole('button',{name:'Net dış ölçüyü uygula',exact:true}).click();assert.equal(await page.evaluate(()=>G.panelDrawMode),'exception');
 });
 await test('Redrawing full, reverse or partial walls is rejected without changing quantities',async()=>{
  for(const [x1,x2] of [[0,564.75],[564.75,0],[100,300],[-50,150]]){await load();const r=await page.evaluate(({x1,x2})=>{const before=Studio.snapshot(),ok=Studio.edit(()=>addSeg(addNode(x1,0),addNode(x2,0),10,null,true));return{ok,same:before===Studio.snapshot()};},{x1,x2});assert.deepEqual(r,{ok:false,same:true});}
 });
 await test('Mouse redraw of an existing wall rolls back without extra material',async()=>{
  await load();await page.locator('#t-duvar').click();
  const before=await page.evaluate(()=>Studio.snapshot());
  for(const x of [0,564.75]){const p=await page.evaluate(x=>{const p=toCv(x,0),b=cv.getBoundingClientRect();return{x:b.left+p.x,y:b.top+p.y};},x);await page.mouse.click(p.x,p.y);}
  await page.keyboard.press('Escape');assert.equal(await page.evaluate(()=>Studio.snapshot()),before);
  assert.match(await page.locator('#toast').innerText(),/tekrar duvar çizilemez/);
 });
 await test('A crossing wall cannot run through a door or window but a clean T junction remains valid',async()=>{
  for(const tip of ['kapi','pencere']){const d=fixture();d.e=[{id:'opening',segId:'e101',tip_:tip,en:80,yuk:200,t:200/564.75}];await load(d);
   const r=await page.evaluate(()=>{const before=Studio.snapshot(),ok=Studio.edit(()=>addSeg(addNode(240,-100),addNode(240,100),6,null,true));return{ok,same:before===Studio.snapshot()};});assert.deepEqual(r,{ok:false,same:true});
  }
  await load();assert.equal(await page.evaluate(()=>Studio.edit(()=>addSeg(addNode(125.5,0),addNode(125.5,125.5),6,null,true))),true);
 });
 await test('Door on shortened interior support does not copy its 5 cm face allowance into exterior panels',async()=>{
  const d=fixture();d.settings={panelDrawMode:'mixed'};d.catiYon='dikey';
  d.n=[[0,0],[1004,0],[1004,1129.5],[0,1129.5],[376.5,0],[376.5,313.75],[564.75,0],[564.75,313.75],[376.5,188.25],[564.75,188.25],[0,313.75],[1004,313.75]].map(([x,y],i)=>({id:'n'+i,x,y}));
  d.s=[[0,1],[1,2],[2,3],[3,0],[4,5],[6,7],[8,9],[10,5],[7,11]].map(([a,b],i)=>({id:'s'+i,n1:'n'+a,n2:'n'+b,k:10,kSabit:true}));await load(d);
  const r=await page.evaluate(()=>{const run=pfRunOf(getSeg('s4')).run,it=run.items.find(it=>it.off<=251&&it.off+it.L>=251),before=makasAnaliz().makaslar.map(m=>m.pos);openModal('kapi',it.seg,{x:376.5,y:251},{x:376.5,y:251});document.getElementById('mEn').value='80';modalOk();return{count:G.elemanlar.length,widths:pfRunOf(getSeg('s4')).run.slots.map(p=>p.w),small:pfAnaliz().runs.flatMap(r=>r.slots).filter(p=>p.w<10).map(p=>p.w),before,after:makasAnaliz().makaslar.map(m=>m.pos),toast:document.getElementById('toast').textContent};});
  await page.evaluate(()=>document.getElementById('mbg').classList.remove('open'));
  assert.equal(r.count,1,JSON.stringify(r));assert.deepEqual(r.widths,[120.5,62.75,125.5]);assert.deepEqual(r.small,[]);assert.deepEqual(r.after,r.before);
 });
 await test('Explicit 6 cm drawing keeps thickness through the first turn instead of creating a 1 cm panel',async()=>{
  const d=fixture();d.catiYon='dikey';d.settings={panelDrawMode:'full',defaultK:6};await load(d);await page.locator('#t-duvar').click();
  await page.evaluate(()=>{setDK(6);G.scale=1;G.zoom=.4;G.pan={x:-400,y:60};draw();});
  for(const [x,y] of [[1255,0],[2262,0],[2265,1004]]){const p=await page.evaluate(({x,y})=>{const p=toCv(x,y),b=cv.getBoundingClientRect();return{x:b.left+p.x,y:b.top+p.y};},{x,y});await page.mouse.click(p.x,p.y);}
  const r=await page.evaluate(()=>({segs:G.segs.filter(s=>getNode(s.n1).x>1000).map(s=>({k:s.k,kSabit:s.kSabit})),issues:Modular.inspect().filter(i=>getNode(getSeg(i.id).n1).x>1000),toast:document.getElementById('toast').textContent}));assert.equal(r.segs.length,2,JSON.stringify(r));assert.ok(r.segs.every(s=>s.k===6&&s.kSabit),JSON.stringify(r));assert.deepEqual(r.issues,[]);
 });
 await test('H-centred door fits the full-module space between two wall junctions',async()=>{
  const d=fixture();d.n.push({id:'j1',x:188.25,y:0},{id:'j2',x:313.75,y:0},{id:'b1',x:188.25,y:200},{id:'b2',x:313.75,y:200});d.s.push({id:'branch1',n1:'j1',n2:'b1',k:6},{id:'branch2',n1:'j2',n2:'b2',k:6});await load(d);
  const r=await page.evaluate(()=>{const run=pfRunOf(getSeg('e101')).run,it=run.items.find(it=>it.off<=251&&it.off+it.L>=251);openModal('kapi',it.seg,{x:251,y:0},{x:251,y:0});document.getElementById('mEn').value='90';modalOk();const e=G.elemanlar[0],p=pfRunOf(getSeg(e.segId));return{centre:p.item.off+e.t*p.item.L+e.en/2,widths:p.run.slots.map(s=>s.w)};});near(r.centre,251);assert.deepEqual(r.widths,[125.5,62.75,125.5,62.75,125.5,62.75]);
 });
 await test('Door on H creates half-full-half layout, preserves roof axes and undoes atomically',async()=>{
  for(const rotated of [false,true]){
   const d=fixture();d.settings.panelDrawMode='mixed';if(rotated){d.n.forEach(n=>{[n.x,n.y]=[n.y,n.x];});d.catiYon='dikey';}await load(d);
   const before=await page.evaluate(()=>Studio.snapshot());
   const r=await page.evaluate(rotated=>{const trusses=makasAnaliz().makaslar.map(m=>m.pos),point=rotated?{x:0,y:251}:{x:251,y:0};openModal('kapi',getSeg('e101'),point,point);document.getElementById('mEn').value='90';modalOk();const e=G.elemanlar[0];return{count:G.elemanlar.length,centre:e?e.t*564.75+e.en/2:null,trusses,after:makasAnaliz().makaslar.map(m=>m.pos)};},rotated);
   assert.equal(r.count,1);near(r.centre,251);assert.deepEqual(r.after,r.trusses);assert.deepEqual(await widths('e101'),[125.5,62.75,125.5,62.75,125.5,62.75]);assert.deepEqual(await widths('e103'),await widths('e101'));
   const saved=await page.evaluate(()=>Studio.state());await page.evaluate(()=>geriAl());assert.equal(await page.evaluate(()=>Studio.snapshot()),before);await load(saved);near(await page.evaluate(()=>G.elemanlar[0].t*564.75+45),251);
  }
 });
 await test('H-centred door rejects a new joint through an existing opposite opening without partial edits',async()=>{
  const d=fixture();d.e=[{id:'window',segId:'e103',tip_:'pencere',en:90,yuk:120,t:(564.75-233.25)/564.75}];await load(d);
  const r=await page.evaluate(()=>{const before=Studio.snapshot();openModal('kapi',getSeg('e101'),{x:251,y:0},{x:251,y:0});document.getElementById('mEn').value='90';modalOk();return{same:Studio.snapshot()===before,count:G.elemanlar.length};});assert.deepEqual(r,{same:true,count:1});await page.evaluate(()=>document.getElementById('mbg').classList.remove('open'));
 });
 await test('Corner cap snap approaches from outside at 1000 percent zoom without grid fallback',async()=>{
  const d=fixture();d.n=[{id:'a',x:0,y:0},{id:'b',x:0,y:125.5},{id:'c',x:125.5,y:125.5}];d.s=[{id:'v',n1:'a',n2:'b',k:6},{id:'h',n1:'b',n2:'c',k:6}];await load(d);
  const r=await page.evaluate(()=>{G.zoom=10;G.scale=1;G.snapWall=true;G.duvarYakala='custom';G.snapTargets={h:true,mid:true,end:true};const p=toCv(-5,125.5);const hit=snapPoint(p.x,p.y);return{hit,kind:G._snapInfo?.kind};});assert.deepEqual(r,{hit:{x:0,y:125.5},kind:'end'});
 });
 await test('Wall selection states its segment meaning; panel mode still selects the H-bounded panel',async()=>{
  await load();await page.evaluate(()=>{G.secili=getSeg('e101');G.seciliTip='seg';updateSidebar();});assert.match(await page.locator('#sbSelIc').innerText(),/Duvar parçası seçili/);
  await page.locator('#sbSelIc button').filter({hasText:'Panel seçimine geç'}).click();assert.equal(await page.locator('#selectionMode').inputValue(),'panel');
  await page.evaluate(()=>Prefab.select('e101',1));assert.match(await page.locator('#sbSelIc').innerText(),/125.5 cm/);
 });
 await test('Fresh four-corner mouse rectangle keeps full panels on every side',async()=>{
  for(const rotated of [false,true])for(const mirrored of [false,true]){
   const d=fixture();d.n=[];d.s=[];d.settings={panelDrawMode:'mixed'};d.catiYon=rotated?'yatay':'dikey';await load(d);
   await page.locator('#t-duvar').click();
   await page.evaluate(()=>{G.scale=1;G.zoom=.35;G.pan={x:75,y:70};draw();});
   for(let [x,y] of [[0,0],[1009,0],[1014,1129.5],[0,1129.5],[0,0]]){
    if(mirrored)x=1004-x;
    if(rotated)[x,y]=[y,x];
    const p=await page.evaluate(({x,y})=>{const p=toCv(x,y),b=cv.getBoundingClientRect();return{x:p.x+b.left,y:p.y+b.top};},{x,y});await page.mouse.click(p.x,p.y);
   }
   const r=await page.evaluate(()=>({nodes:G.nodes,runs:pfAnaliz().runs.map(r=>r.slots.map(p=>p.w)),rooms:G.rooms.length,issues:Modular.inspect()}));
   assert.equal(r.rooms,1,JSON.stringify(r));assert.equal(r.runs.length,4,JSON.stringify(r));assert.ok(r.runs.flat().every(w=>Math.abs(w-125.5)<.001),JSON.stringify(r));
  }
 });
 await test('Fabrication catalogue keeps confirmed cuts separate and never guesses unknown cuts',async()=>{
  assert.deepEqual(await page.evaluate(()=>[62.75,59.75,57.75,120.5,122.5,52.75,100].map(Modular.cutMm)),[625,590,570,1200,1220,null,null]);
  assert.match(await page.evaluate(()=>pfSegPanelHTML(G.segs[0])),/Yerleşim \/ net kesim/);
 });
 await test('Numeric four-corner outline uses the same full panels as mouse drawing',async()=>{
  const d=fixture();d.n=[];d.s=[];d.settings={panelDrawMode:'mixed'};d.catiYon='dikey';await load(d);
  const r=await page.evaluate(()=>{G.tool='duvar';G.inputUnit='panel';G.drawStart=addNode(0,0);G.drawing=true;
   for(const [dx,dy,count] of [[1,0,8],[0,1,9],[-1,0,8],[0,-1,9]]){const n=getNode(G.drawStart);G.drawPreviewPt={x:n.x+dx*2000,y:n.y+dy*2000};G.snapPt=G.drawPreviewPt;G.numBuf=String(count);numUygula();}
   return{nodes:G.nodes,runs:pfAnaliz().runs.map(r=>r.slots.map(p=>p.w)),rooms:G.rooms.length};
  });assert.equal(r.rooms,1,JSON.stringify(r));assert.equal(r.runs.length,4);assert.ok(r.runs.flat().every(w=>Math.abs(w-125.5)<.001),JSON.stringify(r));
 });
 }finally{await browser.close();}
 fs.mkdirSync('artifacts',{recursive:true});fs.writeFileSync('artifacts/prefab-test-results.json',JSON.stringify({date:new Date().toISOString(),results},null,2));console.log(results.filter(r=>r.passed).length+'/'+results.length+' passed');if(results.some(r=>!r.passed))process.exitCode=1;
})().catch(e=>{console.error(e);process.exitCode=1;});
