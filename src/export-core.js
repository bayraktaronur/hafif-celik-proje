/* Offline PDF container and editable 2D DXF. Model coordinates are centimetres. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.PlanExportCore=api;})(globalThis,function(){
 'use strict';
 const num=n=>{if(!Number.isFinite(n))throw Error('Çıktıda geçersiz koordinat.');return +n.toFixed(6);};
 function wallPieces(d){
  const nodes=new Map(d.n.map(n=>[n.id,n])),out=[];
  for(const s of d.s){const a=nodes.get(s.n1),b=nodes.get(s.n2);if(!a||!b)continue;const L=Math.hypot(b.x-a.x,b.y-a.y);if(L<.001)continue;const ux=(b.x-a.x)/L,uy=(b.y-a.y)/L;
   if(s.tip==='veranda'){out.push({layer:'VERANDA',points:[a,b],closed:false,dashed:true});continue;}
   const spans=d.e.filter(e=>e.segId===s.id).map(e=>[Math.max(0,e.t*L),Math.min(L,e.t*L+e.en)]).sort((a,b)=>a[0]-b[0]);let cursor=-s.k/2;
   function add(lo,hi){if(hi-lo<.001)return;const h=s.k/2;out.push({layer:s.dis?'DUVAR_DIS':'DUVAR_IC',closed:true,points:[[lo,h],[hi,h],[hi,-h],[lo,-h]].map(([v,o])=>({x:a.x+ux*v-uy*o,y:a.y+uy*v+ux*o}))});}
   for(const [lo,hi] of spans){add(cursor,lo);cursor=Math.max(cursor,hi);}add(cursor,L+s.k/2);
  }return out;
 }
 function escapeText(s){return String(s).replace(/[\r\n]/g,' ').split('').map(c=>c.charCodeAt(0)>126||c==='\\'||c==='%'?'\\U+'+c.charCodeAt(0).toString(16).toUpperCase().padStart(4,'0'):c).join('');}
 function dxf(items){
  const lines=[],put=(...v)=>lines.push(...v.map(String));let handle=256;
  const defs=items.filter(e=>e.blockName);const layers=[...new Set(['0',...items.flatMap(e=>[e.layer,...(e.items||[]).map(q=>q.layer)])])];
  put(0,'SECTION',2,'HEADER',9,'$ACADVER',1,'AC1015',9,'$HANDSEED',5,'__HANDSEED__',9,'$INSUNITS',70,4,9,'$MEASUREMENT',70,1,0,'ENDSEC');
  const next=()=> (handle++).toString(16);
  const table=(name,count)=>{const h=next();put(0,'TABLE',2,name,5,h,330,0,100,'AcDbSymbolTable',70,count);return h;};
  const entry=(type,owner,sub)=>put(0,type,5,next(),330,owner,100,'AcDbSymbolTableRecord',100,sub);
  put(0,'SECTION',2,'TABLES');for(const name of ['VPORT','VIEW','UCS']){table(name,0);put(0,'ENDTAB');}put(0,'TABLE',2,'DIMSTYLE',5,next(),330,0,100,'AcDbSymbolTable',70,0,100,'AcDbDimStyleTable',71,0,0,'ENDTAB');let owner=table('LTYPE',4);
  for(const name of ['BYBLOCK','BYLAYER','CONTINUOUS']){entry('LTYPE',owner,'AcDbLinetypeTableRecord');put(2,name,70,0,3,'Solid line',72,65,73,0,40,0);}
  entry('LTYPE',owner,'AcDbLinetypeTableRecord');put(2,'DASHED',70,0,3,'Dashed',72,65,73,2,40,120,49,70,74,0,49,-50,74,0,0,'ENDTAB');
  owner=table('LAYER',layers.length);for(const l of layers){entry('LAYER',owner,'AcDbLayerTableRecord');put(2,l,70,0,62,7,6,'CONTINUOUS',290,1,370,-3,390,'0');}put(0,'ENDTAB');
  owner=table('STYLE',1);entry('STYLE',owner,'AcDbTextStyleTableRecord');put(2,'STANDARD',70,0,40,0,41,1,50,0,71,0,42,2.5,3,'Arial.ttf',4,'',0,'ENDTAB');
  owner=table('APPID',1);entry('APPID',owner,'AcDbRegAppTableRecord');put(2,'ACAD',70,0,0,'ENDTAB');
  owner=table('BLOCK_RECORD',2+defs.length);const blocks=[];for(const name of ['*Model_Space','*Paper_Space',...defs.map(e=>e.blockName)]){const h=next();blocks.push({name,h});put(0,'BLOCK_RECORD',5,h,330,owner,100,'AcDbSymbolTableRecord',100,'AcDbBlockTableRecord',2,name);}put(0,'ENDTAB',0,'ENDSEC');
  function emit(e,owner){
   const base=type=>put(0,type,5,next(),330,owner,100,'AcDbEntity',8,e.layer||'0',6,e.dashed?'DASHED':'CONTINUOUS');
   if(e.blockName){base('INSERT');put(100,'AcDbBlockReference',2,e.blockName,10,num(e.origin.x*10),20,num(-e.origin.y*10),30,0,41,1,42,1,43,1,50,0);}
   else if(e.text!==undefined){if(!e.text)return;base('TEXT');const x=num(e.x*10),y=num(-e.y*10);put(100,'AcDbText',10,x,20,y,30,0,40,num(e.height*10),1,escapeText(e.text),50,num(-(e.angle||0)*180/Math.PI),41,1,7,'STANDARD',72,e.align||0,11,x,21,y,31,0,100,'AcDbText',73,e.baseline||0);}
   else if(e.points?.length>=2){base('LWPOLYLINE');put(100,'AcDbPolyline',90,e.points.length,70,e.closed?1:0);for(const p of e.points)put(10,num(p.x*10),20,num(-p.y*10));}
  }
  put(0,'SECTION',2,'BLOCKS');for(const {name,h} of blocks){put(0,'BLOCK',5,next(),330,h,100,'AcDbEntity',8,'0',100,'AcDbBlockBegin',2,name,70,0,10,0,20,0,30,0,3,name,1,'');for(const e of defs.find(d=>d.blockName===name)?.items||[])emit(e,h);put(0,'ENDBLK',5,next(),330,h,100,'AcDbEntity',8,'0',100,'AcDbBlockEnd');}put(0,'ENDSEC');
  put(0,'SECTION',2,'ENTITIES');for(const e of items)emit(e,blocks[0].h);
  put(0,'ENDSEC',0,'SECTION',2,'OBJECTS',0,'DICTIONARY',5,next(),330,0,100,'AcDbDictionary',281,1,0,'ENDSEC',0,'EOF');return lines.join('\r\n').replace('__HANDSEED__',handle.toString(16))+'\r\n';
 }
 function pdf(jpeg,widthPx,heightPx,widthMm,heightMm){
  const enc=new TextEncoder(),parts=[];let length=0;const offsets=[0];const append=x=>{const b=typeof x==='string'?enc.encode(x):x;parts.push(b);length+=b.length;};
  const w=num(widthMm*72/25.4),h=num(heightMm*72/25.4);append('%PDF-1.4\n');
  function object(id,body){offsets[id]=length;append(id+' 0 obj\n'+body+'\nendobj\n');}
  object(1,'<< /Type /Catalog /Pages 2 0 R >>');object(2,'<< /Type /Pages /Kids [3 0 R] /Count 1 >>');
  object(3,`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${w} ${h}] /Resources << /XObject << /Im0 4 0 R >> >> /Contents 5 0 R >>`);
  offsets[4]=length;append(`4 0 obj\n<< /Type /XObject /Subtype /Image /Width ${widthPx} /Height ${heightPx} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpeg.length} >>\nstream\n`);append(jpeg);append('\nendstream\nendobj\n');
  const stream=`q\n${w} 0 0 ${h} 0 0 cm\n/Im0 Do\nQ\n`;object(5,`<< /Length ${enc.encode(stream).length} >>\nstream\n${stream}endstream`);
  const start=length;append('xref\n0 6\n0000000000 65535 f \n');for(let i=1;i<=5;i++)append(String(offsets[i]).padStart(10,'0')+' 00000 n \n');append(`trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${start}\n%%EOF\n`);
  const result=new Uint8Array(length);let pos=0;for(const p of parts){result.set(p,pos);pos+=p.length;}return result;
 }
 function pngDensity(input,dpi){
  const parts=[input.slice(0,8)],u32=(b,i)=>new DataView(b.buffer,b.byteOffset,b.byteLength).getUint32(i),chunk=new Uint8Array(21),view=new DataView(chunk.buffer);view.setUint32(0,9);chunk.set([112,72,89,115],4);view.setUint32(8,Math.round(dpi/0.0254));view.setUint32(12,Math.round(dpi/0.0254));chunk[16]=1;let crc=0xffffffff;for(const byte of chunk.slice(4,17)){crc^=byte;for(let j=0;j<8;j++)crc=(crc>>>1)^((crc&1)?0xedb88320:0);}view.setUint32(17,(crc^0xffffffff)>>>0);
  for(let i=8;i<input.length;){const n=u32(input,i),type=String.fromCharCode(...input.slice(i+4,i+8));if(i+n+12>input.length)throw Error('PNG verisi eksik.');if(type!=='pHYs')parts.push(input.slice(i,i+n+12));if(type==='IHDR')parts.push(chunk);i+=n+12;}
  const out=new Uint8Array(parts.reduce((a,b)=>a+b.length,0));let pos=0;for(const p of parts){out.set(p,pos);pos+=p.length;}return out;
 }
 return {wallPieces,dxf,pdf,pngDensity};
});
