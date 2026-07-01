
### Every Beginner Should Know These 8 Tools for CTF

![opening]

CTF’e yeni başlayan birisi için her şey biraz karmaşık olabilir.

Bazen elinde anlamsız bir string olur. Bazen bir görsel dosyası verilir ve içinde ne araman gerektiğini veya nereye bakman gerektiğini bilemezsin. Bazen bir web sayfası açılır ama görünürde hiçbir şey yoktur. Bazen de sana bir IP adresi verilir ve sadece IP adresi ile uzun uzun bakışırsın.

Benim CTF çözme sürecinde fark ettiğim şey şu oldu: sadece komut ezberleyip tool kullanmak değil, zaman kaybettiren tuzaklara kanmayıp, doğru soruları sorarak doğru yolu bulmaktır.

Bazı temel sorular:
- Bir dosyanın metadata’sında ipucu olabilir mi?
- Verilen string encode edilmiş olabilir mi?
- Açık portlardan biri bana başlangıç noktası verebilir mi?
- Bir hash kırılabilir mi?
- Network trafiğinin içinde flag saklanmış olabilir mi?

Doğru soruları sormaya başladığında tool’lar sadece terminal komutları olmaktan çıkıyor. Problem çözme sürecinin bir parçası haline geliyor.

Bu yazıda, CTF’e yeni başlayan birinin bilmesi gerektiğini düşündüğüm 8 temel tool’dan bahsedeceğim. Amacım her tool’u uzman seviyesinde anlatmak değil; hangi durumda hangi tool’a bakabileceğimizi, tool’un flag’e giden yolda bize nasıl yardımcı olabileceğini sade bir şekilde göstermek.

Not: Bu yazıdaki örnekler yalnızca CTF, lab ve izinli test ortamları içindir. Gerçek sistemlerde izinsiz tarama, test veya saldırı denemesi yapmak etik değildir ve hukuki sonuçlar doğurabilir.



---

## CTF ve Flag Mantığı

CTF, “Capture The Flag” ifadesinin kısaltmasıdır. Siber güvenlik alanında pratik yapmak için kullanılan yarışma veya lab formatıdır. Amaç, bir sistemde, dosyada, web uygulamasında, network trafiğinde ya da şifrelenmiş bir verinin içinde saklanan flag’i bulmaktır.

Flag genelde şu formata benzeyen özel bir metindir:

```text
flag{example_flag}
HTB{example_flag}
picoCTF{example_flag}
CTF{example_flag}
```

CTF challenge’ları genelde web, crypto, forensics, reverse engineering, pwn, OSINT ve misc gibi kategorilere ayrılır. Başlangıç seviyesinde en çok karşılaşacağın şeylerden biri, “hangi kategoriye hangi tool ile yaklaşmalıyım?” sorusudur.

---

## 1. Nmap — Nereden Başlayacağını Gösteren Araç

### Ne işe yarar?

**Nmap**, hedef sistemde açık portları ve bu portlarda çalışan servisleri keşfetmek için kullanılan temel keşif araçlarından biridir.

Bir CTF makinesinde sana sadece bir IP adresi verildiyse, genellikle ilk soru şudur:

> Bu sistemde hangi servisler çalışıyor?

Nmap doğrudan flag’i vermez; fakat hangi yöne bakman gerektiğini gösteren bir harita çıkarır.

### Temel komut

```bash
nmap -sV -sC <CTF_IP>
```

### Önemli parametreler

| Parametre | Açıklama |
|---|---|
| `-sV` | Servis versiyonlarını tespit etmeye çalışır. Örneğin sadece http demek yerine Apache, nginx veya OpenSSH versiyonu gibi daha açıklayıcı bilgiler verebilir. |
| `-sC` | Nmap’in default script’lerini çalıştırır. Servisler hakkında ek bilgiler yakalamaya yardımcı olabilir. Beginner CTF’lerde genelde -sV ile birlikte kullanılır.|
| `-p-` | Tüm TCP portlarını tarar. CTF’lerde servisler bazen alışılmadık portlarda çalışabilir. Örneğin web uygulaması 80 yerine 8080, 8000 veya 3000 portunda olabilir.|
| `-Pn` | Hedef ping’e cevap vermese bile host’u ayakta kabul edip port taramasına geçer. Bazı CTF ortamlarında Nmap hedefi kapalı sanarsa işe yarayabilir. |
| `-sn` |Port taraması yapmadan ağdaki canlı hostları bulmaya çalışır. Yani “bu ağda hangi cihazlar ayakta?” sorusuna cevap arar.|
| `-oN` |  Tarama sonucunu normal formatta bir dosyaya kaydeder. CTF çözerken not almak için çok faydalıdır. |

### Örnekler

```bash
# Temel servis taraması
nmap -sV -sC <CTF_IP>

# Tüm TCP portlarını tarama
nmap -p- <CTF_IP>

# Belirli portlarda detaylı tarama
nmap -sV -sC -p 22,80,8080 <CTF_IP>
```

### Nasıl düşünmelisin?

- `80` veya `443` açıksa web uygulamasına bak.
- `21` açıksa FTP servisini değerlendir.
- `22` açıksa SSH için credential, private key veya parola ipucu araman gerekebilir.
- `8080`, `8000`, `3000` gibi portlar da web uygulaması barındırabilir.

---

## 2. ffuf — Gizli Sayfa ve Dizinleri Bulmak İçin

