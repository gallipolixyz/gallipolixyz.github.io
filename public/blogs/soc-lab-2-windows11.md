# SOC Lab Rehberi Bölüm 2: Windows 11

Bu bölümde, pfSense’in koruması altındaki iç ağımızda konumlanacak, saldırıları analiz edeceğimiz ve güvenlik araçlarımızı koşturacağımız Windows 11 makinesinin kurulumunu gerçekleştiriyoruz.

Bir SOC laboratuvarında sadece firewall’un olması yeterli değildir; trafiğin bir noktadan bir noktaya akması ve bu akışın izlenebilir olması gerekir. Windows 11, hem modern saldırı yüzeylerini anlamak hem de kurumsal bir uç nokta (endpoint) cihazının nasıl log ürettiğini görmek için ideal bir seçimdir. Bu adımda, analiz makinemizi dış dünyadan izole edip pfSense’in arkasına güvenli bir şekilde yerleştirerek laboratuvarımızın operasyonel yeteneklerini hayata geçiriyoruz.

---

## 1) Windows 11 ISO Dosyasını İndirme

Kuruluma başlamak için ihtiyacımız olan ilk şey, Microsoft'un resmi web sitesinden indirebileceğimiz güncel bir Windows 11 Disk Görüntüsüdür (ISO).

1) Microsoft'un resmi "Windows 11'i İndirin" sayfasına gidin.

2) Sayfada karşınıza çıkan seçeneklerden "Windows 11 Disk Görüntüsünü (ISO) İndirme" (Disk Image ISO) başlığını bulun. Buradaki açılır menüden "Windows 11 (multi-edition ISO)" seçeneğini işaretleyin.

3) SOC laboratuvarımızda teknik dokümantasyon ve log takibini kolaylaştırmak adına "English (United States)" dilini seçmenizi öneririm. Seçimi yaptıktan sonra "Confirm" butonuna tıklayın.

4) Son aşamada karşınıza çıkan "64-bit Download" butonuna basarak ISO dosyasını bilgisayarınıza indirin.

---

## 2) Sanal Makine Oluşturma

ISO dosyamız hazır olduğuna göre VirtualBox üzerinde makinemizi oluşturmaya başlayabiliriz.

![](/blogs/img/soc-lab-2-windows11/win_1.png)

Bu aşamada yaptığımız temel konfigürasyonlar şunlardır:

* VM Name: Makinemize soc_win11 ismini veriyoruz. (istediğiniz ismi verebilirsiniz)

* ISO Image: İndirdiğimiz güncel Windows 11 ISO dosyasını  "ISO Image" satırında seçiyoruz.

* Edition: Gelişmiş ağ ve güvenlik özelliklerini (Group Policy, RDP vb.) kullanabilmek için Windows 11 Pro sürümüyle ilerliyoruz.

* Unattended Installation: Bu kutucuğu boş bırakıyoruz. Amacımız, kurulum esnasındaki kullanıcı ve ağ ayarlarını manuel olarak yapılandırarak SOC gereksinimlerimize göre özelleştirmektir.

---

## 3) Donanım Kaynaklarının Belirlenmesi

Windows 11, önceki sürümlere göre donanım konusunda biraz daha seçicidir. Analiz makinemizin hem pfSense üzerinden gelen trafiği akıcı bir şekilde işlemesi hem de güvenlik araçlarını (SIEM agentları, EDR simülatörleri vb.) kasmadan çalıştırabilmesi için kaynaklarımızı cömert ama dengeli kullanıyoruz.

![](/blogs/img/soc-lab-2-windows11/win_2.png)

Bu ekranda yaptığımız seçimler:

* Base Memory (RAM): Windows 11 için minimum sınır 4 GB (4096 MB) olmalıdır. Eğer ana makinenizin RAM kapasitesi yüksekse 8 GB da verilebilir, ancak laboratuvar ortamı için 4 GB ideal bir başlangıç noktasıdır.

