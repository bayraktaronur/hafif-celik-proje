/* Drawing aids for the independent draft. No model changes until the second pick. */
(function(){
 let joining=false,first=null;
 const panel=document.createElement('div');panel.id='lineAssist';panel.style.cssText='position:absolute;right:14px;top:76px;z-index:8;padding:10px;background:#1d2e38;border:1px solid #506770;border-radius:9px;display:none;color:#d9e8e6;font:12px sans-serif';
 panel.innerHTML='<div style="margin-bottom:8px">Çizgi yardımcıları</div><div style="display:flex;gap:5px"><button data-mode="ortho">Dik 90° · F8</button><button data-mode="snap">Yakalama</button><button data-mode="extension">Uzantı</button></div><button id="joinLinePoints" style="margin-top:8px;width:100%">Noktaları birleştir</button><div id="joinLineHint" style="max-width:275px;line-height:1.5;margin-top:6px">Shift: dik kilidi geçici değiştir · Alt: serbest yakala</div>';
 document.getElementById('cwrap').append(panel);
 for(const b of panel.querySelectorAll('button')){b.type='button';b.style.cssText+=';padding:7px;border:1px solid #516d76;border-radius:5px;color:#e5efec;background:#263943;cursor:pointer';}
 function refresh(){for(const b of panel.querySelectorAll('[data-mode]')){const on=PreciseLines.mode[b.dataset.mode];b.setAttribute('aria-pressed',on);b.style.background=on?'#315e50':'#263943';}const g=document.querySelector('#shapeGuide>span');if(g)g.textContent=PreciseLines.mode.ortho?'Dik 90° açık · Shift: geçici serbest':'Serbest çizim · Shift: geçici dik';}
 function cancel(){joining=false;first=null;document.getElementById('joinLinePoints').textContent='Noktaları birleştir';document.getElementById('joinLineHint').textContent='Shift: dik kilidi geçici değiştir · Alt: yakalama kapalı';draw();}
 for(const b of panel.querySelectorAll('[data-mode]'))b.onclick=()=>{PreciseLines.mode[b.dataset.mode]=!PreciseLines.mode[b.dataset.mode];refresh();draw();};
 function begin(){setTool('sec');joining=true;first=null;document.getElementById('joinLinePoints').textContent='Birleştirmeyi iptal et';document.getElementById('joinLineHint').textContent='İlk çizginin ucunu seçin, sonra birleştirilecek diğer ucu seçin. Esc: iptal.';panel.style.display='block';}
 document.getElementById('joinLinePoints').onclick=()=>joining?cancel():begin();
 function pick(p){let hit=null,best=12/sc();for(const a of G.annotations||[]){if(a.shape!=='line'||a.dimKind)continue;PreciseLines.ends(a).forEach((q,i)=>{const d=Math.hypot(p.x-q.x,p.y-q.y);if(d<best){best=d;hit={id:a.id,i};}});}if(!hit)return Studio.toast('Bir çizginin A veya B ucunu seçin.',true);if(!first){first=hit;document.getElementById('joinLineHint').textContent='İlk uç seçildi. Şimdi diğer çizginin ucunu seçin.';return;}if(hit.id===first.id)return Studio.toast('Başka bir çizginin ucunu seçin.',true);
 const a=G.annotations.find(a=>a.id===first.id),b=G.annotations.find(a=>a.id===hit.id);if(!a||!b)return cancel();const ap=PreciseLines.ends(a),bp=PreciseLines.ends(b);let q=bp[hit.i],both=false;
 if(PreciseLines.mode.ortho){const ah=Math.abs(ap[1].x-ap[0].x)>=Math.abs(ap[1].y-ap[0].y),bh=Math.abs(bp[1].x-bp[0].x)>=Math.abs(bp[1].y-bp[0].y),af=ap[1-first.i],bf=bp[1-hit.i];if(ah!==bh){q=ah?{x:bf.x,y:af.y}:{x:af.x,y:bf.y};both=true;}else if(Math.abs(ah?q.y-af.y:q.x-af.x)>.001)return Studio.toast('Bu uçlar aynı doğrultuda değil. Serbest birleştirmek için Dik 90° kapatın.',true);}
 ap[first.i]=q;if(both)bp[hit.i]=q;const aa=PreciseLines.from(a,...ap),bb=PreciseLines.from(b,...bp);if([aa,bb].some(v=>v.w<.01||v.w>100000))return Studio.toast('Bu birleşim geçerli bir çizgi uzunluğu oluşturmuyor.',true);
 Studio.edit(()=>{Object.assign(a,aa);if(both)Object.assign(b,bb);});cancel();Studio.toast(both?'İki uç ortak 90° köşede birleşti.':'Uçlar birleştirildi.');}
 window.addEventListener('keydown',e=>{if(e.key==='F8'){e.preventDefault();PreciseLines.mode.ortho=!PreciseLines.mode.ortho;refresh();draw();}if(e.key==='Escape'&&joining){e.preventDefault();cancel();}},true);
 window.addEventListener('blur',()=>{if(joining)cancel();});
 for(const id of ['shapeLock','shapeLockAngle']){const el=document.getElementById(id);if(el)el.closest('label').hidden=true;}
 window.LineAssist={active:()=>joining,pick,begin,cancel,sync(a){panel.style.display=joining||a?.shape==='line'||(G.tool==='text'&&!document.getElementById('shapeGuide').hidden)?'block':'none';refresh();}};
 refresh();
})();
