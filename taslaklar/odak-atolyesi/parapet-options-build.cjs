module.exports=function(file,s,once){
 const edit=(a,b)=>{s=once(s,a,b);};
 if(file==='src/studio.js'){
  edit('roofMaterials:clone(G.roofMaterials||[]),','roofMaterials:clone(G.roofMaterials||[]),roofAssemblies:clone(G.roofAssemblies||[]),');
  edit('G.roofMaterials=clone(d.roofMaterials||[]);','G.roofMaterials=clone(d.roofMaterials||[]);G.roofAssemblies=clone(d.roofAssemblies||[]);');
 }
 if(file==='src/project.js')edit('if(roofCore)roofCore.validate','ParapetOptions.validate(d.roofAssemblies,d.roofMaterials);if(roofCore)roofCore.validate');
 if(file==='src/roof-core.js'){
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
 if(file==='src/roof-workflow.js'){
  edit('if(!z.eaveRule)return z;', 'if(!z.eaveRule)return z;delete z.bayEaves;');
  edit('\n }\n function apply(z,next,steps,data){','\n  ParapetOptions.mount(z);\n }\n function apply(z,next,steps,data){');
  edit('   applyEaveRule(next);',`   if(data.get('assemblyLayerOrder')==='top-down'||(z.layers||[]).map(l=>l.id).join()!==next.layers.map(l=>l.id).join())next.layerOrder='top-down';
   ParapetOptions.applyEdges(next,data);applyEaveRule(next);`);
  edit('const ok=R.commit(()=>{G.roofs[G.roofs.findIndex(r=>r.id===z.id)]=next;synchronize(previous);});',"const ok=R.commit(()=>{G.roofs[G.roofs.findIndex(r=>r.id===z.id)]=next;ParapetOptions.remember(next,data);synchronize(previous);});");
 }
 return s;
};
