const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const M=require('./roof-level-math.js'),S=require('./roof-role-swap.js'),plain=x=>JSON.parse(JSON.stringify(x)),close=(a,b)=>assert.ok(Math.abs(a-b)<.00001,`${a} != ${b}`);
const once=(s,a,b)=>{assert.equal(s.split(a).length,2,a);return s.replace(a,b);};
let source=fs.readFileSync(require.resolve('../../src/roof-core.js'),'utf8');for(const f of ['roof-feedback-build','roof-level-build'])source=require('./'+f+'.cjs')('src/roof-core.js',source,once);
const context={module:{exports:{}},RoofLevelMath:M,RoofRoleSwap:S};vm.runInNewContext(source,context);const C=context.module.exports;
for(const angle of [0,90,180,270])for(const reverse of [false,true])for(const drawn of [false,true]){
 const frame={x:2000,y:2000,angle},parent=C.defaults({...frame,id:'p',w:1892.5,d:753.5,h:250,wallTop:250,datum:'trim',eaves:[22,22,30,30],production:{role:'main',parentId:'',relative:0}});
 if(drawn){parent.outline=C.basePolygon(parent);parent.edgeEaves=[30,22,30,22];}
 parent.pitch=M.pitchForPeak(parent,330,C);
 const points=[{x:0,y:-30},{x:0,y:-135},{x:1014,y:-135},{x:1014,y:-30}].map(p=>C.transform(frame,p));if(reverse)points.reverse();
 let wing=C.connectChild(C.defaults({id:'c',h:250,wallTop:250,datum:'trim',eaves:[22,0,30,30],childJoin:{points},production:{role:'child',parentId:'p',relative:90}}),parent,{frameOnly:true});
 wing.pitch=M.pitchForPeak(wing,380,C);wing.levelControl={version:1,baseMode:'wall',base:250,baseLocked:true,peakLocked:true,pitchLocked:false,peak:380,pitch:wing.pitch};
 const before=JSON.stringify([parent,wing]),out=S.prepare([parent,wing],C),p=out[0],c=out[1];assert.equal(JSON.stringify([parent,wing]),before);
 assert.equal(p.production.role,'child');assert.equal(p.production.parentId,'c');assert.equal(c.production.role,'main');assert.equal(c.production.parentId,'');assert.equal(c.roleSwap.active,true);assert.equal(c.childJoin,undefined);
 close(p.h,250);close(c.h,250);close(M.peak(p,C),330);close(M.peak(c,C),380);assert.ok(c.w>wing.w+700);
 assert.deepEqual(plain(S.prepare(out,C)),plain(out));C.validate(out);const model=C.calculate(out);assert.ok(model.byZone.every(z=>z.area>0));assert.ok(model.lengths.valley>0);
 // Extending the new main into the old main must not add any footprint or holes.
 const expected=C.area(C.footprint(parent))+C.area(C.footprint(wing));close(model.planArea*10000,expected);
 const withoutWing=S.remove(out,'c'),withoutParent=S.remove(out,'p');assert.equal(withoutWing[0].production.role,'main');assert.equal(withoutParent[0].roleSwap,undefined);C.validate(withoutWing);C.validate(withoutParent);C.validate([{...S.detached(c),id:'copy'}]);
 // Restore the original graph and original U support when the first roof is higher again.
 p.pitch=M.pitchForPeak(p,400,C);const restored=S.prepare(out,C);assert.equal(restored[0].production.role,'main');assert.equal(restored[1].production.parentId,'p');assert.equal(restored[1].roleSwap.active,false);
 const connected=C.connectChild(restored[1],restored[0]);close(M.peak(connected,C),380);close(connected.h,250);assert.deepEqual(plain(connected.childJoin.points),plain(points));C.validate([restored[0],connected]);
}
console.log('PASS role reversal: 4 orientations x 2 U orders x drawn/rectangular roof; footprint, ridge/base, valleys, idempotence and restoration');
