/* Standard 60 x 125 cm ceiling panels; mini-H lines are schematic, not a section. */
(function(){
 const C=RoofCore,EPS=.001;
 function layout(poly,longX,z=250){
  poly=poly.filter((p,i)=>!i||Math.hypot(p.x-poly[i-1].x,p.y-poly[i-1].y)>EPS).map(p=>({x:p.x,y:p.y}));
  if(poly.length>1&&Math.hypot(poly[0].x-poly.at(-1).x,poly[0].y-poly.at(-1).y)<EPS)poly.pop();
  if(poly.length<3)return {surfaces:[],lines:[],area:0,panels:0};
  if(poly.reduce((s,p,i)=>{const q=poly[(i+1)%poly.length];return s+p.x*q.y-q.x*p.y},0)<0)poly.reverse();
  const xmin=Math.min(...poly.map(p=>p.x)),xmax=Math.max(...poly.map(p=>p.x)),ymin=Math.min(...poly.map(p=>p.y)),ymax=Math.max(...poly.map(p=>p.y)),dx=longX?125:60,dy=longX?60:125;
  const surfaces=C.triangulate(poly).map(p=>({kind:'ceiling',material:'panel',poly:p.map(q=>({...q,z})),color:'#ebece6',shade:1})),lines=[];
  for(const [axis,start,end,step] of [['x',xmin,xmax,dx],['y',ymin,ymax,dy]])for(let value=start+step;value<end-EPS;value+=step){
   const other=axis==='x'?'y':'x',cross=[];
   poly.forEach((p,i)=>{const q=poly[(i+1)%poly.length];if((p[axis]<=value&&q[axis]>value)||(q[axis]<=value&&p[axis]>value))cross.push(p[other]+(value-p[axis])*(q[other]-p[other])/(q[axis]-p[axis]));});cross.sort((a,b)=>a-b);
   for(let i=0;i+1<cross.length;i+=2)if(cross[i+1]-cross[i]>EPS)lines.push({p:{[axis]:value,[other]:cross[i],z:z-.04},q:{[axis]:value,[other]:cross[i+1],z:z-.04},color:'#9aa8a6',kind:'miniH',length:(cross[i+1]-cross[i])/100});
  }
  return {surfaces,lines,area:C.area(poly)/10000,dx,dy};
 }
 function build(){const surfaces=[],lines=[];let area=0;
  for(const room of G.rooms){const geo=odaIcGeometri(room);if(!geo)continue;const roof=G.roofs.find(z=>z.sourceRoomId===room.id);if(room.tip==='veranda'&&!roof)continue;
   let poly=geo.poly,longX=catiYatay(),level=+G.opt.h||250;
   if(roof?.attachment){const b=roof.attachment.base,members=RoofStudio.verandaMembers(roof);level=Math.min(...members.map(m=>m.kind==='post'?m.top:m.bottom));const local=poly.map(p=>C.untransform(b,p));const result=layout(local,false,level);result.surfaces.forEach(s=>s.poly=s.poly.map(p=>({...C.transform(b,p),z:p.z})));result.lines.forEach(l=>{l.p={...C.transform(b,l.p),z:l.p.z};l.q={...C.transform(b,l.q),z:l.q.z};});surfaces.push(...result.surfaces);lines.push(...result.lines);area+=result.area;
   }else{const r=layout(poly,longX,level);surfaces.push(...r.surfaces);lines.push(...r.lines);area+=r.area;}
  }return {surfaces,lines,area,miniH:lines.reduce((s,l)=>s+l.length,0)};
 }
 window.CeilingPanels={layout,build};
})();