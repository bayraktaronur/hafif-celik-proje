/* Mounting targets come from the same vertical faces rendered by the model. cm. */
(function(root){
 'use strict';
 const names={post:'Veranda direği',corner:'Köşe direği',h:'H profili',wall:'Duvar'};
 let cacheKey='',cache=[],busy=false;
 function collect(){
  const key=JSON.stringify([G.nodes,G.segs,G.elemanlar,G.rooms,G.opt,G.roofs,G.loading]);
  if(key===cacheKey)return cache;if(busy)return [];busy=true;
  try{
   const counts={},identify=(s,id)=>({...s,targetId:id+':face:'+(counts[id]=(counts[id]||0)+1)});
   const items=Wall3D.build().surfaces.map(s=>identify(s,s.partId||'wall'));
   items.push(...RoofStudio.planVerandaPosts().map(s=>identify(s,'veranda:'+s.sourceNodeId)));
   for(const z of G.roofs.filter(z=>z.sourceRoomId))items.push(...RoofStudio.verandaStructure(z).map((s,i)=>({...s,targetId:'veranda:'+z.id+':face:'+i})));
   const faces=[];
   for(const s of items){
    const kind=s.kind==='post'?'post':s.kind==='wallJoint'&&s.jointType==='kose'?'corner':s.kind==='wallJoint'&&['H','H3','X'].includes(s.jointType)?'h':s.kind==='wallPanel'?'wall':null;
    if(!kind)continue;const lo=Math.min(...s.poly.map(p=>p.z)),hi=Math.max(...s.poly.map(p=>p.z));
    if(hi-lo<150||lo>60)continue;
    const pts=[];for(const p of s.poly)if(!pts.some(q=>Math.hypot(p.x-q.x,p.y-q.y)<.001))pts.push({x:p.x,y:p.y});
    if(pts.length!==2||Math.hypot(pts[0].x-pts[1].x,pts[0].y-pts[1].y)<.05)continue;
    faces.push({id:s.targetId,kind,label:names[kind],a:pts[0],b:pts[1],lo,hi,poly:s.poly});
   }
   cacheKey=key;cache=faces;return faces;
  }finally{busy=false;}
 }
 function intersect(r,offset,f){
  const p={x:r.p.x+r.u.x*offset,y:r.p.y+r.u.y*offset},dx=f.b.x-f.a.x,dy=f.b.y-f.a.y,den=r.inward.x*dy-r.inward.y*dx;
  if(Math.abs(den)<1e-7)return null;const vx=f.a.x-p.x,vy=f.a.y-p.y,d=(vx*dy-vy*dx)/den,t=(vx*r.inward.y-vy*r.inward.x)/den;
  if(t<-.0001||t>1.0001||d<0||d>500)return null;return{distance:d,point:{x:p.x+r.inward.x*d,y:p.y+r.inward.y*d}};
 }
 function candidates(r,offset){
  const faces=collect(),out=[],gap=RainDrainage.settings(G.rainDrainage).wallGap;
  for(const f of faces){
   // Only faces facing the gutter, not the thin side returns of profiles.
   const dx=f.b.x-f.a.x,dy=f.b.y-f.a.y,len=Math.hypot(dx,dy);if(Math.abs(dx*r.u.x+dy*r.u.y)<len*.7)continue;
   const mid={x:(f.a.x+f.b.x)/2,y:(f.a.y+f.b.y)/2};
   const t=f.kind==='wall'?offset:(mid.x-r.p.x)*r.u.x+(mid.y-r.p.y)*r.u.y;
   if(t<4.5||t>r.len-4.5)continue;const hit=intersect(r,t,f);if(!hit||hit.distance-gap<9.19512)continue;
   // Do not snap to a member behind another facade or a closer post.
   if(faces.some(o=>{const h=intersect(r,t,o);return h&&h.distance<hit.distance-.2;}))continue;
   out.push({...f,offset:t,...hit,priority:['post','corner','h','wall'].indexOf(f.kind)});
  }
  return out;
 }
 function pick(r,offset,project){
  const z=r.p.z+1+(G.foundation?.height||0),at=t=>project({x:r.p.x+r.u.x*t,y:r.p.y+r.u.y*t,z}),p=at(offset);
  return candidates(r,offset).map(f=>({...f,pixelDistance:Math.hypot(at(f.offset).x-p.x,at(f.offset).y-p.y)})).filter(f=>f.kind==='wall'||(f.pixelDistance<=16&&Math.abs(f.offset-offset)<=35)).sort((a,b)=>a.priority-b.priority||a.pixelDistance-b.pixelDistance||a.distance-b.distance)[0]||null;
 }
 function resolve(r,offset,mount){const f=collect().find(f=>f.id===mount.id&&f.kind===mount.kind);return f?intersect(r,offset,f):null;}
 function distance(r,offset,cfg){const mount=cfg.runs[r.key]?.mounts?.[String(offset)];if(!mount)return null;const hit=resolve(r,offset,mount);return hit?.distance??null;}
 function validate(v){for(const c of Object.values(v.runs||{})){if(c.mounts===undefined)continue;if(!c.mounts||typeof c.mounts!=='object'||Array.isArray(c.mounts)||Object.keys(c.mounts).length>30)throw Error('Montaj hedefleri geçersiz.');for(const [offset,m] of Object.entries(c.mounts)){if(!c.positions.includes(Number(offset))||!m||!Object.hasOwn(names,m.kind)||typeof m.id!=='string'||m.id.length>250)throw Error('Montaj hedefi geçersiz.');}}}
 root.RainMount={collect,candidates,pick,resolve,distance,validate};
})(window);
