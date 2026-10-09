# DEV-090 — 5.9.105

Veranda çizilmiş sınırları ölçü kaynağıdır. Ön kiriş/dikmeler ön çizginin uçlarından; yan kirişler o uçlara bağlı gerçek veranda kenarlarından türetilir. İki yan kiriş ortak dikdörtgen derinliğinden hesaplanmaz. Hafif eğik kenar kendi doğrultusunda çizilir. Direk iç yüzü ve ev duvarının temas yüzü kesim payları düşülür. Ekrandaki sınır boyu ile profil net kesim boyu bu yüzden aynı olmak zorunda değildir.

Kaynak örnekte ön aks 502 cm; 10 cm direklerle ön net kiriş 492 cm. Sol net kiriş 313,75 cm; sağ net kiriş yaklaşık 125,59 cm. Sağ kenarın 5 cm eğikliği korunur. Profil eni/et kalınlığı ve isteğe bağlı kiriş seçimi korunur.

Çatı tabanı eski kayıttaki dikdörtgen yerine güncel ön veranda kenarına yeniden bağlanır. Studio düzenlemesinden sonra sınır değişimi çatıya yansır. Sol panelde Veranda kirişleri → Ön + sol + sağ seçilebilir; mevcut verandada sağ panelde Sol yan kiriş / Sağ yan kiriş kutuları ve Değişiklikleri uygula da kullanılabilir.

Kontroller: ceiling-panels (farklı kaynak segmentleri, farklı net boylar, 20 cm sınır taşımasında çatı ve kiriş boyu güncelleme, üç kiriş/JSON), veranda-custom, veranda-joins, veranda-gable-contact geçti. [3B](2026-10-09-veranda-sinir-kiris.png) kontrol edildi. Test kaynağı `cizimler/gulsum-84m2/veranda-kirisli-ornek-5.9.98.json`; son canlı JSON verilmedi ve canlı çizim değiştirilmedi.

Kaynak ekranların yolları ve SHA256 değerleri `referanslar/gulsum-veranda/sinir-kaynaklari.json` içinde. Sınır: mevcut Net ölçü düzenleyicisi eğik veranda kenarlarının yeniden boyutlandırılmasını desteklemiyor; bu değişiklik eğik kenarın kiriş hesabını destekler. Çok parçalı/kademeli açık kenarların tümünü takip eden çok kirişli sistem ayrıca geliştirilmelidir.
