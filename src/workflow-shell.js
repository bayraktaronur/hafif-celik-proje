/* Layout-only relocation. Controls retain their identity, listeners and original anchors. */
(function(){
'use strict';
const $=id=>document.getElementById(id),anchors=new Map(),panels=new Map();let enabled=false,active='Plan';
const toggle=document.createElement('button');toggle.id='workflowToggle';toggle.className='tb';toggle.textContent='Yeni düzene geç';toggle.setAttribute('aria-pressed','false');document.querySelector('.header-actions').append(toggle);
const shell=document.createElement('section');shell.id='workflowShell';shell.hidden=true;document.querySelector('.workspace-bar').after(shell);
const nav=document.createElement('nav');nav.className='workflow-nav';nav.setAttribute('aria-label','Çalışma alanları');shell.append(nav);
const rail=document.createElement('aside');rail.className='workflow-rail';rail.hidden=true;rail.setAttribute('aria-label','Çizim araçları');document.querySelector('.studio-main').prepend(rail);
const common=document.createElement('div');common.className='workflow-common';shell.append(common);
function move(el,host){if(!el)return;if(!anchors.has(el)){const marker=document.createComment('workflow anchor');el.before(marker);anchors.set(el,marker);}host.append(el);}
function action(host,label,run){const b=document.createElement('button');b.type='button';b.textContent=label;b.onclick=run;host.append(b);return b;}
function roof(v){RoofStudio.open();RoofStudio.setView(v);}
function focus(id){Studio.tab('properties');const el=$(id);if(el&&el.closest('#projectSidebar')){document.body.classList.add('workflow-project-open');projectButton.setAttribute('aria-expanded','true');}if(!el||!el.getClientRects().length){Studio.toast('Bu kontrol mevcut yapı sistemi veya seçim için kullanılabilir değil.');return;}for(let p=el.parentElement;p;p=p.parentElement)if(p.tagName==='DETAILS')p.open=true;el.scrollIntoView({block:'nearest'});}
for(const name of ['Plan','Çatı','Üretim','Metraj','Sunum / Çıktı']){const p=document.createElement('div');p.className='workflow-tools';p.dataset.area=name;panels.set(name,p);shell.append(p);action(nav,name,()=>select(name));}
function select(name){active=name;panels.forEach((p,n)=>p.hidden=n!==name);[...nav.children].forEach(b=>{b.classList.toggle('active',b.textContent===name);b.setAttribute('aria-pressed',String(b.textContent===name));});window.dispatchEvent(new Event('resize'));}
const roofPanel=panels.get('Çatı');for(const [n,v] of [['Çatı planı','plan'],['Tavan','ceiling'],['3B','3d'],['Kesit','section'],['Çatı metrajı / kesim','report']])action(roofPanel,n,()=>roof(v));
const prod=panels.get('Üretim');action(prod,'Seçili eleman',()=>Studio.tab('properties'));action(prod,'Üretim ve kaplama',()=>focus('optBox'));action(prod,'Makas yerleşimi',()=>focus('trussEditor'));action(prod,'Plan kontrolü',()=>Studio.tab('analysis'));
const met=panels.get('Metraj');action(met,'Metraj listesi',()=>metrajAc());action(met,'Yükleme listesi',()=>LoadingList.open());
for(const format of ['png','pdf','dxf'])action(panels.get('Sunum / Çıktı'),format.toUpperCase(),()=>PlanExport.open(format));
const visibility=document.createElement('dialog');visibility.id='workflowVisibility';visibility.innerHTML='<div class="workflow-dialog-heading"><strong>Görünürlük</strong><button type="button">Kapat</button></div>';document.body.append(visibility);visibility.querySelector('button').onclick=()=>visibility.close();
const projectButton=action(common,'Proje ayarları',()=>{document.body.classList.toggle('workflow-project-open');projectButton.setAttribute('aria-expanded',String(document.body.classList.contains('workflow-project-open')));window.dispatchEvent(new Event('resize'));});projectButton.setAttribute('aria-expanded','false');
action(common,'Görünürlük',()=>visibility.showModal());action(common,'Plan kontrolü',()=>Studio.tab('analysis'));action(common,'Ekrana sığdır',()=>Studio.fit());
function setEnabled(on){if(enabled===on)return;enabled=on;if(!on){visibility.close();for(const [el,marker]of anchors){marker.replaceWith(el);}anchors.clear();}else{move(document.querySelector('.tool-ribbon'),rail);move(document.querySelector('.history-tools'),common);move($('viewFilters'),visibility);move($('hcBtn'),prod);}
rail.hidden=!on;shell.hidden=!on;try{localStorage.setItem('plan-studio-workflow',on?'modern':'classic');}catch(e){};document.body.classList.toggle('workflow-enabled',on);toggle.textContent=on?'Klasik görünüm':'Modern görünüm';toggle.setAttribute('aria-pressed',String(on));select(active);}
toggle.onclick=()=>setEnabled(!enabled);
// Drawing shortcuts continue to use the existing engine; reveal their toolbar after dispatch.
document.addEventListener('keydown',e=>{if(!enabled||e.ctrlKey||e.altKey||e.metaKey||['INPUT','TEXTAREA','SELECT'].includes(e.target.tagName)||document.querySelector('dialog[open],.mbg.open'))return;if(['s','d','k','p','v'].includes(e.key.toLowerCase()))select('Plan');});
window.WorkflowShell={setEnabled,select};
let preference;try{preference=localStorage.getItem('plan-studio-workflow');}catch(e){}
if(preference==='modern')setEnabled(true);
})();

