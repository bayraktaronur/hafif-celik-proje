# Prefabrikten Plan Studio — ortak devam kaydı

Güncel Plan Studio çalışması: 25 Ekim 2026, DEV-154 tek katlı taslağa referans görsel penceresi ve ölçülü çizim altlığı eklendi. [Rapor](analizler/2026-10-25-taslak-referans.txt). Ana uygulama 5.9.137, arakat taslağı ve kullanıcı çizimleri korunur.

Son güncelleme: 14 Ekim 2026, ev bilgisayarından iş bilgisayarına devir. Kullanıcı sonraki iş PC oturumunda devam edecek; ayrı Meta formuna geçiş onaylanmadı. Güncel CRM durumu ve sıradaki adımlar: [İş PC devir kaydı](analizler/2026-10-14-kommo-is-pc-devir.txt). Önceki uygulama ve SketchUp işleri aşağıda korunur.

Bu dosya farklı bilgisayarlardaki sohbetlerin aynı proje durumundan devam etmesi içindir. Sohbet geçmişini eşitlemez. Yeni çalışmada önce Git durumunu kontrol et, sonra bu kaydı ve ilgili raporları oku.

**Çalışma düzeni: gündüz iş bilgisayarı, gece ev bilgisayarı.** Aynı program dönüşümlü geliştirilir. Teslim geçmişi: [CALISMA_KAYDI.md](CALISMA_KAYDI.md).


## 14 Ekim 2026 — Kommo botu devir kaydı

Kaynak: ilk devirde kullanıcının verdiği özet. Aşağıdaki tarihsel kurulum/önceki testler kullanıcı beyanıydı; 14 Ekim ayrı bot çalışmasının güncel doğrulamaları dosya sonundadır.

| Kimlik | İş | Durum / tamamlanma koşulu |
|---|---|---|
| CRM-011 | Kommo iş bilgisayarına devir | Kayıt/rapor/kanıtlar ortak depoda; 84 kaynak PDF bu devirde kopyalandı ve SHA-256 eşitliği doğrulandı. 54 PDF yerel kopyası doğrulanmadı, kullanıcı çizimi Yeni proje (11).json aktarılmadı. [Devir ve sonraki adımlar](analizler/2026-10-14-kommo-is-pc-devir.txt). |
| CRM-010 | Dört ürün reklam/kaynak ayrımı ve gerçek teslim testi | KISMİ: 54 güncelv2 kaynağı19193 koşula eklendi(eski19183korunur); bahçe eski20103çiftbaşlatıcısı kaldırıldı,20335doğrudanformkaynağı19245iletekPDFbotu. 84başlangıcıdoğrudan1PDFadımınaalındı,kaydet/yenileme/WAönizlemegeçti. 67/84reklamIDaktarımıÇÖZÜLMEDİ,tetikleyicisiz. KendiMetaapp yayınengeli: işletmedoğrulamasıInreview+eksikprivacyURL; gerçekwebhookyok. Kullanıcı kararı sonraki iş PC oturumuna erteledi; ayrı kısa Meta formuna geçiş ONAYLANMADI. [Ek inceleme](analizler/2026-10-14-kommo-67-84-kesin-ayrim-engeli.txt). KullanıcıFatmanurtestiçinhazır;paylaşımKısıtlıveönizlemelinkleridoğrudanformuaçmıyor. Eski bahçe denemesi kullanıcı onayıyla silindi; yeni Meta dummy lead1684483083017417→Kommo4455417 geldi ve yalnızbahçe20335 sayacı0→1. Gerçek telefon/PDF teslimi yok. Aynı Facebook hesabında54/bahçe form önizlemeleri zaten gönderildi ekranına açılır; silme bunu sıfırlamadı. [Rapor](analizler/2026-10-14-kommo-dort-urun-ayrim-test.txt). |
| CRM-009 | Meta67/84 otomatik cevaplarını kaldır; kesin reklam ayrımıyla kendi PDF/karşılama gönder | KISMİ: Meta cevapları boşaltılıp iki reklam ayrı ayrı yayına gönderildi; 84 İşlem sürüyor. Kommo84 genel tetikleyicisi kaldırıldı,67 tetikleyicisiz. PDF/akışlar korunur; reklamID bazlı otomatik teslim TAMAMLANMADI, destek/entegrasyon gerekli. Önce başlamış84 aktif oturumu ayrıca kontrol edilmeli. [Rapor/kanıtlar](analizler/2026-10-14-kommo-meta-yanit-kaldirma.txt). |
| CRM-008 | 54/67/84 otomasyon ve Meta hazır cevap çakışma denetimi | DENETİM TAMAM: 67 tetikleyicisiz; 84 genel menü, reklam bazlı değil; 54 kaynak koşullu başlangıç4, teslim doğrulanmadı. Meta67/84 hazır fiyat yanıtları mevcut, çift yanıt riski var. 54v2 kaynak uyumu ve eski bahçe Salesbot#2 ayrıca incelenmeli. CRM003/004/005/006 açık. [Rapor](analizler/2026-10-14-kommo-otomasyon-denetimi.txt). |
| CRM-001 | Bot 20247 mevcut kararlarını ortak kayda alma | Bu bölümde kaydedildi; önceki proje açık işleri korunur. |
| CRM-007 | Üç 25 m² bahçe form reklamına karşılama + Garden Life PDF + ücretsiz keşif arama seçimi | KURULUM TAMAM: bot20335, onaylı PDF şablonu12405 ilk mesajda; Evet→Prefabrikten arama bildirimi, Hayır→nazik kapanış. Güncel koşul: yalnız Meta Leads/Yeni Meta Lead + doğrudan bahçe form kaynağı19245; eski kayıtları başlatma kapalı. WhatsApp önizleme ve JSON dal kontrolü geçti. 84 genel tetikleyicisi sonradan tamamen kaldırıldı.84 tarihsel exportları son doğrudan PDF başlangıcı değişikliğini içermez. Gerçek yeni form teslimatı CRM-003 AÇIK. [Rapor/kanıtlar](analizler/2026-10-14-kommo-bahce-ofisleri.txt). |
| CRM-002 | 67 m² ve bahçe ofisi katalogları | İki PDF alındı: 67 ayrıbot20311, bahçe formu ayrıbot20335. 67 otomatik reklam yönlendirmesi CRM-005/006 AÇIK. Bahçe formu kurulumu CRM-007 tamam, gerçek teslimat CRM-003 AÇIK. |
| CRM-003 | Yeni Instagram/WhatsApp canlı başlangıç ve teslimat | AÇIK: gerçek yeni görüşmede doğru ürün/tek otomatik başlangıç ve teslim doğrulanmalı. WhatsApp PDF eki; Instagram için resmi entegrasyon PDF eki desteklemediğinden kalıcı indirme bağlantısı hazırlanmalı ve test edilmeli. |
| CRM-005 | AYRI 67 m² reklam botu | AYRI bot 20311 hazır/kaydedildi: doğrudan 67 PDF → kategori → aranma. Moe-67 reklamı 52581114367325 Meta'dan bulundu. Reklam bazında otomatik tetikleme AÇIK; tetikleyici eklenmedi. Aynı 84 botuna birleştirme kullanıcı düzeltmesiyle geri alındı. [Durum/kanıt/sınırlar](analizler/2026-10-14-kommo-67m2.txt). |
| CRM-004 | Reklam ID'sinden bağımsız içeriksiz yönlendirme | ÇÖZÜLMEDİ: 67/84 reklam kimliğine göre yönlendirme yok; genel yeni görüşme tetikleyicisi kaldırıldı, her iki bot otomatik başlangıç olmadan hazır. |
| CRM-006 | 67 reklamında Instagram/WhatsApp otomatik başlangıç ve diğer reklamlardan ayrım | AÇIK: reklam ID 52581114367325 → bot20311 eşleştirmesi kurulamadı. Meta erişimi açıldı; Kommo izinleri mevcut, Moe-67 URL Parametreleri devre dışı, işletmenin kendi Meta uygulaması yayımlanmamış/webhook adresi boş. 84 genel tetikleyicisi CRM-009 çalışmasında kaldırıldı. [İnceleme ve sonraki adım](analizler/2026-10-14-kommo-reklam-kaynagi.txt); kullanıcı onayıyla destek talebi 14 Ekim 02:09'da Kommo destek sohbetine gönderildi, yanıt bekleniyor. |

Hesap: https://prefabrikten.kommo.com. Bot: “84 m² Reklam | YMOE-3 Katalog ve Proje”, ID 20247. Kaydedilmiş otomatik başlangıç: gelen mesajla başlayan yeni görüşmeler; yalnız Instagram (prefabrikten) ve WhatsApp Onur Bayraktar (+90 542 645 55 60). Botun yanıtladığı mesajlar okunmadı bırakılıyor.

Akış:
1. “Merhaba, Prefabrikten’e hoş geldiniz. İlgilendiğiniz ürün hangisi? Size ilgili ürünün bilgilerini iletelim.”
2. “84 m² modüler ev”, “67 m² modüler ev”, “Bahçe ofisi”.
3. 84 m² seçimi: onaylı MOE-3 PDF ve kısa tanıtım; ardından “Daha çok hangi yapı tipi ile ilgileniyorsunuz?”
4. Prefabrik evler → https://prefabrikten.com/prefabrik-evler/ ; Hafif çelik evler → https://prefabrikten.com/celik-evler/ ; Modüler evler → https://prefabrikten.com/moduler-evler/ .
5. Her kategori mesajında “Beni arayın”: müşteriye talebin alındığı söylenir, Prefabrikten Kommo kullanıcısına dahili bildirim gider.
6. İlk menüde 67 m² veya bahçe ofisi: katalog henüz yok; Prefabrikten kullanıcısına inceleme bildirimi.

PDF: özgün yol C:/Users/obayr/Desktop/Prefabrikten_YMOE_3_80m2.pdf; bota yüklenen adı “MOE-3 Ürün Kataloğu ve Teknik Özellikler.pdf”. Yerelde dosya varlığı ve SHA-256 doğrulandı: 4da0a9de72a1b933d7a9a61b6253303010de6065a98ce490278407fdaeda0dfe. Bu oturumda PDF içeriği veya bota yüklenen dosyayla byte eşitliği incelenmedi; PDF bu iş PC devrinde referanslar/kommo/Prefabrikten_YMOE_3_80m2.pdf yoluna kopyalandı; kaynak/kopya SHA-256 eşitliği doğrulandı. Reklamdaki 84 m² ile katalogdaki 80 m² brütün aynı ürünün güncel kataloğu olduğu kullanıcı tarafından açıkça onaylıdır; tekrar sorulmaz. Üretim ortalama 45 gün; hazır sahada montaj yaklaşık 2 gün. Zemin betonu, nakliye ve vinç ayrıca planlanır.

Reklam: Meta “Moe-3”, reklam ID 6870411642321, hesap 199150513628575. Bot reklamı otomatik tanımaz. Kullanıcı onayıyla tüm yeni seçili Instagram/WhatsApp görüşmelerinde ürün menüsü açılır, doğru PDF müşteri seçimiyle gönderilir. Kommo tetikleyicisinde doğrudan reklam ID seçilemedi; mevcut Meta ekranında UTM alanı bulunamadı.

Önceki test beyanı: manuel WhatsApp'ta PDF teslim edildi; Instagram önizlemesinde menü → 84 m² → katalog; Kommo önizlemesinde kategori linkleri ve Beni arayın doğrulandı. Gerçek yeni müşteride uçtan uca otomatik teslimat gözlemlenmedi; Instagram gerçek PDF teslimatı ayrıca açık. Yetkili test kişisi Fatmanur Bayraktar, numara sonu 8350, Kommo müşteri kaydı 4439549. Bu devir işlemi test mesajı gönderme işlemi içermedi.

Korunacak kararlar: mevcut reklamlar, Meta formları ve diğer botlar bozulmayacak. Meta'da önceden kalan yayımlanmamış değişiklikler topluca yayımlanmayacak/silinmeyecek. Uzun arsa/zamanlama soru akışı geri eklenmeyecek; PDF, kısa metin, model bağlantıları ve Beni arayın yeterli.

Güncel sıradaki adım: ayrı 20311 botunun Moe-67 reklamına göre otomatik tetiklenmesini kurmak (CRM-005/004), ardından gerçek teslimatı doğrulamak (CRM-003). Bahçe ofisi PDF'si CRM-002 açık. Plan Studio/SketchUp sürümleri ve kullanıcı çizimleri bu devirde değiştirilmedi.

## Güncel kullanıcı kararı — 8 Ekim 2026
Aktif kullanım 5.9.87 tabanına pencere düzeltmesi eklenen 5.9.110 sürümüdür. 5.9.87 yedeği korunur. Kullanıcı deneme arayüzü/yerel görsel okuyucu çalışmasını sonraya bıraktı ve eski sürüme dönüş istedi. 5.9.95 çalışma ve test kayıtları codex/arayuz-duzeni dalında korunuyor; silme veya yeniden başlatma. DEV-080 ERTELENDİ. Eski dist HTML SHA256: CC65F089DB6CC15C9917D1AF5C4C988A214B71164DDD66B92817525FC9AF034E, releases/5.9.87 yedeğiyle aynı. Canlı deneme çizimi değiştirilmedi; JSON aktarımı doğrulanmadı.

## Önce buradan devam et — 7 Ekim teslimi
Program **5.9.110**. [H üzerinde pencere yerleşimi ve gerçek proje testleri](analizler/2026-10-09-pencere-h-merkez.md). [Çatı yükseklik düzeltmesi](analizler/2026-10-08-cati-yukseklik.md). [GPU 3B sunum](analizler/2026-10-08-gpu-3b.md). [Otomatik saçak kotu / Alın V](analizler/2026-10-08-otomatik-sacak.md). [Gerçek planda kaplama/omega düzeltmesi](analizler/2026-10-08-omega-aciklik.md). [Ölçülü baş makas omegası](analizler/2026-10-08-bas-makas-omega.md). [Baş makas betopanı](analizler/2026-10-08-bas-makas.md). [Hızlı panel araçları](analizler/2026-10-08-hizli-panel.md). [İç duvar kapanışı ve önizleme](analizler/2026-10-08-ic-duvar-kapanis.md). [Otomatik yedek / F5 koruması](analizler/2026-10-08-otomatik-yedek.md). [Üst duvar kapanışı](analizler/2026-10-08-panel-kapanis.md). [Saçak altı / betopan kapama](analizler/2026-10-08-sacak-kapama.md). [Yavru kot referansı düzeltmesi](analizler/2026-10-07-yavru-baglanti-inceleme.md). [Saçak alt uç kotu](analizler/2026-10-07-sacak-alt-kot.md). [Alın / yan saçak ayrımı](analizler/2026-10-07-sacak-ayrimi.md). [Alın V montaj geometrisi](analizler/2026-10-07-alin-v-montaj.md). [280/300cm uyarlaması](analizler/2026-10-07-pencere-panel-280-300.md). [Pencere yönü/cam düzeltmesi](analizler/2026-10-07-pencere-ic-yon-cam.md). [Yükseklik ve malzeme görünüşü](analizler/2026-10-07-panel-yukseklik-malzeme.md). [Gerçek STL entegrasyonu](analizler/2026-10-07-stl-3b-entegrasyon.md). [Kamera ve açıklıklar](analizler/2026-10-07-3b-kamera-acikliklar.md). [Panel/H/köşe 3B kapsamı](analizler/2026-10-07-panel-h-kose-3b.md). [Mahya/Alın V bindirme sırası](analizler/2026-10-07-mahya-alin-v-bindirme.md). [Kot farkı kapamaları ve mahya rengi](analizler/2026-10-07-alin-v-kot-farki.md). [Alın V ve mahya](analizler/2026-10-07-alin-v-mahya.md). [İkinci yavru çatı bağlantısı](analizler/2026-10-07-ikinci-yavru-cati.md). [Son değişiklik, kesin kullanıcı kuralı, testler ve sınırlar](analizler/2026-10-07-makas-kose-uyumu.md). Makas aksları referans; panel adetleri/ara ölçüler korunur, köşe uçları yeniden kesilir ve bina ölçüsü köşe paylarıyla değişir. Eski 5.9.18 dondurma kuralı uygulanmaz.  [Güncel kararlar, uygulanmayan öneriler ve açık işler](analizler/2026-10-04-ev-is-devir.md). [Dosya/hash envanteri](analizler/2026-10-04-devir-envanteri.json). Önce bu özeti oku; aşağıdaki tarihsel kararların sonradan düzeltilenlerini yeniden uygulama.

| Kimlik | İş | Durum |
|---|---|---|
| DEV-113 | Sistem ve iş akışına göre arayüz | ÖNERİ HAZIR: resmi AutoCAD/SketchUp/Tekla/FRAMECAD belgeleri incelendi; Plan/Çatı/Üretim/Metraj/Sunum düzeni. Uygulama yapılmadı. [Araştırma](analizler/2026-10-16-arayuz-arastirma-oneri.txt). |
| DEV-112 | Malzeme bilgili antet | TAMAMLANDI 5.9.110: çatı/duvar/tavan kaplaması otomatik, ayrı renkli satır, dinamik sayfa payı. PDF/PNG ve malzeme seçenekleri testleri geçti. [Rapor](analizler/2026-10-16-antet.md). |
| DEV-111 | Farklı Kaydet ve alçıpan stok ölçüsü | TAMAMLANDI 5.9.109: destekleyen tarayıcıda dosya seçimi; tüm alçıpan hesabı 120×250, döşeme 60×125 ayrı. save-as testi geçti; canlı işletim sistemi penceresi doğrulanmadı. [Rapor](analizler/2026-10-16-kaydet-alcipan.md). |
| DEV-110 | Hafif çelik 3B kapı/pencere ve çatı | TAMAMLANDI 5.9.108: aks/kalınlığa göre açıklıklı duvar, katalog doğraması, çatı tipi/eğim seçimi. Steel-3d ve iki prefabrik regresyon testi geçti. [Rapor](analizler/2026-10-16-hafif-celik-3b.md). |
| DEV-092 | Sundurma başlangıcı köşe direği kotunda | TAMAMLANDI 5.9.107: baş makas bağlantısında arka kenar duvar üst kotundan başlar; eğimli çatı yüzeyi ve 10 cm düşüm kullanılmaz. Dört yön/280 cm/JSON ve eski bağlantı testleri geçti. [Rapor](analizler/2026-10-09-sundurma-kose-kotu.md). |
| DEV-091 | Baş makas önünde tek eğimli sundurma | TAMAMLANDI 5.9.106: tek düzlem, destek sınırına bağlantı, yan kapamalar ve üç kiriş seçimi; dört yön/JSON/eski veranda testleri geçti. [Rapor](analizler/2026-10-09-tek-egim-sundurma.md). |
| DEV-090 | Veranda çizimini esas alma; eksik yan kirişler | TAMAMLANDI 5.9.105: iki yan kiriş kendi çizilmiş kenarından, çatı tabanı güncel plandan; ön+sol+sağ seçimi. [Rapor](analizler/2026-10-09-veranda-sinir-kiris.md). |
| DEV-089 | Direkler baş makasa kadar, kiriş arada | TAMAMLANDI 5.9.104: direk üstü/kiriş üstü aynı kot; net kiriş direk iç yüzleri arasında; alın ve saçak köşe kapanışı. [Rapor](analizler/2026-10-09-veranda-direk-kiris.md). |
| DEV-088 | Veranda tavan boşluğu, çift alın ve saçak kademesi | TAMAMLANDI 5.9.103: tek alın, kiriş üstünde betopan, duvar kotunda tavan, ortak yan saçak; dört veranda/tavan testi geçti. [Rapor](analizler/2026-10-09-veranda-kapanis.md). |
| DEV-087 | Sekme sıralama ve pasif sekme kapatma; veranda kullanımı | TAMAMLANDI 5.9.102: sürükle-bırak, kalıcı sıra, her sekmede X ve çizim varsa onay; iki sekme testi geçti. [Rehber/rapor](analizler/2026-10-09-sekme-siralama.md). |
| DEV-086 | Beşik veranda betopan birleşimi | TAMAMLANDI 5.9.101: Saçak altında 22 cm açıklık kapandı, ortak eğim devam ediyor; dört yön/eski JSON ve veranda-tavan testleri geçti. [Rapor](analizler/2026-10-09-veranda-betopana-birlesim.md). |
| DEV-084 | Yan yana proje sekmeleri | TAMAMLANDI 5.9.99: Yeni/Aç yeni sekme, ayrı undo/redo ve plan görünümü, tüm sekmelerin yerel kaydı; project-tabs testi geçti. |
| DEV-085 | 60×125 tavan ve mini H; veranda yan kirişleri | TAMAMLANDI 5.9.100: Tavan görünümü ve3B60×125/miniH; seçilebilir sol/sağkiriş; metraj/JSONtestleri geçti. MiniHkesiti veüretimkesimoptimizasyonu açık. [Rapor](analizler/2026-10-09-tavan-mini-h.md). |
| DEV-083 | Özel beşik veranda ve kutu profiller | TAMAMLANDI 5.9.98: 100×100×2 mm değişebilir dikme, isteğe bağlı ayrı kesitli ön kiriş, plan/3B/metraj/CSV; gerçek JSON ve veranda testleri geçti. Yan kiriş/ara dikme ve bağlantı detayları açık. [Rapor](analizler/2026-10-09-veranda-profiller.md). |
| DEV-082 | Pencere yanında gereksiz küçük panel | TAMAMLANDI 5.9.97: bölüm ortasına yerleşimde eşit tek yan panel; gerçek projede 8 durum ve prefab 77/77. [Rapor](analizler/2026-10-09-pencere-yan-paneller.md). |
| DEV-081 | Makas aksı/H üzerinde ve 2,5 panel ortasında 160/120 pencere | TAMAMLANDI 5.9.96: tıklanan merkez korunur, 166 cm pano; gerçek dosyada 8 durum, undo/JSON, 77 prefab ve STL testleri geçti. [Rapor](analizler/2026-10-09-pencere-h-merkez.md). Genel panel düzenleme kısıtları ayrı kapsam. |
| DEV-072 | INTERFab canlı arayüz karşılaştırması | İNCELEME TAMAM: arama/seçim, bölünmüş görünüm, sahneler, ClashCheck ve metraj incelendi. Öncelik 3B ortak seçim, plan+3B ve uyarıya odaklanma; uygulama henüz yapılmadı. [Rapor](analizler/2026-10-08-interfab-inceleme.md). |
| DEV-071 | Duvar yüksekliği değişince çatı eski kotta | TAMAMLANDI 5.9.87: ortak yükseklik işleminde ana/yavru kotu ve birleşimleri güncellenir. 250/280/300, undo/redo, JSON ve eski kaydı düzeltme testleri geçti. [Rapor](analizler/2026-10-08-cati-yukseklik.md). |
| DEV-070 | GPU 3B sunum | TAMAMLANDI 5.9.86: WebGL, kenar yumuşatma, açık/koyu zemin, ince kontur, cam, görünene göre kamera sığdırma; hesaplar korunur. Gerçek plan/STL/PNG/yedek çizici testleri geçti. [Rapor](analizler/2026-10-08-gpu-3b.md). |
| DEV-069 | Sürekli duvar kotunda saçak / Alın V açıklığı | TAMAMLANDI5.9.85: ana/yavru yeni+eski kayıt otomatik trim/wallTop; oturtma düğmesi ve kot referansı ayarları kaldırıldı. Alın V üstü örtü+1.5cm, altı duvar kotunda. Gerçek plan ve çatı regresyonları geçti. [Rapor](analizler/2026-10-08-otomatik-sacak.md). |
| DEV-068 | Omega oturuşu / kaplama açıklığı | TAMAMLANDI5.9.84: Yeni proje11de yavru saçak taşmasının ana alın kaplamasını yanlış kesmesi düzeltildi. Görünen bant15mm, tam metal kesit korunur. Gerçek plan ve4regresyon geçti; JSON/hash kaydedildi. [Rapor](analizler/2026-10-08-omega-aciklik.md). |
| DEV-066 | Baş makas kaplama boşluğu / duvar rengi | 5.9.82: alçak komşu footprinti tüm kaplamayı silmez; üstte kalan kaplama korunur. Duvarla ortak betopan renk/gölgesi.5test geçti; kullanıcının son çatılı JSONunda birebir teyit yok. [Rapor](analizler/2026-10-08-bas-makas.md). |
| DEV-067 | Baş makas omegası | 5.9.83: 60/100/150,30,12+20,25 mm kesit ve kullanıcı teyitli 1 mm sac; 3B tamamlandı. Stok/kesim/büküm açınımı açık. 12 durum ve çatı regresyonları geçti. [Rapor](analizler/2026-10-08-bas-makas-omega.md). |
| DEV-065 | Sol tık panel menüsü / sürükle değiştir | TAMAMLANDI5.9.81: Panel düzenle, akslı bölme/komşuyla birleştirme ve sürükleme; mesnet kaldıran işlem reddedilir. Özel120.5 testi ve prefab77 geçti. [Rapor](analizler/2026-10-08-hizli-panel.md). |
| DEV-064 | Üst bağlantı sonrası iç duvar kapanışı / ters önizleme | TAMAMLANDI5.9.80: segment bölünürken ankraj dünya konumu korunur; önizleme T bağlantıları gerçek çizimle aynı.8durum/fare/undo/JSON ve77prefabrik testi geçti. [Rapor](analizler/2026-10-08-ic-duvar-kapanis.md). |
| DEV-063 | Otomatik yedek / F5 koruması | TAMAMLANDI5.9.79:10s kontrol,650ms kayıt, otomatik geri açma,10önceki sürüm/Yedekler, yenileme onayı ve kota uyarısı. autosave/run31/panel-close geçti. [Rapor](analizler/2026-10-08-otomatik-yedek.md). |
| DEV-061 | Üst duvar kapanışı / yarım başlangıç | TAMAMLANDI 5.9.78: mevcut makas aksları kullanıcı onayıyla korunur; kapanışta ortak panel fazı kaymaz. Gerçek JSON/fare/undo/kayıt ve 77 prefabrik testi geçti. [Rapor](analizler/2026-10-08-panel-kapanis.md). |
| DEV-062 | Makas yön değişiminde yavru bağlantısı | AÇIK: production-direction satır89 hatası eski HEAD ve yeni sürümde doğrulandı; ayrı çatı yönü regresyonu. |
| DEV-060 | Saçak altı sacı / betopan uçları | 5.9.77: 3B kapama tamamlandı, 30/40 ve kot korunur; ayrı imalat metrajı/kesim detayı açık. [Rapor](analizler/2026-10-08-sacak-kapama.md). |
| DEV-059 | Dört nokta sonrası yavru oluşmuyor | TAMAMLANDI 5.9.76: gerçek JSON ana=eave, yeni yavru=trim uyuşmazlığı doğrulandı; yavru referansı ebeveynden alır. Gerçek planda dört tıklama+Enter ve eski/yeni kot testleri geçti. Önceki genişlik tahmini bu plan için geçersiz. [İnceleme](analizler/2026-10-07-yavru-baglanti-inceleme.md). |
| DEV-058 | Saçak alt ucunun duvar kotunda bitmesi | TAMAMLANDI 5.9.75: yeni trim kotu/12 cm kapama; 30-40 cm taşma sabit. Eski ana/yavrulara tek düğme ve undo; veranda bağlantıları hariç. [Rapor](analizler/2026-10-07-sacak-alt-kot.md). |
| DEV-057 | Alın / yan saçak ayrımı | TAMAMLANDI 5.9.74: yeni 220/300 mm; 220/400 ve 300/400 + özel; eski JSON otomatik değişmez, bölüm bazlı uygulama/undo. Bağlı U uçları yeni kenara taşınır. [Rapor](analizler/2026-10-07-sacak-ayrimi.md). |
| DEV-056 | Alın V montaj kesiti | KISMEN: 5.9.73 üst 8 / ön 12 / alt 22-40 cm; test geçti. Dudaklar, kesit doğrultusu teyidi, omega/trapez ayrıntıları açık. [Rapor](analizler/2026-10-07-alin-v-montaj.md). |
| DEV-055 | 280/300cm gerçek pencere panoları | TAMAMLANDI5.9.72: yedi modelin üst dolu kısmı30/50cm uzar; PVC/cam/kol ve kotlar korunur.21durum testi geçti.10luk kapsamı; özel yükseklikler açık. |
| DEV-054 | Pencere kol iç yönü / cam çaprazı | 5.9.71: kapalı oda sınırından içe180derece dönüş; cam dar üçgen sınıflaması düzeltildi. Dört cephe/ters yön testleri ve ekran geçti. Açık/çift taraf oda yönünde uyarı. |
| DEV-053 | Panel yükseklik seçimi ve malzeme görünüşü | 5.9.70:250/280/300+özel; yeni250, eski kayıt korunur. Pano ortak renk/PVC beyaz/cam yarı saydam; STL malzeme sınıfları geometrik tahmin. Gelecek PVC kahve/antrasit ve kesin parça etiketleri açık. |
| DEV-052 | Gerçek pencereli panel STL kataloğu | AÇIK: yedi STL kopyalandı/hash doğrulandı; geometri ve önizleme incelendi. Birim cm teyitli.160lık iki STL171cm hatalı; kullanıcı doğru eni166cm belirledi. Rev4:160×120 dış ölçüleri166×250cm ve Z alt sınırı0 doğrulandı; aktif referans rev4. Son rev5 tekrar gönderiminde üçgen verileri rev4 ile tamamen aynı; yalnız dosya başlığı farklı. Bu yalnız dış ölçü kontrolüdür.160×180 rev6 dış ölçüsü166×250cm doğrulandı. Eski/yeni kopyalar korunuyor, ölçeklenmeyecek. [Rapor](analizler/2026-10-07-pencere-stl-inceleme.md). 5.9.66:160×120 STL250cm/10luk duvarda1:1 bağlandı; diğer modeller ve yükseklikler açık.5.9.68: kullanıcının teyit ettiği160×180 ve120×120 modeller de bağlandı; nötr renkli,250cm/10luk kapsamı. 5.9.69: yedi STL bağlı; 5.9.70malzeme görünüşü ve5.9.72standart280/300uyarlaması eklendi; kesin malzeme etiketleri ve özel yükseklikler açık. |
| DEV-051 | 3B orbit/zoom/yön/perspektif ve açıklıklı pano görünüşü | TAMAMLANDI: 5.9.65; pencere üst kot210 kullanıcı onaylı, PVC/profil kesitleri temsilî. Tam üretim detayı DEV-050 açık. |
| DEV-050 | Plana bağlı detaylı 3B imalat modeli | AÇIK: panel96/56/146 mm katmanları,1250 en ve2500/2800/3000 boylar; H sacı1 mm alındı. 146 mm=15lik teyitli. Düz H100 mm ara ölçü,54=27+27 mm kanat; köşe sacı1 mm ve makasa bağlı100/50 yön kabul edildi. Üretim referansı ve beş görsel hash ile kaydedildi. 5.9.64 dolu panel katmanları,10luk düz H/köşe ve çatı gizleme uygulandı; wall-3d geçti. 5.9.65 kapı/PVC görünüşü ve H3/U/X temsilî eklendi; gerçek kesit/karkas/donanım üretim detayları açık. [Kapsam ve teknik paket](analizler/2026-10-07-detayli-3b-imalat.md). |
| DEV-049 | Mahya Alın V altında | TAMAMLANDI: 5.9.63; kapama yüksekliği ve çizgi örtülmesi, roof-trims piksel testi ve 3B ekran kontrolü. |
| DEV-048 | Kot farkında Alın V ve koyu mahya | TAMAMLANDI: 5.9.62; görünüş/metraj ortak kenarlar, malzemeye bağlı renk; roof-trims ve ilgili çatı/yükleme testleri geçti. |
| DEV-047 | Alın V ve mahya ayrımı, 3B ve metraj | 5.9.61: şematik kapamalar, 220/400 seçimi (varsayılan220), ayrı stok ve tek U toplamı tamamlandı. Mahya stok/bindirme ve tam profil büküm ölçüleri bekliyor. |
| DEV-046 | İlk yavrudan sonra yeni yavru köşelerinin seçilememesi | TAMAMLANDI: 5.9.60; mevcut yavruya bağlantı ve ilk tıklamada hedef kenar seçimi. roof-child-chain kardeş/zincir bağlantı, geri alma ve JSON testleri geçti. |
| DEV-044 | Makas yönü, köşe direği, H aksları ve yeni kademeli çizim | TAMAMLANDI: 5.9.59; production-direction testi, 80/49 panel adedi ve ara ölçüler korundu. Gerçek özel pano mesnetleri DEV-011 kapsamında açık. |
| DEV-045 | Yavru U çiziminde uzak duvar hizasına tam dik yakalama | TAMAMLANDI: 5.9.59; roof-child-snap dört yön/sapmalı tıklama, roof-child-u ve roof-workflow geçti. |
| DEV-043 | Son canlı ana/yavru çatı planını iki bilgisayara aktarma | BEKLİYOR: kullanıcı Kaydet ile güncel JSON'u almalı. Mevcut JSON yedeği ve9ekran görüntüsü korunmuş olsa da son canlı çizim doğrulanmadı. Yeni dosya ayrı adla cizimler'e alınmalı,hash/push doğrulanmalı. |

