/* Projection only: consume the existing roof calculations without adding a recipe. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.LoadingRoofBridge=api;})(globalThis,function(){
 'use strict';
 const number=n=>Math.round(n*1000)/1000;
 // Physical ridge lines, in mm. Topology splits are not separate stock orders.
 function ridgeStock(edges,stockMm=2800,lapMm=200){
  if(!(stockMm>lapMm&&lapMm>=0))throw Error('Geçersiz mahya stok/bindirme boyu');
  const lines=[];
  for(const e of edges){
   const a=['x','y','z'].map(k=>e.p?.[k]*10),b=['x','y','z'].map(k=>e.q?.[k]*10);
   if(![...a,...b].every(Number.isFinite))return null;
   const v=b.map((x,i)=>x-a[i]),length=Math.hypot(...v);if(length<.001)continue;
   const u=v.map(x=>x/length);let line=lines.find(l=>{
    const dot=u.reduce((s,x,i)=>s+x*l.u[i],0),w=a.map((x,i)=>x-l.o[i]),t=w.reduce((s,x,i)=>s+x*l.u[i],0);
    return Math.abs(Math.abs(dot)-1)<1e-8&&Math.hypot(...w.map((x,i)=>x-t*l.u[i]))<.01;
   });
   if(!line){line={o:a,u,intervals:[]};lines.push(line);}
   const ts=[a,b].map(p=>p.reduce((s,x,i)=>s+(x-line.o[i])*line.u[i],0));
   line.intervals.push({lo:Math.min(...ts),hi:Math.max(...ts),zones:[e.zoneId]});
  }
  const runs=[];
  for(const l of lines){const merged=[];
   for(const r of l.intervals.sort((a,b)=>a.lo-b.lo)){const last=merged.at(-1);
    if(last&&r.lo<=last.hi+.01){last.hi=Math.max(last.hi,r.hi);last.zones.push(...r.zones);}else merged.push({...r});
   }
   for(const r of merged){const lengthMm=r.hi-r.lo,qty=Math.max(1,Math.ceil((lengthMm-lapMm-1e-7)/(stockMm-lapMm)));
    runs.push({lengthMm,qty,zoneIds:[...new Set(r.zones)].sort(),p:l.o.map((x,i)=>x+r.lo*l.u[i]),q:l.o.map((x,i)=>x+r.hi*l.u[i])});
   }
  }
  return {rule:'ridge2800-lap200-v1',stockMm,lapMm,spare:0,runs,qty:runs.reduce((s,r)=>s+r.qty,0),netMm:runs.reduce((s,r)=>s+r.lengthMm,0)};
 }
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
   add((f.trussKind==='head'?'Baş makas':f.trussKind==='middle'?'Orta makas':'Makas')+' — yerleşim',`${z.name} · mesnet açıklığı ${number(Math.hypot(f.q.x-f.p.x,f.q.y-f.p.y)*10)} mm`,'adet',1,
    source('roof-frame:'+f.zoneId+':'+JSON.stringify([f.p,f.q]),{roofTransfer:'frame',frame:f}),
    'Mevcut makas yerleşiminden aktarıldı. Çatı sınırındaki uçlar, veranda birleşim ucu dahil baş makastır; aradakiler orta makastır. Mesnet açıklığı imalat makas boyu değildir. İmalat ölçüsü ve mesnet uygunluğu teyit bekliyor; sevk adedi verilmedi.');
  }
  for(const [kind,name] of [['ridge','Düz mahya — net uzunluk'],['hip','Eğik mahya — net uzunluk']]){
   const edges=(data.model.edges||[]).filter(e=>e.type===kind);
   const stock=kind==='ridge'&&edges.length?ridgeStock(edges):null;
   if(stock&&stock.qty>0&&Math.abs(stock.netMm/1000-data.model.lengths[kind])<.001){
    const explanation=stock.runs.map(r=>`${r.zoneIds.map(id=>zones.get(id)?.name||id).join(' / ')}: ${number(r.lengthMm)} mm → ${r.qty} adet`).join('; ');
    add('Düz mahya','2800 mm','adet',stock.qty,source('roof-ridge-stock',{roofTransfer:'ridge-stock',ridgeStock:stock}),
     '2800 mm stok, her ekte en az 200 mm bindirme. Sürekli hatlar birleştirilir, ayrı hatlar ayrı yuvarlanır; ayrıca yedek eklenmez. '+explanation);
    continue;
   }
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
   const automatic=r.sources.every(s=>s.roofTransfer==='ridge-stock');
   return {...r,qty:a?(r.stale?null:a.qty):automatic?r.calculated:null,spare:0,referenceId:a?.referenceId||'',status:r.stale?'Çizim değişti':a?'Manuel doğrulandı':automatic?'Otomatik düz mahya':'Çatı hesabı · sevk kuralı bekliyor',reason:a?.reason||r.reason};
  });
  return {...base,rows:[...base.rows,...extra],orphan:base.orphan.filter(a=>!groups.has(a.key))};
 }
 return {append,ridgeStock};
});
