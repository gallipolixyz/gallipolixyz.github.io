# GELENEKSELDEN MODERNE C2 ALTYAPILARI VE OPNSENSE İLE TRAFİK ANALİZİ

![command&control ](/blogs/img/opnsense-trafik-analiz/image1.webp)

## **C2 Mantığı ve İşleyişi**

Siber güvenlik operasyonlarında, özellikle sızma testlerinde veya hedef odaklı saldırılarda, sisteme ilk sızma aşaması işin sadece başlangıcıdır. Bir sisteme sızdıktan sonra içeride kalıcı olmak, sistem komutlarını uzaktan çalıştırabilmek ve elde edilen verileri dışarıya güvenli bir şekilde aktarabilmek gerekir. İşte bu noktada devreye offensive güvenliğin kalbi sayılan C2 (Command and Control — Komuta Kontrol) altyapıları girer.

## **C2 Nedir?**

En basit tanımıyla C2; bir siber saldırganın hedef ağa sızdırdığı zararlı yazılımları uzaktan yönetmek, onlara yeni görevler vermek ve kurban makinelerden gelen verileri toplamak için kullandığı merkezi sunucu ve yönetim altyapısıdır.

Bu sistemi gözümüzde daha iyi canlandırabilmek için bir “Kukla Ustası” benzetmesi yapabiliriz:

Kukla Ustası (Saldırgan): Sahnenin arkasında oturan, ne yapılacağına karar veren kişidir (Lab ortamımızdaki Kali Linux).
İpler (C2 İletişim Kanalı): Kukla ile usta arasındaki komutların gidip geldiği gizli ağ bağlantılarıdır.
Kukla (Ajan / Beacon): Hedef bilgisayara sızdırılmış olan ve arka planda sessizce ustanın emirlerini bekleyen küçük zararlı yazılım kodudur.
Siber saldırıların bu mimaride, MITRE ATT&CK matrisine göre 16'dan fazla farklı komuta-kontrol tekniği bulunmaktadır. Saldırgan sisteme sızdıktan sonra kendi yerleştirdiği C2 sunucusuna komutlar göndererek o sistemde veri çalma, iç ağda yayılma gibi kritik işlemleri gerçekleştirebilir.

## **C2 İletişimleri Nasıl Çalışır?**

Sızılan sistemler ile C2 sunucuları arasındaki iletişim genellikle Beaconing modeli üzerine kuruludur.

İşaretleme (Beacon) Nedir? Ağın her düğümünün düzenli aralıklarla diğer düğümlere sinyaller veya “işaretler” göndererek kendisi hakkında bilgi vermesidir.

Virüs bulaşmış cihaz, bir insanın kısa mesajlarını kontrol etmesi gibi, önceden belirlenmiş zaman aralıklarıyla düzenli olarak C2 sunucusuyla iletişim kurar. Bu sayede saldırgan:

Kötü amaçlı yazılıma yeni talimatlar göndebilir,
Ek zararlı araçlar ve scriptler indirebilir,
Mağdurun ağından çalınan hassas verileri toplayabilir,
Hedeflenen ortamdaki anlık değişikliklere hızla yanıt verebilir.
Geleneksel Bağlantıların Aksine: Reverse Mantık

C2 mimarisinin firewalları aşmasındaki en büyük sır, bağlantının yönündedir. Geleneksel yöntemlerde dışarıdaki bir bilgisayar içerideki bir bilgisayara bağlanmaya çalışır; buna Inbound (Giriş) trafik denir. Ancak kurumsal güvenlik duvarları, dışarıdan içeriye gelen bu tarz tanınmayan bağlantı isteklerini varsayılan olarak anında engeller.

C2 altyapıları ise bu engeli Outbound (İçeriden Dışarıya) bağlantı mimarisiyle aşar:

