#  Ağ Güvenliği Cihazları 


## 1) Firewall
![](/blogs/img/network-devices/firewall.jpg)

### Ne İşe Yarar?
Ağ trafiğini gelen ve giden yönlü olarak kontrol eden, önceden tanımlanmış kurallara göre trafiğe izin veren veya engelleyen ilk savunma hattıdır.

### Stateful vs NGFW (Next-Generation) Farkı:
* **Stateful Firewall:** Trafiğin sadece kaynak/hedef IP'sine, portuna ve bağlantının durumuna bakar. Paket içeriğini okuyamaz ama kimin kiminle ne zaman konuşma başlattığını çok iyi bilir.
* **NGFW (Next-Generation):** Stateful özelliklerinin üzerine; Uygulama Tanıma (Application Awareness), Kullanıcı Kimlik Tanıma, Derin Paket İnceleme (DPI) ve entegre IPS özelliklerini ekler. Örneğin port 80'i kapatmak yerine, o porttan geçen uygulamayı engelleyebilir.

### Hangi Katmanda Çalışır?
* **Stateful:** 3. Katman (Network Layer) ve 4. Katman (Transport Layer).
* **NGFW:** 3. Katman (Network Layer), 4. Katman (Transport Layer) ve 7. Katman (Application Layer).

### Hangi Saldırıları Durdurur?
Yetkisiz erişimler, port taramaları, IP spoofing (sahteciliği) ve kural dışı ağ bağlantıları.

---

## 2) WAF (Web Application Firewall)
![](/blogs/img/network-devices/waf.jpg)


### Ne İşe Yarar?
Sadece web uygulamalarını (HTTP/HTTPS trafiğini) korumak için özelleşmiş bir güvenlik duvarıdır. Gelen HTTP isteklerini derinlemesine inceler.

### Hangi Katmanda Çalışır?
7. Katman (Application Layer).

### Hangi Saldırıları Durdurur?
OWASP Top 10 riskleri başta olmak üzere SQL Injection, XSS, File Inclusion ve sitelere yönelik DDoS saldırıları.

---

## 3) IDS/IPS (Intrusion Detection/Prevention System)
![](/blogs/img/network-devices/ids-ips.png)

### Ne İşe Yarar?
Ağ trafiğini bilinen imzalara veya anomalilere karşı sürekli tarar.
* **IDS (Tespit Sistemi):** Sadece trafiği izler ve bir saldırı gördüğünde alarm üretir.
* **IPS (Önleme Sistemi):** Saldırıyı gördüğü an trafiği keser ve engeller.

### Hangi Katmanda Çalışır?
3. Katman (Network Layer), 4. Katman (Transport Layer) ve 7. Katman (Application Layer).

### Hangi Saldırıları Durdurur?
Bilinen exploitleri, brute force saldırıları, ağ tabanlı solucanlar ve DoS saldırıları.

---

## 4) SIEM (Security Information and Event Management)
![](/blogs/img/network-devices/siem.jpg)


### Ne İşe Yarar?
Ağdaki tüm cihazlardan (Firewall, Windows, Linux, Switch vb.) logları toplar, anlamlandırır ve korelasyon kuralları sayesinde şüpheli durumları tespit edip alarm üretir.
* *Örnek Senaryo:* "A kullanıcısı 5 dakikada 20 farklı sunucuya hatalı şifre girdi ve hemen ardından giriş yapabildi" alarmı.

### Hangi Katmanda Çalışır?
Katmandan bağımsız çalışır.

### Hangi Saldırıları Durdurur?
Doğrudan bir saldırıyı engellemez. SOC Analistinin alarmları inceleyerek aksiyon almasını sağlar.

---

## 5) SOAR (Security Orchestration, Automation, and Response)
![](/blogs/img/network-devices/soar.png)


### Ne İşe Yarar?
SIEM'den veya diğer sistemlerden gelen alarmları alır ve insan müdahalesine gerek kalmadan, önceden yazılmış senaryolarla (Playbook) otomatik olarak yanıtlar.
* *Örnek Senaryo:* "Zararlı IP tespit edildiğinde otomatik olarak Firewall'a kural yaz ve o IP'yi engelle".

### Hangi Katmanda Çalışır?
Katmandan bağımsız çalışır.

### Hangi Saldırıları Durdurur?
SOAR, özellikle hızlı yayılma eğiliminde olan, kural tabanlı ve insan müdahalesi yetişene kadar felakete yol açabilecek saldırı türlerini durdurur. Phishing, Ransomware, Brute Force, DDoS...

---

## 6) EDR/XDR (Endpoint Detection and Response)
![](/blogs/img/network-devices/edr-xdr.jpg)


