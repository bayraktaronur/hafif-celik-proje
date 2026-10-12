# Hafif çelik rollform makineleri ve duvar profili araştırması

Tarih: 12 Ekim 2026. DEV-094. Kaynaklar üreticilerin resmî ürün sayfaları ve kataloglarıdır; aşağıdaki ölçüler her markanın kendi gösterimidir, dıştan dışa ölçü tanımı ayrıca doğrulanmalıdır. Satın alma önerisi veya makineye hazır üretim reçetesi değildir.

## Bulgular ve firmalar

| Üretici / örnek | Kesit ve kalınlık | Bizim kesite ilişkin sonuç |
|---|---|---|
| UNBAK IC-5000 Series Pro | Gövde60/90/150/200/250mm veya özel; kanat50/60/70mm veya özel; S350–S500 sac, en çok2,5mm | 45mm kanat/12,5mm dudak özel kesit çizimiyle teyit gerekir. 60–150 ve0,8–1,8 hedefimiz katalogdaki standart tek kesit değildir. |
| Arkitech AF1600P | C/U, katalogda63–150mm; kanat41–51mm; dudak10mm'ye kadar;0,75–1,6mm. Tek kesit makinesi; listelenen ölçüler satın alma konfigürasyonlarıdır. | 90/100/140/150 yakın;12,5mm dudak ve1,8mm standart katalog kapsamında doğrulanmadı. Güncel ürün sayfası92mm de listeler. |
| Howick FRAMA3200 | Örnek89×41/39×10;100×41,3×10;150×45×10mm. Teknik tabloda0,75–1,15mm. | 90×45×12,5 birebir standart değil. Başlıktaki1,2mm/18ga ifadesini1,20mm kesin kapasite sayma. |
| Howick FRAMA5600 | Daha geniş/ağır özel kesit; teknik aralık0,95–1,55mm, pazarlama metninde1,6mm |1,8mm kapsamı doğrulanmadı;3200ile aynı profil varsayılmaz. |
| FRAMECAD F325iT |63/89/92/152mm popüler özel konfigürasyonlar;1,20mm'ye kadar | Kanat/dudak açısı ve90×45×12,5 kesin ölçüleri ürün sayfasından doğrulanmadı. |
| FRAMECAD F450iT |75–150mm; eski resmî katalogda0,70–1,6mm | Güncel ürün sayfası11takım+özel opsiyon der;1,8mm ve tam kesit teyitsiz. |
| Scottsdale ScotPanel |5090:90×46×10mm;7090:90×37×7mm;8140:140×46×10mm. Sayfa ilk seriler0,55–1,15;8serisi1–1,6mm;R2mm listeler. |90×45×12,5 ile aynı değil. Model bazında köşe yarıçapı ve gövde rijitleştiricileri var. |
| Scottsdale/Knudson KFS1220G3 | Gövde89–305,kanat41–89,dudak en çok25mm;0,84–2,7mm | Geniş ayar aralığı, ancak60mm gövde ve0,8mm bu aralığa girmez. |
| Pinnacle X3 |75×41×13 /90×41×13 /150×41×13mm;0,6–1,6mm;C+C veyaC+U |12,5dudağa yakın13mm var;45kanat ve1,8mm yine birebir değil. Sayfadaki3profil/Unlimited ifadeleri çelişkili; sipariş takımı netleşmeli. |

## Çıkan duvar profili

Makineden panelin tamamı yerine boyu kesilmiş, delikleri/çentikleri/yerel şekillendirmesi ve kimliği işlenmiş parçalar çıkar; panel montajı ayrı aşamadır. Burada incelenen sistemler arasında dudaklı C dikme/başlık/kayıt, dudaksız U alt-üst kanal ve aynı nominal C kesitlerin uç işlemle geçmesi gibi farklı düzenler bulunur. Her firma tek bir ortak C kesit üretmez.

Gövde,kanat,dudak,sac kalınlığı yanında iç büküm yarıçapı,dudak açısı,rijitleştirme oluğu ve ölçü referansı gerekir. Kullanıcının90×45×12,5 dıştan dışa kesiti korunur. Dudakların boy boyunca eğimli olduğu kullanıcı görselleriyle bildirildi; kesin açı ve12,5ölçü referansı ertelendi. Araştırma bu açıyı sayısal doğrulamadı. 45° uç kesimini boy boyunca dudak büküm açısı sanma.

## İşlemler

