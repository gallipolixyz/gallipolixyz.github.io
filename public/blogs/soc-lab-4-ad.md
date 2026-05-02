# SOC Lab Rehberi Bölüm 4: Active Directory

Bu bölümde, Windows Server 2022 makinesini bir Domain Controller yapısına dönüştürüyoruz.

### Neden bu aşama çok önemli?

* Merkezi Kimlik Yönetimi: Tüm kullanıcıları ve cihazları tek bir noktadan yönetmek, siber güvenlik politikalarını (GPO) merkezi olarak uygulamak için gereklidir.

* Saldırı Yüzeyi Oluşturma: Siber saldırganların genellikle ilk hedefi olan Active Directory yapısını simüle ederek, gerçekçi saldırı ve tespit senaryoları kurgulamamıza olanak tanır.

* Log Entegrasyonu: Domaine bağlı cihazlardan gelen logların merkezi olarak toplanması ve analiz edilmesi (SIEM süreçleri) için bu yapı şarttır.

---

## 1) Rol ve Özellik Ekleme Sihirbazını Başlatma

Active Directory kurulumunun ilk adımı, sunucumuza gerekli yetenekleri (rolleri) kazandırmaktır. Bunun için "Server Manager" panelini açıp sağ üst köşedeki Manage menüsünden Add Roles and Features seçeneğiyle ilerliyoruz.

Bu sihirbaz, sunucumuzu sadece bir dosya depolama birimi olmaktan çıkarıp ağın yöneticisi (Domain Controller) yapacak olan bileşenleri kurmamızı sağlayacak. Bu aşamada sunucunun statik bir IP adresine sahip olduğundan ve isminin doğru yapılandırıldığından emin olmak, ileride yaşanabilecek DNS sorunlarının önüne geçecektir.

![](/blogs/img/soc-lab-4-ad/domain_1.png)

---

![](/blogs/img/soc-lab-4-ad/domainm_1.png)


Sihirbazı başlattıktan sonra bizi karşılayan bu ilk üç ekran, kurulumun hangi sunucuya ve hangi yöntemle yapılacağını netleştirdiğimiz "hazırlık" evresidir.

### Süreç Analizi:

1) Before You Begin (Görsel 1): Bu ekran bir formalite gibi görünse de aslında kritik bir hatırlatıcıdır. Microsoft burada bize; yönetici (Administrator) şifresinin güçlü olduğunu, IP adresinin statik olarak yapılandırıldığını ve en güncel güvenlik güncellemelerinin yüklendiğini teyit etmemizi söyler. "Next" diyerek devam ediyoruz.

2) Installation Type (Görsel 2): Karşımıza iki seçenek çıkıyor. Bizim tercihimiz "Role-based or feature-based installation" olacak. Bu seçenek, Active Directory gibi tek bir sunucuya özel roller eklemek istediğimizde kullandığımız standart yöntemdir.

3) Server Selection (Görsel 3): İşte burası en kritik nokta! Kurulumu yapacağımız sunucuyu seçiyoruz. Listede sunucumuzun ismini ve daha önce sabitlediğimiz IP adresini gördüğümüzden emin olmalıyız.

---

## 2) Active Directory Rolünün Atanması ve Kurulumu

Bu aşamada, Windows Server'ın sadece bir işletim sistemi olmaktan çıkıp bir Domain Controller olması için gerekli olan "Active Directory Domain Services" (AD DS) rolünü etkinleştiriyoruz.

![](/blogs/img/soc-lab-4-ad/domainm_2.png)

### Kurulum Detayları:

1) Gerekli Özelliklerin Onaylanması (Görsel 1): "Active Directory Domain Services" rolünü seçtiğimizde, Windows otomatik olarak bu rolün düzgün çalışması için gereken yönetim araçlarını ve PowerShell modüllerini de listeler. Burada "Add Features" butonuna tıklayarak bu yardımcı araçların da kurulmasını onaylıyoruz.

