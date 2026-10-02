# Beş gerçek imalat çizimi — aks, pano ve kesim karşılaştırması

2 Ekim 2026 · İncelenen program: Prefabrikten Plan Studio 5.9.19 · DEV-012

## Sonuç

Beş dosya okunarak ana montaj planlarının geometrisi ve ölçü yazıları karşılaştırıldı. **125,5 cm tam ve 62,75 cm yarım yerleşim modülü ortak. Ancak tek bir geniş pencere panosu, tek bir kesim payı ve yalnız dik duvarları kabul eden bir sistem bu örneklerin tamamını karşılamıyor.** Programın üretim modeli bağlantı ve ürün ailesini açıkça taşımalı.

Bu inceleme programın imalata hazır olduğu onayı değildir. Kaynak çizimler ortak referanslara alındı; uygulama davranışı ve canlı müşteri planı değiştirilmedi. Uygulamadaki kesim tablosu bu analizde değiştirilmedi. Kullanıcı 42,5 cm yerleşim için 420 mm kesimi doğruladı; 415 yazısını hata olarak açıkladı. Önceki Drawing1 örneği de geçerliliğini korur; beş yeni örnek onun yerine geçmez.

## Kaynak ve yöntem

Dosyalar kullanıcının verdiği G: yollarından `referanslar/imalat-ornekleri/` altına kopyalandı. Beşinin de boyut ve SHA-256 eşitliği doğrulandı; [kaynak envanteri](2026-10-02-bes-imalat-kaynaklari.json) özgün yolları içerir. Orijinaller değiştirilmedi.

AutoCAD 2021 Core Console her dosyanın geçici kopyasını açtı. Önce özgün nesne bilgileri, ardından geçici kopyada bloklar açılarak ek geometri çıkarıldı. Ana plan alanları geometrik bağlantı kümeleri ve kesim yazılarının konumuyla ayrıldı. Dosyalarda montaj, mimari, çatı ve detay paftaları aynı model alanında tekrar ediyor: **bütün dosyadaki dikdörtgen sayısı ürün adedi değildir.**

Ana planın 6/10 cm kalınlıklı dört köşeli dik pano adayları, yakın kesim yazıları ve duvar yüzüne gelen dik kol temasları kaydedildi. Konuma göre otomatik yazı eşlemeleri aday olarak işaretlidir; kesim kuralının otomatik onayı sayılmaz. Geometri cm ölçeğindedir; kesim yazıları çoğunlukla mm. Dosya birim başlığı tek başına ölçüyü belirlemez. Türkçe metinler Windows-1254 kodlamasıyla okundu.

[Ölçü kanıtı](2026-10-02-bes-imalat-geometri.json) her çizimin kaynak hash'ini, pano köşelerini, yazı kimliklerini, temas noktalarını ve örnek pano zincirlerini içerir. `originalHandle` özgün DWG nesnesidir; blok açıldıktan sonra oluşan diğer kimlikler yalnız geçici çıkarım kaydına aittir.

Önizlemeler çıkarılan çizgilerden oluşturulmuş tanısal görsellerdir; AutoCAD'in eksiksiz pafta/PDF çıktısı değildir. Yaylar, ölçülendirme nesnelerinin grafik çizimi ve bazı blok ayrıntıları eksik olabilir. Sayısal geometri görselden değil DWG nesnelerinden okunmuştur.

## Dosya bazında bulgular

