/* Plan-only export. No cloud dependency and no changes to the saved model. */
(function(){
 'use strict';
 const $=id=>document.getElementById(id),PX=96/25.4,PAPERS={A4:[210,297],A3:[297,420],A2:[420,594],A1:[594,841],A0:[841,1189]};let format='pdf';
 const dialog=document.createElement('dialog');dialog.id='planExportDialog';dialog.style.cssText='background:#192334;color:#d6e6ef;border:1px solid #40566b;border-radius:12px;padding:24px;width:560px;max-width:90vw;max-height:90vh;overflow:auto';
 dialog.innerHTML='<form><h3 id="exportTitle">Plan çıktısı</h3><div id="exportPdfOptions" style="display:flex;gap:12px"><label>Kâğıt<select id="exportPaper"><option>A4</option><option selected>A3</option><option>A2</option><option>A1</option><option>A0</option></select></label><label>Yön<select id="exportOrientation"><option value="portrait" selected>Dikey</option><option value="landscape">Yatay</option></select></label><label>Ölçek<select id="exportScale"><option value="20">1:20</option><option value="50" selected>1:50</option><option value="100">1:100</option><option value="200">1:200</option></select></label></div><p id="exportDescription"></p><p id="exportStatus" role="status"></p><img id="exportPreview" alt="PDF sayfa önizlemesi" style="width:100%;max-height:310px;object-fit:contain;background:#fff"><p style="font-size:12px">Seçili görünüm filtreleri kullanılır. H, U ve köşe bağlantıları korunur. Kat planı çıktısıdır; 3B model veya imalat onayı değildir.</p><button class="sib" id="exportSubmit" type="submit">İndir</button><button class="sib" id="exportCancel" type="button">Vazgeç</button></form>';
 document.body.append(dialog);dialog.querySelectorAll('select').forEach(el=>el.style.cssText='display:block;padding:8px;margin:6px 0;background:#101b29;color:#d6e6ef');
 for(const [type,label] of [['pdf','PDF çıktı'],['dxf','DXF çıktı']]){const b=document.createElement('button');b.id='export-'+type;b.className='tb';b.textContent=label;b.onclick=()=>open(type);document.querySelector('.header-actions').append(b);}
 function render(target,s,pan={x:0,y:0}){
  const save={zoom:G.zoom,pan:G.pan,secili:G.secili,seciliTip:G.seciliTip,selSegs:G.selSegs,selPanels:G.selPanels,wallDrag:G.wallDrag,lblDrag:G.lblDrag,drawing:G.drawing,snapPt:G.snapPt},old={ctx,TH,DIM};
  try{Object.assign(G,{zoom:s/G.scale,pan,secili:null,seciliTip:null,selSegs:[],selPanels:[],wallDrag:null,lblDrag:null,drawing:false,snapPt:null});ctx=target;TH=TH_PAPER;DIM=DIM_PAPER;
   for(const [name,fn] of [['ODA',drawRooms],['MAKAS',drawMakas],['DUVAR',drawSegs],['PANEL_BAGLANTI',drawPanels],['KAPLAMA',drawAlciGorsel],['DONATI_METIN',drawElemanlar],['OLCU',drawDims]]){target.setLayer?.(name);fn();}
  }finally{Object.assign(G,save);ctx=old.ctx;TH=old.TH;DIM=old.DIM;draw();}
 }
 function record(s=1){const r=PlanCanvasRecorder();render(r,s);if(!Number.isFinite(r.bounds.minX))throw Error('Önce bir plan veya metin oluşturun.');return r;}
 function layout(paper,orientation,scale){
  if(!PAPERS[paper]||![20,50,100,200].includes(scale))throw Error('Geçersiz kâğıt veya ölçek.');const [a,b]=PAPERS[paper],w=orientation==='landscape'?b:a,h=orientation==='landscape'?a:b,s=10*PX/scale;
  const r=record(s),B=r.bounds,width=(B.maxX-B.minX)/PX,height=(B.maxY-B.minY)/PX,aw=w-24,ah=h-52;
  if(width>aw||height>ah)throw Error(`Plan bu sayfaya 1:${scale} ölçekte sığmıyor (${Math.ceil(width)} × ${Math.ceil(height)} mm). Daha büyük kâğıt veya 1:${scale<100?100:200} ölçek seçin.`);
  const dpi=[300,200,150].find(d=>w*h*d*d/(25.4*25.4)<=40000000);return {paper,orientation,scale,w,h,s,dpi,bounds:B,pan:{x:(w*PX-(B.maxX-B.minX))/2-B.minX,y:20*PX+(ah*PX-(B.maxY-B.minY))/2-B.minY}};
 }
 function pageCanvas(l,dpi=l.dpi){
  const out=document.createElement('canvas'),W=l.w*PX,H=l.h*PX;out.width=Math.ceil(l.w*dpi/25.4);out.height=Math.ceil(l.h*dpi/25.4);
  if(out.width*out.height>150000000)throw Error('Bu sayfa çözünürlüğü çok büyük. Daha küçük kâğıt seçin.');
  const c=out.getContext('2d');if(!c)throw Error('Çıktı tuvali oluşturulamadı.');c.setTransform(out.width/W,0,0,out.height/H,0,0);c.fillStyle='#fff';c.fillRect(0,0,W,H);render(c,l.s,l.pan);
  c.fillStyle='#253649';c.textAlign='left';c.textBaseline='top';c.font='bold 13px sans-serif';c.fillText('PREFABRİKTEN / PLAN STUDIO',12*PX,8*PX);
  c.textAlign='right';c.font='11px sans-serif';c.fillText('KAT PLANI · '+l.paper+' · 1:'+l.scale,(l.w-12)*PX,8*PX);
  c.strokeStyle='#c5ccd3';c.lineWidth=.7;c.beginPath();c.moveTo(12*PX,(l.h-27)*PX);c.lineTo((l.w-12)*PX,(l.h-27)*PX);c.stroke();
  c.textAlign='left';c.font='bold 12px sans-serif';let title=Studio.state().projectName||'Yeni proje';while(c.measureText(title).width>(l.w-95)*PX&&title.length>1)title=title.slice(0,-2)+'…';c.fillText(title,12*PX,(l.h-23)*PX);
  c.font='10px sans-serif';c.fillText('Ölçü yazıları: cm · Yazdırma: %100 / Gerçek boyut',12*PX,(l.h-17)*PX);c.fillText('Kat planı sunumu · İmalat onayı değildir',12*PX,(l.h-12)*PX);
  const bar=100*l.s,x=(l.w-12)*PX-bar,y=(l.h-18)*PX;c.fillStyle='#253649';c.fillRect(x,y,bar/2,3);c.fillStyle='#bdc6cf';c.fillRect(x+bar/2,y,bar/2,3);c.strokeRect(x,y,bar,3);c.fillStyle='#253649';c.fillText('0',x,y+6);c.textAlign='right';c.fillText('1 m',x+bar,y+6);
  return out;
 }
 function makePdf(l){const canvas=pageCanvas(l),data=atob(canvas.toDataURL('image/jpeg',.97).split(',')[1]),bytes=Uint8Array.from(data,c=>c.charCodeAt(0));return PlanExportCore.pdf(bytes,canvas.width,canvas.height,l.w,l.h);}
 function makeDxf(){const r=record(1);return PlanExportCore.dxf([...PlanExportCore.wallPieces(Studio.state()),...r.items]);}
 function download(data,ext,mime){const name=(Studio.state().projectName||'plan').replace(/[<>:"/\\|?*\x00-\x1f]/g,'_'),url=URL.createObjectURL(new Blob([data],{type:mime})),a=document.createElement('a');a.href=url;a.download=name+'.'+ext;a.click();setTimeout(()=>URL.revokeObjectURL(url),30000);}
 function chosen(){return layout($('exportPaper').value,$('exportOrientation').value,+$('exportScale').value);}
 function refresh(){try{if(format==='pdf'){const l=chosen();$('exportPreview').src=pageCanvas(l,72).toDataURL('image/png');$('exportPreview').hidden=false;$('exportStatus').textContent=`${l.w} × ${l.h} mm · 1:${l.scale} · ${l.dpi} dpi · Tek sayfa`;}else{record(1);$('exportPreview').hidden=true;$('exportStatus').textContent='1:1 model · 1 birim = 1 mm · Yazılı ölçüler cm olarak korunur.';}$('exportSubmit').disabled=false;}catch(e){$('exportPreview').hidden=true;$('exportStatus').textContent=e.message;$('exportSubmit').disabled=true;}}
 function open(type){format=type;$('exportTitle').textContent=type==='pdf'?'Ölçekli PDF plan çıktısı':'AutoCAD için DXF çıktısı';$('exportPdfOptions').hidden=type!=='pdf';$('exportPdfOptions').style.display=type==='pdf'?'flex':'none';$('exportDescription').textContent=type==='pdf'?'PDF, yüksek çözünürlüklü plan görseli içerir. Yazdırırken %100 / Gerçek boyut seçin; sayfaya sığdır seçeneğini kapatın.':'Düzenlenebilir 2B çizgiler ve yazılar, ayrı katmanlarda kaydedilir. Ölçüler çizgi/yazıdır; eğriler çoklu çizgidir. Bu dosya DWG değildir; AutoCAD’de açıp DWG olarak kaydedebilirsiniz.';refresh();dialog.showModal();}
 dialog.querySelectorAll('select').forEach(el=>el.onchange=refresh);$('exportCancel').onclick=()=>dialog.close();
 dialog.querySelector('form').onsubmit=e=>{e.preventDefault();try{if(format==='pdf')download(makePdf(chosen()),'pdf','application/pdf');else download(makeDxf(),'dxf','application/dxf');dialog.close();Studio.toast(format.toUpperCase()+' çıktısı hazırlandı.');}catch(err){$('exportStatus').textContent=err.message;Studio.toast(err.message,true);}};
 window.PlanExport={open,record,layout,pageCanvas,makePdf,makeDxf};
})();
