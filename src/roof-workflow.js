/* Shared production direction and reference-boundary roof drawing. */
(function(){
 'use strict';
 const C=RoofCore,R=RoofStudio,$=id=>document.getElementById(id),copy=v=>JSON.parse(JSON.stringify(v));
 let draft=null,hover=null;
 const mainAngle=()=>G.catiYon==='dikey'?90:0;
 const panel=document.createElement('section');panel.className='roof-workflow';
 panel.innerHTML=`<h3>SINIRDAN ÇATI ÇİZ</h3>
 <label>Alın / baş makas taşması · mm<input id="roofDrawGable" type="number" min="1" max="5000" value="220" list="roofGableSizes"></label><datalist id="roofGableSizes"><option value="220"><option value="400"></datalist><label>Yan saçak taşması · mm<input id="roofDrawSide" type="number" min="0" max="5000" value="300" list="roofSideSizes"></label><datalist id="roofSideSizes"><option value="300"><option value="400"></datalist><p>Listeden standart ölçüyü seçin veya özel ölçü yazın. Alın taşması Alın V alt kanadıyla birlikte ayarlanır.</p><input id="roofDrawEave" type="hidden" value="30">
 <label>Çatı tipi<select id="roofBoundaryType"><option value="besik">Beşik</option><option value="kirma">Kırma</option><option value="tek">Tek eğim</option></select></label>
 <p>Saçak alt ucu duvar üst kotuna otomatik oturur.</p>
 <label>Eğim · %<input id="roofDrawPitch" type="number" min="1" max="200" value="33"></label>
 <label>Bağlanacağı çatı<select id="roofDrawParent"></select></label>
 <label>Yavru makas dizilimi<select id="roofChildDirection"><option value="90">U açıklığından otomatik</option></select></label>
 <button id="roofBoundaryMain">Ana çatı sınırını çiz</button><button id="roofBoundaryChild">Yavru çatı sınırını çiz</button>
 <button id="roofBoundaryFinish" hidden>Sınırı kapat · Enter</button><button id="roofBoundaryBack" hidden>Son köşeyi geri al</button>
 <p>Duvar dış yüzü köşelerine / hizalarına yakalanır. Mesnet sınırı kesik, saçak sınırı sarıdır. İlk köşeye tıklayın veya Enter ile kapatın. Yavru çatıda bağlanacağınız ana veya yavru çatının kenarından başlayın. İlk tıklama en yakın çatı kenarını seçer; adı yakalama etiketinde görünür. Üç dış kenarı açık U şeklinde çizin ve aynı bağlantı kenarında bitirin. Enter ile bağlayın; saplanma otomatik hesaplanır.</p>
 <label>Ortak makas dizilim yönü<select id="roofProductionDirection"><option value="yatay">X yönünde →</option><option value="dikey">Y yönünde ↓</option></select></label>`;
 $('roofZones').after(panel);
 $('roofDraw').closest('details').hidden=true;
 $('roofFromPlan').textContent='Planı kapsayan dikdörtgen çatı';
 function simplify(points){
  let ps=points.map(p=>({...p}));if(ps.length>1&&Math.hypot(ps[0].x-ps.at(-1).x,ps[0].y-ps.at(-1).y)<.001)ps.pop();
  let changed=true;while(changed&&ps.length>=3){changed=false;for(let i=0;i<ps.length;i++){const a=ps[(i+ps.length-1)%ps.length],b=ps[i],c=ps[(i+1)%ps.length];if(Math.abs((b.x-a.x)*(c.y-b.y)-(b.y-a.y)*(c.x-b.x))<.00001){ps.splice(i,1);changed=true;break;}}}
  if(ps.reduce((s,p,i)=>{const q=ps[(i+1)%ps.length];return s+p.x*q.y-q.x*p.y;},0)<0)ps.reverse();return ps;
 }
 function mainOf(z){return !z.sourceRoomId&&!z.attachment&&z.production?.role!=='child';}
 function align(z,target){let out=z;const current=((z.angle%180)+180)%180;
  if(Math.abs(current-target)<.001)return out;
  if(Math.abs(current-0)>.001&&Math.abs(current-90)>.001)throw Error('Eğik açılı eski çatı var. Ortak üretim yönü için sınırını yeniden çizin.');
  return C.turn(z,1);
 }
 // Opt-in rule: legacy roof objects keep their exact existing edge offsets.
 function applyEaveRule(z){
  if(!z.eaveRule)return z;
  const {gableMm,sideMm}=z.eaveRule,g=gableMm/10,v=sideMm/10;
  if(!Number.isFinite(g)||g<=0||g>500||!Number.isFinite(v)||v<0||v>500)throw Error('Alın 1–5000 mm, yan saçak 0–5000 mm olmalı.');
  const end=z.type==='kirma'?v:g;
  z.eaves=[end,z.childJoin?0:end,v,v];z.vergeWidth=gableMm;
  if(z.outline)z.edgeEaves=z.outline.map((p,i)=>{const q=z.outline[(i+1)%z.outline.length];return z.joinEdges?.[i]?0:Math.abs(q.x-p.x)<.01?end:v;});
  if(z.childJoin)z.childJoin.requestedSideEaves=[v,v];return z;
 }
 function reanchor(child,oldParent,parent){
  if(!oldParent||!child.childJoin)return;
  const old=C.footprint(oldParent).map(p=>C.transform(oldParent,p)),now=C.footprint(parent).map(p=>C.transform(parent,p));
  if(JSON.stringify(old)===JSON.stringify(now))return;
  if(old.length!==now.length)throw Error('Ana çatı kenar sayısı değişti; yavru bağlantısını yeniden çiziniz.');
  const ps=child.childJoin.points,on=(p,a,b)=>{const dx=b.x-a.x,dy=b.y-a.y,L=Math.hypot(dx,dy);return L&&Math.abs(dx*(p.y-a.y)-dy*(p.x-a.x))/L<.02&&(p.x-a.x)*(p.x-b.x)+(p.y-a.y)*(p.y-b.y)<=.02;};
  const i=old.findIndex((a,i)=>on(ps[0],a,old[(i+1)%old.length])&&on(ps[3],a,old[(i+1)%old.length]));
  if(i<0)throw Error('Eski yavru bağlantı kenarı bulunamadı. Değişiklik uygulanmadı.');
  const a=old[i],b=old[(i+1)%old.length],dx=b.x-a.x,dy=b.y-a.y;
  const candidates=now.map((u,j)=>({u,v:now[(j+1)%now.length]})).filter(({u,v})=>Math.abs(dx*(v.y-u.y)-dy*(v.x-u.x))<.01&&dx*(v.x-u.x)+dy*(v.y-u.y)>0).sort((m,n)=>Math.hypot(m.u.x+m.v.x-a.x-b.x,m.u.y+m.v.y-a.y-b.y)-Math.hypot(n.u.x+n.v.x-a.x-b.x,n.u.y+n.v.y-a.y-b.y));
  if(!candidates.length)throw Error('Yeni bağlantı kenarı bulunamadı.');const {u,v}=candidates[0];
  for(const k of [0,3]){const t=((ps[k].x-a.x)*dx+(ps[k].y-a.y)*dy)/(dx*dx+dy*dy);const q={x:u.x+t*(v.x-u.x),y:u.y+t*(v.y-u.y)};ps[k]=q;const outer=k===0?1:2;if(Math.abs(dx)>Math.abs(dy))ps[outer].x=q.x;else ps[outer].y=q.y;}
 }
 function synchronize(previous=[]){
  G.roofs.forEach(R.seat);
  G.roofs=G.roofs.map(z=>applyEaveRule(mainOf(z)?align(z,mainAngle()):z));
  const resolved=new Map(),visiting=new Set();
  function resolve(z){
   if(resolved.has(z.id))return resolved.get(z.id);
   if(visiting.has(z.id))throw Error('Çatı bağlantılarında döngü var.');visiting.add(z.id);
   if(z.production?.role==='child'){
    const source=G.roofs.find(r=>r.id===z.production.parentId);if(!source)throw Error('Yavru çatının bağlandığı çatı bulunamadı.');const parent=resolve(source);
    if(z.childJoin){reanchor(z,previous.find(p=>p.id===parent.id),parent);z=C.connectChild(z,parent);z.production.relative=((z.angle-parent.angle)%180+180)%180;}else z=align(z,((parent.angle%180)+z.production.relative)%180);z.group=parent.group;
   }
   if(z.attachment){z.attachment.base=R.verandaBase(z)||z.attachment.base;const parent=G.roofs.find(p=>p.id===z.attachment.parentId);z=C.attachVeranda(z,parent?resolve(parent):null);}
   visiting.delete(z.id);resolved.set(z.id,z);return z;
  }
  G.roofs=G.roofs.map(resolve);
 }
 function checkDirection(yon){
  if(!['yatay','dikey'].includes(yon))throw Error('Geçersiz makas yönü.');
  if(yon!==G.catiYon&&(G.trussOverrides||[]).length)throw Error('Elle taşınmış makaslar var. Ortak yönü değiştirmeden önce bunları otomatik aksa döndürün.');
 }
 function setDirection(yon){
  if(yon===G.catiYon)return;
  if(!isPref()){G.catiYon=yon;return;}
  const move=Prefab.reorientProduction(yon);
  // Move the mesnet boundary with its building, keeping the eaves separate.
  // Plan, section, 3D and quantities still consume these same roof objects.
  G.roofs=G.roofs.map(z=>{
   const shift=move.forPoint(C.transform(z,{x:z.w/2,y:z.d/2}));
   if(z.childJoin){z.childJoin.points=z.childJoin.points.map(shift);z.childJoin.support=z.childJoin.support.map(shift);return z;}
   const source=z.attachment?z.attachment.base:z;
   const world=C.basePolygon(source).map((p,i)=>{
    const ref=z.boundaryRefs?.[i],n=ref&&getNode(ref.nodeId);
    return n?{x:n.x+ref.dx,y:n.y+ref.dy}:shift(C.transform(source,p));
   }),local=world.map(p=>C.untransform(source,p));
   const x=Math.min(...local.map(p=>p.x)),y=Math.min(...local.map(p=>p.y)),w=Math.max(...local.map(p=>p.x))-x,d=Math.max(...local.map(p=>p.y))-y;
   const start=C.transform(source,{x,y});
   if(z.attachment){z.attachment.base={...source,...start,w,d};return z;}
   return {...z,...start,w,d,outline:z.outline?local.map(p=>({x:p.x-x,y:p.y-y})):undefined};
  });
 }
 function direction(yon){
  try{checkDirection(yon);if(yon===G.catiYon)return true;const previous=copy(G.roofs),ok=R.commit(()=>{setDirection(yon);synchronize(previous);},{preserveLayout:true});catiBtnGuncelle();draw();if(ok){const warnings=Prefab.issues().filter(i=>['truss-support','opening-joint','module-width','module-axis','module-junction'].includes(i.code));const message='Köşe payları ölçülere yansıtıldı; köşe direkleri, panel uçları ve H ekleri yeni makas akslarına göre hesaplandı.'+(warnings.length?' '+warnings.length+' kesim / mesnet kontrolü Plan kontrolünde.':'');R.notice(message,!!warnings.length);Studio.toast(message,!!warnings.length);}return ok;}
  catch(e){R.notice(e.message,true);Studio.toast(e.message,true);$('roofProductionDirection').value=G.catiYon;return false;}
 }
 window.catiYonAyarla=function(yon){return direction(yon);};
 function start(child){
  const parent=child?G.roofs.find(z=>z.id===$('roofDrawParent').value):null;
  if(child&&!parent){R.notice('Önce ana çatı çizin veya listeden seçin.',true);return;}
  const eave=+$('roofDrawSide').value/10,eaveRule={gableMm:+$('roofDrawGable').value,sideMm:+$('roofDrawSide').value},h=+G.opt.h||250,pitch=+$('roofDrawPitch').value;
  if(!Number.isFinite(eaveRule.gableMm)||eaveRule.gableMm<=0||eaveRule.gableMm>5000||!Number.isFinite(eave)||eave<0||eave>500||!(h>0&&h<=20000)||!(pitch>=1&&pitch<=200)){R.notice('Saçak, kot ve eğim değerlerini kontrol edin.',true);return;}
  R.setView('plan');draft={points:[],eave,eaveRule,h,pitch,type:$('roofBoundaryType').value,parentId:parent?.id||'',openU:!!child,relative:child?+$('roofChildDirection').value:0};hover=null;R.render();hint('plan');
 }
 function makeOutline(points,options){
  if(options.parentId&&options.openU){
   const parent=G.roofs.find(z=>z.id===options.parentId);
   let z=R.make({name:'Yavru çatı '+(G.roofs.length+1),type:options.type,pitch:options.pitch,h:options.h,eaves:[options.eave,0,options.eave,options.eave],childJoin:{points:points.map(p=>({x:p.x,y:p.y}))},production:{role:'child',parentId:options.parentId,relative:0}});
   z.eaveRule=options.eaveRule?copy(options.eaveRule):undefined;R.seat(z);applyEaveRule(z);z=C.connectChild(z,parent);z.production.relative=((z.angle-parent.angle)%180+180)%180;C.validate([...G.roofs,z],G.roofMaterials);return z;
  }
  const ps=simplify(points),world=ps;const x=Math.min(...ps.map(p=>p.x)),y=Math.min(...ps.map(p=>p.y)),w=Math.max(...ps.map(p=>p.x))-x,d=Math.max(...ps.map(p=>p.y))-y;
  const parent=G.roofs.find(z=>z.id===options.parentId),local=ps.map(p=>({x:p.x-x,y:p.y-y}));C.checkOutline(local);
  const joins=ps.map((a,i)=>{if(!parent)return false;const b=ps[(i+1)%ps.length],base=C.basePolygon(parent).map(p=>C.transform(parent,p));return [a,b,{x:(a.x+b.x)/2,y:(a.y+b.y)/2}].every(mid=>C.pointIn(base,mid)||base.some((p,j)=>{const q=base[(j+1)%base.length],dx=q.x-p.x,dy=q.y-p.y,L=Math.hypot(dx,dy);return L&&Math.abs(dx*(mid.y-p.y)-dy*(mid.x-p.x))/L<.01&&(mid.x-p.x)*(mid.x-q.x)+(mid.y-p.y)*(mid.y-q.y)<=.01;}));});
  let z=R.make({name:parent?'Yavru çatı '+(G.roofs.length+1):'Ana çatı '+(G.roofs.length+1),x,y,w,d,outline:local,boundaryRefs:ps.map(p=>p.ref||null),eaves:[options.eave,options.eave,options.eave,options.eave],edgeEaves:joins.map(j=>j?0:options.eave),joinEdges:joins,type:options.type,pitch:options.pitch,h:options.h,group:parent?.group,production:{role:parent?'child':'main',parentId:parent?.id||'',relative:options.relative||0}});
  if(parent){const pp=C.footprint(parent).map(p=>C.transform(parent,p));if(!C.triangulate(pp).some(a=>C.triangulate(world).some(b=>C.intersect(a,b).length)))throw Error('Yavru çatı ana çatıyla birleşmiyor. Sınırı ana çatı yüzeyine kadar uzatın.');}
  z=align(z,((parent?parent.angle:mainAngle())+(options.relative||0))%180);z.eaveRule=options.eaveRule?copy(options.eaveRule):undefined;applyEaveRule(z);C.validate(parent?[parent,z]:[z],G.roofMaterials);C.calculate(parent?[parent,z]:[z],G.roofMaterials);return z;
 }
 function finish(){
  if(!draft)return false;
  try{const z=makeOutline(draft.points,draft);const ok=R.commit(()=>{G.roofs.push(z);synchronize();});if(!ok)return false;draft=null;hover=null;R.select(z.id);R.fit();draw();return true;}
  catch(e){R.notice(e.message,true);return false;}
 }
 // One exterior-face intersection per physical corner; never four ± thickness choices.
 function exteriorCorners(){
  const rooms=(G.rooms||[]).filter(r=>r.tip!=='veranda').map(r=>r.nodeIds.map(getNode)).filter(p=>p.length>=3&&p.every(Boolean));
  const allRooms=(G.rooms||[]).map(r=>r.nodeIds.map(getNode)).filter(p=>p.length>=3&&p.every(Boolean));
  const center=G.nodes.reduce((c,n)=>({x:c.x+n.x/Math.max(1,G.nodes.length),y:c.y+n.y/Math.max(1,G.nodes.length)}),{x:0,y:0});
  const edges=G.segs.filter(s=>s.dis||s.tip==='veranda'||!rooms.length).map(s=>{const a=getNode(s.n1),b=getNode(s.n2);if(!a||!b)return null;const dx=b.x-a.x,dy=b.y-a.y,L=Math.hypot(dx,dy);if(!L)return null;
   let nx=-dy/L,ny=dx/L;const mid={x:(a.x+b.x)/2,y:(a.y+b.y)/2},polys=s.tip==='veranda'?allRooms:rooms;
   const left=polys.some(poly=>C.pointIn(poly,{x:mid.x+nx,y:mid.y+ny})),right=polys.some(poly=>C.pointIn(poly,{x:mid.x-nx,y:mid.y-ny}));
   if(left&&right)return null;
   if(left||(!right&&(center.x-mid.x)*nx+(center.y-mid.y)*ny>0)){nx=-nx;ny=-ny;}
   return {s,a,b,ux:dx/L,uy:dy/L,nx,ny,half:s.tip==='veranda'?5:(s.k||10)/2};
  }).filter(Boolean),out=[];
  for(const n of G.nodes){let es=edges.filter(e=>e.a.id===n.id||e.b.id===n.id);if(!es.length)continue;
   // Wall corners take priority over attached open veranda edges.
   const walls=es.filter(e=>e.s.tip!=='veranda');if(walls.length>=2)es=walls;
   const a=es[0],b=es.find(e=>Math.abs(a.ux*e.uy-a.uy*e.ux)>.001);let dx,dy;
   if(b){const det=a.nx*b.ny-a.ny*b.nx;dx=(a.half*b.ny-a.ny*b.half)/det;dy=(a.nx*b.half-a.half*b.nx)/det;}
   else if(es.length===1){const sign=a.a.id===n.id?-1:1;dx=a.nx*a.half+sign*a.ux*a.half;dy=a.ny*a.half+sign*a.uy*a.half;}
   else continue;
   if(Number.isFinite(dx)&&Number.isFinite(dy))out.push({x:n.x+dx,y:n.y+dy,ref:{nodeId:n.id,dx,dy}});
  }
  return out;
 }
 function childSnap(p,refs,radius){
  const count=draft.points.length;let parent=G.roofs.find(z=>z.id===draft.parentId);
  const project=(p,a,b)=>{const dx=b.x-a.x,dy=b.y-a.y,L=dx*dx+dy*dy,t=Math.max(0,Math.min(1,((p.x-a.x)*dx+(p.y-a.y)*dy)/L));return {x:a.x+t*dx,y:a.y+t*dy};};
  if(!count){
   const distance=z=>{const poly=C.footprint(z).map(v=>C.transform(z,v));return Math.min(...poly.map((a,i)=>{const q=project(p,a,poly[(i+1)%poly.length]);return Math.hypot(q.x-p.x,q.y-p.y);}));};
   let best=distance(parent);for(const z of G.roofs){if(z.sourceRoomId||z.attachment)continue;const d=distance(z);if(d<best-.001){parent=z;best=d;}}
  }
  const poly=C.footprint(parent).map(v=>C.transform(parent,v)),anchor=count?draft.points[0]:p;
  const edges=poly.map((a,i)=>{const b=poly[(i+1)%poly.length],q=project(anchor,a,b);return {a,b,q,d:Math.hypot(q.x-anchor.x,q.y-anchor.y)};}).filter(e=>!count||!draft.points[0].hostNormal||(draft.points[0].hostNormal==='y'?Math.abs(e.a.y-e.b.y)<.001:Math.abs(e.a.x-e.b.x)<.001)).sort((a,b)=>a.d-b.d),edge=edges[0];
  const horizontal=Math.abs(edge.a.y-edge.b.y)<.001,tangent=horizontal?'x':'y',normal=horizontal?'y':'x';
  if(!count){let q={...edge.q};let best=radius;for(const r of refs){const d=Math.abs(r[tangent]-p[tangent]);if(d<best&&r[tangent]>=Math.min(edge.a[tangent],edge.b[tangent])&&r[tangent]<=Math.max(edge.a[tangent],edge.b[tangent])){q[tangent]=r[tangent];best=d;}}return {...q,snapLabel:parent.name+' · bağlantı kenarı',hostId:parent.id,hostNormal:normal,invalid:edge.d>radius};}
  if(count>=3){const q={...draft.points[2]};q[normal]=draft.points[0][normal];delete q.ref;return {...q,snapLabel:'Aynı bağlantı kenarına dönüş',invalid:Math.hypot(q.x-p.x,q.y-p.y)>radius||q[tangent]<Math.min(edge.a[tangent],edge.b[tangent])||q[tangent]>Math.max(edge.a[tangent],edge.b[tangent])};}
  let q={x:Math.round(p.x),y:Math.round(p.y)},best=radius;
  for(const r of refs){const d=Math.hypot(r.x-p.x,r.y-p.y);if(d<best&&(count===1||Math.abs(r[normal]-draft.points[1][normal])<.001)){q={...r};best=d;}}
  if(count===1){if(!q.ref)q[tangent]=draft.points[0][tangent];}
  else{
   q[normal]=draft.points[1][normal];
   // The second outer point is constrained to the U front. Snap its other
   // coordinate to wall/host-edge alignments even when the corner itself is
   // far away, so a near click retains the exact perpendicular return.
   if(!q.ref){let distance=radius;for(const r of refs.concat([edge.a,edge.b])){
    const d=Math.abs(r[tangent]-p[tangent]);
    if(d<distance&&r[tangent]>=Math.min(edge.a[tangent],edge.b[tangent])&&r[tangent]<=Math.max(edge.a[tangent],edge.b[tangent])){q[tangent]=r[tangent];distance=d;q.snapLabel='Duvar hizası · ana kenara dik';}
   }}
  }
  return {...q,snapLabel:q.ref?'Duvar köşesi yakalandı':q.snapLabel||'U kenar hizası',invalid:q[tangent]<Math.min(edge.a[tangent],edge.b[tangent])||q[tangent]>Math.max(edge.a[tangent],edge.b[tangent])};
 }
 function snap(p){
  const radius=12/Math.max(.001,Math.abs(R.canvasPoint({x:1,y:0}).x-R.canvasPoint({x:0,y:0}).x)),refs=[];
  refs.push(...exteriorCorners());
  if(draft?.openU)return childSnap(p,refs,radius);
  refs.push(...(draft?.points||[]));let q={x:Math.round(p.x),y:Math.round(p.y)},best=radius;
  for(const n of refs){const d=Math.hypot(n.x-p.x,n.y-p.y);if(d<best&&(!draft?.points.length||Math.min(Math.abs(n.x-draft.points.at(-1).x),Math.abs(n.y-draft.points.at(-1).y))<.001)){q={...n};best=d;}}
  if(best===radius)for(const axis of ['x','y']){let d=radius;for(const n of refs)if(Math.abs(n[axis]-p[axis])<d){d=Math.abs(n[axis]-p[axis]);q[axis]=n[axis];}}
  if(draft?.points.length){const a=draft.points.at(-1),before={...q};if(Math.abs(q.x-a.x)>=Math.abs(q.y-a.y))q.y=a.y;else q.x=a.x;if(q.x!==before.x||q.y!==before.y)delete q.ref;}
  if(draft?.parentId){const parent=G.roofs.find(z=>z.id===draft.parentId),poly=C.footprint(parent).map(v=>C.transform(parent,v));let best=radius,hit=null;
   poly.forEach((a,i)=>{const b=poly[(i+1)%poly.length],dx=b.x-a.x,dy=b.y-a.y,L=dx*dx+dy*dy,t=Math.max(0,Math.min(1,((q.x-a.x)*dx+(q.y-a.y)*dy)/L)),v={x:a.x+t*dx,y:a.y+t*dy};const last=draft.points.at(-1);if(last&&Math.abs(v.x-last.x)>.001&&Math.abs(v.y-last.y)>.001)return;const d=Math.hypot(v.x-q.x,v.y-q.y);if(d<best){best=d;hit=v;}});if(hit)q=hit;
  }
  if(draft?.points.length>=3&&!draft.openU){const first=draft.points[0],last=draft.points.at(-1);
   if(Math.abs(q.x-last.x)<.001&&Math.abs(q.y-first.y)<radius){q.y=first.y;delete q.ref;}
   else if(Math.abs(q.y-last.y)<.001&&Math.abs(q.x-first.x)<radius){q.x=first.x;delete q.ref;}
  }
  return q;
 }
 function hint(mode){
  $('roofBoundaryFinish').hidden=$('roofBoundaryBack').hidden=!draft;$('roofBoundaryFinish').disabled=!draft||(draft.openU?draft.points.length!==4:draft.points.length<4);$('roofBoundaryBack').disabled=!draft?.points.length;$('roofBoundaryBack').textContent='Son çizim noktasını sil';$('roofBoundaryBack').title='Yalnızca devam eden çizimin son noktasını siler. Mevcut çatıları değiştirmez.';$('roofBoundaryFinish').textContent=draft?.openU?'Çatıyı oluştur · Enter':'Sınırı kapat · Enter';
  if(draft?.openU&&mode==='plan'){$('roofHint').textContent=['1/4: Bağlanacağınız ana veya yavru çatının kenarına tıklayın.','2/4: Dışarıdaki ilk duvar köşesine tıklayın.','3/4: Dışarıdaki ikinci duvar köşesine tıklayın.','4/4: Aynı ana çatı kenarına dönerek son noktaya tıklayın.','Dört nokta hazır. Çatıyı oluştur düğmesine veya Enter’a basın.'][Math.min(4,draft.points.length)]+' · Backspace: son noktayı sil · Esc: iptal';return;}
  if(draft&&mode==='plan')$('roofHint').textContent='Mesnet sınırı: '+draft.points.length+' köşe · saçak '+draft.eave+' cm · '+(draft.openU?'U uçları ana kenarda · Enter: bağla':(draft.points.length>=4?'Köşeler hazır · Enter veya Sınırı kapat ile oluştur':'ilk köşeye tıkla / Enter: kapat'))+' · Backspace: son köşe · Esc: iptal';
 }
 function line(ctx,points,project,close){if(!points.length)return;ctx.beginPath();points.forEach((p,i)=>{const v=project(p);if(i)ctx.lineTo(v.x,v.y);else ctx.moveTo(v.x,v.y);});if(close)ctx.closePath();ctx.stroke();}
 function trusses(z){
  const poly=z.childJoin?z.childJoin.support.map(p=>C.untransform(z,p)):C.basePolygon(z),out=[],lo=Math.min(...poly.map(p=>p.x)),hi=Math.max(...poly.map(p=>p.x));
  const candidates=G.nodes.map(p=>C.untransform(z,p)).filter(p=>p.x>=lo-15&&p.x<=hi+15&&p.y>=-15&&p.y<=z.d+15).map(p=>p.x).sort((a,b)=>a-b);
  const axis=z.angle%180<45?'x':'y',zero=C.transform(z,{x:0,y:0})[axis],sign=C.transform(z,{x:1,y:0})[axis]-zero,positions=[];
  // Start from the low WORLD axis even at 180°/270°. Starting at local min X
  // shifted every truss by half a module after a second turn of a half-bay roof.
  const world=candidates.map(x=>zero+sign*x),low=Math.min(zero+sign*lo,zero+sign*hi),high=Math.max(zero+sign*lo,zero+sign*hi);
  const origin=world.length?Math.min(...world):low,end=world.length?Math.max(...world):high;
  for(let x=origin;x<high-.001;x+=125.5)if(x>=low-.001)positions.push((x-zero)/sign);
  if(end>=low&&end<=high&&!positions.some(x=>Math.abs(zero+sign*x-end)<.01))positions.push((end-zero)/sign);
  positions.sort((a,b)=>sign*(a-b));
  for(const original of positions){let x=original;const world=C.transform(z,{x,y:0}),defaultPos=world[axis],edit=(G.trussOverrides||[]).find(e=>e.axis===axis&&(!e.zoneId||e.zoneId===z.id)&&Math.abs(e.from-world[axis])<.001&&candidates.length);
   if(edit){world[axis]=edit.to;x=C.untransform(z,world).x;}
   const cuts=[];poly.forEach((a,i)=>{const b=poly[(i+1)%poly.length];if(Math.abs(a.x-b.x)>.001&&x>=Math.min(a.x,b.x)-.001&&x<=Math.max(a.x,b.x)+.001)cuts.push(a.y+(x-a.x)*(b.y-a.y)/(b.x-a.x));});cuts.sort((a,b)=>a-b);
   for(let i=1;i<cuts.length;i++){if(cuts[i]-cuts[i-1]<.01)continue;const p={x:Math.max(lo+.0001,Math.min(hi-.0001,x)),y:(cuts[i]+cuts[i-1])/2};if(!C.pointIn(poly,p))continue;
    const supports=[];G.segs.filter(s=>s.tip!=='veranda').forEach(s=>{const a=C.untransform(z,getNode(s.n1)),b=C.untransform(z,getNode(s.n2));if(Math.abs(a.x-b.x)<.001)return;const t=(x-a.x)/(b.x-a.x);if(t>=-.001&&t<=1.001)supports.push(a.y+t*(b.y-a.y));});
    const near=v=>supports.filter(y=>Math.abs(y-v)<=15).sort((a,b)=>Math.abs(a-v)-Math.abs(b-v))[0],a=near(cuts[i-1]),b=near(cuts[i]);
    out.push({p:C.transform(z,{x,y:a??cuts[i-1]}),q:C.transform(z,{x,y:b??cuts[i]}),zoneId:z.id,defaultPos,supported:a!==undefined&&b!==undefined});}
  }return out;
 }
 function paint(ctx,project){
  ctx.save();ctx.lineWidth=1;ctx.strokeStyle='#f3b965';ctx.setLineDash([6,5]);
  G.roofs.forEach(z=>{trusses(z).forEach(t=>line(ctx,[t.p,t.q],project,false));});ctx.setLineDash([]);
  // Down-slope arrows come from the same planes used for quantities and 3D.
  ctx.strokeStyle='#8edbd4';ctx.lineWidth=1.5;
  const seen=new Set();R.model().faces.forEach(f=>{if(seen.has(f.key))return;seen.add(f.key);const m=f.poly.reduce((a,p)=>({x:a.x+p.x/f.poly.length,y:a.y+p.y/f.poly.length}),{x:0,y:0}),p=project(m),g=project({x:m.x-f.a,y:m.y-f.b}),L=Math.hypot(g.x-p.x,g.y-p.y);if(!L)return;const dx=(g.x-p.x)/L,dy=(g.y-p.y)/L,q={x:p.x+dx*24,y:p.y+dy*24};ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(q.x,q.y);ctx.moveTo(q.x-dx*7-dy*4,q.y-dy*7+dx*4);ctx.lineTo(q.x,q.y);ctx.lineTo(q.x-dx*7+dy*4,q.y-dy*7-dx*4);ctx.stroke();});
  if(draft){ctx.fillStyle='#5dffad';for(const corner of exteriorCorners()){const p=project(corner);ctx.fillRect(p.x-2,p.y-2,4,4);}const ps=draft.points.concat(hover&&(!draft.points.length||Math.hypot(hover.x-draft.points.at(-1).x,hover.y-draft.points.at(-1).y)>.001)?[hover]:[]);ctx.strokeStyle='#74d8ed';ctx.setLineDash([5,4]);line(ctx,ps,project,false);ctx.setLineDash([]);
   if(ps.length===2){const [a,b]=ps,L=Math.hypot(b.x-a.x,b.y-a.y);if(L){const local=C.untransform({x:a.x,y:a.y,angle:mainAngle()},b),edgeEave=draft.eaveRule&&!draft.parentId&&draft.type!=='kirma'&&Math.abs(local.x)<.01?draft.eaveRule.gableMm/10:draft.eave;const nx=-(b.y-a.y)/L*edgeEave,ny=(b.x-a.x)/L*edgeEave;ctx.strokeStyle='#ffd374';ctx.setLineDash([3,5]);const center=G.nodes.length?G.nodes.reduce((v,p)=>({x:v.x+p.x/G.nodes.length,y:v.y+p.y/G.nodes.length}),{x:0,y:0}):null;if(center){const side=(center.x-(a.x+b.x)/2)*nx+(center.y-(a.y+b.y)/2)*ny;const sign=side>0?-1:1;line(ctx,ps.map(p=>({x:p.x+sign*nx,y:p.y+sign*ny})),project,false);}ctx.setLineDash([]);}}
   if(ps.length>=3)try{let boundary;{const z=makeOutline(ps,draft);boundary=C.footprint(z).map(p=>C.transform(z,p));}ctx.strokeStyle='#ffd374';ctx.lineWidth=2;line(ctx,boundary,project,true);}catch(_){}
   if(hover){const p=project(hover);ctx.strokeStyle=hover.invalid?'#ff837b':hover.ref||hover.snapLabel?'#5dffad':'#74d8ed';ctx.lineWidth=2;ctx.strokeRect(p.x-7,p.y-7,14,14);ctx.fillStyle=ctx.strokeStyle;ctx.font='12px system-ui';ctx.fillText(hover.invalid?'Bağlantı kenarındaki hedefi yakalayın':hover.snapLabel||(hover.ref?'Köşe yakalandı':'Hiza / dik kenar'),p.x+12,p.y-12);}
   if(draft.points.length){const p=project(draft.points[0]);ctx.strokeStyle='#8be5ae';ctx.strokeRect(p.x-5,p.y-5,10,10);}
  }else{const z=G.roofs.find(z=>z.id===R.getSelected());if(z?.outline){ctx.strokeStyle='#74d8ed';ctx.setLineDash([4,4]);line(ctx,C.basePolygon(z).map(p=>C.transform(z,p)),project,true);}}
  ctx.restore();
 }
 function decorate(z){
  const old=$('roofDrawParent').value;$('roofDrawParent').replaceChildren(...G.roofs.filter(r=>!r.sourceRoomId&&!r.attachment).map(r=>new Option(r.name,r.id)));if(G.roofs.some(r=>r.id===old))$('roofDrawParent').value=old;
  $('roofProductionDirection').value=G.catiYon;
  if(!z)return;
  const directionText=((z.angle%180)+180)%180<45?'X →':'Y ↓';
  const info=document.createElement('p');info.className='panel-help';info.textContent='Makas dizilim yönü: '+directionText+' · Mahya: '+(z.type==='tek'?'yok':z.type==='kirma'?'kırma yüzey birleşimlerinden hesaplanır':directionText)+' · Eğim: '+(z.type==='tek'?'tek yöne':'mahyanın iki tarafına')+'.';$('roofForm').prepend(info);if(z.childJoin?.cornerTrimmed){const trim=document.createElement('p');trim.className='panel-help';trim.textContent='Ortak köşede yan saçak ana çatı kenarında sınırlandı; ikinci kez dışarı taşırılmadı.';$('roofForm').prepend(trim);}if(z.childJoin){const note=document.createElement('p');note.className='panel-help';note.textContent=z.childJoin.mode==='gable'?'Bağlantı: ana çatı alnına dayalı. Kot farkı betopanla kapatılır.':'Bağlantı: ana çatı yüzeyine saplanma.';$('roofForm').prepend(note);}
  if(!z.attachment){
   const section=document.createElement('fieldset');section.innerHTML='<legend>Alın ve yan saçak</legend><label class="roof-check"><input type="checkbox" name="useEaveRule" id="roofUseEaveRule" '+(z.eaveRule?'checked':'')+'> Ayrı alın / yan ölçülerini uygula</label><label>Alın / baş makas · mm<input name="gableMm" id="roofGableMm" type="number" min="1" max="5000" list="roofGableSizes" value="'+(z.eaveRule?.gableMm??z.vergeWidth??220)+'"></label><label>Yan saçak · mm<input name="sideMm" id="roofSideMm" type="number" min="0" max="5000" list="roofSideSizes" value="'+(z.eaveRule?.sideMm??z.eaves[2]*10)+'"></label><p>Standart veya özel ölçü. İşaretlenince Alın V alt kanadı alın taşmasına eşitlenir. Kırma çatıda bütün dış kenarlar yan saçak ölçüsünü kullanır. Birleşim kenarında ikinci taşma eklenmez.</p>';
   $('roofForm').prepend(section);presets('roofGableMm',[220,400]);presets('roofSideMm',[300,400]);
   const sync=()=>{if(!section.isConnected)return;const active=$('roofUseEaveRule').checked;for(const id of ['rz_vergeWidth','rz_vergeCustom','roofBoundaryEave'])if($(id))$(id).disabled=active;for(let i=0;i<4;i++)$('rz_e'+i).disabled=active||!!z.outline||(!!z.childJoin&&i===1);};
   for(const id of ['roofGableMm','roofSideMm'])$(id).oninput=()=>{$('roofUseEaveRule').checked=true;sync();};$('roofUseEaveRule').onchange=sync;queueMicrotask(sync);
  }
  $('rz_angle').disabled=true;
  if(z.boundaryRefs?.some((ref,i)=>{if(!ref)return false;const n=getNode(ref.nodeId),p=C.transform(z,z.outline[i]);return !n||Math.hypot(p.x-n.x-ref.dx,p.y-n.y-ref.dy)>.01;})){
   const warning=document.createElement('p');warning.className='roof-warning';warning.textContent='Kat planındaki bağlı köşe değişti. Mesnet sınırını yeniden çizerek çatıya aktarın; çatı sınırı kendiliğinden taşınmadı.';$('roofForm').prepend(warning);
  }
  if(z.production?.role!=='child'&&!z.attachment){$('roofTurn').disabled=false;$('roofTurn').textContent='Ortak üretim yönünü değiştir';}
  if(z.childJoin){$('roofReverse').disabled=true;$('rz_e1').disabled=true;$('roofTurn').disabled=true;$('roofTurn').textContent='Saplanma yönü U açıklığına bağlı';for(const k of ['x','y','w','d','angle'])$('rz_'+k).disabled=true;}
  if(z.outline){for(const k of ['x','y','w','d','e0','e1','e2','e3'])$('rz_'+k).disabled=true;
   const label=document.createElement('label');label.textContent='Dış kenar saçak mesafesi · cm';const input=document.createElement('input');input.name='boundaryEave';input.id='roofBoundaryEave';input.type='number';input.min=0;input.max=500;input.value=z.eaves[0];label.append(input);$('roofForm').prepend(label);
   if(z.production?.role==='child'){$('roofTurn').disabled=false;$('roofTurn').textContent='Yavru yönü: aynı / dik';}
  }
 }
 function apply(z,next,steps,data){
  try{
   const previous=copy(G.roofs);
   if(data.has('useEaveRule'))next.eaveRule={gableMm:Number(data.get('gableMm')),sideMm:Number(data.get('sideMm'))};else delete next.eaveRule;
   if(next.childJoin)next.childJoin.requestedSideEaves=[next.eaves[2],next.eaves[3]];
   if(z.outline&&!next.eaveRule){const e=Number(data.get('boundaryEave'));if(!Number.isFinite(e)||e<0||e>500)throw Error('Saçak 0–500 cm olmalı.');if(e!==z.eaves[0]){next.eaves=[e,e,e,e];next.edgeEaves=z.outline.map((_,i)=>z.joinEdges?.[i]?0:e);}}
   applyEaveRule(next);
   if(steps===1&&mainOf(z)){const yon=G.catiYon==='yatay'?'dikey':'yatay';checkDirection(yon);return R.commit(()=>{G.roofs[G.roofs.findIndex(r=>r.id===z.id)]=next;setDirection(yon);synchronize(previous);catiBtnGuncelle();},{preserveLayout:true});}
   if(steps&&next.childJoin)throw Error('Saplanma yönünü değiştirmek için U sınırını yeniden çizin.');
   if(steps===1&&next.production?.role==='child')next.production.relative=next.production.relative===90?0:90;
   else if(steps)next=C.turn(next,steps);
   const ok=R.commit(()=>{G.roofs[G.roofs.findIndex(r=>r.id===z.id)]=next;synchronize(previous);});draw();return ok;
  }catch(e){R.notice(e.message,true);return false;}
 }
 const cv=$('roofCanvas');cv.addEventListener('pointerdown',e=>{if(!draft||e.button!==0)return;e.stopImmediatePropagation();e.preventDefault();if(draft.openU&&draft.points.length>=4){R.notice('Dört nokta hazır. Çatıyı oluştur düğmesine basın; düzeltmek için son çizim noktasını silin.');return;}const raw=R.world(e),q=snap(raw),first=draft.points[0];if(q.invalid){R.notice('Gösterilen ana çatı bağlantı noktasına yaklaşın.',true);return;}R.notice('');if(draft.openU&&!draft.points.length&&q.hostId){draft.parentId=q.hostId;$('roofDrawParent').value=q.hostId;}if(draft.openU&&draft.points.length===1){const a=draft.points[0],horizontal=a.hostNormal==='y';a[horizontal?'x':'y']=q[horizontal?'x':'y'];}if(!draft.openU&&first&&draft.points.length>=3&&Math.hypot(R.canvasPoint(first).x-R.canvasPoint(raw).x,R.canvasPoint(first).y-R.canvasPoint(raw).y)<14){finish();return;}if(!draft.points.length||Math.hypot(q.x-draft.points.at(-1).x,q.y-draft.points.at(-1).y)>.01)draft.points.push(q);hover=null;hint('plan');R.repaint();},true);
 cv.addEventListener('pointermove',e=>{if(!draft)return;hover=snap(R.world(e));R.repaint();},true);
 window.addEventListener('keydown',e=>{if(!draft||['INPUT','SELECT','TEXTAREA'].includes(e.target.tagName))return;if(['Enter','Escape','Backspace'].includes(e.key)){e.preventDefault();e.stopImmediatePropagation();if(e.key==='Enter')finish();else if(e.key==='Escape'){draft=null;hover=null;R.render();}else{draft.points.pop();hover=null;hint('plan');R.repaint();}}},true);
 // The roof dialog's older capture listener predates this module. Handle the
 // drawing shortcuts there via a hook, before it consumes the event.
 function key(e){if(!draft||['INPUT','SELECT','TEXTAREA'].includes(e.target.tagName))return false;if(!['Enter','Escape','Backspace'].includes(e.key))return false;e.preventDefault();if(e.key==='Enter')finish();else if(e.key==='Escape'){draft=null;hover=null;R.render();}else{draft.points.pop();hover=null;hint('plan');R.repaint();}return true;}

 $('roofBoundaryMain').onclick=()=>start(false);$('roofBoundaryChild').onclick=()=>start(true);$('roofBoundaryFinish').onclick=finish;$('roofBoundaryBack').onclick=()=>{draft?.points.pop();hover=null;hint('plan');R.repaint();};$('roofProductionDirection').onchange=e=>direction(e.target.value);
 // Visible presets keep the standard dimensions discoverable; inputs accept custom millimetres.
 function presets(inputId,values){const input=$(inputId);if(!input||input.nextElementSibling?.dataset.presets)return;const row=document.createElement('div');row.dataset.presets='1';for(const value of values){const button=document.createElement('button');button.type='button';button.textContent=value+' mm';button.onclick=()=>{input.value=value;input.dispatchEvent(new Event('input',{bubbles:true}));};row.append(button);}input.after(row);}
 presets('roofDrawGable',[220,400]);presets('roofDrawSide',[300,400]);
 const previousAnalysis=window.makasAnaliz;window.makasAnaliz=function(){
  if(!G.roofs.length)return previousAnalysis();const makaslar=[];
  G.roofs.forEach(z=>{const axis=z.angle%180<45?'x':'y',cross=axis==='x'?'y':'x',bounds=C.basePolygon(z).map(p=>C.transform(z,p)[axis]);
   trusses(z).forEach(t=>{const p=t.p,q=t.q;makaslar.push({no:makaslar.length+1,zoneId:z.id,zoneName:z.name,axis,pos:p[axis],a:Math.min(p[cross],q[cross]),b:Math.max(p[cross],q[cross]),acik:Math.abs(q[cross]-p[cross]),aralik:125.5,lo:Math.min(...bounds),hi:Math.max(...bounds),defaultPos:t.defaultPos,manual:Math.abs(p[axis]-t.defaultPos)>.001,nodeId:G.nodes[0]?.id,supported:t.supported});});});
  return{makaslar,yatay:G.catiYon==='yatay',lo:Math.min(0,...makaslar.map(m=>m.pos)),hi:Math.max(0,...makaslar.map(m=>m.pos)),kalan:0,minD:Math.min(0,...makaslar.map(m=>m.a))};
 };
 const previousMove=Prefab.trussMove;Prefab.trussMove=function(reset=false){if(!G.roofs.length)return previousMove(reset);const m=makasAnaliz().makaslar[+$('trussSelect').value];if(!m?.nodeId)return false;const to=reset?m.defaultPos:Number($('trussPosition').value.replace(',','.'));if(!Number.isFinite(to)||to<m.lo||to>m.hi){Studio.toast('Makas konumu bölüm sınırları içinde olmalı.',true);return false;}if(makasAnaliz().makaslar.some(n=>n!==m&&n.zoneId===m.zoneId&&Math.abs(n.pos-to)<.01)){Studio.toast('Bu bölümde aynı konumda bir makas var.',true);return false;}return Studio.edit(()=>{G.trussOverrides=(G.trussOverrides||[]).filter(e=>!(e.zoneId===m.zoneId&&Math.abs(e.from-m.defaultPos)<.001));if(!reset)G.trussOverrides.push({nodeId:m.nodeId,zoneId:m.zoneId,axis:m.axis,from:m.defaultPos,to});});};
 const previousMakas=window.drawMakas;window.drawMakas=function(){if(!G.roofs.length)return previousMakas();if(!G.makasGoster)return;ctx.save();ctx.lineWidth=1;ctx.strokeStyle='#e6ac66';ctx.fillStyle='#e6ac66';ctx.font='11px system-ui';G.roofs.forEach(z=>{ctx.setLineDash([7,5]);trusses(z).forEach(t=>line(ctx,[t.p,t.q],p=>toCv(p.x,p.y),false));ctx.setLineDash([]);const p=C.transform(z,{x:z.w/2,y:0}),q=toCv(p.x,p.y);ctx.fillText(z.name+' · makas dizilimi '+(z.angle%180<45?'→':'↓'),q.x,q.y-14);});ctx.restore();};
 window.RoofWorkflow={exteriorCorners,start,finish,makeOutline,snap,paint,decorate,hint,apply,direction,synchronize,trusses,key,ensure(){if(G.roofs.some(z=>mainOf(z)&&Math.abs(z.angle%180-mainAngle())>.001))return R.commit(synchronize);return true;},cancel(){draft=null;hover=null;},getDraft:()=>draft};
})();
