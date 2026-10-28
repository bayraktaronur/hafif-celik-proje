// Reproducible, isolated copy of the existing drawing engine. Never writes to src/dist.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
require('./build-steel-door.cjs');
require('./build-other-doors.cjs');
require('./build-drainage.cjs');
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
 s=require('./roof-feedback-build.cjs')(file,s,replaceOnce);
 s=require('./roof-level-build.cjs')(file,s,replaceOnce);
 s=require('./steel-door-build.cjs')(file,s,replaceOnce);
 s=require('./foundation-build.cjs')(file,s,replaceOnce);
 s=require('./scene-performance-build.cjs')(file,s.replaceAll('\r\n','\n'),replaceOnce);
 s=require('./sheet-output-build.cjs')(file,s,replaceOnce);
 s=require('./scene-output-build.cjs')(file,s,replaceOnce);
 s=require('./drainage-build.cjs')(file,s,replaceOnce);
 s=require('./presentation-build.cjs')(file,s,replaceOnce);
 s=require('./steel-wall-joins-build.cjs')(file,s,replaceOnce);
 s=require('./roof-workspace-build.cjs')(file,s,replaceOnce);
 s=require('./floor-hatch-build.cjs')(file,s,replaceOnce);
 s=require('./precise-lines-build.cjs')(file,s,replaceOnce);
 s=require('./counter-editor-build.cjs')(file,s,replaceOnce);
 js.push('// '+file+'\n'+s);return '';});
html=html.replace('<title>Plan Studio · Prefabrikten</title>','<title>Plan Studio · Tek katlı prefabrik taslağı</title>');
html=html.replace('</head>','<link rel="stylesheet" href="single-engine.css"><link rel="stylesheet" href="single-storey.css"><link rel="stylesheet" href="single-reference.css"><link rel="stylesheet" href="single-wall-move.css"><link rel="stylesheet" href="single-command-ui.css"><link rel="stylesheet" href="single-roof-feedback.css"><link rel="stylesheet" href="single-roof-level.css"></head>');
const source='cizimler/2026-10-02-tuna84-dwg-esleme-taslak.json',example=fs.readFileSync(path.join(root,source),'utf8');sources[source]=hash(example);
html=html.replace('</body>','<script src="drainage-model.js"></script><script src="drainage-core.js"></script><script src="scene-output.js"></script><script src="sheet-output.js"></script><script src="single-reference-core.js"></script><script src="roof-level-math.js"></script><script src="roof-role-swap.js"></script><script src="steel-door-models.js"></script><script src="other-door-models.js"></script><script src="steel-door-3d.js"></script><script src="single-engine.js"></script><script src="standard-ceiling.js"></script><script src="single-example.js"></script><script src="single-storey.js"></script><script src="single-ceiling.js"></script><script src="single-reference.js"></script><script src="single-selection.js"></script><script src="single-wall-move.js"></script><script src="single-command-ui.js"></script><script src="single-roof-feedback.js"></script><script src="single-roof-level.js"></script></body>');
html=html.replace('</head>','<link rel="stylesheet" href="drainage.css"><link rel="stylesheet" href="scene-output.css"><link rel="stylesheet" href="sheet-output.css"><link rel="stylesheet" href="single-foundation.css"></head>').replace('<script src="single-engine.js">','<script src="foundation-solid.js"></script><script src="foundation-core.js"></script><script src="single-engine.js">').replace('</body>','<script src="foundation-reference.js"></script><script src="foundation-entrances.js"></script><script src="single-foundation.js"></script><script src="drainage-ui.js"></script></body>');
html=html.replace('</head>','<link rel="stylesheet" href="presentation.css"></head>').replace('<script src="single-engine.js">','<script src="presentation-3d.js"></script><script src="single-engine.js">').replace('</body>','<script src="presentation-ui.js"></script></body>');
html=html.replace('</head>','<link rel="stylesheet" href="roof-workspace.css"></head>').replace('<script src="single-engine.js">','<script src="camera-views.js"></script><script src="single-engine.js">').replace('</body>','<script src="roof-workspace.js"></script></body>');
html=html.replace('</head>','<link rel="stylesheet" href="floor-hatch.css"></head>').replace('<script src="single-engine.js">','<script src="floor-hatch.js"></script><script src="single-engine.js">').replace('</body>','<script src="floor-hatch-ui.js"></script><script src="line-assist.js"></script><script src="counter-editor.js"></script></body>');
html=html.replace('<script src="single-engine.js">','<script src="precise-lines.js"></script><script src="single-engine.js">');
fs.writeFileSync(path.join(__dirname,'single-engine.css'),css.join('\n'));
html=html.replace('<script src="single-engine.js">','<script src="steel-wall-joins.js"></script><script src="single-engine.js">');
fs.writeFileSync(path.join(__dirname,'single-engine.js'),js.join('\n'));
fs.writeFileSync(path.join(__dirname,'single-example.js'),'const SINGLE_EXAMPLE = '+JSON.stringify(JSON.parse(example))+';\n');
fs.writeFileSync(path.join(__dirname,'index.html'),html.trimEnd()+'\n');
fs.writeFileSync(path.join(__dirname,'single-engine-manifest.json'),JSON.stringify({task:'DEV-177',engineRevision:'5.9.137',storage:'prefabrikten.odak.tek-kat.*; odak-tek-kat-opening-last-*',prototypeExtensions:['contextual roof and 3D tasks; validated per-project camera bookmarks','light-steel mitred corners and exterior solid faces; persisted 0-100 presentation outlines with live GPU preview and 4K output','offline presentation renderer: exact shared geometry/camera, static GPU buffers, receiver-plane shadows, procedural materials and native 4K','supplied rainwater gutter/downpipe STL, eave-bound runs, editable outlets and shared bill/3D/PNG','native 4K 3D PNG with framing/preview and shared smoked-glass presentation','shared multi-door landings and concrete prism union: exposed geometry and unique quantities','PDF/PNG fit-to-page, physical margins, compact/full title block and persisted per-project layout','editable door-guided landing suggestions; cached full-detail 3D geometry and feature edges, coalesced camera frames','foundation snap: exposed panel/post perimeter, concave returns, corner priority and exact orthogonal face intersections','ground concrete: flexible outline, per-edge setbacks, attached landings/stairs, shared Z origin, persisted bill and history','referenceImages: project, history, recovery and native paste','corner post plan symbol: opaque fill and true model footprint','selection menu and exact wall move from displayed dimensions or offset','task command groups, contextual inspector, command search and collapsible project panels','child roof connection diagnostics and live draft settings; default geometry rules preserved','fixed-base ridge/pitch solver and persistent independent roof locks; preview and dependency validation','supplied steel-door STL: exact 250/280/300 cm variants, plan hinge and exterior orientation','supplied sheet/aluminium/PVC door assemblies: three panel heights, user-confirmed 205 cm aluminium/PVC adaptation with rigid hardware'],sources},null,2)+'\n');
console.log('Built independent single-storey draft; '+Object.keys(sources).length+' source hashes recorded.');
