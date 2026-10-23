/* Virtual area boundaries: derived graph only; physical walls and room quantities stay intact. */
(function(){
 const EPS=.001;let cacheKey='',cached=[],selected=null,labelHits=[],drag=null;
 const cross=(a,b)=>a.x*b.y-a.y*b.x;
 function build(){
  const lines=G.annotations.filter(a=>a.shape==='line'&&a.divide!==false);
  const key=JSON.stringify([G.nodes,G.segs.map(s=>[s.id,s.n1,s.n2]),lines,G.rooms.map(r=>[r.id,r.nodeIds])]);if(key===cacheKey)return cached;cacheKey=key;cached=[];if(!lines.length)return cached;
  const edges=G.segs.map(s=>({a:getNode(s.n1),b:getNode(s.n2),source:s.id})).filter(e=>e.a&&e.b);
  for(const a of lines){const t=a.angle*Math.PI/180;edges.push({a:{x:a.x,y:a.y},b:{x:a.x+a.w*Math.cos(t),y:a.y+a.w*Math.sin(t)},source:a.id,annotation:a});}
  edges.forEach(e=>e.ts=[0,1]);
  for(let i=0;i<edges.length;i++)for(let j=i+1;j<edges.length;j++){
   const e=edges[i],f=edges[j],r={x:e.b.x-e.a.x,y:e.b.y-e.a.y},s={x:f.b.x-f.a.x,y:f.b.y-f.a.y},d={x:f.a.x-e.a.x,y:f.a.y-e.a.y},den=cross(r,s);
   if(Math.abs(den)>1e-8){const t=cross(d,s)/den,u=cross(d,r)/den;if(t>=-EPS&&t<=1+EPS&&u>=-EPS&&u<=1+EPS){e.ts.push(Math.max(0,Math.min(1,t)));f.ts.push(Math.max(0,Math.min(1,u)));}}
   else if(Math.abs(cross(d,r))<EPS){for(const [x,y]of [[e,f],[f,e]]){const dx=x.b.x-x.a.x,dy=x.b.y-x.a.y,L=dx*dx+dy*dy;if(!L)continue;for(const p of [y.a,y.b]){const t=((p.x-x.a.x)*dx+(p.y-x.a.y)*dy)/L;if(t>0&&t<1)x.ts.push(t);}}}
  }
  const nodes=[],map=new Map(),segments=[],pairs=new Set();function node(p){const k=Math.round(p.x/EPS)+','+Math.round(p.y/EPS);if(!map.has(k)){map.set(k,nodes.length);nodes.push({...p,adj:[]});}return map.get(k);}
  for(const e of edges){const ts=[...new Set(e.ts)].sort((a,b)=>a-b);for(let i=1;i<ts.length;i++){if(ts[i]-ts[i-1]<1e-8)continue;const ids=[ts[i-1],ts[i]].map(t=>node({x:e.a.x+t*(e.b.x-e.a.x),y:e.a.y+t*(e.b.y-e.a.y)}));if(ids[0]===ids[1])continue;const pair=ids.slice().sort((a,b)=>a-b).join(':');if(pairs.has(pair))continue;pairs.add(pair);const id=segments.length;segments.push({...e,ids});for(let k=0;k<2;k++){const a=nodes[ids[k]],b=nodes[ids[1-k]];a.adj.push({to:ids[1-k],id,ang:Math.atan2(b.y-a.y,b.x-a.x)});}}}
  nodes.forEach(n=>n.adj.sort((a,b)=>a.ang-b.ang));const seen=new Set(),faces=[];
  for(let id=0;id<segments.length;id++)for(const from of segments[id].ids){let cur={id,from},pts=[],used=[];for(let guard=0;guard<segments.length*2+2;guard++){const k=cur.id+'@'+cur.from;if(seen.has(k))break;seen.add(k);pts.push(nodes[cur.from]);used.push(cur.id);const seg=segments[cur.id],to=seg.ids.find(n=>n!==cur.from),list=nodes[to].adj,index=list.findIndex(e=>e.id===cur.id),next=list[(index+1)%list.length];cur={id:next.id,from:to};}
   const area=pts.reduce((s,p,i)=>s+cross(p,pts[(i+1)%pts.length]),0)/2;if(area>=-1)continue;
   const p=pts[0],q=pts[1],L=Math.hypot(q.x-p.x,q.y-p.y),sample={x:(p.x+q.x)/2+(q.y-p.y)/L*.01,y:(p.y+q.y)/2-(q.x-p.x)/L*.01};
   const parent=G.rooms.filter(r=>ptInPolygon(sample.x,sample.y,r.nodeIds.map(getNode))).sort((a,b)=>a.area-b.area)[0];if(!parent)continue;
   const sources=[...new Set(used.map(i=>segments[i].source))].sort(),annotation=used.map(i=>segments[i].annotation).find(Boolean);if(!annotation)continue;
   const signature=sources.join('|');let cx=0,cy=0;pts.forEach((p,i)=>{const q=pts[(i+1)%pts.length],c=cross(p,q);cx+=(p.x+q.x)*c;cy+=(p.y+q.y)*c;});cx/=6*area;cy/=6*area;if(!ptInPolygon(cx,cy,pts)){cx=sample.x;cy=sample.y;}
   faces.push({key:signature,parent:parent.id,poly:pts.map(p=>({x:p.x,y:p.y})),area:-area/10000,x:cx,y:cy,owner:annotation.id,name:annotation.regionNames?.[signature]||'',tip:annotation.regionTypes?.[signature]||'',labelOffset:annotation.regionOffsets?.[signature]||{x:0,y:0}});
  }
  cached=faces.filter(f=>faces.filter(g=>g.parent===f.parent).length>1);return cached;
 }
 function edit(f){openOdaModal({id:f.key,region:f,ozelAd:f.name,tip:f.tip});}
 const saveRoom=window.odaKaydet;window.odaKaydet=function(){if(!_editRoom?.region)return saveRoom();const f=_editRoom.region,name=document.getElementById('odaAd').value.trim(),tip=document.getElementById('odaTip').value;Studio.edit(()=>{const a=G.annotations.find(a=>a.id===f.owner);a.regionNames={...a.regionNames,[f.key]:name};a.regionTypes={...a.regionTypes,[f.key]:tip};});document.getElementById('mbgOda').classList.remove('open');_editRoom=null;draw();updateSidebar();};
 const sidebar=window.updateSidebar;window.updateSidebar=function(){sidebar();if(G.seciliTip!=='region')return;const f=build().find(f=>f.key===G.secili?.key);if(!f)return;document.getElementById('sbSel').style.display='block';const box=document.getElementById('sbSelIc');box.innerHTML='<div class="sr">'+esc(f.name||ODA_TIPLER[f.tip]||'Oda')+'</div><div class="sr">'+esc(ODA_TIPLER[f.tip]||'Tür seçilmedi')+'</div><div class="sr">'+f.area.toFixed(2)+' m²</div><button class="sib p" id="editRegion">Ad ve tür düzenle</button>';document.getElementById('editRegion').onclick=()=>edit(f);};
 const base=drawRooms;window.drawRooms=function(){labelHits=[];base();if(!planVisible('rooms'))return;const list=build();for(const [i,f]of list.entries()){ctx.save();if(!TH.export&&selected===f.key){ctx.beginPath();f.poly.forEach((p,j)=>{const c=toCv(p.x,p.y);j?ctx.lineTo(c.x,c.y):ctx.moveTo(c.x,c.y)});ctx.closePath();ctx.fillStyle='#4f9fc333';ctx.fill();}const offset=drag?.key===f.key?drag.offset:f.labelOffset,c=toCv(f.x+offset.x,f.y+offset.y);const name=f.name||ODA_TIPLER[f.tip]||'Oda '+(i+1),hit=drawRoomLabel({ozelAd:f.name,tip:f.tip,area:f.area},f.poly.map(p=>toCv(p.x,p.y)),c.x,c.y,name,G.seciliTip==='region'&&G.secili?.key===f.key);if(!TH.export)labelHits.push(Object.assign({key:f.key},hit));ctx.restore();}};
 function labelHit(e){const r=cv.getBoundingClientRect(),x=e.clientX-r.left,y=e.clientY-r.top;return labelHits.find(h=>x>=h.x&&x<=h.x+h.w&&y>=h.y&&y<=h.y+h.h);}
 function hit(e){const h=labelHit(e);if(h)return build().find(f=>f.key===h.key);const r=cv.getBoundingClientRect(),p=toCm(e.clientX-r.left,e.clientY-r.top);return build().find(f=>ptInPolygon(p.x,p.y,f.poly));}
 window.addEventListener('dblclick',e=>{if(e.target!==cv||G.tool!=='sec')return;const f=hit(e);if(!f)return;e.preventDefault();e.stopImmediatePropagation();edit(f);},true);
 window.addEventListener('mousedown',e=>{if(e.target!==cv||G.tool!=='sec'||e.button!==0)return;const f=hit(e);if(!f)return;const r=cv.getBoundingClientRect(),p=toCm(e.clientX-r.left,e.clientY-r.top);if(G.segs.some(s=>{const a=getNode(s.n1),b=getNode(s.n2),dx=b.x-a.x,dy=b.y-a.y,t=Math.max(0,Math.min(1,((p.x-a.x)*dx+(p.y-a.y)*dy)/(dx*dx+dy*dy)));return Math.hypot(p.x-a.x-t*dx,p.y-a.y-t*dy)<(+s.k||10)/2+5/sc();}))return;e.preventDefault();e.stopImmediatePropagation();if(labelHit(e))drag={key:f.key,owner:f.owner,start:p,initial:{...f.labelOffset},offset:{...f.labelOffset}};selected=f.key;G.secili=f;G.seciliTip='region';updateSidebar();draw();},true);
 window.addEventListener('mousemove',e=>{if(!drag)return;e.preventDefault();e.stopImmediatePropagation();const r=cv.getBoundingClientRect(),p=toCm(e.clientX-r.left,e.clientY-r.top);drag.offset={x:drag.initial.x+p.x-drag.start.x,y:drag.initial.y+p.y-drag.start.y};draw();},true);
 window.addEventListener('mouseup',e=>{if(!drag||e.button!==0)return;e.preventDefault();e.stopImmediatePropagation();const d=drag;drag=null;if(Math.hypot(d.offset.x-d.initial.x,d.offset.y-d.initial.y)>.01)Studio.edit(()=>{const a=G.annotations.find(a=>a.id===d.owner);a.regionOffsets={...a.regionOffsets,[d.key]:d.offset};});draw();},true);
 window.addEventListener('keydown',e=>{if(e.key==='Escape'&&drag){drag=null;draw();}},true);window.addEventListener('blur',()=>{drag=null;draw();});
 window.AreaRegions={build,has:id=>build().some(f=>f.parent===id)};
})();
