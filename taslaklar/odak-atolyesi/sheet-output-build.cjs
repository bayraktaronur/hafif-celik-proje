module.exports=function(file,s,once){
 if(file==='src/studio.js'){
  s=once(s,'sheetInfo:clone(G.sheetInfo||{}),','sheetInfo:clone(G.sheetInfo||{}),...(G.sheetLayout?{sheetLayout:clone(G.sheetLayout)}:{}),');
  s=once(s,'G.sheetInfo=clone(d.sheetInfo||{});','G.sheetInfo=clone(d.sheetInfo||{});G.sheetLayout=clone(d.sheetLayout||null);');
 }
 if(file==='src/project.js')s=once(s,'safeTree(input);','safeTree(input);SheetOutput.validate(input.sheetLayout);');
 if(file==='src/title-block.js'){
  s=once(s,'function paint(c,l,info){','function paint(c,l,info){if(l.titleBlockMode===\'compact\')return SheetOutput.paintCompact(c,l,info,images);');
  s=once(s,'x=12,y=l.h-106,w=l.w-24','x=l.margin??12,y=l.h-(l.margin??12)-94,w=l.w-2*(l.margin??12)');
 }
 if(file==='src/plan-export.js'){
  const a=s.indexOf(' function layout('),b=s.indexOf(' function pageCanvas(',a);if(a<0||b<0)throw Error('Export layout anchor changed');
  s=s.slice(0,a)+` function layout(paper,orientation,scale,antet=false,info=G.sheetInfo||{},options={}){return SheetOutput.compute(record,paper,orientation,scale,antet,info,options);}\n`+s.slice(b);
  const c=s.indexOf(' function recommend('),d=s.indexOf(' function readFields(',c);if(c<0||d<0)throw Error('Export recommend anchor changed');
  s=s.slice(0,c)+` function recommend(paper,orientation='auto',scale='auto',antet=true,info={},options={}){return SheetOutput.recommend(record,paper,orientation,scale,antet,info,options);}\n`+s.slice(d);
  s=once(s,"function chosen(dir=$('exportOrientation').value){return recommend($('exportPaper').value,dir,$('exportScale').value,$('exportAntet').checked,readFields());}","let previewLayouts=new Map();function chosen(dir=$('exportOrientation').value){const v=SheetOutput.read(),key=JSON.stringify([v,dir,readFields()]);if(!previewLayouts.has(key))previewLayouts.set(key,recommend(v.paper,dir,v.scale==='custom'?v.customScale:v.scale,v.antet,readFields(),v));return previewLayouts.get(key);}");
  s=once(s,'async function refresh(){const id=++refreshId;','async function refresh(){previewLayouts.clear();const id=++refreshId;');
  s=once(s,"async function open(type){format=type;","async function open(type){format=type;dialog.dataset.format=type;SheetOutput.restore(G.sheetLayout);");
  s=once(s,'Otomatik öneri, sığan en büyük standart ölçeği seçer.','Sayfaya sığdır, çizimi ölçüleriyle birlikte kullanılabilir alana büyütür. Antette gerçek ölçek yazılır.');
  s=once(s,'const info=readFields();try{PlanProject.validate({...Studio.state(),sheetInfo:info});if(!Studio.edit(()=>{G.sheetInfo=info;}))','const info=readFields(),sheetLayout=SheetOutput.read();try{PlanProject.validate({...Studio.state(),sheetInfo:info,sheetLayout});if(!Studio.edit(()=>{G.sheetInfo=info;G.sheetLayout=sheetLayout;}))');
  s=once(s,'}saveInfo();}refreshId++;','}dirty=true;saveInfo();}refreshId++;');
  s=once(s,'window.pngIndir=()=>open(\'png\');',"SheetOutput.setup(dialog,()=>{dirty=true;refresh();});\n window.pngIndir=()=>open('png');");
 }
 return s;
};
