# Egepen sürme aktarımı — sürüm 204

## 26 Kasım 2026 — JOINERY-204 profil aktarımı · Taslak 204

Egepen standart çift ray sürme: Doğrama Atölyesi kaynak kesitleri ve yerleşim formülleri aktarıldı. 12660 kasa, 12671 kanat, 12648 çıta, 24 mm cam; mm kesitleri esnetilmez. Sekiz mevcut sürgü nesnesi gösteriliyor. 3B Model > Sürgülü doğrama detayları kesit ve net profil listesi/CSV verir. Bu liste kaynak paylı kesim siparişi değildir.

Kontroller: egepen-sliding-check.cjs sekiz nesne, üç farklı ölçü, sonlu geometri, çift gösterim yok, 47 yükleme satırı/proje/çatı özeti aynı, detay ekranı/CSV/Escape geçti. legacy-steel-door-check.cjs özgün çelik kapı ve açık PVC seçim önceliği geçti. Yerel teslim outputs/Tuna92-montaj.html; son müşteri çizimi GitHub kapsamı dışında korunuyor.

JOINERY-204 kısmen tamam: standart sürme profil/3B aktarımı bitti; üretici donanımı (kol/kilit/tekerlek/conta/fırça), kaynak ve imalat payları, tam/yarım camlı PVC kapıların özgün sistem aktarımı AÇIK. Bunlar mevcut temsilî kapı geometrisinden üretim onayı çıkarılarak tamamlanmış sayılmaz. Kaynak ve kapsam: analizler/2026-11-26-egepen-surme-aktarimi.md. Diğer açık işler korunur.

Kaynak: kullanıcının Doğrama Atölyesi dograma_atolyesi/design.js, families.js, series-data.js. Yalnız surme kesit verisi seçildi. build fonksiyonu özgün assembly yerleşimini kullanır; profil halkaları dört gönye düzlemi arasında uzatılır. Cam ve ara boşluklar kaynak montajından gelir. Kaynak eklentideki katalogdan çıkarılmış konturlar taşınmıştır; imalat sertifikası veya üreticinin doğrulanmış eksiksiz BIM modeli değildir.

Doğrulanan referans: numuneler/Surme.pdf sayfa 4 TK2023/04 kasa-kanat kesiti; sayfa 1 US2024/12 donanım işlemleri. Resmî ürün: https://www.egepen.com.tr/surme-sistemi-129 . Standart çift ray ailesi seçildi; Legend Plus/HS76 ile otomatik karıştırılmadı.

Her doğramada 5744 yüzey ve 20 profil elemanı; net uzun/kısa uç boyları gösterilir. Boy/adet hesabına yeni profil listesi eklenmedi; mevcut prefabrik reçeteleri korunur. Testler kullanıcı çizimini yerel fixture olarak alır, test kaynakları müşteri verisi içermez.

SHA256 kaynak manifesti:
```json
{
  "series-data.js": "ab893e4b991427e39e4911b676baa37522f85b875ec930784362d40f4dade23e",
  "families.js": "a017b6402e6d511399f7cced97752312ce34f59ec0c9ea78808b897b62759ee0",
  "design.js": "d020eb20ed5812060650169d0b504eb56b4a660e93dc7954df234b6b98adc9ae",
  "legend.rb": "5210eb3c74664d6c7a7555f4b3e0fe589f96c5d43e9d1a0b9b5cb8a1c93ec866",
  "numuneler/Surme.pdf": "e5f447cff26fa5b8da4f4f7fe5088e1c6d13d06b14b18d85953e1bf54abd34cf"
}
```
