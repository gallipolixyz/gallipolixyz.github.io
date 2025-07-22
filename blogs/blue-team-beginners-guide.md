# Mavi Takım Başlangıç Rehberi
Tehdit istihbaratı, bellek adli bilişimi ve zararlı yazılım analizine dair kişisel öğrenme notlarım.

**İçindekiler :**

- **Siber tehdit istihbaratı**
- **Balküpü**
- **Tehdit Avcılığına Giriş**
- **Malware**
- **Memory Forensics**

**Siber tehdit istihbaratı** (Cyber Threat Intelligence — CTI), kurumların dijital varlıklarını korumak amacıyla olası tehditleri tanımlamak, analiz etmek ve bu tehditlere karşı önceden önlem almak için kullanılan bilgi ve süreçler bütünüdür. Bu yaklaşım, siber saldırılara karşı proaktif bir savunma stratejisi geliştirmeyi hedefler. CTI, özellikle finans, enerji ve sağlık gibi kritik sektörlerde faaliyet gösteren kurumlar için büyük önem taşır.

**Temel Kavramlar**

**Taktik, Teknik ve Prosedürler (TTP)** Saldırganların hedeflerine ulaşmak için kullandıkları yöntemlerin sınıflandırılmasıdır.

**Göstergeler (Indicators of Compromise — IoC)**  
Bir sistemin ihlal edildiğini gösteren somut veriler (örneğin, şüpheli IP adresleri, dosya hash’leri).

**Tehdit Aktörleri**:  
Siber saldırıları gerçekleştiren kişi veya gruplar.

**Açık Kaynak İstihbaratı (OSINT)**:  
Herkese açık kaynaklardan elde edilen istihbarat bilgileri.

**MITRE ATT&CK** (Adversarial Tactics, Techniques, and Common Knowledge), siber saldırganların davranışlarını ve kullandıkları yöntemleri sistematik bir şekilde sınıflandıran açık kaynaklı bir bilgi tabanıdır. Bu framework, güvenlik profesyonellerinin saldırı vektörlerini anlamalarına ve savunma stratejilerini buna göre şekillendirmelerine yardımcı olur. MITRE ATT&CK, özellikle tehdit modelleme ve saldırı simülasyonları gibi alanlarda yaygın olarak kullanılır.

**Deep Web**, standart arama motorları tarafından indekslenmeyen internetin bir bölümüdür. Bu alan, şifre korumalı sayfalar, özel veritabanları ve yalnızca belirli kullanıcıların erişebildiği içerikleri barındırır. Deep Web, internetin büyük bir kısmını oluşturur ve genellikle yasal ve zararsız içeriklerden oluşur.

**VirusTotal**, kullanıcıların şüpheli dosya ve URL’leri analiz etmelerine olanak tanıyan ücretsiz bir çevrimiçi hizmettir. Bu platform, 70'ten fazla antivirüs motorunu kullanarak gönderilen içeriği tarar ve potansiyel tehditleri belirler. Ayrıca, kullanıcılar tarafından yüklenen içerikler, güvenlik topluluğuyla paylaşılır, bu da kolektif bir savunma mekanizması oluşturur.

**Balküpü** (honeypot), siber güvenlik alanında saldırganları yanıltmak ve analiz etmek amacıyla kullanılan bir tuzak sistemidir. Gerçek bir sistem gibi davranan bu yapılar, saldırganların dikkatini çekerek onların yöntemlerini ve araçlarını gözlemlemeye olanak tanır. Balküpü sistemleri, saldırganların faaliyetlerini izleyerek, güvenlik açıklarını tespit etmeye ve savunma stratejilerini geliştirmeye yardımcı olur.

**Balküpü türleri genel olarak ikiye ayrılır**:

**Düşük Etkileşimli Balküpü**: Saldırganlara sınırlı etkileşim imkanı sunar ve temel saldırı yöntemlerini tespit etmeye yöneliktir.

**Yüksek Etkileşimli Balküpü**: Saldırganların daha derinlemesine etkileşimde bulunmasına izin verir, bu sayede daha karmaşık saldırı teknikleri ve davranışları analiz edilebilir.

**Balküpü Örnek Anlatım**

Bir şirkette güvenlik ekibi, belirli bir süredir dış kaynaklı şüpheli trafiğin ağın belirli bölümlerine yöneldiğini fark eder. Bu durumun kaynağını ve yöntemini anlamak amacıyla bir **SSH honeypot** (balküpü) sistemi kurarlar. Sistem, normal bir sunucu gibi davranır ve şifrelenmiş bağlantıları kabul eder.

**Saldırganlar**, bu sahte sunucuya parola denemeleriyle brute-force saldırısı yapmaya başlar. Ancak:

