const assert=require('node:assert/strict');
require('./face-dimensions.js');
const n=(id,x,y)=>({id,x,y}),s=(id,n1,n2,tip)=>({id,n1,n2,k:14,tip});
const nodes=[n(1,0,0),n(2,0,100),n(3,400,100),n(4,0,300)];
const wall=s(1,1,2),across=s(2,2,3,'veranda'),along=s(3,2,4,'veranda');
for(const v of [across,along]){
 const r=FaceDimensions.range(v,nodes,[wall,v],'outer');
 assert.equal(r[0],7);
 assert.equal(FaceDimensions.range({...v,n1:v.n2,n2:v.n1},nodes,[wall,v],'net')[1],r[1]-7);
}
const cap=FaceDimensions.wallFaceHit({x:0,y:107},nodes,[wall],.4);
assert.deepEqual([cap.x,cap.y,cap.node],[0,107,2]);
assert.equal(FaceDimensions.wallFaceHit({x:0,y:110},nodes,[wall],.4),null);
const more=[n(5,0,150),n(6,1000,0),n(7,1000,200),n(8,1050,200)];
global.G={nodes:[...nodes,...more],segs:[wall,s(4,2,5),s(5,6,7),s(6,7,8)],dimensionReference:'outer'};
global.isPref=()=>false;global.planVisible=()=>true;global.fmtCm=String;global.DIM={txt:''};global._dimRow=null;
let spans=[];global._dimLine=(...a)=>spans.push(a[7]);FaceDimensions.totals();
assert.ok(spans.length&&Math.max(...spans)<220);
console.log('PASS: veranda at perpendicular and straight joins, reversed ends, cap snapping and disconnected totals.');
