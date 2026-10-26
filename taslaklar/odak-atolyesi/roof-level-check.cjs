const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),{pathToFileURL}=require('node:url');
const root=path.resolve(__dirname,'../..'),B=require(path.join(root,'src/roof-core.js')),plain=x=>JSON.parse(JSON.stringify(x));
const once=(s,a,b)=>{assert.equal(s.split(a).length,2,a);return s.replace(a,b);};
let source=fs.readFileSync(path.join(root,'src/roof-core.js'),'utf8');for(const f of ['roof-feedback-build','roof-level-build'])source=require('./'+f+'.cjs')('src/roof-core.js',source,once);
const context={module:{exports:{}},RoofLevelMath:require("./roof-level-math.js"),RoofRoleSwap:require('./roof-role-swap.js')};vm.runInNewContext(source,context);const C=context.module.exports;
function fixture(angle=0,reverse=false,pitch=33){const frame={x:2000,y:2000,angle},parent=C.defaults({...frame,id:'p',w:1892.5,d:753.5,h:250,datum:'trim',eaves:[22,22,30,30]}),points=[{x:0,y:-30},{x:0,y:-135},{x:1014,y:-135},{x:1014,y:-30}].map(p=>C.transform(frame,p));if(reverse)points.reverse();return {parent,child:C.defaults({id:'c',h:250,datum:'trim',pitch,eaves:[22,0,30,30],childJoin:{points},production:{role:'child',parentId:'p',relative:90}})};}
for(const angle of [0,90,180,270])for(const reverse of [false,true]){
 const legacy=fixture(angle,reverse,24);assert.deepEqual(plain(C.connectChild(legacy.child,legacy.parent)),plain(B.connectChild(legacy.child,legacy.parent)));
 const invalid=fixture(angle,reverse);assert.throws(()=>C.connectChild(invalid.child,invalid.parent),e=>e.code==='roof-child-intersection');
 for(const target of ['child','parent']){
  const f=fixture(angle,reverse),z=f[target];z.h=z.roofElevation=target==='child'?200:300;const before=JSON.stringify(f),c=C.connectChild(f.child,f.parent);assert.equal(JSON.stringify(f),before);
  C.validate([f.parent,c]);assert.ok(C.calculate([f.parent,c]).area>170);assert.ok(c.childJoin.cladding.length>0);assert.deepEqual(plain(C.connectChild(c,f.parent)),plain(c));
  for(const poly of c.childJoin.cladding){assert.ok(poly.every(p=>Object.values(p).every(Number.isFinite)));assert.ok(poly[2].z>=poly[1].z-.001&&poly[3].z>=poly[0].z-.001);}
  assert.throws(()=>C.validate([{...f.parent,roofElevation:-1},c]),/özel saçak/);
 }
}
console.log('PASS default geometry unchanged; 16 explicit height joins in four directions and reversed U order, vertical closure, validation, idempotence');
require('./roof-role-swap-check.cjs');
require('./roof-constraints-check.cjs');
