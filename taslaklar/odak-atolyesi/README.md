# Odak Atölyesi — tek katlı prefabrik çizimi

26 Ekim 2026 · DEV-161. `index.html` çalışan tek kat çizim taslağıdır; gerçek çelik kapı STL modelleri eklendi. Komut düzeni ve DEV-160 çatı kotu/kilit/ana-yavru rol değişimi korunur. Ana uygulama 5.9.137 değişmedi. Önceki iki kat / şase / katman incelemesi `arakat.html` sayfasında aynen korunur; üstte Diğer çalışmalar bağlantısından açılır.

## Gerçek çelik kapı — taslak 161

**Yapı → Kapı → Sol çelik kapı / Sağ çelik kapı · 90 × 205 cm** seçip yerleştir. **3D** görünümünde kullanıcı STL'sindeki kasa, kanat, dekor, kol ve kilitler gösterilir. Duvar yüksekliğini 250/280/300 cm seçmek ilgili özgün pano modelini kullanır; kapı boyu esnetilmez. Planın menteşe yönü, ters çizilmiş duvarlar ve bina dışına bakan yüz korunur. Kapı çevresindeki pano iç/dış cephe boyasını takip eder.

Kaynak pano 125 cm genişliğinde, 10 cm nominal duvar içindir (STL gövdesi 9,6 cm). Kaynak kasa dışı 91,29 × 205 cm; katalogdaki 90 × 205 nominal seçim ve plan/metraj aynı kalır. Duvar sonunda yalnız panonun duvar dışına taşan kenarı kesilir, kapı geometrisi değişmez. Uyumsuz yükseklik, özel kapı ölçüsü, kalınlık veya açıklık çakışmasında neden belirtilerek mevcut şematik çizim kullanılır. Diğer kapı türleri ve eski genel “Dış kapı” kayıtları kendiliğinden bu ürüne dönüştürülmez.

STL malzeme/renk verisi taşımaz; kapı için kahverengi tonları ve metal aksesuar rengi sunum tercihidir. Yeni fiyat, sipariş veya imalat kesiti kuralı eklenmedi. Kaynak, ölçüler ve sınırlar: `../../analizler/2026-10-26-taslak-celik-kapi.txt`. Kontrol: `steel-door-check.cjs`; tüm ham üçgen koordinatları, gerçek komutla yerleştirme, üç yükseklik, yönler, boya, kayıt ve ana kaynakların korunması.

`node build-single-storey.cjs` kapı verisini de yerel STL'den yeniden üretir. Dosyalar bağımsız taslakta bulunur; çevrimdışı `file://` açılışında ek sunucu veya STL yükleme işlemi gerekmez.

## Komut düzeni

