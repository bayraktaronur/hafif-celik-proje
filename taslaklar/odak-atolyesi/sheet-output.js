/* Paper dimensions are mm. Plan geometry stays in cm; scale labels are real ratios. */
(function(root){
 'use strict';
 const PX=96/25.4,PAPERS={A4:[210,297],A3:[297,420],A2:[420,594],A1:[594,841],A0:[841,1189]},defaults={paper:'A3',orientation:'auto',scale:'fit',customScale:75,margin:10,titleBlockMode:'compact',antet:true};
 function validate(v){if(v==null)return;const n=x=>Number.isFinite(x)&&x>=1&&x<=10000;if(typeof v!=='object'||Array.isArray(v)||!PAPERS[v.paper]||!['auto','portrait','landscape'].includes(v.orientation)||!['fit','auto','20','25','50','75','100','150','200','custom'].includes(v.scale)||!n(v.customScale)||!Number.isFinite(v.margin)||v.margin<5||v.margin>30||!['compact','full'].includes(v.titleBlockMode)||typeof v.antet!=='boolean')throw Error('Sayfa ayarları geçersiz. Kenar boşluğu 5–30 mm, özel ölçek 1–10000 olmalı.');}
 function compute(record,paper,orientation,scale,antet,info={},options={}){
  const margin=options.margin??12,titleBlockMode=options.titleBlockMode||'full',header=antet?(titleBlockMode==='compact'?64:94):0,gap=antet?6:0;
  if(!PAPERS[paper]||!['portrait','landscape'].includes(orientation)||!Number.isFinite(margin)||margin<5||margin>30)throw Error('Geçersiz kâğıt, yön veya kenar boşluğu.');
  const [a,b]=PAPERS[paper],w=orientation==='landscape'?b:a,h=orientation==='landscape'?a:b,aw=w-2*margin,ah=h-2*margin-header-gap,cache=new Map();
  const measure=value=>{if(!cache.has(value)){const B=record(10*PX/value).bounds;cache.set(value,{B,width:(B.maxX-B.minX)/PX,height:(B.maxY-B.minY)/PX});}return cache.get(value);},fits=m=>m.width<=aw&&m.height<=ah;
  if(scale==='fit'){
   let lo=1,hi=100,m=measure(hi);hi=Math.max(1,hi*Math.max(m.width/aw,m.height/ah));
   while(!fits(measure(hi))&&hi<10000)hi=Math.min(10000,hi*1.5);
   if(!fits(measure(hi)))throw Error('Plan bu sayfaya sığmıyor. Daha büyük kâğıt seçin.');
   for(let i=0;i<18;i++){const mid=(lo+hi)/2;if(fits(measure(mid)))hi=mid;else lo=mid;}
   scale=Math.ceil(hi*10)/10;while(!fits(measure(scale))&&scale<10000)scale=Math.round((scale+.1)*10)/10;
  }else scale=Number(scale);
  if(!Number.isFinite(scale)||scale<1||scale>10000)throw Error('Ölçek 1–10000 arasında olmalı.');
  const {B,width,height}=measure(scale);if(!fits({width,height}))throw Error(`Plan 1:${scale} ölçekte bu sayfaya sığmıyor. Sayfaya sığdır veya daha büyük kâğıt seçin.`);
  const dpi=[300,200,150].find(d=>w*h*d*d/(25.4*25.4)<=40000000);
  return {paper,orientation,scale,w,h,s:10*PX/scale,dpi,antet,info,margin,titleBlockMode,titleHeight:header,bounds:B,available:{width:aw,height:ah},drawing:{width,height},score:Math.abs(Math.log(Math.max(1,width)/Math.max(1,height)/(aw/ah))),pan:{x:(w*PX-(B.maxX-B.minX))/2-B.minX,y:margin*PX+(ah*PX-(B.maxY-B.minY))/2-B.minY}};
 }
 function recommend(record,paper,orientation='auto',scale='auto',antet=true,info={},options={}){
  const choices=[];for(const dir of orientation==='auto'?['portrait','landscape']:[orientation])for(const value of scale==='auto'?[20,25,50,75,100,150,200]:[scale]){try{choices.push(compute(record,paper,dir,value,antet,info,options));break;}catch(e){if(!/sığmıyor/.test(e.message))throw e;}}
  if(!choices.length)throw Error('Plan seçili kâğıda sığmıyor. Sayfaya sığdır veya daha büyük kâğıt seçin.');return choices.sort((a,b)=>a.scale-b.scale||a.score-b.score)[0];
 }
 function read(){const $=id=>document.getElementById(id),v={paper:$('exportPaper').value,orientation:$('exportOrientation').value,scale:$('exportScale').value,customScale:+$('exportCustomScale').value,margin:+$('exportMargin').value,titleBlockMode:$('exportTitleMode').value,antet:$('exportAntet').checked};validate(v);return v;}
 function restore(value){validate(value);const v={...defaults,...value},$=id=>document.getElementById(id);for(const [id,key]of [['Paper','paper'],['Orientation','orientation'],['Scale','scale'],['CustomScale','customScale'],['Margin','margin'],['TitleMode','titleBlockMode']])$('export'+id).value=v[key];$('exportAntet').checked=v.antet;sync();}
 function sync(){const $=id=>document.getElementById(id);$('exportCustomWrap').hidden=$('exportScale').value!=='custom';$('exportTitleMode').disabled=!$('exportAntet').checked;}
 function setup(dialog,change){
  const $=id=>document.getElementById(id),form=dialog.querySelector('form');dialog.classList.add('sheet-workspace');
  $('exportScale').innerHTML='<option value="fit">Sayfaya sığdır · en büyük</option><option value="auto">Standart ölçek öner</option>'+[20,25,50,75,100,150,200].map(n=>'<option value="'+n+'">1:'+n+'</option>').join('')+'<option value="custom">Özel ölçek</option>';
  $('exportPdfOptions').insertAdjacentHTML('beforeend','<label id="exportCustomWrap" hidden>Özel ölçek · 1:<input id="exportCustomScale" type="number" min="1" max="10000" step="0.1" value="75"></label><label>Kenar boşluğu · mm<input id="exportMargin" type="number" min="5" max="30" step="1" value="10"></label>');
  $('sheetOptions').firstElementChild.insertAdjacentHTML('afterend','<label>Antet düzeni<select id="exportTitleMode"><option value="compact">Kompakt · çizime daha fazla alan</option><option value="full">Ayrıntılı · büyük bilgi alanı</option></select></label>');
  const body=document.createElement('div');body.className='sheet-body';const controls=document.createElement('aside'),preview=document.createElement('section');controls.className='sheet-controls';preview.className='sheet-preview';preview.setAttribute('aria-label','Baskı önizlemesi');body.append(controls,preview);
  const heading=$('exportTitle');heading.insertAdjacentElement('afterend',body);for(const id of ['exportPdfOptions','sheetOptions','exportDescription','dxfOptions'])controls.append($(id));
  preview.append($('exportPreview'),$('exportStatus'));const footer=document.createElement('footer');footer.className='sheet-footer';const note=document.createElement('span');note.textContent='PDF / PNG ayarları projeyle kaydedilir. Baskı: %100 / Gerçek boyut.';footer.append(note,$('exportCancel'),$('exportSubmit'));form.append(footer);$('exportSubmit').textContent='Çıktıyı indir';
  const help=[...form.children].find(e=>e.tagName==='P');if(help)controls.append(help);$('exportPreview').onclick=null;$('exportPreview').title='İndirilen sayfayla aynı yerleşim';$('exportPreview').style.cursor='default';
  for(const id of ['exportPaper','exportOrientation','exportScale','exportMargin','exportCustomScale','exportTitleMode','exportAntet'])$(id).onchange=()=>{sync();change();};restore();
 }
 function paintCompact(c,l,info,images){
  const w=l.w-2*l.margin,x=l.margin,y=l.h-l.margin-64,ink='#233b46',muted='#617882',edge='#becdd1';c.save();c.scale(PX,PX);c.translate(x,y);c.textAlign='left';c.textBaseline='top';c.lineWidth=.2;
  function text(v,x,y,width,size=2.5,bold=false,lines=1){c.font=(bold?'600 ':'')+size+'px sans-serif';c.fillStyle=ink;const words=String(v||'—').replace(/[\r\n]+/g,' ').split(/\s+/);let rows=[],line='';for(const word of words){if(line&&c.measureText(line+' '+word).width>width){rows.push(line);line=word;}else line+=(line?' ':'')+word;}rows.push(line);rows=rows.slice(0,lines);rows.forEach((s,i)=>{while(c.measureText(s).width>width&&s.length>1)s=s.slice(0,-2)+'…';c.fillText(s,x,y+i*size*1.22);});}
  function cell(label,value,x,y,width,height){c.strokeStyle=edge;c.strokeRect(x,y,width,height);c.fillStyle=muted;c.font='1.8px sans-serif';c.fillText(label.toLocaleUpperCase('tr-TR'),x+2,y+1);text(value,x+2,y+3.6,width-4,2.35,true,height>=11?2:1);}
  c.fillStyle='#fff';c.fillRect(0,0,w,64);c.strokeStyle=edge;c.strokeRect(0,0,w,64);c.fillStyle='#eef4f3';c.fillRect(0,0,w,13);c.fillStyle='#287565';c.fillRect(0,0,w,.7);
  const logoW=Math.min(65,w*.25),img=images.get(info.logo?.join(''));if(img){const k=Math.min((logoW-6)/img.width,9/img.height);c.drawImage(img,3,2,img.width*k,img.height*k);}else text(info.company||'PREFABRİKTEN',3,3,logoW-6,3.2,true,2);
  text(info.title||'Kat planı',logoW+3,2,w-logoW-42,3.1,true);text(Studio.state().projectName,logoW+3,7,w-logoW-42,2.4);cell('Pafta / ölçek',(info.sheetNo||'A-01')+' · 1:'+l.scale,w-38,1,38,12);
  cell('Müşteri',info.customer,0,13,w*.3,9);cell('Proje yeri',info.location,w*.3,13,w*.45,9);cell('Proje no',info.projectNo,w*.75,13,w*.25,9);
  const date=/^\d{4}-\d{2}-\d{2}$/.test(info.date||'')?info.date.split('-').reverse().join('.'):info.date;[['Tarih',date],['Çizen',info.drawnBy],['Kontrol eden',info.checkedBy],['Revizyon',info.revision]].forEach(([k,v],i)=>cell(k,v,w*i/4,22,w/4,8));
  const d=Studio.state(),fmt=n=>Number(n).toLocaleString('tr-TR',{maximumFractionDigits:1}),spec=TitleBlock.specifications(),area=G.rooms.filter(r=>r.tip!=='veranda').reduce((s,r)=>s+r.area,0),ver=G.rooms.filter(r=>r.tip==='veranda').reduce((s,r)=>s+r.area,0);
  [['Yapı / yükseklik',d.sistem==='prefabrik'?'Prefabrik · '+fmt(d.ky)+' cm':'Çelik · Kat '+fmt(d.ky)+' / dış '+fmt(d.dy)+' cm'],['Duvarlar','İç '+fmt(d.opt.ic)+' / dış '+fmt(d.opt.dis)+' cm'],['Alanlar','Kapalı '+fmt(area)+' / veranda '+fmt(ver)+' m²']].forEach(([k,v],i)=>cell(k,v,w*i/3,30,w/3,8));
  [['Çatı kaplaması',spec.roof],['Duvar kaplaması',spec.walls],['Tavan kaplaması',spec.ceiling]].forEach(([k,v],i)=>cell(k,v,w*i/3,38,w/3,11));
  [['Dış cephe',spec.facade],['Pencere rengi',spec.windowColor],['H kapak lata',spec.hCover]].forEach(([k,v],i)=>cell(k,v,w*i/3,49,w/3,8));
  text(info.notes||spec.stock,2,58,w-55,2.1);text(info.contact,2,61,w-55,1.8);text(l.paper+' · Ölçüler cm · Baskı %100',w-52,59,50,1.9);c.restore();
 }
 root.SheetOutput={defaults,validate,compute,recommend,read,restore,sync,setup,paintCompact};
})(typeof window==='undefined'?globalThis:window);
