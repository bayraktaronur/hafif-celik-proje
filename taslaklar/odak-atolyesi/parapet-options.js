/* Parapet roof assemblies and per-edge overhangs for the independent draft. */
(function(){
 'use strict';
 const defaults=[
  {name:'Shingle · OSB + membran',material:'shingle',layers:['membran','osb']},
  {name:'Sandviç panel',material:'sandvic',layers:[]},
  {name:'Trapez sac · nem bariyeri',material:'trapez',layers:['nem']}
 ];
 const $=id=>document.getElementById(id);
 const designName='Parapet çatı',initialHeight=30;
 function drawingSettings(){
  const style=$('roofBoundaryType').value;
  function value(id,min,max){
   const el=$(id),n=el.valueAsNumber;
   if(!Number.isFinite(n)||n<min||n>max)throw Error(el.labels[0].firstChild.textContent+' için '+min.toLocaleString('tr-TR')+'–'+max.toLocaleString('tr-TR')+' arasında bir değer girin.');
   return n;
  }
  const pitch=value('roofDrawPitch',1,200);
  if(style==='parapet'){
   return {type:$('parapetDrawInner').value,parapet:value('parapetDrawHeight',.01,300),
    pitch,eave:value('parapetDrawOffset',0,500),eaveRule:undefined};
  }
  const gableMm=value('roofDrawGable',1,5000),sideMm=value('roofDrawSide',0,5000);
  return {type:style,parapet:0,pitch,eave:sideMm/10,eaveRule:{gableMm,sideMm}};
 }
 function drawingControls(create){
  const style=$('roofBoundaryType'),styleLabel=style.closest('label'),panel=style.closest('section');
  style.add(new Option(designName,'parapet'));
  panel.querySelector('h3').after(styleLabel);
  const fields=document.createElement('div');
  fields.innerHTML='<label>İç çatı biçimi<select id="parapetDrawInner"><option value="tek">Tek eğim</option><option value="besik">Beşik</option><option value="kirma">Kırma</option></select></label>'+
   '<label>Örtünün üstünden parapet yüksekliği · cm<input id="parapetDrawHeight" type="number" min="0.01" max="300" step="any" required></label>'+
   '<label>Saçak çıkması · cm<input id="parapetDrawOffset" type="number" min="0" max="500" step="any" value="40" required></label>';
  styleLabel.after(fields);$('parapetDrawHeight').value=initialHeight;
  const gable=$('roofDrawGable').closest('label'),side=$('roofDrawSide').closest('label');
  const note=side.nextElementSibling;
  const shortcut=document.createElement('button');shortcut.id='drawParapetRoof';shortcut.type='button';
  shortcut.textContent='Parapet çatı çiz';create.querySelector('summary').after(shortcut);
  function sync(){
   const on=style.value==='parapet';fields.hidden=!on;gable.hidden=side.hidden=on;
   if(note?.tagName==='P')note.hidden=on;
   $('roofBoundaryMain').textContent=on?'Parapet sınırını çiz':'Ana çatı sınırını çiz';
  }
  style.addEventListener('change',sync);sync();
  shortcut.onclick=()=>{
   const draft=RoofWorkflow.getDraft();
   if(draft?.openU&&draft.points.length){RoofStudio.notice('Önce yavru çatı sınırını tamamlayın veya Esc ile iptal edin.',true);return;}
   create.open=true;panel.closest('details').open=true;style.value='parapet';sync();
   if(draft&&!draft.openU){
    style.dispatchEvent(new Event('input',{bubbles:true}));
    RoofStudio.setView('plan');
   }else RoofWorkflow.start(false);
   styleLabel.scrollIntoView({block:'nearest'});
  };
 }
 function designFields(z){
  const style=$('rz_type'),height=$('rz_parapet'),ridge=$('rz_ridge');
  const inner=style.cloneNode(true);
  inner.id='parapetEditInner';inner.name='parapetInner';
  const innerField=label('İç çatı biçimi',inner),styleField=style.closest('label');
  const heightField=height.closest('label'),heightPlace=document.createComment('parapet height');
  heightField.before(heightPlace);
  heightField.firstChild.textContent='Örtünün üstünden parapet yüksekliği · cm';
  styleField.after(innerField);style.add(new Option(designName,'parapet'));
  if(z.parapet>0)style.value='parapet';
  let underlying=z.type;
  function sync(){
   const on=style.value==='parapet';
   innerField.hidden=!on;inner.disabled=!on||style.disabled;
   if(on)innerField.after(heightField);else heightPlace.after(heightField);
   const shape=on?inner.value:style.value;
   ridge.disabled=shape!=='besik';underlying=shape;
  }
  style.addEventListener('change',()=>{
   if(style.value==='parapet'){
    inner.value=underlying;if(!(height.valueAsNumber>0))height.value=initialHeight;
   }else height.value=0;
   height.dispatchEvent(new Event('input'));sync();
  });
  inner.addEventListener('change',sync);
  height.addEventListener('input',()=>{
   if(height.valueAsNumber>0&&style.value!=='parapet'){inner.value=style.value;style.value='parapet';}
   else if(height.valueAsNumber===0&&style.value==='parapet')style.value=inner.value;
   sync();
  });
  sync();
 }
 const finishes={
  plaster:{name:'Sıva',color:'#e3e0d3'},
  wood:{name:'Ahşap',color:'#916e4f'},
  custom:{name:'Özel kaplama',color:'#aba59b'}
 };
 function validateFinish(value){
  if(value===undefined)return;
  if(!value||!Object.hasOwn(finishes,value.type))throw Error('Saçak altı kaplamasını seçin.');
  if(value.type==='custom'&&
     (typeof value.name!=='string'||!value.name.trim()||value.name.length>80||!/^#[0-9a-f]{6}$/i.test(value.color)))
   throw Error('Özel saçak altı kaplaması için ad ve renk girin.');
 }
 function finishOf(z){
  const type=z.soffitFinish?.type||'plaster';
  return {type,...finishes[type],...z.soffitFinish};
 }
 function finishFields(z,section){
  const saved=finishOf(z),group=document.createElement('fieldset'),legend=document.createElement('legend');
  legend.textContent='Saçak altı kaplaması';
  const select=document.createElement('select'),name=document.createElement('input'),color=document.createElement('input');
  select.name='soffitType';for(const [key,finish] of Object.entries(finishes))select.add(new Option(finish.name,key));
  select.value=saved.type;name.name='soffitName';name.maxLength=80;name.required=true;
  name.value=saved.type==='custom'?saved.name:'';color.name='soffitColor';color.type='color';
  color.value=saved.type==='custom'?saved.color:finishes.custom.color;
  const nameField=label('Malzeme adı',name),colorField=label('Görünüş rengi',color);
  group.append(legend,label('Malzeme',select),nameField,colorField);section.append(group);
  function sync(){
   group.hidden=!(Number($('rz_parapet').value)>0);
   group.disabled=group.hidden;
   nameField.hidden=colorField.hidden=name.disabled=color.disabled=select.value!=='custom';
  }
  $('rz_parapet').addEventListener('input',sync);select.onchange=sync;sync();
 }
 function label(text,input){const l=document.createElement('label');l.textContent=text;l.append(input);return l;}
 function assembly(z){
  const material=$('rz_material'),area=material.closest('details'),select=document.createElement('select');
  select.id='roofAssembly';select.add(new Option('Dizilim seç…',''));
  const library=new Map(defaults.map(p=>[p.name,p]));
  for(const saved of G.roofAssemblies||[])library.set(saved.name,saved);
  const choices=[...library.values()];
  choices.forEach((p,i)=>select.add(new Option(p.name,String(i))));
  const explicitOrder=document.createElement('input');explicitOrder.type='hidden';explicitOrder.name='assemblyLayerOrder';
  select.onchange=()=>{
   if(select.value==='')return;
   const p=choices[Number(select.value)];
   explicitOrder.value='top-down';
   if(material.value!==p.material){material.value=p.material;material.dispatchEvent(new Event('change'));}
   const rows=$('roofLayerFields');
   for(const row of rows.children)row.querySelector('input[type=checkbox]').checked=false;
   for(const field of [...p.layers].reverse()){
    const id=typeof field==='string'?field:field.id;
    const row=rows.querySelector('[data-layer="'+id+'"]');rows.prepend(row);
    row.querySelector('input[type=checkbox]').checked=true;
    if(typeof field==='object')for(const key of ['width','length','overlapWidth','overlapLength','fire'])row.querySelector('[name="layer_'+id+'_'+key+'"]').value=field[key];
   }
   if(p.width&&$('rz_width'))$('rz_width').value=p.width;
   const pack=$('roofForm').elements.packageArea;if(pack&&p.packageArea)pack.value=p.packageArea;
  };
  area.querySelector('summary').after(label('Çatı katman dizilimi',select),explicitOrder);
  const save=document.createElement('details'),summary=document.createElement('summary'),name=document.createElement('input');
  summary.textContent='Dizilimi projede sakla';summary.id='roofAssemblySave';name.name='assemblyName';name.maxLength=60;
  save.append(summary,label('Alternatif adı · aynı ad güncellenir',name));area.append(save);
 }
 function remember(next,data){
  const name=String(data.get('assemblyName')||'').trim();if(!name)return;
  const value={name,material:next.material,layers:structuredClone(next.layers),width:next.width,packageArea:next.packageArea};
  const list=[...(G.roofAssemblies||[])],idx=list.findIndex(p=>p.name===name);
  if(idx<0)list.push(value);else list[idx]=value;
  validate(list,G.roofMaterials);G.roofAssemblies=list;
 }
 function validate(list,materials){
  if(list===undefined)return;
  if(!Array.isArray(list)||list.length>200)throw Error('Projedeki çatı dizilimlerini kontrol edin (en fazla 200).');
  for(const p of list){
   if(!p||typeof p.name!=='string'||!p.name.trim()||p.name.length>60||!Array.isArray(p.layers))throw Error('Çatı dizilimi geçersiz.');
   RoofCore.validate([RoofCore.defaults({id:'assembly',name:'Katman dizilimi',material:p.material,width:p.width,packageArea:p.packageArea,layers:p.layers})],materials||[]);
  }
 }
 function edgePicker(z,polygon,fields){
  const frame=z.attachment?.base||z,local=polygon||RoofCore.basePolygon({...frame,type:'tek'});
  const world=local.map(p=>RoofCore.transform(frame,p)),xs=world.map(p=>p.x),ys=world.map(p=>p.y);
  const x=Math.min(...xs),y=Math.min(...ys),w=Math.max(...xs)-x,h=Math.max(...ys)-y;
  const scale=Math.min(218/w,104/h);
  const points=world.map(p=>({x:(260-w*scale)/2+(p.x-x)*scale,y:(144-h*scale)/2+(p.y-y)*scale}));
  const canvas=document.createElement('canvas');canvas.width=520;canvas.height=288;
  canvas.className='roof-edge-picker';canvas.style.cssText='display:block;width:100%;max-width:260px;cursor:pointer';
  canvas.setAttribute('aria-label','Plandaki kenara tıklayarak çıkma ölçüsünü seç');
  const segments=points.map((a,i)=>({a,b:points[(i+1)%points.length],index:polygon?i:[2,1,3,0][i]}));
  const draw=active=>{
   const c=canvas.getContext('2d');c.setTransform(2,0,0,2,0,0);c.clearRect(0,0,260,144);
   for(const {a,b,index} of segments){
    const selected=index===active;c.strokeStyle=selected?'#92dfc4':'#8498a4';c.lineWidth=selected?4:2;
    c.beginPath();c.moveTo(a.x,a.y);c.lineTo(b.x,b.y);c.stroke();
   }
   for(const {a,b,index} of segments){
    const mx=(a.x+b.x)/2,my=(a.y+b.y)/2;
    c.fillStyle='#253743';c.beginPath();c.arc(mx,my,9,0,Math.PI*2);c.fill();
    c.fillStyle='#fff';c.textAlign='center';c.textBaseline='middle';c.font='12px system-ui';c.fillText(String(index+1),mx,my);
   }
  };
  const inputs=fields.querySelectorAll('input');
  inputs.forEach((input,i)=>input.addEventListener('focus',()=>draw(i)));
  canvas.onclick=e=>{
   const r=canvas.getBoundingClientRect(),px=(e.clientX-r.left)*260/r.width,py=(e.clientY-r.top)*144/r.height;
   let target=null,dist=12;
   for(const {a,b,index} of segments){
    const dx=b.x-a.x,dy=b.y-a.y,t=Math.max(0,Math.min(1,((px-a.x)*dx+(py-a.y)*dy)/(dx*dx+dy*dy)));
    const d=Math.hypot(px-a.x-t*dx,py-a.y-t*dy);
    if(d<dist&&!inputs[index].disabled){target=inputs[index];dist=d;}
   }
   if(target){target.focus();target.select();}
  };
  draw(-1);return canvas;
 }
 function dimensions(z){
  const grouped=$('roofUseEaveRule'),link=z.attachment;
  const section=$('rz_parapet').closest('details'),legacy=grouped?.closest('fieldset'),panel=document.createElement('fieldset'),legend=document.createElement('legend');
  if(link?.followParapet){$('rz_parapet').readOnly=true;$('rz_parapet').title='Ana çatının parapet üst kotunu izler';}
  const mode=document.createElement('select'),inputs=document.createElement('div');
  legend.textContent='Saçak çıkması';mode.name='edgeInputMode';mode.id='edgeInputMode';
  mode.setAttribute('aria-label','Saçak ölçü düzeni');
  for(const [text,value] of [['Tümü aynı','all'],['Kenara özel','each'],['Alın ve yan saçak','rule']])if(value!=='rule'||grouped)mode.add(new Option(text,value));
  const polygon=z.outline||(z.type==='bay'?RoofCore.basePolygon(z):null),values=link?link.base.eaves:polygon?(z.edgeEaves||z.bayEaves||polygon.map(()=>z.eaves[0])):z.eaves;
  const locked=i=>link?i===3:polygon?!!z.joinEdges?.[i]:!!z.childJoin&&i===1;
  const openValues=values.filter((_,i)=>!locked(i));
  mode.value=z.eaveRule&&grouped?'rule':z.overhangMode==='each'||!openValues.every(v=>v===openValues[0])?'each':'all';
  function number(caption,name,value,disabled=false){
   const input=document.createElement('input');input.name=name;input.type='number';input.step='any';input.min=0;input.max=500;input.required=true;input.disabled=disabled;input.value=value;
   return label(caption,input);
  }
  const shared=number('Tüm dış kenarlar · cm','sharedOverhang',openValues[0]??0);
  const edges=document.createElement('div');edges.className='roof-grid';
  values.forEach((v,i)=>{
   const p=polygon?.[i],q=polygon?.[(i+1)%values.length];
   const title='Kenar '+(i+1)+' · '+(p?Math.round(Math.hypot(q.x-p.x,q.y-p.y))+' cm uzunluk':['Sol / −X','Sağ / +X','Ön / −Y','Arka / +Y'][i]);
   edges.append(number(title+(locked(i)?' · birleşim':' · çıkma (cm)'),'overhang_'+i,v,locked(i)));
  });
  const picker=edgePicker(z,polygon,edges);
  function sync(){
   picker.style.display=mode.value==='each'?'block':'none';
   if(legacy)legacy.hidden=mode.value!=='rule';shared.hidden=mode.value!=='all';edges.hidden=mode.value!=='each';
   shared.querySelector('input').disabled=mode.value!=='all';
   [...edges.querySelectorAll('input')].forEach((input,i)=>input.disabled=locked(i)||mode.value!=='each');
   if(grouped){grouped.checked=mode.value==='rule';grouped.dispatchEvent(new Event('change'));grouped.closest('label').hidden=true;}
   for(const id of ['rz_e0','rz_e1','rz_e2','rz_e3','roofBoundaryEave','rz_link_e0','rz_link_e1','rz_link_e2']){const el=$(id);if(el)el.closest('label').hidden=true;}
  }
  let edited=false;panel.addEventListener('input',()=>{edited=true;});
  mode.onchange=()=>{edited=true;if(mode.value==='each'&&!shared.hidden)for(const e of edges.querySelectorAll('input'))if(!locked(Number(e.name.slice(9))))e.value=shared.firstElementChild.value;sync();};
  $('rz_parapet').addEventListener('input',()=>{
   if(!edited&&!z.parapet&&Number($('rz_parapet').value)>0){shared.firstElementChild.value=40;mode.value='all';sync();}
  });
  inputs.append(shared,picker,edges);panel.append(legend,mode,inputs);section.querySelector('summary').after(panel);
  if(legacy)panel.after(legacy);
  finishFields(z,section);
  sync();
 }
 function applyEdges(z,data){
  if(data.has('soffitType')){
   const finish={type:data.get('soffitType')};
   if(finish.type==='custom'){finish.name=String(data.get('soffitName')||'').trim();finish.color=data.get('soffitColor');}
   validateFinish(finish);z.soffitFinish=finish;
  }
  const mode=data.get('edgeInputMode');if(!['all','each'].includes(mode))return;
  z.overhangMode=mode;
  const read=i=>{
   const value=data.get(mode==='all'?'sharedOverhang':'overhang_'+i);
   if(value===null||value===''||!Number.isFinite(Number(value))||Number(value)<0||Number(value)>500)throw Error('Saçak çıkmasını 0–500 cm arasında girin.');
   return Number(value);
  };
  if(z.attachment){z.attachment.base.eaves=[read(0),read(1),read(2),0];return;}
  if(z.outline){
   z.edgeEaves=z.outline.map((_,i)=>z.joinEdges?.[i]?0:read(i));
   z.eaves=Array(4).fill(z.edgeEaves.find((_,i)=>!z.joinEdges?.[i])??0);
  }else if(z.type==='bay'){
   z.bayEaves=RoofCore.basePolygon(z).map((_,i)=>mode==='each'&&!data.has('overhang_'+i)?z.eaves[0]:read(i));
   z.eaves=Array(4).fill(z.bayEaves[0]);
  }else{
   delete z.bayEaves;
   z.eaves=z.eaves.map((_,i)=>z.childJoin&&i===1?0:read(i));
   if(z.childJoin)z.childJoin.requestedSideEaves=z.eaves.slice(2);
  }
 }
 // Cut only the coincident part of an edge shared with a linked veranda.
 function exposedIntervals(a,b,neighbors){
  const dx=b.x-a.x,dy=b.y-a.y,length=Math.hypot(dx,dy);
  const project=p=>((p.x-a.x)*dx+(p.y-a.y)*dy)/(length*length);
  const distance=p=>Math.abs((p.x-a.x)*dy-(p.y-a.y)*dx)/length;
  let spans=[[0,1]];
  for(const ring of neighbors)ring.forEach((p,i)=>{
   const q=ring[(i+1)%ring.length];
   if(distance(p)>.001||distance(q)>.001)return;
   const low=project(q),high=project(p);
   if(high<=low)return;
   spans=spans.flatMap(([u,v])=>[[u,Math.min(v,low)],[Math.max(u,high),v]].filter(([s,t])=>t-s>1e-8));
  });
  return spans;
 }
 function bandFaces(z,zones,C){
  const world=(zone,points)=>points.map(p=>C.transform(zone,p));
  const ring=world(z,C.footprint(z)),base=world(z,C.basePolygon(z));
  const parent=z.attachment?.followParapet?zones.find(other=>other.id===z.attachment.parentId):null;
  const neighbors=zones.filter(other=>other===parent||other.attachment?.followParapet&&other.attachment.parentId===z.id).map(other=>world(other,C.footprint(other)));
  const bottom=parent?.h??z.h,top=z.parapet+Math.max(...C.zoneFaces(z).flatMap(f=>f.poly.map(p=>C.height(f,p))));
  const out=[],mix=(a,b,t)=>({x:a.x+(b.x-a.x)*t,y:a.y+(b.y-a.y)*t});
  ring.forEach((p,i)=>{
   const q=ring[(i+1)%ring.length];
   // Offset polygons share the base edge order, except for the clipped bay polygon.
   const j=z.type==='bay'&&!z.outline?base.findIndex((a,n)=>{
    const b=base[(n+1)%base.length],dx=q.x-p.x,dy=q.y-p.y,ex=b.x-a.x,ey=b.y-a.y;
    return Math.abs(dx*ey-dy*ex)<1e-6*Math.hypot(dx,dy)*Math.hypot(ex,ey)&&dx*ex+dy*ey>0;
   }):i;
   const index=z.type==='bay'||z.outline?j:[2,1,3,0][j];
   const edge=index+1;
   let depth=0;
   if(j>=0){
    const start=base[j],end=base[(j+1)%base.length];
    depth=Math.abs((p.x-start.x)*(end.y-start.y)-(p.y-start.y)*(end.x-start.x))/Math.hypot(end.x-start.x,end.y-start.y);
   }
   const flush=j>=0&&depth<1e-6;
   const low=flush&&!z.sourceRoomId?Math.min(bottom,z.wallTop??bottom):bottom;
   for(const [s,t] of exposedIntervals(p,q,neighbors)){
    const a=mix(p,q,s),b=mix(p,q,t);
    out.push({kind:'cladding',parapetBand:true,openPorch:!!z.sourceRoomId,flush,edge,depth,poly:[{...a,z:low},{...b,z:low},{...b,z:top},{...a,z:top}],color:Wall3D.panelColor,zone:z.id});
   }
   if(j<0||flush)return;
   const underside=[p,q,base[(j+1)%base.length],base[j]];
   if(C.area(underside)>.001)out.push({kind:'soffit',edge,depth,poly:underside.map(pt=>({...pt,z:bottom})),zone:z.id});
  });
  return out;
 }
 function band(z,zones,C){
  const finish=finishOf(z);
  const faces=bandFaces(z,zones,C).flatMap(face=>{
   if(face.kind==='cladding')return face;
   if(finish.type!=='wood')return {...face,color:finish.color,soffitMaterial:finish.type};
   // Split only the preview into longitudinal boards; quantities use the uncut footprint.
   const [a,b,c,d]=face.poly,rows=Math.max(1,Math.ceil(face.depth/10));
   const at=(p,q,t)=>({x:p.x+(q.x-p.x)*t,y:p.y+(q.y-p.y)*t,z:p.z});
   return Array.from({length:rows},(_,i)=>{
    const t=i/rows,u=(i+1)/rows;
    return {...face,soffitMaterial:'wood',color:['#916e4f','#a17e5d','#967453'][i%3],
     poly:[at(a,d,t),at(b,c,t),at(b,c,u),at(a,d,u)]};
   });
  });
  return ProjectSpecs.facade(faces);
 }
 function schedule(zones,C){
  const rows=[],facade={tasonit:'Taşonit',yalipan:'Yalıpan'}[G.opt.cephe]||'Standart dış cephe';
  for(const z of zones.filter(zone=>zone.parapet>0)){
   for(const face of bandFaces(z,zones,C)){
    const [a,b,c]=face.poly,location=z.name+' · Kenar '+face.edge;
    if(face.kind==='soffit'){
     rows.push({grup:'Parapet imalatı',kalem:'Saçak altı · '+finishOf(z).name,olcu:location+' · '+formatCm(face.depth)+' cm çıkma',birim:'m²',miktar:C.area(face.poly)/10000});
    }else{
     rows.push({grup:'Parapet imalatı',kalem:'Parapet dış yüzü · '+facade,olcu:location+(face.flush?' · 0 cm, cephe devamı':' · alın kaplaması'),birim:'m²',miktar:Math.hypot(b.x-a.x,b.y-a.y)*(c.z-b.z)/10000});
    }
   }
  }
  return rows;
 }
 const formatCm=n=>n.toLocaleString('tr-TR',{maximumFractionDigits:2});
 function materialRows(zones,C){
  const totals=new Map();
  for(const row of schedule(zones,C))totals.set(row.kalem,(totals.get(row.kalem)||0)+row.miktar);
  return Array.from(totals,([kalem,area])=>({grup:'Parapet malzemeleri',kalem,olcu:'Tüm kenarların net kaplama alanı',birim:'m²',miktar:Number(area.toFixed(3))}));
 }
 // Compare in scene coordinates so the same join is hidden after a foundation lift.
 function flushJoinFilter(items){
  const spans=items.filter(item=>item.flush&&item.parapetBand&&!item.openPorch&&item.firstFacadeCourse!==false).map(item=>item.poly)
   .filter(poly=>poly.length>=3).map(poly=>{
    const z=Math.min(...poly.map(p=>p.z)),edge=poly.filter(p=>Math.abs(p.z-z)<1e-5);
    const p=edge[0],q=edge.find(v=>Math.hypot(v.x-p.x,v.y-p.y)>.001);
    return q?[p,q]:null;
   }).filter(Boolean);
  return (a,b)=>Math.abs(a.z-b.z)<1e-5&&spans.some(edge=>{
   const [p,q]=edge,dx=q.x-p.x,dy=q.y-p.y,length=Math.hypot(dx,dy);
   if(length<.001||Math.abs(a.z-p.z)>1e-5)return false;
   const on=v=>{
    const along=((v.x-p.x)*dx+(v.y-p.y)*dy)/length;
    return along>=-.21&&along<=length+.21&&Math.abs((v.x-p.x)*dy-(v.y-p.y)*dx)<=.21*length;
   };
   return on(a)&&on(b);
  });
 }
 window.ParapetOptions={mount(z){assembly(z);dimensions(z);designFields(z);},drawingControls,drawingSettings,remember,validate,validateFinish,applyEdges,band,schedule,materialRows,flushJoinFilter};
})();
