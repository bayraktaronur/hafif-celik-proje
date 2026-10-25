/* DEV-154: independent reference window and calibrated plan underlays. */
(function(){
 'use strict';
 const C=ReferenceImageData,$=id=>document.getElementById(id),clone=o=>JSON.parse(JSON.stringify(o));
 let selected=null,mode=null,drag=null,points=[],hover=null,preview=null,signature='',importing=false;
 let view={s:1,x:0,y:0},viewDrag=null;const cache=new Map();
 const panel=document.createElement('section');panel.id='referencePanel';panel.hidden=true;panel.setAttribute('aria-label','Referans görseller');
 panel.innerHTML=`<header><div><small>ÇİZİM YARDIMCISI</small><strong>Referans görsel</strong></div><button id="refClose" aria-label="Referans panelini kapat">×</button></header>
 <div class="ref-body"><div class="ref-import"><button id="refImport">＋ PNG / JPG aç</button><button id="refPaste">Panodan yapıştır</button></div>
 <p class="ref-help">Görseli sürükleyip bırak veya <kbd>Ctrl+V</kbd> ile yapıştır.</p>
 <label>Referanslar <select id="refList" aria-label="Referans seç"></select></label>
 <div id="refViewport" tabindex="0"><img id="refImage" draggable="false" hidden><span id="refEmpty">Planını buraya ekle.<br>Arkasından duvarları çiz.</span></div>
 <div class="ref-preview-tools"><span>Önizleme · tekerlekle yakınlaş</span><button id="refPreviewFit">Sığdır</button></div>
 <div id="refControls" hidden>
 <div class="ref-segment"><button id="refScene">Plana yerleştir</button><button id="refWindow">Ayrı pencerede bak</button></div>
 <label>Görünürlük <span><input id="refVisible" type="checkbox"> Göster</span></label>
 <label>Opaklık <span id="refOpacityValue"></span><input id="refOpacity" type="range" min="5" max="100" step="5"></label>
 <div class="ref-actions"><button id="refCalibrate">İki noktayla ölçekle</button><button id="refFit">Görsele git</button></div>
 <div class="ref-actions"><button id="refMove">Taşı</button><button id="refLock">Kilidi aç</button></div>
 <details><summary>Ölçü ve konum · cm</summary><div class="ref-fields"><label>Genişlik<input id="refWidth" type="number" min="1" max="1000000" step="any"></label><label>Döndür · °<input id="refAngle" type="number" min="-360" max="360" step="any"></label><label>X<input id="refX" type="number" step="any"></label><label>Y<input id="refY" type="number" step="any"></label></div><button id="refApply">Ölçü ve konumu uygula</button><small>En/boy oranı korunur. Ölçekleme yalnız görseli değiştirir.</small></details>
 <button id="refRemove" class="ref-remove">Seçili görseli kaldır</button></div>
 <p id="refStatus" role="status">Referanslar bu taslağın JSON dosyasıyla birlikte kaydedilir.</p></div>
 <input id="refFile" type="file" accept="image/png,image/jpeg,.png,.jpg,.jpeg" hidden>`;
 document.body.append(panel);
 const button=document.createElement('button');button.id='referenceToggle';button.className='t';button.textContent='▧ Referans';button.title='Referans plan / PNG, JPG ve panodan görsel';
 document.querySelector('.tool-ribbon').insertBefore(button,document.querySelector('.single-primary-tools'));
 button.onclick=()=>{panel.hidden=!panel.hidden;if(!panel.hidden){sync(true);clamp();fitPreview();}};
 const strip=document.createElement('div');strip.id='refInteraction';strip.hidden=true;strip.innerHTML='<span></span><button type="button">Bitir · Esc</button>';cwrap.append(strip);strip.lastElementChild.onclick=cancel;
 const dlg=document.createElement('dialog');dlg.id='refScaleDialog';dlg.innerHTML='<form><h2>Gerçek ölçüyü gir</h2><p>Seçtiğin iki nokta arasındaki mesafe.</p><label>Uzunluk · cm<input id="refLength" type="number" min="0.01" step="any" required autofocus></label><div><button type="button" id="refScaleCancel">Vazgeç</button><button type="submit">Ölçeği uygula</button></div></form>';document.body.append(dlg);
 const list=()=>G.referenceImages||[],current=()=>list().find(r=>r.id===selected),say=(text,error=false)=>{$('refStatus').textContent=text;if(error)Studio.toast(text,true);};
 const editable=e=>/INPUT|TEXTAREA|SELECT/.test(e.target?.tagName)||e.target?.isContentEditable;
 const blocked=()=>document.querySelector('dialog[open],.mbg.open')||document.body.dataset.singleView!=='plan';
 function stop(e){e.preventDefault();e.stopImmediatePropagation();}
 function clamp(){panel.style.left=Math.max(8,Math.min(parseFloat(panel.style.left)||innerWidth-panel.offsetWidth-18,innerWidth-panel.offsetWidth-8))+'px';panel.style.top=Math.max(8,Math.min(parseFloat(panel.style.top)||180,innerHeight-panel.offsetHeight-8))+'px';}
 function show(){SingleStorey.show('plan');panel.hidden=false;sync(true);clamp();}
 function image(r){let entry=cache.get(r.id);const data=r.chunks.join('');if(!entry||entry.data!==data){const im=new Image();entry={im,data};cache.set(r.id,entry);im.onload=()=>{draw();if(r.id===selected)fitPreview();};im.src=data;}return entry.im;}
 function commit(fn){cancel();const ok=Studio.edit(()=>{fn();C.validate(G.referenceImages);},{preserveLayout:true});signature='';sync(true);if(ok&&!Studio.flush())say('Görsel eklendi; otomatik yedek dolu. Kaydet ile JSON dosyasını indir.',true);return ok;}
 function change(patch){const id=selected;return commit(()=>{const r=list().find(r=>r.id===id);if(r)Object.assign(r,patch);});}
 function sync(force=false){
  const items=list();if(!items.some(r=>r.id===selected)){selected=items[0]?.id||null;cancel();}
  const sig=JSON.stringify(items.map(({chunks,...r})=>r));if(!force&&sig===signature)return;signature=sig;
  const r=current();$('refList').replaceChildren();for(const item of items){const o=document.createElement('option');o.value=item.id;o.textContent=item.name;$('refList').append(o);}$('refList').value=selected||'';
  $('refControls').hidden=!r;$('refList').disabled=!r;$('refEmpty').hidden=!!r;$('refImage').hidden=!r;button.classList.toggle('active',items.some(r=>r.visible));
  if(!r){$('refImage').removeAttribute('src');return;}
  const im=image(r);if($('refImage').src!==im.src){$('refImage').src=im.src;$('refImage').onload=fitPreview;}
  $('refVisible').checked=r.visible;$('refOpacity').value=Math.round(r.opacity*100);$('refOpacityValue').textContent=Math.round(r.opacity*100)+'%';
  $('refWidth').value=+r.w.toFixed(2);$('refAngle').value=r.angle;$('refX').value=+r.x.toFixed(2);$('refY').value=+r.y.toFixed(2);
  $('refScene').classList.toggle('active',r.mode==='scene');$('refWindow').classList.toggle('active',r.mode==='window');$('refLock').textContent=r.locked?'🔒 Kilitli · aç':'Kilitle';
  $('refMove').disabled=r.locked||!r.visible||r.mode!=='scene';$('refCalibrate').disabled=r.mode!=='scene'||!r.visible;$('refFit').disabled=r.mode!=='scene';
  for(const id of ['refWidth','refAngle','refX','refY','refApply'])$(id).disabled=r.locked;
  if(r.locked)say('Görsel kilitli. Duvarları üzerinden çizebilirsin. Konum için kilidi aç.');
 }
 async function load(file){
  if(importing)return;show();importing=true;const project=Studio.documents().active;
  let url;
  try{
   if(!file||!(/image\/(png|jpeg)/.test(file.type)||/\.(png|jpe?g)$/i.test(file.name||'')))throw Error('PNG veya JPG görsel seçin.');
   if(file.size>30*1024*1024)throw Error('En fazla 30 MB görsel seçin.');
   if(list().length>=C.MAX_COUNT)throw Error('Bir projeye en fazla 4 referans eklenebilir.');
   url=URL.createObjectURL(file);const im=new Image();im.src=url;await im.decode();
   if(Studio.documents().active!==project)throw Error('Proje değişti. Görseli açık projede yeniden ekleyin.');
   const ratio=Math.min(1,2000/Math.max(im.naturalWidth,im.naturalHeight)),canvas=document.createElement('canvas');canvas.width=Math.round(im.naturalWidth*ratio);canvas.height=Math.round(im.naturalHeight*ratio);
   const c=canvas.getContext('2d');c.fillStyle='white';c.fillRect(0,0,canvas.width,canvas.height);c.drawImage(im,0,0,canvas.width,canvas.height);
   // Embedded preview keeps JSON portable; source file is never modified.
   let data=canvas.toDataURL('image/png');if(data.length>450000)data=canvas.toDataURL('image/jpeg',.9);
   const w=Math.min(1200,Math.max(100,cwrap.clientWidth*.7/sc())),h=w*canvas.height/canvas.width,center=toCm(cwrap.clientWidth/2,cwrap.clientHeight/2);
   const r={id:'ref-'+crypto.randomUUID(),name:(file.name||'Panodan görsel').slice(0,180),chunks:data.match(/.{1,8000}/g),x:center.x-w/2,y:center.y-h/2,w,h,angle:0,opacity:.65,visible:true,locked:true,mode:'scene'};
   C.validate([...list(),r]);selected=r.id;
   if(commit(()=>{G.referenceImages=[...list(),r];})){sync(true);say('Görsel eklendi ve kilitlendi. İki noktayla ölçekle ile gerçek ölçüsünü ayarla.');}
  }catch(e){say(e.message||'Görsel okunamadı.',true);}finally{if(url)URL.revokeObjectURL(url);importing=false;}
 }
 function paintPreview(){$('refImage').style.transform=`translate(${view.x}px,${view.y}px) scale(${view.s})`;}
 function fitPreview(){const r=current();if(!r||panel.hidden)return;const im=image(r),v=$('refViewport');if(!im.naturalWidth)return;view.s=Math.min(v.clientWidth/im.naturalWidth,v.clientHeight/im.naturalHeight);view.x=(v.clientWidth-im.naturalWidth*view.s)/2;view.y=(v.clientHeight-im.naturalHeight*view.s)/2;paintPreview();}
 function fit(){const r=current();if(!r)return;const ps=C.corners(r),minX=Math.min(...ps.map(p=>p.x)),minY=Math.min(...ps.map(p=>p.y)),w=Math.max(...ps.map(p=>p.x))-minX,h=Math.max(...ps.map(p=>p.y))-minY;
  G.zoom=Math.max(.01,Math.min(10,Math.min((cwrap.clientWidth-100)/w,(cwrap.clientHeight-100)/h)/G.scale));G.pan={x:(cwrap.clientWidth-w*sc())/2-minX*sc(),y:(cwrap.clientHeight-h*sc())/2-minY*sc()};draw();}
 function point(e){const box=cv.getBoundingClientRect();return toCm(e.clientX-box.left,e.clientY-box.top);}
 function cancel(){mode=null;drag=preview=hover=null;points=[];strip.hidden=true;cv.style.cursor='';}
 function start(next){cancel();setTool('sec');mode=next;strip.hidden=false;strip.firstElementChild.textContent=next==='scale'?'Görselde ölçüsünü bildiğin iki noktayı seç.':'Görseli sürükle. Duvarlar yerinde kalır.';cv.style.cursor=next==='scale'?'crosshair':'move';panel.hidden=true;draw();}
 function hasScene(){return !TH.export&&list().some(r=>r.visible&&r.mode==='scene');}
 const baseBg=drawBg;window.drawBg=function(w,h){baseBg(w,h);if(TH.export)return;for(const source of list()){const r=preview?.id===source.id?preview:source;if(!r.visible||r.mode!=='scene')continue;const im=image(r);if(!im.complete||!im.naturalWidth)continue;const p=toCv(r.x,r.y);ctx.save();ctx.translate(p.x,p.y);ctx.rotate(r.angle*Math.PI/180);ctx.globalAlpha=r.opacity;ctx.drawImage(im,0,0,r.w*sc(),r.h*sc());ctx.restore();}};
 // Keep reference visible under closed rooms without fading room names or dimensions.
 const baseRooms=drawRooms;window.drawRooms=function(...args){if(!hasScene())return baseRooms.apply(this,args);const fill=ctx.fill;ctx.fill=function(...a){const alpha=this.globalAlpha;this.globalAlpha*=.12;try{return fill.apply(this,a);}finally{this.globalAlpha=alpha;}};try{return baseRooms.apply(this,args);}finally{ctx.fill=fill;}};
 const baseDraw=draw;window.draw=function(...args){baseDraw.apply(this,args);if(TH.export)return;sync();if(!mode)return;ctx.save();ctx.strokeStyle='#74e4cb';ctx.fillStyle='#74e4cb';ctx.lineWidth=1.5;
  if(mode==='move'&&current()){const ps=C.corners(preview||current()).map(p=>toCv(p.x,p.y));ctx.setLineDash([6,4]);ctx.beginPath();ps.forEach((p,i)=>i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));ctx.closePath();ctx.stroke();}
  for(const p of points){const q=toCv(p.x,p.y);ctx.beginPath();ctx.arc(q.x,q.y,5,0,Math.PI*2);ctx.stroke();}if(points.length&&hover){const a=toCv(points[0].x,points[0].y),b=toCv(hover.x,hover.y);ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();}ctx.restore();};
 window.addEventListener('mousedown',e=>{if(e.target!==cv||e.button!==0||!mode)return;stop(e);const r=current(),p=point(e);if(!r){cancel();return;}
  if(mode==='scale'){const local=C.local(r,p);if(local.x<0||local.y<0||local.x>r.w||local.y>r.h){Studio.toast('Görselin içinden bir nokta seç.');return;}points.push(p);if(points.length===2){if(Math.hypot(points[1].x-points[0].x,points[1].y-points[0].y)*sc()<4){points.pop();return;}$('refLength').value='';dlg.showModal();$('refLength').focus();}draw();}
  else if(!r.locked){const p0=C.local(r,p);if(p0.x>=0&&p0.y>=0&&p0.x<=r.w&&p0.y<=r.h)drag={start:p,original:clone(r)};}
 },true);
 window.addEventListener('mousemove',e=>{if(!mode)return;if(drag){stop(e);const p=point(e);preview={...drag.original,x:drag.original.x+p.x-drag.start.x,y:drag.original.y+p.y-drag.start.y};draw();}else if(e.target===cv){stop(e);hover=point(e);draw();}},true);
 window.addEventListener('mouseup',e=>{if(!drag||e.button!==0)return;stop(e);const r=preview||drag.original;change({x:r.x,y:r.y});draw();},true);
 window.addEventListener('keydown',e=>{if(e.key==='Escape'&&mode){stop(e);if(dlg.open)dlg.close();cancel();draw();}else if(mode&&!editable(e)&&!(e.ctrlKey||e.metaKey)){if(e.key!=='Tab')stop(e);}},true);
 window.addEventListener('blur',()=>{cancel();draw();});
 dlg.querySelector('form').onsubmit=e=>{e.preventDefault();const r=current();if(!r||points.length!==2)return;try{const next=C.calibrate(r,points[0],points[1],Number($('refLength').value));C.validate(list().map(item=>item.id===r.id?next:item));dlg.close();change(next);show();say('Ölçek ayarlandı. Görsel kilitli kalır; üzerinden çizmeye devam edebilirsin.');}catch(err){say(err.message,true);}};
 $('refScaleCancel').onclick=()=>{dlg.close();cancel();draw();};dlg.addEventListener('cancel',()=>{cancel();draw();});
 $('refImport').onclick=()=>$('refFile').click();$('refFile').onchange=e=>{if(e.target.files[0])load(e.target.files[0]);e.target.value='';};
 $('refPaste').onclick=async()=>{try{if(!navigator.clipboard?.read)throw Error('Görseli kopyalayıp çizim alanında Ctrl+V tuşlarına bas.');const entries=await navigator.clipboard.read();for(const item of entries){const type=item.types.find(t=>['image/png','image/jpeg'].includes(t));if(type){await load(await item.getType(type));return;}}say('Panoda görsel yok. Bir ekran görüntüsünü kopyala.');}catch{say('Görseli kopyalayıp çizim alanında Ctrl+V tuşlarına bas.');}};
 window.addEventListener('paste',e=>{if(editable(e)||blocked())return;const item=[...(e.clipboardData?.items||[])].find(i=>['image/png','image/jpeg'].includes(i.type));if(item){stop(e);load(item.getAsFile());}else if(window.PlanClipboard){stop(e);PlanClipboard.paste();}},true);
 for(const el of [panel,cwrap]){el.addEventListener('dragover',e=>{if([...e.dataTransfer.types].includes('Files'))e.preventDefault();});el.addEventListener('drop',e=>{const f=e.dataTransfer.files[0];if(f){stop(e);load(f);}});}
 $('refClose').onclick=()=>{panel.hidden=true;};$('refList').onchange=e=>{cancel();selected=e.target.value;sync(true);fitPreview();draw();};
 $('refScene').onclick=()=>{change({mode:'scene',visible:true});fit();};$('refWindow').onclick=()=>{change({mode:'window'});fitPreview();};
 $('refVisible').onchange=e=>change({visible:e.target.checked});$('refOpacity').oninput=e=>{$('refOpacityValue').textContent=e.target.value+'%';preview={...current(),opacity:Number(e.target.value)/100};draw();};$('refOpacity').onchange=e=>change({opacity:Number(e.target.value)/100});
 $('refLock').onclick=()=>change({locked:!current().locked});$('refMove').onclick=()=>start('move');$('refCalibrate').onclick=()=>start('scale');$('refFit').onclick=fit;$('refPreviewFit').onclick=fitPreview;
 $('refApply').onclick=()=>{const r=current(),w=Number($('refWidth').value),next={w,h:r.h*w/r.w,angle:Number($('refAngle').value),x:Number($('refX').value),y:Number($('refY').value)};try{C.validate(list().map(item=>item.id===r.id?{...r,...next}:item));change(next);}catch(e){say(e.message,true);}};
 $('refRemove').onclick=()=>{const id=selected;commit(()=>{G.referenceImages=list().filter(r=>r.id!==id);});say('Görsel kaldırıldı. Ctrl+Z ile geri alabilirsin.');};
 const viewport=$('refViewport');viewport.onwheel=e=>{e.preventDefault();const box=viewport.getBoundingClientRect(),x=e.clientX-box.left,y=e.clientY-box.top,s=Math.max(.02,Math.min(15,view.s*(e.deltaY<0?1.15:1/1.15)));view.x=x-(x-view.x)*s/view.s;view.y=y-(y-view.y)*s/view.s;view.s=s;paintPreview();};
 function dragElement(el,fn){el.addEventListener('pointerdown',e=>{if(e.button!==0||e.target.closest('button'))return;e.preventDefault();el.setPointerCapture(e.pointerId);viewDrag={x:e.clientX,y:e.clientY};});el.addEventListener('pointermove',e=>{if(!el.hasPointerCapture(e.pointerId)||!viewDrag)return;fn(e.clientX-viewDrag.x,e.clientY-viewDrag.y);viewDrag={x:e.clientX,y:e.clientY};});el.addEventListener('pointerup',e=>{if(el.hasPointerCapture(e.pointerId))el.releasePointerCapture(e.pointerId);viewDrag=null;});}
 dragElement(panel.querySelector('header'),(dx,dy)=>{panel.style.left=panel.offsetLeft+dx+'px';panel.style.top=panel.offsetTop+dy+'px';clamp();});dragElement(viewport,(dx,dy)=>{view.x+=dx;view.y+=dy;paintPreview();});
 panel.addEventListener('keydown',e=>{if(!(e.ctrlKey||e.metaKey)&&e.key!=='Escape')e.stopPropagation();});new ResizeObserver(()=>{if(!panel.hidden){clamp();fitPreview();}}).observe(viewport);window.addEventListener('resize',clamp);
 const baseTool=setTool;window.setTool=function(t){if(mode)cancel();return baseTool(t);};
 window.ReferenceImages={load,show,fit,hasScene,cancel};
})();
