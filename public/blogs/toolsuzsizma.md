
# Her Zaman Tool Kullanmak Zorunda Değilsin

Bir pentest aracı açmadan önce şunu düşün: güvenlik açığı kodda değil, insanın zihnindedir.

2011'de Kevin Mitnick — dünyanın en ünlü hackerı — yıllarca sadece telefon ve dil kullanarak FBI’ı, telekom şirketlerini, savunma firmalarını sızdı. Tek bir exploit çalıştırmadan.

Buna Social Engineering denir. Ve hâlâ en etkili vektördür.

Nasıl çalışır?

Senaryo: Bir şirkete sızmak istiyorsun.

Önce OSINT — açık kaynak istihbarat. Araç lazım mı? Hayır. Sadece Google:

```text
site:linkedin.com "AcmeCorp" "IT Manager"
site:github.com "acmecorp" password
filetype:pdf "acmecorp" "internal"

```

LinkedIn’den çalışan isimlerini çekiyorsun. GitHub’da yanlışlıkla commit’lenmiş .env dosyası arıyorsun. Şirketin PDF raporlarında metadata’dan yazılım sürümlerini okuyorsun.

Henüz tek bir araç kullanmadın.

## Sosyal Mühendislik Anatomisi

`[Hedef Araştırma]` -> `[Senaryo Kur]` -> `[Güven İnşa Et]` -> `[Bilgi Al / Erişim Kazan]`

Klasik senaryo:

> "Merhaba, IT’den Murat arıyor. Sisteminizde anormal trafik gördük, sizi korumak için şifrenizi doğrulamamız gerekiyor."

Kurban %60 ihtimalle verir. Çünkü aciliyet ve otorite birleşince ne olur ? = bypass.

---

## Web Uygulamalarında Mantık Hataları

Bir web uygulamasına bak. Gördüğün her input kutusu potansiyel bir kapıdır.

### SQLi — Veritabanını Kandırmak

Login sayfasında kullanıcı adı alanına şunu yaz:

```sql
' OR '1'='1

```

Arka planda ne oluyor?

```sql
-- Normal sorgu:
SELECT * FROM users WHERE username='yusuf' AND password='1234'

-- Senin girdinle:
SELECT * FROM users WHERE username='' OR '1'='1' -- ' AND password=''

```

`1=1` her zaman doğrudur. Veritabanı "tamam, bu kullanıcı var" der. Şifresiz giriş.

Araç kullandın mı? Hayır. Sadece mantık.

### IDOR — Numarayı Bir Arttır

URL’ye bak:

`https://site.com/invoice/1042`

`1042` yerine `1041` yaz. Başkasının faturası açılıyorsa — Insecure Direct Object Reference.

Sistem sana güveniyor, yetki kontrolü yapmıyor. Sen sadece tahminde bulundun.

### XSS — Sayfaya Kod Gömmek

Yorum kutusuna yaz:

```html
<script>alert(document.cookie)</script>

```

Eğer sayfa bunu filtrelemediyse — script çalışır, cookie’ler ekrana gelir. Başka birinin oturumunu çalabilirsin.

**Ortak Nokta:**
Input -> Filtre Yok -> Sistem İnanıyor -> Sen Kazandın

Bu üç saldırının ortak mantığı: sistem girdiye körü körüne güveniyor.

---

## Yapılandırma Hataları ve Açık Unutulan Kapılar

Bazen sızmak için açık bulmak gerekmez. Çünkü kapı hiç kapanmamış.

### Default Credentials — Fabrika Ayarları

Bir router, kamera, ya da sunucu kurulduğunda üreticinin belirlediği varsayılan şifresi vardır. Çoğu sistem yöneticisi bunu değiştirmez.

* `admin : admin`
* `admin : password`
* `root : root`
* `admin : 1234`

Bu bir teori değil. Shodan — internete açık cihazları tarayan bir arama motoru — sadece tarayıcıda açılır ve şunu yazarsın:

`default password camera country:TR`

Binlerce cihaz. Kullanıcı adı ve şifre zaten belgelenmiş, üreticinin sitesinde yazıyor.

Araç? Yok. Sadece Google + mantık.

### Config Leak — Yanlışlıkla Açık Bırakılan Sırlar

Geliştirici bir projeyi GitHub’a atıyor. Acele ediyor. `.env` dosyasını `.gitignore`’a eklemeyi unutuyor.

```bash
# .env dosyası — production sunucusunda
DB_HOST=192.168.1.10
DB_USER=root
DB_PASS=SuperSecret123
AWS_KEY=AKIAIOSFODNN7EXAMPLE
AWS_SECRET=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY

```

Bu dosya şu an GitHub’da herkese açık. GitHub’ın kendi arama çubuğuyla bulunabilir:

`"DB_PASSWORD" "AWS_SECRET" filename:.env`

Gerçek vaka: 2019'da Capital One, bir AWS misconfiguration yüzünden 100 milyon kullanıcı verisini sızdırdı. İçeriden biri — eski AWS çalışanı — sadece yanlış yapılandırılmış bir metadata endpoint’i kullandı.

### Robots.txt — Gizlemeye Çalışırken İşaret Etmek

`https://site.com/robots.txt`

