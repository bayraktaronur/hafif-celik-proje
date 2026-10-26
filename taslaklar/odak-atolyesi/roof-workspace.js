/* Stable task navigation. Reuses the original controls, forms and listeners. */
(function(){
 'use strict';const $=id=>document.getElementById(id),q=s=>document.querySelector(s);
 const dialog=$('roofDialog'),bar=q('.roof-tabs'),props=$('roofProperties');
 // RoofStudio replaces the properties contents on each render. Keep task tools
 // in a sibling so their original listeners and elements survive that update.
 const right=document.createElement('aside');right.className='roof-right';
 props.before(right);props.classList.remove('roof-right');right.append(props);
 let active='model',lastViews='',queued=0;
 const groups={model:['Model','Bölümü seç, geometrisini ve katmanlarını düzenle.'],material:['Malzeme','Kaplama, boya ve yağmur suyu sistemi.'],light:['Işık','Sunum görünümünü ve yüzey belirginliğini ayarla.'],camera:['Kamera','Bakışını seç veya bu proje için kaydet.'],output:['Çıktı','Görsel, pafta ve miktar çıktıları.']};
 const panels={},tabs=document.createElement('div');tabs.className='roof-task-tabs';tabs.setAttribute('role','tablist');tabs.setAttribute('aria-label','Çatı ve 3D araçları');
 const host=document.createElement('section');host.id='roofTaskHost';right.prepend(host);
 for(const [id,[name,hint]]of Object.entries(groups)){
  const b=document.createElement('button');b.id='roof-task-'+id;b.type='button';b.textContent=name;b.setAttribute('role','tab');b.setAttribute('aria-controls','roof-panel-'+id);b.onclick=()=>show(id);tabs.append(b);
  const p=document.createElement('section');p.id='roof-panel-'+id;p.className='roof-task-panel';p.setAttribute('role','tabpanel');p.setAttribute('aria-labelledby',b.id);p.innerHTML='<header><small>ÇATI / 3D</small><h3>'+name+'</h3><p>'+hint+'</p></header>';host.append(p);panels[id]=p;
 }
 const row=(id,label)=>{const d=document.createElement('div');d.className='roof-task-section';if(label){const h=document.createElement('h4');h.textContent=label;d.append(h);}panels[id].append(d);return d;};
 const move=(target,ids)=>ids.forEach(id=>{const el=$(id);if(el)target.append(el);});
 const modes=document.createElement('details');modes.id='roofLayerTools';modes.className='roof-task-section';modes.innerHTML='<summary>Görünür katmanlar</summary>';panels.model.append(modes);move(modes,['roofHide','roofCutaway','roofWallDetails','singleCeilingOpen','roofStrips']);
 const layout=document.createElement('label');layout.textContent='Kaplama yerleşimi';modes.append(layout);move(layout,['roofLayoutLayer']);
 const material=row('material','Yüzey ve donanım');move(material,['paint3DOpen','rainOpen']);
 const light=row('light');move(light,['presentationControls','roofTheme','roofContours']);
 const lightBody=document.createElement('div');lightBody.id='roofInlinePresentation';light.append(lightBody);window.PresentationUI?.mount(lightBody);
 const camera=row('camera','Bakış');
 for(const [id,label]of [['roofProjection','İzdüşüm'],['roofViewpoint','Hazır bakış']]){const l=document.createElement('label');l.textContent=label;camera.append(l);move(l,[id]);}
 const rotation=document.createElement('label');rotation.textContent='Yatay dönüş';camera.append(rotation);move(rotation,['roofCamera']);
 for(const id of ['light','camera']){const b=document.createElement('button');b.type='button';b.className='roof-open-3d';b.textContent='3D görünümüne geç';b.onclick=()=>SingleStorey.show('model');panels[id].querySelector('header').append(b);}
 const zoom=document.createElement('div');zoom.className='roof-task-actions';camera.append(zoom);move(zoom,['roofZoomOut','roofZoomIn']);$('roofZoomOut').setAttribute('aria-label','Uzaklaştır');$('roofZoomIn').setAttribute('aria-label','Yakınlaştır');
 const views=row('camera','Kayıtlı bakışlar');views.innerHTML+='<label>Bakış adı<input id="roofViewName" maxlength="60" placeholder="Örneğin: Ön cephe" autocomplete="off"></label><button id="roofViewSave" type="button">Bu bakışı kaydet</button><p id="roofViewStatus" role="status"></p><div id="roofViewList"></div><p class="roof-task-note">Bakışlar bu proje dosyasına kaydedilir. Renkler ve model, projenin güncel halinden gelir.</p>';
 const out=row('output','Dışa aktar');move(out,['roofPNG','roofCSV']);$('roofPNG').textContent='PNG görseli';$('roofCSV').textContent='Çatı metrajı · CSV';
 const outputButton=(id,text,fn)=>{const b=document.createElement('button');b.type='button';b.id=id;b.textContent=text;b.onclick=fn;out.append(b);};
 outputButton('roofPlanSheet','Kat planı · PDF / PNG',()=>SingleStorey.show('export'));
 outputButton('roofAllBill','Tüm metraj listesi',()=>SingleStorey.show('bill'));
 const reports=row('output','İncele');for(const el of [...bar.querySelectorAll('[data-roof-view="section"],[data-roof-view="report"]')])reports.append(el);
 const reportReturn=document.createElement('button');reportReturn.type='button';reportReturn.id='roofReturnModel';reportReturn.textContent='3D modele dön';reportReturn.onclick=()=>{SingleStorey.show('model');show('model');};reports.append(reportReturn);
 const note=document.createElement('p');note.className='roof-task-note';note.textContent='3D PNG: 4K çözünürlük, kadraj ve arka plan seçimi. Pafta: kâğıt boyutu, ölçek ve antet.';out.append(note);
 // The compact bar contains only navigation and the universally useful fit action.
 const fit=$('roofFit');bar.replaceChildren(tabs,fit);bar.classList.add('roof-task-bar');dialog.classList.add('roof-workspace');
 const subtitle=q('.roof-head small');if(subtitle)subtitle.textContent='Bölümler solda · seçtiğin işin ayarları sağda';
 const left=q('.roof-left');
 const create=document.createElement('details');create.className='roof-create-group';create.innerHTML='<summary>Yeni çatı oluştur</summary>';left.append(create);
 move(create,['roofFromPlan']);
 for(const d of [...left.querySelectorAll(':scope > details')])if(d!==create&&d.querySelector('#roofBoundaryType,#roofVerandaRoom'))create.append(d);
 // Keep pending form values when changing task. Only visibility changes; no render().
 function classify(){
  const form=$('roofForm');if(!form)return;
  for(const el of form.children){
   const isMaterial=!!el.querySelector('#rz_material,[name="osb"],[name="membrane"]')||(/Alt kaplama katmanları/.test(el.querySelector(':scope > summary')?.textContent||''));
   el.dataset.roofTask=el.id==='roofApply'?'shared':isMaterial?'material':'model';
  }
  const mat=$('rz_material')?.closest('details');if(mat)mat.dataset.roofTask='material';
  for(const d of form.querySelectorAll(':scope > details'))if(d.dataset.roofTask==='material')d.open=true;
 }
 function sync(){
  classify();const is3d=document.body.dataset.singleView==='model';
  host.querySelectorAll('.roof-open-3d').forEach(b=>b.hidden=is3d);
  if($('roofViewSave'))$('roofViewSave').disabled=!is3d;
  const list=G.cameraViews||[],key=JSON.stringify(list);
  if(key!==lastViews){lastViews=key;const el=$('roofViewList');el.replaceChildren();if(!list.length){const p=document.createElement('p');p.textContent='Henüz kayıtlı bakış yok.';p.className='roof-task-note';el.append(p);}
   for(const v of list){const r=document.createElement('div');r.className='roof-saved-view';const open=document.createElement('button');open.type='button';open.textContent=v.name;open.onclick=()=>{SingleStorey.show('model');show('camera');requestAnimationFrame(()=>CameraViews.restore(v));};const remove=document.createElement('button');remove.type='button';remove.textContent='×';remove.setAttribute('aria-label',v.name+' bakışını sil');remove.onclick=()=>{Studio.edit(()=>{G.cameraViews=G.cameraViews.filter(x=>x.id!==v.id);});sync();};r.append(open,remove);el.append(r);}
  }
 }
 function show(id){
  if(!groups[id])return;window.PresentationUI?.commit();active=id;dialog.dataset.roofTask=id;
  for(const k of Object.keys(groups)){const b=$('roof-task-'+k),yes=k===id;b.setAttribute('aria-selected',String(yes));b.tabIndex=yes?0:-1;panels[k].hidden=!yes;}
  props.hidden=!['model','material'].includes(id);sync();
  // If the user collapsed the inspector, selecting a task reopens it.
  if(document.body.classList.contains('command-inspector-closed'))$('commandInspectorToggle')?.click();
 }
 tabs.onkeydown=e=>{const keys=Object.keys(groups),i=keys.indexOf(active);let n;if(e.key==='ArrowRight')n=(i+1)%keys.length;else if(e.key==='ArrowLeft')n=(i+keys.length-1)%keys.length;else if(e.key==='Home')n=0;else if(e.key==='End')n=keys.length-1;else return;e.preventDefault();show(keys[n]);$('roof-task-'+keys[n]).focus();};
 $('roofViewSave').onclick=()=>{try{const name=$('roofViewName').value.trim()||'Bakış '+((G.cameraViews?.length||0)+1),v=CameraViews.capture(name);CameraViews.validate([...(G.cameraViews||[]),v]);Studio.edit(()=>{G.cameraViews=[...(G.cameraViews||[]),v];});$('roofViewName').value='';$('roofViewStatus').textContent='Bakış kaydedildi.';sync();}catch(e){$('roofViewStatus').textContent=e.message;}};
 const schedule=()=>{if(!queued)queued=requestAnimationFrame(()=>{queued=0;sync();});};
 new MutationObserver(schedule).observe(props,{childList:true});
 new MutationObserver(schedule).observe(document.body,{attributes:true,attributeFilter:['data-single-view']});
 const draw=window.draw;window.draw=function(...a){const result=draw.apply(this,a);schedule();return result;};
 window.RoofWorkspace={show,sync,active:()=>active};show('model');
})();
