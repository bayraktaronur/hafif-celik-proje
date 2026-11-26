(function(){
 function build(G){const out=[],done=new Set();
  for(const roof of G.roofs){for(const id of roof.planVerandaBeams||[]){if(done.has(id)||G.roofs.some(r=>r.sourceRoomId===id))continue;done.add(id);const room=G.rooms.find(r=>r.id===id&&r.tip==='veranda');if(!room)continue;
   for(const s of G.segs.filter(s=>s.tip==='veranda'&&room.nodeIds.includes(s.n1)&&room.nodeIds.includes(s.n2))){const a=G.nodes.find(n=>n.id===s.n1),b=G.nodes.find(n=>n.id===s.n2);if(!a||!b)continue;const L=Math.hypot(b.x-a.x,b.y-a.y);if(L<=10)continue;const ux=(b.x-a.x)/L,uy=(b.y-a.y)/L;
    const trim=n=>{let value=5;for(const w of G.segs.filter(w=>w.tip!=='veranda'&&(w.n1===n.id||w.n2===n.id))){const p=G.nodes.find(n=>n.id===w.n1),q=G.nodes.find(n=>n.id===w.n2),l=Math.hypot(q.x-p.x,q.y-p.y),dot=Math.abs(ux*(q.y-p.y)/l-uy*(q.x-p.x)/l);if(dot>.001)value=Math.max(value,w.k/2/dot);}return value;};
    const start=trim(a),end=L-trim(b);if(end<=start)continue;const top=Number(roof.wallTop??G.opt.h)||280,bottom=top-10;
    const poly=[[start,-5],[end,-5],[end,5],[start,5]].map(([d,t])=>({x:a.x+ux*d-uy*t,y:a.y+uy*d+ux*t}));
    const low=poly.map(p=>({...p,z:bottom})),high=poly.map(p=>({...p,z:top})),meta={kind:'beam',sourceSegmentId:s.id,roomId:id,color:'#aebdcc',shade:.9};out.push({...meta,poly:low.slice().reverse()},{...meta,poly:high});for(let i=0;i<4;i++){const j=(i+1)%4;out.push({...meta,poly:[low[i],low[j],high[j],high[i]]});}
   }
  }}return out;
 }
 window.PlanVerandaBeams={build};
})();
