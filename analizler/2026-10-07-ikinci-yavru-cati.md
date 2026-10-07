# İkinci yavru çatı bağlantısı — 5.9.60 / DEV-046

7 Ekim 2026, iş bilgisayarı. Kaynak: referanslar/2026-10-07-makas-kose-u/06-ikinci-yavru-reddi.png. Orijinal korundu; SHA-256 envanteri 2026-10-07-makas-kose-kaynaklari.json içinde.

Görselde ikinci çizimin başlangıcı ilk yavrunun dış kenarındadır. Eski hedef listesi yalnız ana çatıları içeriyor, doğrulama da yavrunun başka bir yavruya bağlanmasını reddediyordu. Ana çatıdan uzak sayılan ilk nokta seçilemiyordu. Bu durum tüm ikinci yavru çizimlerinin yasak olduğu anlamına gelmez; aynı ana çatıya kardeş bağlantı ile bir yavrunun devamına bağlantı farklı durumlardır.

Düzeltme: Bağlanacağı çatı listesi mevcut ana ve yavru bölümleri içerir. İlk tıklama yakalama mesafesindeki en yakın çatı kenarını seçer; eşit mesafede listedeki tercih korunur. Etikette bölüm adı görünür. Kabul edilen ilk tıklama hedefi taslağa kaydeder; sonraki üç nokta aynı hedefte kalır. Mevcut veranda özel bağlantıları bu listeye eklenmedi. Kot/eğim, dik U ve gerçek kesişim kontrolleri korunur.

Model ana → yavru → yavru ilişkisini saklar. Yeniden hesaplama dosyadaki sıra yerine önce bağlı olunan çatıyı çözer. Eksik hedef ve bağlantı döngüsü reddedilir. Yeni U doğrulamasına tüm çatı grubu dahil edilir; plan/kesit/3B/metraj aynı nesneleri kullanır.

Kontroller: roof-child-chain gerçek tıklamalarla ilk yavru, onun dış kenarına ikinci yavru ve tekrar ana çatıya üçüncü yavru; listede yanlış eski hedef seçiliyken otomatik yakalama; undo/redo, JSON, ters kayıt sırası, döngü reddi geçti. Görsel artifacts/roof-child-chain.png incelendi. roof (20 kontrol), roof-child-snap, roof-child-u, roof-workflow, production-direction, roof-directions, roof-gable-boundary, loading-list geçti. Yeni test paket testlerine eklendi. Build 5.9.60.

Canlı kullanıcının çizimi değiştirilmedi. Ekran örneğine benzer kontrollü model sınandı; son canlı JSON doğrulanmadı (DEV-043 açık). Her kot/eğim birleşiminin üretilebilirliği garanti edilmez; fiziksel olarak geçersiz birleşimler reddedilir. Önceki mesnet/imalat açık işleri devam eder.
