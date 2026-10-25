// Reproducible, isolated copy of the existing drawing engine. Never writes to src/dist.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'../..'),hash=s=>crypto.createHash('sha256').update(s).digest('hex');
function replaceOnce(source,from,to){if(source.split(from).length!==2)throw Error('Prototype extension anchor changed: '+from);return source.replace(from,to);}
let html=fs.readFileSync(path.join(root,'plan_cizim.html'),'utf8');
const sources={'plan_cizim.html':hash(html)},css=[],js=[];
html=html.replace(/<link rel="stylesheet" href="(src\/[^"<>]+)">/g,(_,file)=>{const s=fs.readFileSync(path.join(root,file),'utf8');sources[file]=hash(s);css.push(s);return '';});
html=html.replace(/<script src="(src\/[^"<>]+)"><\/script>/g,(_,file)=>{let s=fs.readFileSync(path.join(root,file),'utf8');sources[file]=hash(s);
 // Namespace ALL persistence used by the copied sources, including opening defaults.
 s=s.replaceAll('prefabrikten.planstudio.','prefabrikten.odak.tek-kat.').replaceAll('plan-opening-last-','odak-tek-kat-opening-last-').replaceAll('plan-window-last','odak-tek-kat-window-last');
 // Prototype-only reference layer: use the engine's own project/history lifecycle.
 if(file==='src/studio.js'){
  s=replaceOnce(s,"projectName,paint3D:","projectName,...(G.referenceImages?.length?{referenceImages:clone(G.referenceImages)}:{}),paint3D:");
  s=replaceOnce(s,"G.paint3D=clone(d.paint3D||{});","G.referenceImages=clone(d.referenceImages||[]);G.paint3D=clone(d.paint3D||{});");
  s=replaceOnce(s,"['s','e','r','roofs','annotations','fixtures','counters'].some", "['s','e','r','roofs','annotations','fixtures','counters','referenceImages'].some");
 }
 if(file==='src/project.js')s=replaceOnce(s,'safeTree(input);','safeTree(input);\n    ReferenceImageData.validate(input.referenceImages);');
 // Plan symbol only: keep the engine's post footprint and panel contact geometry.
 if(file==='src/engine.js'){
 const newline=s.includes('\r\n')?'\r\n':'\n';
 s=replaceOnce(s,
 `        // A hollow 1:2 post stays readable at low zoom; its long side is
        // perpendicular to the truss direction, including a local override.
        var rect=pfKoseRect(b.nid,parseFloat(b.k)||10),center=toCv(rect.x+rect.w/2,rect.y+rect.h/2);
        var scale=Math.max(s,8/Math.max(rect.w,rect.h)),pw=rect.w*scale,ph=rect.h*scale;
        ctx.fillStyle=TH.opening;ctx.strokeStyle=TH.wall;ctx.lineWidth=1.2;
        ctx.fillRect(center.x-pw/2,center.y-ph/2,pw,ph);
        ctx.strokeRect(center.x-pw/2,center.y-ph/2,pw,ph);`.replaceAll('\n',newline),
 `        // Opaque plan symbol; the hollow steel section remains in the 3D model.
        // Never enlarge the footprint over adjoining panels at low zoom.
        var rect=pfKoseRect(b.nid,parseFloat(b.k)||10),center=toCv(rect.x+rect.w/2,rect.y+rect.h/2);
        var pw=rect.w*s,ph=rect.h*s,lw=Math.min(1.2,pw/3,ph/3);
        ctx.fillStyle=TH.export?'#c4cfda':'#9eb2c4';ctx.strokeStyle=TH.export?'#687c8e':'#536b80';ctx.lineWidth=lw;
        // CAD recorder needs one exact contour, not fill plus inset outlines.
        if(typeof ctx.setLayer==='function')ctx.strokeRect(center.x-pw/2,center.y-ph/2,pw,ph);
        else{
          ctx.fillRect(center.x-pw/2,center.y-ph/2,pw,ph);
          ctx.strokeRect(center.x-pw/2+lw/2,center.y-ph/2+lw/2,pw-lw,ph-lw);
        }`.replaceAll('\n',newline));
 }
 if(file==='src/plan-clipboard-ui.js')s=replaceOnce(s,"['a','c','x','v'].includes(k)","['a','c','x','v'].includes(k)&&!(k==='v'&&window.ReferenceImages)");
 js.push('// '+file+'\n'+s);return '';});
html=html.replace('<title>Plan Studio · Prefabrikten</title>','<title>Plan Studio · Tek katlı prefabrik taslağı</title>');
html=html.replace('</head>','<link rel="stylesheet" href="single-engine.css"><link rel="stylesheet" href="single-storey.css"><link rel="stylesheet" href="single-reference.css"><link rel="stylesheet" href="single-wall-move.css"></head>');
const source='cizimler/2026-10-02-tuna84-dwg-esleme-taslak.json',example=fs.readFileSync(path.join(root,source),'utf8');sources[source]=hash(example);
html=html.replace('</body>','<script src="single-reference-core.js"></script><script src="single-engine.js"></script><script src="standard-ceiling.js"></script><script src="single-example.js"></script><script src="single-storey.js"></script><script src="single-ceiling.js"></script><script src="single-reference.js"></script><script src="single-selection.js"></script><script src="single-wall-move.js"></script></body>');
fs.writeFileSync(path.join(__dirname,'single-engine.css'),css.join('\n'));
fs.writeFileSync(path.join(__dirname,'single-engine.js'),js.join('\n'));
fs.writeFileSync(path.join(__dirname,'single-example.js'),'const SINGLE_EXAMPLE = '+JSON.stringify(JSON.parse(example))+';\n');
fs.writeFileSync(path.join(__dirname,'index.html'),html.trimEnd()+'\n');
fs.writeFileSync(path.join(__dirname,'single-engine-manifest.json'),JSON.stringify({task:'DEV-156',engineRevision:'5.9.137',storage:'prefabrikten.odak.tek-kat.*; odak-tek-kat-opening-last-*',prototypeExtensions:['referenceImages: project, history, recovery and native paste','corner post plan symbol: opaque fill and true model footprint','selection menu and exact wall move from displayed dimensions or offset'],sources},null,2)+'\n');
console.log('Built independent single-storey draft; '+Object.keys(sources).length+' source hashes recorded.');
