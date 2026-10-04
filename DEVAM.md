# Prefabrikten Plan Studio — ortak devam kaydı

Son güncelleme: 4 Ekim 2026, ev bilgisayarı; 5.9.51 geçici standart çatı vida oranları.

Bu dosya farklı bilgisayarlardaki sohbetlerin aynı proje durumundan devam etmesi içindir. Sohbet geçmişini eşitlemez. Yeni çalışmada önce Git durumunu kontrol et, sonra bu kaydı ve ilgili raporları oku.

**Çalışma düzeni: gündüz iş bilgisayarı, gece ev bilgisayarı.** Aynı program dönüşümlü geliştirilir. Teslim geçmişi: [CALISMA_KAYDI.md](CALISMA_KAYDI.md).

## Açık işler ve devir durumu

| Kimlik | İş | Durum / tamamlanma koşulu |
| --- | --- | --- |
| DEV-001 | İş bilgisayarındaki AutoCAD dosyası ve analizini alma | Tamamlandı: iki DWG, Excel ve PDF kopyaları ve önceki bulgular ortak depoda; aşağıdaki rapor/envanter. |
| DEV-002 | Güncel müşteri planını belirleme | Kullanıcı bu karşılaştırma için iş JSON'unu açıkça seçti. Sonuç ayrı tuna84-dwg-esleme-taslak.json dosyasıdır; canlı tarayıcı çizimi değiştirilmedi ve son canlı çizim olduğu iddia edilmiyor. |
| DEV-003 | İki bilgisayarda ortak devam kurallarının kullanılması | İlk karşılıklı devir tamamlandı: iş bilgisayarı kuralları aldı; ev bilgisayarı 4c2f1c4 teslimini aldı, kayıtları okudu ve beş dosyanın boyut/SHA-256 değerlerini doğruladı. Her yeni çalışmada devir kontrolü sürer. |
| DEV-004 | Aynı sohbeti cihazlar arasında kullanma | Kurulmadı. Ortak proje kayıtları bundan bağımsız çalışır; hesapta desteklenen bağlantı ayrıca değerlendirilmeli. |

Aktarım: program 5.9.36; kaynak belgeler, ölçülü karşılaştırma ve ayrı kontrol taslağı ortak kayıttadır. Son canlı müşteri planı bundan ayrıdır.

| Kimlik | İş | Durum / tamamlanma koşulu |
| --- | --- | --- |
| DEV-005 | Giriş kapısı panosu / dolgu imalat uyumu | Ayrı kontrol taslağında 52,75 + 125,5 cm düzeltildi; 520 mm kesim eşlemesi 5.9.19'da eklendi. Mevcut kapı aynen korundu. Genel otomatik kapı/pano yerleştirme kuralı değiştirilmedi; canlı çizimlere kendiliğinden uygulanmaz. |
| DEV-006 | CAD–program–Excel–PVC karşılaştırması | Drawing1–iş JSON duvar/pano karşılaştırması ve ayrı taslak tamamlandı; rapor aşağıda. Excel/PVC satır eşleme hâlâ açık. Geometrik 49 yuva ile eski Excel raporundaki 47 ürün farkı çözülmeli. |
| DEV-007 | Yavru çatı bağlantısı ve ortak model | Açık: ikinci U bağlantısı reddi, saplanma/boşluk, snap, yön, alın ve veranda örnekleri tekrar üretilip doğrulanmalı; düğme açıklamaları sadeleşmeli. |
| DEV-008 | Kaplama katmanları ve metraj doğrulaması | Açık: üst örtü + opsiyonel OSB/bariyer/membran; seçilen katmanlar ve 100 cm yerleşim çıktıları aynı modelle doğrulanmalı. |
| DEV-009 | İçe/dışa aktarım, arayüz ve çok kat | Bekleyen ürün talepleri; öncelik imalat doğrulaması. PDF ve DXF dışa aktarma DEV-016 ile tamamlandı. DWG/PDF/DXF içe aktarma, doğrudan DWG yazma ve çift kat açık. |
| DEV-010 | Sohbet kaynaklarını ortak depoya aktarma | 4 kaynak + iş JSON'u hash karşılaştırması başarılı; rapor/envanter hazır. GitHub aktarımı b899d5c commit ile tamamlandı; uzak main ve yerel HEAD eşitliği doğrulandı. |
| DEV-011 | Kontrol taslağının imalat doğrulaması | Açık: e107 hattında 1 makas/H mesnet uyuşmazlığı; özel aks uyarıları, direk/kiriş ve görünmeyen üretim kalemleri. Kapı kesin boşluk kontrolü kullanıcının isteğiyle ertelendi. Tam üretim onayı verilmedi. |
| DEV-016 | Ölçekli PDF ve düzenlenebilir DXF çıktısı | Tamamlandı: 5.9.23; tests/plan-export.cjs, tests/verify-export-pdf.py ve tools/verify-export-autocad.ps1. İçe aktarma kapsam dışı. |
| DEV-017 | PDF/PNG anteti ve sade proje ayarları | Tamamlandı: 5.9.24, tests/title-block.cjs; metadata/logo JSON ile korunur, gerçek logo kullanıcı tarafından seçilir. |

## Doğrulanmış durum

- Uygulama sürümü **5.9.53**. Önceki 5.9.18 commit'i: `d526e03f003083ee866bd80fa34d54d70a4470d2`. Son teslim commit'i Git geçmişinden kontrol edilir.
- GitHub: https://github.com/bayraktaronur/hafif-celik-proje — dal `main`.
- 5.9.16: Tefrişlerde kenar/merkez hizalama, geçici kılavuzlar, Alt + sürükle kopyalama, Shift ile eksen kilidi ve Kopyala düğmesi.
- 5.9.17: Çatı panel kesim sınırlarını 3B görünümde gösterme.
- 5.9.18: Makas/çatı üretim yönü değişirken mevcut duvarlar, köşe payları, panel dizilimleri ve açıklıklar korunur; H mesnet uyumsuzluğu uyarılır.
- Bu son iki sürüm GitHub'dan ev bilgisayarına alındı. Kaynak ile uzak dalın commit eşitliği doğrulandı.
- 5.9.19: Drawing1 etiketlerinden dört ek kesim eşlemesi; ölçülü karşılaştırma ve ayrı 250 cm kontrol planı. Prefab 77/77, temel testler 31/31, CAD pano eşleme ve JSON tekrar açma kontrolleri başarılı.

## Kaynaklar ve ilk sıradaki iş

[Önceki analizler, kararlar ve bekleyen işler](analizler/2026-10-02-tuna84-devir-raporu.md).
[Özgün yollar ve SHA-256 envanteri](analizler/2026-10-02-kaynak-envanteri.json).
Kaynaklar: `referanslar/tuna-84m2/`; iş çizimi: `cizimler/2026-10-02-is-kayit-5.json`.

