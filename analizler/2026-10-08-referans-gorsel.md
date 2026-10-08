# DEV-077 — Çizim yanında referans görsel / 5.9.91

Kullanıcı ekran görüntüsünü yapıştırarak veya görsel dosyasını açarak aynı ekranda referansa bakıp çizmek istedi. Ayrı arayuz-deneme dalında araç çubuğuna Referans görsel eklendi.

- PNG/JPG/WebP/BMP dosya seçimi;30MBüst sınır ve dosya çözümleme kontrolü.
- Ctrl+V görsel yapıştırma, panel içine dosya bırakma.
- Başlıktan taşıma, köşeden pencere boyutlandırma; görsel içinde sürükleme, tekerlek ve +/-yakınlaşma, Sığdır.
- Gizle görüntüyü saklar; Kaldır son tarayıcı kaydını da siler.
- Son referans ayrı IndexedDB alanında saklanır, yenilemede geri açılır. JSON'a eklenmez; aynı tarayıcıdaki son çalışma referansıdır, projeye özel değildir. Panel bunu açıkça belirtir. Kayıt başarısız olursa kullanıcıya bildirilir.
- Görsel plan altlığı/ölçekli iz sürme değildir. Model, metraj, plan PNG/PDF ve JSON değişmez.
- Ctrl+V doğal paste olayına bırakılır; görsel varsa referansa, yoksa mevcut plan panosuna yönlenir. Metin alanları ve açık proje diyaloglarında mevcut yapıştırma korunur.

Kontroller: tests/reference-image.cjs dosya açma, görsel paste, plan paste yönlendirmesi, zoom, başlıktan sürükleme, yenilemede geri yükleme, kaldırma ve proje snapshotının değişmemesi geçti. tests/plan-clipboard.cjs gerçek Ctrl+C/V/X, plan çoğaltma, undo/redo ve metin alanı kısayolları geçti. artifacts/reference-image.png görsel olarak incelendi. Dağıtım HTML yeniden üretildi. Orijinal5.9.87ve canlı kullanıcı çizimi korunur.
