/* Preview roof changes in cloned zones; commit the whole dependency graph once. */
(function(){
 'use strict';
 const C=RoofCore,R=RoofStudio,W=RoofWorkflow,$=id=>document.getElementById(id),clone=x=>structuredClone(x),fmt=n=>Number(n).toLocaleString('tr-TR',{maximumFractionDigits:2});
 const M=RoofLevelMath,peak=z=>M.peak(z,C);
 let session=null,preview=null;const inputErrors=new Map();
 const dialog=document.createElement('dialog');dialog.id='roofLevelDialog';
 dialog.innerHTML=`<form method="dialog" class="roof-level-head"><div><small>ÇATI BAĞLANTISI</small><h2>Kot ve eğim</h2></div><button aria-label="Kapat">×</button></form>
 <div class="roof-level-body"><div class="roof-level-controls"><label>Düzenlenecek çatı<select id="roofLevelTarget"></select></label>
 <fieldset><legend>Oturma seviyesi</legend><label>Alt kot kaynağı<select id="roofLevelBaseSource"><option value="wall">Duvar üstünden otomatik</option><option value="manual">Elle gir</option></select></label><label>Saçak altı / duvar üstü kotu · cm<input id="roofLevelBase" type="number" step="any" min="0" max="20000"></label><label class="roof-level-lock"><input id="roofLevelBaseLock" type="checkbox"> Alt kotu kilitle</label></fieldset>
 <fieldset><legend>Mahya yüksekliği</legend><div class="roof-level-pair"><label>Mahya kotu · cm<input id="roofLevelHeight" type="number" step="any"></label><label>Alt kottan yükselme · cm<input id="roofLevelRise" type="number" step="any"></label></div><label class="roof-level-lock"><input id="roofLevelPeakLock" type="checkbox"> Mahya kotunu kilitle</label></fieldset>
 <fieldset><legend>Çatı eğimi</legend><div class="roof-level-pair"><label>Açı · °<input id="roofLevelAngle" type="number" step="any"></label><label>Eğim · %<input id="roofLevelPitch" type="number" step="any" min="1" max="200"></label></div><label class="roof-level-lock"><input id="roofLevelPitchLock" type="checkbox"> Açıyı kilitle</label></fieldset>
 <p id="roofLevelBasis"></p><button type="button" id="roofLevelReset">Bu çatıyı eski değerlerine döndür</button></div>
 <div class="roof-level-preview"><h3>Kot karşılaştırması</h3><div id="roofLevelDiagram"></div><div id="roofLevelValues"></div><p id="roofLevelMigration" hidden></p><p id="roofLevelStatus" role="status" aria-live="polite"></p><p class="roof-level-help">Mahya veya açı değişirken alt kot yerinde kalır. Mahya kilidi yüksekliği, açı kilidi eğimi korur; bu iki kilitten biri kullanılabilir.</p></div></div>
 <div class="roof-level-foot"><span>Önizleme · Uygula'ya kadar proje değişmez.</span><button type="button" id="roofLevelCancel">Vazgeç</button><button type="button" class="primary" id="roofLevelApply">Uygula</button></div>`;
 document.body.append(dialog);
 function spec(z){return {pitch:z.pitch,control:z.levelControl?clone(z.levelControl):null};}
 function edited(z,key){const out=clone(z),s=session?.edits.get(key);if(s){out.pitch=s.pitch;if(s.control){out.levelControl=clone(s.control);delete out.roofElevation;}}R.seat(out);return M.apply(out,C);}
 function raw(key){
  if(key!=='draft')return edited(session.roofs.find(z=>z.id===key),key);
  const d=clone(session.draft),s=session.edits.get('draft');d.pitch=s.pitch;if(s.control){d.levelControl=clone(s.control);delete d.roofElevation;}
  return W.makeOutline(d.points,{...d,previewParent:raw(d.parentId),frameOnly:true});
 }
 function activate(key){
  const s=session.edits.get(key);if(s.control)return;
  const old=raw(key),oldPeak=peak(old),wall=old.wallTop??Number(G.opt.h);
  s.control={version:1,baseMode:'wall',base:wall,baseLocked:false,peakLocked:false,pitchLocked:false,peak:oldPeak,pitch:s.pitch};
  if(old.roofElevation!==undefined&&Math.abs(old.h-wall)>.001){
   s.pitch=M.pitchForPeak({...old,h:wall},oldPeak,C);s.control.pitch=s.pitch;session.migrated.add(key);
  }
 }
 function resolve(zones,previous){
  zones=RoofRoleSwap.prepare(zones.map(z=>W.applyEaveRule(R.seat(clone(z)))),C);
  const resolved=new Map(),visiting=new Set();
  function visit(input){
   if(resolved.has(input.id))return resolved.get(input.id);
   if(visiting.has(input.id))throw Error('Çatı bağlantılarında döngü var.');visiting.add(input.id);
   let z=clone(input),parentId=z.production?.role==='child'?z.production.parentId:z.attachment?.parentId;
   if(parentId){const source=zones.find(p=>p.id===parentId);if(!source)throw Error('Bağlı ana çatı bulunamadı: '+z.name);const parent=visit(source);
    try{if(z.childJoin){W.reanchor(z,previous.find(p=>p.id===parentId),parent);z=C.connectChild(z,parent);z.production.relative=((z.angle-parent.angle)%180+180)%180;z.group=parent.group;}else if(z.attachment)z=C.attachVeranda(z,parent);}
    catch(e){e.message=z.name+': '+e.message;throw e;}
   }
   visiting.delete(z.id);resolved.set(z.id,z);return z;
  }
  const out=zones.map(visit);C.validate(out,G.roofMaterials);C.calculate(out,G.roofMaterials,!!G.opt.osb);return out;
 }
 function evaluate(){
  const source=session.roofs.map(z=>edited(z,z.id));let created=null;
  if(session.draft){created=raw('draft');source.push(created);}
  const out=resolve(source,session.roofs),model=C.calculate(out,G.roofMaterials,!!G.opt.osb);
  return {zones:out,created:created?out.find(z=>z.id===created.id):null,model};
 }
 function n(id){const v=$(id).value.trim();return v===''?NaN:Number(v);}
 function fields(skip=''){
  const z=raw(session.target),c=session.edits.get(session.target).control;
  const set=(id,v)=>{if(id!==skip)$(id).value=Number(v.toFixed(4));};
  set('roofLevelPitch',z.pitch);set('roofLevelAngle',Math.atan(z.pitch/100)*180/Math.PI);set('roofLevelBase',z.h);set('roofLevelHeight',peak(z));set('roofLevelRise',peak(z)-z.h);
  $('roofLevelBaseSource').value=c.baseMode;$('roofLevelBaseSource').disabled=c.baseLocked;
  $('roofLevelBase').disabled=c.baseLocked||c.baseMode==='wall';
  $('roofLevelBaseLock').checked=c.baseLocked;$('roofLevelPeakLock').checked=c.peakLocked;$('roofLevelPitchLock').checked=c.pitchLocked;
  for(const id of ['roofLevelHeight','roofLevelRise','roofLevelAngle','roofLevelPitch'])$(id).disabled=c.peakLocked||c.pitchLocked;
 }
 function diagram(){
  const current=raw(session.target);$('roofLevelBasis').textContent=(G.foundation?'Beton üstü +'+fmt(G.foundation.height)+' cm; aşağıdaki kotlar beton üstüne göredir. Zeminden mahya: '+fmt(G.foundation.height+peak(current))+' cm. ':'')+'Duvar üstü: '+fmt(current.wallTop)+' cm · Saçak altı: '+fmt(current.h)+' cm. Mahya/açı düzenlemesi alt kotu değiştirmez.';
  const keys=session.draft?[session.draft.parentId,'draft']:session.keys,rows=keys.map(key=>({key,name:key==='draft'?'Çizilen çatı':session.roofs.find(z=>z.id===key).name,z:raw(key)}));
  const role=key=>preview?.zones.find(r=>r.id===(key==='draft'?preview.created?.id:key))?.production?.role;
  const roleName=key=>role(key)==='main'?'Ana':role(key)==='child'?'Yavru':'Çatı';
  const values=$('roofLevelValues');values.replaceChildren();
  for(const {key,name,z}of rows){const row=document.createElement('p'),strong=document.createElement('strong');strong.textContent=name+' · Görevi: '+roleName(key);row.append(strong,document.createTextNode('Mahya '+fmt(peak(z))+' cm · Saçak altı '+fmt(z.h)+' cm · %'+fmt(z.pitch)));values.append(row);}
  if(rows.length===2){const p=document.createElement('p');p.textContent='Mahyalar arası fark: '+fmt(Math.abs(peak(rows[1].z)-peak(rows[0].z)))+' cm';values.append(p);}
  // Elevation bands are a comparison, not a structural section or roof projection.
  const lo=Math.min(...rows.map(r=>r.z.h))-20,hi=Math.max(...rows.map(r=>peak(r.z)))+20,y=v=>210-(v-lo)/(hi-lo)*170;
  let svg='<svg viewBox="0 0 400 250" role="img" aria-label="Önizlemedeki saçak ve mahya kotları">';
  for(let i=0;i<4;i++){const v=lo+(hi-lo)*i/3;svg+='<path d="M60 '+y(v)+' H390" stroke="#3d505c"/><text x="3" y="'+(y(v)+4)+'">'+fmt(v)+'</text>';}
  rows.forEach(({z,key},i)=>{const x=100+i*130,p=peak(z),b=z.h;svg+='<rect x="'+x+'" y="'+y(p)+'" width="60" height="'+Math.max(1,y(b)-y(p))+'" rx="4" fill="'+(i?'#c79865':'#76b9a5')+'" opacity=".6"/><text x="'+(x+30)+'" y="'+(y(p)-8)+'" text-anchor="middle">'+fmt(p)+'</text><text x="'+(x+30)+'" y="235" text-anchor="middle">'+roleName(key)+'</text>';});
  $('roofLevelDiagram').innerHTML=svg+'</svg>';
 }
 function render(error=''){
  preview=null;try{if(error||inputErrors.size)throw Error(error||inputErrors.values().next().value);diagram();preview=evaluate();diagram();$('roofLevelStatus').textContent='Bağlantılar uygun · Çatı yüzeyi '+fmt(preview.model.area)+' m². Uygulayabilirsiniz.';$('roofLevelStatus').dataset.state='ready';}
  catch(e){$('roofLevelStatus').textContent=e.message;$('roofLevelStatus').dataset.state='blocked';}
  $('roofLevelApply').disabled=!preview;
  if(preview){const swapped=preview.zones.find(z=>z.roleSwap?.active);if(swapped)$('roofLevelStatus').textContent+=' Roller değişir: '+swapped.name+' ana çatı, '+preview.zones.find(z=>z.id===swapped.roleSwap.parentId).name+' yavru çatı. Oturma kotları korunur.';}
  const m=$('roofLevelMigration');m.hidden=!session.migrated.size;m.textContent='Önceki sürümde taşınmış çatının alt kotu, önizlemede duvar üstüne alındı. Mahya korunup eğim yeniden hesaplandı. Uygula ile kaydedilir.';
 }
 function open(target){
  const d=W.getDraft();if(d&&(!d.openU||d.points.length!==4)){R.notice('Önce dört U noktasını tamamlayın.',true);return;}
  const selected=G.roofs.find(z=>z.id===(target||R.getSelected()));if(!d&&!selected)return;if(!d&&selected.attachment){R.notice('Veranda kotunu kendi bağlantı ayarlarından düzenleyin.',true);return;}
  session={snapshot:JSON.stringify(Studio.state()),roofs:clone(G.roofs),draft:d?clone(d):null,draftRef:d,keys:d?[d.parentId,'draft']:selected.roleSwap?[selected.roleSwap.parentId,selected.id]:selected.production?.role==='child'?[selected.production.parentId,selected.id]:[selected.id],edits:new Map(),migrated:new Set(),target:d?(target==='parent'?d.parentId:'draft'):selected.id};
  for(const z of session.roofs)session.edits.set(z.id,spec(z));if(d)session.edits.set('draft',spec(d));
  const select=$('roofLevelTarget');select.replaceChildren(...session.keys.map(key=>new Option(key==='draft'?'Yavru çatı · çizilen sınır':session.roofs.find(z=>z.id===key).name,key)));select.value=session.target;
  $('roofLevelApply').textContent=d?'Uygula ve yavruyu oluştur':'Uygula';try{inputErrors.clear();activate(session.target);fields();diagram();render();dialog.showModal();}catch(e){session=null;R.notice(e.message,true);}
 }
 $('roofLevelTarget').onchange=()=>{try{session.target=$('roofLevelTarget').value;inputErrors.clear();activate(session.target);fields();render();}catch(e){render(e.message);}};
 function change(id,fn){
  try{const z=raw(session.target),s=session.edits.get(session.target),copy=clone(s);fn(copy,z);M.apply({...z,pitch:copy.pitch,levelControl:copy.control},C);session.edits.set(session.target,copy);inputErrors.clear();fields(id);render();}
  catch(e){inputErrors.set(id,e.message);render();}
 }
 for(const id of ['roofLevelPitch','roofLevelAngle'])$(id).oninput=()=>change(id,(s,z)=>{
  if(s.control.peakLocked||s.control.pitchLocked)throw Error('Önce mahya/açı kilidini açın.');
  const v=n(id),pitch=id==='roofLevelAngle'?100*Math.tan(v*Math.PI/180):v;
  if(!Number.isFinite(pitch)||pitch<1||pitch>200||id==='roofLevelAngle'&&(v<=0||v>=90))throw Error('Eğim %1–200 (yaklaşık 0,573°–63,435°) arasında olmalı.');
  s.pitch=pitch;s.control.pitch=pitch;s.control.peak=peak({...z,pitch});
 });
 for(const id of ['roofLevelHeight','roofLevelRise'])$(id).oninput=()=>change(id,(s,z)=>{
  if(s.control.peakLocked||s.control.pitchLocked)throw Error('Önce mahya/açı kilidini açın.');
  const v=n(id),target=id==='roofLevelRise'?z.h+v:v;s.pitch=M.pitchForPeak(z,target,C);s.control.pitch=s.pitch;s.control.peak=target;
 });
 $('roofLevelBase').oninput=()=>change('roofLevelBase',(s,z)=>{
  if(s.control.baseLocked||s.control.baseMode!=='manual')throw Error('Alt kotu değiştirmek için kilidi açıp Elle gir seçin.');
  const v=n('roofLevelBase');if(!Number.isFinite(v)||v<0||v>20000)throw Error('Alt kot 0–20000 cm arasında olmalı.');
  s.control.base=v;M.apply({...z,levelControl:s.control},C);
 });
 $('roofLevelBaseSource').onchange=()=>change('roofLevelBaseSource',(s,z)=>{if(s.control.baseLocked)throw Error('Alt kot kilitli.');s.control.baseMode=$('roofLevelBaseSource').value;s.control.base=z.h;});
 for(const [id,key]of [['roofLevelBaseLock','baseLocked'],['roofLevelPeakLock','peakLocked'],['roofLevelPitchLock','pitchLocked']])$(id).onchange=()=>change(id,(s,z)=>{
  s.control[key]=$(id).checked;
  if(key==='baseLocked'&&s.control[key])s.control.base=z.h;
  if(key==='peakLocked'&&s.control[key]){s.control.pitchLocked=false;s.control.peak=peak(z);}
  if(key==='pitchLocked'&&s.control[key]){s.control.peakLocked=false;s.control.pitch=z.pitch;}
  s.pitch=z.pitch;
 });
 $('roofLevelReset').onclick=()=>{session.edits.set(session.target,session.target==='draft'?spec(session.draft):spec(session.roofs.find(z=>z.id===session.target)));inputErrors.clear();activate(session.target);fields();render();};
 $('roofLevelCancel').onclick=()=>dialog.close();dialog.addEventListener('close',()=>{session=null;preview=null;});
 function apply(){
  if(!session||!preview)return false;
  if(JSON.stringify(Studio.state())!==session.snapshot||(W.getDraft()!==session.draftRef||JSON.stringify(W.getDraft())!==JSON.stringify(session.draft))){render('Proje değişti. Pencereyi kapatıp güncel çatıyla tekrar açın.');preview=null;$('roofLevelApply').disabled=true;return false;}
  try{const result=evaluate(),id=result.created?.id||session.target;const ok=R.commit(()=>{G.roofs=clone(result.zones);});if(!ok)return false;if(session.draft)W.cancel();dialog.close();R.select(id);R.fit();draw();return true;}catch(e){render(e.message);return false;}
 }
 $('roofLevelApply').onclick=apply;
 // The roof workspace's legacy capture handler must not consume modal editing keys.
 const formButton=()=>{
  const form=$('roofForm');if(!form||$('roofLevelEdit'))return;
  const z=G.roofs.find(r=>r.id===R.getSelected());if(!z||z.attachment)return;
  if(z.levelControl?.peakLocked||z.levelControl?.pitchLocked)$('rz_pitch').disabled=true;
  const pair=z.roleSwap||G.roofs.find(r=>r.roleSwap?.parentId===z.id)?.roleSwap;
  if(pair?.active){
   for(const key of ['x','y','w','d','angle','group'])$('rz_'+key).disabled=true;
   $('roofTurn').disabled=$('roofReverse').disabled=true;
   const note=document.createElement('p');note.className='panel-help';note.textContent='Görevi: '+(z.production.role==='main'?'Ana çatı':'Yavru çatı')+'. Yön ve sınırlar bağlantıdan gelir; kot ve açı ayrı düzenlenir.';form.prepend(note);
  }
  const b=document.createElement('button');b.type='button';b.id='roofLevelEdit';b.textContent='Kot ve açı · önizle';b.onclick=()=>open();$('rz_pitch').closest('label').after(b);
 };
 new MutationObserver(formButton).observe($('roofProperties'),{childList:true});formButton();
 const actions=document.createElement('div');actions.id='roofLevelChoices';actions.hidden=true;
 for(const [target,text]of [['child','Yavru mahyasını alçalt'],['parent','Ana mahyayı yükselt']]){const b=document.createElement('button');b.type='button';b.dataset.roofLevel=target;b.textContent=text;b.onclick=()=>open(target);actions.append(b);}
 $('singleRoofFeedback').append(actions);
 const refresh=SingleRoofFeedback.refresh;SingleRoofFeedback.refresh=function(mode){const result=refresh(mode),d=W.getDraft();actions.hidden=!(d?.openU&&d.points.length===4&&mode==='plan');return result;};
 window.SingleRoofLevel={open,apply,peak,resolve,preview:()=>preview};
})();
