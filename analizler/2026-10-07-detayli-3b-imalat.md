# DEV-050 — Plana bağlı detaylı 3B imalat modeli

7 Ekim 2026, iş PC. İnceleme; uygulama sürümü 5.9.63 değişmedi.

Kullanıcı panel, H, köşe direği, açıklıklı pano ve pencere dahil plandaki detayların imalata uygun 3B modelini istiyor; eksik parçaların ölçülü teknik çizim veya 3B modellerini sağlayabilir.

src/roof.js planStructure bugün duvar segmentini kalınlık ve genel yüksekliğe göre dolu prizma yapıyor; panel ayırma ve gerçek açıklık boşluğu yok. src/engine.js panel yerleşimleri, birleşimler ve pfKoseRect plan geometrisini içeriyor. src/windows.js katalog görünüşü açıkça şematik. Önceki üretim denetimi de H/U/köşe sembollerinin imalat kesiti olmadığını belirtiyor (2026-10-02-uretim-kural-denetimi.md).

Gerekli ilk teknik paket: standart dolu pano katman/kenar kesiti; düz H, 3lü H, 4lü birleşim, köşe direği ve çektirme/uç U kesitleri; bir pencereli ve bir kapılı panonun çerçeve ve açıklık detayı; örnek PVC kasa-kanat-cam kesiti ve montaj konumu. Farklı duvar kalınlıkları için kullanılan tipler ayrılmalı. Tüm ölçüler mm; sac kalınlıkları, panel girme derinliği, boşluklar ve yükseklik referansları belirtilmeli. Mevcut çizimlerdeki kaba ölçüler tekrar istenmez, eksik üretim detayları tamamlanır.

Tercih: ölçülü kesit DXF ve okunabilir PDF; gerçek katı model STEP/STP, görüntüleme modeli varsa GLB. Bunlar referans kaynaklarıdır; uygulamada doğrudan STEP/GLB içe aktarma bulunduğu iddia edilmez. Mevcut DWG kabul edilebilir; okunabilir kesit PDF ile eşleştirilmesi yararlı.

Uygulama sırası: ortak panel/parça kimliklerinden 3B geometri; açıklıklı panolar ve PVC/kapı; doğrulanmış kesitlerden H/U/köşe; çatı kaldırma ve parça seçimiyle plan/metraj eşlemesi. Panel ve açıklık adet/ölçüleri ortak veriden doğrulanacak; bilinmeyen büküm ve montaj ayrıntıları uydurulmayacak.

Durum: teknik paket bekleniyor. Henüz detaylı 3B imalat özelliği uygulanmadı. Canlı çizime müdahale edilmedi; DEV-043 güncel JSON hâlâ doğrulanmadı.
