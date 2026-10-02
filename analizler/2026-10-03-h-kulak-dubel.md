# 5.9.29 — Makas altındaki H sınıflandırması / DEV-022

Kullanıcı kuralı (3 Ekim 2026): makas aksına gelen, makas altında makasa giren bütün H bağlantıları kulaklıdır. Bu bağlantı dış duvara denk geliyorsa kulaklı ve dübellidir. İç H için dübelsiz denmedi; makas dışındaki H için kulaksız/dübel reçetesi henüz verilmedi.

Yükleme listesi H, üçlü H ve dörtlü birleşim ailesinde bu özelliği ayrı sınıflandırır. Köşe ve U için aynı kural varsayılmaz. Mevcut makas analizindeki yön, konum ve açıklık kullanılır; koordinat eşleşmesine ek olarak açıklık sınırı ve bağlı bina kontrol edilir. Çatı bölümü varsa bölüm makasları kullanılır; mesneti doğrulanmamış makas olumlu sınıflandırılmaz. Çatı bölümü yoksa mevcut otomatik plan makasları esas alınır; bu fiziksel detay/çatı imalat onayı değildir. Eşleşme toleransı mevcut mesnet kontrolüyle aynı:0,6cm. Dış duvar kararı kalınlıktan değil bağlantı yerindeki duvarın `dis` özelliğinden gelir.

Kaynak durumuna dış duvar ve eşleşen makas bilgileri eklendi. Makas taşınması, dışlık ve yön değişiminde ilgili manuel miktar yeniden kontrol ister. Sınıflandırma sevk reçetesinin tamamlandığı anlamına gelmez: profil/net boy ve diğer ayrımlar açık. Eski genel H düzeltmeleri yeni ayrılmış gruplara sessizce dağıtılmaz; karşılıksız eski düzeltmeler bölümünde kalır.

## Tuna kontrol taslağı sonucu

Kaynak: `cizimler/2026-10-02-tuna84-dwg-esleme-taslak.json`. Canlı tarayıcı planı değiştirilmedi ve bu dosyanın en güncel müşteri planı olduğu iddia edilmez.

| Tür | Kulaklı ve dübelli | Kulaklı, dübel kararı bekliyor | Kulak/dübel kuralı bekliyor |
| --- | ---: | ---: | ---: |
| H | 18 | 8 | 3 |
| Üçlü H | 3 | 4 | 0 |

Toplam33 kulaklı eşleşme; bunların21'i dış duvarda,12'si iç duvarda.3 H'de olumlu makas eşleşmesi yok. Kaynak Excel'deki standart H kulaklı/dübelli10 adediyle otomatik sonuç18 aynı değil; Excel'e uydurulmadı. Farkın makas düzeni, eski liste veya ilave üretim koşulundan kaynaklanıp kaynaklanmadığı kullanıcıyla doğrulanmalı. Üçlü dış H3 ve iç H4 de yeni kurala göre sınıflandırılmıştır; eski Excel iç üçlüleri kulaksız yazıyor, bu fark da açık.

Kontroller: tests/loading-h.cjs iki yön, açıklık dışı, eksen dışı, mesnet belirsizliği, iç H dübelinin bilinmiyor kalması ve makas taşınınca karar geçersizleşmesi; tests/loading-list.cjs mevcut sayım/kayıt/CSV/geri alma regresyonları. Plan geometrisi değiştirilmez.

Sıradaki kararlar: makas altında olmayan H ve dış duvar H dübel kuralı; iç duvar dübel durumu; makasın başlangıç/bitiş akslarında ve iç bölmelerde fiziksel olarak H'ye giriş koşulları. DEV-006/011/012/021 açık.
