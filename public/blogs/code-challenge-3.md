# Code Challenge 3 Write-Up

Bu challenge’da Express.js uygulaması, `/secret` path’i altındaki endpoint’leri  
bir middleware ile token kontrolüne tabi tutmaktadır.

Amaç, `/secret` rotasına yapılan tüm isteklerin yetkilendirilmesini sağlamaktır.  
Ancak route kontrolü **case-sensitive yapılmadığı** için bu koruma bypass edilebilmektedir.

---
## Kaynak Kod

![](/blogs/img/code-challenge_1/carbon.png)
## Zafiyet Türü

- Case-Insensitive Routing Bypass  
- Broken Access Control

---

## Zafiyet Analizi

Yetkilendirme kontrolü aşağıdaki middleware ile yapılmaktadır:

```js
if (req.url.startsWith('/secret')) {
```

Bu kontrol:
- String karşılaştırmasına dayanır
- **Case-sensitive** çalışır

Ancak Express.js routing:
- Varsayılan olarak **case-insensitive** çalışır

Bu nedenle middleware ile routing davranışı **birbirini tutmamaktadır**.

---

## Exploit Senaryosu

Saldırgan aşağıdaki isteği gönderir:

```
GET /Secret
```

### Davranış

- Middleware:
  - `/Secret`.startsWith(`/secret`) → **false**
  - Token kontrolü çalışmaz

- Express Router:
  - `/Secret` → `/secret` route’una yönlendirilir

---

## Sonuç

- `/secret` endpoint’i
- Herhangi bir token olmadan
- Başarıyla erişilebilir

Bu durum açık bir **yetkilendirme bypass** örneğidir.

---

## Root Cause (Kök Neden)

- Middleware kontrolünün case-sensitive olması  
- Express.js router’ın case-insensitive çalışması  
- Güvenlik kontrolü ile routing davranışının uyumsuz olması  

---

## Güvenli Çözüm

### 1️⃣ Case Normalizasyonu

```js
if (req.url.toLowerCase().startsWith('/secret')) {
```

### 2️⃣ Router Bazlı Middleware (Önerilen)

```js
app.use('/secret', authMiddleware);
```

Bu yaklaşım, Express routing mekanizmasıyla tam uyum sağlar.
---

## Sonuç

Bu challenge, Express.js uygulamalarında  
**string tabanlı path kontrollerinin güvenli olmadığını** ve  
**case-insensitive routing nedeniyle yetkilendirme bypass edilebileceğini** göstermektedir.