### Ne işe yarar?

Web CTF’lerinde gördüğün sayfa her zaman tüm uygulama değildir. Bazen flag doğrudan ana sayfada değil, gizli bir dizinde, unutulmuş bir backup dosyasında veya tahmin edilebilir bir endpoint’te saklanır.


Web CTF’lerinde ana sayfada her şey görünmeyebilir. Flag bazen şu tarz yollarda saklanabilir:

```text
/admin
/backup
/uploads
/dev
/hidden
/flag.txt
```
Bunları tek tek elle denemek büyük zaman kaybıdır. Bu iş için ffuf kullanabiliriz.



### Temel komut

```bash
ffuf -w wordlist.txt -u http://target.com/FUZZ
```

Buradaki `FUZZ`, wordlist’teki kelimelerin yerleştirileceği noktadır.

### Önemli parametreler

| Parametre | Açıklama |
|---|---|
| `-w` | Kullanılacak wordlist’i belirtir. |
| `-u` | Hedef URL’i belirtir. |
| `FUZZ` | Denenecek kelimelerin yerleştirileceği konumdur. |
| `-e` | Dosya uzantısı denemek için kullanılır. |
| `-mc` | Belirli HTTP status code’larını gösterir. |
| `-fc` | Belirli HTTP status code’larını filtreler. |
| `-fs` | Belirli response size değerlerini filtreler. |
| `-fw` | Kelime sayısına göre filtreleme yapar. |
| `-H` | Request’e header ekler. |
| `-X` | HTTP method belirtir. |
| `-d` | POST data gönderir. |
| `-o` | Sonucu dosyaya kaydeder. |

### Örnekler

```bash
# Temel directory fuzzing
ffuf -w /usr/share/wordlists/dirb/common.txt -u http://<CTF_IP>/FUZZ

# Dosya uzantısı denemek
ffuf -w wordlist.txt -u http://<CTF_IP>/FUZZ -e .php,.txt,.html,.bak

# Belirli status code'lara odaklanmak
ffuf -w wordlist.txt -u http://<CTF_IP>/FUZZ -mc 200,301,302,403

# Gürültülü sonuçları response size ile filtrelemek
ffuf -w wordlist.txt -u http://<CTF_IP>/FUZZ -fs 4242

# Parametre fuzzing
ffuf -w params.txt -u "http://<CTF_IP>/page.php?FUZZ=test"

# Virtual host fuzzing
ffuf -w subdomains.txt -u http://<CTF_IP>/ -H "Host: FUZZ.example.local"
```

### Nasıl düşünmelisin?

- `200 OK`: Sayfa/dosya gerçekten var olabilir, tarayıcıda kontrol et.
- `301` veya `302`: Yönlendirme vardır, hedef yolu incele.
- `403 Forbidden`: Erişim engelli olsa da orada bir şey olduğuna dair ipucu olabilir.
- Çok fazla sonuç çıkıyorsa response size veya word count ile filtreleme yap.

### Bulduğumuz Sonuçlarla Nasıl Devam Ederiz?

ffuf sana doğrudan flag vermeyebilir ama flag’e giden yolu gösteren bir diğer temel tooldur.

Eğer /admin bulduysan, login paneli olabilir. Burada Burp Suite ile request’leri inceleyebilirsin.

Eğer /backup bulduysan, içinde eski dosyalar, zip arşivleri, config dosyaları veya credential bilgileri olabilir.

Eğer /uploads bulduysan, yüklenmiş dosyaları kontrol edebilirsin. Bazen görseller, txt dosyaları veya unutulmuş script’ler burada bulunabilir.

Eğer .bak, .old, .txt gibi dosyalar bulduysan, bunların içinde kaynak kod, parola, kullanıcı adı veya flag formatına benzeyen bilgiler olabilir.

Eğer parametre fuzzing ile ilginç bir parametre bulduysan, bunu Burp Suite ile inceleyebilir veya SQL injection ihtimali varsa CTF ortamında sqlmap ile test edebilirsin.

Yani ffuf çıktısına bakarken kendine şu soruyu sormalısın:

“Bu sonuç bana yeni bir sayfa mı, yeni bir dosya mı, yoksa yeni bir saldırı yüzeyi mi gösteriyor?”

---

## 3. Burp Suite — Web Request’lerini Anlamak İçin

Tarayıcıda bir butona bastığında, bir login formu gönderdiğinde veya bir linke tıkladığında arka planda HTTP request oluşur. Yeni başlayan biri olarak sadece sayfanın görünen kısmına bakmak kolaydır ama web CTF’lerinde asıl önemli bilgiler çoğu zaman request ve response içinde saklıdır.

İşte burada Burp Suite devreye girer.

![burpsuite]

Burp Suite, tarayıcı ile web uygulaması arasındaki trafiği yakalamamızı, incelememizi ve gerektiğinde değiştirmemizi sağlar. Yani web uygulamasını sadece kullanıcı gözüyle değil, request/response seviyesinde görmemize yardımcı olur.


Web CTF’lerinde önemli ipuçları sadece sayfanın görünen kısmında değil, request ve response içinde de olabilir.

### Temel bölümler