Kullanıcı Drawing1.dwg dosyasını imalat referansı, iş JSON'unu karşılaştırma hedefi belirledi. [Güncel ölçülü karşılaştırma](analizler/2026-10-02-tuna84-karsilastirma.md) ve [ayrı kontrol planı](cizimler/2026-10-02-tuna84-dwg-esleme-taslak.json) hazır. Panel yüksekliği 250 cm kullanıcı tarafından onaylandı; mevcut dış kapı aynen korundu, kapı sembol/gerçek boşluk farkı bu aşamada ertelendi. Eksik bölmeler, pencere panoları ve veranda taslağa eklendi. Kontrol taslağı imalat onayı değildir; DEV-011 ve Excel/PVC karşılaştırması sonraki işlerdir. Önceki devir raporu tarihsel bulgudur; yeni rapor farkları açıklar.

## Projenin amacı ve kalıcı kararlar

- Prefabrik ve hafif çelik evlerde müşteri sunumuna uygun kat planını üretime uygun veriyle birlikte geliştirmek; ardından 3B sunum, imalat dosyaları ve montaj şemaları.
- İleride 2–3 katlı yapıları destekleyecek sistem; mevcut müşteri örneği tek katlı prefabrik.
- Görünüm filtreleri veriyi değiştirmez. H ekleri, köşe direkleri ve U bağlantıları her görünümde korunur. Kapı/pencere etiketleri en/yükseklik ölçüleridir.
- Otomatik tefriş kapı açıklığını, açılımını ve geçişini kapatamaz. Yatak ve komodin pencere önüne yerleşebilir. Yatak odalarında gardırop ve komodin alternatifleri birlikte değerlendirilir. Banyo/WC otomatik tefrişi şimdilik kapsam dışı.
- Her uygulama sürümü test edilip GitHub'a gönderilir. Ayrıntılı sürüm geçmişi: [README.md](README.md).

## Çizimleri taşıma ve dosya düzeni

- **Kaydet / Ctrl+S** mevcut planı `.json` olarak indirir (`src/studio.js`, `planKaydet`). “Tarayıcıda yedeklendi” mesajı GitHub'a gönderim değildir.
- Ev klasöründeki `Yeni proje (11).json` orijinali korundu. Aynı içeriğin tarihli kopyası: [2026-10-02-ev-kayit-11.json](cizimler/2026-10-02-ev-kayit-11.json). Şema doğrulaması başarılı: 36 duvar, 26 tefriş. En son canlı çizim olduğu doğrulanmadı.
- Kopyanın SHA-256 değeri: `2c45a264202a0bd16f09e1684fe5fe9f5d365623d5e592c33c01ae3474d8c55c`.
- `cizimler/`: iki bilgisayarda kullanılacağı belirlenen Plan Studio JSON kayıtları.
- `referanslar/`: ilgili kaynak DWG/DXF/PDF ve diğer çizim referanslarının kopyaları.
- `analizler/`: kaynakları belirtilmiş analiz raporları, kararlar ve belirsizlikler.
- İş bilgisayarından dört kaynak ve ayrı JSON yedeği aktarıldı; orijinaller korundu ve SHA-256 eşitlikleri doğrulandı. Son canlı çizim olduğu doğrulanmadı.

## Bilgisayar değiştirirken

1. Planı Kaydet ile JSON olarak dışa aktar; kullanılacak dosyayı açıkça belirle.
2. Asistan mevcut çalışmanın kararlarını ve açık işlerini bu dosyaya, analiz sonuçlarını rapora kaydeder; ilgili dosyaları GitHub'a gönderip doğrular.
3. Diğer bilgisayarda proje klasöründeki sohbete: “GitHub'dan güvenli şekilde güncelle, AGENTS.md ve DEVAM.md dosyalarını oku, kaldığımız yerden devam et.” yazılır.

Bu düzen sohbetleri birleştirmez; proje bilgisinin sohbetten bağımsız taşınmasını sağlar. İki bilgisayar arasında aynı sohbeti kullanmak için ürünün desteklediği senkronizasyon/uzak bağlantı ayrıca kurulmalıdır; henüz kurulmadı.

## 2 Ekim 2026 — Genel imalat kural denetimi

- DEV-012 açıldı: kullanıcı aks, H, U, köşe, kapı, yarım ve özel panel sisteminin bütün olarak gerçek imalat örnekleriyle doğrulanmasını istedi. Tek plan eşleme genel üretim motorunun tamamlandığı anlamına gelmez.
- Rapor: analizler/2026-10-02-uretim-kural-denetimi.md; sayısal çıktı aynı adlı .json. tools/audit-manufacturing.cjs bağımsız tarayıcıda üç T örneğini ve 49 yuvalı taslağı denetler.
- Motor hem ortadaki hem merkez dışı T kolunu U sınıflandırıyor; bunun üretimde her konum için geçerli olduğu doğrulanmadı. Yerleşim/kesim/açıklık ölçüleri ve bağlantıya bağlı ürün kataloğu ayrılmalı. İki ek gerçek imalat DWG ve varsa kesim/profil detayları isteniyor.
- Sonraki öncelik DEV-012 kaynaklı kural matrisi; DEV-006 ürün eşlemesi ve DEV-011 mesnet incelemesi bununla birlikte sürer. Uygulama 5.9.19; canlı plan değişmedi. Denetim, üretim onayı değildir.

## 2 Ekim 2026 — Beş ek imalat örneği / DEV-012

- Kullanıcı VP 537 (166 m²), 43 m², VP 517 (68 m²), VP 523 (82 m²), VP 528 (106 m²) dosyalarını programın üretim referansı olarak verdi. Beş kaynak referanslar/imalat-ornekleri/ altına hash doğrulamasıyla kopyalandı.
- [Yeni karşılaştırma](analizler/2026-10-02-bes-imalat-karsilastirma.md); ölçü kanıtı analizler/2026-10-02-bes-imalat-geometri.json; kaynak yolları/hash analizler/2026-10-02-bes-imalat-kaynaklari.json. Ana plan önizlemeleri analizler/imalat-onizleme/ içinde.
- Ortak tam/yarım modül 125,5/62,75; 5 ve 3 cm uç paylarıyla uyumlu farklı panolar var. VP 523'te 169 cm/1690 ve Profilden, diğerlerinde166/1660. VP 528'de eğik cumba ve251/2500. VP 537 42,5 cm yan parça415, VP517 aynı genişlik420 yazıyor: kullanıcı açıklaması bekleniyor; kesim tablosuna eklenmedi.
- U için yalnız kesilmiş panelin geometrik ortası şartı yeterli olmayabilir: VP528'de122,5 panelde59,75 konumunda dik kol teması var; nominalmodül/3cm uç payı açıklaması aday yorum. Üretim teyidi olmadan genellenmeyecek.
- DEV-012 karşılaştırması tamamlandı; kaynaklı ürün/bağlantı kataloğu ve motor uygulaması açık. Öncelik ürün ailesi + uç bağlantısı + yerleşim/kesim ayrımı; ardından eğik cumba ve ayrı kontrol JSON'ları. DEV-006 ve DEV-011 kapanmadı. Uygulama5.9.19, canlı çizim değişmedi.

