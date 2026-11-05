const assert=require('node:assert/strict');
const path=require('node:path');
const {pathToFileURL}=require('node:url');
const {chromium}=require(path.resolve(path.dirname(process.execPath),'../node_modules/playwright'));

(async()=>{
 const browser=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'});
 try{
  const page=await browser.newPage();
  await page.goto(pathToFileURL(path.join(__dirname,'index.html')).href);
  const result=await page.evaluate(()=>{
   Studio.loadProject({...Studio.state(),sistem:'celik',n:[],s:[],e:[],r:[],dimensionReference:'outer'});
   G.tool='duvar';G.defaultK=14;G.snapGrid=false;G.snapWall=false;
   G.drawStart=addNode(0,0);G.drawing=true;G.snapPt=G.drawPreviewPt={x:500,y:0};
   const labels=[],text=ctx.fillText;
   ctx.fillText=function(label,...args){labels.push(label);return text.call(this,label,...args);};
   try{drawPreview();}finally{ctx.fillText=text;}
   const end=addNode(500,0);
   const id=addSeg(G.drawStart,end,14,null,true);
   const span=seg=>{const [lo,hi]=FaceDimensions.range(seg,G.nodes,G.segs,'outer');return hi-lo;};
   const final=span(getSeg(id));
   const gap=addNode(200,.5);
   addSeg(gap,addNode(200,150),14,null,true);
   const separated={y:getNode(gap).y,count:G.segs.length};
   const mid=addNode(400,0),tip=addNode(400,100);
   addSeg(mid,tip,14,null,true);
   const spans=G.segs.filter(s=>getNode(s.n1).y===0&&getNode(s.n2).y===0).map(span).sort((a,b)=>a-b);
   const hidden=FaceDimensions.wallFaceHit({x:407,y:0},G.nodes,G.segs,.1);
   const exposed=FaceDimensions.wallFaceHit({x:507,y:0},G.nodes,G.segs,.1);
   return {labels,final,separated,spans,hidden:hidden?.label||null,exposed:exposed?.label};
  });
  assert.deepEqual(result,{labels:['514 cm · dıştan dışa'],final:514,separated:{y:.5,count:2},spans:[107,407],hidden:null,exposed:'Duvar uç yüzü'});
  console.log('PASS: live preview and final dimension agree, 5 mm survives a new wall, T chain adds up and only exposed cap snaps.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
