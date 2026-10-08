# Ortak ölçü çözümü ve yerel okuyucu — 5.9.95
8 Ekim 2026, iş PC. DEV-080 **kısmen tamamlandı**. Yerel kurulum/test isteği tamamlandı; güvenilir otomatik görselden çizim hedefi tamamlanmadı.

## Kaynak ve kapsam
Kullanıcı dış 8×8 ile iç 3+2+3 / 4+4 ölçülerinin aynı hesapta prefabrik standartlarına uymasını istedi. Çizgi temizleme işini elle yaptıran eski yaklaşımı yavaş buldu. Ollama ve yaklaşık 6.1 GB model kurulumunu açıkça onayladı.
Kaynak: referanslar/gorselden-plan/musteri-el-cizimi.png. SHA-256: fa1abea9ff6dea0c4315e2e5c60fce4864f227ef56aebee58613ec5031a5d6a1. Özgün kaynak yolu kaynak.json dosyasında.

## Tamamlanan hesap
src/image-plan-joint.js dış ölçü ve bölge zincirlerini birlikte çözer. 62.75 cm birim adetleri üzerinde dinamik programlama; bölge sapmaları ve dış ölçü sapması birlikte puanlanır. Köşe payı makas yönüne göre k/2k olarak kullanılır. Bu yakın geometrik/modüler çözümüdür; küresel imalat maliyeti optimumu iddiası değildir. Net oda ölçüsü ile dış sınırı paylaşan bölge ölçüsü eşit sayılmaz.
Kontrollü duvar fixture testinde 800×800, 300+200+300, 400+400 → 825.75×773 cm; X318.75+188.25+318.75, Y386.5+386.5. Gerçek panel motorunda 5 oda, pozitif ve125.5 cm'yi aşmayan parçalar, boş Modular.inspect ve undo doğrulandı. Bunlar otomatik görsel okuma sonucu değildir. Koridor gibi ölçüsü verilmemiş alanlar hâlâ geometrik tahmindir; işlevsel yeterlilik garantisi yok.

## Yerel kurulum
Resmî Ollama Windows yükleyicisinin Authenticode imzası Valid kontrolünden sonra kuruldu.
İlk qwen3-vl:8b etiketi Thinking sürümüne çözüldü; yanıt sınırına takıldı. Ardından qwen3-vl:8b-instruct kuruldu (resmî etiket digest öneki0533d74300e4). İki model de bilgisayarda kaldı; toplam yaklaşık12.2 GB model, ayrıca runtime alanı kullanılır. Kullanıcı64GB RAM/RTX4080Laptop GPU. Diğer PC kurulumu doğrulanmadı.
tools/start-local-plan-reader.ps1 oturumluk, gizli yerel süreçleri başlatır. Yeniden başlatma sonrası tekrar çalıştırılır; otomatik başlangıç kurulmadı. Node.js gerekir; bu PC mevcut çalışma ortamı Node.js kullanır.
Köprü127.0.0.1:11435 sadece sabit modele /api/chat iletir; asıl Ollama11436, OLLAMA_NO_CLOUD=1. Yönetim uçları tarayıcıya açılmaz. Bulut fallback yok. Model/runtime/yükleyici Git'e eklenmedi.
Kaynaklar ve kurulum: tools/LOCAL_PLAN_READER.md.

## Gerçek çizim testi — BAŞARISIZ
Her iki model de kaynak görselle gerçekten çalıştırıldı; mock başarı gerçek tanıma başarısı sayılmadı.
- İlk model tekrar eden sorular ve yanıt kesilmesi üretti.
- Instruct ilk denemede tekrar eden duvarlar üretti; tekrar ayarı düzeltildi.
- Sonrasında 3+2+3/4+4 doğru çıkabildi; ancak iç duvarlar görsele uymadı, uçlar açık kaldı.
- Tam görüntü0..1000 koordinat sözleşmesine geçildi; son doğrudan testte yanlış birim/şekil ve yanlış duvarlar döndü. Ham sonuç: 2026-10-08-yerel-okuyucu-ham-sonuc.json.
- Gerçek tarayıcı düğmesi, aynı kaynak ve kullanıcı ölçü açıklamasıyla10817ms'de döndü. Dikdörtgen kaynağı dikdörtgen olarak doğrulayamadı; önizleme/aktarım yapılmadı. Mevcut modelin aynen kaldığı assertion geçti. Otomatik plan üretme assertion başarısız. Sonuç: 2026-10-08-yerel-okuyucu-tarayici-sonuc.json.
Bu yüzden arayüz açıkça geliştirme aşaması/deneme olarak işaretlendi. Güvenilir otomatik çizim hazır değil. Daha büyük modele geçmenin sorunu kesin çözeceği varsayılmıyor.

## Kontroller
Geçenler: image-plan-joint (ortak zincir, makas yönü rotasyonu, exact/hafif çelik, sözleşme yanıtlı UI, gerçek panel motoru, önizleme koruması, eski okuma iptali, undo); image-plan-offline; image-plan-brief; local-plan-bridge; build; diff kontrolü.
Başarısız kalan kabul testi: image-plan-live-browser (gerçek tanıma). Opt-in testtir; sonucu saklamak için başarı kriteri gevşetilmedi.
Canlı kullanıcı tarayıcısı yenilenmedi/değiştirilmedi. Deneme branch codex/arayuz-duzeni, ana5.9.87 korundu.

## Açık işler / sonraki adım
Tek model çağrısından koordinat üretmek yeterli olmadı. Duvar adaylarının görsel kanıtla eşlenmesi, oda komşuluk ilişkilerinin ayrı çıkarılması ve topolojik doğrulama birlikte geliştirilmeli; aynı kaynakla 5 oda/koridor/banyo bağlantıları tekrar kabul testinden geçmeli. Yanlış çıktıyı elle doğru fixture'a dönüştürüp otomatik başarı olarak sunma.
Kapı/pencere nesneleri, oda adları, otomatik çatı geometrisi, çokgen dış sınırın otomatik okunması ve çevrimiçi alternatif açık. Önceki açık işler korunur.
