# PHP2Shell Krizi: CVE-2026-109618 & CVE-2026-109619

![PHP2Shell: PHP çekirdeğinde iki kritik güvenlik açığı](/blogs/img/php2shell/kapak-00.png)

W3Techs’in 23 Ekim 2026 verilerine göre, sunucu tarafı programlama dili belirlenebilen web sitelerinin %69,3’ünde kullanılan PHP programlama dilinin çekirdeğinde, kimlik doğrulaması gerektirmeyen Kritik Uzaktan Kod Çalıştırma (Remote Code Execution - RCE) zafiyetleri keşfedilmiştir. Kamuoyunda "PHP2Shell" olarak bilinen bu zafiyetler, CVE-2026-109618 ve CVE-2026-109619 numaralarıyla tescillenmiş ve CVSS v4.0 üzerinden 9.2 (Kritik) skor ile derecelendirilmiştir.

İlgili zafiyet; WordPress, Laravel veya Magento gibi uygulamaların kaynak kodunda değil, doğrudan PHP motorunun bellek yönetiminde bulunmaktadır. Bu yapısal durum nedeniyle, kullanılan uygulamalar en güncel sürümlerinde olsa dahi, altyapıda çalışan PHP sürümünün yamalanmaması halinde saldırganın PHP web worker sürecinin yetkileriyle kod çalıştırması riski bulunmaktadır. Sunucunun tamamına erişimin kapsamı, süreç yetkilerine ve sistemin izolasyonuna bağlıdır.

Bu yazıda; söz konusu zafiyetin teknik kök nedenleri, yapay zeka destekli keşif süreci, ifşa sonrası daralan müdahale süresinin yarattığı hukuki ve operasyonel baskı, acil yama stratejileri ve saldırı sonrası İhlal Göstergesi (Indicator of Compromise - IOC) tespit yöntemleri detaylı olarak incelenmektedir.

---

## 1. Keşif Hikayesi: Yapay Zeka ve Daralan Müdahale Süresi

Araştırmacılara göre PHP 5.4’e kadar uzanan sürümler, açıklanan zafiyetlerden en az birinden etkilenmektedir. 2024 yılında OSTIF koordinasyonunda Quarkslab tarafından gerçekleştirilen denetimi takip eden düzeltme çalışmaları sırasında, PHP Foundation tarafından görevlendirilen bir PHP çekirdek geliştiricisi ilgili Bellek Yetersizliği (Out-Of-Memory - OOM) sorununun ilk işaretlerini tespit etmiştir; ancak o aşamada somut bir istismar yolu gösterilememiştir. PHP Foundation, düzeltmenin gecikmesini güvenlik değerlendirme süreci ve kaynak yetersizliğiyle ilişkili yapısal bir başarısızlık olarak açıklamıştır.

Calif, OpenAI ve Wiz’in araştırmaları; ileri düzey yapay zeka modellerinin desteğiyle, iki CVE altında gruplanan birden fazla bellek güvenliği sorununu ve bunların istismar yollarını ortaya koymuştur.

Bu durum siber güvenlik dünyası için kritik bir analitik çıkarımı da gözler önüne sermektedir: Bu bulgular, yapay zeka desteğinin saldırganların istismar geliştirme ve farklı hedeflere uyarlama maliyetini de azaltabileceğini göstermektedir.

![Araştırmacının kod incelemesi ve doğrulama çalışmaları ile model destekli analizin birlikte yürütülmesi](/blogs/img/php2shell/php-01.png)

### İfşa Sonrası Daralan Müdahale Süresi ve Hukuki Sorumluluk

Bu olay, ifşa sonrasında savunma için kullanılabilecek sürenin saatlerle ölçülebileceğini göstermektedir. Zafiyetlere ilişkin bilgiler 20 Ekim 2026 tarihinde, koordineli ifşa (embargo) süresi dolmadan sızdırılmış ve resmi yama 21 Ekim 2026, yaklaşık 14.00 UTC — Türkiye saatiyle 17.00 — itibarıyla duyurulmuştur. CVE bilgilerinin, tam teknik ayrıntıların ve çalışan istismar kodunun kamuya çıkışı aynı olay olarak değerlendirilmemelidir.

