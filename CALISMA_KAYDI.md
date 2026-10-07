# Çalışma ve bilgisayar devir geçmişi

Her anlamlı teslimde yeni tarihli kayıt eklenir. Eski karar değişirse geçmiş silinmez; yeni kayıtta hangi kararın değiştiği belirtilir. Güncel açık işler DEVAM.md dosyasındadır. Bu günlük tüm sohbetin otomatik kopyası değildir.

## 2 Ekim 2026 — Ev bilgisayarı — devam düzeninin kurulması

- Kullanıcı gündüz işte, gece evde aynı programı geliştireceğini belirtti. Kodun yanında kararlar, analizler, referanslar ve açık işler de iki bilgisayarda erişilebilir tutulacak.
- 5.9.18 GitHub'dan alındı. Çatı panel sınırları 3B gösterimi ve yön değişiminde duvar/panel koruması mevcut.
- DEVAM.md ile ortak durum kaydı oluşturuldu; AGENTS.md her başlangıçta okuma ve her anlamlı teslimde güncelleme/gönderme kuralıyla genişletildi.
- Mevcut `Yeni proje (11).json` dosyası orijinali korunarak `cizimler/2026-10-02-ev-kayit-11.json` olarak yedeklendi. PlanProject.validate ile doğrulandı; 36 duvar ve 26 tefriş. SHA-256 DEVAM.md içinde. En son canlı plan olduğu bilinmiyor.
- Bu teslim belge ve çizim yedeğidir; uygulama kodu değişmedi, sürüm 5.9.18 olarak kaldı.
- Açık işler: DEV-001 AutoCAD dosyası/analizi eksik; DEV-002 son plan doğrulanmalı; DEV-003 iş bilgisayarı bu kuralları almalı; DEV-004 sohbet bağlantısı kurulmadı.
- Sıradaki adım: İş bilgisayarında Git güncellemesi yap, AGENTS.md ve DEVAM.md oku, önceki AutoCAD sohbetinin kaynağını ve analizini ortak dosyalara aktar. Sonra bu günlüğe kaynaklar ve sonuçlarla yeni kayıt ekle.

## 2 Ekim 2026 — İş bilgisayarı — kaynak ve analiz aktarımı

- Temiz main dalı fetch ve pull --ff-only ile d526e03'ten 5c9a9d0'a güncellendi. AGENTS.md, DEVAM.md, CALISMA_KAYDI.md okundu; DEV-003 ilk devir kontrolü yapıldı.
- Kullanıcının açık isteğiyle iki DWG, yükleme XLSX'i ve PVC PDF'i referanslar/tuna-84m2 altında; Yeni proje (5).json ayrı tarihli cizimler kaydı olarak kopyalandı. Orijinallere dokunulmadı. Beş kaynak/kopya SHA-256 karşılaştırması eşit; yollar ve hash'ler analizler/2026-10-02-kaynak-envanteri.json içinde.
- Önceki bulgular, kaynak önceliği, çatı/üretim kararları ve eksik işler analizler/2026-10-02-tuna84-devir-raporu.md içinde raporlandı. DEV-001 tamamlandı. DEV-005–010 ile açık işler sabitlendi; DEV-002/004 korundu.
- İstenen dört belge arasında eksik yok. Ekran görüntüleri, geçici DXF/ham çıktılar ve canlı tarayıcı kaydı bu aktarımın dışında. Son canlı plan ve evde yeni teslimin alınması doğrulanmadı.
- Kod değişmedi; sürüm 5.9.18. Bu teslimde kontroller dosya bütünlüğü, JSON okunabilirliği, Git kapsamı ve gönderim doğrulamasıdır; uygulama testleri tekrar çalıştırılmadı.
- Sıradaki adım: güncel planı belirlemek, DEV-005 giriş kapısı/dolgu düzenini imalat referansına uydurmak ve regresyon testleriyle doğrulamak; ardından DEV-006 tam liste karşılaştırması.

- Gönderim kanıtı: kaynak/rapor teslimi b899d5cc97dc1286ce1aa1310b74afa58c937c2c commit ile main dalına gönderildi; ls-remote refs/heads/main ile yerel HEAD aynı. İstenen belgelerin gönderilemeyeni yok.

## 2 Ekim 2026 — Ev bilgisayarı — iş tesliminin alınması

- Kullanıcının güncelleme isteğiyle fetch ve pull --ff-only yapıldı; 4c2f1c4 teslimi alındı. Yerel Yeni proje (11).json korundu.
- AGENTS.md, DEVAM.md, bu günlük, Tuna 84 m² devir raporu ve kaynak envanteri okundu.
- İki DWG, bir XLSX, bir PVC PDF ve iş planı JSON'unun tamamı envanterdeki bayt sayısı ve SHA-256 değerleriyle eşleşti. İş planı PlanProject.validate ile geçerli bulundu.
- DEV-003 ilk karşılıklı devir tamamlandı. Kod değişmedi; uygulama sürümü 5.9.18. Bu adım belge/dosya aktarım doğrulamasıdır; DWG/Excel/PDF analizi yeniden yapılmadı, rapordaki bulgular devralındı.
- DEV-002 en son canlı plan belirsizliği sürüyor; tarayıcı çizimi değiştirilmedi. DEV-004 ve DEV-005–009 açık. Sıradaki uygulama işi, güncel plan belirlendikten sonra Drawing1.dwg referansıyla giriş kapısı panosu/dolgu farkının giderilmesi ve regresyon kontrolü.

## 2 Ekim 2026 — Ev bilgisayarı — Drawing1 / iş JSON ölçülü karşılaştırması

- Kullanıcı Drawing1.dwg'yi imalat referansı, iş plan yedeğini karşılaştırma hedefi olarak belirledi. Panel yüksekliğini 250 cm istedi; kapı ölçülerine bu aşamada takılınmamasını ve programdaki ölçülerin korunmasını belirtti.
- AutoCAD 2021 Core Console ile geçici DWG kopyasından koordinatlar çıkarıldı. INSUNITS mm olsa da panel/duvar geometrisi cm ölçeğinde; dönüşüm ve kaynak hash'i analizler/2026-10-02-drawing1-geometri.json içinde. Orijinal beş kaynak hash'i değişmedi.
- Dış duvar aksları eşleşti. JSON'da iki bölme hattı, beş iç kapı, altı pencere ve veranda eksikti. Giriş paneli 52,75+125,5; mutfak cephesi 71,375+166+71,375; salon cephesi 102,75+166+102,75 olarak ayrı kontrol taslağında düzeltildi. Mevcut dış kapı ve eski düğüm koordinatları korundu. Ufak DWG çizim sapmaları raporda belirtilerek ortak dik aksa normalleştirildi.
- Yeni kaynak/çıktılar: analizler/2026-10-02-tuna84-karsilastirma.md ve .json; cizimler/2026-10-02-tuna84-dwg-esleme-taslak.json; tools/compare-tuna84.cjs. Canlı tarayıcı planı ve orijinal JSON değişmedi.
- 5.9.19 dört kaynaklı kesim eşlemesi ekler (52,75→520; 71,375→710; 102,75→1020; 166→1660). Genel otomatik pano kuralı veya bilinmeyen ölçüler için çıkarma formülü eklenmedi.
- Doğrulama: build başarılı; prefab 77/77, temel 31/31; karşılaştırma betiği 49 pano kimliğini, 6 kapı/6 pencere/7 mekânı, 250 cm, mevcut düğümleri/dış kapıyı ve JSON tekrar açmayı doğruladı. 14 plan uyarısı gizlenmeden kayıtlı.
- Sonraki işler: DEV-011 e107 makas/H mesnet uyuşmazlığı ve üretim detayları; DEV-006 Excel/PVC satır eşleme (47 ürün / 49 geometrik yuva farkı). Çatı, tesisat ve veranda direk/kiriş imalatı tamamlandı sayılmıyor. DEV-004, DEV-007–009 açık kalır.

## 2 Ekim 2026 — Ev bilgisayarı — Genel imalat kural denetimi

- DEV-012: engine/prefab/modular/roof-workflow kaynakları ile Drawing1 ölçü kanıtları karşılaştırıldı. İmalat kural matrisi, belirsizlikler ve kabul sırası analizler/2026-10-02-uretim-kural-denetimi.md dosyasına kaydedildi.
- Bağımsız tarayıcı denetimi başarılı: ek üzerindeki T=H3; ortadaki T=U; merkez dışındaki T de U. Bu son davranış üretim kuralı olarak onaylanmış değildir. Taslak 49 pano, 29 H, 7 H3, 3 U, 8 köşe ve 14 uyarı veriyor; bağlantı adetleri CAD ile bağımsız doğrulanmadı.
- Mevcut kesim tablosu yalnız genişliğe bakıyor; bağlantı/ürün ailesi kataloğu gerekli. 49 yuva/47 ürün eşlemesi, U kullanım sınırları, profil kesitleri ve makas taşıyıcı rolü açık. İki farklı üretim DWG ve varsa ilgili Excel/profil detayları sonraki kaynaklar.
- Kod davranışı ve canlı çizim değiştirilmedi; sürüm 5.9.19. Yeni denetim betiği çalıştırıldı; uygulama testleri değişiklik olmadığı için tekrarlanmadı. Kullanıcının özgün Yeni proje (11).json dosyası kapsam dışı korunuyor.

## 2 Ekim 2026 — Ev bilgisayarı — Beş imalat DWG karşılaştırması

- Kullanıcının belirttiği beş G: dosyasına erişildi; yalnız bu dosyalar ortak referanslara kopyalandı ve SHA-256 eşitliği doğrulandı. AutoCAD2021 Core Console beş geçici kopyayı başarıyla okudu; kaynaklar korunuyor.
- Ana montaj planları, ölçü yazıları, pano zincirleri ve dik yüz temasları analiz edildi. Rapor: analizler/2026-10-02-bes-imalat-karsilastirma.md. Sayısal kanıt, envanter ve beş tanısal plan önizlemesi kaydedildi. Araçlar: tools/extract-manufacturing-dwgs.ps1, tools/analyze-manufacturing-dwgs.cjs.
- Yeni kritik kanıtlar: 42,5 yerleşime415/420 çelişkisi; Profilden169/1690;100,25/1000;103,75/1030;251/2500; dört45derece cumba kenarı yaklaşık78,7419 ve790 yazısı. Bunlar tek sabit kesim payı veya koşulsuz160→166 kuralının yeterli olmadığını gösteriyor.
- Sekiz125,5pano orta temas adayı ve bir122,5panoda59,75konumu kaydedildi. Temas geometrisi profil türünün fiziksel onayı değildir. Sayısal dikdörtgen aday adetleri BOM olarak sunulmadı.
- Kullanıcıya415/420 ile Profilden169/166 farkı soruldu; henüz cevap kaydedilmedi. DEV-012 uygulama/katalog ve DEV-006/011 doğrulamaları açık. Kod davranışı/canlıplan değişmedi; sürüm5.9.19. Sonraki iş kaynaklı üretimkataloğu ve karşılaştırma planlarıdır.

- Kullanıcı düzeltmesi: 42,5 cm H payı dâhil yerleşim, doğru kesim 420 mm; 415 tamamen yazım hatası. Bu belirsizlik kapandı. 169/Profilden açıklaması bekleniyor; üretim kataloğuna 42,5→420 uygulanacak. Kaynak DWG değiştirilmedi.

## 2 Ekim 2026 — Ev bilgisayarı — 5.9.20 Metin komutu

- Kullanıcı 1690/Profilden örneğinin 1660 panel kabul edilmesini ve serbest text komutu eklenmesini istedi. Üretim karar kayıtları güncellendi; kaynak çizimler korunuyor.
- DEV-013 tamamlandı: bağımsız annotations verisi, eski kayıtlarla uyumlu şema, metin ekleme/düzenleme/taşıma/silme, boyut/açı, JSON/yerel yedek/geri alma ve PNG sınırları. Uygulama5.9.20; imalat sayıları değişmez.
- tests/text-notes.cjs gerçek tıklama/sürükleme/düzenleme, JSON tekrar açma, PNG, geri/ileri alma, silme ve şema doğrulamasını geçti. Temel31/31 ve prefab77/77 başarılı. Canlı kullanıcı sayfası yenilenmedi ve çizimi değiştirilmedi. DEV-012/006/011 açık.

## 2 Ekim 2026 — Ev bilgisayarı — 5.9.21 veranda ölçüsü

- Kullanıcı mevcut verandanın her projede değişen net derinlik/genişliğinin ev duvarları korunarak düzenlenmesini onayladı. DEV-014 tamamlandı: ayrı veranda-core ve veranda-ui; net ölçü, sabit taraf, bağlı dik kenar hareketi, ev bağlantısında bildirilen kademe, çakışma/reversal koruması. Kademe gerekmez hale gelince kaldırılır.
- Eski aks uzunluğu alanı veranda için net ölçü komutuyla değiştirildi; ölçü çizgisine çift tık açar. İşlem tek geri alma adımıdır. Mevcut DWG/JSON referansları ve canlı plan değiştirilmedi.
- Yeni veranda testi geçti (69,5/507 örnekleri, merkez, tekrar boyutlandırma, duvar/kapı/oda korunması, UI, JSON). Temel31/31, prefab77/77 ve metin testleri başarılı; build üretildi. Sürüm5.9.21. Eğik veranda, direk/kiriş ve çatı otomasyonu bu işin dışında; DEV-012/006/011 açık.

## 2 Ekim 2026 — 5.9.22 Plan panosu / DEV-015

- DEV-015 tamamlandı: Alan seç ile tamamen çerçeve içinde kalan nesneleri seçme; Ctrl+A tümünü seçme, Ctrl+C kopyalama, Ctrl+X kesme, Ctrl+V ardından tıkla konumlandırma, Esc iptal. Kesme/yapıştırma tek adımda geri alınır.
- Duvar açıklıkları ve bağlı prefabrik hat birlikte taşınır. Yeni nesne kimlikleri, oda türleri, metinler, tefrişler, tezgâhlar, seçili çatı bağlantıları ve malzemeler korunur. Boş projeye kaynak üretim ayarları da aktarılır. Mevcut duvarlara temas/kesişme/üst üste binme reddedilir; otomatik duvar birleştirme yapılmaz. Özel panel uyarıları gizlenmez.
- Pano Yeni/Aç ve aynı tarayıcı kaynağında yeniden açma boyunca yerel depoda korunur. Bu, Windows/AutoCAD panosu veya iki bilgisayar arası aktarım değildir; dosya yedeği yerine geçmez. Alan seçimi kesişen nesneleri değil tamamen kapsananları alır; bağlı panel hattı koruma amacıyla genişletilebilir.
- Kontroller: temel31/31, prefab77/77, veranda, metin ve yeni tests/plan-clipboard.cjs başarılı. Yeni test kopya kimlikleri, çatı bağlantıları, malzemeler, çakışma, gerçek fare/klavye kullanımı, kes/geri al, pano yeniden açma ve oda/ayar korumayı kapsar. Dağıtım HTML üretildi. Canlı plan ve kullanıcının özgün JSON dosyası değiştirilmedi. DEV-006/011/012 açık kalır.

## 2 Ekim 2026 — Ev bilgisayarı — 5.9.23 PDF / DXF dışa aktarma / DEV-016

