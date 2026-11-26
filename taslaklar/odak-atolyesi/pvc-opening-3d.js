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
 }window.PvcOpening3D={append};
})();
