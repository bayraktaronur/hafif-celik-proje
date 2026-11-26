# Çatı → yükleme listesi aktarımı · 208

## Kapsam ve kaynak
`src/loading-ui.js` mevcut çatı kesim, makas yerleşim ve mahya sonuçlarını yükleme listesine aktarmıyordu. `src/roof-core.js` sandviç panel aşık aralığını tanımlamıyor; bu kural tahmin edilmedi.

## Değişiklik
`loading-roof-bridge.js` mevcut RoofStudio modeli ve RoofWorkflow makas yerleşimlerini salt okunur olarak tüketir. Çatı satırları, kaynak bilgisi ve birimiyle listede/CSV/Excel içinde görünür. Kesim parçası stok levhası; mesnet açıklığı imalat makas boyu olarak sunulmaz. Sevk adedi açık kural veya gerekçeli manuel doğrulama olmadan verilmez. Manuel miktar, çizim değişince eski kabul edilir. Mevcut fire ikinci kez eklenmez.

## Kontroller
`loading-roof-check.cjs`: kaynak ve eski satırların değişmezliği, miktar gruplama, mahya/katman aktarımı, manuel değer, eski değer ve yetim eşleştirme kontrolleri geçti. İzole tarayıcıda aynı kayıtla önce/sonra proje, çatı modeli ve önceki yükleme satırları eşitliği doğrulandı. Çatısız, trapez, OSB örnekleri; CSV/Excel indirme; gerçek Kaydet/yeniden açma; geri al/yinele başarılı. Tarayıcı hatası yok. Müşteri verili test çıktıları yalnız yerelde.

## Açık kurallar
- Sandviç panel aşık aralığı; ilk aralık ve uç payının uygulanması.
- Mahya stok boyu, bindirme ve yedek.
- Kaplama kesim boyundan sipariş boyuna dönüşüm; çok kısa kesim parçalarının imalat değerlendirmesi.
- Baş/orta makas sınıflandırması, imalat boyu ve mesnet uygunluğu.

ROOF-208 aktarımı tamam; kesin sevk/maliyet eşleştirmesi bu kurallar için bekliyor. GABLE-207-AUDIT ayrı açık iş olarak korunur.
