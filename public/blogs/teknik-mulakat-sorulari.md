# Teknik Mülakat Rehberi: Temel Yazılım ve Sistem Mimarisi Soruları

Yazılım mühendisliği mülakatlarında hem junior hem de senior pozisyonlarda en sık karşımıza çıkan, temel bilgisayar bilimi, web teknolojileri ve sistem tasarımı sorularını bu rehberde detaylı ve net açıklamalarıyla ele alıyoruz.


---
![](/blogs/img/devops/teknik-mulakat-sorulari.jpeg)

## 1. HTTP ve HTTPS Arasındaki Fark Nedir?

*   **HTTP (HyperText Transfer Protocol):** Web üzerindeki veri iletişiminin temelini oluşturan protokoldür. Veriler **şifrelenmeden (plaintext)**, açık metin olarak iletilir. Bu durum, ağ trafiğini dinleyen kötü niyetli kişilerin (Man-in-the-Middle saldırıları) verileri (şifreler, kişisel bilgiler vb.) kolayca okuyabilmesine yol açar. Varsayılan olarak **80 numaralı portu** kullanır.
*   **HTTPS (HTTP Secure):** HTTP'nin güvenli versiyonudur. İletişim, **SSL/TLS (Secure Sockets Layer / Transport Layer Security)** protokolü ile şifrelenir. Veriler sunucuya gitmeden önce şifrelenir ve ancak hedef tarafta çözülebilir. Varsayılan olarak **443 numaralı portu** kullanır. SEO açısından bir sıralama kriteridir ve modern web uygulamalarında bir standarttır.

---

## 2. API Nedir? Çeşitleri Nelerdir? RESTful Nedir?

**API (Application Programming Interface - Uygulama Programlama Arayüzü):** Farklı yazılım sistemlerinin birbiriyle konuşmasını, veri alışverişi yapmasını ve işlevselliklerini paylaşmasını sağlayan bir kurallar ve protokoller bütünüdür. Restoran garsonu analojisiyle; mutfak (sunucu/veritabanı) ile müşteri (istemci/frontend) arasındaki köprüdür.

### Başlıca API Çeşitleri:
1.  **REST (Representational State Transfer):** HTTP protokolü üzerine kurulu, stateless (durumsuz) çalışan, en yaygın API mimarisidir. Genellikle JSON veya XML formatında veri döner.
2.  **SOAP (Simple Object Access Protocol):** XML tabanlı, katı kuralları ve güvenlik standartları olan (bankacılık ve kurumsal sistemlerde sıkça görülen) ağır bir protokoldür.
3.  **GraphQL:** İstemcinin (client) tam olarak ihtiyaç duyduğu veriyi sunucudan tek bir sorguyla isteyebilmesini sağlayan Facebook geliştirmesi bir sorgulama dilidir.
4.  **gRPC:** Google tarafından geliştirilen, HTTP/2 protokolü üzerinde çalışan ve Protocol Buffers (protobuf) kullanarak ikili (binary) veri aktarımı yapan, aşırı hızlı bir RPC (Remote Procedure Call) çerçevesidir.

### RESTful Nedir?
REST mimari prensiplerine tamamen uygun olarak tasarlanmış web servislerine **RESTful** denir. Temel kuralları şunlardır:
*   **Client-Server Ayrımı:** İstemci ve sunucu birbirinden bağımsız gelişebilir.
*   **Stateless (Durumsuz):** Sunucu, istemcinin önceki isteklerini hafızasında tutmaz; her istek kendi içinde anlamlı olmalıdır.
*   **Cacheable (Önbelleklenebilir):** Yanıtlar, performans artışı için önbelleğe (cache) uygun olarak işaretlenebilir.
*   **Uniform Interface (Tekdüze Arayüz):** Kaynaklara URL'ler (noun / isimler) üzerinden erişilir ve işlemler HTTP metodları ile yapılır.

---

## 3. HTTP Metodları Nelerdir?

HTTP protokolünde istemcinin sunucudaki bir kaynağa (resource) ne yapmak istediğini belirten fiillerdir (Verbs). En çok kullanılanlar:

*   **GET:** Sunucudan veri okumak/getirmek için kullanılır. Güvenlidir (side-effect yaratmaz) ve önbelleklenebilir (cacheable). İstek parametreleri URL içinde (query string) gönderilir.
*   **POST:** Sunucuya yeni bir kaynak oluşturmak için kullanılır. Güvenli ve idempotent (tekrar edildiğinde aynı sonucu üreten) değildir. Veri, gövdede (body) taşınır.
*   **PUT:** Sunucudaki mevcut bir kaynağın **tamamını** güncellemek (veya yoksa oluşturmak) için kullanılır. İdempotenttir.
*   **PATCH:** Sunucudaki bir kaynağın sadece **belirli bir alanını** (kısmi olarak) güncellemek için kullanılır.
*   **DELETE:** Sunucudaki bir kaynağı silmek için kullanılır. İdempotenttir.

