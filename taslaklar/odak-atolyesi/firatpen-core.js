/* Manufacturer dimensions are mm. Workshop hardware remains a separate recipe. */
(function(){
 const choice={hinged:'Garnet 70',sliding:'Klasik Sürme 70',glassMm:20,glassBuild:'4+12+4',defaultOpening:'tilt-turn'};
 const deductions={sash:[18,41,64],mullion:[34,57,80],fixedGlass:[50,73,96],sashGlass:[150,173,196]};
 function design(e,catalog){
  const W=Number(e.en)*10,H=Number(e.yuk)*10,cat=catalog||{},sliding=e.penTip==='surme'||cat.opening==='sliding';
  if(!(W>150&&H>150))throw Error('Doğrama ölçüsü yetersiz.');
  const members=[],glass=[],frames=[],bars=[],cells=[];
  const add=(name,length,qty,source)=>{if(length<=0)throw Error(name+' için geçerli boy kalmıyor.');members.push({name,lengthMm:length,qty,source});};
  if(sliding){
   // Catalogue PDF page 20: A=height, B=width. No inferred weld allowance.
   add('Sürme kanat · yatay',W/2,4,'Sürme 70-75, PDF s.20');add('Sürme kanat · düşey',H-86,4,'Sürme 70-75, PDF s.20');
   const approximateGlass={widthMm:Math.round(W/2-136),heightMm:Math.round(H-222),thicknessMm:20,qty:2,approximate:true,source:'Kullanıcı onayıyla görsel profil yerleşiminden; sipariş ölçüsü değildir'};
   return {approximateGlass,choice,system:choice.sliding,W,H,members,glass,frames,bars,cells,sliding:true,pending:['Sürme kasa kaynak payı ve cam kesim düşümü teyidi','Tekerlek, kilit ve donanım reçetesi']};
  }
  const cols=cat.cols||(e.penTip==='cift-kanat'?2:1),split=cat.transom?H*cat.transom:null,xs=Array.from({length:cols+1},(_,i)=>W*i/cols),zs=split?[0,split,H]:[0,H];
  frames.push({name:'Kasa',profile:'g70-frame',x:0,z:0,w:W,h:H,depth:0});add('Garnet 70 kasa · yatay',W+6,2,'Garnet70 PDF s.42');add('Garnet 70 kasa · düşey',H+6,2,'Garnet70 PDF s.42');
  for(let i=1;i<cols;i++){bars.push({name:'Düşey orta kayıt',vertical:true,station:xs[i],from:40,to:H-40});add('Garnet 70 orta kayıt',H-80,1,'Garnet70 PDF s.42');}
  if(split)for(let i=0;i<cols;i++){const l=i===0?40:17,r=i===cols-1?40:17;bars.push({name:'Yatay orta kayıt',vertical:false,station:split,from:xs[i]+l,to:xs[i+1]-r});add('Garnet 70 yatay orta kayıt',xs[i+1]-xs[i]-l-r,1,'Garnet70 PDF s.42');}
  for(let i=0;i<cols;i++)for(let j=0;j<zs.length-1;j++){
   const left=i===0,right=i===cols-1,bottom=j===0,top=j===zs.length-2,nx=Number(left)+Number(right),nz=Number(bottom)+Number(top),w=xs[i+1]-xs[i],h=zs[j+1]-zs[j];
   const active=e.penTip!=='sabit'&&cat.opening!=='fixed'&&(cat.active!=null?cat.active===i:e.penTip==='cift-kanat'||i===0)&&(!split||j===zs.length-2);
   const gx=xs[i]+(active?(left?98:75):(left?48:25)),gz=zs[j]+(active?(bottom?98:75):(bottom?48:25)),gw=w-deductions[active?'sashGlass':'fixedGlass'][nx],gh=h-deductions[active?'sashGlass':'fixedGlass'][nz];
   if(gw<=0||gh<=0)throw Error('Bölme cam ölçüsü negatif; bölme sayısını kontrol edin.');
   glass.push({name:'20 mm cam',x:gx,z:gz,w:gw,h:gh,depth:active?40:20,thickness:20,source:'Garnet70 PDF s.42'});
   const opening=active?(e.penTip==='vasistas'||cat.opening==='tilt'?'tilt':'tilt-turn'):'fixed';cells.push({column:i,row:j,opening,x:xs[i],z:zs[j],w,h});
   if(active){const sw=w-deductions.sash[nx]-6,sh=h-deductions.sash[nz]-6;frames.push({name:'Kanat '+(i+1),profile:'g70-sash',x:xs[i]+(left?35:12),z:zs[j]+(bottom?35:12),w:sw,h:sh,depth:20});add('Garnet 70 kanat · yatay',sw+6,2,'Garnet70 PDF s.42');add('Garnet 70 kanat · düşey',sh+6,2,'Garnet70 PDF s.42');}
  }
  return {choice,system:choice.hinged,W,H,members,glass,frames,bars,cells,sliding:false,pending:['Donanım marka/serisi ve delik reçetesi','Çıta kesim ve destek sacı reçetesinin son doğrulaması']};
 }
 window.FiratpenCore={choice,design,deductions};
})();