Ev veya iş fark etmez:git kontrolü/fetch ve güvenli güncelleme,bu dosya,CALISMA_KAYDI,son devir özeti. Sonra güncel JSON doğrulaması; kayıtlı kurallar kullanıcıya yeniden sorulmaz. Kod/kararlar aktarımı ile tarayıcı çizimi aktarımı ayrı işlerdir.

## Açık işler ve devir durumu

| Kimlik | İş | Durum / tamamlanma koşulu |
| --- | --- | --- |
| DEV-154 | Referans görsel ve plan altlığı | TAMAM: görünür Referans komutu; PNG/JPG/Ctrl+V, pencere/sahne, iki nokta ölçek, kilit/taşı/undo ve projeyle JSON kayıt. Yalnız taslak; ana5.9.137 korundu. [Rapor](analizler/2026-10-25-taslak-referans.txt), [kontrol](taslaklar/odak-atolyesi/reference-check.cjs). |
| DEV-153 | Bağımsız tek katlı prefabrik çizim akışı | TAMAM: gerçek motorun ayrı kopyası, plan/çatı/3D/tavan/metraj/kayıt/çıktı, taslağa özel depolama; ana 5.9.137 değişmedi. Kullanıcı değerlendirmesi ve ana entegrasyon ayrı. [Rapor](analizler/2026-10-25-taslak-tek-kat.txt), [kontroller](analizler/2026-10-25-taslak-tek-kat-kontrol.txt). |
| DEV-152 | Taslakta standart alçıpan ve mini H | TASLAK TAMAM: 60×120 nominal levhalar, mini H birleşimleri, alttan 3D ve levha seçimi. [Rapor](analizler/2026-10-25-taslak-standart-tavan.txt). Ana uygulama 5.9.137 değişmedi; mini H kesin kesiti ve üretim payları açık. |
| DEV-151 | Taslak ara kat döşeme katmanları | TASLAK TAMAM: taban / şase içi yalıtım / alt tavan, etiketli ayrıştırma ve ayrı görünürlük. [Rapor](analizler/2026-10-25-taslak-arakat-katman.txt). Ana uygulama 5.9.137 değişmedi; ürün/kalınlık ve üretim kuralları açık. |
| DEV-150 | Taslakta prefabrik ara kat döşeme şasesi | TASLAK TAMAM: 125 cm dış en / 20 cm şase alt kat duvar üstünde; şase planı, iki kat ve ayrıştırma, prefabrik H/panel/köşe gösterimi. [Rapor](analizler/2026-10-25-taslak-arakat.md). Ana uygulama 5.9.137 değişmedi; üretim/mesnet/kaplama ve kalıcı kat modeli açık. |
| DEV-149 | Alternatif ara kat şase montajı | İNCELEME TAMAM: üç ayrı düzen, 7 standart + dar kenar şasesi; iki şasenin 100 cm uzaması veya 250 cm kayması ayrıştırıldı. [Rapor](analizler/2026-10-25-arakat-alternatif-inceleme.md). Kaynak STL ve ölçü/görseller korundu; uygulama aktarımı, mesnet ve özel parça kuralları açık. |
| DEV-148 | Ara kat şasesi ve montaj STL örnekleri | İNCELEME TAMAM: [rapor](analizler/2026-10-25-arakat-sasesi-inceleme.md). Son dosyada8şase125cm adımlı. Dış125 cm, yükseklik20 cm, projeye göre boy ve alt duvar üstüne oturma kullanıcı kararı. Üretim bağlantı/mesnet/kayıt aralığı ayrıntıları ve uygulama aktarımı açık. |
| DEV-147 | Revit ve Rayon incelemesi ve program yapısı | ARAŞTIRMA TAMAM: [rapor](analizler/2026-10-25-revit-rayon-program-yapisi.md). Uygulama ve taslak değişmedi. Önerilerin değerlendirilmesi bekliyor; DEV-138-B ve önceki açık işler sürer. |
| DEV-001 | İş bilgisayarındaki AutoCAD dosyası ve analizini alma | Tamamlandı: iki DWG, Excel ve PDF kopyaları ve önceki bulgular ortak depoda; aşağıdaki rapor/envanter. |
| DEV-002 | Güncel müşteri planını belirleme | Kullanıcı bu karşılaştırma için iş JSON'unu açıkça seçti. Sonuç ayrı tuna84-dwg-esleme-taslak.json dosyasıdır; canlı tarayıcı çizimi değiştirilmedi ve son canlı çizim olduğu iddia edilmiyor. |
| DEV-003 | İki bilgisayarda ortak devam kurallarının kullanılması | İlk karşılıklı devir tamamlandı: iş bilgisayarı kuralları aldı; ev bilgisayarı 4c2f1c4 teslimini aldı, kayıtları okudu ve beş dosyanın boyut/SHA-256 değerlerini doğruladı. Her yeni çalışmada devir kontrolü sürer. |
| DEV-004 | Aynı sohbeti cihazlar arasında kullanma | Kurulmadı. Ortak proje kayıtları bundan bağımsız çalışır; hesapta desteklenen bağlantı ayrıca değerlendirilmeli. |

Tarihsel aktarım (aşağıdaki güncel devir özetinden öncedir): program 5.9.36; kaynak belgeler, ölçülü karşılaştırma ve ayrı kontrol taslağı ortak kayıttadır. Son canlı müşteri planı bundan ayrıdır.

| Kimlik | İş | Durum / tamamlanma koşulu |
| --- | --- | --- |
| DEV-005 | Giriş kapısı panosu / dolgu imalat uyumu | Ayrı kontrol taslağında 52,75 + 125,5 cm düzeltildi; 520 mm kesim eşlemesi 5.9.19'da eklendi. Mevcut kapı aynen korundu. Genel otomatik kapı/pano yerleştirme kuralı değiştirilmedi; canlı çizimlere kendiliğinden uygulanmaz. |
| DEV-006 | CAD–program–Excel–PVC karşılaştırması | Drawing1–iş JSON duvar/pano karşılaştırması ve ayrı taslak tamamlandı; rapor aşağıda. Excel/PVC satır eşleme hâlâ açık. Geometrik 49 yuva ile eski Excel raporundaki 47 ürün farkı çözülmeli. |
| DEV-007 | Yavru çatı bağlantısı ve ortak model | Açık: ikinci U bağlantısı reddi, saplanma/boşluk, snap, yön, alın ve veranda örnekleri tekrar üretilip doğrulanmalı; düğme açıklamaları sadeleşmeli. |
| DEV-008 | Kaplama katmanları ve metraj doğrulaması | Açık: üst örtü + opsiyonel OSB/bariyer/membran; seçilen katmanlar ve 100 cm yerleşim çıktıları aynı modelle doğrulanmalı. |
| DEV-009 | İçe/dışa aktarım, arayüz ve çok kat | Bekleyen ürün talepleri; öncelik imalat doğrulaması. PDF ve DXF dışa aktarma DEV-016 ile tamamlandı. DWG/PDF/DXF içe aktarma, doğrudan DWG yazma ve çift kat açık. |
| DEV-010 | Sohbet kaynaklarını ortak depoya aktarma | 4 kaynak + iş JSON'u hash karşılaştırması başarılı; rapor/envanter hazır. GitHub aktarımı b899d5c commit ile tamamlandı; uzak main ve yerel HEAD eşitliği doğrulandı. |
| DEV-011 | Kontrol taslağının imalat doğrulaması | Açık: e107 hattında 1 makas/H mesnet uyuşmazlığı; özel aks uyarıları, direk/kiriş ve görünmeyen üretim kalemleri. Kapı kesin boşluk kontrolü kullanıcının isteğiyle ertelendi. Tam üretim onayı verilmedi. |
| DEV-016 | Ölçekli PDF ve düzenlenebilir DXF çıktısı | Tamamlandı: 5.9.23; tests/plan-export.cjs, tests/verify-export-pdf.py ve tools/verify-export-autocad.ps1. İçe aktarma kapsam dışı. |
| DEV-017 | PDF/PNG anteti ve sade proje ayarları | Tamamlandı: 5.9.24, tests/title-block.cjs; metadata/logo JSON ile korunur, gerçek logo kullanıcı tarafından seçilir. |

## Doğrulanmış durum

- Uygulama sürümü **5.9.61**. Önceki 5.9.18 commit'i: `d526e03f003083ee866bd80fa34d54d70a4470d2`. Son teslim commit'i Git geçmişinden kontrol edilir.
- GitHub: https://github.com/bayraktaronur/hafif-celik-proje — dal `main`.
- 5.9.16: Tefrişlerde kenar/merkez hizalama, geçici kılavuzlar, Alt + sürükle kopyalama, Shift ile eksen kilidi ve Kopyala düğmesi.
- 5.9.17: Çatı panel kesim sınırlarını 3B görünümde gösterme.
- 5.9.18 (tarihsel; yön/köşe davranışı 5.9.59 kullanıcı kararıyla değişti): Makas/çatı üretim yönü değişirken mevcut duvarlar, köşe payları, panel dizilimleri ve açıklıklar korunur; H mesnet uyumsuzluğu uyarılır.
- Bu son iki sürüm GitHub'dan ev bilgisayarına alındı. Kaynak ile uzak dalın commit eşitliği doğrulandı.
- 5.9.19: Drawing1 etiketlerinden dört ek kesim eşlemesi; ölçülü karşılaştırma ve ayrı 250 cm kontrol planı. Prefab 77/77, temel testler 31/31, CAD pano eşleme ve JSON tekrar açma kontrolleri başarılı.

## Kaynaklar ve ilk sıradaki iş

[Önceki analizler, kararlar ve bekleyen işler](analizler/2026-10-02-tuna84-devir-raporu.md).
[Özgün yollar ve SHA-256 envanteri](analizler/2026-10-02-kaynak-envanteri.json).
Kaynaklar: `referanslar/tuna-84m2/`; iş çizimi: `cizimler/2026-10-02-is-kayit-5.json`.

Kullanıcı Drawing1.dwg dosyasını imalat referansı, iş JSON'unu karşılaştırma hedefi belirledi. [Güncel ölçülü karşılaştırma](analizler/2026-10-02-tuna84-karsilastirma.md) ve [ayrı kontrol planı](cizimler/2026-10-02-tuna84-dwg-esleme-taslak.json) hazır. Panel yüksekliği 250 cm kullanıcı tarafından onaylandı; mevcut dış kapı aynen korundu, kapı sembol/gerçek boşluk farkı bu aşamada ertelendi. Eksik bölmeler, pencere panoları ve veranda taslağa eklendi. Kontrol taslağı imalat onayı değildir; DEV-011 ve Excel/PVC karşılaştırması sonraki işlerdir. Önceki devir raporu tarihsel bulgudur; yeni rapor farkları açıklar.

## Projenin amacı ve kalıcı kararlar

- Prefabrik ve hafif çelik evlerde müşteri sunumuna uygun kat planını üretime uygun veriyle birlikte geliştirmek; ardından 3B sunum, imalat dosyaları ve montaj şemaları.
- İleride 2–3 katlı yapıları destekleyecek sistem; mevcut müşteri örneği tek katlı prefabrik.
- Görünüm filtreleri veriyi değiştirmez. H ekleri, köşe direkleri ve U bağlantıları her görünümde korunur. Kapı/pencere etiketleri en/yükseklik ölçüleridir.
- Otomatik tefriş kapı açıklığını, açılımını ve geçişini kapatamaz. Yatak ve komodin pencere önüne yerleşebilir. Yatak odalarında gardırop ve komodin alternatifleri birlikte değerlendirilir. Banyo/WC otomatik tefrişi şimdilik kapsam dışı.
- Her uygulama sürümü test edilip GitHub'a gönderilir. Ayrıntılı sürüm geçmişi: [README.md](README.md).

## Çizimleri taşıma ve dosya düzeni

- **Kaydet / Ctrl+S** mevcut planı `.json` olarak indirir (`src/studio.js`, `planKaydet`). “Tarayıcıda yedeklendi” mesajı GitHub'a gönderim değildir.
- Ev klasöründeki `Yeni proje (11).json` orijinali korundu. Aynı içeriğin tarihli kopyası: [2026-10-02-ev-kayit-11.json](cizimler/2026-10-02-ev-kayit-11.json). Şema doğrulaması başarılı: 36 duvar, 26 tefriş. En son canlı çizim olduğu doğrulanmadı.
- Kopyanın SHA-256 değeri: `2c45a264202a0bd16f09e1684fe5fe9f5d365623d5e592c33c01ae3474d8c55c`.
- `cizimler/`: iki bilgisayarda kullanılacağı belirlenen Plan Studio JSON kayıtları.
- `referanslar/`: ilgili kaynak DWG/DXF/PDF ve diğer çizim referanslarının kopyaları.
- `analizler/`: kaynakları belirtilmiş analiz raporları, kararlar ve belirsizlikler.
- İş bilgisayarından dört kaynak ve ayrı JSON yedeği aktarıldı; orijinaller korundu ve SHA-256 eşitlikleri doğrulandı. Son canlı çizim olduğu doğrulanmadı.

## Bilgisayar değiştirirken

1. Planı Kaydet ile JSON olarak dışa aktar; kullanılacak dosyayı açıkça belirle.
2. Asistan mevcut çalışmanın kararlarını ve açık işlerini bu dosyaya, analiz sonuçlarını rapora kaydeder; ilgili dosyaları GitHub'a gönderip doğrular.
3. Diğer bilgisayarda proje klasöründeki sohbete: “GitHub'dan güvenli şekilde güncelle, AGENTS.md ve DEVAM.md dosyalarını oku, kaldığımız yerden devam et.” yazılır.

Bu düzen sohbetleri birleştirmez; proje bilgisinin sohbetten bağımsız taşınmasını sağlar. İki bilgisayar arasında aynı sohbeti kullanmak için ürünün desteklediği senkronizasyon/uzak bağlantı ayrıca kurulmalıdır; henüz kurulmadı.

## 2 Ekim 2026 — Genel imalat kural denetimi

- DEV-012 açıldı: kullanıcı aks, H, U, köşe, kapı, yarım ve özel panel sisteminin bütün olarak gerçek imalat örnekleriyle doğrulanmasını istedi. Tek plan eşleme genel üretim motorunun tamamlandığı anlamına gelmez.
- Rapor: analizler/2026-10-02-uretim-kural-denetimi.md; sayısal çıktı aynı adlı .json. tools/audit-manufacturing.cjs bağımsız tarayıcıda üç T örneğini ve 49 yuvalı taslağı denetler.
- Motor hem ortadaki hem merkez dışı T kolunu U sınıflandırıyor; bunun üretimde her konum için geçerli olduğu doğrulanmadı. Yerleşim/kesim/açıklık ölçüleri ve bağlantıya bağlı ürün kataloğu ayrılmalı. İki ek gerçek imalat DWG ve varsa kesim/profil detayları isteniyor.
- Sonraki öncelik DEV-012 kaynaklı kural matrisi; DEV-006 ürün eşlemesi ve DEV-011 mesnet incelemesi bununla birlikte sürer. Uygulama 5.9.19; canlı plan değişmedi. Denetim, üretim onayı değildir.

## 2 Ekim 2026 — Beş ek imalat örneği / DEV-012

- Kullanıcı VP 537 (166 m²), 43 m², VP 517 (68 m²), VP 523 (82 m²), VP 528 (106 m²) dosyalarını programın üretim referansı olarak verdi. Beş kaynak referanslar/imalat-ornekleri/ altına hash doğrulamasıyla kopyalandı.
- [Yeni karşılaştırma](analizler/2026-10-02-bes-imalat-karsilastirma.md); ölçü kanıtı analizler/2026-10-02-bes-imalat-geometri.json; kaynak yolları/hash analizler/2026-10-02-bes-imalat-kaynaklari.json. Ana plan önizlemeleri analizler/imalat-onizleme/ içinde.
- Ortak tam/yarım modül 125,5/62,75; 5 ve 3 cm uç paylarıyla uyumlu farklı panolar var. VP 523'te 169 cm/1690 ve Profilden, diğerlerinde166/1660. VP 528'de eğik cumba ve251/2500. VP 537 42,5 cm yan parça415, VP517 aynı genişlik420 yazıyor: kullanıcı açıklaması bekleniyor; kesim tablosuna eklenmedi.
- U için yalnız kesilmiş panelin geometrik ortası şartı yeterli olmayabilir: VP528'de122,5 panelde59,75 konumunda dik kol teması var; nominalmodül/3cm uç payı açıklaması aday yorum. Üretim teyidi olmadan genellenmeyecek.
- DEV-012 karşılaştırması tamamlandı; kaynaklı ürün/bağlantı kataloğu ve motor uygulaması açık. Öncelik ürün ailesi + uç bağlantısı + yerleşim/kesim ayrımı; ardından eğik cumba ve ayrı kontrol JSON'ları. DEV-006 ve DEV-011 kapanmadı. Uygulama5.9.19, canlı çizim değişmedi.

- Kullanıcı düzeltmesi: 42,5 cm H payı dâhil yerleşim, doğru kesim 420 mm; 415 tamamen yazım hatası. Bu belirsizlik kapandı. 169/Profilden açıklaması bekleniyor; üretim kataloğuna 42,5→420 uygulanacak. Kaynak DWG değiştirilmedi.

## 2 Ekim 2026 — 5.9.20 Metin komutu / DEV-013

- DEV-013 tamamlandı: Metin (T), çok satırlı açıklama, 2–100 cm boyut, 0–359 derece açı; tıkla yerleştir, sürükle taşı, çift tıkla düzenle, Delete/özelliklerden sil. JSON ve tarayıcı yedeği, geri/ileri alma, PNG ve ekrana sığdır desteği var. Metinler metrajdan bağımsızdır.
- Kullanıcı 1690/Profilden panoyu 1660 mm kabul etmemizi istedi. Bu açıklama bekleyen konu kapandı; ayrı Profilden pano türü gereksinimi çıkarılmayacak. Kaynak DWG ve mevcut planlar otomatik değiştirilmedi. Karar analizler/2026-10-02-imalat-onaylari.json içinde.
- Kontroller: yeni metin etkileşim/kayıt/PNG testleri başarılı; temel31/31, prefab77/77. Sürüm5.9.20. DEV-012 genel üretim motoru, DEV-006 ürün eşleme, DEV-011 mesnet kontrolleri açık.

## 2 Ekim 2026 — 5.9.21 Veranda net ölçü düzenleme / DEV-014

- DEV-014 tamamlandı: yatay/dikey mevcut veranda ölçüsüne çift tık veya Özellikler > Net ölçüyü düzenle. Gerçek duvar yüzü payları düşülmüş net santimetre girişi; başlangıç/bitiş/merkez sabit seçenekleri. Bağlı dik veranda kenarları birlikte taşınır.
- Ev düğümleri/duvarları/açıklıkları korunur. Bağlı yan kenar evde sabit kaldığında gerekli dik kademe, uygulanmadan önce dialogda bildirilir. Ev duvarı üzerine binen, kesişen, sıfırlanan veya ters dönen sınırlar reddedilir. Merkez sabit geometrik olarak mümkün değilse uygulanmaz; eğik veranda bu komutun kapsamında değildir. Direk/kiriş/çatı imalatı otomatik güncellenmez.
- Testler: tests/veranda.cjs içinde Tuna net69,5→100 derinlik,507→550 genişlik, bağımsız dikdörtgende merkez sabit, kademe kaldırarak eski genişliğe dönüş, duvar/açıklık koruma, çakışma reddi, gerçek ölçü çift tıklama, geri/ileri alma, oda korunması ve JSON yeniden açma başarılı. Temel31/31, prefab77/77 ve metin testleri geçti; bağımsız HTML üretildi.
- Sürüm5.9.21. Canlı kullanıcı sayfasına müdahale edilmedi. DEV-012 genel üretim motoru, DEV-006 ve DEV-011 açık kalır.

## 2 Ekim 2026 — 5.9.22 Plan panosu / DEV-015

- DEV-015 tamamlandı: Alan seç ile tamamen çerçeve içinde kalan nesneleri seçme; Ctrl+A tümünü seçme, Ctrl+C kopyalama, Ctrl+X kesme, Ctrl+V ardından tıkla konumlandırma, Esc iptal. Kesme/yapıştırma tek adımda geri alınır.
- Duvar açıklıkları ve bağlı prefabrik hat birlikte taşınır. Yeni nesne kimlikleri, oda türleri, metinler, tefrişler, tezgâhlar, seçili çatı bağlantıları ve malzemeler korunur. Boş projeye kaynak üretim ayarları da aktarılır. Mevcut duvarlara temas/kesişme/üst üste binme reddedilir; otomatik duvar birleştirme yapılmaz. Özel panel uyarıları gizlenmez.
- Pano Yeni/Aç ve aynı tarayıcı kaynağında yeniden açma boyunca yerel depoda korunur. Bu, Windows/AutoCAD panosu veya iki bilgisayar arası aktarım değildir; dosya yedeği yerine geçmez. Alan seçimi kesişen nesneleri değil tamamen kapsananları alır; bağlı panel hattı koruma amacıyla genişletilebilir.
- Kontroller: temel31/31, prefab77/77, veranda, metin ve yeni tests/plan-clipboard.cjs başarılı. Yeni test kopya kimlikleri, çatı bağlantıları, malzemeler, çakışma, gerçek fare/klavye kullanımı, kes/geri al, pano yeniden açma ve oda/ayar korumayı kapsar. Dağıtım HTML üretildi. Canlı plan ve kullanıcının özgün JSON dosyası değiştirilmedi. DEV-006/011/012 açık kalır.

