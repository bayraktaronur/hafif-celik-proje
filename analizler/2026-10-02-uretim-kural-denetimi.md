# Prefabrik imalat kuralları — ilk sistem denetimi

2 Ekim 2026 · İncelenen uygulama 5.9.19

## Sonuç ve kapsam

Drawing1 ile tek bir planın panel aralıklarını eşlemek mümkün; bu, programın her yeni evi aynı imalat mantığıyla kendiliğinden çizebildiği anlamına gelmiyor. Mevcut motor geometrik bir başlangıç sağlıyor. Bağlantıya bağlı üretim payları, özel pano seçimi ve ürün listesi için doğrulanmış bir kural kataloğu gerekiyor.

Kaynaklar: [ölçülü karşılaştırma](2026-10-02-tuna84-karsilastirma.md), [DWG ölçü kanıtları](2026-10-02-drawing1-geometri.json), src/engine.js (pfRuns, pfDizilim, pfAnaliz), src/prefab.js (centeredUJoint, rebuildLayout, wideWindowLayout), src/modular.js (inspect, cutMm), src/roof-workflow.js (setDirection). Excel/PVC yeniden satır satır incelenmedi; önceki rapordaki 47 ürün henüz 49 geometrik yuvaya eşlenmiş değildir.

[Sayısal denetim](2026-10-02-uretim-kural-denetimi.json), tools/audit-manufacturing.cjs ile bağımsız tarayıcıda üretildi. Canlı kullanıcı planına dokunulmadı. T birleşimi için üç kontrollü örnek çalıştırıldı. Diğer satırlar kaynak kodu ve mevcut DWG ölçüleri üzerinde incelemedir; tüm birleşimlerin fiziksel üretim doğrulaması değildir.

## Ölçüleri ayırma zorunluluğu

1. Yapı/duvar aksı: duvar merkezlerinin konumu ve aralarındaki mesafe.
2. Panel yerleşimi: uç bağlantıları arasında panelin planda kapladığı aralık.
3. Kesim: üretim listesindeki gerçek parça boyu, mm.
4. Açıklık: kapı/pencere sembolü, kasa boşluğu ve sipariş ölçüsü ayrı bilgiler.

Örnek: 125,5 cm yerleşim için 1250 mm, 62,75 için 625 mm; 166 cm geniş pencere panosu için 1660 mm yazıyor. Bunların hepsine aynı sabit pay çıkarılamaz. Standart pencerenin çizim boşluğu 120 cm, etiketi 119 cm; geniş pencere etiketi 160 cm iken panosu 166 cm. Kapı kesin boşluk analizi kullanıcı kararıyla ertelendi; panel yüksekliği bu örnekte 250 cm.

## Kural matrisi

| Başlık | Mevcut davranış / kanıt | Eksik doğrulama ve gerekli düzen |
| --- | --- | --- |
| Tam / yarım modül | 125,5 / 62,75 cm; Drawing1 içinde mevcut. | Bu yerleşim modülleri kesim boyu değildir. H profilinin fiziksel payını ayrıca tanımlamalıyız. |
| Ortak aks | Motor aynı yapıdaki hatlara ortak panel/makas başlangıcı verir; kontrol 62,75 adımı arar. | Özel pencere ve kapı panolarının ekleri bu ızgaradan ayrılabiliyor. Yapı aksı ile panel eki aynı zorunluluk olmamalı; geçerli istisna türleri belirlenmeli. |
| Düz H | Ardışık iki pano arasında H sayılır. | Profil kesiti, panel içine girme mesafesi, duvar kalınlığına göre stok kodu/yükseklik ve kesim payı doğrulanmalı. Sembolik H çizimi profil ölçüsü değildir. |
| Üçlü H | Gelen T kolu ana hattaki panel ekindeyse H3. | 10/6, 10/10, 6/6 varyantlarının gerçek bağlantı detayları gerekli. Kolun yüz/aks referansı ve uç payı tek kuraldan üretilmeli. |
| Çektirme U | Ek olmayan T konumunda motor U verir. Denemelerde panel ortası 62,75 ve merkez dışı 40 cm aynı sınıfa girdi. | Kullanıcının onayladığı örnek iki yarımın birleşip orta U olmasıdır. Bu onay, her merkez dışı U konumunun üretilebilir olduğunu kanıtlamaz. Merkez dışı kullanım ayrıca sorulmalı. |
| Yarım panel birleştirme | Arayüzde bağlantılı iki yarım ancak ortada tek dik T kolu varsa U'ya çevrilebilir; dörtlü birleşim korunur. | Arayüzün dar kuralı ile analiz motorunun geniş U sınıflandırması tutarlı bir katalog üzerinden çalışmalı. |
| Dörtlü X | İki geçen hattın ikisinde de ek aranır; değilse uyarı. Ortak eklerde fazladan düz H sayılmaz. | Gerçek dört kollu profil/alternatif montaj ve farklı kalınlık detayları gerekli. Bu audit X örneğini fiziksel kaynakla doğrulamadı. |
| Köşe direği | L köşede devam eden hat seçilir; diğer hat karşı duvarın yarı kalınlığı kadar kısalır. Dış ölçü dış yüze uzatılır. | Köşe yönü ve direk tipi gerçek montaja bağlı olmalı. Çizimdeki köşe sembolü gerçek kesit kataloğu değildir. İç/dış köşe, ters köşe ve farklı kalınlıklar ayrı örnekle doğrulanmalı. |
| Köşeye iç duvar | Dış köşe korunur, iç kol U olarak ayrılır. | Direğe bağlantı şekli ve kesim payı ayrıca kanıtlanmalı. |
| Serbest uç | Motor boşta duvar ucuna da U adı verir. | Uç kapama profili ile T bağlantısındaki çektirme U'nun aynı üretim kalemi olup olmadığı bilinmiyor; ad ve stok kodu ayrılmalı. |
| Kapılı pano | Açıklık mevcut panoya sığıyorsa tutulabilir; uygun olmayan yerde komşu pano değişimi/ek merkezli tam pano davranışları var. | Drawing1 girişinde 52,75 + 125,5 gerekiyor. Genel çözüm kapıyı yerleştirirken pano türü, uç dolgu ve bağlantıyı birlikte seçmeli. Mevcut dış kapı ölçüsü/konumu bu aşamada korunacak. |
| Pencereli pano | 160 cm pencere için 166 cm pano oluşturan özel yol var. | Diğer pencere aileleri için sipariş, boşluk ve pano ilişkisi ayrıca tanımlanmalı; 160→166 evrensel formül değildir. |
| Özel panel | Açık diziyle korunabiliyor; kaynakta 52,75, 71,375, 102,75, 166 ve köşe/bağlantıdan kısalan ölçüler var. | Özel panel bir hata etiketi olmamalı: neden, ürün ailesi, uç bağlantıları, kesim onayı saklanmalı. Uyarıyı topluca kapatmak çözüm değildir. |
| Net kesim | cutMm yalnız genişliğe bakarak küçük bir tablo döndürür; bilinmeyeni tanımsız bırakır. | Aynı yerleşim genişliğinin farklı uç profili/kalınlık/ürün ailesinde aynı kesimi verdiği kanıtlanmış değil. Sonraki katalog anahtarı bunları içermeli. |
| Makas / H | Paralel duvar hatları üzerinde makas kesişiminin H'ye yakınlığı denetlenir. e107 için uyarı kalıyor. | Hatların gerçek taşıyıcı rolü ayrılmadan bu uyarı kesin imalat hatası sayılmaz. Mesnet detayı olmadan H veya makas taşınmamalı. |
| Çatı yönü | Etkin 5.9.18+ işlem mevcut pano dizilerini kaydeder ve köşe yönünü koruyarak çatıyı değiştirir. | Eski modüler sarmalayıcıya bakıp duvarların hâlâ otomatik değiştiği sonucuna varılmamalı. Koruma, yeni mesnet uygunluğunun onayı değildir. |
| Metraj / montaj | Pano ve bağlantı adetleri hesaplanır. | Ürün satırı, panel kimliği, profil boyu, açıklık donatısı ve montaj sırası kaynaklarla eşlenmeli. 49 yuva = 49 sipariş ürünü varsayılmamalı. |

