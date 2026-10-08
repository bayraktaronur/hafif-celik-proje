/* Joint dimension-chain solver. All values are cm; no OCR or inferred units. */
(function(root){
const Offline=root.ImagePlanOffline||(typeof require==='function'?require('./image-plan-offline.js'):null);
const Q=62.75,round=v=>Math.round(v*100)/100;
function parse(text,factor){const parts=String(text).trim().split('+').map(x=>Number(x.trim().replace(',','.'))*factor);if(!parts.length||parts.length>12||parts.some(x=>!Number.isFinite(x)||x<=0))throw Error('Ölçü dağılımını pozitif sayılarla yazın: ör. 3+2+3.');return parts;}
function axis(total,parts,{modular=true,padding=10}={}){
 if(!Number.isFinite(total)||total<=padding||parts.some(p=>!Number.isFinite(p)||p<=0)||!parts.length||parts.length>12)throw Error('Ölçü zinciri geçersiz.');
 if(Math.abs(parts.reduce((a,b)=>a+b,0)-total)>.1)throw Error('Dağılım toplamı dış ölçüyle aynı olmalı. Net oda ölçülerini bu alana girmeyin.');
 if(!modular)return {total,parts:[...parts],bounds:[0,...parts.map((_,i)=>round(parts.slice(0,i+1).reduce((a,b)=>a+b,0)))],score:0};
 const candidates=[],base=Math.round((total-padding)/Q),m=parts.length;
 for(let N=Math.max(m,base-2);N<=Math.max(m,base+2);N++){
  let dp=new Map([[0,{score:0,counts:[]}]]);
  for(let i=0;i<m;i++){const next=new Map();for(const [sum,old] of dp)for(let n=1;n<=N-sum-(m-i-1);n++){const add=(i===0?padding/2:0)+(i===m-1?padding/2:0),actual=n*Q+add,cost=old.score+((actual-parts[i])/Q)**2;const prev=next.get(sum+n);if(!prev||cost<prev.score-1e-10)next.set(sum+n,{score:cost,counts:[...old.counts,n]});}dp=next;}
  const best=dp.get(N);if(!best)continue;const size=N*Q+padding,values=best.counts.map((n,i)=>round(n*Q+(i===0?padding/2:0)+(i===m-1?padding/2:0)));candidates.push({total:round(size),parts:values,bounds:[0,...values.map((_,i)=>round(values.slice(0,i+1).reduce((a,b)=>a+b,0)))],score:best.score+2*((size-total)/Q)**2,counts:best.counts});
 }
 return candidates.sort((a,b)=>a.score-b.score||Math.abs(a.total-total)-Math.abs(b.total-total))[0];
}
function groups(lines,key,fixedKey,limit){const out=[];for(const l of lines){if(Math.abs(l[key+'1']-l[key+'2'])>.01)continue;const v=l[key+'1'];if(v<limit*.03||v>limit*.97)continue;let g=out.find(g=>Math.abs(g.pos-v)<limit*.025);const len=Math.abs(l[fixedKey+'2']-l[fixedKey+'1']);if(g){g.pos=(g.pos*g.weight+v*len)/(g.weight+len);g.weight+=len;}else out.push({pos:v,weight:len});}return out.sort((a,b)=>a.pos-b.pos);}
function match(groups,parts,total){const wanted=parts.slice(0,-1).map((_,i)=>parts.slice(0,i+1).reduce((a,b)=>a+b,0));if(groups.length<wanted.length)throw Error('Ölçü dağılımına bağlanacak yeterli bölme duvarı bulunamadı. Otomatik bağlantı kurulmadı.');let states=[{last:-1,score:0,positions:[]}];const maxWeight=Math.max(1,...groups.map(g=>g.weight));for(const target of wanted){const next=[];for(let j=0;j<groups.length;j++){let best=null;for(const s of states){if(j<=s.last)continue;const g=groups[j],score=s.score+((g.pos-target)/total)**2+.04*(1-g.weight/maxWeight);if(!best||score<best.score)best={last:j,score,positions:[...s.positions,g.pos]};}if(best)next.push(best);}states=next;}return wanted.length?states.sort((a,b)=>a.score-b.score)[0].positions:[];}
function warp(v,from,to){let i=0;while(i<from.length-2&&v>from[i+1])i++;return to[i]+(v-from[i])/(from[i+1]-from[i])*(to[i+1]-to[i]);}
function solve(b,lines,xParts,yParts){
 const W=b.outerSizeCm.width,D=b.outerSizeCm.depth,k=b.wall.outerCm,modular=b.system==='prefabrik'&&b.policy==='nearest';
 const x=axis(W,xParts,{modular,padding:b.roof.trussAxis==='x'?k:2*k}),y=axis(D,yParts,{modular,padding:b.roof.trussAxis==='y'?k:2*k});
 const anchors={x:match(groups(lines,'x','y',W),xParts,W),y:match(groups(lines,'y','x',D),yParts,D)},source={x:[0,...anchors.x,W],y:[0,...anchors.y,D]};
 const target={x:x.bounds,y:y.bounds};const transformed=lines.map(l=>{const q={};for(const a of ['x','y'])for(const end of [1,2]){let v=warp(l[a+end],source[a],target[a]);if(modular){const pad=(a==='x'?b.roof.trussAxis==='x':b.roof.trussAxis==='y')?k/2:k;const max=(a==='x'?x.total:y.total);v=v<max*.02?0:v>max*.98?max:pad+Math.round((v-pad)/Q)*Q;}q[a+end]=round(v);}return q;}).filter(l=>Math.hypot(l.x2-l.x1,l.y2-l.y1)>.1);
 // Near-coincident endpoints from a hand sketch use the same coordinate.
 for(const a of ['x','y']){const vals=transformed.flatMap(l=>[l[a+'1'],l[a+'2']]).sort((a,b)=>a-b),clusters=[];for(const v of vals){const last=clusters.at(-1);if(last&&v-last[0]< (modular?.1:Math.min(W,D)*.015))last.push(v);else clusters.push([v]);}for(const l of transformed)for(const end of [1,2]){const c=clusters.find(c=>c.includes(l[a+end]));l[a+end]=round(c.reduce((a,b)=>a+b,0)/c.length);}}
 const exact={...b,policy:'exact',outerSizeCm:{width:x.total,depth:y.total}},draft=Offline.create(exact,transformed,{});draft.project.settings.panelDrawMode=modular?'mixed':'exception';
 return {...draft,chains:{x,y},anchors,changes:[`Dış ölçü: ${W} × ${D} → ${x.total} × ${y.total} cm`,`Soldan sağa: ${xParts.join(' + ')} → ${x.parts.join(' + ')} cm`,`Yukarıdan aşağı: ${yParts.join(' + ')} → ${y.parts.join(' + ')} cm`],warnings:[...draft.warnings,'Dağılımlar dış sınırı paylaşan bölgelerdir; net oda ölçüsü değildir. Duvar eşlemesini önizlemede doğrulayın.']};
}
const api={parse,axis,solve};if(typeof module==='object'&&module.exports)module.exports=api;else root.ImagePlanJoint=api;
})(globalThis);
