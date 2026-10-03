# Omega aşık stok kombinasyonu — 4 Ekim 2026 / 5.9.50

Kaynak kullanıcı açıklaması: stok4200/3000mm; sabit bindirme yok. Stok toplamı sıra boyuna eşitse bindirme0, fazlalık kesilmeden ekler arasında bindirilir. Referans plan görseli ve SHA-256: analizler/2026-10-04-asik-plan-boyu.md. Canlı çizim veya özgün Excel değiştirilmedi.

## Optimizasyon
LoadingCore.purlinStock her sıra için uygun4200/3000kombinasyonlarını tam arar. Öncelik toplam fazla/bindirmeyi en aza indirmek; eşitlikte en az parça. Bu öncelik uygulama tercihidir ve kullanıcıya açıklandı.9000→3×3000;11400→2×4200+1×3000;15000→5×3000;23400→2×4200+5×3000;21000→5×4200.20000→2×4200+4×3000=20400,400mm toplam bindirme. Toplamfazla bindirmedir,kesim/fire değildir. Sabit bindirme veya yedek eklenmez.

Tek parça fazla boyu bindirme diye kullanılamaz. Örneğin4000mm sıraya tek4200 yerine2×3000ve2000bindirme gerekir.3000mmden kısa sıraya kesimsiz stok sığmadığı için özel boy kontrol satırı oluşturulur. Bir parçanın tamamını aşacak sahte bindirme üretilmez. Eklerin hangi makas/aralıkta ve kaçmm üst üste geleceği modellenmez; yalnız sıranın toplam bindirme ihtiyacı verilir.

## Geometri ve liste
Dikdörtgen beşik çatı bölümlerinde mevcut120/342/400/800sıra kuralı kullanılır; yerel sıra doğruları modelin görünür çatı yüzeyleriyle kesiştirilip aynı sıradaki bitişik parçalar birleştirilir. Boy mevcut saçak dahil yüzey sınırından alınır;30+30ikinci kez eklenmez.10000bina boyu+iki30cmuç için10600mm sıra;2×4200+1×3000=11400,800mm bindirme. Özel saçak ayarı gerçek modelden gelir.

3000ve4200mm Omega aşık ayrı satırlar, adetler tüm sıralardan toplanır. Aynı kombinasyonlu sıralar gruplu açıklanır. Ekran detayında ve CSV/XLSXSsütununda sıra kimlikleri,boy,kombinasyon,toplam bindirme izlenir. Excel referanslarıtuna-71/72; hedef referans adetlerine zorlanmaz. Manuel toplam ve eski geometri karar denetimi korunur.

## Kapsam sınırı
Serbest sınır(outline),kırma/tek eğim ve onaysız kaplamalarda otomatik sıra yerleşimi yerine açık kontrol satırı verilir. Bunlar hesaplanmış kabul edilmez. Desteklenen bölümlerin sayıları diğer bekleyen bölümlerin ihtiyacını içermez. Üretim ek noktaları/sembol kulağı detayı ve genel sınır/birleşik çatı geliştirmesi DEV-033te açık kalır. Çatı bölümü olmayan Tuna kontrol JSONundan4200/3000sevk adedi çıkarılmaz.

## Kanıt
purlin-stock:ciddi sayıda keyfi boyda bağımsız çift döngüyle en iyi fazla/parça sonucu doğrulandı; örnekler,tam boy,tekparça,OSB,dönüş,saçak tekrar eklememe,manual/stale. loading-purlin:bağımsız Edge16sıra×10600mm→4200den32,3000den16; sıra başı800mm bindirme,ayrı XLSXsatırları. purlin-stations,loading-list,loading-verge ve verify-loading-xlsx regresyonları geçti. Görsel kontrol yapıldı. artifacts geçici test dosyaları depoya eklenmez.
