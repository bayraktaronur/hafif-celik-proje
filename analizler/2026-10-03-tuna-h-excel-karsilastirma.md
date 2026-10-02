# Tuna 84 — H karşılaştırması (5.9.31)

Kaynak Excel: `referanslar/tuna-84m2/SP - 202600185 - Tuna Pref. 84m².xlsx`, `K1-280-10-6`, B23:D28. SHA-256: `a9b2946ca5ae6476b8334016a2a3c107e1d6d0bd0d3e4f870e2f76639beb0803`. Salt okunur openpyxl ile tekrar okundu.

Çizim: `cizimler/2026-10-02-tuna84-dwg-esleme-taslak.json`. SHA-256: `43862690c526c8ac6a13de8f8242fcee9d9f4a7c63d6c57e80b600efc92b719f`. Ayrı tarayıcı oturumunda5.9.31 yükleme hesabı tekrar çalıştırıldı. Canlı tarayıcıdaki kaydedilmemiş plan bu karşılaştırmaya dahil değildir.

## Sonuç

Toplam36 H iki kaynakta eşittir. Standart dış H20, standart iç H9, dış üçlü H3, iç üçlü H4 eşittir. Fark kulaklı/kulaksız dağılımındadır. Köşe direği/U bu36adede dahil değildir. Profil kesit/net boy onayı bu karşılaştırmanın kapsamı değildir; çizim duvar sınıfı ile Excel ürün sınıfı karşılaştırılır.

| Sınıf | Excel satırı | Excel | Program | Fark |
| --- | --- | ---: | ---: | ---: |
| Dış H kulaklı/dübelli | 23 | 10 | 18 | +8 |
| Dış H kulaksız/dübelli | 24 | 10 | 2 | -8 |
| İç H kulaklı/dübelsiz | Ana listede satır yok | 0 | 8 | +8 |
| İç H kulaksız/dübelsiz | 25 | 9 | 1 | -8 |
| Dış üçlü H kulaklı/dübelli | 26 | 2 | 3 | +1 |
| Dış üçlü H kulaksız/dübelli | 27 | 1 | 0 | -1 |
| İç üçlü H kulaklı/dübelsiz | Ana listede satır yok | 0 | 4 | +4 |
| İç üçlü H kulaksız/dübelsiz | 28 | 4 | 0 | -4 |
| Toplam | | 36 | 36 | 0 |

Satırı olmayan sınıflarda0, ana listede o sınıfa ayrılmış adet bulunmadığı anlamındadır. Kaynakta dübel yazmayan iç H satırları kullanıcının iç H her zaman dübelsiz kuralıyla yorumlandı. Excel toplam kulaklı12/kulaksız24; program kulaklı33/kulaksız3.21 bağlantının kulak sınıfı farklı.

## Farkın konumsal incelemesi

- Program8 dış standart H için makas çizgisinin iç kısmıyla aynı doğrultuda olmayı kulaklı kabul ediyor: M1 üst cephede5, M8 alt cephede2, M6 veranda yanındaki yatay hatta1. Bunlar kulaksız kabul edilirse dış standart H dağılımı10/10 olur. Bu sayısal uyum tek başına üretim kuralı kanıtı değildir.
- Dış üçlü H `joint:e105:H3`, M1 üst cephede aynı makas çizgisinin iç kısmında kalıyor. Bu bir bağlantı kulaksız olursa dış üçlü dağılımı2/1 olur. Fiziksel bağlantı koşulu henüz doğrulanmadı.
- İç standart8 ve iç üçlü4 bağlantı makas çizgilerinin altında sınıflandırılıyor; Excel tüm iç H bağlantılarını kulaksız listeliyor. Makasın iç duvar üzerinden geçmesi, H içine gerçekten girmesi veya yükseklik/bağlantı detayı ayrı doğrulanmalıdır.
- Bu bulgular eski Excel yanlış demek için yeterli değildir. Mevcut sınıflandırma2B aks ve açıklık kontrolüdür, düşey makas/H temasını modellemez. Kullanıcının tarifindeki “makasın içine giren” koşulunu yalnız2B eşleşmeyle uygulamak fazla kulaklı sayım üretmiş olabilir.

## Sıradaki doğrulama

Üst/alt cephede makasla paralel H ve iç bölmelerdeki H gerçekten makasın içine giriyor mu? Fiziksel temas kuralı netleşmeden Excel veya model değiştirilmedi. DEV-022 temel tarifleri kayıtlıdır ancak2B eşleşmenin fiziksel temas karşılığı açık; DEV-006/011 ile birlikte çözülmeli.

## Bağlantı bazında izleme

