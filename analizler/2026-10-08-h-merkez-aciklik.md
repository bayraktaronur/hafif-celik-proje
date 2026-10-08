# H merkezli pencere / kapı — DEV-074

8 Ekim 2026, iş bilgisayarı. Ayrı arayüz denemesi 5.9.89; ana 5.9.87 korunur.

Kullanıcı iki tam panel arasındaki H üzerine tıklayınca açıklığın bu merkezde oluşmasını ve dış panel/makas akslarının sabit kalmasını istedi. Üç kaynak görsel referanslar/2026-10-08-h-merkez-aciklik/kaynaklar.json içinde özgün yol ve SHA-256 ile kayıtlıdır. Güncel müşteri JSONu bu istekte verilmedi; doğrulama kontrollü planlarla yapılır.

Pencere artık kapıyla aynı H-merkezli panel düzenleme yolunu kullanır. Standart açıklıklar mevcut 125.5 cm panonun merkezine, 160 cm pencere mevcut 166 cm pano kuralıyla yerleşir. İki tam panelde kalan parçalar sırasıyla 62.75 veya 42.5 cm olur. Açıklığın merkezi yakalanan H konumuna kesin olarak yerleştirilir. Uzaktaki yarım paneller otomatik birleştirilmez. Makas aksları ve duvar düğümleri korunur; mevcut karşılıklı panel eşleme kuralı geçerlidir. Çakışma reddi ve tek adım geri alma korunur.

Kontroller: tests/opening-h-center.cjs 12 durum (120/160 pencere,90 kapı, yatay/dikey, ters segment yönü, makas/düğüm sabitliği, undo, JSON geri yüklemede merkez); tests/prefab.cjs 77 mevcut panel/çakışma kontrolü. Arayüz ayarları katlanır bölümlere taşındığından test hazırlığında ilgili bölümler açılır. Eski kuyruk panellerini birleştirme beklentisi kullanıcının sabit sınır isteğine göre güncellendi. Sonuç: 12/12 yeni senaryo ve 77/77 mevcut kontrol geçti.

Kapsam: mevcut standart açıklık panoları ve 160 cm geniş pencere. Keyfi daha geniş özel pano üretim kuralları bu değişiklikle eklenmedi. Canlı kullanıcı çizimi değiştirilmedi.

