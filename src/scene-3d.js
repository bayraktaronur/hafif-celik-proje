/* GPU presentation adapter. Input manufacturing surfaces are never changed. */
(function(){
 'use strict';
 const canvas=document.createElement('canvas');let gl,program,buffer,lost=false;
 const state={theme:'light',outlines:true,grid:true},stats={backend:'uninitialized'};
 canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();lost=true;stats.backend='fallback';});
 canvas.addEventListener('webglcontextrestored',()=>{gl=null;lost=false;window.RoofStudio?.repaint();});
 function init(){
  if(lost)return false;if(gl)return true;
  gl=canvas.getContext('webgl',{antialias:true,alpha:false,preserveDrawingBuffer:true});if(!gl)return false;
  const shader=(type,source)=>{const s=gl.createShader(type);gl.shaderSource(s,source);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(s));return s;};
  program=gl.createProgram();
  gl.attachShader(program,shader(gl.VERTEX_SHADER,'attribute vec3 p; attribute vec4 c; varying vec4 color; void main(){gl_Position=vec4(p,1.0);color=c;}'));
  gl.attachShader(program,shader(gl.FRAGMENT_SHADER,'precision mediump float; varying vec4 color; void main(){gl_FragColor=color;}'));
  gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error('3B program could not link');buffer=gl.createBuffer();return true;
 }
 const rgb=hex=>[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16)/255);
 function normal(poly){const a=poly[0];for(let i=1;i<poly.length-1;i++){const b=poly[i],c=poly[i+1],u=[b.x-a.x,b.y-a.y,b.z-a.z],v=[c.x-a.x,c.y-a.y,c.z-a.z],n=[u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0]],l=Math.hypot(...n);if(l>1e-8)return n.map(x=>x/l);}return [0,0,1];}
 function render(ctx,w,h,items,edges,project){
  try{if(!init())return false;}catch(e){stats.error=e.message;return false;}
  const start=performance.now(),ratio=Math.min(2,Math.max(1.5,devicePixelRatio||1)),cw=Math.min(4096,Math.ceil(w*ratio)),ch=Math.min(4096,Math.ceil(h*ratio));
  if(canvas.width!==cw||canvas.height!==ch){canvas.width=cw;canvas.height=ch;}
  gl.viewport(0,0,cw,ch);gl.useProgram(program);gl.bindBuffer(gl.ARRAY_BUFFER,buffer);
  for(const [name,size,offset] of [['p',3,0],['c',4,12]]){const a=gl.getAttribLocation(program,name);gl.enableVertexAttribArray(a);gl.vertexAttribPointer(a,size,gl.FLOAT,false,28,offset);}
  const light=state.theme==='light',bg=light?[.965,.972,.98]:[.051,.09,.133];gl.clearColor(...bg,1);gl.clearDepth(1);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);gl.enable(gl.DEPTH_TEST);gl.depthFunc(gl.LEQUAL);gl.disable(gl.CULL_FACE);
  let near=-Infinity,far=Infinity,x0=Infinity,y0=Infinity,x1=-Infinity,y1=-Infinity;
  const projected=items.map(item=>{const pts=item.poly.map(p=>{x0=Math.min(x0,p.x);x1=Math.max(x1,p.x);y0=Math.min(y0,p.y);y1=Math.max(y1,p.y);const q=project(p);near=Math.max(near,q.depth);far=Math.min(far,q.depth);return q;});return {item,pts,n:normal(item.poly)};});
  if(!items.length){ctx.drawImage(canvas,0,0,w,h);return true;}
  const span=Math.max(1,near-far),pad=span*2,range=span+2*pad;
  const vertex=(arr,p,color,bias=0)=>arr.push(p.x/w*2-1,1-p.y/h*2,1-2*(p.depth-far+pad)/range-bias,...color);
  const batch=(arr,mode)=>{if(!arr.length)return;gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(arr),gl.DYNAMIC_DRAW);gl.drawArrays(mode,0,arr.length/7);};
  const opaque=[],glass=[],edgeMap=new Map(),lineData=[];
  for(const {item,pts,n} of projected){
   const base=rgb(item.color),diff=Math.abs(n[0]*.36+n[1]*-.48+n[2]*.8),shade=.60+.35*diff+.05*Math.abs(n[2]);
   const metallic=item.kind==='wallJoint'||item.kind==='gableOmega',highlight=metallic?.07*Math.pow(diff,12):0;
   let color=[...base.map(v=>Math.min(1,v*shade+highlight)),item.alpha??1];
   if(color[3]<1){const yaw=Camera3D.state.yaw*Math.PI/180,pitch=Camera3D.state.pitch*Math.PI/180,view=[Math.sin(yaw)*Math.cos(pitch),Math.cos(yaw)*Math.cos(pitch),Math.sin(pitch)],facing=Math.abs(n.reduce((sum,v,i)=>sum+v*view[i],0)),reflection=.08+.35*Math.pow(1-facing,5);color=[...base.map(v=>v*(1-reflection)+reflection),Math.min(.7,color[3]+reflection*.4)];}
   for(let j=1;j<pts.length-1;j++){const tri=[pts[0],pts[j],pts[j+1]];if(color[3]<1)glass.push({tri,color,depth:tri.reduce((s,p)=>s+p.depth,0)/3});else tri.forEach(p=>vertex(opaque,p,color));}
   // Roof seams are supplied explicitly; panel patch boundaries are not physical joints.
   if(state.outlines&&!item.roof&&item.material!=='panel'&&item.material!=='glass'&&!['openingMark','wallPanel','ridgeCap','vergeTrim','vergeBottom','soffit','cladding'].includes(item.kind)){
    item.poly.forEach((a,i)=>{const b=item.poly[(i+1)%item.poly.length],keyPoint=p=>[p.x,p.y,p.z].map(v=>Math.round(v*1000)).join(','),ka=keyPoint(a),kb=keyPoint(b);if(ka===kb)return;const key=ka<kb?ka+'|'+kb:kb+'|'+ka,old=edgeMap.get(key);if(old){old.count++;if(Math.abs(old.n.reduce((s,v,j)=>s+v*n[j],0))<.94||old.color!==item.color)old.feature=true;}else edgeMap.set(key,{a:pts[i],b:pts[(i+1)%pts.length],n,color:item.color,count:1,feature:false});});
   }
  }
  if(state.grid&&Number.isFinite(x0)){
   const grid=[],margin=300,step=100,gcolor=light?[.83,.86,.89,1]:[.16,.22,.29,1];
   const xa=Math.floor((x0-margin)/step)*step,xb=Math.ceil((x1+margin)/step)*step,ya=Math.floor((y0-margin)/step)*step,yb=Math.ceil((y1+margin)/step)*step;
   for(let x=xa;x<=xb;x+=step){vertex(grid,project({x,y:ya,z:-.5}),gcolor);vertex(grid,project({x,y:yb,z:-.5}),gcolor);}
   for(let y=ya;y<=yb;y+=step){vertex(grid,project({x:xa,y,z:-.5}),gcolor);vertex(grid,project({x:xb,y,z:-.5}),gcolor);}batch(grid,gl.LINES);
  }
  gl.enable(gl.POLYGON_OFFSET_FILL);gl.polygonOffset(1,1);batch(opaque,gl.TRIANGLES);gl.disable(gl.POLYGON_OFFSET_FILL);
  const ink=light?[.19,.23,.27,1]:[.10,.14,.18,1];
  for(const e of edgeMap.values())if(e.count===1||e.feature){vertex(lineData,e.a,ink,1e-6);vertex(lineData,e.b,ink,1e-6);}
  // Explicit roof seams use the same depth test as the solid model.
  for(const e of edges){const color=[...rgb(e.color||'#73838c'),1];vertex(lineData,project(e.p),color,1e-6);vertex(lineData,project(e.q),color,1e-6);}
  gl.lineWidth(1);batch(lineData,gl.LINES);
  glass.sort((a,b)=>a.depth-b.depth);const transparent=[];for(const g of glass)g.tri.forEach(p=>vertex(transparent,p,g.color));
  gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);gl.depthMask(false);batch(transparent,gl.TRIANGLES);gl.depthMask(true);gl.disable(gl.BLEND);
  ctx.drawImage(canvas,0,0,w,h);
  Object.assign(stats,{backend:'webgl',antialias:gl.getContextAttributes().antialias,width:cw,height:ch,triangles:opaque.length/21+glass.length,lines:lineData.length/14,ms:performance.now()-start});return true;
 }
 window.Scene3D={render,state,stats};
})();
