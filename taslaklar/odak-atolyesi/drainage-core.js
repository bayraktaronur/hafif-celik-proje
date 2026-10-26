/* Rainwater eaves and downpipes. World centimetres, before the common concrete lift. */
(function(root){
 'use strict';
 const clone=x=>JSON.parse(JSON.stringify(x)),defaults={version:1,color:'#ecece7',outlet:5,wallGap:6,runs:{}};
 const settings=v=>({...clone(defaults),...clone(v||{}),runs:clone(v?.runs||{})});
 function validate(v){if(v==null)return;if(v.version!==1||!/^#[0-9a-f]{6}$/i.test(v.color)||!Number.isFinite(v.outlet)||v.outlet<0||v.outlet>300||!Number.isFinite(v.wallGap)||v.wallGap<4.5||v.wallGap>100||!v.runs||typeof v.runs!=='object'||Array.isArray(v.runs))throw Error('Dere / iniş ayarları geçersiz.');if(Object.keys(v.runs).length>500)throw Error('En fazla 500 saçak ayarı saklanabilir.');for(const c of Object.values(v.runs)){if(typeof c.enabled!=='boolean'||!['both','start','end','custom','none'].includes(c.mode)||!Array.isArray(c.positions)||c.positions.length>30||c.positions.some(p=>!Number.isFinite(p)||p<0||p>20000))throw Error('İniş konumları geçersiz.');}}
 function runs(model,zones,C){
  const out=[];
  for(const e of model.edges.filter(e=>e.type==='eave')){
   const z=zones.find(z=>z.id===e.zoneId);if(!z||z.parapet)continue;
   let p={...e.p},q={...e.q};const lp=C.untransform(z,p),lq=C.untransform(z,q);if(lp.x>lq.x+.001||(Math.abs(lp.x-lq.x)<.001&&lp.y>lq.y))[p,q]=[q,p];
   const len=Math.hypot(q.x-p.x,q.y-p.y);if(len<10)continue;const u={x:(q.x-p.x)/len,y:(q.y-p.y)/len},mid={x:(p.x+q.x)/2,y:(p.y+q.y)/2};
   const face=model.faces.find(f=>f.zoneId===z.id&&f.poly.some((a,i)=>{const b=f.poly[(i+1)%f.poly.length],v={x:b.x-a.x,y:b.y-a.y},l=Math.hypot(v.x,v.y);return Math.abs(v.x*(mid.y-a.y)-v.y*(mid.x-a.x))<.01*l&&((mid.x-a.x)*v.x+(mid.y-a.y)*v.y)>=-.01&&((mid.x-b.x)*v.x+(mid.y-b.y)*v.y)<=.01;}));
   if(!face)continue;let inward={x:-u.y,y:u.x};if(face.a*inward.x+face.b*inward.y<0)inward={x:-inward.x,y:-inward.y};
   const base=(z.childJoin?.support||C.basePolygon(z).map(p=>C.transform(z,p)));
   const matches=base.map((a,side)=>{const b=base[(side+1)%base.length],dx=b.x-a.x,dy=b.y-a.y,l=Math.hypot(dx,dy),d=(a.x-mid.x)*inward.x+(a.y-mid.y)*inward.y;return l>0&&Math.abs(dx*u.y-dy*u.x)<l*.0001&&d>=-.01?{side,d}:null;}).filter(Boolean).sort((a,b)=>a.d-b.d);
   const support=matches[0];if(!support)continue;
   const run={zoneId:z.id,name:z.name,side:support.side,p,q,len,u,inward,overhang:support.d,enabled:z.gutters!==false};
   const old=out.find(r=>r.zoneId===run.zoneId&&r.side===run.side&&Math.abs(r.p.z-p.z)<.001&&Math.abs(r.u.x*u.y-r.u.y*u.x)<1e-6&&Math.abs((p.x-r.p.x)*u.y-(p.y-r.p.y)*u.x)<.001&&Math.min(Math.hypot(r.q.x-p.x,r.q.y-p.y),Math.hypot(q.x-r.p.x,q.y-r.p.y))<.01);
   if(old){const points=[old.p,old.q,p,q].sort((a,b)=>(a.x-b.x)*u.x+(a.y-b.y)*u.y);old.p=points[0];old.q=points.at(-1);old.len=Math.hypot(old.q.x-old.p.x,old.q.y-old.p.y);}else out.push(run);
  }
  out.sort((a,b)=>a.zoneId.localeCompare(b.zoneId)||a.side-b.side||a.p.x-b.p.x||a.p.y-b.p.y);const counters={};
  for(const r of out){const base=r.zoneId+':'+r.side;r.key=base+':'+(counters[base]=(counters[base]||0)+1);r.label=r.name+' · Saçak '+(r.side+1)+(counters[base]>1?' / '+counters[base]:'');}return out;
 }
 function wallDistance(r,offset){
  if(typeof G==='undefined'||!G.nodes?.length)return r.overhang;
  const p={x:r.p.x+r.u.x*offset,y:r.p.y+r.u.y*offset},hits=[];
  for(const s of G.segs||[]){const a=G.nodes.find(n=>n.id===s.n1),b=G.nodes.find(n=>n.id===s.n2);if(!a||!b)continue;const dx=b.x-a.x,dy=b.y-a.y,den=r.inward.x*dy-r.inward.y*dx,l=Math.hypot(dx,dy);if(Math.abs(den)<1e-7)continue;const vx=a.x-p.x,vy=a.y-p.y,t=(vx*dy-vy*dx)/den,u=(vx*r.inward.y-vy*r.inward.x)/den,half=(+s.k||10)/2;if(t<0||u<-half/l||u>1+half/l)continue;const d=t-half*l/Math.abs(den);if(d>=0&&d<=500)hits.push(d);}
  return hits.length?Math.min(...hits):r.overhang;
 }
 function automaticOffsets(r,a,b){
  if(typeof G==='undefined'||!G.nodes?.length)return[a,b];
  const spans=[];
  // A rectangular roof may extend over an open veranda. End downpipes follow the
  // nearest parallel exterior wall span, rather than hanging beyond its corner.
  for(const s of G.segs||[]){if(s.tip==='veranda'||s.dis===false)continue;const p=G.nodes.find(n=>n.id===s.n1),q=G.nodes.find(n=>n.id===s.n2);if(!p||!q)continue;const dx=q.x-p.x,dy=q.y-p.y,L=Math.hypot(dx,dy);if(L<16||Math.abs(dx*r.u.y-dy*r.u.x)>L*.001)continue;const distance=(p.x-r.p.x)*r.inward.x+(p.y-r.p.y)*r.inward.y-(+s.k||10)/2;if(distance<9.2||distance>500)continue;const ends=[p,q].map(p=>(p.x-r.p.x)*r.u.x+(p.y-r.p.y)*r.u.y).sort((a,b)=>a-b),lo=Math.max(4.5,ends[0]),hi=Math.min(r.len-4.5,ends[1]);if(hi-lo>16)spans.push({lo,hi,distance});}
  if(!spans.length)return[a,b];const nearest=Math.min(...spans.map(s=>s.distance)),outer=spans.filter(s=>s.distance<nearest+1);const lo=Math.min(...outer.map(s=>s.lo))+8,hi=Math.max(...outer.map(s=>s.hi))-8;
  return[Math.max(lo,Math.min(hi,a)),Math.max(lo,Math.min(hi,b))];
 }
 function layout(model,zones,C,value){
  const cfg=settings(value);validate(cfg);const list=runs(model,zones,C),warnings=[],result=[];
  for(const r of list){const opt=cfg.runs[r.key]||{enabled:true,mode:'both',positions:[]};r.active=r.enabled&&opt.enabled;r.option=opt;r.pipes=[];if(!r.active){result.push(r);continue;}
   const inset=Math.min(r.len/2,Math.max(20,r.overhang+8)),[a,b]=automaticOffsets(r,inset,r.len-inset);
   const positions=opt.mode==='none'?[]:opt.mode==='custom'?opt.positions:opt.mode==='start'?[a]:opt.mode==='end'?[b]:b-a<12?[(a+b)/2]:[a,b];
   for(const offset of positions){if(offset<4.5||offset>r.len-4.5){warnings.push(r.label+': '+offset+' cm iniş konumu saçak dışında; konumu düzenleyin.');continue;}if(r.pipes.some(p=>Math.abs(p.offset-offset)<12)){warnings.push(r.label+': inişler birbirine çok yakın.');continue;}
    const wall=wallDistance(r,offset);
    if(wall-cfg.wallGap<9.19512){warnings.push(r.label+': saçak mesafesi bu STL dirseğine dar geliyor; iniş yerleşimini kontrol edin.');continue;}
    const top=r.p.z+1,extra=Math.max(0,wall-cfg.wallGap-9.19512),height=top-251.0739746+216-extra-(cfg.outlet+13);
    if(height<15){warnings.push(r.label+': iniş için yeterli düşey mesafe yok; alt uç kotunu kontrol edin.');continue;}
    r.pipes.push({offset,top,extra,straight:height});
   }result.push(r);
  }
  for(const key of Object.keys(cfg.runs))if(!list.some(r=>r.key===key))warnings.push('Çatı değişti: eski bir saçak ayarı artık kullanılmıyor.');
  return {runs:result,cfg,warnings,totals:{gutter:result.filter(r=>r.active).reduce((s,r)=>s+r.len/100,0),pipes:result.reduce((s,r)=>s+r.pipes.length,0)}};
 }
 function mesh(model,zones,C,value){
  const data=layout(model,zones,C,value),M=root.DrainageModel,items=[];if(!M)return{...data,items};const {cfg}=data;
  const add=(polys,transform,kind,r,id)=>{for(const poly of polys)items.push({kind,drainage:true,runKey:r.key,zone:r.zoneId,partId:id,color:cfg.color,poly:poly.map(p=>{const a=transform(p);return{x:r.p.x+r.u.x*a[0]+r.inward.x*a[1],y:r.p.y+r.u.y*a[0]+r.inward.y*a[1],z:a[2]};})});};
  for(const r of data.runs){if(!r.active)continue;const zshift=r.p.z+1-251.0739746,ys=-15.9;
   const join=end=>{const p=r[end],other=data.runs.find(a=>a!==r&&a.active&&Math.abs(a.p.z-p.z)<.01&&[a.p,a.q].some(q=>Math.hypot(q.x-p.x,q.y-p.y)<.01));if(!other)return 0;const d=other.inward.x*r.u.x+other.inward.y*r.u.y;return Math.abs(d)>.1?(1-other.inward.x*r.inward.x-other.inward.y*r.inward.y)/d:0;},startJoin=join('p'),endJoin=join('q');
   const stretch=x=>x<1?x:x>199.758?r.len-(200.758-x):1+(x-1)*(r.len-2)/198.758;
   add(M.gutter,p=>{const t=p[0]/200.758,Y=p[1]+ys;return[stretch(p[0])+((1-t)*startJoin+t*endJoin)*Y,Y,p[2]+zshift];},'rainGutter',r,'gutter:'+r.key);
   const hangers=Math.max(2,Math.ceil(r.len/90)+1);for(let i=0;i<hangers;i++)add(M.hanger,p=>[p[0]-167.264+i*(r.len-2)/(hangers-1)+1,p[1]+ys,p[2]+zshift],'gutterHanger',r,'hanger:'+r.key+':'+i);
   for(const pipe of r.pipes){const id='pipe:'+r.key+':'+pipe.offset,xs=pipe.offset-163.72885,extra=pipe.extra;
    const upper=p=>[p[0]+xs,p[1]+ys,p[2]+zshift];
    const lower=p=>{let z=p[2];if(z<=13)z+=cfg.outlet;else if(z>=216)z+=zshift-extra;else{const t=(z-13)/203,anchor=cfg.outlet+13+pipe.straight*(135/203);z=z<147?cfg.outlet+13+(z-13)*(anchor-1-cfg.outlet-13)/134:z<=149?anchor+(z-148):anchor+1+(z-149)*(pipe.straight+cfg.outlet+13-anchor-1)/67;}return[p[0]+xs,p[1]+ys+extra,z];};
    add(M.upper,upper,'rainDownpipe',r,id);add(M.lower,lower,'rainDownpipe',r,id);
    if(extra>1e-5)for(const pair of M.bridge){const a=upper(pair[0]),b=upper(pair[1]),c=lower(pair[1]),d=lower(pair[0]);add([[a,b,c,d]],p=>p,'rainDownpipe',r,id);}
    const clamps=Math.max(2,Math.ceil(pipe.straight/90)+1);for(let i=0;i<clamps;i++){const z=cfg.outlet+22+i*Math.max(0,pipe.straight-20)/(clamps-1);add(M.clamp,p=>[p[0]+xs,p[1]+ys+extra,p[2]-203.45152+z],'pipeClamp',r,id+':clamp'+i);}
   }
  }return{...data,items};
 }
 function billRows(model,zones,C,value){const d=layout(model,zones,C,value),row=(kalem,olcu,birim,miktar)=>({grup:'Yağmur suyu',kalem,olcu,birim,miktar}),rows=[row('Yağmur deresi','STL kesiti · açık saçak boyunca','m',d.totals.gutter)];for(const r of d.runs)for(const p of r.pipes)rows.push(row('Yağmur inişi',r.label+' · A’dan '+p.offset.toFixed(1)+' cm · düşey boy '+(p.top-d.cfg.outlet).toFixed(1)+' cm','adet',1));return rows;}
 root.RainDrainage={settings,validate,runs,layout,mesh,billRows};
})(typeof window==='undefined'?globalThis:window);
