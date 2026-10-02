# Prefabrikten Plan Studio — ortak devam kaydı

Son güncelleme: 3 Ekim 2026, ev bilgisayarı; 5.9.30 dış duvarda makas altına gelmeyen H kulaksız–dübelli.

Bu dosya farklı bilgisayarlardaki sohbetlerin aynı proje durumundan devam etmesi içindir. Sohbet geçmişini eşitlemez. Yeni çalışmada önce Git durumunu kontrol et, sonra bu kaydı ve ilgili raporları oku.

**Çalışma düzeni: gündüz iş bilgisayarı, gece ev bilgisayarı.** Aynı program dönüşümlü geliştirilir. Teslim geçmişi: [CALISMA_KAYDI.md](CALISMA_KAYDI.md).

## Açık işler ve devir durumu

| Kimlik | İş | Durum / tamamlanma koşulu |
| --- | --- | --- |
| DEV-001 | İş bilgisayarındaki AutoCAD dosyası ve analizini alma | Tamamlandı: iki DWG, Excel ve PDF kopyaları ve önceki bulgular ortak depoda; aşağıdaki rapor/envanter. |
| DEV-002 | Güncel müşteri planını belirleme | Kullanıcı bu karşılaştırma için iş JSON'unu açıkça seçti. Sonuç ayrı tuna84-dwg-esleme-taslak.json dosyasıdır; canlı tarayıcı çizimi değiştirilmedi ve son canlı çizim olduğu iddia edilmiyor. |
| DEV-003 | İki bilgisayarda ortak devam kurallarının kullanılması | İlk karşılıklı devir tamamlandı: iş bilgisayarı kuralları aldı; ev bilgisayarı 4c2f1c4 teslimini aldı, kayıtları okudu ve beş dosyanın boyut/SHA-256 değerlerini doğruladı. Her yeni çalışmada devir kontrolü sürer. |
| DEV-004 | Aynı sohbeti cihazlar arasında kullanma | Kurulmadı. Ortak proje kayıtları bundan bağımsız çalışır; hesapta desteklenen bağlantı ayrıca değerlendirilmeli. |

Aktarım: program 5.9.30; kaynak belgeler, ölçülü karşılaştırma ve ayrı kontrol taslağı ortak kayıttadır. Son canlı müşteri planı bundan ayrıdır.

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

- Uygulama sürümü **5.9.30**. Önceki 5.9.18 commit'i: `d526e03f003083ee866bd80fa34d54d70a4470d2`. Son teslim commit'i Git geçmişinden kontrol edilir.
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
