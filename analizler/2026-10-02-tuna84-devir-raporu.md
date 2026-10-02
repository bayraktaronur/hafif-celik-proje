# 84 m² Tuna Prefabrik — kaynak aktarımı ve çalışma devri

Tarih: 2 Ekim 2026. Bilgisayar: iş bilgisayarı. Uygulama: 5.9.18.
Kapsam: Bu sohbetin kaynaklarını ve önceki bulgularını ortak depoya aktarma. Bu teslimde uygulama kodu veya müşteri çizimi düzeltilmedi. Önceki bulgular yeni ve eksiksiz bir DWG/Excel/PDF karşılaştırması yapılmış gibi yorumlanmamalı.

## Kaynaklar ve öncelik

- `referanslar/tuna-84m2/`: iki DWG, bir XLSX ve bir PDF; özgün dosya adları korundu.
- `cizimler/2026-10-02-is-kayit-5.json`: kullanıcının Yeni proje (5).json kaydının değişmemiş kopyası.
- [Kaynak envanteri](2026-10-02-kaynak-envanteri.json): her dosyanın özgün yolu, depo yolu, bayt sayısı ve SHA-256 değeri. Kaynak ve kopya hash değerleri bu teslimde karşılaştırıldı ve eşit bulundu.
- Ev kaydı `cizimler/2026-10-02-ev-kayit-11.json` ayrı tutuldu. İki JSON farklı kayıtlar; hangisinin son canlı çizim olduğu doğrulanmadı. Üzerlerine yazılmadı.
- Kullanıcı Drawing1.dwg dosyasını doğrudan imalat çizimi olarak esas almamızı istedi. Önceki büyük DWG de karşılaştırma kaynağı olarak korunuyor; aralarındaki tüm farklar henüz çıkarılmadı.
- Excel, CAD ve PVC siparişi insan eliyle ayrı hazırlanmış; uyuşmazlıkları otomatik doğru kabul etmeyeceğiz. Listeyi çizime veya çizimi listeye körlemesine uydurmayacağız.

## Önceki analiz: giriş kapısı yanındaki panel uyuşmazlığı

Yeni proje (5).json içindeki e142 duvarının aks boyu 188,25 cm. Uç payları 5 + 5 cm, net pano yerleşimi 178,25 cm. Mevcut açık dizi 57,75 + 120,5 cm; e144 dış kapı 90 × 210 cm. Kapı merkezi hat başlangıcından 123 cm uzakta.

Drawing1.dwg geçici kopyadan DXF'e çevrilerek incelendi. Girişte BC9 poliçizgisi 52,75 cm genişlikte dolgu, B3C poliçizgisi 125,5 cm genişlikte kapı panosu; kalınlıkları 10 cm. Toplam yine 178,25 cm. Dolgu üzerindeki imalat etiketi 520 mm. Excel dış kapılı karkaslı panel satırı 100 × 1250 × 2500 mm.

| Konu | Programdaki kayıt | İmalat referansı |
| --- | --- | --- |
| Dolgu yerleşim genişliği | 57,75 cm | 52,75 cm |
| Kapı panosu yerleşim genişliği | 120,5 cm | 125,5 cm |
| Net toplam | 178,25 cm | 178,25 cm |
| Dolgu kesim etiketi | Mevcut eşleme 570 mm | DWG 520 mm |
| Kapı paneli imalat eni | Mevcut eşleme 1200 mm | Excel 1250 mm |

Sonuç: toplam uzunluk aynı, ortak panel eki 5 cm farklı yerde. Kapılı panoyu koruyup yan dolgunun payını değiştirmek gerekiyor. Yeni pano merkezine ortalanırsa kapı merkezi 120,5 cm olur; kapı açıklığının kesin konumu ayrıca DWG ile kontrol edilmeli. Yerleşim genişliği ile imalat kesim eni ayrı veriler olmalı. Her ölçüden sabit pay çıkarma kuralı türetilmemeli; tüm iç kapıları 1250 mm yapmamalıyız (1220 mm iç kapı panosu da var).

**Durum: teşhis yapıldı, düzeltme uygulanmadı.** src/prefab.js pano yerleşimi ve açıklık ekleme, src/modular.js kesim eşlemeleri ilgili alanlar. Otomatik pano uyarlama, mevcut kapıyı uyarlama, geri alma/yeniden yapma ve kayıt sonrası korunma test edilmeli. Kullanıcının orijinal JSON'u değiştirilmedi.

## Önceki belge incelemelerinin özeti

- Excel'de 129 numaralı ana malzeme kalemi tespit edilmişti. Panel grubunda toplam 47 pano: 23 dış dolu, 12 iç dolu, 3 standart pencere, 2 geniş pencere, 1 vasistas, 1 dış kapı, 3 adet 1250 mm iç kapı, 2 adet 1220 mm iç kapı panosu.
- PVC PDF metni: 2 adet 158,5 × 118,5; 3 adet 117,5 × 118,5; 1 adet 58,5 × 38,5 ölçüsü. Ölçü etiketleri ve yönleri PDF görseli üzerinden sipariş çıktısı geliştirilirken tekrar doğrulanmalı. Bunları CAD nominal açıklıklarıyla doğrudan aynı ölçü kabul etmemeliyiz.
- Önceki Excel incelemesinde 1 özel + 1 baş + 6 orta + 1 yavru makas, 80 cm trapez için 24 × 5 m ve 3 × 3,05 m, 36 OSB kaydedilmişti. Bu rakamlar programın doğrulanmış metraj sonucu değildir.
- Excel panel yüksekliği 2500 mm; iş JSON'u 280 cm. Bu fark ve diğer manuel kaynak uyuşmazlıkları çözülmeden birebir metraj eşitliği ilan edilemez.
- Tam, satır satır CAD ↔ program ↔ yükleme ↔ PVC karşılaştırması henüz tamamlanmadı.