- Kullanıcı düzeltmesi: 42,5 cm H payı dâhil yerleşim, doğru kesim 420 mm; 415 tamamen yazım hatası. Bu belirsizlik kapandı. 169/Profilden açıklaması bekleniyor; üretim kataloğuna 42,5→420 uygulanacak. Kaynak DWG değiştirilmedi.

## 2 Ekim 2026 — 5.9.20 Metin komutu / DEV-013

- DEV-013 tamamlandı: Metin (T), çok satırlı açıklama, 2–100 cm boyut, 0–359 derece açı; tıkla yerleştir, sürükle taşı, çift tıkla düzenle, Delete/özelliklerden sil. JSON ve tarayıcı yedeği, geri/ileri alma, PNG ve ekrana sığdır desteği var. Metinler metrajdan bağımsızdır.
- Kullanıcı 1690/Profilden panoyu 1660 mm kabul etmemizi istedi. Bu açıklama bekleyen konu kapandı; ayrı Profilden pano türü gereksinimi çıkarılmayacak. Kaynak DWG ve mevcut planlar otomatik değiştirilmedi. Karar analizler/2026-10-02-imalat-onaylari.json içinde.
- Kontroller: yeni metin etkileşim/kayıt/PNG testleri başarılı; temel31/31, prefab77/77. Sürüm5.9.20. DEV-012 genel üretim motoru, DEV-006 ürün eşleme, DEV-011 mesnet kontrolleri açık.

## 2 Ekim 2026 — 5.9.21 Veranda net ölçü düzenleme / DEV-014

- DEV-014 tamamlandı: yatay/dikey mevcut veranda ölçüsüne çift tık veya Özellikler > Net ölçüyü düzenle. Gerçek duvar yüzü payları düşülmüş net santimetre girişi; başlangıç/bitiş/merkez sabit seçenekleri. Bağlı dik veranda kenarları birlikte taşınır.
- Ev düğümleri/duvarları/açıklıkları korunur. Bağlı yan kenar evde sabit kaldığında gerekli dik kademe, uygulanmadan önce dialogda bildirilir. Ev duvarı üzerine binen, kesişen, sıfırlanan veya ters dönen sınırlar reddedilir. Merkez sabit geometrik olarak mümkün değilse uygulanmaz; eğik veranda bu komutun kapsamında değildir. Direk/kiriş/çatı imalatı otomatik güncellenmez.
- Testler: tests/veranda.cjs içinde Tuna net69,5→100 derinlik,507→550 genişlik, bağımsız dikdörtgende merkez sabit, kademe kaldırarak eski genişliğe dönüş, duvar/açıklık koruma, çakışma reddi, gerçek ölçü çift tıklama, geri/ileri alma, oda korunması ve JSON yeniden açma başarılı. Temel31/31, prefab77/77 ve metin testleri geçti; bağımsız HTML üretildi.
- Sürüm5.9.21. Canlı kullanıcı sayfasına müdahale edilmedi. DEV-012 genel üretim motoru, DEV-006 ve DEV-011 açık kalır.

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

## 5.9.25 — Tuna referanslı DXF blokları

| Kimlik | İş | Durum |
| --- | --- | --- |
| DEV-018 | Panel bazlı DXF ve tek yükseklik ayarı | Tamamlandı: Tuna taslağında 49 panel / 49 ayrı INSERT; açıklık yanları ve sembolü panel bloğunda. Tefriş, tezgâh, metin ve bağlantılar ayrı blok. AutoCAD AUDIT iki örnekte 0 hata. [Analiz](analizler/2026-10-02-tuna84-dxf-bloklari.md). |

Üretim doğrulaması DEV-006/011/012 açık kalır. Tarayıcı canlı planı değiştirilmedi. `Yeni proje (11).json` kullanıcı dosyası bu teslimde depoya eklenmedi.

## 5.9.26 — Sade CAD çıktısı

| Kimlik | İş | Durum |
| --- | --- | --- |
| DEV-019 | Parçalı ölçü/tarama ve köşe direklerini düzeltme | Tamamlandı: native DIMENSION/HATCH, sade/panel/ekrandaki detay seçimi, 10×5 köşe ve 10×10 veranda serbest uç direği. [Rapor](analizler/2026-10-03-sade-dxf.md), tests/cad-export.cjs ve AutoCAD kontrolleri. |

Önceki DEV-018 blok aktarımı korunur. Sade görünüm varsayılandır; taramalar kutudan kapatılabilir. DIMENSION kendi uç noktasına göre güncellenir; panel bloğuna ilişkisel bağlantı kurulmuş değildir. Bağlantı çizgileri 2B plan sembolüdür; üretim profil detayının onayı değildir. DEV-006/011/012 açık. Kullanıcı canlı çizimi değişmedi, Yeni proje (11).json takip dışı korundu.

## 5.9.27 — Tarama ve veranda dış sınırı

| Kimlik | İş | Durum |
| --- | --- | --- |
| DEV-020 | Hatch duvara giriyor; veranda çizgisi direğin içinden geçiyor | Tamamlandı: duvar/direk izdüşümü taramadan çıkarılır, kapalı veranda konturu mevcut10cm direğin dış yüzüne5cm ötelenir. tests/cad-boundaries.cjs75708nokta ve AutoCAD dört örnek AUDIT0. [Rapor](analizler/2026-10-03-dxf-net-sinir.md). |

Aks, ölçü, oda alanı ve kayıtlı model değişmez; değişiklik DXF gösterimidir. Açık veranda yollarında iç/dış belirsiz olduğundan aks korunur. Canlı çizim ve takip dışı kullanıcı JSON korunmuştur. DEV-006/011/012 açık.

## 3 Ekim — Yükleme listesi bağlantısı / DEV-006

Excel ana sayfası yeniden okundu. Panel47/çizim49 farkı açık; stok pano ile yerleştirilmiş parça ayrımı doğrulanmalı. Öneri: çizim revizyonu → malzeme/kesim reçetesi → izlenebilir yükleme satırları; önce panel/metal/kapı-PVC satır eşleme. [Öneri ve kaynak hash](analizler/2026-10-03-yukleme-listesi-baglanti.md). Henüz entegrasyon uygulanmadı, reçeteler onaylanmadı. Sürüm5.9.27 aynı.


## 5.9.28 — Otomatik yükleme listesi ilk aşama

| Kimlik | İş | Durum / tamamlanma koşulu |
| --- | --- | --- |
| DEV-021 | Çizim–yükleme listesi entegrasyonu | İlk aşama tamamlandı: panel/bağlantı/açıklık sayımı, filtre, gerekçeli miktar, Tuna Excel satır eşleme, CSV, JSON/geri alma/kurtarma. Açık: stok pano-kesim reçetesi, kulak/dübel/net boy, PVC sipariş ölçüsü, çatı/tesisat/sarf ve onaylı sevkiyat revizyonu. DEV-006 ile birlikte devam eder. |

[Rapor ve kullanım](analizler/2026-10-03-yukleme-listesi-ilk-surum.md). Üstte **Yükleme listesi** açılır. Çizim adedi otomatik, sevk taslağı miktarı doğrulanmış üretim reçetesi olmadığından başlangıçta boş. Manuel karar gerekçeyle ve ilgili nesnelerin durumuyla kaydedilir; ilgili çizim değişince yeniden kontrol gerekir. Tuna Excel referanstır, her projenin hedefi değildir. Çıktı CSV; özgün XLSX şablonuna yazma henüz yok.

