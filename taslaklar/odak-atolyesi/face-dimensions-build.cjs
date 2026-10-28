module.exports=function(file,s,once){
 if(file==='src/studio.js'){
 s=once(s,'sheetInfo:clone(G.sheetInfo||{}),',"dimensionReference:G.dimensionReference||'outer',sheetInfo:clone(G.sheetInfo||{}),");
 s=once(s,'G.sheetInfo=clone(d.sheetInfo||{});',"G.dimensionReference=d.dimensionReference||'outer';G.sheetInfo=clone(d.sheetInfo||{});");
 }
 if(file==='src/project.js')s=once(s,'safeTree(input);',"safeTree(input);if(input.dimensionReference!=null&&!['outer','net','axis'].includes(input.dimensionReference))throw Error('Geçersiz ölçü referansı');");
 if(file==='src/engine.js'){
 s=once(s,'  drawSegs();','  PlanPresentation.wallLayer(ctx,drawSegs);');
 s=once(s,'var prevEnd=0;',"var prevEnd=isPref()?0:FaceDimensions.range(seg,G.nodes,G.segs,FaceDimensions.mode())[0];");
 s=once(s,'var nextStart=dLen;',"var nextStart=isPref()?dLen:FaceDimensions.range(seg,G.nodes,G.segs,FaceDimensions.mode())[1];");
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
