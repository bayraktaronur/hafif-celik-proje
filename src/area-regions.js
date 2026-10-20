/* Virtual area boundaries: derived graph only; physical walls and room quantities stay intact. */
(function(){
 const EPS=.001;let cacheKey='',cached=[],selected=null;
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
   faces.push({key:signature,parent:parent.id,poly:pts.map(p=>({x:p.x,y:p.y})),area:-area/10000,x:cx,y:cy,owner:annotation.id,name:annotation.regionNames?.[signature]||''});
  }
  cached=faces.filter(f=>faces.filter(g=>g.parent===f.parent).length>1);return cached;
 }
 const dialog=document.createElement('dialog');dialog.id='areaRegionDialog';dialog.style.cssText='background:#192334;color:#d6e6ef;border:1px solid #40566b;border-radius:12px;padding:24px';dialog.innerHTML='<form><h3>Alt alan adı</h3><p id="regionMeasure"></p><input id="regionName" maxlength="120" placeholder="Örn. Seramik kaplama" style="padding:10px"><button type="submit" class="sib">Kaydet</button><button type="button" class="sib" id="regionCancel">İptal</button></form>';document.body.append(dialog);let editing=null;
 function edit(f){editing=f;document.getElementById('regionMeasure').textContent=f.area.toFixed(2)+' m² · aks sınırları';document.getElementById('regionName').value=f.name;dialog.showModal();document.getElementById('regionName').focus();}
 document.getElementById('regionCancel').onclick=()=>dialog.close();dialog.querySelector('form').onsubmit=e=>{e.preventDefault();const f=editing,name=document.getElementById('regionName').value.trim();if(Studio.edit(()=>{const a=G.annotations.find(a=>a.id===f.owner);a.regionNames={...a.regionNames,[f.key]:name};}))dialog.close();};
 const base=drawRooms;window.drawRooms=function(){base();if(!planVisible('rooms'))return;const list=build();for(const [i,f]of list.entries()){ctx.save();if(!TH.export&&selected===f.key){ctx.beginPath();f.poly.forEach((p,j)=>{const c=toCv(p.x,p.y);j?ctx.lineTo(c.x,c.y):ctx.moveTo(c.x,c.y)});ctx.closePath();ctx.fillStyle='#4f9fc333';ctx.fill();}const c=toCv(f.x,f.y);ctx.textAlign='center';ctx.fillStyle=TH.roomName;ctx.font='13px sans-serif';ctx.fillText(f.name||'Alt alan '+(i+1),c.x,c.y-5);ctx.font='11px sans-serif';ctx.fillStyle=TH.roomArea;ctx.fillText(f.area.toFixed(2)+' m² · aks',c.x,c.y+12);ctx.restore();}};
 function hit(e){const r=cv.getBoundingClientRect(),p=toCm(e.clientX-r.left,e.clientY-r.top);return build().find(f=>ptInPolygon(p.x,p.y,f.poly));}
 window.addEventListener('dblclick',e=>{if(e.target!==cv||G.tool!=='sec')return;const f=hit(e);if(!f)return;e.preventDefault();e.stopImmediatePropagation();edit(f);},true);
 window.addEventListener('mousedown',e=>{if(e.target!==cv||G.tool!=='sec'||e.button!==0)return;const f=hit(e);if(!f)return;const r=cv.getBoundingClientRect(),p=toCm(e.clientX-r.left,e.clientY-r.top);if(G.segs.some(s=>{const a=getNode(s.n1),b=getNode(s.n2),dx=b.x-a.x,dy=b.y-a.y,t=Math.max(0,Math.min(1,((p.x-a.x)*dx+(p.y-a.y)*dy)/(dx*dx+dy*dy)));return Math.hypot(p.x-a.x-t*dx,p.y-a.y-t*dy)<(+s.k||10)/2+5/sc();}))return;e.preventDefault();e.stopImmediatePropagation();selected=f.key;G.secili=null;G.seciliTip=null;updateSidebar();draw();},true);
 window.AreaRegions={build,has:id=>build().some(f=>f.parent===id)};
})();
