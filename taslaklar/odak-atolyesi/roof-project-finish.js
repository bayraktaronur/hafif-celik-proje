/* Shared project finish controls. Uses existing options, paint record and history. */
(function(){
 'use strict';const $=id=>document.getElementById(id);
 const palette=[['','Kaplamanın standart rengi',''],['RAL 3009','Kırmızı · RAL 3009','#6d342d'],['RAL 7016','Antrasit · RAL 7016','#383e42'],['RAL 9016','Beyaz · RAL 9016','#f1f0ea'],['GALVANIZ','Galvaniz','#a8afb3']];
 function colorLabel(){const c=G.paint3D?.roof;return c?[c.code,c.name].filter(Boolean).join(' · '):'';}
 function description(){return [...new Set((G.roofs||[]).map(z=>RoofCore.MATERIALS.concat(G.roofMaterials||[]).find(m=>m.id===z.material)?.name||z.material))].join(' / ')+(colorLabel()?' · '+colorLabel():'');}
 function apply({material,width,color}){
  if(!['trapez','sandvic'].includes(material))throw Error('Desteklenen proje kaplamasını seçin.');
  const m=RoofCore.MATERIALS.find(m=>m.id===material),w=Number(width),saved=G.paint3D?.roof,entry=palette.find(p=>p[0]===color)||(saved?.code===color?[saved.code,saved.name,saved.hex]:null);
  if(!m.widths.includes(w)||!entry)throw Error('Geçerli kaplama eni ve renk seçin.');
  if(G.opt.kaplama===material&&+G.opt.trapezEn===w&&G.roofs.every(z=>z.material===material&&z.width===w)&&(G.paint3D?.roof?.code||'')===color)return true;
  const ok=Studio.edit(()=>{G.opt.kaplama=material;G.opt.trapezEn=w;ProjectSpecs.propagate('kaplama');
   G.paint3D={...(G.paint3D||{})};if(entry[0])G.paint3D.roof={code:entry[0],name:entry[1].split(' · ')[0],hex:entry[2]};else delete G.paint3D.roof;
   RoofCore.validate(G.roofs,G.roofMaterials);RoofCore.calculate(G.roofs,G.roofMaterials,!!G.opt.osb);
  });if(ok){ProjectSpecs.render();RoofStudio.render();sync();}return ok;
 }
 const box=document.createElement('section');box.id='roofProjectFinish';box.style.cssText='padding:20px;border-bottom:1px solid #344750';
 box.innerHTML='<h3 style="margin-top:0">Çatı kaplaması ve rengi</h3><p>Tüm proje · ana çatı ve verandalar</p><label style="display:grid;gap:6px">Kaplama<select id="finishMaterial"><option value="trapez">27/200 Trapez sac</option><option value="sandvic">Sandviç panel</option></select></label><label style="display:grid;gap:6px;margin-top:12px">Net kapatma eni<select id="finishWidth"></select></label><label style="display:grid;gap:6px;margin-top:12px">Çatı rengi<select id="finishColor"></select></label><button id="finishApply" type="button" style="width:100%;margin-top:16px">Tüm çatılara uygula</button><p id="finishStatus" role="status" style="line-height:1.5">2B, 3B, metraj ve çıktılar aynı proje bilgisini kullanır. Renk, boy ve adedi değiştirmez.</p>';
 $('roof-panel-model').querySelector('header').after(box);
 for(const el of box.querySelectorAll('select,button'))el.style.cssText+=';min-height:44px;padding:8px;border:1px solid #66858e;border-radius:6px;background:#1e303b;color:#e6f0f2;font:inherit;max-width:100%';
 function widths(value){const m=RoofCore.MATERIALS.find(m=>m.id===$('finishMaterial').value);$('finishWidth').replaceChildren(...m.widths.map(w=>new Option(w+' cm',w)));$('finishWidth').value=String(m.widths.includes(+value)?+value:m.widths.at(-1));}
 function sync(){if(box.contains(document.activeElement))return;$('finishMaterial').value=G.opt.kaplama;widths(G.opt.trapezEn);$('finishColor').replaceChildren(...palette.map(p=>new Option(p[1],p[0])));const color=G.paint3D?.roof;if(color&&!palette.some(p=>p[0]===color.code))$('finishColor').add(new Option(colorLabel(),color.code));$('finishColor').value=color?.code||'';}
 $('finishMaterial').onchange=()=>widths(100);
 $('finishApply').onclick=()=>{try{const ok=apply({material:$('finishMaterial').value,width:+$('finishWidth').value,color:$('finishColor').value});$('finishStatus').textContent=ok?'Projenin tüm çatıları güncellendi. Kaydetme ve geri alma ortak proje üzerinden çalışır.':'Değişiklik uygulanamadı; önceki proje korundu.';}catch(e){$('finishStatus').textContent=e.message;}};
 new MutationObserver(sync).observe($('roofProperties'),{childList:true});
 window.RoofProjectFinish={apply,colorLabel,description,sync};sync();
})();
