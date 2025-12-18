# DumpMe Memory Forensics Challenge Write-Up

Bu yazıda, **CyberDefenders DumpMe** bellek analizi senaryosunu **Volatility 3** ve **Volatility 2** kullanarak adım adım çözüyoruz. Amaç; bir Windows 7 sistemine ait RAM dökümünden sistem bilgileri, zararlı süreçler, ağ bağlantıları ve kullanıcı artefaktlarını ortaya çıkarmak. Senaryodaki 16 soruyu tek tek bulacağız.
---

## Kurulum ve Hazırlık

Volatility 2 ve 3 ü bilgisayarınızda kurulu şekilde hazırlamak şart.
Analize başlamadan önce güncel bir çalışma ortamı oluşturalım:

```bash
# Pip güncelleme ve Volatility 3 kurulumu
pip install --upgrade pip
pip install volatility3
```

```bash
# Sanal ortam (venv) oluşturma ve aktif etme
python3 -m venv venv
source bin/activate
```

Ardından, bellek dökümümüzün (.mem) bulunduğu dizine gidiyoruz:

```bash
cd /home/kali/Downloads/Adli/temp_extract_dir
```

---
## Sistem Bilgilerini Belirleme (OS Info) 

Analizin ilk adımı, imajın hangi işletim sistemine ait olduğunu ve mimarisini belirlemektir. Volatility 3’te `windows.info` plugin’ini kullanıyoruz:

```bash
vol -f Triage-Memory.mem windows.info
```

![windows.info çıktısı](/blogs/img/DumpMeWriteUp/windowsinfo.png)

**Not:** Bu komut sonucunda Kernel Base, Layer Name ve OS versiyonu gibi kritik detayları elde ederiz.

---
## 16 Soruya Başlayalım
### Soru 1: Triage-Memory.mem dosyasının SHA1 hash değeri nedir?

Analize başlamadan önce imajın bütünlüğünü doğrulamak için hash değerini alıyoruz. `sha1sum` aracı ile bu işlemi gerçekleştirebiliriz:

```bash
sha1sum Triage-Memory.mem
```

![sha1sum çıktısı](/blogs/img/DumpMeWriteUp/sha1sum.png)

---
### Soru 2: Bu makine için en uygun Volatility profili hangisidir?

`windows.info` komutu ile elde ettiğimiz çıktıda **NTBuildLab** kısmına bakarak uygun profili belirliyoruz:

```bash
vol -f Triage-Memory.mem windows.info
```

**Yanıt:** `Win7SP1x64 (Build 7601)`

---
Analiz derinleşiyor. Şimdi elde ettiğimiz bulguları teknik detaylarla inceleyelim.

---
### Soru 3: notepad.exe işleminin process ID’si (PID) nedir?

Sistemdeki aktif işlemleri ve bunların PID değerlerini görmek için `pslist` plugin’ini kullanıyoruz:

```bash
vol -f Triage-Memory.mem windows.pslist
```

![pslist çıktısı](/blogs/img/DumpMeWriteUp/pslist.png)

**Yanıt:** `3032`

---
### Soru 4: wscript.exe’nin çocuk (child) işleminin adı nedir?

İşlemler arasındaki ana-çocuk (parent-child) ilişkisini hiyerarşik bir yapıda görmek için `pstree` komutunu kullanıyoruz:

```bash
vol -f Triage-Memory.mem windows.pstree
```

![pstree çıktısı](/blogs/img/DumpMeWriteUp/pstree.png)

**Yanıt:** `\vhjReUDEuumrX.vbs`

---
### Soru 5: RAM dökümü alındığı anda makinenin IP adresi neydi?

Ağ bağlantılarını ve aktif soketleri incelemek için `netscan` plugin’ini kullanıyoruz:

```bash
vol -f Triage-Memory.mem windows.netscan
```

![netscan çıktısı](/blogs/img/DumpMeWriteUp/netscan.png)

Yapılan incelemede aşağıdaki bağlantılar tespit edilmiştir:

* **Kurban IP:** `10.0.0.101`
* **Saldırgan IP:** `10.0.0.106`

---
### Soru 6: Enfekte PID’e göre saldırganın IP adresi nedir?

Bellek bölgelerinde enjekte edilmiş şüpheli kodları bulmak için `malfind` plugin’ini kullanıyoruz:

