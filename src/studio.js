/* Workspace, persistence, command history and model checks around the v5 engine. */
(function(){
  'use strict';
  const $=id=>document.getElementById(id);
  const original={draw,updateSidebar,setSistem,setTool,snapPoint,modalOk,elemanKonumla,elemanKaydir,splitSeg,optUygula,resizeSeg,upKapiTip,hafifCeligeAktar,numUygula,updateStatus};
  const STORAGE='prefabrikten.planstudio.recovery.v1';
  let future=[],restoring=false,autoTimer,toastTimer,analysisTimer,lastStored='',fileSnapshot='',storageReady=true,pendingRecovery=null,gesture=null;
  let projectName='Yeni proje',activeTab='properties',lastAnalysis='';
  G.ortho=false;G.inputUnit='panel';
  const clone=o=>JSON.parse(JSON.stringify(o));
  function toast(message,error=false){$('toast').textContent=message;$('toast').classList.toggle('error',error);$('toast').style.display='block';clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('toast').style.display='none',error?6500:3500);}
  function state(){
    const used=new Set(G.segs.flatMap(s=>[s.n1,s.n2]));
    return {v:'5',revision:'5.9.66',projectName,sheetInfo:clone(G.sheetInfo||{}),loading:clone(G.loading||{adjustments:[],manual:[]}),sistem:G.sistem,catiYon:G.catiYon,opt:clone(G.opt),
      n:clone(G.nodes.filter(n=>used.has(n.id))),s:clone(G.segs),e:clone(G.elemanlar),r:clone(G.rooms),annotations:clone(G.annotations||[]),fixtures:clone(G.fixtures||[]),counters:clone(G.counters||[]),roofs:clone(G.roofs||[]),roofMaterials:clone(G.roofMaterials||[]),
      ky:+$('katYuk').value,dy:+$('disYuk').value,fire:ALCI.FIRE,
      settings:{...(G.viewFilters?{viewFilters:clone(G.viewFilters)}:{}),moduleAxisSnap:G.moduleAxisSnap!==false,panelDrawMode:G.panelDrawMode||'mixed',trussOverrides:clone((G.trussOverrides||[]).filter(e=>used.has(e.nodeId))),snapTargets:clone(G.snapTargets||{}),moveAlign:!!G.moveAlign,moveModule:!!G.moveModule,gridCm:G.gridCm,defaultK:G.defaultK,snapGrid:G.snapGrid,snapWall:G.snapWall,elStep:G.elStep,duvarYakala:G.duvarYakala,pnlEtiket:G.pnlEtiket,catiYon:G.catiYon,makasGoster:G.makasGoster,olcuModu:G.olcuModu,ortho:G.ortho,inputUnit:G.inputUnit,selectionMode:G.selectionMode||'wall',panelSync:G.panelSync!==false,freeSnapStep:G.freeSnapStep||5}};
  }
  function snapshot(){return JSON.stringify(state());}
  function resetInteraction(){
    G.selPanels=[];G.panelAnchor=null;
    if(window.PlanClipboard)PlanClipboard.cancel();if(window.TextNotes)TextNotes.cancel();if(window.Fixtures)Fixtures.cancel();if(window.Kitchen)Kitchen.cancel();
    delete G.drawRejectReason;
    G.drawing=false;G.drawChain=false;G.drawStart=null;G.drawPreviewPt=null;G.numBuf='';G.dragging=false;G.dragNodeId=null;G.dragMidSeg=null;G.dragMidMode=null;G.dragEleman=null;G.wallDrag=null;G.dimDrag=null;G.lblDrag=null;G.panning=false;G.snapPt=null;G.snapNodeId=null;G.secili=null;G.seciliTip=null;G.seciliDimRow=null;G.selSegs=[];G.shiftLock=false;G.altKey=false;G.lockAxis=null;
    $('lockInd').style.display='none';$('shiftLbl').textContent='';
    G._snapBlocked=false;G._snapInfo=null;G._snapLbl=null;G._lastSnapPointer=null;
    if($('snapReadout'))$('snapReadout').textContent='Kilitli: H, panel merkezi veya köşe.';
  }
  function clearOrphans(){const used=new Set(G.segs.flatMap(s=>[s.n1,s.n2]));G.nodes=G.nodes.filter(n=>used.has(n.id));}
  function apply(d,{normalize=false}={}){
    restoring=true;
    try{
      resetInteraction();
      G.loading=clone(d.loading||{adjustments:[],manual:[]});G.sheetInfo=clone(d.sheetInfo||{});G.nodes=clone(d.n);G.segs=clone(d.s);G.elemanlar=clone(d.e);G.rooms=clone(d.r);G.annotations=clone(d.annotations||[]);G.fixtures=clone(d.fixtures||[]);G.counters=clone(d.counters||[]);G.roofs=clone(d.roofs||[]);G.roofMaterials=clone(d.roofMaterials||[]);
      G.opt=Object.assign({},PlanProject.DEFAULT_OPTIONS,clone(d.opt||{}));PF.IC=+G.opt.ic;PF.DIS=+G.opt.dis;
      G.catiYon=d.catiYon||'yatay';projectName=d.projectName||'Yeni proje';$('projectName').value=projectName;
      $('katYuk').value=d.ky;$('disYuk').value=d.dy;ALCI.FIRE=d.fire??10;$('fireYuzde').value=ALCI.FIRE;
      original.setSistem(d.sistem,true);Object.assign(G,{viewFilters:null,defaultK:isPref()?PF.DIS:14,snapGrid:true,snapWall:true,elStep:5,duvarYakala:'h',panelDrawMode:'mixed',moduleAxisSnap:true,trussOverrides:[],snapTargets:{},moveAlign:false,moveModule:false,pnlEtiket:true,makasGoster:true,olcuModu:'panel',ortho:false,inputUnit:'panel',selectionMode:'wall',panelSync:true,freeSnapStep:5},d.settings||{});
      $('gridSel').value=String(G.gridCm);$('elStepSel').value=String(G.elStep);$('yakalaSel').value=G.duvarYakala;
      const ids=[...G.nodes,...G.segs,...G.elemanlar,...G.rooms].map(o=>Number(/^e(\d+)$/.exec(o.id)?.[1]||0));
      ID=Math.max(ID,...ids,0)+1;
      if(normalize)normalizeGraph();detectRooms();buildDK();catiBtnGuncelle();updateDimRestore();updateSidebar();draw();
    }finally{restoring=false;}
  }
  function record(s){if(restoring)return;if(G.hist.at(-1)!==s)G.hist.push(s);if(G.hist.length>100)G.hist.shift();future=[];}
  window.pushH=()=>record(snapshot());
  window.pushHSnap=function(s){const old=JSON.parse(s),full=state();full.n=old.n;full.s=old.s;full.e=old.e;record(JSON.stringify(full));};
  window.geriAl=function(){
    if(!G.hist.length)return;
    const current=snapshot();let before=G.hist.pop();while(before===current&&G.hist.length)before=G.hist.pop();
    if(before===current){sync();return;}
    future.push(current);apply(JSON.parse(before));schedule();toast('İşlem geri alındı.');
  };
  window.ileriAl=function(){if(!future.length)return;const next=future.pop();G.hist.push(snapshot());apply(JSON.parse(next));schedule();toast('İşlem yeniden uygulandı.');};
  function schedule(){
    if(restoring)return;clearTimeout(autoTimer);autoTimer=setTimeout(persist,650);
    clearTimeout(analysisTimer);analysisTimer=setTimeout(()=>{if(activeTab==='analysis')analyze();else refreshIssueCount();},850);
  }
  function persist(){
    const s=snapshot();if(s===lastStored)return;
    $('saveState').textContent=s===fileSnapshot?'Dosya indirildi':'Kaydedilmemiş değişiklikler';
    if(!storageReady)return;
    try{localStorage.setItem(STORAGE,JSON.stringify({savedAt:new Date().toISOString(),project:JSON.parse(s)}));lastStored=s;$('saveState').textContent=s===fileSnapshot?'Dosya indirildi · yerel yedek güncel':'Tarayıcıda yedeklendi · '+new Date().toLocaleTimeString('tr-TR',{hour:'2-digit',minute:'2-digit'});}
    catch{ $('saveState').textContent='Yerel yedek kullanılamıyor · dosyaya kaydedin'; }
  }
  function download(data,name,type='application/json'){
    const b=new Blob([typeof data==='string'?data:JSON.stringify(data,null,2)],{type});const u=URL.createObjectURL(b),a=document.createElement('a');a.href=u;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(u),3000);
  }
  window.planKaydet=function(){try{const d=PlanProject.validate(state());const name=projectName.replace(/[<>:"/\\|?*\x00-\x1F]/g,'_').trim()||'plan';download(d,name+'.json');fileSnapshot=snapshot();lastStored='';persist();toast('Proje dosyası indirildi.');}catch(e){toast(e.message,true);}};
  function loadProject(input){
    const valid=PlanProject.validate(input),before=snapshot(),h=G.hist.slice(),f=future.slice();
    try{apply(valid,{normalize:true});G.hist=[];future=[];fileSnapshot=snapshot();lastStored='';storageReady=true;$('recoveryBanner').hidden=true;fit();schedule();return state();}
    catch(e){apply(JSON.parse(before));G.hist=h;future=f;throw e;}
  }
  window.dosyaYukle=async function(ev){
    const file=ev.target.files[0];ev.target.value='';if(!file)return;
    try{
      if(file.size>12*1024*1024)throw Error('Dosya 12 MB sınırını aşıyor.');
      if(!/\.json$/i.test(file.name))throw Error('Bu sürüm JSON proje dosyası açar.');
      const valid=PlanProject.validate(JSON.parse(await file.text()));
      if((G.segs.length||(G.annotations||[]).length)&&snapshot()!==fileSnapshot&&!confirm('Açılan dosya mevcut çalışmanın yerini alacak. Devam edilsin mi?'))return;
      loadProject(valid);toast('Proje açıldı. Geometrik uyarıları Plan kontrolü bölümünde görebilirsiniz.');
    }catch(e){toast('Dosya açılamadı: '+e.message,true);}
  };
  window.yeniPlan=function(){
    if((G.segs.length||(G.annotations||[]).length)&&!confirm('Yeni proje açılsın mı? İndirmediğiniz çalışmayı önce Kaydet ile saklayabilirsiniz.'))return;
    const sistem=G.sistem;
    apply({n:[],s:[],e:[],r:[],opt:clone(PlanProject.DEFAULT_OPTIONS),sistem,catiYon:'yatay',projectName:'Yeni proje',ky:280,dy:320,fire:10,settings:{}});
    G.hist=[];future=[];G.zoom=1;G.pan={x:100,y:80};fileSnapshot='';storageReady=true;$('recoveryBanner').hidden=true;draw();schedule();
  };
  function newErrors(before,after,checkModules=true){
    const known=new Set(PlanProject.analyze(before).filter(i=>i.level==='error').map(i=>i.code+'|'+i.id));
    return PlanProject.analyze(after).filter(i=>i.level==='error'&&!known.has(i.code+'|'+i.id)).concat(checkModules&&window.Modular?Modular.validate(before,after):[]);
  }
  function edit(mutate,{geometry=false,preserveLayout=false}={}){
    const before=state(),h=G.hist.slice(),f=future.slice(),selected=G.secili?.id,selectedType=G.seciliTip;
    try{
      pushH();mutate();if(geometry)normalizeGraph();detectRooms();
      const errors=newErrors(before,state(),!preserveLayout);if(errors.length)throw Error(errors[0].message);
      if(selected){G.secili=({node:G.nodes,seg:G.segs,eleman:G.elemanlar,room:G.rooms,annotation:G.annotations,fixture:G.fixtures,counter:G.counters,dim:G.segs}[selectedType]||[]).find(o=>o.id===selected)||null;G.seciliTip=G.secili?selectedType:null;}
      updateSidebar();draw();return true;
    }catch(e){apply(before);G.hist=h;future=f;toast(e.message,true);return false;}
  }
  function positive(value,min,max,label){if(!Number.isFinite(value)||value<min||value>max)throw Error(label+' '+min+'–'+max+' aralığında olmalı.');}
  function openingError(e){
    const s=getSeg(e.segId);if(!s||s.tip==='veranda')return 'Açıklık yalnızca gerçek bir duvara eklenebilir.';
    if(!Number.isFinite(e.en)||e.en<1||!Number.isFinite(e.yuk)||e.yuk<1)return 'Açıklık ölçüleri sıfırdan büyük olmalı.';
    if(e.yuk>+$('katYuk').value)return 'Açıklık yüksekliği kat yüksekliğini aşıyor.';
    const L=_segLen(s),lo=ucBosluk(s,s.n1),hi=L-ucBosluk(s,s.n2);
    if(e.en>hi-lo+.01)return 'Açıklık, köşe payları çıkarılmış duvar uzunluğuna sığmıyor.';
    const st=e.t*L,end=st+e.en;
    if(st<lo-.01||end>hi+.01)return 'Açıklık duvar ucuna veya köşe birleşimine taşıyor.';
    if(G.elemanlar.some(o=>o.id!==e.id&&o.segId===e.segId&&Math.min(end,o.t*L+o.en)-Math.max(st,o.t*L)>.01))return 'Kapı ve pencere boşlukları üst üste gelemez.';
    return null;
  }
  window.elemanKonumla=function(e,s,pos,step){const old=e.t;original.elemanKonumla(e,s,pos,step);if(openingError(e))e.t=old;};
  window.elemanKaydir=function(...args){const e=G.secili,old=e?.t,h=G.hist.slice(),f=future.slice();const result=original.elemanKaydir(...args);if(e&&openingError(e)){e.t=old;G.hist=h;future=f;draw();toast('Bu konum başka bir açıklıkla veya birleşimle çakışıyor.',true);}return result;};
  window.modalOk=function(){
    const en=+$('mEn').value,yuk=+$('mYuk').value,s=_mSeg;
    if(!s)return;
    const before=state(),h=G.hist.slice(),f=future.slice();
    try{
      positive(en,1,5000,'Açıklık genişliği');positive(yuk,1,+$('katYuk').value,'Açıklık yüksekliği');
      if(s.tip==='veranda')throw Error('Veranda sınırına açıklık eklenemez.');
      if(en>_segLen(s)-ucBosluk(s,s.n1)-ucBosluk(s,s.n2))throw Error('Açıklık duvara sığmıyor. Genişliği azaltın.');
      original.modalOk();const added=G.elemanlar.at(-1),error=openingError(added);if(error)throw Error(error);
      draw();
    }catch(e){apply(before);G.hist=h;future=f;_mSeg=getSeg(s.id);$('mbg').classList.add('open');toast(e.message,true);}
  };
  window.upSelNode=function(k,v){if(G.seciliTip!=='node')return;edit(()=>{positive(v,-10000000,10000000,'Koordinat');G.secili[k]=v;},{geometry:true});};
  window.upSelSeg=function(k,v){if(G.seciliTip!=='seg')return;edit(()=>{positive(v,.1,100,'Kalınlık');G.secili[k]=v;if(isPref())G.secili.kSabit=true;});};
  window.upSelSegsK=function(v){edit(()=>{positive(v,.1,100,'Kalınlık');selSegList().forEach(s=>{s.k=v;if(isPref())s.kSabit=true;});});};
  window.upSelEl=function(k,v){if(G.seciliTip!=='eleman')return;edit(()=>{if(k!=='ad')positive(v,1,5000,'Ölçü');G.secili[k]=v;const error=openingError(G.secili);if(error)throw Error(error);});};
  window.resizeSeg=function(v){
    if(G.seciliTip!=='seg')return;
    edit(()=>{positive(v,1,1000000,'Duvar uzunluğu');const s=G.secili,a=getNode(s.n1),b=getNode(s.n2),L=_segLen(s);b.x=a.x+(b.x-a.x)*v/L;b.y=a.y+(b.y-a.y)*v/L;},{geometry:true});
  };
  window.upKapiTip=function(v){edit(()=>{const e=G.secili;e.kapiTip=v;if(v==='cift'&&e.en<120)e.en=140;const error=openingError(e);if(error)throw Error(error);});};
  window.topluKalinlikUygula=function(){
    const v=+$('topluK').value,target=$('topluH').value;
    const selected=G.seciliTip==='seg'?selSegList():[];
    if(target==='sec'&&!selected.length){toast('Önce bir veya daha fazla duvar seçin.',true);return;}
    if(edit(()=>{positive(v,.1,100,'Kalınlık');if(isPref()&&![6,10,15].includes(v))throw Error('Prefabrik kalınlığı 6, 10 veya 15 cm olmalı.');
      const list=(target==='sec'?selected:G.segs).filter(s=>s.tip!=='veranda'&&(target!=='dis'||s.dis)&&(target!=='ic'||!s.dis));
      list.forEach(s=>{s.k=v;if(isPref())s.kSabit=true;});
      if(isPref()&&['dis','ic','hepsi'].includes(target)){if(target!=='ic'){G.opt.dis=v;PF.DIS=v;}if(target!=='dis'){G.opt.ic=v;PF.IC=v;}}
    })){$('mbgK').classList.remove('open');optPanelGuncelle();}
  };
  window.splitSeg=function(s,id){
    const a=getNode(s.n1),m=getNode(id),L=_segLen(s),d=a&&m?dist(a.x,a.y,m.x,m.y):0;
    if(G.elemanlar.some(e=>e.segId===s.id&&d>e.t*L+.01&&d<e.t*L+e.en-.01))throw Error('Birleşim kapı/pencere boşluğuna denk geliyor. Duvarı açıklığın dışına taşıyın.');
    return original.splitSeg(s,id);
  };
  window.optUygula=function(k,v){if(typeof PlanProject.DEFAULT_OPTIONS[k]==='number')v=Number(v);edit(()=>{
    const proposed=state();proposed.opt[k]=v;PlanProject.validate(proposed);G.opt[k]=v;
    if(k==='h')$('katYuk').value=v;
    if(k==='ic'){PF.IC=v;G.segs.forEach(s=>{if(!s.dis&&s.tip!=='veranda')delete s.kSabit;});}
    if(k==='dis'){PF.DIS=v;G.segs.forEach(s=>{if(s.dis&&s.tip!=='veranda')delete s.kSabit;});}
  });optPanelGuncelle();};
  window.setSistem=function(v,silent){
    if(silent){original.setSistem(v,true);sync();return;}
    if(v===G.sistem)return;
    if(G.segs.length&&!confirm('Yapı sistemi değiştirilsin mi? Prefabrik modunda otomatik duvar kalınlıkları ve panel kuralları uygulanır. İşlemi geri alabilirsiniz.')){$('sistemSel').value=G.sistem;return;}
    pushH();original.setSistem(v,true);if(isPref())G.segs.forEach(s=>delete s.kSabit);detectRooms();updateSidebar();draw();
  };
  // Keep prefab snapping ahead of optional steel Ortho; never alter panel pitch.
  window.snapPoint=function(px,py){const p=original.snapPoint(px,py);if(G.ortho&&!isPref()&&G.drawing&&G.drawStart&&!G.altKey){const n=getNode(G.drawStart);if(n){if(Math.abs(p.x-n.x)>=Math.abs(p.y-n.y))p.y=n.y;else p.x=n.x;G.snapPt=p;if(G.snapNodeId){const t=getNode(G.snapNodeId);if(!t||Math.hypot(t.x-p.x,t.y-p.y)>.01){G.snapNodeId=null;G.snapType='lock';}}}}return p;};
  window.updateSidebar=function(){original.updateSidebar();if($('selectionEmpty'))$('selectionEmpty').hidden=!!G.secili;};
  window.setTool=function(t){original.setTool(t);clearOrphans();draw();};
  window.numUzunluk=function(sn,dir,v){
    if(!isPref()||G.inputUnit==='cm'||G.tool==='veranda')return{L:v,acik:fmtCm(v)+' cm aks'};
    if(window.Modular&&Modular.strict()){
      const axis=dir.y===0?'x':'y',sign=dir[axis]>=0?1:-1;
      const ref=Modular.reference(sn,axis),parallel=(axis==='x')===catiYatay();
      const base=ref===null?sn[axis]+(parallel?0:sign*(pfBasPay(sn,axis==='x')||G.defaultK/2)):ref;
      const end=Modular.cornerAxis(sn,axis,base+(Math.round((sn[axis]-base)/PF.YARIM)+sign*v*2)*PF.YARIM);
      return{L:Math.abs(end-sn[axis]),acik:fmtCm(v)+' modül · ortak aks; uç panel birleşim yüzünde kesilir'};
    }
    const yat=dir.y===0,parallel=catiYatay()?yat:!yat,s0=parallel?0:(pfBasPay(sn,yat)||G.defaultK/2),s1=parallel?0:G.defaultK/2;
    const L=v*PF.PANEL+s0+s1;
    return{L,acik:fmtCm(v)+' panel = '+fmtCm(L)+' cm aks'+(s0+s1?' (köşe payı '+fmtCm(s0)+'+'+fmtCm(s1)+')':'')};
  };
  window.numUygula=function(){
    const v=Number(G.numBuf.replace(',','.'));
    if(!Number.isFinite(v)||v<=0||v>1000000){toast('Pozitif bir uzunluk girin.',true);return;}
    if(isPref()&&G.inputUnit==='panel'&&G.tool!=='veranda'&&Math.abs(v*2-Math.round(v*2))>1e-7){toast('Panel adedini tam veya yarım girin: 4 ya da 4,5. Santimetre için giriş birimini değiştirin.',true);return;}
    const before=state(),h=G.hist.slice(),f=future.slice();
    try{original.numUygula();const errors=newErrors(before,state());if(errors.length)throw Error(errors[0].message);}
    catch(e){apply(before);G.hist=h;future=f;toast(e.message,true);}
  };
  window.updateStatus=function(){
    original.updateStatus();
    if(G.tool==='duvar')$('stbar').textContent='Duvar · Başlangıç ve bitişe tıkla · Sayı + Enter: '+(isPref()&&G.inputUnit==='panel'?'panel adedi (4 veya 4,5)':'santimetre')+' · Esc / sağ tık: bitir · Alt: serbest';
    if(G.tool==='veranda')$('stbar').textContent='Veranda · Sınırları tıklayarak çiz · Sayı + Enter: santimetre · Duvar metrajına dahil edilmez';
  };
  function sync(){
    $('emptyState').hidden=G.segs.length>0||G.tool!=='sec';
    $('zoomValue').textContent=Math.round(G.zoom*100)+'%';$('undoBtn').disabled=!G.hist.length;$('redoBtn').disabled=!future.length;
    $('snapG-btn').textContent='Izgara';$('snapW-btn').textContent='Yakalama';
    $('snapG-btn').classList.toggle('son',G.snapGrid);$('snapW-btn').classList.toggle('son',G.snapWall);
    $('orthoBtn').classList.toggle('son',G.ortho||isPref());$('orthoBtn').textContent=isPref()?'Dik · panel':'Dik çizim';
    $('canvasSystem').textContent=isPref()?'Prefabrik panel / Kat 01':'Hafif çelik / Kat 01';
    $('systemHint').textContent=isPref()?'Modül 125,5 / 62,75 cm':'Duvar aksı üzerinden çizim';
    $('systemDescription').textContent=isPref()?'Panel ölçüleri, H birleşimleri ve köşe payları birlikte çalışır.':'Duvar akslarını ve açıklıkları tanımlayın; metraj modelini oluşturun.';
    $('systemModules').innerHTML=isPref()?'<span>125,5 cm tam</span><span>62,75 cm yarım</span>':'<span>Duvar aksları</span><span>Özel kalınlık</span>';
    $('legendPanel').hidden=!isPref();
    if($('inputUnit')){$('inputUnit').hidden=!isPref();$('inputUnit').value=G.inputUnit;}
    $('pnlNoBtn').textContent='Panel no.';$('makasBtn').textContent='Makas';$('catiBtn').textContent=catiYatay()?'Makas →':'Makas ↓';$('olcuBtn').textContent=G.olcuModu==='aks'?'Sade ölçü':'Panel ölçüsü';
  }
  window.draw=function(){original.draw();if($('systemDescription')){sync();schedule();}};
  // Sharp canvas on high-DPI screens; all model interaction remains in CSS pixels.
  window.resize=function(){const dpr=Math.min(window.devicePixelRatio||1,3),w=cwrap.clientWidth,h=cwrap.clientHeight;cv.style.width=w+'px';cv.style.height=h+'px';cv.width=Math.round(w*dpr);cv.height=Math.round(h*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);draw();};
  new ResizeObserver(resize).observe(cwrap);
  window.drawBg=function(W,H){
    let g=G.gridCm*sc();while(g<12)g*=5;if(!Number.isFinite(g)||g<=0)return;
    ctx.fillStyle='#101b29';ctx.fillRect(0,0,W,H);
    if(!planVisible('grid'))return;
    ctx.strokeStyle='#1b2b3d';ctx.lineWidth=.6;
    for(let x=((G.pan.x%g)+g)%g;x<W;x+=g){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke();}
    for(let y=((G.pan.y%g)+g)%g;y<H;y+=g){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}
    const major=g*5;ctx.strokeStyle='#22354a';
    for(let x=((G.pan.x%major)+major)%major;x<W;x+=major){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke();}
    for(let y=((G.pan.y%major)+major)%major;y<H;y+=major){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}
  };
  function fit(){
    const points=G.nodes.concat(window.TextNotes?TextNotes.bounds():[]);
    if(!points.length){G.zoom=1;G.pan={x:100,y:80};draw();return;}
    const xs=points.map(n=>n.x),ys=points.map(n=>n.y),minX=Math.min(...xs),minY=Math.min(...ys),w=Math.max(100,Math.max(...xs)-minX),h=Math.max(100,Math.max(...ys)-minY);
    G.zoom=Math.max(.1,Math.min(5,Math.min((cwrap.clientWidth-180)/w,(cwrap.clientHeight-180)/h)/G.scale));
    G.pan={x:(cwrap.clientWidth-w*sc())/2-minX*sc(),y:(cwrap.clientHeight-h*sc())/2-minY*sc()};draw();
  }
  function issues(){
    const d=state(),list=PlanProject.analyze(d);
    if(isPref()&&G.segs.length){
      const A=pfAnaliz();
      A.runs.forEach(r=>{
        if(r.cfgHata)list.push({level:'error',code:'panel-config',message:'Özel panel dizilimi duvar hattına uymuyor.',id:r.owner?.id,type:'seg'});
        const custom=r.slots.filter(p=>p.tip==='ozel');
        if(custom.length)list.push({level:'warning',code:'custom-panel',message:custom.length+' özel kesim panel: '+custom.map(p=>fmtCm(p.w)+' cm').join(', '),id:r.owner?.id,type:'seg'});
      });
      A.bag.filter(b=>b.uyari||b.tip==='ozelB').forEach(()=>list.push({level:'warning',code:'joint',message:'Özel birleşim bulundu; bağlantı detayını kontrol edin.'}));
    }
    if(window.Prefab)list.push(...Prefab.issues());
    return list;
  }
  function refreshIssueCount(){const list=issues();$('issueCount').textContent=list.filter(i=>i.level!=='info').length;return list;}
  function analyze(){
    const list=refreshIssueCount(),axis=G.rooms.filter(r=>r.tip!=='veranda').reduce((s,r)=>s+r.area,0);
    const net=G.rooms.filter(r=>r.tip!=='veranda').reduce((s,r)=>s+(odaIcGeometri(r)?.alan||0),0);
    const walls=G.segs.filter(s=>s.tip!=='veranda').reduce((s,q)=>s+_segLen(q)/100,0);
    const fmt=x=>x.toLocaleString('tr-TR',{maximumFractionDigits:2});
    let html='<div class="analysis-summary"><div class="metric"><span>AKS ALANI</span><strong>'+fmt(axis)+' m²</strong></div><div class="metric"><span>İÇ YÜZ ALANI¹</span><strong>'+fmt(net)+' m²</strong></div><div class="metric"><span>DUVAR UZUNLUĞU</span><strong>'+fmt(walls)+' m</strong></div><div class="metric"><span>AÇIKLIK</span><strong>'+G.elemanlar.length+' adet</strong></div></div>';
    html+='<p class="analysis-note">¹ Duvar iç yüzlerinden hesaplanır. İç içe bağımsız konturlar ve serbest iç duvarlarda ayrıca kontrol edin.</p><div class="analysis-heading">'+list.length+' kontrol notu</div>';
    if(!list.length)html+='<div class="issue-card success">'+(G.segs.length?'Geometrik kontrolde sorun bulunmadı.':'Çizime başladığınızda kontrol sonuçları burada görünür.')+'</div>';
    list.sort((a,b)=>({error:0,warning:1,info:2}[a.level]-{error:0,warning:1,info:2}[b.level]));
    list.forEach((item,i)=>{html+='<button class="issue-card '+item.level+'" data-issue="'+i+'">'+esc(item.message)+(item.id?'<small>'+esc(item.id)+' · Nesneyi seçmek için tıklayın</small>':'')+'</button>';});
    $('analysisResults').innerHTML=html;
    $('analysisResults').querySelectorAll('[data-issue]').forEach(b=>b.onclick=()=>{const it=list[+b.dataset.issue];if(!it.id)return;G.secili=({seg:G.segs,node:G.nodes,eleman:G.elemanlar}[it.type]||[]).find(o=>o.id===it.id)||null;G.seciliTip=G.secili?it.type:null;G.selSegs=it.type==='seg'?[it.id]:[];updateSidebar();draw();});
    lastAnalysis=snapshot();return list;
  }
  function tab(name){activeTab=name;$('propertiesPane').hidden=name!=='properties';$('analysisPane').hidden=name!=='analysis';$('propertiesTab').classList.toggle('active',name==='properties');$('analysisTab').classList.toggle('active',name==='analysis');if(name==='analysis')analyze();}
  function demo(){
    if(G.segs.length&&!confirm('Örnek plan mevcut çalışmanın yerini alacak. Devam edilsin mi?'))return;
    const n=[{id:'e1',x:0,y:0},{id:'e2',x:753,y:0},{id:'e3',x:753,y:512},{id:'e4',x:0,y:512},{id:'e5',x:376.5,y:0},{id:'e6',x:376.5,y:512},{id:'e7',x:753,y:256},{id:'e8',x:376.5,y:256}];
    const pairs=[[1,5],[5,2],[2,7],[7,3],[3,6],[6,4],[4,1],[5,8],[8,6],[8,7]];
    const s=pairs.map(([a,b],i)=>({id:'e'+(20+i),n1:'e'+a,n2:'e'+b,k:i<7?10:6,elemanlar:[]}));
    loadProject({v:'5',sistem:G.sistem,n,s,e:[],r:[],ky:280,dy:320,fire:10,catiYon:'yatay',projectName:'Örnek · 3 mekânlı plan',opt:clone(PlanProject.DEFAULT_OPTIONS)});
    G.rooms.forEach((r,i)=>{r.tip=['salon','yatak','banyo'][i]||'';});
    // Place openings through the production positioning function so panel rules apply.
    for(const [segId,type,en,t] of [['e20','pencere',110,.35],['e26','kapi',90,.65],['e22','pencere',90,.2]]){
      const e={id:uid(),tip_:type,segId,en,yuk:type==='kapi'?210:120,t,ad:type==='kapi'?'Giriş kapısı':'Pencere',yan:1,mentese:'a',kapiTip:'dis'};
      G.elemanlar.push(e);elemanKonumla(e,getSeg(segId),t*_segLen(getSeg(segId)),G.elStep);
    }
    detectRooms();fileSnapshot='';draw();fit();toast('Örnek plan açıldı. Ölçüleri ve yapı sistemini değiştirebilirsiniz.');
  }
  window.hafifCeligeAktar=function(){
    if(!G.segs.length){toast('Önce plan çizin.',true);return;}
    const errors=issues().filter(i=>i.level==='error');if(errors.length){tab('analysis');toast('Aktarmadan önce '+errors.length+' model hatasını düzeltin.',true);return;}
    if(isPref()&&!confirm('Prefabrik plan hafif çelik metraj formatına aktarılacak. Devam edilsin mi?'))return;
    original.hafifCeligeAktar();
  };
  // A gesture is a transaction: invalid intersections roll back, not half-apply.
  cv.addEventListener('mousedown',e=>{if(e.button===0)gesture={before:state(),history:G.hist.slice(),future:future.slice()};},true);
  document.addEventListener('keydown',e=>{
    if(e.key!=='Escape'||!gesture||!G.dragging)return;
    const g=gesture;gesture=null;apply(g.before);G.hist=g.history;future=g.future;
    e.preventDefault();e.stopImmediatePropagation();
  },true);
  window.addEventListener('blur',()=>{if(G.dragging)window.dispatchEvent(new MouseEvent('mouseup',{button:0}));});
  cv.addEventListener('contextmenu',()=>{clearOrphans();draw();});
  window.addEventListener('mouseup',()=>{
    if(!gesture)return;const g=gesture;gesture=null;
    const introduced=newErrors(g.before,state());if(introduced.length){apply(g.before);G.hist=g.history;future=g.future;toast(introduced[0].message,true);}else draw();
  });
  window.addEventListener('error',e=>{
    if(!gesture)return;
    const reason=G.drawRejectReason||e.error?.message,g=gesture;gesture=null;apply(g.before);G.hist=g.history;future=g.future;toast(reason||'Çizim işlemi tamamlanamadı; önceki durum korundu.',true);e.preventDefault();
  });
  document.addEventListener('keydown',e=>{
    const typing=['INPUT','TEXTAREA','SELECT'].includes(e.target.tagName),key=e.key.toLowerCase(),mod=e.ctrlKey||e.metaKey;
    if(mod&&key==='s'){e.preventDefault();e.stopImmediatePropagation();planKaydet();return;}
    if(document.querySelector('.mbg.open')){if(e.key==='Escape'){document.querySelectorAll('.mbg.open').forEach(m=>m.classList.remove('open'));e.preventDefault();}if(!typing)e.stopImmediatePropagation();return;}
    if(typing)return;
    if(mod&&(key==='y'||key==='z'&&e.shiftKey)){e.preventDefault();e.stopImmediatePropagation();ileriAl();return;}
    if(mod&&key==='z'){e.preventDefault();e.stopImmediatePropagation();geriAl();return;}
    if(e.key==='Home'){e.preventDefault();fit();}
    if(e.key==='F8'){e.preventDefault();Studio.ortho();}
    if(e.key==='F3'){e.preventDefault();toggleSnapW();draw();}
    if(e.key==='Escape')setTimeout(()=>{clearOrphans();draw();},0);
  },true);
  window.addEventListener('blur',()=>{G.altKey=false;G.shiftLock=false;G.lockAxis=null;G.panning=false;$('lockInd').style.display='none';$('shiftLbl').textContent='';});
  window.addEventListener('beforeunload',e=>{if(G.segs.length&&snapshot()!==lastStored&&snapshot()!==fileSnapshot){e.preventDefault();e.returnValue='';}});
  window.Studio={applyTransaction(input){const d=PlanProject.validate(input);return edit(()=>apply(d),{preserveLayout:true});},state,snapshot,loadProject,analyze,issues,fit,tab,demo,openingError,edit,toast,
    rename(value){pushH();projectName=value.trim()||'Yeni proje';$('projectName').value=projectName;schedule();},
    projectField(key,value){const number=Number(value);edit(()=>{positive(number,key==='fire'?0:50,key==='fire'?100:2000,key==='fire'?'Fire oranı':'Yükseklik');if(key==='fire'){ALCI.FIRE=number;$('fireYuzde').value=number;}else{$(key).value=number;if(key==='katYuk')G.opt.h=number;}});optPanelGuncelle();},
    zoom(dir){const f=dir>0?1.2:1/1.2,z=Math.max(.1,Math.min(10,G.zoom*f)),x=cwrap.clientWidth/2,y=cwrap.clientHeight/2;G.pan.x=x-(x-G.pan.x)*z/G.zoom;G.pan.y=y-(y-G.pan.y)*z/G.zoom;G.zoom=z;draw();},
    ortho(){if(isPref()){toast('Prefabrik duvarlar dik çizilir. Alt basılıyken serbest çizim kullanılabilir.');return;}G.ortho=!G.ortho;draw();},
    recover(){if(!pendingRecovery)return;try{loadProject(pendingRecovery.project);fileSnapshot='';toast('Yerel çalışma geri getirildi.');pendingRecovery=null;}catch(e){toast('Yedek açılamadı: '+e.message,true);}},
    dismissRecovery(){storageReady=true;pendingRecovery=null;$('recoveryBanner').hidden=true;lastStored=snapshot();},
    flush:persist
  };
  // Retain all original production controls; move only their presentation containers.
  const card=document.createElement('div');card.className='system-card';card.innerHTML='<span class="eyebrow">YAPI SİSTEMİ</span><select id="sistemSel" class="ss" aria-label="Yapı sistemi" onchange="setSistem(this.value)"><option value="celik">Hafif çelik</option><option value="prefabrik">Prefabrik panel</option></select><p id="systemDescription"></p><div class="module-pills" id="systemModules"></div>';
  $('projectSidebar').prepend(card);$('selectionHost').append($('sbSel'));
  const unit=document.createElement('select');unit.id='inputUnit';unit.className='ss';unit.title='Sayısal çizim giriş birimi';unit.setAttribute('aria-label','Çizim giriş birimi');unit.innerHTML='<option value="panel">Giriş: panel</option><option value="cm">Giriş: cm</option>';unit.onchange=()=>{G.inputUnit=unit.value;updateStatus();draw();};$('systemHint').before(unit);
  $('katYuk').addEventListener('focus',()=>{$('katYuk').dataset.before=$('katYuk').value;});
  $('disYuk').addEventListener('focus',()=>{$('disYuk').dataset.before=$('disYuk').value;});
  for(const id of ['katYuk','disYuk'])$(id).addEventListener('change',()=>{const value=$(id).value;$(id).value=$(id).dataset.before||(id==='katYuk'?G.opt.h:320);Studio.projectField(id,value);});
  document.querySelectorAll('.mbg').forEach(m=>{m.setAttribute('role','dialog');m.setAttribute('aria-modal','true');m.addEventListener('click',e=>{if(e.target===m)m.classList.remove('open');});});
  try{const saved=localStorage.getItem(STORAGE);if(saved){const parsed=JSON.parse(saved);PlanProject.validate(parsed.project);if(parsed.project.s.length){pendingRecovery=parsed;storageReady=false;$('recoveryBanner').hidden=false;}}}catch{ /* Invalid backups never prevent a clean start. */ }
  original.setSistem('celik',true);updateSidebar();sync();resize();lastStored=snapshot();
})();
