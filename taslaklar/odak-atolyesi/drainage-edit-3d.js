/* Edits existing RainDrainage positions. Never changes quantity recipes. */
(function(){
 'use strict';
 const $=id=>document.getElementById(id),cv=$('roofCanvas'),D=RainDrainage;
 let enabled=false,adding=false,selection=null,drag=null,view=null,hits=[],bodies=[];
 const panel=document.createElement('section');panel.className='rain-edit';
 panel.innerHTML=`<h4>Yağmur inişleri · 3B düzenleme</h4><button id="rainEditToggle" aria-pressed="false">İnişleri düzenle</button><div id="rainEditTools" hidden><p>İnişe tıkla ve dere boyunca sürükle. Üst bağlantı X/Y yönünde dereye bağlıdır. İşaretler arkadaki inişleri de gösterir.</p><label>Dere<select id="rainEditRun"></select></label><label>İniş<select id="rainEditPipe"></select></label><label>A ucundan uzaklık · cm<input id="rainEditDistance" type="number" step="0.1" min="4.5"></label><div class="rain-edit-actions"><button id="rainEditMove">Mesafeyi uygula</button><button id="rainEditAdd" aria-pressed="false">İniş ekle</button><button id="rainEditDelete">Seçili inişi sil</button><button id="rainEditUndo">Geri al</button><button id="rainEditRedo">Yinele</button></div><small>Yakalama: 1 cm, köşe uç payı ve direk hizası. Esc: sürüklemeyi / eklemeyi iptal. Tekerlek: yakınlaş; orta tuş veya Shift: kamerayı kaydır.</small><p id="rainEditStatus" role="status" aria-live="polite"></p></div>`;
 $('roof-panel-model').append(panel);
 const style=document.createElement('style');style.textContent='.rain-edit{padding:16px;border-top:1px solid #40515c}.rain-edit h4{margin:0 0 12px}.rain-edit label{display:grid;gap:6px;margin:12px 0}.rain-edit button,.rain-edit input,.rain-edit select{min-height:44px;width:100%}.rain-edit-actions{display:grid;grid-template-columns:1fr 1fr;gap:8px}.rain-edit p,.rain-edit small{line-height:1.5}.rain-edit [aria-pressed=true]{background:#315d51;border-color:#a4d4bd}.rain-edit [hidden]{display:none!important}';document.head.append(style);
 const layout=()=>D.layout(RoofStudio.model(),G.roofs,RoofCore,G.rainDrainage);
 const status=s=>$('rainEditStatus').textContent=s;
 function refresh(){
  const d=layout(),previous=$('rainEditRun').value;
  const r=d.runs.find(r=>r.active&&r.key===(selection?.key||previous))||d.runs.find(r=>r.active);
  $('rainEditRun').replaceChildren(...d.runs.filter(r=>r.active).map(r=>new Option(r.label,r.key)));
  if(r)$('rainEditRun').value=r.key;
  if(selection&&!r?.pipes.some(p=>p.offset===selection.offset))selection=null;
  $('rainEditPipe').replaceChildren(new Option('İniş seçin',''),...(r?.pipes||[]).map(p=>new Option('A’dan '+p.offset.toFixed(1)+' cm',String(p.offset))));
  $('rainEditPipe').value=selection?String(selection.offset):'';
  if(document.activeElement!==$('rainEditDistance'))$('rainEditDistance').value=selection?.offset??'';
  $('rainEditDistance').max=r?String(r.len-4.5):'';
  for(const id of ['rainEditMove','rainEditDelete'])$(id).disabled=!selection;
  $('rainEditAdd').disabled=!r;
 }
 function commit(key,oldOffset,newOffset){
  const d=layout(),r=d.runs.find(r=>r.key===key&&r.active);if(!r)throw Error('Bu dere artık yok veya kapalı.');
  if(oldOffset!==null&&!r.pipes.some(p=>p.offset===oldOffset))throw Error('İniş değişmiş; yeniden seçin.');
  const positions=r.pipes.filter(p=>p.offset!==oldOffset).map(p=>p.offset);
  if(newOffset!==null){if(!Number.isFinite(newOffset)||newOffset<4.5||newOffset>r.len-4.5)throw Error('Konum dere uçlarından en az 4,5 cm içeride olmalı.');if(positions.some(p=>Math.abs(p-newOffset)<12))throw Error('İki iniş arasında en az 12 cm bırakın.');positions.push(newOffset);}
  positions.sort((a,b)=>a-b);const cfg=D.settings(G.rainDrainage);cfg.runs[key]={enabled:true,mode:'custom',positions};D.validate(cfg);
  const candidate=D.layout(RoofStudio.model(),G.roofs,RoofCore,cfg).runs.find(r=>r.key===key);
  if(candidate.pipes.length!==positions.length)throw Error('Bu noktada dirsek / duvar mesafesi uygun değil. Başka konum seçin.');
  if(oldOffset===newOffset)return;
  if(!Studio.edit(()=>{G.rainDrainage=cfg;}))throw Error('Değişiklik kaydedilemedi.');
  selection=newOffset===null?null:{key,offset:newOffset};RoofStudio.render();refresh();status('Uygulandı. Geri al ile önceki yerleşime dönebilirsiniz.');
 }
 const attempt=fn=>{try{fn();}catch(e){status(e.message);}};
 function toggle(){enabled=!enabled;adding=false;drag=null;$('rainEditToggle').setAttribute('aria-pressed',String(enabled));$('rainEditToggle').textContent=enabled?'Gezinme moduna dön':'İnişleri düzenle';$('rainEditTools').hidden=!enabled;$('rainEditAdd').setAttribute('aria-pressed','false');if(enabled){RoofStudio.setView('3d');refresh();status('İnişi seçin. Turuncu işaretleri sürükleyebilirsiniz.');}RoofStudio.repaint();}
 $('rainEditToggle').onclick=toggle;
 $('rainEditRun').onchange=()=>{selection=null;refresh();RoofStudio.repaint();};
 $('rainEditPipe').onchange=()=>{selection=$('rainEditPipe').value===''?null:{key:$('rainEditRun').value,offset:+$('rainEditPipe').value};refresh();RoofStudio.repaint();};
 $('rainEditMove').onclick=()=>attempt(()=>{if(!$('rainEditDistance').value.trim())throw Error('Mesafeyi girin.');commit(selection.key,selection.offset,+$('rainEditDistance').value);});
 $('rainEditDelete').onclick=()=>attempt(()=>commit(selection.key,selection.offset,null));
 $('rainEditAdd').onclick=()=>{adding=!adding;$('rainEditAdd').setAttribute('aria-pressed',String(adding));status(adding?'İniş eklemek için işaretli dere hattına tıklayın.':'Ekleme iptal edildi.');RoofStudio.repaint();};
 $('rainEditUndo').onclick=()=>{drag=null;geriAl();RoofStudio.render();refresh();status('Geri alındı.');};$('rainEditRedo').onclick=()=>{drag=null;ileriAl();RoofStudio.render();refresh();status('Yinelendi.');};
 const world=(r,t)=>({x:r.p.x+r.u.x*t,y:r.p.y+r.u.y*t,z:r.p.z+1+(G.foundation?.height||0)});
 function nearest(r,p){ // Search world distance through the actual camera: also correct in perspective.
  let lo=4.5,hi=r.len-4.5;const dist=t=>{const q=view.project(world(r,t));return(q.x-p.x)**2+(q.y-p.y)**2;};
  for(let i=0;i<35;i++){const a=lo+(hi-lo)/3,b=hi-(hi-lo)/3;if(dist(a)<dist(b))hi=b;else lo=a;}return{offset:(lo+hi)/2,d:Math.sqrt(dist((lo+hi)/2))};
 }
 function snap(r,t){let n=Math.round(t);const targets=[4.5,r.len-4.5,...(G.nodes||[]).map(p=>(p.x-r.p.x)*r.u.x+(p.y-r.p.y)*r.u.y)];for(const x of targets)if(x>=4.5&&x<=r.len-4.5&&Math.abs(x-t)<Math.abs(n-t)+2)n=x;return Math.round(Math.max(4.5,Math.min(r.len-4.5,n))*10)/10;}
 function draw(ctx,scene,project){
  view={project};hits=[];bodies=[];if(!enabled)return;const d=layout();refresh();ctx.save();
  for(const r of d.runs.filter(r=>r.active)){
   const a=project(world(r,0)),b=project(world(r,r.len));ctx.strokeStyle=r.key===$('rainEditRun').value?'#167b62':'#778f88';ctx.lineWidth=adding?4:2;ctx.setLineDash([6,4]);ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();ctx.setLineDash([]);
   for(const pipe of r.pipes){const p=project(world(r,pipe.offset)),sel=selection?.key===r.key&&selection.offset===pipe.offset;hits.push({x:p.x,y:p.y,key:r.key,offset:pipe.offset});ctx.fillStyle=sel?'#ffcc55':'#ec8d37';ctx.strokeStyle='#172b33';ctx.lineWidth=2;ctx.beginPath();ctx.arc(p.x,p.y,sel?9:7,0,Math.PI*2);ctx.fill();ctx.stroke();}
  }
  const ids=new Map(hits.map(h=>['pipe:'+h.key+':'+h.offset,h]));
  for(const item of scene.items){if(item.kind!=='rainDownpipe')continue;const hit=ids.get(item.partId);if(hit)bodies.push({hit,poly:item.poly.map(project)});}
  // Highlight the complete assembly, including elbows and clamps, as an edit overlay.
  if(selection){const id='pipe:'+selection.key+':'+selection.offset;ctx.strokeStyle='#e99726';ctx.lineWidth=.7;for(const item of scene.items){if(item.partId!==id&&!item.partId?.startsWith(id+':clamp'))continue;ctx.beginPath();item.poly.forEach((p,i)=>{const q=project(p);i?ctx.lineTo(q.x,q.y):ctx.moveTo(q.x,q.y);});ctx.closePath();ctx.stroke();}}
  if(drag){const r=d.runs.find(r=>r.key===drag.key);if(r){const p=project(world(r,drag.next));ctx.fillStyle='#137b61';ctx.beginPath();ctx.arc(p.x,p.y,10,0,7);ctx.fill();ctx.font='bold 14px sans-serif';ctx.fillText(drag.next.toFixed(1)+' cm',p.x+14,p.y-12);
   if(drag.next!==drag.offset){const cfg=D.settings(G.rainDrainage);cfg.runs[r.key]={enabled:true,mode:'custom',positions:[drag.next]};const preview=D.mesh(RoofStudio.model(),G.roofs,RoofCore,cfg).items;ctx.strokeStyle='#16836a';ctx.globalAlpha=.6;for(const item of preview){if(item.kind!=='rainDownpipe'||item.runKey!==r.key)continue;ctx.beginPath();item.poly.forEach((v,i)=>{const q=project({...v,z:v.z+(G.foundation?.height||0)});i?ctx.lineTo(q.x,q.y):ctx.moveTo(q.x,q.y);});ctx.closePath();ctx.stroke();}ctx.globalAlpha=1;}
  }}
  ctx.restore();
 }
 const point=e=>{const b=cv.getBoundingClientRect();return{x:e.clientX-b.left,y:e.clientY-b.top};};
 const stop=e=>{e.preventDefault();e.stopImmediatePropagation();};
 const active=()=>enabled&&document.body.dataset.singleView==='model';
 cv.addEventListener('pointerdown',e=>{if(!active()||e.button!==0||e.shiftKey||!view)return;stop(e);const p=point(e),d=layout();
  if(adding){const pick=d.runs.filter(r=>r.active).map(r=>({r,...nearest(r,p)})).sort((a,b)=>a.d-b.d)[0];if(!pick||pick.d>20){status('Dere hattına daha yakın tıklayın.');return;}attempt(()=>commit(pick.r.key,null,snap(pick.r,pick.offset)));return;}
  let hit=hits.map(h=>({...h,d:Math.hypot(h.x-p.x,h.y-p.y)})).sort((a,b)=>a.d-b.d)[0];
  if(!hit||hit.d>=18){const inside=poly=>{let yes=false;for(let i=0,j=poly.length-1;i<poly.length;j=i++){const a=poly[i],b=poly[j];if((a.y>p.y)!==(b.y>p.y)&&p.x<(b.x-a.x)*(p.y-a.y)/(b.y-a.y)+a.x)yes=!yes;}return yes;};const body=bodies.find(b=>inside(b.poly));hit=body?{...body.hit,d:0}:null;}
  if(hit?.d<18){selection={key:hit.key,offset:hit.offset};drag={...selection,next:hit.offset,start:p,anchor:{x:hit.x,y:hit.y}};cv.setPointerCapture(e.pointerId);refresh();RoofStudio.repaint();}else{selection=null;refresh();RoofStudio.repaint();}
 },true);
 cv.addEventListener('pointermove',e=>{if(!active()||!drag)return;stop(e);const r=layout().runs.find(r=>r.key===drag.key);if(!r)return;const p=point(e);if(Math.hypot(p.x-drag.start.x,p.y-drag.start.y)<3)return;drag.next=snap(r,nearest(r,{x:drag.anchor.x+p.x-drag.start.x,y:drag.anchor.y+p.y-drag.start.y}).offset);status('Önizleme: A’dan '+drag.next+' cm · Bırak: uygula · Esc: iptal');RoofStudio.repaint();},true);
 cv.addEventListener('pointerup',e=>{if(!drag)return;stop(e);const action=drag;drag=null;if(cv.hasPointerCapture(e.pointerId))cv.releasePointerCapture(e.pointerId);attempt(()=>commit(action.key,action.offset,action.next));RoofStudio.repaint();},true);
 cv.addEventListener('pointercancel',()=>{drag=null;RoofStudio.repaint();},true);
 // Capture on document before the existing window bubble handlers; engine delegates Escape below.
 function key(e){if(!enabled||!active()||['INPUT','SELECT','TEXTAREA'].includes(e.target.tagName))return false;if((e.ctrlKey||e.metaKey)&&['z','y'].includes(e.key.toLowerCase()))drag=null;if(e.key==='Escape'){drag=null;adding=false;$('rainEditAdd').setAttribute('aria-pressed','false');status('İşlem iptal edildi.');RoofStudio.repaint();return true;}if(e.key==='Delete'&&selection){attempt(()=>commit(selection.key,selection.offset,null));return true;}return false;}
 window.addEventListener('blur',()=>{if(drag){drag=null;RoofStudio.repaint();}});
 window.RainEdit3D={draw,key,commit,layout,toggle,get selection(){return selection;},get hits(){return hits;},projectRun:(key,offset)=>view?.project(world(layout().runs.find(r=>r.key===key),offset))};
})();
