/* Records the existing Canvas renderer in drawing coordinates; never reads pixels. */
(function(){
 'use strict';
 const point=(m,x,y)=>({x:m.a*x+m.c*y+m.e,y:m.b*x+m.d*y+m.f});
 const inside=(p,poly)=>{let c=false;for(let i=0,j=poly.length-1;i<poly.length;j=i++){const a=poly[i],b=poly[j];if((a.y>p.y)!==(b.y>p.y)&&p.x<(b.x-a.x)*(p.y-a.y)/(b.y-a.y)+a.x)c=!c;}return c;};
 function clipLine(a,b,poly){
  const dx=b.x-a.x,dy=b.y-a.y,ts=[0,1];
  for(let i=0;i<poly.length;i++){const c=poly[i],d=poly[(i+1)%poly.length],ex=d.x-c.x,ey=d.y-c.y,det=dx*ey-dy*ex;if(Math.abs(det)<1e-9)continue;const t=((c.x-a.x)*ey-(c.y-a.y)*ex)/det,u=((c.x-a.x)*dy-(c.y-a.y)*dx)/det;if(t>0&&t<1&&u>=0&&u<=1)ts.push(t);}
  ts.sort((a,b)=>a-b);const out=[];for(let i=1;i<ts.length;i++){const t=(ts[i-1]+ts[i])/2;if(inside({x:a.x+t*dx,y:a.y+t*dy},poly))out.push([{x:a.x+ts[i-1]*dx,y:a.y+ts[i-1]*dy},{x:a.x+ts[i]*dx,y:a.y+ts[i]*dy}]);}return out;
 }
 window.PlanCanvasRecorder=function(){
  const c=document.createElement('canvas').getContext('2d'),items=[],bounds={minX:Infinity,minY:Infinity,maxX:-Infinity,maxY:-Infinity};
  let paths=[],current=null,clips=[],stack=[],layer='PLAN';
  const p=(x,y)=>point(c.getTransform(),x,y);
  function include(points,pad=0){for(const q of points){bounds.minX=Math.min(bounds.minX,q.x-pad);bounds.minY=Math.min(bounds.minY,q.y-pad);bounds.maxX=Math.max(bounds.maxX,q.x+pad);bounds.maxY=Math.max(bounds.maxY,q.y+pad);}}
  function start(q){current={points:[q],closed:false};paths.push(current);}
  function line(q){if(!current)start(q);else current.points.push(q);}
  function emitPath(path,fill){
   const m=c.getTransform(),lw=c.lineWidth*Math.hypot(m.a,m.b),color=fill?c.fillStyle:c.strokeStyle;
   let pieces=[path];
   if(clips.length){pieces=[];const ps=path.points.concat(path.closed?[path.points[0]]:[]);for(let i=1;i<ps.length;i++){let lines=[[ps[i-1],ps[i]]];for(const poly of clips)lines=lines.flatMap(([a,b])=>clipLine(a,b,poly));pieces.push(...lines.map(points=>({points,closed:false})));}}
   for(const q of pieces)include(q.points,fill?0:lw/2);
   // Wall bodies come from model geometry, with openings cut out. Paper masks
   // and panel colour bands must not become false CAD edges across openings.
   if(layer==='DUVAR'||(layer==='PANEL_BAGLANTI'&&!fill&&lw>3))return;
   if(fill&&(layer==='ODA'||color==='#ffffff'||color==='#fff'||color===TH.opening||color===TH.winFill))return;
   for(const q of pieces)if(q.points.length>1)items.push({...q,layer,dashed:c.getLineDash().length>0});
  }
  const api={items,bounds,setLayer:l=>{layer=l;},
   save(){c.save();stack.push(clips.slice());},restore(){c.restore();clips=stack.pop()||[];},
   beginPath(){paths=[];current=null;},moveTo(x,y){start(p(x,y));},lineTo(x,y){line(p(x,y));},closePath(){if(current)current.closed=true;},
   rect(x,y,w,h){start(p(x,y));line(p(x+w,y));line(p(x+w,y+h));line(p(x,y+h));current.closed=true;},
   roundRect(x,y,w,h,r){r=Math.min(typeof r==='number'?r:r[0]||0,Math.abs(w)/2,Math.abs(h)/2);api.moveTo(x+r,y);api.lineTo(x+w-r,y);api.arc(x+w-r,y+r,r,-Math.PI/2,0);api.lineTo(x+w,y+h-r);api.arc(x+w-r,y+h-r,r,0,Math.PI/2);api.lineTo(x+r,y+h);api.arc(x+r,y+h-r,r,Math.PI/2,Math.PI);api.lineTo(x,y+r);api.arc(x+r,y+r,r,Math.PI,Math.PI*1.5);api.closePath();},
   arc(x,y,r,a,b,ccw=false){api.ellipse(x,y,r,r,0,a,b,ccw);},
   ellipse(x,y,rx,ry,rotation,a,b,ccw=false){let sweep=b-a;if(!ccw){if(sweep>=2*Math.PI)sweep=2*Math.PI;else while(sweep<0)sweep+=2*Math.PI;}else{if(sweep<=-2*Math.PI)sweep=-2*Math.PI;else while(sweep>0)sweep-=2*Math.PI;}const m=c.getTransform(),radius=Math.max(rx,ry)*Math.max(Math.hypot(m.a,m.b),Math.hypot(m.c,m.d));const step=2*Math.acos(Math.max(-1,Math.min(1,1-.02/Math.max(.02,radius))));const count=Math.min(4096,Math.max(4,Math.ceil(Math.abs(sweep)/Math.max(.01,step))));for(let i=0;i<=count;i++){const t=a+sweep*i/count,ex=rx*Math.cos(t),ey=ry*Math.sin(t);line(p(x+ex*Math.cos(rotation)-ey*Math.sin(rotation),y+ex*Math.sin(rotation)+ey*Math.cos(rotation)));}},
   bezierCurveTo(x1,y1,x2,y2,x3,y3){if(!current)start(p(x1,y1));const a=current.points.at(-1),b=p(x1,y1),d=p(x2,y2),e=p(x3,y3);const count=Math.min(2048,Math.max(16,Math.ceil((Math.hypot(b.x-a.x,b.y-a.y)+Math.hypot(d.x-b.x,d.y-b.y)+Math.hypot(e.x-d.x,e.y-d.y))/.5)));for(let i=1;i<=count;i++){const t=i/count,u=1-t;line({x:u*u*u*a.x+3*u*u*t*b.x+3*u*t*t*d.x+t*t*t*e.x,y:u*u*u*a.y+3*u*u*t*b.y+3*u*t*t*d.y+t*t*t*e.y});}},
   quadraticCurveTo(x1,y1,x2,y2){if(!current)start(p(x1,y1));const a=current.points.at(-1),b=p(x1,y1),e=p(x2,y2);for(let i=1;i<=64;i++){const t=i/64,u=1-t;line({x:u*u*a.x+2*u*t*b.x+t*t*e.x,y:u*u*a.y+2*u*t*b.y+t*t*e.y});}},
   clip(){if(current?.points.length>=3)clips.push(current.points.slice());},
   stroke(){paths.forEach(q=>emitPath(q,false));},fill(){paths.forEach(q=>emitPath({...q,closed:true},true));},
   strokeRect(x,y,w,h){const old=paths,cur=current;api.beginPath();api.rect(x,y,w,h);api.stroke();paths=old;current=cur;},
   fillRect(x,y,w,h){const old=paths,cur=current;api.beginPath();api.rect(x,y,w,h);api.fill();paths=old;current=cur;},
   fillText(text,x,y){const m=c.getTransform(),metrics=c.measureText(String(text)),fs=parseFloat(c.font.match(/([\d.]+)px/)?.[1]||10);const left=Number.isFinite(metrics.actualBoundingBoxLeft)?-metrics.actualBoundingBoxLeft:0,right=Number.isFinite(metrics.actualBoundingBoxRight)?metrics.actualBoundingBoxRight:metrics.width;const top=Number.isFinite(metrics.actualBoundingBoxAscent)?-metrics.actualBoundingBoxAscent:-fs,bottom=Number.isFinite(metrics.actualBoundingBoxDescent)?metrics.actualBoundingBoxDescent:fs*.3;include([[left,top],[right,top],[right,bottom],[left,bottom]].map(([a,b])=>point(m,x+a,y+b)),1);
    const q=p(x,y);items.push({layer,text:String(text),x:q.x,y:q.y,height:fs*.72*Math.hypot(m.c,m.d),angle:Math.atan2(m.b,m.a),align:{center:1,right:2,end:2}[c.textAlign]||0,baseline:{top:3,hanging:3,middle:2,bottom:1}[c.textBaseline]||0});},
   strokeText(text,x,y){api.fillText(text,x,y);}
  };
  return new Proxy(api,{get(t,k){if(k in t)return t[k];const v=c[k];return typeof v==='function'?v.bind(c):v;},set(t,k,v){if(k in t)t[k]=v;else c[k]=v;return true;}});
 };
})();
