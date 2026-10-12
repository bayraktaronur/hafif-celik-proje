# Salt okunur SketchUp MCP köprüsü 0.1.0

`prefabrikten_inspect.rb` SketchUp 2026 Plugins klasörüne kopyalanır; 0.3.0 karkas eklentisinden bağımsızdır. `server.cjs` Node stdio MCP sunucusudur. Codex ayarı `[mcp_servers.sketchup-inspect]` altında Node komutu ve bu dosyanın mutlak yoluyla tanımlanır. Bilgisayara özgü ayar ve yedeği depoya konmaz.

12 Ekim iş PC kurulumu yapıldı. Ruby kaynak/kurulum SHA-256: `BC98DB70749EB8FF6E328E373E5C0D3546EF6BCA13506FA9F2D6D1A398DD441E`. Codex ayar yedeği üst çalışma klasöründeki `kurulum-paketleri/config-before-sketchup-inspect.toml` içinde yereldir. Diğer PC kendi yollarıyla kurulmalıdır; Git pull kurulum/aktivasyon yerine geçmez.

Aktivasyon: açık çizimleri kullanıcı kaydetmeli; SketchUp yeniden açılınca Ruby dosyası yüklenir. Codex bağlantısının görünmesi ayrıca uygulamanın yeniden açılmasını gerektirebilir. Otomatik kapatma yapılmaz. Yeniden açılış sonrası önce `sessions`, ardından kopyalanan pid/model_guid ile `read_entities` çağrılır. Varsayılan kök modeldir; dönen instance `path` değerleriyle alt gruplar sayfalanır. Edit context içindeyken selection_ids doğrudan kök grup yolu kabul edilmez; active_path ile bağlamı kontrol edilir.

Yerel iletişim `%LOCALAPPDATA%/Prefabrikten/SketchUpMCP/<pid>` klasöründedir. Ağ dinleyicisi veya uzaktan kod yürütme yoktur. Model okuma UI timer üzerinden ana iş parçacığında çalışır. Model değişince GUID kontrolü yanlış modele okumayı engeller. Oturumlar 10 saniye, cevap bekleme 15 saniyeyle sınırlıdır. Modal pencere/takılan SketchUp gecikmeye neden olabilir; boş oturum listesi başarılı canlı bağlantı değildir.

Grup/kopya dönüşümleri bileşik uygulanır. Kenar uçları ve yüz döngüleri dünya koordinatlarında mm döner; kutu köşeleri imalat boyu veya kesit ölçüsü ilan edilmez. Delikler yüz iç döngülerinden incelenebilir; makine takım ayarı/semantik işlem kodu otomatik tanınmaz. Malzeme veya gizli eklenti sözlükleri bu sürümde okunmaz. İmalat onayı kapsam dışıdır.

Kontrol: `node verify.cjs` sahte SketchUp tarafıyla canlı/eski oturum, model koruması, sayfa/yol sınırları, istek/cevap ve temizliği sınar. stdio initialize/tools/list/sessions denendi. Ruby ve gerçek SketchUp dönüşüm/ölçü doğrulaması henüz yapılmadı; aktivasyon sonrası bilinen 1500 × 2500 referansla yapılmalıdır.

Kaynaklar: [SketchUp UI timer](https://ruby.sketchup.com/UI.html#start_timer-class_method), [Instance transformation](https://ruby.sketchup.com/Sketchup/ComponentInstance.html#transformation-instance_method), [Codex MCP yapılandırması](https://learn.chatgpt.com/docs/extend/mcp?surface=cli).
