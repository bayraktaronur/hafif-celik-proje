# DEV-075 — Gerçek planda yatay H pencere yerleşimi

Kaynak: Yeni proje (12).json (5.9.89 kaydı) ve iki kullanıcı ekran görüntüsü. Özgün yollar ve SHA-256: referanslar/2026-10-08-yatay-h-pencere/kaynaklar.json. Orijinaller korundu.

Neden: makas yönüne bağlı paralel duvar eşlemesi, H merkezli pencere için karşı duvarın panel sınırlarını da değiştiriyordu. e18 alt duvarındaki313.75,439.25,564.75,690.25,1066.75 ve1192.25 noktalarında karşı duvardaki mevcut açıklıklardan dolayı işlem reddediliyordu. Dikey duvarlarda aynı eşleme devreye girmiyordu.

5.9.90 düzeltmesi: standart pencerenin H merkezli panosu yalnız seçilen duvarda düzenlenir; mevcut160cm pencere zaten bu yerel yöntemi kullanıyordu. Karşı duvarın panelleri/açıklıkları, duvar düğümleri ve makas aksları korunur. Kapıların mevcut eşleme davranışı bu düzeltmede değiştirilmez. Aynı duvardaki gerçek açıklık çakışması yine reddedilir.

Kontroller: tests/opening-h-real-project.cjs dağıtım HTMLinde gerçek planın11alt H noktasını; tam merkez, diğer duvarlar/açıklıklar ve makasların değişmemesi, tek adım geri alma, JSON yeniden açma ve gerçek aynı duvar çakışmasını denetler. tests/opening-h-center.cjs12yön/ölçü senaryosu, tests/prefab.cjs77regresyon.

Ayrı arayuz-deneme/codex/arayuz-duzeni sürümü; ana5.9.87 değişmedi. Canlı çizim değiştirilmedi.
Sonuç: gerçek plan 11/11, yön/ölçü 12/12, prefabrik regresyon 77/77 geçti.
