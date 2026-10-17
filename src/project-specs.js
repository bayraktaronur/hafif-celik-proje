/* Shared project specifications; rendering and quantities read the same options. */
(function(){
 const colors={beyaz:'#ffffff',antrasit:'#383e42',altinmese:'#b58a47'};
 function propagate(key){
  if(['kaplama','trapezEn'].includes(key))for(const z of G.roofs){z.material=G.opt.kaplama;z.width=z.material==='trapez'?(+G.opt.trapezEn||100):100;}
  if(key==='osb')for(const z of G.roofs){z.layers=(z.layers||[]).filter(l=>l.id!=='osb');if(G.opt.osb)z.layers.unshift({...RoofCore.LAYERS[0]});}
  if(key==='h')for(const z of G.roofs){z.wallTop=+G.opt.h;z.h=+G.opt.h;}
 }
 function fromRoofs(previous){const changed=G.roofs.find(z=>{const old=previous.find(p=>p.id===z.id);return old&&(old.material!==z.material||old.width!==z.width);});if(changed&&['trapez','sandvic'].includes(changed.material)){G.opt.kaplama=changed.material;G.opt.trapezEn=changed.width;propagate('kaplama');}}
 function covers(){
  if(!G.opt.hCover||!isPref())return [];
  const rooms=G.rooms.filter(r=>r.tip!=='veranda').map(r=>(r.nodeIds||[]).map(getNode)).filter(p=>p.length>=3&&p.every(Boolean));if(!rooms.length)return [];
  const inside=p=>rooms.some(poly=>ptInPolygon(p.x,p.y,poly)),out=[];
  for(const j of pfAnaliz().bag){if(!['H','H3','X'].includes(j.tip)||!j.run)continue;const r=j.run,a=j.pos,k=parseFloat(j.k)||10;
   const point=(x,y)=>({x:r.ax+r.ux*x-r.uy*y,y:r.ay+r.uy*x+r.ux*y});
   for(const side of [-1,1]){if(inside(point(a,side*(k/2+.5)))||!inside(point(a,-side*(k/2+.5))))continue;
    const d=side*k/2,e=d+side*2;out.push({id:'hCover:'+out.length,poly:[point(a-3,d),point(a+3,d),point(a+3,e),point(a-3,e)]});}
  }return out;
 }
 function billRows(){const n=covers().length,h=+G.opt.h||250,rows=[];if(n){rows.push({grup:'Proje özellikleri',kalem:'H kapak lata · betopan',olcu:'6 × 2 × '+h+' cm',birim:'adet',miktar:n},{grup:'Proje özellikleri',kalem:'H kapak lata alanı',olcu:'6 cm × bina yüksekliği × adet',birim:'m²',miktar:n*.06*h/100});}return rows;}

 function facade(items){
  if(G.opt.cephe==='yok'||!G.opt.cephe)return items;
  const rooms=G.rooms.filter(r=>r.tip!=='veranda').map(r=>(r.nodeIds||[]).map(getNode)).filter(p=>p.length>=3&&p.every(Boolean));
  const step=Math.max(1,(plakaOlcu()?.en||40)-(G.opt.cephe==='yalipan'?(+G.opt.bindirme||0):0));
  function clip(poly,z,up){const out=[];poly.forEach((p,i)=>{const q=poly[(i+1)%poly.length],a=up?p.z>=z:p.z<=z,b=up?q.z>=z:q.z<=z;if(a)out.push(p);if(a!==b){const t=(z-p.z)/(q.z-p.z);out.push({x:p.x+t*(q.x-p.x),y:p.y+t*(q.y-p.y),z});}});return out;}
  return items.flatMap(item=>{if(item.kind!=='wallPanel'&&item.material!=='panel')return [item];if(item.kind==='ceiling')return [item];const c=item.poly.reduce((a,p)=>({x:a.x+p.x/item.poly.length,y:a.y+p.y/item.poly.length}),{x:0,y:0});if(!rooms.length||rooms.some(r=>ptInPolygon(c.x,c.y,r)))return [item];const lo=Math.min(...item.poly.map(p=>p.z)),hi=Math.max(...item.poly.map(p=>p.z));if(hi-lo<.1)return [item];const out=[];for(let z=Math.floor(lo/step)*step;z<hi;z+=step){const poly=clip(clip(item.poly,z,true),z+step,false);if(poly.length>=3)out.push({...item,poly,facade:G.opt.cephe,shade:(item.shade||1)*(Math.round(z/step)%2?.97:1)});}return out;});
 }
 function render(){document.getElementById('katYuk').closest('.sr').style.display='none';const oldHeight=document.getElementById('panelHeightChoices');if(oldHeight)oldHeight.style.display='none';let box=document.getElementById('projectSpecs');if(!box){box=document.createElement('section');box.id='projectSpecs';box.className='sb';document.getElementById('projectSidebar').prepend(box);}const system=document.getElementById('sistemSel')?.closest('.system-card');if(system&&system.nextElementSibling!==box)box.before(system);const o=G.opt;
  const select=(key,label,opts)=>'<label style="display:grid;gap:5px;margin:10px 0">'+label+'<select class="si" style="width:100%" data-spec="'+key+'">'+opts.map(([v,n])=>'<option value="'+v+'" '+(String(o[key]??(key==='ceilingBoard'?true:key==='windowColor'?'beyaz':false))===String(v)?'selected':'')+'>'+n+'</option>').join('')+'</select></label>';
  const hadGroups=!!box.querySelector('details');
  const openGroups=[...box.querySelectorAll('details[open]')].map(d=>d.dataset.group);
  box.innerHTML='<div class="sb-t">PROJE ANTETİ · ORTAK ÖZELLİKLER</div><small>Seçimler çizim, 3B ve metrajın ortak bilgisidir.</small>'+ (isPref()?select('h','Panel / duvar yüksekliği',[[250,'250 cm'],[280,'280 cm'],[300,'300 cm']]):'<label>Yükseklik · cm<input class="si" style="width:100%" type="number" min="50" max="10000" data-spec="h" value="'+o.h+'"></label>')+select('ic','İç duvar · cm',[[6,6],[10,10],[15,15]])+select('dis','Dış duvar · cm',[[6,6],[10,10],[15,15]])+select('alciDuvar','Duvar alçıpanı',[['yok','Standart · yalnız ıslak hacimler'],['hepsi','Tüm odalar'],['secili','Seçili odalar + ıslak hacimler']])+select('ceilingMode','Tavan montajı',[['standard','Standart · 60×120 cm + mini H'],['board','Alçıpan · 120×250 cm']])+select('cephe','Dış cephe',[['yok','Standart'],['tasonit','Taşonit'],['yalipan','Yalıpan']])+select('windowColor','Pencere rengi',[['beyaz','Beyaz'],['antrasit','Antrasit'],['altinmese','Altın meşe']])+select('hCover','H kapak lata',[[false,'Yok'],[true,'Betopan · 6 × 2 cm']])+select('kaplama','Çatı kaplaması',[['trapez','27/200 Trapez sac'],['sandvic','Sandviç panel']])+(o.kaplama==='trapez'?select('trapezEn','Net kapatma eni',[[80,'80 cm kapatır'],[100,'100 cm kapatır']]):'');
  const remembered=new Set(openGroups);
  let roof=document.getElementById('roofProjectDefaults');if(!roof){roof=document.createElement('details');roof.id='roofProjectDefaults';roof.innerHTML='<summary>Proje kaplaması ve yeni çatı varsayılanları</summary><div></div>';document.getElementById('roofZones').after(roof);}
  const roofBody=roof.querySelector('div');roofBody.replaceChildren();
  for(const key of ['kaplama','trapezEn']){const field=box.querySelector('[data-spec="'+key+'"]');if(field)roofBody.append(field.closest('label'));}
  const groups=[['Duvarlar',['h','ic','dis']],['Alçıpan kaplama',['alciDuvar','ceilingMode']],['Dış cephe',['cephe','hCover']],['Doğramalar',['windowColor']]];
  const facadeGroup=document.createElement('div');
  for(const [name,keys]of groups){const section=document.createElement('details');section.dataset.group=name;section.open=hadGroups?remembered.has(name):name==='Duvarlar';const title=document.createElement('summary');title.textContent=name;section.append(title);for(const key of keys){const field=box.querySelector('[data-spec="'+key+'"]');if(field)section.append(field.closest('label'));}if(name==='Alçıpan kaplama'){const note=document.createElement('small');note.textContent='Banyo/WC duvarları ve veranda/sundurma tavanları daima yeşil alçıpan. Levha hesabı her iki montajda 120×250 cm; duvar alanı bina yüksekliğine bağlıdır.';section.append(note);}if(name==='Dış cephe')section.append(facadeGroup);box.append(section);}
  const legacy=document.getElementById('optIc');if(legacy){let roofPart=false;for(const child of [...legacy.children]){if(child.tagName==='BUTTON'&&child.textContent.includes('Çatı')){roofPart=true;continue;}const control=child.querySelector('[onchange]');const handler=control?.getAttribute('onchange')||'';if(['ic','dis','alciDuvar','cephe','kaplama','trapezEn'].some(k=>handler.includes("'"+k+"'")))continue;if(roofPart)roofBody.append(child);else if(['plaka','bindirme','cepheFire'].some(k=>handler.includes("'"+k+"'")))facadeGroup.append(child);}}
  const legacyBox=document.getElementById('optBox');if(legacyBox)legacyBox.style.display='none';
  [...box.querySelectorAll('[data-spec]'),...roofBody.querySelectorAll('[data-spec]')].forEach(el=>el.onchange=()=>{let v=el.value;if(['hCover','ceilingBoard'].includes(el.dataset.spec))v=v==='true';optUygula(el.dataset.spec,v);});
 }
 window.ProjectSpecs={facade,propagate,fromRoofs,covers,billRows,render,windowHex:()=>colors[G.opt.windowColor]||colors.beyaz};
 const old=window.optPanelGuncelle;window.optPanelGuncelle=function(){const legacy=document.getElementById('optBox');if(legacy)legacy._html=null;old();render();};optPanelGuncelle();
})();
