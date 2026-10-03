# Diğer yükleme kalemleri — 3 Ekim 2026

Kaynak: src/loading-reference.js içindeki SP - 202600185 - Tuna Pref. 84m².xlsx / K1-280-10-6 referans satırları. Bu tur özgün Excel yeniden okunmadı; mevcut aktarılmış envanter incelendi. src/loading-ui.js ve önceki analiz kayıtlarında bu kalemler için onaylı genel üretim reçetesi bulunmadı.

| Sıra | Kalem / referans | Netleştirilecek kural |
| --- | --- | --- |
| 1 | Alt çerçeve: 60×2500 mm 10 adet, 100×2500 mm 15 adet; satır38–39 | Hangi duvar boyunca, kapı altında devam/kesinti, köşe birleşim boyları, artık kullanımı ve yedek |
| 2 | Duvar omegası: 60×2500/3680/4940 ve100×2500; satır30–33 | Düşey/yatay uygulama yeri, adet/aralık, duvar kalınlığına bağlı kesit ve stok boyu |
| 3 | Veranda: flanşlı100×100×2500 2adet; kiriş100×100×4970 ve3500 birer adet; satır19–21 | Direk kesiti/boyu, kiriş hangi açıklıkta ve net kesim payları |
| 4 | Saçak omegası/sacı, alın V, aşık kapama U, köşebent, baş makas Z ve menfez; satır34–37,40–42 | Gerçek çatı kenarı/makas ilişkisi, stok boyu, bindirme ve yedek |
| 5 | Kapı/PVC; satır45–49 | Açıklık ölçüsünden sipariş ölçüsüne dönüşüm, açılış yönü ve ayrı ürün sayımı |

Excel sayıları gelecekteki projeye sabit adet olarak kopyalanmayacak. Önce kullanıcıdan alt çerçeve genişliği, kapı altında devam/kesinti, 2500mm stok ve artık/yedek bilgisi soruldu; yanıt bekleniyor. Bu bilgiler alınmadan otomatik üretim hesabı eklenmedi. Kapılı pano DEV-006 ve dolu stok DEV-025 bağımsız açık kalır. Kod5.9.36 ve canlı çizim korunur.
