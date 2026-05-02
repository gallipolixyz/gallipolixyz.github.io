# SOC Lab Rehberi Bölüm 5: Ubuntu Server Üzerine Wazuh Kurulumu

Bu bölümde, laboratuvarımızdaki tüm olayları (loglar, dosya bütünlüğü, zafiyetler) tek bir merkezden izlememizi sağlayacak olan Wazuh platformunu kuruyoruz. Windows Server ve Windows 11 makinelerimizden gelecek olan tüm güvenlik verileri bu merkezde toplanacak, analiz edilecek ve anlamlı alarmlara dönüştürülecektir.

### Neden Ubuntu ve Wazuh?

* Merkezi Görünürlük: Ağdaki tüm uç noktaların (endpoints) saniyelik hareketlerini izlememize olanak tanır.

* Zafiyet Analizi: Cihazlardaki eksik yamaları ve zayıf yapılandırmaları otomatik olarak tespit eder.

* Olay Müdahalesi: Tehdit tespit edildiğinde otomatik tepkiler (Active Response) tetiklememizi sağlar.

---

## 1) Ubuntu 22.04 LTS ISO Dosyasını İndirme

Wazuh kurulumu için performans ve güvenlik açısından en uyumlu platformlardan biri olan Ubuntu 22.04 LTS (Jammy Jellyfish) sürümünü tercih ediyoruz. "LTS" (Long Term Support) takısı, bu sürümün uzun yıllar boyunca güvenlik güncellemeleri alacağını ve laboratuvar ortamımız için kararlı bir yapı sunacağını garanti eder.

* Resmi Kaynak: Kurulum medyasını her zaman Ubuntu'nun resmi web sitesinden indirmeye özen gösteriyoruz.

* Versiyon Seçimi: Sunucu kaynaklarını idareli kullanmak ve sadece ihtiyacımız olan servisleri çalıştırmak için "Desktop" yerine "Ubuntu Server" imajını indiriyoruz.

## 2) Sanal Makine Oluşturma

ISO dosyasını hazırladığımıza göre, sanal makinemizin iskeletini oluşturmaya başlayabiliriz.

![](/blogs/img/soc-lab-5-ubuntu-wazuh/ubuntu/ubuntu_1.png)

VirtualBox arayüzünde "New" butonuna basarak Wazuh sunucumuz için yeni bir sanal makine oluşturuyoruz.

### Yapılandırma Detayları:

1) VM Name: Karışıklığı önlemek için makineye "ubuntuServer" ismini veriyoruz.

2) ISO Image: İndirdiğimiz ubuntu-22.04.5-live-server-amd64.iso dosyasını bu kısımdan sisteme gösteriyoruz. VirtualBox, seçtiğimiz ISO sayesinde işletim sistemi türünü (Linux) ve versiyonunu (Ubuntu 64-bit) otomatik olarak algılıyor.

3) Unattended Installation: Bu seçeneği işaretlemeden ilerliyoruz. Kurulum adımlarını, özellikle ağ ve disk yapılandırmasını manuel olarak yaparak laboratuvar ortamımıza tam hakimiyet sağlamayı hedefliyoruz.

---

## 3) Donanım Kaynaklarının Belirlenmesi

Wazuh, merkezi bir SIEM (Security Information and Event Management) çözümü olarak çalıştığı için verileri hızlı işleyebilmek adına yeterli belleğe ve işlem gücüne ihtiyaç duyar. Sanal makinemizin "Hardware" sekmesinde bu kaynakları belirliyoruz.

![](/blogs/img/soc-lab-5-ubuntu-wazuh/ubuntu/ubuntu_2.png)

### Donanım Yapılandırması:

1) Base Memory (RAM): Wazuh Manager ve Indexer bileşenlerinin rahat çalışabilmesi için RAM miktarını 6144 MB (6 GB) olarak ayarlıyoruz. 4 GB altına düşmek, özellikle indeksleme sırasında sistemde donmalara neden olabilir.

