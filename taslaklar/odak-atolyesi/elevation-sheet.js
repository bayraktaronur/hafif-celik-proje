/* Five model views, without mutating project geometry or saved viewpoints. */
(function(){
 'use strict';
 const $=id=>document.getElementById(id);
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
 <p>Üstte çapraz perspektif; altta paralel kamerayla dört cephe. A3 yatay · ölçeksiz sunum.</p>
 <label>Ön cephe yönü<select id="elevationFront"><option value="0">Ön · 0°</option><option value="90">Sol · 90°</option><option value="180">Arka · 180°</option><option value="270">Sağ · 270°</option></select></label>
 <p id="elevationStatus" role="status"></p><canvas id="elevationPreview" aria-label="Üstte çapraz perspektif, altta ön, arka, sol ve sağ cephe paftası"></canvas>
 <footer><button id="elevationPNG" type="button">PNG indir</button><button id="elevationPrint" type="button">Yazdır / PDF kaydet</button></footer>`;document.body.append(dialog);
 let busy=false,ready=false;
 function render(out,front=0){
  const before=RoofStudio.getCamera(),scene={...Scene3D.state},view=$('roofViewpoint').value;
  out.width=2400;out.height=1697;const ctx=out.getContext('2d');ctx.fillStyle='#fff';ctx.fillRect(0,0,out.width,out.height);
  ctx.strokeStyle='#c2cbd0';ctx.lineWidth=2;ctx.strokeRect(30,30,2340,1637);
  ctx.fillStyle='#223842';ctx.font='bold 32px sans-serif';ctx.fillText('GÖRÜNÜŞ PAFTASI',65,83);
  ctx.font='22px sans-serif';const title=Studio.state().projectName||'Prefabrik konut';ctx.fillText(title,65,120,2150);
  const cells=[['ÇAPRAZ PERSPEKTİF',front+35,25,'perspective',480,150,1440,530],['ÖN CEPHE',front,0,'parallel',65,725,1110,400],['ARKA CEPHE',front+180,0,'parallel',1225,725,1110,400],['SOL CEPHE',front+90,0,'parallel',65,1180,1110,400],['SAĞ CEPHE',front+270,0,'parallel',1225,1180,1110,400]];
  const results=[];
  try{
   for(const [label,yaw,pitch,projection,x,y,w,h] of cells){
    RoofStudio.setCamera({...before,yaw:yaw%360,pitch,projection,zoom:1,panX:0,panY:0});
    const tile=document.createElement('canvas');tile.width=w;tile.height=h;
    const result=RoofStudio.renderImage(tile,{frame:'fit',background:'white',grid:false});
    ctx.drawImage(tile,x,y);ctx.fillStyle='#223842';ctx.font='bold 21px sans-serif';ctx.fillText(label,x,y-12);
    results.push({label,yaw:yaw%360,pitch,projection,...result});
   }
   ctx.strokeStyle='#c2cbd0';ctx.beginPath();ctx.moveTo(65,1610);ctx.lineTo(2335,1610);ctx.stroke();
   ctx.font='20px sans-serif';ctx.fillText('PLAN STUDIO  |  A3 yatay  |  Ölçeksiz  |  Cepheler paralel izdüşüm',65,1645);
   return results;
  }finally{Object.assign(Scene3D.state,scene);RoofStudio.setCamera(before);$('roofViewpoint').value=view;}
 }
 async function preview(){
  if(busy)return;busy=true;ready=false;$('elevationPNG').disabled=$('elevationPrint').disabled=true;$('elevationFront').disabled=true;
  $('elevationStatus').textContent='Beş görünüş hazırlanıyor…';
  await new Promise(requestAnimationFrame);
  try{render($('elevationPreview'),Number($('elevationFront').value));ready=true;$('elevationStatus').textContent='Pafta hazır. Cepheler ayrı kadrajlara sığdırılmıştır; ölçü almak için kullanılmaz.';}
  catch(e){$('elevationStatus').textContent='Pafta oluşturulamadı: '+e.message;}
  finally{busy=false;$('elevationFront').disabled=false;$('elevationPNG').disabled=$('elevationPrint').disabled=!ready;}
 }
 button.onclick=()=>{SingleStorey.show('model');dialog.showModal();preview();};
 $('elevationFront').onchange=preview;$('elevationClose').onclick=()=>dialog.close();dialog.addEventListener('close',()=>button.focus());
 dialog.addEventListener('keydown',e=>{if(e.key==='Escape')e.stopPropagation();});
 $('elevationPNG').onclick=()=>{if(!ready)return;const a=document.createElement('a');a.download='gorunus-paftasi.png';a.href=$('elevationPreview').toDataURL('image/png');a.click();};
 $('elevationPrint').onclick=()=>{
  if(!ready)return;const win=window.open('','_blank');if(!win){$('elevationStatus').textContent='Yazdırma penceresi engellendi. Bu sayfa için açılır pencereye izin verin veya PNG indirin.';return;}
  win.document.write('<!doctype html><html lang="tr"><head><title>Görünüş paftası</title><style>@page{size:A3 landscape;margin:0}body{margin:0}img{display:block;width:100%;height:auto}@media print{img{width:420mm;height:297mm;object-fit:contain}}</style></head><body></body></html>');win.document.close();
  const img=win.document.createElement('img');img.alt='Beş görünüş paftası';img.onload=()=>{win.focus();win.print();};img.src=$('elevationPreview').toDataURL('image/png');win.document.body.append(img);
 };
 window.ElevationSheet={render};
})();
