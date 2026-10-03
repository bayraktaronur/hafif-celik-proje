const assert=require('node:assert/strict'),C=require('../src/roof-core.js');
const osb=C.purlinStations(1874,400);assert.deepEqual(osb.positions,[0,342,742,1142,1542,1754]);assert.equal(osb.remainderMm,212);assert.equal(1874-osb.positions.at(-1),120);
const tr=C.purlinStations(3324,800);assert.deepEqual(tr.positions,[0,342,1142,1942,2742,3204]);assert.equal(tr.remainderMm,462);
assert.deepEqual(C.purlinStations(1262,800).positions,[0,342,1142]);assert.equal(C.purlinStations(461,800),null);assert.equal(C.purlinStations(3000,600),null);
for(const spacing of [400,800])for(const L of [462,1000,3123.45,5000]){const r=C.purlinStations(L,spacing);assert.equal(r.positions[0],0);assert.equal(r.positions[1],342);assert.ok(Math.abs(r.positions.at(-1)-(L-120))<1e-6);assert.equal(new Set(r.positions).size,r.positions.length);assert.ok(r.positions.every((x,i)=>!i||x>r.positions[i-1]));assert.ok(r.remainderMm<=spacing+1e-6);}
console.log('PASS 120 ridge, 342 eave, 400/800 steps, 212/462 remainders, exact multiple, short roof');