* Processors (CPU): Akıcı bir deneyim için en az 2 çekirdek (CPU) atıyoruz. Tek çekirdekli bir yapılandırma, analiz sırasında sistemin kilitlenmesine neden olabilir.

* EFI Desteği: Windows 11'in modern güvenlik gereksinimleri nedeniyle "Use EFI" kutucuğunun işaretli olduğundan emin oluyoruz. Bu, sistemin güvenli önyükleme (Secure Boot) yapısını simüle etmemize olanak tanır.

---

## 4) Sanal Disk Oluşturma

Windows 11, işletim sistemi dosyaları ve çalışma alanı için hatırı sayılır bir disk alanına ihtiyaç duyar. Ayrıca SOC laboratuvarımızda analiz yaparken çeşitli araçlar kuracağımız ve log biriktireceğimiz için diski çok dar tutmamalıyız.

![](/blogs/img/soc-lab-2-windows11/win_3.png)

Bu ekrandaki yapılandırma detaylarımız:

* Disk Size: Windows 11 için önerilen minimum disk alanı olan 64 GB değerini belirliyoruz. Bu alan, temel analiz araçları ve sistem dosyaları için yeterli bir başlangıç noktasıdır.

* Hard Disk File Type: Varsayılan olan VDI (VirtualBox Disk Image) formatını seçiyoruz.

* Depolama Tipi: "Pre-allocate Full Size" seçeneğini işaretlemiyoruz. Bu sayede disk, fiziksel bilgisayarınızda hemen 64 GB yer kaplamak yerine, sadece Windows içinde kullanılan veri miktarı kadar büyüyecektir (Dynamic Allocation).

Ayarları tamamladıktan sonra Finish butonuna basarak sanal makine oluşturma sihirbazını sonlandırıyoruz.

---

## 5) Ağ Kartının Yapılandırılması

Laboratuvar ortamımızda Windows 11 makinesi bir "uç nokta" (endpoint) görevi görür. Bu makinenin internete kendi başına değil, kurduğumuz pfSense üzerinden çıkması ve saldırı senaryolarında pfSense tarafından izlenebilmesi için ağ kartını doğru yapılandırmalıyız.

![](/blogs/img/soc-lab-2-windows11/win_4.png)

Bu ekranda yaptığımız hayati ayarlar şunlardır:

* Attached to: Bu seçeneği mutlaka Internal Network olarak ayarlıyoruz. Bu sayede makineyi fiziksel ağımızdan izole ederek tamamen sanal bir ağ içine hapsediyoruz.

* Name: Ağ ismi olarak pfSense kurulumunda LAN bacağı için belirlediğimiz SOC-LAN ismini seçiyoruz. Böylece Windows 11 ve pfSense LAN bacağı aynı sanal kabloya bağlanmış olur.

* Promiscuous Mode: Analiz makinemizde trafiği koklamamıza (sniffing) gerek olmadığı için bu ayarı Deny modunda bırakabiliriz.

---

## 6) İşletim Sistemi Kurulumu

Sanal makinemizi çalıştırdıktan sonra karşımıza gelen kurulum ekranları aşağıdaki gibi olmalıdır.

![](/blogs/img/soc-lab-2-windows11/settings.png)

1) Language & Region: Teknik terimlerin evrenselliği ve log takibinin kolaylığı için kurulum dilini English (United States) olarak bırakıyoruz.

2) Keyboard Layout: Kullandığınız fiziksel klavyeye göre düzeni seçin (genellikle US veya TR-Q).

3) Setup Option: "Install Windows 11" seçeneğiyle temiz bir kurulum başlatıyoruz. Dosyalarımızın silineceğine dair uyarıyı onaylayarak devam ediyoruz.

4) Product Key: "I don't have a product key" diyerek bu adımı atlıyoruz. Laboratuvar ortamı için Windows'u etkinleştirmeden de tüm analiz fonksiyonlarını kullanabiliriz.

5) Operating System: İşte en kritik nokta! Listeden mutlaka Windows 11 Pro sürümünü seçiyoruz. Remote Desktop, BitLocker ve Group Policy Management gibi özellikler sadece Pro ve üstü sürümlerde mevcuttur.

