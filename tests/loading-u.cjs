const assert=require('node:assert/strict'),C=require('../src/loading-core.js');
assert.equal(C.uProduct(6,250).size,'60 × 2440 mm');assert.equal(C.uProduct(10,280).size,'100 × 2740 mm');assert.equal(C.uProduct(15,250),null);assert.equal(C.uProduct(6,6),null);
const make=(k,h,n)=>Array.from({length:n},(_,i)=>({group:'Metal',name:'Çektirme U',size:C.uProduct(k,h).size,source:{id:k+':'+h+':'+i,uRule:C.uProduct(k,h),referenceId:C.uProduct(k,h).referenceId}}));
assert.equal(C.build([],undefined).rows.length,0);
for(const [n,spare,total] of [[1,1,2],[3,1,4],[5,1,6],[6,2,8],[10,2,12],[11,3,14]]){const r=C.build(make(6,250,n)).rows[0];assert.equal(r.calculated,n);assert.equal(r.spare,spare);assert.equal(r.qty,total);}
const mixed=C.build([...make(6,250,3),...make(10,250,2),...make(6,280,1)]);assert.equal(mixed.rows.length,3);assert.equal(mixed.rows.reduce((n,r)=>n+r.spare,0),3);
const items=make(6,250,3),r=C.build(items).rows[0],config={adjustments:[{key:r.key,basis:r.basis,qty:7,reason:'Ek montaj yedeği',referenceId:'tuna-29'}],manual:[]};assert.equal(C.build(items,config).rows[0].qty,7);assert.equal(C.build(make(6,250,4),config).rows[0].qty,null);assert.equal(C.build(make(6,280,3),config).orphan.length,1);
console.log('PASS U dimensions, zero and 1/3/5/6/10/11 counts, separate sizes, override and stale detection');