7545 sayılı Siber Güvenlik Kanunu’nun 4. maddesi süreklilik ve gerekli tedbirlerin alınması ilkelerini, 7. maddesi ise mevzuatın öngördüğü tedbirlerin alınmasını ve tespit edilen zafiyet veya siber olayların gecikmeksizin bildirilmesini düzenler. Bununla birlikte, yamanın yayımlanması tek başına otomatik hukuki sorumluluk doğduğu anlamına gelmez. Bir saatlik eylemsizlik için de yalnızca geçen süreye dayanılarak böyle bir sonuca varılamaz. Somut sorumluluk, ilgili yükümlülükler ve olayın koşulları üzerinden değerlendirilmelidir.

---

## 2. Kurumsal Tedbirler ve Türkiye'deki Durum

Zafiyetin yarattığı etki, yalnızca teknik bir sorun olmanın ötesine geçerek devlet ve kurum seviyesinde çeşitli tedbirlerin alınmasını tetiklemiştir. Hollanda NCSC, tedbir olarak kendi web sitesini geçici süreyle kapattığını açıklamıştır. Japonya IPA da güncelleme, geçici önlem ve gerektiğinde dış erişimi kesme veya hizmeti durdurma konusunda uyarı yayımlamıştır.

Türkiye’de ise Siber Güvenlik Başkanlığının 21 Ekim 2026 tarihli TR-26-1372 sayılı bildirimiyle ilişkili kurumsal duyurularda, güncellemelerin uygulanması ve kritik servislere dış erişimin güvenilir IP adresleriyle sınırlandırılması önerilmiştir. Aynı duyurularda, yurt dışından erişim ihtiyacı bulunmayan sistemler için uluslararası trafik kısıtlamaları uygulanması da tavsiye edilmiştir.

Bununla birlikte, kurumsal taraftaki yama (patch) süreci tek tip bir standartta ilerlememiştir. Örneğin, popüler bir paket deposu (repository) olan Remi, yamalı PHP paketlerinin kullanılabilir olduğunu 22 Ekim’de duyurmuştur. Plesk’in 22 Ekim tarihli güncellenmiş bildirimine göre desteklenen PHP dallarının yamaları Linux ve Windows için yayımlanmıştır. Plesk’in kendi `sw-engine`/`plesk-engine` bileşenlerinin de ayrıca güncellenmesi gerekmektedir. Yaşanan bu süreç, detaylı varlık envanteri çıkarmanın ve tedarikçi bağımlılıklarını yönetmenin siber güvenlik operasyonlarında ne kadar kritik bir öneme sahip olduğunu bir kez daha gözler önüne sermiştir.

---

## 3. Teknik Derinlik: Zafiyetler Nasıl Çalışıyor?

Her iki zafiyet de web worker sürecinin yetkilerini kullanarak, sistemde herhangi bir kimlik doğrulaması gerektirmeden uzaktan kod çalıştırma imkânı tanımaktadır. CVE-2026-109618, OOM sırasında `longjmp()` aracılığıyla gerçekleşen erken çıkışın yarım başlatılmış istek verilerini geçersiz durumda bırakmasıyla ilişkilidir. CVE-2026-109619 ise istek belleği serbest bırakıldıktan sonra kalıcı global referansların sonraki istekte kullanılabilmesiyle ilişkilidir; yalnızca OOM veya `longjmp()` ile sınırlı değildir.

### CVE-2026-109618: Bellek Tükenmesi (OOM) Kaynaklı Bellek Bozulması

**Mekanizma:** PHP, bir isteği işlerken bellek sınırına ulaşıp işlemi beklenmedik şekilde durdurduğunda, bazı iç veriler güvenli bir şekilde temizlenememektedir. Bellek ayırma işleminin başarısız olması nedeniyle PHP isteği yarıda bırakmakta; ancak kısmen başlatılmış olan veri, temizlik aşamasında sistem tarafından geçerli bir işaretçi (pointer) olarak işleme alınmaktadır.

**Exploit Vektörü:** Saldırganlar, yapılandırılmış limitler dâhilinde görünmesine rağmen belleği hızla tüketen özel olarak hazırlanmış `multipart/form-data` (dosya yükleme) istekleri göndererek bu durumu tetiklemektedir.

**Analoji:** Bu durum, sipariş defteri dolan bir garsonun yarım kalan fişini mutfağa göndermesi ve saldırganın fişteki bu boşluğa kendi talimatlarını yazması şeklinde örneklendirilebilir.