| Tür | Sınıf | Duvar ölçü grubu | Kimlik | X/Y (cm) | Makas |
| --- | --- | --- | --- | --- | --- |
| Üçlü H | Kulaklı · dübelli | Duvar 10/6 cm | `joint:e109:H3` | 313.75 / 62.75 | M4 |
| Üçlü H | Kulaklı · dübelli | Duvar 10/6 cm | `joint:e105:H3` | 695.25 / -313.75 | M1 |
| Üçlü H | Kulaklı · dübelli | Duvar 10/6 cm | `joint:e117:H3` | 1202.25 / 62.75 | M4 |
| Üçlü H | Kulaklı · dübelsiz | Duvar 6/6 cm | `joint:cadBathL:H3` | 695.25 / -62.75 | M3 |
| Üçlü H | Kulaklı · dübelsiz | Duvar 6/6 cm | `joint:e106:H3` | 695.25 / 62.75 | M4 |
| Üçlü H | Kulaklı · dübelsiz | Duvar 6/6 cm | `joint:cadBathR:H3` | 883.5 / -62.75 | M3 |
| Üçlü H | Kulaklı · dübelsiz | Duvar 6/6 cm | `joint:e114:H3` | 883.5 / 62.75 | M4 |
| H | Kulaklı · dübelli | Duvar 10 cm | `joint:e96:130.5:H` | 444.25 / -313.75 | M1 |
| H | Kulaklı · dübelli | Duvar 10 cm | `joint:e96:256:H` | 569.75 / -313.75 | M1 |
| H | Kulaklı · dübelli | Duvar 10 cm | `joint:e96:507:H` | 820.75 / -313.75 | M1 |
| H | Kulaklı · dübelli | Duvar 10 cm | `joint:e96:632.5:H` | 946.25 / -313.75 | M1 |
| H | Kulaklı · dübelli | Duvar 10 cm | `joint:e96:758:H` | 1071.75 / -313.75 | M1 |
| H | Kulaklı · dübelli | Duvar 10 cm | `joint:e98:125.5:H` | 1202.25 / -188.25 | M2 |
| H | Kulaklı · dübelli | Duvar 10 cm | `joint:e98:251:H` | 1202.25 / -62.75 | M3 |
| H | Kulaklı · dübelli | Duvar 10 cm | `joint:e98:502:H` | 1202.25 / 188.25 | M5 |
| H | Kulaklı · dübelli | Duvar 10 cm | `joint:e98:627.5:H` | 1202.25 / 313.75 | M6 |
| H | Kulaklı · dübelli | Duvar 10 cm | `joint:e72:125.5:H` | 313.75 / -188.25 | M2 |
| H | Kulaklı · dübelli | Duvar 10 cm | `joint:e72:251:H` | 313.75 / -62.75 | M3 |
| H | Kulaklı · dübelli | Duvar 10 cm | `joint:e72:502:H` | 313.75 / 188.25 | M5 |
| H | Kulaklı · dübelli | Duvar 10 cm | `joint:e72:627.5:H` | 313.75 / 313.75 | M6 |
| H | Kulaklı · dübelli | Duvar 10 cm | `joint:e72:753:H` | 313.75 / 439.25 | M7 |
| H | Kulaklı · dübelli | Duvar 10 cm | `joint:e142:57.75:H` | 753 / 313.75 | M6 |
| H | Kulaksız · dübelli | Duvar 10 cm | `joint:e100:76.375:H` | 959.875 / 376.5 | Yok |
| H | Kulaksız · dübelli | Duvar 10 cm | `joint:e100:242.375:H` | 1125.875 / 376.5 | Yok |
| H | Kulaklı · dübelli | Duvar 10 cm | `joint:e134:125.5:H` | 695.25 / 439.25 | M7 |
| H | Kulaklı · dübelli | Duvar 10 cm | `joint:e135:107.75:H` | 421.5 / 564.75 | M8 |
| H | Kulaklı · dübelli | Duvar 10 cm | `joint:e135:273.75:H` | 587.5 / 564.75 | M8 |
| H | Kulaklı · dübelsiz | Duvar 6 cm | `joint:cadWallBathBottom:125.5:H` | 820.75 / -62.75 | M3 |
| H | Kulaklı · dübelsiz | Duvar 6 cm | `joint:e107:125.5:H` | 695.25 / -188.25 | M2 |
| H | Kulaksız · dübelsiz | Duvar 6 cm | `joint:e107:497:H` | 695.25 / 183.25 | Yok |
| H | Kulaklı · dübelsiz | Duvar 6 cm | `joint:e115:125.5:H` | 883.5 / -188.25 | M2 |
| H | Kulaklı · dübelsiz | Duvar 6 cm | `joint:e115:502:H` | 883.5 / 188.25 | M5 |
| H | Kulaklı · dübelsiz | Duvar 6 cm | `joint:e110:130.5:H` | 444.25 / 62.75 | M4 |
| H | Kulaklı · dübelsiz | Duvar 6 cm | `joint:e110:256:H` | 569.75 / 62.75 | M4 |
| H | Kulaklı · dübelsiz | Duvar 6 cm | `joint:e118:62.75:H` | 946.25 / 62.75 | M4 |
| H | Kulaklı · dübelsiz | Duvar 6 cm | `joint:e118:188.25:H` | 1071.75 / 62.75 | M4 |
