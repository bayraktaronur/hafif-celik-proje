module.exports=function(file,s,once){
 if(file==='src/roof.js'){
  s=once(s,"$('roofReport').innerHTML=html;","$('roofReport').innerHTML=(G.paint3D?.roof?'<p>Çatı rengi: '+escape(G.paint3D.roof.code)+' · '+escape(G.paint3D.roof.name)+'</p>':'')+html;");
  s=once(s,'ctx.fillStyle=mat.color;ctx.fill();','ctx.fillStyle=roofColor(z.id);ctx.fill();');
  s=once(s,"m.totals.forEach(t=>{if(t.unit==='sheet')row(","m.totals.forEach(t=>{t={...t,name:t.name+(G.paint3D?.roof?' · '+G.paint3D.roof.code:'')};if(t.unit==='sheet')row(");
  s=once(s,"rows=[['Çatı kaplama metrajı','Birim','Miktar','Net alan m²','Sipariş alanı m²']]","rows=[...(G.paint3D?.roof?[[\"Çatı rengi\",G.paint3D.roof.code,G.paint3D.roof.name]]:[]),['Çatı kaplama metrajı','Birim','Miktar','Net alan m²','Sipariş alanı m²']]");
 }
 if(file==='src/paint-3d.js')s=s.replaceAll('refresh();RoofStudio.repaint();','refresh();RoofStudio.repaint();window.RoofProjectFinish?.sync();');
 if(file==='src/loading-ui.js'){
  s=once(s,"function calculate(){return LoadingCore.build(items(),G.loading);}","function calculate(){return {...LoadingCore.build(items(),G.loading),roofFinish:window.RoofProjectFinish?.description()||''};}");
  s=s.replaceAll('project:Studio.state().projectName,version:',"project:Studio.state().projectName+(G.paint3D?.roof?' · Çatı: '+G.paint3D.roof.code:''),version:");
  s=once(s,"$('loadAlert').textContent=(!isPref()", "$('loadSummary').textContent+=' · Çatı: '+report.roofFinish;\n  $('loadAlert').textContent=(!isPref()");
 }
 return s;
};
