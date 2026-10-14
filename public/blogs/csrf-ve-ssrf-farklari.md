# Web Güvenliğinde İsim Benzerliği Kurbanları: CSRF ve SSRF Arasındaki Farklar

Siber güvenlik dünyasında bulunan kısaltmalar arasında, en tecrübeli mühendislerin bile zaman zaman duraksayıp birbirine karıştırdığı iki terim vardır: **CSRF (Cross-Site Request Forgery)** ve **SSRF (Server-Side Request Forgery)**.

İsimlerinde geçen "Request Forgery" (İstek Sahteciliği) ifadesi yüzünden aynı gibi görünseler de, hedefleri, etki alanları ve sömürüldükleri "güven" sınırları gece ile gündüz kadar farklıdır.

Kısaca özetlemek gerekirse; biri uygulamanın kullanıcı tarayıcısına duyduğu güveni istismar ederken, diğeri iç ağdaki sistemlerin web sunucusuna duyduğu güveni istismar eder.

Gelin bu iki zafiyetin anatomisini, nasıl çalıştıklarını ve en önemlisi sistemlerimizi bu saldırılardan nasıl koruyacağımızı derinlemesine inceleyelim.

---

## 1. Cross-Site Request Forgery (CSRF): Tarayıcınızın Körü Körüne İtaati

### CSRF Nedir?
CSRF, saldırganın, kimliği doğrulanmış (oturum açmış) bir kullanıcıyı, kendi isteği dışında web uygulamasında istenmeyen işlemler yapmaya zorladığı istemci taraflı (client-side) bir saldırıdır.

Bu zafiyetin kalbinde, web tarayıcılarının tembelliği ve "körü körüne itaati" yatar. Bir siteye giriş yaptığınızda (örneğin `banka.com`), tarayıcınız size bir oturum çerezi (session cookie) atar. Tarayıcının varsayılan davranışı, o siteye giden her isteğin (request) yanına bu çerezi otomatik olarak iliştirmektir. İsteğin nereden geldiğinin (hangi sekmeden veya siteden tetiklendiğinin) tarayıcı için bir önemi yoktur.

### Saldırı Senaryosu: Görünmez Para Transferi
Bankanızın web sitesine giriş yaptığınızı ve oturumunuzun açık kaldığını varsayalım. Aynı tarayıcıda yeni bir sekme açtınız ve size e-posta ile gelen "Şirin Kedi Videoları" linkine tıkladınız (saldırganın sitesi).

Saldırganın sitesinin kaynak kodunda şöyle gizli bir form vardır:

```html
<form action="[https://banka.com/api/para-transferi](https://banka.com/api/para-transferi)" method="POST" id="csrfForm">
    <input type="hidden" name="alici_hesap" value="Saldirgan_Hesabi" />
    <input type="hidden" name="miktar" value="10000" />
</form>
<script>
    // Sayfa yüklenir yüklenmez formu otomatik gönder
    document.getElementById('csrfForm').submit();
</script>
```

Siz kedi videosunu izlerken, arka planda tarayıcınız bankanıza bir POST isteği gönderir. Bankanın sunucusu isteği alır, "Oturum çerezi geçerli mi? Evet, bu bizim kullanıcı. Transferi onayla" der ve işlemi gerçekleştirir. Saldırgan şifrenizi çalmamıştır, ancak sizin oturumunuzun yetkisini (ambient authority) kullanmıştır.

### CSRF'ten Nasıl Korunuruz?
- **Anti-CSRF Token'ları (Synchronizer Token Pattern):** Kullanıcının oturumuna özel, tahmin edilemez ve tek kullanımlık kriptografik bir token (jeton) üretilir. Bu token her form gönderiminde sunucuya iletilmeli ve doğrulanmalıdır. Saldırgan başka bir siteden istek yapsa bile bu rastgele token'ı bilemeyeceği için istek reddedilir.
- **SameSite Çerez Özelliği (Cookie Attribute):** Çerezleri oluştururken `SameSite=Strict` veya `SameSite=Lax` bayraklarını (flags) kullanmak, modern tarayıcılara "Bu çerezi başka sitelerden (cross-site) gelen isteklere ekleme" talimatı verir.
- **Kritik İşlemlerde Yeniden Doğrulama:** Şifre değiştirme veya para transferi gibi kritik işlemlerde kullanıcıdan tekrar şifre, OTP veya 2FA kodu istemek CSRF'i tamamen öldürür.

---

## 2. Server-Side Request Forgery (SSRF): Sunucuyu Kendi Silahıyla Vurmak

### SSRF Nedir?
Eğer CSRF tarayıcıyı kandırmaksa, SSRF doğrudan web sunucusunu kandırmaktır. SSRF, saldırganın, zafiyetli bir web uygulamasını, kendi adına arka planda (server-side) HTTP istekleri yapmaya zorlamasıdır.