- DEV-016 tamamlandı: üstte PDF çıktı ve DXF çıktı. PDF kâğıt A4–A0, yatay/dikey, 1:20/50/100/200; gerçek ölçek korunur, sığmayan sayfa engellenir. Önizleme, başlık, 1 m ölçek çubuğu ve %100 yazdırma notu var. PDF raster görseldir; A4–A2 300 dpi, A1 200, A0 150 dpi. Vektör PDF veya PDF içe aktarma değildir.
- DXF AutoCAD 2000 biçimi, 1:1 milimetre. Duvar konturlarında kapı/pencere boşlukları gerçekten kesilir; oda/tarama, makas, panel bağlantısı, donatı/metin ve ölçü katmanları ayrıdır. Yazılı ölçüler mevcut cm gösterimini korur. Eğriler düzenlenebilir çoklu çizgi, ölçüler çizgi/yazı olur; dinamik DIMENSION, parametrik duvar veya üretim nesnesi değildir. Koordinat Y ekseni CAD için ters çevrilir. Doğrudan DWG çıktısı ve PDF/DWG/DXF içe aktarma hâlâ açık.
- Aynı çizim fonksiyonları görünüm filtreleriyle kullanılır; H/U/köşe bağlantıları korunur. Ekran seçimi, zoom, plan, geri alma ve orijinal referans dosyaları değişmez. Çıktı yalnız kat planıdır; çatı 3B/imalat onayı değildir. JSON ana düzenlenebilir kayıt olarak saklanmalıdır.
- Kontroller: tests/plan-export.cjs gerçek indirme, taşma engeli, kapı boşluğu, Unicode, tefriş, ekran zoom bağımsızlığı, filtre/H korunması ve hata sonrası durum geri yükleme testleri. tests/verify-export-pdf.py PDF sayfa ve gömülü görüntü kontrolü; 500 cm duvar + uç payları 1:50 ölçekte görüntüden 101,94 mm (beklenen 102 mm, tolerans 0,4 mm). PDF önizlemeleri gözle kontrol edildi.
- AutoCAD 2021 Core Console Tuna DXF (916 nesne) ve tefrişli ev DXF (743 nesne) açıldı; INSUNITS=4, AUDIT toplam hata 0 / düzeltilen 0. Yeniden çalıştırılabilir kontrol tools/verify-export-autocad.ps1. Geçici dosyalar artifacts/export içinde, depoya eklenmez. Temel 31/31, prefab 77/77; veranda, metin ve pano regresyonları başarılı.
- Teknik format kaynağı: Autodesk DXF LWPOLYLINE ve TEXT referansı: https://help.autodesk.com/cloudhelp/2018/ENU/AutoCAD-DXF/files/GUID-748FC305-F3F2-4F74-825A-61F04D757A50.htm ve https://help.autodesk.com/cloudhelp/2015/ENU/AutoCAD-DXF/files/GUID-62E5383D-8A14-47B4-BFC4-35824CAE8363.htm .
- DEV-006/011/012 imalat doğrulaması ve DEV-009 içe aktarma/çok kat açık kalır. Yeni müşteri çizimi bu işlemde oluşturulmadı veya aktarılmadı; mevcut canlı sayfa değiştirilmedi.

## 2 Ekim 2026 — Ev bilgisayarı — 5.9.24 Ortak PDF/PNG anteti / DEV-017

- DEV-017 tamamlandı. Kullanıcı PDF ve PNG için logo/müşteri/bina/tarih/çizen/proje no içeren profesyonel antet, antetli/antetsiz seçim, dikey/yatay önizleme ve uygun yerleşim istedi. Ortak çıktı ekranı, iki alternatif önizleme, otomatik yön ve sığan en büyük standart ölçek (1:20/50/100/200) eklendi. Manuel ölçekte sığmayan çıktı reddedilir; çizim esnetilmez. Antetsiz seçenek firma/alt bilgi bandını da kaldırır.
- Firma, müşteri, adres, proje no, tarih, çizen, kontrol eden, revizyon, pafta, başlık, not ve iletişim alanları var. Yapı sistemi, duvar yüksekliği/kalınlığı, kapalı/veranda aks alanları plandan türetilir. Bilinmeyen onay veya çatı yüksekliği uydurulmaz. Logo dosyası depoda bulunmadı; firma yazısı yedek gösterimdir. PNG/JPG/WebP yükleme PNG'ye dönüştürülür; logo ve alanlar sheetInfo içinde JSON/yerel kurtarma/geri alma ile korunur. SVG/uzak URL kabul edilmez. Kaydet veya çıktı indirme düzenlenmiş bilgileri projeye işler; Vazgeç uygulamaz.
- PNG de aynı kâğıt/antet yerleşiminden oluşturulur; doğru dpi pHYs bilgisi yazılır. PDF/PNG görsel olarak denetlendi. Çıktı kaynak çizimini değiştirmez; antet verisi ayrı tutulur. Gerçek logo için kullanıcı çıktı ekranındaki Logo seç alanını kullanmalıdır; testteki LOGO TEST yalnız artifacts/export içinde, uygulamaya gömülü değildir.
- Kullanıcı kararı: prefabrik iç/dış duvar yüksekliği aynıdır; dış yükseklik alanı prefabrik modunda gizlendi, hafif çelik modunda kalır. Eski dy değerleri silinmedi; prefabrikten hafif çelik dışa aktarımında eşit kat yüksekliği kullanılır. Çatı yüksekliği bu alana bağlanmadı. Alçıpan fire yüzdesi Proje ayarları bölümünden Metraj Listesi'ne taşındı; değer ve hesap korunur.
- Kontroller: tests/title-block.cjs logo/müşteri kaydı, JSON yeniden açma, iptal, sayfa yenileme, PDF/PNG/antetsiz indirme, otomatik yerleşim, model koruma, sistem değişimi ve fire alanı yerini doğruladı. Temel31/31, prefab77/77; metin/veranda/pano ve PDF/DXF testleri geçti. PDF bağımsız ölçek ölçümü 101,94 mm (beklenen102 mm); PNG300 dpi bilgisi doğrulandı. Dağıtım HTML üretildi. Canlı kullanıcı çizimi ve kaynak JSON dosyaları değiştirilmedi.
- DEV-006/011/012 imalat doğrulaması, DEV-009 içe aktarma/çok kat ve diğer açık işler devam eder. Kullanıcı canlı çizimini diğer PC'ye taşımadan önce JSON olarak kaydetmelidir; antet bilgisi de bu kayda dahildir.

## 2 Ekim 2026 — Ev PC — 5.9.25

- Tuna DWG blokları yeniden incelendi; referans pencere bloklarının sade geometrisi esas alındı. Her model paneli ayrı DXF INSERT, açıklıklı paneller yan parçalar ve sembolle birlikte; nesne bazlı tefriş/tezgâh/metin/bağlantı blokları.
- Prefabrik yükseklik tek kontrol: Panel / duvar yüksekliği. Geri alma ve üretim yüksekliği birlikte güncellenir.
- Kontrol: PDF/DXF testleri, title-block, prefab 77/77; AutoCAD Core Console iki DXF için AUDIT 0 hata, mm birimi. Genel testte eski dropdown sıra varsayımı yeni arayüze uyarlandı.
- Rapor: analizler/2026-10-02-tuna84-dxf-bloklari.md. Canlı çizim ve takip dışı Yeni proje (11).json korunmuştur. DEV-006/011/012 ve içe aktarma açık kalır.

## 3 Ekim 2026 — Ev PC — 5.9.26 / DEV-019

- Kullanıcı parçalı ölçü/tarama ve Tuna ile uyuşmayan köşe sembollerini bildirdi. Ekran çizgilerini körlemesine bloklamak yerine ölçüler native DIMENSION, taramalar oda başına native HATCH oldu. Etiket çevresinde tarama boşluğu bırakılır.
- Sade plan varsayılan, Panel detayı ve Ekrandaki detaylar seçenekleri eklendi; tarama ayrı seçim. Kaynak model/filtreler değişmez. H/U/köşe her modda kalır. Köşe10×5 dışa oturan kontur, veranda serbest ucunda10×10/8×8 çizim.
- Kontroller: CAD özel testleri; temel31/31, PDF/DXF ve antet testleri. AutoCAD dört örnekte AUDIT0; DIMENSION/HATCH varlığı, mm geometri / cm ölçü stili. Grip ucu100mm taşınınca gösterilen ölçü10cm artar. AutoCAD PDF görsel kontrolü başarılı.
- Tuna model nesneleri: önceki783; yeni tam193, sade139, panel191. Panel49 ayrı blok korunur. Üretim kuralları değişmedi; DEV-006/011/012 açık.
- Rapor: analizler/2026-10-03-sade-dxf.md. Kullanıcının canlı çizimi ve takip dışı JSON korunmuştur.

## 3 Ekim 2026 — Ev PC — 5.9.27 / DEV-020

- HATCH sınırının oda aks poligonu olması duvarlara taşmaya neden oluyordu. Duvar şeritleri ve direk konturları plan alanından çıkarılarak kapalı net tarama döngüleri üretildi; açıklık eşiklerinde de duvar yüzünde durur. Native HATCH ve etiket boşlukları korunur.
- Kapalı veranda dış kesik çizgisi10cm direğin dış yüzüne5cm ötelenir. Dik köşeler kesiştirilir; aynı doğrultudaki duvar/veranda geçişinde hatalı çapraz birleşme düzeltilir. Tarama direk içine girmez.
- tests/cad-boundaries.cjs75708örnek nokta: duvar/direk çakışması0, eksik alan0; ters poligon yönünde aynı alan; üç dış kenarda5cm. CAD/PDF testleri başarılı; AutoCAD dört dosya AUDIT0 ve PDF görsel kontrolü.
- Mevcut aks/ölçü/alan değişmedi. Sürüm5.9.27. Kullanıcı Yeni proje (11).json korunmuştur. Açık üretim işleri değişmedi.

## 3 Ekim 2026 — Ev PC — Yükleme listesi bağlantı önerisi

Kullanıcının sorusu üzerine kaynak Excel salt okunur incelendi.47panel, metal kulak/dübel ayrımları, PVC sipariş ölçüleri ve alternatif tesisat sayfaları kayda alındı. Satır/ürün/nesne eşleme ve revizyonlu sevkiyat yaklaşımı önerildi; uygulama veya onaylı reçete değildir. DEV-006 devam eder. Rapor: analizler/2026-10-03-yukleme-listesi-baglanti.md. Kod ve kullanıcı planı değişmedi.


## 3 Ekim 2026 — Ev PC — 5.9.28 / DEV-021

- Kullanıcı otomatik yükleme listesine başlanmasını istedi. Panel/bağlantı/kapı-PVC geometrik sayımı, grup/arama/durum filtreleri, kaynak duvarı gösterme, gerekçeli manuel miktar ve ek malzeme arayüzü eklendi.
- Tuna Excel ana sayfasından 37 referans satırı (panel9–16, metal19–42, açıklık45–49) salt okunur karşılaştırma için eklendi; fiyat ve alternatif tesisat sayfaları alınmadı. Eşleme kullanıcı kararıdır; reçete onayı değildir.
- Geometrik adet ile sevk taslağı ayrı. Kontrol planı49 panel/12 açıklık; Excel47 pano farkı çözülmedi. Eksik kurallar0 gösterilmez. İlgili kaynak değişince manuel karar geçersizleşir; karşılıksız kalan eski kararlar listelenip geri alınabilir biçimde kaldırılabilir.
- Kararlar JSON, geri/ileri alma ve tarayıcı kurtarmasında korunur. CSV Türkçe/BOM, proje/sürüm/tarih/kapsam ve kaynak kimlikleri içerir; formül başlatan metinler etkisizleştirilir. Bu aşamada XLSX/PDF yükleme çıktısı, donmuş sevkiyat onayı ve otomatik stok kesim planı yoktur.
- Kontroller: temel31/31; tests/loading-list.cjs sayım, düzenleme/eşleme, geri alma, JSON, gerçek CSV, değişmiş/kayıp kaynak, eski düzeltmeyi kaldırma, yerel kurtarma, geçersiz içe aktarma ve eski JSON uyumu; title-block ve plan-export başarılı. Yükleme arayüzü görsel kontrol edildi.
- Kullanıcı çizimi ve takip dışı JSON korunmuştur. DEV-006/011/012 ve diğer açık işler devam eder. Sıradaki iş:47/49 stok-kesim farkı, metal ve PVC reçeteleri. Ayrıntı: analizler/2026-10-03-yukleme-listesi-ilk-surum.md.


## 3 Ekim 2026 — Ev PC — 5.9.29 / DEV-022

Kullanıcının makas altında H kulaklı, dış duvarda ayrıca dübelli kuralı yükleme sınıflandırmasına işlendi. İç dübel ve makas dışı ayrımlar bilinmiyor tutuldu. Makas açıklığı/yönü/mesneti ve yerel dış duvar kontrol edilir; ilgili makas değişince manuel karar yeniden kontrol ister. Kontrol taslağı21 dış,12 iç olumlu eşleşme ve3 bekleyen H verdi; Excel farkları raporda açık. tests/loading-h.cjs ve loading-list.cjs geçti. Canlı çizim ve takip dışı JSON korunmuştur. Rapor: analizler/2026-10-03-h-kulak-dubel.md. Sıradaki iş kalan H kuralları ve Excel farklarının doğrulanması; diğer açık işler devam eder.


## 3 Ekim 2026 — Ev PC — 5.9.30 / DEV-022

Kullanıcı makas altına gelmeyen dış H'nin kulaksız–dübelli olduğunu doğruladı. Sınıflandırma ve yükleme açıklaması güncellendi; makas verisi yok/mesnet belirsiz koşulları kontrol bekler. Kontrol planındaki3 belirsiz H'nin2'si dış kulaksız–dübelli oldu,1 iç H bekliyor. İç dübel kuralı hâlâ açık. İki yönde sınıflandırma, açıklık dışı, veri yokluğu, mesnet belirsizliği, taşınan makas ve yükleme kayıt regresyonları geçti. Sürüm5.9.30. Canlı çizim ve kullanıcı JSON'u değiştirilmedi; diğer açık işler korunur.


## 3 Ekim 2026 — Ev PC — 5.9.31 / DEV-022

Kullanıcı iç H'nin her zaman dübelsiz, makas altında kulaklı ve makas dışında kulaksız olduğunu onayladı. Temel dört kulak/dübel sınıfı tamamlandı; mesnet/veri belirsizliği kulak için bilinmiyor kalır. Kontrol taslağı21/2/12/1 sınıf adetleri üretti (sırasıyla kulaklı-dübelli, kulaksız-dübelli, kulaklı-dübelsiz, kulaksız-dübelsiz; üçlü H dahil). tests/loading-h.cjs ve loading-list.cjs geçti. Mevcut müşteri çizimi değişmedi. Net boy/profil ve Excel farkları devam eder; sevk taslağı onaylanmış reçete değildir. Rapor: analizler/2026-10-03-h-kulak-dubel.md.


## 3 Ekim 2026 — Ev PC — Tuna H karşılaştırması

Kaynak Excel B23:D28 yeniden okundu, hash doğrulandı.5.9.31 kontrol JSON hesabı yeniden üretildi. Toplam36/36 eşit fakat21 bağlantının kulak sınıfı farklı: dış standart8, dış üçlü1, iç standart8, iç üçlü4. Aynı aks/hat ile fiziksel makasa giriş ayrımı nedeniyle mevcut2B sınıflandırmanın fazla kulaklı saymış olabileceği saptandı; kesin kök neden/onay olarak sunulmadı. Bağlantı bazlı rapor analizler/2026-10-03-tuna-h-excel-karsilastirma.md. DEV-022 fiziksel temas kontrolü açık; DEV-006/011 devam. Kod/Excel/canlı çizim değişmedi, sürüm5.9.31.


## 3 Ekim 2026 — Ev PC — Tuna H fiziksel mesnet ilişkilendirmesi

Kullanıcı DWG/Excel ile tariflerinin ilişkilendirilmesini istedi. Drawing1 çıkarılmış geometri görünümü ve tam SP DWG önceki AutoCAD dökümü incelendi, iki kaynak hash'i doğrulandı. Makas uçlarına bağlanan H alternatif sayımı Excel'in altı satırıyla10/10/9/2/1/4 olarak tam eşleşti. Önceki algoritmanın aynı aksa gelmeyi gerçek bağlantı kabul ettiği geniş yorum saptandı. Kulak=gerçek mesnet, dübel=dış duvar güçlü çıkarımı raporlandı; üretim detayına dair kesin kanıt gibi sunulmadı. Kod5.9.31 değişmedi, DEV-022 uygulama düzeltmesi açık. Rapor: analizler/2026-10-03-tuna-h-mesnet-yorumu.md. Kaynaklar/canlı çizim korundu.


