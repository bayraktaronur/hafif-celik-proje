// DEV-172: only the independent draft receives view bookmarks and camera access.
module.exports=function(file,s,once){
 if(file==='src/studio.js'){
  s=once(s,'projectName,...(G.scenePresentation','projectName,...(G.cameraViews?.length?{cameraViews:clone(G.cameraViews)}:{}),...(G.scenePresentation');
  s=once(s,'G.scenePresentation=clone(d.scenePresentation||null);','G.cameraViews=clone(d.cameraViews||[]);G.scenePresentation=clone(d.scenePresentation||null);');
 }
 if(file==='src/project.js')s=once(s,'safeTree(input);','safeTree(input);CameraViews.validate(input.cameraViews);');
 if(file==='src/roof.js'){
  s=once(s,'mode=v;action=null;drag=null;render();','mode=v;action=null;drag=null;render();window.SingleStorey?.markRoof(v);');
  s=once(s,'window.RoofStudio={','window.RoofStudio={getCamera:()=>({...Camera3D.state,yaw:angle}),setCamera(v){Object.assign(Camera3D.state,v);angle=v.yaw;$("roofCamera").value=angle;$("roofProjection").value=v.projection;paint();},');
  s=once(s,'return;e.stopImmediatePropagation();if(window.RoofWorkflow','return;if(e.target.closest?.(".roof-task-tabs")&&["ArrowLeft","ArrowRight","Home","End"].includes(e.key))return;e.stopImmediatePropagation();if(window.RoofWorkflow');
 }
 return s;
};