```bash
vol -f Triage-Memory.mem windows.malfind
```

![malfind çıktısı](/blogs/img/DumpMeWriteUp/malfind.png)

**Enfekte PID:** `3496`
(wscript.exe üzerinden tetiklenen süreç)

---
### Soru 7: VCRUNTIME140.dll ile ilişkili kaç tane işlem vardır?

Belirli bir DLL’in hangi süreçler tarafından yüklendiğini görmek için `dlllist` plugin’ini kullanıyoruz:

```bash
vol -f Triage-Memory.mem windows.dlllist | grep "VCRUNTIME140.dll"
```

![dlllist grep çıktısı](/blogs/img/DumpMeWriteUp/dlllist.png)

**Yanıt:** `5` adet işlem

---
### Soru 8: Enfekte işlemi dump ettikten sonra elde edilen dosyanın MD5 hash değeri nedir?

Zararlı süreci dışarı aktarmak için dump işlemi gerçekleştiriyoruz:

```bash
vol -f Triage-Memory.mem windows.dumpfiles --pid 3496
```

Dump edilen dosya üzerinde hash hesaplıyoruz:

```bash
md5sum dumped_file.bin
```

![dump + md5sum çıktısı](/blogs/img/DumpMeWriteUp/md5sum.png)

---
### Soru 9: Bob hesabının LM hash değeri nedir?

Kullanıcı parola hash’lerini almak için bu aşamada ilk defa Volatility 2 kullanıyoruz çünkü Volatility 3 ile çözülmüyor çok denememe rağmen yapamadım siz gene uğraşabilirsiniz:

```bash
python2 vol.py -f Triage-Memory.mem --profile=Win7SP1x64 hashdump
```

**Yanıt:**
`aad3b435b51404eeaad3b435b51404ee`

---
### Soru 10: 0xfffffa800577ba10 adresindeki VAD düğümünün memory protection türü nedir?

![vadwalk/vadinfo çıktısı](/blogs/img/DumpMeWriteUp/vadinfo.png)

**Yanıt:** `PAGE_READONLY`

---
### Soru 11: 0x00000000033c0000 – 0x00000000033dffff arasındaki VAD’ın koruma türü nedir?

![vadwalk çıktısı](/blogs/img/DumpMeWriteUp/vadwalk.png)

**Yanıt:** `PAGE_NOACCESS`

---
### Soru 12: Makinede çalıştırılmış VBS scriptinin adı nedir?

**Yanıt:** `vhjReUDEuumrX.vbs`

---
### Soru 13: 2019–03–07 23:06:58 UTC tarihinde çalıştırılan programın adı nedir?

![zaman damgası çıktısı](/blogs/img/DumpMeWriteUp/skype_time.png)

**Yanıt:** `Skype.exe`

---
### Soru 14: Bellek dökümü alındığı sırada notepad.exe içine ne yazılmıştı?

![notepad dump + strings çıktısı](/blogs/img/DumpMeWriteUp/notepad_dump.png)

**Yanıt:**
`flag{G00d_J0b_Dud3_Y0u_F0und_1t}`

---
### Soru 15: 59045 numaralı file record’a karşılık gelen dosyanın kısa adı (short name) nedir?

```bash
python2 vol.py -f Triage-Memory.mem --profile=Win7SP1x64 mftparser
```

![mftparser çıktısı 1](/blogs/img/DumpMeWriteUp/mft_record.png)

![mftparser çıktısı 2](/blogs/img/DumpMeWriteUp/mft_record2.png)

**Yanıt:** `EMPLOY~1.XLS`

---
    ### Soru 16: Bu makine meterpreter ile exploit edilmişti. Enfekte PID nedir?

**Enfekte PID:** `3496 (UWkpjFjDzM.exe)`

---

## Sonuç

Bu yazıda, CyberDefenders DumpMe bellek analizi senaryosunu Volatility 3 ve Volatility 2 kullanarak adım adım inceledik. RAM dökümünden sistem, süreç, ağ ve zararlı artefaktları ortaya çıkararak gerçek bir DFIR analizinde izlenecek temel yaklaşımı uyguladık. Çalışma, bellek adli bilişimin olay müdahalesinde ne kadar kritik bir rol oynadığını açıkça göstermektedir.

---

