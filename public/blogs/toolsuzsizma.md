# Her Zaman Tool Kullanmak Zorunda Değilsin: Araçsız Sızma Testi Mantığı

![Araçsız Sızma Testi — Siber güvenlik ve terminal analizi](/blogs/img/toolsuzsizma/kapak.png)

> **Bir güvenlik açığını keşfetmek için her zaman gelişmiş bir araç kullanman gerekmez.** Bazen en önemli bulgu; sistemin nasıl tasarlandığını anlamak, uygulamanın iş mantığını sorgulamak ve insan davranışlarını doğru analiz etmektir.

Sızma testlerinde otomatik araçlar keşif ve analiz süreçlerini hızlandırır. Ancak bir aracın sunduğu çıktıları yorumlamakla bir sistemin neden savunmasız olduğunu anlamak aynı şey değildir.

Sosyal mühendislik, yetkilendirme hataları, yanlış yapılandırmalar ve iş mantığı zafiyetleri; çoğu zaman yalnızca teknik araçlara değil, araştırmacının düşünme biçimine de bağlıdır.

Bu yazıda, **araçsız sızma testi yaklaşımını (tool-less penetration testing)** ve temel sistem araçlarından yararlanarak güvenlik açıklarının nasıl analiz edilebileceğini inceleyeceğiz.

---

## İçindekiler