Sonraki adım: Tuna'nın 49 geometrik yuva/47 ürün farkını panel kesim-stok eşlemesiyle çözmek; ardından metal profil ve PVC reçetelerini kalem kalem doğrulamak. Bu teslim üretim onayı değildir. Canlı tarayıcı planı ve takip dışı Yeni proje (11).json değiştirilmedi; yeni müşteri planı aktarılmadı. İki PC arasında yükleme ayarları da Kaydet ile alınan JSON'un içindedir.


## 5.9.29 — Kullanıcı H kuralı

| Kimlik | İş | Durum |
| --- | --- | --- |
| DEV-022 | Makas altındaki H kulak/dübel sınıflandırması | Verilen iki kural uygulandı/test edildi. İç H dübel ve makas dışı H kuralları açık; stok/net boy reçetesi tamamlanmadı. |

[Rapor](analizler/2026-10-03-h-kulak-dubel.md). Makas altında H kulaklı; dış duvarda ayrıca dübelli. İçte dübelsiz veya makas dışında kulaksız varsayılmaz. Tuna kontrol taslağında21 dış kulaklı/dübelli,12 iç kulaklı,3 belirsiz H bağlantısı; H/üçlü ayrımı raporda. Mevcut otomatik makaslara göre sonuç; Excel ile farklar açık. Kullanıcı canlı planı değiştirilmedi. Diğer açık işler korunur.


## 5.9.30 — Dış H kuralı / DEV-022 devamı

Kullanıcı onayı: makas altına gelmeyen dış duvar H'leri **kulaksız–dübelli**. Programda işlendi. Makas verisi yoksa veya eşleşen makasın mesneti belirsizse otomatik kulaksız denmez. İç H dübel ve makas dışında kalan iç H kuralları hâlâ açık.

Tuna kontrol dosyası: H18 + üçlü H3 kulaklı–dübelli; H2 kulaksız–dübelli; H8 + üçlü H4 kulaklı/dübel bekliyor; H1 iç bağlantı kural bekliyor. Excel farkları çözülmedi. tests/loading-h.cjs ve loading-list.cjs başarılı. Canlı çizim değiştirilmedi; takip dışı JSON korundu. DEV-006/011/012/021 ve kalan DEV-022 kuralları devam eder.


## 5.9.31 — İç H kuralları / DEV-022

Kullanıcı onayı: iç duvar H'leri her zaman dübelsiz; makas altında kulaklı, dışında kulaksız. Böylece dört temel sınıfın kuralı tamamlandı ve programa işlendi. Makas verisi yok/mesnet belirsizse kulak kararı bekler; dübel dış duvar işaretinden belirlenir. H, üçlü H ve dörtlü H ailesi kapsamda; U/köşe için kural varsayılmaz.

Tuna kontrol dosyası, üçlüler dahil:21 kulaklı–dübelli,2 kulaksız–dübelli,12 kulaklı–dübelsiz,1 kulaksız–dübelsiz. Kaynak Excel farkları, net profil/kesim boyu ve sevk reçeteleri hâlâ açık (DEV-006/011/012/021); DEV-022 temel kulak/dübel kuralı tamamlandı, fiziksel makas uyumu kontrolü sürer. tests/loading-h.cjs ve loading-list.cjs başarılı. Kullanıcı çizimi ve takip dışı JSON korunmuştur. [Ayrıntı](analizler/2026-10-03-h-kulak-dubel.md).


## Tuna H–Excel karşılaştırması / DEV-006 ve DEV-022

[Rapor](analizler/2026-10-03-tuna-h-excel-karsilastirma.md):36/36 toplam eşit; standart dış20/iç9, üçlü dış3/iç4 eşit. Excel kulaklı12/kulaksız24, program33/3. Dış8 standart+1 üçlü farkı makasla aynı doğrultudaki duvarlarda; iç8 standart+4 üçlü de programda kulaklı, Excel'de kulaksız. **2B makas aks eşleşmesi fiziksel H'nin makasa girdiğini kanıtlamaz.** DEV-022 temel tarifleri kayıtlı ama fiziksel temas koşulu doğrulaması açık; üst/alt cephe ve iç bölme örnekleri kullanıcıyla doğrulanmalı. Kod/sürüm5.9.31 değişmedi, Excel ve müşteri çizimi değiştirilmedi. Rapor bağlantı kimlikleri ve kaynak hash'lerini içerir.


## Tuna H mesnet yorumu — sonraki uygulama düzeltmesi

[İlişkilendirme raporu](analizler/2026-10-03-tuna-h-mesnet-yorumu.md): makasın yalnız a/b uçlarına oturan H'leri kulaklı kabul eden alternatif hesap Excel'in6satırını tam karşılıyor:10/10/9/2/1/4. Kullanıcının “makasa giren” şartı önceki kodda geniş2B aks eşleşmesi olarak yorumlanmış. Güçlü açıklama kulak=gerçek mesnet bağlantısı, dübel=dış duvar. Bu projede iç13H gerçek uç mesnette değil; her projede iç H kulaksız genellemesi yapılmamalı. **DEV-022 kod düzeltmesi açık:**5.9.31 halen33kulaklı üretir; analizdeki12kulaklı sonucu henüz uygulamaya işlenmedi. Kod/çizim/Excel değişmedi. Diğer açık işler sürer.


## 5.9.32 — Onaylı H mesnet eşlemesi ve Excel / DEV-022

Kullanıcı mesnet yorumunu onayladı ve sonraki çizimlerde otomatik etiket/Excel aktarımı istedi. Gerçek model makasının a/b uçlarına eşleşen H kulaklı; arada üzerinden geçilen H kulaksız. Dış H dübelli/iç H dübelsiz. İç duvarda gerçek makas ucu bulunursa kulaklı-dübelsiz olabilir. Makas verisi yok/mesnet belirsizse adet otomatik kesinleşmez. Özel ara mesnet henüz modelde ayrıca tanımlanmaz; bu tür yeni denemelerde eklenmesi gerekir.

H sınıfları tüm çizimlerde otomatik hesaplanır; yükleme listesindeki H taslak adedi otomatik, diğer ürün kuralları ayrı bekler.250cm ve mevcut10/6cm gruplarında Tuna satırları otomatik eşlenir; farklı ölçülerde bu referans zorlanmaz. Tuna sonucu10/10/9/2/1/4,36H; altı Excel satırı tam eşleşti. Kullanıcı elle miktar değiştirebilir; geometri/kural değişimi eski kararı yeniden kontrol ettirir.

Yükleme listesi → Planda H etiketleri (K/KS/D/DS); seçim JSON/geri alma/kurtarmada saklanır. H ve köşe sembolleri etiket kapatıldığında da kalır. Excel indir (.xlsx) tüm güncel listeyi yeni dosyada verir; özgün Tuna Excel dosyasını değiştirmez. CSV de korunur. XLSX sayılar sayısal, kullanıcı metinleri formül olarak yürütülmez. Profil kesiti/net boy ve diğer üretim kalemleri hâlâ kontrol gerektirir.

