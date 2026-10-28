module.exports=function(file,s,R){
 if(file==='src/project.js')s=R(s,'finite(a.angle,0,359)','finite(a.angle,0,360)');
 if(file!=='src/text-notes.js')return s;
 const ca=s.indexOf(' function constrained(p)'),cb=s.indexOf(' function capturePoint(p)',ca);if(ca<0||cb<0)throw Error('constraint anchor');s=s.slice(0,ca)+` function constrained(p){if(!start||draft?.shape!=='line'||PreciseLines.mode.ortho===freeShift)return p;return Math.abs(p.x-start.x)>=Math.abs(p.y-start.y)?{x:p.x,y:start.y}:{x:start.x,y:p.y};}
`+s.slice(cb);
 s=R(s,"const p=point(e);if(G.tool==='text'&&draft)","const p=point(e);if(window.LineAssist?.active()){stop(e);LineAssist.pick(p);return;}if(G.tool==='text'&&draft)");

 const begin=s.indexOf(' function capturePoint(p)'),finish=s.indexOf(" $('shapeWallApply')",begin);if(begin<0||finish<0)throw Error('capture anchor');s=s.slice(0,begin)+` function capturePoint(p){if(!draft?.shape)return p;if(pinned)return pinned;let result=constrained(p);const q=PreciseLines.snap(result,null,moveAlt,start,!!start&&PreciseLines.mode.ortho!==freeShift);if(Math.hypot(constrained(q).x-q.x,constrained(q).y-q.y)<.001)result=q;wallSnap=null;let best=10/sc();for(const sg of G.segs){const a=getNode(sg.n1),b=getNode(sg.n2);if(!a||!b)continue;const q=PreciseLines.project(result,a,b),L=Math.hypot(b.x-a.x,b.y-a.y),d=Math.hypot(q.x-result.x,q.y-result.y);if(L&&d<best){best=d;wallSnap={a,b,L,t:Math.hypot(q.x-a.x,q.y-a.y)/L,q,id:sg.id};}}if(wallSnap){const w=wallSnap;$('shapeWallInfo').textContent='Duvar '+w.id+' · A: '+(w.t*w.L).toFixed(2)+' / B: '+((1-w.t)*w.L).toFixed(2)+' cm';if(document.activeElement!==$('shapeWallOffset'))$('shapeWallOffset').value=(w.t*w.L).toFixed(2);}else $('shapeWallInfo').textContent='Uç / orta / kesişim / duvar yüzü · Alt: yakalama kapalı';return result;}
`+s.slice(finish);
 s=R(s,"if(G.tool==='sec'){const a=hit(p);","if(G.tool==='sec'){const selected=G.seciliTip==='annotation'?G.secili:null;if(selected?.shape==='line'&&!selected.dimKind){const i=PreciseLines.ends(selected).findIndex(q=>Math.hypot(q.x-p.x,q.y-p.y)*sc()<=10);if(i>=0){stop(e);moving={id:selected.id,start:p,x:selected.x,y:selected.y,endpoint:i};ghost=null;cv.focus();return;}}const a=hit(p);");
 s=R(s,'function slideLine(a,p){','function slideLine(a,p){if(moving.endpoint!==undefined){const ps=PreciseLines.ends(a);ps[moving.endpoint]=PreciseLines.snap(p,a.id,moveAlt,ps[1-moving.endpoint],PreciseLines.mode.ortho!==freeShift);return PreciseLines.from(a,...ps);}');
 s=R(s,'const r=moving.rails;if(!r)return {...a,x:Math.round(moving.x+p.x-moving.start.x),y:Math.round(moving.y+p.y-moving.start.y)};','const r=moveAlt?null:moving.rails;if(!r){const q=a.shape===\'line\'?PreciseLines.snap(p,a.id,moveAlt):p;return {...a,x:moving.x+q.x-moving.start.x,y:moving.y+q.y-moving.start.y};}');
 s=R(s,"window.setTool=function(t){","window.setTool=function(t){PreciseLines.clear();");
 s=R(s,'let wallSnap=null,pinned=null,freeShift=false;','let wallSnap=null,pinned=null,freeShift=false,moveAlt=false;');
 s=R(s,'freeShift=!!e.shiftKey;','freeShift=!!e.shiftKey;moveAlt=!!e.altKey;');
 s=R(s,'if(p&&(p.x!==m.x||p.y!==m.y||p.dimKind))','PreciseLines.clear();if(p&&(p.x!==m.x||p.y!==m.y||p.dimKind||m.endpoint!==undefined)&&(!p.shape||p.w>=.01))');
 s=R(s,'a.x=p.x;a.y=p.y;if(p.dimKind)','a.x=p.x;a.y=p.y;if(m.endpoint!==undefined){a.w=p.w;a.h=p.h;a.angle=p.angle;}if(p.dimKind)');
 s=R(s,'draft=ghost=moving=start=null;editId=null;','draft=ghost=moving=start=null;PreciseLines.clear();editId=null;');
 s=R(s,'window.addEventListener(\'blur\',()=>{moving=ghost=null;draw();});','window.addEventListener(\'blur\',()=>{moving=ghost=null;PreciseLines.clear();draw();});');
 s=R(s,'box.append(b);}};','box.append(b);}PreciseLines.inspector(G.secili,box);};');
 s=R(s,'ctx.globalAlpha=.6;paint(ghost,true);ctx.restore();}};','ctx.globalAlpha=.6;paint(ghost,true);ctx.restore();}if(!TH.export)PreciseLines.overlay(ghost|| (G.seciliTip===\'annotation\'?G.secili:null));};');
 return s;
};
