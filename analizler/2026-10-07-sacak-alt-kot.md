# Saçak alt uç kotu — 5.9.75

Kullanıcı teyidi: 250 cm duvarda dış uçtaki en alt kapama noktası 250 cm olacak; 30/40 cm yatay taşma korunacak. Referanslar: referanslar/2026-10-07-alin-v-montaj/6-sacak-alt-kot.png ve 7-sacak-alt-kot.png; kaynak/hash envanterde, orijinaller korundu.

Yeni trim kot referansı, çatı yüzeyinin en düşük kotunu kapama alt kotunun üzerine taşır. Standart kapama 12 cm: h=250 ise yüzey 262, saçak ve Alın V altı 250 olur. Alın V üst ofseti bu referansta sıfır, alt ofseti -12 cm; eski kot modlarında önceki geometri korunur. Özel fasciaDepth 12 cm üzerindeyse daha derin kapama esas alınır; Alın V 12 cm kalır ve duvar kotunun altına inmez. Eğim, yatay taşma, mesnet sınırı ve bağımsız çatı alanı değişmez. Birleşimler gerçek yükseltilmiş düzlemlerden çözülür; sadece görüntü kaydırması yapılmaz.

Yeni sınır ve plandan dikdörtgen çatı trim/12 ile başlar. Eski kayıt otomatik değiştirilmez. Saçak alt uçlarını duvar kotuna oturt düğmesi mevcut ana/yavru çatılarda h=wallTop (yoksa proje yüksekliği), datum=trim, fasciaDepth=12 yapar. İşlem tek undo adımıdır; bağlantı çözülemezse geri alınır. Veranda attachment kayıtları bu toplu işlem dışında; ayrı bağlantı kotları korunur. Kot seçicisinden eski modlar kullanılabilir.

Kontroller: roof-trim-datum (36 yükseklik/taşma/tür/yön; tam alt kot, ana/yavru bağlantı, undo/redo/JSON), roof-trims, roof-child-chain ve roof-eave-types geçti. Bağımsız ekran incelendi. Canlı müşteri çizimi değiştirilmedi.