Gerçek sunucuya ulaşamazlar.

Tüm giriş denemeleri (**IP adresleri**, **kullanıcı adları**, **denenen parolalar**) kaydedilir.

Saldırgan bağlantı kurduğunda komut satırında yazdığı her şey gözlemlenir.

**Tehdit İstihbaratı Katkısı**:  
Elde edilen **IP adresleri**, daha sonra **IOC** (Indicator of Compromise) olarak kullanılabilir.

Saldırganın komutları analiz edilerek kullandığı araçlar ve hedeflediği servisler anlaşılır.

Saldırganın davranışı, **MITRE ATT&CK** çerçevesinde kategorize edilerek saldırının aşamaları modellenebilir.

Bu veriler, güvenlik duvarlarının ve SIEM sistemlerinin yapılandırılmasında kullanılarak kurumun savunma hattı güçlendirilir. Ayrıca benzer saldırılara karşı proaktif önlemler geliştirilmiş olur.

**Windows Event Log** (Olay Günlüğü), Windows işletim sistemlerinde meydana gelen sistem, güvenlik ve uygulama olaylarının kaydedildiği bir günlükleme sistemidir. Bu günlükler, sistem yöneticileri ve güvenlik uzmanları tarafından sistemin durumu, performansı ve güvenliği hakkında bilgi edinmek için kullanılır. Event Log’lar, olayın meydana geldiği tarih ve saat, olayın türü, kaynağı ve önem derecesi gibi bilgileri içerir.

**Örnek 1**: Brute-Force Saldırı Tespiti (Event ID 4625 ve 4624)  
Bir kullanıcı hesabına yönelik çok sayıda başarısız oturum açma denemesi gözlemlenir. Ardından bir deneme başarılı olur.

4625 (Failed Logon) olay kimlikleri sistem günlüklerinde üst üste kaydedilir. Aynı IP’den 5 dakikada 100 kez gelen bu tür girişimler bir brute-force saldırısına işaret eder.

Sonrasında 4624 (Successful Logon) kaydı alınırsa, saldırganın giriş yaptığı anlaşılır.

**Tehdit Avcılığı Analizi**:

Kaynak IP, hedef kullanıcı ve saat bilgileri çıkarılır.

Saldırının geldiği IP adresi diğer sistemlerde de görünüyorsa, yayılma analizi yapılır.

Bu IP, IOC (Indicator of Compromise) listesine eklenir ve firewall/EDR sistemlerine beslenir.

**Örnek 2**: Yetki Yükseltme Davranışı (Event ID 4672)  
Sıradan bir kullanıcı, sistemde beklenmeyen bir şekilde yönetici ayrıcalıkları kazanır.

4624 ile gelen normal oturum kaydından kısa süre sonra 4672 (Special Privileges Assigned to New Logon) olayı alınır.

Bu, saldırganın token stealing veya exploit kullanarak sistem hakları kazandığını gösterebilir.

**Tehdit Avcılığı Analizi**:

Kullanıcının önceki davranışları ile karşılaştırma yapılır.

Aynı zaman aralığında oluşan diğer Event ID’ler incelenir: 4688 (process create), 4698 (scheduled task create) gibi.

**ELK** Elasticsearch, Logstash ve Kibana bileşenlerinden oluşan açık kaynaklı bir veri analiz platformudur.

**Elasticsearch**: Büyük hacimli verileri depolamak ve aramak için kullanılan dağıtılmış bir arama ve analiz motorudur.

**Logstash**: Farklı kaynaklardan gelen verileri toplayan, işleyen ve Elasticsearch’e gönderen bir veri işleme ardışık düzenidir.

**Kibana**: Elasticsearch’te depolanan verileri görselleştirmek ve analiz etmek için kullanılan bir arayüzdür.

ELK, sistem ve uygulama günlüklerini merkezi bir yerde toplayarak, gerçek zamanlı analiz ve görselleştirme imkanı sunar.

**ELK Saldırı Tespiti ve Görselleştirme**

**1\. Log Toplama:**  
Logstash, Windows makinelerden gelen Event Log’ları toplar. Özellikle şu log türleri filtrelenir:

4624: Başarılı oturum açma

4625: Başarısız oturum açma

4648: Farklı kullanıcıyla kimlik doğrulama girişimi

**2\. Log Analizi:**  
Elasticsearch, logları indeksler. Bir güvenlik analisti, Kibana üzerinde şu sorguyu çalıştırır:

```
(event.code:"4625" OR event.code:"4624") AND winlog.event_data.LogonType:"10"
```

**3\. Anomali Tespiti:**  
Kibana dashboard’larında:

