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
 const surfaces=[],frames=frameList(),base=project.height;
 for(const f of project.floors.filter(f=>f.id!=='mezz'&&f.visible&&f.data)){
  const z=level(f)+(f.id==='first'?explode*2:0);
  if(f.id==='ground')for(const r of DraftFrames.rectangles(f.data))surfaces.push(...boxSurface(r,z-8,z,'#c0c5c3','slab'));
  // The upper floor has no invented slab thickness overlapping the 20 cm steel frame.
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
 if(project.floors.find(f=>f.id==='mezz').visible)for(const f of frames)surfaces.push(...DraftFrames.mesh(f,base+explode,selected?.id===f.id));
 return {surfaces,frames,base,top:base+20};
}
function render3D(){
 const canvas=$('#modelCanvas'),rect=$('#viewport').getBoundingClientRect(),w=Math.max(100,rect.width),h=Math.max(100,rect.height),dpr=Math.min(2,devicePixelRatio||1);
 if(canvas.width!==Math.round(w*dpr)||canvas.height!==Math.round(h*dpr)){canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr)}
 const ctx=canvas.getContext('2d');ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,w,h);
 const key=JSON.stringify([project.height,project.system,project.frameDirection,project.floors.map(f=>[f.id,f.visible,!!f.data]),explode,selected?.id]);
 if(key!==sceneKey){sceneCache=buildDraftScene();sceneKey=key}
 const items=sceneCache.surfaces;Camera3D.state.zoom=zoom;lastProjection=Camera3D.project(items.flatMap(s=>s.poly),w,h);
 if(!Scene3D.render(ctx,w,h,items,[],lastProjection)){
  ctx.fillStyle=Scene3D.state.theme==='dark'?'#101d26':'#f4f6f8';ctx.fillRect(0,0,w,h);
  const faces=items.map(s=>({...s,pts:s.poly.map(lastProjection)})).sort((a,b)=>a.pts.reduce((n,p)=>n+p.depth,0)/a.pts.length-b.pts.reduce((n,p)=>n+p.depth,0)/b.pts.length);
  for(const s of faces){ctx.beginPath();s.pts.forEach((p,i)=>i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));ctx.closePath();ctx.fillStyle=s.color;ctx.globalAlpha=s.alpha??1;ctx.fill();}ctx.globalAlpha=1;
 }
 if(!items.length){ctx.fillStyle='#819aa6';ctx.font='16px Segoe UI';ctx.fillText('Görünür katları soldan açın.',40,h/2)}
 $('#viewport').classList.toggle('light-model',Scene3D.state.theme==='light');
}
function renderFrameInspector(){
 const frames=frameList(),f=frames.find(f=>f.id===selected?.id),special=frames.filter(f=>f.special).length;
 $('#scope').textContent='Ara kat';$('#inspectorHeading').textContent='ŞASE YERLEŞİMİ';
 $('#inspectorBody').innerHTML=section(`<span class="eyebrow">DUVAR ÜSTÜNE OTURAN SİSTEM</span><h2>Ara kat şaseleri</h2><p>125 cm dış en · 20 cm yükseklik</p><p class="tip">Zemin kat duvarı → ara kat döşeme şasesi → 1. kat. Alt kat tavanı şasenin altında, üst kat taban kaplaması üstündedir.</p><div class="level-stack"><span>Şase üstü<b>+${fmt((project.height+20)/100,2)} m</b></span><i>20 cm şase</i><span>Duvar üstü / şase altı<b>+${fmt(project.height/100,2)} m</b></span></div>`)
 +section(`<div class="assembly-presets"><button data-assembly="frame">Şaseyi incele</button><button data-assembly="together">İki kat birlikte</button><button data-assembly="exploded">Katları ayır</button></div><label class="field">Şase boy doğrultusu<select id="frameDirection"><option value="y" ${project.frameDirection==='y'?'selected':''}>Planda yukarı–aşağı</option><option value="x" ${project.frameDirection==='x'?'selected':''}>Planda sağ–sol</option></select></label><div class="kv"><span>Toplam şase</span><b>${frames.length} adet</b></div><div class="kv"><span>Özel kenar parçası</span><b>${special} adet</b></div><button class="secondary" id="frameViewToggle">${view==='3d'?'Şase planına geç':'Duvar üzerinde 3D gör'} →</button><button class="text-button" id="showFrameReferences">Verdiğiniz 3 yerleşim örneği ↗</button>`)
 +(f?section(`<span class="eyebrow">SEÇİLİ ŞASE · ${f.special?'ÖZEL KENAR':'STANDART'}</span><h2>${f.id}</h2><div class="kv"><span>Dış genişlik</span><b>${fmt(f.width,2)} cm</b></div><div class="kv"><span>Boy</span><b>${fmt(f.length,2)} cm</b></div><div class="kv"><span>Yükseklik</span><b>20 cm</b></div><p>Boy ve kenar genişliği plan sınırından alınır.</p>`):'')
 +(view==='3d'?section(`<h3>Görünüm</h3><div class="segmented"><button id="rotate">↻ Döndür</button><button id="modelTheme">${Scene3D.state.theme==='light'?'Koyu zemin':'Açık zemin'}</button></div><label class="field">Katları ayrıştır<input id="explode" aria-label="Katları ayrıştır" type="range" min="0" max="360" value="${explode}"></label><p class="tip">Ayrıştırma yalnız görünüşü açar; kotlar değişmez.</p>`)+section('<h3>Görünür katlar</h3>'+project.floors.map(f=>`<label class="field-row layer-choice"><input type="checkbox" data-visibility="${f.id}" ${f.visible?'checked':''}>${f.name}<span class="subtle">${f.data?'':'· boş'}</span></label>`).join('')):'')
 +section(`<details><summary>Şase listesi · ${frames.length}</summary><div class="frame-list">${frames.map(f=>`<button data-select-frame="${f.id}" class="${selected?.id===f.id?'active':''}"><b>${f.id}</b><span>${fmt(f.width,2)} × ${fmt(f.length,2)} cm</span>${f.special?'<em>Özel</em>':''}</button>`).join('')}</div></details><p class="tip">STL profil biçimiyle yerleşim önizlemesi. Kayıt aralığı ve özel parçalar imalat onayı değildir. Veranda bu ara katın dışında tutulur.</p>`);
 $('#frameDirection').onchange=e=>{save();project.frameDirection=e.target.value;selected=null;render()};$('#frameViewToggle').onclick=()=>setView(view==='3d'?'mezz':'3d');
 $$('[data-select-frame]').forEach(b=>b.onclick=()=>{selected={type:'frame',id:b.dataset.selectFrame};renderCanvas();renderInspector()});
 $('#showFrameReferences').onclick=()=>$('#frameReferences').showModal();
 $$('[data-assembly]').forEach(b=>b.onclick=()=>{project.floors.forEach(f=>f.visible=f.id!=='first'||b.dataset.assembly!=='frame');explode=b.dataset.assembly==='exploded'?160:0;setView('3d')});
 if(view==='3d'){
  $('#explode').oninput=e=>{explode=+e.target.value;renderCanvas()};$('#rotate').onclick=()=>{Camera3D.state.yaw+=45;renderCanvas()};$('#modelTheme').onclick=()=>{Scene3D.state.theme=Scene3D.state.theme==='light'?'dark':'light';renderCanvas();renderInspector()};
  $$('[data-visibility]').forEach(e=>e.onchange=()=>{project.floors.find(f=>f.id===e.dataset.visibility).visible=e.checked;renderNav();renderCanvas()});
 }
}
function scheduleModel(){if(drawPending)return;drawPending=true;requestAnimationFrame(()=>{drawPending=false;render3D()})}
const modelCanvas=$('#modelCanvas');
modelCanvas.addEventListener('pointerdown',e=>{if(e.button>1)return;drag={x:e.clientX,y:e.clientY,startX:e.clientX,startY:e.clientY,pan:e.shiftKey||e.button===1,moved:false};modelCanvas.setPointerCapture(e.pointerId);e.preventDefault()});
modelCanvas.addEventListener('pointermove',e=>{if(!drag)return;const dx=e.clientX-drag.x,dy=e.clientY-drag.y;drag.moved||=Math.hypot(e.clientX-drag.startX,e.clientY-drag.startY)>4;if(drag.pan){Camera3D.state.panX+=dx;Camera3D.state.panY+=dy}else{Camera3D.state.yaw+=dx*.35;Camera3D.state.pitch=Math.max(8,Math.min(85,Camera3D.state.pitch+dy*.25))}drag.x=e.clientX;drag.y=e.clientY;scheduleModel()});
function insidePolygon(x,y,p){let inside=false;for(let i=0,j=p.length-1;i<p.length;j=i++)if((p[i].y>y)!==(p[j].y>y)&&x<(p[j].x-p[i].x)*(y-p[i].y)/(p[j].y-p[i].y)+p[i].x)inside=!inside;return inside}
modelCanvas.addEventListener('pointerup',e=>{if(!drag)return;const was=drag;drag=null;if(!was.moved&&lastProjection&&project.floors.find(f=>f.id==='mezz').visible){const r=modelCanvas.getBoundingClientRect(),hits=frameList().map(f=>({f,p:DraftFrames.footprint(f).map(p=>lastProjection({...p,z:project.height+20+explode}))})).filter(o=>insidePolygon(e.clientX-r.x,e.clientY-r.y,o.p)).sort((a,b)=>b.p[0].depth-a.p[0].depth);if(hits.length){selected={type:'frame',id:hits[0].f.id};renderCanvas();renderInspector()}}});
modelCanvas.addEventListener('pointercancel',()=>drag=null);
new ResizeObserver(()=>{if(view==='3d')scheduleModel()}).observe($('#viewport'));
Scene3D.state.theme='light';Camera3D.state.pitch=40;
syncSettings();render();
