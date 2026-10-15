# Web Güvenliğinde İsim Benzerliği Kurbanları: CSRF ve SSRF Arasındaki Farklar

Siber güvenlik dünyasında bulunan kısaltmalar arasında, en tecrübeli mühendislerin bile zaman zaman duraksayıp birbirine karıştırdığı iki terim vardır: **CSRF (Cross-Site Request Forgery)** ve **SSRF (Server-Side Request Forgery)**.

İsimlerinde geçen "Request Forgery" (İstek Sahteciliği) ifadesi yüzünden aynı gibi görünseler de, hedefleri, etki alanları ve sömürüldükleri "güven" sınırları gece ile gündüz kadar farklıdır.

Kısaca özetlemek gerekirse; biri uygulamanın kullanıcı tarayıcısına duyduğu güveni istismar ederken, diğeri iç ağdaki sistemlerin web sunucusuna duyduğu güveni istismar eder.


Gelin bu iki zafiyetin anatomisini, nasıl çalıştıklarını ve en önemlisi sistemlerimizi bu saldırılardan nasıl koruyacağımızı derinlemesine inceleyelim.

---

## 1. Cross-Site Request Forgery (CSRF): Tarayıcınızın Körü Körüne İtaati

### CSRF Nedir?
CSRF, saldırganın, kimliği doğrulanmış (oturum açmış) bir kullanıcıyı, kendi isteği dışında web uygulamasında istenmeyen işlemler yapmaya zorladığı istemci taraflı (client-side) bir saldırıdır.

### Same-Origin Policy (SOP) ve CSRF İlişkisi
Web güvenlik mimarisinin temelini oluşturan **Same-Origin Policy (SOP - Aynı Köken Politikası)**, bir kaynaktan (origin) yüklenen betiklerin veya dokümanların başka bir kaynaktaki verileri **okumasını** engeller. Ancak SOP, cross-site durumunda durum değiştiren (state-changing) bir HTTP isteğinin karşı tarafa **gönderilmesini** varsayılan olarak tamamen engellemez. İşte CSRF tam olarak bu boşluktan beslenir: Saldırgan gelen yanıtı okuyamaz ama isteği sunucuya tetikletmeyi başarır.

### Çerez Yönetimi ve Otomatik Gönderim Şartları
Tarayıcılar çerezleri her isteğe körü körüne eklemezler. Bir çerezin cross-site bir istekte gönderilip gönderilmeyeceği; çerezin `SameSite` özniteliğine (`Strict`, `Lax`, `None`), `Domain`/`Path` kapsamına ve HTTPS/`Secure` şartlarına bağlıdır. Ancak yapılandırılmamış veya esnek bırakılmış oturum çerezleri, kullanıcının haberi olmadan isteklerle birlikte karşı sunucuya iletilebilir.

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
Siz kedi videosunu izlerken, arka planda tarayıcınız bankanıza bir POST isteği gönderir. Şartlar uygunsa çerezler de isteğe eklenir. Bankanın sunucusu isteği alır ve işlemi gerçekleştirir. Saldırgan şifrenizi çalmamıştır, ancak sizin oturumunuzun yetkisini (ambient authority) kullanmıştır.

## CSRF'ten Nasıl Korunuruz?

Anti-CSRF Token'ları: Kullanıcının oturumuna bağlanan (per-session) veya her istekte yenilenen (per-request) tahmin edilemez kriptografik token'lar kullanılır.

SameSite Çerez Yapılandırması: Çerezlere SameSite=Strict veya SameSite=Lax öznitelikleri verilerek cross-site isteklerde iletilmesi engellenir.

Origin ve Referer Header Kontrolü: Sunucu tarafında isteğin kaynağının güvenilir domain olup olmadığı Origin ve Referer başlıkları kontrol edilerek doğrulanır.

Özel HTTP Başlıkları (Custom Headers): AJAX/Fetch isteklerine X-Requested-With gibi özel başlıklar eklemek, SOP gereği preflight (OPTIONS) isteğini zorunlu kıldığı için CSRF'i engeller.

Double Submit Cookie Pattern: İstemci tarafında hem çerezde hem de istek gövdesinde/başlığında aynı rastgele değerin gönderilip sunucuda eşleştirilmesi yöntemidir.

Kritik İşlemlerde Re-Authentication: Şifre değiştirme veya para transferi gibi işlemlerde kullanıcıdan tekrar parola, OTP veya 2FA istenmelidir.

## 2. Server-Side Request Forgery (SSRF): Sunucuyu Kendi Silahıyla Vurmak
SSRF Nedir?

Eğer CSRF tarayıcıyı kandırmaksa, SSRF doğrudan web sunucusunu kandırmaktır. SSRF, saldırganın, zafiyetli bir web uygulamasını, kendi adına arka planda (server-side) HTTP veya diğer protokoller üzerinden istekler yapmaya zorlamasıdır.
Basic (In-band) vs. Blind (Out-of-band) SSRF

