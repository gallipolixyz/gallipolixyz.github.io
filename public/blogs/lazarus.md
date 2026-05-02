# Lazarus Group (APT 38) Rapor Analizi

![](/blogs/img/lazarus/lazarus_1.png)

## 1. Grup Profili ve Tarihçe

Lazarus Group, APT 38 olarak da bilinen Kuzey Kore hükümeti ile bağlantılı olduğu kabul edilen, devlet destekli bir APT grubudur. İlk başlarda (2009-2012) sadece yıkıcı DDoS saldırılarıyla tanınırken, zamanla finansal motivasyonlu operasyonlara ve sofistike casusluk faaliyetlerine evrildiler.

---

Lazarus’u diğer APT gruplarından ayıran en temel fark, "Hizmet Birimleri" şeklinde organize olmalarıdır. Tek bir grup yerine, farklı görevlere odaklanmış alt birimlerden oluşurlar:

* BlueNoroff: Tamamen finansal kurumlara, SWIFT sistemlerine ve kripto varlıklara odaklanan "para birimi".

* Andariel: Daha çok Güney Kore odaklı askeri casusluk, keşif ve savunma sanayii hedeflerini vuran birim.

* Labyrinth Chollima: En sofistike ve yıkıcı saldırıları (Sony gibi) yürüten çekirdek kadro.

Sadece sistem silecek (Wiper) araçlardan, bugün dünyanın en karmaşık kripto aklama (Mixer) sistemlerini kullanan bir yapıya dönüştüler. 2014’teki Sony saldırısında kullandıkları kaba kuvvet taktikleri, 2024-2026 döneminde yerini meşru yazılım tedarik zincirlerine sızmaya (Supply Chain Attack) bıraktı.

---

### Önemli Operasyonlar ve Sabıka Kaydı:

* Sony Pictures Saldırısı (2014): "The Interview" filminin vizyona girmesini engellemek için şirketin tüm ağını sildiler ve gizli verileri sızdırdılar.

* Bangladeş Bankası Soygunu (2016): SWIFT sistemi üzerinden 81 milyon dolar çalarak tarihin en büyük banka soygunlarından birine imza attılar.

* WannaCry Fidye Yazılımı (2017): Dünya genelinde 300 binden fazla bilgisayarı kilitleyen ve sağlık sistemlerini (NHS gibi) felç eden küresel krizin arkasındaki isim olarak belirlendiler.

* Kripto Para Devri (2020 - 2026): Son yıllarda odakları tamamen Web3 ve Kripto borsalarına kaydı. Ronin Network (600M$) ve en son Bybit (1.4B$) gibi devasa soygunlarla siber suç dünyasında "para aklama" uzmanı haline geldiler.

---

## 2. Teknik Detaylar ve MITRE ATT&CK Analizi

Lazarus, operasyonlarında çok aşamalı ve gizliliğe önem veren bir yapı kullanır. Özellikle son dönemdeki "Graphalgo" ve "Medusa Ransomware" kampanyalarındaki teknikleri üzerinden analiz edelim:

### A. İlk Erişim (Initial Access)

T1566 - Phishing (Oltalama): En sevdikleri yöntem. Genellikle LinkedIn veya Discord üzerinden "Sahte İşe Alım" (Fake Recruiter) senaryoları kurgularlar. Hedefe "mülakat testi" adı altında zararlı içeren bir kod projesi gönderirler.

T1189 - Drive-by Compromise: Meşru görünen ancak zararlı kod enjekte edilmiş web sitelerini kullanırlar.

---

### B. Yürütme ve Kalıcılık (Execution & Persistence)

T1059.003 - Command and Scripting Interpreter (PowerShell): Dosyasız (fileless) saldırılar için yoğun olarak PowerShell ve WMI kullanırlar.

T1053.005 - Scheduled Task: Sisteme sızdıktan sonra belirli aralıklarla çalışan görevler oluşturarak kalıcılık sağlarlar.

T1574.002 - DLL Side-Loading: Meşru bir uygulamanın yanına kendi zararlı DLL dosyalarını koyarak güvenlik yazılımlarını 
atlatırlar.

---

### C. Savunma Atlatma (Defense Evasion)

T1027 - Obfuscated Files or Information: Kodlarını çok katmanlı olarak şifrelerler. Analiz edilmesini zorlaştırmak için özel paketleyiciler (packers) kullanırlar.

T1562.001 - Impair Defenses: Antivirüs ve EDR servislerini devre dışı bırakmak için sistem araçlarını kullanırlar.

---

### D. Komuta ve Kontrol (Command and Control - C2)

T1071.001 - Web Protocols (HTTP/S): C2 trafiğini normal internet trafiği gibi göstermek için meşru bulut servislerini (GitHub, Google Drive) veya hacklenmiş yasal siteleri proxy olarak kullanırlar.

---

## 4. Derinlemesine Teknik Analiz

MITRE ATT&CK matrisinin ötesinde, bu grubun "imza" haline gelmiş özel operasyonel yöntemlerine bakalım:

