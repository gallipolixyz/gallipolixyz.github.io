

## Modern Web Nedir?

Web; cihazındaki bir **istemcinin (Client)**, internet ortamındaki bir **sunucuya (Server)** standart kurallar çerçevesinde istek gönderip, oradan gelen yanıtı işlemesi sürecidir.

Bu yazıda, tarayıcı üzerinden bir web adresi girdiğimizde yanıtın bize ulaşana kadar geçtiği tüm süreçleri detaylarıyla anlamaya çalışacağız. Ancak öncesinde, günlük hayatta sıkça yapılan temel bir kavram karmaşasını düzeltmekte fayda var: Bir arama yapmak istediğimizde sıkça "internete sor" cümlesini duyarız. Günlük dilde bu iki terim birbirinin yerine kullanılsa da teknik olarak bambaşka kavramları ifade ederler:

- **İnternet (Infrastructure / Altyapı):** Dünya genelindeki bilgisayarların, sunucuların, telefonların ve diğer tüm cihazların kablolar, uydular ve yönlendiriciler (router) aracılığıyla birbirine bağlanmasını sağlayan fiziksel ve mantıksal ağ altyapısıdır. Bir nevi devasa bir otoyol ağı gibidir.
- **Web (Service / Servis):** Bu otoyolu kullanan araçlardan sadece bir tanesidir. HTTP/HTTPS protokolleri üzerinden çalışan; sayfaları, uygulamaları ve içerikleri birbirine bağlayan sistemdir.

Kısacası biz "internete" soru sormayız; internet altyapısını kullanarak Web üzerindeki bir sunucuya ve arama motoruna erişiriz. E-posta göndermek (SMTP), dosya aktarmak (FTP) veya çevrim içi oyun oynamak da internet altyapısını kullanır ancak bunların hiçbiri "Web" değildir.

### Bir İçerik Web'in Parçası Nasıl Olur?

Bilgisayarında bir klasör dolusu dosya olduğunu farz et: Bir metin belgesi (HTML), birkaç görsel ve bir stil dosyası (CSS). Bu dosyalar sadece senin yerel bilgisayarında durduğu sürece henüz Web üzerinde değillerdir.

Ne zaman ki sen bu dosyaları:

1. **7/24 açık ve erişilebilir bir Web sunucusuna yüklersin,**
2. **Bu dosyalara özel bir URL / web adresi tanımlarsın,**
3. **Ve bir başkası kendi tarayıcısıyla (Chrome, Safari, Firefox vb.) bu adrese gelip HTTP/HTTPS protokolü üzerinden o dosyaları çekip görüntüler...**

İşte tam o an, o içerik Web'in bir parçası hâline gelir.

Özetle **Web**; birbirine bağlantılarla (linklerle) düğümlenmiş, benzersiz URL adreslerine sahip, HTTP/HTTPS protokolüyle sunucudan tarayıcıya taşınan ve tarayıcının ekrana çizerek bize sunduğu dokümanlar ile uygulamalar ağıdır.

Üstelik bu ağ sadece statik metinlerden veya resimlerden ibaret değildir. Bugün tarayıcında çalışan karmaşık oyunlar, formlar, yönetim panelleri ve canlı videolar... Tarayıcının HTTP protokolü ile çekip sana gösterebildiği ve linklerle birbiriyle ilişkilendirilen her şey Web'in bir parçasıdır.

## Web'e Neden İhtiyaç Duyarız?

O yıllarda internet altyapısı zaten mevcuttu. Bilgisayarlar birbirine bağlanabiliyor, kullanıcılar e-posta gönderebiliyor ve FTP protokolü üzerinden dosya transferi yapabiliyordu. Ancak tüm bu imkânlara rağmen çözülemeyen çok kritik bir sorun vardı: **Bilgi Dağınıklığı ve Standart Eksikliği.**

Sistemin önündeki ana engeller şunlardı:

- Bilim insanlarının kullandığı bilgisayarlar, işletim sistemleri ve belge formatları tamamen birbirinden farklıydı. Bir bilgisayarda hazırlanan teknik bir dokümanı başka bir sistemde açabilmek neredeyse imkânsızdı.
- Dünyanın en büyük parçacık fiziği laboratuvarı olan CERN'de binlerce araştırmacı görev yapıyordu. Bir araştırmacı projeden ayrıldığında veya kurum değiştirdiğinde, ürettiği tüm bilgi birikimi ve akademik çalışmalar da onunla birlikte kaybolup gidiyordu.
- Bir belgenin içinde referans gösterilen başka bir kaynağa ulaşmak tam bir çileydi. Kullanıcının, hedef dosyanın tam olarak hangi sunucuda, hangi klasör yolunda saklandığını bilmesi ve onu FTP ile manuel olarak bilgisayarına indirmesi gerekiyordu.

### Tim Berners-Lee ve Web'in Doğuşu

CERN'de çalışan bir bilgisayar bilimcisi olan **Tim Berners-Lee**, bu küresel kaos ve bilgi karmaşasına bir son vermek amacıyla 1989 yılında *"Information Management: A Proposal"* (Bilgi Yönetimi: Bir Teklif) başlıklı tarihi raporunu sundu. Yöneticisi Mike Sendall, teklifin üzerine o meşhur **"Belirsiz ama heyecan verici..."** *(Vague but exciting...)* notunu düşerek projeye onay verdi.

Tim Berners-Lee'nin vizyonu son derece netti: **Tüm bilgileri ve belgeleri evrensel, ortak bir dille birbirine bağlamak.**

Bu vizyonu hayata geçirmek için Modern Web'in omurgasını oluşturan **3 temel yapı taşını** eş zamanlı olarak icat etti:

1. **HTML (HyperText Markup Language):** Belgelerin işletim sisteminden bağımsız, herkes tarafından erişilebilir ortak bir formatta yazılmasını sağlayan işaretleme dili.
2. **HTTP (Hypertext Transfer Protocol):** Bu belgelerin sunucudan istemciye (kullanıcıya) hangi kurallar çerçevesinde ve nasıl aktarılacağını belirleyen iletişim protokolü.
3. **URL (Uniform Resource Locator):** İnternet ağ üzerindeki her bir belgenin, kaynağın ve sayfanın benzersiz dijital adresi.

## Web Nasıl Çalışır?

Açıklayacağımız bu süreç; istemcinin bir isteği başlatmasından sunucunun döndürdüğü yanıtın ekranda işlenmesine kadar geçen **5 ana evreden** oluşmaktadır:

1. **İstemci Tarafı Hazırlık Aşaması:** Kullanıcının girdiği metnin analiz edilmesi ve geçerli bir URL/Protokol yapısına dönüştürülmesi.
2. **Adresleme ve Çözümleme Aşaması (DNS):** Sözel alan adının (`gallipoli.xyz`), ağ üzerindeki hedef cihazı belirten sayısal IP adresine çevrilmesi süreci.
3. **İletişim Kanalının Kurulması Aşaması (Transport & Security):** İstemci ile hedef IP arasında güvenli veri akışını sağlayacak olan bağlantının (TCP) ve güvenlik protokolünün (TLS/HTTPS) kurulması.
4. **İstek ve Yanıt Trafiği (HTTP Request / Response):** İstemcinin talep ettiği kaynağa dair HTTP İsteğini sunucuya iletmesi; sunucunun ise bu isteği karşılayıp işleyerek yanıtı (HTTP Response) geri döndürmesi.
5. **Sunum ve Görselleştirme Aşaması (Client Rendering):** İstemcinin (tarayıcının) sunucudan gelen ham veriyi alıp kullanıcı için anlamlı bir görsel arayüze (ekrana) dönüştürmesi.

### İstemci - Sunucu (Client-Server) Mimarisi

İletişim sürecinin detaylarına girmeden önce, tüm bu trafiğin üzerinde aktığı mimariyi anlamamız gerekir:

![image.png](public/blogs/img/modern_web_nasıl_çalışır/image.png)

#### A. İstemci (Client)

İletişimi başlatan ve hizmet talep eden taraftır.

- **Görevi:** Kullanıcı etkileşimlerini almak, bu istekleri ağ standartlarına uygun biçimde paketleyip sunucuya iletmek ve sunucudan gelen yanıtı kullanıcıya sunmaktır.
- **Web'deki Karşılığı:** Kullanıcının cihazında çalışan Web Tarayıcılarıdır (Chrome, Firefox, Safari vb.).

#### B. Sunucu (Server)

İstekleri dinleyen, işleyen ve hizmet veren taraftır.

- **Görevi:** Ağ üzerinden gelen istekleri karşılamak, güvenlik ve yetki kontrollerini yapmak, gerekirse veritabanı sorgularını çalıştırmak ve talep edilen kaynağı paketleyip geri göndermektir.
- **Web'deki Karşılığı:** 7/24 kesintisiz çalışan donanımlar üzerinde görev yapan Web Sunucu yazılımlarıdır (Nginx, Apache, IIS vb.).

