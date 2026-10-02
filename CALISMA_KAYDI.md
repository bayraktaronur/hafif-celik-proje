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
