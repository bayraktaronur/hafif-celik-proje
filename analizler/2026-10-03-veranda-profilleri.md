# Veranda direk ve kiriş kuralı — 3 Ekim 2026

Kaynak: kullanıcı açıklaması ve referanslar/tuna-84m2/2026-10-03-veranda-profil-kesim-aciklamasi.png. Özgün dosya: C:/Users/obayr/AppData/Local/Temp/codex-clipboard-89aa99b8-73ae-41df-9cbb-0e6f03b1f639.png
SHA-256: c54ce83c6bc8f5a3f90fb77ef9c168ce101141c4c69988a06c65df45ec1bd647

Kullanıcı verandada her zaman100×100mm flanşlı profil direk kullanıldığını doğruladı. Kesit geneldir; boy/ara direk aralığı henüz genel kural değildir.

Görseldeki bu proje için:
- Ön kiriş100×100×4970mm tek parça olarak listeye yazılır.
- Sağ yan100×100×2520mm ve sol yan100×100×640mm, bir adet100×100×3500mm stoktan kesilerek kullanılır.
- Toplam kesim3160mm, nominal artık340mm; testere kaybı ayrıca verilmedi.
- Dolayısıyla bu üç yerleşim parçası iki sevk ürünüdür:4970mm1adet ve3500mm1adet. Kesim parçası ve sevk stoku ayrı tutulmalı;3parça için3stok sayılmamalı. 3500mm her projede sabit stok boyu varsayılmaz.
- İki flanşlı direk görselde100×100×2700mm yazıyor. Önceki Excel referans satırı19 ise100×100×2500mm2adet. Bu boy farkı kullanıcıyla netleştirilmeli; bina yüksekliğine otomatik200mm ekleme/düşme yapılmaz.

Kod5.9.39 ve çizim değişmedi. Yeni genel kiriş stok/kesim kuralı, direk boyu, yedek ve ara direk seçimi henüz tamamlanmadı. Omega boy seçimi ek proje/Excel gelene kadar ertelenmiş olarak kalır.

## 3 Ekim 2026 — 5.9.40 / DEV-026 veranda direk boyu

Kullanıcı her binada direk boyunun bina yüksekliği olmasını, özel durumlarda elle müdahale etmeyi istedi. Çizimdeki serbest veranda düğümleri100×100mm flanşlı profil olarak otomatik sayılır; boy bina yüksekliği×10mm. Tuna2adet100×100×2500mm, Excel satır19ile uyumlu. Otomatik yedek eklenmedi, ara direkler kendiliğinden üretilmedi. Kiriş genel reçetesi bu değişiklikte uygulanmadı.

Yükleme satırı Düzenle alanında direk boyu mm olarak değiştirilebilir; değişiklik satırdaki tüm direklere uygulanır. Miktar/gerekçe ve boy JSON'da korunur; çizimde direk geometrisini değiştirmez, sevk ölçüsüdür. Boy2500dışındaysa Tuna2500referansı kaldırılır. Bina yüksekliği değişirse eski gruba ait karar orphan olarak korunur; yeni gruba sessizce taşınmaz. Aynı grubun çizimi değişirse eski manuel karar geçersiz olur.

Build, loading-list, loading-posts (2direk,2500otomatik,2700manuel,JSON,2800yeni bina boyu) ve verify-loading-xlsx geçti. Uygulama5.9.40; canlı çizim ve yerel JSON korunmuştur. Omega boyları ertelenmiş; kiriş stok genellemesi, ara direk ve yedek kararları ile diğer açık işler sürer.

## 3 Ekim 2026 — DEV-026 yan kirişleri ayrı listeleme onayı

Kullanıcı2520mm ve640mm yan kirişlerin ayrı ayrı yazılmasının da doğru olduğunu onayladı. Bu proje için100×100×4970mm1adet,100×100×2520mm1adet ve100×100×640mm1adet ayrı parça listesi geçerlidir. Önceki3500mmtek stoktan yanları kesme seçeneği zorunlu değildir; projeye ait alternatif sevk biçimidir. Aynı ihtiyaç hem3500stok hem2520/640parçaları olarak çift sayılmayacak.3500sabit/genel stok standardı çıkarılmadı.

Kiriş boyları şu anda kullanıcı açıklamalı imalat görselinden onaylıdır; tüm projelerde aks ölçüsünden net boy dönüşümü, uç bağlantı payları ve yedek kuralı henüz kesinleşmedi. Bu onay otomatik geometri/kesim formülünü doğrulamaz. Uygulama5.9.40 ve canlı çizim değişmedi. Sıradaki adım net kiriş boyunu uç bağlantılarından türetmek; diğer açık işler korunur.

## 3 Ekim 2026 — DEV-026 kiriş bağlantısı ve kesim payı

Kullanıcı direklerin her projede100×100mm olduğunu, yalnız boyun bina yüksekliğiyle değiştiğini tekrar doğruladı; mevcut5.9.40direk kuralı uygundur. Yeni açıklamalı görsel: referanslar/tuna-84m2/2026-10-03-veranda-kiris-pay-ornek.png (bu yeni örneğin Tuna ile aynı proje olduğu varsayılmadı; referans klasöründe saklandı). Özgün dosya C:/Users/obayr/AppData/Local/Temp/codex-clipboard-47cccf84-9cd6-4d4d-a358-458fcec64ffe.png; SHA-256: 3eb39dc6940ed2cc5f21c1a4535c4fd9631e9e681628309a5bd481764ad4797e.

Görsel notu kirişlerin direklerin arasına gireceğini ve her kiriş için+10cm kesim payı verileceğini açıklıyor. Bu toplam100mm/parça boy payıdır; her uca100mm veya fazladan1adet yedek olarak yorumlanmaz. Görselde kiriş1880/2560/5550mm; direk2800mm yazıyor. Yazılı kiriş boylarının100mm payı içerip içermediği henüz açık değil; kullanıcıya bu ayrım sorulacak. Pay iki kez eklenmeyecek, önceki4970/2520/640onaylı değerleri bu açıklama ile sessizce değiştirilmeyecek. Direkler arası net açıklık ve sevk/kesilecek boy ayrı tutulmalı; duvara bağlanan uç geometrisi ayrıca doğrulanmalıdır.

Karar ve görsel kaydedildi; otomatik kiriş hesabı henüz değiştirilmedi. Uygulama5.9.40ve canlı çizim korundu. Omega boyları ertelenmiş; diğer açık işler devam eder.
