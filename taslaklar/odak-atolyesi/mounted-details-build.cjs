module.exports=function(s){const patch=(a,b)=>{if(s.split(a).length!==2)throw Error('Mounted details anchor changed: '+a);s=s.replace(a,b);};
patch('function soffitSurfaces(m){\n    const out=[];', 'function soffitSurfaces(m){\n    if(window.MountedSoffit)return MountedSoffit.build(m,G.roofs,C);\n    const out=[];');
patch('...trimSurfaces(m),...rain.items','...trimSurfaces(m).filter(i=>!window.MountedSoffit||i.kind!=="vergeBottom"),...rain.items');
patch("if(!prefab||o.e.tip_!=='pencere')continue;", "if(!prefab||o.e.tip_!=='pencere'||(o.e.penTip==='surme'&&o.e.yuk>60))continue;");
patch("warnings.add('PVC/kapı kasa", "if(window.PvcOpening3D&&PvcOpening3D.append({o,r,surfaces,parts}))continue;\n   warnings.add('PVC/kapı kasa");
patch("door('double-sheet','Double sac kapı',160,200,'double');", "door('double-sheet','Double sac kapı',160,200,'double');\n for(const hand of ['sol','sag']){door('pvc-full-'+hand,'PVC tam camlı · '+hand,90,205,'pvc-full',hand);door('pvc-half-'+hand,'PVC yarım camlı · '+hand,90,205,'pvc-half',hand);}\n win('p-sliding','PVC sürgülü · iki ray',120,120,2,0,'sliding',{penTip:'surme'});");return s;};
