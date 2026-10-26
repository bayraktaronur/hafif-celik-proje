/* Prototype-only controls for the shared model's presentation. */
(function(){
 'use strict';const $=id=>document.getElementById(id);
 const controls=document.createElement('div');controls.id='presentationControls';controls.innerHTML=`<label class="presentation-mode"><span>Görünüm</span><select id="presentationMode" aria-label="3D görünüm stili"><option value="working">Çalışma</option><option value="presentation">Sunum</option></select></label><button id="presentationSettings" type="button" aria-haspopup="dialog">Işık / malzeme</button>`;
 $('roofTheme').before(controls);
 const dialog=document.createElement('dialog');dialog.id='presentationDialog';dialog.setAttribute('aria-labelledby','presentationTitle');dialog.innerHTML=`<header><div><small>AYNI MODEL · YENİ SUNUM</small><h2 id="presentationTitle">Işık ve yüzeyler</h2></div><button type="button" id="presentationClose" aria-label="Kapat">×</button></header><div class="presentation-body"><p>Geometri ve boya seçimlerin korunur. Görünüm, 3D PNG çıktısına da uygulanır.</p><label>Işık<select id="presentationLight"><option value="day">Gündüz · doğal güneş</option><option value="soft">Yumuşak · dengeli aydınlık</option><option value="evening">Akşam · sıcak ışık</option></select></label><label class="presentation-check"><input type="checkbox" id="presentationShadows">Yapı ve zeminde gölgeler</label><label class="presentation-check"><input type="checkbox" id="presentationTextures">Betopan ve beton yüzey dokusu</label><p class="presentation-note">Cam, boyalı metal ve galvaniz yüzeyler ışığa göre görünür. Panel ve birleşim detayları modelde korunur.</p><p id="presentationStatus" role="status"></p></div><footer><button type="button" id="presentationDone">Tamam</button></footer>`;document.body.append(dialog);
 function set(patch){Studio.edit(()=>{G.scenePresentation={...Presentation3D.current(),...patch};});RoofStudio.repaint();sync();}
 function sync(){const v=Presentation3D.current(),visible=document.body.dataset.singleView==='model';controls.hidden=!visible;$('presentationMode').value=v.mode;$('presentationSettings').hidden=v.mode!=='presentation';$('presentationLight').value=v.light;$('presentationShadows').checked=v.shadows;$('presentationTextures').checked=v.textures;
  const error=v.mode==='presentation'?Presentation3D.stats.error:null;$('presentationStatus').textContent=error?'Sunum kullanılamıyor: '+error+' Çalışma görünümü gösteriliyor.':'';controls.title=error||'Aynı kamera ve modelle çalışma / sunum karşılaştırması';controls.dataset.error=error?'true':'false';
  if(!visible&&dialog.open)dialog.close();
 }
 $('presentationMode').onchange=e=>set({mode:e.target.value});$('presentationLight').onchange=e=>set({light:e.target.value});$('presentationShadows').onchange=e=>set({shadows:e.target.checked});$('presentationTextures').onchange=e=>set({textures:e.target.checked});
 $('presentationSettings').onclick=()=>{sync();dialog.showModal();};$('presentationClose').onclick=$('presentationDone').onclick=()=>dialog.close();
 // Escape closes only this small panel, preserving the underlying 3D workspace.
 dialog.addEventListener('keydown',e=>{if(e.key==='Escape')e.stopPropagation();});
 new MutationObserver(sync).observe(document.body,{attributes:true,attributeFilter:['data-single-view']});
 const repaint=RoofStudio.repaint;RoofStudio.repaint=function(...a){const out=repaint.apply(this,a);sync();return out;};
 const draw=window.draw;window.draw=function(...a){const out=draw.apply(this,a);sync();return out;};sync();
})();