6) License Terms: Lisans koşullarını kabul ediyoruz.

---

Kurulum sihirbazındaki temel seçimleri yaptıktan sonra Windows, dosyaları nereye yüklemek istediğimizi soruyor. Bu aşamada sanal diskimizi seçiyoruz.

![](/blogs/img/soc-lab-2-windows11/win_11.png)

--- 

Gerekli tüm yapılandırmaları ve disk seçimini yaptıktan sonra karşımıza çıkan bu özet ekranı, SOC laboratuvarımız için yaptığımız ayarların doğruluğunu teyit etmemizi sağlıyor.

![](/blogs/img/soc-lab-2-windows11/win_12.png)

Install butonuna bastığımızda, kurulum süreci başlıyor. Windows dosyaları kopyalayacak, özellikleri yükleyecek ve sistem birkaç kez yeniden başlayacak.

---

## 7) İnternet ve Microsoft Hesabı Zorunluluğunu Aşmak (BypassNRO)

Kurulum sonrası Windows 11 bizi karşılama ekranıyla selamlıyor. Microsoft'un bu aşamadaki internet dayatmasını küçük bir komutla devre dışı bırakıyoruz.

![](/blogs/img/soc-lab-2-windows11/connect.png)

#### Adım Adım Bypass Süreci:

1) Ağ Bağlantısı Ekranı: Karşımıza "Let's connect you to a network" ekranı geldiğinde, internetimiz olmadığı için (veya bağlanmak istemediğimiz için) burada takılıyoruz. Normalde "Next" butonu aktif olmayacaktır.

2) Komut Satırını Açma: Klavyemizden Shift + F10 tuş kombinasyonuna basarak siyah komut satırı (CMD) ekranını çağırıyoruz.

3) Komut: Açılan siyah ekrana şu komutu yazıp Enter'a basıyoruz:
OOBE\BYPASSNRO

4) Yeniden Başlatma: Bu komutu girdikten sonra sistem otomatik olarak yeniden başlayacaktır.

---

Sistem "BYPASSNRO" komutundan sonra yeniden başladığında, karşımıza yine aynı ağ bağlantısı ekranı geliyor. Ancak bu sefer bir farkla!

![](/blogs/img/soc-lab-2-windows11/win_17.png)

Görselde de görebileceğiniz üzere, artık sağ alt köşede "I don't have internet" seçeneği belirdi.
Bu seçeneğe tıklayarak devam ediyoruz.

---

## 8) Yerel Kullanıcı Hesabı ve Güvenlik Yapılandırması

Laboratuvarımızda kullanacağımız yerel yönetici hesabını tanımlıyoruz. SOC ortamında bu hesabı, ileride Wazuh dashboard veya analiz araçlarını yönetmek için ana yetkili olarak kullanacağız.

![](/blogs/img/soc-lab-2-windows11/nps.png)

Bu üç adımlı süreçte şu yapılandırmayı uyguluyoruz:

1) Kullanıcı Adı Belirleme: Makineye "Who's going to use this device?" sorusuna karşılık, SOC_Admin ismini veriyoruz. Bu, hem hesabın amacını netleştirir hem de kişisel hesaplardan ayrıştırır.

2) Güçlü Parola Oluşturma: Lab ortamı da olsa, siber güvenlik disiplini gereği tahmin edilmesi zor bir parola belirliyoruz. Unutmayın, bu makine pfSense arkasında olsa bile, ağ içindeki diğer zafiyetli makinelerden gelebilecek yanal hareketlere (Lateral Movement) karşı ilk savunma hattınız parolanızdır.

3) Güvenlik Soruları: Parolayı unutma ihtimaline karşı Windows'un zorunlu kıldığı 3 adet güvenlik sorusunu yanıtlayarak bu aşamayı tamamlıyoruz.

---

## 9) Kurulumun Tamamlanması: Masaüstüne Merhaba

Windows 11 bizi masaüstü ekranıyla karşılıyor.

