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
   if(!d.eaveRule||!Number.isFinite(d.eaveRule.gableMm)||d.eaveRule.gableMm<=0||d.eaveRule.gableMm>5000||!Number.isFinite(d.eaveRule.sideMm)||d.eaveRule.sideMm<0||d.eaveRule.sideMm>5000)throw Error('Alın 1–5000 mm, yan saçak 0–5000 mm olmalı.');
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
 for(const id of ['roofDrawPitch','roofBoundaryType','roofDrawGable','roofDrawSide']){
  $(id).addEventListener('input',()=>{
   const d=W.getDraft();if(!d?.openU)return;
   const numeric=id=>$(id).value.trim()===''?NaN:Number($(id).value);
   d.pitch=numeric('roofDrawPitch');d.type=$('roofBoundaryType').value;d.eaveRule={gableMm:numeric('roofDrawGable'),sideMm:numeric('roofDrawSide')};d.eave=d.eaveRule.sideMm/10;
   refresh('plan');R.repaint();
  });
 }
 window.SingleRoofFeedback={refresh,result:()=>last};
})();