Aynı kullanıcıya 5 dakika içinde 100’den fazla oturum denemesi

Başarılı oturumun ardından yüksek yetkili işlem çalıştırılması (4688: powershell.exe)

Görselleştirme sayesinde saldırı deseni kolayca fark edilir:

IP bazlı saldırı yoğunluğu haritası

Zaman çizelgesinde başarısız ve başarılı oturumların sıralı görünümü

**4\. Otomasyon ve Müdahale:**  
Logstash filtreleri, şüpheli IP’leri işaretlemek için güncellenir.

Güvenlik duvarı politikaları, bu IP’leri otomatik olarak engeller (SOAR entegresi varsa otomatik müdahale de yapılabilir).

**Malware** (kötü amaçlı yazılım), bilgisayar sistemlerine zarar vermek, veri çalmak veya yetkisiz erişim sağlamak amacıyla tasarlanmış yazılımlardır. Bu yazılımlar, kullanıcıların bilgisi dışında sistemlere sızarak çeşitli zararlı faaliyetlerde bulunabilirler.

**Yaygın Malware Türleri**  
Virüsler: Kendilerini diğer dosyalara ekleyerek çoğalan ve sistemlere zarar veren yazılımlardır.

**Truva Atları** (Trojan): Faydalı bir yazılım gibi görünerek kullanıcıyı kandıran, ancak arka planda zararlı işlemler gerçekleştiren yazılımlardır.

**Solucanlar** (Worms): Ağlar üzerinden yayılan ve kendini çoğaltarak sistemleri enfekte eden yazılımlardır.

**Fidye Yazılımları** (Ransomware): Kullanıcının dosyalarını şifreleyerek erişimi engelleyen ve şifreyi çözmek için fidye talep eden yazılımlardır.

**Casus Yazılımlar** (Spyware): Kullanıcının faaliyetlerini izleyerek gizli bilgileri toplayan yazılımlardır.

**Reklam Yazılımları** (Adware): İstenmeyen reklamlar göstererek kullanıcı deneyimini bozan yazılımlardır.

**Dosyasız Malware** (Fileless Malware): Sistemde kalıcı dosyalar bırakmadan, bellekte çalışan ve tespiti zor olan yazılımlardır.

**Malware Nasıl Yayılır?**  
Malware, çeşitli yollarla sistemlere bulaşabilir:

E-posta ekleri ve bağlantıları

Sahte yazılım güncellemeleri

Enfekte USB cihazları

Zararlı web siteleri ve reklamlar

Sosyal mühendislik saldırıları

Bu yöntemlerle kullanıcıları kandırarak sistemlere sızar ve zararlı faaliyetlerini gerçekleştirir.

**Malware analizi**, zararlı yazılımların davranışlarını ve etkilerini anlamak için yapılan bir süreçtir. Bu analiz, iki ana yöntemle gerçekleştirilir:

**1\. Statik Analiz**  
Statik analiz, malware’in çalıştırılmadan önce incelenmesidir. Bu yöntemle, yazılımın içeriği, yapısı ve potansiyel tehlikeleri belirlenir.

\-PEiD: Dosyanın paketlenip paketlenmediğini ve hangi yazılımla paketlendiğini tespit eder.

\-Dependency Walker: Dosyanın hangi dinamik bağlantı kitaplıklarına (DLL) ihtiyaç duyduğunu gösterir.

\-Strings: Dosyada bulunan metinleri çıkararak potansiyel IP adresleri, URL’ler veya komutları tespit eder.

**Örnek**: Bir .exe dosyası üzerinde “Strings” aracı kullanılarak, içinde “<ins>http://malicious-site.com</ins>" gibi bir URL bulunursa, bu dosyanın zararlı bir siteye bağlantı kurmaya çalıştığı anlaşılabilir.

**2\. Dinamik Analiz**  
Dinamik analiz, malware’in kontrollü bir ortamda çalıştırılarak davranışlarının gözlemlenmesidir. Bu yöntemle, yazılımın sistem üzerinde ne tür değişiklikler yaptığı, hangi dosyaları oluşturduğu veya hangi ağ bağlantılarını kurduğu belirlenir.

Araçlar:

\-Process Monitor: Gerçek zamanlı olarak sistemdeki dosya, kayıt defteri ve işlem etkinliklerini izler.

\-Wireshark: Ağ trafiğini analiz ederek malware’in hangi IP adresleriyle iletişim kurduğunu tespit eder.

\-Cuckoo Sandbox: Malware’i sanal bir ortamda çalıştırarak kapsamlı bir analiz raporu sunar.

**Örnek**: Bir malware, çalıştırıldığında belirli bir IP adresine veri gönderiyorsa, “Wireshark” aracıyla bu trafik izlenerek zararlı etkinlikler tespit edilebilir.

