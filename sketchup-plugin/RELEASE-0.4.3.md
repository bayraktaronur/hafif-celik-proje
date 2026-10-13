# Prefabrikten Karkas 0.4.3

Ara kayıtlar her kotta o kotu gerçekten kapsayan dikmeler arasında oluşturulur. Başlık altında biten jack dikmeler üst kayıtları artık hayali olarak bölmez. Çapraz gözleri de düşey bantta mevcut dikmelerden çıkarılır; alt/üst kayıtların orta kotu esas alınır, uçlar taşıyıcı profil zarfıyla11.25mm örtüşür. Bu görsel temas yerleşimidir; kesme/ezme ve vida tasarımı değildir. Kayıt/çapraz uçları için2B profil zarfı temas denetimi oluşturma sırasında çalışır; temassız uç varsa işlem reddedilir.

Başlık üzerinde kısa dikmeyle karşılanmayan levha destek hattı varsa yalnız o aralık tamamlanır. Testte x3000mm levha derzi için2145..2755mm kısa dikme gerekli çıktı. Profil eklenme nedenleri ve tür/adet dökümü kayıt metadatasında bulunur.

3600×2800mm,C80,t1,aynı kapı/pencereli test: tüm göz çaprazlı eski57parçaya karşı düzeltilmiş aynı seçim59parça (eksik kısa levha desteği ve onun böldüğü ara kayıt eklendi). Kenar göz çaprazlı karşılaştırma45parça/6çaprazdır; önceki tüm göz20çapraz denemesine göre12parça azdır. Bu değişiklik statik hesapla doğrulanmış optimizasyon değildir; çapraz seçimleri ayrıdır. King/jack dikmeleri mühendislik verisi olmadan silinmez. Varsayılan kenar göz seçimi korunur; tüm göz seçimi kullanıcının açık seçeneği olarak kalır.

connection-qa.rb bağımsız uç teması, hayali jack ucu, üst ray teması ve201kot boyunca levha destek hatları; FrameCore120yerleşim/açıklık, OpeningCore ve destek ızgara regresyonları geçti. Eski test yalnız boşluk içine taşmayı denetliyordu; bu sürüm ayrıca bağlantı sürekliliğini sınar. Canlı0.4.3geometri kabulü güncel SketchUp oturumu gerektirir.

MCP0.3.4 opening_comparison yalnız kendi sabit deneme grubu ve kaynağından,eski çizimi koruyarak4200mm yanında kenar çaprazlı yeni karşılaştırma oluşturur. Genel müşteri grubu silme veya değiştirme komutu değildir.