### Ne İşe Yarar?
* **EDR:** Sunucu ve kullanıcı bilgisayarları gibi uç noktalarda şüpheli aktiviteleri izleyen, kaydeden ve gelişmiş tehditleri tespit edip izole eden sistemdir.
* **XDR (Extended Detection and Response):** EDR'ın evrimleşmiş halidir. Sadece uç noktayı değil ağ, bulut, e-posta ve kimlik verilerini de birleştirerek merkezi ve korele bir analiz sunar.

### Hangi Katmanda Çalışır?
Katmandan bağımsız çalışır.

### Hangi Saldırıları Durdurur?
Phishing, Ransomware, Brute Force, DDoS...

---

## 7) Proxy / Secure Web Gateway (SWG)
![](/blogs/img/network-devices/proxy.jpg)


### Ne İşe Yarar?
Şirket içi kullanıcıların internete çıkışını güvenli hale getirir. URL filtreleme yapar, zararlı sitelere girişi engeller ve kullanıcıların internet trafiğini optimize eder veya anonimleştirir.

### Hangi Katmanda Çalışır?
7. Katman (Application Layer).

### Hangi Saldırıları Durdurur?
Phishing sitelerine erişim, komuta kontrol merkezleri (C2) ile kurulan bağlantılar ve zararlı yazılım barındıran sitelerden dosya indirilmesi.

---

## 8) DLP (Data Loss Prevention)
![](/blogs/img/network-devices/dlp.jpg)


### Ne İşe Yarar?
Kurumun hassas verilerinin (kredi kartları, KVKK verileri, kaynak kodlar vb.) yetkisiz kişilerce dışarı sızdırılmasını engeller.

### Hangi Katmanda Çalışır?
7. Katman (Application Layer).

### Hangi Saldırıları Durdurur?
İç tehditler, veri hırsızlığı ve casusluk aktiviteleri.

---

## 9) NAC (Network Access Control)
![](/blogs/img/network-devices/nac.jpg)


### Ne İşe Yarar?
Ağa kablolu veya kablosuz olarak bağlanmak isteyen cihazları kimlik doğrulamasından geçirir ve şirketin güvenlik politikalarına uyup uymadığını kontrol ederek ağa alır veya karantinaya ayırır.
* *Örnek Kontroller:* Antivirüsü güncel mi? Windows güncellemeleri yapılmış mı?

### Hangi Katmanda Çalışır?
2. Katman (Data Link Layer) ve 3. Katman (Network Layer).

### Hangi Saldırıları Durdurur?
Rogue Device (Yetkisiz Cihaz) Girişleri, MAC Spoofing (MAC Adresi Taklidi), Yanal İlerleme (Lateral Movement - İç Tehdit), Man-in-the-Middle (MitM)...

---

## 10) Honeypot (Bal Küpü)
![](/blogs/img/network-devices/honeypot.png)


### Ne İşe Yarar?
Saldırganları yanıltmak, dikkatlerini gerçek sistemlerden uzaklaştırmak ve saldırı yöntemlerini incelemek için bilerek zafiyetli bırakılmış tuzak sistemlerdir.

### Hangi Katmanda Çalışır?
7. Katman (Application Layer).

### Hangi Saldırıları Durdurur?
Saldırganı yavaşlatır, erken uyarı sağlar ve Zero-day saldırılarının analiz edilmesine yardım eder.

---

## 11) Email Security Gateway
![](/blogs/img/network-devices/email.png)


### Ne İşe Yarar?
Şirkete gelen ve şirketten giden tüm e-postaları tarar. Spam, kimlik avı (phishing) ve zararlı ek barındıran e-postaları daha kullanıcının kutusuna düşmeden engeller veya karantinaya alır.

### Hangi Katmanda Çalışır?
7. Katman (Application Layer).

### Hangi Saldırıları Durdurur?
Phishing, Spear Phishing, Malware & Ransomware, Spam ve Graymail...

---

## 12) Network Segmentation
![](/blogs/img/network-devices/netseg.png)


### Ne İşe Yarar?
Büyük bir ağı daha küçük, birbirinden yalıtılmış alt ağlara (VLAN'lar) bölme işlemidir. 
* *Örnek Uygulama:* Muhasebe departmanı ile misafir Wi-Fi ağının veya kameraların aynı ağda olmaması sağlanır.

### Hangi Katmanda Çalışır?
2. Katman (Data Link Layer) ve 3. Katman (Network Layer).

### Hangi Saldırıları Durdurur?
Saldırganın ağa sızdıktan sonra diğer bilgisayarlara sıçramasını, yani Lateral Movement (Yanal İlerleme) hamlesini durdurur veya sınırlandırır.

---