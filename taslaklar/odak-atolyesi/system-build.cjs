const fs = require('node:fs');
const path = require('node:path');

function engine(source) {
  function replace(from, to) {
    if (!source.includes(from)) throw Error('Taslak derleme noktası eksik: ' + from);
    source = source.replace(from, to);
  }
  // Each entry has its own tabs, history, clipboard and opening preferences.
  source = source.replace(/'(?:prefabrikten\.odak\.tek-kat\.|odak-tek-kat-)[^']*'/g, key => 'draftStorageKey(' + key + ')');
  replace("original.setSistem('celik',true);updateSidebar();sync();resize();", "original.setSistem(draftSystem || 'celik',true);updateSidebar();sync();resize();");
  replace("d.sistem=d.sistem||'celik';", "d.sistem=d.sistem||'celik';\n    if(draftSystem && d.sistem!==draftSystem)fail('Bu projeyi '+(d.sistem==='celik'?'Hafif Çelik':'Prefabrik')+' taslağında açın.');");
  replace("window.setSistem=function(v,silent){", "window.setSistem=function(v,silent){\n    if(draftSystem && v!==draftSystem)return;");
  source = require('./veranda-posts-build.cjs')(source);
  source = require('./technical-output-build.cjs')(source);
  source = require('./roof-hatch-build.cjs')(source);
  source = require('./plan-veranda-beams-build.cjs')(source);
  source = require('./mounted-details-build.cjs')(source);
  source = require('./drainage-edit-build.cjs')(source);
  return "const draftSystem = document.documentElement.dataset.system || '';\nfunction draftStorageKey(key) { return draftSystem ? key + '.' + draftSystem : key; }\n" + source;
}

function entries(folder, html) {
  for (const [name, system, label] of [['prefabrik','prefabrik','Prefabrik'], ['hafif-celik','celik','Hafif çelik']]) {
    let page = html.replace('<html lang="tr"', '<html lang="tr" data-system="' + system + '"')
      .replace(/<title>[^<]*<\/title>/, '<title>Plan Studio · ' + label + ' taslağı</title>');
    if (system === 'prefabrik') {
      page = page.replace('<script src="single-engine.js">','<script src="drainage-mount.js"></script><script src="single-engine.js">');
      page = page.replace('</body>', '<script src="drainage-edit-3d.js"></script><script src="mounted-soffit.js"></script><script src="pvc-opening-3d.js"></script><script src="plan-veranda-beams.js"></script><script src="roof-hatch.js"></script><script src="elevation-sheet.js"></script></body>');
      page = page.replace('Prefabrik & hafif çelik tasarım','Prefabrik panel tasarımı')
        .replace(/<button[^>]+id="hcBtn"[^>]*>[^<]*<\/button>/,'')
        .replace('id="canvasSystem">Hafif çelik','id="canvasSystem">Prefabrik panel')
        .replace('Serbest profil yerleşimi','Prefabrik panel yerleşimi')
        .replace('Yapı sistemini seçin, duvarları çizin.','Prefabrik duvarları çizerek başlayın.');
    }
    fs.writeFileSync(path.join(folder, name + '.html'), page);
  }
}
module.exports = { engine, entries };