### 1. Evre: İstemci Tarafı Hazırlık Aşaması (URL Ayrıştırma)

Kullanıcının tarayıcı adres çubuğuna bir metin yazıp `Enter` tuşuna bastığı ilk anda, ağa henüz herhangi bir paket fırlatılmadan önce tamamen istemcinin kendi içinde gerçekleşen hazırlık sürecidir.

Plaintext

```
[ Kullanıcı Girdisi ] ──► [ Format Denetimi ] ──► [ URL Ayrıştırma (Parsing) ]
```

Bu çalışmada, bir istemciden web sunucusuna giden isteğin arka planını en yaygın araç olan **web tarayıcıları** üzerinden inceleyeceğiz. Ancak unutulmamalıdır ki web üzerinde istek başlatmak sadece tarayıcılara özgü bir durum değildir; günümüzde arayüzler oldukça çeşitlenmiştir:

- **Yapay Zeka Asistanları:** Örneğin Gemini ile sohbet ederken ekranda gördüğünüz *"Web'de aranıyor..."* ifadesi, arka planda tıpkı bir tarayıcı gibi sizin adınıza ağa çıkıp sunuculara HTTP istekleri fırlatıldığını gösterir.
- **Mobil Uygulamalar:** Instagram, Spotify veya mobil bankacılık uygulamalarında yapılan bir arama ya da ekran yenileme hareketi de istemci tarafında bir web isteği başlatır.

Arama modundan doğrudan erişim moduna geçişi anlamak için web'in çalışma temelini bilmek gerekir: Web üzerindeki tüm kaynaklar (siteler, görseller, sayfalar) benzersiz bir adres (**URL**) üzerinden tanımlanır.

Tarayıcılar ve ağ protokolleri, *"Gallipoli topluluğu"* gibi sözel arama ifadeleriyle doğrudan bir sunucuya ulaşamazlar. İstemcinin sunucudan belirli bir kaynağı talep edebilmesi için girdinin mutlaka tanımlı bir URL formatına kavuşması veya dönüştürülmesi gerekir.

Arama motorunun sunduğu sonuç sayfasındaki bir linke tıkladığımızda da aslında gerçekleşen şey tam olarak budur: Tarayıcı, arka planda tanımlanmış olan o köprü adresini (`[https://gallipoli.xyz](https://gallipoli.xyz)`) okur, girdiyi kesin bir URL formatına dönüştürür ve doğrudan erişim sürecini başlatır.

Şimdi tarayıcının bizden URL formatındaki isteği almasıyla neler olduğuna geçmeden önce, URL yapısını biraz daha yakından tanıyalım:

### URL (Uniform Resource Locator - Tekdüze Kaynak Bulucu)

Plaintext

```
https://             gallipoli.xyz           :443 (Gizli)          / (Gizli)
   │                       │                      │                    │
[Protokol]           [Domain Name]              [Port]               [Path]
```

Bir **URL**, tıpkı gerçek hayattaki bir kargo adresi gibidir; her bir parçası ağ cihazlarına farklı bir talimat verir:

1. **`https://` — Protokol (İletişim Kuralları Seti):** İstemci ile sunucunun hangi kurallarla konuşacağını belirtir. `http` verileri açık metin olarak taşırken, sondaki **`s` (Secure)** verilerin TLS/SSL şifrelemesiyle güvenli bir tünel üzerinden aktarılacağını gösterir.
2. **`gallipoli.xyz` — Alan Adı (Domain Name / Host):** Ağ üzerindeki hedef sunucunun insanlar tarafından okunabilen sözel ismidir.
    - `gallipoli`: Sitenin özel adı (*Second-Level Domain*).
    - `.xyz`: Üst Düzey Alan Adı (*Top-Level Domain - TLD*). İnternet üzerindeki kategorik veya genel uzantıdır (`.com`, `.net`, `.org` gibi).
3. **Sıkça Gizlenen İki Bileşen (Port ve Path):** Adres çubuğuna yazmasanız bile istemci bu adresi ayrıştırırken otomatik olarak şu iki bilgiyi de ekler:
    - **Port (`:443`):** Sunucu üzerindeki hangi kapıdan içeri girileceğini gösterir. Standart HTTP istekleri `80`, güvenli HTTPS istekleri `443` numaralı kapıdan işlenir.
    - **Path / Yol (`/`):** Sunucudaki hangi dosya veya kaynağın istendiğini gösterir. En sonda bir yol belirtilmediyse varsayılan olarak `/` (Kök Dizin / Ana Sayfa) kastedilir. *(Örn: `[https://gallipoli.xyz/hakkimizda](https://gallipoli.xyz/hakkimizda)` yazılsaydı, Path kısmı `/hakkimizda` olacaktı).*

Buraya kadar gördüğümüz üzere adres çubuğuna yazdığımız `gallipoli.xyz`, insanlar için kolaylaştırılmış sözel bir isimdir. Ancak bilgisayarlar ve ağ donanımları harflerden anlamaz; sadece sayısal **IP adresleri** üzerinden haberleşirler.

İşte tam bu noktada, sözel alan adını sayısal IP adresine çeviren **DNS (Domain Name System)** kavramı devreye girer.

### Adresleme ve Çözümleme Aşaması -DNS

İstemci (tarayıcı) URL'yi parçalayıp ne talep ettiğini netleştirdi. Ancak ağ üzerindeki donanımlar harflerden (`gallipoli.xyz`) anlamaz; bilgisayarlar birbiriyle yalnızca sayısal **IP adresleri** üzerinden haberleşebilir.

Bu yüzden istemcinin ilk işi, sözel olan `gallipoli.xyz` adresini ağın anlayacağı sayısal bir IP adresine (örneğin `185.125.X.X`) dönüştürmektir. İşte bu dönüşümü sağlayan küresel rehber sistemine **DNS (Domain Name System - Alan Adı Sistemi)** denir.

DNS çözümleme süreci, kullanıcının cihazındaki en yakın hafızadan başlayarak küresel DNS hiyerarşisine kadar uzanan adımlı bir arama zinciridir:

```
[ Tarayıcı / İşletim Sistemi Önbelleği ]
       │ (Bulunamazsa)
       ▼
[ İSS DNS Çözücü (Recursive Resolver) ]
       │ (Sırasıyla Sorgular)
       ├─► 1. Kök Sunucu (Root Server)
       ├─► 2. TLD Sunucusu (.xyz Server)
       └─► 3. Yetkili Sunucu (Authoritative Nameserver) ──► IP Bulundu!
```

#### Yerel Önbellek Kontrolü

Dış dünyaya henüz hiçbir ağ paketi fırlatılmadan önce istemci, kendi yerel kaynaklarını kontrol eder:

- **Tarayıcı Önbelleği:** *"Ben yakın zamanda bu adrese bir ziyaret gerçekleştirdim mi ve IP adresi hafızamda saklı mı?"*
- **İşletim Sistemi Önbelleği (ve Hosts Dosyası):** *"İşletim sisteminin kendi önbelleğinde veya `hosts` dosyasında bu alan adına tanımlanmış bir IP adresi var mı?"*

**Sonuç:** Eğer IP adresi yerel önbellekte bulunursa, dış ağda hiç sorgu çalıştırılmadan doğrudan bu IP ile bağlantı kurulur. Eğer yerel önbellekte bir kayıt bulunamazsa, süreç bir sonraki adıma geçer.

### DNS Çözücüye (Resolver) Başvuru

![image.png](image1.png)

Yerel önbelleklerden sonuç alınamazsa, istemci talebi İnternet Servis Sağlayıcısının (İSS: Türk Telekom, Superonline vb.) veya cihazda özel tanımlanmış bir DNS sağlayıcısının (Cloudflare `1.1.1.1`, Google `8.8.8.8` vb.) **DNS Çözücü (Recursive Resolver)** sunucusuna iletir:

> *"Bana `gallipoli.xyz` adresinin IP adresini bulabilir misin?"*
> 

Eğer DNS Çözücü bu IP adresini kendi önbelleğinde tutmuyorsa, yanıtı bulmak için küresel DNS hiyerarşisindeki yetkili sunucuları sırasıyla sorgulamaya başlar:

1. **Kök Sunucuya (Root Server) Başvuru:**
    - **Çözücü:** *" `gallipoli.xyz` adresinin IP adresi nerede?"*
    - **Kök Sunucu:** *"Nihai IP'yi ben bilmem; ancak bu adres `.xyz` uzantısıyla bitiyor. Sen git, `.xyz` Üst Düzey Alan Adı (TLD - Top Level Domain) sunucusuna sor."*
