const assert=require('node:assert/strict'),C=require('../src/loading-core.js');
const nodes=[{id:'a',x:0,y:0},{id:'b',x:555,y:0},{id:'c',x:555,y:266},{id:'d',x:0,y:266}];
const segs=[{id:'wall',n1:'a',n2:'b',k:10,dis:true},{id:'right',n1:'b',n2:'c',k:10,tip:'veranda'},{id:'front',n1:'c',n2:'d',k:10,tip:'veranda'},{id:'left',n1:'d',n2:'a',k:10,tip:'veranda'}];
const rooms=[{tip:'veranda',nodeIds:['a','b','c','d']}];
let r=C.topProfiles(nodes,segs,rooms,()=> 'y');
assert.equal(r.find(r=>r.id==='wall').name,'Duvar omegası');assert.equal(r.find(r=>r.id==='front').name,'Baş makas omegası');assert.equal(r.find(r=>r.id==='right').netMm,2560);assert.equal(r.find(r=>r.id==='front').netMm,5450);
r=C.topProfiles(nodes,segs,rooms,()=> 'x');assert.equal(r.find(r=>r.id==='right').name,'Baş makas omegası');assert.equal(r.find(r=>r.id==='front').name,'Duvar omegası');
assert.equal(C.topProfiles(nodes,segs,[],()=>null)[0].name,'Omega — yön kontrolü');
const item=n=>({group:'Metal',name:'Baş makas omegası',size:'100 × 2500 mm',source:{id:'h',omegaRule:{lengthCm:n}}});
let report=C.build([item(1767)]);const head=report.rows.find(r=>r.name==='Baş makas omegası'),z=report.rows.find(r=>r.name==='Baş makas Z sacı');assert.equal(head.qty,8);assert.equal(z.qty,8);assert.notEqual(z.key,head.key);assert.equal(z.referenceId,'tuna-41');assert.equal(head.referenceId,'');
const cfg={manual:[],adjustments:[{key:head.key,basis:head.basis,qty:11,reason:'Özel sevk',referenceId:''}]};report=C.build([item(1767)],cfg);assert.equal(report.rows.find(r=>r.name==='Baş makas Z sacı').qty,11);report=C.build([item(1768)],cfg);assert.equal(report.rows.find(r=>r.name==='Baş makas Z sacı').qty,null);
for(const [net,ship] of [[5550,5650],[2560,2660],[1880,1980]]){const row=C.build([{group:'Metal',name:'Veranda kirişi',size:'100 × 100 × '+(net+100)+' mm',source:{id:'b',beamRule:{netMm:net}}}]).rows[0];assert.equal(row.shipLengthMm,ship);assert.equal(row.qty,1);assert.equal(row.spare,0);assert.equal(row.cutAllowanceMm,100);assert.match(C.csv([row]),/Net boy/);}
console.log('PASS veranda adjacency, rotation, unknown direction, net face distances, separate linked Z, manual/stale propagation, per-piece allowance');
