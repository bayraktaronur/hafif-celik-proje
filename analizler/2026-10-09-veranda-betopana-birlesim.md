# DEV-086 — Beşik veranda / baş makas betopanı birleşimi

5.9.101, 9 Ekim 2026, iş bilgisayarı.

Kullanıcı veranda kaplamasının ana çatı baş makas betopanına ulaşmasını ve aynı eğimdeki yüzeyin devam etmesini istedi. Ana çatının 22 cm alın saçağı, altındaki veranda yüzeyini üst zarf hesabında erken kesiyordu. Paralel beşik bağlantıda düşük yüzey artık ana çatının destek sınırına kadar korunur. Eş düzlemli yüzeyler tek kez hesaplanır; veranda saçak kotu birleşimdeki ana çatı eğiminden alınır. Aynı düzlemdeki iç alın kenarı kalkar; üstte kalan gerçek ana çatı alınları korunur.

Eski kayıtlar yüklenirken bağlantı yeniden çözülür. Veranda tabanı, dikme/kiriş kesitleri ve kat planı değiştirilmez. Kaplama metrajı bu geometriden hesaplanır; ana saçağın altında kalan kısa kaplama da fiziksel kaplama alanına dahildir. Bu değişiklik taşıyıcı hesap veya su yalıtımı birleşim detayı üretmez.

## Doğrulama

- `tests/veranda-gable-contact.cjs`: gerçek 5.9.98 veranda örneği, 22 cm boşluğun tamamında yüzey varlığı, betopan arkasında gizleme, aynı eğimde kot eşitliği, dört dönüş, tekrarlı çözüm, eski JSON yükleme, duvar/profil korunması ve JSON tekrar açma geçti.
- `tests/veranda-joins.cjs`, `tests/veranda-custom.cjs`, `tests/ceiling-panels.cjs` geçti.
- [3B kontrol görüntüsü](2026-10-09-veranda-betopana-birlesim.png). Test bağımsız tarayıcıda yapıldı; kullanıcının canlı çizimi yenilenmedi.
- Test kaynağı: `cizimler/gulsum-84m2/veranda-kirisli-ornek-5.9.98.json`. Son ekran görüntülerindeki canlı projenin yeni JSON'u verilmedi; bu dosya son canlı çizim olarak tanımlanmamıştır.

## Kullanıcı kaynakları

- `C:/Users/ONUR/AppData/Local/Temp/codex-clipboard-4dfedf4a-bdd7-4904-b21e-f3b4d10ac230.png` → `referanslar/gulsum-veranda/betopana-birlesim-bosluk.png`; SHA256 `CDE1FC44CA4791E737071466ADE559AC409D20D697C81EA5FAB81710F42ACEC0`.
- `C:/Users/ONUR/AppData/Local/Temp/codex-clipboard-b3f7280d-7620-4a32-8266-0d385e2bae9c.png` → `referanslar/gulsum-veranda/betopana-birlesim-devam.png`; SHA256 `E4EDF9966B58A932BDF46ECCCF6A5202780672385C7153A5F372B9C4FE6FF34B`.

Orijinaller ve 5.9.87 yedeği korunur. DEV-080 yerel okuyucu çalışması ertelenmiş durumda kalır.
