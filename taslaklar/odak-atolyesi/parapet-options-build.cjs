module.exports=function(file,s,once){
 const edit=(a,b)=>{s=once(s,a,b);};
 if(file==='src/studio.js'){
  edit('roofMaterials:clone(G.roofMaterials||[]),','roofMaterials:clone(G.roofMaterials||[]),roofAssemblies:clone(G.roofAssemblies||[]),');
  edit('G.roofMaterials=clone(d.roofMaterials||[]);','G.roofMaterials=clone(d.roofMaterials||[]);G.roofAssemblies=clone(d.roofAssemblies||[]);');
 }
 if(file==='src/project.js')edit('if(roofCore)roofCore.validate','ParapetOptions.validate(d.roofAssemblies,d.roofMaterials);if(roofCore)roofCore.validate');
 if(file==='src/roof-core.js'){
  edit("if(!Array.isArray(z.eaves)||", "if(z.soffitFinish!==undefined)ParapetOptions.validateFinish(z.soffitFinish);if(!Array.isArray(z.eaves)||");
  edit('    z.frontClearance=Math.min',`    if(link.followParapet){
      if(link.mode!=='tek'||!parent.parapet)throw Error('Bu veranda için parapeti olan bir ana çatı seçin.');
      // The veranda meets the outer fascia; its supports remain at the plan axes.
      z.d=edge;
      z.h=parent.h+z.pitch*b.eaves[2]/100;
      const crest=zone=>Math.max(...zoneFaces(zone).flatMap(face=>face.poly.map(p=>height(face,p))));
      z.parapet=crest(parent)+parent.parapet-crest(z);
      if(z.parapet<=0||z.parapet>300)throw Error('Veranda eğimini veya ana parapet yüksekliğini düzenleyin. Veranda örtüsü ortak bandın altında kalmalı.');
    }
    z.frontClearance=Math.min`);
  edit("order=['osb','nem','membran'].filter","order=zone.layerOrder==='top-down'?selected.map(l=>l.id).reverse():['osb','nem','membran'].filter");
  edit('out=clip(out,t.a,t.b,t.c+e[0]*L)','out=clip(out,t.a,t.b,t.c+(z.bayEaves?.[i]??e[0])*L)');
  edit('if(z.outline){checkOutline(z.outline);',"if(z.bayEaves&&(!Array.isArray(z.bayEaves)||z.bayEaves.length!==6||!z.bayEaves.every(n=>num(n,0,500))))fail('çokgen saçakları geçersiz');if(z.outline){checkOutline(z.outline);");
 }
 if(file==='src/roof.js'){
  edit("if(commit(()=>G.roofs.push(z))){selected=z.id;action=null;render();fit();}",
   "if(commit(()=>G.roofs.push(z))){window.RoofWorkflow?.cancel();selected=z.id;action=null;render();fit();}");
  edit("const gableMm=Number($('roofDrawGable')?.value??220),sideMm=Number($('roofDrawSide')?.value??300);",`let settings;
    try{settings=ParapetOptions.drawingSettings();}catch(error){notice(error.message,true);return;}
    const {type,pitch,parapet,eave,eaveRule}=settings;
    const ends=eaveRule?eaveRule.gableMm/10:eave;`);
  edit("eaveRule:{gableMm,sideMm},vergeWidth:gableMm,eaves:[gableMm/10,gableMm/10,sideMm/10,sideMm/10],type:$('roofBoundaryType')?.value||'besik',pitch:Number($('roofDrawPitch')?.value||G.opt.egim||33),name:G.roofs.length?'Yeni ana çatı':'Ana çatı'",
   "eaveRule,vergeWidth:eaveRule?.gableMm??220,eaves:[ends,ends,eave,eave],type,pitch,parapet,name:parapet?'Parapet çatı '+(G.roofs.length+1):G.roofs.length?'Yeni ana çatı':'Ana çatı'");
  edit("if(data.get('vergeWidth')==='custom')", "if(next.type==='parapet')next.type=data.get('parapetInner')||z.type;\n    if(data.get('vergeWidth')==='custom')");
  edit(' · ${TYPES[z.type]} · Alt',' · ${z.parapet?\'Parapet çatı · \':\'\'}${TYPES[z.type]} · Alt');
  edit('function billRows(){const m=model(),rows=[],','function billRows(){const m=model(),rows=ParapetOptions.materialRows(G.roofs,C),');
  edit("const profiles=billRows().filter",`const finishes=ParapetOptions.schedule(G.roofs,C);
    if(finishes.length)html+='<h3>Parapet imalatı</h3><table><tr><th>Malzeme</th><th>Bölüm ve kenar</th><th>Net alan</th></tr>'+finishes.map(r=>'<tr><td>'+escape(r.kalem)+'</td><td>'+escape(r.olcu)+'</td><td>'+number(r.miktar,2)+' m²</td></tr>').join('')+'</table>';
    const profiles=billRows().filter`);
  edit("rows.push([],['Veranda profili'",`const finishes=ParapetOptions.schedule(G.roofs,C);
    if(finishes.length){rows.push([],['Parapet imalatı','Bölüm ve kenar','Birim','Net miktar']);finishes.forEach(r=>rows.push([r.kalem,r.olcu,r.birim,r.miktar]));}
    rows.push([],['Veranda profili'`);
  edit("if(z.type!=='besik'||z.sourceRoomId)continue;const base=", "if(z.parapet||z.type!=='besik'||z.sourceRoomId)continue;const base=");
  edit("function edges3D(m){return m.edges.map", "function edges3D(m){return m.edges.filter(e=>!(['verge','eave'].includes(e.type)&&G.roofs.find(z=>z.id===e.zoneId)?.parapet)).map");
  edit("]:planStructure();if(wallModel)","]:ProjectSpecs.facade(planStructure());if(wallModel)");
  edit("Parapet 3B görünümü değiştirir. Altta eğimli çatı bulunur; drenaj ve parapet kaplaması kesim listesine dahil değildir.",
   "Parapet kaplaması ve saçak altı alanları çatı imalat listesinde yer alır.");
  edit('<select id="roofVerandaType">','<select id="roofVerandaType"><option value="tek-parapet">Açık veranda · ana parapeti sürdür</option>');
  edit('<option value="tek">Sundurma · tek eğim','<option selected value="tek">Sundurma · tek eğim');
  edit("choice=$('roofVerandaType').value;", "followParapet=$('roofVerandaType').value==='tek-parapet',choice=followParapet?'tek':$('roofVerandaType').value;");
  edit("(choice==='karga'?'Karga burun':TYPES[choice])","(followParapet?'Parapetli açık veranda':choice==='karga'?'Karga burun':TYPES[choice])");
  edit(':[30,30,30,0];',':(followParapet?[40,40,40,0]:[30,30,30,0]);');
  edit('z.attachment={parentId:parent.id,mode:choice,base','z.attachment={parentId:parent.id,followParapet,mode:choice,base');
  edit("if(z.sourceRoomId){items.push(...verandaStructure(z));return;}","if(z.sourceRoomId)items.push(...verandaStructure(z));");
  const bandStart='if(z.parapet){const poly=C.footprint(z)', start=s.indexOf(bandStart);
  if(start<0)throw Error('Parapet görünüm bağlantısı bulunamadı');
  edit(s.slice(start,s.indexOf('\n',start)).trimEnd(),"if(z.parapet)items.push(...ParapetOptions.band(z,G.roofs,C));");
  edit("Yönler bölümün dönmeden önceki yerel yönleridir. Çokgen çıkmada tüm kenarlar için “Sol” değeri kullanılır.","Çıkma, mesnet sınırından dışarı doğru ölçülür. Duvar dış yüzünden çizilen sınırda 0 cm, cepheyle aynı hizadır.");
 }
 if(file==='src/project-specs.js'){
  edit("if(item.kind!=='wallPanel'&&item.material!=='panel')", "if(!item.parapetBand&&!(item.segmentId&&!item.kind)&&item.kind!=='wallPanel'&&item.material!=='panel')");
  edit("if(!rooms.length||rooms.some(r=>ptInPolygon(c.x,c.y,r)))","if(!item.parapetBand&&(!rooms.length||rooms.some(r=>ptInPolygon(c.x,c.y,r))))");
  edit("const step=Math.max(1,(plakaOlcu()?.en||40)-(G.opt.cephe==='yalipan'?(+G.opt.bindirme||0):0));",
   "const firstWidth=plakaOlcu()?.en||40,step=Math.max(1,firstWidth-(G.opt.cephe==='yalipan'?(+G.opt.bindirme||0):0));");
  edit("for(let z=Math.floor(lo/step)*step;z<hi;z+=step){const poly=clip(clip(item.poly,z,true),z+step,false);",
   `const first=lo<firstWidth?0:1+Math.floor((lo-firstWidth)/step);
   for(let course=first;;course++){
    const z=course===0?0:firstWidth+(course-1)*step;
    if(z>=hi)break;
    const end=course===0?firstWidth:z+step;
    const poly=clip(clip(item.poly,z,true),end,false);`);
  edit("poly,facade:G.opt.cephe,shade:(item.shade||1)*(Math.round(z/step)%2?.97:1)",
   "poly,facade:G.opt.cephe,courseIndex:course,firstFacadeCourse:course===first,shade:item.shade||1");
 }
 if(file==='src/paint-3d.js'){
  edit("return hex?{...item,color:hex,painted:true","if(hex&&item.facade&&item.courseIndex%2)hex=tint(hex,.96);return hex?{...item,color:hex,painted:true");
 }
 if(file==='src/scene-3d.js'){
  edit("prepared={items,outlines:state.outlines,entries,edges:[...edgeMap.values()].filter(e=>e.count===1||e.feature)",
   "const hideJoin=ParapetOptions.flushJoinFilter(items);prepared={items,outlines:state.outlines,entries,edges:[...edgeMap.values()].filter(e=>(e.count===1||e.feature)&&!hideJoin(e.a,e.b))");
 }
 if(file==='src/roof-workflow.js'){
  edit("const eave=+$('roofDrawSide').value/10,eaveRule={gableMm:+$('roofDrawGable').value,sideMm:+$('roofDrawSide').value},h=+G.opt.h||250,pitch=+$('roofDrawPitch').value;",`let settings;
  try{settings=ParapetOptions.drawingSettings();}catch(error){R.notice(error.message,true);return;}
  const h=+G.opt.h||250;`);
  edit("if(!Number.isFinite(eaveRule.gableMm)||eaveRule.gableMm<=0||eaveRule.gableMm>5000||!Number.isFinite(eave)||eave<0||eave>500||!(h>0&&h<=20000)||!(pitch>=1&&pitch<=200))","if(!(h>0&&h<=20000))");
  edit("points:[],eave,eaveRule,h,pitch,type:$('roofBoundaryType').value,","points:[],h,...settings,");
  edit("if(!draft||e.button!==0)return;e.stopImmediatePropagation();e.preventDefault();",
   "if(!draft||e.button!==0)return;e.stopImmediatePropagation();e.preventDefault();cv.tabIndex=-1;cv.focus({preventScroll:true});");
  edit("try{const z=makeOutline(draft.points,draft);","try{if(!draft.openU)Object.assign(draft,ParapetOptions.drawingSettings());const z=makeOutline(draft.points,draft);");
  edit("name:parent?'Yavru çatı '+(G.roofs.length+1):'Ana çatı '+(G.roofs.length+1),x,y,w,d,outline:local",
   "name:(options.parapet?'Parapet çatı':parent?'Yavru çatı':'Ana çatı')+' '+(G.roofs.length+1),parapet:options.parapet??0,x,y,w,d,outline:local");
  edit("let z=R.make({name:'Yavru çatı '+(G.roofs.length+1),type:options.type,",
   "let z=R.make({name:'Yavru çatı '+(G.roofs.length+1),type:options.type,parapet:options.parapet??0,");
  edit("function makeOutline(points,options){","function makeOutline(points,options){\n  if(options.settingsError)throw Error(options.settingsError);");
  edit("'Mesnet sınırı: '+draft.points.length", "(draft.parapet?'Parapet sınırı: ':'Mesnet sınırı: ')+draft.points.length");
  edit('if(!z.eaveRule)return z;', 'if(!z.eaveRule)return z;delete z.bayEaves;');
  edit('\n }\n function apply(z,next,steps,data){','\n  ParapetOptions.mount(z);\n }\n function apply(z,next,steps,data){');
  edit('   applyEaveRule(next);',`   if(data.get('assemblyLayerOrder')==='top-down'||(z.layers||[]).map(l=>l.id).join()!==next.layers.map(l=>l.id).join())next.layerOrder='top-down';
   ParapetOptions.applyEdges(next,data);applyEaveRule(next);`);
  edit('const ok=R.commit(()=>{G.roofs[G.roofs.findIndex(r=>r.id===z.id)]=next;synchronize(previous);});',"const ok=R.commit(()=>{G.roofs[G.roofs.findIndex(r=>r.id===z.id)]=next;ParapetOptions.remember(next,data);synchronize(previous);});");
 }
 return s;
};