### 1) Keşif ve Sosyal Mühendislik (Reconnaissance)

Lazarus, hedefiyle aylarca bağ kurabilecek kadar sabırlıdır.

Sahte "Persona" Oluşturma: LinkedIn üzerinde "Senior Recruiter" veya "Blockchain Architect" profilleri oluştururlar. Bu profiller genelde çalınmış gerçek fotoğraflar ve AI ile oluşturulmuş, profesyonel görünen özgeçmişlerle desteklenir.

Trojanized Tools: Hedef aldıkları sistem yöneticilerine veya geliştiricilere "işe alım testi" olarak gönderdikleri kodların içine (genellikle bir C++ projesi veya Node.js bağımlılığı içine) "Dtrack" gibi gelişmiş arka kapılar (backdoor) gizlerler.

---

### 2) Savunma Atlatma Teknikleri (Defense Evasion)

BYOVD (Bring Your Own Vulnerable Driver): Lazarus'un en karakteristik özelliklerinden biridir. Sistemde yetki yükseltmek için, bilinen açıkları olan yasal bir Windows sürücüsünü (driver) sisteme yüklerler. Ardından bu sürücüdeki açığı kullanarak kernel seviyesinde kod çalıştırır ve antivirüs/EDR yazılımlarını kör ederler.

Steganografi: Zararlı kodlarını masum görünümlü bir .png veya .jpg dosyasının pikselleri arasına gizlerler. Güvenlik duvarları bir resim dosyasının indirilmesini genellikle engellemediği için bu yöntemle içeri sızarlar.

---

### 3) Kalıcılık ve Yanal Hareket (Lateral Movement)

Living off the Land (LotL): Kendi araçlarını yüklemek yerine, Windows'un kendi araçlarını (Certutil, PowerShell, Bitsadmin) kullanarak iz bırakmadan hareket ederler.

Mimikatz Özelleştirmeleri: Bellekten kimlik bilgilerini çalmak için kullandıkları Mimikatz aracını, imza tabanlı taramalara yakalanmaması için sürekli olarak yeniden derler ve obfuscate ederler (kod karartma).

---

### Altyapı ve C2 (Komuta Kontrol) Yapısı

Lazarus’un altyapısı "çok katmanlı bir proxy" mantığıyla çalışır:

* Birinci Seviye (Hop 1): Genellikle hacklenmiş savunmasız WordPress siteleri veya kişisel sunucular.

* İkinci Seviye (Hop 2): Farklı ülkelerde kiraladıkları VPS sunucuları.

* Ana Sunucu: Kuzey Kore veya müttefik bölgelerdeki güvenli çıkış noktaları.

Protokol Çeşitliliği: Sadece HTTP/S değil, tespit edilmemek için özel olarak şifrelenmiş DNS Tunneling veya Slack/Telegram API'lerini C2 kanalı olarak kullanırlar.

---

### Tespit ve Korunma Stratejisi (Blue Teaming)

Lazarus gibi bir grubu yakalamak için standart antivirüsler yeterli değildir. Şu odak noktaları kritiktir:

Davranışsal Analiz: Bir PDF okuyucunun veya tarayıcının neden cmd.exe başlattığını veya neden lsass.exe belleğine erişmeye çalıştığını izlemek.

Yara Rules: Grubun kullandığı özel fonksiyon adları veya string örüntüleri (örneğin "Manuscrypt" zararlısı için yazılmış özel kurallar) ile tarama yapmak.

Tedarik Zinciri Kontrolü: Yazılım geliştirme süreçlerinde kullanılan açık kaynaklı paketlerin (npm, pip) hash kontrollerini yapmak.

---

Analiz Notu: Lazarus, bir saldırı başarısız olduğunda pes etmez; tekniklerini değiştirip aynı hedefe aylar sonra tekrar döner. Özellikle son 2 yılda Zero-day (sıfırıncı gün) açıklarını satın alacak veya keşfedecek kadar finansal güce eriştiler.

## 3. Güncel Tehdit Aktörü Stratejisi (2025-2026)

Lazarus artık sadece "hacker" değil, aynı zamanda birer "sosyal mühendislik" uzmanı gibi davranıyor.

Yöntem: Kripto geliştiricilerine GitHub üzerinden "gel bizim projeye katkı sağla" diyerek zehirli npm/PyPI paketleri indiritiyorlar.

Yenilik: Analizlerin gösterdiği üzere, artık sosyal mühendislik aşamasında Yapay Zeka araçlarını kullanarak çok daha inandırıcı oltalama mailleri ve sahte profiller oluşturmaya başladılar.

---

## Sonuç

Lazarus Group, siber dünyada sadece teknik bir tehdit değil, aynı zamanda devlet destekli casusluk ile organize suçun sınırlarının ne kadar bulanıklaşabileceğinin yaşayan bir kanıtıdır. Unutmayın; bu çapta bir aktöre karşı en güçlü savunma, en güncel EDR çözümü değil, her bağlantıya ve her "iş teklifine" karşı koruduğunuz şüpheci zihniyettir.