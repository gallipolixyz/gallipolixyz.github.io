# OAuth 101

## Parolanı paylaşmadan erişim izni vermek

![Kapak](/blogs/img/oauth-101/00-kapak.png)

## 1. OAuth neden var?

“Planla” adında bir randevu uygulaması düşün. Google Takvim’indeki müsait zaman aralıklarını görüp sana otomatik toplantı önerileri sunmak istiyor. Bunun için Google hesabının parolasını vermen gerekseydi, razı olur muydun?

Muhtemelen olmazdın. Parolanı paylaşmak, takvimini okumak için gerekenin çok ötesinde bir erişim riski yaratır. Uygulama parolanı kendi sunucusunda saklayabilir; bir gün ele geçirilirse parolan da başkalarının eline geçebilir. Üstelik uygulamanın erişimini kesmek için parolanı değiştirmek zorunda kalabilirsin.

OAuth tam bu noktada devreye girer. Parolanı uygulamaya vermek yerine doğrudan Google’a gidip “Bu uygulama yalnızca takvim etkinliklerimi okuyabilsin” dersin. Google da uygulamaya parolanı değil, access token (erişim belirteci) denen özel bir izin kartı verir. Planla bu kartı kullanarak yalnızca verilen izinler kapsamında takvimine erişir.

OAuth, parolanı paylaşmadan, sınırlı ve geri alınabilir bir yetkiyi başka bir uygulamaya devretmeni sağlar.

Parolanı paylaşmadan, çünkü Planla Google parolanı görmez. Sınırlı, çünkü uygulamanın erişimi verilen izinlerle belirlenir. İstenen erişim kapsamlarına scope denir: uygulama kapsamları talep eder, sen bu izinleri görüp onaylarsın. Geri alınabilir, çünkü Google hesabının ayarlarından uygulamanın erişimini kaldırabilirsin; bunun için parolanı değiştirmen gerekmez.

“Bu uygulama takvim etkinliklerine erişmek istiyor. İzin ver / Reddet” ekranı, OAuth’un günlük hayatta en çok karşına çıkan parçalarından biridir.

![Görsel 1](/blogs/img/oauth-101/01-gorsel.png)

*Görsel 1. “Planla” örneğiyle OAuth’un neden var olduğunu gösteren karşılaştırma: şifre paylaşımının geniş erişim riskine karşı OAuth’un sınırlı ve iptal edilebilir token erişimi.*

## 2. OAuth’ta kim kimdir?

Planla örneğinde dört rol vardır. Google, hem yetkilendirme sunucusunu hem de takvim verilerini sunan kaynak sunucusunu işletir; bunlar aynı sağlayıcıya ait olsa da görevleri farklıdır.

| Rol | Kim? | Örneğimizde |
|---|---|---|
| Resource owner / Kaynak sahibi | Korunan kaynağa erişim izni verebilen kişi. | Sen |
| Client application / İstemci | Erişim isteyen uygulama. | Planla |
| Authorization server / Yetkilendirme sunucusu | Kullanıcıyı doğrulayan, izni alan ve token üreten sunucu. | Google’ın yetkilendirme sunucusu |
| Resource server / Kaynak sunucusu | Token’ın yetkisini kontrol ederek korunan veriyi sunan sunucu. | Google Takvim API’si |

## 3. OAuth ne değildir?

OAuth’u öğrenirken en sık yapılan yanlış, onu tek başına bir “giriş yapma sistemi” sanmaktır. Oysa OAuth 2.0 bir yetkilendirme çerçevesidir. Cevapladığı soru, “Bu uygulama takvimime erişebilir mi?” sorusudur. “Uygulamaya giriş yapan kullanıcı kim?” sorusuna standart bir cevap vermek ise OAuth’un tek başına üstlendiği bir görev değildir.

OAuth akışı sırasında Google hesabına giriş yapman gerekebilir. Bu adımda Google senin kimliğini doğrular. Ancak Google’ın seni tanıması ile Planla’nın kimliğini güvenilir biçimde öğrenmesi aynı şey değildir.

“Google ile giriş yap” mekanizması, OAuth 2.0 üzerine kurulu OpenID Connect (OIDC) adlı kimlik doğrulama katmanını kullanır. OIDC, uygulamanın Google tarafından doğrulanan kullanıcıyı tanıyabilmesi için standart bir yol sağlar.

