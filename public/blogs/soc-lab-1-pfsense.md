# SOC Lab Rehberi Bölüm 1: pfSense Firewall

Bu bölümde, SOC laboratuvarımızın ağ trafiğini yönetmek ve güvenliği sağlamak için pfSense firewall kurulumunu gerçekleştiriyoruz.

Modern siber güvenlik operasyonlarının kalbi olan bir SOC (Security Operations Center) yapısını anlamanın en iyi yolu, onu sıfırdan inşa etmektir. Bu serinin ilk adımında, laboratuvarımızın trafik polisliğini yapacak ve ağlarımızı birbirinden izole ederek güvenli bir oyun alanı sağlayacak olan pfSense firewall kurulumuyla temelleri atıyoruz.

---

## Laboratuvar Mimarisi ve Topoloji

Projeye başlamadan önce inşa edeceğimiz yapıyı anlamak kritik bir öneme sahip. Bu lab ortamında sadece makineleri kurmuyoruz; gerçek bir kurumsal ağı simüle etmek için trafiği izole ediyor ve segmentlere ayırıyoruz.

Laboratuvarımızda kullandığımız her araç, profesyonel bir SOC ortamındaki bir ihtiyacı karşılamak üzere seçilmiştir:

* pfSense (Firewall/Router): Ağın giriş ve çıkış kapısı. Sadece ağları birbirinden ayırmakla kalmaz, aynı zamanda üzerindeki Suricata ile ağ tabanlı saldırı tespiti (NIDS) yapmamıza olanak sağlar.

* Wazuh (SIEM/EDR): Laboratuvarın beyni. Uç noktalardan  logları toplar, analiz eder ve bir tehdit algıladığında bize alarm üretir.

* Sysmon (System Monitor): Windows sistemlerde standart logların yetmediği durumlarda; süreç oluşturma, ağ bağlantıları ve dosya zaman damgası değişiklikleri gibi derinlemesine görünürlük sağlayan kritik bir yardımcı araçtır.

* Active Directory (Windows Server 2022): Gerçekçi bir kurumsal yapı simülasyonu. Kullanıcı yönetimi, grup politikaları (GPO) ve merkezi log yönetiminin nasıl çalıştığını test etmemizi sağlar.

* Kali Linux (Offensive Security): "Kırmızı Takım" rolünde, savunma mekanizmalarımızı test etmek için kullanacağımız saldırı platformumuz.

#### Önemli Not
* Laboratuvarımızı kurarken yapacağımız tüm yapılandırma ve sanallaştırma işlemlerini VirtualBox üzerinden gerçekleştireceğiz. Eğer farklı bir sanallaştırma platformu (VMware, Proxmox vb.) kullanıyorsanız, ağ ayarları kısmında benzer mantığı kendi platformunuza uyarlamanız gerekebilir.

---


## 1. pfSense ISO Dosyasını İndirme

Kuruluma geçmeden önce güncel pfSense imajına sahip olmamız gerekiyor. Netgate'in resmi web sitesinden Community Edition (CE) versiyonunu ücretsiz olarak indirebilirsiniz:

