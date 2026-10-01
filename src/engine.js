
// ═══════════════════════════════════════════════════════════════════════
// WALL GRAPH ENGINE — Professional Floor Plan Architecture
// ═══════════════════════════════════════════════════════════════════════
//
// Veri modeli:
//   nodes[]  : {id, x, y}                  — düğüm noktaları
//   segs[]   : {id, n1, n2, k, elemanlar}  — duvar segmentleri
//   rooms[]  : {id, nodeIds[], tip, ad, ...} — kapalı polygon odalar
//   elemanlar[]: {id, segId, t, en, yuk, tip_, ...} — kapı/pencere
//
// Her çizimde:
//   1. Tüm segmentler render edilir
//   2. Her segment-segment birleşiminde miter hesaplanır
//   3. Kapalı polygon odalar detect edilir
//   4. Kapı/pencereler segment üzerindeki t parametresiyle konumlanır
// ═══════════════════════════════════════════════════════════════════════

var cv=document.getElementById('cv');
var ctx=cv.getContext('2d');
var cwrap=document.getElementById('cwrap');

var G={
  tool:'sec',gridCm:10,snapGrid:true,snapWall:true,sistem:'celik',duvarYakala:'h',pnlEtiket:true,catiYon:'yatay',makasGoster:true,olcuModu:'panel',
  scale:1.5,zoom:1,pan:{x:100,y:80},
  defaultK:14, // varsayılan duvar kalınlığı cm
  nodes:[],segs:[],rooms:[],elemanlar:[],
  secili:null,seciliTip:null, // tip: 'node','seg','room','eleman'
  hist:[],
  // Çizim state
  drawing:false,       // duvar çizimi aktif mi
  drawChain:false,     // zincirleme çizim (bir bitiş diğerinin başlangıcı)
  drawStart:null,      // başlangıç node id
  drawPreviewPt:null,  // mouse konumu (preview için)
  shiftLock:false,lockAxis:null,
  // Sürükleme
  dragging:false,dragNodeId:null,dragMidSeg:null,dragMidMode:null,
  dragEleman:null,dragElGrab:0,elStep:5,dimDrag:null,lblDrag:null,_lblHits:[],seciliDimRow:null,_dimHits:[],
  // Pan
  panning:false,panSt:null,panOrig:null,
  // Snap
  snapPt:null,snapType:null,snapNodeId:null,
};
var ID=1;function uid(){return 'e'+(ID++);}

// ═══ DUVAR KALINLIK ═════════════════════════════════════════════════════
var DK=[6,8,10,12,14,15,18,20];
// ═══ PREFABRİK PANEL SİSTEMİ ═════════════════════════════════════════════
// Prefabrik evler hazır panellerle kurulur: tam panel 125,5 cm, yarım panel 62,75 cm.
// Dış/iç duvar kalınlıkları proje ayarlarından 6, 10 veya 15 cm seçilir. Bu modda:
//  • Izgara modülü 62,75 cm (yarım panel) → duvar boyları panel katı çıkar
//  • Duvar kalınlığı dış/iç'e göre otomatik 10/6 (elle değiştirilen duvar sabit kalır)
//  • Her duvar panellere bölünür: derz çizgileri, modül dışı kalan parça kırmızı
//  • Kapı/pencere panel yuvasına ortalanır; panel metrajı kenar çubuğunda
var PF={PANEL:125.5,YARIM:62.75,DIS:10,IC:6};
var DK_CELIK=[6,8,10,12,14,15,18,20],DK_PREF=[6,10,15];
// Türkçe ek: 6'lık, 10'luk, 8'lik, 14'lük …
// Bağlantı adı: "10/6 Üçlü H", "6/6 Dörtlü H", "10'luk H", "6'lık Çektirme U", "10'luk Köşe direği"
function bagAd(tip,k,uzun){
  if(tip==='H3')return k+' Üçlü H'+(uzun?' (T birleşim, panel ekinde)':'');
  if(tip==='X')return k+' Dörtlü H'+(uzun?' (çapraz birleşim)':'');
  var sz=k&&k.indexOf('/')<0?k+lukEki(k)+' ':(k?k+' ':'');
  if(tip==='H')return sz+'H'+(uzun?' (yan yana iki panel)':'');
  if(tip==='U')return sz+'Çektirme U';
  if(tip==='kose')return sz+'Köşe direği';
  return '⚠ Özel birleşim ('+k+')';
}
function lukEki(v){
  var n=parseInt(String(v).split('/').pop(),10);if(isNaN(n))return "'lik";
  var b=n%10,o=Math.floor(n/10)%10;
  var bir=['','lik','lik','lük','lük','lik','lık','lik','lik','luk'],on=['','luk','lik','luk','lık','lik','lık','lik','lik','lık'];
  return "'"+(b?bir[b]:(on[o]||'lik'));
}
function isPref(){return G.sistem==='prefabrik';}
function fmtCm(v){ // 376.5 / 62.75 / 250
  var r=Math.round(v*100)/100;
  if(Math.abs(r-Math.round(r))<0.005)return String(Math.round(r));
  return String(r).replace(/0+$/,'');
}

// Duvarın panel dizilimi: n1'den başlayarak tam paneller, sonda yarım panel, kalan = özel kesim

// Kapı/pencere hangi yuvalarda? → yuva tipini 'kapi'/'pencere' yap


// Derz çizgileri + modül dışı parça vurgusu (duvarların üstüne)
// Duvarın panel dizilimi. ters=false: n1'den tam paneller, yarım panel sonda; ters=true: yarım panel başta


// Panel kodu: T tam, Y yarım, K kapılı, P pencereli

// Planın tamamında panel numaraları (üstten alta, soldan sağa) → çizimde ve listede aynı numara


// ═══ PREFABRİK MOTORU: DUVAR HATLARI, PANELLER, BAĞLANTILAR ══════════════
// Panel dizilimi segment bazında değil, DUVAR HATTI bazında yapılır: aynı doğrultuda devam eden
// segmentler (T birleşim node'larıyla bölünmüş olsa bile) tek hat sayılır. Böylece bir T birleşim
// panel ekine denk gelirse ÜÇLÜ H, panelin ortasına denk gelirse ÇEKTİRME U olarak sayılır.
//   Bağlantılar:  panel eki → H (ikili) · T birleşim ekte → Üçlü H · T birleşim panel ortasında → Çektirme U
//                 köşe (L) → Köşe direği · çapraz (X) → işaretlenir · boşta biten duvar ucu → Serbest uç
//   Paneller:     Tam 125,5 · Yarım 62,75 · Özel (≤125,5, ölçüsü serbest) · Kapılı / Pencereli
var PF_TOL=1.0;
function pfRuns(){
  var segs=G.segs.filter(function(s){return s.tip!=='veranda'&&getNode(s.n1)&&getNode(s.n2)&&_segLen(s)>=1;});
  var at={};
  segs.forEach(function(s){(at[s.n1]=at[s.n1]||[]).push(s);(at[s.n2]=at[s.n2]||[]).push(s);});
  function yon(s,nid){var a=getNode(nid),b=getNode(s.n1===nid?s.n2:s.n1),L=dist(a.x,a.y,b.x,b.y);return{x:(b.x-a.x)/L,y:(b.y-a.y)/L};}
  function duzDevam(s,nid){ // nid'den s'nin tam karşısına devam eden segment
    // An exterior corner post terminates the exterior run. A collinear
    // interior wall connects to the post with U; it is not its continuation.
    var connected=at[nid]||[],outside=connected.filter(function(q){return q.dis;});
    if(outside.length===2&&connected.some(function(q){return !q.dis;})){
      var u=yon(outside[0],nid),v=yon(outside[1],nid);
      if(Math.abs(u.x*v.x+u.y*v.y)<0.99)return null;
    }
    var d=yon(s,nid),best=null;
    (at[nid]||[]).forEach(function(o){if(o===s)return;var e=yon(o,nid);if(e.x*d.x+e.y*d.y<-0.9986)best=o;});
    return best;
  }
  var used={},runs=[];
  segs.forEach(function(s){
    if(used[s.id])return;
    // geriye doğru hattın başına git
    var cur=s,node=s.n1,g=0;
    while(g++<500){var p=duzDevam(cur,node);if(!p||used[p.id]||p===s)break;cur=p;node=(p.n1===node?p.n2:p.n1);}
    // ileri doğru topla
    var items=[],startNode=node,n=node,c=cur;g=0;
    while(c&&!used[c.id]&&g++<500){
      used[c.id]=true;
      var other=c.n1===n?c.n2:c.n1;
      items.push({seg:c,from:n,to:other,L:_segLen(c)});
      n=other;c=duzDevam(c,n);
    }
    var A=getNode(startNode),B=getNode(n);
    // kanonik yön: soldan sağa, üstten alta
    if(B.x<A.x-0.01||(Math.abs(B.x-A.x)<=0.01&&B.y<A.y)){
      items.reverse();items.forEach(function(it){var t=it.from;it.from=it.to;it.to=t;});var T=A;A=B;B=T;
    }
    var off=0,nodes=[{nid:items[0].from,pos:0}];
    items.forEach(function(it){it.off=off;it.rev=(it.seg.n1!==it.from);off+=it.L;nodes.push({nid:it.to,pos:off});});
    var L=off,ux=(B.x-A.x)/L,uy=(B.y-A.y)/L;
    var configured=items.find(function(it){return !!it.seg.pnlCfg;});
    var owner=configured?configured.seg:items[0].seg;
    var disL=items.reduce(function(a,it){return a+(it.seg.dis?it.L:0);},0);
    runs.push({items:items,nodes:nodes,L:L,ax:A.x,ay:A.y,ux:ux,uy:uy,owner:owner,dis:disL>=L/2,
      cfg:owner.pnlCfg||(owner.pnlTers?{ters:true}:null)});
  });
  return runs;
}
function _pfTip(w){
  if(Math.abs(w-PF.PANEL)<0.6)return 'tam';
  if(Math.abs(w-PF.YARIM)<0.6)return 'yarim';
  return 'ozel';
}
// Parçada kapı/pencere varsa: tam olmayan paneli (yarım/özel) başka sıraya alarak açıklığın
// bir TAM panele (veya kendisini alacak kadar geniş panele) oturmasını sağla.
// Örn. 125,5 + 62,75'lik duvarda kapı alttaysa → 62,75 + 125,5 olur, yarım panel üste geçer.
function pfKapiyaGoreDiz(run,parca,P0){
  if(parca.length<2)return parca;
  var els=[];
  run.items.forEach(function(it){G.elemanlar.forEach(function(e){
    if(e.segId!==it.seg.id)return;
    var s0=e.t*it.L,c=(it.rev?it.off+(it.L-s0-e.en):it.off+s0)+e.en/2-P0;
    els.push({c:c,en:e.en,kapi:e.tip_==='kapi'});
  });});
  var U=parca[parca.length-1].b;
  els=els.filter(function(e){return e.c>0&&e.c<U;});
  if(!els.length)return parca;
  var ws=parca.map(function(p){return p.b-p.a;});
  var tek=ws.map(function(w,i){return _pfTip(w)!=='tam'?i:-1;}).filter(function(i){return i>=0;});
  if(tek.length!==1)return parca; // yalnız tek tam-dışı parça varsa yer değiştir (basit ve öngörülebilir)
  var ti=tek[0],tw=ws[ti],best=null,bs=-1;
  for(var pos=0;pos<ws.length;pos++){
    var arr=ws.filter(function(w,i){return i!==ti;});arr.splice(pos,0,tw);
    var x=0,sl=arr.map(function(w){var o={a:x,b:x+w};x+=w;return o;}),sc2=0;
    els.forEach(function(e){
      var p=sl.find(function(q){return e.c>=q.a&&e.c<=q.b;});
      if(p&&p.b-p.a>=e.en-0.5){sc2+=2;if(e.kapi&&_pfTip(p.b-p.a)==='tam')sc2+=1;}
      // açıklık ortası panel ekine çok yakınsa küçük ceza
      if(p)sc2-=Math.max(0,(e.en/2-Math.min(e.c-p.a,p.b-e.c)))/200;
    });
    if(sc2>bs+1e-9||(Math.abs(sc2-bs)<1e-9&&pos===ti)){bs=sc2;best=sl;}
  }
  return best||parca;
}
function pfDizilim(run){
  var L=run.L,cfg=run.cfg,sl=[];
  var s0=run.s0||0,s1=run.s1||0,A0=s0,A1=L-s1,U=A1-A0; // panel dizilecek aralık (birleşim yüzleri arası)
  run.cfgHata=false;
  if(cfg&&cfg.dizi&&cfg.dizi.length){
    var top=cfg.dizi.reduce(function(a,b){return a+b;},0),x=A0;
    if(top<=U+0.6){
      cfg.dizi.forEach(function(w){sl.push({a:x,b:x+w});x+=w;});
      // Extending a configured wall creates further manufactured panels, never
      // one arbitrary-length remainder spanning several full panel modules.
      while(A1-x>0.6){var next=Math.min(A1,x+PF.PANEL);sl.push({a:x,b:next,oto:true});x=next;}
    } else run.cfgHata=true;
  }
  // Makas yönüne PARALEL duvarlar (dış ve iç) makas ızgarasına hizalanır: ekler, makasların
  // atıldığı 125,5'lik ızgaraya denk gelir, uçtaki paneller kırpılır (ör. 120,5 / 122,5).
  // Makasa DİK duvarlar birleşim yüzünden tam panelle başlar, kalan sonda kalır.
  var ortak=Number.isFinite(run.panelOrg);
  var izg=(cfg&&cfg.izgara!==undefined)?cfg.izgara:(!!run.makasParalel||ortak);
  run.izgaraEtkin=izg;
  if(!sl.length&&izg&&!(cfg&&cfg.ters)){
    var Y=ortak?Math.abs(run.ux)>.999:catiYatay(),st=Y?run.ax:run.ay,dir=Y?run.ux:run.uy,org=ortak?run.panelOrg:(run.makasOrg!==undefined?run.makasOrg:(G._makasLo||0));
    if(Math.abs(Math.abs(dir)-1)>0.01){dir=1;st=0;org=0;} // makasa paralel değilse hattın başından
    var j=[A0];
    // hat koordinatı pos ↔ dünya koordinatı st+dir*pos ; ızgara: org + n*125,5
    var cand=[];
    var w0=st+dir*A0,w1=st+dir*A1,wa=Math.min(w0,w1),wb=Math.max(w0,w1);
    for(var n=Math.ceil((wa-org)/PF.PANEL-1e-6);org+n*PF.PANEL<=wb+1e-6;n++){
      var pos=(org+n*PF.PANEL-st)/dir;
      if(pos>A0+0.6&&pos<A1-0.6)cand.push(pos);
    }
    cand.sort(function(a,b){return a-b;}).forEach(function(p){j.push(p);});
    j.push(A1);
    for(var q=0;q<j.length-1;q++)sl.push({a:j[q],b:j[q+1]});
  }
  if(!sl.length){
    // Çizerken tıklanan ara noktalar (dalı olmayan düz node'lar) panel eki sayılır → çizdiğiniz sıra korunur
    var kes=[A0];(run.kirilim||[]).forEach(function(p){
      if(p<=A0+1||p>=A1-1)return;
      var q=(p-A0)/PF.YARIM;if(Math.abs(q-Math.round(q))*PF.YARIM<=0.6)kes.push(p); // 62,75 katıysa
    });kes.push(A1);
    for(var pi=0;pi<kes.length-1;pi++){
      var P0=kes[pi],UU=kes[pi+1]-P0,eps=0.6,x2=0,nT=Math.floor((UU+eps)/PF.PANEL),parca=[];
      for(var i=0;i<nT;i++){parca.push({a:x2,b:Math.min(UU,x2+PF.PANEL)});x2+=PF.PANEL;}
      // Tam panellerden sonra kalan tek parça: ~62,75 ise yarım panel, değilse tek özel panel (ör. 122,5)
      if(UU-x2>eps)parca.push({a:x2,b:UU});
      if(cfg&&cfg.ters)parca=parca.map(function(s){return{a:UU-s.b,b:UU-s.a};}).reverse();
      parca=pfKapiyaGoreDiz(run,parca,P0);
      parca.forEach(function(s){sl.push({a:s.a+P0,b:s.b+P0});});
    }
  }
  // Explicit user layouts never silently merge manufactured panel objects.
  // Kapı/pencere sığmadığı panele düştüyse komşu panelle birleştir (örn. yarım + yarım → tam kapılı panel)
  if(!(cfg&&cfg.explicit))run.items.forEach(function(it){G.elemanlar.forEach(function(e){
    if(e.segId!==it.seg.id)return;
    var s0e=e.t*it.L,r0=it.rev?it.off+(it.L-s0e-e.en):it.off+s0e,c=r0+e.en/2;
    var ix=-1;for(var q=0;q<sl.length;q++){if(c>=sl[q].a-0.01&&c<=sl[q].b+0.01){ix=q;break;}}
    if(ix<0||sl[ix].b-sl[ix].a>=e.en-0.5)return;
    var sec=null;
    [ix-1,ix+1].forEach(function(j){
      if(j<0||j>=sl.length)return;var a=Math.min(sl[ix].a,sl[j].a),b=Math.max(sl[ix].b,sl[j].b);
      if(b-a<=PF.PANEL+0.6&&b-a>=e.en-0.5&&r0>=a-0.5&&r0+e.en<=b+0.5)if(!sec||Math.abs(b-a-PF.PANEL)<Math.abs(sec.b-sec.a-PF.PANEL))sec={j:j,a:a,b:b};
    });
    if(!sec)[ix-1,ix+1].forEach(function(j){ // açıklık sığmıyorsa en azından tam panel olacak birleşmeyi seç
      if(sec||j<0||j>=sl.length)return;var a=Math.min(sl[ix].a,sl[j].a),b=Math.max(sl[ix].b,sl[j].b);
      if(b-a<=PF.PANEL+0.6&&b-a>=e.en-0.5)sec={j:j,a:a,b:b};
    });
    if(sec){var lo=Math.min(ix,sec.j);sl.splice(lo,2,{a:sec.a,b:sec.b});}
  });});
  sl.forEach(function(s){s.w=s.b-s.a;s.tip=_pfTip(s.w);});
  run.items.forEach(function(it){
    G.elemanlar.forEach(function(e){
      if(e.segId!==it.seg.id)return;
      var s0e=e.t*it.L,s1e=s0e+e.en;
      var r0=it.rev?it.off+(it.L-s1e):it.off+s0e,r1=r0+e.en;
      sl.forEach(function(p){if(p.b-0.5>r0&&p.a+0.5<r1){p.acik=e.tip_;p.el=e;}});
    });
  });
  sl.forEach(function(p){
    var m=(p.a+p.b)/2,it=run.items.find(function(q){return m>=q.off-0.01&&m<=q.off+q.L+0.01;})||run.items[0];
    p.dis=!!it.seg.dis;p.k=it.seg.k;
  });
  return sl;
}
function panelKod(p){return p.acik==='kapi'?'K':p.acik==='pencere'?'P':p.tip==='yarim'?'Y':p.tip==='ozel'?'Ö':'T';}
// Köşede (L) hangi duvar devam eder? Varsayılan: yatay olan (görseldeki gibi: yatay duvar aksa kadar,
// dikey duvar yatayın iç yüzünden başlar). Node'da koseTers=true ise tersi.
function _koseAna(r1,r2,nid){
  // Makas yönüne paralel duvar köşede devam eder
  var n=getNode(nid),par1=catiYatay()?Math.abs(r1.uy)<=Math.abs(r2.uy):Math.abs(r1.ux)<=Math.abs(r2.ux);
  var ana=par1?r1:r2;
  if(n&&n.koseTers)ana=(ana===r1?r2:r1);
  return ana;
}
function pfAnaliz(){
  var runs=pfRuns();
  function kAt(run,pos){var it=run.items.find(function(q){return pos>=q.off-0.01&&pos<=q.off+q.L+0.01;})||run.items[0];return it.seg.k;}
  function kUc(run,nid){return (run.items[0].from===nid?run.items[0]:run.items[run.items.length-1]).seg.k;}
  function kEt(a,b){return a===b?String(a):Math.max(a,b)+'/'+Math.min(a,b);}
  // 1) node → hatlar
  var ni={};
  runs.forEach(function(r){
    r.nodes.forEach(function(nd,i){
      var o=ni[nd.nid]=ni[nd.nid]||{thru:[],ends:[]};
      if(i===0||i===r.nodes.length-1)o.ends.push(r);else o.thru.push({run:r,pos:nd.pos});
    });
  });
  // 2) uç payları: birleşen duvar, karşı duvarın YÜZÜNDEN başlar (yarım kalınlık kadar kısalır)
  function cornerPost(o,nid){
    if(o.thru.length)return null;
    var exterior=o.ends.filter(function(r){var it=r.items[0].from===nid?r.items[0]:r.items[r.items.length-1];return it.seg.dis;});
    if(exterior.length!==2||o.ends.length<3)return null;
    if(Math.abs(exterior[0].ux*exterior[1].ux+exterior[0].uy*exterior[1].uy)>.99)return null;
    return {exterior:exterior,interior:o.ends.filter(function(r){return exterior.indexOf(r)<0;})};
  }
  runs.forEach(function(r){
    r.s0=0;r.s1=0;r.f0=0;r.f1=0; // f: ölçü zincirinin uç yüzü (aks ucundan içeri +, dışarı −)
    [[r.nodes[0].nid,'s0','f0'],[r.nodes[r.nodes.length-1].nid,'s1','f1']].forEach(function(e){
      var o=ni[e[0]];if(!o)return;
      var post=cornerPost(o,e[0]);
      if(post){
        if(post.exterior.indexOf(r)>=0){
          var other=post.exterior[0]===r?post.exterior[1]:post.exterior[0];
          if(_koseAna(r,other,e[0])!==r)r[e[1]]=kUc(other,e[0])/2;
          r[e[2]]=-kUc(other,e[0])/2;
        }else{r[e[1]]=Math.max.apply(null,post.exterior.map(function(q){return kUc(q,e[0]);}))/2;r[e[2]]=r[e[1]];}
        return;
      }
      if(o.thru.length){r[e[1]]=kAt(o.thru[0].run,o.thru[0].pos)/2;r[e[2]]=r[e[1]];return;} // T/X: ana duvarın yüzü
      if(o.ends.length===2){ // L köşe
        var dig=o.ends[0]===r?o.ends[1]:o.ends[0];
        if(_koseAna(r,dig,e[0])!==r)r[e[1]]=kUc(dig,e[0])/2;
        r[e[2]]=-kUc(dig,e[0])/2; // köşede ölçü binanın dış yüzüne kadar
        return;
      }
      if(o.ends.length>=3){var m=0;o.ends.forEach(function(x){if(x!==r)m=Math.max(m,kUc(x,e[0]));});r[e[1]]=m/2;}
    });
  });
  // 3) makas ızgarası başlangıcı (makas yönündeki ilk dış duvar aksı) + paralellik
  var Yc=catiYatay(),lo=Infinity,comp=_bilesenler(),cLo={};
  G.segs.forEach(function(sg){if(!sg.dis||sg.tip==='veranda')return;[getNode(sg.n1),getNode(sg.n2)].forEach(function(n){if(!n)return;var v=Yc?n.x:n.y;lo=Math.min(lo,v);var c=comp[n.id];cLo[c]=Math.min(cLo[c]===undefined?Infinity:cLo[c],v);});});
  // An open/new component may not yet have classified exterior walls.
  // Its grid must still start at its own extent, not at another building or zero.
  var openLo={};
  G.segs.forEach(function(sg){if(sg.tip==='veranda')return;[getNode(sg.n1),getNode(sg.n2)].forEach(function(n){var c=comp[n.id],v=Yc?n.x:n.y;openLo[c]=Math.min(openLo[c]===undefined?Infinity:openLo[c],v);});});
  Object.keys(openLo).forEach(function(c){if(cLo[c]===undefined)cLo[c]=openLo[c];});
  G._makasLo=isFinite(lo)?lo:0;
  // her binanın makas ızgarası kendi ilk dış duvar aksından başlar
  G._compLo={};G.nodes.forEach(function(n){var v=cLo[comp[n.id]];if(v!==undefined)G._compLo[n.id]=v;});
  runs.forEach(function(r){var v=G._compLo[r.nodes[0].nid];r.makasOrg=(v!==undefined)?v:G._makasLo;});
  runs.forEach(function(r){
    r.makasParalel=Yc?Math.abs(r.uy)<0.02:Math.abs(r.ux)<0.02;
    // bölme duvarlarının bağlandığı ara noktalar (T / X) → sade ölçüde odadan odaya zincir
    r.birlesim=r.nodes.slice(1,-1).filter(function(nd){var o=ni[nd.nid];return o&&(o.ends.length>0||o.thru.length>=2);}).map(function(nd){return nd.pos;});
    // düz ara node'lar (dal yok) → çizim kırılımı
    // yalnız panel modülüne denk gelen ara noktalar (kasıtlı bölünme); rastgele ara tıklamalar dizilimi bozmasın
    r.kirilim=r.nodes.slice(1,-1).filter(function(nd){var o=ni[nd.nid];return o&&!o.ends.length&&o.thru.length===1;}).map(function(nd){return nd.pos;});
  });
  // 4) paneller + numaralar
  if(window.Modular&&Modular.strict()){
    var panelRefs={};
    runs.forEach(function(r){
      if(r.makasParalel)return;
      var axis=Math.abs(r.ux)>.999?'x':'y',key=comp[r.nodes[0].nid]+axis;
      var start=(axis==='x'?r.ax:r.ay)+(r.s0||0);
      panelRefs[key]=Math.min(panelRefs[key]===undefined?Infinity:panelRefs[key],start);
    });
    runs.forEach(function(r){if(!r.makasParalel){var axis=Math.abs(r.ux)>.999?'x':'y';r.panelOrg=panelRefs[comp[r.nodes[0].nid]+axis];}});
  }
  runs.forEach(function(r){r.slots=pfDizilim(r);r.mx=r.ax+r.ux*r.L/2;r.my=r.ay+r.uy*r.L/2;});
  runs.sort(function(p,q){return (q.dis-p.dis)||(Math.round(p.my)-Math.round(q.my))||(p.mx-q.mx);});
  var say={T:0,Y:0,K:0,P:0,'Ö':0};
  runs.forEach(function(r){r.slots.forEach(function(p){var k=panelKod(p);say[k]++;p.no=k+say[k];});});
  // 4) bağlantılar
  var bag=[];
  function ekMi(run,pos){return run.slots.some(function(p,i){return i>0&&Math.abs(p.a-pos)<=PF_TOL;});}
  Object.keys(ni).forEach(function(nid){
    var o=ni[nid];
    var post=cornerPost(o,nid);
    if(post){
      var pk1=kUc(post.exterior[0],nid),pk2=kUc(post.exterior[1],nid);
      bag.push({nid:nid,tip:'kose',k:kEt(pk1,pk2),olcu:pk1===pk2?pk1+' cm':pk1+' / '+pk2+' cm'});
      post.interior.forEach(function(r){var sign=r.nodes[0].nid===nid?1:-1;bag.push({nid:nid,tip:'U',k:String(kUc(r,nid)),olcu:'Köşe direğine iç duvar bağlantısı',cornerPost:true,postUx:sign*r.ux,postUy:sign*r.uy});});
      return;
    }
    if(o.thru.length>=2){
      var r1=o.thru[0],r2=o.thru[1],k1=kAt(r1.run,r1.pos),k2=kAt(r2.run,r2.pos);
      var uygun=ekMi(r1.run,r1.pos)&&ekMi(r2.run,r2.pos);
      bag.push({nid:nid,tip:'X',k:Math.max(k1,k2)+'/'+Math.min(k1,k2),olcu:k1+' / '+k2+' cm',uyari:!uygun});
      o.thru.forEach(function(t){if(ekMi(t.run,t.pos))(t.run._h3=t.run._h3||[]).push(t.pos);});
      return;
    }
    if(o.thru.length===1){
      if(!o.ends.length)return;
      var t=o.thru[0],ek=ekMi(t.run,t.pos),ka=kAt(t.run,t.pos);
      o.ends.forEach(function(er){
        var kk=kUc(er,nid);
        // 3'lü H: ana/kol (10/6, 10/10, 6/6) · çektirme U: gelen duvar kalınlığında
        if(ek)bag.push({nid:nid,tip:'H3',run:t.run,pos:t.pos,k:ka+'/'+kk,olcu:'ana '+ka+' / kol '+kk+' cm'});
        else bag.push({nid:nid,tip:'U',run:t.run,pos:t.pos,k:String(kk),olcu:'T birleşim (ana '+ka+')'});
      });
      if(ek)(t.run._h3=t.run._h3||[]).push(t.pos);
      return;
    }
    var ks=o.ends.map(function(er){return kUc(er,nid);});
    if(o.ends.length===2)bag.push({nid:nid,tip:'kose',k:kEt(ks[0],ks[1]),olcu:ks[0]===ks[1]?ks[0]+' cm':ks[0]+' / '+ks[1]+' cm'});
    else if(o.ends.length>=3)bag.push({nid:nid,tip:'ozelB',k:ks.join('/'),olcu:ks.join(' / ')+' cm'});
    else if(o.ends.length===1)bag.push({nid:nid,tip:'U',k:String(ks[0]),olcu:'boşta biten duvar ucu',uc:true}); // serbest uç → çektirme U
  });
  runs.forEach(function(r){
    r.ekler=[];
    r.slots.forEach(function(p,i){
      if(i===0)return;
      var is3=(r._h3||[]).some(function(x){return Math.abs(x-p.a)<=PF_TOL;});
      r.ekler.push({pos:p.a,tip:is3?'H3':'H'});
      if(!is3)bag.push({tip:'H',run:r,pos:p.a,k:String(p.k),olcu:p.k+' cm'});
    });
  });
  return{runs:runs,bag:bag};
}
function pfRunOf(seg,A){
  A=A||pfAnaliz();
  for(var i=0;i<A.runs.length;i++){var it=A.runs[i].items.find(function(q){return q.seg.id===seg.id;});if(it)return{run:A.runs[i],item:it};}
  return null;
}
function panelMetraj(){
  var A=pfAnaliz();
  var M={dis:{tam:0,yarim:0,ozel:0,kapi:0,pencere:0},ic:{tam:0,yarim:0,ozel:0,kapi:0,pencere:0},
    ozelList:[],ozel:[],acikDetay:{},disM:0,icM:0,cfgHata:0,
    bag:{H:0,H3:0,U:0,kose:0,X:0,uc:0,ozelB:0}};
  A.runs.forEach(function(r){
    if(r.cfgHata)M.cfgHata++;
    r.items.forEach(function(it){if(it.seg.dis)M.disM+=it.L;else M.icM+=it.L;});
    r.slots.forEach(function(p){
      var g=p.dis?M.dis:M.ic;
      if(p.acik){g[p.acik]++;var key=(p.dis?'dis':'ic')+'|'+p.acik+'|'+p.tip+(p.tip==='ozel'?'|'+fmtCm(p.w):'');M.acikDetay[key]=(M.acikDetay[key]||0)+1;}
      else{g[p.tip]++;if(p.tip==='ozel')M.ozelList.push({w:p.w,dis:p.dis});}
    });
  });
  M.bagDetay={};M.xUyari=0;
  A.bag.forEach(function(b){
    M.bag[b.tip]=(M.bag[b.tip]||0)+1;
    var key=b.tip+'|'+(b.k||'')+'|'+(b.olcu||'');M.bagDetay[key]=(M.bagDetay[key]||0)+1;
    if(b.tip==='X'&&b.uyari)M.xUyari++;
  });
  M.A=A;
  return M;
}
function drawPanels(){
  if(!isPref())return;
  var s=sc(),A=pfAnaliz();
  G._ekNok=[];G._pnlOrta=[];G._ekT=[];
  A.runs.forEach(function(r){r.slots.forEach(function(p,i){
    if(i>0){
      G._ekNok.push({x:r.ax+r.ux*p.a,y:r.ay+r.uy*p.a});
      var ji=r.items.find(function(q){return p.a>=q.off-0.01&&p.a<=q.off+q.L+0.01;});
      if(ji)G._ekT.push({segId:ji.seg.id,t:ji.rev?ji.L-(p.a-ji.off):p.a-ji.off});
    }
    // panel ortası: segment koordinatında (duvar üstü snap mıknatısı)
    var m=(p.a+p.b)/2,it=r.items.find(function(q){return m>=q.off&&m<=q.off+q.L;});
    if(it)G._pnlOrta.push({segId:it.seg.id,t:it.rev?it.L-(m-it.off):m-it.off});
  });});
  ctx.save();ctx.lineCap='butt';
  A.runs.forEach(function(r){
    var nx=-r.uy,ny=r.ux;
    function P(d,o){return toCv(r.ax+r.ux*d+nx*o,r.ay+r.uy*d+ny*o);}
    r.slots.forEach(function(p,i){
      var h=p.k/2,wpx=p.k*s;
      // tip tonu
      var col=p.acik?null:(p.tip==='yarim'?TH.pnlYarim:p.tip==='ozel'?TH.pnlOzel:null);
      if(col){var p1=P(p.a,0),p2=P(p.b,0);ctx.strokeStyle=col;ctx.lineWidth=wpx;ctx.beginPath();ctx.moveTo(p1.x,p1.y);ctx.lineTo(p2.x,p2.y);ctx.stroke();}
      // derz
      if(i>0){
        // H profil: yalnız duvar kalınlığı içinde — ek çizgisi + iç yüzlere yaslanan kısa başlıklar (I/H görünümü)
        var wp=h*2*s,ins=Math.min(0.8,wp*0.08)/s;           // yüzden hafif içeride
        var c1=P(p.a,h-ins),c2=P(p.a,-h+ins);
        var gw=Math.max(1.1,Math.min(2.4,wp*0.09));
        ctx.lineCap='butt';ctx.strokeStyle=TH.pnlGap;ctx.lineWidth=gw;
        ctx.beginPath();ctx.moveTo(c1.x,c1.y);ctx.lineTo(c2.x,c2.y);ctx.stroke();
        if(wp>=7){
          var fl=Math.min(12,wp*0.42)/s,fo=h-ins-Math.max(0.9,gw*0.6)/s; // başlık uzunluğu ve yüze mesafe
          var f1a=P(p.a-fl/2,fo),f1b=P(p.a+fl/2,fo),f2a=P(p.a-fl/2,-fo),f2b=P(p.a+fl/2,-fo);
          ctx.lineWidth=Math.max(1,gw*0.85);
          ctx.beginPath();ctx.moveTo(f1a.x,f1a.y);ctx.lineTo(f1b.x,f1b.y);ctx.moveTo(f2a.x,f2a.y);ctx.lineTo(f2b.x,f2b.y);ctx.stroke();
        }
      }
      // numara
      if(G.pnlEtiket&&p.no&&!p.acik&&wpx>=8&&p.w*s>=22){
        var m=P((p.a+p.b)/2,0),ang=Math.atan2(r.uy,r.ux);
        if(ang>Math.PI/2+1e-6||ang<=-Math.PI/2+1e-6)ang+=Math.PI;
        var fs=Math.max(7,Math.min(11,wpx*0.7)),txt=p.tip==='ozel'&&p.w*s>=48?p.no+' · '+fmtCm(p.w):p.no;
        ctx.save();ctx.translate(m.x,m.y);ctx.rotate(ang);
        ctx.font='700 '+fs+'px '+FF;ctx.textAlign='center';ctx.textBaseline='middle';
        ctx.fillStyle=p.tip==='yarim'?TH.pnlTxtY:p.tip==='ozel'?TH.pnlTxtO:TH.pnlTxt;ctx.fillText(txt,0,0.5);
        ctx.restore();
      }
    });
  });
  // bağlantı işaretleri
  {
    A.bag.forEach(function(b){
      if(b.tip==='H')return;
      if(!G.pnlEtiket&&b.tip!=='kose')return;
      var nd=b.nid?getNode(b.nid):null;if(!nd)return;
      var c=toCv(nd.x,nd.y),R=Math.max(6,Math.min(10,5+s*2));
      if(b.cornerPost){c.x+=b.postUx*R*2.2;c.y+=b.postUy*R*2.2;}
      var lab={kose:'',H3:'3',U:'U',X:'4',ozelB:'!',uc:''}[b.tip];
      var col={kose:TH.pfKose,H3:TH.pfH3,U:TH.pfU,X:b.uyari?'#f85149':TH.pfH4,ozelB:'#f85149',uc:TH.pnlTick}[b.tip];
      ctx.save();
      if(b.tip==='kose'){
        // A hollow 1:2 post stays readable at low zoom; its long side is
        // perpendicular to the truss direction, including a local override.
        var longSide=Math.max(8,parseFloat(b.k||10)*s),shortSide=longSide/2;
        var vertical=(G.catiYon!=='dikey')!==!!nd.koseTers;
        var pw=vertical?shortSide:longSide,ph=vertical?longSide:shortSide;
        ctx.fillStyle=TH.opening;ctx.strokeStyle=TH.wall;ctx.lineWidth=1.2;
        ctx.fillRect(c.x-pw/2,c.y-ph/2,pw,ph);
        ctx.strokeRect(c.x-pw/2,c.y-ph/2,pw,ph);
      }
      else if(b.tip==='uc'){ctx.fillStyle=col;ctx.beginPath();ctx.arc(c.x,c.y,R*0.45,0,Math.PI*2);ctx.fill();}
      else{
        ctx.fillStyle=col;ctx.beginPath();ctx.arc(c.x,c.y,R,0,Math.PI*2);ctx.fill();
        ctx.fillStyle='#fff';ctx.font='800 '+Math.round(R*1.15)+'px '+FF;ctx.textAlign='center';ctx.textBaseline='middle';
        ctx.fillText(lab,c.x,c.y+0.5);
      }
      ctx.restore();
    });
  }
  ctx.restore();
}
// Kapı/pencereyi hattın en yakın uygun paneline ortala
function prefElemanYuva(e,seg,pos){
  var R=pfRunOf(seg);if(!R)return null;
  var run=R.run,it=R.item,sl=pfDizilim(run);
  var rp=it.rev?it.off+(it.L-pos-e.en):it.off+pos,c=rp+e.en/2,best=null,bd=Infinity;
  sl.forEach(function(p){
    if(p.w<e.en-0.5)return;
    var faceLo=it.off+ucBosluk(seg,it.rev?seg.n2:seg.n1),faceHi=it.off+it.L-ucBosluk(seg,it.rev?seg.n1:seg.n2);
    var low=Math.max(p.a,faceLo),high=Math.min(p.b,faceHi)-e.en;
    if(high<low-.01)return;
    var m=(p.a+p.b)/2;if(m<it.off||m>it.off+it.L)return; // panel bu segmentte olmalı
    var d=Math.abs(m-c);if(d<bd){bd=d;best={a:p.a,b:p.b,low:low,high:high};}
  });
  if(!best)return null;
  var ns=Math.max(best.low,Math.min(best.high,(best.a+best.b)/2-e.en/2));
  var sp=it.rev?it.L-(ns-it.off)-e.en:ns-it.off;
  return Math.max(0,Math.min(it.L-e.en,sp));
}
// Seçili duvarın hattı için elle panel dizilimi ("125.5 + 80 + 45.5")
function pfDiziAyarla(str){
  var sg=G.secili;if(!sg||G.seciliTip!=='seg')return;
  var R=pfRunOf(sg);if(!R)return;
  var ws=String(str).replace(/,/g,'.').split(/[+;\s]+/).filter(Boolean).map(parseFloat);
  if(ws.some(function(w){return !(w>0)||w>PF.PANEL+0.01;})){alert('Her panel 0 ile 125,5 cm arasında olmalı.');updateSidebar();return;}
  var top=ws.reduce(function(a,b){return a+b;},0);
  var UU=R.run.L-(R.run.s0||0)-(R.run.s1||0);
  if(top>UU+0.6){alert('Paneller toplamı ('+fmtCm(top)+') panel alanından ('+fmtCm(UU)+' cm) uzun.');updateSidebar();return;}
  pushH();
  if(!ws.length)delete R.run.owner.pnlCfg;else R.run.owner.pnlCfg={dizi:ws};
  delete R.run.owner.pnlTers;
  draw();updateSidebar();
}
function pfIzgara(){
  var sg=G.secili;if(!sg)return;var R=pfRunOf(sg);if(!R)return;pushH();
  var o=R.run.owner,yeni=!R.run.izgaraEtkin;delete o.pnlTers;
  if(yeni===!!R.run.makasParalel)delete o.pnlCfg;else o.pnlCfg={izgara:yeni};
  draw();updateSidebar();
}
function pfKoseCevir(){var n=G.secili;if(!n||G.seciliTip!=='node')return;pushH();n.koseTers=!n.koseTers;draw();updateSidebar();}
// Zincir çizimde köşe düzeltmeleri (çizim sırasında, yeni segment eklenmeden hemen önce):
//  1) Önceki duvar makasa dikti ve boyu panel snap'iyle verildiyse, burada DÖNÜŞ yapılınca köşe L köşesi olur:
//     dik duvar köşede de karşı duvarın yüzünde biter → köşe düğümünü yarım kalınlık kadar ileri al.
//  2) Var olan bir düğüme kapanırken yeni duvar eksene çok yakın ama eğikse (≤5°), başlangıç düğümünü
//     önceki duvar doğrultusunda kaydırarak duvarı tam yatay/dikey yap (L kapanışlarında 5 cm'lik yamukluk).
function cizimKoseDuzelt(sn,en,varOlanaKapaniyor){
  var production=window.Modular&&Modular.strict();
  var prev=G.segs.filter(function(s){return s.n1===sn.id||s.n2===sn.id;});
  if(prev.length!==1)return;
  var ps=prev[0],o=getNode(ps.n1===sn.id?ps.n2:ps.n1);if(!o)return;
  var px=sn.x-o.x,py=sn.y-o.y,pl=Math.hypot(px,py);if(pl<1)return;
  var pux=px/pl,puy=py/pl;
  var nx=en.x-sn.x,ny=en.y-sn.y,nl=Math.hypot(nx,ny);if(nl<1)return;
  var donus=Math.abs(pux*nx/nl+puy*ny/nl)<0.5;
  if(!donus)return;
  var pYat=Math.abs(puy)<0.02,pDik=Math.abs(pux)<0.02;
  // A new outside corner needs its end allowance. Only an existing opposite
  // run or an explicit closing target fixes the axis and requires a cut panel.
  if(production&&(varOlanaKapaniyor||Modular.cornerConstrained(sn,ps)))return;
  if(production){
    // A reverse turn forms a step, not another outside corner. Keep its
    // endpoint on the shared H axis; the corner face trims the last panel.
    var incoming=G.segs.filter(function(s){return s.id!==ps.id&&s.tip!=='veranda'&&(s.n1===o.id||s.n2===o.id);});
    if(incoming.length===1){
      var prior=getNode(incoming[0].n1===o.id?incoming[0].n2:incoming[0].n1);
      if(prior&&((o.x-prior.x)*py-(o.y-prior.y)*px)*(px*ny-py*nx)<-0.01)return;
    }
  }
  // 1) panel snap'li dik duvarın bitişine uç payı
  if(isPref()&&ps.pfSnap&&(pYat||pDik)){
    var paralel=catiYatay()?pYat:pDik;
    if(!paralel){
      var pay=G.defaultK/2;
      sn.x+=pux*pay;sn.y+=puy*pay;
      if(!varOlanaKapaniyor){ // yeni duvarın ucu da aynı kaymayla eksende kalsın
        if(Math.abs(nx)>Math.abs(ny))en.y=sn.y;else en.x=sn.x;
      }
      delete ps.pfSnap;
    }
  }
  // 2) kapanışta eğiklik düzeltme
  if(!production&&varOlanaKapaniyor&&(pYat||pDik)){
    nx=en.x-sn.x;ny=en.y-sn.y;
    if(pDik&&Math.abs(ny)>0.05&&Math.abs(ny)<Math.abs(nx)*0.09)sn.y=en.y;      // önceki dikey → y'yi eşitle
    else if(pYat&&Math.abs(nx)>0.05&&Math.abs(nx)<Math.abs(ny)*0.09)sn.x=en.x; // önceki yatay → x'i eşitle
  }
}
// A new, independent wall starts its own panel grid. A wall attached at an H
// inherits that building's grid even before its temporary start node is split in.
function pfCizimMakasOrg(sn){
  pfAnaliz();
  if(G._compLo&&G._compLo[sn.id]!==undefined)return G._compLo[sn.id];
  for(var i=0;i<G.segs.length;i++){
    var s=G.segs[i];if(s.tip==='veranda')continue;
    var a=getNode(s.n1),b=getNode(s.n2),dx=b.x-a.x,dy=b.y-a.y,L=Math.hypot(dx,dy);if(L<.001)continue;
    var t=((sn.x-a.x)*dx+(sn.y-a.y)*dy)/L;
    if(t>=-.001&&t<=L+.001&&Math.abs((sn.x-a.x)*dy-(sn.y-a.y)*dx)/L<.001&&G._compLo[a.id]!==undefined)return G._compLo[a.id];
  }
  return catiYatay()?sn.x:sn.y;
}
function pfCizimSnap(sn,mx,my){
  if(!sn)return null;
  var step=G.panelDrawMode==='full'?PF.PANEL:PF.YARIM;
  var dx=mx-sn.x,dy=my-sn.y;if(Math.hypot(dx,dy)<5)return null;
  var yatayCiz=Math.abs(dx)>=Math.abs(dy);
  // yalnız eksene yakın çizimde (±12°)
  if((yatayCiz?Math.abs(dy)/Math.abs(dx):Math.abs(dx)/Math.abs(dy))>0.21)return null;
  var sg=dx>=0&&yatayCiz||dy>=0&&!yatayCiz?1:-1;
  var paralel=catiYatay()?yatayCiz:!yatayCiz;
  if(paralel){
    var org=pfCizimMakasOrg(sn),c=yatayCiz?mx:my;
    var sc2=org+Math.round((c-org)/step)*step;
    return yatayCiz?{x:sc2,y:sn.y}:{x:sn.x,y:sc2};
  }
  // makasa dik: başlangıç node'undaki (bu doğrultuda olmayan) duvarların yarı kalınlığı kadar pay
  var s0=0;
  G.segs.forEach(function(s){
    if(s.tip==='veranda'||(s.n1!==sn.id&&s.n2!==sn.id))return;
    var o=getNode(s.n1===sn.id?s.n2:s.n1),vx=o.x-sn.x,vy=o.y-sn.y,vl=Math.hypot(vx,vy);if(vl<1)return;
    var par=yatayCiz?Math.abs(vy)/vl<0.05:Math.abs(vx)/vl<0.05;
    if(!par)s0=Math.max(s0,s.k/2);
  });
  // Boşta başlayan dik duvar (yeni binanın ilk duvarı) ileride köşe olacak → başlangıç payı baştan eklenir
  if(!s0&&!G.segs.some(function(s){return s.n1===sn.id||s.n2===sn.id;}))s0=G.defaultK/2;
  var len=Math.abs(yatayCiz?dx:dy);
  var n=Math.max(1,Math.round((len-s0)/step)),L=s0+n*step;
  // Var olan bir düğümün hizası yakınsa (10 px) ona hizala — duvarlar eşit boyda kalsın
  var mc=yatayCiz?sn.x+sg*len:sn.y+sg*len,hb=10/sc(),hz=null;
  G.nodes.forEach(function(nd){if(nd.id===sn.id)return;var c=yatayCiz?nd.x:nd.y;var d=Math.abs(c-mc);if(d<hb){hb=d;hz=c;}});
  // In production mode an unrelated node alignment must not overwrite the
  // panel length including its starting corner allowance.
  if(hz!==null&&(!window.Modular||!Modular.strict()))return yatayCiz?{x:hz,y:sn.y,hiza:true}:{x:sn.x,y:hz,hiza:true};
  return yatayCiz?{x:sn.x+sg*L,y:sn.y}:{x:sn.x,y:sn.y+sg*L};
}
function pfDiziOto(){var sg=G.secili;if(!sg)return;var R=pfRunOf(sg);if(!R)return;pushH();delete R.run.owner.pnlCfg;delete R.run.owner.pnlTers;draw();updateSidebar();}
function panelTersCevir(){
  var sg=G.secili;if(!sg||G.seciliTip!=='seg')return;
  var R=pfRunOf(sg);if(!R)return;pushH();
  var o=R.run.owner,t=!!((o.pnlCfg&&o.pnlCfg.ters)||o.pnlTers);
  delete o.pnlTers;
  if(o.pnlCfg&&o.pnlCfg.dizi){o.pnlCfg={dizi:o.pnlCfg.dizi.slice().reverse()};}
  else o.pnlCfg={ters:!t};
  draw();updateSidebar();
}
function pfSegPanelHTML(o){
  var A=pfAnaliz(),R=pfRunOf(o,A);if(!R)return '';
  var r=R.run,c={T:0,Y:0,'Ö':0,K:0,P:0};
  r.slots.forEach(function(p){c[panelKod(p)]++;});
  var b3=0,bu=0;
  A.bag.forEach(function(b){if(b.run===r){if(b.tip==='H3')b3++;if(b.tip==='U')bu++;}});
  var dizi=r.slots.map(function(p){return fmtCm(p.w);}).join(' + ');
  var man=!!(r.owner.pnlCfg&&r.owner.pnlCfg.dizi),izg=!man&&!!r.izgaraEtkin,izgElle=!!(r.owner.pnlCfg&&r.owner.pnlCfg.izgara!==undefined);
  var UU=r.L-r.s0-r.s1;
  return '<div class="sr"><span class="sl">Duvar hattı (aks)</span><span class="sv">'+fmtCm(r.L)+' cm'+(r.items.length>1?' · '+r.items.length+' parça':'')+'</span></div>'+
    '<div class="sr"><span class="sl">Panel alanı</span><span class="sv">'+fmtCm(UU)+' cm'+((r.s0||r.s1)?' <span style="color:#8b949e;font-weight:400">(uçlar −'+fmtCm(r.s0)+' / −'+fmtCm(r.s1)+')</span>':'')+'</span></div>'+
    '<div class="sr"><span class="sl">Panel</span><span class="sv">'+[c.T?c.T+' tam':'',c.Y?c.Y+' yarım':'',c['Ö']?c['Ö']+' özel':'',c.K?c.K+' kapılı':'',c.P?c.P+' pencereli':''].filter(Boolean).join(' + ')+'</span></div>'+
    ((b3||bu)?'<div class="sr"><span class="sl">T birleşim</span><span class="sv">'+[b3?b3+' × 3lü H':'',bu?bu+' × çektirme U':''].filter(Boolean).join(', ')+'</span></div>':'')+
    '<div style="font-size:10px;color:#8b949e;margin-top:4px">Panel dizilimi '+(man?'(elle)':'(otomatik)')+' — soldan/üstten, + ile ayırın:</div>'+
    '<input class="si" style="width:100%;text-align:left;margin-top:2px" value="'+dizi+'" onchange="pfDiziAyarla(this.value)" title="Örn: 125.5 + 30 + 95.5 — özel panel ölçüsü serbest (≤125,5)">'+
    (r.cfgHata?'<div style="font-size:10px;color:#f85149;margin-top:3px">⚠ Elle dizilim duvardan uzun kaldı — otomatiğe dönüldü</div>':'')+
    '<div style="display:flex;gap:4px;margin-top:4px">'+
      '<button class="sib" style="margin:0" onclick="panelTersCevir()">⇄ Ters çevir</button>'+
      '<button class="sib" style="margin:0'+(izg?';border-color:#58a6ff;color:#58a6ff':'')+'" onclick="pfIzgara()" title="Ekleri aks ızgarasına (125,5) hizala; uç paneller kırpılır">▦ Izgara</button>'+
      ((man||izgElle)?'<button class="sib" style="margin:0" onclick="pfDiziOto()">↺ Otomatik</button>':'')+'</div>'+
    '<div style="font-size:10px;color:#8b949e;margin-top:3px">'+(r.makasParalel?'Makas yönüne paralel → ekler makas ızgarasında':'Makasa dik → birleşim yüzünden tam panelle başlar')+(izgElle?' (elle değiştirildi)':'')+'</div>'+
    '<div class="sr" style="margin-top:4px"><span class="sl">Tür</span><span class="sv">'+(o.dis?'Dış duvar':'İç duvar')+' · '+o.k+' cm'+(o.kSabit?' (elle)':' (oto)')+'</span></div>'+
    (o.kSabit?'<button class="sib" style="margin-top:3px" onclick="kOtomatik()">↺ Kalınlığı otomatiğe al</button>':'');
}


