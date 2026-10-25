/* Draft-only selection menu. Retains the existing wall/panel selection engine. */
(()=>{
 const $=id=>document.getElementById(id),button=$('t-sec'),original=button.onclick;
 const hidden=document.createElement('div');hidden.hidden=true;hidden.append($('selectionMode'));document.body.append(hidden);
 const menu=document.createElement('div');menu.id='singleSelectionMenu';menu.setAttribute('popover','auto');menu.setAttribute('role','menu');
 menu.innerHTML='<small>SEÇİM TÜRÜ</small><button type="button" role="menuitemradio" data-select="panel"><span>▥</span><b>Panel seç</b><i>Bir paneli düzenle</i></button><button type="button" role="menuitemradio" data-select="wall"><span>▬</span><b>Duvar seç</b><i>Duvarı seç ve taşı</i></button>';
 document.body.append(menu);button.setAttribute('aria-haspopup','menu');button.setAttribute('aria-controls',menu.id);button.innerHTML='<span>↖</span> Seç <span class="single-select-arrow">⌄</span>';
 function sync(){const mode=isPref()?G.selectionMode:'wall';menu.querySelectorAll('[data-select]').forEach(b=>{b.disabled=b.dataset.select==='panel'&&!isPref();b.setAttribute('aria-checked',String(b.dataset.select===mode));});button.title=(mode==='panel'?'Panel seç':'Duvar seç')+' · seçim türünü aç';}
 button.onclick=e=>{original?.call(button,e);sync();if(menu.matches(':popover-open')){menu.hidePopover();return;}const r=button.getBoundingClientRect();menu.style.left=Math.max(8,Math.min(r.left,innerWidth-224))+'px';menu.style.top=(r.bottom+6)+'px';menu.showPopover();menu.querySelector('[aria-checked=true]')?.focus();};
 menu.onclick=e=>{const b=e.target.closest('[data-select]');if(!b)return;if($('panelQuickToggle')?.classList.contains('active'))$('panelQuickToggle').click();Prefab.mode(b.dataset.select);menu.hidePopover();sync();cv.focus();};
 menu.addEventListener('toggle',()=>button.setAttribute('aria-expanded',String(menu.matches(':popover-open'))));
 menu.onkeydown=e=>{if(!['ArrowDown','ArrowUp','Home','End'].includes(e.key))return;e.preventDefault();const a=[...menu.querySelectorAll('button:not(:disabled)')],i=a.indexOf(document.activeElement);a[e.key==='Home'?0:e.key==='End'?a.length-1:(i+(e.key==='ArrowDown'?1:a.length-1))%a.length]?.focus();};
 const drawBase=window.draw;window.draw=function(...args){const r=drawBase.apply(this,args);sync();return r;};sync();
})();
