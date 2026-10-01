/* Kitchen plan geometry, in centimetres. Countertops remain independent of walls. */
(function(){
 'use strict';
 const $=id=>document.getElementById(id);let wall=null,preview=null;
 G.counters=G.counters||[];
 const button=document.createElement('button');button.id='t-kitchen';button.className='t';button.textContent='Mutfak';document.querySelector('.tool-group').append(button);
 const menu=document.createElement('dialog');menu.id='kitchenMenu';menu.innerHTML='<h3>Mutfak</h3><button class="sib" id="counterStart">Tezgâh çiz · düz / L</button><button class="sib" data-product="hob">Ocak</button><button class="sib" data-product="sink">Evye</button><button class="sib" data-product="fridge">Buzdolabı</button><button class="sib" data-close>Kapat</button>';
 const dialog=document.createElement('dialog');dialog.id='counterDialog';dialog.innerHTML='<h3>Tezgâh · 60 cm derinlik</h3><p>Seçtiğiniz duvar yüzünden içeri doğru çizilir. Başlangıç ucu planda işaretlidir.</p><form><label>Başlangıçtan boşluk (cm)<input id="counterOffset" type="number" min="0" step="0.5" value="0" required></label><label>Ana kol uzunluğu (cm)<input id="counterLength" type="number" min="60" step="0.5" required></label><label>Biçim<select id="counterReturn"><option value="none">Düz</option><option value="start">L · başlangıç ucundan dön</option><option value="end">L · bitiş ucundan dön</option></select></label><label id="counterReturnLabel">Dönüş kolu toplam uzunluğu (cm)<input id="counterReturnLength" type="number" min="60" step="0.5" value="180"></label><p id="counterError" role="alert" style="color:#ffb58f"></p><button class="sib" type="submit">Tezgâhı ekle</button><button class="sib" type="button" data-close>İptal</button></form>';
 for(const d of [menu,dialog]){d.style.cssText='background:#192334;color:#c5d6e6;border:1px solid #40566b;border-radius:12px;padding:24px;width:360px;max-height:85vh;overflow:auto';document.body.append(d);d.querySelector('[data-close]').onclick=()=>{d.close();preview=null;draw();};}
 dialog.querySelectorAll('input,select').forEach(e=>e.style.cssText='display:block;width:100%;padding:8px;margin:6px 0 12px;background:#101b29;color:#d6e6ef;border:1px solid #40566b');
 button.onclick=()=>menu.showModal();menu.querySelectorAll('[data-product]').forEach(b=>b.onclick=()=>{menu.close();Fixtures.openKind(b.dataset.product);});
 $('counterStart').onclick=()=>{menu.close();setTool('counter');Studio.toast('Tezgâhın geleceği duvarın oda tarafına, duvara yakın tıklayın.');};
 const add=(a,b,k=1)=>({x:a.x+b.x*k,y:a.y+b.y*k}),dot=(a,b)=>a.x*b.x+a.y*b.y;
 function pick(p){let best=null;for(const s of G.segs){if(s.tip==='veranda')continue;const a=getNode(s.n1),b=getNode(s.n2),dx=b.x-a.x,dy=b.y-a.y,L=Math.hypot(dx,dy);if(L<60||Math.min(Math.abs(dx),Math.abs(dy))>.01)continue;const u={x:dx/L,y:dy/L},v={x:-u.y,y:u.x},q={x:p.x-a.x,y:p.y-a.y},t=dot(q,u),side=dot(q,v);if(t<0||t>L||Math.abs(side)>s.k/2+25)continue;if(!best||Math.abs(side)<best.distance)best={s,a,b,u,v:side>=0?v:{x:-v.x,y:-v.y},L,distance:Math.abs(side)};}if(!best)return null;
   function neighbor(id){return G.segs.filter(s=>s.id!==best.s.id&&s.tip!=='veranda'&&(s.n1===id||s.n2===id)).map(s=>{const a=getNode(id),b=getNode(s.n1===id?s.n2:s.n1),q={x:b.x-a.x,y:b.y-a.y};return {s,q,L:Math.hypot(q.x,q.y)};}).find(o=>Math.abs(dot(o.q,best.u))<.01&&dot(o.q,best.v)>60);}
   best.left=neighbor(best.s.n1);best.right=neighbor(best.s.n2);best.lo=best.left?best.left.s.k/2:0;best.hi=best.L-(best.right?best.right.s.k/2:0);return best;
 }
 function make(w,offset,length,side,ret){
   if(![offset,length,ret].every(Number.isFinite)||offset<0||length<60||offset+length>w.hi-w.lo+.01)throw Error('Kullanılabilir duvar uzunluğu '+fmtCm(w.hi-w.lo)+' cm. Boşluk + ana kol bu sınırı aşmamalı; ana kol en az 60 cm olmalı.');
   const start=w.lo+offset,end=start+length,neighbor=side==='start'?w.left:w.right;
   if(side!=='none'){
     if(!neighbor)throw Error('Bu uçta oda tarafına dönen dik duvar yok.');
     if(side==='start'&&offset>.01||side==='end'&&Math.abs(end-w.hi)>.01)throw Error('L dönüşü için ana kol seçilen köşeye kadar uzanmalı.');
     // Leave room for the far wall if one meets the return endpoint.
     const far=neighbor.s.n1===w.s.n1||neighbor.s.n1===w.s.n2?neighbor.s.n2:neighbor.s.n1;
     const trim=Math.max(0,...G.segs.filter(s=>s.id!==neighbor.s.id&&(s.n1===far||s.n2===far)).map(s=>s.k/2));
     if(ret<=60||ret>neighbor.L-w.s.k/2-trim)throw Error('Dönüş kolu 60 cm’den uzun olmalı ve dik duvara sığmalı.');
   }
   const origin=add(add(w.a,w.u,start),w.v,w.s.k/2),world=([x,y])=>add(add(origin,w.u,x),w.v,y);
   const points=side==='none'?[[0,0],[length,0],[length,60],[0,60]]:side==='start'?[[0,0],[length,0],[length,60],[60,60],[60,ret],[0,ret]]:[[0,0],[length,0],[length,ret],[length-60,ret],[length-60,60],[0,60]];
   const angle=(Math.atan2(w.u.y,w.u.x)*180/Math.PI+360)%360;
   const runs=[{...world([length/2,30]),angle,length}];if(side!=='none')runs.push({...world([side==='start'?30:length-30,ret/2]),angle:(Math.atan2(w.v.y,w.v.x)*180/Math.PI+360)%360,length:ret});
   // Door openings are reserved space; never place a counter through them.
   for(const e of G.elemanlar.filter(e=>e.tip_==='kapi')){let a,b;if(e.segId===w.s.id){a=start;b=end;}else if(side!=='none'&&e.segId===neighbor.s.id){const atStart=neighbor.s.n1===w.s.n1||neighbor.s.n1===w.s.n2;a=atStart?w.s.k/2:neighbor.L-w.s.k/2-ret;b=atStart?w.s.k/2+ret:neighbor.L-w.s.k/2;}else continue;const s=getSeg(e.segId),A=getNode(s.n1),B=getNode(s.n2),pos=e.t*Math.hypot(B.x-A.x,B.y-A.y)+e.en/2;if(pos+e.en/2>a+.01&&pos-e.en/2<b-.01)throw Error('Tezgâh kapı açıklığıyla çakışıyor; boşluk veya uzunluğu değiştirin.');}
   return {id:'counter-'+crypto.randomUUID(),points:points.map(world),runs};
 }
 function form(){return make(wall,+$('counterOffset').value,+$('counterLength').value,$('counterReturn').value,+$('counterReturnLength').value);}
 function refresh(){ $('counterReturnLabel').hidden=$('counterReturn').value==='none';try{preview=form();$('counterError').textContent='';}catch(e){preview=null;$('counterError').textContent=e.message;}draw();}
 dialog.oninput=refresh;dialog.onchange=refresh;dialog.addEventListener('close',()=>{preview=null;draw();});
 dialog.querySelector('form').onsubmit=e=>{e.preventDefault();try{const c=form();if(Studio.edit(()=>G.counters.push(c))){dialog.close();select(c);}}catch(err){$('counterError').textContent=err.message;}};
 function select(c){G.secili=c;G.seciliTip='counter';G.selSegs=[];updateSidebar();draw();}
 function inside(p,points){let yes=false;for(let i=0,j=points.length-1;i<points.length;j=i++){const a=points[i],b=points[j];if((a.y>p.y)!==(b.y>p.y)&&p.x<(b.x-a.x)*(p.y-a.y)/(b.y-a.y)+a.x)yes=!yes;}return yes;}
 function stop(e){e.preventDefault();e.stopImmediatePropagation();}
 window.addEventListener('mousedown',e=>{if(e.target!==cv||e.button!==0)return;const r=cv.getBoundingClientRect(),p=toCm(e.clientX-r.left,e.clientY-r.top);if(G.tool==='counter'){stop(e);wall=pick(p);if(!wall){Studio.toast('Yatay veya dikey duvarın oda tarafına yakın tıklayın.',true);return;}setTool('sec');$('counterOffset').value=0;$('counterLength').value=Math.min(300,wall.hi-wall.lo);$('counterReturn').value='none';$('counterReturnLength').value=180;refresh();dialog.showModal();return;}if(G.tool==='sec'&&!Fixtures.hit(p)){const c=(G.counters||[]).slice().reverse().find(c=>effective(c).contains(p));if(c){stop(e);select(c);}}},true);
 const baseDraw=drawElemanlar;window.drawElemanlar=function(){
   function paint(c,color){ctx.save();ctx.strokeStyle=color;ctx.lineWidth=1.4;ctx.beginPath();for(const e of effective(c).edges){const a=toCv(e.a.x,e.a.y),b=toCv(e.b.x,e.b.y);ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);}ctx.stroke();ctx.restore();}
   (G.counters||[]).forEach(c=>paint(c,!TH.export&&G.seciliTip==='counter'&&G.secili?.id===c.id?'#ffd469':TH.wall));
   if(preview&&!TH.export){paint(preview,'#8ee4c6');const p=toCv(preview.points[0].x,preview.points[0].y);ctx.save();ctx.fillStyle='#8ee4c6';ctx.font='12px sans-serif';ctx.fillText('Başlangıç',p.x+6,p.y-8);ctx.restore();}baseDraw();
 };
 const baseSidebar=updateSidebar;window.updateSidebar=function(){baseSidebar();if(G.seciliTip==='counter'&&G.secili){$('sbSel').style.display='block';$('sbSelIc').innerHTML='<div class="sb-t">Mutfak tezgâhı</div><p>60 cm derinlik · '+(G.secili.points.length===4?'Düz':'L')+'</p><p>Duvar değişirse tezgâhı yeniden yerleştirin. Ocak ve evye ayrı nesnelerdir.</p><button class="sib" id="counterDelete">Tezgâhı sil</button>';$('counterDelete').onclick=remove;}};
 function remove(){if(G.seciliTip==='counter')Studio.edit(()=>{G.counters=G.counters.filter(c=>c.id!==G.secili.id);});}
 window.addEventListener('keydown',e=>{if(/INPUT|TEXTAREA|SELECT/.test(e.target.tagName)||dialog.open||menu.open)return;if(G.tool==='counter'&&e.key==='Escape'){stop(e);setTool('sec');}else if(G.seciliTip==='counter'&&e.key==='Delete'){stop(e);remove();}},true);
 function effective(c){return CounterCut.difference(c.points,(G.fixtures||[]).filter(f=>f.kind==='fridge').map(CounterCut.footprint));}
 function inward(c,index){
   const r=c.runs[index],a=r.angle*Math.PI/180,v={x:-Math.sin(a),y:Math.cos(a)};
   // Old saved counters have no explicit wall normal. Recover it from the outline.
   const reference=index===0?{x:r.x-(c.points[0].x+c.points[1].x)/2,y:r.y-(c.points[0].y+c.points[1].y)/2}:{x:c.runs[0].x-r.x,y:c.runs[0].y-r.y};
   return dot(reference,v)>=0?v:{x:-v.x,y:-v.y};
 }
 function snapFixture(f,p){
   if(!['hob','sink','fridge'].includes(f.kind))return p;
   const fridge=f.kind==='fridge';let best=null;
   for(const c of G.counters||[])for(const [index,r] of c.runs.entries()){
     const a=r.angle*Math.PI/180,u={x:Math.cos(a),y:Math.sin(a)},v=inward(c,index),q={x:p.x-r.x,y:p.y-r.y},along=dot(q,u),across=dot(q,v);
     if(r.length<f.w||Math.abs(across)>40||Math.abs(along)>r.length/2+(fridge?f.w/2+15:0))continue;
     const point=add(add(r,u,Math.max(-(r.length-f.w)/2,Math.min((r.length-f.w)/2,along))),v,fridge?(f.d-60)/2:0);
     const angle=fridge?(Math.atan2(-v.x,v.y)*180/Math.PI+360)%360:r.angle;
     // A removed countertop area is not a valid sink/hob placement target.
     if(!fridge){const poly=CounterCut.footprint({...f,...point,angle});if((G.fixtures||[]).some(g=>g.kind==='fridge'&&CounterCut.difference(poly,[CounterCut.footprint(g)]).area<f.w*f.d-.01))continue;}
     const distance=Math.hypot(point.x-p.x,point.y-p.y);if(!best||distance<best.distance)best={...point,angle,distance};
   }
   return best?{x:best.x,y:best.y,angle:best.angle}:p;
 }
 window.Kitchen={pick,make,inside,snapFixture,effective,cancel:()=>{preview=null;wall=null;dialog.close();menu.close();}};
})();