Kontroller: loading-h.cjs iki yön/uç-orta ayrımı/mesnet ve veri belirsizliği, Tuna altı grup; loading-list.cjs otomatik adet, gerçek XLSX/CSV, etiket, kayıt/geri alma; verify-loading-xlsx.py bağımsız okuma; plan-export.cjs başarılı. Arayüz ve etiketler görsel incelendi. Canlı kullanıcı çizimi ve takip dışı JSON korunmuştur. Sıradaki iş kullanıcının yeni deneme çizimlerinde doğrulama; diğer açık işler devam eder.


## 5.9.33 — Köşe direği ürün ölçüsü / DEV-023

| Kimlik | İş | Durum |
| --- | --- | --- |
| DEV-023 | 10'luk/6'lık köşe direği Excel ürün eşlemesi | Tamamlandı: çizim nominal10/6cm korunur; yükleme ve XLSX/CSV98×98×bina yüksekliği(mm) /58×58×bina yüksekliği(mm). Adet otomatik. |

Kullanıcı açık kuralı:10'luk köşe98×98,6'lık köşe58×58; boy sabit2500 değil bina yüksekliği(cm)×10. Tuna'da8 adet98×98×2500 ve Excel22satırı eşleşir. Farklı yükseklikte Tuna2500satırı zorla eşlenmez. Karma10/6 veya tanımsız kesit kural bekler; veranda serbest direğine ve H profiline bu kural uygulanmaz. Çektirme U3/4 farkı açık. Yükseklik değişince eski manuel düzeltme yeni ürün grubuna sessizce taşınmaz.

Kontroller: tests/loading-corners.cjs10/6 nominal koruma,250/280/300cm boy,8Tuna adedi, tanımsız kesit ve eski düzeltme; loading-list, loading-h, verify-loading-xlsx başarılı. Gerçek indirilen XLSX'te98×98×2500,8adet,tuna-22 doğrulandı. Canlı plan ve kullanıcı JSON'u değiştirilmedi. Diğer açık işler devam eder.


## 5.9.34 — Çektirme U ve yedek / DEV-024

| Kimlik | İş | Durum |
| --- | --- | --- |
| DEV-024 | U ölçüsü, Tuna3/4 farkı ve yedek | Tamamlandı: kullanıcı3/4farkının bilinçli yedek olduğunu açıkladı; ölçü ve otomatik sevk hesabı uygulandı. |

Kullanıcı kararı:6cm duvar U60mm,10cm duvar U100mm. Boy=bina yüksekliği(cm)×10−60mm. Her5U'ya1yedek;3→4örneği gereği her başlayan5'li grup yukarı yuvarlanır. U yoksa yedek yok;1–5adet+1,6–10adet+2,11–15adet+3. Farklı en/boylar ayrı gruplandırılır ve her gruba ayrı yedek hesaplanır. Bu yorum kullanıcıya uygulama başında açıklandı. Çizim adedi değişmez, sevk miktarı çizim+yedek; gerekçeli manuel miktar son toplamın yerine geçer, tekrar yedek eklenmez.

Tuna3adet60×2440mm+1yedek=4adet, Excel29satırı eşleşir. Yedek arayüzde ve XLSX/CSV'de ayrı görünür. Tanımsız kesit/boy otomatik hesaplanmaz. H ve köşe adetleri korunur. tests/loading-u.cjs0/1/3/5/6/10/11, ölçü grubu ayrımı, manuel ve eski karar; loading-list/H/corners ve verify-loading-xlsx başarılı. Canlı plan ve kullanıcı JSON'u korundu. U farkı kapandı; panel47/49 ve diğer üretim işleri sürer.


## Çektirme U — son kullanıcı teyidi

Kullanıcı dört maddeyi birlikte açıkça doğruladı:6'lık bağlanan duvar için60mm U;10'luk için100mm U; her iki ende boy=bina yüksekliği−60mm; her başlayan5adede1yedek ve farklı ölçüler ayrı.250cm yükseklikte60×2440 veya100×2440mm;100×2400mm kullanılmaz. Önceki açıklama sorusundaki belirsizlik kapandı. Mevcut5.9.34 hesabı doğru; kod/sürüm değişmedi. Bu karar ev/iş ortak kaydıdır.


## Pano stok hesabı — iki yarım için bir tam / DEV-025

| Kimlik | İş | Durum |
| --- | --- | --- |
| DEV-025 | Yerleştirilen panel ile sevk stok panosu ayrımı | Kural toplama/uygulama açık. Kullanıcı normal koşulda iki yarım yerine bir tam pano gönderildiğini, montajcının şantiyede kestiğini doğruladı. |

Önceki “bir yarım gönderiyoruz” ifadesi kullanıcı tarafından “bir tam” olarak düzeltildi. Çizimde iki yarım panel korunmalı, sevk listesi bunların kaynak tam panosunu ayrı saymalı. Özel durumlar olabileceği kullanıcı tarafından belirtildi. Tek kalan yarımın sevki, özel boy parçaların birlikte kesimi ve malzeme uyumluluğu ayrıntıları henüz kesinleştirilmedi. Bunlar varsayılarak genel kesim optimizasyonu uygulanmamalı. Bu tur kayıt güncellemesidir;5.9.34 kodu değişmedi, pano otomatik stok hesabı henüz eklenmedi. Tuna49/47 farkı bu kural kullanılarak ayrıca doğrulanmalı; fark çözüldü denmez. Diğer açık işler ve kullanıcı çizimi korunur.


## DEV-025 — Kesim kapsamı genişletmesi

Kullanıcı aynı tam panodan şantiyede kesim uygulamasının yalnız62,5cm yarım panel için değil57,5cm ve daha kısa özel panel parçaları için de geçerli olduğunu açıkça belirtti. Kural parça adına veya yalnız yarım panel tipine bağlanmamalı; uyumlu parçaların gerçek kesim enlerinden stok pano ihtiyacı hesaplanmalı.62,5/57,5 kullanıcı örnekleridir; mevcut aks/net kesim katalog farkları bu kararla kendiliğinden değiştirilmez. Bir tam panodan üç veya daha fazla küçük parça çıkarma, tek kalan parça sevki ve kesim payı henüz açıkça tarif edilmedi. Bu tur üretim kararı kaydıdır; kod5.9.34 değişmedi. DEV-025 uygulaması ve Tuna49/47 doğrulaması açık; kullanıcı çizimi korunmuştur.


## 5.9.35 — Dolu pano stok kesimi / DEV-025

Kullanıcı2×30cm→1tam,3×40→1tam,102→1tam,2×70→2tam örneklerini onayladı; sahada kesim artığı kabul ediliyor. Çizim parçaları birleştirilmez/ölçüleri125'e çevrilmez.125,5 ve62,75 dışında özel genişlik etiketi panel numaraları kapalıyken de görünür; geometri ve ölçü değerleri korunur.