## 2 Ekim 2026 — Ev bilgisayarı — 5.9.23 PDF / DXF dışa aktarma / DEV-016

- DEV-016 tamamlandı: üstte PDF çıktı ve DXF çıktı. PDF kâğıt A4–A0, yatay/dikey, 1:20/50/100/200; gerçek ölçek korunur, sığmayan sayfa engellenir. Önizleme, başlık, 1 m ölçek çubuğu ve %100 yazdırma notu var. PDF raster görseldir; A4–A2 300 dpi, A1 200, A0 150 dpi. Vektör PDF veya PDF içe aktarma değildir.
- DXF AutoCAD 2000 biçimi, 1:1 milimetre. Duvar konturlarında kapı/pencere boşlukları gerçekten kesilir; oda/tarama, makas, panel bağlantısı, donatı/metin ve ölçü katmanları ayrıdır. Yazılı ölçüler mevcut cm gösterimini korur. Eğriler düzenlenebilir çoklu çizgi, ölçüler çizgi/yazı olur; dinamik DIMENSION, parametrik duvar veya üretim nesnesi değildir. Koordinat Y ekseni CAD için ters çevrilir. Doğrudan DWG çıktısı ve PDF/DWG/DXF içe aktarma hâlâ açık.
- Aynı çizim fonksiyonları görünüm filtreleriyle kullanılır; H/U/köşe bağlantıları korunur. Ekran seçimi, zoom, plan, geri alma ve orijinal referans dosyaları değişmez. Çıktı yalnız kat planıdır; çatı 3B/imalat onayı değildir. JSON ana düzenlenebilir kayıt olarak saklanmalıdır.
- Kontroller: tests/plan-export.cjs gerçek indirme, taşma engeli, kapı boşluğu, Unicode, tefriş, ekran zoom bağımsızlığı, filtre/H korunması ve hata sonrası durum geri yükleme testleri. tests/verify-export-pdf.py PDF sayfa ve gömülü görüntü kontrolü; 500 cm duvar + uç payları 1:50 ölçekte görüntüden 101,94 mm (beklenen 102 mm, tolerans 0,4 mm). PDF önizlemeleri gözle kontrol edildi.
- AutoCAD 2021 Core Console Tuna DXF (916 nesne) ve tefrişli ev DXF (743 nesne) açıldı; INSUNITS=4, AUDIT toplam hata 0 / düzeltilen 0. Yeniden çalıştırılabilir kontrol tools/verify-export-autocad.ps1. Geçici dosyalar artifacts/export içinde, depoya eklenmez. Temel 31/31, prefab 77/77; veranda, metin ve pano regresyonları başarılı.
- Teknik format kaynağı: Autodesk DXF LWPOLYLINE ve TEXT referansı: https://help.autodesk.com/cloudhelp/2018/ENU/AutoCAD-DXF/files/GUID-748FC305-F3F2-4F74-825A-61F04D757A50.htm ve https://help.autodesk.com/cloudhelp/2015/ENU/AutoCAD-DXF/files/GUID-62E5383D-8A14-47B4-BFC4-35824CAE8363.htm .
- DEV-006/011/012 imalat doğrulaması ve DEV-009 içe aktarma/çok kat açık kalır. Yeni müşteri çizimi bu işlemde oluşturulmadı veya aktarılmadı; mevcut canlı sayfa değiştirilmedi.

## 2 Ekim 2026 — Ev bilgisayarı — 5.9.24 Ortak PDF/PNG anteti / DEV-017

- DEV-017 tamamlandı. Kullanıcı PDF ve PNG için logo/müşteri/bina/tarih/çizen/proje no içeren profesyonel antet, antetli/antetsiz seçim, dikey/yatay önizleme ve uygun yerleşim istedi. Ortak çıktı ekranı, iki alternatif önizleme, otomatik yön ve sığan en büyük standart ölçek (1:20/50/100/200) eklendi. Manuel ölçekte sığmayan çıktı reddedilir; çizim esnetilmez. Antetsiz seçenek firma/alt bilgi bandını da kaldırır.
- Firma, müşteri, adres, proje no, tarih, çizen, kontrol eden, revizyon, pafta, başlık, not ve iletişim alanları var. Yapı sistemi, duvar yüksekliği/kalınlığı, kapalı/veranda aks alanları plandan türetilir. Bilinmeyen onay veya çatı yüksekliği uydurulmaz. Logo dosyası depoda bulunmadı; firma yazısı yedek gösterimdir. PNG/JPG/WebP yükleme PNG'ye dönüştürülür; logo ve alanlar sheetInfo içinde JSON/yerel kurtarma/geri alma ile korunur. SVG/uzak URL kabul edilmez. Kaydet veya çıktı indirme düzenlenmiş bilgileri projeye işler; Vazgeç uygulamaz.
- PNG de aynı kâğıt/antet yerleşiminden oluşturulur; doğru dpi pHYs bilgisi yazılır. PDF/PNG görsel olarak denetlendi. Çıktı kaynak çizimini değiştirmez; antet verisi ayrı tutulur. Gerçek logo için kullanıcı çıktı ekranındaki Logo seç alanını kullanmalıdır; testteki LOGO TEST yalnız artifacts/export içinde, uygulamaya gömülü değildir.
- Kullanıcı kararı: prefabrik iç/dış duvar yüksekliği aynıdır; dış yükseklik alanı prefabrik modunda gizlendi, hafif çelik modunda kalır. Eski dy değerleri silinmedi; prefabrikten hafif çelik dışa aktarımında eşit kat yüksekliği kullanılır. Çatı yüksekliği bu alana bağlanmadı. Alçıpan fire yüzdesi Proje ayarları bölümünden Metraj Listesi'ne taşındı; değer ve hesap korunur.
- Kontroller: tests/title-block.cjs logo/müşteri kaydı, JSON yeniden açma, iptal, sayfa yenileme, PDF/PNG/antetsiz indirme, otomatik yerleşim, model koruma, sistem değişimi ve fire alanı yerini doğruladı. Temel31/31, prefab77/77; metin/veranda/pano ve PDF/DXF testleri geçti. PDF bağımsız ölçek ölçümü 101,94 mm (beklenen102 mm); PNG300 dpi bilgisi doğrulandı. Dağıtım HTML üretildi. Canlı kullanıcı çizimi ve kaynak JSON dosyaları değiştirilmedi.
- DEV-006/011/012 imalat doğrulaması, DEV-009 içe aktarma/çok kat ve diğer açık işler devam eder. Kullanıcı canlı çizimini diğer PC'ye taşımadan önce JSON olarak kaydetmelidir; antet bilgisi de bu kayda dahildir.

## 5.9.25 — Tuna referanslı DXF blokları

| Kimlik | İş | Durum |
| --- | --- | --- |
| DEV-018 | Panel bazlı DXF ve tek yükseklik ayarı | Tamamlandı: Tuna taslağında 49 panel / 49 ayrı INSERT; açıklık yanları ve sembolü panel bloğunda. Tefriş, tezgâh, metin ve bağlantılar ayrı blok. AutoCAD AUDIT iki örnekte 0 hata. [Analiz](analizler/2026-10-02-tuna84-dxf-bloklari.md). |

Üretim doğrulaması DEV-006/011/012 açık kalır. Tarayıcı canlı planı değiştirilmedi. `Yeni proje (11).json` kullanıcı dosyası bu teslimde depoya eklenmedi.

## 5.9.26 — Sade CAD çıktısı

| Kimlik | İş | Durum |
| --- | --- | --- |
| DEV-019 | Parçalı ölçü/tarama ve köşe direklerini düzeltme | Tamamlandı: native DIMENSION/HATCH, sade/panel/ekrandaki detay seçimi, 10×5 köşe ve 10×10 veranda serbest uç direği. [Rapor](analizler/2026-10-03-sade-dxf.md), tests/cad-export.cjs ve AutoCAD kontrolleri. |

Önceki DEV-018 blok aktarımı korunur. Sade görünüm varsayılandır; taramalar kutudan kapatılabilir. DIMENSION kendi uç noktasına göre güncellenir; panel bloğuna ilişkisel bağlantı kurulmuş değildir. Bağlantı çizgileri 2B plan sembolüdür; üretim profil detayının onayı değildir. DEV-006/011/012 açık. Kullanıcı canlı çizimi değişmedi, Yeni proje (11).json takip dışı korundu.

## 5.9.27 — Tarama ve veranda dış sınırı

| Kimlik | İş | Durum |
| --- | --- | --- |
| DEV-020 | Hatch duvara giriyor; veranda çizgisi direğin içinden geçiyor | Tamamlandı: duvar/direk izdüşümü taramadan çıkarılır, kapalı veranda konturu mevcut10cm direğin dış yüzüne5cm ötelenir. tests/cad-boundaries.cjs75708nokta ve AutoCAD dört örnek AUDIT0. [Rapor](analizler/2026-10-03-dxf-net-sinir.md). |

Aks, ölçü, oda alanı ve kayıtlı model değişmez; değişiklik DXF gösterimidir. Açık veranda yollarında iç/dış belirsiz olduğundan aks korunur. Canlı çizim ve takip dışı kullanıcı JSON korunmuştur. DEV-006/011/012 açık.

## 3 Ekim — Yükleme listesi bağlantısı / DEV-006

Excel ana sayfası yeniden okundu. Panel47/çizim49 farkı açık; stok pano ile yerleştirilmiş parça ayrımı doğrulanmalı. Öneri: çizim revizyonu → malzeme/kesim reçetesi → izlenebilir yükleme satırları; önce panel/metal/kapı-PVC satır eşleme. [Öneri ve kaynak hash](analizler/2026-10-03-yukleme-listesi-baglanti.md). Henüz entegrasyon uygulanmadı, reçeteler onaylanmadı. Sürüm5.9.27 aynı.


## 5.9.28 — Otomatik yükleme listesi ilk aşama

| Kimlik | İş | Durum / tamamlanma koşulu |
| --- | --- | --- |
| DEV-021 | Çizim–yükleme listesi entegrasyonu | İlk aşama tamamlandı: panel/bağlantı/açıklık sayımı, filtre, gerekçeli miktar, Tuna Excel satır eşleme, CSV, JSON/geri alma/kurtarma. Açık: stok pano-kesim reçetesi, kulak/dübel/net boy, PVC sipariş ölçüsü, çatı/tesisat/sarf ve onaylı sevkiyat revizyonu. DEV-006 ile birlikte devam eder. |

[Rapor ve kullanım](analizler/2026-10-03-yukleme-listesi-ilk-surum.md). Üstte **Yükleme listesi** açılır. Çizim adedi otomatik, sevk taslağı miktarı doğrulanmış üretim reçetesi olmadığından başlangıçta boş. Manuel karar gerekçeyle ve ilgili nesnelerin durumuyla kaydedilir; ilgili çizim değişince yeniden kontrol gerekir. Tuna Excel referanstır, her projenin hedefi değildir. Çıktı CSV; özgün XLSX şablonuna yazma henüz yok.

Sonraki adım: Tuna'nın 49 geometrik yuva/47 ürün farkını panel kesim-stok eşlemesiyle çözmek; ardından metal profil ve PVC reçetelerini kalem kalem doğrulamak. Bu teslim üretim onayı değildir. Canlı tarayıcı planı ve takip dışı Yeni proje (11).json değiştirilmedi; yeni müşteri planı aktarılmadı. İki PC arasında yükleme ayarları da Kaydet ile alınan JSON'un içindedir.


## 5.9.29 — Kullanıcı H kuralı

| Kimlik | İş | Durum |
| --- | --- | --- |
| DEV-022 | Makas altındaki H kulak/dübel sınıflandırması | Verilen iki kural uygulandı/test edildi. İç H dübel ve makas dışı H kuralları açık; stok/net boy reçetesi tamamlanmadı. |

[Rapor](analizler/2026-10-03-h-kulak-dubel.md). Makas altında H kulaklı; dış duvarda ayrıca dübelli. İçte dübelsiz veya makas dışında kulaksız varsayılmaz. Tuna kontrol taslağında21 dış kulaklı/dübelli,12 iç kulaklı,3 belirsiz H bağlantısı; H/üçlü ayrımı raporda. Mevcut otomatik makaslara göre sonuç; Excel ile farklar açık. Kullanıcı canlı planı değiştirilmedi. Diğer açık işler korunur.


## 5.9.30 — Dış H kuralı / DEV-022 devamı

Kullanıcı onayı: makas altına gelmeyen dış duvar H'leri **kulaksız–dübelli**. Programda işlendi. Makas verisi yoksa veya eşleşen makasın mesneti belirsizse otomatik kulaksız denmez. İç H dübel ve makas dışında kalan iç H kuralları hâlâ açık.

Tuna kontrol dosyası: H18 + üçlü H3 kulaklı–dübelli; H2 kulaksız–dübelli; H8 + üçlü H4 kulaklı/dübel bekliyor; H1 iç bağlantı kural bekliyor. Excel farkları çözülmedi. tests/loading-h.cjs ve loading-list.cjs başarılı. Canlı çizim değiştirilmedi; takip dışı JSON korundu. DEV-006/011/012/021 ve kalan DEV-022 kuralları devam eder.


## 5.9.31 — İç H kuralları / DEV-022

Kullanıcı onayı: iç duvar H'leri her zaman dübelsiz; makas altında kulaklı, dışında kulaksız. Böylece dört temel sınıfın kuralı tamamlandı ve programa işlendi. Makas verisi yok/mesnet belirsizse kulak kararı bekler; dübel dış duvar işaretinden belirlenir. H, üçlü H ve dörtlü H ailesi kapsamda; U/köşe için kural varsayılmaz.

Tuna kontrol dosyası, üçlüler dahil:21 kulaklı–dübelli,2 kulaksız–dübelli,12 kulaklı–dübelsiz,1 kulaksız–dübelsiz. Kaynak Excel farkları, net profil/kesim boyu ve sevk reçeteleri hâlâ açık (DEV-006/011/012/021); DEV-022 temel kulak/dübel kuralı tamamlandı, fiziksel makas uyumu kontrolü sürer. tests/loading-h.cjs ve loading-list.cjs başarılı. Kullanıcı çizimi ve takip dışı JSON korunmuştur. [Ayrıntı](analizler/2026-10-03-h-kulak-dubel.md).


## Tuna H–Excel karşılaştırması / DEV-006 ve DEV-022

[Rapor](analizler/2026-10-03-tuna-h-excel-karsilastirma.md):36/36 toplam eşit; standart dış20/iç9, üçlü dış3/iç4 eşit. Excel kulaklı12/kulaksız24, program33/3. Dış8 standart+1 üçlü farkı makasla aynı doğrultudaki duvarlarda; iç8 standart+4 üçlü de programda kulaklı, Excel'de kulaksız. **2B makas aks eşleşmesi fiziksel H'nin makasa girdiğini kanıtlamaz.** DEV-022 temel tarifleri kayıtlı ama fiziksel temas koşulu doğrulaması açık; üst/alt cephe ve iç bölme örnekleri kullanıcıyla doğrulanmalı. Kod/sürüm5.9.31 değişmedi, Excel ve müşteri çizimi değiştirilmedi. Rapor bağlantı kimlikleri ve kaynak hash'lerini içerir.


## Tuna H mesnet yorumu — sonraki uygulama düzeltmesi

[İlişkilendirme raporu](analizler/2026-10-03-tuna-h-mesnet-yorumu.md): makasın yalnız a/b uçlarına oturan H'leri kulaklı kabul eden alternatif hesap Excel'in6satırını tam karşılıyor:10/10/9/2/1/4. Kullanıcının “makasa giren” şartı önceki kodda geniş2B aks eşleşmesi olarak yorumlanmış. Güçlü açıklama kulak=gerçek mesnet bağlantısı, dübel=dış duvar. Bu projede iç13H gerçek uç mesnette değil; her projede iç H kulaksız genellemesi yapılmamalı. **DEV-022 kod düzeltmesi açık:**5.9.31 halen33kulaklı üretir; analizdeki12kulaklı sonucu henüz uygulamaya işlenmedi. Kod/çizim/Excel değişmedi. Diğer açık işler sürer.


## 5.9.32 — Onaylı H mesnet eşlemesi ve Excel / DEV-022

Kullanıcı mesnet yorumunu onayladı ve sonraki çizimlerde otomatik etiket/Excel aktarımı istedi. Gerçek model makasının a/b uçlarına eşleşen H kulaklı; arada üzerinden geçilen H kulaksız. Dış H dübelli/iç H dübelsiz. İç duvarda gerçek makas ucu bulunursa kulaklı-dübelsiz olabilir. Makas verisi yok/mesnet belirsizse adet otomatik kesinleşmez. Özel ara mesnet henüz modelde ayrıca tanımlanmaz; bu tür yeni denemelerde eklenmesi gerekir.

H sınıfları tüm çizimlerde otomatik hesaplanır; yükleme listesindeki H taslak adedi otomatik, diğer ürün kuralları ayrı bekler.250cm ve mevcut10/6cm gruplarında Tuna satırları otomatik eşlenir; farklı ölçülerde bu referans zorlanmaz. Tuna sonucu10/10/9/2/1/4,36H; altı Excel satırı tam eşleşti. Kullanıcı elle miktar değiştirebilir; geometri/kural değişimi eski kararı yeniden kontrol ettirir.

Yükleme listesi → Planda H etiketleri (K/KS/D/DS); seçim JSON/geri alma/kurtarmada saklanır. H ve köşe sembolleri etiket kapatıldığında da kalır. Excel indir (.xlsx) tüm güncel listeyi yeni dosyada verir; özgün Tuna Excel dosyasını değiştirmez. CSV de korunur. XLSX sayılar sayısal, kullanıcı metinleri formül olarak yürütülmez. Profil kesiti/net boy ve diğer üretim kalemleri hâlâ kontrol gerektirir.

Kontroller: loading-h.cjs iki yön/uç-orta ayrımı/mesnet ve veri belirsizliği, Tuna altı grup; loading-list.cjs otomatik adet, gerçek XLSX/CSV, etiket, kayıt/geri alma; verify-loading-xlsx.py bağımsız okuma; plan-export.cjs başarılı. Arayüz ve etiketler görsel incelendi. Canlı kullanıcı çizimi ve takip dışı JSON korunmuştur. Sıradaki iş kullanıcının yeni deneme çizimlerinde doğrulama; diğer açık işler devam eder.


## 5.9.33 — Köşe direği ürün ölçüsü / DEV-023

| Kimlik | İş | Durum |
| --- | --- | --- |
| DEV-023 | 10'luk/6'lık köşe direği Excel ürün eşlemesi | Tamamlandı: çizim nominal10/6cm korunur; yükleme ve XLSX/CSV98×98×bina yüksekliği(mm) /58×58×bina yüksekliği(mm). Adet otomatik. |

Kullanıcı açık kuralı:10'luk köşe98×98,6'lık köşe58×58; boy sabit2500 değil bina yüksekliği(cm)×10. Tuna'da8 adet98×98×2500 ve Excel22satırı eşleşir. Farklı yükseklikte Tuna2500satırı zorla eşlenmez. Karma10/6 veya tanımsız kesit kural bekler; veranda serbest direğine ve H profiline bu kural uygulanmaz. Çektirme U3/4 farkı açık. Yükseklik değişince eski manuel düzeltme yeni ürün grubuna sessizce taşınmaz.

Kontroller: tests/loading-corners.cjs10/6 nominal koruma,250/280/300cm boy,8Tuna adedi, tanımsız kesit ve eski düzeltme; loading-list, loading-h, verify-loading-xlsx başarılı. Gerçek indirilen XLSX'te98×98×2500,8adet,tuna-22 doğrulandı. Canlı plan ve kullanıcı JSON'u değiştirilmedi. Diğer açık işler devam eder.


## 5.9.34 — Çektirme U ve yedek / DEV-024

| Kimlik | İş | Durum |
| --- | --- | --- |
| DEV-024 | U ölçüsü, Tuna3/4 farkı ve yedek | Tamamlandı: kullanıcı3/4farkının bilinçli yedek olduğunu açıkladı; ölçü ve otomatik sevk hesabı uygulandı. |

Kullanıcı kararı:6cm duvar U60mm,10cm duvar U100mm. Boy=bina yüksekliği(cm)×10−60mm. Her5U'ya1yedek;3→4örneği gereği her başlayan5'li grup yukarı yuvarlanır. U yoksa yedek yok;1–5adet+1,6–10adet+2,11–15adet+3. Farklı en/boylar ayrı gruplandırılır ve her gruba ayrı yedek hesaplanır. Bu yorum kullanıcıya uygulama başında açıklandı. Çizim adedi değişmez, sevk miktarı çizim+yedek; gerekçeli manuel miktar son toplamın yerine geçer, tekrar yedek eklenmez.

Tuna3adet60×2440mm+1yedek=4adet, Excel29satırı eşleşir. Yedek arayüzde ve XLSX/CSV'de ayrı görünür. Tanımsız kesit/boy otomatik hesaplanmaz. H ve köşe adetleri korunur. tests/loading-u.cjs0/1/3/5/6/10/11, ölçü grubu ayrımı, manuel ve eski karar; loading-list/H/corners ve verify-loading-xlsx başarılı. Canlı plan ve kullanıcı JSON'u korundu. U farkı kapandı; panel47/49 ve diğer üretim işleri sürer.


## Çektirme U — son kullanıcı teyidi

Kullanıcı dört maddeyi birlikte açıkça doğruladı:6'lık bağlanan duvar için60mm U;10'luk için100mm U; her iki ende boy=bina yüksekliği−60mm; her başlayan5adede1yedek ve farklı ölçüler ayrı.250cm yükseklikte60×2440 veya100×2440mm;100×2400mm kullanılmaz. Önceki açıklama sorusundaki belirsizlik kapandı. Mevcut5.9.34 hesabı doğru; kod/sürüm değişmedi. Bu karar ev/iş ortak kaydıdır.


## Pano stok hesabı — iki yarım için bir tam / DEV-025

| Kimlik | İş | Durum |
| --- | --- | --- |
| DEV-025 | Yerleştirilen panel ile sevk stok panosu ayrımı | Kural toplama/uygulama açık. Kullanıcı normal koşulda iki yarım yerine bir tam pano gönderildiğini, montajcının şantiyede kestiğini doğruladı. |

Önceki “bir yarım gönderiyoruz” ifadesi kullanıcı tarafından “bir tam” olarak düzeltildi. Çizimde iki yarım panel korunmalı, sevk listesi bunların kaynak tam panosunu ayrı saymalı. Özel durumlar olabileceği kullanıcı tarafından belirtildi. Tek kalan yarımın sevki, özel boy parçaların birlikte kesimi ve malzeme uyumluluğu ayrıntıları henüz kesinleştirilmedi. Bunlar varsayılarak genel kesim optimizasyonu uygulanmamalı. Bu tur kayıt güncellemesidir;5.9.34 kodu değişmedi, pano otomatik stok hesabı henüz eklenmedi. Tuna49/47 farkı bu kural kullanılarak ayrıca doğrulanmalı; fark çözüldü denmez. Diğer açık işler ve kullanıcı çizimi korunur.


## DEV-025 — Kesim kapsamı genişletmesi

Kullanıcı aynı tam panodan şantiyede kesim uygulamasının yalnız62,5cm yarım panel için değil57,5cm ve daha kısa özel panel parçaları için de geçerli olduğunu açıkça belirtti. Kural parça adına veya yalnız yarım panel tipine bağlanmamalı; uyumlu parçaların gerçek kesim enlerinden stok pano ihtiyacı hesaplanmalı.62,5/57,5 kullanıcı örnekleridir; mevcut aks/net kesim katalog farkları bu kararla kendiliğinden değiştirilmez. Bir tam panodan üç veya daha fazla küçük parça çıkarma, tek kalan parça sevki ve kesim payı henüz açıkça tarif edilmedi. Bu tur üretim kararı kaydıdır; kod5.9.34 değişmedi. DEV-025 uygulaması ve Tuna49/47 doğrulaması açık; kullanıcı çizimi korunmuştur.


## 5.9.35 — Dolu pano stok kesimi / DEV-025

Kullanıcı2×30cm→1tam,3×40→1tam,102→1tam,2×70→2tam örneklerini onayladı; sahada kesim artığı kabul ediliyor. Çizim parçaları birleştirilmez/ölçüleri125'e çevrilmez.125,5 ve62,75 dışında özel genişlik etiketi panel numaraları kapalıyken de görünür; geometri ve ölçü değerleri korunur.

Net kesimi bilinen dolu parçalar kalınlık/yükseklik bazında1250mm stok panoya büyükten küçüğe sığdırılır. Bu uygulanabilir plan en az stok garantisi değildir; en toplamını1250'ye bölmekle yetinilmez (2×700 iki stok). Satır Çizim=parça adedi, Sevk=stok adedi. Kesim dağılımı panel numaraları ve artıklarla UI/Excel/CSV'de gösterilir; manuel toplam ve eski karar denetimi korunur. Kapılı/pencereli ürünler dolu havuza katılmaz. Testere payı henüz verilmedi; otomatik pay uydurulmadı, bu durum açıklamada belirtilir.

Mevcut Modular net kesim kataloğu öncelikli. Kullanıcının doğrudan verdiği30/40/70/102/57,5/62,5cm örnekleri ayrıca net mm olarak tanınır; diğer katalog dışı genişlikte net kesim bilinmediğinden otomatik stok hesabı bekler. Aks ölçüsünden evrensel pay çıkarılmaz.

Tuna:24dış dolu parça→22stok (Excel23);13iç dolu parça→12stok (Excel12).710+520mm birlikte1230mm olur ve20mm artık bırakır; önceki47toplamla fark tamamen kapanmadı. Kapı/pencere12ürünün reçetesi ayrı açık.49yerleşim korunur. DEV-025 ilk uygulama tamam, bilinmeyen kesim ölçüsü/testere payı ve deneme çizimleriyle üretim doğrulaması açık.

Testler: loading-stock kullanıcı örnekleri, ölçü grupları, sığma/artık, eski karar; loading-list Tuna24/22 ve13/12, JSON/CSV/XLSX; loading-H/U/corners regresyonları; plan-export başarılı. Özel etiketler görsel kontrol edildi. Canlı müşteri planı ve takip dışı JSON korunmuştur.

## 5.9.36 — Serbest özel ölçüler / DEV-025

Kullanıcı örneklerin sınırlı liste olmadığını netleştirdi. 5.9.35 içindeki 30/40/70/102/57,5/62,5 özel ölçü listesi kaldırıldı. Her pozitif sonlu özel en genel olarak değerlendirilir. Modular kataloğundaki doğrulanmış net kesimler önceliklidir (125,5→1250; 62,75→625 mm). Diğer enlerde çizim ölçüsü mm'ye çevrilerek stok hesabına esas alınır; bu değer doğrulanmış net imalat kesimi sayılmaz, H payı uydurulmaz. Kaynakta cutBasis tutulur ve hesap açıklamasında belirtilir. 1250 mm'den büyük tek parça bu stokla otomatik karşılanmaz. Kapı/pencereler ayrı kalır. Çizim geometri ve etiketleri değişmez.