Saldırgan hedef sisteme bir şekilde örneğin bir oltalama e-postası veya zafiyet sömürüsü ile küçük bir C2 ajanı bırakır.
Bu ajan, dışarıdan komut beklemek yerine, kendisi içeriden dışarıya doğru tetiklenerek saldırganın kontrolündeki C2 sunucusuna gider ve kapıyı çalar: “Ben geldim, çalıştırılacak yeni bir komut var mı?”
Güvenlik duvarları genellikle iç ağdaki kullanıcıların internete çıkışına izin verdiği için, bu tersine bağlantı mantığı kurumsal güvenlik önlemlerini kolayca atlatabilir.

## **Gelenekselden Moderne: C2 İletişim Yöntemlerinin Evrimi**

Siber savunma teknolojileri geliştikçe, saldırganların komuta kontrol merkezleriyle kurdukları iletişim kanalları da evrimleşmek zorunda kalmıştır. Bugün bir C2 trafiğini analiz ederken karşımıza iki ana dönem çıkar: Geleneksel ağ protokolleri ve modern web hizmetleri istismarı.

## **Geleneksel Yöntemler ve Defans Tarafının Çözümleri**

İlk nesil C2 altyapılarında zararlı yazılımlar, dış dünyadaki statik bir IP adresine veya belirli bir Domaine doğrudan bağlanmaya çalışırdı.

HTTP/HTTPS Protokolü: En yaygın yöntemlerden biridir. Kurban makineden dışarıdaki saldırgan sunucusuna düzenli olarak HTTP GET/POST istekleri gönderir.
DNS Tünelleme: İç ağ tamamen dış dünyaya kapatılsa bile DNS sorgularına genellikle izin verilir. Saldırganlar, şifreli komutları subdomain sorgularının içine gizleyerek iç ağdaki DNS sunucusu üzerinden dışarıya sızdırır.
Savunma Tarafı Bunu Nasıl Yakaladı? Siber güvenlik ekipleri ve modern Firewall mimarileri bu geleneksel yöntemleri engellemekte artık oldukça başarılı. Tehdit istihbaratı beslemeleri sayesinde bilinen kötü amaçlı C2 IP’leri ve domainleri anında bloklanıyor. Ayrıca ağ trafiğindeki olağan dışı DNS sorguları veya sürekli aynı IP’ye giden şüpheli paketler SOC analistlerinin radarına takılıyor.

## **Modern Yöntem: Güvenilir Sitelerin Arkasına Saklanma (Living off the Trusted Sites)**

Geleneksel yöntemlerin kolayca yakalanması, modern saldırganları çok daha sinsi bir yönteme itti: Meşru ve güvenilir web servislerini C2 sunucusu gibi kullanmak.

Kurumsal ağlarda veya kişisel laboratuvarlarda kullanıcılar iş yapabilsin, haberleşebilsin diye bazı küresel platformlara asla kısıtlama getirilmez. Firewalllar bu siteleri otomatik olarak güvenli listeye alır. Saldırganlar da sıfırdan şüpheli bir C2 sunucusu kurmak yerine, trafiği bu platformların arkasına gizler:

GitHub / GitLab İstismarı: Saldırgan public bir repository açar ve içine komut.txt gibi basit bir dosya yükler. Kurban makineye sızan zararlı yazılım, dışarıdaki bilinmeyen bir hacker IP’sine gitmek yerine direkt github.com adresine yasal bir curl veya wget isteği atar. Dosyadaki komutu okur, çalıştırır ve antivirüslere veya firewall loglarına yakalanmaz.
Sosyal Medya (Twitter/X — Facebook): Gelişmiş tehdit aktörleri (örneğin MITRE ATT&CK T1102 referansındaki APT29 grubu), Twitter hesapları üzerinden şifreli tweetler atar veya görsellerin içine steganografi ile komut gizler. Zararlı yazılım sadece Twitter’daki bir profili ziyaret ediyormuş gibi görünürken aslında komuta merkezinden emir alıyordur.
Mesajlaşma ve Bulut Platformları (Telegram, Discord, Slack, Google Drive): Özellikle veri sızdırma aşamasında çok popülerdir. Kurban makineden çalınan şifreler veya ekran görüntüleri, direkt olarak Telegram API’leri üzerinden saldırganın kendi chat ekranına bir bot aracılığıyla mesaj olarak gönderilir. Güvenlik duvarı yöneticisi ise loglara baktığında sadece bir kullanıcının meşru Telegram uygulamasını kullandığını sanır.
3. Uygulamalı Lab: Telegram API Kullanarak Veri Sızdırma Simülasyonu