Net kesimi bilinen dolu parçalar kalınlık/yükseklik bazında1250mm stok panoya büyükten küçüğe sığdırılır. Bu uygulanabilir plan en az stok garantisi değildir; en toplamını1250'ye bölmekle yetinilmez (2×700 iki stok). Satır Çizim=parça adedi, Sevk=stok adedi. Kesim dağılımı panel numaraları ve artıklarla UI/Excel/CSV'de gösterilir; manuel toplam ve eski karar denetimi korunur. Kapılı/pencereli ürünler dolu havuza katılmaz. Testere payı henüz verilmedi; otomatik pay uydurulmadı, bu durum açıklamada belirtilir.

Mevcut Modular net kesim kataloğu öncelikli. Kullanıcının doğrudan verdiği30/40/70/102/57,5/62,5cm örnekleri ayrıca net mm olarak tanınır; diğer katalog dışı genişlikte net kesim bilinmediğinden otomatik stok hesabı bekler. Aks ölçüsünden evrensel pay çıkarılmaz.

Tuna:24dış dolu parça→22stok (Excel23);13iç dolu parça→12stok (Excel12).710+520mm birlikte1230mm olur ve20mm artık bırakır; önceki47toplamla fark tamamen kapanmadı. Kapı/pencere12ürünün reçetesi ayrı açık.49yerleşim korunur. DEV-025 ilk uygulama tamam, bilinmeyen kesim ölçüsü/testere payı ve deneme çizimleriyle üretim doğrulaması açık.

Testler: loading-stock kullanıcı örnekleri, ölçü grupları, sığma/artık, eski karar; loading-list Tuna24/22 ve13/12, JSON/CSV/XLSX; loading-H/U/corners regresyonları; plan-export başarılı. Özel etiketler görsel kontrol edildi. Canlı müşteri planı ve takip dışı JSON korunmuştur.

## 5.9.36 — Serbest özel ölçüler / DEV-025

Kullanıcı örneklerin sınırlı liste olmadığını netleştirdi. 5.9.35 içindeki 30/40/70/102/57,5/62,5 özel ölçü listesi kaldırıldı. Her pozitif sonlu özel en genel olarak değerlendirilir. Modular kataloğundaki doğrulanmış net kesimler önceliklidir (125,5→1250; 62,75→625 mm). Diğer enlerde çizim ölçüsü mm'ye çevrilerek stok hesabına esas alınır; bu değer doğrulanmış net imalat kesimi sayılmaz, H payı uydurulmaz. Kaynakta cutBasis tutulur ve hesap açıklamasında belirtilir. 1250 mm'den büyük tek parça bu stokla otomatik karşılanmaz. Kapı/pencereler ayrı kalır. Çizim geometri ve etiketleri değişmez.

Kalınlık/yükseklik grupları, artık ve uygulanabilir büyükten küçüğe sığdırma korunur; en az stok garantisi ve testere payı henüz yoktur. 1249 farklı en, ondalıklı karışık gruplar, bilinen katalog önceliği, büyük parça kontrolü ve tarayıcıda 37,2+86,4 cm özel parçalarının tek stok hesabı test edildi. Tuna sayıları 24/22 ve 13/12 değişmedi; JSON/CSV/XLSX ve eski karar kontrolleri geçti. DEV-025 saha net kesim paylarının genellenmesi, testere payı ve deneme çizimleriyle doğrulama açık. Canlı kullanıcı çizimi ve Yeni proje (11).json korunmuştur.

## 3 Ekim 2026 — Gün sonu yedeği, yarın devam

Kullanıcı çalışmayı yarına bıraktı. Program 5.9.36; değişiklik yapılmadı. Son karşılaştırma, yedek envanteri ve yarın ilk adım: [gün sonu devir raporu](analizler/2026-10-03-gun-sonu-devir.md). Mevcut eski JSON ayrı cizimler/2026-10-03-ev-mevcut-yedek-5.9.14.json olarak korundu (SHA-256 raporda); canlı son çizim olduğu doğrulanmadı. DEV-002 açık: file:// sekmesine erişim güvenlik politikası engeli nedeniyle canlı çizim yedeği alınamadı; kullanıcı Kaydet ile son JSON'u dışa aktarmalı. DEV-025/DEV-006: dış pano 22/23 farkı ve kapı/pencere reçeteleri yarın incelenecek; diğer açık işler devam ediyor.

## 3 Ekim 2026 — İş bilgisayarında devam

Temiz main, 4c2f1c4 üzerinden f0911ee sürümüne fast-forward güncellendi. Ortak kayıtlar ve gün sonu raporu okundu. tests/loading-stock.cjs ve tests/loading-list.cjs iş bilgisayarında başarılı: Tuna 24 dış dolu parça/22 stok, 13 iç parça/12 stok sonucu yeniden doğrulandı. Canlı tarayıcı sayfası yenilenmedi, plan yüklenmedi; kayıtlı kontrol taslağı ayrı test tarayıcısında kullanıldı.

DEV-025/006 için kullanıcıya 710+520 mm parçaların aynı 1250 mm panodan kesilip kesilemeyeceği soruldu. Yanıt gelmeden Excel23'e uydurmak için stok kuralı değiştirilmedi. Son canlı JSON hâlâ doğrulanmadı (DEV-002). Sıradaki iş sevk tercihini netleştirmek ve kapılı/pencereli ürün reçetelerini incelemek. package.json hâlen5.9.19 yazarken uygulama/rapor5.9.36; bu metadata farkı sonraki sürüm tesliminde uzlaştırılmalı. Diğer açık işler geçerlidir.

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
| DEV-026 | Alt çerçeve, omega, veranda profil/kiriş ve çatı kenarı malzemelerinin otomatik yükleme hesabı | 5.9.44: onaylı dört omega/Z/kiriş kalemi uygulandı; tests/loading-top.cjs ve analizler/2026-10-04-omega-veranda-uygulama.md. Alt çerçeve ve direk önceki kuralları korunur. Referans adet/net boy farkları DEV-011, omega yedeği ve diğer çatı kenarı reçeteleri açık. |

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

| Kimlik | İş | Durum |
| --- | --- | --- |
| DEV-029 | Z / baş makas omega geçici referans bağı | Tamam: 5.9.43, productLinks ve yükleme karşılaştırması; ileride kullanıcı kararıyla revize edilir. 5.9.44te ayrı Z satırı omega adedine bağlı; test/rapor DEV-026. |

## 4 Ekim 2026 — 5.9.44 / DEV-026 dört kalem uygulandı

[Uygulama, sayısal sonuçlar ve sınırlar](analizler/2026-10-04-omega-veranda-uygulama.md). Verandaya komşu duvarlar ve yan kirişler duvar omegasına dahil; baş makas/saçak2500mm toplamdan yukarı yuvarlanır. Z ayrı satırda geçici1:1 omega bağıdır; tuna-41 iki kez toplanmaz. Veranda kirişinin net+100mm sevk boyu listede/CSV/XLSX'te ayrı alanlarda. Çizim korunur, yedek0.

