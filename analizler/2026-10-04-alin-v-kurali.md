> Güncel karar (5.9.47): Aşağıdaki /2800 ve bindirmesiz hesap tarihsel olarak geçersizdir. Kullanıcı 30cm bindirmeyi onayladı: stok2800−bindirme300=etkin2500mm. Gerçek eğimli toplam/2500 yukarı yuvarlanır. 39cm yazım hatasıdır. Güncel test:800cm/30%çatı7adet;1000cm/40%çatı9adet. Ürün stok boyu2800mm korunur.

# Alın V — 4 Ekim 2026 / 5.9.46

Kaynak: kullanıcı açıklamalı görseli, C:/Users/obayr/AppData/Local/Temp/codex-clipboard-06328598-f785-447b-bdb8-dd1046de96dc.png. Kopya: referanslar/tuna-84m2/2026-10-04-alin-v-egimli-boy.png. SHA-256:64f7366a1b11198355b3bd5cc6318e52c82959c0e62383ce8c92fbf840cb5e36. Orijinal korunmuştur.

Görselde iki eğimli alın kenarı işaretli; uzunluk/2800adet kuralı onaylandı. Uygulama gerçek çatı modelinin açık verge kenarlarını3B boylarıyla toplar; toplam mm/2800yukarı yuvarlanır. Her iki alın tarafı ve modelin açık kalan diğer bölümleri sayılır. Modelin birleşimlerde kaldırdığı iç kenarlar ayrıca sayılmaz; mahya, eğik mahya, dere ve yatay saçak dahil edilmez. Kaynak Excel ürünü220×2800mm(tuna-36). Saçak sacına ait300mm bindirme buraya taşınmadı; otomatik yedek0. Bu toplam metraj hesabıdır; parça bazında kesim optimizasyonu değildir.

Çatı bölümü yoksa adet üretilmez, yükleme ekranı çatı çizilmesi gerektiğini bildirir. Sıfır alın kenarlı çatıda ürün ihtiyacı oluşturulmaz. Çatı eğimi/geometrisi değişirse otomatik boy/adet yenilenir, önceki manuel karar geçersizleşir. Plan duvarları ve canlı çizim değiştirilmedi.

Kontroller: build, loading-list, loading-top, loading-verge.800cm açıklık,30%beşik çatı, sıfır saçakta iki alın toplamı4×sqrt(400²+120²)cm=16,70449m→6adet;40%eğimde17,23253m→7adet. Manuel/stale ve çatı yok testleri geçti. Ayrı test XLSX dosyasında7adet,0yedek,tuna-36doğrulandı. Test çıktıları artifacts altında geçici; ortak müşteri planı değildir. Mevcut Tuna kontrol JSON'unda çatı bölümü yok; eski Excel9adedi ile geometri karşılaştırması henüz yapılamaz.
