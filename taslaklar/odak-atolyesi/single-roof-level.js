/* Preview roof changes in cloned zones; commit the whole dependency graph once. */
(function(){
 'use strict';
 const C=RoofCore,R=RoofStudio,W=RoofWorkflow,$=id=>document.getElementById(id),clone=x=>structuredClone(x),fmt=n=>Number(n).toLocaleString('tr-TR',{maximumFractionDigits:2});
 const peak=z=>Math.max(...C.zoneFaces(z).flatMap(f=>f.poly.map(p=>C.height(f,p))));
 let session=null,preview=null;const inputErrors=new Map();
 const dialog=document.createElement('dialog');dialog.id='roofLevelDialog';
 dialog.innerHTML=`<form method="dialog" class="roof-level-head"><div><small>ÇATI BAĞLANTISI</small><h2>Kot ve eğim</h2></div><button aria-label="Kapat">×</button></form>
 <div class="roof-level-body"><div class="roof-level-controls"><label>Düzenlenecek çatı<select id="roofLevelTarget"></select></label><div class="roof-level-pair"><label>Açı · °<input id="roofLevelAngle" type="number" step="any" min="0.5729387" max="63.434949"></label><label>Eğim · %<input id="roofLevelPitch" type="number" step="any" min="1" max="200"></label></div><label>Yükseklik referansı<select id="roofLevelReference"><option value="peak">Mahya / en yüksek çatı kotu</option><option value="base">Saçak kapaması alt kotu</option></select></label><label>Kot · cm<input id="roofLevelHeight" type="number" step="any" min="0" max="100000"></label><label class="roof-level-auto"><input id="roofLevelAuto" type="checkbox"> Duvar üstüne otomatik otur</label><p id="roofLevelBasis"></p><button type="button" id="roofLevelReset">Bu çatıyı eski değerlerine döndür</button></div>
 <div class="roof-level-preview"><h3>Kot karşılaştırması</h3><div id="roofLevelDiagram"></div><div id="roofLevelValues"></div><p id="roofLevelStatus" role="status" aria-live="polite"></p></div></div>
 <div class="roof-level-foot"><span>Önizleme · Uygula'ya kadar proje değişmez.</span><button type="button" id="roofLevelCancel">Vazgeç</button><button type="button" class="primary" id="roofLevelApply">Uygula</button></div>`;
 document.body.append(dialog);
 function spec(z){return {pitch:z.pitch,roofElevation:z.roofElevation??null};}
 function edited(z,key){const out=clone(z),s=session?.edits.get(key);if(s){out.pitch=s.pitch;if(s.roofElevation===null)delete out.roofElevation;else out.roofElevation=s.roofElevation;}return R.seat(out);}
 function raw(key){
  if(key!=='draft')return edited(session.roofs.find(z=>z.id===key),key);
  const d=clone(session.draft),s=session.edits.get('draft');if(s){d.pitch=s.pitch;if(s.roofElevation!==null)d.roofElevation=s.roofElevation;else delete d.roofElevation;}
  return W.makeOutline(d.points,{...d,previewParent:raw(d.parentId),frameOnly:true});
 }
 function resolve(zones,previous){
  const resolved=new Map(),visiting=new Set();
  function visit(input){
   if(resolved.has(input.id))return resolved.get(input.id);
   if(visiting.has(input.id))throw Error('Çatı bağlantılarında döngü var.');visiting.add(input.id);
   let z=W.applyEaveRule(R.seat(clone(input))),parentId=z.production?.role==='child'?z.production.parentId:z.attachment?.parentId;
   if(parentId){const source=zones.find(p=>p.id===parentId);if(!source)throw Error('Bağlı ana çatı bulunamadı: '+z.name);const parent=visit(source);
    try{if(z.childJoin){W.reanchor(z,previous.find(p=>p.id===parentId),parent);z=C.connectChild(z,parent);z.production.relative=((z.angle-parent.angle)%180+180)%180;z.group=parent.group;}else if(z.attachment)z=C.attachVeranda(z,parent);}
    catch(e){e.message=z.name+': '+e.message;throw e;}
   }
   visiting.delete(z.id);resolved.set(z.id,z);return z;
  }
  const out=zones.map(visit);C.validate(out,G.roofMaterials);C.calculate(out,G.roofMaterials,!!G.opt.osb);return out;
 }
 function evaluate(){
  const source=session.roofs.map(z=>edited(z,z.id)),out=resolve(source,session.roofs);
  let created=null;
  if(session.draft){const d=clone(session.draft),s=session.edits.get('draft');d.pitch=s.pitch;if(s.roofElevation!==null)d.roofElevation=s.roofElevation;else delete d.roofElevation;
   created=W.makeOutline(d.points,{...d,previewParent:out.find(z=>z.id===d.parentId)});out.push(created);C.validate(out,G.roofMaterials);
  }
  const model=C.calculate(out,G.roofMaterials,!!G.opt.osb);return {zones:out,created,model};
 }
 function n(id){const v=$(id).value.trim();return v===''?NaN:Number(v);}
 function fields(){
  inputErrors.clear();
  const z=raw(session.target),s=session.edits.get(session.target);
  $('roofLevelPitch').value=Number(s.pitch.toFixed(6));$('roofLevelAngle').value=Number((Math.atan(s.pitch/100)*180/Math.PI).toFixed(6));
  $('roofLevelHeight').value=Number(($('roofLevelReference').value==='peak'?peak(z):z.h).toFixed(4));$('roofLevelAuto').checked=s.roofElevation===null;
  $('roofLevelBasis').textContent='Duvar üstü: '+fmt(z.wallTop)+' cm · Saçak altı: '+fmt(z.h)+' cm. Açı ve eğim birlikte güncellenir; duvar yüksekliği değişmez.';
 }
 function diagram(){
  const current=raw(session.target);$('roofLevelBasis').textContent='Duvar üstü: '+fmt(current.wallTop)+' cm · Saçak altı: '+fmt(current.h)+' cm. Açı ve eğim birlikte güncellenir; duvar yüksekliği değişmez.';
  const keys=session.draft?[session.draft.parentId,'draft']:session.keys,rows=keys.map(key=>({name:key==='draft'?'Yavru çatı':session.roofs.find(z=>z.id===key).name,z:raw(key)}));
  const values=$('roofLevelValues');values.replaceChildren();
  for(const {name,z}of rows){const row=document.createElement('p'),strong=document.createElement('strong');strong.textContent=name;row.append(strong,document.createTextNode(' · Mahya '+fmt(peak(z))+' cm · Saçak altı '+fmt(z.h)+' cm · %'+fmt(z.pitch)));values.append(row);}
  if(rows.length===2){const p=document.createElement('p');p.textContent='Mahya farkı: '+fmt(peak(rows[1].z)-peak(rows[0].z))+' cm (yavru − ana)';values.append(p);}
  // Elevation bands are a comparison, not a structural section or roof projection.
  const lo=Math.min(...rows.map(r=>r.z.h))-20,hi=Math.max(...rows.map(r=>peak(r.z)))+20,y=v=>210-(v-lo)/(hi-lo)*170;
  let svg='<svg viewBox="0 0 400 250" role="img" aria-label="Önizlemedeki saçak ve mahya kotları">';
  for(let i=0;i<4;i++){const v=lo+(hi-lo)*i/3;svg+='<path d="M60 '+y(v)+' H390" stroke="#3d505c"/><text x="3" y="'+(y(v)+4)+'">'+fmt(v)+'</text>';}
  rows.forEach(({z},i)=>{const x=100+i*130,p=peak(z),b=z.h;svg+='<rect x="'+x+'" y="'+y(p)+'" width="60" height="'+Math.max(1,y(b)-y(p))+'" rx="4" fill="'+(i?'#c79865':'#76b9a5')+'" opacity=".6"/><text x="'+(x+30)+'" y="'+(y(p)-8)+'" text-anchor="middle">'+fmt(p)+'</text><text x="'+(x+30)+'" y="235" text-anchor="middle">'+(rows.length===1?'Çatı':i?'Yavru':'Ana')+'</text>';});
  $('roofLevelDiagram').innerHTML=svg+'</svg>';
 }
 function render(error=''){
  preview=null;try{for(const s of session.edits.values())if(!Number.isFinite(s.pitch)||s.pitch<1||s.pitch>200||s.roofElevation!==null&&(!Number.isFinite(s.roofElevation)||s.roofElevation<0||s.roofElevation>20000))throw Error('Eğim %1–200; saçak alt kotu 0–20000 cm arasında olmalı.');diagram();if(error||inputErrors.size)throw Error(error||inputErrors.values().next().value);preview=evaluate();$('roofLevelStatus').textContent='Bağlantılar uygun · Çatı yüzeyi '+fmt(preview.model.area)+' m². Uygulayabilirsiniz.';$('roofLevelStatus').dataset.state='ready';}
  catch(e){$('roofLevelStatus').textContent=e.message;$('roofLevelStatus').dataset.state='blocked';}
  $('roofLevelApply').disabled=!preview;
 }
 function open(target){
  const d=W.getDraft();if(d&&(!d.openU||d.points.length!==4)){R.notice('Önce dört U noktasını tamamlayın.',true);return;}
  const selected=G.roofs.find(z=>z.id===(target||R.getSelected()));if(!d&&!selected)return;if(!d&&selected.attachment){R.notice('Veranda kotunu kendi bağlantı ayarlarından düzenleyin.',true);return;}
  session={snapshot:JSON.stringify(Studio.state()),roofs:clone(G.roofs),draft:d?clone(d):null,draftRef:d,keys:d?[d.parentId,'draft']:selected.production?.role==='child'?[selected.production.parentId,selected.id]:[selected.id],edits:new Map(),target:d?(target==='parent'?d.parentId:'draft'):selected.id};
  for(const z of session.roofs)session.edits.set(z.id,spec(z));if(d)session.edits.set('draft',{pitch:d.pitch,roofElevation:d.roofElevation??null});
  const select=$('roofLevelTarget');select.replaceChildren(...session.keys.map(key=>new Option(key==='draft'?'Yavru çatı · çizilen sınır':session.roofs.find(z=>z.id===key).name,key)));select.value=session.target;$('roofLevelReference').value='peak';
  $('roofLevelApply').textContent=d?'Uygula ve yavruyu oluştur':'Uygula';try{fields();render();dialog.showModal();}catch(e){session=null;R.notice(e.message,true);}
 }
 $('roofLevelTarget').onchange=()=>{session.target=$('roofLevelTarget').value;fields();render();};
 $('roofLevelReference').onchange=fields;
 for(const id of ['roofLevelPitch','roofLevelAngle'])$(id).oninput=()=>{
  const v=n(id),pitch=id==='roofLevelAngle'?100*Math.tan(v*Math.PI/180):v;
  if(!Number.isFinite(pitch)||pitch<1||pitch>200||id==='roofLevelAngle'&&(v<=0||v>=90)){inputErrors.set(id,'Eğim %1–200 (yaklaşık 0,573°–63,435°) arasında olmalı.');render();return;}
  inputErrors.clear();session.edits.get(session.target).pitch=pitch;
  const other=id==='roofLevelAngle'?'roofLevelPitch':'roofLevelAngle';$(other).value=Number((other==='roofLevelPitch'?pitch:Math.atan(pitch/100)*180/Math.PI).toFixed(6));
  const z=raw(session.target);$('roofLevelHeight').value=Number(($('roofLevelReference').value==='peak'?peak(z):z.h).toFixed(4));render();
 };
 $('roofLevelHeight').oninput=()=>{
  const v=n('roofLevelHeight');if(!Number.isFinite(v)){inputErrors.set('roofLevelHeight','Kot değerini santimetre olarak girin.');render();return;}inputErrors.delete('roofLevelHeight');
  const z=raw(session.target),base=$('roofLevelReference').value==='peak'?z.h+v-peak(z):v;
  session.edits.get(session.target).roofElevation=base;$('roofLevelAuto').checked=false;render();
 };
 $('roofLevelAuto').onchange=()=>{const s=session.edits.get(session.target);s.roofElevation=$('roofLevelAuto').checked?null:raw(session.target).h;fields();render();};
 $('roofLevelReset').onclick=()=>{session.edits.set(session.target,session.target==='draft'?{pitch:session.draft.pitch,roofElevation:session.draft.roofElevation??null}:spec(session.roofs.find(z=>z.id===session.target)));fields();render();};
 $('roofLevelCancel').onclick=()=>dialog.close();dialog.addEventListener('close',()=>{session=null;preview=null;});
 function apply(){
  if(!session||!preview)return false;
  if(JSON.stringify(Studio.state())!==session.snapshot||(W.getDraft()!==session.draftRef||JSON.stringify(W.getDraft())!==JSON.stringify(session.draft))){render('Proje değişti. Pencereyi kapatıp güncel çatıyla tekrar açın.');preview=null;$('roofLevelApply').disabled=true;return false;}
  try{const result=evaluate(),id=result.created?.id||session.target;const ok=R.commit(()=>{G.roofs=clone(result.zones);});if(!ok)return false;if(session.draft)W.cancel();dialog.close();R.select(id);R.fit();draw();return true;}catch(e){render(e.message);return false;}
 }
 $('roofLevelApply').onclick=apply;
 // The roof workspace's legacy capture handler must not consume modal editing keys.
 const formButton=()=>{const form=$('roofForm');if(!form||$('roofLevelEdit'))return;const z=G.roofs.find(r=>r.id===R.getSelected());if(!z||z.attachment)return;const b=document.createElement('button');b.type='button';b.id='roofLevelEdit';b.textContent='Kot ve açı · önizle';b.onclick=()=>open();$('rz_pitch').closest('label').after(b);};
 new MutationObserver(formButton).observe($('roofProperties'),{childList:true});formButton();
 const actions=document.createElement('div');actions.id='roofLevelChoices';actions.hidden=true;
 for(const [target,text]of [['child','Yavru çatıyı alçalt'],['parent','Ana çatıyı yükselt']]){const b=document.createElement('button');b.type='button';b.dataset.roofLevel=target;b.textContent=text;b.onclick=()=>open(target);actions.append(b);}
 $('singleRoofFeedback').append(actions);
 const refresh=SingleRoofFeedback.refresh;SingleRoofFeedback.refresh=function(mode){const result=refresh(mode),d=W.getDraft();actions.hidden=!(d?.openU&&d.points.length===4&&mode==='plan');return result;};
 window.SingleRoofLevel={open,apply,peak,resolve,preview:()=>preview};
})();
