// Prototype-only integration: reuse fixture history, validation, placement and editing.
module.exports=(file,s,once)=>{
 if(file==='src/furniture-catalog.js')s+='\nPlanLibraryCore.install(FurnitureCatalog);\n';
 if(file==='src/fixtures.js'){
  s=once(s,'PlanPresentation.fixture(c,f,PlanPresentation.surface());',"if(PlanLibraryCore.draw(c,f,PlanPresentation.surface(),{selected:color==='#ffd469'||color==='#8ee4c6'})){c.restore();return;}PlanPresentation.fixture(c,f,PlanPresentation.surface());");
  s=once(s,"window.Fixtures={symbol,align:",`window.Fixtures={symbol,
 beginLibrary(kind,w,d,angle=0,mirror=false){
  if(!PlanLibraryCore.items[kind]||PlanLibraryCore.items[kind].command)return false;
  if(!Number.isFinite(w)||!Number.isFinite(d)||w<1||d<1||w>500||d>500)return false;
  setTool('fixture');draft={kind,w,d,angle,mirror,x:0,y:0};ghost=null;
  if(standard[kind])Object.assign(draft,standard[kind]);
  draw();return true;
 },
 placeLibraryAt(p){
  if(!draft||!Number.isFinite(p.x)||!Number.isFinite(p.y))return false;
  const point=resolve(p,false),f={...draft,...point,id:'fixture-'+crypto.randomUUID()};
  if(!Studio.edit(()=>G.fixtures.push(f)))return false;
  draft=ghost=null;setTool('sec');select(f);return true;
 },
 drawUnderlays(){
  (G.fixtures||[]).filter(f=>PlanLibraryCore.items[f.kind]?.underlay).forEach(f=>{const p=toCv(f.x,f.y);symbol(ctx,f,p.x,p.y,sc(),TH.wall);});
 },align:`);
  s=once(s,'symbol(ctx,f,p.x,p.y,sc(),selected&&!TH.export?\'#ffd469\':TH.wall);',"if(!PlanLibraryCore.items[f.kind]?.underlay)symbol(ctx,f,p.x,p.y,sc(),selected&&!TH.export?'#ffd469':TH.wall);");
  s=once(s,'(G.fixtures||[]).slice().reverse().find(f=>','(G.fixtures||[]).slice().reverse().sort((a,b)=>Number(!!PlanLibraryCore.items[a.kind]?.underlay)-Number(!!PlanLibraryCore.items[b.kind]?.underlay)).find(f=>');
 }
 if(file==='src/kitchen.js')s=once(s,'const baseDraw=drawElemanlar;window.drawElemanlar=function(){','const baseDraw=drawElemanlar;window.drawElemanlar=function(){window.Fixtures?.drawUnderlays();');
 return s;
};
