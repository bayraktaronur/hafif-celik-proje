/* Isolated prototype viewer. Actual prefab snapshot + STL-derived chassis members. */
let sceneCache=null,sceneKey='',lastProjection=null,drag=null,drawPending=false;
const frameList=()=>DraftFrames.layout(project.floors[0].data,project.frameDirection);
function prefabPlanDetails(){
 const joints=PREFAB_REFERENCE.surfaces.filter(s=>s.kind==='wallJoint'&&s.poly.every(p=>Math.abs(p.z-280)<.01));
 let out='<g class="prefab-joints" pointer-events="none">'+joints.map(s=>`<polygon data-joint="${s.jointType}" points="${s.poly.map(p=>p.x+','+p.y).join(' ')}"/>`).join('')+'</g>';
 for(const o of floor().data.openings){const s=floor().data.segs.find(s=>s.id===o.segId),{a,len,ux,uy}=segInfo(s),t=o.t*len+o.en/2;
  out+=`<text class="opening-label" x="${a.x+ux*t-uy*18}" y="${a.y+uy*t+ux*18}" transform="rotate(${Math.abs(uy)>.5?-90:0} ${a.x+ux*t-uy*18} ${a.y+uy*t+ux*18})">${o.en}/${o.yuk}</text>`;
 }
 return out;
}
function renderFramePlan(){
 const frames=frameList(),vw=(W+240)/zoom,vh=(H+220)/zoom;
 $('#drawing').setAttribute('viewBox',`${(bounds.x+bounds.right-vw)/2} ${(bounds.y+bounds.bottom-vh)/2} ${vw} ${vh}`);
 $('#viewKicker').textContent='ARA KAT / YERLEŞİM PLANI';
 $('#viewLevel').textContent=`Alt +${fmt(project.height/100,2)} m · Üst +${fmt((project.height+20)/100,2)} m`;
 let svg='<g opacity=".3">';for(const s of project.floors[0].data.segs.filter(s=>s.tip!=='veranda')){const {a,b}=segInfo(s);svg+=line(a.x,a.y,b.x,b.y,'wall-visible',`stroke-width="${s.k}"`)}svg+='</g>';
 for(const f of frames){const poly=DraftFrames.footprint(f),c=poly.reduce((a,p)=>({x:a.x+p.x/4,y:a.y+p.y/4}),{x:0,y:0});
  svg+=`<g class="frame-plan ${selected?.id===f.id?'chosen':''}" data-frame="${f.id}"><polygon points="${poly.map(p=>p.x+','+p.y).join(' ')}"/>`;
  const n=Math.max(1,Math.floor((f.length-12)/FRAME_REFERENCE.referencePitch)),step=(f.length-12)/(n+1);
  for(let i=1;i<=n;i++){const a=DraftFrames.world(f,6,6+i*step,0),b=DraftFrames.world(f,f.width-6,6+i*step,0);svg+=line(a.x,a.y,b.x,b.y,'frame-cross')}
  svg+=`<g transform="translate(${c.x} ${c.y}) rotate(${f.direction==='y'&&f.width<90?90:0})"><text x="0" y="-6">${f.id}</text><text class="frame-size" x="0" y="12">${fmt(f.width,2)} × ${fmt(f.length,2)}</text></g></g>`;
 }
 if($('#showDims').checked){const pts=frames.flatMap(DraftFrames.footprint);svg+=dimensions({x:Math.min(...pts.map(p=>p.x)),y:Math.min(...pts.map(p=>p.y)),right:Math.max(...pts.map(p=>p.x)),bottom:Math.max(...pts.map(p=>p.y))})}$('#drawing').innerHTML=svg;
 $$('[data-frame]').forEach(e=>e.onclick=()=>{selected={type:'frame',id:e.dataset.frame};renderCanvas();renderInspector()});
}
function boxSurface(r,z0,z1,color,kind){const p=[{x:r.x0,y:r.y0},{x:r.x1,y:r.y0},{x:r.x1,y:r.y1},{x:r.x0,y:r.y1}],out=[{poly:p.map(p=>({...p,z:z1})),color,kind}];
 for(let i=0;i<4;i++)out.push({poly:[{...p[i],z:z0},{...p[(i+1)%4],z:z0},{...p[(i+1)%4],z:z1},{...p[i],z:z1}],color,kind});return out;
}
function buildDraftScene(){
 if(assemblyMode==='ceiling')return ceilingScene();
 const surfaces=[],frames=frameList(),base=project.height,elevations=DraftFloorLayers.elevations(base,explode);
 for(const f of project.floors.filter(f=>f.id!=='mezz'&&f.visible&&f.data)){
  const z=level(f)+(f.id==='first'?elevations.upper.offset:0);
  if(f.id==='ground')for(const r of DraftFrames.rectangles(f.data))surfaces.push(...boxSurface(r,z-8,z,'#c0c5c3','slab'));
  // Upper walls sit on the explicitly labelled draft decking, never inside the 20 cm frame.
  if(project.system==='prefab'){
   for(const s of PREFAB_REFERENCE.surfaces){const joint=s.kind==='wallJoint';surfaces.push({...s,
    color:joint?(s.jointType==='kose'?'#f3f1e7':'#d3d2c5'):s.color,painted:joint||s.painted,edgeColor:joint?'#90998e':s.edgeColor,
    poly:s.poly.map(p=>({...p,z:z+(Math.abs(p.z-280)<.01?project.height:p.z)}))});}
  }else{
   // Continuous wall preview for the independent steel toggle; never label it a prefab panel.
   for(const s of f.data.segs.filter(s=>s.tip!=='veranda')){const {a,b,len,ux,uy}=segInfo(s),ops=f.data.openings.filter(o=>o.segId===s.id).sort((a,b)=>a.t-b.t);let at=0;
    const face=(start,end,lo,hi)=>{if(end<=start||hi<=lo)return;const x=a.x+ux*start,y=a.y+uy*start,X=a.x+ux*end,Y=a.y+uy*end,t=s.k/2;surfaces.push(...boxSurface({x0:Math.min(x,X)-(Math.abs(uy)>.5?t:0),x1:Math.max(x,X)+(Math.abs(uy)>.5?t:0),y0:Math.min(y,Y)-(Math.abs(ux)>.5?t:0),y1:Math.max(y,Y)+(Math.abs(ux)>.5?t:0)},z+lo,z+hi,'#d5d5cc','wallPanel'));};
    for(const o of ops){const l=o.t*len,r=l+o.en,lo=o.tip_==='pencere'?210-o.yuk:0,hi=lo+o.yuk;face(at,l,0,project.height);face(l,r,0,lo);face(l,r,hi,project.height);at=r;}face(at,len,0,project.height);
   }
  }
 }
 if(project.floors.find(f=>f.id==='mezz').visible)for(const f of frames)surfaces.push(...DraftFrames.mesh(f,base+elevations.chassis.offset,selected?.id===f.id));
 if(assemblyMode==='layers')surfaces.push(...DraftFloorLayers.mesh(frames,base,explode,project.layerVisibility,project.floors[0].data));
 return {surfaces,frames,base,top:base+20,elevations};
}
function render3D(){
 const canvas=$('#modelCanvas'),rect=$('#viewport').getBoundingClientRect(),w=Math.max(100,rect.width),h=Math.max(100,rect.height),dpr=Math.min(2,devicePixelRatio||1);
 if(canvas.width!==Math.round(w*dpr)||canvas.height!==Math.round(h*dpr)){canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr)}
 const ctx=canvas.getContext('2d');ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,w,h);
 const key=JSON.stringify([project.height,project.system,project.frameDirection,project.floors.map(f=>[f.id,f.visible,!!f.data]),project.layerVisibility,assemblyMode,explode,selected?.id]);
 if(key!==sceneKey){sceneCache=buildDraftScene();sceneKey=key}
 const items=sceneCache.surfaces;Camera3D.state.zoom=zoom;lastProjection=Camera3D.project(items.flatMap(s=>s.poly),w,h);
 const gridSetting=Scene3D.state.grid;if(assemblyMode==='ceiling')Scene3D.state.grid=false;
 const rendered=Scene3D.render(ctx,w,h,items,[],lastProjection);Scene3D.state.grid=gridSetting;
 if(!rendered){
  ctx.fillStyle=Scene3D.state.theme==='dark'?'#101d26':'#f4f6f8';ctx.fillRect(0,0,w,h);
  const faces=items.map(s=>({...s,pts:s.poly.map(lastProjection)})).sort((a,b)=>a.pts.reduce((n,p)=>n+p.depth,0)/a.pts.length-b.pts.reduce((n,p)=>n+p.depth,0)/b.pts.length);
  for(const s of faces){ctx.beginPath();s.pts.forEach((p,i)=>i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));ctx.closePath();ctx.fillStyle=s.color;ctx.globalAlpha=s.alpha??1;ctx.fill();}ctx.globalAlpha=1;
 }
 if(!items.length){ctx.fillStyle='#819aa6';ctx.font='16px Segoe UI';ctx.fillText('Görünür katları soldan açın.',40,h/2)}
 if(assemblyMode==='ceiling')drawCeilingLabels(ctx);else drawLayerLabels(ctx,w,h);
 $('#viewKicker').textContent=explode>0?'ARA KAT / AYRIŞTIRILMIŞ GÖRÜNÜM':'ARA KAT / BİRLEŞİK GÖRÜNÜM';
 $('#viewTitle').textContent=assemblyMode==='frame'?'Galvaniz şase':'Katman katman yapı';
 $('#viewLevel').textContent=assemblyMode==='frame'?'125 cm dış en · 20 cm yükseklik':'Taban · Yalıtım · Şase · Alt tavan';
 if(assemblyMode==='ceiling'){$('#viewKicker').textContent='STANDART TAVAN / 60 × 120 CM';$('#viewTitle').textContent=Camera3D.state.pitch<0?'Alt tavan · alttan görünüm':'Alt tavan · üstten görünüm';$('#viewLevel').textContent='Alçıpan levhalar · Mini H geçme birleşimleri'}
 $('#viewport').classList.toggle('light-model',Scene3D.state.theme==='light');
}
function drawLayerLabels(ctx,w,h){
 if(explode<30||assemblyMode!=='layers'||!lastProjection)return;
 const labels=[];
 for(const d of DraftFloorLayers.definitions){
  if(d.id==='chassis'?!project.floors.find(f=>f.id==='mezz').visible:!project.layerVisibility[d.id])continue;
  const z=sceneCache.elevations[d.id],pts=sceneCache.frames.flatMap(DraftFrames.footprint).map(p=>lastProjection({...p,z:z.top+z.offset})),anchor=pts.reduce((a,b)=>b.x>a.x?b:a);
  labels.push({...d,anchor,y:anchor.y});
 }
 labels.sort((a,b)=>a.y-b.y);let prev=100;
 for(const l of labels){l.y=Math.max(prev,Math.min(h-90,l.y));prev=l.y+34}
 const overflow=Math.max(0,(labels.at(-1)?.y||0)-(h-90));labels.forEach(l=>l.y-=overflow);
 ctx.save();ctx.font='600 11px Segoe UI';ctx.textBaseline='middle';
 for(const l of labels){const width=ctx.measureText(l.name).width+44,x=Math.min(w-width-18,Math.max(w*.72,l.anchor.x+18)),y=l.y;
  ctx.strokeStyle='#6d858b';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(l.anchor.x,l.anchor.y);ctx.lineTo(x-8,y);ctx.lineTo(x,y);ctx.stroke();
  ctx.fillStyle=Scene3D.state.theme==='light'?'#ffffffee':'#203039ee';ctx.beginPath();ctx.roundRect(x,y-13,width,26,5);ctx.fill();ctx.strokeStyle='#8c9da35c';ctx.stroke();
  ctx.fillStyle=l.color;ctx.beginPath();ctx.arc(x+12,y,4,0,Math.PI*2);ctx.fill();ctx.fillStyle=Scene3D.state.theme==='light'?'#344a50':'#e1ebe9';ctx.fillText(l.number+'  '+l.name,x+22,y);
  ctx.fillStyle='#7f9898';ctx.beginPath();ctx.arc(l.anchor.x,l.anchor.y,2.5,0,Math.PI*2);ctx.fill();
 }ctx.restore();
}
function renderFrameInspector(){
 if(view==='3d'&&assemblyMode==='ceiling'){renderCeilingInspector();return}
 const frames=frameList(),f=frames.find(f=>f.id===selected?.id),special=frames.filter(f=>f.special).length,z=DraftFloorLayers.elevations(project.height);
 const mode=assemblyMode==='frame'?'frame':explode>0?'exploded':'together';
 $('#scope').textContent='Ara kat';$('#inspectorHeading').textContent='KATLAR VE KATMANLAR';
 $('#inspectorBody').innerHTML=section(`<span class="eyebrow">PREFABRİK / KATLAR ARASI DÖŞEME</span><h2>Ara kat sistemi</h2><p>Duvarın üstünde şase, içinde yalıtım.<br>Üstte taban, altta tavan kaplaması.</p><div class="assembly-presets">${[['exploded','Katları ayır'],['together','İki kat birlikte'],['frame','Şaseyi incele'],['ceiling','Tavanı alttan gör']].map(([id,name])=>`<button data-assembly="${id}" aria-pressed="${mode===id}">${name}<span>${id==='exploded'?'↕':id==='together'?'▱':'⌗'}</span></button>`).join('')}</div>`)
 +section(`<div class="section-heading layer-heading"><span>DÖŞEME KATMANLARI</span><span>Üstten alta</span></div><div class="floor-layer-list">${DraftFloorLayers.definitions.map(d=>{const on=d.id==='chassis'?project.floors.find(f=>f.id==='mezz').visible:project.layerVisibility[d.id];return `<label class="floor-layer"><span class="layer-number" style="--layer-color:${d.color}">${d.number}</span><span><strong>${d.name}</strong><small>${d.detail}</small></span><input type="checkbox" data-layer="${d.id}" aria-label="${d.name} görünürlüğü" ${on?'checked':''}></label>`}).join('')}</div><p class="tip">${assemblyMode==='frame'?'Şase incelemesinde kaplamalar geçici olarak gizlidir. Bir katmanı açarak katman görünümüne dönebilirsiniz.':'Gözlem için ayrı ayrı açıp kapatabilirsiniz. Gizlemek ürün seçimini veya kat kotunu değiştirmez.'}</p>${view==='3d'?`<label class="field">Katman aralığı<input id="explode" aria-label="Katları ayrıştır" type="range" min="0" max="260" step="5" value="${explode}"></label>`:''}<details class="draft-layer-note"><summary>Taslak katman değerleri</summary><p>Taban 2 cm, alt tavan 1,25 cm görsel önizlemedir. Yalıtım şase boşluklarını gösterir. 60 × 120 cm tavan düzeni uygulanır; mini H kesiti, geçme payları, yalıtım kalınlığı ve montaj detayları temsilîdir; imalat/metraj değeri değildir.</p></details>`)
 +section(`<details class="level-details"><summary>Gerçek yerleşim kotları</summary><div class="level-stack"><span>Üst kat tabanı<b>+${fmt(z.upper.bottom/100,3)} m</b></span><span>Şase üstü<b>+${fmt(z.chassis.top/100,3)} m</b></span><i>20 cm galvaniz şase</i><span>Duvar üstü / şase altı<b>+${fmt(z.chassis.bottom/100,3)} m</b></span><span>Alt tavan altı<b>+${fmt(z.ceiling.bottom/100,4)} m</b></span></div><p class="tip">Ayrıştırma yalnız görüntüyü açar; bu kotlar değişmez. Üst kat tabanı taslak kaplama kalınlığını içerir.</p></details><label class="field">Şase boy doğrultusu<select id="frameDirection"><option value="y" ${project.frameDirection==='y'?'selected':''}>Planda yukarı–aşağı</option><option value="x" ${project.frameDirection==='x'?'selected':''}>Planda sağ–sol</option></select></label><div class="kv"><span>Şaseler / özel kenar</span><b>${frames.length} / ${special} adet</b></div><button class="secondary" id="frameViewToggle">${view==='3d'?'Şase planına geç':'Duvar üzerinde 3D gör'} →</button><button class="text-button" id="showFrameReferences">Verdiğiniz montaj ve kesit örnekleri ↗</button>`)
 +(f?section(`<span class="eyebrow">SEÇİLİ ŞASE · ${f.special?'ÖZEL KENAR':'STANDART'}</span><h2>${f.id}</h2><div class="kv"><span>Dış genişlik</span><b>${fmt(f.width,2)} cm</b></div><div class="kv"><span>Boy</span><b>${fmt(f.length,2)} cm</b></div><div class="kv"><span>Yükseklik</span><b>20 cm</b></div>`):'')
 +(view==='3d'?section(`<h3>Görünüm</h3><div class="segmented"><button id="rotate">↻ Döndür</button><button id="modelTheme">${Scene3D.state.theme==='light'?'Koyu zemin':'Açık zemin'}</button></div>`)+section('<h3>Görünür katlar</h3>'+project.floors.map(f=>`<label class="field-row layer-choice"><input type="checkbox" data-visibility="${f.id}" ${f.visible?'checked':''}>${f.name}</label>`).join('')):'')
 +section(`<details><summary>Şase listesi · ${frames.length}</summary><div class="frame-list">${frames.map(f=>`<button data-select-frame="${f.id}" class="${selected?.id===f.id?'active':''}"><b>${f.id}</b><span>${fmt(f.width,2)} × ${fmt(f.length,2)} cm</span>${f.special?'<em>Özel</em>':''}</button>`).join('')}</div></details><p class="tip">STL profil biçimiyle yerleşim önizlemesi. Kayıt aralığı ve özel parçalar imalat onayı değildir. Veranda bu ara katın dışında tutulur.</p>`);
 $('#frameDirection').onchange=e=>{save();project.frameDirection=e.target.value;selected=null;render()};$('#frameViewToggle').onclick=()=>setView(view==='3d'?'mezz':'3d');
 $$('[data-select-frame]').forEach(b=>b.onclick=()=>{selected={type:'frame',id:b.dataset.selectFrame};renderCanvas();renderInspector()});
 $('#showFrameReferences').onclick=()=>$('#frameReferences').showModal();
 $$('[data-assembly]').forEach(b=>b.onclick=()=>{if(b.dataset.assembly==='ceiling'){openCeilingView();return}Camera3D.state.pitch=35;assemblyMode=b.dataset.assembly==='frame'?'frame':'layers';project.floors.forEach(f=>f.visible=f.id!=='first'||assemblyMode!=='frame');explode=b.dataset.assembly==='exploded'?160:0;setView('3d')});
 $$('[data-layer]').forEach(e=>e.onchange=()=>{save();if(e.dataset.layer==='chassis')project.floors.find(f=>f.id==='mezz').visible=e.checked;else project.layerVisibility[e.dataset.layer]=e.checked;if(assemblyMode==='frame'&&e.dataset.layer!=='chassis')assemblyMode='layers';render()});
 if(view==='3d'){
  $('#explode').oninput=e=>{explode=+e.target.value;assemblyMode='layers';renderCanvas();$$('[data-assembly]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.assembly===(explode>0?'exploded':'together')))};
  $('#rotate').onclick=()=>{Camera3D.state.yaw+=45;renderCanvas()};$('#modelTheme').onclick=()=>{Scene3D.state.theme=Scene3D.state.theme==='light'?'dark':'light';renderCanvas();renderInspector()};
  $$('[data-visibility]').forEach(e=>e.onchange=()=>{project.floors.find(f=>f.id===e.dataset.visibility).visible=e.checked;renderNav();renderCanvas();renderInspector()});
 }
}
function scheduleModel(){if(drawPending)return;drawPending=true;requestAnimationFrame(()=>{drawPending=false;render3D()})}
const modelCanvas=$('#modelCanvas');
modelCanvas.addEventListener('pointerdown',e=>{if(e.button>1)return;drag={x:e.clientX,y:e.clientY,startX:e.clientX,startY:e.clientY,pan:e.shiftKey||e.button===1,moved:false};modelCanvas.setPointerCapture(e.pointerId);e.preventDefault()});
modelCanvas.addEventListener('pointermove',e=>{if(!drag)return;const dx=e.clientX-drag.x,dy=e.clientY-drag.y;drag.moved||=Math.hypot(e.clientX-drag.startX,e.clientY-drag.startY)>4;if(drag.pan){Camera3D.state.panX+=dx;Camera3D.state.panY+=dy}else{Camera3D.state.yaw+=dx*.35;Camera3D.state.pitch=Math.max(-85,Math.min(85,Camera3D.state.pitch+dy*.25))}drag.x=e.clientX;drag.y=e.clientY;scheduleModel()});
function insidePolygon(x,y,p){let inside=false;for(let i=0,j=p.length-1;i<p.length;j=i++)if((p[i].y>y)!==(p[j].y>y)&&x<(p[j].x-p[i].x)*(y-p[i].y)/(p[j].y-p[i].y)+p[i].x)inside=!inside;return inside}
modelCanvas.addEventListener('pointerup',e=>{if(!drag)return;const was=drag;drag=null;
 if(!was.moved&&assemblyMode==='ceiling'&&lastProjection){const r=modelCanvas.getBoundingClientRect(),z=sceneCache.elevations.ceiling.bottom,hits=sceneCache.ceiling.boards.filter(b=>b.pieces.some(r=>insidePolygon(e.clientX-modelCanvas.getBoundingClientRect().x,e.clientY-modelCanvas.getBoundingClientRect().y,[{x:r.x0,y:r.y0,z},{x:r.x1,y:r.y0,z},{x:r.x1,y:r.y1,z},{x:r.x0,y:r.y1,z}].map(lastProjection))));selected=hits.length?{type:'ceilingBoard',id:hits[0].id}:null;renderCanvas();renderInspector();return}
 if(!was.moved&&lastProjection&&project.floors.find(f=>f.id==='mezz').visible){const r=modelCanvas.getBoundingClientRect(),hits=frameList().map(f=>({f,p:DraftFrames.footprint(f).map(p=>lastProjection({...p,z:project.height+20+DraftFloorLayers.elevations(project.height,explode).chassis.offset}))})).filter(o=>insidePolygon(e.clientX-r.x,e.clientY-r.y,o.p)).sort((a,b)=>b.p[0].depth-a.p[0].depth);if(hits.length){selected={type:'frame',id:hits[0].f.id};renderCanvas();renderInspector()}}});
modelCanvas.addEventListener('pointercancel',()=>drag=null);
new ResizeObserver(()=>{if(view==='3d')scheduleModel()}).observe($('#viewport'));
Scene3D.state.theme='light';Camera3D.state.pitch=35;
syncSettings();render();