**En Yüksek Risk:** Bu zafiyetten en çok etkilenen yapı Apache `mod_php` modülüdür; zira istismar süreci, temel uygulama kodu (örneğin WordPress) henüz çalışmaya başlamadan önce tetiklenebilmektedir.

### CVE-2026-109619: İstekler Arası Use-After-Free (Bayat Global Durum)

**Mekanizma:** PHP, fatal error veya zaman aşımı gibi durumlar sonrasında önceki bir isteğe ait bellek alanını serbest bıraktığında, bu alanla ilişkili eski iç durum (internal state) verilerini sıfırlamadan bırakmaktadır. Aynı worker process tarafından alınan bir sonraki istek, bu serbest bırakılmış belleğe işaret eden bayat (stale) durumu kullanarak Use-After-Free zafiyetine yol açmaktadır.

**Exploit Vektörü:** Zafiyetin doğrulanmış istismar yollarından biri, varsayılan olarak açık gelen `session.upload_progress` özelliğidir. Saldırgan, `PHP_SESSION_UPLOAD_PROGRESS` alanı içeren ancak fiilen dosya yüklemeyen özel bir istek gönderir. Bu istek tek başına yeterli değildir; önceki isteğin bıraktığı geçersiz durumun aynı worker tarafından işlenen sonraki istekte kullanılması gerekir. Bu işlem, uygulamanın `session_start()` fonksiyonunu çağırmasını dahi gerektirmemektedir. Ek olarak, PHP 8.5 sürümündeki `fatal_error_backtraces` özelliğiyle ilişkili durum, ayrı bir doğrulanmış istismar yoludur.

![CVE-2026-109619 için istek belleğinin serbest bırakılması, global referansın kalması ve aynı worker tarafından sonraki istekte kullanılması şeması](/blogs/img/php2shell/php-02.png)

**Analoji:** Bu süreç, temizlenmeden yeni bir misafire verilen otel odasına benzetilebilir. İlk misafirin (saldırgan) odaya bıraktığı tuzaklı bir not, odaya daha sonra giren süreç tarafından geçerli bir talimat olarak işlenmektedir.

---

## 4. Etki Alanı: Yalnızca Uygulama Güncellemenin Neden Yetersiz Kaldığı

PHP ekibi, web isteği karşılayan etkilenen PHP kurulumlarını risk kapsamında değerlendirmektedir. İstismarın önkoşulları ve doğrulanma düzeyi SAPI’ye, yapılandırmaya ve uygulamaya göre değişmektedir. Etkilenen başlıca bileşenler şunlardır:

- PHP-FPM
- Apache `mod_php` (istismar vektörünün doğası gereği en yüksek risk seviyesine sahiptir)
- `php-cgi`, FrankenPHP ve LiteSpeed (LSAPI)

mod_php için uygulama kodu çalışmaya başlamadan tetiklenebilen istismar gösterilmiştir. PHP-FPM de risk kapsamındadır; istismar koşulları kullanılan yola, yapılandırmaya ve uygulamaya göre değişmektedir.

Bu noktada dikkat edilmesi gereken en kritik husus; sistemdeki WordPress veya Laravel gibi uygulamaların en güncel sürümlere yükseltilmesinin tek başına koruma sağlamamasıdır. Zafiyetin giderilebilmesi için sunucu üzerinde çalışan PHP runtime (çalışma zamanı) ortamının doğrudan yamalanması gerekmektedir. Ek olarak, cPanel ve Plesk gibi barındırma panellerinin kendi iç mimarilerinde yer alan veya çeşitli ağ cihazlarına gömülü (embedded) olarak sunulan PHP sürümlerinin de bağımsız olarak tespit edilip güncellenmesi şarttır.

---

## 5. Acil Aksiyon Planı: Yama ve EOL Sürümler

PHP ekibi, 21 Ekim 2026 tarihinde acil güvenlik güncellemelerini yayımlamıştır. Kurumların normal yama döngülerini beklemeksizin, bu güncellemeleri acil bir değişiklik (emergency change) olarak sistemlerine uygulamaları şiddetle tavsiye edilmektedir.

