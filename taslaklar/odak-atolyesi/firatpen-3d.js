/* Millimetre catalogue sections, swept at assembly positions. No old STL morph. */
(function(){
 const cache=new Map();
 function build(e,cat){const key=JSON.stringify([e.en,e.yuk,e.penTip,e.catalogId,e.hand,cat]);if(cache.has(key))return cache.get(key);const d=FiratpenCore.design(e,cat),faces=[];
  function ring(code,x,z,w,h,depth=0){const profile=FiratpenProfiles[code];if(!profile)throw Error('Kesit bulunamadı: '+code);const point=(side,[r,y])=>[{x:x+r,z:z+r,y:y+depth},{x:x+w-r,z:z+r,y:y+depth},{x:x+w-r,z:z+h-r,y:y+depth},{x:x+r,z:z+h-r,y:y+depth}][side];for(let s=0;s<4;s++)for(const line of profile.segments){const t=(s+1)%4;faces.push({profile:code,material:'pvc',poly:[point(s,line[0]),point(s,line[1]),point(t,line[1]),point(t,line[0])]});}}
  function bar(b){const p=FiratpenProfiles['g70-mullion'];for(const [a,c] of p.segments){const point=(v,t)=>b.vertical?{x:b.station+v[0]-40,y:v[1],z:t}:{x:t,y:v[1],z:b.station+v[0]-40};faces.push({profile:'g70-mullion',material:'pvc',poly:[point(a,b.from),point(c,b.from),point(c,b.to),point(a,b.to)]});}}
  function glass(g){for(const y of [g.depth,g.depth+20])faces.push({material:'glass',poly:[{x:g.x,y,z:g.z},{x:g.x+g.w,y,z:g.z},{x:g.x+g.w,y,z:g.z+g.h},{x:g.x,y,z:g.z+g.h}]});}
  if(d.sliding){
   ring('s70-frame',0,0,d.W,d.H);
   // Visual fitting from catalogue assembly (126 mm face, 83 mm tracks).
   // These coordinates and glazing visibility MUST NOT be exported as cutting dimensions.
   const w=d.W/2-6,h=d.H-92;
   for(const [x,y] of [[46,-6.5],[d.W-46-w,28.5]]){ring('s70-sash',x,46,w,h,y);glass({x:x+65,z:111,w:w-130,h:h-130,depth:y+14});}
  }else{
   d.frames.forEach(f=>ring(f.profile,f.x,f.z,f.w,f.h,f.depth));d.bars.forEach(bar);d.glass.forEach(glass);
  }
  const model={...d,faces};if(cache.size>100)cache.clear();cache.set(key,model);return model;
 }
 function append({o,r,surfaces,parts,warnings}){const e=o.e;if(e.tip_!=='pencere')return false;const cat=window.OpeningCatalog?.find(c=>c.id===e.catalogId);let model;try{model=build(e,cat);}catch(error){warnings.add('Fıratpen: '+error.message);return false;}
  const center=(o.a+o.b)/2,mid={x:r.ax+r.ux*center,y:r.ay+r.uy*center},rooms=(G.rooms||[]).filter(q=>q.tip!=='veranda').map(q=>(q.nodeIds||[]).map(getNode)).filter(q=>q.length>=3&&q.every(Boolean)),inside=s=>rooms.some(poly=>ptInPolygon(mid.x-r.uy*s*6,mid.y+r.ux*s*6,poly)),plus=inside(1),minus=inside(-1),inward=plus!==minus?(plus?1:-1):1;
  const meta={kind:'opening',partId:'opening:'+e.id,openingId:e.id,system:'firatpen',series:model.system,glassMm:20,catalogueProfiles:true,hardwareComplete:false,source:'Fıratpen resmî teknik katalog',schematic:false,assemblyStatus:model.sliding?'visual-fit-pending-glass-recipe':'catalogue-section-assembly',productionReady:false};
  for(const f of model.faces){const poly=f.poly.map(p=>{const x=o.a+p.x/10,y=(p.y-35)/10*inward;return{x:r.ax+r.ux*x-r.uy*y,y:r.ay+r.uy*x+r.ux*y,z:o.z+p.z/10};});surfaces.push({...meta,poly,profileCode:f.profile,material:f.material,color:f.material==='glass'?'#728083':window.ProjectSpecs?.windowHex()||'#ffffff',alpha:f.material==='glass'?.32:1});}
  parts.push({...meta,widthMm:e.en*10,heightMm:e.yuk*10,openingTypes:model.cells.map(c=>c.opening)});warnings.add('Fıratpen Garnet 70 / Klasik Sürme 70 · 20 mm cam. Özgün katalog kesitleri; donanım ve sürme cam kesim reçetesi bekliyor.');return true;
 }
 window.Firatpen3D={build,append};
})();
