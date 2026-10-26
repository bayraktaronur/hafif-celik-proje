// DEV-170: presentation is an adapter over the same immutable manufacturing surfaces.
module.exports=function(file,s,once){
 if(file==='src/studio.js'){
  s=once(s,'projectName,...(G.rainDrainage','projectName,...(G.scenePresentation?{scenePresentation:clone(G.scenePresentation)}:{}),...(G.rainDrainage');
  s=once(s,'G.image3DLayout=clone(d.image3DLayout||null);','G.scenePresentation=clone(d.scenePresentation||null);G.image3DLayout=clone(d.image3DLayout||null);');
 }
 if(file==='src/project.js')s=once(s,'safeTree(input);','safeTree(input);Presentation3D.validate(input.scenePresentation);');
 if(file==='src/camera-3d.js'){
  s=once(s,' return p=>{const x=p.x-c.x',' const projection=p=>{const x=p.x-c.x');
  s=once(s,'depth:pers?dist*dist/(dist-Z)-dist:Z};};',`depth:pers?dist*dist/(dist-Z)-dist:Z};};
 // Homogeneous matrix uses the identical fit, pan, zoom and camera as the work view.
 const tx=2*(state.panX-offsetX*scale)/w,ty=-2*(state.panY-offsetY*scale)/h;
 const clip=p=>{const x=p.x-c.x,y=p.y-c.y,z=p.z-c.z,X=x*Math.cos(a)-y*Math.sin(a),D=x*Math.sin(a)+y*Math.cos(a),Y=D*Math.sin(b)-z*Math.cos(b),Z=D*Math.cos(b)+z*Math.sin(b);
  if(!perspective)return [2*scale/w*X+tx,-2*scale/h*Y+ty,-Z/(radius*6),1];
  const W=dist-Z,near=radius*.15,far=dist+radius*8;
  return [2*scale/w*dist*X+tx*W,-2*scale/h*dist*Y+ty*W,(far+near)/(far-near)*W-2*far*near/(far-near),W];};
 const o=clip({x:0,y:0,z:0});projection.matrix=[...['x','y','z'].flatMap(k=>{const p={x:0,y:0,z:0};p[k]=1;return clip(p).map((v,i)=>v-o[i]);}),...o];
 projection.eye={x:c.x+dist*Math.sin(a)*Math.cos(b),y:c.y+dist*Math.cos(a)*Math.cos(b),z:c.z+dist*Math.sin(b)};projection.perspective=perspective;return projection;`);
 }
 if(file==='src/scene-3d.js')s=once(s,'function render(ctx,w,h,items,edges,project,options={}){',`function render(ctx,w,h,items,edges,project,options={}){
  if(window.Presentation3D?.active()){
   if(Presentation3D.render(ctx,w,h,items,edges,project,{...options,display:state})){Object.assign(stats,Presentation3D.stats);return true;}
   if(options.exactPixels)throw Error('Sunum görüntüsü oluşturulamadı. Çalışma görünümüne geçin veya grafik desteğini kontrol edin.');
  }`);
 if(file==='src/roof.js'){
  s=once(s,"document.getElementById('rainDialog')?.open)return;","document.getElementById('rainDialog')?.open||document.getElementById('presentationDialog')?.open)return;");
  s=once(s,'p=Camera3D.project(sceneCache.points,w,h,fit?','p=Camera3D.project(fit?Presentation3D.framingPoints(sceneCache.points):sceneCache.points,w,h,fit?');
  s=once(s,"    const ctx=out.getContext('2d');if(!ctx)",`    if(p.matrix){project.matrix=p.matrix.map((v,i)=>i%4===0?v*w*scale/out.width:i%4===1?v*h*scale/out.height:v);project.eye=p.eye;project.perspective=p.perspective;}
    const ctx=out.getContext('2d');if(!ctx)`);
  s=once(s,"triangles:Scene3D.stats.triangles};","triangles:Scene3D.stats.triangles,presentation:Presentation3D.active()};");
 }
 return s;
};
