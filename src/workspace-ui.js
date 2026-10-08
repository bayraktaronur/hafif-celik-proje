/* Presentation only: keep existing inputs and their event handlers. */
(function(){
const sidebar=document.getElementById('projectSidebar');
const nav=document.createElement('nav');nav.className='workspace-sections';nav.setAttribute('aria-label','Proje paneli');
const groups=[['overview','Özet'],['settings','Ayarlar'],['quantities','Metraj'],['help','Rehber']];
for(const el of [...sidebar.children]){const title=el.querySelector('.sb-t')?.textContent||'';el.dataset.section=el.classList.contains('system-card')||el.id==='optBox'||title==='Proje ayarları'?'settings':el.id==='panelBox'?'quantities':title==='Çizim rehberi'?'help':'overview';}
function show(key){for(const el of sidebar.children)if(el.dataset.section)el.classList.toggle('section-hidden',el.dataset.section!==key);for(const b of nav.children){b.setAttribute('aria-pressed',String(b.dataset.key===key));}sidebar.scrollTop=0;}
for(const [key,label] of groups){const b=document.createElement('button');b.type='button';b.textContent=label;b.dataset.key=key;b.onclick=()=>show(key);nav.append(b);}sidebar.prepend(nav);show('overview');
for(const section of document.querySelectorAll('#propertiesPane > .sb')){const heading=section.querySelector('.sb-t');if(!heading)continue;const details=document.createElement('details'),summary=document.createElement('summary');summary.textContent=heading.textContent;heading.remove();section.before(details);details.className='inspector-details';details.append(summary,section);}
const description=document.querySelector('.workspace-description');if(description)description.textContent='Arayüz denemesi · ayrı yedek alanı';
const toggle=document.createElement('button');toggle.className='tb';toggle.textContent='Proje panelini gizle';toggle.setAttribute('aria-expanded','true');toggle.onclick=()=>{sidebar.hidden=!sidebar.hidden;toggle.textContent=sidebar.hidden?'Proje panelini göster':'Proje panelini gizle';toggle.setAttribute('aria-expanded',String(!sidebar.hidden));window.dispatchEvent(new Event('resize'));};document.querySelector('.workspace-actions').prepend(toggle);
window.WorkspaceUI={show};
})();
