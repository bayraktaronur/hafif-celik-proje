# Omega oturuşu ve devam eden kaplama açıklığı

8 Ekim 2026, 5.9.83 sonrası kullanıcı iki görsel bildirdi. Kaynaklar referanslar/2026-10-08-omega-aciklik/envanter.json içinde SHA-256 ile korundu.

Kod bulgusu: gable kaplaması wallTop seviyesinde başlıyor, omega dış yanağı wallTop-3 ile wallTop arasında. Böylece 30 mm yanak açıkta kalıyor; 1 mm sac kalınlığının yanlış çarpılması söz konusu değil. Kaplama/profil montaj oturuşu eksik. Yeni görseldeki 15 mm ifadesinin görünen şerit mi yoksa önceki 20 mm dudak ölçüsünü değiştiren talimat mı olduğu soruldu.

İkinci görselde kaplamanın alt kısmında yerel açıklık devam ediyor. Kesin sebep henüz doğrulanmadı: duvar/kaplama oturuşu veya komşu çatıya göre düşey kırpma incelenmeli. Önceki Yeni proje (10).json çatı içermiyor. Downloads içinde daha yeni Yeni proje JSON'u bulunmadı. Güncel çatılı JSON yolu soruldu. Canlı çizime müdahale edilmedi.

DEV-068 açık: gerçek plan üzerinde açıklığı yeniden üret, kaplama/omega oturuşunu ve görünür 15 mm bandı netleştir; mevcut profil imalat kesitini ve makas/çatı ölçülerini koruyarak düzelt, görsel+geometri regresyonu yap. Bu incelemede uygulama kodu/sürümü değiştirilmedi. Önceki sentetik testler kullanıcının bu birleşiminin kapandığını kanıtlamaz.

## Çözüm — 5.9.84

Kullanıcı Yeni proje (11).json dosyasını verdi; cizimler/2026-10-08-omega-aciklik altında orijinal kopya ve kaynak/hash kaydı korundu. 15 mm ifadesinin yalnız görünen şerit olduğu teyit edildi; önceki30/20mm ve1mm sac kesiti değişmedi.

Gerçek planda ana çatının x=57.75 ve1573.75 alınları yavru çatı saçak örtüsü nedeniyle250yerine259.867cm'de kırpılıyordu. Diğer çatının mesnet sınırı dışında kalan saçak taşması artık kaplamayı kesmez. Mesnet alanı içinde kalan gerçek komşu çatı kesişimlerinde yükseklik kırpması korunur.

Omega dış yüzünde8mm betopan montaj yüzeyi, üst yanağı örterek alt kotu248.5cm olacak şekilde üretildi. Çelik alt ucu247cm: dış görünür bant15mm. Tam30mm yanak,20mm dudak ve1mm sac geometrisi korunur. Ön montaj yüzeyi nominal duvar yüzünden13.1mm dışarıda, arka yüz8mm içeridedir; bu görsel örtüşme yerleşimidir, büküm/imalat tolerans paftası değildir. Çatı/duvar/aks kayıtları veya sevk metrajı değiştirilmedi.

Testler: omega-real-project gerçek planda iki alın üzerinde350/400/450cm örneklerinde255cm yükseklikte kaplama varlığını,15mm bandı, kaydedilen geometri ve RoofStudio.model sonuçlarının birebir değişmezliğini doğruladı. gable-omega12varyant, roof-gable-cover, roof-gable-boundary, roof-soffit geçti. artifacts/omega-real-left.png veomega-real-right.png incelendi. Canlı kullanıcı sekmesi değiştirilmedi. DEV-068 bu iki bildirim kapsamında tamamlandı; stok/kesim/büküm açınımı DEV-067 altında açık kalır.
