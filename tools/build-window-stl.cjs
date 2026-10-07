const fs=require('fs'),crypto=require('crypto'),path=require('path');
const root=path.resolve(__dirname,'..'),source='referanslar/2026-10-07-pencere-stl/rev4/160-120 pencereli panel-h250cm.stl',b=fs.readFileSync(path.join(root,source)),vertices=[];
if(b.length!==84+b.readUInt32LE(80)*50)throw Error('Invalid binary STL');
for(let i=0;i<b.readUInt32LE(80);i++)for(let j=0;j<9;j++){const v=b.readFloatLE(84+i*50+12+j*4);if(!Number.isFinite(v))throw Error('Invalid coordinate');vertices.push(v);}
fs.writeFileSync(path.join(root,'src/window-stl.js'),'/* Generated from '+source+'; cm; no scaling. */\nwindow.WindowSTL='+JSON.stringify({source,sha256:crypto.createHash('sha256').update(b).digest('hex'),width:166,height:250,centerX:82.5,wallCenterY:4.8,vertices})+';\n');
