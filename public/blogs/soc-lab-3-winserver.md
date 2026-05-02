# SOC Lab Rehberi Bölüm 2: Windows Server

Bu bölümde, pfSense’in koruması altındaki iç ağımızda (LAN) konumlanacak olan laboratuvarın merkezi yönetim otoritesini, yani Windows Server 2022'yi kuruyoruz. Windows 11 makinemizin de dahil olacağı bu yapı, bize gerçekçi bir kurumsal ağ ortamında saldırı analizi ve güvenlik denetimi yapma imkanı sağlayacak.

### Neden Windows Server kuruyoruz?

1) Merkezi Yönetim: Active Directory ile kullanıcıları ve cihazları tek bir noktadan yönetmek için.

2) Gerçekçi Senaryolar: Siber saldırıların ana hedefi olan Domain yapısını simüle etmek için.

3) Log Kaynağı: Kurumsal güvenlik olaylarını (Event Logs) detaylıca inceleyebileceğimiz zengin bir veri kaynağı oluşturmak için.

---

## 1) Windows Server 2022 ISO Dosyasını İndirme

Laboratuvarımıza başlamadan önce, Microsoft'un sunduğu 180 günlük ücretsiz deneme sürümünü (Evaluation) kullanarak yola çıkıyoruz. Bu sürüm, tüm kurumsal özellikleri test etmemize olanak tanıdığı için SOC laboratuvarı için biçilmiş kaftandır.

### Nasıl İndirilir?

1) Microsoft Evaluation Center’a Giriş: İlk olarak Microsoft’un resmi indirme sitesine gidiyoruz.

2) Sürüm Seçimi: Windows Server 2022 başlığı altındaki "Download the ISO" seçeneğini işaretliyoruz.

3) Kayıt Formu: Microsoft, indirme işlemine başlamadan önce ad, soyad ve e-posta gibi temel bilgileri içeren kısa bir form doldurmanızı isteyecektir. Bilgileri doldurup "Download now" butonuna basıyoruz.

4) Dil ve Mimari: Karşımıza çıkan ekranda dil olarak genellikle en geniş kaynak havuzuna sahip olan English ve mimari olarak 64-bit edition seçeneğini seçerek .iso uzantılı dosyamızı indirmeye başlıyoruz.

Not: İndirdiğiniz dosyanın boyutu yaklaşık 5 GB civarında olacaktır. İndirme işlemi tamamlandığında, bu dosyayı güvenli bir klasöre (Örn: C:\ISO_Depo) taşımanızı öneririm; çünkü sanal makine kurulumunda bu yolu göstereceğiz.

---

## 2) Sanal Makine Oluşturma

Sanallaştırma platformumuzda Windows Server 2022 için yeni bir yuva oluşturarak başlıyoruz. Bu aşamada en önemli nokta, sistemin hem performanslı hem de kararlı çalışması için doğru parametreleri seçmektir.

![](/blogs/img/soc-lab-3-winserver/win_sv_1.png)

### Yapılandırma Detayları:

1) VM Name: Karmaşayı önlemek adına makinemize windows_server ismini veriyoruz.

2) ISO Image: Microsoft'un resmi sitesinden indirdiğimiz Windows Server 2022 Standard Evaluation (Desktop Experience) dosyasını sisteme tanıtıyoruz. Burada "Desktop Experience" seçimi kritiktir; çünkü siber güvenlik analizlerimizde grafik arayüzüne ihtiyaç duyacağız.

3) OS Version: VirtualBox’ın optimizasyonları doğru yapabilmesi için versiyonun otomatik olarak Windows Server 2022 (64-bit) seçildiğinden emin oluyoruz.

4) Önemli İpucu: Görselde alt tarafta yer alan "Proceed with Unattended Installation" seçeneğini boş bırakıyoruz. Kurulumun her adımını (dil, klavye, bölge ve şifreleme ayarları) manuel olarak kontrol etmek, laboratuvarın siber güvenlik gereksinimlerini (örneğin özel bir şifreleme veya disk bölümleme) kendimiz belirlemek adına daha güvenli bir yaklaşımdır.

---

## 3) Donanım Kaynaklarının Belirlenmesi