![](/blogs/img/soc-lab-2-windows11/win_23.png)

## 10) Ağ Bağlantısının Doğrulanması: pfSense ile El Sıkışma

Windows 11 kurulumu bitti ve masaüstüne ulaştık. Ancak makinemiz şu an izole bir sanal kabloyla pfSense’e bağlı. Şimdi, pfSense’in bu makineyi tanıyıp tanımadığını ve doğru IP yapılandırmasını sunup sunmadığını test ediyoruz.

![](/blogs/img/soc-lab-2-windows11/ipconfig.png)

### Bu süreçte karşılaştığımız senaryolar ve çözüm adımlarımız:

1) APIPA Sorunu (Görsel 1 & 2): İlk ipconfig komutunu çalıştırdığımızda IPv4 adresinin 169.254.x.x bloğunda olduğunu görüyoruz. Bu bir APIPA (Automatic Private IP Addressing) adresidir. 
Anlamı şudur: "Windows bir DHCP sunucusu aradı ama ağda cevap veren kimseyi bulamadı." Bu durumun sebebi, pfSense sanal makinemizin henüz kapalı olmasıdır.

2) IP Yenileme (Görsel 3): pfSense makinesini başlattıktan sonra, Windows üzerindeki ağ kartına "tekrar ara" talimatı vermek için şu komutları sırasıyla uyguluyoruz:

* ipconfig /release: Mevcut (hatalı) IP adresini bırakır.

* ipconfig /renew: pfSense’ten yeni bir adres talep eder.

* Başarılı Bağlantı: Yenileme işleminden sonra makinemizin başarıyla 192.168.1.100 IP adresini aldığını görüyoruz.

* Default Gateway: 192.168.1.1 (pfSense LAN bacağı).

* DNS Suffix: home.arpa (pfSense varsayılanı).

---

Doğru IP yapılandırmasını (192.168.1.100) aldığımızı gördükten sonra, bu bağlantının stabilitesini test etmek için pfSense'e bir ping isteği gönderiyoruz. Bu adım, Windows 11 makinemiz ile pfSense arasındaki sanal kablonun ve konfigürasyonun kusursuz çalıştığının son onayıdır.

![](/blogs/img/soc-lab-2-windows11/win_27.png)

Artık Windows 11 makinemiz, pfSense’in yönettiği iç ağın resmi bir üyesi!

---

## 11) pfSense Web Arayüzüne İlk Erişim

Windows 11 üzerinde IP yapılandırmamızın sorunsuz çalıştığını ve gateway'e (192.168.1.1) ulaşabildiğimizi ping testiyle kanıtlamıştık. Şimdi ise tarayıcımızı açarak bu bağlantıyı görsel bir yönetim paneline dönüştürüyoruz.

![](/blogs/img/soc-lab-2-windows11/pflogin.png)

### Adım Adım Giriş Süreci:

1) Sertifika Uyarısı (Görsel 1 & 2): Tarayıcıya https://192.168.1.1 yazdığımızda karşımıza "Your connection isn't private" uyarısı çıkar. Bu durum sizi korkutmasın; pfSense varsayılan olarak kendi imzaladığı (self-signed) bir SSL sertifikası kullandığı için tarayıcı bunu "tanınmayan bir otorite" olarak görür. Advanced butonuna basarak "Continue to 192.168.1.1 (unsafe)" seçeneğiyle ilerliyoruz.

2) Giriş Paneli (Görsel 3): Karşımıza pfSense giriş ekranı geliyor.

Varsayılan Bilgiler: Henüz bir değişiklik yapmadıysak, sisteme şu bilgilerle giriş yapıyoruz:

* Username: admin

* Password: pfsense

SIGN IN butonuna tıkladığımızda, artık laboratuvarımızın tüm kurallarını yazacağımız, Suricata'yı yapılandıracağımız ve trafiği izleyeceğimiz pfSense dashboard'una ulaşmış oluyoruz.

---

## 12) pfSense Yapılandırması

