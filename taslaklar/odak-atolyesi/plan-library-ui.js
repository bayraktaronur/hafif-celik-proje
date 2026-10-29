/* Independent prototype library. All placement uses native project/history tools. */
(()=>{
 const C=PlanLibraryCore,$=s=>document.querySelector(s),key='prefabrikten.odak.tek-kat.library.v1';
 let saved={favorites:[],recent:[]};try{Object.assign(saved,JSON.parse(localStorage.getItem(key)||'{}'));}catch{}
 for(const k of ['favorites','recent'])saved[k]=Array.isArray(saved[k])?saved[k].filter(id=>C.items[id]):[];
 let category='all',selected='bedDouble',angle=0,mirror=false;
 const panel=document.createElement('aside');panel.id='planLibrary';panel.hidden=true;panel.setAttribute('aria-label','Plan nesne kütüphanesi');
 panel.innerHTML=`<header><div><small>PLAN STUDIO / KOLEKSİYON</small><h2>Plan kütüphanesi</h2></div><button data-close aria-label="Kütüphaneyi kapat">×</button></header><div class="lib-search"><input id="libSearch" type="search" placeholder="Koltuk, lavabo, perde…" aria-label="Nesne ara"></div><nav id="libCategories" aria-label="Nesne kategorileri"></nav><div class="lib-result"><span id="libCount"></span><small>Sürükle veya seçip yerleştir</small></div><div id="libGrid"></div><section id="libDetail"></section><footer>Ölçüler cm · R: döndür · M: aynala · Esc: bitir</footer>`;
 document.body.append(panel);
 const trigger=document.createElement('button');trigger.id='t-library';trigger.className='tool';trigger.textContent='Kütüphane';trigger.onclick=()=>open();$('#t-furniture').before(trigger);
 const persist=()=>{try{localStorage.setItem(key,JSON.stringify(saved));}catch{}};
 const remember=id=>{saved.recent=[id,...saved.recent.filter(x=>x!==id)].slice(0,16);persist();};
 function preview(canvas,id){const i=C.items[id],w=i.sizes[0][0],d=i.command?Math.max(w,i.sizes[0][1]):i.sizes[0][1];canvas.width=240;canvas.height=150;const c=canvas.getContext('2d');c.fillStyle='#e9e6de';c.fillRect(0,0,240,150);const s=Math.min(208/w,118/d);c.translate((240-w*s)/2,(150-d*s)/2);c.scale(s,s);c.lineWidth=1.25/s;C.draw(c,{kind:id,w,d},C.palette);}
 function choose(id){if(selected===id)return;selected=id;panel.querySelectorAll('.lib-card').forEach(card=>card.classList.toggle('selected',card.dataset.id===id));detail();}
 function render(){
  const nav=$('#libCategories');nav.replaceChildren();
  for(const [id,label] of Object.entries({all:'Tümü',favorites:'★ Favoriler',recent:'Son kullanılan',...C.categories})){const b=document.createElement('button');b.textContent=label;b.classList.toggle('active',id===category);b.setAttribute('aria-pressed',id===category);b.onclick=()=>{category=id;render();};nav.append(b);}
  let list=C.search($('#libSearch').value,['favorites','recent'].includes(category)?'all':category);
  if(category==='favorites')list=list.filter(i=>saved.favorites.includes(i.id));if(category==='recent')list=saved.recent.map(id=>C.items[id]).filter(i=>list.includes(i));
  $('#libCount').textContent=list.length+' nesne';const grid=$('#libGrid');grid.replaceChildren();
  for(const i of list){const card=document.createElement('article');card.dataset.id=i.id;card.className='lib-card'+(selected===i.id?' selected':'');const b=document.createElement('button');b.className='lib-object';b.draggable=true;b.setAttribute('aria-label',i.name);const cv=document.createElement('canvas');cv.setAttribute('aria-hidden','true');const name=document.createElement('strong');name.textContent=i.name;const size=document.createElement('small');size.textContent=i.command?'Çizim komutu':i.sizes[0].join(' × ')+' cm';b.append(cv,name,size);b.onclick=()=>choose(i.id);b.ondblclick=()=>start(i.id);b.ondragstart=e=>{e.dataTransfer.setData('application/x-plan-library',i.id);e.dataTransfer.effectAllowed='copy';choose(i.id);};const fav=document.createElement('button');fav.className='lib-favorite';fav.textContent=saved.favorites.includes(i.id)?'★':'☆';fav.setAttribute('aria-label',i.name+' favori');fav.setAttribute('aria-pressed',saved.favorites.includes(i.id));fav.onclick=()=>{saved.favorites=saved.favorites.includes(i.id)?saved.favorites.filter(x=>x!==i.id):[...saved.favorites,i.id];persist();render();};card.append(b,fav);grid.append(card);preview(cv,i.id);}
  if(!list.length){const p=document.createElement('p');p.className='lib-empty';p.textContent=category==='favorites'?'Yıldızla işaretlediğin nesneler burada görünür.':'Bu aramada nesne bulunamadı.';grid.append(p);}
 }
 function detail(){const i=C.items[selected],fixed=C.fixedKinds.has(selected),host=$('#libDetail');host.innerHTML=`<div class="lib-detail-head"><strong></strong><span></span></div><div class="lib-dimensions"><label>Ölçü<select id="libSize"></select></label><label>En · cm<input id="libWidth" type="number" min="1" max="500" step="0.1"></label><label>Derinlik · cm<input id="libDepth" type="number" min="1" max="500" step="0.1"></label></div><div class="lib-actions"><button id="libRotate">↻ 0°</button><button id="libMirror" aria-pressed="false">Aynala</button><button id="libPlace" class="lib-primary">Plana yerleştir</button></div><p id="libNote"></p>`;
  host.querySelector('strong').textContent=i.name;host.querySelector('.lib-detail-head span').textContent=C.categories[i.category];
  for(const size of i.sizes){const o=document.createElement('option');o.value=size.join(',');o.textContent=size.join(' × ')+' cm';$('#libSize').append(o);}const fill=()=>{const [w,d]=$('#libSize').value.split(',').map(Number);$('#libWidth').value=w;$('#libDepth').value=d;};fill();$('#libSize').onchange=fill;
  $('#libWidth').readOnly=$('#libDepth').readOnly=fixed;host.querySelector('.lib-dimensions').hidden=!!i.command;
  angle=0;mirror=false;$('#libRotate').onclick=()=>{angle=(angle+90)%360;$('#libRotate').textContent='↻ '+angle+'°';};$('#libMirror').onclick=()=>{mirror=!mirror;$('#libMirror').setAttribute('aria-pressed',mirror);};$('#libRotate').hidden=$('#libMirror').hidden=!!i.command;
  $('#libNote').textContent=i.command?'Mevcut ölçülü çizim aracı açılır.':fixed?'Standart ürün ölçüsü korunur.':'Önerilen dış ölçüleri değiştirebilirsin. Nesneler 2B plan sembolleridir.';$('#libPlace').onclick=()=>start(selected);
 }
 function dimensions(id){const i=C.items[id];if(id!==selected)return i.sizes[0];return [Number($('#libWidth').value),Number($('#libDepth').value)];}
 function start(id,point){const i=C.items[id];if(!i)return false;if(i.command){close();document.getElementById(i.command)?.click();remember(id);return true;}
  const [w,d]=dimensions(id);if(!Fixtures.beginLibrary(id,w,d,angle,mirror)){$('#libNote').textContent='En ve derinlik 1–500 cm arasında olmalı.';return false;}
  if(point&&!Fixtures.placeLibraryAt(point))return false;remember(id);close();return true;
 }
 function open(){panel.hidden=false;render();detail();$('#libSearch').focus();}
 function close(){panel.hidden=true;}
 panel.querySelector('[data-close]').onclick=close;$('#libSearch').oninput=render;
 panel.addEventListener('keydown',e=>{if(e.key==='Escape'){close();e.preventDefault();}e.stopPropagation();});
 const cv=$('#cv');cv.addEventListener('dragover',e=>{if([...e.dataTransfer.types].includes('application/x-plan-library')){e.preventDefault();e.dataTransfer.dropEffect='copy';}});
 cv.addEventListener('drop',e=>{const id=e.dataTransfer.getData('application/x-plan-library');if(!C.items[id])return;e.preventDefault();const r=cv.getBoundingClientRect();start(id,toCm(e.clientX-r.left,e.clientY-r.top));});
 window.PlanLibraryUI={open,close,start,preview};
})();
