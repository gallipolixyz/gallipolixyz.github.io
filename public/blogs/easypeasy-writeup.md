TryHackMe - EasyPeasy CTF Write-up
Odanın linki: https://tryhackme.com/room/easypeasyctf

<img width="640" height="529" alt="image" src="https://github.com/user-attachments/assets/fee76aba-7748-4821-bb3e-130e346f6eba" />


Herkese merhaba, bu yazımda TryHackMe platformunda yer alan ve siber güvenlik temellerini pekiştirmek için harika bir senaryoya sahip olan EasyPeasy makinesinin adım adım çözümünü paylaşacağım. Keyifli okumalar dilerim!
Adım 1: Bilgi Toplama ve Keşif (Reconnaissance)
Her sızma testinde olduğu gibi, operasyona hedef makine hakkında bilgi toplayarak başlıyoruz. Hedef IP adresini belirledikten sonra ilk olarak web tarayıcım üzerinden ziyaret ediyorum.

<img width="1000" height="489" alt="image" src="https://github.com/user-attachments/assets/869e256e-e82e-418d-ba80-45dcd58f6334" />

Karşımıza standart bir Nginx hoş geldiniz sayfası çıkıyor. Sayfanın kaynak kodlarını incelediğimde işe yarar bir ipucu bulamayınca, arka planda hangi servislerin çalıştığını ve hangi portların açık olduğunu görmek için port taramasına geçiyorum.
Port taraması için hızından dolayı RustScan aracını tercih ediyorum.

<img width="1000" height="134" alt="image" src="https://github.com/user-attachments/assets/f351025c-51d9-40e3-97e6-27637c384e4d" />

Port Tarama Sonuçları:
Port 80: HTTP (Nginx 1.16.1)
Port 6498: SSH (OpenSSH 7.6p1)
Port 65524: HTTP (Apache httpd 2.4.43)

Adım 2: Port 80 Üzerinde Dizin Taraması ve İlk Flag
Öncelikle 80 portundaki Nginx sunucusu üzerinde yoğunlaşıyorum ve gizli dizinleri keşfetmek için bir dizin taraması gerçekleştiriyorum. Yaptığım tarama sonucunda /hidden dizinini tespit ediyorum.

<img width="1000" height="623" alt="image" src="https://github.com/user-attachments/assets/2cb17fd2-f735-4c41-912f-cd562971fbca" />

Bu dizine gittiğimde beni sadece bir görsel karşılıyor. Sayfa kaynağında bir şey bulamayınca, bu dizinin altında da başka gizli yollar olabileceğini düşünerek Gobuster aracı ile derinlemesine bir dizin taraması başlatıyorum.
gobuster dir -u http://<HEDEF_IP>/hidden/ -w /usr/share/wordlists/dirbuster/directory-list-lowercase-2.3-medium.txt
Neden bu komut? gobuster dir komutu web dizinlerini brute-force (kaba kuvvet) yöntemiyle tarar. -u parametresi hedef adresi, -w ise tarama yaparken kullanacağımız kelime listesini (wordlist) belirtir.

<img width="1000" height="320" alt="image" src="https://github.com/user-attachments/assets/a99542da-db8a-4da8-ab21-567cd220a4b0" />


Tarama sonucunda /hidden/whatever adında yeni bir dizin keşfediyorum. Bu sayfayı ziyaret edip sayfa kaynağını incelediğimde, gizlenmiş bir base64 değeri buluyorum. Bu hash'i çözdüğümde başarıyla ilk flag'e ulaşıyorum.

<img width="1000" height="591" alt="image" src="https://github.com/user-attachments/assets/209d784d-c317-4902-8aff-6933c963645b" />

<img width="269" height="518" alt="image" src="https://github.com/user-attachments/assets/76b16d0d-865a-45d0-bd65-d62c46d0d9e8" />

1. Flag: flag{f****_f***}

Adım 3: Port 65524 (Apache) ve Gizli İpuçları
RustScan çıktımızda bir HTTP servisinin de 65524 portunda çalıştığını görmüştük. Bu adresi tarayıcımda açtığımda karşıma varsayılan Apache 2 Debian sayfası çıkıyor.

