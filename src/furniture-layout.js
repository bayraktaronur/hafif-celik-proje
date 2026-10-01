/* Read-only room proposals. All distances in cm; circulation values are design defaults. */
(function(){
 'use strict';
 const cat=FurnitureCatalog.items,foot=CounterCut.footprint,inside=CounterCut.inside;
 const area=p=>Math.abs(p.reduce((s,a,i)=>{const b=p[(i+1)%p.length];return s+a.x*b.y-a.y*b.x;},0))/2;
 const bounds=p=>({x0:Math.min(...p.map(a=>a.x)),x1:Math.max(...p.map(a=>a.x)),y0:Math.min(...p.map(a=>a.y)),y1:Math.max(...p.map(a=>a.y))});
 function overlap(a,b){const A=bounds(a),B=bounds(b);if(A.x1<=B.x0+.01||B.x1<=A.x0+.01||A.y1<=B.y0+.01||B.y1<=A.y0+.01)return false;return CounterCut.difference(a,[b]).area<area(a)-.05;}
 function contained(a,b){return CounterCut.difference(a,[b]).area<.05;}
 function local(f,x,y){const a=f.angle*Math.PI/180;return {x:f.x+x*Math.cos(a)-y*Math.sin(a),y:f.y+x*Math.sin(a)+y*Math.cos(a)};}
 function rect(f,x,y,w,d){return foot({...f,...local(f,x,y),w,d});}
 function reserves(f){const item=cat[f.kind],front=item?.front??80,side=item?.side??0,out=[rect(f,0,f.d/2+front/2,f.w,front)];if(side)out.push(rect(f,-f.w/2-side/2,25,side,f.d-50),rect(f,f.w/2+side/2,25,side,f.d-50));return out;}
 function context(room){
   const geo=odaIcGeometri(room);if(!geo||geo.spikes.length)throw Error('Bu odada içe uzanan duvar var; şimdilik elle yerleşim kullanın.');
   const poly=geo.poly.filter((p,i,a)=>i===0||Math.hypot(p.x-a[i-1].x,p.y-a[i-1].y)>.01);
   if(geo.kenar.some(k=>Math.abs(k.e.ux*k.e.uy)>.001))throw Error('Otomatik öneri şu anda yatay/dikey duvarlı odalar içindir.');
   const walls=G.segs.map(s=>{const a=getNode(s.n1),b=getNode(s.n2);return foot({x:(a.x+b.x)/2,y:(a.y+b.y)/2,w:Math.hypot(a.x-b.x,a.y-b.y),d:s.k,angle:Math.atan2(b.y-a.y,b.x-a.x)*180/Math.PI});});
   const doors=[],windows=[],entries=[];
   for(const o of G.elemanlar){const edge=geo.kenar.find(k=>k.e.seg?.id===o.segId)?.e;if(!edge)continue;const s=getSeg(o.segId),a=getNode(s.n1),b=getNode(s.n2),L=Math.hypot(b.x-a.x,b.y-a.y),t=o.t+o.en/(2*L),x=a.x+(b.x-a.x)*t,y=a.y+(b.y-a.y)*t,depth=o.tip_==='kapi'?Math.max(90,o.en+10):45;
     const f={x:x+edge.nx*(edge.k/2+depth/2),y:y+edge.ny*(edge.k/2+depth/2),w:o.en+20,d:depth,angle:(Math.atan2(-edge.nx,edge.ny)*180/Math.PI+360)%360};
     (o.tip_==='kapi'?doors:windows).push(foot(f));if(o.tip_==='kapi')entries.push({x:x+edge.nx*(edge.k/2+50),y:y+edge.ny*(edge.k/2+50)});
   }
   const existing=G.fixtures||[],counters=G.counters||[];
   if(existing.some(f=>doors.some(d=>overlap(foot(f),d)))||counters.some(c=>doors.some(d=>overlap(c.points,d))))throw Error('Mevcut yerleşimde kapı önünü kapatan ürün veya tezgâh var. Önce bu parçayı taşıyın; mevcut eşyalar otomatik taşınmaz.');
   return {poly,edges:geo.kenar.map((k,i)=>({e:k.e,a:geo.poly[i*2],b:geo.poly[i*2+1],L:k.L})),walls,doors,windows,entries,existing,obstacles:[...walls,...existing.map(foot),...counters.map(c=>c.points)],room};
 }
 function valid(f,placed,ctx){const p=foot(f),reserved=reserves(f);return contained(p,ctx.poly)&&reserved.every(r=>contained(r,ctx.poly))&&!ctx.obstacles.some(o=>overlap(p,o)||reserved.some(r=>overlap(r,o)))&&!ctx.doors.some(o=>overlap(p,o))&&(!['wardrobe','coatCabinet','tvUnit','sofa2','sofa3','armchair'].includes(f.kind)||!ctx.windows.some(o=>overlap(p,o)))&&!placed.some(g=>overlap(p,foot(g))||reserves(g).some(r=>overlap(p,r))||reserved.some(r=>overlap(r,foot(g))));}
 function candidates(kind,ctx,variant,anchor,size){const [w,d]=size||cat[kind].sizes[0],out=[];
   for(let j=0;j<ctx.edges.length;j++){const edge=ctx.edges[(j+variant)%ctx.edges.length],e=edge.e;if(edge.L<w+4)continue;const fractions=[.5,.25,.75,0,1];for(const t of fractions){const along=w/2+2+(edge.L-w-4)*t;out.push({kind,w,d,...{x:edge.a.x+e.ux*along+e.nx*(d/2+2),y:edge.a.y+e.uy*along+e.ny*(d/2+2)},angle:(Math.atan2(-e.nx,e.ny)*180/Math.PI+360)%360,mirror:false});}}
   if(anchor&&kind==='coffeeTable')return [0,-50,50].map(x=>({kind,w,d,...local(anchor,x,anchor.d/2+75+d/2),angle:anchor.angle,mirror:false}));
   if(anchor&&kind==='nightstand')return [-1,1].map(sign=>({kind,w,d,...local(anchor,sign*(anchor.w/2+w/2+8),-anchor.d/2+d/2),angle:anchor.angle,mirror:false}));
   if(anchor&&kind==='tvUnit')out.sort((a,b)=>score(a)-score(b));
   if(anchor&&['sofa2','armchair'].includes(kind))out.sort((a,b)=>seatScore(a)-seatScore(b));
   function seatScore(f){const delta=Math.abs(((f.angle-anchor.angle+540)%360)-180);return Math.abs(delta-90)*100+Math.hypot(f.x-anchor.x,f.y-anchor.y);}
   function score(f){const desired=(anchor.angle+180)%360,angle=Math.abs(((f.angle-desired+540)%360)-180);const target=local(anchor,0,anchor.d/2+200);return angle*100+Math.hypot(f.x-target.x,f.y-target.y);}
   return out;
 }
 function distance(p,a,b){const dx=b.x-a.x,dy=b.y-a.y,t=Math.max(0,Math.min(1,((p.x-a.x)*dx+(p.y-a.y)*dy)/(dx*dx+dy*dy||1)));return Math.hypot(p.x-a.x-dx*t,p.y-a.y-dy*t);}
 function near(p,poly,r){return inside(p,poly)||poly.some((a,i)=>distance(p,a,poly[(i+1)%poly.length])<r);}
 function circulation(ctx,fixtures,extra=[]){
   const bb=bounds(ctx.poly),step=20,radius=30,W=Math.ceil((bb.x1-bb.x0)/step),H=Math.ceil((bb.y1-bb.y0)/step);if(W*H>12000)return false;
   const obs=[...ctx.obstacles,...fixtures.map(foot),...extra],nodes=new Map();
   for(let y=0;y<H;y++)for(let x=0;x<W;x++){const p={x:bb.x0+10+x*step,y:bb.y0+10+y*step};if(!inside(p,ctx.poly)||ctx.poly.some((a,i)=>distance(p,a,ctx.poly[(i+1)%ctx.poly.length])<radius)||obs.some(o=>near(p,o,radius)))continue;nodes.set(y*W+x,{...p,xIndex:x,yIndex:y});}
   if(!nodes.size)return false;
   const nearest=p=>[...nodes.keys()].sort((a,b)=>Math.hypot(nodes.get(a).x-p.x,nodes.get(a).y-p.y)-Math.hypot(nodes.get(b).x-p.x,nodes.get(b).y-p.y))[0];
   const seed=ctx.entries.length?nearest(ctx.entries[0]):nodes.keys().next().value,seen=new Set([seed]),queue=[seed];
   for(let i=0;i<queue.length;i++){const id=queue[i],p=nodes.get(id);for(const [dx,dy] of [[-1,0],[1,0],[0,-1],[0,1]]){const x=p.xIndex+dx,y=p.yIndex+dy,n=y*W+x;if(x<0||x>=W||y<0||y>=H||!nodes.has(n)||seen.has(n))continue;seen.add(n);queue.push(n);}}
   const reachable=p=>[...seen].some(id=>Math.hypot(nodes.get(id).x-p.x,nodes.get(id).y-p.y)<=35);
   return ctx.entries.every(reachable)&&fixtures.every(f=>[-.3,0,.3].some(t=>reachable(local(f,f.w*t,f.d/2+45))));
 }
 function furniture(ctx,variant,bed){
   const type=ctx.room.tip,kinds=['yatak','ebeveyn','cocuk'].includes(type)?[bed==='single'?'bedSingle':'bedDouble','wardrobe','nightstand']:['salon','oturma','salon_mutfak'].includes(type)?['sofa3','tvUnit','coffeeTable','sofa2','armchair']:['hol','giris'].includes(type)?['coatCabinet']:[];
   const placed=[],missing=[];for(const kind of kinds){if(ctx.existing.some(f=>f.kind===kind&&inside(f,ctx.poly)))continue;const anchor=placed.find(f=>f.kind.startsWith('bed')||f.kind==='sofa3')||ctx.existing.find(f=>(f.kind.startsWith('bed')||f.kind==='sofa3')&&inside(f,ctx.poly));const f=candidates(kind,ctx,variant,anchor).find(f=>valid(f,placed,ctx)&&circulation(ctx,[...placed,f]));if(f)placed.push(f);else missing.push(cat[kind].name);}
   return {fixtures:placed,counters:[],missing};
 }
 // Search the bedroom as a group; do not commit to the first bed before trying wardrobes.
 function bedroom(ctx,options){
   const owned=ctx.existing.filter(f=>inside(f,ctx.poly)),existingBed=owned.find(f=>['bedSingle','bedDouble'].includes(f.kind)),existingWard=owned.find(f=>f.kind==='wardrobe');
   const kind=options.bed==='single'||(!options.bed&&ctx.room.tip==='cocuk')?'bedSingle':'bedDouble';
   const walls=(kind,size)=>{
     const [w,d]=size,out=candidates(kind,ctx,0,null,size);
     for(const edge of ctx.edges){const e=edge.e;if(edge.L<w+4)continue;
       const offsets=[w/2+2,edge.L-w/2-2];
       // Add opening/obstacle edges and room-specific bed side clearances to the anchors.
       for(const poly of [...ctx.doors,...ctx.windows,...owned.map(foot)]){const ts=poly.map(p=>(p.x-edge.a.x)*e.ux+(p.y-edge.a.y)*e.uy);offsets.push(Math.min(...ts)-w/2-2,Math.max(...ts)+w/2+2);}
       if(kind.startsWith('bed'))offsets.push(w/2+52,edge.L-w/2-52,w/2+65,edge.L-w/2-65);
       for(const t of offsets)if(t>=w/2+2&&t<=edge.L-w/2-2)out.push({kind,w,d,x:edge.a.x+e.ux*t+e.nx*(d/2+2),y:edge.a.y+e.uy*t+e.ny*(d/2+2),angle:(Math.atan2(-e.nx,e.ny)*180/Math.PI+360)%360,mirror:false});
     }
     const seen=new Set();return out.filter(f=>{const k=[f.x,f.y,f.angle].map(x=>Math.round(x*100)).join('/');if(seen.has(k))return false;seen.add(k);return valid(f,[],ctx);});
   };
   const beds=existingBed?[existingBed]:cat[kind].sizes.flatMap(s=>walls(kind,s));
   const wardrobes=existingWard?[existingWard]:[...cat.wardrobe.sizes].sort((a,b)=>b[0]-a[0]).flatMap(s=>walls('wardrobe',s));
   const modes=options.nightstands&&options.nightstands!=='all'?[options.nightstands]:['both','left','right','none'],plans=[],seen=new Set();
   const fits=(f,group)=>valid(f,group,ctx)&&!owned.some(g=>reserves(g).some(r=>overlap(foot(f),r)));
   for(const bed of beds){
     const base=existingBed?[]:[bed],scenarios=new Set();
     for(const mode of modes)for(const leftSize of cat.nightstand.sizes)for(const rightSize of cat.nightstand.sizes){
       let stands=[],failed=false;const signs=mode==='both'?[-1,1]:mode==='left'?[-1]:mode==='right'?[1]:[];
       for(const sign of signs){
         const a=bed.angle*Math.PI/180;
         const already=owned.some(f=>{if(f.kind!=='nightstand')return false;const dx=f.x-bed.x,dy=f.y-bed.y,x=dx*Math.cos(a)+dy*Math.sin(a),y=-dx*Math.sin(a)+dy*Math.cos(a);return Math.sign(x)===sign&&Math.abs(x)<bed.w/2+100&&Math.abs(y+bed.d/2)<90;});if(already)continue;
         const [w,d]=sign<0?leftSize:rightSize,f={kind:'nightstand',w,d,...local(bed,sign*(bed.w/2+w/2+8),-bed.d/2+d/2),angle:bed.angle,mirror:false};
         if(!fits(f,[...base,...stands])){failed=true;break;}stands.push(f);
       }
       if(failed)continue;const scenario=mode+JSON.stringify(stands);if(scenarios.has(scenario))continue;scenarios.add(scenario);
       // Fit each wardrobe against the whole bed + bedside-table combination.
       const group=[...base,...stands],wardKeys=new Set();let found=false;
       for(const wardrobe of wardrobes){const k=wardrobe.w+'/'+wardrobe.angle;if(wardKeys.has(k)||(!existingWard&&!fits(wardrobe,group)))continue;
         const placed=existingWard?group:[...base,wardrobe,...stands];if(!circulation(ctx,placed))continue;found=true;wardKeys.add(k);record(placed,wardrobe,mode,signs.length);if(wardKeys.size>=6)break;
       }
       if(!found&&circulation(ctx,group))record(group,null,mode,signs.length);
     }
   }
   function record(placed,wardrobe,mode,count){
     if(!placed.length)return;const key=JSON.stringify(placed.map(f=>[f.kind,f.w,f.d,f.x,f.y,f.angle]));if(seen.has(key))return;seen.add(key);
     const labels={both:'İki komodin',left:'Sol komodin',right:'Sağ komodin',none:'Komodinsiz'};
     plans.push({fixtures:placed,counters:[],missing:wardrobe?[]:['Gardırop: katalog ölçüleri, kapı/pencere ve kullanım boşluklarıyla uygun yer bulunamadı.'],roomId:ctx.room.id,nightstandMode:mode,layoutLabel:labels[mode]+(wardrobe?' · Gardırop '+wardrobe.w+' × '+wardrobe.d+' cm':' · Gardırop sığmadı'),rank:(wardrobe?10000:0)+count*1000+(wardrobe?.w||0)});
   }
   // A complete wardrobe solution always outranks an incomplete bedroom.
   const complete=plans.some(p=>!p.missing.length),pool=plans.filter(p=>!complete||!p.missing.length).sort((a,b)=>b.rank-a.rank),result=[];
   for(const mode of modes){const p=pool.find(p=>p.nightstandMode===mode);if(p)result.push(p);}
   for(const p of pool){if(result.length>=8)break;if(!result.includes(p)&&!result.some(q=>q.nightstandMode===p.nightstandMode&&JSON.stringify(q.fixtures)===JSON.stringify(p.fixtures)))result.push(p);}
   return result;
 }
 function kitchen(ctx,variant,shape){
   for(let i=0;i<ctx.edges.length;i++){const edge=ctx.edges[(i+variant)%ctx.edges.length],e=edge.e,w=Kitchen.pick({x:(e.a.x+e.b.x)/2+e.nx*(e.k/2+2),y:(e.a.y+e.b.y)/2+e.ny*(e.k/2+2)});if(!w||w.hi-w.lo<320)continue;
     for(const side of shape==='L'?['start','end']:['none'])try{
       const length=Math.min(400,w.hi-w.lo),offset=side==='end'?w.hi-w.lo-length:0,c=Kitchen.make(w,offset,length,side,Math.min(220,(side==='start'?w.left:w.right)?.L-20||220));
       if(!contained(c.points,ctx.poly)||ctx.obstacles.some(o=>overlap(c.points,o))||ctx.doors.some(o=>overlap(c.points,o)))continue;
       const r=c.runs[0],a=r.angle*Math.PI/180,u={x:Math.cos(a),y:Math.sin(a)},v={x:(r.x-(c.points[0].x+c.points[1].x)/2)/30,y:(r.y-(c.points[0].y+c.points[1].y)/2)/30},angle=(Math.atan2(-v.x,v.y)*180/Math.PI+360)%360;
       const specs=[['fridge',75,70,45],['sink',46,46,length/2],['hob',60,50,length-45]],fixtures=specs.map(([kind,fw,d,t])=>({kind,w:fw,d,angle,mirror:false,x:c.points[0].x+u.x*t+v.x*d/2,y:c.points[0].y+u.y*t+v.y*d/2}));
       if(fixtures.some(f=>!contained(foot(f),ctx.poly)||ctx.obstacles.some(o=>overlap(foot(f),o))||ctx.doors.some(o=>overlap(foot(f),o))||(f.kind!=='sink'&&ctx.windows.some(o=>overlap(foot(f),o)))))continue;
       if(!circulation(ctx,fixtures,[c.points]))continue;return {fixtures,counters:[c],missing:[]};
     }catch{}
   }return {fixtures:[],counters:[],missing:['Tezgâh + buzdolabı + evye + ocak: en az 320 cm uygun duvar ve kullanım alanı bulunamadı.']};
 }
 function propose(room,options={}){
   if(['banyo','ebanyo','wc'].includes(room.tip))throw Error('Banyo ve WC otomatik yerleşimi bu sürümde kapalı.');
   if(!['yatak','ebeveyn','cocuk','salon','oturma','salon_mutfak','hol','giris','mutfak'].includes(room.tip))throw Error('Önce odanın türünü yatak odası, salon, mutfak veya giriş olarak belirleyin.');
   const ctx=context(room),plans=[],keys=new Set();
   if(['yatak','ebeveyn','cocuk'].includes(room.tip))return bedroom(ctx,options);
   for(let i=0;i<Math.min(ctx.edges.length,8);i++){const p=room.tip==='mutfak'||options.zone==='kitchen'?kitchen(ctx,i,options.shape||'straight'):furniture(ctx,i,options.bed||(room.tip==='cocuk'?'single':'double'));if(!p.fixtures.length)continue;const key=JSON.stringify(p.fixtures.map(f=>[f.kind,f.x,f.y,f.angle]));if(keys.has(key))continue;keys.add(key);plans.push({...p,roomId:room.id});}
   plans.sort((a,b)=>a.missing.length-b.missing.length);return plans.slice(0,4);
 }
 window.FurnitureLayout={propose,context,valid,circulation,contained,overlap};
})();
