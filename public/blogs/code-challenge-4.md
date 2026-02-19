# Code Challenge 4 Write-Up (DOM-Based XSS)



Bu challenge’da client-side çalışan basit bir arama uygulamasında bulunan bir DOM-Based XSS zafiyeti incelenmektedir.  
Uygulamanın amacı, URL üzerinden alınan `search` parametresini ekrana güvenli şekilde yazdırmaktır.

Ancak kullanılan HTML `escape` mekanizması eksik olduğu için,
kullanıcı girdisi filtreyi bypass ederek JavaScript çalıştırabilmektedir.

## Kaynak Kod

![](/blogs/img/code-challenge_4/carbon.png)

## Zafiyet Türü
DOM-Based XSS (Improper Output Encoding)

## Zafiyet Analizi

Uygulama, `search` parametresini URL’den alıp aşağıdaki şekilde DOM’a yazmaktadır:

```javascript

resultsDiv.innerHTML =
    "<p>Search results for: " + escapeHTML(search) + "</p>";
```

Girdi önce `escapeHTML()` fonksiyonundan geçirilmektedir:

```javascript

function escapeHTML(input) {
    return input.replace('<', '&lt;').replace('>', '&gt;');
}

```
Ancak bu filtreleme hatalıdır:

- replace() global değildir (sadece ilk eşleşmeyi değiştirir)
- Sadece < ve > karakterleri encode edilmektedir
- ", ', & gibi kritik karakterler encode edilmemektedir
- Çıktı innerHTML ile DOM’a basılmaktadır

Bu nedenle filtre etkisiz hale getirilebilmektedir.

# Exploit

```sh
<><img src=1 onerror=alert(1)>

?search=<><img src=1 onerror=alert(1)>
```
Payload çalışmasının nedeni:

- İlk < karakteri encode edilir
- İlk > karakteri encode edilir
- İkinci <img> etiketi filtrelenmez
- innerHTML tarafından HTML olarak parse edilir
- onerror eventi tetiklenir
- JavaScript kodu çalışır


# Sonuç

- HTML escape işlemi eksik uygulanmış
- Global replace kullanılmamış
- Context-aware encoding yapılmamış
- innerHTML kullanılmış

Saldırgan:

- Kullanıcının tarayıcısında JavaScript çalıştırabilir
- Session çalabilir (HttpOnly değilse)
- DOM manipülasyonu yapabilir
- Phishing veya zararlı içerik enjekte edebilir


# Güvenli Çözüm

- innerHTML yerine textContent kullanılmalı
- Manuel replace yerine güvenli sanitization kütüphanesi tercih edilmeli
```javascript
resultsDiv.textContent = "Search results for: " + search;
```