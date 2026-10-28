/* Draft-only floor finish: physical-centimetre patterns, shared clipped screen/export lines. */
(()=>{
 const kinds={auto:'Otomatik',none:'Tarama yok',tile:'Seramik',parquet:'Parke',diagonal:'Çapraz tarama'};
 const defaults={kind:'tile',width:60,length:60,angle:0};let cache=new Map();
 function validate(d){for(const v of [...(d.r||[]).map(r=>r.floorFinish),...(d.annotations||[]).flatMap(a=>Object.values(a.regionFinishes||{}))]){if(v==null)continue;if(v.strength!==undefined&&(!Number.isFinite(v.strength)||v.strength<10||v.strength>100))throw Error('Tarama belirginliği %10–100 olmalı.');if(!Object.hasOwn(kinds,v.kind)||!Number.isFinite(v.width)||v.width<5||v.width>500||!Number.isFinite(v.length)||v.length<5||v.length>500||!Number.isFinite(v.angle)||v.angle<0||v.angle>180)throw Error('Zemin taraması: ölçü 5–500 cm, açı 0–180° olmalı.');}}
 function config(r){let v=r.key?G.annotations.find(a=>a.id===r.owner)?.regionFinishes?.[r.key]:r.floorFinish;if(!v||v.kind==='auto'){const tip=r.tip||(r.key?G.rooms.find(q=>q.id===r.parent)?.tip:'');v={...defaults,strength:v?.strength??65,kind:['banyo','ebanyo','wc'].includes(tip)?'tile':tip==='veranda'?'diagonal':'none',width:30,length:30};}return v;}
 function inside(p,loops){return loops.reduce((v,poly)=>v!==ptInPolygon(p.x,p.y,poly),false);}
 function clip(a,b,loops,region){const ts=[0,1],dx=b.x-a.x,dy=b.y-a.y;for(const poly of [...loops,...(region?[region]:[])])for(let i=0;i<poly.length;i++){const p=poly[i],q=poly[(i+1)%poly.length],ux=q.x-p.x,uy=q.y-p.y,den=dx*uy-dy*ux;if(Math.abs(den)<1e-9)continue;const t=((p.x-a.x)*uy-(p.y-a.y)*ux)/den,u=((p.x-a.x)*dy-(p.y-a.y)*dx)/den;if(t>0&&t<1&&u>=0&&u<=1)ts.push(t);}ts.sort((a,b)=>a-b);const out=[];for(let i=1;i<ts.length;i++){const lo=ts[i-1],hi=ts[i],mid={x:a.x+dx*(lo+hi)/2,y:a.y+dy*(lo+hi)/2};if(hi-lo>1e-8&&inside(mid,loops)&&(!region||ptInPolygon(mid.x,mid.y,region)))out.push([{x:a.x+dx*lo,y:a.y+dy*lo},{x:a.x+dx*hi,y:a.y+dy*hi}]);}return out;}
 function lines(r){const c=config(r);if(c.kind==='none')return [];const parent=r.key?G.rooms.find(q=>q.id===r.parent):r;if(!parent)return [];const key=JSON.stringify([parent.nodeIds,G.nodes,G.segs.map(s=>[s.n1,s.n2,s.k,s.tip]),G.catiYon,r.poly,c]);if(cache.has(key))return cache.get(key);const loops=CadSymbols.hatchLoops(parent),poly=r.poly||loops.flat();if(!poly.length)return [];const angle=(c.angle+(c.kind==='diagonal'?45:0))*Math.PI/180,co=Math.cos(angle),si=Math.sin(angle),local=p=>({x:p.x*co+p.y*si,y:-p.x*si+p.y*co}),world=(x,y)=>({x:x*co-y*si,y:x*si+y*co}),pts=poly.map(local),xmin=Math.min(...pts.map(p=>p.x)),xmax=Math.max(...pts.map(p=>p.x)),ymin=Math.min(...pts.map(p=>p.y)),ymax=Math.max(...pts.map(p=>p.y)),out=[];
 const add=(x,y,X,Y)=>out.push(...clip(world(x,y),world(X,Y),loops,r.poly));
 // Reject pathological imported extents rather than freeze the drawing thread.
 if((ymax-ymin)/c.width*((xmax-xmin)/c.length+1)>40000)return [];
 for(let row=Math.floor(ymin/c.width);row<=Math.ceil(ymax/c.width);row++){const y=row*c.width;add(xmin,y,xmax,y);if(c.kind==='parquet'){const off=(Math.abs(row)%2)*c.length/2;for(let x=Math.floor((xmin-off)/c.length)*c.length+off;x<=xmax;x+=c.length)add(x,Math.max(y,ymin),x,Math.min(y+c.width,ymax));}}
 if(c.kind==='tile')for(let x=Math.floor(xmin/c.length)*c.length;x<=xmax;x+=c.length)add(x,ymin,x,ymax);
 if(cache.size>64)cache.clear();cache.set(key,out);return out;
 }
 function style(c,paper){const t=(c.strength??65)/100;return {color:paper?'#46515b':'#8ba5b3',alpha:.25+.75*t,width:.55+.85*t};}
 function draw(r){const v=style(config(r),TH.export);ctx.save();ctx.strokeStyle=v.color;ctx.globalAlpha=v.alpha;ctx.lineWidth=v.width;ctx.beginPath();for(const [a,b]of lines(r)){const p=toCv(a.x,a.y),q=toCv(b.x,b.y);ctx.moveTo(p.x,p.y);ctx.lineTo(q.x,q.y);}ctx.stroke();ctx.restore();}
 function targets(){return [...G.rooms.filter(r=>!AreaRegions.has(r.id)),...AreaRegions.build()];}
 function apply(r,c){validate({r:[{floorFinish:c}]});Studio.edit(()=>{if(r.key){const a=G.annotations.find(a=>a.id===r.owner);a.regionFinishes={...a.regionFinishes,[r.key]:{...c}};}else{const room=G.rooms.find(q=>q.id===r.id);room.floorFinish={...c};}});window.draw();}
 function exportLines(){return targets().flatMap(r=>lines(r).map(points=>({layer:'ZEMIN_TARAMA',points,floorHatch:true})));}
 window.FloorHatch={style,validate,config,lines,draw,targets,apply,exportLines,kinds};
})();
