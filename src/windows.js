/* Opening catalogue, reusable dimensions and schematic elevations. */
(function(){
 'use strict';
 const $=id=>document.getElementById(id),types={'surme':'Sürgülü','cift-kanat':'Çift kanatlı','tek-kanat':'Tek kanatlı',sabit:'Sabit',vasistas:'Vasistas'},last={};
 let choices=[],selectedId=null,templateId=null;
 const valid=p=>p&&Number.isFinite(p.en)&&p.en>0&&p.en<=5000&&Number.isFinite(p.yuk)&&p.yuk>0&&p.yuk<=5000;
 for(const tip of ['pencere','kapi'])try{const p=JSON.parse(localStorage.getItem('plan-opening-last-'+tip)||(tip==='pencere'?localStorage.getItem('plan-window-last'):null));if(valid(p))last[tip]=p;}catch{}
 const key=p=>[p.catalogId,p.en,p.yuk,p.penTip,p.kapiTip,p.hand].join('|');
 function elevation(p){
  if(!valid(p))return '<p>Önizleme için geçerli ölçüler girin.</p>';
  const cat=OpeningCatalog.find(c=>c.id===p.catalogId),door=p.tip_==='kapi',style=cat?.style||(door?(p.kapiTip==='surme'?'sliding':p.kapiTip==='cift'?'double':'sheet'):null);
  const title=cat?.ad||(door?'Kapı':types[p.penTip]||'Pencere'),scale=Math.min(250/p.en,160/p.yuk),w=p.en*scale,h=p.yuk*scale,x=(320-w)/2,y=30+(160-h)/2;
  let drawing='';
  const rect=(a,b,c,d)=>{drawing+=`<rect x="${a}" y="${b}" width="${c}" height="${d}"/>`;};
  const line=(a,b,c,d,red=false)=>{drawing+=`<path ${red?'stroke="#f35b60" stroke-dasharray="3 2"':''} d="M${a} ${b}L${c} ${d}"/>`;};
  const swing=(a,b,c,d,reverse=false,tilt=false)=>{if(tilt){line(a,b+d,a+c/2,b,true);line(a+c/2,b,a+c,b+d,true);}else{const edge=reverse?a+c:a,point=reverse?a:a+c;line(edge,b,point,b+d/2,true);line(point,b+d/2,edge,b+d,true);}};
  rect(0,0,100,100);rect(2,2,96,96);
  if(!door){
   const cols=cat?.cols||(p.penTip==='surme'||p.penTip==='cift-kanat'?2:1),bottom=cat?.transom?100*cat.transom:98;
   for(let i=0;i<cols;i++){const a=3+i*94/cols,c=94/cols-2;rect(a,4,c,bottom-6);if(cat?cat.active===i:p.penTip==='tek-kanat'||p.penTip==='cift-kanat'||p.penTip==='vasistas')swing(a,4,c,bottom-6,p.penTip==='cift-kanat'&&i===1,cat?.opening==='tilt'||p.penTip==='vasistas');}
   if(cat?.transom)rect(3,bottom+1,94,97-bottom);
   if(cat?.opening==='fixed')for(let i=0;i<3;i++)line(30,25+i*20,65,35+i*20);
   if(p.penTip==='surme'&&!cat){line(15,50,40,50);line(40,50,34,46);line(85,60,60,60);line(60,60,66,64);}
  }else{
   const doubled=['double','double-glass','sliding'].includes(style),cols=doubled?2:1;
   for(let i=0;i<cols;i++){
    const a=3+i*94/cols,c=94/cols-2,reverse=doubled?i===1:(p.hand||cat?.hand)==='sag';rect(a,3,c,94);
    if(['al','pvc','steel'].includes(style)||cat?.material==='al'){rect(a+2,5,c/2-3,40);rect(a+c/2+1,5,c/2-3,40);rect(a+2,51,c-4,44);if(style!=='steel')for(let j=1;j<9;j++)line(a+2+(c-4)*j/9,52,a+2+(c-4)*j/9,94);}
    if(style==='american')for(let j=1;j<7;j++)line(a,6+j*13,a+c,6+j*13);
    if(style==='panic'){line(a,8,a+c,8);line(a+4,53,a+c-4,53);line(a+4,51,a+4,55);line(a+c-4,51,a+c-4,55);}
    if(style!=='sliding'){swing(a,4,c,92,reverse);if(style!=='panic'){const hx=reverse?a+4:a+c-4;line(hx,49,hx,54);line(hx,50,hx+(reverse?7:-7),50);}}
    else{const start=a+c*.3,end=a+c*.7,yy=52+i*4;line(start,yy,end,yy);line(i?start:end,yy,i?start+5:end-5,yy-3);}
   }
  }
  return `<svg viewBox="0 0 320 225" role="img" aria-label="${p.en} × ${p.yuk} cm ${esc(title)} ${door?'kapı':'pencere'} görünüşü" style="width:100%;max-height:225px"><svg x="${x}" y="${y}" width="${w}" height="${h}" viewBox="-1 -1 102 102" preserveAspectRatio="none"><g fill="none" stroke="${style==='steel'?'#c7a64e':'#c5d4df'}" stroke-width=".8">${drawing}</g></svg><g fill="currentColor" text-anchor="middle" font-size="12"><text x="160" y="20">${p.en} cm</text><text transform="translate(${x+w+16},${y+h/2}) rotate(-90)">${p.yuk} cm</text><text x="160" y="213">${esc(title)} · ${p.en} × ${p.yuk} cm</text></g></svg><p class="panel-help">Katalog görünüşü şematiktir. Plan açıklığı girilen genişliğe göre çizilir.</p>`;
 }
 const box=document.createElement('div');box.id='windowPicker';box.className='mf';box.innerHTML='<label id="openingPickerLabel" for="windowPreset">Pencere seçimi</label><select id="windowPreset"></select><div id="windowPreview"></div>';$('mAd').closest('.mf').before(box);
 const current=()=>({en:+$('mEn').value,yuk:+$('mYuk').value,penTip:$('mPenTip').value,kapiTip:$('mTip').value,hand:$('mMen').value,tip_:_mT,ad:$('mAd').value,catalogId:selectedId});
 function preview(){$('windowPreview').innerHTML=elevation(current());}
 function apply(p){selectedId=p.catalogId||null;templateId=selectedId;$('mEn').value=p.en;$('mYuk').value=p.yuk;$('mAd').value=p.ad||(_mT==='kapi'?'Kapı':'Pencere');if(_mT==='kapi'){$('mTip').value=p.kapiTip||'ic';$('mMen').value=p.hand||'sol';mTipDegis();}else $('mPenTip').value=p.penTip||'tek-kanat';preview();}
 $('windowPreset').onchange=()=>{if($('windowPreset').value===''){selectedId=null;templateId=null;preview();return;}const p=choices[+$('windowPreset').value];if(p)apply(p);};
 ['mEn','mYuk','mPenTip','mTip','mMen'].forEach(id=>$(id).addEventListener('input',()=>{
  const cat=OpeningCatalog.find(c=>c.id===templateId);
  const matches=cat&&(_mT==='pencere'?cat.penTip===$('mPenTip').value:cat.kapiTip===$('mTip').value&&(cat.hand||'sol')===$('mMen').value);
  selectedId=matches?templateId:null;
  const index=choices.findIndex(p=>p.catalogId===selectedId&&p.en===+$('mEn').value&&p.yuk===+$('mYuk').value);
  $('windowPreset').value=selectedId&&index>=0?String(index):'';preview();
 }));
 const open=openModal;
 window.openModal=function(...args){
  open(...args);box.hidden=false;selectedId=null;templateId=null;const tip=args[0];$('openingPickerLabel').textContent=tip==='kapi'?'Kapı seçimi':'Pencere seçimi';const seen=new Set();choices=[];const labels=[];
  [last[tip],...G.elemanlar.filter(e=>e.tip_===tip)].forEach((p,i)=>{if(valid(p)&&!seen.has(key(p))){seen.add(key(p));choices.push({...p});labels.push((i===0&&last[tip]?'Son kullanılan · ':'Projede · ')+p.en+' × '+p.yuk+' cm · '+(tip==='pencere'?types[p.penTip]||'Pencere':p.ad||'Kapı'));}});
  OpeningCatalog.filter(p=>p.tip_===tip).forEach(p=>{choices.push({...p,catalogId:p.id});labels.push(p.ad+' · '+p.en+' × '+p.yuk+' cm');});
  $('windowPreset').replaceChildren(new Option('Özel ölçü gir',''),...choices.map((p,i)=>new Option(labels[i],String(i))));
  if(last[tip]){$('windowPreset').value='0';apply(last[tip]);}else preview();
 };
 const ok=modalOk;
 window.modalOk=function(){const tip=_mT,count=G.elemanlar.length,p=current();ok();if(G.elemanlar.length===count+1&&valid(p)){const e=G.elemanlar.at(-1);e.catalogId=p.catalogId||null;e.hand=p.hand;last[tip]=p;try{localStorage.setItem('plan-opening-last-'+tip,JSON.stringify(p));}catch{}updateSidebar();draw();}};
 const sidebar=updateSidebar;
 window.updateSidebar=function(){sidebar();if(G.seciliTip==='eleman'&&G.secili){$('sbSelIc').insertAdjacentHTML('beforeend','<div class="sb-t">'+(G.secili.tip_==='kapi'?'Kapı':'Pencere')+' görünüşü</div>'+elevation(G.secili));if(isPref()&&G.secili.tip_==='pencere'&&Math.abs(G.secili.en-160)<.01)$('sbSelIc').insertAdjacentHTML('beforeend','<button class="sib" onclick="Prefab.fitWideWindow()">166 cm panoya uyarla</button><p class="panel-help">160 cm açıklık + iki yanda 3 cm pano payı. Pencere konumu ve makaslar korunur.</p>');}};
 window.OpeningViews={elevation};
 const planWindow=drawPencere;
 window.drawPencere=function(e,ex,ey,angle,k,sel){
  planWindow(e,ex,ey,angle,k,sel);
  const cat=OpeningCatalog.find(c=>c.id===e.catalogId);if(!cat||cat.cols<2)return;
  const p=toCv(ex,ey),s=sc();ctx.save();ctx.translate(p.x,p.y);ctx.rotate(angle);ctx.strokeStyle=sel?'#FFD700':TH.win;ctx.lineWidth=1;
  for(let i=1;i<cat.cols;i++){const x=e.en*s*i/cat.cols;ctx.beginPath();ctx.moveTo(x,-k*s/2);ctx.lineTo(x,k*s/2);ctx.stroke();}ctx.restore();
 };
})();