| PHP Dalı | Etkilenen Sürümler | Bu İki CVE İçin İlk Düzeltilmiş Sürüm | Destek Durumu |
|---|---|---|---|
| PHP 8.5 | 8.5.11 ve öncesi | 8.5.12 | Aktif Destek |
| PHP 8.4 | 8.4.26 ve öncesi | 8.4.27 | Aktif Destek |
| PHP 8.3 | 8.3.35 ve öncesi | 8.3.36 | Sadece Güvenlik Yaması |
| PHP 8.2 | 8.2.34 ve öncesi | 8.2.35 | Sadece Güvenlik Yaması |
| PHP 8.1 ve öncesi | Etkilenen eski sürümler; PHP 5.4’e kadar uzanan sürümler en az bir zafiyetten etkilenmektedir | Yeni resmi PHP sürümü yok; PHP 7.4, 8.0 ve 8.1 için minimal kaynak kodu backport’ları bulunmaktadır | EOL (Destek Dışı) |

PHP 8.2’nin güvenlik desteği 31 Aralık 2026’da sona ermektedir.

![Yazıda belirtilen PHP düzeltme sürümleri ve temsili PHP 8.3.36 CLI çıktısı](/blogs/img/php2shell/php-03.png)

### EOL (Destek Dışı) Sürümler İçin Alınması Gereken Aksiyonlar

PHP 8.1 ve öncesi End-of-Life (EOL) sürümler için PHP projesi tarafından yeni bir resmi sürüm yayımlanmamıştır. Ancak PHP ekibi, PHP 7.4, 8.0 ve 8.1 için minimal kaynak kodu backport’ları (geriye dönük yamalar) paylaşmıştır. Bu eski sürümleri kullanmaya devam eden kurumların derhal desteklenen güncel bir sürüme geçiş planlaması yapması gerekmektedir. Geçiş süreci tamamlanana kadar alınabilecek geçici önlemler; kullanılan Linux dağıtımının resmi güvenlik depolarından gelen backport'lu paketlerin kurulması veya ilgili yamanın doğrudan kaynak koddan (source) derlenerek sisteme uygulanmasıdır.

### 23 Ekim 2026 Güncellemesi

PHP ekibi, belirli session serializer yapılandırmaları ve çalışma anında serializer değişikliğiyle ilişkili ek bir RCE olasılığı için `session.upload_progress.enabled=0` önerisini yayımlamıştır. Sorun; yapılandırmada `session.serialize_handler` değerinin `php_binary` veya `php_serialize` olarak belirlenmesi, uygulamanın bu değeri `session_start()` öncesinde `ini_set()` ile `php` olarak değiştirmesi ve session upload progress özelliğinin açık olması koşullarının birleşimiyle ilişkilidir. CVE-2026-115560 olarak izlenecek bu ayrı sorun, bir sonraki olağan düzeltme sürümünde ele alınacaktır. Bu ek uyarı, ilk iki CVE’nin yamalarının çalışmadığı anlamına gelmemektedir.

---

## 6. Geçici Önlem Stratejileri (Yama Yapılamıyorsa)

Uygulanacak bu önlemlerin tam bir çözüm sunmadığı, yalnızca bilinen istismar yollarını zorlaştırmayı amaçladığı önemle vurgulanmaktadır. İlgili yapılandırmalar için istek ayrıştırılmadan önce uygulanan yönetimsel yapılandırma kullanılmalıdır; `ini_set()` ve FPM `.user.ini` dosyasına güvenilmemelidir. `php.ini` ile FPM pool `.conf` dosyalarında kullanılacak ayar biçimleri farklıdır.

### session.upload_progress Kapatma (CVE-2026-109619’un doğrulanmış session yolları için)

`php.ini` içinde:

```ini
session.upload_progress.enabled = 0
```

FPM havuz dosyasında alternatif karşılığı:

```ini
php_admin_flag[session.upload_progress.enabled] = off
```

### Fatal Error Backtrace Kapatma (Yalnızca PHP 8.5 sürümleri için)

`php.ini` içinde:

```ini
fatal_error_backtraces = 0
```

FPM havuz dosyasında alternatif karşılığı:

```ini
php_admin_flag[fatal_error_backtraces] = off
```

### OOM Kaynaklı Bilinen İstismar Yolunu Azaltma (CVE-2026-109618 için)

`memory_limit=-1`, PHP’nin istek başına bellek sınırının kontrollü biçimde aşılmasına dayanan bilinen yolu azaltır; ancak alttaki bellek ayırma işlemlerinin başarısız olması hâlinde savunmasız yol yine tetiklenebilir. Bu ayar Denial of Service (DoS) riski oluşturabileceğinden, `post_max_size` ve ön sunucu veya proxy sınırlarıyla birlikte değerlendirilmelidir.

