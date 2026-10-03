# Diğer yükleme kalemleri — 3 Ekim 2026

Kaynak: src/loading-reference.js içindeki SP - 202600185 - Tuna Pref. 84m².xlsx / K1-280-10-6 referans satırları. Bu tur özgün Excel yeniden okunmadı; mevcut aktarılmış envanter incelendi. src/loading-ui.js ve önceki analiz kayıtlarında bu kalemler için onaylı genel üretim reçetesi bulunmadı.

| Sıra | Kalem / referans | Netleştirilecek kural |
| --- | --- | --- |
| 1 | Alt çerçeve: 60×2500 mm 10 adet, 100×2500 mm 15 adet; satır38–39 | Hangi duvar boyunca, kapı altında devam/kesinti, köşe birleşim boyları, artık kullanımı ve yedek |
| 2 | Duvar omegası: 60×2500/3680/4940 ve100×2500; satır30–33 | Düşey/yatay uygulama yeri, adet/aralık, duvar kalınlığına bağlı kesit ve stok boyu |
| 3 | Veranda: flanşlı100×100×2500 2adet; kiriş100×100×4970 ve3500 birer adet; satır19–21 | Direk kesiti/boyu, kiriş hangi açıklıkta ve net kesim payları |
| 4 | Saçak omegası/sacı, alın V, aşık kapama U, köşebent, baş makas Z ve menfez; satır34–37,40–42 | Gerçek çatı kenarı/makas ilişkisi, stok boyu, bindirme ve yedek |
| 5 | Kapı/PVC; satır45–49 | Açıklık ölçüsünden sipariş ölçüsüne dönüşüm, açılış yönü ve ayrı ürün sayımı |

Excel sayıları gelecekteki projeye sabit adet olarak kopyalanmayacak. Önce kullanıcıdan alt çerçeve genişliği, kapı altında devam/kesinti, 2500mm stok ve artık/yedek bilgisi soruldu; yanıt bekleniyor. Bu bilgiler alınmadan otomatik üretim hesabı eklenmedi. Kapılı pano DEV-006 ve dolu stok DEV-025 bağımsız açık kalır. Kod5.9.36 ve canlı çizim korunur.

## 3 Ekim 2026 — DEV-026 alt çerçeve kapsamı onayı

Kullanıcı: alt çerçeve kapılı ve pencereli panolar dahil tüm duvarların altındadır; yalnız veranda kısmında yoktur. Hesapta kapı/pencere boşlukları duvar uzunluğundan düşülmeyecek. Veranda açık sınırları hariç tutulur; verandaya bakan gerçek ev duvarı tüm duvarlar kuralına dahildir. Bu karar yalnız uygulama kapsamını kesinleştirir. 60/100 mm kesit eşlemesi, 2500 mm stok boyunun genelliği, kesilen artığın başka duvarda kullanılması/ek yapılması, köşe-uç boyları ve yedek henüz kullanıcı tarafından doğrulanmadı. Sevk adedi uydurulmadı; uygulama5.9.36 ve çizim değişmedi. Sıradaki adım stok/artık/yedek kurallarını almak; diğer açık işler korunur.

## 3 Ekim 2026 — 5.9.37 / DEV-026 alt çerçeve hesabı

Kullanıcı sabit stok boyunu 250cm olarak 60 ve100mm için doğruladı. Aynı kalınlıktaki tüm duvar uzunlukları birlikte toplanır, toplam/250 yukarı yuvarlanır; her mevcut kalınlık grubuna1yedek eklenir. İç/dış ayrımı yapılmaz; kapı/pencere boşlukları düşülmez, veranda açık sınırları hariçtir. 3350cm→14+1=15; kullanıcının örnekteki3250 ifadesi13+1=14eder. Artıklar başka duvarlarda kullanılabilir; ayrı ayrı duvar yuvarlaması veya pano kesim algoritması uygulanmaz.

Uygulama ölçü tabanı duvar düğümleri arası aks uzunluklarıdır; varsayımsal köşe payı düşülmedi. Kontrol Tuna JSON'unda100mm toplam3659,5cm→15+1=16 (Excel15);60mm toplam2143,5cm→9+1=10 (Excel10). 100mm farkının sebebi kesinleşmedi; Excel'e uydurmak için1yedek kaldırılmadı. Gerekirse referansın yedek ve uzunluk esasını netleştir. UI toplam/bölüm sonucunu, CSV/XLSX açıklaması formülü ve yedeği gösterir. Manuel toplam tekrar yedek eklemez; çizim değişirse eski karar geçersizdir. Tanımsız kalınlıklar onay bekler.

Kontroller: loading-frames sınır/yuvarlama/grup/manuel/eski karar; loading-list kapı/pencere ve veranda hariç kapsamı, JSON ve dışa aktarma; loading-stock regresyonu; verify-loading-xlsx alt çerçeve15+1 ve9+1 dahil geçti. Build başarılı. Sürüm5.9.37; package.json eski sürüm metadatası da eşitlendi. Canlı çizim ve yerel JSON değişmedi. DEV-026 alt çerçeve uygulandı; omega, veranda kirişleri ve çatı profilleri açık. Diğer açık işler devam eder.

## 3 Ekim 2026 — DEV-026 üst omega sınıflandırması

Kullanıcı kuralı: alt çerçeve tüm duvarların altında, üst omega tüm duvarların üstündedir. Alt çerçeve ürün ailesi yalnız duvar kalınlığıyla60/100olarak değişir. Üst omega hem kalınlık hem duvarın çatı/makas konumuyla seçilir:
- İç duvar üstü: duvar omegası.
- Baş makas/alın tarafındaki dış duvar üstü: baş makas omegası.
- Yan saçak tarafındaki dış duvar üstü: saçak omegası.

Bu üç üst ürün aynı hatta üst üste sayılmayacak; konuma uygun ürün seçilecek. Kullanıcı henüz baş makas omegasının Excel'deki Baş Makas Z Sacı ile aynı ürün olduğunu söylemedi; eşleştirme varsayılmayacak. Duvar omegası2500/3680/4940boylarının seçimi, baş makas/saçak stok boyları ve yedek kuralları açık. Karma/yavru çatı alanlarında yerel çatı ilişkisi gereklidir; yalnız global yönle tüm dış duvarları sınıflandırmak yeterli sayılmaz. Çatı bilgisi eksikse ürün türü uydurulmayacak.

Karar kaydedildi; otomatik sevk reçetesi henüz eklenmedi. Uygulama5.9.39, canlı plan ve kullanıcı JSON'u değişmedi. DEV-026 sıradaki adım baş makas ürün eşlemesi ve farklı boy seçimini netleştirmek; diğer açık işler devam eder.
