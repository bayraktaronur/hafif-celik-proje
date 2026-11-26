# Taslak 212: pencere modeli eşlemesi ve baş makas alt dönüşü

Kullanıcı DWG açılış türünün korunmasını ve sağladığı özgün sistemlerin kullanılmasını istedi. Eski tam anahtar eşleşmesi 120x100,119x160,160x160 ölçülerini şematik çizime düşürüyordu. Sağlanmış 120x120,120x180,rev6 160x180 STL kaynaklarından ölçü uyarlaması eklendi. Kesit derinlik koordinatları, malzeme/topoloji, kasa/orta birleşim çevresindeki sabit bölgeler korunur; açıklık aralıkları ve pano uyarlanır. Tam eşleşen kaynak değişmez. Sürgülüye dönüştürme yok; mevcut sürgü modülü ayrıdır. Yeni boyutlar özgün dosyanın birebir kopyası değildir; adaptedFrom ve görünüş notunda belirtilir. Marka/seri teyidi olmayan kullanıcı STL dosyalarına üretici adı atanmamıştır. Bu görsel uyarlama yeni üretim reçetesi onayı değildir.

211 regresyonu: baş makas taşması da yatay saçak gibi çizilmişti; üçgen boşluk ve yatay raf oluşuyordu. Dikdörtgen beşik çatıda yerel X dışında kalan alın dönüşleri tekrar eğimli alt düzleme bağlanır. Yan saçak yatay kalır. Omega birleşim çizgisi korunur. Tam özgün saçak büküm profili kaynak işi açık kalır.

Kontroller: test-mounted211.cjs alın dönüşü eğimini de kontrol edecek biçimde güncellendi; test-window-adaptation212.cjs kaynak değişmezliği, topoloji/malzeme/derinlik, birebir eşleşme ve sürgü ayrımını doğrular. İkisi geçti. Yerel kayıtlı planda 7 pencerenin tümü STL tabanlı; şematik pencere geri dönüşü yok. Tüm proje, çatı modeli ve 61 yükleme satırı önceki kayıtla birebir aynı; yeniden açmada liste korundu. Tarayıcı hatası yok. Üst/alt ve karşı cephe görüntüleri incelendi. Eski çizim dosyasına dokunulmadı; ayrı yerel 212 HTML. Müşteri kayıtları gönderilmez.

Kaynak SHA-256:
taslaklar/odak-atolyesi/mounted-soffit.js 93bb6a38a375b4a7431894549ffac2bf8638fb5dc4e839e6a27a91a180bc7ad3
taslaklar/odak-atolyesi/pvc-opening-3d.js 0a38604164f05a8b2e0bffb409c9c5eb9efcb6378bd6b6027a6b4dbb777ffc86
taslaklar/odak-atolyesi/mounted-details-build.cjs 5f15fbc55859f3181942a86cda0a85a575b2cae01ac860204c7bbe1b0b820894
taslaklar/odak-atolyesi/single-engine.js e9ab83d93b189ec4726b1ca234c182d628e3375723c3bba03dbfa910152bb37a
taslaklar/odak-atolyesi/single-storey.js 2ae0a73356f8bda8ece51a5b8666d60d6d1174ecda1fd8d136cdb2320202243c