Giriş yaptıktan sonra pfSense, sistemi adım adım yapılandırmamıza olanak tanıyan "pfSense Setup Wizard" ekranını karşımıza çıkarıyor. Bu sihirbaz, firewall'un hostname bilgilerinden zaman sunucusu ayarlarına kadar birçok temel parametreyi tek bir akışta düzenlememizi sağlar.

![](/blogs/img/soc-lab-2-windows11/win_33.png)

---

Setup Wizard içerisinde ilerlerken, laboratuvar ortamımızın düzenli ve profesyonel görünmesi için bazı temel isimlendirme ve bölge ayarlarını yapıyoruz. Bu ayarlar, ileride log analizi yaparken olayların hangi zaman diliminde ve hangi cihazda gerçekleştiğini anlamamız için kritiktir.

![](/blogs/img/soc-lab-2-windows11/pfset1.png)

### Yapılandırdığımız Alanlar:

1) Hostname & Domain (Görsel 1): Cihazımıza ağ üzerindeki ismi olan pfSense adını veriyoruz.

2) Domain: Laboratuvarımız için özel bir alan adı olan soc.lab uzantısını belirliyoruz. Bu sayede cihazlarımıza cihazadi.soc.lab şeklinde erişebiliriz.

3) DNS Sunucuları (Görsel 2): Sistemimize dış dünyayı bulabilmesi için Google DNS adreslerini (8.8.8.8 ve 8.8.4.4) tanımlıyoruz.

4) Override DNS seçeneğini boş bırakarak, pfSense'in bizim belirlediğimiz DNS'leri kullanmasını zorunlu kılıyoruz.

5) Zaman Dilimi (Görsel 3): Logların doğru zaman damgalarıyla (timestamp) kaydedilmesi siber olay müdahalesinde (Incident Response) her şeydir. Bu yüzden Timezone ayarını Europe/Istanbul olarak güncelliyoruz.

6) Zaman sunucusu olarak varsayılan 2.pfsense.pool.ntp.org adresini kullanmaya devam ediyoruz.

---

pfSense'in kimlik bilgilerini belirledikten sonra, sihirbaz bizi dış ağ bağlantı ayarlarını yapacağımız Configure WAN Interface ekranına getiriyor. Laboratuvar ortamımızda pfSense, interneti ana makinemizin (Host) ağından alacağı için burada dinamik bir yapı tercih ediyoruz.

![](/blogs/img/soc-lab-2-windows11/pfset2.png)

### Yapılandırma Detayları:

1) Configuration Type (Görsel 1): WAN bağlantı tipini DHCP olarak seçiyoruz. Bu sayede pfSense, sanallaştırma platformunuzun sunduğu sanal ağ üzerinden otomatik olarak bir IP adresi alacaktır.

2) General Configuration (Görsel 2): MAC adresi klonlama veya MTU/MSS gibi özel ayarları, spesifik bir ISP kısıtlaması yoksa boş bırakıyoruz. Standart lab ortamları için varsayılan değerler en stabilidir.

3) DHCP Client Configuration (Görsel 3): Burada herhangi bir "DHCP Hostname" belirtmemize gerek yok. pfSense, üst ağdaki DHCP sunucusundan adresini alıp internet çıkışını otomatik olarak organize edecektir.

---

WAN arayüzü ayarlarında DHCP seçimini yaptıktan sonra pfSense, farklı bağlantı senaryoları için kullanılabilecek PPPoE ve PPTP gibi protokollerin yapılandırma seçeneklerini sunar. Laboratuvar ortamımızda bu alanları genellikle boş bıraksak da, bu protokollerin ne işe yaradığını bilmek ağ mimarisini anlamak açısından önemlidir.

![](/blogs/img/soc-lab-2-windows11/pfset3.png)

### Yapılandırma Seçenekleri:

1) PPPoE Configuration (Görsel 1): Genellikle doğrudan bir modeme bağlıysanız ve internete çıkış için kullanıcı adı/şifre gerekliyse bu alan kullanılır. Sanal labımızda üst katmandan IP aldığımız için buraları yapılandırmadan geçiyoruz.

