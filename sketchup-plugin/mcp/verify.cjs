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
  assert(tools.every(t=>t.annotations.readOnlyHint));
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
  await fs.writeFile(path.join(dir,'session.json'),JSON.stringify({...session,updated_at:'2000-01-01T00:00:00Z'}));
  assert.equal((await call('sessions')).sessions.length,0);
  await fs.rm(root,{recursive:true});
  console.log('PASS: live/stale sessions, read-only tools, model guard, page/path limits, request/response and cleanup. Ruby/SketchUp runtime not tested.');
})().catch(e=>{console.error(e);process.exitCode=1;});
