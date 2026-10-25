const assert=require('node:assert/strict'),path=require('node:path'),fs=require('node:fs'),{pathToFileURL}=require('node:url');
const {chromium}=require(path.resolve(path.dirname(process.execPath),'../node_modules/playwright'));
const root=path.resolve(__dirname,'../..');
const fixture=(k,dir,reverse=false,concave=false)=>{
 const points=concave?[[0,0],[512,0],[512,300],[250,300],[250,512],[0,512]]:[[0,0],[512,0],[512,386.5],[0,386.5]];
 return {v:'5',sistem:'prefabrik',projectName:'Köşe temas testi',catiYon:dir,ky:280,dy:320,fire:10,settings:{panelDrawMode:'exception'},
 n:points.map(([x,y],i)=>({id:'e'+(i+1),x,y,...(reverse&&i===0?{koseTers:true}:{})})),
 s:points.map((_,i)=>({id:'e'+(101+i),n1:'e'+(i+1),n2:'e'+((i+1)%points.length+1),k})),e:[],r:[]};
};
const production=()=>({
 panels:pfAnaliz().runs.map(r=>r.slots.map(p=>({a:p.a,b:p.b,w:p.w,k:p.k}))),
 corners:pfAnaliz().bag.filter(j=>j.tip==='kose').map(j=>pfKoseRect(j.nid,parseFloat(j.k))),
 bill:metrajKalemleri(),model:Wall3D.build()
});
(async()=>{const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'});try{
 const p=await browser.newPage({viewport:{width:1600,height:1000}}),base=await browser.newPage(),errors=[];
 p.on('pageerror',e=>errors.push(e.message));await p.goto(pathToFileURL(path.join(__dirname,'index.html')).href);await base.goto(pathToFileURL(path.join(root,'plan_cizim.html')).href);
 let cases=0,contacts=0;
 for(const k of [6,10,15])for(const dir of ['yatay','dikey'])for(const reverse of [false,true]){
  const data=fixture(k,dir,reverse);await p.evaluate(d=>Studio.loadProject(d),data);await base.evaluate(d=>Studio.loadProject(d),data);
  assert.deepEqual(await p.evaluate(production),await base.evaluate(production));cases++;
 }
 // Test physical panel contact at every outer and reentrant L corner.
 for(const concave of [false,true])for(const dir of ['yatay','dikey']){
  await p.evaluate(d=>Studio.loadProject(d),fixture(10,dir,false,concave));
  const joints=await p.evaluate(()=>{
   const a=pfAnaliz(),boxes=a.runs.flatMap(r=>r.slots.map(p=>{
    const pts=[p.a,p.b].flatMap(t=>[-p.k/2,p.k/2].map(o=>({x:r.ax+r.ux*t-r.uy*o,y:r.ay+r.uy*t+r.ux*o})));
    return {x:Math.min(...pts.map(p=>p.x)),y:Math.min(...pts.map(p=>p.y)),right:Math.max(...pts.map(p=>p.x)),bottom:Math.max(...pts.map(p=>p.y))};
   }));
   return a.bag.filter(j=>j.tip==='kose').map(j=>{
    const q=pfKoseRect(j.nid,parseFloat(j.k)),touch=boxes.filter(b=>{
     const ox=Math.min(b.right,q.x+q.w)-Math.max(b.x,q.x),oy=Math.min(b.bottom,q.y+q.h)-Math.max(b.y,q.y);
     return (Math.abs(ox)<1e-6&&oy>1e-6)||(Math.abs(oy)<1e-6&&ox>1e-6);
    });return {node:j.nid,contacts:touch.length};
   });
  });
  for(const j of joints){assert.ok(j.contacts>=2,JSON.stringify({dir,concave,...j}));contacts+=j.contacts;}
 }
 console.log(`PASS ${cases} production comparisons: panel cuts, post rectangles, quantities and complete 3D unchanged; ${contacts} panel/post contacts`);
 await p.evaluate(d=>Studio.loadProject(d),fixture(10,'dikey'));
 for(const preset of ['presentation','drawing','panels','trusses','full'])for(const zoom of [.15,.3,1.21,3])for(const paper of [false,true]){
  const result=await p.evaluate(({preset,zoom,paper})=>{
   ViewFilters.preset(preset);G.zoom=zoom;const saved=TH;if(paper)TH=TH_PAPER;
   const fills=[],strokes=[],fill=ctx.fillRect,stroke=ctx.strokeRect;
   ctx.fillRect=function(x,y,w,h){if(this.fillStyle==='#9eb2c4'||this.fillStyle==='#c4cfda')fills.push({x,y,w,h,color:this.fillStyle});return fill.call(this,x,y,w,h);};
   ctx.strokeRect=function(x,y,w,h){if(this.strokeStyle==='#536b80'||this.strokeStyle==='#687c8e')strokes.push({x,y,w,h,lw:this.lineWidth});return stroke.call(this,x,y,w,h);};
   try{drawPanels();return {fills,strokes,expected:pfAnaliz().bag.filter(j=>j.tip==='kose').map(j=>{const q=pfKoseRect(j.nid,parseFloat(j.k)),c=toCv(q.x,q.y);return{x:c.x,y:c.y,w:q.w*sc(),h:q.h*sc()};})};}
   finally{ctx.fillRect=fill;ctx.strokeRect=stroke;TH=saved;}
  },{preset,zoom,paper});
  assert.equal(result.fills.length,4);assert.equal(result.strokes.length,4);
  result.expected.forEach((e,i)=>{for(const key of ['x','y','w','h'])assert.ok(Math.abs(result.fills[i][key]-e[key])<1e-7,`${preset}/${zoom}/${paper}/${key}`);
   const s=result.strokes[i];assert.ok(s.x-s.lw/2>=e.x-1e-7&&s.y-s.lw/2>=e.y-1e-7&&s.x+s.w+s.lw/2<=e.x+e.w+1e-7&&s.y+s.h+s.lw/2<=e.y+e.h+1e-7);
  });
 }
 console.log('PASS all 5 view filters, 15/30/121/300% zoom, dark/paper: opaque posts, exact footprint, contours never cover adjoining panels');
 await p.evaluate(()=>{ViewFilters.preset('full');G.zoom=1.21;G.pan={x:150,y:150};draw();});
 await p.locator('#cv').screenshot({path:path.join(root,'artifacts/corner-contact-dark.png')});
 await p.evaluate(()=>{const old=TH;try{TH=TH_PAPER;ctx.fillStyle='#fff';ctx.fillRect(0,0,cv.width,cv.height);drawRooms();drawSegs();drawPanels();}finally{TH=old;}});
 await p.locator('#cv').screenshot({path:path.join(root,'artifacts/corner-contact-paper.png')});
 // CAD retains one closed, exact post outline rather than duplicate fill/inset edges.
 const recorded=await p.evaluate(()=>{
  const items=PlanExport.record().items;
  return pfAnaliz().bag.filter(j=>j.tip==='kose').map(j=>{const q=pfKoseRect(j.nid,parseFloat(j.k));
   return items.filter(i=>i.layer==='PANEL_BAGLANTI'&&i.closed&&i.points?.length===4&&
    Math.abs(Math.min(...i.points.map(p=>p.x))-q.x)<1e-7&&Math.abs(Math.max(...i.points.map(p=>p.x))-q.x-q.w)<1e-7&&
    Math.abs(Math.min(...i.points.map(p=>p.y))-q.y)<1e-7&&Math.abs(Math.max(...i.points.map(p=>p.y))-q.y-q.h)<1e-7).length;
  });
 });assert.deepEqual(recorded,[1,1,1,1]);
 assert.deepEqual(errors,[]);console.log('PASS real export recorder and no runtime errors');
 }finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