2) PPTP Configuration (Görsel 2): Eski bir VPN tünelleme protokolü olan PPTP ayarları burada yer alır. Güvenlik zafiyetleri nedeniyle modern siber güvenlik mimarilerinde artık pek tercih edilmese de, pfSense hala uyumluluk adına bu desteği sunmaktadır.

### Not: Eğer pfSense'i sanal bir ortam yerine doğrudan fiziksel bir hatta ana router olarak kuruyorsanız, ISP'nizden aldığınız kullanıcı bilgilerini Görsel 1'deki alanlara girmeniz gerekecektir.

---

Sihirbazın sonuna yaklaşırken pfSense, ağ trafiğini filtrelemek ve yerel ağımızı tanımlamak için bizden son onayları istiyor. Bu aşamada yapacağımız seçimler, laboratuvarın izolasyon seviyesini belirler.

![](/blogs/img/soc-lab-2-windows11/pfset4.png)

### Yapılandırma Adımları:

1) RFC1918 ve Bogon Bloklama (Görsel 1): Bu seçenek, yerel ağ adreslerinden (10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16) WAN bacağına gelen trafiği engeller.

2) Block Bogon Networks: İnternet üzerinde henüz rezerve edilmemiş veya sahte kaynaklı paketleri engeller.

3) LAN Interface (Görsel 2): Burada pfSense'in iç ağdaki IP adresini (192.168.1.1) ve alt ağ maskesini (24 yani 255.255.255.0) teyit ediyoruz. Bu adres, Windows 11 analiz makinemizin varsayılan geçidi (Gateway) olmaya devam edecek.

4) Yönetici Parolası (Görsel 3): Varsayılan parolayı, sadece sizin bildiğiniz güçlü bir parolayla değiştiriyoruz. Bu parola hem Web arayüzü hem de konsol erişimi için geçerli olacaktır.

---

Tüm ağ, kimlik ve güvenlik yapılandırmalarını tamamladıktan sonra, pfSense bu değişiklikleri sisteme işlemeden önce bizden son bir onay istiyor.

![](/blogs/img/soc-lab-2-windows11/win_45.png)

### Bu ekrandaki "Reload" butonuna tıkladığınızda:

* pfSense tüm servisleri (DHCP, DNS, Firewall kuralları vb.) yeni ayarlarınızla birlikte yeniden başlatır.

* Belirlediğiniz yeni yönetici parolası aktif hale gelir.

* Ağ arayüzleri, tanımladığınız kurallar çerçevesinde trafiği yönetmeye başlar.

Kısa bir bekleme süresinin ardından, pfSense kurulumun başarıyla bittiğini bildiren final mesajını gösterecek ve bizi asıl operasyon merkezimiz olan Dashboard'a yönlendirecektir.

---

Tüm ağ ayarlarını, güvenlik sıkılaştırmalarını ve DNS yapılandırmalarını geride bıraktık. pfSense, yaptığımız değişiklikleri başarıyla işledi ve artık tam kapasite çalışmaya hazır.

![](/blogs/img/soc-lab-2-windows11/win_46.png)

Finish diyerek devam ediyoruz.

---

Kurulum sihirbazını başarıyla tamamladıktan sonra, bizi pfSense'in Dashboard paneli karşılıyor.

![](/blogs/img/soc-lab-2-windows11/win_47.png)

---

Şu anki yapımızda Windows 11 makinemiz ağda tek başına takılıyor. Ancak gerçek bir siber saldırı senaryosu genellikle bir Domain yapısı içerisinde gerçekleşir. Bu yüzden bir sonraki bölümde:

* Windows Server 2022 kurulumunu gerçekleştireceğiz.

* Active Directory Domain Services rolünü kurarak laboratuvarımıza bir kimlik vereceğiz.

* Windows 11 makinemizi bu domaine dahil ederek merkezi yönetim ve loglama sürecinin ilk adımlarını atacağız.