| Bölüm | Açıklama |
|---|---|
| Proxy | Tarayıcıdan giden ve gelen HTTP request/response trafiğini görmeni sağlar. Web uygulamasının arka planda ne gönderdiğini anlamak için en temel bölümdür. |
| Repeater | Yakaladığın bir request’i değiştirerek tekrar tekrar göndermeni sağlar. Bir parametreyi değiştirip uygulamanın nasıl cevap verdiğini test etmek için çok kullanışlıdır. |
| Decoder | Basit encode/decode işlemleri için kullanılabilir. Örneğin URL encoded, Base64 veya benzeri verileri hızlıca çözmek istediğinde işine yarayabilir. |
| Intruder | Belirli alanlarda otomatik denemeler yapmak için kullanılabilir. |

### Temel kullanım akışı

```text
1. Tarayıcıyı Burp Proxy’ye bağla.
2. Web uygulamasında bir işlem yap.
3. Burp’te request’i yakala.
4. Parametreleri, cookie’leri ve header’ları incele.
5. Gerekirse request’i Repeater’a gönder.
6. Küçük değişikliklerle response’u gözlemle.
```

### Nelere bakmalısın?

- URL path: `/login`, `/admin`, `/profile`, `/api/user`
- Parametreler: `id`, `user`, `role`, `page`, `file`, `redirect`
- Cookies: encode edilmiş veya rol bilgisi içeren değerler olabilir.
- Headers: `User-Agent`, `Referer`, `X-Forwarded-For` gibi alanlar ipucu verebilir.
- Response: hata mesajı, yönlendirme, yorum satırı veya farklı status code önemli olabilir.

---

## 4. sqlmap — SQL Injection Testlerini Otomatikleştirmek İçin

### Ne işe yarar?

**sqlmap**, SQL injection ihtimalini test etmek ve CTF/lab ortamlarında veritabanı yapısını analiz etmek için kullanılan otomasyon aracıdır.

SQL injection, web uygulamasının kullanıcıdan aldığı veriyi güvenli işlemediği durumlarda ortaya çıkabilir. CTF ortamında bu zafiyet bazen flag’e giden ana yol olabilir.

![sqlmapphoto]

### Temel kullanım örnekleri

```bash
# URL parametresi üzerinde temel test
sqlmap -u "http://<CTF_IP>/page.php?id=1"

# Veritabanlarını listelemeye çalışma
sqlmap -u "http://<CTF_IP>/page.php?id=1" --dbs

# Belirli bir veritabanındaki tabloları listeleme
sqlmap -u "http://<CTF_IP>/page.php?id=1" -D <database_name> --tables

# Belirli bir tablodaki kolonları listeleme
sqlmap -u "http://<CTF_IP>/page.php?id=1" -D <database_name> -T <table_name> --columns

# Belirli bir tablodaki verileri dump etme
sqlmap -u "http://<CTF_IP>/page.php?id=1" -D <database_name> -T <table_name> --dump
```

### Ne zaman kullanılır?

- URL’de `id`, `page`, `product`, `user` gibi parametreler varsa.
- Uygulama SQL hatasına benzeyen mesajlar döndürüyorsa.
- Burp Suite ile yakalanan request’te veritabanını etkileyebilecek parametreler görünüyorsa.
- CTF açıklaması SQL injection ihtimalini ima ediyorsa.

> Gerçek sistemlerde izinsiz sqlmap kullanımı yasal ve etik değildir. Sadece izinli CTF/lab ortamlarında kullanılmalıdır.

### Önemli sqlmap Flag’leri
CTF çözerken en çok işimize yarayacak flaglar şunlardır:

- -u = Test edilecek hedef URL’i belirtir. Genelde içinde parametre olan URL’lerde kullanılır.
- --batch = sqlmap’in sorduğu sorulara varsayılan cevaplarla devam etmesini sağlar. CTF sırasında sürekli onay vermek istemediğinde kullanışlıdır.
- --dbs = Veritabanlarını listelemeyi dener. SQL injection doğrulandıktan sonra ilk bakılabilecek adımlardan biridir.
- -D = Belirli bir veritabanını seçmek için kullanılır.
- --tables = Seçilen veritabanındaki tabloları listelemeyi dener.
- -T = Belirli bir tabloyu seçmek için kullanılır.
- --columns = Seçilen tablodaki kolonları listelemeyi dener.
- -C = Belirli kolonları seçmek için kullanılır.
- --dump = Seçilen veriyi dışarı aktarmayı dener. CTF’lerde flag’in bulunduğu tabloyu okumak için kullanılabilir.
- --cookie = Eğer hedef sayfa login gerektiriyorsa, oturum cookie’si eklemek için kullanılır.
- -r = Burp Suite gibi bir araçtan kaydedilen raw HTTP request dosyasını sqlmap’e vermek için kullanılır. Özellikle POST request veya login gerektiren işlemlerde çok işe yarar.

### sqlmap Çıktısına Göre Nasıl Düşünmeliyiz?

sqlmap çalıştırdığında bazen çok fazla çıktı görebilirsin. Temel seviyede önemli olan, her satırı ezberlemek değil, sonucun sana ne söylediğini anlayabilmektir.

Eğer sqlmap parametrenin injectable olduğunu söylüyorsa, bu parametrenin veritabanı sorgusunu etkileyebildiği anlamına gelebilir. Bu durumda sıradaki adım veritabanlarını, tabloları ve kolonları anlamaktır.

Örnek düşünce akışı şöyle olabilir:

