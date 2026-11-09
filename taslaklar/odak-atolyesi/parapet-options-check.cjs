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
 await openEaves();await p.selectOption('#edgeInputMode','each');await p.fill('[name=overhang_4]','40');await p.click('#roofApply');
 assert.deepEqual(await p.evaluate(()=>G.roofs[0].edgeEaves),[0,0,0,0,40,0]);
 assert.equal(await p.evaluate(()=>ParapetOptions.band(G.roofs[0],G.roofs,RoofCore).filter(v=>v.kind==='soffit').length),1);
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
 assert.deepEqual(errors,[]);console.log('PASS both systems: zero/common/mixed L-outline eaves, 3 assemblies and takeoff, veranda shared fascia, two posts, zero on one porch edge, 3D and project round trip.');
 }finally{await b.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
