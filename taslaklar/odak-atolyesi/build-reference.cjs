// Read the existing engine in a fresh, isolated browser context; write only draft assets.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),{pathToFileURL}=require('node:url');
const {chromium}=require(path.resolve(path.dirname(process.execPath),'../node_modules/playwright'));
const root=path.resolve(__dirname,'../..'),source='cizimler/2026-10-02-tuna84-dwg-esleme-taslak.json';
(async()=>{const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'});try{
 const p=await browser.newPage();await p.goto(pathToFileURL(path.join(root,'plan_cizim.html')).href);
 const data=JSON.parse(fs.readFileSync(path.join(root,source),'utf8'));
 const result=await p.evaluate(d=>{Studio.loadProject(d);G.opt.h=280;const a=pfAnaliz(),m=Wall3D.build();
  return {height:280,system:G.sistem,sourceVersion:Studio.state().v,parts:m.parts,warnings:m.warnings,
   surfaces:m.surfaces.map(s=>({kind:s.kind,partId:s.partId,jointType:s.jointType,material:s.material,poly:s.poly,color:s.color,alpha:s.alpha,painted:s.painted,edgeColor:s.edgeColor})),
   panels:a.runs.flatMap(r=>r.slots.map(s=>({segment:r.owner.id,width:s.w,k:s.k,a:{x:r.ax+r.ux*s.a,y:r.ay+r.uy*s.a},b:{x:r.ax+r.ux*s.b,y:r.ay+r.uy*s.b}})))};
 },data);
 if(result.panels.length!==49||!result.parts.some(p=>p.jointType==='H')||!result.parts.some(p=>p.jointType==='kose'))throw Error('Expected prefab source not found');
 fs.writeFileSync(path.join(__dirname,'prefab-reference.js'),'const PREFAB_REFERENCE = '+JSON.stringify(result,(_,v)=>typeof v==='number'?Math.round(v*1e5)/1e5:v)+';\n');
 for(const name of ['camera-3d.js','scene-3d.js'])fs.copyFileSync(path.join(root,'src',name),path.join(__dirname,name));
 console.log(JSON.stringify({panels:result.panels.length,parts:result.parts.length,surfaces:result.surfaces.length,sourceHash:crypto.createHash('sha256').update(fs.readFileSync(path.join(root,source))).digest('hex')}));
}finally{await browser.close()}})().catch(e=>{console.error(e);process.exitCode=1});
