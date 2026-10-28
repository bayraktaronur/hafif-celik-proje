/* Prototype-only countertop grip editing. Geometry is the persisted source of truth. */
(()=>{
 'use strict';
 const $=id=>document.getElementById(id),copy=o=>structuredClone(o);
 let drag=null;
 function params(c){
  const a=c.runs[0].angle*Math.PI/180,u={x:Math.cos(a),y:Math.sin(a)},o={...c.points[0]},q=c.points.at(-1),sign=((q.x-o.x)*-u.y+(q.y-o.y)*u.x)>=0?1:-1,v={x:-u.y*sign,y:u.x*sign};
  const local=p=>({x:(p.x-o.x)*u.x+(p.y-o.y)*u.y,y:(p.x-o.x)*v.x+(p.y-o.y)*v.y});
  const ps=c.points.map(local),side=ps.length===8?'u':ps.length===4?'none':local(c.runs[1]).x<c.runs[0].length/2?'start':'end';
  return {o,u,v,side,L:c.runs[0].length,R:c.runs[1]?.length||0,R2:c.runs[2]?.length||180,D:ps.length===8?ps[4].y:ps.length===4?ps[2].y:side==='start'?ps[2].y:ps[1].x-ps[3].x};
 }
 function make(c,values){
  const p=params(c),L=Number(values.L??p.L),R=Number(values.R??p.R),D=Number(values.D??p.D),side=values.side??p.side,R2=Number(values.R2??p.R2);
  if(![L,R,D].every(Number.isFinite)||D<20||D>150||L<Math.max(60,D)||L>10000||(side!=='none'&&(R<=D||R>10000))||(side==='u'&&(!Number.isFinite(R2)||R2<=D||R2>10000||L<=2*D)))throw Error('Derinlik 20–150 cm; kollar derinlikten kısa olamaz.');
  const o={...p.o};if(p.side==='end'){o.x+=p.u.x*(p.L-L);o.y+=p.u.y*(p.L-L);}
  const world=([x,y])=>({x:o.x+p.u.x*x+p.v.x*y,y:o.y+p.u.y*x+p.v.y*y});
  const ps=side==='u'?[[0,0],[L,0],[L,R2],[L-D,R2],[L-D,D],[D,D],[D,R],[0,R]]:side==='none'?[[0,0],[L,0],[L,D],[0,D]]:side==='start'?[[0,0],[L,0],[L,D],[D,D],[D,R],[0,R]]:[[0,0],[L,0],[L,R],[L-D,R],[L-D,D],[0,D]];
  const out={...copy(c),points:ps.map(world),runs:[{...world([L/2,D/2]),angle:c.runs[0].angle,length:L}]};
  if(side!=='none')out.runs.push({...world([side==='end'?L-D/2:D/2,R/2]),angle:(Math.atan2(p.v.y,p.v.x)*180/Math.PI+360)%360,length:R});
  if(side==='u')out.runs.push({...world([L-D/2,R2/2]),angle:(Math.atan2(p.v.y,p.v.x)*180/Math.PI+360)%360,length:R2});
  // Never leave an existing mounted hob/sink outside the shortened countertop.
  for(const f of G.fixtures||[])if(['hob','sink'].includes(f.kind)){
   const poly=CounterCut.footprint(f),area=f.w*f.d;
   if(CounterCut.difference(poly,[c.points]).area<.01&&CounterCut.difference(poly,[out.points]).area>.01)throw Error('Ocak veya evye bu ölçüye sığmıyor. Önce donatıyı taşıyın.');
  }
  return out;
 }
 function selected(){return G.seciliTip==='counter'&&(G.counters||[]).find(c=>c.id===G.secili?.id);}
 function handles(c){const p=params(c),world=(x,y)=>({x:p.o.x+p.u.x*x+p.v.x*y,y:p.o.y+p.u.y*x+p.v.y*y});return [{...world(p.side==='end'?0:p.L,p.D/2),key:'L'},...(p.side==='none'?[]:[{...world(p.side==='end'?p.L-p.D/2:p.D/2,p.R),key:'R'}]),...(p.side==='u'?[{...world(p.L-p.D/2,p.R2),key:'R2'}]:[])];}
 function commit(c,next){const id=c.id;Studio.edit(()=>{const i=G.counters.findIndex(x=>x.id===id);if(i>=0){G.counters[i]=next;G.secili=next;G.seciliTip='counter';}});updateSidebar();draw();}
 function start(e,p){const c=selected();if(!c||G.tool!=='sec')return false;const h=handles(c).find(h=>Math.hypot(h.x-p.x,h.y-p.y)*sc()<12);if(!h)return false;drag={c:copy(c),h,p:params(c),next:copy(c),error:''};e.preventDefault();e.stopImmediatePropagation();return true;}
 function mouse(e){const r=cv.getBoundingClientRect();return toCm(e.clientX-r.left,e.clientY-r.top);}
 window.addEventListener('mousemove',e=>{if(!drag)return;const m=mouse(e),p=drag.p,axis=drag.h.key==='L'?p.u:p.v,sign=drag.h.key==='L'&&p.side==='end'?-1:1,base=p[drag.h.key];
  let length=Math.round((base+sign*((m.x-drag.h.x)*axis.x+(m.y-drag.h.y)*axis.y))*10)/10;
  length=window.KitchenSnap?.length(drag.c,drag.h.key,length,e.altKey)??length;
  try{drag.next=make(drag.c,{[drag.h.key]:length});drag.error='';}catch(err){drag.error=err.message;drag.next=null;}draw();e.preventDefault();e.stopImmediatePropagation();},true);
 window.addEventListener('mouseup',e=>{if(!drag)return;const d=drag;drag=null;if(d.next&&JSON.stringify(d.next)!==JSON.stringify(d.c))commit(d.c,d.next);else draw();if(d.error)Studio.toast(d.error,true);e.preventDefault();e.stopImmediatePropagation();},true);
 window.addEventListener('keydown',e=>{if(drag&&e.key==='Escape'){drag=null;draw();e.preventDefault();e.stopImmediatePropagation();}},true);
 window.addEventListener('blur',()=>{if(drag){drag=null;draw();}});
 const base=window.drawElemanlar;window.drawElemanlar=function(){base();if(TH.export)return;const c=drag?.next||selected();if(!c)return;ctx.save();ctx.strokeStyle=drag?.error?'#ed8585':'#88d9c3';ctx.fillStyle='#162733';ctx.lineWidth=2;
  if(drag?.next){ctx.beginPath();c.points.forEach((p,i)=>{const q=toCv(p.x,p.y);i?ctx.lineTo(q.x,q.y):ctx.moveTo(q.x,q.y);});ctx.closePath();ctx.stroke();}
  ctx.font='13px sans-serif';for(const h of handles(c)){const q=toCv(h.x,h.y);ctx.fillRect(q.x-6,q.y-6,12,12);ctx.strokeRect(q.x-6,q.y-6,12,12);ctx.fillStyle='#88d9c3';ctx.fillText((h.key==='L'?'Ana kol ':h.key==='R2'?'Sağ dönüş ':'Dönüş ')+fmtCm(params(c)[h.key])+' cm',q.x+12,q.y-12);ctx.fillStyle='#162733';}ctx.restore();};
 const sidebar=window.updateSidebar;window.updateSidebar=function(){sidebar();const c=selected();if(!c)return;const p=params(c),host=$('sbSelIc');host.innerHTML='<div class="sb-t">Mutfak tezgâhı · '+(p.side==='none'?'Düz':p.side==='u'?'U':'L')+'</div><form id="counterEdit"><label>Biçim<select id="ceSide"><option value="none">Düz</option><option value="start">L · başlangıç</option><option value="end">L · bitiş</option><option value="u">U · iki dönüş</option></select></label><label>Ana kol · cm<input id="ceL" type="number" step="0.1" value="'+p.L+'" required></label>'+'<label id="ceReturn">Dönüş kolu · cm<input id="ceR" type="number" step="0.1" value="'+(p.R||180)+'" required></label><label id="ceReturn2">İkinci dönüş · cm<input id="ceR2" type="number" step="0.1" value="'+p.R2+'" required></label>'+'<label>Derinlik · cm<input id="ceD" type="number" min="20" max="150" step="0.1" value="'+p.D+'" required></label><p id="ceError" role="alert"></p><button class="sib" type="submit">Ölçüleri uygula</button></form><p>Uçlardaki kareleri sürükleyin. L köşesi sabit kalır. Esc: iptal. Ocak ve evye ayrı taşınır.</p><button class="sib" id="ceDelete">Tezgâhı sil</button>';
  $('ceSide').value=p.side;const visibility=()=>{$('ceReturn').hidden=$('ceSide').value==='none';$('ceReturn2').hidden=$('ceSide').value!=='u';};$('ceSide').onchange=visibility;visibility();
  host.querySelectorAll('input,select').forEach(i=>i.style.cssText='display:block;width:100%;box-sizing:border-box;padding:10px;margin:6px 0 12px;border:1px solid #40566b;border-radius:6px;background:#111d27;color:#dfebf3');
  $('counterEdit').onsubmit=e=>{e.preventDefault();try{commit(c,make(c,{side:$('ceSide').value,R2:+$('ceR2').value,L:+$('ceL').value,R:$('ceR')?+$('ceR').value:0,D:+$('ceD').value}));}catch(err){$('ceError').textContent=err.message;}};
  $('ceDelete').onclick=()=>Studio.edit(()=>{G.counters=G.counters.filter(x=>x.id!==c.id);G.secili=null;G.seciliTip=null;});
 };
 const stepBox=document.createElement('label');stepBox.textContent='Duvar taşıma adımı';const step=document.createElement('select');step.id='wallMoveStep';step.innerHTML='<option value="0">Serbest</option><option value="0.1">1 mm</option><option value="1">1 cm</option><option value="5">5 cm</option><option value="10">10 cm</option>';let stored=1;try{stored=Number(localStorage.getItem('prefabrikten.odak.wallMoveStep')??1);}catch{}step.value=[0,.1,1,5,10].includes(stored)?stored:1;step.onchange=()=>{try{localStorage.setItem('prefabrikten.odak.wallMoveStep',step.value);}catch{}};step.style.cssText='display:block;width:100%;padding:8px;margin:8px 0';stepBox.append(step);$('singleWallMove').prepend(stepBox);
 window.CounterEditor={params,make,handles,start};window.WallMoveStep={round:n=>+step.value?Math.round(n/+step.value)*+step.value:n};
})();