```text
id parametresi injectable mı?
Eğer injectable ise hangi veritabanları var?
Bu veritabanlarında hangi tablolar var?
Tablo isimleri arasında users, admin, flag, secret gibi dikkat çeken bir şey var mı?
Kolonlarda username, password, flag, value gibi alanlar var mı?
```
### Bulduğumuz Sonuçlarla Nasıl Devam Ederiz?
sqlmap bir zafiyet bulursa, doğrudan her şeyi dump etmeye çalışmak yerine düzenli ilerlemek daha iyidir.

Önce veritabanlarını listeleyebilirsin.
Sonra dikkat çeken veritabanını seçebilirsin.
Sonra tabloları kontrol edebilirsin.
Sonra ilginç kolonlara bakabilirsin.
En son gerçekten gerekli veriyi dump etmeyi deneyebilirsin.

Örneğin tablo isimleri arasında flags diye bir tablo gördüğünü düşün. Bu durumda sıradaki hedefin bu tablonun kolonlarını görmek olur. Eğer kolonlar arasında flag veya value gibi bir alan varsa, bu alanı dump ederek challenge’ın cevabına ulaşabilirsin.

Ama bazen flag direkt veritabanında olmaz. sqlmap sana kullanıcı adı ve parola verebilir. Bu bilgilerle admin paneline giriş yaparsın. Orada başka bir ipucu bulursun. Sonra belki SSH erişimine geçersin.

Yani sqlmap sonucu bazen final cevap değil, sadece bir sonraki kapının anahtarıdır.



---

## 5. CyberChef — Encoding ve Decoding İçin

CTF’lerde bazen karşına ilk bakışta anlamsız görünen string’ler çıkar:

```text
ZmxhZ3tiYXNlNjRfaXNfZnVuX2Zvcl9jdGZ9
```

İlk gördüğünde bu metin şifrelenmiş gibi durabilir. Ama CTF’lerde her garip string gerçekten “şifrelenmiş” olmak zorunda değildir. Bazen veri sadece encode edilmiştir.


İşte burada CyberChef devreye girer.

CyberChef, tarayıcı üzerinden kullanılabilen bir veri analiz aracıdır. Base64, hex, URL encoding, ROT13, XOR, hash, compression ve daha birçok işlem için kullanılabilir.

“Elimde garip bir veri var, bunu okunabilir hale getirmek için ne deneyebilirim?”

CyberChef’in güzel tarafı, işlemleri recipe mantığıyla sıraya koyabilmendir. Yani bir işlemi seçersin, input’u verirsin ve output’u anında görürsün. Eğer veri birden fazla işlemden geçtiyse, bu işlemleri sırayla ekleyebilirsin.

![cyberchefphoto]

### CyberChef’te Bilmen Gereken Temel İşlemler


- From Base64 = Base64 ile encode edilmiş veriyi okunabilir hale getirmek için kullanılır.

- From Hex = Hex formatındaki veriyi text’e çevirmek için kullanılır.

- URL Decode = URL encoded verileri çözmek için kullanılır. Örneğin %7B gibi ifadeler gerçek karakterlere dönüşür.

- ROT13 = Harfleri alfabede 13 karakter kaydıran basit bir dönüşümdür. CTF’lerde bazen küçük ipucu olarak kullanılabilir.

- XOR = Bazı crypto veya misc challenge’larında basit XOR işlemlerini denemek için kullanılabilir.

- Magic = CyberChef’in verilen input üzerinde otomatik olarak bazı işlemleri tahmin etmeye çalıştığı özelliktir. Her zaman doğru sonucu vermez ama beginner seviyede fikir almak için kullanılabilir.

- To Hex / From Hex = Text ve hex arasında dönüşüm yapmak için kullanılır.

- Find / Regular Expression = Büyük bir çıktı içinde belirli pattern’leri aramak için kullanılabilir. Örneğin flag gibi bir ifade aramak isteyebilirsin.

Burada önemli bir ayrım var: CyberChef hash işlemleri yapabilir ama bu onu bir hash kırma aracı yapmaz. Eğer elinde kırılması gereken bir hash varsa John the Ripper gibi araçlar daha doğru seçim olabilir. CyberChef daha çok veriyi dönüştürmek, decode etmek ve analiz etmek için kullanılır.


### Kullanım mantığı

```text
Input verisini yapıştır.
Bir işlem seç: Base64 Decode, From Hex, URL Decode vb.
Output’u incele.
Gerekirse başka işlemler ekleyerek recipe oluştur.
```

### CyberChef Çıktısına Göre Nasıl Düşünmeliyiz?


CyberChef kullanırken önemli olan rastgele bütün işlemleri denemek değildir. Input’un neye benzediğine bakıp mantıklı tahminler yapmaktır.

Eğer string sonunda `=` karakteri varsa, Base64 olabilir. Her zaman kesin değildir ama denemeye değerdir.

Eğer veri sadece `0-9` ve `a-f` karakterlerinden oluşuyorsa, hex olabilir.

Eğer veri içinde `%20`, `%7B`, `%2F` gibi ifadeler varsa, URL encoded olabilir.

Eğer metin okunabilir ama harfler anlamsız duruyorsa, ROT13 veya Caesar tarzı basit dönüşümler denenebilir.

Eğer çıktı hâlâ anlamsızsa, veri birkaç farklı işlemden geçmiş olabilir. Bu durumda CyberChef’te recipe sırasını değiştirmek gerekebilir.

Mesela şu iki recipe farklı sonuç verebilir:

