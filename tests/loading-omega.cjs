const assert=require('node:assert/strict'),C=require('../src/loading-core.js');
const item=(id,lengthCm,k=60)=>({group:'Metal',name:'Duvar omegası',size:`${k} × 2500 mm`,source:{id,omegaRule:{rule:'interior-omega250-total-ceil-v1',lengthCm,widthMm:k}}});
for(const [cm,n] of [[250,1],[250.01,2],[3350,14],[2143.5,9]]){const r=C.build([item('a',cm)]).rows[0];assert.equal(r.qty,n);assert.equal(r.spare,0);}
assert.equal(C.build([item('a',100),item('b',150)]).rows[0].qty,1);
assert.equal(C.build([item('a',100),item('b',150,100)]).rows.length,2);
const r=C.build([item('a',100)]).rows[0],cfg={manual:[],adjustments:[{key:r.key,basis:r.basis,qty:4,reason:'Ek sevk',referenceId:''}]};assert.equal(C.build([item('a',100)],cfg).rows[0].qty,4);assert.equal(C.build([item('a',101)],cfg).rows[0].qty,null);
console.log('PASS omega stock rounding, thickness grouping, no assumed spare, manual/stale');