2. **TLD Sunucusuna (`.xyz` Server) Başvuru:**
    - **Çözücü:** *" `gallipoli.xyz` adresinin IP adresi nerede?"*
    - **TLD Sunucusu:** *"IP adresini doğrudan ben de tutmuyorum; fakat bu alan adının tüm DNS kayıtlarının yönetildiği **Yetkili Sunucu (Authoritative Nameserver)** şudur, git ona sor."*
3. **Yetkili Sunucuya (Authoritative Server) Başvuru:**
    - **Çözücü:** *" `gallipoli.xyz` adresinin IP adresi nedir?"*
    - **Yetkili Sunucu:** *"Nihai ve kesin kayıt bende yer alıyor: `gallipoli.xyz` adresinin IP adresi `185.125.X.X`’tir."*

Yetkili sunucudan doğru adresi temin eden DNS Çözücü şu iki işlemi gerçekleştirir:

1. **Önbelleğe Alma:** Aynı adrese yapılacak sonraki sorgularda tüm bu küresel zinciri tekrar işletmemek adına IP bilgisini kendi önbelleğine kaydeder (Bu kayıt, domain sahibinin belirlediği **TTL - Time to Live** süresi boyunca saklanır).
2. **Yanıtı İletme:** İstemciye (tarayıcıya) sonucu döner: *"Hedefin IP adresi `185.125.X.X`."*

Bu aşamanın sonunda istemci, `gallipoli.xyz` adresinin dijital ağ üzerindeki gerçek, fiziksel karşılığı olan IP adresini elde etmiş olur.

Hedef IP adresi tam olarak netleştiğine göre, bir sonraki kritik aşamaya geçilebilir. İstemcinin elinde artık sunucunun mantıksal IP adresi (`185.125.X.X`) ve güvenli web trafiğinin aktığı hedef port numarası (**Port 443**) bulunmaktadır.

Ancak istemci, sunucuya doğrudan *"Bana veri/ana sayfayı gönder"* talebinde bulunamaz. Güvenli, veri kaybız ve sıralı bir veri akışı sağlayabilmek için öncelikle iki tarafın ağ seviyesinde bir el sıkışma (**Handshake**) süreci gerçekleştirerek güvenli iletişim hattını kurması gerekir.

### İletişim Kanalının Kurulması (TCP & TLS Handshake)

Bu aşama, istemci ile sunucu arasında verinin eksiksiz, sıralı ve şifrelenmiş bir şekilde aktarılacağı dijital boru hattının inşa edildiği kritik süreçtir. Güvenli bir iletişim kanalı oluşturmak adına sırasıyla iki temel el sıkışma (handshake) protokolü çalıştırılır:

```
[ İstemci ] ─── ( 1. TCP 3-Way Handshake ) ───► [ Sunucu ]  --> İletişim Hattı Açıldı
[ İstemci ] ─── ( 2. TLS / SSL Handshake ) ───► [ Sunucu ]  --> Kanal Şifrelendi
```

#### A. TCP 3-Way Handshake (Üçlü El Sıkışma)

HTTP/HTTPS trafiğinin paket kaybı yaşanmadan güvenilir bir şekilde iletilebilmesi için taşıma katmanında **TCP (Transmission Control Protocol)** kullanılır. İstemci ile sunucu, mantıksal bir ağ bağlantısı kurabilmek amacıyla 3 adımlı bir onay mekanizmasını devreye sokar:

1. **SYN (Synchronize):** İstemci, sunucuya özel bir bayrak (flag) içeren ağ paketi iletir: *"Seninle senkronize olmak ve güvenilir bir iletişim kanalı başlatmak istiyorum."*
2. **SYN-ACK (Synchronize-Acknowledge):** Sunucu isteği alır, durumu değerlendirir ve yanıt verir: *"İsteğini aldım (ACK) ve ben de seninle senkronize olmaya hazırım (SYN). İletişimi başlatabiliriz."*
3. **ACK (Acknowledge):** İstemci son teyidi sunucuya gönderir: *"Onayını aldım (ACK), bağlantıyı resmi olarak kuruyorum."*

**Sonuç:** İstemci ile sunucu arasında veri paketlerini taşımaya hazır, kararlı ve çift yönlü bir TCP bağlantısı açılmış olur.

#### B. TLS / SSL Handshake (Güvenlik ve Şifreleme Katmanı)

Hedef adres `https://` (Secure) protokolünü kullandığı için, veri akışının ağ üzerindeki üçüncü şahıslar tarafından dinlenmesini (eavesdropping) veya değiştirilmesini (MITM saldırıları) önlemek amacıyla bu kanalın şifrelenmesi zorunludur.

1. **Client Hello (İstemci Selamı):** İstemci; desteklediği TLS sürümlerini, şifreleme algoritmalarını (Cipher Suites) ve rasgele üretilmiş bir veri dizisini sunucuya iletir.
2. **Server Hello & Sertifika Gönderimi:** Sunucu, istemcinin sunduğu seçenekler arasından en uygun şifreleme yöntemini seçer. Ardından, kendi kimliğini kanıtlayan yetkili bir Sertifika Otoritesi (CA - Certificate Authority) tarafından imzalanmış **SSL/TLS Sertifikasını** istemciye sunar.
3. **Sertifika Doğrulama (Certificate Verification):** İstemci, sunucunun gönderdiği sertifikayı zincirleme kontrol ederek sunucunun gerçekten `gallipoli.xyz` adresiyle eşleştiğini ve geçerli olduğunu doğrular.
4. **Anahtar Değişimi (Session Key Generation):** İstemci ve sunucu, asimetrik şifreleme yöntemlerini kullanarak yalnızca ikisinin bildiği ortak bir **simetrik oturum anahtarı (Session Key)** üzerinde uzlaşır. Bundan sonraki tüm veri akışı bu ortak anahtarla şifrelenecektir.

**Sonuç:** Ağ katmanı seviyesinde iki taraf arasında uçtan uca şifrelenmiş, bütünlüğü korunan güvenli bir **HTTPS tüneli** kurulmuştur.

Ağ bağlantısı başarıyla kurulmuş ve şifrelenmiştir. İletişim boru hattı tamamen hazır hale geldiğine göre istemci, sunucudan talep edeceği asıl web verisini paketleyip iletmeye geçebilir.

### İstek ve Yanıt Trafiği (HTTP Request / Response)

Güvenli iletişim tüneli kurulduktan sonra istemci, sunucudan talep ettiği kaynağı net bir paket halinde iletir ve sunucu bu talebi işleyerek bir yanıt döndürür:

```
[ İstemci ] ─── ( HTTP GET İsteği ) ───► [ Sunucu ]
[ İstemci ] ◄─── ( HTTP Yanıtı + HTML ) ─── [ Sunucu ]
```

#### A. İstemcinin İsteği (HTTP Request)

İstemci, oluşturulan şifreli kanal üzerinden hedef sunucuya ne talep ettiğini bildiren yapılandırılmış bir paket gönderir. Standart bir HTTP isteği temel olarak 3 ana bileşenden oluşur:

1. **Request Line (İstek Satırı):** İsteğin metodunu, hedeflenen kaynak yolunu (path) ve HTTP protokol sürümünü belirtir.
    - `GET / HTTP/1.1` *(GET metodu: "Bana veriyi getir", `/`: "Ana sayfa kök dizinini getir")*
2. **Request Headers (İstek Başlıkları):** İstemci, ortam ve istek hakkında meta bilgiler taşır:
    - `Host: gallipoli.xyz` *(Hangi alan adının istendiği)*
    - `User-Agent: Chrome/...` *(İsteği yapan tarayıcı ve işletim sistemi bilgisi)*
    - `Accept: text/html` *(İstemcinin kabul edebileceği veri formatı)*
3. **Request Body (İstek Gövdesi):** Sunucuya gönderilecek ek verileri barındırır. `GET` metoduyla yapılan veri taleplerinde gövde genellikle boştur. *(Ancak bir form doldurulup `POST` metoduyla veri gönderilseydi, kullanıcının girdiği veriler bu kısımda taşınacaktı).*

#### B. Sunucunun İşleme Aşaması (Server Processing)

Sunucu yazılımı (Nginx, Apache vb.) gelen HTTP isteğini karşılar ve şu süreçleri işletir:

1. **İsteği Ayrıştırma:** Paket incelenir; *" Benden `gallipoli.xyz` sitesinin `/` (ana sayfa) kaynağı talep edilmiş."*
2. **İçeriği Hazırlama:** Sunucu, diskinde saklanan statik `index.html` dosyasını bulur veya arka planda çalışan uygulama kodlarını (Python, Node.js, PHP vb.) tetikleyerek veritabanı sorgularıyla birlikte dinamik bir HTML içeriği üretir.
3. **Paketleme:** Elde edilen veriyi standart bir HTTP Yanıt paketine dönüştürür.

#### C. Sunucunun Yanıtı (HTTP Response)