Tuna: iç omega9,100lük duvar omega5,baş omega8,Z8,saçak7. Kiriş net4970/2527,5/645→sevk5070/2627,5/745mm. Eski Excel/yan kiriş görsel farkları raporda; tam üretim eşitliği iddia edilmez. Belirsiz yerel çatı yönü/eğik veranda otomatik adet verilmeden kontrol bekler.

Build, loading-top/omega/list/h/frames/posts ve verify-loading-xlsx geçti; görsel kontrol yapıldı. Kaynak/dist/karar/testler birlikte gönderilir. Yeni proje (11).json ve canlı çizim korunmuştur; geçici artifacts Git'e alınmaz. DEV-026 onaylı dört uygulama kalemi tamam; DEV-011 imalat farkları ve DEV-028 özel ölçü sekmesi açık.

## 4 Ekim 2026 — Saçak sacı aday bağlantısı / DEV-030

[Kaynaklı çıkarım](analizler/2026-10-04-sacak-saci-aday-esleme.md): Tuna saçak omegası ve saçak sacı8eradet. Aday bağlantı yan saçak hattı; stok boyları2500/2800farklı olduğundan otomatik1:1adet kuralı kabul edilmedi. Veranda duvar omegası istisnası nedeniyle yalnız ürün adına bağlamak yeterli değil. Kullanıcı teyidi bekleniyor; kod/çizim değişmedi,5.9.44korundu.

| Kimlik | İş | Durum |
| --- | --- | --- |
| DEV-030 | Saçak sacı hat/kapsam ve adet kuralı | 5.9.45: 300mm bindirme,2500mm etkin boy ve omega ile ayrı eşit adet satırı tamam. Rapor: analizler/2026-10-04-sacak-bindirme-kurali.md. Veranda ek hat kapsamı açık. |

## 4 Ekim 2026 — 5.9.45 / DEV-030 saçak sacı bindirme

[Onay, ürün görselleri/hash ve kontroller](analizler/2026-10-04-sacak-bindirme-kurali.md). Kullanıcı2800mm sacın300mm bindirme ile2500mm etkin olduğunu doğruladı. Ayrı sac satırı saçak omegasıyla aynı adet; Tuna taslak7/7, Excel8/8farkı açık. Görsel ürün kalınlıkları sac0,50mm/omega0,80mm ve seçenekleri kaydedildi; kartlar şimdilik programa eklenmedi. Veranda ek hat kapsamı henüz teyit edilmedi. Build/loading-top/loading-list/verify-loading-xlsx geçti. Kaynak görseller kopyalandı; canlı çizim ve Yeni proje (11).json korundu.

## 4 Ekim 2026 — 5.9.46 / DEV-031 Alın V

[Görsel, kural ve test raporu](analizler/2026-10-04-alin-v-kurali.md). Gerçek çatı modelinin açık eğimli alın kenarları toplamı/2800mm yukarı yuvarlanır;220×2800mm ayrı satır, bindirme/yedek0. Çatı yoksa otomatik adet verilmez ve ekranda açıklanır. loading-verge eğimli3Bboy,iki alın,çatı yok,eğim değişince manuel karar invalidasyonu ve XLSX testleri geçti; loading-list/top regresyonları geçti. Kaynak görsel hash ile referanslara kopyalandı. Uygulama/kayıt/görsel birlikte aktarılır. Tuna çatı modeliyle9adet referans karşılaştırması açık; canlı çizim korunur.

| Kimlik | İş | Durum |
| --- | --- | --- |
| DEV-031 | Alın V eğimli boy hesabı | 5.9.47: 300mm bindirme ile /2500 etkin boy düzeltmesi tamam; tests/loading-verge.cjs. Tuna9adet karşılaştırması için çatı modeli gerekli. |

## 4 Ekim 2026 — 5.9.47 / DEV-031 bindirme düzeltmesi

Kullanıcı39cm yazımını30cm olarak düzeltti. Alın V stok2800mm,bindirme300mm,etkin2500mm. Toplam gerçek eğimli alın uzunluğu/2500yukarı yuvarlanır; yedek0. Önceki5.9.46nın/2800kuralı geçersizdir. Ürün ölçüsü220×2800mm değişmez. Kural kimliği verge2500-overlap300-v2; önceki kuralla kaydedilmiş manuel karar yeniden kontrol ister. Çatı eğimi ve açıklığı değişince adet yeniden hesaplanır; makas omega adedinden türetilmez, gerçek çatı geometrisi esas alınır.

Build,loading-verge(sınır yuvarlama,30%eğimde800cm açıklık7adet,40%eğimde1000cm açıklık9adet,manuel/stale),loading-list ve XLSXstok/bindirme/etkin boy açıklaması kontrolleri geçti. Canlı çizim ve yerel kullanıcı JSONu korunmuştur. DEV-031 kural düzeltmesi tamam; Tuna çatı karşılaştırması ve diğer açık işler sürer.

## 4 Ekim 2026 — 5.9.48 / DEV-032 Aşık kapama U

Kullanıcı Alın V ile bire bir aynı adet onayladı. Aşık kapama U ayrı2500mm stok satırı olarak Alın V toplam sevk adedine bağlandı; tuna-37referansı, ek bindirme/yedek0. Alın V geometrisi/eğimi veya manuel toplamı değişirse U güncellenir; eski karar nedeniyle Alın V adedi belirsizse U da otomatik adet vermez. U bağımsız gerekçeli manuel düzenlenebilir. Çatı/Alın V yokken U üretilmez.

Kontroller: build,loading-top(9/9,manuel12/12,stale),loading-verge,loading-list; ayrı XLSX satırlarında7/7,2500mm,tuna-37,0yedek doğrulandı. Canlı çizim ve yerel kullanıcı JSONu değişmedi. DEV-032 tamam; Tuna çatı modeliyle9adet karşılaştırması ve önceki açık işler korunur.

| Kimlik | İş | Durum |
| --- | --- | --- |
| DEV-032 | Aşık kapama U / Alın V adet bağı | Tamam:5.9.48,tests/loading-top.cjs ve loading-verge.cjs; ayrı2500mm satır. |

## 4 Ekim 2026 — DEV-033 trapez aşık referansı

[Kaynak görsel/hash ve çıkarım](analizler/2026-10-04-trapez-asik-yerlesimi.md). Trapez sac için eğim boyunca80cm aşık aralığı gözlendi;46,21/34,25cm uç değerleri sabit kural yapılmadı. Başlangıç yönü/ilk-son aşık ve kalan mesafe düzeni kullanıcı teyidi bekler.4200/3000stok dağılımı açık. Görsel ortak referanslara kopyalandı; kod/çizim değişmedi,5.9.48korundu.

| Kimlik | İş | Durum |
| --- | --- | --- |
| DEV-033 | Omega aşık yerleşimi ve sevk | 5.9.50: dikdörtgen beşik sıra+4200/3000kesimsiz kombinasyon ve ayrı sevk satırları tamam. Genel serbest sınır/diğer çatı sıra yerleşimi ve ek noktaları açık; kontrol satırları gösterilir. analizler/2026-10-04-asik-stok-kombinasyonu.md |

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