- Lip notch/lip cut: birleşim bölgelerinde dudak kaldırma; yerleşim ve takım geometrisi ayrı.
- Swage: profilin yerel daraltılması; aynı nominal profillerin geçmesini sağlar. Kalıp derinliği net daralmaya doğrudan eşit değildir.
- Notch/web notch: kesişen parçalara yer açan çentik; sürekli profil biçimi değildir.
- Dimple: vida/perçin bağlantı yuvası; Howick kaplama yüzeyinin düzgün kalmasıyla ilişkilendirir.
- Service hole/web hole/bolt hole/index hole: tesisat,bağlantı veya konumlama için farklı delikler.
- Chamfer/truss end/shear cut: köşe/çapraz uç ve boy kesme işlemleri; 45° ve50mm değerleri bütün makinelere ait evrensel standart değildir.
- Kimlik baskısı: panel/parça montajını destekler. Howick CSV girişini açıkça listeler; bu bilgi CSV kolon şemasını açıklamaz.

## Eklenti için uygulanacak veri düzeni

Profil tanımı ile makine işlem kataloğu ayrılmalı. Kesit alanları: dış ölçü referansı,gövde,kanat,dudak,dudak açısı,kalınlık,büküm yarıçapı,isteğe bağlı oluk. Parça alanları:panel/parça kimliği,boy,yön,baş/son uç. İşlemler ayrı liste:tip,parça boyunca konum,yüz,ölçüler,takım kimliği,kalibrasyon durumu.

Kullanıcının kabul ettiği toplam0,5mm boşluk ve her yanda dış profil sacı+0,25mm daralma yalnız prototip hedefidir. Üreticinin swage kalıbı standardı diye sunulamaz. Gerçek kesit,büküm,tolerans,yaylanma ve numune geçme ile doğrulanacak. CNC dosyası için belirli makine/yazılım sürümü,kolon/işlem kodları,referans ucu,birim ve örnek başarılı iş dosyası gereklidir.

## Belirsizlikler / sonraki işler

Kesin90×45×12,5üretici çizimi bulunmadı; kullanıcı numunesinin üretici/makinesi bilinmiyor. Dudak açısı,ezme kalıp geometrisi/uzunluğu,büküm yarıçapları ve50mm uç işlemin tam şekli açık. PDF ekran görüntüsü servisi Cache miss verdi; UNBAK katalog çizimleri bu tur görsel olarak incelenemedi. Kesin geometri kaynak sayfalardan çıkarılmadı. Araştırma uygulama koduna veya kullanıcı çizimine değişiklik yapmadı.

Önce profil ve işlem parametrelerini ayır; ardından tek panel prototipi. Makine alımı düşünülürse tüm7kesit×5kalınlık için numune üretim/kalıp değişimi matrisi istenmeli. Firma iletişimi kurulmadı.

## Resmî kaynaklar

- UNBAK: https://unbakmachinery.com/en/light-gauge-steel-framing-machine/
- UNBAK katalog (görsel erişim başarısız): https://unbakmachinery.com/media/eng/IC-5000SERIES_ENG.pdf
- Arkitech teknik: https://arkitech.com.tr/media/uploads/2024/07/AF1600P_EN.pdf
- Arkitech güncel: https://arkitechglobal.com/framer/single-profile-framers/af1600p/
- Arkitech işlem örnekleri: https://arkitech.com.tr/media/uploads/2021/11/Arkitech-Catalog.pdf
- Howick3200: https://www.howickltd.com/machines/frama-3200
- Howick5600: https://www.howickltd.com/asset/1061.pdf
- Howick tek/çok kesit: https://www.howickltd.com/resources/roll-forming-machine-buyer-guide/mini-guide-choosing-the-right-framing-system
- FRAMECAD325: https://framecad.com/steel-framing-machines/f325it
- FRAMECAD450: https://framecad.com/steel-framing-machines/f450it
- FRAMECAD eski katalog: https://content.framecad.com/hubfs/5447%20FRAM%20Manufacturing%20systems%20%26%20Software%20solutions.pdf
- FRAMECAD kontrol kılavuzu: https://knowledgehub.framecad.com/the-f-series-operating-manual
- Scottsdale kesitler: https://www.scottsdalesteelframes.com/scottsdale-machines/scottsdale-ecosystem-world-class-steel-rollforming-equipment-lgs-steel-framing-machines-and-software
- Knudson1220G3: https://www.scottsdalesteelframes.com/our-system/machines/knudson-by-scottsdale-kfs-framemaker-rollformers?brochure=true
- PinnacleX3: https://pinnaclelgs.com/machines/x3-systems/
