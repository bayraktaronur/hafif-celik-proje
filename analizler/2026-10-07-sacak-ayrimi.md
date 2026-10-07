# Alın / yan saçak ayrımı — 5.9.74

Kullanıcı kuralı: baş makas / Alın V tarafı 220 veya 400 mm ve özel; yan saçak 300 veya 400 mm ve özel. Yeni sınır çiziminde varsayılan 220/300. Görsel referans: referanslar/2026-10-07-alin-v-montaj/5-sacak-ayrimi.png; kaynak ve SHA-256 envanter.json içinde.

Mevcut kenar offset motoru korunur. eaveRule yalnız yeni çizimlerde veya kullanıcı açıkça uyguladığında eklenir. Beşik ve tek eğimde yerel X uçları alın, Y kenarları yan; kırmada tüm kenarlar yan saçak. Çokgen sınırda yerel kenar yönü kullanılır, birleşim kenarları sıfır kalır. Ayrı ölçü modunda Alın V alt kanadı alın taşmasına eşitlenir; bağımsız eski profil ayarı devre dışı görünür. Özel profil 1–5000 mm; yan saçak 0–5000 mm. Özel ölçü stok satırında kendi genişliğiyle listelenir.

Eski JSON otomatik dönüştürülmez; bir bölümü seçip Ayrı alın / yan ölçülerini uygula seçilir ve Değişiklikleri uygula ile çevrilir. Destek sınırı ve duvarlar sabit; çatı dış sınırı, yüzey ve metraj yeni taşmaya göre hesaplanır. Bağlı U yavru uçları ana çatının yeni karşılık gelen kenarına taşınır; dış derinlik korunur, U dikliği için yan koordinatlar eşlenir. Bağlantı çözülmezse mevcut commit geri alma mekanizması değişikliği reddeder. Undo/redo ve JSON ölçüleri korur. Birleşimde yan taşmanın ana kenarda sınırlandırılması sürer.

Testler: roof-eave-types (eski kayıt/değişikliksiz uygulama, 22/30 dönüşümü, 35/45 özel, bağlı yavru, undo/redo, JSON, X/Y yönü ve kırma alanı), roof-workflow, roof-child-chain, roof-child-u, roof-trims, roof-directions. Testte eski 280 cm duvar varsayımı güncel 250 cm ile düzeltildi; kaldırılmış forma gecikmeli erişim hatası bulundu ve giderildi. Bağımsız 3B ekran incelendi. Canlı kullanıcı çizimi değiştirilmedi.

Kapsam sınırı: verandanın mevcut bağlantı/kenar ayarları korunur; bu yeni kontrol bağımsız ana/yavru çatılar içindir. Alın V küçük bükümleri ve omega/trapez imalat kesitleri DEV-056 kapsamında açık.