Kalınlık/yükseklik grupları, artık ve uygulanabilir büyükten küçüğe sığdırma korunur; en az stok garantisi ve testere payı henüz yoktur. 1249 farklı en, ondalıklı karışık gruplar, bilinen katalog önceliği, büyük parça kontrolü ve tarayıcıda 37,2+86,4 cm özel parçalarının tek stok hesabı test edildi. Tuna sayıları 24/22 ve 13/12 değişmedi; JSON/CSV/XLSX ve eski karar kontrolleri geçti. DEV-025 saha net kesim paylarının genellenmesi, testere payı ve deneme çizimleriyle doğrulama açık. Canlı kullanıcı çizimi ve Yeni proje (11).json korunmuştur.

## 3 Ekim 2026 — Gün sonu yedeği, yarın devam

Kullanıcı çalışmayı yarına bıraktı. Program 5.9.36; değişiklik yapılmadı. Son karşılaştırma, yedek envanteri ve yarın ilk adım: [gün sonu devir raporu](analizler/2026-10-03-gun-sonu-devir.md). Mevcut eski JSON ayrı cizimler/2026-10-03-ev-mevcut-yedek-5.9.14.json olarak korundu (SHA-256 raporda); canlı son çizim olduğu doğrulanmadı. DEV-002 açık: file:// sekmesine erişim güvenlik politikası engeli nedeniyle canlı çizim yedeği alınamadı; kullanıcı Kaydet ile son JSON'u dışa aktarmalı. DEV-025/DEV-006: dış pano 22/23 farkı ve kapı/pencere reçeteleri yarın incelenecek; diğer açık işler devam ediyor.

## 3 Ekim 2026 — İş bilgisayarında devam

Temiz main, 4c2f1c4 üzerinden f0911ee sürümüne fast-forward güncellendi. Ortak kayıtlar ve gün sonu raporu okundu. tests/loading-stock.cjs ve tests/loading-list.cjs iş bilgisayarında başarılı: Tuna 24 dış dolu parça/22 stok, 13 iç parça/12 stok sonucu yeniden doğrulandı. Canlı tarayıcı sayfası yenilenmedi, plan yüklenmedi; kayıtlı kontrol taslağı ayrı test tarayıcısında kullanıldı.

DEV-025/006 için kullanıcıya 710+520 mm parçaların aynı 1250 mm panodan kesilip kesilemeyeceği soruldu. Yanıt gelmeden Excel23'e uydurmak için stok kuralı değiştirilmedi. Son canlı JSON hâlâ doğrulanmadı (DEV-002). Sıradaki iş sevk tercihini netleştirmek ve kapılı/pencereli ürün reçetelerini incelemek. package.json hâlen5.9.19 yazarken uygulama/rapor5.9.36; bu metadata farkı sonraki sürüm tesliminde uzlaştırılmalı. Diğer açık işler geçerlidir.

## 3 Ekim 2026 — DEV-025 / DEV-006 kullanıcı teyidi

Kullanıcı 710 ve 520 mm dolu parçaların aynı1250mm panodan kesilebileceğini açıkça onayladı:1230mm kullanılır,20mm artık kalır; Tuna dış dolu pano sevki22 olarak korunur. Excel23 sayısına uymak için fazladan stok eklenmeyecek. Excel farkının tarihsel nedeni doğrulanmadı; programın bu kesim tercihi üzerindeki belirsizlik kapandı. Kod değişikliği gerekmedi;5.9.36 hesabı korundu. Testere payı ve diğer ürün reçeteleri ayrı açık konulardır. Sıradaki iş kapılı/pencereli panoların yükleme reçetelerini incelemek; DEV-002 son canlı JSON ve diğer açık işler korunur.

## 3 Ekim 2026 — DEV-006 kapılı/pencereli pano karşılaştırması

[Karşılaştırma](analizler/2026-10-03-aciklik-panolari.md) kayıtlı kontrol taslağından yeniden üretildi:6pencere ve1dış kapı panosu Excel ile eşleşiyor. İç kapıda program4×1250+1×1220, Excel3×1250+2×1220; toplam5aynı, bir ürün eni farklı. Hazır pano sevk kuralı, doğramanın ayrı sayılması ve farklı iç kapının kimliği kullanıcıyla netleştirilecek. Kod5.9.36 ve canlı plan değişmedi; önceki kapı boşluğu incelemesi erteleme kararı korunuyor. Diğer açık işler sürüyor.


## 3 Ekim 2026 — DEV-006 pano yorumu düzeltmesi

Kullanıcı, işaretlenen kapılı duvar bölümlerinin küçük kapı parçaları değil, kapı açıklığı panelin içinde bulunan tam panolar olduğunu açıkladı. 1250/1220 mm imalat eni farkı makas yönü/aks kaynaklı özel kesimle birlikte incelenecek. Önceki anotasyonun konumu hatalı; raporda geçersiz sayıldı. 4×1250+1×1220 ile Excel3×1250+2×1220 farkı çözülmedi; hangi panonun özel kesildiği ve “kasalar geniş” notunun açıklığı açık. Kod ve canlı çizim değişmedi; sevk reçetesi uydurulmadı. [Güncellenen analiz](analizler/2026-10-03-aciklik-panolari.md).

## 3 Ekim 2026 — İş PC kayıtlarının ev PC'ye alınması

Kullanıcının isteğiyle origin/main üzerinden dört kayıt f0911ee→2c10ab8 fast-forward alındı; yalnız DEVAM, CALISMA_KAYDI ve açıklık panoları raporu değişti. Yerel Yeni proje (11).json ve canlı çizim korundu. Uygulama 5.9.36 değişmedi; bu devirde yeni kod testi gerekmedi.

DEV-006 sıradaki konu: kapı açıklığı tam pano içindedir; iç kapılı pano 4×1250+1×1220 / Excel3×1250+2×1220 farkında hangi panonun makas/aks nedeniyle özel kesildiği, geniş kasa notu ve ayrı doğrama sevki netleştirilecek. İş PC'deki hatalı anotasyon kullanılmayacak. DEV-025 için 710+520 birlikte kesim onaylı, dış dolu pano22 korunur. Kullanıcı önceki ev konuşmasında çizimde değişiklik yapmadığını ve eldeki son JSON ile devam edilebileceğini belirtti; yeniden kayıt talep edilmez. Bu beyan eski 5.9.14 yedeğini Tuna kontrol taslağıyla aynı dosya yapmaz; mevcut analiz kaynağı cizimler/2026-10-02-tuna84-dwg-esleme-taslak.json olarak korunur. Diğer açık işler ve metadata farkı devam eder.

## DEV-026 — Diğer yükleme kalemlerinin reçeteleri

| Kimlik | İş | Durum |
| --- | --- | --- |
| DEV-026 | Alt çerçeve, omega, veranda profil/kiriş ve çatı kenarı malzemelerinin otomatik yükleme hesabı | 5.9.44: onaylı dört omega/Z/kiriş kalemi uygulandı; tests/loading-top.cjs ve analizler/2026-10-04-omega-veranda-uygulama.md. Alt çerçeve ve direk önceki kuralları korunur. Referans adet/net boy farkları DEV-011, omega yedeği ve diğer çatı kenarı reçeteleri açık. |

[Kalemler ve eksik kurallar](analizler/2026-10-03-diger-yukleme-kalemleri.md). 3 Ekim 2026 ev PC: kullanıcı diğer kalemleri ayarlamayı istedi. Git fetch sonrası uzak dal ile eşitlik kontrol edildi. Kaynak ve önceki kayıtlar tarandı; onaysız adet/reçete eklenmedi. Kod5.9.36 değişmedi, canlı plan ve yerel JSON korundu. DEV-006 kapılı pano farkı ve tüm diğer açık işler devam eder. Sıradaki adım alt çerçeve yanıtını kurala ve doğrulama testine dönüştürmek.

## 3 Ekim 2026 — DEV-026 alt çerçeve kapsamı onayı

Kullanıcı: alt çerçeve kapılı ve pencereli panolar dahil tüm duvarların altındadır; yalnız veranda kısmında yoktur. Hesapta kapı/pencere boşlukları duvar uzunluğundan düşülmeyecek. Veranda açık sınırları hariç tutulur; verandaya bakan gerçek ev duvarı tüm duvarlar kuralına dahildir. Bu karar yalnız uygulama kapsamını kesinleştirir. 60/100 mm kesit eşlemesi, 2500 mm stok boyunun genelliği, kesilen artığın başka duvarda kullanılması/ek yapılması, köşe-uç boyları ve yedek henüz kullanıcı tarafından doğrulanmadı. Sevk adedi uydurulmadı; uygulama5.9.36 ve çizim değişmedi. Sıradaki adım stok/artık/yedek kurallarını almak; diğer açık işler korunur.

## 3 Ekim 2026 — 5.9.37 / DEV-026 alt çerçeve hesabı

Kullanıcı sabit stok boyunu 250cm olarak 60 ve100mm için doğruladı. Aynı kalınlıktaki tüm duvar uzunlukları birlikte toplanır, toplam/250 yukarı yuvarlanır; her mevcut kalınlık grubuna1yedek eklenir. İç/dış ayrımı yapılmaz; kapı/pencere boşlukları düşülmez, veranda açık sınırları hariçtir. 3350cm→14+1=15; kullanıcının örnekteki3250 ifadesi13+1=14eder. Artıklar başka duvarlarda kullanılabilir; ayrı ayrı duvar yuvarlaması veya pano kesim algoritması uygulanmaz.

Uygulama ölçü tabanı duvar düğümleri arası aks uzunluklarıdır; varsayımsal köşe payı düşülmedi. Kontrol Tuna JSON'unda100mm toplam3659,5cm→15+1=16 (Excel15);60mm toplam2143,5cm→9+1=10 (Excel10). 100mm farkının sebebi kesinleşmedi; Excel'e uydurmak için1yedek kaldırılmadı. Gerekirse referansın yedek ve uzunluk esasını netleştir. UI toplam/bölüm sonucunu, CSV/XLSX açıklaması formülü ve yedeği gösterir. Manuel toplam tekrar yedek eklemez; çizim değişirse eski karar geçersizdir. Tanımsız kalınlıklar onay bekler.

Kontroller: loading-frames sınır/yuvarlama/grup/manuel/eski karar; loading-list kapı/pencere ve veranda hariç kapsamı, JSON ve dışa aktarma; loading-stock regresyonu; verify-loading-xlsx alt çerçeve15+1 ve9+1 dahil geçti. Build başarılı. Sürüm5.9.37; package.json eski sürüm metadatası da eşitlendi. Canlı çizim ve yerel JSON değişmedi. DEV-026 alt çerçeve uygulandı; omega, veranda kirişleri ve çatı profilleri açık. Diğer açık işler devam eder.

## 3 Ekim 2026 — DEV-027 / 5.9.38 yedek görünürlüğü

| Kimlik | İş | Durum |
| --- | --- | --- |
| DEV-027 | Yedeksiz ihtiyaç, dahil yedek ve toplam sevkin ayrı gösterilmesi | Tamamlandı: UI, Excel ve CSV; loading-spares ve verify-loading-xlsx kontrolleri. |

Kullanıcı yedeğin ikinci kez eklenmesini önlemek için açık ayrım istedi. U ve alt çerçevede ihtiyaç/yedek/toplam ayrı; yedek toplam sevke dahil, tekrar eklemeyin açıklaması görünür. Dolu panoda yedeksiz ihtiyaç geometrik parça değil stok pano adedidir. Otomatik yedek eklenmeyen satırlarda0 ve açık açıklama bulunur; bu gelecekte yedek gerekmeyeceği kararı değildir. Bekleyen hesap ve manuel toplamda yedek ayrımı bilinmiyor olarak gösterilir; onaylanmış yedek varsayılmaz. Manuel sevk miktarına ikinci kez yedek eklenmez. Mevcut hesap formülleri değişmedi.

UI ayrı sütunlarla görsel kontrol edildi; loading-list, loading-frames, loading-spares ve verify-loading-xlsx geçti. Kod/dağıtım5.9.38. Canlı çizim ve yerel kullanıcı JSON'u korunmuştur. DEV-026 diğer malzeme reçeteleri, alt çerçeve100mm16/15farkı ve önceki açık işler devam eder.

## 3 Ekim 2026 — 5.9.39 / DEV-027 sütun adları

Kullanıcı isteğiyle UI, Excel ve CSV başlıkları Adet ve Yedek olarak sadeleştirildi. Toplam sevk, yedeğin dahil olduğu açıklama, manuel belirsizlik ve sayım formülleri korundu. Build, loading-list ve verify-loading-xlsx kontrolleri başarılı. Canlı çizim ve yerel JSON değişmedi. Diğer açık işler devam eder.

## 3 Ekim 2026 — DEV-026 üst omega sınıflandırması

Kullanıcı kuralı: alt çerçeve tüm duvarların altında, üst omega tüm duvarların üstündedir. Alt çerçeve ürün ailesi yalnız duvar kalınlığıyla60/100olarak değişir. Üst omega hem kalınlık hem duvarın çatı/makas konumuyla seçilir:
- İç duvar üstü: duvar omegası.
- Baş makas/alın tarafındaki dış duvar üstü: baş makas omegası.
- Yan saçak tarafındaki dış duvar üstü: saçak omegası.

Bu üç üst ürün aynı hatta üst üste sayılmayacak; konuma uygun ürün seçilecek. Kullanıcı henüz baş makas omegasının Excel'deki Baş Makas Z Sacı ile aynı ürün olduğunu söylemedi; eşleştirme varsayılmayacak. Duvar omegası2500/3680/4940boylarının seçimi, baş makas/saçak stok boyları ve yedek kuralları açık. Karma/yavru çatı alanlarında yerel çatı ilişkisi gereklidir; yalnız global yönle tüm dış duvarları sınıflandırmak yeterli sayılmaz. Çatı bilgisi eksikse ürün türü uydurulmayacak.

Karar kaydedildi; otomatik sevk reçetesi henüz eklenmedi. Uygulama5.9.39, canlı plan ve kullanıcı JSON'u değişmedi. DEV-026 sıradaki adım baş makas ürün eşlemesi ve farklı boy seçimini netleştirmek; diğer açık işler devam eder.

## 3 Ekim 2026 — DEV-026 uzun omega aday eşleşmesi

[Kaynaklı boy analizi](analizler/2026-10-03-omega-boy-eslesmesi.md): kayıtlı Tuna planında üst iki yatak odası net derinliği368,5cm, salon494cm. Excel3680/4940mm ile güçlü aday eşleşme; ilkinde5mmfark var, pay varsayılmadı. İki odaya3'er ve salona3adet ihtimali6/3sayısıyla uyumlu ama doğrulanmadı. Bu60mmürünleri10cm dış duvar üstüne atama yapılmadı; oda açıklığını geçen kullanım olasılığı kullanıcıya sorulacak. Boy seçiminin eksiz açıklık geçme amacı hipotezdir. Uygulama5.9.39 ve canlı çizim korundu; sevk reçetesi değiştirilmedi. Diğer açık işler devam eder.

## 3 Ekim 2026 — DEV-026 montaj payı kullanıcı onayı

Kullanıcı 368,5cm net açıklık ile368cm omega arasındaki5mm farkı montaj payı olarak kabul etti. Bu eşleşme için3685−5=3680mm onaylıdır. Önceki kayıtlardaki bu farkın belirsizliği kapanmıştır. Bu karar tüm omega boylarından5mm düşme kuralı değildir;4940mm örneği değiştirilmez. Uzun omegaların gerçek yerleşimi/üçer sıra varsayımı ve adet/yedek reçetesi henüz onaylanmadı. Kod5.9.39, çizim geometrisi ve sevk hesabı değişmedi. Sıradaki adım yerleşim ve adet kuralını netleştirmek; diğer açık işler korunur.

## 3 Ekim 2026 — H payı hatırlatması / DEV-026 ölçü yorumunun düzeltilmesi

Kullanıcı çizimde H'ye ayrı ölçü vermeden0,5cm payı panel yerleşim ölçüsünde tuttuklarını hatırlattı:125cm pano→125,5cm yerleşim. Buradaki0,5cm en/hat doğrultusundaki H birleşim payıdır; duvarın6/10cm kesit kalınlığına otomatik ek değildir. Yerleşim ölçüsü ile net ürün/kesim ölçüsü ayrı tutulmalı; aynı H payı tekrar montaj payı diye düşülmemeli.

Önceki3685→3680mm farkını yalnız bağımsız montaj boşluğu diye etiketleyen yorum, bu hatırlatma ışığında yeniden incelenecek. 3680mm referans ürün boyu korunur; farkın H yerleşim payı içindeki kaynağı bağlantı geometrisiyle doğrulanmadan ikinci bir5mm düşülmez. Her özel boydan evrensel5mm düşme kuralı çıkarılmadı. Önceki üçer sıra/oda açıklığı yerleşimi hâlâ hipotezdir. Kod5.9.39 ve çizim değişmedi. Sıradaki iş H/aks/net boy zincirini omega yerleşimiyle birlikte doğrulamak. Diğer açık işler korunur.

## 3 Ekim 2026 — DEV-026 omega boy seçimi ertelendi

Kullanıcı omega boylarını şimdilik bekletmeyi, göndereceği birkaç başka proje ve Excel üzerinden daha sonra netleştirmeyi istedi. 2500/3680/4940mm referans boyları ve önceki bulgular korunur; üçer sıra, oda açıklığı eşlemesi ve genel H/montaj payı dönüşümü doğrulanmış otomatik reçete değildir. Yeni örnekler gelmeden bu boyları genel kurala dönüştürme veya aynı açıklama sorusunu tekrar tekrar sorma. İç duvar/baş makas/saçak ürün sınıflandırması kararı geçerlidir. Uygulama5.9.39 ve mevcut hesaplar değişmedi; diğer açık işler korunur. Yeniden başlama koşulu: kullanıcının ek proje/Excel sağlaması; kaynakları kaydedip projeler arası eşleştirme yapmak.

## 3 Ekim 2026 — DEV-026 veranda profilleri

Kullanıcı flanşlı veranda direğini her zaman100×100mm olarak doğruladı. Yeni görsel ortak referanslara kopyalandı; [kaynak ve kesim raporu](analizler/2026-10-03-veranda-profilleri.md). Bu örnekte4970mm ön kiriş tek stok;2520+640mm yan kirişler bir3500mmstoktan kesilir (nominal340mmartık). Görselde direk2700mm, Excel'de2500mm; boy farkı açık, otomatik bina yüksekliği payı çıkarılmadı. Genel stok boyu, ara direk ve yedek kuralları da açık. Uygulama5.9.39 ve canlı çizim değişmedi. Sıradaki adım direk boyunu netleştirmek; omega boy ertelemesi ve diğer açık işler korunur.

## 3 Ekim 2026 — 5.9.40 / DEV-026 veranda direk boyu

Kullanıcı her binada direk boyunun bina yüksekliği olmasını, özel durumlarda elle müdahale etmeyi istedi. Çizimdeki serbest veranda düğümleri100×100mm flanşlı profil olarak otomatik sayılır; boy bina yüksekliği×10mm. Tuna2adet100×100×2500mm, Excel satır19ile uyumlu. Otomatik yedek eklenmedi, ara direkler kendiliğinden üretilmedi. Kiriş genel reçetesi bu değişiklikte uygulanmadı.

Yükleme satırı Düzenle alanında direk boyu mm olarak değiştirilebilir; değişiklik satırdaki tüm direklere uygulanır. Miktar/gerekçe ve boy JSON'da korunur; çizimde direk geometrisini değiştirmez, sevk ölçüsüdür. Boy2500dışındaysa Tuna2500referansı kaldırılır. Bina yüksekliği değişirse eski gruba ait karar orphan olarak korunur; yeni gruba sessizce taşınmaz. Aynı grubun çizimi değişirse eski manuel karar geçersiz olur.

Build, loading-list, loading-posts (2direk,2500otomatik,2700manuel,JSON,2800yeni bina boyu) ve verify-loading-xlsx geçti. Uygulama5.9.40; canlı çizim ve yerel JSON korunmuştur. Omega boyları ertelenmiş; kiriş stok genellemesi, ara direk ve yedek kararları ile diğer açık işler sürer.

## 3 Ekim 2026 — DEV-026 yan kirişleri ayrı listeleme onayı

Kullanıcı2520mm ve640mm yan kirişlerin ayrı ayrı yazılmasının da doğru olduğunu onayladı. Bu proje için100×100×4970mm1adet,100×100×2520mm1adet ve100×100×640mm1adet ayrı parça listesi geçerlidir. Önceki3500mmtek stoktan yanları kesme seçeneği zorunlu değildir; projeye ait alternatif sevk biçimidir. Aynı ihtiyaç hem3500stok hem2520/640parçaları olarak çift sayılmayacak.3500sabit/genel stok standardı çıkarılmadı.

Kiriş boyları şu anda kullanıcı açıklamalı imalat görselinden onaylıdır; tüm projelerde aks ölçüsünden net boy dönüşümü, uç bağlantı payları ve yedek kuralı henüz kesinleşmedi. Bu onay otomatik geometri/kesim formülünü doğrulamaz. Uygulama5.9.40 ve canlı çizim değişmedi. Sıradaki adım net kiriş boyunu uç bağlantılarından türetmek; diğer açık işler korunur.

## 3 Ekim 2026 — DEV-026 kiriş bağlantısı ve kesim payı

Kullanıcı direklerin her projede100×100mm olduğunu, yalnız boyun bina yüksekliğiyle değiştiğini tekrar doğruladı; mevcut5.9.40direk kuralı uygundur. Yeni açıklamalı görsel: referanslar/tuna-84m2/2026-10-03-veranda-kiris-pay-ornek.png (bu yeni örneğin Tuna ile aynı proje olduğu varsayılmadı; referans klasöründe saklandı). Özgün dosya C:/Users/obayr/AppData/Local/Temp/codex-clipboard-47cccf84-9cd6-4d4d-a358-458fcec64ffe.png; SHA-256: 3eb39dc6940ed2cc5f21c1a4535c4fd9631e9e681628309a5bd481764ad4797e.

Görsel notu kirişlerin direklerin arasına gireceğini ve her kiriş için+10cm kesim payı verileceğini açıklıyor. Bu toplam100mm/parça boy payıdır; her uca100mm veya fazladan1adet yedek olarak yorumlanmaz. Görselde kiriş1880/2560/5550mm; direk2800mm yazıyor. Yazılı kiriş boylarının100mm payı içerip içermediği henüz açık değil; kullanıcıya bu ayrım sorulacak. Pay iki kez eklenmeyecek, önceki4970/2520/640onaylı değerleri bu açıklama ile sessizce değiştirilmeyecek. Direkler arası net açıklık ve sevk/kesilecek boy ayrı tutulmalı; duvara bağlanan uç geometrisi ayrıca doğrulanmalıdır.

Karar ve görsel kaydedildi; otomatik kiriş hesabı henüz değiştirilmedi. Uygulama5.9.40ve canlı çizim korundu. Omega boyları ertelenmiş; diğer açık işler devam eder.

## 3 Ekim 2026 — DEV-026 net kiriş / sevk boyu kesin kuralı

Kullanıcı açıkça doğruladı: çizimde5550/2560/1880mm net kiriş boyları korunacak; yükleme listesinde her parça boyuna100mm eklenecek. Liste açıklaması “+100 mm kesim payı”. Sonuçlar5550→5650,2560→2660,1880→1980mm. Bu parça başına bir kez eklenen boy payıdır, her uç için ayrı100mm değildir ve yedek adet değildir. Adet/Yedek/Toplam sevk adedi bu boy payından etkilenmez. Listede net boy, kesim payı ve sevk boyu ayrılmalı. Aynı pay ikinci kez eklenmeyecek; çizim ölçüsü sevk boyuna çevrilmeyecek.

Önceki görseldeki payın dahil olup olmadığı belirsizliği kapandı. Genel veranda geometrisinden net kiriş boyu/duvar ucu bağlantısı çıkarımı hâlâ doğrulanmalı; bu tur yalnız kural ve örnekler kaydedildi, otomatik kiriş satırları henüz uygulanmadı. Uygulama5.9.40ve canlı çizim değişmedi. Omega boy ertelemesi ve diğer açık işler korunur.

## 3 Ekim 2026 — DEV-022 H düzeltme karşılaştırması

[Yeni görsel/kod karşılaştırması](analizler/2026-10-03-h-kural-karsilastirma.md): dış H dübel/kulak kuralları uyumlu; içte tüm H kulaksız/dübelsiz açıklaması mevcut iç uç mesnet→kulaklı/dübelsiz istisnasıyla farklı. İç makas verisi yok durumundaki belirsizlik de yeni mutlak kuralla değişir. Tuna'da bu istisna oluşmuyor, mevcut36Hve alt gruplar korunur. loading-h testi ve iç mesnet örneği çalıştırıldı. Kullanıcı inceleme/karşılaştırma istedi; kod5.9.40 ve çizim değiştirilmedi. DEV-022 iç H istisnasını kaldırma/mesnet uyarısı önerisi açık; üçlü/dörtlü birleşim şekilleri kaldırılmayacak. Diğer açık işler korunur.

## 3 Ekim 2026 — 5.9.41 / DEV-022 iç H kuralı uygulandı

Kullanıcı tüm iç duvar H'lerini şimdilik kulaksız/dübelsiz olarak sabitlemeyi onayladı; iç makas altında kulaklı/dübelsiz kullanım ileride ayrı kararla revize edilebilir. classifyH iç birleşimde makas konumundan ve veri eksikliğinden bağımsız ear=false,dowel=false döndürür; kural kimliği h-interior-earless-no-dowel-v2. Dış gerçek uç mesnet ve dübel hesabı değişmedi. H/üçlü/dörtlü birleşim şekilleri ve U/köşe geometrisi korunur. İç/dış birleşimi exterior olarak sınıflanan dış duvar birleşimi dış kurala tabidir.

UI açıklaması, plan H etiketleri ve Excel sınıfları aynı hesabı kullanır. Kural kimliği değiştiği için eski iç H manuel miktar kararları otomatik geçerli sayılmaz; eski karar denetimi korunur. İç kulaklı istisnası gelecekteki açık ürün kararıdır; mevcut sürümde uygulanmaz. Kullanıcı bu tur mesnet uyarısı istemedi; yeni uyarı eklenmedi.

Build, loading-h (iki yön, iç gerçek mesnet/mesnetsiz/verisiz kulaksız, dış regresyon), loading-list ve verify-loading-xlsx başarılı. Tuna H toplam36ve alt grupları değişmedi: H10/10/9; üçlü H2/1/4. Uygulama5.9.41; canlı çizim ve yerel JSON korunmuştur. DEV-022 mevcut iç sınıflandırma düzeltmesi tamam; gelecekte iç mesnet kulak revizyonu ve diğer açık işler korunur.

## 3 Ekim 2026 — DEV-022 üçlü ve dörtlü H kapsam teyidi

Kullanıcı tüm H kurallarının üçlü ve dörtlü H'leri de kapsadığını açıkça doğruladı. H/H3/X aynı sınıflandırmadan geçer: tüm iç birleşimler kulaksız/dübelsiz; dış birleşimler dübelli, gerçek makas uç mesnedinde kulaklı, diğer dış birleşimler kulaksız. Dış duvarla birleşen iç duvarın ortak birleşimi dış konum olarak değerlendirilir. Birleşimin üçlü/dörtlü şekli korunur, normal iki yönlü H'ye dönüştürülmez.

src/loading-ui.js içindeki ['H','H3','X'] ortak classifyH çağrısı kontrol edildi;5.9.41 bu kapsamı zaten uygular. Yeni uygulama değişikliği/sürüm artışı gerekmedi. Bu kayıt kalıcı kullanıcı teyididir; diğer açık işler ve canlı çizim korunmuştur.

