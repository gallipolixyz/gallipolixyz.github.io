# Custom Log Source Normalization: SIEM Öncesi ve  Sonrası Tüm Aşamalar

**1\. Log Normalizasyon Nedir ve Neden Önemlidir?** 

Log normalizasyonu dediğimiz kavram farklı cihazlardan gelen karmaşık log verilerinin  ortak bir formatta SIEM sistemlerinin anlayabileceği bir yapıya dönüştürülmesidir. Her  sistem kendi yapısına göre log üretir. Bu loglar olayın ne zaman gerçekleştiği, hangi  kullanıcı veya IP’nin ilgili olduğu ile ilgili bilgiler içerir ama bu bilgiler her sistemde farklı  isimler ve farklı formatlarda tutulur. Örneğin aynı olayı anlatan iki farklı cihazın logunu  inceleyelim; 

```json
Firewall Logu: {
  "timestamp": "2025-07-26T11:00:00",
  "src_ip": "10.0.0.1",
  "dst_port": 443
} 
```
```json
Uygulama Logu: {
  "timestamp": "2025/07/26 11:00:00",
  "sourceAddress": "10.0.0.1",
  "port": 443
} 
```
Gördüğümüz gibi zaman alanı birinde `timestamp` iken diğerinde `time` , IP adresi kısmı  birinde `src_ip` iken diğerinde `sourceAddress` ve port kısımları ise birinde `dst_port` iken diğerinde `port` şeklindedir. SIEM sistemleri ise bu alanları otomatik analiz ettiği  için isimleri farklıysa IP adresinin nerede olduğunu anlayamaz ve bu da korelasyon  kurulamama, alarm kurallarının bozulması ya da görselleştirme hataları gibi çeşitli  hatalara sebep olur. Log normalizasyonunda da bu verileri ortak bir formata  dönüştürerek SIEM sisteminin tüm verileri tek bir formatta okuyabilmesini,  karşılaştırabilmesini ve anlamlandırabilmesini sağlar. 

**2\. Custom Log Normalization** 

Custom Log Source Normalization, SIEM sistemleri için standart dışı log kaynaklarından  gelen ham log verilerini, anlamlı, tutarlı ve analiz edilebilir standart bir yapıya dönüştürme işlemidir. Bu süreçte amaç ise farklı sistemlerin farklı biçimlerde ve  isimlendirmelerle ürettiği logları, tek bir ortak veri modeli altında birleştirerek, SIEM  tarafından anlaşılabilir ve yorumlanabilir hale getirmektir. Normalization ile veri tek  biçime getirilir, analiz doğruluğu artar, arama ve korelasyon kuralları daha kolay çalışır.  
**3\. Nasıl Yapılır ?** 

**1.Log Kaynağını ve Formatını Anlamak** 

İlk aşama olarak log verisinin yapısını, hangi bilgileri içerdiğini ve hangi formatta geldiğini  anlamamız gerekir. Öncelikle logların birkaç örneği alınır ve sabit mi yoksa değişken mi  diye kontrol edilir. İçerdiği IP, kullanıcı adı, işlem tipi, hata mesajı gibi bilgiler analiz edilir. 

**2.Veri Alanlarını Tanımlamak (Field Mapping)** 

Field mapping ham loglarda yer alan bilgilerle SIEM platformlarının kullandığı standart  veri alanları arasında bir bağ kurmaktır. Bu aşamada farklı kaynaklardan gelen logların  anlam birliği içinde karşılaştırılması, loglardaki her bir veri parçasının doğru yere  yerleştirilmesi ve SIEM’in sorgular, korelasyon kuralları, dashboardlar için kullanacağı  alanlara sahip olması amaçlanmaktadır. 

**Raw Field:** Log dosyasında görünen ham veri alanıdır. 

**Standard Field:** SIEM tarafından kullanılan standart alan adıdır. 

**Field Mapping:** Raw field ve standard field’ı birbirine eşleme sürecidir. Örneğin; 