Sunucu hazırladığı yanıt paketini güvenli hat üzerinden istemciye geri fırlatır. Bu yanıt da benzer şekilde 3 ana bileşenden oluşur:

1. **Status Line (Durum Satırı):** İsteğin nasıl sonuçlandığını bildiren HTTP durum kodunu barındırır.
    - `HTTP/1.1 200 OK` *(İşlem başarılı, talep edilen kaynak paketlendi ve gönderiliyor)*
    - *(Farklı senaryolarda `404 Not Found` [Kaynak Bulunamadı] veya `500 Internal Server Error` [Sunucu İçi Hata] gibi durum kodları da dönebilirdi).*
2. **Response Headers (Yanıt Başlıkları):** Gönderilen yanıtın boyutu, türü ve sunucu yapılandırması hakkında bilgiler içerir:
    - `Content-Type: text/html; charset=UTF-8` *(İçeriğin HTML belgesi olduğunu bildirir)*
    - `Content-Length: 4520` *(Gönderilen verinin bayt cinsinden boyutu)*
3. **Response Body (Yanıt Gövdesi):** İstemcinin talep ettiği asıl ham veriyi barındırır. Yani web sayfasının yapısını, stillerini ve dinamik davranışlarını oluşturan ham **HTML, CSS ve JavaScript** kodları bu bölümde yer alır.

#### Aşamayı Sonlandıran Durum

İstemci (tarayıcı), sunucudan gelen HTTP Yanıtı ile birlikte ham metin halindeki HTML, CSS ve JavaScript kodlarını eksiksiz teslim almıştır.

Ancak kullanıcının ekranda karşılaştığı şey ham kod dizilimleri değil; renkleri, butonları, fontları ve görselleriyle düzenlenmiş şık bir web arayüzüdür. İşte bu ham veriyi anlamlı bir görsel arayüze dönüştüren son adım, **5. Evre: Sunum ve Görselleştirme (Client Rendering)** aşamasıdır.

### Sunum ve Görselleştirme Aşaması (Client Rendering)

Tarayıcı motoru (Blink, Gecko, WebKit vb.), sunucudan gelen ham HTML belgesini yukarıdan aşağıya doğru satır satır ayrıştırmaya (parse etmeye) ve işlemeye başlar. Bu aşama, ham kod dizilimlerinin kullanıcı etkileşimine açık görsel bir arayüze dönüştüğü evredir:

```
[ Ham HTML / CSS / JS ] ──► [ DOM & CSSOM Ağaçları ] ──► [ Render Tree ] ──► [ Layout & Paint ] ──► [ Ekranda Görsel Arayüz ]
```

#### A. DOM ve CSSOM Ağaçlarının Oluşturulması

1. **DOM (Document Object Model) Ağacı:** Tarayıcı, HTML etiketlerini (`<div>`, `<h1>`, `<p>` vb.) ayrıştırarak sayfanın mantıksal iskeletini ve hiyerarşik düğüm (node) yapısını oluşturan nesne ağacını inşa eder.
2. **CSSOM (CSS Object Model) Ağacı:** HTML ayrıştırılırken karşılaşılan dâhili CSS kuralları veya haricî CSS dosyaları (`<link>`) yüklenerek her bir elemanın stil özelliklerini (renk, boyut, konumlandırma) haritalandıran CSS nesne ağacı oluşturulur.

#### B. Render Tree (Görselleştirme Ağacı) Oluşturma

Tarayıcı; yapıyı temsil eden **DOM** ile görsel kuralları temsil eden **CSSOM** ağaçlarını birleştirir. Bu birleşim sonucunda ekranda yalnızca fiziksel olarak **görünecek olan elemanlardan** oluşan bir **Render Tree** meydana getirilir.

*(Örneğin: CSS tarafında `display: none` kuralı atanmış bir eleman DOM ağacında yer alsa dahi, ekranda yer kaplamayacağı için Render Tree’ye dâhil edilmez).*

#### C. Layout (Düzen / Reflow) Aşaması

Render Tree oluştuktan sonra tarayıcı, her bir görsel elemanın ekran üzerindeki kesin konumunu ve boyutlarını hesaplama evresine geçer:

- Görüş alanı (viewport) genişliği ve yüksekliği nedir?
- İlgili butonun piksel cinsinden genişliği ve yüksekliği ne olmalıdır?
- Kutu modeli (box model) elemanları sayfa üzerinde nasıl konumlanacaktır?

#### D. Paint (Boyama) ve Composite (Kombine Etme) Aşaması

- **Paint (Boyama):** Elemanların hesaplanan konumlarına göre metinleri, arka plan renkleri, kenarlıkları, gölgeleri ve görselleri ekrana piksel piksel çizilir.
- **Composite (Kombine Etme):** Sayfadaki farklı katmanlar (özellikle animasyonlar, sabit menüler veya `z-index` katmanları) doğru bir sırayla üst üste bindirilir ve grafik işlemcisi (GPU) desteğiyle son görsel çıktı ekrana işlenir.

#### E. JavaScript İcrası ve Asenkron Ek İstekler

HTML ayrıştırma sürecinde bir `<script>` etiketi veya haricî bir medya kaynağı (`<img>`, `@font-face` vb.) ile karşılaşıldığında:

1. **Ek HTTP İstekleri:** Tarayıcı; görseller, yazı tipleri veya haricî kütüphaneler için sunucuya asenkron (arka planda) yeni HTTP istekleri fırlatır.
2. **JavaScript İcrası:** JavaScript motoru (V8, SpiderMonkey vb.) script kodlarını derleyip çalıştırır. Böylece sayfa üzerindeki dinamik işlevler (tıklama olayları, DOM manipülasyonları, animasyonlar ve veri güncellemeleri) aktif hale getirilerek süreç tamamlanır.

### Sistem Mimarisi: Frontend ve Backend Ayrımı

Ağ üzerinde gerçekleşen bu iletişim döngüsünde, kodların icra edildiği fiziksel ve mantıksal konuma göre sistem iki temel katmana ayrılır:

![image.png](image2.png)

#### A. Frontend (Ön Yüz / İstemci Tarafı)

Frontend; kullanıcının doğrudan temas kurduğu, etkileşime girdiği ve tüm icra süreçlerinin kullanıcının yerel cihazındaki istemci (tarayıcı) üzerinde koştuğu katmandır.

- **İcra Ortamı:** Kullanıcının kendi cihazı (Web Tarayıcısı, Mobil Uygulama vb.).
- **Temel Teknolojiler:** HTML (İskelet/Yapı), CSS (Görsel Stil ve Düzen), JavaScript / React / Vue / Angular (Dinamik İstemci Davranışları).
- **Yaşam Döngüsündeki Rolü:**
    1. **Girdi Toplama:** Kullanıcıdan gelen girdileri (örneğin URL girişi, arama terimi veya form verileri) yakalar.
    2. **İstek Oluşturma:** Veriyi uygun ağ paketine dönüştürerek sunucuya bir HTTP/HTTPS isteği (Request) fırlatır.
    3. **Görselleştirme:** Sunucudan dönen ham veriyi alarak **Client Rendering** süreçleri aracılığıyla kullanıcıya anlamlı bir arayüz olarak sunar.
    4. **Asenkron Etkileşim:** Kullanıcı eylemlerine göre (örneğin *"Sepete Ekle"* veya *"Kayıt Ol"* butonları) arka plana asenkron (AJAX/Fetch API) istekler fırlatarak sayfayı yenilemeden veriyi günceller.

> **Özetle:** Frontend katmanı, sunucudan sağlanan veriyi kullanıcıya en yüksek kullanılabilirlik (UX), performans ve estetik standartlarında sunmaktan sorumludur.
> 

#### B. Backend (Arka Yüz / Sunucu Tarafı)

Backend; istemci tarafından doğrudan erişilemeyen, uzaktaki sunucular üzerinde çalışan, sistemin iş mantığını (business logic) yöneten ve veri güvenliğini sağlayan arka plan katmanıdır.

- **İcra Ortamı:** Uzak Web Sunucuları / Bulut Altyapıları (Cloud Infrastructure).
- **Temel Teknolojiler:** Python (Django/FastAPI), Node.js, Java, Go, C#, PHP + Veritabanı Sistemleri (PostgreSQL, MySQL, MongoDB vb.).
- **Yaşam Döngüsündeki Rolü (Sunucu İşleme Aşaması):**
    1. **Güvenlik ve Yetkilendirme (Authentication & Authorization):** İstemciden gelen isteği doğrular; *"Bu kullanıcı talep ettiği kaynağa erişim yetkisine sahip mi?"* kontrolünü gerçekleştirir.
    2. **İş Mantığı (Business Logic):** Uygulamanın temel kurallarını çalıştırır (örneğin ödeme hesaplaması, indirim kodu uygulaması veya veri doğrulama).
    3. **Veritabanı Yönetimi:** Kalıcı verileri okumak, güncellemek veya yeni kayıt eklemek amacıyla veritabanı katmanına sorgular (SQL/NoSQL) atar.
    4. **Yanıt Paketleme:** İşlenen veriyi istemcinin anlayacağı standart bir formatta (HTML belgesi veya JSON/XML) paketleyerek HTTP Yanıtı (Response) olarak geri iletir.

