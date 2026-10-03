const assert=require('node:assert/strict'),fs=require('fs'),path=require('path'),{pathToFileURL}=require('url'),C=require('../src/loading-core.js');let pw;try{pw=require('playwright')}catch{pw=require(path.resolve(path.dirname(process.execPath),'../node_modules/playwright'))}
assert.equal(C.classifyH({x:0,y:0},[],false).dowel,false);
assert.equal(C.classifyH({x:0,y:0},[],false).ear,false);
const m={no:1,axis:'x',pos:100,a:0,b:300};
for(const exterior of [true,false]){
 assert.equal(C.classifyH({x:100,y:0},[m],exterior).ear,exterior);
 assert.equal(C.classifyH({x:100,y:300},[m],exterior).ear,exterior);
 assert.equal(C.classifyH({x:100,y:150},[m],exterior).ear,false);
 assert.equal(C.classifyH({x:101,y:0},[m],exterior).ear,false);
 assert.equal(C.classifyH({x:100,y:0},[{...m,supported:false}],exterior).ear,exterior?null:false);
 assert.equal(C.classifyH({x:100,y:0},[],exterior).ear,exterior?null:false);
 assert.equal(C.classifyH({x:0,y:100},[{...m,axis:'y'}],exterior).ear,exterior);
 assert.equal(C.classifyH({x:100,y:0},[m],exterior).dowel,exterior);
}
(async()=>{const b=await pw.chromium.launch({headless:true,executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'});try{const p=await b.newPage();await p.goto(pathToFileURL(path.resolve('dist/plan_studio.html')).href);await p.evaluate(d=>Studio.loadProject(d),JSON.parse(fs.readFileSync('cizimler/2026-10-02-tuna84-dwg-esleme-taslak.json')));const result=await p.evaluate(()=>{const before=Studio.snapshot(),items=LoadingList.items(),hs=items.filter(i=>i.source.hRule),counts={};for(const i of hs){const k=i.name+' / '+i.source.hRule.label;counts[k]=(counts[k]||0)+1;}const old=hs.find(i=>i.source.hRule.ear),s=LoadingList.calculate().rows.find(r=>r.sources.some(x=>x.id===old.source.id));G.loading={adjustments:[{key:s.key,basis:s.basis,qty:s.calculated,reason:'Test',referenceId:''}],manual:[]};const mm=makasAnaliz().makaslar.find(m=>Math.abs(m.pos-old.source.hRule.matches[0].pos)<.01);G.trussOverrides.push({nodeId:mm.nodeId,axis:mm.axis,from:mm.defaultPos,to:mm.pos+10});const changed=LoadingList.calculate();const invalid=changed.orphan.length>0||changed.rows.some(r=>r.stale);return {counts,invalid};});assert.ok(result.invalid);assert.deepEqual(result.counts,{'Üçlü H / Kulaklı · dübelli':2,'Üçlü H / Kulaksız · dübelli':1,'Üçlü H / Kulaksız · dübelsiz':4,'H / Kulaksız · dübelli':10,'H / Kulaklı · dübelli':10,'H / Kulaksız · dübelsiz':9});assert.ok(Object.keys(result.counts).some(k=>k.includes('Kulaklı · dübelli')));fs.writeFileSync('artifacts/loading-h-counts.json',JSON.stringify(result,null,2));console.log(JSON.stringify(result));console.log('PASS H: both axes, span rejection, unsupported support, interior ear/dowel rules and moved truss invalidation');}finally{await b.close()}})().catch(e=>{console.error(e);process.exitCode=1});
