# TryHackMe-Wonderland Writeup
![](/blogs/img/wonderland/1.png)
TryHackMe’nin Wonderland odası, yetki yükseltme tekniklerini uygulamalı olarak kavramak için tasarlanmış mükemmel bir senaryo. Bu yazıda; keşif aşamasından başlayarak yetki yükseltme yöntemleriyle sistemde nasıl tam yetki (root) elde ettiğimi paylaşacağım.

## 1. Keşif Aşaması 
Öncelikle hedef makinede hangi servislerin çalıştığını anlamak için bir Nmap taraması başlatalım:
![](/blogs/img/wonderland/2.png)
Bulgular: Port 22(SSH),Port 80(HTTP) açık.

Öncellikle 80 portunu ziyaret edelim. 
![](/blogs/img/wonderland/3.png)
İpucunda ki gibi tavşan resmini takip edelim. Resmi indirip, steghide ile analizleyelim.
![](/blogs/img/wonderland/4.png)
Buradaki ipucunun bizi yeni bir alt dizine yönlendirdiğini görüyoruz.
![](/blogs/img/wonderland/5.png)
Sayfanın kaynak kodunu incelediğimizde, kullanıcı adı ve şifreden oluşan uzun bir string buluyoruz.
Daha önce ssh portunu açık bulmuştuk,bu bilgilerle ssh bağlantısı kurabiliriz.
```bash
ssh alice@10.10.10.10
```
Parolayı girdiğimizde bağlantı başarıyla gerçekleşiyor ve artık hedef sistemde alice kullanıcısı olarak oturum açmış bulunuyoruz.

## 2. Yetki Yükseltme
İçeride keşif yapmaya ls -la komutu ile başlayabiliriz. Çünkü bu komut sadece görünür dosyaları değil; sistemde gizlenmiş dosyaları, dosya izinlerini ve sahiplik bilgilerini bize gösterir.
![](/blogs/img/wonderland/7.png)

Burada walrus_and_the_carpenter.py dosyası üzerinden açık yakalayabileceğimiz için ilgimizi çekiyor. 

Bu noktada yetkilermizi görebikmek için sudo -l komutunu kullanıyoruz.Bu mevcut kullanıcının o sistemde hangi komutları hangi kullanıcının yetkileriyle çalıştırmaya izni olduğunu listeler.
![](/blogs/img/wonderland/8.png)
Bu incelememizle alice kullanıcısının şifre girmeden /home/alice/walrus_and_the_carpenter.py dosyasını rabbit kullanıcısı yetkileriyle çalıştırabildiği görüyoruz.
Eğer biz alice kullanıcısından rabbit kullanıcısına ve onun erişimine sahip olduğu dosyalara ulaşırsak, bu teknik olarak Yatay Yer Değiştirme yapmış olduğumuz anlamına gelir. Yatay yer değiştirme; sistemde aynı veya benzer yetki seviyesindeki başka bir kullanıcıya geçmek demektir.
Aynı veya benzer yetki seviyesindeki başka bir kullanıcıya geçmek, bize daha fazla dosya erişimi ve dolayısıyla daha geniş bir saldırı yüzeyi kazandırır. Bu sayede yanlış yapılandırılmış yeni dosyalar keşfedebilir ve bizi root yetkisine götürecek kritik ipuçlarına ulaşabiliriz.
Bu nedenlerle, stratejimizi user alice’den user rabbit’e geçmek üzerine kuruyoruz.

![](/blogs/img/wonderland/9.png)
 
Dosya içeriğini incelediğimizde bizi oldukça uzun bir şiir ve bu şiirden random kütüphanesini kullanarak rastgele 10 satır bastıran bir Python kodu karşılıyor.

Burada Python Library Hijacking tekniğini kullanabileceğimizi düşünüyoruz.Bunun temel nedeni, Python’ın modülleri import ederken izlediği hiyerarşidir.

