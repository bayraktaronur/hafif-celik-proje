# 206 → 207 malzeme denetimi — 26 Kasım 2026

## Kullanıcının son kaydettiği dosya

Kaynak: `C:/Users/ONUR/Downloads/Balkan 92 · Görselden prefabrik plan.json` (14:39 kaydı).
Dosyada `roofs: []`: çatı bölümü bulunmuyor. Aynı dosya 206 ve 207 motorlarına ayrı ayrı yüklendi. 40 yükleme satırında boy/adet farkı yok; çatı kesim listeleri boş. Bu sonuç ekran görüntüsündeki iki çatılı modelin metrajının değişmediğini kanıtlamaz. Çatılı proje kaydı bekleniyor.

## Ayrı test projesinde doğrulanan etki

Bu tablo kullanıcının son çatısının listesi değildir. Önceki düzeltmenin testinde kullanılan aynı iki çatılı geometri, 206 ve 207 sürümlerinde karşılaştırılmıştır.

| Malzeme | Ölçü | 206 adet | 207 adet | Fark |
|---|---|---:|---:|---:|
| Alın V | 220 × 2800 mm | 11 | 14 | +3 |
| Aşık kapama U | 2500 mm | 11 | 14 | +3 |
| Yavru çatı sandviç paneli (çatı kesim listesi) | 1000 × 3284 mm | 4 | 6 | +2 |

Bu satırların parça ölçüsü değişmedi; adetleri değişti. Yükleme listesindeki diğer 43 satırın miktar ve ölçüleri aynı. Çatı kesim listesinde diğer boy/adet grupları aynı; toplam levha adedi 24 → 26.

Çatı özeti: alan 111,213637 → 113,840769 m²; mahya 11,588 → 11,988 m; saçak 23,176 → 23,976 m; alın kenarı toplamı 20,355325 → 33,490986 m; dere 0 → 0 m.

## Sonuç

207 düzeltmesi yalnız görsel değildir. Yavru çatının gerçek boyunu ve mesnet sınırını uzatmış, ana saçak altında yüzey devamını hesap geometrisine katmıştır. Üretim reçetesi aynı kalsa da aldığı kenarlar/yüzeyler değiştiği için metraj etkilenmiştir. Özellikle birleşim içindeki yeni alın kenarlarının Alın V ve ona bağlı U üretimine yansıması ayrıca incelenmelidir. Bu artışlar kullanıcının onayladığı yeni üretim gereksinimi olarak kabul edilemez. Önceki “hesap korundu” açıklaması miktar korunması anlamında yeterli değildir.

Bu denetimde uygulama veya müşteri çizimi değiştirilmedi. Gerçek iki çatılı JSON bekleniyor; kesin müşteri fark tablosu henüz tamamlanmadı.
