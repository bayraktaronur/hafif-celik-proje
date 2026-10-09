# DEV-088 — 5.9.103 veranda kapanışları

Kullanıcı üç ekran görüntüsünde tavan/duvar boşluğu, alın çift yüzeyi, betopanın kiriş altına taşması ve ortak saçaktaki kademeyi işaretledi.

- `planStructure` veranda için ikinci alın üretmiyor. Alın tek kez `verandaStructure` içinde, alt sınırı dikme/kiriş üst kotunda çiziliyor.
- Beşik verandada kiriş altı ve tavan kotu duvar üst kotuna alınır; üst sınır çatı yüzeyiyle kısıtlanır. Bu nedenle önceki örnekte gereğinden uzun hesaplanan dikme boyu ve profil net metrajı da düzelir. Kullanıcı kesitleri değişmez. Tek eğim/karga burun kot davranışı korunur.
- Ana çatı destek yüzüyle veranda aksı arasındaki yarım dikme eni toleransında ortak yan saçak aynı dış sınıra uzanır. Birleşim yüzeyleri aynı düzlemde kalır. Farklı konumdaki bağımsız saçaklar eşitlenmez.

Testler: `veranda-custom`, `ceiling-panels`, `veranda-gable-contact`, `veranda-joins` geçti. Gable-contact testi ayrıca tek alın, kiriş üstünde alt sınır, duvar kotunda tavan ve 35 cm çözülmüş ortak saçak kontrollerini içerir. [Alttan görünüm](2026-10-09-veranda-kapanis.png) incelendi.

Örnek: `cizimler/gulsum-84m2/veranda-kirisli-ornek-5.9.98.json`. Son canlı çizimin JSON'u verilmedi; bağımsız tarayıcıda eski örnek üzerinden doğrulandı. Kaynak görsellerin özgün yolları, kopyaları ve SHA256 değerleri `referanslar/gulsum-veranda/kapanis-kaynaklari.json` içinde. Eski yedekler ve kullanıcının açık çizimi korunur. Mini H ve kaplama çizimi şematiktir; taşıyıcı hesap değişikliği değildir.
