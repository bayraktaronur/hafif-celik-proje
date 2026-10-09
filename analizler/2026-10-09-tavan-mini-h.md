# DEV-085 — Tavan panoları / veranda yan kirişleri — 5.9.100

9 Ekim 2026. Standart tavan kullanıcı talebi60×125cm;125cmkenar makas açıklığına dik alınır. Oda iç yüzleri ve çatısı tanımlı veranda tamamen yatay kaplanır. Çatı planındaki Tavan sekmesinde döşeme ve miniHçizgileri görülür.3Bde tavanaltından aynı ince gri miniHbirleşimleri görünür. MiniHgerçek kesit ölçüsü verilmediği için temsilî çizgidir; miniHstok/kesim/ağırlık miktarı üretilmez.

Yeni src/ceiling-panels.js oda poligonunu kullanır. Makas dizilim yönü değişirse60/125eksenleri yer değiştirir. Bağlı beşik verandada125kenar mahya/derinlik doğrultusundadır. MiniHyalnız poligonun içinde çizilir; köşegen üçgenleme kenarları gösterilmez. Veranda tavan kotu kiriş altı; kiriş yoksa dikme üstüdür. Çatıyı gizle görünümü açık bina incelemesi için tavanı da gizler.

Sol/sağ veranda yan kirişleri ayrı işaretlenir; üst kiriş kesitini kullanır. Dikmeler veönkirişten bağımsız seçim, JSONkalıcı. Plan/3B veprofil netboy satırları birlikte üretilir. Yapısal bağlantı/mesnet hesabı yoktur.

Tavan alçıpan sipariş hesabı0.75m²/pano+fireye değişti; duvar120×250cm hesabı korunur. Bu adet alan tahminidir; artık kullanımına göre kesim optimizasyonu değildir.

Kaynak görsel: C:/Users/ONUR/AppData/Local/Temp/codex-clipboard-5d2aa514-f820-44d9-ac9e-0cc06cf36370.png
Depo: referanslar/gulsum-veranda/tavan-mini-h-talebi.png
SHA256: 1A40C15D7FA80D8D076A850D6EAF5205B0FAC2BC1193CBCE917250AABCDED27E
Gerçek test projesi önceki DEV-083 kaynaklarıdır. Görseller:2026-10-09-tavan-plan.png,2026-10-09-tavan-3b.png.

Kontroller: ceiling-panels(60/125 yön değişimi, kapsanan alan eşitliği, miniH,3kiriş,metraj,JSON),veranda-custom veproject-tabs geçti. Eski genelroof tarayıcı testi alan uyuşmazlığı önceki raporda açık kalır. Canlısekme veorijinalJSONdeğişmedi.

DEV-084 sekmeler5.9.99ileönceden7501048commitiylegönderildi;5.9.100dekorunur.Yeni/Açyenisekme,ayrıundo/redo vezoom/pan;yenilemedetümprojelergeri gelir,undogeçmişiyenilemedesıfırlanır.Yereldepolama kapasitesi aşılırsauyarıverilir;JSONKaydet kullanıcıdosyasınıkorur.Sekmesayısınayapaylimitkonmadı,cihazbelleğivesaklamaalanısınırlarıgeçerlidir.