\[2025-07-26 14:03:12\] \- `user=admin action=login status=fail ip=192.168.1.20` bu log satırı için field mapping örneği  

| Logtaki Alan  | Standart Alan |
| :---: | :---: |
| user=admin  | user.name |
| İp=192.168.1.20  | source.ip |
| action=login  | event.action |
| status=fail  | event.outcome |

Bu mapping işlemi sayesinde farklı log kaynakları aynı şema altında birleştirilir. 

**3.Parser Yazmak** 

Parser yazmak log normalizasyonunun ve SIEM entegrasyonunun en önemli  aşamalarındandır. Parser, ham log verisini parçalara ayırarak SIEM sisteminin  anlayabileceği anahtar-değer çiftlerine dönüştüren koddur. Log satırını okur, içindeki  bilgileri çıkarır, uygun alan adlarıyla etiketler. Parser yazmamızın amacı loglardan  anlamlı veriler çıkarma, farklı log formatlarını normalize etmektir. 

**Kullanılan Yöntemler:**  
**Regex (Regular Expression)** → Logtan veri çıkarmak için kullanılır. 

**Grok** (Logstash, Wazuh vb.) → Regex’in sade hali. 

**JSON/XML Parsers** → Eğer loglar bu formatta ise hazır modüllerle ayrıştırılır. Kendi scriptinizi yazmanız gerekebilir. 

**4.Verileri Test Etmek ve Doğrulamak** 

Parser’ın doğru çalışıp çalışmadığını test etmek için bu aşamaya geçeriz. Bu aşamada : \-SIEM arayüzünde parser çıktıları gözlemlenir. 

\-Her alanın doğru parse edilip edilmediği kontrol edilir. 

\-Hatalı veya eksik parse edilen alanlar düzeltilir. 

**5.Event Categorization ve Standart Alanlara Dönüştürme** 

Normalize edilen log verilerinin, anlamlı kategorilere ayrılması ve standart (vendor neutral) alanlara oturtulmasıdır. 

Peki Neden Loglar Kategorize Edilir? 

Farklı sistemlerin ürettiği loglar farklı formatlara ve terminolojiye sahiptir. Örneğin, bir  firewall `src_ip` derken, bir web sunucusu `client_ip` kullanabilir. SIEM gibi platformların  bu farklı logları ortak bir çatı altında işleyebilmesi için, log alanlarının standardize  edilmesi ve anlamlı kategorilere ayrılması gerekir. Bu kategorilere ayırırken bazı  standartlar kullanırız: 

• **MITRE ATT\&CK**: Tehdit aktörlerinin davranışlarını sınıflandırmak için kullanılır. • **Elastic Common Schema (ECS)**: Elastic SIEM için alan standardı. 

• **Common Event Format (CEF)** ve **LEEF**: SIEM'ler arası veri uyumluluğu için yaygın  formatlardır. 

**6.Logları SIEM’e Gönderme** 

Bu aşamada normalize edilmiş ve kategorize edilmiş loglar, analiz ve korelasyon için bir  SIEM platformuna gönderilmelidir. 

**Yaygın Log Gönderim Yöntemleri:** 

**1.Syslog:** Syslog, cihazlardan (firewall, router, switch, Linux sunucu vb.) log mesajlarını  merkezi bir log sunucusuna göndermek için kullanılan yaygın bir protokoldür. Hem UDP  hem de TCP kullanılabilir, modern yapılandırmalarda TLS desteklidir. Genellikle format  şu şekildedir:  
\<PRI\>TIMESTAMP HOSTNAME APP\-NAME PROCID MSGID MESSAGE 

**2\. Filebeat:** Filebeat, Elastic Stack içerisinde kullanılan hafif bir log forwarderdır. Dosya  temelli logları merkezi bir sisteme gönderir. 

**3.Logstash:** Logstash, logları alır, filtreler, dönüştürür sonra başka bir yere gönderir. 

**4.Fluentd / Fluent Bit:** Cloud-native mimarilerde çok tercih edilen log toplama ve  yönlendirme araçlarıdır. Fluent Bit daha hafif bir versiyonudur. 

