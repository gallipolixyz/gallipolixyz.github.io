# SOC Lab Rehberi Bölüm 6: Wazuh Dashboard ve İlk Agent Kurulumu

Kurulum asistanının işini bitirmesiyle birlikte, Wazuh sunucumuz artık ağ üzerinden hizmet vermeye hazır.

## 1) Wazuh Dashboard'a İlk Giriş

Tarayıcımızı açıp belirlediğimiz statik IP adresine https://192.168.1.20 (ubuntuya hangi ip adresini verdiyseniz onu yazmanız lazım) gittiğimizde bizi giriş ekranı karşılıyor.

* Sertifika uyarısı alırsanız "Gelişmiş" diyerek devam edin, bu beklenen bir durumdur.

![](/blogs/img/soc-lab-6-wazuh/wazuh_2.png)

1) Kullanıcı Bilgileri: Giriş yapmak için bir önceki adımda kurulum terminalinde size özel olarak üretilen User: admin ve ona karşılık gelen benzersiz şifreyi kullanıyoruz.

2) Arayüz: Giriş yaptıktan sonra Wazuh bizi sistem sağlık kontrollerinden geçirecek ve ardından bizi tehditleri, olayları ve ajan durumlarını izleyebileceğimiz ana yönetim paneline yönlendirecektir.

---

## 2) Wazuh Genel Bakış ve Ajan Ekleme Hazırlığı

Sisteme giriş yaptığımızda bizi karşılayan bu panel, ağımızın güvenlik durumunu anlık olarak özetler. Ancak şu an için sistemimiz "sessiz" modda; çünkü verilerini toplayıp analiz edeceği uç noktalara (endpoint) henüz bağlanmadı.

![](/blogs/img/soc-lab-6-wazuh/wazuh_4.png)

### Arayüzdeki Temel Bölümler:

* Agent İstatistikleri: Üst kısımda toplam, aktif ve bağlantısı kesilmiş ajanların sayısını görebilirsiniz. Şu an hepsi sıfır olduğu için sistem bizi bir ajan eklemeye davet ediyor.

* Security Information Management: Bu bölüm altında güvenlik olaylarını (Security events) ve dosya bütünlük takiplerini (Integrity monitoring) yönetebilirsiniz.

* Auditing and Policy Monitoring: Sistem denetimleri, politika izleme ve güvenlik yapılandırma değerlendirmeleri bu panel üzerinden takip edilir.

* Ajan Ekleme (Add agent): Görselde farenin üzerinde olduğu "Add agent" butonu, Windows 11 veya DC gibi makinelerimizi bu merkeze bağlayacağımız sihirbazı başlatır.

## 3) Windows Server İçin Agent Yapılandırması

Wazuh Dashboard üzerinden "Add agent" butonuna tıkladığımızda karşımıza çıkan sihirbazı, Windows Server 2022 makinemize göre özelleştiriyoruz.

![](/blogs/img/soc-lab-6-wazuh/wazuhm.png)

### Yapılandırma Adımları:

1) İşletim Sistemi Seçimi (Görsel 1): Kurulum yapacağımız platform Windows olduğu için "WINDOWS" paketini seçiyoruz. Alt kısımdaki "MSI 32/64 bits" seçeneği, sunucu işletim sistemimizle tam uyumlu çalışacaktır.

2) Server Adresi Tanımlama (Görsel 2): Agent'ın verileri nereye göndereceğini bilmesi gerekir. Buraya Wazuh sunucumuzun statik IP adresi olan 192.168.1.20 değerini giriyoruz. Bu sayede agent, pfSense üzerinden geçerek direkt olarak merkezi yöneticiye raporlama yapabilecek.

3) Agent İsimlendirme (Görsel 3): Panelde karışıklık yaşamamak için cihazımıza benzersiz bir isim veriyoruz. "Assign an agent name" kısmına winServer yazarak ilerliyoruz. Alt kısımdaki grup seçeneğini şimdilik "Default" olarak bırakıyoruz.

