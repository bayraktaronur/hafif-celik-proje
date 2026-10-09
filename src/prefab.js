/* Prefabricated production editing: panel objects, matched joints and strict snaps. */
(function(){
  'use strict';
  const EPS=.01,$=id=>document.getElementById(id),copy=o=>JSON.parse(JSON.stringify(o));
  const base={hitTestAll,updateSidebar,drawPanels,seciliSil,snapPoint,modalOk,makasAnalizBina,topluKalinlik,setSistem,panelTersCevir,pfDiziAyarla,metrajKalemleri};
  const axis=r=>Math.abs(r.ux)>.99?'x':Math.abs(r.uy)>.99?'y':null;
  const origin=(r,a=axis(r))=>a==='x'?r.ax:r.ay;
  function resolve(ref=G.secili){
    if(!ref)return null;
    const r=pfAnaliz().runs.find(r=>r.owner.id===ref.ownerId||r.items.some(it=>it.seg.id===ref.ownerId));
    if(!r)return null;
    const index=r.slots.findIndex(p=>Math.abs(p.a-ref.a)<.1&&Math.abs(p.b-ref.b)<.1);
    return index<0?null:{run:r,panel:r.slots[index],index};
  }
  function ref(r,p){return{id:'panel_'+r.owner.id+'_'+fmtCm(p.a),ownerId:r.owner.id,a:p.a,b:p.b};}
  function select(r,p){G.selPanels=[ref(r,p)];G.secili=ref(r,p);G.seciliTip='panel';G.selSegs=[];G.dragging=false;G.snapPt=null;updateSidebar();draw();}
  function selection(){
    if(G.seciliTip!=='panel'||!G.secili)return[];
    const refs=G.selPanels?.some(p=>p.id===G.secili.id)?G.selPanels:[G.secili];
    return refs.map(p=>resolve(p)).filter(Boolean);
  }
  function mergeSelectionError(list=selection()){
    if(list.length!==2)return 'Birleştirmek için Ctrl + tık ile iki panel seçin.';
    if(list[0].run.owner.id!==list[1].run.owner.id)return 'Paneller aynı duvar hattında olmalı.';
    const [a,b]=list.slice().sort((a,b)=>a.index-b.index);
    if(b.index!==a.index+1)return 'Seçilen paneller bitişik olmalı.';
    if(a.panel.w>PF.YARIM+EPS||b.panel.w>PF.YARIM+EPS)return 'İki yarım veya kısaltılmış panel seçin; her panel en fazla 62,75 cm olmalı.';
    if(openings(a.run).some(o=>o.a<b.panel.b-EPS&&o.b>a.panel.a+EPS))return 'Seçilen panellerde kapı veya pencere var; birleştirilemez.';
    if(!mergeable(a.run,a.panel,b.panel)&&!centeredUJoint(a.run,a.panel,b.panel))return 'Bu bağlantı birleştirilemez. Çektirme U için iki yarım panelin ortasında tek bir dik T kolu olmalı; dörtlü bağlantı korunur.';
    return '';
  }
  function centeredUJoint(run,p,q){
    if(Math.abs(p.w-PF.YARIM)>EPS||Math.abs(q.w-PF.YARIM)>EPS)return false;
    const node=run.nodes.find(n=>Math.abs(n.pos-p.b)<EPS);if(!node)return false;
    const edges=G.segs.filter(s=>s.n1===node.nid||s.n2===node.nid);
    if(edges.length!==3||edges.some(s=>s.tip==='veranda'))return false;
    const branches=edges.filter(s=>!run.items.some(it=>it.seg.id===s.id));
    if(branches.length!==1)return false;
    const s=branches[0],a=getNode(s.n1),b=getNode(s.n2),len=Math.hypot(b.x-a.x,b.y-a.y);
    return len>EPS&&Math.abs(((b.x-a.x)*run.ux+(b.y-a.y)*run.uy)/len)<.001;
  }
  function mergeSelected(){
    const list=selection(),error=mergeSelectionError(list);
    if(error){Studio.toast(error,true);return false;}
    const [a,b]=list.slice().sort((a,b)=>a.index-b.index);
    const convertU=centeredUJoint(a.run,a.panel,b.panel);
    const ok=operation(()=>{
      const items=pieces(a.run);items.splice(a.index,2,{w:a.panel.w+b.panel.w,key:'merged'});
      const result=rebuildLayout(a.run,items,{moveOpenings:false,local:true});
      return{...result,selected:ref(a.run,result.next[a.index])};
    });
    if(ok&&convertU)Studio.toast('Tam panel oluşturuldu; ortadaki T bağlantısı çektirme U oldu. Kapılı duvar yerinde korundu.');
    return ok;
  }
  function linked(run,A=pfAnaliz()){
    if(G.panelSync===false||!run.makasParalel||!axis(run))return[run];
    const a=axis(run),comp=_bilesenler(),c=comp[run.nodes[0].nid],lo=origin(run)+run.s0,hi=origin(run)+run.L-run.s1;
    return A.runs.filter(r=>axis(r)===a&&comp[r.nodes[0].nid]===c&&Math.min(hi,origin(r)+r.L-r.s1)-Math.max(lo,origin(r)+r.s0)>EPS);
  }
  function openings(run){
    const out=[];
    run.items.forEach(it=>G.elemanlar.filter(e=>e.segId===it.seg.id).forEach(e=>{const a=it.off+(it.rev?it.L-e.t*it.L-e.en:e.t*it.L);out.push({e,a,b:a+e.en});}));
    return out;
  }
  function place(run,e,start){
    const it=run.items.find(it=>start>=it.off-EPS&&start+e.en<=it.off+it.L+EPS);
    if(!it)throw Error('Açıklık bir duvar birleşimini aşıyor. Önce açıklığın konumunu düzenleyin.');
    e.segId=it.seg.id;e.t=(it.rev?it.L-(start-it.off)-e.en:start-it.off)/it.L;
    const error=Studio.openingError(e);if(error)throw Error(error);
  }
  function pieces(run){return run.slots.map((p,i)=>({w:p.w,key:i}));}
  function reorientProduction(yon){
    // The truss/H grid is the reference. Preserve its panel bays, exchange
    // the two corner allowances, then trim end pieces to the new faces.
    const before=pfAnaliz().runs,comp=_bilesenler(),openingPoints=[];
    before.forEach(r=>openings(r).forEach(o=>{
      openingPoints.push({e:o.e,axis:axis(r),component:comp[r.nodes[0].nid],p:{x:r.ax+r.ux*(o.a+o.e.en/2),y:r.ay+r.uy*(o.a+o.e.en/2)}});
    }));
    G.catiYon=yon;
    G.nodes.forEach(n=>delete n.koseTers);
    const turned=pfAnaliz().runs,frames=[];
    for(const component of new Set(before.map(r=>comp[r.nodes[0].nid]))){
      const runs=before.filter(r=>comp[r.nodes[0].nid]===component),ids=new Set(runs.flatMap(r=>r.nodes.map(n=>n.nid))),nodes=G.nodes.filter(n=>ids.has(n.id)),frame={component};
      for(const a of ['x','y']){
        const lo=Math.min(...nodes.map(n=>n[a])),hi=Math.max(...nodes.map(n=>n[a]));
        const parallel=runs.filter(r=>axis(r)===a).sort((p,q)=>Number(q.dis)-Number(p.dis)||q.L-p.L);
        const first=parallel.find(r=>Math.abs(origin(r)-lo)<EPS),last=parallel.find(r=>Math.abs(origin(r)+r.L-hi)<EPS);
        const change=(r,end)=>r?(turned.find(q=>q.owner.id===r.owner.id)[end]-r[end]):0;
        frame[a]={lo,hi,lead:change(first,'s0'),tail:change(last,'s1')};
      }
      frames.push(frame);
    }
    const frameFor=p=>frames.filter(f=>p.x>=f.x.lo-500&&p.x<=f.x.hi+500&&p.y>=f.y.lo-500&&p.y<=f.y.hi+500).sort((a,b)=>{
      const distance=f=>Math.max(f.x.lo-p.x,0,p.x-f.x.hi)**2+Math.max(f.y.lo-p.y,0,p.y-f.y.hi)**2;
      return distance(a)-distance(b);
    })[0];
    const move=(p,component)=>{
      const f=component===undefined?frameFor(p):frames.find(f=>f.component===component);if(!f)return {...p};
      const out={...p};for(const a of ['x','y']){const v=f[a];out[a]+=p[a]<=v.lo+EPS?0:p[a]>=v.hi-EPS?v.lead+v.tail:v.lead;}return out;
    };
    move.forPoint=p=>{const f=frameFor(p);return q=>f?move(q,f.component):{...q};};
    G.nodes.forEach(n=>Object.assign(n,move(n,comp[n.id])));
    for(const o of openingPoints){
      const p=move(o.p,o.component),s=getSeg(o.e.segId),a=getNode(s.n1),b=getNode(s.n2),L=_segLen(s),ux=(b.x-a.x)/L,uy=(b.y-a.y)/L;
      o.e.t=((p.x-a.x)*ux+(p.y-a.y)*uy-o.e.en/2)/L;
      const error=Studio.openingError(o.e);if(error)throw Error(error);
    }
    G.segs.filter(s=>s.tip!=='veranda').forEach(s=>{delete s.pnlCfg;delete s.pnlTers;});
    pfAnaliz().runs.forEach(r=>{
      const old=before.find(q=>q.owner.id===r.owner.id),a=axis(r),els=openings(r);
      for(const o of els){
        if(o.a<r.s0-EPS||o.b>r.L-r.s1+EPS)throw Error('Yeni köşe payı kapı/pencere boşluğuna taşıyor. Önce açıklığın konumunu düzenleyin.');
      }
      if(!old?.slots.length||!a)return;
      const allowance=Math.max(...r.items.map(it=>it.seg.k/2)),joints=[r.s0];
      old.slots.slice(1).forEach(p=>{
        const world=move({x:old.ax+old.ux*p.a,y:old.ay+old.uy*p.a},comp[old.nodes[0].nid]);let pos=world[a]-origin(r);
        if(r.makasParalel){
          const onGrid=r.makasOrg+Math.round((world[a]-r.makasOrg)/PF.YARIM)*PF.YARIM-origin(r);
          if(Math.abs(onGrid-pos)<=allowance+EPS&&onGrid>r.s0+EPS&&onGrid<r.L-r.s1-EPS&&!els.some(o=>onGrid>o.a+EPS&&onGrid<o.b-EPS))pos=onGrid;
        }
        joints.push(pos);
      });
      joints.push(r.L-r.s1);
      const widths=joints.slice(1).map((x,i)=>x-joints[i]);
      if(widths.some(w=>w<.1))throw Error('Köşe payı bu hattaki küçük paneli tüketiyor. Panel adedini koruyarak yön değiştirilemiyor; uç paneli düzenleyin.');
      if(widths.slice(1,-1).some((w,i)=>Math.abs(w-old.slots[i+1].w)>EPS))throw Error('Yeni makas aksı bu hattaki ara panelin ölçüsünü değiştiriyor. Ara paneller korunacağı için önce H/panel dizilimini düzenleyin.');
      r.owner.pnlCfg={dizi:widths,explicit:true};
      for(const o of els)if(!joints.slice(1).some((b,i)=>o.a>=joints[i]-EPS&&o.b<=b+EPS)&&old.slots.some(p=>{
        const prior=openingPoints.find(q=>q.e.id===o.e.id),start=(prior.p.x-old.ax)*old.ux+(prior.p.y-old.ay)*old.uy-o.e.en/2;
        return start>=p.a-EPS&&start+o.e.en<=p.b+EPS;
      }))throw Error('Yeni H aksı kapı/pencereye taşıyor. Panel adedini korumak için açıklık panosunu düzenleyin.');
    });
    // Selection references contain old panel limits, so they cannot survive a reflow.
    G.selPanels=[];G.panelAnchor=null;
    if(G.seciliTip==='panel'){G.secili=null;G.seciliTip=null;}
    G.snapPt=null;G.snapNodeId=null;G._snapInfo=null;G.drawPreviewPt=null;G.numBuf='';
    return move;
  }
  function layoutSlots(run,items){let pos=run.s0;return items.map(item=>{const p={...item,a:pos,b:pos+item.w};pos=p.b;return p;});}
  function setWidths(run,slots,support){
    run.items.forEach(it=>{delete it.seg.pnlCfg;delete it.seg.pnlTers;});
    run.owner.pnlCfg={dizi:slots.map(p=>p.b-p.a),explicit:true};
    if(support){run.owner.pnlCfg.roofAligned=true;run.owner.pnlCfg.roofAxis=axis(run);}
  }
  function mergeable(run,p,q,els=openings(run)){
    if(!p||!q||p.b-p.a>PF.YARIM+EPS||q.b-q.a>PF.YARIM+EPS)return false;
    if(els.some(o=>o.a<q.b-EPS&&o.b>p.a+EPS))return false;
    // A T / four-way connection remains a physical panel boundary.
    return !run.nodes.some(n=>Math.abs(n.pos-p.b)<EPS&&G.segs.filter(s=>s.n1===n.nid||s.n2===n.nid).length>2);
  }
  function compactPlans(plans){
    // Remove a redundant H on all matched walls together. A connection or
    // existing opening on any of them protects that H on every wall.
    for(const plan of plans){
      for(let i=0;i<plan.slots.length-1;i++){
        const world=origin(plan.r)+plan.slots[i].b;
        const peers=plans.map(p=>({...p,index:p.slots.findIndex(s=>Math.abs(origin(p.r)+s.b-world)<EPS)})).filter(p=>p.index>=0&&p.index<p.slots.length-1);
        if(!peers.length||peers.some(p=>!mergeable(p.r,p.slots[p.index],p.slots[p.index+1],p.moves.map(m=>({a:m.start,b:m.start+m.e.en})))))continue;
        peers.forEach(p=>{const a=p.slots[p.index],b=p.slots[p.index+1];p.slots.splice(p.index,2,{...a,b:b.b,w:b.b-a.a});});
        i--;
      }
    }
  }
  function rebuildLayout(run,items,{moveOpenings=true,compact=false,local=false}={}){
    const a=axis(run);if(!a)throw Error('Panel sıralaması yatay ve dikey duvarlarda düzenlenebilir.');
    const next=layoutSlots(run,items),total=next.at(-1)?.b||run.s0;
    if(Math.abs(total-(run.L-run.s1))>.1)throw Error('Panel boylarının toplamı duvarın panel alanını korumalı.');
    const peers=local?[run]:linked(run),srcOrg=origin(run),srcLo=srcOrg,srcHi=srcOrg+run.L;
    const mapPos=(worldStart,width)=>{
      if(!moveOpenings)return worldStart;
      const p=run.slots.find(p=>worldStart-srcOrg>=p.a-EPS&&worldStart-srcOrg+width<=p.b+EPS);
      if(!p)return worldStart;
      const oldIndex=run.slots.indexOf(p),newP=next.find(p=>p.key===oldIndex);
      return newP?worldStart+(newP.a-p.a):worldStart;
    };
    const plans=peers.map(r=>{
      const ro=origin(r),lo=r.s0,hi=r.L-r.s1;
      let slots;
      if(r.owner.id===run.owner.id)slots=next;
      else{
        const lower=Math.max(lo,srcLo-ro),upper=Math.min(hi,srcHi-ro);
        const cuts=[lo,hi,lower,upper];
        r.slots.forEach(p=>{if(p.a<lower-EPS||p.a>upper+EPS)cuts.push(p.a);});
        // Only internal H joints are shared. The first panel's face is a local
        // corner/U allowance, not a joint to cut into the opposite wall.
        next.slice(1).forEach(p=>{const v=srcOrg+p.a-ro;if(v>lower+EPS&&v<upper-EPS)cuts.push(v);});
        const unique=cuts.filter(v=>v>=lo-EPS&&v<=hi+EPS).sort((x,y)=>x-y).filter((v,i,arr)=>!i||v-arr[i-1]>EPS);
        slots=unique.slice(0,-1).map((v,i)=>({a:v,b:unique[i+1]}));
      }
      const moves=openings(r).map(o=>({e:o.e,start:mapPos(ro+o.a,o.e.en)-ro}));
      for(const m of moves)if(!slots.some(p=>m.start>=p.a-EPS&&m.start+m.e.en<=p.b+EPS))throw Error('Panel değişikliği bir kapı/pencereyi H birleşiminin üzerine getiriyor. Açıklığı taşıyın veya daha geniş panel seçin.');
      return{r,slots,moves};
    });
    if(compact)compactPlans(plans);
    // Move all openings before checking overlap so simultaneous swaps are atomic.
    plans.forEach(({r,slots})=>setWidths(r,slots,run.makasParalel&&G.panelSync!==false));
    plans.forEach(({r,moves})=>moves.forEach(({e,start})=>{
      const it=r.items.find(it=>start>=it.off-EPS&&start+e.en<=it.off+it.L+EPS);
      if(!it)throw Error('Yeni açıklık konumu duvar birleşimini aşıyor.');
      e.segId=it.seg.id;e.t=(it.rev?it.L-(start-it.off)-e.en:start-it.off)/it.L;
    }));
    plans.forEach(({moves})=>moves.forEach(({e})=>{const error=Studio.openingError(e);if(error)throw Error(error);}));
    return{next,peers:peers.length};
  }
  let quickGuard=false;
  function supportedAxes(){const M=makasAnaliz();if(!M)return [];const out=[];pfAnaliz().runs.forEach(r=>{const a=axis(r),normal=a==='x'?r.ay:r.ax;M.makaslar.forEach(m=>{if((m.axis||(M.yatay?'x':'y'))===a&&m.pos>origin(r)+r.s0+.6&&m.pos<origin(r)+r.L-r.s1-.6&&normal>=m.a-.6&&normal<=m.b+.6&&r.slots.slice(1).some(p=>Math.abs(origin(r)+p.a-m.pos)<.6))out.push(r.owner.id+'|'+m.pos);});});return out;}
  function quick(action,dir){quickGuard=true;try{return ({split,merge,swap})[action]?.(dir)||false;}finally{quickGuard=false;}}
  function operation(mutator){
    const current=resolve();if(!current){Studio.toast('Önce bir panel seçin.',true);return false;}
    let selected,peerCount=1;
    const protectedAxes=quickGuard?supportedAxes():[];
    const ok=Studio.edit(()=>{const result=mutator(current);selected=result?.selected;peerCount=result?.peers||1;if(quickGuard){const next=new Set(supportedAxes());if(protectedAxes.some(k=>!next.has(k)))throw Error('Bu işlem sabit makas aksındaki H mesnedini kaldırıyor. Başka bir komşu panel seçin.');}});
    if(ok){
      if(selected){const r=pfAnaliz().runs.find(r=>r.items.some(it=>it.seg.id===selected.ownerId));const p=r?.slots.find(p=>Math.abs(p.a-selected.a)<.1&&Math.abs(p.b-selected.b)<.1);if(p)select(r,p);}
      Studio.toast(peerCount>1?peerCount+' duvar hattının panel ekleri birlikte güncellendi.':'Panel düzeni güncellendi.');
    }
    return ok;
  }
  function swap(dir){return operation(({run,index})=>{
    const target=index+dir;if(target<0||target>=run.slots.length)throw Error('Bu yönde komşu panel yok.');
    const items=pieces(run);[items[index],items[target]]=[items[target],items[index]];
    const result=rebuildLayout(run,items),p=result.next.find(p=>p.key===index);
    return{...result,selected:ref(run,p)};
  });}
  function swapLocal(dir){return operation(({run,index})=>{
    const target=index+dir;if(target<0||target>=run.slots.length)throw Error('Bu yönde komşu panel yok.');
    const first=Math.min(index,target),a=run.slots[first],b=run.slots[first+1];
    if(run.nodes.some(n=>Math.abs(n.pos-a.b)<EPS&&G.segs.filter(s=>s.n1===n.nid||s.n2===n.nid).length>2))throw Error('İki panel arasındaki duvar birleşimi taşınamaz.');
    if(openings(run).some(o=>o.a<b.b-EPS&&o.b>a.a+EPS))throw Error('Bu iki panelde mevcut açıklık var. Yerel değişim için boş panelleri seçin.');
    const items=pieces(run);[items[index],items[target]]=[items[target],items[index]];
    const result=rebuildLayout(run,items,{moveOpenings:false,local:true});run.owner.pnlCfg.flexible=true;
    return{...result,selected:ref(run,result.next.find(p=>p.key===index))};
  });}
  function makeFull(dir){return operation(({run,panel,index})=>{
    const target=index+dir,q=run.slots[target];if(!q)throw Error('Bu yönde komşu panel yok.');
    const first=Math.min(index,target),a=run.slots[first],b=run.slots[first+1],total=a.w+b.w,rest=total-PF.PANEL;
    if(rest<-EPS||rest>PF.PANEL+EPS||(rest>EPS&&rest<10))throw Error('İki panelin toplamı tam panel ve kullanılabilir bir kalan için uygun değil.');
    if(run.nodes.some(n=>Math.abs(n.pos-a.b)<EPS&&G.segs.filter(s=>s.n1===n.nid||s.n2===n.nid).length>2))throw Error('İki panel arasındaki duvar birleşimi taşınamaz. Diğer komşuyu kullanın.');
    if(openings(run).some(o=>o.a<b.b-EPS&&o.b>a.a+EPS))throw Error('Bu iki panelde mevcut kapı/pencere var. Boş komşu panelleri seçin.');
    const items=pieces(run),replacement=rest<=EPS?[{w:PF.PANEL}]:index===first?[{w:PF.PANEL},{w:rest}]:[{w:rest},{w:PF.PANEL}];
    items.splice(first,2,...replacement);
    const result=rebuildLayout(run,items,{moveOpenings:false,local:true});run.owner.pnlCfg.flexible=true;
    const selectedIndex=first+(rest>EPS&&index!==first?1:0);
    return{...result,selected:ref(run,result.next[selectedIndex])};
  });}
  function split(){return operation(({run,panel,index})=>{
    if(!quickGuard&&Math.abs(panel.w-PF.PANEL)>.1)throw Error('Bu işlem 125,5 cm tam paneli iki 62,75 cm panele böler.');
    const base=Number.isFinite(run.panelOrg)?run.panelOrg:run.makasOrg;
    const mid=quickGuard?base+Math.round((origin(run)+(panel.a+panel.b)/2-base)/PF.YARIM)*PF.YARIM-origin(run):(panel.a+panel.b)/2;
    if(mid-panel.a<10||panel.b-mid<10)throw Error('Bu panelin içinde uygun bir yarım modül aksı yok.');
    if(openings(run).some(o=>o.a<mid-EPS&&o.b>mid+EPS))throw Error('Yeni H noktası kapı/pencere boşluğuna denk geliyor. Önce açıklığı taşıyın.');
    const items=pieces(run);items.splice(index,1,{w:mid-panel.a,key:'half-a'},{w:panel.b-mid,key:'half-b'});
    const result=rebuildLayout(run,items,{moveOpenings:false});return{...result,selected:ref(run,result.next[index])};
  });}
  function merge(dir){return operation(({run,panel,index})=>{
    const q=run.slots[index+dir],first=Math.min(index,index+dir);
    if(!q||!mergeable(run,run.slots[first],run.slots[first+1]))throw Error('Birleşim veya açıklık aşılmadan yan yana iki yarım/kısaltılmış panel birleştirilebilir.');
    const joint=origin(run)+run.slots[first].b;
    if(linked(run).some(r=>r.nodes.some(n=>Math.abs(origin(r)+n.pos-joint)<EPS&&G.segs.filter(s=>s.n1===n.nid||s.n2===n.nid).length>2)))throw Error('Karşı hattaki duvar birleşimine ait H kaldırılamaz.');
    const items=pieces(run);items.splice(first,2,{w:panel.w+q.w,key:'merged'});
    const result=rebuildLayout(run,items,{moveOpenings:false});return{...result,selected:ref(run,result.next[first])};
  });}
  function remove(){return operation(({run,panel})=>{
    const oldSlots=copy(run.slots.map(p=>({a:p.a,b:p.b}))),ro={ax:run.ax,ay:run.ay,ux:run.ux,uy:run.uy};
    const lo=Math.abs(panel.a-run.s0)<.1?0:panel.a,hi=Math.abs(panel.b-(run.L-run.s1))<.1?run.L:panel.b;
    const keepEls=[],removeIds=new Set(),newSegments=[];
    for(const it of run.items){
      const cutA=Math.max(lo,it.off),cutB=Math.min(hi,it.off+it.L);if(cutB-cutA<EPS)continue;
      const removed=G.elemanlar.filter(e=>e.segId===it.seg.id);
      removed.forEach(e=>{const start=it.off+(it.rev?it.L-e.t*it.L-e.en:e.t*it.L),end=start+e.en;
        if(start<hi-EPS&&end>lo+EPS){if(start<lo-EPS||end>hi+EPS)throw Error('Açıklık panel sınırını aşıyor; önce açıklığı düzenleyin.');removeIds.add(e.id);}else keepEls.push({e,start});});
      const point=d=>{if(Math.abs(d-it.off)<EPS)return it.from;if(Math.abs(d-(it.off+it.L))<EPS)return it.to;const id=uid();G.nodes.push({id,x:ro.ax+ro.ux*d,y:ro.ay+ro.uy*d});return id;};
      for(const [a,b] of [[it.off,cutA],[cutB,it.off+it.L]])if(b-a>=1){const s={...copy(it.seg),id:uid(),n1:point(a),n2:point(b),elemanlar:[]};delete s.pnlCfg;delete s.pnlTers;newSegments.push({s,a,b});}
      removeIds.add(it.seg.id);
    }
    G.segs=G.segs.filter(s=>!removeIds.has(s.id)).concat(newSegments.map(p=>p.s));
    G.elemanlar=G.elemanlar.filter(e=>!removeIds.has(e.id));
    keepEls.forEach(({e,start})=>{const p=newSegments.find(p=>start>=p.a-EPS&&start+e.en<=p.b+EPS);if(!p)throw Error('Açıklık yeni duvar parçasına taşınamadı.');e.segId=p.s.id;e.t=(start-p.a)/(p.b-p.a);});
    G.segs.forEach(s=>{if(run.items.some(it=>it.seg.id===s.id)){delete s.pnlCfg;delete s.pnlTers;}});
    normalizeGraph();detectRooms();
    // Keep the remaining manufactured panel widths; do not regenerate from zero.
    pfAnaliz().runs.forEach(r=>{
      if(Math.abs(r.ux*ro.uy-r.uy*ro.ux)>.001||Math.abs((r.ax-ro.ax)*ro.uy-(r.ay-ro.ay)*ro.ux)>.01)return;
      const offset=(r.ax-ro.ax)*ro.ux+(r.ay-ro.ay)*ro.uy,start=offset+r.s0,end=offset+r.L-r.s1;
      if(start<-.1||end>run.L+.1)return;
      const cuts=[r.s0,r.L-r.s1];oldSlots.forEach(p=>{if(p.a>start+EPS&&p.a<end-EPS)cuts.push(p.a-offset);});cuts.sort((a,b)=>a-b);
      setWidths(r,cuts.slice(0,-1).map((a,i)=>({a,b:cuts[i+1]})),false);
    });
    return{};
  });}
  window.hitTestAll=function(px,py){
    if(!isPref()||G.selectionMode!=='panel')return base.hitTestAll(px,py);
    const cm=toCm(px,py);let best=null;
    pfAnaliz().runs.forEach(r=>{const t=(cm.x-r.ax)*r.ux+(cm.y-r.ay)*r.uy,d=Math.abs((cm.x-r.ax)*r.uy-(cm.y-r.ay)*r.ux),p=r.slots.find(p=>t>=p.a-EPS&&t<=p.b+EPS);
      if(p&&d<=Math.max(p.k/2,7/sc())&&(!best||d<best.d))best={d,tip:'panel',obj:ref(r,p)};});
    return best||base.hitTestAll(px,py);
  };
  window.drawPanels=function(){base.drawPanels();syncUI();if(G.seciliTip!=='panel'||!isPref())return;for(const {run:r,panel:p} of selection()){
    const a=toCv(r.ax+r.ux*p.a,r.ay+r.uy*p.a),b=toCv(r.ax+r.ux*p.b,r.ay+r.uy*p.b);
    ctx.save();ctx.strokeStyle='#69d6b2';ctx.lineWidth=Math.max(6,p.k*sc()+6);ctx.globalAlpha=.45;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();ctx.globalAlpha=1;ctx.lineWidth=2;const nx=-r.uy*(p.k*sc()/2+4),ny=r.ux*(p.k*sc()/2+4);ctx.beginPath();ctx.moveTo(a.x+nx,a.y+ny);ctx.lineTo(b.x+nx,b.y+ny);ctx.lineTo(b.x-nx,b.y-ny);ctx.lineTo(a.x-nx,a.y-ny);ctx.closePath();ctx.stroke();ctx.restore();
  }};
  window.updateSidebar=function(){
    base.updateSidebar();
    if(isPref()&&G.seciliTip==='seg'&&G.secili){
      const a=getNode(G.secili.n1),b=getNode(G.secili.n2);
      $('sbSelIc').insertAdjacentHTML('afterbegin','<div class="panel-card-title"><strong>Duvar parçası seçili</strong></div><p class="panel-help">Mavi alan bağlantılar arasındaki '+fmtCm(Math.hypot(b.x-a.x,b.y-a.y))+' cm duvar parçasıdır. Panel sınırlarını H işaretleri belirler.</p><button class="sib" onclick="Prefab.mode(\'panel\')">Panel seçimine geç</button>');
    }
    if(G.seciliTip!=='panel')return;const found=resolve();if(!found){G.secili=null;G.seciliTip=null;base.updateSidebar();return;}
    const {run,panel:p,index}=found,peers=linked(run).length,els=openings(run).filter(o=>o.a>=p.a-EPS&&o.b<=p.b+EPS),half=Math.abs(p.w-PF.YARIM)<.1;
    $('sbSel').style.display='block';$('selectionEmpty').hidden=true;
    const selected=selection();
    if(selected.length>1){
      const error=mergeSelectionError(selected),total=selected.reduce((sum,s)=>sum+s.panel.w,0);
      $('sbSelIc').innerHTML='<div class="panel-card-title"><strong>'+selected.length+' panel seçili</strong></div><p class="panel-help">Toplam '+fmtCm(total)+' cm · '+selected.map(s=>esc(s.panel.no||'Panel')).join(' + ')+'</p><button id="mergeSelectedPanels" class="sib" onclick="Prefab.mergeSelected()" '+(error?'disabled':'')+'>Panelleri birleştir</button><p class="panel-help">'+esc(error||'Yalnız seçilen iki panel birleşir. Karşı duvarlar ve makas aksları değişmez.')+'</p><p class="panel-help">Ctrl + tık: ekle / çıkar · Shift + tık: aralık seç · Normal tık: tek panel</p>';
      if(!error){const [a,b]=selected.slice().sort((a,b)=>a.index-b.index);if(centeredUJoint(a.run,a.panel,b.panel))$('sbSelIc').insertAdjacentHTML('beforeend','<p class="panel-help"><b>Çektirme U bağlantısı</b><br>İki yarım panel tek 125,5 cm panel olur. Ortadaki üçlü H yerine, gelen duvar kalınlığında çektirme U hesaplanır. Gelen duvar ve kapı yerinde kalır.</p>');}
      return;
    }
    $('sbSelIc').innerHTML='<div class="panel-card-title"><span>'+esc(p.no||'Panel')+'</span><strong>'+({tam:'Tam panel',yarim:'Yarım panel',ozel:'Özel panel'}[p.tip])+'</strong></div>'+
      '<div class="sr"><span class="sl">Panel boyu</span><span class="sv">'+fmtCm(p.w)+' cm</span></div><div class="sr"><span class="sl">Kalınlık</span><span class="sv">'+p.k+' cm</span></div>'+
      '<div class="sr"><span class="sl">Açıklık</span><span class="sv">'+(els.length?esc(els.map(o=>o.e.ad||o.e.tip_).join(', ')):'Yok')+'</span></div>'+
      '<div class="panel-actions"><button class="sib" onclick="Prefab.swap(-1)" '+(!index?'disabled':'')+'>← Öncekiyle değiştir</button><button class="sib" onclick="Prefab.swap(1)" '+(index===run.slots.length-1?'disabled':'')+'>Sonrakiyle değiştir →</button></div>'+
      '<button class="sib" onclick="Prefab.split()" '+(Math.abs(p.w-PF.PANEL)>.1?'disabled':'')+'>Tam → 2 yarım panel</button>'+
      '<div class="panel-help"><b>Yalnız bu duvarda yer değiştir</b><br>Komşu iki boş panel yer değiştirir. Karşı duvar ve makas aksları sabit kalır.</div><div class="panel-actions"><button class="sib" onclick="Prefab.swapLocal(-1)" '+(!index?'disabled':'')+'>← Yerel değiştir</button><button class="sib" onclick="Prefab.swapLocal(1)" '+(index===run.slots.length-1?'disabled':'')+'>Yerel değiştir →</button></div>'+
      '<div class="panel-help"><b>Bu konumda tam panel oluştur</b><br>Seçili panel ve komşusunun toplamı korunur. Yalnız bu hat değişir; makaslar sabit kalır. Özel kalan ölçüsü Plan kontrolünde gösterilir.</div><div class="panel-actions"><button class="sib" onclick="Prefab.makeFull(-1)" '+(!index?'disabled':'')+'>← Önceki komşuyla</button><button class="sib" onclick="Prefab.makeFull(1)" '+(index===run.slots.length-1?'disabled':'')+'>Sonraki komşuyla →</button></div>'+
      '<p class="panel-help">Birleştirmek için Ctrl + tık ile komşu paneli de seçin. Shift + tık aradaki panelleri seçer.</p>'+
      '<label class="panel-sync"><input type="checkbox" '+(G.panelSync!==false?'checked':'')+' onchange="G.panelSync=this.checked;updateSidebar();draw()"> Karşı hatların H noktalarını eşleştir</label>'+
      '<p class="panel-help">'+(run.makasParalel?peers+' hat birlikte düzenlenir. Kapı/pencere kendi paneliyle taşınır; makas aksları korunur.':'Bu duvar makas mesnet hattı yönünde değil; yalnız seçili hat düzenlenir.')+'</p>'+
      '<button class="sib d" onclick="Prefab.remove()">Bu paneli'+(els.length?' ve açıklığını':'')+' kaldır</button><p class="panel-help">Kaldırma yalnız bu duvarda fiziksel boşluk açar; kapalı oda sınırı değişebilir.</p>';
  };
  window.seciliSil=function(){if(isPref()&&G.seciliTip==='panel'){if(selection().length>1){Studio.toast('Silmek için tek panel seçin.',true);return;}remove();}else base.seciliSil();};
  window.panelTersCevir=function(){
    if(!isPref()||G.seciliTip!=='seg'){base.panelTersCevir();return;}
    const r=pfRunOf(G.secili)?.run;if(r)Studio.edit(()=>rebuildLayout(r,pieces(r).reverse()));
  };
  window.pfDiziAyarla=function(text){
    if(!isPref()||G.seciliTip!=='seg'){base.pfDiziAyarla(text);return;}
    const r=pfRunOf(G.secili)?.run;if(!r)return;
    Studio.edit(()=>{
      const ws=String(text).replace(/,/g,'.').split(/[+;\s]+/).filter(Boolean).map(Number);
      if(!ws.length)throw Error('Bir panel dizilimi girin veya Otomatik düğmesini kullanın.');
      if(ws.some(w=>!Number.isFinite(w)||w<=0||w>PF.PANEL+.01))throw Error('Her panel 0 ile 125,5 cm arasında olmalı.');
      const rest=r.L-r.s0-r.s1-ws.reduce((a,b)=>a+b,0);
      if(rest<-.01)throw Error('Panel dizilimi duvar alanından uzun.');
      if(rest>.01){let left=rest;while(left>PF.PANEL+.01){ws.push(PF.PANEL);left-=PF.PANEL;}if(left>.01)ws.push(left);}
      rebuildLayout(r,ws.map((w,i)=>({w,key:'manual-'+i})),{moveOpenings:false});
    });
  };
  window.topluKalinlik=function(){
    const val=String(G.defaultK);$('topluK').innerHTML=(isPref()?[6,10,15]:DK_CELIK).map(k=>'<option value="'+k+'">'+k+' cm</option>').join('');$('topluK').value=val;
    $('topluH').innerHTML='<option value="hepsi">Tüm duvarlar</option><option value="dis">Dış duvarlar</option><option value="ic">İç duvarlar</option><option value="sec">Seçili duvarlar</option>';base.topluKalinlik();
  };
  // A door near a terminal half panel moves that half before its full neighbour.
  // Explicit configurations disable the legacy renderer's local-only reshuffling.
  function wideWindowLayout(run,center){
    const lo=center-83,hi=center+83;
    if(lo<run.s0-EPS||hi>run.L-run.s1+EPS||!run.items.some(it=>lo>=it.off-EPS&&hi<=it.off+it.L+EPS))throw Error('166 cm pencere panosu köşe veya duvar birleşimini aşıyor. Komşu tam paneli seçin.');
    const section=run.items.find(it=>lo>=it.off-EPS&&hi<=it.off+it.L+EPS),start=Math.max(run.s0,section.off),end=Math.min(run.L-run.s1,section.off+section.L);
    const cuts=[run.s0,run.L-run.s1,start,end,lo,hi];
    // A side that fits one panel must not retain obsolete H cuts. Keep
    // longer sides and other opening panels intact.
    const occupied=openings(run).filter(o=>o.b<=lo+EPS||o.a>=hi-EPS);
    run.slots.forEach(p=>{if(p.a>=lo-EPS&&p.a<=hi+EPS)return;
      const left=p.a>start+EPS&&p.a<lo-EPS,right=p.a>hi+EPS&&p.a<end-EPS;
      const protectedSide=occupied.some(o=>left?o.a<lo&&o.b>start:right&&o.a<end&&o.b>hi);
      if((left&&lo-start<=PF.PANEL+EPS||right&&end-hi<=PF.PANEL+EPS)&&!protectedSide)return;
      cuts.push(p.a);
    });
    cuts.sort((a,b)=>a-b);const unique=cuts.filter((v,i)=>!i||v-cuts[i-1]>EPS);
    const items=unique.slice(0,-1).map((a,i)=>({w:unique[i+1]-a}));
    if(items.some(p=>p.w<10-EPS))throw Error('166 cm pano yerleşimi 10 cm’den küçük artık oluşturuyor. Komşu paneli seçin.');
    rebuildLayout(run,items,{moveOpenings:false,local:true});run.owner.pnlCfg.flexible=true;
  }
  function fitWideWindow(){
    const e=G.secili;if(G.seciliTip!=='eleman'||e?.tip_!=='pencere'||Math.abs(e.en-160)>.01)return false;
    const R=pfRunOf(getSeg(e.segId)),o=openings(R.run).find(o=>o.e.id===e.id);
    const ok=Studio.edit(()=>wideWindowLayout(R.run,(o.a+o.b)/2));
    if(ok)Studio.toast('160 cm pencere için 166 cm pano oluşturuldu; toplam boy ve makaslar korundu.');return ok;
  }
  const centerOpening=document.createElement('button');centerOpening.type='button';centerOpening.id='centerWindowSection';centerOpening.className='tb';centerOpening.textContent='Bu duvar bölümüne ortala';
  $('mEn').parentElement.append(centerOpening);
  const openOpening=window.openModal;
  window.openModal=function(...args){openOpening(...args);centerOpening.textContent='Bu duvar bölümüne ortala';centerOpening.hidden=!isPref()||_mT!=='pencere'||Math.abs(+$('mEn').value-160)>.01;};
  centerOpening.onclick=()=>{
    if(!_mSeg||!isPref()||_mT!=='pencere'||Math.abs(+$('mEn').value-160)>.01)return;
    const r=pfRunOf(_mSeg).run,it=r.items.find(it=>it.seg.id===_mSeg.id),center=(Math.max(r.s0,it.off)+Math.min(r.L-r.s1,it.off+it.L))/2;
    _mRaw=_mSp={x:r.ax+r.ux*center,y:r.ay+r.uy*center};
    centerOpening.textContent='Duvar bölümünün ortası seçildi';
  };
  window.modalOk=function(){
    if(!isPref()||!_mSeg){base.modalOk();return;}
    const R=pfRunOf(_mSeg),en=+$('mEn').value;if(!R){base.modalOk();return;}
    const r=R.run,raw=_mRaw||_mSp,pos=(raw.x-r.ax)*r.ux+(raw.y-r.ay)*r.uy;
    if(_mT==='pencere'&&Math.abs(en-160)<.01){
      const panel=r.slots.find(p=>pos>=p.a-EPS&&pos<=p.b+EPS),segId=_mSeg.id;
      if(!panel){Studio.toast('Pencere için bir panel seçin.',true);return;}
      const ok=Studio.edit(()=>{
        wideWindowLayout(r,pos);
        const before=G.elemanlar.length,savePush=window.pushH;
        try{window.pushH=()=>{};base.modalOk();}finally{window.pushH=savePush;}
        if(G.elemanlar.length!==before+1)throw Error('160 cm pencere yerleştirilemedi; pano düzeni geri alındı.');
        place(pfRunOf(getSeg(segId)).run,G.elemanlar.at(-1),pos-en/2);
      });
      if(!ok){_mSeg=getSeg(segId);$('mbg').classList.add('open');}else Studio.toast('166 cm pencere panosu oluşturuldu; yan paneller kısaltıldı. Makas aksları korundu.');
      return;
    }
    // A door clicked on an H needs a whole panel centred on that H, not a
    // door shifted into one of the existing panels. Preserve total length by
    // splitting the neighbouring panels at the new boundaries.
    const joint=r.slots.slice(1).find(p=>Math.abs(p.a-pos)<=Math.min(5,8/sc()));
    if(_mT==='kapi'&&joint&&en>0&&en<=PF.PANEL){
      const lo=joint.a-PF.YARIM,hi=joint.a+PF.YARIM;
      if(lo>=r.s0-EPS&&hi<=r.L-r.s1+EPS&&r.items.some(it=>lo>=it.off-EPS&&hi<=it.off+it.L+EPS)){
        const cuts=[r.s0,r.L-r.s1,lo,hi];r.slots.forEach(p=>{if(p.a<lo-EPS||p.a>hi+EPS)cuts.push(p.a);});
        cuts.sort((a,b)=>a-b);const unique=cuts.filter((v,i)=>!i||v-cuts[i-1]>EPS);
        const items=unique.slice(0,-1).map((a,i)=>({w:unique[i+1]-a,key:'door-joint-'+i})),segId=_mSeg.id;
        const ok=Studio.edit(()=>{
          rebuildLayout(r,items,{moveOpenings:false,compact:true});
          const before=G.elemanlar.length,savePush=window.pushH;
          try{window.pushH=()=>{};base.modalOk();}finally{window.pushH=savePush;}
          if(G.elemanlar.length!==before+1)throw Error('H üzerindeki kapı yerleştirilemedi; panel düzeni geri alındı.');
        });
        if(!ok){_mSeg=getSeg(segId);$('mbg').classList.add('open');}
        else Studio.toast('Kapılı tam panel oluşturuldu; uygun kalan yarımlar birleştirildi. Birleşimler ve makas aksları korundu.');
        return;
      }
    }
    const index=r.slots.findIndex(p=>pos>=p.a-EPS&&pos<=p.b+EPS),p=r.slots[index];
    if(!p||p.w>=en-EPS){base.modalOk();return;}
    const neighbour=[index-1,index+1].find(i=>r.slots[i]&&r.slots[i].w>=en-EPS);
    if(neighbour===undefined){base.modalOk();return;}
    const segId=_mSeg.id;let count=1;
    const ok=Studio.edit(()=>{
      const items=pieces(r);[items[index],items[neighbour]]=[items[neighbour],items[index]];
      count=rebuildLayout(r,items).peers;const before=G.elemanlar.length,savePush=window.pushH;
      try{window.pushH=()=>{};base.modalOk();}finally{window.pushH=savePush;}
      if(G.elemanlar.length!==before+1)throw Error('Açıklık yerleştirilemedi; panel değişiklikleri geri alındı.');
    });
    if(!ok){_mSeg=getSeg(segId);$('mbg').classList.add('open');}else Studio.toast('Kapılı/pencereli panel uca alındı; '+count+' hattın H konumları eşleştirildi.');
  };
  function host(cm){
    let best=null;
    pfAnaliz().runs.forEach(r=>{
      const raw=(cm.x-r.ax)*r.ux+(cm.y-r.ay)*r.uy,t=Math.max(0,Math.min(r.L,raw));
      const it=r.items.find(it=>t>=it.off-EPS&&t<=it.off+it.L+EPS);if(!it)return;
      if(G.dragNodeId&&(r.nodes[0].nid===G.dragNodeId||r.nodes.at(-1).nid===G.dragNodeId))return;
      const perpendicular=Math.abs((cm.x-r.ax)*r.uy-(cm.y-r.ay)*r.ux),outside=Math.abs(raw-t);
      const d=Math.hypot(perpendicular,outside);
      // A corner's hit area includes the cap beyond the axis endpoint. Without
      // this, approaching from outside discards the wall and captures the grid.
      const cap=t===0||t===r.L;
      if(d>(cap?it.seg.k:it.seg.k/2)+9/sc())return;if(!best||d<best.d)best={r,it,t,d};
    });return best;
  }
  function snapTargets(){
    if(G.duvarYakala==='custom')return Object.assign({h:false,mid:false,end:false,node:false,nearest:false},G.snapTargets||{});
    return {h:G.duvarYakala!=='serbest',mid:G.duvarYakala==='kilit',end:G.duvarYakala!=='serbest',node:false,nearest:G.duvarYakala==='serbest'};
  }
  function plainSnap(px,py){const enabled=G.snapWall;G.snapWall=false;try{return base.snapPoint(px,py);}finally{G.snapWall=enabled;}}
  function runChoices(r,targets){
    return (targets.h?r.slots.slice(1).map(p=>({t:p.a,label:'H (panel eki)',kind:'H'})):[])
      .concat(targets.mid?r.slots.map(p=>({t:(p.a+p.b)/2,label:'Panel ortası',kind:'mid'})):[],
        targets.end?[{t:0,label:'Duvar köşesi / ucu',kind:'end'},{t:r.L,label:'Duvar köşesi / ucu',kind:'end'}]:[],
        targets.node?r.nodes.filter(n=>G.segs.filter(s=>s.n1===n.nid||s.n2===n.nid).length>=3).map(n=>({t:n.pos,label:'Kesişim düğümü',kind:'node'})):[]);
  }
  window.snapPoint=function(px,py){
    G._snapBlocked=false;G._snapInfo=null;G._snapLbl=null;G._ekKaydir=null;
    G._lastSnapPointer={x:px,y:py};
    if(!isPref()||!G.snapWall)return base.snapPoint(px,py);
    const cm=toCm(px,py);let H=host(cm);
    if(!H){
      const fallback=G.duvarYakala==='custom'?plainSnap(px,py):base.snapPoint(px,py),resolved=host(fallback);
      // Grid and axis snapping can land on a wall even when the pointer is outside its hit area.
      if(resolved&&resolved.d<=resolved.it.seg.k/2+.001)H=resolved;
      else{G._snapLbl=null;if($('snapReadout'))$('snapReadout').textContent=snapModeLabel();return fallback;}
    }
    const {r,it}=H,targets=snapTargets();let free=G.duvarYakala==='serbest'||G.altKey;
    const joints=r.slots.slice(1).map(p=>({t:p.a,label:'H (panel eki)',kind:'H'}));
    const choices=runChoices(r,targets);
    let candidate=choices.length?choices.reduce((best,p)=>Math.abs(p.t-H.t)<Math.abs(best.t-H.t)?p:best):null;
    if(targets.nearest&&(!candidate||Math.abs(candidate.t-H.t)*sc()>12))free=true;
    if(!candidate&&!free){const p=plainSnap(px,py);G._snapLbl=null;return p;}
    if(free){const step=G.altKey?1:(G.freeSnapStep||5);candidate={t:Math.max(0,Math.min(r.L,Math.round(H.t/step)*step)),label:'Serbest · '+step+' cm adım',kind:'free'};}
    let x=r.ax+r.ux*candidate.t,y=r.ay+r.uy*candidate.t;
    G._ekKaydir=null;
    if(G.drawing&&G.drawStart&&!free){
      const sn=getNode(G.drawStart),horizontal=sn&&Math.abs(cm.x-sn.x)>=Math.abs(cm.y-sn.y);
      if(sn){const off=horizontal?y-sn.y:x-sn.x;
        if(Math.abs(off)>.01){
          const degree=G.segs.filter(s=>s.n1===sn.id||s.n2===sn.id).length;
          if(!degree&&!G._basH&&!host(sn))G._ekKaydir=horizontal?{dx:0,dy:off}:{dx:off,dy:0};
          else{G._snapBlocked=true;candidate={...candidate,label:'⚠ H / merkez eksenle hizalı değil · Serbest modu kullanın'};}
        }
      }
    }
    const nearest=joints.length?joints.reduce((b,p)=>Math.abs(p.t-candidate.t)<Math.abs(b.t-candidate.t)?p:b):null;
    const delta=nearest?candidate.t-nearest.t:null;
    const label=candidate.label+(delta!==null&&Math.abs(delta)>.01?' · H '+(delta>0?'+':'')+fmtCm(delta)+' cm':'');
    G._snapInfo={kind:candidate.kind,runId:r.owner.id,pos:candidate.t,delta,blocked:G._snapBlocked};
    G._snapLbl=label;G._snapDuvarK=it.seg.k;G.snapType='duvar';G.snapPt={x,y};
    const node=G.nodes.find(n=>Math.hypot(n.x-x,n.y-y)<.001);G.snapNodeId=node?node.id:null;
    if($('snapReadout'))$('snapReadout').textContent=label;
    return{x,y};
  };
  function snapModeLabel(){return !G.snapWall?'Duvar yakalama kapalı.':G.duvarYakala==='custom'?'Özel: yalnız işaretlediğiniz hedefler kullanılır.':G.duvarYakala==='serbest'?'H kilidi kapalı · '+(G.freeSnapStep||5)+' cm adım.':G.duvarYakala==='h'?'Kilitli: yalnız H birleşimleri ve duvar uçları.':'Kilitli: H, panel merkezi veya köşe.';}
  const beginMove=window.wallDragBegin;
  window.wallDragBegin=function(...args){
    beginMove(...args);const W=G.wallDrag;if(!W||!isPref())return;
    W.makasHedef=[];
    // Use actual joints of walls supporting the moving endpoints, not an unrelated global grid.
    pfAnaliz().runs.forEach(r=>{
      if(r.items.some(it=>W.groupIds.includes(it.seg.id))||Math.abs(r.ux*W.nx+r.uy*W.ny)<.99)return;
      W.ends.forEach(e=>{
        const t=(e.x-r.ax)*r.ux+(e.y-r.ay)*r.uy,d=Math.abs((e.x-r.ax)*r.uy-(e.y-r.ay)*r.ux);
        if(d>.001||t<-.001||t>r.L+.001)return;
        runChoices(r,{h:true,mid:true,end:true,node:true}).forEach(p=>W.makasHedef.push({off:(r.ax+r.ux*p.t-e.x)*W.nx+(r.ay+r.uy*p.t-e.y)*W.ny,kind:p.kind,label:p.label,tam:p.kind==='H'}));
      });
    });
  };
  function refreshSnap(){
    if(G._lastSnapPointer){const p=G._lastSnapPointer;snapPoint(p.x,p.y);if(G.drawing)G.drawPreviewPt=G.snapPt;}
    if($('snapReadout'))$('snapReadout').textContent=G._snapLbl||snapModeLabel();
    draw();
  }
  cv.addEventListener('mousedown',e=>{
    if(e.button===0&&isPref()&&G.tool==='sec'&&G.selectionMode==='panel'){
      const box=cv.getBoundingClientRect(),hit=hitTestAll(e.clientX-box.left,e.clientY-box.top);
      if(hit?.tip==='panel'){
        e.preventDefault();e.stopImmediatePropagation();cv.focus();
        const current=selection().map(s=>ref(s.run,s.panel)),found=resolve(hit.obj),anchor=resolve(G.panelAnchor);
        let next;
        if(e.shiftKey&&anchor&&found&&anchor.run.owner.id===found.run.owner.id){
          const lo=Math.min(anchor.index,found.index),hi=Math.max(anchor.index,found.index);
          next=found.run.slots.slice(lo,hi+1).map(p=>ref(found.run,p));
        }else if(e.ctrlKey||e.metaKey||e.shiftKey){next=current.some(p=>p.id===hit.obj.id)?current.filter(p=>p.id!==hit.obj.id):current.concat(hit.obj);}
        else next=[hit.obj];
        if(!e.shiftKey)G.panelAnchor=hit.obj;
        G.selPanels=next;G.secili=next.at(-1)||null;G.seciliTip=next.length?'panel':null;G.selSegs=[];G.dragging=false;G.snapPt=null;
        updateSidebar();draw();return;
      }
      G.selPanels=[];G.panelAnchor=null;
    }
    if(e.button!==0||!isPref()||!cizimAraci())return;
    const b=cv.getBoundingClientRect();snapPoint(e.clientX-b.left,e.clientY-b.top);
    if(G._snapBlocked){e.preventDefault();e.stopImmediatePropagation();Studio.toast('Bu H/panel merkezi başlangıçla aynı eksende değil. Başlangıcı hizalayın veya Serbest yakalamayı açın.',true);}
  },true);
  // Panel edits never move roof trusses. Only explicit user overrides can do so.
  window.makasAnalizBina=function(dis,Y){
    const result=base.makasAnalizBina(dis,Y);if(!result||!isPref())return result;
    const comp=_bilesenler(),component=comp[dis[0]?.n1],a=Y?'x':'y';
    const positions=result.makaslar.map(m=>{const edit=(G.trussOverrides||[]).find(e=>e.axis===a&&comp[e.nodeId]===component&&Math.abs(e.from-m.pos)<EPS);return {from:m.pos,pos:edit?edit.to:m.pos};}).sort((x,y)=>x.pos-y.pos);
    result.makaslar=positions.map((entry,i)=>{const q=entry.pos;
      const crosses=[];dis.forEach(s=>{const u=getNode(s.n1),v=getNode(s.n2),ua=Y?u.x:u.y,va=Y?v.x:v.y,ud=Y?u.y:u.x,vd=Y?v.y:v.x;
        if(Math.abs(ua-va)<EPS){if(Math.abs(q-ua)<.1)crosses.push(ud,vd);}
        else if(q>=Math.min(ua,va)-EPS&&q<=Math.max(ua,va)+EPS)crosses.push(ud+(vd-ud)*(q-ua)/(va-ua));});
      if(crosses.length<2)return null;const low=Math.min(...crosses),high=Math.max(...crosses);return{no:i+1,pos:q,a:low,b:high,acik:high-low,aralik:i?q-positions[i-1].pos:0,defaultPos:entry.from,nodeId:dis[0].n1,axis:a,lo:result.lo,hi:result.hi,manual:Math.abs(q-entry.from)>EPS};
    }).filter(Boolean);
    return result;
  };
  function trussMove(reset=false){
    const m=makasAnaliz()?.makaslar[+$('trussSelect').value];if(!m)return false;
    const raw=$('trussPosition').value.trim().replace(',','.');const to=reset?m.defaultPos:Number(raw);
    if(!reset&&(!raw||!Number.isFinite(to)||to<m.lo||to>m.hi)){Studio.toast('Makas konumu '+fmtCm(m.lo)+'–'+fmtCm(m.hi)+' cm arasında olmalı.',true);return false;}
    const comp=_bilesenler();
    if(makasAnaliz().makaslar.some(other=>other!==m&&comp[other.nodeId]===comp[m.nodeId]&&Math.abs(other.defaultPos-m.defaultPos)>EPS&&Math.abs(other.pos-to)<.6)){Studio.toast('Bu konumda başka bir makas var.',true);return false;}
    return Studio.edit(()=>{G.trussOverrides=(G.trussOverrides||[]).filter(e=>!(e.axis===m.axis&&comp[e.nodeId]===comp[m.nodeId]&&Math.abs(e.from-m.defaultPos)<EPS));if(Math.abs(to-m.defaultPos)>EPS)G.trussOverrides.push({nodeId:m.nodeId,axis:m.axis,from:m.defaultPos,to});});
  }
  function trussSelect(){const m=makasAnaliz()?.makaslar[+$('trussSelect').value];if(m)$('trussPosition').value=fmtCm(m.pos);}
  function issues(){
    if(!isPref()||!G.segs.length)return[];
    const A=pfAnaliz(),list=[];
    A.runs.forEach(r=>openings(r).forEach(o=>{if(!r.slots.some(p=>o.a>=p.a-EPS&&o.b<=p.b+EPS))list.push({level:'warning',code:'opening-joint',message:'Açıklık bir panel ekini aşıyor. Panel sırasını düzenleyin.',id:o.e.id,type:'eleman'});}));
    const M=makasAnaliz();if(!M)return list;
    A.runs.filter(r=>axis(r)).forEach(r=>{
      const a=axis(r),lo=origin(r)+r.s0,hi=origin(r)+r.L-r.s1,normal=a==='x'?r.ay:r.ax;
      const bad=M.makaslar.filter(m=>(m.axis||(M.yatay?'x':'y'))===a&&m.pos>lo+.6&&m.pos<hi-.6&&normal>=m.a-.6&&normal<=m.b+.6&&!r.slots.slice(1).some(p=>Math.abs(origin(r)+p.a-m.pos)<.6));
      if(bad.length)list.push({level:'warning',code:'truss-support',message:bad.length+' makas bu hattın H noktasına oturmuyor. Panel eşleşmesini kontrol edin.',id:r.owner.id,type:'seg'});
    });return list;
  }
  function syncUI(){
    if(!$('selectionMode'))return;
    $('selectionMode').hidden=!isPref();$('selectionMode').value=G.selectionMode||'wall';
    const targets=snapTargets();
    $('freeSnapStep').value=String(G.freeSnapStep||5);$('freeSnapStep').disabled=!G.snapWall||!targets.nearest;
    $('freeSnapRow').hidden=!isPref();$('yakalaSel').value=G.duvarYakala;$('wallSnapEnabled').checked=G.snapWall;
    document.querySelectorAll('[data-snap-target]').forEach(input=>input.checked=!!targets[input.dataset.snapTarget]);
    if($('moveAlign')){$('moveAlign').checked=!!G.moveAlign;$('moveModule').checked=!!G.moveModule;}
    if(!G._lastSnapPointer)$('snapReadout').textContent=snapModeLabel();
    if($('trussSelect')){
      const list=isPref()?(makasAnaliz()?.makaslar||[]):[],sel=$('trussSelect');
      const html=list.map((m,i)=>'<option value="'+i+'">'+(m.zoneName?esc(m.zoneName)+' · ':'')+'M'+m.no+' · '+fmtCm(m.pos)+' cm'+(m.manual?' · elle':'')+(m.supported===false?' · mesnet kontrolü':'')+'</option>').join('');
      if(sel.innerHTML!==html){const value=sel.value;sel.innerHTML=html;if(list[+value])sel.value=value;trussSelect();}
      $('trussEditor').hidden=!isPref();$('trussMove').disabled=!list.length;$('trussReset').disabled=!list.length;
    }
  }
  window.metrajKalemleri=function(){
    const original=base.metrajKalemleri();if(!isPref())return original;
    const groups=new Map(),lengths=new Map(),A=pfAnaliz();
    A.runs.forEach(r=>{
      r.slots.forEach(p=>{const grup='Paneller — '+(p.dis?'Dış':'İç')+' duvar ('+p.k+' cm)',kind={tam:'Tam panel',yarim:'Yarım panel',ozel:'Özel panel'}[p.tip],kalem=(p.acik==='kapi'?'Kapılı ':p.acik==='pencere'?'Pencereli ':'')+(p.acik?kind.toLocaleLowerCase('tr'):kind),olcu=fmtCm(p.w).replace('.',',')+' cm',key=[grup,kalem,olcu].join('|');const row=groups.get(key)||{grup,kalem,olcu,birim:'adet',adet:0};row.adet++;groups.set(key,row);});
      r.items.forEach(it=>{const kalem=(it.seg.dis?'Dış':'İç')+' duvar',olcu=it.seg.k+' cm',key=kalem+'|'+olcu,row=lengths.get(key)||{grup:'Duvar uzunlukları',kalem,olcu,birim:'m',adet:0};row.adet+=it.L/100;lengths.set(key,row);});
    });
    return [...groups.values()].sort((a,b)=>a.grup.localeCompare(b.grup,'tr')).concat([...lengths.values()].map(r=>({...r,adet:Math.round(r.adet*100)/100})),original.filter(r=>!r.grup.startsWith('Paneller —')&&r.grup!=='Duvar uzunlukları'));
  };
  window.Prefab={quick,resolve,linked,swap,swapLocal,split,merge,mergeSelected,makeFull,fitWideWindow,remove,issues,rebuildLayout,reorientProduction,snapTargets,trussMove,trussSelect,
    select(ownerId,index){const r=pfAnaliz().runs.find(r=>r.owner.id===ownerId||r.items.some(it=>it.seg.id===ownerId));if(r?.slots[index])select(r,r.slots[index]);},
    mode(value){G.selectionMode=value;G.secili=null;G.seciliTip=null;G.selPanels=[];G.panelAnchor=null;G.selSegs=[];setTool('sec');updateSidebar();draw();}
  };
  G.selectionMode=G.selectionMode||'wall';G.panelSync=G.panelSync!==false;G.freeSnapStep=G.freeSnapStep||5;G.opt.dis=G.opt.dis||10;PF.DIS=G.opt.dis;
  const mode=document.createElement('select');mode.id='selectionMode';mode.className='ss';mode.setAttribute('aria-label','Seçim türü');mode.innerHTML='<option value="wall">Duvar seçimi</option><option value="panel">Panel seçimi</option>';mode.onchange=()=>Prefab.mode(mode.value);$('t-sec').after(mode);
  const row=document.createElement('div');row.id='freeSnapRow';row.className='free-snap-row';row.innerHTML='<label class="field-label" for="freeSnapStep">Serbest yakalama adımı</label><select id="freeSnapStep" class="si full" onchange="G.freeSnapStep=+this.value;draw()"><option value="1">1 cm</option><option value="5">5 cm</option><option value="10">10 cm</option></select><p id="snapReadout" class="panel-help">Kilitli: H, panel merkezi veya köşe.</p>';$('yakalaSel').after(row);
  $('yakalaSel').innerHTML='<option value="h">Yalnız H birleşimi ve köşe</option><option value="kilit">H birleşimi + panel ortası</option><option value="serbest">Serbest · H kilidi kapalı</option><option value="custom">Özel · çoklu seçim</option>';
  const targetsBox=document.createElement('fieldset');targetsBox.id='snapTargets';targetsBox.className='snap-targets';targetsBox.innerHTML='<legend>Yakalama hedefleri · çoklu seçim</legend>'+Object.entries({h:'H birleşimi',mid:'Panel ortası',end:'Uç / köşe',node:'Kesişim düğümü',nearest:'Duvar üzerinde serbest'}).map(([key,label])=>'<label><input type="checkbox" data-snap-target="'+key+'"> '+label+'</label>').join('')+'<p class="panel-help">Serbest seçilirse H dışına da yerleşebilirsiniz. Izgara, alt çubuktan ayrıca açılır/kapanır.</p><label><input id="moveAlign" type="checkbox"> Taşırken düğüm hizası</label><label><input id="moveModule" type="checkbox"> Taşırken modüler aralık</label>';
  $('yakalaSel').after(targetsBox);
  targetsBox.onchange=e=>{const key=e.target.dataset.snapTarget;if(key){G.snapTargets={...snapTargets(),[key]:e.target.checked};G.duvarYakala='custom';}else G[e.target.id]=e.target.checked;refreshSnap();};
  $('yakalaSel').onchange=function(){G.duvarYakala=this.value;G.snapWall=true;refreshSnap();};
  $('freeSnapStep').onchange=function(){G.freeSnapStep=+this.value;refreshSnap();};
  const toggle=document.createElement('label');toggle.className='field-label';toggle.innerHTML='<input id="wallSnapEnabled" type="checkbox"> Duvar yakalama açık';$('yakalaSel').before(toggle);
  $('wallSnapEnabled').onchange=function(){G.snapWall=this.checked;refreshSnap();};
  const trussEditor=document.createElement('div');trussEditor.id='trussEditor';trussEditor.className='sb';trussEditor.innerHTML='<div class="sb-t">Makas yerleşimi</div><p class="panel-help">Otomatik aks: 125,5 cm. Panel ve kapı düzenlemesi makasları taşımaz.</p><label class="field-label" for="trussSelect">Taşınacak makas</label><select id="trussSelect" class="si full" onchange="Prefab.trussSelect()"></select><label class="field-label" for="trussPosition">Yeni aks koordinatı (cm)</label><input id="trussPosition" class="si full" type="text" inputmode="decimal"><div class="panel-actions"><button id="trussMove" class="sib" onclick="Prefab.trussMove()">Konuma taşı</button><button id="trussReset" class="sib" onclick="Prefab.trussMove(true)">Otomatik aksa dön</button></div><p class="panel-help">Konum çizim başlangıcına göredir. Elle taşıdıktan sonra H mesnet uyumunu Plan kontrolünden inceleyin.</p>';
  document.querySelector('.view-options').parentElement.after(trussEditor);
  const toggleSnap=window.toggleSnapW;window.toggleSnapW=function(){toggleSnap();refreshSnap();};
  document.querySelector('.inspector-footer>span:last-child').textContent='v5.9.98';syncUI();draw();
})();
