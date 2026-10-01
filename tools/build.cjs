const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
let html=fs.readFileSync(path.join(root,'plan_cizim.html'),'utf8');
html=html.replace(/<link rel="stylesheet" href="(src\/[^"<>]+)">/g,(_,file)=>'<style>\n'+fs.readFileSync(path.join(root,file),'utf8')+'\n</style>');
html=html.replace(/<script src="(src\/[^"<>]+)"><\/script>/g,(_,file)=>'<script>\n'+fs.readFileSync(path.join(root,file),'utf8').replace(/<\/script/gi,'<\\/script')+'\n</script>');
fs.mkdirSync(path.join(root,'dist'),{recursive:true});
fs.writeFileSync(path.join(root,'dist/plan_studio.html'),html);
console.log('Standalone build: dist/plan_studio.html');
