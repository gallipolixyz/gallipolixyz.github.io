# C2 Framework Nedir? Amaçları, Faydaları ve En Popüler C2 Araçları

Siber güvenlik saldırılarının perde arkasındaki asıl silah: **C2 Frameworkleri.** Saldırganın sisteminiz üzerindeki kontrolünü sürdürmesini sağlayan bu yapıları tanımak, savunma tarafı için büyük avantaj sağlar. Bu yazıda, bir **C2 (Command and Control) frameworkü nedir**, neden kullanılır ve hangi araçlar sektörde öne çıkıyor, hepsini teknik yönleriyle anlatacağım.

## **İçindekiler Tablosu**

* C2 Framework Nedir?

* C2 Frameworklerinin Amacı Nedir?

* C2 Frameworklerinin Faydaları Nelerdir?

* En Popüler C2 Frameworkleri Nelerdir?

## **C2 Framework Nedir?**

C2 (Command and Control) frameworkü, bir saldırganın hedef sistemlerle iletişim kurmasını ve onları uzaktan yönetmesini sağlayan **yazılım altyapısıdır.**

C2 frameworkleri, zararlı yazılım yüklendikten sonra saldırganın:

* Sistemde komut çalıştırmasına,

* Dosya transferi yapmasına,

* Ekran görüntüsü almasına,

* Keylogger gibi işlemler gerçekleştirmesine,

imkân tanır. Temelde, **saldırganın uzaktaki cihaza sanki yerel makinesiymiş gibi erişmesini sağlar.**

## **Bir C2 Frameworkünün Amacı Nedir?**

Bir saldırgan için C2 framework kullanmanın temel amaçları:

* **Uzaktan Erişim:** Cihaza fiziksel temas olmadan yönetim sağlar.

* **Otomasyon:** Tekrarlanan işlemler (örneğin, beacon gönderme, bilgi toplama) otomatik yapılabilir.

* **Çoklu İstemci Yönetimi:** Birden fazla ele geçirilmiş cihazı tek bir panelden kontrol edebilme.

* **Komut Modülleri:** Sistem komutları, PowerShell scriptleri, özel payloadlar gönderebilme.

* **Gizlenme:** HTTPS, DNS, custom protocol gibi farklı iletişim yolları sayesinde tespit edilmeden çalışabilme.

Kısaca, bir C2 frameworkü saldırgana **komuta merkezi** sağlar.

## **Bir C2 Frameworkünün Faydaları Nelerdir?**

Saldırganlar açısından C2 frameworklerinin avantajları:

*  **Kolay kullanım:** Web tabanlı veya CLI arayüzler sayesinde hızlı yönetim.

*  **Esneklik:** Modüler yapıları sayesinde yeni işlevler eklenebilir.

*  **Gizlilik:** Trafik şifreleme (SSL/TLS), custom protocol kullanımı.

*  **Otomatik Beaconing:** Belirlenen aralıklarla hedef sistemin C2 sunucusuna bağlanması.

*  **Dosya yükleme/çekme, ekran görüntüsü alma gibi temel yetenekler.**

**Defans tarafı için:** C2 frameworklerinin nasıl çalıştığını anlamak, saldırganın varlığını daha hızlı tespit etmek demektir.

## **En Popüler C2 Frameworkleri Nelerdir?**

* ### [Cobalt Strike](https://www.cobaltstrike.com/)

* ### [Sliver](https://bishopfox.com/tools/sliver) 

* ### [Mythic](https://docs.mythic-c2.net/) 

* ### [Brute Ratel C4](https://bruteratel.com/)

* ### [Pupy C2](https://hunt.io/malware-families/pupy-c2)

![image1](/blogs/img/c2-framework-nedir/image1.png)

### **Cobalt Strike**

![image2](/blogs/img/c2-framework-nedir/image2.png)

* En bilinen ticari C2 frameworküdür.

* **Beacon** adı verilen ajanlar kullanır.

* HTTPS, DNS, SMB gibi farklı iletişim kanalları desteklenir.

* Mimikatz, PowerShell modülleri, pivoting gibi özellikler barındırır.( Blue Team tarafında da en çok simülasyon yapılan framework.)

### **Sliver**

![image3](/blogs/img/c2-framework-nedir/image3.png)

* Açık kaynak ve ücretsizdir.

* Golang tabanlıdır, Linux/Mac/Windows desteği sunar.

* Komut modülleri, otomatize edilmiş implantlar ve HTTP/DNS/MTLS desteği bulunur.

### **Mythic** 

![image4](/blogs/img/c2-framework-nedir/image4.png)

* Python tabanlı modern bir framework.

* Web arayüzünden ajan yönetimi yapılabilir.

* Docker desteğiyle hızlı kurulum.

* HTTP, HTTPS, DNS gibi protokollerle iletişim sağlar.

### **Brute Ratel C4**

![image5](/blogs/img/c2-framework-nedir/image5.png)

* Cobalt Strike’a alternatif olarak çıkan, gelişmiş gizlilik odaklı bir framework.

* Modern tespit sistemlerinden kaçmak için özel olarak optimize edilmiştir.

* Oldukça güçlü OPSEC özelliklerine sahiptir.

### **Pupy C2**

![image6](/blogs/img/c2-framework-nedir/image6.png)

* Python tabanlıdır.

* Fileless payload çalıştırma desteği sunar.

* TCP, HTTP, WebSocket, DNS gibi protokoller üzerinden C2 bağlantısı kurar.

## **Sonuç**

Bir C2 frameworkünün nasıl çalıştığını anlamak, saldırıları tespit ve engelleme konusunda büyük fark yaratır. Özellikle SOC analistleri, tehdit avcıları ve IR ekiplerinin en popüler frameworklerin ağ davranışlarını öğrenmeleri kritik öneme sahiptir.