2) Processors (CPU): Veri paketlerini analiz ederken işlemcinin darboğaz yapmaması için 2 CPU çekirdeği tahsis ediyoruz. Bu, arka plandaki arama ve kural eşleştirme süreçlerini hızlandıracaktır.

3) EFI Desteği: "Use EFI" seçeneğini boş bırakarak standart BIOS kurulumuyla devam ediyoruz.

* Önemli Not: Eğer ana makinenizin (Host) toplam RAM miktarı kısıtlıysa, bu değeri en az 4096 MB (4 GB) seviyesinde tutmaya çalışın. Bellek yetersizliği, Wazuh Dashboard'un açılmamasına veya logların geç işlenmesine yol açabilir.

---

## 4) Sanal Disk Oluşturma

Wazuh, ağınızdaki cihazlardan gelen verileri analiz etmekle kalmaz, aynı zamanda bu verileri ileride geriye dönük inceleme yapabilmeniz için depolar. Bu nedenle, Ubuntu sunucumuz için ayıracağımız disk alanı, laboratuvarın kullanım ömrünü belirleyen unsurlardan biri olacaktır.

![](/blogs/img/soc-lab-5-ubuntu-wazuh/ubuntu/ubuntu_3.png)

### Disk Yapılandırma Detayları:

1) Create a New Virtual Hard Disk: Yeni bir kurulum yaptığımız için sıfırdan bir sanal disk oluşturuyoruz.

2) Disk Size: SIEM sistemleri veri biriktirdikçe disk alanını hızla doldurabilir. Bu sebeple, güvenli bir alan sağlamak adına disk boyutunu 50 GB olarak belirliyoruz. Bu kapasite, laboratuvar ortamındaki birkaç cihazın loglarını uzun süre saklamak için yeterli olacaktır.

3) Hard Disk File Type: Varsayılan VDI (VirtualBox Disk Image) formatında bırakıyoruz.

4) Dinamik Tahsis: "Pre-allocate Full Size" kutucuğunu işaretlemiyoruz. Böylece 50 GB'lık alan ana makinenizin diskinden hemen eksilmez; Ubuntu içerisine veri yazıldıkça dosya boyutu kademeli olarak artar.

---

## 5) Ubuntu Server Kurulumu

Sanal makineyi başlattığımızda, bağladığımız ISO dosyası üzerinden kurulum medyası yüklenmeye başlar. Bu bölümde karşımıza çıkan ilk pencereler, kurulumun gidişatını belirleyecektir.

![](/blogs/img/soc-lab-5-ubuntu-wazuh/ubuntu/ubuntum_1.png)

### Kurulum Adımları:

1) GNU GRUB Menüsü (Görsel 1): Makine açıldığında karşımıza gelen ilk ekrandır. Burada en üstteki "Try or Install Ubuntu Server" seçeneği üzerinde Enter tuşuna basarak kurulumu resmen başlatıyoruz.

2) Dil Seçimi (Görsel 2): Kurulum arayüzünde kullanmak istediğimiz dili seçiyoruz. Genellikle dokümantasyon ve hata takibi kolaylığı açısından "English" seçeneğiyle ilerlemek, siber güvenlik laboratuvarlarında bir standarttır.

3) Installer Güncellemesi (Görsel 3): Kurulum sihirbazı internete erişebiliyorsa, kendisi için bir güncelleme olup olmadığını denetler. Mevcut sürümle stabil bir şekilde devam etmek ve zaman kazanmak adına "Continue without updating" seçeneğini işaretleyerek mevcut yükleyici ile yolumuza devam ediyoruz.

---

İşletim sisteminin dili kadar, sunucu başında veya terminalde komut yazarken sorun yaşamamak için klavye düzenini doğru seçmek de oldukça önemlidir.

