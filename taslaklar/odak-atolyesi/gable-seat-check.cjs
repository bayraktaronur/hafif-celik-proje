const fs=require('fs'),vm=require('vm'),assert=require('node:assert/strict');
function core(file){const text=fs.readFileSync(file,'utf8'),ctx={};vm.runInNewContext(text.slice(text.indexOf('// src/roof-core.js'),text.indexOf('// src/furniture-catalog.js')),ctx);return ctx.RoofCore;}
const C=core(process.argv[2]),old=core(process.argv[3]),close=(a,b)=>assert.ok(Math.abs(a-b)<1e-6,`${a} != ${b}`);
let cases=0;
for(const angle of [0,90,180,270])for(const overhang of [0,22,40])for(const end of [0,1])for(const reverse of [false,true]){
 const p=C.defaults({id:'main',x:2000,y:1500,w:1000,d:800,angle,datum:'trim',eaves:[overhang,overhang,30,30]});
 const x=end?1000+overhang:-overhang,front=end?1350:-350;
 const points=[{x,y:100},{x:front,y:100},{x:front,y:600},{x,y:600}].map(q=>C.transform(p,q));if(reverse)points.reverse();
 const input=C.defaults({id:'child',datum:'trim',childJoin:{points},production:{role:'child',parentId:p.id,relative:0}});
 const z=C.connectChild(input,p);close(z.w,350);close(z.childJoin.seatInset,overhang);
 for(const i of [0,3]){const q=C.untransform(p,z.childJoin.support[i]);close(q.x,end?1000:0);}
 assert.ok(z.childJoin.cladding.every(poly=>poly.every(q=>Math.abs(C.untransform(p,q).x-(end?1000:0))<1e-6)));
 if(overhang){const point=C.transform(z,{x:z.w-overhang/2,y:z.d/2});assert.ok(C.calculate([p,z]).faces.some(f=>f.zoneId===z.id&&C.contains(f.poly,point)),'child sheet must continue under host verge');}
 assert.equal(JSON.stringify(C.connectChild(z,p)),JSON.stringify(z));C.validate([p,z]);assert.ok(C.calculate([p,z]).area>0);cases++;
}
// Side/eave joins and standalone roof calculations keep their previous result.
const p=C.defaults({id:'main',w:1000,d:800,datum:'eave'}),input=C.defaults({id:'c',datum:'eave',childJoin:{points:[{x:200,y:830},{x:200,y:1100},{x:500,y:1100},{x:500,y:830}]},production:{role:'child',parentId:'main',relative:90}});
assert.equal(JSON.stringify(C.connectChild(input,p)),JSON.stringify(old.connectChild(input,p)));
assert.equal(JSON.stringify(C.calculate([p])),JSON.stringify(old.calculate([p])));
console.log('PASS '+cases+' gable cases: both ends, four rotations, reversed U, 0/22/40 cm verge; infill seating, idempotence, validation; valley and standalone calculations unchanged.');

