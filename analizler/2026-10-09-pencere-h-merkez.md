# 160 cm pencere: duvar ortası ve H üzerinde yerleşim — 5.9.96

9 Ekim 2026, iş bilgisayarı. DEV-081.

Kullanıcı 2,5 panellik bölümde 160/120 pencereyi makas yönünden bağımsız yerleştirmek istedi. Önceki uygulama tıklanan konumu mevcut panelin merkezine kaydırıyordu. Artık 160 cm pencerenin merkezi tıklanan konumdur; H üzerine tıklama da desteklenir. Pencere için 166 cm pano oluşturulur, bu pano içindeki eski panel ekleri kaldırılır, dışındaki kesimler korunur. Makas aksları ve duvar boyları değişmez. Modalda yalnız prefabrik 160 cm pencerede “Bu duvar bölümüne ortala” düğmesi görünür; köşe/T birleşimi payları arasına ortalar.

Kaynak: C:/Users/ONUR/Downloads/84m2 gülsüm hanım kontrol (2).json
Depo kopyası: cizimler/gulsum-84m2/kontrol-2.json
SHA-256: 5B418E2C082FDD5BC8AA20944C5821B0CF1333C8FB719675CDD0F96C2BE14399
Kaynak kayıt revizyonu 5.9.95; kullanıcının sağladığı dosyadır. Canlı tarayıcıdaki daha sonraki düzenlemeleri içerdiği iddia edilmez. Orijinal ve canlı çizim değiştirilmedi.

Kontroller: tests/window-center-section.cjs gerçek dosyada iki duvar doğrultusu × iki makas yönü × bölüm ortası/H tıklama = 8 durum geçti. Merkez doğruluğu, 166 cm pano, diğer açıklıklar, düğümler ve makasların korunması, geri alma ve JSON yeniden yükleme doğrulandı. tests/prefab.cjs 77/77; tests/window-stl.cjs geçti. Standalone dağıtım yeniden üretildi.

Kapsam: bu teslim 160 cm pencere yerleşimidir. Genel panel bölme/yer değiştirme kısıtları kaldırılmadı. Mevcut köşe, başka açıklıkla çakışma ve 10 cm altı artık kontrolleri korunur. Makas mesnet kontrolü ayrı uyarı olarak devam eder; taşıyıcı detay hesabı bu değişiklikte yapılmadı. Yanlarda mevcut H kesimlerini koruduğundan her durumda tek simetrik yan panel üretmez.

Ana dal 5.9.87 kaynakları üzerine dar düzeltmedir. Yeni numara 5.9.96, deneme dalındaki 5.9.88–95 ile karışmaması için seçildi. Deneme arayüzü/yerel okuyucu birleştirilmedi; 5.9.87 yedeği korunur.