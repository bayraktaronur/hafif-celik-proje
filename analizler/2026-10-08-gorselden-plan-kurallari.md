# DEV-078 — Görselden düzenlenebilir plan: onaylanan kurallar

8 Ekim2026. Kullanıcı aşağıdaki akışı ve üretim ayrımını onayladı. Durum: gereksinimler onaylı; otomatik görsel tanıma ve plan üretimi henüz uygulanmadı. Mevcut5.9.91yalnız referans görsel görüntüleme sağlar.

## Zorunlu başlangıç bilgileri

- Yapı sistemi: prefabrik veya hafif çelik.
- Kaynak ölçü birimi: m/cm/mm. Kullanıcı açıkça seçer; rakam büyüklüğünden otomatik karar verilmez.
- Bina yüksekliği, dış ve iç duvar kalınlığı ayrı girdiler.
- Çatı yönü kritik zorunlu girdi; planda okla doğrulanmalı. Mahya ve makas yönleri karıştırılmamalı. Çatı tipi/eğim bilgileri de tamamlanır.
- Dış ölçü dış duvar ölçüsünü, ara ölçü ilgili iç duvar uzunluğunu ifade eder. Her ölçü duvarıyla eşlenir. Net/aks/dış yüz referansı belirsizse ayrıca sorulur; bilinmeyen pay çıkarılmaz.
- Belirsiz kapı/pencere ölçüsü veya yönü uydurulmaz, kullanıcı tamamlar.

## Üç üretim yolu

1. Prefabrik / standartlara en yakın: plan mevcut ölçü, aks ve tam/yarım panel standartlarına uyarlanır. İstenen ve önerilen ölçüler farklarıyla gösterilir.
2. Prefabrik / referans ölçülerini koru: verilen ölçüler korunur, bitiş panelleri özel kesilir. Yerleşim ile net kesim ayrıdır. Makas aksları göz ardı edilmez; çözülemeyen ölçü/mesnet ilişkisi açıkça gösterilir.
3. Hafif çelik: prefabrik panel modülüne zorlama yapılmaz; referans duvar ve açıklık geometrisi ilgili yükseklik/kalınlıklarla üretilir. Bu geometrik üretim, statik boyutlandırma veya tam profil imalatı onayı değildir.

## İşlem akışı ve kabul ölçütleri

Görsel yükle/yapıştır → başlangıç soruları → görselden duvar/oda/açıklık/ölçü adayları → kullanıcı ölçü doğrulaması → seçilen üretim yoluyla önizleme → değişen ölçüler/özel panolar/belirsizlikler → onayla ve düzenlenebilir plana dönüştür.

Üretilenler normal program nesneleri olmalı; mevcut JSON, geri alma, metraj ve çatı iş akışlarıyla uyumlu çalışmalı. Canlı çizim sessizce değiştirilemez. Eski5.9.87 korunur; geliştirme ayrı deneme dalında devam eder.

## İlk örnek ve açık teknik işler

Kaynak: referanslar/gorselden-plan/musteri-el-cizimi.png; özgün yol/hash kaynak.json içinde. Görselde8,4+4,3+2+3 yazıları bulunuyor. Bunlardan birim veya net/dış ölçü kararı otomatik verilmez. Örnekten gizli sabit plan üretip genel görsel tanıma gibi sunulamaz.

Sonraki uygulama adımı: giriş sihirbazı, ölçülerin duvarlarla eşlendiği ara veri modeli ve düzenlenebilir önizleme. Görsel tanıma yöntemi/servisi ve gerekli çalışma ortamı ayrıca teknik olarak seçilecek; görüntüleme özelliği tanıma motoru değildir. Birim dönüşümü, üç üretim yolu, ölçü çelişkileri ve mevcut çizimin korunması için örnekli testler gerekli.