## 3 Ekim 2026 — Ev PC — 5.9.32 / DEV-022

Kullanıcı Tuna mesnet yorumunu onayladı. Uç mesnet sınıflandırması genelleştirildi, otomatik H adetleri ve uygun ölçülerde Tuna referans eşlemesi eklendi. İsteğe bağlı H K/KS/D/DS plan etiketleri, JSON kalıcılığı; gerçek XLSX indirme (kaynak Excel değişmez). Tuna altı satır10/10/9/2/1/4 eşleşti. loading-h, loading-list, verify-loading-xlsx ve plan-export kontrolleri başarılı; etiket görüntüsü incelendi. Özel ara mesnet, profil/net boy ve diğer üretim işleri açık; sonraki deneme çizimleriyle doğrulama kullanıcı tarafından planlandı. Canlı çizim ve takip dışı JSON korunmuştur. Sürüm5.9.32.


## 3 Ekim 2026 — Ev PC — 5.9.33 / DEV-023

Kullanıcı10'luk köşe direğinin98×98×bina yüksekliği(mm),6'lığın58×58×bina yüksekliği(mm) olarak Excel'e geçmesini istedi. Çizim nominal ölçüleri korunarak ürün eşlemesi ve otomatik adet eklendi. Tuna8adet98×98×2500 Excel22satırıyla eşleşti.6cm/300cm denemesinde58×58×3000 doğrulandı. Tanımsız/karma kesitler bekler; veranda direği/H/U bu kuralın kapsamı değil. loading-corners, loading-list, loading-h ve bağımsız XLSX okuma testleri başarılı. Canlı çizim ve takip dışı JSON korundu. U adet farkı ve diğer üretim işleri açık.


## 3 Ekim 2026 — Ev PC — 5.9.34 / DEV-024

Kullanıcı U6'lık60mm/10'luk100mm, boy bina yüksekliği−60mm, her5U'ya1yedek tarifini verdi. Tuna3çizim/4Excel farkının bilinçli yedek olduğunu onayladı.3→4 örneğine göre yedek ceil(adet/5), ölçü bazında uygulandı ve kullanıcıya açıklandı. Tuna60×2440mm3+1=4; Excel29satırı otomatik eşleşir. Kullanılan/yedek/toplam ayrımı arayüz ve XLSX/CSV'de görünür. Manuel toplam tekrar yedeklenmez; kaynak değişirse kontrol ister. U sınır/grup testleri, loading-list/H/corners ve bağımsız XLSX doğrulaması geçti. Canlı çizim değişmedi. DEV-024 tamamlandı; panel stok farkı ve diğer açık işler korunur.


## Çektirme U — son kullanıcı teyidi

Kullanıcı dört maddeyi birlikte açıkça doğruladı:6'lık bağlanan duvar için60mm U;10'luk için100mm U; her iki ende boy=bina yüksekliği−60mm; her başlayan5adede1yedek ve farklı ölçüler ayrı.250cm yükseklikte60×2440 veya100×2440mm;100×2400mm kullanılmaz. Önceki açıklama sorusundaki belirsizlik kapandı. Mevcut5.9.34 hesabı doğru; kod/sürüm değişmedi. Bu karar ev/iş ortak kaydıdır.


## 3 Ekim 2026 — Ev PC — Pano sevk kuralı / DEV-025

Kullanıcı iki yarım panel yerine normal koşulda bir tam pano gönderildiğini açıkça düzelterek doğruladı; kesim montajcı tarafından şantiyede yapılır. Çizim parçası/stok pano ayrımı kayıtlı. Tek kalan yarım ve özel parça kuralları açık; uygulama ve Tuna49/47 doğrulaması devam edecek. Kod/sürüm5.9.34 değişmedi; canlı çizim ve takip dışı JSON korunmuştur.


## DEV-025 — Kesim kapsamı genişletmesi

Kullanıcı aynı tam panodan şantiyede kesim uygulamasının yalnız62,5cm yarım panel için değil57,5cm ve daha kısa özel panel parçaları için de geçerli olduğunu açıkça belirtti. Kural parça adına veya yalnız yarım panel tipine bağlanmamalı; uyumlu parçaların gerçek kesim enlerinden stok pano ihtiyacı hesaplanmalı.62,5/57,5 kullanıcı örnekleridir; mevcut aks/net kesim katalog farkları bu kararla kendiliğinden değiştirilmez. Bir tam panodan üç veya daha fazla küçük parça çıkarma, tek kalan parça sevki ve kesim payı henüz açıkça tarif edilmedi. Bu tur üretim kararı kaydıdır; kod5.9.34 değişmedi. DEV-025 uygulaması ve Tuna49/47 doğrulaması açık; kullanıcı çizimi korunmuştur.


## 3 Ekim 2026 — Ev PC — 5.9.35 / DEV-025

Kullanıcı kısa/özel parçaların stok tam panodan saha kesimi ve artık kabulü örneklerini verdi. Net kesimi bilinen dolu parçalar kalınlık/yükseklik bazında1250mm stoklara sığdırıldı; kapı/pencere ayrı bırakıldı. Kesim/artık UI/XLSX/CSV'ye eklendi. Özel genişlikler çizimde numara filtresinden bağımsız kalır; nominal geometri değişmedi. Tuna24dış parça22stok,13iç parça12stok; dış Excel23 ile bir fark açık (710+520 birlikte kesimi). Testere payı ve bilinmeyen net kesimler varsayılmadı. loading-stock/list/H/U/corners ve plan-export geçti; özel etiket görsel kontrolü. Uygulama5.9.35; canlı plan ve kullanıcı JSON'u değişmedi. Diğer açık işler korunur.

## 5.9.36 — Serbest özel ölçüler / DEV-025

Kullanıcı örneklerin sınırlı liste olmadığını netleştirdi. 5.9.35 içindeki 30/40/70/102/57,5/62,5 özel ölçü listesi kaldırıldı. Her pozitif sonlu özel en genel olarak değerlendirilir. Modular kataloğundaki doğrulanmış net kesimler önceliklidir (125,5→1250; 62,75→625 mm). Diğer enlerde çizim ölçüsü mm'ye çevrilerek stok hesabına esas alınır; bu değer doğrulanmış net imalat kesimi sayılmaz, H payı uydurulmaz. Kaynakta cutBasis tutulur ve hesap açıklamasında belirtilir. 1250 mm'den büyük tek parça bu stokla otomatik karşılanmaz. Kapı/pencereler ayrı kalır. Çizim geometri ve etiketleri değişmez.

Kalınlık/yükseklik grupları, artık ve uygulanabilir büyükten küçüğe sığdırma korunur; en az stok garantisi ve testere payı henüz yoktur. 1249 farklı en, ondalıklı karışık gruplar, bilinen katalog önceliği, büyük parça kontrolü ve tarayıcıda 37,2+86,4 cm özel parçalarının tek stok hesabı test edildi. Tuna sayıları 24/22 ve 13/12 değişmedi; JSON/CSV/XLSX ve eski karar kontrolleri geçti. DEV-025 saha net kesim paylarının genellenmesi, testere payı ve deneme çizimleriyle doğrulama açık. Canlı kullanıcı çizimi ve Yeni proje (11).json korunmuştur.

## 3 Ekim 2026 — Gün sonu yedeği, yarın devam

Kullanıcı çalışmayı yarına bıraktı. Program 5.9.36; değişiklik yapılmadı. Son karşılaştırma, yedek envanteri ve yarın ilk adım: [gün sonu devir raporu](analizler/2026-10-03-gun-sonu-devir.md). Mevcut eski JSON ayrı cizimler/2026-10-03-ev-mevcut-yedek-5.9.14.json olarak korundu (SHA-256 raporda); canlı son çizim olduğu doğrulanmadı. DEV-002 açık: file:// sekmesine erişim güvenlik politikası engeli nedeniyle canlı çizim yedeği alınamadı; kullanıcı Kaydet ile son JSON'u dışa aktarmalı. DEV-025/DEV-006: dış pano 22/23 farkı ve kapı/pencere reçeteleri yarın incelenecek; diğer açık işler devam ediyor.

## 3 Ekim 2026 — İş PC — ev tesliminin alınması ve devam kontrolü

- Kullanıcı iş PC'den devam istedi. Temiz main fetch/pull --ff-only ile4c2f1c4→f0911ee güncellendi; AGENTS/DEVAM/CALISMA_KAYDI ve gün sonu raporu okundu.
- Uygulama5.9.36. loading-stock ve loading-list testleri başarılı;49 panel yuvası,12 açıklık, dış24/22 ve iç13/12 stok hesabı yeniden doğrulandı. Kullanıcının canlı çizimine müdahale edilmedi.
- DEV-025/006:710+520mm birlikte kesim/sevk tercihi kullanıcıya soruldu; yanıt bekleniyor, reçete değiştirilmedi. DEV-002 son canlı JSON hâlâ doğrulanmadı.
- Kod değişmedi. package.json5.9.19 / uygulama5.9.36 metadata farkı not edildi. Sıradaki adım sevk tercihi ve kapı/pencere reçeteleri; diğer açık işler korunuyor.

## 3 Ekim 2026 — DEV-025 / DEV-006 kullanıcı teyidi

Kullanıcı 710 ve 520 mm dolu parçaların aynı1250mm panodan kesilebileceğini açıkça onayladı:1230mm kullanılır,20mm artık kalır; Tuna dış dolu pano sevki22 olarak korunur. Excel23 sayısına uymak için fazladan stok eklenmeyecek. Excel farkının tarihsel nedeni doğrulanmadı; programın bu kesim tercihi üzerindeki belirsizlik kapandı. Kod değişikliği gerekmedi;5.9.36 hesabı korundu. Testere payı ve diğer ürün reçeteleri ayrı açık konulardır. Sıradaki iş kapılı/pencereli panoların yükleme reçetelerini incelemek; DEV-002 son canlı JSON ve diğer açık işler korunur.

## 3 Ekim 2026 — DEV-006 kapılı/pencereli pano karşılaştırması

[Karşılaştırma](analizler/2026-10-03-aciklik-panolari.md) kayıtlı kontrol taslağından yeniden üretildi:6pencere ve1dış kapı panosu Excel ile eşleşiyor. İç kapıda program4×1250+1×1220, Excel3×1250+2×1220; toplam5aynı, bir ürün eni farklı. Hazır pano sevk kuralı, doğramanın ayrı sayılması ve farklı iç kapının kimliği kullanıcıyla netleştirilecek. Kod5.9.36 ve canlı plan değişmedi; önceki kapı boşluğu incelemesi erteleme kararı korunuyor. Diğer açık işler sürüyor.


## 3 Ekim 2026 — DEV-006 pano yorumu düzeltmesi

Kullanıcı, işaretlenen kapılı duvar bölümlerinin küçük kapı parçaları değil, kapı açıklığı panelin içinde bulunan tam panolar olduğunu açıkladı. 1250/1220 mm imalat eni farkı makas yönü/aks kaynaklı özel kesimle birlikte incelenecek. Önceki anotasyonun konumu hatalı; raporda geçersiz sayıldı. 4×1250+1×1220 ile Excel3×1250+2×1220 farkı çözülmedi; hangi panonun özel kesildiği ve “kasalar geniş” notunun açıklığı açık. Kod ve canlı çizim değişmedi; sevk reçetesi uydurulmadı. [Güncellenen analiz](analizler/2026-10-03-aciklik-panolari.md).

## 3 Ekim 2026 — İş PC kayıtlarının ev PC'ye alınması

Kullanıcının isteğiyle origin/main üzerinden dört kayıt f0911ee→2c10ab8 fast-forward alındı; yalnız DEVAM, CALISMA_KAYDI ve açıklık panoları raporu değişti. Yerel Yeni proje (11).json ve canlı çizim korundu. Uygulama 5.9.36 değişmedi; bu devirde yeni kod testi gerekmedi.

DEV-006 sıradaki konu: kapı açıklığı tam pano içindedir; iç kapılı pano 4×1250+1×1220 / Excel3×1250+2×1220 farkında hangi panonun makas/aks nedeniyle özel kesildiği, geniş kasa notu ve ayrı doğrama sevki netleştirilecek. İş PC'deki hatalı anotasyon kullanılmayacak. DEV-025 için 710+520 birlikte kesim onaylı, dış dolu pano22 korunur. Kullanıcı önceki ev konuşmasında çizimde değişiklik yapmadığını ve eldeki son JSON ile devam edilebileceğini belirtti; yeniden kayıt talep edilmez. Bu beyan eski 5.9.14 yedeğini Tuna kontrol taslağıyla aynı dosya yapmaz; mevcut analiz kaynağı cizimler/2026-10-02-tuna84-dwg-esleme-taslak.json olarak korunur. Diğer açık işler ve metadata farkı devam eder.

## DEV-026 — Diğer yükleme kalemlerinin reçeteleri

| Kimlik | İş | Durum |
| --- | --- | --- |
| DEV-026 | Alt çerçeve, omega, veranda profil/kiriş ve çatı kenarı malzemelerinin otomatik yükleme hesabı | Açık: referans envanteri çıkarıldı; ilk olarak alt çerçevenin kapı altı devamı, kesit, stok boyu, artık ve yedek kuralı kullanıcıya soruldu. Yanıt bekleniyor. |

[Kalemler ve eksik kurallar](analizler/2026-10-03-diger-yukleme-kalemleri.md). 3 Ekim 2026 ev PC: kullanıcı diğer kalemleri ayarlamayı istedi. Git fetch sonrası uzak dal ile eşitlik kontrol edildi. Kaynak ve önceki kayıtlar tarandı; onaysız adet/reçete eklenmedi. Kod5.9.36 değişmedi, canlı plan ve yerel JSON korundu. DEV-006 kapılı pano farkı ve tüm diğer açık işler devam eder. Sıradaki adım alt çerçeve yanıtını kurala ve doğrulama testine dönüştürmek.

## 3 Ekim 2026 — DEV-026 alt çerçeve kapsamı onayı

Kullanıcı: alt çerçeve kapılı ve pencereli panolar dahil tüm duvarların altındadır; yalnız veranda kısmında yoktur. Hesapta kapı/pencere boşlukları duvar uzunluğundan düşülmeyecek. Veranda açık sınırları hariç tutulur; verandaya bakan gerçek ev duvarı tüm duvarlar kuralına dahildir. Bu karar yalnız uygulama kapsamını kesinleştirir. 60/100 mm kesit eşlemesi, 2500 mm stok boyunun genelliği, kesilen artığın başka duvarda kullanılması/ek yapılması, köşe-uç boyları ve yedek henüz kullanıcı tarafından doğrulanmadı. Sevk adedi uydurulmadı; uygulama5.9.36 ve çizim değişmedi. Sıradaki adım stok/artık/yedek kurallarını almak; diğer açık işler korunur.

## 3 Ekim 2026 — 5.9.37 / DEV-026 alt çerçeve hesabı

Kullanıcı sabit stok boyunu 250cm olarak 60 ve100mm için doğruladı. Aynı kalınlıktaki tüm duvar uzunlukları birlikte toplanır, toplam/250 yukarı yuvarlanır; her mevcut kalınlık grubuna1yedek eklenir. İç/dış ayrımı yapılmaz; kapı/pencere boşlukları düşülmez, veranda açık sınırları hariçtir. 3350cm→14+1=15; kullanıcının örnekteki3250 ifadesi13+1=14eder. Artıklar başka duvarlarda kullanılabilir; ayrı ayrı duvar yuvarlaması veya pano kesim algoritması uygulanmaz.