2) Rol Seçimi (Görsel 2): Sunucu rolleri listesinden Active Directory Domain Services kutucuğunun işaretli olduğunu teyit ediyoruz. Bu rol, ağdaki objeleri (kullanıcılar, bilgisayarlar vb.) depolayacak ve kimlik doğrulama işlemlerini yönetecek olan ana servistir.

3) Yükleme Onayı (Görsel 3): Son aşamada, kurulacak olan tüm bileşenlerin (AD DS, Group Policy Management, Uzaktan Yönetim Araçları) bir özetini görüyoruz. Her şeyin doğru olduğunu kontrol ettikten sonra "Install" butonuna basarak kurulum işlemini başlatıyoruz.

---

Yükleme çubuğu doldu ve Active Directory Domain Services (AD DS) rolü başarıyla sunucumuza eklendi.

![](/blogs/img/soc-lab-4-ad/domain_8.png)

---

## 3) Sunucuyu Domain Controller Seviyesine Terfi Ettirme

Yazılım kurulumu bittikten sonra, sunucumuzun ağın yöneticisi olması için yapılandırma sihirbazını başlatıyoruz.

![](/blogs/img/soc-lab-4-ad/domainm_3.png)

### Yapılandırma Adımları:

1) Sihirbazı Başlatma (Görsel 1): Server Manager üzerindeki bildirim bayrağına tıklayarak "Promote this server to a domain controller" seçeneğini seçiyoruz. Bu, Active Directory yapılandırma sihirbazını devreye sokar.

2) Yeni Bir Forest Oluşturma (Görsel 2): İlk defa bir etki alanı kurduğumuz için "Add a new forest" seçeneğiyle ilerliyoruz. Root domain ismi olarak laboratuvarımıza özel lab.local (veya sizin belirlediğiniz bir isim) tanımlamasını yapıyoruz.

3) Domain Controller Seçenekleri ve DSRM (Görsel 3):

* Functional Level: Geriye dönük uyumluluk ve stabilite için "Windows Server 2016" seviyesinde bırakabiliriz.

* Kabiliyetler: Makinemizin aynı zamanda bir DNS Server ve Global Catalog (GC) olmasını sağlıyoruz.

* DSRM Şifresi: Herhangi bir felaket durumunda (Dizin Servisleri Geri Yükleme Modu) kullanılacak kritik bir şifre belirliyoruz. Bu şifreyi not etmeyi unutmayın; çünkü standart yönetici şifresinden bağımsızdır.

Domain ismimizi ve şifrelerimizi belirledikten sonra, sistemin ağ üzerinde nasıl tanınacağını ve verilerin nereye kaydedileceğini doğruluyoruz.

![](/blogs/img/soc-lab-4-ad/domainm_4.png)

### Adım Adım Detaylar:

1) DNS Seçenekleri (Görsel 1): Bu ekranda "Create DNS delegation" seçeneğinin pasif olduğunu görebilirsiniz. Üstte yer alan sarı uyarı mesajı, mevcut bir DNS hiyerarşisi (parent zone) bulunmadığı için normaldir; yeni bir orman kurduğumuz için bu adımı "Next" diyerek güvenle geçiyoruz.

2) Additional Options (Görsel 2): Burada sistem, etki alanı ismimize göre otomatik olarak bir NetBIOS domain name atar. Görselde ismimizin LAB olarak belirlendiğini görüyoruz. Bu isim, eski sistemlerle uyumluluk ve ağ üzerindeki kısa isimle erişim için kullanılacaktır.

3) Paths (Görsel 3): Active Directory veri tabanının (NTDS), log dosyalarının ve sistem biriminin (SYSVOL) kaydedileceği klasörleri onaylıyoruz. Varsayılan olarak tüm yollar C:\Windows\ altında toplanır. Laboratuvar ortamında bu varsayılan yolları değiştirmeden devam etmek en sağlıklı yaklaşımdır.

---

Artık tüm taşlar yerine oturdu. Kuruluma başlamadan önce son bir kez yaptığımız ayarları gözden geçiriyor ve Windows Server'ın bu ağır yükü kaldırmaya hazır olup olmadığını test ediyoruz.

