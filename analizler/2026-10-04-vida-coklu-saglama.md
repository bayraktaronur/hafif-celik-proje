# Vida çoklu oran sağlaması — 4 Ekim 2026

Kaynaklar ve SHA-256: [ilk analiz](2026-10-04-vida-oranlari.md). Aynı Excel ve cizimler/2026-10-04-vida-karsilastirma-ornek.json kullanıldı. Canlı tarayıcı ölçülmedi. Kaynak Excel değiştirilmedi.

## Hesap
Excel: her iki çatı vidası1000adet;85aşık parçası,291m stok,103,32m² sevk sacı kapatma alanı. Oranlar9,678668adet/m²;3,436426adet/mstok;11,764706adet/parça. Bunlar üç bağımsız saha doğrulaması değildir. Tek sevk listesinin üç normalizasyonudur; farklı vidalar aynı miktarda gönderilmiş olsa da aynı bağlantılarda kullanılmaz.

| Deneme | Alan m² | Aşık m | Parça | Alan oranı | Boy oranı | Parça oranı |
|---|---:|---:|---:|---:|---:|---:|
| Tuna Excel referansı |103,32(sevk sacı)|291|85|1000|1000|1000|
| Çatılı örnek, OSB yok |136,922786(net)|216|72|1326|743|848|
| Aynı geometri, OSB var |136,922786(net)|384|128|1326|1320|1506|

Örnek OSB yok18sıra,OSB var32sıra. Aşık stokları3000mm; OSB halinde tümü128adet. Gerçek model ve purlinStock ile hesaplandı. OSB denemesi sadece bellekte; kayıt dosyasına uygulanmadı. Referansta36OSBlevhası mevcut; daha sık aşık olasılığını destekler fakat gerçek referans yerleşimini kanıtlamaz. Referans stok yoğunluğu2,816m/m²,örnekte1,578m/m²; paydalar sevk/net ayrımı nedeniyle birebir değildir.

## Öneri, henüz program kuralı değil
Pratik yukarı yuvarlanmış katsayılar:10adet/m²,3,5adet/mstok,12adet/parça.
- Trapez vidasında geçici sevk başlangıcı ceil(10×eğimli alan):örnekte1370adet.
- Aşık vidasında düşük tahmine bağlı kalmamak için geçici karşılaştırma zarfı: max(ceil(10×alan),ceil(3,5×stokmetre),ceil(12×parça)). Örnekte max(1370,756,864)=1370adet;OSBde max(1370,1344,1536)=1536adet.
- Bu maksimum yöntemi bilinçli yüksek sevk tahminidir; ihtiyaç minimumu veya mühendislik yeterliliği değildir. Katsayıların aritmetik ortalaması alınmaz; üç miktar toplanmaz. Yedek ayrıca otomatik eklenmez; fazlanın ne kadarının yedek olduğu mevcut veriyle ayrıştırılamaz.
- Parça katsayısı3000/4200stok karışımına bağlıdır; kısa parçalı düzende yüksek tahmin yapabilir. Alan katsayısı aşık bağlantısının gerçek sürücüsü değildir, yalnız geçici alt sevk eşiği önerisidir. Gelecek veriyle revize edilmeli.
- Kesin asgari sayı için makas–aşık birleşim sayısı, ek yerleri ve her birleşimde vida adedi; sacın aşık bağlantı düzeni gerekir. Henüz tanımlı değil. Tek Excel asgari sayıyı kanıtlamaz.

## Teslim / durum
Bu tur kullanıcı analiz istediği için uygulamanın5.9.51formülü değiştirilmedi:743aşık/1326sac mevcut örnek çıktısı. Yukarıdaki1370/1536öneridir, uygulanmış gibi sunulmaz. DEV-035sağlama kaydı eklendi; diğer çatı işleri ara durumunda. Kontrol Node RoofCore.calculate/purlinRuns ve LoadingCore.purlinStock üzerinden yapıldı; OSB tanımı RoofCore.LAYERS[0] ile doğrulandı.
