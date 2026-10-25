/* Isolated standard ceiling preview. Nominal boards: 60 x 120 cm, screwless mini-H joints.
   Mini-H section/fit allowances are schematic until a measured product section is supplied. */
const DraftCeiling=(()=>{
 const EPS=1e-5,profile={flange:2,skin:.12,web:.12};
 const area=r=>(r.x1-r.x0)*(r.y1-r.y0);
 function intersect(a,b){const r={x0:Math.max(a.x0,b.x0),x1:Math.min(a.x1,b.x1),y0:Math.max(a.y0,b.y0),y1:Math.min(a.y1,b.y1)};return r.x1-r.x0>EPS&&r.y1-r.y0>EPS?r:null;}
 function subtract(rects,cut){return rects.flatMap(r=>{const c=intersect(r,cut);if(!c)return [r];return [{...r,x1:c.x0},{...r,x0:c.x1},{x0:c.x0,x1:c.x1,y0:r.y0,y1:c.y0},{x0:c.x0,x1:c.x1,y0:c.y1,y1:r.y1}].filter(r=>r.x1-r.x0>EPS&&r.y1-r.y0>EPS)});}
 function merge(rects){const out=rects.map(r=>({...r}));let again=true;while(again){again=false;outer:for(let i=0;i<out.length;i++)for(let j=i+1;j<out.length;j++){
  const a=out[i],b=out[j],same=(a,b)=>Math.abs(a-b)<EPS;
  if((same(a.x0,b.x0)&&same(a.x1,b.x1)&&(same(a.y1,b.y0)||same(b.y1,a.y0)))||(same(a.y0,b.y0)&&same(a.y1,b.y1)&&(same(a.x1,b.x0)||same(b.x1,a.x0)))){out[i]={x0:Math.min(a.x0,b.x0),x1:Math.max(a.x1,b.x1),y0:Math.min(a.y0,b.y0),y1:Math.max(a.y1,b.y1)};out.splice(j,1);again=true;break outer;}
 }}return out;}
 function wallRects(data){const nodes=Object.fromEntries(data.nodes.map(n=>[n.id,n]));return data.segs.filter(s=>s.tip!=='veranda').map(s=>{const a=nodes[s.n1],b=nodes[s.n2],t=s.k/2;return {x0:Math.min(a.x,b.x)-t,x1:Math.max(a.x,b.x)+t,y0:Math.min(a.y,b.y)-t,y1:Math.max(a.y,b.y)+t}});}
 function roomRects(room,walls){const ys=[...new Set(room.points.map(p=>p.y))].sort((a,b)=>a-b);let out=[];
  for(let i=1;i<ys.length;i++){const y=(ys[i]+ys[i-1])/2,xs=[];room.points.forEach((p,j)=>{const q=room.points[(j+1)%room.points.length];if((p.y>y)!==(q.y>y))xs.push(p.x+(q.x-p.x)*(y-p.y)/(q.y-p.y));});xs.sort((a,b)=>a-b);for(let j=1;j<xs.length;j+=2)out.push({x0:xs[j-1],x1:xs[j],y0:ys[i-1],y1:ys[i]});}
  for(const w of walls)out=subtract(out,w);return merge(out);
 }
 function layout(data,direction='y'){
  const rooms=[],boards=[],joints=[],walls=wallRects(data),dx=direction==='x'?120:60,dy=direction==='x'?60:120;
  for(const room of data.rooms.filter(r=>r.tip!=='veranda'&&r.tip!=='sundurma')){
   const rects=roomRects(room,walls);if(!rects.length)continue;
   const x0=Math.min(...rects.map(r=>r.x0)),x1=Math.max(...rects.map(r=>r.x1)),y0=Math.min(...rects.map(r=>r.y0)),y1=Math.max(...rects.map(r=>r.y1));
   const green=['banyo','wc','tuvalet','islak'].includes(room.tip),roomBoards=[];
   for(let row=0,y=y0;y<y1-EPS;y+=dy,row++)for(let col=0,x=x0;x<x1-EPS;x+=dx,col++){
    const nominal={x0:x,x1:x+dx,y0:y,y1:y+dy},pieces=merge(rects.map(r=>intersect(r,nominal)).filter(Boolean));if(!pieces.length)continue;
    const a=pieces.reduce((n,r)=>n+area(r),0),board={id:`${room.id}:${col}:${row}`,roomId:room.id,roomName:room.name,green,col,row,nominal,pieces,area:a/10000,full:Math.abs(a-7200)<.001};boards.push(board);roomBoards.push(board);
   }
   // Shared edges only: a wall boundary or an artificial polygon partition is not a mini-H.
   const raw=[];
   for(let i=0;i<roomBoards.length;i++)for(let j=i+1;j<roomBoards.length;j++)for(const a of roomBoards[i].pieces)for(const b of roomBoards[j].pieces){
    let axis,value,lo,hi;
    if(Math.abs(a.x1-b.x0)<EPS||Math.abs(b.x1-a.x0)<EPS){axis='x';value=Math.abs(a.x1-b.x0)<EPS?a.x1:b.x1;lo=Math.max(a.y0,b.y0);hi=Math.min(a.y1,b.y1);}
    else if(Math.abs(a.y1-b.y0)<EPS||Math.abs(b.y1-a.y0)<EPS){axis='y';value=Math.abs(a.y1-b.y0)<EPS?a.y1:b.y1;lo=Math.max(a.x0,b.x0);hi=Math.min(a.x1,b.x1);}
    if(axis&&hi-lo>EPS)raw.push({axis,value,lo,hi});
   }
   raw.sort((a,b)=>a.axis.localeCompare(b.axis)||a.value-b.value||a.lo-b.lo);const joined=[];
   for(const j of raw){const last=joined.at(-1);if(last&&last.axis===j.axis&&Math.abs(last.value-j.value)<EPS&&j.lo<=last.hi+EPS)last.hi=Math.max(last.hi,j.hi);else joined.push({...j});}
   joined.forEach((j,i)=>joints.push({...j,id:`${room.id}:H${i+1}`,roomId:room.id,length:(j.hi-j.lo)/100}));
   rooms.push({id:room.id,name:room.name,green,rects,area:rects.reduce((n,r)=>n+area(r),0)/10000});
  }
  return {rooms,boards,joints,dx,dy,area:boards.reduce((n,b)=>n+b.area,0),miniH:joints.reduce((n,j)=>n+j.length,0)};
 }
 function box(r,lo,hi,meta){const p=[{x:r.x0,y:r.y0},{x:r.x1,y:r.y0},{x:r.x1,y:r.y1},{x:r.x0,y:r.y1}],out=[];
  const face=poly=>out.push({...meta,poly});face(p.map(p=>({...p,z:hi})));face([...p].reverse().map(p=>({...p,z:lo})));
  for(let i=0;i<4;i++)face([{...p[i],z:lo},{...p[(i+1)%4],z:lo},{...p[(i+1)%4],z:hi},{...p[i],z:hi}]);return out;
 }
 function mesh(data,direction,lo,hi,selectedId=null){const plan=layout(data,direction),surfaces=[];
  for(const b of plan.boards){let visible=b.pieces;
   // Keep nominal 60 x 120 layout/area data; tiny joint clearances belong only to the illustrative fit.
   for(const j of plan.joints.filter(j=>j.roomId===b.roomId)){const gap=profile.web/2+.015,cut=j.axis==='x'?{x0:j.value-gap,x1:j.value+gap,y0:j.lo,y1:j.hi}:{y0:j.value-gap,y1:j.value+gap,x0:j.lo,x1:j.hi};visible=subtract(visible,cut);}
   for(const r of visible)surfaces.push(...box(r,lo,hi,{kind:'ceilingBoard',layerId:'ceiling',boardId:b.id,roomId:b.roomId,material:'panel',color:selectedId===b.id?'#c0d9c8':b.green?'#cbd8c4':(b.row+b.col)%2?'#eeeae0':'#f3f0e8'}));
  }
  const h=profile.flange/2,skin=profile.skin,web=profile.web;
  for(const j of plan.joints){
   const make=(start,end,half,z0,z1,part)=>{if(end-start<EPS)return;const r=j.axis==='x'?{x0:j.value-half,x1:j.value+half,y0:start,y1:end}:{y0:j.value-half,y1:j.value+half,x0:start,x1:end};
    for(const inside of plan.rooms.find(r=>r.id===j.roomId).rects){const c=intersect(r,inside);if(c)surfaces.push(...box(c,z0,z1,{kind:'miniH',layerId:'ceiling',jointId:j.id,part,material:'panel',color:'#acbab5'}));}
   };
   // Longitudinal flanges pass through crossings; transverse flanges stop against them (no duplicate solids).
   let spans=[[j.lo,j.hi]];if(j.axis==='y')for(const cross of plan.joints.filter(c=>c.roomId===j.roomId&&c.axis==='x'&&c.lo-EPS<=j.value&&c.hi+EPS>=j.value))spans=spans.flatMap(([a,b])=>[[a,Math.min(b,cross.value-h)],[Math.max(a,cross.value+h),b]].filter(([a,b])=>b-a>EPS));
   for(const [a,b] of spans){make(a,b,h,lo-skin,lo,'bottomFlange');make(a,b,h,hi,hi+skin,'topFlange');}
   let webs=[[j.lo,j.hi]];if(j.axis==='y')for(const cross of plan.joints.filter(c=>c.roomId===j.roomId&&c.axis==='x'&&c.lo-EPS<=j.value&&c.hi+EPS>=j.value))webs=webs.flatMap(([a,b])=>[[a,Math.min(b,cross.value-web/2)],[Math.max(a,cross.value+web/2),b]].filter(([a,b])=>b-a>EPS));
   for(const [a,b] of webs)make(a,b,web/2,lo,hi,'web');
  }
  return {surfaces,...plan};
 }
 return {profile,layout,mesh,roomRects,wallRects,area};
})();
