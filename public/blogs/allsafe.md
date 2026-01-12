# Allsafe: Intentionally Vulnerable Android App Write-up
| | | | | | | | | |
|--|--|--|--|--|--|--|--|:--:|
| | | | | | | | | ![](/blogs/img/Allsafe/1.png) |

Allsafe Lab, içerisinde çeşitli zorluklar barındıran ve farklı güvenlik açığı kategorilerini kapsayan bir APK uygulamasıdır.Uygulamayı GitHub reposu üzerinden indirerek siz de deneyebilir, kendi çözümlerinizi geliştirebilirsiniz. Benim hazırladığım bu write-up’ı inceleyerek hem yaklaşım tarzımı görebilir hem de konuya dair farklı bir bakış açısı kazanabilirsiniz.

## 1.Insecure Logging
![](/blogs/img/Allsafe/2.png) 
Insecure Logging, bir uygulamanın çalışma sırasında oluşturduğu log kayıtlarına hassas verileri herhangi bir koruma mekanizması olmadan yazması durumunu ifade eder. Bu durum, özellikle yetkisiz kişilerin loglara erişebilmesi hâlinde ciddi bilgi sızıntılarına yol açabilir.Lab ortamında uygulama loglarının logcat üzerinden izlenebildiği görülmüştür.
![](/blogs/img/Allsafe/3.png) 



## 2.Hardcoded Credentials
![](/blogs/img/Allsafe/4.png) 
Hardcoded Credentials, kullanıcı adı, parola, API anahtarı, gizli token veya veritabanı bağlantı bilgileri gibi hassas verilerin uygulamanın kaynak kodu içerisine doğrudan düz metin (plaintext) olarak gömülmesi durumudur.

Uygulama jadx kullanılarak incelenmiş ve string.xml dosyasında yer alan bir URL ile birlikte yönetici (admin) kimlik bilgilerinin açık şekilde tutulduğu tespit edilmiştir.
Veri string.xml dosyasının 71. satırında bulunmuştur.
![](/blogs/img/Allsafe/5.png) 




## 3.Firebase Database
![](/blogs/img/Allsafe/6.png) 
Firebase Veritabanı Zafiyeti, bir mobil veya web uygulamasında kullanılan Firebase Realtime Database ya da Cloud Firestore’un yanlış yapılandırılması nedeniyle yetkisiz kişilere açık olması durumudur.
Saldırgan, Firebase endpoint’ini tespit ettikten sonra .json uzantısı ile doğrudan erişim sağlayabilir.

Kaynak kod incelendiğinde strings.xml dosyasında veritabanı URLi bulunmuştur. 
![](/blogs/img/Allsafe/7.png) 

URL`e bağlı .json dosyasında hasas verilere ulaşılmıştır.
![](/blogs/img/Allsafe/8.png) 




## 4.Insecure Shared Preferences
![](/blogs/img/Allsafe/9.png) 

Insecure Shared Preferences, hassas verilerin Android SharedPreferences içinde şifrelenmeden veya yanlış erişim izinleriyle saklanması sonucu yetkisiz erişim ve uygulama mantığının kırılmasına yol açan bir güvenlik zafiyetidir.
![](/blogs/img/Allsafe/10.png) 
Kaynak kod incelendiğinde geliştiricinin, kullanıcının girdiği şifreyi hiçbir şifreleme yapmadan doğrudan user.xml dosyasına yazdığı görülmektedir.
/data/data dizini altında yer alan user.xml dosyasına gidildiğinde, uygulama üzerinden girilen input’ların şifrelenmeden yazıldığı görülmektedir.
![](/blogs/img/Allsafe/11.png) 



## 5.SQL Injection
![](/blogs/img/Allsafe/12.png) 
SQL Injection, saldırganın uygulamaya gönderdiği özel girdilerle SQL sorgusunu manipüle ederek veritabanına yetkisiz erişim sağlamasına olanak tanıyan bir güvenlik zafiyetidir.
![](/blogs/img/Allsafe/14.png) 

Kodun özellikle aşağıdaki satırı incelendiğinde  geliştiricinin kullanıcı girdisini doğrudan SQL sorgusuna string birleştirme yoluyla eklemesi ve rawQuery metodunda güvenlik sağlayan selectionArgs parametresini null bırakarak parametreli sorgu yapısını kullanmaması sebebiyle zaafiyet oluştuğu görülmektedir.
```bash
Cursor cursor = $db.rawQuery("select * from user where username = '" + ((Object) $username.getText()) + "' and password = '" + this$0.md5(String.valueOf($password.getText())) + "'", null);
```
O halde input olarak aşağıdaki sorguyu kullandığımızda zafiyeti tetikleyebiliriz.
```bash
' or 1=1--
```
![](/blogs/img/Allsafe/13.png) 



## 6.Pın Bypass
![](/blogs/img/Allsafe/15.png) 

İpucunu takip ederek uygulamanın kaynak kodunu inceliyorum.
![](/blogs/img/Allsafe/16.png) 
Koddaki return ifadesini true olarak hook'larsak, sistem girdiğimiz her PIN değerini doğru kabul eder. Böylece PIN doğrulamasını bypass etmiş oluruz.
Bunun için şu basit scripti kullanabiliriz.
```bash
Java.perform(function () {
  // Allsafe'in PIN kontrol sınıfını buluyoruz
  const PinBypassFragment = Java.use('infosecadventures.allsafe.challenges.PinBypass');

  // checkPin fonksiyonunu ele geçiriyoruz
  PinBypassFragment.checkPin.implementation = function (pin) {
    console.log("-----------------------------------------");
    console.log("FRIDA: PIN kontrolü yakalandı!");
    console.log("Girilen hatalı PIN: " + pin);
    
    // Uygulamanın ne beklediğine bakmaksızın her zaman 'doğru' döndür
    console.log("FRIDA: Sonuç 'true' olarak değiştiriliyor...");
    console.log("-----------------------------------------");
    return true; 
  };
});

