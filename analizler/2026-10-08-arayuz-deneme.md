# DEV-073 — Ayrı arayüz denemesi / 5.9.88

Kullanıcı arayüzü sadeleştirmeyi ve eski sürümü kesin korumayı istedi. Rakipteki bağlama göre özellik paneli ve gruplandırılmış araç yaklaşımı temel alındı; kod/ikon kopyalanmadı.

Korunan ana sürüm: 5.9.87, commit2baae5c52d35f79d66cbe44fc8ecb41865d05041, stable-5.9.87-before-ui etiketi. Eski tek HTML releases/5.9.87/plan_studio.html içinde aynen saklandı, SHA256 CC65F089DB6CC15C9917D1AF5C4C988A214B71164DDD66B92817525FC9AF034E. Ek yerel kopya üst klasör surum-yedekleri/5.9.87. Ana github-calisma/dist dosyası değişmedi.

Yeni çalışma codex/arayuz-duzeni dalında ve arayuz-deneme klasöründe. Sol alan Özet/Ayarlar/Metraj/Rehber; sağ özellik panelinde teknik ayarlar açılır gruplar; proje paneli gizlenebilir; araç satırları taşmadan sarılır. Mevcut DOM girişleri ve olayları korunur; hesap motoru değiştirilmez. Deneme otomatik kurtarma anahtarı prefabrikten.planstudio.ui-preview.recovery.v1; ana programın tarayıcı yedeği kullanılmaz veya üzerine yazılmaz.

workspace-ui testi grup geçişi/girdi erişimi/model değişmezliği, roof-height-change testi250/280/300,undo/JSON geçti. Görsel kontrol yapıldı. Bu tur arayüz düzeni tamamlandı; DEV-072deki3Bparça seçimi/yan yana3B önerileri uygulanmadı. Ana sürüme birleştirilmedi.

Önemli: HTML/kod yedeği açık müşteri çiziminin JSON yedeği değildir. Canlı çizime müdahale edilmedi, güncel açık çizimin ayrıca dışa aktarımı henüz doğrulanmadı. Denemeye Kaydet ile alınan JSON kopyası açılmalı. Geri dönüş eski github-calisma/dist/plan_studio.html dosyasını açmaktır.