<img width="1000" height="658" alt="image" src="https://github.com/user-attachments/assets/f5d0ac06-ae11-4ff8-b547-54a2f74984ca" />

Web sızma testlerinde geleneksel bir alışkanlık olarak sayfa kaynağını kontrol ediyorum. Dikkatli bir inceleme sonucunda, sayfa kodlarının arasına gizlenmiş 3. Flag ile karşılaşıyorum.

<img width="882" height="93" alt="image" src="https://github.com/user-attachments/assets/9e0ba85e-c247-4ad1-8038-d722d1473847" />

3. Flag: flag{***********************}

Keşfe devam etmek adına web sunucularında arama motorlarının taramasını kısıtlamak için kullanılan /robots.txt dosyasını kontrol ediyorum. http://<HEDEF_IP>:65524/robots.txt adresine gittiğimde bir User-Agent bilgisi buluyorum. Bu değeri çevrimiçi araçlar yardımıyla çözüyorum.

<img width="1000" height="431" alt="image" src="https://github.com/user-attachments/assets/02152fab-b059-4e4e-9b8e-ed5c1d7ca7c9" />

2. Flag: flag{1m_******_fl4g}

Yine bu porttaki ana sayfanın kaynak kodlarını incelerken gözüme çarpan bir diğer detay, Base62 algoritması ile şifrelenmiş bir metin oluyor.

<img width="637" height="202" alt="image" src="https://github.com/user-attachments/assets/815e5cf0-18ec-436c-9d50-43d3622d7dfd" />

bu değeri CyberChef veya online dekoderler vasıtasıyla çözüyorum ve karşımıza yeni bir gizli dizin çıkıyor : /n0th1ng3lsm4tt3r.

<img width="364" height="52" alt="image" src="https://github.com/user-attachments/assets/13daf001-c3b5-40b4-bb43-0238a9cde560" />

Adım 4: Steganografi ve Kullanıcı Girişi (SSH)
Elde ettiğim yeni gizli dizini (/n0th1ng3lsm4tt3r) ziyaret ettiğimde Matrix temalı bir sayfa beni karşılıyor.

<img width="1000" height="512" alt="image" src="https://github.com/user-attachments/assets/f451a29f-dad5-441f-b1a0-e165d79aab0d" />

Sayfa kaynağına baktığımda ise bir adet binarycodepixabay.jpg resmi ve altında bir şifreleme özeti görüyorum.
İlk olarak Gost Hash değerini internet üzerinde araştırarak kırıyorum ve şu parolayı elde ediyorum : mypasswordforthatjob.

<img width="610" height="180" alt="image" src="https://github.com/user-attachments/assets/59559add-fef8-490d-8940-e8f62e2bdf6e" />

<img width="786" height="343" alt="image" src="https://github.com/user-attachments/assets/cd355363-5cf7-4f17-ba93-84c407763da2" />


Sayfadaki resmin içine bir veri gizlenmiş olabileceğinden şüphelenip resmi indiriyorum. İçindeki gizli dosyayı çıkartmak için Steghide aracını kullanıyorum.
steghide --extract -sf binarycodepixabay.jpg
Neden bu komut? steghide --extract resim veya ses dosyalarının içine gizlenmiş verileri ayıklar. -sf (source file) parametresi ise üzerinde işlem yapacağımız dosyayı seçer.

Komutu çalıştırdıktan sonra benden istenen parolaya, az önce hash kırarak elde ettiğim mypasswordforthatjob şifresini giriyorum. İşlem başarılı oluyor ve içeriden secrettext.txt adında bir metin dosyası çıkıyor.

<img width="1000" height="182" alt="image" src="https://github.com/user-attachments/assets/f41e6a31-72f0-41ac-8eb7-0dcbf34823b3" />

Dosya içeriğini okuduğumda karşıma bir kullanıcı adı ve binary kodlar çıkıyor:
Kullanıcı Adı: boring
Şifre (Binary): 01101001 01100011 ...
Bu binary kodları tekrar CyberChef üzerinde metne dönüştürerek SSH parolasını netleştiriyorum.

