module.exports=function(file,s,once){
 if(file==='src/engine.js'){
  s=once(s,'duvarAlci:o?!!o.duvarAlci:false,','floorFinish:o?.floorFinish?{...o.floorFinish}:undefined,duvarAlci:o?!!o.duvarAlci:false,');
  const start=s.indexOf('    if(isVer){ // hafif çapraz tarama'),end=s.indexOf("    if(!planVisible('rooms')",start);
  if(start<0||end<0)throw Error('Floor hatch draw anchor missing');
  s=s.slice(0,start)+"    if(!window.AreaRegions?.has(room.id))window.FloorHatch?.draw(room);\n"+s.slice(end);
 }
 if(file==='src/area-regions.js')s=once(s,'const offset=drag?.key','window.FloorHatch?.draw(f);const offset=drag?.key');
 if(file==='src/project.js')s=once(s,'safeTree(input);','safeTree(input);window.FloorHatch?.validate(input);');
 if(file==='src/plan-export.js'){
  s=once(s,"if(['veranda','banyo','ebanyo','wc'].includes(room.tip))","if(false)");
  s=once(s,' for(const n of G.nodes){',' for(const e of FloorHatch.exportLines())out.push(e);\n for(const n of G.nodes){');
  s=once(s,'hatch||!e.hatch','hatch||(!e.hatch&&!e.floorHatch)');
  s=s.replace('Banyo / veranda taramaları','Zemin taramaları');
 }
 return s;
};
