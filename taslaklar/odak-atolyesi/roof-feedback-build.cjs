// Prototype-only diagnostics. The connection acceptance rules and geometry stay unchanged.
module.exports=function roofFeedback(file,source,replaceOnce){
 if(file==='src/roof-core.js'){
  const start=source.indexOf('  function connectChild('),end=source.indexOf('  function defaults(',start);
  if(start<0||end<0)throw Error('Roof connection source changed');
  let part=source.slice(start,end);
  part=replaceOnce(part,"const fail=()=>{throw Error('Yavru çatı bağlanamadı. Dört köşeli açık U uçlarını aynı ana çatı kenarına yakalayın; kot/eğim ana yüzeyle kesişmeli.');};",`const fail=(code,message,details={})=>{const e=new Error(message);e.code='roof-child-'+code;e.details=details;throw e;};
    const cm=n=>n.toLocaleString('tr-TR',{maximumFractionDigits:1})+' cm';`);
  const reasons=[
   "fail('parent','Bağlanacağı çatı bulunamadı. Ana çatıyı listeden seçin.')",
   "fail('points','U sınırı için dört köşe seçin; ilk ve son köşe aynı ana çatı kenarında olmalı.')",
   "fail('size','Yavru çatı eni ve dışarı uzanımı en az 10 cm olmalı.')",
   "fail('direction','U sınırını yatay/dikey kenarlar boyunca çizin.')",
   "fail('rectangle','U sınırının karşılıklı kenarları hizalı değil. Son köşeyi silip duvar hizasına yakalayın.')",
   "fail('gable-extent','Yavru çatının yan saçağı ana çatı alın sınırının dışında kalıyor. U sınırını veya yan saçağı kontrol edin.')",
   "fail('mouth','U uçları bağlı, fakat saçak kotları birleşmiyor. Yavru yüzey bağlantıda ana çatıdan aşağıda veya ana yüzeyin dışında kalıyor. Saçak/eğim ve sınırı kontrol edin.')",
   `fail('intersection',roof>parentPeak+.01
      ?'U uçları bağlı. Yavru çatı yüksekliği '+cm(roof)+', ana çatının en yüksek kotu '+cm(parentPeak)+'. Yavru yüzey ana çatının üstünde kalıyor; yavru eğimini azaltın veya U açıklığını daraltın.'
      :'U uçları bağlı, fakat yavru yüzey bu doğrultuda ana çatıyla kesişmiyor. Yavru eğimini, U açıklığını veya bağlantı kenarını kontrol edin.',
      {childHeight:roof,parentPeak,opening:width,pitch:z.pitch})`,
   "fail('terminal','Yavru çatı birleşimi ana çatının karşı sınırını aşıyor veya yüzeyden dışarı çıkıyor. Eğim ve U açıklığını kontrol edin.')"
  ];
  let index=0;part=part.replace(/fail\(\)/g,()=>reasons[index++]);
  if(index!==reasons.length)throw Error('Roof validation branches changed');
  part=replaceOnce(part,'const host=zoneFaces(parent),outline=footprint(parent).map(p=>transform(parent,p));','const host=zoneFaces(parent),outline=footprint(parent).map(p=>transform(parent,p));\n    const parentPeak=Math.max(...host.flatMap(f=>f.poly.map(p=>height(f,p))));');
  return source.slice(0,start)+part+source.slice(end);
 }
 if(file==='src/roof-workflow.js'){
  source=replaceOnce(source,"if(draft?.openU&&mode==='plan')", "if(window.SingleRoofFeedback?.refresh(mode))return;\n  if(draft?.openU&&mode==='plan')");
  source=replaceOnce(source,"if(!draft)return;hover=snap(R.world(e));", "if(!draft)return;if(draft.openU&&draft.points.length===4){hover=null;return;}hover=snap(R.world(e));");
  source=replaceOnce(source,"R.notice('Dört nokta hazır. Çatıyı oluştur düğmesine basın; düzeltmek için son çizim noktasını silin.');return;", "hint('plan');R.repaint();return;");
 }
 return source;
};
