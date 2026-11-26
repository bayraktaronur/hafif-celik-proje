const fs=require('fs'),vm=require('vm'),assert=require('node:assert/strict'),window={};
vm.runInNewContext(fs.readFileSync('src/window-stl.js','utf8'),{window});
vm.runInNewContext(fs.readFileSync('taslaklar/odak-atolyesi/pvc-opening-3d.js','utf8'),{window});
const before=JSON.stringify(window.WindowSTLModels);
for(const [en,yuk] of [[120,100],[119,160],[160,160]]){const m=window.PvcOpening3D.resolve({tip_:'pencere',en,yuk}),src=window.WindowSTLModels.find(s=>s.key===m.adaptedFrom);assert(m);assert(m.vertices.every(Number.isFinite));assert.equal(m.vertices.length,src.vertices.length);for(let i=1;i<m.vertices.length;i+=3)assert.equal(m.vertices[i],src.vertices[i]);assert.equal(m.height,250);assert.equal(m.materialIds,src.materialIds);}
assert.equal(JSON.stringify(window.WindowSTLModels),before);
assert.equal(window.PvcOpening3D.resolve({tip_:'pencere',en:120,yuk:120}),window.WindowSTLModels.find(m=>m.key==='120x120'));
assert.equal(window.PvcOpening3D.resolve({tip_:'pencere',penTip:'surme',en:119,yuk:160}),null);
console.log('PASS original mesh retained, adapted topology/materials/depth preserved, exact size unchanged, sliding excluded');
