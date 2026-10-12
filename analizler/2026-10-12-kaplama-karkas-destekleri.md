# Kaplama levhasına göre karkas destekleri — 12 Ekim 2026

DEV-095. Kullanıcının verdiği ölçüler cm'den mm'ye çevrildi: OSB1220×2440, alçıpan1200×2500, BoardeX1200×2400mm. Yatay/dikey yerleşim seçilebilir. Karkas hem levha kenarlarına hem orta vida hatlarına destek vermelidir; yalnız levha ek kotuna yatay kayıt koymak yeterli değildir. Dikme ve kayıt birlikte çözülür. Levha derzleri rastgele eşit dikme dağılımına uydurulmaz.

Örnek başlangıç yerleşimi, şaşırtmasız ve boşluksuz geometrik şema: dikey1200×2500levhada yatay doğrultuda0/600/1200mm; düşey doğrultuda0/1250/2500mm destek hatları. Yatay OSB2440×1220yerleşiminde yatay doğrultuda0/1220/2440mm; düşeyde0/610/1220mm. Bu, orta/kenar gereksinimini gösterir;1220mm dikme açıklığına izin verildiği anlamına gelmez. Taşıyıcı azami aralık daha sık destek isterse ek dikmeler/kayıtlar konur, derz/orta hatlar yerinden oynatılmaz.

Vida adımı,levha kenarından vida mesafesi,derz boşluğu,şaşırtma ve başlangıç ofsetleri henüz verilmedi. İki yüz farklı kaplanırsa gerekli destek hatlarının birleşimiyle mükerrer kayıt önlenmesi önerildi; kullanıcı yüz kombinasyonunu henüz belirtmedi. Kapı/pencere kenarlarında ve kesilmiş levhalarda kalan parçaların desteği ayrıca çözülecek. Destek hatlarının profil kanat yüzeyiyle örtüşmesi kontrol edilmeli; profil başlangıç koordinatı vida aksı değildir.

0.2.0 eşit dikme dağılımı kaplama uyumunu henüz sağlamaz. Bu gereksinim cladding-rules.json içinde kayıtlıdır; kurulu eklentiye uygulanmadı. Sonraki adım kaplama/yön/başlangıç seçimi ve destek hatlarını koruyan yerleşim çözümü. Vida tüketimi veya statik taşıma kararı bu kayıttan türetilmez. Kullanıcının ekranı0.2.0panel oluşumunu gösterir; ara kayıt/çaprazlar henüz yok.
