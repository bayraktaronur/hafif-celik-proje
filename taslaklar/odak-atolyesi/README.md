# Odak Atölyesi — bağımsız arayüz taslağı

25 Ekim 2026 · DEV-146. `index.html` dosyasını tarayıcıda açın. Uygulama sürümü değişmedi: 5.9.137.

Amaç: koyu arayüzü koruyarak katlar arasında geçişi, seçime göre değişen özellikleri ve ölçüyle duvar bölme iş akışını değerlendirmek. Kullanıcı, önce ayrı taslak istedi ve mevcut programa müdahaleyi yasakladı. Sonraki isteği: zemin kat, 1. kat, ara kat ve 3D görünümleri taslağın merkezinde olsun.

## Denenebilir

- Zemin/1. kat/ara kat sekmeleri ve kat ağacı. Boş kata örnek plan kopyalama; ara kat için tek oda alanı.
- 3D şematik kat modeli, görünüşü döndürme, kat görünürlüğü ve ayrıştırma.
- Plan üzerinde oda/duvar seçimi; oda adı düzenleme.
- Duvar bölme akışı: A/B ucu, mesafe, canlı iki parça boyu, açıklık kontrolü, örnek bölme işareti ve geri alma.
- Proje panelini daraltma, ortak yükseklik seçimi, prefabrik/çelik örnek kontrol farkı, görünürlük ve zoom.
- Yalnız taslak oturumunu sıfırlama.

## Sınırlar ve izolasyon

Bu sayfa uygulamanın kaynaklarını yüklemez. Ağ, tarayıcı kaydı veya kullanıcı çizimine erişim içermez. Değişiklikler bellekte tutulur ve sayfa yenilenince kaybolur. Ana `plan_cizim.html`, `src/`, `dist/` ve müşteri JSON dosyaları değiştirilmedi.

Çizim araçlarının bir kısmı yalnız panel/akış önerisidir ve bu açıkça belirtilir. Üretim ve çıktı bölümü bir yerleşim önerisidir; hesap çalıştırmaz. Duvar bölme gerçek segment modelini değiştirmez, taslakta bölme işareti ekler. 3D bir SVG izdüşümüdür; gerçek üretim profilleri, taşıyıcı doğrulaması, malzeme listesi ve çatı modeli içermez. Ara kat yüksekliği bu gösterimde kat yüksekliğinin yarısıdır; bir üretim veya mimari zorunluluk değildir. Kat kopyalama gerçek uygulamada çok kat desteğinin tamamlandığı anlamına gelmez.

## Örnek ve kaynak

`example.js`, `cizimler/2026-10-02-tuna84-dwg-esleme-taslak.json` dosyasının uygulamada okunmasından elde edilmiş geometri/oda etiketi anlık kopyasıdır. Son canlı müşteri çizimi değildir. Mobilya sembolleri yalnız bu arayüz taslağına ait şematik görsellerdir. Özgün dosya değiştirilmedi. Kaynak ve çıktı hash değerleri `envanter.json` içindedir.

## Kontrol

`check.cjs`: seçim, isim/geri alma, geçerli/geçersiz bölme, kat kopyalama, 3D, görünürlük, yükseklik, 980/1280/1920 genişlik, sıfırlama ve veri izolasyonu. Çalışma alanındaki Node/Playwright ve Edge ile çalışır. Görsel kontrol: `artifacts/odak-reviewed.png`, `artifacts/odak-split.png`, `artifacts/odak-3d.png`.
