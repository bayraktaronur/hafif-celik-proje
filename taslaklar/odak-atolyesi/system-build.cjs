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
  return "const draftSystem = document.documentElement.dataset.system || '';\nfunction draftStorageKey(key) { return draftSystem ? key + '.' + draftSystem : key; }\n" + source;
}

function entries(folder, html) {
  for (const [name, system, label] of [['prefabrik','prefabrik','Prefabrik'], ['hafif-celik','celik','Hafif çelik']]) {
    const page = html.replace('<html lang="tr"', '<html lang="tr" data-system="' + system + '"')
      .replace(/<title>[^<]*<\/title>/, '<title>Plan Studio · ' + label + ' taslağı</title>');
    fs.writeFileSync(path.join(folder, name + '.html'), page);
  }
}
module.exports = { engine, entries };