```text
URL Decode -> From Base64
From Base64 -> URL Decode
```
Bu yüzden CyberChef’te işlem sırası önemlidir.

### Bulduğumuz Sonuçlarla Nasıl Devam Ederiz?
CyberChef bazen doğrudan flag’i verir. Özellikle beginner CTF’lerde Base64, hex veya URL encoded bir string’i decode ettiğinde flag formatını görebilirsin.

Ama her zaman final cevap çıkmayabilir. Bazen CyberChef sana başka bir tool’a geçmen için ipucu verir.

Örneğin decode ettiğin veri bir URL olabilir. Bu durumda web tarafına bakman gerekir.

Decode ettiğin veri bir dosya adı olabilir. Bu durumda ffuf ile o dosyayı veya dizini arayabilirsin.

Decode ettiğin veri bir kullanıcı adı veya parola olabilir. Bu bilgi SSH, FTP veya web login için işe yarayabilir.

Decode ettiğin veri bir hash gibi görünüyorsa, John the Ripper bölümüne geçmen gerekebilir.

Yani CyberChef’i sadece “flag çıkaran araç” gibi düşünmemek gerekir. Bazen flag’i verir, bazen de seni bir sonraki adıma yönlendirir.



---

## 6. Wireshark — Network Trafiğinde Flag Aramak İçin

Bazı CTF challenge’larında sana .pcap uzantılı bir dosya verilir. Bu dosya, yakalanmış network trafiğini içerir.

İlk kez bir pcap dosyasını Wireshark ile açtığında ekranda yüzlerce, hatta binlerce paket görmek biraz korkutucu olabilir. Amacımız her paketi tek tek anlamak değil. Önce trafiği filtreleyip ilginç görünen yerlere odaklanmak yeterlidir.

İşte burada Wireshark devreye girer.

Wireshark, network trafiğini incelememizi sağlayan en temel analiz araçlarından biridir. CTF’lerde özellikle network forensics sorularında kullanılır. Bazen flag bir HTTP response içinde, bazen DNS query’lerinde, bazen de bir TCP stream’in içinde saklı olabilir.

![wiresharkphoto]

### Wireshark’ta Bilmen Gereken Temel Kavramlar

`Packet` = Ağ üzerinde yakalanan her küçük veri parçasıdır.

`Protocol` = Paketin hangi protokole ait olduğunu gösterir. Örneğin HTTP, DNS, TCP, UDP gibi.

`Source` = Paketin nereden geldiğini gösterir.

`Destination` = Paketin nereye gittiğini gösterir.

`Info` = Paket hakkında kısa özet bilgi verir. Beginner seviyede çoğu zaman en hızlı ipuçları burada görülür.

`Display Filter` = Ekranda sadece görmek istediğin paketleri filtrelemek için kullanılır. Wireshark kullanırken en önemli alanlardan biridir.



### Önemli Wireshark Filtreleri

Şu filtreler temel seviyede en çok işimize yarayanlardır:

`http` = Sadece HTTP trafiğini gösterir. Web istekleri, response’lar, dosya yolları veya flag içeren sayfalar burada görünebilir.

`dns` = DNS trafiğini gösterir. Domain sorguları, subdomain ipuçları veya bazen gizlenmiş veriler DNS içinde olabilir.

`tcp` = TCP trafiğini gösterir. Daha genel bir filtredir. HTTP dışındaki TCP konuşmalarını incelemek için kullanılabilir.

`udp `= UDP trafiğini gösterir. DNS gibi bazı protokoller UDP üzerinden çalışabilir.

`ip.addr` == 10.10.10.10 = Belirli bir IP adresiyle ilgili trafiği gösterir. Çok fazla paket varsa hedef IP’ye odaklanmak için kullanışlıdır.

`frame contains "flag" `= Paketlerin içinde flag kelimesini aramak için kullanılabilir. Her zaman sonuç vermez ama CTF’lerde denemeye değerdir.

`http.request` = HTTP request’lerini gösterir. Hangi sayfaların istendiğini görmek için faydalıdır.

### Follow TCP Stream Nedir?
Wireshark’ta beginner seviyede en işe yarayan özelliklerden biri Follow TCP Stream özelliğidir.

Normal paket listesinde trafik parça parça görünür. Bu yüzden konuşmanın tamamını okumak zor olabilir. Follow TCP Stream ise belirli bir TCP konuşmasını daha okunabilir hale getirir.

Örneğin HTTP trafiğinde şöyle bir istek görebilirsin:

```text
GET /secret/flag.txt HTTP/1.1
```
Bu pakete sağ tıklayıp Follow → TCP Stream dediğinde, o konuşmanın tamamını daha düzenli şekilde görebilirsin. Bazen request, response, dosya içeriği veya flag burada daha net görünür.

![followtcpstream]

### Wireshark Çıktısına Göre Nasıl Düşünmeliyiz?

Wireshark’ta pcap dosyasını açtığında önce kendine şu soruları sorabilirsin:

Bu trafikte HTTP var mı?
DNS sorguları ilginç mi?
Bir dosya indirilmiş mi?
Bir login isteği var mı?
Paketlerin içinde `flag`, `admin`, `password`, `secret` gibi kelimeler geçiyor mu?

Eğer HTTP trafiği varsa, `http` veya `http.request` filtresiyle web isteklerine bakabilirsin. Bazen istenen path doğrudan ipucu verir:

