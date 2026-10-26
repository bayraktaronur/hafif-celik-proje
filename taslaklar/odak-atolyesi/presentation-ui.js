/* Prototype-only controls for the shared model's presentation. */
(function(){
 'use strict';const $=id=>document.getElementById(id);let pending=null,frame=0,lastOutline=35;
 const controls=document.createElement('div');controls.id='presentationControls';controls.innerHTML=`<label class="presentation-mode"><span>Görünüm</span><select id="presentationMode" aria-label="3D görünüm stili"><option value="working">Çalışma</option><option value="presentation">Sunum</option></select></label><button id="presentationSettings" type="button" aria-haspopup="dialog">Görsel ayarlar</button>`;
 $('roofTheme').before(controls);
 const dialog=document.createElement('dialog');dialog.id='presentationDialog';dialog.setAttribute('aria-labelledby','presentationTitle');dialog.innerHTML=`
 <header><div><small>3D SUNUM</small><h2 id="presentationTitle">Görsel ayarlar</h2></div><button type="button" id="presentationClose" aria-label="Kapat">×</button></header>
 <div class="presentation-body">
  <p>Görünüm ayarları 3D sahneye ve PNG çıktısına birlikte uygulanır.</p>
  <section class="presentation-edges"><label for="presentationOutlines">Kenar çizgileri <output id="presentationOutlineValue" for="presentationOutlines">%35</output></label>
   <input id="presentationOutlines" type="range" min="0" max="100" step="1" value="35" aria-label="Kenar çizgisi belirginliği">
   <div class="presentation-range-labels"><span>0 · Yumuşak</span><span>100 · Belirgin</span></div>
   <div class="presentation-presets" aria-label="Kenar çizgisi hazır ayarları"><button data-outline="0">Kapalı</button><button data-outline="35">Hafif · 35</button><button data-outline="65">Belirgin · 65</button></div>
  </section>
  <label>Işık<select id="presentationLight"><option value="day">Gündüz · doğal güneş</option><option value="soft">Yumuşak · dengeli aydınlık</option><option value="evening">Akşam · sıcak ışık</option></select></label>
  <label class="presentation-check"><input type="checkbox" id="presentationShadows">Yapı ve zeminde gölgeler</label>
  <label class="presentation-check"><input type="checkbox" id="presentationTextures">Betopan ve beton yüzey dokusu</label>
  <p class="presentation-note">Kenar çizgileri yalnız görünüşü değiştirir. Panel, H ve köşe birleşimleri modelde korunur.</p><p id="presentationStatus" role="status"></p>
 </div><footer><button type="button" id="presentationDone">Tamam</button></footer>`;document.body.append(dialog);
 function set(patch){Studio.edit(()=>{G.scenePresentation={...Presentation3D.current(),...patch};});RoofStudio.repaint();sync();}
 function commitOutline(){if(pending===null)return;const value=pending;pending=null;cancelAnimationFrame(frame);frame=0;Presentation3D.previewOutline(null);set({outlines:value});}
 function sync(){const v=Presentation3D.current(),visible=document.body.dataset.singleView==='model';controls.hidden=!visible;$('presentationMode').value=v.mode;$('presentationSettings').hidden=v.mode!=='presentation';$('presentationLight').value=v.light;$('presentationShadows').checked=v.shadows;$('presentationTextures').checked=v.textures;
  $('presentationOutlines').value=v.outlines;$('presentationOutlineValue').textContent='%'+v.outlines;$('presentationOutlines').setAttribute('aria-valuetext','Yüzde '+v.outlines);dialog.querySelectorAll('[data-outline]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.outline)===v.outlines)));
  if(v.outlines>0)lastOutline=v.outlines;
  $('roofContours').setAttribute('aria-pressed',String(v.mode==='presentation'?v.outlines>0:Scene3D.state.outlines));$('roofContours').title=v.mode==='presentation'?'Kenar çizgileri · %'+v.outlines+' · Görsel ayarlardan düzenle':'Kenarları göster / gizle';
  const error=v.mode==='presentation'?Presentation3D.stats.error:null;$('presentationStatus').textContent=error?'Sunum kullanılamıyor: '+error+' Çalışma görünümü gösteriliyor.':'';controls.title=error||'Aynı kamera ve modelle çalışma / sunum karşılaştırması';controls.dataset.error=error?'true':'false';
  if(!visible&&dialog.open)dialog.close();
 }
 $('presentationOutlines').oninput=e=>{pending=Number(e.target.value);Presentation3D.previewOutline(pending);sync();if(!frame)frame=requestAnimationFrame(()=>{frame=0;RoofStudio.repaint();});};
 $('presentationOutlines').onchange=commitOutline;
 dialog.querySelectorAll('[data-outline]').forEach(b=>b.onclick=()=>{commitOutline();set({outlines:Number(b.dataset.outline)});});
 $('presentationMode').onchange=e=>{commitOutline();set({mode:e.target.value});};$('presentationLight').onchange=e=>set({light:e.target.value});$('presentationShadows').onchange=e=>set({shadows:e.target.checked});$('presentationTextures').onchange=e=>set({textures:e.target.checked});
 const toggle=$('roofContours').onclick;$('roofContours').onclick=e=>{if(Presentation3D.active())set({outlines:Presentation3D.current().outlines?0:lastOutline});else toggle(e);sync();};
 $('presentationSettings').onclick=()=>{sync();dialog.showModal();};$('presentationClose').onclick=$('presentationDone').onclick=()=>dialog.close();dialog.addEventListener('close',commitOutline);
 dialog.addEventListener('keydown',e=>{if(e.key==='Escape')e.stopPropagation();});
 new MutationObserver(sync).observe(document.body,{attributes:true,attributeFilter:['data-single-view']});
 const repaint=RoofStudio.repaint;RoofStudio.repaint=function(...a){const out=repaint.apply(this,a);sync();return out;};
 const draw=window.draw;window.draw=function(...a){const out=draw.apply(this,a);sync();return out;};sync();
})();
