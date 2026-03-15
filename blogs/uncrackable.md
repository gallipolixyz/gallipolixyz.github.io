# OWASP UnCrackable-Level1 Çözümü (Android Reverse Engineering)

Bu yazıda tekrardan bir mobil ctf çözümüyle birlikteyiz. **UnCrackable-Level1** Android reverse engineering challenge'ının çözümünü adım adım anlatıyorum. Amaç; root kontrolünü bypass etmek, uygulamayı yeniden paketlemek ve gizli (secret) string'i ortaya çıkarmak.

---

## Kurulum ve Hazırlık

İlk adımda çalışma dizini olarak `555` isimli bir klasör oluşturdum. Bu klasörün içine aşağıdaki dosyaları yerleştirdim:

* `apktool`
* `keystore.jks`
* Verilen challenge APK dosyası
![APK unpack işlemi](/blogs/img/uncrackable/1.png)

Ardından `apktool` kullanarak APK'yı debug modunda açtım ve dosyaları `UnCrackable-Level1` klasörüne çıkardım.

![APK unpack işlemi](/blogs/img/uncrackable/2.png)

---

## Kod Analizi (jadx)

Sonraki adımda elde ettiğim dosyaları **jadx** ile inceledim. Uygulamanın çalışırken **root kontrolü** yaptığını ve bu kontrolü manipüle etmem gerektiğini fark ettim.

![jadx arayüzü](/blogs/img/uncrackable/3.png)

---

## Smali Dosyalarının İncelenmesi

Root kontrolünün nerede yapıldığını bulmak için ilgili **smali** dosyasını açtım. Burada `if` yapıları içinde kontrol edilen koşulları gördüm.

![smali if yapıları](/blogs/img/uncrackable/4.png)

---

## Root Kontrolünü Bypass Etme

Bu aşamada kritik noktaya geldik.
Smali dosyasında bulunan `cond_0` etiketlerini `cond_1` olarak değiştirerek kontrol akışını tersine çevirdim.

Bu değişiklik sayesinde:

* Uygulama her durumda **root'suz gibi davranıyor**
* Root kontrolü tamamen bypass edilmiş oluyor

![cond değişikliği](/blogs/img/uncrackable/5.png)

---

## APK'yı Yeniden Oluşturma ve İmzalama

Değişiklikleri kaydettikten sonra APK'yı yeniden oluşturmamız gerekiyor.

### APK Oluşturma

```bash
apktool_2.12.1.jar b UnCrackable-Level1 -o yeniapk.apk
```

### APK İmzalama

```bash
C:\Users\Ozan\AppData\Local\Android\Sdk\build-tools\35.0.0\apksigner.bat sign \
--ks keystore.jks \
--out yeniappsigned.apk \
yeniapk.apk
```

Bu işlemlerden sonra **imzalı ve çalışabilir** yeni APK dosyamız hazır oldu.

![apk imzalama](/blogs/img/uncrackable/6.png)

---

## Secret String'i Arama

Uygulamayı çalıştırdığımda benden bir **secret string** beklediğini gördüm. Bunun üzerine tüm kodlarda `secret` kelimesini arattım.

![secret araması](/blogs/img/uncrackable/7.png)

---

## Yanlış İz: Success / Fail Yapıları

İlk etapta `secret` ile ilişkili **success / retry** gibi kontroller içeren bir yapı buldum. Ancak bu aradığım şifre değildi.
Analize devam ederek diğer smali dosyalarına yöneldim (örneğin `a.smali`).

![yanlış secret yapısı](/blogs/img/uncrackable/8.png)

---

## Gerçek Secret'ın Bulunması

Burada aradığım yapıyı buldum 🎯
Şifreli veri:

* AES ile şifrelenmiş
* Decode edilmiş hali ve **AES key** birlikte bulunuyor

![şifreli secret ve key](/blogs/img/uncrackable/9.png)

---

## Şifrenin Çözülmesi (CyberChef)

Son adımda:

* **Key** kısmına AES anahtarını
* **Input** kısmına şifreli veriyi yapıştırdım

Başta farklı modları denedim ve hata aldım. En sonunda doğru modun **ECB** olduğunu tespit ettim.

Sonuç olarak secret string başarıyla çözüldü.

![cyberchef çözüm](/blogs/img/uncrackable/10.png)

---

## Sonuç

Bu çözümde:

* Root kontrolü smali seviyesinde bypass edildi
* APK yeniden paketlenip imzalandı
* AES ile şifrelenmiş secret başarıyla çözüldü

Bu tarz challenge'lar Android reverse engineering mantığını kavramak için oldukça öğretici. Özellikle **smali manipülasyonu** ve **crypto analiz** pratikleri açısından çok faydalı.
Bir sonraki blogumuzda UnCrackable-Level2 çözümü olacak o biraz daha kapsamlı olacaktır ona da bakmanızı öneriyorum.

---

