# DEV-083 — Özel veranda / kutu profil — 5.9.98

Kullanıcı beşik veranda ve 100×100×2 mm varsayılan dikmeler istedi. Üst ön yatay kiriş yalnız açık Evet seçimiyle eklenir; dikme ve kiriş eni/derinliği/et kalınlığı bağımsız değişir. Plan veranda ölçüleri özel cm olabilir; mevcut Net ölçüyü düzenle aracı kullanılır, sonra çatı Veranda oluştur/güncelle ile yenilenir. Çatı özelliklerinde profil alanları mm'dir.

Kaynak: C:/Users/ONUR/Downloads/84m2 gülsüm hanım kontrol (1).json
Depo: cizimler/gulsum-84m2/veranda-5.9.97.json
SHA256: 30299DBBBBEF756D133B66B7FCEE50AA7D66F40183A078CD03961518A0A12CEB
Dört görsel: referanslar/gulsum-veranda/kaynaklar.json (kaynak yolları/hashler).

Gerçek veranda ön sınırı502 cm, sağ ev bağlantısı507 cm olduğundan eski dikdörtgen koşulu reddediyordu. Bağımsız ön kenardan mesnet eni ve plandan derinlik alınır; bina düğümleri taşınmaz. Ana çatıyla paralel beşikte mahya doğrultusunda kök aramak başarısız oluyordu; yatay mahya yönü ve karşı eğim olduğunda ana saçak kotunda paralel beşik aynı yüzey birleşim grubuna katılır. Çapraz beşik ve tek eğim kuralları korunur.

Ön iki dikme ve isteğe bağlı aradaki net yatay kiriş çatı planında ve3Bde çizilir. Kesit/et/net boy/adet genel malzeme listesi, çatı Metraj/kesim veCSVde bulunur. Kiriş üstü saçak mesnet seviyesinde; dikmeler kiriş altına kadar ölçülür. Metal dış yüzeyi gösterilir, et kalınlığı kesit kaydıdır; iç boşluk modellemesi/ağırlık hesabı yoktur. Net boyda kaynak, taban plakası, ankraj veya montaj payı yoktur. Taşıyıcı yeterlilik hesabı yapılmadı. Ön alın kapaması 3Bde gösterilir.

Test: veranda-custom gerçek JSON beşik üretimi, varsayılan2mm, kiriş yok/var,120×80×3özelkesit, metraj, negatifkesit reddi,undo/JSON geçti. veranda-joins çaprazbeşik, eğimdevamı,sundurma,kot veanaçatıgüncellemesi geçti; eski rz_h alanı güncel rz_wallTop ile eşlendi. roof.cjs19sayısalgeometritesti geçti; tarayıcı bölümü eski testin artık devre dışı olan rz_e0 alanını doldurması nedeniyle tamamlanmadı. Genel paketin tamamı geçti iddiası yok.3B görsel incelendi: analizler/2026-10-09-veranda-3b.png.

Ayrı örnek: cizimler/gulsum-84m2/veranda-kirisli-ornek-5.9.98.json,100×100×2 dikme veönkiriş.Etkin kullanıcı sekmesine yüklenmedi/orijinal korundu. Bu sürüm öntek kiriş veiki ön dikmeyi kapsar; yan kiriş/ara dikme yerleşimi, çokgen verandaya özel karkas ve birleşim kesim detayları gelecekteki işlerdir. Ön kenarı bağımsız tanımlanmayan düzensiz şekil açık hata verir. Otomatik okuyucu ertelenmiş durumda,5.9.87yedekkorundu.