| Kimlik | İş | Durum |
| --- | --- | --- |
| DEV-034 | Ortak montaj verisi ve otomatik renkli montaj paftaları | Açık:4200/3000parça yerleşimi/tekil bindirme,makas ve diğer üretim malzemeleri; yükleme/PDF/DXF aynı veri. Kullanıcı örnek montaj çizimleri sağlayacak. analizler/2026-10-04-tum-catilar-montaj-plani.md |


## 4 Ekim 2026 — Vida önceliği / 5.9.51
| Kimlik | İş | Durum / kanıt |
|---|---|---|
| DEV-035 | Çizim–Excel vida karşılaştırması ve standart çatı oranı | İki çatı vidası geçici uygulandı; diğer dört vida kullanım dağılımı açık. [Rapor](analizler/2026-10-04-vida-oranlari.md), tests/screw-ratio.cjs ve tests/loading-screws.cjs. |
| DEV-033 / DEV-034 | Genel çatılar, ek yerleri ve montaj paftaları | Kullanıcı önceliğiyle6Ekim2026'ya kadar ara; tamamlandı sayılmaz. Sonraki adım örneklerle sıra/bindirme montaj modeli. |

Excel291m stok aşık→1000vida;103,32m² sevk sacı alanı→1000vida. Net eğimli alana ikinci oranın uygulanması geçici yaklaşık kabul. Tek dikdörtgen beşik trapez kapsamı; ek yedek yok, referanstaki yedek bilinmiyor. Yerel Yeni proje (11).json korunup cizimler/2026-10-04-vida-karsilastirma-ornek.json olarak kopyalandı;136,92m²/216m→1326/743vida. Bu Tuna veya son canlı çizim değildir. Tuna kayıt JSON'unda çatı yok; birebir vida doğrulaması yapılamadı. Kaynak hashleri raporda. Kaynak/kayıt/örnek JSON bu teslimde gönderilir; canlı tarayıcı değişmedi.

## DEV-035 — Çoklu vida sağlaması (4 Ekim)
[Alan/boy/parça ve OSB karşılaştırması](analizler/2026-10-04-vida-coklu-saglama.md). Mevcut örnek üç yolla1326/743/848;OSBde1326/1320/1506. Tek Excel üç bağımsız doğrulama değildir. Geçici öneri:sac10/m²;aşık max(10/m²,3,5/metre,12/parça) miktarları. Örnekte1370/1370;OSBde aşık1536. Bu tur yalnız analiz;5.9.51formülleri değiştirilmedi. Kesin asgari bağlantı kuralı açık.

## 4 Ekim 2026 — Mevcut hesabı koruma ve toplu doğrulama kararı
Kullanıcı: Şimdilik mevcut durum korunsun; bu proje tamamen bittiğinde birkaç başka proje ile tüm kalemlerin doğruluğu sağlansın. 5.9.51 hesapları değişmedi; son analizdeki maksimum yöntem önerisi uygulanmadı. DEV-035 geçici durumdadır, nihai doğrulama tamamlandı sayılmaz.

| Kimlik | İş | Durum / tamamlanma koşulu |
|---|---|---|
| DEV-036 | Proje tamamlandıktan sonra farklı projelerle tüm yükleme kalemlerini doğrulama | Bekliyor. Birkaç projenin çizim ve eşleşen Excel listeleriyle panel, bağlantı, profil, çatı, kaplama, vida ve diğer kalemler satır bazında karşılaştırılacak. Adet, yedek, boy, kesim/bindirme payı ve manuel istisnalar ayrı kontrol edilecek; farkların nedeni kaydedilip gerekiyorsa kurallar revize edilecek. Yalnız vidalarla sınırlı değildir. |

## DEV-037 — Mevcut alçıpan metrajını yükleme listesine bağlama
Kullanıcı alçıpan kurallarının zaten konuşulup uygulandığını hatırlattı; tekrar kullanım yeri sorulması hatalıydı. [Kod kontrolü](analizler/2026-10-04-alcipan-mevcut-hesap.md): engine.js hesabı ve Metraj Listesi mevcut; yeni yükleme modülüne aktarım açık. Kural yeniden tanımlanmayacak. Durum: açık; tek hesap kaynağı, fire/yedek ayrımı ve mükerrer sayım kontrolüyle aktarım tamamlanmalı. Bu tur kod değişmedi.

## 4 Ekim 2026 — 5.9.52 / DEV-037 tamamlandı
Kullanıcı kriteri: duvar alçıpanı seçiliyse mevcut sistemin duvar miktarı eklenir, seçili değilse yalnız tavan; beyaz/yeşil ayrı. LoadingList mevcut alcipanHesap ve levhaAdet sonuçlarını alır; ayrı formül yok. Beyaz duvar/tavan,yeşil duvar/tavan,veranda ayrı satırlar; fire dahil,ek yedek0. Kaplama filtresi,CSV/XLSX ve Tuna52/53referansı eklendi. tests/loading-gypsum.cjs yok/hepsi/secili modları ve metraj eşitliği,loading-list regresyonu başarılı. Kaynaklar ve dist yeniden üretildi. DEV-036çoklu proje doğrulaması açık; yeni alçıpan kuralları sorulmadı.

## DEV-037 yeniden açık — Kullanıcı eksik alçıpan kuralı bildirdi
Son entegrasyonda daha önce konuşulmuş bir alçıpan ayrıntısının atlandığı bildirildi. Kod ve kayıt taraması net iç ölçü,açıklık düşümü,duvar seçimi,renk,veranda ve fireyi buldu; kullanıcının kastettiği ek kural henüz kesin belirlenemedi. Tamamlandı durumu bu düzeltme açısından geri açıldı. Tahmine göre yeni hesap uygulanmadı; kısa açıklama bekleniyor.

## 4 Ekim 2026 — 5.9.53 / DEV-037 standart ıslak hacim düzeltmesi
Kesin kullanıcı kuralı: Banyo, ebeveyn banyosu ve WC duvarları genel duvar alçıpanı seçiminden bağımsız, her koşulda yeşil alçıpan. Önceki yalnız tavan ifadesi ve tüm duvarları opsiyonel sayan kayıtlar bu kuralla düzeltilmiştir. Diğer kuru mekân duvarları yok/hepsi/seçili tercihine bağlı; tüm tavanlar ve veranda yeşil tavanı mevcut kuralla korunur.
odaDuvarAlci tek kaynağı düzeltildi; çizimde yeşil gösterim genel seçim kapalıyken de çalışır. Islak oda ayarında kapatılabilir kutu yerine standart bilgisi gösterilir. Metraj ve yükleme/Excel aynı hesabı kullanır. loading-gypsum üç modda ıslak duvarların kalmasını, kapalı modda beyaz duvarın olmamasını, renk/metraj eşitliğini ve XLSX üretimini; loading-list genel regresyonu doğruladı. DEV-037 bu düzeltmeyle tamamlandı, DEV-036 farklı projelerle genel sağlaması açık. Canlı çizim ve kullanıcı JSON'u değişmedi.
