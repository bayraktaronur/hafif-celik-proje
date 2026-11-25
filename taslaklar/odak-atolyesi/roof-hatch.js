/* Symbolic surface hatching in model coordinates; no quantity changes. */
(function(){
 function edges(model,zones){const out=[];
  for(const f of model.faces){const z=zones.find(z=>z.id===f.zoneId);if(!z||!['sandvic','trapez','tekkat','metal','shingle'].includes(z.material))continue;
   const len=Math.hypot(f.a,f.b),a=z.angle*Math.PI/180,dx=len?f.a/len:Math.sin(a),dy=len?f.b/len:Math.cos(a),ux=-dy,uy=dx;
   const poly=f.poly.map(p=>({u:p.x*ux+p.y*uy,v:p.x*dx+p.y*dy}));
   const us=poly.map(p=>p.u),vs=poly.map(p=>p.v),loU=Math.min(...us),hiU=Math.max(...us),loV=Math.min(...vs),hiV=Math.max(...vs);
   const point=(u,v)=>{const x=u*ux+v*dx,y=u*uy+v*dy;return {x,y,z:RoofCore.height(f,{x,y})+(z.material==='trapez'?2.8:.06)};};
   function line(axis,t,from=-Infinity,to=Infinity){const other=axis==='u'?'v':'u',cuts=[];for(let i=0;i<poly.length;i++){const p=poly[i],q=poly[(i+1)%poly.length];if((p[axis]<=t&&q[axis]>t)||(q[axis]<=t&&p[axis]>t))cuts.push(p[other]+(q[other]-p[other])*(t-p[axis])/(q[axis]-p[axis]));}cuts.sort((a,b)=>a-b);for(let i=0;i+1<cuts.length;i+=2){const l=Math.max(cuts[i],from),r=Math.min(cuts[i+1],to);if(r-l<.01)continue;out.push({type:'roofHatch',material:z.material,zone:z.id,p:axis==='u'?point(t,l):point(l,t),q:axis==='u'?point(t,r):point(r,t),color:'#555555'});}}
   if(['sandvic','trapez','tekkat'].includes(z.material)){const step=z.material==='trapez'?20:z.material==='sandvic'?Math.max(20,(z.width||100)/5):25;for(let u=Math.ceil(loU/step)*step;u<hiU;u+=step)line('u',u);}
   else{const course=z.material==='shingle'?25:35;for(let v=Math.ceil(loV/course)*course;v<hiV;v+=course){line('v',v);const offset=z.material==='shingle'?(Math.round(v/course)%2)*30:0;for(let u=Math.floor(loU/60)*60+offset;u<hiU;u+=60)line('u',u,v,v+course);}}
  }return out;
 }
 window.RoofHatch={edges};
})();
