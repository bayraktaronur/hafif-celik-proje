# Odak Atölyesi — tek katlı prefabrik çizimi

25 Ekim 2026 · DEV-153. `index.html` artık çalışan tek kat çizim taslağıdır. Ana uygulama 5.9.137 değişmedi. Önceki iki kat / şase / katman incelemesi `arakat.html` sayfasında aynen korunur; üstte Diğer çalışmalar bağlantısından açılır.

## Tek kat çalışma akışı — index.html

- İlk açılışta Tuna 84 kayıtlı örneğinin ayrı kopyası; yeni çizim için **Boş plan**, mevcut JSON için **Aç**. Canlı kullanıcı planı kendiliğinden okunmaz.
- Zemin kat / Çatı / 3D / Tavan / Metraj / Çıktı tek proje üzerinde çalışır. Gerçek duvar, veranda, kapı, pencere, mutfak, tefriş, çizgi, ölçü, metin ve duvar bölme araçları kullanılır. Önceki arayüzdeki işlevsiz komut kartları bu sayfada yoktur.
- Solda ortak özellikler ve mekânlar; sağda seçili eleman ile açılır üretim/yakalama ayarları. Düzenle menüsünde ikincil araçlar; görünüm seçimi çizim şeridindedir. H/U/köşe gösterimi korunur.
- Çatı açmak geometri üretmez. Çatı bölümünü kullanıcı oluşturur. “Planı kapsayan dikdörtgen çatı” bir sınır zarfıdır; L/T planda “Özel çatı sınırı çiz” ve birleşen bölümler kullanılmalıdır. Kaynak motorun mevcut güncelleme davranışları korunur; plan sınırı değişince çatı konturu ayrıca kontrol edilir.
- Ortak yükseklik ve çatı kaplaması mevcut motorun senkronizasyonuyla 3D/metrajda aynı veriyi kullanır. 250/280/300 prefabrik yükseklikleri korunur. Fiyat eklenmedi.
- “Tavanı alttan gör”, bu çizimdeki odaların gerçek iç sınırlarından 60×120 levha ve mini H önizlemesi üretir. Islak hacim ve veranda levhaları yeşildir. 120×250 seçeneğinde mini H oluşturulmaz; normal Tavan görünümüne dönülür. Özel alttan önizleme ortogonal odalar içindir; eğik oda açıkça bildirilir ve ana tavan görünümünde kalır. Mini H kesiti/1,25 cm kalınlık temsilîdir, satın alma veya üretim onayı değildir. Ana metraj motoru değiştirilmez.
- Kaydet JSON indirir veya kullanıcının seçtiği dosyaya kaydeder. Otomatik kayıt / açık proje sekmeleri / pano / açıklık tercihleri **taslağa özel anahtarlarla** saklanır. Ana programın otomatik yedeği, sekmeleri ve panosu okunmaz/yazılmaz. Tarayıcı kaydı Git ile taşınmaz; çizimi JSON kaydetmek gerekir. Kaydedilmiş boş plan örnekle değiştirilmez.
- Çıktı menüsünde PDF / PNG / DXF; Metraj penceresinde yükleme listesine erişim. İmalat ve bağlantı hesabı ana motorun mevcut sınırlarıyla çalışır; yeni taşıma/statik veya fiyat hesabı eklenmedi.

`build-single-storey.cjs` ana HTML ve 52 JS/CSS kaynağını salt okuyarak yalnız bu klasöre `single-engine.js`, `single-engine.css`, `single-example.js`, `index.html` ve `single-engine-manifest.json` üretir. Çalışma anında ana `src/` dosyaları yüklenmez; kopyanın motor sürümü 5.9.137 olarak sabittir. Kaynak ve örnek SHA-256 değerleri manifesttedir. Başka bilgisayarda yalnız `index.html` değil klasörün tamamı gerekir.

Kontroller: `single-check.cjs` gerçek mouse/klavye prefabrik çizim/köşe kapanışı/undo, ana motorla panel-birleşim-metraj eşitliği, oda/metin/ölçü, çatı/kaplama/yükseklik, canlı tavan alanı, JSON indir/aç/yenile, PDF, 980/1280/1920, ağ ve ana kaynak/depolama izolasyonu. `single-actions-check.cjs` gerçek kapı/pencere, özel oda adı/tavan, boş kayıt koruması. Ana dosyaların hashleri değişmez. Rapor: `../../analizler/2026-10-25-taslak-tek-kat.txt`.

