const fs = require('node:fs/promises');
const path = require('node:path');
const os = require('node:os');
const { randomUUID } = require('node:crypto');
const readline = require('node:readline');
const ROOT = process.env.PREFABRIKTEN_MCP_DIR || path.join(process.env.LOCALAPPDATA || os.tmpdir(), 'Prefabrikten', 'SketchUpMCP');
const tools = [
  {name:'sessions', description:'List live SketchUp read-only bridge sessions. No model change.', inputSchema:{type:'object',properties:{},additionalProperties:false},annotations:{readOnlyHint:true}},
  {name:'read_entities',description:'Read a bounded page of root or nested instance entities, with actual edge endpoints and face loops in world millimetres. Copy pid/model_guid from sessions and instance path from a previous result. Repeat for nested groups; bounds alone do not establish section or fabrication length.',inputSchema:{type:'object',properties:{pid:{type:'integer'},model_guid:{type:'string'},path:{type:'array',items:{type:'integer'},maxItems:30},offset:{type:'integer',minimum:0},limit:{type:'integer',minimum:1,maximum:300}},required:['pid','model_guid'],additionalProperties:false},annotations:{readOnlyHint:true}}
];
async function sessions() {
  const dirs=await fs.readdir(ROOT).catch(e=>{if(e.code==='ENOENT')return [];throw e;});
  const out=[];
  for(const dir of dirs.filter(d=>/^\d+$/.test(d))) {
    try { const s=JSON.parse(await fs.readFile(path.join(ROOT,dir,'session.json'),'utf8')); if(Date.now()-Date.parse(s.updated_at)<10000) out.push(s); } catch {}
  }
  return out;
}
async function call(name,a={}) {
  if(name==='sessions') return {sessions:await sessions()};
  if(name!=='read_entities') throw Error('Unknown tool');
  if(!Number.isInteger(a.pid)||!(await sessions()).some(s=>s.pid===a.pid&&s.model_guid===a.model_guid)) throw Error('Live session/model not found; refresh sessions.');
  if(!Array.isArray(a.path||[])||(a.path||[]).length>30||!(a.path||[]).every(Number.isSafeInteger))throw Error('Invalid path');
  const offset=a.offset??0,limit=a.limit??100;
  if(!Number.isInteger(offset)||offset<0||!Number.isInteger(limit)||limit<1||limit>300)throw Error('Invalid page');
  const id=randomUUID(),dir=path.join(ROOT,String(a.pid));
  const req=path.join(dir,`request-${id}.json`),res=path.join(dir,`response-${id}.json`);
  await fs.writeFile(req+'.tmp',JSON.stringify({command:name,model_guid:a.model_guid,path:a.path||[],offset,limit}));
  await fs.rename(req+'.tmp',req);
  try {
    const until=Date.now()+15000;
    while(Date.now()<until) {
      try { const r=JSON.parse(await fs.readFile(res,'utf8')); if(r.error)throw Error(r.error);return r.result; }
      catch(e){if(e.code!=='ENOENT')throw e;}
      await new Promise(r=>setTimeout(r,100));
    }
    throw Error('SketchUp did not answer within 15 seconds. Close any modal dialog and retry this read.');
  } finally {await fs.rm(req,{force:true});await fs.rm(res,{force:true});}
}
async function handle(m) {
  if(m.id===undefined)return;
  const respond=r=>process.stdout.write(JSON.stringify({jsonrpc:'2.0',id:m.id,...r})+'\n');
  try {
    let result;
    if(m.method==='initialize')result={protocolVersion:m.params?.protocolVersion||'2024-11-05',capabilities:{tools:{}},serverInfo:{name:'prefabrikten-sketchup-inspect',version:'0.1.0'}};
    else if(m.method==='ping')result={};
    else if(m.method==='tools/list')result={tools};
    else if(m.method==='tools/call') {
      try {result={content:[{type:'text',text:JSON.stringify(await call(m.params.name,m.params.arguments))}]};}
      catch(e){result={isError:true,content:[{type:'text',text:e.message}]};}
    } else return respond({error:{code:-32601,message:'Method not found'}});
    respond({result});
  } catch(e){respond({error:{code:-32603,message:e.message}});}
}
if(require.main===module) {
  let queue=Promise.resolve();
  readline.createInterface({input:process.stdin}).on('line',line=>{queue=queue.then(async()=>{
    try{await handle(JSON.parse(line));}catch{process.stdout.write(JSON.stringify({jsonrpc:'2.0',id:null,error:{code:-32700,message:'Parse error'}})+'\n');}
  });});
}
module.exports={call,tools};
