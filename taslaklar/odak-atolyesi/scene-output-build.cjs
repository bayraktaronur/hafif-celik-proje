// Presentation/export hooks for the independent prototype only.
module.exports=function(file,s,once){
 if(file==='src/studio.js'){
  s=once(s,'projectName,...(G.foundation','projectName,...(G.image3DLayout?{image3DLayout:clone(G.image3DLayout)}:{}),...(G.foundation');
  s=once(s,'G.foundation=clone(d.foundation||null);','G.image3DLayout=clone(d.image3DLayout||null);G.foundation=clone(d.foundation||null);');
 }
 if(file==='src/project.js')s=once(s,'safeTree(input);','safeTree(input);SceneImageOutput.validate(input.image3DLayout);');
 if(file==='src/camera-3d.js'){
  s=once(s,'function project(points,w,h){','function project(points,w,h,options={}){');
  s=once(s,'(w-100)/Math.max(100,right-left),(h-160)/Math.max(100,down-up)','(w-(options.padding?.[0]??100))/Math.max(100,right-left),(h-(options.padding?.[1]??160))/Math.max(100,down-up)');
  s=once(s,')*.9*state.zoom',')*(options.fill??.9)*state.zoom');
 }
 if(file==='src/wall-3d.js'){
  s=once(s,"glass?'#6b9da9':'#ae9680',meta);","glass?'#728083':'#ae9680',glass?{...meta,material:'glass',alpha:.32}:meta);");
 }
 if(file==='src/paint-3d.js')s=once(s,'let hex;const wall=',"if(item.material==='glass')return {...item,color:'#728083',alpha:.32};let hex;const wall=");
 if(file==='src/scene-3d.js'){
  s=once(s,"attribute vec3 p; attribute vec4 c; varying vec4 color; void main(){gl_Position=vec4(p,1.0);color=c;}","attribute vec3 p; attribute vec4 c; attribute vec3 g; varying vec4 color; varying vec3 glaze; void main(){gl_Position=vec4(p,1.0);color=c;glaze=g;}");
  s=once(s,"precision mediump float; varying vec4 color; void main(){gl_FragColor=color;}","precision mediump float; varying vec4 color; varying vec3 glaze; void main(){vec4 col=color;if(glaze.z>0.5){float sky=smoothstep(0.0,1.1,glaze.x);float band=1.0-smoothstep(0.0,0.22,abs(fract(glaze.y)-0.5));col.rgb=mix(col.rgb,vec3(0.86,0.89,0.90),0.10*sky+0.12*band); }gl_FragColor=col;}");
  s=once(s,'function render(ctx,w,h,items,edges,project){','function render(ctx,w,h,items,edges,project,options={}){');
  s=once(s,'ratio=Math.min(2,Math.max(1.5,devicePixelRatio||1))','ratio=options.exactPixels?1:Math.min(2,Math.max(1.5,devicePixelRatio||1))');
  s=once(s,'if(canvas.width!==cw||canvas.height!==ch)',"const limit=Math.min(gl.getParameter(gl.MAX_RENDERBUFFER_SIZE),gl.getParameter(gl.MAX_TEXTURE_SIZE),...gl.getParameter(gl.MAX_VIEWPORT_DIMS));if(options.exactPixels&&(cw!==w||ch!==h||w>limit||h>limit))throw Error('Bu cihaz seçilen PNG boyutunu desteklemiyor. Daha küçük çözünürlük seçin.');\n  if(canvas.width!==cw||canvas.height!==ch)");
  s=once(s,"[['p',3,0],['c',4,12]]","[['p',3,0],['c',4,12],['g',3,28]]");
  s=once(s,'gl.FLOAT,false,28,offset','gl.FLOAT,false,40,offset');
  s=once(s,"bg=light?[.965,.972,.98]:[.051,.09,.133]","bg=options.background==='white'?[1,1,1]:light?[.965,.972,.98]:[.051,.09,.133]");
  s=once(s,'const vertex=(arr,p,color,bias=0)=>','const vertex=(arr,p,color,bias=0,glaze=[0,0,0])=>');
  s=once(s,'range-bias,...color);','range-bias,...color,...glaze);');
  s=once(s,'arr.length/7','arr.length/10');
  s=once(s,'reflection=.08+.35*Math.pow(1-facing,5);color=[...base.map(v=>v*(1-reflection)+reflection),Math.min(.7,color[3]+reflection*.4)]','reflection=.10+.30*Math.pow(1-facing,5);color=[...base.map((v,i)=>v*(1-reflection)+[.77,.81,.83][i]*reflection),Math.min(.64,color[3]+reflection*.45)]');
  s=once(s,'glass.push({tri,color,depth:tri.reduce((s,p)=>s+p.depth,0)/3})',"glass.push({tri,color,glaze:[item.poly[0],item.poly[j],item.poly[j+1]].map(p=>[p.z/300,(p.x*n[1]-p.y*n[0])/450+p.z/900+Camera3D.state.yaw/720,1]),depth:tri.reduce((s,p)=>s+p.depth,0)/3})");
  s=once(s,'g.tri.forEach(p=>vertex(transparent,p,g.color))','g.tri.forEach((p,i)=>vertex(transparent,p,g.color,0,g.glaze[i]))');
  s=once(s,'opaque.length/21+glass.length,lines:lineData.length/14','opaque.length/30+glass.length,lines:lineData.length/20');
 }
 if(file==='src/roof.js'){
  // Use the cached full scene and a scaled camera projection, never enlarge a screen bitmap.
  const fn=`
  function renderImage(out,options){
   if(mode!=='3d')throw Error('PNG sunumu için 3D görünümünü açın.');
   paint();if(!sceneCache?.items.length)throw Error('Çıktı alınacak yapı bulunamadı.');
   const camera={...Camera3D.state},display={...Scene3D.state};
   try{
    const rect=$('roofCanvas').getBoundingClientRect(),fit=options.frame==='fit',w=fit?960*Math.max(1,out.width/out.height):Math.max(1,rect.width),h=fit?960*Math.max(1,out.height/out.width):Math.max(1,rect.height);
    if(fit){Camera3D.state.zoom=1;Camera3D.state.panX=Camera3D.state.panY=0;}
    Scene3D.state.theme=options.background==='dark'?'dark':'light';Scene3D.state.grid=options.grid;
    const scale=Math.min(out.width/w,out.height/h),dx=(out.width-w*scale)/2,dy=(out.height-h*scale)/2,p=Camera3D.project(sceneCache.points,w,h,fit?{padding:[64,64],fill:.96}:{}),project=v=>{const q=p(v);return {...q,x:dx+q.x*scale,y:dy+q.y*scale};};
    const ctx=out.getContext('2d');if(!ctx)throw Error('PNG tuvali oluşturulamadı.');
    if(!Scene3D.render(ctx,out.width,out.height,sceneCache.items,sceneCache.edges,project,{exactPixels:true,background:options.background}))throw Error('Yüksek çözünürlüklü çıktı için 3D grafik desteği kullanılamıyor.');
    let x=Infinity,y=Infinity,X=-Infinity,Y=-Infinity;for(const v of sceneCache.points){const q=project(v);x=Math.min(x,q.x);y=Math.min(y,q.y);X=Math.max(X,q.x);Y=Math.max(Y,q.y);}
    return {width:out.width,height:out.height,bounds:{x,y,X,Y},triangles:Scene3D.stats.triangles};
   }finally{Object.assign(Camera3D.state,camera);Object.assign(Scene3D.state,display);}
  }
`;
  s=once(s,'window.RoofStudio={sceneStats,',fn.trimStart()+'  window.RoofStudio={renderImage,sceneStats,');
  s=once(s,"$('roofPNG').onclick=()=>{if(mode==='report')","$('roofPNG').title='PNG çıktı ayarları · 3D için 4K';$('roofPNG').onclick=()=>{if(mode==='3d'){SceneImageOutput.open();return;}if(mode==='report')");
 }
 return s;
};
