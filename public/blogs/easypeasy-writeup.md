TryHackMe - EasyPeasy CTF Write-up
Odanın linki: https://tryhackme.com/room/easypeasyctf

<img width="640" height="400" alt="image" src="/blogs/img/easypeasy/easy1.webp" />


Herkese merhaba, bu yazımda TryHackMe platformunda yer alan ve siber güvenlik temellerini pekiştirmek için harika bir senaryoya sahip olan EasyPeasy makinesinin adım adım çözümünü paylaşacağım. Keyifli okumalar dilerim!
Adım 1: Bilgi Toplama ve Keşif (Reconnaissance)
Her sızma testinde olduğu gibi, operasyona hedef makine hakkında bilgi toplayarak başlıyoruz. Hedef IP adresini belirledikten sonra ilk olarak web tarayıcım üzerinden ziyaret ediyorum.

<img width="640" height="400" alt="image" src="/blogs/img/easypeasy/easy1.webp" />

Karşımıza standart bir Nginx hoş geldiniz sayfası çıkıyor. Sayfanın kaynak kodlarını incelediğimde işe yarar bir ipucu bulamayınca, arka planda hangi servislerin çalıştığını ve hangi portların açık olduğunu görmek için port taramasına geçiyorum.
Port taraması için hızından dolayı RustScan aracını tercih ediyorum.

<img width="640" height="400" alt="image" src="/blogs/img/easypeasy/easy3.webp" />

Port Tarama Sonuçları:
Port 80: HTTP (Nginx 1.16.1)
Port 6498: SSH (OpenSSH 7.6p1)
Port 65524: HTTP (Apache httpd 2.4.43)

Adım 2: Port 80 Üzerinde Dizin Taraması ve İlk Flag
Öncelikle 80 portundaki Nginx sunucusu üzerinde yoğunlaşıyorum ve gizli dizinleri keşfetmek için bir dizin taraması gerçekleştiriyorum. Yaptığım tarama sonucunda /hidden dizinini tespit ediyorum.

<img width="640" height="400" alt="image" src="/blogs/img/easypeasy/easy4.webp" />

Bu dizine gittiğimde beni sadece bir görsel karşılıyor. Sayfa kaynağında bir şey bulamayınca, bu dizinin altında da başka gizli yollar olabileceğini düşünerek Gobuster aracı ile derinlemesine bir dizin taraması başlatıyorum.
gobuster dir -u http://<HEDEF_IP>/hidden/ -w /usr/share/wordlists/dirbuster/directory-list-lowercase-2.3-medium.txt
Neden bu komut? gobuster dir komutu web dizinlerini brute-force (kaba kuvvet) yöntemiyle tarar. -u parametresi hedef adresi, -w ise tarama yaparken kullanacağımız kelime listesini (wordlist) belirtir.

<img width="640" height="400" alt="image" src="/blogs/img/easypeasy/easy5.webp" />


Tarama sonucunda /hidden/whatever adında yeni bir dizin keşfediyorum. Bu sayfayı ziyaret edip sayfa kaynağını incelediğimde, gizlenmiş bir base64 değeri buluyorum. Bu hash'i çözdüğümde başarıyla ilk flag'e ulaşıyorum.

<img width="640" height="400" alt="image" src="/blogs/img/easypeasy/easy6.webp" />

<img width="640" height="400" alt="image" src="/blogs/img/easypeasy/easy7.webp" />

1. Flag: flag{f****_f***}

Adım 3: Port 65524 (Apache) ve Gizli İpuçları
RustScan çıktımızda bir HTTP servisinin de 65524 portunda çalıştığını görmüştük. Bu adresi tarayıcımda açtığımda karşıma varsayılan Apache 2 Debian sayfası çıkıyor.

<img width="640" height="400" alt="image" src="/blogs/img/easypeasy/easy8.webp" />

Web sızma testlerinde geleneksel bir alışkanlık olarak sayfa kaynağını kontrol ediyorum. Dikkatli bir inceleme sonucunda, sayfa kodlarının arasına gizlenmiş 3. Flag ile karşılaşıyorum.

<img width="640" height="400" alt="image" src="/blogs/img/easypeasy/easy9.webp" />

3. Flag: flag{***********************}

Keşfe devam etmek adına web sunucularında arama motorlarının taramasını kısıtlamak için kullanılan /robots.txt dosyasını kontrol ediyorum. http://<HEDEF_IP>:65524/robots.txt adresine gittiğimde bir User-Agent bilgisi buluyorum. Bu değeri çevrimiçi araçlar yardımıyla çözüyorum.

<img width="640" height="400" alt="image" src="/blogs/img/easypeasy/easy10.webp" />

2. Flag: flag{1m_******_fl4g}

Yine bu porttaki ana sayfanın kaynak kodlarını incelerken gözüme çarpan bir diğer detay, Base62 algoritması ile şifrelenmiş bir metin oluyor.

<img width="640" height="400" alt="image" src="/blogs/img/easypeasy/easy11.webp" />

bu değeri CyberChef veya online dekoderler vasıtasıyla çözüyorum ve karşımıza yeni bir gizli dizin çıkıyor : /n0th1ng3lsm4tt3r.

<img width="640" height="400" alt="image" src="/blogs/img/easypeasy/easy12.webp" />

Adım 4: Steganografi ve Kullanıcı Girişi (SSH)
Elde ettiğim yeni gizli dizini (/n0th1ng3lsm4tt3r) ziyaret ettiğimde Matrix temalı bir sayfa beni karşılıyor.

