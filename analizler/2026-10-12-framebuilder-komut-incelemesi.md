# FrameBuilder-MRD komut ve iş akışı incelemesi

## Kanıt ve sürüm sınırı

12 Ekim 2026. Kurulu ürün önceki kullanıcı ekranında6.9.0. Kurulu FrameBuilder/data klasöründe DLL var; bu dosya incelenmedi/çözülmedi. Resmî200sayfalık kılavuz indirildi, metni çıkarıldı; içindekiler ve aşağıda belirtilen bölümler okundu.28/58sayfalarının görselleri render edilerek incelendi. Dosya adıv3.7.2, iç belge tarihiEylül2018/sürümü3.3. Güncel6.9.0komutlarının tamamının aynı olduğu doğrulanmadı. Canlı menülerin eksiksiz envanteri ve komutların boş test modelinde çalıştırılması açık iştir. Lisans girişinde işlem yapılmadı, açık kullanıcı çizimleri değiştirilmedi.

Yerel kılavuz üst çalışma klasöründeki kurulum-paketleri/framebuilder-belgeler/user-guide.pdf; SHA2565820FD18365213261309D53895BE49E396B434926A74B206AC5DD32C97BE688E. PDF, çıkarılmış tam metin ve ekran görselleri depoya eklenmez; aşağıdaki özgün inceleme notları ve kaynak bağlantıları paylaşılır.

## Kılavuz komut haritası — eski sürümde belgelenenler

| Alan | İşlevler | Sayfa |
|---|---|---|
| Duvar | Oluşturma, özellikler, taşıma/döndürme/uzatma |19–44|
| Açıklık | Kapı/pencere ekleme, taşıma, silme |45–57|
| Takviye | Çapraz, dikme, yatay kayıt ekleme/silme |58–65|
| Özel eleman | Özel profil ekleme/düzenleme |66–69|
| Plan | Dört duvar, plan izleme/işleme, varsayılanlar |70–81|
| Döşeme | Oluşturma, özellikler, köprüleme ve kiriş düzenleme |82–116|
| Kiriş | Oluşturma, özellikler, varsayılanlar |117–133|
| Çatı | Oluşturma, makas özellikleri, aşık/çıta |134–174|
| Serbest araç | Tek profil, özellikler, çevirme, gruplama, iki aşamalı izleme |175–199|
| Yerleşim | Dikme aralığı/referansı, ilk kayıt kotu, kayıt aralığı, ilave uç dikmesi |27–36|
| Çapraz | Dikmeden dikmeye, kayıttan dikmeye, kayıttan kayda, K düzeni |58|
| İşlemler | Takım üretme/sıfırlama, kesme istisnaları |184–188|

