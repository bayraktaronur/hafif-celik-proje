# SketchUp özel karkas eklentisi — başlangıç kuralları

12 Ekim 2026 kullanıcı onayı. Bu klasör henüz kurulabilir eklenti veya MCP sunucusu değildir.

profile-rules.json dıştan dışa C kesitlerini ve prototip geçme hesabını tutar. İçeri giren ve dışta kalan nominal kesit aynıdır; geçme uç kesme/ezmesiyle sağlanır.

Toplam deneme boşluğu 0,5 mm. Her yanda net daralma dışta kalan profilin sac kalınlığı + 0,25 mm'dir. 90 mm kesitte sırasıyla 0,8 / 1 / 1,2 / 1,5 / 1,8 mm dış profil sacı için hedef uç genişlikleri 87,9 / 87,5 / 87,1 / 86,5 / 85,9 mm'dir. İçeri giren profil kalınlığıyla dış profil kalınlığı karıştırılmamalıdır.

Bu değer kalıp derinliği değildir. Büküm köşeleri, tolerans ve yaylanma hesaba katılmış değildir; numune geçme testi gereklidir. Ezme derinliği/boyu henüz bilinmiyor. Çizimdeki 15 mm ezme konumları kullanıcı tarafından ölçülü olarak doğrulanmadı.

90×45×12,5 mm kesitte dudak kesme başlangıcı uçtan 50 mm; açı geçici 45°. Kesme boyu/geometrisi henüz kesin değil. Diğer kesitlere bu uç detayı otomatik genellenmez.

Sonraki iş: mevcut SketchUp modellerinin bileşen yapısını salt okunur inceleyen araç, ardından tek panel prototipi; gerçek uç işlemleri ve imalat çıktıları ayrıca doğrulanacak. Açık modeller ve Plan Studio kodu değiştirilmedi.

## 0.1.0 prototipi — 12 Ekim 2026
Kurulabilir paket: prefabrikten-karkas-0.1.0.rbz. Kaynak: prefabrikten_karkas.rb ve prefabrikten_karkas/. Kullanıcı eklenti klasörüne kopyalandı; main.rb SHA256 eşleşti. Açık projeler nedeniyle SketchUp yeniden başlatılmadı.

Extensions > Prefabrikten Karkas 0.1.0 menüsü: boş/kaydedilmemiş modelde C profil oluşturma; mevcut model için salt okunur üst seviye JSON raporu. Ölçüler mm, nokta/virgül girişi desteklenir. Profil tek geri alınabilir gruptur, boy ve kesit bilgisi özniteliklerde tutulur. Geçme hedefi dışta kalan profil kalınlığından hesaplanır; henüz geometrik ezme/kesme uygulanmaz. Keskin köşe yaklaşımıdır; büküm yarıçapı yok.

Kontrol: node sketchup-plugin/verify.cjs (depo üst klasöründen node github-calisma/sketchup-plugin/verify.cjs) 35 kesitte alan/dış ölçü ve 175 geçme hesabını doğruladı. Test betiği her çalışma dizininden çalışır. Ruby çalışma zamanı, menü yüklenmesi, modelde katı geometri ve rapor kaydı henüz canlı SketchUp'ta doğrulanmadı. Bu paket imalata hazır sürüm değildir. MCP henüz yok.

