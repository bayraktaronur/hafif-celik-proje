const assert=require('node:assert/strict'),path=require('node:path'),{pathToFileURL}=require('node:url');
const {chromium}=require(path.resolve(path.dirname(process.execPath),'../node_modules/playwright'));
(async()=>{
 const b=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'});
 try{
 const p=await b.newPage({viewport:{width:1600,height:1050}});p.setDefaultTimeout(5000);
 const errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.goto(pathToFileURL(path.join(__dirname,'index.html')).href);
 for(const system of ['prefabrik','celik']){
 await p.evaluate(system=>{
   const outline=[{x:0,y:0},{x:600,y:0},{x:600,y:400},{x:300,y:400},{x:300,y:200},{x:0,y:200}];
   const z=RoofCore.defaults({id:'testroof',type:'tek',w:600,d:400,outline,parapet:40,edgeEaves:outline.map(()=>20)});
   Studio.loadProject({...Studio.state(),sistem:system,roofs:[z],roofAssemblies:[]});SingleStorey.show('roof');RoofStudio.select(z.id);
 },system);
 const openEaves=()=>p.getByText('Saçaklar ve birleşim',{exact:true}).click();
 await p.click('#roof-task-model');await openEaves();await p.selectOption('#edgeInputMode','all');await p.fill('[name=sharedOverhang]','0');await p.click('#roofApply');
 assert.deepEqual(await p.evaluate(()=>G.roofs[0].edgeEaves),Array(6).fill(0));
 assert.ok(await p.evaluate(()=>{const z=G.roofs[0];return RoofCore.footprint(z).every((p,i)=>Math.hypot(p.x-z.outline[i].x,p.y-z.outline[i].y)<.001);}));
 assert.equal(await p.evaluate(()=>RoofStudio.billRows().filter(r=>r.kalem.startsWith('Saçak altı ·')).length),0);
 await openEaves();await p.selectOption('#edgeInputMode','each');await p.fill('[name=overhang_4]','40');await p.click('#roofApply');
 assert.deepEqual(await p.evaluate(()=>G.roofs[0].edgeEaves),[0,0,0,0,40,0]);
 assert.equal(await p.evaluate(()=>ParapetOptions.band(G.roofs[0],G.roofs,RoofCore).filter(v=>v.kind==='soffit').length),1);
 for(const type of ['wood','custom','plaster']){
  await openEaves();await p.selectOption('[name=soffitType]',type);
  if(type==='custom'){
   await p.fill('[name=soffitName]','Metal lamel');await p.fill('[name=soffitColor]','#735034');
  }
  await p.click('#roofApply');
  const result=await p.evaluate(()=>{
   const copy=JSON.parse(JSON.stringify(Studio.state()));Studio.loadProject(copy);RoofStudio.select(G.roofs[0].id);
   const row=RoofStudio.billRows().find(r=>r.kalem.startsWith('Saçak altı ·'));
   const items=ParapetOptions.band(G.roofs[0],G.roofs,RoofCore).filter(i=>i.kind==='soffit');
   RoofStudio.setView('report');
   const hasReport=document.getElementById('roofReport').textContent.includes(row.kalem);
   RoofStudio.setView('plan');
   return {area:row.miktar,cellArea:items.reduce((sum,i)=>sum+RoofCore.area(i.poly)/10000,0),material:items[0].soffitMaterial,count:items.length,color:items[0].color,hasReport,
    hasCsv:RoofStudio.csv().includes(row.kalem),hasBill:metrajKalemleri().some(r=>r.kalem===row.kalem)};
  });
  assert.ok(Math.abs(result.area-1.2)<1e-8&&Math.abs(result.cellArea-result.area)<1e-8);
  assert.equal(result.material,type);assert.equal(result.count,type==='wood'?4:1);
  if(type==='custom')assert.equal(result.color,'#735034');
  assert.ok(result.hasReport&&result.hasBill&&result.hasCsv,JSON.stringify(result));
 }
 const courses=await p.evaluate(()=>{
  const coords=[[0,0],[600,0],[600,400],[0,400]];
  const z=RoofCore.defaults({id:'flush',name:'Sıfır saçak',x:-5,y:-5,w:610,d:410,type:'tek',eaves:[0,0,0,0],parapet:30,h:250,wallTop:250});
  const copy=Studio.state();
  Studio.loadProject({...copy,n:coords.map(([x,y],i)=>({id:'n'+i,x,y})),s:coords.map((_,i)=>({id:'s'+i,n1:'n'+i,n2:'n'+((i+1)%4),k:10})),r:[],e:[],opt:{...copy.opt,h:250},roofs:[z]});
  const results=[];
  for(const facade of ['yok','tasonit','yalipan']){
   G.opt.cephe=facade;
   const band=ParapetOptions.band(z,G.roofs,RoofCore),flush=band.find(i=>i.flush&&i.firstFacadeCourse!==false);
   const walls=Wall3D.build().surfaces;
   const hidden=ParapetOptions.flushJoinFilter(band);
   const p=flush.poly[0],q=flush.poly[1];
   // Sample the finished front elevation above, below and directly on the wall top.
   // A separately outlined fascia shows up here even if the areas are correct.
   SingleStorey.show('model');
   G.scenePresentation={...Presentation3D.defaults,mode:'presentation',outlines:65,textures:false,shadows:false};
   RoofStudio.setCamera({...RoofStudio.getCamera(),yaw:0,pitch:0,projection:'parallel'});
   const image=document.createElement('canvas');image.width=800;image.height=500;
   const draw=Scene3D.render;let sample;
   try{
    Scene3D.render=function(ctx,w,h,items,edges,project,options){
     if(options?.exactPixels)sample=project({x:168,y:405,z:250+(G.foundation?.height||0)});
     return draw.apply(this,arguments);
    };
    RoofStudio.renderImage(image,{frame:'fit',background:'light',grid:false});
   }finally{Scene3D.render=draw;}
   const ctx=image.getContext('2d'),luma=dy=>{
    const pixels=ctx.getImageData(Math.round(sample.x)-2,Math.round(sample.y)+dy,5,1).data;
    return (pixels[4]+pixels[8]+pixels[12])/3;
   };
   const samples=[-2,0,2].map(luma);
   results.push({soffit:band.some(i=>i.kind==='soffit'),seam:hidden(p,q),
    continuous:facade==='yok'||walls.some(i=>i.facade===facade&&i.courseIndex===flush.courseIndex&&i.poly.some(pt=>pt.z===250)),
    rendered:Math.max(...samples)-Math.min(...samples)<8&&Math.min(...samples)>70,samples,
    row:ParapetOptions.schedule(G.roofs,RoofCore).some(r=>r.olcu.includes('0 cm, cephe devamı'))});
  }
  Studio.loadProject(copy);SingleStorey.show('roof');RoofStudio.select(G.roofs[0].id);return results;
 });
 for(const {samples,...r} of courses)assert.deepEqual(r,{soffit:false,seam:true,continuous:true,row:true,rendered:true},JSON.stringify({system,samples}));
 await p.click('#roof-task-material');
 for(const [i,material,layers] of [[0,'shingle',['membran','osb']],[1,'sandvic',[]],[2,'trapez',['nem']]]){
  await p.selectOption('#roofAssembly',String(i));
  if(i===2){await p.selectOption('#rz_width','80');await p.click('#roofAssemblySave');await p.fill('[name=assemblyName]','80 kapatır');}
  await p.click('#roofApply');
  const state=await p.evaluate(()=>{const z=G.roofs[0];const m=RoofCore.calculate([z],G.roofMaterials);return [z.material,z.layers.map(l=>l.id),m.totals.length,m.layerTotals.length];});
  assert.deepEqual(state,[material,layers,1,layers.length]);
  assert.deepEqual(await p.evaluate(()=>{const z=G.roofs[0];return RoofCore.roofLayerView(RoofCore.zoneFaces(z)[0],z,true).order;}),[...layers].reverse());
 }
 await p.evaluate(()=>{const copy=JSON.parse(JSON.stringify(Studio.state()));Studio.loadProject(copy);RoofStudio.select(G.roofs[0].id);});
 assert.equal(await p.evaluate(()=>G.roofAssemblies[0].width),80);
 await p.selectOption('#roofAssembly',{label:'80 kapatır'});assert.equal(await p.inputValue('#rz_width'),'80');
 }
 await p.evaluate(()=>{
  const coords=[[0,0],[1024,0],[1024,1140],[0,1140],[344,1140],[1024,1580],[344,1580]];
  const edges=[[0,1],[1,2],[2,4],[4,3],[3,0],[2,5],[5,6],[6,4]];
  Studio.loadProject({v:'5',sistem:'celik',n:coords.map(([x,y],i)=>({id:'n'+i,x,y})),s:edges.map(([a,b],i)=>({id:'s'+i,n1:'n'+a,n2:'n'+b,k:10,...(i>=5?{tip:'veranda'}:{})})),e:[],r:[]});
  G.rooms.find(r=>r.area<40).tip='veranda';SingleStorey.show('roof');
  RoofStudio.add(RoofStudio.make({x:0,y:0,w:1024,d:1140,type:'besik',h:250,wallTop:250}));
 });
 await p.click('#roof-task-model');await p.getByText('Saçaklar ve birleşim',{exact:true}).click();
 await p.fill('#rz_parapet','25');assert.equal(await p.inputValue('[name=sharedOverhang]'),'40');
 await p.click('#roofApply');
 assert.deepEqual(await p.evaluate(()=>G.roofs[0].eaves),[40,40,40,40]);
 const creation=p.locator('.roof-create-group');
 if(!await creation.evaluate(d=>d.open))await creation.locator(':scope > summary').click();
 const porchPanel=p.locator('details').filter({has:p.locator('#roofVerandaType')}).last();
 if(!await porchPanel.evaluate(d=>d.open))await porchPanel.locator(':scope > summary').click();
 await p.selectOption('#roofVerandaType','tek-parapet');await p.selectOption('#roofVerandaBeam','yes');await p.click('#roofFromVeranda');
 assert.equal(await p.evaluate(()=>G.roofs.length),2,await p.locator('#roofNotice').innerText());
 await p.getByText('Saçaklar ve birleşim',{exact:true}).click();await p.selectOption('#edgeInputMode','each');
 await p.fill('[name=overhang_0]','0');await p.click('#roofApply');
 const porch=await p.evaluate(()=>{
  const [host,child]=G.roofs;
  const sides=z=>ParapetOptions.band(z,G.roofs,RoofCore).filter(s=>s.kind==='cladding');
  const top=z=>Math.max(...sides(z).flatMap(s=>s.poly.map(p=>p.z)));
  const saved=JSON.parse(JSON.stringify(Studio.state()));Studio.loadProject(saved);
  SingleStorey.show('model');
  return {equal:Math.abs(top(host)-top(child))<.001,childSides:sides(child).length,posts:RoofStudio.verandaMembers(child).filter(p=>p.kind==='post').length,eaves:G.roofs[1].attachment.base.eaves,follow:G.roofs[1].attachment.followParapet};
 });
 assert.deepEqual(porch,{equal:true,childSides:3,posts:2,eaves:[0,40,40,0],follow:true});
 assert.deepEqual(errors,[]);console.log('PASS both systems: zero/common/mixed eaves, wood/plaster/custom in 3D, report, bill and CSV, flush facade PNG and courses, veranda, roof assemblies and project round trip.');
 }finally{await b.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