600mm kılavuz tavsiyesidir; statik sonuç değildir. Kaplama seçimiyle kayıtların otomatik hesaplandığı doğrulanmadı. [Kılavuz](https://www.framebuilder-mrd.com/shopping/digitalgoods/FrameBuilderUserGuidev3.7.2.pdf).

## Daha yeni duvar eğitimi ve sürüm notları

Resmî duvar eğitiminde ayrı ayarlar görülüyor: azami panel uzunluğu, duvar sınıfı, profil, kaplama, dikme aralığı; yatay kaydı şaşırtma, ilk kayıt, kayıt aralığı; açıklıkta ana/yardımcı dikmeler ve başlık düzeni. Bunlar ürünün ayar seçenekleridir; bütün projelerde zorunlu aynı ölçü uygulanacağı anlamına gelmez. [Duvar eğitimi](https://www.framebuilder-mrd.com/forum/uploads/1/user_manual-how_to_walls.pdf) arama dizininden incelendi; doğrudan erişim404döndü, tam PDF doğrulanmadı.

4.9.7notlarında açıklık üstündeki elemanların makas araçlarıyla özelleştirilmesi beta olarak belirtilmiş. Dolayısıyla sürüm ve etkin ayar önemlidir. [4.9.7](https://www.framebuilder-mrd.com/forum/version-4-9-7-release-notes_topic210.html).4.9.2notları panel paftalarında ara kayıt ölçülendirmesinin geliştirilmesini bildiriyor. [4.9.2](https://www.framebuilder-mrd.com/forum/version-4-9-2-release-notes_topic205.html).

## Çıktılar ve izleme

Güncel resmî ürün sayfası çerçeve modelleme, panel/yerleşim belgeleri, montaj çizimleri, metraj/maliyet ve CNCdosyalarını ayrı yetenekler olarak sunuyor. Makine şablonları uyarlanabilir; doğru dosya formatı her makine için ayrıca doğrulanmalıdır. [Ürün](https://www.framebuilder-mrd.com/).

Resmî serbest araç eğitimi şekli izlemeyi ve ardından profil üretmeyi iki ayrı adımda anlatıyor; dikme ve kayıt aralıkları ayrı girdiler. Bu, rastgele gruplanmış katının eksiksiz otomatik duvar dönüşümü olduğu anlamına gelmez. [Serbest araç eğitimi](https://www.framebuilder-mrd.com/forum/uploads/1/free_tool.pdf).

Resmî çatı eğitimi çatı biçimi ve makas tipini seçip sınırı tanımlayan iş akışı gösteriyor. Kılavuzdaki bu tasarım seçimi tek başına yük hesabı veya taşıyıcı yeterlilik doğrulaması değildir. [Çatı eğitimi](https://www.framebuilder-mrd.com/forum/steps-on-how-to-draw-a-roof_topic66.html).

## Bizim geliştirme kararımız

1. Kaynak duvar geometrisini okuma, kaplama destek çizgilerini hesaplama ve karkas oluşturma ayrı aşamalar olacak. Böylece yanlış yerleşimin kaynağı görülebilecek.
2. Dikme aksının referansı açık olacak. Duvar dış kenarı, ilk dikme merkezi ve profil gövdesi aynı başlangıç değildir.
3. Yatay kayıtların ilk kotu ve sonraki kotları ayrı tutulacak. Üst ilave kayıt bağımsız tanımlanabilecek. Kaplama derz desteği ile yapısal yatay kayıt aynı ihtiyaç gibi birleştirilmeyecek.
4. Çapraz düzeni seçilebilir olacak; bütün gözlerde zorunlu aynı yön uygulanmayacak. Seçim kaplamadan bağımsız taşıyıcı sistem gereksinimiyle denetlenecek.
5. Açıklıklarda ana dikme, yardımcı dikme ve başlık daha sonraki sürümde ayrı roller olacak.
6. Kesme/ezme kullanıcı kararıyla ertelendi. Yerleşim geliştirmesinin ön koşulu yapılmayacak; geometri/işlem/listeler yine ayrı tutulacak.
7. OSB/alçıpan/BoardeX ölçüleri önceki kullanıcı beyanıyla korunacak. Betopan için ürün/levha ölçüsü doğrulanmadan varsayılan uydurulmayacak. Derz, destek genişliği, vida adımı ve levha yönü üretici teknik belgeleriyle doğrulanmalı.

## Statik ve eksik doğrulamalar

Analysis menüsünün adı önceki kullanıcı ekranında görülüyor; bu incelemede hangi hesap motoru, yönetmelik, yük birleşimi veya mühendislik dışa aktarımı sunduğu kanıtlanmadı. Programın statik çözüm yaptığı söylenemez. Dikme/çapraz yerleşimini belirleyen mühendislik kuralları için makina üreticisi ve kaplama üreticisi belgeleri ayrıca incelenecek; FrameBuilder ayarları bunların yerine geçmez.

DEV-099 AÇIK: kaynak ve eski sürüm komut haritası oluşturuldu.6.9.0canlı menüler, kaplama-aks otomasyonu ve Analysis davranışı doğrulanacak. Bu rapor 'programın bütün komutları öğrenildi/test edildi' iddiası değildir.
