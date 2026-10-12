# 1500 × 2500 mm panel karşılaştırması

Kullanıcı soldaki paneli özel eklenti çıktısı, sağdakini makina imalatına uygun örnek olarak tanımladı. Kaynak: `referanslar/2026-10-12-1500x2500-karkas-karsilastirma.png`. SHA-256: `5D42D66A4277D7A3D0CDB189A77DE844EFFBF2ACDE497A0D67E805AF80589FFF`. Orijinal sohbet eki korunarak kopyalandı. Genel panel ölçüsü kullanıcı beyanıdır; iç ölçüler perspektif görüntüden ölçülmedi.

## Bulgular

- Solda sağ kenara yakın dikmeler yığılıyor. `PanelCore.supports` her kesilmiş son levha aralığına da orta destek ekliyor; bu hatlar ayrıca azami aks aralığına göre bölünüyor. Kullanılan kaplama/yön bilinmeden gerekli destekler kaldırılamaz.
- Soldaki iki çapraz aynı yönde. Kod yönü yalnız göz indeksine göre seçiyor; düşey sıra indeksini kullanmıyor. Sağdaki ilk gözde alt-sol ve üst-sol uçlardan gelen iki çapraz orta-sağ birleşimde buluşuyor.
- Sağda üst rayın altında ek yatay kayıt görülüyor. Bu kayıt mevcut prototipte ayrı bir özellik değil. Üstten mesafesi doğrulanmadı.
- Sağdaki delik ve birleşim ayrıntıları solda yok. Mevcut kesme/ezme yalnız işlem metadatasıdır; geometrik olarak uygulanmamıştır. Fotoğraf delik çapı, konumu veya makine takım değerlerini doğrulamaz.
- Solda parça etiketleri üst üste geliyor; okunabilirliği düzeltilmeli.

## Açık bilgiler ve sonraki adım

Sağ örneğin kesin dikme aksları, üst ilave kayıt kotu, kaplama türü ve levha yönü kullanıcıya soruldu. Kaynak SKP geometrisi henüz incelenmedi. Görselden eşit aks veya belirli bir kayıt mesafesi kabul edilmedi. Bu verilerle 1500 × 2500 kabul örneği oluşturulacak; çaprazların orta birleşimde buluşması, uç bağlantıları ve levha vida hatlarının karşılanması birlikte kontrol edilecek.

Bu teslim analiz/referans kaydıdır. Eklenti 0.3.0 ve açık SketchUp çizimleri değiştirilmedi; imalata hazır olduğu iddia edilmez. DEV-095 ve DEV-093 açık kalır.