**5.Agent Tabanlı Yöntemler:** Özellikle Windows sistemlerde Event Log’ları SIEM’e  gönderme için idealdir. Sistemde log toplama dışında denetim (audit) yapılabilir. 

**6.API ile Log Gönderimi**: Özellikle bulut servislerden ya da uygulamalardan log  gönderimi için RESTful API kullanılabilir. 

**7.Windows Event Forwarding:** Domain’e bağlı sistemlerde Windows Event log’larını  merkezi olarak toplamak için kullanılır. 

**8\. Kafka/MQ Tabanlı Sistemler:** Büyük ölçekli yapılarda log akışını kuyruk tabanlı  sistemlerle yönetmek için Kafka, RabbitMQ gibi sistemler kullanılabilir. 

**7.Korelasyon**  

Tek bir log çoğu zaman bir saldırı için yeterli ipucu vermez. Ancak farklı loglar  birleştirildiğinde, örüntüler (patterns) ortaya çıkabilir. İşte korelasyon bu noktada  devreye girer ve parçalanmış veriyi birleştirerek anlam çıkarır, farklı sistemlerden gelen  sinyalleri ilişkilendirir, sahte pozitifleri azaltıp gerçek tehditleri öne çıkarır. 

Örnek bir Korelasyon Kuralı: 

Aynı IP adresinden 10 dakika içinde 5 başarısız giriş ve ardından 1 başarılı giriş varsa: 

`if count(failed\_login from src\_ip) \>= 5`
`and count(successful\_login from same src\_ip) \>= 1`
`within 10 minutes`

**then raise alert("Possible brute force attack")** 

Bu kurallar sayesinde SIEM, sadece log toplamakla kalmaz olaylar arasında ilişkiler de kurar. 

**Korelasyon Türleri:** 

Zaman Tabanlı: Belirli süre içinde aynı olay tekrarları  
Alan Tabanlı: Aynı IP, kullanıcı ya da port bilgisinin tekrarı 

Davranışsal: Kullanıcının alışılmadık hareketleri ( örneğin gece SSH bağlantısı gibi ) 

**8.Dashboard ve Alert Kullanımı** 

**Dashboard Nedir?** 

SIEM üzerinde loglardan üretilen verilerin grafiksel olarak görselleştirilmiş halidir.  Genellikle anlık güvenlik durumu hakkında özet bilgi verir. Dashboard; en çok login  denemesi yapan kullanıcılar, şüpheli IP adresleri, zaman bazlı log yoğunluğu ve ülke  bazlı saldırı dağılımından oluşur. 

**Alert Nedir?** 

SIEM'de tanımlanan korelasyon kurallarına göre tetiklenen otomatik güvenlik uyarılarıdır.  SOC ekipleri bu alarmlara göre aksiyon alır. Alert; tetikleme zamanı, ilgili kullanıcı veya IP  bilgisi, severity ve olayın kısa açıklamasını içerir. 

**4\. Sonuç** 

Özel log kaynaklarının SIEM sistemlerine entegre edilmesi, sadece veriyi toplamakla  bitmeyen, dikkatli planlama ve teknik bilgi gerektiren çok adımlı bir süreçtir. Bu süreçte  log normalizasyonu, field mapping, parser geliştirme, event kategorileme, SIEM  entegrasyonu, korelasyon kuralları yazımı ve dashboard/alert sistemlerinin kurulumu bir  bütün olarak ele alınmalıdır. 

Her sistem farklı konuşur; birinin `src_ip` dediğine diğeri `client_address` diyebilir. İşte  bu yüzden, SIEM’in evrensel bir dili konuşması gerekir. Bu dili sağlamak, normalize  edilmiş, kategorize edilmiş ve ilişkilendirilebilir log verileri ile mümkündür. Loglar  anlamlı hale geldikçe korelasyonlar kuvvetlenir, tehditler daha erken fark edilir,  müdahale süreleri kısalır ve kurum güvenliği somut şekilde iyileşir.