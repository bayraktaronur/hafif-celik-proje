/* Draft visualization only. Cover thicknesses are explicit preview assumptions, not product specifications. */
const DraftFloorLayers=(()=>{
 const covers={deck:2,ceiling:1.25};
 const definitions=[
  {id:'deck',name:'Taban kaplaması',detail:'Betopan / Hekimboard',color:'#c5b89c',number:'01'},
  {id:'insulation',name:'Yalıtım',detail:'Camyünü / taşyünü · şase içinde',color:'#c2c98a',number:'02'},
  {id:'chassis',name:'Galvaniz şase',detail:'125 cm dış en · 20 cm yükseklik',color:'#a8bac6',number:'03'},
  {id:'ceiling',name:'Alt tavan',detail:'Alçıpan kaplama',color:'#f0f1e9',number:'04'}
 ];
 function elevations(height,spread=0){return {
  ceiling:{bottom:height-covers.ceiling,top:height,offset:spread*.4},
  chassis:{bottom:height,top:height+20,offset:spread*1.05},
  insulation:{bottom:height+.5,top:height+19.5,offset:spread*1.7},
  deck:{bottom:height+20,top:height+20+covers.deck,offset:spread*2.35},
  upper:{bottom:height+20+covers.deck,offset:spread*3}
 }}
 // Cavities stop before every actual STL member; insulation is not a solid slab over the steel.
 function cavities(f){
  if(f.invalid)return [];const s=FRAME_REFERENCE.members,clearance=.35,x0=s.left.extent[0]+clearance,x1=f.width-s.right.extent[0]-clearance;
  const n=Math.max(1,Math.floor((f.length-12)/FRAME_REFERENCE.referencePitch)),pitch=(f.length-12)/(n+1),out=[];
  let at=s.head.extent[1]+clearance;
  for(let i=1;i<=n;i++){const start=6+i*pitch-s.cross.extent[1]/2;if(start-clearance>at&&x1>x0)out.push({x0,x1,y0:at,y1:start-clearance});at=start+s.cross.extent[1]+clearance;}
  const end=f.length-s.tail.extent[1]-clearance;if(end>at&&x1>x0)out.push({x0,x1,y0:at,y1:end});return out;
 }
 function ceilingRects(f,data){
  let rects=[{x0:0,x1:f.width,y0:0,y1:f.length}];const nodes=Object.fromEntries(data.nodes.map(n=>[n.id,n]));
  // Ceiling finishes stop at wall faces below the chassis, instead of entering the bearing walls.
  for(const s of data.segs.filter(s=>s.tip!=='veranda')){const a=nodes[s.n1],b=nodes[s.n2],t=s.k/2;
   const world={x0:Math.min(a.x,b.x)-t,x1:Math.max(a.x,b.x)+t,y0:Math.min(a.y,b.y)-t,y1:Math.max(a.y,b.y)+t};
   const cut=f.direction==='y'?{x0:world.x0-f.x,x1:world.x1-f.x,y0:world.y0-f.y,y1:world.y1-f.y}:{x0:world.y0-f.x,x1:world.y1-f.x,y0:world.x0-f.y,y1:world.x1-f.y};
   rects=rects.flatMap(r=>{const x0=Math.max(r.x0,cut.x0),x1=Math.min(r.x1,cut.x1),y0=Math.max(r.y0,cut.y0),y1=Math.min(r.y1,cut.y1);if(x1<=x0||y1<=y0)return [r];return [{...r,x1:x0},{...r,x0:x1},{x0,x1,y0:r.y0,y1:y0},{x0,x1,y0:y1,y1:r.y1}].filter(r=>r.x1-r.x0>.001&&r.y1-r.y0>.001)});
  }return rects;
 }
 function solid(f,r,lo,hi,def){
  const p=[[r.x0,r.y0],[r.x1,r.y0],[r.x1,r.y1],[r.x0,r.y1]],out=[],face=poly=>out.push({poly,kind:'floorLayer',layerId:def.id,partId:f.id,color:def.color,edgeColor:def.id==='insulation'?'#a3ac70':'#979e96'});
  face(p.map(([x,y])=>DraftFrames.world(f,x,y,hi)));face([...p].reverse().map(([x,y])=>DraftFrames.world(f,x,y,lo)));
  for(let i=0;i<4;i++){const a=p[i],b=p[(i+1)%4];face([DraftFrames.world(f,...a,lo),DraftFrames.world(f,...b,lo),DraftFrames.world(f,...b,hi),DraftFrames.world(f,...a,hi)]);}
  if(def.id==='insulation'){
   // Fine deterministic fibres identify the material without an external texture or a fake product logo.
   for(let x=r.x0+4;x<r.x1-3;x+=10)for(let y=r.y0+3;y<r.y1-3;y+=9){const seed=Math.sin(x*7+y*11+f.width)*.5+.5;
    out.push({poly:[[x,y],[x+2+seed*3,y+.6],[x+seed*2,y+1.1]].map(([x,y])=>DraftFrames.world(f,x,y,hi+.015)),kind:'floorLayer',layerId:def.id,partId:f.id,material:'panel',color:seed>.5?'#d5d8ab':'#a9b77d'});
   }
  }
  return out;
 }
 function mesh(frames,height,spread,visibility,data){const out=[],z=elevations(height,spread);
  for(const def of definitions.filter(d=>d.id!=='chassis'&&visibility[d.id]))for(const f of frames){
   if(f.invalid)continue;const rects=def.id==='insulation'?cavities(f):def.id==='ceiling'?ceilingRects(f,data):[{x0:0,x1:f.width,y0:0,y1:f.length}],e=z[def.id];
   for(const r of rects)out.push(...solid(f,r,e.bottom+e.offset,e.top+e.offset,def));
  }return out;
 }
 return {covers,definitions,elevations,cavities,ceilingRects,mesh};
})();
