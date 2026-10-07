# DEV-050 — Plana bağlı detaylı 3B imalat modeli

7 Ekim 2026, iş PC. İnceleme; uygulama sürümü 5.9.63 değişmedi.

Kullanıcı panel, H, köşe direği, açıklıklı pano ve pencere dahil plandaki detayların imalata uygun 3B modelini istiyor; eksik parçaların ölçülü teknik çizim veya 3B modellerini sağlayabilir.

src/roof.js planStructure bugün duvar segmentini kalınlık ve genel yüksekliğe göre dolu prizma yapıyor; panel ayırma ve gerçek açıklık boşluğu yok. src/engine.js panel yerleşimleri, birleşimler ve pfKoseRect plan geometrisini içeriyor. src/windows.js katalog görünüşü açıkça şematik. Önceki üretim denetimi de H/U/köşe sembollerinin imalat kesiti olmadığını belirtiyor (2026-10-02-uretim-kural-denetimi.md).

Gerekli ilk teknik paket: standart dolu pano katman/kenar kesiti; düz H, 3lü H, 4lü birleşim, köşe direği ve çektirme/uç U kesitleri; bir pencereli ve bir kapılı panonun çerçeve ve açıklık detayı; örnek PVC kasa-kanat-cam kesiti ve montaj konumu. Farklı duvar kalınlıkları için kullanılan tipler ayrılmalı. Tüm ölçüler mm; sac kalınlıkları, panel girme derinliği, boşluklar ve yükseklik referansları belirtilmeli. Mevcut çizimlerdeki kaba ölçüler tekrar istenmez, eksik üretim detayları tamamlanır.

Tercih: ölçülü kesit DXF ve okunabilir PDF; gerçek katı model STEP/STP, görüntüleme modeli varsa GLB. Bunlar referans kaynaklarıdır; uygulamada doğrudan STEP/GLB içe aktarma bulunduğu iddia edilmez. Mevcut DWG kabul edilebilir; okunabilir kesit PDF ile eşleştirilmesi yararlı.

Uygulama sırası: ortak panel/parça kimliklerinden 3B geometri; açıklıklı panolar ve PVC/kapı; doğrulanmış kesitlerden H/U/köşe; çatı kaldırma ve parça seçimiyle plan/metraj eşlemesi. Panel ve açıklık adet/ölçüleri ortak veriden doğrulanacak; bilinmeyen büküm ve montaj ayrıntıları uydurulmayacak.

Durum: teknik paket bekleniyor. Henüz detaylı 3B imalat özelliği uygulanmadı. Canlı çizime müdahale edilmedi; DEV-043 güncel JSON hâlâ doğrulanmadı.

## İlk teknik paket alındı

Standart en1250 mm; yükseklikler2500/2800/3000 mm. 10luk panel8+80+8=96 mm, 6lık panel8+40+8=56 mm. Nadir panel8+130+8=146 mm; kullanıcı adını yine6lık yazdı, 15lik eşlemesi soruldu ve henüz teyit edilmedi. H/H3 sacı1 mm. Görseller birleşim biçimlerini ve çatı omega/saçak kesitini gösteriyor; ölçüsüz çizgilerden kesit ölçüsü türetilmedi. Köşedeki100/50/70/30 mm yazıları korunuyor; hangi yüz/uzantıya ait olduğu ve köşe sac kalınlığı teyit bekliyor. H kanat/net kanal ölçüleri soruldu.

Kesin değerler analizler/2026-10-07-panel-uretim-olculeri.json dosyasında ayrı üretim referansı; uygulamaya henüz bağlanmadı. Dört görsel orijinalleri korunarak referanslar/2026-10-07-panel-birlesim klasörüne kopyalandı, hash envanteri doğrulandı. Planın nominal kalınlıkları ve1255 mm aks modülü, gerçek panel1250 mm ile karıştırılmayacak.

## H ölçüsü ve yön teyidi

Kullanıcı146 mm panelin15lik olduğunu teyit etti. Köşe100×50 gövde ve70/30 uzantı biçimini kabul etti;100/50 yönünü mevcut makas sistemi belirler. Son görsel düz H için100 mm ara ölçü,54 mm toplam kanat ve27+27 mm dağılım veriyor. H ve köşe sacı1 mm kesinleşti; kullanıcı bu inceliğin3B görünüşte öncelikli olmadığını belirtti.100 mm ölçü okunun iç/dış yüz datumu ve büküm toleransları verilmedi; imalat toleransı uydurulmaz. Bu ayrıntı mevcut10luk örneğin görsel modelini başlatmaya engel değildir. Diğer ürünlere otomatik ölçeklenmiş kesit onaylanmış imalat diye sunulmaz.

Sıradaki uygulama:10luk dolu panel/H/köşe örneğini doğrulanmış katman ve görünüş ölçüleriyle üretmek, plan yerleşim ve makas yönüyle aynı kaynağa bağlamak. Uygulama henüz değişmedi.