Bu dosya arama motorlarına "şu dizinleri tarama" der. Ama aynı zamanda neyin gizlendiğini söyler:

```text
Disallow: /admin
Disallow: /backup
Disallow: /internal-api

```

Geliştirici gizlemek istedi. Sen de tam oraya baktın.

**Özet Mantık:**

* Fabrika şifresi değişmemiş -> Giriş
* Config dosyası commit'lenmiş -> Anahtar senin
* Robots.txt yanlış yazılmış -> Harita elinde

---

## Temel Araçlar: curl ve netcat

`curl` ve `netcat` — bunlar hacking aracı değil, ağın temel taşları. Her Linux/Mac sisteminde kurulu gelir. Windows’ta bile artık varsayılan.

Yani hedef sisteme özel bir şey yükleme. Zaten orada.

### curl — HTTP’yi Elle Sürmek

Tarayıcı bir isteği otomatik gönderir. `curl` ise o isteği sen yazarsın, sen kontrol edersin.

Normal login isteği tarayıcıdan:

```http
POST /login
username=yusuf&password=1234

```

Aynısını `curl` ile:

```bash
curl -X POST "[http://hedef.com/login](http://hedef.com/login)" \
  -d "username=admin'--&password=x"

```

Fark şu: tarayıcı seni kısıtlar, `curl` kısıtlamaz.

**Header Manipülasyonu:**

Bazı sistemler sana IP’ne göre davranır:

```bash
curl -H "X-Forwarded-For: 127.0.0.1" [http://hedef.com/admin](http://hedef.com/admin)

```

Sistem "bu istek localhost’tan geliyor" sanır. İç ağdan geliyormuş gibi görünürsün.

### netcat — Ham Soket

`netcat` — `nc` — iki nokta arasında ham TCP bağlantısı açar. Protokol yok, şifreleme yok, sadece veri.

Bir porta bağlanmak:

```bash
nc hedef.com 80

```

Bağlandıktan sonra elle HTTP yazıyorsun:

```http
GET / HTTP/1.0
Host: hedef.com

```

Sunucu cevap verir. Sürüm bilgisi, header’lar, her şey görünür.

**Banner Grabbing — Sunucu Kendini Tanıtıyor:**

```bash
nc hedef.com 22

```

Cevap:
`SSH-2.0-OpenSSH_7.4`

Bu sürümün bilinen bir CVE’si var mı? Bir Google aramasıyla öğrenirsin.

```bash
nc hedef.com 25

```

Cevap:
`220 mail.hedef.com ESMTP Sendmail 8.14.4`

Versiyon belli. Exploit veritabanında ara.

**Mantık:**

* `curl` -> HTTP'yi elle yönet, kısıtlamaları bypass et
* `nc` -> Servisle doğrudan konuş, kendini ifşa ettir

İkisi de sistemin içinde zaten var. Sen sadece doğru sordun.

---

## Zafiyet Zincirleme (Attack Chain)

Tek bir teknik nadiren yeterlidir. Gerçek sızma = birden fazla zayıflığı zincirlemek.

Bir senaryo işleyelim. Hedef: orta ölçekli bir şirketin web uygulaması.

### Adım 1 — Keşif (Tool Yok)

Google’a yazıyorsun:

`site:linkedin.com "HedefAS" "sistem yöneticisi"`

İsim buldun: Ahmet Yılmaz, IT Admin.

Sonra GitHub:

`"hedefas.com" filename:.env`

Bir repo çıkıyor. Eski bir geliştirici yanlışlıkla commit’lemiş:

```text
DB_PASS=Ahmet2019!
MAIL_USER=ahmet@hedefas.com

```

### Adım 2 — Giriş Denemesi (Sadece Tarayıcı)

`ahmet@hedefas.com` + `Ahmet2019!` kombinasyonunu şirketin mail portalında dene.

Giriş başarılı. İnsanlar aynı şifreyi birden fazla yerde kullanır.

### Adım 3 — Yetki Yükseltme (curl)

Mail sistemine girdin ama admin paneli farklı bir endpoint’te:

```bash
curl -H "Cookie: session=ele_geçirilen_token" \
     -H "X-Forwarded-For: 127.0.0.1" \
     [http://hedefas.com/internal/admin](http://hedefas.com/internal/admin)

```

Sistem iç ağdan geldiğini sanıyor. Panel açılıyor.

### Adım 4 — Veri (Tarayıcı + Mantık)

Admin panelinde kullanıcı listesi var:

* `/users/1`
* `/users/2`
* `/users/3`

IDOR. `/users/1`’den `/users/500`’e kadar tek tek dene. Filtreleme yoksa — tüm kullanıcı verisi önünde.

### Zincirin Şeması

`OSINT` -> `Config Leak` -> `Credential Reuse` -> `Header Spoofing` -> `IDOR`

Her adım bir öncekinin üstüne oturuyor. Hiçbiri tek başına yeterli değildi.

---

## Genel Ders

Sistem ne kadar güçlü olursa olsun, zincirin en zayıf halkası kadar güvenlidir.

Bu zincirde kullandıklarımız:

* Google
* Tarayıcı
* curl
* Mantık

Hepsi bu.

```

```