```text
GET /secret/flag.txt HTTP/1.1
```

Eğer DNS trafiği varsa, sorgulanan domain’lere bakabilirsin. Bazı CTF’lerde subdomain’ler veya garip DNS query’leri ipucu olabilir.

Eğer çok fazla paket varsa, belirli bir IP adresine odaklanmak mantıklı olabilir:

```text
ip.addr == 10.10.10.10
```

Eğer bir konuşma ilginç görünüyorsa, Follow TCP Stream ile tamamını okumayı deneyebilirsin.


### Bulduğumuz Sonuçlarla Nasıl Devam Ederiz?


Wireshark bazen doğrudan flag’i gösterebilir. Özellikle HTTP response içinde veya TCP stream içinde flag açıkça bulunabilir.

Ama bazen sadece bir ipucu verir.

Örneğin trafikte bir dosya adı görebilirsin. Bu dosyayı challenge içinden çıkarman gerekebilir.

Bir URL path görebilirsin. Bu path’i tarayıcıda açman gerekebilir.

Bir kullanıcı adı veya parola görebilirsin. Bu bilgi SSH, FTP veya web login için kullanılabilir.

Bir encoded string görebilirsin. Bu durumda CyberChef ile decode etmeyi deneyebilirsin.

Yani Wireshark sadece “paketlere bakma” aracı değildir. Trafikteki bilgiyi okuyup bir sonraki adıma geçmeni sağlar.


---

## 7. ExifTool — Dosya Metadata’sına Bakmak İçin

### Ne işe yarar?

Forensics challenge’larında sıkça görsel, PDF veya farklı dosya türleriyle karşılaşırız. Dosya normal görünebilir ama içinde ya da metadata’sında önemli bilgiler saklanmış olabilir.

İşte burada ExifTool devreye girer.

![exiftoolphoto]

ExifTool, dosyaların metadata bilgilerini okumak için kullanılan çok pratik bir araçtır. Metadata’yı kısaca “dosyanın arka plandaki bilgileri” gibi düşünebiliriz. Dosyanın ne zaman oluşturulduğu, hangi yazılımla düzenlendiği, author bilgisi veya comment alanı gibi bilgiler metadata içinde bulunabilir.


### Temel komut

```bash
exiftool image.jpg
```

### Bakılabilecek alanlar

- File Name
- File Size
- File Type
- Create Date
- Modify Date
- Author
- Comment
- GPS Position
- Software

Beginner CTF’lerde ExifTool hızlıca denemeye değer araçlardan biridir çünkü kullanımı basittir ve bazen direkt sonuç verir.

Tabii her dosyada metadata’dan flag çıkmaz. Ama forensics sorularında bir dosya verildiyse, özellikle görsel veya PDF ise, ExifTool ile metadata kontrol etmek mantıklı bir ilk adımdır.


### ExifTool’da Nelere Bakmalıyız?
ExifTool çıktısında çok fazla satır olabilir. İlk başta her alanı detaylı bilmen gerekmez. Ama şu alanlar CTF’lerde dikkat çekebilir:

- Comment = Bazen flag, ipucu veya gizli bir mesaj burada olabilir.;
- Author = Dosyayı oluşturan kişi bilgisi olabilir. OSINT veya forensics sorularında ipucu verebilir.
- Creator / Producer = PDF veya görsellerin hangi araçla oluşturulduğunu gösterebilir.
- Software = Dosyanın hangi programla düzenlendiğini gösterebilir. Bazen challenge’ın nasıl hazırlandığına dair ipucu verir.
- Create Date / Modify Date = Dosyanın oluşturulma veya değiştirilme tarihini gösterir. Bazı sorularda zaman bilgisi önemli olabilir.
- GPS Position = Görsellerde konum bilgisi olabilir. OSINT tarzı CTF sorularında işe yarayabilir.
- File Type = Dosyanın gerçekten hangi türde olduğunu anlamaya yardımcı olabilir. Bazen dosya uzantısı yanıltıcı olabilir.

Bu alanların hepsi her challenge’da önemli değildir. Ama ExifTool çıktısını okurken özellikle garip, beklenmeyen veya flag formatına benzeyen değerlere dikkat etmek iyi olur.

### ExifTool Çıktısına Göre Nasıl Düşünmeliyiz?
ExifTool çalıştırdığında doğrudan flag bulamayabilirsin. Bu normaldir. Önemli olan çıktıda neyin farklı veya dikkat çekici durduğunu fark etmektir.

Eğer Comment alanında garip bir metin varsa, bunu inceleyebilirsin.

Eğer Author alanında bir kullanıcı adı varsa, bu başka bir yerde kullanılabilir. Örneğin SSH, FTP veya web login için ipucu olabilir.

Eğer Software alanında alışılmadık bir program görünüyorsa, dosyanın nasıl oluşturulduğu veya düzenlendiği hakkında fikir verebilir.

Eğer GPS bilgisi varsa, bu konum bilgisi bir OSINT sorusuna bağlanabilir.

Eğer dosya türü beklediğinden farklı görünüyorsa, dosyanın uzantısı değiştirilmiş olabilir. Örneğin .jpg gibi görünen bir dosya aslında başka bir tür olabilir. Böyle durumlarda file komutu veya Binwalk gibi araçlarla devam etmek mantıklı olabilir.

Yani ExifTool çıktısını okurken kendine şu soruyu sorabilirsin:

