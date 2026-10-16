/* Optional navigation shell. Existing commands and DOM controls remain authoritative. */
(function(){
'use strict';
const button=document.createElement('button');button.id='workflowToggle';button.className='tb';button.textContent='Yeni düzeni dene';button.setAttribute('aria-pressed','false');document.querySelector('.header-actions').append(button);
const bar=document.createElement('section');bar.id='workflowShell';bar.hidden=true;bar.setAttribute('aria-label','İş akışı');document.querySelector('.workspace-bar').after(bar);
let active='Plan';
const groups={
'Plan':[['Seç',()=>setTool('sec')],['Duvar',()=>setTool('duvar')],['Kapı',()=>setTool('kapi')],['Pencere',()=>setTool('pencere')],['Veranda',()=>setTool('veranda')],['Plan kontrolü',()=>Studio.tab('analysis')]],
'Çatı':[['Çatı planı',()=>roof('plan')],['Tavan',()=>roof('ceiling')],['3B',()=>roof('3d')],['Kesit',()=>roof('section')]],
'Üretim':[['Seçili eleman',()=>Studio.tab('properties')],['Makas yerleşimi',()=>focus('trussEditor')],['Üretim ve kaplama',()=>focus('optBox')],['Plan kontrolü',()=>Studio.tab('analysis')]],
'Metraj':[['Metraj listesi',()=>metrajAc()],['Yükleme listesi',()=>LoadingList.open()]],
'Sunum / Çıktı':[['PNG',()=>PlanExport.open('png')],['PDF',()=>PlanExport.open('pdf')],['DXF',()=>PlanExport.open('dxf')]]};
function roof(view){RoofStudio.open();RoofStudio.setView(view);}
function focus(id){Studio.tab('properties');const el=document.getElementById(id);if(!el||!el.getClientRects().length){Studio.toast('İlgili ayarı mevcut proje panelinden açın; sistem ve seçime göre kullanılabilir.');return;}el.scrollIntoView({block:'nearest'});el.classList.add('workflow-focus');setTimeout(()=>el.classList.remove('workflow-focus'),1800);}
function render(){bar.replaceChildren();const nav=document.createElement('nav');nav.className='workflow-nav';nav.setAttribute('aria-label','İş akışı alanları');Object.keys(groups).forEach(name=>{const b=document.createElement('button');b.type='button';b.textContent=name;b.className=name===active?'active':'';b.setAttribute('aria-pressed',String(name===active));b.onclick=()=>{active=name;render();};nav.append(b);});bar.append(nav);const tools=document.createElement('div');tools.className='workflow-tools';groups[active].forEach(([label,run])=>{const b=document.createElement('button');b.type='button';b.textContent=label;b.onclick=run;tools.append(b);});const note=document.createElement('span');note.textContent='Mevcut çizim motoru · Tüm klasik araçlar aşağıda korunur';tools.append(note);bar.append(tools);window.dispatchEvent(new Event('resize'));}
button.onclick=()=>{const enabled=bar.hidden;bar.hidden=!enabled;document.body.classList.toggle('workflow-enabled',enabled);button.textContent=enabled?'Klasik düzene dön':'Yeni düzeni dene';button.setAttribute('aria-pressed',String(enabled));if(enabled)render();else window.dispatchEvent(new Event('resize'));};
})();