---

## 4. Tarayıcıya `google.com` Yazılıp Enter'a Basıldıktan Sonra Sunucuya Gidip Dönene Kadar Ne Olur?

Bu soru bir mülakat klasiğidir. Adım adım süreç şu şekildedir:

1.  **URL Çözümleme (Parsing):** Tarayıcı girilen metnin bir URL olduğunu anlar ve protokol (`https`), alan adı (`google.com`) gibi parçaları ayırır.
2.  **DNS (Domain Name System) Sorgusu:** Tarayıcı, `google.com` alan adının hangi IP adresine karşılık geldiğini öğrenmek ister. Sırasıyla şu önbelleklere bakar:
    *   Tarayıcı DNS önbelleği
    *   İşletim sistemi (OS) DNS önbelleği
    *   Router önbelleği
    *   ISP (İnternet Servis Sağlayıcı) DNS sunucusu. Eğer hiçbiri yoksa DNS sunucularına gidilerek IP adresi çözümlenir (örn: `142.250.190.46`).
3.  **TCP El Sıkışma (Three-Way Handshake):** İstemci ile sunucu arasında güvenli bir TCP bağlantısı kurmak için paket alışverişi yapılır (`SYN`, `SYN-ACK`, `ACK`).
4.  **TLS / SSL El Sıkışması (HTTPS Durumunda):** Güvenli bağlantı için şifreleme anahtarları müzakere edilir ve sertifika doğrulanır.
5.  **HTTP İsteğinin Gönderilmesi (Request):** Tarayıcı, sunucuya bir HTTP GET isteği gönderir (Headers, Cookies vb. bilgilerle birlikte).
6.  **Sunucu İşlemesi ve Veritabanı:** Sunucu isteği alır, rotaya uygun kodu çalıştırır (gerekiyorsa veritabanına sorgu atar) ve yanıtı hazırlar.
7.  **HTTP Yanıtının Dönmesi (Response):** Sunucu, HTML, CSS, JavaScript veya JSON içeren HTTP yanıtını (Status 200 OK vb.) tarayıcıya geri gönderir.
8.  **Tarayıcının Rendering (Çizim) Süreci:** Tarayıcı gelen HTML'i parse ederek DOM ağacını oluşturur, CSS ile birleştirir (CSSOM), JavaScript dosyalarını çalıştırır ve sayfayı ekrana çizer.

---

## 5. Redis Nedir? Cache'te Ne Tutulur?

*   **Redis (Remote Dictionary Server):** Verileri disk yerine **RAM (bellek)** üzerinde tutan, bu sayede inanılmaz yüksek okuma/yazma hızlarına (milisaniyenin altı) sahip, açık kaynaklı bir in-memory veri yapıları sunucusudur. Genellikle cache (önbellek), Session yönetimi, mesaj kuyruğu (pub/sub) ve real-time analitik için kullanılır.

### Cache'te (Önbellekte) Ne Tutulur?
Veritabanına her istek attığımızda disk I/O maliyeti oluşur ve sistem yavaşlar. Sık erişilen ancak nadiren değişen veriler cache'te tutulur:
*   Kullanıcı oturum bilgileri (Session state)
*   Sıkça sorulan veritabanı sorgu sonuçları (örn: Anasayfa popüler ürünler listesi)
*   API yanıtları (Rate limiting sayaçları, dış servis yanıtları)
*   Yetkilendirme token'ları (Blacklist'e alınmış JWT'ler)
*   Geçici doğrulama kodları (OTP - SMS kodları)

---

## 6. JWT (JSON Web Token) Nedir?

**JWT**, taraflar arasında JSON nesnesi olarak güvenli bir şekilde bilgi aktarmak için kullanılan açık bir standarttır (`RFC 7519`). Genellikle kullanıcı kimlik doğrulamasında (Authentication) kullanılır.

