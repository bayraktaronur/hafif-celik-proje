const assert=require('node:assert/strict'),path=require('node:path');
const {pathToFileURL}=require('node:url');
const {chromium}=require(path.resolve(path.dirname(process.execPath),'../node_modules/playwright'));
const example=require('../../cizimler/2026-10-02-tuna84-dwg-esleme-taslak.json');
(async()=>{
 const browser=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'});
 try{
  const page=await browser.newPage();
  example.annotations=[{id:'check-note',x:100,y:70,text:'GİRİŞ 123',size:12,angle:0}];
  await page.goto(pathToFileURL(path.join(__dirname,'index.html')).href);
  await page.evaluate(p=>{Studio.loadProject(p);Studio.fit();},example);
  await page.click('#command-tab-edit');
  const snapshot=()=>page.evaluate(()=>{const p=Studio.state();return {n:p.n,e:p.e,r:p.r.map(r=>r.ozelAd||r.ad).sort(),a:p.annotations[0]};});
  const before=await snapshot();
  for(const axis of ['x','y']){
   await page.click('#planMirror');
   await page.click('dialog[open] button[value="'+axis+'"]');
   const after=await snapshot(),coords=before.n.map(p=>p[axis]),sum=Math.min(...coords)+Math.max(...coords);
   assert.equal(after.a.text,before.a.text);assert.equal(after.a.angle,0);
   assert.equal(after.a[axis],sum-before.a[axis]);assert.deepEqual(after.r,before.r);
   assert.equal(after.e[0].yan,-before.e[0].yan);assert.equal(after.e[0].mentese,before.e[0].mentese);
   await page.keyboard.press('Control+z');assert.deepEqual(await snapshot(),before);
  }
  console.log('PASS: both mirror commands, wall coordinates, room names, text orientation, door swing and undo');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
