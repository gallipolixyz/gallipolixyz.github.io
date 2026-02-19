# Challange002.apk Frida ile Çözümü (Android CTF)

Bu yazıda birincisini çözdüğümüz apknın devamı olan **Challange002.apk** adlı Android reverse engineering challenge’ını **Frida** kullanarak çözüyoruz.  
Amaç; uygulama içindeki flag mekanizmasını analiz edip, **runtime’da ilgili fonksiyonu doğrudan çağırarak** flag’i elde etmek.

---

## APK Kurulumu

İlk olarak APK’yı emülatöre yüklüyoruz:

> Not: APK dosyasını yanlışlıkla `001.apk` olarak adlandırmışım arkadaşlar ama kurulum ve çözüm süreci etkilenmemektedir.

![apk install](/blogs/img/challange002/1.png)

---

## Frida Kurulumu (x86)

Cihaz mimarisini kontrol ediyoruz:

```bash
adb -s 192.168.56.103:5555 shell getprop ro.product.cpu.abi
```

Çıktı **x86** olduğu için GitHub üzerinden uygun frida-server’ı indiriyoruz:

* `frida-server-17.5.1-android-x86`
![apk install](/blogs/img/challange002/2.png)


frida-server’ı çalıştırdıktan sonra kontrol ediyoruz:

PID’leri görebiliyorsak frida doğru şekilde çalışıyor demektir.

Gördüğünüz gibi 2788te çalışıyor

![frida-ps kontrol](/blogs/img/challange002/3.png)

---

## Uygulama Davranışı

Uygulamayı açtığımızda ekranda **“hook me”** ifadesi yer alıyor.
Bu, uygulamanın doğrudan **runtime hook** ile çözülmesinin beklendiğini gösteren açık bir ipucu.

![hook me ekranı](/blogs/img/challange002/4.png)

---

## Statik Analiz (jadx)

APK’yı **jadx** ile açtığımızda `MainActivity` içerisinde:

* Açık şekilde **kriptolanmış bir flag**
* Bu flag’i döndüren bir fonksiyon:

  ```java
  get_flag(int a)
  ```

dikkat çekiyor.

Kriptolanmış flag CyberChef ile de çözülebilir;
ancak burada **asıl kritik nokta**, flag’e **doğrudan fonksiyon çağrısı ile erişilebilmesi**.

![jadx mainactivity](/blogs/img/challange002/5.png)

---

## Frida ile Doğrudan Flag Çağırma

Bu noktada yapmamız gereken şey çok basit:

* `MainActivity` sınıfına hook olmak
* `get_flag(4919)` fonksiyonunu **runtime’da çağırmak**

### Frida Script (`ozan.js`)

```js
Java.perform(function () {
    var Main = Java.use('com.ad2001.frida0x2.MainActivity');
    Main.get_flag(4919);
});
```
![jadx mainactivity](/blogs/img/challange002/6.png)

---

## Frida ile Çalıştırma

Uygulamanın PID’i üzerinden frida’yı attach ediyoruz:

```bash
frida -U -p 2788 -l ozan.js
```
![flag ekranı](/blogs/img/challange002/7.png)

Script çalıştırıldığında flag **doğrudan emülatör ekranına** düşüyor.

![flag ekranı](/blogs/img/challange002/8.png)

---

## Sonuç

Bu çözümde:

* APK emülatöre kuruldu
* Cihaz mimarisi belirlenerek doğru frida-server kullanıldı
* jadx ile `get_flag()` fonksiyonu tespit edildi
* Frida ile fonksiyon **doğrudan runtime’da çağrıldı**
* Flag herhangi bir bypass gerekmeksizin elde edildi

**Challange002**, özellikle şunu çok net gösteriyor:

> Eğer uygulama içinde kritik fonksiyonlar korunmadan bırakılmışsa,
> Frida ile birkaç satır kod yazarak doğrudan hedefe ulaşmak mümkündür. Cyberchefe bakmadan bile hızlıca fonksiyonu çektik asıl mesaj buydu bu ctfte. 


