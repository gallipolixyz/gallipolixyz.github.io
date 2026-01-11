# Code Challenge 1 Write-Up



Bu challenge’da Java ile yazılmış basit bir Admin Panel uygulamasında bulunan bir yetkilendirme hatası incelenmektedir.
Uygulamanın amacı, yalnızca admin rolüne sahip kullanıcıların başka kullanıcıları silebilmesini sağlamaktır.

Ancak kodda yer alan bir mantık hatası (logic flaw) nedeniyle, admin olmayan bir kullanıcı da bu işlemi gerçekleştirebilmektedir.

## Kaynak Kod

![](/blogs/img/code-challenge_1/carbon.png)

## Zafiyet Türü
Broken Access Control (Yetkilendirme Bypass)

## Zafiyet Analizi
deleteUser metodunda, kullanıcının admin olup olmadığı kontrol edilmektedir:
![](/blogs/img/code-challenge_1/carbon2.png)

Ancak bu kontrol yalnızca ekrana mesaj basmaktadır.
Yetkisiz kullanıcı tespit edilse bile:

- Fonksiyon durdurulmuyor
- İşlem iptal edilmiyor
- Silme işlemi yine çalıştırılıyor

Bu nedenle yetki kontrolü etkisiz kalmaktadır.


# Sonuç & Neden

- Yetki kontrolü yapılmış
-Ancak kontrol sonucu iş akışını etkilememiş
- return veya else bloğu kullanılmamış

Admin olmayan bir kullanıcı:
- Hata mesajını almasına rağmen
- victim adlı kullanıcıyı başarıyla silebilmektedir


# Güvenli Çözüm
![](/blogs/img/code-challenge_1/carbon3.png)
- Fonksiyonun çalışması return ile durdurulmalı