> **Özetle:** Backend katmanı; verinin doğruluğunu, güvenliğini, karmaşık algoritmaların çalıştırılmasını ve bilginin kalıcı olarak saklanmasını sağlayan ana merkezdir.
> 

### API (Application Programming Interface - Uygulama Programlama Arayüzü)

API, birbirinden bağımsız çalışan iki farklı yazılım bileşeninin birbiriyle haberleşmesini, veri alışverişinde bulunmasını ve işlevsellik paylaşmasını sağlayan **mimari bir köprü (veya elçi)** katmanıdır.

Son kullanıcı bir web sitesini veya mobil uygulamayı kullanırken arka planda çalışan karmaşık veri tabanı sorgularını ya da sunucu mantığını bilmek zorunda değildir. API; istemcinin talebini alır, sunucuya güvenli bir şekilde taşır, işlenen mantığın sonucunu yanıt olarak geri getirir.

#### Gerçek Hayat Kullanım Senaryoları

- **Hava Durumu Uygulamaları:** Akıllı telefonlardaki yerel hava durumu uygulamaları kendi bünyelerinde meteorolojik ölçüm donanımı barındırmaz. Arka planda küresel bir meteoroloji sunucusunun API’sine bağlanarak; *"Ankara lokasyonu için güncel hava durumu verilerini getir"* talebini iletir ve dönen veriyi arayüzde görselleştirir.
- **Uçak Bileti / Seyahat Platformları (Obilet, Bilet.com vb.):** Bu platformlar tüm havayolu şirketlerinin uçuş verilerini kendi veri tabanlarında tutmaz. Türk Hava Yolları, Pegasus gibi firmaların dışa açtığı API servislerine anlık istekler (request) atarak tüm uçuşları tek bir ekranda konsolide eder ve listeler.
- **Yapay Zekâ Entegrasyonları (Gemini / ChatGPT):** Kullanıcı sohbet arayüzüne bir komut (prompt) girip gönderdiğinde, istemci tarafı (web/mobil arayüz) yapay zekâ modelinin koştuğu uzak sunucudaki API uç noktasına (endpoint) bir istek atar ve modelin ürettiği yanıtı arayüze yansıtır.

### API Çeşitleri

API’ler kullanım amaçlarına, erişim sınırlarına ve temel mimari prensiplerine göre iki ana başlık altında incelenir:

#### 1. Erişim Yetkilerine Göre API Çeşitleri

Bir API uç noktasına kimlerin erişebileceği ve veri tüketebileceği güvenlik politikalarıyla belirlenir:

- **A. Açık (Public / Open) API:**
    - **Tanım:** Tüm geliştiricilerin ve dış sistemlerin erişimine açık olan API’lerdir. Şirketler veya sağlayıcılar, kendi ekosistemlerini büyütmek amacıyla bu servisleri kamuya açar.
    - **Örnek:** Açık hava durumu servisleri, Google Maps API, X (Twitter) API.
- **B. Özel (Private / Internal) API:**
    - **Tanım:** Yalnızca şirket veya kurumun kendi iç sistemlerinin haberleşmesi için tasarlanmış API’lerdir. Dış ağlara ve üçüncü taraf erişimlerine tamamen kapalıdır.
    - **Örnek:** Bir bankanın mobil uygulaması ile bankanın iç veri tabanı microservice’leri arasındaki iletişim.
- **C. Ortak (Partner) API:**
    - **Tanım:** Yalnızca stratejik iş ortaklığı bulunan şirketlerin ve sistemlerin kullanımına yetkilendirilmiş API’lerdir. Özel doğrulama (authentication) ve anahtar (API Key) mekanizmalarıyla korunur.
    - **Örnek:** Trendyol veya Hepsiburada gibi pazar yeri platformlarının, entegre mağazaların stok ve sipariş takibi yapabilmesi için o mağazalara sunduğu API servisleri.

#### 2. Mimari Yapılarına Göre API Çeşitleri

İstemci ile sunucu arasında verinin nasıl paketlendiğini, taşındığını ve hangi kurallara tabi olduğunu belirleyen mimari yaklaşımlardır:

- **A. REST API (Representational State Transfer):**
    - **Endüstri Standardı:** Web ve mobil uygulama geliştirme dünyasında en yaygın benimsenen mimari yaklaşımdır.
    - **Çalışma Prensibi:** Kaynaklara erişim ve işlem yapmak için standart HTTP metotlarını (`GET`, `POST`, `PUT`, `DELETE`) kullanır. Stateless (durumsuz) bir yapıya sahiptir.
    - **Veri Formatı:** Veri iletiminde neredeyse evrensel olarak hafif ve insan tarafından okunması kolay olan **JSON** formatını kullanır.
    - **Avantajı:** Yüksek esneklik, hızlı yanıt süreleri ve web tarayıcılarıyla yerel uyumluluk sağlar.
- **B. SOAP (Simple Object Access Protocol):**
    - **Kurumsal ve Katı Protokol:** REST’e kıyasla daha eski, katı kuralları ve standartları (WS-Security vb.) olan protokol bazlı bir mimaridir.
    - **Veri Formatı:** Veri taşımak için yalnızca **XML** formatını kullanır.
    - **Kullanım Alanı:** Yüksek güvenlik, işlem bütünlüğü (ACID) ve katı tip denetimi gerektiren Bankacılık, Finans, Sigortacılık ve Ödeme Sistemlerinde tercih edilir.
- **C. GraphQL:**
    - **Esnek ve İstemci Odaklı:** Meta (Facebook) tarafından REST API’nin aşırı veri çekme (over-fetching) veya eksik veri çekme (under-fetching) sorunlarını çözmek amacıyla geliştirilmiştir.
    - **Farkı:** REST API’de sunucunun tanımladığı sabit veri yapısı alınırken; GraphQL’de istemci tam olarak ihtiyacı olan alanları bildirir (*"Bana yalnızca kullanıcının `ad` ve `profil_resmi` bilgisini ver"*). Böylece gereksiz veri transferi (payload) engellenmiş olur.
- **D. WebSocket (Gerçek Zamanlı / Real-Time API):**
    - **Çift Yönlü ve Sürekli İletişim:** Geleneksel HTTP isteklerinde istemci sorar, sunucu yanıtlar ve bağlantı sonlanır. WebSocket protokolünde ise tek bir el sıkışma (handshake) sonrası istemci ile sunucu arasında tam çift yönlü (full-duplex) ve sürekli açık kalıcı bir kanal kurulur.
    - **Kullanım Alanı:** Canlı borsa verileri, çevrimiçi çok oyunculu (multiplayer) oyunlar, canlı konum takibi ve WhatsApp/Telegram gibi anlık mesajlaşma sistemleri.

### API Güvenliği (API Security) ve Temel Koruma Mekanizmaları

API’lerin mimari yapısını ve çeşitlerini inceledik. Ancak API uç noktaları (endpoints), sunucunun kapılarını dış dünyaya (ve dolayısıyla potansiyel saldırganlara) doğrudan açan yapılar olduğu için **API Güvenliği**, yazılım ve ağ mimarisinin en kritik halkalarından biridir.

Saldırganlar genellikle grafik arayüz (Frontend) kısıtlamalarını baypas ederek doğrudan arka planda çalışan API uç noktalarına hedeflenmiş istekler gönderir; bu yolla veri tabanına sızmayı, veri sızıntısı gerçekleştirmeyi veya servisleri çalışamaz hale getirmeyi (DDoS) amaçlarlar.

API güvenliği; istemci ile sunucu arasındaki veri trafiğinin **gizliliğini (confidentiality)**, **bütünlüğünü (integrity)** ve yetkisiz erişimlere karşı **erişilebilirliğini (availability)** güvence altına almayı hedefler.

#### A. Kimlik Doğrulama ve Yetkilendirme (Authentication & Authorization)

Gelen ağ isteğinin kimden geldiğini doğrulamak (Authentication) ve o kimliğin talep ettiği işlemi yapmaya izni olup olmadığını denetlemek (Authorization) ilk savunma hattıdır:

