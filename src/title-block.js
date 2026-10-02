/* Shared PDF/PNG title block. Logo is embedded in the project, never fetched. */
(function(){
 'use strict';
 const images=new Map(),fields=[['company','Firma'],['customer','Müşteri'],['projectNo','Proje no'],['location','Proje yeri / adres'],['drawnBy','Çizen'],['checkedBy','Kontrol eden'],['date','Tarih'],['revision','Revizyon'],['sheetNo','Pafta no'],['title','Pafta başlığı'],['contact','Firma iletişim'],['notes','Proje notu']];
 async function ready(info){const url=info.logo?.join('');if(!url)return;if(images.has(url))return images.get(url);const image=new Image();image.src=url;await image.decode();if(!image.width||!image.height)throw Error('Logo açılamadı.');images.set(url,image);return image;}
 async function importLogo(file){if(!['image/png','image/jpeg','image/webp'].includes(file.type)||file.size>5*1024*1024)throw Error('Logo PNG, JPG veya WebP olmalı; en fazla 5 MB.');const url=URL.createObjectURL(file);try{const img=new Image();img.src=url;await img.decode();if(img.width>8000||img.height>8000)throw Error('Logo boyutu çok büyük.');const s=Math.min(1,600/img.width,220/img.height),c=document.createElement('canvas');c.width=Math.max(1,Math.round(img.width*s));c.height=Math.max(1,Math.round(img.height*s));c.getContext('2d').drawImage(img,0,0,c.width,c.height);const data=c.toDataURL('image/png');if(data.length>320000)throw Error('Logo çok ayrıntılı; daha sade veya küçük bir görsel seçin.');return data.match(/.{1,8000}/g);}finally{URL.revokeObjectURL(url);}}
 function paint(c,l,info){
  const px=96/25.4,x=12,y=l.h-82,w=l.w-24,ink='#223946',muted='#647883',edge='#bdcbd0';c.save();c.scale(px,px);c.translate(x,y);c.textAlign='left';c.textBaseline='top';c.lineWidth=.2;
  function text(value,x,y,width,size=2.7,lines=1,bold=false,color=ink){c.font=(bold?'600 ':'')+size+'px sans-serif';c.fillStyle=color;const words=String(value||'—').replace(/[\r\n]+/g,' ').split(/\s+/);let rows=[],line='';for(const word of words){if(line&&c.measureText(line+' '+word).width>width){rows.push(line);line=word;}else line+=(line?' ':'')+word;}if(line)rows.push(line);if(rows.length>lines)rows=rows.slice(0,lines).map((s,i)=>i===lines-1?s+'…':s);rows.forEach((s,i)=>{while(c.measureText(s).width>width&&s.length>1)s=s.slice(0,-2)+'…';c.fillText(s,x,y+i*size*1.25);});}
  function rect(x,y,w,h,bg){if(bg){c.fillStyle=bg;c.fillRect(x,y,w,h);}c.strokeStyle=edge;c.strokeRect(x,y,w,h);}
  function cell(label,value,x,y,w,h){rect(x,y,w,h);text(label.toLocaleUpperCase('tr-TR'),x+2.5,y+1.7,w-5,1.8,1,false,muted);text(value,x+2.5,y+5,w-5,2.55,h>=13?2:1,true);}
  rect(0,0,w,70,'#ffffff');rect(0,0,w,19,'#eef4f3');c.fillStyle='#287565';c.fillRect(0,0,w,.8);
  const logoW=Math.min(70,w*.26),metaW=35,titleW=w-logoW-metaW,url=info.logo?.join(''),img=url&&images.get(url);
  if(url&&!img){c.restore();throw Error('Logo hazırlanıyor; çıktı ekranını yeniden açın.');}
  if(img){const s=Math.min((logoW-7)/img.width,12/img.height);c.drawImage(img,3.5+(logoW-7-img.width*s)/2,2,img.width*s,img.height*s);text(info.company||'PREFABRİKTEN',3.5,15,logoW-7,1.9,1,true);}else{text(info.company||'PREFABRİKTEN',3.5,5,logoW-7,3.6,2,true);}
  text(info.title||'Kat planı',logoW+3,3,titleW-6,3.6,1,true);text(Studio.state().projectName,logoW+3,9,titleW-6,2.6,2);cell('Pafta / ölçek',(info.sheetNo||'A-01')+'  ·  1:'+l.scale,w-metaW,1,metaW,18);
  let cy=19;const widths=[.35,.4,.25];let cx=0;[['Müşteri',info.customer],['Proje yeri',info.location],['Proje no',info.projectNo]].forEach(([k,v],i)=>{cell(k,v,cx,cy,w*widths[i],12);cx+=w*widths[i];});
  cy+=12;const date=/^\d{4}-\d{2}-\d{2}$/.test(info.date||'')?info.date.split('-').reverse().join('.'):info.date;[['Tarih',date],['Çizen',info.drawnBy],['Kontrol eden',info.checkedBy],['Revizyon',info.revision]].forEach(([k,v],i)=>cell(k,v,w*i/4,cy,w/4,11));
  cy+=11;const d=Studio.state(),fmt=n=>Number(n).toLocaleString('tr-TR',{maximumFractionDigits:1}),closed=G.rooms.filter(r=>r.tip!=='veranda').reduce((a,r)=>a+r.area,0),ver=G.rooms.filter(r=>r.tip==='veranda').reduce((a,r)=>a+r.area,0);
  const type=(d.sistem==='prefabrik'?'Prefabrik':'Hafif çelik'),height=d.sistem==='prefabrik'?'Duvar '+fmt(d.ky)+' cm':'Kat '+fmt(d.ky)+' / dış '+fmt(d.dy)+' cm';
  [['Yapı sistemi',type],['Yükseklik / duvar',height+(d.sistem==='prefabrik'?' · Dış '+fmt(d.opt.dis)+' / iç '+fmt(d.opt.ic)+' cm':'')],['Kapalı alan · aks',fmt(closed)+' m²'],['Veranda · aks',fmt(ver)+' m²']].forEach(([k,v],i)=>cell(k,v,w*i/4,cy,w/4,15));
  cy+=15;text(info.notes||'Kat planı',3,cy+2,w-45,2.3,2);text(info.contact,3,cy+8,w-45,1.9,1,false,muted);text(l.paper+' · '+(l.orientation==='portrait'?'Dikey':'Yatay')+' · Ölçüler cm',w-42,cy+2,39,1.9);text('PDF yazdırma: %100 / Gerçek boyut',w-42,cy+6,39,1.6);
  c.restore();
 }
 window.TitleBlock={fields,ready,importLogo,paint,height:70};
})();
