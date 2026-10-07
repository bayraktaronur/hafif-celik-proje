# DEV-065 — Hızlı panel düzenleme / 5.9.81

İstek: duvar üzerindeki paneli sol tık menüsünden böl/birleştir, komşuya sürükleyerek değiştir; özel paneller ve makas aksları korunmalı.

Panel düzenle düğmesi seçme aracını/panel seçimini etkinleştirir. Sol tık menüsü: aks üzerinden ikiye böl, önceki/sonrakiyle birleştir veya değiştir. Sürükle bırak yalnız aynı hattaki komşuyla değiştirir; hedef ipucu gösterilir. Escape/odak kaybı iptal eder. Ctrl/Shift çoklu seçim eski davranışını korur. Hızlı mod kapalıyken eski duvar ve panel seçimi değişmez.

İşlemler mevcut Prefab transaction/rebuildLayout üzerinden; eşleme açıksa bağlı hatlar birlikte güncellenir. Açıklıklar mevcut kurallarla panelle taşınır; açıklık/H çakışması ve T/köşe kontrolleri korunur. Hızlı işlemler ayrıca önceden desteklenen her makasın H mesnedini işlem sonrasında arar; birini kaldırıyorsa transaction geri alınır. Makas koordinatları otomatik taşınmaz. Bu nedenle her yarım/tam değişimi mümkün değildir; makas mesnedini kaldıran kombinasyon reddedilir. Sürükleme komşuyla yer değiştirmedir, serbest konum veya başka duvara transfer değildir.

Özel uç paneli eşit bölmek yerine ortak62.75cm aksının panel ortasına yakın noktası kullanılır. İçeride en az10cm iki parça oluşmayan durumda reddedilir; mevcut modül doğrulaması yine çalışır. Kullanıcının120.5cm uç paneli62.75+57.75 olarak bölündü. Birleştirme mevcut iki yarım/kısaltılmış panel kapsamındadır; iki tam panelden keyfi250cm imalat panosu üretilmez. Makas mesnedi birleştirmeyi engelleyebilir.

Kontroller: tests/panel-quick.cjs gerçek sol tık menüsü, böl/birleştir, gerçek sürükleyle yarım/tam değişimi ve sabit makas koordinatları, mesnet kaybında tam rollback, undo/redo/JSON ve JSON10daki120.5cm özel uç bölünmesi geçti. Prefab77/77 geçti. artifacts/panel-quick.png incelendi. Kullanıcı açık planına müdahale edilmedi.
