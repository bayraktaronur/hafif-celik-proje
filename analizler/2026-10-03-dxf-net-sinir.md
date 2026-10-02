# DXF net tarama / veranda dış çizgisi — DEV-020

Kullanıcının iki ekran görüntüsü, 5.9.26 HATCH sınırının duvar aksına kadar uzanmasını ve veranda kesik çizgisinin direk merkezinden geçmesini gösterdi. Native HATCH olması bu geometrik hatayı çözmüyordu.

5.9.27, oda poligonundan bütün duvar şeritlerini ve köşe/veranda direklerinin dış konturunu çıkarır. Sonuç kapalı döngüler halinde aynı HATCH'e yazılır. Duvar kalınlığı her segmentten alınır. Kapı/pencere eşiğinde de tarama oda tarafındaki duvar yüzünde durur. Direğe değen çıkarma işlemi geçersiz iç halka yerine sınırda çentik üretir. Etiket boşluğu korunur.

Kapalı veranda kenarları, mevcut DXF direği10×10cm olduğundan aksın5cm dışına ötelenir. Köşeler ötelenmiş kenarların kesişimiyle birleşir. Duvar/veranda aynı doğrultudaysa farklı ötelenen iki ucu çapraz bağlamak yerine basamaklı geçiş uygulanır. Açık veranda yolu kapalı alan tanımlamadığı için dış taraf tahmin edilmez, aks olarak kalır. Başka direk boyutu için gelecekte aynı ortak boyut kaynağı değiştirilmelidir.

Bu işlem yalnız DXF sınırını değiştirir; kayıtlı akslar, örnekteki507/69,5 ölçüleri, oda alanı, panel dizilimi ve imalat hesabı değişmez. PDF/PNG çalışma görünümü bu düzeltmenin kapsamı değildir. Canlı müşteri çizimi ve `Yeni proje (11).json` korunmuştur.

## Doğrulama

- `tests/cad-boundaries.cjs`: Tuna kontrol taslağının banyo/verandasında75708nokta; duvar/direk içinde dolu tarama0, gerekli net döşemede eksik tarama0; üç veranda kenarı5cm dışarıda; ters nokta sırasında alan aynı; model değişmiyor.
- `tests/cad-export.cjs`, `tests/plan-export.cjs` başarılı;49panel bloğu, native ölçü/tarama ve filtre davranışı korunur.
- `tools/verify-export-autocad.ps1`: Tuna193, tefriş213, sade139, panel191model nesnesi; dört örnekte AUDIT0, mm/cm ve ölçü düzenleme kontrolleri başarılı.
- Son sade DXF, AutoCAD -PLOT ile PDF'e çevrilip görsel incelendi: tarama duvar yüzünde kesiliyor, veranda dış sınırı direğin dış yüzüne teğet, direkler taranmıyor. Geçici kanıt `artifacts/export/boundary-527.pdf/png`.

Üretim doğrulaması DEV-006/011/012 açık kalır. Kontrol taslağı `cizimler/2026-10-02-tuna84-dwg-esleme-taslak.json`; kullanıcının canlı çiziminin en son hali olduğu iddia edilmez.
