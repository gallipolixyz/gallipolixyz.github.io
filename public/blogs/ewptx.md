# Siber Güvenlik Sertifikaları #2: eWPTx Sınavının Anatomisi (Neden eWPT Yerine Bunu Almalısınız?)

Bugüne kadar okuduğunuz “eWPTx sertifikasını nasıl aldım?” temalı, kişisel başarı hikayelerine dayanan o klasik yazıları bir kenara bırakın. İlk yazıda da en baştan söylediğim gibi; bu seride hiçbir sertifikaya sahip olmayan biri olarak, tamamen dışarıdan, dürüst ve objektif bir gözle değerlendirme yapıyorum.

Biz bu seride siber güvenlik dünyasındaki en popüler sertifikaları resmi verilerle masaya yatırıyor, aklınızda tek bir soru işareti bırakmayacak şekilde tüm detaylarını açıklıyor ve yazımızın en sonunda 10 üzerinden acımasızca puanlıyoruz.

Serimizin ikinci konuğu, ilk yazıda incelediğimiz eWPT’nin çok daha acımasız, çok daha modern ve sektörde asıl “aranan kan” olan ağabeyi: **eWPTx (eLearnSecurity Web Application Penetration Tester eXtreme)**.

![eWPTx Banner](/blogs/img/ewptx/ewptx.png)

---

## 1. eWPTx Nedir? Kimler İçin Uygundur?

**eWPTx**, INE (Internetwork Expert) platformu tarafından sunulan, kurumun en gelişmiş (most advanced) web uygulaması sızma testi sertifikasıdır. Bu sınav, temel OWASP açıklarını geçip, günümüzün modern web mimarilerinde derinlemesine pentest yapabilme yeteneğinizi ölçer. eWPT’de öğrendiğiniz o standart açıkları unutun; burada WAF atlatma, filtreleri kandırma ve kompleks zafiyetleri sömürme devreye giriyor.

* **Kimler Almalı?** Deneyimli Web Uygulama Pentesterları, Red Team Operatörleri, Bug Bounty avcıları ve "Ben defansif mekanizmaları aşabiliyorum" diyen herkes.
* **Sektörel Geçerlilik:** %100 pratik olan bu sınav, piyasada ileri düzey becerilerin en büyük kanıtlarından biri olarak kabul edilir. Hatta piyasada Offensive Security’nin (OffSec) OSWE sertifikasına en mantıklı alternatiflerden biri olarak görülür.

---

## 2. eWPTx Müfredat Kontrol Listesi (Domains & Objectives)

Sınava hazırlanırken odaklanmanız gereken alanlar, eski tip web sitelerinden ziyade modern web uygulamalarına odaklanır. Resmi INE sayfasından alınan ağırlıklar ve hedefler tam olarak şu şekildedir:

### A. API Sızma Testleri (%25)
* API uç noktalarında (endpoints) pratik sızma testleri yapmak.
* API zafiyet taraması için otomasyon araçlarını verimli kullanmak.
* Parametre manipülasyonu zafiyetlerini analiz edip sömürmek.
* Rate limiting (hız sınırlaması) mekanizmalarını test etmek (DoS ve kaynak tüketimi) ve kontrollü bir şekilde bu mekanizmaları atlatmak (bypass).

### B. Keşif ve Bilgi Toplama (%15)
* WHOIS, DNS numaralandırma ve ağ taraması gibi tekniklerle pasif/aktif keşif yapmak.
* Alan adları, alt alan adları ve IP adreslerini çıkarmak.
* Girdi doğrulama (input validation) hatalarını bulmak için Fuzzing teknikleri kullanmak.
* Kod içerisindeki sırları (secrets) ve zafiyetleri bulmak için Git tabanlı araçları otomatize etmek.

### C. Kimlik Doğrulama Saldırıları (%15)
* Basic, Digest ve OAuth gibi kimlik doğrulama yöntemlerini Credential Stuffing ve Brute Force saldırılarıyla test etmek.
* SSO (Single Sign-On) uygulamalarındaki yaygın zafiyetleri bulmak.
* Session Management (Oturum sabitleme ve çalma) açıklarını sömürmek.
* OAuth ve OpenID Connect protokollerindeki zayıflıkları tespit edip istismar etmek.

### D. Enjeksiyon Zafiyetleri (%15)
* SQL Injection zafiyetlerini (Error-based, Blind, Time-based) bulmak ve sömürmek.
* `sqlmap` ve diğer otomasyon araçlarını etkin kullanarak sömürüyü kanıtlamak.
* NoSQL Injection zafiyetlerini bulmak ve NoSQL veritabanlarında manuel veri manipülasyonu yapmak.
* Gelişmiş sorgulama teknikleriyle hassas verileri sızdırmak.

### E. Metodoloji (%10)
* Web uygulamalarını endüstri standartlarına uygun metodolojilerle test etmek.
* İş etkisi (business impact) ve risk değerlendirmesine göre test hedeflerini önceliklendirmek.