## 3 Ekim 2026 — 5.9.42 / DEV-026 standart iç duvar omegası

Kullanıcı özel2500/3680/4940boyların çizim/sayım yapan kişinin tek parça kullanma tercihinden kaynaklandığını, stok hızını korumak için standart2500mm kullanmamızı istedi. Önceki boy seçimi ertelemesi iç duvar standart hesabı için kalktı. Aynı kalınlıktaki iç duvar aks uzunlukları toplanır; mm toplam/2500 yukarı yuvarlanır. Kalınlık duvardan alınır. Kapı/pencere boşlukları düşülmez; dış duvarlar ve veranda açık kenarları dahil edilmez. Uzun özel boylar veya oda içinde üçer sıra hipotezi kullanılmaz. Kullanıcı bu tur yedek adedi vermedi;0otomatik yedek ve açık açıklama korunur, alt çerçevenin+1yedeği kendiliğinden aktarılmaz.

UI, CSV ve Excel otomatik Duvar omegası satırı eklendi. Tuna21435mm iç duvar toplamı/2500=8,574→9adet60×2500mm. Eski Excel'in özel boy/adetleriyle doğrudan eşleşme iddiası yok; otomatik Tuna referans eşlemesi yapılmadı. Manuel toplam/JSON ve eski karar kontrolü korunur. loading-omega sınırlar/gruplar/manuel-stale; loading-list gerçek iç duvar kapsamı ve9adet; verify-loading-xlsx9/0/9kontrolleri başarılı, build tamam.

Uygulama5.9.42. Canlı çizim ve yerel JSON değişmedi. DEV-026 iç duvar omegası standart hesabı tamam; dış baş makas/saçak omega hesabı ve yedek kararları açık. Veranda kirişinin net+100mm otomatik listelemesi hâlâ tamamlanmamıştır ve öncelikli açık iştir; diğer açık işler korunur.

## 3 Ekim 2026 — DEV-026 veranda omega konumları

Kullanıcının yeni açıklamalı görseli: referanslar/tuna-84m2/2026-10-03-veranda-omega-konumlari.png. Özgün kaynak C:/Users/obayr/AppData/Local/Temp/codex-clipboard-929a3ead-1db4-4616-83a5-81df2f657e74.png; SHA-256: eff98c1751d9536f5ee86f2ed2485b71ffa1df1968b6d8dc856437473713a4fa.

Bu örnekte kırmızı hat duvar omegası: veranda ile ev arasındaki girintili duvar hattı ve iki yan veranda kirişi boyunca çizilmiş. Yeşil ön kiriş hattı baş makas omegası olarak etiketlenmiş. Yan kirişlerde saçak omegası varsayılmamalı. Önceki yalnız iç duvar→duvar omegası sınıflandırması tüm kapsam değildir: verandaya bakan dış ev duvarı ve belirtilen kirişler de duvar omegası alabilir. Geometri duvar/kiriş ayrımı ve çatı/makas konumu birlikte değerlendirilmelidir. Aynı hat iki omega türüne birden sayılmamalı; alt çerçeve veranda hariç kuralı değişmez.

Bu kaynak örnek konumları açıklar; global yönle tüm veranda biçimlerine aynı yön tayin edilmez. Baş makas omegasının Baş Makas Z Sacı ile aynı ürün olduğu ve stok boyu henüz teyit edilmedi. Mevcut5.9.42 yalnız iç duvar omega hesabını kapsar; bu dış duvar/kiriş kapsamı henüz otomatik eklenmedi, tamamlandı sayılmaz. Kullanıcının yedek kuralı verilmedi. Diğer açık işler ve canlı çizim korunur.

## 3 Ekim 2026 — DEV-026 baş makas / saçak stok standardı

[Özgün Excel kontrolü ve kurallar](analizler/2026-10-03-bas-makas-z-omega.md). Baş makas Z ayrı ürün:70×2500mm9adet. Baş makas omegası adıyla satır bulunmadı; eşit adet denemez.100×2500duvar omegası4, saçak omegası8. Baş makas ve saçak omega standart2500mm onaylı. Saçak tarafı duvar toplamı/250cm yukarı yuvarlanacak. Verandada iki kulaklı duvar omegası yeşil alçıpanı tutar; önceki kapsam açıklaması korundu. Bu dış/veranda hesapları henüz kodda uygulanmadı;5.9.42iç omega hesabı korunur. Diğer açık işler devam eder.

| Kimlik | İş | Durum |
| --- | --- | --- |
| DEV-028 | Tüm yükleme kalemleri için özel ölçü sekmesi | Kullanıcı ilerleyen zamanda istedi; planlandı, bu tur uygulanmadı. |

## 4 Ekim 2026 — DEV-029 geçici Z / baş makas omega eşlemesi (5.9.43)

Kullanıcı baş makas Z satırını baş makas omegasına bağlamayı ve ileride değiştirilebileceğini kaydetmeyi istedi. src/loading-reference.js productLinks ayrı, geçici eşleme olarak tuna-41 (Baş Makas Z Sacı, 70×2500, 9 adet) → Baş makas omegası ilişkisini taşır. Özgün referans adı/ölçü/adet değişmedi; ürünlerin aynı olduğu kabul edilmez. Karşılaştırma tablosu ve referans seçiminde geçici not görünür; açık referansı olmayan Baş makas omegası satırı tuna-41 ile karşılaştırılır. 9 adet genel proje miktarı değildir. Otomatik geometri hesabı mevcut olmadığından bu teslim otomatik Z/omega miktar üretimi değildir. DEV-026 dış/veranda omega ve net+100mm kiriş işleri açık kalır.

Kontroller: build ve loading-list geçti; referans bağlantısı ve özgün satırın korunması kontrol edildi. Canlı çizim ve Yeni proje (11).json değiştirilmedi. Karar/kod/dist birlikte gönderilir; kaynak Excel değişmedi.

| Kimlik | İş | Durum |
| --- | --- | --- |
| DEV-029 | Z / baş makas omega geçici referans bağı | Tamam: 5.9.43, productLinks ve yükleme karşılaştırması; ileride kullanıcı kararıyla revize edilir. 5.9.44te ayrı Z satırı omega adedine bağlı; test/rapor DEV-026. |

## 4 Ekim 2026 — 5.9.44 / DEV-026 dört kalem uygulandı

[Uygulama, sayısal sonuçlar ve sınırlar](analizler/2026-10-04-omega-veranda-uygulama.md). Verandaya komşu duvarlar ve yan kirişler duvar omegasına dahil; baş makas/saçak2500mm toplamdan yukarı yuvarlanır. Z ayrı satırda geçici1:1 omega bağıdır; tuna-41 iki kez toplanmaz. Veranda kirişinin net+100mm sevk boyu listede/CSV/XLSX'te ayrı alanlarda. Çizim korunur, yedek0.

Tuna: iç omega9,100lük duvar omega5,baş omega8,Z8,saçak7. Kiriş net4970/2527,5/645→sevk5070/2627,5/745mm. Eski Excel/yan kiriş görsel farkları raporda; tam üretim eşitliği iddia edilmez. Belirsiz yerel çatı yönü/eğik veranda otomatik adet verilmeden kontrol bekler.

Build, loading-top/omega/list/h/frames/posts ve verify-loading-xlsx geçti; görsel kontrol yapıldı. Kaynak/dist/karar/testler birlikte gönderilir. Yeni proje (11).json ve canlı çizim korunmuştur; geçici artifacts Git'e alınmaz. DEV-026 onaylı dört uygulama kalemi tamam; DEV-011 imalat farkları ve DEV-028 özel ölçü sekmesi açık.

## 4 Ekim 2026 — Saçak sacı aday bağlantısı / DEV-030

[Kaynaklı çıkarım](analizler/2026-10-04-sacak-saci-aday-esleme.md): Tuna saçak omegası ve saçak sacı8eradet. Aday bağlantı yan saçak hattı; stok boyları2500/2800farklı olduğundan otomatik1:1adet kuralı kabul edilmedi. Veranda duvar omegası istisnası nedeniyle yalnız ürün adına bağlamak yeterli değil. Kullanıcı teyidi bekleniyor; kod/çizim değişmedi,5.9.44korundu.

| Kimlik | İş | Durum |
| --- | --- | --- |
| DEV-030 | Saçak sacı hat/kapsam ve adet kuralı | 5.9.45: 300mm bindirme,2500mm etkin boy ve omega ile ayrı eşit adet satırı tamam. Rapor: analizler/2026-10-04-sacak-bindirme-kurali.md. Veranda ek hat kapsamı açık. |

## 4 Ekim 2026 — 5.9.45 / DEV-030 saçak sacı bindirme

[Onay, ürün görselleri/hash ve kontroller](analizler/2026-10-04-sacak-bindirme-kurali.md). Kullanıcı2800mm sacın300mm bindirme ile2500mm etkin olduğunu doğruladı. Ayrı sac satırı saçak omegasıyla aynı adet; Tuna taslak7/7, Excel8/8farkı açık. Görsel ürün kalınlıkları sac0,50mm/omega0,80mm ve seçenekleri kaydedildi; kartlar şimdilik programa eklenmedi. Veranda ek hat kapsamı henüz teyit edilmedi. Build/loading-top/loading-list/verify-loading-xlsx geçti. Kaynak görseller kopyalandı; canlı çizim ve Yeni proje (11).json korundu.

## 4 Ekim 2026 — 5.9.46 / DEV-031 Alın V

[Görsel, kural ve test raporu](analizler/2026-10-04-alin-v-kurali.md). Gerçek çatı modelinin açık eğimli alın kenarları toplamı/2800mm yukarı yuvarlanır;220×2800mm ayrı satır, bindirme/yedek0. Çatı yoksa otomatik adet verilmez ve ekranda açıklanır. loading-verge eğimli3Bboy,iki alın,çatı yok,eğim değişince manuel karar invalidasyonu ve XLSX testleri geçti; loading-list/top regresyonları geçti. Kaynak görsel hash ile referanslara kopyalandı. Uygulama/kayıt/görsel birlikte aktarılır. Tuna çatı modeliyle9adet referans karşılaştırması açık; canlı çizim korunur.

| Kimlik | İş | Durum |
| --- | --- | --- |
| DEV-031 | Alın V eğimli boy hesabı | 5.9.47: 300mm bindirme ile /2500 etkin boy düzeltmesi tamam; tests/loading-verge.cjs. Tuna9adet karşılaştırması için çatı modeli gerekli. |

## 4 Ekim 2026 — 5.9.47 / DEV-031 bindirme düzeltmesi

Kullanıcı39cm yazımını30cm olarak düzeltti. Alın V stok2800mm,bindirme300mm,etkin2500mm. Toplam gerçek eğimli alın uzunluğu/2500yukarı yuvarlanır; yedek0. Önceki5.9.46nın/2800kuralı geçersizdir. Ürün ölçüsü220×2800mm değişmez. Kural kimliği verge2500-overlap300-v2; önceki kuralla kaydedilmiş manuel karar yeniden kontrol ister. Çatı eğimi ve açıklığı değişince adet yeniden hesaplanır; makas omega adedinden türetilmez, gerçek çatı geometrisi esas alınır.

Build,loading-verge(sınır yuvarlama,30%eğimde800cm açıklık7adet,40%eğimde1000cm açıklık9adet,manuel/stale),loading-list ve XLSXstok/bindirme/etkin boy açıklaması kontrolleri geçti. Canlı çizim ve yerel kullanıcı JSONu korunmuştur. DEV-031 kural düzeltmesi tamam; Tuna çatı karşılaştırması ve diğer açık işler sürer.

## 4 Ekim 2026 — 5.9.48 / DEV-032 Aşık kapama U

Kullanıcı Alın V ile bire bir aynı adet onayladı. Aşık kapama U ayrı2500mm stok satırı olarak Alın V toplam sevk adedine bağlandı; tuna-37referansı, ek bindirme/yedek0. Alın V geometrisi/eğimi veya manuel toplamı değişirse U güncellenir; eski karar nedeniyle Alın V adedi belirsizse U da otomatik adet vermez. U bağımsız gerekçeli manuel düzenlenebilir. Çatı/Alın V yokken U üretilmez.

Kontroller: build,loading-top(9/9,manuel12/12,stale),loading-verge,loading-list; ayrı XLSX satırlarında7/7,2500mm,tuna-37,0yedek doğrulandı. Canlı çizim ve yerel kullanıcı JSONu değişmedi. DEV-032 tamam; Tuna çatı modeliyle9adet karşılaştırması ve önceki açık işler korunur.

| Kimlik | İş | Durum |
| --- | --- | --- |
| DEV-032 | Aşık kapama U / Alın V adet bağı | Tamam:5.9.48,tests/loading-top.cjs ve loading-verge.cjs; ayrı2500mm satır. |

## 4 Ekim 2026 — DEV-033 trapez aşık referansı

[Kaynak görsel/hash ve çıkarım](analizler/2026-10-04-trapez-asik-yerlesimi.md). Trapez sac için eğim boyunca80cm aşık aralığı gözlendi;46,21/34,25cm uç değerleri sabit kural yapılmadı. Başlangıç yönü/ilk-son aşık ve kalan mesafe düzeni kullanıcı teyidi bekler.4200/3000stok dağılımı açık. Görsel ortak referanslara kopyalandı; kod/çizim değişmedi,5.9.48korundu.

| Kimlik | İş | Durum |
| --- | --- | --- |
| DEV-033 | Omega aşık yerleşimi ve sevk | 5.9.50: dikdörtgen beşik sıra+4200/3000kesimsiz kombinasyon ve ayrı sevk satırları tamam. Genel serbest sınır/diğer çatı sıra yerleşimi ve ek noktaları açık; kontrol satırları gösterilir. analizler/2026-10-04-asik-stok-kombinasyonu.md |

## 4 Ekim 2026 — DEV-033 sabit aşık uçları

[Yeni açıklamalı görsel ve kural](analizler/2026-10-04-asik-sabit-uclar.md): saçakta ilk kulak0,sonraki342mm; mahya merkezinden ilk kulak92mm sabit. Ara aralık OSB400mm,trapez800mm,eğim boyunca. Önceki örnek46,21/34,25cm genel sabit değildir. Kalan aralığın hangi uçta veya nasıl dağıtılacağı açıklanmadı; stok/ek kuralı da açık. Görsel/hash ortak referanslara kaydedildi; kod/çizim değişmedi.

## 4 Ekim 2026 — 5.9.49 / DEV-033 120mm mahya ve kalan aralık

[Güncel kural, görseller/hash ve kapsam](analizler/2026-10-04-asik-120mm-mahya.md).92mm yerine120mm; saçak0/342mm,OSB400/trapez800adımlar,kalan mahyada. RoofCore.purlinStations ve dikdörtgen beşik yerel kesit sıra taslağı uygulandı. Serbest sınır/birleşik çatı sıra gösterimi ve stok3000/4200sevk hesabı açık; sıra sayısı ürün sevk adedi değildir. purlin-stations,purlin-section,görsel kontrol,loading-verge/list geçti. Canlı çizim ve kullanıcıJSONu korundu.

## 4 Ekim 2026 — DEV-033 planda aşık sıra boyu

[Kaynak görsel/hash ve açıklama](analizler/2026-10-04-asik-plan-boyu.md). Aşıklar makasları dik keser; örnekte sıra boyu bina/ilgili çatı boyu+iki uçta30+30cm. Saçak modelde dahilse tekrar eklenmez. Stok notu sağdan kesilmiş4000ve...; eski4200/3000referansı ile fiziksel/etkin boy ayrımı ve ek bindirme belirsiz. Stok sevk hesabı için bu iki bilgi bekleniyor. Kod/çizim değişmedi.

## 4 Ekim 2026 — 5.9.50 / DEV-033 aşık stok kombinasyonu

[Kurallar, kapsam ve kontroller](analizler/2026-10-04-asik-stok-kombinasyonu.md).4200/3000mm tüm uygun kombinasyonlar: önce en az fazla(bindirme),eşitse en az parça. Kesim/sabit bindirme/yedek yok. Her sıra gerçek saçak dahil çatı boyundan; aynı saçak tekrar eklenmez.3000/4200 ayrı sevk satırları,ekranda/CSV/XLSXte sıra-kombinasyon-bindirme ayrıntısı. Desteklenen dikdörtgen beşik çatı; serbest sınır/diğer çatı veya kısa sıra açık kontrol satırı verir. DEV-033 genel sıra geometrisi ve ek noktaları hâlâ açık.

Build,purlin-stock bağımsız optimum taraması,loading-purlin arayüz/XLSX,stations,loading-list/verge ve verify-loading-xlsx başarılı. Canlı çizim ve Yeni proje (11).json korunur; kaynak/kayıt/test/dist aktarılır,artifacts geçici kalır.

## 4 Ekim 2026 — Tüm çatı tipleri ve montaj paftası hedefi

[Kod incelemesi,ortak veri düzeni ve kabul planı](analizler/2026-10-04-tum-catilar-montaj-plani.md). Kullanıcı tüm çatı tiplerinde aşık hesabı; ileride sağlayacağı örneklerden4200/3000iki renkli parça/bindirme montaj çizimi,makaslar ve diğer malzemeleri istedi. DEV-033genel çatı kapsamı sürüyor,DEV-034ortak montaj modeli açıldı. Yükleme ve çizim aynı parça/ek verisini kullanmalı. Mevcut stok optimumu tekil ek yerlerini henüz belirlemez; montaj çizimi tamamlandı sayılmaz. Yeni örnek montaj dosyası henüz alınmadı. Bu tur kod/çizim değişmedi,5.9.50korundu; kayıtlar gönderilir.

| Kimlik | İş | Durum |
| --- | --- | --- |
| DEV-034 | Ortak montaj verisi ve otomatik renkli montaj paftaları | Açık:4200/3000parça yerleşimi/tekil bindirme,makas ve diğer üretim malzemeleri; yükleme/PDF/DXF aynı veri. Kullanıcı örnek montaj çizimleri sağlayacak. analizler/2026-10-04-tum-catilar-montaj-plani.md |


## 4 Ekim 2026 — Vida önceliği / 5.9.51
| Kimlik | İş | Durum / kanıt |
|---|---|---|
| DEV-035 | Çizim–Excel vida karşılaştırması ve standart çatı oranı | İki çatı vidası geçici uygulandı; diğer dört vida kullanım dağılımı açık. [Rapor](analizler/2026-10-04-vida-oranlari.md), tests/screw-ratio.cjs ve tests/loading-screws.cjs. |
| DEV-033 / DEV-034 | Genel çatılar, ek yerleri ve montaj paftaları | Kullanıcı önceliğiyle6Ekim2026'ya kadar ara; tamamlandı sayılmaz. Sonraki adım örneklerle sıra/bindirme montaj modeli. |

Excel291m stok aşık→1000vida;103,32m² sevk sacı alanı→1000vida. Net eğimli alana ikinci oranın uygulanması geçici yaklaşık kabul. Tek dikdörtgen beşik trapez kapsamı; ek yedek yok, referanstaki yedek bilinmiyor. Yerel Yeni proje (11).json korunup cizimler/2026-10-04-vida-karsilastirma-ornek.json olarak kopyalandı;136,92m²/216m→1326/743vida. Bu Tuna veya son canlı çizim değildir. Tuna kayıt JSON'unda çatı yok; birebir vida doğrulaması yapılamadı. Kaynak hashleri raporda. Kaynak/kayıt/örnek JSON bu teslimde gönderilir; canlı tarayıcı değişmedi.

## DEV-035 — Çoklu vida sağlaması (4 Ekim)
[Alan/boy/parça ve OSB karşılaştırması](analizler/2026-10-04-vida-coklu-saglama.md). Mevcut örnek üç yolla1326/743/848;OSBde1326/1320/1506. Tek Excel üç bağımsız doğrulama değildir. Geçici öneri:sac10/m²;aşık max(10/m²,3,5/metre,12/parça) miktarları. Örnekte1370/1370;OSBde aşık1536. Bu tur yalnız analiz;5.9.51formülleri değiştirilmedi. Kesin asgari bağlantı kuralı açık.

## 4 Ekim 2026 — Mevcut hesabı koruma ve toplu doğrulama kararı
Kullanıcı: Şimdilik mevcut durum korunsun; bu proje tamamen bittiğinde birkaç başka proje ile tüm kalemlerin doğruluğu sağlansın. 5.9.51 hesapları değişmedi; son analizdeki maksimum yöntem önerisi uygulanmadı. DEV-035 geçici durumdadır, nihai doğrulama tamamlandı sayılmaz.

| Kimlik | İş | Durum / tamamlanma koşulu |
|---|---|---|
| DEV-036 | Proje tamamlandıktan sonra farklı projelerle tüm yükleme kalemlerini doğrulama | Bekliyor. Birkaç projenin çizim ve eşleşen Excel listeleriyle panel, bağlantı, profil, çatı, kaplama, vida ve diğer kalemler satır bazında karşılaştırılacak. Adet, yedek, boy, kesim/bindirme payı ve manuel istisnalar ayrı kontrol edilecek; farkların nedeni kaydedilip gerekiyorsa kurallar revize edilecek. Yalnız vidalarla sınırlı değildir. |

## DEV-037 — Mevcut alçıpan metrajını yükleme listesine bağlama
Kullanıcı alçıpan kurallarının zaten konuşulup uygulandığını hatırlattı; tekrar kullanım yeri sorulması hatalıydı. [Kod kontrolü](analizler/2026-10-04-alcipan-mevcut-hesap.md): engine.js hesabı ve Metraj Listesi mevcut; yeni yükleme modülüne aktarım açık. Kural yeniden tanımlanmayacak. Durum: açık; tek hesap kaynağı, fire/yedek ayrımı ve mükerrer sayım kontrolüyle aktarım tamamlanmalı. Bu tur kod değişmedi.

## 4 Ekim 2026 — 5.9.52 / DEV-037 tamamlandı
Kullanıcı kriteri: duvar alçıpanı seçiliyse mevcut sistemin duvar miktarı eklenir, seçili değilse yalnız tavan; beyaz/yeşil ayrı. LoadingList mevcut alcipanHesap ve levhaAdet sonuçlarını alır; ayrı formül yok. Beyaz duvar/tavan,yeşil duvar/tavan,veranda ayrı satırlar; fire dahil,ek yedek0. Kaplama filtresi,CSV/XLSX ve Tuna52/53referansı eklendi. tests/loading-gypsum.cjs yok/hepsi/secili modları ve metraj eşitliği,loading-list regresyonu başarılı. Kaynaklar ve dist yeniden üretildi. DEV-036çoklu proje doğrulaması açık; yeni alçıpan kuralları sorulmadı.

## DEV-037 yeniden açık — Kullanıcı eksik alçıpan kuralı bildirdi
Son entegrasyonda daha önce konuşulmuş bir alçıpan ayrıntısının atlandığı bildirildi. Kod ve kayıt taraması net iç ölçü,açıklık düşümü,duvar seçimi,renk,veranda ve fireyi buldu; kullanıcının kastettiği ek kural henüz kesin belirlenemedi. Tamamlandı durumu bu düzeltme açısından geri açıldı. Tahmine göre yeni hesap uygulanmadı; kısa açıklama bekleniyor.

## 4 Ekim 2026 — 5.9.53 / DEV-037 standart ıslak hacim düzeltmesi
Kesin kullanıcı kuralı: Banyo, ebeveyn banyosu ve WC duvarları genel duvar alçıpanı seçiminden bağımsız, her koşulda yeşil alçıpan. Önceki yalnız tavan ifadesi ve tüm duvarları opsiyonel sayan kayıtlar bu kuralla düzeltilmiştir. Diğer kuru mekân duvarları yok/hepsi/seçili tercihine bağlı; tüm tavanlar ve veranda yeşil tavanı mevcut kuralla korunur.
odaDuvarAlci tek kaynağı düzeltildi; çizimde yeşil gösterim genel seçim kapalıyken de çalışır. Islak oda ayarında kapatılabilir kutu yerine standart bilgisi gösterilir. Metraj ve yükleme/Excel aynı hesabı kullanır. loading-gypsum üç modda ıslak duvarların kalmasını, kapalı modda beyaz duvarın olmamasını, renk/metraj eşitliğini ve XLSX üretimini; loading-list genel regresyonu doğruladı. DEV-037 bu düzeltmeyle tamamlandı, DEV-036 farklı projelerle genel sağlaması açık. Canlı çizim ve kullanıcı JSON'u değişmedi.

## 4 Ekim 2026 — Alçıpan vidasının gerçek kullanım kapsamı
Kullanıcı açıklaması: standart tavanlar geçme sistemdir, ileride tanımlanacak tavan mini H profiline geçer; standart tavanlarda vida kullanılmaz. Duvar alçıpanı seçilmemiş bu projede3,5×35vidalar banyo/WC yeşil duvar kaplamasına aittir. Beyaz/yeşil tavan ve standart veranda tavanı alçıpan vidası hesabına katılmaz. Bu, tavan levhası hesabını kaldırmaz.
Excel92.satır500vida /13yeşil levha(39m²) oranı duvar vidası katsayısı olarak kullanılamaz:13levha tavan ve veranda paylarını da içerir. Önceki rapordaki12,82vida/m² ve38,46vida/levha yalnız sayısal bölümdü; yeni açıklamayla geçerli kullanım katsayısı olmadığı kesinleşti. Referansın yalnız yeşil duvar net alanı doğrulanıp500ile karşılaştırılmalı; henüz adet/m² veya bağlantı başına vida kuralı onaylanmadı. Diğer oda duvarları seçildiğinde kullanılacak vida türü/adedi ayrıca netleşecek.
Mevcut5.9.53yükleme modülünde otomatik alçıpan vidası yok; yalnız aşık/trapez vidaları otomatik. Dolayısıyla tavanlardan türetilmiş hatalı otomatik vida miktarı mevcut değildir. Bu tur kod değişmedi.

| Kimlik | İş | Durum |
|---|---|---|
| DEV-038 | Alçıpan duvar vidası ve geçme tavan mini H | Kapsam netleşti: standart tavan vidasız; duvar kaplama kapalıysa vida yalnız ıslak hacim yeşil duvarlara. Vida tüketim katsayısı ve mini H ölçü/adet kuralı açık. Tavan levhaları hesapta kalır. DEV-035/036 ile ilişkili. |

## 4 Ekim 2026 — 5.9.54 / DEV-038 yeşil duvar vidası
Kullanıcı hesabı düzeltmeyi onayladı. Tuna kontrol JSON'unda alcipanHesap: yeşil duvar brüt21,2625m² − açıklık1,92m² = net19,3425m². Excel92satır500adet /19,3425m² katsayısı; yeni miktar ceil(net yeşil duvar alanı ×500/19,3425). Katsayı yuvarlanmaz. Standart tavan/veranda,levha firesi ve ek yedek dahil değil. Referans sevk yedeği ayrımı bilinmiyor. Kontrol taslağına dayalı geçici orandır, kaynak hashleri önceki vida raporunda; gerçek bağlantı başına tüketim değildir.
Yükleme listesi ve XLSX'e3.5×35mm ayrı satır eklendi. Beyaz duvar seçilirse henüz doğrulanmamış vida türü/oranı için ayrı kural bekliyor satırı görünür; yeşil oran otomatik uygulanmaz. tests/loading-gypsum500kalibrasyon ve fire/çatı bağımsızlığı,üç duvar modu,loading-list ve screw-ratio geçti. Mini H sayım kuralı ve farklı projelerle DEV-036doğrulaması açık. Canlı çizim ve kullanıcı dosyası değişmedi.

