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
   const vertical=(G.catiYon!=='dikey')!==!!n.koseTers,w=vertical?k/2:k,h=vertical?k:k/2;
   const incident=G.segs.filter(s=>s.tip!=='veranda'&&(s.n1===b.nid||s.n2===b.nid));
   const inward=incident.map(s=>{const a=getNode(s.n1===b.nid?s.n2:s.n1);return {x:a.x-n.x,y:a.y-n.y};}).find(d=>vertical?Math.abs(d.x)>Math.abs(d.y):Math.abs(d.y)>Math.abs(d.x));
   const dx=vertical&&inward?-Math.sign(inward.x)*w/2:0,dy=!vertical&&inward?-Math.sign(inward.y)*h/2:0;
   rect(n.x+dx-w/2,n.y+dy-h/2,w,h);return out;
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
 window.CadSymbols={dimension,joint,labelIsland};
})();
