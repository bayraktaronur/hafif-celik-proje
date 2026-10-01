const assert=require('node:assert/strict'),path=require('path');let pw;try{pw=require('playwright')}catch{pw=require(path.resolve(path.dirname(process.execPath),'../node_modules/playwright'))}
(async()=>{
 const b=await pw.chromium.launch({headless:true,executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'}),p=await b.newPage({viewport:{width:1600,height:1050}}),errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.goto(require('url').pathToFileURL(path.resolve('dist/plan_studio.html')).href);
 await p.evaluate(()=>Studio.loadProject({v:'5',n:[{id:'n1',x:0,y:0},{id:'n2',x:500,y:0},{id:'n3',x:500,y:400},{id:'n4',x:0,y:400}],s:[{id:'s1',n1:'n1',n2:'n2',k:10},{id:'s2',n1:'n2',n2:'n3',k:10},{id:'s3',n1:'n3',n2:'n4',k:10},{id:'s4',n1:'n4',n2:'n1',k:10}],e:[],r:[]}));
 const click=async(x,y)=>{const a=await p.evaluate(({x,y})=>{const r=cv.getBoundingClientRect(),a=toCv(x,y);return {x:r.left+a.x,y:r.top+a.y};},{x,y});await p.mouse.click(a.x,a.y);};
 const original=await p.evaluate(()=>({n:Studio.state().n,s:Studio.state().s}));
 await p.click('#t-kitchen');await p.click('#counterStart');await click(200,10);
 assert.equal(await p.locator('#counterDialog').isVisible(),true);
 await p.fill('#counterLength','400');await p.selectOption('#counterReturn','start');await p.fill('#counterReturnLength','220');
 await p.locator('#counterDialog button[type=submit]').click();
 let c=await p.evaluate(()=>G.counters[0]);assert.deepEqual(c.points,[{x:5,y:5},{x:405,y:5},{x:405,y:65},{x:65,y:65},{x:65,y:225},{x:5,y:225}]);
 await p.evaluate(()=>geriAl());assert.equal(await p.evaluate(()=>G.counters.length),0);await p.evaluate(()=>ileriAl());assert.equal(await p.evaluate(()=>G.counters.length),1);
 // Independent side selection works on all four walls and different thicknesses.
 const geometry=await p.evaluate(()=>{const out=[];for(const pt of [{x:200,y:10},{x:490,y:200},{x:200,y:390},{x:10,y:200}]){const w=Kitchen.pick(pt);out.push(Kitchen.make(w,0,100,'none',180));}G.segs[0].k=15;const thick=Kitchen.make(Kitchen.pick({x:200,y:10}),0,100,'none',180);G.segs[0].k=10;return {out,thick};});
 assert.equal(geometry.thick.points[0].y,7.5);for(const c of geometry.out)assert.equal(Math.hypot(c.points[2].x-c.points[1].x,c.points[2].y-c.points[1].y),60);
 const guards=await p.evaluate(()=>{const w=Kitchen.pick({x:200,y:10}),messages=[];for(const args of [[0,600,'none',180],[30,300,'start',180],[0,300,'start',450]])try{Kitchen.make(w,...args);}catch(e){messages.push(e.message);}G.elemanlar.push({id:'door',segId:'s1',tip_:'kapi',t:.5,en:80,yuk:205});try{Kitchen.make(w,0,400,'none',180);}catch(e){messages.push(e.message);}G.elemanlar=[];return messages;});assert.equal(guards.length,4);
 for(const [kind,x,y,w,d] of [['hob',170,40,60,50],['sink',300,25,46,46],['fridge',450,40,75,70]]){await p.click('#t-kitchen');await p.click(`[data-product="${kind}"]`);await p.locator('#fixtureDialog button[type=submit]').click();await click(x,y);const f=await p.evaluate(()=>G.fixtures.at(-1));assert.equal(f.kind,kind);assert.equal(f.w,w);assert.equal(f.d,d);if(kind!=='fridge')assert.equal(f.y,35);}
 // Vertical counter leg aligns the hob, without rotating the model or walls.
 const snap=await p.evaluate(()=>Kitchen.snapFixture({kind:'hob',w:60,d:50},{x:38,y:150}));assert.equal(snap.x,35);assert.equal(snap.angle,90);
 await p.evaluate(()=>{G.secili=null;G.seciliTip=null;draw();});
 const saved=await p.evaluate(()=>Studio.state());await p.evaluate(d=>Studio.loadProject(d),saved);assert.deepEqual(await p.evaluate(()=>G.counters),saved.counters);assert.deepEqual(await p.evaluate(()=>G.fixtures),saved.fixtures);assert.deepEqual(await p.evaluate(()=>({n:Studio.state().n,s:Studio.state().s})),original);
 const invalid=await p.evaluate(()=>{const d=Studio.state();d.counters[0].points[0].x='bad';try{Studio.loadProject(d);return false;}catch{return true;}});assert.equal(invalid,true);assert.deepEqual(await p.evaluate(()=>G.counters),saved.counters);
 await click(100,45);assert.equal(await p.evaluate(()=>G.seciliTip),'counter');await p.click('#counterDelete');assert.equal(await p.evaluate(()=>G.counters.length),0);assert.equal(await p.evaluate(()=>G.fixtures.length),3);await p.evaluate(()=>geriAl());
 const text=await p.evaluate(()=>{G.secili=null;G.seciliTip=null;const labels=[],old=ctx.fillText;ctx.fillText=function(t,...a){labels.push(t);return old.call(this,t,...a);};drawElemanlar();ctx.fillText=old;return labels;});assert.deepEqual(text,[]);
 await p.screenshot({path:'artifacts/kitchen-5.9.11.png'});
 const dl=p.waitForEvent('download');await p.evaluate(()=>pngIndir());await(await dl).saveAs('artifacts/kitchen-export-5.9.11.png');
 await p.click('#t-kitchen');await p.click('#counterStart');await p.keyboard.press('Escape');assert.equal(await p.evaluate(()=>G.tool),'sec');
 assert.deepEqual(errors,[]);console.log('PASS kitchen real placement, L/straight inner faces, four orientations, thickness, bounds/door guards, product snapping, undo, persistence, invalid import, selection, delete, PNG and cancellation');await b.close();
})().catch(e=>{console.error(e);process.exit(1)});
