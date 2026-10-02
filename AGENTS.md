# İki bilgisayarda çalışma düzeni

Bu proje ev ve iş bilgisayarlarında geliştirilir. Ortak GitHub deposu:
https://github.com/bayraktaronur/hafif-celik-proje

Kullanıcının kalıcı çalışma düzeni: **gündüz iş bilgisayarı, gece ev bilgisayarı; aynı program ve aynı proje dönüşümlü geliştirilir.** Proje bilgisini yalnız sohbet hafızasına bırakma. Ortak dosyalar esas alınır.

- Çalışmaya başlarken Git durumunu ve uzak depo bağlantısını kontrol et. Bağlantı kurulmuşsa `git fetch origin` ile güncel durumu öğren.
- Çalışma klasörü temizse ve etkin dalın upstream bağlantısı varsa, yalnızca fast-forward güncelleme yap (`git pull --ff-only`). Kaydedilmemiş değişiklik, farklılaşmış geçmiş veya çakışma varsa çalışmayı koru ve durumu açıkla; otomatik reset, clean, force push veya değişiklik silme yapma.
- Kullanıcının istediği değişiklik tamamlanıp ilgili kontroller yapıldığında, yalnızca bu çalışmaya ait dosyaları commit edip bağlı dala gönder. Başkasına ait veya ilgisiz değişiklikleri commit'e katma. İlk bağlantı veya kimlik doğrulama eksikse tamamlandı deme.
- Her çalışma sonunda gönderimin başarılı olup olmadığını belirt. Bilgisayar değiştirmeden önce gönderimin tamamlanmış olması gerekir.
- Kullanıcının kalıcı talimatı: Prefabrikten Plan Studio'nun her yeni sürümünü kullanıcıya sunmadan önce ilgili kontrolleri tamamla, sürüme ait kaynakları ve gerekiyorsa yeniden üretilen dağıtım dosyasını commit edip GitHub'a gönder. Bunun için ayrıca "GitHub'a gönder" talimatı bekleme; gönderimi çalışma sonrasına erteleme.
- Yeni sürüm tesliminde sürüm numarasını ve GitHub gönderim durumunu birlikte bildir. Başarılı gönderimden sonra uzak daldaki commit'in teslim edilen yerel commit ile aynı olduğunu doğrula. Ağ, giriş veya çakışma nedeniyle gönderim tamamlanamazsa sürümün yalnızca yerelde bulunduğunu ve diğer bilgisayarda henüz kullanılamayacağını açıkça belirt; GitHub'da güncel olduğunu söyleme.
- Parolaları, erişim anahtarlarını, `.env` dosyalarını, bağımlılık klasörlerini ve geçici çıktıları depoya ekleme.
- Tarayıcıda saklanan çizimler Git tarafından taşınmaz. Kullanıcı çizimlerini iki bilgisayarda açmak istediğinde uygulamanın dışa aktarma/kaydetme yöntemini kontrol et ve çizim dosyaları için ayrıca kayıt düzeni belirle.
- Diğer bilgisayarda ilk kurulumu yaparken mevcut yedeği koru; depoyu ayrı bir klasöre klonla ve Codex'te o klasörü aç.
- Görünüm kuralı: H panel ekleri, üçlü/dörtlü birleşimler, çektirme U ve köşe direklerini hiçbir sunum/filtrede gizleme. Müşteri sunumundaki kapı/pencere etiketleri en/yükseklik ölçüleridir (ör. 80/205); nesne adı değildir.

## Sohbetler arasında devamlılık

