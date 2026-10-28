/* Shared plan surface rendering; model geometry and materials stay unchanged. */
window.PlanPresentation={
 palettes:{architectural:{wall:'#72736b',room:'#e9e5da',wetRoom:'#d9dedb',verandaRoom:'#e3dfd2',counter:'#c8ad89',fixture:'#faf9f5',wood:'#bd9872',fabric:'#eee9df',ink:'#454a48'},graywood:{wall:'#454746',room:'#d2d3d0',wetRoom:'#c3cccd',verandaRoom:'#dcded8',counter:'#ba9272',fixture:'#fafbf8',wood:'#b68764',fabric:'#efede7',ink:'#272e30'},monochrome:{wall:'#505456',room:'#f2f2ef',wetRoom:'#e5e8e8',verandaRoom:'#ededeb',counter:'#c5c9c9',fixture:'#ffffff',wood:'#c9cdcd',fabric:'#e5e7e5',ink:'#20292d'}},
 surface(){return TH.presentation||(TH.export?{fixture:'#ffffff',wood:'#ece9e2',fabric:'#f4f3ef',counter:'#e5e3dd',ink:'#454a48'}:{fixture:'#283541',wood:'#354049',fabric:'#303b46',counter:'#293641',ink:'#b8cfe0'});},
 wallLayer(target,fn){
  if(!target.canvas){fn();return;}
  this.wallBuffers=this.wallBuffers||new WeakMap();let layer=this.wallBuffers.get(target.canvas);
  if(!layer){layer=document.createElement('canvas');this.wallBuffers.set(target.canvas,layer);}
  if(layer.width!==target.canvas.width)layer.width=target.canvas.width;if(layer.height!==target.canvas.height)layer.height=target.canvas.height;
  const c=layer.getContext('2d'),matrix=target.getTransform(),previous=ctx;
  c.resetTransform();c.clearRect(0,0,layer.width,layer.height);c.setTransform(matrix);
  try{ctx=c;fn();}finally{ctx=previous;}
  const scale=Math.hypot(matrix.a,matrix.b)||1;
  target.save();target.resetTransform();target.shadowColor=TH.export?'#292d2930':'#00000038';target.shadowBlur=5*scale;target.shadowOffsetX=1.5*scale;target.shadowOffsetY=2*scale;target.drawImage(layer,0,0);target.restore();
 },
 active(){return !!this.palettes[document.getElementById('exportPlanStyle')?.value]&&document.getElementById('planExportDialog')?.dataset.format!=='dxf';},
 theme(base){const p=this.active()?this.palettes[document.getElementById('exportPlanStyle').value]:null;return p?{...base,...p,presentation:p}:base;},
 fixture(c,f,p){if(TH.presentation)c.strokeStyle=p.ink;c.fillStyle=['wardrobe','coatCabinet','tvUnit','nightstand','coffeeTable','vanity'].includes(f.kind)?p.wood:/^(bed|sofa|armchair)/.test(f.kind)?p.fabric:p.fixture;
 if(['wc','wallwc','basin'].includes(f.kind))return;
 const base=c.fillStyle,light=c.createLinearGradient(0,0,f.w,f.d);light.addColorStop(0,base);light.addColorStop(1,base);c.fillStyle=light;c.beginPath();c.roundRect(0,0,f.w,f.d,/^(bed|sofa|armchair)/.test(f.kind)?3:0);c.fill();c.save();const lightWash=c.createLinearGradient(0,0,f.w,f.d);lightWash.addColorStop(0,'#ffffff12');lightWash.addColorStop(1,'#00000008');c.fillStyle=lightWash;c.fill();c.restore();},
 counter(c,points,p){c.save();c.fillStyle=p.counter;c.beginPath();points.forEach((v,i)=>{const q=toCv(v.x,v.y);i?c.lineTo(q.x,q.y):c.moveTo(q.x,q.y);});c.closePath();c.fill();c.restore();},
 setup(change){const host=document.getElementById('exportPdfOptions');host.insertAdjacentHTML('beforeend','<label>Sunum biçimi<select id="exportPlanStyle"><option value="technical">Teknik plan</option><option value="architectural">Mimari sunum · sıcak tonlar</option><option value="graywood">Gri ve ahşap · kontrastlı</option><option value="monochrome">Siyah beyaz · sade</option></select></label>');const el=document.getElementById('exportPlanStyle');el.onchange=change;const read=SheetOutput.read,restore=SheetOutput.restore;SheetOutput.read=()=>{const value=read();if(this.palettes[el.value])value.presentation=el.value;return value;};SheetOutput.restore=value=>{restore(value);el.value=this.palettes[value?.presentation]?value.presentation:'technical';};}
};
