# Tuna 84 — DXF blok düzeni, 2 Ekim 2026

Kaynaklar (orijinaller değiştirilmedi; Core Console yalnız geçici kopyaları okudu):

- `referanslar/tuna-84m2/Drawing1.dwg`: SHA-256 `a671a74c3c72b67c94ea157fb4e2d65a28b51f151615c8887241f0ab7e530a55`.
- `referanslar/tuna-84m2/SP - 202600185 - Tuna Pref. 84m².dwg`: SHA-256 `7f0ac72fce090585d14e87fc77c44787c43f76e5b3eee6896a1f3c33b38465e2`.

## Bulgular

Drawing1 model alanında 34 INSERT, 85 LWPOLYLINE, 649 LINE vardır. `1250` üç, `1660` iki, `1250 v` bir kez kullanılır. Bu tanımlar sırasıyla 8 LWPOLYLINE + 2 LINE, 9 LWPOLYLINE + 3 LINE ve 7 LWPOLYLINE + 1 LINE içerir. Pencere/pano uç parçaları sade çizgi geometrisidir. Tüm düz paneller kaynakta blok değildir; kapalı polylineler de bulunur.

Tam SP dosyasının model alanında 143 INSERT; `1250` dokuz, `1660` altı, `1250 v` üç adet; ayrıca 80 omega bulunur. Birden fazla plan/görünüş olduğu için bu sayılar tek evin üretim adedi değildir. Tam dosyanın çok sayıdaki diğer blok tanımının ayrıntılı taraması tamamlanmadan durduruldu; bu rapor o tanımların tamamını doğruladığını iddia etmez. Drawing1'in ilgili üç pencere tanımı incelendi.

Kaynak tanımların büyük mutlak koordinatları aynen kopyalanmadı. Programın kendi model koordinatları kullanılır. DXF birimi mm; cm model koordinatları 10 ile çarpılır.

## 5.9.25 uygulaması

- Her panel yuvası ayrı BLOCK/INSERT. Tuna kontrol JSON'unda 49 yuva ve 49 panel INSERT eşleşir; bu geometrik sayıdır, onaylı üretim ürün sayısı değildir.
- Tam/yarım/özel panel gövdeleri sade kapalı konturlar. Açıklık içinden duvar geçmez; yan parçalar ve kapı/pencere sembolü ilgili panel bloğuna dahil edilir.
- H/U/köşe ve diğer bağlantılar korunur ve bağımsız bloklanır. Uyarı işaretleri gizlenmez.
- Tefrişler, tezgâhlar (buzdolabı kesintisi korunarak), serbest metinler ve veranda parçaları ayrı bloklardır. Ölçü/oda/makas çizimleri de düzenlenebilir çizgi ve yazı bileşenleri içerir.
- Bu bloklar dinamik/parametrik AutoCAD ürün blokları değildir. Ölçüler ilişkisel DIMENSION nesnesi değildir. Kesim kataloğu veya imalat hesabı değiştirilmedi.
- Prefabrik modundaki iki yükseklik kontrolü tek `Panel / duvar yüksekliği (cm)` alanına indirildi.

## Kanıt ve sınırlar

`tests/plan-export.cjs`: panel sayısı, blok adlarının benzersizliği, açıklık etiketleri, modelin değişmemesi, zoom bağımsızlığı, mm birimi, PDF/DXF indirme ve Unicode.

`tools/verify-export-autocad.ps1`: son Tuna ve tefrişli örnek DXF'ler AutoCAD 2021 Core Console'da açıldı; INSUNITS=4, AUDIT her ikisinde **0 hata**. Sırasıyla 783 ve 364 model nesnesi. DXF blok geometrisi ayrıca bağımsız tuval önizlemesinde kontrol edildi.

PDF/PNG anteti korunur. Bu çalışma DEV-006, DEV-011 ve genel üretim doğrulamasını kapatmaz. Canlı müşteri planı değişmedi; kontrol taslağı imalat onayı değildir.
