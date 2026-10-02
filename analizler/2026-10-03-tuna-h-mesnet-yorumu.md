# Tuna 84 — H, makas mesnedi ve Excel ilişkisi

## Kaynak ve yöntem

Drawing1.dwg SHA-256 a671a74c3c72b67c94ea157fb4e2d65a28b51f151615c8887241f0ab7e530a55; tam SP -202600185- Tuna Pref.84m².dwg SHA-256 7f0ac72fce090585d14e87fc77c44787c43f76e5b3eee6896a1f3c33b38465e2 yeniden doğrulandı. Drawing1'in daha önce AutoCAD ile çıkarılmış geometrisi ve cad.png görünümü incelendi. Tam SP dosyasının önceki AutoCAD nesne dökümündeki Makas Yerleşim Planı, Baş Makas1, Orta Makas6, Özel Baş Makas1 ve Cumba Baş Makas1 etiketleri kontrol edildi. Tam dosya farklı plan ve detay görünümleri içerir; tüm nesnelerin toplamı bir evin H adedi sayılmadı.

Excel: referanslar/tuna-84m2/SP - 202600185 - Tuna Pref. 84m².xlsx, K1-280-10-6 B23:D28. Önceki karşılaştırmada doğrulanan kaynak hash ve satırlar korunur. Model: cizimler/2026-10-02-tuna84-dwg-esleme-taslak.json; canlı sayfanın kaydedilmemiş hali değildir.

Mevcut modelde bir H'nin sadece makas çizgisi üzerinde bulunması yerine, ilgili makas açıklığının a/b uçlarından birinde olması ayrıca kontrol edildi. Bu alternatif hesap kaynak dosyayı ve uygulama kodunu değiştirmedi.

## Satırların tamamıyla eşleşen yorum

| Sınıf | Excel | Makas uç mesnedi yorumuyla kontrol planı |
| --- | ---: | ---: |
| Standart dış H kulaklı/dübelli | 10 | 10 |
| Standart dış H kulaksız/dübelli | 10 | 10 |
| Standart iç H kulaksız/dübelsiz | 9 | 9 |
| Dış üçlü H kulaklı/dübelli | 2 | 2 |
| Dış üçlü H kulaksız/dübelli | 1 | 1 |
| İç üçlü H kulaksız/dübelsiz | 4 | 4 |
| Toplam | 36 | 36 |

Bu projede makas uçlarındaki H10 ve üçlü H2 =12kulaklı; diğer24bağlantı kulaksız. Dış bağlantı23dübelli, iç13dübelsiz. Böylece Excel'in altı satırı birlikte eşleşir. Sadece toplamı tutturmak için adet değişikliği yapılmadı; konuma bağlı alternatif kural hesaplandı.

## Kullanıcı tarifiyle ilişki

Kullanıcının “makasın içine giren” ifadesi fiziksel bağlantıyı anlatıyor. Önceki5.9.31 algoritması bu şartı2B izdüşüm eşleşmesine indirgeyerek geniş yorumladı. Makasın üzerinden geçtiği her H, makasa bağlanan H değildir. Bu örnekte kulaklılar makasın oturduğu uç mesnet H'leri; dış duvar dübel koşulu ise bağımsızdır. Üst/alt cephede aynı doğrultudaki H'ler ve iç bölme H'leri uç mesnet olmadığı için Excel'de kulaksız görünmesiyle uyumludur.

Güçlü çıkarım: kulak=makasın gerçek H bağlantısı/mesnedi; dübel=dış duvar. Bu çıkarım Tuna örneğinin altı satırını açıklar. DWG'deki her H'de kulak/dübel niteliği açıkça etiketli görülmediğinden fiziksel bağlantı detayının kesin mühendislik doğrulaması olarak sunulmaz. Başka yapılarda gerçek ara mesnet bulunabilir: iç H'ler daima kulaksız diye genel kural yazılmamalı; gerçek makas bağlantısı varsa önceki kullanıcı tarifine göre kulaklı, içte dübelsiz olmalıdır.

## Uygulama durumu

Bu tur yalnız analizdir;5.9.31 kodu hâlâ geniş aks eşleşmesini kullanır. Üretim düzeltmesi için gerçek mesnet ilişkisi tanımlanmalı; Tuna'da uç mesnet kuralı kullanılmalı, gelecekte ara mesnet/özel makas ayrı desteklenmeli. DEV-022 yeniden uygulama düzeltmesi bekliyor; DEV-006 H adetlerinin açıklaması güçlü biçimde bulundu ama diğer üretim/PVC/panel işleri açık. Kaynaklar ve canlı müşteri planı değişmedi.
