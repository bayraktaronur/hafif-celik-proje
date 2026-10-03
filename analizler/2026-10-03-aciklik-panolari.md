# Kapılı / pencereli panolar — 3 Ekim 2026 iş PC

Kaynak: cizimler/2026-10-02-tuna84-dwg-esleme-taslak.json; 5.9.36 LoadingList.calculate sonucu ayrı headless tarayıcıda yeniden hesaplandı. Referans src/loading-reference.js içindeki Tuna Excel satırları11–16. Canlı çizim değiştirilmedi.

| Panel | Program | Excel |
| --- | ---: | ---: |
|119/120 pencere,100×1250×2500mm|3|3|
|160/120 pencere,100×1660×2500mm|2|2|
|60/40 vasistas,100×1250×2500mm|1|1|
|Dış kapı,100×1250×2500mm|1|1|
|İç kapı,60×1250×2500mm|4|3|
|İç kapı,60×1220×2500mm|1|2|

Önemli kullanıcı düzeltmesi: işaretlenenler kapı boşluğu ölçüsünde küçük parçalar değil; **kapı açıklığı panelin içinde bulunan tam pano**. Pano eni 1250 veya 1220 mm, yerleşim sınırı ve makas yönüne göre yapılan imalat kesimidir. Kapı sembolü ürün/pano boyunu tarif etmez. Programdaki 4×1250 + 1×1220 ve Excel'deki 3×1250 + 2×1220 farkı sayısal olarak duruyor; bunu “hazır kapılı panel sınıfı yanlış” ya da “kapı boşluğu ayrı pano” diye yorumlamayacağız. Excel'deki “1 adedi kasalar geniş” notunun hangi kapı/pano ölçüsüne karşılık geldiği ve diğer özel kesimlerin makas yönüyle ilişkisi imalat çizgisinden doğrulanmalı. Önceki80×210 /90×210 değerleri mimari açıklık sembolleridir, kasa/sipariş ölçüsü değildir.

Netleştirilecek: makas dizilim yönü ve birleşimlere göre hangi tam panonun 1220 mm kesildiği; Excel notundaki geniş kasa hangi açıklıkla eşleşiyor; panel ve kapı/PVC doğraması sevk listesinde ayrı satırlar mı? Dolu pano stok kesimiyle kapı açıklığı panelinin özel imalat kesimini birbirine karıştırmamalıyız. PDF sipariş ölçüsü dönüşümü ayrıca doğrulanmalı; sabit pay varsayılmamalı.

Bu aşamada ürün miktarı otomatiği veya müşteri geometrisi değiştirilmedi. DEV-006 devam ediyor; kullanıcı yanıtına göre kaynaklı reçete uygulanacak.


## Kullanıcı düzeltmesi — pano ile kapı açıklığı

İşaretli dört 1250 ve bir 1220 mm bölüm, kapı boşluğu kadar panel değildir. Her biri tam panelin yerleşimidir; kapı açıklığı bu panelde açılmış olarak çizilir. Özel panel kesimleri makas yönü ve aks yerleşimine bağlıdır. Önceki görsel anotasyondaki konum işaretleri hatalıydı; referans alınmamalı. 4+1 / 3+2 ürün eni farkı açık kalır; doğru özel kesim ve geniş kasa notu DWG imalat detayından eşleştirilmelidir. Kullanıcı son canlı çiziminde değişiklik yapılmadı.
