/* Local GPU presentation renderer. Reuses exact scene polygons; no model edits or external assets. */
(function(){
 'use strict';
 const defaults={mode:'working',light:'day',shadows:true,textures:true};
 const presets={day:{sun:[-.5,.65,.85],key:1.02,ambient:.52,warm:[1.02,1,.96]},soft:{sun:[-.3,.4,.9],key:.65,ambient:.76,warm:[1,1,1]},evening:{sun:[-.8,.4,.4],key:.9,ambient:.55,warm:[1.12,.96,.78]}};
 const canvas=document.createElement('canvas');let gl,program,depthProgram,shadow,cache,lost=false,shadowKey='',initError='';
 const stats={backend:'webgl',view:'presentation',uploads:0,shadowBuilds:0};
 // G is a script lexical binding rather than window.G in the existing engine.
 const current=()=>({...defaults,...(typeof G!=='undefined'?G.scenePresentation:null)});
 function validate(v){if(v==null)return;if(!v||typeof v!=='object'||!['working','presentation'].includes(v.mode)||!presets[v.light]||typeof v.shadows!=='boolean'||typeof v.textures!=='boolean')throw Error('Geçersiz 3D sunum ayarı.');}
 const active=()=>current().mode==='presentation';
 const unit=v=>{const n=Math.hypot(...v)||1;return v.map(x=>x/n);},dot=(a,b)=>a.reduce((s,v,i)=>s+v*b[i],0),cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
 const rgb=hex=>[1,3,5].map(i=>parseInt((hex||'#a0a0a0').slice(i,i+2),16)/255);
 function normal(poly){const a=poly[0];for(let i=1;i<poly.length-1;i++){const b=poly[i],c=poly[i+1],n=cross([b.x-a.x,b.y-a.y,b.z-a.z],[c.x-a.x,c.y-a.y,c.z-a.z]);if(Math.hypot(...n)>1e-7)return unit(n);}return [0,0,1];}
 function material(item){
  if(item.material==='glass'||item.alpha<1)return [4,.12,0];
  if(item.kind?.startsWith('foundation'))return [2,.93,0];
  if(item.roof||['ridgeCap','vergeTrim','vergeBottom','gableOmega'].includes(item.kind))return [3,.38,.25];
  if(item.kind?.startsWith('rain'))return [3,.3,.1];
  if(item.material==='panel'||item.painted||['wallPanel','wall','cladding','hCover','canopyCladding'].includes(item.kind))return [1,.87,0];
  if(item.kind==='wallJoint')return [3,.4,.5];
  return [0,.52,.12];
 }
 const vertexShader=`attribute vec3 position;attribute vec3 normal;attribute vec3 color;attribute vec3 surface;
 uniform mat4 camera;uniform mat4 lightMatrix;varying vec3 world;varying vec3 n;varying vec3 base;varying vec3 mat;varying vec4 shadowCoord;
 void main(){world=position;n=normal;base=color;mat=surface;shadowCoord=lightMatrix*vec4(position,1.0);gl_Position=camera*vec4(position,1.0);}`;
 const fragmentShader=`precision highp float;
 varying vec3 world;varying vec3 n;varying vec3 base;varying vec3 mat;varying vec4 shadowCoord;
 uniform sampler2D shadowMap;uniform vec3 sun;uniform vec3 eye;uniform vec3 viewDirection;uniform vec3 warm;uniform vec3 groundColor;
 uniform float perspective;uniform float keyLight;uniform float ambient;uniform float useShadow;uniform float textures;uniform float shadowSize;uniform float linePass;uniform float darkGround;
 float noise(vec3 p){return fract(sin(dot(p,vec3(12.9898,78.233,37.719)))*43758.5453);}
 float readDepth(vec2 uv){vec4 c=texture2D(shadowMap,uv);return dot(c,vec4(1.0,1.0/255.0,1.0/65025.0,1.0/16581375.0));}
 float visibility(vec3 N){if(useShadow<.5)return 1.0;vec3 q=shadowCoord.xyz/shadowCoord.w*.5+.5;if(q.x<0.0||q.x>1.0||q.y<0.0||q.y>1.0||q.z<0.0||q.z>1.0)return 1.0;
 float bias=.00065;float v=0.0;vec2 gradient=vec2(0.0);
 #ifdef RECEIVER_GRADIENT
 vec3 dx=dFdx(q),dy=dFdy(q);float det=dx.x*dy.y-dx.y*dy.x;
 if(abs(det)>1e-12)gradient=vec2(dy.y*dx.z-dx.y*dy.z,dx.x*dy.z-dy.x*dx.z)/det;
 #else
 bias=.002+.003*(1.0-abs(dot(N,sun)));
 #endif
 float blur=clamp((q.z-readDepth(q.xy))*shadowSize*.12,1.0,7.0);
 for(int x=-2;x<=2;x++)for(int y=-2;y<=2;y++){vec2 offset=vec2(float(x),float(y))*blur/shadowSize;vec2 uv=q.xy+offset;
 // Compare on the receiver plane, including the sampled texel centre. This avoids stripes on sloped faces.
 vec2 texel=(floor(uv*shadowSize)+.5)/shadowSize;float depth=readDepth(uv);v+=step(q.z+dot(gradient,texel-q.xy)-bias,depth);}return v/25.0;}
 void main(){
  if(linePass>.5){gl_FragColor=vec4(base,1.0);return;}
  vec3 V=normalize(mix(viewDirection,eye-world,perspective));vec3 N=normalize(n);if(dot(N,V)<0.0)N=-N;
  float vis=visibility(N),nd=max(dot(N,sun),0.0),rough=mat.y,metal=mat.z;
  if(mat.x>4.5){float sh=(1.0-vis)*.23;vec3 c=groundColor*mix(vec3(1.0),vec3(.72,.78,.84),sh*3.0);gl_FragColor=vec4(c,1.0);return;}
  vec3 albedo=pow(base,vec3(2.2));float grain=1.0;
  if(textures>.5){float a=noise(floor(world*2.0)),b=noise(floor(world*.18));if(mat.x>.5&&mat.x<1.5)grain=.985+.03*a;if(mat.x>1.5&&mat.x<2.5)grain=.92+.10*b+.04*a;}
  float sky=.5+.5*N.z;vec3 hemi=mix(vec3(.8,.77,.73),vec3(.88,.94,1.04),sky)*ambient;
  vec3 diffuse=albedo*grain*(hemi+warm*keyLight*nd*(.28+.72*vis));
  vec3 H=normalize(sun+V);float gloss=mix(180.0,8.0,rough);vec3 f0=mix(vec3(.035),albedo,metal);
  vec3 spec=f0*pow(max(dot(N,H),0.0),gloss)*(1.0-rough*.65)*keyLight*vis;
  vec3 c=diffuse+spec;
  if(mat.x>3.5&&mat.x<4.5){float fres=.10+.60*pow(1.0-max(dot(N,V),0.0),5.0);vec3 R=reflect(-V,N);float skyLine=smoothstep(-.3,.65,R.z);vec3 env=mix(vec3(.25,.29,.28),vec3(.74,.83,.88),skyLine);float cloud=pow(max(0.0,sin(R.x*4.0+R.z*3.0)),7.0)*.12;env+=cloud;vec3 glass=mix(base*.66,env,.45+fres*.45);gl_FragColor=vec4(glass,.42+fres*.35);return;}
  c=pow(max(c,vec3(0.0)),vec3(1.0/2.2));gl_FragColor=vec4(clamp(c,0.0,1.0),1.0);
 }`;
 const depthVertex='attribute vec3 position;uniform mat4 lightMatrix;void main(){gl_Position=lightMatrix*vec4(position,1.0);}';
 const depthFragment=`precision highp float;void main(){vec4 v=fract(gl_FragCoord.z*vec4(1.0,255.0,65025.0,16581375.0));v-=v.yzww*vec4(1.0/255.0,1.0/255.0,1.0/255.0,0.0);gl_FragColor=v;}`;
 function makeProgram(v,f){const p=gl.createProgram();for(const [type,src]of [[gl.VERTEX_SHADER,v],[gl.FRAGMENT_SHADER,f]]){const s=gl.createShader(type);gl.shaderSource(s,src);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(s));gl.attachShader(p,s);gl.deleteShader(s);}gl.linkProgram(p);if(!gl.getProgramParameter(p,gl.LINK_STATUS))throw Error(gl.getProgramInfoLog(p));return p;}
 function init(){if(lost)return false;if(initError)throw Error(initError);if(program&&shadow)return true;gl=canvas.getContext('webgl',{antialias:true,alpha:false,preserveDrawingBuffer:true});if(!gl)throw Error('Sunum için WebGL kullanılamıyor. Çalışma görünümü açık.');
  try{const derivatives=gl.getExtension('OES_standard_derivatives');
  program=makeProgram(vertexShader,(derivatives?'#extension GL_OES_standard_derivatives : enable\n#define RECEIVER_GRADIENT\n':'')+fragmentShader);depthProgram=makeProgram(depthVertex,depthFragment);
  const size=Math.min(2048,gl.getParameter(gl.MAX_TEXTURE_SIZE),gl.getParameter(gl.MAX_RENDERBUFFER_SIZE)),texture=gl.createTexture(),frame=gl.createFramebuffer(),depth=gl.createRenderbuffer();
  gl.bindTexture(gl.TEXTURE_2D,texture);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,size,size,0,gl.RGBA,gl.UNSIGNED_BYTE,null);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.NEAREST);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.NEAREST);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
  gl.bindFramebuffer(gl.FRAMEBUFFER,frame);gl.framebufferTexture2D(gl.FRAMEBUFFER,gl.COLOR_ATTACHMENT0,gl.TEXTURE_2D,texture,0);gl.bindRenderbuffer(gl.RENDERBUFFER,depth);gl.renderbufferStorage(gl.RENDERBUFFER,gl.DEPTH_COMPONENT16,size,size);gl.framebufferRenderbuffer(gl.FRAMEBUFFER,gl.DEPTH_ATTACHMENT,gl.RENDERBUFFER,depth);
  if(gl.checkFramebufferStatus(gl.FRAMEBUFFER)!==gl.FRAMEBUFFER_COMPLETE)throw Error('Gölge belleği açılamadı.');gl.bindFramebuffer(gl.FRAMEBUFFER,null);shadow={size,texture,frame,depth};return true;
  }catch(e){initError=e.message;throw e;}
 }
 canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();lost=true;stats.error='3D grafik bağlantısı kesildi.';});
 canvas.addEventListener('webglcontextrestored',()=>{gl=null;program=null;shadow=null;cache=null;shadowKey='';initError='';lost=false;window.RoofStudio?.repaint();});
 const upload=data=>{const b=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,b);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(data),gl.STATIC_DRAW);return {buffer:b,count:data.length/12};};
 function release(){if(!cache)return;for(const name of ['opaque','glass','ground','lines','grid'])gl.deleteBuffer(cache[name].buffer);cache=null;}
 function prepare(items,edges){if(cache?.items===items&&cache?.edges===edges)return cache;release();const opaque=[],glass=[],edgeMap=new Map(),lines=[],bounds={x0:Infinity,y0:Infinity,z0:Infinity,x1:-Infinity,y1:-Infinity,z1:-Infinity};
  const vertex=(arr,p,n,c,m)=>arr.push(p.x,p.y,p.z,...n,...c,...m),key=p=>[p.x,p.y,p.z].map(v=>Math.round(v*1000)).join(',');
  const groups=[];
  for(const item of items){const n=normal(item.poly),c=rgb(item.color),m=material(item),arr=m[0]===4?glass:opaque,start=arr.length/12;
   for(const p of item.poly)for(const k of ['x','y','z']){bounds[k+'0']=Math.min(bounds[k+'0'],p[k]);bounds[k+'1']=Math.max(bounds[k+'1'],p[k]);}
   for(let j=1;j<item.poly.length-1;j++)for(const p of [item.poly[0],item.poly[j],item.poly[j+1]])vertex(arr,p,n,c,m);
   if(m[0]===4)groups.push({start,count:arr.length/12-start,center:item.poly.reduce((s,p)=>s.map((v,i)=>v+[p.x,p.y,p.z][i]/item.poly.length),[0,0,0])});
   // All physical profiles remain as surfaces. Only redundant tessellation edges are omitted.
   if(!item.roof&&!item.drainage&&item.material!=='glass'&&item.material!=='panel'&&!['openingMark','wallPanel','ridgeCap','vergeTrim','vergeBottom','soffit','cladding'].includes(item.kind))for(let i=0;i<item.poly.length;i++){const a=item.poly[i],b=item.poly[(i+1)%item.poly.length],ka=key(a),kb=key(b);if(ka===kb)continue;const k=ka<kb?ka+'|'+kb:kb+'|'+ka,old=edgeMap.get(k);if(old){old.count++;if(Math.abs(dot(old.n,n))<.94||old.color!==item.color)old.feature=true;}else edgeMap.set(k,{a,b,n,color:item.color,count:1});}
  }
  for(const e of edgeMap.values())if(e.count===1||e.feature){const color=rgb(e.color).map(v=>v*.58);for(const p of [e.a,e.b])vertex(lines,p,[0,0,1],color,[0,1,0]);}
  for(const e of edges)for(const p of [e.p,e.q])vertex(lines,p,[0,0,1],rgb(e.color||'#8e979c').map(v=>v*.85),[0,1,0]);
  if(!items.length)Object.assign(bounds,{x0:0,y0:0,z0:0,x1:100,y1:100,z1:100});
  const span=Math.max(500,bounds.x1-bounds.x0,bounds.y1-bounds.y0),ground=[],z=Math.min(0,bounds.z0)-.12,x=bounds.x0-span*3,y=bounds.y0-span*3,X=bounds.x1+span*3,Y=bounds.y1+span*3;
  for(const p of [{x,y,z},{x:X,y,z},{x:X,y:Y,z},{x,y,z},{x:X,y:Y,z},{x,y:Y,z}])vertex(ground,p,[0,0,1],[1,1,1],[5,1,0]);
  const grid=[];for(let x=Math.floor((bounds.x0-300)/100)*100;x<=bounds.x1+300;x+=100)for(const y of [bounds.y0-300,bounds.y1+300])vertex(grid,{x,y,z:z+.03},[0,0,1],[.79,.81,.83],[0,1,0]);
  for(let y=Math.floor((bounds.y0-300)/100)*100;y<=bounds.y1+300;y+=100)for(const x of [bounds.x0-300,bounds.x1+300])vertex(grid,{x,y,z:z+.03},[0,0,1],[.79,.81,.83],[0,1,0]);
  cache={items,edges,bounds,opaque:upload(opaque),glass:upload(glass),lines:upload(lines),ground:upload(ground),grid:upload(grid),groups};shadowKey='';stats.uploads++;stats.triangles=(opaque.length+glass.length)/36;stats.lines=lines.length/24;return cache;
 }
 function lightMatrix(bounds,sun){const z=unit(sun),x=unit(cross([0,0,1],z)),y=cross(z,x),center=[(bounds.x0+bounds.x1)/2,(bounds.y0+bounds.y1)/2,(bounds.z0+bounds.z1)/2];let extent=[0,0,0];
  const ground=Math.min(0,bounds.z0)-.12;
  for(const a of [bounds.x0,bounds.x1])for(const b of [bounds.y0,bounds.y1])for(const c of [ground,bounds.z1])for(const p of [[a,b,c],[a-(c-ground)*sun[0]/sun[2],b-(c-ground)*sun[1]/sun[2],ground]]){const v=p.map((v,i)=>v-center[i]);[x,y,z].forEach((k,i)=>extent[i]=Math.max(extent[i],Math.abs(dot(k,v))));}
  extent=extent.map(v=>v+80);const rows=[x.map(v=>v/extent[0]),y.map(v=>v/extent[1]),z.map(v=>-v/extent[2])],m=[];for(let c=0;c<3;c++)m.push(rows[0][c],rows[1][c],rows[2][c],0);m.push(...rows.map(r=>-dot(r,center)),1);return m;
 }
 function bind(prog,b,depthOnly=false){gl.bindBuffer(gl.ARRAY_BUFFER,b.buffer);for(const [name,off]of [['position',0],['normal',12],['color',24],['surface',36]]){const at=gl.getAttribLocation(prog,name);if(at<0)continue;gl.enableVertexAttribArray(at);gl.vertexAttribPointer(at,3,gl.FLOAT,false,48,off);} }
 function render(ctx,w,h,items,edges,project,options={}){const t=performance.now();try{
  if(!project.matrix)throw Error('Ortak kamera dönüşümü bulunamadı.');if(!init())return false;const cfg=current(),preset=presets[cfg.light],data=prepare(items,edges),sun=unit(preset.sun),lm=lightMatrix(data.bounds,sun),limit=Math.min(4096,gl.getParameter(gl.MAX_RENDERBUFFER_SIZE),...gl.getParameter(gl.MAX_VIEWPORT_DIMS)),ratio=options.exactPixels?1:Math.min(2,Math.max(1,devicePixelRatio||1)),cw=Math.round(w*ratio),ch=Math.round(h*ratio);
  if(options.exactPixels&&(w>limit||h>limit))throw Error('Bu cihaz seçilen PNG boyutunu desteklemiyor.');
  if(canvas.width!==Math.min(limit,cw)||canvas.height!==Math.min(limit,ch)){canvas.width=Math.min(limit,cw);canvas.height=Math.min(limit,ch);}gl.enable(gl.DEPTH_TEST);gl.depthFunc(gl.LEQUAL);gl.disable(gl.CULL_FACE);gl.disable(gl.BLEND);gl.depthMask(true);
  if(cfg.shadows&&shadowKey!==cfg.light){gl.bindFramebuffer(gl.FRAMEBUFFER,shadow.frame);gl.viewport(0,0,shadow.size,shadow.size);gl.clearColor(1,1,1,1);gl.clearDepth(1);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);gl.useProgram(depthProgram);gl.uniformMatrix4fv(gl.getUniformLocation(depthProgram,'lightMatrix'),false,new Float32Array(lm));bind(depthProgram,data.opaque,true);gl.drawArrays(gl.TRIANGLES,0,data.opaque.count);shadowKey=cfg.light;stats.shadowBuilds++;}
  gl.bindFramebuffer(gl.FRAMEBUFFER,null);gl.viewport(0,0,canvas.width,canvas.height);const dark=options.background==='dark'||(!options.background&&options.display?.theme==='dark'),bg=dark?[.085,.11,.14]:options.background==='white'?[1,1,1]:[.955,.956,.948];gl.clearColor(...bg,1);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);gl.useProgram(program);
  const matrix=(name,v)=>gl.uniformMatrix4fv(gl.getUniformLocation(program,name),false,new Float32Array(v)),vec=(name,v)=>gl.uniform3fv(gl.getUniformLocation(program,name),v),num=(name,v)=>gl.uniform1f(gl.getUniformLocation(program,name),v);
  matrix('camera',project.matrix);matrix('lightMatrix',lm);vec('sun',sun);vec('warm',preset.warm);vec('eye',Object.values(project.eye));const yaw=Camera3D.state.yaw*Math.PI/180,pitch=Camera3D.state.pitch*Math.PI/180;vec('viewDirection',[Math.sin(yaw)*Math.cos(pitch),Math.cos(yaw)*Math.cos(pitch),Math.sin(pitch)]);num('perspective',project.perspective?1:0);vec('groundColor',bg);num('darkGround',dark?1:0);num('keyLight',preset.key);num('ambient',preset.ambient);num('useShadow',cfg.shadows?1:0);num('textures',cfg.textures?1:0);num('shadowSize',shadow.size);num('linePass',0);gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,shadow.texture);gl.uniform1i(gl.getUniformLocation(program,'shadowMap'),0);
  bind(program,data.ground);gl.drawArrays(gl.TRIANGLES,0,data.ground.count);gl.enable(gl.POLYGON_OFFSET_FILL);gl.polygonOffset(1,1);bind(program,data.opaque);gl.drawArrays(gl.TRIANGLES,0,data.opaque.count);gl.disable(gl.POLYGON_OFFSET_FILL);
  if(options.display?.outlines){num('linePass',1);bind(program,data.lines);gl.drawArrays(gl.LINES,0,data.lines.count);num('linePass',0);}
  if(options.display?.grid){num('linePass',1);bind(program,data.grid);gl.drawArrays(gl.LINES,0,data.grid.count);num('linePass',0);}
  gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);gl.depthMask(false);bind(program,data.glass);const view=[Math.sin(yaw)*Math.cos(pitch),Math.cos(yaw)*Math.cos(pitch),Math.sin(pitch)];for(const g of data.groups.slice().sort((a,b)=>dot(a.center,view)-dot(b.center,view)))gl.drawArrays(gl.TRIANGLES,g.start,g.count);gl.depthMask(true);gl.disable(gl.BLEND);
  ctx.drawImage(canvas,0,0,w,h);Object.assign(stats,{backend:'webgl',view:'presentation',width:canvas.width,height:canvas.height,antialias:gl.getContextAttributes().antialias,ms:performance.now()-t,error:null});return true;
 }catch(e){stats.error=e.message;return false;}}
 function framingPoints(points){if(!active()||!current().shadows||!points.length)return points;const sun=presets[current().light].sun,z=points.reduce((v,p)=>Math.min(v,p.z),0)-.12;return [...points,...points.map(p=>({x:p.x-(p.z-z)*sun[0]/sun[2],y:p.y-(p.z-z)*sun[1]/sun[2],z}))];}
 window.Presentation3D={render,active,current,validate,defaults,presets,stats,framingPoints};
})();
