# Tuna 84 prefabrik malzeme sayımı — 17 Kasım 2026

Taslak 194 örnek planı 280 cm ile açılır. Atölye Excel’indeki panolar 2500 mm yüksekliğindedir. Atölye karşılaştırması için 250 cm yüksekliğindeki kayıt ayrı tarayıcı oturumuna alındı. Her iki yükseklikte uygulamanın Excel indir düğmesiyle alınan dosyalar yeniden okundu. Her dosyada grup, ürün, ölçü, birim, çizim adedi, sevk miktarı ve durum sütunları 39 satırın tamamında programın hesap kayıtlarıyla eşleşti.

## Çizim ve malzeme

Tuna DWG eşleme kaydı 49 yuva, 6 kapı ve 6 pencere bildiriyor. Güncel örnekte 24 dış ve 13 iç dolu parça, 6 kapılı ve 6 pencereli panel aynı 49 toplamını veriyor. Pencereler 3 × 119/120, 2 × 160/120, 1 × 60/40 cm. Kapılar 1 × 90/210 ve 5 × 80/210 cm. Açıklık ölçüsü ve panel kesim eni ayrı kontrol edilir.

| 250 cm örneğinde ürün | Program | Atölye | Değerlendirme |
|---|---:|---:|---|
| Dış dolu stok pano | 22 | 23 | Program 24 parçayı 22 stok panoya yerleştiriyor. Kesim dağılımı, testere payı ve varsa yedek kararı kontrol edilmeli. |
| İç dolu stok pano | 12 | 12 | 13 çizim parçasından 12 stok pano. |
| İç kapılı pano · 1250 / 1220 mm | 4 / 1 | 3 / 2 | Toplam beş kapı eşit. Bir panelin en sınıfı farklı. Atölye iki dar panodan biri için geniş kasa notu içeriyor. |
| H ve üçlü H | 36 | 36 | Altı sınıfta sırasıyla 10, 10, 9, 2, 1, 4 adet. |
| Köşe direği | 8 | 8 | Adet ve 98 × 98 × 2500 mm ölçüsü eşit. |
| Çektirme U | 4 | 4 | Üç montaj, bir yedek. |
| Alt çerçeve 100 / 60 mm | 16 / 10 | 15 / 10 | Program dış grupta 15 + 1 yedek hesaplıyor. |
| Saçak omegası / saçak sacı | 7 / 7 | 8 / 8 | Her iki satırda birer adet fark. |
| Baş makas Z sacı | 8 | 9 | Program değeri omega grubuna bağlı. |

11 satırda sevk miktarı boş ve durum “Kural bekliyor”. Altı satır kapılı/pencereli panel, beş satır kapı/PVC ürünleridir. Yeşil duvar alçıpan vidası geçici oranla 500 adettir. Referansın tüm sarf, çatı ve diğer ürünleri onaylanmış değildir. Bu çalışma montaj veya statik tasarım onayı vermez.

## Her yeni plan için uygulanacak kontrol

Aynı revizyonlu çizim, kayıt JSON’u ve atölye listesiyle başlanır. Duvar yüksekliği, duvar kalınlığı ve makas yönü not edilir. Duvarlar sırayla izlenir. Dolu, kapılı ve pencereli panolar en ve kalınlık bazında sayılır. H, üçlü/dörtlü H, köşe ve U birleşimleri konumlarına göre işaretlenir. Yükleme Excel’inde “Çizim adedi”, “Kesim dağılımı”, “Yedek” ve “Toplam sevk” ayrı okunur. Birim ve kesim boyu eşleşmeden adetler toplanmaz. Kural bekleyen satır, referansta olup programdan çıkmayan ürün ve açıklanamayan fark için duvar/ürün adı ve karar kaydedilir. Nihai sevk listesi bu kararlar tamamlandığında onaylanır.

Kaynaklar: referanslar/tuna-84m2/Drawing1.dwg için mevcut DWG eşleme raporu analizler/2026-10-02-tuna84-karsilastirma.md; cizimler/2026-10-02-tuna84-dwg-esleme-taslak.json; referanslar/tuna-84m2/SP - 202600185 - Tuna Pref. 84m².xlsx, K1-280-10-6. DWG bu kontrolde yeniden ölçülmedi.
