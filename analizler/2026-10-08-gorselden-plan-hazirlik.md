# DEV-078 — Görselden Plan Oluştur: giriş/doğrulama / 5.9.92

Durum: ilk aşama tamam; otomatik görsel tanıma ve gerçek plan üretimi AÇIK. Kullanıcının devam talimatıyla ayrı arayuz-deneme dalına giriş ekranı eklendi. Bu teslim bir görsel tanıma motoru değildir; arayüz bunu açıkça belirtir.

Görsel yükleme, açık referansı kullanma ve diyalog açıkken görüntü Ctrl+V desteklenir. Ölçü birimi açık m/cm/mm seçimi; dış en/boy seçilen birimde, duvar yüksekliği ve iç/dış kalınlık cm olarak etiketli. Prefabrik en yakın standart veya birebir/özel kesim tercihi; hafif çelikte bu alan gizli ve exact yaklaşımı. Çatı tipi, makas dizilimi ve eğimi zorunlu. Ölçü şeması oda planı gibi sunulmaz. Girdi değişince önceki önizleme/onay geçersizleşir.

Görsel dahil hazırlık ayrı formatlıJSON indirilebilir; normal proje JSONu değildir ve mevcut plana uygulanmaz. Form metre/cm/mm girdilerini merkezi cm sözleşmesine dönüştürür. Açıklık, oda, ara duvar ve özel pano üretimi henüz yok. Mevcut çizim snapshotı değişmez. Eski5.9.87korunur.

## Sürdürülebilirlik kararı ve bekleyen bağlantı

Kullanıcı en sorunsuz/sürdürülebilir yöntemi istedi. Öneri: yapay zekâ yalnız gözlem/ölçü adayları çıkarır; kesin birim, geometri, panel ve aks hesabı programın test edilen kurallarında kalır. Belirsizlikler kullanıcıya gösterilir. Sağlayıcıya bağımlı olmayan ara veri modeli ve sunucu üzerinden değiştirilebilir servis adaptörü; anahtar HTML/JSONa gömülmez. Servis bağlantısı ve olası ücret için mevcut API hesabı soruldu; yanıt bekleniyor. Henüz görüntü harici bir servise gönderilmedi ve ücretli servis kurulmadı.

Sonraki iş: güvenli servis bağlantısı, kaynak görüntü konumuyla ilişkili duvar/ölçü/açıklık adayları, aday düzenleme ve ölçü kısıt çözümü; üç üretim yolunu mevcut motorla doğrulama; kullanıcı onayı sonrası tek işlemde normal plan nesneleri üretimi ve geri alma. Bunlar tamamlanmadan DEV-078kapatılmaz.

Kontroller: tests/image-plan-brief.cjs üç birim eşdeğerliği, virgüllü ondalık, zorunlu alanlar, sınırlar, üç yol seçimi; gerçek referans görseliyle diyalog, önizleme, değişiklikte onay sıfırlama, hazırlıkJSON indirme ve mevcut çizimin korunması geçti. Görsel artifacts/image-plan-brief.png üzerinden incelendi. Dağıtım yeniden üretildi.