![](/blogs/img/soc-lab-5-ubuntu-wazuh/ubuntu/ubuntum_2.png)

### Yapılandırma Adımları:

1) Klavye Yapılandırması (Görsel 1): Varsayılan olarak "English (US)" düzeni gelir. Seçiminizi yaptıktan sonra "Done" ile ilerliyoruz.

2) Kurulum Tipi (Görsel 2): Burada karşımıza iki ana seçenek çıkıyor:

* Ubuntu Server: Sunucu yönetimi için gerekli olan temel araçların ve paketlerin dahil olduğu standart kurulumdur. Wazuh gibi kapsamlı bir SIEM platformu kuracağımız için ihtiyacımız olan bağımlılıkların hazır gelmesi adına bu seçeneği (X) işaretli bırakıyoruz.

* Ubuntu Server (minimized): İnsan müdahalesinin beklenmediği, çok küçük boyutlu çalışma ortamları içindir. Bizim senaryomuz için uygun değildir.

* Third-party Drivers: Özel donanım sürücülerine ihtiyacımız olmadığı için bu kutucuğu boş bırakıp "Done" diyerek devam ediyoruz.

 ---

 ## Statik IP Yapılandırması ve Ağ Ayarları

 Bir SIEM sunucusu, ağdaki diğer tüm cihazlardan (agent'lardan) veri toplayacağı için IP adresinin değişmemesi hayati önem taşır. Bu nedenle, Ubuntu kurulumunda otomatik IP (DHCP) yerine manuel (Statik) yapılandırmayı tercih ediyoruz.

 ![](/blogs/img/soc-lab-5-ubuntu-wazuh/ubuntu/ubuntum_3.png)

### Adım Adım Ağ Yapılandırması:

1) IPv4 Düzenleme (Görsel 1): Ağ arayüzümüzün (enp0s3) üzerine gelip "Edit IPv4" seçeneğine tıklıyoruz. Varsayılan olarak gelen DHCP seçeneğini "Manual" olarak değiştirerek kendi değerlerimizi girmeye hazır hale geliyoruz.

2) Manuel Bilgilerin Girilmesi (Görsel 2): Laboratuvar planımıza uygun olarak şu bilgileri tanımlıyoruz:

* Subnet: 192.168.1.0/24 (Ağ maskemiz).

* Address: 192.168.1.20 (Wazuh sunucumuza ayırdığımız özel IP).

* Gateway: 192.168.1.1 (Trafiği yönlendiren pfSense adresimiz).

* Name Servers: 8.8.8.8, 8.8.4.4 (İnternet erişimi ve paket indirmeleri için Google DNS'leri).

Doğrulama (Görsel 3): Ayarları kaydettiğimizde, arayüz tipinin "static" olarak güncellendiğini ve belirlediğimiz 192.168.1.20 adresinin atandığını görüyoruz. Artık sunucumuz ağda sabit bir adrese sahip.

---

### Kaynak Yönetimi ve Depolama Yapılandırması

İnternet erişimimizi statik IP ile sağladıktan sonra, Ubuntu'nun ihtiyaç duyacağı paketleri nereden çekeceğini ve 50 GB'lık disk alanımızı nasıl kullanacağını netleştiriyoruz.

 ![](/blogs/img/soc-lab-5-ubuntu-wazuh/ubuntu/ubuntum_4.png)

### Sürecin Detayları:

1) Proxy Ayarları (Görsel 1): Laboratuvar ortamımızda internete çıkış için özel bir ara sunucu (proxy) kullanmadığımızdan, bu alanı boş bırakarak doğrudan "Done" diyoruz. Trafiğimiz direkt pfSense üzerinden akacak.

2) Mirror Adresi (Görsel 2): Ubuntu, paketleri indirmek için varsayılan olarak konuma en yakın sunucuyu seçer. Görselde görüldüğü üzere sistem testi geçmiş ve paket listelerini başarıyla okumuş durumda. Bu, internet bağlantımızın sorunsuz çalıştığının bir başka kanıtıdır.