SSRF iki ana şekilde karşımıza çıkar:

 Basic (In-band) SSRF: Sunucunun iç ağdan veya hedef adresten çektiği veri (örneğin bir HTML içeriği, resim verisi veya JSON yanıtı) doğrudan saldırgana dönen yanıtın içinde görüntülenir.

 Blind (Out-of-band) SSRF: Sunucu isteği gerçekleştirir ancak dönen yanıtı kullanıcı arayüzünde göstermez. Saldırgan zafiyeti doğrulamak için kendi kontrolündeki bir DNS/HTTP sunucusuna (Burp Collaborator, Interactionsrv vb.) istek düşmesini bekler veya zaman tabanlı (timing attack) analizler yapar.

Yalnızca HTTP Değil: Tehlikeli Diğer Protokoller

SSRF sadece HTTP/HTTPS ile sınırlı değildir. Uygulamanın kullandığı kütüphanelere bağlı olarak saldırganlar farklı URI şemalarını kullanabilir:

file://: Sunucunun yerel dosya sistemindeki hassas dosyaları (ör. /etc/passwd) okumak için.

gopher://: İç ağdaki Redis, Memcached, SMTP gibi servislerle ham soket iletişimi kurup komut çalıştırmak (RCE) için.

dict:// veya ftp://: İç ağdaki portları taramak ve bilgi toplamak için.

## Saldırı Senaryosu: Bulutun Kalbine Sızmak

Uygulamanızda, kullanıcının verdiği bir URL'den profil fotoğrafı çeken bir özellik olduğunu düşünelim:

```
    POST /api/resim-yukle
{
    "url": "[http://169.254.169.254/latest/meta-data/iam/security-credentials/](http://169.254.169.254/latest/meta-data/iam/security-credentials/)"
}
```

(Not: 169.254.169.254, AWS ve diğer bulut sağlayıcılarında sunucunun geçici IAM rol anahtarlarını barındıran özel bir yerel adres/Link-Local adrestir.)

Uygulama kontrol yapmadan bu adrese istek atarsa, bulut altyapısının geçici erişim anahtarlarını okur ve saldırgana sızdırabilir. Aynı yöntemle http://localhost:8080/admin gibi iç panellere de erişilebilir.

##DNS Rebinding İle Filtreleri Aşmak

Geliştiriciler genellikle girilen IP adresinin 127.0.0.1 veya 192.168.x.x olup olmadığını kontrol eden IP blacklist mekanizmaları kurarlar. Ancak saldırganlar DNS Rebinding tekniğiyle bu korumayı aşabilir:

Saldırgan evil.com adında bir domain tanımlar ve TTL değerini 0 yapar.

   İlk DNS sorgusunda domain masum bir dış IP'ye (1.2.3.4) çözümlenir ve uygulama kontrolü geçer.

   Sunucu bağlantıyı kuracağı tam o anda yapılan ikinci DNS sorgusunda domain iç IP'ye (127.0.0.1) çözümlenir ve sunucu kendi içine istek atar.

## SSRF'ten Nasıl Korunuruz?

   Sıkı Beyaz Liste (Whitelist) Kullanımı: Sadece izin verilen güvenli domainlere/IP'lere istek atılmasına izin verilmelidir.

   IP ve Ağ Seviyesinde Engelleme: İç ağ IP bloklarına (127.0.0.0/8, 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16, 169.254.169.254) yapılan istekler DNS çözümlemesinden sonra da kontrol edilmelidir (DNS Rebinding önlemi).

   Unused Protocols'ün Devre Dışı Bırakılması: İhtiyaç duyulmayan file://, gopher://, dict:// gibi URL şemaları iptal edilmelidir.

   Ağ Segmentasyonu (Zero Trust): Web sunucusunun iç ağdaki diğer hassas servislere erişimi kısıtlanmalıdır (Egress Filtering).

   HTTP Redirects Denetimi: 302 Redirect ile gelen yönlendirmeler körü körüne takip edilmemeli, yönlendirilen yeni adres de güvenlik kontrolünden geçirilmelidir.

Özetle Fark Nedir?

   CSRF'te kurban Kullanıcıdır (Tarayıcı). Saldırgan kullanıcının yetkisini kullanarak sisteme istek atar. Çözüm: İstek kaynağını ve doğruluk jetonlarını kontrol etmek.

   SSRF'te kurban Sunucudur. Saldırgan sunucuyu ve onun ağ yetkilerini kullanarak iç/dış sistemlere istek atar. Çözüm: Sunucunun nereye ve hangi protokolle istek yapacağını sıkı denetlemek.

## Sonuç

Web uygulamalarının API'ler ve mikroservislerle büyüdüğü günümüzde, zafiyetlerin doğası da değişiyor. CSRF, modern tarayıcı önlemleriyle güçleşirken; SSRF, bulut mimarilerinin yaygınlaşmasıyla kritik bir tehdit haline gelmiştir. "Güven, ama doğrula" (Trust, but verify) ilkesi hem istemci hem de sunucu tarafında uygulanmalıdır.