Uygulama ölçü tabanı duvar düğümleri arası aks uzunluklarıdır; varsayımsal köşe payı düşülmedi. Kontrol Tuna JSON'unda100mm toplam3659,5cm→15+1=16 (Excel15);60mm toplam2143,5cm→9+1=10 (Excel10). 100mm farkının sebebi kesinleşmedi; Excel'e uydurmak için1yedek kaldırılmadı. Gerekirse referansın yedek ve uzunluk esasını netleştir. UI toplam/bölüm sonucunu, CSV/XLSX açıklaması formülü ve yedeği gösterir. Manuel toplam tekrar yedek eklemez; çizim değişirse eski karar geçersizdir. Tanımsız kalınlıklar onay bekler.

Kontroller: loading-frames sınır/yuvarlama/grup/manuel/eski karar; loading-list kapı/pencere ve veranda hariç kapsamı, JSON ve dışa aktarma; loading-stock regresyonu; verify-loading-xlsx alt çerçeve15+1 ve9+1 dahil geçti. Build başarılı. Sürüm5.9.37; package.json eski sürüm metadatası da eşitlendi. Canlı çizim ve yerel JSON değişmedi. DEV-026 alt çerçeve uygulandı; omega, veranda kirişleri ve çatı profilleri açık. Diğer açık işler devam eder.

## 3 Ekim 2026 — DEV-027 / 5.9.38 yedek görünürlüğü

| Kimlik | İş | Durum |
| --- | --- | --- |
| DEV-027 | Yedeksiz ihtiyaç, dahil yedek ve toplam sevkin ayrı gösterilmesi | Tamamlandı: UI, Excel ve CSV; loading-spares ve verify-loading-xlsx kontrolleri. |

Kullanıcı yedeğin ikinci kez eklenmesini önlemek için açık ayrım istedi. U ve alt çerçevede ihtiyaç/yedek/toplam ayrı; yedek toplam sevke dahil, tekrar eklemeyin açıklaması görünür. Dolu panoda yedeksiz ihtiyaç geometrik parça değil stok pano adedidir. Otomatik yedek eklenmeyen satırlarda0 ve açık açıklama bulunur; bu gelecekte yedek gerekmeyeceği kararı değildir. Bekleyen hesap ve manuel toplamda yedek ayrımı bilinmiyor olarak gösterilir; onaylanmış yedek varsayılmaz. Manuel sevk miktarına ikinci kez yedek eklenmez. Mevcut hesap formülleri değişmedi.

UI ayrı sütunlarla görsel kontrol edildi; loading-list, loading-frames, loading-spares ve verify-loading-xlsx geçti. Kod/dağıtım5.9.38. Canlı çizim ve yerel kullanıcı JSON'u korunmuştur. DEV-026 diğer malzeme reçeteleri, alt çerçeve100mm16/15farkı ve önceki açık işler devam eder.

## 3 Ekim 2026 — 5.9.39 / DEV-027 sütun adları

Kullanıcı isteğiyle UI, Excel ve CSV başlıkları Adet ve Yedek olarak sadeleştirildi. Toplam sevk, yedeğin dahil olduğu açıklama, manuel belirsizlik ve sayım formülleri korundu. Build, loading-list ve verify-loading-xlsx kontrolleri başarılı. Canlı çizim ve yerel JSON değişmedi. Diğer açık işler devam eder.

## 3 Ekim 2026 — DEV-026 üst omega sınıflandırması

Kullanıcı kuralı: alt çerçeve tüm duvarların altında, üst omega tüm duvarların üstündedir. Alt çerçeve ürün ailesi yalnız duvar kalınlığıyla60/100olarak değişir. Üst omega hem kalınlık hem duvarın çatı/makas konumuyla seçilir:
- İç duvar üstü: duvar omegası.
- Baş makas/alın tarafındaki dış duvar üstü: baş makas omegası.
- Yan saçak tarafındaki dış duvar üstü: saçak omegası.

Bu üç üst ürün aynı hatta üst üste sayılmayacak; konuma uygun ürün seçilecek. Kullanıcı henüz baş makas omegasının Excel'deki Baş Makas Z Sacı ile aynı ürün olduğunu söylemedi; eşleştirme varsayılmayacak. Duvar omegası2500/3680/4940boylarının seçimi, baş makas/saçak stok boyları ve yedek kuralları açık. Karma/yavru çatı alanlarında yerel çatı ilişkisi gereklidir; yalnız global yönle tüm dış duvarları sınıflandırmak yeterli sayılmaz. Çatı bilgisi eksikse ürün türü uydurulmayacak.

Karar kaydedildi; otomatik sevk reçetesi henüz eklenmedi. Uygulama5.9.39, canlı plan ve kullanıcı JSON'u değişmedi. DEV-026 sıradaki adım baş makas ürün eşlemesi ve farklı boy seçimini netleştirmek; diğer açık işler devam eder.

## 3 Ekim 2026 — DEV-026 uzun omega aday eşleşmesi

[Kaynaklı boy analizi](analizler/2026-10-03-omega-boy-eslesmesi.md): kayıtlı Tuna planında üst iki yatak odası net derinliği368,5cm, salon494cm. Excel3680/4940mm ile güçlü aday eşleşme; ilkinde5mmfark var, pay varsayılmadı. İki odaya3'er ve salona3adet ihtimali6/3sayısıyla uyumlu ama doğrulanmadı. Bu60mmürünleri10cm dış duvar üstüne atama yapılmadı; oda açıklığını geçen kullanım olasılığı kullanıcıya sorulacak. Boy seçiminin eksiz açıklık geçme amacı hipotezdir. Uygulama5.9.39 ve canlı çizim korundu; sevk reçetesi değiştirilmedi. Diğer açık işler devam eder.

## 3 Ekim 2026 — DEV-026 montaj payı kullanıcı onayı

Kullanıcı 368,5cm net açıklık ile368cm omega arasındaki5mm farkı montaj payı olarak kabul etti. Bu eşleşme için3685−5=3680mm onaylıdır. Önceki kayıtlardaki bu farkın belirsizliği kapanmıştır. Bu karar tüm omega boylarından5mm düşme kuralı değildir;4940mm örneği değiştirilmez. Uzun omegaların gerçek yerleşimi/üçer sıra varsayımı ve adet/yedek reçetesi henüz onaylanmadı. Kod5.9.39, çizim geometrisi ve sevk hesabı değişmedi. Sıradaki adım yerleşim ve adet kuralını netleştirmek; diğer açık işler korunur.

## 3 Ekim 2026 — H payı hatırlatması / DEV-026 ölçü yorumunun düzeltilmesi

Kullanıcı çizimde H'ye ayrı ölçü vermeden0,5cm payı panel yerleşim ölçüsünde tuttuklarını hatırlattı:125cm pano→125,5cm yerleşim. Buradaki0,5cm en/hat doğrultusundaki H birleşim payıdır; duvarın6/10cm kesit kalınlığına otomatik ek değildir. Yerleşim ölçüsü ile net ürün/kesim ölçüsü ayrı tutulmalı; aynı H payı tekrar montaj payı diye düşülmemeli.

Önceki3685→3680mm farkını yalnız bağımsız montaj boşluğu diye etiketleyen yorum, bu hatırlatma ışığında yeniden incelenecek. 3680mm referans ürün boyu korunur; farkın H yerleşim payı içindeki kaynağı bağlantı geometrisiyle doğrulanmadan ikinci bir5mm düşülmez. Her özel boydan evrensel5mm düşme kuralı çıkarılmadı. Önceki üçer sıra/oda açıklığı yerleşimi hâlâ hipotezdir. Kod5.9.39 ve çizim değişmedi. Sıradaki iş H/aks/net boy zincirini omega yerleşimiyle birlikte doğrulamak. Diğer açık işler korunur.

## 3 Ekim 2026 — DEV-026 omega boy seçimi ertelendi

Kullanıcı omega boylarını şimdilik bekletmeyi, göndereceği birkaç başka proje ve Excel üzerinden daha sonra netleştirmeyi istedi. 2500/3680/4940mm referans boyları ve önceki bulgular korunur; üçer sıra, oda açıklığı eşlemesi ve genel H/montaj payı dönüşümü doğrulanmış otomatik reçete değildir. Yeni örnekler gelmeden bu boyları genel kurala dönüştürme veya aynı açıklama sorusunu tekrar tekrar sorma. İç duvar/baş makas/saçak ürün sınıflandırması kararı geçerlidir. Uygulama5.9.39 ve mevcut hesaplar değişmedi; diğer açık işler korunur. Yeniden başlama koşulu: kullanıcının ek proje/Excel sağlaması; kaynakları kaydedip projeler arası eşleştirme yapmak.

## 3 Ekim 2026 — DEV-026 veranda profilleri

Kullanıcı flanşlı veranda direğini her zaman100×100mm olarak doğruladı. Yeni görsel ortak referanslara kopyalandı; [kaynak ve kesim raporu](analizler/2026-10-03-veranda-profilleri.md). Bu örnekte4970mm ön kiriş tek stok;2520+640mm yan kirişler bir3500mmstoktan kesilir (nominal340mmartık). Görselde direk2700mm, Excel'de2500mm; boy farkı açık, otomatik bina yüksekliği payı çıkarılmadı. Genel stok boyu, ara direk ve yedek kuralları da açık. Uygulama5.9.39 ve canlı çizim değişmedi. Sıradaki adım direk boyunu netleştirmek; omega boy ertelemesi ve diğer açık işler korunur.

## 3 Ekim 2026 — 5.9.40 / DEV-026 veranda direk boyu

Kullanıcı her binada direk boyunun bina yüksekliği olmasını, özel durumlarda elle müdahale etmeyi istedi. Çizimdeki serbest veranda düğümleri100×100mm flanşlı profil olarak otomatik sayılır; boy bina yüksekliği×10mm. Tuna2adet100×100×2500mm, Excel satır19ile uyumlu. Otomatik yedek eklenmedi, ara direkler kendiliğinden üretilmedi. Kiriş genel reçetesi bu değişiklikte uygulanmadı.

Yükleme satırı Düzenle alanında direk boyu mm olarak değiştirilebilir; değişiklik satırdaki tüm direklere uygulanır. Miktar/gerekçe ve boy JSON'da korunur; çizimde direk geometrisini değiştirmez, sevk ölçüsüdür. Boy2500dışındaysa Tuna2500referansı kaldırılır. Bina yüksekliği değişirse eski gruba ait karar orphan olarak korunur; yeni gruba sessizce taşınmaz. Aynı grubun çizimi değişirse eski manuel karar geçersiz olur.

Build, loading-list, loading-posts (2direk,2500otomatik,2700manuel,JSON,2800yeni bina boyu) ve verify-loading-xlsx geçti. Uygulama5.9.40; canlı çizim ve yerel JSON korunmuştur. Omega boyları ertelenmiş; kiriş stok genellemesi, ara direk ve yedek kararları ile diğer açık işler sürer.

## 3 Ekim 2026 — DEV-026 yan kirişleri ayrı listeleme onayı

Kullanıcı2520mm ve640mm yan kirişlerin ayrı ayrı yazılmasının da doğru olduğunu onayladı. Bu proje için100×100×4970mm1adet,100×100×2520mm1adet ve100×100×640mm1adet ayrı parça listesi geçerlidir. Önceki3500mmtek stoktan yanları kesme seçeneği zorunlu değildir; projeye ait alternatif sevk biçimidir. Aynı ihtiyaç hem3500stok hem2520/640parçaları olarak çift sayılmayacak.3500sabit/genel stok standardı çıkarılmadı.

Kiriş boyları şu anda kullanıcı açıklamalı imalat görselinden onaylıdır; tüm projelerde aks ölçüsünden net boy dönüşümü, uç bağlantı payları ve yedek kuralı henüz kesinleşmedi. Bu onay otomatik geometri/kesim formülünü doğrulamaz. Uygulama5.9.40 ve canlı çizim değişmedi. Sıradaki adım net kiriş boyunu uç bağlantılarından türetmek; diğer açık işler korunur.

## 3 Ekim 2026 — DEV-026 kiriş bağlantısı ve kesim payı

Kullanıcı direklerin her projede100×100mm olduğunu, yalnız boyun bina yüksekliğiyle değiştiğini tekrar doğruladı; mevcut5.9.40direk kuralı uygundur. Yeni açıklamalı görsel: referanslar/tuna-84m2/2026-10-03-veranda-kiris-pay-ornek.png (bu yeni örneğin Tuna ile aynı proje olduğu varsayılmadı; referans klasöründe saklandı). Özgün dosya C:/Users/obayr/AppData/Local/Temp/codex-clipboard-47cccf84-9cd6-4d4d-a358-458fcec64ffe.png; SHA-256: 3eb39dc6940ed2cc5f21c1a4535c4fd9631e9e681628309a5bd481764ad4797e.

Görsel notu kirişlerin direklerin arasına gireceğini ve her kiriş için+10cm kesim payı verileceğini açıklıyor. Bu toplam100mm/parça boy payıdır; her uca100mm veya fazladan1adet yedek olarak yorumlanmaz. Görselde kiriş1880/2560/5550mm; direk2800mm yazıyor. Yazılı kiriş boylarının100mm payı içerip içermediği henüz açık değil; kullanıcıya bu ayrım sorulacak. Pay iki kez eklenmeyecek, önceki4970/2520/640onaylı değerleri bu açıklama ile sessizce değiştirilmeyecek. Direkler arası net açıklık ve sevk/kesilecek boy ayrı tutulmalı; duvara bağlanan uç geometrisi ayrıca doğrulanmalıdır.

Karar ve görsel kaydedildi; otomatik kiriş hesabı henüz değiştirilmedi. Uygulama5.9.40ve canlı çizim korundu. Omega boyları ertelenmiş; diğer açık işler devam eder.

## 3 Ekim 2026 — DEV-026 net kiriş / sevk boyu kesin kuralı

Kullanıcı açıkça doğruladı: çizimde5550/2560/1880mm net kiriş boyları korunacak; yükleme listesinde her parça boyuna100mm eklenecek. Liste açıklaması “+100 mm kesim payı”. Sonuçlar5550→5650,2560→2660,1880→1980mm. Bu parça başına bir kez eklenen boy payıdır, her uç için ayrı100mm değildir ve yedek adet değildir. Adet/Yedek/Toplam sevk adedi bu boy payından etkilenmez. Listede net boy, kesim payı ve sevk boyu ayrılmalı. Aynı pay ikinci kez eklenmeyecek; çizim ölçüsü sevk boyuna çevrilmeyecek.

Önceki görseldeki payın dahil olup olmadığı belirsizliği kapandı. Genel veranda geometrisinden net kiriş boyu/duvar ucu bağlantısı çıkarımı hâlâ doğrulanmalı; bu tur yalnız kural ve örnekler kaydedildi, otomatik kiriş satırları henüz uygulanmadı. Uygulama5.9.40ve canlı çizim değişmedi. Omega boy ertelemesi ve diğer açık işler korunur.

## 3 Ekim 2026 — DEV-022 H düzeltme karşılaştırması

[Yeni görsel/kod karşılaştırması](analizler/2026-10-03-h-kural-karsilastirma.md): dış H dübel/kulak kuralları uyumlu; içte tüm H kulaksız/dübelsiz açıklaması mevcut iç uç mesnet→kulaklı/dübelsiz istisnasıyla farklı. İç makas verisi yok durumundaki belirsizlik de yeni mutlak kuralla değişir. Tuna'da bu istisna oluşmuyor, mevcut36Hve alt gruplar korunur. loading-h testi ve iç mesnet örneği çalıştırıldı. Kullanıcı inceleme/karşılaştırma istedi; kod5.9.40 ve çizim değiştirilmedi. DEV-022 iç H istisnasını kaldırma/mesnet uyarısı önerisi açık; üçlü/dörtlü birleşim şekilleri kaldırılmayacak. Diğer açık işler korunur.

