/* Independent roof workspace. All committed roof/material edits use Studio history. */
(function(){
  'use strict';
  const C=RoofCore,$=id=>document.getElementById(id),clone=x=>JSON.parse(JSON.stringify(x)),escape=esc;
  const TYPES={besik:'Beşik',kirma:'Kırma',tek:'Tek eğim / sundurma',bay:'Çokgen çıkma çatısı'};
  const EDGE={ridge:'Mahya',hip:'Eğik mahya',valley:'Dere',eave:'Saçak',verge:'Alın V',high:'Üst kenar',step:'Kot farkı birleşimi',fold:'Eğim değişimi'};
  const COLORS={ridge:'#ffcd76',hip:'#ffdca1',valley:'#66d7f1',eave:'#d2e0e9',verge:'#a0b2c3',high:'#c39ce4',step:'#e79bdb',fold:'#bb9fe9'};
  let selected=null,mode='plan',action=null,view={scale:1,x:100,y:100},cache=null,cacheKey='',drag=null,hover=null,angle=35,lastPropertyId=null,showStrips=false,showWallDetails=true,hideRoof=false;
  G.roofs=G.roofs||[];G.roofMaterials=G.roofMaterials||[];
  const dialog=document.createElement('dialog');dialog.id='roofDialog';dialog.innerHTML=`
    <header class="roof-head"><strong>Çatı planı</strong><small>Bölümleri yerleştir · Birleşimleri kontrol et · Kaplama metrajını al</small><button id="roofUndo" title="Geri al">↶</button><button id="roofRedo" title="İleri al">↷</button><button id="roofClose">Kat planına dön ✕</button></header>
    <div class="roof-body"><aside class="roof-left"><h3>ÇATI BÖLÜMLERİ</h3><div id="roofZones"></div><button id="roofFromPlan">Plandan ana çatı</button><label>Veranda / ek çatı<select id="roofVerandaRoom"></select></label><select id="roofVerandaType"><option value="tek">Sundurma · tek eğim</option><option value="besik">Beşik çatı</option><option value="karga">Karga burun · eğim devamı</option></select><label>Ana çatı bağlantısı<select id="roofVerandaParent"></select></label><p>Türü seçip oluştur / güncelle düğmesine basın. Sundurma başlangıcı ana saçaktan 10 cm aşağıda, başlangıç eğimi %5; beşikte %33. Ayarlar sağ panelde değiştirilebilir.</p><button id="roofFromVeranda">Veranda oluştur / güncelle</button><details><summary>Elle ek çatı çizimi</summary><label>Çizilecek bölüm biçimi<select id="roofNewType" aria-label="Yeni çatı türü">${Object.entries(TYPES).map(([v,n])=>`<option value="${v}">${n}</option>`).join('')}</select></label><button id="roofDraw">＋ Bölüm çiz</button><button id="roofJoin">＋ Birleşen bölüm çiz</button><p>Çizmek için iki karşı köşeye tıklayın. Birleşen bölümler aynı grupta kesilir; ayrı sundurmalar kendi grubunda kalır.</p></details><details><summary>Fotoğraf rehberi</summary><p>Beşik / kırma ana çatı; çapraz giriş çatısı; ayrı kotta sundurma; eğimin verandaya devamı; çokgen çıkma ve parapetli gizli çatı bu bölüm sistemiyle kurulur.</p><p>Örnekler: 4, 11, 12 → alt sundurma; 5 → kırma + beşik giriş; 10, 15, 36 → çokgen çıkma; 20, 37 → parapet. Fotoğraf 30 ve 31 aynı görünümdür.</p><p>Çatı kotu, eğimi ve kaplaması fotoğraftan ölçü alınarak belirlenmez; proje ölçüsü girilir.</p></details></aside>
    <section class="roof-center"><nav class="roof-tabs"><button data-roof-view="plan" class="active">Plan</button><button data-roof-view="3d">3B</button><button data-roof-view="section">Kesit</button><button data-roof-view="report">Metraj / kesim</button><span class="roof-fill"></span><button id="roofStrips" title="Seçili bölümde levha kapatma enleri">Kaplama yerleşimi</button><select id="roofLayoutLayer" aria-label="Gösterilen kaplama katmanı"><option value="top">Üst örtü</option></select><button id="roofWallDetails">Panel / H / köşe</button><button id="roofHide">Çatıyı gizle</button><select id="roofProjection" aria-label="3B izdüşüm"><option value="parallel">Paralel</option><option value="perspective">Perspektif</option></select><select id="roofViewpoint" aria-label="3B bakış yönü"><option value="iso">İzometrik</option><option value="front">Ön</option><option value="back">Arka</option><option value="left">Sol</option><option value="right">Sağ</option><option value="top">Üst</option></select><button id="roofZoomIn" aria-label="3B yakınlaştır">+</button><button id="roofZoomOut" aria-label="3B uzaklaştır">−</button><button id="roofFit">Sığdır</button><button id="roofPNG">PNG</button><button id="roofCSV">CSV</button></nav><div class="roof-stage" id="roofStage"><canvas id="roofCanvas" aria-label="Çatı çizimi"></canvas><div id="roofHint"></div><input id="roofCamera" type="range" min="0" max="359" value="35" aria-label="3B bakış açısı" hidden></div><div id="roofReport" hidden></div><div class="roof-legend">${['ridge','hip','valley','eave','verge','step'].map(k=>`<span><i style="background:${COLORS[k]}"></i>${EDGE[k]}</span>`).join('')}</div><div id="roofStats" class="roof-stats"></div></section>
    <aside class="roof-right" id="roofProperties"></aside></div><div id="roofNotice" role="status">Tüm ölçüler cm. Çatı geometrisi ve kaplama hesabı; taşıyıcı kesit / bağlantı hesabı içermez.</div>`;
  document.body.append(dialog);
  const tab=document.createElement('button');tab.id='roofWorkspace';tab.className='tb';tab.textContent='Çatı planı';tab.onclick=open;document.querySelector('.workspace-actions').prepend(tab);
  function number(v,d=2){return Number(v||0).toLocaleString('tr-TR',{maximumFractionDigits:d});}
  function notice(s,error=false){$('roofNotice').textContent=s;$('roofNotice').classList.toggle('roof-warning',error);}
  function get(){return G.roofs.find(z=>z.id===selected);}
  function materials(){return [...C.MATERIALS,...G.roofMaterials];}
  function model(){const key=JSON.stringify([G.roofs,G.roofMaterials,G.opt.osb]);if(key!==cacheKey){cache=C.calculate(G.roofs,G.roofMaterials,!!G.opt.osb);cacheKey=key;}return cache;}
  function commit(mutate,options){let failure='';const ok=Studio.edit(()=>{try{mutate();if(window.RoofWorkflow)RoofWorkflow.synchronize();C.validate(G.roofs,G.roofMaterials);G.roofs=G.roofs.map(z=>z.attachment?C.attachVeranda(z,G.roofs.find(p=>p.id===z.attachment.parentId)):z);}catch(e){failure=e.message;throw e;}C.validate(G.roofs,G.roofMaterials);C.calculate(G.roofs,G.roofMaterials);},options);if(ok){cacheKey='';render();notice('Çatı güncellendi. Projeyle birlikte kaydedilir; geri alma kullanılabilir.');}else notice(failure||'Değişiklik uygulanamadı. Ölçüleri kontrol edin.',true);return ok;}
  function id(){return 'roof_'+Date.now().toString(36)+'_'+Math.random().toString(36).slice(2,7);}
  function make(overrides={}){const z=C.defaults({id:id(),layers:G.opt.osb?[{...C.LAYERS[0]}]:[],datum:'eave',wallTop:+G.opt.h||250,floorLevel:0,pitch:+G.opt.egim||33,eaves:Array(4).fill(+G.opt.sacak||0),h:+G.opt.h||280,material:G.opt.kaplama,width:+G.opt.trapezEn||100,fire:+G.opt.catiFire||0,...overrides});if(!materials().some(m=>m.id===z.material))z.material='trapez';const mat=materials().find(m=>m.id===z.material);if(mat.unit==='sheet'&&!mat.widths.includes(z.width))z.width=mat.widths.at(-1);z.group=overrides.group||z.id;return z;}
  function add(z){if(commit(()=>G.roofs.push(z))){selected=z.id;action=null;render();fit();}return z;}
  function fromPlan(){
    const segs=G.segs.filter(s=>s.tip!=='veranda'&&s.dis),fallback=G.segs.filter(s=>s.tip!=='veranda'),p=(segs.length?segs:fallback).flatMap(s=>[getNode(s.n1),getNode(s.n2)].filter(Boolean).flatMap(n=>[{x:n.x-s.k/2,y:n.y-s.k/2},{x:n.x+s.k/2,y:n.y+s.k/2}]));
    if(!p.length){notice('Önce kat planını çizin veya “Bölüm çiz” ile çatı alanı belirleyin.',true);return;}
    const x=Math.min(...p.map(p=>p.x)),y=Math.min(...p.map(p=>p.y)),w=Math.max(...p.map(p=>p.x))-x,d=Math.max(...p.map(p=>p.y))-y;
    const gableMm=Number($('roofDrawGable')?.value??220),sideMm=Number($('roofDrawSide')?.value??300);
    add(make({x,y,w,d,datum:'trim',fasciaDepth:12,eaveRule:{gableMm,sideMm},vergeWidth:gableMm,eaves:[gableMm/10,gableMm/10,sideMm/10,sideMm/10],type:'besik',name:G.roofs.length?'Yeni ana çatı':'Ana çatı'}));notice('Dış sınırların dikdörtgen zarfı oluşturuldu. L / T planlarda bölümleri ölçülerine göre düzenleyip birleştirin.');
  }
  function fromVeranda(){
    const room=G.rooms.find(r=>r.id===$('roofVerandaRoom').value);if(!room){notice('Kat planında önce veranda alanını tanımlayın.',true);return;}
    const existing=G.roofs.find(z=>z.sourceRoomId===room.id),parent=G.roofs.find(z=>z.id===$('roofVerandaParent').value);
    if(!parent){notice('Önce ana çatıyı oluşturun ve bağlantı listesinden seçin.',true);return;}
    const pts=room.nodeIds.map(getNode).filter(Boolean);if(pts.length<4)return;
    const a=pts[0],b=pts.find(p=>Math.hypot(p.x-a.x,p.y-a.y)>1),angle=(Math.atan2(b.y-a.y,b.x-a.x)*180/Math.PI+360)%360,frame={x:a.x,y:a.y,angle},local=pts.map(p=>C.untransform(frame,p)),xs=local.map(p=>p.x),ys=local.map(p=>p.y),minx=Math.min(...xs),miny=Math.min(...ys),w=Math.max(...xs)-minx,d=Math.max(...ys)-miny;
    if(Math.abs(C.area(pts)-w*d)>.1){notice('Bu veranda dikdörtgen değil; kat planında dikdörtgen bölümlere ayırın.',true);return;}
    const origin=C.transform(frame,{x:minx,y:miny}),choice=$('roofVerandaType').value;
    let z=make({...origin,w,d,angle,type:'tek',sourceRoomId:room.id,eaves:[30,30,30,30],h:parent.h,...(existing?{id:existing.id,layers:existing.layers,fasciaDepth:existing.fasciaDepth,vergeWidth:existing.vergeWidth,material:existing.material,width:existing.width,packageArea:existing.packageArea,floorLevel:existing.floorLevel}:{}),name:(room.ozelAd||'Veranda')+' · '+(choice==='karga'?'Karga burun':TYPES[choice])});
    const center=C.transform(parent,{x:parent.w/2,y:parent.d/2});let best=z,score=Infinity;for(let i=0;i<4;i++){const candidate=C.turn(z,i),p=C.transform(candidate,{x:candidate.w/2,y:candidate.d});const dist=Math.hypot(p.x-center.x,p.y-center.y);if(dist<score){best=candidate;score=dist;}}z=best;
    const base=Object.fromEntries(['x','y','w','d','angle','eaves'].map(k=>[k,z[k]]));base.eaves=existing?.attachment?[...existing.attachment.base.eaves]:[30,30,30,0];
    z.attachment={parentId:parent.id,mode:choice,base,pitch:choice==='tek'?5:33,gap:10,minClearance:210};
    if(existing?.attachment?.mode===choice)Object.assign(z.attachment,{pitch:existing.attachment.pitch,gap:existing.attachment.gap,minClearance:existing.attachment.minClearance});
    if(commit(()=>{const i=G.roofs.findIndex(r=>r.id===z.id);if(i<0)G.roofs.push(z);else G.roofs[i]=z;})){selected=z.id;render();fit();}
  }

  function open(){window.RoofWorkflow?.ensure();if(!dialog.open)dialog.showModal();action=null;selected=get()?.id||G.roofs[0]?.id||null;render();requestAnimationFrame(fit);}
  function close(){window.RoofWorkflow?.cancel();dialog.close();action=null;drag=null;}
  function field(k,label,v,type='number',extra=''){if(type==='number'&&Number.isFinite(v))v=Math.round(v*10000)/10000;return `<label>${label}<input id="rz_${k}" name="${k}" type="${type}" value="${escape(String(v))}" ${type==='number'?'step="any"':''} ${extra}></label>`;}
  function attachmentFields(z){
    if(!z.attachment)return '';const l=z.attachment;
    return '<details open><summary>Veranda bağlantısı · '+(l.mode==='karga'?'Ana eğimin devamı':TYPES[l.mode])+'</summary><p>Konum ve birleşim ana çatıya bağlıdır. Tür değiştirmek için soldaki veranda seçimini kullanıp güncelleyin.</p>'+ (l.mode==='karga'?'<p>Eğim ana çatıdan alınır.</p>':field('link_pitch','Veranda eğimi %',l.pitch,'number','min="1" max="200"'))+(l.mode==='tek'?field('link_gap','Ana saçaktan aşağı mesafe (cm)',l.gap,'number','min="0" max="100"')+field('link_minClearance','Minimum ön açıklık (cm)',l.minClearance,'number','min="100" max="500"'):'')+'<p><b>Ön kenar / döşeme: '+number(z.frontClearance,1)+' cm</b>'+(z.frontClearance<l.minClearance?' · Seçilen minimum açıklığın altında; ana çatı kotunu / eğimini düzenleyin.':'')+'</p><p>Ölçü çatı düzlemine kadardır; kaplama ve taşıyıcı kalınlığı dahil değildir. Veranda açık, direkler 10 × 10 cm gösterilir.</p>'+l.base.eaves.slice(0,3).map((v,i)=>field('link_e'+i,['Sol saçak','Sağ saçak','Ön saçak','Birleşim tarafı payı'][i],v,'number','min="0" max="500"')).join('')+'<input type="hidden" name="link_e3" value="0"><p>Ana çatı birleşiminde ayrıca saçak eklenmez.</p></details>';
  }
  function layerFields(z){
    const chosen=C.layers(z,!!G.opt.osb),all=[...chosen,...C.LAYERS.filter(d=>!chosen.some(l=>l.id===d.id))];
    return '<details open><summary>Alt kaplama katmanları</summary><p>Üst örtünün altına istediğiniz katmanları ekleyin. Sıra yukarıdan aşağıdır; oklarla değiştirin. Plaka / rulo ölçülerini kullandığınız ürüne göre girin. Yerleşim taslağı kesim artıklarını yeniden kullanmaz.</p><div id="roofLayerFields">'+all.map(l=>{const def=C.LAYERS.find(d=>d.id===l.id);return '<fieldset data-layer="'+l.id+'"><label class="roof-check"><input type="checkbox" name="layer_'+l.id+'" '+(chosen.some(d=>d.id===l.id)?'checked':'')+'>'+def.name+'</label><button type="button" data-layer-move="-1">↑ Üste</button><button type="button" data-layer-move="1">↓ Alta</button><div class="roof-grid">'+[['width','Plaka / rulo eni (cm)'],['length','Plaka / rulo boyu (cm)'],['overlapWidth','En bindirmesi (cm)'],['overlapLength','Boy bindirmesi (cm)'],['fire','Ek sipariş fire %']].map(([k,label])=>field('layer_'+l.id+'_'+k,label,l[k],'number','min="0"')).join('')+'</div></fieldset>';}).join('')+'</div></details>';
  }
  function properties(){
    const z=get();if(!z){$('roofProperties').innerHTML='<h3>ÇATI DÜZENLEME</h3><p>Bir bölüm ekleyin veya çizimdeki çatıya tıklayın. Duvarlar altlık olarak gösterilir.</p><p>Varsayılan eğim %33, saçak 30 cm. Konum ve boyutlar dış duvar yüzünden alınır; saçak ayrıca eklenir.</p>';return;}
    if(lastPropertyId!==z.id){$('roofProperties').scrollTop=0;lastPropertyId=z.id;}
    const mat=materials().find(m=>m.id===z.material),sheet=mat.unit==='sheet';
    $('roofProperties').innerHTML=`<h3>BÖLÜM ÖZELLİKLERİ</h3><form id="roofForm">${field('name','Bölüm adı',z.name,'text','maxlength="100"')}${attachmentFields(z)}${field('fasciaDepth','3B saçak kapama yüksekliği (cm)',z.fasciaDepth??15,'number','min="0" max="50"')}<p>Yatay saçak kapamasının görsel yüksekliğidir; duvardan taşma mesafesi değildir.</p><label>Alın V · alt kanat genişliği<select name="vergeWidth" id="rz_vergeWidth"><option value="220" ${(z.vergeWidth??220)===220?'selected':''}>220 mm</option><option value="400" ${z.vergeWidth===400?'selected':''}>400 mm</option><option value="custom" ${![220,400].includes(z.vergeWidth??220)?'selected':''}>Özel ölçü</option></select></label><label>Özel Alın V alt kanadı · mm<input id="rz_vergeCustom" name="vergeCustom" type="number" min="1" max="5000" value="${z.vergeWidth??220}"></label><p>2800 mm stok · 0,50 mm sac. Alın V ve mahya 3B'de şematik kapama olarak gösterilir; büküm detayları imalat kesiti değildir. Saçak taşması aşağıda ayrı ayarlanır.</p><label>Çatı biçimi<select name="type" id="rz_type">${Object.entries(TYPES).map(([v,n])=>`<option value="${v}" ${v===z.type?'selected':''}>${n}</option>`).join('')}</select></label><div><button type="button" id="roofTurn">Yönü 90° değiştir</button><button type="button" id="roofReverse">Eğimi ters çevir · 180°</button></div><p>Yön düğmeleri dikdörtgen çatı sınırını yerinde tutar. Kırmada eşit eğim nedeniyle mahya uzun doğrultuda kalır.</p><label>Kot referansı<select name="datum" id="rz_datum"><option value="wall" ${(z.datum??'wall')==='wall'?'selected':''}>Duvar yüzünde çatı kotu (eski hesap)</option><option value="eave" ${z.datum==='eave'?'selected':''}>Çatı yüzeyinin en düşük kotu (eski)</option><option value="trim" ${z.datum==='trim'?'selected':''}>Saçak kapamasının alt uç kotu</option></select></label><div class="roof-grid">${field('x','Başlangıç X',z.x)}${field('y','Başlangıç Y',z.y)}${field('w','Yerel X uzunluğu',z.w,'number','min="10" max="20000"')}${field('d','Yerel Y açıklığı',z.d,'number','min="10" max="20000"')}${field('angle','Planda dönüş °',z.angle,'number','min="0" max="359"')}${field('wallTop','Duvar üst kotu (cm)',z.wallTop??(+G.opt.h||250),'number','min="1" max="20000"')}${field('floorLevel','Döşeme kotu (cm)',z.floorLevel??0,'number','min="0" max="20000"')}${field('h','Referans kotu (cm)',z.h,'number','min="0" max="20000"')}${field('pitch','Eğim %',z.pitch,'number','min="1" max="200"')}${field('ridge','Mahya yeri % (beşik)',z.ridge,'number','min="10" max="90" '+(z.type!=='besik'?'disabled':''))}</div><p>0° beşikte mahya X yönündedir. Eşit eğimli kırmada mahya uzun doğrultudadır. Tek eğimde yüksek kenar +Y tarafıdır; 180° tersine çevirir. Kot seçilen referansa aittir. Kapama alt uç referansında en düşük kapama ucu bu kotta kalır; çatı yüzeyi kapama yüksekliği kadar yukarı alınır. Eski saçak referansında çatı yüzeyi bu kotta kalır; duvar yüzü referansında saçak eğimle aşağı iner. Beşikte kaydırılan mahya karşı eğimi değiştirir.</p><details open><summary>Saçaklar ve birleşim</summary><div class="roof-grid">${z.eaves.map((e,i)=>field('e'+i,['Sol / −X','Sağ / +X','Ön / −Y','Arka / +Y'][i],e,'number','min="0" max="500"')).join('')}</div><p>Yönler bölümün dönmeden önceki yerel yönleridir. Çokgen çıkmada tüm kenarlar için “Sol” değeri kullanılır.</p><label>Birleşim grubu<select id="rz_group" name="group">${[...new Set(G.roofs.map(r=>r.group))].map(g=>`<option value="${escape(g)}" ${g===z.group?'selected':''}>${escape(G.roofs.find(r=>r.group===g)?.name||g)} grubu</option>`).join('')}<option value="__new">Ayrı çatı grubu oluştur</option></select></label><p>Aynı gruptaki kesişen bölümlerin üstte kalan yüzeyi hesaplanır. Farklı kotta bağımsız sundurmayı ayrı grupta tutun. Eğim devamı için aynı düzlem ve kotu verin.</p>${field('parapet','Parapet / gizleyici alın yüksekliği',z.parapet,'number','min="0" max="300"')}<p>Parapet 3B görünümü değiştirir. Altta eğimli çatı bulunur; drenaj ve parapet kaplaması kesim listesine dahil değildir.</p><label class="roof-check"><input name="gutters" type="checkbox" ${z.gutters?'checked':''}> Açık saçaklarda oluk hesapla</label></details>
    <details open><summary>Üst çatı örtüsü</summary><label>Kaplama<select name="material" id="rz_material">${materials().map(m=>`<option value="${m.id}" ${m.id===z.material?'selected':''}>${escape(m.name)}</option>`).join('')}</select></label><div id="roofMaterialFields">${sheet?`<label>Net kapatma eni (cm)<select name="width" id="rz_width">${mat.widths.map(w=>`<option value="${w}" ${w===z.width?'selected':''}>${w} cm</option>`).join('')}</select></label>`:mat.unit==='package'?field('packageArea','Paket başına bitmiş yüzey (m²)',z.packageArea,'number','min="0.1" max="100"'):''}</div><div class="roof-grid">${field('allowance','Levha boy ilavesi (cm)',z.allowance,'number','min="0" max="100"')}${field('maxLength','Azami boy · 0 = sınırsız',z.maxLength,'number','min="0" max="20000"')}${field('lap','Boy eki bindirmesi (cm)',z.lap,'number','min="0" max="200"')}${field('fire','Alan / paket fire %',z.fire,'number','min="0" max="100"')}</div><p>Levhalar eğim doğrultusunda döşenir; listelenen boy, şeridi kapsayan kesim taslağıdır. Fire levha adedine tekrar eklenmez. Boy ilavesi ve boy sınırı isteğe bağlıdır.</p>${mat.id==='shingle'?`<p><a href="${mat.source}" target="_blank" rel="noopener">BTM ürün bilgisi</a>: 2,52 m²/paket; önerilen minimum eğim %20. Paket alanını kullandığınız ürüne göre değiştirin.</p>`:''}<button type="button" id="roofMaterialAdd">＋ Yeni kaplama türü</button></details>${layerFields(z)}<button type="submit" class="primary" id="roofApply">Değişiklikleri uygula</button></form><div><button id="roofDuplicate">Kopyala</button><button id="roofRemove" class="roof-danger">Bölümü sil</button></div><div id="roofMaterialEditor" hidden></div>`;
    $('roofForm').onsubmit=e=>{e.preventDefault();applyForm();};$('rz_material').onchange=()=>{const m=materials().find(m=>m.id===$('rz_material').value);$('roofMaterialFields').innerHTML=m.unit==='sheet'?`<label>Net kapatma eni (cm)<select id="rz_width" name="width">${m.widths.map(w=>`<option value="${w}" ${w===100?'selected':''}>${w} cm</option>`).join('')}</select></label>`:m.unit==='package'?field('packageArea','Paket başına bitmiş yüzey (m²)',m.packageArea,'number','min="0.1" max="100"'):'';};
    $('rz_type').onchange=()=>{$('rz_ridge').disabled=$('rz_type').value!=='besik';};
    for(const [key,steps] of [['roofTurn',1],['roofReverse',2]]){$(key).disabled=z.type==='bay'||!!z.attachment;$(key).onclick=()=>applyForm(steps);}
    $('roofDuplicate').disabled=!!z.attachment;
    $('roofDuplicate').onclick=()=>add(make({...clone(z),id:id(),name:z.name+' kopya',sourceRoomId:undefined,x:z.x+z.w+100,group:undefined}));
    $('roofRemove').onclick=()=>{const old=selected;if(commit(()=>G.roofs=G.roofs.filter(r=>r.id!==old))){selected=G.roofs[0]?.id||null;render();}};
    $('roofMaterialAdd').onclick=materialForm;
    $('roofLayerFields').querySelectorAll('[data-layer-move]').forEach(button=>button.onclick=()=>{const row=button.closest('fieldset');if(button.dataset.layerMove==='-1'&&row.previousElementSibling)row.previousElementSibling.before(row);else if(button.dataset.layerMove==='1'&&row.nextElementSibling)row.nextElementSibling.after(row);});
    if(z.attachment){for(const key of ['type','x','y','w','d','angle','datum','h','pitch','group','e0','e1','e2','e3'])$('rz_'+key).disabled=true;}

  }
  function applyForm(steps=0){const z=get();if(!z||!$('roofForm').reportValidity())return;const data=new FormData($('roofForm')),next=clone(z);
    for(const k of ['name','type','group','material','datum'])if(data.has(k))next[k]=data.get(k);for(const k of ['x','y','w','d','h','wallTop','floorLevel','angle','pitch','allowance','maxLength','lap','fire','parapet','fasciaDepth','vergeWidth'])if(data.has(k))next[k]=Number(data.get(k));
    if(data.get('vergeWidth')==='custom')next.vergeWidth=Number(data.get('vergeCustom'));
    next.layers=[...$('roofLayerFields').querySelectorAll('[data-layer]')].filter(row=>data.has('layer_'+row.dataset.layer)).map(row=>{const id=row.dataset.layer;return {id,...Object.fromEntries(['width','length','overlapWidth','overlapLength','fire'].map(k=>[k,Number(data.get('layer_'+id+'_'+k))]))};});
    next.ridge=data.has('ridge')?Number(data.get('ridge')):z.ridge;next.eaves=[0,1,2,3].map(i=>data.has('e'+i)?Number(data.get('e'+i)):z.eaves[i]);next.gutters=data.has('gutters');if(next.group==='__new')next.group=id();
    const m=materials().find(m=>m.id===next.material);next.width=m.unit==='sheet'?Number(data.get('width')):100;next.packageArea=m.unit==='package'?Number(data.get('packageArea')):2.52;
    if(next.attachment){for(const k of ['pitch','gap','minClearance'])if(data.has('link_'+k))next.attachment[k]=Number(data.get('link_'+k));next.attachment.base.eaves=[0,1,2,3].map(i=>Number(data.get('link_e'+i)));}
    if(window.RoofWorkflow)return RoofWorkflow.apply(z,next,steps,data);
    return commit(()=>G.roofs[G.roofs.findIndex(r=>r.id===z.id)]=steps?C.turn(next,steps):next);
  }
  function materialForm(){const el=$('roofMaterialEditor');el.hidden=false;el.innerHTML=`<form class="roof-material-form" id="roofNewMaterial"><h3>YENİ KAPLAMA</h3><label>Ad<input name="name" required maxlength="100"></label><label>Hesap birimi<select name="unit"><option value="sheet">En × boy levha</option><option value="package">Paket</option><option value="area">m²</option></select></label><label>Net kapatma eni (cm)<input name="width" type="number" min="10" max="500" value="100"></label><label>Paket kaplama alanı (m²)<input name="coverage" type="number" min="0.1" max="100" step="any" value="3"></label><label>Renk<input name="color" type="color" value="#84939d"></label><button class="primary">Kaplamayı ekle</button></form>`;
    $('roofNewMaterial').onsubmit=e=>{e.preventDefault();const d=new FormData(e.target),m={id:'custom_'+Date.now().toString(36),name:d.get('name').trim(),unit:d.get('unit'),widths:[+d.get('width')],packageArea:+d.get('coverage'),color:d.get('color')};commit(()=>{G.roofMaterials.push(m);const z=get();z.material=m.id;z.width=m.widths[0];z.packageArea=m.packageArea;});};el.scrollIntoView({block:'nearest'});
  }
  function bounds(){const points=G.roofs.flatMap(z=>C.footprint(z).map(p=>C.transform(z,p)));G.nodes.forEach(n=>points.push(n));if(!points.length)return {x:0,y:0,w:1200,d:900};const x=Math.min(...points.map(p=>p.x)),y=Math.min(...points.map(p=>p.y));return {x,y,w:Math.max(...points.map(p=>p.x))-x,d:Math.max(...points.map(p=>p.y))-y};}
  function fit(){const r=$('roofStage').getBoundingClientRect(),b=bounds();view.scale=Math.max(.01,Math.min((r.width-100)/Math.max(b.w,100),(r.height-115)/Math.max(b.d,100)));view.x=r.width/2-(b.x+b.w/2)*view.scale;view.y=r.height/2+20-(b.y+b.d/2)*view.scale;paint();}
  function at(p){return {x:p.x*view.scale+view.x,y:p.y*view.scale+view.y};}
  function world(e){const r=$('roofCanvas').getBoundingClientRect();return {x:(e.clientX-r.left-view.x)/view.scale,y:(e.clientY-r.top-view.y)/view.scale};}
  function path(ctx,poly,project){ctx.beginPath();poly.forEach((p,i)=>{const q=project(p);if(i)ctx.lineTo(q.x,q.y);else ctx.moveTo(q.x,q.y);});ctx.closePath();}
  function verandaStructure(z){
    const b=z.attachment?.base||z,fs=C.zoneFaces(z),items=[],floor=z.floorLevel||0,top=p=>Math.min(...fs.map(f=>C.height(f,p)));
    const corners=z.attachment?[{x:0,y:0},{x:b.w,y:0}]:C.basePolygon(b);
    for(const c of corners){const poly=[[-5,-5],[5,-5],[5,5],[-5,5]].map(([x,y])=>C.transform(b,{x:c.x+x,y:c.y+y})),level=top(C.transform(b,c));poly.forEach((p,i)=>{const q=poly[(i+1)%4];items.push({kind:'post',poly:[{...p,z:floor},{...q,z:floor},{...q,z:level},{...p,z:level}],color:'#aebdcc',shade:.9});});}
    if(z.type==='besik'){
      const x=0,ys=[0,z.d*z.ridge/100,z.d],ps=ys.map(y=>C.transform(z,{x,y})),hs=ps.map(top),base=Math.min(hs[0],hs[2]);
      items.push({kind:'cladding',poly:[{...ps[0],z:base},...ps.map((p,i)=>({...p,z:hs[i]})),{...ps[2],z:base}],color:'#bbc2b5',shade:1});
    }
    return items;
  }
  function vergeEdges(m){return m.edges.filter(e=>['verge','step'].includes(e.type)&&e.length>0);}
  function roofShade(f){return Math.min(1.15,Math.max(.65,.9+f.a*.25-f.b*.3));}
  function roofColor(id){const z=G.roofs.find(z=>z.id===id);return materials().find(m=>m.id===z?.material)?.color||'#8391a5';}
  function darken(hex){return '#'+[1,3,5].map(i=>Math.round(parseInt(hex.slice(i,i+2),16)*.72).toString(16).padStart(2,'0')).join('');}
  function edges3D(m){return m.edges.map(e=>['ridge','hip'].includes(e.type)?{...e,color:darken(roofColor(e.zoneId))}:e.type==='step'?{...e,color:'#d8dedc'}:e);}
  function trimSurfaces(m){
    const out=[];
    for(const e of m.edges.filter(e=>['verge','step','ridge','hip'].includes(e.type))){
      const zone=G.roofs.find(z=>z.id===e.zoneId);if(zone?.parapet)continue;
      const L=Math.hypot(e.q.x-e.p.x,e.q.y-e.p.y);if(L<.001)continue;
      const topOffset=zone?.datum==='trim'?0:.8,bottomOffset=topOffset-12;
      const isVerge=['verge','step'].includes(e.type),width=isVerge?8:12,n={x:-(e.q.y-e.p.y)/L*width,y:(e.q.x-e.p.x)/L*width};
      const strip=[{x:e.p.x+n.x,y:e.p.y+n.y},{x:e.q.x+n.x,y:e.q.y+n.y},{x:e.q.x-n.x,y:e.q.y-n.y},{x:e.p.x-n.x,y:e.p.y-n.y}].reverse();
      for(const face of m.faces.filter(f=>f.group===e.group))for(const tri of C.triangulate(face.poly)){
        const poly=C.intersect(tri,strip);if(poly.length<3||C.area(poly)<.001)continue;
        const mid={x:(e.p.x+e.q.x)/2,y:(e.p.y+e.q.y)/2};if(Math.abs(C.height(face,mid)-(e.p.z+e.q.z)/2)>.1)continue;
        out.push({kind:isVerge?'vergeTrim':'ridgeCap',edgeType:e.type,zone:face.zoneId,poly:poly.map(p=>({...p,z:C.height(face,p)+(isVerge?topOffset:.4)})),color:isVerge?'#f0f1e8':roofColor(face.zoneId),shade:isVerge?.95:roofShade(face)*.82});
      }
      // Bottom return closes the underside; variant width belongs here, not on the top flange.
      if(isVerge){
        const width=(zone?.vergeWidth??220)/10,n={x:-(e.q.y-e.p.y)/L*width,y:(e.q.x-e.p.x)/L*width};
        const strip=[{x:e.p.x+n.x,y:e.p.y+n.y},{x:e.q.x+n.x,y:e.q.y+n.y},{x:e.q.x-n.x,y:e.q.y-n.y},{x:e.p.x-n.x,y:e.p.y-n.y}].reverse();
        for(const face of m.faces.filter(f=>f.group===e.group)){
          const mid={x:(e.p.x+e.q.x)/2,y:(e.p.y+e.q.y)/2};
          if(Math.abs(C.height(face,mid)-(e.p.z+e.q.z)/2)>.1)continue;
          for(const tri of C.triangulate(face.poly)){
            const poly=C.intersect(tri,strip);if(poly.length<3||C.area(poly)<.001)continue;
            out.push({kind:'vergeBottom',edgeType:e.type,zone:face.zoneId,poly:poly.map(p=>({...p,z:C.height(face,p)+bottomOffset})),color:'#d8dedc',shade:.8});
          }
        }
      }
      if(isVerge)out.push({kind:'vergeLip',edgeType:e.type,zone:e.zoneId,poly:[{...e.p,z:e.p.z+topOffset},{...e.q,z:e.q.z+topOffset},{...e.q,z:e.q.z+bottomOffset},{...e.p,z:e.p.z+bottomOffset}],color:'#d8dedc',shade:.87});
    }
    return out;
  }
  function fasciaSurfaces(m){
    return m.edges.filter(e=>['eave','high'].includes(e.type)).flatMap(e=>{
      const z=G.roofs.find(z=>z.id===e.zoneId),depth=z?.fasciaDepth??15;if(!depth||z?.parapet)return [];
      return [{kind:'fascia',zone:e.zoneId,poly:[e.p,e.q,{...e.q,z:e.q.z-depth},{...e.p,z:e.p.z-depth}],color:'#d8dedc',shade:e.type==='verge'?.87:1}];
    });
  }
  // Close only exposed eave strips, from the support face to the fascia bottom.
  function soffitSurfaces(m){
    const out=[];
    for(const e of m.edges.filter(e=>['eave','high'].includes(e.type))){
      const z=G.roofs.find(z=>z.id===e.zoneId);if(!z||z.parapet)continue;
      const base=z.childJoin?.support||C.basePolygon(z).map(p=>C.transform(z,p));
      const dx=e.q.x-e.p.x,dy=e.q.y-e.p.y,L=Math.hypot(dx,dy);if(L<.001)continue;
      const mid={x:(e.p.x+e.q.x)/2,y:(e.p.y+e.q.y)/2};
      const candidates=base.map((a,i)=>{const b=base[(i+1)%base.length],ex=b.x-a.x,ey=b.y-a.y,l=Math.hypot(ex,ey);if(!l||Math.abs(dx*ey-dy*ex)>L*l*.00001)return null;const t=((mid.x-a.x)*ex+(mid.y-a.y)*ey)/(l*l);if(t<-.01||t>1.01)return null;const q={x:a.x+t*ex,y:a.y+t*ey};return {x:q.x-mid.x,y:q.y-mid.y};}).filter(Boolean).sort((a,b)=>Math.hypot(a.x,a.y)-Math.hypot(b.x,b.y));
      const n=candidates[0];if(!n||Math.hypot(n.x,n.y)<.001)continue;
      let strip=[e.p,e.q,{x:e.q.x+n.x,y:e.q.y+n.y},{x:e.p.x+n.x,y:e.p.y+n.y}];if(strip.reduce((v,p,i)=>{const q=strip[(i+1)%4];return v+p.x*q.y-q.x*p.y;},0)<0)strip.reverse();
      for(const f of m.faces.filter(f=>f.zoneId===e.zoneId))for(const tri of C.triangulate(f.poly)){
        const poly=C.intersect(tri,strip);if(poly.length<3||C.area(poly)<.001)continue;
        const depth=z.fasciaDepth??15;
        out.push({kind:'soffit',zone:z.id,poly:poly.map(p=>{const t=((p.x-e.p.x)*dx+(p.y-e.p.y)*dy)/(L*L);return {...p,z:e.p.z+(e.q.z-e.p.z)*t-depth};}),color:'#d8dedc',shade:.88});
      }
    }return out;
  }
  // Building walls belong to the floor plan, never to a roof's bounding box.
  function planStructure(){
    const items=[],top=Number(G.opt.h)||280,roofFaces=model().faces,betopan=Wall3D.panelColor;
    const claddingShade=poly=>{const a=poly[0],b=poly.find(p=>Math.hypot(p.x-a.x,p.y-a.y)>.001)||a;return .78+.18*Math.abs(b.x-a.x)/Math.max(.001,Math.hypot(b.x-a.x,b.y-a.y));};
    for(const z of G.roofs){if(!z.childJoin)continue;const parent=G.roofs.find(p=>p.id===z.production?.parentId);if(!parent)continue;const joined=C.connectChild(z,parent);for(const poly of joined.childJoin.cladding||[])items.push({kind:'cladding',zone:z.id,poly,color:betopan,shade:claddingShade(poly)});}
    for(const s of G.segs){
      if(s.tip==='veranda')continue;
      const a=getNode(s.n1),b=getNode(s.n2);if(!a||!b)continue;
      const dx=b.x-a.x,dy=b.y-a.y,L=Math.hypot(dx,dy);if(L<.001)continue;
      const nx=-dy/L*s.k/2,ny=dx/L*s.k/2;
      const poly=[{x:a.x+nx,y:a.y+ny},{x:b.x+nx,y:b.y+ny},{x:b.x-nx,y:b.y-ny},{x:a.x-nx,y:a.y-ny}];
      for(let i=0;i<4;i++){const p=poly[i],q=poly[(i+1)%4];items.push({poly:[{...p,z:0},{...q,z:0},{...q,z:top},{...p,z:top}],color:'#35414d',segmentId:s.id,shade:.85+.15*Math.abs(q.x-p.x)/Math.hypot(q.x-p.x,q.y-p.y)});}
      items.push({poly:poly.map(p=>({...p,z:top})),color:'#718292',segmentId:s.id});
    }
    // Gable infill follows the roof support boundary, independently of floor walls.
    for(const z of G.roofs){if(z.type!=='besik')continue;const base=z.childJoin?.support?z.childJoin.support.map(p=>C.untransform(z,p)):C.basePolygon(z),faces=C.zoneFaces(z),level=z.wallTop??top;
     base.forEach((v,i)=>{let w=base[(i+1)%base.length];if(Math.abs(v.x-w.x)>.001)return;
      // Continue gable infill through the small eave-end triangles to the trim.
      const footprint=C.footprint(z);
      if(z.childJoin){v={...v,y:v.y<z.d/2?-z.eaves[2]:z.d+z.eaves[3]};w={...w,y:w.y<z.d/2?-z.eaves[2]:z.d+z.eaves[3]};}
      else if(footprint.length===base.length){v={...v,y:footprint[i].y};w={...w,y:footprint[(i+1)%base.length].y};}
      const a=C.transform(z,v),b=C.transform(z,w),dx=b.x-a.x,dy=b.y-a.y,L=Math.hypot(dx,dy);if(!L)return;
      let nx=-dy/L,ny=dx/L;const mid={x:(a.x+b.x)/2,y:(a.y+b.y)/2};if(C.pointIn(base,C.untransform(z,{x:mid.x+nx*.1,y:mid.y+ny*.1}))){nx=-nx;ny=-ny;}
      const otherFaces=G.roofs.filter(other=>other.id!==z.id&&other.group===z.group).flatMap(other=>C.zoneFaces(other));
      const cuts=[0,1];for(const f of [...faces,...roofFaces,...otherFaces])f.poly.forEach((p,j)=>{const q=f.poly[(j+1)%f.poly.length],ex=q.x-p.x,ey=q.y-p.y,D=dx*ey-dy*ex;if(Math.abs(D)<1e-8)return;const t=((p.x-a.x)*ey-(p.y-a.y)*ex)/D,u=((p.x-a.x)*dy-(p.y-a.y)*dx)/D;if(t>0&&t<1&&u>=0&&u<=1)cuts.push(t);});cuts.sort((a,b)=>a-b);
      for(let j=1;j<cuts.length;j++){const t=cuts[j-1],u=cuts[j];if(u-t<1e-6)continue;const m={x:a.x+dx*(t+u)/2,y:a.y+dy*(t+u)/2};

       const f=faces.find(f=>C.contains(f.poly,m));if(!f)continue;const p={x:a.x+dx*t,y:a.y+dy*t},q={x:a.x+dx*u,y:a.y+dy*u},hp=Math.max(level,C.height(f,p)),hq=Math.max(level,C.height(f,q));if(Math.max(hp,hq)<=level+.01)continue;
       let poly=[{...p,z:level},{...q,z:level},{...q,z:hq},{...p,z:hp}];
       // A neighbouring footprint hides only the portion below its roof,
       // not the whole gable. Keep exposed infill above lower roofs.
       for(const cover of otherFaces.filter(f=>C.contains(f.poly,{x:m.x+nx*.1,y:m.y+ny*.1}))){
        const clipped=[],delta=v=>v.z-C.height(cover,{x:v.x+nx*.1,y:v.y+ny*.1});
        poly.forEach((v,k)=>{const w=poly[(k+1)%poly.length],a=delta(v),b=delta(w);if(a>=0)clipped.push(v);if((a>=0)!==(b>=0)){const t=a/(a-b);clipped.push({x:v.x+(w.x-v.x)*t,y:v.y+(w.y-v.y)*t,z:v.z+(w.z-v.z)*t});}});poly=clipped;if(poly.length<3)break;
       }
       if(poly.length>=3)items.push({kind:'cladding',zone:z.id,roofBoundary:true,poly,color:betopan,shade:claddingShade(poly)});
      }
     });
    }
    items.push(...gableOmegaSurfaces(items));
    return items;
  }
  // Measured head-truss omega, cm: clear width 6/10/15, web 3,
  // exterior return 1.2 + upstand 2, interior flange 2.5; sheet 0.1.
  function gableOmegaSurfaces(structure){
    const out=[],seen=new Set();
    for(const f of structure.filter(f=>f.roofBoundary)){
      const zone=G.roofs.find(z=>z.id===f.zone),level=zone?.wallTop??(Number(G.opt.h)||280);
      const bottom=f.poly.filter(p=>Math.abs(p.z-level)<.001);if(bottom.length<2)continue;
      const a=bottom[0],b=bottom[1],dx=b.x-a.x,dy=b.y-a.y,L=Math.hypot(dx,dy);if(L<.01)continue;
      const ux=dx/L,uy=dy/L;let nx=-uy,ny=ux;
      const base=zone.childJoin?.support||C.basePolygon(zone).map(p=>C.transform(zone,p));
      if(C.pointIn(base,{x:(a.x+b.x)/2+nx*.1,y:(a.y+b.y)/2+ny*.1})){nx=-nx;ny=-ny;}
      for(const wall of G.segs){if(wall.tip==='veranda'||![6,10,15].includes(Number(wall.k)))continue;
        const p=getNode(wall.n1),q=getNode(wall.n2);if(!p||!q)continue;
        const len=Math.hypot(q.x-p.x,q.y-p.y);if(!len||Math.abs((q.x-p.x)*uy-(q.y-p.y)*ux)/len>.001)continue;
        const offset=(p.x-a.x)*nx+(p.y-a.y)*ny,k=Number(wall.k);
        if(Math.abs(offset)>k/2+.5)continue;
        const pt=(p.x-a.x)*ux+(p.y-a.y)*uy,qt=(q.x-a.x)*ux+(q.y-a.y)*uy;
        const lo=Math.max(0,Math.min(pt,qt)),hi=Math.min(L,Math.max(pt,qt));if(hi-lo<.01)continue;
        const key=[wall.id,level,...[a.x+ux*lo,a.y+uy*lo,a.x+ux*hi,a.y+uy*hi].map(v=>v.toFixed(3))].join('|');if(seen.has(key))continue;seen.add(key);
        const point=(t,n,z)=>({x:a.x+ux*t+nx*(offset+n),y:a.y+uy*t+ny*(offset+n),z});
        const strip=(n0,n1,z0,z1,part)=>{
          const v=[point(lo,n0,z0),point(hi,n0,z0),point(hi,n1,z0),point(lo,n1,z0),point(lo,n0,z1),point(hi,n0,z1),point(hi,n1,z1),point(lo,n1,z1)];
          for(const ids of [[0,1,2,3],[4,7,6,5],[0,4,5,1],[1,5,6,2],[2,6,7,3],[3,7,4,0]])out.push({kind:'gableOmega',zone:zone.id,segmentId:wall.id,part,widthMm:k*10,sheetMm:1,poly:ids.map(i=>v[i]),color:'#89949c',shade:part==='top'?1:.85});
        };
        strip(-k/2-.1,k/2+.1,level,level+.1,'top');
        strip(k/2,k/2+.1,level-3,level,'outerWeb');
        strip(-k/2-.1,-k/2,level-3,level,'innerWeb');
        strip(k/2+.1,k/2+1.3,level-3,level-2.9,'outerReturn');
        strip(k/2+1.2,k/2+1.3,level-3,level-1,'outerLip');
        strip(-k/2-2.6,-k/2-.1,level-3,level-2.9,'innerFlange');
      }
    }return out;
  }
  function projected3D(m,w,h){const points=[...m.faces.flatMap(f=>f.poly.map(p=>({...p,z:C.height(f,p)}))),...planStructure().flatMap(i=>i.poly)];Camera3D.state.yaw=angle;return Camera3D.project(points,w,h);}
  // Depth-buffered triangles avoid painter-order errors at crossing roofs and parapets.
  function raster3D(ctx,w,h,items,edges,project){
    const width=Math.ceil(w),height=Math.ceil(h),pixels=new Uint8ClampedArray(width*height*4),depth=new Float64Array(width*height),vergeMask=new Uint8Array(width*height);depth.fill(-Infinity);
    for(let i=0;i<pixels.length;i+=4){pixels[i]=13;pixels[i+1]=23;pixels[i+2]=34;pixels[i+3]=255;}
    const rgb=hex=>[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16));
    const glassDepth=new Float64Array(width*height),glassColor=new Float32Array(width*height*4);glassDepth.fill(-Infinity);
    for(const item of items){const poly=item.poly.map(project),color=rgb(item.color),shade=item.shade||1;
      for(let j=1;j<poly.length-1;j++){const a=poly[0],b=poly[j],c=poly[j+1],D=(b.y-c.y)*(a.x-c.x)+(c.x-b.x)*(a.y-c.y);if(Math.abs(D)<1e-6)continue;
        const x0=Math.max(0,Math.floor(Math.min(a.x,b.x,c.x))),x1=Math.min(width-1,Math.ceil(Math.max(a.x,b.x,c.x))),y0=Math.max(0,Math.floor(Math.min(a.y,b.y,c.y))),y1=Math.min(height-1,Math.ceil(Math.max(a.y,b.y,c.y)));
        for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++){const u=((b.y-c.y)*(x+.5-c.x)+(c.x-b.x)*(y+.5-c.y))/D,v=((c.y-a.y)*(x+.5-c.x)+(a.x-c.x)*(y+.5-c.y))/D,t=1-u-v;if(u<-.00001||v<-.00001||t<-.00001)continue;const d=u*a.depth+v*b.depth+t*c.depth,k=y*width+x;if(item.alpha<1){if(d>glassDepth[k]){glassDepth[k]=d;glassColor[k*4]=color[0]*shade;glassColor[k*4+1]=color[1]*shade;glassColor[k*4+2]=color[2]*shade;glassColor[k*4+3]=item.alpha;}continue;}if(d>=depth[k]){depth[k]=d;vergeMask[k]=['vergeTrim','vergeLip'].includes(item.kind)?1:0;pixels[k*4]=color[0]*shade;pixels[k*4+1]=color[1]*shade;pixels[k*4+2]=color[2]*shade;}}
      }
    }
    for(let k=0;k<depth.length;k++)if(glassDepth[k]>depth[k]){const a=glassColor[k*4+3];for(let c=0;c<3;c++)pixels[k*4+c]=pixels[k*4+c]*(1-a)+glassColor[k*4+c]*a;depth[k]=glassDepth[k];}
    for(const e of edges){const a=project(e.p),b=project(e.q),steps=Math.max(1,Math.ceil(Math.hypot(b.x-a.x,b.y-a.y)*2)),color=rgb(e.color||COLORS[e.type]||(e.type==='panel'?'#d9e8ed':'#879ba9'));for(let i=0;i<=steps;i++){const t=i/steps,x=Math.round(a.x+(b.x-a.x)*t),y=Math.round(a.y+(b.y-a.y)*t),d=a.depth+(b.depth-a.depth)*t;if(x<0||x>=width||y<0||y>=height)continue;const k=y*width+x;if(vergeMask[k]&&['ridge','hip'].includes(e.type)&&d<=depth[k]+2)continue;if(d>=depth[k]-2){pixels[k*4]=color[0];pixels[k*4+1]=color[1];pixels[k*4+2]=color[2];}}}
    const layer=document.createElement('canvas');layer.width=width;layer.height=height;layer.getContext('2d').putImageData(new ImageData(pixels,width,height),0,0);ctx.drawImage(layer,0,0);
  }
  function panelEdges3D(m,zoneId,layer='top'){
    const rows=(layer==='top'?m.cutList:m.layerCuts.filter(r=>r.layer===layer)).filter(r=>r.zoneId===zoneId),edges=[];
    for(const row of rows){const f=m.faces.find(f=>f.key===row.face&&f.zoneId===row.zoneId);if(!f)continue;
      for(const poly of row.polygons)poly.forEach((p,i)=>{const q=poly[(i+1)%poly.length];edges.push({type:'panel',p:{...p,z:C.height(f,p)},q:{...q,z:C.height(f,q)}});});
    }return edges;
  }
  function paint(target){
    if(!dialog.open&&!target)return;const cv=target||$('roofCanvas'),rect=$('roofStage').getBoundingClientRect(),w=target?cv.width:Math.max(1,rect.width),h=target?cv.height:Math.max(1,rect.height),ratio=target?1:devicePixelRatio||1;if(!target){cv.width=w*ratio;cv.height=h*ratio;}
    const ctx=cv.getContext('2d');ctx.setTransform(ratio,0,0,ratio,0,0);ctx.fillStyle='#0d1722';ctx.fillRect(0,0,w,h);let m;try{m=model();}catch(e){notice(e.message,true);return;}
    if(mode==='section'){section(ctx,w,h);return;}if(mode==='report')return;
    const drawEdge=(e,project)=>{const p=project(e.p),q=project(e.q);ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(q.x,q.y);ctx.strokeStyle=COLORS[e.type];ctx.lineWidth=['ridge','valley'].includes(e.type)?2:1;ctx.stroke();};
    if(mode==='3d'){
      const project=projected3D(m,w,h);
      const wallModel=showWallDetails&&isPref()?Wall3D.build():null;const items=wallModel?[...wallModel.surfaces,...planStructure().filter(s=>!hideRoof&&['cladding','gableOmega'].includes(s.kind))]:planStructure();if(wallModel)$('roofHint').textContent='Sol sürükle: döndür · Tekerlek: yakınlaş · Shift/orta tuş: kaydır · '+(wallModel.warnings.join(' ')||'Plan ölçülerinden üretilir; sürgü ile döndürün.');G.roofs.forEach(z=>{if(hideRoof)return;if(z.sourceRoomId){items.push(...verandaStructure(z).filter(item=>item.kind!=='cladding'));return;}
        if(z.parapet){const poly=C.footprint(z).map(p=>C.transform(z,p)),top=Math.max(...C.zoneFaces(z).flatMap(f=>f.poly.map(p=>C.height(f,p))))+z.parapet;poly.forEach((p,i)=>{const q=poly[(i+1)%poly.length];items.push({poly:[{...p,z:z.h},{...q,z:z.h},{...q,z:top},{...p,z:top}],color:'#77818b',zone:z.id});});}
      });
      if(!hideRoof)m.faces.forEach(f=>{const z=G.roofs.find(z=>z.id===f.zoneId),mat=materials().find(m=>m.id===z.material);items.push({poly:f.poly.map(p=>({...p,z:C.height(f,p)})),color:mat.color,zone:z.id,shade:roofShade(f),roof:true});});
      if(!hideRoof)items.push(...fasciaSurfaces(m),...soffitSurfaces(m),...trimSurfaces(m));
      raster3D(ctx,w,h,items,[...(!hideRoof&&showStrips?panelEdges3D(m,selected,$('roofLayoutLayer').value):[]),...(hideRoof?[]:edges3D(m))],project);
    }else{
      const step=100*view.scale;ctx.strokeStyle='#182737';ctx.lineWidth=1;if(step>12){for(let x=view.x%step;x<w;x+=step){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,h);ctx.stroke();}for(let y=view.y%step;y<h;y+=step){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(w,y);ctx.stroke();}}
      G.segs.forEach(s=>{const a=getNode(s.n1),b=getNode(s.n2);if(!a||!b)return;ctx.save();ctx.beginPath();const p=at(a),q=at(b);ctx.moveTo(p.x,p.y);ctx.lineTo(q.x,q.y);ctx.strokeStyle='#697f92';ctx.lineWidth=Math.max(1,s.k*view.scale);if(s.tip==='veranda'){const dash=Math.max(6,ctx.lineWidth*1.2);ctx.lineCap='butt';ctx.setLineDash([dash,dash*.75]);}ctx.stroke();ctx.restore();});
      G.roofs.forEach(z=>{const mat=materials().find(m=>m.id===z.material);ctx.beginPath();m.faces.filter(f=>f.zoneId===z.id).forEach(f=>{f.poly.forEach((p,i)=>{const q=at(p);if(i)ctx.lineTo(q.x,q.y);else ctx.moveTo(q.x,q.y);});ctx.closePath();});ctx.globalAlpha=z.id===selected?.72:.43;ctx.fillStyle=mat.color;ctx.fill();ctx.globalAlpha=1;});m.edges.forEach(e=>drawEdge(e,at));
      if(showStrips&&get()){
        const layer=$('roofLayoutLayer').value,rows=(layer==='top'?m.cutList:m.layerCuts.filter(r=>r.layer===layer)).filter(r=>r.zoneId===selected);
        ctx.lineWidth=1;ctx.strokeStyle='#dceaf4';ctx.font='bold 12px system-ui';ctx.textAlign='center';
        rows.forEach(row=>{row.polygons.forEach(poly=>{path(ctx,poly,at);ctx.fillStyle=row.number%2?'#b3cddb20':'#22395130';ctx.fill();ctx.stroke();});const poly=row.polygons.reduce((a,b)=>C.area(a)>C.area(b)?a:b,[]);if(poly.length){const center=poly.reduce((v,p)=>({x:v.x+p.x/poly.length,y:v.y+p.y/poly.length}),{x:0,y:0}),p=at(center);ctx.fillStyle='#f4fbff';ctx.fillText(String(row.number),p.x,p.y);}});
        if(!rows.length){ctx.fillStyle='#e4f1fa';ctx.textAlign='left';ctx.fillText('Bu örtü paket / m² üzerinden hesaplanır; levha kesim şeması yoktur.',25,h-25);}
      }
      G.roofs.forEach(z=>{const poly=C.footprint(z).map(p=>C.transform(z,p));if(z.id===selected&&!showStrips){path(ctx,poly,at);ctx.setLineDash([5,4]);ctx.strokeStyle='#f5d38a';ctx.lineWidth=1.3;ctx.stroke();ctx.setLineDash([]);}if(showStrips&&z.id===selected)return;const p=at(C.transform(z,{x:z.w/2,y:z.d/2}));ctx.textAlign='center';ctx.font='12px system-ui';ctx.fillStyle='#eef6fc';ctx.fillText(z.name,p.x,p.y-7);ctx.fillStyle='#c6d6e4';ctx.font='10px system-ui';ctx.fillText(number(z.w,1)+' × '+number(z.d,1)+' · %'+number(z.pitch,1)+' · kot '+number(z.h,1),p.x,p.y+9);});
      if(action?.start&&hover){const p=at(action.start),q=at(hover);ctx.strokeStyle='#8cddf0';ctx.setLineDash([6,4]);ctx.strokeRect(p.x,p.y,q.x-p.x,q.y-p.y);ctx.setLineDash([]);}
      if(drag?.zone&&hover){const z={...drag.zone,x:drag.zone.x+hover.x-drag.start.x,y:drag.zone.y+hover.y-drag.start.y};path(ctx,C.footprint(z).map(p=>C.transform(z,p)),at);ctx.strokeStyle='#fff';ctx.setLineDash([6,3]);ctx.stroke();ctx.setLineDash([]);}
    }
    if(mode==='plan'&&window.RoofWorkflow)RoofWorkflow.paint(ctx,at);
    if(target){ctx.fillStyle='#d6e4ef';ctx.font='13px system-ui';ctx.textAlign='left';ctx.fillText('Çatı '+(mode==='3d'?'3B':'planı')+' · '+number(m.area)+' m² · ölçüler cm',18,26);}
  }
  function sectionOutline(ctx,w,h,z){
    const fs=model().faces.filter(f=>f.zoneId===z.id),u=z.w/2,segments=[];
    fs.forEach(f=>{const ps=f.poly.map(p=>C.untransform(z,p)),ys=[];ps.forEach((a,i)=>{const b=ps[(i+1)%ps.length];if(Math.abs(b.x-a.x)>.00001&&u>=Math.min(a.x,b.x)-.001&&u<=Math.max(a.x,b.x)+.001)ys.push(a.y+(u-a.x)*(b.y-a.y)/(b.x-a.x));});if(ys.length>=2){const lo=Math.min(...ys),hi=Math.max(...ys);if(hi-lo>.001)segments.push([lo,hi].map(y=>({x:y,y:C.height(f,C.transform(z,{x:u,y}))})));}});
    if(!segments.length){ctx.fillStyle='#d4e2ef';ctx.fillText('Kesit doğrusu bu bölümün yüzeyinden geçmiyor.',30,80);return;}
    const pts=segments.flat(),min=Math.min(...pts.map(p=>p.x)),max=Math.max(...pts.map(p=>p.x)),top=Math.max(...pts.map(p=>p.y)),scale=Math.min((w-100)/(max-min),(h-150)/Math.max(100,top)),at=p=>({x:50+(p.x-min)*scale,y:h-60-p.y*scale});
    ctx.strokeStyle='#f8d286';ctx.lineWidth=3;ctx.font='12px system-ui';ctx.fillStyle='#d4e2ef';segments.forEach(s=>{path(ctx,s,at);ctx.stroke();});ctx.fillText('Seçili bölüm: yerel Y kesiti · yalnız gerçek çatı yüzeyleri · cm',20,30);
    const base=C.basePolygon(z);base.forEach((a,i)=>{const b=base[(i+1)%base.length];if(Math.abs(b.x-a.x)<.001||u<Math.min(a.x,b.x)||u>Math.max(a.x,b.x))return;const y=a.y+(u-a.x)*(b.y-a.y)/(b.x-a.x),p=at({x:y,y:z.wallTop??G.opt.h}),q=at({x:y,y:z.floorLevel||0});ctx.strokeStyle='#8199af';ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(q.x,q.y);ctx.stroke();});
  }
  function section(ctx,w,h){const z=get();if(!z){ctx.fillStyle='#aebed0';ctx.font='14px system-ui';ctx.fillText('Kesit için bir çatı bölümü seçin.',30,70);return;}
    if(z.outline){sectionOutline(ctx,w,h,z);return;}
    const fs=C.zoneFaces(z),outline=C.footprint(z),min=Math.min(...outline.map(p=>p.y)),max=Math.max(...outline.map(p=>p.y)),vals=[min,max],u=z.w/2;
    fs.forEach(f=>{const ps=f.poly.map(p=>C.untransform(z,p));ps.forEach((p,i)=>{const q=ps[(i+1)%ps.length];if((p.x-u)*(q.x-u)<=0&&Math.abs(q.x-p.x)>1e-8){const v=p.y+(u-p.x)*(q.y-p.y)/(q.x-p.x);vals.push(v);}});});
    vals.sort((a,b)=>a-b);const pts=vals.filter((v,i)=>!i||v-vals[i-1]>.001).map(v=>{const p=C.transform(z,{x:u,y:v});return {x:v,y:Math.min(...fs.map(f=>C.height(f,p)))};});const high=Math.max(...pts.map(p=>p.y)),low=Math.min(...pts.map(p=>p.y)),s=Math.min((w-110)/Math.max(100,max-min),(h-200)/Math.max(100,high+40,(z.wallTop??(+G.opt.h||250))+40)),base=h-65,project=p=>({x:55+(p.x-min)*s,y:base-p.y*s});
    ctx.fillStyle='#263542';ctx.strokeStyle='#7891a4';ctx.lineWidth=1;
    const wall=z.wallTop??(+G.opt.h||250),floor=z.floorLevel??0;for(const x of [0,z.d]){const p=project({x,y:wall}),q=project({x,y:floor});ctx.fillRect(p.x-3,p.y,6,q.y-p.y);ctx.strokeRect(p.x-3,p.y,6,q.y-p.y);}
    const floorA=project({x:0,y:floor}),floorB=project({x:z.d,y:floor});ctx.beginPath();ctx.moveTo(floorA.x-15,floorA.y);ctx.lineTo(floorB.x+15,floorB.y);ctx.stroke();ctx.font='12px system-ui';ctx.fillStyle='#a8d8ed';ctx.textAlign='left';ctx.fillText('Döşeme +'+number(floor)+' cm',floorA.x,floorA.y+20);ctx.fillText('Duvar üstü +'+number(wall)+' cm',floorA.x,project({x:0,y:wall}).y+20);
    ctx.strokeStyle='#637d95';ctx.setLineDash([4,4]);ctx.beginPath();ctx.moveTo(40,project({x:0,y:z.h}).y);ctx.lineTo(w-40,project({x:0,y:z.h}).y);ctx.stroke();ctx.setLineDash([]);ctx.strokeStyle='#efbc70';ctx.lineWidth=3;ctx.beginPath();pts.forEach((p,i)=>{const q=project(p);i?ctx.lineTo(q.x,q.y):ctx.moveTo(q.x,q.y);});ctx.stroke();
    if(z.type==='besik'){
      const spacing=C.layers(z,!!G.opt.osb).some(l=>l.id==='osb')?400:z.material==='trapez'?800:null;
      if(spacing){const peak=pts.reduce((a,b)=>a.y>b.y?a:b),ends=[pts[0],pts.at(-1)],info=[];ctx.save();ctx.fillStyle='#73e5c0';
       for(const eave of ends){const L=Math.hypot(peak.x-eave.x,peak.y-eave.y)*10,layout=C.purlinStations(L,spacing);if(!layout){info.push('Kısa yüz: uç yerleşimi kontrolü');continue;}
        for(const mm of layout.positions){const t=mm/L,q=project({x:eave.x+(peak.x-eave.x)*t,y:eave.y+(peak.y-eave.y)*t});ctx.beginPath();ctx.arc(q.x,q.y-5,3,0,Math.PI*2);ctx.fill();}
        info.push(layout.positions.length+' sıra · son aralık '+number(layout.remainderMm,1)+' mm');}
       ctx.textAlign='left';ctx.font='11px system-ui';ctx.fillText('Aşık sıra taslağı · '+spacing+' mm · mahya 120 mm · saçak 0 / 342 mm',25,116);ctx.fillText(info.join(' | '),25,133);ctx.restore();
      }
    }
    ctx.textAlign='center';ctx.font='12px system-ui';ctx.fillStyle='#dce9f2';pts.forEach(p=>{const q=project(p);ctx.fillText((Math.abs(p.x-min)<.01||Math.abs(p.x-max)<.01?'Saçak +':'Mahya +')+number(p.y,1),q.x,q.y-14);});ctx.textAlign='left';ctx.fillText(z.name+' · yerel Y kesiti / X = '+number(u,1),25,75);ctx.fillText((z.datum==='trim'?'Saçak kapaması alt kotu +':z.datum==='eave'?'Çatı yüzeyi alt kotu +':'Duvar yüzünde çatı kotu +')+number(z.h)+' cm · açıklık '+number(z.d)+' cm',25,h-25);ctx.font='11px system-ui';ctx.fillStyle='#9eb2c5';ctx.fillText('Seçili bölümün yerel Y kesiti; birleşen diğer bölümler gösterilmez.',25,96);
  }
  function layerReport(m){if(!m.layerTotals.length)return '';
    let html='<h3>Alt katmanlar · üstten alta</h3><table><tr><th>Bölüm / katman</th><th>Net m²</th><th>Yerleşim</th><th>Fireli sipariş</th><th>Ürün cm</th></tr>';
    m.layerTotals.forEach(t=>html+='<tr><td>'+escape(t.zoneName)+' / '+t.name+'</td><td>'+number(t.netArea)+'</td><td>'+t.pieces+' parça</td><td>'+t.quantity+' '+t.unit+'</td><td>'+number(t.width)+' × '+number(t.length)+'</td></tr>');
    html+='</table><p>Her yerleşim parçası bir plaka / rulodan ayrılır; artık kullanım optimizasyonu yoktur. Ek sipariş fire adedi çizimde gösterilmez.</p><table><tr><th>Bölüm / katman / no</th><th>Net en cm</th><th>Kesim boyu cm</th></tr>';
    m.layerCuts.slice(0,1000).forEach(r=>html+='<tr><td>'+escape(r.name)+' / '+r.material+' / '+r.number+'</td><td>'+number(r.width)+'</td><td>'+number(r.length)+'</td></tr>');return html+'</table>';
  }
  function report(){const m=model();let html='<h3>Çatı kaplama metrajı</h3><p>Aynı gruptaki yüzey kesişimleri düşülür. Ayrı gruplardaki sundurmalar fiziksel olarak ayrı kaplamalar kabul edilir.</p><table><thead><tr><th>Örtü</th><th>Net m²</th><th>Levha / paket</th><th>Sipariş alanı</th></tr></thead><tbody>';
    m.totals.forEach(t=>html+=`<tr><td>${escape(t.name)}</td><td>${number(t.area)}</td><td>${t.unit==='sheet'?t.pieces+' levha':t.unit==='package'?t.packages+' paket ('+number(t.coverage)+' m²/paket)':'m²'}</td><td>${number(t.unit==='sheet'?t.blankArea:t.unit==='package'?t.packages*t.coverage:t.purchaseArea)} m²</td></tr>`);
    html+='</tbody></table>'+layerReport(m)+'<h3>Birleşimler ve kenarlar</h3><table><tr><th>Tür</th><th>Gerçek 3B uzunluk</th></tr>';
    Object.entries(m.lengths).forEach(([k,v])=>html+=`<tr><td>${EDGE[k]}</td><td>${number(v)} m</td></tr>`);html+='</table>';
    m.warnings.forEach(w=>html+='<p class="roof-warning">'+escape(w)+'</p>');
    html+='<p>Kesim taslağı, her yüzeyde net kapatma eniyle açılan şeritlerin en uzun boyunu verir. Üçgen / dere kesimlerinden çıkan artıkların yeniden kullanımı, metal kiremit adım modülü, montaj yönü ve bağlantı detayları bu listede optimize edilmez. Levha boy ilavesi varsayılan 0 cm; boy sınırı varsayılan sınırsızdır. Shingle paketleri yalnız yüzey kaplaması içindir; mahya ve başlangıç parçaları ayrıca belirlenir.</p><h3>Levha kesim taslağı · cm</h3><table><thead><tr><th>No · bölüm / yüz</th><th>Şerit / parça</th><th>Net en</th><th>Boy</th></tr></thead><tbody>';
    m.cutList.slice(0,1000).forEach(c=>html+=`<tr><td>${c.number} · ${escape(c.name)} / ${escape(c.face.split('-').at(-1))}</td><td>${c.strip} / ${c.part}</td><td>${number(c.width)}</td><td>${number(c.length,1)}</td></tr>`);html+='</tbody></table>';if(m.cutList.length>1000)html+='<p>İlk 1000 satır gösteriliyor; CSV tüm satırları içerir.</p>';$('roofReport').innerHTML=html;
  }
  function render(){if(!dialog.open)return;if(!get())selected=G.roofs[0]?.id||null;
    $('roofZones').innerHTML=G.roofs.map(z=>`<button class="roof-zone ${z.id===selected?'active':''}" data-roof-id="${z.id}">${escape(z.name)}<small>${TYPES[z.type]} · +${number(z.h,1)} cm</small></button>`).join('');$('roofZones').querySelectorAll('button').forEach(b=>b.onclick=()=>{selected=b.dataset.roofId;render();});
    const vr=$('roofVerandaRoom'),previous=vr.value;vr.replaceChildren();G.rooms.filter(r=>r.tip==='veranda').forEach((r,i)=>{const option=document.createElement('option');option.value=r.id;option.textContent=(r.ozelAd||'Veranda '+(i+1))+' · '+number(r.area)+' m²';vr.append(option);});if([...vr.options].some(o=>o.value===previous))vr.value=previous;
    const parents=$('roofVerandaParent'),prior=parents.value,active=get(),preferred=active?.attachment?.parentId||(!active?.sourceRoomId?active?.id:null)||prior;parents.replaceChildren();G.roofs.filter(r=>!r.sourceRoomId).forEach(r=>{const o=document.createElement('option');o.value=r.id;o.textContent=r.name;parents.append(o);});if([...parents.options].some(o=>o.value===preferred))parents.value=preferred;
    const layout=$('roofLayoutLayer'),oldLayer=layout.value;layout.replaceChildren(new Option('Üst örtü','top'));if(get())C.layers(get(),!!G.opt.osb).forEach(l=>layout.append(new Option(C.LAYERS.find(d=>d.id===l.id).name,l.id)));if([...layout.options].some(o=>o.value===oldLayer))layout.value=oldLayer;
    properties();if(window.RoofWorkflow)RoofWorkflow.decorate(get());$('roofStage').hidden=mode==='report';$('roofReport').hidden=mode!=='report';$('roofCamera').hidden=mode!=='3d';dialog.querySelectorAll('[data-roof-view]').forEach(b=>b.classList.toggle('active',b.dataset.roofView===mode));
    const m=model();$('roofStats').innerHTML=`<span><b>${number(m.area)} m²</b><small>Net eğimli yüzey</small></span><span><b>${number(m.lengths.ridge)} m</b><small>Mahya</small></span><span><b>${number(m.lengths.valley)} m</b><small>Dere</small></span><span><b>${m.cutList.length}</b><small>Levha</small></span><span><b>${G.roofs.length}</b><small>Çatı bölümü</small></span>`;
    $('roofHint').textContent=mode==='plan'?(action?'Çatı alanının '+(action.start?'ikinci':'ilk')+' köşesine tıklayın. Esc: iptal.':'Bölümü seçmek / taşımak için tıklayın veya sürükleyin. Tekerlek: yakınlaş · orta tuş: kaydır.') :mode==='3d'?(showStrips?'Seçili bölümün kaplama yerleşimi · '+($('roofLayoutLayer').value==='top'?'net kapatma eni '+(get()?.width||100)+' cm':'alt katman şeması çatı yüzeyinde gösterilir')+' · sürgü ile döndürün.':'Çatı kütlesi görünümü · Panel çizgileri için Kaplama yerleşimi düğmesine basın.'):'Mahya, saçak ve duvar üst kotları · cm';if(window.RoofWorkflow)RoofWorkflow.hint(mode);if(mode==='report')report();requestAnimationFrame(()=>paint());
  }
  function setView(v){window.RoofWorkflow?.cancel();mode=v;action=null;drag=null;render();}
  function startDraw(join){if(window.RoofWorkflow)return RoofWorkflow.start(join);if(join&&!get()){notice('Birleşeceği çatı bölümünü önce seçin.',true);return;}mode='plan';action={join:join?get().group:null,h:join?get().h:+G.opt.h||280,defaults:join?{pitch:get().pitch,material:get().material,width:get().width,packageArea:get().packageArea}:{}};render();}
  const canvas=$('roofCanvas');canvas.addEventListener('contextmenu',e=>{if(mode==='3d')e.preventDefault();});canvas.addEventListener('pointerdown',e=>{if(mode==='3d'){drag={camera:true,pan:e.button!==0||e.shiftKey,x:e.clientX,y:e.clientY};canvas.setPointerCapture(e.pointerId);e.preventDefault();return;}if(mode!=='plan')return;const p=world(e);hover=p;if(e.button===1){drag={pan:true,start:{x:e.clientX,y:e.clientY},view:{...view}};canvas.setPointerCapture(e.pointerId);e.preventDefault();return;}if(e.button!==0)return;
    if(action){const p2={x:Math.round(p.x),y:Math.round(p.y)};if(!action.start){action.start=p2;render();return;}const a=action.start,w=Math.abs(p2.x-a.x),d=Math.abs(p2.y-a.y);if(w<10||d<10){notice('Bölüm eni ve uzunluğu en az 10 cm olmalı.',true);return;}add(make({...action.defaults,name:(action.join?'Birleşen çatı ':'Çatı ')+(G.roofs.length+1),type:$('roofNewType').value,x:Math.min(a.x,p2.x),y:Math.min(a.y,p2.y),w,d,h:action.h,group:action.join||undefined}));return;}
    const visible=model().faces.filter(f=>C.contains(f.poly,p)).sort((a,b)=>C.height(b,p)-C.height(a,p));const hit=visible.length?G.roofs.find(z=>z.id===visible[0].zoneId):[...G.roofs].reverse().find(z=>C.contains(C.footprint(z),C.untransform(z,p))); if(hit){selected=hit.id;drag=hit.attachment||hit.production?null:{zone:clone(hit),start:p};canvas.setPointerCapture(e.pointerId);render();}
  });canvas.addEventListener('pointermove',e=>{if(drag?.camera){const dx=e.clientX-drag.x,dy=e.clientY-drag.y;drag.x=e.clientX;drag.y=e.clientY;if(drag.pan){Camera3D.state.panX+=dx;Camera3D.state.panY+=dy;}else{angle=(angle+dx*.5+360)%360;Camera3D.state.pitch=Math.max(-89,Math.min(90,Camera3D.state.pitch+dy*.4));$('roofCamera').value=angle;}paint();return;}hover=world(e);if(drag?.pan){view.x=drag.view.x+e.clientX-drag.start.x;view.y=drag.view.y+e.clientY-drag.start.y;}if(action||drag)paint();});
  canvas.addEventListener('pointerup',e=>{if(drag?.zone){const p=world(e),dx=p.x-drag.start.x,dy=p.y-drag.start.y,z=drag.zone;drag=null;if(Math.hypot(dx,dy)>2/view.scale)commit(()=>{const target=G.roofs.find(r=>r.id===z.id);target.x=Math.round(z.x+dx);target.y=Math.round(z.y+dy);});}drag=null;paint();});canvas.addEventListener('pointercancel',()=>{drag=null;paint();});
  canvas.addEventListener('wheel',e=>{if(mode==='3d'){e.preventDefault();Camera3D.state.zoom=Math.max(.15,Math.min(12,Camera3D.state.zoom*Math.exp(-e.deltaY*.001)));paint();return;}if(mode!=='plan')return;e.preventDefault();const p=world(e),old=at(p);view.scale=Math.max(.01,Math.min(8,view.scale*Math.exp(-e.deltaY*.001)));view.x=old.x-p.x*view.scale;view.y=old.y-p.y*view.scale;paint();},{passive:false});
  dialog.querySelectorAll('[data-roof-view]').forEach(b=>b.onclick=()=>setView(b.dataset.roofView));$('roofClose').onclick=close;$('roofLayoutLayer').onchange=()=>{showStrips=true;if(mode!=='3d')mode='plan';render();};$('roofFromPlan').onclick=fromPlan;$('roofFromVeranda').onclick=fromVeranda;$('roofDraw').onclick=()=>startDraw(false);$('roofJoin').onclick=()=>startDraw(true);$('roofWallDetails').onclick=()=>{showWallDetails=!showWallDetails;setView('3d');};$('roofHide').onclick=()=>{hideRoof=!hideRoof;$('roofHide').textContent=hideRoof?'Çatıyı göster':'Çatıyı gizle';setView('3d');};$('roofProjection').onchange=e=>{Camera3D.state.projection=e.target.value;setView('3d');};$('roofViewpoint').onchange=e=>{Camera3D.preset(e.target.value);angle=Camera3D.state.yaw;$('roofCamera').value=angle;setView('3d');};$('roofZoomIn').onclick=()=>{Camera3D.state.zoom=Math.min(12,Camera3D.state.zoom*1.2);setView('3d');};$('roofZoomOut').onclick=()=>{Camera3D.state.zoom=Math.max(.15,Camera3D.state.zoom/1.2);setView('3d');};$('roofFit').onclick=()=>{if(mode==='3d'){Camera3D.reset();paint();}else fit();};$('roofStrips').onclick=()=>{showStrips=!showStrips;$('roofStrips').classList.toggle('active',showStrips);if(showStrips&&mode!=='3d')mode='plan';render();};$('roofUndo').onclick=()=>{geriAl();render();};$('roofRedo').onclick=()=>{ileriAl();render();};$('roofCamera').oninput=e=>{angle=+e.target.value;paint();};
  window.addEventListener('keydown',e=>{if(!dialog.open)return;e.stopImmediatePropagation();if(window.RoofWorkflow?.key(e))return;if(e.key==='Escape'){e.preventDefault();if(action||drag){action=null;drag=null;render();}else close();}if((e.ctrlKey||e.metaKey)&&!['INPUT','SELECT','TEXTAREA'].includes(e.target.tagName)&&['z','y'].includes(e.key.toLowerCase())){e.preventDefault();if(e.key.toLowerCase()==='y'||e.shiftKey)ileriAl();else geriAl();render();}},true);
  dialog.addEventListener('cancel',e=>{e.preventDefault();close();});new ResizeObserver(()=>paint()).observe($('roofStage'));
  function save(data,name,type){const url=URL.createObjectURL(new Blob([data],{type})),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),3000);}
  function csv(){const m=model(),rows=[['Çatı kaplama metrajı','Birim','Miktar','Net alan m²','Sipariş alanı m²']];m.totals.forEach(t=>rows.push([t.name,t.unit==='sheet'?'levha':t.unit==='package'?'paket':'m²',t.unit==='sheet'?t.pieces:t.unit==='package'?t.packages:t.purchaseArea,t.area,t.unit==='sheet'?t.blankArea:t.unit==='package'?t.packages*t.coverage:t.purchaseArea]));m.layerTotals.forEach(t=>rows.push([t.zoneName+' / '+t.name,t.unit,t.quantity,t.netArea,t.purchaseArea]));rows.push([],['Alt katman bölümü','Katman','No','Net en cm','Kesim boyu cm']);m.layerCuts.forEach(r=>rows.push([r.name,r.material,r.number,r.width,r.length]));rows.push([],['Kenar','Uzunluk m']);Object.entries(m.lengths).forEach(([k,v])=>rows.push([EDGE[k],v]));rows.push([],['No','Bölüm','Yüz','Şerit','Parça','Kaplama','Net en cm','Boy cm','Adet']);m.cutList.forEach(c=>rows.push([c.number,c.name,c.face,c.strip,c.part,materials().find(m=>m.id===c.material).name,c.width,c.length,1]));rows.push([],['Kesim taslağı: üçgen artıklarının kullanımı, bağlantılar ve metal kiremit adım modülü dahil değildir.']);return '\uFEFF'+rows.map(row=>row.map(v=>{let s=typeof v==='number'?String(Math.round(v*1000)/1000).replace('.',','):String(v);if(/^[=+@-]/.test(s))s="'"+s;return '"'+s.replace(/"/g,'""')+'"';}).join(';')).join('\r\n');}
  $('roofCSV').onclick=()=>save(csv(),'cati_metraj_kesim.csv','text/csv;charset=utf-8');$('roofPNG').onclick=()=>{if(mode==='report'){notice('PNG için Plan, 3B veya Kesit görünümünü seçin.');return;}const source=$('roofCanvas'),out=document.createElement('canvas');out.width=source.clientWidth;out.height=source.clientHeight;paint(out);out.toBlob(b=>save(b,'cati_'+mode+'.png','image/png'));};
  function billRows(){const m=model(),rows=[],row=(kalem,olcu,birim,miktar)=>rows.push({grup:'Çatı — bölüm modeli',kalem,olcu,birim,miktar});m.totals.forEach(t=>{row(t.name+' · net kaplama','Birleşimler düşülmüş eğimli yüzey','m²',t.area);row(t.name+' · sipariş',t.unit==='sheet'?'Şerit kesim taslağı · ayrıntı Çatı planı / CSV':t.unit==='package'?number(t.coverage)+' m²/paket · fire dahil':'fire dahil',t.unit==='sheet'?'adet':t.unit==='package'?'paket':'m²',t.unit==='sheet'?t.pieces:t.unit==='package'?t.packages:t.purchaseArea);});Object.entries(m.lengths).forEach(([k,v])=>row(EDGE[k],'Gerçek 3B kenar boyu','m',v));const gutter=m.edges.filter(e=>e.type==='eave'&&G.roofs.find(z=>z.id===e.zoneId)?.gutters&&!G.roofs.find(z=>z.id===e.zoneId)?.parapet).reduce((s,e)=>s+e.length,0);row('Yağmur oluğu','Oluk açık ve parapetsiz bölümlerin saçakları','m',gutter);m.layerTotals.forEach(t=>{row(t.name+' · '+t.zoneName+' · net','Seçili alt katman','m²',t.netArea);row(t.name+' · '+t.zoneName+' · sipariş',number(t.width)+' × '+number(t.length)+' cm · fire %'+number(t.fire),t.unit,t.quantity);});return rows;}
  function summary(){const m=model();return {productionFrames:window.RoofWorkflow?G.roofs.flatMap(RoofWorkflow.trusses):[],alan:m.area,planAlan:m.planArea,adet:m.cutList.length,mahya:(m.lengths.ridge||0)*100,kirmaMahya:(m.lengths.hip||0)*100,dere:(m.lengths.valley||0)*100,sacak:(m.lengths.eave||0)*100,alin:(m.lengths.verge||0)*100,gruplar:[],sekil:'bolum',bina:G.roofs.length};}
  const baseDraw=window.draw;window.draw=function(){baseDraw();if(dialog.open)render();};
  window.RoofStudio={raster3D,vergeEdges,edges3D,trimSurfaces,panelEdges3D,commit,notice,world,repaint:paint,open,close,add,make,fromPlan,fromVeranda,verandaStructure,planStructure,fasciaSurfaces,soffitSurfaces,model,render,fit,setView,billRows,summary,csv,canvasPoint:at,select(id){selected=id;render();},getSelected:()=>selected};
})();
