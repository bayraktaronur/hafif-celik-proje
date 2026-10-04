# Alçıpan mevcut hesap kontrolü — 4 Ekim 2026
Kapsam: Kullanıcının önceden tanımlanan alçıpan kurallarını yeniden sormama düzeltmesi. Kaynak src/engine.js:701–705,949–1000,1047–1056; src/loading-ui.js ve src/loading-core.js.

Mevcut kod: kuru mahaller beyaz; banyo/ebeveyn banyosu/WC yeşil; veranda yalnız yeşil tavan. Tavan standart, duvar alçıpanı yok/tümü/seçili oda opsiyonuna bağlı. Net iç yüz geometrisi kullanılır; duvar açıklıkları ilgili yüzlerden düşülür. Levha120×250cm=3m²; ceil(net alan×(1+fire/100)/3). Varsayılan fire%10, mevcut kullanıcı ayarı korunur. Mutfak ALCI.ISLAK kümesinde yoktur; başka öneri etiketleri bu hesabı değiştirmez.

Metraj Listesi beyaz duvar/tavan,yeşil duvar/tavan,veranda tavanını zaten üretir. Yeni yükleme modülünde alcipanHesap/levhaAdet/metrajKalemleri çağrısı bulunmadı: eksik olan kural tanımı değil, bu mevcut hesabın yeni sevk listesine bağlanmasıdır. Bu tur statik kod incelemesi; çalışma zamanı sayım testi yapılmadı, uygulama değiştirilmedi.

Sonraki adım: tek hesap kaynağını kullanarak yükleme aktarımını tamamlamak; ikinci bir alçıpan hesabı üretmemek, fireyi yedekle karıştırmamak, iki kez saymamak. Kullanıcıya daha önce belirlediği kullanım yerleri tekrar sorulmayacak. Bütün projelerde doğrulama DEV-036 kapsamında kalır.

## Güncelleme — 5.9.52
Kullanıcı seçim kriterini teyit etti; yükleme entegrasyonu tamamlandı. LoadingList.items alcipanHesap/levhaAdet çağırır; LoadingCore yalnız hazır levha sayısını aktarır. Net alan,fire ve oda kaynakları düzeltme parmak izine dahildir. Yok/hepsi/secili ve beyaz/yeşil/veranda eşitliği tests/loading-gypsum.cjs ile doğrulandı; loading-list regresyonu geçti. Geometrik tek kaynak noktası olmayan toplu alçıpan satırında Planda göster düğmesi sunulmaz. H/U/köşe çizimleri değiştirilmedi.

## 4 Ekim 2026 — 5.9.53 / DEV-037 standart ıslak hacim düzeltmesi
Kesin kullanıcı kuralı: Banyo, ebeveyn banyosu ve WC duvarları genel duvar alçıpanı seçiminden bağımsız, her koşulda yeşil alçıpan. Önceki yalnız tavan ifadesi ve tüm duvarları opsiyonel sayan kayıtlar bu kuralla düzeltilmiştir. Diğer kuru mekân duvarları yok/hepsi/seçili tercihine bağlı; tüm tavanlar ve veranda yeşil tavanı mevcut kuralla korunur.
odaDuvarAlci tek kaynağı düzeltildi; çizimde yeşil gösterim genel seçim kapalıyken de çalışır. Islak oda ayarında kapatılabilir kutu yerine standart bilgisi gösterilir. Metraj ve yükleme/Excel aynı hesabı kullanır. loading-gypsum üç modda ıslak duvarların kalmasını, kapalı modda beyaz duvarın olmamasını, renk/metraj eşitliğini ve XLSX üretimini; loading-list genel regresyonu doğruladı. DEV-037 bu düzeltmeyle tamamlandı, DEV-036 farklı projelerle genel sağlaması açık. Canlı çizim ve kullanıcı JSON'u değişmedi.