Normal şartlarda dışarıdan erişime kapalı olan veritabanları, iç ağ (internal network) sistemleri veya bulut altyapı servisleri, güvenlik duvarının (firewall) arkasında güvendedir. Ancak bu sistemler, web sunucusundan gelen isteklere güvenirler. SSRF zafiyetine sahip bir web sunucusu, saldırgan için dışarıdan içeriye sızmasını sağlayan bir "köprü" (proxy) görevi görür.

### Saldırı Senaryosu: Bulutun Kalbine Sızmak
Uygulamanızda, kullanıcının verdiği bir URL'den profil fotoğrafı çeken veya bir web sayfasının PDF önizlemesini oluşturan bir özellik olduğunu düşünelim.

Kullanıcının gönderdiği masum istek şöyledir:

```http
POST /api/resim-yukle
{
    "url": "[https://normal-site.com/profil.jpg](https://normal-site.com/profil.jpg)"
}

Sunucu bu URL'e gider, resmi indirir ve kaydeder. Her şey harika.

Peki ya saldırgan dışarıdaki bir URL yerine, uygulamanın kurulu olduğu sunucunun kendi iç ağına veya bulut meta-veri (metadata) adresine bir istek gönderirse?

```http
POST /api/resim-yukle
{
    "url": "[http://169.254.169.254/latest/meta-data/iam/security-credentials/](http://169.254.169.254/latest/meta-data/iam/security-credentials/)"
}
```

(Not: 169.254.169.254, AWS ve diğer bulut sağlayıcılarında sunucunun hassas bilgilerini barındıran özel bir yerel adrestir.)

Uygulama, verilen URL'in nereye gittiğini kontrol etmeden bu adrese istek yapar. Dışarıdan birisi bu adrese asla ulaşamazken, sunucunun kendi içinden yaptığı bu istek başarılı olur. Sunucu, bulut altyapısının geçici erişim anahtarlarını (Access Keys) okur ve sonucu (resimmiş gibi) saldırgana geri döndürür. Sonuç? Tüm bulut altyapısı saldırganın eline geçer. (2019'daki meşhur Capital One veri ihlali tam olarak bu yöntemle yapılmıştı.)

Aynı yöntemle saldırgan, http://localhost:8080/admin gibi sadece sunucu içinden erişilebilen yönetim panellerine de ulaşabilir.
## SSRF'ten Nasıl Korunuruz?

  Sıkı Beyaz Liste (Whitelist) Kullanımı: Kullanıcılardan gelen URL'leri asla doğrudan kabul etmeyin. Sadece izin verilen güvenli domainlere veya IP bloklarına istek atılmasına izin verin.

  İç Ağ İsteklerini Bloklama: Uygulamanızın URL fetch (getirme) mantığına, yerel ağ IP'lerine (127.0.0.1, 192.168.x.x, 10.x.x.x veya 169.254.169.254) istek yapılmasını engelleyen sıkı kontroller ekleyin.

  Ağ Segmentasyonu (Network Segmentation): Web sunucunuzun her yere erişimi olmamalıdır. Sunucunun sadece ihtiyacı olan veritabanlarına veya servislere erişebilmesi için Zero Trust mimarisi ve güvenlik duvarı kuralları (egress filtering) uygulayın.

  HTTP Yönlendirmelerine (Redirects) Dikkat: Saldırgan kendi sunucusuna masum bir istek attırıp, sunucusunu 302 Redirect ile iç ağınıza yönlendirebilir. URL doğrulama mantığınız yönlendirmeleri de takip edip denetlemelidir.
## Özetle Fark Nedir?

Karışıklığı sonsuza dek gidermek için şu tabloyu aklınızda tutabilirsiniz:

  CSRF'te kurban Kullanıcıdır (Tarayıcı). Saldırgan sizin kimliğinizi kullanarak sisteme istek atar. Çözüm, isteklerin gerçekten kullanıcının isteğiyle yapıldığını doğrulamaktır (Token'lar).

  SSRF'te kurban Sunucudur. Saldırgan sunucuyu bir maşa gibi kullanarak iç sistemlere saldırır. Çözüm, sunucunun nereye istek yapabileceğini sıkı bir şekilde kısıtlamaktır.

## Sonuç

Web uygulamalarının giderek dış kaynaklarla daha fazla entegre olduğu (API'ler, Webhook'lar, URL fetch işlemleri) günümüzde, zafiyetlerin doğası da değişiyor. CSRF, modern tarayıcıların aldığı önlemlerle (SameSite cookies vb.) eski popülerliğini yavaş yavaş yitirse de, SSRF özellikle bulut mimarilerinin yaygınlaşmasıyla OWASP Top 10 listesinin zirvelerinde kendine kalıcı bir yer bulmuştur.

Unutmayın; güvenlik, kime (Authentication) ve nereye (Access Control) güvendiğinizi sorgulamakla başlar. İster tarayıcıdan gelen bir istek olsun, ister kendi sunucunuzun dışarıya yapacağı bir istek; "Güven, ama doğrula" (Trust, but verify) ilkesi her zaman hayat kurtarır.
