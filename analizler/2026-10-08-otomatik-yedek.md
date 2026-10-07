# DEV-063 — Otomatik yedek ve yenileme koruması / 5.9.79

İstek: belirli saniyelerde autoback, yanlışlıkla F5'e basınca uyarı ve çizimin korunması.

Eski davranış: değişiklik sonrası650ms gecikmeli tek yerel yedek vardı. Açılışta çizim otomatik açılmıyor, geri getir bannerı bekleniyordu. beforeunload yalnız dosya ve tarayıcı yedeğinden farklı duvarlı durumlarda uyarıyordu; yedek güncel olduğunda F5 uyarısızdı. Kullanıcının kaybolan son canlı çizimine erişilmedi; o çizimin kurtarıldığı iddia edilmez.

Yeni davranış:
-650ms kayıt korunur; ayrıca10s aralıkla değişiklik kontrolü, sekme gizlenirken/pagehide/beforeunload kayıt denemesi.
- Eski recovery.v1 anahtarı korunur. Sayfa açılınca doğrulanmış son proje otomatik uygulanır. Yalnız çatı/metin/mobilya içeren projeler de kapsanır. Başlangıç boş çizimi eski kaydı ezmez.
- Son10 önceki sürüm ayrı history anahtarında; değişiklikler arasında en az10s checkpoint, proje açma/yeni proje öncesi mevcut çizim checkpoint. Depolama alanı yetmezse eski sürümler azaltılır; başarısız yazmada başarı mesajı gösterilmez.
- Yedekler düğmesi tarih/ad/duvar ve çatı adediyle listeyi açar. Geri yükleme onayından önce mevcut çizim korunur. Boş yeni proje son durum olarak açılır; önceki dolu plan tarihte kalır.
- F5/Ctrl+R/Ctrl+Shift+R/Cmd+R yakalanır; önce kayıt sonra onay. Onayla yenilemede çift uyarı yok. Tarayıcı yenileme/kapatma için içerik varsa native beforeunload. Tarayıcı native uyarı metnini ve kullanıcı etkileşimi gerekliliğini kendi yönetir.
- Bozuk son kayıt varsa doğrulanmış tarihçe kullanılır. Aktif gesture sırasında geçici model yazılmaz.

Sınırlar: tarayıcı yerel depolaması; aynı tarayıcı/profil/dosya konumuna bağlıdır. Depolama temizlenmesi, kota/izin, arka plan zamanlayıcı kısıtları ve ani cihaz kapanması için mutlak garanti vermez. İndirilen JSON ve bilgisayarlar arası aktarım için Kaydet gereklidir; sürekli otomatik dosya indirme yapılmaz.

Kontroller: tests/autosave.cjs periyodik kayıt, zamanlayıcıdan bağımsız değişiklik, reload otomatik geri açma, F5 iptal, Ctrl+R onay, native uyarı, yeni proje/önceki yedek, bozuk son kayıt, yalnız çatı,10kayıt sınırı ve kota hatası geçti. tests/run.cjs yeni otomatik geri açma beklentisiyle31/31. tests/panel-close.cjs geçti. artifacts/autosave-history.png incelendi. Canlı kullanıcı çizimi ve tarayıcı deposuna müdahale edilmedi.
