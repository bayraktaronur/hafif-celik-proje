/* Single-storey workflow around an isolated copy of the proven Plan Studio engine. */
(function(){
 'use strict';
 const $=id=>document.getElementById(id),q=s=>document.querySelector(s),all=s=>[...document.querySelectorAll(s)];
 const clone=x=>JSON.parse(JSON.stringify(x));let active='plan',ready=false;
 let hadSaved=false;try{hadSaved=!!(localStorage.getItem('prefabrikten.odak.tek-kat.documents.v1')||localStorage.getItem('prefabrikten.odak.tek-kat.recovery.v1'));}catch{}
 const labels={plan:'Zemin kat',roof:'Çatı',model:'3D',ceiling:'Tavan',bill:'Metraj',export:'Çıktı'};
 document.body.classList.add('single-storey');
 const nav=q('.workspace-bar');nav.replaceChildren();nav.setAttribute('aria-label','Tek katlı proje görünümleri');
 const heading=document.createElement('span');heading.className='draft-name';heading.innerHTML='<i></i> TEK KATLI PREFABRİK';nav.append(heading);
 const viewNav=document.createElement('div');viewNav.className='single-views';nav.append(viewNav);
 const action=(host,text,id,run)=>{const b=document.createElement('button');b.type='button';if(id)b.id=id;b.textContent=text;b.onclick=run;host.append(b);return b;};
 for(const [id,label]of Object.entries(labels)){const b=action(viewNav,label,'single-'+id,()=>show(id));b.dataset.singleView=id;}
 const more=document.createElement('details');more.className='single-more';more.innerHTML='<summary>Diğer çalışmalar</summary><div><a href="arakat.html">Arakat ve katman incelemesi ↗</a><p>Önceki taslak ayrı sayfada korunur.</p></div>';nav.append(more);
 const badge=document.createElement('span');badge.className='draft-badge';badge.textContent='BAĞIMSIZ TASLAK · 162';q('.project-title').after(badge);
 q('.identity small').textContent='PREFABRİKTEN / ODAK ATÖLYESİ';
 $('workflowToggle').hidden=true;if($('hcBtn'))$('hcBtn').hidden=true;
 const header=q('.header-actions');header.querySelector('[onclick="yeniPlan()"]').textContent='＋ Boş plan';
 action(header,'Örnek plan','singleExample',()=>loadExample(true)).className='tb';
 for(const b of header.querySelectorAll('button'))if(/çıktı|yükleme/i.test(b.textContent))b.hidden=true;
 const billActions=$('mbgMet').querySelector('.mbtns');action(billActions,'Yükleme listesi','singleLoading',()=>{$('mbgMet').classList.remove('open');LoadingList.open();}).className='mok';
 const formats=document.createElement('dialog');formats.id='singleExport';formats.innerHTML='<h2>Çıktı biçimi</h2><p>Aynı planın ölçülerini ve proje bilgilerini kullanır.</p><div></div><button type="button" class="sib" id="singleExportCancel">Vazgeç</button>';document.body.append(formats);
 for(const [type,label]of [['pdf','PDF · Baskı ve müşteri sunumu'],['png','PNG · Görsel çıktı'],['dxf','DXF · CAD çizimi']]){const b=action(formats.querySelector('div'),label,'single-format-'+type,()=>{formats.close();PlanExport.open(type);});b.className='sib';}
 $('singleExportCancel').onclick=()=>formats.close();
 const newPlan=window.yeniPlan;window.yeniPlan=function(){newPlan();if(G.segs.length===0)setSistem('prefabrik',true);show('plan');};
 Studio.demo=()=>loadExample(G.segs.length>0);
 // Keep real command buttons/listeners; secondary editing commands move to a compact menu.
 const ribbon=q('.tool-ribbon'),overflow=document.createElement('details');overflow.id='singleTools';overflow.innerHTML='<summary>Düzenle · diğer araçlar</summary><div></div>';
 const keep=new Set(['t-sec','t-duvar','t-veranda','t-kapi','t-pencere','t-split-wall']);
 const primary=document.createElement('div');primary.className='single-primary-tools';
 for(const el of [...ribbon.querySelectorAll('button,select')]){if(el.closest('.history-tools'))continue;const text=el.textContent.trim();if(keep.has(el.id)||/^(Mutfak|Tefriş|.*Çizgi \/ şekil|.*Ölçülendir|.*Metin|.*Vitrifiye)/.test(text))primary.append(el);else overflow.lastElementChild.append(el);}
 const history=q('.history-tools');ribbon.replaceChildren(primary,overflow,history);
 q('.context-ribbon .flex-spacer').after($('quickViewPreset'));
 // Project options appear once on the left. Selection and precision stay on the right.
 const side=$('projectSidebar');for(const box of [...side.querySelectorAll(':scope > .sb')]){if(box.id==='sbSel'||box.id==='projectSpecs')continue;const t=box.querySelector('.sb-t')?.textContent||'';if(/Proje ayarları|Çizim rehberi/.test(t)){box.hidden=true;continue;}if(/Mimari özet|Panel metrajı/.test(t)){const d=document.createElement('details');d.className='single-sidebar-group';d.innerHTML='<summary>'+t+'</summary>';box.before(d);d.append(box);}}
 const intro=document.createElement('div');intro.className='single-level';intro.innerHTML='<span>ÇALIŞMA DÜZLEMİ</span><strong>Zemin kat <small>±0,00 m</small></strong>';side.prepend(intro);
 const props=$('propertiesPane');for(const box of [...props.querySelectorAll(':scope > .sb')]){const title=box.querySelector('.sb-t')?.textContent||'Çizim ayarları',d=document.createElement('details');d.className='single-sidebar-group';d.innerHTML='<summary>'+title+'</summary>';box.before(d);d.append(box);}
 $('selectionEmpty').innerHTML='<span class="selection-symbol">↖</span><h3>Çiz ve düzenle</h3><p>Duvar, açıklık veya odayı seç. Ayarları burada açılır.</p><div class="single-steps"><span><b>01</b> Duvarları çiz</span><span><b>02</b> Kapı ve pencere ekle</span><span><b>03</b> Çatı ve 3D’yi incele</span></div><small>D · Duvar &nbsp; K · Kapı &nbsp; P · Pencere<br>Esc · Bitir &nbsp; Ctrl+S · JSON kaydet</small>';
 // Dock the existing roof workspace below the same project navigation.
 const roof=$('roofDialog');roof.showModal=()=>{if(!roof.open)roof.show();};
 const roofOpen=RoofStudio.open;RoofStudio.open=function(){roofOpen();if(active==='plan')mark('roof');requestAnimationFrame(decorateRoof);};
 const roofClose=RoofStudio.close;RoofStudio.close=function(){roofClose();mark('plan');};
 $('roofClose').onclick=()=>{RoofStudio.close();resize();Studio.fit();};
 roof.addEventListener('close',()=>mark('plan'));
 roof.addEventListener('click',e=>{const v=e.target.closest('[data-roof-view]')?.dataset.roofView;if(v)mark(v==='3d'?'model':v==='ceiling'?'ceiling':'roof');});
 const roofLeft=q('.roof-left'),leftDetails=(title,nodes)=>{const d=document.createElement('details');d.className='single-roof-group';d.innerHTML='<summary>'+title+'</summary>';roofLeft.append(d);nodes.filter(Boolean).forEach(n=>d.append(n));return d;};
 const verandaNodes=[...roofLeft.children].filter(n=>n.matches('label,select,p')||n.id==='roofFromVeranda');leftDetails('Veranda / sundurma',verandaNodes);
 const boundary=$('roofBoundaryType')?.closest('section')||$('roofBoundaryType')?.parentElement?.parentElement;
 if(boundary&&boundary.parentElement===roofLeft)leftDetails('Özel çatı sınırı çiz',[boundary]);
 // Form nodes are moved, not cloned: validation, submit and undo remain the engine's.
 function decorateRoof(){const form=$('roofForm');if(!form||form.dataset.grouped)return;form.dataset.grouped='1';
  const group=(title,open=false)=>{const d=document.createElement('details');d.className='single-roof-group';d.open=open;d.innerHTML='<summary>'+title+'</summary>';form.insertBefore(d,$('roofApply'));return d;};
  const geometry=group('Konum ve geometri'),trim=group('Alın ve saçak ayrıntıları');
  for(const id of ['rz_x','rz_y','rz_w','rz_d','rz_angle','rz_floorLevel','rz_wallTop','rz_ridge']){const el=$(id);if(el)geometry.append(el.closest('label'));}
  for(const id of ['rz_vergeWidth','rz_vergeCustom']){const el=$(id);if(el)trim.append(el.closest('label'));}
  for(const fs of [...form.querySelectorAll(':scope > fieldset')])trim.append(fs);
  for(const p of [...form.querySelectorAll(':scope > p')])geometry.append(p);
  for(const d of form.querySelectorAll(':scope > details'))if(!d.classList.contains('single-roof-group'))d.open=false;
 }
 new MutationObserver(()=>{decorateRoof();}).observe($('roofProperties'),{childList:true});
 // A view change does not create a roof. Creation is an explicit, undoable command.
 function mark(id){active=id;all('[data-single-view]').forEach(b=>{b.classList.toggle('active',b.dataset.singleView===id);b.setAttribute('aria-pressed',String(b.dataset.singleView===id));});document.body.dataset.singleView=id;}
 function show(id){
  if(['roof','model','ceiling'].includes(id)){RoofStudio.open();RoofStudio.setView(id==='roof'?'plan':id==='model'?'3d':'ceiling');mark(id);requestAnimationFrame(decorateRoof);return;}
  if(roof.open)RoofStudio.close();mark('plan');
  if(id==='bill')metrajAc();else if(id==='export')formats.showModal();else{setTool('sec');resize();}
 }
 function loadExample(append){const data=clone(SINGLE_EXAMPLE);data.projectName='Tuna 84 · Tek kat örneği';data.opt.h=280;data.ky=280;
  data.settings={...data.settings,pnlEtiket:false,makasGoster:false,viewFilters:{grid:true,rooms:true,outerDims:true,innerDims:true,chains:false,architecturalDims:true,openings:true,panelColors:false}};
  if(append)Studio.openDocument(data);else Studio.loadProject(data);show('plan');Studio.fit();Studio.flush();
 }
 // A small live summary makes the common project choices visible in every workspace.
 const summary=document.createElement('div');summary.id='singleSummary';summary.setAttribute('aria-live','polite');intro.after(summary);
 function sync(){if(!ready)return;const s=G.sistem==='prefabrik'?'Prefabrik':'Hafif çelik',closed=G.rooms.filter(r=>r.tip!=='veranda'),text=s+' · '+G.opt.h+' cm · '+closed.length+' mekân';if(summary.textContent!==text)summary.textContent=text;
  const message=G.sistem==='prefabrik'?'TEK KATLI PREFABRİK':'TEK KATLI HAFİF ÇELİK';if(heading.textContent.trim()!==message)heading.innerHTML='<i></i>'+message;
  const h=q('.canvas-heading #canvasSystem');if(h)h.textContent=s+' / Zemin kat';
 }
 const prevDraw=window.draw;window.draw=function(...args){const r=prevDraw.apply(this,args);sync();return r;};
 const specRender=ProjectSpecs.render;ProjectSpecs.render=function(...a){const r=specRender.apply(this,a);sync();return r;};
 window.SingleStorey={show,loadExample,sourceRevision:'5.9.137',task:'DEV-162'};
 window.addEventListener('load',()=>{ready=true;if(!hadSaved&&!G.segs.length&&Studio.documents().documents.length===1)loadExample(false);mark('plan');sync();resize();Studio.fit();$('sistemSel').setAttribute('aria-label','Yapı sistemi');});
 window.addEventListener('resize',()=>{document.documentElement.style.setProperty('--single-top',nav.getBoundingClientRect().bottom+'px');});
})();
