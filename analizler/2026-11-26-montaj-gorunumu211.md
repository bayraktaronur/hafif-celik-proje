# Taslak 211: montaj görünümü düzeltmesi

TUNA74-3D-AUDIT kısmen giderildi. Bağımsız beşik çatıların kesişiminde görsel örtü, komşu saçak altında kendi gerçek yüzeyine devam eder. RoofCore yüzeyleri, proje verisi ve metraj hesapları değiştirilmez. Kesit görünümüne uygulanmaz. Plan veranda kirişinin üstü bağlı çatının duvar üst kotuna, altı 10 cm aşağıya alınır. Direklerin boyu korunur. Trim datumlu beşik/kırma saçak altı duvar üst kotunda yataydır.

Kontroller: test-mounted211.cjs yapay geometriyle devam yüzeyi, alan, girdi değişmezliği, tek çatı izolasyonu, kiriş ve yatay saçak kontrolü geçti. roof-trims ve roof-gable-boundary mevcut testleri geçti. Yerel kayıtlı çizim öncesi/sonrası tam proje, çatı modeli ve 61 malzeme satırı birebir aynı. Yeniden yükleme sonrası liste aynı; tarayıcı hatası yok. Üst birleşim ve alçak kamera yakın görünüşleri incelendi. Kullanıcının açık tarayıcısının kaydedilmemiş durumuna müdahale edilmedi; ayrı yerel HTML teslimi. Müşteri çizimi ve karşılaştırma JSONları depoya alınmaz.

Açık: gerçek saçak/Alın V özgün 3B dosyası entegrasyonu tamamlanmadı. Referanslar: referanslar/2026-10-07-alin-v, 2026-10-07-alin-v-montaj, 2026-10-08-sacak-kapama. Eski sohbet 7 Ekim kaydı 8/12/22-40 cm formu ve eksik küçük kıvrımları doğruluyor. Dere/iniş STL dosyası mevcut; bu saçak kapaması modeli değildir. Ayrı saçak STL/SKP bu aramada bulunamadı. Gerçek büküm profili tamamlandı denemez. Önceki açık hesap ve kaynak işleri korunur.

Kaynak SHA-256:
```
taslaklar/odak-atolyesi/mounted-soffit.js 9b432d394984ed188b70b4ea0bc46a9cd85fd04dce3e6f3c978161548688247e
taslaklar/odak-atolyesi/plan-veranda-beams.js 8602a0a3eaba643199ec544938a172736e6b9680fa9a6a5d6e0cdf1da00d3f2a
taslaklar/odak-atolyesi/mounted-details-build.cjs 0bf738677920dbe7a89cce00f883a124d4de5b77e1919854d2421e47c45ad6f8
taslaklar/odak-atolyesi/single-engine.js b5a6600303aa63a3e85677c10e7324a70194aeb35df612e87b63d13acff1a7c8
taslaklar/odak-atolyesi/single-storey.js 8054c9b9875b200859b5355f2c15926cf2b8187cab4071724abbb583883c7b2e
```
