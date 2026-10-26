// Prototype-only render caching. Geometry/state changes invalidate the complete scene.
module.exports=function(file,s,once){
 if(file==='src/roof.js'){
  s=once(s,'let selected=null,','let sceneCache=null,sceneKeyCache="",paintFrame=0;const sceneStats={builds:0,hits:0};\n  function cameraPaint(){if(!paintFrame)paintFrame=requestAnimationFrame(()=>{paintFrame=0;paint();});}\n  let selected=null,');
  s=once(s,'if(window.Paint3D)items=Paint3D.decorate(items);','if(window.Paint3D&&items!==sceneCache?.items)items=Paint3D.decorate(items);');
  const start=s.indexOf('      const wallModel=(showWallDetails'),end=s.indexOf('      renderScene3D(ctx,w,h,scene.items,scene.edges,project);',start);
  if(start<0||end<0)throw Error('3D scene build anchor changed');
  let build=s.slice(start,end);const marker="      Camera3D.state.yaw=angle;const scene=FoundationData.compose(";if(!build.includes(marker))throw Error('Foundation compose anchor changed');
  build=build.replace(marker,'      scene=FoundationData.compose(');
  const camera=',project=Camera3D.project(scene.items.flatMap(i=>i.poly),w,h);';if(!build.includes(camera))throw Error('Camera anchor changed');build=build.replace(camera,';');
  s=s.slice(0,start)+`      const sceneKey=JSON.stringify([G.sistem,G.nodes,G.segs,G.elemanlar,G.rooms,G.opt,G.catiYon,G.roofs,G.roofMaterials,G.foundation,G.paint3D,showWallDetails,hideRoof,cutaway,showStrips,selected,$('roofLayoutLayer').value]);
      let scene;if(sceneCache&&sceneKey===sceneKeyCache){scene=sceneCache;sceneStats.hits++;}else{
${build}
       if(window.Paint3D)scene.items=Paint3D.decorate(scene.items);scene.points=scene.items.flatMap(i=>i.poly);scene.hint=$('roofHint').textContent;sceneCache=scene;sceneKeyCache=sceneKey;sceneStats.builds++;
      }
      $('roofHint').textContent=scene.hint;Camera3D.state.yaw=angle;const project=Camera3D.project(scene.points,w,h);
`+s.slice(end);
  s=once(s,"$('roofCamera').value=angle;}paint();return;}hover=world(e)","$('roofCamera').value=angle;}cameraPaint();return;}hover=world(e)");
  s=once(s,'Camera3D.state.zoom*Math.exp(-e.deltaY*.001)));paint();return;', 'Camera3D.state.zoom*Math.exp(-e.deltaY*.001)));cameraPaint();return;');
  s=once(s,"$('roofCamera').oninput=e=>{angle=+e.target.value;paint();};","$('roofCamera').oninput=e=>{angle=+e.target.value;cameraPaint();};");
  s=once(s,'window.RoofStudio={verandaBase,','window.RoofStudio={sceneStats,verandaBase,');
 }
 if(file==='src/scene-3d.js'){
  s=once(s,"const state={theme:'light'","let prepared=null;\n const state={theme:'light'");
  const start=s.indexOf('   // Roof seams are supplied explicitly;'),end=s.indexOf('\n  }\n  if(state.grid',start);if(start<0||end<0)throw Error('Scene feature-edge anchor changed');
  let feature=s.slice(start,end).replace('a:pts[i],b:pts[(i+1)%pts.length]','a,b');s=s.slice(0,start)+s.slice(end);
  const prepare=`
 function prepare(items){
  if(prepared?.items===items&&prepared.outlines===state.outlines)return prepared;
  let x0=Infinity,y0=Infinity,x1=-Infinity,y1=-Infinity;const edgeMap=new Map();
  const entries=items.map(item=>{const n=normal(item.poly),base=rgb(item.color);for(const p of item.poly){x0=Math.min(x0,p.x);x1=Math.max(x1,p.x);y0=Math.min(y0,p.y);y1=Math.max(y1,p.y);}
${feature}
   return {item,n,base};});
  prepared={items,outlines:state.outlines,entries,edges:[...edgeMap.values()].filter(e=>e.count===1||e.feature),x0,y0,x1,y1};return prepared;
 }
`;
  s=once(s,' function render(ctx,w,h,items,edges,project){',prepare+' function render(ctx,w,h,items,edges,project){');
  s=once(s,'let near=-Infinity,far=Infinity,x0=Infinity,y0=Infinity,x1=-Infinity,y1=-Infinity;','let near=-Infinity,far=Infinity;const preparedScene=prepare(items),{x0,y0,x1,y1}=preparedScene;');
  s=once(s,'const projected=items.map(item=>{const pts=item.poly.map(p=>{x0=Math.min(x0,p.x);x1=Math.max(x1,p.x);y0=Math.min(y0,p.y);y1=Math.max(y1,p.y);const q=project(p);near=Math.max(near,q.depth);far=Math.min(far,q.depth);return q;});return {item,pts,n:normal(item.poly)};});','const projected=preparedScene.entries.map(({item,n,base})=>{const pts=item.poly.map(p=>{const q=project(p);near=Math.max(near,q.depth);far=Math.min(far,q.depth);return q;});return {item,pts,n,base};});');
  s=once(s,'const opaque=[],glass=[],edgeMap=new Map(),lineData=[];','const opaque=[],glass=[],lineData=[];');
  s=once(s,'for(const {item,pts,n} of projected){\n   const base=rgb(item.color),diff=', 'for(const {item,pts,n,base} of projected){\n   const diff=');
  s=once(s,'for(const e of edgeMap.values())if(e.count===1||e.feature){','for(const e of preparedScene.edges){');
  s=once(s,'vertex(lineData,e.a,stroke,1e-6);vertex(lineData,e.b,stroke,1e-6);','vertex(lineData,project(e.a),stroke,1e-6);vertex(lineData,project(e.b),stroke,1e-6);');
 }
 return s;
};