Bu mekanizmanın temel parçalarından biri ID token (`id_token`) denen kimlik belirtecidir. Google’ın verdiği bu imzalı belirteç, hangi kullanıcının kimliğinin doğrulandığı ve hangi uygulama için üretildiği gibi bilgiler içerir. Planla bu belirteci doğrulayarak giriş işlemini tamamlar.

Google ile giriş yapmak, Planla’ya otomatik olarak takvimini okuma izni vermez. Takvim erişimi için ilgili kapsamın ayrıca istenmesi ve yetkilendirilmesi gerekir. Giriş yapma ve takvim izni verme işlemleri aynı akışta sunulabilir, fakat amaçları farklıdır.

OAuth, uygulamanın neye erişebileceğiyle; OIDC, giriş yapan kullanıcının kim olduğuyla ilgilenir.

## 4. Token ile parola arasındaki fark nedir?

Parola, hesabına giriş yaparken kimliğini doğrulamak için kullandığın gizli bilgidir. Access token ise bir uygulamaya verilen erişim yetkisini temsil eder. Planla, Google parolanı görmez; takvimini okumak için bu token’ı kullanır. Token yalnızca takvim erişimi için verilmişse e-postalarını veya Drive dosyalarını açamaz.

Parola sen değiştirene kadar aynı kalabilir. Access token ise genellikle kısa ömürlüdür; süresi dolunca aynı token ile erişime devam edilemez. Uygulamaya verdiğin izni kaldırmak için de parolanı değiştirmen gerekmez.

Token’ın sınırlı olması, çalınmasını önemsiz yapmaz. Geçerli bir access token’ı ele geçiren kişi, token’ın izin verdiği verilere erişebilir. Bu yüzden token da parola gibi korunması gereken hassas bir bilgidir.

## 5. Bir OAuth akışı adım adım nasıl işler?

Planla uygulamasında “Google Takvim’i bağla” butonuna bastığını düşün. Uygulama seni Google’a yönlendirir. Gerekirse hesabına giriş yaparsın ve Google sana “Bu uygulama takvim etkinliklerini okumak istiyor, izin veriyor musun?” diye sorar.

Sen onaylarsan Google, seni kısa ömürlü ve tek kullanımlık bir kod ile Planla’ya geri yönlendirir. Planla bu kodu Google’a göndererek bir access token alır. Ardından bu token’ı kullanarak Google Takvim’den etkinliklerini okur ve sana uygun toplantı aralıkları önerir.

Bu yönteme Authorization Code akışı denir. Kod, access token almak için; access token ise izin verilen verilere erişmek için kullanılır.

Bu işlemler sırasında uygulamanın ve Google’ın yapması gereken güvenlik kontrolleri vardır. Sonraki yazıda, bu kontroller eksik olduğunda neler yaşanabileceğini inceleyeceğiz.

Görsel 2: Akışın altı adımı. • Görsel 3: Bağlantı ve izin ekranları.

![Görsel 2](/blogs/img/oauth-101/02-gorsel.png)

*Görsel 2. “Planla” örneği üzerinden Authorization Code akışının altı adımı ve dört OAuth rolü.*

![Görsel 3](/blogs/img/oauth-101/03-gorsel.png)

*Görsel 3. “Planla” uygulamasında başlatılan izin isteğinin Google’ın onay ekranındaki görünümü.*

## 6. Grant type nedir?

Grant type, uygulamanın access token’ı hangi yöntemle alacağını belirler. Daha önce gördüğümüz scope, uygulamanın nelere erişebileceğini belirtirken grant type, bu erişim için gereken token’ın nasıl alınacağını belirler.

OAuth’ta farklı grant türleri vardır. Burada iki tanesini tanıyalım: Authorization Code ve Implicit.

Authorization Code akışında uygulama önce kısa ömürlü, tek kullanımlık bir kod alır. Ardından bu kodu yetkilendirme sunucusuna göndererek access token elde eder. Yani izin ekranından uygulamaya dönüşte doğrudan access token yerine bir kod taşınır.

Güncel güvenlik yaklaşımı, bu akışı PKCE adlı ek korumayla birlikte kullanmaktır. PKCE, ele geçirilen bir kodun başka biri tarafından token’a dönüştürülmesini önlemeye yardımcı olur.

Implicit, eski uygulamalarda karşılaşabileceğin bir akıştır. Burada ara kod yoktur; access token doğrudan tarayıcıya yapılan yönlendirmeyle iletilir. Token’ın bu şekilde taşınması sızıntı ve kötüye kullanım riskleri oluşturur. Bu nedenle güncel güvenlik rehberi, Implicit yerine Authorization Code temelli yaklaşımın kullanılmasını önerir.