## Korunan arakat taslağı — arakat.html

Aşağıdaki DEV-150/151/152 açıklamaları bu ayrı sayfaya aittir. Arakat sayfası ağ/depolama kullanmaz; denemeler bellektedir.

## Ara katın anlamı

Kullanıcının ara kat tanımı iki kat arasındaki galvaniz çelik döşeme şasesidir. Alt kat duvarlarının üstünde, üst kat tabanının altında; alt kat tavan kaplaması şasenin altındadır. Standart dış en 125 cm, yükseklik 20 cm, boy plan sınırına bağlıdır. 280 cm duvarda şase altı 280, üstü 300 cm. Görsel kaplama varsayımıyla taban 2 cm, alçıpan 1,25 cm; mini H üst/alt kapak temsili 0,12’şer cm: üst kat duvar tabanı 302 cm, alt tavanın mini H alt yüzü 278,51 cm olur. Bunlar ürün/imalat değerleri değildir; taslak açıklamalarında belirtilir.

## Kullanım

- Açılış: katmanları ayrılmış iki kat. Katları ayır / İki kat birlikte / Şaseyi incele önayarları. Ayrıştırma yalnız görüntüyü açar, model kotlarını değiştirmez.
- Taban kaplaması (Betopan/Hekimboard), şase içi yalıtım (camyünü/taşyünü), galvaniz şase ve alt tavan (alçıpan) ayrı gösterilir. Renkli etiketler ve sağ paneldeki görünürlük kutuları eşleşir. Gizlemek ürün seçimini ve kat kotunu değiştirmez. Şase incelemesi kaplamaları geçici gizler; katman görünürlük tercihleri korunur.
- “Tavanı alttan gör”: 60×120 cm nominal alçıpan düzeni, mini H geçme profilleri, tam/kenar levhası seçimi ve ölçüsü. Alttan/üstten bakış, orbit/zoom, yön değişimi ve geri alma. Katmanlara dön önceki kamerayı ve görünürlük tercihlerini korur.
- Ara kat şasesi planında veya sağ listede parça seçimi; dış en, boy, kotlar. İki boy doğrultusu, özel kenar parçaları ve geri alma.
- 3D sürükle döndür; Shift/orta tuş kaydır; tekerlek yakınlaş; açık/koyu zemin, kat görünürlüğü. WebGL ve basit yazılımsal yedek çizici.
- Prefabrik 250/280/300 cm, çelikte elle yükseklik. Şase ve üst kat kotları birlikte güncellenir.
- Verilen üç montaj ve iki kat arası kesit referans penceresinde açılır.
- Önceki oda adı/geri alma, duvar bölme önizlemesi, görünürlük ve panel daraltma korunur.

## Kaynak ve uygulama sınırı

Tuna 84 zaten prefabrik kayıttı; ilk taslak çizicisi panel ve birleşimleri göstermiyordu. `build-reference.cjs` mevcut motoru geçici, kullanıcıdan bağımsız tarayıcıda okuyup 49 panel, H/H3/U/köşe ve açıklık geometrisini `prefab-reference.js` dosyasına kaydeder. Kaynakta temsilî olan ayrıntılar burada da temsilîdir. Kamera/GPU çizicisinin bağımsız kopyaları taslağa aittir; çalışma anında ana kaynaklar yüklenmez. Panel kesim ve makas yönü kuralları yeniden yazılmaz; örneğin mevcut hesap sonucu korunur.

`build-frame.py` güncel 125 cm STL'den iki uzun profil, iki başlık ve bir ara kaydın meshini çıkarır. `frame-model.js` elemanları yalnız boy eksenlerinde uzatır; profil eni ölçeklenmez. Yan profiller dış eni 125 cm tutacak şekilde yerleşir. Milimetreden küçük STL uç sapmaları nominal 20 cm yüksekliğe sınırlandırılır. Komşu şaselerin yan profilleri ayrı kalır.

