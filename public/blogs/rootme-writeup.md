# TryHackMe RootMe Write-up

![kapak](/blogs/img/rootme-writeup/1.png)

Bugün sizlerle beraber TryHackMe’de bulunan **RootMe** isimli odayı çözeceğiz.

## 1. Nmap Taraması

Makineleri başlattıktan sonra ilk olarak hedef makineye Nmap taraması yapıyoruz.

![nmap-taramasi](/blogs/img/rootme-writeup/2.png)

**Komut:**

```bash
nmap -sS -sV -p- 10.114.154.109
```

- `-sS` parametresi TCP SYN taraması yapmamızı sağlar.
- `-sV` parametresi portlarda versiyon taraması yapmamızı sağlar.
- `-p-` parametresi tüm portları taramamızı sağlar.

Hedefte yaptığımız Nmap taraması sonucu hedefte **2 portun açık** olduğunu ve bu portların da **22 ve 80** numaralı portlar olduğunu keşfettik. 22 numaralı portta SSH servisi ve 80 numaralı portta da Apache HTTP servisi çalışmakta.

### Sorular

**Hedef makinede kaç port açık?**

> Cevap: `2`

**Hangi Apache sürümü çalışıyor?**

> Cevap: `2.4.41`

**22. portta hangi servis çalışıyor?**

> Cevap: `ssh`

---

## 2. Gobuster ile Dizin Taraması

Bu noktadan sonra bizden hedef sunucunun web sunucusunda Gobuster ile alt dizin taraması yapmamızı istiyor.

![gobuster-taramasi](/blogs/img/rootme-writeup/3.png)

**Komut:**

```bash
gobuster dir -u http://10.114.154.109/ -w /usr/share/wordlists/dirb/common.txt
```

- Gobuster aracında `dir` modu, web sunucularındaki gizli dizinleri ve dosyaları bulmak için kullanılan alt komuttur.
- `-u` parametresi ile hedef URL'yi belirttik.
- `-w` parametresi ile kullanacağımız wordlist yolunu belirttik.

Yaptığımız tarama sonucunda elde ettiğimiz çıktıda özellikle iki dizin dikkat çekiyor:

```text
/panel
/uploads
```

**Gizli dizin ne?**

> Cevap: `/panel/`

---

## 3. Dosya Yükleme Açığı

![cevaplar](/blogs/img/rootme-writeup/4.png)

İlgili dizine gittiğimizde bizi bir dosya yükleme sayfası karşılıyor. CTF bizden bu kısımda dosya yükleme açığını kullanarak hedef makineye reverse shell ile erişmemizi istiyor.

![reverse-shell](/blogs/img/rootme-writeup/5.png)

Bu kısımda **Pentestmonkey PHP Reverse Shell** kullandım.

![rev-shell-kod](/blogs/img/rootme-writeup/6.png)

İlgili kısımları (IP ve port) kendime göre düzenledim ve bir listener başlattım.

![listener](/blogs/img/rootme-writeup/7.png)

Şimdi reverse shell'i hedefe yüklemekte sıradaydı. Hedefe PHP uzantılı bir şekilde dosyayı yüklemeye çalıştığımda hata aldım.

![hata](/blogs/img/rootme-writeup/8.png)

Birkaç deneme sonucu hedef web sunucusunun **`.php5` uzantısını kabul ettiğini** fark ettim ve dosyayı bu uzantı ile sisteme yükledim.

![dosya-yuklendi](/blogs/img/rootme-writeup/9.png)

Ardından daha önce Gobuster ile yaptığımız tarama sonucu keşfettiğimiz `/uploads` dizinine gittim ve yüklediğim dosyayı çalıştırdım.

![calistirma](/blogs/img/rootme-writeup/10.png)

Hedefte reverse shell çalıştırmayı başardık.

![shell](/blogs/img/rootme-writeup/11.png)

---

## 4. User Flag

Bizden istenen dosyayı sistemde arayıp içeriğini elde edelim.

![user.txt](/blogs/img/rootme-writeup/12.png)

> **Cevap:** `THM{y0u_g0t_a_sh3ll}`

---

## 5. Privilege Escalation

Şimdi oda bizden **privilege escalation** ile root yetkisi elde etmemizi istiyor.

Bunun için sistemde SUID biti olan dosyaları aradım ve ilgi çekici bir şey buldum.

![suid](/blogs/img/rootme-writeup/13.png)

**SUID izni olan dosyaları arayın, hangi dosya garip?**

> **Cevap:** `/usr/bin/python`

---

## 6. Root Yetkisi

Şimdi bu elde ettiğimiz bilgiden faydalanarak root yetkisi elde edeceğiz. Ardından istenen dosyanın içeriğine erişebileceğiz.

![root](/blogs/img/rootme-writeup/14.png)

> **Cevap:** `THM{pr1v1l3g3_3sc4l4t10n}`

---

## Sonuç

RootMe odasında sırasıyla:

1. Nmap ile açık portları ve servisleri keşfettik.
2. Gobuster ile gizli dizinleri bulduk.
3. `/panel/` dizinindeki dosya yükleme özelliğini inceledik.
4. `.php5` uzantısını kullanarak reverse shell elde ettik.
5. User flag'i bulduk.
6. SUID izinlerine sahip dosyaları kontrol ettik.
7. `/usr/bin/python` üzerinden privilege escalation gerçekleştirdik.
8. Root flag'ine ulaştık.