## 3 Ekim 2026 — 5.9.41 / DEV-022 iç H kuralı uygulandı

Kullanıcı tüm iç duvar H'lerini şimdilik kulaksız/dübelsiz olarak sabitlemeyi onayladı; iç makas altında kulaklı/dübelsiz kullanım ileride ayrı kararla revize edilebilir. classifyH iç birleşimde makas konumundan ve veri eksikliğinden bağımsız ear=false,dowel=false döndürür; kural kimliği h-interior-earless-no-dowel-v2. Dış gerçek uç mesnet ve dübel hesabı değişmedi. H/üçlü/dörtlü birleşim şekilleri ve U/köşe geometrisi korunur. İç/dış birleşimi exterior olarak sınıflanan dış duvar birleşimi dış kurala tabidir.

UI açıklaması, plan H etiketleri ve Excel sınıfları aynı hesabı kullanır. Kural kimliği değiştiği için eski iç H manuel miktar kararları otomatik geçerli sayılmaz; eski karar denetimi korunur. İç kulaklı istisnası gelecekteki açık ürün kararıdır; mevcut sürümde uygulanmaz. Kullanıcı bu tur mesnet uyarısı istemedi; yeni uyarı eklenmedi.

Build, loading-h (iki yön, iç gerçek mesnet/mesnetsiz/verisiz kulaksız, dış regresyon), loading-list ve verify-loading-xlsx başarılı. Tuna H toplam36ve alt grupları değişmedi: H10/10/9; üçlü H2/1/4. Uygulama5.9.41; canlı çizim ve yerel JSON korunmuştur. DEV-022 mevcut iç sınıflandırma düzeltmesi tamam; gelecekte iç mesnet kulak revizyonu ve diğer açık işler korunur.

## 3 Ekim 2026 — DEV-022 üçlü ve dörtlü H kapsam teyidi

Kullanıcı tüm H kurallarının üçlü ve dörtlü H'leri de kapsadığını açıkça doğruladı. H/H3/X aynı sınıflandırmadan geçer: tüm iç birleşimler kulaksız/dübelsiz; dış birleşimler dübelli, gerçek makas uç mesnedinde kulaklı, diğer dış birleşimler kulaksız. Dış duvarla birleşen iç duvarın ortak birleşimi dış konum olarak değerlendirilir. Birleşimin üçlü/dörtlü şekli korunur, normal iki yönlü H'ye dönüştürülmez.

src/loading-ui.js içindeki ['H','H3','X'] ortak classifyH çağrısı kontrol edildi;5.9.41 bu kapsamı zaten uygular. Yeni uygulama değişikliği/sürüm artışı gerekmedi. Bu kayıt kalıcı kullanıcı teyididir; diğer açık işler ve canlı çizim korunmuştur.

## 3 Ekim 2026 — 5.9.42 / DEV-026 standart iç duvar omegası

Kullanıcı özel2500/3680/4940boyların çizim/sayım yapan kişinin tek parça kullanma tercihinden kaynaklandığını, stok hızını korumak için standart2500mm kullanmamızı istedi. Önceki boy seçimi ertelemesi iç duvar standart hesabı için kalktı. Aynı kalınlıktaki iç duvar aks uzunlukları toplanır; mm toplam/2500 yukarı yuvarlanır. Kalınlık duvardan alınır. Kapı/pencere boşlukları düşülmez; dış duvarlar ve veranda açık kenarları dahil edilmez. Uzun özel boylar veya oda içinde üçer sıra hipotezi kullanılmaz. Kullanıcı bu tur yedek adedi vermedi;0otomatik yedek ve açık açıklama korunur, alt çerçevenin+1yedeği kendiliğinden aktarılmaz.

UI, CSV ve Excel otomatik Duvar omegası satırı eklendi. Tuna21435mm iç duvar toplamı/2500=8,574→9adet60×2500mm. Eski Excel'in özel boy/adetleriyle doğrudan eşleşme iddiası yok; otomatik Tuna referans eşlemesi yapılmadı. Manuel toplam/JSON ve eski karar kontrolü korunur. loading-omega sınırlar/gruplar/manuel-stale; loading-list gerçek iç duvar kapsamı ve9adet; verify-loading-xlsx9/0/9kontrolleri başarılı, build tamam.

Uygulama5.9.42. Canlı çizim ve yerel JSON değişmedi. DEV-026 iç duvar omegası standart hesabı tamam; dış baş makas/saçak omega hesabı ve yedek kararları açık. Veranda kirişinin net+100mm otomatik listelemesi hâlâ tamamlanmamıştır ve öncelikli açık iştir; diğer açık işler korunur.

## 3 Ekim 2026 — DEV-026 veranda omega konumları

Kullanıcının yeni açıklamalı görseli: referanslar/tuna-84m2/2026-10-03-veranda-omega-konumlari.png. Özgün kaynak C:/Users/obayr/AppData/Local/Temp/codex-clipboard-929a3ead-1db4-4616-83a5-81df2f657e74.png; SHA-256: eff98c1751d9536f5ee86f2ed2485b71ffa1df1968b6d8dc856437473713a4fa.

Bu örnekte kırmızı hat duvar omegası: veranda ile ev arasındaki girintili duvar hattı ve iki yan veranda kirişi boyunca çizilmiş. Yeşil ön kiriş hattı baş makas omegası olarak etiketlenmiş. Yan kirişlerde saçak omegası varsayılmamalı. Önceki yalnız iç duvar→duvar omegası sınıflandırması tüm kapsam değildir: verandaya bakan dış ev duvarı ve belirtilen kirişler de duvar omegası alabilir. Geometri duvar/kiriş ayrımı ve çatı/makas konumu birlikte değerlendirilmelidir. Aynı hat iki omega türüne birden sayılmamalı; alt çerçeve veranda hariç kuralı değişmez.

Bu kaynak örnek konumları açıklar; global yönle tüm veranda biçimlerine aynı yön tayin edilmez. Baş makas omegasının Baş Makas Z Sacı ile aynı ürün olduğu ve stok boyu henüz teyit edilmedi. Mevcut5.9.42 yalnız iç duvar omega hesabını kapsar; bu dış duvar/kiriş kapsamı henüz otomatik eklenmedi, tamamlandı sayılmaz. Kullanıcının yedek kuralı verilmedi. Diğer açık işler ve canlı çizim korunur.

## 3 Ekim 2026 — DEV-026 baş makas / saçak stok standardı

[Özgün Excel kontrolü ve kurallar](analizler/2026-10-03-bas-makas-z-omega.md). Baş makas Z ayrı ürün:70×2500mm9adet. Baş makas omegası adıyla satır bulunmadı; eşit adet denemez.100×2500duvar omegası4, saçak omegası8. Baş makas ve saçak omega standart2500mm onaylı. Saçak tarafı duvar toplamı/250cm yukarı yuvarlanacak. Verandada iki kulaklı duvar omegası yeşil alçıpanı tutar; önceki kapsam açıklaması korundu. Bu dış/veranda hesapları henüz kodda uygulanmadı;5.9.42iç omega hesabı korunur. Diğer açık işler devam eder.

| Kimlik | İş | Durum |
| --- | --- | --- |
| DEV-028 | Tüm yükleme kalemleri için özel ölçü sekmesi | Kullanıcı ilerleyen zamanda istedi; planlandı, bu tur uygulanmadı. |

## 4 Ekim 2026 — DEV-029 geçici Z / baş makas omega eşlemesi (5.9.43)

Kullanıcı baş makas Z satırını baş makas omegasına bağlamayı ve ileride değiştirilebileceğini kaydetmeyi istedi. src/loading-reference.js productLinks ayrı, geçici eşleme olarak tuna-41 (Baş Makas Z Sacı, 70×2500, 9 adet) → Baş makas omegası ilişkisini taşır. Özgün referans adı/ölçü/adet değişmedi; ürünlerin aynı olduğu kabul edilmez. Karşılaştırma tablosu ve referans seçiminde geçici not görünür; açık referansı olmayan Baş makas omegası satırı tuna-41 ile karşılaştırılır. 9 adet genel proje miktarı değildir. Otomatik geometri hesabı mevcut olmadığından bu teslim otomatik Z/omega miktar üretimi değildir. DEV-026 dış/veranda omega ve net+100mm kiriş işleri açık kalır.

Kontroller: build ve loading-list geçti; referans bağlantısı ve özgün satırın korunması kontrol edildi. Canlı çizim ve Yeni proje (11).json değiştirilmedi. Karar/kod/dist birlikte gönderilir; kaynak Excel değişmedi.

## 4 Ekim 2026 — 5.9.44 / DEV-026 dört kalem uygulandı

[Uygulama, sayısal sonuçlar ve sınırlar](analizler/2026-10-04-omega-veranda-uygulama.md). Verandaya komşu duvarlar ve yan kirişler duvar omegasına dahil; baş makas/saçak2500mm toplamdan yukarı yuvarlanır. Z ayrı satırda geçici1:1 omega bağıdır; tuna-41 iki kez toplanmaz. Veranda kirişinin net+100mm sevk boyu listede/CSV/XLSX'te ayrı alanlarda. Çizim korunur, yedek0.

Tuna: iç omega9,100lük duvar omega5,baş omega8,Z8,saçak7. Kiriş net4970/2527,5/645→sevk5070/2627,5/745mm. Eski Excel/yan kiriş görsel farkları raporda; tam üretim eşitliği iddia edilmez. Belirsiz yerel çatı yönü/eğik veranda otomatik adet verilmeden kontrol bekler.

Build, loading-top/omega/list/h/frames/posts ve verify-loading-xlsx geçti; görsel kontrol yapıldı. Kaynak/dist/karar/testler birlikte gönderilir. Yeni proje (11).json ve canlı çizim korunmuştur; geçici artifacts Git'e alınmaz. DEV-026 onaylı dört uygulama kalemi tamam; DEV-011 imalat farkları ve DEV-028 özel ölçü sekmesi açık.

## 4 Ekim 2026 — Saçak sacı aday bağlantısı / DEV-030

[Kaynaklı çıkarım](analizler/2026-10-04-sacak-saci-aday-esleme.md): Tuna saçak omegası ve saçak sacı8eradet. Aday bağlantı yan saçak hattı; stok boyları2500/2800farklı olduğundan otomatik1:1adet kuralı kabul edilmedi. Veranda duvar omegası istisnası nedeniyle yalnız ürün adına bağlamak yeterli değil. Kullanıcı teyidi bekleniyor; kod/çizim değişmedi,5.9.44korundu.

## 4 Ekim 2026 — 5.9.45 / DEV-030 saçak sacı bindirme

[Onay, ürün görselleri/hash ve kontroller](analizler/2026-10-04-sacak-bindirme-kurali.md). Kullanıcı2800mm sacın300mm bindirme ile2500mm etkin olduğunu doğruladı. Ayrı sac satırı saçak omegasıyla aynı adet; Tuna taslak7/7, Excel8/8farkı açık. Görsel ürün kalınlıkları sac0,50mm/omega0,80mm ve seçenekleri kaydedildi; kartlar şimdilik programa eklenmedi. Veranda ek hat kapsamı henüz teyit edilmedi. Build/loading-top/loading-list/verify-loading-xlsx geçti. Kaynak görseller kopyalandı; canlı çizim ve Yeni proje (11).json korundu.

## 4 Ekim 2026 — 5.9.46 / DEV-031 Alın V

[Görsel, kural ve test raporu](analizler/2026-10-04-alin-v-kurali.md). Gerçek çatı modelinin açık eğimli alın kenarları toplamı/2800mm yukarı yuvarlanır;220×2800mm ayrı satır, bindirme/yedek0. Çatı yoksa otomatik adet verilmez ve ekranda açıklanır. loading-verge eğimli3Bboy,iki alın,çatı yok,eğim değişince manuel karar invalidasyonu ve XLSX testleri geçti; loading-list/top regresyonları geçti. Kaynak görsel hash ile referanslara kopyalandı. Uygulama/kayıt/görsel birlikte aktarılır. Tuna çatı modeliyle9adet referans karşılaştırması açık; canlı çizim korunur.

## 4 Ekim 2026 — 5.9.47 / DEV-031 bindirme düzeltmesi

Kullanıcı39cm yazımını30cm olarak düzeltti. Alın V stok2800mm,bindirme300mm,etkin2500mm. Toplam gerçek eğimli alın uzunluğu/2500yukarı yuvarlanır; yedek0. Önceki5.9.46nın/2800kuralı geçersizdir. Ürün ölçüsü220×2800mm değişmez. Kural kimliği verge2500-overlap300-v2; önceki kuralla kaydedilmiş manuel karar yeniden kontrol ister. Çatı eğimi ve açıklığı değişince adet yeniden hesaplanır; makas omega adedinden türetilmez, gerçek çatı geometrisi esas alınır.

Build,loading-verge(sınır yuvarlama,30%eğimde800cm açıklık7adet,40%eğimde1000cm açıklık9adet,manuel/stale),loading-list ve XLSXstok/bindirme/etkin boy açıklaması kontrolleri geçti. Canlı çizim ve yerel kullanıcı JSONu korunmuştur. DEV-031 kural düzeltmesi tamam; Tuna çatı karşılaştırması ve diğer açık işler sürer.

## 4 Ekim 2026 — 5.9.48 / DEV-032 Aşık kapama U

Kullanıcı Alın V ile bire bir aynı adet onayladı. Aşık kapama U ayrı2500mm stok satırı olarak Alın V toplam sevk adedine bağlandı; tuna-37referansı, ek bindirme/yedek0. Alın V geometrisi/eğimi veya manuel toplamı değişirse U güncellenir; eski karar nedeniyle Alın V adedi belirsizse U da otomatik adet vermez. U bağımsız gerekçeli manuel düzenlenebilir. Çatı/Alın V yokken U üretilmez.

Kontroller: build,loading-top(9/9,manuel12/12,stale),loading-verge,loading-list; ayrı XLSX satırlarında7/7,2500mm,tuna-37,0yedek doğrulandı. Canlı çizim ve yerel kullanıcı JSONu değişmedi. DEV-032 tamam; Tuna çatı modeliyle9adet karşılaştırması ve önceki açık işler korunur.

## 4 Ekim 2026 — DEV-033 trapez aşık referansı

[Kaynak görsel/hash ve çıkarım](analizler/2026-10-04-trapez-asik-yerlesimi.md). Trapez sac için eğim boyunca80cm aşık aralığı gözlendi;46,21/34,25cm uç değerleri sabit kural yapılmadı. Başlangıç yönü/ilk-son aşık ve kalan mesafe düzeni kullanıcı teyidi bekler.4200/3000stok dağılımı açık. Görsel ortak referanslara kopyalandı; kod/çizim değişmedi,5.9.48korundu.

## 4 Ekim 2026 — DEV-033 sabit aşık uçları

[Yeni açıklamalı görsel ve kural](analizler/2026-10-04-asik-sabit-uclar.md): saçakta ilk kulak0,sonraki342mm; mahya merkezinden ilk kulak92mm sabit. Ara aralık OSB400mm,trapez800mm,eğim boyunca. Önceki örnek46,21/34,25cm genel sabit değildir. Kalan aralığın hangi uçta veya nasıl dağıtılacağı açıklanmadı; stok/ek kuralı da açık. Görsel/hash ortak referanslara kaydedildi; kod/çizim değişmedi.

## 4 Ekim 2026 — 5.9.49 / DEV-033 120mm mahya ve kalan aralık

