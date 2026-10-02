/* Plan annotations are independent objects, never manufacturing quantities. */
(function(){
 'use strict';
 const $=id=>document.getElementById(id);let draft=null,ghost=null,moving=null,editId=null;
 G.annotations=G.annotations||[];
 const button=document.createElement('button');button.id='t-text';button.className='t';button.textContent='T Metin';button.title='Metin ekle · T';button.onclick=()=>open();document.querySelector('.tool-group').append(button);
 const dialog=document.createElement('dialog');dialog.id='textDialog';dialog.style.cssText='background:#192334;color:#d6e6ef;border:1px solid #40566b;border-radius:12px;padding:24px;width:360px;max-height:90vh;overflow:auto';
 dialog.innerHTML='<form><h3>Plan metni</h3><label>Metin<textarea id="noteText" maxlength="1000" rows="4" required placeholder="Örn. Profilden / Montaj notu"></textarea></label><label>Yazı boyutu · cm<input id="noteSize" type="number" min="2" max="100" value="12" required></label><label>Açı · derece<input id="noteAngle" type="number" min="0" max="359" value="0" required></label><p>Plana tıklayarak yerleştirin. Çift tık: düzenle · Sürükle: taşı · Delete: sil.</p><button class="sib" type="submit" id="noteSubmit">Yerleştir</button><button class="sib" type="button" id="noteCancel">İptal</button></form>';
 document.body.append(dialog);dialog.querySelectorAll('input,textarea').forEach(el=>el.style.cssText='display:block;box-sizing:border-box;width:100%;margin:6px 0 12px;padding:9px;background:#101b29;color:#d6e6ef;border:1px solid #40566b;border-radius:5px');
 const stop=e=>{e.preventDefault();e.stopImmediatePropagation();};
 function cancel(){draft=ghost=moving=null;editId=null;if(dialog.open)dialog.close();}
 function open(a){cancel();setTool('sec');editId=a?.id||null;$('noteText').value=a?.text||'';$('noteSize').value=a?.size||12;$('noteAngle').value=a?.angle||0;$('noteSubmit').textContent=a?'Uygula':'Yerleştir';dialog.showModal();$('noteText').focus();}
 $('noteCancel').onclick=()=>dialog.close();
 dialog.querySelector('form').onsubmit=e=>{e.preventDefault();const values={text:$('noteText').value.trim(),size:+$('noteSize').value,angle:+$('noteAngle').value};if(!values.text)return;if(editId){const id=editId;Studio.edit(()=>Object.assign(G.annotations.find(a=>a.id===id),values));dialog.close();return;}dialog.close();setTool('text');draft=values;Studio.toast('Metni yerleştirmek için plana tıklayın. Esc: iptal.');cv.focus();};
 function point(e){const r=cv.getBoundingClientRect();return toCm(e.clientX-r.left,e.clientY-r.top);}
 function dimensions(a){ctx.save();ctx.font=a.size+'px sans-serif';const width=Math.max(...a.text.split('\n').map(t=>ctx.measureText(t).width));ctx.restore();return {w:width,h:a.text.split('\n').length*a.size*1.25};}
 function corners(a){const {w,h}=dimensions(a),t=a.angle*Math.PI/180;return [[0,0],[w,0],[w,h],[0,h]].map(([x,y])=>({x:a.x+x*Math.cos(t)-y*Math.sin(t),y:a.y+x*Math.sin(t)+y*Math.cos(t)}));}
 function hit(p){return [...G.annotations].reverse().find(a=>{const t=-a.angle*Math.PI/180,dx=p.x-a.x,dy=p.y-a.y,x=dx*Math.cos(t)-dy*Math.sin(t),y=dx*Math.sin(t)+dy*Math.cos(t),b=dimensions(a),pad=4/sc();return x>=-pad&&y>=-pad&&x<=b.w+pad&&y<=b.h+pad;});}
 function select(a){G.secili=a;G.seciliTip='annotation';G.selSegs=[];G.selPanels=[];updateSidebar();draw();}
 function remove(){if(G.seciliTip!=='annotation')return;const id=G.secili.id;Studio.edit(()=>{G.annotations=G.annotations.filter(a=>a.id!==id);G.secili=null;G.seciliTip=null;});}
 const baseDelete=seciliSil;window.seciliSil=function(){if(G.seciliTip==='annotation')remove();else baseDelete();};
 const baseSidebar=updateSidebar;window.updateSidebar=function(){baseSidebar();if(G.seciliTip!=='annotation'||!G.secili)return;const box=$('sbSelIc');box.replaceChildren();const label=document.createElement('p');label.textContent=G.secili.text;box.append(label);for(const [name,action] of [['Metni düzenle',()=>open(G.secili)],['Sil',remove]]){const b=document.createElement('button');b.className='sib';b.textContent=name;b.onclick=action;box.append(b);}};
 const baseTool=setTool;window.setTool=function(t){if(t!=='text')draft=ghost=moving=null;baseTool(t);button.classList.toggle('on',t==='text');};
 function paint(a,selected){const p=toCv(a.x,a.y),b=dimensions(a);ctx.save();ctx.translate(p.x,p.y);ctx.rotate(a.angle*Math.PI/180);ctx.font=(a.size*sc())+'px sans-serif';ctx.textAlign='left';ctx.textBaseline='top';ctx.fillStyle=selected?'#ffd469':TH.wall;a.text.split('\n').forEach((line,i)=>ctx.fillText(line,0,i*a.size*1.25*sc()));if(selected){ctx.strokeStyle='#ffd469';ctx.setLineDash([4,3]);ctx.strokeRect(-3,-3,b.w*sc()+6,b.h*sc()+6);}ctx.restore();}
 const baseDraw=drawElemanlar;window.drawElemanlar=function(){baseDraw();G.annotations.forEach(a=>paint(a,!TH.export&&G.seciliTip==='annotation'&&G.secili?.id===a.id));if(!TH.export&&ghost){ctx.save();ctx.globalAlpha=.6;paint(ghost,true);ctx.restore();}};
 window.addEventListener('mousedown',e=>{if(e.target!==cv||e.button!==0)return;const p=point(e);if(G.tool==='text'&&draft){stop(e);const a={...draft,id:'note-'+crypto.randomUUID(),x:Math.round(p.x),y:Math.round(p.y)};if(Studio.edit(()=>G.annotations.push(a))){setTool('sec');select(a);}return;}if(G.tool==='sec'){const a=hit(p);if(a){stop(e);select(a);moving={id:a.id,start:p,x:a.x,y:a.y};cv.focus();}}},true);
 window.addEventListener('mousemove',e=>{if(draft&&e.target===cv){ghost={...draft,...point(e)};draw();}if(moving){const a=G.annotations.find(a=>a.id===moving.id);if(!a){moving=null;return;}const p=point(e);ghost={...a,x:Math.round(moving.x+p.x-moving.start.x),y:Math.round(moving.y+p.y-moving.start.y)};draw();}},true);
 window.addEventListener('mouseup',e=>{if(!moving||e.button!==0)return;stop(e);const m=moving,p=ghost;moving=ghost=null;if(p&&(p.x!==m.x||p.y!==m.y))Studio.edit(()=>{const a=G.annotations.find(a=>a.id===m.id);a.x=p.x;a.y=p.y;});draw();},true);
 window.addEventListener('dblclick',e=>{if(e.target!==cv||G.tool!=='sec')return;const a=hit(point(e));if(a){stop(e);open(a);}},true);
 window.addEventListener('keydown',e=>{if(/INPUT|TEXTAREA|SELECT/.test(e.target.tagName)||document.querySelector('dialog[open]'))return;if(e.key==='Escape'&&(draft||moving)){stop(e);cancel();setTool('sec');}else if(e.key==='Delete'&&G.seciliTip==='annotation'){stop(e);remove();}else if(e.key.toLowerCase()==='t'&&!e.ctrlKey&&!e.altKey&&!e.metaKey){stop(e);open();}},true);
 window.addEventListener('blur',()=>{moving=ghost=null;draw();});
 window.TextNotes={open,cancel,bounds:()=>G.annotations.flatMap(corners)};
})();
