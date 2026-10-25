/* Exact, undoable wall moves in the independent draft; never changes global snap rules. */
(()=>{
 'use strict';
 const $=id=>document.getElementById(id),EPS=.001,clone=o=>structuredClone(o);
 let pending=null,dimensions=[],applying=false;
 const box=document.createElement('section');box.id='singleWallMove';box.hidden=true;
 box.innerHTML='<h3>DUVAR TAŞIMA</h3><div id="singleMoveStart"><p>Seçili duvarı istediğin ölçüye getir.</p><div class="move-actions"><button class="primary" id="singleMoveByDimension">Ölçüyle taşı</button><button id="singleMoveByOffset">Mesafe kadar taşı</button></div></div><form id="singleMoveForm" hidden><p id="singleMoveHint"></p><div id="singleMoveFields" hidden><label id="singleMoveCurrentLabel">Mevcut ölçü <output id="singleMoveCurrent"></output></label><label id="singleMoveDirectionLabel">Yön<select id="singleMoveDirection"><option value="1"></option><option value="-1"></option></select></label><label id="singleMoveValueLabel"><span>Yeni ölçü · cm</span><input id="singleMoveValue" inputmode="decimal" autocomplete="off" required></label><p id="singleMoveMessage" aria-live="polite"></p></div><div class="move-actions"><button id="singleMoveApply" class="primary" type="submit" disabled>Uygula</button><button id="singleMoveCancel" type="button">Vazgeç</button></div><p>H ve ızgaraya atlamaz. Kalan paneller özel ölçüye göre hesaplanır.</p></form>';
 $('selectionHost').prepend(box);
 const stamp=()=>JSON.stringify({n:G.nodes,s:G.segs,e:G.elemanlar,c:G.catiYon});
 // Capture the actual measured endpoints; screen offsets/text positions never define a distance.
 const lineBase=window._dimLine;window._dimLine=function(ax,ay,ux,uy,sx,sy,d0,d1,...rest){
  const count=G._dimHits?.length||0,meta=_dimRow?{..._dimRow.meta,row:_dimRow.row}:null;
  const out=lineBase.call(this,ax,ay,ux,uy,sx,sy,d0,d1,...rest);
  if(meta&&!TH.export){const measure={...meta,p0:{x:ax+ux*d0,y:ay+uy*d0},p1:{x:ax+ux*d1,y:ay+uy*d1},ux,uy,value:d1-d0};
   if(G._dimHits?.length>count)measure.hit=G._dimHits.at(-1);
   dimensions.push(measure);
  }return out;
 };
 const dimsBase=window.drawDims;window.drawDims=function(...args){if(!TH.export)dimensions=[];return dimsBase.apply(this,args);};
 function selection(){return G.seciliTip==='seg'&&G.secili?getSeg(G.secili.id):null;}
 function context(){const s=selection();if(!s)throw Error('Önce Duvar seç ile taşınacak duvarı seçin.');
  const old=G.wallDrag,a=getNode(s.n1),b=getNode(s.n2);
  try{wallDragBegin(s,{x:(a.x+b.x)/2,y:(a.y+b.y)/2},0,0);if(!G.wallDrag)throw Error('Duvar doğrultusu belirlenemedi.');return clone(G.wallDrag);}finally{G.wallDrag=old;}
 }
 function start(mode){
  try{const W=context();pending={mode,W,stamp:stamp(),measure:null,coefficient:0};setTool('wall-position');
   $('singleMoveValue').value='';$('singleMoveMessage').textContent='';$('singleMoveApply').disabled=true;
   $('singleMoveHint').textContent=mode==='dimension'?'Çizimde vurgulanan ölçülerden değiştirmek istediğine tıkla.':'Duvarın taşınacağı yönü ve mesafeyi gir.';
   $('singleMoveFields').hidden=mode==='dimension';$('singleMoveDirectionLabel').hidden=mode==='dimension';$('singleMoveCurrentLabel').hidden=mode!=='dimension';
   $('singleMoveValueLabel').firstElementChild.textContent=mode==='dimension'?'Yeni ölçü · cm':'Taşıma mesafesi · cm';
   const horizontal=Math.abs(W.nx)>.999,vertical=Math.abs(W.ny)>.999;
   const plus=horizontal?(W.nx>0?'Sağa →':'← Sola'):vertical?(W.ny>0?'Aşağı ↓':'↑ Yukarı'):'Normal yön (+)',minus=horizontal?(W.nx>0?'← Sola':'Sağa →'):vertical?(W.ny>0?'↑ Yukarı':'Aşağı ↓'):'Ters yön (−)';
   $('singleMoveDirection').options[0].textContent=plus;$('singleMoveDirection').options[1].textContent=minus;$('singleMoveDirection').value='1';
   draw();if(mode==='offset')$('singleMoveValue').focus();else if(!candidates().length)$('singleMoveHint').textContent='Bu duvara bağlı görünür ölçü yok. Görünümden ölçüleri açabilir veya Mesafe kadar taşı komutunu kullanabilirsin.';
  }catch(e){Studio.toast(e.message,true);}
 }
 function cancel(){pending=null;$('singleMoveForm').hidden=true;setTool('sec');draw();}
 function attachment(p,W){
  // Measured endpoints can lie on a wall face (corner allowance), not just its axis.
  return W.groupIds.some(id=>{const s=getSeg(id),a=s&&getNode(s.n1),b=s&&getNode(s.n2);if(!a||!b)return false;const L=Math.hypot(b.x-a.x,b.y-a.y),ux=(b.x-a.x)/L,uy=(b.y-a.y)/L,t=(p.x-a.x)*ux+(p.y-a.y)*uy;
   return t>=-s.k/2-EPS&&t<=L+s.k/2+EPS&&Math.abs((p.x-a.x)*uy-(p.y-a.y)*ux)<=s.k/2+EPS;
  });
 }
 function coefficient(m,W){
  const dot=m.ux*W.nx+m.uy*W.ny;if(Math.abs(dot)<.999)return 0;
  const a=attachment(m.p0,W),b=attachment(m.p1,W);return a===b?0:dot*(b?1:-1);
 }
 function candidates(){return !pending?[]:dimensions.filter(m=>m.hit&&m.value>EPS&&Math.abs(coefficient(m,pending.W))>.999);}
 function choose(m){const c=pending&&coefficient(m,pending.W);if(!c)return false;
  pending.measure={...m,hit:undefined};pending.coefficient=c;pending.move0=c*(m.ux*pending.W.nx+m.uy*pending.W.ny)<0;
  $('singleMoveCurrent').textContent=fmtCm(m.value)+' cm';$('singleMoveFields').hidden=false;$('singleMoveHint').textContent='Bu ölçünün sabit ucu korunur; seçili duvar yeni mesafeye taşınır.';
  $('singleMoveValue').value=fmtCm(m.value);updatePreview();$('singleMoveValue').focus();$('singleMoveValue').select();return true;
 }
 function proposal(){
  if(!pending)throw Error('Önce bir duvar seçin.');if(pending.stamp!==stamp())throw Error('Plan değişti. Duvarı yeniden seçin.');
  const text=$('singleMoveValue').value.trim(),value=Number(text.replace(',','.'));
  if(!text||!Number.isFinite(value)||value<=0||value>100000)throw Error('0–100.000 cm arasında bir değer girin.');
  const {W,mode,measure,coefficient:c}=pending;if(mode==='dimension'&&!measure)throw Error('Önce çizimdeki ölçüyü seçin.');
  const off=mode==='dimension'?(value-measure.value)/c:value*Number($('singleMoveDirection').value);
  if(Math.abs(off)<.01-1e-8)throw Error('Taşıma en az 0,01 cm olmalı.');
  if(off<W.lo-EPS||off>W.hi+EPS)throw Error('Bu mesafe bağlı duvarı ters çeviriyor. Daha küçük bir mesafe girin.');
  return {off,value,dx:W.nx*off,dy:W.ny*off};
 }
 function updatePreview(){try{const {dx,dy}=proposal();$('singleMoveMessage').textContent=(Math.abs(dx)>EPS?fmtCm(Math.abs(dx))+' cm '+(dx<0?'sola':'sağa'):'')+(Math.abs(dx)>EPS&&Math.abs(dy)>EPS?' · ':'')+(Math.abs(dy)>EPS?fmtCm(Math.abs(dy))+' cm '+(dy<0?'yukarı':'aşağı'):'');$('singleMoveMessage').className='';$('singleMoveApply').disabled=false;}
  catch(e){$('singleMoveMessage').textContent=e.message;$('singleMoveMessage').className='move-error';$('singleMoveApply').disabled=true;}draw();
 }
 function openingPositions(){return G.elemanlar.map(e=>{const s=getSeg(e.segId),a=getNode(s.n1),b=getNode(s.n2);return{id:e.id,x:a.x+(b.x-a.x)*e.t,y:a.y+(b.y-a.y)*e.t};});}
 function execute(){
  let change;try{change=proposal();}catch(e){Studio.toast(e.message,true);return false;}
  const task=pending,{W,measure}=task,{off,dx,dy,value}=change,oldPositions=openingPositions(),oldErrors=new Set(pfAnaliz().runs.filter(r=>r.cfgHata).map(r=>r.owner.id));
  applying=true;
  // Only this explicit operation permits custom panel lengths. Other snap/module settings stay intact.
  const ok=Studio.edit(()=>{
   const old=G.wallDrag;G.wallDrag=clone(W);try{applyWallOffset(off);}finally{G.wallDrag=old;}
   // Existing openings must travel with their host wall or retain their world position, never silently clamp.
   const after=openingPositions();for(const e of oldPositions){const moved=W.elPos.find(p=>p?.id===e.id)?.onWall,now=after.find(p=>p.id===e.id);if(!now||Math.hypot(now.x-e.x-(moved?dx:0),now.y-e.y-(moved?dy:0))>.01)throw Error('Bu mesafe kapı/pencereyi duvar ucuna sıkıştırıyor. Önce açıklığı düzenleyin.');}
   normalizeGraph();detectRooms();
   if(pfAnaliz().runs.some(r=>r.cfgHata&&!oldErrors.has(r.owner.id)))throw Error('Özel panel dizilimi bu mesafeye sığmıyor. Önce panel dizilimini düzenleyin.');
   if(measure){
    // Recompute actual dimension endpoints after topology/corner allowances, not just a predicted label.
    draw();const move0=task.move0;
    const p0={x:measure.p0.x+(move0?dx:0),y:measure.p0.y+(move0?dy:0)},p1={x:measure.p1.x+(!move0?dx:0),y:measure.p1.y+(!move0?dy:0)};
    if(!dimensions.some(m=>Math.abs(m.value-value)<.01&&Math.hypot(m.p0.x-p0.x,m.p0.y-p0.y)<.01&&Math.hypot(m.p1.x-p1.x,m.p1.y-p1.y)<.01))throw Error('Birleşim şekli bu ölçüyü değiştiriyor. İşlem geri alındı; Mesafe kadar taşı komutuyla yön ve mesafe seçin.');
   }
  },{preserveLayout:true});
  applying=false;pending=null;setTool('sec');updateSidebar();draw();
  if(ok)Studio.toast(task.mode==='dimension'?'Ölçü '+fmtCm(value)+' cm oldu.':'Duvar '+fmtCm(Math.abs(off))+' cm taşındı.');return ok;
 }
 $('singleMoveByDimension').onclick=()=>start('dimension');$('singleMoveByOffset').onclick=()=>start('offset');$('singleMoveCancel').onclick=cancel;
 $('singleMoveValue').oninput=updatePreview;$('singleMoveDirection').onchange=updatePreview;$('singleMoveForm').onsubmit=e=>{e.preventDefault();execute();};
 const stop=e=>{e.preventDefault();e.stopImmediatePropagation();};
 window.addEventListener('mousedown',e=>{if(!pending||e.target!==cv||e.button!==0)return;stop(e);if(pending.mode!=='dimension')return;
  const r=cv.getBoundingClientRect(),x=e.clientX-r.left,y=e.clientY-r.top;
  const hits=candidates().map(m=>({m,d:Math.min(Math.hypot(x-m.hit.tx,y-m.hit.ty),ptSegDistPx(x,y,m.hit.q0.x,m.hit.q0.y,m.hit.q1.x,m.hit.q1.y))})).filter(h=>h.d<12).sort((a,b)=>a.d-b.d);
  if(hits[0])choose(hits[0].m);else Studio.toast('Seçili duvara bağlı, vurgulanan bir ölçüye tıklayın.');draw();
 },true);
 window.addEventListener('keydown',e=>{if(pending&&e.key==='Escape'){stop(e);cancel();}},true);
 function sync(){
  if(pending&&!applying&&(pending.stamp!==stamp()||G.tool!=='wall-position')){pending=null;if(G.tool==='wall-position'){setTool('sec');return;}}
  box.hidden=!pending&&!selection();$('singleMoveStart').hidden=!!pending;$('singleMoveForm').hidden=!pending;
  if(pending)$('stbar').textContent='Duvar taşıma · '+(pending.mode==='dimension'&&!pending.measure?'Vurgulanan ölçüye tıkla':'Yeni konumu önizle ve Uygula')+' · Esc: vazgeç';
 }
 function paint(){if(!pending||TH.export||applying)return;ctx.save();
  if(pending.mode==='dimension'&&!pending.measure){for(const m of candidates()){const h=m.hit;ctx.fillStyle='#8ed4b327';ctx.strokeStyle='#8ed4b3';ctx.lineWidth=1;ctx.fillRect(h.tx-h.tw/2-5,h.ty-10,h.tw+10,20);ctx.strokeRect(h.tx-h.tw/2-5,h.ty-10,h.tw+10,20);}}
  try{const {dx,dy}=proposal();ctx.strokeStyle='#9bd7bf';ctx.setLineDash([7,4]);for(const id of pending.W.groupIds){const s=getSeg(id),a=getNode(s.n1),b=getNode(s.n2),p=toCv(a.x+dx,a.y+dy),q=toCv(b.x+dx,b.y+dy);ctx.lineWidth=Math.max(2,s.k*sc());ctx.globalAlpha=.35;ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(q.x,q.y);ctx.stroke();}}
  catch{}ctx.restore();
 }
 const drawBase=window.draw;window.draw=function(...args){if(pending)G.snapPt=null;const out=drawBase.apply(this,args);sync();paint();return out;};
 window.SingleWallMove={start,cancel,execute,candidates,choose,active:()=>!!pending};sync();
})();
