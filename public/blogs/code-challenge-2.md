# Code Challenge 2 Write-Up

Bu challenge’da uygulama, kullanıcıdan alınan `path` parametresini kullanarak  
`http://internal-api.local` domainine HTTP isteği göndermektedir.

Amaç, uygulamanın **yalnızca internal-api.local** adresine istek atmasını sağlamaktır.  
Ancak URL oluşturma şekli nedeniyle bu domain kısıtlaması **bypass edilebilmektedir**.

---
## Kaynak Kod
![](/blogs/img/code-challenge_2/carbon.png)

## Zafiyet Türü

- Improper URL Validation  
- SSRF (Domain Bypass)

---

## Zafiyet Analizi

Uygulamada URL aşağıdaki şekilde oluşturulmaktadır:

```java
String url = "http://internal-api.local" + path;
```

Kullanıcı girdisi şu regex ile kontrol edilmektedir:

```java
^/[a-zA-Z0-9_]*
```

Bu kontrol:
- Sadece `path` değerinin `/` ile başlamasını denetler
- URL’nin **gerçek hedef domainini** doğrulamaz

Java’da `URI.create()` metodu, özel URL formatlarını beklenenden farklı şekilde parse edebilir.

---

## Exploit Senaryosu

Saldırgan aşağıdaki `path` değerini gönderir:

```
.evil.com/
```

Oluşan URL:

```
http://internal-api.local.evil.com/
```

Bu URL parse edildiğinde:
- `internal-api.local` →_unlock user-info olarak değerlendirilir_
- Gerçek hedef → `evil.com`

---

## Sonuç

Uygulama, isteği `internal-api.local` yerine **evil.com** adresine gönderir.  
Bu sayede domain kısıtlaması tamamen bypass edilmiş olur.

---

## Root Cause (Kök Neden)

- URL birleştirme işleminin string concat ile yapılması  
- Gerçek hostname kontrolünün yapılmaması  
- URL parsing davranışının yanlış varsayılması  

---

## Güvenli Çözüm

- URL’ler string olarak birleştirilmemelidir  
- `URI.getHost()` ile hedef domain doğrulanmalıdır  
- Sadece whitelist edilmiş domain’lere izin verilmelidir  

Örnek:

```java
URI uri = new URI(url);
if (!"internal-api.local".equals(uri.getHost())) {
    return "not allowed";
}
```

---

## Sonuç

Bu challenge, yalnızca path doğrulamanın yeterli olmadığını ve  
**URL parsing zafiyetleri ile domain kısıtlamalarının bypass edilebileceğini** göstermektedir.
