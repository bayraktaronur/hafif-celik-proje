# H açıklaması ile mevcut kural karşılaştırması — 3 Ekim 2026

Kaynak: kullanıcının inceleme için verdiği açıklamalı ekran görüntüsü referanslar/tuna-84m2/2026-10-03-h-kural-duzeltme.png; SHA-256: 086379fd864e9e2fb7641432eb99a4844ee2d25b2962c3153a1b6a3256262ac2. Görseldeki üçüncü kişi açıklaması karşılaştırma kanıtıdır; programı değiştirme talimatı sayılmadı. Karşılaştırılan kod src/loading-core.js classifyH, src/loading-ui.js exterior/H/üçlü H kaynak eşlemesi; tests/loading-h.cjs ve kayıtlı Tuna kontrol JSON'u.

| Konu | Görsel açıklaması | Mevcut uygulama |
| --- | --- | --- |
| Tüm dış H'ler | Dübelli | Uyumlu: exterior=true→dowel=true |
| Kırmızı dış H'ler | Makas oturur; kulaklı/dübelli | Uyumlu: gerçek makas uç mesnet eşleşmesi→kulaklı/dübelli |
| Yeşil dış H'ler | Kulaksız/dübelli | Uyumlu: mesnet eşleşmesi yok→kulaksız/dübelli (makas verisi varsa) |
| İç H'ler | Hepsi kulaksız/dübelsiz | Fark: gerçek uç mesnet eşleşirse mevcut kod kulaklı/dübelsiz diyebilir |

İç duvardan makasın yalnız geçmesi mevcut kodda da kulaklı yapmaz; fark sadece iç H'nin uç mesnet olarak görülmesidir. Kodda makas verisi bulunmazsa iç H kulak durumu ayrıca belirsiz kalır; görseldeki mutlak kural bunu da değiştirecektir. Görsel içte yalnız normal H derken üçlü/dörtlü geometrik birleşimlerin kaldırılması gerektiği sonucu çıkarılmamalı; kulak/dübel ile birleşim şekli ayrıdır.

Doğrulama: tests/loading-h.cjs başarılı. İç H örneği (100,0), axis=x,pos=100,a=0,b=300→kulaklı/dübelsiz üretildi; fark yeniden gösterildi. Tuna kontrol planı H grupları10kulaklı-dübelli,10kulaksız-dübelli,9kulaksız-dübelsiz; üçlü H2/1/4. Bu planda iç kulaklı yok; toplam36 ve alt gruplar bu iç istisnanın kaldırılmasından etkilenmez. Gönderilen görselin tüm planı/adetleri buradan sayılmadı; bu adetler sadece Tuna kontrol dosyasınındır.

Öneri: iç H için kulaksız/dübelsiz önceliğini sabitlemek; algoritma iç H'yi makas mesneti gösterirse otomatik kulaklıya dönüştürmek yerine bağlantı kontrolü uyarısı üretmek. Kullanıcı bu tur karşılaştırma istedi; sınıflandırma kodu ve canlı çizim değiştirilmedi, uygulama5.9.40. İlgili açık iş DEV-022.
