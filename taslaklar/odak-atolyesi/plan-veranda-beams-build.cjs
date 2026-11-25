module.exports=function(s){const patch=(a,b)=>{if(s.split(a).length!==2)throw Error('Plan beam anchor changed');s=s.replace(a,b);};
patch('items.push(...planVerandaPosts());','items.push(...planVerandaPosts());if(window.PlanVerandaBeams)items.push(...PlanVerandaBeams.build(G));');
patch("if(z.soffitFinish!==undefined)","if(z.planVerandaBeams!==undefined&&(!Array.isArray(z.planVerandaBeams)||z.planVerandaBeams.length>24||z.planVerandaBeams.some(id=>typeof id!=='string'||id.length>80)))fail('ana çatı veranda kiriş seçimi geçersiz.');\n      if(z.soffitFinish!==undefined)");return s;};