“Bu dosyanın arka planında, normalde görmediğim hangi bilgi saklanmış olabilir?”

### Bulduğumuz Sonuçlarla Nasıl Devam Ederiz?
ExifTool bazen doğrudan flag’i verir. Özellikle beginner forensics challenge’larında flag Comment, Description veya benzeri bir metadata alanında saklanmış olabilir.

Ama bazen ExifTool sadece bir ipucu verir.

Metadata içinde bir dosya adı bulabilirsin. Bu dosyayı challenge klasöründe araman gerekebilir.

Bir kullanıcı adı bulabilirsin. Bu bilgi başka bir serviste işe yarayabilir.

Bir encoded string görebilirsin. Bu durumda CyberChef ile decode etmeyi deneyebilirsin.

Bir konum bilgisi bulabilirsin. Bu durumda OSINT mantığıyla harita veya konum araştırması yapman gerekebilir.

Hiçbir şey bulamazsan da bu kötü bir sonuç değildir. Sadece metadata tarafında bir şey olmadığını anlamış olursun. Bu durumda dosyanın içine gömülü veri var mı diye Binwalk gibi araçlara geçebilirsin.


---

## 8. John the Ripper — Hash Kırmak İçin

### Ne işe yarar?

**John the Ripper**, hash kırmak için kullanılan klasik araçlardan biridir. CTF’lerde hash, parola korumalı zip dosyası veya sistem dosyalarından çıkarılmış parola hash’leriyle karşılaşılabilir.

Hash doğrudan geri çevrilebilen bir şifreleme değildir. John, wordlist’teki kelimeleri deneyerek bunların hash değerlerini hesaplar ve verilen hash ile eşleşme arar.

### Temel kullanım

```bash
john --wordlist=/usr/share/wordlists/rockyou.txt hash.txt
```

### Kırılan sonucu görmek

```bash
john --show hash.txt
```

### Ne zaman kullanılır?

- Sana doğrudan bir hash verildiyse.
- Parola korumalı arşiv dosyası varsa.
- `/etc/shadow` benzeri sistem hash’leri CTF içinde verilmişse.
- Zip, rar veya benzeri dosyalar için önce hash çıkarma işlemi gerekiyorsa.

### Düşünme biçimi

- Hash türünü anlamaya çalış.
- Uygun formatta hash dosyası oluştur.
- Wordlist ile deneme yap.
- Sonucu başka servislerde credential olarak kullanman gerekebilir.

---

## Bonus: Binwalk ve Gobuster
Bu yazının ana listesine 8 tool koyduk ama önemli olduğunu düşündüğüm iki araçtan da kısaca bahsetmek istiyorum: Binwalk ve Gobuster.

Çünkü ikisi de CTF’lerde sıkça kullanılan araçlardandır. Gobuster zaten birçok kişinin bildiği klasik web discovery araçlarından biri. Binwalk ise özellikle forensics tarafında, dosyaların içine saklanmış verileri bulmak için oldukça önemli bir araç.


### Binwalk

Forensics challenge’larında bazen sana normal görünen bir dosya verilir. Bu bir görsel, firmware dosyası, arşiv veya farklı bir binary dosya olabilir.

İlk bakışta dosya normal görünebilir. ExifTool ile metadata’ya bakarsın ama işe yarar bir şey çıkmaz. İşte böyle durumlarda Binwalk devreye girebilir.

ExifTool ve Binwalk benzer dosya challenge’larında kullanılabilir ama aslında farklı sorular sorarlar.

ExifTool şunu sorar:

“Bu dosyanın metadata’sında ne var?”

Binwalk ise şunu sorar:

“Bu dosyanın içine başka bir dosya veya veri gömülmüş mü?”

Örneğin sana suspicious.png adında bir görsel verildiğini düşün. Önce metadata’ya bakabilirsin:


Temel kullanım:

```bash
exiftool suspicious.png
```

Eğer metadata’da bir şey bulamazsan, dosyanın içine gömülü başka veri var mı diye Binwalk deneyebilirsin:

```bash
binwalk suspicious.png
```

Eğer Binwalk dosya içinde gömülü bir arşiv, dosya sistemi veya farklı bir veri bulursa, çıkarmayı deneyebilirsin:

```bash
binwalk -e suspicious.png
```

Bu özellikle “görsel normal ama içinde bir şey var gibi” hissettiren forensics sorularında işe yarayabilir.

Kısaca:

ExifTool dosyanın bilgilerine bakar.
Binwalk dosyanın içine saklanmış başka bir şey var mı diye bakar.

Bu farkı bilmek forensics challenge’larında çok işine yarar. Çünkü bazen flag metadata’da değil, dosyanın içine gömülmüş başka bir dosyanın içinde olabilir.


### Gobuster

**Gobuster**, web discovery için kullanılan klasik araçlardan biridir. ffuf gibi gizli dizin, dosya veya virtual host keşfi için kullanılabilir.

Temel kullanım:

```bash
gobuster dir -u http://<CTF_IP>/ -w wordlist.txt
```

---

## Genel CTF Yaklaşımı

Araçları tek tek öğrenmek önemlidir; fakat CTF çözerken asıl değerli olan düşünme biçimidir.

### Başlangıç kontrol listesi

