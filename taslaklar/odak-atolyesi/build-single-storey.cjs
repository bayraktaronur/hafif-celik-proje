// Reproducible, isolated copy of the existing drawing engine. Never writes to src/dist.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'../..'),hash=s=>crypto.createHash('sha256').update(s).digest('hex');
let html=fs.readFileSync(path.join(root,'plan_cizim.html'),'utf8');
const sources={'plan_cizim.html':hash(html)},css=[],js=[];
html=html.replace(/<link rel="stylesheet" href="(src\/[^"<>]+)">/g,(_,file)=>{const s=fs.readFileSync(path.join(root,file),'utf8');sources[file]=hash(s);css.push(s);return '';});
html=html.replace(/<script src="(src\/[^"<>]+)"><\/script>/g,(_,file)=>{let s=fs.readFileSync(path.join(root,file),'utf8');sources[file]=hash(s);
 // Namespace ALL persistence used by the copied sources, including opening defaults.
 s=s.replaceAll('prefabrikten.planstudio.','prefabrikten.odak.tek-kat.').replaceAll('plan-opening-last-','odak-tek-kat-opening-last-').replaceAll('plan-window-last','odak-tek-kat-window-last');
 js.push('// '+file+'\n'+s);return '';});
html=html.replace('<title>Plan Studio · Prefabrikten</title>','<title>Plan Studio · Tek katlı prefabrik taslağı</title>');
html=html.replace('</head>','<link rel="stylesheet" href="single-engine.css"><link rel="stylesheet" href="single-storey.css"></head>');
const source='cizimler/2026-10-02-tuna84-dwg-esleme-taslak.json',example=fs.readFileSync(path.join(root,source),'utf8');sources[source]=hash(example);
html=html.replace('</body>','<script src="single-engine.js"></script><script src="standard-ceiling.js"></script><script src="single-example.js"></script><script src="single-storey.js"></script><script src="single-ceiling.js"></script></body>');
fs.writeFileSync(path.join(__dirname,'single-engine.css'),css.join('\n'));
fs.writeFileSync(path.join(__dirname,'single-engine.js'),js.join('\n'));
fs.writeFileSync(path.join(__dirname,'single-example.js'),'const SINGLE_EXAMPLE = '+JSON.stringify(JSON.parse(example))+';\n');
fs.writeFileSync(path.join(__dirname,'index.html'),html.trimEnd()+'\n');
fs.writeFileSync(path.join(__dirname,'single-engine-manifest.json'),JSON.stringify({task:'DEV-153',engineRevision:'5.9.137',storage:'prefabrikten.odak.tek-kat.*; odak-tek-kat-opening-last-*',sources},null,2)+'\n');
console.log('Built independent single-storey draft; '+Object.keys(sources).length+' source hashes recorded.');
