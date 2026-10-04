# Ev / iş devam dosyası — 4 Ekim 2026

## Başlangıç
AGENTS.md → git status/remote/fetch → DEVAM.md ve CALISMA_KAYDI.md. Temiz değilse koru; otomatik reset/clean yapma. Son program5.9.58; kod teslim commit a9d1bc3919940693d651af3e6ca7ec31117c9e89. Bu belge sonrası yalnız devir belgeleri/görseller commit edilir. Hangi bilgisayarda açıldığına bakmadan ortak kaydı esas al. Kullanıcıdan tanımlanmış kuralları tekrar isteme.

## Son kesin kararlar
- Banyo/ebeveyn banyosu/WC duvarları HER DURUMDA yeşil alçıpan. Diğer oda duvarları kaplama seçimine bağlı. Beyaz/yeşil/veranda tavan levhaları standart;120×250cm,net alan ve mevcut fire hesabı. Duvar kapı/pencere boşlukları düşer.
- Standart tavanlar mini H geçme sistemi: ALÇIPAN VİDASI YOK. Mini H adet/ölçü kuralı henüz konuşulmadı.
- Yeşil duvar vidası3.5×35:ceil(net yeşil duvar m²×500/19.3425); Tuna kontrolünde500. Tavan ve levha firesi dışarıda; ek yedek yok. Beyaz duvar vidası kural bekler.
- Diğer geçici vidalar: aşık5.5×25=ceil(stokmetre×1000/291),trapez5.5×60=ceil(eğimli alan×1000/103.32),tek dikdörtgen beşik trapez kapsamı. Sonradan tartışılan max(10/m²,3.5/m,12/parça) önerisi UYGULANMADI; kullanıcı mevcut hesabı korudu. Referans yedek ayrımı bilinmiyor.
- İç H'lerin tamamı kulaksız/dübelsiz; dış H'ler dübelli,makas uç mesnedindekiler kulaklı. Üçlü/dörtlü de dahil.
- Köşe direği10→98×98,6→58×58mm; boy bina yüksekliği. Çektirme U60/100mm, boy yükseklik−60mm; her başlayan5adede1yedek,ölçü bazında.
- Alt çerçeve2500mm,kapı/pencere dahil tüm gerçek duvar toplamı/2500yukarı yuvarla,kalınlık başına1yedek. Açık veranda kenarları hariç.
- Özel panel çizimde kendi ölçüsünü korur; uyumlu parçalar1250mmstoktan kesime gruplanır; en az stok garantisi yok. Boyutlar örneklerle sınırlı değil.
- Omegalar2500mm; iç/veranda duvar omegası,baş makas omegası,saçak omegası konum/kalınlığa göre ayrı. Z ayrı satırda baş omega ile geçici1:1. Saçak sacı2800−300bindirme=2500etkin,saçak omega adediyle1:1.
- Alın V gerçek eğimli alın toplamı/2500yukarı;2800stok,300bindirme. Aşık kapama U ayrı2500satır,AlınVile1:1.
- Veranda direği100×100flanşlı,boy bina yüksekliği. Kiriş çizimde netboy,listede net+100mmkesim payı;her kiriş ayrı olabilir.
- Aşık:saçakta0/342mm;OSB400,trapez800aralık;mahyada120mm,sığmayan aralık mahyaya yakın kalır.4200/3000stok kombinasyonu önce en az fazlalık,sonra en az parça;fazlalık bindirme,sabit bindirme kuralı yok. Tüm çatılar ve tekil ek yerleri henüz tamamlanmadı.

## Son çizim düzeltmeleri
5.9.55–58:ana/yavru köşe yakalama,yavruUaynıana kenara dönüş,tek fiziksel dış köşe adayları ve yeşil işaretler. Dört köşeden sonra Enter/oluştur. Baş makas betopanı ev duvar girintisine değil çatı alın sınırına göre3Bde kapanır; açık veranda üzerinde de kapanır. Ana/yavru kot farkı kapaması korunur. Betopan levha sevk/kesim hesabı bu teslimde eklenmedi. Oda topolojisi olmayan açık çizimde dış taraf için merkez tahmini sınırlaması var.

## Açık işler düşürülmeyecek
- DEV-036:bu proje tamamlandıktan sonra birkaç farklı çizim+Excel ile TÜM kalemlerin adet/yedek/boy/pay sağlaması.
- DEV-038:mini H ve beyaz duvar vidası; derz/sarf kuralları henüz belirlenmedi.
- DEV-033/034:tüm çatı tiplerinde aşıklar,gerçek ek/bindirme noktaları,4200/3000iki renkli otomatik montaj paftası ve makas yerleşimi. Kullanıcı detaylara6Ekim civarı dönmeyi söyledi; sonraki açık çizim düzeltmeleri bu işlerin tamamlandığı anlamına gelmez.
- DEV-007/011:kullanıcının gerçek son planında birleşim/mesnet doğrulaması; otomatik test geçmesi üretim onayı değildir.
- DEV-006/008 ve diğer eski açık işler DEVAM içinde korunur:Excel/PVC farkları,kaplama katmanları; DWG/PDF/DXFimport,doğrudanDWGexport,çok kat talepleri tamamlandı sayılmaz.
- DEV-043:GÜNCEL CANLI ÇİZİMİ DOSYAYA ALMA BEKLİYOR. Kullanıcı son ana/yavru çatıyı çizdi. Ekran görüntüleri JSON değildir. Kaydet ile alınan yeni dosya cizimler'e ayrı adla eklenip hash/push doğrulanmalı. Mevcut yedek güncel ilan edilmeyecek.

## Aktarım kontrolü
- Kaynak ve dist aynı5.9.58tesliminde gönderilmişti; fetch fark0/0.
- Son9çatıgörseli referanslar/2026-10-04-cati-duzeltmeleri altına kopyalandı; orijinaller taşınmadı/silinmedi.
- Yol/SHA-256 listesi:2026-10-04-devir-envanteri.json.
- Takipsiz Yeni proje (11).json hash'i cizimler/2026-10-04-vida-karsilastirma-ornek.json ile aynı; ikinci kopya olduğu için yeniden eklenmedi,yerelde korundu. Bu örnek son canlı plan diye adlandırılmadı.
- Tuna kontrol JSON cizimler/2026-10-02-tuna84-dwg-esleme-taslak.json; çatı içermez. Eski ev/iş yedekleri korunur.
- artifacts ve plot.log geçici/yok sayılan; kullanıcı çizimi yerine geçmez. Gerekli kalıcı açıklamalar analizler ve test kaynaklarında.
- Son kontroller roof-gable-boundary,roof-child-u,roof-plan-body,roof-workflow,loading-list; önceki snap/gypsum/screw testleri teslim kayıtlarında. Bu devirde kod değişmedi,gereksiz yeniden test/build yapılmadı.