| Referans | Ana bulgu | Program açısından sonuç |
| --- | --- | --- |
| [VP 537 – 166 m²](imalat-onizleme/ornek-0.png) | Girintili, çok kollu plan; 125,5 ve 62,75 yanında 120,5 / 122,5 / 117,5 / 119,5 cm panolar. Geniş pencere 166 cm; 42,5 cm yan panolarda **415** yazısı. | Girintiler ve her duvar ucunun bağlantı payı ayrı çözülmeli. Kullanıcı doğrulaması: 415 yazım hatası; doğru kesim 420 mm. |
| [43 m²](imalat-onizleme/ornek-1.png) | Geniş pencere çevresi **100,25 + 166 + 100,25 cm**; etiketler 1000 / 1660 / 1000. Kapılı iç hatlarda 1220 ve 1170 yazıları. | Simetrik pencere yan dolgusu, tek bir standart tam pano dizisinden farklı. Kapı panosu da her zaman 125,5 cm değil. |
| [VP 517 – 68 m²](imalat-onizleme/ornek-2.png) | İki geniş pencere düzeni: 100,25 + 166 + 100,25 ve **42,5 + 166 + 42,5 cm**. İkincinin yan etiketleri **420**. | Aynı pencere farklı duvar açıklığında farklı dolgu gerektiriyor. VP 537'deki 415 yazısı kullanıcı tarafından hata olarak düzeltildi. |
| [VP 523 – 82 m²](imalat-onizleme/ornek-3.png) | **169 cm** geniş pano, **1690** etiketi ve “Profilden” notu. Yan pano 103,75 cm / 1030; başka uçta 41 cm / 410. | 160 cm pencere seçildiğinde koşulsuz 166 cm pano üretmek bu örneği karşılamaz. Profil imalatı olası ayrı tür; kullanıcı teyidi bekleniyor. |
| [VP 528 – 106 m²](imalat-onizleme/ornek-4.png) | İki eğik cumba; 45°/135° doğrultulu parçalar; **251 cm yerleşim / 2500 etiketi**. Cumba yan parçası yaklaşık 78,7419 cm geometrik kenar / 790 yazısı. | Eğik cephe, uzun pano/çerçeve ve köşe birleşimi desteklenmeli. Dik duvar kontrolü ve tek modül üst sınırı bu kapsamı karşılamaz. |

Ana alandaki dik pano dikdörtgeni adayları sırasıyla 91, 30, 47, 57 ve 66'dır. Bunlar BOM değildir; VP 528'in dört eğik parçası ayrıca kaydedildi. Çokgen/çerçeve, açıklık içi detay, eğik birleşim ve aynı parçanın farklı çizim temsilleri nedeniyle sipariş adedi bu tablodan çıkarılmamalı.

## Aks ve yerleşim zincirleri

Somut örnekler:

- VP 523 üst cephede sekiz tam pano: **8 × 125,5 = 1004 cm** yerleşim zinciri. Kaynak ölçü nesnelerinde 1014 cm dış ölçü de bulunur; pano zinciri ile dıştan dışa ölçü aynı şey değildir. Duvar dış yüzlerinin toplam 10 cm katkısı bu örnekle uyumludur.
- VP 517 üst hat: **6 × 125,5 = 753 cm**. Sol uzun hat: **7 × 125,5 = 878,5 cm**.
- 43 m² üst hat: **6 tam + 1 yarım = 815,75 cm**.
- VP 528 üst hat: **10 tam + 2 yarım = 1380,5 cm**. Kaynakta 1390,5 cm ölçü de vardır.
- VP 523 alt hat örneği: **103,75 + 169 + 103,75 + 62,75 = 439,25 cm**. Toplam modüle otursa bile içteki her panel eki 62,75 cm ızgarasına oturmaz.
- VP 517 iç hat: **120,5 + 125,5 + 62,75 + 122,5 = 431,25 cm**. İki uç farklı karşı duvar kalınlığına/bağlantısına göre kısalır.

Sonuç: yapı aksı, dış yüz, panel başlangıcı ve H ekinin konumu ayrı veri olmalı. Özel panonun ekini ızgaraya zorlayarak düzeltmek gerçek imalat dizisini bozabilir. Geçerli özel pano için neden ve kaynak gösterilmeli; bütün aks uyarıları topluca kapatılmamalı.

## Kesim ve uç payı kanıtları

