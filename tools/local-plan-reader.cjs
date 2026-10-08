/* Read-only local inference bridge. Never proxies model management or arbitrary hosts. */
const http=require('node:http');
const server=http.createServer(async(req,res)=>{
 const origin=req.headers.origin;if(origin&&origin!=='null'){res.writeHead(403);return res.end();}
 res.setHeader('Access-Control-Allow-Origin','null');res.setHeader('Vary','Origin');res.setHeader('Access-Control-Allow-Headers','Content-Type');res.setHeader('Access-Control-Allow-Methods','POST, OPTIONS');
 if(req.url!=='/api/chat'){res.writeHead(404);return res.end();}if(req.method==='OPTIONS'){res.writeHead(204);return res.end();}if(req.method!=='POST'){res.writeHead(405);return res.end();}
 const ac=new AbortController(),timer=setTimeout(()=>ac.abort(),600000);res.on('close',()=>ac.abort());
 try{const chunks=[];let size=0;for await(const chunk of req){size+=chunk.length;if(size>42*1024*1024)throw Error('Görsel çok büyük.');chunks.push(chunk);}const body=JSON.parse(Buffer.concat(chunks).toString());if(body.model!=='qwen3-vl:8b-instruct'||!Array.isArray(body.messages)||body.messages.length>3||body.messages.some(m=>!['system','user'].includes(m.role)||typeof m.content!=='string'||m.content.length>12000))throw Error('Geçersiz okuma isteği.');
 const response=await fetch('http://127.0.0.1:11436/api/chat',{method:'POST',signal:ac.signal,headers:{'Content-Type':'application/json'},body:JSON.stringify({model:'qwen3-vl:8b-instruct',messages:body.messages,format:body.format,stream:false,think:false,options:{temperature:0.3,repeat_penalty:1.1,num_ctx:8192,num_predict:4000},keep_alive:'10m'})});const data=await response.text();res.writeHead(response.status,{'Content-Type':'application/json'});res.end(data);
 }catch(e){if(!res.destroyed){res.writeHead(400,{'Content-Type':'application/json'});res.end(JSON.stringify({error:e.message}));}}finally{clearTimeout(timer);}
});server.listen(11435,'127.0.0.1',()=>console.log('Plan reader bridge: loopback 11435'));
