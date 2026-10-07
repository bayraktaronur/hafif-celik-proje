# Makas, köşe ve yavru U hizası — 5.9.59

7 Ekim 2026, iş bilgisayarı. 5 Ekim'de başlayan, henüz gönderilmemiş değişiklik bu teslimde tamamlandı. DEV-044 ve DEV-045.

## Kullanıcının kesinleştirdiği kural

Referans makas akslarıdır. Panel adetleri ve ara panel ölçüleri korunur. Köşe yönü değişince 10 cm duvarda iki uçtaki 5/10 cm paylar yer değiştirir; bina dış ölçüleri de değişebilir. Köşelerdeki uç parçalar makas/H birleşimine göre yeniden kesilir. Diğer kalınlıklarda gerçek kalınlık ve yarısı kullanılır. Bu karar, 5.9.18'deki duvar koordinatlarını ve köşe yönünü dondurma davranışının yerini alır.

## Kaynaklar

- Beş kullanıcı görseli `referanslar/2026-10-07-makas-kose-u/` altında. İlk dördü yön/kademe hatası, beşincisi U çiziminde uzaktaki duvar hizasına tam dik yakalama isteği.
- Orijinal yollar, boyutlar ve SHA-256: [kaynak envanteri](2026-10-07-makas-kose-kaynaklari.json). Kopyalar hash ile doğrulandı; orijinaller taşınmadı veya değiştirilmedi.
- Testte kullanılan iki JSON: `cizimler/2026-10-03-is-kayit-6-5.9.36.json` ve `cizimler/2026-10-02-tuna84-dwg-esleme-taslak.json`. Bunlar son canlı müşteri planı ilan edilmez.

## Neden ve düzeltme

1. Eski yön değiştirme işlemi `koseTers` değerini tersleyip köşe direğinin fiziksel yönünü sabit tutuyordu. Şimdi köşe payları ortak üretim yönünden hesaplanır; bağlı bina düğümleri ve açıklık konumları yeniden yerleşir. Ara H sınırları taşınır, uç kesimler yeni köşe yüzlerinden hesaplanır. Ara panelin ölçüsünü değiştirmek veya çok küçük bir uç paneli tüketmek gerekiyorsa işlem geri alınır ve açıklama gösterilir. Kapı/pencere ölçüleri değişmez; daha önce tek panoda kalan açıklık yeni H ile bölünemez.
2. Ekranda köşe sembolü aks merkezinde, CAD'de dış tarafa kaydırılmış çiziliyordu. İkisi artık aynı `pfKoseRect` geometrisini kullanır.
3. Açık kademeli çizimde karşılıklı köşe payı 125,5−5−5=115,5 cm parçayı doğuruyor, kontrol bunu reddediyordu. Yalnız gerçekten aynı uç koordinatını paylaşan paralel hatların payı kabul edilir; genel ölçü toleransı gevşetilmez.
4. Çatının 180/270 dereceye dönüşünde yarım modüllü uç, makas başlangıcını kaydırabiliyordu. Dizilim küçük dünya koordinatından başlar; numara sırası da aynı yönde ilerler. Mesnet kontrolü her ana/yavru makasın kendi aksını kullanır.
5. Ana çatı referans sınırı, bağlı yavrunun U noktaları ve veranda çatı tabanı bina değişimine birlikte uyar. Plan/kesit/3B aynı çatı nesnelerinden üretilir.
6. U'nun üçüncü noktasında, tam bir duvar köşesine yakın değilken uzaktaki köşenin hizası yakalanmıyordu. Artık duvar ve ana kenar uçlarının hizaları U ön kenarına izdüşürülür. Etiket: “Duvar hizası · ana kenara dik”. Son nokta aynı ana kenara tam dik döner. Yanlış dördüncü tıklama yine reddedilir; kot/eğim veya gerçek kesişim hataları gizlenmez.
7. CSV/XLSX sürüm bilgisi sabit metin yerine proje kaydının uygulama revizyonundan alınır. Dört eski PNG testi, mevcut çıktı penceresindeki Oluştur/indir adımına uyarlandı; uygulamanın PNG davranışı değiştirilmedi.

## Kontroller ve sonuçlar

- Paket testlerinin tamamı geçti: temel 31/31, prefabrik 77/77; görünüm, tefriş/mutfak, çatı, mimari, katmanlar, veranda, U ve 3B kaplama dahil. Eski PNG testlerindeki bekleme hataları düzeltildikten sonra kalan seri tamamlandı.
- `production-direction`: 6/10/15 cm kalınlıklar, aynalı/döndürülmüş 12 yeni kademe, iki yönde dönüş, dört ardışık çatı dönüşü, ara çizimde yön değişikliği, bağımsız iki bina, açıklık, geri/ileri alma, JSON, bağlı ana/yavru sınırları. Kaynak ve dağıtım dosyasında geçti.
- `roof-child-snap`: mevcut fiziksel köşe yakalaması ve hatalı son nokta reddine ek olarak dört yönde uzaktaki duvar hizasına sapmalı fare tıklamaları; dört kenar dik ve çatı oluşuyor.
- `roof-snap`, `roof-child-u`, `roof-workflow`, `roof-gable-boundary`, `loading-purlin`, `loading-h`, `loading-corners`, `loading-list`, `plan-export`, `cad-boundaries`, `cad-export` geçti. Son U değişikliğinden sonra etkilenen U/snap/workflow testleri tekrar geçti.
- Standart 10 cm dikdörtgen: dış 512×522 cm → 522×512 cm; 16 tam panel aynı ölçüde. Köşe payları 5+5 / 10+10 yer değiştirir; makas/H uyarısı yok.

| Kayıtlı örnek | Panel adedi önce → sonra | Ara panel ölçüleri | Yeni açıklık/H bölünmesi |
|---|---|---|---|
| İş kayıt 6 | 80 → 80 | Korundu | Yok |
| Tuna kontrol taslağı | 49 → 49 | Korundu | Yok |

## Açık sınırlar ve sonraki adım

- Özel/geniş pencere panoları makas modülüyle her durumda uyuşmaz. İş yedeğinde yön dönüşü sonrası e79, Tuna taslağında e142/e100/e135 hatları mesnet kontrolü ister. Bunlar köşe yönü hatası giderildi diye kapatılmadı; DEV-011 sürer. Tam üretim onayı değildir.
- Elle taşınmış makaslar önce otomatik aksa döndürülmelidir. Ara panel ölçüsü/açıklık korunamayan dönüş güvenli biçimde reddedilir. Eğik eski çatıların sınırı ortak yön için yeniden çizilmelidir.
- Tefrişler/tezgâhlar bağımsız plan nesneleri olmaya devam eder; bina ölçüsü değişince yerleşimleri kontrol edilmelidir.
- Canlı tarayıcı çizimi değiştirilmedi veya yenilenmedi. Görseldeki hata kontrollü örnekle sınandı; son canlı JSON olmadan o çizimin tamamı doğrulandı denmez. DEV-043 açık.
- Kullanıcı önce Kaydet ile JSON almalı; güncel `github-calisma/dist/plan_studio.html` yenilenip dosya açılmalı. Kodun GitHub aktarımı ile müşteri çiziminin aktarımı ayrı işlerdir.
- İlgisiz takipsiz `analizler/2026-10-03-ic-kapi-panolari.png` korundu, bu teslim kapsamına katılmadı.