| Yerleşim / geometri (cm) | Kaynak yazısı (mm) | Kanıt / yorum |
| --- | --- | --- |
| 62,75 | 625 | Beş planda tekrar ediyor. |
| 120,5 | 1200 | Beş planda tekrar ediyor; 125,5−5 ile uyumlu. |
| 122,5 | 1220 | Beş planda tekrar ediyor; 125,5−3 ile uyumlu. |
| 117,5 | 1170 | 43 m²: pano 3A4681, yazı 3A4688; 166 m²'de de var. 125,5−5−3 ile uyumlu. |
| 119,5 | 1190 | VP 537: pano 3AC038, yazı 3AC03B. 125,5−3−3 ile uyumlu. |
| 59,75 | 590 | 43 m²: 3A465E / 3A465F; 62,75−3 ile uyumlu. |
| 57,75 | 570 | VP 517, VP 523, VP 528; 62,75−5 ile uyumlu. |
| 100,25 | 1000 | 43 m²: 3A45A4 / 3A45A5; VP 517'de de var. |
| 103,75 | 1030 | VP 523: 3A45F4 / 3A45F5, 3A4636 / 3A4637, 3A463B / 3A463C. |
| 41 | 410 | VP 523: 3A466F / 3A4670. |
| 166 | 1660 | VP 537, 43 m², VP 517. |
| 169 | 1690 | VP 523: 3A4699 / 3A469C ve 3A469E / 3A46A1; “Profilden” 3A469D / 3A46A2. |
| 251 | 2500 | VP 528: 3A45FC / 3A45FD ve 3A46F1 / 3A46F2. |
| 42,5 | **420 — kullanıcı onaylı** | VP 537: 3ABF1D / 3ABF1E =415 yazıyor; kullanıcı bunun yazım hatası olduğunu açıkladı. VP 517: 3A4912 / 3A4913 =420 doğru. 42,5 cm H payı dâhil yerleşim, 42 cm gerçek kesim. Kaynak DWG değiştirilmedi. |
| yaklaşık 78,7419 | 790 | VP 528 eğik cumba yanları. Bu ölçü, döndürülmüş dikdörtgenin gerçek kenarıdır; X/Y kutu genişliği değildir. Kesim boyu/yuvarlama/çizim sapması ilişkisi henüz doğrulanmadı. |

Yukarıdaki çıkarma eşitlikleri ölçülerle uyumludur; her uçta profil payının kesin üretim tarifini tek başına kanıtlamaz. 42,5→420 eşlemesi kullanıcı tarafından doğrulandı ve uygulama kataloğuna alınacak kuraldır. Diğer yeni değerleri doğrulamadan topluca eklemek doğru değildir. Kesim anahtarı ürün ailesi + uç bağlantıları + duvar kalınlığı + kaynaklı ölçü olmalı.

## H, U ve köşeler

- Dik duvarlarda tam/yarım eklerin bulunduğu sistem tekrarlanıyor. 10 cm dış ve 6 cm iç duvar geometrisi, 5 cm ve 3 cm uç paylarıyla uyumlu. Köşedeki devam eden hat ve karşı duvar yüzü dikkate alınmalı; iki uca aynı pay koşulsuz uygulanmamalı.
- Beş örnekte toplam sekiz geometrik temas adayında, dik gelen kol **125,5 cm ana panonun 62,75 cm noktasına** geliyor. Bu, kullanıcının tam pano ortası çektirme U tarifini destekleyen konum kanıtıdır; profil kesitini ve adedini tek başına onaylamaz.
- VP 528'de bir farklı aday var: gelen kol **3A479F**, ana pano **3A480A**. Ana pano 122,5 cm; temas başlangıçtan yaklaşık **59,7497 cm**, geometrik ortadan yaklaşık **1,5003 cm** uzakta. `62,75−3=59,75` nominal modül merkezi ile uç payının birlikte korunmasına uyuyor. **Bu bir yorumdur; gerçek bağlantı detayı henüz doğrulanmadı.** Motorun yalnız kesilmiş panonun geometrik merkezini şart koşması da hatalı olabilir.
- Temas tespiti sadece dik dört köşeli pano yüzlerinde çalıştı; bütün T/X/köşe bağlantılarının sayımı değildir. Çizimdeki elektrik işaretleri U/H profili olarak sayılmadı.
- H3/X, serbest uç kapama U'su, çektirme U ve köşe direği aynı stok kalemi varsayılmamalı. Bu dosyaların varlığı profil kesitlerini/imalat deliklerini kendiliğinden doğrulamaz.
- H, üçlü/dörtlü birleşim, U ve köşe direkleri her görünümde görünür kalacak; önceki kullanıcı kuralı değişmedi.

