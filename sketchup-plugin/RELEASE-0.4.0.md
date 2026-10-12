# Prefabrikten Karkas 0.4.0 — panel dönüşümü prototipi

Extensions → Prefabrikten Karkas 0.4.0 menüsünden kök seviyede seçili duvar, çatı veya döşeme grupları dönüştürülür. Kaynaklar korunur, yeni karkas varsayılan 200 mm ötede oluşturulur. Tek işlem geri alınabilir. En fazla 20 kaynak panel; her kaynak tek dikdörtgen panel olmalı. En büyük uygun yüz panel sınırı kabul edilir: çok duvarlı bina grubu seçilmemeli. Eğik/L sınırlar ayrı dikdörtgen panellere ayrılmalı. İç dikdörtgen yüz delikleri açıklık olarak okunur; zemine açık kapı çentikleri otomatik okunmaz, dikdörtgen sınır üzerinde iletişim kutusuna x/kot/en/boy girilir.

Yeni duvar paneli komutunda boyut, C gövdesi, sac, kaplama/yön, azami aks, çapraz düzeni, üst ilave kayıt ve açıklıklar girilir. Dikmeler, levhaların kenar/orta hatlarına göre; ara kayıtlar levha boyunun kenar/orta hatlarına göre yerleşir. Son kesilen levhanın ortası da desteklenir. OSB 1220×2440, alçıpan 1200×2500, BoardeX 1200×2400, kullanıcı tarafından doğrulanan Betopan 1250×2500×10 mm ve özel ebat desteklenir. Çaprazlar düşey gözler boyunca yön değiştirir; açıklığa rastlayan gözde oluşturulmaz. İki yüzün farklı levhalarını birlikte çözme, şaşırtmalı levha başlangıcı ve otomatik vida yerleşimi henüz yok.

Kapı/pencere için çift yan dikme, taslak tek C başlık ve pencere denizliği oluşturulur; kapıda alt kayıt boşluğu bırakılır. Başlık kesiti yük hesabıyla seçilmez. Çatı/döşeme dönüşümü panel düzlemindeki ızgaradır; makas, birleşim veya aşık mühendisliği çözümü değildir.

Statik projeden azami aks ve referans girilirse daha küçük aks uygulanır. Bu işlem statik hesap/onay değildir. Statik yeterlilik, rüzgâr/deprem, sehim, burkulma ve bağlantı kapasitesi hesaplanmaz. Desteksiz levha hattı veya yakın dikmeler uyarı olarak raporlanır; tüm katı çakışmaların çözümü yapılmaz. Kesme/ezme kullanıcı kararıyla ertelendi; boylar imalat boyu değildir. Dudak/büküm ayrıntıları prototip kesit olarak kalır.

Seçili karkas için SVG taslak görünüş, JSON parça/metraj veya CSV özet kaydedilir. Mevcut dosya üzerine yazılmaz. Yeni sürümde elle değişen profil geometrisi, panel ölçeği veya silinen/eklenen parçalar dışa aktarımı durdurur. Eski 0.3 kayıtları doğrulanmış imalat listesi sayılmaz.

Kontroller: gerçek Ruby 3.2.11 ile 120 yerleşim senaryosu, açıklık/aks sınırı/çapraz/Betopan ve hata durumları geçti; önceki panel testleri geçti; 35 kesit ve 175 geçme hesabı geçti. Paket Ruby sözdizimi derlendi. SketchUp içinde yeni dönüşüm, yön, geometri ve menü denemesi henüz yapılmadı. Oluşturma sırasında katılık ve dış ölçü kontrolleri çalışır; hata bütün yeni işlemi geri alır. Açık kullanıcı modelleri değiştirilmedi veya kapatılmadı.

İlk kabul denemesi: kaydedilmiş modelin ayrı bir kopyasında tek dikdörtgen 1500×2500 duvar seçin; alçıpan/dikey/600 mm aks ile oluşturun. Kaplama hatları, açıklıklar, çapraz yönleri ve kaynak yüz yönü görsel/ölçülü doğrulanmadan imalatta kullanmayın. Yeni dosyalar yeniden SketchUp açıldığında yüklenir.
