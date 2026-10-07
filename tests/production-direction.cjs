const assert=require('node:assert/strict'),path=require('node:path'),fs=require('node:fs'),{pathToFileURL}=require('node:url');
let pw;try{pw=require('playwright')}catch{pw=require(path.resolve(path.dirname(process.execPath),'../node_modules/playwright'))}
(async()=>{const browser=await pw.chromium.launch({headless:true,executablePath:process.env.BROWSER_PATH||'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'});try{
 const page=await browser.newPage({viewport:{width:1536,height:960}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(pathToFileURL(path.resolve(process.env.PLAN_FILE||'plan_cizim.html')).href);
 // The fourth leg of the user's open stepped outline was rejected as 115.5 cm.
 // It must inherit the same physical H grid as the first perpendicular wall.
 for(const k of [6,10,15])for(const rotated of [false,true])for(const sign of [-1,1]){
  const result=await page.evaluate(({k,rotated,sign})=>{
   Studio.loadProject({v:'5',sistem:'prefabrik',catiYon:rotated?'dikey':'yatay',opt:{dis:k,ic:k},settings:{panelDrawMode:'mixed',defaultK:k},n:[],s:[],e:[],r:[]});
   G.tool='duvar';G.inputUnit='panel';G.drawStart=addNode(100,200);G.drawing=true;
   const steps=[];
   for(let [dx,dy,count] of [[1,0,2.5],[0,1,2],[-1,0,1],[0,1,1]]){
    dx*=sign;if(rotated)[dx,dy]=[dy,dx];const n=getNode(G.drawStart);
    G.drawPreviewPt={x:n.x+dx*1000,y:n.y+dy*1000};G.snapPt=G.drawPreviewPt;
    const L=numUzunluk(n,{x:dx,y:dy},count).L,preview=pfCizimOnizleme(n,{x:n.x+dx*L,y:n.y+dy*L});
    G.numBuf=String(count);numUygula();steps.push({count:G.segs.length,preview:preview?.slots.map(p=>p.w)});
   }
   const A=pfAnaliz(),r=A.runs.find(r=>r.items.some(it=>it.seg.id===G.segs.at(-1).id));
   return{steps,issues:Modular.inspect(),last:r.slots.map(p=>p.w),toast:document.getElementById('toast').textContent};
  },{k,rotated,sign});
  assert.deepEqual(result.steps.map(s=>s.count),[1,2,3,4],JSON.stringify({k,rotated,sign,result}));
  assert.deepEqual(result.issues,[],JSON.stringify({k,rotated,sign,result}));
  assert.deepEqual(result.steps.at(-1).preview,result.last);
 }
 const frame=(k=10)=>({v:'5',sistem:'prefabrik',catiYon:'yatay',opt:{dis:k,ic:k},settings:{panelDrawMode:'mixed'},n:[{id:'a',x:0,y:0},{id:'b',x:502,y:0},{id:'c',x:502,y:502+k},{id:'d',x:0,y:502+k}],s:[['a','b'],['b','c'],['c','d'],['d','a']].map(([n1,n2],i)=>({id:'s'+i,n1,n2,k,kSabit:true})),e:[],r:[]});
 const fixed=()=>page.evaluate(()=>JSON.stringify({n:G.nodes.map(({id,x,y})=>({id,x,y})),s:G.segs.map(({id,n1,n2,k})=>({id,n1,n2,k})),e:G.elemanlar}));
 const panels=()=>page.evaluate(()=>pfAnaliz().runs.map(r=>({id:r.owner.id,s0:r.s0,s1:r.s1,slots:r.slots.map(p=>[p.a,p.b])})));
 for(const k of [6,10,15]){
  await page.evaluate(d=>Studio.loadProject(d),frame(k));
  const before=await page.evaluate(()=>Studio.snapshot()),geometry=await fixed(),original=await panels();
  await page.click('#catiBtn');assert.equal(await page.evaluate(()=>G.catiYon),'dikey');
  assert.deepEqual(await page.evaluate(()=>G.nodes.map(({x,y})=>[x,y])),[[0,0],[502+k,0],[502+k,502],[0,502]]);
  assert.notDeepEqual(await panels(),original);assert.deepEqual(await page.evaluate(()=>G.nodes.filter(n=>n.koseTers)),[]);
  const after=await panels();
  const corner=await page.evaluate(()=>({rect:pfKoseRect('a',getSeg('s0').k),cad:CadSymbols.joint(pfAnaliz().bag.find(b=>b.tip==='kose'&&b.nid==='a'))[0].points}));
  assert.deepEqual(corner.rect,{x:-k/2,y:-k/2,w:k,h:k/2});
  assert.deepEqual(corner.cad,[{x:-k/2,y:-k/2},{x:k/2,y:-k/2},{x:k/2,y:0},{x:-k/2,y:0}]);
  assert.deepEqual(after.map(r=>r.slots.map(([a,b])=>b-a)),original.map(r=>r.slots.map(([a,b])=>b-a)));
  assert.equal(after.find(r=>r.id==='s0').s0,k/2);assert.equal(after.find(r=>r.id==='s1').s0,0);
  assert.deepEqual(await page.evaluate(()=>Prefab.issues().filter(i=>i.code==='truss-support')),[]);
  await page.evaluate(()=>geriAl());assert.equal(await page.evaluate(()=>Studio.snapshot()),before);
  await page.evaluate(()=>ileriAl());assert.deepEqual(await panels(),after);
  const saved=await page.evaluate(()=>Studio.state());await page.evaluate(d=>Studio.loadProject(d),saved);assert.deepEqual(await panels(),after);
  await page.click('#catiBtn');assert.deepEqual(await panels(),original);assert.equal(await fixed(),geometry);
 }
 // Opening at the former H grid must remain a single manufactured panel,
 // moving with the panel grid without quietly changing its dimensions.
 const withOpening=frame();withOpening.e=[{id:'window',segId:'s0',tip_:'pencere',en:120,yuk:120,t:128.25/502}];
 await page.evaluate(d=>Studio.loadProject(d),withOpening);
 assert.equal(await page.evaluate(()=>RoofWorkflow.direction('dikey')),true,await page.locator('#roofNotice').innerText());
 assert.equal(await page.evaluate(()=>G.elemanlar[0].en),120);
 assert.ok(Math.abs(await page.evaluate(()=>G.elemanlar[0].t*_segLen(getSeg('s0')))-133.25)<1e-6);
 assert.deepEqual(await page.evaluate(()=>Prefab.issues().filter(i=>i.code==='opening-joint')),[]);
 // The manufacturing controls still reject unrelated off-grid lengths.
 await page.evaluate(d=>Studio.loadProject(d),frame());
 assert.equal(await page.evaluate(()=>Studio.edit(()=>{getNode('b').x+=13;getNode('c').x+=13;})),false);
 // Real customer backups exercise explicit layouts, mixed thicknesses, rooms,
 // openings and existing roofs. Every change remains one reversible transaction.
 for(const file of ['cizimler/2026-10-03-is-kayit-6-5.9.36.json','cizimler/2026-10-02-tuna84-dwg-esleme-taslak.json']){
  await page.evaluate(d=>Studio.loadProject(d),JSON.parse(fs.readFileSync(file,'utf8')));const geometry=await fixed(),snapshot=await page.evaluate(()=>Studio.snapshot());
  const previous=await panels(),originalWarnings=await page.evaluate(()=>Prefab.issues().map(i=>({id:i.id,code:i.code})));
  const beforeIssues=await page.evaluate(()=>Prefab.issues().filter(i=>i.code==='opening-joint').map(i=>i.id));
  const result=await page.evaluate(()=>({ok:RoofWorkflow.direction(G.catiYon==='yatay'?'dikey':'yatay'),toast:document.getElementById('toast').textContent}));
  assert.equal(result.ok,true,JSON.stringify({file,result}));
  assert.deepEqual(await page.evaluate(()=>Prefab.issues().filter(i=>i.code==='opening-joint').map(i=>i.id)),beforeIssues);
  const next=await panels();assert.equal(next.reduce((n,r)=>n+r.slots.length,0),previous.reduce((n,r)=>n+r.slots.length,0));
  for(const old of previous){const now=next.find(r=>r.id===old.id);assert.equal(now.slots.length,old.slots.length);old.slots.slice(1,-1).forEach(([a,b],i)=>assert.ok(Math.abs((now.slots[i+1][1]-now.slots[i+1][0])-(b-a))<1e-6,JSON.stringify({file,run:old.id,index:i+1})));}
  fs.mkdirSync('artifacts',{recursive:true});fs.writeFileSync('artifacts/'+path.basename(file,'.json')+'-direction.json',JSON.stringify({file,panelsBefore:previous,panelsAfter:next,originalWarnings,issues:await page.evaluate(()=>Prefab.issues().map(i=>({id:i.id,code:i.code,message:i.message})))},null,2));
  await page.evaluate(()=>geriAl());assert.equal(await fixed(),geometry);assert.equal(await page.evaluate(()=>Studio.snapshot()),snapshot);
 }
 // A roof with half a terminal bay used to shift its phase on the second turn
 // (local X reversed at 180°). All four turns must share world H coordinates.
 const half=frame();half.n[1].x=half.n[2].x=564.75;
 await page.evaluate(d=>{Studio.loadProject(d);RoofStudio.add(RoofStudio.make({x:-5,y:-5,w:574.75,d:522}));},half);
 const halfCounts=await page.evaluate(()=>pfAnaliz().runs.map(r=>r.slots.length));
 for(let i=0;i<4;i++){
  assert.equal(await page.evaluate(()=>RoofWorkflow.direction(G.catiYon==='yatay'?'dikey':'yatay')),true);
  assert.deepEqual(await page.evaluate(()=>pfAnaliz().runs.map(r=>r.slots.length)),halfCounts);
  assert.deepEqual(await page.evaluate(()=>Prefab.issues().filter(i=>i.code==='truss-support')),[]);
  const ms=await page.evaluate(()=>makasAnaliz().makaslar.map(m=>m.pos));assert.deepEqual(ms,ms.slice().sort((a,b)=>a-b));
 }
 // Referenced main and attached U boundaries follow the changed corner pay.
 await page.evaluate(d=>{
  Studio.loadProject(d);const ps=RoofWorkflow.exteriorCorners();
  const z=RoofWorkflow.makeOutline([ps.find(p=>p.ref.nodeId==='a'),ps.find(p=>p.ref.nodeId==='b'),ps.find(p=>p.ref.nodeId==='c'),ps.find(p=>p.ref.nodeId==='d')],{eave:30,h:280,pitch:33,type:'besik'});
  RoofStudio.add(z);RoofStudio.add(RoofWorkflow.makeOutline([{x:125,y:547},{x:125,y:750},{x:376,y:750},{x:376,y:547}],{parentId:z.id,openU:true,eave:30,h:280,pitch:33,type:'besik'}));
 },frame());
 assert.equal(await page.evaluate(()=>RoofWorkflow.direction('dikey')),true,await page.locator('#roofNotice').innerText());
 const bound=await page.evaluate(()=>{const z=G.roofs[0];return z.outline.map((p,i)=>{const ref=z.boundaryRefs[i],n=getNode(ref.nodeId);return{actual:RoofCore.transform(z,p),expected:{x:n.x+ref.dx,y:n.y+ref.dy}};});});
 for(const p of bound)assert.ok(Math.hypot(p.actual.x-p.expected.x,p.actual.y-p.expected.y)<1e-6);
 assert.ok(await page.evaluate(()=>RoofCore.calculate(G.roofs,G.roofMaterials).faces.length>0));
 assert.equal(await page.evaluate(()=>G.roofs[1].childJoin.support[0].y),537);
 // No-op and manual-override rejection must not create partial edits.
 const stable=await page.evaluate(()=>Studio.snapshot());assert.equal(await page.evaluate(()=>RoofWorkflow.direction(G.catiYon)),true);assert.equal(await page.evaluate(()=>Studio.snapshot()),stable);
 await page.evaluate(()=>{const m=makasAnaliz().makaslar[1];G.trussOverrides=[{nodeId:m.nodeId,zoneId:m.zoneId,axis:m.axis,from:m.pos,to:m.pos+10}];});
 const manual=await page.evaluate(()=>Studio.snapshot());assert.equal(await page.evaluate(()=>RoofWorkflow.direction('yatay')),false);assert.equal(await page.evaluate(()=>Studio.snapshot()),manual);
 // A turn during drawing must discard the old cursor preview and still close.
 const midway=await page.evaluate(()=>{
  Studio.loadProject({v:'5',sistem:'prefabrik',catiYon:'yatay',n:[],s:[],e:[],r:[],settings:{panelDrawMode:'mixed'}});
  G.tool='duvar';G.inputUnit='panel';G.drawing=true;G.drawStart=addNode(0,0);
  const add=(x,y,count)=>{const n=getNode(G.drawStart);G.drawPreviewPt={x:n.x+x*1000,y:n.y+y*1000};G.snapPt=G.drawPreviewPt;G.numBuf=String(count);numUygula();};
  add(1,0,2.5);add(0,1,2);const ok=RoofWorkflow.direction('dikey'),clear=G.snapPt===null&&G.drawPreviewPt===null;
  add(-1,0,2.5);add(0,-1,2);return {ok,clear,segs:G.segs.length,rooms:G.rooms.length,issues:Modular.inspect(),toast:document.getElementById('toast').textContent};
 });
 assert.ok(midway.ok&&midway.clear,JSON.stringify(midway));assert.equal(midway.segs,4,JSON.stringify(midway));assert.equal(midway.rooms,1);assert.deepEqual(midway.issues,[]);
 // Components of different wall thicknesses each exchange their own corner pay.
 const separate=frame(6),other=frame(15);other.n.forEach(n=>{n.id+='2';n.x+=1500;});other.s.forEach(s=>{s.id+='2';s.n1+='2';s.n2+='2';});separate.n.push(...other.n);separate.s.push(...other.s);
 await page.evaluate(d=>Studio.loadProject(d),separate);assert.equal(await page.evaluate(()=>RoofWorkflow.direction('dikey')),true);
 assert.deepEqual(await page.evaluate(()=>[getNode('b').x,getNode('c').y,getNode('b2').x,getNode('c2').y]),[508,502,2017,502]);
 // Visual QA captures both directions on an independent test page.
 await page.evaluate(d=>{Studio.loadProject(d);Studio.fit();Studio.toast('X yönü: yatay uçlarda 5 + 5 cm; düşey uçlarda 10 + 10 cm köşe payı.');},withOpening);await page.screenshot({path:'artifacts/production-direction-x.png'});
 await page.click('#catiBtn');await page.screenshot({path:'artifacts/production-direction-y.png'});
 assert.deepEqual(errors,[]);console.log('PASS stepped corner grid, exchanged corner allowances, unchanged rectangular panel dimensions/counts, H alignment, openings, undo/redo/JSON and two customer backups');
}finally{await browser.close()}})().catch(e=>{console.error(e);process.exitCode=1});
