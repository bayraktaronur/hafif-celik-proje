const assert = require('node:assert/strict');
const fs = require('node:fs');
const root = __dirname + '/';
const rules = JSON.parse(fs.readFileSync(root+'profile-rules.json'));
assert.deepEqual(rules, JSON.parse(fs.readFileSync(root+'prefabrikten_karkas/profile-rules.json')));
const source=fs.readFileSync(root+'prefabrikten_karkas/main.rb','utf8');
const expression=source.match(/\[\[0,0\],[\s\S]*?\[0,w\]\]/)[0];
const polygon=new Function('w','t','f','l','return '+expression);
let checked=0;
for(const w of rules.section.webWidths) for(const t of rules.section.thicknessOptions){
 const p=polygon(w,t,45,12.5);
 let twiceArea=0;
 for(let i=0;i<p.length;i++){const a=p[i],b=p[(i+1)%p.length];twiceArea+=a[0]*b[1]-b[0]*a[1];}
 assert.ok(Math.abs(Math.abs(twiceArea)/2-t*(w+90+25-4*t))<1e-8);
 assert.equal(Math.max(...p.map(v=>v[0])),45);
 assert.equal(Math.max(...p.map(v=>v[1])),w);
 for(const receiving of rules.section.thicknessOptions){
 const target=w-2*receiving-rules.nesting.totalClearance;
 assert.ok(target>0);
 assert.ok(Math.abs(w-2*receiving-target-0.5)<1e-8);
 }
 checked++;
}
console.log(`${checked} section area / outside dimension checks and 175 nesting checks passed`);

