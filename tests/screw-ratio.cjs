const assert=require('node:assert/strict'),L=require('../src/loading-core.js');
for(const ref of [291,103.32]){const item={group:'Metal',name:'Vida',size:'test',source:{id:'x',screwRule:{amount:ref,referenceAmount:ref,unit:'test'}}};
const r=L.build([item],null).rows[0];assert.equal(r.qty,1000);assert.equal(L.shipment(r).spare,0);
const config={manual:[],adjustments:[{key:r.key,basis:r.basis,qty:1200,reason:'kontrol',referenceId:''}]};assert.equal(L.build([item],config).rows[0].qty,1200);
item.source.screwRule.amount*=2;assert.equal(L.build([item],null).rows[0].qty,2000);assert.equal(L.build([item],config).rows[0].qty,null);}
console.log('PASS reference calibration, scaling, manual override and stale detection');
