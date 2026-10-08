# Yerel okuyucu kurulumu

Bu ek, yalnız yerel makinede görsel okuma içindir. API hesabı gerekmez. İlk kurulum/model indirmesi internet kullanır. Ollama ve model dosyaları Git deposuna dahil değildir; diğer bilgisayarda ayrıca kurulur.

1. Resmî https://ollama.com/download/windows adresinden Ollama kurulur.
2. `ollama pull qwen3-vl:8b-instruct` ile yaklaşık 6.1 GB model alınır.
3. `tools/start-local-plan-reader.ps1` ayrı bir okuyucu süreci başlatır. Yalnız 127.0.0.1:11435 dinlenir, bulut kapalıdır. Yerel HTML için `null` origin yalnız salt okuma köprüsünde kabul edilir. Köprü yalnız sabit modelle /api/chat çağrısını iletir; model yönetim APIleri açılmaz. Asıl model 11436 üzerinde çalışır. İşletim sistemi ortam ayarı değiştirilmez.
4. Plan Studio'da Görselden Plan Oluştur → bilgileri gir → Görseli oku ve plan öner.

Modelden gelen ölçü, duvar ve birimler doğrulanır. Belirsizlik varsa kullanıcıya soru gösterilir; birim veya toplam uyuşmazlığında çizim üretilmez. Her sonuç insan tarafından onaylanır. Eğik/çokgen otomatik okuma henüz bu ortak zincir çözümüne bağlı değildir. Kapı/pencere geometrisi bu sürümde otomatik üretilmez. Modelin her müşteri çizimini hatasız okuyacağı garanti edilmez.

Resmî kaynaklar: https://ollama.com/library/qwen3-vl:8b-instruct ; https://docs.ollama.com/api/chat ; https://docs.ollama.com/windows

Bilgisayar yeniden başlatılınca okuyucu betiğini tekrar çalıştırın. Otomatik başlangıç kurulmaz. Node.js kurulu olmalıdır (bu bilgisayarda mevcut çalışma ortamının Node.js'i kullanılıyor). Ev/diğer PC kurulumu henüz doğrulanmadı. İlk genel 8b etiketi Thinking sürümüne çözüldüğünden yanıt sınırına takıldı; bu yüzden sürüm adı açıkça 8b-instruct olarak sabitlendi.
