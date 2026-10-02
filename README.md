# Prefabrikten Plan Studio · 5.9.30

5.9.30: Kullanıcı kuralıyla makas altına gelmeyen dış duvar H bağlantıları kulaksız–dübelli sınıflandırılır. Makas verisi/mesneti belirsizse kontrol bekler; iç duvar kuralları henüz tamamlanmadı.

5.9.29: Yükleme listesinde makas altında H kulaklı, dış duvardaysa ayrıca dübelli sınıflandırılır. Makas açıklığı ve yerel dış duvar kontrol edilir; tanımlanmamış diğer H kuralları bekler. [Sonuçlar ve açık farklar](analizler/2026-10-03-h-kulak-dubel.md).

5.9.28: Yükleme listesi ilk aşaması. Çizimden panel, bağlantı ve kapı/pencere sayımı; filtreleme, gerekçeli manuel sevk taslağı, Tuna Excel referans satırlarıyla karşılaştırma, CSV indirme. Ayarlar JSON/geri alma/kurtarmada korunur; ilgili kaynak değişince eski miktar yeniden kontrol ister. Stok pano/kesim, kulak/dübel, PVC sipariş ve diğer üretim reçeteleri henüz tamamlanmadı. [Kullanım ve sınırlar](analizler/2026-10-03-yukleme-listesi-ilk-surum.md).

5.9.24: PDF ve PNG ortak çıktı ekranında antetli/antetsiz, dikey/yatay/otomatik yön ve en uygun standart ölçek seçenekleri. İki yerleşim önizlemesi ve tıklayarak büyütme. Antet firma/logosu, müşteri, adres, proje no, tarih, çizen, kontrol eden, revizyon, pafta, not ve iletişim alanları; sistem, yükseklik, duvar kalınlığı ve aks alanları plandan gelir. PNG/JPG/WebP logo PNG'ye dönüştürülerek JSON'a gömülür; resmi logo verilmezse firma adı kullanılır. Alan düzenlemeleri Bilgileri projeye kaydet veya çıktı indirme sırasında kaydedilir; iptal değişiklikleri uygulamaz. PNG çözünürlük bilgisi pHYs içinde yazılır. Prefabrik dış yükseklik alanı gizlenir; eski dy değeri korunur, prefabrikten hafif çelik aktarımında iç/dış yükseklik kat yüksekliğinden alınır. Alçıpan fire ayarı Metraj Listesi'ne taşındı. PDF/DWG/DXF içe aktarma bu sürümde eklenmedi.

5.9.23: Ölçekli PDF ve 1:1 mm DXF kat planı çıktısı. PDF'de A4–A0, yön ve 1:20/50/100/200 seçilir; taşma reddedilir, otomatik küçültme yapılmaz. PDF yüksek çözünürlüklü raster görseldir (A4–A2 300, A1 200, A0 150 dpi), yazdırma %100/Gerçek boyut olmalıdır. DXF duvar açıklıkları kesilmiş konturlar, bağlantılar, donatılar ve ayrı katmanlarda düzenlenebilir çizgi/yazı içerir; ölçü yazıları cm, geometri mm'dir. Eğriler çoklu çizgiler, ölçüler bağımsız çizgi/yazıdır; parametrik CAD nesneleri değildir. DWG/PDF/DXF içe aktarma ve doğrudan DWG yazma henüz yoktur. JSON düzenlenebilir ana proje kaydı olarak korunmalıdır.

5.9.22: Alan seç / Ctrl+A, Ctrl+C kopyala, Ctrl+X kes, Ctrl+V konumlandırarak yapıştır. Plan Studio panosu Yeni/Aç ve aynı tarayıcı kaynağında yeniden açma boyunca korunur. Duvarlar kapı/pencereleri ve bağlı panel hattıyla taşınır; yeni kimlikler, oda türleri, metin/tefriş/tezgâh/çatı bağlantıları korunur. Kes/yapıştır geri alınabilir; mevcut duvarla çakışma engellenir. Bu pano Windows/AutoCAD panosu veya iki bilgisayar arası eşitleme değildir.

5.9.21: Mevcut veranda ölçüsüne çift tıklayarak veya özelliklerden net ölçü düzenleme; başlangıç/bitiş/merkez sabit seçenekleri. Bağlı dik sınırlar birlikte taşınır, ev duvarları korunur. Ev bağlantısında gerekli dik kademe önceden bildirilir; çakışan veya ters dönen kenarlar reddedilir. Geri alma ve JSON desteği.

5.9.20: Metin (T) komutu ile çok satırlı plan notu ekleme, boyut/açı seçimi, sürükleyerek taşıma, çift tıkla düzenleme ve silme. Metinler JSON, yerel kurtarma, geri/ileri alma ve PNG çıktısında korunur; imalat metrajına katılmaz.

5.9.19: Drawing1.dwg referansındaki 52,75 / 71,375 / 102,75 / 166 cm yerleşimler için 520 / 710 / 1020 / 1660 mm kesim eşlemeleri eklendi. Genel sabit pay çıkarma kuralı uygulanmaz. İş JSON'u ile ölçülü karşılaştırma ve orijinalleri değiştirmeyen ayrı kontrol taslağı hazırlandı: [karşılaştırma raporu](analizler/2026-10-02-tuna84-karsilastirma.md). Bu teslim bir üretim onayı değildir; makas/H mesnet, ürün listesi, kapı boşluğu ve çatı/tesisat ayrıntıları raporda açık tutulur. Mevcut kullanıcı çizimleri kendiliğinden dönüştürülmez.

5.9.18: Kat planı ve çatı planından makas yönü değiştirilirken mevcut duvar koordinatları, köşe payları, panel dizilimleri ve açıklıklar korunur. Otomatik paneller mevcut ölçüleriyle açık dizilim olarak saklanır; yön değişimi artık 10 cm gibi yeni panel artıkları üretmez. Çatı geometrisi ortak yönle güncellenir; H mesnet uyumsuzluğu Plan kontrolünde uyarılır. Elle taşınmış makasların önce otomatik aksa döndürülmesi gerekir. Dikdörtgen ve girintili plan, iki arayüz, geri/ileri alma ve JSON yeniden açma testleri eklenmiştir.

5.9.16: Tefriş yerleştirme ve taşıma sırasında yakındaki ürünlerin dış kenarlarına ve merkezlerine ekran mesafesine göre hizalama eklenmiştir. Geçici kesikli kılavuzlar yalnız çalışma görünümündedir. Yerleştirme penceresi ve seçili ürün panelindeki Kenar / merkez hizalama tikiyle kapatılabilir (oturum ayarı). Alt + sürükle ürünü özgün ölçü/dönüş/aynalama bilgileriyle yeni kimlik altında kopyalar; asıl ürün korunur. Kilitli üründen alınan kopya kilitsizdir. Alt + yalnız tıklama kopya oluşturmaz; Esc vazgeçer. Sağ panelde Kopyala düğmesiyle tıklayarak yerleştirme de vardır. Shift taşımanın sabit eksenini korur. Tezgâha bağlı ilk yerleştirme ve buzdolabı arka hizalaması önceliklidir. Tek adım geri al/ileri al ve JSON kaydı test edilmiştir.

5.9.15: Otomatik yerleşimde açıklık başlangıcı olan t değeri artık merkez gibi kullanılmaz; kapı/pencere merkezi t × duvar boyu + açıklık eni / 2 ile hesaplanır. Kapının tüm açıklığı ve oda tarafındaki kanat/geçiş alanı ürünlerden korunur. Aynı düzeltme tezgâhın kapı çakışma kontrolüne uygulandı. Yatak ve komodin pencere önünde yerleşebilir; gardırop gibi yüksek ürünlerde pencere kısıtı sürer. Mevcut ürün veya tezgâh kapı önünü kapatıyorsa öneri oluşturulmadan açık uyarı verilir, kayıtlı eşyalar kendiliğinden taşınmaz. Dört duvar yönünde kapının uzak kenarı, pencere önünde yatak/komodin, mevcut çakışmalar ve tezgâh sınırı test edildi.