[Güncel kural, görseller/hash ve kapsam](analizler/2026-10-04-asik-120mm-mahya.md).92mm yerine120mm; saçak0/342mm,OSB400/trapez800adımlar,kalan mahyada. RoofCore.purlinStations ve dikdörtgen beşik yerel kesit sıra taslağı uygulandı. Serbest sınır/birleşik çatı sıra gösterimi ve stok3000/4200sevk hesabı açık; sıra sayısı ürün sevk adedi değildir. purlin-stations,purlin-section,görsel kontrol,loading-verge/list geçti. Canlı çizim ve kullanıcıJSONu korundu.

## 4 Ekim 2026 — DEV-033 planda aşık sıra boyu

[Kaynak görsel/hash ve açıklama](analizler/2026-10-04-asik-plan-boyu.md). Aşıklar makasları dik keser; örnekte sıra boyu bina/ilgili çatı boyu+iki uçta30+30cm. Saçak modelde dahilse tekrar eklenmez. Stok notu sağdan kesilmiş4000ve...; eski4200/3000referansı ile fiziksel/etkin boy ayrımı ve ek bindirme belirsiz. Stok sevk hesabı için bu iki bilgi bekleniyor. Kod/çizim değişmedi.

## 4 Ekim 2026 — 5.9.50 / DEV-033 aşık stok kombinasyonu

[Kurallar, kapsam ve kontroller](analizler/2026-10-04-asik-stok-kombinasyonu.md).4200/3000mm tüm uygun kombinasyonlar: önce en az fazla(bindirme),eşitse en az parça. Kesim/sabit bindirme/yedek yok. Her sıra gerçek saçak dahil çatı boyundan; aynı saçak tekrar eklenmez.3000/4200 ayrı sevk satırları,ekranda/CSV/XLSXte sıra-kombinasyon-bindirme ayrıntısı. Desteklenen dikdörtgen beşik çatı; serbest sınır/diğer çatı veya kısa sıra açık kontrol satırı verir. DEV-033 genel sıra geometrisi ve ek noktaları hâlâ açık.

Build,purlin-stock bağımsız optimum taraması,loading-purlin arayüz/XLSX,stations,loading-list/verge ve verify-loading-xlsx başarılı. Canlı çizim ve Yeni proje (11).json korunur; kaynak/kayıt/test/dist aktarılır,artifacts geçici kalır.

## 4 Ekim 2026 — Tüm çatı tipleri ve montaj paftası hedefi

[Kod incelemesi,ortak veri düzeni ve kabul planı](analizler/2026-10-04-tum-catilar-montaj-plani.md). Kullanıcı tüm çatı tiplerinde aşık hesabı; ileride sağlayacağı örneklerden4200/3000iki renkli parça/bindirme montaj çizimi,makaslar ve diğer malzemeleri istedi. DEV-033genel çatı kapsamı sürüyor,DEV-034ortak montaj modeli açıldı. Yükleme ve çizim aynı parça/ek verisini kullanmalı. Mevcut stok optimumu tekil ek yerlerini henüz belirlemez; montaj çizimi tamamlandı sayılmaz. Yeni örnek montaj dosyası henüz alınmadı. Bu tur kod/çizim değişmedi,5.9.50korundu; kayıtlar gönderilir.

## 4 Ekim 2026 — Ev / 5.9.51 / DEV-035
Kullanıcı vida oranlarını önceliklendirdi; diğer çatı detayları6Ekim'e bırakıldı. [Karşılaştırma, kaynak hashleri ve sınırlamalar](analizler/2026-10-04-vida-oranlari.md). İki vida ayrı paydalı geçici hesap, manuel düzeltme, Excel referansları, adet/yedek açıklaması. Dört başka vida için gözlenen oran/eksik bilgi raporda; uydurma otomatik kural yok. Build,screw-ratio,loading-screws,loading-list,purlin-stock ve üretilen XLSX tekrar okuma geçti; görsel incelendi. Kullanıcının yerel JSON'u değiştirilmedi, ayrı karşılaştırma kopyası ortak kayda eklendi. Açık işler DEV-033/034 ve diğer vida katsayı sağlaması.

## 4 Ekim 2026 — Ev / DEV-035 çoklu vida sağlaması
Kullanıcının istediği alan,stokboyu,parça karşılaştırması ve aynı geometrideOSBduyarlılık denemesi yapıldı. [Rapor](analizler/2026-10-04-vida-coklu-saglama.md). Nodegeometri/stockhesabı; dosyalar değiştirilmeden bellekten varyant. Minimum mühendislik sayısı doğrulanmadı; geçici yüksek sevk önerisi sunuldu. Kod/sürümdeğişmedi,5.9.51; karar kayıtları gönderilir.

## 4 Ekim 2026 — Ev / mevcut durumu koruma kararı
Kullanıcı mevcut hesabın şimdilik kalmasını ve proje tamamlandıktan sonra birkaç başka proje ile tüm kalemlerin doğrulanmasını istedi. DEV-036 açıldı; DEV-035 geçici hesabı korundu. Uygulama 5.9.51, formüller ve çizimler değişmedi; maksimum vida önerisi uygulanmadı. Git uzak farkı0/0; yalnız kayıt güncellemesi, uygulama testi gerektiren kod değişikliği yok. Sonraki doğrulama için eşleşen çizim/Excel örnekleri gerekecek. Kullanıcının takipsiz Yeni proje (11).json dosyası korundu.

## 4 Ekim 2026 — Ev / Alçıpan devam noktası düzeltmesi
Kullanıcı mevcut alçıpan hesabını hatırlattı. Statik kod incelemesinde beyaz/yeşil/veranda,opsiyonel duvar,net alan,açıklık düşümü,120×250levha ve fire hesabı doğrulandı. Metraj Listesi mevcut; yükleme entegrasyonu eksik,DEV-037 açıldı. [Bulgular](analizler/2026-10-04-alcipan-mevcut-hesap.md). Uygulama5.9.51korundu; çalışma zamanı testi yapılmadı,kod/çizim değişmedi. Sonraki adım mevcut sonucu yüklemeye bağlamak.

## 4 Ekim 2026 — Ev / 5.9.52 alçıpan yükleme entegrasyonu
DEV-037 tamamlandı. Mevcut net alan/fire/levha hesabı aynen kullanılır; duvar kaplama seçimine bağlı duvarlar ve standart tavanlar,renk ve kullanım bazında aktarılır. tests/loading-gypsum.cjs üç seçim modu,mevcut metrajla eşitlik,UI/XLSX; loading-list regresyonu geçti. Build tamamlandı. Kullanıcı JSON'u ve canlı çizim değişmedi. DEV-036 farklı projelerle genel sağlaması bekliyor.

## 4 Ekim 2026 — Alçıpan eksik kural bildirimi
Kullanıcı önceki alçıpan görüşmesinden bir ayrıntının atlandığını belirtti. engine.js,loading modülleri,DEVAM/CALISMA ve test kayıtları tarandı. Kastedilen ayrıntı kesin tespit edilemedi; DEV-037 yeniden açık. Kod değiştirilmedi; mevcut5.9.52 korunuyor. Açıklama alınıp eksik kural doğrulanmalı.

## 4 Ekim 2026 — 5.9.53 / DEV-037 standart ıslak hacim düzeltmesi
Kesin kullanıcı kuralı: Banyo, ebeveyn banyosu ve WC duvarları genel duvar alçıpanı seçiminden bağımsız, her koşulda yeşil alçıpan. Önceki yalnız tavan ifadesi ve tüm duvarları opsiyonel sayan kayıtlar bu kuralla düzeltilmiştir. Diğer kuru mekân duvarları yok/hepsi/seçili tercihine bağlı; tüm tavanlar ve veranda yeşil tavanı mevcut kuralla korunur.
odaDuvarAlci tek kaynağı düzeltildi; çizimde yeşil gösterim genel seçim kapalıyken de çalışır. Islak oda ayarında kapatılabilir kutu yerine standart bilgisi gösterilir. Metraj ve yükleme/Excel aynı hesabı kullanır. loading-gypsum üç modda ıslak duvarların kalmasını, kapalı modda beyaz duvarın olmamasını, renk/metraj eşitliğini ve XLSX üretimini; loading-list genel regresyonu doğruladı. DEV-037 bu düzeltmeyle tamamlandı, DEV-036 farklı projelerle genel sağlaması açık. Canlı çizim ve kullanıcı JSON'u değişmedi.

## 4 Ekim 2026 — Ev / DEV-038 geçme tavan ve alçıpan vidası
Kullanıcı standart tavanlarda vida olmadığını, mini H geçme sistemini ve mevcut projede500vidanın yeşil banyo duvarlarına ait olduğunu açıkladı. Tavan/veranda levhaları hesapta kalır; vida paydasından çıkar.13yeşil levhadan türetilen eski aritmetik oran duvar tüketim katsayısı olarak kullanılmayacak. Kapsam kaydedildi; katsayı ve mini H hesabı açık. Loading kaynakları incelendi, otomatik alçıpan vidası olmadığı doğrulandı. Kod değişmedi,test gerektiren değişiklik yok,5.9.53korundu. Karar ve analiz kayıtları aktarılır.

## 4 Ekim 2026 — 5.9.54 / DEV-038 yeşil duvar vidası
Kullanıcı hesabı düzeltmeyi onayladı. Tuna kontrol JSON'unda alcipanHesap: yeşil duvar brüt21,2625m² − açıklık1,92m² = net19,3425m². Excel92satır500adet /19,3425m² katsayısı; yeni miktar ceil(net yeşil duvar alanı ×500/19,3425). Katsayı yuvarlanmaz. Standart tavan/veranda,levha firesi ve ek yedek dahil değil. Referans sevk yedeği ayrımı bilinmiyor. Kontrol taslağına dayalı geçici orandır, kaynak hashleri önceki vida raporunda; gerçek bağlantı başına tüketim değildir.
Yükleme listesi ve XLSX'e3.5×35mm ayrı satır eklendi. Beyaz duvar seçilirse henüz doğrulanmamış vida türü/oranı için ayrı kural bekliyor satırı görünür; yeşil oran otomatik uygulanmaz. tests/loading-gypsum500kalibrasyon ve fire/çatı bağımsızlığı,üç duvar modu,loading-list ve screw-ratio geçti. Mini H sayım kuralı ve farklı projelerle DEV-036doğrulaması açık. Canlı çizim ve kullanıcı dosyası değişmedi.

## 4 Ekim 2026 — 5.9.55 / DEV-039 çatı sınır çizimi
Kullanıcı görsel köşe snap,tek taraflı dış saçak önizlemesi ve dört köşede oluşturma sorunu istedi. Yakın köşe adayları artık son kenarla ortogonal uyuma göre seçilir; son köşe başlangıç hizasına toleransla oturur. Farede köşe/hiza karesi ve açıklaması gösterilir. İlk kenarda çift yön saçak kaldırıldı; mevcut plan düğüm merkezinden uzak taraf tek çizgi olarak gösterilir (ilk kenardaki yön geometrik tahmindir); kapalı geçerli sınırda gerçek dış offset kullanılır. Dört noktada açık oluşturma mesajı; Enter/ilk köşe/Sınırı kapat korunur,çokgen için otomatik dörtte kapatma yok.
Ana çatı önizlemesinde tam calculate yerine yalnız sınır offseti hesaplanır. Yavru çatı bağlantı hesabı korunur. tests/roof-snap.cjs iki dolaşım yönü,köşeye yakın tıklama,dört nokta/Enter; tests/roof-workflow.cjs çokgen,birleşim,yön,undo,kayıt; loading-list regresyonu geçti. artifacts/roof-snap.png incelendi. Canlı çizim değiştirilmedi; bütün özel geometrilerde hatasızlık iddiası yok. DEV-033/034 montaj/metraj detaylarının ertelenmesi sürer; bu kullanıcı isteğiyle çizim arayüzü düzeltmesidir.

Kanıt: analizler/2026-10-04-cati-snap.md; DEV-039 tamamlandı.

## 4 Ekim 2026 — 5.9.56 / DEV-040 yavru çatı yakalama
Kullanıcı yavru çatı U çiziminde sorunun sürdüğünü bildirdi. Kaynak src/roof-workflow.js: genel snap, ortogonal kilit ve her adımda ana kenar projeksiyonu birbirine karışıyordu. Ayrı dört aşamalı childSnap: ilk noktada ana kenar ve teğet duvar hizası; ilk dış köşede gerçek duvar köşesini koruyup başlangıcı aynı ana kenarda hizalama; ikinci dış köşede ön kenar hizası; sonda başlangıçla aynı ana kenara tam dönüş. Ana kenar normali korunur; yanlış son tıklama reddedilir,hedef/kırmızı uyarı gösterilir. Yavru çizimde ilk köşeye yakın tıklama genel çokgen kapanmasını tetiklemez. Geçerli tıklama eski uyarıyı temizler.
Testler: tests/roof-child-snap.cjs gerçek duvar yüzü köşelerinde sapmalı tıklamalar,başlangıç kaydırma,yanlış dördüncü tıklama reddi,Enter; roof-child-u dört dönüş ve ters dolaşım,alın/yan birleşim,kot hatası,undo/kayıt; roof-snap,roof-workflow,loading-list başarılı. Görsel artifacts/roof-child-snap.png incelendi. Kullanıcının canlı plan JSON'u alınmadığı için ekrandaki özel plan birebir doğrulandı iddiası yok; aynı hata mekanizması kontrollü örnekte test edildi. Eğik/özel sınır desteği genişletilmedi; bütün olası çatılar için koşulsuz sorunsuzluk garantisi verilmez. Canlı çizim değişmedi. DEV-040 bu kapsamda tamamlandı.

## 4 Ekim 2026 — 5.9.57 / DEV-041 tek dış köşe
Kullanıcı aynı fiziksel köşede dört yakın yakalama noktasının yanıltıcı olduğunu bildirdi. Eski ±yarım kalınlık dört kombinasyonu kaldırıldı. RoofWorkflow.exteriorCorners ortak kaynağı: oda iç/dış tarafı ve dış duvar yüz normallerinden kesişim,her düğümde tek dış köşe; iç duvarlar elenir,kollinear ara noktalar köşe sayılmaz. Duvar köşesi açık veranda kenarına önceliklidir; serbest veranda100mm direğinde dış köşe±5cm. Oda topolojisi bulunmayan açık/eksik çizimde taraf için plan düğüm merkezi yedeği kullanılır; karmaşık eksik topolojide dış taraf ayrıca kontrol edilmelidir.
Ana ve yavru çatı aynı aday kaynağını kullanır; veranda sınır köşeleri aynı listede. Başlamadan yeşil aday işaretleri gösterilir. Ana çatı kenarına yavru bağlantı yakalaması köşe adayıyla karıştırılmaz,bağlantı etiketi korunur. Mevcut çatı/duvar koordinatları taşınmadı; kat planının genel duvar çizim snap davranışı değiştirilmedi.
Testler: roof-snap dört yönden aynı köşeye yaklaşımda tek koordinat,iki dolaşım yönü,TunaJSONnodebaşına tekaday,verandadireği±5cm; roof-child-snap,roof-child-u,roof-workflow,loading-list başarılı. DEV-041 tamamlandı. Görseldeki canlı proje yerine ortak Tuna kontrol JSON'u ve sentetik örnekler kullanıldı.

