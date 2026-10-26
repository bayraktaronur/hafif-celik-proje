// All hooks are applied only to the independent engine copy.
module.exports=function(file,s,once){
 if(file==='src/studio.js'){
  s=once(s,'projectName,...(G.referenceImages', 'projectName,...(G.foundation?{foundation:clone(G.foundation)}:{}),...(G.referenceImages');
  s=once(s,'G.referenceImages=clone(d.referenceImages||[]);','G.foundation=clone(d.foundation||null);G.referenceImages=clone(d.referenceImages||[]);');
  s=once(s,"function hasWork(d=state()){return ","function hasWork(d=state()){return !!d.foundation||");
 }
 if(file==='src/project.js')s=once(s,'ReferenceImageData.validate(input.referenceImages);','ReferenceImageData.validate(input.referenceImages);\n    FoundationData.validate(input.foundation);');
 if(file==='src/engine.js')s=once(s,'if(window.ProjectSpecs)ProjectSpecs.billRows()', 'FoundationData.billRows(G.foundation).forEach(function(r){ekle(r.grup,r.kalem,r.olcu,r.birim,r.miktar);});\n  if(window.ProjectSpecs)ProjectSpecs.billRows()');
 if(file==='src/roof.js'){
  s=once(s,'Camera3D.state.yaw=angle;const project=Camera3D.project(items.flatMap(i=>i.poly),w,h);','Camera3D.state.yaw=angle;const scene=FoundationData.compose(items,[...(!hideRoof&&!cutaway&&showStrips?panelEdges3D(m,selected,$(\'roofLayoutLayer\').value):[]),...(hideRoof||cutaway?[]:edges3D(m)),...(hideRoof?[]:ceiling.lines)],G.foundation),project=Camera3D.project(scene.items.flatMap(i=>i.poly),w,h);');
  s=once(s,"renderScene3D(ctx,w,h,items,[...(!hideRoof&&!cutaway&&showStrips?panelEdges3D(m,selected,$('roofLayoutLayer').value):[]),...(hideRoof||cutaway?[]:edges3D(m)),...(hideRoof?[]:ceiling.lines)],project);","renderScene3D(ctx,w,h,scene.items,scene.edges,project);");
 }
 return s;
};