## Sayısal kontrol ve hassasiyet

Kontrol taslağında yazılım 49 pano yuvası; 29 düz H, 7 H3, 3 U ve 8 köşe hesaplıyor. Bunlar yazılım çıktılarıdır; DWG'deki gerçek bağlantı profillerinin bağımsız sayımı değildir. 14 uyarı korunuyor.

T sınıflandırmasındaki ek yakınlığı PF_TOL=1 cm; modül denetimi TOL=0,05 cm; bazı düzenleme sınırları 0,01 cm, tam/yarım sınıfı yaklaşık 0,6 cm tolerans kullanıyor. Bunlar farklı amaçlarda olsa da üretim kuralı olarak karıştırılmamalı. Ekran yakalama mesafesi, kaynak normalleştirme hassasiyeti, geometrik eşitlik ve onaylı imalat toleransı ayrı parametreler olmalı. Onaylanmamış imalat toleransı icat edilmemeli.

## Uygulama sırası ve kabul ölçütleri

1. İki ek gerçek üretim örneğiyle bağlantı/ürün kataloğunu çıkar: her kuralın kaynak DWG nesnesi, çizim konumu, ölçüsü ve varsa Excel satırı kayıtlı olsun. Belirsiz olanı kullanıcıya topluca sor.
2. Modelde aks, panel yerleşimi, uç bağlantısı, kesim ve açıklık ölçüsünü ayrı tut. Mevcut JSON'ları koruyan sürüm geçişi ve geri alma gerekli.
3. Kapı/pencere yerleşimi, yarım birleştirme ve özel pano dizilimi aynı kural motorunu kullansın. Geçerli özel üretim uyarı yağmuruna dönüşmesin; tanımsız parça sessizce üretim onayı almasın.
4. Doğrulanmış örnekler regresyon planı olsun: pano sırası ve boyu, H/U/köşe türü ve yeri, kesim listesi, açıklıkların korunması, kaydet/aç ve geri alma karşılaştırılsın.
5. DWG–JSON–Excel ürün eşlemesi bitince imalat çıktısına geç. Eşleşmeyen ürünler ayrı açık liste olarak gösterilsin. H/U/köşeler her sunumda görünür kalsın.

Bu çalışma davranış değiştiren yeni sürüm değildir; analiz ve tekrarlanabilir denetimdir. Canlı çizim veya orijinal CAD/JSON değiştirilmedi.

## İstenen ek kaynaklar

- Birinci örnek: kapılı pano, yarım/tam birleşimi, üçlü H ve panel ortasına gelen çektirme U içeren gerçek imalat DWG'si. Varsa merkez dışı U örneği özellikle yararlı.
- İkinci örnek: L veya girintili plan, farklı köşe yönleri, geniş pencere ve özel dolgu paneli içeren imalat DWG'si.
- Varsa aynı işlerin panel/kesim Excel'i ve H, U, köşe direğinin kesit ya da detay sayfası. İsim benzerliğinden profil ölçüsü çıkarılmayacak.

Kullanıcının yeni çizim hazırlaması gerekmiyor; daha önce üretilmiş iki farklı iş tercih edilir. Kapı ölçüsünü şimdi değiştirmek istenmiyor; araştırma bağlantı ve pano mantığına odaklı.
