/* Native plan output style; never changes model materials or dimensions. */
window.PlanPresentation={
 active(){return document.getElementById('exportPlanStyle')?.value==='architectural'&&document.getElementById('planExportDialog')?.dataset.format!=='dxf';},
 setup(change){
  const host=document.getElementById('exportPdfOptions');
  host.insertAdjacentHTML('beforeend','<label>Sunum biçimi<select id="exportPlanStyle"><option value="technical">Teknik plan</option><option value="architectural">Mimari sunum · renkli ve gölgeli</option></select></label>');
  const el=document.getElementById('exportPlanStyle');el.onchange=change;
  const read=SheetOutput.read,restore=SheetOutput.restore;
  SheetOutput.read=()=>{const value=read();if(el.value==='architectural')value.presentation=el.value;return value;};
  SheetOutput.restore=value=>{restore(value);el.value=value?.presentation==='architectural'?'architectural':'technical';};
 }
};
