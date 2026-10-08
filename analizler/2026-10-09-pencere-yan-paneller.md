# Eşit pencere yan panelleri — 5.9.97

DEV-082. Önceki 5.9.96, pencere dışındaki eski H kesimlerini koruyarak sağda 10.125 + 62.75 cm parçalar bırakıyordu. 160 cm pencerenin bulunduğu duvar bölümünde tek standart panel boyuna sığan yan alan, başka açıklık içermiyorsa tek panel yapılır. Bölüm ortası komutu panel alanının ortasını kullanır. Standart ölçülere denk gelmeyen yanlar özel paneldir. Uzun duvarların standart bölünmesi ve diğer açıklıkların bulunduğu yanlar korunur.

Kaynak ve SHA-256: [önceki rapor](2026-10-09-pencere-h-merkez.md), aynı kontrol-2.json. Gerçek dosyada yatay/dikey ve iki makas yönü ile bölüm ortası/H üzerinde toplam 8 durum geçti. Bölüm ortasında 73.875 + 166 + 73.875 cm; ters köşe yönünde 71.375 + 166 + 71.375 cm. Test üç pano ve eşit yanları ayrıca doğrular. Düğümler, makaslar, diğer açıklıklar sabit; undo/JSON geçti. prefab 77/77 geçti. Dağıtım yeniden üretildi.

Mevcut kullanıcı çizimi otomatik değiştirilmez. Eşit yanlar için eski pencere silinip bölüm ortası düğmesiyle yeniden eklenebilir. H üzerinde merkezin özellikle seçildiği, bölüm ortası olmayan yerleşimde yanların eşit olması beklenmez. Eski 5.9.87 yedeği korunur.