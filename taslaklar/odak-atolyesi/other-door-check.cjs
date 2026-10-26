const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),crypto=require('node:crypto'),{pathToFileURL}=require('node:url');
const root=path.resolve(__dirname,'../..'),context={window:{},atob:s=>Buffer.from(s,'base64').toString('binary')};
vm.runInNewContext(fs.readFileSync(path.join(__dirname,'other-door-models.js'),'utf8'),context);
const sourceModels=context.window.OtherDoorSTLModels;
for(const family of ['sheet','al-pvc']){
 const all=sourceModels.filter(m=>m.family===family),b=fs.readFileSync(path.join(root,all[0].source)),count=b.readUInt32LE(80),positions=[[],[],[]];let omitted=0;
 assert.equal(crypto.createHash('sha256').update(b).digest('hex'),all[0].sha256);
 for(let t=0;t<count;t++){const v=Array.from({length:9},(_,j)=>b.readFloatLE(84+t*50+12+j*4));if(Math.min(v[0],v[3],v[6])>800){omitted++;continue;}const group=Math.round(((v[0]+v[3]+v[6])/3-65.828)/250);for(let j=0;j<9;j++)positions[group].push(v[j]-(j%3===0?group*250:0));}
 assert.equal(omitted,35416);
 all.forEach((m,i)=>{assert.equal(m.height,[250,280,300][i]);assert.equal(m.vertices.length,positions[i].length);for(let j=0;j<m.vertices.length;j++)assert.ok(Math.abs(m.vertices[j]-positions[i][j])<1e-10);assert.equal(m.parts.find(p=>p.material==='panel').max[2],m.height);assert.ok(Math.abs(m.width-125)<.001);});
}
console.log('PASS both source SHAs, six exact source meshes, original door proportions and excluded detached reference studies');
const {chromium}=require(path.resolve(path.dirname(process.execPath),'../node_modules/playwright'));
const manifest=JSON.parse(fs.readFileSync(path.join(__dirname,'single-engine-manifest.json'))),protectedNames=[...Object.keys(manifest.sources),'dist/plan_studio.html'],hash=p=>crypto.createHash('sha256').update(fs.readFileSync(path.join(root,p))).digest('hex'),before=Object.fromEntries(protectedNames.map(p=>[p,hash(p)]));
(async()=>{const b=await chromium.launch({headless:true,executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'});try{
 const p=await b.newPage({viewport:{width:1600,height:1000}}),errors=[],requests=[];p.on('pageerror',e=>errors.push(e.message));p.on('request',r=>{if(/^https?:/.test(r.url()))requests.push(r.url());});p.on('dialog',d=>d.accept());
 await p.goto(pathToFileURL(path.join(__dirname,'index.html')).href);
 const empty=await p.evaluate(()=>{yeniPlan();return Studio.state();});
 const fixture={...empty,n:[{id:'a',x:0,y:0},{id:'b',x:512,y:0},{id:'c',x:512,y:386.5},{id:'d',x:0,y:386.5}],s:[['a','b'],['b','c'],['c','d'],['d','a']].map(([n1,n2],i)=>({id:'wall'+i,n1,n2,k:10,dis:true,kSabit:true})),e:[],r:[],sistem:'prefabrik',opt:{...empty.opt,h:250,dis:10,ic:6},ky:250,projectName:'Kapı modelleri kontrolü'};
 const styles=['sheet','al','pvc'];
 for(const style of styles){
  const source=sourceModels.find(m=>m.family===(style==='sheet'?'sheet':'al-pvc'));
  assert.equal(source.nominalHeight,205);
  await p.evaluate(d=>{Studio.loadProject(d);Studio.fit();},fixture);await p.click('#t-kapi');
  const pt=await p.evaluate(()=>{const q=toCv(256,386.5),r=cv.getBoundingClientRect();return{x:q.x+r.left,y:q.y+r.top};});await p.mouse.click(pt.x,pt.y);
  const text={sheet:'Sol sac kapı',al:'Sol alüminyum kapı',pvc:'Sol PVC kapı'}[style],choice=await p.locator('#windowPreset option').evaluateAll((els,text)=>els.find(e=>e.textContent.includes(text)).value,text);await p.selectOption('#windowPreset',choice);await p.click('#mbg .mok');await p.keyboard.press('Escape');
  const project=await p.evaluate(()=>Studio.state());assert.equal(project.e[0].catalogId,style+'-sol');assert.equal(project.e[0].yuk,source.nominalHeight);
  for(const h of [250,280,300]){
   await p.selectOption('[data-spec=h]',String(h));
   const result=await p.evaluate(()=>{const prev=JSON.stringify(Studio.state()),bill=JSON.stringify(metrajKalemleri()),m=Wall3D.build(),part=m.parts.find(p=>p.kind==='doorSTL'),sur=m.surfaces.filter(p=>p.kind==='doorSTL'),max=material=>Math.max(...sur.filter(s=>s.material===material).flatMap(s=>s.poly.map(p=>p.z)));return{part,frame:max('doorFrame'),top:max('panel'),tris:sur.length,glass:sur.filter(s=>s.material==='glass').length,duplicate:m.parts.some(p=>p.openingId===part?.openingId&&p.schematic),stable:prev===JSON.stringify(Studio.state())&&bill===JSON.stringify(metrajKalemleri()),joints:m.parts.filter(s=>s.kind==='wallJoint').length};});
   assert.ok(result.part,JSON.stringify(result));assert.equal(result.part.doorStyle,style);assert.equal(result.part.heightMm,h*10);assert.equal(result.part.extensionMm,0);assert.equal(result.top,h);assert.ok(Math.abs(result.frame-205)<1e-8);assert.ok(result.tris>15000);assert.equal(result.duplicate,false);assert.ok(result.stable&&result.joints>0);if(style!=='sheet')assert.ok(result.glass>0);else assert.equal(result.glass,0);
   const hardware=await p.evaluate(()=>{const model=Wall3D.build(),part=model.parts.find(p=>p.kind==='doorSTL'),mesh=OtherDoorSTLModels.find(m=>m.key===part.modelKey);return mesh.parts.every((c,i)=>{if(c.material!=='hardware')return true;const z=model.surfaces.filter(s=>s.kind==='doorSTL'&&s.componentId===i).flatMap(s=>s.poly.map(p=>p.z));return Math.abs(Math.max(...z)-Math.min(...z)-(c.max[2]-c.min[2]))<1e-8;});});assert.ok(hardware,'handles and hinges must retain original size');
   if(style!=='sheet'){const seam=await p.evaluate(()=>{const sur=Wall3D.build().surfaces.filter(s=>s.kind==='doorSTL'),frame=sur.filter(s=>s.material==='doorFrame').flatMap(s=>s.poly.map(p=>p.x)),board=sur.filter(s=>s.material==='panel').flatMap(s=>s.poly.map(p=>p.x));return [Math.min(...frame),Math.max(...frame)].every(x=>board.some(b=>Math.abs(b-x)<1e-8));});assert.ok(seam,'board cutout must meet both sides of the casing');}
   await p.click('#single-model');await p.selectOption('#roofViewpoint','front');await p.locator('#roofCanvas').screenshot({path:path.join(root,`artifacts/${style}-door-${h}.png`)});await p.click('#single-plan');
  }
  for(const deg of [0,90,180,270])for(const reverse of [false,true])for(const hinge of ['a','b']){
   const test=await p.evaluate(({data,deg,reverse,hinge})=>{const d=structuredClone(data),a=deg*Math.PI/180;d.n=d.n.map(p=>({...p,x:p.x*Math.cos(a)-p.y*Math.sin(a),y:p.x*Math.sin(a)+p.y*Math.cos(a)}));const e=d.e[0],s=d.s.find(s=>s.id===e.segId);if(reverse){[s.n1,s.n2]=[s.n2,s.n1];const n=d.n.find(n=>n.id===s.n1),m=d.n.find(n=>n.id===s.n2),L=Math.hypot(n.x-m.x,n.y-m.y);e.t=1-e.t-e.en/L;e.yan=-e.yan;}e.mentese=hinge;Studio.loadProject(d);const m=Wall3D.build(),part=m.parts.find(p=>p.kind==='doorSTL'),sur=m.surfaces.filter(s=>s.kind==='doorSTL'),seg=getSeg(e.segId),n=getNode(seg.n1),q=getNode(seg.n2),L=Math.hypot(q.x-n.x,q.y-n.y),ux=(q.x-n.x)/L,uy=(q.y-n.y)/L;
    // The projecting handle is furthest outside the wall centre; hinge cylinders stay close.
    const handles=sur.filter(s=>s.material==='hardware'&&s.poly.every(p=>Math.abs(-(p.x-n.x)*uy+(p.y-n.y)*ux)>8)).flatMap(s=>s.poly),x=handles.reduce((a,p)=>a+((p.x-n.x)*ux+(p.y-n.y)*uy)/handles.length,0),center=e.t*L+e.en/2;
    return{part:!!part,outside:part?.frontSide===-part?.insideSide,hinge:hinge==='a'?x>center:x<center,finite:sur.every(s=>s.poly.every(p=>Object.values(p).every(Number.isFinite)))};
   },{data:project,deg,reverse,hinge});assert.ok(Object.values(test).every(Boolean),JSON.stringify({style,deg,reverse,hinge,test}));
  }
  await p.evaluate(d=>Studio.loadProject(d),project);
  const paint=await p.evaluate(()=>{const m=Wall3D.build();const edited=Studio.edit(()=>{G.paint3D={interior:{hex:'#ffffff',code:'WHITE',name:'Beyaz'},exterior:{hex:'#bbccdd',code:'TEST',name:'Kontrol rengi'}};});const surfaces=Paint3D.decorate(m.surfaces.filter(s=>s.kind==='doorSTL'));return{edited,wall:surfaces.some(s=>s.material==='panel'&&s.color==='#bbccdd'),door:surfaces.filter(s=>s.material!=='panel').every(s=>!s.painted),glass:surfaces.filter(s=>s.material==='glass').every(s=>s.alpha<1)};});assert.ok(Object.values(paint).every(Boolean));
  assert.equal(await p.evaluate(()=>Studio.flush()),true);const saved=await p.evaluate(()=>Studio.state());await p.reload();assert.deepEqual(await p.evaluate(()=>Studio.state()),saved);assert.ok(await p.evaluate(()=>Wall3D.build().parts.some(p=>p.kind==='doorSTL')));
  if(style!=='sheet')for(const color of ['beyaz','antrasit','altinmese'])assert.ok(await p.evaluate(color=>{const ok=Studio.edit(()=>{G.opt.windowColor=color;}),m=Wall3D.build();return ok&&m.surfaces.filter(s=>s.kind==='doorSTL'&&['doorFrame','doorLeaf','doorFill','doorTrim'].includes(s.material)).every(s=>s.color===ProjectSpecs.windowHex());},color));
  for(const [field,value]of [['en',80],['yuk',200]]){await p.evaluate(({data,field,value})=>{Studio.loadProject(data);G.elemanlar[0][field]=value;}, {data:project,field,value});assert.ok(await p.evaluate(()=>Wall3D.build().parts.some(s=>s.kind==='opening'&&s.schematic)));}
  console.log('PASS '+style+': real catalogue placement; three heights; 16 wall/hinge cases; paint, glass, reload and custom-size fallback');
 }
 const mixed=await p.evaluate(d=>{d.e=['steel','sheet','al','pvc'].map((style,i)=>({id:'door'+i,segId:'wall'+i,tip_:'kapi',catalogId:style+'-sol',en:90,yuk:205,t:.3,yan:1,mentese:'a',kapiTip:'dis'}));Studio.loadProject(d);const m=Wall3D.build();return m.parts.filter(p=>['doorSTL','steelDoorSTL'].includes(p.kind)).map(p=>p.doorStyle).sort();},fixture);assert.deepEqual(mixed,['al','pvc','sheet','steel']);
 await p.click('#single-model');await p.selectOption('#roofViewpoint','iso');await p.locator('#roofCanvas').screenshot({path:path.join(root,'artifacts/doors-mixed-isometric.png')});
 console.log('PASS steel, sheet, aluminium and PVC together; 205 cm casing/board contact; hardware dimensions and finish colours');
 assert.deepEqual(errors,[]);assert.deepEqual(requests,[]);for(const [name,h]of Object.entries(before))assert.equal(hash(name),h,name);
 console.log('PASS unchanged production files, no runtime errors or network');
 }finally{await b.close();}})().catch(e=>{console.error(e);process.exitCode=1});
