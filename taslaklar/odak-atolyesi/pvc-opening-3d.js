/* Parametric visual joinery, not a manufacturer profile or production recipe. */
(function(){
 function append({o,r,surfaces,parts,warnings}){const e=o.e,cat=window.OpeningCatalog.find(c=>c.id===e.catalogId),style=cat?.style||e.kapiTip;
  const sliding=(e.tip_==='pencere'&&e.penTip==='surme'&&e.yuk>60)||(e.tip_==='kapi'&&(e.kapiTip==='surme'||style==='sliding'));
  if(sliding&&window.EgepenSliding3D&&EgepenSliding3D.append({o,r,surfaces,parts,warnings}))return true;
  const pvc=['pvc-full','pvc-half'].includes(style);if(!sliding&&!pvc)return false;
  const color=window.ProjectSpecs?.windowHex()||'#ffffff',meta={kind:'opening',partId:'opening:'+e.id,openingId:e.id,schematic:true,system:sliding?'pvc-sliding':style};
  function box(x0,x1,y0,y1,z0,z1,material='pvc'){if(x1<=x0||z1<=z0)return;const p=[[x0,y0],[x1,y0],[x1,y1],[x0,y1]].map(([x,y])=>({x:r.ax+r.ux*x-r.uy*y,y:r.ay+r.uy*x+r.ux*y})),lo=p.map(v=>({...v,z:z0})),hi=p.map(v=>({...v,z:z1}));const m={...meta,material,color:material==='glass'?'#728083':material==='hardware'?'#56616b':color,alpha:material==='glass'?.32:1};surfaces.push({...m,poly:lo.slice().reverse()},{...m,poly:hi});for(let i=0;i<4;i++){const j=(i+1)%4;surfaces.push({...m,poly:[lo[i],lo[j],hi[j],hi[i]]});}}
  function frame(a,b,lo,hi,y,depth,f){box(a,a+f,y,y+depth,lo,hi);box(b-f,b,y,y+depth,lo,hi);box(a+f,b-f,y,y+depth,lo,lo+f);box(a+f,b-f,y,y+depth,hi-f,hi);}
  const f=Math.min(6,e.en/8,e.yuk/8),a=o.a+f,b=o.b-f,lo=o.z+f,hi=o.top-f;
  frame(o.a,o.b,o.z,o.top,-5,10,f);
  if(sliding){const mid=(a+b)/2;for(let i=0;i<2;i++){const left=i?mid-2:a,right=i?b:mid+2,y=i?0:-4;frame(left,right,lo,hi,y,3.5,4);box(left+4,right-4,y+1.5,y+1.9,lo+4,hi-4,'glass');const hx=i?right-6:left+5;box(hx,hx+1,y-1,y,(lo+hi)/2-4,(lo+hi)/2+4,'hardware');}for(const y of [-3,1])box(a,b,y,y+.5,o.z+f-.6,o.z+f+.4,'hardware');}
  else{frame(a,b,lo,hi,-2,4,5);const split=style==='pvc-half'?lo+(hi-lo)*.48:lo+5;if(style==='pvc-half'){box(a+5,b-5,-1,1,lo+5,split);box(a+5,b-5,-2,2,split,split+5);}box(a+5,b-5,-.3,.3,style==='pvc-half'?split+5:lo+5,hi-5,'glass');const hx=e.hand==='sag'?a+7:b-8;box(hx,hx+1,-3.5,3.5,o.z+94,o.z+102,'hardware');}
  parts.push({...meta,widthMm:e.en*10,heightMm:e.yuk*10,tracks:sliding?2:1});return true;
 }
 // Use the supplied joinery mesh for missing nominal sizes. Keep section and
 // centre-joint widths; resize only clear spans and surrounding panel lengths.
 const cache=new Map();
 function resolve(e){
  const models=window.WindowSTLModels||[],key=Number(e.en)+'x'+Number(e.yuk),exact=models.find(m=>m.key===key);if(exact)return exact;
  if(e.tip_!=='pencere'||e.penTip==='surme'||e.en<100||e.en>180||e.yuk<80||e.yuk>190)return null;
  if(cache.has(key))return cache.get(key);
  const candidates=models.filter(m=>/^(120|160)x(120|180)$/.test(m.key));
  candidates.sort((a,b)=>{const score=m=>{const [w,h]=m.key.split('x').map(Number);return Math.abs(w-e.en)*4+Math.abs(h-e.yuk);};return score(a)-score(b);});
  const source=candidates[0];if(!source)return null;const [w,h]=source.key.split('x').map(Number),W=Number(e.en),H=Number(e.yuk),width=source.width+W-w;
  const map=(v,from,to)=>{let i=1;while(i<from.length-1&&v>from[i])i++;return to[i-1]+(v-from[i-1])/(from[i]-from[i-1])*(to[i]-to[i-1]);};
  const xs=[-source.width/2,-w/2,-w/2+12,-12,12,w/2-12,w/2,source.width/2],xt=[-width/2,-W/2,-W/2+12,-12,12,W/2-12,W/2,width/2];
  const zs=[0,210-h,222-h,198,210,250],zt=[0,210-H,222-H,198,210,250];
  const vertices=source.vertices.map((v,i)=>i%3===0?source.centerX+map(v-source.centerX,xs,xt):i%3===2?map(v,zs,zt):v);
  const result={...source,key,width,vertices,adaptedFrom:source.key};cache.set(key,result);return result;
 }
 window.PvcOpening3D={append,resolve};
})();
