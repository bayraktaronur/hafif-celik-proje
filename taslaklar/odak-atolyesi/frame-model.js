/* Draft-only placement. Member sections come from the supplied STL; no cost/load calculation. */
const DraftFrames=(()=>{
 const round=n=>Math.round(n*1e5)/1e5;
 const merge=xs=>{const out=[];for(const [a,b] of xs.sort((a,b)=>a[0]-b[0])){const p=out.at(-1);if(p&&a<=p[1]+.001)p[1]=Math.max(p[1],b);else out.push([a,b]);}return out};
 function rectangles(data){
  const rects=[],nodes=Object.fromEntries(data.nodes.map(n=>[n.id,n]));
  for(const room of data.rooms.filter(r=>r.tip!=='veranda'&&r.tip!=='sundurma')){
   const ys=[...new Set(room.points.map(p=>p.y))].sort((a,b)=>a-b);
   for(let i=1;i<ys.length;i++){const y=(ys[i]+ys[i-1])/2,xs=[];
    room.points.forEach((p,j)=>{const q=room.points[(j+1)%room.points.length];if((p.y>y)!==(q.y>y))xs.push(p.x+(q.x-p.x)*(y-p.y)/(q.y-p.y));});xs.sort((a,b)=>a-b);
    for(let j=1;j<xs.length;j+=2)rects.push({x0:xs[j-1],x1:xs[j],y0:ys[i-1],y1:ys[i]});
   }
  }
  // Include the full wall top, including square end/corner overlaps; porch stays outside.
  for(const s of data.segs.filter(s=>s.tip!=='veranda')){const a=nodes[s.n1],b=nodes[s.n2],t=s.k/2;rects.push({x0:Math.min(a.x,b.x)-t,x1:Math.max(a.x,b.x)+t,y0:Math.min(a.y,b.y)-t,y1:Math.max(a.y,b.y)+t});}
  return rects;
 }
 function layout(data,direction='y'){
  let rects=rectangles(data);if(direction==='x')rects=rects.map(r=>({x0:r.y0,x1:r.y1,y0:r.x0,y1:r.x1}));
  const cuts=[...new Set(rects.flatMap(r=>[r.x0,r.x1]))].sort((a,b)=>a-b),slabs=[];
  for(let i=1;i<cuts.length;i++){const x=(cuts[i]+cuts[i-1])/2,spans=merge(rects.filter(r=>r.x0<x&&r.x1>x).map(r=>[r.y0,r.y1])),last=slabs.at(-1);
   if(last&&JSON.stringify(last.spans)===JSON.stringify(spans))last.end=cuts[i];else slabs.push({start:cuts[i-1],end:cuts[i],spans});
  }
  const frames=[];
  for(const slab of slabs)for(const [y0,y1] of slab.spans)for(let x=slab.start;x<slab.end-.001;x+=125){const width=Math.min(125,slab.end-x),length=y1-y0;
   // Tiny boundary slivers are reported, never fabricated as a nominal chassis.
   frames.push({id:'S'+String(frames.length+1).padStart(2,'0'),x:round(x),y:round(y0),width:round(width),length:round(length),height:20,direction,special:width<124.999,invalid:width<=FRAME_REFERENCE.members.left.extent[0]+FRAME_REFERENCE.members.right.extent[0]||length<=12.01});
  }
  return frames;
 }
 const world=(f,x,y,z)=>f.direction==='y'?{x:f.x+x,y:f.y+y,z}:{x:f.y+y,y:f.x+x,z};
 function footprint(f){return [[0,0],[f.width,0],[f.width,f.length],[0,f.length]].map(([x,y])=>world(f,x,y,0));}
 function mesh(f,baseZ=0,selected=false){
  if(f.invalid)return [];const out=[],source=FRAME_REFERENCE.members,side=source.left.extent[0],inside=f.width-2*side;
  const add=(name,x,y,span)=>{const m=source[name],verts=m.vertices;for(let i=0;i<verts.length;i+=9){const poly=[];for(let j=0;j<9;j+=3){const p=[verts[i+j],verts[i+j+1],verts[i+j+2]];p[m.axis]*=span/m.extent[m.axis];
     // Nominalize the sub-millimetre STL endpoint deviations, without scaling a profile's width.
     poly.push(world(f,x+p[0],y+p[1],baseZ+Math.min(20,m.z+p[2])));
    }out.push({kind:'chassis',partId:f.id,member:name,poly,color:selected?'#86cbb3':'#a8bac6',edgeColor:selected?'#427a67':'#667b89'});}
  };
  add('left',0,0,f.length);add('right',f.width-source.right.extent[0],0,f.length);
  add('head',side,0,inside);add('tail',side,f.length-source.tail.extent[1],inside);
  // Preview distribution from the observed pitch; not a confirmed manufacturing spacing rule.
  const n=Math.max(1,Math.floor((f.length-12)/FRAME_REFERENCE.referencePitch)),pitch=(f.length-12)/(n+1);
  for(let i=1;i<=n;i++)add('cross',side,6+i*pitch-source.cross.extent[1]/2,inside);
  return out;
 }
 return {layout,mesh,footprint,rectangles,world};
})();