## 4 Ekim 2026 — 5.9.55 / DEV-039 çatı sınır çizimi
Kullanıcı görsel köşe snap,tek taraflı dış saçak önizlemesi ve dört köşede oluşturma sorunu istedi. Yakın köşe adayları artık son kenarla ortogonal uyuma göre seçilir; son köşe başlangıç hizasına toleransla oturur. Farede köşe/hiza karesi ve açıklaması gösterilir. İlk kenarda çift yön saçak kaldırıldı; mevcut plan düğüm merkezinden uzak taraf tek çizgi olarak gösterilir (ilk kenardaki yön geometrik tahmindir); kapalı geçerli sınırda gerçek dış offset kullanılır. Dört noktada açık oluşturma mesajı; Enter/ilk köşe/Sınırı kapat korunur,çokgen için otomatik dörtte kapatma yok.
Ana çatı önizlemesinde tam calculate yerine yalnız sınır offseti hesaplanır. Yavru çatı bağlantı hesabı korunur. tests/roof-snap.cjs iki dolaşım yönü,köşeye yakın tıklama,dört nokta/Enter; tests/roof-workflow.cjs çokgen,birleşim,yön,undo,kayıt; loading-list regresyonu geçti. artifacts/roof-snap.png incelendi. Canlı çizim değiştirilmedi; bütün özel geometrilerde hatasızlık iddiası yok. DEV-033/034 montaj/metraj detaylarının ertelenmesi sürer; bu kullanıcı isteğiyle çizim arayüzü düzeltmesidir.

Kanıt: analizler/2026-10-04-cati-snap.md; DEV-039 tamamlandı.

## 4 Ekim 2026 — 5.9.56 / DEV-040 yavru çatı yakalama
Kullanıcı yavru çatı U çiziminde sorunun sürdüğünü bildirdi. Kaynak src/roof-workflow.js: genel snap, ortogonal kilit ve her adımda ana kenar projeksiyonu birbirine karışıyordu. Ayrı dört aşamalı childSnap: ilk noktada ana kenar ve teğet duvar hizası; ilk dış köşede gerçek duvar köşesini koruyup başlangıcı aynı ana kenarda hizalama; ikinci dış köşede ön kenar hizası; sonda başlangıçla aynı ana kenara tam dönüş. Ana kenar normali korunur; yanlış son tıklama reddedilir,hedef/kırmızı uyarı gösterilir. Yavru çizimde ilk köşeye yakın tıklama genel çokgen kapanmasını tetiklemez. Geçerli tıklama eski uyarıyı temizler.
Testler: tests/roof-child-snap.cjs gerçek duvar yüzü köşelerinde sapmalı tıklamalar,başlangıç kaydırma,yanlış dördüncü tıklama reddi,Enter; roof-child-u dört dönüş ve ters dolaşım,alın/yan birleşim,kot hatası,undo/kayıt; roof-snap,roof-workflow,loading-list başarılı. Görsel artifacts/roof-child-snap.png incelendi. Kullanıcının canlı plan JSON'u alınmadığı için ekrandaki özel plan birebir doğrulandı iddiası yok; aynı hata mekanizması kontrollü örnekte test edildi. Eğik/özel sınır desteği genişletilmedi; bütün olası çatılar için koşulsuz sorunsuzluk garantisi verilmez. Canlı çizim değişmedi. DEV-040 bu kapsamda tamamlandı.

## 4 Ekim 2026 — 5.9.57 / DEV-041 tek dış köşe
Kullanıcı aynı fiziksel köşede dört yakın yakalama noktasının yanıltıcı olduğunu bildirdi. Eski ±yarım kalınlık dört kombinasyonu kaldırıldı. RoofWorkflow.exteriorCorners ortak kaynağı: oda iç/dış tarafı ve dış duvar yüz normallerinden kesişim,her düğümde tek dış köşe; iç duvarlar elenir,kollinear ara noktalar köşe sayılmaz. Duvar köşesi açık veranda kenarına önceliklidir; serbest veranda100mm direğinde dış köşe±5cm. Oda topolojisi bulunmayan açık/eksik çizimde taraf için plan düğüm merkezi yedeği kullanılır; karmaşık eksik topolojide dış taraf ayrıca kontrol edilmelidir.
Ana ve yavru çatı aynı aday kaynağını kullanır; veranda sınır köşeleri aynı listede. Başlamadan yeşil aday işaretleri gösterilir. Ana çatı kenarına yavru bağlantı yakalaması köşe adayıyla karıştırılmaz,bağlantı etiketi korunur. Mevcut çatı/duvar koordinatları taşınmadı; kat planının genel duvar çizim snap davranışı değiştirilmedi.
Testler: roof-snap dört yönden aynı köşeye yaklaşımda tek koordinat,iki dolaşım yönü,TunaJSONnodebaşına tekaday,verandadireği±5cm; roof-child-snap,roof-child-u,roof-workflow,loading-list başarılı. DEV-041 tamamlandı. Görseldeki canlı proje yerine ortak Tuna kontrol JSON'u ve sentetik örnekler kullanıldı.

## 4 Ekim 2026 — 5.9.58 / DEV-042 baş makas betopan sınırı
Kullanıcı çizilen çatının baş makası nerede ise betopan kapamanın orada olmasını,alttaki evin girinti/çıkıntısını izlememesini istedi. src/roof.js planStructure içindeki duvardan çatıya yükselen kapama kaldırıldı. Beşik çatı alınları çatı mesnet sınırının yerel X sabit uçlarından üretilir; üst sınır gerçek çatı yüzeyi,alt sınır bölümün wallTop kotudur. Duvar olmayan/veranda boşluğu üzerindeki alın da kapanır. Aynı gruptaki diğer çatının örttüğü sınırda kör kapama üretilmez; childJoin kot farkı kapaması korunur. Veranda eski üçgeni 3Bde ikinci kez eklenmez; direkler korunur. Kat planı duvar şekli değiştirilmedi.
Kontroller: roof-gable-boundary alttaki tüm duvarları kaldırınca kapama geometrisi değişmiyor; roof-child-u birleşimler/dört yön/kot farkı; roof-plan-body,roof-workflow,loading-list geçti. Yeni ekran görüntüsü incelendi. Eski child-u testi artık duvar segmenti yerine çatı sınırı kapamasını doğrular. Bu teslim3Bgeometri düzeltmesidir; betopan levha sevk/kesim metrajı eklenmedi. Kırma/tek eğimde ayrı baş makas kapama kuralı bu değişiklikte varsayılmadı. Kaynak ekran görüntüleri konuşmada,canlı plan değiştirilmedi. DEV-042 bu kapsamda tamamlandı.

## 5 Ekim 2026 — İş PC — son kayıtları bulma

İş klonunun 5.9.36 kaydı eskiydi; izinli fetch ile GitHub'daki 49 yeni commit bulundu ve pull --ff-only ile e0b1800 / 5.9.58 alındı. Son ev görüşmelerinin kararları DEVAM/CALISMA ve ev-is-devir raporundan okundu; evin ayrı sohbeti bu PC'nin erişilebilir sohbet listesinde bulunmadı. İş Downloads içindeki en yeni JSON Yeni proje (6).json (3 Ekim 09:51, 5.9.36), orijinali korunup cizimler/2026-10-03-is-kayit-6-5.9.36.json olarak hash doğrulamasıyla kopyalandı. 9 son çatı görseli envanterle eşleşti. [Bulunan kayıtlar ve açık kalan yedek](analizler/2026-10-05-son-kayit-kurtarma.md).

DEV-043 açık: 4 Ekim son canlı ana/yavru çatı JSON'u ortak depoda yok. Yeni bulunan iş yedeği son canlı plan ilan edilmedi. Takipsiz eski pano görseli ve tarayıcı çizimi korundu. Kod/sürüm değişmedi; yalnız yedek/devir kayıtları gönderilir. Sıradaki adım son canlı planın Kaydet dosyasını belirlemek; diğer açık işler son ev devir raporundaki haliyle korunur.

## 12 Ekim 2026 — DEV-093 / SketchUp özel karkas eklentisi
| Kimlik | İş | Durum / kanıt |
|---|---|---|
| DEV-093 | SketchUp özel hafif çelik karkas eklentisi ve MCP | AÇIK. Profil/deneme geçme kuralları sketchup-plugin/profile-rules.json ve README.md içinde kaydedildi. Toplam boşluk 0,5 mm; her yanda dış profil sacı +0,25 mm net daralma. Kalıp derinliği değildir. 90 C dudak kesme başlangıcı50mm, geçici45°. Numune, ezme geometrisi, model okuyucu, panel üretimi ve MCP henüz yok. |
Önceki açık işler korunur. Kurulu FrameBuilder6.9.0 ayrı ürün; kayıt/lisans ve bölgesel ayar adımı kullanıcıda. İki örnek SketchUp modeli yalnız görsel incelendi, kaynak dosyaları ortak depoya aktarılmadı. Takipsiz eski pano görseli korundu. Plan Studio5.9.107 değişmedi.

## 12 Ekim 2026 — DEV-093 / özel eklenti 0.1.0 prototipi
Kaynak ve RBZ sketchup-plugin/ içinde. Boş model koruması, parametreli keskin köşeli düz C profil, geçme hedefi öznitelikleri, salt okunur üst seviye JSON raporu. 35 kesit alan/dış ölçü ve175 geçme hesabı geçti; kurulu/kaynak main.rb hash eşleşti. Canlı SketchUp/Ruby doğrulaması bekliyor; açık modeller yeniden başlatılmadı. Ezme/kesme geometrisi, panel, imalat paftası ve MCP henüz yok. DEV-093 açık; önceki işler ve Plan Studio5.9.107 korunur. Sonraki adım çizimler kaydedildikten sonra SketchUp yeniden açılıp menü ve tek profil denemesinin doğrulanması.

## 12 Ekim 2026 — DEV-093 / 0.1.1 boş model kontrolü düzeltmesi
Kullanıcı canlı denemede Sketchup::Entities empty? NoMethodError bildirdi. Desteklenen length == 0 kontrolüne geçildi. String path.empty? geçerlidir ve korundu. 35 kesit/175 geçme hesabı tekrar geçti. 0.1.1 RBZ üretildi; açık modeller kapatılmadan kurulu kaynak güncellendi. Profil oluşturma canlı yeniden denemesi bekleniyor. Önceki imalat/MCP/ezme-kesme açık işleri korunur; Plan Studio sürümü değişmedi.

## 12 Ekim 2026 — DEV-094 / rollform üreticileri ve kesit araştırması
DEV-094 araştırma tamamlandı: analizler/2026-10-12-rollform-duvar-profilleri.md. UNBAK,Arkitech,Howick,FRAMECAD,Scottsdale/Knudson,Pinnacle resmî kaynakları karşılaştırıldı. Aynı nominal C geçmesi swage/lip cut işlemleriyle destekleniyor; kesitler/dudaklar markaya özgü.90×45×12,5tam kesit ve dudak açısı doğrulanmadı;0,5mm boşluk prototip kabulü olarak kalır. PDF görsel erişimi başarısız; raporda sınırlı kapsam belirtildi. DEV-093 açık: kod/çizim bu tur değişmedi; dudak açısı kullanıcı tarafından ertelendi. Kullanıcı ekranlarında0.1.1profilin oluştuğu görüldü; geometrik ölçü/katılık ayrıca doğrulanacak. Sonraki adım profil/işlem parametreleri ayrı veriyle tek panel prototipi. Önceki açık işler korunur.

## 12 Ekim 2026 — DEV-093 / 0.2.0 panel prototipi
Araştırmaya göre kesit/yerleşim/işlemler ayrıldı. sketchup-plugin/prefabrikten_karkas/panel_core.rb ve panel.rb: ölçüye göre boş modelde alt/üst C kayıt, eşit azami aralıkla dikmeler,parça kimliği ve JSON/CSV taslak liste. İşlemler uygulanmamış/belirsiz olarak tutulur; imalat listesi değildir. Kapalı katı/dış ölçü kontrolü oluşturma sırasında çalışır. 35kesit/175geçme testi geçti; RubyStartup denemesi rapor üretmedi, Ruby panel testleri ve canlı geometri/menü doğrulaması bekliyor. Açık Teoman bey projesi korunur.0.2.0paket hazır;kurulum hashleri ayrıca kontrol edilir. MCP,açıklıklar,çaprazlar,ezme-kesme geometrisi ve paftalar açık. Önceki işler korunur;Plan Studio5.9.107değişmez.

## 12 Ekim 2026 — DEV-095 / levha kenar-orta vida destekleri
Kullanıcı OSB122/244,alçıpan120/250,BoardeX120/240cm bildirdi. Yatay/dikey karkas, levha başları ve orta vida hatlarına göre belirlenmeli. sketchup-plugin/cladding-rules.json ve analizler/2026-10-12-kaplama-karkas-destekleri.md. DEV-095 AÇIK: gereksinim kaydedildi,0.2.0kaplama yerleşimi henüz uygulanmadı; eşit dikme dağılımı değişmeli. Vida adımı,kenar mesafesi,derz boşluğu,şaşırtma ve başlangıç açık. DEV-093diğer kapsam ve önceki açık işler korunur. Plan Studio/kullanıcı çizimi değişmedi.

## 12 Ekim 2026 — DEV-095 / 0.3.0 ara kayıt ve çapraz
Kullanıcının oluşsun talimatıyla kaplama/yön/özel levha,kenar-orta destek hatları,ara yatay C kayıtlar ve seçilebilir kenar/tüm göz çaprazları eklendi. Kaynak sketchup-plugin/prefabrikten_karkas/panel_core.rb,panel.rb; açıklama sketchup-plugin/RELEASE-0.3.0.md.35kesit/175geçme geçti; yeni yerleşimin Ruby ve canlı SketchUp doğrulaması bekliyor. DEV-095 uygulandı/prototip canlı doğrulama açık. Çapraz uç geometrisi,ezme/kesme,çift yüz kaplama,derz/şaşırtma,kapı/pencere ve MCP DEV-093kapsamında açık.0.2.0kullanıcı ekranında oluştu. Açık çizimler ve Plan Studio5.9.107korunur.0.3.0kurulumu ve GitHub aktarımı ayrıca doğrulanır.
0.3.0kuruldu;dört kaynak hash eşleşti;önceki kurulum kurulum-paketleri/yedek-0.2.0altında yerelde korundu. Yeni Ruby yerleşim testleri çalıştırılamadı; canlı deneme bekleniyor.

## 12 Ekim 2026 — DEV-096 / 1500 × 2500 makina örneği karşılaştırması
DEV-096 AÇIK: Kullanıcının sol prototip / sağ makina örneği karşılaştırması referanslar/2026-10-12-1500x2500-karkas-karsilastirma.png altında hash ile korundu. Bulgular ve kaynak hash: analizler/2026-10-12-1500x2500-karkas-karsilastirma.md. Son kesilmiş levhanın orta desteği dikme yığılmasına katkı yapıyor; çapraz yönü sıra indeksine bağlı değil; üst ilave kayıt yok. Kesin akslar, üst kayıt kotu, kaplama/yön soruldu; görüntüden ölçü uydurulmadı. 0.3.0 değişmedi; imalat doğrulaması bekliyor. DEV-093/095 ve önceki açık işler korunur. Sonraki adım ölçülü kabul örneğiyle yerleşim ve uç birleşimlerini düzeltmek.

## 12 Ekim 2026 — DEV-097 / SketchUp salt okunur MCP köprüsü
DEV-097 AÇIK: Kullanıcı MCP ile açık modelin tüm detaylarını inceleme istedi; hazır SketchUp plugin araması sonuçsuz, mevcut config yalnız AutoCAD/node_repl içeriyordu. sketchup-plugin/mcp altında bağımsız Ruby okuyucu ve Node stdio sunucu oluşturuldu. Plugins içine kuruldu, Codex ayarına sketchup-inspect eklendi; eski ayar yerelde yedeklendi. Detay/kurulum hash/kaynaklar: sketchup-plugin/mcp/README.md. İletişim ve koruma testleri, stdio initialize/tools/list geçti. Sandbox rename EPERM nedeniyle test izinli ortamda tekrarlandı ve geçti. Canlı sessions boş; açık SketchUp henüz Ruby köprüsünü yüklemedi. Çizimler kapatılmadı/değiştirilmedi. Kullanıcı kaydettikten sonra SketchUp/Codex yeniden açılışı ve gerçek model doğrulaması gerekli. DEV-096 ölçülerini tahmin etmek yerine köprüyle geometriden inceleme sıradaki adım; detaylı model açılabilir. 0.3.0 karkas ve Plan Studio sürümleri değişmedi. DEV-093/095/096 ve önceki açık işler korunur.

## 12 Ekim 2026 — DEV-097 / ilk canlı bağlantı ve Windows istek yolu düzeltmesi
Yeniden açılışta MCP sessions canlı çalıştı: çelik karkas deneme.skp, PID27072, GUID f4678398-ddcd-453b-84fb-3b9f5e160fcd, kökte41nesne, modified=false. Geometri read_entities iki kez15sn zaman aşımına uğradı; detay/aks incelemesi yapılmış değildir. Ruby okuyucu ENV kaynaklı ters eğik çizgili Windows yolunu Dir.glob içinde kullanıyordu. Dir.children+dosya adı filtresine geçildi; kurulu dosya yedeklenip güncellendi. Yeni SHA256 6A0838797F540CD22835D8E30B977C06AD080F459C2E12059B5E942BF55ACE9B. Node iletişim testleri tekrar geçti; Ruby canlı düzeltme doğrulaması SketchUp yeniden yüklemesi bekliyor. Codex MCP aracı göründüğü için Codex yeniden açılışı gerekmiyor. Çizim değiştirilmedi; kaynak SKP bu tur ortak depoya kopyalanmadı. DEV-097 canlı geometri doğrulaması ve DEV-096 karşılaştırma AÇIK; önceki işler korunur.

## 12 Ekim 2026 — DEV-099 FrameBuilder-MRD komut incelemesi
DEV-099 AÇIK: Resmi200sayfalik eski surum kilavuzu indirildi/metni cikarildi, ilgili bolumler ve28/58gorselleri incelendi. Komut/kanit/surum siniri: analizler/2026-10-12-framebuilder-komut-incelemesi.md. Duvar/doseme/kiris/cati/serbest arac akislari haritalandi; dikme referansi, ilk yatay kayit ve sonraki kayit araligi ayri.6.9.0canli komut testi,kaplamadan otomatik aks hesabiveAnalysis hesap kapsami dogrulanmadi. Kesme/ezme kullanici karariyla ertelendi;statik/kaplama destekleri korunur,Betopan levha olcusu acik. Uygulama/kod degismedi. Yalniz kamuya acik kaynak incelemesi ve bu devir notu paylasilir; onceki ozel model/olcum raporlari aktarim izni bekledigi icin yerelde korunur. Onceki acik isler korunur.

## 12 Ekim 2026 — DEV-100 / Prefabrikten Karkas 0.4.0
DEV-100 AÇIK (canlı kabul ve ileri kapsam): seçili tek dikdörtgen duvar/çatı/döşeme gruplarından ayrı karkas, levha kenar/orta destekleri, dönüşümlü çapraz, açıklık çevresi ve taslak SVG/JSON/CSV eklendi. Betopan kullanıcı onayıyla 1250×2500×10 mm. Kaynak ve sınırlar: sketchup-plugin/RELEASE-0.4.0.md. Gerçek Ruby3.2.11 ile120yerleşim ve açıklık/hata regresyonları; önceki panel testleri;35kesit/175geçme kontrolü geçti. Ruby sözdizimi derlendi. 0.4.0 RBZ SHA256:854EE69A5198DAC3F4788474CD2B7405F6B9367AA4625D3ED9C50BD5672A6F7C. Kurulum yedeklendi ve kaynak/kurulu hashleri eşleşti; açık modeller kapatılmadı/değiştirilmedi, canlı yeni menü/geometri denemesi bekliyor. Statik çözüm, otomatik makas, karmaşık sınırlar, çift yüz kaplama, vida yerleşimi ve makine dosyası açık; kesme/ezme kullanıcı kararıyla ertelendi. Statik referanslı aks sınırı sadece yerleşime uygulanır. DEV-093/095/096/099 ve önceki açık işler bu sınırlar içinde korunur. Özel model/ölçü dosyaları aktarım izni beklediğinden paylaşılmaz. Bu teslim yalnız eklenti kodu/paketi ve kamuya açık devir notudur; Plan Studio sürümü değişmedi. Sonraki adım kaydedilmiş ayrı deneme modelinde0.4.0 dönüşüm ve pafta kabulü.


## 12 Ekim 2026 — DEV-101 / MCP panel oluşturma 0.2.0
DEV-101 AÇIK (canlı kabul): kullanıcı bilgisayar kontrolü yerine MCP ile açık deneme modeline örnek oluşturma istedi. sketchup-plugin/mcp create_panel komutu eklendi; yalnız yeni duvar grubu, pid/model GUID ve kök bağlam kontrolü, sınırlı parametreler, UUID tekrar koruması ve atomik geri alma. Keyfi kod, silme veya dosya kaydı yok. Node okuma/yazma iletişim ve sürüm/parametre testleri; Ruby sahte modelde UUID çoğaltmama ve hata geri alma geçti. Ruby iki dosya Plugins köküne kuruldu; önceki köprü yedeklendi ve hashler eşleşti. Canlı oturum eski okuyucuyu tuttuğundan SketchUp yeniden açılışı, Codex MCP yeniden bağlantısı ve gerçek create_panel ardından read_entities kontrolü bekliyor. Örnek henüz MCP ile oluşturulmadı. Belgeler sketchup-plugin/mcp/README.md. Önceki açık işler ve özel çizim aktarım sınırı korunur; yalnız kod ve genel devir kaydı paylaşılır.


## 12 Ekim 2026 — DEV-101 canlı MCP oluşturma doğrulandı
MCP0.2.0 create_panel ilk canlı SketchUp denemesi başarılı: yeni1500×2500mm,C90,t1.2,alçıpan dikey,600mm azami aks,üstten140mm ilave kayıt ve sol göz çaprazı.17parça oluşturuldu;read_entities ile17alt grup,5dikme,8ara kayıt,2çapraz ve alt/üst kayıt doğrulandı. Yatay kayıt orta kotları1250/2360mm. Mevcut geometri korunarak ayrı grup eklendi;model diske otomatik kaydedilmedi. Bu not yalnız kendi oluşturduğumuz test parametrelerini içerir;özel model/ölçüm dosyaları paylaşılmaz. DEV-101ilk canlı oluşturma tamamlandı;DEV-100geniş dönüşüm/pafta kabulü ve önceki ileri kapsam açık. Codex görünür araç listesi eski kaldığından çağrı güncel MCP stdio sunucusu üzerinden yapıldı;bağlantı araç listesi yenilemesi ayrıca gerekebilir.


## 12 Ekim 2026 — DEV-101 / ikinci canlı örnek
Kullanıcı yeni boş modelde150×300cm,C80,1mm sac istedi. MCP create_panel başarılı;read_entities ile dış sınır1500×80×3000mm,26parça (5dikme,16ara kayıt,3çapraz,alt/üst kayıt) doğrulandı. Dikey alçıpan,600mm azami aks veüstten140mm ek kayıt önceki örnekten korundu. Şablon insan bileşeni korunur;çizim diske otomatik kaydedilmez. Statik/imalat onayı yok;önceki açık işler korunur. Yalnız kendi ürettiğimiz test özeti paylaşılır,model dosyası paylaşılmaz.


## 12 Ekim 2026 — DEV-102 / MCP trapez yerleşimi0.3.0
DEV-102 AÇIK canlı kabul: kullanıcı27/200trapez yerleşimi istedi. create_roof komutu sınırlı düzlem/dışbükey poligon girdisiyle ayrı grupta nominal27mm/200mm/net1000mm yüzeyler oluşturur;tek geri alma,UUID veGUID kontrolü. Sac kalınlığı/üretici kesin kesiti/bindirme/mahya-dere kapakları yok;tepe/taban temsili. Kaynak ve sınırlar sketchup-plugin/mcp/README.md. Ruby profil/kesim/parametre testleri ve önceki panel/MCP regresyonları geçti. Köprü0.3.0 yedekli kuruldu;hash eşleşti. Canlı yeni komut için SketchUp yeniden açılışı gerekli. Yerel özel çatı yerleşim girdisi hazır,doğrulandı;GitHub aktarılmadı. Önceki açık işler korunur;yalnız genel kod/devir notları paylaşılır. Sonraki adım açık çizimi kaydedip yeniden açtıktan sonra MCPcreate_roof ve geometri kontrolü.


## 12 Ekim 2026 — DEV-102 canlı renk hatası düzeltildi
İlk canlı create_roof denemesi SketchUp LightGray adını kabul etmediği için atomik geri alındı;MCPread_entities kök nesne sayısının değişmediğini doğruladı. Malzeme ataması doğrudan Sketchup::Color RGB değerlerine çevrildi;Ruby çatı testleri geçti;kurulu kaynak hash eşleşti. Düzeltilmiş kod açık Ruby oturumuna geçmedi;ayrı SketchUp başlatıldı ancak MCP oturumu henüz gelmedi. Kullanıcıdan ilgili pencereyi yeniden açması istendi. Trapez oluşturuldu diye raporlanmadı;DEV-102canlı kabul AÇIK. Özel çatı verisi yalnız yerelde;genel kod/not paylaşılır. Önceki açık işler korunur.


## 12 Ekim 2026 — DEV-102 canlı trapez yerleşimi oluşturuldu
Düzeltilmiş köprü canlı yüklendi. İlk denemede Duplicate points in array hatasıyla atomik geri alma çalıştı;yerel yerleşim poligonları1mmye yuvarlanıp dışbükey sınırla temizlendi,küçük sayısal parçalar ayıklandı. MCPcreate_roof42ayrı sac grubu ve2574yüz oluşturdu. MCPileT001–T042grupları ve örnek sacın normal doğrultusunda27mm hadve yüksekliği doğrulandı. Kaynak model korunur;otomatik dosya kaydı yapılmadı. DEV-102ilk canlı nominal yüzey yerleşimi tamamlandı;kesin örtü sınırı,ürün kesiti,sac kalınlığı,bindirme/mahya-dere kapakları ve imalat doğrulaması açık. Özel model/yerleşim verisi paylaşılmadı;yalnız genel doğrulama notu aktarılır. Kullanıcı görünüşü henüz teyit etmedi. Önceki açık işler korunur.


## 12 Ekim 2026 — DEV-103 / Sacaktan trapez ve siparis taslagi
DEV-103 ACIK canli uygulama: kullanici kaplamanin makas siniri yerine dis sacaklardan baslamasini ve boy/adet siparis listesini istedi. Malzeme karari 27/200, net1000mm, 0.50mm boyali galvaniz, RAL7016. Projeye ozel yerlesim ve siparis HTML/JSON dosyalari ust yerel ornekler klasorunde tutulur; ozel model/olcu aktarilmaz. MCP0.3.1 yalniz UUID/PID eslesen kendi uretilmis kaplamasini atomik olarak degistirebilir. Kaynak korumasi, hata geri alma, tekrar UUID ve yerel girdi dogrulamasi testleri gecti; Node iletisim regresyonu gecti. Ruby kaynaklari yedekli kuruldu ve hashler eslesti. Acik SketchUp0.3.0 tutuyor; model otomatik kapatilmadi/kaydedilmedi, yeni sinir henuz canli uygulanmadi. Sonraki adim kullanici kaydedip yeniden actiktan sonra oturum/UUID teyidi, create_roof ve sacak/parca kontrolu. Gorsel gri ve kalinliksizdir; RAL/kalinlik siparis bilgisidir. Onceki acik isler korunur.