`php.ini` içinde:

```ini
memory_limit = -1
post_max_size = 8M   ; Dosya yükleme bulunmuyorsa
; VEYA
post_max_size = 32M  ; Dosya yükleme bulunuyorsa
```

FPM havuz dosyasında alternatif karşılığı:

```ini
php_admin_value[memory_limit] = -1
php_admin_value[post_max_size] = 8M   ; Dosya yükleme bulunmuyorsa
; VEYA
php_admin_value[post_max_size] = 32M  ; Dosya yükleme bulunuyorsa
```

`post_max_size` tek başına yeterli değildir. Ön sunucu veya proxy katmanında çözümlenmiş istek gövdesi, multipart parça ve başlık sayıları ile iç içe alan derinliği de sınırlandırılmalıdır. Kontroller, kullanılabilir `Content-Length` bulunmayan istekleri de kapsamalıdır. `upload_max_filesize`, `post_max_size` değerinden küçük tutulmalıdır.

### PHP-FPM İçin Worker Sıfırlama

Her istekten sonra worker sürecinin yeniden başlatılması sağlanarak "bayat global durum" (stale global state) riski azaltılmaktadır.

```ini
; FPM pool config (www.conf)
pm.max_requests = 1
```

Ayar değişikliklerinden sonra bütün ilgili worker süreçleri yenilenmeli ve etkin değerler doğrulanmalıdır. `pm.max_requests=1` geçici bir önlemdir; süreç oluşturma yükü ve performans etkisi değerlendirilmelidir.

---

## 7. İhlal Edilmiş Kabul Et: Sır Rotasyonu ve Bellek Sızıntısı

Sisteme yalnızca yama uygulanması, Olay Müdahalesi (Incident Response) sürecini tek başına sonlandırmamaktadır. Özellikle CVE-2026-109618 zafiyetinin sunucu belleğini istemciye sızdırma potansiyeli göz önüne alındığında, analiz ve müdahale süreçlerinin "ihlal edilmiş kabul et" (assume breach) prensibiyle yürütülmesi gerekmektedir. Bu yaklaşım, her etkilenen sistemde başarılı bir ihlalin kanıtlandığı anlamına gelmemektedir.

AWS, 17 Ekim 2026 tarihine ait bir istismar girişimi bildirmiştir. Bu nedenle geriye dönük inceleme en az 17 Ekim 2026’dan başlatılmalı; mevcut kayıtlar ve bulgular daha eskiye gidilmesini gerektiriyorsa kapsam genişletilmelidir. AWS’nin gözlemi, gerçek sistemlerde başarılı ihlalin kesinleştiği şeklinde yorumlanmamalıdır. İnternete açık ve etkilenen sistemler potansiyel ihlal kapsamında incelenmelidir. Bu doğrultuda, yama işlemi sonrasında değerlendirilmesi gereken kritik operasyonel adımlardan biri "sır rotasyonu"dur (secret rotation). Rotasyon kapsamı, PHP sürecinin erişebildiği sırlar, olası bellek içeriği ve inceleme bulgularına göre belirlenmelidir. Bu değerlendirmeye veritabanı ve SMTP parolaları, API anahtarları, uygulama secret değerleri ve oturum imzalama anahtarları dahil edilmelidir. Yeni sırlar, saldırganın erişiminin kesildiği güvenilir ortamda devreye alınmalı; ilgili token ve oturumların iptali de değerlendirilmelidir.

TLS özel anahtarının ele geçirildiği veya geçirilmiş olabileceği değerlendiriliyorsa yeni anahtar çifti oluşturulmalı, yeni sertifika alınmalı ve eski sertifika iptal edilmelidir. TLS’nin ayrı bir proxy’de sonlandığı durumlarda anahtarın PHP sürecinden erişilebilirliği ayrıca değerlendirilmelidir. Sadece PHP altyapısının yamalanması, sisteme daha önce yerleşmiş bir tehdit aktörünü veya sızdırılmış verileri etkisiz hale getirmemektedir.

---

## 8. Tespit ve Tehdit Avı (Threat Hunting)