<img width="640" height="400" alt="image" src="/blogs/img/easypeasy/easy13.webp" />

Sayfa kaynağına baktığımda ise bir adet binarycodepixabay.jpg resmi ve altında bir şifreleme özeti görüyorum.
İlk olarak Gost Hash değerini internet üzerinde araştırarak kırıyorum ve şu parolayı elde ediyorum : mypasswordforthatjob.

<img width="640" height="400" alt="image" src="/blogs/img/easypeasy/easy14.webp" />

<img width="640" height="400" alt="image" src="/blogs/img/easypeasy/easy15.webp" />


Sayfadaki resmin içine bir veri gizlenmiş olabileceğinden şüphelenip resmi indiriyorum. İçindeki gizli dosyayı çıkartmak için Steghide aracını kullanıyorum.
steghide --extract -sf binarycodepixabay.jpg
Neden bu komut? steghide --extract resim veya ses dosyalarının içine gizlenmiş verileri ayıklar. -sf (source file) parametresi ise üzerinde işlem yapacağımız dosyayı seçer.

Komutu çalıştırdıktan sonra benden istenen parolaya, az önce hash kırarak elde ettiğim mypasswordforthatjob şifresini giriyorum. İşlem başarılı oluyor ve içeriden secrettext.txt adında bir metin dosyası çıkıyor.

<img width="640" height="400" alt="image" src="/blogs/img/easypeasy/easy16.webp" />

Dosya içeriğini okuduğumda karşıma bir kullanıcı adı ve binary kodlar çıkıyor:
Kullanıcı Adı: boring
Şifre (Binary): 01101001 01100011 ...
Bu binary kodları tekrar CyberChef üzerinde metne dönüştürerek SSH parolasını netleştiriyorum.

<img width="640" height="400" alt="image" src="/blogs/img/easypeasy/easy17.webp" />

Username: boring
Password: iconvertedmypasswordtobinary

Artık hedef makinede geçerli bir kullanıcı hakkına sahibim. Açık olan 6498 SSH portunu kullanarak sisteme uzaktan bağlanıyorum.
ssh boring@<HEDEF_IP> -p 6498

<img width="640" height="400" alt="image" src="/blogs/img/easypeasy/easy18.webp" />

Adım 5: Yetki Yükseltme (Privilege Escalation) ve Root Flag
Sisteme boring kullanıcısı olarak başarıyla giriş yaptıktan sonra kullanıcı flag'ini okumak istiyorum. Ancak sistem bize küçük bir oyun oynamış ve flag metnini ROT13 algoritması ile şifrelemiş. Metni basit bir ROT13 decoder ile çözerek User Flag'i alıyorum.

<img width="640" height="400" alt="image" src="/blogs/img/easypeasy/easy19.webp" />

<img width="640" height="400" alt="image" src="/blogs/img/easypeasy/easy20.webp" />


User Flag: flag{******33msn0rm4l}

Sırada makineyi tamamen ele geçirmek, yani Root yetkilerine yükselmek var. İlk olarak kısıtlı yetkilerimizi görmek adına klasik sudo -l komutunu deniyorum fakat buradan bir sonuç alamıyorum. Ardından sistemde otomatik olarak arka planda çalışan görevleri incelemek için cronjobları kontrol ediyorum.

<img width="640" height="400" alt="image" src="/blogs/img/easypeasy/easy21.webp" />

Çıktıda en altta yer alan .mysecretcronjob.sh görevi doğrudan dikkatimi çekiyor. Bu dosyanın izinlerini kontrol etmek için şu komutu çalıştırıyorum:
ls -la /var/www/.mysecretcronjob.sh
Yaptığım kontrolde, bu gizli script dosyasının benim bulunduğum boring kullanıcısı tarafından yazılabilir olduğunu görüyorum.
Saldırı Senaryomuz (Exploit):
Sistem, her dakika bu script dosyasını root yetkileriyle otomatik olarak çalıştırıyor. Eğer ben bu dosyanın içerisine kendi zararlı Reverse Shellimi yazabilirsem, sistem bu dosyayı root olarak çalıştırdığı an bana root yetkilerinde bir bağlantı verecektir. Senaryo son derece basit ve etkili.
Kendi Kali Linux makinemde bağlantıyı yakalayabilmek için Netcat ile bir port dinlemesi başlatıyorum:
nc -lvnp 4444
Ardından hedef makinede yazma yetkim olan .mysecretcronjob.sh dosyasının içine Kali makineme bağlantı gönderecek olan klasik tek satırlık reverse shell kodumu enjekte ediyorum.

<img width="640" height="400" alt="image" src="/blogs/img/easypeasy/easy22.webp" />

Bir dakika kadar bekledikten sonra, cronjob tetikleniyor ve Kali makineme gelen bağlantı sayesinde sisteme root (en yetkili kullanıcı) olarak erişim sağlıyorum! Hemen root dizinine giderek son flag'i de okuyorum.

<img width="640" height="400" alt="image" src="/blogs/img/easypeasy/easy23.webp" />

Root Flag: flag{********************}

Bu odayı da başarılı bir şekilde tamamladım. Siber güvenlik için temel düzeyde bilgiler içeren keyifli bir sızma testi oldu. Okuduğunuz için teşekkürler, sonraki yazılarımda görüşmek üzere.