## 12 Ekim 2026 — DEV-103 / Gorunur sac kodlari MCP0.3.2
Kullanici sac yerlesiminin cizime uygulanmasini ve siparisle karsilastirmak icin kodlarin uzerine yazilmasini istedi. MCP0.3.2 her sac grubuna T001 ve sonraki kodlari gorunur metin olarak ekler; metin seridin en buyuk disbukey parcasinin icine yerlestirilir. Kaynak korumasi/atomik degistirme/UUID tekrar ve kod uretme testleri ile Ruby/Node regresyonlari gecti. Kurulu Ruby dosyalari yedeklendi, kaynak hashleri eslesti. Canli oturum hala0.3.0; yeni yerlesim ve etiketler henuz uygulanmadi. Kullaniciya cizimleri kaydedip SketchUp yeniden acilisi gerektigi bildirildi. DEV-103 canli uygulama ACIK; sonraki adim guncel oturum ve uretilmis eski grup kimligi teyidi, yerel sacak girdisiyle degistirme,47grup ve kodlari MCPile kontrol. Ozel model/yerlesim dosyalari yerelde kalir; onceki acik isler korunur.


## 12 Ekim 2026 — DEV-103 canli sacak yerlesimi ve kodlar tamamlandi
MCP0.3.2 yeni oturumda create_roof basarili: onceki kendi uretilmis kaplama atomik degistirildi,47sac ve2790yuz olustu. Kok/altgrup okumasinda kaynak makas/cati panel/duvar gruplari korundu,eski kaplama kaldirildi ve yeni47grup dogrulandi. Her47grubun son nesnesi MCPile tek tek okundu; gorunur Text T001–T047 kodlarinin tamami yerel siparis listesiyle eslesti. Kullanici istegi olan canli yerlesim/kod uygulamasi tamamlandi. Yerel siparis HTML durum notu guncellendi; ozel geometri ve kod dogrulama JSONu ust ornekler klasorunde kalir,GitHuba aktarilmaz. Model otomatik kaydedilmedi; kullanici SketchUpta kaydetmeli. Kesin ortu siniri/mahya-dere bitislerinin gorunus kabul ve imalat onayi halen acik; onceki ileri kapsam isler korunur. Bu devir yalniz genel basari notudur.


## 12 Ekim 2026 — DEV-104 duvar/cati referansi ve fazla profil incelemesi
DEV-104 ACIK uygulama: kullanici acik referansin duvar/cati duzeninin ogrenilmesini ve eklentideki fazla profillerin incelenmesini istedi. Guncel MCP oturumundan duvar/cati panel/makas geometresi tamamen sayfalandirildi; kaynak degistirilmedi. Ozel olcum/aks/karsilastirma raporu yerel analizler/2026-10-12-duvar-cati-karkas-referansi.txt; ham MCP okuma ust ornekler/karkas-referans-inceleme-2026-10-12.json,SHA2569461DC4A0C70E2DE1DCDDF6CECA507AD9CBB74FAC97DE8FB19251949D06EB873. Bu dosyalar ozel model verisi nedeniyle GitHuba aktarilmaz. Kod incelemesi: PanelCore.supports kesilmis son levha araliginin ortasina kosulsuz destek ekliyor; kaplama ara kotlari ile ayarlanmis ust kayit ve capraz segmentleri birikiyor. FrameCore cati araci gercek makas degil panel izgara taslagi. Sonraki adim profil ekleme nedenlerini ayirma, mevcut destek/levha vida hatti denetimi, kosullu son parca destegi ve bagimsiz makas/cati panel yerlesimi. Olculen akslar evrensel veya statik yeterli sayilmadi; kaplama turu geometride bilinmiyor. Mevcut uygulama surumu/kod degismedi; analiz tamam, duzeltme ve canli kabul acik. Onceki acik isler korunur. Yalniz bu genel devir kaydi paylasilir.


## 12 Ekim 2026 — DEV-104 Karkas0.4.1 destek fazlaligi duzeltmesi
Kullanici uygulamayi guncelleme yetkisi verdi. PanelCore destekleri artik kesilmis her son levhanin ortasini zorunlu kilmaz; levha derzleri ve devam eden yarim levha izgara araligi korunur. Azami dikme araligi ayrica uygulanir.1500x3000,C80,t1,dikey alcipan,600mm,sol goz orneginde140mm ust kayit korunursa26yerine18parca;ust kayit kapaliysa15parca. Acikca istenen ust kayit silinmez. Surum0.4.1; paket sketchup-plugin/prefabrikten-karkas-0.4.1.rbz; kapsam sketchup-plugin/RELEASE-0.4.1.md. support-grid-qa tum kaplama/yon ve kisa/uzun son parca/derz/aralik kontrolleri,FrameCore120,PanelCore72yerlesim ve35kesit/175gecme testi gecti. Plugins dosyalari yedekli kuruldu ve hashleri eslesti; acik eski Ruby oturumuna gecmez,SketchUp yeniden acilisi ve canli geometri kabul gerekli. Mevcut modeller degismedi. DEV-104 destek fazlaligi duzeltmesi tamam; yakin ozel kayit/dikmeleri birlestirme,urun vida destegi dogrulamasi,profil eklenme nedeni raporu,bagimsiz capraz dugumleri ve gercek makas/cozum ACIK. Cati araci hala duz panel izgara taslagi. Ozel referans geometri/olcu raporlari yerelde kalir; kod/paket/genel devir notlari paylasilir. Onceki acik isler korunur.


## 12 Ekim 2026 — DEV-105 otomatik kapi/pencere algilama0.4.2
Kullanici otomatik algilamayi istedi. OpeningCore secili duvarin esduzlem yuzlerinin birlesiminden pencere delikleri ve tabana acik kapi bosluklarini bulur; parcalanmis yuzler kabul edilir. Egik/kemerli veya yan/uste acik sinirlar tahmin edilmeden reddedilir. Algilanan olculer donusum oncesi gosterilir ve ilk duvar icin duzenlenebilir. Kaynaklar korunur. opening-core-qa kapi/pencere,parcali/ters/otelenmis yuzler,hatali sinir reddi ve bosluktan profil gecmeme testi gecti;FrameCore120ve destek regresyonlari gecti. Surum0.4.2,paket sketchup-plugin/prefabrikten-karkas-0.4.2.rbz,ayrinti RELEASE-0.4.2.md. Yedekli kurulum ve kaynak hashleri dogrulandi. Acik Ruby oturumu yeniden baslatilmali;gercek SketchUp secili duvar donusum kabul testi ACIK. Duvar geometrisinde bosluk bulunmayan yalniz pencere/kapi bilesen kutularindan algilama yapilmaz.0.4.1 duzeltmesi ve onceki acik isler korunur;gercek makas/statik/ileri birlesim halen acik. Mevcut cizimler degismedi;bu teslim yalniz kod/paket/genel kayit.


## 13 Ekim 2026 — DEV-105 canli deneme hazirligi MCP0.3.3
Kullanici canli bosluklu duvar donusumunu denemeyi istedi. MCPopening_demo sabit3600x2800kaynak duvarda900x2100kapi ve600x1000pencere gercek bosluklari olusturup source_panel ile algilar ve ayri C80,t1karkas uretir; yalniz bos yeni/kurulu Simple sablon modelinde,GUID/UUID ve atomik geri alma korumalidir. Musteri dosyasi/duzenleme baglami/bos olmayan model reddi testleri,Ruby soz dizimi,Node yetenek/UUID/komut aktarimi veOpeningCore regresyonu gecti. MCP0.3.3 kaynaklari yedekli kuruldu. Ayri bos SketchUp penceresi acildi ancak MCP yuklenmedi; kullanici bos alani actigini bildirdi,ardindan RubyKonsolundan kurulu kopruyu yuklemesi istendi. Canli geometri denemesi HENUZ TAMAMLANMADI;DEV-105 ACIK. Mevcut Teoman bey projesine dokunulmadi; kullanici duzenleme yaptigindan acik GUID degisti. Sonraki adim yeni bos oturum baglantisi,opening_demo,MCP geometri ve aciklik kontrolu. Onceki acik isler korunur.


## 13 Ekim 2026 — DEV-105 canli cekirdek kabul tamam
Kullanici tum SketchUplari kapatip yeni bos modeli acti. MCP0.3.3opening_demo gercek3600x2800duvar,900x2100kapi ve600x1000pencere geometrisini olusturdu; source_panel2acikligi otomatik algiladi,FrameCore/build_frame C80,t1karkasi ayri grupta olusturdu.57profil+57etiket dogrulandi; tum57profilin gercek kenarlari MCPile okundu,aciklik ici ihlali0. Tum goz capraz ayari test icin secildi;57parca optimize statik tasarim degil. AyniUUIDtekrari ayni gruplari dondurdu,kopya yok. Kanit analizler/2026-10-13-bosluklu-duvar-canli-kabul.txt; kendi urettigimiz test ozeti paylasilir,musteri verisi yok. Model otomatik kaydedilmedi;kullanici yeniadla kaydetmeli. DEV-105 geometri algilama/olusturma cekirdek kabul tamam;menude elle secim/parametre akisi ve karmasik musteri duvari kabulunun ayri denenmesi acik. Onceki ileri makas/statik/birlesim isleri korunur. Kod/surum degismedi.


## 13 Ekim 2026 — DEV-106 bos kalan kayit/capraz uclari
Kullanici canli demoda bos kalan uclari isaretledi. Kod ve MCP geometri karsilastirmasi: ara kayitlar her kotta tum dikme akslariyla bolunuyor,oysa jack dikmeler baslik altinda bitiyor; ust kotta olmayan dikmeye gore kesilen kayitta45mm profil yeri bos kaliyor. Capraz gozleri de kotta mevcut dikmelerle filtrelenmiyor; alt/ust sinirda profil genisliginden turetilen uc paylari fiziksel temas yerine merkez cizgi taslagi olusturuyor. DEV-105 onceki57profil kontrolde yalniz bosluk icine tasma sinandi; uc baglantisi/destek surekliligi dogrulanmadi. Tum karkas baglantilari basarili seklinde yorumlanmamali. DEV-106 ACIK: kota gore gercek dikme araliklariyla yatay kayitlari kurma,capraz uclarini gercek tasiyici dugumlere oturtma ve her ucun temasini denetleme gerekli. Mevcut cizim/kod degismedi;onceki kapalilik iddiasi sadece aciklik algilama ve bosluk dislama kapsamina sinirli. Onceki acik isler korunur.


## 13 Ekim 2026 — DEV-106 Karkas0.4.3 baglanti ve miktar denetimi
Kullanici bos uclarin duzeltilmesini ve fazla profil arastirmasini istedi. Gercek kotta varolan dikmelerle kayit/goz bolumu,ray merkez kotu ve11.25mm taslak uc ortusmesi eklendi. Her kayit/capraz ucunda2B profil zarfi temas kontrolu;temassizsa olusturma reddi. Baslik ustunde eksik levha derzine yalniz gerekli kisa dikme eklenir;ornektex3000,2145..2755mm. Eklenme nedeni ve rol/adet metadatasi var. Yeni endpoint/201kot levha destek,FrameCore120,OpeningCore,destek regresyonu veRuby/Nodekontrolleri gecti. Arastirma analizler/2026-10-13-profil-kullanimi-baglanti.txt;resmiFRAMECAD/Howick komutlari incelendi,capraz ihtiyaci ayri muhendislik karari. Ayni tum goz seciminde57yerine59parca (eksik destek+bolunen kayit),kenar goz karsilastirmasi45parca6capraz. Bu12parca azalma farkli capraz secenegidir;statik optimum degildir. King/jack dikmeler hesap olmadan silinmedi.0.4.3RBZ veMCP0.3.4yedekli kuruldu,hashler eslesti. opening_comparison yalniz kendi onceki demodan eskiyi koruyarak4200mm yaninda yeni karsilastirma olusturur. Acik oturum eski kodu tutuyor; kullanicidan modeli yeniadla kaydedip yeniden acmasi istendi. DEV-106 kod duzeltmesi tamam,canli geometri kabul ACIK. Kaynak/paket/genel rapor paylasilir;ozel modeller/raporlar aktarilmaz. Onceki ileri makas/statik/birlesim isleri korunur.


## 13 Ekim 2026 — DEV-107 yeni imza referansi incelemesi
Kullanici yeni actigi Imza Prefabrik modelinin celik yerlesimi/profillerini incelemeyi istedi. UcDXFkok bilesenin tum kenar/yuzleri MCPile okundu;duvar,kafesli baslik,makas veust cevre duzenleri olculdu. Ozel rapor yerel analizler/2026-10-13-imza-mayasa-karkas-inceleme.txt;hamMCPust ornekler/imza-mayasa-mcp-2026-10-13.json. Kaynak/hamSHA256raporda. Kayit bazi yerlerde birkac dikme aksini gecen surekli parca;aciklik ustu zikzaklar genel duvar caprazindan ayri;incelenen izole kesit3yuzluUtemsili,dudak/kalinlik geometride yok,gercek imalat kesiti genellenmedi. Eklenti icin surekli kayit/kafes baslik veC-Utemsil ayrimi arastirma/uygulama isi olarak acik. Profil adedi ilemetrajayri degerlendirilmeli. DEV-107saltokunur inceleme tamam;uygulama degismedi. Ozelmodel/geometri/raporlar GitHuba aktarilmaz;yalniz bu genel devir notu paylasilir. DEV-106yeni surum canli karsilastirma halen acik;onceki ileri makas/statik/birlesim isleri korunur.


## 13 Ekim 2026 — DEV-108 Karkas0.5.0 surekli kayit/kafes baslik
Kullanici yeni referansa gore guncelleme istedi. Duvar varsayilani surekli yatay kayit;gozlerde bolunmus secenegi korunur. Bosluklarda kayit kesilir,dikme gecis yerleri metadatada;gecis kesimleri modellenmez. TekC/kafes baslik tipi,yukseklik/goz araligi girisi eklendi;baslik caprazlari genel duvar caprazindan ayri,ust ray varsaust kusak tekrar uretilmez. Tasarak baska acikliga giren baslik reddedilir. Profil eklenme nedeni/uc temasi/levha destek kurallari korunur. CSV/SVG/JSON parca(kesim boyu)adedi,profil metre,nominaluc yuzu vegecis yerlerini ayri gosterir;makine kesimi hesaplanmadi. Kendi testinde45parca53.461m yerine surekli33parca54.361m:parca azalmasi malzeme tasarrufu degildir. continuous-header-qa32kombinasyon,FrameCore120,OpeningCore,Connection,SupportGrid,35kesit175gecme veRubysozdizimi gecti.0.5.0RBZ SHA256:c0a767833b20152ca172268d018c3a6d4597b315ddbed6f2a84e4657b911d390. Kurulu dosyalar yedeklendi,hashlereslesti. Ayrinti sketchup-plugin/RELEASE-0.5.0.md. DEV-108kod/paket tamam;0.5.0canli SketchUp/UI kabul ACIK,acik eski Rubyoturum yeniden acilmali. Mevcut Imza/model cizimleri degismedi. Gercek makas/ust cevre yukaktarimi,C-Uurun katalogu,statik/ucisleme veuretici vida sartlari acik;referans akslari evrensel alinmadi. DEV-106canli karsilastirma da onceki acikis olarak korunur. Ozelreferansgeometri/raporlar aktarilmaz;yalniz kod/paket/genel devir.

## 14 Ekim 2026 — CRM-005 / 67 m² katalog akışı uygulaması
Kullanıcı, 67 m² Instagram ve WhatsApp taleplerinin verilen PDF ve 84 m² botunun aynı kısa konuşma düzeniyle devam etmesini istedi. Kaynak C:/Users/obayr/Downloads/Prefabrikten_Modern_Modul_Ev_67m2_Urun_Karti.pdf; SHA-256 c3c4a714fbfa2ba5d13ab1e14538f5064644323487491e6eda53a2abf6d8fbfe. Aynı hashli kopya referanslar/kommo/Prefabrikten_Modern_Modul_Ev_67m2_Urun_Karti.pdf altında; özgün dosya korundu. İLK DENEME GEÇERSİZ: 67 dalını aynı 84 botuna ekleme kullanıcı tarafından reddedildi ve geri alındı; ayrı bot 20311 hazır, otomatik reklam yönlendirmesi AÇIK. Ayrıntı ve sınırlar: [kontrol kaydı](analizler/2026-10-14-kommo-67m2.txt). 84 botunun eski başlangıç menüsü korunur; yeni AYRI 67 botu menüsüz PDF ile başlar, reklamdan otomatik tanıma çözülmedi. CRM-002 bahçe ofisi PDF'si hâlâ açık. CRM-003/004 ve önceki uygulama açık işleri korunur.

KULLANICI DÜZELTMESİ — 14 Ekim 2026, aynı çalışma:
Kullanıcı 84 m² reklamının, 67 m² Meta reklamının ve bahçe ofisi kampanyasının ayrı olduğunu açıkladı; tek botta ürün menüsü birleştirmesi istenen çözüm değil. Yukarıdaki CRM-005 "tamamlandı" durumu bu düzeltmeyle geçersizdir. Ayrı bot hazırlama ve reklam kaynağına göre eşleştirme AÇIK. 67 m² için 84 botunun kopyası 20311 adı "67 m² Reklam | Modern Modül Ev Katalog ve Proje" oluşturuldu; henüz otomatik tetikleyici yok. Kaynak doğrulanmadan genel yeni görüşme tetikleyicisi eklenmeyecek. Bu turdaki yanlış 84 botu birleştirmesi geri alındı. Kullanıcı reklamı asistanın Meta'dan bulmasını istedi; Moe-67 ID52581114367325 bulundu. Önceki genel menü onayı yeni reklam ayrımı isteğinin yerine kullanılamaz.

## 14 Ekim 2026 — Güncel Kommo sonucu: AYRI 67 botu hazır, reklam eşleştirmesi açık
Kullanıcı 84/67/bahçe reklamlarının ayrı olduğunu düzeltti. Tek botta birleştirme reddedildi ve bu tur 84 botuna eklenen 67 PDF/koşul geri alındı. 84 botunun önceki genel menüsü/tetikleyicisi korunur; reklam özel değildir.
AYRI 67 botu **20311**, adı **67 m² Reklam | Modern Modül Ev Katalog ve Proje**. Doğrudan 67 PDF -> kısa metin -> kategori -> aranma; eski 84/ürün menüsü düğümleri yeni bottan temizlendi. WhatsApp doğrudan PDF/kategori; son Instagram PDF/hafif çelik bağlantısı/aranma/iç bildirim önizlemesi geçti. Gerçek UI export dosyalarının başlangıç/bağlantı/PDF/geri alma kontrolleri başarılı.
Meta'da **Moe-67**, reklam **52581114367325**, kampanya **6870461087921**, set **6870461087721** bulundu. Set Instagram ve WhatsApp'a yönlendiriyor. [Kaynak, PDF/hash, export dosyaları, kanıtlar ve sınırlar](analizler/2026-10-14-kommo-67m2.txt).
**CRM-005 TAMAMLANMADI:** ayrı bot hazırlama tamam, reklamdan içerikten bağımsız otomatik başlangıç açık. 20311 otomatik tetikleyici YOK; canlı kullanımda otomatik dağıtım iddiası yok. CRM-004 reklam/UTM aktarımı ve 84 genel tetikleyicisini ayırma, CRM-003 gerçek teslimat, CRM-002 bahçe ofisi PDF/ayrı bot açık. Önceki proje/SketchUp açık işleri korunur.
Meta'daki 16 bekleyen düzenleme yayımlanmadı/silinmedi; reklam, bütçe ve formlar değiştirilmedi. Sıradaki iş: reklam kimliği/UTM verisini Kommo'ya aktaracak desteklenen yolu kurup iki botun çakışmadan başlatıldığını gerçek yeni görüşmede doğrulamak.




## 16 Ekim 2026 — DEV-114
Tıklanabilir iş akışı taslağı tamamlandı: [Aç](taslaklar/is-akisi/index.html). [Kapsam ve kontroller](analizler/2026-10-16-arayuz-taslak.txt). Gerçek uygulamaya entegrasyon bekliyor; 5.9.110 değişmedi.

## 16 Ekim 2026 — DEV-115
Taslak renk ayrımı tamamlandı: koyu çizim zemini, ayrı panel/araç tonları, belirgin aktif sekme ve okunaklı alanlar. Mevcut prototip testi geçti, ekran görüntüsü incelendi. Gerçek uygulama entegrasyonu bekliyor.

## 16 Ekim 2026 — DEV-116
Taslak görünürlük paneli tamamlandı: Mimari/Ölçüler/Üretim/Yardımcılar; src/view-filters.js seçenekleri eşlendi. Örnek oda, ölçü, tefriş, veranda taraması ve ızgara filtreleri çalışır. 3B/Kesit ve üretim filtreleri gerçek motor bağlantısını bekliyor. Mevcut uygulamaya entegrasyon tamamlandı denmez. Test ve görsel kontrol geçti; kullanıcı değerlendirmesi sonraki adım.

## 16 Ekim 2026 — DEV-117
Kaynak düğme envanteri ve taslakta Komut bul eklendi.160 kayıt; otomatik alan sınıflandırması ön eşleştirmedir. analizler/2026-10-16-komut-envanteri.json kapsam sınırlarını içerir. Kısayol/canvas/input/select/programatik kontrol denetimi ve gerçek uygulamaya taşıma açık. Komut arama ve taslak testi geçti.

## 17 Ekim 2026 — DEV-118 / 5.9.111
Gerçek uygulamada isteğe bağlı Yeni düzeni dene gezinme katmanı eklendi. Plan/Çatı/Üretim/Metraj/Sunum mevcut API ve kontrollere bağlanır. Klasik düzene dön düğmesi var; eski DOM kontrolleri silinmez/taşınmaz. Bu ilk entegrasyondur; tüm komutları sadeleştirip taşıma işi açık. workflow-shell ve save-as testleri geçti, görsel incelendi.

## 17 Ekim 2026 — DEV-119 / 5.9.112
Gerçek çalışma alanı düzeni tamamlandı: Plan gerçek araç şeridi, ortak geçmiş/görünürlük, Çatı/Üretim/Metraj/Çıktı. Kopya üst kontroller sadeleştirildi; klasik dönüş ankrajlarla yapılır. Ana31/31, workflow-shell, save-as, view-filters, title-block geçti. [Kapsam ve sınırlar](analizler/2026-10-17-yeni-duzen.txt). Mevcut ayrıntı diyalogları korunur; yeni düzen isteğe bağlı.

## 17 Ekim 2026 — DEV-120 / 5.9.113
Çizim alanı için üst yerleşim kompaktlaştırıldı: ortak eylemler sekmelerle aynı satır, başlık52px/proje sekmeleri32px, araç boşlukları azaltıldı.1600x1000 görsel kontrol ve workflow-shell geçti. Sadece CSS; çizim mantığı korunur.

## 17 Ekim 2026 — DEV-121 / 5.9.114
3B Boyacı tamamlandı: DYO164 dijital örnek, iç/dış/köşe; standart köşe kırık beyaz. H duvara yakın ton/kenar, başmakas dış rengini izler. Proje JSON/undo kaydı. [Kaynaklar ve sınırlar](analizler/2026-10-17-boyaci.txt). paint-3d, wall-3d, scene-3d ve ana31/31 geçti.

## 17 Ekim 2026 — DEV-122 / 5.9.115
Boyacı tasarımı yenilendi: sağda dar panel, biçimlendirilmiş yüzey sekmeleri ve arama, üç sütun kartela, seçili renkte çerçeve/onay. Çizim modeli ve boya kuralları korunur. paint-3d testi seçili durum kontrolleriyle geçti; izole ekran görüntüsü incelendi. Kullanıcı çizimine dokunulmadı.

## 17 Ekim 2026 — DEV-123 / 5.9.116
Köşe kartelasına ilk sırada beyaz eklendi; kırık beyaz varsayılan korunur. Boyacı Çatı sekmesi: RAL 3009 kırmızı, RAL 7016 antrasit, RAL 9016 beyaz, galvaniz. Dijital tonlar temsilidir. 3B üst örtü/mahya rengi değişir; başmakas dış duvar rengini izler. JSON doğrulaması roof rengini korur. paint-3d testi ve görsel kontrol geçti.

## 17 Ekim 2026 — DEV-124
27/200 trapez araştırması tamamlandı: analizler/2026-10-17-trapez-27-200.txt. Form yüksekliği/adımı ile net en/kalınlık ayrıldı. Tedarikçi kesiti belirsiz; uygulama değişikliği yapılmadı. Sürüm 5.9.116 korunur.

## 17 Ekim 2026 — DEV-125 / 5.9.117
27/200 trapez 3B form eklendi; 80/100 kapatma enleri metraj/CSV/genel listede ayrı. Kesim alanı fiyatlandırma için m² kalemi olarak eklenir; birim fiyat hesabı yapılmaz. [Kapsam ve sınırlar](analizler/2026-10-17-trapez-uygulama.txt). 20 roof kontrolü, trapez-profile ve trapez-3d geçti; görüntü incelendi. Tepe/taban genişlikleri temsili; kesin imalat kesiti için tedarikçi çizimi açık.

## 17 Ekim 2026 — DEV-126 / 5.9.118
Seçili OSB/nem bariyeri/membran 3B'de çatı örtüsünün altında gösterilir. 3B kesit düğmesi katmanları kademeli açar; tekrar basınca tam örtüye döner. Yalnız görüntü değişir; metraj/model korunur. roof-cutaway testi (seçim, sıra, dönüş, aç/kapat, proje eşitliği) geçti; görsel incelendi. OSB 12mm, ince katman 0,8mm görsel temsildir, imalat verisi değildir. Referans fotoğraftaki makas karkası bu değişiklikte eklenmedi; mevcut yapı görünümü korunur.

## 17 Ekim 2026 — DEV-127 / 5.9.119
Ortak proje anteti eklendi: seçenekler, pencere renkleri, H kapak lata 3B/adet/alan/fiyat, tavan aç/kapat, çatı kaplama iki yönlü bağlantı. Antet çıktısı genişletildi. [Kapsam ve açık sınırlar](analizler/2026-10-17-proje-anteti.txt). Tests project-specs/title-block/roof20/ana31 geçti. Açık: ayrı kotlu ters tavan anlamı kullanıcıdan bekleniyor; genel fiyat motoru ve gerçek cephe dokuları yok; özel çatı malzemeleri bölüm bazında kalır. Önceki çatı arayüzü gruplama işi devam ediyor.

## 17 Ekim 2026 — DEV-128 / 5.9.120
Kullanıcı kararı: fiyat listesi verilene kadar hiçbir ürün için fiyatlandırma eklenmeyecek. Lata birim fiyat alanı ve TL maliyet satırı kaldırıldı; adet/alan ve 3B korunur. Sol menüde eski yükseklik ve eski hızlı yükseklik grubu gizlendi; ortak antette tek yükseklik girişi kalır. project-specs testi geçti.

