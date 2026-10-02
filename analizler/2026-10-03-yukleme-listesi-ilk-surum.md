# 5.9.28 — Taslak yükleme listesi

Kaynak: `referanslar/tuna-84m2/SP - 202600185 - Tuna Pref. 84m².xlsx`, `K1-280-10-6` ana sayfası. Kaynak hash ve ilk analiz: [bağlantı önerisi](2026-10-03-yukleme-listesi-baglanti.md). Gömülü karşılaştırma verisi `src/loading-reference.js` içinde aynı dosyanın SHA-256 bilgisiyle tutulur. Kontrol çizimi `cizimler/2026-10-02-tuna84-dwg-esleme-taslak.json`; canlı müşteri planı olduğu iddia edilmez.

## Kullanım

1. Önce mevcut planı Kaydet ile koruyup yeni sürümü açın; üstte Yükleme listesi.
2. Çizim sütunu otomatik geometrik adettir. Sevk taslağı ayrı tutulur; doğrulanmış reçete bulunmayan satır boş ve Kural bekliyor görünür.
3. Düzenle: miktar, zorunlu gerekçe ve isteğe bağlı Tuna Excel referans satırı. Planda göster yalnız ilgili kaynak duvarları seçer ve bunlara odaklanır; tekil panel vurgusu değildir.
4. Manuel malzeme ekle: ad, ölçü, birim, miktar, gerekçe. Adet/takım/kutu tam sayı; uzunluk/alan/ağırlık kesirli olabilir. Negatif miktar reddedilir. Sıfır bilinçli manuel karardır, bilinmeyen miktar yerine kullanılmaz.
5. Tuna karşılaştırması kaynak satır bazında eşlenen taslak miktarını toplar. Eşleme yoksa fark hesaplanmaz; eski miktar varsa kontrol gerekli görünür. Excel bütün projelerin hedefi değildir.
6. Tüm taslağı indir CSV, aktif filtreye bakmadan bütün satırları indirir. Proje/sürüm/tarih, eksik kapsam ve kaynak kimliklerini içerir. Excel'de açılabilir; özgün Excel şablonuna yazmaz.
7. Kaydet ile yükleme ayarları JSON'a da alınır. Git programı taşır; tarayıcıdaki canlı planı kendiliğinden taşımaz.

## Hesap ve karar ayrımı

Panel gruplaması kalınlık, mevcut katalog kesim ölçüsü, yükseklik ve açıklık ölçüsüne dayanır. Net kesim katalogda yoksa soru işareti görünür; sabit pay uydurulmaz. Sayılanlar yerleştirilmiş parçalardır, satın alınacak stok panolar değildir. Metal sayımı mevcut H/üçlü/dörtlü/U/köşe bağlantılarından ve serbest veranda düğümlerinden gelir. Kesit, kulak/dübel ve net boy otomatik sipariş reçetesi değildir. Kapı/PVC satırları açıklık ölçüsünü gösterir; kasa/sipariş ölçüsü ayrı doğrulanmalıdır.

Manuel karar ilgili grubun kaynak nesne kimlikleri ve geometrisiyle bağlanır. Kaynak değişince miktar boşaltılarak Çizim değişti gösterilir; gerekçe korunur. Grup kaybolduysa eski karar ayrı bölümde gösterilir, sevk taslağına katılmaz. Kaldırma geri alınabilir. Manuel ek malzemeler çizimden türetilmez ve geometri değişiminde otomatik yenilenmez; gerekçeleriyle yeniden gözden geçirilmelidir.

## Doğrulama ve açık işler

Kontrol planı49 panel yuvası ve12 açıklık üretir; Excel panel grubu47 ürün içerir. Bu fark çözümlenmeden otomatik stok miktarı atanmadı.37 referans satırı alındı; alternatif tesisat paketleri ve fiyatlar dahil edilmedi. Çatı/tavan/tesisat/elektrik/sarf miktarları otomatik hesaplanmaz. İlk arayüz bir taslaktır; sevkiyat onayı, değişmez revizyon arşivi ve üretim reçetesi editörü sonraki aşamadır.

Testler: `tests/loading-list.cjs` gerçek arayüz/CSV indirme, geometrik sayım, düzenleme/eşleme, geri alma/ileri alma, JSON ve yerel kurtarma, değişmiş/kayıp kaynak, geçersiz içe aktarmada atomiklik, eski JSON uyumu. Temel31/31, PDF/DXF ve antet regresyonları geçti. Kullanıcının canlı sayfası ve JSON'u değiştirilmedi; testler ayrı tarayıcı oturumunda yapıldı.

Sıradaki iş: DEV-006 ve DEV-021 kapsamında47/49 farkını gerçek stok kesim planıyla açıklamak; sonra profil kulak/dübel/net boy ve PVC sipariş ölçülerini doğrulanmış reçetelere dönüştürmek.
