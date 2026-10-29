/* DEV-157: task groups and contextual controls around the unchanged draft engine. */
(()=>{
 'use strict';
 const $=id=>document.getElementById(id), q=s=>document.querySelector(s);
 const icons={
  select:'M5 3v14l4-4 4 7 3-2-4-7 6-1Z',wall:'M3 6h18v12H3z M8 6v12 M16 6v12',
  veranda:'M3 8h18 M5 8v12 M19 8v12 M3 20h18 M3 4h3 M10 4h4 M18 4h3',
  door:'M5 21V3h14v18 M8 21V6l8-2v17 M12 13h1',window:'M3 4h18v16H3z M12 4v16 M3 12h18',
  fixture:'M4 10h16v4a8 6 0 0 1-16 0Z M12 5v5 M8 5h4',kitchen:'M3 8h18v12H3z M3 13h18 M12 8v12 M6 4h4 M15 4h3',
  furniture:'M5 11V5h14v6 M3 11h18v8H3z M6 19v2 M18 19v2 M7 11v4h10v-4',
  line:'m4 19 7-14 9 14Z M4 19h16',text:'M4 4h16 M12 4v17 M8 21h8',dimension:'M3 6v12 M21 6v12 M3 12h18 M7 9l-4 3 4 3 M17 9l4 3-4 3',
  split:'M3 6h7v12H3z M14 6h7v12h-7z M12 2v3 M12 19v3',panel:'M3 4h18v16H3z M10 4v16 M16 4v16',
  area:'M3 8V3h5 M16 3h5v5 M21 16v5h-5 M8 21H3v-5',all:'M4 4h16v16H4z M8 8h8v8H8z',
  copy:'M8 8h13v13H8z M16 4V2H2v14h2',cut:'m5 4 14 16 M19 4 5 20 M7 7a3 3 0 1 0-1 1 M18 7a3 3 0 1 1-1 1',
  paste:'M8 5H4v16h16V5h-4 M8 3h8v5H8z',search:'M10 3a7 7 0 1 0 0 14 7 7 0 0 0 0-14 M15 15l6 6',
  reference:'M3 3h18v18H3z M3 17l6-7 5 5 3-3 4 5 M16 7h.01',view:'M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6',
  left:'M3 4h18v16H3z M9 4v16',right:'M3 4h18v16H3z M15 4v16'
 };
 const svg=name=>'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="'+icons[name]+'"/></svg>';
 function decorate(id,label,icon,key){const el=$(id);el.innerHTML=svg(icon)+'<span>'+label+'</span>';el.title=label+(key?' · '+key:'');el.setAttribute('aria-label',label);return el;}
 function button(id,label,run){const b=document.createElement('button');b.type='button';b.id=id;b.textContent=label;b.onclick=run;return b;}
 const groups=[
  {id:'build',name:'Yapı',hint:'Duvarlar ve açıklıklar',tools:[['t-duvar','Duvar','wall','D'],['t-veranda','Veranda','veranda','V'],['t-kapi','Kapı','door','K'],['t-pencere','Pencere','window','P']]},
  {id:'furnish',name:'Donatı',hint:'İç mekân yerleşimi',tools:[['t-library','Kütüphane','furniture'],['t-fixture','Vitrifiye','fixture'],['t-kitchen','Mutfak','kitchen'],['t-furniture','Tefriş','furniture']]},
  {id:'annotate',name:'Ölçü ve not',hint:'Çizimi anlat',tools:[['t-dimension','Ölçülendir','dimension'],['t-text','Metin','text','T'],['t-shape','Çizgi / şekil','line']]},
  {id:'edit',name:'Düzenle',hint:'Seçili elemanlarla çalış',tools:[['t-split-wall','Duvar böl','split'],['panelQuickToggle','Panel düzenle','panel'],['clipArea','Alan seç','area'],['clipAll','Tümünü seç','all'],['clipCopy','Kopyala','copy'],['clipCut','Kes','cut'],['clipPaste','Yapıştır','paste']]}
 ];
 const ribbon=q('.tool-ribbon'),history=q('.history-tools'),tabs=document.createElement('div'),row=document.createElement('div'),panels=document.createElement('div');
 tabs.className='command-tabs';tabs.setAttribute('role','tablist');tabs.setAttribute('aria-label','Komut grupları');
 row.className='command-row';panels.className='command-panels';let group='build';
 const select=$('t-sec');row.append(select,panels,history);
 for(const g of groups){
  const tab=button('command-tab-'+g.id,g.name,()=>showGroup(g.id));tab.setAttribute('role','tab');tab.setAttribute('aria-controls','command-panel-'+g.id);tabs.append(tab);
  const panel=document.createElement('div');panel.id='command-panel-'+g.id;panel.className='command-panel';panel.setAttribute('role','tabpanel');panel.setAttribute('aria-labelledby',tab.id);panels.append(panel);
  for(const [id,label,icon,key]of g.tools){const b=decorate(id,label,icon,key);panel.append(b);b.addEventListener('click',()=>{showGroup(g.id);Studio.tab('properties');});}
 }
 const helpers=document.createElement('div');helpers.className='command-helpers';
 helpers.append(decorate('referenceToggle','Referans','reference'));
 const find=button('commandFind','Komut bul',()=>openSearch());find.innerHTML=svg('search')+'<span>Komut bul</span><kbd>Ctrl K</kbd>';helpers.append(find);
 const top=document.createElement('div');top.className='command-top';top.append(tabs,helpers);ribbon.replaceChildren(top,row);
 function showGroup(id){group=id;for(const g of groups){const on=g.id===id,t=$('command-tab-'+g.id);t.setAttribute('aria-selected',String(on));t.tabIndex=on?0:-1;$('command-panel-'+g.id).hidden=!on;}queueResize();}
 tabs.onkeydown=e=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;e.preventDefault();const i=groups.findIndex(g=>g.id===group),n=e.key==='Home'?0:e.key==='End'?groups.length-1:(i+(e.key==='ArrowRight'?1:groups.length-1))%groups.length;showGroup(groups[n].id);$('command-tab-'+group).focus();};

 // Wall creation controls live beside the current tool, never over the drawing.
 const context=q('.context-ribbon'),preset=$('quickViewPreset');
 const canvasView=document.createElement('div');canvasView.id='commandView';canvasView.innerHTML='<span>Görünüm</span>';canvasView.append(preset);
 const viewButton=button('commandViewFilters','Katmanlar',()=>{viewMenu.showPopover();placePopover(viewMenu,viewButton);});viewButton.innerHTML=svg('view');viewButton.setAttribute('aria-label','Görünür katmanları düzenle');canvasView.append(viewButton);$('cwrap').append(canvasView);
 const viewMenu=document.createElement('div');viewMenu.id='commandViewMenu';viewMenu.setAttribute('popover','auto');viewMenu.setAttribute('aria-label','Görünür katmanlar');
 const filters=$('viewFilters'),filterWrapper=filters.closest('.single-sidebar-group');viewMenu.append(filters);document.body.append(viewMenu);filterWrapper?.remove();
 function placePopover(menu,anchor){const r=anchor.getBoundingClientRect();menu.style.left=Math.max(8,Math.min(innerWidth-menu.offsetWidth-8,r.right-menu.offsetWidth))+'px';menu.style.top=Math.min(r.bottom+8,innerHeight-menu.offsetHeight-8)+'px';}
 context.id='commandWallContext';context.querySelector('.ribbon-caption').textContent='DUVAR ÇİZ';context.querySelector('.flex-spacer').remove();$('propertiesPane').prepend(context);
 const commandHint=document.createElement('div');commandHint.id='commandHint';commandHint.innerHTML='<span>AKTİF KOMUT</span><strong></strong><p></p><button type="button">Seçime dön <kbd>Esc</kbd></button>';context.before(commandHint);commandHint.lastElementChild.onclick=()=>select.click();
 const toolInfo={duvar:['Duvar çiz','Başlangıç ve bitiş noktalarını seç. Uzunluğu sayı + Enter ile girebilirsin.'],veranda:['Veranda çiz','Sınırı çiz; uzunluğu santimetre olarak gir.'],kapi:['Kapı ekle','Duvarın üzerinde kapının yerini seç.'],pencere:['Pencere ekle','Duvarın üzerinde pencerenin yerini seç.'],text:['Metin / şekil yerleştir','Çizimde konumunu belirle.'],dimension:['Ölçülendir','İki noktayı seç, ardından ölçü çizgisini yerleştir.'],fixture:['Donatı yerleştir','R: döndür · M: aynala.'],counter:['Mutfak yerleşimi','Tezgâhın geleceği duvarın oda tarafına tıkla.'],'wall-split':['Duvar böl','Duvara tıkla, başlangıç ucundan mesafeyi gir.'],'area-select':['Alan seç','Seçilecek elemanların çevresinde çerçeve çiz.'],'plan-paste':['Yapıştır','Kopyalanan elemanların yeni konumunu seç.']};

 // Keep project defaults on the left, selected-element properties on the right.
 const settings=document.createElement('div');settings.id='commandSettings';settings.hidden=true;
 settings.innerHTML='<div class="command-pane-title"><span>ÇİZİM AYARLARI</span><p>Üretim yönü, panel kuralı ve hassas yerleşim.</p></div>';
 for(const d of [...$('propertiesPane').querySelectorAll(':scope > .single-sidebar-group')])settings.append(d);
 q('.inspector-scroll').append(settings);
 const settingsTab=button('commandSettingsTab','Ayarlar',()=>Studio.tab('draft-settings'));$('analysisTab').before(settingsTab);
 const issue=$('issueCount');$('analysisTab').replaceChildren(document.createTextNode('Kontrol '),issue);$('analysisTab').title='Plan kontrolü';
 const originalTab=Studio.tab;Studio.tab=function(name){originalTab(name==='draft-settings'?'properties':name);const on=name==='draft-settings';settings.hidden=!on;settingsTab.classList.toggle('active',on);if(on){$('propertiesPane').hidden=true;$('propertiesTab').classList.remove('active');}if(!inspectorOpen){inspectorOpen=true;paneState();}};
 // Internal engine errors may select its own analysis tab without calling the public wrapper.
 new MutationObserver(()=>{if(!$('analysisPane').hidden){settings.hidden=true;settingsTab.classList.remove('active');}}).observe($('analysisPane'),{attributes:true,attributeFilter:['hidden']});

 // A project panel can be folded away while drawing; it remains one click away.
 const nav=q('.workspace-bar'),panes=document.createElement('div');panes.className='command-pane-toggles';
 const projectToggle=button('commandProjectToggle','Proje paneli',()=>togglePane('project'));
 const inspectorToggle=button('commandInspectorToggle','Özellik paneli',()=>togglePane('inspector'));
 projectToggle.innerHTML=svg('left');inspectorToggle.innerHTML=svg('right');
 projectToggle.title='Proje panelini aç / kapat';inspectorToggle.title='Özellik panelini aç / kapat';
 projectToggle.setAttribute('aria-label','Proje panelini aç / kapat');inspectorToggle.setAttribute('aria-label','Özellik panelini aç / kapat');
 panes.append(projectToggle,inspectorToggle);nav.insertBefore(panes,q('.single-more'));
 let projectOpen=innerWidth>=1200,inspectorOpen=true,userProjectChoice=false;
 function paneState(){document.body.classList.toggle('command-project-closed',!projectOpen);document.body.classList.toggle('command-inspector-closed',!inspectorOpen);projectToggle.setAttribute('aria-expanded',String(projectOpen));inspectorToggle.setAttribute('aria-expanded',String(inspectorOpen));queueResize();}
 function togglePane(which){if(which==='project'){projectOpen=!projectOpen;userProjectChoice=true;}else inspectorOpen=!inspectorOpen;paneState();}
 let resizePending=false;
 function queueResize(){if(resizePending)return;resizePending=true;requestAnimationFrame(()=>{resizePending=false;if(cv.width!==cwrap.clientWidth||cv.height!==cwrap.clientHeight)resize();document.documentElement.style.setProperty('--single-top',nav.getBoundingClientRect().bottom+'px');});}
 window.addEventListener('resize',()=>{if(!userProjectChoice)projectOpen=innerWidth>=1200;paneState();if(viewMenu.matches(':popover-open'))placePopover(viewMenu,viewButton);});

 // Search executes the existing commands; no parallel implementation of modeling behavior.
 const search=document.createElement('dialog');search.id='commandSearch';search.innerHTML='<header><div><small>KOMUTLAR</small><strong>Ne yapmak istiyorsun?</strong></div><button type="button" aria-label="Komut aramayı kapat">×</button></header><input id="commandQuery" type="search" placeholder="Duvar, ölçü, mutfak…" aria-label="Komut ara" autocomplete="off"><div id="commandResults"></div><footer>↑ ↓ Gezin &nbsp; Enter Aç &nbsp; Esc Kapat</footer>';document.body.append(search);search.querySelector('header button').onclick=()=>search.close();
 const commands=groups.flatMap(g=>g.tools.map(([id,label,icon,key])=>({id,label,icon,key,group:g.name,run:()=>{showGroup(g.id);$(id).click();}})));
 commands.push({id:'search-reference',label:'Referans görsel',icon:'reference',group:'Çizim yardımcısı',run:()=>{SingleStorey.show('plan');if($('referencePanel').hidden)$('referenceToggle').click();}},
  {id:'search-wall-select',label:'Duvar seç',icon:'wall',group:'Seçim',run:()=>{select.click();q('#singleSelectionMenu [data-select="wall"]').click();}},
  {id:'search-panel-select',label:'Panel seç',icon:'panel',group:'Seçim',enabled:()=>isPref(),run:()=>{select.click();q('#singleSelectionMenu [data-select="panel"]').click();}},
  {id:'search-exact-move',label:'Ölçüyle taşı',icon:'dimension',group:'Duvar seçiliyken',enabled:()=>G.seciliTip==='seg',run:()=>{Studio.tab('properties');$('singleMoveByDimension').click();}},
  {id:'search-offset-move',label:'Mesafe kadar taşı',icon:'dimension',group:'Duvar seçiliyken',enabled:()=>G.seciliTip==='seg',run:()=>{Studio.tab('properties');$('singleMoveByOffset').click();}},
  {id:'search-settings',label:'Çizim ayarları',icon:'panel',group:'Üretim ve yakalama',run:()=>Studio.tab('draft-settings')});
 let searchIndex=0,found=[];
 const normalize=s=>s.toLocaleLowerCase('tr').replace(/ı/g,'i').normalize('NFD').replace(/[\u0300-\u036f]/g,'');
 function results(){const term=normalize($('commandQuery').value);found=commands.filter(c=>normalize(c.label+' '+c.group).includes(term));searchIndex=0;const host=$('commandResults');host.replaceChildren();for(const c of found){const b=button('',c.label,()=>{if(b.disabled)return;search.close();c.run();});b.disabled=!!c.enabled&&!c.enabled();b.innerHTML=svg(c.icon)+'<span><b>'+c.label+'</b><small>'+c.group+'</small></span>'+(c.key?'<kbd>'+c.key+'</kbd>':'');host.append(b);}if(!found.length)host.textContent='Bu adla bir komut bulunamadı.';markResult();}
 function markResult(){[...$('commandResults').children].forEach((b,i)=>b.classList.toggle('current',i===searchIndex));}
 function openSearch(){search.showModal();$('commandQuery').value='';results();$('commandQuery').focus();}
 $('commandQuery').oninput=results;
 search.onkeydown=e=>{if(e.key==='Escape'){e.preventDefault();e.stopPropagation();search.close();return;}if(e.key==='ArrowDown'||e.key==='ArrowUp'){e.preventDefault();searchIndex=(searchIndex+(e.key==='ArrowDown'?1:Math.max(0,found.length-1)))%Math.max(1,found.length);markResult();$('commandResults').children[searchIndex]?.scrollIntoView({block:'nearest'});}if(e.key==='Enter'){e.preventDefault();$('commandResults').children[searchIndex]?.click();}};
 window.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'&&!e.altKey&&!document.querySelector('dialog[open],.mbg.open')&&document.body.dataset.singleView==='plan'){e.preventDefault();e.stopImmediatePropagation();openSearch();}},true);

 // The roof keeps its engine-owned visibility rules, with clear command families.
 const roofTabs=q('.roof-tabs');
 for(const [label,ids]of [['Katmanlar',['roofCutaway','roofStrips','roofLayoutLayer','roofWallDetails','roofHide','paint3DOpen','singleCeilingOpen']],['Bakış',['roofProjection','roofViewpoint','roofZoomOut','roofZoomIn','roofFit']],['Sunum',['roofTheme','roofContours','roofPNG','roofCSV']]]){
  const group=document.createElement('div');group.className='command-roof-group';group.setAttribute('aria-label',label);group.innerHTML='<small>'+label+'</small>';for(const id of ids)if($(id))group.append($(id));roofTabs.append(group);
 }
 // Keep views available through navigation; section/report are useful local roof views.
 for(const view of ['section','report']){const b=roofTabs.querySelector('[data-roof-view="'+view+'"]');b?.classList.add('command-roof-view');}

 let lastTool='',lastSelection='';
 function sync(){
  const tool=G.tool,selection=(G.seciliTip||'')+':'+(G.secili?.id||'');
  const info=toolInfo[tool];commandHint.hidden=!info;context.hidden=tool!=='duvar';
  if(info){commandHint.querySelector('strong').textContent=info[0];commandHint.querySelector('p').textContent=info[1];$('selectionEmpty').hidden=true;}
  if(tool!==lastTool){
   const category={duvar:'build',veranda:'build',kapi:'build',pencere:'build',fixture:'furnish',counter:'furnish',text:'annotate',dimension:'annotate','wall-split':'edit','area-select':'edit','plan-paste':'edit'}[tool];
   if(category)showGroup(category);
   if(info||tool==='wall-position'){Studio.tab('properties');inspectorOpen=true;paneState();}
   else if(!G.secili)$('selectionEmpty').hidden=false;
   lastTool=tool;
  }
  if(selection!==lastSelection){if(G.seciliTip){Studio.tab('properties');inspectorOpen=true;paneState();}lastSelection=selection;}
 }
 const baseDraw=window.draw;window.draw=function(...args){const result=baseDraw.apply(this,args);sync();return result;};
 window.CommandUI={showGroup,group:()=>group,openSearch};
 document.body.classList.add('command-ui');showGroup('build');paneState();sync();
})();