Ortogonal oda alanları ve duvar üst yüzlerinin birleşiminden sınır bulunur. Boy değişen şeritler ayrı ele alınır; son en özel kenar parçasıdır. Veranda/sundurma kapsam dışında. Dar özel parçalar dahil bu yerleşim üretim onayı değildir: minimum en, mesnet/birleşim, izin verilen açıklık ve kayıt aralığı henüz üretim standardına bağlanmadı. Kayıt dağılımı STL'deki yaklaşık 49,27 cm tekrardan türetilen görsel önizlemedir.

`floor-layers.js` tabanı şase ayak izi üzerinde, yalıtımı STL kayıtları arasındaki boşluklarda üretir. `standard-ceiling.js` her odanın iç sınırını duvar yüzleriyle keser ve 60×120 nominal hücrelere böler; 125 cm şase sınırları tavanı bölmez. Mini H yalnız komşu hücrelerin ortak kenarındadır; duvar kenarlarına ve yapay poligon bölmelerine eklenmez. Profil iki kapak ve aradaki gövdeyle temsil edilir; standart geçme tavanda vida modellenmez. Banyo/WC levhaları mevcut uygulama sınıflamasıyla yeşildir. Alt/üst yüzler çizilir. Yalıtım rengi ve lifleri temsilîdir; üst taban derzleri üretim dizilimi değildir. Veranda bu ara katın dışında kalır.

Üst kat aynı planın bağımsız örnek kopyasıdır. Mini H kesiti (2 cm kapak, 0,12 cm gövde/kapak), geçme boşluğu ve alçıpan kalınlığı görsel varsayımdır. Nominal hücre ölçüsü/alanı ile bu küçük görsel boşluk ayrı tutulur. Ortogonal örnek plan, duvar kenarından başlayan modül ve şase boy doğrultusunu izleyen uzun kenar bu taslağın yerleşim tercihidir. Ürün/kalınlık seçimi, 120×250 seçeneği, gerçek profil kesim/bağlantı payları, fire/artan parça optimizasyonu, çatı, statik, fiyat ve sevk hesapları eklenmedi. Duvar bölme yalnız taslak işaretidir; tam çok kat üretim sistemi tamamlandı sayılmaz.

## İzolasyon ve kontroller

Ağ, tarayıcı kaydı veya canlı proje erişimi yoktur; denemeler bellektedir. Ana HTML/src/dist ve müşteri JSON'ları korunur. `check.cjs`: prefab49/H/köşe, STL kesiti, 125/20 ölçü, duvar üstüne oturma, üç standart kot, ayrıştırma, seçim/yön/geri alma, kamera/görünürlük, önceki oda/bölme akışları, 980/1280/1920 ekranlar, yedek çizici, ağ/depolama yokluğu ve ana dosya hashleri. Geometrik oturma testi taşıma hesabı değildir.

Rapor ve kanıtlar: `../../analizler/2026-10-25-taslak-arakat.md`; kaynak/artifact hashleri `../../analizler/2026-10-25-taslak-arakat-envanteri.json`.

DEV-151: `../../analizler/2026-10-25-taslak-arakat-katman.txt`, `-katman-kontrol.txt`, `-katman-envanteri.json`. Yeni kontroller: iki şase yönü × üç yükseklik, kaplama kot sırası, taban alanının şase alanına eşitliği, tavanın duvarlarla çakışmaması, yalıtım boşluk sınırları, alt yüzler, ayrıştırmada yalnız Z dönüşümü, katman gizle/geri al ve önayarlar arasında tercihlerin korunması.

DEV-152: `ceiling-check.cjs` tam/kesilmiş/dar/L biçimli alanlar, 60×120 modül, yalnız ortak kenarlarda mini H, iki doğrultu × üç yükseklik, önceki tavan alanının korunması, üç parçalı H kesiti, levha seçimi, alttan/üstten görünüm, yön/undo, kamera/kat görünürlüğü dönüşü, dar ekran/yedek çizici/izolasyonu doğrular. Rapor: `../../analizler/2026-10-25-taslak-standart-tavan.txt`; yeni kontrol ve eski akış regresyon çıktıları aynı tarihli `-kontrol.txt` / `-regresyon.txt`, dosya hashleri `-envanteri.json`.
