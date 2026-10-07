# DEV-052 — Yedi pencereli panel STL kaynağı

7 Ekim 2026, iş PC. Yedi kullanıcı dosyası H sürücüsünden okunup referanslar/2026-10-07-pencere-stl altına kopyalandı; orijinaller korunuyor. Envanterde kaynak/hedef/SHA256 ve eşitlik var. Tümü binary STL; dosya boyu=84+50×üçgen sayısı doğrulandı, tüm koordinatlar sonlu. Topolojik sağlamlık/kapalı katı doğrulanmış değildir.

Beş model dış eni125, iki160lık model dış eni171 birim; tüm modellerde Z boyu250. Santimetre yorumu dosya adlarıyla uyumlu ancak STL birim taşımaz; kullanıcıya birim soruldu.160×120/180 dış eni171'in pano mu profil/pervaz dahil mi olduğu soruldu. Yanıt gelmeden166/169 gibi eski pano ölçülerine zorla ölçeklenmez. Modellerin derinlik sınırı donanım çıkıntılarını da içerdiğinden doğrudan duvar kalınlığı kabul edilmez.

Dosyalar yalnız pencere değil panelle birlikte geometri içeriyor; önizlemede kanat/kasa/kol detayları görülüyor. Bağlı bileşen sayısı parça sayısı değildir; dokunan parçalar birleşebilir. STL parça adı ve güvenilir malzeme rengi taşımadığından otomatik cam/PVC/pano ayrımı onaylanmadı. Gösterilen önizleme nötr renkli geometri incelemesidir.50×180 geometrisi de ayrıca montaj yönü/katalog eşlemesiyle kontrol edilmeli.

Geometrik sınırlar/üçgen ve bileşen dökümü analizler/2026-10-07-pencere-stl-geometri.json; önizleme analizler/2026-10-07-pencere-stl-onizleme.png. Boylar250 olduğu için280/300 panolara tüm modeli esnetmek pencereyi de bozar; ayrı pano uzatma veya kullanıcı modeli gerekir.

Durum: kaynaklar alındı ve incelendi; canlı uygulamaya henüz bağlanmadı, sürüm5.9.65. Birim ve171cm kapsamı yanıtı sonrası yerleştirme dönüşümü ve ürün eşlemesi hazırlanacak. Mevcut canlı çizim değişmedi.
