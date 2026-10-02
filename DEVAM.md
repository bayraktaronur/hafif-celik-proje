# Prefabrikten Plan Studio — ortak devam kaydı

Son güncelleme: 2 Ekim 2026, ev bilgisayarı.

Bu dosya farklı bilgisayarlardaki sohbetlerin aynı proje durumundan devam etmesi içindir. Sohbet geçmişini eşitlemez. Yeni çalışmada önce Git durumunu kontrol et, sonra bu kaydı ve ilgili raporları oku.

## Doğrulanmış durum

- Uygulama sürümü **5.9.18**. Uygulama commit'i: `d526e03f003083ee866bd80fa34d54d70a4470d2`.
- GitHub: https://github.com/bayraktaronur/hafif-celik-proje — dal `main`.
- 5.9.16: Tefrişlerde kenar/merkez hizalama, geçici kılavuzlar, Alt + sürükle kopyalama, Shift ile eksen kilidi ve Kopyala düğmesi.
- 5.9.17: Çatı panel kesim sınırlarını 3B görünümde gösterme.
- 5.9.18: Makas/çatı üretim yönü değişirken mevcut duvarlar, köşe payları, panel dizilimleri ve açıklıklar korunur; H mesnet uyumsuzluğu uyarılır.
- Bu son iki sürüm GitHub'dan ev bilgisayarına alındı. Kaynak ile uzak dalın commit eşitliği doğrulandı.

## İlk sıradaki açık iş: AutoCAD çizim analizi

Kullanıcı iş bilgisayarındaki sohbete bir AutoCAD çizimi yüklediğini ve analiz istediğini bildirdi. **Bu çizim ve analiz sonucu burada bulunamadı. Analizin yapılıp yapılmadığı doğrulanmadı.**

- Kaynak dosya adı/yolu: henüz bilinmiyor.
- Analiz kapsamı ve önceki sonuçlar: iş bilgisayarındaki sohbetten alınmalı; tahmin edilmemeli.
- İş bilgisayarındaki sonraki çalışma: ilgili sohbeti ve eki bul; kaynak çizimi koruyarak proje `referanslar/` klasörüne kopyala. Önceki analiz varsa `analizler/` altında raporlaştır; yoksa yapılacak analiz kapsamını kaydet. Bu kaydı dosya bağlantıları ve bulgularla güncelle, ilgili dosyaları GitHub'a gönder.
- Ev bilgisayarındaki sonraki çalışma: gönderilmiş kayıtları al; kaynak ve rapor üzerinden devam et. Yalnız program sürümünün güncel olmasını analizin de aktarılmış olması olarak yorumlama.

## Projenin amacı ve kalıcı kararlar

- Prefabrik ve hafif çelik evlerde müşteri sunumuna uygun kat planını üretime uygun veriyle birlikte geliştirmek; ardından 3B sunum, imalat dosyaları ve montaj şemaları.
- İleride 2–3 katlı yapıları destekleyecek sistem; mevcut müşteri örneği tek katlı prefabrik.
- Görünüm filtreleri veriyi değiştirmez. H ekleri, köşe direkleri ve U bağlantıları her görünümde korunur. Kapı/pencere etiketleri en/yükseklik ölçüleridir.
- Otomatik tefriş kapı açıklığını, açılımını ve geçişini kapatamaz. Yatak ve komodin pencere önüne yerleşebilir. Yatak odalarında gardırop ve komodin alternatifleri birlikte değerlendirilir. Banyo/WC otomatik tefrişi şimdilik kapsam dışı.
- Her uygulama sürümü test edilip GitHub'a gönderilir. Ayrıntılı sürüm geçmişi: [README.md](README.md).

## Çizimleri taşıma ve dosya düzeni

- **Kaydet / Ctrl+S** mevcut planı `.json` olarak indirir (`src/studio.js`, `planKaydet`). “Tarayıcıda yedeklendi” mesajı GitHub'a gönderim değildir.
- Ev klasöründe `Yeni proje (11).json` var. Kullanıcının dosyası olarak korundu; Git'e eklenmedi ve en son çizim olduğu doğrulanmadı.
- `cizimler/`: iki bilgisayarda kullanılacağı belirlenen Plan Studio JSON kayıtları.
- `referanslar/`: ilgili kaynak DWG/DXF/PDF ve diğer çizim referanslarının kopyaları.
- `analizler/`: kaynakları belirtilmiş analiz raporları, kararlar ve belirsizlikler.
- Bu klasörlere şu anda AutoCAD çizimi veya analiz sonucu aktarılmadı. Kaynak erişilebilir olduğunda ilgili klasörü oluştur ve bu dosyaya bağlantı ekle.

## Bilgisayar değiştirirken

1. Planı Kaydet ile JSON olarak dışa aktar; kullanılacak dosyayı açıkça belirle.
2. Asistan mevcut çalışmanın kararlarını ve açık işlerini bu dosyaya, analiz sonuçlarını rapora kaydeder; ilgili dosyaları GitHub'a gönderip doğrular.
3. Diğer bilgisayarda proje klasöründeki sohbete: “GitHub'dan güvenli şekilde güncelle, AGENTS.md ve DEVAM.md dosyalarını oku, kaldığımız yerden devam et.” yazılır.

Bu düzen sohbetleri birleştirmez; proje bilgisinin sohbetten bağımsız taşınmasını sağlar. İki bilgisayar arasında aynı sohbeti kullanmak için ürünün desteklediği senkronizasyon/uzak bağlantı ayrıca kurulmalıdır; henüz kurulmadı.
