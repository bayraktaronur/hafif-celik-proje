# DEV-091 — 5.9.106

Kullanıcı ana çatı ve sağ çıkma arasında tek eğimli veranda fotoğrafı verdi. Önceki tek eğim yalnız yatay saçak kenarını kabul ediyordu. Artık baş makas yüzüne paralel sundurma da oluşturulur. Genişlik boyunca en düşük ana çatı yüzeyi bağlantı kotunu sınırlar; girilen aşağı mesafe düşülür, tek düzlem öne doğru eğimlenir. Arka sınır saçak ucunda kesilmez, ana çatı destek/betopan sınırına ulaşır. Yan düşey kapamalar üretilir. Direk ve kiriş kesitleri değişebilir; kirişler isteğe bağlıdır.

Kullanım: Çatı planında veranda alanını seç → Sundurma · tek eğim → Ana çatı 1 → istenirse Ön + sol + sağ kiriş → Veranda oluştur / güncelle. Sağda eğim, bağlantıdan aşağı mesafe ve minimum ön açıklık ayarlanır. Başlangıç %5 / 10 cm / 210 cm; bunlar fotoğraftan ölçülmüş değerler değildir.

`tests/gable-canopy.cjs`: dört dönüş, tek eğim doğrulaması, yetersiz ön açıklık reddi; eski gerçek planın kısaltılmış ana çatısı ve sağ çıkma çatısı ile oluşturma, üç kiriş, yan kapamalar, JSON tekrar açma geçti. `veranda-joins`, `veranda-gable-contact` geçti. [Görsel kontrol](2026-10-09-tek-egim-sundurma.png). Kaynak/hash listesi `referanslar/gulsum-veranda/sundurma-kaynaklari.json`.

Son ekranlardaki müşteri JSON'u verilmedi; test eski kayıt üzerinden benzer yerleşim oluşturularak yapıldı. Canlı çizim ve eski yedekler korunur. Sağ çıkmayla özel su yalıtımı/oluk birleşim imalat detayı ve taşıyıcı hesabı bu değişikliğin kapsamı değildir.