Resmî dokümanlara göre iş akışı için [Vertex BD](https://kben.vertex.fi/bd/vertex-bd-training-manual-for-lgs-frame-building-d), bağlamsal araçlar için [Revit](https://help.autodesk.com/cloudhelp/2026/ENU/Revit-GetStarted/files/GUID-3197A4ED-323F-4D32-91C0-BA79E794B806.htm), sabit arayüz bölgeleri için [Rayon](https://www.rayon.design/blog/rayon-v2) incelendi. Bu taslak ürünlerin birebir kopyası değildir; mevcut prefabrik motorunun komutları yeniden düzenlendi. Karşılaştırma ve kararlar: `../../analizler/2026-10-26-taslak-komut-duzeni.txt`.

- **Yapı:** Duvar, veranda, kapı, pencere.
- **Donatı:** Vitrifiye, mutfak, tefriş.
- **Ölçü ve not:** Ölçülendir, metin, çizgi / şekil.
- **Düzenle:** Duvar böl, panel düzenle, alan / tümünü seç, kopyala, kes, yapıştır.
- **Seç**, **Referans**, geri al/ileri al her grupta erişilebilir. **Komut bul** veya **Ctrl+K**, aynı araçları adlarıyla açar; Enter çalıştırır, Esc kapatır. Seçili duvara bağlı taşıma komutları, duvar seçilmeden etkinleşmez.
- Duvar çizerken kalınlık ve sayısal giriş birimi sağda görünür. **Özellikler** seçili eleman içindir; **Ayarlar** üretim yönü/panel kuralı/hassas yerleşim; **Kontrol** mevcut plan denetimidir. Görünüm seçimi ve katman düğmesi çizimin sağ üstündedir; görünüm değişikliği model ölçülerini değiştirmez.
- Üst görünüm şeridindeki iki panel simgesi sol proje ve sağ özellik alanını katlar. 1200 piksel altındaki ilk açılışta proje paneli katlıdır. Araç seçimi, gerekli özellik panelini açar. Panel tercihleri bu sürümde oturumluk arayüz durumudur; proje JSON'una eklenmez.
- Çatı araçları Katmanlar / Bakış / Sunum olarak gruplanır. Motorun Boyacı ve diğer araç görünürlük kuralları korunur; yeni kat veya üretim işlevi eklenmez.

Kontrol: `command-ui-check.cjs`; önceki `single-check.cjs`, `single-actions-check.cjs`, `wall-move-check.cjs` ve `reference-check.cjs` akışlarıyla birlikte doğrulandı. Ana kaynaklar/çizimler değişmez.

## Duvar seçimi ve ölçülü taşıma

**Seç → Panel seç / Duvar seç** açılır menüsünden seçim türünü belirle. Duvar seç modunda duvara tıklayınca sağda **Duvar taşıma** görünür.

- **Ölçüyle taşı:** çizimde vurgulanan otomatik ölçülerden birine tıkla, yeni değeri cm olarak gir ve **Uygula**. Örneğin mevcut 198,25 cm ölçüsünü 150 cm yapmak seçili duvarı 48,25 cm taşır; diğer ölçü ucu sabit kalır. Önizleme, Uygula öncesinde modeli değiştirmez.
- **Mesafe kadar taşı:** yönü seç ve taşıma miktarını gir. Kesirli cm kabul edilir; bu komut H, panel ortası veya ızgaraya yuvarlamaz. Genel çizim/yakalama ayarları korunur.
- Bağlı duvar uçları mevcut motorun bağlantı kurallarıyla güncellenir. Seçili doğrultudaki birden fazla duvar parçası birlikte taşınabilir. **Esc / Vazgeç**, geri al ve ileri al çalışır.
- Duvar ters dönüyorsa, açıklık duvar ucuna sıkışıyorsa veya özel panel dizilimi sığmıyorsa işlem uygulanmaz. Karmaşık birleşim nedeniyle seçilen ölçü tam karşılanamıyorsa işlem geri alınır; yön ve mesafe komutu kullanılabilir. Özel uzunlukların üretim uyarıları Plan kontrolünde kalır.

Bu komut kullanıcı çizimini kendiliğinden değiştirmez. Kontrol: `wall-move-check.cjs` — gerçek menü/ölçü tıklaması, 198,25→150, iç/dış ve yatay/dikey duvar, kesirli taşıma, T birleşimleri, açıklıklar, çoklu parçalar, önizleme/geri al/JSON ve üç ekran genişliği. Rapor: `../../analizler/2026-10-25-taslak-duvar-secim-tasima.txt`.

## Köşe direği ve panel teması

Köşe direği açık metal dolgu ve kendi sınırı içinde ince konturla gösterilir. Uzaklaşınca sembol büyütülmez; panel uçlarının üzerine taşmaz. Dolgu yalnız plan gösterimidir: 3D boşluklu çelik profil, makas yönü, yerel köşe yönü, köşe payları ve panel kesim ölçüleri mevcut motorla aynıdır. Kâğıt çıktıda aynı dolgu, CAD çıktısında gerçek ölçüde tek kapalı sınır kullanılır.

Kontrol: `corner-contact-check.cjs` — 6/10/15 cm duvar, iki makas yönü, yerel köşe çevirme, dış/iç L köşelerde panel teması, beş görünüm filtresi, %15–300 yakınlaştırma, kâğıt ve CAD. Rapor: `../../analizler/2026-10-25-taslak-kose-temasi.txt`.

## Referans plan üzerinden çizim

Araç çubuğunun başındaki **Referans** düğmesiyle PNG/JPG açılır. Görsel çizim alanına sürüklenebilir veya ekran görüntüsü **Ctrl+V** ile yapıştırılabilir. Panodan yapıştır düğmesi, tarayıcı erişim veriyorsa aynı işi yapar; izin yoksa Ctrl+V kullanılır. Yazı alanlarına yapıştırma ve uygulamadaki plan kopyalama korunur.

- **Plana yerleştir:** görsel duvarların arkasında, planla aynı cm koordinatlarında durur; zoom ve kaydırmayı birlikte izler. Kapalı odaların dolgusu referans açıkken hafifler; duvarlar ve etiketler korunur.
- **İki noktayla ölçekle:** görselde bilinen mesafenin iki ucuna tıkla ve gerçek uzunluğu cm gir. İlk nokta sabit, en/boy oranı aynı kalır. Bu işlem görseli ölçekler; duvarları değiştirmez.
- **Kilitli** başlangıç durumu üzerinden rahat çizim sağlar. Kilidi aç → Taşı ile görsel sürüklenir. Ölçü ve konum bölümünde genişlik, açı ve X/Y girilebilir. Opaklık, göster/gizle ve Görsele git vardır.
- **Ayrı pencerede bak:** çizimden bağımsız referans önizlemesi; başlıktan taşı, köşeden boyutlandır, görseli sürükle veya tekerlekle yakınlaş.
- Referanslar proje JSON’una gömülür; sekme değiştirme, geri al/ileri al, yenileme ve dosya açma/kaydetmeyle korunur. Ana uygulamanın referans veritabanı ve çizimleri okunmaz/değiştirilmez. Önceki `codex/arayuz-duzeni:src/reference-image.js` yalnız ayrı pencere ve IndexedDB’de son görsel tutuyordu; bu taslak kendi proje kaydını kullanır.
- En fazla 4 referans; toplam gömülü veri 2 MiB. Kaynak en fazla 30 MiB; önizleme uzun kenarı 2000 piksele indirilir, büyük PNG’ler JPEG olarak saklanır, şeffaf arka plan beyaza alınır. Kaynak dosya değişmez. Otomatik yedek kotası dolarsa uygulama JSON indirmeyi bildirir.
- Referanslar çizim yardımcısıdır; metraja, 3D’ye veya PDF/PNG/DXF çıktısına eklenmez. Otomatik duvar tanıma veya PDF/DWG içe aktarma yoktur.

Kontrol: `reference-check.cjs` — dosya, görsel pano, JPG sürükle/bırak, iki nokta/cm, taşıma/undo, kilitli görsel üstünde gerçek prefabrik çizim, sekme/JSON/yenileme, çıktı/metraj ve kaynak izolasyonu. Rapor: `../../analizler/2026-10-25-taslak-referans.txt`.

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
# Taslak 158 — Yavru çatı bağlantısı

Yavru çatı için dört U noktası seçilince bağlantı nedeni sol tarafta görünür. Geçerli bağlantıda **Bağlantı hazır** yazısı ve **Çatıyı oluştur** düğmesi etkinleşir. Kot/kesişim engelinde eğim, çatı tipi veya saçak değerlerini dört noktayı silmeden değiştirebilirsiniz. Değerler kendiliğinden değiştirilmez; ana çatı korunur. Son noktayı düzeltmek için Backspace, iptal için Esc kullanın. Dört nokta tamamlandıktan sonra yakalama imleci durur.

[Teşhis, testler ve kapsam sınırı](../../analizler/2026-10-26-taslak-yavru-cati-baglanti.txt). Çizilmiş kullanıcı projesini kaydedip sayfayı yenileyin; henüz oluşturulmamış U taslağı kayıt dosyasına dahil değildir.

## Taslak 159 — Kot ve açı

Bu tarihsel sürümün kot referansı davranışı taslak160 ile düzeltildi; güncel kullanım aşağıdadır.

Dört U noktası sonrası **Yavru çatıyı alçalt / Ana çatıyı yükselt** düğmeleri Kot ve eğim penceresini açar. Mevcut çatıda sağdaki **Kot ve açı · önizle** düğmesini kullanın. Açı (°), eğim (%) ve kot (cm) girebilirsiniz; mahya ile saçak alt kotu ayrı referanslardır. Grafik ve bağlantı kontrolü değişikliği önizler. **Uygula** tüm bağlı çatıları doğrulayarak kaydeder, **Vazgeç** dört noktayı ve projeyi korur. Duvar yüksekliği değişmez. **Duvar üstüne otomatik otur** önceki otomatik davranışa döner.

Özel kot JSON ve geri alma içinde korunur. Yeni sayfayı açmadan/yenilemeden önce planınızı kaydedin; oluşturulmamış U çizimi JSON'a dahil değildir. Ana program değişmedi. Kot farkı dikey kapamaları görsel olarak kapanır; ayrı kesim/maliyet veya taşıyıcı hesabı bu eklemenin kapsamında değildir.

[Uygulama, kontroller ve sınırlar](../../analizler/2026-10-26-taslak-cati-kot-aci.txt). Test: `roof-level-check.cjs`.

## Taslak 160 — Sabit oturma kotu, mahya/açı ve çatı rolü

Çatıyı seçip **Kot ve açı · önizle** açın. **Alt kot** duvar üstünden otomatik alınır; **Elle gir** ile ayrı bir değer verebilir, **Alt kotu kilitle** ile sabitleyebilirsiniz. Manuel alt kot duvarları değiştirmez. **Mahya kotu** veya **Alt kottan yükselme** yazıldığında açı/eğim hesaplanır; açı yazıldığında mahya hesaplanır. Bu işlemler alt kotu taşımaz. Mahya kilidi mutlak kotu, açı kilidi eğimi korur; birbirlerinin yerine kullanılırlar.

Yavru mahyası ana mahyanın üstüne çıkarsa önizlemede roller değişir: yüksek yavru ana olur, eski ana ona bağlanan yavru olur. Yeni ana yüzey eski ana çatı sınırına kadar uzatılır, örtüşen yüzeyler ortak modelde kesilir. Kotlar, dere/mahya ve kaplama metrajı aynı modelden hesaplanır. Önceki çatı tekrar daha yüksek olursa ilk bağlantı geri kurulur. Bölüm adları korunur; güncel **Ana / Yavru** görevi ayrıca gösterilir.

**Uygula** tek geri alma adımıdır; **Vazgeç** çizimi değiştirmez. Kotlar/kilitler/roller JSON ve otomatik yedekte saklanır. Eski159 sürümünde alt kotu taşınmış çatı açıldığında duvar üstüne dönüş önizlenir; uygulamadan kayda geçmez. Ana program ve açık müşteri çizimi değiştirilmedi.

Rol değişimi dikdörtgen ana çatıya dik U bağlantılı beşik/tek eğimli çatı çifti içindir. Kırma/karmaşık çokgen veya aynı ana üzerinde birden çok rol değişimi açıklayıcı hatayla durur. [Kontroller ve sınırlar](../../analizler/2026-10-26-taslak-sabit-kot-roller.txt). Test: `roof-level-check.cjs` (geometri + kilitler + roller + tarayıcı).
