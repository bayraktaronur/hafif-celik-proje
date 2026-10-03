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
