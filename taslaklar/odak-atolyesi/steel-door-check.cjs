const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),crypto=require('node:crypto'),{pathToFileURL}=require('node:url');
const root=path.resolve(__dirname,'../..'),context={window:{},atob:s=>Buffer.from(s,'base64').toString('binary')};
vm.runInNewContext(fs.readFileSync(path.join(__dirname,'steel-door-models.js'),'utf8'),context);
const models=context.window.SteelDoorSTLModels,original=fs.readFileSync(path.join(root,models[0].source));
assert.equal(crypto.createHash('sha256').update(original).digest('hex'),models[0].sha256);
for(let h=0;h<models.length;h++){
 const m=models[h];assert.equal(m.triangleCount,9445);assert.equal(m.height,[250,280,300][h]);
 for(let t=0;t<9445;t++)for(let j=0;j<9;j++){const raw=original.readFloatLE(84+(h*9445+t)*50+12+j*4)-(j%3===0?h*250:0);assert.ok(Math.abs(m.vertices[t*9+j]-raw)<1e-10,'source coordinates are exact');}
 const panel=m.parts.find(p=>p.material==='panel'),frame=m.parts.find(p=>p.material==='steelFrame');assert.equal(panel.max[2],m.height);assert.equal(frame.max[2],205);assert.ok(Math.abs(frame.max[0]-frame.min[0]-91.29)<.001);
}
console.log('PASS source SHA, all 28335 original triangles/coordinates, 250/280/300 panels and unchanged 205 cm door frames');
const {chromium}=require(path.resolve(path.dirname(process.execPath),'../node_modules/playwright'));
const manifest=JSON.parse(fs.readFileSync(path.join(__dirname,'single-engine-manifest.json'))),protectedNames=[...Object.keys(manifest.sources),'dist/plan_studio.html'],hash=p=>crypto.createHash('sha256').update(fs.readFileSync(path.join(root,p))).digest('hex'),before=Object.fromEntries(protectedNames.map(p=>[p,hash(p)]));
(async()=>{const b=await chromium.launch({headless:true,executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'});try{
 const p=await b.newPage({viewport:{width:1600,height:1000}}),errors=[],requests=[];p.on('pageerror',e=>errors.push(e.message));p.on('request',r=>{if(/^https?:/.test(r.url()))requests.push(r.url());});p.on('dialog',d=>d.accept());
 await p.goto(pathToFileURL(path.join(__dirname,'index.html')).href);
 const empty=await p.evaluate(()=>{yeniPlan();return Studio.state();});
 const fixture={...empty,n:[{id:'a',x:0,y:0},{id:'b',x:512,y:0},{id:'c',x:512,y:386.5},{id:'d',x:0,y:386.5}],s:[['a','b'],['b','c'],['c','d'],['d','a']].map(([n1,n2],i)=>({id:'wall'+i,n1,n2,k:10,dis:true,kSabit:true})),e:[],r:[],sistem:'prefabrik',opt:{...empty.opt,h:250,dis:10,ic:6},ky:250,projectName:'Çelik kapı kontrolü'};
 await p.evaluate(d=>{Studio.loadProject(d);Studio.fit();},fixture);
 // Use the real door command and catalogue; choose the wall by a physical canvas click.
 await p.click('#t-kapi');const pt=await p.evaluate(()=>{const q=toCv(256,386.5),r=cv.getBoundingClientRect();return{x:q.x+r.left,y:q.y+r.top};});await p.mouse.click(pt.x,pt.y);
 const choice=await p.locator('#windowPreset option').evaluateAll(els=>els.find(e=>e.textContent.includes('Sol çelik kapı')).value);await p.selectOption('#windowPreset',choice);await p.click('#mbg .mok');await p.keyboard.press('Escape');
 const placed=await p.evaluate(()=>G.elemanlar[0]);assert.equal(placed.catalogId,'steel-sol');assert.equal(placed.yuk,205);
 const first=await p.evaluate(()=>Wall3D.build().parts.find(s=>s.kind==='steelDoorSTL'));assert.ok(first,JSON.stringify(first));
 console.log('PASS real canvas placement via Kapı > Sol çelik kapı, source model automatically used');
 const originalProject=await p.evaluate(()=>Studio.state());
 // Rotation/reversed wall segmentation/hinge: test actual global coordinates and handle direction.
 for(const deg of [0,90,180,270])for(const reverse of [false,true])for(const hinge of ['a','b']){
  const result=await p.evaluate(({data,deg,reverse,hinge})=>{const d=structuredClone(data),a=deg*Math.PI/180;d.n=d.n.map(p=>({...p,x:p.x*Math.cos(a)-p.y*Math.sin(a),y:p.x*Math.sin(a)+p.y*Math.cos(a)}));const e=d.e[0],s=d.s.find(s=>s.id===e.segId);if(reverse){[s.n1,s.n2]=[s.n2,s.n1];const n=d.n.find(n=>n.id===s.n1),m=d.n.find(n=>n.id===s.n2),L=Math.hypot(n.x-m.x,n.y-m.y);e.t=1-e.t-e.en/L;e.yan=-e.yan;}e.mentese=hinge;Studio.loadProject(d);
   const model=Wall3D.build(),part=model.parts.find(p=>p.kind==='steelDoorSTL'),sur=model.surfaces.filter(p=>p.kind==='steelDoorSTL'),seg=getSeg(e.segId),n=getNode(seg.n1),m=getNode(seg.n2),L=Math.hypot(m.x-n.x,m.y-n.y),u={x:(m.x-n.x)/L,y:(m.y-n.y)/L};
   const handle=sur.filter(s=>s.material==='hardware'&&s.poly.every(p=>p.z>86&&p.z<106)).flatMap(s=>s.poly),mean=handle.reduce((s,p)=>s+((p.x-n.x)*u.x+(p.y-n.y)*u.y)/handle.length,0),center=e.t*L+e.en/2;
   return{has:!!part,hingeMatch:hinge==='a'?mean>center:mean<center,front:part?.frontSide===-part?.insideSide,closed:sur.length>9000,finite:sur.every(s=>s.poly.every(p=>Object.values(p).every(Number.isFinite)))};
  },{data:originalProject,deg,reverse,hinge});assert.ok(Object.values(result).every(Boolean),JSON.stringify({deg,reverse,hinge,result}));
 }
 console.log('PASS four wall rotations, reversed segments, both plan hinges, outside-facing handle, finite source surfaces');
 await p.evaluate(d=>Studio.loadProject(d),originalProject);
 for(const height of [250,280,300]){
  await p.selectOption('[data-spec=h]',String(height));
  const result=await p.evaluate(()=>{const saved=JSON.stringify(Studio.state()),bill=JSON.stringify(metrajKalemleri()),m=Wall3D.build(),part=m.parts.find(p=>p.kind==='steelDoorSTL'),sur=m.surfaces.filter(s=>s.kind==='steelDoorSTL'),max=mat=>Math.max(...sur.filter(s=>s.material===mat).flatMap(s=>s.poly.map(p=>p.z)));return{height:part.heightMm,source:part.sourceHeightMm,extension:part.extensionMm,frame:max('steelFrame'),panel:max('panel'),duplicate:m.parts.some(p=>p.openingId===part.openingId&&p.schematic),unchanged:saved===JSON.stringify(Studio.state())&&bill===JSON.stringify(metrajKalemleri()),joints:m.parts.filter(p=>p.kind==='wallJoint').length};});
  assert.equal(result.height,height*10);assert.equal(result.source,height*10);assert.equal(result.extension,0);assert.equal(result.frame,205);assert.equal(result.panel,height);assert.equal(result.duplicate,false);assert.ok(result.unchanged&&result.joints>0);
  await p.click('#single-model');await p.selectOption('#roofViewpoint','front');await p.locator('#roofCanvas').screenshot({path:path.join(root,`artifacts/steel-door-${height}-front.png`)});await p.click('#single-plan');
 }
 console.log('PASS actual height selector, no stretched door, no duplicate opening, unchanged bill/plan and retained H/corner joints');
 const paint=await p.evaluate(()=>{G.paint3D={interior:{hex:'#ffffff'},exterior:{hex:'#bbccdd'}};const m=Wall3D.build(),sur=m.surfaces.filter(s=>s.kind==='steelDoorSTL'),painted=Paint3D.decorate(sur);return{panel:painted.filter(s=>s.material==='panel').some(s=>s.color==='#bbccdd'),door:painted.filter(s=>s.material!=='panel').every(s=>!s.painted),before:m.surfaces.find(s=>s.material==='steelLeaf').color,after:painted.find(s=>s.material==='steelLeaf').color};});assert.ok(paint.panel&&paint.door);assert.equal(paint.before,paint.after);
 for(const [field,value]of [['yuk',210],['en',100],['catalogId','american-sol']]){
  const check=await p.evaluate(({data,field,value})=>{Studio.loadProject(data);G.elemanlar[0][field]=value;const m=Wall3D.build();return{real:m.parts.some(p=>p.kind==='steelDoorSTL'),fallback:m.parts.some(p=>p.openingId===G.elemanlar[0].id&&p.schematic)};},{data:originalProject,field,value});assert.equal(check.real,false);assert.equal(check.fallback,true);
 }
 await p.evaluate(d=>Studio.loadProject(d),originalProject);const saved=await p.evaluate(()=>{Studio.flush();return Studio.state();});await p.reload();assert.deepEqual(await p.evaluate(()=>Studio.state()),saved);assert.ok(await p.evaluate(()=>Wall3D.build().parts.some(p=>p.kind==='steelDoorSTL')));
 const srcText=await p.evaluate(()=>JSON.stringify(Studio.state()));assert.ok(!srcText.includes('vertices')&&!srcText.includes('positionsBase64'));
 console.log('PASS wall paint isolation, explicit custom-size/other-door fallback, reload/JSON without embedded meshes');
 const crop=await p.evaluate(()=>{SingleStorey.loadExample(false);const e=G.elemanlar.find(e=>e.tip_==='kapi'&&e.en===90);e.catalogId='steel-sol';e.yuk=205;const m=Wall3D.build(),part=m.parts.find(p=>p.kind==='steelDoorSTL');return{real:!!part,width:part?.widthMm,source:part?.sourceWidthMm,frame:part?.frameWidthMm,count:m.surfaces.filter(s=>s.kind==='steelDoorSTL'&&s.material!=='panel').length};});assert.ok(crop.real&&crop.width<crop.source&&crop.frame>912&&crop.count>9300);
 await p.evaluate(d=>Studio.loadProject(d),originalProject);
 for(const change of ['height','thickness','otherDoor','window']){
  const check=await p.evaluate(({data,change})=>{Studio.loadProject(data);const e=G.elemanlar[0];if(change==='height')G.opt.h=270;if(change==='thickness')G.segs.forEach(s=>{s.k=6;s.kSabit=true;});if(change==='otherDoor'||change==='window')G.elemanlar.push({...e,id:'conflict',tip_:change==='window'?'pencere':'kapi',en:60,catalogId:change==='window'?null:e.catalogId});const m=Wall3D.build();return{real:m.parts.some(s=>s.kind==='steelDoorSTL'),warnings:m.warnings.some(s=>s.startsWith('Çelik kapı:'))};},{data:originalProject,change});assert.equal(check.real,false,change);assert.equal(check.warnings,true,change);
 }
 console.log('PASS existing end-wall board clipping with intact door, unsupported height/thickness and overlapping-opening fallbacks');
 await p.evaluate(d=>Studio.loadProject(d),originalProject);
 await p.click('#single-model');await p.selectOption('#roofViewpoint','iso');await p.locator('#roofCanvas').screenshot({path:path.join(root,'artifacts/steel-door-isometric.png')});
 assert.deepEqual(errors,[]);assert.deepEqual(requests,[]);for(const [name,h]of Object.entries(before))assert.equal(hash(name),h,name);
 console.log('PASS no runtime errors/network, all original HTML/src/dist/example drawing hashes unchanged');
 }finally{await b.close();}})().catch(e=>{console.error(e);process.exitCode=1});
