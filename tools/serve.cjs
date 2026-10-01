const http=require('node:http');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.png':'image/png','.json':'application/json'};
const server=http.createServer((req,res)=>{
 try{
  const url=new URL(req.url,'http://127.0.0.1'),relative=decodeURIComponent(url.pathname==='/'?'/plan_cizim.html':url.pathname);
  const file=path.resolve(root,'.'+relative);
  if(!file.startsWith(root+path.sep)){res.writeHead(403);res.end();return;}
  if(!['.html','.js','.css','.png','.json'].includes(path.extname(file))){res.writeHead(404);res.end();return;}
  fs.readFile(file,(err,buffer)=>{if(err){res.writeHead(404);res.end('Bulunamadı');return;}res.writeHead(200,{'Content-Type':mime[path.extname(file)],'Cache-Control':'no-store'});res.end(buffer);});
 }catch{res.writeHead(400);res.end('Geçersiz istek');}
});
server.listen(Number(process.env.PORT)||4173,'127.0.0.1',()=>console.log('Plan Studio: http://127.0.0.1:'+server.address().port));