- **API Keys (API Anahtarları):** İstemciye tanımlanan özel ve gizli bir karakter dizisidir (string). İstemci, yaptığı her HTTP isteğinin başlığında (header) bu anahtarı sunar. Genellikle servis tüketimini takip etmek ve basit seviyede istemciyi tanımak için kullanılır.
- **OAuth 2.0 & JWT (JSON Web Token):** Modern web ve mobil uygulamaların endüstri standardı güvenlik mimarisidir.
    - **Çalışma Prensibi:** Kullanıcı kimlik bilgileriyle giriş yaptığında sunucu, kriptografik olarak imzalanmış bir **Token (Dijital Bilet)** üretip istemciye teslim eder.
    - İstemci, sonraki tüm API isteklerinde bu token'ı `Authorization: Bearer <token>` başlığıyla sunucuya iletir. Sunucu, veri tabanına her seferinde tekrar sorgu atmadan token üzerindeki imzayı doğrular: *"Bu istek güvenilirdir, kullanıcı Ahmet'tir ve yalnızca kendi profil verisini güncelleme yetkisine sahiptir."*

#### B. Temel API Güvenlik Önlemleri ve Tehdit Modelleri

API katmanında olası siber saldırıları ve kötüye kullanımları engellemek adına uygulanan başlıca savunma mekanizmaları şunlardır:

1. **Rate Limiting (İstek Hızı Sınırlama):**
    - **Tehdit:** Hizmet Dışı Bırakma (DoS/DDoS) saldırıları, otomatize bot taramaları veya Kaba Kuvvet (Brute Force) parola denemeleri.
    - **Çözüm:** Belirli bir IP adresinin veya kimliği doğrulanmış kullanıcının zaman dilimi başına yapabileceği azami istek sayısı sınırlandırılır. *(Örn: "Bir IP adresinden 1 dakikada en fazla 60 API isteği kabul edilir; sınır aşıldığında sunucu `429 Too Many Requests` HTTP durum kodu döner").*
2. **Input Validation (Girdi Doğrulama) & Sanitization (Temizleme):**
    - **Tehdit:** SQL Injection (SQLi), Cross-Site Scripting (XSS) veya Komut Çalıştırma (Command Injection) zafiyetleri.
    - **Çözüm:** İstemciden gelen tüm veriler (query parametreleri, request body vb.) iş mantığına veya veri tabanına iletilmeden önce katı bir tip ve format kontrolünden geçirilir. Zararlı olabilecek özel karakterler temizlenir veya kaçış (escape) karakterleriyle etkisiz hale getirilir.
3. **Transport Layer Security (TLS/HTTPS Şifreleme):**
    - **Tehdit:** Ağ trafiğinin dinlenmesi, verilerin ele geçirilmesi veya değiştirilmesi (Man-in-the-Middle - MitM saldırıları).
    - **Çözüm:** Tüm API iletişimi istisna olmaksızın `https://` protokolü (TLS 1.2/1.3) üzerinden şifrelenir. Araya giren bir saldırgan paketleri yakalasa dahi, veriler yüksek standartta şifrelendiği için içeriği okuyamaz ve değiştiremez.
4. **CORS (Cross-Origin Resource Sharing) Politikaları:**
    - **Tehdit:** Yetkisiz farklı web sitelerinin, kullanıcının tarayıcısı üzerinden hedef API'ye izinsiz istek fırlatması (CSRF riskleri).
    - **Çözüm:** Sunucu tarafında tanımlanan CORS başlıkları (`Access-Control-Allow-Origin`), API'ye hangi etki alanlarının (domain) istek atabileceğini kesin olarak sınırlandırır. *(Örn: `gallipoli.xyz` sunucusu, API uç noktalarına yalnızca kendi domain'inden gelen kök isteklerin yanıt almasına izin verir).*

### Veri Tabanı Sunucusu (Database Server)

API ve API Güvenliği katmanlarını geçtikten sonra, yazılım mimarisinin en arkasında konumlanan ve tüm sistemin "kalıcı hafızası" işlevini gören ana bileşene gelinir: **Veri Tabanı Sunucusu (Database Server)**.

Frontend kullanıcıdan gelen isteği alır, API bu isteği taşıyarak Backend katmanına iletir. Ancak kullanıcı kimlik bilgileri, gönderiler, parolar, sipariş geçmişi veya sistem günlükleri (loglar) kalıcı ve güvenli bir ortamda saklanmak zorundadır. İşte bu verilerin yapısını koruyarak depolandığı, yönetildiği ve sorgulandığı merkez Veri Tabanı Sunucusudur.

Veri tabanı süreçlerini ve kaynaklarını yöneten yazılım sistemlerine **VTYS (Veri Tabanı Yönetim Sistemi - DBMS)** adı verilir *(örneğin PostgreSQL, MySQL, MongoDB)*.

#### A. İstemci-Sunucu Döngüsündeki Rolü ve Mimarisi

Siber güvenlik gereksinimleri nedeniyle istemci (Frontend) doğrudan veri tabanı sunucusuna bağlanamaz. İstemcinin veri tabanıyla doğrudan iletişim kurması son derece kritik bir güvenlik zafiyetine (açık portlar, kimlik bilgisi sızıntıları vb.) yol açar. Bu nedenle iletişim her zaman **Backend katmanı üzerinden bir aracı mekanizmayla** gerçekleştirilir:

```
[ FRONTEND ] ────( HTTP / API )────► [ BACKEND ] ────( SQL Query )────► [ VERİ TABANI SUNUCUSU ]
                             (Python, Node.js, Java)                     (PostgreSQL, MySQL vb.)
```

1. **İstek Oluşturma:** Kullanıcı profil sayfasını açmak için bir eylem gerçekleştirir.
2. **Backend Sorgusu:** Backend uygulaması gelen isteği işler ve veri tabanı sunucusunun anlayacağı dilde bir sorgu çalıştırır:SQL
    
    ```
    SELECT * FROM kullanicilar WHERE id = 123;
    ```
    
3. **Veri Erişimi ve Yanıt:** Veri tabanı sunucusu ilgili veriyi diskten (SSD/NVMe) veya bellekten (RAM) okur ve sonuç kümesini Backend’e teslim eder.
4. **İçerik Sunumu:** Backend elde ettiği bu ham veriyi işler, API vasıtasıyla JSON/HTML formatında Frontend’e iletir ve kullanıcı arayüzünde görselleştirilir.

#### B. Temel Veri Tabanı Türleri

Verilerin mantıksal olarak tutulma ve modellenme biçimine göre veri tabanları iki ana kategoriye ayrılır:

1. **İlişkisel Veri Tabanları (Relational / SQL):**
    - **Çalışma Mantığı:** Veriler birbiriyle katı ilişkileri olan tablolar, satırlar (rows) ve sütunlar (columns) halinde saklanır. Veri yapısı önceden tanımlanmış katı bir şemaya (**Schema**) dayanır.
    - **Sorgu Dili:** Standart yapılandırılmış sorgu dili olan **SQL (Structured Query Language)** kullanılır.
    - **Kullanım Alanı:** Veri bütünlüğünün (**ACID** prensipleri), finansal kayıtların ve karmaşık veri ilişkilerinin kritik olduğu sistemlerde tercih edilir.
    - **Popüler Örnekler:** PostgreSQL, MySQL, MSSQL, Oracle.
2. **İlişkisel Olmayan Veri Tabanları (NoSQL / Non-Relational):**
    - **Çalışma Mantığı:** Veriler esnek yapılarda; anahtar-değer (**Key-Value**), doküman tabanlı (**JSON/BSON** formatında), kolon odaklı veya grafik (**Graph**) modelleriyle saklanır. Katı bir tablo şeması bulunmaz.
    - **Kullanım Alanı:** Büyük veri (**Big Data**) işleme senaryolarında, şeması sık değişen esnek veri yapılarında ve son derece yüksek okuma/yazma (I/O) hızına ihtiyaç duyulan anlık sistemlerde tercih edilir.
    - **Popüler Örnekler:** MongoDB, Redis (In-Memory / RAM bazlı), Cassandra, Firebase Realtime Database.

#### C. Veri Tabanı Güvenliği ve Performans Mekanizmaları

Veri tabanları, bir organizasyonun en kritik varlığı olan "işlenmiş veriyi" barındırdığı için hem mimari izolasyon hem de performans optimizasyonu katmanlarıyla korunmalıdır:

1. **İzolasyon ve Ağ Güvenliği (Isolation & Network Security):**
    - Veri tabanı sunucuları doğrudan dış dünyaya (kamusal internete) kapalı tutulur.
    - Ağ seviyesinde güvenlik duvarları (**Firewall / Security Groups**) yapılandırılarak yalnızca yetkili Backend sunucularının IP adreslerinden gelen bağlantılara izin verilir.
2. **Veri Şifreleme (Data Encryption):**
    - **At-Rest Encryption (Durağan Veri Şifrelemesi):** Veri tabanının saklandığı fiziksel diskin ve yedeklerin kriptografik olarak şifrelenmesi.
    - **In-Transit Encryption (Hareketteki Veri Şifrelemesi):** Backend ile Veri Tabanı arasındaki ağ trafiğinin TLS/SSL protokolü ile şifrelenmesi.
    - **Parola Hash'leme (Password Hashing):** Kullanıcı parolaları gibi kritik verilerin asla düz metin (**Plain Text**) olarak tutulmayıp; `bcrypt`, `Argon2` veya `PBKDF2` gibi tuzlanmış (salted) güçlü kriptografik algoritmalardan geçirilerek saklanması.
