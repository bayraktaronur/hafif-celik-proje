/* Original, editable plan symbols. Dimensions are suggested outer footprints in cm. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.PlanLibraryCore=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
 const categories={bath:'Banyo',kitchen:'Mutfak',living:'Oturma',dining:'Masa ve sandalye',bedroom:'Yatak ve depolama',office:'İş yeri',decor:'Aksesuar',outdoor:'Bahçe',openings:'Kapı ve pencere'};
 const entries=[
 ['basin','Lavabo','bath','basin',[[44.52,38.97]],'vitrifiye el yıkama'],['vanity','Lavabolu dolap','bath','vanity',[[60,50],[80,50],[120,50]],'banyo tezgah musluk'],['wc','Klozet','bath','wc',[[36.07,65.98]],'tuvalet vitrifiye'],['wallwc','Asma klozet','bath','wc',[[36.07,57.61]],'tuvalet vitrifiye'],['shower','Duş teknesi','bath','shower',[[90,90],[80,100],[90,120]],'duşakabin banyo'],['bathtub','Oval küvet','bath','bathtub',[[80,170],[80,180]],'banyo vitrifiye'],['bathDouble','Çift lavabolu dolap','bath','vanity',[[140,50],[160,55]],'lavabo musluk banyo'],['bathScreen','Duş camı','bath','screen',[[100,3],[120,3]],'bölme cam'],['towelRail','Havlupan','bath','radiator',[[60,10],[50,10]],'radyatör banyo'],['tap','Batarya / musluk','bath','tap',[[14,22]],'lavabo eviye aksesuar'],
 ['sink','Evye','kitchen','sink',[[46,46]],'eviye lavabo mutfak'],['hob','Ocak','kitchen','hob',[[60,50]],'ankastre pişirme'],['fridge','Buzdolabı','kitchen','fridge',[[75,70]],'beyaz eşya'],['washer','Çamaşır makinesi','kitchen','washer',[[60,60]],'beyaz eşya banyo'],['dishwasher','Bulaşık makinesi','kitchen','appliance',[[60,60],[45,60]],'beyaz eşya'],['oven','Fırın modülü','kitchen','oven',[[60,60]],'ankastre'],['kitchenIsland','Mutfak adası','kitchen','island',[[160,90],[200,100]],'tezgah hazırlık'],['sinkDouble','Çift gözlü evye','kitchen','sink',[[80,50]],'eviye'],['kitchenCabinet','Dolap modülü','kitchen','cabinet',[[60,60],[80,60],[120,60]],'mutfak depolama'],['coffeeMachine','Kahve makinesi','kitchen','coffee',[[30,38]],'aksesuar çay'],
 ['sofa2','İkili koltuk','living','sofa',[[190,95],[170,90]],'oturma kanepe'],['sofa3','Üçlü koltuk','living','sofa',[[228,95],[210,90]],'oturma kanepe'],['armchair','Berjer','living','sofa',[[80,85],[90,90]],'tekli koltuk'],['sofaCorner','Köşe koltuk','living','sectional',[[280,180],[300,200]],'L kanepe oturma'],['coffeeTable','Orta sehpa','living','table',[[90,55],[110,60],[80,80]],'salon'],['coffeeRound','Yuvarlak sehpa','living','roundTable',[[75,75],[90,90]],'salon daire'],['tvUnit','TV ünitesi','living','tv',[[180,40],[150,40],[200,40]],'televizyon'],['ottoman','Puf','living','ottoman',[[55,55],[70,70]],'oturma'],
 ['dining4','Dört kişilik yemek masası','dining','dining',[[150,180]],'masa sandalye yemek'],['dining6','Altı kişilik yemek masası','dining','dining',[[210,190]],'masa sandalye yemek'],['tableRect','Dikdörtgen masa','dining','table',[[140,80],[180,90]],'yemek çalışma'],['tableRound','Yuvarlak masa','dining','roundTable',[[110,110],[130,130]],'yemek daire'],['chair','Sandalye','dining','chair',[[48,52]],'yemek oturma'],['barStool','Bar taburesi','dining','stool',[[40,40]],'mutfak oturma'],
 ['bedSingle','Tek kişilik yatak','bedroom','bed',[[105,209],[100,210],[110,210]],'yatak odası'],['bedDouble','Çift kişilik yatak','bedroom','bed',[[166,215],[170,210],[190,210]],'yatak odası'],['nightstand','Komodin','bedroom','nightstand',[[45,40],[50,40]],'yatak sehpa'],['wardrobe','Gardırop','bedroom','wardrobe',[[200,60],[150,60],[240,60]],'elbise dolap giyinme'],['coatCabinet','Vestiyer','bedroom','wardrobe',[[120,40],[160,40],[120,60]],'giriş dolap'],['dresser','Şifonyer','bedroom','cabinet',[[120,45],[160,45]],'depolama çekmece'],['bunkBed','Ranza','bedroom','bunk',[[100,210]],'yatakhane tek kişilik'],['bookcase','Kitaplık','bedroom','bookcase',[[120,35],[180,35]],'raf ofis depolama'],
 ['desk','Çalışma masası','office','desk',[[140,70],[160,80]],'ofis bilgisayar iş yeri'],['officeChair','Ofis koltuğu','office','officeChair',[[65,65]],'çalışma sandalye'],['meetingTable','Toplantı masası','office','meeting',[[300,200],[400,220]],'ofis iş yeri sandalye'],['reception','Karşılama bankosu','office','reception',[[200,80],[250,90]],'resepsiyon iş yeri'],['fileCabinet','Dosya dolabı','office','cabinet',[[90,45]],'ofis arşiv'],['printer','Yazıcı','office','printer',[[50,45]],'ofis aksesuar'],
 ['rug','Dikdörtgen halı','decor','rug',[[200,300],[160,230],[300,400]],'kilim zemin'],['rugRound','Yuvarlak halı','decor','rugRound',[[180,180],[240,240]],'kilim zemin'],['curtain','Perde','decor','curtain',[[180,18],[240,18],[300,18]],'tül pencere'],['plant','Saksı bitkisi','decor','plant',[[55,55],[80,80]],'çiçek peyzaj'],['floorLamp','Lambader','decor','lamp',[[40,40]],'aydınlatma lamba'],['tableLamp','Masa lambası','decor','lamp',[[22,22]],'aydınlatma komodin'],['radiator','Radyatör','decor','radiator',[[100,12],[150,12]],'kalorifer petek'],['coatRack','Askılık','decor','rack',[[45,45]],'vestiyer giriş'],
 ['outdoorBench','Bahçe bankı','outdoor','bench',[[150,55],[180,55]],'veranda oturma'],['sunLounger','Şezlong','outdoor','lounger',[[70,200]],'bahçe havuz'],['planter','Çiçeklik','outdoor','planter',[[120,40],[180,50]],'veranda saksı'],['outdoorTable','Bahçe masası','outdoor','table',[[140,80]],'veranda yemek'],
 ['nativeDoor','Kapı','openings','door',[[90,10]],'çelik sac pvc alüminyum açıklık','t-kapi'],['nativeWindow','Pencere','openings','window',[[120,10]],'pvc doğrama açıklık','t-pencere'],['nativeCounter','Düz / L / U tezgâh','kitchen','counter',[[240,60]],'mutfak tezgah dolap','t-kitchen']
 ];
 const items=Object.fromEntries(entries.map(([id,name,category,shape,sizes,tags,command])=>[id,{id,name,category,shape,sizes,tags,command,underlay:shape==='rug'||shape==='rugRound'}]));
 const palette={fixture:'#f6f3e9',wood:'#b2a18a',fabric:'#eeeade',counter:'#c2b6a3',ink:'#302e29',rug:'#d0cfc2',shadow:true};
 const fold=s=>String(s||'').toLocaleLowerCase('tr-TR').replace(/ı/g,'i').normalize('NFD').replace(/[\u0300-\u036f]/g,'');
 function search(query='',category='all'){const terms=fold(query).split(/\s+/).filter(Boolean);return Object.values(items).filter(i=>(category==='all'||i.category===category)&&terms.every(t=>fold(i.name+' '+i.tags+' '+categories[i.category]).includes(t)));}
 const fixedKinds=new Set(['basin','wc','wallwc','sink','hob','fridge','washer']);
 function install(catalog){const nativeKinds=new Set([...fixedKinds,'vanity','shower']);for(const i of Object.values(items))if(!i.command&&!nativeKinds.has(i.id)&&!catalog.items[i.id])catalog.items[i.id]={name:i.name,sizes:i.sizes,front:60};const old=catalog.draw;catalog.draw=(c,f)=>old(c,f)||draw(c,f,{fixture:'#fff',wood:'#eee',fabric:'#fff',ink:c.strokeStyle},{technical:true});}
 function draw(c,f,p=palette,options={}){
  const item=items[f.kind];if(!item)return false;
  if(typeof c.setLayer==='function'){if(options.technical){c.beginPath();c.rect(0,0,f.w,f.d);c.stroke();return true;}return false;}
  const w=Math.max(f.w,item.sizes[0][0]),d=Math.max(f.d,item.sizes[0][1]),shape=item.shape;const ink=options.selected?c.strokeStyle:(p.ink||c.strokeStyle),fabric=p.fabric,wood=p.wood,white=p.fixture;
  c.save();c.scale(f.w/w,f.d/d);c.strokeStyle=ink;c.lineJoin='round';c.lineCap='round';
  const line=(x,y,a,b)=>{c.beginPath();c.moveTo(x,y);c.lineTo(a,b);c.stroke();};
  const rect=(x,y,a,b,r=0,fill=white)=>{if(a<=0||b<=0)return;c.beginPath();c.roundRect(x,y,a,b,Math.min(r,a/2,b/2));if(fill){c.fillStyle=fill;c.fill();}c.stroke();};
  const ellipse=(x,y,a,b,fill=white)=>{c.beginPath();c.ellipse(x,y,Math.max(.01,a),Math.max(.01,b),0,0,Math.PI*2);if(fill){c.fillStyle=fill;c.fill();}c.stroke();};
  const poly=(pts,fill)=>{c.beginPath();pts.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.closePath();if(fill){c.fillStyle=fill;c.fill();}c.stroke();};
  const tap=(x,y,size=1)=>{ellipse(x,y,2*size,2*size,wood);line(x,y,x,y+9*size);line(x-6*size,y,x+6*size,y);};
  const chair=(x,y,a,b)=>{rect(x,y,a,b,7,fabric);rect(x+2,y+1,a-4,b*.23,4,fabric);};
  const shell=(fn)=>{if(p.shadow&&!item.underlay){c.save();c.shadowColor='#25231e35';c.shadowBlur=5;c.shadowOffsetX=2;c.shadowOffsetY=3;fn();c.restore();}else fn();};
  if(shape==='bed'||shape==='bunk'){
   shell(()=>rect(0,0,w,d,3,wood));rect(3,7,w-6,d-10,4,fabric);rect(4,3,w-8,8,1,wood);
   const count=f.kind==='bedSingle'||shape==='bunk'?1:2;
   for(let j=0;j<count;j++){const x=8+j*(w-16)/count,pw=(w-16)/count-4;poly([[x,16],[x+pw*.5,14],[x+pw,17],[x+pw-2,43],[x+pw*.5,41],[x,43],[x+2,29]],white);}
   poly([[5,57],[w-5,48],[w-5,d*.64],[5,d*.57]],fabric);line(5,57,w-5,d*.37);line(5,d-31,w-5,d-31);
   if(shape==='bunk'){rect(w-17,62,14,90,0,wood);for(let y=70;y<150;y+=18)line(w-17,y,w-3,y);}
  }else if(shape==='sofa'||shape==='sectional'){
   const sd=shape==='sectional'?Math.min(95,d*.55):d;
   shell(()=>shape==='sectional'?poly([[0,0],[w,0],[w,sd],[w*.37,sd],[w*.37,d],[0,d]],fabric):rect(0,0,w,d,7,fabric));
   rect(5,3,w-10,18,5,fabric);rect(2,22,12,sd-25,4,fabric);rect(w-14,22,12,sd-25,4,fabric);
   const count=f.kind==='armchair'?1:f.kind==='sofa2'?2:3;for(let j=0;j<count;j++)rect(17+j*(w-34)/count,24,(w-34)/count-3,sd-29,6,fabric);
   if(shape==='sectional')rect(4,sd+3,w*.37-8,d-sd-7,6,fabric);
  }else if(shape==='wardrobe'||shape==='cabinet'||shape==='bookcase'){
   shell(()=>rect(0,0,w,d,1,wood));const count=Math.max(1,Math.round(w/55));for(let j=0;j<count;j++){const x=j*w/count,a=w/count;rect(x+2,3,a-4,d-6,0,white);if(shape==='wardrobe'){line(x+3,4,x+a-3,d-4);line(x+a-3,4,x+3,d-4);}else if(shape==='bookcase'){for(let k=7;k<a-5;k+=7)line(x+k,8,x+k,d-5);}else{line(x+3,d*.5,x+a-3,d*.5);line(x+a*.4,d*.65,x+a*.6,d*.65);}}
  }else if(shape==='nightstand'){
   shell(()=>rect(0,0,w,d,1,wood));line(2,d-7,w-2,d-7);ellipse(w*.5,d*.42,Math.min(w,d)*.24,Math.min(w,d)*.24,white);line(w*.5-5,d*.42,w*.5+5,d*.42);line(w*.5,d*.42-5,w*.5,d*.42+5);
  }else if(shape==='table'||shape==='roundTable'||shape==='island'||shape==='ottoman'){
   shell(()=>shape==='roundTable'?ellipse(w/2,d/2,w/2,d/2,wood):rect(0,0,w,d,shape==='ottoman'?12:8,shape==='ottoman'?fabric:wood));
   if(shape==='island'){rect(4,4,w-8,d-8,6,white);line(w*.7,4,w*.7,d-4);}else if(shape==='table')rect(3,3,w-6,d-6,6,null);
  }else if(shape==='dining'||shape==='meeting'){
   const n=shape==='meeting'?3:f.kind==='dining6'?3:2,cw=Math.min(44,w/(n+1)),ch=Math.min(42,d*.23);
   for(let j=0;j<n;j++){const x=(j+.5)*w/n-cw/2;chair(x,0,cw,ch);c.save();c.translate(x+cw,d);c.rotate(Math.PI);chair(0,0,cw,ch);c.restore();}
   shell(()=>rect(3,ch*.75,w-6,d-ch*1.5,shape==='meeting'?20:8,wood));
  }else if(shape==='chair'||shape==='officeChair'||shape==='stool'){
   if(shape==='stool')shell(()=>ellipse(w/2,d/2,w/2,d/2,wood));else{if(shape==='officeChair'){for(let j=0;j<5;j++){const a=j*Math.PI*2/5;line(w/2,d/2,w/2+Math.cos(a)*w*.48,d/2+Math.sin(a)*d*.48);}}shell(()=>chair(w*.08,d*.06,w*.84,d*.85));if(shape==='officeChair'){line(0,d*.3,0,d*.7);line(w,d*.3,w,d*.7);}}
  }else if(shape==='desk'||shape==='reception'){
   shell(()=>rect(0,0,w,d,7,wood));if(shape==='desk'){rect(w*.3,8,w*.4,d*.27,1,ink);rect(w*.35,d*.46,w*.3,d*.16,2,white);ellipse(w*.75,d*.54,5,7,white);}else{rect(3,3,w-6,d*.3,5,white);line(w*.3,d*.36,w*.7,d*.36);}
  }else if(shape==='wc'){
   shell(()=>{rect(w*.05,0,w*.9,d*.23,3,white);ellipse(w/2,d*.56,w*.48,d*.44,white);});ellipse(w/2,d*.57,w*.34,d*.32,p.fabric);ellipse(w/2,d*.58,w*.27,d*.25,white);rect(w*.38,d*.06,w*.24,d*.05,1,wood);
  }else if(shape==='basin'||shape==='vanity'||shape==='sink'){
   const n=f.kind==='bathDouble'||f.kind==='sinkDouble'?2:1;
   shell(()=>shape==='basin'?ellipse(w/2,d*.54,w/2,d*.46,white):rect(0,0,w,d,shape==='sink'?3:1,shape==='vanity'?wood:white));
   for(let j=0;j<n;j++){const x=j*w/n,a=w/n;if(shape==='basin')ellipse(w/2,d*.57,w*.36,d*.31,p.fabric);else{rect(x+a*.12,d*.2,a*.76,d*.68,4,white);rect(x+a*.19,d*.27,a*.62,d*.54,5,p.fabric);}ellipse(x+a*.5,d*.55,1.7,1.7,white);tap(x+a*.5,d*.08,.65);}
  }else if(shape==='bathtub'){
   shell(()=>rect(0,0,w,d,Math.min(w,d)/2,white));rect(6,7,w-12,d-14,Math.min(w,d)/2,p.fabric);ellipse(w/2,d*.67,2,2,white);tap(w*.82,d*.28,1);
  }else if(shape==='shower'){
   shell(()=>rect(0,0,w,d,2,white));rect(3,3,w-6,d-6,2,p.fabric);rect(6,6,w-12,d-12,1,null);ellipse(w*.75,d*.75,5,5,white);for(let j=0;j<4;j++){const a=j*Math.PI/2;line(w*.75+Math.cos(a)*2,d*.75+Math.sin(a)*2,w*.75+Math.cos(a)*5,d*.75+Math.sin(a)*5);}tap(w*.18,6,.8);line(w*.18,12,w*.28,25);
  }else if(shape==='hob'){
   shell(()=>rect(0,0,w,d,1,white));for(let x of [.25,.75])for(let y of [.28,.72]){ellipse(w*x,d*y,w*.16,w*.16,p.fabric);ellipse(w*x,d*y,w*.09,w*.09,white);line(w*x-w*.17,d*y,w*x+w*.17,d*y);}for(let x of [.3,.43,.56,.69])ellipse(w*x,4,1.6,1.6,white);
  }else if(['fridge','washer','appliance','oven','printer','coffee'].includes(shape)){
   shell(()=>rect(0,0,w,d,2,white));rect(3,3,w-6,d-9,1,p.fabric);line(0,d-6,w,d-6);line(w*.2,d-3,w*.6,d-3);
   if(shape==='washer'){ellipse(w/2,d*.44,w*.28,d*.28,white);ellipse(w*.8,d*.9,2,2,wood);}if(shape==='oven'){rect(w*.12,d*.2,w*.76,d*.5,2,ink);line(w*.2,d*.75,w*.8,d*.75);}if(shape==='printer'||shape==='coffee'){rect(w*.2,d*.15,w*.6,d*.42,2,white);if(shape==='coffee')ellipse(w*.5,d*.72,w*.18,w*.18,wood);}
  }else if(shape==='tv'){
   shell(()=>rect(0,0,w,d,2,wood));rect(w*.15,4,w*.7,5,1,ink);line(w*.4,12,w*.6,12);line(w/3,18,w/3,d);line(w*2/3,18,w*2/3,d);
  }else if(shape==='rug'||shape==='rugRound'){
   const col=p.rug||p.fabric;if(shape==='rugRound'){ellipse(w/2,d/2,w/2,d/2,col);ellipse(w/2,d/2,w*.47,d*.47,null);}else{rect(0,0,w,d,0,col);rect(4,4,w-8,d-8,0,null);for(let x=4;x<w;x+=8){line(x,0,x,3);line(x,d,x,d-3);}}
  }else if(shape==='curtain'){
   shell(()=>rect(0,0,w,d,1,white));c.beginPath();c.moveTo(0,d*.5);for(let x=0;x<w;x+=12)c.bezierCurveTo(Math.min(w,x+3),0,Math.min(w,x+9),d,Math.min(w,x+12),d*.5);c.stroke();
  }else if(shape==='plant'||shape==='planter'){
   if(shape==='planter')shell(()=>rect(0,0,w,d,2,wood));const n=shape==='planter'?Math.max(1,Math.round(w/d)):1;
   for(let k=0;k<n;k++){const x=(k+.5)*w/n,y=d/2,r=Math.min(w/n,d)*.44;ellipse(x,y,r*.45,r*.45,wood);for(let j=0;j<7;j++){c.save();c.translate(x,y);c.rotate(j*Math.PI*2/7);ellipse(0,r*.35,r*.2,r*.55,p.rug||p.fabric);c.restore();}ellipse(x,y,r*.15,r*.15,wood);}
  }else if(shape==='lamp'||shape==='rack'){
   shell(()=>ellipse(w/2,d/2,w*.46,d*.46,white));if(shape==='lamp'){ellipse(w/2,d/2,w*.18,d*.18,wood);line(w*.22,d*.5,w*.78,d*.5);line(w*.5,d*.22,w*.5,d*.78);}else{for(let j=0;j<6;j++){const a=j*Math.PI/3;line(w/2,d/2,w/2+Math.cos(a)*w*.42,d/2+Math.sin(a)*d*.42);}}
  }else if(shape==='radiator'||shape==='bench'){
   shell(()=>rect(0,0,w,d,1,wood));if(shape==='bench'){for(let y=5;y<d;y+=9)line(2,y,w-2,y);}else for(let x=4;x<w;x+=8)rect(x,2,Math.min(5,w-x),d-4,1,white);
  }else if(shape==='lounger'){
   shell(()=>rect(0,0,w,d,7,wood));rect(4,4,w-8,d*.3,5,fabric);rect(4,d*.33,w-8,d*.64,6,fabric);for(let y=d*.45;y<d-5;y+=15)line(6,y,w-6,y);
  }else if(shape==='tap'){tap(w/2,5,Math.min(w/14,d/22));}
  else if(shape==='screen'||shape==='window'){rect(0,0,w,d,0,white);line(0,d/2,w,d/2);}
  else if(shape==='door'){line(0,0,w,0);line(0,0,0,w);c.setLineDash([3,3]);c.beginPath();c.arc(0,0,w,0,Math.PI/2);c.stroke();}
  else if(shape==='counter'){poly([[0,0],[w,0],[w,d*.35],[w*.3,d*.35],[w*.3,d],[0,d]],wood);}
  c.restore();return true;
 }
 return {items,categories,palette,fixedKinds,search,install,draw,fold};
});