## Alınan kararlar ve istenen sistem

1. Tek proje verisinden plan, 3B, kesit, imalat, montaj, yükleme ve PVC siparişi üretilecek; her kalemin hangi nesne veya kuraldan türediği izlenebilecek. Çizimde görünmeyen sarf ve bağlantılar ayrı kurallarla hesaplanacak.
2. Çatı çiziminde varsayılan 30 cm değiştirilebilir saçak; duvar/mesnet referansı ile dış saçak sınırı birlikte saklanacak. Girintiyi takip etme veya üstünü örtme kullanıcı tercihi. Saçak metraja iki kez eklenmeyecek.
3. Ana ve yavru çatılar kendi tip, kot, eğim ve saçaklarına sahip olacak. Açık U çizimi ana çatıya yakalanacak; bağlı çatı boşluk bırakamayacak. Birleşimde dış saçak kuralı körlemesine uygulanmayacak.
4. Kat planı ve çatı planı ortak üretim yönü kullanacak. Makas dizilim, mahya ve eğim yönleri açıkça ayrılacak. Yavru çatının bölgesel makasları kat planında da görünmeli. Duvarlar sessizce taşınmayacak.
5. Veranda kat/çatı planında kesik sınır; 3B'de açık alan olarak gösterilecek. Duvar yerine seçilen direkler ve alın kaplaması modellenmeli. Kullanıcının 10 × 10 cm direk isteği geometri/ürün girdisidir, taşıyıcı yeterlilik hesabı değildir.
6. Trapez, sandviç panel, metal kiremit, shingle üst örtü seçenekleri; OSB isteğe bağlı bağımsız alt katman. Membran/nem bariyeri seçime göre listeye girecek. Yerleşim ve kesim gerçek yüzey/birleşimlerden türetilmeli.
7. H ekleri, köşe direkleri, U ve çoklu birleşimler görünüm filtreleriyle gizlenmeyecek. Kapı/pencere etiketi en/yükseklik olacak.
8. DWG/PDF içe-dışa aktarım, çok kat desteği ve arayüz sadeleştirmesi gündemde; tamamlanmış özellik olarak kaydedilmedi. Öncelik örnek imalatla doğrulama ve entegre liste kuralları.

## Uygulanmış olanlar ile bekleyenlerin ayrımı

5.9.17 çatı panel sınırlarını 3B gösterme; 5.9.18 yön değişiminde duvar, köşe payları, panel ve açıklıkları koruma sürümleri depoda mevcut. Önceki teslimde prefab, run, roof-workflow, mimari ve çatı yön/bağlantı testleri çalıştırılmıştı; bu belge tesliminde bu testler tekrar çalıştırılmadı. Kaynaklar ve müşteri çizimi değişmediği için uygulama sürümü artırılmadı.

Çatı açık U akışı ekranda mevcut olsa da kullanıcı ikinci yavru çatı bağlantısının reddedildiğini ve bazı birleşimlerin tutarsız kaldığını bildirdi. Son durumdaki tüm örnekler tekrar üretilmeden çözüldü deneme. "U sınırını bağla" tamamlanan çizimi işler; "Son köşeyi geri al" yalnız aktif taslağın son noktasını kaldırır. Boş taslakta bu eylemlerin durumu ve hata açıklamaları sadeleştirilmeli.

## Eksik / aktarılmayanlar

- İstenen AutoCAD, Excel ve PDF dosyaları arasında bulunamayan yok: 4 dosyanın tamamı kopyalandı.
- Sohbet ekran görüntüleri ve gerçek bina fotoğrafları bu teslimin AutoCAD/Excel/PDF kapsamına alınmadı; bunların Git'e aktarıldığı iddia edilmiyor.
- Geçici DXF, ham çıkarım dosyaları ve AutoCAD günlükleri gönderilmedi; özgün DWG'lerden yeniden üretilebilirler. Önceki analiz bulguları bu raporda saklandı.
- Aktif tarayıcı çizimi dışa aktarılmadı; canlı çizimin son hali Git'e aktarılmış sayılmaz. Ev ve iş JSON kayıtları ayrı yedeklerdir.
- Ev bilgisayarının bu teslimi pull ile aldığı henüz doğrulanmadı.

## Sıradaki iş

Önce güncel JSON'u seç; giriş kapısı panosu/dolgu düzeltmesini Drawing1.dwg ölçülerine göre uygula ve test et. Sonra pano/açıklık dökümünü DWG ile, malzeme dökümünü Excel ve PDF ile satır bazında karşılaştır. Farkları "program hatası / farklı ürün ölçüsü / eksik model / manuel kaynak farkı" olarak kanıtıyla ayır. Çatı ikinci yavru bağlantısı ve ortak üretim yönünü aynı doğrulama planına ekle.