5.9.14: Yatak odası önerileri yatak, gardırop ve komodinleri birlikte arar. Katalogdaki yatak dış ölçüleri, 150/200/240 × 60 cm gardıroplar, 45/50 × 40 cm komodinlerin iki taraflı ve tek taraflı kombinasyonları değerlendirilir. Duvar uçlarına ek olarak kapı/pencere kenarlarından yerleşim adayları oluşturulur. Komodin düzeni Tümü / İki / Sol / Sağ / Komodinsiz seçilebilir; yatak odalarında en çok sekiz alternatif sunulur. Gardırop sığan çözüm varsa gardıropsuz alternatifler elenir. Hiçbir gardırop sığmıyorsa eksik açıkça bildirilir. Mevcut yatak/komodin/gardırop korunur, eksik parçalar eklenir; mevcut yatağın kullanım alanı korunur. Arama katalog ölçüleri ve belirli konum adaylarıyla sınırlıdır; tüm olası mobilya/geometri çözümlerinin garantisi değildir. Yaklaşık 386,5 × 320 cm, iki pencereli ve sağ alt kapılı regresyon odasında iki komodin + 150 cm gardırop doğrulandı.

5.9.13: Tefriş menüsü tek/çift kişilik yatak, gardırop, vestiyer, sehpa, TV ünitesi, berjer, ikili/üçlü koltuk ve komodin için sade vektör semboller sunar. Hazır dış ölçü seçenekleri ve özel en/derinlik girişi vardır; planda ölçü yazılmaz. Yer kilidi taşıma, döndürme ve ölçü değişimini engeller; silme açık kullanıcı komutudur. Yatak/çocuk/ebeveyn odası, salon/oturma, giriş/hol ve mutfakta en çok dört otomatik alternatif üretilir. Salon + mutfakta bölüm seçilir; mutfakta düz/L seçilebilir. Önizleme ve Uygula ayrı adımlardır. Mevcut eşyalar silinmez veya taşınmaz; eklenen grup tek adımda geri alınır. Öneriler net oda iç sınırını, mevcut eşyaları, kapı önünü, büyük ürünler için pencere erişimini, ürün kullanım boşluklarını ve 20 cm örnekleme ile 60 cm dolaşım alanını kontrol eder. Bu değerler ayarlanmış tasarım kabulleridir, mevzuat uygunluk raporu değildir. Sığmayan parçalar listelenir. Banyo/WC, eğik duvarlar ve içe uzanan serbest duvarlı odalar otomatik kapsam dışıdır; elle yerleşim devam eder. Bu sürüm 2B plan tefrişidir; 3B mobilya ve tesisat üretmez.

