const assert=require('node:assert/strict'),C=require('../src/roof-core.js');
const a=C.defaults({id:'a',group:'a',w:1000,d:800,eaves:[0,0,0,0],width:80}),b=C.defaults({...a,id:'b',group:'b',x:1500,width:100});
const m=C.calculate([a,b]);assert.equal(m.totals.length,2);assert.ok(m.totals.find(t=>t.width===80).pieces>m.totals.find(t=>t.width===100).pieces);
for(const t of m.totals)assert.equal(t.blankArea,m.cutList.filter(c=>c.width===t.width).reduce((v,c)=>v+c.width*c.length/10000,0));
for(const angle of [0,37,90])for(const type of ['besik','tek','kirma']){
 const model=C.calculate([C.defaults({...a,angle,type})]);for(const face of model.faces){const mesh=C.trapezSurfaces(face);assert.ok(mesh.length);assert.ok(Math.abs(mesh.reduce((n,f)=>n+C.area(f.poly),0)-C.area(face.poly))<1e-5);for(const f of mesh)for(const p of f.poly){const h=(p.z-C.height(face,p))/Math.sqrt(1+face.a**2+face.b**2);assert.ok(h>=-1e-6&&h<=2.700001);assert.ok(C.contains(face.poly,p));}}}
console.log('PASS separate 80/100 quantities, blank areas, clipped 27mm form on gable/mono/hip and rotations');
