/* Wall-face dimension references; model axes and fabrication remain untouched. */
(function(root){
'use strict';
function range(seg,nodes,segs,mode){
 const map=new Map(nodes.map(n=>[n.id,n])),a=map.get(seg.n1),b=map.get(seg.n2),L=Math.hypot(b.x-a.x,b.y-a.y),u={x:(b.x-a.x)/L,y:(b.y-a.y)/L};
 if(mode==='axis')return [0,L];
 if(seg.tip==='veranda'){
   function inset(id){
     let offset=0;
     for(const wall of segs){
       if(wall.tip==='veranda'||(wall.n1!==id&&wall.n2!==id))continue;
       const p=map.get(wall.n1),q=map.get(wall.n2),length=Math.hypot(q.x-p.x,q.y-p.y);
       if(!length)continue;
       const sine=Math.abs(u.x*(q.y-p.y)-u.y*(q.x-p.x))/length;
       const cosine=Math.sqrt(Math.max(0,1-sine*sine));
       offset=Math.max(offset,wall.k/(2*Math.max(sine,cosine)));
     }
     return offset;
   }
   const lo=inset(seg.n1),hi=L-inset(seg.n2);
   return [Math.min(lo,L),Math.max(Math.min(lo,L),hi)];
 }
 function end(id){let perpendicular=0,collinear=false;for(const s of segs){if(s===seg||s.id===seg.id||s.tip==='veranda'||(s.n1!==id&&s.n2!==id))continue;const p=map.get(s.n1),q=map.get(s.n2),len=Math.hypot(q.x-p.x,q.y-p.y),sin=Math.abs(u.x*(q.y-p.y)/len-u.y*(q.x-p.x)/len);if(sin<1e-6)collinear=true;else perpendicular=Math.max(perpendicular,s.k/(2*sin));}
 // Consecutive outer spans share a station at T and X junctions.
 if(mode==='outer'&&collinear)return 0;
 if(perpendicular)return (mode==='net'?1:-1)*perpendicular;
 return collinear?0:-seg.k/2;
 }
 const lo=end(seg.n1),hi=L-end(seg.n2);return hi>lo?[lo,hi]:[0,L];
}
function overall(nodes,segs){const map=new Map(nodes.map(n=>[n.id,n])),pts=[];for(const s of segs){if(s.tip==='veranda')continue;const a=map.get(s.n1),b=map.get(s.n2);if(!a||!b)continue;const L=Math.hypot(b.x-a.x,b.y-a.y);if(!L)continue;const ux=(b.x-a.x)/L,uy=(b.y-a.y)/L,h=s.k/2;for(const [p,sign]of [[a,-1],[b,1]])for(const side of [-1,1])pts.push({x:p.x+sign*ux*h-side*uy*h,y:p.y+sign*uy*h+side*ux*h});}if(!pts.length)return null;return {minX:Math.min(...pts.map(p=>p.x)),maxX:Math.max(...pts.map(p=>p.x)),minY:Math.min(...pts.map(p=>p.y)),maxY:Math.max(...pts.map(p=>p.y))};}
function mode(){return G.dimensionReference||'outer';}
function totals(){if(isPref()||!planVisible('outerDims'))return;const links=new Map(),seen=new Set();
 for(const s of G.segs)for(const id of [s.n1,s.n2]){
   if(!links.has(id))links.set(id,[]);
   links.get(id).push(s);
 }
 for(const s of G.segs){
   if(seen.has(s))continue;
   const group=[],queue=[s];seen.add(s);
   while(queue.length){
     const item=queue.pop();group.push(item);
     for(const id of [item.n1,item.n2])for(const next of links.get(id)){
       if(!seen.has(next)){seen.add(next);queue.push(next);}
     }
   }
   if(group.length>1)groupTotals(group);
 }
}
function groupTotals(group){const b=overall(G.nodes,group);if(!b)return;_dimRow=null;
 // An unbroken exterior wall already displays the same total. Split walls need a separate overall row.
 const map=new Map(G.nodes.map(n=>[n.id,n]));
 function hasTotal(horizontal){return mode()==='outer'&&group.some(s=>{if(s.tip==='veranda')return false;const a=map.get(s.n1),z=map.get(s.n2);if(!a||!z)return false;const L=Math.hypot(z.x-a.x,z.y-a.y),r=range(s,G.nodes,G.segs,'outer');return horizontal?Math.abs(a.y-z.y)<1e-6&&Math.abs(a.y-s.k/2-b.minY)<1e-6&&Math.abs(r[1]-r[0]-(b.maxX-b.minX))<1e-6:Math.abs(a.x-z.x)<1e-6&&Math.abs(a.x+s.k/2-b.maxX)<1e-6&&Math.abs(r[1]-r[0]-(b.maxY-b.minY))<1e-6;});}
 if(!hasTotal(true))_dimLine(b.minX,b.minY,1,0,0,-1,0,b.maxX-b.minX,72,0,fmtCm(b.maxX-b.minX),DIM.txt,true);
 if(!hasTotal(false))_dimLine(b.maxX,b.minY,0,1,1,0,0,b.maxY-b.minY,72,0,fmtCm(b.maxY-b.minY),DIM.txt,true);}
// A new endpoint can meet an unsplit host. Model its two arms for the preview
// without editing the project or allocating persistent IDs.
function previewRange(start,point,k,nodes,segs,ref,tip){
 const tolerance=.001;
 const end=nodes.find(n=>Math.hypot(n.x-point.x,n.y-point.y)<tolerance)||{...point,id:Symbol()};
 const allNodes=nodes.includes(end)?nodes:[...nodes,end];
 const byId=new Map(allNodes.map(n=>[n.id,n]));
 const arms=[];
 for(const wall of segs){
   const a=byId.get(wall.n1),b=byId.get(wall.n2);
   const dx=b.x-a.x,dy=b.y-a.y,len=Math.hypot(dx,dy);
   for(const p of [start,end]){
     if(p.id===a.id||p.id===b.id||len===0)continue;
     const t=((p.x-a.x)*dx+(p.y-a.y)*dy)/len;
     const off=Math.abs((p.x-a.x)*dy-(p.y-a.y)*dx)/len;
     if(off>=tolerance||t<tolerance||t>len-tolerance)continue;
     arms.push({...wall,n2:p.id},{...wall,n1:p.id});
   }
 }
 return range({id:Symbol(),n1:start.id,n2:end.id,k,tip},allNodes,arms.length?segs.concat(arms):segs,ref);
}
function inputLength(start,dir,value,k,nodes,segs,ref,tip){
 if(ref==='axis')return value;
 const probe={id:Symbol(),x:start.x+dir.x*100000,y:start.y+dir.y*100000};

 const [lo,hi]=previewRange(start,probe,k,nodes,segs,ref,tip);
 const free=value-(hi-lo-100000);
 for(const n of nodes){
   const dx=n.x-start.x,dy=n.y-start.y,L=dx*dir.x+dy*dir.y;
   if(L<=0||Math.abs(dx*dir.y-dy*dir.x)>.00001)continue;
   const r=previewRange(start,n,k,nodes,segs,ref,tip);
   if(Math.abs(r[1]-r[0]-value)<.00001)return L;
 }
 // A typed endpoint may close onto the middle of an existing host.
 const byId=new Map(nodes.map(n=>[n.id,n]));
 for(const seg of segs){
   const a=byId.get(seg.n1),b=byId.get(seg.n2),dx=b.x-a.x,dy=b.y-a.y;
   const det=dir.x*dy-dir.y*dx;
   if(Math.abs(det)<1e-9)continue;
   const ax=a.x-start.x,ay=a.y-start.y;
   const distance=(ax*dy-ay*dx)/det,station=(ax*dir.y-ay*dir.x)/det;
   if(distance<=0||station<=0||station>=1)continue;
   const p={x:start.x+dir.x*distance,y:start.y+dir.y*distance};
   const r=previewRange(start,p,k,nodes,segs,ref,tip);
   if(Math.abs(r[1]-r[0]-value)<.00001)return distance;
 }
 return free;
}
// Square caps match the visible plan stroke. Retain the axis anchor for connected rooms.
function wallFaceHit(cm,nodes,segs,radius){
 const byId=new Map(nodes.map(n=>[n.id,n]));
 function insideOtherWall(point,owner){
   for(const other of segs){
     if(other===owner||other.tip==='veranda')continue;
     const a=byId.get(other.n1),b=byId.get(other.n2);
     const dx=b.x-a.x,dy=b.y-a.y,length=Math.hypot(dx,dy);
     if(!length)continue;
     const along=((point.x-a.x)*dx+(point.y-a.y)*dy)/length;
     const across=Math.abs((point.y-a.y)*dx-(point.x-a.x)*dy)/length;
     const innerHalf=other.k/2-1e-7;
     if(along>-innerHalf&&along<length+innerHalf&&across<innerHalf)return true;
   }
   return false;
 }
 let best=null;
 for(const s of segs){
   if(s.tip==='veranda')continue;
   const a=byId.get(s.n1),b=byId.get(s.n2),dx=b.x-a.x,dy=b.y-a.y,len=Math.hypot(dx,dy);
   if(!len)continue;
   const ux=dx/len,uy=dy/len,h=s.k/2;
   const t=(cm.x-a.x)*ux+(cm.y-a.y)*uy,n=-(cm.x-a.x)*uy+(cm.y-a.y)*ux;
   const clamp=(v,lo,hi)=>Math.max(lo,Math.min(v,hi));
   function offer(along,side,label){
     const d=Math.hypot(t-along,n-side);
     if(d>radius||(best&&best.d<=d))return;
     const station=clamp(along,0,len);
     const x=a.x+ux*along-uy*side,y=a.y+uy*along+ux*side;
     if(insideOtherWall({x,y},s))return;
     best={d,label,x,y,
       anchor:{x:a.x+ux*station,y:a.y+uy*station},node:station===0?a.id:station===len?b.id:null};
   }
   offer(clamp(t,-h,len+h),n<0?-h:h,'Duvar yüzü');
   offer(t<len/2?-h:len+h,clamp(n,-h,h),'Duvar uç yüzü');
 }
 return best;
}
root.FaceDimensions={previewRange,wallFaceHit,range,overall,mode,totals,inputLength};
})(typeof window==='undefined'?globalThis:window);
