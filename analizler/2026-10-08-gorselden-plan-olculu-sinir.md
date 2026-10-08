# Görselden plan: anlaşılır çizgi seçimi ve ölçülü dış sınır — 5.9.94

8 Ekim 2026, iş PC. Kullanıcı çizgi/koordinat eşlemesinin anlaşılmadığını, mobilya adaylarını ve dikdörtgen sınır kısıtını bildirdi. Kaynak: codex-clipboard-2b4c9a69-ecbe-421f-81e3-2ea5f198c2f4.png; kopya referanslar/gorselden-plan/cizgi-secimi-geri-bildirim.png.

## Değişiklik
- D1/D2 etiketleri koyu kutuda beyaz yazı; aday turuncu, seçim mavi, dış sınır yeşil. Çizgiye veya D düğmesine tıklayınca satır ve görsel birlikte vurgulanır.
- İlk tabloda yön ve seçilen m/cm/mm biriminde uzunluk var. Koordinatlar açılır ayrıntıda. Uzunluk birinci ucu sabit tutarak ikinci ucu değiştirir; iç duvar ekseni uzunluğudur, oda net ölçüsü değildir.
- İsteğe bağlı dış kenar zinciri: yön+uzunluk ile L/U ve dik köşeli çokgenler. Dış yüz ölçülerinden duvar kalınlığının yarısı kadar içeri eksen hesaplanır. Sınır kapanması, kendiyle kesişme, kısa/dar kenar ve girinti dışına taşan iç duvar kontrol edilir. Üstteki toplam en/boy ile zincir sınırı uyuşmalı.
- Ölçü zinciri kullanılırsa görsel/kutu olmadan da dış duvar taslağı hesaplanabilir. Çizgi adayları isteğe bağlıdır. El çizgisinin yamukluğu bu yolda geometriyi etkilemez.
- Prefabrik modül uyarlaması mevcut taslak yaklaşımını kullanır; gerçek panel yerleşimi aktarım sonrası mevcut panel/aks motorunca hesaplanır. İmalat uygunluğu otomatik onaylanmaz.

## Kontrol
image-plan-offline: sentetik/gerçek görsel, gerçek fareyle seçim, satır seçimi ve uzunluk değişimi, L/U iki çevre yönü, kapanış ve dışarı taşma reddi, üç üretim modu, JSON/aktarım/yedek/undo geçti. image-plan-brief regresyonu geçti. L şekli ekran görüntüsü incelendi; kaynak bağımsız standalone yeniden üretildi.

## Açık kapsam
El yazısı ölçülerini otomatik okuma hâlâ yoktur; bu sürüm doğrulanan/kullanıcının girdiği ölçülerden hesaplar. OCR ve ölçü-oda ilişkisi çözümü DEV-078'de açık. Eğik/kavisli dış duvar desteklenmez. Duvar kalınlıkları nedeniyle çok dar girintilerin daha kapsamlı imalat kontrolü gerekir. Açıklıklar ve çatı geometrisi elle tamamlanır. Önceki açık işler korunur. Ana5.9.87 ve canlı kullanıcı modeli değişmedi; codex/arayuz-duzeni ayrı deneme sürümüdür.

Kaynak SHA-256: BF306612305B1612777641D9B0E9A35AF2A488449557D277456A347BF90FA027
