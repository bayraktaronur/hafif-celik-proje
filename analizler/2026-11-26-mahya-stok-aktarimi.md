# Mahya stok aktarımı · 210

Onaylı kural: düz mahya2800mmstok, her ekte en az200mmbindirme, ayrıca yedek yok. Yeni üretim reçetesi türetilmedi; önceki rapor hesabı uygulama listesine bağlandı. RoofCore geometrisi/kesimleri ve diğer malzeme hesapları değiştirilmedi.

LoadingRoofBridge.ridgeStock kesintisiz, aynı doğrultu/kottaki kenarları birleştirir; ayrı hatları ayrı yuvarlar. Sınır sayımı ceil((net−bindirme)/(stok−bindirme)), tek parçada en az1. Tekrarlı kenarları çift saymaz. Geometri doğrulanamazsa netmetre satırı beklemede kalır. Manuel miktarlar önceki düzeltme yaşam döngüsünü izler. Eski netmetreye verilmiş düzeltmeler yeni adet satırına sessizce aktarılmaz.

loading-ridge-check.cjs ve loading-roof-check.cjs geçti. İzole tarayıcıda proje/geometri/diğer satır değişmezliği, referans Excel stok/adet/bedel karşılaştırması, CSV/XLSX, filtre, Kaydet/yeniden açma, geri al/yinele doğrulandı. Kaynak DWG aynı dosya hash’i ile doğrulandı ve DXF ölçüleri tekrar incelendi. Yerel müşteri raporu: outputs/Tuna92-DWG-kontrol210.md. Müşteri çizimi ve finansal rapor Git’e dahil değil.

Yan sundurma türü/eğimi ve panel kesim-sipariş eşliği henüz doğrulanmadı; kullanıcıya soruldu. Yalnız üst görünüşten çatı eğimi varsayılmadı. GABLE-207-AUDIT açık kalır.
