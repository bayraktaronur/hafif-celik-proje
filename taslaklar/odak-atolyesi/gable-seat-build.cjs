/* Seat a gable-connected wing on the host infill, not its projecting verge. */
module.exports=function(source){
 const anchor="if(mouth.length&&mouth.every(f=>Math.abs(f.a*dir.x+f.b*dir.y)<1e-7)){";
 const patch=anchor+`
      // Keep the drawn U anchors for reanchoring and old project compatibility.
      // The actual roof/support end reaches the vertical gable infill plane.
      const seatBase=(parent.childJoin?.support||basePolygon(parent).map(p=>transform(parent,p))).map(p=>untransform(z,p));
      const seats=seatBase.flatMap((p,i)=>{const q=seatBase[(i+1)%seatBase.length];return Math.abs(p.x-q.x)<.001&&p.x>=depth-.001&&width/2>=Math.min(p.y,q.y)-.001&&width/2<=Math.max(p.y,q.y)+.001?[p.x]:[];});
      if(!seats.length)fail('gable-seat','Başmakas kaplaması bağlantı düzlemi bulunamadı. Ana çatı sınırını kontrol edin.');
      const seat=Math.min(...seats),inset=Math.max(0,seat-depth);
      depth+=inset;z.w=depth;
      z.childJoin.seatInset=inset;
      z.childJoin.support=ps.map((p,i)=>i===0||i===3?{x:p.x+dir.x*inset,y:p.y+dir.y*inset}:{...p});
`;
 if(source.split(anchor).length!==2)throw Error('Gable seat anchor');
 source=source.replace('const [a,b,c,d]=ps,mid=', 'const [a,b,c,d]=ps,mid=');
 source=source.replace('depth=Math.hypot(mid.x-front.x,mid.y-front.y),width=Math.hypot(a.x-d.x,a.y-d.y);','width=Math.hypot(a.x-d.x,a.y-d.y);let depth=Math.hypot(mid.x-front.x,mid.y-front.y);');
 source=source.replace(anchor,patch);
 source=source.replace("child?.attachmentJoin==='gable'&&child.attachment.parentId===g.zoneId", "((child?.attachmentJoin==='gable'&&child.attachment.parentId===g.zoneId)||(child?.childJoin?.mode==='gable'&&child.production?.parentId===g.zoneId))");
 source=source.replace("z.childJoin.mode='gable';z.childJoin.cladding=panels;z.childJoin.support=ps.map(p=>({...p}));return z;", "z.childJoin.mode='gable';z.childJoin.cladding=panels;return z;");
 return source;
};
