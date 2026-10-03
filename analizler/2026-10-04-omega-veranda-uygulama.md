# Omega ve veranda kirişleri — 4 Ekim 2026 / 5.9.44

Kaynak kontrol planı: cizimler/2026-10-02-tuna84-dwg-esleme-taslak.json
SHA-256: 43862690c526c8ac6a13de8f8242fcee9d9f4a7c63d6c57e80b600efc92b719f
Excel kaynak ve hash: analizler/2026-10-03-bas-makas-z-omega.md. Bu tur özgün Excel değiştirilmedi; daha önce doğrulanmış referans değerleri kullanıldı. Canlı çizim ve kullanıcı JSON'u değiştirilmedi.

## Uygulanan kapsam
- İç duvarlar ve veranda oda sınırına komşu ev duvarları duvar omegası. Veranda yan kirişleri duvar omegası, makasa paralel ön hat baş makas omegası. Bir hat bir kez sayılır. Oda sınırının alt segmentleri de eşlenir.
- Dış duvarlar makas doğrultusuna paralelse baş makas, dikse saçak omegası. Çatı bölümü varsa bölüm yerel yönü; yoksa planın üretim yönü kullanılır. Farklı çatı yönlerinin çakışması, kapsanmayan/eğik hat belirsizliği otomatik adet yerine yön kontrolüne bırakılır.
- Her ürün/kalınlık grubunun toplamı/250cm yukarı yuvarlanır; yedek0. Duvarlarda aks boyu, kirişlerde yüzler arası net boy kullanılır. Kapı/pencere düşülmez.
- Baş makas Z ayrı satır, geçici1:1 omega sevk adedi. Omega manuel toplamı değişirse Z güncellenir; eski geometri düzeltmesi geçersizse Z de otomatik sevk sayısı vermez. Z ayrıca gerekçeli manuel düzeltilebilir. Tuna-41 yalnız Z'ye bağlanır, omega ile iki kez referans adedi toplanmaz.70×2500 referans ürün ölçüsü korunur.
- Veranda kirişi her parçada100×100; serbest direk ucunda50mm, duvara bağlı uçta duvar yüzü payı düşülür. Net+100mm sevk boyu. Eğik veranda net hesabı otomatik yapılmaz. Çizim boyu değişmez. Liste/CSV/XLSX net, kesim payı, sevk boyu ayrı alanlar; adet/yedek boy payından etkilenmez.

## Tuna taslağı sonuçları
| Kalem | Toplam cm | Adet | Eski Excel |
|---|---:|---:|---:|
|60lık duvar omegası|2143,5|9|Özel boylu eski sayım doğrudan kıyaslanmaz|
|100lük duvar omegası (veranda dahil)|1138|5|4|
|100lük baş makas omegası|1767|8|Ayrı satır yok|
|Baş makas Z|Omega ile bağlı|8|9|
|100lük saçak omegası|1568,75|7|8|

Kiriş net/sevk mm:4970/5070,2527,5/2627,5,645/745; her biri1adet, yedek0. Eski açıklamalı görselde yanlar2520ve640mm: mevcut taslakla7,5ve5mm fark var. Referans boyuna zorlanmadı, taslak geometri değiştirilmedi. Tam imalat eşitliği iddia edilmiyor; DEV-011 kapsamında bu farklar açık.

## Kontroller
node tools/build.cjs; tests/loading-top.cjs, loading-omega.cjs, loading-list.cjs, loading-h.cjs, loading-frames.cjs, loading-posts.cjs ve tests/verify-loading-xlsx.py geçti. Bağımsız Edge oturumunda kontrol JSON'u kullanıldı. Görselde net/pay/sevk ve ayrı adet/yedek alanları kontrol edildi. artifacts/ geçici test çıktıları Git'e eklenmez.

## Açık noktalar
DEV-028 özel ölçü sekmesi; DEV-011 referansla kalan geometri/adet farkları; farklı/çakışan çatı yönleri ve eğik veranda için manuel kontrol. Omega yedeği onaylanmadı, kendiliğinden eklenmez. Diğer eski açık işler korunur.
