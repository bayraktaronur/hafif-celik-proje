const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),path=require('node:path');
const context={window:{},RoofCore:{height:(f,p)=>f.a*p.x+f.b*p.y+f.c}};vm.createContext(context);vm.runInContext(fs.readFileSync(path.join(__dirname,'roof-hatch.js'),'utf8'),context);
for(const angle of [0,37,90]){
 const a=angle*Math.PI/180,rotate=({x,y})=>({x:x*Math.cos(a)-y*Math.sin(a),y:x*Math.sin(a)+y*Math.cos(a)}),f={zoneId:'z',a:.28*Math.cos(a),b:.28*Math.sin(a),c:280,poly:[{x:0,y:0},{x:500,y:0},{x:500,y:300},{x:0,y:300}].map(rotate)};
 for(const material of ['sandvic','trapez','tekkat','metal','shingle']){const rows=context.window.RoofHatch.edges({faces:[f]},[{id:'z',material,width:100,angle}]);assert.ok(rows.length>10);for(const e of rows){assert.equal(e.material,material);for(const p of [e.p,e.q]){const x=p.x*Math.cos(a)+p.y*Math.sin(a),y=-p.x*Math.sin(a)+p.y*Math.cos(a);assert.ok(x>=-.001&&x<=500.001&&y>=-.001&&y<=300.001);assert.ok(Number.isFinite(p.z));}if(['sandvic','trapez','tekkat'].includes(material))assert.ok(Math.abs((e.q.x-e.p.x)*f.b-(e.q.y-e.p.y)*f.a)<.001);}}
 assert.equal(context.window.RoofHatch.edges({faces:[f]},[{id:'z',material:'unknown',angle}]).length,0);
}
console.log('PASS five materials, rotated slopes, clipping and unknown material');
