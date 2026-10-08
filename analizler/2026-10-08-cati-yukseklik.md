# DEV-071 — 5.9.87 duvar yüksekliği ve çatı kotu

Kullanıcı 250 cm kurulan binanın yüksekliği 280/300 yapıldığında çatının eski kotta kaldığını bildirdi. Kaynak görsel referanslar/2026-10-08-cati-yukseklik altında SHA-256 envanteriyle korunur.

Neden: Studio.projectField ve optUygula duvar yüksekliğini değiştiriyordu; RoofStudio.seat mevcut wallTop değerini kullanıyordu. Çatı kotu aynı düzenleme işlemine dahil değildi.

Studio.edit ortak işleminde bina yüksekliği değişince bağımsız ana ve yavru bölümlerin wallTop değeri yeni bina yüksekliğine atanır. RoofWorkflow.synchronize saçak kotunu ve yavru birleşimlerini yeniden hesaplar. Bağlı verandalar kendi attachment kuralıyla yeniden bağlanır. Hesap/validasyon hatası varsa tüm düzenleme mevcut işlem sistemiyle geri döner. Genel bina yüksekliği uygulaması bölüm bazlı eski wallTop değerlerini yeni ortak kota getirir; floorLevel veya yatay plan taşınmaz.

roof-height-change: gerçek Yeni proje11 kaydında 250→280→300→250, iki yükseklik giriş yolu, ana/yavru kotları, saçak alt kotu, undo/redo, JSON yeniden yükleme, eski hatalı kaydın sonraki yükseklik değişimiyle düzelmesi ve yatay plan/saçak ölçülerinin korunması geçti. roof-auto-seat regresyonu geçti. artifacts/roof-height-280.png incelendi. Son kullanıcı görselindeki projenin yeni JSON'u verilmedi; kayıtlı proje11 ile doğrulandı. Açık tarayıcı çizimine müdahale edilmedi.

Eski hatalı kaydı açmak tek başına kota zorlamaz; bina yüksekliğini bir kez farklı değere ve istenen değere almak düzeltmeyi uygular. DEV-071 tamamlandı; önceki açık işler korunur.
