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
 const defaultThickness=10;
 function heightReference(id,reference){
  const select=document.createElement('select');select.id=id;select.name='parapetHeightRef';
  select.add(new Option('Duvar üstünden · sabit','wall'));
  select.add(new Option('En yüksek çatı örtüsünden','roof'));
  select.value=reference;return select;
 }
 function thicknessField(id,value){
  const input=document.createElement('input');input.type='number';input.id=id;input.name='parapetThickness';
  input.min=0.1;input.max=100;input.step='any';input.required=true;input.value=value;
  return label('Parapet duvar kalınlığı · cm',input);
 }
 function topLevel(z,crest){
  return (z.parapetHeightRef==='wall'?(z.wallTop??z.h):crest)+z.parapet;
 }
 function bandLevels(z,zones,C){
  const host=z.attachment?.followParapet?zones.find(other=>other.id===z.attachment.parentId)||z:z;
  const bottom=host.parapetHeightRef==='wall'?(host.wallTop??host.h):host.h;
  const crest=host.parapetHeightRef==='wall'?0:Math.max(...C.zoneFaces(host).flatMap(f=>f.poly.map(p=>C.height(f,p))));
  return {bottom,top:topLevel(host,crest)};
 }
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
    parapetHeightRef:$('parapetDrawRef').value,parapetThickness:value('parapetDrawThickness',.1,100),
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
   '<label>Parapet yüksekliği · cm<input id="parapetDrawHeight" type="number" min="0.01" max="300" step="any" required></label>'+
   '<label>Saçak çıkması · cm<input id="parapetDrawOffset" type="number" min="0" max="500" step="any" value="40" required></label>';
  styleLabel.after(fields);$('parapetDrawHeight').value=initialHeight;
  const drawHeight=$('parapetDrawHeight').closest('label');
  drawHeight.before(label('Yükseklik referansı',heightReference('parapetDrawRef','wall')));
  drawHeight.after(thicknessField('parapetDrawThickness',defaultThickness));
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
  heightField.firstChild.textContent='Parapet yüksekliği · cm';
  const reference=heightReference('parapetEditRef',z.parapetHeightRef||(z.parapet?'roof':'wall'));
  const refField=label('Yükseklik referansı',reference);
  const thickField=thicknessField('parapetEditThickness',z.parapetThickness??defaultThickness);
  const linked=!!z.attachment?.followParapet;
  const note=document.createElement('p');
  if(z.parapet>0&&z.parapetHeightRef==='wall'){
   const top=topLevel(z,0);
   note.textContent='Parapet üst kotu +'+formatCm(top)+' cm · beton üstünden.';
   const model=RoofStudio.model(),warning=model.warnings.find(w=>w.startsWith(z.name+': iç çatı örtüsü'));
   if(warning)note.textContent+=' '+warning.slice(z.name.length+2);
  }
  styleField.after(innerField);style.add(new Option(designName,'parapet'));
  if(z.parapet>0)style.value='parapet';
  let underlying=z.type;
  function sync(){
   const on=style.value==='parapet';
   innerField.hidden=!on;inner.disabled=!on||style.disabled;
   refField.hidden=thickField.hidden=!on;reference.disabled=!on||linked;
   thickField.firstElementChild.disabled=!on||linked;
   if(on)innerField.after(refField,heightField,thickField,note);else heightPlace.after(heightField);
   note.hidden=!on||!note.textContent;
   if(linked)heightField.firstChild.textContent='Ana parapete bağlı yükseklik · cm';
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
  // The displayed elevation describes the applied model, until the next edit.
  style.closest('form').addEventListener('input',()=>{note.textContent='';note.hidden=true;});
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
  if(z.parapet>0&&!z.attachment?.followParapet){
   if(data.has('parapetHeightRef'))z.parapetHeightRef=data.get('parapetHeightRef');
   if(data.has('parapetThickness'))z.parapetThickness=Number(data.get('parapetThickness'));
  }else if(!z.parapet){delete z.parapetHeightRef;delete z.parapetThickness;}
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
 // Build one outside contour for parapets which continue around a linked veranda.
 // The two offset edge lines meet at the same point, including at an inside corner.
 function shellLayout(zones,C){
  const shell=new Map(),groups=new Map(),key=p=>Math.round(p.x*10000)+','+Math.round(p.y*10000);
  for(const z of zones.filter(zone=>zone.parapet>0)){
   let root=z;
   const visited=new Set([z.id]);
   while(root.attachment?.followParapet){
    const parent=zones.find(v=>v.id===root.attachment.parentId);
    if(!parent||visited.has(parent.id))break;visited.add(parent.id);root=parent;
   }
   if(!groups.has(root.id))groups.set(root.id,[]);
   const ring=C.footprint(z).map(p=>C.transform(z,p));
   groups.get(root.id).push({z,ring});
  }
  for(const group of groups.values()){
   const segments=[],starts=new Map(),ends=new Map();
   for(const {z,ring} of group){
    const local=[],width=z.parapetThickness??defaultThickness;
    const neighbors=group.filter(v=>v.z!==z).map(v=>v.ring);
    ring.forEach((p,i)=>{
     const q=ring[(i+1)%ring.length],dx=q.x-p.x,dy=q.y-p.y,len=Math.hypot(dx,dy);
     const at=t=>({x:p.x+t*dx,y:p.y+t*dy});
     for(const [s,t] of exposedIntervals(p,q,neighbors)){
      const e={a:at(s),b:at(t),i,ux:dx/len,uy:dy/len,width};
      starts.set(key(e.a),e);ends.set(key(e.b),e);local.push(e);segments.push(e);
     }
    });
    shell.set(z.id,{ring,local,segments});
   }
   function corner(p,e,adj){
    const x=p.x-e.uy*e.width,y=p.y+e.ux*e.width;
    if(!adj)return {x,y};
    const cross=e.ux*adj.uy-e.uy*adj.ux;
    if(Math.abs(cross)<1e-8)return {x,y};
    const t=(e.width*(e.ux*adj.ux+e.uy*adj.uy)-adj.width)/cross;
    return {x:x+e.ux*t,y:y+e.uy*t};
   }
   for(const e of segments){
    e.innerA=corner(e.a,e,ends.get(key(e.a)));e.innerB=corner(e.b,e,starts.get(key(e.b)));
    if((e.innerB.x-e.innerA.x)*e.ux+(e.innerB.y-e.innerA.y)*e.uy<=0)
     throw Error('Bu kısa kenarda parapet iç köşeleri çakışıyor. Parapet kalınlığını veya çatı sınırını düzenleyin.');
    e.strip=[e.a,e.b,e.innerB,e.innerA];
   }
  }
  return shell;
 }
 function coverFaces(faces,layout,subtract){
  return faces.flatMap(f=>{
   const shell=layout.get(f.zoneId);if(!shell)return f;
   let parts=[f.poly];
   for(const {strip} of shell.segments)parts=parts.flatMap(p=>subtract(p,strip));
   return parts.map(poly=>({...f,poly}));
  });
 }
 function drawPlan(ctx,layout,at){
  if(!layout)return;
  ctx.save();ctx.fillStyle='#72818a';ctx.strokeStyle='#c0c9ce';ctx.lineWidth=1;
  for(const {local} of layout.values())for(const e of local){
   ctx.beginPath();e.strip.forEach((pt,i)=>{const p=at(pt);if(i)ctx.lineTo(p.x,p.y);else ctx.moveTo(p.x,p.y);});ctx.closePath();ctx.fill();
   const a=at(e.a),b=at(e.b);ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();
  }
  ctx.restore();
 }
 function sectionBands(z,model,C,zones){
  const shell=model.parapetLayout?.get(z.id);if(!shell)return [];
  const x=z.w/2,spans=[];
  for(const e of shell.local){
   const poly=e.strip.map(p=>C.untransform(z,p)),ys=[];
   poly.forEach((a,i)=>{
    const b=poly[(i+1)%poly.length];
    if((a.x<=x&&b.x>x)||(b.x<=x&&a.x>x))ys.push(a.y+(b.y-a.y)*(x-a.x)/(b.x-a.x));
   });
   if(ys.length===2)spans.push({lo:Math.min(...ys),hi:Math.max(...ys)});
  }
  const {top,bottom}=bandLevels(z,zones,C);
  return spans.map(s=>({...s,top,bottom}));
 }
 function drawSection(ctx,spans,at){
  ctx.save();ctx.fillStyle='#82929d';ctx.strokeStyle='#d5dfe4';ctx.lineWidth=1;
  for(const {lo,hi,top,bottom} of spans){
   const a=at({x:lo,y:top}),b=at({x:hi,y:bottom});
   ctx.fillRect(a.x,a.y,b.x-a.x,b.y-a.y);ctx.strokeRect(a.x,a.y,b.x-a.x,b.y-a.y);
  }
  ctx.restore();
 }
 function bandFaces(z,zones,C,layout){
  const {ring,local}=layout.get(z.id),base=C.basePolygon(z).map(p=>C.transform(z,p));
  const {bottom,top}=bandLevels(z,zones,C);
  const out=[];
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
   for(const {a,b,innerA,innerB,strip} of local.filter(e=>e.i===i)){
    out.push({kind:'cladding',parapetBand:true,openPorch:!!z.sourceRoomId,flush,edge,depth,poly:[{...a,z:low},{...b,z:low},{...b,z:top},{...a,z:top}],color:Wall3D.panelColor,zone:z.id});
    out.push({kind:'parapetInside',zone:z.id,edge,color:'#bcbab3',poly:[{...innerB,z:low},{...innerA,z:low},{...innerA,z:top},{...innerB,z:top}]});
    out.push({kind:'parapetTop',zone:z.id,edge,color:'#474b4d',poly:strip.map(p=>({...p,z:top}))});
   }
   if(j<0||flush)return;
   const underside=[p,q,base[(j+1)%base.length],base[j]];
   if(C.area(underside)>.001)out.push({kind:'soffit',edge,depth,poly:underside.map(pt=>({...pt,z:bottom})),zone:z.id});
  });
  return out;
 }
 function band(z,zones,C,layout=shellLayout(zones,C)){
  const finish=finishOf(z);
  const faces=bandFaces(z,zones,C,layout).flatMap(face=>{
   if(face.kind!=='soffit')return face;
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
  const layout=shellLayout(zones,C);
  for(const z of zones.filter(zone=>zone.parapet>0)){
   for(const face of bandFaces(z,zones,C,layout)){
    const [a,b,c]=face.poly,location=z.name+' · Kenar '+face.edge;
    if(face.kind==='soffit'){
     rows.push({grup:'Parapet imalatı',kalem:'Saçak altı · '+finishOf(z).name,olcu:location+' · '+formatCm(face.depth)+' cm çıkma',birim:'m²',miktar:C.area(face.poly)/10000});
    }else if(face.kind==='parapetTop'){
     rows.push({grup:'Parapet imalatı',kalem:'Parapet üst yüzü',olcu:location+' · '+formatCm(z.parapetThickness??defaultThickness)+' cm kalınlık',birim:'m²',miktar:C.area(face.poly)/10000});
    }else if(face.parapetBand){
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
 window.ParapetOptions={mount(z){assembly(z);dimensions(z);designFields(z);},drawingControls,drawingSettings,remember,validate,validateFinish,applyEdges,topLevel,shellLayout,coverFaces,drawPlan,sectionBands,drawSection,band,schedule,materialRows,flushJoinFilter};
})();
