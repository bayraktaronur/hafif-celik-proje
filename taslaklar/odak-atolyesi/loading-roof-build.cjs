const fs=require('fs'),path=require('path');
module.exports=function(file,s,replaceOnce){
 if(file==='src/roof-core.js')return replaceOnce(s,"z.material==='trapez'?800:null","['trapez','sandvic'].includes(z.material)?800:null");
 if(file==='src/roof-workflow.js')return replaceOnce(s,'zoneId:z.id,defaultPos,supported:',"zoneId:z.id,trussKind:(Math.abs(original-positions[0])<.01||Math.abs(original-positions.at(-1))<.01)?'head':'middle',defaultPos,supported:");
 if(file!=='src/loading-ui.js')return s;
 s=replaceOnce(s,'LoadingCore.build(items(),G.loading)',"LoadingRoofBridge.append(LoadingCore.build(items(),G.loading),{model:RoofStudio.model(),zones:G.roofs,frames:window.RoofWorkflow?G.roofs.flatMap(RoofWorkflow.trusses):[]},G.loading,LoadingCore)");
 s=replaceOnce(s,'<option>Kaplama</option>','<option>Kaplama</option><option>Çatı</option>');
 s=replaceOnce(s,'<option>Kural bekliyor</option>','<option>Kural bekliyor</option><option>Çatı hesabı · sevk kuralı bekliyor</option>');
 s=s.replace('Diğer çatı/tavan, tesisat, elektrik ve sarf kalemleri için gerekçeli manuel ek yapılabilir.','Çatı kesimleri, makas yerleşimleri, net mahya ve alt katman hesabı Çatı grubuna aktarılır. Çizim miktarı sevk adedi değildir; eksik stok/bindirme kuralları açık gösterilir. Tesisat, elektrik ve sarf kalemleri için gerekçeli manuel ek yapılabilir.');
 s=replaceOnce(s,"esc(r.calculated??'—')","esc(r.calculated??'—')+' '+esc(r.unit)");
 return fs.readFileSync(path.join(__dirname,'loading-roof-bridge.js'),'utf8')+'\n'+s;
};
