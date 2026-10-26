/* 3D presentation settings. No geometry, manufacturing or pricing state is changed. */
(function(){
 'use strict';
 const defaults={width:3840,height:2160,frame:'fit',background:'white',grid:false};
 let dialog,frame=0,busy=false;const $=id=>document.getElementById(id);
 function validate(v){if(v==null)return;if(typeof v!=='object'||!Number.isInteger(v.width)||!Number.isInteger(v.height)||Math.min(v.width,v.height)<256||Math.max(v.width,v.height)>4096)throw Error('Görsel boyutları 256–4096 piksel arasında tam sayı olmalı.');if(!['fit','current'].includes(v.frame)||!['white','light','dark'].includes(v.background)||typeof v.grid!=='boolean')throw Error('Geçersiz 3D çıktı ayarı.');}
 function read(){const v={width:Number($('image3DWidth').value),height:Number($('image3DHeight').value),frame:$('image3DFrame').value,background:$('image3DBackground').value,grid:$('image3DGrid').checked};validate(v);return v;}
 function status(text,error=false){$('image3DStatus').textContent=text;$('image3DStatus').dataset.error=error?'true':'false';}
 function preview(){if(!dialog.open||busy)return;try{const v=read(),cv=$('image3DPreview'),k=Math.min(900/v.width,600/v.height);cv.width=Math.round(v.width*k);cv.height=Math.round(v.height*k);RoofStudio.renderImage(cv,v);$('image3DSize').textContent=v.width.toLocaleString('tr')+' × '+v.height.toLocaleString('tr')+' px · '+(v.width*v.height/1e6).toFixed(1)+' MP';status('Önizleme · PNG, seçilen çözünürlükte yeniden çizilir.');$('image3DDownload').disabled=false;}catch(e){status(e.message,true);$('image3DDownload').disabled=true;}}
 function schedule(){cancelAnimationFrame(frame);frame=requestAnimationFrame(preview);}
 function init(){if(dialog)return;dialog=document.createElement('dialog');dialog.id='image3DDialog';dialog.setAttribute('aria-labelledby','image3DTitle');dialog.innerHTML=`
  <header><div><small>SUNUM / GÖRSEL ÇIKTI</small><h2 id="image3DTitle">3D PNG çıktısı</h2></div><button type="button" id="image3DClose" aria-label="Kapat">×</button></header>
  <div class="image3d-body"><section class="image3d-controls">
   <label>Çözünürlük<select id="image3DPreset"><option value="3840,2160">4K · 3840 × 2160</option><option value="2560,1440">2K · 2560 × 1440</option><option value="1920,1080">Full HD · 1920 × 1080</option><option value="custom">Özel boyut</option></select></label>
   <div class="image3d-pair"><label>En · px<input id="image3DWidth" type="number" min="256" max="4096" step="1"></label><label>Boy · px<input id="image3DHeight" type="number" min="256" max="4096" step="1"></label></div>
   <label>Kadraj<select id="image3DFrame"><option value="fit">Yapının tamamını sığdır</option><option value="current">Ekrandaki kadrajı koru</option></select></label>
   <p>Bakış açısı korunur. Ekrandaki kadrajı seçersen yakınlaştırma ve kaydırma da korunur.</p>
   <label>Arka plan<select id="image3DBackground"><option value="white">Beyaz</option><option value="light">Açık gri</option><option value="dark">Koyu</option></select></label>
   <label class="image3d-check"><input id="image3DGrid" type="checkbox">Zemin ızgarasını göster</label>
  </section><section class="image3d-preview"><div class="image3d-canvas"><canvas id="image3DPreview" aria-label="PNG kadraj önizlemesi"></canvas></div><strong id="image3DSize"></strong><p id="image3DStatus" role="status" aria-live="polite"></p></section></div>
  <footer><span>Yalnız 3D yapı görünümü</span><button type="button" id="image3DCancel">Vazgeç</button><button type="button" id="image3DDownload" class="primary">PNG indir</button></footer>`;
  document.body.append(dialog);$('image3DClose').onclick=$('image3DCancel').onclick=()=>dialog.close();dialog.addEventListener('cancel',e=>{if(busy)e.preventDefault();});dialog.addEventListener('close',()=>{cancelAnimationFrame(frame);RoofStudio.repaint();});
  $('image3DPreset').onchange=()=>{const v=$('image3DPreset').value;if(v!=='custom'){const [w,h]=v.split(',');$('image3DWidth').value=w;$('image3DHeight').value=h;}schedule();};
  for(const id of ['image3DWidth','image3DHeight'])$(id).oninput=()=>{$('image3DPreset').value='custom';schedule();};
  for(const id of ['image3DFrame','image3DBackground','image3DGrid'])$(id).onchange=schedule;
  $('image3DDownload').onclick=download;
 }
 async function download(){if(busy)return;let out;try{const v=read();busy=true;dialog.setAttribute('aria-busy','true');dialog.querySelectorAll('input,select,button').forEach(el=>el.disabled=true);status('PNG hazırlanıyor…');await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));out=document.createElement('canvas');out.width=v.width;out.height=v.height;const result=RoofStudio.renderImage(out,v);const blob=await new Promise((resolve,reject)=>out.toBlob(b=>b?resolve(b):reject(Error('PNG oluşturulamadı. Daha küçük çözünürlük deneyin.')),'image/png'));
   const name=(Studio.state().projectName||'proje').replace(/[<>:"/\\|?*\x00-\x1f]/g,'_').slice(0,80),a=document.createElement('a'),url=URL.createObjectURL(blob);a.href=url;a.download=name+'_3D_'+v.width+'x'+v.height+'.png';a.click();setTimeout(()=>URL.revokeObjectURL(url),30000);
   Studio.edit(()=>{G.image3DLayout={...v};});SceneImageOutput.lastExport={...result,bytes:blob.size};status('PNG hazır · '+v.width+' × '+v.height+' piksel');
  }catch(e){status(e.message,true);}finally{if(out){out.width=out.height=1;}busy=false;dialog.removeAttribute('aria-busy');dialog.querySelectorAll('input,select,button').forEach(el=>el.disabled=false);RoofStudio.repaint();}}
 function open(){init();const v={...defaults,...G.image3DLayout};validate(v);$('image3DWidth').value=v.width;$('image3DHeight').value=v.height;const preset=v.width+','+v.height;$('image3DPreset').value=['3840,2160','2560,1440','1920,1080'].includes(preset)?preset:'custom';$('image3DFrame').value=v.frame;$('image3DBackground').value=v.background;$('image3DGrid').checked=v.grid;dialog.showModal();schedule();}
 window.SceneImageOutput={open,validate,defaults};
})();
