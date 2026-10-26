module.exports=function(file,s,replaceOnce){
 if(file==='src/wall-3d.js'){
 s=replaceOnce(s,'for(const r of A.runs){const holes=openings(r),models=[];',
  'for(const r of A.runs){const holes=openings(r),models=[];\n  SteelDoor3D.append({r,holes,models,height,prefab,surfaces,parts,warnings,panelColor});');
 s=replaceOnce(s,"if(holes.some(q=>q!==o&&q.b>a&&q.a<b))reasons.push(mesh.width+' cm pano başka açıklıkla çakışıyor');", "if(holes.some(q=>q!==o&&q.b>a&&q.a<b)||models.some(m=>m.o.e.tip_==='kapi'&&m.b>a&&m.a<b))reasons.push(mesh.width+' cm pano başka açıklıkla çakışıyor');");
 }
 return s;
};