---

## 4) Ajan Kurulum ve Başlatma Komutları

![](/blogs/img/soc-lab-6-wazuh/wazuhm_2.png)

Wazuh Dashboard'un bizim için oluşturduğu bu PowerShell komutları, ajanı indirmekten konfigüre etmeye kadar tüm süreci tek seferde halleder.

---

Hazırladığımız konfigürasyon komutlarını Windows Server makinemizde PowerShell’i yönetici yetkileriyle açarak uyguluyoruz. Bu işlem, sunucumuzu bir "uç nokta" (endpoint) olarak SIEM sistemimize bağlayan son teknik adımdır.

![](/blogs/img/soc-lab-6-wazuh/wazuhm_3.png)

### Uygulama Adımları ve Çıktılar:

1) Kurulumun Başlatılması (Görsel 1): Komutu yapıştırdığımızda PowerShell, Invoke-WebRequest ile Wazuh paketini indirmeye başlar. Görselde gördüğümüz "Writing web request" ve yazılan byte miktarı, dosyanın başarıyla çekildiğini ve kurulumun arka planda (/q parametresiyle sessizce) başladığını doğrular.

2) Servisin Tetiklenmesi (Görsel 2): Kurulum biter bitmez NET START WazuhSvc komutunu çalıştırıyoruz. Ekranda beliren "The Wazuh service was started successfully" mesajı, ajanın artık sunucu üzerinde bir servis olarak çalıştığını ve merkezdeki Wazuh Manager ile el sıkışmaya hazır olduğunu belirtir.

---

## 5) Bağlantı Teyidi ve İlk Log Akışı

Windows Server tarafındaki ajan kurulumunu bitirip Wazuh Dashboard ekranına döndüğümüzde, boş olan panelin artık anlamlı verilerle dolmaya başladığını görüyoruz. Bu, SOC laboratuvarımızın operasyonel hale geldiği andır.

![](/blogs/img/soc-lab-6-wazuh/wazuhm_4.png)

### Görsellerle Durum Analizi:

1) Aktif Ajan Teyidi (Görsel 1): Ana panelde daha önce sıfır olan "Total agents" ve "Active agents" sayısının 1'e yükseldiğini görüyoruz. Bu, manager ve agent arasındaki el sıkışmanın sorunsuz gerçekleştiğini gösterir.

2) Ajan Detayları (Görsel 2): Agents sekmesine girdiğimizde, winServer ismini verdiğimiz cihazın statik IP'si (192.168.1.10), işletim sistemi (Windows Server 2022) ve güncel versiyonuyla birlikte listede "Active" olarak yer aldığını teyit ediyoruz.

3) Güvenlik Olayları ve Loglar (Görsel 3): Belki de en heyecan verici ekran burası. "Security events" bölümüne geçtiğimizde, sunucudan gelen ilk logları görüyoruz. Görselde dikkat çeken detaylar:

* Logon/Logoff: Sunucu üzerindeki oturum açma ve kapama işlemleri anlık olarak düşmeye başlamış.

* Rule Level: Wazuh, gelen logları otomatik olarak seviyelendirmiş (Seviye 3: Bilgi amaçlı düşük riskli olaylar gibi).

* Rule Description: "Windows logon success" gibi net açıklamalarla sunucuda neler olup bittiğini artık terminale bakmadan, web arayüzünden izleyebiliyoruz.

---

### Sonuç

Laboratuvarımızın "merkezi beyin" kurulumunu ve ilk "uç nokta" bağlantısını başarıyla tamamladık. Artık winServer üzerinde yapılacak her türlü şüpheli işlem, brute-force denemesi veya sistem değişikliği Wazuh tarafından yakalanıp bize raporlanacak.

Artık elimizde izlenebilir, analiz edilebilir ve gerçek zamanlı tepki verebilir bir güvenlik altyapısı var.