Python bir scripti çalıştırdığında, sys.path listesindeki dizinleri sırayla kontrol eder. Bu listenin en başında her zaman script’in yürütüldüğü mevcut dizin yer alır. Dolayısıyla sistemde yüklü olan orijinal random kütüphanesi /usr/lib/python3.6 altında bulunsa bile, Python öncelikle bulunduğumuz klasörü kontrol eder.

Eğer bulunduğumuz dizine random.py isminde bir dosya oluşturursak, Python orijinal kütüphaneye gitmeden bizim hazırladığımız zararlı kodu rabbit kullanıcısının yetkileriyle çalıştıracaktır. Özetle; aynı dizinde "sahte" bir kütüphane oluşturarak walrus.py çalıştığında kendi kodumuzu sisteme dahil etmiş olacağız.

Bu zafiyeti kullanmak için öncellikle nano ile random.py isminde bir dosya oluşturup içine şu scripti yazmalıyız.
```bash
import os
os.system("/bin/bash")
```
Bu kod, Python aracılığıyla işletim sistemine komut göndererek, hedef kullanıcının (bu senaryoda rabbit) yetkileriyle bir shell başlatmamıza olanak sağlar.

```bash
sudo -u rabbit /usr/bin/python3.6 /home/alice/walrus_and_the_carpenter.py
```
Bu komutu çalıştırarak zafiyeti tetikleriz ve sistemin bizi otomatik olarak rabbit kullanıcısının shell`ine aktardığını görürüz.
![](/blogs/img/wonderland/10.png)

Rabbit kullanıcısının ana dizinine geçip dosyaları listelediğimizde, üzerinde SUID (Set User ID) biti aktif olan teaParty adında bir dosya ile karşılaşıyoruz.

Normal şartlarda bir dosya, onu çalıştıran kişinin yetkileriyle işlenirken; SUID biti aktif olan dosyalar, kim tarafından çalıştırılırsa çalıştırılsın doğrudan dosya sahibinin yetkileriyle yürütülür. Bu durum, düşük yetkili bir kullanıcının, dosya sahibi olan üst kullanıcının haklarını devralmasına imkan tanır.

```bash
rabbit@wonderland:/home/rabbit$ ./teaParty
Welcome to the tea party!
The Mad Hatter will be here soon.
Probably by Wed, 02 Feb 2026 08:06:29 +0000
Ask very nicely, and I will give you some tea while you wait for him
give me tea
Segmentation fault (core dumped)
```
Dosya çalıştırıldığında Hatter’ın partiye geleceği bilgisi ekrana basılmakta ve uygulama kullanıcıdan girdi beklemektedir. Ancak birşeyler yazdığımızda ekrana Segmentation Fault hatası döndürülmektedir.
Bu noktada dosyayı daha detaylı incelemek için indiriyoruz ve ghidra ile analiz ediyoruz .
![](/blogs/img/wonderland/12.png)
teaParty dosyasını analiz ettiğimizde, programın bir Path Hijacking (veya Relative Path) zafiyeti barındırdığını görüyoruz. Kodun işleyişindeki kritik noktaları şu şekilde özetleyebiliriz:

-Yetki Ataması: Kod içerisindeki setuid(0x3eb) ve setgid(0x3eb) satırları, programın belirli bir kullanıcı (UID 1001 - Hatter) yetkisiyle çalışacağını gösterir. Dosya üzerindeki SUID biti sayesinde, bu programı çalıştırdığımızda otomatik olarak hedef kullanıcının haklarını devralırız.

-Güvensiz Komut Çağrısı: Program, sistem komutlarını yürütmek için system() fonksiyonunu kullanıyor. Analiz ettiğimizde /bin/echo komutunun tam yoluyla (absolute path) çağrıldığı için güvenli olduğunu; ancak date komutunun tam yol belirtilmeden, sadece ismiyle çağrıldığını görüyoruz.
   
Buradaki temel zafiyet şudur: Program date komutunu çalıştırmak istediğinde, işletim sistemi bu komutu bulabilmek için kullanıcının $PATH çevresel değişkeninde tanımlı olan dizinleri sırayla kontrol eder.

Eğer biz, kendi kontrolümüzde olan bir dizine date isimli zararlı bir dosya oluşturup bu dizini $PATH değişkeninin en başına eklersek; sistem orijinal date komutuna ulaşmadan önce bizim dosyamızı bulacak ve hatter kullanıcısının yetkileriyle çalıştıracaktır.
```bash
# Zararlı date dosyasını oluşturuyoruz
rabbit@wonderland:/home/rabbit$ echo "/bin/bash" > date