Bu iki akış arasındaki temel farkı bilmek, sonraki yazıda kod ve token sızıntılarının neden farklı sonuçlar doğurabildiğini anlamamızı kolaylaştıracak. İki akışın karşılaştırması Görsel 4’te yer alıyor.

![Görsel 4](/blogs/img/oauth-101/04-gorsel.png)

*Görsel 4. “Planla” örneği üzerinden Authorization Code + PKCE ile Implicit akışın karşılaştırması: güvenli kod takasına karşı riskli doğrudan token erişimi.*

## 7. Bir sitede OAuth kullanıldığını nasıl anlarım?

“Google ile devam et”, “GitHub ile giriş yap” veya “Facebook ile oturum aç” gibi butonlar ilk ipucudur. Bu butonların arkasında OAuth veya OAuth üzerine kurulu bir kimlik doğrulama mekanizması bulunabilir.

Daha somut ipucu, butona bastığında yönlendirildiğin adrestir. Yetkilendirme isteğinde şu parametrelerle karşılaşabilirsin:

```text
https://provider.example/authorize
?client_id=planla-demo
&redirect_uri=https%3A%2F%2Fplanla.example%2Fcallback
&response_type=code
&scope=openid%20profile%20email
&state=ae13d489bd00e3c24
```

Örnek, okunabilmesi için satırlara ayrılmıştır.

| Parametre | Ne anlatır? |
|---|---|
| `client_id` | Hangi uygulamanın erişim istediğini. |
| `redirect_uri` | İşlem sonunda tarayıcının uygulamada hangi adrese döneceğini. |
| `response_type` | Hangi yanıtın istendiğini. Buradaki `code`, yetkilendirme kodu istendiğini gösterir. |
| `scope` | Hangi erişim kapsamlarının istendiğini. |
| `state` | Uygulamanın gelen yanıtı başlattığı istekle eşleştirmesine yardımcı olan değeri. |

Bu örnekte Planla, profil ve e-posta adresi bilgilerini istiyor; karşılığında bir kod almayı ve bu kodun kendi dönüş adresine gönderilmesini bekliyor.

Scope içindeki `openid`, isteğin OIDC ile kimlik doğrulama içerdiğini gösterir. `email` ise e-posta adresi bilgisi içindir; e-postalarının içeriğini okuma izni değildir.

## Özet

OAuth’un temel fikri basittir: Bir uygulamaya erişim izni vermek için hesabının parolasını paylaşman gerekmez. Planla örneğinde uygulama, Google hesabının tamamına erişmek yerine takvimini okumak için izin alır. Bu yetkiyi bir access token ile kullanır; sen de gerektiğinde uygulamanın erişimini kaldırabilirsin.

OAuth, “Bu uygulama neye erişebilir?” sorusuyla ilgilenir. OIDC ise “Giriş yapan kullanıcı kim?” sorusunu cevaplayan katmandır. Uygulama, izin verilen kaynaklara erişmek için access token kullanır.

Authorization Code akışında uygulama önce bir kod alır, ardından bu kodu access token ile değiştirir. Güncel yaklaşım, bu akışı PKCE ile birlikte kullanmaktır. Ancak doğru akışı seçmek kadar, gerekli kontrolleri doğru uygulamak da önemlidir. Token’ın sınırlı yetki vermesi, çalındığında zararsız olduğu anlamına gelmez.

Bir sonraki yazıda, bu akıştaki güvenlik kontrolleri eksik olduğunda neler yaşanabileceğini inceleyeceğiz.

## Kaynaklar

- [RFC 6749 — The OAuth 2.0 Authorization Framework](https://www.rfc-editor.org/rfc/rfc6749.html)
- [RFC 6750 — OAuth 2.0 Bearer Token Usage](https://www.rfc-editor.org/rfc/rfc6750.html)
- [RFC 7636 — Proof Key for Code Exchange (PKCE)](https://www.rfc-editor.org/rfc/rfc7636.html)
- [RFC 9700 — Best Current Practice for OAuth 2.0 Security](https://www.rfc-editor.org/rfc/rfc9700.html)
- [OpenID Connect Core 1.0](https://openid.net/specs/openid-connect-core-1_0.html)
- [Google — Using OAuth 2.0 for Web Server Applications](https://developers.google.com/identity/protocols/oauth2/web-server)
- [Google — OpenID Connect](https://developers.google.com/identity/openid-connect/openid-connect)
