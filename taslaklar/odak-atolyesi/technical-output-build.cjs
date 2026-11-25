module.exports=function(source){
 const patch=(a,b)=>{if(source.split(a).length!==2)throw Error('Technical output anchor changed: '+a);source=source.replace(a,b);};
 patch("if(window.Presentation3D?.active()){", "if(!options.technical&&window.Presentation3D?.active()){");
 patch("if(color[3]<1){const yaw=Camera3D", "if(options.technical)color=[1,1,1,1];\n   if(color[3]<1){const yaw=Camera3D");
 patch("const stroke=e.edgeColor?[...rgb(e.edgeColor),1]:ink;", "const stroke=options.technical?[0,0,0,1]:e.edgeColor?[...rgb(e.edgeColor),1]:ink;");
 patch("const color=[...rgb(e.color||'#73838c'),1];", "const color=options.technical?[0,0,0,1]:[...rgb(e.color||'#73838c'),1];");
 patch("const ink=light?[.19,.23,.27,1]:[.10,.14,.18,1];", "const ink=light?[.19,.23,.27,1]:[.10,.14,.18,1];\n  if(options.technical)for(const {item,pts} of projected){if(item.kind==='wallPanel'||item.material==='panel')for(let i=0;i<pts.length;i++){const a=item.poly[i],b=item.poly[(i+1)%pts.length];if(Math.abs(a.z-b.z)>.001 && Math.hypot(a.x-b.x,a.y-b.y)>.001)continue;vertex(lineData,pts[i],[0,0,0,1],1e-6);vertex(lineData,pts[(i+1)%pts.length],[0,0,0,1],1e-6);}}");
 patch("background:options.background,lineScale:scale}", "background:options.background,lineScale:scale,technical:!!options.technical}");
 return source;
};
