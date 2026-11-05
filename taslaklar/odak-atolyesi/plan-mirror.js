/* Reflect model coordinates. Text is always typeset normally by the plan renderer. */
(()=>{
 const wrap=a=>(a%360+360)%360;
 function reflect(project,axis,selection){
  const d=structuredClone(project),whole=!selection;
  const types={fixture:'fixtures',counter:'counters',annotation:'annotations',eleman:'e',seg:'s'};
  const chosen=k=>(d[k]||[]).filter(o=>whole||(types[selection.type]===k&&selection.id===o.id));
  const walls=chosen('s'),wallIds=new Set(walls.map(w=>w.id)),nodeIds=new Set(walls.flatMap(w=>[w.n1,w.n2]));
  const nodes=d.n.filter(n=>nodeIds.has(n.id)),fixtures=chosen('fixtures'),notes=chosen('annotations'),counters=chosen('counters');
  const openings=d.e.filter(o=>wallIds.has(o.segId)||(!whole&&selection.type==='eleman'&&selection.id===o.id));
  if(!whole&&fixtures.some(f=>f.locked))throw Error('Önce nesnenin yerleşim kilidini açın.');
  if(!whole&&walls.length&&d.s.some(w=>!wallIds.has(w.id)&&(nodeIds.has(w.n1)||nodeIds.has(w.n2))))throw Error('Bağlı duvarları birlikte çevirmek için Tüm proje seçin.');
  if(!whole&&!walls.length&&openings.length){
   const e=openings[0],s=d.s.find(s=>s.id===e.segId),a=d.n.find(n=>n.id===s.n1),b=d.n.find(n=>n.id===s.n2);
   if(Math.abs(a.x-b.x)>.001&&Math.abs(a.y-b.y)>.001)throw Error('Eğik duvardaki açıklığı duvarıyla birlikte aynalayın.');
   const along=axis==='x'?a.x!==b.x:a.y!==b.y;
   if(along){e.mentese=(e.mentese||(e.kapiYon==='dis'?'b':'a'))==='a'?'b':'a';}
   else e.yan=e.yan===-1?1:-1;
   return d;
  }
  const noteBounds=notes.flatMap(a=>{
   if(!a.shape)return [a];
   const t=a.angle*Math.PI/180;
   return [[0,0],[a.w,0],[0,a.h],[a.w,a.h]].map(([x,y])=>({x:a.x+x*Math.cos(t)-y*Math.sin(t),y:a.y+x*Math.sin(t)+y*Math.cos(t)}));
  });
  const pointSet=nodes.length?nodes:[...fixtures,...noteBounds,...counters.flatMap(c=>c.points),...(whole?d.foundation?.outline||[]:[])];
  if(!pointSet.length)throw Error('Önce bir nesne seçin veya Tüm proje kullanın.');
  const values=pointSet.map(p=>p[axis]),sum=Math.min(...values)+Math.max(...values);
  const flip=p=>{p[axis]=sum-p[axis];};
  const heading=a=>wrap((axis==='x'?180:0)-a);
  const relative=p=>{if(p&&Number.isFinite(p[axis]))p[axis]*=-1;};
  nodes.forEach(flip);
  for(const e of openings)e.yan=e.yan===-1?1:-1;
  for(const f of fixtures){flip(f);f.angle=wrap(heading(f.angle)+180);f.mirror=!f.mirror;}
  for(const c of counters){c.points.forEach(flip);for(const r of c.runs){flip(r);r.angle=heading(r.angle);}}
  for(const a of notes){
   if(!a.shape){flip(a);continue;}
   if(a.shape==='line'){flip(a);a.angle=heading(a.angle);}
   else{
    const t=a.angle*Math.PI/180;
    a.x+=a.w*Math.cos(t);a.y+=a.w*Math.sin(t);flip(a);a.angle=wrap(heading(a.angle)+180);
   }
   if(a.dimKind&&(a.dimKind==='horizontal'?axis==='y':a.dimKind==='vertical'?axis==='x':true))a.dimOffset*=-1;
   Object.values(a.regionOffsets||{}).forEach(relative);
  }
  if(!whole)return d;
  for(const r of d.r){
   for(const prefix of ['c','l'])if(Number.isFinite(r[prefix+axis]))r[prefix+axis]=sum-r[prefix+axis];
   const key=axis==='x'?'lblDx':'lblDy';if(Number.isFinite(r[key]))r[key]*=-1;
   r.pts?.forEach(flip);if(r.floorFinish)r.floorFinish.angle=wrap(-(r.floorFinish.angle||0))%180;
  }
  d.foundation?.outline?.forEach(flip);
  for(const image of d.referenceImages||[])if(image.mode==='scene'){
   flip(image);image.angle=wrap(heading(image.angle)+180);image.mirror=!image.mirror;
  }
  for(const t of d.settings?.trussOverrides||[])if(t.axis===axis)[t.from,t.to]=[sum-t.to,sum-t.from];
  function roof(z){
   const t=z.angle*Math.PI/180;z.x+=z.w*Math.cos(t);z.y+=z.w*Math.sin(t);flip(z);z.angle=wrap(heading(z.angle)+180);
   [z.eaves[0],z.eaves[1]]=[z.eaves[1],z.eaves[0]];
   if(z.outline){
    z.outline.forEach(p=>{p.x=z.w-p.x;});z.outline.reverse();
    for(const key of ['edgeEaves','joinEdges'])if(z[key]){z[key].reverse();z[key].push(z[key].shift());}
    z.boundaryRefs?.reverse().forEach(r=>{if(r)r[axis==='x'?'dx':'dy']*=-1;});
   }
  }
  for(const z of d.roofs||[]){
   if(z.childJoin){z.childJoin.points.forEach(flip);z.childJoin.points.reverse();z.childJoin.requestedSideEaves?.reverse();[z.eaves[2],z.eaves[3]]=[z.eaves[3],z.eaves[2]];}
   else roof(z);
   if(z.attachment?.base)roof(z.attachment.base);
  }
  const done=new Set();
  function join(z){
   if(done.has(z.id))return;done.add(z.id);
   if(z.childJoin){const parent=d.roofs.find(p=>p.id===z.production.parentId);join(parent);Object.assign(z,RoofCore.connectChild(z,parent));}
  }
  (d.roofs||[]).forEach(join);
  if(Object.keys(d.rainDrainage?.runs||{}).length){
   const runs=p=>RainDrainage.layout(RoofCore.calculate(p.roofs,p.roofMaterials),p.roofs,RoofCore,p.rainDrainage).runs;
   const next=runs(d),settings={};
   const near=(p,q)=>Math.hypot(p.x-q.x,p.y-q.y)<.1;
   for(const run of runs(project)){
    const opt=d.rainDrainage.runs[run.key];if(!opt)continue;
    const a={...run.p},b={...run.q};flip(a);flip(b);
    const target=next.find(r=>r.zoneId===run.zoneId&&((near(r.p,a)&&near(r.q,b))||(near(r.p,b)&&near(r.q,a))));
    if(!target)throw Error('Özel inişin aynalanmış saçak kenarı bulunamadı.');
    if(near(target.q,a)){opt.positions=opt.positions.map(t=>run.len-t).reverse();if(opt.mode==='start')opt.mode='end';else if(opt.mode==='end')opt.mode='start';}
    settings[target.key]=opt;
   }
   d.rainDrainage.runs=settings;
  }
  return d;
 }
 if(typeof module==='object'&&module.exports){module.exports=reflect;return;}
 const button=document.createElement('button');button.id='planMirror';button.className='t';button.textContent='↔ Aynala';
 document.querySelector('#command-panel-edit').prepend(button);
 const dialog=document.createElement('dialog');dialog.style.cssText='background:#1c282e;color:#e0e8e9;border:1px solid #50656a;border-radius:12px;padding:20px';
 dialog.innerHTML='<form method="dialog"><h3>Aynala</h3><label>Kapsam <select name="scope"><option value="object">Seçili nesne</option><option value="project">Tüm proje</option></select></label><p>Merkezden hangi yönde çevrilsin?</p><button class="sib" value="x">↔ Sağ–sol</button> <button class="sib" value="y">↕ Üst–alt</button> <button class="sib" value="cancel">Vazgeç</button></form>';
 document.body.append(dialog);
 button.onclick=()=>{const option=dialog.querySelector('option');option.disabled=!['fixture','counter','annotation','eleman','seg'].includes(G.seciliTip)||!G.secili;dialog.querySelector('select').value=option.disabled?'project':'object';dialog.returnValue='';dialog.showModal();};
 dialog.onclose=()=>{if(!['x','y'].includes(dialog.returnValue))return;
  try{const sel=dialog.querySelector('select').value==='object'?{type:G.seciliTip,id:G.secili.id}:null;
   if(Studio.applyTransaction(reflect(Studio.state(),dialog.returnValue,sel)))Studio.toast('Aynalandı · Ctrl+Z ile geri al.');
  }catch(e){Studio.toast(e.message,true);}
 };
})();