3. **Önbellekleme Katmanı (Caching - Redis / Memcached):**
    - Her API isteğinde veri tabanına gidip diski yormak (I/O darboğazı) yerine, sık erişilen ve az değişen veriler geçici olarak RAM bazlı önbellek sistemlerinde (**Redis**) saklanır. Bu sayede yanıt süreleri milisaniyelere çekilir ve ana veri tabanı üzerindeki yük hafifletilir.
4. **SQL Enjeksiyonu Koruması (SQL Injection Defense):**
    - Backend tarafında dinamik metin birleştirme yerine **Parameterized Queries (Hazırlanmış Sorgular / Prepared Statements)** veya **ORM (Object-Relational Mapping)** katmanları kullanılarak, saldırganların zararlı SQL komutlarını veri tabanına enjekte etmesi engellenir.

## 1. Web Sunucusu (Web Server)

Veri tabanı katmanından mimarinin önüne geçtiğimizde, tüm sistemin **kapı görevlisi** konumundaki Web Sunucusu ile karşılaşırız.

Web Sunucusu; istemcilerden gelen HTTP/HTTPS isteklerini dinleyen, statik dosyaları (HTML, CSS, JS, görseller) doğrudan yanıtlayan, dinamik istekleri ise (API ve arka plan iş mantığı) uygulama sunucularına veya veri tabanına ileten donanım ve yazılım altyapısıdır.

Modern mimarilerde yaygın olarak tercih edilen başlıca web sunucusu yazılımları **Nginx, Apache HTTP Server, Microsoft IIS ve LiteSpeed**'dir.

### A. İstemci-Sunucu Döngüsündeki Kritik Yeri

Web sunucusu, doğrudan dış dünyaya açık olan ve istemciyle birebir temas kuran ön katmandır:

```
[ İSTEMCİ ] ───( HTTPS İstek )───► [ WEB SUNUCUSU (Nginx) ]
                                             │
                       ┌─────────────────────┴─────────────────────┐
                       ▼                                           ▼
            [ Statik Dosyalar ]                          [ Uygulama Sunucusu ]
          (HTML, CSS, Görseller)                        (Python / Node.js API)
        [Doğrudan İstemciye Döner]                       [İşlenip Yanıt Döner]
```

- **Statik İçerik Sunumu:** Resimler, stiller (CSS) veya standart HTML sayfaları için uygulama katmanında (Node.js, Python vb.) kod çalıştırmaya gerek yoktur. Web sunucusu bu dosyaları doğrudan diskten veya önbellekten okuyarak milisaniyeler içinde istemciye sunar.
- **Dinamik İçerik Yönlendirmesi:** Kullanıcı veri tabanı etkileşimi gerektiren bir istek attığında (örneğin `/api/kullanici/12`), web sunucusu bu isteği karşılar ve işlenmek üzere arkadaki Uygulama Sunucusuna (Backend) iletir.

### B. Temel Görevler ve Yetenekler

1. **Ters Vekil Sunucu (Reverse Proxy):**
    
    Gelen istekleri karşılayıp arka plandaki servis türlerine göre dağıtır. Böylece dış dünya doğrudan veri tabanına veya ana kodun çalıştığı iç sunuculara erişemez, sistem izolasyonu sağlanır.
    
2. **Yük Dengeleme (Load Balancing):**
    
    Yoğun trafik anlarında gelen yükü arkadaki birden fazla uygulama sunucusuna dengeli şekilde dağıtarak tek bir noktanın kilitlenmesini engeller.
    
3. **SSL/TLS Şifre Çözme (SSL Termination):**
    
    HTTPS üzerinden şifreli gelen verinin şifresi ilk olarak web sunucusunda çözülür. Böylece iç ağdaki uygulama sunucuları şifre çözme yükünden kurtularak doğrudan iş mantığına odaklanır.
    
4. **Veri Sıkıştırma (Gzip / Brotli):**
    
    İstemciye gönderilecek yanıt metinlerini (HTML, CSS, JS) iletim öncesinde sıkıştırarak paket boyutunu düşürür ve bant genişliği kullanımını optimize eder.
    

### C. Web Sunucusu ve Uygulama Sunucusu (App Server) Farkı

| **Özellik** | **Web Sunucusu (Web Server)** | **Uygulama Sunucusu (App Server / Backend)** |
| --- | --- | --- |
| **Örnekler** | Nginx, Apache, LiteSpeed | Node.js, Python (Gunicorn/Uvicorn), Java (Tomcat) |
| **Temel Görevi** | HTTP trafiğini yönetmek, statik içerik sunmak, yük dağıtmak | İş mantığını (*Business Logic*) çalıştırmak, veri tabanıyla konuşmak |
| **Veri Tipi** | Statik (HTML, Görsel, CSS) | Dinamik (JSON, Veri tabanı yanıtları) |

## 2. Güvenlik ve Performans Mimarisi

Ağ, sunucu ve veri tabanı katmanlarını bir araya getiren sistemin kesintisiz, sürdürülebilir ve korunaklı kalması iki ana sütuna bağlıdır: **Güvenlik** ve **Performans**.

> Sistem ne kadar gelişmiş olursa olsun, yavaşsa kullanıcıyı; güvensizse veriyi ve güveni kaybeder. Bu iki unsur, sadece tek bir sunucuda değil, istemciden veri tabanına kadar uçtan uca (*End-to-End*) kurgulanmalıdır.
> 

### A. Bütüncül Güvenlik Mimarisi (*Defense in Depth / Derinlemesine Savunma*)

Güvenlik, tek bir güçlü kapı inşa etmek değil; saldırganın aşması gereken kademeli koruma katmanları kurgulamaktır:

```
[ İnternet ] ──► [ WAF ] ──► [ Web Sunucusu ] ──► [ API / Auth ] ──► [ Veri Tabanı ]
                  │                 │                  │                  │
           (DDoS / Bot)       (Rate Limit)       (JWT / BOLA)       (Firewall / Hash)
```

#### 1. Ağ ve Ağ Geçidi Güvenliği

- **WAF (Web Application Firewall):** Cloudflare veya AWS WAF gibi sistemler; trafik henüz sunuculara ulaşmadan kötü niyetli botları, SQL Injection ve XSS gibi bilinen uygulama seviyesi saldırıları en dış sınırda engeller.
- **DDoS Koruması:** Anormal trafik dalgalanmalarını ve hacimsel saldırıları emerek ana sunucuların hizmet dışı kalmasını (*downtime*) önler.

#### 2. Sunucu ve Sistem Güvenliği

- **En Az Yetki İlkesi (*Principle of Least Privilege*):** Servisler ve arka plan süreçleri işletim sisteminde asla yüksek yetkili (*root*) kullanıcı ile çalıştırılmaz. Her servis sadece ihtiyaç duyduğu kadar erişim yetkisine sahiptir.
- **Sistem Sıkılaştırma (*Hardening*):** Kullanılmayan tüm ağ portları kapatılır, varsayılan yapılandırmalar değiştirilir ve güvenlik yamaları sürekli güncel tutulur.

#### 3. Veri ve Kimlik Güvenliği

