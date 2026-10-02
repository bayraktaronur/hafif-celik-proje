# Çizim–yükleme listesi bağlantısı önerisi — 3 Ekim 2026

Kullanıcı mevcut Excel malzeme yükleme listesi ile çizimi nasıl ilişkilendireceğimizi sordu. Bu kayıt önerilen mimaridir; henüz uygulanmış özellik veya kullanıcı tarafından onaylanmış üretim reçetesi değildir.

Kaynak: `referanslar/tuna-84m2/SP - 202600185 - Tuna Pref. 84m².xlsx`.
SHA-256: `a9b2946ca5ae6476b8334016a2a3c107e1d6d0bd0d3e4f870e2f76639beb0803`.
openpyxl ile salt okunur içerik incelemesi yapıldı; workbook değiştirilmedi.

Ana sayfa `K1-280-10-6`, 165 satır. Sayfa adı280 dese de pano satırlarında2500mm yükseklik var; ad yerine ürün satırı ve onaylı250cm proje yüksekliği esas alınmalı. B/C/D sütunları malzeme/ölçü/adet, E/F fiyat/tutar. Diğer iki sayfa alternatif tesisat listeleri; ana listeye otomatik eklenmemeli.

Ana panel grubu9–16satırlarında23+12+3+2+1+1+3+2=47ürün. Kontrol JSON'unda49geometrik panel yuvası var. Bu farkın üretim stok panosundan kesim, özel parça veya sınıflandırma farkı olup olmadığı henüz doğrulanmadı. Sayılar zorla eşitlenmemeli.

## Önerilen veri akışı

Kaydedilmiş çizim revizyonu → nesne bazlı metraj → onaylı ürün/kesim/aksesuar kuralları → yükleme listesi → Excel/PDF.

Her satır malzeme kodu, birim, ölçü, miktar, kaynak nesne kimlikleri, hesap kuralı sürümü ve durum taşır. Excel satır numarası kalıcı ürün kodu olmaz; dosyada sıra numaraları gruplar arasında tekrar ediyor. Fiyatlar ayrı fiyat listesi sürümüdür; mevcut dosyanın fiyatları güncel sayılmaz.

- Panel: kalınlık/yükseklik, dolu/pencere/kapı/özel tip ve onaylı kesim katalog eşlemesi. Yerleştirilen parça sayısı, satın alınacak/sevk edilecek stok pano ve kesim artığı ayrı tutulur; optimizasyon kuralı onaylanmadan iki özel parçanın aynı stoktan çıkacağı varsayılmaz.
- Metal: H/H3/köşe/U doğrudan model kimliklerine bağlanır. Kulaklı/kulaksız/dübelli ayrımı için üretim kuralı gerekir; yalnız toplam H adedi yeterli değildir. Veranda kiriş/direk boyları ayrıca üretim modeliyle doğrulanmalıdır.
- Kapı/PVC: açıklık adedi modelden, ürün sipariş ölçüsü katalogdan. Örnek: çizim119/120, listede PVC117,5/118,5; otomatik fark kuralı henüz genellenemez.
- Çatı/tavan: alan, makas, kaplama seçimi ve levha boylarından; bindirme, kesim planı, stok ve fire ayrıca. Çatı tamamlanmadan kesin sevkiyat miktarı çıkarılmaz.
- Tesisat/elektrik: vitrifiye veya priz adedi ürün sayımına kaynak olabilir; boru/kablo uzunluğu ve bağlantı parçaları güzergâh veya onaylı paket reçetesi gerektirir. Excel'deki paketler otomatik ölçülmüş metraj sayılmaz.
- Vida/boya/sarf: onaylı tüketim ve paket yuvarlama; bilinmeyen kalem tahmin olarak ayrılır veya inceleme bekler.

Listede Hesaplanan / Manuel ek veya düzeltme (gerekçeli) / Sevke esas miktar ayrı tutulur. Eksik kural sıfır miktar gibi gösterilmez. Taslak liste çizimden yeniden hesaplanır; onaylanan sevkiyat revizyonu sabitlenir. Çizim değişirse değişen kalemler gösterilir, önceki sevkiyat sessizce değiştirilmez. Kaynak nesneye tıklayarak plan üzerinde vurgulama önerilir.

## İlk uygulama adımı (öneri)

DEV-006 kapsamında Tuna için satır eşleme tablosu: Excel satırı / malzeme ve birimi / plandaki kaynaklar / hesaplanan adet / Excel adedi / fark / gerekçe / onay durumu. Önce panel–metal–kapı/PVC, ardından çatı/tavan, sonra tesisat ve sarf. DEV-011/012 üretim doğrulaması açık kalır. Uygulama sürümü5.9.27 değişmedi; canlı çizim okunmadı/değiştirilmedi.
