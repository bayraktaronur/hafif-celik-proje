# Kaydet ve alçıpan — 5.9.109 / DEV-111

Kalıcı kullanıcı kararı: tavan/duvar alçıpan siparişi 120×250 cm (3 m²) levhadır. 60×125 cm yalnız döşeme geometrisidir. Metraj ve kenar özeti 3 m² üzerinden düzeltildi; yükleme listesi zaten bu ölçüyü kullanıyordu. Tavan çizim geometrisi değiştirilmedi.

Kaydet her seferinde destekleyen tarayıcıda showSaveFilePicker ile dosya adı ve konum seçtirir. İptalde indirme yapılmaz. Yazma/kapama başarısızsa kayıt tamamlandı denmez; beklerken değişen çizim kayıtlı işaretlenmez. API yoksa veya erişim engellenirse JSON indirme korunur. Açık in-app tarayıcıda yerel dosya erişimi engelli olduğundan gerçek işletim sistemi iletişim kutusu doğrulanmadı. tests/save-as.cjs API taklidiyle seçim, yazma/kapama, iptal, hata, eşzamanlı düzenleme ve gerçek indirme geri dönüşünü doğrular.

Zonguldak kaynağı: C:/Users/ONUR/Downloads/Zonguldak.json; SHA256 F8F6F65BF6E65535590E672FD851502AE6E510876F51DC4C2F25B90CF05D7E48. JSON prefabrik, 280 cm; duvar alçıpanı yok (banyo/WC standart). Kullanıcı ekranında Tüm odalar seçili. Kaynak değiştirilmeden ayrı hesaplama oturumunda yalnız alciDuvar=hepsi uygulanmıştır; canlı çizim geometrisi doğrulanmadı.

| Kalem | Net m² | %10 fireli 120×250 levha |
|---|---:|---:|
| Beyaz duvar | 286.545 | 106 |
| Beyaz tavan | 99.23765 | 37 |
| Yeşil duvar | 47.43 | 18 |
| Yeşil tavan | 8.58665 | 4 |
| Toplam | 441.7993 | 165 |

Adetler her kalemde ayrı yukarı yuvarlanır; kesim optimizasyonu değildir. JSON seçimi aynen korunursa beyaz duvar hariç 59 levhadır. Kapı/pencere toplamları 9/9; önceki ölçü listesiyle aynı. Müşteri kaynağı bu teslimde depoya kopyalanmadı. Canlı çizime müdahale edilmedi.
