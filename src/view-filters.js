/* Display-only controls: never change geometry, quantities or snapping. */
(function(){
  'use strict';
  const labels={grid:'Izgara çizgileri',rooms:'Oda adları ve alanları',outerDims:'Dış duvar toplam ölçüleri',innerDims:'İç duvar toplam ölçüleri',chains:'Ölçü zincirleri',openings:'Kapı / pencere ölçüleri',panelNumbers:'Panel numaraları',panelColors:'Panel türü renkleri',panelJoints:'Panel ek çizgileri',connections:'Bağlantı işaretleri · H / U',trusses:'Makas aksları ve numaraları'};
  const keys=Object.keys(labels),all=Object.fromEntries(keys.map(k=>[k,true]));
  const presets={
    presentation:{...all,grid:false,innerDims:false,chains:false,openings:false,panelNumbers:false,panelColors:false,panelJoints:false,connections:false,trusses:false},
    drawing:{...all,chains:false,panelNumbers:false,connections:false,trusses:false,panelColors:false},
    panels:{...all,rooms:false,trusses:false},
    trusses:{...all,innerDims:false,chains:false,openings:false,panelNumbers:false,panelColors:false},
    full:all
  };
  function current(){const v={};keys.forEach(k=>v[k]=k==='panelNumbers'?!!G.pnlEtiket:k==='trusses'?!!G.makasGoster:k==='connections'&&!G.viewFilters?!!G.pnlEtiket:planVisible(k));return v;}
  function set(values){
    const v={...current(),...values};
    Studio.edit(()=>{G.viewFilters=Object.fromEntries(keys.filter(k=>!['panelNumbers','trusses'].includes(k)).map(k=>[k,v[k]]));G.pnlEtiket=v.panelNumbers;G.makasGoster=v.trusses;});
    sync();
  }
  function preset(value){if(presets[value])set(presets[value]);}
  function sync(){
    const v=current();
    document.querySelectorAll('[data-view-filter]').forEach(el=>el.checked=v[el.dataset.viewFilter]);
    const name=Object.keys(presets).find(n=>keys.every(k=>v[k]===presets[n][k]))||'custom';
    document.querySelectorAll('[data-view-preset]').forEach(el=>el.value=name);
  }
  const options='<option value="custom">Özel görünüm</option><option value="presentation">Müşteri sunumu</option><option value="drawing">Çizim · sade</option><option value="panels">Panel / montaj detayı</option><option value="trusses">Makas yerleşimi</option><option value="full">Tüm detaylar</option>';
  const box=document.createElement('div');box.className='sb';box.id='viewFilters';
  box.innerHTML='<div class="sb-t">Görünüm filtreleri</div><label class="field-label" for="viewPreset">Çalışma görünümü</label><select id="viewPreset" data-view-preset class="si full">'+options+'</select><p class="panel-help">Yalnız görünüm değişir; çizim ve metraj korunur. PNG çıktısı bu filtreleri kullanır.</p><details><summary>Görünür katmanları düzenle</summary><div class="view-filter-grid">'+keys.map(k=>'<label><input type="checkbox" data-view-filter="'+k+'"> '+labels[k]+'</label>').join('')+'</div></details><p class="panel-help">Izgarayı gizlemek yakalamayı kapatmaz. “Panel / montaj detayı” mevcut planın detay görünümüdür.</p>';
  document.getElementById('propertiesPane').prepend(box);
  box.addEventListener('change',e=>{if(e.target.dataset.viewFilter)set({[e.target.dataset.viewFilter]:e.target.checked});else if(e.target.hasAttribute('data-view-preset'))preset(e.target.value);});
  const quick=document.createElement('select');quick.id='quickViewPreset';quick.className='ss';quick.setAttribute('aria-label','Çalışma görünümü');quick.setAttribute('data-view-preset','');quick.innerHTML=options;quick.onchange=()=>preset(quick.value);document.getElementById('selectionMode').after(quick);
  // Keep production direction visibly separate from display-only controls.
  for(const id of ['pnlNoBtn','makasBtn','olcuBtn'])document.getElementById(id).style.display='none';
  const direction=document.getElementById('catiBtn');direction.parentElement.previousElementSibling.textContent='Üretim yönü';
  const mode=document.createElement('select');mode.id='viewDimensionMode';mode.className='si full';mode.setAttribute('aria-label','Ölçü zinciri türü');mode.innerHTML='<option value="panel">Panel ölçü zinciri</option><option value="aks">Mimari ölçü zinciri</option>';box.querySelector('details').append(mode);
  mode.onchange=()=>Studio.edit(()=>{G.olcuModu=mode.value;});
  const drawBase=window.draw;window.draw=function(){drawBase();sync();mode.value=G.olcuModu;};
  window.ViewFilters={preset,set,current};sync();draw();
})();
