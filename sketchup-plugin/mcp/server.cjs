const fs = require('node:fs/promises');
const path = require('node:path');
const os = require('node:os');
const { randomUUID } = require('node:crypto');
const readline = require('node:readline');
const ROOT = process.env.PREFABRIKTEN_MCP_DIR || path.join(process.env.LOCALAPPDATA || os.tmpdir(), 'Prefabrikten', 'SketchUpMCP');
const panelSchema={type:'object',properties:{request_id:{type:'string',pattern:'^[0-9a-f-]{36}$'},width_mm:{type:'number',exclusiveMinimum:0,maximum:20000},height_mm:{type:'number',exclusiveMinimum:0,maximum:20000},spacing_mm:{type:'number',exclusiveMinimum:0,maximum:20000},web_mm:{type:'number',enum:[60,80,90,100,120,140,150]},thickness_mm:{type:'number',enum:[0.8,1,1.2,1.5,1.8]},cladding:{type:'string',enum:['gypsum','osb','boardex','betopan']},orientation:{type:'string',enum:['vertical','horizontal']},bracing:{type:'string',enum:['none','left','edges','all']},top_record_offset_mm:{type:'number',minimum:0,exclusiveMaximum:20000},origin_mm:{type:'array',items:{type:'number',minimum:-1000000,maximum:1000000},minItems:3,maxItems:3}},required:['request_id','width_mm','height_mm','spacing_mm','web_mm','thickness_mm','cladding','orientation','bracing','origin_mm'],additionalProperties:false};
const tools = [
  {name:'create_roof',description:'Create separate illustrative 27/200 trapezoidal roof sheets with 1000 mm effective cover width on supplied convex roof polygons in world XY mm. Each patch supplies normalized upward plane [nx,ny,nz,d] (n dot point=d) and horizontal cross_axis 0=X or 1=Y. Preserves source model, one undo, no save. Optional replace_roof replaces only a matching generated roof group; requires bridge0.3.2. New roofs require bridge0.3.0. Retry only same UUID. Profile crest/valley illustrative; no thickness, overlap or flashings.',inputSchema:{type:'object',properties:{pid:{type:'integer'},model_guid:{type:'string'},roof:{type:'object',properties:{replace_roof:{type:'object',properties:{pid:{type:'integer',minimum:1},request_id:{type:'string',pattern:'^[0-9a-f-]{36}$'}},required:['pid','request_id'],additionalProperties:false},request_id:{type:'string',pattern:'^[0-9a-f-]{36}$'},patches:{type:'array',minItems:1,maxItems:20,items:{type:'object',properties:{plane:{type:'array',items:{type:'number'},minItems:4,maxItems:4},cross_axis:{type:'integer',enum:[0,1]},polygons:{type:'array',minItems:1,maxItems:500,items:{type:'array',minItems:3,maxItems:20,items:{type:'array',items:{type:'number'},minItems:2,maxItems:2}}}},required:['plane','cross_axis','polygons'],additionalProperties:false}}},required:['request_id','patches'],additionalProperties:false}},required:['pid','model_guid','roof'],additionalProperties:false},annotations:{readOnlyHint:false,destructiveHint:true,idempotentHint:true,openWorldHint:false}},
  {name:'create_panel',description:'Create a separate draft wall frame in the specified live SketchUp model. Requires bridge 0.2.0. Existing geometry is preserved; one undo operation. Never saves the model. Specify world origin in mm. Use one stable UUID request_id for retries; a timeout has UNKNOWN outcome, refresh sessions/read entities before retrying the SAME request_id. No structural or manufacturing approval.',inputSchema:{type:'object',properties:{pid:{type:'integer'},model_guid:{type:'string'},panel:panelSchema},required:['pid','model_guid','panel'],additionalProperties:false},annotations:{readOnlyHint:false,destructiveHint:false,idempotentHint:true,openWorldHint:false}},
  {name:'sessions', description:'List live SketchUp bridge sessions, model identities, versions and capabilities. No model change.', inputSchema:{type:'object',properties:{},additionalProperties:false},annotations:{readOnlyHint:true}},
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
  if(!['read_entities','create_panel','create_roof'].includes(name)) throw Error('Unknown tool');
  if(!Number.isInteger(a.pid)||!(await sessions()).some(s=>s.pid===a.pid&&s.model_guid===a.model_guid)) throw Error('Live session/model not found; refresh sessions.');
  if(name==='create_panel') {
    const session=(await sessions()).find(s=>s.pid===a.pid&&s.model_guid===a.model_guid);
    if(!session?.capabilities?.includes('create_panel'))throw Error('Bridge upgrade requires SketchUp restart; create_panel unavailable.');
    validatePanel(a.panel);
  }
  if(name==='create_roof') {
    const session=(await sessions()).find(s=>s.pid===a.pid&&s.model_guid===a.model_guid);
    if(!session?.capabilities?.includes('create_roof'))throw Error('Bridge upgrade requires SketchUp restart; create_roof unavailable.');
    if(a.roof?.replace_roof && session.bridge_version!=='0.3.2')throw Error('Replacement requires SketchUp restart with bridge0.3.2.');
    if(!a.roof||!Array.isArray(a.roof.patches)||a.roof.patches.length<1||a.roof.patches.length>20||!/^[0-9a-f-]{36}$/.test(a.roof.request_id)||JSON.stringify(a.roof).length>1000000)throw Error('Invalid roof payload');
  }
  if(!Array.isArray(a.path||[])||(a.path||[]).length>30||!(a.path||[]).every(Number.isSafeInteger))throw Error('Invalid path');
  const offset=a.offset??0,limit=a.limit??100;
  if(!Number.isInteger(offset)||offset<0||!Number.isInteger(limit)||limit<1||limit>300)throw Error('Invalid page');
  const id=randomUUID(),dir=path.join(ROOT,String(a.pid));
  const req=path.join(dir,`request-${id}.json`),res=path.join(dir,`response-${id}.json`);
  await fs.writeFile(req+'.tmp',JSON.stringify({command:name,model_guid:a.model_guid,...(name==='create_panel'?{panel:a.panel}:name==='create_roof'?{roof:a.roof}:{path:a.path||[],offset,limit})}));
  await fs.rename(req+'.tmp',req);
  try {
    const until=Date.now()+15000;
    while(Date.now()<until) {
      try { const r=JSON.parse(await fs.readFile(res,'utf8')); await fs.rm(res,{force:true}); if(r.error)throw Error(r.error);return r.result; }
      catch(e){if(e.code!=='ENOENT')throw e;}
      await new Promise(r=>setTimeout(r,100));
    }
    throw Error(name!=='read_entities'?'UNKNOWN create outcome: refresh sessions/read entities; retry only with the SAME request_id.':'SketchUp did not answer within 15 seconds. Close any modal dialog and retry this read.');
  } finally {if(name==='read_entities'){await fs.rm(req,{force:true});await fs.rm(res,{force:true});}}
}
function validatePanel(p) {
  if(!p||typeof p!=='object'||Array.isArray(p)||Object.keys(p).some(k=>!panelSchema.properties[k])||panelSchema.required.some(k=>!(k in p)))throw Error('Invalid panel parameters');
  if(!/^[0-9a-f-]{36}$/.test(p.request_id))throw Error('Invalid request_id');
  for(const k of ['width_mm','height_mm','spacing_mm','web_mm','thickness_mm'])if(typeof p[k]!=='number'||!Number.isFinite(p[k])||p[k]<=0||p[k]>20000)throw Error('Invalid '+k);
  for(const k of ['web_mm','thickness_mm','cladding','orientation','bracing'])if(!panelSchema.properties[k].enum.includes(p[k]))throw Error('Invalid '+k);
  if(p.top_record_offset_mm!==undefined&&(!Number.isFinite(p.top_record_offset_mm)||p.top_record_offset_mm<0||p.top_record_offset_mm>=20000))throw Error('Invalid top record');
  if(!Array.isArray(p.origin_mm)||p.origin_mm.length!==3||p.origin_mm.some(v=>typeof v!=='number'||!Number.isFinite(v)||Math.abs(v)>1000000))throw Error('Invalid origin');
}
async function handle(m) {
  if(m.id===undefined)return;
  const respond=r=>process.stdout.write(JSON.stringify({jsonrpc:'2.0',id:m.id,...r})+'\n');
  try {
    let result;
    if(m.method==='initialize')result={protocolVersion:m.params?.protocolVersion||'2024-11-05',capabilities:{tools:{}},serverInfo:{name:'prefabrikten-sketchup-inspect',version:'0.3.2'}};
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
