/* CAD-only presentation. All coordinates are cm; model/production data is untouched. */
(function(){
 'use strict';
 function dimension(d){
  const {p0,p1,q0,q1,sx,sy,wallPx}=d,L=Math.hypot(q1.x-q0.x,q1.y-q0.y),ux=(q1.x-q0.x)/L,uy=(q1.y-q0.y)/L;
  const middle={x:(q0.x+q1.x)/2+sx*7,y:(q0.y+q1.y)/2+sy*7},picture=[];
  const line=(a,b)=>picture.push({layer:'OLCU',points:[a,b]});
  for(const [p,q] of [[p0,q0],[p1,q1]]){line({x:p.x+sx*(wallPx+3),y:p.y+sy*(wallPx+3)},{x:q.x+sx*3,y:q.y+sy*3});line({x:q.x-(ux+sx)*2.5,y:q.y-(uy+sy)*2.5},{x:q.x+(ux+sx)*2.5,y:q.y+(uy+sy)*2.5});}
  line(q0,q1);let angle=Math.atan2(uy,ux);if(angle>Math.PI/2||angle<=-Math.PI/2)angle+=Math.PI;
  picture.push({layer:'OLCU',text:d.txt,...middle,height:7,angle,align:1,baseline:2});
  return {...d,dimension:true,layer:'OLCU',middle,picture};
 }
 function joint(b){
  const n=b.nid?getNode(b.nid):b.run?{x:b.run.ax+b.run.ux*b.pos,y:b.run.ay+b.run.uy*b.pos}:null;if(!n)return [];
  const layer=b.tip==='kose'?'KOSE_DIREGI':'PANEL_BAGLANTI',out=[];
  const line=points=>out.push({layer,points}),rect=(x,y,w,h)=>out.push({layer,closed:true,points:[{x,y},{x:x+w,y},{x:x+w,y:y+h},{x,y:y+h}]});
  const k=parseFloat(b.k)||10;
  if(b.tip==='kose'){
   const p=pfKoseRect(b.nid,k);rect(p.x,p.y,p.w,p.h);return out;
  }
  const r=b.run,ux=r?r.ux:1,uy=r?r.uy:0,P=(a,o)=>({x:n.x+ux*a-uy*o,y:n.y+uy*a+ux*o});
  if(b.tip==='H'){line([P(0,-k/2),P(0,k/2)]);line([P(-2.5,-k/2),P(2.5,-k/2)]);line([P(-2.5,k/2),P(2.5,k/2)]);}
  else if(b.tip==='U'){
   const branches=G.segs.filter(s=>s.tip!=='veranda'&&(s.n1===b.nid||s.n2===b.nid));let branch=branches.find(s=>{const a=getNode(s.n1),z=getNode(s.n2);return Math.abs((z.x-a.x)*uy-(z.y-a.y)*ux)>.1;})||branches[0];
   if(branch){const z=getNode(branch.n1===b.nid?branch.n2:branch.n1),L=Math.hypot(z.x-n.x,z.y-n.y),vx=(z.x-n.x)/L,vy=(z.y-n.y)/L,h=branch.k/2,Q=(a,o)=>({x:n.x+vx*a-vy*o,y:n.y+vy*a+vx*o});line([Q(3,-h),Q(0,-h),Q(0,h),Q(3,h)]);}
  }else{
   // T / cross connections: compact profile strokes, without screen-only numbered circles.
   for(const s of G.segs.filter(s=>s.tip!=='veranda'&&(s.n1===b.nid||s.n2===b.nid))){const z=getNode(s.n1===b.nid?s.n2:s.n1),L=Math.hypot(z.x-n.x,z.y-n.y),vx=(z.x-n.x)/L,vy=(z.y-n.y)/L,h=s.k/2;line([{x:n.x+vx*3-vy*h,y:n.y+vy*3+vx*h},{x:n.x-vy*h,y:n.y+vx*h},{x:n.x+vy*h,y:n.y-vx*h},{x:n.x+vx*3+vy*h,y:n.y+vy*3-vx*h}]);}
   if(b.uyari)out.push({layer:'UYARI',text:'!',x:n.x+8,y:n.y-8,height:7,angle:0});
  }
  return out;
 }
 function labelIsland(labels,polygon){
  if(!labels.length)return [];
  const c=document.createElement('canvas').getContext('2d');let left=Infinity,right=-Infinity,top=Infinity,bottom=-Infinity;
  for(const e of labels){c.font=(e.height*1.4)+'px Arial';const w=c.measureText(e.text).width;left=Math.min(left,e.x-w/2-4);right=Math.max(right,e.x+w/2+4);top=Math.min(top,e.y-e.height-4);bottom=Math.max(bottom,e.y+e.height+4);}
  const box=[{x:left,y:top},{x:right,y:top},{x:right,y:bottom},{x:left,y:bottom}];
  // An offset label outside its room must never create an invalid hatch island.
  for(let i=0;i<4;i++){const a=box[i],b=box[(i+1)%4];for(let j=0;j<=16;j++)if(!ptInPolygon(a.x+(b.x-a.x)*j/16,a.y+(b.y-a.y)*j/16,polygon))return [];}
  return [box];
 }
 function postPolygons(){
  const out=[];
  if(isPref())for(const b of pfAnaliz().bag)if(b.tip==='kose')out.push(...joint(b).filter(e=>e.closed).map(e=>e.points));
  for(const n of G.nodes){const attached=G.segs.filter(s=>s.n1===n.id||s.n2===n.id);if(attached.length&&attached.every(s=>s.tip==='veranda'))out.push([[-5,-5],[5,-5],[5,5],[-5,5]].map(([x,y])=>({x:n.x+x,y:n.y+y})));}
  return out;
 }
 function roomBoundary(room){
  const nodes=room.nodeIds.map(getNode);if(nodes.some(n=>!n)||nodes.length<3)return {points:[],edges:[]};
  const area=nodes.reduce((a,p,i)=>a+p.x*nodes[(i+1)%nodes.length].y-p.y*nodes[(i+1)%nodes.length].x,0),sign=area>=0?1:-1;
  const edges=nodes.map((a,i)=>{const b=nodes[(i+1)%nodes.length],seg=G.segs.find(s=>(s.n1===a.id&&s.n2===b.id)||(s.n2===a.id&&s.n1===b.id));if(!seg)throw Error('Tarama sınırında eksik duvar.');const dx=b.x-a.x,dy=b.y-a.y,L=Math.hypot(dx,dy);if(L<1e-7)throw Error('Tarama sınırında sıfır uzunluk.');const offset=seg.tip==='veranda'?-5:0;return {seg,a:{x:a.x-dy/L*offset*sign,y:a.y+dx/L*offset*sign},b:{x:b.x-dy/L*offset*sign,y:b.y+dx/L*offset*sign},u:{x:dx/L,y:dy/L}};});
  const joins=edges.map((e,i)=>{const prev=edges[(i+edges.length-1)%edges.length],den=prev.u.x*e.u.y-prev.u.y*e.u.x;if(Math.abs(den)<1e-9)return {incoming:prev.b,outgoing:e.a};const dx=e.a.x-prev.a.x,dy=e.a.y-prev.a.y,t=(dx*e.u.y-dy*e.u.x)/den,p={x:prev.a.x+prev.u.x*t,y:prev.a.y+prev.u.y*t};return {incoming:p,outgoing:p};});
  const points=[];for(const j of joins){points.push(j.incoming);if(Math.hypot(j.incoming.x-j.outgoing.x,j.incoming.y-j.outgoing.y)>1e-7)points.push(j.outgoing);}
  return {points,edges:edges.map((e,i)=>({seg:e.seg,a:joins[i].outgoing,b:joins[(i+1)%edges.length].incoming}))};
 }
 function hatchLoops(room){
  const boundary=roomBoundary(room);if(boundary.points.length<3)return [];
  const cuts=postPolygons();
  // Keep the threshold clear too: hatch stops at the room-facing wall surface,
  // independently of door/window paper masks and screen draw order.
  for(const s of G.segs){if(s.tip==='veranda')continue;const a=getNode(s.n1),b=getNode(s.n2),L=Math.hypot(b.x-a.x,b.y-a.y);if(L<1e-7)continue;const ux=(b.x-a.x)/L,uy=(b.y-a.y)/L,h=s.k/2;cuts.push([[0,h],[L,h],[L,-h],[0,-h]].map(([t,o])=>({x:a.x+ux*t-uy*o,y:a.y+uy*t+ux*o})));}
  const edges=CounterCut.difference(boundary.points,cuts).edges,remaining=new Set(edges),loops=[],key=p=>Math.round(p.x*1e6)+','+Math.round(p.y*1e6),starts=new Map();
  for(const e of edges){const k=key(e.a);if(!starts.has(k))starts.set(k,[]);starts.get(k).push(e);}
  while(remaining.size){const first=remaining.values().next().value,points=[];let e=first;for(let limit=0;limit<=edges.length;limit++){points.push(e.a);remaining.delete(e);if(key(e.b)===key(first.a))break;const next=(starts.get(key(e.b))||[]).filter(q=>remaining.has(q));if(!next.length)throw Error('Net tarama sınırı kapanmadı.');const ux=e.b.x-e.a.x,uy=e.b.y-e.a.y;next.sort((a,b)=>Math.atan2(ux*(a.b.y-a.a.y)-uy*(a.b.x-a.a.x),ux*(a.b.x-a.a.x)+uy*(a.b.y-a.a.y))-Math.atan2(ux*(b.b.y-b.a.y)-uy*(b.b.x-b.a.x),ux*(b.b.x-b.a.x)+uy*(b.b.y-b.a.y)));e=next[0];}if(points.length>=3)loops.push(points);}
  return loops;
 }
 function verandaEdges(){
  const out=[],used=new Set();for(const room of G.rooms.filter(r=>r.tip==='veranda'))for(const e of roomBoundary(room).edges)if(e.seg.tip==='veranda'&&!used.has(e.seg.id)){used.add(e.seg.id);out.push({layer:'VERANDA',points:[e.a,e.b],dashed:true});}
  // Open veranda paths do not define an inside/outside; retain them as axes.
  for(const s of G.segs)if(s.tip==='veranda'&&!used.has(s.id))out.push({layer:'VERANDA',points:[getNode(s.n1),getNode(s.n2)],dashed:true});
  return out;
 }
 window.CadSymbols={dimension,joint,labelIsland,roomBoundary,hatchLoops,verandaEdges,postPolygons};
})();
