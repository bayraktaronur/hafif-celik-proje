/* Draft loading list: geometric counts and explicit, revision-bound decisions. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.LoadingCore=api;})(globalThis,function(){
 'use strict';
 function validate(value){const c=value??{adjustments:[],manual:[]};if(!c||typeof c!=='object'||Array.isArray(c))throw Error('Yükleme listesi geçersiz.');
  if(c.showLabels!==undefined&&typeof c.showLabels!=='boolean')throw Error('H etiket seçimi geçersiz.');
  for(const k of ['adjustments','manual'])if(!Array.isArray(c[k])||c[k].length>1000)throw Error('Yükleme satırları geçersiz.');
  const text=(s,max)=>typeof s==='string'&&s.length<=max,qty=n=>typeof n==='number'&&Number.isFinite(n)&&n>=0&&n<=1000000;
  for(const a of c.adjustments)if(!text(a.key,300)||!text(a.basis,80)||!qty(a.qty)||!Number.isInteger(a.qty)||!text(a.reason,500)||!a.reason.trim()||!text(a.referenceId,80))throw Error('Yükleme düzeltmesi için miktar ve gerekçe gerekli.');
  for(const a of c.adjustments)if(a.postLengthMm!==undefined&&(!Number.isFinite(a.postLengthMm)||a.postLengthMm<=0||a.postLengthMm>100000))throw Error('Direk boyu geçersiz.');
  for(const a of c.manual)if(!text(a.id,80)||!text(a.name,160)||!a.name.trim()||!text(a.size,160)||!['adet','m','m²','kg','takım','kutu'].includes(a.unit)||!qty(a.qty)||(['adet','takım','kutu'].includes(a.unit)&&!Number.isInteger(a.qty))||!text(a.reason,500)||!a.reason.trim())throw Error('Manuel malzeme satırı geçersiz.');
  for(const [k,id] of [['adjustments','key'],['manual','id']])if(new Set(c[k].map(a=>a[id])).size!==c[k].length)throw Error('Tekrarlanan yükleme satırı.');return JSON.parse(JSON.stringify(c));
 }
 function fingerprint(s){let a=2166136261,b=5381;for(let i=0;i<s.length;i++){a=Math.imul(a^s.charCodeAt(i),16777619);b=Math.imul(b,33)^s.charCodeAt(i);}return (a>>>0).toString(16)+'-'+(b>>>0).toString(16);}
 // Feasible first-fit-decreasing cutting plan; never promises a globally minimal solution.
 function stockWidth(widthCm,knownCutMm){
  if(!Number.isFinite(widthCm)||widthCm<=0)return null;
  const cutMm=knownCutMm??Math.round(widthCm*1000000)/100000;
  return Number.isFinite(cutMm)&&cutMm>0?{cutMm,basis:knownCutMm==null?"drawing-width":"catalog-cut"}:null;
 }
 function packPanels(parts){
  const bins=[];for(const p of parts.slice().sort((a,b)=>b.cutMm-a.cutMm||String(a.id).localeCompare(String(b.id)))){
   if(!Number.isFinite(p.cutMm)||p.cutMm<=0||p.cutMm>1250)throw Error('Stok panoya sığmayan veya tanımsız kesim.');
   let bin=bins.find(b=>b.used+p.cutMm<=1250+1e-7);if(!bin){bin={used:0,parts:[]};bins.push(bin);}bin.used+=p.cutMm;bin.parts.push(p);
  }return bins.map(b=>({...b,leftoverMm:Math.round((1250-b.used)*1000)/1000}));
 }

 // Top profiles are classified once per segment. Roof direction is supplied locally.
 function topProfiles(nodes,segs,rooms,direction){
  const byId=new Map(nodes.map(n=>[n.id,n])),adj=id=>segs.filter(s=>s.n1===id||s.n2===id);
  const verandaEdges=new Set();for(const r of rooms.filter(r=>r.tip==='veranda')){const ids=r.nodeIds||[];for(let i=0;i<ids.length;i++){const a=byId.get(ids[i]),b=byId.get(ids[(i+1)%ids.length]);if(!a||!b)continue;
   const dx=b.x-a.x,dy=b.y-a.y,L=Math.hypot(dx,dy);if(!L)continue;
   for(const s of segs){const p=byId.get(s.n1),q=byId.get(s.n2);if(!p||!q)continue;const on=v=>Math.abs((v.x-a.x)*dy-(v.y-a.y)*dx)/L<.001&&((v.x-a.x)*dx+(v.y-a.y)*dy)>=-.001&&((v.x-a.x)*dx+(v.y-a.y)*dy)<=L*L+.001;if(on(p)&&on(q))verandaEdges.add(s.id);}
  }}
  const result=[];for(const s of segs){const a=byId.get(s.n1),b=byId.get(s.n2);if(!a||!b)continue;const L=Math.hypot(b.x-a.x,b.y-a.y);if(L<=.001)continue;const axis=Math.abs(a.y-b.y)<.001?'x':Math.abs(a.x-b.x)<.001?'y':null;
   const veranda=s.tip==='veranda',point={x:(a.x+b.x)/2,y:(a.y+b.y)/2},trussAxis=direction(s,a,b);
   let name=!veranda&&(!s.dis||verandaEdges.has(s.id))?'Duvar omegası':!axis||!trussAxis?'Omega — yön kontrolü':axis===trussAxis?(veranda?'Duvar omegası':'Saçak omegası'):'Baş makas omegası';
   let netMm=null;if(veranda&&axis){const trim=id=>{const walls=adj(id).filter(q=>q.tip!=='veranda');if(!walls.length)return 5;let cut=0;for(const q of walls){const p=byId.get(q.n1),r=byId.get(q.n2),ql=Math.hypot(r.x-p.x,r.y-p.y);if(ql){const normal=Math.abs(axis==='x'?(r.y-p.y)/ql:(r.x-p.x)/ql);if(normal>.001)cut=Math.max(cut,(q.k/2)/normal);}}return cut;};netMm=Math.round((L-trim(s.n1)-trim(s.n2))*10000)/1000;if(netMm<=0)netMm=null;}
   result.push({id:s.id,point,name,widthMm:veranda?100:s.k*10,lengthCm:veranda?netMm===null?null:netMm/10:L,netMm,veranda,axis,trussAxis});
  }return result;
 }
 function build(items,config){const c=validate(config),groups=new Map();
  for(let item of items){if(item.source.stockRule)item={...item,name:'Dolu stok pano',size:`${item.source.stockRule.thicknessMm} × 1250 × ${item.source.stockRule.heightMm} mm`,warning:'Özel parça ölçüleri çizimde korunur; stok pano sahada kesilir. Kesim planı büyükten küçüğe sığdırılır; en az pano garantisi verilmez. Katalog dışı ölçülerde çizim eni esas alınır; H payı düşülmez. Testere payı ayrıca tanımlanmadı.'};const key=JSON.stringify([item.group,item.name,item.size]);if(!groups.has(key))groups.set(key,{key,group:item.group,name:item.name,size:item.size,unit:'adet',calculated:0,sources:[],warning:item.warning});const r=groups.get(key);r.calculated++;r.sources.push(item.source);}
  const rows=[...groups.values()].sort((a,b)=>(['Panel','Metal','Kapı / PVC'].indexOf(a.group)-['Panel','Metal','Kapı / PVC'].indexOf(b.group))||a.key.localeCompare(b.key,'tr'));for(const r of rows){r.basis=fingerprint(JSON.stringify(r.sources.slice().sort((a,b)=>JSON.stringify(a).localeCompare(JSON.stringify(b)))));const a=c.adjustments.find(a=>a.key===r.key);r.stale=!!a&&a.basis!==r.basis;const auto=r.sources.length&&r.sources.every(s=>(s.hRule&&s.hRule.ear!==null)||!!s.cornerRule||!!s.uRule||!!s.stockRule||!!s.postRule);r.packing=r.sources.every(s=>s.stockRule)?packPanels(r.sources.map(s=>({id:s.id,label:s.panelLabel||s.id,cutMm:s.stockRule.cutMm}))):null;r.cutting=r.packing?r.packing.map((b,i)=>`P${i+1}: ${b.parts.map(p=>p.cutMm+" ["+p.label+"]").join(" + ")} mm; artık ${b.leftoverMm} mm`).join(" | "):"";r.leftoverMm=r.packing?r.packing.reduce((n,b)=>n+b.leftoverMm,0):null;r.spare=r.sources.every(s=>s.uRule)?Math.ceil(r.calculated/5):0;r.qty=a?(r.stale?null:a.qty):auto?(r.packing?r.packing.length:r.calculated+r.spare):null;r.reason=a?.reason||(r.packing?'1250 mm stoktan saha kesimi; çizim parça ölçüleri korunur. Katalog dışı parçada çizim eni kullanılır, H payı düşülmez. Testere payı tanımlanmadı.':r.spare?`${r.calculated} çizim + ${r.spare} yedek; her başlayan 5 adede 1 yedek, ölçü bazında.`:'');r.referenceId=a?a.referenceId:(r.sources[0]?.referenceId||'');r.status=r.stale?'Çizim değişti':a?'Manuel doğrulandı':auto?(r.packing?'Otomatik stok pano':r.sources[0].uRule?'Otomatik U + yedek':r.sources[0].postRule?'Otomatik veranda direği':r.sources[0].cornerRule?'Otomatik köşe direği':'Otomatik H adedi'):'Kural bekliyor';}
  for(const r of rows){if(!r.sources.length||!r.sources.every(s=>s.frameRule))continue;
   const lengthCm=r.sources.reduce((n,s)=>n+s.frameRule.lengthCm,0),base=Math.ceil(Math.round(lengthCm*1000000)/1000000/250),a=c.adjustments.find(a=>a.key===r.key);
   r.lengthCm=lengthCm;r.calculated=base;r.spare=base>0?1:0;r.qty=a?(r.stale?null:a.qty):base+r.spare;
   r.reason=a?.reason||`Toplam duvar aks uzunluğu ${Math.round(lengthCm*1000)/1000} cm / 250 cm, yukarı yuvarla: ${base} + ${r.spare} yedek. Kapı/pencere dahil; veranda açık kenarları hariç. Kalınlık bazında ortak toplam.`;
   r.status=r.stale?'Çizim değişti':a?'Manuel doğrulandı':'Otomatik alt çerçeve';
  }
  for(const r of rows){if(!r.sources.length||!r.sources.every(s=>s.omegaRule))continue;
   const lengthCm=r.sources.reduce((n,s)=>n+s.omegaRule.lengthCm,0),base=Math.ceil(Math.round(lengthCm*1000000)/1000000/250),a=c.adjustments.find(a=>a.key===r.key);
   r.lengthCm=lengthCm;r.calculated=base;r.spare=0;r.qty=a?(r.stale?null:a.qty):base;
   r.reason=a?.reason||`${r.name} hat toplamı ${Math.round(lengthCm*1000)/1000} cm / 250 cm, yukarı yuvarla: ${base} adet. Ürün ve kalınlık bazında; duvarlarda kapı/pencere dahil aks boyu, veranda kirişlerinde net boy. Standart 2500 mm; yedek kuralı verilmedi, yedek eklenmedi.`;
   r.status=r.stale?'Çizim değişti':a?'Manuel doğrulandı':r.name==='Duvar omegası'?'Otomatik duvar omegası':'Otomatik omega';
  }
  for(const r of rows){if(!r.sources.length||!r.sources.every(s=>s.postRule))continue;const a=c.adjustments.find(a=>a.key===r.key);r.postLengthMm=!r.stale&&a?.postLengthMm!==undefined?a.postLengthMm:r.sources[0].postRule.lengthMm;r.size=`100 × 100 × ${r.postLengthMm} mm`;if(r.postLengthMm!==2500)r.referenceId='';}

  for(const r of rows){if(!r.sources.length||!r.sources.every(s=>s.beamRule))continue;const a=c.adjustments.find(a=>a.key===r.key);r.netMm=r.sources[0].beamRule.netMm;r.cutAllowanceMm=100;r.shipLengthMm=r.netMm+100;r.spare=0;r.qty=a?(r.stale?null:a.qty):r.calculated;r.reason=a?.reason||('Net '+r.netMm+' mm +100 mm kesim payı = '+r.shipLengthMm+' mm sevk boyu. Her parçaya bir kez; yedek adet değildir.');r.status=r.stale?'Çizim değişti':a?'Manuel doğrulandı':'Otomatik veranda kirişi';}
  // Temporary 1:1 quantity link. Z is a separate product, never double-count its reference.
  for(const head of rows.filter(r=>r.name==='Baş makas omegası')){const key=JSON.stringify(['Metal','Baş makas Z sacı',head.size]),a=c.adjustments.find(a=>a.key===key),basis=fingerprint(head.basis+':head-z-one-to-one-v1:'+head.qty);groups.set(key,true);const stale=!!a&&a.basis!==basis;
   rows.push({key,basis,group:'Metal',name:'Baş makas Z sacı',size:'70 × 2500 mm · omega grubu '+head.size,unit:'adet',calculated:head.qty??head.calculated,qty:a?(stale?null:a.qty):head.qty,spare:0,status:stale?'Çizim değişti':a?'Manuel doğrulandı':head.qty===null?'Kural bekliyor':'Otomatik Z eşlemesi',stale,sources:head.sources.map(s=>({...s,id:'z:'+s.id,zRule:{rule:'head-z-one-to-one-v1'}})),referenceId:a?a.referenceId:'tuna-41',warning:'Baş makas omegası ile geçici 1:1 adet bağı; ayrı ürün. İleride revize edilebilir.',reason:a?.reason||'Baş makas omegasının toplam sevk adediyle geçici 1:1 bağlantı. Ayrı satır; 2500 mm stok. Ek yedek yok. '+(head.qty===null?'Omega hesabı kontrol bekliyor.':'')});}
  for(const a of c.manual)rows.push({...a,key:a.id,group:'Manuel',calculated:null,status:'Manuel ek',sources:[],qty:a.qty});
  const orphan=c.adjustments.filter(a=>!groups.has(a.key));return {rows,orphan};
 }
 function shipment(r){
  const manual=['Manuel doğrulandı','Manuel ek','Çizim değişti'].includes(r.status);
  const base=r.packing?r.packing.length:r.qty!=null&&!manual?r.calculated:null;
  const known=!!r.sources?.length&&r.sources.every(s=>s.uRule||s.frameRule);
  return {base,spare:manual||r.qty==null?null:r.spare||0,label:manual?'Manuel toplam; yedek ayrımı doğrulanmadı':r.qty==null?'Hesap bekliyor':known?'Yedek toplam sevke dahil; tekrar eklemeyin':'Otomatik yedek eklenmedi'};
 }
 function csv(rows,meta={}){const cell=v=>'"'+String(v??'').replace(/^[=+\-@\t\r]/,"'$&").replace(/"/g,'""')+'"';return '\ufeff'+[['TASLAK YÜKLEME LİSTESİ — imalat/sevkiyat onayı değildir'],['Proje',meta.project||'','Sürüm',meta.version||'','Tarih',meta.date||''],['Kapsam','Panel, bağlantı ve açıklık sayımları; çatı, tesisat ve sarf otomatik hesaplanmaz.'],['Çizimde karşılığı kalmayan düzeltme',meta.orphan||0],['Grup','Malzeme','Ölçü','Birim','Çizim adedi','Toplam sevk (yedek dahil)' ,'Durum','Gerekçe','Excel referans satırı','Kaynak kimlikler','Yedek','Kesim dağılımı (mm)','Artık toplamı (mm)','Adet','Yedek açıklaması','Net boy (mm)','Kesim payı (mm)','Sevk boyu (mm)'],...rows.map(r=>[r.group,r.name,r.size,r.unit,r.calculated,r.qty,r.status,r.reason,r.referenceId,(r.sources||[]).map(s=>s.id).join(', '),shipment(r).spare,r.cutting||'',r.leftoverMm??'',shipment(r).base,shipment(r).label,r.netMm??'',r.cutAllowanceMm??'',r.shipLengthMm??''])].map(r=>r.map(cell).join(';')).join('\r\n');}
 function classifyH(point,trusses,exterior){
  // Current manufacturing rule: every interior H is earless and without dowels.
  // Keep this separate from exterior support detection for a future explicit revision.
  if(!exterior)return {rule:'h-interior-earless-no-dowel-v2',ear:false,dowel:false,label:'Kulaksız · dübelsiz',matches:[]};
  const hits=trusses.filter(m=>{const axis=m.axis,cross=axis==='x'?'y':'x';return ['x','y'].includes(axis)&&Math.abs(point[axis]-m.pos)<.6&&Math.min(Math.abs(point[cross]-m.a),Math.abs(point[cross]-m.b))<.6;});
  const supported=hits.filter(m=>m.supported!==false),outside=trusses.length>0&&!hits.length;
  return {rule:'h-end-support-v1',ear:supported.length?true:outside?false:null,dowel:!!exterior,
   label:supported.length?(exterior?'Kulaklı · dübelli':'Kulaklı · dübelsiz'):(hits.length?'Makas mesnet kontrolü gerekli':outside?(exterior?'Kulaksız · dübelli':'Kulaksız · dübelsiz'):'Makas verisi bekleniyor'),
   matches:hits.map(m=>({no:m.no,axis:m.axis,pos:m.pos,a:m.a,b:m.b,zoneId:m.zoneId||'',supported:m.supported!==false}))};
 }
 function cornerProduct(k,height){
  const side=String(k)==='10'?98:String(k)==='6'?58:null;
  if(!side||!Number.isFinite(height)||height<=0)return null;
  const length=Math.round(height*1000)/100;
  return {rule:'corner-98-58-v1',nominalCm:Number(k),sideMm:side,heightMm:length,size:`${side} × ${side} × ${length} mm`,referenceId:side===98&&height===250?'tuna-22':''};
 }
 function uProduct(k,height){
  const width=String(k)==='10'?100:String(k)==='6'?60:null;
  if(!width||!Number.isFinite(height)||height<=6)return null;
  const length=Math.round(height*1000)/100-60;
  return {rule:'u-height-minus60-spare-ceil5-v1',widthMm:width,heightMm:length,size:`${width} × ${length} mm`,referenceId:width===60&&height===250?'tuna-29':''};
 }
 return {validate,build,csv,fingerprint,classifyH,cornerProduct,uProduct,packPanels,stockWidth,shipment,topProfiles};
});