## Kapı, pencere, yükseklik ve çatı

Kapı kasası/boşluğu ölçüleri kullanıcı talimatıyla bu aşamada değiştirilmedi. Örneklerde kapılı panoların 1200, 1220, 1170, 1190 gibi farklı boylarda bulunması, kapı sembolü ile pano ürününün ayrı tutulması gerektiğini gösteriyor. Pencere etiketleri 119/120, 160/120, 160/180, 60/40, 50/180 vb.; aynı genişlikte farklı yükseklik seçimi ürün ailesinin parçası olmalı.

2500 mm bina yüksekliği yazıları ve ayrı panel görünüşleri var; bunlar önceki 250 cm kullanıcı kararıyla uyumlu. Ancak aynı “2500” sayısı VP 528 planında yatay parçanın boyu olarak da geçiyor. Metni konum/bağlam olmadan yükseklik kabul etmek yanlış olur.

Dosyalarda baş, orta, özel baş/orta, cumba ve yavru makas notları var. Bu, tek düzenli makas dizisinin her ev için yeterli olmadığını gösteriyor. Bu çalışmada çatı elemanlarının bütün kesim/mesnetleri eşlenmedi. e107 için önceki makas/H uyarısı gerçek taşıyıcı rol ve detay incelenmeden otomatik düzeltilemez.

## Programda izlenecek sıra

1. **Üretim kataloğu:** standart kapalı, kapılı, pencereli, profilden geniş açıklık, uzun/cumba parçası; her biri kaynaklı yerleşim ve kesim bilgisiyle. 42,5→420 teyit edildi; 166/169 ürün ayrımı teyit bekliyor.
2. **Bağlantı modeli:** H/H3/X/U/köşe, nominal aks ve yerel uç payı. Görünür panel merkezi ile nominal modül merkezi ayrı hesaplanmalı.
3. **Dizilim motoru:** kapı/pencereyi uygun ürünle, yan dolgular ve gerçek bağlantı paylarıyla birlikte çözmeli. Karşı hatları gereksiz kaydırmamalı.
4. **Eğik cumba:** açı, gerçek kenar boyu ve birleşim kesimi tanımlanmalı. Mevcut “yalnız yatay/dikey” uyarısı bu ürün türünde uygun alternatif kurala bağlanmalı.
5. **Doğrulama:** önce bu beş örnekte pano zincirlerini/bağlantıları koruyan ayrı JSON kontrol planları; sonra kesim listeleri ve montaj paftaları. Orijinal müşteri çizimleri üzerinde otomatik dönüşüm yapılmayacak.

DEV-012 açık: karşılaştırma tamamlandı; genel üretim motoruna uygulama ve üretici teyitleri bekliyor. DEV-006 Excel/PVC ürün eşleme, DEV-011 mesnet incelemesi devam ediyor. Bu beş yeni örneğe ait Excel gönderilmedi; ürün listesi teyidi eksik.

## Tekrar üretim / kontroller

Proje kökünde `tools/extract-manufacturing-dwgs.ps1` kaynak hash'lerini kontrol ederek geçici kopyaları çıkarır. Ardından `node tools/analyze-manufacturing-dwgs.cjs` ölçü kanıtını yeniden üretir. AutoCAD 2021 gereklidir; bu bir genel DWG içe aktarma özelliği değildir. Sayısal çıkarım beş dosyada başarıyla tamamlandı; özgün kaynak kopyalarının hash'leri korundu. Görsel ana plan kontrolleri yapıldı. Uygulama kodu değişmediği için sürüm 5.9.19 kaldı.

## Kullanıcı düzeltmesi — 2 Ekim 2026

42,5 cm H payı dâhil doğru yerleşim ölçüsüdür; imalat kesimi 42 cm / 420 mm olmalıdır. VP 537 içindeki 415 yazısı tamamen yazım hatasıdır. Bu karar kullanıcı açıklamasıyla kesinleşti; kaynak DWG korunarak raporda düzeltildi. Katalog uygulaması sonraki sürüm işidir.
