# DEV-052 — Yedi pencereli panel STL kaynağı

7 Ekim 2026, iş PC. Yedi kullanıcı dosyası H sürücüsünden okunup referanslar/2026-10-07-pencere-stl altına kopyalandı; orijinaller korunuyor. Envanterde kaynak/hedef/SHA256 ve eşitlik var. Tümü binary STL; dosya boyu=84+50×üçgen sayısı doğrulandı, tüm koordinatlar sonlu. Topolojik sağlamlık/kapalı katı doğrulanmış değildir.

Beş model dış eni125, iki160lık model dış eni171 birim; tüm modellerde Z boyu250. Santimetre yorumu dosya adlarıyla uyumlu ancak STL birim taşımaz; kullanıcıya birim soruldu.160×120/180 dış eni171'in pano mu profil/pervaz dahil mi olduğu soruldu. Yanıt gelmeden166/169 gibi eski pano ölçülerine zorla ölçeklenmez. Modellerin derinlik sınırı donanım çıkıntılarını da içerdiğinden doğrudan duvar kalınlığı kabul edilmez.

Dosyalar yalnız pencere değil panelle birlikte geometri içeriyor; önizlemede kanat/kasa/kol detayları görülüyor. Bağlı bileşen sayısı parça sayısı değildir; dokunan parçalar birleşebilir. STL parça adı ve güvenilir malzeme rengi taşımadığından otomatik cam/PVC/pano ayrımı onaylanmadı. Gösterilen önizleme nötr renkli geometri incelemesidir.50×180 geometrisi de ayrıca montaj yönü/katalog eşlemesiyle kontrol edilmeli.

Geometrik sınırlar/üçgen ve bileşen dökümü analizler/2026-10-07-pencere-stl-geometri.json; önizleme analizler/2026-10-07-pencere-stl-onizleme.png. Boylar250 olduğu için280/300 panolara tüm modeli esnetmek pencereyi de bozar; ayrı pano uzatma veya kullanıcı modeli gerekir.

Durum: kaynaklar alındı ve incelendi; canlı uygulamaya henüz bağlanmadı, sürüm5.9.65. Birim ve171cm kapsamı yanıtı sonrası yerleştirme dönüşümü ve ürün eşlemesi hazırlanacak. Mevcut canlı çizim değişmedi.

## Kullanıcı teyidi

Birim santimetre.160×120 ve160×180 modellerinde171cm en hatalı; doğru pano eni166cm. Bu bir pervaz açıklaması değil kaynak model hatasıdır. İki dosya orijinal haliyle korunur; pencere/profil geometrisini bozmamak için tüm model166/171 ölçeklenmez. Doğru kaynak veya hangi parçanın düzeltileceği gerekir. Diğer beş kaynağın birimi teyit edildi. Eşleme analizler/2026-10-07-pencere-stl-esleme.json.

## İkinci kaynak revizyonu — ölçü uyuşmazlığı

İki dosya ayrı rev2-166cm klasörüne alındı; ilk171cm kopyalar korundu. Klasör adı hedefi belirtir, ölçüm onayı değildir. Binary boy/sonlu koordinatlar ve SHA256 doğrulandı. Her ikisindeX min3 max168, net165cm: hedef166cm sağlanmadı.160×180 Z0..250;160×120 Z−1.045674443..250, toplam251.045674443cm. Bu sınırın hangi parçaya ait olduğu ayrıca düzeltilmeli; otomatik kırpma veya ölçek uygulanmadı. Sayısal rapor rev2-geometri.json, kaynak hashleri rev2-envanter.json. İmalat ölçüsü uyumsuz iki model uygulamaya bağlanmadı.

## 7 Ekim 2026 — 160×120 üçüncü revizyon

160×120 üçüncü revizyon ölçümü: dış genişlik 165 cm, yükseklik 250 cm; Z alt sınırı 0. Önceki 251,046 cm yükseklik sorunu giderilmiş, ancak 166 cm hedef en hâlâ 1 cm eksik. 160×180 için yeni dosya gelmedi; son revizyon 165×250 cm. Kaynak ayrı rev3 klasörüne kopyalandı, SHA-256 eşitliği ve binary STL uzunluğu/sonlu koordinatlar doğrulandı (5398 üçgen). Ölçekleme veya uygulamaya entegrasyon yapılmadı. Sürüm 5.9.65 değişmedi. Sıradaki adım: 166 cm dış enli kaynakların doğrulanması, ardından gerçek model entegrasyonu; diğer açık işler korunur.

Ölçüm: [rev3 geometri](2026-10-07-pencere-stl-rev3-geometri.json); kaynak doğrulaması: [rev3 envanter](2026-10-07-pencere-stl-rev3-envanter.json). Tam imalat uygunluğu yalnız dış boyut kontrolüyle doğrulanmış sayılmaz.

## 7 Ekim 2026 — 160×120 dördüncü revizyon

160×120 dördüncü revizyon: X sınırları −0,5 / 165,5 cm, dış en 166 cm; Z sınırları 0 / 250 cm, yükseklik 250 cm. Hedef dış ölçüler sağlandı. Toplam derinlik 13,245208 cm (donanım dahil dış sınır; duvar kalınlığı değildir). Önceki revizyona göre dış X sınırları iki yandan 0,5 cm genişledi. SHA-256 kaynak/kopya eşitliği, binary STL uzunluğu ve sonlu koordinatlar doğrulandı (5398 üçgen). Eski revizyonlar korundu; yeni dosya aktif 160×120 referansı yapıldı. Bu dış ölçü kontrolüdür; PVC kesitleri, açıklık ölçüleri ve tüm imalat detayları ayrıca doğrulanmalıdır. Ölçekleme veya uygulamaya entegrasyon yapılmadı. 160×180 son rev2 hâlâ 165×250 cm; onun düzeltilmiş kaynağı bekleniyor. Sürüm 5.9.65 değişmedi. Sıradaki adım gerçek STL modelinin planla eşleştirilip 3B görünüşe entegrasyonu; diğer açık işler korunur.

Kanıt: [geometri](2026-10-07-pencere-stl-rev4-geometri.json), [kaynak envanteri](2026-10-07-pencere-stl-rev4-envanter.json).

## 7 Ekim 2026 — Rev5 tekrar gönderim

Tekrar gönderilen 160×120 STL rev5 olarak korundu. SHA-256 farklı, ancak 84. bayttan sonraki tüm üçgen verileri rev4 ile bayt bayt aynı; bütün vertex koordinatları aynı. Fark yalnız STL başlık bölümünde. Dış ölçüler yine 166×250 cm, Z alt sınırı0, derinlik13,245208 cm,5398üçgen. Kaynak/kopya hash eşitliği ve binary boyut/sonlu koordinat kontrolü geçti. Aktif geometri referansı rev4 kalır; yeni imalat geometrisi veya uygulama değişikliği yok. 160×180 için yeni kaynak gelmedi. Entegrasyon DEV-052 kapsamında açık; sürüm5.9.65.

Kanıt: 2026-10-07-pencere-stl-rev5-envanter.json ve 2026-10-07-pencere-stl-rev5-geometri.json.
