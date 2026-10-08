const assert=require('node:assert/strict'),fs=require('fs'),path=require('path'),{pathToFileURL}=require('url');
const pw=require(path.resolve(path.dirname(process.execPath),'../node_modules/playwright'));
(async()=>{const browser=await pw.chromium.launch({headless:true,executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'});try{
 const page=await browser.newPage({viewport:{width:1400,height:1000}});await page.goto(pathToFileURL(path.resolve('plan_cizim.html')).href);
 const source=JSON.parse(fs.readFileSync('cizimler/gulsum-84m2/kontrol-2.json','utf8'));
 for(const direction of ['yatay','dikey'])for(const rotate of [false,true])for(const mode of ['section','joint']){
  const d=structuredClone(source);d.catiYon=direction;d.settings.catiYon=direction;if(rotate)d.n.forEach(n=>{[n.x,n.y]=[n.y,n.x]});
  await page.evaluate(d=>Studio.loadProject(d),d);
  const result=await page.evaluate(mode=>{
   const s=getSeg('e1192'),a=getNode(s.n1),b=getNode(s.n2),before=Studio.snapshot(),axes=JSON.stringify(makasAnaliz().makaslar),nodes=JSON.stringify(G.nodes),others=JSON.stringify(G.elemanlar),count=G.elemanlar.length;
   const run=pfRunOf(s).run,joint=run.slots.slice(1).find(p=>p.a>90&&p.a<210),click=mode==='joint'?{x:run.ax+run.ux*joint.a,y:run.ay+run.uy*joint.a}:a;openModal('pencere',s,click,click);document.getElementById('mEn').value=160;document.getElementById('mYuk').value=120;document.getElementById('mEn').dispatchEvent(new Event('input'));if(document.getElementById('centerWindowSection').hidden)throw Error('Center button hidden for 160');if(mode==='section')document.getElementById('centerWindowSection').click();const center={..._mRaw};modalOk();
   const e=G.elemanlar.length>count?G.elemanlar.at(-1):null,L=_segLen(s),r=pfRunOf(s).run;
   const result={count:G.elemanlar.length-count,toast:document.getElementById('toast').textContent,center,actual:e?{x:a.x+(b.x-a.x)*(e.t+80/L),y:a.y+(b.y-a.y)*(e.t+80/L)}:null,widths:r.slots.map(p=>p.w),sectionWidths:r.slots.filter(p=>p.a>=Math.max(r.s0,r.items.find(it=>it.seg.id===s.id).off)-.001&&p.b<=Math.min(r.L-r.s1,r.items.find(it=>it.seg.id===s.id).off+L)+.001).map(p=>p.w),sameAxes:JSON.stringify(makasAnaliz().makaslar)===axes,sameNodes:JSON.stringify(G.nodes)===nodes,sameOthers:JSON.stringify(G.elemanlar.slice(0,count))===others};
   if(e){const saved=Studio.state();geriAl();result.undo=Studio.snapshot()===before;Studio.loadProject(saved);result.reload=G.elemanlar.some(x=>x.id===e.id&&x.t===e.t);}
   return result;
  },mode);console.log(direction,rotate,mode,JSON.stringify(result));assert.equal(result.count,1);if(mode==='section'){assert.equal(result.sectionWidths.length,3);assert.ok(Math.abs(result.sectionWidths[0]-result.sectionWidths[2])<.001);}assert.ok(Math.hypot(result.center.x-result.actual.x,result.center.y-result.actual.y)<.001);assert.ok(result.widths.some(w=>Math.abs(w-166)<.01));assert.ok(result.sameAxes&&result.sameNodes&&result.sameOthers&&result.undo&&result.reload);
 }
 console.log('PASS real 2.5-panel section: both truss directions and wall orientations, center, 166 panel, unchanged geometry/openings/axes, undo and JSON');
}finally{await browser.close()}})().catch(e=>{console.error(e);process.exitCode=1});
