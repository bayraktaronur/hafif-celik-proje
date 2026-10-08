# Görselden Plan Oluştur — internetsiz ilk sürüm / 5.9.93

8 Ekim 2026, iş bilgisayarı. DEV-078. Ayrı codex/arayuz-duzeni deneme dalı; ana 5.9.87 korunur.

## Kullanıcı kararı
İnternet/API/üyelik zorunlu olmayacak. İnternetsiz işlem varsayılan; çevrimiçi yapay zekâ ileride isteğe bağlı olabilir. Önceki servis hesabı bekleme kararı bu kararla geçersizdir.

## Uygulanan
Görsel yükleme/yapıştırma ve zorunlu birim, boyut, yükseklik, kalınlık, üretim yolu, çatı yönü girişlerinin ardından dış yüz sınırı kutuyla seçilir. Yerel piksel taraması yatay/dikey koyu çizgileri aday yapar. Adaylar silinebilir, iki tıklamayla eklenebilir; uç koordinatları cm olarak düzenlenir. Görsel dışarı gönderilmez; ek bağımlılık veya model indirmesi yoktur.

Dikdörtgen dış duvarlar ve düzeltilen iç eksenler gerçek düğüm/segment grafiğine çevrilir. Kesişimler ortak düğümde bölünür. Prefabrik yakın standart seçeneği 62.75 cm ızgara yaklaşımı uygular, değişiklikleri listeler. Birebir seçenek dış ölçüyü korur ve özel durum panel modunu kullanır. Hafif çelikte modül yuvarlaması uygulanmaz. Bu geometrik taslak mevcut panel/mesnet kontrollerinden ayrıca geçirilmelidir; yakın standart seçimi her birleşimin imalata hazır olduğunu garanti etmez.

Önizleme onayından önce mevcut model değişmez. Normal proje JSON indirilebilir veya çizime aktarılabilir. Mevcut modelde duvar/açıklık/oda/çatı/not/donatı/tezgâh varsa değiştirme onayı ve önceki proje JSON indirme işlemi başlatılır. İndirmenin diske tamamlanması tarayıcıya bağlıdır; Geri Al ayrıca eski modeli geri getirir. Canlı kullanıcı sekmesi değiştirilmedi.

## Kapsam sınırları / açık işler
- Tam otomatik plan yorumlama değil; kullanıcı denetimli duvar taslağıdır.
- İlk sürüm dikdörtgen dış sınır, yatay/dikey iç duvarlarla sınırlı.
- El yazıları, oda adları, ölçü yazıları ve kapı/pencere sembolleri okunmaz. İç ölçülerden kısıt çözümü yok; iç eksenler cm koordinatlarıyla düzeltilir.
- Örnekte mobilya ve çift duvar çizgileri de aday olur; silinip birleştirilmesi gerekir. Kapı boşluğu yüzünden kopan duvarlar elle tamamlanır.
- Çatı yönü/eğimi ayarlanır; çatı geometrisi bu araçta oluşturulmaz.
- Çevrimiçi yapay zekâ yolu henüz yok. Güvenilir otomatik sembol/ölçü okuma ve çokgen dış sınır DEV-078 kapsamında açık.

## Kanıt
Kaynak: referanslar/gorselden-plan/musteri-el-cizimi.png; kaynak/hash kaydı kaynak.json.
- tests/image-plan-offline.cjs: boş/sentetik raster, gerçek görsel adayları, grafikte kesişimler, eğik çizgi reddi, üç mod, internet kapalı tarayıcı, JSON, model aktarımı, yedek indirme ve undo geçti.
- tests/image-plan-brief.cjs: birimler, zorunlu alanlar, hazırlık JSON, eski çizimin korunması geçti.
- artifacts/image-plan-offline.png yerel görsel inceleme yapıldı (geçici test çıktısı).
- Standalone yeniden üretildi. Kaynaklar, test ve rapor deneme dalına teslim edilir; önceki açık işler korunur.
