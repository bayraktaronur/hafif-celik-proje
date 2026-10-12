# Prefabrikten Karkas 0.4.1

Kesilmiş son levha parçasının ortasına koşulsuz destek eklenmesi kaldırıldı. Levha derzleri ve tam levhaların orta destekleri korunur; uzun kesilmiş parçada yarım levha aralığı devam eder. Seçilen azami dikme aralığı ayrıca uygulanır. Aynı çekirdeği kullanan duvar ve düz çatı/döşeme panelleri bu düzeltmeyi alır.

1500×3000 mm, C80,1mm,dikey alçıpan,600mm azami aks,sol göz çaprazı: dikmeler22.5/600/1200/1477.5mm; yataylar1250/2500mm. Üst ek kayıt kapalıysa15parça. Önceki örnekteki140mm üst kayıt açık tutulursa2860mm kaydı korunur ve26yerine18parça oluşur. Kullanıcının açıkça istediği kayıt kaldırılmaz; yakın özel bağlantı/derz hatları otomatik birleştirilmez.

Kontroller: support-grid-qa.rb tüm4kaplama ve2yön, kısa/uzun son parça, derz ve azami boşluk; frame-core-qa.rb120yerleşim ve açıklık regresyonları; panel-core-qa.rb72yerleşim; verify.cjs35kesit/175geçme kontrolü geçti. Gerçek SketchUp yeni sürüm geometri kabulü yeniden açılış sonrasında gereklidir. Mevcut açık çizimler değiştirilmez.

Statik yeterlilik veya ürünün izin verilen vida aralığı hesaplanmaz: yarım levha destek ızgarası yerleşim kuralıdır. Referans projedeki akslar bütün projelere sabitlenmez. Gerçek makas, bağımsız çapraz düğüm şeması, özel desteklerin birleştirilmesi ve profil bazında eklenme nedeni raporu açık işlerdir. Çatı aracı hâlâ düz panel ızgarasıdır. Kesme/ezme ertelenmiş kapsamda kalır.