Sonuç Olarak :

Malware’ler, siber güvenlik dünyasında ciddi tehditler oluşturur. Bu tehditlerle başa çıkmak için malware analiz tekniklerini öğrenmek ve uygulamak önemlidir. Statik ve dinamik analiz yöntemleri, zararlı yazılımların tespiti ve etkisiz hale getirilmesinde kritik rol oynar.

**Hafıza imajı analizi**, bir bilgisayarın RAM (Random Access Memory) içeriğinin incelenmesi sürecidir. Bu analiz, sistemin o anki durumunu, çalışan işlemleri, açık ağ bağlantılarını ve potansiyel kötü amaçlı yazılımları tespit etmek için kullanılır.

**Neden Hafıza Analizi?**

**Geçici Verilerin İncelenmesi**: RAM, sistem kapatıldığında silinen geçici verileri barındırır. Bu veriler arasında şifreler, oturum anahtarları ve geçici dosyalar bulunabilir.

**Kötü Amaçlı Yazılım Tespiti**: Bazı zararlı yazılımlar sadece bellekte çalışır ve disk üzerinde iz bırakmaz. Hafıza analizi, bu tür yazılımların tespiti için kritiktir.

**Olay Müdahalesi**: Siber güvenlik olaylarında, hızlı ve etkili bir müdahale için hafıza analizi önemli bir rol oynar.

**Hafıza İmajı Nasıl Alınır?**  
Hafıza imajı almak için çeşitli araçlar kullanılır. Bu araçlar, sistemin RAM içeriğini bir dosya olarak kaydeder. Bu işlem sırasında sistemin stabilitesini korumak ve verilerin bütünlüğünü sağlamak önemlidir.

**Volatility**, açık kaynaklı bir hafıza adli analiz aracıdır. Python ile yazılmıştır ve Windows, Linux ve macOS sistemlerinin hafıza imajlarını analiz etmek için kullanılır.

**Yaygın Kullanılan Eklentileri**:

\-pslist: Sistemde çalışan işlemleri listeler.

\-connscan: Açık ağ bağlantılarını tespit eder.

\-dlllist: İşlemlere yüklenmiş DLL dosyalarını gösterir.

\-filescan: Bellekteki dosya yapılarının izlerini arar.

Aşağıda, Volatility kullanarak temel bir hafıza analizi örneği sunulmuştur.

**Şüpheli Bir İşlemin Tespiti  
Hafıza İmajının Analizi:**

```
volatility -f memory.img - profile=Win7SP1x64 pslist
```

Bu komut, sistemde çalışan işlemleri listeler.

**Şüpheli İşlemin İncelenmesi:**

Listelenen işlemler arasında bilinmeyen veya alışılmadık bir işlem tespit edildiğinde, bu işlemin detayları incelenir:

```
volatility -f memory.img - profile=Win7SP1x64 dlllist -p
```

Bu komut, belirtilen işlem kimliğine (PID) sahip işlemin yüklü DLL dosyalarını gösterir.

**Ağ Bağlantılarının Kontrolü:**

İşlemin ağ bağlantıları kontrol edilir:

```
volatility -f memory.img - profile=Win7SP1x64 netscan
```

Bu komut, sistemdeki açık ağ bağlantılarını listeler.

**Sonuçların Değerlendirilmesi:**

Elde edilen bilgiler ışığında, şüpheli işlemin kötü amaçlı olup olmadığı değerlendirilir.

**Kaynakça**
 
[Kaspersky - Threat Intelligence](https://www.kaspersky.com.tr/resource-center/definitions/threat-intelligence)

[Mitre ATT&CK Nedir? Nasıl Kullanılır?](https://medium.com/%40demezmurat1/mitre-att-ck-nedi%CC%87r-nasil-kullanilir-3c6762c55a74)

[Dark Web Nedir? Nasıl Girilir?](https://www.donanimhaber.com/dark-web-nedir-nasil-girilir--166032)

[Honeypot Nedir?](https://www.webdehayat.com/honey-pot-nedir/)

[Windows Event Log Analizi](https://cyberwebeyeos.com/sistem/windows-event-log-analizi)

[ELK Stack Nedir?](https://bilisimevreni.com.tr/elk-stack-nedir/)

[Malware Nedir?](https://www.mcafee.com/tr-tr/antivirus/malware.html)
 
[Volatility Memory Forensic Tool](https://medium.com/@lopchannabeen138/volatility-memory-forensic-tool-662b3b572549)

-----

[My LinkedIn](https://www.linkedin.com/in/nur-sena-avci-33154b185/)