3) Depolama Düzeni (Görsel 3): Diski yapılandırırken işleri karmaşıklaştırmadan "Use an entire disk" seçeneğiyle ilerliyoruz. "Set up this disk as an LVM group" seçeneğinin işaretli olması kritiktir; LVM (Logical Volume Management) sayesinde ileride disk alanımız yetmezse kolayca genişletme yapabiliriz. Şifreleme (encryption) ihtiyacımız olmadığı için o kısmı boş bırakıp "Done" ile süreci onaylıyoruz.

---

Ubuntu kurulumunun bu aşamasında, sunucunun ana yöneticisini tanımlıyor ve ileride makineye terminal üzerinden rahatça bağlanabilmek için gerekli kapıları açıyoruz.

 ![](/blogs/img/soc-lab-5-ubuntu-wazuh/ubuntu/ubuntum_5.png)

### Yapılandırma Detayları:

1) Profil Bilgileri (Görsel 1): Sunucumuza giriş yapmak için kullanacağımız ana hesabı oluşturuyoruz. Burada basitlik olması adına kullanıcı adını ve sunucu ismini "ubuntu" olarak belirliyoruz. Güçlü bir şifre seçmek, laboratuvar ortamı olsa bile güvenlik alışkanlığı kazanmak açısından önemlidir.

2) Ubuntu Pro (Görsel 2): Canonical'ın sunduğu Ubuntu Pro aboneliği için bir teklif ekranı karşımıza çıkıyor. Mevcut laboratuvar senaryomuzda bu ek özelliklere ihtiyacımız olmadığı için "Skip for now" seçeneğiyle bu adımı geçiyoruz.

3) SSH Yapılandırması (Görsel 3): Kurulumun en kullanışlı adımlarından biri burası. Sunucumuza sanal makine ekranı yerine kendi bilgisayarımızdaki bir terminalden (Termius, Putty veya PowerShell gibi) bağlanabilmek için "Install OpenSSH server" seçeneğini işaretliyoruz. Bu, ileride komutları kopyalayıp yapıştırırken bize büyük kolaylık sağlayacak.

---

Artık yapılandırma tarafında yapacak bir işlemimiz kalmadı. Bu son adımlarda Ubuntu, çekirdek dosyalarını diske kopyalarken bize ek popüler servisleri kurmak isteyip istemediğimizi soruyor.

 ![](/blogs/img/soc-lab-5-ubuntu-wazuh/ubuntu/ubuntum_6.png)

### Kurulumun Tamamlanması:

1) Featured Server Snaps (Görsel 1): Bu ekran, Docker, AWS CLI veya Prometheus gibi sık kullanılan araçları tek tıkla kurmanıza olanak tanır. Ancak biz tertemiz ve optimize bir sistem istediğimiz için, ayrıca Wazuh kendi bağımlılıklarını kendisi yöneteceği için buradaki hiçbir seçeneği işaretlemiyoruz. Direkt "Done" diyerek geçiyoruz.

2) Sistem Kurulumu (Görsel 2): "Installing system" ekranında Ubuntu; disk bölümlendirme, dosya sistemini oluşturma ve paketleri internetten çekip kurma işlemlerini başlatır. Görselde gördüğümüz loglar, sistemin her şeyi plana uygun şekilde yerleştirdiğini gösteriyor. Bu işlem, internet hızınıza ve disk performansınıza bağlı olarak birkaç dakika sürebilir.

* Kurulum bittiğinde altta "Reboot Now" seçeneği belirecek. Makineyi yeniden başlattığımızda siyah ekranda Ubuntu login satırını göreceğiz.

---

## İlk Giriş