* 1- pfSense resmi indirme sitesi olan [https://www.pfsense.org/download/](https://www.pfsense.org/download/) adresine gidin.

* 2- Download seçeneğine tıkladıktan sonra "AMD64 ISO IPMI/Virtual Machines" seçeneğini seçin.

* 3- Sepetinize ekledikten sonra hesabınızı ve bilgilerinizi girip ISO dosyasını indirin.

Not: Merak etmeyin bu ISO dosyası tamamen ücretsiz!

---

## 2. Sanal Makine Oluşturma    

pfSense kurulumuna başlarken ilk adımımız VirtualBox üzerinde uygun kaynaklara sahip sanal makineyi hazırlamak.

![](/blogs/img/soc-lab-1-pfsense/pfsense_1.png)

---

Görselde de görebileceğiniz üzere, temel yapılandırma şu şekildedir:

* Name: pfsense (Makineyi kolayca tanımak için).

* ISO Image: İndirdiğimiz iso dosyasını seçiyoruz.

* Type: BSD

* Version: FreeBSD (64-bit)

Önemli: pfSense, FreeBSD tabanlı bir işletim sistemi olduğu için "Version" kısmında FreeBSD (64-bit) seçili olduğundan emin olun. 

Bu aşamada "Unattended Installation" seçeneğini işaretlemeden devam ediyoruz çünkü kurulum sırasında ağ yapılandırmasını manuel olarak kontrol etmek istiyoruz.

---

## 3. Donanım Kaynaklarının Belirlenmesi

Sanal makinemizin ismini ve işletim sistemini seçtikten sonra, pfSense'in akıcı çalışması için gerekli olan kaynakları atıyoruz. pfSense oldukça verimli bir sistem olsa da, ilerleyen aşamalarda üzerine kuracağımız Suricata gibi paketlerin performanslı çalışması için kaynakları biraz esnek tutmakta fayda var.

![](/blogs/img/soc-lab-1-pfsense/pfsense_2.png)

---

Bu aşamada yaptığımız seçimler:

* Base Memory (RAM): 2048 MB (2 GB). Standart bir kurulum için 1 GB yeterli olsa da, SOC labımızda trafik analizi yapacağımız için 2 GB ayırmak sistemin tıkanmasını önleyecektir.

* Processors (CPU): 2 CPU. Tek çekirdek de iş görecektir ancak paket işleme hızını artırmak adına 2 çekirdek ideal bir tercihtir.

* EFI: Bu seçeneği işaretlemiyoruz. Standart BIOS kurulumu pfSense CE için daha sorunsuz bir deneyim sunar.

---

## 4. Sanal Disk Oluşturma

Donanım kaynaklarını belirledikten sonra, işletim sisteminin ve log verilerinin saklanacağı sanal disk alanını tanımlıyoruz.

![](/blogs/img/soc-lab-1-pfsense/pfsense_3.png)

---

Buradaki tercihlerimiz şu şekildedir:

* Create a New Virtual Hard Disk: Yeni bir disk oluştur seçeneğiyle ilerliyoruz.

* Disk Size: 20 GB. pfSense temel kurulumu için aslında 8 GB bile yeterlidir; ancak Suricata logları ve ileride ekleyeceğimiz paketlerin diskte yer kaplayacağını düşünerek 20 GB güvenli bir tercihtir.

* VDI (VirtualBox Disk Image): VirtualBox’ın yerel disk formatını kullanıyoruz.

* Pre-allocate Full Size: Bu seçeneği işaretlemiyoruz. Böylece disk, bilgisayarınızda fiziksel olarak hemen 20 GB yer kaplamaz; kullanıldıkça boyutu artar (Dynamically Allocated).

"Finish" butonuna tıklayarak sanal makine oluşturma sihirbazını tamamlıyoruz.

![](/blogs/img/soc-lab-1-pfsense/pfsense_4.png)

Görselde görebileceğiniz üzere, oluşturduğumuz pfSense adlı makinemiz yerini almış durumda (kali linux'u şimdilik göz ardı edebilirsiniz).

---

## 5. Ağ Kartlarının Yapılandırılması

pfSense'in laboratuvarımızda trafiği yönetebilmesi, saldırgan ve kurban ağlarını birbirinden ayırabilmesi için toplamda 3 adet ağ adaptörü tanımlamamız gerekiyor. Her bir adaptörün farklı bir görevi ve bağlantı tipi olacak.

Settings > Network sekmesine giderek yapılandırmaya başlıyoruz.

### Adapter 1: Dış Dünya (WAN)

![](/blogs/img/soc-lab-1-pfsense/pfsense_5.png)

Görselde gördüğünüz ilk adaptörümüz olan Adapter 1, pfSense'in internete çıkış kapısıdır.

* Attached to: NAT

Görevi: Bu kart, pfSense'e (ve onun üzerinden diğer makinelere) internet erişimi sağlar. Gerçek dünyadaki bir firewall'un internet servis sağlayıcınıza bağlanan bacağı (WAN) olarak düşünebilirsiniz.

### Adapter 2: Güvenli Bölge (LAN)

![](/blogs/img/soc-lab-1-pfsense/pfsense_6.png)

İkinci adaptörümüzü, kurban makinelerin ve Wazuh sunucumuzun bulunacağı iç ağa ayırıyoruz.

Bu sekmede yaptığımız ayarların detayları:

* Attached to: Internal Network

* Name: SOC-LAN (Bu ismi manuel olarak istediğimiz şekilde giriyoruz. Daha sonra diğer makineleri bu ağa bağlarken aynı ismi kullanacağız).

* Promiscuous Mode: Allow All

Görevi: Burası bizim kurumsal iç ağımızı simüle eder.

#### Neden "Allow All"?
"Promiscuous Mode" ayarını Allow All olarak seçmemizin çok önemli bir nedeni var. İlerleyen aşamalarda pfSense üzerindeki Suricata veya ağ trafiğini dinleyen diğer araçların, bu ağ üzerindeki tüm paketleri (kendisine gelmese bile) yakalayabilmesini istiyoruz. SOC labında tam görünürlük sağlamak için bu ayar hayat kurtarıcıdır.

### Adapter 3: Saldırı Bölgesi (LAN)

![](/blogs/img/soc-lab-1-pfsense/pfsense_7.png)

Son olarak, Kali Linux saldırı makinemizi konumlandıracağımız izole ağ segmentini oluşturuyoruz.

Bu adaptörün yapılandırması şu şekildedir:

* Attached to: Internal Network

* Name: SOC-ATTACK

* Promiscuous Mode: Allow All

Görevi: Kali Linux bu ağa bağlanacak. Buradan gelecek tüm trafik pfSense üzerinden geçmek zorunda kalacak, böylece saldırıları gerçek zamanlı olarak analiz edebileceğiz.

#### Neden Ayrı Bir Ağ?
Saldırgan makineyi (Kali) kurbanların olduğu LAN ağına koymak yerine ayrı bir segmentte tutuyoruz. Bu sayede pfSense, iki ağ arasındaki trafiği denetleyen bir "router/firewall" görevi görüyor. Bu yapı, gerçek bir kurumsal ağdaki DMZ veya dış ağ saldırılarını simüle etmemize olanak tanıyor.

---

### Artık Kuruluma Hazırız!
Tüm sanal donanım ve ağ ayarlarını tamamladık. Artık sanal makinemizi başlatabilir ve pfSense'in kurulum ekranına geçiş yapabiliriz.

---

## 6. İşletim Sistemi Kurulumu

### 6.1)

Sanal makinemizi başlattığımızda, bizi pfSense'in telif hakları ve dağıtım bildirimlerini içeren standart karşılama ekranı karşılıyor.

![](/blogs/img/soc-lab-1-pfsense/pfsense_8.png)

Bu aşamada yapmamız gereken tek şey:

* Klavyemizdeki yön tuşlarını kullanarak [Accept] seçeneğinin üzerine gelmek ve Enter tuşuna basarak devam etmektir.

---

### 6.2)

Lisansı kabul ettikten sonra pfSense bizi ana menüyle karşılıyor. Bu ekran, sistemin diske mi kurulacağını yoksa sadece bir kurtarma kabuğu (shell) mu açılacağını sorduğu bölümdür.

![](/blogs/img/soc-lab-1-pfsense/pfsense_9.png)

Burada yapmamız gereken işlem çok net:

* Install pfSense seçeneği üzerinde olduğumuzdan emin oluyoruz.

* OK butonuna basarak kurulumu başlatıyoruz.

---

### 6.3)

Kurulumun bu aşamasında, az önce VirtualBox ayarlarında oluşturduğumuz ağ kartlarını pfSense'e tanıtıyoruz. Görselde görebileceğiniz üzere sistem, aktif olan 3 adet ağ kartını (em0, em1, em2) otomatik olarak algılamış durumda.

![](/blogs/img/soc-lab-1-pfsense/pfsense_10.png)

Bu ekranda ilk olarak WAN arayüzünü seçmemiz isteniyor:

* Seçimimiz: em0 (Görselde seçili olan ilk kart).

Neden em0? VirtualBox ayarlarında "Adapter 1" olarak NAT modunda tanımladığımız ve internete çıkışımızı sağlayacak olan kart budur.

MAC adreslerini kontrol ederek (08:00:27... ile başlayan adresler) VirtualBox'taki sıralamayla eşleştiğinden emin olduktan sonra OK diyerek devam ediyoruz.

---

### 6.4)

WAN arayüzü olarak em0 kartını belirledikten sonra, bu hattın çalışma modunu konfigüre ediyoruz.

![](/blogs/img/soc-lab-1-pfsense/pfsense_11.png)

Bu ekranda dikkat etmemiz gereken noktalar:

* Interface Mode: DHCP (client). Sanal makinemiz internet erişimini VirtualBox'ın NAT servisinden alacağı için IP adresini otomatik olarak çekmesi en sorunsuz yöntemdir.

* VLAN Settings: Herhangi bir VLAN yapılandırması yapmıyoruz (Disabled).

* Use local resolver: Varsayılan değerde (false) bırakıyoruz.

Her şey görseldeki gibi görünüyorsa "Continue" seçeneği üzerindeyken OK diyerek bir sonraki aşamaya geçiyoruz.

---

### 6.5) 

WAN yapılandırmasını bitirir bitirmez sistem bizden LAN arayüzünü seçmemizi istiyor. Bu, laboratuvarımızın iç ağ trafiğini yönetecek olan bacak olacak.

![](/blogs/img/soc-lab-1-pfsense/pfsense_12.png)

Buradaki seçimimiz:

* Seçimimiz: em1 (Görseldeki listeden ikinci aktif kartı seçiyoruz).

* Neden em1? VirtualBox ayarlarında "Adapter 2" olarak SOC-LAN ismiyle tanımladığımız kart budur.

Önemli: Eğer bu aşamada yanlış kartı seçerseniz, daha sonra iç ağdaki makineler internete çıkamaz veya firewall arayüzüne erişemezsiniz. Bu yüzden VirtualBox'taki sıralamayı (em0=WAN, em1=LAN) takip etmek en sağlıklısıdır.

---

### 6.6)

LAN arayüzü (em1) için çalışma modunu ve IP dağıtım (DHCP) ayarlarını bu ekranda yapıyoruz.

![](/blogs/img/soc-lab-1-pfsense/pfsense_13.png)

Buradaki ayarların ne anlama geldiğine bakalım:

* Interface Mode: STATIC. LAN bacağı genellikle sabit bir IP adresine sahip olur.

* IP Address: 192.168.1.1/24. pfSense'in bu ağdaki kendi adresi ve aynı zamanda kurban makinelerin varsayılan ağ geçidi (Gateway) adresi olacaktır.

* DHCPD Enabled: true. İç ağa bağlayacağımız makinelerin otomatik olarak IP alabilmesi için DHCP sunucusunu aktif ediyoruz.

* DHCP Range: 192.168.1.100 - 192.168.1.199 Makinelerimize bu aralıkta IP dağıtılacak.

"Continue" diyerek bu ayarları onaylıyoruz. pfSense artık iç ağdaki cihazlara kimlik dağıtmaya ve onları yönetmeye hazır.

---

### 6.7)

WAN ve LAN ayarlarını tamamladıktan sonra, pfSense bize yaptığımız eşleştirmelerin son bir özetini sunar. Bu ekran, her şeyin doğru segmentlere bağlandığından emin olduğumuz "check-point" noktasıdır.

![](/blogs/img/soc-lab-1-pfsense/pfsense_14.png)

Ekranda görüldüğü üzere:

* WAN -> em0: İnternet çıkışımız.

* LAN -> em1: Güvenli iç ağımız (SOC-LAN).

Burada "Continue" seçeneğini belirleyerek ilerliyoruz. Eğer bu listede bir yanlışlık görseydik, "Assign/Configure" diyerek kartları tekrar eşleştirmemiz gerekecekti. Bizim senaryomuzda VirtualBox sıralamasıyla tam uyumlu ilerlediğimiz için doğrudan kuruluma devam edebiliriz.

---

### 6.8)

Kuruluma devam ederken karşımıza bir abonelik doğrulama ekranı çıkıyor. pfSense, kurumsal destekli "Plus" versiyonunu önerse de biz tamamen açık kaynaklı ve ücretsiz olan topluluk sürümüyle ilerleyeceğiz.

![](/blogs/img/soc-lab-1-pfsense/pfsense_15.png)

Bu ekranda:

* Alt kısımda bulunan seçeneklerden [ Install CE ] seçeneğini belirliyoruz.

* Enter tuşuna basarak ücretsiz Community Edition kurulumunu onaylıyoruz.

---

### 6.9)

Kurulumun bu aşamasında pfSense, diski nasıl yapılandıracağımızı soruyor. Modern sistemlerde performans ve veri güvenliği açısından ZFS yapısı önerilir.

![](/blogs/img/soc-lab-1-pfsense/pfsense_16.png)

Bu ekrandaki ayarlarımız:

* File System: ZFS (recommended default). ZFS, özellikle elektrik kesintisi gibi durumlarda dosya bütünlüğünü koruma konusunda UFS'ye göre çok daha başarılıdır.

* Partition Scheme: GPT (compatible with MBR). Modern sanallaştırma ortamları için en uyumlu şemadır.

Varsayılan ayarlarda herhangi bir değişiklik yapmadan "Continue" seçeneği üzerindeyken OK diyoruz. Bu adımdan sonra pfSense dosyaları diske kopyalamaya başlayacak.

---

### 6.10)

ZFS dosya sistemini onayladıktan sonra, pfSense bizden disk havuzu için bir yapılandırma seçmemizi istiyor.

![](/blogs/img/soc-lab-1-pfsense/pfsense_17.png)

Bu ekranda karşımıza çıkan seçeneklerin en başında yer alan "stripe" modunu seçiyoruz:

* stripe - No Redundancy: Biz şu an sanal bir ortamda tek bir disk (VirtualBox VDI) kullandığımız için herhangi bir yedeklilik (mirroring/RAID) yapmamıza gerek yok. Bu seçenek, mevcut tek diskimizi en yüksek performansla kullanmamızı sağlar.

OK butonuna basarak bu adımı geçiyoruz.

---

### 6.11)

ZFS yapılandırmasını tamamladıktan sonra sistem, pfSense yazılımının hangi diske kurulacağını seçmemizi istiyor.

![](/blogs/img/soc-lab-1-pfsense/pfsense_18.png)

Bu ekranda:

* Disk Listesi: Sanal makinemizi oluştururken ayırdığımız 20 GB'lık alan ada0 (VBOX HARDDISK) olarak karşımıza çıkıyor.

* Seçim: Boşluk (Space) tuşuna basarak diski [X] şeklinde işaretliyoruz.

* Onay: Ardından OK diyerek devam ediyoruz.

---

Dikkat: Bu adımdan sonra sistem seçili diskteki tüm verilerin silineceğine dair bir uyarı veriyor.
Sanal bir disk kullandığımız için "Yes" diyerek gönül rahatlığıyla devam edebiliriz.

![](/blogs/img/soc-lab-1-pfsense/pfsense_19.png)

---

### 6.12)

Disk yapılandırmasını tamamladıktan sonra, pfSense CE (Community Edition) içinde hangi spesifik sürümü kuracağımızı seçiyoruz.

![](/blogs/img/soc-lab-1-pfsense/pfsense_20.png)

Burada yapmamız gereken:

* Listedeki en üstte yer alan "Current Stable Version (2.8.1)" (veya o anki en güncel sürüm hangisiyse) seçeneğini belirliyoruz.

* OK butonuna basarak kurulum işlemini nihayete erdiriyoruz.

#### Neden Güncel Sürüm?
Güvenlik odaklı bir laboratuvar kurduğumuz için firewall yazılımının en güncel yamalara ve özelliklere sahip olması kritik önem taşır. Güncel sürüm, en yeni tehditlere karşı daha iyi koruma ve daha stabil bir performans sunar.

---

Tüm konfigürasyon adımlarını tamamladıktan sonra pfSense, çekirdek dosyaları ve gerekli yazılım paketlerini diske yazmaya başlar.

![](/blogs/img/soc-lab-1-pfsense/pfsense_21.png)

Bu aşamada sistem şunları gerçekleştirir:

* Sürüm Doğrulaması: Seçtiğimiz 2.8.1 kararlı sürümünün kurulumu teyit edilir.

* Ağ Ayarlarının Aktarımı: Kurulum sihirbazında belirlediğimiz WAN ve LAN ayarları yeni sisteme ihraç edilir.

* ZFS Havuzunun Oluşturulması: Belirlediğimiz disk üzerinde dosya sistemi inşa edilir.

* Paket Yönetimi: Temel pfSense paketleri (pkg) indirilerek kurulur.

---

![](/blogs/img/soc-lab-1-pfsense/pfsense_22.png)


Ekranda gördüğümüz "pfSense Post Installation setup .. done" ifadesi, yazılımsal kurulumun hatasız bittiği anlamına gelir. Artık sistemimiz bir firewall olarak uyanmaya hazır.

Burada yapmamız gereken tek şey:

* Alt kısımdaki < OK > butonuna basarak sihirbazdan çıkmak.

---

Ve nihayet beklediğimiz ekran! pfSense kurulumu saniyeler içinde tamamlandı ve karşımıza "Installation of pfSense complete!" uyarısı geldi.

![](/blogs/img/soc-lab-1-pfsense/pfsense_23.png)

Bu aşamada karşımızda iki seçenek var:

* Shell: Kurulumdan sonra terminale düşüp manuel bir komut çalıştırmak isterseniz kullanılır. Bizim şu aşamada buna ihtiyacımız yok.

* Reboot: Kurulum medyasını (ISO) devreden çıkarıp, işletim sistemini kurduğumuz disk üzerinden başlatmamızı sağlar.

#### [Reboot] butonuna bastıktan sonra VirtualBox ayarlarından ISO dosyasını çıkarmayı unutmayın. Aksi takdirde makine tekrar kurulum ekranına dönecektir. 

Reboot komutunu verdikten sonra pfSense ilk kez boot edilecek ve bizi menüsü karşılayacak.

---

Sistem başarıyla boot edildiğinde bizi pfSense’in kontrol merkezi karşılıyor. Bu ekran, firewall'a fiziksel (veya sanallaştırma üzerinden) bağlı olduğumuzda her türlü acil müdahaleyi yapabileceğimiz yerdir.

![](/blogs/img/soc-lab-1-pfsense/pfsense_25.png)

Mevcut Durumumuz:

* WAN (wan) -> em0: 10.0.2.15/24 IP'sini VirtualBox'tan almış. Yani internet erişimimiz tamam!

* LAN (lan) -> em1: 192.168.1.1/24 adresinde sabitlenmiş. İç ağımızın kapısı burası.

Görselde fark edebileceğiniz üzere sadece 2 arayüz listelenmiş durumda. Kurulum sırasında atladığımız 3. ağ kartımızı (em2) daha sonra kali linux kurarken sisteme dahil edeceğiz.

---

Artık çalışan, internete çıkan ve iç ağa hükmeden bir firewall cihazımız var.

#### Bundan sonraki adımda, tarayıcımız üzerinden pfSense'in web arayüzüne girip kuralları yazmaya başlayacağız.
