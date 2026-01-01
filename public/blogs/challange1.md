# Challange001.apk Frida ile Çözümü (Android CTF)

Bu yazıda eğitim amaçlı bir Android reverse engineering challenge’ı olan **Challange001.apk** uygulamasını **Frida** kullanarak nasıl çözdüğümü adım adım anlatıyorum. Amaç; uygulamadaki kontrol (check) mantığını runtime’da hook’layıp doğru koşulu sağlayarak flagi bulmak.

---

## 1) APK’yı Emülatöre Kurma

Önce APK’yı emülatöre yüklüyoruz ve emülatörümüzü yanda açık tutuyoruz

![apk install](/blogs/img/challenge001/1.png)

![apk install](/blogs/img/challenge001/2.png)

Sayı girmemizi istiyor istediği şeyi verirsekte flagi verecek sistem bu şekilde.

![apk install](/blogs/img/challenge001/3.png)
---

## 2) Frida Server Kurulumu (x86)

Cihaz mimarisini öğreniyoruz:

```bash
adb -s 192.168.56.103:5555 shell getprop ro.product.cpu.abi
```

Çıktı bende **x86** olduğu için kendime uygun frida-server’ı githubdan indiriyorum:

* `frida-server-17.5.1-android-x86`
![apk install](/blogs/img/challenge001/4.png)

Ardından frida-server’ı cihaza atıp çalıştırıyoruz (genel akış):

```bash
adb -s 192.168.56.103:5555 push frida-server-17.5.1-android-x86 /data/local/tmp/frida-server
adb -s 192.168.56.103:5555 shell "chmod 755 /data/local/tmp/frida-server"
adb -s 192.168.56.103:5555 shell "/data/local/tmp/frida-server &"
```

## 3) Frida’nın Çalıştığını Doğrulama (PID)

Uygulamayı açtıktan sonra süreçleri kontrol ediyoruz ve PID’yi görüyoruz.

Örnek olarak  **2215 PID** de frida’nın çalıştığını net gördük:

![pid kontrol](/blogs/img/challenge001/5.png)

---

## 4) Statik Analiz (jadx)

Şimdi APK’yı **jadx** ile açıp `MainActivity` tarafına bakıyoruz.

Burada mantık şu şekilde:

* Uygulama bir **random değer** üretiyor (ekranda r4 gibi görünen kısım)
* Bu değer üzerinde bir işlem yapıyor:

  * `r4 * 2`
  * sonra `+ 4`
* Sonuç, bizim girdiğimiz input (`r5`) ile **eşitse** flagi bize veriyor
* Değilse hata veriyor

![jadx main logic](/blogs/img/challenge001/6.png)
---

## 5) Runtime Bypass: Frida Hook

Statik tarafta gördüğümüz kontrol “random” içerdiği için sürekli değişiyor.
Bu yüzden en temiz yol: **runtime’da hook’layıp değerleri sabitlemek.**

Ne yapacağız:

* random olan `r4` değerini **4** yapıp r4=a=4 haline getirdik
* input kontrolünü de **12** olacak şekilde ayarladık r5=b=12 yaptık.

Çünkü:

```
(4 * 2) + 4 = 12
```
> Not: Burada amaç **random kaynaklı kıyaslamayı** kontrol altına almak.
>  “r4 = 4” ve “r5 = 12” kurgusu tam olarak bunu yapıyor. ve tekhook.js olarak kaydettiğimiz hooku çalıştırma vakti

![hook script](/blogs/img/challenge001/7.png)

---

## 6) Frida ile Çalıştırma

Hook’u çalıştırıp uygulamayı frida ile ayağa kaldırıyoruz:

![frida run](/blogs/img/challenge001/8.png)

Ardından uygulamada input alanına girdi yaptığında artık kontrol bizim sabitlediğimiz değerlere göre çalıştığı için flagi otomatik olarak verecek uygulamaya dönelim.

![frida run](/blogs/img/challenge001/9.png)

---

## Sonuç

Bu çözümde:

* APK emülatöre kuruldu
* Cihaz mimarisi (x86) tespit edilip uygun frida-server çalıştırıldı
* jadx ile kontrol mantığı bulundu (random + matematik)
* Frida hook ile random değer sabitlenerek kontrol bypass edildi
* Doğru koşul sağlanıp flag alındı.

Bu tarz mini challenge’lar, frida ile “statik analizde görülen kontrolü” pratikte nasıl bypass edeceğini öğretmesi açısından çok iyi. Mobilde ctfler çözmeye devam ediyoruz önceki çözümlerde frida yoktu önemli bir araç olduğu için challange002.apk yı da çözmeyi düşünüyorum.

