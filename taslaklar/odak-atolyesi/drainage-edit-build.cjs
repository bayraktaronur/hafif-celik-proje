module.exports=function(s){
 const a='renderScene3D(ctx,w,h,scene.items,scene.edges,project);';
 if(s.split(a).length!==2)throw Error('Drainage editor paint anchor changed');
 s=s.replace(a,a+'\n      if(!target)window.RainEdit3D?.draw(ctx,scene,project);');
 return s.replace('if(window.RoofWorkflow?.key(e))return;', 'if(window.RainEdit3D?.key(e)){e.preventDefault();return;}if(window.RoofWorkflow?.key(e))return;');
};