![](/blogs/img/soc-lab-4-ad/domainm_5.png)

### Sürecin Tamamlanması:

1) Review Options (Görsel 1): Bu ekranda, şu ana kadar yaptığımız tüm seçimlerin bir özetini görüyoruz. Yeni domain ismimizin "lab.local", NetBIOS adımızın "LAB" ve fonksiyonel seviyemizin "Windows Server 2016" olduğu burada teyit ediliyor. Eğer ileride benzer bir kurulumu otomatize etmek isterseniz, alttaki "View Script" butonuyla bu ayarları bir PowerShell betiği olarak dışa aktarabilirsiniz.

2) Prerequisites Check (Görsel 2): Windows, kurulumu başlatmadan önce sistemin gereksinimleri karşılayıp karşılamadığını kontrol eder. En üstteki yeşil onay kutucuğu ve "All prerequisite checks passed successfully" mesajı, kurulumun önünde hiçbir engel kalmadığını gösterir.

* Kurulumu Başlatma: Alttaki "Install" butonuna tıkladığımızda, sunucumuz resmi olarak bir Domain Controller'a dönüşmeye başlar. İşlem bittiğinde sunucu otomatik olarak yeniden başlatılacak ve artık laboratuvarımızın merkezi yönetim otoritesi olarak ayağa kalkacaktır.

---

Kurulum sonrası otomatik olarak yeniden başlayan sunucumuzda, oturum açma ekranının artık değiştiğini göreceksiniz. Bu, Windows Server'ın başarıyla bir Domain Controller'a dönüştüğünün en somut kanıtıdır.

![](/blogs/img/soc-lab-4-ad/domainm_5.png)

### Oturum Açma Süreci:

![](/blogs/img/soc-lab-4-ad/domainm_6.png)


1) Ctrl+Alt+Delete (Görsel 1): Sanal makine üzerinde çalıştığımız için, fiziksel klavyenizdeki bu tuş kombinasyonu kendi bilgisayarınızı etkileyebilir. Bu nedenle VirtualBox menüsünden Input > Keyboard > Insert Ctrl-Alt-Del yolunu izleyerek sanal makineye giriş sinyalini gönderiyoruz.

2) Domain Admin Girişi (Görsel 2): Dikkat ederseniz kullanıcı adı kısmında artık sadece "Administrator" yazmıyor; belirlediğimiz NetBIOS ismiyle birlikte LAB\Administrator ibaresi yer alıyor. Bu, artık yerel kullanıcı veritabanını değil, Active Directory veritabanını kullanarak oturum açtığımız anlamına gelir.

---

# Windows 11 İstemcisini Domaine Dahil Etme (Domain Join)

Windows Server'da oluşturduğumuz lab.local dünyasına giriş yapmak için Windows 11 makinemizin "Workgroup" (İş Grubu) yapısından çıkıp bir "Domain" üyesi olması gerekiyor.

![](/blogs/img/soc-lab-4-ad/domainm_7.png)

İzlenmesi Gereken Adımlar:

1) Gelişmiş Sistem Ayarları (Görsel 1): Windows 11 Ayarlar menüsünden "About" (Hakkında) kısmına geliyoruz. Burada alt tarafta bulunan "Advanced system settings" bağlantısına tıklayarak klasik sistem özellikleri penceresini açıyoruz.

2) Değişikliği Başlatma (Görsel 2): "Computer Name" sekmesinde makinemizin mevcut adını ve "WORKGROUP" üyesi olduğunu görüyoruz. Sağ alt kısımdaki "Change..." butonuna tıklayarak üyelik ayarlarını düzenleme moduna geçiyoruz.

3) Domain Bilgisini Girme (Görsel 3): "Member of" bölümünde "Workgroup" seçeneğini "Domain" olarak değiştiriyoruz. Hemen altındaki kutucuğa, Windows Server'da belirlediğimiz lab.local ismini yazıyoruz ve "OK" butonuna basıyoruz.

