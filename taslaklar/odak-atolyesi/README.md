# Odak Atölyesi — bağımsız prefabrik / ara kat taslağı

25 Ekim 2026 · DEV-151. `index.html` açılır. Ana uygulama 5.9.137 değişmedi.

## Ara katın anlamı

Kullanıcının ara kat tanımı iki kat arasındaki galvaniz çelik döşeme şasesidir. Alt kat duvarlarının üstünde, üst kat tabanının altında; alt kat tavan kaplaması şasenin altındadır. Standart dış en 125 cm, yükseklik 20 cm, boy plan sınırına bağlıdır. 280 cm duvarda şase altı 280, üstü 300 cm. DEV-151 görsel kaplama varsayımıyla taban 2 cm, alt tavan 1,25 cm: üst kat duvar tabanı 302 cm, alt tavan altı 278,75 cm olur. Bunlar ürün/imalat değerleri değildir; sağdaki “Taslak katman değerleri” içinde açıklanır.

## Kullanım

- Açılış: katmanları ayrılmış iki kat. Katları ayır / İki kat birlikte / Şaseyi incele önayarları. Ayrıştırma yalnız görüntüyü açar, model kotlarını değiştirmez.
- Taban kaplaması (Betopan/Hekimboard), şase içi yalıtım (camyünü/taşyünü), galvaniz şase ve alt tavan (alçıpan) ayrı gösterilir. Renkli etiketler ve sağ paneldeki görünürlük kutuları eşleşir. Gizlemek ürün seçimini ve kat kotunu değiştirmez. Şase incelemesi kaplamaları geçici gizler; katman görünürlük tercihleri korunur.
- Ara kat şasesi planında veya sağ listede parça seçimi; dış en, boy, kotlar. İki boy doğrultusu, özel kenar parçaları ve geri alma.
- 3D sürükle döndür; Shift/orta tuş kaydır; tekerlek yakınlaş; açık/koyu zemin, kat görünürlüğü. WebGL ve basit yazılımsal yedek çizici.
- Prefabrik 250/280/300 cm, çelikte elle yükseklik. Şase ve üst kat kotları birlikte güncellenir.
- Verilen üç montaj ve iki kat arası kesit referans penceresinde açılır.
- Önceki oda adı/geri alma, duvar bölme önizlemesi, görünürlük ve panel daraltma korunur.

## Kaynak ve uygulama sınırı

Tuna 84 zaten prefabrik kayıttı; ilk taslak çizicisi panel ve birleşimleri göstermiyordu. `build-reference.cjs` mevcut motoru geçici, kullanıcıdan bağımsız tarayıcıda okuyup 49 panel, H/H3/U/köşe ve açıklık geometrisini `prefab-reference.js` dosyasına kaydeder. Kaynakta temsilî olan ayrıntılar burada da temsilîdir. Kamera/GPU çizicisinin bağımsız kopyaları taslağa aittir; çalışma anında ana kaynaklar yüklenmez. Panel kesim ve makas yönü kuralları yeniden yazılmaz; örneğin mevcut hesap sonucu korunur.

`build-frame.py` güncel 125 cm STL'den iki uzun profil, iki başlık ve bir ara kaydın meshini çıkarır. `frame-model.js` elemanları yalnız boy eksenlerinde uzatır; profil eni ölçeklenmez. Yan profiller dış eni 125 cm tutacak şekilde yerleşir. Milimetreden küçük STL uç sapmaları nominal 20 cm yüksekliğe sınırlandırılır. Komşu şaselerin yan profilleri ayrı kalır.

Ortogonal oda alanları ve duvar üst yüzlerinin birleşiminden sınır bulunur. Boy değişen şeritler ayrı ele alınır; son en özel kenar parçasıdır. Veranda/sundurma kapsam dışında. Dar özel parçalar dahil bu yerleşim üretim onayı değildir: minimum en, mesnet/birleşim, izin verilen açıklık ve kayıt aralığı henüz üretim standardına bağlanmadı. Kayıt dağılımı STL'deki yaklaşık 49,27 cm tekrardan türetilen görsel önizlemedir.

`floor-layers.js` tabanı şase ayak izi üzerinde, yalıtımı STL kayıtları arasındaki boşluklarda, alt tavanı duvar yüzlerinde keserek şasenin altında üretir. Alt yüzler de çizilir. Yalıtım rengi ve lifleri temsilîdir; levha ek çizgileri üretim dizilimi değildir. Her yönde aynı plan sınırı korunur; veranda bu ara katın dışında kalır.

Üst kat aynı planın bağımsız örnek kopyasıdır. Katmanların ürün/kalınlık seçimi, mini H ve levha modül yerleşimi, ıslak hacim malzeme ayrımı, çatı, bağlantı, statik, fiyat ve sevk hesapları eklenmedi. Duvar bölme yalnız taslak işaretidir; serbest çizim araçlarının bir kısmı panel önerisidir. Tam çok kat üretim sistemi tamamlandı sayılmaz.

## İzolasyon ve kontroller

Ağ, tarayıcı kaydı veya canlı proje erişimi yoktur; denemeler bellektedir. Ana HTML/src/dist ve müşteri JSON'ları korunur. `check.cjs`: prefab49/H/köşe, STL kesiti, 125/20 ölçü, duvar üstüne oturma, üç standart kot, ayrıştırma, seçim/yön/geri alma, kamera/görünürlük, önceki oda/bölme akışları, 980/1280/1920 ekranlar, yedek çizici, ağ/depolama yokluğu ve ana dosya hashleri. Geometrik oturma testi taşıma hesabı değildir.

Rapor ve kanıtlar: `../../analizler/2026-10-25-taslak-arakat.md`; kaynak/artifact hashleri `../../analizler/2026-10-25-taslak-arakat-envanteri.json`.

DEV-151: `../../analizler/2026-10-25-taslak-arakat-katman.txt`, `-katman-kontrol.txt`, `-katman-envanteri.json`. Yeni kontroller: iki şase yönü × üç yükseklik, kaplama kot sırası, taban alanının şase alanına eşitliği, tavanın duvarlarla çakışmaması, yalıtım boşluk sınırları, alt yüzler, ayrıştırmada yalnız Z dönüşümü, katman gizle/geri al ve önayarlar arasında tercihlerin korunması.
