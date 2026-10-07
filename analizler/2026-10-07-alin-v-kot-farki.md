# DEV-048 — Alın V kot farkı kenarları ve mahya rengi

7 Ekim 2026, iş PC, 5.9.62.

Kaynak: referanslar/2026-10-07-alin-v/04-kot-farki.png; özgün yol ve SHA-256 aynı tarihli Alın V kaynak envanterinde. Orijinal korundu.

Kullanıcının kırmızı işaretlediği kot farkı birleşimlerinin üst kenarları Alın V kapsamına alındı. Modelin üst yüzeye ait step kenarı kullanılır; alt kenara ikinci parça eklenmez. Görünüş ve yükleme aynı verge/step kenar listesinden hesaplanır; mahya, dere ve saçak dahil edilmez. 220/400 seçimi, 2800 mm stok ve 300 mm bindirme kuralı korunur. Eski manuel düzeltmeler kural sürümüyle yeniden kontrol edilir.

Mahya ve eğik mahya kapamaları ilgili yüzeyin malzeme rengini ve aydınlatmasını kullanır; yüzeyden %18 koyudur. 3B mahya çizgisi de malzemeden türetilir. Planın teknik renkleri korunur.

Kontroller: roof-trims (kot farkı kapaması, metraj eşitliği, iki malzeme rengi, seçim/undo/JSON), roof (20 kontrol), roof-child-chain, roof-gable-boundary, loading-verge, loading-list geçti. Bağımsız 3B ekran çıktısı incelendi. Canlı müşteri çizimi değiştirilmedi veya güncel JSON olarak doğrulanmadı (DEV-043).

DEV-047 sınırları sürüyor: kapamalar şematik; mahya stok/bindirme ve profil büküm ölçüleri henüz bilinmiyor.
