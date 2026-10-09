# 5.9.102 — DEV-087

Sekme adını tutup başka sekmeye sürüklemek sırayı değiştirir; aktif proje, çizim ve geri alma geçmişi korunur. Sıra yerel çalışma kaydına yazılır. Kapatma X'i aktif olmayan sekmelerde de görünür. Çizim varsa, dosyaya kaydedilmiş olsa bile onay sorulur; kaydedilmemiş değişiklik uyarısı ayrıca korunur. Kapatılan çizim mevcut yedek mekanizmasına kaydedilir.

`tests/project-tab-order.cjs`: iki yönde sürükleme, kalıcı sıra, aktif çizimin değişmemesi, pasif/kaydedilmiş çizimde onay-iptal-kapatma geçti. `tests/project-tabs.cjs`: ayrı proje, Yeni/Aç, hatalı dosya, undo/redo, görünüm, yeniden açılış, kapatma ve yedek testi geçti. Kullanıcının canlı çizimi değiştirilmedi.

## Veranda nasıl çizilir?

1. Kat planında **Veranda (V)** aracını seçin. Evin bağlantı noktasından başlayarak dıştaki üç sınırı U şeklinde çizin ve diğer ucunu ev duvarına bağlayın. Ev duvarıyla birlikte kapalı alan oluşmalı. **Esc** ile bitirin.
2. Sınırı seçip **Net ölçüyü düzenle** ile özel ölçüyü cm girin. Sabit tarafı seçin; ev duvarları korunur. Alan veranda olarak görünmüyorsa alanın türünü **Veranda** seçin.
3. **Çatı planı** açın. Ana çatı hazır olmalı. Solda **Veranda / ek çatı** listesinden alanı, türden **Beşik çatı**, bağlantıdan ana çatıyı seçin.
4. İsteniyorsa **Üst ön yatay kiriş eklensin mi? → Evet** seçin. **Veranda oluştur / güncelle** düğmesine basın.
5. Sağdaki **Veranda kutu profilleri** bölümünde dikme/kiriş kesiti ve et kalınlığı değişebilir; başlangıç 100×100×2 mm. Sol/sağ yan kirişler ayrıca seçilir. Değişiklikleri uygulayıp **3B** kontrol edin.

Veranda listesi boşsa kapalı veranda alanı oluşmamıştır veya alan türü veranda değildir. Kaynak kontrolleri: `src/veranda-ui.js`, `src/roof.js`, `src/engine.js`. Bu teslimde veranda geometrisi değiştirilmedi.
