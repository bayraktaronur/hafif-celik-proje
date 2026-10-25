# Taslakta prefabrik ve ara kat döşeme şasesi

25 Ekim 2026 · DEV-150 · Ana uygulama 5.9.137 korunur.

## İstek ve kaynak

Kullanıcı şaseleri 3D'de alt kat duvarlarının üzerinde görmek, taslağı prefabrik sistemle göstermek ve mevcut programa dokunulmamasını istedi. Ardından “Galvaniz çelik konstrüksiyon” etiketli kesitle ara katın iki kat arasındaki döşeme şasesi olduğunu açıkladı. Yarım yükseklikte oda temsili kaldırıldı.

Kesit kaynağı `C:/Users/ONUR/AppData/Local/Temp/codex-clipboard-1851aa63-de20-455b-9f0b-2869f3e80e47.png`, kopya `referanslar/2026-10-25-arakat/prefabrik-katlar-arasi-kesit.png`. STL kaynakları DEV-148/149 kayıtlarındaki güncel 125 cm şase ve alternatif montajdır. Plan: `cizimler/2026-10-02-tuna84-dwg-esleme-taslak.json`. Yollar ve SHA-256 değerleri [envanterde](2026-10-25-taslak-arakat-envanteri.json).

## Sonuç

Şase alt kotu duvar üstüne, üst kotu bunun 20 cm üstüne bağlandı. Standart dış en 125 cm. Boy/kalan kenar eni mevcut Tuna planının sınırından gelir. Varsayılan yönde 9 şase: 6 standart + 3 özel; boylar 888,5 / 637,5 / 700,25 cm. Özel enler 16,5 / 53,25 / 78,75 cm bu taslağın geometrik sonucu olup onaylı imalat genişliği değildir. Minimum en ve özel kenar yerleşim optimizasyonu açık. Veranda kapsam dışında tutuldu.

STL'den sol/sağ uzun profil, başlıklar ve ara kayıt ayrı çıkarıldı; eleman boyları uyarlanırken kesit eni ölçeklenmedi. Küçük STL uç sapmaları nominal 20 cm'ye sınırlandırıldı. Kayıt dağılımı örnek aralığından türetilen görsel önizlemedir; imalat standardı değildir. Komşu profiller ayrı korunur.

Kaynak plan zaten prefabrik olmasına rağmen eski taslak çizicisi H/panel/köşe ayrımını göstermiyordu. Mevcut motor yeni, izole test tarayıcısında yalnız okundu; 49 panel / 108 parça / 14.240 yüzeylik örnek geometri taslağa kopyalandı. H, H3, U, köşeler ve pencereler görünür. Panel payı/kesim kuralları yeniden yazılmadı. Kaynakta temsilî ayrıntılar temsilî kalır. Önceki taslakta açıklık başlangıcını merkez gibi okuyan 2D gösterim de kaynak t tanımına göre düzeltildi.

Şase planı, parça seçimi/listesi, yön/geri alma, üç görünüm önayarı, 3D orbit/pan/zoom, kat görünürlüğü ve tema eklendi. Ayrıştırma yalnız görüntüyü açar. Üst kat aynı planın örnek kopyasıdır; duvar tabanı şase üst kotunda gösterilir. Gerçek kaplama/bağlantı payları eklenmedi. Önceki 8 cm üst kat demo levhası şasenin içine girmemesi için kaldırıldı. Üç STL yerleşimi ve yeni kesit referans penceresinde açılır; kaynaklardaki 100/250 cm çıkıntılar Tuna duvarlarına zorla eklenmez.

## Kontrol

[Kontrol çıktısı](2026-10-25-taslak-arakat-kontrol.txt): prefab49/H/köşe; 125/20 ölçüleri; şase uç orta noktalarının duvar üst yüzleriyle çakışması; 250/280/300 kotları; ayrıştırma; plan seçimi/yön/geri alma; kamera/tema/katlar; referanslar; önceki oda/bölme akışları; 980/1280/1920; WebGL yedeği; ağ/depolama yokluğu ve ana dosya SHA-256 eşitliği geçti. Oturma testi geometriktir, mesnet yeterlilik hesabı değildir.

Görseller incelendi: [duvar üstü](2026-10-25-taslak-arakat-3d.png), [katlar](2026-10-25-taslak-arakat-katlar.png), [şase planı](2026-10-25-taslak-arakat-plan.png), [prefabrik plan](2026-10-25-taslak-prefabrik-plan.png). Ana `plan_cizim.html`, `src/`, `dist/` ve müşteri çizimleri Git farkında yok. Kullanıcının açık çizimlerine erişilmedi.

## Açık işler

Kalıcı çok kat modeli, canlı üretim motoruyla bağlantı, taban/yalıtım/tavan katmanları, mesnet ve bağlantı standardı, özel enlerin üretilebilirliği, kayıt aralığı, statik ve sevk hesabı tamamlanmadı. Fiyat eklenmedi. Önceki DEV-147/148/149 üretim belirsizlikleri ve diğer açık işler korunur. Yalnız ayrı taslak tamamlandı; ana programa aktarım için ayrı kullanıcı kararı gerekir.

Açılış: `taslaklar/odak-atolyesi/index.html`; [kullanım ve teknik sınırlar](../taslaklar/odak-atolyesi/README.md).