İstismar sürecinin kendisi uygulama loglarında her zaman net bir iz bırakmayabilmekte, çoğu durumda yalnızca bir segfault veya memory exhausted hatası olarak yansıyabilmektedir. Bu nedenle tespit mekanizmalarının, istismar sonrası davranışlara (post-exploitation) odaklanması gerekmektedir. Geriye dönük inceleme en az 17 Ekim 2026’dan başlatılmalı; mevcut kayıtlar ve bulgular daha eskiye gidilmesini gerektiriyorsa kapsam genişletilmelidir.

### Şüpheli Davranışlar ve İnceleme Göstergeleri

Bu işaretler tek başına başarılı istismar kanıtı değildir; meşru uygulama davranışlarıyla karşılaştırılarak değerlendirilmelidir. Aşağıdaki liste hem istismar girişimiyle ilişkili belirtileri hem de istismar sonrası davranışları içermektedir.

- **Şüpheli Alt Süreç Oluşturma:** `php-fpm`, `httpd`, `apache2` gibi web süreçlerinin `sh`, `bash`, `curl`, `wget`, `python` veya `nc` gibi araçları başlatması.
- **Anormal Çökmeler:** PHP error log'larında ani artış gösteren segfault (SIGSEGV) hataları veya kısa sürede sürekli tekrarlayan worker restart işlemleri.
- **Kümelenmiş OOM Hataları:** Aynı kaynak IP adresinden gelen isteklerle ilişkili olarak arka arkaya tetiklenen "Allowed memory size exhausted" hataları.
- **Anormal Multipart İstekleri:** İstek gövdesi kaydı mevcutsa WAF veya Access log'larında çok sayıda parça içeren, olağandışı boyutta olan veya `PHP_SESSION_UPLOAD_PROGRESS` alanı taşıdığı halde dosya içermeyen POST istekleri. `PHP_SESSION_UPLOAD_PROGRESS` alanının bulunması tek başına kötü niyet kanıtı değildir.
- **Bellek Sızıntısı Göstergesi:** Yanıtlardaki `Set-Cookie` başlıklarında beklenmedik uzunlukta veya bozuk biçimli `PHPSESSID` değerleri; URL kodlamasıyla taşınabilecek olağandışı içerik.
- **Kalıcılık (Persistence):** Web kök dizininde oluşturulan veya değiştirilen şüpheli `.php` dosyaları (Web Shell) ile sisteme yeni eklenen cron girdileri.

### Örnek Sigma Kuralı (Linux Süreç Oluşturma)

Bu kural PHP2Shell’e özgü değildir; şüpheli web süreci alt süreçlerini arayan, ortama göre ayarlanması gereken bir örnektir. Süreç oluşturma telemetrisi ve kullanılan veri kaynağındaki alanların `ParentImage` ve `Image` alanlarıyla eşleştirilmesi gerekmektedir. Sürümlü PHP-FPM çalıştırılabilir dosya adları ortama göre genişletilmelidir.

EDR veya SIEM sistemlerinde uyarı oluşturmak amacıyla aşağıdaki mantık kullanılabilmektedir:

```yaml
title: PHP Web Sürecinden Şüpheli Alt Süreç (PHP2Shell Sonrası)
status: experimental
description: PHP çalıştıran web süreçlerinin kabuk veya indirme aracı başlatmasını tespit eder.
logsource:
  product: linux
  category: process_creation
detection:
  selection_parent:
    ParentImage|endswith:
      - '/php-fpm'
      - '/php-fpm8.2'
      - '/php-fpm8.3'
      - '/php-fpm8.4'
      - '/php-fpm8.5'
      - '/php-cgi'
      - '/httpd'
      - '/apache2'
      - '/frankenphp'
      - '/lsphp'
  selection_child:
    Image|endswith:
      - '/sh'
      - '/bash'
      - '/curl'
      - '/wget'
      - '/python3'
      - '/nc'
  condition: selection_parent and selection_child
falsepositives:
  - Uygulamanın meşru kabuk komutları veya harici araçlar çalıştırması
  - Yetkili bakım, dosya işleme veya entegrasyon işlemleri
level: high
```

Bu örneğe üretim ortamının gerektirdiği metadata ve filtreler eklenmelidir. Temel Sigma belirtiminin gereklilikleri ile SigmaHQ deposunun ek kabul kuralları birbirinden ayrıdır.

![PHP-FPM sürecinin Bash alt süreci başlatmasını gösteren temsili SIEM ve EDR alarm ekranı](/blogs/img/php2shell/php-04.png)