// Prefabrikte kalınlık otomatik: dış 10, iç 6 (kSabit olan duvar hariç)
function prefKalinlikUygula(){
  if(!isPref())return;
  G.segs.forEach(function(s){
    if(s.tip==='veranda'||s.kSabit)return;
    s.k=s.dis?PF.DIS:PF.IC;
  });
}
// Kapı/pencereyi en yakın uygun panel yuvasına ortala

// ═══ METRAJ LİSTESİ ══════════════════════════════════════════════════════
// Genişletilebilir yapı: her kalem {grup, kalem, olcu, birim, adet}. İleride yeni prefabrik
// malzemeleri (dikme, köşe profili, vida, çatı paneli…) aynı listeye satır olarak eklenir.
var KAPI_TIP_AD={ic:'İç kapı',dis:'Dış kapı',surme:'Sürgülü kapı',cift:'Çift kanatlı kapı'};
var PEN_TIP_AD={'surme':'Sürgülü pencere','cift-kanat':'Çift kanatlı pencere','tek-kanat':'Tek kanatlı pencere','sabit':'Sabit pencere'};
// ═══ ALÇIPAN HESABI ══════════════════════════════════════════════════════
// Levha 120 × 250 cm = 3,00 m². Kuru mahaller: BEYAZ (duvar + tavan), ıslak mahaller (banyo, ebeveyn banyo, WC):
// YEŞİL (duvar + tavan), veranda: yalnız TAVAN, yeşil. Duvar yüksekliği = kat yüksekliği.
// Hesap net iç ölçülerle: her duvar kenarı kendi kalınlığının yarısı kadar içeri alınır (iç yüz).
// Kapı/pencere boşlukları, bulundukları duvarın her iki yüzündeki odadan düşülür (dış duvarda yalnız iç yüz).
var ALCI={EN:120,BOY:250,LEVHA_M2:3.0,FIRE:10,ISLAK:{banyo:1,ebanyo:1,wc:1}};
function _segArasi(a,b){return G.segs.find(function(s){return (s.n1===a&&s.n2===b)||(s.n1===b&&s.n2===a);});}
function odaIcGeometri(r){
  var ids=r.nodeIds.slice(),spikes=[],deg=true,g=0;
  // odanın içine uzanan serbest duvar (A→B→A) — poligondan çıkar, iki yüzünü ayrıca say
  while(deg&&g++<100){deg=false;var n0=ids.length;if(n0<4)break;
    for(var i=0;i<n0;i++){
      var p=ids[(i-1+n0)%n0],q=ids[(i+1)%n0];
      if(p===q){var sg=_segArasi(ids[i],p);if(sg)spikes.push(sg);
        var i1=(i+1)%n0;[i,i1].sort(function(a,b){return b-a;}).forEach(function(ix){ids.splice(ix,1);});deg=true;break;}
    }
  }
  var P=ids.map(getNode);if(P.some(function(x){return !x;})||P.length<3)return null;
  var n=P.length,ed=[];
  for(var k0=0;k0<n;k0++){
    var a=P[k0],b=P[(k0+1)%n],L=dist(a.x,a.y,b.x,b.y);if(L<0.01)continue;
    var ux=(b.x-a.x)/L,uy=(b.y-a.y)/L,nx=-uy,ny=ux,mx=(a.x+b.x)/2,my=(a.y+b.y)/2;
    if(!ptInPolygon(mx+nx*0.5,my+ny*0.5,P)){nx=-nx;ny=-ny;}
    var sg2=_segArasi(ids[k0],ids[(k0+1)%n]),k=sg2?(sg2.tip==='veranda'?0:sg2.k):0;
    ed.push({a:a,b:b,ux:ux,uy:uy,nx:nx,ny:ny,k:k,seg:sg2,L:L,ox:a.x+nx*k/2,oy:a.y+ny*k/2});
  }
  n=ed.length;if(n<3)return null;
  function kes(e0,e1,node){ // e0 ve e1 iç doğrularının kesişimi; paralelse e1 doğrusunda node izdüşümü
    var den=e0.ux*e1.uy-e0.uy*e1.ux;
    if(Math.abs(den)<1e-6)return{x:node.x+e1.nx*e1.k/2,y:node.y+e1.ny*e1.k/2};
    var t=((e1.ox-e0.ox)*e1.uy-(e1.oy-e0.oy)*e1.ux)/den;
    return{x:e0.ox+e0.ux*t,y:e0.oy+e0.uy*t};
  }
  var poly=[],kenar=[];
  ed.forEach(function(e,i2){
    var ep=ed[(i2-1+n)%n],en=ed[(i2+1)%n];
    var S=kes(ep,e,e.a);
    // bitiş: sonraki kenarla kesişim (paralelse bu kenarın doğrusunda b noktası)
    var den=e.ux*en.uy-e.uy*en.ux,E;
    if(Math.abs(den)<1e-6)E={x:e.b.x+e.nx*e.k/2,y:e.b.y+e.ny*e.k/2};
    else{var t=((en.ox-e.ox)*en.uy-(en.oy-e.oy)*en.ux)/den;E={x:e.ox+e.ux*t,y:e.oy+e.uy*t};}
    poly.push(S,E);
    kenar.push({e:e,L:Math.max(0,(E.x-S.x)*e.ux+(E.y-S.y)*e.uy)});
  });
  var alan=0;for(var v=0;v<poly.length;v++){var A=poly[v],Bq=poly[(v+1)%poly.length];alan+=A.x*Bq.y-Bq.x*A.y;}
  return{alan:Math.abs(alan)/20000,kenar:kenar,spikes:spikes,poly:poly};
}
// ═══ PREFABRİK OPSİYONLARI ═══════════════════════════════════════════════
// h: 250 / 280 / 300 · iç ve dış duvar: 6 / 10 / 15 cm
// İç duvar alçıpanı (opsiyon): tavan her zaman alçıpan (standart); duvarlar yalnız müşteri isterse
//   Yok / Tüm odalar / Seçili odalar (oda bazında işaretlenir)
// Dış cephe kaplaması: Yok / Taşonit / Yalıpan — plaka ölçüsü serbest ("40x250", "31x250", "20x300")
//   Taşonit: tam yüz örter · Yalıpan: alttan başlar, her sıra bir öncekine 3 cm bindirir → görünen yükseklik = en − 3
G.opt={h:280,dis:10,ic:6,alciDuvar:'yok',cephe:'yok',plaka:'40x250',bindirme:3,cepheFire:5,cati:'besik',egim:33,sacak:30,trapezEn:100,kaplama:'trapez',osb:false,catiFire:5,suRulo:75,suBindirme:10,parcaBoy:200,parcaBind:10,vidaM2:5,inisAralik:10,aksAcik:false};
function optUygula(anahtar,deger){
  pushH();
  G.opt[anahtar]=deger;
  if(anahtar==='h'){document.getElementById('katYuk').value=deger;}
  if(anahtar==='ic'){PF.IC=+deger;G.segs.forEach(function(s){if(!s.dis&&s.tip!=='veranda')delete s.kSabit;});}
  detectRooms();draw();updateSidebar();optPanelGuncelle();
}
function optPanelGuncelle(){
  var el=document.getElementById('optBox');if(!el)return;
  el.style.display=isPref()?'':'none';
  var o=G.opt;
  function sel(id,val,opts){return '<select class="si" style="width:auto" onchange="optUygula(\''+id+'\',this.value)">'+opts.map(function(x){return '<option value="'+x[0]+'"'+(String(val)===String(x[0])?' selected':'')+'>'+x[1]+'</option>';}).join('')+'</select>';}
  var html=
    '<div class="sr"><span class="sl">Panel yüksekliği</span>'+sel('h',o.h,[[250,'250 cm'],[280,'280 cm'],[300,'300 cm']])+'</div>'+
    '<div class="sr"><span class="sl">İç duvar</span>'+sel('ic',o.ic,[[6,'6 cm'],[10,'10 cm'],[15,'15 cm']])+'</div>'+
    '<div class="sr"><span class="sl">Dış duvar</span>'+sel('dis',o.dis||10,[[6,'6 cm'],[10,'10 cm'],[15,'15 cm']])+'</div>'+
    '<div class="sr"><span class="sl">Duvar alçıpanı</span>'+sel('alciDuvar',o.alciDuvar,[['yok','Yok (standart)'],['hepsi','Tüm odalar'],['secili','Seçili odalar']])+'</div>'+
    (o.alciDuvar==='secili'?'<div style="font-size:10px;color:#8b949e;margin:-2px 0 4px">Odayı seçip kenar çubuğundan işaretleyin</div>':'')+
    '<div class="sr"><span class="sl">Dış cephe</span>'+sel('cephe',o.cephe,[['yok','Yok'],['tasonit','Taşonit'],['yalipan','Yalıpan']])+'</div>'+
    (o.cephe!=='yok'?'<div class="sr"><span class="sl">Plaka (en×boy)</span><input class="si" style="width:80px" value="'+esc(o.plaka)+'" onchange="optUygula(\'plaka\',this.value)"></div>'+
      (o.cephe==='yalipan'?'<div class="sr"><span class="sl">Bindirme (cm)</span><input class="si" type="number" style="width:60px" value="'+o.bindirme+'" onchange="optUygula(\'bindirme\',+this.value)"></div>':'')+
      '<div class="sr"><span class="sl">Cephe fire %</span><input class="si" type="number" min="0" style="width:60px" value="'+o.cepheFire+'" onchange="optUygula(\'cepheFire\',Math.max(0,+this.value||0))"></div>'+
      '<div style="font-size:10px;color:#8b949e;margin-top:2px">Zemin betonundan saçak altına, h = '+o.h+' cm'+(o.cephe==='yalipan'?' · ilk sıra tam plaka':'')+'</div>':'')+
    '<button class="sib" style="margin-top:10px" onclick="RoofStudio.open()">Çatı bölümlerini düzenle ↗</button>'+
    '<div style="font-size:10px;color:#8b949e;margin-top:5px">'+(G.roofs&&G.roofs.length?'Metraj: çatı bölüm modelinden. Aşağıdakiler yeni bölüm varsayılanlarıdır.':'Bölüm çizilmediyse aşağıdaki çatı hesabı ön tahmindir.')+'</div>'+
    '<div class="sr" style="margin-top:6px"><span class="sl">Çatı varsayılanı</span>'+sel('cati',o.cati,[['besik','Beşik (2 yön)'],['kirma','Kırma (4 yön)'],['tek','Tek yön'],['yok','Hesaplama']])+'</div>'+
    (o.cati!=='yok'?'<div class="sr"><span class="sl">Kaplama</span>'+sel('kaplama',o.kaplama,[['trapez','Trapez'],['sandvic','Sandviç panel']])+'</div>'+
      '<label style="display:flex;gap:6px;align-items:center;font-size:11px;margin:2px 0;cursor:pointer"><input type="checkbox" '+(o.osb?'checked':'')+' onchange="optUygula(\'osb\',this.checked)"> OSB (opsiyonel)</label>':'')+
    (o.cati!=='yok'?
      '<div class="sr"><span class="sl">Eğim %</span><input class="si" type="number" style="width:60px" value="'+o.egim+'" onchange="optUygula(\'egim\',Math.max(0,+this.value||0))"></div>'+
      '<div class="sr"><span class="sl">Saçak (cm)</span><input class="si" type="number" style="width:60px" value="'+o.sacak+'" onchange="optUygula(\'sacak\',Math.max(0,+this.value||0))"></div>'+
      '<div class="sr"><span class="sl">Trapez örtme eni</span><input class="si" type="number" style="width:60px" value="'+o.trapezEn+'" onchange="optUygula(\'trapezEn\',Math.max(1,+this.value||100))"></div>'+
      '<div style="font-size:10px;color:#8b949e;margin-top:2px">Mahya makas yönünde · eğim açısı '+(Math.round(Math.atan((+o.egim||0)/100)*1800/Math.PI)/10)+'°</div>'+
      '<div style="font-size:11px;color:#58a6ff;cursor:pointer;margin-top:4px" onclick="G.opt.aksAcik=!G.opt.aksAcik;optPanelGuncelle();">'+(o.aksAcik?'▾':'▸')+' Çatı aksesuar kuralları</div>'+
      (o.aksAcik?
        ['catiFire:Çatı fire %','parcaBoy:Parça boyu (cm)','parcaBind:Parça bindirme (cm)','vidaM2:Vida (adet/m²)','inisAralik:İniş borusu aralığı (m)','suRulo:Su yalıtım rulo (m²)','suBindirme:Su yalıtım bindirme %'].map(function(x){var p=x.split(':');
          return '<div class="sr"><span class="sl">'+p[1]+'</span><input class="si" type="number" style="width:60px" value="'+o[p[0]]+'" onchange="optUygula(\''+p[0]+'\',Math.max(0,+this.value||0))"></div>';}).join('')+
        '<div style="font-size:10px;color:#8b949e">Mahya, dere, saçak, alın ve oluk: uzunluk ÷ (parça boyu − bindirme)</div>':''):'');
  if(el._html!==html){el._html=html;document.getElementById('optIc').innerHTML=html;}
}
// Planda göster: duvarına alçıpan gelen odaların iç yüzü (beyaz → sarı, ıslak → yeşil kesikli çizgi)
function drawAlciGorsel(){
  if(!isPref()||G.opt.alciDuvar==='yok')return;
  ctx.save();ctx.setLineDash([8,4]);ctx.lineWidth=2;
  G.rooms.forEach(function(r){
    if(!odaDuvarAlci(r))return;var g=odaIcGeometri(r);if(!g)return;
    var ins=4/sc(); // çizgiyi yüzden biraz içeri al
    ctx.strokeStyle=ALCI.ISLAK[r.tip]?(TH.export?'#2da44e':'#3fb950'):(TH.export?'#d4a72c':'#e3c34d');
    ctx.beginPath();
    g.poly.forEach(function(p,i){var c=toCv(p.x,p.y);if(i===0)ctx.moveTo(c.x,c.y);else ctx.lineTo(c.x,c.y);});
    ctx.closePath();ctx.stroke();
  });
  ctx.restore();
}
function odaDuvarAlci(r){
  if(r.tip==='veranda')return false;
  if(G.opt.alciDuvar==='hepsi')return true;
  if(G.opt.alciDuvar==='secili')return !!r.duvarAlci;
  return false;
}
function odaDuvarAlciCevir(){var r=G.secili;if(!r||G.seciliTip!=='room')return;pushH();r.duvarAlci=!r.duvarAlci;draw();updateSidebar();}
function plakaOlcu(){
  var m=String(G.opt.plaka||'').replace(/,/g,'.').match(/([0-9.]+)\s*[x×*]\s*([0-9.]+)/i);
  if(!m)return null;var a=+m[1],b=+m[2];return{en:Math.min(a,b),boy:Math.max(a,b)};
}
// Dış cephe: dış duvarların DIŞ yüzü (dış kontur ötelenerek) × panel yüksekliği − dış duvardaki boşluklar
function cepheHesap(){
  var dis=G.segs.filter(function(s){return s.dis&&s.tip!=='veranda'&&getNode(s.n1)&&getNode(s.n2);});
  if(!dis.length)return null;
  var adj={};dis.forEach(function(s){(adj[s.n1]=adj[s.n1]||[]).push(s);(adj[s.n2]=adj[s.n2]||[]).push(s);});
  var used={},cevre=0,dongu=0;
  dis.forEach(function(s0){
    if(used[s0.id])return;
    // dış duvar zincirini yürü
    var seq=[],cur=s0,nd=s0.n1,g=0;
    while(cur&&!used[cur.id]&&g++<2000){used[cur.id]=1;var nx=cur.n1===nd?cur.n2:cur.n1;seq.push({s:cur,a:nd,b:nx});nd=nx;cur=(adj[nd]||[]).find(function(q){return !used[q.id];});}
    if(seq.length<3||seq[seq.length-1].b!==seq[0].a){ // kapalı değilse aks uzunluğu
      seq.forEach(function(e){cevre+=_segLen(e.s);});return;
    }
    dongu++;
    var P=seq.map(function(e){return getNode(e.a);}),n=seq.length;
    var ed=seq.map(function(e,i){
      var a=getNode(e.a),b=getNode(e.b),L=dist(a.x,a.y,b.x,b.y),ux=(b.x-a.x)/L,uy=(b.y-a.y)/L,nx2=-uy,ny2=ux;
      if(ptInPolygon((a.x+b.x)/2+nx2*0.5,(a.y+b.y)/2+ny2*0.5,P)){nx2=-nx2;ny2=-ny2;} // dışa doğru
      return{a:a,b:b,ux:ux,uy:uy,ox:a.x+nx2*e.s.k/2,oy:a.y+ny2*e.s.k/2,nx:nx2,ny:ny2,k:e.s.k};
    });
    function kes(e0,e1,node){var den=e0.ux*e1.uy-e0.uy*e1.ux;
      if(Math.abs(den)<1e-6)return{x:node.x+e1.nx*e1.k/2,y:node.y+e1.ny*e1.k/2};
      var t=((e1.ox-e0.ox)*e1.uy-(e1.oy-e0.oy)*e1.ux)/den;return{x:e0.ox+e0.ux*t,y:e0.oy+e0.uy*t};}
    ed.forEach(function(e,i){
      var S=kes(ed[(i-1+n)%n],e,e.a),E=kes(e,ed[(i+1)%n],e.b);
      cevre+=Math.max(0,(E.x-S.x)*e.ux+(E.y-S.y)*e.uy);
    });
  });
  var h=+document.getElementById('katYuk').value||G.opt.h||280;
  var bosluk=0,kapi=0,pen=0;
  G.elemanlar.forEach(function(e){var sg=getSeg(e.segId);if(!sg||!sg.dis)return;var a=e.en*(e.yuk||(e.tip_==='kapi'?210:120))/10000;bosluk+=a;if(e.tip_==='kapi')kapi+=a;else pen+=a;});
  var brut=cevre*h/10000,net=Math.max(0,brut-bosluk);
  var P2=plakaOlcu(),adet=0,etkinEn=0,m2Plaka=0,sira=0;
  if(P2&&G.opt.cephe!=='yok'){
    etkinEn=G.opt.cephe==='yalipan'?Math.max(1,P2.en-(+G.opt.bindirme||0)):P2.en; // yalıpanda görünen yükseklik
    var fire=(+G.opt.cepheFire||0)/100;
    if(G.opt.cephe==='yalipan'){
      // ilk sıra zemine tam plaka (en kadar örter), sonraki her sıra en − bindirme kadar
      sira=1+Math.max(0,Math.ceil((h-P2.en)/etkinEn-1e-9));
      var ortHaz=h/sira; // ortalama örtülen yükseklik (net yüzeyi sıraya bölmek için)
      m2Plaka=ortHaz*P2.boy/10000;
    } else {
      sira=Math.ceil(h/etkinEn-1e-9);
      m2Plaka=etkinEn*P2.boy/10000;
    }
    adet=Math.ceil(net*(1+fire)/m2Plaka-1e-9);
  }
  return{cevre:cevre,h:h,brut:brut,bosluk:bosluk,kapi:kapi,pen:pen,net:net,plaka:P2,etkinEn:etkinEn,m2Plaka:m2Plaka,adet:adet,sira:sira,dongu:dongu};
}
// ═══ ÇATI — TRAPEZ / SANDVİÇ PANEL + KATMANLAR + AKSESUARLAR ══════════════
// Çatı, açıklığın değiştiği yerlerde bölümlere ayrılır: en geniş bölüm ANA çatı, diğerleri YAVRU çatı.
// Şekil: beşik / kırma (4 yön) / tek yön. Kaplama: trapez veya sandviç panel (örtme eni 100, boy kesilerek).
// Geometri → aksesuar kuralları: her parça bir geometrik büyüklüğe bağlı (mahya m, dere m, saçak m, alın m, m²)
// ve bir dönüşüm kuralıyla (parça boyu − bindirme, adet/m², aralık) adete çevrilir. Kurallar Opsiyonlar'dan ayarlanır.
function catiHesap(){
  if(window.RoofStudio&&G.roofs&&G.roofs.length)return RoofStudio.summary();
  if(G.opt.cati==='yok')return null;
  var comp=_bilesenler(),grp={};
  G.segs.forEach(function(s){if(s.dis&&s.tip!=='veranda'&&getNode(s.n1)&&getNode(s.n2)){var c=comp[s.n1];(grp[c]=grp[c]||[]).push(s);}});
  var keys=Object.keys(grp);if(!keys.length||!G.rooms.some(function(r){return r.tip!=='veranda';}))return null;
  var Y=catiYatay(),sac=+G.opt.sacak||0,e=(+G.opt.egim||0)/100,fak=Math.sqrt(1+e*e),ac=Math.atan(e)*180/Math.PI;
  var W=+G.opt.trapezEn||100,dK=PF.DIS,sekil=G.opt.cati;
  var R={gruplar:[],adet:0,alan:0,planAlan:0,mahya:0,kirmaMahya:0,dere:0,sacak:0,alin:0,bina:0,
    egim:+G.opt.egim,aci:ac,sacakCm:sac,W:W,sekil:sekil,besik:sekil==='besik'};
  keys.forEach(function(k){
    var M=makasAnalizBina(grp[k],Y);if(!M||!M.makaslar.length)return;R.bina++;
    var mk=M.makaslar,bol=[];
    for(var i=0;i<mk.length-1;i++){
      var ac2=Math.min(mk[i].acik,mk[i+1].acik),L=mk[i+1].pos-mk[i].pos;
      if(bol.length&&Math.abs(bol[bol.length-1].acik-ac2)<1)bol[bol.length-1].L+=L;else bol.push({acik:ac2,L:L});
    }
    if(!bol.length)bol.push({acik:mk[0].acik,L:0});
    bol[0].L+=dK/2+sac;bol[bol.length-1].L+=dK/2+sac;
    var anaIx=0;bol.forEach(function(b,i2){if(b.acik>bol[anaIx].acik)anaIx=i2;});
    bol.forEach(function(b,i2){
      var Wo=b.acik+dK+2*sac,r=Wo/2,Lo=b.L,uc0=i2===0,uc1=i2===bol.length-1,ana=i2===anaIx;
      var g={bina:R.bina,rol:ana?'ana':'yavru',acik:b.acik,uzun:Lo,Wo:Wo,yuz:0,adetYuz:0,boy:0,levhalar:[]};
      var plan=Lo*Wo;R.planAlan+=plan/10000;R.alan+=plan*fak/10000;
      if(sekil==='tek'){
        g.boy=Wo*fak;g.adetYuz=Math.ceil(Lo/W-1e-9);g.yuz=1;
        g.levhalar.push({boy:g.boy,adet:g.adetYuz});
        R.sacak+=Lo;R.mahya+=0;
        if(uc0)R.alin+=g.boy;if(uc1)R.alin+=g.boy;
      } else if(sekil==='kirma'){
        // uç bölümlerde kırma (üçgen alın), aradaki bölümler beşik gibi
        var hipU=(uc0?1:0)+(uc1?1:0),dikL=Math.max(0,Lo-hipU*r);
        g.boy=r*fak;g.adetYuz=Math.ceil(Lo/W-1e-9);g.yuz=2;
        g.levhalar.push({boy:g.boy,adet:g.adetYuz*2,not:'uzun yüzler (kırma uçları kesilerek)'});
        var ucAdet=Math.ceil(Wo/W-1e-9);
        if(hipU)g.levhalar.push({boy:g.boy,adet:ucAdet*hipU,not:'kırma üçgen uçlar (kesilerek)'});
        R.mahya+=dikL;R.kirmaMahya+=hipU*2*r*Math.sqrt(2+e*e);
        R.sacak+=2*Lo+hipU*Wo;
      } else { // beşik
        g.boy=r*fak;g.adetYuz=Math.ceil(Lo/W-1e-9);g.yuz=2;
        g.levhalar.push({boy:g.boy,adet:g.adetYuz*2});
        R.mahya+=Lo;R.sacak+=2*Lo;
        if(uc0)R.alin+=2*g.boy;if(uc1)R.alin+=2*g.boy;
      }
      // yavru çatı ana çatıya bağlandığı yerde 2 dere (eşit eğim: planda 45°)
      if(!ana&&sekil!=='tek'){R.dere+=2*r*Math.sqrt(2+e*e);
        // geniş bölümün açıkta kalan alın parçası
        var fark=(bol[anaIx].acik-b.acik)/2;if(sekil==='besik'&&fark>0)R.alin+=2*fark*fak;}
      g.levhalar.forEach(function(l){R.adet+=l.adet;});
      R.gruplar.push(g);
    });
  });
  if(!R.gruplar.length)return null;
  // ── katmanlar
  var O=G.opt,f=(+O.catiFire||0)/100;
  R.osbAdet=O.osb?Math.ceil(R.alan*(1+f)/(122*244/10000)-1e-9):0;
  R.suYal=R.alan*(1+(+O.suBindirme||10)/100);
  R.suRulo=Math.ceil(R.suYal/(+O.suRulo||75)-1e-9);
  var tavan=0;G.rooms.forEach(function(r2){if(r2.tip==='veranda')return;var gg=odaIcGeometri(r2);if(gg)tavan+=gg.alan;});
  R.tasyunu=tavan;
  // ── aksesuarlar: geometri → parça
  var pb=(+O.parcaBoy||200)-(+O.parcaBind||10);
  function parca(cm){return cm>0?Math.ceil(cm/pb-1e-9):0;}
  R.aks=[
    {ad:'Mahya',m:R.mahya/100,adet:parca(R.mahya)},
    {ad:'Kırma mahyası',m:R.kirmaMahya/100,adet:parca(R.kirmaMahya)},
    {ad:'Dere',m:R.dere/100,adet:parca(R.dere)},
    {ad:'Saçak (damlalık) bitişi',m:R.sacak/100,adet:parca(R.sacak)},
    {ad:'Alın (rüzgar) bitişi',m:R.alin/100,adet:parca(R.alin)},
    {ad:'Yağmur oluğu',m:R.sacak/100,adet:parca(R.sacak)}
  ];
  var inisAr=(+O.inisAralik||10)*100,inis=R.sacak>0?Math.max(sekil==='tek'?1:2,Math.ceil(R.sacak/inisAr-1e-9)):0;
  R.inis={adet:inis,boy:(+O.h||280)+30};
  R.vida=Math.ceil(R.alan*(+O.vidaM2||5));
  return R;
}
function alcipanHesap(){
  var h=(+document.getElementById('katYuk').value||280);
  var R={beyazDuvar:0,beyazTavan:0,yesilDuvar:0,yesilTavan:0,verTavan:0,kapiM2:0,pencereM2:0,kapiAdet:0,pencereAdet:0,
    dusulen:{beyaz:0,yesil:0},odalar:[]};
  // boşluk alanları (plan geneli, sağlama için)
  G.elemanlar.forEach(function(e){
    var a=e.en*(e.yuk||(e.tip_==='kapi'?210:120))/10000;
    if(e.tip_==='kapi'){R.kapiM2+=a;R.kapiAdet++;}else{R.pencereM2+=a;R.pencereAdet++;}
  });
  G.rooms.forEach(function(r){
    var geo=odaIcGeometri(r);if(!geo)return;
    var ver=r.tip==='veranda',islak=!!ALCI.ISLAK[r.tip];
    var o={ad:roomLabel(r),tip:ver?'veranda':islak?'yesil':'beyaz',tavan:geo.alan,duvarBrut:0,bosluk:0,duvarNet:0};
    o.duvarVar=!ver&&odaDuvarAlci(r);
    if(!ver){
      var cevre=0,seen={};
      geo.kenar.forEach(function(k){
        if(!k.e.seg||k.e.seg.tip==='veranda')return;
        cevre+=k.L;
        // bu duvardaki kapı/pencereler (her oda yüzü kendi boşluğunu düşer)
        if(seen[k.e.seg.id])return;seen[k.e.seg.id]=1;
        G.elemanlar.forEach(function(e){if(e.segId===k.e.seg.id)o.bosluk+=e.en*(e.yuk||(e.tip_==='kapi'?210:120))/10000;});
      });
      // oda içindeki serbest duvar uçları: iki yüz
      geo.spikes.forEach(function(sg){if(sg.tip==='veranda'||seen[sg.id])return;seen[sg.id]=1;cevre+=2*Math.max(0,_segLen(sg));
        G.elemanlar.forEach(function(e){if(e.segId===sg.id)o.bosluk+=2*e.en*(e.yuk||210)/10000;});});
      // odanın içinde bağımsız duran duvarlar (hiçbir odanın kenarı değil): iki yüz
      var rp=r.nodeIds.map(getNode);
      G.segs.forEach(function(sg){
        if(seen[sg.id]||sg.tip==='veranda')return;
        var a=getNode(sg.n1),b=getNode(sg.n2);if(!a||!b)return;
        if(r.nodeIds.indexOf(sg.n1)>=0&&r.nodeIds.indexOf(sg.n2)>=0)return;
        if(!ptInPolygon((a.x+b.x)/2,(a.y+b.y)/2,rp))return;
        if(G.rooms.some(function(r2){return r2!==r&&r2.tip!=='veranda'&&r2.area<r.area&&ptInPolygon((a.x+b.x)/2,(a.y+b.y)/2,r2.nodeIds.map(getNode));}))return;
        seen[sg.id]=1;cevre+=2*_segLen(sg);
        G.elemanlar.forEach(function(e){if(e.segId===sg.id)o.bosluk+=2*e.en*(e.yuk||210)/10000;});
      });
      o.duvarBrut=cevre*h/10000;o.duvarNet=Math.max(0,o.duvarBrut-o.bosluk);
      if(!o.duvarVar){o.duvarBrut=0;o.duvarNet=0;o.bosluk=0;} // duvar alçıpanı opsiyonu bu odada yok (tavan standart)
      if(islak){R.yesilDuvar+=o.duvarNet;R.yesilTavan+=o.tavan;R.dusulen.yesil+=o.bosluk;}
      else{R.beyazDuvar+=o.duvarNet;R.beyazTavan+=o.tavan;R.dusulen.beyaz+=o.bosluk;}
    } else R.verTavan+=o.tavan;
    R.odalar.push(o);
  });
  return R;
}
function levhaAdet(m2){return Math.ceil(m2*(1+ALCI.FIRE/100)/ALCI.LEVHA_M2-1e-9);}
function metrajKalemleri(){
  var K=[];
  function ekle(grup,kalem,olcu,birim,adet){if(adet>0)K.push({grup:grup,kalem:kalem,olcu:olcu,birim:birim,adet:adet});}
  if(isPref()){
    var M=panelMetraj(),D=M.acikDetay,h=document.getElementById('katYuk').value||280;
    [['dis','Paneller — Dış duvar ('+PF.DIS+' cm)'],['ic','Paneller — İç duvar ('+PF.IC+' cm)']].forEach(function(g){
      var d=M[g[0]];
      ekle(g[1],'Tam panel','125,5 cm','adet',d.tam);
      ekle(g[1],'Yarım panel','62,75 cm','adet',d.yarim);
      // özel paneller ölçüye göre gruplu
      var oz={};M.ozelList.forEach(function(o){if((o.dis?'dis':'ic')!==g[0])return;var k=fmtCm(o.w);oz[k]=(oz[k]||0)+1;});
      Object.keys(oz).sort(function(a,b){return parseFloat(b)-parseFloat(a);}).forEach(function(k){ekle(g[1],'Özel panel',k.replace('.',',')+' cm','adet',oz[k]);});
      Object.keys(D).filter(function(k){return k.indexOf(g[0]+'|')===0;}).sort().forEach(function(k){
        var p=k.split('|'),ad=(p[1]==='kapi'?'Kapılı ':'Pencereli ')+(p[2]==='tam'?'tam panel':p[2]==='yarim'?'yarım panel':'özel panel');
        var olcu=p[2]==='tam'?'125,5 cm':p[2]==='yarim'?'62,75 cm':(p[3]||'').replace('.',',')+' cm';
        ekle(g[1],ad,olcu,'adet',D[k]);
      });
    });
    var hh=' · h='+h;
    var BAD={H:'H profil (yan yana iki panel)',H3:"3'lü H (T birleşim, panel ekinde)",X:"4'lü H (çapraz birleşim)",
      U:'Çektirme U (panel ortasında birleşim)',kose:'Köşe direği',ozelB:'Özel birleşim (3+ duvar)',uc:'Serbest duvar ucu'};
    var BS=['H','H3','X','U','kose','ozelB','uc'];
    Object.keys(M.bagDetay).sort(function(a,b){var x=a.split('|'),y=b.split('|');return (BS.indexOf(x[0])-BS.indexOf(y[0]))||(parseFloat(y[1])-parseFloat(x[1]))||(x[2]<y[2]?-1:1);})
      .forEach(function(k){
        var p=k.split('|'),kontrol=(p[0]==='ozelB');
        var ad=bagAd(p[0],p[1],true);
        ekle(kontrol?'⚠ Kontrol edilecek':'Bağlantı elemanları',ad,(p[2]||'')+(kontrol?'':hh),'adet',M.bagDetay[k]);
      });
    if(M.xUyari)ekle('⚠ Kontrol edilecek','Çapraz birleşim panel ekinde değil','','adet',M.xUyari);
    var MK=makasAnaliz();
    if(MK){
      var byS={};var roofFrames=G.roofs&&G.roofs.length&&window.RoofWorkflow?G.roofs.flatMap(function(z){return RoofWorkflow.trusses(z).map(function(t){return {acik:Math.hypot(t.q.x-t.p.x,t.q.y-t.p.y),zone:z.name,supported:t.supported};});}):null;(roofFrames||MK.makaslar).forEach(function(m){var k=fmtCm(m.acik);byS[k]=(byS[k]||0)+1;});
      Object.keys(byS).sort(function(a,b){return parseFloat(b)-parseFloat(a);}).forEach(function(k){
        ekle((G.roofs&&G.roofs.length?'Bölgesel çatı makas aksları · mesnet kontrolü gerekli (':'Çatı (makas yönü ')+(MK.yatay?'yatay':'dikey')+', 125,5 aralık)','Çatı makası','açıklık '+k.replace('.',',')+' cm','adet',byS[k]);
      });
    }
    ekle('Duvar uzunlukları','Dış duvar',PF.DIS+' cm','m',Math.round(M.disM)/100);
    ekle('Duvar uzunlukları','İç duvar','6 cm','m',Math.round(M.icM)/100);
  }
  // Kapı ve pencereler: tip + ölçü + konum (dış/iç) bazında gruplanır
  var grp={};
  G.elemanlar.forEach(function(e){
    var seg=getSeg(e.segId);if(!seg)return;
    var isK=e.tip_==='kapi';
    var ad=isK?(KAPI_TIP_AD[e.kapiTip||'ic']||'Kapı'):(PEN_TIP_AD[e.penTip]||'Pencere');
    if(!isK)ad+=seg.dis?' (dış cephe)':' (iç duvar)';
    var olcu=fmtCm(e.en)+' × '+fmtCm(e.yuk||(isK?210:120))+' cm';
    var key=(isK?'Kapılar':'Pencereler')+'|'+ad+'|'+olcu;
    grp[key]=(grp[key]||0)+1;
  });
  Object.keys(grp).sort().forEach(function(k){var p=k.split('|');ekle(p[0],p[1],p[2],'adet',grp[k]);});
  // Alçıpan
  if(G.rooms.length){
    var AL=alcipanHesap(),fr=' · fire %'+ALCI.FIRE,lv=' · levha '+ALCI.EN+'×'+ALCI.BOY;
    function m2(v){return Math.round(v*100)/100;}
    var gB='Alçıpan — Beyaz (kuru mahaller)',gY='Alçıpan — Yeşil (ıslak mahaller + veranda tavanı)';
    if(AL.beyazDuvar>0)ekle(gB,'Beyaz alçıpan — Duvar',m2(AL.beyazDuvar).toString().replace('.',',')+' m² net'+fr,'levha',levhaAdet(AL.beyazDuvar));
    ekle(gB,'Beyaz alçıpan — Tavan',m2(AL.beyazTavan).toString().replace('.',',')+' m² net'+fr,'levha',levhaAdet(AL.beyazTavan));
    if(AL.yesilDuvar>0)ekle(gY,'Yeşil alçıpan — Duvar (banyo/WC)',m2(AL.yesilDuvar).toString().replace('.',',')+' m² net'+fr,'levha',levhaAdet(AL.yesilDuvar));
    ekle(gY,'Yeşil alçıpan — Tavan (banyo/WC)',m2(AL.yesilTavan).toString().replace('.',',')+' m² net'+fr,'levha',levhaAdet(AL.yesilTavan));
    ekle(gY,'Yeşil alçıpan — Veranda tavanı',m2(AL.verTavan).toString().replace('.',',')+' m² net'+fr,'levha',levhaAdet(AL.verTavan));
    // Dış cephe kaplaması
    var CP=cepheHesap();
    if(CP&&G.opt.cephe!=='yok'){
      var gC='Dış cephe — '+(G.opt.cephe==='tasonit'?'Taşonit':'Yalıpan')+' (zeminden saçak altına h='+CP.h+' cm)';
      ekle(gC,'Dış cephe çevresi (dış yüz)','','m',m2(CP.cevre/100));
      ekle(gC,'Dış cephe yüzeyi — brüt','çevre × h','m²',m2(CP.brut));
      ekle(gC,'Dış duvar boşlukları','kapı '+m2(CP.kapi).toString().replace('.',',')+' + pencere '+m2(CP.pen).toString().replace('.',','),'m²',m2(CP.bosluk));
      ekle(gC,'Dış cephe yüzeyi — net','','m²',m2(CP.net));
      if(CP.plaka)ekle(gC,(G.opt.cephe==='tasonit'?'Taşonit':'Yalıpan')+' plaka',
        CP.plaka.en+'×'+CP.plaka.boy+(G.opt.cephe==='yalipan'?' · ilk sıra '+CP.plaka.en+', sonra '+CP.etkinEn+' cm (bindirme '+G.opt.bindirme+')':'')+' · '+CP.sira+' sıra · fire %'+(+G.opt.cepheFire||0),'plaka',CP.adet);
      else ekle(gC,'⚠ Plaka ölçüsü okunamadı','örn. 40x250','',0);
    }
    // Çatı
    var CT=(window.RoofStudio&&G.roofs&&G.roofs.length)?null:catiHesap();

    if(CT){
      var kap=G.opt.kaplama==='sandvic'?'Sandviç panel':'Trapez';
      var sk={besik:'beşik',kirma:'kırma',tek:'tek yön'}[CT.sekil];
      var gT='Çatı — '+kap+' ('+sk+', eğim %'+CT.egim+' ≈ '+(Math.round(CT.aci*10)/10)+'°, saçak '+CT.sacakCm+' cm)';
      CT.gruplar.forEach(function(g2){
        g2.levhalar.forEach(function(l){
          ekle(gT,kap+' — '+(g2.rol==='ana'?'ana çatı':'yavru çatı')+(CT.bina>1?' (bina '+g2.bina+')':'')+(l.not?' · '+l.not:''),
            CT.W+' × '+fmtCm(Math.round(l.boy*10)/10)+' cm · mahya boyunca '+fmtCm(Math.round(g2.uzun*10)/10)+' cm','adet',l.adet);
        });
      });
      ekle(gT,kap+' toplam alan','plan '+m2(CT.planAlan).toString().replace('.',',')+' m² × eğim','m²',m2(CT.alan));
      var gK='Çatı — Katmanlar';
      if(G.opt.osb)ekle(gK,'OSB','122×244 · fire %'+(+G.opt.catiFire||0),'plaka',CT.osbAdet);
      ekle(gK,'Su yalıtım örtüsü','bindirme %'+(+G.opt.suBindirme||10)+' · '+m2(CT.suYal).toString().replace('.',',')+' m² · rulo '+(+G.opt.suRulo||75)+' m²','rulo',CT.suRulo);
      ekle(gK,'Taş yünü 8 cm (ısı yalıtımı)','tavan alanı, saçaklar hariç','m²',m2(CT.tasyunu));
      var gA='Çatı — Aksesuarlar (parça '+(+G.opt.parcaBoy||200)+' cm, bindirme '+(+G.opt.parcaBind||10)+' cm)';
      CT.aks.forEach(function(a){if(a.m>0)ekle(gA,a.ad,m2(a.m).toString().replace('.',',')+' m','adet',a.adet);});
      ekle(gA,'İniş borusu','her '+(+G.opt.inisAralik||10)+' m oluğa 1 · boy ~'+CT.inis.boy+' cm','adet',CT.inis.adet);
      ekle(gA,'Çatı vidası',(+G.opt.vidaM2||5)+' adet/m²','adet',CT.vida);
    }
    var gS='Boşluklar (sağlama)';
    ekle(gS,'Kapı boşlukları','toplam '+AL.kapiAdet+' kapı','m²',m2(AL.kapiM2));
    ekle(gS,'Pencere boşlukları','toplam '+AL.pencereAdet+' pencere','m²',m2(AL.pencereM2));
    ekle(gS,'Beyaz duvardan düşülen','kapı + pencere, iki yüz ayrı','m²',m2(AL.dusulen.beyaz));
    ekle(gS,'Yeşil duvardan düşülen','kapı + pencere, iki yüz ayrı','m²',m2(AL.dusulen.yesil));
    var gO='Alçıpan — Oda bazında (h='+(+document.getElementById('katYuk').value||280)+' cm'+lv+')';
    AL.odalar.sort(function(a,b){return (a.tip==='veranda')-(b.tip==='veranda');});
    AL.odalar.forEach(function(o){
      var renk=o.tip==='beyaz'?'Beyaz':'Yeşil';
      if(o.tip==='veranda')ekle(gO,o.ad+' — tavan (yeşil)','','m²',m2(o.tavan));
      else{
        ekle(gO,o.ad+' — tavan ('+renk.toLowerCase()+')','','m²',m2(o.tavan));
        if(o.duvarVar)ekle(gO,o.ad+' — duvar ('+renk.toLowerCase()+')','brüt '+m2(o.duvarBrut).toString().replace('.',',')+' − boşluk '+m2(o.bosluk).toString().replace('.',','),'m²',m2(o.duvarNet));
      }
    });
  }
  if(window.RoofStudio&&G.roofs&&G.roofs.length)RoofStudio.billRows().forEach(function(r){ekle(r.grup,r.kalem,r.olcu,r.birim,r.miktar);});
  // Oda özeti (önce odalar, sonra verandalar)
  G.rooms.slice().sort(function(a,b){return (a.tip==='veranda')-(b.tip==='veranda');}).forEach(function(r){ekle(r.tip==='veranda'?'Verandalar':'Odalar',roomLabel(r),'aks ölçüsü','m²',Math.round(r.area*100)/100);});
  return K;
}
function metrajAc(){
  var K=metrajKalemleri(),html='',son=null;
  if(!K.length)html='<div style="color:#8b949e;font-size:12px">Henüz sayılacak bir şey yok — önce plan çizin.</div>';
  else{
    html='<table class="mt"><thead><tr><th>Kalem</th><th>Ölçü</th><th style="text-align:right">Miktar</th></tr></thead><tbody>';
    K.forEach(function(k){
      if(k.grup!==son){html+='<tr class="mg"><td colspan="3">'+esc(k.grup)+'</td></tr>';son=k.grup;}
      html+='<tr><td>'+esc(k.kalem)+'</td><td>'+esc(k.olcu)+'</td><td style="text-align:right;font-variant-numeric:tabular-nums"><b>'+
        String(k.adet).replace('.',',')+'</b> '+k.birim+'</td></tr>';
    });
    html+='</tbody></table>';
  }
  document.getElementById('metrajIc').innerHTML=html;
  document.getElementById('mbgMet').classList.add('open');
}
function metrajCSV(){
  var K=metrajKalemleri();
  var rows=[['Grup','Kalem','Ölçü','Miktar','Birim']].concat(K.map(function(k){return[k.grup,k.kalem,k.olcu,String(k.adet).replace('.',','),k.birim];}));
  var csv='\ufeff'+rows.map(function(r){return r.map(function(c){c=String(c);return /[;"\n]/.test(c)?'"'+c.replace(/"/g,'""')+'"':c;}).join(';');}).join('\r\n');
  var a=document.createElement('a');a.href=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'}));
  a.download='metraj_'+new Date().toLocaleDateString('tr-TR').replace(/\./g,'-')+'.csv';a.click();
}
function metrajYazdir(){
  var w=window.open('','_blank');if(!w){alert('Açılır pencere engellendi.');return;}
  w.document.write('<html><head><meta charset="utf-8"><title>Metraj</title><style>body{font-family:Inter,Segoe UI,sans-serif;padding:24px;color:#222}'+
    'h2{margin:0 0 4px}small{color:#777}table{border-collapse:collapse;width:100%;margin-top:14px;font-size:13px}td,th{padding:5px 8px;border-bottom:1px solid #e3e3e3;text-align:left}'+
    '.mg td{background:#f3f4f6;font-weight:700;padding-top:9px}</style></head><body><h2>PREFABRİKTEN YAPI A.Ş. — Metraj Listesi</h2><small>'+
    (isPref()?'Prefabrik panel sistemi (125,5 / 62,75)':'Hafif çelik')+' · '+new Date().toLocaleDateString('tr-TR')+'</small>'+
    document.getElementById('metrajIc').innerHTML+'</body></html>');
  w.document.close();w.focus();w.print();
}

function pnlEtiketToggle(){
  G.pnlEtiket=!G.pnlEtiket;
  var b=document.getElementById('pnlNoBtn');if(b)b.classList.toggle('son',G.pnlEtiket);
  draw();
}
// ═══ ÇATI MAKASI ═════════════════════════════════════════════════════════
// Çatı makası yönü köşe direklerini belirler: makas yönüne PARALEL duvarlar köşede aksa kadar devam eder
// (dış yüzden 5 cm), dik duvarlar onların iç yüzünden başlar (dış yüzden 10 cm).
// Makaslar makas yönü boyunca ilk dış duvar aksından başlayıp 125,5'te bir atılır; sonda kalan
// mesafe (ör. 62,75) varsa son makas bina bitiminde atılır.
function catiYatay(){return (G.catiYon||'yatay')==='yatay';}
// Bağlı bileşenler (ayrı binalar): node → bileşen no
function _bilesenler(){
  var par={};function f(x){while(par[x]!==x){par[x]=par[par[x]];x=par[x];}return x;}
  G.nodes.forEach(function(n){par[n.id]=n.id;});
  G.segs.forEach(function(s){if(s.tip==='veranda'||par[s.n1]===undefined||par[s.n2]===undefined)return;var a=f(s.n1),b=f(s.n2);if(a!==b)par[a]=b;});
  var out={};G.nodes.forEach(function(n){out[n.id]=f(n.id);});return out;
}
function makasAnaliz(){
  // Her bina (bağlı bileşen) kendi makas dizisini alır
  var comp=_bilesenler(),grp={};
  G.segs.forEach(function(s){if(s.dis&&s.tip!=='veranda'&&getNode(s.n1)&&getNode(s.n2)){var c=comp[s.n1];(grp[c]=grp[c]||[]).push(s);}});
  var keys=Object.keys(grp);if(!keys.length||!G.rooms.some(function(r){return r.tip!=='veranda';}))return null;
  var Y=catiYatay(),tum=[],ilk=null,no=0;
  keys.map(function(k){return makasAnalizBina(grp[k],Y);}).filter(Boolean)
    .sort(function(a,b){return (a.minD-b.minD)||(a.lo-b.lo);})
    .forEach(function(M){if(!ilk)ilk=M;M.makaslar.forEach(function(m){m.no=++no;tum.push(m);});});
  if(!ilk)return null;
  return{makaslar:tum,lo:ilk.lo,hi:ilk.hi,kalan:ilk.kalan,yatay:Y,bina:keys.length};
}
function makasAnalizBina(dis,Y){
  function al(n){return Y?n.x:n.y;}   // makas ilerleme ekseni
  function dik(n){return Y?n.y:n.x;}  // makas açıklık ekseni
  var lo=Infinity,hi=-Infinity;
  dis.forEach(function(s){[getNode(s.n1),getNode(s.n2)].forEach(function(n){lo=Math.min(lo,al(n));hi=Math.max(hi,al(n));});});
  if(hi-lo<1)return null;
  var pos=[],p=lo;
  while(p<=hi+0.6){pos.push(Math.min(p,hi));p+=PF.PANEL;}
  var son=pos[pos.length-1],kalan=hi-son;
  if(kalan>0.6)pos.push(hi);
  var makaslar=pos.map(function(q,i){
    var cs=[];
    dis.forEach(function(s){
      var a=getNode(s.n1),b=getNode(s.n2),aa=al(a),ab=al(b);
      if(Math.abs(aa-ab)<0.01){ // makasa paralel duvar: tam bu konumdaysa uçlarını al
        if(Math.abs(aa-q)<0.6){cs.push(dik(a));cs.push(dik(b));}
        return;
      }
      if(q<Math.min(aa,ab)-0.6||q>Math.max(aa,ab)+0.6)return;
      var t=(q-aa)/(ab-aa);t=Math.max(0,Math.min(1,t));
      cs.push(dik(a)+(dik(b)-dik(a))*t);
    });
    if(cs.length<2)return null;
    var m0=Math.min.apply(null,cs),m1=Math.max.apply(null,cs);
    return{no:i+1,pos:q,a:m0,b:m1,acik:m1-m0,aralik:i?q-pos[i-1]:0};
  }).filter(Boolean);
  var minD=Math.min.apply(null,makaslar.map(function(m){return m.a;}).concat([Infinity]));
  return{makaslar:makaslar,lo:lo,hi:hi,kalan:kalan>0.6?kalan:0,yatay:Y,minD:minD};
}
function drawMakas(){
  if(!isPref()||!G.makasGoster)return;
  var M=makasAnaliz();if(!M)return;
  var s=sc(),Y=M.yatay;
  function P(al,dk){return Y?toCv(al,dk):toCv(dk,al);}
  ctx.save();
  ctx.strokeStyle=TH.makas;ctx.lineWidth=1.2;ctx.setLineDash([7,5]);
  M.makaslar.forEach(function(m){
    var p1=P(m.pos,m.a),p2=P(m.pos,m.b);
    ctx.beginPath();ctx.moveTo(p1.x,p1.y);ctx.lineTo(p2.x,p2.y);ctx.stroke();
  });
  ctx.setLineDash([]);
  // numaralar (açıklığın dış ucunda)
  ctx.font='600 10px '+FF;ctx.fillStyle=TH.makas;ctx.textAlign='center';ctx.textBaseline='middle';
  M.makaslar.forEach(function(m){
    var p=P(m.pos,m.a-(52/s));
    ctx.fillText('M'+m.no,p.x,p.y);
  });
  // yön oku: binanın başlangıç köşesinin dışında (ölçülerin ötesinde)
  var minD=Math.min.apply(null,M.makaslar.map(function(m){return m.a;}));
  var c0=P(M.lo,minD),L=64;
  ctx.strokeStyle=TH.makas;ctx.fillStyle=TH.makas;ctx.lineWidth=1.8;ctx.font='600 11px '+FF;
  if(Y){
    var ox=c0.x,oy=c0.y-72;
    ctx.beginPath();ctx.moveTo(ox,oy);ctx.lineTo(ox+L,oy);ctx.moveTo(ox+L-9,oy-5);ctx.lineTo(ox+L,oy);ctx.lineTo(ox+L-9,oy+5);ctx.stroke();
    ctx.textAlign='left';ctx.textBaseline='bottom';ctx.fillText('Çatı makası yönü',ox,oy-6);
  } else {
    var ox2=c0.x-78,oy2=c0.y;
    ctx.beginPath();ctx.moveTo(ox2,oy2);ctx.lineTo(ox2,oy2+L);ctx.moveTo(ox2-5,oy2+L-9);ctx.lineTo(ox2,oy2+L);ctx.lineTo(ox2+5,oy2+L-9);ctx.stroke();
    ctx.save();ctx.translate(ox2-8,oy2+L/2);ctx.rotate(-Math.PI/2);
    ctx.textAlign='center';ctx.textBaseline='bottom';ctx.fillText('Çatı makası yönü',0,0);ctx.restore();
  }
  ctx.restore();
}
function catiYonCevir(){catiYonAyarla(catiYatay()?'dikey':'yatay');}
// Makas yönünü ayarla; eskiden panel ekinde (3'lü H / 4'lü H) olan birleşimler yeni yönde eke
// denk gelmiyorsa, o bölme duvarlarını yeni eklere kaydırmayı teklif et (tek geri alma adımı)
function catiYonAyarla(yon,sorma){
  if(yon===G.catiYon){catiBtnGuncelle();return;}
  pushH();
  var eski=isPref()&&G.segs.length?pfAnaliz():null;
  // eski yönde ekte olan T birleşimleri: {nid, thru run yönü, pos}
  var ekteydi=[];
  if(eski)eski.bag.forEach(function(b){if((b.tip==='H3'||b.tip==='X')&&b.nid)ekteydi.push(b.nid);});
  G.catiYon=yon;
  G.nodes.forEach(function(n){delete n.koseTers;});
  catiBtnGuncelle();
  if(isPref()&&ekteydi.length){
    var oner=pfKaydirmaOnerileri(ekteydi);
    if(oner.length){
      var ozet=oner.map(function(o){return fmtCm(Math.abs(o.d))+' cm';});
      var tek=ozet.filter(function(v,i){return ozet.indexOf(v)===i;}).join(', ');
      if(sorma||confirm('Makas yönü değişti: panel ekleri kaydı.\n\n'+oner.length+' bölme duvarı eskiden panel ekindeydi (3\'lü H), yeni yönde panelin ortasına düşüyor.\n\nBu duvarlar yeni eklere kaydırılsın mı? ('+tek+')\n\nİptal: duvarlar yerinde kalır, o birleşimler çektirme U sayılır.')){
        oner.forEach(function(o){o.nodes.forEach(function(nid){var n=getNode(nid);if(n){n.x+=o.dx;n.y+=o.dy;}});});
        normalizeGraph();
      }
    }
  }
  detectRooms();draw();updateSidebar();
}
// ekteydi: eski yönde ekte olan birleşim node'ları. Yeni analize göre ekte olmayanlar için,
// kol duvar hattını ana duvar boyunca en yakın eke kaydırma önerisi üretir.
// H'a çok yakın (≤12 cm) ama tam ekte olmayan T birleşimleri (çektirme U sayılanlar) → eke kaydırma önerisi
function pfYakinUOnerileri(){
  if(!isPref())return[];
  var A=pfAnaliz(),nids=[];
  A.bag.forEach(function(b){
    if(b.tip!=='U'||!b.nid||!b.run||b.uc)return;
    var yak=b.run.slots.some(function(p,i){return i>0&&Math.abs(p.a-b.pos)>PF_TOL&&Math.abs(p.a-b.pos)<=12;});
    if(yak&&nids.indexOf(b.nid)<0)nids.push(b.nid);
  });
  return nids.length?pfKaydirmaOnerileri(nids):[];
}
function pfUHaOturt(){
  var oner=pfYakinUOnerileri();if(!oner.length)return;
  pushH();
  oner.forEach(function(o){o.nodes.forEach(function(nid){var n=getNode(nid);if(n){n.x+=o.dx;n.y+=o.dy;}});});
  normalizeGraph();detectRooms();draw();updateSidebar();
}
function pfKaydirmaOnerileri(ekteydi){
  var A=pfAnaliz(),out=[],islenen={};
  var ni={};
  A.runs.forEach(function(r){r.nodes.forEach(function(nd,i){var o=ni[nd.nid]=ni[nd.nid]||{thru:[],ends:[]};
    if(i===0||i===r.nodes.length-1)o.ends.push(r);else o.thru.push({run:r,pos:nd.pos});});});
  ekteydi.forEach(function(nid){
    var o=ni[nid];if(!o||o.thru.length!==1||!o.ends.length)return;
    var t=o.thru[0],ek=t.run.slots.some(function(p,i){return i>0&&Math.abs(p.a-t.pos)<=PF_TOL;});
    if(ek)return;
    // en yakın ek (≤ 12 cm)
    var best=null;
    t.run.slots.forEach(function(p,i){if(i===0)return;var d=p.a-t.pos;if(Math.abs(d)<=12&&(best===null||Math.abs(d)<Math.abs(best)))best=d;});
    if(best===null)return;
    o.ends.forEach(function(br){
      if(islenen[br.owner.id])return;
      var dx=t.run.ux*best,dy=t.run.uy*best;
      // kol hattının tüm node'ları; bağlı diğer duvarlar kayma yönüne paralel olmalı (yamulmasın)
      var nset={};br.nodes.forEach(function(nd){nset[nd.nid]=1;});
      var runSeg={};br.items.forEach(function(it){runSeg[it.seg.id]=1;});
      var ok=true,L=Math.hypot(dx,dy);
      G.segs.forEach(function(s){
        if(runSeg[s.id])return;
        var a=nset[s.n1],b=nset[s.n2];if(!a&&!b)return;
        if(a&&b){ok=false;return;}
        var p=getNode(s.n1),q=getNode(s.n2),sl=Math.hypot(q.x-p.x,q.y-p.y);if(sl<1)return;
        var cos=Math.abs(((q.x-p.x)*dx+(q.y-p.y)*dy)/(sl*L));
        if(cos<0.999)ok=false;
      });
      if(!ok)return;
      islenen[br.owner.id]=1;
      out.push({nodes:Object.keys(nset),dx:dx,dy:dy,d:best});
    });
  });
  return out;
}
// Prefabrik başlangıcında makas yönünü sor
function catiSor(){document.getElementById('mbgCati').classList.add('open');}
function catiSecildi(yon){
  document.getElementById('mbgCati').classList.remove('open');
  catiYonAyarla(yon);
}
function catiBtnGuncelle(){
  var b=document.getElementById('catiBtn');if(b)b.textContent='🏠 '+(catiYatay()?'→':'↓');
  var m=document.getElementById('makasBtn');if(m)m.classList.toggle('son',!!G.makasGoster);
}
function makasToggle(){G.makasGoster=!G.makasGoster;catiBtnGuncelle();draw();}
function setSistem(v,sessiz){
  G.sistem=v==='prefabrik'?'prefabrik':'celik';
  var gs=document.getElementById('gridSel');
  if(isPref()){
    gs.innerHTML='<option value="62.75">62,75 (½ panel)</option><option value="125.5">125,5 (1 panel)</option><option value="10">10 cm (serbest)</option>';
    G.gridCm=62.75;gs.value='62.75';
    DK=DK_PREF;if(DK_PREF.indexOf(G.defaultK)<0)G.defaultK=PF.DIS;
  } else {
    gs.innerHTML='<option value="1">1 cm</option><option value="5">5 cm</option><option value="10">10 cm</option><option value="25">25 cm</option><option value="50">50 cm</option><option value="100">100 cm</option>';
    G.gridCm=10;gs.value='10';
    DK=DK_CELIK;G.defaultK=14;
  }
  buildDK();
  var ss=document.getElementById('sistemSel');if(ss)ss.value=G.sistem;
  document.getElementById('panelBox').style.display=isPref()?'':'none';
  optPanelGuncelle();
  document.getElementById('pnlNoBtn').style.display=isPref()?'':'none';
  document.getElementById('catiBtn').style.display=isPref()?'':'none';
  document.getElementById('makasBtn').style.display=isPref()?'':'none';
  document.getElementById('olcuBtn').style.display=isPref()?'':'none';
  document.getElementById('yakalaSel').style.display=isPref()?'':'none';
  catiBtnGuncelle();
  var hb=document.getElementById('hcBtn');if(hb)hb.style.opacity=isPref()?'0.55':'1';
  if(!sessiz){
    if(isPref()&&G.segs.length){pushH();G.segs.forEach(function(s){delete s.kSabit;});}
    detectRooms();updateSidebar();draw();
    if(isPref())catiSor();
  }
}

function buildDK(){
  document.getElementById('dkList').innerHTML=DK.map(function(v){
    return '<button class="dk'+(v===G.defaultK?' on':'')+'" onclick="setDK('+v+')">'+v+'</button>';
  }).join('');
}
function setDK(v){G.defaultK=v;buildDK();}
buildDK();

// ═══ TOGGLELER ═══════════════════════════════════════════════════════════
function toggleSnap(){G.snapGrid=!G.snapGrid;var b=document.getElementById('snapG-btn');b.className='t '+(G.snapGrid?'son':'');b.textContent=G.snapGrid?'🧲 Snap':'· Snap';}
function toggleSnapW(){G.snapWall=!G.snapWall;var b=document.getElementById('snapW-btn');b.className='t '+(G.snapWall?'son':'');b.textContent=G.snapWall?'📌 Nokta Snap':'· Nokta Snap';}

// ═══ ARAÇ ════════════════════════════════════════════════════════════════
var TOOLS=['sec','duvar','veranda','kapi','pencere'];
function cizimAraci(){return G.tool==='duvar'||G.tool==='veranda';}
function setTool(t){
  // Duvar çizimini iptal et
  if(G.drawing){G.drawing=false;G.drawChain=false;G.drawStart=null;G.drawPreviewPt=null;}
  G.tool=t;
  TOOLS.forEach(function(x){var b=document.getElementById('t-'+x);if(b)b.classList.toggle('on',x===t);});
  cwrap.style.cursor=t==='sec'?'default':'crosshair';
  updateStatus();draw();
}

// ═══ KOORDİNAT ══════════════════════════════════════════════════════════
function sc(){return G.scale*G.zoom;}
function toCv(cx,cy){return{x:cx*sc()+G.pan.x,y:cy*sc()+G.pan.y};}
function toCm(px,py){return{x:(px-G.pan.x)/sc(),y:(py-G.pan.y)/sc()};}
function snapGrid(v){var g=G.gridCm;return Math.round(v/g)*g;}
function dist(ax,ay,bx,by){return Math.hypot(bx-ax,by-ay);}

// ═══ SNAP HESABI ═════════════════════════════════════════════════════════
// ═══ DUVAR ÜSTÜ SNAP ═════════════════════════════════════════════════════
// Fare bir duvarın üzerindeyse nokta duvar aksına oturur; duvar boyunca 5 cm adım.
// Mıknatıslar: panel eki (ayrıca), panel ortası (prefabrik), duvar ortası (çelik).
// Çizim sırasında hedef duvara eksen doğrultusunda (dik) varılır → duvar yamulmaz.
// Özel ölçüden başlatma: duvar aracında (çizim başlamadan) fare bir duvarın üstündeyken sayı yazıp Enter →
// en yakın H'tan (panel ekinden) fareye doğru o kadar cm ileride duvar başlar
function duvarBul(cm){
  var s=sc(),best=null;
  G.segs.forEach(function(sg){
    if(sg.tip==='veranda')return;var a=getNode(sg.n1),b=getNode(sg.n2);if(!a||!b)return;
    var L=dist(a.x,a.y,b.x,b.y);if(L<1)return;var ux=(b.x-a.x)/L,uy=(b.y-a.y)/L;
    var t=(cm.x-a.x)*ux+(cm.y-a.y)*uy;if(t<0||t>L)return;
    var d=Math.abs((cm.x-a.x)*uy-(cm.y-a.y)*ux);if(d>sg.k/2+8/s)return;
    if(!best||d<best.d)best={sg:sg,a:a,ux:ux,uy:uy,L:L,t:t,d:d};
  });
  return best;
}
function ozelOlcuHedef(v){
  var B=G.mouseCm?duvarBul(G.mouseCm):null;if(!B)return null;
  var js=(G._ekT||[]).filter(function(p){return p.segId===B.sg.id;}).map(function(p){return p.t;});
  js.push(0,B.L); // segment uçları da referans olabilir
  var tj=js.reduce(function(a,b){return Math.abs(b-B.t)<Math.abs(a-B.t)?b:a;});
  var yon=B.t>=tj?1:-1,t=Math.max(0,Math.min(B.L,tj+yon*v));
  return{x:B.a.x+B.ux*t,y:B.a.y+B.uy*t,ref:tj,t:t,B:B};
}
function ozelBaslat(){
  var v=parseFloat(G.numBuf.replace(',','.'));G.numBuf='';
  var h=v>=0?ozelOlcuHedef(v):null;if(!h){draw();return;}
  G.drawing=true;G.drawChain=true;G.drawStart=addNode(h.x,h.y);G.drawPreviewPt={x:h.x,y:h.y};G.snapPt={x:h.x,y:h.y};
  draw();
}
function duvarUstuSnap(cm){
  var s=sc(),best=null;
  G.segs.forEach(function(sg){
    if(sg.tip==='veranda')return;
    var a=getNode(sg.n1),b=getNode(sg.n2);if(!a||!b)return;
    var L=dist(a.x,a.y,b.x,b.y);if(L<1)return;
    var ux=(b.x-a.x)/L,uy=(b.y-a.y)/L;
    var t=(cm.x-a.x)*ux+(cm.y-a.y)*uy;if(t<0||t>L)return;
    var d=Math.abs((cm.x-a.x)*uy-(cm.y-a.y)*ux);
    var tol=sg.k/2+8/s;
    if(d>tol)return;
    if(!best||d<best.d)best={sg:sg,a:a,ux:ux,uy:uy,L:L,t:t,d:d};
  });
  if(!best)return null;
  var B=best,t=B.t;
  // Çizerken: başlangıçtan eksen doğrultusunda hedef duvarı kes
  if(G.drawing&&G.drawStart){
    var sn=getNode(G.drawStart);
    if(sn){
      var dx=cm.x-sn.x,dy=cm.y-sn.y,yat=Math.abs(dx)>=Math.abs(dy);
      var ex=yat?1:0,ey=yat?0:1,den=ex*B.uy-ey*B.ux;
      if(Math.abs(den)>0.2){ // duvar çizim yönüne yeterince dik
        var tt=((sn.x-B.a.x)*ey-(sn.y-B.a.y)*ex)/(B.ux*ey-B.uy*ex);
        if(tt>=0&&tt<=B.L){
          G._ekKaydir=null;
          if(isPref()){
            // hedef duvarda H'a (panel ekine) 12 cm'den yakın mı?
            var hj=null;(G._ekT||[]).forEach(function(p){if(p.segId===B.sg.id&&Math.abs(p.t-tt)>0.3&&Math.abs(p.t-tt)<=12&&(!hj||Math.abs(p.t-tt)<Math.abs(hj.t-tt)))hj=p;});
            if(hj){
              var derece=G.segs.filter(function(q){return q.n1===sn.id||q.n2===sn.id;}).length;
              var fark=hj.t-tt;
              if(derece===0&&!G._basH){ // yeni başlatılmış, H'ta olmayan başlangıç → başlangıcı kaydır, iki uç da düz kalsın
                G._ekKaydir={dx:B.ux*fark,dy:B.uy*fark};
                return{x:B.a.x+B.ux*hj.t,y:B.a.y+B.uy*hj.t,label:'H\'a oturtuldu (başlangıç '+fmtCm(Math.abs(fark))+' cm kaydı)',k:B.sg.k};
              }
              return{x:B.a.x+B.ux*tt,y:B.a.y+B.uy*tt,label:'⚠ H\'tan '+fmtCm(Math.abs(fark))+' cm — çektirme U olur',k:B.sg.k};
            }
          }
          return{x:B.a.x+B.ux*tt,y:B.a.y+B.uy*tt,label:null,k:B.sg.k};
        }
      }
    }
  }
  var mag=10/s,lbl=null;
  // H (panel eki) en güçlü mıknatıs: 12 cm içinde her şeyden önce
  if(isPref()&&!G.altKey){
    var hb2=Math.max(12,mag),ht=null;
    (G._ekT||[]).forEach(function(p){if(p.segId===B.sg.id){var d=Math.abs(p.t-t);if(d<hb2){hb2=d;ht=p.t;}}});
    if(ht!==null){t=ht;lbl='H (panel eki)';}
  }
  // Hizalama: başka bir düğümle aynı çizgiye (yatay duvarda aynı x, dikey duvarda aynı y) — en öncelikli
  var dikDuvar=Math.abs(B.ux)<0.05,yatDuvar=Math.abs(B.uy)<0.05;
  var kilitli=isPref()&&G.duvarYakala!=='serbest'&&!G.altKey; // kilitli: yalnız H ve panel ortası
  if(!lbl&&!kilitli&&(dikDuvar||yatDuvar)){
    var hb=mag;
    G.nodes.forEach(function(n){
      if(n.id===B.sg.n1||n.id===B.sg.n2)return;
      var tn=dikDuvar?(n.y-B.a.y)/B.uy:(n.x-B.a.x)/B.ux;
      if(tn<=0||tn>=B.L)return;
      var d=Math.abs(tn-t);if(d<hb){hb=d;t=tn;lbl='hizalı';}
    });
  }
  // Prefabrik: aynı duvara bağlı diğer bölme duvarlarından modüler uzaklık (aradaki panel alanı 62,75'in katı)
  if(!lbl&&!kilitli&&isPref()&&(dikDuvar||yatDuvar)){
    var kn=G.defaultK,mb=mag,mt=null,mm=0;
    G.nodes.forEach(function(n){
      var tn=dikDuvar?(n.y-B.a.y)/B.uy:(n.x-B.a.x)/B.ux;
      var off=dikDuvar?Math.abs(n.x-B.a.x):Math.abs(n.y-B.a.y);if(off>1)return; // host duvar çizgisinde
      var ko=0;
      // yalnız İÇ bölme duvarlarından (dış köşelerden değil)
      G.segs.forEach(function(q){if(q.tip==='veranda'||q.dis||(q.n1!==n.id&&q.n2!==n.id))return;if(!isParallel(q,B.sg))ko=Math.max(ko,q.k);});
      if(!ko)return;
      for(var m=1;m<=6;m++){[-1,1].forEach(function(sg){
        var tc=tn+sg*(ko/2+kn/2+m*PF.YARIM);if(tc<=0||tc>=B.L)return;
        var dd=Math.abs(tc-t);if(dd<mb){mb=dd;mt=tc;mm=m*PF.YARIM;}
      });}
    });
    if(mt!==null){t=mt;lbl='modüler aralık '+fmtCm(mm);}
  }
  if(!lbl&&isPref()&&G._pnlOrta){ // panel ortası mıknatısı
    G._pnlOrta.forEach(function(p){if(p.segId!==B.sg.id)return;var d=Math.abs(p.t-t);if(d<mag){mag=d;t=p.t;lbl='panel ortası';}});
  }
  if(!lbl&&!isPref()&&Math.abs(t-B.L/2)<mag){t=B.L/2;lbl='orta';}
  if(!lbl&&isPref()&&G.duvarYakala!=='serbest'&&!G.altKey){
    // KİLİTLİ: yalnız H (panel eki), panel ortası ve modüler aralık noktaları — serbest nokta yok
    var ad=[];
    (G._ekT||[]).forEach(function(p){if(p.segId===B.sg.id)ad.push({t:p.t,l:'H (panel eki)'});});
    (G._pnlOrta||[]).forEach(function(p){if(p.segId===B.sg.id)ad.push({t:p.t,l:'panel ortası'});});
    if(ad.length){
      var bb=null;ad.forEach(function(c){if(!bb||Math.abs(c.t-t)<Math.abs(bb.t-t))bb=c;});
      t=bb.t;lbl=bb.l;
    }
  }
  if(!lbl){var st=G.altKey?1:5;t=Math.round(t/st)*st;t=Math.max(0,Math.min(B.L,t));}
  // prefabrik: en yakın panel ekine mesafe etiketi
  if(isPref()&&G._ekNok&&G._ekNok.length){
    var px=B.a.x+B.ux*t,py=B.a.y+B.uy*t,md=Infinity;
    G._ekNok.forEach(function(p){var d=dist(px,py,p.x,p.y);if(d<md)md=d;});
    if(md<PF.PANEL&&md>0.5)lbl=(lbl?lbl+' · ':'')+'ekten '+fmtCm(md)+' cm';
  }
  return{x:B.a.x+B.ux*t,y:B.a.y+B.uy*t,label:lbl,k:B.sg.k};
}

// ═══ HIZLI ÇİZİM: SAYI İLE DUVAR ═════════════════════════════════════════
// Çizim sırasında sayı yazıp Enter: prefabrikte PANEL adedi (9 → 9 tam panel, 8.5 → 8 tam + yarım;
// 40'tan büyük sayı cm kabul edilir), çelikte cm. Yön: farenin olduğu eksen (fare başlangıçtaysa makas yönü).
G.numBuf='';
function _cizimYon(sn){
  var m=G.drawPreviewPt||G.snapPt,dx=m?m.x-sn.x:0,dy=m?m.y-sn.y:0;
  if(Math.hypot(dx,dy)*sc()<12){return catiYatay()?{x:1,y:0}:{x:0,y:1};}
  return Math.abs(dx)>=Math.abs(dy)?{x:dx>=0?1:-1,y:0}:{x:0,y:dy>=0?1:-1};
}
function pfBasPay(sn,yat){ // makasa dik duvarda başlangıç duvarının yarı kalınlığı
  var s0=0;
  G.segs.forEach(function(s){
    if(s.tip==='veranda'||(s.n1!==sn.id&&s.n2!==sn.id))return;
    var o=getNode(s.n1===sn.id?s.n2:s.n1),vx=o.x-sn.x,vy=o.y-sn.y,vl=Math.hypot(vx,vy);if(vl<1)return;
    var par=yat?Math.abs(vy)/vl<0.05:Math.abs(vx)/vl<0.05;
    if(!par)s0=Math.max(s0,s.k/2);
  });
  return s0;
}
function numUzunluk(sn,dir,v){
  if(!isPref()||v>40)return{L:v,acik:fmtCm(v)+' cm'};
  // Makasa dik duvar iki ucunda da köşe/birleşim yüzünden başlar → aks boyu = paneller + iki yarı kalınlık
  var yat=dir.y===0,paralel=catiYatay()?yat:!yat;
  var s0=paralel?0:(pfBasPay(sn,yat)||G.defaultK/2),s1=paralel?0:G.defaultK/2;
  var tam=Math.floor(v+1e-9),yarim=(v-tam)>=0.25?1:0;
  var L=s0+s1+tam*PF.PANEL+yarim*PF.YARIM;
  return{L:L,acik:(tam?tam+' tam':'')+(yarim?(tam?' + ':'')+'1 yarım':'')+' panel = '+fmtCm(L)+' cm aks'+(s0+s1?' (köşe payı '+fmtCm(s0)+'+'+fmtCm(s1)+')':'')};
}
function numUygula(){
  var v=parseFloat(G.numBuf.replace(',','.'));G.numBuf='';
  if(!(v>0)||!G.drawing||!G.drawStart){draw();return;}
  var sn=getNode(G.drawStart);if(!sn){draw();return;}
  var dir=_cizimYon(sn),U=numUzunluk(sn,dir,v);
  var ex=sn.x+dir.x*U.L,ey=sn.y+dir.y*U.L;
  var endId=addNode(ex,ey);
  pushH();
  if(isPref()&&G.tool==='duvar'&&G.inputUnit==='panel'&&window.Modular&&Modular.strict()){
    var endNode=getNode(endId),closing=G.segs.some(function(s){return s.n1===endId||s.n2===endId;});
    cizimKoseDuzelt(sn,endNode,closing);ex=endNode.x;ey=endNode.y;
    var added=getSeg(addSeg(G.drawStart,endId,G.defaultK,null,true));if(added)added.pfSnap=true;
  }else addSeg(G.drawStart,endId,G.defaultK,G.tool==='veranda'?'veranda':null,G.tool==='duvar');
  G.drawStart=endId;G.drawPreviewPt={x:ex,y:ey};G.snapPt={x:ex,y:ey};
  draw();
}
function drawNumBuf(){
  if(G.numBuf&&!G.drawing&&cizimAraci()){ // özel ölçüden başlatma önizlemesi
    var v0=parseFloat(G.numBuf.replace(',','.')),h=v0>=0?ozelOlcuHedef(v0):null;
    var mp=G.mouseCm?toCv(G.mouseCm.x,G.mouseCm.y):{x:40,y:40};
    var t0='⌨ '+G.numBuf+' cm'+(h?'  → en yakın H\'tan  ↵ Enter':'  (fareyi bir duvarın üstüne getirin)');
    ctx.save();ctx.font='600 12px '+FF;var w0=ctx.measureText(t0).width+18;
    ctx.fillStyle='#0d1117f2';ctx.strokeStyle='#39d0d8';ctx.lineWidth=1.2;ctx.fillRect(mp.x+16,mp.y-44,w0,24);ctx.strokeRect(mp.x+16,mp.y-44,w0,24);
    ctx.fillStyle='#b6f0f3';ctx.textAlign='left';ctx.textBaseline='middle';ctx.fillText(t0,mp.x+25,mp.y-32);
    if(h){var pr=toCv(h.B.a.x+h.B.ux*h.ref,h.B.a.y+h.B.uy*h.ref),pt=toCv(h.x,h.y);
      ctx.strokeStyle='#39d0d8';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(pr.x,pr.y);ctx.lineTo(pt.x,pt.y);ctx.stroke();
      ctx.beginPath();ctx.arc(pt.x,pt.y,6,0,Math.PI*2);ctx.stroke();}
    ctx.restore();return;
  }
  if(!G.numBuf||!G.drawing||!G.drawStart)return;
  var sn=getNode(G.drawStart);if(!sn)return;
  var v=parseFloat(G.numBuf.replace(',','.')),dir=_cizimYon(sn);
  var txt='⌨ '+G.numBuf+(v>0?'  →  '+numUzunluk(sn,dir,v).acik:'')+'   ↵ Enter';
  var p=toCv(sn.x,sn.y);
  ctx.save();ctx.font='600 12px '+FF;
  var w=ctx.measureText(txt).width+18,x=p.x+16,y=p.y-40;
  ctx.fillStyle='#0d1117f2';ctx.strokeStyle='#f0883e';ctx.lineWidth=1.2;
  ctx.fillRect(x,y,w,24);ctx.strokeRect(x,y,w,24);
  ctx.fillStyle='#ffd8b0';ctx.textAlign='left';ctx.textBaseline='middle';ctx.fillText(txt,x+9,y+12);
  // yön oku
  var a=toCv(sn.x+dir.x*40/sc(),sn.y+dir.y*40/sc());
  ctx.strokeStyle='#f0883e';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(a.x,a.y);ctx.stroke();
  ctx.restore();
}
// Önizlemede hayali paneller (prefabrik): derz çentikleri + "3 tam + 1 yarım" etiketi
function pfCizimOnizleme(sn,ep){
  if(!isPref()||G.tool!=='duvar'||!window.Modular||!Modular.strict()||Math.hypot(ep.x-sn.x,ep.y-sn.y)<1)return null;
  var saved={nodes:G.nodes,segs:G.segs,_compLo:G._compLo,_makasLo:G._makasLo};
  try{
    G.nodes=G.nodes.map(function(n){return Object.assign({},n);});
    G.segs=G.segs.map(function(s){return Object.assign({},s);});
    var a=getNode(sn.id);if(!a){a=Object.assign({},sn);G.nodes.push(a);}else Object.assign(a,sn);
    var b=G.nodes.find(function(n){return n.id!==a.id&&Math.hypot(n.x-ep.x,n.y-ep.y)<.001;});
    var closing=!!b;
    if(!b){b={id:'__preview_end',x:ep.x,y:ep.y};G.nodes.push(b);}
    cizimKoseDuzelt(a,b,closing);
    var seg={id:'__preview_wall',n1:a.id,n2:b.id,k:G.defaultK};G.segs.push(seg);
    var run=pfAnaliz().runs.find(function(r){return r.items.some(function(it){return it.seg.id===seg.id;});});
    if(!run)return null;
    var it=run.items.find(function(it){return it.seg.id===seg.id;});
    var slots=run.slots.filter(function(p){return p.b>it.off+.01&&p.a<it.off+it.L-.01;}).map(function(p){
      var lo=Math.max(p.a,it.off)-it.off,hi=Math.min(p.b,it.off+it.L)-it.off;
      return {a:it.rev?it.L-hi:lo,b:it.rev?it.L-lo:hi,w:hi-lo};
    }).sort(function(p,q){return p.a-q.a;});
    return{start:{id:a.id,x:a.x,y:a.y},end:{x:b.x,y:b.y},slots:slots};
  }finally{Object.assign(G,saved);}
}
function drawPreviewPaneller(sn,ep,preview){
  if(!isPref())return;
  if(preview===undefined)preview=pfCizimOnizleme(sn,ep);
  if(preview){sn=preview.start;ep=preview.end;}
  var dx=ep.x-sn.x,dy=ep.y-sn.y,L=Math.hypot(dx,dy);if(L<5)return;
  var ux=dx/L,uy=dy/L,yat=Math.abs(ux)>0.99,dik=Math.abs(uy)>0.99;if(!yat&&!dik)return;
  var paralel=catiYatay()?yat:!yat,s0=0,s1=0;
  // uç payları: başlangıç/bitiş bir duvara dayanıyorsa
  if(!paralel){
    s0=pfBasPay(sn,yat);
    if(!s0&&!G.segs.some(function(q){return q.n1===sn.id||q.n2===sn.id;}))s0=G.defaultK/2;
    var en=G.snapType==='node'&&G.snapNodeId?getNode(G.snapNodeId):null;
    s1=en?pfBasPay(en,yat):(G.snapType==='duvar'&&G._snapDuvarK?G._snapDuvarK/2:0);
  }
  var ekler=[],cnt={t:0,y:0,o:0};
  if(preview){
    preview.slots.forEach(function(p,i){cnt[_pfTip(p.w)==='tam'?'t':_pfTip(p.w)==='yarim'?'y':'o']++;if(i)ekler.push(p.a);});
  } else if(paralel){
    var org=pfCizimMakasOrg(sn),st=yat?sn.x:sn.y,dir=yat?ux:uy;
    var a0=st,a1=st+dir*L,lo=Math.min(a0,a1),hi=Math.max(a0,a1);
    var prev=lo;
    for(var n=Math.ceil((lo-org)/PF.PANEL+1e-6);org+n*PF.PANEL<hi-0.6;n++){var g=org+n*PF.PANEL;ekler.push(Math.abs(g-st));
      var w=g-prev;cnt[_pfTip(w)==='tam'?'t':_pfTip(w)==='yarim'?'y':'o']++;prev=g;}
    var wl=hi-prev;if(wl>0.6)cnt[_pfTip(wl)==='tam'?'t':_pfTip(wl)==='yarim'?'y':'o']++;
  } else {
    var U=L-s0-s1,x=0;
    while(x+PF.PANEL<=U+0.6){x+=PF.PANEL;cnt.t++;if(x<U-0.6)ekler.push(s0+x);}
    var r=U-x;if(r>0.6)cnt[_pfTip(r)==='yarim'?'y':'o']++;
  }
  var s=sc(),h=G.defaultK*s/2+7;
  ctx.save();ctx.strokeStyle='#FFD700';ctx.lineWidth=2.2;
  ekler.forEach(function(d){
    var p=toCv(sn.x+ux*d,sn.y+uy*d);
    ctx.beginPath();ctx.moveTo(p.x-uy*h,p.y+ux*h);ctx.lineTo(p.x+uy*h,p.y-ux*h);ctx.stroke();
  });
  var txt=[cnt.t?cnt.t+' tam':'',cnt.y?cnt.y+' yarım':'',cnt.o?cnt.o+' özel':''].filter(Boolean).join(' + ');
  if(txt){
    var m=toCv(sn.x+ux*L/2,sn.y+uy*L/2);
    ctx.font='700 12px '+FF;ctx.textAlign='center';ctx.textBaseline='middle';
    ctx.lineWidth=3.5;ctx.strokeStyle='#0d1117';ctx.strokeText(txt,m.x+(dik?-26:0),m.y+(yat?22:0));
    ctx.fillStyle='#ffa657';ctx.fillText(txt,m.x+(dik?-26:0),m.y+(yat?22:0));
  }
  ctx.restore();
}
function snapPoint(px,py){
  G._ekKaydir=null;
  var cm=toCm(px,py);
  var rx=cm.x,ry=cm.y,sType='free',snapNId=null;

  // Izgara snap
  if(G.snapGrid){rx=snapGrid(cm.x);ry=snapGrid(cm.y);sType='grid';}

  // Düğüm snap — en yüksek öncelik
  if(G.snapWall){
    var snapR=16/sc(); // snap yarıçapı cm
    var best=snapR;
    var kilitP=isPref()&&G.duvarYakala!=='serbest'&&!G.altKey;
    G.nodes.forEach(function(n){
      var d=dist(cm.x,cm.y,n.x,n.y);
      if(d<best){
        if(kilitP&&duzAraNode(n.id)&&n.id!==G.drawStart)return; // düz duvar üstündeki anlamsız ara nokta: yakalama hedefi değil
        best=d;rx=n.x;ry=n.y;sType='node';snapNId=n.id;
      }
    });
    // Prefabrik: panel ek noktaları (bölme duvarını panel ekine denk getirmek için → 3'lü H)
    if(sType!=='node'&&isPref()&&G._ekNok&&!(G.drawing&&G.drawStart)){
      // panel eki (H) güçlü mıknatıs: en az 8 cm — birleşim H'tan birkaç cm kaçıp çektirme U'ya dönmesin
      var eb=Math.max(best,8);
      G._ekNok.forEach(function(p){var d=dist(cm.x,cm.y,p.x,p.y);if(d<eb){eb=d;rx=p.x;ry=p.y;sType='ek';}});
    }
    // Duvar üstü: duvarın herhangi bir noktası (panel ortası dahil) — orta/eksen/ızgaradan önce
    G._snapLbl=null;G._snapDuvarK=0;G._ekKaydir=null;
    if(sType!=='node'&&sType!=='ek'){
      var du=duvarUstuSnap(cm);
      if(du){rx=du.x;ry=du.y;sType='duvar';G._snapLbl=du.label;G._snapDuvarK=du.k;}
    }
    // Segment orta noktaları ve eksen hizalama
    if(sType!=='node'&&sType!=='ek'&&sType!=='duvar'){
      G.segs.forEach(function(s){
        var n1=getNode(s.n1),n2=getNode(s.n2);
        // Orta nokta
        var mx=(n1.x+n2.x)/2,my=(n1.y+n2.y)/2;
        var d=dist(cm.x,cm.y,mx,my);
        if(d<best){best=d;rx=mx;ry=my;sType='mid';}
      });
      // Eksen (X veya Y hizalama) — tüm node'larla
      if(sType!=='mid'){
        var axBest=G.gridCm*0.6;
        G.nodes.forEach(function(n){
          if(Math.abs(cm.x-n.x)<axBest&&Math.abs(cm.x-n.x)<Math.abs(cm.y-n.y)){rx=n.x;sType='axis';}
          if(Math.abs(cm.y-n.y)<axBest&&Math.abs(cm.y-n.y)<Math.abs(cm.x-n.x)){ry=n.y;sType='axis';}
        });
      }
    }
  }

  // Shift eksen kilidi
  if(G.shiftLock&&G.drawStart){
    var sn=getNode(G.drawStart);
    if(sn){
      var dx=Math.abs(cm.x-sn.x),dy=Math.abs(cm.y-sn.y);
      if(G.lockAxis==='h'||(!G.lockAxis&&dx>dy)){G.lockAxis='h';ry=sn.y;sType='lock';}
      else{G.lockAxis='v';rx=sn.x;sType='lock';}
    }
  }

  // Prefabrik: çizerken duvar boyunu PANEL modülüne oturt.
  //  • Makasa dik duvar: başladığı duvarın yüzünden itibaren 62,75'in katı (ör. köşede 5 + 62,75 → tam yarım panel)
  //  • Makasa paralel duvar: uç, makas ızgarasına (62,75)
  if(isPref()&&G.drawing&&G.drawStart&&G.snapGrid&&sType!=='node'&&sType!=='ek'&&sType!=='mid'&&sType!=='duvar'){
    var ps=pfCizimSnap(getNode(G.drawStart),cm.x,cm.y);
    if(ps){rx=ps.x;ry=ps.y;sType=ps.hiza?'axis':'panel';}
  }
  // ORTHO (prefabrik): çizilen duvar her zaman tam yatay/dikey. Başka bir noktanın hizasına ya da
  // düğümüne yapışma duvarı birkaç cm eğiyorsa, eğim atılır (Alt: serbest çizim).
  if(isPref()&&G.drawing&&G.drawStart&&!G.altKey&&!(sType==='duvar'&&G._ekKaydir)){
    var so=getNode(G.drawStart);
    if(so){
      var odx=rx-so.x,ody=ry-so.y,oyat=Math.abs(odx)>=Math.abs(ody),sap=oyat?Math.abs(ody):Math.abs(odx);
      if(sap>0.01&&Math.max(Math.abs(odx),Math.abs(ody))>1){
        // var olan düğüme kapanış: başlangıç önceki duvar doğrultusunda kaydırılabiliyorsa (≤12 cm) izin ver
        var kapanis=false;
        if(sType==='node'&&sap<=12){
          var pv=G.segs.filter(function(q){return q.n1===so.id||q.n2===so.id;});
          if(pv.length===1){var po=getNode(pv[0].n1===so.id?pv[0].n2:pv[0].n1);
            if(po){var pvx=so.x-po.x,pvy=so.y-po.y,pl=Math.hypot(pvx,pvy);
              // önceki duvar yeni duvara dik mi? (dikse başlangıç onun boyunca kayar, duvar düz kalır)
              if(pl>1&&(oyat?Math.abs(pvx)/pl<0.05:Math.abs(pvy)/pl<0.05))kapanis=true;}}
        }
        if(!kapanis){
          if(oyat)ry=so.y;else rx=so.x;
          if(sType==='node'){sType='axis';snapNId=null;}
          G._orthoDuz=true;
        }
      }
    }
  }
  G.snapPt={x:rx,y:ry};G.snapType=sType;G.snapNodeId=snapNId;
  return{x:rx,y:ry};
}

// ═══ NODE / SEG YARDIMCILARI ═════════════════════════════════════════════
// id → nesne önbelleği (dizi değişince ya da bulunamayınca yeniden kurulur)
var _nIdx={arr:null,map:null},_sIdx={arr:null,map:null};
function _idxGet(C,arr,id){
  if(C.arr!==arr||!C.map){C.arr=arr;C.map={};for(var i=0;i<arr.length;i++)C.map[arr[i].id]=arr[i];}
  var o=C.map[id];
  if(o&&o.id===id)return o;
  // ıskaladı → yeniden kur (push/splice sonrası)
  C.map={};for(var j=0;j<arr.length;j++)C.map[arr[j].id]=arr[j];
  return C.map[id];
}
function getNode(id){return _idxGet(_nIdx,G.nodes,id);}
function getSeg(id){return _idxGet(_sIdx,G.segs,id);}

function addNode(x,y){
  // Aynı konumda node var mı?
  // Prefab joints carry exact panel coordinates; proximity must not move them.
  var EPS=isPref()?.001:Math.min(G.gridCm*0.1,2);
  var existing=G.nodes.find(function(n){return Math.abs(n.x-x)<EPS&&Math.abs(n.y-y)<EPS;});
  if(existing)return existing.id;
  var id=uid();
  G.nodes.push({id:id,x:x,y:y});
  return id;
}

function addSeg(n1id,n2id,k,tip,explicitThickness){
  function rejectDraw(message){G.drawRejectReason=message;throw Error(message);}
  if(explicitThickness){
    var na=getNode(n1id),nb=getNode(n2id),vx=nb.x-na.x,vy=nb.y-na.y,ll=Math.hypot(vx,vy);
    if(ll>.001)G.segs.forEach(function(s){
      var a=getNode(s.n1),b=getNode(s.n2),dx=b.x-a.x,dy=b.y-a.y,len=Math.hypot(dx,dy);if(len<.001)return;
      var cross=vx*dy-vy*dx;
      if(Math.abs(cross)/(ll*len)<1e-8&&Math.abs((a.x-na.x)*vy-(a.y-na.y)*vx)/ll<.01){
        var t0=((a.x-na.x)*vx+(a.y-na.y)*vy)/ll,t1=((b.x-na.x)*vx+(b.y-na.y)*vy)/ll;
        if(Math.min(ll,Math.max(t0,t1))-Math.max(0,Math.min(t0,t1))>.01)rejectDraw('Mevcut duvarın veya açıklığının üzerine tekrar duvar çizilemez.');
      }else if(Math.abs(cross)>1e-8){
        var ex=a.x-na.x,ey=a.y-na.y,u=(ex*vy-ey*vx)/cross,t=(ex*dy-ey*dx)/cross;
        if(t>=-.001&&t<=1.001&&u>=0&&u<=1&&G.elemanlar.some(function(e){return e.segId===s.id&&u*len>e.t*len-.01&&u*len<e.t*len+e.en+.01;}))rejectDraw('Kapı veya pencere boşluğunun üzerinden duvar geçirilemez.');
      }
    });
  }
  // Aynı segment var mı?
  var exists=G.segs.find(function(s){
    return (s.n1===n1id&&s.n2===n2id)||(s.n1===n2id&&s.n2===n1id);
  });
  if(exists)return exists.id;
  var id=uid();
  var ns={id:id,n1:n1id,n2:n2id,k:k||G.defaultK,elemanlar:[]};
  // Apply before detectRooms: classification must not replace the thickness
  // used by the user's preview and corner allowance during this draw action.
  if(isPref()&&explicitThickness)ns.kSabit=true;
  if(tip==='veranda')ns.tip='veranda';
  G.segs.push(ns);
  normalizeGraph(); // T / X birleşimlerini böl → paylaşımlı duvarlar graph'a bağlanır
  detectRooms();
  return id;
}

function removeNode(id){
  // Bağlı segmentleri de sil
  G.segs=G.segs.filter(function(s){
    if(s.n1===id||s.n2===id){
      // segment elemanlarını da temizle
      G.elemanlar=G.elemanlar.filter(function(e){return e.segId!==s.id;});
      return false;
    }
    return true;
  });
  G.nodes=G.nodes.filter(function(n){return n.id!==id;});
  detectRooms();
}

// Düz ara node: tam 2 segment, ikisi aynı doğrultuda (dal yok)
function duzAraNode(nid){
  var ss=G.segs.filter(function(q){return q.n1===nid||q.n2===nid;});
  if(ss.length!==2)return false;
  return isParallel(ss[0],ss[1]);
}
// Düz ara node'u kaldırıp iki segmenti birleştir (kapı/pencereler korunur)
function duzNodeBirlestir(nid){
  var ss=G.segs.filter(function(q){return q.n1===nid||q.n2===nid;});
  if(ss.length!==2||!isParallel(ss[0],ss[1]))return false;
  var A=ss[0],B=ss[1];
  if((A.tip||'')!==(B.tip||'')||A.k!==B.k)return false;
  var aUc=A.n1===nid?A.n2:A.n1,bUc=B.n1===nid?B.n2:B.n1;
  var pa=getNode(aUc),pb=getNode(bUc);if(!pa||!pb)return false;
  // elemanların dünya konumlarını sakla
  var el=G.elemanlar.filter(function(e){return e.segId===A.id||e.segId===B.id;}).map(function(e){
    var sg=getSeg(e.segId),p=getNode(sg.n1),q=getNode(sg.n2);return{e:e,x:p.x+(q.x-p.x)*e.t,y:p.y+(q.y-p.y)*e.t};});
  A.n1=aUc;A.n2=bUc;
  G.segs=G.segs.filter(function(q){return q.id!==B.id;});
  G.nodes=G.nodes.filter(function(n){return n.id!==nid;});
  var L=dist(pa.x,pa.y,pb.x,pb.y);
  el.forEach(function(o){o.e.segId=A.id;o.e.t=Math.max(0,Math.min(1-o.e.en/L,((o.x-pa.x)*(pb.x-pa.x)+(o.y-pa.y)*(pb.y-pa.y))/(L*L)));});
  return true;
}
function removeSeg(id){
  var uc=(function(){var s0=getSeg(id);return s0?[s0.n1,s0.n2]:[];})();
  G.elemanlar=G.elemanlar.filter(function(e){return e.segId!==id;});
  G.segs=G.segs.filter(function(s){return s.id!==id;});
  // Orphan node'ları temizle
  G.nodes=G.nodes.filter(function(n){
    return G.segs.some(function(s){return s.n1===n.id||s.n2===n.id;});
  });
  // Silinen bölme duvarının bıraktığı düz ara noktalar → duvarı yeniden tek parça yap
  uc.forEach(function(nid){if(getNode(nid))duzNodeBirlestir(nid);});
  detectRooms();
}

// ═══ GRAPH NORMALİZASYONU ════════════════════════════════════════════════
// Oda tespitinin çalışması için graph düzlemsel (planar) olmalı:
//  • Aynı konumdaki node'lar birleşik
//  • Bir segmentin ortasına değen node (T-birleşim) → segment o noktada bölünür
//  • Kesişen iki segment (X-birleşim) → kesişim noktasına node eklenir, ikisi de bölünür
//  • Üst üste binen / tekrar eden segmentler → tekilleşir
// Sürükleme sırasında ÇAĞRILMAZ (mouseup'ta çağrılır), yoksa sürüklerken node yağar.
var GRAPH_TOL=1; // cm — "üzerinde" sayılma toleransı

function _segLen(s){var a=getNode(s.n1),b=getNode(s.n2);return a&&b?dist(a.x,a.y,b.x,b.y):0;}

// Segment s'i nodeId noktasında ikiye böl. İlk yarı s olarak kalır (id korunur).
function splitSeg(s,nodeId){
  var a=getNode(s.n1),b=getNode(s.n2),m=getNode(nodeId);
  if(!a||!b||!m)return null;
  var L=dist(a.x,a.y,b.x,b.y),d=dist(a.x,a.y,m.x,m.y);
  if(d<GRAPH_TOL||L-d<GRAPH_TOL)return null;
  var s2=Object.assign({},s,{id:uid(),n1:nodeId,n2:s.n2,elemanlar:[]});
  delete s2.pnlCfg;delete s2.pnlTers;
  if(s.tip)s2.tip=s.tip;
  if(s.dimGizle)s2.dimGizle=s.dimGizle.slice();
  s.n2=nodeId;
  G.segs.push(s2);
  // Kapı/pencereleri yeni parçaya taşı (t = başlangıç oranı, eleman [t·L, t·L+en] aralığında)
  G.elemanlar.forEach(function(e){
    if(e.segId!==s.id)return;
    var st=e.t*L,mid=st+e.en/2;
    if(mid<=d){e.t=Math.max(0,Math.min(Math.max(0,1-e.en/d),st/d));}
    else{var L2=L-d;e.segId=s2.id;e.t=Math.max(0,Math.min(Math.max(0,1-e.en/L2),(st-d)/L2));}
  });
  return s2;
}

function normalizeGraph(){
  var GRAPH_TOL=isPref()?.001:1;
  var changed=true,guard=0;
  while(changed&&guard++<20){
    changed=false;

    // 1) Çakışık node'ları birleştir
    for(var i=0;i<G.nodes.length;i++){
      for(var j=G.nodes.length-1;j>i;j--){
        var p=G.nodes[i],q=G.nodes[j];
        if(dist(p.x,p.y,q.x,q.y)<GRAPH_TOL){
          G.segs.forEach(function(s){if(s.n1===q.id)s.n1=p.id;if(s.n2===q.id)s.n2=p.id;});
          if(G.secili===q)G.secili=p;
          G.nodes.splice(j,1);changed=true;
        }
      }
    }

    // 2) Sıfır boylu ve tekrar eden segmentleri temizle (elemanları korunur)
    var keep=[],byKey={};
    G.segs.forEach(function(s){
      if(s.n1===s.n2)return;
      var key=s.n1<s.n2?s.n1+'|'+s.n2:s.n2+'|'+s.n1;
      var k0=byKey[key];
      if(k0){
        var L=_segLen(s);
        G.elemanlar.forEach(function(e){
          if(e.segId!==s.id)return;
          e.segId=k0.id;
          if(k0.n1!==s.n1&&L>0)e.t=Math.max(0,1-e.t-e.en/L); // yön ters → t'yi aynala
        });
        k0.k=Math.max(k0.k,s.k);
        if(k0.tip==='veranda'&&s.tip!=='veranda')delete k0.tip; // gerçek duvar veranda sınırına baskın
        if(G.secili===s)G.secili=k0;
        changed=true;return;
      }
      byKey[key]=s;keep.push(s);
    });
    G.segs=keep;

    // 3) T-birleşim: segment iç kısmına değen node → böl
    for(var si=0;si<G.segs.length;si++){
      var s=G.segs[si],a=getNode(s.n1),b=getNode(s.n2);if(!a||!b)continue;
      var dx=b.x-a.x,dy=b.y-a.y,L=Math.hypot(dx,dy);if(L<GRAPH_TOL)continue;
      var ux=dx/L,uy=dy/L,best=null,bestD=Infinity;
      G.nodes.forEach(function(n){
        if(n.id===s.n1||n.id===s.n2)return;
        var along=(n.x-a.x)*ux+(n.y-a.y)*uy;
        if(along<GRAPH_TOL||along>L-GRAPH_TOL)return;
        var perp=Math.abs((n.x-a.x)*uy-(n.y-a.y)*ux);
        if(perp<GRAPH_TOL&&along<bestD){bestD=along;best=n;}
      });
      if(best){best.x=a.x+ux*bestD;best.y=a.y+uy*bestD; // tam eksene oturt
        if(splitSeg(s,best.id))changed=true;}
    }

    // 4) X-birleşim: iki segment ortak node olmadan kesişiyorsa → kesişime node koy
    outer:
    for(var i2=0;i2<G.segs.length;i2++){
      for(var j2=i2+1;j2<G.segs.length;j2++){
        var s1=G.segs[i2],s2=G.segs[j2];
        if(s1.n1===s2.n1||s1.n1===s2.n2||s1.n2===s2.n1||s1.n2===s2.n2)continue;
        var p1=getNode(s1.n1),p2=getNode(s1.n2),p3=getNode(s2.n1),p4=getNode(s2.n2);
        if(!p1||!p2||!p3||!p4)continue;
        var d1x=p2.x-p1.x,d1y=p2.y-p1.y,d2x=p4.x-p3.x,d2y=p4.y-p3.y;
        var den=d1x*d2y-d1y*d2x;
        var l1=Math.hypot(d1x,d1y),l2=Math.hypot(d2x,d2y);
        if(Math.abs(den)<1e-6*l1*l2)continue; // paralel/doğrusal → adım 3 halleder
        var t1=((p3.x-p1.x)*d2y-(p3.y-p1.y)*d2x)/den;
        var t2=((p3.x-p1.x)*d1y-(p3.y-p1.y)*d1x)/den;
        var e1=GRAPH_TOL/l1,e2=GRAPH_TOL/l2;
        if(t1>e1&&t1<1-e1&&t2>e2&&t2<1-e2){
          var nid=uid();
          G.nodes.push({id:nid,x:p1.x+d1x*t1,y:p1.y+d1y*t1});
          splitSeg(s1,nid);splitSeg(s2,nid);
          changed=true;break outer; // listeler değişti → baştan
        }
      }
    }
  }
  // Yetim node'lar
  G.nodes=G.nodes.filter(function(n){
    return G.segs.some(function(s){return s.n1===n.id||s.n2===n.id;})||n.id===G.drawStart;
  });
}

// ═══ ODA TESPİT MOTORU ═══════════════════════════════════════════════════
// Half-edge (DCEL) face enumeration:
//  • Her segment iki yönlü kenar (half-edge) üretir: A→B ve B→A
//  • Her node'da çıkan kenarlar açıya göre sıralı
//  • next(u→v) = v'de, (v→u) kenarından sonraki kenar (sıralı listede bir sonraki)
//  • Her half-edge TAM OLARAK bir face'e aittir → paylaşımlı duvar iki odada da görünür
//  • Canvas'ta y aşağı → bu kuralla iç face'ler NEGATİF, dış face POZİTİF alan verir
//    (eski kod area>5 filtresiyle tam tersini tutuyordu: sadece dış kontur bulunuyordu)
var ROOM_MIN_CM2=2500; // 0.25 m² altı face'ler oda sayılmaz (duvar arası boşluk vb.)

// Etiket için oda içinde "rahat" bir nokta: ağırlık merkezi içerideyse o, değilse
// (L/U odalar) kenarlara en uzak iç nokta (kaba ızgara araması)
function _kenarMesafe(x,y,pts){
  var m=Infinity;
  for(var i=0;i<pts.length;i++){var a=pts[i],b=pts[(i+1)%pts.length];m=Math.min(m,ptSegDistPx(x,y,a.x,a.y,b.x,b.y));}
  return m;
}
function etiketNoktasi(pts,cx,cy){
  var bx=Infinity,by=Infinity,BX=-Infinity,BY=-Infinity;
  pts.forEach(function(p){bx=Math.min(bx,p.x);by=Math.min(by,p.y);BX=Math.max(BX,p.x);BY=Math.max(BY,p.y);});
  var span=Math.min(BX-bx,BY-by);
  if(ptInPolygon(cx,cy,pts)&&_kenarMesafe(cx,cy,pts)>span*0.25)return{x:cx,y:cy};
  var best={x:cx,y:cy},bd=-1,N=16;
  for(var i=1;i<N;i++)for(var j=1;j<N;j++){
    var x=bx+(BX-bx)*i/N,y=by+(BY-by)*j/N;
    if(!ptInPolygon(x,y,pts))continue;
    var d=_kenarMesafe(x,y,pts)-0.15*Math.hypot(x-cx,y-cy); // merkeze yakın olanı tercih et
    if(d>bd){bd=d;best={x:x,y:y};}
  }
  return best;
}
// Etikette görünen ad: özel ad > oda tipi (aynı tipten birden çok varsa numaralı) > otomatik "Oda N"
function roomLabel(room){
  if(room.ozelAd)return room.ozelAd;
  if(room.tip==='veranda')return room.ad; // Veranda 1, Veranda 2
  if(room.tip&&ODA_TIPLER[room.tip]){
    var ayni=G.rooms.filter(function(r){return !r.ozelAd&&r.tip===room.tip;});
    if(ayni.length<2)return ODA_TIPLER[room.tip];
    ayni.sort(function(a,b){return (parseInt(a.ad.replace(/[^0-9]/g,''))||0)-(parseInt(b.ad.replace(/[^0-9]/g,''))||0);});
    return ODA_TIPLER[room.tip]+' '+(ayni.indexOf(room)+1);
  }
  return room.ad;
}
function adUygun(ad,P){ // "Oda 3" / "Veranda 2" biçiminde mi?
  if(typeof ad!=='string'||ad.indexOf(P+' ')!==0)return false;
  var n=ad.slice(P.length+1);return n.length>0&&/^[0-9]+$/.test(n);
}
function detectRooms(){
  var oldRooms=G.rooms||[];
  G.rooms=[];
  G.segs.forEach(function(s){s.dis=false;});
  if(G.segs.length<3)return;

  // Adjacency (seg id ile — aynı node çifti arası çift segment olsa bile karışmaz)
  var adj={};
  G.nodes.forEach(function(n){adj[n.id]=[];});
  G.segs.forEach(function(s){
    var a=getNode(s.n1),b=getNode(s.n2);
    if(!a||!b||s.n1===s.n2)return;
    adj[s.n1].push({to:s.n2,seg:s.id,ang:Math.atan2(b.y-a.y,b.x-a.x)});
    adj[s.n2].push({to:s.n1,seg:s.id,ang:Math.atan2(a.y-b.y,a.x-b.x)});
  });
  Object.keys(adj).forEach(function(k){adj[k].sort(function(p,q){return p.ang-q.ang;});});

  function heKey(from,seg){return seg+'@'+from;}
  function nextHE(from,to,seg){
    var list=adj[to];if(!list||!list.length)return null;
    var idx=-1;
    for(var i=0;i<list.length;i++){if(list[i].seg===seg&&list[i].to===from){idx=i;break;}}
    if(idx<0)return null;
    var nx=list[(idx+1)%list.length];
    return{from:to,to:nx.to,seg:nx.seg};
  }

  // Bağlı bileşenler (ada / iç içe plan tespiti için)
  var comp={},cc=0;
  G.nodes.forEach(function(n){
    if(comp[n.id]!==undefined||!adj[n.id]||!adj[n.id].length)return;
    var st=[n.id];comp[n.id]=cc;
    while(st.length){var u=st.pop();adj[u].forEach(function(e){if(comp[e.to]===undefined){comp[e.to]=cc;st.push(e.to);}});}
    cc++;
  });

  var visited={},faces=[],maxSteps=G.segs.length*2+2;
  G.segs.forEach(function(s){
    [[s.n1,s.n2],[s.n2,s.n1]].forEach(function(dir){
      if(!getNode(dir[0])||!getNode(dir[1]))return;
      var k0=heKey(dir[0],s.id);if(visited[k0])return;
      var he={from:dir[0],to:dir[1],seg:s.id},nodes=[],hes=[],steps=0;
      while(he&&steps++<maxSteps){
        var k=heKey(he.from,he.seg);
        if(visited[k])break;
        visited[k]=true;nodes.push(he.from);hes.push(he);
        he=nextHE(he.from,he.to,he.seg);
      }
      if(nodes.length<3)return;
      var pts=nodes.map(function(id){return getNode(id);});
      faces.push({nodeIds:nodes,hes:hes,area:polygonArea(pts),comp:comp[nodes[0]]});
    });
  });

  var roomFaces=faces.filter(function(f){return f.area<-ROOM_MIN_CM2;});
  var outerFaces=faces.filter(function(f){return f.area>0;});

  // Dış face'e ait kenarlar = dış duvar (cephe)
  var segMap={};G.segs.forEach(function(s){segMap[s.id]=s;});
  var roomHE={},holeHE={};
  roomFaces.forEach(function(f){f.hes.forEach(function(h){roomHE[heKey(h.from,h.seg)]=true;});});

  // Oda polygonu: yönü pozitife çevir (saat yönü tutarlı), alan pozitif
  var rooms=roomFaces.map(function(f){
    var ids=f.nodeIds.slice().reverse();
    var pts=ids.map(function(id){return getNode(id);});
    var cx=0,cy=0,A=0;
    for(var i=0;i<pts.length;i++){ // alan ağırlıklı merkez
      var p=pts[i],q=pts[(i+1)%pts.length],c=p.x*q.y-q.x*p.y;
      A+=c;cx+=(p.x+q.x)*c;cy+=(p.y+q.y)*c;
    }
    A/=2;cx/=(6*A);cy/=(6*A);
    var uniq=ids.filter(function(v,i){return ids.indexOf(v)===i;});
    return{nodeIds:ids,pts:pts,areaCm:A,cx:cx,cy:cy,comp:f.comp,sig:uniq.slice().sort().join(',')};
  });

  // Delikler: başka bileşenin dış konturu bir odanın içindeyse o odanın alanından düş
  outerFaces.forEach(function(of){
    var p0=getNode(of.nodeIds[0]),host=null;
    rooms.forEach(function(r){
      if(r.comp===of.comp)return;
      if(ptInPolygon(p0.x,p0.y,r.pts)&&(!host||r.areaCm<host.areaCm))host=r;
    });
    if(host){
      host.areaCm-=of.area;
      of.hes.forEach(function(h){roomHE[heKey(h.from,h.seg)]=true;holeHE[heKey(h.from,h.seg)]=true;}); // oda içindeki adanın duvarları cephe değil
    }
  });
  // Dış duvar = en az bir yüzü hiçbir odaya bakmayan segment
  G.segs.forEach(function(s){
    s.dis=!(roomHE[heKey(s.n1,s.id)]&&roomHE[heKey(s.n2,s.id)]);
  });

  // Eski oda bilgisini (ad/tip) koru: önce aynı imza, sonra merkezi yeni odanın içinde kalan eski oda
  var claimed={};
  var matched=rooms.map(function(r){ // 1. geçiş: birebir aynı oda
    var o=oldRooms.find(function(x){return !claimed[x.id]&&x.sig===r.sig;});
    if(o)claimed[o.id]=true;return o||null;
  });
  matched=matched.map(function(o,i){ // 2. geçiş: bölünen/değişen oda → merkezi içinde kalan eski oda
    if(o)return o;
    var r=rooms[i];
    o=oldRooms.find(function(x){return !claimed[x.id]&&x.cx!==undefined&&ptInPolygon(x.cx,x.cy,r.pts);});
    if(o)claimed[o.id]=true;return o||null;
  });
  // Tip: eşleşen eski odadan; yeni odada veranda sınırı varsa 'veranda'
  var tips=rooms.map(function(r,i){
    var o=matched[i];if(o)return o.tip;
    return roomFaces[i].hes.some(function(h){var sg=segMap[h.seg];return sg&&sg.tip==='veranda';})?'veranda':''; // '' = tip seçilmedi
  });
  // İsim: oda → "Oda N", veranda → "Veranda N" (ayrı numaralama). Uygun eski isim korunur.
  function onEk(tip){return tip==='veranda'?'Veranda':'Oda';}
  var used={},adlar=new Array(rooms.length);
  rooms.forEach(function(r,i){ // 1) tipine uyan eski isimleri koru
    var o=matched[i],P=onEk(tips[i]);
    if(o&&adUygun(o.ad,P)&&!used[o.ad]){used[o.ad]=true;adlar[i]=o.ad;}
  });
  var sayac={Oda:1,Veranda:1};
  rooms.forEach(function(r,i){ // 2) eksikleri boştaki ilk numarayla doldur
    if(adlar[i])return;
    var P=onEk(tips[i]);
    while(used[P+' '+sayac[P]])sayac[P]++;
    adlar[i]=P+' '+sayac[P];used[adlar[i]]=true;
  });

  rooms.forEach(function(r,i){
    var o=matched[i];
    var room={
      id:o?o.id:uid(),sig:r.sig,nodeIds:r.nodeIds,
      area:r.areaCm/10000,cx:r.cx,cy:r.cy,
      ad:adlar[i],ozelAd:o?o.ozelAd:null,tip:tips[i],
      lblDx:o&&o.lblDx?o.lblDx:0,lblDy:o&&o.lblDy?o.lblDy:0,
      duvarAlci:o?!!o.duvarAlci:false,
    };
    var lp=etiketNoktasi(r.pts,r.cx,r.cy);room.lx=lp.x;room.ly=lp.y;
    G.rooms.push(room);
    if(G.secili&&G.seciliTip==='room'&&o&&G.secili.id===o.id)G.secili=room;
  });
  // Dış duvar: en az bir yüzü "kapalı oda" olmayan (veranda = dış mekan) segment
  var closedHE={};
  G.rooms.forEach(function(r,i2){
    if(r.tip==='veranda')return;
    roomFaces[i2].hes.forEach(function(h){closedHE[heKey(h.from,h.seg)]=true;});
  });
  G.segs.forEach(function(s){
    if(s.tip==='veranda'){s.dis=false;return;}
    var k1=heKey(s.n1,s.id),k2=heKey(s.n2,s.id);
    s.dis=!((closedHE[k1]||holeHE[k1])&&(closedHE[k2]||holeHE[k2]));
  });
  prefKalinlikUygula();
}

function polygonArea(pts){
  var n=pts.length,a=0;
  for(var i=0;i<n;i++){
    var j=(i+1)%n;
    a+=pts[i].x*pts[j].y-pts[j].x*pts[i].y;
  }
  return a/2;
}

// ═══ MİTER HESABI ════════════════════════════════════════════════════════
// Bir node'da birden fazla segment varsa, her segment çifti için miter hesapla
// Returns: {left: {x,y}, right: {x,y}} — duvarın iki kenar noktası
// ════════════════════════════════════════════════════════
// WALL GRAPH RENDER ENGINE — Doğru Miter Algoritması
// ════════════════════════════════════════════════════════
// Algoritma:
// 1. Her node'da bağlı segmentleri açıya göre AZALAN sıraya diz (saat yönü)
// 2. Sıralı listede i. segmentin:
//    - LEFT miter  = i. segmentin LEFT offset ∩ (i+1). segmentin RIGHT offset
//    - RIGHT miter = i. segmentin RIGHT offset ∩ (i-1). segmentin LEFT offset
// 3. Bu algoritma çizim yönünden BAĞIMSIZ çalışır

function lineIntersect(p1x,p1y,d1x,d1y,p2x,p2y,d2x,d2y){
  var denom=d1x*d2y-d1y*d2x;
  if(Math.abs(denom)<1e-9)return null;
  var t=((p2x-p1x)*d2y-(p2y-p1y)*d2x)/denom;
  return{x:p1x+t*d1x,y:p1y+t*d1y};
}

// Node'daki tüm segment bilgilerini hesapla ve cache'le
var _miterCache={};
function clearMiterCache(){_miterCache={};}

// nodeId'deki segmentleri saat yönünde sırala
// Her biri için {segId, ux, uy, lx, ly, rx, ry} döndür
function nodeSegDirs(nodeId){
  var node=getNode(nodeId);if(!node)return[];
  var segs=G.segs.filter(function(s){return s.n1===nodeId||s.n2===nodeId;});
  var dirs=segs.map(function(seg){
    var toId=seg.n1===nodeId?seg.n2:seg.n1;
    var toN=getNode(toId);if(!toN)return null;
    var dx=toN.x-node.x,dy=toN.y-node.y,len=Math.hypot(dx,dy);
    if(len<1e-6)return null;
    var ux=dx/len,uy=dy/len,h=seg.k/2;
    return{
      segId:seg.id,ux:ux,uy:uy,h:h,
      ang:Math.atan2(uy,ux),
      lx:node.x-uy*h,ly:node.y+ux*h,  // sol offset
      rx:node.x+uy*h,ry:node.y-ux*h   // sağ offset
    };
  }).filter(Boolean);
  // Açıya göre AZALAN sırala (saat yönü, Y aşağı canvas'ta)
  dirs.sort(function(a,b){return b.ang-a.ang;});
  return dirs;
}

// segId için nodeId'deki miter noktalarını döndür
function getMiterAt(nodeId,segId){
  var key=nodeId+':'+segId;
  if(_miterCache[key])return _miterCache[key];

  var dirs=nodeSegDirs(nodeId);
  if(dirs.length===0)return null;

  var idx=dirs.findIndex(function(d){return d.segId===segId;});
  if(idx<0)return null;

  var me=dirs[idx];
  var node=getNode(nodeId);

  if(dirs.length===1){
    // Serbest uç — düz kes
    var r={left:{x:me.lx,y:me.ly},right:{x:me.rx,y:me.ry}};
    _miterCache[key]=r;return r;
  }

  var n=dirs.length;
  // Saat yönünde bir sonraki → LEFT miter için
  var next=dirs[(idx+1)%n];
  // Saat yönünde bir önceki → RIGHT miter için
  var prev=dirs[(idx+n-1)%n];

  // LEFT: me.left ∩ next.right
  var maxD=(me.h+next.h)*6;
  var leftPt=lineIntersect(me.lx,me.ly,me.ux,me.uy, next.rx,next.ry,next.ux,next.uy);
  if(!leftPt||Math.hypot(leftPt.x-node.x,leftPt.y-node.y)>maxD)
    leftPt={x:me.lx,y:me.ly};

  // RIGHT: me.right ∩ prev.left
  maxD=(me.h+prev.h)*6;
  var rightPt=lineIntersect(me.rx,me.ry,me.ux,me.uy, prev.lx,prev.ly,prev.ux,prev.uy);
  if(!rightPt||Math.hypot(rightPt.x-node.x,rightPt.y-node.y)>maxD)
    rightPt={x:me.rx,y:me.ry};

  var r={left:leftPt,right:rightPt};
  _miterCache[key]=r;return r;
}



// Oda tipleri ve Türkçe isimleri
var ODA_TIPLER={
  'salon':'Salon',
  'salon_mutfak':'Salon + Mutfak',
  'mutfak':'Mutfak',
  'oturma':'Oturma Odası',
  'yatak':'Yatak Odası',
  'cocuk':'Çocuk Odası',
  'ebeveyn':'Ebeveyn Odası',
  'banyo':'Banyo',
  'ebanyo':'Ebeveyn Banyo',
  'wc':'WC / Tuvalet',
  'hol':'Hol / Koridor',
  'giris':'Giriş',
  'veranda':'Veranda',
  'depo':'Depo / Kiler',
  'garaj':'Garaj',
};

// Oda tipi → otomatik malzeme analizi için
var ODA_MALZEME={
  'banyo':['seramik_zemin','seramik_duvar','yesil_alcipan','vitrifiye'],
  'ebanyo':['seramik_zemin','seramik_duvar','yesil_alcipan','vitrifiye'],
  'wc':['seramik_zemin','seramik_duvar','yesil_alcipan','vitrifiye'],
  'mutfak':['seramik_zemin','mutfak_tezgah','yesil_alcipan'],
  'salon_mutfak':['laminant_parke','seramik_mutfak','alcipan'],
  'veranda':['seramik_zemin','dis_boya'],
  'garaj':['beton_zemin'],
};

var FF="Inter,'Segoe UI',system-ui,-apple-system,sans-serif"; // tuval yazı ailesi
// Tema: ekran (koyu) ve PNG çıktısı (açık, yumuşak) aynı çizim fonksiyonlarını kullanır
var TH_DARK={export:false,room:'#161e2a',roomSel:'#1a2a3c',roomName:'#c0d8f0',roomTip:'#8ab0cc',roomArea:'#70a0b8',
  wall:'#b8cfe0',door:'#f0883e',win:'#8fc4e8',winFill:'#10161f',opening:'#161e2a',
  verandaWall:'#8fa9bf',verandaRoom:'#131e1c',wetRoom:'#111923',hatch:'#2c3d36',
  pnlYarim:'rgba(121,192,255,0.35)',pnlGap:'#2a3a52',pnlTick:'#79c0ffaa',pnlTxt:'#1c2533',pnlTxtY:'#0b3a66',
  pnlOzel:'rgba(210,153,34,0.55)',pnlTxtO:'#3d2a00',pfKose:'#d29922',pfH3:'#1f6feb',pfH4:'#8957e5',pfU:'#db6d28',makas:'#f0883e'};
var TH_PAPER={export:true,room:'#ffffff',roomSel:'#ffffff',roomName:'#2b3544',roomTip:'#8a94a3',roomArea:'#5f6b7a',
  wall:'#6b7482',door:'#c9853f',win:'#5b9bc9',winFill:'#eef3f7',opening:'#ffffff',
  verandaWall:'#a4acb7',verandaRoom:'#eeede7',wetRoom:'#edf0f2',hatch:'#e4e1d8',
  pnlYarim:'rgba(70,120,180,0.35)',pnlGap:'#eef1f5',pnlTick:'#8a94a3',pnlTxt:'#ffffff',pnlTxtY:'#ffffff',
  pnlOzel:'rgba(190,140,40,0.55)',pnlTxtO:'#ffffff',pfKose:'#b7862b',pfH3:'#3b6fb6',pfH4:'#7a5bb5',pfU:'#c46a2c',makas:'#c46a2c'};
var TH=TH_DARK;
var WC='#b8cfe0';
var WC_SEL='#58a6ff';
var WC_IN='#607888';

function drawSegs(){
  G.segs.forEach(function(seg){
    var n1=getNode(seg.n1),n2=getNode(seg.n2);
    if(!n1||!n2)return;
    var isSel=isSegSel(seg.id);
    var isPrim=isSel&&G.secili.id===seg.id;
    var p1=toCv(n1.x,n1.y),p2=toCv(n2.x,n2.y);
    var len=Math.hypot(p2.x-p1.x,p2.y-p1.y);
    if(len<0.5)return;
    // Duvar kalınlığını lineWidth olarak kullan
    var lw=Math.max(2, seg.k*sc());
    ctx.save();
    ctx.strokeStyle=isSel?'#58a6ff':TH.wall;
    ctx.lineWidth=lw;
    ctx.lineCap='square';
    if(seg.tip==='veranda'){
      // Veranda sınırı: aynı kalınlıkta kesik çizgi (duvar değil)
      var dl=Math.max(6,lw*1.2);
      ctx.lineCap='butt';ctx.setLineDash([dl,dl*0.75]);
      ctx.strokeStyle=isSel?'#58a6ff':TH.verandaWall;
    }
    ctx.lineJoin='miter';
    ctx.miterLimit=10;
    ctx.beginPath();ctx.moveTo(p1.x,p1.y);ctx.lineTo(p2.x,p2.y);ctx.stroke();
    ctx.restore();
    // Ölçü kotu
    // Seçili tutamaçlar
    if(isSel){
      var mp={x:(p1.x+p2.x)/2,y:(p1.y+p2.y)/2};
      ctx.fillStyle='#f0883e';ctx.beginPath();ctx.arc(mp.x,mp.y,5,0,Math.PI*2);ctx.fill();
    }
    if(isPrim){
      ctx.fillStyle='#3fb950';ctx.beginPath();ctx.arc(p2.x,p2.y,7,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='#58a6ff';ctx.beginPath();ctx.arc(p1.x,p1.y,7,0,Math.PI*2);ctx.fill();
    }
  });
}

function getMiterPt(){} // eski stub

// ═══ ANA ÇİZİM FONKSİYONU ════════════════════════════════════════════════
function draw(){
  var W=cv.clientWidth||cv.width,H=cv.clientHeight||cv.height;
  ctx.clearRect(0,0,W,H);
  drawBg(W,H);
  drawRooms();
  drawMakas();
  drawSegs();
  drawNodes();
  drawPanels();
  drawAlciGorsel();
  drawElemanlar();
  drawDims();
  drawKapiHandles();
  drawPreview();
  drawNumBuf();
  drawSnapInd();
  drawWallDragInfo();
  updateStats();
}

function drawBg(W,H){
  var s=sc(),g=G.gridCm*s;
  ctx.strokeStyle='#1e2535';ctx.lineWidth=1;
  for(var x=((G.pan.x%g)+g)%g;x<W;x+=g){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke();}
  for(var y=((G.pan.y%g)+g)%g;y<H;y+=g){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}
  var g10=g*10;ctx.strokeStyle='#252d3d';
  for(var x=((G.pan.x%g10)+g10)%g10;x<W;x+=g10){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke();}
  for(var y=((G.pan.y%g10)+g10)%g10;y<H;y+=g10){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}
}

function drawRooms(){
  G._lblHits=[];
  G.rooms.forEach(function(room){
    // Node sırasını detectRooms'dan olduğu gibi al — sıralama yapma
    var pts=room.nodeIds.map(function(id){var n=getNode(id);return n?toCv(n.x,n.y):null;}).filter(Boolean);
    if(pts.length<3)return;
    var isSel=G.secili&&G.secili.id===room.id&&G.seciliTip==='room';
    ctx.beginPath();
    ctx.moveTo(pts[0].x,pts[0].y);
    pts.slice(1).forEach(function(p){ctx.lineTo(p.x,p.y);});
    ctx.closePath();
    var isVer=room.tip==='veranda';
    var isWet=['banyo','ebanyo','wc'].indexOf(room.tip)>=0;
    ctx.fillStyle=isSel?TH.roomSel:(isVer?TH.verandaRoom:(isWet?TH.wetRoom:TH.room));
    ctx.fill();
    if(isVer){ // hafif çapraz tarama
      ctx.save();ctx.clip();
      var bx=Math.min.apply(null,pts.map(function(p){return p.x;})),bX=Math.max.apply(null,pts.map(function(p){return p.x;}));
      var by=Math.min.apply(null,pts.map(function(p){return p.y;})),bY=Math.max.apply(null,pts.map(function(p){return p.y;}));
      ctx.strokeStyle=TH.hatch;ctx.lineWidth=1;ctx.beginPath();
      for(var hx=bx-(bY-by);hx<bX;hx+=12){ctx.moveTo(hx,bY);ctx.lineTo(hx+(bY-by),by);}
      ctx.stroke();ctx.restore();
    }
    if(['banyo','ebanyo','wc'].indexOf(room.tip)>=0){
      ctx.save();ctx.clip();ctx.strokeStyle=TH.export?'#a8b7bf':'#344753';ctx.globalAlpha=.65;ctx.lineWidth=.6;
      var tile=30*sc(),left=Math.min.apply(null,pts.map(function(p){return p.x;})),right=Math.max.apply(null,pts.map(function(p){return p.x;})),top=Math.min.apply(null,pts.map(function(p){return p.y;})),bottom=Math.max.apply(null,pts.map(function(p){return p.y;}));
      if(tile>=4){ctx.beginPath();for(var tx=left;tx<=right;tx+=tile){ctx.moveTo(tx,top);ctx.lineTo(tx,bottom);}for(var ty=top;ty<=bottom;ty+=tile){ctx.moveTo(left,ty);ctx.lineTo(right,ty);}ctx.stroke();}ctx.restore();
    }
    // Etiket: oda içi etiket noktası + kullanıcı ofseti (cm)
    var lp=toCv((room.lx!==undefined?room.lx:0)+(room.lblDx||0),(room.ly!==undefined?room.ly:0)+(room.lblDy||0));
    if(room.lx===undefined){lp={x:pts.reduce(function(s,p){return s+p.x;},0)/pts.length,y:pts.reduce(function(s,p){return s+p.y;},0)/pts.length};}
    var cx=lp.x,cy=lp.y;
    var E=TH.export,ad=roomLabel(room);
    // Özel ad varken tip ayrıca küçük gösterilir (ad tipi zaten söylemiyorsa)
    var alt=(room.ozelAd&&room.tip&&ODA_TIPLER[room.tip]&&room.ozelAd.toLowerCase().indexOf(ODA_TIPLER[room.tip].toLowerCase())<0)?ODA_TIPLER[room.tip]:'';
    var fsA=E?15:Math.round(Math.max(11,Math.min(16,13*Math.sqrt(G.zoom))));
    var fsB=E?12:Math.round(Math.max(9,Math.min(13,10.5*Math.sqrt(G.zoom))));
    var lh=fsA*0.62+fsB*0.62+3,y1=cy-(alt?lh:lh/2),yAlt=y1+fsA*0.62+fsB*0.62+2,yA=(alt?yAlt+fsB+3:y1+fsA*0.62+fsB*0.62+3);
    ctx.textAlign='center';ctx.textBaseline='middle';
    var drag=G.lblDrag&&G.lblDrag.active&&G.lblDrag.roomId===room.id;
    var hl=isSel||drag;
    ctx.font='600 '+fsA+'px '+FF;
    var w=ctx.measureText(ad).width;
    ctx.fillStyle=hl?'#79c0ff':TH.roomName;ctx.fillText(ad,cx,y1);
    if(alt){ctx.font='400 '+fsB+'px '+FF;ctx.fillStyle=hl?'#79c0ffaa':TH.roomTip;ctx.fillText(alt,cx,yAlt);w=Math.max(w,ctx.measureText(alt).width);}
    ctx.font='500 '+fsB+'px '+FF;ctx.fillStyle=hl?'#79c0ffcc':TH.roomArea;
    var at=room.area.toFixed(1)+' m²';ctx.fillText(at,cx,yA);w=Math.max(w,ctx.measureText(at).width);
    var top=y1-fsA*0.7,bot=yA+fsB*0.7;
    if(!E){
      G._lblHits.push({roomId:room.id,x:cx-w/2-4,y:top-2,w:w+8,h:bot-top+4});
      if(hl){ // sürüklenebilir olduğunu belli et
        ctx.save();ctx.setLineDash([3,3]);ctx.strokeStyle='#58a6ff88';ctx.lineWidth=1;
        ctx.strokeRect(cx-w/2-6,top-3,w+12,bot-top+6);ctx.restore();
      }
    }
  });
}

function drawNodes(){
  G.nodes.forEach(function(n){
    var p=toCv(n.x,n.y);
    var isSel=G.secili&&G.secili.id===n.id&&G.seciliTip==='node';
    var connCount=G.segs.filter(function(s){return s.n1===n.id||s.n2===n.id;}).length;
    // Düğüm noktası — yalnızca seçiliyse veya önemli bir kavşaksa göster
    if(isSel||connCount>2||(connCount===1&&cizimAraci())){
      ctx.beginPath();ctx.arc(p.x,p.y,isSel?7:5,0,Math.PI*2);
      ctx.fillStyle=isSel?'#58a6ff':(connCount>2?'#f0883e':'#4a6a8a');
      ctx.fill();
    }
    // Seçili node tutamaçları
    if(isSel){
      ctx.strokeStyle='#58a6ff';ctx.lineWidth=2;
      ctx.beginPath();ctx.arc(p.x,p.y,10,0,Math.PI*2);ctx.stroke();
    }
  });
}

function drawDimSeg(p1,p2,lenM){
  var OFF=12*Math.min(G.zoom,1);
  var dx=p2.x-p1.x,dy=p2.y-p1.y,len=Math.hypot(dx,dy);
  if(len<20)return;
  var nx=-dy/len,ny=dx/len;
  var ox=nx*OFF,oy=ny*OFF;
  ctx.save();
  ctx.setLineDash([3,4]);ctx.strokeStyle='#3fb95040';ctx.lineWidth=1;
  ctx.beginPath();ctx.moveTo(p1.x+ox,p1.y+oy);ctx.lineTo(p2.x+ox,p2.y+oy);ctx.stroke();
  ctx.setLineDash([]);
  ctx.strokeStyle='#3fb95030';
  ctx.beginPath();ctx.moveTo(p1.x+ox,p1.y+oy);ctx.lineTo(p1.x,p1.y);ctx.stroke();
  ctx.beginPath();ctx.moveTo(p2.x+ox,p2.y+oy);ctx.lineTo(p2.x,p2.y);ctx.stroke();
  var mx=(p1.x+p2.x)/2+ox,my=(p1.y+p2.y)/2+oy;
  ctx.font='bold '+Math.max(8,9*G.zoom)+'px '+FF;
  var tw=ctx.measureText(lenM.toFixed(2)+'m').width;
  ctx.fillStyle='#0f1420cc';ctx.fillRect(mx-tw/2-3,my-6,tw+6,12);
  ctx.fillStyle='#3fb950cc';ctx.textAlign='center';ctx.textBaseline='middle';
  ctx.fillText(lenM.toFixed(2)+'m',mx,my);
  ctx.restore();
}

// ═══ ELEMAN ÇİZİMİ (kapı/pencere) ═══════════════════════════════════════
function drawElemanlar(){
  G.elemanlar.forEach(function(e){
    var seg=getSeg(e.segId);if(!seg)return;
    var n1=getNode(seg.n1),n2=getNode(seg.n2);if(!n1||!n2)return;
    var dx=n2.x-n1.x,dy=n2.y-n1.y,dLen=Math.hypot(dx,dy);
    if(dLen<0.1)return;
    var ux=dx/dLen,uy=dy/dLen;
    // t: segment üzerindeki konum (0-1)
    var ex=n1.x+ux*e.t*dLen,ey=n1.y+uy*e.t*dLen;
    var aci=Math.atan2(dy,dx);
    var isSel=G.secili&&G.secili.id===e.id&&G.seciliTip==='eleman';
    if(e.tip_==='pencere')drawPencere(e,ex,ey,aci,seg.k,isSel);
    else drawKapi(e,ex,ey,aci,seg.k,isSel);
  });
  // Draw dimensions last so neighbouring opening symbols cannot paint over them.
  var labels=[];
  G.elemanlar.forEach(function(e){
    var seg=getSeg(e.segId);if(!seg)return;
    var a=getNode(seg.n1),b=getNode(seg.n2);if(!a||!b)return;
    var dx=b.x-a.x,dy=b.y-a.y,L=Math.hypot(dx,dy);if(L<.1)return;
    var ux=dx/L,uy=dy/L,mid=e.t*L+e.en/2,p=toCv(a.x+ux*mid,a.y+uy*mid);
    var angle=Math.atan2(dy,dx);if(angle>Math.PI/2||angle<=-Math.PI/2)angle+=Math.PI;
    var side=-segRoomSide(seg,mid)||(e.tip_==='kapi'?-kapiYan(e):1);
    var text=fmtCm(e.en)+'/'+fmtCm(e.yuk),font=TH.export?11:10;
    ctx.save();ctx.font='600 '+font+'px '+FF;ctx.textAlign='center';ctx.textBaseline='middle';
    var w=ctx.measureText(text).width+6,h=font+4,cx,cy,box;
    for(var row=0;row<4;row++){
      var offset=seg.k*sc()/2+10+row*(font+6);cx=p.x-uy*side*offset;cy=p.y+ux*side*offset;
      var bw=Math.abs(Math.cos(angle))*w+Math.abs(Math.sin(angle))*h,bh=Math.abs(Math.sin(angle))*w+Math.abs(Math.cos(angle))*h;
      box={x:cx-bw/2,y:cy-bh/2,w:bw,h:bh};
      if(!labels.some(function(q){return box.x<q.x+q.w+2&&box.x+box.w+2>q.x&&box.y<q.y+q.h+2&&box.y+box.h+2>q.y;}))break;
    }
    labels.push(box);ctx.translate(cx,cy);ctx.rotate(angle);
    ctx.fillStyle=TH.opening;ctx.fillRect(-w/2,-h/2,w,h);
    ctx.fillStyle=TH.export?TH.wall:TH.roomName;ctx.fillText(text,0,0);ctx.restore();
  });
}





// ═══ KAPI / PENCERE ÇİZİMİ ═══════════════════════════════════════════════
// Kapı modeli (segment yerel ekseni: u = n1→n2, n = (-uy,ux)):
//   yan     : +1 / -1  → kanadın açıldığı taraf (n yönü veya tersi)
//   mentese : 'a' / 'b' → menteşe açıklığın başında (n1 tarafı) mı sonunda mı
//   kapiTip : 'ic' | 'dis' | 'surme' | 'cift'
function kapiYan(e){return e.yan===-1?-1:1;}
function kapiMen(e){return e.mentese||(e.kapiYon==='dis'?'b':'a');}

function _normAng(a){while(a>Math.PI)a-=2*Math.PI;while(a<-Math.PI)a+=2*Math.PI;return a;}
function _kanat(hx,y0,w,yan,farX,col,sel){
  // hx: menteşe x, y0: duvar yüzü, kanat duvara dik açık çizilir, yay kapalı konuma iner
  ctx.strokeStyle=col;ctx.lineWidth=sel?2.2:1.8;
  ctx.beginPath();ctx.moveTo(hx,y0);ctx.lineTo(hx,y0+yan*w);ctx.stroke();
  var aL=yan>0?Math.PI/2:-Math.PI/2,aF=farX>hx?0:Math.PI,d=_normAng(aL-aF);
  ctx.strokeStyle=col+'77';ctx.lineWidth=1;ctx.setLineDash([]);
  ctx.beginPath();ctx.arc(hx,y0,w,aF,aF+d,d<0);ctx.stroke();
}
function drawKapi(e,ex,ey,aci,k,sel){
  var s=sc(),p=toCv(ex,ey),w=e.en*s,h2=k*s/2;
  var yan=kapiYan(e),men=kapiMen(e),tip=e.kapiTip||'ic';
  ctx.save();ctx.translate(p.x,p.y);ctx.rotate(aci);
  var col=sel?'#FFD700':TH.door;
  // Açıklık: duvarı boşalt
  ctx.fillStyle=TH.opening;ctx.fillRect(0,-h2-0.5,w,2*h2+1);
  // Kasa
  ctx.strokeStyle=col;ctx.lineWidth=2;
  ctx.beginPath();ctx.moveTo(0,-h2);ctx.lineTo(0,h2);ctx.moveTo(w,-h2);ctx.lineTo(w,h2);ctx.stroke();
  var y0=yan*h2;
  if(tip==='surme'){
    // İki panel, duvar içinde kaydırmalı
    var ph=Math.max(2,h2*0.35);
    ctx.fillStyle=col+'33';ctx.strokeStyle=col;ctx.lineWidth=1.2;
    ctx.fillRect(0,-ph,w*0.55,ph);ctx.strokeRect(0,-ph,w*0.55,ph);
    ctx.fillRect(w*0.45,0,w*0.55,ph);ctx.strokeRect(w*0.45,0,w*0.55,ph);
    // yön oku
    var ay=yan*(h2+8);
    ctx.beginPath();ctx.moveTo(w*0.3,ay);ctx.lineTo(w*0.7,ay);
    ctx.moveTo(w*0.7-4,ay-3);ctx.lineTo(w*0.7,ay);ctx.lineTo(w*0.7-4,ay+3);ctx.stroke();
  } else if(tip==='cift'){
    _kanat(0,y0,w/2,yan,w/2,col,sel);
    _kanat(w,y0,w/2,yan,w/2,col,sel);
  } else {
    var hx=men==='a'?0:w,fx=men==='a'?w:0;
    _kanat(hx,y0,w,yan,fx,col,sel);
  }
  ctx.restore();
}
function drawPencere(e,ex,ey,aci,k,sel){
  var s=sc(),p=toCv(ex,ey),w=e.en*s,h2=k*s/2;
  ctx.save();ctx.translate(p.x,p.y);ctx.rotate(aci);
  var col=sel?'#FFD700':TH.win;
  ctx.fillStyle=TH.winFill;ctx.fillRect(0,-h2,w,2*h2);
  ctx.strokeStyle=col;ctx.lineWidth=sel?2:1.4;
  ctx.strokeRect(0,-h2,w,2*h2);
  // cam çizgileri
  ctx.lineWidth=1;ctx.strokeStyle=col+'aa';
  ctx.beginPath();ctx.moveTo(0,-h2*0.25);ctx.lineTo(w,-h2*0.25);ctx.moveTo(0,h2*0.25);ctx.lineTo(w,h2*0.25);ctx.stroke();
  if(e.penTip==='surme'||e.penTip==='cift-kanat'){
    ctx.beginPath();ctx.moveTo(w/2,-h2);ctx.lineTo(w/2,h2);ctx.stroke();
  }
  ctx.restore();
}

// ═══ KAPI AYNALAMA TUTAMAÇLARI ═══════════════════════════════════════════
// Seçili kapının açılma alanında iki buton: ⇅ (içe/dışa çevir)  ⇄ (menteşe tarafını çevir)
function kapiHandles(e){
  if(!e||e.tip_!=='kapi')return null;
  var seg=getSeg(e.segId);if(!seg)return null;
  var a=getNode(seg.n1),b=getNode(seg.n2);if(!a||!b)return null;
  var L=dist(a.x,a.y,b.x,b.y);if(L<1)return null;
  var ux=(b.x-a.x)/L,uy=(b.y-a.y)/L,nx=-uy,ny=ux,yan=kapiYan(e);
  var c=toCv(a.x+ux*(e.t*L+e.en/2),a.y+uy*(e.t*L+e.en/2));
  var wpx=e.en*sc(),h2=seg.k*sc()/2;
  var d=h2+Math.max(22,Math.min(wpx*0.45,60));
  var bx=c.x+nx*yan*d,by=c.y+ny*yan*d,gap=15;
  return{ang:Math.atan2(uy,ux),
    yan:{x:bx-ux*gap,y:by-uy*gap},men:{x:bx+ux*gap,y:by+uy*gap}};
}
function hitKapiHandle(px,py){
  if(G.seciliTip!=='eleman'||!G.secili)return null;
  var H=kapiHandles(G.secili);if(!H)return null;
  if(Math.hypot(px-H.yan.x,py-H.yan.y)<12)return 'yan';
  if(kapiMenVar(G.secili)&&Math.hypot(px-H.men.x,py-H.men.y)<12)return 'men';
  return null;
}
function _okBtn(x,y,ang,vertical){
  ctx.save();ctx.translate(x,y);
  ctx.fillStyle='#0d1117f0';ctx.strokeStyle='#f0883e';ctx.lineWidth=1.3;
  ctx.beginPath();ctx.arc(0,0,11,0,Math.PI*2);ctx.fill();ctx.stroke();
  ctx.rotate(ang+(vertical?Math.PI/2:0));
  ctx.strokeStyle='#ffd8b0';ctx.lineWidth=1.6;
  ctx.beginPath();ctx.moveTo(-6,0);ctx.lineTo(6,0);
  ctx.moveTo(-3,-3);ctx.lineTo(-6,0);ctx.lineTo(-3,3);
  ctx.moveTo(3,-3);ctx.lineTo(6,0);ctx.lineTo(3,3);ctx.stroke();
  ctx.restore();
}
function kapiMenVar(e){var t=e.kapiTip||'ic';return t==='ic'||t==='dis';}
function drawKapiHandles(){
  if(G.seciliTip!=='eleman'||!G.secili||G.secili.tip_!=='kapi')return;
  var e=G.secili,H=kapiHandles(e);if(!H)return;
  _okBtn(H.yan.x,H.yan.y,H.ang,true);          // ⇅ içe/dışa
  if(kapiMenVar(e))_okBtn(H.men.x,H.men.y,H.ang,false); // ⇄ menteşe
}
function kapiCevir(mode){
  var e=G.secili;if(!e||G.seciliTip!=='eleman'||e.tip_!=='kapi')return;
  pushH();
  if(mode==='yan'){e.yan=-kapiYan(e);e.kapiYon=kapiYonHesapla(e);}
  else{e.mentese=kapiMen(e)==='a'?'b':'a';}
  draw();updateSidebar();
}
// Duvarın hangi tarafı oda? (+1: n yönü, -1: ters, 0: iki taraf da oda / hiçbiri)
function pointInAnyRoom(x,y,verandaHaric){
  return G.rooms.some(function(r){
    if(verandaHaric&&r.tip==='veranda')return false;
    var pts=r.nodeIds.map(getNode).filter(Boolean);
    if(pts.length<3)return false;
    // hızlı kutu testi
    var bx=Infinity,by=Infinity,BX=-Infinity,BY=-Infinity;
    for(var i=0;i<pts.length;i++){var p=pts[i];if(p.x<bx)bx=p.x;if(p.x>BX)BX=p.x;if(p.y<by)by=p.y;if(p.y>BY)BY=p.y;}
    if(x<bx||x>BX||y<by||y>BY)return false;
    return ptInPolygon(x,y,pts);
  });
}
function segRoomSide(seg,atCm){
  var a=getNode(seg.n1),b=getNode(seg.n2);if(!a||!b)return 0;
  var L=dist(a.x,a.y,b.x,b.y);if(L<1)return 0;
  var ux=(b.x-a.x)/L,uy=(b.y-a.y)/L,nx=-uy,ny=ux;
  var m=atCm===undefined?L/2:atCm,px=a.x+ux*m,py=a.y+uy*m,pr=seg.k/2+12;
  var vh=seg.tip!=='veranda'; // ev duvarı için veranda dış mekan sayılır → ölçüler verandaya bakan tarafa
  var ip=pointInAnyRoom(px+nx*pr,py+ny*pr,vh),im=pointInAnyRoom(px-nx*pr,py-ny*pr,vh);
  if(ip&&!im)return 1;if(im&&!ip)return -1;return 0;
}
function kapiYonHesapla(e){
  var seg=getSeg(e.segId);if(!seg)return e.kapiYon;
  var rs=segRoomSide(seg);
  if(!rs)return e.kapiYon; // iç duvar: iki taraf da oda
  return kapiYan(e)===rs?'ic':'dis';
}

// ═══ ÖLÇÜ ZİNCİRİ (profesyonel kot) ══════════════════════════════════════
// • Kotlar duvarın DIŞ tarafına, duvar kalınlığının dışına yazılır (iç duvarda kapı açılmayan tarafa)
// • Kapı/pencere varsa: 1. sıra zincir (duvar–açıklık–duvar), 2. sıra toplam boy
// • Yazılar duvara paralel ve her zaman okunur yönde; birim cm
// Modern ölçü stili: ince çizgi, 45° çentik, kutusuz yazı (arka plan rengiyle hale), Inter, tabular rakam
var DIM_DARK={line:'rgba(126,231,135,0.42)',ext:'rgba(126,231,135,0.22)',tick:'rgba(126,231,135,0.85)',txt:'#b4f0bd',txtTot:'#e6ffe9',
  door:'#ffa657',win:'#79c0ff',sel:'#f2cc60',halo:'#121822'};
var DIM_PAPER={line:'rgba(96,110,128,0.55)',ext:'rgba(96,110,128,0.28)',tick:'rgba(70,82,98,0.9)',txt:'#56616f',txtTot:'#2b3544',
  door:'#c9853f',win:'#4f8fbf',sel:'#c9853f',halo:'#fbfaf7'};
var DIM=DIM_DARK;
function _dimLine(ax,ay,ux,uy,sx,sy,d0,d1,offPx,wallPx,txt,col,strong){
  var p0=toCv(ax+ux*d0,ay+uy*d0),p1=toCv(ax+ux*d1,ay+uy*d1);
  var q0={x:p0.x+sx*offPx,y:p0.y+sy*offPx},q1={x:p1.x+sx*offPx,y:p1.y+sy*offPx};
  var len=Math.hypot(q1.x-q0.x,q1.y-q0.y);if(len<3)return;
  var accent=col&&col!==DIM.txt; // kapı/pencere/seçili
  ctx.save();ctx.lineCap='round';
  // Uzatma çizgileri: duvar yüzünden 3px boşluk, ölçü çizgisini 3px geçer
  ctx.strokeStyle=DIM.ext;ctx.lineWidth=1;
  ctx.beginPath();
  ctx.moveTo(p0.x+sx*(wallPx+3),p0.y+sy*(wallPx+3));ctx.lineTo(q0.x+sx*3,q0.y+sy*3);
  ctx.moveTo(p1.x+sx*(wallPx+3),p1.y+sy*(wallPx+3));ctx.lineTo(q1.x+sx*3,q1.y+sy*3);
  ctx.stroke();
  // Ölçü çizgisi
  ctx.strokeStyle=accent?col+'99':DIM.line;ctx.lineWidth=1;
  ctx.beginPath();ctx.moveTo(q0.x,q0.y);ctx.lineTo(q1.x,q1.y);ctx.stroke();
  // 45° çentik
  var tx=(ux+sx)*2.6,ty=(uy+sy)*2.6;
  ctx.strokeStyle=accent?col:DIM.tick;ctx.lineWidth=1.3;
  ctx.beginPath();ctx.moveTo(q0.x-tx,q0.y-ty);ctx.lineTo(q0.x+tx,q0.y+ty);
  ctx.moveTo(q1.x-tx,q1.y-ty);ctx.lineTo(q1.x+tx,q1.y+ty);ctx.stroke();
  // Yazı
  var ang=Math.atan2(uy,ux);if(ang>Math.PI/2+1e-6||ang<=-Math.PI/2+1e-6)ang+=Math.PI;
  var fs=Math.round(Math.max(10,Math.min(13,11*Math.sqrt(G.zoom))));
  ctx.font=(strong?'600 ':'500 ')+fs+'px '+FF;
  try{ctx.fontVariantNumeric='tabular-nums';}catch(_){}
  var tw=ctx.measureText(txt).width;
  if(len<10&&!_dimUc){ctx.restore();return;}
  var fits=tw+8<=len;
  var lift=fits?fs*0.5+3:fs*1.5+4; // sığmazsa bir sıra dışarı
  var mx=(q0.x+q1.x)/2+sx*lift,my=(q0.y+q1.y)/2+sy*lift;
  if(!fits&&_dimUc){ // uçtaki küçük parça (köşe payı 5/10): yazıyı ölçü çizgisinin dışına, uca doğru al
    lift=fs*0.5+3;var sh=(len/2+tw/2+6)*_dimUc;
    mx=(q0.x+q1.x)/2+sx*lift+ux*sh;my=(q0.y+q1.y)/2+sy*lift+uy*sh;
  }
  if(_dimRow&&G._dimHits)G._dimHits.push({segId:_dimRow.meta.segId,row:_dimRow.row,side:_dimRow.meta.side,
    sx:sx,sy:sy,off:offPx,q0:q0,q1:q1,tx:mx,ty:my,tw:tw});
  ctx.translate(mx,my);ctx.rotate(ang);
  ctx.textAlign='center';ctx.textBaseline='middle';
  ctx.lineJoin='round';ctx.lineWidth=3.5;ctx.strokeStyle=DIM.halo;ctx.strokeText(txt,0,0);
  ctx.fillStyle=accent?col:(strong?DIM.txtTot:DIM.txt);ctx.fillText(txt,0,0);
  ctx.restore();
}
// Kot tarafının varsayılan ofseti (px): duvar yüzü + boşluk, o tarafa açılan kapı yayının dışı
function dimBase(seg,side,els,wallPx){
  var s=sc(),off=wallPx+16;
  els.forEach(function(e){
    if(e.tip_!=='kapi'||kapiYan(e)!==side||e.kapiTip==='surme')return;
    var r=(e.kapiTip==='cift'?e.en/2:e.en)*s;
    off=Math.max(off,wallPx+r+12);
  });
  return off;
}
function dimAutoSide(seg,els){
  var rs=segRoomSide(seg);
  if(rs)return -rs; // dış taraf
  var dk=els.find(function(e){return e.tip_==='kapi';});
  return dk?-kapiYan(dk):1;
}
function dimGizli(seg,row){return !!(seg.dimGizle&&seg.dimGizle.indexOf(row)>=0);}
var _dimRow=null,_dimUc=0; // _dimLine'ın kaydettiği hit bilgisi
// Prefabrik "panel ölçü" modu: her DUVAR HATTI için AutoCAD'deki gibi
//   1. sıra: dış yüz → köşe payı (5 / 10) → her panel (125,5 / 62,75 / özel) → köşe payı → dış yüz
//   2. sıra: dış yüzden dış yüze toplam (ör. 8 panel + 2×10 = 1024)
// Nasıl çizildiğinden (tek tek ya da tek seferde) bağımsız, hep aynı sonuç.
function drawDimsPanel(){
  var s=sc(),A=pfAnaliz();
  G._dimHits=[];
  A.runs.forEach(function(r){
    var o=r.owner,a={x:r.ax,y:r.ay},L=r.L;if(L*s<18)return;
    var els=[];r.items.forEach(function(it){G.elemanlar.forEach(function(e){if(e.segId===it.seg.id)els.push(e);});});
    var nx=-r.uy,ny=r.ux,side=o.dimSide||dimAutoSide(o,els.filter(function(e){return e.segId===o.id;}));
    // hattın normali segmentin normaliyle ters olabilir (hat yönü kanonik) → dış tarafı segmente göre bul
    var it0=r.items[0],sgn=it0.rev?-1:1;
    var sx=nx*side*sgn,sy=ny*side*sgn,wallPx=o.k*s/2;
    var off1=Math.max(wallPx+10,dimBase(o,side,els.filter(function(e){return e.segId===o.id;}),wallPx)+(o.dimOff||0)*s);
    var dimSel=G.seciliTip==='dim'&&G.secili&&G.secili.id===o.id;
    var baseCol=isSegSel(o.id)?'#58a6ff':DIM.txt;
    var C0=r.f0,C1=L-r.f1,aks=G.olcuModu==='aks',pts;
    if(aks){
      // SADE: panel ölçüleri yok; dış yüzden → bölme duvarı akslarına → dış yüze (odadan odaya)
      pts=[C0];(r.birlesim||[]).forEach(function(p){if(p>C0+0.3&&p<C1-0.3)pts.push(p);});pts.push(C1);
    } else {
      pts=[C0];
      r.slots.forEach(function(p,i){if(Math.abs(p.a-pts[pts.length-1])>0.3)pts.push(p.a);});
      var lastB=r.slots.length?r.slots[r.slots.length-1].b:C1;
      if(Math.abs(lastB-pts[pts.length-1])>0.3)pts.push(lastB);
      if(Math.abs(C1-pts[pts.length-1])>0.3)pts.push(C1);
    }
    var meta={segId:o.id,side:side,sx:sx,sy:sy,wallPx:wallPx};
    var zincirVar=pts.length>2&&!dimGizli(o,'zincir');
    if(zincirVar){
      _dimRow={row:'zincir',meta:meta,off:off1};
      var cc=dimSel&&G.seciliDimRow==='zincir'?'#58a6ff':baseCol;
      for(var i=0;i<pts.length-1;i++){
        var d0=pts[i],d1=pts[i+1],m=(d0+d1)/2,sl=r.slots.find(function(p){return m>=p.a&&m<=p.b;});
        var col=cc;
        if(sl&&cc===baseCol){if(sl.acik==='kapi')col=DIM.door;else if(sl.acik==='pencere')col=DIM.win;else if(sl.tip==='ozel')col='#d29922';}
        _dimUc=(!aks&&i===0&&d1-d0<30)?-1:(!aks&&i===pts.length-2&&d1-d0<30)?1:0;
        _dimLine(a.x,a.y,r.ux,r.uy,sx,sy,d0,d1,off1,wallPx,fmtCm(d1-d0),col,false);
        _dimUc=0;
      }
    }
    if(!dimGizli(o,'toplam')){
      var offT=zincirVar?off1+20:off1;
      _dimRow={row:'toplam',meta:meta,off:offT};
      _dimLine(a.x,a.y,r.ux,r.uy,sx,sy,C0,C1,offT,wallPx,fmtCm(C1-C0),dimSel&&G.seciliDimRow==='toplam'?'#58a6ff':baseCol,true);
    }
    _dimRow=null;
  });
  // veranda sınırları: evin köşe direğinin bittiği yerden (duvarın dış yüzünden) ölçülür
  function verUcPay(nid,sg){
    var m=0;G.segs.forEach(function(o){if(o.tip==='veranda'||o===sg||(o.n1!==nid&&o.n2!==nid))return;if(!isParallel(o,sg))m=Math.max(m,o.k/2);});return m;
  }
  G.segs.forEach(function(sg){
    if(sg.tip!=='veranda'||dimGizli(sg,'toplam'))return;
    var p=getNode(sg.n1),q=getNode(sg.n2);if(!p||!q)return;var L=dist(p.x,p.y,q.x,q.y);if(L*s<18)return;
    var ux=(q.x-p.x)/L,uy=(q.y-p.y)/L,side=sg.dimSide||dimAutoSide(sg,[]);
    var d0=verUcPay(sg.n1,sg),d1=L-verUcPay(sg.n2,sg),off=Math.max(sg.k*s/2+10,sg.k*s/2+16+(sg.dimOff||0)*s);
    _dimRow={row:'toplam',meta:{segId:sg.id,side:side,sx:-uy*side,sy:ux*side,wallPx:sg.k*s/2},off:off};
    _dimLine(p.x,p.y,ux,uy,-uy*side,ux*side,d0,d1,off,sg.k*s/2,fmtCm(d1-d0),DIM.txt,true);_dimRow=null;
  });
}
function olcuModuCevir(){G.olcuModu=G.olcuModu==='aks'?'panel':'aks';var b=document.getElementById('olcuBtn');if(b)b.textContent=G.olcuModu==='aks'?'📏 Sade':'📏 Detaylı';draw();}
function drawDims(){
  if(isPref()){drawDimsPanel();return;} // prefabrikte iki modda da hat bazlı; toplam hep dış köşeden köşeye
  var s=sc();
  G._dimHits=[];
  G.segs.forEach(function(seg){
    var a=getNode(seg.n1),b=getNode(seg.n2);if(!a||!b)return;
    var L=dist(a.x,a.y,b.x,b.y);if(L<1||L*s<18)return;
    var ux=(b.x-a.x)/L,uy=(b.y-a.y)/L,nx=-uy,ny=ux;
    var els=G.elemanlar.filter(function(e){return e.segId===seg.id;})
      .sort(function(p,q){return p.t-q.t;});
    var side=seg.dimSide||dimAutoSide(seg,els);
    var sx=nx*side,sy=ny*side,wallPx=seg.k*s/2;
    var off1=Math.max(wallPx+10,dimBase(seg,side,els,wallPx)+(seg.dimOff||0)*s);
    var selSeg=isSegSel(seg.id);
    var dimSel=G.seciliTip==='dim'&&G.secili&&G.secili.id===seg.id;
    var baseCol=selSeg?'#58a6ff':DIM.txt;
    var hasChain=els.length&&!dimGizli(seg,'zincir');
    var totHidden=dimGizli(seg,'toplam');
    var meta={segId:seg.id,side:side,sx:sx,sy:sy,wallPx:wallPx};
    if(hasChain){
      _dimRow={row:'zincir',meta:meta,off:off1};
      var cc=dimSel&&G.seciliDimRow==='zincir'?'#58a6ff':baseCol;
      var cur=0;
      els.forEach(function(e){
        var st=Math.max(0,e.t*L),en=Math.min(L,st+e.en);
        if(st-cur>0.5)_dimLine(a.x,a.y,ux,uy,sx,sy,cur,st,off1,wallPx,fmtCm(st-cur),cc,false);
        var isSel=G.secili&&G.seciliTip==='eleman'&&G.secili.id===e.id;
        var ec=dimSel&&G.seciliDimRow==='zincir'?'#58a6ff':(isSel?DIM.sel:(e.tip_==='kapi'?DIM.door:DIM.win));
        _dimLine(a.x,a.y,ux,uy,sx,sy,st,en,off1,wallPx,fmtCm(e.en),ec,false);
        cur=Math.max(cur,en);
      });
      if(L-cur>0.5)_dimLine(a.x,a.y,ux,uy,sx,sy,cur,L,off1,wallPx,fmtCm(L-cur),cc,false);
    }
    if(!totHidden){
      var offT=hasChain?off1+20:off1;
      _dimRow={row:'toplam',meta:meta,off:offT};
      _dimLine(a.x,a.y,ux,uy,sx,sy,0,L,offT,wallPx,fmtCm(L),
        dimSel&&G.seciliDimRow==='toplam'?'#58a6ff':baseCol,true);
    }
    _dimRow=null;
  });
}
function hitDim(px,py){
  var H=G._dimHits||[];
  for(var i=H.length-1;i>=0;i--){
    var h=H[i];
    var d=ptSegDistPx(px,py,h.q0.x,h.q0.y,h.q1.x,h.q1.y);
    var dt=Math.hypot(px-h.tx,py-h.ty);
    if(d<5||dt<Math.max(10,h.tw/2+3))return h;
  }
  return null;
}
function ptSegDistPx(px,py,x1,y1,x2,y2){
  var dx=x2-x1,dy=y2-y1,l2=dx*dx+dy*dy;if(l2<1e-6)return Math.hypot(px-x1,py-y1);
  var t=Math.max(0,Math.min(1,((px-x1)*dx+(py-y1)*dy)/l2));
  return Math.hypot(px-(x1+dx*t),py-(y1+dy*t));
}
// Kot sürükleme: dik yönde kaydır; duvarın öbür tarafına geçerse taraf değişir
function dimDragMove(cm){
  var D=G.dimDrag,seg=getSeg(D.segId);if(!seg)return;
  var s=sc();
  var target=D.startOff+((cm.x-D.start.x)*D.sx+(cm.y-D.start.y)*D.sy)*s; // px, başlangıç tarafına göre işaretli
  var els=G.elemanlar.filter(function(e){return e.segId===seg.id;});
  var wallPx=seg.k*s/2,min=wallPx+10,side=D.side;
  if(target<0){side=-D.side;target=-target;}
  if(target<min)target=min;
  var rowShift=(D.row==='toplam'&&els.length&&!dimGizli(seg,'zincir'))?20:0;
  seg.dimSide=side;
  seg.dimOff=(target-rowShift-dimBase(seg,side,els,wallPx))/s;
}
function dimSil(){
  if(G.seciliTip!=='dim'||!G.secili)return;
  pushH();
  var seg=G.secili;seg.dimGizle=(seg.dimGizle||[]).concat([G.seciliDimRow]);
  G.secili=null;G.seciliTip=null;updateSidebar();updateDimRestore();draw();
}
function dimTarafCevir(){
  if(G.seciliTip!=='dim'||!G.secili)return;
  pushH();var seg=G.secili;
  var els=G.elemanlar.filter(function(e){return e.segId===seg.id;});
  seg.dimSide=-(seg.dimSide||dimAutoSide(seg,els));seg.dimOff=0;draw();
}
function dimSifirla(){
  if(G.seciliTip!=='dim'||!G.secili)return;
  pushH();var seg=G.secili;delete seg.dimSide;delete seg.dimOff;draw();
}
function dimHepsiniGeriGetir(){
  pushH();
  G.segs.forEach(function(s){delete s.dimGizle;delete s.dimSide;delete s.dimOff;});
  updateDimRestore();draw();
}
function updateDimRestore(){
  var el=document.getElementById('dimRestore');if(!el)return;
  var n=G.segs.reduce(function(a,s){return a+((s.dimGizle&&s.dimGizle.length)?s.dimGizle.length:0);},0);
  var m=G.segs.some(function(s){return s.dimSide||s.dimOff;});
  el.style.display=(n||m)?'':'none';
  el.textContent='↺ Ölçüleri sıfırla'+(n?' ('+n+' gizli)':'');
}

function drawElemanMesafe(e,seg,n1,n2,ux,uy,dLen){
  var tStart=e.t*dLen;
  var tEnd=tStart+e.en;
  var siblings=G.elemanlar.filter(function(k){return k.id!==e.id&&k.segId===seg.id;})
    .map(function(k){return{tS:k.t*dLen,tE:k.t*dLen+k.en};})
    .sort(function(a,b){return a.tS-b.tS;});
  var prevEnd=0;
  for(var i=siblings.length-1;i>=0;i--){if(siblings[i].tE<tStart-1){prevEnd=siblings[i].tE;break;}}
  var nextStart=dLen;
  for(var i=0;i<siblings.length;i++){if(siblings[i].tS>tEnd+1){nextStart=siblings[i].tS;break;}}
  var pE=toCv(n1.x+ux*tStart,n1.y+uy*tStart);
  var pEEnd=toCv(n1.x+ux*tEnd,n1.y+uy*tEnd);
  var pPrev=toCv(n1.x+ux*prevEnd,n1.y+uy*prevEnd);
  var pNext=toCv(n1.x+ux*nextStart,n1.y+uy*nextStart);
  if(tStart-prevEnd>1)drawMLbl(pPrev.x,pPrev.y,pE.x,pE.y,((tStart-prevEnd)/100).toFixed(2)+'m','#FFD700',false);
  drawMLbl(pE.x,pE.y,pEEnd.x,pEEnd.y,(e.en/100).toFixed(2)+'m','#58a6ff',true);
  if(nextStart-tEnd>1)drawMLbl(pEEnd.x,pEEnd.y,pNext.x,pNext.y,((nextStart-tEnd)/100).toFixed(2)+'m','#FFD700',false);
}

function drawMLbl(x1,y1,x2,y2,txt,col,thin){
  ctx.strokeStyle=col+'88';ctx.lineWidth=thin?.8:1.5;
  ctx.setLineDash(thin?[2,3]:[4,3]);
  ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();
  ctx.setLineDash([]);
  ctx.font=(thin?'10':'bold 11')+'px '+FF;
  var tw=ctx.measureText(txt).width,mx=(x1+x2)/2,my=(y1+y2)/2;
  ctx.fillStyle='#0f1420cc';ctx.fillRect(mx-tw/2-3,my-7,tw+6,14);
  ctx.fillStyle=col;ctx.textAlign='center';ctx.textBaseline='middle';
  ctx.fillText(txt,mx,my);
}

function drawPreview(){
  if(!G.drawing||!G.drawPreviewPt||!G.drawStart)return;
  var sn=getNode(G.drawStart);if(!sn)return;
  if(G._ekKaydir&&G.snapType==='duvar')sn={id:sn.id,x:sn.x+G._ekKaydir.dx,y:sn.y+G._ekKaydir.dy};
  var ep=G.snapPt||G.drawPreviewPt;
  var preview=pfCizimOnizleme(sn,ep);
  if(preview){sn=preview.start;ep=preview.end;}
  var p1=toCv(sn.x,sn.y),p2=toCv(ep.x,ep.y);
  var dx=ep.x-sn.x,dy=ep.y-sn.y,len=Math.hypot(dx,dy);
  if(len<1)return;
  var s=sc(),k=G.defaultK*s/2;
  var ux=dx/len,uy=dy/len;
  ctx.save();ctx.setLineDash([5,4]);ctx.strokeStyle='#58a6ff';ctx.lineWidth=1.5;
  ctx.beginPath();ctx.moveTo(p1.x-uy*k,p1.y+ux*k);ctx.lineTo(p2.x-uy*k,p2.y+ux*k);ctx.stroke();
  ctx.beginPath();ctx.moveTo(p1.x+uy*k,p1.y-ux*k);ctx.lineTo(p2.x+uy*k,p2.y-ux*k);ctx.stroke();
  ctx.setLineDash([]);
  drawPreviewPaneller(sn,ep,preview);
  // Uzunluk etiketi
  ctx.font='bold 11px '+FF;ctx.fillStyle='#58a6ffcc';ctx.textAlign='center';ctx.textBaseline='middle';
  ctx.fillText(Math.round(len)+' cm'+(G.tool==='veranda'?' · veranda':''),(p1.x+p2.x)/2,(p1.y+p2.y)/2-14);
  if(G.shiftLock){
    ctx.fillStyle='#3fb950cc';
    ctx.fillText(G.lockAxis==='h'?'↔ Yatay':'↕ Dikey',(p1.x+p2.x)/2,(p1.y+p2.y)/2-26);
  }
  ctx.restore();
}

function drawSnapInd(){
  if(!G.snapPt)return;
  var p=toCv(G.snapPt.x,G.snapPt.y);
  ctx.save();
  var col={'node':'#FFD700','end':'#FFD700','mid':'#f0883e','axis':'#3fb950','lock':'#3fb950','grid':'#4a6a8a88',
    'duvar':'#39d0d8','ek':'#58a6ff','panel':'#f0883e'}[G.snapType]||'#4a6a8a88';
  if(G.snapType==='duvar'&&G._snapLbl){
    ctx.font='600 11px '+FF;ctx.textAlign='left';ctx.textBaseline='middle';
    ctx.lineWidth=3;ctx.strokeStyle='#0d1117';ctx.strokeText(G._snapLbl,p.x+14,p.y-14);
    ctx.fillStyle=G._snapLbl.indexOf('⚠')===0?'#f0883e':'#39d0d8';ctx.fillText(G._snapLbl,p.x+14,p.y-14);
  }
  ctx.strokeStyle=col;ctx.lineWidth=G.snapType==='node'?2.5:1.5;
  ctx.beginPath();ctx.arc(p.x,p.y,G.snapType==='node'?9:6,0,Math.PI*2);ctx.stroke();
  ctx.beginPath();ctx.moveTo(p.x-12,p.y);ctx.lineTo(p.x+12,p.y);ctx.stroke();
  ctx.beginPath();ctx.moveTo(p.x,p.y-12);ctx.lineTo(p.x,p.y+12);ctx.stroke();
  if(G.snapType==='axis'||G.drawing){
    // Tüm node'larla aynı X veya Y hizasında extension çizgisi göster
    var EPS=G.gridCm*0.8;
    var cm2=toCm(0,0); // kullanılmıyor, snapPt zaten var
    ctx.strokeStyle='#58a6ff22';ctx.lineWidth=1;ctx.setLineDash([2,6]);
    G.nodes.forEach(function(n){
      var np=toCv(n.x,n.y);
      if(G.snapPt&&Math.abs(n.x-G.snapPt.x)<EPS){
        ctx.beginPath();ctx.moveTo(np.x,0);ctx.lineTo(np.x,cv.height);ctx.stroke();
      }
      if(G.snapPt&&Math.abs(n.y-G.snapPt.y)<EPS){
        ctx.beginPath();ctx.moveTo(0,np.y);ctx.lineTo(cv.width,np.y);ctx.stroke();
      }
    });
    ctx.setLineDash([]);
  }
  if(G.snapType==='axis'){
    ctx.strokeStyle='#3fb95055';ctx.lineWidth=1;ctx.setLineDash([3,5]);
    ctx.beginPath();ctx.moveTo(p.x,0);ctx.lineTo(p.x,cv.height);ctx.stroke();
    ctx.beginPath();ctx.moveTo(0,p.y);ctx.lineTo(cv.width,p.y);ctx.stroke();
    ctx.setLineDash([]);
  }
  ctx.restore();
}

// ═══ MOUSE ═══════════════════════════════════════════════════════════════
cv.addEventListener('mousedown',function(e){
  var r=cv.getBoundingClientRect(),px=e.clientX-r.left,py=e.clientY-r.top;
  if(e.button===0)G._dragPress={px:px,py:py,cm:toCm(px,py),active:false};
  if(e.button===2||e.button===1){G.panning=true;G.panSt={x:px,y:py};G.panOrig={x:G.pan.x,y:G.pan.y};return;}
  var sp=snapPoint(px,py);
  if(!G.drawing){var kh=hitKapiHandle(px,py);if(kh){kapiCevir(kh);return;}}

  if(G.tool==='sec'){
    // Seçim: node > seg > eleman > room
    var hit=hitTestAll(px,py);
    if(hit){
      if(hit.tip==='room-lbl'){
        G.selSegs=[];G.secili=hit.obj;G.seciliTip='room';
        G.snapPt=null;G.lblDrag={roomId:hit.obj.id,start:toCm(px,py),startPx:{x:px,y:py},dx0:hit.obj.lblDx||0,dy0:hit.obj.lblDy||0,active:false};
        G.dragging=true;updateSidebar();draw();return;
      } else if(hit.tip==='dim'){
        G.selSegs=[];G.secili=hit.obj;G.seciliTip='dim';G.seciliDimRow=hit.dim.row;
        G.dimDrag={segId:hit.obj.id,row:hit.dim.row,side:hit.dim.side,sx:hit.dim.sx,sy:hit.dim.sy,
          startOff:hit.dim.off,start:toCm(px,py),startPx:{x:px,y:py},active:false};
        G.dragging=true;updateSidebar();draw();return;
      } else if(hit.tip==='mid-extend'){
        G.dragMidSeg=hit.obj;G.dragMidMode=hit.tip;G.dragging=true;
        updateSidebar();
      } else if(hit.tip==='mid-move'||hit.tip==='seg'){
        var sg=hit.obj;
        if(e.shiftKey||e.ctrlKey||e.metaKey){
          // Çoklu seçim: ekle / çıkar
          if(G.seciliTip!=='seg'||!G.secili)G.selSegs=[];
          else if(G.selSegs.indexOf(G.secili.id)<0)G.selSegs.push(G.secili.id);
          var ix=G.selSegs.indexOf(sg.id);
          if(ix>=0){
            G.selSegs.splice(ix,1);
            var nxt=G.selSegs.length?getSeg(G.selSegs[G.selSegs.length-1]):null;
            G.secili=nxt;G.seciliTip=nxt?'seg':null;
          } else {G.selSegs.push(sg.id);G.secili=sg;G.seciliTip='seg';}
          updateSidebar();draw();return;
        }
        // Zaten çoklu seçimdeyse seçimi koru → hepsini birlikte kaydır
        if(!(isSegSel(sg.id)&&G.selSegs.length>1))G.selSegs=[sg.id];
        G.secili=sg;G.seciliTip='seg';
        wallDragBegin(sg,toCm(px,py),px,py);
        G.dragging=true;
        updateSidebar();
      } else {
        G.selSegs=[];
        G.secili=hit.obj;G.seciliTip=hit.tip;
        if(hit.tip==='node'){G.dragging=true;G.dragNodeId=hit.obj.id;G._dragPress.node={x:hit.obj.x,y:hit.obj.y};}
        else if(hit.tip==='eleman'){G.dragging=true;G.dragEleman=hit.obj;G.dragElGrab=elemanGrab(hit.obj,toCm(px,py));pushH();}
        updateSidebar();
      }
    } else {
      G.secili=null;G.seciliTip=null;G.selSegs=[];
      // Oda çift tıkla — editörü aç
      updateSidebar();
    }
    draw();
  } else if(cizimAraci()){
    if(!G.drawing){
      // Çizimi başlat
      G.drawing=true;
      G.drawChain=true;
      // Var olan node'a snap mı?
      if(G.snapNodeId){G.drawStart=G.snapNodeId;}
      else{G.drawStart=addNode(sp.x,sp.y);}
      G._basH=(G.snapType==='ek')||(G._snapLbl&&G._snapLbl.indexOf('H')===0);
      G.drawPreviewPt=sp;
    } else {
      // Çizimi bitir — segment ekle
      var endNodeId;
      if(G.snapNodeId&&G.snapNodeId!==G.drawStart){endNodeId=G.snapNodeId;}
      else if(G.snapNodeId===G.drawStart){
        // Aynı node — iptal
        G.drawing=false;G.drawStart=null;G.drawPreviewPt=null;draw();return;
      } else {
        endNodeId=addNode(sp.x,sp.y);
      }
      var startN=getNode(G.drawStart),endN=getNode(endNodeId);
      if(startN&&endN&&dist(startN.x,startN.y,endN.x,endN.y)>G.defaultK){
        pushH();
        if(G._ekKaydir&&G.snapType==='duvar'){startN.x+=G._ekKaydir.dx;startN.y+=G._ekKaydir.dy;G._ekKaydir=null;}
        cizimKoseDuzelt(startN,endN,!!G.snapNodeId);
        var yeniId=addSeg(G.drawStart,endNodeId,G.defaultK,G.tool==='veranda'?'veranda':null,G.tool==='duvar');
        var ys=getSeg(yeniId);if(ys&&G.snapType==='panel')ys.pfSnap=true; // boyu panel snap'iyle (uç payı eklenmeden) verildi
      }
      // Zincirleme: bitiş noktasından devam et — drawing=true kalır
      G.drawStart=endNodeId;
      G.drawPreviewPt=sp;
      G.drawing=true; // devam et
    }
  } else if(G.tool==='kapi'||G.tool==='pencere'){
    var hitSeg=hitTestSeg(px,py);
    if(hitSeg)openModal(G.tool,hitSeg,sp,toCm(px,py));
  }
});

cv.addEventListener('dblclick',function(e){
  var r=cv.getBoundingClientRect(),px=e.clientX-r.left,py=e.clientY-r.top;
  if(cizimAraci()&&G.drawing){
    // Çift tıkla — çizimi bitir
    G.drawing=false;G.drawStart=null;G.drawPreviewPt=null;G.lockAxis=null;draw();return;
  }
  if(G.tool==='sec'){
    var hit=hitTestAll(px,py);
    if(hit&&(hit.tip==='seg'||hit.tip==='mid-move')){
      G.secili=hit.obj;G.seciliTip='seg';selectAligned();return;
    }
    if(hit&&(hit.tip==='room'||hit.tip==='room-lbl')){openOdaModal(hit.obj);}
  }
});

// Kare başına tek çizim: mousemove olayları birikse de ekran 60 fps'te bir kez güncellenir
var _raf=null,_rafRooms=false,_rafSide=false;
function reqDraw(rooms,side){
  if(rooms)_rafRooms=true;if(side)_rafSide=true;
  if(_raf)return;
  _raf=requestAnimationFrame(function(){
    _raf=null;
    if(_rafRooms){_rafRooms=false;detectRooms();}
    draw();
    if(_rafSide){_rafSide=false;updateSidebar();}
  });
}
cv.addEventListener('mousemove',function(e){
  var r=cv.getBoundingClientRect(),px=e.clientX-r.left,py=e.clientY-r.top;
  // Lost mouseup (outside the window) must never turn hovering into a move.
  if(G.dragging&&!(e.buttons&1)){window.dispatchEvent(new MouseEvent('mouseup',{button:0}));return;}
  if(G.dragging&&(G.dragNodeId||G.dragMidSeg)&&G._dragPress&&!G._dragPress.active){
    if(Math.hypot(px-G._dragPress.px,py-G._dragPress.py)<6)return;
    G._dragPress.active=true;pushH();
  }
  if(G.panning){G.pan.x=G.panOrig.x+(px-G.panSt.x);G.pan.y=G.panOrig.y+(py-G.panSt.y);reqDraw();return;}
  var sp=snapPoint(px,py);
  var cm=toCm(px,py);G.mouseCm=cm;
  document.getElementById('infoR').textContent=Math.round(cm.x)+'cm,'+Math.round(cm.y)+'cm | Z:'+Math.round(G.zoom*100)+'%';

  if(G.dragging&&G.lblDrag){
    var LD=G.lblDrag,rm=G.rooms.find(function(r){return r.id===LD.roomId;});
    if(!LD.active){if(Math.hypot(px-LD.startPx.x,py-LD.startPx.y)<3)return;LD.active=true;pushH();}
    if(rm){
      var ndx=LD.dx0+(cm.x-LD.start.x),ndy=LD.dy0+(cm.y-LD.start.y);
      // merkeze mıknatıs (12 px)
      if(Math.hypot(ndx,ndy)*sc()<12){ndx=0;ndy=0;}
      rm.lblDx=ndx;rm.lblDy=ndy;
    }
    reqDraw();return;
  }
  if(G.dragging&&G.dimDrag){
    var DD=G.dimDrag;
    if(!DD.active){if(Math.hypot(px-DD.startPx.x,py-DD.startPx.y)<3)return;DD.active=true;pushH();}
    dimDragMove(cm);reqDraw();return;
  }
  if(G.dragging&&G.wallDrag){
    if(wallDragMove(cm,px,py)&&G.wallDrag.active){reqDraw(true,true);}
    return;
  }
  if(G.dragging&&G.dragMidSeg){
    var ms=G.dragMidSeg;
    var mn1=getNode(ms.n1),mn2=getNode(ms.n2);if(!mn1||!mn2){return;}
    if(G.dragMidMode==='mid-move'){
      // Taşıma: yalnızca bu segmente özgü node'ları taşı
      // (başka segmentle paylaşılan node'ları taşıma!)
      var conn1=G.segs.filter(function(s2){return s2.id!==ms.id&&(s2.n1===ms.n1||s2.n2===ms.n1);}).length;
      var conn2=G.segs.filter(function(s2){return s2.id!==ms.id&&(s2.n1===ms.n2||s2.n2===ms.n2);}).length;
      var mdx=sp.x-((mn1.x+mn2.x)/2);
      var mdy=sp.y-((mn1.y+mn2.y)/2);
      if(conn1===0){mn1.x+=mdx;mn1.y+=mdy;}
      if(conn2===0){mn2.x+=mdx;mn2.y+=mdy;}
    } else if(G.dragMidMode==='mid-extend'){
      // Segment yönüne dik → kalınlık değil, segment boyunu değiştir
      // Mouse'un segmentin n2 yönündeki projeksiyonu
      var mdx2=mn2.x-mn1.x,mdy2=mn2.y-mn1.y,mlen=Math.hypot(mdx2,mdy2);
      if(mlen>1){
        var mux=mdx2/mlen,muy=mdy2/mlen;
        var proj=(sp.x-mn1.x)*mux+(sp.y-mn1.y)*muy;
        if(proj>ms.k){mn2.x=mn1.x+mux*proj;mn2.y=mn1.y+muy*proj;}
      }
    }
    reqDraw(true);return;
  }
  if(G.dragging&&G.dragNodeId){
    var n=getNode(G.dragNodeId);
    if(n){
      var press=G._dragPress;
      if(press&&press.node){var target=toCv(press.node.x+cm.x-press.cm.x,press.node.y+cm.y-press.cm.y);sp=snapPoint(target.x,target.y);}
      n.x=sp.x;n.y=sp.y;reqDraw(true);
    }
    return;
  }
  if(G.dragging&&G.dragEleman){
    var e2=G.dragEleman,seg=getSeg(e2.segId);
    if(seg){
      var n1=getNode(seg.n1),n2=getNode(seg.n2);
      var dx2=n2.x-n1.x,dy2=n2.y-n1.y,dLen=Math.hypot(dx2,dy2);
      var ux=dx2/dLen,uy=dy2/dLen;
      // Ham fare konumu (nokta/orta snap'i YOK) − tutma ofseti
      var pos=((cm.x-n1.x)*ux+(cm.y-n1.y)*uy)-G.dragElGrab;
      elemanKonumla(e2,seg,pos,e.altKey?1:G.elStep);
      reqDraw();
    }
    return;
  }
  if(G.drawing){G.drawPreviewPt=sp;reqDraw();}
  else{G.snapPt=sp;reqDraw();}
});

window.addEventListener('mouseup',function(e){ // pencere: tuval dışında bırakılsa da sürükleme biter
  if(G.panning){G.panning=false;return;}
  if(G.dragging){
    if(G.dimDrag){G.dimDrag=null;G.dragging=false;updateDimRestore();draw();return;}
    if(G.lblDrag){G.lblDrag=null;G.dragging=false;draw();updateSidebar();return;}
    if(G.wallDrag){
      G.dragging=false;
      wallDragEnd();
      detectRooms();draw();updateSidebar();return;
    }
    var wasGeom=!!(G.dragNodeId||G.dragMidSeg)&&!!(G._dragPress&&G._dragPress.active);
    G.dragging=false;G.dragNodeId=null;G.dragEleman=null;G.dragMidSeg=null;G.dragMidMode=null;
    if(wasGeom)normalizeGraph(); // bırakınca birleşimleri kur
    detectRooms();draw();updateSidebar();return;
  }
});

cv.addEventListener('contextmenu',function(e){
  e.preventDefault();
  // Sağ tık — duvar çizimini bitir
  if(G.drawing){G.drawing=false;G.drawStart=null;G.drawPreviewPt=null;G.lockAxis=null;draw();}
});

cv.addEventListener('wheel',function(e){
  e.preventDefault();
  var r=cv.getBoundingClientRect(),px=e.clientX-r.left,py=e.clientY-r.top;
  var f=e.deltaY<0?1.12:0.9,nz=Math.max(0.1,Math.min(10,G.zoom*f));
  G.pan.x=px-(px-G.pan.x)*(nz/G.zoom);G.pan.y=py-(py-G.pan.y)*(nz/G.zoom);G.zoom=nz;draw();
},{passive:false});

// ═══ KLAVYE ══════════════════════════════════════════════════════════════
document.addEventListener('keydown',function(e){
  if(['INPUT','TEXTAREA','SELECT'].includes(e.target.tagName))return;
  if(e.key==='Alt'){G.altKey=true;}
  // Özel ölçüden başlatma (duvar aracı, çizim başlamamış)
  if(cizimAraci()&&!G.drawing&&!e.ctrlKey&&!e.metaKey){
    if(/^[0-9]$/.test(e.key)||((e.key==='.'||e.key===',')&&G.numBuf.indexOf('.')<0&&G.numBuf.indexOf(',')<0)){G.numBuf+=e.key;draw();e.preventDefault();return;}
    if(G.numBuf){
      if(e.key==='Enter'){ozelBaslat();e.preventDefault();return;}
      if(e.key==='Backspace'){G.numBuf=G.numBuf.slice(0,-1);draw();e.preventDefault();return;}
      if(e.key==='Escape'){G.numBuf='';draw();e.preventDefault();return;}
    }
  }
  // Hızlı çizim: çizim sırasında sayı yaz → Enter
  if(G.drawing&&G.drawStart&&!e.ctrlKey&&!e.metaKey){
    if(/^[0-9]$/.test(e.key)||((e.key==='.'||e.key===',')&&G.numBuf.indexOf('.')<0&&G.numBuf.indexOf(',')<0)){
      G.numBuf+=e.key;draw();e.preventDefault();return;
    }
    if(G.numBuf){
      if(e.key==='Enter'){numUygula();e.preventDefault();return;}
      if(e.key==='Backspace'){G.numBuf=G.numBuf.slice(0,-1);draw();e.preventDefault();return;}
      if(e.key==='Escape'){G.numBuf='';draw();e.preventDefault();return;}
    }
  }
  if(e.key==='Shift'){
    G.shiftLock=true;G.lockAxis=null;
    document.getElementById('lockInd').style.display='block';
    document.getElementById('shiftLbl').textContent='🔒 Eksen kilitli';
  }
  if(!e.ctrlKey&&!e.metaKey&&e.key.toLowerCase()==='s')setTool('sec');
  if(!e.ctrlKey&&!e.metaKey&&e.key.toLowerCase()==='d')setTool('duvar');
  if(!e.ctrlKey&&!e.metaKey&&e.key.toLowerCase()==='v')setTool('veranda');
  if(!e.ctrlKey&&!e.metaKey&&e.key.toLowerCase()==='k')setTool('kapi');
  if(!e.ctrlKey&&!e.metaKey&&e.key.toLowerCase()==='p')setTool('pencere');
  if(e.key==='Escape'){
    if(G.drawing){G.drawing=false;G.drawStart=null;G.drawPreviewPt=null;G.lockAxis=null;G.numBuf='';draw();}
    else{G.secili=null;G.seciliTip=null;updateSidebar();draw();}
  }
  if(e.key==='Delete'||e.key==='Backspace'){e.preventDefault();seciliSil();}
  if(G.seciliTip==='eleman'&&e.key.indexOf('Arrow')===0){
    var ad={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,-1],ArrowDown:[0,1]}[e.key];
    if(elemanKaydir(ad[0],ad[1],e.shiftKey?10:(e.altKey?0.2:1)))e.preventDefault();
  }
  if(e.ctrlKey&&e.key==='z'){e.preventDefault();geriAl();}
});
document.addEventListener('keyup',function(e){
  if(e.key==='Alt')G.altKey=false;
  if(e.key==='Shift'){
    G.shiftLock=false;G.lockAxis=null;
    document.getElementById('lockInd').style.display='none';
    document.getElementById('shiftLbl').textContent='';
    if(G.drawing)draw();
  }
});

// ═══ DUVAR KAYDIRMA (paralel ofset, çoklu seçim) ═════════════════════════
// Seçili duvar(lar) tutulup çekilince KENDİNE PARALEL, normal yönünde kayar.
// Birden çok paralel duvar seçiliyse (Shift/Ctrl+tık veya çift tık = hizadakiler) hepsi birlikte kayar.
// Her hareketli uç node için, seçim dışı bağlı duvarlara göre:
//  • move   : tüm komşular kayma yönüne paralel → node kayar, komşular uzar/kısalır
//  • slide  : tek açılı komşu → node o komşunun doğrusunda kayar
//  • detach : duvarın düz devamı vb. → yeni node + kademe duvarı
// Hiza mıknatısı: duvar, başka bir node'un hizasına (ör. dış duvar çizgisi) yaklaşınca oraya yapışır.
// Komşu duvar sıfır boya inerse (tam hizaya gelince) node'lar birleşir.
var WALL_PAR=0.05;      // |cos| eşiği ≈ 3°
G.selSegs=[];

function isSegSel(id){
  if(G.seciliTip!=='seg'||!G.secili)return false;
  return G.secili.id===id||G.selSegs.indexOf(id)>=0;
}
function selSegList(){
  if(G.seciliTip!=='seg'||!G.secili)return[];
  var ids=G.selSegs.slice();if(ids.indexOf(G.secili.id)<0)ids.push(G.secili.id);
  return ids.map(getSeg).filter(Boolean);
}
function segDir(s){
  var a=getNode(s.n1),b=getNode(s.n2);if(!a||!b)return null;
  var dx=b.x-a.x,dy=b.y-a.y,L=Math.hypot(dx,dy);if(L<1)return null;
  return{ux:dx/L,uy:dy/L,a:a,b:b,L:L};
}
function isParallel(s1,s2){
  var d1=segDir(s1),d2=segDir(s2);if(!d1||!d2)return false;
  return Math.abs(d1.ux*d2.uy-d1.uy*d2.ux)<WALL_PAR;
}
// Aynı doğru üzerindeki tüm duvarlar
function alignedSegs(s){
  var d=segDir(s);if(!d)return[s];
  var nx=-d.uy,ny=d.ux;
  return G.segs.filter(function(o){
    if(!isParallel(s,o))return false;
    var a=getNode(o.n1),b=getNode(o.n2);
    return Math.abs((a.x-d.a.x)*nx+(a.y-d.a.y)*ny)<2&&Math.abs((b.x-d.a.x)*nx+(b.y-d.a.y)*ny)<2;
  });
}
function selectAligned(){
  if(G.seciliTip!=='seg'||!G.secili)return;
  G.selSegs=alignedSegs(G.secili).map(function(s){return s.id;});
  updateSidebar();draw();
}

function wallDragBegin(seg,cm,px,py){
  var d=segDir(seg);if(!d)return;
  var nx=-d.uy,ny=d.ux,ux=d.ux,uy=d.uy;
  // Taşınacak duvar grubu: seçimdeki, tutulan duvara paralel olanlar
  var group=selSegList().filter(function(s){return s.id===seg.id||isParallel(s,seg);});
  if(!group.some(function(s){return s.id===seg.id;}))group=[seg];
  var S={};group.forEach(function(s){S[s.id]=true;});
  var mov={};group.forEach(function(s){mov[s.n1]=true;mov[s.n2]=true;});

  var ends=Object.keys(mov).map(function(nid){
    var n=getNode(nid);
    var E={nid:nid,x:n.x,y:n.y,stretch:[],rest:[],mode:'move',own:[]};
    G.segs.forEach(function(s){
      if(s.n1!==nid&&s.n2!==nid)return;
      if(S[s.id]){E.own.push(s.id);return;}
      var oid=s.n1===nid?s.n2:s.n1,o=getNode(oid);if(!o)return;
      var vx=o.x-n.x,vy=o.y-n.y,vl=Math.hypot(vx,vy);if(vl<1)return;
      vx/=vl;vy/=vl;
      var info={segId:s.id,len:vl,vx:vx,vy:vy,vn:vx*nx+vy*ny,t:(o.x-n.x)*nx+(o.y-n.y)*ny,otherMoves:!!mov[oid]};
      if(info.otherMoves){E.stretch.push(info);return;} // iki ucu da hareketli → ötelenir
      if(Math.abs(vx*ux+vy*uy)<WALL_PAR)E.stretch.push(info);else E.rest.push(info);
    });
    if(!E.rest.length)E.mode='move';
    else if(!E.stretch.length&&E.rest.length===1&&Math.abs(E.rest[0].vn)>0.2)E.mode='slide';
    else E.mode='detach';
    return E;
  });

  // Sınırlar: komşu duvar ancak sıfıra kadar kısalabilir (tam hizada biter, ters dönmez)
  var lo=-Infinity,hi=Infinity;
  ends.forEach(function(E){
    E.stretch.forEach(function(st){
      if(st.otherMoves)return;
      if(st.t>0)hi=Math.min(hi,st.t);else if(st.t<0)lo=Math.max(lo,st.t);
    });
    if(E.mode==='slide'){var r=E.rest[0],lim=r.len*r.vn;if(r.vn>0)hi=Math.min(hi,lim);else lo=Math.max(lo,lim);}
  });

  // Hiza adayları: hareket etmeyen tüm node'ların normal doğrultusundaki mesafesi
  var align=[];
  G.nodes.forEach(function(n){
    if(mov[n.id])return;
    align.push({off:(n.x-d.a.x)*nx+(n.y-d.a.y)*ny,nid:n.id});
  });
  // Prefabrik: paralel duvarlarla MODÜLER aralık (aradaki duvarın panel alanı 62,75'in katı olsun)
  var grupIc=group.every(function(g){return !g.dis;});
  if(isPref()&&grupIc){ // yalnız iç bölmeler arası (dış duvarlar makas ızgarasına göre ayrıca yakalanır)
    G.segs.forEach(function(o){
      if(S[o.id]||o.tip==='veranda'||o.dis||!isParallel(o,seg))return;
      var p=getNode(o.n1);if(!p)return;
      var dO=(p.x-d.a.x)*nx+(p.y-d.a.y)*ny,pay=o.k/2+seg.k/2;
      if(Math.abs(dO)<1)return;
      var yon=dO>0?1:-1;
      for(var m=1;m<=12;m++){
        var off=dO-yon*(pay+m*PF.YARIM);
        if(Math.abs(off)<400)align.push({off:off,nid:o.n1,moduler:m*PF.YARIM});
      }
    });
  }

  // Prefabrik: duvar makas çizgilerine paralelse, makas aksları (125,5) ve yarım modüller (62,75) öncelikli hedef
  var makasHedef=[];
  if(isPref()){
    var Yk=catiYatay(),duvarDik=Yk?Math.abs(ux)<0.05:Math.abs(uy)<0.05; // duvar makas çizgisi doğrultusunda mı
    if(duvarDik){
      var org=(G._compLo&&G._compLo[seg.n1]!==undefined)?G._compLo[seg.n1]:(G._makasLo||0);
      var c0=Yk?d.a.x:d.a.y,nn=Yk?nx:ny; // hareket ekseni bileşeni
      if(Math.abs(nn)>0.5){
        for(var mi=-40;mi<=40;mi++){
          var hc=org+mi*PF.YARIM,off2=(hc-c0)/nn;
          if(Math.abs(off2)<800)makasHedef.push({off:off2,tam:mi%2===0,no:mi/2+1});
        }
      }
    }
  }
  var elPos=G.elemanlar.map(function(e){
    var s=getSeg(e.segId);if(!s)return null;
    var p=getNode(s.n1),q=getNode(s.n2);if(!p||!q)return null;
    return{id:e.id,x:p.x+(q.x-p.x)*e.t,y:p.y+(q.y-p.y)*e.t,onWall:!!S[s.id]};
  });

  G.wallDrag={segId:seg.id,groupIds:group.map(function(s){return s.id;}),makasHedef:makasHedef,
    nx:nx,ny:ny,ux:ux,uy:uy,ends:ends,lo:lo,hi:hi,align:align,elPos:elPos,alignNode:null,
    start:{x:cm.x,y:cm.y},startPx:{x:px,y:py},active:false,off:0,
    snap:JSON.stringify({n:G.nodes,s:G.segs,e:G.elemanlar})};
}

function wallDragMove(cm,px,py){
  var W=G.wallDrag;if(!W)return false;
  var raw=(cm.x-W.start.x)*W.nx+(cm.y-W.start.y)*W.ny;
  if(!W.active){
    if(Math.abs(raw)*sc()<6)return true;
    W.active=true;pushHSnap(W.snap);
  }
  var off=raw;W.alignNode=null;W.moduler=0;W.makasEk=null;
  var magnet=G.snapWall&&!G.altKey,targets=window.Prefab?Prefab.snapTargets():{h:true,mid:true,end:true,node:true};
  // 0) Makas aksı / yarım modül (prefabrik, en öncelikli)
  var R=12/sc(),best=R;
  (magnet?(W.makasHedef||[]):[]).forEach(function(h){
    if(h.kind&&!targets[h.kind==='H'?'h':h.kind])return;
    var dd=Math.abs(raw-h.off);
    if(dd<Math.max(R,6)&&dd<best+ (h.tam?3:0)&&h.off>=W.lo-0.01&&h.off<=W.hi+0.01){best=dd;off=h.off;W.makasEk=h;}
  });
  // 1) Hiza mıknatısı
  if(magnet&&!W.makasEk)W.align.forEach(function(a){
    if(a.moduler?!G.moveModule:!G.moveAlign)return;
    var dd=Math.abs(raw-a.off);
    if(dd<best&&a.off>=W.lo-0.01&&a.off<=W.hi+0.01){best=dd;off=a.off;W.alignNode=a.moduler?null:a.nid;W.moduler=a.moduler||0;}
  });
  // 2) Izgara
  if(!W.makasEk&&!W.alignNode&&!W.moduler&&G.snapGrid&&!G.altKey)off=Math.round(off/G.gridCm)*G.gridCm;
  if(Math.abs(raw)*sc()<6){off=0;W.alignNode=null;W.moduler=0;W.makasEk=null;}
  if(off>W.hi)off=W.hi;if(off<W.lo)off=W.lo;
  if(W.hi<W.lo)off=0;
  W.off=off;
  var p=JSON.parse(W.snap);G.nodes=p.n;G.segs=p.s;G.elemanlar=p.e;
  applyWallOffset(off);
  // Sıfır boylu kalan komşu varsa node'ları birleştir (tam hizaya gelindi)
  if(G.segs.some(function(s){return _segLen(s)<GRAPH_TOL;}))normalizeGraph();
  var seg=getSeg(W.segId);
  G.secili=seg||null;G.seciliTip=seg?'seg':null;
  G.selSegs=W.groupIds.filter(function(id){return !!getSeg(id);});
  return true;
}

function applyWallOffset(off){
  var W=G.wallDrag;
  var ox=W.nx*off,oy=W.ny*off;
  if(Math.abs(off)<0.01)return;
  W.ends.forEach(function(E){
    var n=getNode(E.nid);if(!n)return;
    if(E.mode==='move'){n.x=E.x+ox;n.y=E.y+oy;return;}
    if(E.mode==='slide'){var r=E.rest[0],s=off/r.vn;n.x=E.x+r.vx*s;n.y=E.y+r.vy*s;return;}
    // detach
    var nid=uid();G.nodes.push({id:nid,x:E.x+ox,y:E.y+oy});
    E.own.forEach(function(sid){var s=getSeg(sid);if(!s)return;if(s.n1===E.nid)s.n1=nid;else if(s.n2===E.nid)s.n2=nid;});
    E.stretch.forEach(function(st){
      if(!st.otherMoves&&st.t*off<=0)return;
      var s2=getSeg(st.segId);if(!s2)return;
      if(s2.n1===E.nid)s2.n1=nid;else s2.n2=nid;
    });
    var k0=getSeg(E.own[0]);
    var kon={id:uid(),n1:E.nid,n2:nid,k:k0?k0.k:G.defaultK,elemanlar:[]};
    if(k0&&k0.tip)kon.tip=k0.tip; // veranda kaydırılırken kademe de veranda olur
    G.segs.push(kon);
  });
  W.elPos.forEach(function(ep){
    if(!ep)return;
    var e=G.elemanlar.find(function(x){return x.id===ep.id;});if(!e)return;
    var s=getSeg(e.segId);if(!s)return;
    var p=getNode(s.n1),q=getNode(s.n2);if(!p||!q)return;
    var l=dist(p.x,p.y,q.x,q.y);if(l<1)return;
    var qx=ep.x+(ep.onWall?ox:0),qy=ep.y+(ep.onWall?oy:0);
    var t=((qx-p.x)*(q.x-p.x)+(qy-p.y)*(q.y-p.y))/(l*l);
    e.t=Math.max(0,Math.min(Math.max(0,1-e.en/l),t));
  });
}

function wallDragEnd(){
  var W=G.wallDrag;G.wallDrag=null;
  if(!W||!W.active)return false;
  normalizeGraph();
  var seg=getSeg(W.segId);
  G.selSegs=W.groupIds.filter(function(id){return !!getSeg(id);});
  if(!seg&&G.selSegs.length)seg=getSeg(G.selSegs[0]);
  G.secili=seg||null;G.seciliTip=seg?'seg':null;
  return true;
}

function pushHSnap(snapStr){
  var p=JSON.parse(snapStr);
  G.hist.push(JSON.stringify({n:p.n,s:p.s,e:p.e,r:G.rooms,c:G.catiYon}));
  if(G.hist.length>100)G.hist.shift();
}

function drawWallDragInfo(){
  var W=G.wallDrag;if(!W||!W.active)return;
  var seg=getSeg(W.segId);if(!seg)return;
  var a=getNode(seg.n1),b=getNode(seg.n2);if(!a||!b)return;
  // Hiza kılavuzu
  if(W.alignNode){
    var an=getNode(W.alignNode)||a;
    var g1=toCv(an.x-W.ux*5000,an.y-W.uy*5000),g2=toCv(an.x+W.ux*5000,an.y+W.uy*5000);
    ctx.save();ctx.setLineDash([4,4]);ctx.strokeStyle='#3fb950cc';ctx.lineWidth=1.2;
    ctx.beginPath();ctx.moveTo(g1.x,g1.y);ctx.lineTo(g2.x,g2.y);ctx.stroke();ctx.restore();
  }
  // Eski konum
  var p=JSON.parse(W.snap);
  W.groupIds.forEach(function(id){
    var s=p.s.find(function(x){return x.id===id;});if(!s)return;
    var oa=p.n.find(function(n){return n.id===s.n1;}),ob=p.n.find(function(n){return n.id===s.n2;});
    if(!oa||!ob)return;
    var c1=toCv(oa.x,oa.y),c2=toCv(ob.x,ob.y);
    ctx.save();ctx.setLineDash([6,4]);ctx.strokeStyle='#58a6ff66';ctx.lineWidth=1.5;
    ctx.beginPath();ctx.moveTo(c1.x,c1.y);ctx.lineTo(c2.x,c2.y);ctx.stroke();ctx.restore();
  });
  var m=toCv((a.x+b.x)/2+W.nx*30,(a.y+b.y)/2+W.ny*30);
  var txt=fmtCm(Math.abs(W.off))+' cm'+(W.makasEk?(W.makasEk.label?' · '+W.makasEk.label:W.makasEk.tam?'  · makas aksında (M'+W.makasEk.no+')':'  · yarım modülde'):W.alignNode?'  · hizada':W.moduler?'  · modüler aralık ('+fmtCm(W.moduler)+')':'');
  ctx.font='bold 12px '+FF;ctx.textAlign='center';ctx.textBaseline='middle';
  var w=ctx.measureText(txt).width+26;
  var col=W.makasEk?'#f0883e':W.alignNode?'#3fb950':'#58a6ff';
  ctx.fillStyle='#0d1117ee';ctx.strokeStyle=col;ctx.lineWidth=1;
  ctx.fillRect(m.x-w/2,m.y-10,w,20);ctx.strokeRect(m.x-w/2,m.y-10,w,20);
  ctx.fillStyle=col;ctx.fillText((Math.abs(W.nx)>Math.abs(W.ny)?'↔ ':'↕ ')+txt,m.x,m.y);
}

// ═══ KAPI/PENCERE KONUMLAMA ══════════════════════════════════════════════
// Adım snap'i hangi uca yakınsa o uçtan ölçülür → duvar dibindeki mesafe hep adımın katı olur
// (ör. 190'lık duvarda 80'lik kapı: üstten 0,5,10… ya da alttan 0,5,10…; asla 20 atlamaz)
function elemanGrab(e,cm){
  var seg=getSeg(e.segId);if(!seg)return 0;
  var n1=getNode(seg.n1),n2=getNode(seg.n2),L=dist(n1.x,n1.y,n2.x,n2.y);if(L<1)return 0;
  var ux=(n2.x-n1.x)/L,uy=(n2.y-n1.y)/L;
  return ((cm.x-n1.x)*ux+(cm.y-n1.y)*uy)-e.t*L;
}
// Uçta birleşen (paralel olmayan) duvarın yarı kalınlığı → kapı o duvarın içine giremez
function ucBosluk(seg,nodeId){
  var m=0;
  G.segs.forEach(function(o){
    if(o.id===seg.id||(o.n1!==nodeId&&o.n2!==nodeId))return;
    if(isParallel(o,seg))return; // düz devam eden duvar engel değil
    m=Math.max(m,o.k/2);
  });
  return m;
}
function elemanSinir(e,seg){
  var n1=getNode(seg.n1),n2=getNode(seg.n2),L=dist(n1.x,n1.y,n2.x,n2.y);
  var lo=ucBosluk(seg,seg.n1),hi=L-e.en-ucBosluk(seg,seg.n2);
  if(hi<lo){var m=(Math.max(0,L-e.en))/2;lo=hi=m;}
  return{L:L,lo:lo,hi:hi};
}
function elemanKonumla(e,seg,pos,step){
  var B=elemanSinir(e,seg);if(B.L<1)return;
  var maxP=Math.max(0,B.L-e.en);
  pos=Math.max(B.lo,Math.min(B.hi,pos));
  if(isPref()&&step>1){var py=prefElemanYuva(e,seg,pos);if(py!==null){e.t=Math.max(0,py)/B.L;return;}}
  if(step>0){
    if(pos<=maxP-pos)pos=Math.round(pos/step)*step;              // n1 ucuna yakın
    else pos=maxP-Math.round((maxP-pos)/step)*step;              // n2 ucuna yakın
    pos=Math.max(B.lo,Math.min(B.hi,pos));
  }
  e.t=pos/B.L;
}
function elemanKaydir(dirX,dirY,mult){
  var e=G.secili;if(!e||G.seciliTip!=='eleman')return false;
  var seg=getSeg(e.segId);if(!seg)return false;
  var n1=getNode(seg.n1),n2=getNode(seg.n2),L=dist(n1.x,n1.y,n2.x,n2.y);if(L<1)return false;
  var d=(dirX*(n2.x-n1.x)+dirY*(n2.y-n1.y))/L;
  if(Math.abs(d)<0.3)return false; // tuş duvar yönünde değil
  pushH();
  if(isPref()){ // bir sonraki panel yuvasına
    var py=prefElemanYuva(e,seg,e.t*L+(d>0?PF.PANEL:-PF.PANEL)*(mult>=1?1:0.5));
    if(py!==null){e.t=Math.max(0,py)/L;draw();return true;}
  }
  var step=G.elStep*mult,B=elemanSinir(e,seg);
  e.t=Math.max(B.lo,Math.min(B.hi,e.t*L+(d>0?step:-step)))/L;
  draw();return true;
}

// ═══ HIT TEST ════════════════════════════════════════════════════════════
function hitTestAll(px,py){
  var kh=hitKapiHandle(px,py);if(kh)return{obj:G.secili,tip:'kapi-'+kh};
  var cm=toCm(px,py);
  // Eleman
  for(var i=G.elemanlar.length-1;i>=0;i--){
    var e=G.elemanlar[i];var seg=getSeg(e.segId);if(!seg)continue;
    var n1=getNode(seg.n1),n2=getNode(seg.n2);if(!n1||!n2)continue;
    var dx=n2.x-n1.x,dy=n2.y-n1.y,dLen=Math.hypot(dx,dy);
    var ux=dx/dLen,uy=dy/dLen;
    var ex=n1.x+ux*e.t*dLen,ey=n1.y+uy*e.t*dLen;
    var ca=Math.cos(-Math.atan2(dy,dx)),sa=Math.sin(-Math.atan2(dy,dx));
    var ddx=cm.x-ex,ddy=cm.y-ey;
    var lx=ddx*ca-ddy*sa,ly=ddx*sa+ddy*ca;
    if(lx>=-5&&lx<=e.en+5&&Math.abs(ly)<=20)return{obj:e,tip:'eleman'};
  }
  // Oda etiketi — seçim aracında (sürüklenebilir)
  if(G.tool==='sec'&&G._lblHits){
    for(var li=G._lblHits.length-1;li>=0;li--){var L=G._lblHits[li];
      if(px>=L.x&&px<=L.x+L.w&&py>=L.y&&py<=L.y+L.h){var rr=G.rooms.find(function(r){return r.id===L.roomId;});if(rr)return{obj:rr,tip:'room-lbl'};}}
  }
  // Ölçü (kot) — seçim aracında
  if(G.tool==='sec'){var dh=hitDim(px,py);if(dh)return{obj:getSeg(dh.segId),tip:'dim',dim:dh};}
  // Segment orta nokta tutamaçları (seçili seg)
  if(G.secili&&G.seciliTip==='seg'){
    var ss=G.secili;
    var sn1=getNode(ss.n1),sn2=getNode(ss.n2);
    if(sn1&&sn2){
      var sdx=sn2.x-sn1.x,sdy=sn2.y-sn1.y,slen=Math.hypot(sdx,sdy);
      if(slen>1){
        var sux=sdx/slen,suy=sdy/slen;
        var mx=(sn1.x+sn2.x)/2,my=(sn1.y+sn2.y)/2;
        var HR=10/sc();
        // Turuncu orta → seg taşıma
        if(dist(cm.x,cm.y,mx,my)<HR)return{obj:ss,tip:'mid-move'};
        // Yeşil dik → uzatma
        var ex=mx-suy*ss.k,ey=my+sux*ss.k;
        if(dist(cm.x,cm.y,ex,ey)<HR)return{obj:ss,tip:'mid-extend'};
      }
    }
  }
  // Node
  var nodeR=14/sc();
  for(var i=G.nodes.length-1;i>=0;i--){
    var n=G.nodes[i];
    if(dist(cm.x,cm.y,n.x,n.y)<nodeR)return{obj:n,tip:'node'};
  }
  // Segment
  var segR=8;
  for(var i=G.segs.length-1;i>=0;i--){
    var s=G.segs[i];var n1=getNode(s.n1),n2=getNode(s.n2);if(!n1||!n2)continue;
    if(ptSegDistCm(cm.x,cm.y,n1.x,n1.y,n2.x,n2.y)<s.k/2+segR)return{obj:s,tip:'seg'};
  }
  // Oda
  for(var i=G.rooms.length-1;i>=0;i--){
    var room=G.rooms[i];
    var pts=room.nodeIds.map(function(id){var n=getNode(id);return n;}).filter(Boolean);
    if(ptInPolygon(cm.x,cm.y,pts))return{obj:room,tip:'room'};
  }
  return null;
}

function hitTestSeg(px,py){
  var cm=toCm(px,py);
  for(var i=G.segs.length-1;i>=0;i--){
    var s=G.segs[i];var n1=getNode(s.n1),n2=getNode(s.n2);if(!n1||!n2)continue;
    if(ptSegDistCm(cm.x,cm.y,n1.x,n1.y,n2.x,n2.y)<s.k/2+10)return s;
  }
  return null;
}

function ptSegDistCm(px,py,x1,y1,x2,y2){
  var dx=x2-x1,dy=y2-y1,l2=dx*dx+dy*dy;
  if(l2===0)return dist(px,py,x1,y1);
  var t=Math.max(0,Math.min(1,((px-x1)*dx+(py-y1)*dy)/l2));
  return dist(px,py,x1+t*dx,y1+t*dy);
}

function ptInPolygon(px,py,pts){
  var n=pts.length,inside=false;
  for(var i=0,j=n-1;i<n;j=i++){
    var xi=pts[i].x,yi=pts[i].y,xj=pts[j].x,yj=pts[j].y;
    if(((yi>py)!=(yj>py))&&(px<(xj-xi)*(py-yi)/(yj-yi)+xi))inside=!inside;
  }
  return inside;
}

// ═══ MODAL ════════════════════════════════════════════════════════════════
var _mSeg=null,_mT=null,_mSp=null;
var _mRaw=null;
function mTipDegis(){
  var t=document.getElementById('mTip').value,isK=_mT==='kapi';
  document.getElementById('mMenRow').style.display=(isK&&(t==='ic'||t==='dis'))?'':'none';
  document.getElementById('mYonRow').style.display=(isK&&t!=='surme')?'':'none';
  if(isK&&t==='cift'&&+document.getElementById('mEn').value<120)document.getElementById('mEn').value=140;
}
function openModal(tip,seg,sp,raw){
  _mSeg=seg;_mT=tip;_mSp=sp;_mRaw=raw||sp;
  document.getElementById('mTitle').textContent=tip==='kapi'?'🚪 Kapı Ekle':'🪟 Pencere Ekle';
  document.getElementById('mAd').value=tip==='kapi'?'İç kapı':'Pencere';
  document.getElementById('mEn').value=tip==='kapi'?80:120;
  document.getElementById('mYuk').value=tip==='kapi'?210:120;
  document.getElementById('mTipRow').style.display=tip==='kapi'?'':'none';
  document.getElementById('mYonRow').style.display=tip==='kapi'?'':'none';
  document.getElementById('mPenRow').style.display=tip==='pencere'?'':'none';
  document.getElementById('mKapiNot').style.display=tip==='kapi'?'':'none';
  if(tip==='kapi'){
    document.getElementById('mTip').value=seg.dis?'dis':'ic';
    document.getElementById('mAd').value=seg.dis?'Dış kapı':'İç kapı';
    mTipDegis();
  } else document.getElementById('mMenRow').style.display='none';
  document.getElementById('mbg').classList.add('open');
}
function modalOk(){
  var en=+document.getElementById('mEn').value,yuk=+document.getElementById('mYuk').value;
  var ad=document.getElementById('mAd').value;
  var kapiYon=document.getElementById('mYon').value,penTip=document.getElementById('mPenTip').value;
  var seg=_mSeg,sp=_mSp;
  var n1=getNode(seg.n1),n2=getNode(seg.n2);
  var dx=n2.x-n1.x,dy=n2.y-n1.y,dLen=Math.hypot(dx,dy);
  var ux=dx/dLen,uy=dy/dLen;
  // t: segment üzerindeki konum
  // Tıklanan nokta açıklığın ORTASI olsun
  var t=(((_mRaw||sp).x-n1.x)*ux+((_mRaw||sp).y-n1.y)*uy-en/2)/dLen;
  t=Math.max(0,Math.min(1-en/dLen,t));
  // Açılma tarafı: dış duvarda oda tarafı = içe; iç duvarda tıklanan taraf = içe
  var nx=-uy,ny=ux;
  var rs=segRoomSide(seg,t*dLen+en/2);
  var clickSide=((_mRaw.x-n1.x)*nx+(_mRaw.y-n1.y)*ny)>=0?1:-1;
  var inSide=rs||clickSide;
  var yan=kapiYon==='dis'?-inSide:inSide;
  // Menteşe: açıldığı taraftan bakınca sol → yan>0 ise başlangıç (a)
  var sol=document.getElementById('mMen').value==='sol';
  var mentese=(sol===(yan>0))?'a':'b';
  var kapiTip=document.getElementById('mTip').value;
  pushH();
  var yeni={
    id:uid(),tip_:_mT==='kapi'?'kapi':'pencere',
    segId:seg.id,t:t,en:en,yuk:yuk,
    ad:ad,kapiYon:kapiYon,penTip:penTip,
  };
  if(_mT==='kapi'){yeni.yan=yan;yeni.mentese=mentese;yeni.kapiTip=kapiTip;}
  G.elemanlar.push(yeni);
  elemanKonumla(yeni,seg,yeni.t*dLen,G.elStep); // adım + duvar dibi sınırı
  // Yeni elemanı seç → yön okları hemen görünür
  G.secili=yeni;G.seciliTip='eleman';G.selSegs=[];
  document.getElementById('mbg').classList.remove('open');updateSidebar();draw();
}

var _editRoom=null;
function openOdaModal(room){
  _editRoom=room;
  document.getElementById('odaAd').value=room.ozelAd||''; // özel ad varsa doldur, yoksa boş
  document.getElementById('odaAd').placeholder='ör. Misafir Odası';
  document.getElementById('odaTip').value=room.tip||'';
  document.getElementById('mbgOda').classList.add('open');
}
function odaKaydet(){
  if(_editRoom){
    var yeniAd=document.getElementById('odaAd').value.trim();
    pushH();
    _editRoom.ozelAd=yeniAd||null; // boşsa etikette tip adı görünür
    _editRoom.tip=document.getElementById('odaTip').value;
  }
  document.getElementById('mbgOda').classList.remove('open');
  detectRooms();draw();updateStats();updateSidebar();
}

// ═══ SIDEBAR ═════════════════════════════════════════════════════════════
function esc(s){return String(s||'').replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;');}
function updateSidebar(){
  var el=document.getElementById('sbSel'),ic=document.getElementById('sbSelIc');
  if(!G.secili){el.style.display='none';return;}
  el.style.display='block';
  var o=G.secili,t=G.seciliTip;
  if(t==='node'){
    ic.innerHTML='<div class="sr"><span class="sl">X (cm)</span><input class="si" type="number" value="'+Math.round(o.x)+'" onchange="upSelNode(\'x\',+this.value)"></div>'+
      '<div class="sr"><span class="sl">Y (cm)</span><input class="si" type="number" value="'+Math.round(o.y)+'" onchange="upSelNode(\'y\',+this.value)"></div>'+
      '<div style="font-size:10px;color:#3fb950;margin-top:3px">💡 Sürükle → taşı</div>'+
      '<button class="sib d" onclick="seciliSil()" style="margin-top:4px">🗑 Sil</button>'+(isPref()?'<button class="sib" style="margin-top:4px" onclick="pfKoseCevir()" title="L köşede hangi duvarın aksa kadar devam edeceği">⇄ Köşede devam eden duvarı değiştir'+(o.koseTers?' (dikey)':' (yatay)')+'</button>':'');
  } else if(t==='dim'){
    var dn1=getNode(o.n1),dn2=getNode(o.n2);
    ic.innerHTML=
      '<div class="sr"><span class="sl">Ölçü</span><span class="sv">'+(G.seciliDimRow==='zincir'?'Zincir (açıklıklar)':'Toplam boy')+'</span></div>'+
      '<div class="sr"><span class="sl">Duvar</span><span class="sv">'+Math.round(dist(dn1.x,dn1.y,dn2.x,dn2.y))+' cm</span></div>'+
      '<div style="font-size:10px;color:#3fb950;margin-top:3px">💡 Ölçüyü tut-çek → uzaklaştır/yaklaştır (duvarın öbür yanına da geçebilir) · Del → gizle</div>'+
      '<div style="display:flex;gap:4px;margin-top:4px">'+
        '<button class="sib" style="margin:0" onclick="dimTarafCevir()">⇅ Taraf</button>'+
        '<button class="sib" style="margin:0" onclick="dimSifirla()">↺ Konum</button></div>'+
      '<button class="sib d" onclick="dimSil()" style="margin-top:4px">🙈 Bu ölçüyü gizle</button>';
  } else if(t==='seg'&&selSegList().length>1){
    var ls=selSegList(),tot=ls.reduce(function(a,s){return a+_segLen(s);},0);
    var par=ls.every(function(s){return isParallel(s,o);});
    ic.innerHTML=
      '<div class="sr"><span class="sl">Seçili duvar</span><span class="sv">'+ls.length+' adet</span></div>'+
      '<div class="sr"><span class="sl">Toplam boy</span><span class="sv">'+(tot/100).toFixed(2)+' m</span></div>'+
      '<div class="sr"><span class="sl">Kalınlık (cm)</span><input class="si" type="number" value="'+o.k+'" onchange="upSelSegsK(+this.value)"></div>'+
      '<div style="font-size:10px;color:'+(par?'#3fb950':'#f0883e')+';margin-top:3px">'+
        (par?'💡 Herhangi birini tut-çek → hepsi birlikte paralel kayar':'⚠ Seçimde paralel olmayan duvar var — sadece tutulan duvara paralel olanlar kayar')+
        '<br>Shift/Ctrl+tık: ekle/çıkar</div>'+
      '<button class="sib" onclick="selectAligned()" style="margin-top:4px">↔ Aynı hizadakileri seç</button>'+
      '<div style="display:flex;gap:4px;margin-top:4px">'+
        '<button class="sib" style="margin:0" onclick="verandaYap(true)">┅ Veranda yap</button>'+
        '<button class="sib" style="margin:0" onclick="verandaYap(false)">▬ Duvar yap</button></div>'+
      '<button class="sib d" onclick="seciliSil()" style="margin-top:4px">🗑 Hepsini sil</button>';
  } else if(t==='seg'){
    var n1=getNode(o.n1),n2=getNode(o.n2);
    var len=n1&&n2?dist(n1.x,n1.y,n2.x,n2.y)/100:0;
    ic.innerHTML=
      '<div class="sr"><span class="sl">Uzunluk (cm)</span><input class="si" type="number" step="any" value="'+fmtCm(len*100)+'" onchange="resizeSeg(+this.value)"></div>'+
      (isPref()&&o.tip!=='veranda'?pfSegPanelHTML(o):'')+
      '<div class="sr"><span class="sl">Kalınlık (cm)</span><input class="si" type="number" value="'+o.k+'" onchange="upSelSeg(\'k\',+this.value)"></div>'+
      '<div style="font-size:10px;color:#3fb950;margin-top:3px">💡 Duvarı tut-çek → paralel kaydır | 🟢 Dik ok → uzat<br>Shift/Ctrl+tık: çoklu seç · Çift tık: aynı hizadakiler</div>'+
      '<label style="display:flex;align-items:center;gap:6px;font-size:11px;margin-top:6px;cursor:pointer">'+
        '<input type="checkbox" '+(o.tip==='veranda'?'checked':'')+' onchange="verandaYap(this.checked)"> ┅ Veranda sınırı (kesik çizgi)</label>'+
      '<button class="sib" onclick="selectAligned()" style="margin-top:4px">↔ Aynı hizadakileri seç</button>'+
      '<button class="sib d" onclick="seciliSil()" style="margin-top:4px">🗑 Sil</button>';
  } else if(t==='eleman'){
    ic.innerHTML='<div class="sr"><span class="sl">Ad</span></div>'+
      '<input class="si full" value="'+esc(o.ad)+'" onchange="upSelEl(\'ad\',this.value)">'+
      '<div class="sr" style="margin-top:4px"><span class="sl">Genişlik (cm)</span><input class="si" type="number" value="'+o.en+'" onchange="upSelEl(\'en\',+this.value)"></div>'+
      '<div class="sr"><span class="sl">Yükseklik (cm)</span><input class="si" type="number" value="'+o.yuk+'" onchange="upSelEl(\'yuk\',+this.value)"></div>'+
      (o.tip_==='kapi'?
        '<div class="sr"><span class="sl">Kapı tipi</span><select class="si" style="width:auto" onchange="upKapiTip(this.value)">'+
          [['ic','İç kapı'],['dis','Dış kapı'],['surme','Sürgülü'],['cift','Çift kanatlı']].map(function(x){
            return '<option value="'+x[0]+'"'+((o.kapiTip||'ic')===x[0]?' selected':'')+'>'+x[1]+'</option>';}).join('')+
        '</select></div>'+
        '<div class="sr"><span class="sl">Açılma</span><span class="sv">'+(kapiYonHesapla(o)==='dis'?'Dışa':'İçe')+'</span></div>'+
        '<div style="display:flex;gap:4px;margin-top:4px">'+
          '<button class="sib" style="margin:0" onclick="kapiCevir(\'yan\')" title="İçe / dışa çevir">⇅ Yön</button>'+
          (kapiMenVar(o)?'<button class="sib" style="margin:0" onclick="kapiCevir(\'men\')" title="Menteşe tarafını çevir">⇄ Menteşe</button>':'')+
        '</div>':'')+
      '<div style="font-size:10px;color:#3fb950;margin-top:3px">💡 '+(isPref()?'Sürükle → panel yuvasına ortalanır (Alt: serbest) · Ok tuşları: bir panel':'Sürükle → '+G.elStep+' cm adımla (Alt: serbest) · Ok tuşları: '+G.elStep+' cm, Shift+ok: '+(G.elStep*10)+' cm')+(o.tip_==='kapi'?' · ⇅ ⇄ ile aynala':'')+'</div>'+
      '<button class="sib d" onclick="seciliSil()" style="margin-top:4px">🗑 Sil</button>';
  } else if(t==='room'){
    var tipAdSb=ODA_TIPLER[o.tip]||'— seçilmedi —';
    ic.innerHTML=
      '<div class="sr"><span class="sl">Ad</span><span class="sv">'+esc(roomLabel(o))+'</span></div>'+
      '<div class="sr"><span class="sl">Tip</span><span class="sv">'+esc(tipAdSb)+'</span></div>'+
      '<div class="sr"><span class="sl">Aks alanı</span><span class="sv">'+o.area.toFixed(2)+' m²</span></div>'+
      '<div style="font-size:10px;color:#3fb950;margin-top:3px">💡 Etiketi tut-çek → yerini değiştir · Çift tık → düzenle</div>'+
      '<button class="sib p" onclick="openOdaModal(G.secili)" style="margin-top:4px">✏️ Ad & Tip Düzenle</button>'+
      ((o.lblDx||o.lblDy)?'<button class="sib" onclick="etiketOrtala()" style="margin-top:4px">↺ Etiketi ortala</button>':'')+
      (isPref()&&o.tip!=='veranda'?
        (G.opt.alciDuvar==='secili'?'<label style="display:flex;gap:6px;align-items:center;font-size:11px;margin-top:6px;cursor:pointer"><input type="checkbox" '+(o.duvarAlci?'checked':'')+' onchange="odaDuvarAlciCevir()"> Duvarlara alçıpan ('+(ALCI.ISLAK[o.tip]?'yeşil':'beyaz')+')</label>':
         '<div style="font-size:10px;color:#8b949e;margin-top:4px">Duvar alçıpanı: '+(G.opt.alciDuvar==='hepsi'?'var (tüm odalar)':'yok — Opsiyonlar\'dan açılır')+'</div>'):'');
  }
}
function etiketOrtala(){var r=G.secili;if(!r||G.seciliTip!=='room')return;pushH();r.lblDx=0;r.lblDy=0;draw();updateSidebar();}
function upSelNode(k,v){if(G.secili&&G.seciliTip==='node'){G.secili[k]=v;detectRooms();draw();}}
function verandaYap(on){
  var ls=selSegList();if(!ls.length)return;
  pushH();
  ls.forEach(function(s){if(on)s.tip='veranda';else delete s.tip;});
  // Veranda sınırıyla kapanan odaların tipini güncelle (yalnız varsayılan tipte olanlar)
  var ids={};ls.forEach(function(s){ids[s.n1]=1;ids[s.n2]=1;});
  G.rooms.forEach(function(r){
    var touch=r.nodeIds.some(function(n){return ids[n];});
    if(!touch)return;
    var hasVer=r.nodeIds.some(function(nid,i){
      var nb=r.nodeIds[(i+1)%r.nodeIds.length];
      return G.segs.some(function(s){return s.tip==='veranda'&&((s.n1===nid&&s.n2===nb)||(s.n1===nb&&s.n2===nid));});
    });
    if(on&&hasVer&&(!r.tip||r.tip==='salon'))r.tip='veranda';
    if(!on&&!hasVer&&r.tip==='veranda')r.tip='';
  });
  detectRooms();draw();updateSidebar();
}
function upSelSegsK(v){selSegList().forEach(function(s){s.k=v;if(isPref())s.kSabit=true;});draw();}
function upSelSeg(k,v){if(G.secili&&G.seciliTip==='seg'){G.secili[k]=v;if(k==='k'&&isPref())G.secili.kSabit=true;draw();}}
function kOtomatik(){var sg=G.secili;if(!sg||G.seciliTip!=='seg')return;pushH();delete sg.kSabit;detectRooms();draw();updateSidebar();}
function resizeSeg(newLenCm){
  // Segmenti yeni uzunluğa göre yeniden boyutlandır — n2'yi taşı
  if(!G.secili||G.seciliTip!=='seg')return;
  var seg=G.secili;
  var n1=getNode(seg.n1),n2=getNode(seg.n2);if(!n1||!n2)return;
  var dx=n2.x-n1.x,dy=n2.y-n1.y,len=Math.hypot(dx,dy);
  if(len<1)return;
  pushH();
  n2.x=n1.x+(dx/len)*newLenCm;
  n2.y=n1.y+(dy/len)*newLenCm;
  detectRooms();draw();updateSidebar();
}
function upKapiTip(v){var e=G.secili;if(!e||e.tip_!=='kapi')return;pushH();e.kapiTip=v;if(v==='cift'&&e.en<120)e.en=140;draw();updateSidebar();}
function upSelEl(k,v){if(G.secili&&G.seciliTip==='eleman'){G.secili[k]=v;draw();}}

// ═══ İSTATİSTİK ══════════════════════════════════════════════════════════
function _setTxt(id,v){var el=document.getElementById(id);v=String(v);if(el&&el.textContent!==v)el.textContent=v;}
function updatePanelBox(){
  var el=document.getElementById('panelMet');if(!el||!isPref())return;
  var M=panelMetraj(),B=M.bag;
  function r(ad,v){return v?'<div class="sr"><span class="sl">'+ad+'</span><span class="sv">'+v+'</span></div>':'';}
  function sat(ad,d){
    var tot=d.tam+d.yarim+d.ozel+d.kapi+d.pencere;
    return '<div style="margin:4px 0 2px;color:#8b949e;font-weight:600">'+ad+'</div>'+
      r('Tam panel (125,5)',d.tam)+r('Yarım panel (62,75)',d.yarim)+r('Özel panel',d.ozel)+
      r('Kapılı panel',d.kapi)+r('Pencereli panel',d.pencere)+
      '<div class="sr"><span class="sl">Toplam</span><span class="sv">'+tot+' adet</span></div>';
  }
  var html=sat('Dış duvar · '+PF.DIS+' cm · '+fmtCm(M.disM/100)+' m',M.dis)+sat('İç duvar · '+PF.IC+' cm · '+fmtCm(M.icM/100)+' m',M.ic)+
    '<div style="margin:6px 0 2px;color:#8b949e;font-weight:600">Bağlantılar</div>'+
    (function(){
      var ad=null;
      var sira=['H','H3','X','U','kose','ozelB','uc'],grp={};
      Object.keys(M.bagDetay).forEach(function(k){var p=k.split('|');var g=p[0]+'|'+p[1];grp[g]=(grp[g]||0)+M.bagDetay[k];});
      return Object.keys(grp).sort(function(a,b){var x=a.split('|'),y=b.split('|');return (sira.indexOf(x[0])-sira.indexOf(y[0]))||(parseFloat(y[1])-parseFloat(x[1]));})
        .map(function(g){var p=g.split('|');return r(bagAd(p[0],p[1]),grp[g]);}).join('');
    })()+
    (M.xUyari?'<div style="color:#f85149;margin-top:3px">⚠ '+M.xUyari+' çapraz birleşim panel ekine denk gelmiyor</div>':'')+
    (function(){var o=pfYakinUOnerileri();if(!o.length)return '';
      return '<div style="color:#d29922;margin-top:5px">⚠ '+o.length+' bölme duvarı H\'a çok yakın ('+o.map(function(x){return fmtCm(Math.abs(x.d));}).join(', ')+' cm) — çektirme U sayılıyor</div>'+
        '<button class="sib" style="margin-top:3px;border-color:#d29922;color:#d29922" onclick="pfUHaOturt()">↦ H\'a oturt (3\'lü H yap)</button>';})()+
    (function(){if(!G.rooms.length)return '';var AL=alcipanHesap();
      var b=levhaAdet(AL.beyazDuvar)+levhaAdet(AL.beyazTavan),y=levhaAdet(AL.yesilDuvar)+levhaAdet(AL.yesilTavan)+levhaAdet(AL.verTavan);
      return '<div style="margin:6px 0 2px;color:#8b949e;font-weight:600">Alçıpan (120×250, fire %'+ALCI.FIRE+')</div>'+
        r('Beyaz — duvar / tavan',levhaAdet(AL.beyazDuvar)+' / '+levhaAdet(AL.beyazTavan))+
        r('Yeşil — duvar / tavan',levhaAdet(AL.yesilDuvar)+' / '+levhaAdet(AL.yesilTavan))+
        r('Yeşil — veranda tavanı',levhaAdet(AL.verTavan))+
        r('Kapı / pencere boşluğu',(Math.round(AL.kapiM2*100)/100)+' / '+(Math.round(AL.pencereM2*100)/100)+' m²')+
        (function(){if(G.opt.cephe==='yok')return '';var C=cepheHesap();if(!C)return '';
          return '<div style="margin:6px 0 2px;color:#8b949e;font-weight:600">Dış cephe — '+(G.opt.cephe==='tasonit'?'Taşonit':'Yalıpan')+'</div>'+
            r('Net yüzey',(Math.round(C.net*100)/100)+' m²')+r('Plaka ('+G.opt.plaka+')',C.adet?C.adet+' adet':'—');})();})()+
    (function(){var MK=makasAnaliz();if(!MK)return '';
      var CT=catiHesap();
      return '<div style="margin:6px 0 2px;color:#8b949e;font-weight:600">Çatı ('+(MK.yatay?'makas yönü →':'makas yönü ↓')+')</div>'+
        r('Çatı makası',MK.makaslar.length)+
        (CT?r(CT.sekil==='bolum'?'Çatı bölüm modeli':(G.opt.kaplama==='sandvic'?'Sandviç':'Trapez')+' ('+CT.W+' cm)',CT.adet+' adet · '+(Math.round(CT.alan*10)/10)+' m²')+CT.gruplar.map(function(g2){return r('↳ '+g2.rol+' çatı',g2.levhalar.map(function(l){return fmtCm(Math.round(l.boy*10)/10)+' cm × '+l.adet;}).join(', '));}).join(''):'')+(MK.kalan?'<div style="font-size:10px;color:#8b949e">Son aralık '+fmtCm(MK.kalan)+' cm'+(Math.abs(MK.kalan-PF.YARIM)<0.6?' (yarım modül)':'')+'</div>':'');})()+
    (M.ozelList.length?'<div style="color:#d29922;margin-top:5px">Özel paneller: '+M.ozelList.map(function(o){return fmtCm(o.w);}).join(', ')+' cm</div>':'')+
    (M.cfgHata?'<div style="color:#f85149;margin-top:3px">⚠ '+M.cfgHata+' hatta elle dizilim duvara sığmadı</div>':'');
  if(el._html!==html){el._html=html;el.innerHTML=html;}
}
function updateStats(){
  updatePanelBox();
  var summary=PlanProject.architecturalSummary(G.rooms);
  _setTxt('stOda',summary.type?(summary.type+(summary.unknown?' · tanımlı':'')):'—');
  _setTxt('stAlan',summary.closedArea.toLocaleString('tr-TR',{maximumFractionDigits:1})+' m²');
  _setTxt('stVerandaAlan',summary.verandaArea.toLocaleString('tr-TR',{maximumFractionDigits:1})+' m²');
  document.getElementById('verandaAreaRow').hidden=!summary.items.some(function(i){return i.key==='veranda';});
  var program=document.getElementById('roomProgram');
  var programHTML=summary.items.map(function(i){return '<div class="sr"'+(i.key==='yatak'?' title="Çocuk ve ebeveyn odaları yatak odasına dahildir."':i.key==='banyo'?' title="Ebeveyn banyoları dahildir; WC ayrı sayılır."':'')+'><span class="sl">'+esc(i.label)+'</span><span class="sv">'+i.count+'</span></div>';}).join('');
  if(program.innerHTML!==programHTML)program.innerHTML=programHTML;
  _setTxt('roomProgramNote',summary.unknown?summary.unknown+' mekânın türü seçilmedi. Konut tipi tanımlı yatak odası ve salonlara göredir.':!G.rooms.length?'Kapalı mekânlar çizilip türleri seçildikçe özet oluşur.':'');
  var ol=document.getElementById('odaListe'),html;
  if(!G.rooms.length)html='<span style="font-size:11px;color:#484f58">Kapalı alan çizince oda oluşur</span>';
  else{
    // Odalar önce, verandalar sonra
    var sirali=G.rooms.slice().sort(function(a,b){return (a.tip==='veranda')-(b.tip==='veranda');});
    html=sirali.map(function(r){
      var ad=roomLabel(r);
      return '<div class="oi" onclick="selRoom(\''+r.id+'\')" title="'+esc(ad)+'">'+(r.tip==='veranda'?'┅ ':'')+esc(ad)+' <span>'+r.area.toFixed(1)+'m²</span></div>';
    }).join('');
  }
  if(ol._html!==html){ol._html=html;ol.innerHTML=html;} // sadece değişince DOM'a yaz
}
function selRoom(id){
  G.secili=G.rooms.find(function(r){return r.id===id;})||null;
  G.seciliTip=G.secili?'room':null;updateSidebar();draw();
}

// ═══ TARİHÇE ═════════════════════════════════════════════════════════════
function pushH(){
  G.hist.push(JSON.stringify({n:G.nodes,s:G.segs,e:G.elemanlar,r:G.rooms,c:G.catiYon}));
  if(G.hist.length>40)G.hist.shift();
}
function geriAl(){
  if(!G.hist.length)return;
  var p=JSON.parse(G.hist.pop());
  G.nodes=p.n;G.segs=p.s;G.elemanlar=p.e;G.rooms=p.r;
  if(p.c){G.catiYon=p.c;catiBtnGuncelle();}
  G.secili=null;G.seciliTip=null;detectRooms();updateSidebar();updateDimRestore();draw();
}
function seciliSil(){
  if(!G.secili)return;
  if(G.seciliTip==='dim'){dimSil();return;}
  pushH();
  if(G.seciliTip==='node')removeNode(G.secili.id);
  else if(G.seciliTip==='seg'){selSegList().forEach(function(s){removeSeg(s.id);});G.selSegs=[];}
  else if(G.seciliTip==='eleman')G.elemanlar=G.elemanlar.filter(function(e){return e.id!==G.secili.id;});
  G.secili=null;G.seciliTip=null;updateSidebar();detectRooms();draw();
}

// ═══ STATUS ══════════════════════════════════════════════════════════════
// Toplu kalınlık
function topluKalinlik(){document.getElementById('mbgK').classList.add('open');}
function topluKalinlikUygula(){
  var v=+document.getElementById('topluK').value;
  var h=document.getElementById('topluH').value;
  pushH();
  if(h==='hepsi'||h==='seg')G.segs.forEach(function(s){s.k=v;if(isPref())s.kSabit=true;});
  if(h==='hepsi'||h==='sec'&&G.secili)G.secili.k=v;
  document.getElementById('mbgK').classList.remove('open');
  draw();
}
function updateStatus(){
  var m={
    sec:'↖ Seçim | Tıkla: seç | Sürükle: node taşı | Çift tıkla oda: isim ver | Esc: bırak',
    duvar:'▬ Duvar | Tıkla: başlat · devam | Çizerken sayı + Enter: '+(isPref()?'panel adedi (9 · 8.5) | Duvar üstünde sayı + Enter: H\'tan cm | Alt: serbest':'cm')+' | Sağ tık/Esc: bitir',
    veranda:'┅ Veranda | Duvar gibi çiz — kesik çizgili sınır, metrajda duvar sayılmaz | Sağ tık/Esc: bitir',
    kapi:'🚪 Kapı | Duvara tıkla → ekle → sürükle',
    pencere:'🪟 Pencere | Duvara tıkla → ekle → sürükle'
  };
  document.getElementById('stbar').innerHTML='<b>'+(m[G.tool]||'')+'</b>';
}

// ═══ RESIZE ══════════════════════════════════════════════════════════════
if(document.fonts&&document.fonts.ready)document.fonts.ready.then(function(){try{draw();}catch(_){}});
function resize(){cv.width=cwrap.clientWidth;cv.height=cwrap.clientHeight;draw();}
window.addEventListener('resize',resize);resize();

// ═══ KAYDET/YÜKLE ════════════════════════════════════════════════════════
function planKaydet(){
  var d={v:'5',sistem:G.sistem,catiYon:G.catiYon,opt:G.opt,n:G.nodes,s:G.segs,e:G.elemanlar,r:G.rooms,ky:document.getElementById('katYuk').value,dy:document.getElementById('disYuk').value};
  var b=new Blob([JSON.stringify(d,null,2)],{type:'application/json'});
  var a=document.createElement('a');a.href=URL.createObjectURL(b);
  a.download='plan_'+(new Date().toLocaleDateString('tr-TR').replace(/\./g,'-'))+'.json';a.click();URL.revokeObjectURL(a.href);
}
function dosyaYukle(ev){
  var f=ev.target.files[0];if(!f)return;
  var r2=new FileReader();
  r2.onload=function(e){
    try{
      var d=JSON.parse(e.target.result);
      if(d.v==='5'){
        G.nodes=d.n||[];G.segs=d.s||[];G.elemanlar=d.e||[];G.rooms=d.r||[];
        G.catiYon=d.catiYon||'yatay';if(d.opt){G.opt=Object.assign({h:280,ic:6,alciDuvar:'yok',cephe:'yok',plaka:'40x250',bindirme:3,cepheFire:5,cati:'besik',egim:33,sacak:30,trapezEn:100,kaplama:'trapez',osb:false,catiFire:5,suRulo:75,suBindirme:10,parcaBoy:200,parcaBind:10,vidaM2:5,inisAralik:10,aksAcik:false},d.opt);PF.IC=+G.opt.ic||6;}setSistem(d.sistem||'celik',true);
        // Yeni id'ler yüklenen id'lerle çakışmasın
        var mx=0;[G.nodes,G.segs,G.elemanlar,G.rooms].forEach(function(arr){arr.forEach(function(o){var m=/^e([0-9]+)$/.exec(o.id||'');if(m)mx=Math.max(mx,+m[1]);});});
        ID=Math.max(ID,mx+1);
      } else {
        // Eski format dönüşümü
        alert('Eski format algılandı. Lütfen v5 formatında kaydedin.');
      }
      if(d.ky)document.getElementById('katYuk').value=d.ky;
      if(d.dy)document.getElementById('disYuk').value=d.dy;
      G.secili=null;G.seciliTip=null;normalizeGraph();detectRooms();updateSidebar();draw();
    }catch(err){alert('Hata: '+err.message);}
  };r2.readAsText(f);ev.target.value='';
}
// ═══ PNG ÇIKTISI ══════════════════════════════════════════════════════════
// Ekran görüntüsü değil: planı ayrı bir tuvale açık "kağıt" temasıyla yeniden çizer.
// Grid, düğüm noktaları, seçim/tutamaçlar yok; plan sığdırılır, 2x çözünürlük, alt bilgi bandı.
function pngIndir(){
  if(!G.nodes.length||!G.segs.length){alert('Önce plan çizin.');return;}
  var minX=Infinity,minY=Infinity,maxX=-Infinity,maxY=-Infinity;
  G.nodes.forEach(function(n){minX=Math.min(minX,n.x);minY=Math.min(minY,n.y);maxX=Math.max(maxX,n.x);maxY=Math.max(maxY,n.y);});
  var wCm=Math.max(1,maxX-minX),hCm=Math.max(1,maxY-minY);
  var M=110,FOOT=86,TARGET=1600,R=2;
  var s=Math.min((TARGET-2*M)/wCm,(TARGET-2*M)/hCm,2.2);
  var W=Math.ceil(wCm*s+2*M),H=Math.ceil(hCm*s+2*M+FOOT);
  var save={zoom:G.zoom,pan:{x:G.pan.x,y:G.pan.y},ctx:ctx,sec:G.secili,st:G.seciliTip,ss:G.selSegs,wd:G.wallDrag,
    th:TH,dim:DIM,drawing:G.drawing,snapPt:G.snapPt};
  var out=document.createElement('canvas');out.width=W*R;out.height=H*R;
  var oc=out.getContext('2d');
  try{
    G.zoom=s/G.scale;G.pan={x:M-minX*s,y:M-minY*s};
    G.secili=null;G.seciliTip=null;G.selSegs=[];G.wallDrag=null;G.drawing=false;G.snapPt=null;
    TH=TH_PAPER;DIM=DIM_PAPER;ctx=oc;
    oc.setTransform(R,0,0,R,0,0);
    oc.fillStyle='#fbfaf7';oc.fillRect(0,0,W,H);
    drawRooms();drawMakas();drawSegs();drawPanels();drawAlciGorsel();drawElemanlar();drawDims();
    _pngAltBilgi(oc,W,H,FOOT,s);
  } finally {
    G.zoom=save.zoom;G.pan=save.pan;ctx=save.ctx;G.secili=save.sec;G.seciliTip=save.st;G.selSegs=save.ss;
    G.wallDrag=save.wd;TH=save.th;DIM=save.dim;G.drawing=save.drawing;G.snapPt=save.snapPt;
    draw();
  }
  var a=document.createElement('a');
  a.href=out.toDataURL('image/png');
  a.download='plan_'+new Date().toLocaleDateString('tr-TR').replace(/\./g,'-')+'.png';
  a.click();
}
function _pngAltBilgi(c,W,H,FOOT,s){
  var y0=H-FOOT+18,pad=40;
  c.save();
  c.strokeStyle='#e3e0d8';c.lineWidth=1;
  c.beginPath();c.moveTo(pad,y0);c.lineTo(W-pad,y0);c.stroke();
  c.textBaseline='alphabetic';c.textAlign='left';
  c.fillStyle='#2b3544';c.font='700 13px '+FF;
  c.fillText('PREFABRİKTEN YAPI A.Ş.',pad,y0+28);
  c.fillStyle='#8a94a3';c.font='500 11px '+FF;
  var net=G.rooms.reduce(function(a,r){return a+(r.tip==='veranda'?0:r.area);},0);
  var ver=G.rooms.reduce(function(a,r){return a+(r.tip==='veranda'?r.area:0);},0);
  var nOda=G.rooms.filter(function(r){return r.tip!=='veranda';}).length;
  var sis='';
  if(isPref()){var PM=panelMetraj();var tp=function(d){return d.tam+d.yarim+d.ozel+d.kapi+d.pencere;};
    sis='  ·  Prefabrik panel (125,5 / 62,75)  ·  Dış '+tp(PM.dis)+' / İç '+tp(PM.ic)+' panel';}
  c.fillText('Kat Planı  ·  '+nOda+' oda  ·  Aks alanı '+net.toFixed(1)+' m²'+(ver>0?'  ·  Veranda '+ver.toFixed(1)+' m²':'')+sis+'  ·  Ölçüler cm',pad,y0+48);
  // Sağ: tarih + ölçek çubuğu (1 m)
  c.textAlign='right';c.fillStyle='#8a94a3';c.font='500 11px '+FF;
  c.fillText(new Date().toLocaleDateString('tr-TR'),W-pad,y0+28);
  var bar=100*s,bx=W-pad-bar,by=y0+44;
  c.fillStyle='#5d6675';c.fillRect(bx,by,bar/2,4);
  c.fillStyle='#c5cbd3';c.fillRect(bx+bar/2,by,bar/2,4);
  c.strokeStyle='#5d6675';c.lineWidth=0.8;c.strokeRect(bx,by,bar,4);
  c.fillStyle='#5f6b7a';c.font='500 10px '+FF;c.textAlign='left';
  c.fillText('0',bx-2,by+16);c.textAlign='right';c.fillText('1 m',bx+bar+4,by+16);
  c.restore();
}
function hafifCeligeAktar(){
  if(!G.segs.length){alert('Önce plan çizin.');return;}
  var katYuk=+document.getElementById('katYuk').value||280;
  var disYuk=+document.getElementById('disYuk').value||320;
  // Odaları rooms'tan al
  var rooms=G.rooms.map(function(room,i){
    // Segment elemanlarını bu odaya bağla (odanın içinde olan elemanlar)
    var roomPts=room.nodeIds.map(function(id){var n=getNode(id);return n;}).filter(Boolean);
    var pens=[],kaps=[];
    G.elemanlar.forEach(function(e){
      var seg=getSeg(e.segId);if(!seg)return;
      var n1=getNode(seg.n1),n2=getNode(seg.n2);if(!n1||!n2)return;
      var dx=n2.x-n1.x,dy=n2.y-n1.y,dLen=Math.hypot(dx,dy);
      var ux=dx/dLen,uy=dy/dLen;
      var ex=n1.x+ux*e.t*dLen+uy*5,ey=n1.y+uy*e.t*dLen-ux*5;
      // Bu oda segmentleri arasında mı?
      var onRoomSeg=room.nodeIds.some(function(nid,idx){
        var nextNid=room.nodeIds[(idx+1)%room.nodeIds.length];
        return (seg.n1===nid&&seg.n2===nextNid)||(seg.n1===nextNid&&seg.n2===nid);
      });
      if(!onRoomSeg)return;
      if(e.tip_==='pencere')pens.push({id:pens.length+1,ad:e.ad,en:Math.round(e.en)/100,yuk:Math.round(e.yuk)/100,adet:1,cepheId:null});
      else kaps.push({id:kaps.length+1,ad:e.ad,en:Math.round(e.en)/100,yuk:Math.round(e.yuk)/100,adet:1});
    });
    // Dış duvar: odanın çevresinden SADECE dış cepheye bakan kenarlar
    // (paylaşımlı iç duvarlar iki odaya birden dış duvar diye yazılmasın)
    var perim=0;
    for(var j=0;j<room.nodeIds.length;j++){
      var ida=room.nodeIds[j],idb=room.nodeIds[(j+1)%room.nodeIds.length];
      var na=getNode(ida),nb=getNode(idb);
      var rs=G.segs.find(function(s){return (s.n1===ida&&s.n2===idb)||(s.n1===idb&&s.n2===ida);});
      if(na&&nb&&rs&&rs.dis&&rs.tip!=='veranda')perim+=dist(na.x,na.y,nb.x,nb.y);
    }
    var malzemeler=ODA_MALZEME[room.tip]||[];
    return{id:i+1,name:roomLabel(room),tip:room.tip||'salon',otoMalzeme:malzemeler,
      en:Math.round(Math.sqrt(room.area*10000)*100)/100,
      boy:Math.round(Math.sqrt(room.area*10000)*100)/100,
      disM:Math.round(perim/100*100)/100,not:'Plan çiziminden — en/boy eski hesap formatı için alan eşdeğeridir; gerçek şekil geometry alanındadır.',
      olcuYontemi:'alan-esdegeri',geometry:{unit:'cm',axisAreaM2:room.area,axisPolygon:roomPts.map(function(p){return{x:p.x,y:p.y};}),innerFaceAreaM2:(odaIcGeometri(room)||{}).alan},
      parcalar:[],pencereler:pens,kapilar:kaps};
  }).filter(Boolean);
  // Dış duvar segmentleri → cepheler
  var duvarSegs=G.segs.filter(function(s){return s.tip!=='veranda';});
  var disSegs=duvarSegs.filter(function(s){return s.dis;});
  if(!disSegs.length)disSegs=duvarSegs;
  var cepheler=disSegs.map(function(s,i){
    var n1=getNode(s.n1),n2=getNode(s.n2);
    var len=n1&&n2?dist(n1.x,n1.y,n2.x,n2.y)/100:0;
    return{id:i+1,ad:'Cephe '+(i+1),uzunluk:Math.round(len*100)/100,kaplamalar:['nem','boardex','mineral']};
  });
  var netAlan=G.rooms.reduce(function(s,r){return s+(r.tip==='veranda'?0:r.area);},0); // iç alan: veranda hariç
  var topAlan=G.rooms.reduce(function(s,r){return s+r.area;},0);
  var data={v:'6.0',prjAd:document.getElementById('projectName')?document.getElementById('projectName').value:'Plan Çiziminden',pIch:katYuk,pDish:disYuk,
    sourceSystem:G.sistem,areaMethod:'wall-axis',roofAreaMethod:'axis-area-times-1.05-legacy-estimate',
    pIcAln:Math.round(netAlan*10)/10,pCatiAln:Math.round(topAlan*1.05*10)/10,
    pDisProfil:'140',pIcProfil:'80',pAlcKap:'cift',pKat:'tek',
    fAlc:'10',fDis:'8',fCat:'8',fZem:'10',
    rooms:rooms,cepheler:cepheler,paraperler:[],sabitFiyatlar:{},ekKalemler:[],
    nR:rooms.length+1,nC:cepheler.length+1,nP:1,nRP:{},nRK:{}};
  if(window.RoofStudio&&G.roofs&&G.roofs.length){
    var roofModel=RoofStudio.model();
    data.roofAreaMethod='roof-plane-union-by-group';data.pCatiAln=Math.round(roofModel.area*100)/100;
    data.roofGeometry={unit:'cm',areaUnit:'m2',lengthUnit:'m',zones:G.roofs,customMaterials:G.roofMaterials,faces:roofModel.faces,edges:roofModel.edges,coveringTotals:roofModel.totals,underlayTotals:roofModel.layerTotals,underlayCuts:roofModel.layerCuts,cutDraft:roofModel.cutList,productionFrames:window.RoofWorkflow?G.roofs.flatMap(RoofWorkflow.trusses):[],structuralDesign:false};
  }
  var b=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});
  var a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='hafif_celik_plan.json';a.click();URL.revokeObjectURL(a.href);
  alert('JSON indirildi.\n'+rooms.length+' oda · Aks alanı: '+netAlan.toFixed(1)+' m²\nEski formatın en/boy alanları alan eşdeğeridir. Gerçek oda geometrisi de dosyaya eklendi.');
}
function yeniPlan(){
  if((G.nodes.length||G.segs.length)&&!confirm('Mevcut plan silinecek?'))return;
  G.nodes=[];G.segs=[];G.elemanlar=[];G.rooms=[];G.hist=[];
  G.secili=null;G.seciliTip=null;G.drawing=false;G.drawStart=null;
  updateSidebar();draw();
  if(isPref())catiSor();
}
updateStatus();
