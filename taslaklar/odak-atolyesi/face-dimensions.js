/* Wall-face dimension references; model axes and fabrication remain untouched. */
(function(root){
'use strict';
function range(seg,nodes,segs,mode){
 const map=new Map(nodes.map(n=>[n.id,n])),a=map.get(seg.n1),b=map.get(seg.n2),L=Math.hypot(b.x-a.x,b.y-a.y),u={x:(b.x-a.x)/L,y:(b.y-a.y)/L};
 if(mode==='axis'||seg.tip==='veranda')return [0,L];
 function end(id){let perpendicular=0,collinear=false;for(const s of segs){if(s===seg||s.id===seg.id||s.tip==='veranda'||(s.n1!==id&&s.n2!==id))continue;const p=map.get(s.n1),q=map.get(s.n2),len=Math.hypot(q.x-p.x,q.y-p.y),sin=Math.abs(u.x*(q.y-p.y)/len-u.y*(q.x-p.x)/len);if(sin<1e-6)collinear=true;else perpendicular=Math.max(perpendicular,s.k/(2*sin));}
 if(perpendicular)return (mode==='net'?1:-1)*perpendicular;
 return collinear?0:-seg.k/2;
 }
 const lo=end(seg.n1),hi=L-end(seg.n2);return hi>lo?[lo,hi]:[0,L];
}
function overall(nodes,segs){const map=new Map(nodes.map(n=>[n.id,n])),pts=[];for(const s of segs){if(s.tip==='veranda')continue;const a=map.get(s.n1),b=map.get(s.n2);if(!a||!b)continue;const L=Math.hypot(b.x-a.x,b.y-a.y);if(!L)continue;const ux=(b.x-a.x)/L,uy=(b.y-a.y)/L,h=s.k/2;for(const [p,sign]of [[a,-1],[b,1]])for(const side of [-1,1])pts.push({x:p.x+sign*ux*h-side*uy*h,y:p.y+sign*uy*h+side*ux*h});}if(!pts.length)return null;return {minX:Math.min(...pts.map(p=>p.x)),maxX:Math.max(...pts.map(p=>p.x)),minY:Math.min(...pts.map(p=>p.y)),maxY:Math.max(...pts.map(p=>p.y))};}
function mode(){return G.dimensionReference||'outer';}
function totals(){if(isPref()||!planVisible('outerDims'))return;const b=overall(G.nodes,G.segs);if(!b)return;_dimRow=null;
 // An unbroken exterior wall already displays the same total. Split walls need a separate overall row.
 const map=new Map(G.nodes.map(n=>[n.id,n]));
 function hasTotal(horizontal){return mode()==='outer'&&G.segs.some(s=>{if(s.tip==='veranda')return false;const a=map.get(s.n1),z=map.get(s.n2);if(!a||!z)return false;const L=Math.hypot(z.x-a.x,z.y-a.y),r=range(s,G.nodes,G.segs,'outer');return horizontal?Math.abs(a.y-z.y)<1e-6&&Math.abs(a.y-s.k/2-b.minY)<1e-6&&Math.abs(r[1]-r[0]-(b.maxX-b.minX))<1e-6:Math.abs(a.x-z.x)<1e-6&&Math.abs(a.x+s.k/2-b.maxX)<1e-6&&Math.abs(r[1]-r[0]-(b.maxY-b.minY))<1e-6;});}
 if(!hasTotal(true))_dimLine(b.minX,b.minY,1,0,0,-1,0,b.maxX-b.minX,72,0,fmtCm(b.maxX-b.minX),DIM.txt,true);
 if(!hasTotal(false))_dimLine(b.maxX,b.minY,0,1,1,0,0,b.maxY-b.minY,72,0,fmtCm(b.maxY-b.minY),DIM.txt,true);}
root.FaceDimensions={range,overall,mode,totals};
})(typeof window==='undefined'?globalThis:window);
