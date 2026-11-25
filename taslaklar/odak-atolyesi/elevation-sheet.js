/* Five model views, without mutating project geometry or saved viewpoints. */
(function(){
 'use strict';
 const $=id=>document.getElementById(id);
 const designs={technical:{name:'Teknik çizim',ink:'#111111',rule:'#111111',paper:'#ffffff',filter:'none'},warmsketch:{name:'Sıcak eskiz · koleksiyon',ink:'#594431',rule:'#bba98d',paper:'#faf6ee',filter:'sepia(.45) saturate(.55)'},architectural:{name:'Mimari sunum · sıcak tonlar',ink:'#344b45',rule:'#a9b8ac',paper:'#f7f8f4',filter:'saturate(.7) sepia(.1)'},graywood:{name:'Gri ve ahşap · kontrastlı',ink:'#313a41',rule:'#a28b72',paper:'#f3f4f4',filter:'saturate(.35) contrast(1.15)'},monochrome:{name:'Siyah beyaz · sade',ink:'#242424',rule:'#aaaaaa',paper:'#ffffff',filter:'grayscale(1)'}};
 Camera3D.state.projection='perspective';$('roofProjection').value='perspective';
 const button=document.createElement('button');button.id='roofElevationSheet';button.type='button';button.textContent='Görünüş çıkart · 5 görünüş';
 $('roofPNG').after(button);
 const style=document.createElement('style');style.textContent=`
 #elevationDialog{width:min(1100px,94vw);max-height:92vh;padding:24px;border:1px solid #536775;border-radius:12px;background:#1c2b34;color:#e6edf0}
 #elevationDialog::backdrop{background:#0009}#elevationDialog header,#elevationDialog footer{display:flex;gap:12px;align-items:center;justify-content:space-between;flex-wrap:wrap}
 #elevationDialog h2{margin:0}#elevationDialog button,#elevationDialog select{min-height:44px;padding:8px 16px;border:1px solid #718993;border-radius:6px;background:#263b47;color:#fff}
 #elevationDialog label{display:flex;align-items:center;gap:12px;flex-wrap:wrap;margin:16px 0}#elevationPreview{display:block;width:100%;height:auto;background:white;margin:16px 0}
 #elevationStatus{min-height:24px}#elevationDialog button:focus-visible,#elevationDialog select:focus-visible{outline:3px solid #a9daca;outline-offset:2px}
 `;document.head.append(style);
 const dialog=document.createElement('dialog');dialog.id='elevationDialog';dialog.setAttribute('aria-labelledby','elevationTitle');
 dialog.innerHTML=`<header><h2 id="elevationTitle">Görünüş paftası</h2><button id="elevationClose" type="button" aria-label="Paftayı kapat">Kapat</button></header>
 <p>Görünüş adları çizimlerin altında; proje bilgileri alt antette. A3 yatay · ölçeksiz görünüş paftası.</p>
 <label>Pafta tasarımı<select id="elevationDesign">${Object.entries(designs).map(([id,d])=>'<option value="'+id+'" '+(id==='architectural'?'selected':'')+'>'+d.name+'</option>').join('')}</select></label>
 <label>Ön cephe yönü<select id="elevationFront"><option value="0">Ön · 0°</option><option value="90">Sol · 90°</option><option value="180">Arka · 180°</option><option value="270">Sağ · 270°</option></select></label>
 <p id="elevationStatus" role="status"></p><canvas id="elevationPreview" aria-label="Üstte çapraz perspektif, altta ön, arka, sol ve sağ cephe paftası"></canvas>
 <footer><button id="elevationPNG" type="button">PNG indir</button><button id="elevationPrint" type="button">Yazdır / PDF kaydet</button></footer>`;document.body.append(dialog);
 let busy=false,ready=false;
 function render(out,front=0,design='architectural'){
  const theme=designs[design]||designs.architectural,technical=design==='technical';
  const before=RoofStudio.getCamera(),scene={...Scene3D.state},view=$('roofViewpoint').value;
  out.width=2400;out.height=1697;const ctx=out.getContext('2d');ctx.fillStyle=theme.paper;ctx.fillRect(0,0,out.width,out.height);
  ctx.strokeStyle=theme.rule;ctx.lineWidth=technical?3:2;ctx.strokeRect(30,30,2340,1637);
  if(design==='graywood'){ctx.fillStyle=theme.ink;ctx.fillRect(30,30,2340,105);ctx.fillStyle='#ffffff';}else ctx.fillStyle=theme.ink;
  ctx.font='bold 32px sans-serif';ctx.fillText('GÖRÜNÜŞ PAFTASI',65,83);
  ctx.font='22px sans-serif';const title=Studio.state().projectName||'Prefabrik konut';ctx.fillText(title,65,120,2150);
  const cells=[[technical?'AKSONOMETRİK GÖRÜNÜŞ':'PERSPEKTİF GÖRÜNÜŞ',front+(technical?45:35),technical?35.264:25,technical?'parallel':'perspective',480,145,1440,480],['ÖN GÖRÜNÜŞ',front,0,'parallel',65,720,1110,330],['ARKA GÖRÜNÜŞ',front+180,0,'parallel',1225,720,1110,330],['SOL YAN GÖRÜNÜŞ',front+90,0,'parallel',65,1140,1110,330],['SAĞ YAN GÖRÜNÜŞ',front+270,0,'parallel',1225,1140,1110,330]];
  const results=[];
  try{
   for(const [label,yaw,pitch,projection,x,y,w,h] of cells){
    RoofStudio.setCamera({...before,yaw:yaw%360,pitch,projection,zoom:1,panX:0,panY:0});
    const tile=document.createElement('canvas');tile.width=w;tile.height=h;
    if(technical)Scene3D.state.outlines=true;
    const result=RoofStudio.renderImage(tile,{frame:'fit',background:'white',grid:false,technical});
    ctx.save();ctx.filter=theme.filter;ctx.drawImage(tile,x,y);ctx.restore();
    const captionY=y+h+34;ctx.fillStyle=theme.ink;ctx.font='bold 21px sans-serif';ctx.textAlign='center';ctx.fillText(label,x+w/2,captionY);ctx.textAlign='left';
    if(design==='warmsketch'||design==='architectural'){ctx.strokeStyle=theme.rule;ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(x+w/2-65,captionY+13);ctx.lineTo(x+w/2+65,captionY+13);ctx.stroke();}
    results.push({label,yaw:yaw%360,pitch,projection,caption:{x:x+w/2,y:captionY},cell:{x,y,w,h},...result});
   }
   ctx.strokeStyle=theme.rule;ctx.lineWidth=technical?2:1;ctx.strokeRect(65,1555,2270,90);
   const fields=[['PAFTA ADI','Yapı görünüşleri',65,680],['PAFTA NO','G-01',745,300],['ÖLÇEK','Ölçeksiz',1045,330],['İZDÜŞÜM','Cepheler: paralel',1375,620],['SAYFA / BOYUT','1 / 1 · A3',1995,340]];
   for(const [key,value,x,w]of fields){if(x>65){ctx.beginPath();ctx.moveTo(x,1555);ctx.lineTo(x,1645);ctx.stroke();}ctx.fillStyle=theme.ink;ctx.font='17px sans-serif';ctx.fillText(key,x+18,1582,w-36);ctx.font='bold 22px sans-serif';ctx.fillText(value,x+18,1620,w-36);}
   return results;
  }finally{Object.assign(Scene3D.state,scene);RoofStudio.setCamera(before);$('roofViewpoint').value=view;}
 }
 async function preview(){
  if(busy)return;busy=true;ready=false;$('elevationPNG').disabled=$('elevationPrint').disabled=true;$('elevationFront').disabled=$('elevationDesign').disabled=true;
  $('elevationStatus').textContent='Beş görünüş hazırlanıyor…';
  await new Promise(requestAnimationFrame);
  try{render($('elevationPreview'),Number($('elevationFront').value),$('elevationDesign').value);ready=true;$('elevationStatus').textContent='Pafta hazır. Görünüşler ölçeksizdir. Teknik çizim seçeneği görünür kenarları siyah çizgiyle verir.';}
  catch(e){$('elevationStatus').textContent='Pafta oluşturulamadı: '+e.message;}
  finally{busy=false;$('elevationFront').disabled=$('elevationDesign').disabled=false;$('elevationPNG').disabled=$('elevationPrint').disabled=!ready;}
 }
 button.onclick=()=>{SingleStorey.show('model');dialog.showModal();preview();};
 $('elevationFront').onchange=$('elevationDesign').onchange=preview;$('elevationClose').onclick=()=>dialog.close();dialog.addEventListener('close',()=>button.focus());
 dialog.addEventListener('keydown',e=>{if(e.key==='Escape')e.stopPropagation();});
 $('elevationPNG').onclick=()=>{if(!ready)return;const a=document.createElement('a');a.download='gorunus-paftasi.png';a.href=$('elevationPreview').toDataURL('image/png');a.click();};
 $('elevationPrint').onclick=()=>{
  if(!ready)return;const win=window.open('','_blank');if(!win){$('elevationStatus').textContent='Yazdırma penceresi engellendi. Bu sayfa için açılır pencereye izin verin veya PNG indirin.';return;}
  win.document.write('<!doctype html><html lang="tr"><head><title>Görünüş paftası</title><style>@page{size:A3 landscape;margin:0}body{margin:0}img{display:block;width:100%;height:auto}@media print{img{width:420mm;height:297mm;object-fit:contain}}</style></head><body></body></html>');win.document.close();
  const img=win.document.createElement('img');img.alt='Beş görünüş paftası';img.onload=()=>{win.focus();win.print();};img.src=$('elevationPreview').toDataURL('image/png');win.document.body.append(img);
 };
 window.ElevationSheet={render};
})();
