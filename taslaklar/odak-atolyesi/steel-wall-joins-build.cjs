module.exports=function(file,s,once){
 if(file!=='src/wall-3d.js')return s;
 s=once(s,'surfaces.push({...meta,poly:poly.map(p=>({...p,z:z1})),color,shade:1});',"if(meta.steelSolid)surfaces.push({...meta,poly:poly.slice().reverse().map(p=>({...p,z:z0})),color,shade:.78});surfaces.push({...meta,poly:poly.map(p=>({...p,z:z1})),color,shade:1});");
 s=once(s,' function openings(r){',' const steelJoins=prefab?null:SteelWallJoins.build(G.nodes,G.segs);\n function openings(r){');
 s=once(s,'if(core==null)rect(r,l,u,-t/2,t/2,lo,hi,panelColor,meta);else{',`if(!prefab){const footprint=SteelWallJoins.cell(steelJoins.get(r.owner.id),r,l,u,p.b);if(footprint.length>=3)box(footprint,lo,hi,panelColor,{...meta,steelSolid:true});}else if(core==null)rect(r,l,u,-t/2,t/2,lo,hi,panelColor,meta);else{`);
 s=once(s,'return {surfaces:window.ProjectSpecs?ProjectSpecs.facade(surfaces):surfaces,parts,warnings:[...warnings]};','const visible=prefab?surfaces:SteelWallJoins.exterior(surfaces);return {surfaces:window.ProjectSpecs?ProjectSpecs.facade(visible):visible,parts,warnings:[...warnings]};');
 return s;
};
