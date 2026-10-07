/* Centimetre roof geometry. Convex plane patches, exact upper-envelope joins,
   separate groups for physically separate roofs; no structural design. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.RoofCore=api;})(globalThis,function(){
  'use strict';
  const EPS=1e-7;
  const MATERIALS=[
    {id:'trapez',name:'Trapez sac',unit:'sheet',widths:[80,100],color:'#ab6260'},
    {id:'sandvic',name:'Sandviç panel',unit:'sheet',widths:[100],color:'#769395'},
    {id:'tekkat',name:'Tek kat panel',unit:'sheet',widths:[100],color:'#8391a5'},
    {id:'metal',name:'Metal kiremit',unit:'sheet',widths:[80,100],color:'#b75b49'},
    {id:'shingle',name:'Shingle · BTM Galaksi Klasik',unit:'package',widths:[],packageArea:2.52,minPitch:20,color:'#668377',source:'https://www.btm.co/tr/btm-shingle-galaksi-klasik'}
  ];
  const clone=x=>JSON.parse(JSON.stringify(x));
  const LAYERS=[{id:'osb',name:'OSB',width:122,length:244,overlapWidth:0,overlapLength:0,fire:5,unit:'plaka'},
    {id:'nem',name:'Nem bariyeri',width:100,length:1000,overlapWidth:0,overlapLength:0,fire:5,unit:'rulo'},
    {id:'membran',name:'Membran',width:100,length:1000,overlapWidth:0,overlapLength:0,fire:5,unit:'rulo'}];
  function layers(z,legacyOSB=false){return z.layers??(legacyOSB?[{...LAYERS[0],fire:z.fire}]:[]);}
  const cross=(a,b,c)=>(b.x-a.x)*(c.y-a.y)-(b.y-a.y)*(c.x-a.x);
  function signed(poly){return poly.reduce((s,p,i)=>{const q=poly[(i+1)%poly.length];return s+p.x*q.y-q.x*p.y;},0)/2;}
  const area=p=>Math.abs(signed(p));
  const height=(f,p)=>f.a*p.x+f.b*p.y+f.c;
  function clean(p){const q=p.filter((a,i)=>!i||Math.hypot(a.x-p[i-1].x,a.y-p[i-1].y)>EPS);if(q.length>1&&Math.hypot(q[0].x-q.at(-1).x,q[0].y-q.at(-1).y)<EPS)q.pop();return q.length>=3&&area(q)>EPS?q:[];}
  // Retain a*x+b*y+c >= 0.
  function clip(poly,a,b,c){
    const out=[];if(!poly.length)return out;
    poly.forEach((p,i)=>{const q=poly[(i+1)%poly.length],u=a*p.x+b*p.y+c,v=a*q.x+b*q.y+c,inside=u>=-EPS;
      if(inside)out.push(p);if(inside!==(v>=-EPS)){const t=u/(u-v);out.push({x:p.x+t*(q.x-p.x),y:p.y+t*(q.y-p.y)});}
    });return clean(out);
  }
  function edgePlane(p,q){return {a:p.y-q.y,b:q.x-p.x,c:q.y*p.x-q.x*p.y};}
  function intersect(p,q){let out=p;for(let i=0;i<q.length&&out.length;i++){const e=edgePlane(q[i],q[(i+1)%q.length]);out=clip(out,e.a,e.b,e.c);}return out;}
  function subtract(poly,cutter){
    if(!cutter.length||!intersect(poly,cutter).length)return [poly];
    let inside=poly;const outside=[];
    for(let i=0;i<cutter.length&&inside.length;i++){const e=edgePlane(cutter[i],cutter[(i+1)%cutter.length]),p=clip(inside,-e.a,-e.b,-e.c);if(p.length)outside.push(p);inside=clip(inside,e.a,e.b,e.c);}
    return outside;
  }
  function contains(poly,p){return poly.every((v,i)=>cross(v,poly[(i+1)%poly.length],p)>=-1e-5);}
  function transform(z,p){const t=z.angle*Math.PI/180,c=Math.cos(t),s=Math.sin(t);return {x:z.x+p.x*c-p.y*s,y:z.y+p.x*s+p.y*c};}
  function untransform(z,p){const t=z.angle*Math.PI/180,c=Math.cos(t),s=Math.sin(t),x=p.x-z.x,y=p.y-z.y;return {x:x*c+y*s,y:-x*s+y*c};}
  function basePolygon(z){if(z.outline)return z.outline.map(p=>({...p}));return z.type==='bay'?[{x:0,y:0},{x:z.w,y:0},{x:z.w,y:z.d*.55},{x:z.w*.75,y:z.d},{x:z.w*.25,y:z.d},{x:0,y:z.d*.55}]:[{x:0,y:0},{x:z.w,y:0},{x:z.w,y:z.d},{x:0,y:z.d}];}
  function footprint(z){
    if(z.outline)return offsetOutline(z.outline,z.edgeEaves||z.outline.map(()=>z.eaves[0]));
    const e=z.eaves;
    if(z.type!=='bay')return [{x:-e[0],y:-e[2]},{x:z.w+e[1],y:-e[2]},{x:z.w+e[1],y:z.d+e[3]},{x:-e[0],y:z.d+e[3]}];
    const p=basePolygon(z);let out=[{x:-50000,y:-50000},{x:50000,y:-50000},{x:50000,y:50000},{x:-50000,y:50000}];
    p.forEach((v,i)=>{const q=p[(i+1)%p.length],t=edgePlane(v,q),L=Math.hypot(t.a,t.b);out=clip(out,t.a,t.b,t.c+e[0]*L);});return out;
  }
  function turn(z,steps=1){
    if(z.type==='bay')throw Error('Çokgen çıkmada planda dönüş kullanılır.');
    let out=clone(z);for(let i=0;i<((steps%4)+4)%4;i++){const p=transform(out,{x:out.w,y:0}),e=out.eaves;out={...out,outline:out.outline?.map(q=>({x:q.y,y:out.w-q.x})),x:p.x,y:p.y,w:out.d,d:out.w,angle:(out.angle+90)%360,eaves:[e[2],e[3],e[1],e[0]]};}return out;
  }
  function zoneFaces(z){
    if(z.outline&&z.type==='kirma')return outlineHip(z);
    const p=z.pitch/100,base=basePolygon(z),outline=footprint(z);let planes;
    if(z.type==='tek')planes=[{a:0,b:p,c:z.h}];
    else if(z.type==='besik'){const ridge=z.d*z.ridge/100,other=p*ridge/(z.d-ridge);planes=[{a:0,b:p,c:z.h},{a:0,b:-other,c:z.h+other*z.d}];}
    else planes=base.map((v,i)=>{const q=base[(i+1)%base.length],e=edgePlane(v,q),L=Math.hypot(e.a,e.b);return {a:e.a/L*p,b:e.b/L*p,c:z.h+e.c/L*p};});
    if(z.datum==='eave'){const low=Math.min(...outline.flatMap(pt=>planes.map(f=>height(f,pt))));planes.forEach(f=>f.c+=z.h-low);}
    const t=z.angle*Math.PI/180,c=Math.cos(t),s=Math.sin(t);
    return planes.flatMap((plane,i)=>triangulate(outline).flatMap(part=>{
      let poly=part;planes.forEach((other,j)=>{if(i!==j)poly=clip(poly,other.a-plane.a,other.b-plane.b,other.c-plane.c);});if(!poly.length)return [];
      const a=plane.a*c-plane.b*s,b=plane.a*s+plane.b*c;
      return [{zoneId:z.id,group:z.group,key:z.id+'-'+(i+1),a,b,c:plane.c-a*z.x-b*z.y,poly:poly.map(pt=>transform(z,pt))}];
    }));
  }
  function pointIn(poly,p){let inside=false;poly.forEach((a,i)=>{const b=poly[(i+1)%poly.length];if((a.y>p.y)!==(b.y>p.y)&&p.x<(b.x-a.x)*(p.y-a.y)/(b.y-a.y)+a.x)inside=!inside;});return inside;}
  function checkOutline(poly){
    if(!Array.isArray(poly)||poly.length<4||poly.length>40||poly.some(p=>!Number.isFinite(p.x)||!Number.isFinite(p.y)||Math.abs(p.x)>20000||Math.abs(p.y)>20000)||signed(poly)<=EPS)throw Error('Çatı sınırı 4–40 köşeli, saat yönünde olmayan kapalı bir alan olmalı.');
    for(let i=0;i<poly.length;i++){const a=poly[i],b=poly[(i+1)%poly.length];if(Math.hypot(b.x-a.x,b.y-a.y)<.01||Math.abs(a.x-b.x)>.001&&Math.abs(a.y-b.y)>.001)throw Error('Çatı sınırını yatay/dikey kenarlarla çizin.');
      for(let j=i+1;j<poly.length;j++){if(j===i+1||i===0&&j===poly.length-1)continue;const c=poly[j],d=poly[(j+1)%poly.length];if(Math.max(Math.min(a.x,b.x),Math.min(c.x,d.x))<=Math.min(Math.max(a.x,b.x),Math.max(c.x,d.x))+EPS&&Math.max(Math.min(a.y,b.y),Math.min(c.y,d.y))<=Math.min(Math.max(a.y,b.y),Math.max(c.y,d.y))+EPS)throw Error('Çatı sınırı kendisiyle kesişiyor; saçak mesafesini veya köşeleri düzeltin.');}
    }return true;
  }
  function offsetOutline(poly,distances){
    checkOutline(poly);const lines=poly.map((a,i)=>{const b=poly[(i+1)%poly.length],e=edgePlane(a,b),L=Math.hypot(e.a,e.b);return {...e,c:e.c+distances[i]*L};});
    const out=lines.map((b,i)=>{const a=lines[(i+lines.length-1)%lines.length],D=a.a*b.b-b.a*a.b;if(Math.abs(D)<EPS)throw Error('Aynı doğrultudaki ara köşeleri kaldırın.');return{x:(a.b*b.c-b.b*a.c)/D,y:(b.a*a.c-a.a*b.c)/D};});checkOutline(out);return out;
  }
  function triangulate(poly){
    if(poly.every((p,i)=>cross(p,poly[(i+1)%poly.length],poly[(i+2)%poly.length])>=-EPS))return [poly];
    const work=poly.slice(),out=[];let guard=0;
    while(work.length>3){let found=false;for(let i=0;i<work.length;i++){const a=work[(i+work.length-1)%work.length],b=work[i],c=work[(i+1)%work.length];if(cross(a,b,c)<=EPS)continue;if(work.some(p=>p!==a&&p!==b&&p!==c&&contains([a,b,c],p)))continue;out.push([a,b,c]);work.splice(i,1);found=true;break;}if(!found||guard++>100)throw Error('Çatı sınırı üçgenlere ayrılamadı.');}out.push(work);return out;
  }
  function outlineHip(z){
    // Maximal rectangles form intersecting equal-pitch hip roofs for an
    // orthogonal outline; the envelope preserves re-entrant roof valleys.
    const poly=footprint(z),xs=[...new Set(poly.map(p=>p.x))].sort((a,b)=>a-b),ys=[...new Set(poly.map(p=>p.y))].sort((a,b)=>a-b),rects=[];
    for(let i=0;i<xs.length-1;i++)for(let j=i+1;j<xs.length;j++)for(let k=0;k<ys.length-1;k++)for(let l=k+1;l<ys.length;l++){
      const inside=(a,b)=>pointIn(poly,{x:(xs[a]+xs[a+1])/2,y:(ys[b]+ys[b+1])/2});let good=true;
      for(let a=i;a<j&&good;a++)for(let b=k;b<l;b++)if(!inside(a,b)){good=false;break;}if(!good)continue;
      if(i>0&&Array.from({length:l-k},(_,b)=>inside(i-1,k+b)).every(Boolean)||j<xs.length-1&&Array.from({length:l-k},(_,b)=>inside(j,k+b)).every(Boolean)||k>0&&Array.from({length:j-i},(_,a)=>inside(i+a,k-1)).every(Boolean)||l<ys.length-1&&Array.from({length:j-i},(_,a)=>inside(i+a,l)).every(Boolean))continue;
      const origin=transform(z,{x:xs[i],y:ys[k]});rects.push({...z,...origin,id:z.id+'_hip'+rects.length,outline:undefined,edgeEaves:undefined,w:xs[j]-xs[i],d:ys[l]-ys[k],eaves:[0,0,0,0],datum:'wall'});
    }
    if(rects.length>40)throw Error('Kırma çatı çok karmaşık; ana/yavru bölümlere ayırın.');
    return faces(rects).map(f=>({...f,zoneId:z.id,key:z.id+'_'+[f.a,f.b,f.c].map(v=>v.toFixed(6)).join('_')}));
  }
  // The three drawn sides describe supports; the closing side is a host opening.
  function connectChild(input,parent){
    const fail=()=>{throw Error('Yavru çatı bağlanamadı. Dört köşeli açık U uçlarını aynı ana çatı kenarına yakalayın; kot/eğim ana yüzeyle kesişmeli.');};
    if(!parent)fail();const z=clone(input),ps=z.childJoin.points;
    if(!Array.isArray(ps)||ps.length!==4||ps.some(p=>!Number.isFinite(p.x)||!Number.isFinite(p.y)))fail();
    const [a,b,c,d]=ps,mid={x:(a.x+d.x)/2,y:(a.y+d.y)/2},front={x:(b.x+c.x)/2,y:(b.y+c.y)/2},depth=Math.hypot(mid.x-front.x,mid.y-front.y),width=Math.hypot(a.x-d.x,a.y-d.y);
    if(depth<10||width<10)fail();const angle=(Math.round(Math.atan2(mid.y-front.y,mid.x-front.x)*180/Math.PI)+360)%360;if(angle%90)fail();
    const frame={x:front.x,y:front.y,angle},loc=ps.map(p=>untransform(frame,p));
    if(Math.abs(loc[0].x-depth)>.01||Math.abs(loc[3].x-depth)>.01||Math.abs(loc[1].x)>.01||Math.abs(loc[2].x)>.01||Math.abs(loc[0].y-loc[1].y)>.01||Math.abs(loc[2].y-loc[3].y)>.01)fail();
    const host=zoneFaces(parent),outline=footprint(parent).map(p=>transform(parent,p));
    const on=(p,u,v)=>Math.abs(cross(u,v,p))<.01&&((p.x-u.x)*(p.x-v.x)+(p.y-u.y)*(p.y-v.y))<=.01;
    const edgeIndex=outline.findIndex((u,i)=>on(a,u,outline[(i+1)%outline.length])&&on(d,u,outline[(i+1)%outline.length]));
    if(edgeIndex<0)throw Error('U çiziminin ilk ve son noktasını aynı ana çatı kenarına yakalayın.');
    const origin=transform(frame,{x:0,y:-width/2});Object.assign(z,origin,{angle,w:depth,d:width,group:parent.group,outline:undefined,edgeEaves:undefined,boundaryRefs:undefined,joinEdges:undefined,eaves:[z.eaves[0],0,z.eaves[2],z.eaves[3]]});
    if(z.type!=='besik'&&z.type!=='tek')throw Error('Açık U bağlantısında beşik veya tek eğim seçin.');
    // The shared corner already has the parent's overhang. A second offset
    // must not extend the child beyond that edge and leave an unsupported join.
    const edgeYs=[outline[edgeIndex],outline[(edgeIndex+1)%outline.length]].map(p=>untransform(z,p).y);
    const requested=z.childJoin.requestedSideEaves||[z.eaves[2],z.eaves[3]];
    z.childJoin.requestedSideEaves=requested;
    z.eaves[2]=Math.min(requested[0],Math.max(0,-Math.min(...edgeYs)));
    z.eaves[3]=Math.min(requested[1],Math.max(0,Math.max(...edgeYs)-width));
    z.childJoin.cornerTrimmed=z.eaves[2]<requested[0]-.001||z.eaves[3]<requested[1]-.001;
    const planes=zoneFaces(z),ys=[-z.eaves[2],0,width*z.ridge/100,width,width+z.eaves[3]],roots=[];
    // Each roof is piecewise linear. Check the ridge, eaves and every host
    // patch vertex across the opening, then terminate below the host surface.
    host.forEach(f=>f.poly.forEach(p=>{const v=untransform(z,p);if(v.y>ys[0]&&v.y<ys[4])ys.push(v.y);}));
    const dir={x:Math.cos(angle*Math.PI/180),y:Math.sin(angle*Math.PI/180)};
    const mouth=host.filter(f=>f.poly.some(p=>Math.abs(untransform(z,p).x-depth)<.01));
    // A gable-end connection meets a vertical fascia, not an uphill plane.
    // Its ridge remains parallel to the parent ridge; do not look for a
    // non-existent uphill intersection or rotate either production direction.
    if(mouth.length&&mouth.every(f=>Math.abs(f.a*dir.x+f.b*dir.y)<1e-7)){
      const cuts=[-z.eaves[2],width+z.eaves[3],width*z.ridge/100];
      host.forEach(f=>f.poly.forEach((p,i)=>{const a=untransform(z,p),b=untransform(z,f.poly[(i+1)%f.poly.length]);if(Math.abs(b.x-a.x)<EPS){if(Math.abs(a.x-depth)<.01)cuts.push(a.y,b.y);return;}const t=(depth-a.x)/(b.x-a.x);if(t>=0&&t<=1)cuts.push(a.y+t*(b.y-a.y));}));
      const sorted=[...new Set(cuts.filter(y=>y>=-z.eaves[2]&&y<=width+z.eaves[3]))].sort((a,b)=>a-b),panels=[];
      for(let i=1;i<sorted.length;i++){
        const lo=sorted[i-1],hi=sorted[i];if(hi-lo<EPS)continue;
        const mid=transform(z,{x:depth+.0001,y:(lo+hi)/2}),hf=host.filter(f=>contains(f.poly,mid)).sort((a,b)=>height(b,mid)-height(a,mid))[0];if(!hf)fail();
        const cf=planes.reduce((a,b)=>height(a,mid)<height(b,mid)?a:b),p=transform(z,{x:depth,y:lo}),q=transform(z,{x:depth,y:hi}),dp=height(hf,p)-height(cf,p),dq=height(hf,q)-height(cf,q);
        const ts=dp*dq<0?[0,dp/(dp-dq),1]:[0,1];
        for(let j=1;j<ts.length;j++){const a={x:p.x+(q.x-p.x)*ts[j-1],y:p.y+(q.y-p.y)*ts[j-1]},b={x:p.x+(q.x-p.x)*ts[j],y:p.y+(q.y-p.y)*ts[j]};if(Math.max(Math.abs(height(hf,a)-height(cf,a)),Math.abs(height(hf,b)-height(cf,b)))<.001)continue;panels.push([{...a,z:height(cf,a)},{...b,z:height(cf,b)},{...b,z:height(hf,b)},{...a,z:height(hf,a)}]);}
      }
      z.childJoin.mode='gable';z.childJoin.cladding=panels;z.childJoin.support=ps.map(p=>({...p}));return z;
    }
    z.childJoin.mode='valley';delete z.childJoin.cladding;
    for(const y of ys){const p=transform(z,{x:depth+.0001,y}),roof=Math.min(...planes.map(f=>height(f,p))),here=host.filter(f=>contains(f.poly,p));if(!here.length||Math.max(...here.map(f=>height(f,p)))>roof+.01)fail();
      const candidates=[];for(const f of host){const slope=f.a*dir.x+f.b*dir.y;if(slope<=EPS)continue;const t=(roof-height(f,p))/slope,q={x:p.x+dir.x*t,y:p.y+dir.y*t};if(t>=-.01&&contains(f.poly,q))candidates.push(depth+Math.max(0,t));}if(!candidates.length)fail();roots.push(Math.min(...candidates));}
    z.w=Math.max(depth,...roots)+.01;
    // No high terminal edge may emerge past the host or leave a vertical gap.
    for(const y of ys){const p=transform(z,{x:z.w,y}),hs=host.filter(f=>contains(f.poly,p));if(!hs.length||Math.max(...hs.map(f=>height(f,p)))+.02<Math.min(...planes.map(f=>height(f,p))))fail();}
    z.childJoin.support=ps.map(p=>({...p}));return z;
  }
  function defaults(overrides={}){return Object.assign({id:'roof',name:'Ana çatı',type:'besik',group:'ana',x:0,y:0,w:1000,d:800,h:280,angle:0,pitch:33,ridge:50,eaves:[30,30,30,30],material:'trapez',width:100,packageArea:2.52,fire:5,allowance:0,maxLength:0,lap:20,parapet:0,gutters:true},overrides);}
  function validate(zones,custom=[]){
    const fail=m=>{throw Error('Çatı: '+m);},num=(n,a,b)=>typeof n==='number'&&Number.isFinite(n)&&n>=a&&n<=b;
    if(!Array.isArray(zones)||zones.length>24)fail('en fazla 24 bölüm kullanılabilir.');
    if(!Array.isArray(custom)||custom.length>50)fail('kaplama listesi geçersiz.');
    const mat=new Map(MATERIALS.map(m=>[m.id,m]));
    for(const m of custom){if(!m||!/^custom_[-a-zA-Z0-9_]{1,60}$/.test(m.id)||mat.has(m.id)||typeof m.name!=='string'||!m.name.trim()||m.name.length>100||!['sheet','package','area'].includes(m.unit)||!/^#[a-fA-F0-9]{6}$/.test(m.color))fail('özel kaplama bilgisi geçersiz.');
      if(!Array.isArray(m.widths)||m.widths.length>10||m.widths.some(w=>!num(w,10,500))||(m.unit==='sheet'&&!m.widths.length)||(m.unit==='package'&&!num(m.packageArea,.1,100)))fail('kaplama ölçüsü geçersiz.');mat.set(m.id,m);}
    const ids=new Set();for(const z of zones){if(!z||!/^[-a-zA-Z0-9_]{1,80}$/.test(z.id)||ids.has(z.id)||typeof z.name!=='string'||z.name.length>100||typeof z.group!=='string'||!z.group.trim()||z.group.length>80)fail('bölüm adı / kimliği geçersiz.');ids.add(z.id);
      if(!['besik','kirma','tek','bay'].includes(z.type)||!num(z.x,-1e6,1e6)||!num(z.y,-1e6,1e6)||!num(z.w,10,20000)||!num(z.d,10,20000)||!num(z.h,0,20000)||!num(z.angle,0,359)||!num(z.pitch,1,200)||!num(z.ridge,10,90))fail('konum, ölçü veya eğim geçersiz.');
      if(!Array.isArray(z.eaves)||z.eaves.length!==4||z.eaves.some(e=>!num(e,0,500))||!num(z.parapet,0,300)||typeof z.gutters!=='boolean')fail('saçak / parapet geçersiz.');
      if(z.outline){checkOutline(z.outline);if(z.edgeEaves&&(!Array.isArray(z.edgeEaves)||z.edgeEaves.length!==z.outline.length||z.edgeEaves.some(e=>!num(e,0,500))))fail('kenar saçakları geçersiz.');if(z.joinEdges&&(!Array.isArray(z.joinEdges)||z.joinEdges.length!==z.outline.length||z.joinEdges.some(e=>typeof e!=='boolean')))fail('birleşim kenarları geçersiz.');if(z.boundaryRefs&&(!Array.isArray(z.boundaryRefs)||z.boundaryRefs.length!==z.outline.length||z.boundaryRefs.some(r=>r!==null&&(!r||typeof r.nodeId!=='string'||!num(r.dx,-500,500)||!num(r.dy,-500,500)))))fail('mesnet referansı geçersiz.');checkOutline(footprint(z));}
      if(z.childJoin&&(!z.production||z.production.role!=='child'||!Array.isArray(z.childJoin.points)||z.childJoin.points.length!==4||z.childJoin.points.some(p=>!p||!num(p.x,-1e6,1e6)||!num(p.y,-1e6,1e6))||!Array.isArray(z.childJoin.support)||z.childJoin.support.length!==4||z.childJoin.support.some(p=>!p||!num(p.x,-1e6,1e6)||!num(p.y,-1e6,1e6))))fail('U bağlantı sınırı geçersiz.');
      if(z.childJoin?.requestedSideEaves&&(!Array.isArray(z.childJoin.requestedSideEaves)||z.childJoin.requestedSideEaves.length!==2||z.childJoin.requestedSideEaves.some(e=>!num(e,0,500))))fail('U yan saçak değerleri geçersiz.');
      if(z.production&&(!['main','child'].includes(z.production.role)||![0,90].includes(z.production.relative)||typeof z.production.parentId!=='string'))fail('üretim yönü bağlantısı geçersiz.');
      if(z.datum!==undefined&&!['wall','eave'].includes(z.datum))fail('kot referansı geçersiz.');
      if(z.layers!==undefined){if(!Array.isArray(z.layers)||z.layers.length>3)fail('alt katman listesi geçersiz.');const seen=new Set();for(const l of z.layers){if(!l||!LAYERS.some(d=>d.id===l.id)||seen.has(l.id)||!num(l.width,10,500)||!num(l.length,10,20000)||!num(l.overlapWidth,0,l.width-1)||!num(l.overlapLength,0,l.length-1)||!num(l.fire,0,100))fail('katman ölçüsü / bindirmesi geçersiz.');seen.add(l.id);}}
      if(z.vergeWidth!==undefined&&!num(z.vergeWidth,1,5000))fail('Alın V profil ölçüsü 1–5000 mm olmalı.');
      if(z.eaveRule&&(!num(z.eaveRule.gableMm,1,5000)||!num(z.eaveRule.sideMm,0,5000)))fail('Alın / yan saçak ölçüleri geçersiz.');
      if(z.fasciaDepth!==undefined&&!num(z.fasciaDepth,0,50))fail('görsel alın / saçak kapaması 0–50 cm olmalı.');
      if(z.attachment){const l=z.attachment,b=l.base;if(!l||!['tek','besik','karga'].includes(l.mode)||typeof l.parentId!=='string'||!b||!num(b.x,-1e6,1e6)||!num(b.y,-1e6,1e6)||!num(b.w,10,20000)||!num(b.d,10,20000)||!num(b.angle,0,360)||!Array.isArray(b.eaves)||b.eaves.length!==4||b.eaves.some(e=>!num(e,0,500))||!num(l.pitch,1,200)||!num(l.gap,0,100)||!num(l.minClearance,100,500))fail('veranda bağlantı ayarları geçersiz.');}
      if(z.wallTop!==undefined&&!num(z.wallTop,0,20000))fail('duvar üst kotu geçersiz.');
      if(z.floorLevel!==undefined&&(!num(z.floorLevel,0,20000)||z.floorLevel>=(z.wallTop??z.h)))fail('döşeme kotu duvar üstünden aşağıda olmalı.');
      const m=mat.get(z.material);if(!m||!num(z.width,10,500)||(m.unit==='sheet'&&!m.widths.includes(z.width))||!num(z.packageArea,.1,100)||!num(z.fire,0,100)||!num(z.allowance,0,100)||!num(z.maxLength,0,20000)||!num(z.lap,0,200)||z.maxLength>0&&z.maxLength<=z.lap)fail('kaplama eni, boyu veya bindirmesi geçersiz.');
    }for(const z of zones){const seen=new Set([z.id]);let current=z;while(current.production?.role==='child'){const parent=zones.find(p=>p.id===current.production.parentId);if(!parent||seen.has(parent.id))fail('yavru çatının bağlantısı eksik veya döngülü.');seen.add(parent.id);current=parent;}}return true;
  }
  function faces(zones){
    const raw=zones.flatMap(zoneFaces),out=[];
    for(let i=0;i<raw.length;i++){
      const f=raw[i];let parts=[f.poly];
      for(let j=0;j<raw.length&&parts.length;j++){
        const g=raw[j];if(g.zoneId===f.zoneId||g.group!==f.group)continue;
        const a=g.a-f.a,b=g.b-f.b,c=g.c-f.c;
        if(Math.abs(a)+Math.abs(b)+Math.abs(c)<EPS&&j<i)continue; // one owner of coincident planes
        const cutter=clip(g.poly,a,b,c);if(cutter.length)parts=parts.flatMap(p=>subtract(p,cutter));
        if(parts.length>1200)throw Error('Çatı birleşimi fazla karmaşık; bölümleri ayrı gruplara ayırın.');
      }
      out.push(...parts.map(poly=>({...f,poly})));if(out.length>500)throw Error('Çatı yüzey sınırı aşıldı. Bölümleri sadeleştirin.');
    }return out;
  }
  function topology(fs){
    const raw=fs.flatMap((f,fi)=>f.poly.map((p,i)=>({p,q:f.poly[(i+1)%f.poly.length],f,fi}))),buckets=new Map();
    const key=p=>Math.round(p.x*1e4)+','+Math.round(p.y*1e4);
    for(const e of raw){
      const dx=e.q.x-e.p.x,dy=e.q.y-e.p.y,L2=dx*dx+dy*dy;if(L2<EPS)continue;const ts=[0,1];
      for(const k of raw)if(k.f.group===e.f.group)for(const p of [k.p,k.q]){const t=((p.x-e.p.x)*dx+(p.y-e.p.y)*dy)/L2;if(t>EPS&&t<1-EPS&&Math.abs(cross(e.p,e.q,p))/Math.sqrt(L2)<1e-4)ts.push(t);}
      ts.sort((a,b)=>a-b);const uniq=ts.filter((t,i)=>!i||t-ts[i-1]>1e-7);
      for(let i=1;i<uniq.length;i++){const at=t=>({x:e.p.x+dx*t,y:e.p.y+dy*t}),p=at(uniq[i-1]),q=at(uniq[i]),k=e.f.group+'|'+[key(p),key(q)].sort().join('|');if(!buckets.has(k))buckets.set(k,[]);buckets.get(k).push({p,q,f:e.f});}
    }
    const edges=[];
    for(const list of buckets.values()){
      const e=list[0],p=e.p,q=e.q,mid={x:(p.x+q.x)/2,y:(p.y+q.y)/2},z=height(e.f,mid),unique=[...new Map(list.map(v=>[v.f.key,v])).values()];let type,measure=e.f;
      if(list.length>1&&unique.length===1)continue;
      if(unique.length>1){const g=unique[1].f;
        if(Math.abs(e.f.a-g.a)+Math.abs(e.f.b-g.b)<EPS&&Math.abs(e.f.c-g.c)<1e-4)continue;
        if(Math.abs(height(g,mid)-z)>.001){type='step';measure=height(g,mid)>z?g:e.f;}
        else {
          const L=Math.hypot(q.x-p.x,q.y-p.y),n={x:-(q.y-p.y)/L*.01,y:(q.x-p.x)/L*.01};
          const highs=unique.slice(0,2).map(v=>{let t={x:mid.x+n.x,y:mid.y+n.y};if(!contains(v.f.poly,t))t={x:mid.x-n.x,y:mid.y-n.y};return height(v.f,t)-z;});
          type=highs.every(h=>h>EPS)?'valley':highs.every(h=>h<-EPS)?(Math.abs(height(e.f,p)-height(e.f,q))<.001?'ridge':'hip'):'fold';
        }
      }else{
        if(Math.abs(height(e.f,p)-height(e.f,q))>.001)type='verge';
        else{const center=e.f.poly.reduce((a,v)=>({x:a.x+v.x/e.f.poly.length,y:a.y+v.y/e.f.poly.length}),{x:0,y:0});type=height(e.f,center)>z+EPS?'eave':'high';}
      }
      const p3={...p,z:height(measure,p)},q3={...q,z:height(measure,q)};
      edges.push({p:p3,q:q3,type,zoneId:measure.zoneId,group:measure.group,length:Math.hypot(q.x-p.x,q.y-p.y,q3.z-p3.z)/100});
    }return edges;
  }
  function cuts(fs,zones,materials){
    const grouped=new Map();fs.forEach(f=>{if(!grouped.has(f.key))grouped.set(f.key,[]);grouped.get(f.key).push(f);});const rows=[];
    for(const patches of grouped.values()){
      const f=patches[0],z=zones.find(z=>z.id===f.zoneId),m=materials.find(m=>m.id===z.material);if(m.unit!=='sheet')continue;
      const pitch=Math.hypot(f.a,f.b),v={x:f.a/pitch,y:f.b/pitch},u={x:v.y,y:-v.x},factor=Math.sqrt(1+pitch*pitch);
      const polys=patches.map(f=>f.poly.map(p=>({x:p.x*u.x+p.y*u.y,y:p.x*v.x+p.y*v.y}))),min=Math.min(...polys.flat().map(p=>p.x)),max=Math.max(...polys.flat().map(p=>p.x));
      for(let start=min,strip=1;start<max-EPS;start+=z.width,strip++){
        const intervals=polys.map(p=>clip(clip(p,1,0,-start),-1,0,start+z.width)).filter(p=>p.length).map(p=>[Math.min(...p.map(v=>v.y)),Math.max(...p.map(v=>v.y))]).sort((a,b)=>a[0]-b[0]);
        const merged=[];intervals.forEach(v=>{const last=merged.at(-1);if(last&&v[0]<=last[1]+EPS)last[1]=Math.max(last[1],v[1]);else merged.push([...v]);});
        for(const [a,b] of merged){const length=Math.ceil(((b-a)*factor+z.allowance)*10-1e-7)/10;let remaining=length,part=1;
          while(remaining>EPS){const L=z.maxLength?Math.min(remaining,z.maxLength):remaining,begin=a+(length-remaining)/factor,end=Math.min(b,begin+L/factor),polygons=polys.map(p=>clip(clip(clip(clip(p,1,0,-start),-1,0,start+z.width),0,1,-begin),0,-1,end)).filter(p=>p.length).map(p=>p.map(q=>({x:q.x*u.x+q.y*v.x,y:q.x*u.y+q.y*v.y})));rows.push({number:rows.length+1,polygons,zoneId:z.id,name:z.name,face:f.key,strip,part,material:z.material,width:z.width,length:Math.round(L*10)/10,quantity:1});if(rows.length>20000)throw Error('Kesim listesi 20.000 parçayı aşıyor. Boy sınırı ve bindirmeyi kontrol edin.');if(!z.maxLength||remaining<=z.maxLength+EPS)break;remaining-=z.maxLength-z.lap;part++;if(part>2000)throw Error('Levha boy sınırı / bindirmesi çok küçük.');}
        }
      }
    }return rows;
  }
  function stripLines(fs,z){
    const byFace=new Map(),lines=[];fs.filter(f=>f.zoneId===z.id).forEach(f=>{if(!byFace.has(f.key))byFace.set(f.key,[]);byFace.get(f.key).push(f);});
    for(const patches of byFace.values()){
      const f=patches[0],L=Math.hypot(f.a,f.b),v={x:f.a/L,y:f.b/L},u={x:v.y,y:-v.x},ps=patches.map(f=>f.poly.map(p=>({x:p.x*u.x+p.y*u.y,y:p.x*v.x+p.y*v.y}))),min=Math.min(...ps.flat().map(p=>p.x)),max=Math.max(...ps.flat().map(p=>p.x));
      for(let x=min+z.width;x<max-1e-6;x+=z.width){
        const spans=[];for(const poly of ps){const ys=[];poly.forEach((a,i)=>{const b=poly[(i+1)%poly.length];if(Math.abs(b.x-a.x)>EPS&&(a.x-x)*(b.x-x)<=EPS)ys.push(a.y+(x-a.x)*(b.y-a.y)/(b.x-a.x));});if(ys.length>=2)spans.push([Math.min(...ys),Math.max(...ys)]);}
        spans.sort((a,b)=>a[0]-b[0]);const merged=[];spans.forEach(s=>{const last=merged.at(-1);if(last&&s[0]<=last[1]+EPS)last[1]=Math.max(last[1],s[1]);else merged.push([...s]);});
        merged.forEach(([a,b])=>lines.push({p:{x:x*u.x+a*v.x,y:x*u.y+a*v.y},q:{x:x*u.x+b*v.x,y:x*u.y+b*v.y},face:f.key}));
      }
    }return lines;
  }
  // Base rectangle has +Y pointing into the host roof. Keep it separate from
  // the extended roof footprint so columns stay on the veranda axes.
  function attachVeranda(input,parent){
    const z=clone(input),link=z.attachment,b=link.base;
    if(!parent||parent.id===z.id||parent.sourceRoomId)throw Error('Veranda için bir ana çatı seçin.');
    const host=zoneFaces(parent),outline=footprint(parent).map(p=>untransform(b,transform(parent,p))),crossings=[];
    outline.forEach((p,i)=>{const q=outline[(i+1)%outline.length];if((p.x-b.w/2)*(q.x-b.w/2)<=EPS&&Math.abs(q.x-p.x)>EPS)crossings.push(p.y+(b.w/2-p.x)*(q.y-p.y)/(q.x-p.x));});
    if(!crossings.length)throw Error('Veranda ana çatı kenarına yönelmiyor. Ana çatı seçimini kontrol edin.');
    const edge=Math.min(...crossings),point=transform(b,{x:b.w/2,y:edge+.001});
    const f=host.find(f=>contains(f.poly,point));if(!f||edge<=0||edge>b.d+100)throw Error('Veranda ile ana çatı arasında uygun birleşim bulunamadı.');
    const t=b.angle*Math.PI/180,along=f.a*(-Math.sin(t))+f.b*Math.cos(t),across=f.a*Math.cos(t)+f.b*Math.sin(t);
    Object.assign(z,b,{type:'tek',datum:'wall',eaves:[b.eaves[0],b.eaves[1],b.eaves[2],0],group:z.id});
    if(link.mode==='karga'){
      if(along<=EPS||Math.abs(across)>.0001)throw Error('Eğim devamı için veranda, ana çatının eğim yönündeki saçakta olmalı.');
      z.pitch=along*100;z.h=height(f,transform(b,{x:0,y:0}));z.group=parent.group;
    }else if(link.mode==='tek'){
      if(Math.abs(across)>.0001)throw Error('Sundurma başlangıcı yatay bir ana saçak kenarı gerektirir.');
      z.d=edge;z.pitch=link.pitch;z.h=height(f,transform(b,{x:b.w/2,y:edge}))-link.gap-z.pitch/100*edge;
    }else{
      Object.assign(z,turn(z),{type:link.mode,datum:'eave',h:height(f,transform(b,{x:b.w/2,y:edge})),pitch:link.pitch,group:parent.group});
      // Extend the cross roof to its intersection with the host (no truncated ridge).
      const ridgeY=z.d*z.ridge/100,front=transform(z,{x:0,y:ridgeY}),dir=transform(z,{x:1,y:ridgeY}),dx=dir.x-front.x,dy=dir.y-front.y;
      const roofZ=Math.min(...zoneFaces(z).map(f=>height(f,front))),roots=[];
      host.forEach(f=>{const slope=f.a*dx+f.b*dy;if(slope<=EPS)return;const x=(roofZ-height(f,front))/slope,p={x:front.x+dx*x,y:front.y+dy*x};if(x>=edge-EPS&&contains(f.poly,p))roots.push(x);});
      if(!roots.length)throw Error('Ek çatı mahyası ana çatıya ulaşmıyor. Ana çatı kotunu veya ek çatı eğimini düzenleyin.');
      z.w=Math.max(z.w,Math.min(...roots));z.eaves[1]=0;
    }
    z.frontClearance=Math.min(...[-b.eaves[0],b.w+b.eaves[1]].map(x=>{const p=transform(b,{x,y:-b.eaves[2]});return Math.min(...zoneFaces(z).map(f=>height(f,p)));}))-(z.floorLevel||0);
    if(z.h<0)throw Error('Veranda çatısı döşemenin altına iniyor; ana çatı kotunu veya eğimi düzeltin.');
    if(link.mode==='tek'&&z.frontClearance<link.minClearance-EPS)throw Error('Sundurma ön açıklığı '+z.frontClearance.toFixed(1)+' cm; seçilen minimum '+link.minClearance+' cm. Eğimi azaltın veya başlangıç kotunu yükseltin.');
    return z;
  }
  function calculate(zones,custom=[],legacyOSB=false){
    validate(zones,custom);const materials=[...clone(MATERIALS),...clone(custom)],fs=faces(zones),edges=topology(fs),cutList=cuts(fs,zones,materials),warnings=[];
    const byZone=zones.map(z=>{const visible=fs.filter(f=>f.zoneId===z.id),net=visible.reduce((s,f)=>s+area(f.poly)*Math.sqrt(1+f.a*f.a+f.b*f.b)/10000,0),plan=visible.reduce((s,f)=>s+area(f.poly)/10000,0),m=materials.find(m=>m.id===z.material);
      if(!visible.length)warnings.push(z.name+': aynı gruptaki diğer çatının altında kaldı.');
      if(m.minPitch&&visible.some(f=>Math.hypot(f.a,f.b)*100<m.minPitch-EPS))warnings.push(z.name+': seçili shingle ürününde üretici en az %'+m.minPitch+' eğim öneriyor.');
      if(z.parapet)warnings.push(z.name+': parapetli çatı; iç süzgeç, taşma ve parapet kaplaması ayrıca projelendirilir.');
      return {id:z.id,name:z.name,material:z.material,area:net,planArea:plan,purchaseArea:net*(1+z.fire/100),pieces:cutList.filter(c=>c.zoneId===z.id).length};});
    // Package quantities aggregate by actual coverage value, so mixed products are never rounded together.
    const totals=new Map();byZone.forEach(v=>{const z=zones.find(z=>z.id===v.id),m=materials.find(m=>m.id===v.material),key=m.id+'|'+(m.unit==='package'?z.packageArea:'');if(!totals.has(key))totals.set(key,{material:m.id,name:m.name,unit:m.unit,area:0,purchaseArea:0,coverage:z.packageArea,pieces:0,blankArea:0});const t=totals.get(key);t.area+=v.area;t.purchaseArea+=v.purchaseArea;t.pieces+=v.pieces;});
    cutList.forEach(c=>{totals.get(c.material+'|').blankArea+=c.width*c.length/10000;});
    for(const t of totals.values())t.packages=t.unit==='package'?Math.ceil(t.purchaseArea/t.coverage-1e-9):0;
    const lengths={};edges.forEach(e=>{lengths[e.type]=(lengths[e.type]||0)+e.length;});
    const layerTotals=[],layerCuts=[];
    for(const z of zones)for(const l of layers(z,legacyOSB)){
      const def=LAYERS.find(d=>d.id===l.id),netWidth=l.width-l.overlapWidth,rows=cuts(fs.filter(f=>f.zoneId===z.id),[{...z,material:'layer',width:netWidth,maxLength:l.length,lap:l.overlapLength,allowance:0}],[{id:'layer',unit:'sheet'}]);
      const netArea=byZone.find(v=>v.id===z.id).area,quantity=Math.ceil(rows.length*(1+l.fire/100)-EPS);
      layerTotals.push({zoneId:z.id,zoneName:z.name,layer:l.id,name:def.name,unit:def.unit,width:l.width,length:l.length,netArea,pieces:rows.length,quantity,fire:l.fire,purchaseArea:quantity*l.width*l.length/10000});
      rows.forEach(r=>layerCuts.push({...r,layer:l.id,material:def.name,stockWidth:l.width,stockLength:l.length}));
    }
    return {faces:fs,edges,cutList,layerCuts,layerTotals,byZone,materials,totals:[...totals.values()],area:byZone.reduce((s,z)=>s+z.area,0),planArea:byZone.reduce((s,z)=>s+z.planArea,0),lengths,warnings};
  }

  // Millimetres along the slope, starting at the eave ear reference.
  function purlinStations(lengthMm,spacingMm){
    if(!Number.isFinite(lengthMm)||lengthMm<462||lengthMm>1000000||![400,800].includes(spacingMm))return null;
    const end=lengthMm-120,positions=[0,342];
    for(let x=342+spacingMm;x<end-1e-6;x+=spacingMm)positions.push(x);
    if(end-positions.at(-1)>1e-6)positions.push(end);
    return {positions,spacingMm,ridgeOffsetMm:120,eaveIntervalMm:342,remainderMm:positions.length>2?end-positions.at(-2):0};
  }

  function purlinRuns(zones,roofModel,legacyOSB=false){
    const runs=[],pending=[];
    for(const z of zones){const spacing=layers(z,legacyOSB).some(l=>l.id==='osb')?400:z.material==='trapez'?800:null;
     const poly=footprint(z),ys=poly.map(p=>p.y),lo=Math.min(...ys),hi=Math.max(...ys),ridge=z.d*z.ridge/100;
     if(z.type!=='besik'||z.outline||!spacing){pending.push({zoneId:z.id,name:z.name,reason:'Bu çatı biçimi veya kaplama için aşık sıra yerleşimi kontrol edilmeli.'});continue;}
     const localFaces=roofModel.faces.filter(f=>f.zoneId===z.id).map(f=>({...f,local:f.poly.map(p=>untransform(z,p))}));
     let rowNo=0;
     for(const [eave,slope] of [[lo,z.pitch/100],[hi,(z.pitch/100)*ridge/(z.d-ridge)]]){
      const factor=Math.sqrt(1+slope*slope),L=Math.abs(ridge-eave)*factor*10,stations=purlinStations(L,spacing);
      if(!stations){pending.push({zoneId:z.id,name:z.name,reason:'Sabit aşık uçları bu kısa yüze sığmıyor.'});continue;}
      for(const mm of stations.positions){const y=eave+Math.sign(ridge-eave)*mm/(10*factor),intervals=[];
       for(const f of localFaces){const xs=[];f.local.forEach((p,i)=>{const q=f.local[(i+1)%f.local.length];if(Math.abs(p.y-y)<1e-6)xs.push(p.x);if((p.y-y)*(q.y-y)<0)xs.push(p.x+(y-p.y)*(q.x-p.x)/(q.y-p.y));});if(xs.length>1&&Math.max(...xs)-Math.min(...xs)>1e-5)intervals.push([Math.min(...xs),Math.max(...xs)]);}
       intervals.sort((a,b)=>a[0]-b[0]);const merged=[];for(const pair of intervals){const last=merged.at(-1);if(last&&pair[0]<=last[1]+1e-5)last[1]=Math.max(last[1],pair[1]);else merged.push(pair.slice());}
       for(const [a,b] of merged){const p=transform(z,{x:a,y}),q=transform(z,{x:b,y});runs.push({id:z.id+':'+(++rowNo),zoneId:z.id,label:z.name+' / sıra '+rowNo,p,q,lengthMm:Math.round((b-a)*10000)/1000,spacingMm:spacing,stationMm:mm});}
      }
     }
    }
    return {runs,pending};
  }
  return {purlinRuns,purlinStations,connectChild,pointIn,checkOutline,offsetOutline,triangulate,MATERIALS,LAYERS,layers,attachVeranda,turn,defaults,validate,calculate,zoneFaces,footprint,basePolygon,transform,untransform,height,area,clip,intersect,contains,stripLines};
});
