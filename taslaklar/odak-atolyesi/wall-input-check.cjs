const assert=require('node:assert/strict'),path=require('node:path'),{pathToFileURL}=require('node:url');
const {chromium}=require(path.resolve(path.dirname(process.execPath),'../node_modules/playwright'));
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'});
 try{
 const p=await browser.newPage();await p.goto(pathToFileURL(path.join(__dirname,'index.html')).href);
 for(const ref of ['outer','axis','net']){
 const result=await p.evaluate(ref=>{
   Studio.loadProject({...Studio.state(),sistem:'celik',n:[],s:[],e:[],r:[],dimensionReference:ref});
   G.tool='duvar';G.defaultK=14;G.drawStart=addNode(0,0);G.drawing=true;G.drawPreviewPt={x:0,y:500};G.numBuf='500';numUygula();
   const seg=G.segs[0],r=FaceDimensions.range(seg,G.nodes,G.segs,ref);return [r[1]-r[0],Math.abs(getNode(seg.n2).y-getNode(seg.n1).y)];
 },ref);
 assert.deepEqual(result,[500,ref==='axis'?500:486]);
 }
 const snap=await p.evaluate(()=>{
   const seg=G.segs[0],a=getNode(seg.n1),b=getNode(seg.n2),sign=Math.sign(b.y-a.y);
   G.zoom=10;G.tool='veranda';G.snapWall=true;G.shiftLock=false;G.drawing=false;
   const pt=toCv(b.x,b.y+sign*seg.k/2),anchor=snapPoint(pt.x,pt.y);
   const marker=toCv(G._faceHit.x,G._faceHit.y);
   return [Math.hypot(marker.x-pt.x,marker.y-pt.y),anchor.y===b.y,G.snapNodeId===b.id];
 });
 assert.deepEqual(snap,[0,true,true]);
 console.log('PASS: 500 cm wall input, three references, real draft engine');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
