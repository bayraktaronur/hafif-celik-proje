/* Prototype roof constraints. Peaks are solved against the actual roof geometry. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.RoofLevelMath=api;})(globalThis,function(){
 'use strict';
 const peak=(z,C)=>Math.max(...C.zoneFaces(z).flatMap(f=>f.poly.map(p=>C.height(f,p))));
 function pitchForPeak(z,target,C){
  if(!Number.isFinite(target))throw Error('Mahya kotunu santimetre olarak girin.');
  const a=peak({...z,pitch:1},C),b=peak({...z,pitch:2},C),gain=b-a;
  if(!Number.isFinite(gain)||gain<=1e-7)throw Error('Çatı açıklığından eğim hesaplanamadı.');
  const pitch=1+(target-a)/gain;
  if(!Number.isFinite(pitch)||pitch<1-1e-7||pitch>200+1e-7)throw Error('Bu mahya kotu için eğim %1–200 dışında kalıyor. Alt kot sabit tutuldu.');
  return Math.max(1,Math.min(200,pitch));
 }
 function validate(c){
  if(!c)return;
  if(c.version!==1||!['wall','manual'].includes(c.baseMode)||!['baseLocked','peakLocked','pitchLocked'].every(k=>typeof c[k]==='boolean')||c.peakLocked&&c.pitchLocked||!Number.isFinite(c.base)||c.base<0||c.base>20000||!Number.isFinite(c.peak)||!Number.isFinite(c.pitch)||c.pitch<1||c.pitch>200)throw Error('Çatı kot/kilit ayarları geçersiz.');
 }
 function apply(z,C){
  const c=z.levelControl;if(!c)return z;validate(c);
  z.h=c.baseMode==='wall'&&!c.baseLocked?(z.wallTop??z.h):c.base;
  if(c.baseMode==='wall'&&!c.baseLocked)delete z.roofElevation;else z.roofElevation=z.h;
  if(c.peakLocked)z.pitch=pitchForPeak(z,c.peak,C);else if(c.pitchLocked)z.pitch=c.pitch;
  return z;
 }
 return {peak,pitchForPeak,validate,apply};
});