```
![](/blogs/img/Allsafe/17.png) 



## 7.Root Detection
![](/blogs/img/Allsafe/18.png) 
Uygulamada root tespiti için Rootbeer kütüphanesi kullanılmış.
Bu korumayı bypass etmek için hazır bir frida  scriptini öneriyorum.(https://codeshare.frida.re/@ub3rsick/rootbeer-root-detection-bypass/) 
Bu script ile hook işlemi yaptığımızda, root kontrolünü başarıyla atlatıyoruz.
![](/blogs/img/Allsafe/19.png) 



## 8.Deep Link Exploitation
![](/blogs/img/Allsafe/20.png) 

Uygulamanın kodunu inceliyorum :
![](/blogs/img/Allsafe/21.png) 
DeepLinkTask aktivitesi, uygulama bir Deep Link aracılığıyla tetiklendiğinde devreye girmektedir. Kod, getIntent() metodu ile gelen URI verisini yakalar ve loglar. Ancak güvenlik zafiyeti, doğrulama mekanizmasının işleyişinde yatmaktadır:

```bash
if (data.getQueryParameter("key").equals(getString(R.string.key)))
```

Uygulama, URL içerisindeki key parametresini, sunucu tarafında doğrulamak yerine doğrudan kaynak kodlara gömülü olan (strings.xml içerisindeki) R.string.key değeriyle karşılaştırır. 
Bu durum, hassas bir verinin istemci tarafında saklanmasına (Hardcoded Secret) neden olur.
![](/blogs/img/Allsafe/22.png) 
 Sonuç olarak, statik analiz ile bu değeri elde eden bir saldırgan, doğru parametreyi içeren bir link göndererek doğrulamayı atlatabilir ve setVisibility(0) fonksiyonunu tetikleyerek gizli içeriğe erişebilir.
![](/blogs/img/Allsafe/23.png) 



## 9.Certificate Pinning
Android uygulamalarında SSL sertifikası bypass edilmesi, uygulamanın HTTPS üzerinden yaptığı sertifika kontrollerinin atlatılarak trafiğin izlenebilir hâle gelmesidir. Sertifika doğrulaması zayıf ya da hatalıysa, saldırgan araya girerek uygulama–sunucu arasındaki veriyi okuyabilir veya değiştirebilir. Bu yüzden SSL pinning önemli bir savunma katmanıdır; ancak dinamik analiz araçları sayesinde bu koruma da aşılabilir.

Bu noktada Frida, çalışan uygulamaya müdahale ederek sertifika kontrolü yapan fonksiyonları her zaman “güvenli” dönecek şekilde manipüle etmemizi sağlar ve böylece HTTPS trafiği Burp Suite gibi araçlarla analiz edilebilir.
Bu Labda yaygın olarak kullanılan şu scripti kullanarak ;
https://codeshare.frida.re/@pcipolloni/universal-android-ssl-pinning-bypass-with-frida/
bu aşamada bypassı sağlıyorum.
![](/blogs/img/Allsafe/24.png) 



## 10.Smali Patch
![](/blogs/img/Allsafe/25.png) 
Bu challenge’ta, labda verilen ipuçlarını takip ederek ilerliyoruz. Öncelikle firewall’ın ilgili metoduna gidiyorum.
![](/blogs/img/Allsafe/26.png) 
Fonksiyon, argüman olarak aldığı Firewall nesnesinin durumunu Firewall.ACTIVE değeriyle kıyaslayarak güvenlik duvarının açık olup olmadığını denetler. Bu eşitlik sağlanırsa, kod akışı başarı bloğuna girer ve kullanıcıya SnackUtil ile Toast araçları üzerinden işlemin başarılı olduğuna dair görsel geri bildirim verir.

Biz de burada değişiklik yaparak uygulamayı patch’leyip, ilgili fonksiyonun her zaman return true döndürmesini sağlamaya çalışacağız.

Bunun için apktool kullanarak APK’yı decompile ediyor ve uygulamanın smali kodlarına gidiyoruz. smali_classes4 klasöründeki SmaliPatch.smali dosyasında, 23. satırda bu değişikliği yapmamıza yarayacak kodu buluyoruz.
![](/blogs/img/Allsafe/27.png) 
![](/blogs/img/Allsafe/28.png) 
Kodun çalışma mantığını incelediğimizde; öncelikle Firewall.ACTIVE referansı v0 yazmacına (register) yüklenmekte ve invoke-virtual çağrısı ile mevcut durum beklenen değerle karşılaştırılmaktadır. Elde edilen Boolean sonucu (0 veya 1) tekrar v0 üzerine yazıldığında, orijinal kodda bulunan if-eqz (Sıfıra Eşitse) komutu kritik bir karar mekanizması olarak devreye girer. Bu komut, doğrulama başarısız olduğunda (sonuç 0 döndüğünde) akışı doğrudan :cond_0 etiketli hata bloğuna yönlendirerek başarı mesajının çalışmasını engeller.

Bu noktada yaptığımız müdahale (2.görsel) ile if-eqz komutunu if-nez (Sıfıra Eşit Değilse) olarak değiştirerek mantıksal bir tersleme gerçekleştirdik. Bu değişiklik sayesinde, güvenlik duvarı kapalı olduğunda dönen '0' sonucu artık hata bloğuna dallanmayı tetiklemez; aksine kod akışı kesintisiz devam ederek başarı bloğuna girer ve 'Good Job' mesajının görüntülenmesini sağlar.

![](/blogs/img/Allsafe/29.png) 
