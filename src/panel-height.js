(function(){
const row=document.getElementById('katYuk').closest('.sr'),wrap=document.createElement('div');
wrap.id='panelHeightChoices';wrap.innerHTML='<div style="display:flex;gap:6px;margin:8px 0">'+[250,280,300].map(h=>'<button type="button" class="sib" data-height="'+h+'">'+h+' cm</button>').join('')+'</div><label>Özel yükseklik (cm) <input id="customPanelHeight" type="number" min="50" max="2000" step="0.1" style="width:90px"></label>';
row.after(wrap);
wrap.querySelectorAll('button').forEach(b=>b.onclick=()=>Studio.projectField('katYuk',b.dataset.height));
wrap.querySelector('input').onchange=e=>Studio.projectField('katYuk',e.target.value);
function sync(){wrap.hidden=!isPref();const h=Number(G.opt.h);wrap.querySelector('input').value=[250,280,300].includes(h)?'':h;wrap.querySelectorAll('button').forEach(b=>{const on=Number(b.dataset.height)===h;b.setAttribute('aria-pressed',String(on));b.style.borderColor=on?'#80d4ba':'';});}
const oldDraw=window.draw;window.draw=function(...args){const result=oldDraw.apply(this,args);sync();return result;};
const old=window.optPanelGuncelle;window.optPanelGuncelle=function(){old();sync();};const oldSync=window.syncUI;if(oldSync)window.syncUI=function(){oldSync();sync();};sync();
})();
