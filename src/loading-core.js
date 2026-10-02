/* Draft loading list: geometric counts and explicit, revision-bound decisions. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.LoadingCore=api;})(globalThis,function(){
 'use strict';
 function validate(value){const c=value??{adjustments:[],manual:[]};if(!c||typeof c!=='object'||Array.isArray(c))throw Error('Yükleme listesi geçersiz.');
  for(const k of ['adjustments','manual'])if(!Array.isArray(c[k])||c[k].length>1000)throw Error('Yükleme satırları geçersiz.');
  const text=(s,max)=>typeof s==='string'&&s.length<=max,qty=n=>typeof n==='number'&&Number.isFinite(n)&&n>=0&&n<=1000000;
  for(const a of c.adjustments)if(!text(a.key,300)||!text(a.basis,80)||!qty(a.qty)||!Number.isInteger(a.qty)||!text(a.reason,500)||!a.reason.trim()||!text(a.referenceId,80))throw Error('Yükleme düzeltmesi için miktar ve gerekçe gerekli.');
  for(const a of c.manual)if(!text(a.id,80)||!text(a.name,160)||!a.name.trim()||!text(a.size,160)||!['adet','m','m²','kg','takım','kutu'].includes(a.unit)||!qty(a.qty)||(['adet','takım','kutu'].includes(a.unit)&&!Number.isInteger(a.qty))||!text(a.reason,500)||!a.reason.trim())throw Error('Manuel malzeme satırı geçersiz.');
  for(const [k,id] of [['adjustments','key'],['manual','id']])if(new Set(c[k].map(a=>a[id])).size!==c[k].length)throw Error('Tekrarlanan yükleme satırı.');return JSON.parse(JSON.stringify(c));
 }
 function fingerprint(s){let a=2166136261,b=5381;for(let i=0;i<s.length;i++){a=Math.imul(a^s.charCodeAt(i),16777619);b=Math.imul(b,33)^s.charCodeAt(i);}return (a>>>0).toString(16)+'-'+(b>>>0).toString(16);}
 function build(items,config){const c=validate(config),groups=new Map();
  for(const item of items){const key=JSON.stringify([item.group,item.name,item.size]);if(!groups.has(key))groups.set(key,{key,group:item.group,name:item.name,size:item.size,unit:'adet',calculated:0,sources:[],warning:item.warning});const r=groups.get(key);r.calculated++;r.sources.push(item.source);}
  const rows=[...groups.values()].sort((a,b)=>(['Panel','Metal','Kapı / PVC'].indexOf(a.group)-['Panel','Metal','Kapı / PVC'].indexOf(b.group))||a.key.localeCompare(b.key,'tr'));for(const r of rows){r.basis=fingerprint(JSON.stringify(r.sources.slice().sort((a,b)=>JSON.stringify(a).localeCompare(JSON.stringify(b)))));const a=c.adjustments.find(a=>a.key===r.key);r.stale=!!a&&a.basis!==r.basis;r.qty=a&&!r.stale?a.qty:null;r.reason=a?.reason||'';r.referenceId=a?.referenceId||'';r.status=r.stale?'Çizim değişti':a?'Manuel doğrulandı':'Kural bekliyor';}
  for(const a of c.manual)rows.push({...a,key:a.id,group:'Manuel',calculated:null,status:'Manuel ek',sources:[],qty:a.qty});
  const orphan=c.adjustments.filter(a=>!groups.has(a.key));return {rows,orphan};
 }
 function csv(rows,meta={}){const cell=v=>'"'+String(v??'').replace(/^[=+\-@\t\r]/,"'$&").replace(/"/g,'""')+'"';return '\ufeff'+[['TASLAK YÜKLEME LİSTESİ — imalat/sevkiyat onayı değildir'],['Proje',meta.project||'','Sürüm',meta.version||'','Tarih',meta.date||''],['Kapsam','Panel, bağlantı ve açıklık sayımları; çatı, tesisat ve sarf otomatik hesaplanmaz.'],['Çizimde karşılığı kalmayan düzeltme',meta.orphan||0],['Grup','Malzeme','Ölçü','Birim','Çizim adedi','Sevk taslağı','Durum','Gerekçe','Excel referans satırı','Kaynak kimlikler'],...rows.map(r=>[r.group,r.name,r.size,r.unit,r.calculated,r.qty,r.status,r.reason,r.referenceId,(r.sources||[]).map(s=>s.id).join(', ')])].map(r=>r.map(cell).join(';')).join('\r\n');}
 function classifyH(point,trusses,exterior){
  const hits=trusses.filter(m=>{const axis=m.axis,cross=axis==='x'?'y':'x';return ['x','y'].includes(axis)&&Math.abs(point[axis]-m.pos)<.6&&point[cross]>=m.a-.6&&point[cross]<=m.b+.6;});
  const supported=hits.filter(m=>m.supported!==false);
  return {ear:supported.length?true:null,dowel:supported.length&&exterior?true:null,
   label:supported.length?(exterior?'Kulaklı · dübelli':'Kulaklı · dübel kararı bekliyor'):(hits.length?'Makas mesnet kontrolü gerekli':'Kulak / dübel kuralı bekliyor'),
   matches:hits.map(m=>({no:m.no,axis:m.axis,pos:m.pos,a:m.a,b:m.b,zoneId:m.zoneId||'',supported:m.supported!==false}))};
 }
 return {validate,build,csv,fingerprint,classifyH};
});
