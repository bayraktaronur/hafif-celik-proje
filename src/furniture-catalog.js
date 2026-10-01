/* Generic furniture footprints (outer dimensions, cm), not mattress sizes. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.FurnitureCatalog=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
 const items={
   bedSingle:{name:'Tek kişilik yatak',sizes:[[105,209],[100,210],[110,210]],front:60,side:45},
   bedDouble:{name:'Çift kişilik yatak',sizes:[[166,215],[170,210],[190,210]],front:60,side:50},
   wardrobe:{name:'Gardırop',sizes:[[200,60],[150,60],[240,60]],front:80},
   coatCabinet:{name:'Vestiyer',sizes:[[120,40],[160,40],[120,60]],front:70},
   coffeeTable:{name:'Orta sehpa',sizes:[[90,55],[110,60],[80,80]],front:30},
   tvUnit:{name:'TV ünitesi',sizes:[[180,40],[150,40],[200,40]],front:60},
   armchair:{name:'Berjer',sizes:[[80,85],[90,90]],front:60},
   sofa2:{name:'İkili koltuk',sizes:[[190,95],[170,90]],front:60},
   sofa3:{name:'Üçlü koltuk',sizes:[[228,95],[210,90]],front:60},
   nightstand:{name:'Komodin',sizes:[[45,40],[50,40]],front:40}
 };
 function draw(c,f){
   if(!items[f.kind])return false;const w=f.w,d=f.d;
   const rect=(x,y,a,b,r=2)=>{if(a<=0||b<=0)return;c.beginPath();c.roundRect(x,y,a,b,Math.min(r,a/3,b/3));c.stroke();};
   const line=(x,y,a,b)=>{c.beginPath();c.moveTo(x,y);c.lineTo(a,b);c.stroke();};
   if(f.kind.startsWith('bed')){rect(0,0,w,d,2);rect(3,8,w-6,d-11,3);line(3,52,w-3,52);line(3,58,w-3,58);const n=f.kind==='bedSingle'?1:2;for(let i=0;i<n;i++){const pw=Math.min(55,(w-18)/n-6),x=w/n*(i+.5)-pw/2;rect(x,14,pw,29,5);line(x+4,18,x+pw-4,18);}line(0,5,w,5);}
   else if(['sofa2','sofa3','armchair'].includes(f.kind)){rect(0,0,w,d,5);const arm=Math.min(13,w*.13),back=19;rect(arm,2,w-2*arm,back,4);rect(2,back,arm-3,d-back-3,4);rect(w-arm+1,back,arm-3,d-back-3,4);const n=f.kind==='sofa3'?3:f.kind==='sofa2'?2:1;for(let i=0;i<n;i++)rect(arm+2+i*(w-2*arm)/n,back+3,(w-2*arm)/n-4,d-back-6,4);}
   else if(['wardrobe','coatCabinet'].includes(f.kind)){rect(0,0,w,d,1);const n=Math.max(2,Math.round(w/60));for(let i=1;i<n;i++)line(w*i/n,0,w*i/n,d);line(3,d-5,w-3,d-5);for(let i=0;i<n;i++){line(w*i/n+7,d-9,w*i/n+17,d-9);line(w*i/n+7,d*.35,w*(i+1)/n-7,d*.35);}}
   else if(f.kind==='tvUnit'){rect(0,0,w,d,2);rect(w*.15,4,w*.7,5,1);line(w*.4,12,w*.6,12);line(w/3,18,w/3,d);line(w*2/3,18,w*2/3,d);}
   else if(f.kind==='nightstand'){rect(0,0,w,d,2);line(0,d-6,w,d-6);line(w*.35,d-9,w*.65,d-9);}
   else {rect(0,0,w,d,7);rect(3,3,w-6,d-6,5);}
   return true;
 }
 return {items,draw};
});
