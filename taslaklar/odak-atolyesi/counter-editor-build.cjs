module.exports=(file,s,replace)=>{
 if(file==='src/project.js'){s=s.replace('![4,6].includes(c.points.length)','![4,6,8].includes(c.points.length)').replace('(c.points.length===4?1:2)','(c.points.length===4?1:c.points.length===8?3:2)');}
 if(file==='src/engine.js')s=replace(s,'if(!W.makasEk&&!W.alignNode&&!W.moduler&&G.snapGrid&&!G.altKey)off=Math.round(off/G.gridCm)*G.gridCm;','if(!W.makasEk&&!W.alignNode&&!W.moduler&&!G.altKey)off=window.WallMoveStep?WallMoveStep.round(off):off;');
 if(file==='src/kitchen.js'){
 s=replace(s,"if(G.tool==='counter'){stop(e);wall=pick(p);","if(window.CounterEditor?.start(e,p))return;if(G.tool==='counter'){stop(e);wall=pick(p);");
 s=replace(s,'fridge?(f.d-60)/2:0','fridge?(f.d-(window.CounterEditor?CounterEditor.params(c).D:60))/2:0');
 }return s;
};
