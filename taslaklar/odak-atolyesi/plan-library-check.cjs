const assert=require('assert/strict'),fs=require('fs'),path=require('path'),{pathToFileURL}=require('url');
const C=require('./plan-library-core.js');
const {chromium}=require(path.resolve(path.dirname(process.execPath),'../node_modules/playwright'));
(async()=>{
 const items=Object.values(C.items); assert.ok(items.length>=60); assert.equal(Object.keys(C.categories).length,9);
 assert.ok(C.search('buzdolabı').some(i=>i.id==='fridge'));
 fs.mkdirSync('artifacts',{recursive:true});
 const b=await chromium.launch({headless:true,executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'});
 try{
  const p=await b.newPage({viewport:{width:1600,height:1050},acceptDownloads:true}),errors=[];
  p.on('pageerror',e=>errors.push(e.message));p.on('dialog',d=>d.accept());
  await p.goto(pathToFileURL(path.join(__dirname,'index.html')).href);
  await p.evaluate(()=>{
   const d=Studio.state(),n=[{id:'a',x:0,y:0},{id:'b',x:1000,y:0},{id:'c',x:1000,y:700},{id:'d',x:0,y:700}];
   const s=[['a','b'],['b','c'],['c','d'],['d','a']].map(([n1,n2],i)=>({id:'s'+i,n1,n2,k:14,dis:true,elemanlar:[]}));
   Studio.loadProject({...d,sistem:'celik',n,s,e:[],r:[],fixtures:[],counters:[]}); G.fixtures=[];G.counters=[];Studio.fit();draw();
   PlanLibraryUI.open();
  });
  await p.locator('#libSearch').fill('buzdolabı');assert.equal(await p.locator('.lib-card').count(),1);
  await p.locator('.lib-object').click();assert.ok(await p.locator('#libWidth').getAttribute('readonly')!==null);
  await p.locator('#libSearch').fill('');await p.locator('.lib-card[data-id="desk"] .lib-object').click();
  await p.locator('.lib-card[data-id="desk"] .lib-favorite').click();
  await p.locator('#libWidth').fill('152.5');await p.locator('#libDepth').fill('72.5');
  await p.locator('#libRotate').click();await p.locator('#libMirror').click();
  const placed=await p.evaluate(()=>PlanLibraryUI.start('desk',{x:450,y:350}));assert.equal(placed,true);
  const desk=await p.evaluate(()=>G.fixtures.find(f=>f.kind==='desk'));
  assert.equal(desk.w,152.5);assert.equal(desk.d,72.5);assert.equal(desk.angle,90);assert.equal(desk.mirror,true);
  await p.keyboard.press('Control+z');assert.equal(await p.evaluate(()=>G.fixtures.some(f=>f.kind==='desk')),false);
  await p.keyboard.press('Control+Shift+z');assert.equal(await p.evaluate(()=>G.fixtures.some(f=>f.kind==='desk')),true);
  await p.evaluate(()=>PlanLibraryUI.open());
  await p.locator('.lib-card[data-id="plant"] .lib-object').dragTo(p.locator('#cv'),{targetPosition:{x:320,y:310}});
  assert.equal(await p.evaluate(()=>G.fixtures.some(f=>f.kind==='plant')),true,'HTML drag to plan');
  await p.evaluate(()=>Studio.flush()); await p.reload();
  assert.equal(await p.evaluate(()=>G.fixtures.some(f=>f.kind==='desk'&&f.w===152.5)),true,'saved library dimensions');
  assert.equal(await p.evaluate(()=>JSON.parse(localStorage.getItem('prefabrikten.odak.tek-kat.library.v1')).favorites.includes('desk')),true);
  const all=await p.evaluate(()=>{
   const results=[];for(const i of Object.values(PlanLibraryCore.items)){if(i.command)continue;
    const c=document.createElement('canvas');c.width=c.height=260;const x=c.getContext('2d'),[w,d]=i.sizes[0];
    x.translate(130,130);x.scale(Math.min(220/w,220/d),Math.min(220/w,220/d));x.translate(-w/2,-d/2);
    const ok=PlanLibraryCore.draw(x,{kind:i.id,w,d},PlanLibraryCore.palette);
    results.push({id:i.id,ok,pixels:x.getImageData(0,0,260,260).data.some((v,k)=>k%4===3&&v>0)});
   }return results;
  });for(const r of all){assert.equal(r.ok,true,r.id);assert.equal(r.pixels,true,r.id);}
  await p.evaluate(()=>{
   G.fixtures=[];const add=(kind,x,y,angle=0)=>{const [w,d]=PlanLibraryCore.items[kind].sizes[0];G.fixtures.push({id:kind,kind,x,y,w,d,angle,mirror:false});};
   add('rug',180,220);add('bedDouble',180,200);add('nightstand',65,150);add('nightstand',295,150);add('wardrobe',160,470);
   add('bathtub',900,130);add('wallwc',800,65);add('vanity',670,65);add('shower',550,65);
   add('sofa3',620,460);add('coffeeRound',620,350);add('plant',920,570);add('dining4',850,350);
   add('curtain',950,500,90);add('desk',370,180);add('officeChair',370,260);
   G.rooms.forEach(r=>r.floorFinish={kind:'parquet',width:20,length:120,angle:0,strength:50});
   Studio.fit();draw();ViewFilters.preset('customer');PlanLibraryUI.open();
  });
  await p.screenshot({path:'artifacts/library-gallery.png'});
  await p.evaluate(()=>{PlanLibraryUI.close();PlanExport.open('png');});
  await p.selectOption('#exportPlanStyle','warmsketch');await p.waitForFunction(()=>!document.getElementById('exportSubmit').disabled);
  const result=await p.evaluate(()=>{const v=SheetOutput.read(),l=PlanExport.recommend(v.paper,v.orientation,v.scale,v.antet,G.sheetInfo,v);return PlanExport.pageCanvas(l,130).toDataURL();});
  fs.writeFileSync('artifacts/library-warm-plan.png',Buffer.from(result.split(',')[1],'base64'));
  const dl=p.waitForEvent('download');await p.click('#exportSubmit');await(await dl).saveAs('artifacts/library-warm-download.png');
  assert.deepEqual(errors,[]);
  console.log(`PASS ${items.length} library entries; ${all.length} symbols render; search, favorites, dimensions, rotate/mirror, drag placement, undo/redo, persistence and warm PNG; no browser errors`);
 }finally{await b.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