Bir sunucu işletim sistemi, standart bir kullanıcı bilgisayarına göre daha fazla kaynağa ihtiyaç duyar. Özellikle Active Directory, DNS ve ilerleyen aşamalarda ekleyeceğimiz diğer rolleri düşündüğümüzde, makinemizi "darboğaz" yaşatmayacak şekilde yapılandırmalıyız.

![](/blogs/img/soc-lab-3-winserver/win_sv_2.png)

### Donanım Tercihlerimiz:

1) Base Memory (RAM): Sunucumuza 4096 MB (4 GB) RAM ayırıyoruz. Windows Server 2022 için minimum gereksinim daha düşük olsa da, akıcı bir arayüz deneyimi ve aynı anda birden fazla servisin çalışabilmesi için 4 GB ideal bir başlangıç noktasıdır.

2) Processors (CPU): İşlemci gücü olarak 2 CPU tanımlıyoruz. Sunucu üzerindeki işlemlerin (kullanıcı yönetimi, log işleme vb.) daha hızlı sonuçlanması için çift çekirdekli bir yapı kurmak mantıklıdır.

3) EFI Desteği: Altta yer alan "Use EFI" kutucuğunu boş bırakıyoruz. pfSense ile uyumluluk ve standart lab kurulumu için BIOS tabanlı önyükleme yöntemiyle devam edeceğiz.

---

## 4) Sanal Disk Oluşturma

Sunucumuzun işletim sistemi dosyaları ve ileride birikecek log verileri için yeterli ve esnek bir depolama alanı ayırmamız gerekiyor.

![](/blogs/img/soc-lab-3-winserver/win_sv_3.png)

1) Disk Boyutu: Windows Server 2022 için 50 GB'lık bir alan tanımlıyoruz. Bu miktar, hem işletim sistemi hem de temel güvenlik araçları için yeterli bir alandır.

2) Disk Türü: VirtualBox'ın standart formatı olan VDI (VirtualBox Disk Image) seçeneğiyle devam ediyoruz. "Pre-allocate Full Size" seçeneğini işaretlemeyerek diskin sadece içindeki veri kadar yer kaplamasını (dinamik genişleme) sağlıyoruz.

---

## 5) Ağ Kartının Yapılandırılması

Windows Server'ın sadece pfSense üzerinden dış dünyaya erişebilmesi ve diğer laboratuvar makineleriyle güvenli bir şekilde konuşabilmesi için ağ kartını doğru yapılandırmalıyız. Bu adım, laboratuvarın sızma testleri veya zararlı yazılım analizleri sırasında ana makinenize zarar gelmesini önleyen bir güvenlik duvarı görevi görür.

![](/blogs/img/soc-lab-3-winserver/win_sv_4.png)

### Yapılandırma Detayları:

1) Attached to (Bağlantı Türü): Makinemizi Internal Network (Dahili Ağ) moduna alıyoruz. Bu seçim, sunucunun ana makinenizin internetini doğrudan kullanmasını engeller ve trafiği sadece sanal ağ içine hapseder.

2) Name (Ağ Adı): Dahili ağımıza daha önce pfSense kurulumunda belirlediğimiz SOC-LAN ismini veriyoruz. Böylece Windows Server, pfSense'in LAN bacağına sanal bir kablo ile bağlanmış olur.

3) Adapter Type: Uyumluluk için varsayılan Intel PRO/1000 MT Desktop seçeneğini koruyoruz.

4) Promiscuous Mode: Bu ayarı Deny (Reddet) olarak bırakıyoruz. Bu, güvenlik odaklı bir laboratuvar için varsayılan ve doğru olan yaklaşımdır.

---

## 6) İşletim Sistemi Kurulumu

Windows Server 2022 kurulum sihirbazı bizi karşıladı. Burada yapacağımız seçimler, ileride sunucuyla nasıl etkileşime gireceğimizi belirleyecek.

![](/blogs/img/soc-lab-3-winserver/winsv1.png)

### Adım Adım Kurulum:

1) Dil ve Bölge Ayarları (Görsel 1): İlk ekranda kurulum dilini, zaman formatını ve klavye düzenini seçiyoruz. Laboratuvar ortamında teknik kaynaklara daha kolay ulaşmak adına genellikle English (United States) tercih edilse de, klavye düzeninizi kendi kullandığınız dile göre ayarlamayı unutmayın.

2) Versiyon Seçimi - En Kritik Nokta (Görsel 2): Karşımıza dört farklı seçenek çıkıyor. Bizim tercihimiz Windows Server 2022 Standard Evaluation (Desktop Experience) olmalı.

