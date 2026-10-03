const assert=require('node:assert/strict'),C=require('../src/loading-core.js');
const item=(id,lengthCm,k=60)=>({group:'Metal',name:'Alt çerçeve',size:`${k} × 2500 mm`,source:{id,frameRule:{rule:'frame250-total-ceil-plus1-v1',lengthCm,widthMm:k}}});
for(const [cm,base,qty] of [[3350,14,15],[3250,13,14],[250,1,2],[250.01,2,3]]){const r=C.build([item('a',cm)]).rows[0];assert.equal(r.calculated,base);assert.equal(r.qty,qty);assert.equal(r.spare,1);}
assert.equal(C.build([]).rows.length,0);
assert.equal(C.build([item('inside',100),item('outside',150)]).rows[0].qty,2);
assert.equal(C.build([item('a',100),item('b',150,100)]).rows.length,2);
const r=C.build([item('a',3350)]).rows[0],cfg={manual:[],adjustments:[{key:r.key,basis:r.basis,qty:20,reason:'Özel sevk',referenceId:''}]};assert.equal(C.build([item('a',3350)],cfg).rows[0].qty,20);assert.equal(C.build([item('a',3351)],cfg).rows[0].qty,null);
console.log('PASS bottom frame totals, ceiling, per-width spare, pooling, manual and stale');
