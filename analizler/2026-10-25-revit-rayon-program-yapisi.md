# Plan Studio için Revit ve Rayon incelemesi

25 Ekim 2026 · Öneri ve uygulama sırası · DEV-147

Plan Studio için önerilen yön; kolay çizim, tek bir bina modeli ve firmaya ait doğrulanmış üretim kurallarını birlikte çalıştırmaktır. Rayon'un hızlı düzenleme ve sunum yaklaşımı, Revit'in elemanlar arasındaki ilişkileri ve modelden bilgi üretme yaklaşımı bu hedefe farklı katkılar sağlıyor. Bizim ayırt edici özelliğimiz, müşterinin seçtiği prefabrik veya hafif çelik evin nasıl üretileceğini açıklayabilmek olmalı.

Bu inceleme resmi ürün belgeleri, mevcut uygulamanın belirtilen kaynak dosyaları ve kayıtlı kullanıcı kararlarına dayanır. Revit veya Rayon hesabında uçtan uca uygulamalı ürün testi yapılmadı. Aşağıdaki öneriler henüz uygulanmış özellikler değildir. Mevcut uygulama 5.9.137 ve bağımsız Odak Atölyesi taslağı değiştirilmedi.

**İki üründen alınabilecek yaklaşım**

| Konu | Resmi kaynakta doğrulanan davranış | Plan Studio için öneri |
|---|---|---|
| Seçime bağlı özellikler | Revit özellik paneli seçili nesneye göre değişir; tek eleman ile aynı tipteki elemanların özelliklerini ayırır. | Sağda tek özellik paneli. Üstünde hangi nesnenin ve hangi kapsamın düzenlendiği açıkça yazsın. [Revit özellikler](https://help.autodesk.com/cloudhelp/2026/ENU/RevitLT-GetStarted/files/GUID-0544DD89-31FD-4E5F-B966-5A47A4D84F4D.htm) |
| Kat ve kot ilişkisi | Revit seviyeleri, döşeme, tavan ve çatı gibi elemanlar için yükseklik referansıdır. | Kat sekmeleri gerçek kat kimliğine ve kotuna bağlı olsun. Katı değiştirmek yalnız kamerayı değiştirmekle sınırlı kalmasın. [Revit seviyeler](https://help.autodesk.com/cloudhelp/2024/ENU/Revit-Model/files/GUID-075B9A47-69AB-44D2-8A05-6136EFF26946.htm) |
| Modelden metraj | Revit metraj tablolarını modelin bir görünümü olarak tanımlar. | Panel, profil, levha ve sevk listeleri modelden türesin; ayrı elle tutulan hesaplar olmasın. [Revit metraj](https://help.autodesk.com/cloudhelp/2026/ENU/Revit-DocumentPresent/files/GUID-F50D6FF4-859E-43A2-A2F6-81C84A1BA0EB.htm) |
| Üretim parçaları | Revit Parts, ana elemandan parçalar; Assemblies ise birlikte yönetilen eleman grupları oluşturur. | Mimari duvar, panel dizilimi ve üretilen parçalar farklı kimliklerle birbirine bağlı kalsın. Mimari duvarı bölmek mutfak hattını kaybettirmesin. Kaynak temel kavramı açıklayan 2015 belgesidir. [Revit yapım modeli](https://help.autodesk.com/cloudhelp/2015/ENU/Revit-Model/files/GUID-A76F13EF-B9A7-4D42-98BD-9EA2421D776F.htm) |
| Çizim ve alan düzenleme | Rayon'da duvar ölçüsü üzerinden düzenleme, duvara yerleşen açıklıklar ve alan bölücü vardır. | Duvar, açıklık, oda ve alan sınırında aynı seçme, taşıma, ölçü girme mantığı kullanılsın. [Rayon elemanlar](https://docs.rayon.design/documentation/design/elements-walls-zones-openings-etc) |
| Bağlı ölçüler | Rayon ölçü uçlarını geometriye bağlar ve bağlılık durumunu gösterir. | Ölçü duvar hareketini izlesin; koparsa açıkça işaretlensin. Kullanıcı ölçü yazısını ayrıca düzeltmek zorunda kalmasın. [Rayon ilişkisel ölçüler](https://docs.rayon.design/documentation/design/associative-dimensions) |
| Görünüm ve pafta | Rayon görünümleri kaynak çizime bağlıdır; ölçek, kırpma ve görünüm ayarları ayrıdır. | Müşteri planı, üretim planı ve pafta aynı kaynağın görünümleri olsun. [Rayon görünümler](https://docs.rayon.design/documentation/layout-and-present/views) |
| Firma standardı | Rayon ortak yazı, çizgi, blok, katman ve pafta düzenini birlikte tanımlamayı önerir. | Oda adları, elle yazılar, otomatik/elle ölçüler ve çıktılar ortak stilleri kullansın. [Rayon standartlar](https://docs.rayon.design/documentation/publishing-and-sharing/design-standards) |
| Ürün kütüphanesi | Rayon parametrik blokları tutamaç veya sayısal parametreyle düzenler. | Doğrama ve tefrişte kolay sayısal düzenleme; üretim parçalarında ise yalnız doğrulanmış ölçüler ve birleşim kuralları. [Rayon parametrik bloklar](https://docs.rayon.design/documentation/design/parametric-blocks) |

Rayon'un belgelerinde canvas, kendi ayarları olan bir 2B çizim alanıdır. Bu düzenleme kavramını, Revit'teki gerçek kotlara bağlı kat modeliyle aynı şey saymıyoruz. İncelenen belgeler Rayon için bizim ihtiyacımızdaki çok katlı 3B üretim modelini doğrulamıyor. Zemin, 1. kat, ara kat ve 3B geçişini Plan Studio'da gerçek kat verisi üzerinden geliştirmek gerekiyor. [Rayon canvas](https://docs.rayon.design/documentation/layout-and-present/canvases)

**Önerilen günlük kullanım**

Program dört ana çalışma alanı içersin: Proje, Tasarım, Üretim, Sunum. Tasarım varsayılan açılsın. Proje alanında müşteri bilgileri, yapı sistemi ve teknik seçimler; Üretim'de parça listeleri ve kontroller; Sunum'da pafta ve müşteri çıktıları bulunsun. Fiyat listesi sağlandığında teklif bu ortak modelden beslensin.

Tasarım alanının üstünde ince görünüm sekmeleri bulunsun: Zemin, 1. Kat, Ara Kat, Çatı, 3B. Kesit ve tavan planı ihtiyaç olduğunda açılıp aynı sekme grubuna eklensin. Kullanıcı boş bir katı istemeden oluşturmasın; yalnız projede var olan katlar gösterilsin. Açık görünümlerin yakınlaşma ve kaydırma konumları ayrı hatırlansın. Kat eklerken boş başlama veya seçilen kattan kopyalama sunulsun.

Sol panel proje ağacı olsun: katlar, odalar, çatı bölümleri, paftalar. Sağ panel seçilen nesneyi veya yürütülen komutu düzenlesin. İki panel daraltılabilsin; küçük ekranda aktif görev paneli öncelikli olsun. Çizim alanının yüksekliğini tüketen boş satırlar ve uzun açıklamalar kaldırılıp kısa yardım bağlantılarına alınsın. Ölçülü önizleme çizim üzerinde kalsın. Başlangıç tasarım hedefi, geniş ekranda çizim alanına en az yaklaşık yüzde 70 yatay alan bırakmaktır; bu bir ölçülmüş mevcut sonuç değildir.

| Seçilen şey | Sağda önce görülecekler | Ayrıntıda kalacaklar |
|---|---|---|
| Duvar | İç/dış, kalınlık, yükseklik, boy, böl/taşı | Birleşim, panel dizilimi, kaplama yüzleri, hesap açıklaması |
| Kapı/pencere | Ürün, en/yükseklik, açılış yönü, duvar ucuna mesafe | Kasa ve montaj ayrıntıları |
| Oda veya çizgiyle ayrılmış alan | İsim, kullanım türü, alan, kaplama | Net alan sınırı, ıslak hacim kuralı, hesap ayrıntısı |
| Çatı | Biçim, eğim, saçak, bağlı olduğu kat | Makas yerleşimi, kaplama, katmanlar, aksesuarlar |
| Ölçü | Ölçü türü, bağlı uçlar, yazı konumu | Stil ve çıktı seçenekleri |
| 3B görünüm | Kamera, kesit, kat görünürlüğü, Boyacı | Malzeme ayrıntıları |

Çatı düzenlemesinde sağ panel içinde Oluştur, Geometri, Makas, Kaplama ve Katmanlar grupları bulunabilir; yalnız seçilen grup açılır. Birbirinin üzerine gelen büyük pencereler günlük akıştan çıkar. Boyacı yalnız 3B'de görünür. Ana çizimdeki teknik özellikler bir kez düzenlenir; antet bunları okur.

Alt durum çubuğunda Izgara, Yakalama ve Taşıma adımı ayrı adlarla bulunmalı. Izgara 5 cm, açıklık adımı 5 cm ve duvar taşıma adımı birbirine karışmamalı. Temel komutlar kısa yazılı düğmelerle görünür; daha seyrek araçlar aranabilir komut menüsüne alınır. Rayon'da hem kısayol hem komut arama yolları belgelenmiştir. [Rayon komut erişimi](https://docs.rayon.design/documentation/rayons-basics/navigation-and-command-access)

**Ortak bilgi ve değişiklik kapsamı**

Bir özelliğin tek yetkili kaydı olmalı. Bütün ekranlar, 3B, antet ve metraj o kayıt üzerinden çalışmalı. Her özelliğe rastgele kat veya nesne istisnası açmak yerine, firma kuralının izin verdiği kapsamlar tanımlanmalı. Örneğin başlangıçta çatı kaplaması proje genelidir; bir çatı bölümüne özel kaplama ihtiyacı sonradan açıkça onaylanırsa istisna eklenir. Sağ panel, değişikliğin seçili elemana mı, kata mı, projeye mi uygulanacağını göstermeli.

Örnek: Sandviç panel seçildiğinde proje kaplama tanımı güncellenir; bağlı çatı bölümleri, 3B, katman kesiti, net kaplama hesabı, parça/sevk listesi ve antet aynı sonucu okur. Eski trapez levha sayısı geçerli sonuç olarak ekranda kalmaz. Yeniden hesap bitene kadar ilgili çıktı güncelleniyor olarak görünür. Kullanıcı geri aldığında bu değişikliğin tamamı tek adımda geri döner.

Müşteriye gösterilen seçenekler anlaşılır olmalı: dış cephe, doğrama rengi, duvar/tavan kaplaması, çatı kaplaması. Kullanıcı ayrıntıyı açtığında bunların malzeme ve montaj sonuçlarını görebilmeli. Hatalı seçim sessizce başka ölçüye yuvarlanmamalı; geçerli alternatif ve değişikliğin etkisi gösterilmeli.

**Gerçek kat modeli**

Kat adı, kat kotu, duvar/panel yüksekliği, döşeme kalınlığı ve tavan kotu ayrı kavramlardır. Birinci kat kotunu yalnız alt kat duvar yüksekliğine eşitlemek her yapıda doğru değildir. Ara katın alan sınırı, boşlukları, taşıyıcı düzeni ve tavan ilişkisi ayrıca tanımlanmalıdır; kat yüksekliğinin yarısı genel kural değildir.

Her duvar, oda, açıklık ve çatı bir kat/bina kimliği taşımalı. Kat kopyalandığında yeni nesne kimlikleri üretilmeli ve iç bağlantılar yeni kimliklere bağlanmalı. Alt kat soluk referans olarak gösterilebilir; referans kat yanlışlıkla düzenlenmemeli. Kat gizlemek metrajdan silmek anlamına gelmemeli. Kat silmede bağlı nesneler ve sonuçlar görünür olmalı; işlem geri alınabilmeli.

**Bize özel iki üretim sistemi**

Ortak mimari araçlar korunurken prefabrik ve hafif çelik farklı üretim kurallarıyla hesaplanmalı. Sistem değiştirme, yalnız görünüş veya menü adı değiştirmemeli; uyumsuz seçimlerin ve yeniden üretilecek parçaların önizlemesini sunmalı.

| Prefabrik | Hafif çelik |
|---|---|
| 125,5 ve 62,75 cm modüller; H, U, köşe ve makas yönü ilişkisi | Onaylı kesit kataloğu, dikme/kayıt düzeni, açıklık çevresi ve kaplama desteği |
| 250 / 280 / 300 cm seçmeli panel yüksekliği | Elle girilen proje/kat yüksekliği |
| Köşe/uç payından türeyen gerçek panel ölçüleri | Duvar, döşeme ve çatı karkasının ayrı eleman grupları |
| Panel ve birleşim listeleri | Profil/parça ve montaj listeleri |

Panelin nominal modülü, yerleştirme ölçüsü ve üretim kesim ölçüsü ayrı saklanmalı ve açık adlandırılmalı. 125,5 cm modülün belirli bir birleşimde 120,5 veya 122,5 cm'ye düşmesi örneğin ilgili uçta 5 veya 3 cm paydan kaynaklanabilir; 62,75 cm modülde 5 cm pay 57,75 cm sonucunu verir. Bu, bütün panellerden aynı payın düşüleceği anlamına gelmez. Hangi uçta hangi payın geçerli olduğu gerçek birleşime, duvar kalınlığına ve makas yönüne bağlıdır.

Kayıtlı kesin kural: makas aksları referanstır; panel adedi ve ara panel ölçüleri korunur; köşe yönü değişince uç payları ve gerekirse bina dış ölçüsü değişebilir. Açıklık boyu korunur, yeni H açıklığı uygunsuz bölemez; şartlar sağlanamıyorsa dönüş reddedilir. Sağdaki Neden bu ölçü alanı bu kararı bir şekil ve hesap satırıyla açıklamalı. [Yerel doğrulanmış kural ve testler](2026-10-07-makas-kose-uyumu.md)

H, U, üçlü/dörtlü birleşim ve köşe direkleri mevcut görünüm kuralına göre sunum filtreleriyle gizlenmemeli. Kullanıcı görünüm sadeleştirdiğinde yalnız açıklama ve kontrol katmanları sadeleşmeli. Geometrik üretim uygunluğu ile mühendislik taşıyıcı hesabı ayrı durumlar olarak gösterilmeli; doğrulanmamış hafif çelik birleşimleri otomatik üretim onayı almamalı.

**Malzeme kararlarının korunması**

- Banyo/WC duvarları her durumda yeşil alçıpan; veranda/sundurma tavanları da yeşil alçıpan. Duvar alanı ilgili yükseklik ve açıklıklardan hesaplanır.
- Standart tavan montajı 60×120 cm ve mini H; alçıpan tavan montajı 120×250 cm, aynı alan için mini H iptal. Stok levhası, döşenen parça ve fire birbirinden ayrılmalı.
- Dış H kapak lata 6 cm genişlik, 2 cm kalınlık ve bina yüksekliğiyle gösterilir ve miktarlandırılır. Fiyat listesi verilene kadar birim fiyat veya tahmini maliyet üretilmez.
- Trapez 27/200 için 80 ve 100 cm net kapatma eni imalat ve metraj parametresidir. 3B profil biçimi buna uygun olur; görüntü dokusu tek başına üretim tanımı sayılmaz.
- OSB ve nem bariyeri metal kaplamanın altında yer alır. 3B katman kesiti seçilmiş gerçek katmanları gösterir; görüntü için katman ayırmak miktarı değiştirmez.
- Dış boya baş makas kaplamasını da belirler. Köşeler standartta kırık beyazdır; beyaz hızlı seçeneği korunur. Çatı renkleri RAL 3009, 7016, 9016 ve galvanizdir.

**Firma kullanımını tamamlayacak bağlantılar**

Bir metraj satırına tıklanınca plandaki/3B'deki parçalar seçilebilmeli; bir parçadan ilgili metraj satırına gidilebilmeli. Her satırın kaynak nesnesi, katı, ürün tanımı, birimi ve hesap gerekçesi tutulmalı. Net miktar, kesim planı, fire ve sevk miktarı birbirine karıştırılmamalı. Rayon'da tablo verilerinin kaynak nesnelere bağlı tutulması da bu yaklaşımı destekler. [Rayon tablolar](https://docs.rayon.design/documentation/layout-and-present/tables)

Müşteri değişiklikleri için alternatifler saklanmalı: örneğin ilk teklif ile son cephe/çatı seçimi arasındaki malzeme farkı görülebilmeli. Proje birim fiyatlarının kaynağı ve tarihi yalnız kullanıcı fiyat listesini verdiğinde eklenmeli. Eksik fiyat sıfır maliyet olarak gösterilmemeli.

Üretime verilen revizyon, kullanılan standart sürümü ve parça listesiyle birlikte sabit bir kayıt oluşturmalı. Daha sonra çizim değişirse eski sevk/imalat listesi sessizce güncel sayılmamalı; değişen parçalar gösterilip yeni revizyon oluşturulmalı. Müşteri paftası, imalat paftası ve sevk listesi aynı revizyon numarasını taşımalı. Ekip ve bulut senkronizasyonu daha sonra ele alınabilir; bugün GitHub'daki program ile tarayıcıdaki müşteri çiziminin farklı kayıtlar olduğu açık kalmalı.

**Mevcut kodun gösterdiği durum**

İncelenen başlangıç commit'i: `bc46c88350177843953c6c19d1190d2cfa72e376`. Kaynak dosyaların SHA-256 değerleri [envanterde](2026-10-25-revit-rayon-kaynak-envanteri.json).

| Kaynak | Mevcut temel | Gereken devam |
|---|---|---|
| `src/project.js` | v5/v5.1 kayıt; n/s/e/r listeleri, ortak seçenekler ve çatı listesi | Gerçek kat kimliği/kotu ve geriye uyumlu dosya dönüşümü |
| `src/project-specs.js` | Ortak seçimlerden çatı malzemesi/genişlik/yüksekliğe aktarım; antet grupları; lata miktarı | Bütün bağımlılıklar için açık, tek değişiklik işlemi ve kapsam yönetimi |
| `src/plan-dimensions.js` | Ortak ölçü çizimi; konum, boy, açı üzerinden ölçü | Nesne kimliğine bağlı referanslar; duvar hareketi ve bölünmesinde ilişkiyi koruma |
| `src/area-regions.js` | Açıklama çizgilerinden türeyen alan, ad/tür, etiket taşıma | DEV-138-B: net alan ve oda/kaplama metrajına kontrollü entegrasyon |
| `src/prefab.js` ve makas/köşe raporu | Üretim yönü ve uç payları için mevcut davranışlar | Mevcut doğrulamayı koruyan anlaşılır düzenleme ve hesap açıklaması |
| `taslaklar/odak-atolyesi/README.md` | Kat geçişi ve bağlamsal panel fikrini gösteren bağımsız taslak | Kullanıcı değerlendirmesi ve ayrı uygulama aşamaları |

Odak Atölyesi'nin 3B'si SVG izdüşümüdür; duvar bölmesi bir işaret önizlemesidir. Taslakta kat kopyalamanın görünmesi gerçek uygulamanın çok katlı üretime hazır olduğunu göstermez. Üretim ve çıktı motoruna bağlı olmadığı kendi açıklamasında belirtilmiştir.

Teknik öneri: mevcut JavaScript, Canvas/WebGL ve hesap modüllerini aşamalı kullanmaya devam etmek; önce kat, nesne kimliği, ilişkili ölçü, ortak özellik ve değişiklik işlemlerini belirginleştirmek. Bir arayüz kütüphanesine geçiş tek başına bu sorunları çözmez. Mevcut tek kat motoru ilk adımda kat başına çalıştırılabilir; katlar arası döşeme, merdiven boşluğu, çatı ve taşıyıcı ilişkileri ayrıca modellenmelidir. Kalıcı kaynak veri ile ondan üretilen çizim/parça/metraj sonuçları ayrılmalıdır.

**Önerilen sıra ve kabul ölçütleri**

| Aşama | İş | Bittiğini gösteren somut kontrol |
|---|---|---|
| 1 | Bağımsız taslakta günlük akış | Kullanıcı kat değiştirir, duvar seçer/böler, oda adını düzenler, çatıya ve 3B'ye geçer; yinelenen ayar yok, seçilen nesne/kapsam açık |
| 2 | Ortak model ve temel güvenilirlik | Eski JSON aç/kaydet kayıpsız; bölünmüş duvarda tezgâh aynı hattı kullanır; ölçü bağlı kalır; alt oda sınıfı doğru kaplama hesabına gider |
| 3 | Gerçek kat ve görünüm bağlantısı | Zemin/1.kat/ara kat ayrı kimlik ve kotta; kopyalama çakışmıyor; gizleme miktarı değiştirmiyor; kesit ve 3B aynı modelden geliyor |
| 4 | Prefabrik ve hafif çelik üretim akışları | Köşe/makas yönü dönüşünde ara panel ve açıklık koruması; hafif çelikte onaylı kesit/birleşim örnekleri; kaynak parçaya bağlanabilen metraj |
| 5 | Revizyon ve firma teslimi | Çatı değişikliği plan/3B/antet/listede aynı; onaylı revizyon korunuyor; pafta, imalat ve sevk aynı revizyonda |

Her aşamada aynı küçük kabul projeleri kullanılmalı: 10 ve 6 cm prefabrik köşe örnekleri; kademeli ve yavru çatılı plan; banyo/WC ve veranda; çizgiyle bölünmüş hol; parçalanmış mutfak duvarı; zemin/ara kat/1.katlı hafif çelik örneği. Mevcut üretim testleri geçmeden arayüz ana programa taşınmamalı. Pafta kontrolü, ekranda yakın/uzak zoom kontrolünden ayrı yapılmalı.

İlk geliştirme kararı için önerim, mevcut bağımsız taslakta yalnız kat/geçiş, tek özellik paneli ve ölçüyle düzenleme akışını olgunlaştırmaktır. Kullanıcı kabulünden sonra model bağlantıları aşamalı bağlanmalı. Ayrıntılı iş yükü ve süre, özellikle çok katlı hafif çelik model ve onaylı imalat birleşimleri netleşince belirlenebilir.

**Bu teslimin sınırı**

Resmi belge incelemesi, kaynak kod kontrolü, öneri ve kaynak envanteri tamamlandı. Uygulama kodu, dağıtım dosyası, taslak veya kullanıcı çizimi düzenlenmedi; çalışma davranışı değişmediği için uygulama testleri yeniden çalıştırılmadı. DEV-138-B ve önceki açık üretim/çizim aktarım işleri kapanmış sayılmaz. Önerilerin uygulanması ve canlı ürün karşılaştırmalı kullanılabilirlik testi sonraki çalışmadır.