Tefriş ölçü kaynakları: [MALM dış ölçü 105 × 209 cm](https://www.ikea.com.tr/urun/malm-luroy-beyaz-90x200-cm-tek-kisilik-karyola-19009562), [SAGESUND dış ölçü 166 × 215 cm](https://www.ikea.com.tr/urun/sagesund-beyaz-160x200-cm-cift-kisilik-karyola-00559371), [KIVIK ikili 190 × 95 cm](https://www.ikea.com.tr/urun/kivik-mila-acik-bej-2-li-kanepe-00010123), [LACK sehpa 90 × 55 cm](https://www.ikea.com.tr/urun/lack-beyaz-90x55-cm-orta-sehpa-90449905), [TV ünitesi 180 × 40 cm](https://www.ikea.com.tr/urun/rannas-siyah-180x40-cm-tv-sehpasi-30506753). 2 Ekim 2026 tarihinde kontrol edildi. Semboller genel tasarımdır; diğer ölçü seçenekleri değiştirilebilir planlama varsayılanlarıdır, evrensel standart veya birebir marka çizimi değildir.

5.9.12: Buzdolabı ilk yerleştirmede ve normal sürükleme/Taşı işleminde yakındaki tezgâhın yönüne ve arka kenarına otomatik hizalanır; ön yüz oda tarafındadır. 70 cm derinlik, 60 cm tezgâhtan 10 cm taşar. Shift ile taşıma mevcut eksen kilidini korur. Buzdolabının tezgâhla örtüşen gerçek taban alanı, düz veya L tezgâh sınırından çıkarılır; buzdolabı taşınınca/silinince eski alan geri gelir. Ana tezgâh sınırı ve buzdolabı kayıtları korunur; kesilmiş sınır aynı kayıtlardan türetilir, seçim ve PNG de bu sınırı kullanır. Geri alma ve JSON tekrar açma desteklenir. Eski buzdolaplarının konumu kendiliğinden değiştirilmez; yeni hizalamayı uygulamak için tezgâha yakın taşıyın.

5.9.11: Mutfak menüsünden duvarın oda tarafına tıklayarak 60 cm derinlikte düz veya L tezgâh oluşturulur. Başlangıç boşluğu, ana kol ve dönüş uzunluğu girilir; önizleme başlangıç ucunu gösterir. Derinlik duvar iç yüzünden alınır, L köşesi tek sınırdır; duvar boyunu aşma ve kapı açıklığına taşma engellenir. Ocak (60 × 50), evye (46 × 46) ve buzdolabı (75 × 70) boyutlarında ölçüsüz plan sembolleri eklendi. Ocak/evye ilk yerleştirmede yakındaki tezgâh kolunun ortasına ve yönüne hizalanır; buzdolabı serbest yerleşir. Tezgâha tıklayınca seçilir, sağ panelden veya Delete ile silinir. Kaydet/aç, yerel yedek, geri al/ileri al ve PNG desteklenir. Tezgâh ve ürünler bağımsız plan nesneleridir: duvar değişirse tezgâh yeniden yerleştirilmelidir; bağlı hareket, 3B dolap, tesisat ve üretim metrajı henüz yoktur.

5.9.10: Vitrifiye ekle menüsüne sabit 60 × 60 cm çamaşır makinesi eklendi. Plan ve PNG üzerinde yalnız Ç.M etiketi görünür. Taşıma, döndürme, aynalama, geri alma ve JSON kaydı mevcut donatı sistemiyle çalışır. Bu sembol tesisat hattı üretmez.

5.9.9: Seç aracında oda etiketine veya odanın boş alanına çift tıklayınca hızlı oda türü seçicisi açılır. Salon, yatak odası, mutfak ve diğer türlere tek tıkla sınıflandırma uygulanır ve pencere kapanır. Özel ad alanı korunur; yalnız isim değiştirmek için Özel adı uygula kullanılır. Esc değişiklik yapmadan kapatır, Ctrl+Z işlemi geri alır. Etiketler gizliyken oda içinden seçim ve mevcut etiket sürükleme davranışı korunur.

5.9.8: H ekleri, üçlü/dörtlü bağlantılar, çektirme U ve köşe direkleri tüm görünümlerde ve PNG çıktısında daima çizilir; gizleme tikleri kaldırılmıştır. Eski dosyalardaki gizleme tercihleri bu bağlantıları gizlemez. Müşteri sunumunda kapı/pencere etiketi ad yerine en/yükseklik (ör. 80/205) gösterir. Nesnelerin kayıtlı adları korunur; isim görünüm filtresi kaldırılmıştır.

5.9.7: Görünüm tikleri doğrudan açıktır. Müşteri sunumu kapı/pencere isimlerini ve bölme duvarlarının ana duvara bağlandığı hizalar arasındaki mimari ölçü zincirlerini gösterir. Zincirin uçları dış yüzler, ara noktaları bölme akslarıdır; net oda iç ölçüsü değildir. Toplam dış ölçüler ayrı sırada kalır. Panel ölçüleri ve bölme hizası ölçüleri bağımsız tiklenebilir; birlikte açıkken ayrı sıralara yerleşir. Panel ölçülerini kapatmak bölme hizası ve dış toplam ölçülerini açar; bunlar ayrıca kapatılabilir. İsimler ve kapı/pencere boyutları ayrı filtrelerdir. Model ve metraj değişmez.

5.9.6: Üst araç çubuğundan ve sağ panelden Müşteri sunumu, Çizim · sade, Panel / montaj detayı, Makas yerleşimi ve Tüm detaylar görünümleri seçilebilir. Görünüm filtreleri oda yazılarını, dış/iç toplam ölçüleri, ölçü zincirlerini, açıklık ölçülerini, panel numara/renk/eklerini, bağlantı işaretlerini ve makasları bağımsız yönetir. Filtreler yalnız çizimi etkiler; geometri, metraj, üretim yönü ve yakalama ayarları değişmez. PNG aynı filtreleri kullanır; JSON kaydı ve geri alma görünüm ayarlarını korur. Eski dosyalar mevcut görünürlükleriyle açılır. Panel / montaj detayı mevcut plan gösterimidir, yeni bir imalat veya montaj dosyası üretmez.

5.9.5: Çoklu panel birleştirmede iki 62,75 cm yarım panelin ortasındaki tek dik T kolu, 125,5 cm tam panele çektirme U ile bağlanabilir. Ortadaki üçlü H bağlantısı çizimde ve metrajda gelen duvar kalınlığındaki U bağlantısına dönüşür; ana duvar geometrisi, gelen kapılı duvar, kapı, karşı paneller ve makas konumları korunur. Dörtlü bağlantılar, merkez dışı birleşimler ve seçili panellerin kendi kapı/pencere açıklıkları bu dönüşümde engellenir. Otomatik panel toparlama mevcut T bağlantılarını kendiliğinden dönüştürmez; dönüşüm yalnız açık panel seçimiyle yapılır.

5.9.4: Panel seçiminde Ctrl + tık (Mac: Cmd + tık) seçime panel ekler/çıkarır; Shift + tık aynı duvarda aralık seçer. Seçilen paneller vurgulanır ve toplam boyları gösterilir. **Panelleri birleştir** yalnız aynı duvardaki bitişik iki boş yarım/kısaltılmış paneli birleştirir; karşı duvarlar ve makaslar korunur. Kapı/pencere veya duvar bağlantısı bulunan, bitişik olmayan ya da farklı hatlardaki seçimlerde neden gösterilir. İşlem geri alınabilir. Önceki/sonraki yön düğmeleri yerine açık panel seçimi kullanılır.

5.9.3: Ana köşeye yakın U bağlantısında yan saçak ortak kenarda sınırlandırılır; çift offset nedeniyle geçerli bağlantı reddedilmez. Dört adımlı çizim rehberi, nokta sayısına göre etkinleşen Çatıyı oluştur ve Son çizim noktasını sil düğmeleri eklendi.

5.9.2: Aynı ana çatıya hem eğimli yüzeyden saplanan hem alın kenarına dayanan yavru çatı eklenebilir. Alın bağlantısında ana yüzey boyunca olmayan yükseliş aranmaz; U doğrultusu korunur ve iki çatı arasındaki kot farkı 3B betopan yüzeyiyle kapanır. Birinci yavru dururken ikinci U çizimi, dört dönüş, ters çizim, geri alma ve kayıt/açma testleri eklendi.

5.9.1: Yavru çatı, aynı ana saçak kenarında başlayan ve biten dört köşeli açık U ile çizilir. Ana kenara yakalama ve saplanma yönü otomatiktir; mesnet alanı ile ana yüzeye uzatılan kaplama ayrı tutulur. Beşik ve tek eğimli U bağlantısı desteklenir; kesişmeyen kot/eğim, farklı kenarlarda biten U ve kırma U bağlantısı açıklamalı olarak reddedilir. Eski kapalı sınırla çizilen yavrular değiştirilmez; yeni bağlantı için U yöntemiyle yeniden çizilir. Duvar üzerindeki çatıya kadar kalan alın yüzeyleri 3B betopan görünümüyle kapatılır (görsel kapama, üretim metrajı değildir).

5.9.1: Çatı ekranında **Sınırdan çatı çiz** ile saçak, tip, kot ve eğim seçilip duvar dış yüzü köşelerine/hizalarına yakalanarak kapalı mesnet sınırı çizilir. İlk köşeye tıklama veya Enter kapatır; Backspace son köşeyi, Escape taslağı kaldırır. Yatay/dikey, 4–40 köşeli sınırlar desteklenir; kendisiyle kesişen sınır veya saçağı nedeniyle kapanan dar girinti reddedilir. Mesnet ve saçak sınırları ayrı saklanır; dış kenar saçak mesafesi değişimi mesnedi değiştirmez. Bağlı duvar köşesi sonradan taşınırsa çatı özelliklerinde yeniden çizim uyarısı görünür.

Yavru çatı kendi sınırı, saçağı, ana çatı bağlantısı ve aynı/dik makas dizilimiyle oluşturulur. Ana çatıyla örtüşen yüzeyler aynı grupta birleştirilir; bağlantı kenarında ilave saçak üretilmez. Kullanıcı birleşim sınırını ana çatı yüzeyine kadar çizer. Girintili kırma çatılar, sınır içindeki en büyük dikdörtgen kırma bölümlerinin üst yüzey birleşimiyle hesaplanır; dere ve mahyalar bu bileşik çözümden çıkar.

Kat planındaki yön düğmesi ve çatı ekranındaki ortak yön ayarı artık birlikte çalışır; uyumsuz panel düzeninde işlem durur, duvar ölçüsü değiştirilmez. Önceki dört köşeli çerçeveyi otomatik büyüten yön değişimi kaldırıldı. Elle taşınmış makas varken yön değişimi önce otomatik aksa dönüş ister. Bölgesel makas aksları iki planda, metrajda ve çelik aktarımında aynı kaynaktan üretilir; mesnet bulunamayan akslar kontrol etiketi taşır. Bu gösterim taşıyıcı kesit/bağlantı hesabı değildir. Bölüm sınırları, saçaklar, yön bağlantıları ve bölgesel elle makas konumları kayıt ve geri alma kapsamındadır.

5.8.2: Kademeli duvar çiziminde ters yönlü köşe dönüşü ortak H aksını korur; fazladan köşe payının oluşturduğu 52,75 cm kalıntı giderildi. Duvar önizlemesi köşe düzeltmesini ve gerçek panel dizilimini kullanır. Mevcut kayıtların geometrisi kendiliğinden değiştirilmez.

5.8.1: Çatı planı altlığında veranda sınırları, kat planındakiyle aynı kesik çizgi oranıyla gösterilir. Gerçek duvarlar düz çizgi kalır; aynı çizim PNG çıktısına da yansır.

5.8.0: Her çatı bölümünün üst örtüsü altında bağımsız OSB, nem bariyeri ve membran katmanları seçilebilir. **Alt kaplama katmanları** kutularını işaretleyip ürün ölçüsü, en/boy bindirmesi ve ek sipariş fire yüzdesini girin; oklarla üstten alta sıralayın. Üst örtüyü değiştirmek alt katmanları silmez. Varsayılan giriş ölçüleri OSB 122×244 cm, rulolar 100×1000 cm ve sıfır bindirmedir; bunlar ürüne göre düzenlenmelidir. Her kesim parçası için bir stok plaka/rulo ayrılır; artıkların yeniden kullanımı optimize edilmez, ek fire bu adede uygulanır.

**Kaplama yerleşimi** ve yanındaki katman seçimi, gerçek birleşim sınırlarında kesilen numaralı parçaları gösterir. Üst örtü levhalarının numaraları kesim listesi / CSV ile aynıdır; alt katmanlarda numaralar bölüm ve katman içinde verilir. OSB / rulo kesim taslakları ve sipariş adetleri çatı raporuna, genel metraja, CSV ve hafif çelik JSON aktarımına girer. Katman sırası ve seçimler proje / geri alma ile saklanır. Shingle ve diğer paket/m² örtüler paket alanıyla hesaplanır; ürünün tekil parça geometrisi tanımlanmadığı için hayali levha şeması çizilmez. Eski global OSB seçimi, katman listesi henüz bulunmayan bölümlerde korunur; açık katman listesi varsa yalnız o liste geçerlidir. 3B üst örtüyü gösterir; alt katmanlar plan seçicisinden incelenir.

5.7.4: Beşik veranda betopan alını direk aksına alındı; ön saçak örtüsü varsayılan 30 cm öne taşar ve mevcut ön saçak ayarıyla değişir. Açık dış çatı kenarlarına 3B alın/saçak bandı eklendi (varsayılan düşey yükseklik 15 cm; bölümden 0–50 cm, 0 gizler). Mahya ve dereye bant eklenmez; parapetli kenarlarda gösterilmez. Bant yalnız görseldir, kaplama metrajı ve kot/ön açıklık hesabını değiştirmez.

5.7.3: Veranda çatısı gerçek ana çatı yüzeyine bağlanır. **Karga burun**, aynı düzlem ve eğimin verandaya devamıdır. **Beşik**, mahyası ana yüzeyle kesişene kadar uzatılır; aynı grupta gerçek dere birleşimi ve tek kaplama alanı hesaplanır. **Sundurma**, ana saçağın altında ayrı başlar; başlangıç farkı (ilk değer 10 cm), eğim (ilk değer %5) ve minimum ön açıklık (ilk değer 210 cm) düzenlenebilir. Bunlar kullanıcı proje ayarlarıdır. Ön açıklık çatı düzlemine göre hesaplanır, malzeme / kiriş kalınlığı dahil değildir. Sundurmada minimumun altındaki değişiklik geri alınır; karga burunda düşen kot ayrıca bildirilir ve ana çatıdan düzeltilir.

Veranda çevresi 3B'de dolu duvar değildir. Serbest ön köşelerde 10 × 10 cm direkler, beşik alın yüzeyinde betopan görünümü vardır. Bunlar geometrik gösterimdir; direk et kalınlığı, bağlantı ve betopan levha kesimleri kaplama metrajına eklenmez. Eski veranda kayıtları da açık gösterilir; yeni birleşim hesabına geçirmek için veranda ve ana çatıyı seçip **Veranda oluştur / güncelle** düğmesine basın. Bu düğme mevcut verandayı aynı kimlikle günceller. Ana çatı kot/eğim değişiklikleri bağlı çatıya aktarılır; kat planı veranda sınırları değişirse düğmeyle yeniden alınır. Elle çizim kontrolleri ayrı, kapalı **Elle ek çatı çizimi** bölümündedir. Otomatik veranda dikdörtgen alan ve uyumlu ana saçak yönü gerektirir; uyumsuz bağlantı açık hata ile reddedilir.

5.7.2: Dikdörtgen çatı yönü 90° / 180° düğmeleriyle sınırları ve saçak konumlarını koruyarak değişir. Kat planı değişmez. Bağlı veranda yönü ana saçak bağlantısından belirlenir; serbest çatı bölümlerinde yön düğmeleri kullanılabilir.

Kesitte duvar üstü, döşeme ve çatı referans kotları ayrı girilir. Yeni çatılarda en düşük saçak kotu esas alınır; eski kayıtlar duvar yüzünde çatı kotu hesabını korur. Örneğin eski hesapta 250 − 30 × 0,33 = 240,1 cm; saçak referansında kenar 250 cm kalır ve çatı düzlemi yükselir. İki katlı örnekte döşeme 300, duvar üstü 580 girilebilir. Kesit seçilen bölümün yerel Y doğrultusunu gösterir, bütün yapının birleşik mimari görünüşü değildir.

5.7.1: Model özeti yerine mimari özet gösterilir. Mekân türlerinin adetleri, yatak odası + salon anlamında konut tipi (ör. 4+1), kapalı aks alanı ve veranda aks alanı ayrı sunulur. Çocuk/ebeveyn odaları yatak odasına, ebeveyn banyoları banyoya dahil edilir; WC ve oturma odası ayrı tutulur. Salon + mutfak bir salon sayılır. Türü seçilmemiş mekânlar belirtilir; özel oda adlarından kullanım türü tahmin edilmez. Düğüm/segment sayıları mimari özetten kaldırılmıştır.

5.7.0: Üst araç çubuğundaki **Çatı planı** ayrı çatı çalışma alanını açar. Beşik, kırma, tek eğimli sundurma ve altı kenarlı çıkma çatısı bölümleri eklenebilir. Her bölümün konumu, dönüşü, duvar üst kotu, eğimi, saçakları, mahya yeri ve kaplaması ayrı saklanır. Plan, 3B kütle, bölüm kesiti, kaplama metrajı, levha şeritleri, PNG ve CSV aynı çatı modelinden üretilir. Kaydetme, yerel yedek, geri alma ve hafif çelik JSON aktarımı çatı bölümlerini içerir.

### Çatı kullanımı

1. **Çatı planı → Plandan ana çatı** ile dış duvarların dikdörtgen zarfını alın. Bu işlem L/T planı kendiliğinden çözmez; bu planlarda zarfı düzenleyin ve diğer hacimleri ayrı bölümlerle çizin. Bölüm boyutları dış duvar yüzlerinden, saçaklar ayrıca ölçülür.
2. **Elle ek çatı çizimi → Bölüm çiz** bağımsız çatı; **Birleşen bölüm çiz** seçili çatının grubunda birleşen çatı oluşturur. İki karşı köşeye tıklayın. Bölümü sürükleyebilir veya koordinatlarını yazabilirsiniz. Beşikte 0° mahya X, 90° mahya Y yönündedir. Eşit eğimli kırmada mahya uzun doğrultudadır. Tek eğim 0° iken +Y tarafı yüksektir.
3. Saçak varsayılan 30 cm, eğim %33. Dikdörtgende dört saçak ayrı girilir. Çokgen çıkmada tüm kenarlara ilk saçak değeri uygulanır. Kot referansı seçilebilir: yeni bölümlerde en düşük saçak, eski bölümlerde duvar yüzündeki çatı düzlemi. Duvar yüzü referansında saçak eğim boyunca bu kotun altına iner. Beşik mahya yeri %50 merkezdir; kaydırmak karşı eğimi değiştirir.
4. Aynı gruptaki yüzeyler kesiştirilir, üstte kalan örtü bir kez sayılır. Mahya/dere/kot farkı, gerçek düzlem birleşiminden çıkar. Bağımsız alt sundurmaları ayrı grupta bırakın: üst ana çatının altında kalan sundurma örtüsü de fiziksel olarak vardır. Eğimin verandaya devamı için yüzeylerin kot ve eğimini eşitleyin; koplanar iç kenar metraja girmez.
5. **Üst çatı örtüsü**: trapez ve metal kiremit 80/100 cm; sandviç ve tek kat panel 100 cm net kapatma eni. Boy varsayılan sınırsızdır. İstenirse azami boy, boy eki bindirmesi ve kesim boy ilavesi girilebilir. **Yeni kaplama türü** levha, paket veya m² üzerinden çalışan proje kataloğuna eklenir.
6. Shingle başlangıç ürünü [BTM Galaksi Klasik](https://www.btm.co/tr/btm-shingle-galaksi-klasik): 18 levhalık paket **2,52 m² bitmiş yüzey** kaplar, üretici minimum %20 eğim önerir (kontrol: 30.09.2026). Paket alanı ürüne göre değiştirilebilir. Aynı ürün ve paket alanına ait bölümler birleştirilip fire eklendikten sonra tam pakete yuvarlanır. Mahya/başlangıç shingle parçaları yüzey paketlerine dahil edilmez.
7. **Levha şeritleri**, seçili bölümün net enlerini ve yüz numaralarını planda gösterir. CSV her yüz/şerit/parça için en ve boyu içerir. Kesim taslağı şeridi örten en uzun dikdörtgen boyunu verir; üçgen artıklarının yeniden kullanımı, metal kiremit adım modülü ve bağlantı ayrıntıları optimize edilmez. Levha sipariş alanı tam en × boylardan hesaplanır; alan fire yüzdesi levha adedine tekrar uygulanmaz. Paket/m² ürünlerde fire kullanılır.

Parapet, çatıyı gizleyen görünüm yüksekliğidir; düzlemsel çatının eğimi ayrıca tanımlanır. Parapet kaplaması, iç süzgeçler ve taşma sistemi ayrıca projelendirilir. Kesit seçili bölümün kendi açıklık kesitidir; komşu bölümlerin birleşik kesiti değildir. 3B, çatı biçimini kontrol eden kütle görünümüdür.

Çatı modeli duvar/panel ve mevcut makas akslarını yeniden konumlandırmaz. Makas profilleri, yükler, mesnetler, aşıklar, birleşim plakaları ve vida yerleşimleri bu kaplama geometrisinden otomatik boyutlandırılmaz. Genel metrajdaki mevcut makas aksları bu nedenle “ek çatı bölümleri hariç” olarak ayrılır. Bölüm eklenmemiş eski dosyalar eski ön tahmin hesabını kullanır; yeni bölüm modeli tanımlanınca kaplama metrajı ve aktarım alanı yeni geometriyi kullanır. En fazla 24 çatı bölümü desteklenir.

### Fotoğraf analizi ve çizim karşılıkları

| Referanslar | Görünen çatı düzeni | Programdaki karşılığı |
|---|---|---|
| 4, 11, 12, 35 | İki katlı ana beşik + üst balkon beşiği; bazı örneklerde alt sundurma | Ana/çapraz üst çatı aynı grup, alt tek eğimler ayrı grup ve kot |
| 5 | Kırma ana çatı + girişte beşik; arkada bağımsız kırma | Kırma + döndürülmüş beşik aynı grup; arka yapı ayrı grup |
| 6 | Üst kırma, daha alçak yan hacim ve giriş çatısı | Her kotta ayrı grup; giriş biçimine göre beşik/kırma |
| 7 | Ana beşik eğiminin ön verandayı da örtmesi | Ana bölümün sınırını veranda dışına uzatma veya eş düzlemde devam bölümü |
| 8, 9, 17, 18, 19, 26, 27, 28, 32 | Farklı doğrultu veya kotlarda beşik hacimler, girintili verandalar | Döndürülmüş/kaydırılmış beşik bölümler; süreklilik varsa aynı, bağımsızlık varsa ayrı grup |
| 10, 15, 36 | Çoklu beşik hacimler, cephede çokgen pencere çıkmaları | Birleşen beşikler + altı kenarlı çıkma kırmaları, ayrı küçük çatı kotları |
| 13, 21, 24 | Ana çatıdan daha düşük giriş beşiği ve/veya uzun sundurma | Duvara bitişen düşük çatı grubu; tek eğim veya dar beşik |
| 14, 16 | Ana beşik altında çevreye dönen sundurmalar | Ayrı kotta birden fazla tek eğimli bölüm; gereken yerlerde ortak grup |
| 20, 37 | Dışarıdan düz görünen parapet/alınla gizlenmiş çatı | Parapetli bölüm; örtünün görünmeyen eğimi fotoğraftan kabul edilmez |
| 22 | Dört yönde saçaklı kırma | Kırma ana bölüm |
| 23 | Üst L biçimli beşik kütleler, altta camlı verandanın ayrı çatısı | Üstte birleşen beşikler, alt veranda için bağımsız grup |
| 25, 33, 34 | Birleşik kırma hacimler veya balkona uzayan kırma; alt sundurmalar | Aynı grupta kırma bölümler; farklı kotta sundurmalar ayrı |
| 29, 30, 31 | Çok düşük eğimli üst çatı ve alçak veranda | Üst örtünün tam biçimi fotoğraflardan kesinleştirilemez; 30 ve 31 tekrardır |

Fotoğraflardan yalnız biçim/topoloji sınıflandırıldı. Açıklık, saçak, kot, kaplama kalınlığı, profil ve bağlantı ölçüleri fotoğraftan türetilmedi. Çatı hesap testleri beşik/kırma/tek eğim, döndürme, asimetrik beşik, çapraz birleşim, aynı düzlemde devam, bağımsız alt çatı, çokgen çıkma, paket yuvarlama, levha bindirmesi ve proje dosyası gidiş-dönüşünü kapsar.

5.6.1: Vitrifiye yerleşimi, gerçek ürün boyutları, taşıma/döndürme/aynalama ve Shift ile eksen kilidi eklendi. Islak hacim ve veranda zeminleri ayrıştırıldı. Kapı/pencere ölçü etiketleri dış cephede dış tarafa yerleştirilir.

5.6.0: Kapı ve pencerelerde genişlik/yükseklik etiketi (80/125, 120/120 gibi) plan ve PNG çıktısında gösterilir. Etiketler duvar yönüne hizalanır, oda tarafına alınır ve birbirine yaklaşan etiketler için ek satır mesafesi kullanılır. Ölçü düzenlemeleri etiketlere doğrudan yansır.

5.5.15: Katalog görünüşü, aynı pencere tipinin tekrar seçilmesinde kaybolmaz; başka tipe geçilip katalog tipine dönülünce bölmeler geri gelir. Panel seçimindeki “Yalnız bu duvarda yer değiştir” düğmeleri iki boş komşu paneli karşı hatları veya makasları taşımadan değiştirir. Duvar birleşimleri ve mevcut açıklıklar korunur; yerel aks sapmaları Plan kontrolünde uyarı olarak kalır. P2 görünüşü ve yarım/tam değişimi ardından 120 × 120 pencere ekleme test edilmiştir.

5.5.14: 160 cm genişliğindeki prefabrik pencere için seçilen panel merkezinde 166 cm pano oluşturulur. Üç tam panel 105,25 + 166 + 105,25 cm olur; toplam boy, karşı duvar ve makas aksları korunur. Açıklık pano içinde iki yanda 3 cm payla yerleşir. Köşe/duvar birleşimini aşan veya mevcut açıklığı H üzerinde bırakan işlem geri alınır. Mevcut 160 cm pencere özelliklerindeki “166 cm panoya uyarla” düğmesi pencere konumunu koruyarak aynı düzeni uygular. Kaydetme/yükleme ve geri alma test edilmiştir.

5.5.13: Panel seçiminde “Bu konumda tam panel oluştur” aracı önceki/sonraki komşuyla toplam boyu koruyarak 125,5 cm panel ve kalan parçayı oluşturur. Yalnız seçili hat düzenlenir; makaslar ve karşı duvar korunur. Mevcut açıklık veya iki panel arasındaki duvar birleşimi taşınmaz; 10 cm'den küçük artık reddedilir. Bu açıkça seçilen yerel düzenleme için modül ölçüsü/aks sapması uyarı olarak kalır; genel çizim modu serbest yapılmaz. 120 cm pencerenin köşe payını aşmadan panelin kullanılabilir kısmına yerleşmesi de düzeltildi.

5.5.12: Kullanıcının sağladığı imalat görselinden 11 pencere ve 17 kapı seçeneği eklendi. P/P1–P7, V/V1; özel çift kanat ve sürgülü kapılar; sağ/sol alüminyum, sac, çelik, PVC, panik barlı ve Amerikan kapılar ölçüleriyle seçilebilir. Katalog kodu JSON dosyasında saklanır. Önizlemeler bölme sayısı, açılım çizgileri ve kapı detaylarını gösterir; plan görünümünde pencere bölmeleri de katalogdan çizilir. Özel ölçü ve son kullanılan seçim korunur.

5.5.11: Pencere eklerken son başarıyla kullanılan ölçü/tip tarayıcıda hatırlanır. Seçim listesi projedeki pencere ölçülerini ve özel ölçü girişini sunar; üretici kataloğu henüz tanımlı değildir. Ekleme penceresinde ve seçili pencere özelliklerinde oranlı şematik görünüş vardır. Plan açıklığı gerçek genişlikle, görünüş genişlik/yükseklik oranıyla çizilir; profil detayları üretim çizimi değildir.

5.5.10: H üzerine kapı eklenmesinden sonra kalan uygun yarım/kısaltılmış paneller eşlenen hatlarla birlikte birleştirilir. 62,75 + 62,75 → 125,5; 62,75 + 57,75 → 120,5 olur. 3'lü/4'lü bağlantı üzerindeki H kaldırılmaz; açıklıklı paneller otomatik birleştirilmez. Panel seçimindeki “Panel birleştir” düğmeleri kısaltılmış yarımları da destekler. Makas aksları ve duvar toplamı korunur; işlem tek adımda geri alınabilir.

5.5.9: Köşe direkleri dolu sarı kare yerine açık renk konturlu, içi boş 1:2 dikdörtgenle gösterilir. Uzun kenar makas yönüne dik döner; yerel köşe çevirme ayarı da korunur. Uzak görünümde en az 4 × 8 ekran pikseliyle okunur ve panel numaraları kapalıyken de görünür. PNG çıktısı aynı gösterimi kullanır.

5.5.8: Normal panel modunda, eş kalınlıklı dört köşeli dış çerçevenin makas yönü değişirken panel toplamı korunur ve dış ölçü yeni köşe payına göre değişir: 8 × 125,5 = 1004 cm; dış en 5 + 1004 + 5 = 1014 veya 10 + 1004 + 10 = 1024 cm. Bölmeli, elle panel dizilmiş veya farklı kalınlıklı çerçevelerde otomatik yön değişimi engellenir. Prefabrik çizim kuralı → “Özel durum · net dış ölçü gir” alanında dış en ve boy girilerek dört köşeli çerçeve özel ölçü modunda boyutlandırılabilir; kalan uç panel kesilir. Değişiklik geri alınabilir. Yeni duvar çiziminde aynı hat üzerinde tam, ters veya kısmi örtüşme ve mevcut kapı/pencere boşluğundan geçiş reddedilir; model ve metraj korunur. Bu koruma eski projelerdeki çakışmaları otomatik silmez.

5.5.7: Karşı hat panel eşlemesi, kaynak duvarın yerel uç yüzünü (ör. 5 cm U/köşe payı) diğer duvarda H sınırı yapmaz. Gerçek iç H ekleri ve duvarın aks uçları aktarılır; her hattın yüz payı kendisinde kalır. 120,5 + 125,5 + 62,75 diziliminde H üzerine 80 cm kapı eklenmesi, dizilimi 120,5 + 62,75 + 125,5 yapar. İç ve dış duvarların uç payları farklıyken oluşan 5 cm hayali panel hatası testle yeniden üretilip düzeltilmiştir.

5.5.7: Fare veya sayı ile çizilen prefabrik duvar, araç çubuğundaki kalınlığı korur (`kSabit`). Böylece planda başka kapalı odalar varken seçili 6 cm duvarın otomatik 10 cm'ye dönmesi ve sonraki köşede 1 cm artık panel üretmesi engellenir. Mevcut otomatik duvarlar değiştirilmez; özelliklerdeki “Kalınlığı otomatiğe al” seçeneği korunur. Hata, mevcut bina yanında ayrı 6 cm duvar çizilip dönülerek gerçek fare olaylarıyla yeniden üretilmiş ve doğrulanmıştır.

5.5.7: Kapı mevcut H noktasında eklendiğinde ve tam modül aynı duvar parçasına sığdığında, H çevresindeki iki panel bölünerek ortada 125,5 cm kapılı panel oluşturulur. Kalan yarımlar korunur; makaslar taşınmaz. Karşı hat eşleme ayarı uygulanır. Mevcut açıklıkla çakışan yeni H sınırları işlemi atomik olarak geri alır. Geri alma ve kaydetme/yükleme test edilmiştir.

5.5.7 ekleri: Prefabrik köşe yakalaması duvar ucunun dışından yaklaşmayı da kapsar; yüksek yakınlaştırmada ızgaraya düşme senaryosu test edilir. Duvar seçiminde mavi bölgenin bağlantılar arasındaki duvar parçası olduğu belirtilir ve panel seçimine geçiş düğmesi sunulur. Bildirilen 64,75 cm uyarısı proje geometrisi olmadan yeniden üretilememiştir; ölçü doğrulaması gevşetilmemiştir.

5.5.7: Yeni, serbest dış köşede panel adediyle belirlenen boyun uç payı korunur; basit dikdörtgenin son paneli gereksiz yere 120,5 cm olmaz. Mevcut karşı duvarın aksı veya açıkça seçilmiş kapanış hedefi varsa aks korunur ve gerekiyorsa uç panel kesilir. Karşı köşe aksı, panelin birleşim yüzüyle karıştırılmaz. Sayısal panel adedi ve fare yerleşimi aynı köşe mantığını izler. Yatay/dikey ve ters yönde dört köşeli çizim ile basamaklı karşı aks senaryoları test edilir. Eski düğüm koordinatları otomatik onarılmaz.

İmalat ölçüsü ayrımı: Kullanıcının referanslarındaki 1200 / 1220 / 625 / 590 / 570 değerleri net kesim ölçüleridir. Programdaki 125,5 / 62,75 cm modüller çizimde gösterilmeyen H payını içerir; ekrandaki panel yerleşim boyları doğrudan net kesim listesi değildir. Seçili duvar tablosu tanımlı ölçü çiftlerinde net kesimi mm olarak gösterir (125,5→1250; 62,75→625; 120,5→1200; 122,5→1220; 59,75→590; 57,75→570). Diğer özel boylar Tanımsız gösterilir; tüm ölçülerden sabit 0,5 cm çıkarılmaz.

Prefabrik panel ve hafif çelik kat planları için geliştirilmiş yerel çizim uygulaması. Özgün v5 çizim ve üretim motoru temel alınmıştır.

## Kullanım

- **Tek dosyalı sürüm:** `dist/plan_studio.html` dosyasını Edge veya Chrome ile açın. Ek kurulum ve internet gerekmez.
- **Geliştirme sürümü:** `plan_cizim.html` ile `src` klasörünü birlikte tutun. HTML dosyasını doğrudan açabilirsiniz.
- **Yerel önizleme:** Node.js ile `npm start`; ardından `http://127.0.0.1:4173` adresini açın. Sunucu yalnızca bu bilgisayara bağlanır.
- Yeni proje oluşturun veya önceki v5 JSON dosyanızı **Aç** ile yükleyin. **Örnek planı aç** ile çalışma alanını deneyebilirsiniz.
- **Kaydet** proje JSON dosyasını indirir. Tarayıcı yedeği ayrı bir kurtarma imkânıdır; dosya kaydının yerine geçmez. Başka tarayıcıya veya farklı adrese otomatik taşınmaz.

## Korunan üretim kuralları

- Dış köşede köşe direği önce gelir; bu düğüme gelen iç duvar ayrıca çektirme U ile bağlanır. İç duvarın 6 veya 10 cm olması dış panelden 3 veya 5 cm kesilmesine neden olmaz. Modelde iki dış duvarın köşe oluşturduğu ve iç duvarın bağlandığı düğümler bu şekilde hesaplanır; düz dış duvar üzerindeki normal T birleşimleri değişmez. Köşe direği ve U ayrı sayılır ve çizimde ayrı işaretlenir.

- Tam panel **125,5 cm**, yarım panel **62,75 cm**.
- Prefabrik dış ve iç duvar için bağımsız **6 / 10 / 15 cm** seçimi. Toplu düzenlemede dış, iç, tüm veya seçili duvarları hedefleyebilirsiniz; veranda sınırları değiştirilmez. Panel metrajı gerçek kalınlıklara göre gruplandırılır.
- H, üçlü H, çektirme U, köşe ve çapraz birleşim mantığı; duvar hattı üzerinden panel dizilimi; köşe payları; yatay/dikey makas yönü.
- Kapı ve pencerelerin panel yuvasına oturması; veranda sınırlarının duvar metrajından ayrılması.
- Hafif çelik modunda duvar aksları ve değişken duvar kalınlıkları.

Prefabrik çizim, panel ve birleşim sayıları iki makas yönünde özgün motorla karşılaştırıldı. Bu karşılaştırma matematiksel davranışın korunmasını doğrular; özgün üretim kabullerinin bütün projeler için mühendislik doğrulaması değildir.

## Yeni çalışma düzeni

**Prefabrik çizim kuralı (5.5):** Varsayılan tam + yarım modül kontrolüdür. Sağ panelden 125,5 cm tam panel adımı, 62,75 cm yarım panel adımı veya karma mod seçilir. Panel adedi girişi tam panel eşdeğeridir (0,5 = yarım). Normal modda yeni geometri/panel düzenlemesi, tam/yarım genişlik ve mevcut uç birleşim paylarına göre doğrulanır. Aynı bağlı binadaki paralel hatlar için üst/sol dış hattın ilk panel başlangıcı ortak aks referansıdır; H ve ara birleşimler 62,75 cm modülüne göre denetlenir. Ortak aks yakalaması ayrıca açılıp kapatılabilir. Yakalamayı veya ızgarayı kapatmak, imalat kontrolünü kapatmaz; Alt normal çizimde serbest ölçüye geçirmez.

Birleşim payıyla açıklanamayan yeni ölçü ve yeni aks uyuşmazlığı işlemi geri aldırır. İçeri alınan mevcut çizim otomatik düzeltilmez; bilinen uyuşmazlıklar Plan kontrolünde görünür. `Özel durum · serbest ölçü` modunda bu kısıtlar uyarı olarak kalır. Kalınlık/üretim ayarı değişikliği geometriyi otomatik kaydırmaz; oluşan uyuşmazlık raporlanır. Kurallar mevcut geometrik birleşim kabullerine dayanır; fabrikaya özgü farklı bağlantı detayları ayrıca tanımlanmalıdır.

**Makas yerleşimi:** Sağ panelde makası listeden seçin, yeni aks koordinatını santimetre olarak girin ve `Konuma taşı` düğmesini kullanın. Koordinat, çizimin makas ilerleme eksenindeki X veya Y değeridir. Bu işlem tek adımda geri alınabilir, JSON ile saklanır ve `Otomatik aksa dön` ile yalnız seçilen makas sıfırlanır. Kapı eklemek, iki yarımı birleştirmek veya panel sırası değiştirmek otomatik ya da elle taşınmış makasları değiştirmez. Aynı konuma iki makas yerleştirme ve bina sınırları dışına taşıma engellenir. H mesnet uyumsuzluğu Plan kontrolünde gösterilir; elle konumlandırma taşıyıcı uygunluk onayı değildir.

**Kararlı taşıma:** Duvar seçmek veya üzerinde gezinmek modeli değiştirmez. Taşıma, sol tuş basılıyken duvara dik yönde 6 ekran pikseli hareketten sonra başlar; düğüm tutamaçlarında da hareket eşiği ve tutma ofseti korunur. Esc taşıma işlemini iptal eder. Duvar yakalama kapalıysa H, hiza ve modüler mıknatıslar uygulanmaz; alt çubuktaki ızgara bağımsızdır. Alt, taşırken mıknatısları ve ızgarayı geçici kapatır.

**Çoklu yakalama:** Hassas yerleşimde H birleşimi, panel ortası, uç/köşe, kesişim düğümü ve duvar üzerinde serbest hedefleri birlikte seçebilirsiniz. Bir kutuyu değiştirmek `Özel · çoklu seçim` moduna geçer. Kesişim düğümü mevcut duvar birleşimidir; sonsuz çizgi uzantısı değildir. Serbest hedef açıkken yakın seçili noktalara yakalanır, diğer yerlerde serbest adım kullanılır. Taşırken düğüm hizası ve modüler aralık ayrı seçeneklerdir; varsayılan kapalıdır. Seçimler JSON kayıt ve kurtarmada korunur.

Bağımsız yeni duvarın panel ızgarası kendi başlangıcından hesaplanır. Makas doğrultusunda 502 cm bağımsız duvar, yatay/dikey ve iki çizim yönünde önizleme ile yerleştirmede dört tam panel verir. Mevcut binaya bağlı hatlarda binanın H ızgarası korunur; bu durumda uçlarda yarım paneller gerekebilir. Makasa dik duvarlarda köşe/birleşim payları ayrıca hesaba katılır.

Sol panel yapı sistemi ve üretim ayarlarını; orta bölüm çizim araçlarını; sağ panel nesne özelliklerini ve plan kontrollerini içerir. Panel numaraları, makas yönü, ölçü modu ve yakalama seçenekleri korunmuştur.

**Panel seçimi:** Seç aracının yanındaki listeden `Panel seçimi`ni açın ve bir panele tıklayın. Sağ panelden önceki/sonraki panelle yer değiştirebilir, 125,5 cm paneli iki 62,75 cm panele bölebilir veya iki komşu yarımı birleştirebilirsiniz. `Duvar seçimi` normal duvar düzenlemesine döner.

`Karşı hatların H noktalarını eşleştir` varsayılan olarak açıktır. Makas mesneti doğrultusundaki aynı bağlı binanın, ortak boy aralığı bulunan paralel duvarlarının panel ekleri birlikte düzenlenir. Kapı ve pencereler kendi panelleriyle taşınır. Makas aksları panel değişikliklerinden bağımsız olarak 125,5 cm aralıkla kalır; bina sonundaki kalan açıklık ayrıca korunur. H uyumsuzlukları Plan kontrolünde görünür. Farklı binanın duvarları değiştirilmez. Kısa/kademeli hatlarda yalnız ortak aralık eşleştirilir. Açıklık bir birleşimi aşacaksa işlem geri çevrilir. Eşleştirmeyi kapattığınızda yalnız seçili hat değişir ve oluşan H–makas uyumsuzlukları Plan kontrolünde görünür.

Sondaki yarım panele sığmayan kapı/pencere eklenirken komşu uygun panelle yer değişimi otomatik denenir ve karşı hatlar da eşleştirilir. Tam panelin içine yerleştirilmiş bir kapıyı sona taşımak için `Panel seçimi` ile kapılı paneli seçip `Sonrakiyle değiştir` kullanın. Yeni H kapı/pencere boşluğunu kesecekse iki yarıma bölme engellenir.

`Bu paneli kaldır` yalnız seçili duvarda fiziksel boşluk açar; o panelin içindeki açıklık da kaldırılır. Karşı duvar silinmez. Oda sınırı açılabilir. İşlem geri alınabilir.

**Yakalama:** Hassas yerleşimde `Duvar yakalama açık` kutusu yakalamayı açar/kapatır. `Yalnız H birleşimi ve köşe` panel merkezine yakalamaz; `H birleşimi + panel ortası` merkezleri de kullanır. `Serbest · H kilidi kapalı` modunda 1 / 5 / 10 cm adım seçilir ve en yakın H'ye işaretli mesafe gösterilir. Serbest adım diğer modlarda pasiftir. Alt geçici 1 cm serbest yakalamadır. Ayarlar önizlemeye hemen uygulanır ve proje dosyasında saklanır. Yeni projelerde varsayılan yalnız H'dır; eski projelerin seçimi korunur.

Kilitli modda ızgara/eksen yakalaması da duvara ulaştığında gerçek panel noktalarıyla doğrulanır. Yakın düğüm birleştirme işlemi H koordinatını değiştirmez. Bağlı başlangıç noktası hedefle aynı eksende değilse H'nin yanına sessizce kaymak yerine işlem engellenir.

| İşlem | Kısayol / yöntem |
|---|---|
| Seçim / duvar / veranda / kapı / pencere | S / D / V / K / P |
| Duvar çizimi | Başlangıç ve bitişe tıklayın; zincirleme devam edin |
| Kesin uzunluk | Yönü fareyle belirtin, sayı yazın, Enter |
| Prefabrik sayısal giriş | Üst çubuktan **Giriş: panel** veya **Giriş: cm** seçin |
| Tam / yarım panel adedi | 4 veya 4,5 gibi bir değer girin; köşe payları otomatik eklenir |
| Veranda sayısal girişi | Santimetre |
| Duvar üzerindeki özel başlangıç | Çizime başlamadan duvar üzerinde sayı + Enter; en yakın H'tan cm |
| Çizimi bitir | Esc veya sağ tık |
| Çoklu duvar seçimi | Shift / Ctrl + tık |
| Geri al / ileri al | Ctrl+Z / Ctrl+Y veya Ctrl+Shift+Z |
| Kaydet / ekrana sığdır | Ctrl+S / Home |
| Nokta yakalama / dik çizim | F3 / F8 |
| Görünümü taşı / yakınlaştır | Orta tuşla sürükle / tekerlek |
| Prefabrik serbest çizim | Alt basılı tutun |

## Güvenilirlik güncellemeleri

- Sistem, üretim seçenekleri, fire, geometri ve özellik düzenlemelerini kapsayan 100 adımlı geri al/ileri al.
- Dosyayı uygulamadan önce sürüm, koordinat, kimlik, referans ve temel ölçü doğrulaması. Hatalı yüklemede önceki model korunur.
- Eksik seçenekleri tamamlayan v5 uyumluluğu; eski dosyalardaki sayısal seçenek metinlerinin dönüştürülmesi.
- Açıklığın duvara sığması, köşe boşlukları, çakışma ve yükseklik denetimi. Birleşimin açıklığı bölmesi engellenir.
- Duvar bölünmesinde sabit kalınlık bilgisinin korunması; seçimsiz toplu kalınlık hatasının giderilmesi.
- Plan kontrol panelinde serbest uç, eğik prefabrik duvar, özel kesim, özel birleşim ve hatalı panel dizilimi bildirimleri. Nesneli bildirime tıklamak ilgili nesneyi seçer.
- Yüksek DPI ekran desteği, ekrana sığdırma, dosya adı ve otomatik yerel kurtarma.
- Dosya seçici yalnızca desteklenen JSON biçimini kabul eder. **DXF içe aktarma henüz uygulanmamıştır.**

## Alanlar ve hesap kapsamı

**Aks alanı**, odanın duvar aksları arasındaki alandır. **İç yüz alanı**, duvar kalınlıkları düşülerek hesaplanan alandır. İç içe bağımsız konturlar, delikler ve serbest iç duvarlar için iç yüz alanı ayrıca kontrol edilmelidir. Ekrandaki oda alanları ve mevcut oda metrajları aks alanını kullanır.

Plan kontrolü geometri ve metraj tutarlılığını denetler. Taşıyıcı profil kapasitesi, burkulma, bağlantı dayanımı, kar/rüzgâr/deprem yükleri ve mevzuata göre statik analiz bu sürümün kapsamında değildir. Bu işlevler için malzeme/profil kütüphanesi, yük kombinasyonları, hesap standardı ve doğrulanmış çözüm modeli ayrıca geliştirilmelidir.

Hafif çeliğe aktarım eski v6.0 tüketici biçimini korur. Eski `en` / `boy` alanları **alan eşdeğeri** olup gerçek oda kenar uzunlukları değildir; `olcuYontemi` bunu açıkça belirtir. Gerçek aks poligonu ve alanlar `geometry` alanına eklenir. `pCatiAln` eski yaklaşık `aks alanı × 1,05` kabulünü sürdürür ve bu yöntem dosyada işaretlenir. Hedef hafif çelik hesap programı bu çalışmada mevcut olmadığı için uçtan uca aktarım uyumluluğu doğrulanmamıştır.

## Geliştirme ve doğrulama

`src/engine.js`: mevcut çizim, oda, panel ve metraj motoru; hedefli düzeltmeler.

`src/project.js`: dosya şeması ve bağımsız geometri kontrolleri.

`src/studio.js`: arayüz koordinasyonu, kayıt, işlem geçmişi, düzenleme doğrulaması.

`src/prefab.js` ve `src/prefab.css`: panel nesnesi düzenleme, eşleşen H noktaları ve bağımsız makas konumları, kilitli/serbest yakalama, kalınlığa göre metraj grupları.

`src/legacy.css` ve `src/studio.css`: özgün diyalog stilleri ve yeni çalışma alanı.

`original/plan_cizim.v5.html`: teslim edilen dosyanın değiştirilmemiş yedeği.

`npm run build` tek dosyalı dağıtımı yeniden üretir. `npm test` Playwright ve Edge ile saf veri testlerini ve gerçek tarayıcı senaryolarını çalıştırır. Playwright ortamda bulunmuyorsa geliştirme bağımlılıklarını kurun. Edge yolu farklıysa `BROWSER_PATH` ortam değişkenini ayarlayın. Test sonuçları `artifacts/test-results.json` dosyasına yazılır.

## Tasarım referansları

- [Autodesk: Properties palette](https://help.autodesk.com/view/ACD/2026/ENU/?guid=GUID-94C065AB-FF9E-4752-B778-23D2FBB87E18): seçili nesnenin özelliklerini ayrı panelde düzenleme.
- [Autodesk: Precision and accuracy](https://help.autodesk.com/cloudhelp/2026/ENU/AutoCAD-OnBoarding/files/ACD_FOUNDATIONS_MAIN6.html): nokta yakalama, eksen kilidi ve kesin mesafe girişi.
- [Vertex BD eğitimleri](https://kben.vertex.fi/bd/tutorials): duvar yerleşimi, panel çizimleri ve malzeme raporları arasındaki iş akışı.

Bu kaynaklar arayüz ve iş akışı için referanstır. Prefabrik panel ölçüleri ve birleşim kuralları kullanıcının mevcut motorundan korunmuştur.

### Vitrifiye ve banyo zemini
Vitrifiye ekle ile gömme/takım klozet, ayaklı/dolaplı lavabo ve duş kabini yerleştirilir. Duş ölçüleri 70×70, 80×80, 90×90, 80×100, 90×100, 80×110 cm; lavabo genişlikleri 50/60/70/80 cm. Ayaklı lavabo, gömme klozet ve takım klozet verilen sabit standart ölçülerle çizilir; ölçü girişi istenmez. Dolaplı lavabo derinliği kullanıcı tarafından girilir. Vitrifiye sembollerinde isim veya ölçü etiketi bulunmaz. Yerleştirme duvar modülünden bağımsız 1 cm veya serbesttir; R döndürür, M aynalar, Esc iptal eder. Seçili ürün sürüklenebilir, ölçüleri değiştirilebilir, silinebilir. Nesneler JSON, yerel yedek, geri/ileri alma ve PNG çıktısında korunur. Banyo, ebeveyn banyo ve WC odalarında 30 cm seramik görünüşü kullanılır (şematik tarama, malzeme hesabını değiştirmez). Açıklık ölçüleri dış duvarlarda dış tarafa yazılır.