```text
[ ] Hedef IP verildiyse Nmap ile port/servis keşfi yap.
[ ] Web servisi varsa sayfa kaynağını, robots.txt dosyasını ve gizli yolları kontrol et.
[ ] ffuf veya Gobuster ile gizli dizin/dosya ara.
[ ] Web request’lerini Burp Suite ile incele.
[ ] Garip string varsa CyberChef ile decode/transform dene.
[ ] pcap dosyası varsa Wireshark ile trafiği filtrele.
[ ] Görsel/PDF/dosya varsa ExifTool ile metadata kontrol et.
[ ] Dosyanın içine gömülü veri ihtimali varsa Binwalk dene.
[ ] Hash verilmişse John the Ripper ile wordlist tabanlı deneme yap.
[ ] Bulduğun her sonucu yeni bir ipucu olarak değerlendir.
```

### Araçlar birbirini tamamlar

- Nmap açık portları gösterir.
- ffuf/Gobuster gizli web yollarını bulur.
- Burp Suite web trafiğini anlamanı sağlar.
- sqlmap SQL injection ihtimalini test eder.
- CyberChef encode edilmiş veya dönüştürülmüş verileri anlamlandırır.
- Wireshark network trafiğinde flag veya ipucu arar.
- ExifTool metadata’yı inceler.
- Binwalk dosya içine gömülü verileri bulabilir.
- John the Ripper hash ve parola challenge’larında kullanılır.

---

## Kısa Komut Cheat Sheet

```bash
# Nmap
nmap -sV -sC <CTF_IP>
nmap -p- <CTF_IP>
nmap -sV -sC -p 22,80,8080 <CTF_IP>

# ffuf
ffuf -w wordlist.txt -u http://<CTF_IP>/FUZZ
ffuf -w wordlist.txt -u http://<CTF_IP>/FUZZ -e .php,.txt,.html,.bak
ffuf -w wordlist.txt -u http://<CTF_IP>/FUZZ -mc 200,301,302,403
ffuf -w wordlist.txt -u http://<CTF_IP>/FUZZ -fs 4242

# Burp Suite
# Proxy -> Intercept -> Repeater -> request/response analizi

# sqlmap
sqlmap -u "http://<CTF_IP>/page.php?id=1"
sqlmap -u "http://<CTF_IP>/page.php?id=1" --dbs
sqlmap -u "http://<CTF_IP>/page.php?id=1" -D <db> --tables
sqlmap -u "http://<CTF_IP>/page.php?id=1" -D <db> -T <table> --dump

# Wireshark filtreleri
# http
# dns
# tcp
# ip.addr == <IP>
# tcp.stream eq 0

# ExifTool
exiftool image.jpg

# John the Ripper
john --wordlist=/usr/share/wordlists/rockyou.txt hash.txt
john --show hash.txt

# Binwalk
binwalk file.bin
binwalk -e file.bin

# Gobuster
gobuster dir -u http://<CTF_IP>/ -w wordlist.txt
```

---

## SONUÇ VE KAPANIŞ

CTF öğrenirken yüzlerce tool bilmek zorunda değilsin.

Başlangıçta önemli olan, en sık karşılaşacağın problem türlerini tanımak ve bu problemlere hangi araçlarla yaklaşabileceğini bilmektir.

Eğer sana bir IP verilirse Nmap ile başlayabilirsin.
Web uygulamasında gizli dizin arıyorsan ffuf kullanabilirsin.
Request’leri anlamak istiyorsan Burp Suite açabilirsin.
SQL injection ihtimali varsa sqlmap’i CTF ortamında deneyebilirsin.
Garip bir string görürsen CyberChef’te deneyebilirsin.
pcap dosyası geldiyse Wireshark ile trafiğe bakabilirsin.
Bir dosya verildiyse ExifTool ile metadata kontrol edebilirsin.
Hash görürsen John the Ripper ile deneyebilirsin.

Bonus olarak, dosyanın içine başka bir şey gömülmüş olabilir diye Binwalk’a; ffuf alternatifi olarak da Gobuster’a bakabilirsin.

CTF’leri birer bulmaca gibi düşündüğünde, başta karışık ve zorlayıcı görünen yapı bir anda eğlenceli ve öğretici bir sürece dönüşüyor. Önemli olan sadece aynı pattern’lere bağlı kalmak değil; yaratıcı çözümler bulmak ve esnek düşünebilmeyi öğrenmek.

Tool’lar öğrenilir, ama düşünme biçimi zamanla kazanılır. Bu düşünme biçimini kazandıktan sonra sadece CTF’lerde değil, siber güvenliğin birçok farklı alanında daha sağlam ilerlersin.

“Görmeyi öğrenin. Her şeyin birbiri ile bağlantılı olduğunu fark edeceksiniz.”
— Leonardo da Vinci

[opening]: /blogs/img/ctf-8-tools-beginner-summary/opening.png
[burpsuite]: /blogs/img/ctf-8-tools-beginner-summary/burpsuite.png
[sqlmapphoto]: /blogs/img/ctf-8-tools-beginner-summary/sqlmapphoto.png
[cyberchefphoto]: /blogs/img/ctf-8-tools-beginner-summary/cyberchefphoto.png
[wiresharkphoto]: /blogs/img/ctf-8-tools-beginner-summary/wiresharkphoto.png
[followtcpstream]: /blogs/img/ctf-8-tools-beginner-summary/followtcpstream.png
[exiftoolphoto]: /blogs/img/ctf-8-tools-beginner-summary/exiftoolphoto.png
