/* Offline raster candidates and deterministic orthogonal plan graph. No network. */
(function(root){
const EPS=.01,round=n=>Math.round(n*100)/100;
function detect({data,width:w,height:h},threshold=110){
 if(w<10||h<10||w*h>1200000)throw Error('Görsel alanı geçersiz.');
 const ink=(x,y)=>{const i=(y*w+x)*4;return data[i+3]>100&&(.299*data[i]+.587*data[i+1]+.114*data[i+2])<threshold;},raw=[];
 for(const vertical of [false,true]){const across=vertical?w:h,along=vertical?h:w,min=Math.max(25,along*.18),gap=Math.max(2,Math.floor(along*.008));for(let c=0;c<across;c++){let start=-1,last=-1,hits=0;for(let t=0;t<=along+gap;t++){const dark=t<along&&(vertical?ink(c,t):ink(t,c));if(dark){if(start<0)start=t;last=t;hits++;}if(start>=0&&(t-last>gap||t===along+gap)){if(last-start>=min&&hits/(last-start+1)>.65)raw.push({vertical,c,a:start,b:last});start=-1;hits=0;}}}}
 const groups=[];raw.sort((a,b)=>Number(a.vertical)-Number(b.vertical)||a.c-b.c);for(const r of raw){let g=groups.find(g=>g.vertical===r.vertical&&r.c-g.last<=Math.max(4,Math.min(w,h)*.012)&&Math.min(g.b,r.b)-Math.max(g.a,r.a)>.65*Math.min(g.b-g.a,r.b-r.a));if(g){g.sum+=r.c;g.count++;g.last=r.c;g.a=Math.min(g.a,r.a);g.b=Math.max(g.b,r.b);}else groups.push({...r,sum:r.c,count:1,last:r.c});}
 return groups.filter(g=>g.count>=2).map(g=>{const c=g.sum/g.count;return g.vertical?{x1:c/w,y1:g.a/h,x2:c/w,y2:g.b/h}:{x1:g.a/w,y1:c/h,x2:g.b/w,y2:c/h};}).filter(l=>l.x1>.025&&l.x1<.975&&l.x2>.025&&l.x2<.975||l.y1>.025&&l.y1<.975&&l.y2>.025&&l.y2<.975).slice(0,60);
}
function build(brief,lines,defaults){
 if(!lines.length)throw Error('En az bir iç duvar ekleyin veya yalnız dış duvar seçeneğini kullanın.');return create(brief,lines,defaults);
}
function outlineFromSteps(steps){
 const points=[{x:0,y:0}];
 for(const step of steps){const v={right:[1,0],down:[0,1],left:[-1,0],up:[0,-1]}[step.direction],length=Number(step.length);if(!v||!Number.isFinite(length)||length<=0)throw Error('Her dış kenara yön ve pozitif uzunluk girin.');const p=points.at(-1);points.push({x:round(p.x+v[0]*length),y:round(p.y+v[1]*length)});}
 if(points.length<5||Math.hypot(points.at(-1).x,points.at(-1).y)>.01)throw Error('Dış sınır kapanmıyor. Karşı yönlerdeki ölçü toplamlarını kontrol edin.');points.pop();const minX=Math.min(...points.map(p=>p.x)),minY=Math.min(...points.map(p=>p.y));return points.map(p=>({x:p.x-minX,y:p.y-minY}));
}
function insetOutline(points,k){
 const n=points.length;if(n<4)throw Error('En az dört dış kenar gerekir.');
 let area=0;for(let i=0;i<n;i++){const a=points[i],b=points[(i+1)%n];if(!Number.isFinite(a.x+a.y)||Math.hypot(b.x-a.x,b.y-a.y)<k||((a.x!==b.x)&&(a.y!==b.y)))throw Error('Dış kenarlar yatay/dikey ve duvar kalınlığından uzun olmalı.');area+=a.x*b.y-b.x*a.y;}
 if(Math.abs(area)<1)throw Error('Dış sınır alanı geçersiz.');
 for(let i=0;i<n;i++)for(let j=i+1;j<n;j++){if(j===i+1||(i===0&&j===n-1))continue;const a=points[i],b=points[(i+1)%n],c=points[j],d=points[(j+1)%n];if(Math.max(Math.min(a.x,b.x),Math.min(c.x,d.x))<=Math.min(Math.max(a.x,b.x),Math.max(c.x,d.x))+EPS&&Math.max(Math.min(a.y,b.y),Math.min(c.y,d.y))<=Math.min(Math.max(a.y,b.y),Math.max(c.y,d.y))+EPS)throw Error('Dış sınır kendi üzerinden geçiyor. Kenar sırasını düzeltin.');}
 const sign=Math.sign(area),edges=points.map((a,i)=>{const b=points[(i+1)%n],dx=Math.sign(b.x-a.x),dy=Math.sign(b.y-a.y);return {a:{x:a.x-dy*k/2*sign,y:a.y+dx*k/2*sign},dx,dy};});
 const result=edges.map((e,i)=>{const prev=edges[(i+n-1)%n];if(e.dx===prev.dx&&e.dy===prev.dy)throw Error('Aynı yönlü ardışık dış kenarları tek ölçüde birleştirin.');if(e.dx*prev.dy-e.dy*prev.dx===0)throw Error('Dış kenar geriye dönüyor.');return {x:round(e.dx?prev.a.x:e.a.x),y:round(e.dy?prev.a.y:e.a.y)};});
 result.forEach((p,i)=>{const q=result[(i+1)%n],e=edges[i];if((q.x-p.x)*e.dx+(q.y-p.y)*e.dy<=EPS)throw Error('Girinti duvar kalınlığı için çok dar.');});return result;
}
function create(b,input,defaults={},outline=null){
 if(!b||!['prefabrik','celik'].includes(b.system)||!['exact','nearest'].includes(b.policy))throw Error('Hazırlık bilgileri geçersiz.');
 const k=b.wall.outerCm,half=k/2,near=b.system==='prefabrik'&&b.policy==='nearest',requested=b.outerSizeCm;
 const size=v=>near?Math.max(125.5,Math.round((v-k)/62.75)*62.75)+k:v,W=size(requested.width),D=size(requested.depth);
 const changes=[];if(W!==requested.width||D!==requested.depth)changes.push(`Dış ölçü: ${requested.width} × ${requested.depth} → ${round(W)} × ${round(D)} cm`);
 const map=(v,limit,out)=>{if(!Number.isFinite(v)||v<0||v>limit)throw Error('Duvar koordinatları dış ölçülerin içinde olmalı.');const q=Math.max(half,Math.min(out-half,v*out/limit));return round(near?Math.max(half,Math.min(out-half,half+Math.round((q-half)/62.75)*62.75)):q);};
 let boundary=null;
 if(outline){if(outline.some(p=>p.x<0||p.y<0||p.x>requested.width||p.y>requested.depth)||Math.abs(Math.max(...outline.map(p=>p.x))-requested.width)>.01||Math.abs(Math.max(...outline.map(p=>p.y))-requested.depth)>.01)throw Error('Dış kenarların toplam en/boyu başlangıç bilgileriyle uyuşmuyor.');boundary=insetOutline(outline,k);if(near){boundary=boundary.map(p=>({x:map(p.x,requested.width,W),y:map(p.y,requested.depth,D)}));insetOutline(boundary,.02);changes.push('Dış köşeler modül ızgarasına uyarlandı; önizleme ölçülerini kontrol edin.');}}
 const lines=boundary?boundary.map((p,i)=>{const q=boundary[(i+1)%boundary.length];return{x1:p.x,y1:p.y,x2:q.x,y2:q.y,k};}):[{x1:half,y1:half,x2:W-half,y2:half,k},{x1:W-half,y1:half,x2:W-half,y2:D-half,k},{x1:half,y1:D-half,x2:W-half,y2:D-half,k},{x1:half,y1:half,x2:half,y2:D-half,k}];
 input.forEach((l,i)=>{if(Math.abs(l.x1-l.x2)>EPS&&Math.abs(l.y1-l.y2)>EPS)throw Error((i+1)+'. duvar yatay veya dikey olmalı.');const n={x1:map(l.x1,requested.width,W),y1:map(l.y1,requested.depth,D),x2:map(l.x2,requested.width,W),y2:map(l.y2,requested.depth,D),k:b.wall.innerCm};if(Math.hypot(n.x2-n.x1,n.y2-n.y1)<1)throw Error((i+1)+'. duvar sıfıra kısaldı; düzeltin veya silin.');if(near&&['x1','x2','y1','y2'].some(key=>Math.abs(n[key]-l[key])>.1))changes.push(`${i+1}. iç duvar: (${round(l.x1)},${round(l.y1)})–(${round(l.x2)},${round(l.y2)}) → (${n.x1},${n.y1})–(${n.x2},${n.y2}) cm`);lines.push(n);});
 // All intersections and collinear endpoints become shared graph nodes.
 const nodes=[],segs=[],keys=new Map(),edges=new Set();function node(x,y){const key=round(x)+','+round(y);if(!keys.has(key)){const id='image-n'+(nodes.length+1);keys.set(key,id);nodes.push({id,x:round(x),y:round(y)});}return keys.get(key);}
 for(const l of lines){const vertical=Math.abs(l.x1-l.x2)<EPS,lo=Math.min(vertical?l.y1:l.x1,vertical?l.y2:l.x2),hi=Math.max(vertical?l.y1:l.x1,vertical?l.y2:l.x2),fixed=vertical?l.x1:l.y1,cuts=[lo,hi];for(const q of lines){const qv=Math.abs(q.x1-q.x2)<EPS;if(qv===vertical){if(Math.abs((qv?q.x1:q.y1)-fixed)<EPS)cuts.push(qv?q.y1:q.x1,qv?q.y2:q.x2);}else{const cross=vertical?q.y1:q.x1,ql=Math.min(vertical?q.x1:q.y1,vertical?q.x2:q.y2),qh=Math.max(vertical?q.x1:q.y1,vertical?q.x2:q.y2);if(fixed>=ql-EPS&&fixed<=qh+EPS)cuts.push(cross);}}
 const sorted=[...new Set(cuts.filter(v=>v>=lo-EPS&&v<=hi+EPS).map(round))].sort((a,b)=>a-b);for(let i=1;i<sorted.length;i++){const a=sorted[i-1],z=sorted[i];if(z-a<EPS)continue;const n1=node(vertical?fixed:a,vertical?a:fixed),n2=node(vertical?fixed:z,vertical?z:fixed),key=[n1,n2].sort().join('|');if(!edges.has(key)){edges.add(key);segs.push({id:'image-s'+(segs.length+1),n1,n2,k:l.k,kSabit:true});}}}
 if(boundary){const inside=p=>{let yes=false;for(let i=0,j=boundary.length-1;i<boundary.length;j=i++){const a=boundary[j],z=boundary[i];if(p.x>=Math.min(a.x,z.x)-EPS&&p.x<=Math.max(a.x,z.x)+EPS&&p.y>=Math.min(a.y,z.y)-EPS&&p.y<=Math.max(a.y,z.y)+EPS)return true;if((a.y>p.y)!==(z.y>p.y)&&p.x<(z.x-a.x)*(p.y-a.y)/(z.y-a.y)+a.x)yes=!yes;}return yes;};for(const s of segs){const a=nodes.find(n=>n.id===s.n1),z=nodes.find(n=>n.id===s.n2);if(!inside({x:(a.x+z.x)/2,y:(a.y+z.y)/2}))throw Error('Bir iç duvar dış sınırın dışında kalıyor. Girintideki çizgiyi düzeltin.');}}
 const warnings=['Kapı, pencere ve oda yazıları okunmadı; çizimde elle tamamlayın.','Çatı yönü ve eğimi ayarlandı; çatı geometrisi henüz çizilmedi.'];if(b.system==='prefabrik')warnings.push('Özel kesimler ve makas/H mesnet uyumu Plan kontrolünden doğrulanmalı; bu taslak imalat onayı değildir.');const degree=id=>segs.filter(s=>s.n1===id||s.n2===id).length;const dangling=nodes.filter(n=>degree(n.id)===1);if(dangling.length)warnings.push(dangling.length+' iç duvar ucu açık; açıklık veya eksik bağlantı olup olmadığını kontrol edin.');
 return {width:W,depth:D,changes,warnings,project:{v:'5',projectName:'Görselden plan taslağı',sistem:b.system,catiYon:b.roof.trussAxis==='x'?'yatay':'dikey',opt:{...defaults,h:b.wall.heightCm,dis:k,ic:b.wall.innerCm,cati:b.roof.type,egim:b.roof.pitchPercent},ky:b.wall.heightCm,dy:b.wall.heightCm,fire:10,n:nodes,s:segs,e:[],r:[],roofs:[],settings:{panelDrawMode:near?'mixed':'exception',panelSync:true,moduleAxisSnap:true,defaultK:k}}};
}
const api={detect,build,create,outlineFromSteps,insetOutline};if(typeof module==='object'&&module.exports)module.exports=api;else root.ImagePlanOffline=api;
})(globalThis);
