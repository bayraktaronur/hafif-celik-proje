# Prefabrikten Karkas 0.5.0

Duvarlarda yatay kayıt varsayılanı artık Sürekli. Gözlerde bölünmüş seçeneği korunur; çatı/döşeme varsayılanı bölünmüştür. Sürekli kayıt dikme akslarını geçer, kapı/pencere boşluklarında kesilir. Geçilen dikmeler ve gerekli geçiş yerleri metadatada tutulur. Geçiş kesme/ezmesi geometriye uygulanmaz; kesişen katılar olabilir. Sürekli kayıt görünüşü bitmiş imalat çizimi değildir.

Açıklık başlığı Tek C veya Kafes(taslak) seçilebilir. Kafes yüksekliği ve göz aralığı kullanıcı girdisidir; varsayılan500/600mm mühendislik boyutlandırması değildir. Alt/üst kuşak ve başlık iç çaprazları genel duvar çaprazından ayrı rollerdir. Duvar üst rayı üst kuşakla çakışıyorsa tekrar kuşak eklenmez. Başlık duvar sınırını veya başka açıklığı aşarsa işlem reddedilir. Levha destekleri gerektiği aralıklarda korunur; başlık kafesi bunların statik/kaplama gerekliliğini ortadan kaldırmaz.

Parametre penceresine kayıt düzeni,başlık tipi,kafes yüksekliği ve göz aralığı eklendi. Metraj/CSV/SVG parça(kesim boyu) adedi,toplam profil metre ve nominal uç yüzü adedini ayrı gösterir. Uç yüzü adedi gerçek makine kesim sayısı değildir; makine operasyonu hesaplanmadı. JSONda stud_pass_locations ve machine_cut_count=not_calculated vardır.

Kendi3600×2800kapı/pencereli testimizde aynı kenar çaprazlı Tek C düzeninde bölünmüş45parça/53.461m, sürekli33parça/54.361m çıkar.12parça azalma0.900m profil artışıyla birlikte olur; parça azalması malzeme tasarrufu diye sunulmaz.

Kontroller: continuous-header-qa32kaplama/yön/kayıt/başlık kombinasyonu,üst ray yeniden kullanımı,taşan/başka açıklığa giren başlık reddi,açıklığa profil girmeme,temas ve metraj; FrameCore120yerleşim,OpeningCore,Connection,SupportGrid ve35kesit/175geçme testleri geçti. Yeni0.5.0gerçek SketchUp geometri/UI kabulü yeniden açılış sonrası gereklidir; saf çekirdek testleri canlı kabul diye raporlanmaz.

Referansın ölçüleri/kesiti bütün projelere kopyalanmadı; C profil motoru korunur,kalınlıksız Utemsilinden ürün kesiti türetilmedi. Gerçek makas/çatı yük aktarımı,statik yeterlilik,makine kesme/ezme,üretici vida şartları ve ileri C/U ürün kataloğu halen açık. Önceki0.4.3bağlantı denetimi korunur.
