const assert=require('node:assert/strict'),C=require('../src/loading-core.js');
const u={status:'Otomatik U + yedek',calculated:3,qty:4,spare:1,sources:[{uRule:{}}]};
assert.deepEqual(C.shipment(u),{base:3,spare:1,label:'Yedek toplam sevke dahil; tekrar eklemeyin'});
assert.equal(C.shipment({...u,status:'Manuel doğrulandı',qty:8}).spare,null);
assert.equal(C.shipment({...u,status:'Çizim değişti',qty:null}).base,null);
assert.equal(C.shipment({status:'Otomatik stok pano',calculated:24,qty:22,packing:Array(22),sources:[{stockRule:{}}]}).base,22);
assert.equal(C.shipment({status:'Kural bekliyor',qty:null,sources:[]}).spare,null);
assert.match(C.csv([u]),/Yedek toplam sevke dahil; tekrar eklemeyin/);
console.log('PASS shipment spare breakdown and unknown manual totals');
