/* Project schema and geometry checks. Shared by the browser and Node tests. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.PlanProject=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const DEFAULT_OPTIONS={h:280,dis:10,ic:6,alciDuvar:'yok',cephe:'yok',plaka:'40x250',bindirme:3,cepheFire:5,cati:'besik',egim:33,sacak:30,trapezEn:100,kaplama:'trapez',osb:false,catiFire:5,suRulo:75,suBindirme:10,parcaBoy:200,parcaBind:10,vidaM2:5,inisAralik:10,aksAcik:false};
  const fail=message=>{throw new Error(message);};
  const finite=(x,min,max)=>typeof x==='number'&&Number.isFinite(x)&&x>=min&&x<=max;
  function safeTree(o,depth=0){
    if(depth>24)fail('Dosya iç içe veri sınırını aşıyor.');
    if(typeof o==='number'&&!Number.isFinite(o))fail('Dosyada geçersiz sayı var.');
    if(typeof o==='string'&&o.length>10000)fail('Dosyada aşırı uzun bir metin var.');
    if(o&&typeof o==='object')for(const k of Object.keys(o)){
      if(['__proto__','prototype','constructor'].includes(k))fail('Desteklenmeyen veri anahtarı.');
      safeTree(o[k],depth+1);
    }
  }
  function validate(input){
    if(!input||typeof input!=='object'||Array.isArray(input))fail('Geçerli bir proje nesnesi bulunamadı.');
    safeTree(input);
    if(!['5','5.1'].includes(String(input.v)))fail('Desteklenen dosya sürümleri: v5 ve v5.1.');
    const d=JSON.parse(JSON.stringify(input));
    if(d.sistem&&!['celik','prefabrik'].includes(d.sistem))fail('Bilinmeyen yapı sistemi.');
    d.sistem=d.sistem||'celik';
    for(const k of ['n','s','e','r','fixtures']){
      if(d[k]===undefined)d[k]=[];
      if(!Array.isArray(d[k])||d[k].length>20000)fail('Geçersiz veya aşırı büyük nesne listesi: '+k);
    }
    const all=new Set();
    for(const o of [...d.n,...d.s,...d.e,...d.r,...d.fixtures]){
      if(!o||typeof o!=='object'||typeof o.id!=='string'||!/^[-a-zA-Z0-9_]{1,80}$/.test(o.id))fail('Geçersiz nesne kimliği.');
      if(all.has(o.id))fail('Tekrarlanan nesne kimliği: '+o.id);all.add(o.id);
    }
    const nodes=new Map(d.n.map(n=>[n.id,n])),segs=new Map(d.s.map(s=>[s.id,s]));
    for(const n of d.n)if(!finite(n.x,-10000000,10000000)||!finite(n.y,-10000000,10000000))fail('Geçersiz düğüm koordinatı: '+n.id);
    for(const s of d.s){
      if(!nodes.has(s.n1)||!nodes.has(s.n2)||s.n1===s.n2)fail('Duvar uçları geçersiz: '+s.id);
      if(!finite(s.k,0.1,100))fail('Duvar kalınlığı 0,1–100 cm aralığında olmalı: '+s.id);
      if(length(s,nodes)<0.01)fail('Sıfır uzunluklu duvar: '+s.id);
      if(s.tip&&s.tip!=='veranda')fail('Bilinmeyen duvar türü: '+s.id);
      if(s.dimGizle&&!Array.isArray(s.dimGizle))fail('Ölçü listesi geçersiz.');
      if(s.pnlCfg!==undefined){
        if(!s.pnlCfg||typeof s.pnlCfg!=='object'||Array.isArray(s.pnlCfg))fail('Panel dizilimi geçersiz.');
        if(s.pnlCfg.dizi!==undefined&&(!Array.isArray(s.pnlCfg.dizi)||s.pnlCfg.dizi.some(w=>!finite(w,.1,10000))))fail('Özel panel ölçüleri geçersiz.');
      }
    }
    for(const e of d.e){
      if(!segs.has(e.segId))fail('Açıklığın duvarı bulunamadı: '+e.id);
      if(!['kapi','pencere'].includes(e.tip_))fail('Açıklık türü geçersiz: '+e.id);
      if(!finite(e.en,1,5000)||!finite(e.yuk,1,5000)||!finite(e.t,0,1))fail('Açıklık ölçüsü veya konumu geçersiz: '+e.id);
      if(e.ad!==undefined&&typeof e.ad!=='string')fail('Açıklık adı metin olmalı.');
    }
    for(const f of d.fixtures){
      if(!['wallwc','wc','basin','vanity','shower','washer'].includes(f.kind)||!finite(f.x,-1e7,1e7)||!finite(f.y,-1e7,1e7)||!finite(f.w,1,500)||!finite(f.d,1,500)||!finite(f.angle,0,359)||typeof f.mirror!=='boolean')fail('Vitrifiye ölçüsü veya konumu geçersiz.');
    }
    for(const r of d.r){
      if(!Array.isArray(r.nodeIds)||r.nodeIds.some(id=>!nodes.has(id)))fail('Oda düğümleri geçersiz.');
      for(const k of ['ad','ozelAd','tip','sig'])if(r[k]!=null&&typeof r[k]!=='string')fail('Oda bilgisi geçersiz: '+k);
    }
    for(const k of ['ky','dy']){d[k]=Number(d[k]??(k==='ky'?280:320));if(!finite(d[k],50,2000))fail('Kat yüksekliği 50–2000 cm aralığında olmalı.');}
    d.fire=Number(d.fire??10);if(!finite(d.fire,0,100))fail('Fire oranı 0–100 aralığında olmalı.');
    if(d.opt!==undefined&&(!d.opt||typeof d.opt!=='object'||Array.isArray(d.opt)))fail('Proje seçenekleri geçersiz.');
    d.opt=Object.assign({},DEFAULT_OPTIONS,d.opt||{});
    for(const [k,v] of Object.entries(DEFAULT_OPTIONS)){
      if(typeof v==='number'&&typeof d.opt[k]==='string'&&d.opt[k].trim())d.opt[k]=Number(d.opt[k]);
      if(typeof d.opt[k]!==typeof v)fail('Geçersiz seçenek: '+k);
      if(typeof v==='number'&&!finite(d.opt[k],0,10000))fail('Geçersiz seçenek değeri: '+k);
    }
    if(![6,10,15].includes(d.opt.ic)||![6,10,15].includes(d.opt.dis))fail('Prefabrik iç ve dış duvar kalınlığı 6, 10 veya 15 cm olmalı.');
    for(const [key,values] of Object.entries({alciDuvar:['yok','hepsi','secili'],cephe:['yok','tasonit','yalipan'],cati:['besik','kirma','tek','yok'],kaplama:['trapez','sandvic']}))if(!values.includes(d.opt[key]))fail('Geçersiz üretim seçeneği: '+key);
    if(d.opt.h<50||d.opt.trapezEn<=0||d.opt.suRulo<=0||d.opt.parcaBoy<=0||d.opt.inisAralik<=0)fail('Üretim ölçüleri sıfırdan büyük olmalı.');
    if(d.catiYon&&!['yatay','dikey'].includes(d.catiYon))fail('Makas yönü geçersiz.');
    d.catiYon=d.catiYon||'yatay';
    d.projectName=typeof d.projectName==='string'?d.projectName.slice(0,100):'İçe aktarılan proje';
    const settings=d.settings||{};d.settings={};
    if(settings.viewFilters&&typeof settings.viewFilters==='object'){
      d.settings.viewFilters={};
      for(const k of ['architecturalDims','openingNames','grid','rooms','openings','outerDims','innerDims','chains','panelColors','panelJoints','connections'])if(typeof settings.viewFilters[k]==='boolean')d.settings.viewFilters[k]=settings.viewFilters[k];
    }
    if(['mixed','full','half','exception'].includes(settings.panelDrawMode))d.settings.panelDrawMode=settings.panelDrawMode;
    if(settings.trussOverrides!==undefined){
      if(!Array.isArray(settings.trussOverrides)||settings.trussOverrides.length>2000)fail('Geçersiz makas konumları.');
      d.settings.trussOverrides=settings.trussOverrides.map(e=>{if(!e||!d.n.some(n=>n.id===e.nodeId)||!['x','y'].includes(e.axis)||!finite(e.from,-1e7,1e7)||!finite(e.to,-1e7,1e7))fail('Geçersiz elle makas konumu.');if(e.zoneId!==undefined&&(typeof e.zoneId!=='string'||!/^[-a-zA-Z0-9_]{1,80}$/.test(e.zoneId)))fail('Geçersiz makas çatı bölümü.');return {nodeId:e.nodeId,axis:e.axis,from:e.from,to:e.to,...(e.zoneId?{zoneId:e.zoneId}:{})};});
    }
    for(const k of ['snapGrid','snapWall','pnlEtiket','makasGoster','ortho','panelSync','moveAlign','moveModule','moduleAxisSnap'])if(typeof settings[k]==='boolean')d.settings[k]=settings[k];
    if(settings.snapTargets&&typeof settings.snapTargets==='object'){d.settings.snapTargets={};for(const k of ['h','mid','end','node','nearest'])if(typeof settings.snapTargets[k]==='boolean')d.settings.snapTargets[k]=settings.snapTargets[k];}
    for(const k of ['gridCm','defaultK','elStep','freeSnapStep'])if(finite(settings[k],0.1,1000))d.settings[k]=settings[k];
    if(['wall','panel'].includes(settings.selectionMode))d.settings.selectionMode=settings.selectionMode;
    for(const [k,values] of Object.entries({olcuModu:['aks','panel'],duvarYakala:['h','kilit','serbest','custom'],inputUnit:['cm','panel']}))if(values.includes(settings[k]))d.settings[k]=settings[k];
    d.roofs=d.roofs||[];d.roofMaterials=d.roofMaterials||[];
    const roofCore=typeof RoofCore!=='undefined'?RoofCore:(typeof require==='function'?require('./roof-core.js'):null);
    if(roofCore)roofCore.validate(d.roofs,d.roofMaterials);
    return d;
  }
  function length(s,nodes){const a=nodes.get(s.n1),b=nodes.get(s.n2);return a&&b?Math.hypot(a.x-b.x,a.y-b.y):0;}
  function analyze(d){
    const issues=[],nodes=new Map(d.n.map(n=>[n.id,n])),degree=new Map(),segs=new Map(d.s.map(s=>[s.id,s]));
    const add=(level,code,message,id,type)=>issues.push({level,code,message,id,type});
    const pair=new Set();
    for(const s of d.s){
      const a=nodes.get(s.n1),b=nodes.get(s.n2);if(!a||!b){add('error','reference','Duvarın uç düğümü eksik.',s.id,'seg');continue;}
      degree.set(s.n1,(degree.get(s.n1)||0)+1);degree.set(s.n2,(degree.get(s.n2)||0)+1);
      const key=[s.n1,s.n2].sort().join('|');if(pair.has(key))add('error','duplicate','Aynı konumda tekrarlanan duvar.',s.id,'seg');pair.add(key);
      if(length(s,nodes)<1)add('error','short','Duvar uzunluğu 1 cm altında.',s.id,'seg');
      if(d.sistem==='prefabrik'&&s.tip!=='veranda'){
        if(Math.abs(a.x-b.x)>0.1&&Math.abs(a.y-b.y)>0.1)add('warning','diagonal','Eğik prefabrik duvar: panel ve birleşim detayını kontrol edin.',s.id,'seg');
        if(![6,10,15].includes(s.k))add('warning','thickness','Standart dışı prefabrik duvar kalınlığı: '+s.k+' cm.',s.id,'seg');
      }
    }
    for(const [id,count] of degree)if(count===1)add('info','open-end','Serbest duvar ucu; oda sınırı amaçlanıyorsa kapatın.',id,'node');
    for(const e of d.e){
      const s=segs.get(e.segId);if(!s)continue;
      const L=length(s,nodes),start=e.t*L,end=start+e.en;
      if(s.tip==='veranda')add('error','veranda-opening','Veranda sınırı kapı veya pencere taşıyamaz.',e.id,'eleman');
      if(start<-.01||end>L+.01)add('error','overflow','Açıklık duvarın dışına taşıyor.',e.id,'eleman');
      if(e.yuk>d.ky)add('error','height','Açıklık yüksekliği kat yüksekliğini aşıyor.',e.id,'eleman');
      for(const o of d.e){
        if(e.id>=o.id||e.segId!==o.segId)continue;
        if(Math.min(end,o.t*L+o.en)-Math.max(start,o.t*L)>.01)add('error','overlap','Aynı duvardaki kapı/pencere boşlukları çakışıyor.',e.id,'eleman');
      }
    }
    if(d.s.length&&!d.r.length)add('warning','no-room','Henüz kapalı oda yok. Duvar uçlarını ve birleşimleri kontrol edin.');
    return issues;
  }
  function architecturalSummary(rooms){
    const groups=[['salon','Salon'],['salon_mutfak','Salon + mutfak'],['mutfak','Mutfak'],['yatak','Yatak odası'],['oturma','Oturma odası'],['banyo','Banyo'],['wc','WC / tuvalet'],['hol','Hol / koridor'],['giris','Giriş'],['depo','Depo / kiler'],['garaj','Garaj'],['veranda','Veranda'],['unknown','Türü seçilmemiş mekân']];
    const counts={},known=new Set(groups.map(g=>g[0]));let closedArea=0,verandaArea=0;
    rooms.forEach(r=>{let type=r.tip;if(['cocuk','ebeveyn'].includes(type))type='yatak';if(type==='ebanyo')type='banyo';if(!known.has(type))type='unknown';counts[type]=(counts[type]||0)+1;const area=Number.isFinite(r.area)?r.area:0;if(type==='veranda')verandaArea+=area;else closedArea+=area;});
    const bedrooms=counts.yatak||0,living=(counts.salon||0)+(counts.salon_mutfak||0),unknown=counts.unknown||0;
    return {bedrooms,living,unknown,type:bedrooms||living?bedrooms+'+'+living:null,closedArea,verandaArea,items:groups.filter(([key])=>counts[key]).map(([key,label])=>({key,label,count:counts[key]}))};
  }
  return {DEFAULT_OPTIONS,validate,analyze,length,architecturalSummary};
});
