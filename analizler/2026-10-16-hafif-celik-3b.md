# Hafif çelik 3B — 5.9.108 / DEV-110

Kullanıcı Plan Studio hafif çelik sisteminde kapı, pencere ve çatı görünümünün güncellenmesini istedi. Önceki 3B yol yalnız prefabrikte açıklık geometrisini kullanıyor, hafif çelik duvarlarını deliksiz kutular olarak çiziyordu.

Hafif çelik duvarları artık çizilmiş aks, uzunluk ve kalınlık üzerinden oluşturulur. Kapı/pencere boşlukları duvardan çıkarılır; kasa, kanat, cam ve katalog bölmeleri gösterilir. Prefabrik H/köşe ve EPS panel geometrisi hafif çeliğe uygulanmaz; prefabrik tam pano STL modelleri de kullanılmaz. Kasa/kanat kesitleri temsilîdir; mevcut pencere üst kotu 210 cm kuralı sürer. Taşıyıcı çelik karkasın imalat modeli bu değişikliğin kapsamı değildir.

Planı kapsayan dikdörtgen çatı düğmesi artık seçilen çatı tipini ve eğimi kullanır. Hafif çelik makas yönü değişiminde prefabrik panel/mesnet uyarıları kaldırıldı; akslar ve açıklıklar korunur. Ortak yükseklik değişiminin çatı duvar üst kotuna aktarımı doğrulandı.

Kontroller: tests/steel-3d.cjs — 3 açıklık, ters duvar, 14/20 cm kalınlık, sonlu koordinatlar, boşlukta kaplama bulunmaması, üç çatı türü, %25 eğim, yön değişiminde aks/açıklık koruması, 300 cm yükseklik, JSON. tests/wall-3d.cjs ve tests/window-stl.cjs geçti. [3B kontrol görüntüsü](2026-10-16-hafif-celik-3b.png).

Güncel müşteri çizimi sağlanmadığından bağımsız test planı kullanıldı; açık kullanıcı çizimi değiştirilmedi. Yerel özel SketchUp referansları ve önceki analiz notları bu teslimden ayrı korunur. GitHub'daki 13 belge kaydı fast-forward alındı, yerel notlar çakışmadan birleştirildi.
