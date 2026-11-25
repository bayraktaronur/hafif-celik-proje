// Plan veranda posts also exist when their roof is part of the main roof.
module.exports = function addVerandaPosts(source) {
  function replace(from, to) {
    if (source.split(from).length !== 2) throw Error('Veranda post build anchor changed: '+from);
    source = source.replace(from,to);
  }
  replace('  function verandaStructure(z){', `  function planVerandaPosts(){
    if(!isPref() || !window.LoadingList)return [];
    const covered=[];
    for(const roof of G.roofs.filter(z=>z.sourceRoomId)){
      const frame=roof.attachment?.base||roof;
      for(const member of verandaMembers(roof)){
        if(member.kind==='post')covered.push(C.transform(frame,{x:member.x,y:member.y}));
      }
    }
    const rows=LoadingList.calculate().rows.filter(row=>row.sources.some(s=>s.postRule));
    const surfaces=[];
    for(const row of rows){
      const height=(row.postLengthMm||row.sources[0].postRule.lengthMm)/10;
      for(const source of row.sources){
        const node=getNode(source.id.replace('veranda:',''));
        if(!node||covered.some(p=>Math.hypot(p.x-node.x,p.y-node.y)<.01))continue;
        const corners=[[-5,-5],[5,-5],[5,5],[-5,5]].map(([x,y])=>({x:node.x+x,y:node.y+y}));
        const bottom=corners.map(p=>({...p,z:0})),top=corners.map(p=>({...p,z:height}));
        const meta={kind:'post',sourceNodeId:node.id,color:'#aebdcc',shade:.9};
        surfaces.push({...meta,poly:bottom.slice().reverse()},{...meta,poly:top});
        for(let i=0;i<4;i++){
          const j=(i+1)%4;
          surfaces.push({...meta,poly:[bottom[i],bottom[j],top[j],top[i]]});
        }
      }
    }
    return surfaces;
  }
  function verandaStructure(z){`);
  replace("ProjectSpecs.facade(planStructure());if(wallModel)", "ProjectSpecs.facade(planStructure());items.push(...planVerandaPosts());if(wallModel)");
  replace('G.foundation,G.paint3D,G.rainDrainage,showWallDetails', 'G.foundation,G.paint3D,G.rainDrainage,G.loading,showWallDetails');
  replace('verandaStructure,planStructure,fasciaSurfaces', 'verandaStructure,planVerandaPosts,planStructure,fasciaSurfaces');
  return source;
};
