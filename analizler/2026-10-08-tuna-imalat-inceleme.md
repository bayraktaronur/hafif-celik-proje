# Tuna 84 m² — imalat projesi incelemesi / DEV-076

8 Ekim 2026, iş bilgisayarı. Uygulama 5.9.90; bu teslim analizdir, kod değiştirilmedi.

## Kaynak ve kapsam

Kullanıcının verdiği kaynak: referanslar/tuna-84m2/SP - 202600185 - Tuna Pref. 84m².dwg. SHA-256: 7f0ac72fce090585d14e87fc77c44787c43f76e5b3eee6896a1f3c33b38465e2. Önceki 2 Ekim kaydıyla aynı dosya. AutoCAD 2026 Core Console geçici kopyayı açtı; özgün model alanı yazıları ve ölçü nesneleri yeniden okundu. [Nesne kimlikli kanıt](2026-10-08-tuna-imalat-kanit.json). Kaynak değiştirilmedi. Bu inceleme tam grafik/pafta ve tüm blok içi kesit denetimi değildir. Statik yeterlilik, bağlantı hesabı ve bütün ürün adetleri doğrulanmadı. Yanındaki Excel/PDF bu çalışmada yeniden incelenmedi; eski rapordaki sayılar yeni doğrulanmış adet sayılmadı.

## Doğrudan DWG içinde doğrulananlar

| Bölüm | Kaynak kanıtı | Programa etkisi |
|---|---|---|
| Montaj ve elektrik planı | 38BADC | Panel/montaj konumu ve elektrik bilgisi aynı proje kimliğine bağlanmalı. |
| Makas yerleşim planı | 38BADD | Plan konumu ile üretilen makas tipi eşleşmeli. |
| Duvar omegası yerleşim planı | 39E0C3 | Omega sadece toplam metre değil konum, tip ve parça boyu olarak çıkmalı. |
| Karkas detayları | 3A46AD; 40'lık karkas 3A43AF; 80'lik karkas 3A44FE; kapı kasası takılacak 3A43B1 | Kapı/pencere panosu kendi imalat bileşenlerine ve işlem notlarına sahip olmalı. Bu isimlerden sac kalınlığı/kesiti tahmin edilmemeli. |
| PVC sipariş formu | 38BB71; pervazlı, menteşeli sineklikli, çift açılır 39E315/39E349 | Açıklık nominal ölçüsü, pano ölçüsü ve PVC sipariş ölçüsü ayrı tutulmalı; aksesuar/açılma siparişe yazılmalı. |
| Veranda profilleri | 39A53C–39A545:100×100,2700,2520,640,4970 etiketleri | Direk/kiriş tipi ve net/sevk boyu ayrılmalı; bütün100×100ler aynı parça değil. |

Teknik özellikler: yükseklik2500 (38BAF4), dış duvar100'lük (38BAF7), iç60'lık (38BAFA), pres panel (38BAFD), beşik çatı (38BB00), çelik dış kapı (38BB09), Amerikan iç kapı (38BB0C). Çatı notu “Antrasit Gri Trapez / Osb+Nem Bariyeri” (38BB79,3A5990); teknik kutuda Osb+Tyvek (3A4AB2). Özel isteklerde sıva altı elektrik, WC'lerde yeşil alçıpan ve bina içi alçıpan yazıyor (38BAE4). Bunlar bu projenin verileridir; kullanıcının diğer projelerine uygulanacak talimat değildir.

Makas etiketleri:
- Baş Makas1adet,100'lük omega:39B3EE.
- Orta Makas6adet,omegasız:39B3EF.
- Özel Baş Makas1adet,100'lük omega:39B616.
- Cumba Baş Makas1adet,100'lük omega:39C1EA.
Bu dört etikette toplam9makas tarif ediliyor. Yerleşim planındaki her aksla tam birebir eşleme henüz yapılmadı; doğrulanmış otomatik BOM diye sunulmamalı.

## Önemli ayrımlar

1. Tek dosyada birden fazla plan ve görünüş var. Model alanındaki143INSERT veya80omega gibi tüm-dosya sayımları evin üretim adedi olamaz. Aynı fiziksel parça farklı paftalarda tekrar çizilebilir.
2. Pencerede160/120 etiketi ile1660pano etiketi birlikte bulunuyor (39A51C/39A51E). Başka nominal etiketler119/120 (39A526 vb.) ve60/40 (39A52E). Programın varsayılan120cm açıklığına kayıtsız eşitlemek yanlış olur. Sipariş formundaki kesin net PVC ölçüsü ayrıca kontrol edilmeli.
3. Duvar yerleşim boyu, panel net kesimi, karkas dış ölçüsü ve açıklık ölçüsü aynı alan olmamalı. Önceki Drawing1/Excel analizi de bu ayrımı göstermişti; o analiz ayrı kaynaktır.
4. Teknik kutudaki çatı kaplaması satırı yalnız renk ifadesi taşıyor; daha açık trapez/OSB/membran notuyla birlikte okunmalı. Metin çelişkisi sessiz varsayımla kapatılmamalı.

## Bizim programdan üretilecek paket için öneri

- Kapak/teknik şartlar: proje/sipariş/revizyon, yükseklik, duvar tipleri, çatı katmanları, özel istekler.
- Panel imalat: her tipe kod; kalınlık, yükseklik, yerleşim eni, net kesim, açıklık ölçüsü/yeri, karkas, adet. Özel panolar ayrı çizim.
- Montaj: aynı panel kodları üzerinde H/U/köşe, yön ve aks koordinatları.
- Makas: baş/orta/özel/cumba kodları ve plan konumları; her tip için ölçülü imalat görünüşü ve doğrulanmış bileşen kesimleri. Mevcut makas yerleşimi tam profil imalatı anlamına gelmez.
- Omega/çatı tamamlayıcıları: konum paftası ile kesim/stok tablosu bağlantısı.
- PVC/kapı siparişi: net sipariş ölçüsü, adet, açılma, pervaz, sineklik, malzeme/renk.
- Yükleme: yukarıdaki tekil parçalardan türetilen stok, kesim, yedek ve manuel kalemler; çizim tekrarları yeniden sayılmaz.

Öncelik tek nesne kimliği ve revizyondan tüm çıktıları üretmek. Yeni pencere yerleştirildiğinde panel detayı, montaj planı, PVC siparişi ve yükleme listesi aynı revizyonda güncellenmeli. Öneriler bu teslimde uygulanmadı. Önceki açık işler korunur.
