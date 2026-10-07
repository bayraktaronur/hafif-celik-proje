# Üst duvar kapanışı — 5.9.78
Kaynak: Yeni proje (10).json; orijinal kopya cizimler/2026-10-08-panel-kapanis/orijinal.json. Dört referans ve kaynak SHA-256 bilgileri referanslar/2026-10-08-panel-kapanis/envanter.json içinde.

Kullanıcı kararı: mevcut makas aksları korunacak. Başlangıç yarım modüle denk geldiğinde 502 cm için 3 tam + 2 yarım gösterimi doğrudur; dağılım değiştirilmedi.

Kesin neden: e12–e27 üst bağlantısı kapanınca makasa dik duvarların ortak panel başlangıcı -183.25 yerine -178.25 oluyordu. e9 ve e24 başlangıçlarında 67.75 cm oluşuyor, imalat doğrulaması işlemi reddediyordu. JSON'da çatı yok; bu bildirim kat planı duvar kapanışıdır.

Çözüm: kapanış öncesinde geçerli mevcut duvarları bozacak bir faz kayması saptandığında, ortak panel başlangıcı segmentin ilk düğümüne göre panelGridAnchor olarak saklanır. H aksları ve düğümler sabit kalır; yeni köşe yüzü yalnız uç panelleri kısaltır. Normal yeni dikdörtgenlerin köşe fazı korunur. Rastgele boylar serbest bırakılmadı. Önizleme geçici kopyada çalışır; kayıt/undo aynı ankrajı taşır.

Kontroller: tests/panel-close.cjs gerçek planla her iki yönde kapanış, değişmeyen H aksları/düğümler, önizleme, undo/redo, JSON ve geçersiz boy reddi; ayrıca gerçek fareyle e12/e27 tıklamasıyla 1 oda/8 duvar ve sıfır hata. artifacts/panel-close.png incelendi. tests/prefab.cjs 77/77 geçti.

Ayrı açık bulgu: tests/production-direction.cjs satır89 ana/yavru çatı yön değişiminde 'Eski yavru bağlantı kenarı bulunamadı' hatası. HEAD engine kaynaklarıyla oluşturulan bağımsız eski sürümde de aynı hata var; bu kapanış düzeltmesinden kaynaklanmıyor. DEV-062 olarak ayrı takip edilir. Mevcut müşterinin tarayıcı çizimi değiştirilmedi; orijinal dosyalar korunuyor.
