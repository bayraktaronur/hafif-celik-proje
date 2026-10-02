# Prefabrikten Plan Studio — ortak devam kaydı

Son güncelleme: 2 Ekim 2026, ev bilgisayarı; Drawing1.dwg–iş JSON karşılaştırması ve 5.9.19 kontrol taslağı.

Bu dosya farklı bilgisayarlardaki sohbetlerin aynı proje durumundan devam etmesi içindir. Sohbet geçmişini eşitlemez. Yeni çalışmada önce Git durumunu kontrol et, sonra bu kaydı ve ilgili raporları oku.

**Çalışma düzeni: gündüz iş bilgisayarı, gece ev bilgisayarı.** Aynı program dönüşümlü geliştirilir. Teslim geçmişi: [CALISMA_KAYDI.md](CALISMA_KAYDI.md).

## Açık işler ve devir durumu

| Kimlik | İş | Durum / tamamlanma koşulu |
| --- | --- | --- |
| DEV-001 | İş bilgisayarındaki AutoCAD dosyası ve analizini alma | Tamamlandı: iki DWG, Excel ve PDF kopyaları ve önceki bulgular ortak depoda; aşağıdaki rapor/envanter. |
| DEV-002 | Güncel müşteri planını belirleme | Kullanıcı bu karşılaştırma için iş JSON'unu açıkça seçti. Sonuç ayrı tuna84-dwg-esleme-taslak.json dosyasıdır; canlı tarayıcı çizimi değiştirilmedi ve son canlı çizim olduğu iddia edilmiyor. |
| DEV-003 | İki bilgisayarda ortak devam kurallarının kullanılması | İlk karşılıklı devir tamamlandı: iş bilgisayarı kuralları aldı; ev bilgisayarı 4c2f1c4 teslimini aldı, kayıtları okudu ve beş dosyanın boyut/SHA-256 değerlerini doğruladı. Her yeni çalışmada devir kontrolü sürer. |
| DEV-004 | Aynı sohbeti cihazlar arasında kullanma | Kurulmadı. Ortak proje kayıtları bundan bağımsız çalışır; hesapta desteklenen bağlantı ayrıca değerlendirilmeli. |

Aktarım: program 5.9.19; kaynak belgeler, ölçülü karşılaştırma ve ayrı kontrol taslağı ortak kayıttadır. Son canlı müşteri planı bundan ayrıdır.

| Kimlik | İş | Durum / tamamlanma koşulu |
| --- | --- | --- |
| DEV-005 | Giriş kapısı panosu / dolgu imalat uyumu | Ayrı kontrol taslağında 52,75 + 125,5 cm düzeltildi; 520 mm kesim eşlemesi 5.9.19'da eklendi. Mevcut kapı aynen korundu. Genel otomatik kapı/pano yerleştirme kuralı değiştirilmedi; canlı çizimlere kendiliğinden uygulanmaz. |
| DEV-006 | CAD–program–Excel–PVC karşılaştırması | Drawing1–iş JSON duvar/pano karşılaştırması ve ayrı taslak tamamlandı; rapor aşağıda. Excel/PVC satır eşleme hâlâ açık. Geometrik 49 yuva ile eski Excel raporundaki 47 ürün farkı çözülmeli. |
| DEV-007 | Yavru çatı bağlantısı ve ortak model | Açık: ikinci U bağlantısı reddi, saplanma/boşluk, snap, yön, alın ve veranda örnekleri tekrar üretilip doğrulanmalı; düğme açıklamaları sadeleşmeli. |
| DEV-008 | Kaplama katmanları ve metraj doğrulaması | Açık: üst örtü + opsiyonel OSB/bariyer/membran; seçilen katmanlar ve 100 cm yerleşim çıktıları aynı modelle doğrulanmalı. |
| DEV-009 | İçe/dışa aktarım, arayüz ve çok kat | Bekleyen ürün talepleri; öncelik imalat doğrulaması. DWG/PDF aktarımı ve çift kat tamamlandı sayılmıyor. |
| DEV-010 | Sohbet kaynaklarını ortak depoya aktarma | 4 kaynak + iş JSON'u hash karşılaştırması başarılı; rapor/envanter hazır. GitHub aktarımı b899d5c commit ile tamamlandı; uzak main ve yerel HEAD eşitliği doğrulandı. |
| DEV-011 | Kontrol taslağının imalat doğrulaması | Açık: e107 hattında 1 makas/H mesnet uyuşmazlığı; özel aks uyarıları, direk/kiriş ve görünmeyen üretim kalemleri. Kapı kesin boşluk kontrolü kullanıcının isteğiyle ertelendi. Tam üretim onayı verilmedi. |

## Doğrulanmış durum

- Uygulama sürümü **5.9.19**. Önceki 5.9.18 commit'i: `d526e03f003083ee866bd80fa34d54d70a4470d2`. Son teslim commit'i Git geçmişinden kontrol edilir.
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
