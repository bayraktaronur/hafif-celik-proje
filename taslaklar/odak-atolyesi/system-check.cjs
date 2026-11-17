const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const {chromium} = require(require.resolve('playwright',{paths:[path.dirname(process.execPath),path.resolve(__dirname,'../..')]}));
async function run() {
  const server = http.createServer((req,res)=>{
    const name = path.basename(new URL(req.url,'http://localhost').pathname);
    const file = path.join(__dirname,name);
    if (!fs.existsSync(file) || !fs.statSync(file).isFile()) {res.writeHead(404).end();return;}
    res.setHeader('Content-Type',({'.html':'text/html','.js':'application/javascript','.css':'text/css'})[path.extname(name)]||'application/octet-stream');
    fs.createReadStream(file).pipe(res);
  });
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  let browser;
  try {
    browser=await chromium.launch({executablePath:process.env.EDGE_PATH||'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'});
    const context=await browser.newContext({viewport:{width:1600,height:1000}});
    await context.addInitScript(()=>{window.showSaveFilePicker=undefined;});
    const results=[], errors=[];
    for(const [system,entry] of [['prefabrik','prefabrik'],['celik','hafif-celik']]){
      const p=await context.newPage();
      p.on('pageerror',err=>errors.push(err.message));
      p.on('dialog',d=>d.accept());
      await p.goto('http://127.0.0.1:'+server.address().port+'/'+entry+'.html');
      assert.equal(await p.evaluate(()=>G.sistem),system);
      if(system==='prefabrik'){
        assert.equal(await p.locator('#sistemSel').innerText(),'Prefabrik panel');
        assert.equal(await p.locator('select#sistemSel,#hcBtn').count(),0);
        await p.click('#commandSettingsTab');
        assert.equal(await p.locator('#faceDimensionSettings,#dimensionReference').count(),0);
        assert.doesNotMatch(await p.locator('body').innerText(),/hafif çelik/i);
      }else{
        assert.equal(await p.locator('#sistemSel').isDisabled(),true);
        assert.equal(await p.locator('#dimensionReference').count(),1);
      }
      const sample=await p.evaluate(()=>Studio.state());
      assert.ok(sample.s.length>=4);
      await p.click('#single-bill');
      if(system==='celik'){
        const lengths=await p.evaluate(()=>metrajKalemleri().filter(r=>r.grup==='Hafif çelik duvarlar'));
        assert.equal(lengths.reduce((sum,r)=>sum+r.adet,0),20);
        const downloading=p.waitForEvent('download');
        await p.click('#singleLoading');
        const csv=fs.readFileSync(await (await downloading).path(),'utf8');
        assert.equal(csv.trim().split('\r\n').length,5);
        assert.ok(csv.includes('"6000"')&&csv.includes('"4000"'));
      }else{
        assert.equal(await p.evaluate(()=>pfAnaliz().runs.flatMap(r=>r.slots).length),49);
        assert.ok(await p.evaluate(()=>metrajKalemleri().some(r=>r.kalem==='Tam panel'&&r.adet>0)));
        await p.click('#singleLoading');
        assert.ok(await p.locator('#loadTable tr').count()>1);
      }
      await p.reload();
      await p.click('.header-actions [onclick="yeniPlan()"]');
      assert.equal(await p.evaluate(()=>G.segs.length),0);
      assert.equal(await p.evaluate(()=>G.sistem),system);
      await p.evaluate(()=>{G.zoom=.6;G.pan={x:80,y:70};draw();});
      await p.click('#t-duvar');
      const point=async(x,y)=>p.evaluate(([x,y])=>{const v=toCv(x,y),r=cv.getBoundingClientRect();return [r.left+v.x,r.top+v.y];},[x,y]);
      await p.mouse.click(...await point(0,0));
      await p.mouse.move(...await point(400,0));
      await p.keyboard.type(system==='prefabrik'?'3':'375');
      await p.keyboard.press('Enter');
      await p.keyboard.press('Escape');
      assert.equal(await p.evaluate(()=>G.segs.length),1);
      await p.fill('#projectName',entry+' test');
      await p.locator('#projectName').press('Tab');
      const downloading=p.waitForEvent('download');
      await p.click('[onclick="planKaydet()"]');
      const json=fs.readFileSync(await (await downloading).path());
      const saved=JSON.parse(json);
      assert.equal(saved.sistem,system);assert.equal(saved.s.length,1);
      await p.locator('#fi').setInputFiles({name:'plan.json',mimeType:'application/json',buffer:json});
      await p.waitForFunction(()=>Studio.documents().documents.length===3);
      assert.deepEqual(await p.evaluate(()=>Studio.state().s),saved.s);
      results.push({p,json,entry});
      console.log('PASS',entry,'örnek, üretim, metraj, yeni proje, duvar çizimi, kaydet/aç');
    }
    for(const [i,{p,entry}] of results.entries()){
      await p.reload();
      assert.equal(await p.locator('#projectName').inputValue(),entry+' test');
      await p.locator('#fi').setInputFiles({name:'diger.json',mimeType:'application/json',buffer:results[1-i].json});
      await p.waitForFunction(()=>document.querySelector('#toast').textContent.includes('taslağında açın'));
      assert.equal(await p.evaluate(()=>Studio.documents().documents.length),3);
      assert.equal(await p.locator('#projectName').inputValue(),entry+' test');
    }
    assert.deepEqual(errors,[]);
    console.log('PASS aynı kökende ayrı yedek ve sekmeler, karşı sistem dosyasını koruma');
  } finally {await browser?.close();server.close();}
}
run().catch(e=>{console.error(e);process.exitCode=1;});