- Her çalışmanın başında Git kontrolünden sonra `DEVAM.md` dosyasını oku. Bu kayıt iki bilgisayarın ortak çalışma özetidir; erişilemeyen sohbetleri hatırlıyormuş gibi davranma.
- Her anlamlı çalışma sonunda, kod değişmese bile, `DEVAM.md` içindeki son durum, alınan kararlar, açık işler, dosya/rapor yolları ve sıradaki adımı güncelle. İlgili raporlarla birlikte bağlı Git dalına gönder ve uzak commit'i doğrula. Yalnız belge değişikliklerinde uygulama sürümünü artırmak gerekmez.
- Bir analiz istendiğinde sonucunu yalnız sohbette bırakma: `analizler/` altında kaynak dosya adı, kapsam, bulgular, belirsizlikler ve yapılacaklar içeren bir rapor tut; `DEVAM.md` içinden bağlantı ver. Kaynak bulunamadıysa analizi tamamlandı diye kaydetme.
- İki bilgisayarda kullanılacak, kullanıcı tarafından bu proje için sağlanan çizimleri `referanslar/` altında; Plan Studio'nun Kaydet ile indirdiği, paylaşılacak müşteri planlarını `cizimler/` altında düzenle. Yalnız göreve ait dosyaları ekle; bilgisayardaki tüm müşteri dosyalarını topluca yükleme. Orijinalleri taşıma/silme, kopyala; büyük veya Git'e uygun olmayan dosyalar için ortak depolama konumunu kayda geçir.
- Tarayıcı otomatik yedeği, sohbete eklenmiş dosya ve Git'e gönderilmiş dosya farklıdır. Paylaşım başarısını dosyanın ortak depoda bulunduğunu doğrulayarak bildir. Erişilemeyen iş bilgisayarı kayıtları için açık bir aktarım görevi bırak.

## Her başlangıç ve teslimde zorunlu devir kontrolü

- Başlangıçta `DEVAM.md` ve `CALISMA_KAYDI.md` oku; açık işlerin kaynaklarına bak. Uzak değişiklikleri almadan ve yerel değişiklik/çizim durumunu anlamadan yeni uygulama değişikliği yapma. İki bilgisayarda farklı değişiklikler varsa koruyarak uzlaştır; eski kopyayı yenisinin üzerine yazma.
- Kullanıcının yeni isteğini, değişen kararını ve yarım kalan işini DEVAM.md açık işler tablosuna sabit bir kimlikle ekle. Tamamlanan işi kanıt/rapor/test bağlantısıyla kapat; başka bilgisayarda ne yapıldığı bilinmiyorsa açıkça doğrulanmadı de. Durum özetlenirken açık işleri düşürme.
- CALISMA_KAYDI.md dosyasına her anlamlı teslim için tarih, biliniyorsa bilgisayar, değişiklik/karar, kontroller, açık işler ve sıradaki adımı ekle. Eski kayıtları silme. DEVAM.md güncel durumu, bu dosya geçmişi tutar.
- Kod, karar/analiz kayıtları ve çizim/referans dosyalarının aktarım durumlarını ayrı doğrula. Takipsiz ve yok sayılan dosyaları gözden geçir; ilgili ekler dışarıda kaldıysa kayda geçir, ilgisiz dosyaları topluca ekleme. Kaynak dosya için yol ve SHA-256 kaydet. En güncel müşteri planı olduğu bilinmeyen bir yedeği güncel plan ilan etme.
- Yalnız oturum sonunda değil, her tamamlanan anlamlı adımda kayıtları güncelle ve gönder. Başarılı push ve uzak commit eşitliği olmadan aktarım tamamlandı deme. Bekleyen dosya veya doğrulanmamış çizim varsa kullanıcıya kalan adımı belirt.
- Kullanıcı 'kaldığımız yerden devam' dediğinde önce bu devir kontrolünü yap; kayıt yeterliyse kullanıcıdan yeniden anlatmasını isteme. 'Bilgisayar değiştiriyorum' dediğinde planın dosya olarak kaydedilmesini ve aktarımını da kontrol et.
- Bu kurallar otomatik arka plan senkronizasyonu değildir. Bilgisayar kapanınca, işlem yarıda kesilince veya internet yokken gönderim garantisi verme. İlk devamda git durumu ve açık kayıtlarla kurtarma kontrolü yap.
