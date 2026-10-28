(()=>{
 const host=document.getElementById('commandSettings')||document.getElementById('selectionHost');
 const box=document.createElement('section');box.className='side-section';box.id='faceDimensionSettings';
 box.innerHTML='<h3>ÖLÇÜ REFERANSI</h3><label>Hafif çelik ölçüleri<select id="dimensionReference"><option value="outer">Dıştan dışa · duvar uç yüzleri</option><option value="net">İç net · duvar yüzleri arası</option><option value="axis">Aks · duvar merkezleri</option></select></label><p>Genel dış ölçü her zaman yapının dış sınırıdır. İç net, karşı duvarların iç yüzleri arasını gösterir. Serbest duvar ucu görünen bitiş yüzünden ölçülür. Prefabrik panel imalat ölçüleri korunur.</p><p>Duvarı seç → Özellikler → Ölçüyle taşı → çizimdeki ölçüye tıkla → yeni değeri cm olarak gir.</p>';
 host.prepend(box);const el=box.querySelector('select');el.onchange=()=>{const value=el.value;Studio.edit(()=>{G.dimensionReference=value;});draw();};
 const base=window.draw;window.draw=function(...args){el.value=G.dimensionReference||'outer';el.disabled=isPref();return base.apply(this,args);};el.value=G.dimensionReference||'outer';el.disabled=isPref();
})();
