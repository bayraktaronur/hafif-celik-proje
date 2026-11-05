module.exports=function(file,s,once){
 if(file==='src/studio.js'){
 s=once(s,'window.numUzunluk=function(sn,dir,v){',`window.numUzunluk=function(sn,dir,v){
    if(!isPref()&&(G.tool==='duvar'||G.tool==='veranda')){
      const ref=FaceDimensions.mode(),L=FaceDimensions.inputLength(sn,dir,v,G.defaultK,G.nodes,G.segs,ref,G.tool);
      return {L,acik:L>0?fmtCm(v)+' cm · '+({outer:'dıştan dışa',net:'net',axis:'aks'}[ref]):'Ölçü uç paylarından büyük olmalı'};
    }`);
 s=once(s,'sheetInfo:clone(G.sheetInfo||{}),',"dimensionReference:G.dimensionReference||'outer',sheetInfo:clone(G.sheetInfo||{}),");
 s=once(s,'G.sheetInfo=clone(d.sheetInfo||{});',"G.dimensionReference=d.dimensionReference||'outer';G.sheetInfo=clone(d.sheetInfo||{});");
 }
 if(file==='src/project.js')s=once(s,'safeTree(input);',"safeTree(input);if(input.dimensionReference!=null&&!['outer','net','axis'].includes(input.dimensionReference))throw Error('Geçersiz ölçü referansı');");
 if(file==='src/engine.js'){
 s=once(s,'var endId=addNode(ex,ey);',"if(!(U.L>0))throw Error(U.acik);var endId=addNode(ex,ey,!isPref()&&G.tool==='duvar');");
 s=once(s,'var GRAPH_TOL=isPref()?.001:1;', 'var GRAPH_TOL=.001;');
 s=once(s,'if(d<GRAPH_TOL||L-d<GRAPH_TOL)return null;', 'var splitTolerance=isPref()?GRAPH_TOL:.001;if(d<splitTolerance||L-d<splitTolerance)return null;');
 s=once(s,"ctx.fillText(Math.round(len)+' cm'+(G.tool==='veranda'?' · veranda':'')",`var previewLabel=Math.round(len)+' cm';
  if(!isPref()){
    const ref=FaceDimensions.mode(),r=FaceDimensions.previewRange(sn,ep,G.defaultK,G.nodes,G.segs,ref,G.tool);
    previewLabel=fmtCm(r[1]-r[0])+' cm · '+({axis:'aks',outer:'dıştan dışa',net:'iç net'}[ref]);
  }
  ctx.fillText(previewLabel+(G.tool==='veranda'?' · veranda':'')`);
 s=once(s,'function addNode(x,y){','function addNode(x,y,exact){');
 s=once(s,'var EPS=isPref()?.001:', 'var EPS=(exact||isPref()||cizimAraci())?.001:');
 s=once(s,"if(G.snapGrid){rx=snapGrid(cm.x);ry=snapGrid(cm.y);sType='grid';}", "if(G.snapGrid){var gx=snapGrid(cm.x),gy=snapGrid(cm.y);if(isPref()||Math.hypot(cm.x-gx,cm.y-gy)*sc()<=12){rx=gx;ry=gy;sType='grid';}}");
 s=once(s,'var axBest=G.gridCm*0.6;', 'var axBest=isPref()?G.gridCm*0.6:8/sc();');
 s=once(s,'if(Math.abs(cm.x-n.x)<axBest', 'if(!isPref()&&Math.hypot(cm.x-n.x,cm.y-n.y)*sc()>140)return; if(Math.abs(cm.x-n.x)<axBest');
 s=once(s,'var EPS=G.gridCm*0.8;', 'var EPS=isPref()?G.gridCm*0.8:0.00001;');
 s=once(s,'var st=G.altKey?1:5;t=Math.round(t/st)*st;', 'var st=G.altKey?1:5;if(isPref())t=Math.round(t/st)*st;');
 s=once(s,'var cm=toCm(px,py);\n  var rx=', "var cm=toCm(px,py);G._faceHit=null; if(!isPref()&&G.snapWall&&cizimAraci()&&!G.shiftLock){const hit=FaceDimensions.wallFaceHit(cm,G.nodes,G.segs,9/sc());if(hit){G._faceHit=hit;G.snapType='duvar';G._snapLbl=hit.label;G.snapPt=hit.anchor;G.snapNodeId=hit.node;return hit.anchor;}}\n  var rx=");
 s=once(s,'function drawSnapInd(){\n  if(!G.snapPt)return;\n  var p=toCv(G.snapPt.x,G.snapPt.y);',"function drawSnapInd(){\n  if(!G.snapPt||(!isPref()&&G.tool==='sec'&&!G.dragging))return;\n  var target=G._faceHit||G.snapPt,p=toCv(target.x,target.y);");
 s=once(s,'var dl=Math.max(6,lw*1.2);', "if(!isPref()){const r=FaceDimensions.range(seg,G.nodes,G.segs,'net'),L=Math.hypot(n2.x-n1.x,n2.y-n1.y),ux=(n2.x-n1.x)/L,uy=(n2.y-n1.y)/L;p1=toCv(n1.x+ux*r[0],n1.y+uy*r[0]);p2=toCv(n1.x+ux*r[1],n1.y+uy*r[1]);}var dl=Math.max(6,lw*1.2);");
 s=once(s,'  drawSegs();','  PlanPresentation.wallLayer(ctx,drawSegs);');
 s=once(s,'var prevEnd=0;',"var prevEnd=isPref()?0:FaceDimensions.range(seg,G.nodes,G.segs,FaceDimensions.mode())[0];");
 s=once(s,'var nextStart=dLen;',"var nextStart=isPref()?dLen:FaceDimensions.range(seg,G.nodes,G.segs,FaceDimensions.mode())[1];");
 s=once(s,'if(isSel||connCount>2||(connCount===1&&cizimAraci()))','if(isSel||connCount>2||(connCount===1&&cizimAraci()&&(isPref()||G.snapNodeId===n.id&&!G._faceHit)))');
 const start=s.indexOf('function drawDims(){'),end=s.indexOf('function hitDim(',start);let block=s.slice(start,end);
 block=once(block,'var cur=0;',"var cur=FaceDimensions.range(seg,G.nodes,G.segs,FaceDimensions.mode())[0];");
 block=once(block,'if(L-cur>0.5)_dimLine(a.x,a.y,ux,uy,sx,sy,cur,L,off1,wallPx,fmtCm(L-cur),cc,false);',"var endFace=FaceDimensions.range(seg,G.nodes,G.segs,FaceDimensions.mode())[1];if(endFace-cur>0.5)_dimLine(a.x,a.y,ux,uy,sx,sy,cur,endFace,off1,wallPx,fmtCm(endFace-cur),cc,false);");
 block=once(block,'_dimLine(a.x,a.y,ux,uy,sx,sy,0,L,offT,wallPx,fmtCm(L),',"var face=FaceDimensions.range(seg,G.nodes,G.segs,FaceDimensions.mode());_dimLine(a.x,a.y,ux,uy,sx,sy,face[0],face[1],offT,wallPx,fmtCm(face[1]-face[0]),");
 block=block.replace(/\n}\s*$/, '\n  FaceDimensions.totals();\n}\n');s=s.slice(0,start)+block+s.slice(end);
 }
 if(file==='src/plan-export.js'){
 s=once(s,"ctx=target;TH=TH_PAPER;DIM=DIM_PAPER;","ctx=target;TH=window.PlanPresentation?PlanPresentation.theme(TH_PAPER):TH_PAPER;DIM=DIM_PAPER;");
 s=once(s,'target.setLayer?.(name);fn();',"target.setLayer?.(name);if(window.PlanPresentation?.active()&&name==='DUVAR'&&target.canvas){PlanPresentation.wallLayer(target,fn);}else fn();");
 s=once(s,"SheetOutput.setup(dialog,()=>{dirty=true;refresh();});","SheetOutput.setup(dialog,()=>{dirty=true;refresh();});PlanPresentation.setup(()=>{dirty=true;refresh();});");
 }
 if(file==='src/fixtures.js'){
 s=once(s,'const w=f.w,d=f.d;', 'const w=f.w,d=f.d;PlanPresentation.fixture(c,f,PlanPresentation.surface());');
 s=s.replaceAll('c.closePath();c.stroke();','c.closePath();c.fill();c.stroke();');
 s=once(s,'rect(0,0,w,back);', 'c.fillRect(0,0,w,back);rect(0,0,w,back);');
 }
 if(file==='src/kitchen.js')s=once(s,'ctx.save();ctx.strokeStyle=color;ctx.lineWidth=1.4;', 'ctx.save();PlanPresentation.counter(ctx,c.points,PlanPresentation.surface());ctx.strokeStyle=TH.presentation?TH.presentation.ink:color;ctx.lineWidth=1.4;');
 return s;
};
