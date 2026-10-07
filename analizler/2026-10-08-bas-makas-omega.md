# Baş makas omegası — 8 Ekim 2026 / 5.9.83

Kullanıcının ölçülü kesiti referanslar/2026-10-08-bas-makas/4-omega-olculer.png; kaynak yolu ve SHA-256 envanter.json içinde. Sac kalınlığı bu tur kullanıcı tarafından 1 mm olarak doğrulandı.

Kesit: net üst açıklık 60/100/150 mm; aşağı yanaklar 30 mm; dış dönüş 12 mm ve yukarı dudak 20 mm; iç flange 25 mm; sac 1 mm. Ölçüler cm geometriye çevrilir. Bükümler keskin köşeli modellenir; büküm yarıçapı verilmedi. Üst sac duvar üst kotuna oturur, yanaklar aşağı iner; dudak dış cepheye bakar.

RoofStudio.planStructure baş makas kaplamasının açık alt kenarı ile paralel, aynı hatta bulunan duvar kesişiminde profil üretir. Komşu çatı altında kapatılan kısımlara ve duvar olmayan açıklıklara duvar üst profili eklemez. Duvar nominal kalınlığı kesiti seçer; profil 6/10/15 varyantlıdır. Mevcut çatı, duvar ve aks verisi değişmez. Panel detay görünümünde de gösterilir; çatı gizleme ile kapatılır.

Kontroller: tests/gable-omega.cjs üç kalınlık × dört dönüşte ölçüler, dış/iç yön, 1 mm sac, model değişmezliği ve duvar olmayan yerde üretmeme; roof-gable-cover, roof-gable-boundary, roof-soffit geçti. artifacts/gable-omega.png bağımsız 3B görünüşü incelendi. Canlı çizime müdahale edilmedi.

Sınır: 3B kesit eklendi; stok boyu, ek/bindirme, kesim metrajı ve büküm açınımı bu teslimin kapsamında değil. Son kullanıcı çatılı JSON'u olmadan özel canlı planın bütün birleşimlerini doğruladığımız iddia edilmez. DEV-067 3B kesit tamamlandı, imalat liste ayrıntıları açık.
