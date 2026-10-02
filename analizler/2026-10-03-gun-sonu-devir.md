# 3 Ekim 2026 — Gün sonu devir ve Tuna karşılaştırması

Program 5.9.36, kaynak commit fa76462add1b1b4826a9f1fce7644766abf2493c. Yeniden hesaplanan kaynak çizim: cizimler/2026-10-02-tuna84-dwg-esleme-taslak.json. Referans: referanslar/tuna-84m2/SP - 202600185 - Tuna Pref. 84m².xlsx (uygulamaya aktarılmış referans satırları).

| Kalem | Excel | Program sevk |
| --- | ---: | ---: |
| 100 mm dolu pano | 23 | 22 |
| 60 mm dolu pano | 12 | 12 |
| H ve üçlü H (altı grup) | 10/10/9/2/1/4 | 10/10/9/2/1/4 |
| Köşe direği | 8 | 8 |
| Çektirme U | 4 | 3 + 1 yedek |

710 + 520 mm aynı 1250 mm panoya sığıyor (20 mm artık); bunları ayrı sevk etmek dış pano sayısını 23 yapar. Excel fazlasının nedeni olduğu doğrulanmadı. Kapılı/pencereli 12 panel, PVC/kapılar, veranda serbest direkleri ve diğer reçeteler için tüm liste eşitliği henüz söylenemez. Bu sonuç canlı tarayıcı planına değil kayıtlı kontrol taslağına aittir.

## Yedek kapsamı

Mevcut Yeni proje (11).json orijinali korunarak cizimler/2026-10-03-ev-mevcut-yedek-5.9.14.json yoluna kopyalandı. JSON geçerli; içinde revision 5.9.14, son dosya tarihi 2 Ekim 2026. Bu eski dosyanın son canlı çizim olduğu doğrulanmadı.
SHA-256: 2c45a264202a0bd16f09e1684fe5fe9f5d365623d5e592c33c01ae3474d8c55c

Canlı file:// sekmesine erişim tarayıcı güvenlik politikası tarafından engellendi; alternatif yolla erişim denenmedi. Son canlı planın ayrıca uygulamadaki Kaydet ile dışa aktarılması gerekiyor. Yerel otomatik tarayıcı yedeğinin alınmış olduğu varsayılmadı.

## Yarın ilk adım

GitHub güncellemesini al, AGENTS.md / DEVAM.md / CALISMA_KAYDI.md oku. Önce kullanıcının son canlı JSON'unu belirle (DEV-002); eski yedeği bunun üzerine yükleme. Sonra DEV-025/DEV-006 kapsamında dış panodaki bir adet farkın sevk/kesim tercihini ve kapılı/pencereli panoların yükleme reçetelerini netleştir. Mevcut diğer açık işleri koru.
