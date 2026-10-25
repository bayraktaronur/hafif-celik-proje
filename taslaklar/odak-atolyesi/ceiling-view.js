/* Close inspection of the standard ceiling, without hiding/changing project floors. */
let ceilingReturn=null;
function openCeilingView(){
 ceilingReturn={camera:{...Camera3D.state},zoom};assemblyMode='ceiling';setView('3d');Camera3D.state.pitch=-55;Camera3D.state.yaw=25;render();
}
function closeCeilingView(){assemblyMode='layers';selected=null;if(ceilingReturn){Object.assign(Camera3D.state,ceilingReturn.camera);zoom=ceilingReturn.zoom}else{Camera3D.state.pitch=35;zoom=1}render();}
function ceilingScene(){const base=project.height,elevations=DraftFloorLayers.elevations(base,0),e=elevations.ceiling;
 const ceiling=DraftCeiling.mesh(project.floors[0].data,project.frameDirection,e.bottom+DraftCeiling.profile.skin,e.top-DraftCeiling.profile.skin,selected?.type==='ceilingBoard'?selected.id:null);
 return {surfaces:ceiling.surfaces,frames:frameList(),base,top:base+20,elevations,ceiling};
}
function renderCeilingInspector(){
 const data=DraftCeiling.layout(project.floors[0].data,project.frameDirection),b=data.boards.find(b=>b.id===selected?.id),full=data.boards.filter(b=>b.full).length;
 $('#scope').textContent='Standart';$('#inspectorHeading').textContent='60 × 120 / MİNİ H';
 $('#inspectorBody').innerHTML=section('<span class="eyebrow">STANDART TAVAN / GEÇME SİSTEM</span><h2>Alçıpan + mini H</h2><p>60 × 120 cm levha düzeni.<br>Levhalar mini H birleşimlerine geçer.</p><button class="secondary" id="ceilingBack">← Katmanlara dön</button>')
 +section(`<h3>Tavanı incele</h3><div class="segmented"><button id="ceilingUnder" class="${Camera3D.state.pitch<0?'active':''}">Alttan bak</button><button id="ceilingOver" class="${Camera3D.state.pitch>=0?'active':''}">Üstten bak</button></div><p class="tip">Levhaları tıklayarak tam levha ve kenar parçalarını inceleyin. Sürükleyerek döndürebilirsiniz.</p><div class="ceiling-legend"><span><i style="background:#eeeae0"></i>Alçıpan</span><span><i style="background:#cbd8c4"></i>Yeşil alçıpan</span><span><i style="background:#acbab5"></i>Mini H</span></div><label class="field">Levhanın uzun kenarı<select id="ceilingDirection"><option value="y" ${project.frameDirection==='y'?'selected':''}>Şase boyunca · planda yukarı–aşağı</option><option value="x" ${project.frameDirection==='x'?'selected':''}>Şase boyunca · planda sağ–sol</option></select></label><p class="tip">Taslakta levha yönü şase boy doğrultusunu izler.</p>`)
 +section(b?`<span class="eyebrow">SEÇİLİ LEVHA · ${b.full?'TAM':'KENAR KESİMİ'}</span><h2>${esc(b.roomName)}</h2><div class="kv"><span>Malzeme</span><b>${b.green?'Yeşil':'Standart'} alçıpan</b></div><div class="kv"><span>Döşeme modülü</span><b>60 × 120 cm</b></div><div class="kv"><span>Yerleşim alanı</span><b>${fmt(b.area,3)} m²</b></div>${b.pieces.map(r=>`<div class="kv"><span>${b.pieces.length>1?'Kesim parçası':'Yerleşim ölçüsü'}</span><b>${fmt(r.x1-r.x0,2)} × ${fmt(r.y1-r.y0,2)} cm</b></div>`).join('')}<p class="tip">Ölçüler nominal yerleşimdir; mini H geçme ve kesim payı değildir.</p>`:'<span class="eyebrow">SEÇİM</span><h3>Bir levhayı seçin</h3><p>Tam levha veya oda sınırında kesilen parçanın ölçüsünü sağda görün.</p>')
 +section(`<h3>Döşeme önizlemesi</h3><div class="kv"><span>Kaplanan alan</span><b>${fmt(data.area,2)} m²</b></div><div class="kv"><span>Tam / kesilmiş modül</span><b>${full} / ${data.boards.length-full}</b></div><p class="tip">Satın alma veya sevk adedi değildir. Fire ve artık parça kullanımı hesaplanmaz.</p><details><summary>Mini H gösterimi</summary><p>Profil iki kapak ve aradaki gövdeyle 3D gösterilir. Standart geçme tavana vida eklenmez. Mini H kesiti ve geçme boşluğu temsilîdir; ölçülü ürün kesiti beklenir. Levha kalınlığı taslakta 1,25 cm’dir.</p></details>`);
 $('#ceilingBack').onclick=closeCeilingView;
 const angle=pitch=>{Camera3D.reset();zoom=1;Camera3D.state.pitch=pitch;Camera3D.state.yaw=25;render()};$('#ceilingUnder').onclick=()=>angle(-55);$('#ceilingOver').onclick=()=>angle(55);
 $('#ceilingDirection').onchange=e=>{save();project.frameDirection=e.target.value;selected=null;render()};
}
function drawCeilingLabels(ctx){
 if(!lastProjection||!sceneCache.ceiling)return;const plan=sceneCache.ceiling,lo=sceneCache.elevations.ceiling.bottom-.04;
 ctx.save();ctx.textAlign='center';ctx.textBaseline='middle';
 const b=plan.boards.find(b=>b.id===selected?.id)||plan.boards.find(b=>b.full&&!b.green);
 if(b){const r=b.pieces[0],corners=[{x:r.x0,y:r.y0},{x:r.x1,y:r.y0},{x:r.x1,y:r.y1},{x:r.x0,y:r.y1}].map(p=>lastProjection({...p,z:lo}));
  ctx.strokeStyle='#3b866d';ctx.lineWidth=2;ctx.beginPath();corners.forEach((p,i)=>i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));ctx.closePath();ctx.stroke();
  const p=lastProjection({x:(r.x0+r.x1)/2,y:(r.y0+r.y1)/2,z:lo}),label=`${fmt(r.x1-r.x0,2)} × ${fmt(r.y1-r.y0,2)}`;ctx.font='600 11px Segoe UI';const width=ctx.measureText(label).width+12;
  ctx.fillStyle='#24463bef';ctx.beginPath();ctx.roundRect(p.x-width/2,p.y-10,width,20,4);ctx.fill();ctx.fillStyle='#ecf8f2';ctx.fillText(label,p.x,p.y);
 }
 ctx.restore();
}
