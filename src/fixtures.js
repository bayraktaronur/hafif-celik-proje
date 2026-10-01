/* Free-standing sanitary fixtures: centimetres, independent of panel snapping. */
(function(){
 'use strict';
 const names={wallwc:'Gömme klozet',wc:'Takım klozet',basin:'Ayaklı lavabo',vanity:'Dolaplı lavabo',shower:'Duş kabini',washer:'Çamaşır makinesi'};
 const standard={basin:{w:44.52,d:38.97},wallwc:{w:36.07,d:57.61},wc:{w:36.07,d:65.98},washer:{w:60,d:60}};
 const $=id=>document.getElementById(id);let draft=null,ghost=null,moving=null,step=1,handles=[];
 G.fixtures=G.fixtures||[];
 const button=document.createElement('button');button.className='t';button.id='t-fixture';button.textContent='♧ Vitrifiye ekle';button.onclick=open;document.querySelector('.tool-group').append(button);
 const dialog=document.createElement('dialog');dialog.id='fixtureDialog';dialog.style.cssText='background:#192334;color:#c5d6e6;border:1px solid #40566b;border-radius:12px;padding:24px;width:360px;max-height:90vh;overflow:auto';
 dialog.innerHTML='<form method="dialog"><h3>Vitrifiye ekle</h3><label>Ürün<select id="fixtureKind"></select></label><label>Ölçü seçimi<select id="fixturePreset"></select></label><div id="fixturePreview" style="height:130px;text-align:center"></div><label>En (cm)<input id="fixtureWidth" type="number" min="1" max="500" step="0.1" required></label><label>Derinlik (cm)<input id="fixtureDepth" type="number" min="1" max="500" step="0.1" required></label><p id="fixtureSizeHelp" style="font-size:12px">Ürünün gerçek dış ölçülerini girin.</p><label>Yerleştirme<select id="fixtureSnap"><option value="1">1 cm yakalama</option><option value="0">Serbest</option></select></label><p>R: 90° döndür · M: aynala · Esc: iptal</p><button type="submit" class="sib">Yerleştir</button><button type="button" class="sib" id="fixtureCancel">İptal</button></form>';
 document.body.append(dialog);dialog.querySelectorAll('input,select').forEach(el=>el.style.cssText='display:block;width:100%;margin:6px 0 12px;padding:9px;background:#101b29;color:#d6e6ef;border:1px solid #40566b;border-radius:5px');
 $('fixtureKind').innerHTML=Object.entries(names).map(([k,n])=>'<option value="'+k+'">'+n+'</option>').join('');
 function presets(){const kind=$('fixtureKind').value,fixed=standard[kind];['fixturePreset','fixtureWidth','fixtureDepth'].forEach(id=>{$(id).parentElement.hidden=!!fixed;$(id).disabled=!!fixed;});$('fixtureSizeHelp').hidden=!!fixed;const options=kind==='shower'?['70/70','80/80','90/90','80/100','90/100','80/110']:kind==='vanity'?['50/','60/','70/','80/']:[];$('fixturePreset').innerHTML=options.map(v=>'<option value="'+v+'">'+v.replace('/', ' × ')+' cm</option>').join('')+'<option value="">Özel ölçü</option>';dimensions();}
 function dimensions(){const fixed=standard[$('fixtureKind').value];const [w,d]=fixed?[fixed.w,fixed.d]:($('fixturePreset').value||'').split('/');$('fixtureWidth').value=w||'';$('fixtureDepth').value=d||'';preview();}
 function preview(){const w=+$('fixtureWidth').value,d=+$('fixtureDepth').value;$('fixturePreview').innerHTML=w&&d?'<canvas width="180" height="130"></canvas>':'<p>Önizleme için en ve derinliği girin.</p>';if(w&&d){const c=$('fixturePreview').firstChild;symbol(c.getContext('2d'),{kind:$('fixtureKind').value,w,d,angle:0,mirror:false},90,65,Math.min(110/w,110/d),'#c5d6e6');}}
 function open(){presets();dialog.showModal();}
 $('fixtureKind').onchange=presets;$('fixturePreset').onchange=dimensions;$('fixtureWidth').oninput=preview;$('fixtureDepth').oninput=preview;$('fixtureCancel').onclick=()=>dialog.close();
 dialog.querySelector('form').onsubmit=e=>{e.preventDefault();const w=+$('fixtureWidth').value,d=+$('fixtureDepth').value;if(!(w>=1&&w<=500&&d>=1&&d<=500))return;draft={kind:$('fixtureKind').value,w,d,...standard[$('fixtureKind').value],angle:0,mirror:false};step=+$('fixtureSnap').value;ghost=null;setTool('fixture');dialog.close();Studio.toast('Ürünü fareyle konumlandırıp tıklayın. R: döndür · M: aynala · Esc: iptal.');};
 function symbol(c,f,x,y,s,color){c.save();c.translate(x,y);c.rotate(f.angle*Math.PI/180);c.scale(f.mirror?-s:s,s);c.translate(-f.w/2,-f.d/2);c.strokeStyle=color;c.lineWidth=1.2/s;c.fillStyle=TH.opening;const w=f.w,d=f.d;
 const rect=(x,y,w,h)=>{c.strokeRect(x,y,w,h);};const line=(x,y,a,b)=>{c.beginPath();c.moveTo(x,y);c.lineTo(a,b);c.stroke();};const ellipse=(x,y,rx,ry)=>{c.beginPath();c.ellipse(x,y,rx,ry,0,0,Math.PI*2);c.stroke();};
 if(f.kind==='shower'){rect(0,0,w,d);rect(3,3,w-6,d-6);ellipse(w-8,8,2,2);line(w-11,11,w-24,24);line(w-12,8,w-25,8);line(w-8,12,w-8,25);}
 else if(f.kind==='washer'){
   rect(0,0,w,d);line(0,d-8,w,d-8);rect(5,d-6,13,4);ellipse(w-8,d-4,2,2);
   // Keep the label readable through rotation and mirroring; no dimension labels.
   c.save();c.translate(w/2,d/2-2);c.scale(f.mirror?-1:1,1);c.rotate(-f.angle*Math.PI/180);
   c.fillStyle=color;c.font='bold 12px sans-serif';c.textAlign='center';c.textBaseline='middle';c.fillText('Ç.M',0,0);c.restore();
 }
 else if(f.kind==='vanity'){rect(0,0,w,d);ellipse(w/2,d*.54,Math.min(w*.38,d*.42),d*.43);ellipse(w/2,d*.57,Math.min(w*.33,d*.37),d*.35);ellipse(w/2,d*.25,1.5,1.5);ellipse(w/2,d*.48,2,2);}
 else if(f.kind==='basin'){
   // Tapered back, rounded bowl and curved inner lip from the supplied plan.
   c.beginPath();c.moveTo(w*.025,0);c.lineTo(w*.975,0);
   c.bezierCurveTo(w*.985,d*.17,w,d*.34,w,d*.53);
   c.bezierCurveTo(w,d*.84,w*.79,d,w*.5,d);
   c.bezierCurveTo(w*.21,d,0,d*.84,0,d*.53);
   c.bezierCurveTo(0,d*.34,w*.015,d*.17,w*.025,0);c.closePath();c.stroke();
   c.beginPath();c.moveTo(w*.09,d*.33);c.bezierCurveTo(w*.13,d*.22,w*.87,d*.22,w*.91,d*.33);c.stroke();
   ellipse(w/2,d*.12,1.3,1.3);ellipse(w/2,d*.4,2.9,2.9);ellipse(w/2,d*.4,2,2);
 }else {
   const radius=w/2,front=d-radius,back=f.kind==='wc'?d*.27:0;
   c.beginPath();c.moveTo(0,back);c.lineTo(0,front);c.arc(w/2,front,radius,Math.PI,0,true);c.lineTo(w,back);c.closePath();c.stroke();
   if(f.kind==='wc'){
     rect(0,0,w,back);c.beginPath();c.moveTo(0,back-4);c.quadraticCurveTo(0,back-1.5,3,back-1.5);c.lineTo(w-3,back-1.5);c.quadraticCurveTo(w,back-1.5,w,back-4);c.stroke();ellipse(w/2,back*.45,1.7,1.7);
   }else line(0,1.3,w,1.3);
 }
 c.restore();}
 function local(f,p){const a=-f.angle*Math.PI/180,dx=p.x-f.x,dy=p.y-f.y;return {x:dx*Math.cos(a)-dy*Math.sin(a),y:dx*Math.sin(a)+dy*Math.cos(a)};}
 function hit(p){return (G.fixtures||[]).slice().reverse().find(f=>{const q=local(f,p);return Math.abs(q.x)<=f.w/2&&Math.abs(q.y)<=f.d/2;});}
 function point(e){const r=cv.getBoundingClientRect();const p=toCm(e.clientX-r.left,e.clientY-r.top);return {x:step?Math.round(p.x):p.x,y:step?Math.round(p.y):p.y};}
 // Constrain the preview and the committed position around the original centre.
 function constrainMove(p,shift){
   if(!moving||!shift)return {...p};
   const origin=moving.f,dx=p.x-origin.x,dy=p.y-origin.y;
   return Math.abs(dx)>=Math.abs(dy)?{x:p.x,y:origin.y}:{x:origin.x,y:p.y};
 }
 function movePoint(e){const p=point(e);const raw={x:p.x+(moving?.dx||0),y:p.y+(moving?.dy||0)};if(moving)moving.last=raw;return constrainMove(raw,e.shiftKey);}
 function stop(e){e.preventDefault();e.stopImmediatePropagation();}
 function select(f){G.secili=f;G.seciliTip='fixture';G.selSegs=[];updateSidebar();draw();}
 function change(fn){if(G.seciliTip!=='fixture'||!G.secili)return;Studio.edit(()=>fn(G.secili));}
 function transform(mode){if(draft){if(mode==='rotate')draft.angle=(draft.angle+90)%360;else draft.mirror=!draft.mirror;draw();}else change(f=>{if(mode==='rotate')f.angle=(f.angle+90)%360;else f.mirror=!f.mirror;});}
 const baseTool=setTool;window.setTool=function(t){if(t!=='fixture'&&t!=='fixture-move'){draft=ghost=moving=null;}baseTool(t);button.classList.toggle('on',t==='fixture'||t==='fixture-move');};
 function cancel(){draft=ghost=moving=null;}
 const baseDraw=drawElemanlar;window.drawElemanlar=function(){baseDraw();handles=[];(G.fixtures||[]).forEach(f=>{const p=toCv(f.x,f.y),selected=G.seciliTip==='fixture'&&G.secili?.id===f.id;symbol(ctx,f,p.x,p.y,sc(),selected&&!TH.export?'#ffd469':TH.wall);if(selected&&!TH.export){const radius=Math.hypot(f.w,f.d)*sc()/2;['↻','↔'].forEach((label,i)=>{const x=p.x+radius+16,y=p.y-18+i*36;handles.push({x,y,mode:i?'mirror':'rotate'});ctx.save();ctx.fillStyle=TH.opening;ctx.strokeStyle='#ffd469';ctx.beginPath();ctx.arc(x,y,13,0,Math.PI*2);ctx.fill();ctx.stroke();ctx.fillStyle='#ffd469';ctx.font='18px sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(label,x,y);ctx.restore();});}});if(!TH.export&&ghost&&(draft||moving)){const f={...(draft||moving.f),...ghost};const p=toCv(f.x,f.y);ctx.save();ctx.globalAlpha=.65;symbol(ctx,f,p.x,p.y,sc(),'#8ee4c6');ctx.restore();}};
 const baseSidebar=updateSidebar;window.updateSidebar=function(){baseSidebar();if(G.seciliTip==='fixture'&&G.secili){const f=G.secili;$('sbSel').style.display='block';$('sbSelIc').innerHTML='<div class="sb-t">'+names[f.kind]+'</div><p>'+(standard[f.kind]?'Standart ürün':fmtCm(f.w)+' × '+fmtCm(f.d)+' cm')+' · '+f.angle+'°</p><button class="sib" onclick="Fixtures.rotate()">↻ 90° döndür</button><button class="sib" onclick="Fixtures.mirror()">↔ Aynala</button><button class="sib" onclick="Fixtures.move()">Taşı</button><button class="sib" onclick="Fixtures.remove()">Sil</button><p>Taşımak için sürükleyin. Shift: yatay/dikey kilit · R: döndür · M: aynala.</p>'+(standard[f.kind]?'':'<label>En (cm)<input id="fixtureEditW" type="number" min="1" max="500" step="0.1" value="'+f.w+'"></label><label>Derinlik (cm)<input id="fixtureEditD" type="number" min="1" max="500" step="0.1" value="'+f.d+'"></label><button class="sib" onclick="Fixtures.resize()">Ölçüleri uygula</button>')+'<label>Taşıma yakalaması<select onchange="Fixtures.snap(this.value)"><option value="1" '+(step===1?'selected':'')+'>1 cm</option><option value="0" '+(step===0?'selected':'')+'>Serbest</option></select></label>';}};
 window.addEventListener('mousedown',e=>{if(e.target!==cv||e.button!==0)return;const r=cv.getBoundingClientRect(),px=e.clientX-r.left,py=e.clientY-r.top;const handle=handles.find(h=>Math.hypot(h.x-px,h.y-py)<15);if(handle&&G.tool==='sec'){stop(e);transform(handle.mode);return;}if(G.tool==='fixture'&&draft){stop(e);const f={...draft,...point(e),id:'fixture-'+crypto.randomUUID()};if(Studio.edit(()=>G.fixtures.push(f))){draft=ghost=null;setTool('sec');select(f);}return;}if(G.tool==='fixture-move'&&moving){stop(e);const m=moving,p=movePoint(e);moving=ghost=null;Studio.edit(()=>Object.assign(m.f,p));setTool('sec');select(m.f);return;}if(G.tool==='sec'){const f=hit(point(e));if(f){stop(e);select(f);const p=point(e);moving={f,dx:f.x-p.x,dy:f.y-p.y};}}},true);
 window.addEventListener('mousemove',e=>{if(e.target!==cv&& !moving)return;if((G.tool==='fixture'&&draft)||moving){stop(e);ghost=movePoint(e);G.snapPt=null;draw();}},true);
 window.addEventListener('mouseup',e=>{if(!moving||G.tool==='fixture-move')return;stop(e);const m=moving,p=ghost?movePoint(e):null;moving=ghost=null;if(p)Studio.edit(()=>Object.assign(m.f,p));draw();},true);
 window.addEventListener('keydown',e=>{if(/INPUT|TEXTAREA|SELECT/.test(e.target.tagName)||dialog.open)return;if(G.seciliTip!=='fixture'&&!draft&&!moving)return;if(e.key==='Shift'&&moving?.last){ghost=constrainMove(moving.last,true);draw();}else if(e.key==='Escape'){stop(e);draft=ghost=moving=null;setTool('sec');}else if(e.key.toLowerCase()==='r'||e.key.toLowerCase()==='m'){stop(e);transform(e.key.toLowerCase()==='r'?'rotate':'mirror');}else if(e.key==='Delete'){stop(e);remove();}},true);
 window.addEventListener('keyup',e=>{if(e.key==='Shift'&&moving?.last){ghost=constrainMove(moving.last,false);draw();}},true);
 function remove(){change(f=>{G.fixtures=G.fixtures.filter(x=>x.id!==f.id);});}
 window.Fixtures={open,cancel,snap:value=>{step=+value===1?1:0;},resize:()=>{if(standard[G.secili?.kind])return;const w=+$('fixtureEditW').value,d=+$('fixtureEditD').value;if(w<1||w>500||d<1||d>500||!Number.isFinite(w+d)){Studio.toast('En ve derinlik 1–500 cm arasında olmalı.',true);return;}change(f=>Object.assign(f,{w,d}));},rotate:()=>transform('rotate'),mirror:()=>transform('mirror'),remove,move:()=>{if(G.seciliTip==='fixture'){moving={f:G.secili,dx:0,dy:0};setTool('fixture-move');}},hit};
})();
