/* Read-only model audit in an isolated browser; never touches the live plan. */
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),{pathToFileURL}=require('node:url');
let pw;try{pw=require('playwright')}catch{pw=require(path.resolve(path.dirname(process.execPath),'../node_modules/playwright'))}
const Project=require('../src/project.js');
function tee(x){return {v:'5',sistem:'prefabrik',settings:{panelDrawMode:'exception',panelSync:false},catiYon:'yatay',ky:250,dy:320,opt:{...Project.DEFAULT_OPTIONS,h:250},n:[{id:'a',x:0,y:0},{id:'b',x,y:0},{id:'c',x:251,y:0},{id:'d',x,y:125.5}],s:[{id:'ab',n1:'a',n2:'b',k:10,kSabit:true,pnlCfg:{dizi:[125.5,125.5],explicit:true}},{id:'bc',n1:'b',n2:'c',k:10,kSabit:true},{id:'bd',n1:'b',n2:'d',k:6,kSabit:true}],e:[],r:[]}}
(async()=>{const browser=await pw.chromium.launch({headless:true,executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'});try{
 const page=await browser.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto(pathToFileURL(path.resolve('plan_cizim.html')).href);
 async function inspect(d){await page.evaluate(d=>Studio.loadProject(d),d);return page.evaluate(()=>{const A=pfAnaliz();return {runs:A.runs.map(r=>({owner:r.owner.id,origin:[r.ax,r.ay],direction:[r.ux,r.uy],axisLength:r.L,startDeduction:r.s0,endDeduction:r.s1,panels:r.slots.map(p=>({number:p.no,width:p.w,thickness:p.k,kind:p.tip,opening:p.acik||null,cutMm:Modular.cutMm(p.w)}))})),connections:A.bag.map(b=>({node:b.nid||null,type:b.tip,thickness:b.k,description:b.olcu,warning:!!b.uyari,freeEnd:!!b.uc,owner:b.run?.owner.id||null,position:b.pos??null})),issues:Prefab.issues()}})}
 const source='cizimler/2026-10-02-tuna84-dwg-esleme-taslak.json',reference=await inspect(JSON.parse(fs.readFileSync(source))),probes=[];
 for(const [name,x,expected] of [['T at seam',125.5,'H3'],['T at panel centre',62.75,'U'],['T off centre',40,'U']]){const result=await inspect(tee(x)),joint=result.connections.filter(b=>b.node==='b');assert.equal(joint.length,1);assert.equal(joint[0].type,expected);probes.push({name,x,joint,issues:result.issues});}
 assert.equal(reference.runs.reduce((n,r)=>n+r.panels.length,0),49);assert.deepEqual(errors,[]);
 const counts={};for(const b of reference.connections)counts[b.type]=(counts[b.type]||0)+1;
 fs.writeFileSync('analizler/2026-10-02-uretim-kural-denetimi.json',JSON.stringify({version:'5.9.19',source,note:'Observed software behaviour, not approved manufacturing rules. CAD connection profiles were not independently measured.',connectionCounts:counts,reference,probes},null,2)+'\n');
 console.log(JSON.stringify({panels:49,connectionCounts:counts,warnings:reference.issues.length,probes:probes.map(p=>({name:p.name,type:p.joint[0].type}))}));
}finally{await browser.close()}})().catch(e=>{console.error(e);process.exitCode=1});
