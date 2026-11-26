/* Projection only: consume the existing roof calculations without adding a recipe. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.LoadingRoofBridge=api;})(globalThis,function(){
 'use strict';
 const number=n=>Math.round(n*1000)/1000;
 function append(base,data,config,core){
  const groups=new Map(),cfg=core.validate(config),zones=new Map(data.zones.map(z=>[z.id,z]));
  function add(name,size,unit,amount,source,reason){
   if(!Number.isFinite(amount)||amount<=0)return;
   const key=JSON.stringify(['Çatı',name,size]);
   if(!groups.has(key))groups.set(key,{key,group:'Çatı',name,size,unit,calculated:0,sources:[],warning:reason,reason});
   const row=groups.get(key);row.calculated+=amount;row.sources.push(source);
  }
  const source=(id,extra)=>({id,segIds:[],point:null,...extra});
  for(const c of data.model.cutList||[]){
   const material=data.model.materials.find(m=>m.id===c.material),zone=zones.get(c.zoneId);
   add((material?.name||c.material)+' — kesim taslağı',`${zone?.name||c.name} · ${number(c.width*10)} × ${number(c.length*10)} mm`,'adet',c.quantity??1,
    source('roof-cut:'+c.zoneId+':'+c.face+':'+c.strip+':'+c.part,{roofTransfer:'cut',cut:c}),
    'Mevcut çatı kesim listesinden aynen aktarıldı. Kesim parçası sipariş/stok levhası değildir. Stok boyuna dönüşüm ve imalat kontrolü bekliyor; sevk adedi otomatik verilmedi.');
  }
  for(const m of data.model.totals||[])if(!data.model.cutList.some(c=>c.material===m.material||c.material===m.id)){
   // Package/area products are already calculated by RoofCore; retain their units.
   if(m.unit==='package')add((m.name||m.material)+' — paket hesabı','Mevcut çatı metrajı','paket',m.packages,source('roof-total:'+(m.material||m.id||m.name),{roofTransfer:'cover-total',total:m}),'Mevcut çatı paket hesabı; sevk/sipariş teyidi bekliyor.');
  }
  for(const f of data.frames||[]){const z=zones.get(f.zoneId);if(!z)continue;
   add('Makas — yerleşim',`${z.name} · mesnet açıklığı ${number(Math.hypot(f.q.x-f.p.x,f.q.y-f.p.y)*10)} mm`,'adet',1,
    source('roof-frame:'+f.zoneId+':'+JSON.stringify([f.p,f.q]),{roofTransfer:'frame',frame:f}),
    'Mevcut makas yerleşiminden aktarıldı. Mesnet açıklığı imalat makas boyu değildir. Baş/orta makas sınıfı, imalat ölçüsü ve mesnet uygunluğu teyit bekliyor; sevk adedi verilmedi.');
  }
  for(const [kind,name] of [['ridge','Düz mahya — net uzunluk'],['hip','Eğik mahya — net uzunluk']]){
   const edges=(data.model.edges||[]).filter(e=>e.type===kind);
   add(name,'Net m · stok boyu / bindirme bekliyor','m',data.model.lengths[kind]||0,
    source('roof-edge:'+kind,{roofTransfer:'edge',kind,edges,length:data.model.lengths[kind]||0}),
    'Mevcut çatı kenar hesabındaki net uzunluk aktarıldı. Stok boyu, bindirme ve yedek kuralı tanımlanmadan sevk adedine çevrilmedi.');
  }
  for(const l of data.model.layerTotals||[])add(l.name+' — alt katman',`${l.zoneName} · ${number(l.width*10)} × ${number(l.length*10)} mm`,l.unit,l.quantity,
   source('roof-layer:'+l.zoneId+':'+l.layer,{roofTransfer:'layer',layer:l}),
   'Mevcut alt katman metrajı fire dahil aynen aktarıldı; ikinci kez fire veya yedek eklenmedi. Sipariş teyidi bekliyor.');
  const extra=[...groups.values()].map(r=>{
   r.calculated=number(r.calculated);r.basis=core.fingerprint(JSON.stringify(r.sources));
   const a=cfg.adjustments.find(a=>a.key===r.key);r.stale=!!a&&a.basis!==r.basis;
   return {...r,qty:a&&!r.stale?a.qty:null,spare:0,referenceId:a?.referenceId||'',status:r.stale?'Çizim değişti':a?'Manuel doğrulandı':'Çatı hesabı · sevk kuralı bekliyor',reason:a?.reason||r.reason};
  });
  return {...base,rows:[...base.rows,...extra],orphan:base.orphan.filter(a=>!groups.has(a.key))};
 }
 return {append};
});