### F. Sunucu Taraflı Saldırılar (%10)
* **SSRF (Server-Side Request Forgery):** Sunucu taraflı servislere yönelik SSRF saldırıları düzenlemek.
* **Deserialization:** Sunucu taraflı objeleri manipüle ederek Arbitrary Code Execution (RCE) veya yetki yükseltme (Privilege Escalation) sağlamak.
* **LDAP Injection:** Kimlik doğrulamayı atlatmak veya veri sızdırmak için dizin servislerine saldırmak.

### G. Filtre Atlatma ve WAF Bypass (%10)
* WAF kurallarını analiz edip zayıf yapılandırmaları bularak atlatmak.
* Filtreleme mekanizmalarını aşmak için encoding, obfuscation ve payload fragmentation (parçalama) gibi manuel teknikleri uygulamak.
* Özellikle SSRF ve XXE saldırılarında girdi doğrulama mekanizmalarını (content-type değiştirme vb.) atlatmak.

---

## 3. Nasıl Çalışılmalı?

* **Modern Mimariyi ve API’leri Anlayın:** Müfredatın %25'inin sadece API’lere, diğer büyük bir kısmının ise OAuth, SSO ve NoSQL gibi konulara ayrıldığını görüyorsunuz. Geleneksel pentest araçları (örneğin eski Burp Suite eklentileri) modern API'lerde yetersiz kalabilir. Postman kullanımı, API dokümantasyonu (Swagger/OpenAPI) okuma ve REST/GraphQL mantığını çok iyi oturtmanız şart.
* **Ezberlemek Yerine Filtreyi Kandır:** WAF Bypass ve Obfuscation (%10) bölümü, payload’ı körü körüne yapıştırmak yerine uygulamanın o veriyi nasıl işlediğini anlamanızı gerektirir.
* **Lab Önerisi:** Tabii ki INE’nin kendi labları çok değerli, ancak bu ileri seviye konular için yine en büyük dostunuz PortSwigger Web Security Academy. Özellikle Advanced ve Expert zorluk seviyesindeki API Pentesting, Deserialization, SSRF, OAuth ve NoSQL labları tam olarak bu sınavın ruhunu yansıtıyor.

---

## 4. Sınav Formatı ve Süreç Detayları

Eskiden "7 gün lab + 7 gün rapor yazma" eziyeti olan bu sertifika, INE'nin güncel v3 sistemiyle tamamen değişti. Rapor efsaneleri artık geride kaldı ve yerini zamana karşı yarışılan dinamik bir yapı aldı. 

İşte sınavın güncel ve resmi lojistik detayları:

| Parametre | Resmi Detay |
| :--- | :--- |
| **Sınav Tipi** | **%100 Uygulamalı (Hands-on)** İleri Seviye Laboratuvar Ortamı. |
| **Süre** | **10 Saat.** (Sınav başladığı an timer geriye sayar, duraklatılamaz. Çok daha kompleks zafiyetler arayacağınız için zaman yönetimi burada bir kabustur). |
| **Soru Sayısı** | **50 Soru.** (Dinamik lab ortamındaki bulgularınıza dayalı; manuel bulunacak Flag soruları ve çoktan seçmeli sorular). |
| **Raporlama** | **Yok.** (v3 güncellemesi ile birlikte o meşhur uzun rapor yazma ve bekleme süreci tamamen kaldırılmıştır). |
| **Değerlendirme** | **Otomatik Derecelendirme (Auto-graded).** |
| **Sonuç Süresi** | Sınavı tamamladıktan sonra **birkaç saat içinde** detaylı performans raporu e-posta ile iletilir. |
| **Geçerlilik Skoru** | Genellikle %70 ve üzeri başarı gerektirir. (Kazanılan sertifika 3 yıl boyunca geçerlidir). |
| **Ücretsiz Tekrar (Retake)** | Sınav voucher'ı, ilk denemede başarısız olunması durumunda 14 gün içinde kullanılabilecek **bir adet ücretsiz tekrar hakkı** içerir. |

---

## 5. Sertifikayı Puanlama ve Kapanış

İlk yazıda eWPT için bütçenizi tek bir sertifikaya ayıracaksanız eWPTx demiştim. Artık resmi müfredata bakarak bunun nedenini net bir şekilde görebiliyorsunuz. Gerçekten modern, kaliteli bir müfredat.

Bugünün fiyatına göre 450 dolar. eWPT ile aynı fiyatta ve yılın bazı zamanlarında yüzde 50 indirimler oluyor. Sektörel olarak güçlü bir sertifika olduğunu düşünüyorum. Git secret taramalarından SSRF’ye, SSO’dan API hacking’e kadar siber güvenliğin bugününü ve yarınını test eden muazzam, hakkı verilmiş bir müfredat olduğunu düşünüyorum.

> **GENEL PUAN: 9 / 10**