const fs=require('node:fs/promises');
const os=require('node:os');
const path=require('node:path');
const assert=require('node:assert/strict');
(async()=>{
  const root=await fs.mkdtemp(path.join(os.tmpdir(),'sketchup-mcp-test-'));
  process.env.PREFABRIKTEN_MCP_DIR=root;
  const {call,tools}=require('./server.cjs');
  const dir=path.join(root,'1234');await fs.mkdir(dir);
  const session={pid:1234,model_guid:'model-a',updated_at:new Date().toISOString()};
  await fs.writeFile(path.join(dir,'session.json'),JSON.stringify(session));
  assert.equal((await call('sessions')).sessions.length,1);
  assert(tools.filter(t=>!['create_panel','create_roof','opening_demo'].includes(t.name)).every(t=>t.annotations.readOnlyHint));
  assert.equal(tools.find(t=>t.name==='create_panel').annotations.readOnlyHint,false);
  const panel={request_id:'12345678-1234-1234-1234-123456789abc',width_mm:1500,height_mm:2500,spacing_mm:600,web_mm:90,thickness_mm:1.2,cladding:'gypsum',orientation:'vertical',bracing:'left',origin_mm:[3000,0,0]};
  await assert.rejects(call('create_panel',{pid:1234,model_guid:'model-a',panel}),/restart/);
  session.capabilities=['read_entities','create_panel'];
  await fs.writeFile(path.join(dir,'session.json'),JSON.stringify(session));
  await assert.rejects(call('create_panel',{pid:1234,model_guid:'model-a',panel:{...panel,origin_mm:[Infinity,0,0]}}),/origin/);
  await assert.rejects(call('create_panel',{pid:1234,model_guid:'model-a',panel:{...panel,code:'eval'}}),/parameters/);
  await assert.rejects(call('read_entities',{pid:1234,model_guid:'wrong'}),/not found/);
  await assert.rejects(call('read_entities',{pid:1234,model_guid:'model-a',limit:301}),/Invalid page/);
  await assert.rejects(call('read_entities',{pid:1234,model_guid:'model-a',path:['..']}),/Invalid path/);
  const bridge=(async()=>{
    for(let i=0;i<100;i++) {
      const files=(await fs.readdir(dir)).filter(f=>/^request-.*\.json$/.test(f));
      if(files.length){const name=files[0];const req=JSON.parse(await fs.readFile(path.join(dir,name),'utf8'));
        assert.equal(req.command,'read_entities');assert.deepEqual(req.path,[42]);
        await fs.writeFile(path.join(dir,name.replace('request-','response-')),JSON.stringify({result:{entities:[{pid:7,start_mm:[0,0,0],end_mm:[1500,0,0]}],complete:true}}));return;}
      await new Promise(r=>setTimeout(r,20));
    }
    throw Error('No bridge request');
  })();
  const result=await call('read_entities',{pid:1234,model_guid:'model-a',path:[42],limit:10});await bridge;
  assert.equal(result.entities[0].end_mm[0],1500);
  assert.deepEqual((await fs.readdir(dir)),['session.json']);
  const writer=(async()=>{
    for(let i=0;i<100;i++) {
      const names=(await fs.readdir(dir)).filter(f=>/^request-.*\.json$/.test(f));
      if(names.length){const name=names[0];const req=JSON.parse(await fs.readFile(path.join(dir,name),'utf8'));assert.equal(req.command,'create_panel');assert.deepEqual(req.panel,panel);await fs.unlink(path.join(dir,name));await fs.writeFile(path.join(dir,name.replace('request-','response-')),JSON.stringify({result:{status:'created',panel_pid:55}}));return;}
      await new Promise(r=>setTimeout(r,20));
    }
    throw Error('No create request');
  })();
  assert.equal((await call('create_panel',{pid:1234,model_guid:'model-a',panel})).panel_pid,55);await writer;
  assert.deepEqual(await fs.readdir(dir),['session.json']);
  await assert.rejects(call('opening_demo',{pid:1234,model_guid:'model-a',request_id:panel.request_id}),/unavailable/);
  session.capabilities.push('opening_demo');
  await fs.writeFile(path.join(dir,'session.json'),JSON.stringify(session));
  await assert.rejects(call('opening_demo',{pid:1234,model_guid:'model-a',request_id:'invalid'}),/invalid/);
  const demoWriter=(async()=>{
    for(let i=0;i<100;i++) {
      const names=(await fs.readdir(dir)).filter(f=>/^request-.*\.json$/.test(f));
      if(names.length){const name=names[0];const req=JSON.parse(await fs.readFile(path.join(dir,name),'utf8'));assert.equal(req.command,'opening_demo');assert.equal(req.request_id,panel.request_id);assert.equal(req.panel,undefined);await fs.unlink(path.join(dir,name));await fs.writeFile(path.join(dir,name.replace('request-','response-')),JSON.stringify({result:{status:'created',panel_pid:56}}));return;}
      await new Promise(r=>setTimeout(r,20));
    }
    throw Error('No opening demo request');
  })();
  assert.equal((await call('opening_demo',{pid:1234,model_guid:'model-a',request_id:panel.request_id})).panel_pid,56);await demoWriter;
  await fs.writeFile(path.join(dir,'session.json'),JSON.stringify({...session,updated_at:'2000-01-01T00:00:00Z'}));
  assert.equal((await call('sessions')).sessions.length,0);
  await fs.rm(root,{recursive:true});
  console.log('PASS: live/stale sessions, capability/version guards, panel validation, model guard, page/path limits, read/create transport and cleanup. Real SketchUp creation still needs live test.');
})().catch(e=>{console.error(e);process.exitCode=1;});