---

Gerekli bilgileri girdikten sonra, Windows 11 makinemizin lab.local etki alanına kabul edildiği ve sistemin bu köklü değişikliği uygulamak için hazırlık yaptığı sürece geliyoruz.

![](/blogs/img/soc-lab-4-ad/domainm_8.png)

1) Kimlik Doğrulama (Görsel 1): Bir bilgisayarı domaine eklemek yetkisiz kişilerin yapabileceği bir işlem değildir. Bu nedenle karşımıza çıkan ekranda, etki alanında cihaz ekleme yetkisi olan Administrator hesabının kullanıcı adını ve şifresini giriyoruz.

2) Hoş Geldiniz Mesajı (Görsel 2): Kimlik bilgileri doğrulandığında, "Welcome to the lab.local domain" mesajı bizi karşılıyor. Bu mesaj, makinenin artık bir Workgroup bilgisayarı değil, merkezi olarak yönetilen bir istemci olduğunu teyit eder.

3) Yeniden Başlatma Uyarısı (Görsel 3): Değişikliklerin sistem çekirdeğine işlenmesi ve ağ ayarlarının güncellenmesi için işletim sistemi bir yeniden başlatma talep eder. "You must restart your computer to apply these changes" uyarısına "OK" diyerek makinemizi yeniden başlatıyoruz.

---

## İlk Domain Oturumu ve Ağ Doğrulaması

Domaine katılım sonrası ilk açılışta, Windows 11 artık yerel bir makine gibi değil, soc.lab (veya lab.local) hiyerarşisinin bir üyesi olarak karşımıza çıkıyor.

![](/blogs/img/soc-lab-4-ad/domainm_9.png)

### Doğrulama Süreci:

1) Domain Kullanıcısı ile Giriş (Görsel 1): Oturum açma ekranında artık domain üzerinde oluşturduğumuz kullanıcıları görebiliriz. Burada giriş yaparak, Active Directory üzerinden gelen yetkilerin bu istemci makinede geçerli olup olmadığını test ediyoruz.

2) IP ve DNS Doğrulaması (Görsel 2): Sisteme giriş yaptıktan sonra ilk işimiz bir komut satırı (CMD) açıp ipconfig komutunu çalıştırmak olmalı. Görselde gördüğümüz kritik detaylar laboratuvarın başarısını kanıtlıyor:

* Connection-specific DNS Suffix: Makinenin soc.lab domainine bağlı olduğunu görüyoruz.

* IPv4 Address: Makinemiz planda olduğu gibi 192.168.1.100 adresini almış.

* Default Gateway: Trafiğin, laboratuvarın koruyucu kapısı olan pfSense üzerinden (192.168.1.1) aktığını teyit ediyoruz.

---

## Active Directory Üzerinde İstemci Doğrulaması

Windows 11 makinemizi etki alanına dahil ettikten sonra, bu cihazın Active Directory veritabanına kaydedilip kaydedilmediğini kontrol etmek laboratuvarın bütünlüğü açısından son derece önemlidir. Bu adım, sunucunun artık istemciyi tanıdığını ve ona merkezi politikalar uygulayabileceğini gösterir.

![](/blogs/img/soc-lab-4-ad/domain_27.png)

### Kontrol Adımları:

1) Active Directory Users and Computers (ADUC): Sunucumuzda "Tools" menüsünden bu yönetim panelini açıyoruz.

2) Computers Konteyneri: Sol taraftaki ağaç yapısında lab.local altına gidip "Computers" klasörüne tıkladığımızda, az önce domaine dahil ettiğimiz Windows 11 makinesini (Görselde DESKTOP-L9JD126) listede görüyoruz.

#### Merkezi Yönetim Hazır: Cihazın burada görünmesi; artık bu bilgisayar için özel Group Policy nesneleri oluşturabileceğimiz, uzaktan yazılım yükleyebileceğimiz veya güvenlik denetimlerini (auditing) başlatabileceğimiz anlamına geliyor.