- **Veri Şifreleme:** İletim halindeki veri (*In-Transit*) TLS/HTTPS ile; diskte duran veri (*At-Rest*) ise güçlü kriptografik algoritmalarla şifrelenir.
- **Sıfır Güven (*Zero Trust*):** İç ağda çalışan servisler bile birbiriyle haberleşirken (örneğin Backend'in Veri Tabanına erişimi) kimlik doğrulaması yapmak zorundadır.

### B. Performans Optimizasyonu ve Ölçeklenebilirlik (*Scalability*)

İsteklerin milisaniyeler seviyesinde yanıtlanabilmesi için uygulanan temel mühendislik yaklaşımları şunlardır:

#### 1. Önbellekleme (*Caching*) Stratejileri

Veriyi her istekte yeniden hesaplamak veya diskten okumak yerine RAM seviyesinde tutma işlemidir:

- **CDN (Content Delivery Network):** Görsel, CSS ve JS gibi statik varlıkları kullanıcıya coğrafi olarak en yakın kenar sunucularda (*Edge Servers*) depolayarak gecikmeyi (*latency*) minimuma indirir.
- **Tarayıcı Önbelleği (*Browser Cache*):** HTTP başlıkları (`Cache-Control`) aracılığıyla istemciye veriyi kendi yerel depolamasında ne kadar süre saklayabileceği talimatı verilir.
- **Uygulama ve Veri Tabanı Önbelleği (Redis / Memcached):** Sık tekrarlanan sorgu sonuçları RAM üzerinde tutularak disk erişim ihtiyacı ve veri tabanı yükü azaltılır.

#### 2. Yük Dengeleme ve Ölçeklenme Yöntemleri

Trafik artışlarında sistem kapasitesini genişletmek için iki farklı yaklaşım kullanılır:

- **Dikey Ölçekleme (*Vertical Scaling / Scale Up*):** Mevcut sunucunun donanım kapasitesini (CPU, RAM) artırmaktır; ancak fiziksel sınırlar nedeniyle bir noktada doyuma ulaşır.
- **Yatay Ölçekleme (*Horizontal Scaling / Scale Out*):** Paralel çalışabilen yeni sunucu örnekleri ekleyerek yapıyı büyütmektir. Yük dengeleyici gelen trafiği bu sunucular arasında eşit böler.

#### 3. Veri Boyutu ve Kod Optimizasyonu

- **Varlık Küçültme ve Sıkıştırma (*Minification & Compression*):** Kod dosyalarındaki gereksiz boşluk ve yorum satırları temizlenir (*Minify*), ardından transfer esnasında Gzip veya Brotli ile sıkıştırılır.
- **Tembel Yükleme (*Lazy Loading*):** Sayfadaki medya içerikleri yalnızca kullanıcının ekranına yaklaştığı anda (ihtiyaç duyuldukça) indirilir.
- **Veri Tabanı İndeksleme (*Database Indexing*):** Sık sorgulanan sütunlara indeks tanımlanarak veri arama karmaşıklığı düşürülür ve milyonlarca kayıt arasından arama süreleri optimize edilir.

## 3. Bulut Mimarisi (*Cloud Architecture*)

Tüm bu web sunucuları, uygulama servisleri, güvenlik katmanları ve veri tabanlarının üzerinde çalıştığı fiziksel/mantıksal çatı **Bulut Mimarisi**'dir.

Geleneksel yapılarda şirketler kendi bünyelerinde fiziksel sunucu odaları (*On-Premise*) kurup bunların iklimlendirme, yedek güç ve donanım bakımını üstlenmek zorundaydı. Günümüzde ise modern web sistemleri; **AWS, Google Cloud ve Microsoft Azure** gibi bulut sağlayıcılarının küresel veri merkezlerindeki sanallaştırılmış, esnek ve ihtiyaca göre ölçeklenebilen altyapılar üzerinde barındırılmaktadır.

**Bulut Mimarisi**; bilgi işlem (CPU), depolama (Disk), veri tabanı ve ağ kaynaklarının internet üzerinden **ihtiyaç anında (On-Demand)** temin edilmesi ve **kullandıkça öde (Pay-as-you-go)** finansal modeliyle sunulmasını sağlayan sistemler bütünüdür.

#### A. Bulut Hizmet Modelleri (Cloud Service Models)

Bulut bilişim, geliştiriciye veya kuruma sağlanan kontrol seviyesine ve yönetim sorumluluğuna göre 3 ana kategoride ele alınır:

```
[ IaaS ] ──► Altyapı Sorumluluğu Sende (Sanal Sunucu, İşletim Sistemi, Ağ Config)
[ PaaS ] ──► Sadece Uygulama Kodunu Yönetirsin (Sunucu & Altyapı Yönetimi Bulut Sağlayıcıda)
[ SaaS ] ──► Hazır Yazılımı Doğrudan Kullanırsın (Son Kullanıcı Odaklı Uygulamalar)
```

- **IaaS (Infrastructure as a Service - Altyapı Hizmeti):** Bulut sağlayıcısının size tamamen özelleştirilebilir boş bir sanal sunucu (VM) tahsis ettiği modeldir. İşletim sistemini kurmak, Nginx/Apache gibi web sunucu yapılandırmalarını gerçekleştirmek, ağ ayarlarını yapmak ve sistem güvenliğini sağlamak tamamen sizin sorumluluğunuzdadır.
    - **Popüler Örnekler:** AWS EC2, DigitalOcean Droplets, Google Compute Engine.
- **PaaS (Platform as a Service - Platform Hizmeti):** Sunucu kurulumu, işletim sistemi güncellemeleri, güvenlik yamaları veya Nginx/web sunucu ayarlarıyla vakit kaybetmenizi engelleyen yapıdır. Sadece geliştirdiğiniz Frontend veya Backend kodunu sisteme yüklersiniz; platform, uygulamanın derlenip canlıya alınmasını ve çalıştırılmasını otomatik üstlenir.
    - **Popüler Örnekler:** Netlify, Vercel, AWS Elastic Beanstalk, Heroku.
- **SaaS (Software as a Service - Yazılım Hizmeti):** Son kullanıcıların herhangi bir kurulum, kodlama veya altyapı yönetimine ihtiyaç duymadan doğrudan web veya mobil tarayıcılar üzerinden erişip kullandığı tam teşekküllü bulut uygulamalarıdır.
    - **Popüler Örnekler:** Google Docs, Google Drive, Microsoft 365, Canva.

#### B. Bulut Dağıtım Modelleri (Deployment Models)

- **Public Cloud (Genel Bulut):** Bilişim kaynaklarının AWS, Google Cloud veya Microsoft Azure gibi küresel sağlayıcılar üzerinden, diğer şirketlerle paylaşımlı (multi-tenant) fakat birbirinden mantıksal olarak izole edilmiş sanal altyapılarda sunulmasıdır.
- **Private Cloud (Özel Bulut):** Tüm bulut altyapısının yalnızca tek bir kuruma/şirkete özel olarak tahsis edildiği modeldir. Özellikle sıkı güvenlik gereksinimleri, regülasyonlar ve finans/bankacılık gibi hassas sektörler için tercih edilir.
- **Hybrid Cloud (Melez Bulut):** Public ve Private yapılarının birleşimidir. Hassas ve kritik verilerin şirket içi özel sunucularda (On-Premise / Private Cloud) saklandığı; ölçeklenme ihtiyacı duyan dinamik web arayüzlerinin ise Public Cloud üzerinde çalıştırıldığı esnek mimaridir.

#### C. Modern Bulut Teknolojileri: Serverless & Konteynerleşme

Modern bulut mimarilerini biçimlendiren ve yazılım geliştirme süreçlerini hızlandıran en güncel iki yaklaşım şunlardır:

1. **Konteynerleşme (Docker & Kubernetes):** Uygulamanın sorunsuz çalışması için gerekli olan tüm kodlar, kütüphaneler ve bağımlılıklar tek bir paket haline getirilerek **Docker Konteyneri** oluşturulur. Bu sayede yazılım dünyasındaki meşhur *"Benim bilgisayarımda çalışıyordu, sunucuda çalışmadı"* problemi tamamen ortadan kalkar. **Kubernetes** ise canlı ortamda çalışan binlerce konteynerin ölçeklenmesini, sağlık kontrolünü ve yönetimini otomatik olarak gerçekleştirir (Orkestrasyon).
2. **Sunucusuz Mimari (Serverless / FaaS - Function as a Service):** Fiziksel veya sanal bir sunucu kiralayıp kullanılmasa bile 7/24 sabit ücret ödeme mantığını yıkan yapıdır. Kod, yalnızca bir tetikleyici (HTTP isteği, veritabanı olayı vb.) geldiğinde çalışır ve işini tamamlayınca kapanır. Faturalandırma sadece kodun aktif çalıştığı milisaniyeler üzerinden hesaplanır.
    - **Popüler Örnekler:** AWS Lambda, Google Cloud Functions.

#### D. Bulut Mimarisinin Sağladığı Temel Avantajlar

- **Esneklik ve Otomatik Ölçeklenme (Auto-Scaling):** Sistem trafiğe göre dinamik tepki verir. Örneğin; gece saatlerinde platformda 100 kullanıcı varken tek bir sunucu yeterliyken, gündüz düzenlenen bir kampanya ile anlık 100.000 kullanıcı geldiğinde bulut mimarisi arkaplanda otomatik olarak yeni sunucular devreye sokar. Trafik normale döndüğünde ise fazla sunucuları kapatarak maliyeti düşürür.
- **Maliyet Tasarrufu (Cost Optimization):** Ön yatırım gerektiren donanım maliyetlerini (CapEx) ortadan kaldırır; aktif kullanılmayan veya boşta duran donanımlar için sabit bir ücret ödenmesini engeller.
- **Yüksek Erişilebilirlik ve Kesintisizlik (High Availability):** Fiziksel bir veri merkezinde elektrik veya ağ kesintisi yaşansa dahi, bulut sağlayıcısı gelen trafiği anında farklı bir coğrafi bölgedeki (Region/Availability Zone) yedek veri merkezine otomatik olarak yönlendirir (**Failover**). Böylece servis kesintisi yaşanmaz.

End…Umarım faydalı olmuştur.
