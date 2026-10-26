// Independent draft extension: explicit roof elevation and stepped U connections.
module.exports=function roofLevel(file,s,once){
 if(file==='src/roof.js'){
  s=once(s,'<small>${TYPES[z.type]} · +${number(z.h,1)} cm</small>','<small>${z.production?.role===\'child\'?\'Yavru\':\'Ana\'} · ${TYPES[z.type]} · Alt ${number(z.h,1)} cm</small>');
  s=once(s,'G.roofs=G.roofs.filter(r=>r.id!==old)','G.roofs=RoofRoleSwap.remove(G.roofs,old)');
  s=once(s,"...clone(z),id:id(),name:z.name+' kopya'","...(z.roleSwap||G.roofs.some(r=>r.roleSwap?.parentId===z.id)?RoofRoleSwap.detached(z):clone(z)),id:id(),name:z.name+' kopya'");
  s=once(s,"z.h=z.wallTop??(+G.opt.h||250);z.wallTop=z.h;", "z.wallTop=z.wallTop??(+G.opt.h||250);z.h=z.roofElevation??z.wallTop;if(z.levelControl&&!z.childJoin)RoofLevelMath.apply(z,C);");
  s=once(s,"if(!dialog.open)return;e.stopImmediatePropagation();", "if(!dialog.open||document.getElementById('roofLevelDialog')?.open)return;e.stopImmediatePropagation();");
  s=once(s,'<p>Saçak alt ucu duvar üst kotuna otomatik oturur.</p>','<p>Varsayılan kot duvar üstüdür. Özel yükseklik için Kot ve açı komutunu kullanın.</p>');
  s=once(s,'Saçak kapamasının alt ucu daima duvar üst kotundadır.','Saçak kapamasının alt kotu, özel kot verilmediyse duvar üstüdür.');
 }
 if(file==='src/roof-core.js'){
  s=once(s,"'. Yavru yüzey ana çatının üstünde kalıyor; yavru eğimini azaltın veya U açıklığını daraltın.'", "'. Aradaki '+cm(roof-parentPeak)+' fark birleşmeyi engelliyor. Alt kotu sabit tutarak yavru mahyasını alçaltın veya ana mahyayı yükseltin.'");
  s=once(s,'function connectChild(input,parent){','function connectChild(input,parent,options={}){');
  s=once(s,"const planes=zoneFaces(z),ys=", "if(z.levelControl)RoofLevelMath.apply(z,{zoneFaces,height});if(options.frameOnly)return z;\n    const planes=zoneFaces(z),ys=");
  s=once(s,"if(!here.length||Math.max(...here.map(f=>height(f,p)))>roof+.01)fail('mouth'", "if(here.length&&Math.max(...here.map(f=>height(f,p)))>roof+.01&&(z.roofElevation!==undefined||parent.roofElevation!==undefined)){roots.push(depth);continue;}\n      if(!here.length||Math.max(...here.map(f=>height(f,p)))>roof+.01)fail('mouth'");
  const end='    z.childJoin.support=ps.map(p=>({...p}));return z;';
  s=once(s,end,`    // An explicitly lowered roof may meet the host below its eave. Close that
    // vertical step, while the upper envelope still owns the visible roof area.
    if(z.roofElevation!==undefined||parent.roofElevation!==undefined){
      const cuts=[-z.eaves[2],width+z.eaves[3],width*z.ridge/100];
      host.forEach(f=>f.poly.forEach((p,i)=>{const a=untransform(z,p),b=untransform(z,f.poly[(i+1)%f.poly.length]);if(Math.abs(b.x-a.x)<EPS){if(Math.abs(a.x-depth)<.01)cuts.push(a.y,b.y);return;}const t=(depth-a.x)/(b.x-a.x);if(t>=0&&t<=1)cuts.push(a.y+t*(b.y-a.y));}));
      const sorted=[...new Set(cuts.filter(y=>y>=-z.eaves[2]&&y<=width+z.eaves[3]))].sort((a,b)=>a-b),panels=[];
      for(let i=1;i<sorted.length;i++){
        const lo=sorted[i-1],hi=sorted[i];if(hi-lo<EPS)continue;
        const mid=transform(z,{x:depth+.0001,y:(lo+hi)/2}),hf=host.filter(f=>contains(f.poly,mid)).sort((a,b)=>height(b,mid)-height(a,mid))[0];if(!hf)continue;
        const cf=planes.reduce((a,b)=>height(a,mid)<height(b,mid)?a:b),p=transform(z,{x:depth,y:lo}),q=transform(z,{x:depth,y:hi}),dp=height(hf,p)-height(cf,p),dq=height(hf,q)-height(cf,q);
        const ts=dp*dq<0?[0,dp/(dp-dq),1]:[0,1];
        for(let j=1;j<ts.length;j++){
          const u=ts[j-1],v=ts[j];if(dp+(dq-dp)*(u+v)/2<=.001)continue;
          const a={x:p.x+(q.x-p.x)*u,y:p.y+(q.y-p.y)*u},b={x:p.x+(q.x-p.x)*v,y:p.y+(q.y-p.y)*v};
          panels.push([{...a,z:height(cf,a)},{...b,z:height(cf,b)},{...b,z:height(hf,b)},{...a,z:height(hf,a)}]);
        }
      }
      if(panels.length)z.childJoin.cladding=panels;
    }
${end}`);
  s=once(s,"if(z.datum!==undefined", "if(z.roleSwap)RoofRoleSwap.validate(z);if(z.levelControl)RoofLevelMath.validate(z.levelControl);\n      if(z.roofElevation!==undefined&&!num(z.roofElevation,0,20000))fail('özel saçak alt kotu 0–20000 cm olmalı.');\n      if(z.datum!==undefined");
 }
 if(file==='src/roof-workflow.js'){
  s=once(s,"return !z.sourceRoomId&&!z.attachment&&z.production?.role!=='child';","return !z.sourceRoomId&&!z.attachment&&!z.roleSwap?.active&&z.production?.role!=='child';");
  s=once(s,'const resolved=new Map(),visiting=new Set();','G.roofs=RoofRoleSwap.prepare(G.roofs,C);\n  const resolved=new Map(),visiting=new Set();');
  s=once(s,"const parent=G.roofs.find(z=>z.id===options.parentId);", "const parent=options.previewParent||G.roofs.find(z=>z.id===options.parentId);");
  s=once(s,"type:options.type,pitch:options.pitch,h:options.h,eaves:","type:options.type,pitch:options.pitch,h:options.h,...(options.roofElevation!==undefined?{roofElevation:options.roofElevation}:{}),...(options.levelControl?{levelControl:options.levelControl}:{}),eaves:");
  s=once(s,'applyEaveRule(z);z=C.connectChild(z,parent);', 'applyEaveRule(z);z=C.connectChild(z,parent,{frameOnly:!!options.frameOnly});if(options.frameOnly)return z;');
  s=once(s,'window.RoofWorkflow={exteriorCorners,','window.RoofWorkflow={applyEaveRule,reanchor,exteriorCorners,');
 }
 return s;
};
