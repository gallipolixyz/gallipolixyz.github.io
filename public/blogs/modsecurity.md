# ModSecurity Nedir?
![](/blogs/img/modsecurity/modsec1.jpg)

## ModSecurity Nedir?

**ModSecurity**, web sunucularına entegre edilerek çalışan, açık kaynak kodlu ve modüler bir **Web Uygulama Güvenlik Duvarıdır (WAF - Web Application Firewall)**. 

Geleneksel ağ güvenlik duvarları yalnızca IP adreslerini ve port hareketlerini (Katman 3/4) denetlerken; ModSecurity, OSI modelinin 7. katmanında (Uygulama Katmanı) görev yapar. HTTP/HTTPS trafiğinin içeriğini derinlemesine inceleyerek kötü niyetli istekleri web sunucusuna veya arkasındaki uygulamaya ulaşmadan engeller.

Apache, Nginx ve IIS gibi yaygın kullanılan web sunucularıyla tam entegre çalışabilmektedir.

---

## ModSecurity Nasıl Çalışır?

![](/blogs/img/modsecurity/modsec2.jpg)


ModSecurity, web sunucusu ile istemci (kullanıcı) arasına bir güvenlik filtresi olarak konumlanır. Çalışma mekanizması temel olarak şu adımlardan oluşur:

1. **İstek İnceleme (Request Inspection):** İstemciden gelen HTTP isteği (Headers, Cookies, POST/GET parametreleri vb.) sunucuya ulaştığında ModSecurity tarafından yakalanır ve içeriği ayrıştırılır.
2. **Kural Eşleştirme (Rule Matching):** İncelemeye alınan veriler, tanımlanmış güvenlik kurallarıyla (Rule Engine) karşılaştırılır.
3. **Eylem Alma (Action Execution):** Eğer istek tanımlı güvenlik kurallarını ihlal ediyorsa (örneğin zararlı bir SQL enjeksiyon dizilimi içeriyorsa), ModSecurity yapılandırmaya göre isteği engeller (`403 Forbidden`), bağlantıyı keser veya günlüğe (log) kaydeder.


---

## ModSecurity Ne Tür Saldırıları Engeller?

![](/blogs/img/modsecurity/modsec3.jpg)

ModSecurity, özellikle **OWASP Top 10** listesinde yer alan kritik web zafiyetlerine karşı etkin koruma sağlar:

* **SQL Injection (SQLi):** Veritabanı sorgularına müdahale eden zararlı payload'ları tespit eder ve engeller.
* **Cross-Site Scripting (XSS):** Kullanıcı oturumlarını veya verilerini hedef alan zararlı JavaScript kodlarının yürütülmesini önler.
* **Command Injection:** Sunucu üzerinde sistem komutu çalıştırmaya yönelik istekleri yakalar.
* **Path Traversal / LFI (Local File Inclusion):** Sunucu dizinlerinde yetkisiz dosya okuma veya gezinti girişimlerini engeller.
* **Bot ve Brute Force Saldırıları:** Otomatik tarama araçlarının ve kaba kuvvet saldırılarının tespit edilip sınırlandırılmasında rol oynar.


---

## OWASP Core Rule Set (CRS) Entegrasyonu

![](/blogs/img/modsecurity/modsec4.png)

ModSecurity, yapısı gereği bir kural motorudur. İşlevsel olabilmesi için hangi isteklerin zararlı olduğunu belirten **kural kümesine (ruleset)** ihtiyaç duyar. 

Bu noktada devreye **OWASP Core Rule Set (CRS)** girer. OWASP CRS, küresel güvenlik topluluğu tarafından sürdürülen, bilinen web zafiyetlerine karşı hazırlanmış kapsamlı bir kural koleksiyonudur. ModSecurity kurulumu yapıldığında CRS entegre edilerek sistem ilk andan itibaren yaygın tehditlere karşı korumalı hale getirilir.


---

## Avantajlar ve Sınırlılıklar

### Avantajları
* **Açık Kaynak Kodlu ve Ücretsiz:** Herhangi bir lisans maliyeti olmadan kurulup özelleştirilebilir.
* **Detaylı Loglama (Forensics):** Engellenen ve şüpheli görülen tüm HTTP isteklerini ayrıntılı biçimde kaydeder; adli bilişim ve olay müdahalesi (DFIR) süreçlerine büyük katkı sağlar.
* **Kişiselleştirilebilir Kurallar:** Kurum veya uygulamaya özel spesifik güvenlik kuralları yazılmasına imkan tanır.

### Dikkat Edilmesi Gerekenler
* **Yanlış Pozitifler (False Positive):** Yanlış yapılandırılmış veya aşırı katı kural setleri, meşru kullanıcı isteklerinin engellenmesine yol açabilir. Bu nedenle kural kümesinin uygulamanın davranışlarına göre "tune" edilmesi gerekir.
* **Performans Etkisi:** Tüm HTTP/HTTPS trafiğini paket içeriğine kadar incelediği için yüksek trafikli sistemlerde CPU ve bellek kullanımını artırabilir.

---

## Sonuç

ModSecurity, web projelerinizi uygulama katmanındaki zafiyetlere karşı koruyan son derece esnek ve güçlü bir Web Uygulama Güvenlik Duvarıdır. Sistem yöneticileri ve siber güvenlik uzmanları için sunucu tarafı güvenliğini artırmada temel yapı taşlarından biri olmaya devam etmektedir.