# DEV-072 — INTERFab karşılaştırma incelemesi

8 Ekim 2026, iş PC. Kaynak: https://interfab.interkod.net/projects/100208/cizim?returnTo=%2Fteklif%2Fmusteriler%2F103158 . Kullanıcı kendi hesabında giriş yaptı; tarayıcı arayüzü üzerinden incelendi. Model düzenlenmedi, kaydetme/yükleme/ihracat yapılmadı. Önceki dört görsel referanslar/2026-10-08-gpu-3b/envanter.json içinde kaynak yolları ve hashleriyle kayıtlı. Yeni gözlemler canlı arayüzden; özel hesap verisi dışa aktarılmadı.

## Doğrudan gözlenen / denenen
- Sahnede ara: pencere araması altı sonuç verdi; sonuç seçilince nesne seçildi ve özellik paneli açıldı. Genişlik/yükseklik, üst mesafe, sağ/sol, içe/dışa, cam tonu, PVC/kasa rengi alanları var. Değer değiştirilmedi.
- Bölünmüş 2B+3B görünümü açıldı ve kapatıldı; aynı seçili pencere için iki görünümde ölçü ve işlem araçları bulunuyor. Çizerek eşzamanlı güncelleme sınanmadı.
- Nesne araçları: biçimi kopyala, benzerlerini seç, kilitle, gizle, sil. Sadece görüldü; değiştirici işlemler çalıştırılmadı.
- Genel bina özeti: alan, en/boy/yükseklik, kat/oda/açıklık adetleri, iç/dış duvar adet ve kalınlıkları.
- Sahneler paneli: Pafta/Sunum/Tümü, başlangıç sahnesi, sahne ekle, altı standart sahne oluştur. Yeni sahne oluşturulmadı.
- ClashCheck açıldı: iki kategori kümesi (mimari/taşıyıcı/döşeme/tavan/elektrik/tefrişat), gerekli açıklık, sonuç/model odaklama alanı. Tarama çalıştırılmadı; doğruluk ve tolerans algoritması bilinmiyor.
- Metraj/Keşif açıldı: kat filtresi, arama, gruplu/düz liste, fiyat seçeneği, XLSX/PDF ihracat menüsü. Profiller adet/metre; paneller boyuta ve kapı/pencere açıklığına göre gruplanıyor. Hesap doğruluğu karşılaştırılmadı; dosya indirilmedi.
- Çatı kataloğu açıldı: kırma/beşik/tek eğimli/düz; tavan, makas, dere/oluk grupları. Montaj/üretim aks kuralları doğrulanmadı.

## Yalnız menüde görülenler
Revizyon oluştur/karşılaştır, sürüm geçmişi, JSON/DXF/GLB/USDZ dışa aktarma; pafta, kesit, malzeme kütüphanesi, saha, AI Render, sunum kitapçığı, AR; gölge/efekt/görünüm stili; yön küpü ve kamera komutları. Menü varlığı tam işlev veya kalite kanıtı değildir. Odada gez düğmesi bu durumda devre dışıydı; ürün genelinde yok denemez.

## Bize uyarlama önceliği (öneri; uygulanmadı)
1. 3B parça seçimi ve planla ortak seçim: panel kimliği, net imalat eni, modül yerleşim eni, kalınlık, bağlı makas/H ve açıklığı birlikte göster. 1250 mm imalat ile1255mm aks modülünü karıştırma.
2. Plan+3B yan yana, mevcut ortak veri modeliyle; ayrı geometri türetip sapma oluşturma.
3. Mevcut plan/aks/mesnet uyarılarını 3Bde ilgili parçaya odakla. İzinli montaj bindirmeleri (Alın V/örtü gibi) gerçek hatadan ayrılmalı; genel çakışma listesi tek başına uygun değil.
4. Görselli açıklık kataloğu ve yerleştirme önizlemesi: uygun tam/yarım/özel panel ve aks uyumu kontrolü, engelin açık nedeni. Bizde katalog/STL ve panel araçları zaten var; sunum birleştirilmeli.
5. Metraj satırı ile3Bparça çift yönlü bağlantı, gruplu panel kesim listesi, otomatik/adet değiştirilmiş satır ayrımı. Bizde metraj/yükleme/XLSX var; hesapları sıfırdan yazma.
6. Kayıtlı müşteri/imalat sahneleri, yön küpü, bağlama göre sade özellik paneli. H/U/köşe/üçlü/dörtlü birleşimleri filtreyle gizlememe kuralı korunur.
7. Otomatik yedekten ayrı adlandırılmış revizyon ve eklenen/silinen/değişen parça karşılaştırması. Bizde yedek/undo var; revizyon karşılaştırması aynı şey değil.
8. GLB ile3B paylaşımı ve standart sunum çıktıları; AI render/AR daha sonra, üretim doğruluğundan sonra.

## Değerlendirme sınırı
Rakibin kullanıcıya nesne/özellik/özet sunumu güçlü. Makas aksı, özel panel/köşe payı, yavru çatı birleşimi, sac kesiti ve yükleme hesabında bizim kurallarımızı karşılayıp karşılamadığı bilinmiyor. Görünmeyen işlevler yok sayılmadı. Özellikle yalnız bu modelde sunulan ölçüleri bizim imalat standardımıza kopyalamamalıyız. Kod, ikon veya malzeme varlığı kopyalanmadı.

İnceleme tamamlandı. Önerilerin uygulaması ayrı geliştirme kapsamıdır; bu tur kod/sürüm değişmedi (5.9.87). Öncelik ilk üç öneri.
