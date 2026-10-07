# DEV-064 — İç duvar kapanışı ve önizleme / 5.9.80

Kaynak: kullanıcının iki ekran görüntüsü referanslar/2026-10-08-ic-duvar-kapanis altında kaynak/hash ile saklandı. Son sağlanan Yeni proje (10).json kopyası cizimler/2026-10-08-panel-kapanis/orijinal.json üzerinden üst duvar kapatılarak durum tekrar oluşturuldu. Yeni canlı JSON verilmedi; ekrandaki bağlantı67.75/193.25 Y akslarında denendi.

Kesin nedenler:
1.5.9.78 panelGridAnchor segmentin n1 düğümüne göre offset tutuyordu. splitSeg bu offseti kopyalarken yeni n1'e göre düzeltmiyordu. T bağlantısı ile bölünen yan duvarın dünya referansı -183.25 yerine -753 olabiliyor, diğer duvarlarda5cm artık panel ve aks hataları üretiyordu. Yeni parçada offset=eski offset+eski başlangıç koordinatı-yeni başlangıç koordinatı; dünya aksı korunur.
2. Önizleme geçici segmenti binadaki T noktalarına bağlamadan pfAnaliz çağırıyordu; bağımsız bileşen gibi tam panelle başlıyordu. Geçici derin kopyada normalizeGraph ile aynı T bağlantıları kurulur. Açıklık verileri ve ID sayacı da korunup geri yüklenir. Gerçek model/undo değişmez.

Sonuç: mevcut makas/H aksları ve üst duvar korunur.10cm iç duvar uçları5er cm düşer; soldan57.75+125.5+125.5+120.5=429.25cm panel aralığı. Önizleme/gerçek çizim aynı; sağdan çizimde yalnız sıra ters çevrilir, dünya H konumları değişmez. Birleşimler serbest bırakılmadı ve5cm panel geçerli sayılmadı.

Kontroller: tests/panel-interior-close.cjs 8 durum (iki makas yönü, iki çizim yönü, iki Y aksı), önizleme/gerçek eşitliği, snapshot değişmezliği, üst duvar korunması, undo/redo/JSON, gerçek fareyle2oda ve sıfır kontrol hatası. tests/prefab.cjs77/77; tests/panel-close.cjs geçti. artifacts/panel-interior-close.png incelendi. Kullanıcının açık çizimine dokunulmadı. Ayrı DEV-062 çatı yönü hatası açık kalır.