## 4 Ekim 2026 — 5.9.58 / DEV-042 baş makas betopan sınırı
Kullanıcı çizilen çatının baş makası nerede ise betopan kapamanın orada olmasını,alttaki evin girinti/çıkıntısını izlememesini istedi. src/roof.js planStructure içindeki duvardan çatıya yükselen kapama kaldırıldı. Beşik çatı alınları çatı mesnet sınırının yerel X sabit uçlarından üretilir; üst sınır gerçek çatı yüzeyi,alt sınır bölümün wallTop kotudur. Duvar olmayan/veranda boşluğu üzerindeki alın da kapanır. Aynı gruptaki diğer çatının örttüğü sınırda kör kapama üretilmez; childJoin kot farkı kapaması korunur. Veranda eski üçgeni 3Bde ikinci kez eklenmez; direkler korunur. Kat planı duvar şekli değiştirilmedi.
Kontroller: roof-gable-boundary alttaki tüm duvarları kaldırınca kapama geometrisi değişmiyor; roof-child-u birleşimler/dört yön/kot farkı; roof-plan-body,roof-workflow,loading-list geçti. Yeni ekran görüntüsü incelendi. Eski child-u testi artık duvar segmenti yerine çatı sınırı kapamasını doğrular. Bu teslim3Bgeometri düzeltmesidir; betopan levha sevk/kesim metrajı eklenmedi. Kırma/tek eğimde ayrı baş makas kapama kuralı bu değişiklikte varsayılmadı. Kaynak ekran görüntüleri konuşmada,canlı plan değiştirilmedi. DEV-042 bu kapsamda tamamlandı.

## 4 Ekim 2026 — Ev/iş ayrımı olmadan devam için devir
Kullanıcı sonraki çalışmanın hangi bilgisayarda olacağının belirsiz olduğunu,detayların kaybolmamasını istedi.5.9.58korundu; fetch0/0,kod temiz. DEVAMbaşlığı ve öncelikli devam özeti düzeltildi; analizler/2026-10-04-ev-is-devir.md kararlar/uygulanmayan öneriler/açık işler kaydı.9son çatı görseli kopyalanıp hash envanteri tutuldu. Takipsiz kullanıcı JSON'u kayıtlı örnekle hash olarakaynı; orijinal korundu. artifacts/plot.loggeçici. DEV-043son canlı çatı JSON'u bekliyor; görüntüler veya eski yedek güncel çizim ilan edilmedi. Sonraki adım Kaydet dosyasının ortak depoya alınması;ardından açık işlerden devam. Belgeler/referanslar bu adımda gönderilir; kod sürümü artırılmadı.

## 5 Ekim 2026 — İş PC — son kayıtları bulma

İş klonunun 5.9.36 kaydı eskiydi; izinli fetch ile GitHub'daki 49 yeni commit bulundu ve pull --ff-only ile e0b1800 / 5.9.58 alındı. Son ev görüşmelerinin kararları DEVAM/CALISMA ve ev-is-devir raporundan okundu; evin ayrı sohbeti bu PC'nin erişilebilir sohbet listesinde bulunmadı. İş Downloads içindeki en yeni JSON Yeni proje (6).json (3 Ekim 09:51, 5.9.36), orijinali korunup cizimler/2026-10-03-is-kayit-6-5.9.36.json olarak hash doğrulamasıyla kopyalandı. 9 son çatı görseli envanterle eşleşti. [Bulunan kayıtlar ve açık kalan yedek](analizler/2026-10-05-son-kayit-kurtarma.md).

DEV-043 açık: 4 Ekim son canlı ana/yavru çatı JSON'u ortak depoda yok. Yeni bulunan iş yedeği son canlı plan ilan edilmedi. Takipsiz eski pano görseli ve tarayıcı çizimi korundu. Kod/sürüm değişmedi; yalnız yedek/devir kayıtları gönderilir. Sıradaki adım son canlı planın Kaydet dosyasını belirlemek; diğer açık işler son ev devir raporundaki haliyle korunur.


## 7 Ekim 2026 — İş PC — 5.9.59 / DEV-044 ve DEV-045

5 Ekim’den kalan yerel çalışma tamamlandı. Kullanıcı makas akslarını referans belirledi: panel adetleri ve ara ölçüler sabit; köşe payları yönle değişir, uçlar H/makaslara göre kesilir, bina ölçüleri değişebilir. Eski köşe yönünü dondurma kaldırıldı; ortak plan/CAD direk geometrisi, kademede karşılıklı uç payı, çatı dönüşlerinde dünya aksından dizilim ve ana/yavru sınır eşlemesi düzeltildi. 7 Ekim görselindeki U üçüncü noktasına uzak duvar hizası izdüşümü eklendi; dört yönde sapmalı tıklamayla tam dik dönüş ve çatı oluşumu doğrulandı.

Paket testleri geçti; eski PNG testleri mevcut çıktı diyaloguna uyarlandı. Kaynak/dağıtım production-direction, roof-child-snap, roof-child-u, roof-snap, roof-workflow; PDF/DXF, H/köşe ve yükleme kontrolleri başarılı. 80 ve49 pano korunuyor, ara ölçüler değişmiyor; özel pencere/mesnet uyarıları DEV-011’de açık. CSV/XLSX revizyonu artık kayıttan alınır. Beş kaynak görsel orijinalleri korunarak hash ile kopyalandı. Rapor: analizler/2026-10-07-makas-kose-uyumu.md; envanter: analizler/2026-10-07-makas-kose-kaynaklari.json.

DEV-043 son canlı JSON hâlâ bekliyor; açık tarayıcı çizimi değiştirilmedi. İlgisiz eski pano görseli commit dışında korundu. Önceki DEV-006/007/008/011/033/034/036/038 işleri tamamlandı sayılmadı. Sonraki adım kullanıcının Kaydet JSON’u ile gerçek planı doğrulamak; kod/karar/referans teslimini main’e gönderip uzak SHA eşitliğini kontrol etmek.


## 7 Ekim 2026 — İş PC — 5.9.60 / DEV-046

Kullanıcı ilk yavrudan sonra ikinci yavru köşelerinin seçilmediğini gösterdi. Hedef listesi/model yalnız ana çatı kabul ediyordu; görselde ilk yavrunun dış kenarına tıklanıyordu. Liste ana+yavru, ilk tıklamada en yakın hedef ve adı, çizim boyunca sabit hedef; bağımlılık sırasıyla senkronizasyon, eksik/döngülü bağ kontrolü eklendi. roof-child-chain üç ardışık yavruyu kardeş/zincir şeklinde, undo/redo/JSON ve ters kayıt sırasıyla doğruladı. Çatı/snap/U/workflow/yön/başmakas/yükleme ilgili testleri geçti. Kaynak görsel hash ile korundu. Rapor analizler/2026-10-07-ikinci-yavru-cati.md. Önceki 5.9.59 numarası tekrar kullanılmadı; 5.9.60 build hazır. Canlı çizim değiştirilmedi; DEV-043/011 ve diğer açık işler korunur.


## 7 Ekim 2026 — İş PC — 5.9.61 / DEV-047

Kullanıcı kırmızı kenarları Alın V, yeşil hattı mahya diye tanımladı; katalog220/400×2800×0,50 mm, varsayılan220 onaylandı. Saçak taşması ayrı korundu.3B şematik yüzey kapamaları, profil seçimi ve iki ölçülü yükleme eklendi; Aşık kapama U tek toplam satırda. Önceki2500 mm etkin boy kuralı korundu. Mahya net metresi mevcut hesapta; stok/bindirme ve tam büküm ölçüleri bekliyor. roof-trims ve ilgili çatı/yükleme testleri geçti, ekran incelendi. Üç referans orijinalleri korunarak hash ile kopyalandı. Rapor analizler/2026-10-07-alin-v-mahya.md. Canlı plan değiştirilmedi; diğer açık işler korunur.

## 7 Ekim 2026 — İş PC — 5.9.62 / DEV-048

Kot farkının üst kenarları Alın V görünüşüne ve yükleme hesabına eklendi. Mahya kapaması ve 3B çizgisi çatı malzemesinin koyu tonunu kullanır. Kaynak görsel orijinali korunarak hash ile kopyalandı. roof-trims, roof, roof-child-chain, roof-gable-boundary, loading-verge, loading-list geçti; bağımsız ekran incelendi. Rapor: analizler/2026-10-07-alin-v-kot-farki.md. DEV-047 imalat ölçüsü belirsizlikleri ve DEV-043 canlı JSON bekliyor; diğer açık işler korunur.

## 7 Ekim 2026 — İş PC — 5.9.63 / DEV-049

Mahya kapaması Alın V altında kalacak şekilde şematik yüzey sırası ve çizgi örtülmesi düzeltildi. Net metraj değişmedi. roof-trims piksel/ürün/JSON ve roof-panels-3d testleri geçti; ana/yavru ekran incelendi. Kullanıcı görseli hash ile kopyalandı. Rapor analizler/2026-10-07-mahya-alin-v-bindirme.md. DEV-043/047 ve önceki açık işler korunur.

## 7 Ekim 2026 — İş PC — DEV-050 detaylı 3B talebi

Kullanıcı plandaki tüm imalat detaylarını 3B istedi ve eksik teknik modelleri sağlayacağını belirtti. Kütle üretimi, panel motoru, şematik PVC görünüşü ve önceki kesit belirsizlikleri incelendi. Eksik profil/pano/PVC teknik paket listesi ve ortak veri üzerinden uygulama sırası analizler/2026-10-07-detayli-3b-imalat.md dosyasına kaydedildi. Teknik kaynaklar bekleniyor; uygulama değiştirilmedi, sürüm5.9.63. Diğer açık işler korunur.

## 7 Ekim 2026 — DEV-050 ilk panel/birleşim teknik paketi

Standart panel katmanları96/56/146 mm,1250 en,2500/2800/3000 yükseklik ve H1 mm sac kaydedildi. Nadir146 mm panelin nominal adı çelişkili; H kanat/kanal ve köşe sac/ölçü yorumları kullanıcıya soruldu. Dört kaynak görsel kopyalanıp SHA256 doğrulandı. analizler/2026-10-07-panel-uretim-olculeri.json henüz uygulamaya bağlı olmayan referanstır. Kod ve canlı plan değiştirilmedi, sürüm5.9.63; DEV-050 açık.

## 7 Ekim 2026 — DEV-050 H ve köşe ölçü teyidi

146 mm panel15lik; köşe100/50 yönü makasa bağlı. H100 mm ara ölçü,54 mm kanat27+27; H/köşe sacı1 mm. Son kaynak görsel kopyalanıp hash doğrulandı; üretim referans JSON ve DEVAM güncellendi. 10luk örnek3B uygulaması sırada, kod değiştirilmedi/sürüm5.9.63. Net kanal datumu/büküm toleransları ve diğer ürün varyantları onaylanmış sayılmadı.

## 7 Ekim 2026 — 5.9.64 / DEV-050 ilk 3B uygulama

Plan slotlarından katmanlı dolu panolar,10luk H ve makasa bağlı köşe geometrisi eklendi. Çatıyı gizle ve detay/kütle karşılaştırması var. Kapılı/pencereli panolar hâlâ şematik; diğer birleşimler açık uyarıyla bekliyor. wall-3d,roof-plan-body,roof-trims,roof-panels-3d geçti; ekran incelendi. Rapor analizler/2026-10-07-panel-h-kose-3b.md. DEV-050 kısmen uygulandı, tüm imalat modeli tamamlandı sayılmadı.

## 7 Ekim 2026 — 5.9.65 / DEV-051

3B kamera orbit/zoom/pan,altı bakış yönü,paralel/perspektif eklendi. Kullanıcı pencere üst kot210cm ve temsilî PVC onayı verdi. Panolarda açıklıklar, katalog bölünüşlü PVC/kapı görünüşleri,H3/U/X ve diğer kalınlıklarda temsilî profil gösterimi eklendi. Plan/metraj değişmez. wall-3d ve çatı testleri geçti; ekran incelendi. Rapor analizler/2026-10-07-3b-kamera-acikliklar.md. Gerçek imalat kesitleri DEV-050 ve güncel JSON DEV-043 açık.

## 7 Ekim 2026 — DEV-052 STL kaynakları

Yedi pencereli panel STL H sürücüsünden orijinalleri korunarak kopyalandı, SHA256 eşitliği doğrulandı. Binary uzunluk/sonlu koordinat kontrolü ve geometri önizlemesi yapıldı. Hepsi250birim yüksek,125 veya171birim geniş. Birim ve171genişlik kapsamı kullanıcıya soruldu; yanıt bekleniyor. Kaynak/envanter/rapor/önizleme Git aktarımına dahil. Uygulama5.9.65 değişmedi; DEV-050 ve diğer açık işler korunur.

DEV-052 ek teyit: STL birimi cm.160×120/180 kaynaklarının171cm eni hatalı, hedef166cm. Orijinaller korunur; üniform ölçek yasak, pencere/profil kesitleri korunmalı. Eşleme kaydı eklendi; uygulamaya aktarım henüz yok.

## 7 Ekim 2026 — DEV-052 ikinci STL revizyonu

İki yeni STL ayrı klasörde hash doğrulamasıyla korundu. Ölçüm: her ikisi165cm en (hedef166);160×180250cm yüksek,160×120251,0457cm yüksek/Z−1,0457 alt sınır. Uyuşmazlık nedeniyle modele bağlanmadı/ölçeklenmedi. Kullanıcıya sayısal farklar bildirildi; sürüm5.9.65 değişmedi.

## 7 Ekim 2026 — İş PC — DEV-052 üçüncü STL revizyonu

160×120 üçüncü revizyon ölçümü: dış genişlik 165 cm, yükseklik 250 cm; Z alt sınırı 0. Önceki 251,046 cm yükseklik sorunu giderilmiş, ancak 166 cm hedef en hâlâ 1 cm eksik. 160×180 için yeni dosya gelmedi; son revizyon 165×250 cm. Kaynak ayrı rev3 klasörüne kopyalandı, SHA-256 eşitliği ve binary STL uzunluğu/sonlu koordinatlar doğrulandı (5398 üçgen). Ölçekleme veya uygulamaya entegrasyon yapılmadı. Sürüm 5.9.65 değişmedi. Sıradaki adım: 166 cm dış enli kaynakların doğrulanması, ardından gerçek model entegrasyonu; diğer açık işler korunur.

## 7 Ekim 2026 — İş PC — DEV-052 dördüncü STL revizyonu

160×120 dördüncü revizyon: X sınırları −0,5 / 165,5 cm, dış en 166 cm; Z sınırları 0 / 250 cm, yükseklik 250 cm. Hedef dış ölçüler sağlandı. Toplam derinlik 13,245208 cm (donanım dahil dış sınır; duvar kalınlığı değildir). Önceki revizyona göre dış X sınırları iki yandan 0,5 cm genişledi. SHA-256 kaynak/kopya eşitliği, binary STL uzunluğu ve sonlu koordinatlar doğrulandı (5398 üçgen). Eski revizyonlar korundu; yeni dosya aktif 160×120 referansı yapıldı. Bu dış ölçü kontrolüdür; PVC kesitleri, açıklık ölçüleri ve tüm imalat detayları ayrıca doğrulanmalıdır. Ölçekleme veya uygulamaya entegrasyon yapılmadı. 160×180 son rev2 hâlâ 165×250 cm; onun düzeltilmiş kaynağı bekleniyor. Sürüm 5.9.65 değişmedi. Sıradaki adım gerçek STL modelinin planla eşleştirilip 3B görünüşe entegrasyonu; diğer açık işler korunur.

## 7 Ekim 2026 — İş PC — DEV-052 tekrar gönderim

Tekrar gönderilen 160×120 STL rev5 olarak korundu. SHA-256 farklı, ancak 84. bayttan sonraki tüm üçgen verileri rev4 ile bayt bayt aynı; bütün vertex koordinatları aynı. Fark yalnız STL başlık bölümünde. Dış ölçüler yine 166×250 cm, Z alt sınırı0, derinlik13,245208 cm,5398üçgen. Kaynak/kopya hash eşitliği ve binary boyut/sonlu koordinat kontrolü geçti. Aktif geometri referansı rev4 kalır; yeni imalat geometrisi veya uygulama değişikliği yok. 160×180 için yeni kaynak gelmedi. Entegrasyon DEV-052 kapsamında açık; sürüm5.9.65.

## 7 Ekim 2026 — İş PC — 5.9.66 / DEV-052

