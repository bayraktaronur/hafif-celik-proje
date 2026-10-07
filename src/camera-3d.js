(function(){
 const state={yaw:35,pitch:31,zoom:1,panX:0,panY:0,projection:'parallel'};
 function preset(name){const v={front:[0,0],back:[180,0],left:[90,0],right:[270,0],top:[0,90],iso:[35,31]}[name];if(v){state.yaw=v[0];state.pitch=v[1];}reset();}
 function reset(){state.zoom=1;state.panX=state.panY=0;}
 function project(points,w,h){if(!points.length)points=[{x:0,y:0,z:0}];const min={},max={},c={};for(const k of ['x','y','z']){min[k]=Math.min(...points.map(p=>p[k]));max[k]=Math.max(...points.map(p=>p[k]));c[k]=(min[k]+max[k])/2;}
 const radius=Math.max(50,Math.hypot(max.x-min.x,max.y-min.y,max.z-min.z)/2),a=state.yaw*Math.PI/180,b=state.pitch*Math.PI/180,dist=radius*3.5,scale=Math.max(20,Math.min(w-90,h-100))/(2*radius)*state.zoom;
 return p=>{const x=p.x-c.x,y=p.y-c.y,z=p.z-c.z,X=x*Math.cos(a)-y*Math.sin(a),D=x*Math.sin(a)+y*Math.cos(a),Y=D*Math.sin(b)-z*Math.cos(b),Z=D*Math.cos(b)+z*Math.sin(b),pers=state.projection==='perspective',f=pers?dist/(dist-Z):1;return{x:w/2+state.panX+X*scale*f,y:h/2+state.panY+Y*scale*f,depth:pers?dist*dist/(dist-Z)-dist:Z};};
 }
 window.Camera3D={state,preset,reset,project};
})();