/* Fast room classification using the existing model and undo transaction. */
(function(){
  'use strict';
  const modal=document.getElementById('mbgOda'),select=document.getElementById('odaTip'),name=document.getElementById('odaAd');
  const grid=document.createElement('div');grid.id='roomTypePicker';grid.className='room-type-picker';grid.setAttribute('role','group');grid.setAttribute('aria-label','Oda türü seç');
  for(const option of select.options){
    const button=document.createElement('button');button.type='button';button.className='sib';button.dataset.roomType=option.value;button.textContent=option.value?option.textContent:'Türü temizle';
    button.onclick=()=>{select.value=option.value;odaKaydet();cv.focus();};grid.append(button);
  }
  const help=document.createElement('p');help.className='panel-help';help.textContent='Oda türüne tıkla: hemen uygula. Esc: vazgeç. Ctrl+Z: geri al.';
  select.closest('.mf').hidden=true;select.closest('.mf').before(help,grid);
  const custom=name.closest('.mf');custom.querySelector('label').textContent='Özel ad (isteğe bağlı)';
  modal.querySelector('.mok').textContent='Özel adı uygula';
  const original=window.openOdaModal;
  window.openOdaModal=function(room){
    original(room);
    grid.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.roomType===(room.tip||''))));
    const selected=grid.querySelector('[aria-pressed="true"]');if(selected)selected.focus();
  };
})();