# Dosyaya çalıştırma yetkisi veriyoruz
rabbit@wonderland:/home/rabbit$ chmod +x date

# Mevcut dizini PATH değişkeninin en başına ekliyoruz
rabbit@wonderland:/home/rabbit$ export PATH=/home/rabbit:$PATH

# Zafiyet barındıran dosyayı çalıştırıyoruz
rabbit@wonderland:/home/rabbit$ ./teaParty

Welcome to the tea party!
The Mad Hatter will be here soon.
```
Bu adımların sonunda, sistemin bizim sahte date dosyamızı çalıştırmasıyla birlikte otomatik olarak hatter kullanıcısına geçiş yapmış oluyoruz.

## 3.Root Yetkisi Elde Etme 
Şimdi Hatter dizininin içeriğini inceleyelim:
![](/blogs/img/wonderland/13.png)
Buradaki password.txt dosyasında bulunan şifreyi kullanarak SSH üzerinden bağlantı sağlabiliriz ve Hatter kullanıcısı ile oturum açabiliriz.

Hatter kullanıcısının dizininde bir süre keşif yapsam da işe yarar başka bir ipucu bulamadım. Bu nedenle, sistem genelinde arama yapmak amacıyla 
```bash
getcap -r / 2>/dev/null 
```
komutunu çalıştırarak özel yetkilere sahip dosyaları taradım:
![](/blogs/img/wonderland/14.png)

Komutu çalıştırdığımızda, /usr/bin/perl (ve perl5.26.1) dosyasının cap_setuid+ep yetkisine sahip olduğunu görüyoruz. 

Bu ifade şu anlama gelir; normalde linux sistemlerinde bir işlem ya tam yetkilidir (root) ya da kısıtlı yetkilere sahiptir. Ancak bazı durumlarda, bir programın tüm root yetkilerine sahip olmadan sadece belirli bir işi yapabilmesi istenir. İşte Capabilities,root yetkilerini küçük parçalara bölerek sadece ihtiyaç duyulan yetkinin ilgili programa atanmasını sağlar.

Bizim tespit ettiğimiz cap_setuid yeteneği ise programa şunu der :Sen çalışırken istersen kendi kimliğini başka bir kullanıcıyla değiştirebilirsin.
Bu durum, Perl aracılığıyla root kimliğine bürünerek tam yetki elde edebileceğimiz anlamına gelir.

#### GTFOBins ile Root Shell Elde Etme
Tespit edilen zafiyeti sömürmek ve root haklarına erişmek için, Linux binary güvenliğini ve yanlış yapılandırmalarını dökümante eden GTFOBins metodolojisinden yararlanıyoruz. /usr/bin/perl üzerindeki cap_setuid yeteneği, aşağıdaki tek satırlık komut ile istismar edilebilir:
```bash
perl -e 'use POSIX qw(setuid); POSIX::setuid(0); exec "/bin/bash";
```
Kodun Mantığı:Setuid(0) fonksiyonu ile işletim sistemine 'Benim kullanıcı kimliğimi (UID) 0 yani root yap' talimatını verir. Sistemde Perl'e bu yetkiyi daha önce tanımladığımız için (cap_setuid), işletim sistemi bu isteğimizi reddetmez ve bizi root yapar. Sonrasında exec "/bin/bash" ile en yetkili kullanıcı olarak yeni bir terminal açmış oluruz.

Bu aşamanın ardından sistem üzerinde tam yetki (root) elde edilmiştir. CTF kapsamında hedeflenen flag dosyalarına erişilerek oda tamamlanır.
![](/blogs/img/wonderland/15.png)