Kurulum sonrası sistem yeniden başladı ve bizi siyah terminal ekranı karşıladı. Belirlediğimiz kullanıcı bilgileriyle sisteme giriş yaptığımızda, Ubuntu bizi sistemin sağlık durumunu özetleyen bir karşılama mesajıyla selamlıyor.

 ![](/blogs/img/soc-lab-5-ubuntu-wazuh/ubuntu/ubuntu_4.png)

 ---

 # 6) Wazuh Kurulumu Öncesi Sistem Güncellemesi ve Yetkilendirme

Wazuh gibi kapsamlı bir güvenlik platformunu kurmaya başlamadan önce, sunucunun tüm paketlerinin güncel olduğundan ve gerekli yönetici izinlerine sahip olduğumuzdan emin olmalıyız.

 ![](/blogs/img/soc-lab-5-ubuntu-wazuh/ubuntu/ubuntu_5.png)

### İzlenen Adımlar:

1) Root Yetkisi Alma: İşlemleri kesintisiz yürütebilmek için sudo su komutuyla root kullanıcısına geçiş yapıyoruz. Bu, kurulum sırasında karşımıza çıkabilecek izin engellerini ortadan kaldırır.

2) Depo Güncelleme: sudo apt update komutuyla Ubuntu'nun paket depolarını kontrol ederek en güncel yazılım listelerini çekiyoruz.

3) Tam Sistem Yükseltmesi: sudo apt upgrade -y komutunu kullanarak, işletim sistemi üzerindeki tüm mevcut paketleri en son sürümlerine yükseltiyoruz. -y parametresi, tüm onay sorularını otomatik olarak "evet" şeklinde yanıtlamamızı sağlar.

---

Sistem güncellemeleri (upgrade) tamamlanırken, Ubuntu bazı servislerin hala eski kütüphane dosyalarını kullandığını fark eder. Sistemin kararlılığını korumak ve güvenlik yamalarının tam anlamıyla devreye girmesini sağlamak için bu servislerin yeniden başlatılması gerekir.

 ![](/blogs/img/soc-lab-5-ubuntu-wazuh/ubuntu/ubuntu_6.png)

### Bu Ekranda Ne Yapıyoruz?

1) Otomatik Seçim: Ubuntu genellikle güncellenmiş kütüphanelere bağlı olan servisleri (ssh.service, polkit.service vb.) bizim için otomatik olarak işaretler.

2) Onay ve Geçiş: Listelenen servislerin yeniden başlatılmasında bir sakınca yoktur. Tab tuşunu kullanarak  seçeneği üzerine geliyor ve Enter ile işlemi onaylıyoruz.

3) Kesintisiz Bağlantı: SSH servisi yeniden başlatılsa bile mevcut terminal bağlantınız genellikle kopmaz; ancak bir sonraki bağlantıda yeni kütüphaneler aktif olacaktır.

Bu adımı da geçtiğimize göre, artık sunucumuz Wazuh kurulumu için %100 güncel ve hazır durumda.

---

## 7) Wazuh Kurulumu

Ubuntu sunucumuzu hazırladıktan sonra, Wazuh'un resmi kurulum asistanını kullanıyoruz:

curl -sO https://packages.wazuh.com/4.7/wazuh-install.sh && sudo bash wazuh-install.sh -a

komutu ile wazuhun tüm bileşenlerini (Indexer, Server ve Dashboard) sırasıyla kuruyoruz.

 ![](/blogs/img/soc-lab-5-ubuntu-wazuh/wazuh/wazuh_1.png)

### Kurulum Sonrası Kritik Bilgiler:

Ekranın en altında yer alan "User" ve "Password" bilgileri, web arayüzüne ilk girişte kullanacağımız anahtarlardır. Bunu bir kenara not etmek veya görseli güvenli bir yerde saklamak çok önemlidir çünkü bu bilgiler her kurulumda rastgele ve benzersiz olarak üretilir.

Daha sonra istersek parolamızı wazuh web arayüzünden veya terminal üzerinden değiştirebiliriz.

---