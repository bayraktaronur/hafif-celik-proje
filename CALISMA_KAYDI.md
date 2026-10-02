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
