# Tüm çatı tipleri ve ortak montaj planı — 4 Ekim 2026

## Kullanıcının hedefi
Tüm çatı sistemlerinde aşık yerleşimi/hesabı çalışmalı. Kullanıcının sağlayacağı örnek montaj çizimleri esas alınarak4200ve3000mm aşık parçaları iki farklı renkte, bindirmeleriyle otomatik çizilmeli. Makaslar ve hesaplanan diğer üretim malzemeleri de aynı montaj çizimi sistemine dahil edilmeli. Bu çalışma yalnız metraj değil, montajcıya kullanılabilir parça yerleşimi üretmeyi hedefler.

## Mevcut kod incelemesi
src/roof-core.js purlinRuns yalnız dikdörtgen beşik çatı için otomatik; diğer biçimler ve outline açık kontrol satırı verir. Çatı yüzey motoru beşik/tek/kırma ve çokgen/birleşim geometrisi üretir, ancak yüzey desteği aşık montaj desteği demek değildir. purlinStock stok sayısı ve toplam fazla/bindirmeyi optimize eder; profil sırası,başlangıç/bitiş ve tekil ek konumları üretmez. src/roof-workflow.js makas koordinatlarını içerir. Plan DXF/PDF dışa aktarma altyapısı vardır; renkli montaj paftası henüz yoktur. Görsel aksamalar geçerli imalat kuralı diye kabul edilmez.

## Ortak veri düzeni
Önce gerçek çatı yüzeyinden sıra hatları; sonra her sıra için stok parçaları; sonra parça başlangıç/bitişleri ve tekil ekler. Her kayıtta kalıcı kimlik,çatı bölümü,sıra,stok boyu,gerçek3Bkonum,başlangıç/bitiş,komşu parça,bindirme boyu ve bağlı makas/mesnet kimlikleri bulunmalı. Yükleme adedi ve montaj çizimi bu aynı kayıtlardan türetilmeli. Ayrı çizim motorunda yeniden malzeme adedi hesaplanmamalı.

4200ve3000mm farklı renk ve ayrıca yazılı stok etiketi/çizgi ayrımı taşımalı; siyah beyaz baskıda da ayırt edilebilmeli. Lejant,parça/sıra numarası,ek detayındaki bindirme ölçüsü,makas aksları ve temel referans ölçüler bulunmalı. Montaj paftası PDF ve düzenlenebilir DXF; tablolardaki parça kimlikleri aynı olmalı. Kullanıcının örnek antet/renk/ölçülendirmesi geldiğinde esas alınmalı, şu anda renk standardı kesinleşmiş sayılmaz.

## Genel çatı desteği için sıra
1. Tek eğim: yüksek uçta120mm mahya kuralını kendiliğinden kullanma; yüksek uç bağlantısını örnekle doğrula.
2. Kırma: eğik mahya/dere sınırlarına son sıra ve parça uçlarını doğrula; beşik mahya120mmnin her kenara aynen aktarılması varsayılmasın.
3. Serbest sınır,L/T,ana-yavru/veranda: her sırayı görünür gerçek yüzeye böl; boşlukları geçirme,örtülen ortak yüzeyde çift sayma. Saçak payı bir kez.
4. Stok parçalarını fiziken yerleştir: toplam bindirmeyi gerçek ek konumlarına dağıt; örnekteki makas mesnet/ek yerleşimi esas alınmalı. Kullanıcı sabit bindirme vermedi, toplam fazlalık dağıtılır; bu ekin her yere konabileceğini tek başına doğrulamaz.
5. Aynı veriyle makas ve diğer parçaların paftaları.

## Kabul kontrolleri
Her örnek için sıra sayısı,profil boyları,tekil eklerin toplamı,kaplanan net boy,yükleme3000/4200adetleri ve çizimdeki parça sayıları eşit olmalı. Hiçbir parça çatı dışında/boşlukta kalmamalı; kısa boy ve üst üste gelen yüzeyler açık gösterilmeli. Yön dönüşü,eğim,bina boyu/saçak/kaplama değişimi,manuel düzenleme,JSON kaydı ve PDF/DXF çıktısı birlikte kontrol edilmeli. Örneklerle doğrulanmadan tüm tiplerde sorunsuz çalışıyor veya imalat onaylı denmez.

## Açık girdiler ve durum
Kullanıcı örnek montaj çizimlerini daha sonra vereceğini bildirdi; bu tur yeni montaj DWG/PDF alınmadı. İlk örnek için aşık stok/parça/ekleri ile makas aksları birlikte görünen çizim uygun. Bilinen üretim kuralları yeniden sorulmayacak; sadece yeni tiplerin özel uç ve ek detayları örneklerden öğrenilecek.
DEV-033 tüm çatı tipi geometrisi açık; DEV-034 ortak montaj veri modeli ve otomatik renkli paftalar açıldı. Bu tur kapsam/mimari kaydıdır, kod değişmedi;5.9.50korundu. Canlı çizim ve kullanıcı JSONu değiştirilmedi.
