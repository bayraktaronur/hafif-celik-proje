const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const {chromium}=require(path.resolve(path.dirname(process.execPath),'../node_modules/playwright'));
const root=path.resolve(__dirname,'../..'),hash=p=>crypto.createHash('sha256').update(fs.readFileSync(path.join(root,p))).digest('hex');
(async()=>{
 const protectedNames=['plan_cizim.html','dist/plan_studio.html','src/ceiling-panels.js','src/engine.js','cizimler/2026-10-02-tuna84-dwg-esleme-taslak.json'],before=Object.fromEntries(protectedNames.map(p=>[p,hash(p)]));
 const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'});
 try{
  const p=await browser.newPage({viewport:{width:1600,height:1000}}),errors=[],requests=[];p.on('pageerror',e=>errors.push(e.message));p.on('request',r=>{if(/^https?:/.test(r.url()))requests.push(r.url())});
  await p.goto(require('node:url').pathToFileURL(path.join(__dirname,'arakat.html')).href);assert.equal(await p.evaluate(()=>Scene3D.stats.backend),'webgl');
  const results=await p.evaluate(()=>{
   const rectData=(w,h)=>{const nodes=[{id:'a',x:-5,y:-5},{id:'b',x:w+5,y:-5},{id:'c',x:w+5,y:h+5},{id:'d',x:-5,y:h+5}];return {nodes,segs:nodes.map((n,i)=>({n1:n.id,n2:nodes[(i+1)%4].id,k:10})),rooms:[{id:'room',tip:'salon',name:'Test',points:nodes}]}};
   const cases=[['exact',rectData(240,240),5.76,8,9.6],['cut',rectData(125,130),1.625,6,null],['small',rectData(20,30),.06,1,0],['L',{nodes:[],segs:[],rooms:[{id:'L',tip:'salon',name:'L oda',points:[[0,0],[240,0],[240,120],[120,120],[120,240],[0,240]].map(([x,y])=>({x,y}))}]},4.32,6,null]];
   const synthetic=cases.map(([name,data,expectedArea,expectedCount,expectedMiniH])=>{const r=DraftCeiling.layout(data);return {name,expectedArea,expectedCount,expectedMiniH,area:r.area,boards:r.boards.length,full:r.boards.filter(b=>b.full).length,miniH:r.miniH}});
   const main=[];
   for(const direction of ['x','y'])for(const height of [250,280,300]){
    const e=DraftFloorLayers.elevations(height).ceiling,r=DraftCeiling.mesh(EXAMPLE,direction,e.bottom+DraftCeiling.profile.skin,e.top-DraftCeiling.profile.skin),frames=DraftFrames.layout(EXAMPLE,direction),oldArea=frames.flatMap(f=>DraftFloorLayers.ceilingRects(f,EXAMPLE)).reduce((n,r)=>n+DraftCeiling.area(r)/10000,0);
    const inside=(x,y,roomId)=>r.boards.filter(b=>b.roomId===roomId).some(b=>b.pieces.some(q=>x>=q.x0-1e-5&&x<=q.x1+1e-5&&y>=q.y0-1e-5&&y<=q.y1+1e-5));
    const shared=r.joints.every(j=>{const mid=(j.lo+j.hi)/2;return j.axis==='x'?inside(j.value-.1,mid,j.roomId)&&inside(j.value+.1,mid,j.roomId):inside(mid,j.value-.1,j.roomId)&&inside(mid,j.value+.1,j.roomId)});
    const boardPoints=r.surfaces.filter(s=>s.kind==='ceilingBoard').flatMap(s=>s.poly),hPoints=r.surfaces.filter(s=>s.kind==='miniH').flatMap(s=>s.poly);
    const allFinite=r.surfaces.every(s=>s.poly.every(p=>Number.isFinite(p.x)&&Number.isFinite(p.y)&&Number.isFinite(p.z)));
    const tileSizes=r.boards.every(b=>Math.abs((b.nominal.x1-b.nominal.x0)*(b.nominal.y1-b.nominal.y0)-7200)<.001&&b.pieces.every(p=>p.x0>=b.nominal.x0&&p.x1<=b.nominal.x1&&p.y0>=b.nominal.y0&&p.y1<=b.nominal.y1));
    main.push({direction,height,area:r.area,oldArea,boards:r.boards.length,full:r.boards.filter(b=>b.full).length,miniH:r.miniH,shared,tileSizes,allFinite,boardMin:Math.min(...boardPoints.map(p=>p.z)),boardMax:Math.max(...boardPoints.map(p=>p.z)),hMin:Math.min(...hPoints.map(p=>p.z)),hMax:Math.max(...hPoints.map(p=>p.z)),profileParts:[...new Set(r.surfaces.filter(s=>s.kind==='miniH').map(s=>s.part))].sort(),green:r.boards.some(b=>b.green),porch:r.boards.some(b=>b.roomId==='e156')});
   }return {synthetic,main};
  });
  for(const r of results.synthetic){assert.ok(Math.abs(r.area-r.expectedArea)<1e-8);assert.equal(r.boards,r.expectedCount);if(r.expectedMiniH!==null)assert.ok(Math.abs(r.miniH-r.expectedMiniH)<1e-8)}assert.equal(results.synthetic[0].full,8);assert.equal(results.synthetic[1].full,2);
  for(const r of results.main){assert.ok(Math.abs(r.area-r.oldArea)<1e-7);assert.ok(r.shared&&r.tileSizes&&r.allFinite&&r.green&&!r.porch);assert.ok(Math.abs(r.boardMax-r.boardMin-1.25)<1e-7);assert.ok(Math.abs(r.hMax-r.height)<1e-7);assert.ok(Math.abs(r.hMin-(r.height-1.49))<1e-7);assert.deepEqual(r.profileParts,['bottomFlange','topFlange','web']);}
  const visibility=await p.evaluate(()=>JSON.stringify([project.floors.map(f=>f.visible),project.layerVisibility,explode]));
  await p.screenshot({path:path.join(root,'artifacts/ceiling-exploded.png')});await p.click('[data-assembly=ceiling]');assert.equal(await p.evaluate(()=>assemblyMode),'ceiling');assert.ok(await p.evaluate(()=>Camera3D.state.pitch<0));assert.ok((await p.locator('#ceilingUnder').getAttribute('class')).includes('active'));assert.ok(await p.evaluate(()=>buildDraftScene().surfaces.every(s=>s.layerId==='ceiling')));
  await p.screenshot({path:path.join(root,'artifacts/ceiling-under.png')});
  async function selectBoard(full){const t=await p.evaluate(full=>{const b=sceneCache.ceiling.boards.find(b=>b.full===full),r=b.pieces[0],q=lastProjection({x:(r.x0+r.x1)/2,y:(r.y0+r.y1)/2,z:sceneCache.elevations.ceiling.bottom}),box=modelCanvas.getBoundingClientRect();return {id:b.id,x:q.x+box.x,y:q.y+box.y}},full);await p.mouse.click(t.x,t.y);assert.equal(await p.evaluate(()=>selected?.id),t.id);return t.id}
  await selectBoard(true);assert.ok((await p.locator('#inspectorBody').innerText()).includes('TAM'));await p.screenshot({path:path.join(root,'artifacts/ceiling-selected.png')});await selectBoard(false);assert.ok((await p.locator('#inspectorBody').innerText()).includes('KENAR KESİMİ'));
  await p.click('#ceilingOver');assert.ok(await p.evaluate(()=>Camera3D.state.pitch>0));await p.click('#ceilingUnder');
  await p.selectOption('#ceilingDirection','x');assert.equal(await p.evaluate(()=>project.frameDirection),'x');assert.ok(await p.evaluate(()=>sceneCache.ceiling.dx===120&&sceneCache.ceiling.dy===60));await p.click('#undo');assert.equal(await p.evaluate(()=>project.frameDirection),'y');
  await p.click('#zoomIn');assert.ok(await p.evaluate(()=>zoom>1));await p.click('#fit');assert.equal(await p.evaluate(()=>zoom),1);
  for(const width of [980,1280,1920]){await p.setViewportSize({width,height:1000});assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));assert.ok(await p.locator('#ceilingBack').isVisible())}
  await p.setViewportSize({width:1600,height:1000});await p.click('#ceilingBack');assert.equal(await p.evaluate(()=>JSON.stringify([project.floors.map(f=>f.visible),project.layerVisibility,explode])),visibility);assert.equal(await p.evaluate(()=>assemblyMode),'layers');assert.ok(await p.evaluate(()=>Camera3D.state.pitch>0));
  await p.locator('[data-layer=ceiling]').uncheck();assert.ok(await p.evaluate(()=>!buildDraftScene().surfaces.some(s=>['ceilingBoard','miniH'].includes(s.kind))));await p.click('#undo');assert.ok(await p.evaluate(()=>buildDraftScene().surfaces.some(s=>s.kind==='miniH')));
  const fallback=await browser.newPage();await fallback.addInitScript(()=>{const get=HTMLCanvasElement.prototype.getContext;HTMLCanvasElement.prototype.getContext=function(type,...args){return type==='webgl'?null:get.call(this,type,...args)}});await fallback.goto(require('node:url').pathToFileURL(path.join(__dirname,'arakat.html')).href);await fallback.click('[data-assembly=ceiling]');assert.notEqual(await fallback.evaluate(()=>Scene3D.stats.backend),'webgl');assert.ok(await fallback.evaluate(()=>sceneCache.ceiling.boards.length>0));await fallback.close();
  assert.deepEqual(errors,[]);assert.deepEqual(requests,[]);assert.equal(await p.evaluate(()=>localStorage.length),0);for(const n of protectedNames)assert.equal(hash(n),before[n]);
  console.log('PASS standard 60x120 geometry, full/cut/L/small areas, actual shared mini-H joints, H section, ceiling area preserved independently of 125cm frames, heights/directions, selection/undo, underside/upper view, view restoration, responsive/fallback/isolation.');console.log(JSON.stringify({results,protectedFiles:before},null,2));
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
