const assert=require('node:assert/strict'),path=require('node:path'),fs=require('node:fs'),{pathToFileURL}=require('node:url');
let pw;try{pw=require('playwright');}catch{pw=require(path.resolve(path.dirname(process.execPath),'../node_modules/playwright'));}
(async()=>{
 const browser=await pw.chromium.launch({headless:true,executablePath:process.env.BROWSER_PATH||'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'});
 try{
  const page=await browser.newPage({viewport:{width:1536,height:960}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(pathToFileURL(path.resolve('plan_cizim.html')).href);
  await page.evaluate(()=>Studio.loadProject({v:'5',sistem:'prefabrik',projectName:'Görünüm testi',catiYon:'yatay',ky:280,dy:320,fire:10,opt:{...PlanProject.DEFAULT_OPTIONS},n:[{id:'e1',x:0,y:0},{id:'e2',x:1004,y:0},{id:'e3',x:1004,y:753},{id:'e4',x:0,y:753}],s:[{id:'e11',n1:'e1',n2:'e2',k:10},{id:'e12',n1:'e2',n2:'e3',k:10},{id:'e13',n1:'e3',n2:'e4',k:10},{id:'e14',n1:'e4',n2:'e1',k:10}],e:[],r:[]}));
  const model=()=>page.evaluate(()=>{const d=Studio.state();delete d.settings;return JSON.stringify({d,bill:metrajKalemleri(),snap:[G.snapGrid,G.snapWall]});});
  const before=await model();
  for(const preset of ['presentation','drawing','panels','trusses','full']){await page.locator('#quickViewPreset').selectOption(preset);assert.equal(await model(),before);assert.equal(await page.locator('#viewPreset').inputValue(),preset);}
  await page.locator('#viewPreset').selectOption('presentation');
  const rendered=await page.evaluate(()=>{const text=[],old=ctx.fillText;ctx.fillText=function(t,...args){text.push(String(t));return old.call(this,t,...args);};draw();ctx.fillText=old;return{text,hit:G._dimHits.length,view:ViewFilters.current()};});
  assert.equal(rendered.view.trusses,false);assert.equal(rendered.view.connections,false);assert.equal(rendered.view.grid,false);assert.ok(rendered.text.some(t=>t.includes('m²')));assert.ok(!rendered.text.some(t=>/^M\d+$/.test(t)));assert.ok(rendered.hit>0);
  await page.locator('#viewFilters summary').click();await page.locator('[data-view-filter="outerDims"]').uncheck();assert.equal(await page.evaluate(()=>G._dimHits.length),0);assert.equal(await model(),before);
  await page.evaluate(()=>geriAl());assert.equal(await page.evaluate(()=>ViewFilters.current().outerDims),true);await page.evaluate(()=>ileriAl());assert.equal(await page.evaluate(()=>ViewFilters.current().outerDims),false);
  const saved=await page.evaluate(()=>PlanProject.validate(Studio.state()));await page.evaluate(d=>Studio.loadProject(d),saved);assert.equal(await page.evaluate(()=>ViewFilters.current().outerDims),false);assert.equal(await model(),before);
  const legacy=structuredClone(saved);delete legacy.settings.viewFilters;legacy.settings.pnlEtiket=false;await page.evaluate(d=>Studio.loadProject(d),legacy);assert.equal(await page.evaluate(()=>ViewFilters.current().connections),false);assert.equal(await page.evaluate(()=>ViewFilters.current().outerDims),true);
  await page.locator('#quickViewPreset').selectOption('drawing');await page.screenshot({path:'artifacts/view-filters-5.9.6.png'});
  assert.deepEqual(errors,[]);console.log('PASS view presets and filters preserve geometry, bill, snapping; drawing, undo, JSON and legacy defaults verified');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