Peki saldırganlar Telegram API botlarını kullanarak verileri dış dünyaya nasıl sızdırıyor? Bu bölümde, laboratuvar ortamında geliştirdiğimiz bir Python betiği ile bu yöntemin teknik mantığını inceleyeceğiz.

## **Yöntemin Teknik Mantığı**

Bot Oluşturma: Telegram üzerinde @BotFather aracılığıyla ücretsiz bir Telegram botu ve benzersiz bir API Token üretilir.
Veri Toplama: Kurban makinede çalışan betik; sistem bilgileri, şifreler veya hassas dosyaları tarar.
HTTP İstekleri: Python’ın meşru requests veya python-telegram-bot kütüphaneleri kullanılır.
Veri Gönderimi: Toplanan veriler sendMessage veya sendDocument API uç noktalarına POST isteği olarak iletilir.
Trafik Maskeleme: Tüm iletişim api.telegram.org üzerinden TLS şifreli olarak geçtiği için trafik tamamen yasal görünür.
Adım 1: Telegram Botunun Hazırlanması

İlk olarak Telegram’da BotFather kullanılarak teknikmakale_bot adında bir bot oluşturulmuş ve HTTP API bağlantısı için gerekli Token değeri elde edilmiştir.

Ardından, botun tetiklenebilmesi ve aktif hale gelmesi için /start komutu gönderilmiş, tarayıcı üzerinden getUpdates uç noktası kontrol edilerek chat_id ve iletişim kanalı doğrulanmıştır.

![bot](/blogs/img/opnsense-trafik-analiz/image2.jpg)
![api_yanıt](/blogs/img/opnsense-trafik-analiz/image3.webp)

## Adım 2: Python C2 Simülasyon Kodunun Yazılması

![simülasyon_kodu](/blogs/img/opnsense-trafik-analiz/image4.png)

## Adım 3: Scriptin Çalıştırılması ve C2 İletişimi

Hazırlanan c2_simulation.py scripti Kali Linux yüklü kurban makinede koşturulduğunda, OPNsense Firewall üzerinden geçerek Telegram sunucularına başarıyla ulaşmış ve saldırganın chat ekranına sızdırılan veriyi anlık olarak düşürmüştür.

![kod](/blogs/img/opnsense-trafik-analiz/image5.webp)

![gelen_yanıt](/blogs/img/opnsense-trafik-analiz/image6.jpg)

Saldırı başarıyla gerçekleşti. Peki defans tarafında bu sinsi trafiği ağ seviyesinde nasıl yakalayabiliriz? Bu aşamada laboratuvar ortamımızın koruyucusu olan OPNsense devreye giriyor.

## OPNsense Üzerinde Paket Yakalama (Packet Capture)

OPNsense arayüzünde Interfaces -> Diagnostics -> Packet Capture adımları takip edilerek, iç ağımızın bağlı olduğu em1 [LAN] arayüzü üzerinde bir paket yakalama işlemi başlatılmıştır.

Script çalıştırıldığı esnada yakalanan trafik durdurulmuş ve analiz edilmek üzere .pcap formatında dışarı aktarılmıştır.

![packet_capture](/blogs/img/opnsense-trafik-analiz/image7.webp)

![ınterfaces_ayarları](/blogs/img/opnsense-trafik-analiz/image8.webp)

## Wireshark ile Derinlemesine Trafik Analizi

![analiz](/blogs/img/opnsense-trafik-analiz/image9.jpg)

 A. DNS Sorgularının İncelenmesi

