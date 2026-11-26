/* Same trim datum for rectangular and outlined hip roofs. */
module.exports=function(s){const patch=(a,b)=>{if(s.split(a).length!==2)throw Error('Hip eaves anchor: '+a);s=s.replace(a,b);};
patch("eaves:[0,0,0,0],datum:'wall'});","eaves:[0,0,0,0],h:z.h+(z.datum==='trim'?Math.max(12,z.fasciaDepth??12):0),datum:'wall'});");
patch("{...e.q,z:e.q.z-depth},{...e.p,z:e.p.z-depth}],color:'#d8dedc'","{...e.q,z:z.type==='kirma'&&z.datum==='trim'?z.h:e.q.z-depth},{...e.p,z:z.type==='kirma'&&z.datum==='trim'?z.h:e.p.z-depth}],color:'#d8dedc'");
return s;};
