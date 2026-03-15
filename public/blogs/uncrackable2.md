# OWASP UnCrackable-Level2 Çözümü (Android Reverse Engineering - Native Analysis)

Bu yazıda **UnCrackable-Level2** Android reverse engineering challenge'ının çözümünü ele alıyoruz. Bu seviyede önceki level'dan farklı olarak kritik kontrol mekanizması **Java değil, native (.so) kütüphanesi** içinde implemente edilmiştir. Amaç; bu native fonksiyonu reverse ederek gizli secret string'i bulmaktır.

---

## Uygulamanın Kurulması ve İlk Gözlem

İlk adımda `uncrackable2.apk` dosyasını cihazımıza aşağıdaki komut ile yüklüyoruz:

```bash
adb install uncrackable2.apk
````

Uygulama açıldığında ekranda **"Enter the secret string"** ifadesi karşımıza çıkıyor.

![uygulama ana ekran](/blogs/img/uncrackable2/1.png)

---

## Hata Mesajının İncelenmesi

Input alanına rastgele bir değer (ozanyudum) girerek hata mesajını gözlemledim. Uygulama açıkça bir doğrulama mekanizması kullanıyor.
Bu noktadan sonra statik analiz aşamasına geçiyoruz. Yudum hocama selamlar bu arada.
![uygulama ana ekran](/blogs/img/uncrackable2/2.png)

---

## APK'nın Analizi (apktool & jadx)

İlk olarak `apktool` ile APK'yı açarak **smali** dosyalarını çıkardım.
Ardından **jadx** kullanarak Java tarafındaki okunabilir kodları inceledim.

![jadx genel görünüm](/blogs/img/uncrackable2/3.png)
![jadx genel görünüm](/blogs/img/uncrackable2/4.png)

---

## MainActivity ve CodeCheck İncelemesi

Yukarıdaki ekranda gördüğünüz gibi `MainActivity` sınıfında `Ctrl + F` ile `nope` kelimesini arattığımda doğrulama mekanizmasına hızlıca ulaştım.
Success ve error akışlarını incelediğimde m.a kısmını gördüm ve m'yi arattım kodda ve çıkane ekranda aşağıdaki yapıyı fark ettim:

![jadx genel görünüm](/blogs/img/uncrackable2/5.png)

* `CodeCheck` sınıfı kullanılıyor onun üstüne de basınca çıkan ekran şu şekilde 

![jadx genel görünüm](/blogs/img/uncrackable2/6.png)

Bu tanım bize şunu söylüyor:
* `foo` isimli native kütüphane yükleniyor
* Kontrol native fonksiyon üzerinden yapılıyor:

👉 **Bu fonksiyon Java'da değil, C/C++ ile yazılmış bir `.so` dosyası içinde implement edilmiş.**

Bu fonksiyon içinde gizli stringi bulacağız.Bu fonksiyon Java'da değil, .so dosyasında. Bu yüzden reverse edeceğiz. Bunun için ghidra aracını kullanacağız ama ilk önce klasörümüzü zip haline getirmemiz lazım araç için

![native fonksiyon çağrısı](/blogs/img/uncrackable2/7.png)

---

## Native Kütüphanenin Reverse Edilmesi (Ghidra)

Bu aşamada `.so` dosyasını reverse etmek için **Ghidra** kullanacağız.

### Ghidra Kurulumu

Ghidra'yı aşağıdaki adresten indiriyoruz:

```
https://github.com/NationalSecurityAgency/ghidra/releases
```

ZIP dosyasını çıkardıktan sonra `ghidraRun.bat` dosyasını çalıştırarak kurulumu tamamlıyoruz.
APK içindeki `lib` klasöründen **`libfoo.so`** dosyasını alıp Ghidra'ya sürükle bırak ile ekliyoruz.

![native fonksiyon çağrısı](/blogs/img/uncrackable2/8.png)

---

## libfoo.so Analizi

Dosyaya çift tıkladığımızda analiz ekranı açılıyor.

![ghidra genel görünüm](/blogs/img/uncrackable2/9.png)

---

## Native Fonksiyonun Bulunması

Ghidra'da:

SYMBOL TREE nin altındaki funcitons kısmına basıyoruz orada da java_Sg_vantagepoint_uncracabkle2_code_Check_bar kısmına tıklıyoruz burada code check kısmını daha yakından görüyoruz

![ghidra genel görünüm](/blogs/img/uncrackable2/10.png)

Burada `CodeCheck.bar()` fonksiyonunun içeriğini detaylı şekilde inceleyebiliyoruz.


![native fonksiyon analizi](/blogs/img/uncrackable2/11.png)
---

## Secret String'in Ortaya Çıkması

Fonksiyon içerisindeki string karşılaştırmalarını ve sabit değerleri incelediğimizde secret string açıkça ortaya çıkıyor:

```
Thanks for all the fish
```

Bu değeri uygulamaya girdiğimizde doğrulama başarıyla geçiliyor.

![başarılı doğrulama](/blogs/img/uncrackable2/12.png)

---

## Sonuç

Bu çözümde:

* Java tarafındaki kontroller analiz edildi
* Native `.so` kütüphaneye geçiş yapıldı
* Ghidra ile C/C++ seviyesinde kodlara saklanan flagi de görmüş aracı öğrenmiş olduk
* Secret string başarıyla elde edildi

**UnCrackable-Level2**, Level1'e kıyasla çok daha öğretici olup, Android uygulamalarda **JNI / native code kullanımının** güvenlik açısından ne kadar kritik olduğunu net biçimde göstermektedir.Frida ile olan çözümler de var ama çok yorucu olduğunu düşünüyorum belki daha sonra frida ile olan farklı ctfler gelebilir.