İndirilen pcap dosyası Wireshark ile açılıp filtre çubuğuna dns yazıldığında, iç ağdaki kurban makinenin (10.10.10.11), OPNsense LAN ağ geçidine (10.10.10.1) yoğun bir şekilde Standard query A api.telegram.org sorguları gönderdiği açıkça tespit edilmiştir.


![dns_dosyaları](/blogs/img/image10.png)

eknik Değerlendirme: Bu durum, iç ağdaki bir sürecin dış dünyadaki meşru Telegram API sunucularıyla bir iletişim kanalı kurmaya çalıştığının ağ seviyesindeki ilk somut kanıtıdır. Trafiğin devamında dönen Standard query response paketleri incelendiğinde, DNS çözümlemesinin başarıyla tamamlandığı ve varsayılan ayarlardaki firewall’un bu sorguyu meşru bir internet trafiği kabul ederek engellemediği görülmüştür.

B. TLS/Şifreli Trafik ve SNI Analizi

Filtre çubuğuna tls yazarak bağlantının şifreli akışını incelediğimizde, Client Hello paketinin içerisinde yer alan SNI (Server Name Indication) alanında açıkça api.telegram.org ibaresi görülmektedir.

![tls_sorguları](/blogs/img/opnsense-trafik-analiz/image11.png)

Trafik TLS 1.3 ile şifrelendiği için paketlerin içeriği (yani sızdırılan sistem bilgileri veya token değerleri) ağ üzerinden açık metin olarak okunamamaktadır. Ancak bir uç noktanın durup dururken harici bir API sunucusuna Application Data paketleri göndermesi, anomalinin tespit edilmesi adına yeterli bir girdidir.

Modern C2 altyapıları meşru servisleri kullandığı için sadece imza tabanlı (Antivirüs) çözümlerle engellenmesi oldukça zordur. Güvenlik Operasyon Merkezleri ve ağ yöneticileri bu tür sızıntıları önlemek için şu stratejileri uygulamalıdır:

## **Tespit Etme Yöntemleri**

Sıra Dışı Ağ Bağlantıları: Kritik sunucuların (örneğin veri tabanları veya domain controller) durup dururken sosyal medya veya mesajlaşma (Telegram, Discord vb.) IP adreslerine bağlanmaya çalışması bir alarm üretmelidir.
DNS Sorgu Anomalileri: Ağ loglarında aniden beliren yoğun ve periyodik api.telegram.org veya github.com sorguları (Beaconing belirtisi) izlenmelidir.
Süreç İzleme (Process Monitoring): Uç noktalarda (Endpoint) bilinmeyen veya imzasız bir Python betiğinin/arka plan sürecinin dış ağa veri açtığı EDR çözümleriyle tespit edilmelidir.
Veri Hacmi Analizi: Meşru platformlar üzerinden normalin dışında büyük boyutlu veya sürekli tekrarlayan dosya transferlerinin (Data Exfiltration) yapılması takip edilmelidir.

## **Korunma ve Engelleme Stratejileri**

Giden Trafiği Kısıtlayın (Egress Filtering): Sunucuların internete çıkışını sadece gerçekten gerekli olan port, protokol ve hedef IP’lerle sınırlandırın. İnternete çıkması gerekmeyen bir veri tabanı sunucusunun dış dünyaya tamamen kapatılması hayati önem taşır.
Uygulama İzin Listesi (Whitelisting): Sunucu ve kritik altyapılarda yetkisiz scriptlerin (Python, PowerShell vb.) veya bilinmeyen binary dosyalarının çalışmasını kesin olarak engelleyin.
Gelişmiş Uç Nokta Koruması (EDR): Şüpheli süreçleri ve bunların ağ aktivitelerini korele ederek otomatik olarak izole edebilen yeni nesil EDR çözümleri kullanın.
Kategori Bazlı Engelleme (URL Filtering): Kurumsal ağ altyapılarında veya Firewall mimarilerinde (OPNsense/pfSense dahil), iş ortağı veya iş gereksinimi olmayan sosyal medya, anlık mesajlaşma (Telegram, Discord) ve kişisel bulut depolama alan adlarını kategori bazlı olarak tamamen engelleyin.