<img width="958" height="429" alt="image" src="https://github.com/user-attachments/assets/bf4698d4-ad03-4ece-a667-825285b8b63b" />

Username: boring
Password: iconvertedmypasswordtobinary

Artık hedef makinede geçerli bir kullanıcı hakkına sahibim. Açık olan 6498 SSH portunu kullanarak sisteme uzaktan bağlanıyorum.
ssh boring@<HEDEF_IP> -p 6498

<img width="806" height="458" alt="image" src="https://github.com/user-attachments/assets/fb3c0514-df93-49bb-8138-8ad0ea0df237" />

Adım 5: Yetki Yükseltme (Privilege Escalation) ve Root Flag
Sisteme boring kullanıcısı olarak başarıyla giriş yaptıktan sonra kullanıcı flag'ini okumak istiyorum. Ancak sistem bize küçük bir oyun oynamış ve flag metnini ROT13 algoritması ile şifrelemiş. Metni basit bir ROT13 decoder ile çözerek User Flag'i alıyorum.

<img width="494" height="66" alt="image" src="https://github.com/user-attachments/assets/6c280247-4d59-4077-b787-6215c772098d" />

<img width="949" height="567" alt="image" src="https://github.com/user-attachments/assets/347c40ec-0872-4d98-9494-d130895ae490" />


User Flag: flag{******33msn0rm4l}

Sırada makineyi tamamen ele geçirmek, yani Root yetkilerine yükselmek var. İlk olarak kısıtlı yetkilerimizi görmek adına klasik sudo -l komutunu deniyorum fakat buradan bir sonuç alamıyorum. Ardından sistemde otomatik olarak arka planda çalışan görevleri incelemek için cronjobları kontrol ediyorum.

<img width="896" height="336" alt="image" src="https://github.com/user-attachments/assets/e05a9740-0350-42f6-8ded-f0fd965e36a2" />

Çıktıda en altta yer alan .mysecretcronjob.sh görevi doğrudan dikkatimi çekiyor. Bu dosyanın izinlerini kontrol etmek için şu komutu çalıştırıyorum:
ls -la /var/www/.mysecretcronjob.sh
Yaptığım kontrolde, bu gizli script dosyasının benim bulunduğum boring kullanıcısı tarafından yazılabilir olduğunu görüyorum.
Saldırı Senaryomuz (Exploit):
Sistem, her dakika bu script dosyasını root yetkileriyle otomatik olarak çalıştırıyor. Eğer ben bu dosyanın içerisine kendi zararlı Reverse Shellimi yazabilirsem, sistem bu dosyayı root olarak çalıştırdığı an bana root yetkilerinde bir bağlantı verecektir. Senaryo son derece basit ve etkili.
Kendi Kali Linux makinemde bağlantıyı yakalayabilmek için Netcat ile bir port dinlemesi başlatıyorum:
nc -lvnp 4444
Ardından hedef makinede yazma yetkim olan .mysecretcronjob.sh dosyasının içine Kali makineme bağlantı gönderecek olan klasik tek satırlık reverse shell kodumu enjekte ediyorum.

<img width="1000" height="104" alt="image" src="https://github.com/user-attachments/assets/e1f971e8-2696-4852-82cf-602a1dd3bfab" />

Bir dakika kadar bekledikten sonra, cronjob tetikleniyor ve Kali makineme gelen bağlantı sayesinde sisteme root (en yetkili kullanıcı) olarak erişim sağlıyorum! Hemen root dizinine giderek son flag'i de okuyorum.

<img width="611" height="420" alt="image" src="https://github.com/user-attachments/assets/c953c9c9-59f8-4421-96f6-1db78707efa8" />

Root Flag: flag{********************}

Bu odayı da başarılı bir şekilde tamamladım. Siber güvenlik için temel düzeyde bilgiler içeren keyifli bir sızma testi oldu. Okuduğunuz için teşekkürler, sonraki yazılarımda görüşmek üzere.
