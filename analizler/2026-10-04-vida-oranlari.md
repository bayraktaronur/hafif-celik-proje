# Vida karşılaştırması ve geçici standart çatı hesabı — 4 Ekim 2026

## Kaynak ve kapsam
- Excel: `referanslar/tuna-84m2/SP - 202600185 - Tuna Pref. 84m².xlsx`, K1-280-10-6, B/C/D sütunları. SHA-256: a9b2946ca5ae6476b8334016a2a3c107e1d6d0bd0d3e4f870e2f76639beb0803.
- Tuna çizim eşlemesi: `cizimler/2026-10-02-tuna84-dwg-esleme-taslak.json`; önceki DWG karşılaştırması `2026-10-02-tuna84-karsilastirma.md`. Bu JSON'da çatı yok. Bu tur DWG yeniden çözümlenmedi; gerçek bağlantı noktalarından vida sayısı çıkarıldığı iddia edilmez.
- Çatılı ayrı yerel örnek: `Yeni proje (11).json`; değiştirilmeden `cizimler/2026-10-04-vida-karsilastirma-ornek.json` olarak kopyalandı. Her ikisinin SHA-256: 2c45a264202a0bd16f09e1684fe5fe9f5d365623d5e592c33c01ae3474d8c55c. Bu dosya Tuna planı veya son canlı tarayıcı planı ilan edilmez.

## Altı vida kalemi
| Satır / ürün | Excel adet | Karşılık ve gözlenen oran | Uygulama |
|---|---:|---|---|
|92 Yeşil alçıpan 3.5×35|500|13 levha ×3 m²=39 m²; 12,82 adet/m² veya 38,46/levha|Yalnız yeşil levhaya mı tüm tavana mı kullanıldığı doğrulanmalı; otomatik değil.|
|93 Saçak/dere kancası 3.9×25|800|8 saçak sacına bölünürse100/sac; fakat dere kancası da aynı vida kullanıyor|Tek payda doğrulanmadı; otomatik değil.|
|94 Betopan/kapı kolu 4.2×32|600|İki ayrı kullanım; 12 köşe kapaması ve kapılar var|Tek başına panel/kapı oranı uydurulmadı.|
|95 Prefabrik pencere 4.8×70|200|6 pencere:33,33/pencere; farklı pencere boyları var|Gözlenen ortalama; henüz otomatik değil.|
|96 Aşık 5.5×25|1000|30×4,2+55×3=291 m stok aşık;1000/291=3,436426 adet/m|Geçici otomatik.|
|97 Trapez/metal kiremit 5.5×60|1000|0,8×(24×5+3×3,05)=103,32 m² sac kapatma;1000/103,32=9,678668 adet/m²|Geçici olarak yalnız trapez çatı.|

C sütunundaki400/1000/1250 Adet ambalaj bilgisi sayımı çarpmaz; sevk adedi D'den alınır. 98.satır30çelik dübel vida satırlarına katılmadı. Excel'de vida yedeği ayrı belirtilmiyor; bu oranlar sevk miktarından türetilmiştir.

## Geçici uygulama
- Tek dikdörtgen beşik, trapez örtülü ve desteklenen aşık hesabı olan çatıyla sınırlı. OSB varsa aşık aralıklarının değişmesi stok boyunu ve aşık vidasını değiştirir.
- Aşık vidası: ceil(otomatik4200/3000stok toplam metre ×1000/291).
- Sac vidası: ceil(gerçek eğimli çatı m² ×1000/103,32).
- Sac referans alanı sevk kapatma alanıdır, doğrulanmış net çatı alanı değildir. Net eğimli alana uygulanması açıkça yaklaşık bir başlangıç kabulüdür. Stok aşık boyunda da bindirme dahil; bu katsayı bağlantı başına montaj vida sayısı değildir. Bir örnekten genel fiziksel kural kanıtlanamaz.
- Aynı çatı alanını her vida türüne uygulamak yerine iki ayrı payda kullanıldı. İlave paket yuvarlaması ve yedek eklenmedi. Adet/Yedek sütunları ayrı, referans yedek ayrımı bilinmiyor açıklaması var.
- Manuel düzeltme mevcut mekanizmayla mümkündür; çatı/katsayı değişirse eski düzeltme geçersizleşir. Destek dışı çatıda bu iki otomatik satır üretilmez.

## Çizim karşılaştırması
Tuna kontrol JSON: çatı eksik olduğundan vida adedi doğrulanamaz.
Ayrı çatılı örnek:136,922786 m² eğimli alan;216 m aşık stok;5.5×25=743 adet,5.5×60=1326adet. Excel'e göre sırasıyla−257 ve+326. Bu farklar farklı çatı/OSB/geometri nedeniyle beklenebilir; Tuna Excel ile aynı planın sayımı olarak sunulmaz.

## Kontroller / açık işler
5.9.51: screw-ratio (referans1000,ölçekleme,manuel,eski düzeltme), loading-screws (arayüz,çatı yok/destek dışı,XLSX), loading-list,purlin-stock geçti. Excel tekrar okunarak743/1326 ve ayrı yedek açıklamaları doğrulandı; ekran görüntüsü incelendi. Geçici artifacts depoya alınmaz.
Diğer dört vida için kullanım dağılımı, daha fazla proje ile katsayı sağlaması ve gerçek bağlantı adedi açık. Kullanıcının talebiyle DEV-033/034 diğer çatı/montaj detayları6Ekim2026'ya kadar öncelik dışı; otomatik hatırlatma kurulmadı.

## 4 Ekim 2026 — Alçıpan vidasının gerçek kullanım kapsamı
Kullanıcı açıklaması: standart tavanlar geçme sistemdir, ileride tanımlanacak tavan mini H profiline geçer; standart tavanlarda vida kullanılmaz. Duvar alçıpanı seçilmemiş bu projede3,5×35vidalar banyo/WC yeşil duvar kaplamasına aittir. Beyaz/yeşil tavan ve standart veranda tavanı alçıpan vidası hesabına katılmaz. Bu, tavan levhası hesabını kaldırmaz.
Excel92.satır500vida /13yeşil levha(39m²) oranı duvar vidası katsayısı olarak kullanılamaz:13levha tavan ve veranda paylarını da içerir. Önceki rapordaki12,82vida/m² ve38,46vida/levha yalnız sayısal bölümdü; yeni açıklamayla geçerli kullanım katsayısı olmadığı kesinleşti. Referansın yalnız yeşil duvar net alanı doğrulanıp500ile karşılaştırılmalı; henüz adet/m² veya bağlantı başına vida kuralı onaylanmadı. Diğer oda duvarları seçildiğinde kullanılacak vida türü/adedi ayrıca netleşecek.
Mevcut5.9.53yükleme modülünde otomatik alçıpan vidası yok; yalnız aşık/trapez vidaları otomatik. Dolayısıyla tavanlardan türetilmiş hatalı otomatik vida miktarı mevcut değildir. Bu tur kod değişmedi.