## 17 Ekim 2026 — DEV-129 / 5.9.121
Kullanıcı kesinleştirdi: prefabrik yüksekliği yalnız 250/280/300 cm seçmeli, hafif çelik elle girilir. Ortak panel buna göre düzenlendi. Yapı sistemi mevcut kontrolü korunarak sol menünün en üstüne taşındı. project-specs testi seçenekleri,280 seçim etkisini,çelik325 elle girişini ve menü sırasını doğruladı.


## 17 Ekim 2026 — DEV-130 / 5.9.122 — Ayarların bölüm ayrımı
Tamamlandı: ortak özellikler Duvarlar, Tavan, Dış cephe, Doğramalar olarak açılır gruplandı. Eski Üretim ve kaplama tekrarı gizlendi; çatı kaplaması ve ileri yeni çatı varsayılanları yalnız Çatı ekranına taşındı. Mevcut veri bağları ve ileri cephe/aksesuar komutları korunur. Kontrol: project-specs (gruplar, tek giriş, malzeme-antet eşleşmesi, cephe alanlarının yeniden çizimde korunması), roof 20 kontrol; dağıtım üretildi. Kullanıcının açık çizimi değiştirilmedi. Çatı ekranının tamamının komuta özel panel tasarımı ayrı açık iştir. Önceki açık işler korunur.


## 17 Ekim 2026 — DEV-131 / 5.9.123 — Alçıpan montaj seçenekleri
Tamamlandı: Alçıpan kaplama grubunda bağımsız duvar ve tavan seçimleri. Standart tavan 60×120 cm + mini H; alçıpan montajı 120×250 cm, mini H yok. Her iki durumda stok levhası120×250 ve aynı net tavan alanı. Banyo/WC duvarları her koşulda yeşil; veranda/sundurma oda alanı tavanları yeşil. Duvar hesabı ortak bina yüksekliğine bağlı. Tavan/3B çizgileri, renkleri, antet ve metraj güncellendi; yükleme listesinde mini H net metre, stok/fire eklenmedi. Eski ceilingBoard aç/kapat alanı yerine ceilingMode kullanılır, eski dosyalar standart montajla açılır; tavan yok seçeneği kaldırıldı. Testler: gypsum-modes, ceiling-panels, project-specs, loading-gypsum; izole görsel incelendi. Kullanıcı çizimi değiştirilmedi. Önceki açık işler korunur.


## 17 Ekim 2026 — DEV-132 / 5.9.124 — Serbest duvar alçıpanı
Tamamlandı: oda içindeki serbest uçlu ve bağımsız duvarların iki yüzündeki alçıpan kesikli çizgileri eklendi. Kapı/pencere açıklıklarında çizgi kesilir. Gösterim ve metraj aynı serbest duvar listesini kullanır; iki yüz yüksekliği ve boşluk düşümü korunur. Test: free-wall-gypsum (bağlı serbest uç, bağımsız duvar, iki yüz ve boşluklar), gypsum-modes, loading-gypsum geçti. Açık kullanıcı çizimi değiştirilmedi; önceki açık işler korunur.


## 20 Ekim 2026 — DEV-133 / 5.9.125 — Ölçülü açıklama çizgileri ve semboller
Tamamlandı: Çizgi / şekil aracı; düz, kesik, noktalı, noktalı kesik stiller; çizgi, daire, üçgen, kare, dikdörtgen. İki noktayla canlı ölçü veya cm ölçü girerek yerleştirme; isim, renk, açı, ölçüyü göster seçimi. Çift tık düzenle, sürükle taşı, sil/geri al, JSON ve çıktı ortak açıklama modeli üzerinden çalışır. İmalat ve oda geometrisi değişmez. Testler: plan-shapes, text-notes, run31/31 geçti; ekran görüntüsü incelendi. Mevcut kullanıcı çizimi değiştirilmedi. Üçgen ikizkenar çevre kutusuyla, daire çapıyla tanımlanır. Önceki açık işler korunur.


## 20 Ekim 2026 — DEV-134 / 5.9.126 — Çizgi kilidi ve duvar yakalama
Tamamlandı: çizimde serbest/yatay-dikey/sabit açı kilidi; duvar aksına yakalama; A/B uç etiketleri ve iki uca mesafe/toplam boy. A ucundan cm girişi ve Noktayı kullan ile kesin yerleştirme. Kilitle uyumsuz mesafe uyarılır. Ölçü duvar aksından alınır, duvar yüzü mesafesi değildir. Testler shape-snap (eksen,30 derece,50 cm offset) ve plan-shapes geçti. Çizim/imalat verisi korunur; önceki açık işler korunur.

## 20 Ekim 2026 — DEV-135 / 5.9.127 — Çizgiyle alt alan ayırma
Tamamlandı: Alan sınırı oluştur seçeneği açık çizgiler, duvarlarla kapanan alt alanları ayrı seçilebilir ve çift tıkla isimlendirilebilir yapar. Alanlar aks üzerinden m² gösterir; fiziksel oda/duvar ve imalat metrajı değiştirilmez. Eski çizgiler de sınır kabul edilir; seçenek kapatılabilir. Duvar gövdesindeki çizgi parçaları görünmez. İsimler JSON ile korunur; açık kalan sınır alan bölmez. Testler: area-regions (1,95 + 8,55 = 10,5 m², isim/JSON, kısaltma/silme/geri al, fiziksel geometri korunması), plan-shapes, ana run31/31 geçti; izole ekran görüntüsü incelendi. Açık kullanıcı çizimine müdahale edilmedi. Önceki açık işler korunur; alt alanlar ayrı fiziksel oda veya otomatik kaplama metrajı değildir.

## 20 Ekim 2026 — DEV-136 / 5.9.128 — Uç yakalama ve basit çizgi kilidi
Duvar uç noktaları yakalamada öncelikli; uç kapağının hemen dışındaki tıklamalar da yakalanır. Varsayılan yatay/dikey, Shift geçici serbest; açı ve mesafe girişleri açılır ayrıntıda korunur. Kontroller: area-regions artık gerçek iki fare tıklamasıyla (duvar ucunun dışından) tam 150 cm yatay sınır,1,95 m² alan kapanışı ve kayıt/geri al doğrular; shape-snap açı ve kesin mesafe testi geçti. Önceki hatalı çizgiler otomatik taşınmaz; yeniden çizilmelidir. Açık kullanıcı çizimi korunur, önceki açık işler sürer.

## 20 Ekim 2026 — DEV-137 / 5.9.129 — Bağlı sınır çizgisini kaydırma
İki ucu karşılıklı duvar akslarına bağlı yatay/dikey çizgi sürüklenirken yalnız dik yönde kayar; duvarların ortak boy aralığında sınırlanır, uçlar kopmaz. Canlı göstergede her iki duvarın iki ucuna mesafe ve toplam boy cm aks ölçüsü gösterilir. Önceden duvardan kopmuş çizgi otomatik bağlanmaz; eğik çizgi serbest taşıma davranışını korur. area-regions fareyle çapraz sürükleme, sabit x/boy, değişen y, canlı100cm, alan kapanışı ve geri al testi geçti. Açık çizim değiştirilmedi; önceki açık işler korunur.

## 22 Ekim 2026 — DEV-138 / 5.9.130 — Bölüm sınıflandırma ve ölçülendirme
Kesik çizgi alt alanları mevcut oda türü/özel ad penceresinden düzenlenir; sağ özellik panelinden seçilebilir. Etikette aks eki ve sınır çizgisinin kalıcı otomatik boyu kaldırıldı. Alan hesap yöntemi bu sürümde değişmedi. Yeni Ölçülendir: yatay, dikey, hizalı/çapraz, iki karşı uçtan çap; iki nokta + üçüncü tıkla ölçü konumu; çift tık tür/uzaklık düzenleme, silme, JSON ve çıktı. Ölçüler sabit referans noktalarını saklar; duvar hareketine ilişkisel bağ yok. Bölüm türleri annotation üzerinde saklanır; fiziksel oda metrajına aktarılmadı (açık DEV-138-B: alt alanların net alan ve kaplama/metraj kurallarına entegrasyonu). Kontroller area-regions, plan-shapes, plan-dimensions ve ana31/31 geçti; görsel incelendi. Açık kullanıcı çizimi değiştirilmedi. Önceki açık işler korunur.

## 23 Ekim 2026 — DEV-139 / 5.9.131 — Ölçülü duvar bölme
Duvar böl aracı: duvara tıklama, A/B ucundan cm girişi, iki parça boyu ve uç işaretleri. Mevcut splitSeg/Studio.edit işlemiyle kalınlık ve aks korunur; kapı/pencere içinden bölme engellenir. En az1cm parça; özel pnlCfg diziliminde işlem engellenir, mevcut modüler doğrulama sürer. Test wall-split: gerçek tıklama123,45cm,JSON, açıklık içi ret/geri dönüş ve undo geçti. Önceki açık işler korunur; açık çizim değiştirilmedi.

## 23 Ekim 2026 — DEV-140 / 5.9.132 — Yazı, ölçü ve bölünmüş mutfak hattı
Oda etiketi genişliği etiket konumundaki oda kesitine sığdırılır (ekran/çıktı). Elle ölçüler mevcut _dimLine font,renk,çentik ve yönünü kullanır; cm eki kaldırıldı, çap simgesi korunur. Ölçü sürükleme referansları taşımadan uzaklığı değiştirir. Mutfak aynı kalınlıkta bağlı doğrusal duvar parçalarını takip eder; oda tarafındaki dik duvarda durur, tüm parçalardaki kapı kontrolü korunur. Test kitchen100cm parça üzerinden400cm tezgah, mevcut kitchen testleri, plan-dimensions ve ana31/31 geçti. Kullanıcının gerçek JSON'u olmadan ekran görüntüsündeki proje birebir doğrulanmadı. Önceki açık işler korunur.

## 23 Ekim 2026 — DEV-141 / 5.9.133 — Zoomda metin ve ölçü okunabilirliği
Elle ölçülerde duvar yarı kalınlığı +16px minimum boşluk otomatik ölçüyle eşlendi; hit/bounds aynı geometriyi kullanır, sürükleme görünen uzaklıktan başlar. Metinler oda adı fontu/renk ve sınırlı zoom ölçeğini kullanır (12 standart, mevcut boy oranı korunur); hit ve çıktı sınırı görünen fonttan hesaplanır. Mevcut nesneler yeniden eklenmez. Test plan-dimensions%22/30/85 boşluk, text-notes%22/27/86 okunabilirlik, kayıt/düzenleme/geri al/PNG geçti. Önceki açık işler korunur; mevcut kullanıcı çizimi değiştirilmedi.

## 23 Ekim 2026 — DEV-142 / 5.9.134 — Alt oda etiketi taşıma
Kesik çizgi alt alan etiketlerine seçim kutusu ve ayrı hit alanı eklendi; sürükleme kalıcı regionOffsets kaydına gider, çift tık yeni konumunda oda adı/türü düzenler. JSON konum doğrulaması eklendi. area-regions gerçek fare taşıma/yeni konumda çift tık/isim ve tür kayıt testi geçti. Fiziksel oda/geometri ve önceki açık metraj işleri korunur.


## 23 Ekim 2026 — DEV-143 / 5.9.135 — Ortak oda etiketi çizimi
Tamamlandı: fiziksel oda ve çizgi alt alan etiketleri ortak drawRoomLabel kullanır. Zoom fontu, dar alana sığma, özel ad/tür satırı, tek ondalık m², renk, satır aralığı, hit kutusu ve seçim çerçevesi eşlendi. Mevcut ad/konumlar korunur. area-regions taşıma/düzenleme/JSON ile %22/50/86 ve çıktı tipografi eşitliği, ana31/31 geçti; görsel incelendi. Önceki açık işler ve DEV-138-B metraj entegrasyonu korunur. Kullanıcının açık çizimi değiştirilmedi.


## 25 Ekim 2026 — DEV-144 / 5.9.136 — Modern ana çizim arayüzü
Tamamlandı: açık gri/mint arayüz, dikey sol araç şeridi, açılır proje ayarları, ince üst şeritler ve sağ özellik paneli. Mevcut DOM kontrolleri taşınır; motor ve hesap modeli değiştirilmedi. Modern/klasik tercih yerelde saklanır; ilk açılış klasik, üstte Modern görünüm düğmesi. workflow-shell testi: 1280/1920 taşma ve çizim genişliği, panel aç/kapa, mevcut komutlar/çatı/görünürlük, iki sistemde tekrarlı geçiş ve model eşitliği; ana31/31 geçti. Görsel artifacts/workflow-shell.png incelendi. Açık: çatı/3D iç ekranlarının aynı tasarım diliyle yenilenmesi, açık/koyu çizim zemini seçimi ve daha ayrıntılı komut bazlı panel sadeleştirmesi. Önceki açık işler korunur; kullanıcı çizimi değiştirilmedi.


## 25 Ekim 2026 — DEV-145 / 5.9.137 — Modern arayüz geri alındı
Kullanıcı DEV-144 tasarımını reddetti ve eskiye dönüş istedi. workflow-shell JS/CSS ve testi 5.9.135 haline geri getirildi; dağıtım yeniden üretildi. Modern sol araç şeridi/açık renk düzen ve tercih okuma kaldırıldı. Önceki çizim, etiket ve hesap düzeltmeleri korundu. workflow-shell ve temel31/31 geçti. DEV-144 devam tasarım işleri kullanıcı isteğiyle iptal; diğer açık işler korunur. Çizimler ve tarayıcı kayıtları değiştirilmedi.


## 25 Ekim 2026 — DEV-146 — Bağımsız kat odaklı arayüz taslağı
Kullanıcı mevcut programa dokunmadan ayrı taslak istedi; zemin/1.kat/ara kat/3D geçişlerini özellikle istedi. taslaklar/odak-atolyesi/index.html: koyu arayüz, kat ağacı/sekmeler, şematik SVG3D ve kat ayrıştırma, duvar seçimi/mesafeli bölme önizlemesi, oda adı ve geri alma. Kaynak Tuna84 kayıtlı örneği; canlı kullanıcı çizimi değildir, hash envanteri yanında. check.cjs geçti: seçim/isim/undo, geçerli-geçersiz bölme, kat kopyalama/3D/görünürlük, yükseklik, 980/1280/1920 taşma, veri izolasyonu. Görseller incelendi. Ana HTML/src/dist/cizimler değişmedi, sürüm5.9.137korundu. Taslak ağ/depolama kullanmaz. Serbest çizim/üretim/çıktı motoru bağlı değil; 3D üretim modeli değildir. Açık: kullanıcının taslak değerlendirmesi; kabul olmadan ana programa taşınmayacak. Önceki açık işler korunur.


## 25 Ekim 2026 — DEV-147 — Revit ve Rayon araştırması
Resmi Autodesk/Rayon belgeleri ve yerel kaynaklar incelendi. [Araştırma ve uygulama sırası](analizler/2026-10-25-revit-rayon-program-yapisi.md), [kaynak SHA-256 envanteri](analizler/2026-10-25-revit-rayon-kaynak-envanteri.json). Öneri: gerçek kat/kot modeline bağlı görünüm sekmeleri, tek bağlamsal özellik paneli, ortak modelden plan/3B/metraj/antet, ayrı prefabrik ve hafif çelik üretim kuralları, ilişkisel ölçüler ve revizyon takibi. Kullanıcının ana programa dokunmama kararı korunur; 5.9.137 ve bağımsız taslak değişmedi. Canlı Revit/Rayon kullanım testi yapılmadı. Kodda çok kat şeması, ilişkisel ölçü ve DEV-138-B alt alan metrajı açık. Yalnız araştırma tamamlandı; taslakta sonraki uygulama kullanıcı değerlendirmesi bekler. Önceki açık işler ve ilgisiz yerel çizim/raporlar korunur. Kontrol: yerel kaynak hashleri, rapor bağlantıları, yalnız araştırma dosyalarının commit kapsamı.


## 25 Ekim 2026 — DEV-148 — Ara kat şasesi STL incelemesi
İlk ve güncel iki kullanıcı STL sürümü ayrı korundu; güncel kaynak/kopya SHA-256 eşitliği doğrulandı. [Rapor](analizler/2026-10-25-arakat-sasesi-inceleme.md), [envanter](analizler/2026-10-25-arakat-kaynak-envanteri.json), [ölçüler](analizler/2026-10-25-arakat-geometri.json). Kullanıcı kesinleştirdi: cm, toplam DIŞ genişlik125 cm, yükseklik20 cm, boy projeye göre değişken; alt kat duvarlarının üstüne oturur. İlk137cm/6şase örneği ilk-ornek altında korundu; kullanıcı aynı adlarla125cm/8şase dosyalarını yeniden verdi. Güncel montaj125cm adımla8aynı şase, toplamnominal1000cm; tek şasede2uzun+2başlık+13ara kayıt.8kopyanın bütün üçgenleri eşleşti. İzometrik/üst/yan/kesit görselleri incelendi. Açık: profil/sac standardı, ara kayıt aralığı, mesnet/uç/bağlantı payları, kenar ve boşluk çözümleri. Parametrik modele aktarım yapılmadı. Ana uygulama/taslak/çizimler değişmedi,5.9.137korundu. Önceki açık işler ve ilgisiz yerel raporlar korunur.


## 25 Ekim 2026 — DEV-149 — Alternatif ara kat şasesi
Kullanıcının arakat şasesi montaj-1.stl dosyası üç ayrı montaj içeriyor. Her montajda 7 standart + 1 dar kenar parçası; düz düzen, iki orta şasenin 100 cm uzatıldığı ve aynı boydaki iki şasenin 250 cm kaydırıldığı düzenler. Dar parça dış eni yaklaşık 57,21 cm, genel yarım modül standardı değildir. 19 standart şasenin önceki tek şaseyle bütün üçgenleri eşleşti; normal şasede 13, uzatılmış şasede 15 ara kayıt. Kullanıcının dış 125 cm, yükseklik 20 cm, projeye göre boy ve alt duvar üstüne oturma kuralı korunur. [Rapor](analizler/2026-10-25-arakat-alternatif-inceleme.md), [envanter](analizler/2026-10-25-arakat-alternatif-envanteri.json), [ölçüler](analizler/2026-10-25-arakat-alternatif-geometri.json). Kaynak değişmeden kopyalandı, hash eşitliği ve üçgen/parça sayıları doğrulandı; üst ve izometrik görseller incelendi. Alternatif referans kaydı tamam, parametrik uygulama aktarımı ve mesnet/bağlantı/özel kenar kuralları açık. Ana uygulama 5.9.137, bağımsız taslak ve çizimler değişmedi. Önceki açık işler ve ilgisiz yerel kayıtlar korunur.


## 25 Ekim 2026 — DEV-150 — Taslakta prefabrik ve ara kat döşeme şasesi
Kullanıcı yalnız taslağa ekleme istedi; ana program değişmeyecek. Gönderdiği kesitle ara katın iki kat arasındaki galvaniz döşeme şasesi olduğu kesinleşti. Yarım kotta oda demosu kaldırıldı; şase altı duvar üstü, üstü +20 cm. 125 cm standart dış en, plan sınırına göre boy/özel kenarlar; üst kat aynı planın örnek kopyası. Şase planı, seçim, yön, üç görünüm önayarı, 3D orbit ve ayrıştırma eklendi. Tuna kaynağı zaten prefabrik; eski çizici H/panel/köşe göstermiyordu. Mevcut motordan izole alınan 49 panel ve birleşim geometrisi taslağa bağlandı. [Rapor](analizler/2026-10-25-taslak-arakat.md), [kontrol](analizler/2026-10-25-taslak-arakat-kontrol.txt), [envanter](analizler/2026-10-25-taslak-arakat-envanteri.json). 250/280/300 kot, duvar üstü geometrik oturma, seçim/yön/undo, eski oda/bölme, kamera, dar ekranlar, yedek çizici ve ağ/depolama izolasyonu geçti. Görseller incelendi. Ana HTML/src/dist/çizim hashleri korunur; sürüm 5.9.137. Açık: tam kat modeli, taban/yalıtım/tavan katmanları, bağlantı/mesnet ve özel en/kayıt üretim kuralları. Fiyat yok; taslak ana programa aktarılmadı. Önceki açık işler ve ilgisiz yerel kayıtlar korunur.


## 25 Ekim 2026 — DEV-151 — Taslakta ara katın taban, yalıtım ve alt tavanı
Kullanıcı yalnız taslağa katman ekleme istedi. Taban (Betopan/Hekimboard), şase içindeki yalıtım (camyünü/taşyünü), galvaniz şase ve alçıpan alt tavan ayrıştırılmış 3D'de etiketlenir. Birleşik / ayrılmış / yalnız şase önayarları, ayrı görünürlük ve aralık sürgüsü eklendi. Tavan duvar yüzlerinde kesilir; yalıtım kayıt boşluklarına yerleşir. Görsel varsayımlar taban2cm/tavan1,25cm arayüzde açıklanır; ürün/üretim seçimi değildir. Üst kat tabanı kaplama dahil302cm (280cmduvarda), ayrıştırma fiziksel kotu değiştirmez. [Rapor](analizler/2026-10-25-taslak-arakat-katman.txt), [kontrol](analizler/2026-10-25-taslak-arakat-katman-kontrol.txt), [envanter](analizler/2026-10-25-taslak-arakat-katman-envanteri.json). İki yön×üçyükseklik, alan/kot/çakışma, görünürlük/undo, önceki taslak akışları ve izolasyon kontrolleri geçti; görseller incelendi. Ana uygulama5.9.137,src/dist/HTML ve müşteri çizim hashleri değişmedi. Açık: ürün/kalınlık,miniH/levha düzeni,ıslak hacim malzeme ayrımı,üretim/mesnet/bağlantı ve kalıcı çokkat modeli. Taslak ana programa aktarılmadı; fiyat eklenmedi. Önceki açık işler ve ilgisiz yerel özel kayıtlar korunur. Sonraki adım taslak değerlendirmesi ve ürün/montaj detaylarının netleşmesi.


## 25 Ekim 2026 — DEV-152 — Taslakta standart 60×120 alçıpan ve mini H
Kullanıcı yalnız taslakta standart tavan istedi. Oda iç yüzlerine kırpılan 60×120 cm nominal levhalar ve yalnız levhalar arası ortak kenarlarda üç boyutlu mini H eklendi. Şasenin 125 cm aralığı tavanı bölmez; standart geçme sistemde vida yoktur. “Tavanı alttan gör”, alttan/üstten görünüm, tam/kenar levhası seçimi ve ölçüsü, yön/geri alma ve önceki katman görünümüne dönüş çalışır. Mini H kesiti/geçme payı temsilîdir; ölçülü ürün kesiti beklenir. [Rapor](analizler/2026-10-25-taslak-standart-tavan.txt), [kontrol](analizler/2026-10-25-taslak-standart-tavan-kontrol.txt), [regresyon](analizler/2026-10-25-taslak-standart-tavan-regresyon.txt), [envanter](analizler/2026-10-25-taslak-standart-tavan-envanteri.json). Dikdörtgen/kesilmiş/dar/L alanlar, iki yön ve üç yükseklik, net tavan alanı, H birleşimleri, seçim/geri al, görünüm dönüşü, dar ekran/yedek çizici/izolasyon ve önceki taslak akışları geçti; görseller incelendi. Ana uygulama 5.9.137, src/dist/HTML ve müşteri çizimleri değişmedi. Açık: gerçek mini H kesiti, ürün/kalınlık/kesim payları, fire/artan parça, veranda çatı/tavanı, üretim/mesnet ve kalıcı çok kat modeli. Fiyat ve ana program entegrasyonu eklenmedi. Önceki açık işler ile ilgisiz yerel özel kayıtlar korunur.

## 25 Ekim 2026 — DEV-153 — Önce tek katlı prefabrik çizimi
Kullanıcı çok kat akışından önce tek kat çizimini istedi; ana programa dokunmama kararı korunur. Ayrı taslağın index.html girişi mevcut 5.9.137 motorunun bağımsız kopyasına bağlandı. Gerçek çizim/oda/açıklık/metin/ölçü, çatı/3D/tavan/metraj ve JSON/PDF/PNG/DXF akışı; ince şeritler, tek ortak özellik alanı ve gruplanmış sağ ayarlar. Depolama anahtarları taslağa özel; ana yedek/sekme/pano korunur. Önceki arakat taslağı arakat.html sayfasında korunur. Canlı tek kat tavanında 60×120/mini H alttan inceleme, özel oda adı ve ıslak/veranda yeşil ayrımı; kesit temsilî. [Rapor](analizler/2026-10-25-taslak-tek-kat.txt), [kontrol](analizler/2026-10-25-taslak-tek-kat-kontrol.txt), [kaynak envanteri](taslaklar/odak-atolyesi/single-engine-manifest.json). Gerçek fare/sayısal panelle oda kapanışı, undo, ana motorla panel/birleşim/metraj eşitliği, oda/metin/ölçü, kapı/pencere, çatı/kaplama/yükseklik, canlı tavan alanı, JSON indir/aç/yenile, PDF ve üç ekran genişliği geçti. Önceki arakat/tavan testleri de geçti; görseller incelendi. Ana uygulama 5.9.137, HTML/src/dist ve müşteri çizimleri değişmedi. Açık: gerçek kullanıcıyla tek kat taslak değerlendirmesi; L/T çatı sınırının elle düzenlenmesi, plan değişiminde çatı konturu kontrolü, mevcut DEV-138-B alt alan metrajı ve ürün/bağlantı belirsizlikleri. Çok kat çalışması sonraya bırakıldı; ana entegrasyon yapılmadı, fiyat eklenmedi. Önceki açık işler ve ilgisiz yerel özel kayıtlar korunur.

## 25 Ekim 2026 — DEV-154 — Referans görsel penceresi ve ölçülü altlık
Kullanıcı referans projeye bakarak çizmek için PNG/JPG ve panodan görsel istedi. Eski özellik codex/arayuz-duzeni dalında bulundu; yeni taslakta araç şeridinin başına Referans eklendi. Ayrı pencere veya cm koordinatlarında plan altlığı; dosya, sürükle-bırak, Ctrl+V; iki nokta/bilinen cm ile ölçek, kilit/taşı, opaklık, açı/konum, görünürlük. Geri al/ileri al ve taslak proje JSON/sekme/otomatik kayıt bütünleşti; ana kayıtlar ve dosyalar korunur. [Rapor](analizler/2026-10-25-taslak-referans.txt), [kontroller](taslaklar/odak-atolyesi/reference-check.cjs), [envanter](analizler/2026-10-25-taslak-referans-envanteri.json). Görsel dosya/pano/drop, ölçek/taşı/undo, kilitli altlıktan gerçek prefabrik duvar çizimi, normal plan panosu, JSON/sekme/yenileme, metraj/DXF eşitliği, üç ekran genişliği ve ana kaynak/depolama izolasyonu geçti. Önceki tek kat çizim/çatı/tavan/çıktı regresyonları geçti; iki görünüm görsel olarak incelendi. Ana program 5.9.137 ve önceki arakat taslağı değişmedi. Sınırlar: 4 görsel/2 MiB gömülü veri, önizleme uzun kenarı2000px; çıktı/3D/metraja eklenmez. Eski referans veritabanı okunmadı; kullanıcı görselini yeniden açar/yapıştırır. Otomatik vektör/duvar tanıma yok. DEV-153 değerlendirmesi ve önceki açık işler/ilgisiz yerel kayıtlar korunur.
