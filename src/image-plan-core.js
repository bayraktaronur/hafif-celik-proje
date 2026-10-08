/* Provider-independent, centimetre-based input contract. No inferred units. */
(function(root){
function validate(raw){
 const num=(key,label,min,max)=>{const n=Number(String(raw[key]??'').trim().replace(',','.'));if(!Number.isFinite(n)||n<min||n>max)throw Error(label+' için '+min+'–'+max+' aralığında değer girin.');return n;};
 const factors={m:100,cm:1,mm:.1};if(!Object.hasOwn(factors,raw.unit))throw Error('Görseldeki ölçü birimini seçin.');if(!['prefabrik','celik'].includes(raw.system))throw Error('Yapı sistemini seçin.');if(!['x','y'].includes(raw.trussAxis))throw Error('Makas dizilim yönünü seçin.');
 const policy=raw.system==='celik'?'exact':raw.policy;if(!['nearest','exact'].includes(policy))throw Error('Prefabrik üretim yöntemini seçin.');const f=factors[raw.unit],widthCm=num('width','Dış en',1/f,10000/f)*f,depthCm=num('depth','Dış boy',1/f,10000/f)*f,heightCm=num('height','Yükseklik (cm)',150,600),outerCm=num('outer','Dış duvar kalınlığı (cm)',4,40),innerCm=num('inner','İç duvar kalınlığı (cm)',4,40);if(Math.min(widthCm,depthCm)<=2*outerCm)throw Error('Dış ölçüler iki duvar kalınlığından büyük olmalı.');if(raw.system==='prefabrik'&&![6,10,15].includes(outerCm))throw Error('Prefabrik dış duvar için 6, 10 veya 15 cm seçin.');if(raw.system==='prefabrik'&&![6,10,15].includes(innerCm))throw Error('Prefabrik iç duvar için 6, 10 veya 15 cm seçin.');if(!['besik','tek','kirma'].includes(raw.roofType))throw Error('Çatı tipini seçin.');
 return {format:'planstudio-image-plan-brief',version:1,system:raw.system,sourceUnit:raw.unit,policy,outerSizeCm:{width:widthCm,depth:depthCm},wall:{heightCm,outerCm,innerCm},roof:{type:raw.roofType,trussAxis:raw.trussAxis,pitchPercent:num('pitch','Çatı eğimi (%)',1,100)},notes:String(raw.notes||'').slice(0,3000),status:'input-review',confirmed:false};
}
const api={validate};if(typeof module==='object'&&module.exports)module.exports=api;else root.ImagePlanCore=api;
})(globalThis);
