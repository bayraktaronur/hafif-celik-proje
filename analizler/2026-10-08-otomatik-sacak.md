# Otomatik saçak kotu ve Alın V ayrımı — 5.9.85

Kullanıcı artık ayrı oturtma işlemi istemiyor. Ana/yavru çatı saçak alt ucu her seferinde duvar üst kotuna oturacak; Alın V üst yüzeyi örtüden1–2cm yukarıda olacak. Altı referans görsel kaynak/hash envanteri referanslar/2026-10-08-otomatik-sacak altında.

RoofStudio.seat bağımsız ana/yavru bölümlerde datum=trim,h=wallTop,fasciaDepth=12 uygular. Yeni oluşturma, synchronize ve JSON/undo yükleme ortak kuralı kullanır; tüm bölümler bağlanmadan önce normalleşir. Eski eave/wall kayıtları da kullanıcı talebiyle bu kurala geçirilir. Önceki 'eski kotu koru' kuralı bu taleple değişti. Ayrı veranda attachment montaj kuralı korunur.

Oturtma düğmesi, sol saçak kot girişi, sağ kot referansı/referans kotu ve bağımsız kapama yüksekliği ayarı kaldırıldı. Duvar üst kotu yapısal bölüm bilgisi olarak kalır. Alın V üst kanadı örtü+1.5cm; alt kanat örtü-12cm konumunda tutulur; böylece alt uç duvar kotunda kalır. Düşey görsel bağlantı13.5cm olur; bu değişiklik üst kanat çakışmasını giderir, yeni büküm açınımı hesabı değildir. Saçak yatay taşmaları değişmez.

Kontroller: roof-auto-seat gerçek Proje11de üç bölümün otomatik trim/wallTop eşitliğini,250altkotunu,1.5cm üst açıklığını, kaldırılan kontrolleri ve baş makas kapanışını doğrular. omega-real-project, roof-child-chain, roof-soffit, roof-eave-types, roof-trims, roof-trim-datum geçti. Eski düğme/12cm görsel yüz beklentileri yeni kurala uyarlandı. İki bağımsız görünüş üretildi; sol görünüş incelendi. Canlı sekme ve orijinal JSON değiştirilmedi.

DEV-069 tamamlandı. Metrajda ek Alın V büküm/stok hesabı eklenmedi; DEV-067 ve diğer açık işler sürer.
