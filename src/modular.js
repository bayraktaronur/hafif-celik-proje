/* Manufacturing constraints. Existing geometry is inspected, never auto-moved. */
(function(){
  const $=id=>document.getElementById(id),TOL=.05;
  const strict=()=>isPref()&&G.panelDrawMode!=='exception';
  function cornerConstrained(sn,seg){
    const A=pfAnaliz(),own=A.runs.find(r=>r.items.some(it=>it.seg.id===seg.id));
    if(!own)return true;
    const axis=Math.abs(own.ux)>.999?'x':'y',cross=axis==='x'?'y':'x',comp=_bilesenler(),v=sn[axis];
    return A.runs.some(r=>{
      if(r===own||comp[r.nodes[0].nid]!==comp[sn.id])return false;
      if(Math.abs(r.ux*own.ux+r.uy*own.uy)<.999)return false;
      if(Math.abs((cross==='x'?r.ax:r.ay)-sn[cross])<.05)return false;
      const start=axis==='x'?r.ax:r.ay,end=start+(axis==='x'?r.ux:r.uy)*r.L;
      return v>=Math.min(start,end)-.05&&v<=Math.max(start,end)+.05;
    });
  }
  function reference(sn,axis){
    const A=pfAnaliz(),comp=_bilesenler();let component=comp[sn.id];
    if(!G.segs.some(s=>s.n1===sn.id||s.n2===sn.id)){
      const host=G.segs.find(s=>{const a=getNode(s.n1),b=getNode(s.n2),dx=b.x-a.x,dy=b.y-a.y,L=Math.hypot(dx,dy);if(!L||s.tip==='veranda')return false;const t=((sn.x-a.x)*dx+(sn.y-a.y)*dy)/L;return t>=-TOL&&t<=L+TOL&&Math.abs((sn.x-a.x)*dy-(sn.y-a.y)*dx)/L<TOL;});
      if(!host)return null;component=comp[host.n1];
    }
    const runs=A.runs.filter(r=>comp[r.nodes[0].nid]===component&&(axis==='x'?Math.abs(r.ux):Math.abs(r.uy))>.999);
    runs.sort((a,b)=>(Number(b.dis)-Number(a.dis))||((axis==='x'?a.ay:a.ax)-(axis==='x'?b.ay:b.ax)));
    const r=runs[0];return r?(Number.isFinite(r.panelOrg)?r.panelOrg:(axis==='x'?r.ax:r.ay)+(r.slots[0]?.a||0)):null;
  }
  function cornerAxis(sn,axis,value){
    const comp=_bilesenler(),cross=axis==='x'?'y':'x';let best=value,dist=Infinity;
    pfAnaliz().runs.forEach(r=>{
      if((axis==='x'?Math.abs(r.ux):Math.abs(r.uy))<.999)return;
      if(comp[r.nodes[0].nid]!==comp[sn.id]||Math.abs((cross==='x'?r.ax:r.ay)-sn[cross])<.05)return;
      [r.nodes[0],r.nodes.at(-1)].forEach(end=>{
        const n=getNode(end.nid),degree=G.segs.filter(s=>s.n1===n.id||s.n2===n.id).length;
        if(degree>2)return;
        const d=Math.abs(n[axis]-value);
        if(d<=G.defaultK/2+.05&&d<dist){best=n[axis];dist=d;}
      });
    });return best;
  }
  function inspect(){
    if(!isPref())return [];
    const A=pfAnaliz(),comp=_bilesenler(),groups=new Map(),list=[];
    A.runs.forEach(r=>{const axis=Math.abs(r.ux)>.999?'x':Math.abs(r.uy)>.999?'y':null;
      if(!axis){list.push({code:'module-angle',id:r.owner.id,type:'seg',key:r.owner.id+'angle',message:'Prefabrik duvar yatay veya dikey aks üzerinde olmalı.'});return;}
      const key=comp[r.nodes[0].nid]+axis;if(!groups.has(key))groups.set(key,[]);groups.get(key).push({r,axis});
    });
    groups.forEach(group=>{
      // One common physical panel reference for parallel walls of each building.
      group.sort((a,b)=>(Number(b.r.dis)-Number(a.r.dis))||((a.axis==='x'?a.r.ay:a.r.ax)-(b.axis==='x'?b.r.ay:b.r.ax)));
      const ref=group[0],base=Number.isFinite(ref.r.panelOrg)?ref.r.panelOrg:(ref.axis==='x'?ref.r.ax:ref.r.ay)+(ref.r.slots[0]?.a||0);
      group.forEach(({r,axis})=>{
        const org=axis==='x'?r.ax:r.ay;
        const aligned=value=>Math.abs((value-base)/PF.YARIM-Math.round((value-base)/PF.YARIM))*PF.YARIM<TOL;
        const add=(code,key,message)=>list.push({code,id:r.owner.id,type:'seg',key:code+'|'+key,message});
        r.slots.forEach((p,i)=>{
          const atEnd=i===0||i===r.slots.length-1;
          const deductions=atEnd?[0,r.s0,r.s1,r.s0+r.s1]:[0];
          // During an open outline the allowance for the still-free first
          // corner can temporarily sit at the other end of the panel sequence.
          const freeEnd=atEnd&&[r.nodes[0].nid,r.nodes.at(-1).nid].some(id=>G.segs.filter(s=>s.n1===id||s.n2===id).length===1);
          const valid=deductions.some(d=>[PF.PANEL,PF.YARIM].some(w=>Math.abs(p.w+d-w)<TOL))||(freeEnd&&Math.abs(p.w-G.defaultK/2)<TOL);
          if(!valid)add('module-width',r.owner.id+':'+p.a.toFixed(2)+':'+p.w.toFixed(2),fmtCm(p.w)+' cm panel, tam/yarım modül ve mevcut birleşim paylarıyla açıklanamıyor. Panel ölçüsünü düzeltin veya Özel durum modunu seçin.');
          if(i>0&&!aligned(org+p.a))add('module-axis',axis+':'+(org+p.a).toFixed(2),axis.toUpperCase()+' yönünde '+fmtCm(org+p.a)+' cm H noktası ortak 62,75 cm aksına uymuyor (referans '+fmtCm(base)+' cm).');
        });
        r.birlesim.forEach(pos=>{if(!aligned(org+pos))add('module-junction',axis+':'+(org+pos).toFixed(2),fmtCm(org+pos)+' cm birleşim ortak tam/yarım panel aksından kaçıyor. U bağlantısı serbest bir yerleşim izni değildir.');});
      });
    });return list;
  }
  function inspectState(d){
    const keys=['nodes','segs','elemanlar','rooms','sistem','catiYon','_compLo','_makasLo'],saved=Object.fromEntries(keys.map(k=>[k,G[k]]));
    try{Object.assign(G,{nodes:d.n,segs:d.s,elemanlar:d.e,rooms:d.r,sistem:d.sistem,catiYon:d.catiYon});return inspect();}
    finally{Object.assign(G,saved);}
  }
  function validate(before,after){
    if(!strict())return [];
    const geometry=d=>JSON.stringify({n:d.n,s:d.s.map(s=>({id:s.id,n1:s.n1,n2:s.n2,pnlCfg:s.pnlCfg,pnlTers:s.pnlTers}))});
    if(geometry(before)===geometry(after))return [];
    const old=new Set(inspectState(before).map(i=>i.key));
    const fixedGeometry=d=>JSON.stringify({n:d.n,s:d.s.map(s=>({id:s.id,n1:s.n1,n2:s.n2,k:s.k}))});
    const layoutOnly=fixedGeometry(before)===fixedGeometry(after);
    return inspectState(after).filter(i=>!old.has(i.key)&&!(layoutOnly&&['module-width','module-axis'].includes(i.code)&&after.s.some(s=>s.id===i.id&&s.pnlCfg?.flexible))).map(i=>({...i,level:'error'}));
  }
  const snap=snapPoint;
  window.snapPoint=function(x,y){
    if(!strict()||G.tool!=='duvar')return snap(x,y);
    const alt=G.altKey,grid=G.snapGrid;
    // A modifier or a disabled grid must not silently bypass production rules.
    G.altKey=false;G.snapGrid=true;
    try{
      const p=snap(x,y),sn=G.drawing&&getNode(G.drawStart);
      if(sn&&G.moduleAxisSnap!==false&&!G._snapInfo&&['panel','grid','axis','lock'].includes(G.snapType)){
        const axis=Math.abs(p.x-sn.x)>=Math.abs(p.y-sn.y)?'x':'y',base=reference(sn,axis),step=G.panelDrawMode==='full'?PF.PANEL:PF.YARIM;
        // Both directions share physical axes. Corners shorten the end panel;
        // their allowance is not added again to the next axis.
        if(base!==null){p[axis]=cornerAxis(sn,axis,base+Math.round((p[axis]-base)/step)*step);p[axis==='x'?'y':'x']=sn[axis==='x'?'y':'x'];G.snapPt=p;G.snapNodeId=null;G.snapType='panel';G._snapLbl='Ortak '+axis.toUpperCase()+' aksı';}
      }
      return p;
    }finally{G.altKey=alt;G.snapGrid=grid;}
  };
  const numeric=numUygula;
  window.numUygula=function(){
    if(strict()&&G.tool==='duvar'&&G.inputUnit==='panel'&&G.panelDrawMode==='full'&&!Number.isInteger(Number(G.numBuf.replace(',','.')))){Studio.toast('Tam panel modunda tam adet girin. Yarım panel için modülü değiştirin.',true);return;}
    return numeric();
  };
  const oldIssues=Prefab.issues;
  function frames(){
    const comp=_bilesenler(),groups=new Map();
    pfAnaliz().runs.forEach(r=>{const c=comp[r.nodes[0].nid];if(!groups.has(c))groups.set(c,[]);groups.get(c).push(r);});
    return [...groups.values()].map(runs=>{
      if(runs.length!==4||runs.some(r=>!r.dis||r.owner.pnlCfg||r.nodes.some(n=>G.segs.filter(s=>s.n1===n.nid||s.n2===n.nid).length!==2)))return null;
      const ids=new Set(runs.flatMap(r=>r.nodes.map(n=>n.nid))),nodes=G.nodes.filter(n=>ids.has(n.id));
      const x0=Math.min(...nodes.map(n=>n.x)),x1=Math.max(...nodes.map(n=>n.x)),y0=Math.min(...nodes.map(n=>n.y)),y1=Math.max(...nodes.map(n=>n.y));
      if(runs.some(r=>Math.abs(r.ux)<.999&&Math.abs(r.uy)<.999))return null;
      const horizontal=runs.filter(r=>Math.abs(r.ux)>.999),vertical=runs.filter(r=>Math.abs(r.uy)>.999);
      if(horizontal.length!==2||vertical.length!==2)return null;
      const k=runs[0].items[0].seg.k;if(runs.some(r=>r.items.some(it=>it.seg.k!==k)))return null;
      return{runs,nodes,x0,x1,y0,y1,k,horizontal,vertical};
    });
  }
  function resizeFrame(f,width,height){
    const dx=width-(f.x1-f.x0),dy=height-(f.y1-f.y0);
    f.nodes.forEach(n=>{if(Math.abs(n.x-f.x1)<.01)n.x+=dx;if(Math.abs(n.y-f.y1)<.01)n.y+=dy;});
  }
  const changeRoof=catiYonAyarla;
  window.catiYonAyarla=function(yon,sorma){
    if(!strict()||!G.segs.length||yon===G.catiYon)return changeRoof(yon,sorma);
    const fs=frames();
    if(fs.some(f=>!f)){Studio.toast('Panel adedini koruyan yön değişimi şu an eş kalınlıklı dört köşeli dış çerçevede destekleniyor. Bölmeli/özel plan için yönü çizimden önce seçin.',true);return;}
    Studio.edit(()=>{
      const sizes=fs.map(f=>({f,w:f.horizontal[0].L-f.horizontal[0].s0-f.horizontal[0].s1,h:f.vertical[0].L-f.vertical[0].s0-f.vertical[0].s1}));
      G.catiYon=yon;G.nodes.forEach(n=>delete n.koseTers);
      sizes.forEach(({f,w,h})=>resizeFrame(f,w+(yon==='dikey'?f.k:0),h+(yon==='yatay'?f.k:0)));
      catiBtnGuncelle();
    });
  };
  function outerSize(){
    const selected=G.seciliTip==='seg'&&G.secili,fs=frames(),f=selected?fs.find(f=>f&&f.runs.some(r=>r.items.some(it=>it.seg.id===selected.id))):fs.length===1?fs[0]:null;
    if(!f){Studio.toast('Net dış ölçü için eş kalınlıklı dört köşeli dış çerçeveyi seçin.',true);return false;}
    const w=Number($('outerWidth').value.replace(',','.')),h=Number($('outerHeight').value.replace(',','.'));
    if(!Number.isFinite(w)||!Number.isFinite(h)||w<=2*f.k||h<=2*f.k||w>100000||h>100000){Studio.toast('Dış ölçüler köşe paylarından büyük ve en fazla 100000 cm olmalı.',true);return false;}
    return Studio.edit(()=>{G.panelDrawMode='exception';resizeFrame(f,w-f.k,h-f.k);});
  }
  Prefab.issues=function(){return oldIssues().concat(inspect().map(i=>({...i,level:'warning'})));};
  // User-confirmed fabrication examples. This is intentionally a small
  // catalogue, not a guessed constant allowance or rounding formula.
  function cutMm(width){
    // Additional measured Drawing1.dwg examples: BC9/BCB, BCC/BCD,
    // 7FB/ACE and window block AD5/AD8. These are lookup entries, not a universal deduction.
    const pairs=[[125.5,1250],[62.75,625],[120.5,1200],[122.5,1220],[59.75,590],[57.75,570],[52.75,520],[71.375,710],[102.75,1020],[166,1660]];
    const match=pairs.find(([w])=>Math.abs(width-w)<.001);return match?match[1]:null;
  }
  const panelInfo=pfSegPanelHTML;
  window.pfSegPanelHTML=function(seg){
    const html=panelInfo(seg),R=pfRunOf(seg);if(!R)return html;
    return html+'<div class="panel-help"><b>Yerleşim / net kesim</b><br>Yerleşim H payını içerir. Net kesim yalnız tanımlı ölçülerde gösterilir.</div><table style="width:100%;font-size:12px;text-align:left"><thead><tr><th>Panel</th><th>Yerleşim · cm</th><th>Kesim · mm</th></tr></thead><tbody>'+R.run.slots.map((p,i)=>'<tr><td>'+(i+1)+'</td><td>'+fmtCm(p.w)+'</td><td>'+(cutMm(p.w)??'Tanımsız')+'</td></tr>').join('')+'</tbody></table>';
  };
  window.Modular={validate,inspect,strict,reference,cutMm,cornerConstrained,cornerAxis,outerSize};
  const box=document.createElement('div');box.className='sb';box.id='moduleEditor';
  box.innerHTML='<div class="sb-t">Prefabrik çizim kuralı</div><label class="field-label" for="panelDrawMode">Panel modülü</label><select id="panelDrawMode" class="si full"><option value="mixed">Tam + yarım · 62,75 cm adım</option><option value="full">Tam panel · 125,5 cm adım</option><option value="half">Yarım panel · 62,75 cm adım</option><option value="exception">Özel durum · serbest ölçü</option></select><p class="panel-help">Normal modda ortak H/birleşim aksı ve panel ölçüsü kontrol edilir. Köşe, H ve U payları mevcut birleşim geometrisinden hesaplanır. Yarım modda sayı girişi de tam panel eşdeğeridir: 0,5 = bir yarım.</p><p class="panel-help">Mevcut aks dışı çizimler kaydırılmaz; Plan kontrolünde listelenir. Özel durum modu bu kontrolleri engelleme yerine uyarı olarak uygular.</p>';
  $('trussEditor').before(box);
  const shared=document.createElement('label');shared.className='panel-help';shared.innerHTML='<input id="moduleAxisSnap" type="checkbox"> Ortak X / Y aksına yakala';box.append(shared);
  box.insertAdjacentHTML('beforeend','<details><summary>Özel durum · net dış ölçü gir</summary><p class="panel-help">Dört köşeli dış çerçevenin dış yüzleri arası ölçüdür. Uygulama özel ölçü moduna geçer; paneller kalan alana göre kesilir. Birden fazla çerçeve varsa bir duvarını seçin.</p><label for="outerWidth">Dış en (cm)</label><input id="outerWidth" class="si full" inputmode="decimal" placeholder="Örn. 1024"><label for="outerHeight">Dış boy (cm)</label><input id="outerHeight" class="si full" inputmode="decimal" placeholder="Örn. 1149,5"><button class="sib" onclick="Modular.outerSize()">Net dış ölçüyü uygula</button></details>');
  $('moduleAxisSnap').onchange=function(){G.moduleAxisSnap=this.checked;draw();};
  $('panelDrawMode').onchange=function(){G.panelDrawMode=this.value;draw();Studio.analyze();};
  const render=drawPanels;
  window.drawPanels=function(){render();box.hidden=!isPref();$('panelDrawMode').value=G.panelDrawMode||'mixed';$('moduleAxisSnap').checked=G.moduleAxisSnap!==false;};
  G.panelDrawMode=G.panelDrawMode||'mixed';draw();
})();