* Neden Desktop Experience? Eğer sadece "Standard Evaluation" seçerseniz, Windows sadece komut satırı (CLI) üzerinden açılır. Görsel bir arayüz ve fare kullanımı için mutlaka parantez içindeki "Desktop Experience" ibaresini seçmelisiniz.

4) Lisans Koşulları (Görsel 3): Klasik ama zorunlu bir adım. Microsoft'un sunduğu 180 günlük değerlendirme sürümü kullanım koşullarını kabul ederek "I accept the Microsoft Software License Terms" kutucuğunu işaretliyoruz ve "Next" diyerek devam ediyoruz.

---

Sanal donanımımızı tanımladıktan sonra işletim sisteminin dosyalarını nereye ve nasıl yazacağını belirliyoruz.

![](/blogs/img/soc-lab-3-winserver/winsv2.png)

### Adım Adım İlerleme:

1) Kurulum Türü Seçimi (Görsel 1): Temiz bir başlangıç için her zaman "Custom: Install Microsoft Server Operating System only (advanced)" seçeneğiyle ilerliyoruz. Bu seçenek, diski dilediğimiz gibi bölümlendirmemize ve eski kalıntılardan arınmış bir sistem kurmamıza olanak tanır.

2) Disk Bölümleme (Görsel 2): Karşımıza VirtualBox ayarlarında belirlediğimiz 50.0 GB'lık ayrılmamış alan çıkıyor. Burada ekstra bir bölümlendirme yapmamıza gerek yok; "Next" butonuna basarak Windows'un gerekli sistem bölümlerini otomatik oluşturmasını sağlıyoruz.

3) Yönetici (Administrator) Parolası (Görsel 3): Kurulum dosyaları kopyalanıp sistem yeniden başladıktan sonra bizi en önemli güvenlik adımı karşılıyor.

* Karmaşıklık Gereksinimi: Windows Server, basit şifreleri (örneğin 123456) güvenlik politikası gereği kabul etmez.

* Öneri: Büyük harf, küçük harf, rakam ve sembol içeren güçlü bir parola belirlemelisiniz. Parolanız karmaşıklık kriterlerini karşılamazsa görseldeki gibi sarı bir uyarı mesajı alırsınız; bu durumda daha güçlü bir kombinasyon denemeniz gerekir.

---

## 7) Sunucu Yapılandırması: Kimlik ve Ağ Ayarları

Windows Server kurulumu tamamlandığında sistem otomatik olarak karmaşık bir bilgisayar adı ve DHCP'den gelen dinamik bir IP adresiyle açılır. Bir etki alanı denetleyicisi (Domain Controller) kurmadan önce bu ayarları düzenli hale getirmeliyiz.

![](/blogs/img/soc-lab-3-winserver/win_sv_11.png)

### Yapılması Gerekenler:

### 1) Bilgisayar Adını Değiştirme:

Görselde görünen WIN-AVVHTHEAHLA gibi rastgele oluşturulmuş ismi, daha anlaşılır ve kurumsal bir isimle (örneğin DC-01 veya SOC-SERVER) değiştirmeliyiz. Bu, log analizleri sırasında hangi makinenin hangi işlemi yaptığını kolayca ayırt etmemizi sağlar.

![](/blogs/img/soc-lab-3-winserver/winsv4.png)

### 2) IP Adresi Sabitleme:

IP Adresi Sabitleme: Sunucumuz şu anda IP adresini pfSense üzerindeki DHCP sunucusundan alıyor. Bir sunucunun, özellikle de bir Domain Controller'ın IP adresi asla değişmemelidir. Bu seçeneğe tıklayarak ağ ayarları üzerinden sunucumuza statik bir IP adresi tanımlayacağız.

#### Neden Önemli?
* Active Directory kurulduğunda bu makine ağdaki diğer cihazlara rehberlik edecektir. Rehberin yerinin (IP adresinin) veya adının sürekli değişmesi, laboratuvarımızdaki tüm trafiğin ve güvenlik servislerinin aksamasına neden olur.

Bu adımları tamamladıktan sonra sunucumuzu bir kez yeniden başlatacağız ve ardından o beklediğimiz ana, Active Directory Domain Services rolünü yükleme aşamasına geçeceğiz.

---
