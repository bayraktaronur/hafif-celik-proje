/* Live U connection feedback; editing draft settings never changes an existing roof. */
(function(){
 'use strict';
 const $=id=>document.getElementById(id),R=RoofStudio,W=RoofWorkflow;
 const card=document.createElement('div');card.id='singleRoofFeedback';card.hidden=true;card.setAttribute('role','status');card.setAttribute('aria-live','polite');
 const title=document.createElement('strong'),body=document.createElement('p');card.append(title,body);$('roofBoundaryFinish').before(card);
 let last=null;
 function refresh(mode){
  const d=W.getDraft();
  if(!d?.openU||mode!=='plan'){card.hidden=true;last=null;return false;}
  card.hidden=false;card.dataset.state='drawing';
  const count=d.points.length,complete=count===4;
  $('roofBoundaryFinish').disabled=!complete;
  if(!complete){
   last=null;title.textContent='Yavru çatı · '+count+'/4 nokta';
   body.textContent=['Ana çatı kenarını seçin.','İlk dış duvar köşesini seçin.','İkinci dış duvar köşesini seçin.','Aynı ana çatı kenarına dönüp bitirin.'][count];
   $('roofHint').textContent=body.textContent+' · Backspace: son nokta · Esc: iptal';R.notice('');return true;
  }
  try{
   if(!Number.isFinite(d.pitch)||d.pitch<1||d.pitch>200)throw Error('Eğim %1–200 arasında olmalı.');
   if(d.settingsError)throw Error(d.settingsError);
   const z=W.makeOutline(d.points,d);last={ok:true,mode:z.childJoin.mode};card.dataset.state='ready';
   title.textContent='Bağlantı hazır';body.textContent=(z.childJoin.mode==='gable'?'Ana çatı alnına bağlantı':'Ana yüzeyle kesişim')+' doğrulandı. Enter ile oluşturun.';
   $('roofHint').textContent='Dört nokta bağlı · Enter: oluştur · Backspace: düzelt · Esc: iptal';R.notice('Bağlantı hazır. Çatıyı oluştur veya Enter.');
  }catch(e){
   last={ok:false,code:e.code||'roof-child-input',message:e.message,details:e.details||{}};card.dataset.state='blocked';
   title.textContent='Bağlantı oluşturulamadı';body.textContent=e.message;
   $('roofBoundaryFinish').disabled=true;$('roofHint').textContent='Dört nokta tamam · Bağlantı nedenini solda inceleyin · Backspace: son noktayı düzelt';R.notice(e.message,true);
  }
  return true;
 }
 $('roofBoundaryType').closest('section').addEventListener('input',e=>{
  if(!['roofDrawPitch','roofBoundaryType','roofDrawGable','roofDrawSide','parapetDrawHeight','parapetDrawOffset','parapetDrawInner'].includes(e.target.id))return;
  const d=W.getDraft();if(!d)return;
  try{Object.assign(d,ParapetOptions.drawingSettings());delete d.settingsError;}
  catch(error){d.settingsError=error.message;}
  W.hint('plan');R.repaint();
 });
 window.SingleRoofFeedback={refresh,result:()=>last};
})();