5.9.66: doğrulanmış 160×120 /166×250 cm STL bağımsız HTML içine gömüldü; ağ/dosya fetch gerektirmez. 250cm yüksekliğinde10luk duvarda160×120 açıklık için1:1 geometri yerleştirilir; ilgili166cm bölgede şematik panel yüzeyleri ve ikinci PVC kaldırılır. Plan/panel sevk verisi değiştirilmez. Dönüşüm: kaynak X merkezi82,5 ve duvar Y merkezi4,8cm, yerel duvar doğrultusuna dönüş; ölçekleme yok. Kaynak STL renk/malzeme taşımadığı için nötr görünüş. Uyumsuz yükseklik/kalınlık veya başka açıklık çakışmasında uyarı ve şematik görünüş sürer. H/profiller plandan korunur; plan mesnet uyumsuzluğu otomatik düzeltilmez. tests/window-stl.cjs gerçek boyut, çift yüzey olmaması, plan değişmezliği ve280cm fallback; tests/wall-3d.cjs regresyonu geçti. Bağımsız ön görünüş artifacts/window-stl.png incelendi. Canlı çizim değiştirilmedi. 160×180 düzeltmesi, diğer STLler, renk/parça semantiği ve250dışı üretim modelleri açık.

## 7 Ekim 2026 — İş PC — DEV-052 eşleşme bildirimi

Kullanıcı250cm/10luk duvarda hâlâ şematik pencere gördü. Canlı file:// sayfasını okumak tarayıcı güvenlik politikasıyla engellendi; dolayısıyla kullanıcı planındaki gerçek pencere ölçüsü ve kesin neden doğrulanmadı. Kodda160×120dışındaki ölçülerin sessizce şematik bırakıldığı bulundu.5.9.67 her pencere ölçüsü için bağlı olmayan STL bilgisini;160×120 için yükseklik,kalınlık,sınır ve açıklık çakışması nedenini ayrı gösterir. Kalınlık sayısal normalize edildi,run sınırı slot sırasından bağımsız hesaplandı. window-stl testi gerçek166×250,dikey yön,uyumsuz kalınlık/yükseklik ve160×180eksik model mesajını doğruladı. Bu sürüm diğer STLleri entegre etmez; kullanıcının özel plan sorunu çözüldü iddiası yok. Pencere ölçüleri soruldu; yanıt bekleniyor.

## 7 Ekim 2026 — İş PC — DEV-052

5.9.68: Kullanıcı son plandaki pencerelerin160×180 ve120×120 olduğunu teyit etti. Yeni160×180 STL rev6 dış ölçüsü166×250cm,5406üçgen; hash doğrulanarak orijinali korunup kopyalandı.160×180 ve120×120 gerçek STLleri, mevcut160×120 ile birlikte ölçü anahtarlı kataloğa bağlandı. Pano enleri166/125cm, yükseklik250cm; ölçekleme yapılmaz. Modeller10luk/250cm duvarda mevcut yerleşim ve çakışma kontrolleriyle kullanılır. Şematik çift yüzey kaldırılır; plan/sevk verisi korunur. window-stl tüm üç eşleşme,kaynak yolları,dış boyutlar,plan değişmezliği,dönüş vefallback; wall-3d regresyonu geçti. artifacts/window-stl-multiple.png bağımsız test görünüşü incelendi. STLler nötr renkte, cam/malzeme ayrımı yok. Canlı çizim okunmadı/değiştirilmedi. Diğer dört STL ve280/300cm modeller açık.

## 7 Ekim 2026 — İş PC — DEV-052

5.9.69: Kullanıcı120×180modelinin hâlâ şematik olduğunu belirtti; bu ölçü önceki üç model listesine dahil değildi.120×180,50×180,60×40,80×125 kaynakları da ölçü anahtarlı kataloğa eklendi; sağlanan yedi model250cm/10luk kapsamda bağlı. Derleyici her STLnin binary boyutunu,sonlu koordinatlarını,125/166cm dış enini ve250cm yüksekliğini doğrular; kaynak hashleri çıktıdadır. window-stl tüm yedi modeli,gerçek enleri,plan değişmezliğini,şematik tekrar olmamasını; wall-3d regresyonunu geçti.120×180/120×120 ortak ekran incelendi. Gri görünüş çözülmedi: STLde malzeme/parça anlamı yok; çizici nötr renk kullanıyor. Cam/PVC/pano ayrımı ve280/300cm modeller hâlâ açık; canlı çizim değiştirilmedi.

## 7 Ekim 2026 — İş PC — DEV-053 /5.9.70

5.9.70: Prefabrik çizim ekranında250/280/300cm düğmeleri ve özel yükseklik alanı eklendi. Yeni proje250cm; kayıtlı projenin yüksekliği korunur. Seçimler Studio.projectField üzerinden doğrulama/undo/kayıt kullanır. STLler için üçgen malzeme sınıfı(panel/PVC/cam) geometrik kuralla üretilir; kaynak malzeme etiketi olmadığı için tahmin olduğu açıklanır. Tüm pano yüzleri mevcut dolu pano rengi ve aynı yön ışıklandırmasını kullanır; PVC beyaz, cam .38 alfa ile en yakın cam yüzeyi üzerinden derinlik kontrollü karıştırılır. Bu basitleştirilmiş cam görünüşüdür; fiziksel kırılma/çok katmanlı cam simülasyonu değildir. STL duvar merkezi üst sınırdaki pano yüzlerinden hesaplanır. Geometri ölçeklenmez. Geometrik sınıflandırma tüm malzemelerde birebir imalat semantiği onayı değildir.280/300ve özel yükseklikteSTL yerine uyarılı şematik görünüş sürer. PVC kahverengi/antrasit seçenekleri kullanıcı tarafından gelecek iş olarak belirtildi; şimdilik beyaz. window-stl(yedi modelde üç malzeme,ölçü/değişmezlik,yükseklik düğmeleri,özel275,undo,yüklenen300seçili),wall-3d ve roof-trims geçti; iki bağımsız ekran incelendi. Canlı çizim değiştirilmedi.

## 7 Ekim 2026 — İş PC — DEV-054

5.9.71: Pencere kol tarafı kaynak STLnin pano yüzlerinden taşma yönüyle belirlenir (yedi kaynakta−Y). Pencere orta noktasının iki yanında kapalı/veranda olmayan oda poligonları sorgulanır; tek iç taraf bulunduğunda STL merkezinden180derece döndürülerek kol içeri alınır. Yansıma/ölçekleme veya plan değişikliği yok. İki taraf oda veya açık plan belirsizse kaynak yönü ve uyarı korunur. Camda beyaz çaprazın nedeni dar üçgenin PVC sınıflanmasıydı; mevcut cam düzlemi/dikdörtgeni içinde kalan aynı düzlem dar üçgenleri cam olarak tamamlanır.120×120/180 ve160×120de birer dar parça düzeltildi. window-stl dört cephe ve ters segment yönünde içkol metadata kontrolü,önceki yedi model/ölçü/yükseklik kontrolleri; wall-3d geçti. artifacts/window-stl-inward.png incelendi; çapraz çizgi örnek görünüşte yok. Canlı çizim değiştirilmedi. Malzeme sınıfları hâlâ geometrik tahmindir; açık plan yönü ve kesin malzeme etiketleri açık.

## 7 Ekim 2026 — İş PC — DEV-055 /5.9.72

5.9.72: Kullanıcı280/300cm panoları yeniden çizmek yerine programda uyarlamamızı istedi. Yedi250cm kaynak STLde220cm üzerinde yalnız250cm üst kenar düğümleri olduğu ve bu düğümlerin yalnızpanel malzemesine ait olduğu kontrol edildi. Runtime250cm üst kenar düğümlerini seçilen280/300kota taşır; diğer tüm koordinatlar korunur. Pencere/PVC/cam/kol boyutları,zeminden kotları,en,kalınlık,malzemeler ve içe dönüş kuralı değişmez; üst dolu pano30/50cm uzar. KopyaSTLler ölçeklenmedi veya üzerine yazılmadı. Parça metadata gerçek pano yüksekliği,kaynak250ve uzatma miktarını taşır. Özel275gibi diğer yükseklikler henüz uyarlanmıyor; açıklayıcı şematik fallback korunur. Mevcut10luk duvar kapsamı sürer. window-stl21model/yükseklik durumu(7×280/300/250): topoloji,üst kenar dışında tüm koordinatlar,cam/PVC koordinatları,kaynak veplan değişmezliği,gerçekyükseklik ve şematik tekrar olmaması; wall-3d regresyonu geçti. artifacts/window-stl-300.png incelendi. Kullanıcının canlı planına müdahale edilmedi. İlk karşılaştırma testi yavaş olduğu için durduruldu,aynı yüzleri indeksle karşılaştıran test başarılı tamamlandı.

## 7 Ekim 2026 — İş PC — DEV-056 / 5.9.73

Kaynak: kullanıcının dört montaj görseli, ../referanslar/2026-10-07-alin-v-montaj/envanter.json içinde kaynak yolları ve SHA-256 kayıtlı. Orijinaller korundu.

Üst kanat artık 8 cm; ön kapama 12 cm; alt dönüş 22/40 cm. Önceki 22/40 cm üst bant ve 6,8 cm ön yüz kaldırıldı. Alt dönüş çatı içine uzanır; ana/yavru çatı kot farkında yüksek çatı yüzüne bağlanır. Mahya daha aşağıda kalır. Saçak taşması, çatı alanı ve stok/metraj uzunlukları değişmez.

Sınırlar: 12 cm bu sürümde düşey yükseklik olarak uygulanır; eğimli kenara dik net kesit yorumu ayrıca doğrulanmalıdır. Küçük dönüş dudaklarının ölçüleri ve büküm yarıçapları verilmedi; uydurulmadı. Sac yüzeyleri sıfır kalınlıklı görselleştirilir, stok kaydı 0,50 mm kalır. Omega/trapez gerçek kesit geometrileri henüz bu modelde yoktur; montajın bu parçalarla çakışma kontrolü yapılmış değildir. Verilen görsellere göre kapama yerleşimi geliştirilmiştir, tam imalat modeli tamamlandı sayılmaz.

Kontroller: roof-trims; 8 cm sabit üst kanat, 22/40 cm alt dönüş ve 12 cm ön yüz koordinatları, undo/JSON, alan ve taşma değişmezliği, stok satırları, kot farkı ve mahya örtülmesi geçti. Bağımsız ana/yavru çatı ekranı incelendi. Canlı çizime müdahale edilmedi.

Sıradaki: kenar dudak ölçüleri, 12 cm ölçü doğrultusu ve omega/trapez kesitleriyle montajı tamamlamak.

## 7 Ekim 2026 — İş PC — DEV-057 / 5.9.74

Kullanıcı kuralı: baş makas / Alın V tarafı 220 veya 400 mm ve özel; yan saçak 300 veya 400 mm ve özel. Yeni sınır çiziminde varsayılan 220/300. Görsel referans: referanslar/2026-10-07-alin-v-montaj/5-sacak-ayrimi.png; kaynak ve SHA-256 envanter.json içinde.

Mevcut kenar offset motoru korunur. eaveRule yalnız yeni çizimlerde veya kullanıcı açıkça uyguladığında eklenir. Beşik ve tek eğimde yerel X uçları alın, Y kenarları yan; kırmada tüm kenarlar yan saçak. Çokgen sınırda yerel kenar yönü kullanılır, birleşim kenarları sıfır kalır. Ayrı ölçü modunda Alın V alt kanadı alın taşmasına eşitlenir; bağımsız eski profil ayarı devre dışı görünür. Özel profil 1–5000 mm; yan saçak 0–5000 mm. Özel ölçü stok satırında kendi genişliğiyle listelenir.

Eski JSON otomatik dönüştürülmez; bir bölümü seçip Ayrı alın / yan ölçülerini uygula seçilir ve Değişiklikleri uygula ile çevrilir. Destek sınırı ve duvarlar sabit; çatı dış sınırı, yüzey ve metraj yeni taşmaya göre hesaplanır. Bağlı U yavru uçları ana çatının yeni karşılık gelen kenarına taşınır; dış derinlik korunur, U dikliği için yan koordinatlar eşlenir. Bağlantı çözülmezse mevcut commit geri alma mekanizması değişikliği reddeder. Undo/redo ve JSON ölçüleri korur. Birleşimde yan taşmanın ana kenarda sınırlandırılması sürer.

Testler: roof-eave-types (eski kayıt/değişikliksiz uygulama, 22/30 dönüşümü, 35/45 özel, bağlı yavru, undo/redo, JSON, X/Y yönü ve kırma alanı), roof-workflow, roof-child-chain, roof-child-u, roof-trims, roof-directions. Testte eski 280 cm duvar varsayımı güncel 250 cm ile düzeltildi; kaldırılmış forma gecikmeli erişim hatası bulundu ve giderildi. Bağımsız 3B ekran incelendi. Canlı kullanıcı çizimi değiştirilmedi.

Kapsam sınırı: verandanın mevcut bağlantı/kenar ayarları korunur; bu yeni kontrol bağımsız ana/yavru çatılar içindir. Alın V küçük bükümleri ve omega/trapez imalat kesitleri DEV-056 kapsamında açık.

## 7 Ekim 2026 — İş PC — DEV-058 / 5.9.75

Kullanıcı teyidi: 250 cm duvarda dış uçtaki en alt kapama noktası 250 cm olacak; 30/40 cm yatay taşma korunacak. Referanslar: referanslar/2026-10-07-alin-v-montaj/6-sacak-alt-kot.png ve 7-sacak-alt-kot.png; kaynak/hash envanterde, orijinaller korundu.

Yeni trim kot referansı, çatı yüzeyinin en düşük kotunu kapama alt kotunun üzerine taşır. Standart kapama 12 cm: h=250 ise yüzey 262, saçak ve Alın V altı 250 olur. Alın V üst ofseti bu referansta sıfır, alt ofseti -12 cm; eski kot modlarında önceki geometri korunur. Özel fasciaDepth 12 cm üzerindeyse daha derin kapama esas alınır; Alın V 12 cm kalır ve duvar kotunun altına inmez. Eğim, yatay taşma, mesnet sınırı ve bağımsız çatı alanı değişmez. Birleşimler gerçek yükseltilmiş düzlemlerden çözülür; sadece görüntü kaydırması yapılmaz.

Yeni sınır ve plandan dikdörtgen çatı trim/12 ile başlar. Eski kayıt otomatik değiştirilmez. Saçak alt uçlarını duvar kotuna oturt düğmesi mevcut ana/yavru çatılarda h=wallTop (yoksa proje yüksekliği), datum=trim, fasciaDepth=12 yapar. İşlem tek undo adımıdır; bağlantı çözülemezse geri alınır. Veranda attachment kayıtları bu toplu işlem dışında; ayrı bağlantı kotları korunur. Kot seçicisinden eski modlar kullanılabilir.

Kontroller: roof-trim-datum (36 yükseklik/taşma/tür/yön; tam alt kot, ana/yavru bağlantı, undo/redo/JSON), roof-trims, roof-child-chain ve roof-eave-types geçti. Bağımsız ekran incelendi. Canlı müşteri çizimi değiştirilmedi.

## 7 Ekim 2026 — İş PC — DEV-059 inceleme

5.9.75 kullanıcı bildirimi: dört U noktası sonrası yavru oluşmuyor. Görselden yaklaşık ana mesnet 970×519,8 cm, taşmalar 22/30; yavru açıklığı 400/500 cm başarılı, 550 cm başarısız. Aynı sentetik deneme eave ve trim kotlarında aynı sonucu verdi. Yüksek yavru mahyasının ana çatı düzlemine saplanamaması olası neden; kullanıcının canlı çizimine ait kesin koordinatlar ve hata metni henüz yok. Gerçek plan JSON istenecek; ölçü/eğim/mahya otomatik değiştirilmedi, kod değişmedi. Referans 8-yavru-baglanti.png, kaynak/hash envanterde.
