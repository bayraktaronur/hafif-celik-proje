# İki bilgisayarda çalışma düzeni

Bu proje ev ve iş bilgisayarlarında geliştirilir. Ortak GitHub deposu:
https://github.com/bayraktaronur/hafif-celik-proje

- Çalışmaya başlarken Git durumunu ve uzak depo bağlantısını kontrol et. Bağlantı kurulmuşsa `git fetch origin` ile güncel durumu öğren.
- Çalışma klasörü temizse ve etkin dalın upstream bağlantısı varsa, yalnızca fast-forward güncelleme yap (`git pull --ff-only`). Kaydedilmemiş değişiklik, farklılaşmış geçmiş veya çakışma varsa çalışmayı koru ve durumu açıkla; otomatik reset, clean, force push veya değişiklik silme yapma.
- Kullanıcının istediği değişiklik tamamlanıp ilgili kontroller yapıldığında, yalnızca bu çalışmaya ait dosyaları commit edip bağlı dala gönder. Başkasına ait veya ilgisiz değişiklikleri commit'e katma. İlk bağlantı veya kimlik doğrulama eksikse tamamlandı deme.
- Her çalışma sonunda gönderimin başarılı olup olmadığını belirt. Bilgisayar değiştirmeden önce gönderimin tamamlanmış olması gerekir.
- Parolaları, erişim anahtarlarını, `.env` dosyalarını, bağımlılık klasörlerini ve geçici çıktıları depoya ekleme.
- Tarayıcıda saklanan çizimler Git tarafından taşınmaz. Kullanıcı çizimlerini iki bilgisayarda açmak istediğinde uygulamanın dışa aktarma/kaydetme yöntemini kontrol et ve çizim dosyaları için ayrıca kayıt düzeni belirle.
- Diğer bilgisayarda ilk kurulumu yaparken mevcut yedeği koru; depoyu ayrı bir klasöre klonla ve Codex'te o klasörü aç.
