/* User-supplied catalogue. Dimensions in centimetres. */
window.OpeningCatalog=(function(){
 const list=[];
 function win(id,ad,en,yuk,cols,active,opening='side',extra={}){list.push({id,ad,en,yuk,tip_:'pencere',penTip:opening==='fixed'?'sabit':opening==='tilt'?'vasistas':'tek-kanat',cols,active,opening,...extra});}
 win('p-120100-vas','P · Vasistas',120,100,1,0,'tilt',{transom:.5});
 win('p-120100','P · Sabit + açılır',120,100,2,1);
 win('p1','P1',160,180,3,1);win('p2','P2',120,120,2,1);win('p3','P3',160,120,3,1);win('p4','P4',120,180,2,1);
 win('p5','P5 · Sabit',50,180,1,-1,'fixed');win('p6','P6',80,125,1,0);win('p7','P7',80,180,1,0);
 win('v','V · Vasistas',60,40,1,0,'tilt');win('v1','V1 · Sabit + vasistas',120,50,2,1,'tilt');
 function door(id,ad,en,yuk,style,hand='sol',extra={}){list.push({id,ad,en,yuk,tip_:'kapi',kapiTip:style==='sliding'?'surme':style==='double'||style==='double-glass'?'cift':style==='american'?'ic':'dis',style,hand,...extra});}
 door('p1-special','P1 Özel · Çift kanat açılır',120,200,'double-glass');door('p2-special','P2 Özel · Çift kanat açılır',160,200,'double-glass');door('p2-sliding','P2 Özel · Sürgülü kapı',160,200,'sliding');
 for(const hand of ['sol','sag']){const name=hand==='sol'?'Sol':'Sağ';door('al-'+hand,name+' alüminyum kapı',90,205,'al',hand);door('sheet-'+hand,name+' sac kapı',90,200,'sheet',hand);door('steel-'+hand,name+' çelik kapı',90,205,'steel',hand);door('pvc-'+hand,name+' PVC kapı',80,200,'pvc',hand);door('panic-'+hand,name+' panik barlı sac kapı',90,200,'panic',hand);door('american-'+hand,name+' iç Amerikan kapı',80,205,'american',hand);}
 door('double-al','Double alüminyum veya PVC kapı',160,200,'double','sol',{material:'al'});door('double-sheet','Double sac kapı',160,200,'double');
 return list;
})();
