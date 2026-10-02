# Prefabrikten Plan Studio — ortak devam kaydı

Son güncelleme: 2 Ekim 2026, iş bilgisayarı; kaynak aktarımı ve analiz devri.

Bu dosya farklı bilgisayarlardaki sohbetlerin aynı proje durumundan devam etmesi içindir. Sohbet geçmişini eşitlemez. Yeni çalışmada önce Git durumunu kontrol et, sonra bu kaydı ve ilgili raporları oku.

**Çalışma düzeni: gündüz iş bilgisayarı, gece ev bilgisayarı.** Aynı program dönüşümlü geliştirilir. Teslim geçmişi: [CALISMA_KAYDI.md](CALISMA_KAYDI.md).

## Açık işler ve devir durumu

| Kimlik | İş | Durum / tamamlanma koşulu |
| --- | --- | --- |
| DEV-001 | İş bilgisayarındaki AutoCAD dosyası ve analizini alma | Tamamlandı: iki DWG, Excel ve PDF kopyaları ve önceki bulgular ortak depoda; aşağıdaki rapor/envanter. |
| DEV-002 | Güncel müşteri planını belirleme | Tarihli JSON yedeği alındı; tarayıcıdaki en son çizimle aynı olduğu doğrulanmadı. Kullanıcının son Kaydet çıktısı belirlenmeli. |
| DEV-003 | İki bilgisayarda ortak devam kurallarının kullanılması | İş bilgisayarı 5c9a9d0 güncellemesini aldı; üç kayıt okundu, ilk devir kaydedildi. Yeni teslimin evde alınması sonraki oturumda doğrulanmalı. |
| DEV-004 | Aynı sohbeti cihazlar arasında kullanma | Kurulmadı. Ortak proje kayıtları bundan bağımsız çalışır; hesapta desteklenen bağlantı ayrıca değerlendirilmeli. |

Aktarım: program 5.9.18; kaynak belgeler ve analiz kaydı ortak depoya alındı. Son canlı müşteri planının doğrulanması DEV-002 kapsamında açık.

| Kimlik | İş | Durum / tamamlanma koşulu |
| --- | --- | --- |
| DEV-005 | Giriş kapısı panosu / dolgu imalat uyumu | Açık: 57,75 + 120,5 yerine DWG'deki 52,75 + 125,5 cm yerleşim; kesim 520 / 1250 mm. Kod düzeltmesi uygulanmadı. |
| DEV-006 | CAD–program–Excel–PVC karşılaştırması | Açık: satır bazında fark ve kaynak tablosu; görünmeyen montaj/yükleme kalemlerinin kuralları. |
| DEV-007 | Yavru çatı bağlantısı ve ortak model | Açık: ikinci U bağlantısı reddi, saplanma/boşluk, snap, yön, alın ve veranda örnekleri tekrar üretilip doğrulanmalı; düğme açıklamaları sadeleşmeli. |
| DEV-008 | Kaplama katmanları ve metraj doğrulaması | Açık: üst örtü + opsiyonel OSB/bariyer/membran; seçilen katmanlar ve 100 cm yerleşim çıktıları aynı modelle doğrulanmalı. |
| DEV-009 | İçe/dışa aktarım, arayüz ve çok kat | Bekleyen ürün talepleri; öncelik imalat doğrulaması. DWG/PDF aktarımı ve çift kat tamamlandı sayılmıyor. |
| DEV-010 | Sohbet kaynaklarını ortak depoya aktarma | 4 kaynak + iş JSON'u hash karşılaştırması başarılı; rapor/envanter hazır. GitHub gönderimi bu teslimde uzak commit eşitliğiyle doğrulanacak. |

## Doğrulanmış durum

- Uygulama sürümü **5.9.18**. Uygulama commit'i: `d526e03f003083ee866bd80fa34d54d70a4470d2`.
- GitHub: https://github.com/bayraktaronur/hafif-celik-proje — dal `main`.
- 5.9.16: Tefrişlerde kenar/merkez hizalama, geçici kılavuzlar, Alt + sürükle kopyalama, Shift ile eksen kilidi ve Kopyala düğmesi.
- 5.9.17: Çatı panel kesim sınırlarını 3B görünümde gösterme.
- 5.9.18: Makas/çatı üretim yönü değişirken mevcut duvarlar, köşe payları, panel dizilimleri ve açıklıklar korunur; H mesnet uyumsuzluğu uyarılır.
- Bu son iki sürüm GitHub'dan ev bilgisayarına alındı. Kaynak ile uzak dalın commit eşitliği doğrulandı.

## Kaynaklar ve ilk sıradaki iş

[Önceki analizler, kararlar ve bekleyen işler](analizler/2026-10-02-tuna84-devir-raporu.md).
[Özgün yollar ve SHA-256 envanteri](analizler/2026-10-02-kaynak-envanteri.json).
Kaynaklar: `referanslar/tuna-84m2/`; iş çizimi: `cizimler/2026-10-02-is-kayit-5.json`.

Kullanıcı Drawing1.dwg dosyasını imalat referansı belirledi. Giriş panosu uyuşmazlığı teşhis edildi, henüz düzeltilmedi (DEV-005). Yeni uygulama düzenlemesine başlamadan raporu oku; son canlı planı belirle. Önceki raporlar bu sohbetteki bulguların devridir; tam karşılaştırmanın tamamlandığı anlamına gelmez.

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