Yaşanan bu son olay, temel altyapı katmanlarında ortaya çıkan güvenlik açıklarının geniş bir etki alanına sahip olabileceğini göstermiştir. Yapay zeka teknolojileri, güvenlik açığı araştırmalarında ve istismar geliştirme süreçlerinde gereken süreyi ve uzmanlık maliyetini azaltabilmektedir. Bu koşullarda müdahale süreçlerini geciktirmek, sistemlerin saldırılara açık kaldığı süreyi uzatmaktadır. Sistemlerin ivedilikle yamalanması, yamalanamayan bileşenlerin sıkı bir şekilde izole edilmesi, logların tehdit avı perspektifiyle incelenmesi ve PHP sürecinin erişebildiği sırların maruziyet değerlendirmesine göre rotasyon sürecine dahil edilmesi, mevcut risk tablosunda alınması gereken en temel savunma refleksleridir.

---

## Kaynaklar ve Referanslar

- **PHP Security Team.** *RCE via OOM corruption — CVE-2026-109618, GHSA-w8hw-w9fx-j79w.* 21 Ekim 2026. [Resmî güvenlik bildirimi](https://github.com/php/php-src/security/advisories/GHSA-w8hw-w9fx-j79w).

- **PHP Security Team.** *RCE via stale global state — CVE-2026-109619, GHSA-6wmf-4rv5-p3rp.* 21 Ekim 2026. [Resmî güvenlik bildirimi](https://github.com/php/php-src/security/advisories/GHSA-6wmf-4rv5-p3rp).

- **The PHP Group.** *Security advisory: Critical remote code execution vulnerabilities, update now.* 21 Ekim 2026. [Güvenlik güncellemesi ve geçici önlem önerileri](https://www.php.net/archive/2026.php#2026-10-21-5).

- **The PHP Group.** *Informational advisory: Session upload progress.* 23 Ekim 2026. [Session upload progress ve CVE-2026-115560 hakkında ek duyuru](https://www.php.net/archive/2026.php).

- **The PHP Foundation.** *Today’s PHP Security Release, and How We’re Strengthening PHP Security.* 21 Ekim 2026. [Keşif süreci ve PHP güvenlik yaklaşımına ilişkin açıklama](https://thephp.foundation/blog/2026/10/21/todays-php-security-release-and-how-were-strengthening-php-security/).

- **Wiz Research — Sagi Tzadik, Shir Tamari, Nir Ohfeld ve Tomer Schwartz.** *PHP2Shell: AI uncovers critical RCE vulnerabilities affecting 70% of the Internet.* 21 Ekim 2026. [Teknik araştırma raporu](https://www.wiz.io/blog/php2shell-php-rce).

- **Calif Research.** *A tale of two PHP remote vulnerabilities.* [Keşif geçmişi, teknik analiz ve koordineli ifşa zaman çizelgesi](https://calif.io/php2shell/).

- **T.C. Cumhurbaşkanlığı Siber Güvenlik Başkanlığı.** *TR-26-1372 — PHP Programlama Dili Güvenlik Bildirimi.* 21 Ekim 2026. [Resmî güvenlik bildirimi](https://siberguvenlik.gov.tr/guvenlik-bildirimleri/detay/tr-26-1372).

- **T.C. Cumhurbaşkanlığı Siber Güvenlik Başkanlığı.** *Dünya genelinde yaygın olarak kullanılan PHP yazılım altyapısında kritik güvenlik açıkları tespit edilmiştir.* 21 Ekim 2026. [Ulusal güvenlik taramaları ve kurumsal bildirimlere ilişkin resmî duyuru](https://siberguvenlik.gov.tr/haberler/detay/php_zafiyet_duyurusu).

- **Amasya Üniversitesi Bilgi İşlem Daire Başkanlığı.** *PHP Tabanlı Sistemler İçin Kritik Güvenlik Uyarısı.* Başkanlığın 21 Ekim 2026 tarihli TR-26-1372 sayılı bildirimini aktaran [kurumsal duyuru](https://bidb.amasya.edu.tr/php-tabanli-sistemler-icin-kritik-guvenlik-uyarisi).

- **Amazon Threat Intelligence — CJ Moses.** *Amazon Threat Intelligence identifies PHP2Shell exploitation prior to public disclosure in MadPot.* 21 Ekim 2026. [İfşa öncesi istismar girişimleri ve inceleme önerileri](https://aws.amazon.com/blogs/security/amazon-threat-intelligence-identifies-php2shell-exploitation-prior-to-public-disclosure-in-madpot/).

- **W3Techs.** *Usage statistics of server-side programming languages for websites.* 23 Ekim 2026 verileri. [PHP kullanım oranı ve ölçüm kapsamı](https://w3techs.com/technologies/overview/programming_language).

- **Remi’s RPM Repository.** *PHP version 8.2.35, 8.3.36, 8.4.27 and 8.5.12.* 22 Ekim 2026. [Yamalı RPM paketlerinin yayımlanmasına ilişkin duyuru](https://blog.remirepo.net/post/2026/10/22/PHP-version-8.2.35-8.3.36-8.4.27-8.5.12).

- **Plesk.** *Vulnerability CVE-2026-109618 and CVE-2026-109619 (PHP2Shell): Remote code execution in PHP shipped with Plesk.* 22 Ekim 2026 güncellemesi. [Linux, Windows ve Plesk’in kendi PHP bileşenleri için yama durumu](https://support.plesk.com/hc/en-us/articles/44397729587351-Vulnerability-CVE-2026-109618-and-CVE-2026-109619-PHP2Shell-Remote-code-execution-in-PHP-shipped-with-Plesk).

- **Hollanda Ulusal Siber Güvenlik Merkezi — NCSC-NL.** *Update: PHP vulnerabilities remain a reason for immediate patching.* 21 Ekim 2026; güncelleme: 23 Ekim 2026. [Kurumsal tedbirler, geçici hizmet durdurma ve güncelleme önerileri](https://www.ncsc.nl/en/alerts/update-php-vulnerabilities-remain-a-reason-for-immediate-patching).

- **Japonya Bilgi Teknolojileri Tanıtım Ajansı — IPA.** *PHPの脆弱性対策について（CVE-2026-109618、CVE-2026-109619：PHP2shell）* [PHP zafiyetlerine karşı alınacak önlemler]. 22 Ekim 2026. [Resmî güvenlik uyarısı](https://www.ipa.go.jp/security/security-alert/2026/alert20261022.html).

- **Türkiye Büyük Millet Meclisi.** *7545 sayılı Siber Güvenlik Kanunu.* Kabul tarihi: 12 Mart 2025; Resmî Gazete: 19 Mart 2025, sayı 32846. Özellikle 4. ve 7. maddeler. [Kanun metni](https://cdn.tbmm.gov.tr/KKBSPublicFile/D28/Y3/KanunMetni/9ac32dc5-35ee-46a8-8c47-7a16ec35d36f.htm).

- **The PHP Group.** *Supported Versions.* [PHP dallarının aktif destek, güvenlik desteği ve destek sonu takvimi](https://www.php.net/supported-versions.php).

- **The PHP Group.** *PHP Manual — FPM Configuration; The Configuration File; Session Runtime Configuration.* [FPM yapılandırması](https://www.php.net/manual/en/install.fpm.configuration.php), [php.ini yapılandırması](https://www.php.net/manual/en/configuration.file.php), [session yapılandırma seçenekleri](https://www.php.net/manual/en/session.configuration.php).

- **CISA.** *Federal Government Cybersecurity Incident and Vulnerability Response Playbooks.* [Olay müdahalesi ve zafiyet müdahalesi rehberleri](https://www.cisa.gov/resources-tools/resources/federal-government-cybersecurity-incident-and-vulnerability-response-playbooks).

- **NIST.** *NIST SP 1800-16B — Securing Web Transactions: TLS Server Certificate Management, Volume B: Security Risks and Recommended Best Practices.* Haziran 2020. [TLS özel anahtarlarının ve sertifikalarının değiştirilmesi ile sertifika iptali önerileri](https://www.nccoe.nist.gov/publication/1800-16/VolB/index.html).

- **SigmaHQ.** *Sigma Rules Specification.* Sürüm 2.1.0, 2 Ağustos 2025. [Sigma kural belirtimi](https://sigmahq.io/sigma-specification/specification/sigma-rules-specification.html).

- **SigmaHQ.** *SigmaHQ Rule Conventions.* [SigmaHQ deposuna özgü ek kural ve metadata gereklilikleri](https://github.com/SigmaHQ/sigma-specification/blob/main/sigmahq/sigmahq-rule-convention.md).

**Çevrimiçi kaynaklara erişim tarihi: 23 Ekim 2026.**
