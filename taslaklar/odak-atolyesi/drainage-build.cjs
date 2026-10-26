module.exports=function(file,s,once){
 if(file==='src/scene-3d.js')s=once(s,'if(state.outlines&&!item.foundationSurface','if(state.outlines&&!item.drainage&&!item.foundationSurface');
 if(file==='src/studio.js'){
  s=once(s,'projectName,...(G.image3DLayout','projectName,...(G.rainDrainage?{rainDrainage:clone(G.rainDrainage)}:{}),...(G.image3DLayout');
  s=once(s,'G.image3DLayout=clone(d.image3DLayout||null);','G.rainDrainage=clone(d.rainDrainage||null);G.image3DLayout=clone(d.image3DLayout||null);');
 }
 if(file==='src/project.js')s=once(s,'safeTree(input);','safeTree(input);RainDrainage.validate(input.rainDrainage);');
 if(file==='src/roof.js'){
  s=once(s,'G.foundation,G.paint3D,showWallDetails','G.foundation,G.paint3D,G.rainDrainage,showWallDetails');
  s=once(s,'if(!hideRoof&&!cutaway)items.push(...fasciaSurfaces(m),...soffitSurfaces(m),...trimSurfaces(m));',"if(!hideRoof&&!cutaway){const rain=RainDrainage.mesh(m,G.roofs,C,G.rainDrainage);items.push(...fasciaSurfaces(m),...soffitSurfaces(m),...trimSurfaces(m),...rain.items);if(rain.warnings.length)$('roofHint').textContent+=' · Dere / iniş: '+rain.warnings.join(' ');}");
  s=once(s,"if(!dialog.open||document.getElementById('roofLevelDialog')?.open)return;","if(!dialog.open||document.getElementById('roofLevelDialog')?.open||document.getElementById('rainDialog')?.open)return;");
  s=once(s,"row('Yağmur oluğu','Oluk açık ve parapetsiz bölümlerin saçakları','m',gutter);","rows.push(...RainDrainage.billRows(m,G.roofs,C,G.rainDrainage));");
  s=once(s,"rows.push([],['Veranda profili'","rows.push([],['Yağmur suyu','Ölçü / yerleşim','Birim','Miktar']);RainDrainage.billRows(m,G.roofs,C,G.rainDrainage).forEach(r=>rows.push([r.kalem,r.olcu,r.birim,r.miktar]));rows.push([],['Veranda profili'");
  s=once(s,'Açık saçaklarda oluk hesapla','Açık saçaklarda dere / iniş kullan');
  s=once(s,"const profiles=billRows().filter", "html+='<h3>Yağmur deresi ve inişler</h3><table><tr><th>Parça</th><th>Ölçü / yerleşim</th><th>Miktar</th></tr>'+RainDrainage.billRows(m,G.roofs,C,G.rainDrainage).map(r=>'<tr><td>'+escape(r.kalem)+'</td><td>'+escape(r.olcu)+'</td><td>'+number(r.miktar)+' '+r.birim+'</td></tr>').join('')+'</table>';\n    const profiles=billRows().filter");
 }return s;
};
