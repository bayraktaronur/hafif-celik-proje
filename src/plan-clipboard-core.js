(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.PlanClipboardCore=api;})(globalThis,function(){
 const clone=x=>JSON.parse(JSON.stringify(x)),lists=['n','s','e','r','fixtures','counters','annotations','roofs'];
 function all(d){return {s:d.s.map(x=>x.id),fixtures:(d.fixtures||[]).map(x=>x.id),counters:(d.counters||[]).map(x=>x.id),annotations:(d.annotations||[]).map(x=>x.id),roofs:(d.roofs||[]).map(x=>x.id)};}
 function extract(d,selection){const p=clone(d),chosen=k=>new Set(selection[k]||[]);for(const k of ['s','fixtures','counters','annotations','roofs'])p[k]=(p[k]||[]).filter(x=>chosen(k).has(x.id));
  const segs=new Set(p.s.map(s=>s.id)),nodes=new Set(p.s.flatMap(s=>[s.n1,s.n2]));p.n=p.n.filter(n=>nodes.has(n.id));p.e=p.e.filter(e=>segs.has(e.segId));p.r=p.r.filter(r=>r.nodeIds.every((id,i)=>p.s.some(s=>(s.n1===id&&s.n2===r.nodeIds[(i+1)%r.nodeIds.length])||(s.n2===id&&s.n1===r.nodeIds[(i+1)%r.nodeIds.length]))));
  p.roofMaterials=(p.roofMaterials||[]).filter(m=>p.roofs.some(z=>z.material===m.id));const roofIds=new Set(p.roofs.map(r=>r.id));for(const r of p.roofs){for(const parent of [r.attachment?.parentId,r.production?.role==='child'?r.production.parentId:null])if(parent&&!roofIds.has(parent))throw Error('Bağlı çatıyı ana çatısıyla birlikte seçin.');if(r.sourceRoomId&&!p.r.some(x=>x.id===r.sourceRoomId))throw Error('Veranda çatısını bağlı odanın sınırlarıyla birlikte seçin.');}
  if(!['s','fixtures','counters','annotations','roofs'].some(k=>p[k].length))throw Error('Önce nesne veya alan seçin.');
  p.settings=p.settings||{};p.settings.trussOverrides=(p.settings.trussOverrides||[]).filter(x=>nodes.has(x.nodeId)&&(!x.zoneId||roofIds.has(x.zoneId)));
  const points=[...p.n,...p.fixtures,...p.annotations,...p.roofs,...p.counters.flatMap(c=>c.points)];const origin={x:Math.min(...points.map(p=>p.x)),y:Math.min(...points.map(p=>p.y))};return {format:'prefabrikten-plan-clipboard',version:1,project:p,origin};
 }
 function remove(d,clip){const p=clone(d),ids=new Set(lists.flatMap(k=>(clip.project[k]||[]).map(o=>o.id)));for(const k of lists.filter(k=>k!=='n'))p[k]=(p[k]||[]).filter(o=>!ids.has(o.id));const used=new Set(p.s.flatMap(s=>[s.n1,s.n2]));p.n=p.n.filter(n=>used.has(n.id));p.r=p.r.filter(r=>r.nodeIds.every(id=>used.has(id)));for(const z of p.roofs)if(ids.has(z.sourceRoomId)||ids.has(z.attachment?.parentId)||ids.has(z.production?.parentId))throw Error('Kesilecek seçimde bağlı çatıları da seçin.');p.settings.trussOverrides=(p.settings.trussOverrides||[]).filter(t=>used.has(t.nodeId)&&!ids.has(t.zoneId));return p;}
 function paste(target,clip,point,uid){
  if(clip?.format!=='prefabrikten-plan-clipboard'||clip.version!==1)throw Error('Geçersiz plan panosu.');
  const p=clone(clip.project),d=clone(target),dx=point.x-clip.origin.x,dy=point.y-clip.origin.y,empty=!['s','fixtures','counters','annotations','roofs'].some(k=>(d[k]||[]).length);
  if(!empty&&(d.sistem!==p.sistem||d.catiYon!==p.catiYon||d.ky!==p.ky||d.opt.h!==p.opt.h||d.opt.dis!==p.opt.dis||d.opt.ic!==p.opt.ic))throw Error('Kaynak ve hedefin sistem, kat yüksekliği, duvar kalınlığı veya çatı yönü farklı. Boş projeye yapıştırın.');
  const map=new Map(),groups=new Map();for(const k of lists)for(const o of p[k]||[])map.set(o.id,uid());for(const m of p.roofMaterials||[])map.set(m.id,'custom_'+uid());
  function refs(o){if(!o||typeof o!=='object')return;for(const k of Object.keys(o)){const v=o[k];if(k==='nodeIds'&&Array.isArray(v))o[k]=v.map(id=>map.get(id)||id);else if(typeof v==='string'&&(k==='id'||k==='n1'||k==='n2'||k.endsWith('Id'))&&map.has(v))o[k]=map.get(v);else if(v&&typeof v==='object')refs(v);}}
  refs(p);const translate=o=>{o.x+=dx;o.y+=dy;};p.n.forEach(translate);p.fixtures.forEach(translate);p.annotations.forEach(translate);for(const c of p.counters){c.points.forEach(translate);c.runs.forEach(translate);}for(const r of p.r){delete r.sig;if(Number.isFinite(r.cx))r.cx+=dx;if(Number.isFinite(r.cy))r.cy+=dy;if(r.pts)r.pts.forEach(translate);}
  for(const z of p.roofs){translate(z);if(!groups.has(z.group))groups.set(z.group,uid());z.group=groups.get(z.group);if(z.attachment?.base)translate(z.attachment.base);if(z.childJoin){z.childJoin.points.forEach(translate);z.childJoin.support.forEach(translate);}if(map.has(z.material))z.material=map.get(z.material);}
  for(const t of p.settings.trussOverrides||[]){const v=t.axis==='x'?dx:dy;t.from+=v;t.to+=v;}
  // Pasting walls into existing walls must not silently merge openings or manufacture duplicate panels.
  const oldNodes=new Map(d.n.map(n=>[n.id,n])),newNodes=new Map(p.n.map(n=>[n.id,n]));
  function collision(a,b,c,e){const ux=b.x-a.x,uy=b.y-a.y,vx=e.x-c.x,vy=e.y-c.y,den=ux*vy-uy*vx,dx=c.x-a.x,dy=c.y-a.y;if(Math.abs(den)<1e-7){if(Math.abs(dx*uy-dy*ux)>.001)return false;const k=Math.abs(ux)>Math.abs(uy)?'x':'y';return Math.min(Math.max(a[k],b[k]),Math.max(c[k],e[k]))>=Math.max(Math.min(a[k],b[k]),Math.min(c[k],e[k]))-.001;}const t=(dx*vy-dy*vx)/den,u=(dx*uy-dy*ux)/den;return t>=0&&t<=1&&u>=0&&u<=1;}
  for(const a of p.s)for(const b of d.s)if(collision(newNodes.get(a.n1),newNodes.get(a.n2),oldNodes.get(b.n1),oldNodes.get(b.n2)))throw Error('Yapıştırılacak duvar mevcut duvara değiyor veya çakışıyor. Boş bir konum seçin.');
  if(empty)for(const k of ['sistem','catiYon','opt','ky','dy','fire','settings'])d[k]=clone(p[k]);
  const added={};for(const k of lists){added[k]=(p[k]||[]).map(x=>x.id);d[k]=[...(d[k]||[]),...(p[k]||[])];}d.roofMaterials=[...(d.roofMaterials||[]),...(p.roofMaterials||[])];if(!empty)d.settings.trussOverrides=[...(d.settings.trussOverrides||[]),...(p.settings.trussOverrides||[])];return {state:d,added};
 }
 return {all,extract,remove,paste};
});
