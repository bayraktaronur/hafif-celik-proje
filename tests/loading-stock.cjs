const assert=require('node:assert/strict'),C=require('../src/loading-core.js');
for(const [widths,expected] of [[[300,300],1],[[400,400,400],1],[[1020],1],[[700,700],2],[[625,625],1],[[575,575],1],[[1250,300,300],2]]){const bins=C.packPanels(widths.map((cutMm,i)=>({id:String(i),cutMm})));assert.equal(bins.length,expected);assert.ok(bins.every(b=>b.used<=1250));assert.equal(bins.reduce((n,b)=>n+b.parts.length,0),widths.length);}
assert.throws(()=>C.packPanels([{id:'x',cutMm:1251}]));
const item=(id,w,k=60,h=2500)=>({group:'Panel',name:'Özel dolu panel',size:String(w),source:{id,stockRule:{rule:'test',cutMm:w,thicknessMm:k,heightMm:h}}});
const rows=C.build([item('a',300),item('b',300),item('c',400,100),item('d',400,60,2800)]).rows;
assert.equal(rows.length,3);assert.equal(rows.reduce((n,r)=>n+r.qty,0),3);assert.equal(rows.find(r=>r.calculated===2).leftoverMm,650);
const a=C.build([item('a',300),item('b',300)]).rows[0],config={manual:[],adjustments:[{key:a.key,basis:a.basis,qty:2,reason:'Özel sevk',referenceId:''}]};assert.equal(C.build([item('a',300),item('b',400)],config).rows[0].qty,null);
console.log('PASS stock examples, leftovers, separate thickness/heights, no oversized cuts, stale decisions');

// Arbitrary decimal widths, not a fixed list of approved examples.
for(let i=1;i<=1249;i++)assert.equal(C.stockWidth(i/10,null).cutMm,i);
assert.deepEqual(C.stockWidth(125.5,1250),{cutMm:1250,basis:'catalog-cut'});
assert.equal(C.stockWidth(62.75,625).cutMm,625);
assert.equal(C.stockWidth(37.234,null).cutMm,372.34);
for(const w of [NaN,Infinity,0,-1])assert.equal(C.stockWidth(w,null),null);
for(const [widths,n] of [[[37.2,86.4],1],[[68.3,68.3],2],[[21.7,33.6,69.2],1]]){
 const r=C.build(widths.map((w,i)=>item(String(i),C.stockWidth(w,null).cutMm))).rows[0];assert.equal(r.qty,n);assert.equal(r.calculated,widths.length);
}
assert.throws(()=>C.packPanels([{id:'large',...C.stockWidth(130,null)}]));
console.log('PASS arbitrary custom widths and preserved catalog cuts');