Yapısı üç bölümden oluşur ve noktalarla (`.`) ayrılır:
1.  **Header (Başlık):** Token'ın türü (JWT) ve kullanılan imza algoritması (örn: HS256).
2.  **Payload (Yük):** Taşınmak istenen veriler (Claims). Örn: `userId`, `role`, token'ın son kullanma tarihi (`exp`). *Not: Şifrelenmez, sadece Base64 ile encode edilir; bu yüzden hassas bilgiler (şifre vb.) konulmamalıdır.*
3.  **Signature (İmza):** Header ve Payload'un gizli bir anahtar (secret key) ile imzalanmış halidir. Token'ın yolda değiştirilip değiştirilmediğini doğrulamak için kullanılır.

---

## 7. TRANSACTION (İşlem) Nedir?

Bir veritabanında mantıksal bir birim oluşturan bir veya daha fazla SQL komutunun tamamıdır. **"Ya hep ya hiç" (All-or-Nothing)** prensibiyle çalışır. 
Örneğin, bir banka hesabından diğerine para transferi iki adımdan oluşur: A hesabından düş, B hesabına ekle. Eğer A'dan para düşüp B'ye eklenemeden elektrik kesilirse, TRANSACTION mekanizması tüm işlemi geri alır (**rollback**), böylece veri tutarsızlığı önlenir.

---

## 8. ACID Nedir?

Güvenli bir veritabanı yönetim sisteminin (DBMS) bir Transaction sırasında veri bütünlüğünü garanti etmek için sahip olması gereken 4 temel özelliktir:

*   **Atomicity (Atomiklik):** Bir transaction içerisindeki tüm adımlar eksiksiz gerçekleşmelidir. Adımlardan biri bile hata verirse, yapılan tüm değişiklikler iptal edilir (rollback).
*   **Consistency (Tutarlılık):** Veritabanı bir transaction başlamadan önce hangi kurallara (constraints, foreign key vb.) uyuyorsa, transaction bittiğinde de aynı kurallara uymalıdır. Bozuk veya kurallara aykırı veri oluşamaz.
*   **Isolation (İzolasyon):** Aynı anda çalışan birden fazla transaction, birbirlerinin sonuçlarından etkilenmemelidir. Her biri sanki tek başına çalışıyormuş gibi izole olmalıdır.
*   **Durability (Dayanıklılık):** Bir transaction başarılı bir şekilde tamamlanıp onaylandıktan (`commit`) sonra, sistem çöker veya elektrik kesilse bile yapılan değişiklikler kalıcıdır, kaybolmaz.

---

## 9. Eş Zamanlılık (Concurrency) Nedir?

Birden fazla görevin veya işlemin **aynı zaman dilimi içinde** yürütülmesi durumudur. Çok çekirdekli işlemcilerde paralel çalışmayı da kapsayabilir. Yazılımda eş zamanlılık yönetimi kritik bir konudur; çünkü iki farklı kullanıcı aynı anda aynı koltuğu rezerve etmek istediğinde veya aynı banka hesabından para çekmek istediğinde **Race Condition (Yarış Durumu)** gibi sorunlar ortaya çıkabilir. Mutex, Semaphore, Lock gibi yapılarla kontrol altına alınır.

---

## 10. CAP Teoremi Nedir?

Dağıtık sistemlerin (Distributed Systems) aynı anda sağlayabileceği üç garantiden en fazla **ikisinin** aynı anda seçilebileceğini savunan teoremdir (Brewer Teoremi):

1.  **Consistency (Tutarlılık):** Sistemdeki tüm düğümler (nodes), aynı anda aynı veriyi mi görüyor? (Bir düğüme yazılan veri, diğer düğümden okunduğunda anında görünür mü?)
2.  **Availability (Erişilebilirlik):** Hatalı veya çöken düğümler olsa bile, sisteme gelen her istek mutlaka (hata dönmeden) başarılı bir yanıt alıyor mu?
3.  **Partition Tolerance (Bölünmeye Dayanıklılık):** Ağda kopmalar veya kesintiler (network partition) olsa bile sistem çalışmaya devam ediyor mu?

Dağıtık sistemlerde ağ kopmaları (Partition) kaçınılmaz olduğu için **P her zaman seçilmek zorundadır**. Bu nedenle sistemler mimari tercihlerine göre ikiye ayrılır:
*   **CP Sistemler (Consistency + Partition Tolerance):** Ağ kopması anında tutarlılığı korumak için bazı düğümleri erişime kapatır (Erişilebilirlikten ödün verir). Örn: Bankacılık sistemleri.
*   **AP Sistemler (Availability + Partition Tolerance):** Ağ kopması olsa bile yanıt vermeye devam eder ancak düğümler arası senkronizasyon gecikebilir, veri eski okunabilir (Tutarlılıktan ödün verir). Örn: Sosyal medya beğeni sayaçları, e-ticaret sepetleri.