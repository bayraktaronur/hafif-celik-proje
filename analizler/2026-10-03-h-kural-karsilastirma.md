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

## 3 Ekim 2026 — 5.9.41 / DEV-022 iç H kuralı uygulandı

Kullanıcı tüm iç duvar H'lerini şimdilik kulaksız/dübelsiz olarak sabitlemeyi onayladı; iç makas altında kulaklı/dübelsiz kullanım ileride ayrı kararla revize edilebilir. classifyH iç birleşimde makas konumundan ve veri eksikliğinden bağımsız ear=false,dowel=false döndürür; kural kimliği h-interior-earless-no-dowel-v2. Dış gerçek uç mesnet ve dübel hesabı değişmedi. H/üçlü/dörtlü birleşim şekilleri ve U/köşe geometrisi korunur. İç/dış birleşimi exterior olarak sınıflanan dış duvar birleşimi dış kurala tabidir.

UI açıklaması, plan H etiketleri ve Excel sınıfları aynı hesabı kullanır. Kural kimliği değiştiği için eski iç H manuel miktar kararları otomatik geçerli sayılmaz; eski karar denetimi korunur. İç kulaklı istisnası gelecekteki açık ürün kararıdır; mevcut sürümde uygulanmaz. Kullanıcı bu tur mesnet uyarısı istemedi; yeni uyarı eklenmedi.

Build, loading-h (iki yön, iç gerçek mesnet/mesnetsiz/verisiz kulaksız, dış regresyon), loading-list ve verify-loading-xlsx başarılı. Tuna H toplam36ve alt grupları değişmedi: H10/10/9; üçlü H2/1/4. Uygulama5.9.41; canlı çizim ve yerel JSON korunmuştur. DEV-022 mevcut iç sınıflandırma düzeltmesi tamam; gelecekte iç mesnet kulak revizyonu ve diğer açık işler korunur.

## 3 Ekim 2026 — DEV-022 üçlü ve dörtlü H kapsam teyidi

Kullanıcı tüm H kurallarının üçlü ve dörtlü H'leri de kapsadığını açıkça doğruladı. H/H3/X aynı sınıflandırmadan geçer: tüm iç birleşimler kulaksız/dübelsiz; dış birleşimler dübelli, gerçek makas uç mesnedinde kulaklı, diğer dış birleşimler kulaksız. Dış duvarla birleşen iç duvarın ortak birleşimi dış konum olarak değerlendirilir. Birleşimin üçlü/dörtlü şekli korunur, normal iki yönlü H'ye dönüştürülmez.

src/loading-ui.js içindeki ['H','H3','X'] ortak classifyH çağrısı kontrol edildi;5.9.41 bu kapsamı zaten uygular. Yeni uygulama değişikliği/sürüm artışı gerekmedi. Bu kayıt kalıcı kullanıcı teyididir; diğer açık işler ve canlı çizim korunmuştur.
