const assert=require('node:assert/strict'),fs=require('fs'),path=require('path'),{chromium}=require(path.resolve(path.dirname(process.execPath),'../node_modules/playwright'));
(async()=>{const b=await chromium.launch({headless:true,executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'});try{
 const p=await b.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.message));await p.goto(require('url').pathToFileURL(path.resolve('dist/plan_studio.html')).href);
 await p.evaluate(d=>Studio.loadProject(d),JSON.parse(fs.readFileSync('cizimler/gulsum-84m2/veranda-kirisli-ornek-5.9.98.json')));
 const result=await p.evaluate(()=>{
 G.rooms.find(r=>r.tip!=='veranda').tip='banyo';const states=[];for(const wall of ['yok','hepsi'])for(const ceiling of ['standard','board']){optUygula('alciDuvar',wall);optUygula('ceilingMode',ceiling);const a=alcipanHesap(),c=CeilingPanels.build();states.push({wall,ceiling,a,miniH:c.miniH,green:c.surfaces.filter(s=>s.gypsum==='green').length,rows:metrajKalemleri(),hint:TitleBlock.specifications().ceiling});}
 optUygula('h',250);const low=alcipanHesap();optUygula('h',300);const high=alcipanHesap();const saved=Studio.state();Studio.loadProject(saved);return {states,low,high,mode:G.opt.ceilingMode,stock:ALCI.LEVHA_M2};
 });
 for(const s of result.states){assert.ok(s.a.yesilDuvar>0);assert.ok(s.a.verTavan>0);assert.ok(s.green>0);assert.equal(s.miniH>0,s.ceiling==='standard');assert.equal(s.rows.some(r=>r.kalem.includes('Mini H')),s.ceiling==='standard');assert.equal(s.a.beyazDuvar>0,s.wall==='hepsi');assert.ok(s.hint.includes(s.ceiling==='standard'?'60×120':'120×250'));}
 for(const key of ['beyazTavan','yesilTavan','verTavan'])for(const s of result.states)assert.equal(s.a[key],result.states[0].a[key]);
 assert.ok(result.high.beyazDuvar>result.low.beyazDuvar);assert.ok(result.high.yesilDuvar>result.low.yesilDuvar);assert.equal(result.stock,3);assert.equal(result.mode,'board');assert.deepEqual(errors,[]);
 await p.evaluate(()=>{RoofStudio.open();RoofStudio.setView('ceiling');RoofStudio.fit();});await p.screenshot({path:'artifacts/gypsum-board-mode.png'});
 console.log('PASS independent wall/ceiling choices; wet walls and veranda green in every mode; unchanged ceiling area; mini H only standard; height and JSON persistence');
}finally{await b.close()}})().catch(e=>{console.error(e);process.exitCode=1});