- [1. Sosyal Mühendislik ve OSINT](#1-sosyal-mühendislik-ve-osint)
- [2. Web Uygulamalarında Mantık Hataları](#2-web-uygulamalarında-mantık-hataları)
  - [SQL Injection (SQLi)](#sql-injection-sqli)
  - [IDOR ve BOLA](#idor-ve-bola)
  - [Cross-Site Scripting (XSS)](#cross-site-scripting-xss)
- [3. Yapılandırma Hataları ve Unutulan Kapılar](#3-yapılandırma-hataları-ve-unutulan-kapılar)
- [4. Temel Sistem Araçları: curl ve netcat](#4-temel-sistem-araçları-curl-ve-netcat)
- [5. Zafiyet Zincirleme (Attack Chain)](#5-zafiyet-zincirleme-attack-chain)
- [6. Savunma Perspektifi](#6-savunma-perspektifi)
- [Sonuç](#sonuç)

---

## 1. Sosyal Mühendislik ve OSINT

![OSINT ve dijital ayak izi analizi](/blogs/img/toolsuzsizma/osint-network.jpg)

*Şekil 1 — Açık kaynaklardan elde edilen bilgilerin ilişkilendirilmesi ve dijital ayak izi analizi.*

**OSINT (Open Source Intelligence)**, açık kaynaklarda bulunan bilgilerin sistematik biçimde toplanması ve analiz edilmesidir.

Bir hedef hakkında bilgi edinmek için her zaman özel bir keşif aracı kullanmak gerekmez. Arama motorları, herkese açık belgeler, şirket web siteleri ve kod depoları bile önemli ipuçları sağlayabilir.

### Örnek: Açık kaynak araştırması

Yetkili bir güvenlik değerlendirmesi kapsamında, bir şirketin herkese açık dijital ayak izini incelediğimizi düşünelim.

```text
site:linkedin.com "AcmeCorp" "IT Manager"
site:github.com "acmecorp"
filetype:pdf "AcmeCorp"
```

Bu sorguların kullanım amaçları:

- **LinkedIn:** Şirketin organizasyon yapısı ve kamuya açık mesleki roller hakkında bilgi edinmek.
- **GitHub:** Herkese açık depolarda yanlışlıkla paylaşılmış yapılandırma dosyalarını veya hassas bilgi izlerini araştırmak.
- **PDF belgeleri:** Belgelerdeki metadata alanlarını ve kamuya açık teknik dokümantasyonu incelemek.

> **Önemli:** Bir dosyanın arama sonuçlarında bulunması, tek başına güvenlik açığı olduğu anlamına gelmez. Bulgular doğrulanmalı ve yalnızca yetkili kapsamda değerlendirilmelidir.

OSINT sürecinin asıl değeri, çok sayıda bilgi toplamak değil, bu bilgiler arasındaki anlamlı ilişkileri ortaya çıkarmaktır.

---

## 2. Web Uygulamalarında Mantık Hataları

![Web uygulamalarında güvenlik açıkları](/blogs/img/toolsuzsizma/web-vulnerabilities.png)

*Şekil 2 — SQL Injection, IDOR ve XSS gibi web uygulaması güvenlik açıklarının genel görünümü.*

Web uygulamalarında her girdi alanı, URL parametresi ve HTTP isteği bir güven sınırını temsil edebilir.

Bir uygulamayı analiz ederken şu sorular sorulmalıdır:

- Kullanıcı girdileri sunucu tarafında nasıl işleniyor?
- Yetkilendirme kontrolleri gerçekten uygulanıyor mu?
- İstemciden gelen verilere gereğinden fazla güveniliyor mu?
- Uygulamanın hata mesajları hassas bilgi açığa çıkarıyor mu?
- Farklı kullanıcıların verileri birbirinden doğru şekilde ayrılıyor mu?

Bu sorular, otomatik tarayıcıların tek başına açıklayamayabileceği mantık hatalarını anlamaya yardımcı olur.

### SQL Injection (SQLi)

SQL Injection, kullanıcı girdisinin SQL sorgusunun yapısını değiştirebilecek şekilde işlenmesiyle ortaya çıkan bir güvenlik açığıdır.

Güvensiz biçimde oluşturulan bir sorgu şu yapıda olabilir:

```sql
-- Güvensiz sorgu oluşturma örneği
SELECT *
FROM users
WHERE username = '<user_input>'
  AND password = '<password_input>';
```

Buradaki sorun, kullanıcı girdisinin SQL sorgusuna doğrudan metin olarak eklenmesidir.

Girdi, sorgunun veri bölümü yerine SQL sözdiziminin bir parçası hâline gelebilirse uygulamanın mantığı değişebilir. Bunun sonucunda yetkisiz veri erişimi veya kimlik doğrulama mekanizmasının atlanması gibi etkiler ortaya çıkabilir.

#### Güvenli yaklaşım: Parametreli sorgular

Python ve SQLite ile hazırlanmış güvenli bir örnek:

```python
import sqlite3

connection = sqlite3.connect("app.db")
cursor = connection.cursor()

username = input("Kullanıcı adı: ")
password = input("Parola: ")

cursor.execute(
    """
    SELECT id, username
    FROM users
    WHERE username = ?
      AND password_hash = ?
    """,
    (username, password),
)

user = cursor.fetchone()
```

Bu örnek, SQL sorgusunun yapısını kullanıcı girdisinden ayırmak için parametreli sorgu kullanır.

**Not:** Gerçek bir uygulamada parola doğrulaması, parolanın uygun bir parola hash algoritmasıyla saklanan özeti üzerinden yapılmalıdır. Üretim ortamında bu işlem güvenli bir kimlik doğrulama kütüphanesiyle gerçekleştirilmelidir.

### IDOR ve BOLA

**IDOR (Insecure Direct Object Reference)**, bir uygulamanın nesnelere doğrudan referans vermesi ve erişim kontrolünü doğru uygulamamasıyla ilişkili bir zafiyet örüntüsüdür.

**BOLA (Broken Object Level Authorization)** ise API güvenliğinde, kullanıcının belirli bir nesneye erişme yetkisinin doğru kontrol edilmemesini ifade eder.

Örneğin, bir uygulama faturaları aşağıdaki URL yapısıyla sunuyor olsun:

```http
GET /api/invoices/1042 HTTP/1.1
Host: example.com
Authorization: Bearer <ACCESS_TOKEN>
```

Buradaki `1042` değeri, talep edilen faturanın kimliğini temsil eder.

Yetkili bir test sırasında farklı bir nesne kimliği kullanıldığında uygulamanın başka bir kullanıcıya ait faturayı döndürdüğü görülürse, nesne düzeyinde yetkilendirme kontrolü incelenmelidir.

#### Temel sorun nedir?

Sunucunun yalnızca kullanıcının oturum açmış olmasına güvenmesi yeterli değildir.

Her istekte şu koşullar değerlendirilmelidir:

1. Kullanıcının kimliği doğrulanmış mı?
2. Kullanıcı, istenen nesneye erişme yetkisine sahip mi?
3. Nesnenin ait olduğu hesap veya tenant doğru mu?
4. İstek, başka bir kullanıcının verilerine erişim sağlamadan sonuçlandırılıyor mu?

#### Güvenli uygulama yaklaşımı

```python
def get_invoice(current_user, invoice_id, repository):
    invoice = repository.find_by_id(invoice_id)

    if invoice is None:
        return None

    if invoice.owner_id != current_user.id:
        raise PermissionError(
            "Bu faturaya erişim yetkiniz yok."
        )

    return invoice
```

Bu örnek, faturanın sahibinin kimliği ile isteği yapan kullanıcının kimliğini karşılaştırır.

Gerçek uygulamalarda erişim kontrolü; rol, tenant, paylaşım izinleri ve diğer iş kurallarını da kapsayabilir. Yetkilendirme, yalnızca istemci tarafında değil, sunucuda uygulanmalıdır.

### Cross-Site Scripting (XSS)

Cross-Site Scripting (XSS), güvenilmeyen verilerin bir web sayfasında uygun bağlamsal korumalar olmadan işlenmesi sonucunda saldırgan tarafından kontrol edilen JavaScript kodunun başka bir kullanıcının tarayıcısında çalışmasına yol açabilen bir zafiyettir.

Örneğin, test ortamında kullanılabilecek bir XSS kontrol girdisi:

```html
<script>alert("XSS test")</script>
```

Bu girdinin sayfada çalışması, uygulamanın girdi işleme ve çıktı üretme süreçlerinin incelenmesini gerektirir. Test yalnızca izin verilen bir ortamda yapılmalıdır.

#### XSS neden oluşur?

- Kullanıcı girdisinin HTML içine doğrudan eklenmesi.
- HTML, JavaScript veya URL bağlamına uygun çıktı kodlamasının yapılmaması.
- Güvenilmeyen içeriğin tehlikeli DOM işlemleriyle işlenmesi.
- Uygun olmayan HTML temizleme yöntemlerinin kullanılması.

#### Çerezler her zaman çalınabilir mi?

Hayır. Bir XSS açığının etkisi, uygulamanın yapılandırmasına ve tarayıcı korumalarına bağlıdır.

- `HttpOnly`, çerezlere JavaScript üzerinden erişimi engeller.
- `Secure`, çerezlerin HTTPS üzerinden gönderilmesini sınırlar.
- `SameSite`, çerezlerin siteler arası isteklerde gönderilme davranışını sınırlar.
- **Content Security Policy (CSP)**, belirli kod çalıştırma senaryolarını kısıtlamaya yardımcı olabilir.

Bu mekanizmalar XSS riskini azaltabilir; ancak tek başlarına bütün XSS türlerini ortadan kaldırmaz.

En önemli savunma yaklaşımı, güvenilmeyen verileri kullanıldıkları bağlama uygun biçimde kodlamak ve tehlikeli DOM işlemlerinden kaçınmaktır.

---

## 3. Yapılandırma Hataları ve Unutulan Kapılar

![Siber güvenlik ve sistem yapılandırması](/blogs/img/toolsuzsizma/configuration-security.png)

*Şekil 3 — Sistem yapılandırması, erişim kontrolleri ve güvenlik önlemleri.*

Her güvenlik açığı karmaşık bir yazılım hatasından kaynaklanmaz. Yanlış yapılandırılmış servisler, gereksiz açık yönetim panelleri ve depolarda bırakılan gizli bilgiler de ciddi riskler oluşturabilir.

### Varsayılan kimlik bilgileri

Bazı cihazlar ve yazılımlar kurulum sırasında varsayılan hesaplarla gelir. Bu hesapların parolaları değiştirilmediğinde yetkisiz erişim riski oluşabilir.

Örnek zayıf kimlik bilgisi kombinasyonları:

```text
admin : admin
admin : password
root  : root
```

Bunlar yapılandırma denetimlerinde karşılaşılabilecek zayıf parola örnekleridir.

Yetkili bir değerlendirmede şu kontroller yapılabilir:

- Varsayılan hesaplar devre dışı bırakılmış mı?
- İlk kurulum sırasında parola değişikliği zorunlu tutuluyor mu?
- Yönetim arayüzleri internetten erişilebilir durumda mı?
- Başarısız giriş denemeleri sınırlandırılıyor mu?
- Çok faktörlü kimlik doğrulama uygulanıyor mu?

Shodan gibi internet üzerindeki servisleri indeksleyen platformlar, dışarıdan erişilebilen sistemler hakkında bilgi sağlayabilir. Ancak bir servisin indekslenmiş olması, tek başına savunmasız olduğu anlamına gelmez.

### Hassas dosya sızıntıları: Config Leak

Geliştiricilerin yapılandırma dosyalarını yanlışlıkla herkese açık kod depolarına yüklemesi, kimlik bilgileri ve API anahtarlarının ifşa olmasına neden olabilir.

Örnek bir `.env` dosyası:

```dotenv
# Örnek yapılandırma — gerçek kimlik bilgisi içermez
DB_HOST=database.internal
DB_USER=app_user
DB_PASSWORD=<REDACTED>
AWS_ACCESS_KEY_ID=<REDACTED>
AWS_SECRET_ACCESS_KEY=<REDACTED>
```

Bu dosyanın yanlışlıkla paylaşılması şu riskleri doğurabilir:

- Veritabanına yetkisiz erişim.
- Bulut kaynaklarının kötüye kullanılması.
- Uygulama servislerinin taklit edilmesi.
- Diğer sistemlerde yeniden kullanılan kimlik bilgilerinin ele geçirilmesi.

#### Korunma yöntemleri

1. Gizli bilgileri kaynak kodundan ayrı tut.
2. `.env` gibi yerel yapılandırma dosyalarını `.gitignore` içerisine ekle.
3. Git depolarında gizli bilgi taraması kullan.
4. Anahtarları mümkün olduğunda secret manager sistemlerinde sakla.
5. İfşa edilen anahtarları iptal et veya yenile.
6. En az ayrıcalık ilkesini uygula.

Örnek `.gitignore`:

```gitignore
.env
.env.*
!.env.example

secrets/
*.pem
```

`!.env.example` kuralı, örnek yapılandırma dosyasının depoda tutulmasına izin verir. Bu dosyada gerçek parola veya anahtar bulunmamalıdır.

> **Kritik nokta:** Bir gizli bilginin Git geçmişinden silinmesi, daha önce kopyalanmış olabileceği gerçeğini değiştirmez. İfşa edilen anahtarların yenilenmesi gerekir.

---

## 4. Temel Sistem Araçları: curl ve netcat

`curl` ve `netcat`, ağ iletişimini incelemek için kullanılabilen temel araçlardır. Özellikle HTTP isteklerini anlamak, servis bağlantılarını doğrulamak ve sorunları izole etmek için faydalıdırlar.

Buradaki amaç, bir aracı saldırı amacıyla kullanmaktan ziyade protokolün nasıl çalıştığını anlamaktır.

### curl ile HTTP iletişimi

`curl`, HTTP isteklerini komut satırından göndermeye ve sunucu yanıtlarını incelemeye olanak tanır.

Örneğin, bir uç noktaya GET isteği göndermek:

```bash
curl -i https://example.com/
```

`-i` parametresi, yanıt gövdesiyle birlikte HTTP başlıklarını da gösterir.

JSON içeren bir POST isteği göndermek için:

```bash
curl -i \
  -X POST \
  https://example.com/api/test \
  -H "Content-Type: application/json" \
  -d '{"message":"security test"}'
```

Bu yöntemle şu bilgiler incelenebilir:

- HTTP durum kodu.
- Yanıt başlıkları.
- İçerik türü.
- Yönlendirme davranışı.
- Uygulamanın hata mesajları.

### HTTP başlıklarını analiz etmek

Bazı uygulamalar istemci tarafından gönderilen başlıkları yanlış biçimde güvenilir kabul edebilir.

Örneğin `X-Forwarded-For`, ters proxy altyapılarında istemcinin IP adresini iletmek için kullanılan bir başlıktır.

```http
X-Forwarded-For: 192.0.2.10
```

Ancak bu başlık tek başına güvenilir bir kimlik doğrulama mekanizması değildir. İstemciler kendi HTTP başlıklarını gönderebilir veya değiştirebilir.

Bir uygulama yalnızca bu başlığa bakarak kullanıcının yönetici olduğunu ya da isteğin iç ağdan geldiğini kabul ediyorsa önemli bir güven sınırı hatası söz konusu olabilir.

#### Güvenli yapılandırma

- Proxy başlıklarını yalnızca güvenilen proxy katmanlarından kabul et.
- İstemciden gelen başlıkları doğrudan kimlik doğrulama amacıyla kullanma.
- Erişim kontrolünü sunucu tarafında uygula.
- Yönetim panellerini ağ düzeyinde de sınırlandır.
- İstemci tarafından kontrol edilebilen verilere dayalı güven kararlarından kaçın.

### Netcat ile bağlantı kontrolü

`nc` veya `netcat`, TCP ve bazı uygulamalarda UDP bağlantılarını test etmek için kullanılabilir.

Yetkili bir laboratuvar ortamında yerel bir servisin TCP portunu kontrol etmek için:

```bash
nc -vz 127.0.0.1 8080
```

Bu komut, yerel makinedeki `8080` portuna bağlantı kurulup kurulamadığını kontrol eder.

Bir portun açık olması, servis üzerinde güvenlik açığı bulunduğunu kanıtlamaz. Servisin amacı, yapılandırması ve erişim politikaları ayrıca değerlendirilmelidir.

---

## 5. Zafiyet Zincirleme (Attack Chain)

![Siber güvenlik saldırı zinciri ve risk ilişkileri](/blogs/img/toolsuzsizma/attack-chain.png)

*Şekil 4 — Farklı güvenlik bulgularının bir araya gelerek daha yüksek etkili bir risk oluşturması.*

Gerçek dünyadaki güvenlik olayları çoğu zaman tek bir zafiyetten değil, birden fazla zayıflığın birleşmesinden kaynaklanır.

Bu durum **zafiyet zincirleme** veya *attack chain* yaklaşımıyla açıklanabilir.

Örneğin, yetkili bir güvenlik değerlendirmesinde şu bulguların bir arada bulunduğunu varsayalım:

1. **Keşif (OSINT):** Kurumun kamuya açık teknik altyapısı hakkında bilgi edinilir.
2. **Bilgi sızıntısı:** Bir depoda hassas yapılandırma bilgileri bulunduğu tespit edilir.
3. **Kimlik bilgisi riski:** Bir anahtarın veya parolanın başka sistemlerde de kullanıldığı belirlenir.
4. **Erişim kontrolü hatası:** Bir HTTP başlığının güvenlik kararı üzerinde gereğinden fazla etkili olduğu görülür.
5. **Nesne düzeyinde yetkilendirme hatası:** Kullanıcıların kendilerine ait olmayan kayıtlara erişebildiği doğrulanır.

Bu bulguların her biri ayrı ayrı incelenebilir. Ancak bir araya geldiklerinde daha yüksek etkili bir risk oluşturabilirler.

### Saldırı zincirinin kavramsal gösterimi

```text
[OSINT]
   |
   v
[Bilgi Sızıntısı]
   |
   v
[Kimlik Bilgisi Riski]
   |
   v
[Hatalı Güven Sınırı]
   |
   v
[Yetkilendirme Hatası]
   |
   v
[Veri Gizliliğinin İhlali]
```

Bu şema, her ortamda aynı sırayla gerçekleşen bir saldırıyı değil, güvenlik bulgularının birbirini nasıl etkileyebileceğini gösteren kavramsal bir örneği temsil eder.

### Risk neden artabilir?

Bir sistemde birden fazla zayıflık bulunduğunda toplam risk, her bulgunun tek başına değerlendirilmesinden daha yüksek olabilir.

Örneğin:

- Açığa çıkan bir anahtar, sınırlı izinlere sahipse etkisi düşük olabilir.
- Aynı anahtar yönetici yetkilerine sahipse etki ciddi biçimde artabilir.
- Yönetici erişiminin yanında nesne düzeyinde yetkilendirme kontrolleri de hatalıysa veri gizliliği ve bütünlüğü daha büyük risk altına girebilir.

Bu nedenle güvenlik değerlendirmelerinde yalnızca zafiyet sayısı değil, bulgular arasındaki ilişkiler de dikkate alınmalıdır.

---

## 6. Savunma Perspektifi

Araçsız analiz yaklaşımının amacı, araçları tamamen bırakmak değildir. Amaç, otomasyonun ötesine geçerek sistemin güven sınırlarını ve iş mantığını anlayabilmektir.

Bir güvenlik bulgusunu değerlendirirken aşağıdaki kontrol listesinden yararlanılabilir:

- [ ] Kullanıcı girdileri güvenli biçimde işleniyor mu?
- [ ] SQL sorgularında parametreli sorgular kullanılıyor mu?
- [ ] Her hassas nesne için sunucu tarafında yetkilendirme kontrolü yapılıyor mu?
- [ ] Çıktılar bağlama uygun biçimde kodlanıyor mu?
- [ ] Gizli bilgiler kaynak kodundan ayrı tutuluyor mu?
- [ ] Varsayılan hesaplar ve gereksiz servisler denetleniyor mu?
- [ ] Proxy başlıkları yalnızca güvenilir altyapıdan mı kabul ediliyor?
- [ ] Yönetim arayüzleri uygun erişim kontrolleriyle korunuyor mu?
- [ ] Bulguların olası etkileri ve birbirleriyle ilişkileri analiz ediliyor mu?

Bu kontrollerin amacı, yalnızca zafiyetleri tespit etmek değil, aynı zafiyetlerin tekrar oluşmasını önleyecek tasarım ve yapılandırma iyileştirmelerini belirlemektir.

---

## Sonuç

Sızma testi, yalnızca araç çalıştırmak ve tarama sonuçlarını raporlamak değildir. Güvenlik araştırmacısının asıl değeri; bir sistemin nasıl çalıştığını anlaması, varsayımları sorgulaması ve farklı bulgular arasındaki bağlantıları ortaya çıkarmasıdır.

Otomatik araçlar keşif ve doğrulama süreçlerini hızlandırır. Ancak iş mantığı hatalarını, yanlış güven varsayımlarını ve yetkilendirme eksikliklerini anlamak için teknik analiz ve eleştirel düşünme hâlâ önemlidir.

**Unutma: Araçlar sana bulguları gösterebilir; bu bulguların neden ortaya çıktığını ve ne anlama geldiğini anlamak ise senin işindir.**

> **Etik not:** Bu yazıdaki örnekler eğitim ve yetkili güvenlik testleri içindir. Gerçek sistemlerde test yapmadan önce açık izin alınmalı, test kapsamına uyulmalı ve kullanıcı verilerinin gizliliği korunmalıdır.
