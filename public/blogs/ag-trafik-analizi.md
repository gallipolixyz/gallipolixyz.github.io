# Ağ Trafik Analizi

Ağ-Trafik-Analiz kelimelerini teker teker açarak başlayalım.
Ağ; bilgisayarların, sunucuların, telefonların ve diğer cihazların birbiriyle konuşabilmek için bağlandığı **dijital yollar ve altyapıdır**.Bu dijitalle yollar üzerinde cihazların birbirine gönderdiği her türlü veri ise trafik olarak adlandırılır.Bir web sitesine girişinden, WhatsApp'tan gönderdiğin mesaja, bir dosya indirmen veya arka planda çalışan bir güncellemeye kadar her şey birer trafik oluşturur.Ağdan geçen bu veri paketlerini durdurup incelediğimiz,ne olduklarını anlama sürecini de analiz olarak adlandırırız.Yani ağ trafiği analizinin; birden fazla bilgi kaynağını birleştirmeye, bunları analiz etmeye, kalıpları (pattern) bulmaya ve elde edilen sonuçları eylemleri yönlendirmek için kullanmaya odaklandığını söyleyebiliriz.

## Ağ Trafiğini Analiz Etmeye Neden İhtiyaç Duyarız?

Ağda ki trafiği analiz etme ihtiyacını tek bir sebepe indirgeyemeyiz.Bu analiz genel olarak , ağ performansını optimize etmek, güvenlik açıklarını ve tehditleri belirlemek ve ağ kullanım trendlerini anlamak için kullanılır.Aynı zaman da Anormallik tespiti,Uyumluluk Raporlama,Monitörleme,Botnet Aktiviteleri alanlarında da Ağ Trafik Analizi önemlidir biraz bu alanlardan bahsedelim.

### Anormallik Tespiti

Bir ağda neyin "anormal" olduğunu anlamak için önce neyin **"normal"** olduğunu bilmek gerekir. Ağ analistleri önce ağın günlük ritmini (Baseline) öğrenir.Mesela;

**Şirket çalışanları her gün 09:00 - 18:00 arası çalışır, ortalama web sitelerine girer ve mesai bitince trafik düşer. Normal profil budur.Gerçek Bir muhasebe bilgisayarı gece saat 03:00'te aniden Rusya'daki bilinmeyen bir IP adresine durmaksızın veri göndermeye başladı diyelim. Bu durum belirlenen "normallik" profiline tamamen aykırıdır. Normallik tespiti sayesinde sistem daha saldırı tamamlanmadan, erken aşamada alarm üretir.**

### Uyumluluk Raporlama

Siber güvenlik sadece teknik bir mesele değildir; aynı zamanda yasal bir zorunluluktur (KVKK, GDPR, ISO 27001, PCI-DSS gibi).

**Yasal düzenlemeler şirketlere *"Müşteri verilerini koruyor musunuz? Ağınızda şifresiz veri dolaşıyor mu? Geçmişe dönük ağ kayıtlarını tutuyor musunuz?"* diye sorar.**

**Bir denetçi (auditor) geldiğinde ona lafla "Güvendeyiz" diyemezsin. Ağ trafiği analizi araçlarıyla oluşturulan raporları sunarsın: *"Bakın, ağımızda kredi kartı bilgileri şifresiz (HTTP) iletilmiyor, tüm trafik TLS ile şifreli ve son 1 yıllık bağlantı loglarımız güvenli şekilde saklanıyor."* İşte bu belgeleme sürecine uyumluluk raporlama denir.**

### Monitörleme

Ağın canlı olarak izlenmesi ve yolunda gitmeyen durumların yakalanmasını ifade eder. 

Üç kritik noktaya bakar:Standart Dışı Portlar,Şüpheli Kaynaklar,Ağ Protokol Arızaları.

Şimdi bu kavramlara da göz atalım.

**Standart Dışı Portlar:** Normalde web trafiği Port 80 (HTTP) veya Port 443 (HTTPS) üzerinden akar. Eğer bir bilgisayar Port 4444 veya Port 31337 üzerinden dışarıyla yoğun bir şekilde konuşuyorsa, bir saldırgan arka kapı (Backdoor) açmış demektir.

**Şüpheli Kaynaklar :** Bilinen zararlı IP adresleri, itibar puanı düşük (Malicious Reputational) domainler veya zararlı yazılım dağıtan sunucularile ağdaki bir cihazın iletişime geçip geçmediği izlendiği kısım.

### **Ağ Protokol Arızaları (HTTP Hataları & TCP Sorunları)**

*HTTP Hataları:* Bir web sunucusu aniden binlerce `500 Internal Server Error` veya `404 Not Found` yanıtı dönmeye başladıysa; bir saldırgan dizin taraması (directory bruteforce) yapıyor veya sunucuyu çökertmeye çalışıyor olabilir.

*TCP Sorunları:* Ağda sürekli kopan bağlantılar (TCP RST), yanıtlanmayan istekler (TCP SYN Flood) veya paket kayıpları varsa hem bir performans sorunu hem de olası bir DoS/DDoS saldırısı var demektir.

### Botnet Aktiviteleri ve Uzaktan Erişim Saldırılarının Tespiti

Zararlı yazılım bulaşmış binlerce cihazın tek bir merkezden yönetildiği yapılara **Botnet** deriz.
**Botnet Tespiti:** Ağdaki bir bilgisayarın her 10 dakikada bir dışarıdaki şüpheli bir IP'ye tek bir paket atıp *"Ben buradayım, yeni bir talimat var mı?"* (Beaconing) demesi durumunun Trafik analizi ile bu düzenli ve küçük paket hareketleri yakalanması..

**Uzaktan Erişim Saldırısı:** Bir saldırgan ağa sızdıktan sonra yetkisiz bir şekilde RDP (Remote Desktop) veya SSH kullanarak diğer sunuculara uzaktan bağlanmaya çalışabilir. Analiz araçları, mesai saatleri dışında veya yetkisiz bir kullanıcıdan gelen bu uzaktan erişim isteklerini anında tespit edebilir.

***Şuana kadar ağ-trafik-analiz nedir ve neden ihtiyaç duyarız kısmını konuştuk,şimdi ise direkt olarak analizi gerçekleştiren araçları kullanmaya başlamayalım, öncesinde biz ağdaki trafik analiziyle neleri gözlemleyebiliriz,nasıl gözlemleyebiliriz,neyi gözlemleyeceğiz süreçlerini konuşalım.Ama buradan itibaren ki sürecin iyice kavranabilmesi için ağ temelleri hakkında bilgi sahibi olmamız önemli.Ağ trafiğini gözlemlemenin en anlaşılır yolu TCP-IP modelidir.Neden? Çünkü modelde ki her katman veriyi bir sonraki katmana aktarabilmek için her veriye başlık tanımlar,bu başlıklar da tam olarak gözlemlemek istediğimiz verilerdir.TCP-IP modeliyle devam edelim.***

### Uygulama Katmanı (Application)

Bu katman, hem uygulamanın kendi başlık (Header) bilgilerine hem de taşınan asıl veriye (**Payload**) erişebildiğimiz alandır. Verinin içeriğine erişilip erişilemeyeceği, kullanılan uygulama katmanı protokolüne (HTTP, FTP, DNS vb.) ve verinin şifreli (TLS/SSL) olup olmadığına göre değişiklik gösterir.

#### **Başlık (Header) ve Yük (Payload) Nedir?**

Kurumsal bir ağda Güvenlik Duvarı (Firewall) veya Web Proxy cihazları, ağ trafiğini izlerken yüksek bant genişliğinde sistem kaynaklarını (CPU, disk) tüketmemek adına kural olarak verinin tamamını değil, sadece **Başlık (Header)** bilgilerini günlük kayıtlarına (log) işler.

**Peki, standart bir log kaydı bize tam olarak neleri söyler?**

- **Kim istedi?** Belirli bir istemci veya tarayıcı imzası (`User-Agent`).
- **Neyi istedi?** Sunucudan talep edilen dosya veya kaynak yolu (`GET /download/update.zip`).
- **Sonuç ne oldu?** Sunucunun döndürdüğü yanıt kodu (`200 OK` - İstek başarılı, dosya gönderildi).
- **Dosya türü ve boyutu nedir?** İçeriğin MIME tipi ve bayt değeri (`Content-Type: application/zip`, `Content-Length: 10485760` / ~10 MB).

Bir SOC analisti log kayıtlarını incelediğinde şunu net olarak görür: *"Kullanıcı `update.zip` adında şüpheli bir dosyayı başarıyla indirmiş."*Ancak standart loglar sana **en kritik sorunun yanıtını veremez:** O ZIP dosyasının içinde ne var? İçindeki kod zararlı bir yazılım mı, şifrelenmiş bir Trojan mı, yoksa tamamen zararsız bir metin dosyası mı?İşte tam bu noktada devreye giren ve dosyanın asıl içeriğini oluşturan kısım **Payload**'dur.

**Ağ Trafiği Analizi** gerçekleştirdiğinde ise, ağdan geçen ham veriyi anlık olarak yakalama şansı elde edersin. Böylece o ZIP dosyasının tüm baytlarını (payload) ağ paketlerinin içinden ayıklayıp (**extract** edip) kendi bilgisayarına çıkarabilir; ardından derinlemesine incelemek üzere zararlı yazılım analiz araçlarına aktarabilirsin.

### Taşıma Katmanı (Transport)

Uygulama katmanından gelen veri ve başlık bilgisi, Taşıma Katmanı’nda (Transport Layer) ağ ortamında taşınabilecek standart boyutlara bölünür (**segmentation**) ve kapsüllenir (**encapsulation**). Oluşturulan her bir parçaya, çoğunlukla TCP veya UDP protokollerine ait taşıma katmanı başlığı (Header) eklenir.

TCP başlığında yer alan veri akış sırası (**Sequence Number - Seq**) ve onay numaraları (**Acknowledgment Number - Ack**), ağ trafiği analizinde kritik bir role sahiptir. Örneğin; bir oturum çalma (**Session Hijacking**) saldırısı, paketlerdeki sıra numaralarının takibi ve analizi sayesinde tespit edilebilir.

**Peki bu tespit pratikte nasıl yapılır? Gelin bunu somut bir senaryo üzerinden inceleyelim:**

Bir kullanıcı (`10.0.0.50`), banka sunucusuna (`192.168.1.100`) bağlanmış ve aktif bir oturum üzerinden işlem yapmaktadır. TCP protokolü gereği, taraflar arasındaki veri akışı ve paket sırası **Sequence (Seq)** ve **Acknowledgment (Ack)** numaralarıyla anlık olarak takip edilir.
• **Paket 1 (Kullanıcıdan Bankaya):** Kullanıcı, bankaya 500 baytlık bir istek gönderir.
`Source: 10.0.0.50 | Destination: 192.168.1.100 | Seq = 1000 | Len = 500`
• **Paket 2 (Bankadan kullanıcıya):** Banka sunucusu 500 baytlık veriyi aldığını doğrular ve bir sonraki pakette kurbandan hangi sıra numarasını beklediğini bildirir.
`Source: 192.168.1.100 | Destination: 10.0.0.50 | Ack = 1500 (1000 + 500)`

Buraya kadar her şey normal seyrinde ilerlemektedir. Banka sunucusu, kullanıcıdan gelecek bir sonraki paketin `Seq = 1500` olmasını beklemektedir.
Aynı yerel ağda (LAN) yer alan bir saldırgan (`10.0.0.99`), kullanıcının oturumunu ele geçirmek (**TCP Session Hijacking**) amacıyla IP sahteciliği (**IP Spoofing**) yapar. Kendisini kurban bilgisayar (`10.0.0.50`) gibi göstererek banka sunucusuna sahte bir para transferi talimatı gönderir.
• **Paket 3 (Saldırı Paketi - Saldırgandan Bankaya):**
`Source: 10.0.0.50 (Spoofed) | Destination: 192.168.1.100 | Seq = 854000`  **(Rastgele / Tahmini Seq)**

• **Geleneksel Güvenlik Duvarı (Firewall) Loglarına Baksaydık:**
Güvenlik duvarı kayıtlarında sadece şu oturum bilgisi geçerdi:
`ACCEPT TCP src=10.0.0.50 dst=192.168.1.100 dport=443`
Güvenlik duvarları, paketlerin derinlemesine durum bilgilerini (TCP Seq/Ack takibi) log dosyalarına detaylıca kaydetmediği için bu isteği kurban kullanıcının gönderdiğini varsayar ve olayı tamamen **meşru bir trafik** olarak görür.

Derinlemesine paket analizi (DPI) yapıldığında; banka sunucusunun bir önceki pakette `1500` sıra numarasını beklediği, ancak aniden `854000` gibi tamamen mantıksız ve kopuk bir `Seq` numarasına sahip paketin ağa fırlatıldığı tespit edilir.
TCP sıra numaralarındaki (`Seq`) bu tutarsızlık, sapma ve ani sıçrama; ağa üçüncü bir şahsın müdahale ettiğini ve yürürlükteki bir TCP oturumunu gasp etmeye (**Session Hijacking**) çalıştığını **kesin ve somut bir delil olarak** kanıtlar.

### İnternet Katmanı (Internet)

Taşıma katmanından bir segment (Segment) İnternet Katmanı’na indiğinde, bu katman verinin başına kendi yönlendirme bilgilerini içeren **IP Başlığını (IP Header)** ekler.

Ancak fiziksel ağ ortamındaki kabloların, router'ların ve ağ kartlarının tek seferde taşıyabileceği maksimum bir paket boyutu sınırı vardır; buna **Maksimum İletim Birimi (MTU - Maximum Transmission Unit)** denir. Standart Ethernet ağlarında MTU değeri genellikle **1500 bayttır**.

Eğer gönderilmek istenen IP paketi ağın MTU sınırından büyükse, gönderen sistem veya yol üzerindeki bir router bu paketi mecburen daha küçük parçalara ayırır (**IP Fragmentation**). Ayrılan her bir parçaya (fragment) kendi IP başlığı eklenir ve paketin neresine denk geldiğini belirten **Fragment Offset** etiketi yapıştırılır.

Gönderilecek devasa bir metni tek bir zarfa sığdıramadığımızı varsayalım. Gönderen sistem metni sayfalara böler ve her parçanın üzerine rekonstrüksiyon (yeniden birleştirme) etiketi koyar:

- **Parça 1:** *"Bu 1. parçadır; 1 ile 100. baytlar arasını taşır."* (`Offset = 0`, `MF = 1` / More Fragments)
- **Parça 2:** *"Bu 2. parçadır; 101 ile 200. baytlar arasını taşır."* (`Offset = 100`, `MF = 0` / Son Parça)

Alıcı sistem (Destination Host), paketlerin üzerindeki bu **Offset** ve **Identification** değerlerine bakarak parçaları doğru sırayla birleştirir (**Reassembly**) ve veriyi eksiksiz olarak üst katmana teslim eder.

Saldırganlar, tespit sistemlerini (IDS/IPS) ve güvenlik duvarlarını atlatmak (evasion) amacıyla parçalama (fragmentation) mekanizmasını kötüye kullanırlar. En bilinen yöntemlerden biri **Teardrop** veya **Overlapping Fragment** saldırısıdır.

Saldırgan, hedef sisteme göndereceği zararlı payload'ın ilk parçasını tamamen zararsız görünümlü verilerle doldurur ve ağa salar:

- **Parça 1:** `Offset = 0 | Size = 100` *(Zararsız metin/kod)*
- **Ağ Güvenlik Cihazı (IDS/IPS):** 1. parçayı inceler, bilinen bir tehdit imzası bulamadığı için *"Temiz trafik, geçebilir"* diyerek kurbana iletir.

Saldırgan hemen ardından 2. parçayı gönderir ancak bu parçanın **Offset (başlangıç konumu)** değerini hileli bir şekilde ayarlar. Normalde 2. parçanın `100. bayttan` başlaması gerekirken, saldırgan offset değerini manüel olarak manipüle edip tekrar `0` yapar veya ilk parçanın üzerini örtecek şekilde geriye çeker. Asıl zararlı yazılım kodunu da bu 2. parçanın içine gizler:

- **Parça 2 (Saldırı Paketi):** `Offset = 0 | Size = 100` *(Zararlı Payload)*

Kurban bilgisayarın işletim sistemi (TCP/IP yığını), gelen parçaları yeniden birleştirirken (**Reassembly**) varsayılan davranış gereği son gelen veriyi öncekilerin üzerine yazar (**Overwrite**):

1. Önce temiz görünen 1. parçayı belleğe alır.
2. Ardından gelen hileli 2. parça, ilk temiz verinin tam üzerine yazılır.
3. **Sonuç:** Güvenlik duvarı ilk başta zararsız veriyi onaylayıp içeri almıştır; ancak kurban makinede birleşme tamamlandığında zararlı kod işletim sisteminin belleğinde çalışmaya hazır hale gelir.

Log kayıtlarında sadece temel iletişim bilgisi yer alır:

`ACCEPT IP src=192.168.1.50 dst=10.0.0.5 proto=IP`

Güvenlik duvarı logları, parçaların hangi offset değerleriyle geldiğini, baytların çakışıp çakışmadığını veya bellekte birbirinin üzerine yazılıp yazılmadığını **asla göstermez**.

Wireshark veya `tcpdump` ile canlı trafik yakalandığında; IP başlığındaki **Fragment Offset** değerlerinde tutarsızlık, çakışma (overlap) ve sıradışı parça davranışları anında tespit edilir. Böylece saldırı daha kurban makine üzerinde birleşip tetiklenmeden yakalanabilir.

### Bağlantı Katmanı (Link Layer)

İnternet ve Taşıma katmanlarında mantıksal IP adresleriyle ilgilenirken, yerel ağda (LAN) fiziksel veri iletiminin gerçekleşebilmesi için **Bağlantı Katmanı (Link Layer)** ve **MAC adresleri** devreye girer.Bu katmandaki en kritik zafiyet noktası, IP adreslerini MAC adreslerine dönüştüren **ARP (Address Resolution Protocol)** protokolünün tamamen güven esasına dayanması ve kimlik doğrulaması yapmamasıdır.Saldırganların yerel ağda araya girerek tüm trafiği dinlemesini sağlayan **ARP Zehirlenmesi (ARP Poisoning / MITM)** saldırısının tespiti, standart loglar ile paket analizi (NTA) arasındaki temel farkı en net gösteren örneklerden biridir.

#### **ARP Nedir ve Nasıl Çalışır?**

Ağdaki cihazlar uygulamalar seviyesinde IP adresleriyle haberleşir; ancak yerel ağda (Ethernet/Wi-Fi) verinin fiziksel olarak doğru ağ kartına ulaşabilmesi için **MAC adreslerine (Media Access Control)** ihtiyaç vardır.

**ARP (Address Resolution Protocol):** Dinamik olarak IP adresini MAC adresine dönüştüren Bağlantı Katmanı protokolüdür.**Standart Süreç (Request / Reply) şöyle işler:**

1. **ARP Request (Yayın / Broadcast):** Cihaz tüm ağa bağırır: *"192.168.1.10 IP adresi kimdeyse bana MAC adresini söylesin!"* (`FF:FF:FF:FF:FF:FF` adresine gönderilir).
2. **ARP Reply (Tekli / Unicast):** İlgili cihaz doğrudan yanıt verir: *"192.168.1.10 bende, MAC adresim `00:11:22:33:44:55`."*
3. Cihaz bu bilgiyi kendi **ARP Önbeleğine (ARP Cache Table)** kaydeder ve veri aktarımı başlar.

ARP protokolü tasarlanırken güvenlik ve kimlik doğrulama mekanizması düşünülmemiştir. Cihazlar, **kendileri bir talepte (Request) bulunmamış olsa bile** gelen ARP yanıtlarını sorgulamadan doğru kabul eder ve ARP tablolarını günceller.

Aynı ağdaki bir saldırgan (`192.168.1.200`), araya girmek (**Man-in-the-Middle / MITM**) için ağa sürekli sahte/talepsiz (**Unsolicited / Gratuitous**) ARP paketleri fırlatır:

- **Yönlendiriciye (Gateway / Modem) Yalan Söyler:** *"Ben `192.168.1.10`'um, MAC adresim `AA:BB:CC:DD:EE:FF` (kendi MAC'ini verir)."*
- **Kurbana Yalan Söyler:** *"Ben varsayılan yönlendiriciyim (`192.168.1.1`), MAC adresim `AA:BB:CC:DD:EE:FF` (yine kendi MAC'ini verir)."*

 Kurban ve Modem ARP önbelleklerini bu sahte verilerle zehirler. Artık kurbanın İnternet'e gönderdiği tüm paketler önce saldırganın bilgisayarına uğrar; saldırgan trafiği okur/değiştirir ve ardından modeme iletir.

Standart güvenlik duvarları, router'lar veya L2 Switch logları genellikle sadece anlık IP-MAC eşleşmelerinin **son halini** statik olarak tutar. Geleneksel loglarda şunları tespit edemezsin:

- Ağda durduk yere, kimseden talep (`Request`) gelmediği halde yayınlanan şüpheli **Unsolicited ARP Reply** paketlerini,
- Birkaç saniye içinde ağdaki farklı kritik IP adreslerinin (Gateway, DNS, Sunucular) birdenbire **tek bir MAC adresine** kilitlendiğini,
- Fiziksel ağ yolunun ve paket akış hatlarının saptırıldığını.

Ağ trafiğini `Wireshark` veya `Zeek` gibi NTA araçlarıyla canlı ve paket düzeyinde izlediğimizde:

- **Wireshark Uyarısı (ARP Poisoning Detection):** Wireshark'ın dahili analiz motoru durumu anında fark eder ve ekrana şu uyarıyı basar:
    
    `[Duplicate IP address configured... ]` veya `[Opcode: Reply (2) - Unsolicited]`
    
- **Tek MAC, Çoklu IP Tespiti:** Tek bir MAC adresinin (`AA:BB:CC:DD:EE:FF`) ağdaki tüm IP'lerin kimliğine bürünmeye çalıştığı bağlamı (context) ile birlikte yakalanır.

> ***Uygulama, Taşıma, İnternet ve Bağlantı katmanlarını bu perspektifle inceleyerek; Ağ Trafiği Analizinin (NTA) neden sadece bir log okuma işi olmadığını, aksine ham paketlerin (payload & header) davranışsal analizine dayanan hayati bir güvenlik katmanı olduğunu kavramış olduk.***
***Protokol katmanlarında paketlerin ne anlama geldiğini ve nasıl incelendiğini gördük. Peki, devasa kurumsal bir ağda şüpheli bir etkinliği tespit etmek istediğimizde analiz yapmaya nereden başlarız?***
> 

### Ağ Trafiğinin Sınıflandırılması: Kaynaklar ve Akışlar

SOC (Güvenlik Operasyon Merkezi) analistleri ve ağ mühendisleri, şüpheli hareketleri tespit ederken ve olay müdahalesi (Incident Response) yürütürken ağ trafiğini üreten ve işleyen yapıları temel olarak **iki ana kaynak altında** sınıflandırır: **Ağ Kaynakları** ve **Uç Nokta Kaynakları**.

![image.png](/blogs/img/ag-trafik-analizi/image.png)

#### **Ara Cihaz Kaynakları (Intermediary Sources)**

Ara cihazlar, ağdaki verinin üzerinden aktığı, yönlendirildiği, denetlendiği veya filtrelendiği köprülerdir. Temel işlevleri kendi başlarına içerik/veri üretmekten ziyade, trafiği bir noktadan diğerine güvenli ve kesintisiz şekilde taşımaktır.

Güvenlik Duvarları (Firewall), Anahtarlayıcılar (Switch), Yönlendiriciler (Router), Web Proxy’ler, Saldırı Tespit/Engelleme Sistemleri (IDS/IPS), Kablosuz Ağ Denetleyicileri (WLC) ve İnternet Servis Sağlayıcı (İSS) altyapıları.

Bu cihazlar, ağı ayakta tutmak, kendi durumlarını bildirmek ve topology haritasını güncel tutmak için çok az bant genişliği tüketen şu kritik protokolleri kullanırlar:

- **Yönlendirme Protokolleri (Routing):** OSPF, EIGRP, BGP *(Ağ haritasını ve en uygun veri yollarını dinamik günceller).*
- **Yönetim ve Sağlık Protokolleri:** SNMP *(Cihaz donanım/sağlık metriklerini izler)*, ICMP / Ping *(Erişilebilirlik ve gecikme kontrolü sağlar)*.
- **Loglama ve Haberleşme Protokolleri:** Syslog *(Olay ve güvenlik kayıtlarını merkezi SIEM sistemine iletir)*.
- **Temel Altyapı Protokolleri:** ARP *(IP-MAC adres eşlemesi)*, STP *(Fiziksel ağ döngülerini/loop engeller)*, DHCP *(İstemcilere otomatik IP dağıtır)*.

#### **Uç Nokta Kaynakları (Endpoint Sources)**

Uç noktalar, verinin doğrudan üretildiği (**Kaynak**) ve tüketildiği (**Hedef**) son noktalardır. Kurumsal ağlardaki toplam bant genişliğinin ve veri akışının ezici çoğunluğunu (**%90+**) bu cihazlar oluşturur.

Kullanıcı bilgisayarları (Workstation/Host), Veri Merkezi ve Bulut Sunucuları (Windows Server, Linux), Akıllı Cihazlar (IoT), Ağ Yazıcıları, Mobil Cihazlar (Telefon/Tablet).

Saldırganlar (Tehdit Aktörleri) doğrudan karmaşık güvenlik duvarlarına saldırmak yerine, genellikle en zayıf halka olan uç noktalara (örneğin oltalama e-postaları veya zararlı dosyalar ile kullanıcı bilgisayarlarına) sızarak **ağa ilk erişimi (Initial Access)** sağlarlar. İç ağa bir kez girdikten sonra da diğer sunuculara sıçramak (**Lateral Movement**) için yine uç noktaların iletişim yollarını kullanırlar.

### Ağ Akışları

Bir kurumsal ağdaki trafik akışı; kurumun mimarisine, çalıştırılan kritik servislere (Active Directory, SMB dosya paylaşımları, Veritabanları, Web uygulamaları) ve kullanıcı davranışlarına göre biçimlenir. SOC analistleri, ağdaki trafiği şüpheli hareketler açısından incelerken bu akışları **coğrafi yönüne ve erişim sınırlarına göre** iki ana başlık altında sınıflandırır:

![image.png](/blogs/img/ag-trafik-analizi/image1.png)

**1. Kuzey-Güney Trafiği (North-South Traffic)**

Kuzey-Güney trafiği, kurumsal iç ağ (LAN) ile dış dünya (WAN / İnternet veya Demilitarized Zone - DMZ) arasında gerçekleşen **dikey veri akışıdır**. Kurumsal mimaride bu trafiğin tamamı sınır güvenlik cihazlarından (Firewall, Web Proxy, NGFW) geçmek zorundadır.
İki ana yönde gerçekleşir:
• **Dışarıdan İçeriye (Ingress / Inbound):** Dış kullanıcıların veya İnternet'e açık sunucuların iç ağa yaptığı istekler.
• **İçeriden Dışarıya (Egress / Outbound):** Şirket çalışanlarının İnternet'e çıkışı veya iç ağdaki sistemlerin dış sunucularla haberleşmesi.

**2. Doğu-Batı Trafiği (East-West Traffic)**
Doğu-Batı trafiği, kurumsal iç ağın veya veri merkezinin kendi içinde (LAN $\leftrightarrow$ LAN, Sunucu $\leftrightarrow$ Sunucu veya Bulut Sanal Ağları arasında) gerçekleşen **yatay veri akışıdır**. Geleneksel ağlarda bu trafik ana sınır güvenlik duvarından geçmediği için genellikle **"güvenli iç ağ"** varsayımıyla daha az denetlenir ve izlenir.

**Doğu-Batı Trafiğinde İzlenen Kritik İç Ağ Servisleri**

Doğu-Batı trafiği incelenirken, iç ağda çalışan ve saldırganların istismar etmeye veya taklit etmeye en çok meyilli olduğu servisler şu ana kategorilerde izlenir:

• **Dizin, Kimlik Doğrulama ve Kimlik Servisleri (Identity & Directory Services):**
    ◦ **Kerberos / LDAP:** Active Directory üzerindeki kullanıcı kimlik doğrulamaları, bilet talepleri ve dizin sorguları *(Pass-the-Ticket veya Kerberoasting tespiti için hayati).*
    ◦ **RADIUS / TACACS+:** Ağ cihazlarına ve VPN'e erişim sağlayan merkezi kimlik denetimleri.
    ◦ **PKI / Sertifika Otoritesi (CA):** Dahili SSL/TLS sertifikalarının yönetimi ve doğrulanması.

• **Dosya Paylaşımı ve Yazıcı Servisleri (File Shares & Print Services):**
    ◦ **SMB / CIFS:** Ortak ağ sürücülerine erişim, dosya kopyalama ve uzaktan komut çalıştırma *(PsExec, Ransomware yayılımı ve zararlı dosya taşıma tespiti).*
    ◦ **IPP / LPD:** Ağ üzerinden yazdırma ve print spooler servisleri.

• **Altyapı ve Yönlendirme Servisleri (Infrastructure Services):**
    ◦ **DHCP & Internal DNS:** İstemcilerin otomatik IP alması ve iç ağdaki alan adlarının çözümlenmesi *(DNS Tunneling veya Rogue DHCP tespiti).*
    ◦ **ARP Broadcasts:** IP-MAC eşleşme yayınları *(ARP Poisoning ve MITM tespiti).*
    ◦ **Routing Protokolleri:** Router ve L3 Switch'ler arasındaki rota değişim mesajları.

• **Uygulama ve Veritabanı İletişimi (Application Communication):**
    ◦ **Veritabanı Bağlantıları:** Web/Uygulama sunucuları ile Veritabanı (MSSQL, PostgreSQL, Oracle) arasındaki TCP sorguları.
    ◦ **Mikroservis & API İletişimi:** İç ağdaki servislerin birbirleriyle konuştuğu REST, gRPC veya SOAP çağrıları.
• **Yedekleme, Çoğaltma ve Yönetim (Backup, Monitoring & Logs):**

    ◦ **Veri Çoğaltma (Replication):** Veri merkezleri veya veritabanları arası canlı senkronizasyon akışları (MySQL binlog, PostgreSQL streaming vb.).
    ◦ **İzleme ve Telemetri:** SNMP (cihaz sağlık kontrolü), Syslog (SIEM'e aktarılan ham loglar) ve NetFlow/IPFIX (akış metrikleri).

### **1. TLS İncelemeli HTTPS Akışı (TLS/SSL Inspection Flow)**

Standart HTTPS trafiği uçtan uca şifrelidir (End-to-End Encryption). İstemci ile dış dünyadaki web sunucusu arasındaki veri akışı şifreli bir tünel içinden geçtiği için, aradaki güvenlik cihazları (Firewall, IPS) paket içeriğini varsayılan olarak göremez (**Kör Nokta / Blind Spot**). Tehdit aktörleri de bu durumu fırsat bilip zararlı yazılım indirme (Malware Payload), Komut Kontrol haberleşmesi (C2) ve veri sızdırma (Data Exfiltration) faaliyetlerini HTTPS tünellerinin içine gizler.
Bu kör noktayı ortadan kaldırmak için kurumsal ağlarda **TLS Inspection (SSL İnceleme / Decryption)** mimarisi uygulanır. Bu işlem, meşru ve kontrollü bir **Man-in-the-Middle (MITM)** mekanizmasıdır.

Kullanıcı bilgisayarı dış dünyadaki `[https://example.com](https://example.com)` adresine gitmek için bir istek başlatır. Trafik ağ sınırından çıkarken **NGFW (Yeni Nesil Güvenlik Duvarı)** veya **Web Proxy** cihazı bu isteği yakalar ve durdurur.

Proxy cihazı kendisi kurban/istemciymiş gibi davranarak dış dünyadaki `example.com` sunucusu ile standart bir **TLS Handshake** (El Sıkışma) gerçekleştirir. Gerçek sunucunun dijital sertifikasını doğrular ve sunucu ile Proxy arasında **1. Şifreli Tünel** kurulur.

Dış sunucudan gelen şifreli yanıt Proxy'ye ulaştığında, Proxy bu verinin şifresini çözer (**Decryption**). Elde edilen ham içerik güvenlik motorlarına iletilir:
    ◦ **Antivirus / Anti-Malware:** Dosyada zararlı kod arar.
    ◦ **DLP (Data Loss Prevention):** Hassas veri (kredi kartı, TC Kimlik, kaynak kod) sızıntısı denetimi yapar.
    ◦ **URL / Content Filtering:** Kategori uygunluğunu denetler.

İçerik temizse, Proxy veriyi istemciye güvenle teslim etmek üzere **kendi dinamik olarak ürettiği sertifika** ile veriyi tekrar şifreler (**Re-encryption**) ve istemciye sunar. Böylece istemci ile Proxy arasında **2. Şifreli Tünel** kurulmuş olur.

**Neden "Güvenli Değil" Uyarısı Alınmaz?**
Normalde bir cihaz başkası adına sertifika ürettiğinde tarayıcılar "Geçersiz Sertifika / Ortadaki Adam" uyarısı verir. Ancak kurumsal ağlarda, Proxy cihazının **Kök Sertifikası (CA Root Certificate)** Active Directory (GPO) aracılığıyla tüm şirket bilgisayarlarına önceden *"Güvenilen Kök Sertifika Yetkilisi"* olarak yüklendiği için kullanıcı cihazı bu sahte/aracı sertifikaya tamamen güvenir.

> ***Buraya kadar kurumsal bir ağda trafiğin hangi katmanlardan geçtiğini, cihazların bu veriyi nasıl işlediğini ve meşru/şüpheli akışların (örneğin şifreli HTTPS trafiğinin) nasıl davrandığını gördük. Şimdi ise tüm bu gözlemlenebilir veriyi nasıl kaydeder, anlamlandırır ve analiz ederiz buna bakalım.***
> 

Siber güvenlik analizinde ve olay müdahalesinde (Incident Response) bir olayı incelerken başvurduğumuz ilk ve en temel kaynak **sistem loglarıdır (Günlük Kayıtları)**.

Sistemdeki her cihaz, yazılım ve protokol bir işlem gerçekleştiğinde (bir kullanıcının oturum açması, bir web sayfasına erişilmesi, bir bağlantının engellenmesi vb.) arkasında dijital bir ayak izi bırakır. Ancak tehdit analizindeki en büyük zorluklardan biri **evrensel tek bir log standardının olmamasıdır**: Mesela Microsoft sistemleri olayları `Windows Event Log` formatında tutarken, Linux/Unix tabanlı sistemler `Syslog` formatını kullanır. Cisco, Palo Alto, Fortinet gibi ağ cihazları ile Apache, Nginx gibi web sunucuları kendi üreticilerine özel (Vendor-Specific) biçimleri tercih eder.

Bir paket ağdan geçerken güvenlik cihazları verinin tamamını (payload/içerik dâhil) sürekli kaydetmeye kalkarsa, devasa kurumsal ağlarda disk alanları ve depolama birimleri saniyeler içinde dolar. Bu yüzden üreticiler varsayılan olarak verinin tamamı yerine **meta veri (özet bilgi)** tutarlar:

> *Kim bağlandı? (Source IP)* | *Nereye bağlandı? (Destination IP)* | *Ne zaman bağlandı? (Timestamp)* | *Hangi portu kullandı? (Port/Protocol)*
> 

Farklı sistemlerden çıkan bu karmaşık ve heterojen logları merkezi bir yere toplamak için **Syslog** veya **SNMP** gibi standart aktarım protokolleri kullanılır. Toplanan tüm veriler **SIEM (Security Information and Event Management)** sistemlerinde birleştirilir, normalize edilir ve birbiriyle ilişkilendirilir (**Correlation**).

Loglar *"Ne oldu?"* sorusunun özetini sunar; ancak paketin içinde tam olarak neyin taşındığını görmek (Full Packet Analysis) için canlı ağ trafiğini yakalamak gerekir.

Modern ağlarda kullanılan anahtarlayıcılar (Switch) trafiği akıllı yönetir. Anahtarlama tablosu (MAC Address Table) sayesinde A bilgisayarından B bilgisayarına giden paketler C bilgisayarına (analistin makinesine) uğramaz. Dolayısıyla, ağdaki üçüncü bir cihazın trafiğini izleyebilmek için söz konusu trafiğin teknik bir yöntemle analistin ağ kartına yönlendirilmesi gerekir:Nasıl?

- **Port Mirroring / SPAN (Kurumsal / Yasal Yöntem):** Yönetilebilir bir Switch üzerinde yapılan yapılandırmayla (Switch Port Analyzer - SPAN), bir veya birden fazla hedef portun trafiğinin birebir kopyası analistin bilgisayarının bağlı olduğu porta yönlendirilir.
- **ARP Spoofing / Poisoning (Sızma Testi / Lab Yöntemi):** Saldırgan veya test uzmanı, hedef cihaz ile yönlendirici (Router) arasına girerek ağ önbelleklerini zehirler. Trafik mecburen analistin/saldırganın bilgisayarı üzerinden akar.
- **Araya Ortam Ekleme (Network TAP & Proxy):** Cihaz ile ağ arasına fiziksel bir dinleme donanımı yerleştirilir veya cihazın tüm trafiği mantıksal bir Proxy sunucusuna yönlendirilir.

#### 1. Network TAP (Test Access Point) Nedir ve Nasıl Çalışır?

Network TAP, iki ağ cihazı (örneğin bir Router ile Switch) arasına **fiziksel olarak giren (inline)** donanımsal bir aparattır.TAP cihazının içinden geçen kablodaki elektrik (bakır kablo) veya ışık (fiber optik) sinyalleri donanımsal olarak ikiye ayrılır. Bir hat iletişimi kesintisiz devam ettirirken, oluşan birebir kopya cihazın **Monitoring Port (İzleme Portu)** adı verilen çıkışına aktarılır.

- **Görünmezlik ve Güvenlik:** TAP cihazının kendisine ait bir IP veya MAC adresi yoktur. Ağ üzerinde mantıksal bir varlığı bulunmadığı için saldırganlar tarafından taranarak tespit edilemez veya ağ üzerinden siber saldırıya uğrayamaz.
- **Sıfır Gecikme (Zero Latency):** İşlemci, bellek veya paket işleme yazılımı kullanmadığı için ağ trafiğinde herhangi bir yavaşlamaya (gecikmeye) sebep olmaz.
- **IDS / IPS (Saldırı Tespit ve Engelleme Sistemleri):** Trafik içinde zararlı imza veya anormallik arar.
- **SIEM / Packet Analyzer (Wireshark, Zeek, Suricata):** Paketlerin içeriğini analiz ederek günlüğe kaydeder.
- **DLP (Veri Sızıntısı Önleme):** Şirket dışına çıkarılmaya çalışılan hassas verileri paket bazlı denetler.

#### Port Mirroring / SPAN Mantığı

Anahtarlayıcılar (Switch), normalde veriyi sadece hedef porta yönlendirir. Ancak bir ağı izlemek istediğimizde switch'e şu talimatı veririz: *"Şu porttan geçen tüm trafiğin bir kopyasını al, benim izleme cihazımı (Wireshark, IDS vb.) bağladığım şu diğer porta kopyala."*

Bu konfigürasyon yapıldığında `WIN-001` bilgisayarından sunucuya giden tüm paketler arka planda kopyalanarak izleme cihazına iletilir.Günümüzde sunucuların büyük kısmı sanallaştığı veya buluta taşındığı için port yansıtma sadece fiziksel switch'lerde yapılmaz:

- **Sanal Ağlar (VMware vSwitch / Hyper-V):** Sanal makinelerin (VM) birbiriyle konuştuğu sanal anahtarlayıcılar üzerinde port yansıtma açılabilir.
- **Bulut Ortamları (AWS VPC Traffic Mirroring / Azure Tap):** Bulut üzerindeki sanal sunucuların (EC2 vb.) ağ kartlarındaki (ENI) trafik, bulut servisleri aracılığıyla bir güvenlik sunucusuna aktarılabilir.

Canlı paket analizi (Full Packet Capture - FPC) veya Ağ Trafiği Analizi (NTA) altyapısı tasarlanırken mimarlar ve güvenlik ekipleri şu üç kritik engeli aşmak zorundadır:

1. **Doğru Konumlandırma (Placement):**
    - **Kuzey-Güney trafiğini (İnternet çıkışı)** izlemek istiyorsan yansıtmayı Firewall veya Router arkasındaki porta koymalısın.
    - **Doğu-Batı trafiğini (İç ağdaki yanal hareketler)** izlemek istiyorsan ilgili VLAN veya iç ağ switch'lerindeki portları yansıtmalısın.
2. **Muazzam Depolama Maliyeti (Storage Requirements):**
    - Metinde verilen matematik çok kritiktir: **1 Gbps** kapasiteli bir hattın tamamı dolu olmasa dahi gün sonunda ortalama **10.8 Terabayt (TB)** veri üretir.
    - Şirketlerin **10 Gbps** veya **40 Gbps** omurga hatları düşünüldüğünde, aylarca tam paket saklamak petabaytlarca disk alanı gerektirir. Bu yüzden genellikle paketlerin sadece üst verisi (Header/Metadata) saklanır, ham veriler kısa süreli (örn. 7 gün) tutulur.
3. **TAP mı, Mirroring mi? (Performans Karşılaştırması):**
    - **TAP (Fiziksel):** Switch işlemcisine hiç yük bindirmez. Yüksek trafikli ana omurgalarda tercih edilir.
    - **Mirroring (Yazılımsal):** Cihaz işlemcisini (CPU) kullanır. Trafik çok yoğunlaştığında switch kendi asli görevi olan iletimi aksatmamak için yansıtılan paketleri düşürebilir (drop edebilir).

> ***Ağ mimarisini kurup trafiği doğru noktadan (TAP veya SPAN portları üzerinden) analiz cihazımıza aktardıktan sonra, sıra bu akan ham veriyi yakalamaya, filtrelemeye ve anlamlandırmaya gelir.Toollarla devam edelim.***
> 
- Wireshark Yakalanan paketlerin içeriğini (payload), katmanlarını ve protokol detaylarını görsel arayüzde incelemenizi sağlayan dünya standardı araçtır.
- TCPdump Linux sistemlerde komut satırından çalışan hızlı ve hafif paket yakalama aracıdır. Grafiği yoktur, doğrudan ağ arayüzündeki paketleri yakalar veya kaydeder.
- Snort, Suricata ve Zeek gibi IPS/IDS sistemleri Yakalanan paketleri canlı olarak kurallarla tarar. Örneğin paketin içinde zararlı bir imza veya C2 ipucu bulursa otomatik alarm üretir.

### **TCPdump ile Komut Satırında Trafik Analizi**

Çoğu Linux dağıtımı varsayılan olarak `tcpdump` içerir. Eğer yoksa dağıtımınıza uygun kurulumu tamamlayabilirsiniz:

- **Debian / Ubuntu:**
    
    `sudo apt-get install tcpdump`
    
- **RHEL / Fedora:**
    
    `sudo dnf install tcpdump`
    

#### **Kurulum ve Sürüm Kontrolü**

Kurulumunuzu ve sürümünüzü kontrol edelim:

Bash

```
which tcpdump
tcpdump --version
```

**Not:** `tcpdump`ı kullanabilmek için `root` veya `sudo` yetkilendirmesine geçmeniz gerekebilir.

#### **Arabirimleri Listeleme ve Paket Yakalama**

Mevcut arabirimleri listeleyelim:

Bash

```
tcpdump -D
```

Belirtilen arabirimde basit bir paket yakalama başlatmak için (`eth0` yazan yeri yakalama yapmak istediğiniz interface ile değiştirin):

Bash

```
tcpdump -i eth0
```

#### **Çıktıyı Anlamlandırma**

Şimdi elde ettiğimiz çıktıyı anlamlandıralım. Öncelikle çıktıdaki her bir satır yakalanan bir paketi temsil eder:

- **Zaman Damgası:** Paketin yakalandığı zaman.
- **Protokol:** Protokol türü (TCP, UDP, ICMP vb.).
- **Kaynak ve Hedef:** IP adresleri ve bağlantı noktası numaraları.
- **Paket Boyutu:** Paketin bayt cinsinden uzunluğu.
- **Ek Bilgiler:** Bayraklar, sıra numaraları ve diğer protokole özel bilgileri içerebilir.

#### **Örnek Analiz**

Bir tane örneğe bakalım ve analiz edelim:

Plaintext

```
14:23:05.123456 IP 192.168.1.50.52234 > 93.184.216.34.80: Flags [S], seq 381920182, win 64240, options [mss 1460,sackOK,TS val 2891231 ecr 0,nop,wscale 7], length 0
14:23:05.145678 IP 93.184.216.34.80 > 192.168.1.50.52234: Flags [S.], seq 109283019, ack 381920183, win 65535, options [mss 1460,sackOK,TS val 9812312 ecr 2891231,nop,wscale 7], length 0
14:23:05.145890 IP 192.168.1.50.52234 > 93.184.216.34.80: Flags [.], ack 109283020, win 502, length 0
14:23:05.146100 IP 192.168.1.50.52234 > 93.184.216.34.80: Flags [P.], seq 1:78, ack 1, wi
```

> Yukarıdaki 4 satırlık çıktı, istemci (`192.168.1.50`) ile bir web sunucusu (`93.184.216.34`) arasındaki **TCP 3 Yönlü El Sıkışması (3-way handshake)** ve ardından gelen ilk HTTP GET isteğini gösterir.
> 
- **`14:23:05.123456` (Zaman Damgası):** Paketin yakalandığı saat, dakika, saniye ve mikrosaniye.
- **`IP` (Ağ Protokolü):** Paketin IPv4 olduğunu gösterir (IPv6 olsaydı `IP6` yazardı).
- **`192.168.1.50.52234` (Kaynak IP ve Port):** Paketi gönderen cihazın IP adresi ve rastgele seçtiği kaynak portu (`52234`).
- **`>` (Yön Simgesi):** Trafiğin soldan sağa doğru aktığını gösterir.
- **`93.184.216.34.80` (Hedef IP ve Port):** Paketin gittiği alıcının IP adresi ve HTTP servis portu (`80`).
- **`Flags [S]` (TCP Bayrağı):**
    - `[S]` = **SYN** (Bağlantı başlatma isteği)
    - `[S.]` = **SYN-ACK** (İsteği kabul etme ve onaylama)
    - `[.]` = **ACK** (Sadece onay paketi)
    - `[P.]` = **PSH-ACK** (Veri iletimi / Push)
    - `[F.]` = **FIN** (Bağlantıyı sonlandırma)
    - `[R]` = **RST** (Bağlantıyı aniden kesme/reset)
- **`seq 381920182` (Sıra Numarası):** TCP paketlerinin doğru sırayla birleştirilmesi için kullanılan rastgele Başlangıç Sıra Numarası (ISN).
- **`win 64240` (Pencere Boyutu / Window Size):** Gönderenin tamponunda kabul edebileceği bayt miktarı.
- **`length 0` (Veri Uzunluğu):** Bu paketin taşıdığı ham yükün (payload) bayt cinsinden boyutu. İlk 3 el sıkışma paketinde veri bulunmadığı için `0` görünür; HTTP isteğinin iletildiği 4. satırda `length 77` olarak değişmiştir.

> Belirli bir trafiğe odaklanmak için filtreleme seçeneklerini kullanırız.
> 
- Protokole Göre:
    
    ```
    tcpdump icmp (Bu komut sadece ping ve ICMP kontrol paketlerini yakalar
    ```
    
- Ana Bilgisayara Göre:
    
    ```
    tcpdump'host 192.168.1.100'# Belirli bir IP adresine giden/gelen trafik
    ```
    
- Bağlantı Noktasına Göre:
    
    ```
    tcpdump'port 80'# 80 numaralı bağlantı noktasındaki trafik (HTTP)
    ```
    
- Kombinasyonlar: or ve and gibi mantıksal operatörlerin kullanımı
    
    ```
    tcpdump src 192.168.1.50 and port 80
    ```
    

`tcpdump` filtrelerinin **4 ana tuğladan** oluştuğunu bilmek yeterlidir. Bir filtre yazarken şu sırayı düşünmen yeterli:

![image.png](/blogs/img/ag-trafik-analizi/image2.png)

- **Soru:** *"192.168.1.10 IP'sinden gelen HTTP paketlerini nasıl görürüm?"*
- **Mantık:** Kaynak IP (`src host 192.168.1.10`) **VE** Port (`and port 80`)
- **Komut:** `tcpdump src host 192.168.1.10 and port 80`

#### **Yardım ve Kılavuz Sayfalarına Erişim**

Alternatif olarak komut parametrelerini hızlıca görmek için:

Bash

```
tcpdump --help
```

**Detaylı kullanım kılavuzu ve örnekler için:**

Bash

```
man tcpdump
```

> `man tcpdump` ekranındayken klavyeden `/examples` yazıp `Enter`'a basarsanız, doğrudan hazır kural örneklerinin bulunduğu bölüme atlayabilirsiniz.
> 

#### **Paket Kaydetme ve Okuma (`.pcap` Yönetimi)**

Ağ trafiğini canlı olarak ekrandan akıp giderken takip etmek zordur. Bu yüzden paketler `.pcap` (Packet Capture) formatında dosyaya kaydedilir ve daha sonra analiz edilir.

- **Kaydetme (`w` / Write):**Bash
    
    ```
    tcpdump -i eth0 -w output.pcap
    ```
    
    *Bu komut ekrana canlı çıktı basmaz; yakalanan tüm ham paketleri `output.pcap` dosyasına yazar.*
    
- **Okuma (`r` / Read):**BashBash
    
    ```
    tcpdump -r output.pcap
    ```
    
    *Daha önce kaydedilmiş `.pcap` dosyasındaki paketleri tekrar ekrana basar.*
    
    Daha önce kaydedilmiş bir dosyayı okurken de filtreler kullanılabilir:
    
    ```
    tcpdump -r output.pcap 'port 80'
    ```
    

> `tcpdump` ile kaydedilen bir `.pcap` dosyası, daha sonra görsel arayüz sunan **Wireshark** uygulaması ile açılarak detaylı biçimde incelenebilir.
> 

### **Wireshark ile Görsel Paket Analizi**

**Wireshark**, ağ trafiğini grafik arayüz (GUI) üzerinden canlı olarak yakalamaya veya önceden kaydedilmiş `.pcap` / `.pcapng` analiz dosyalarını derinlemesine incelemeye yarayan, dünyanın en yaygın kullanılan açık kaynaklı paket analizcisidir.

TCP oturumlarını ve karmaşık veri akışlarını yeniden yapılandırarak (Stream Reassembly) üst katman protokollerini insan tarafından okunabilir hale getirir. Windows, macOS ve Linux platformlarında tam uyumlulukla çalışır.

#### **1Wireshark Ekran Mimarisi ve 3 Ana Panel**

Wireshark'ta canlı bir analiz başlatıldığında veya bir `.pcap` dosyası açıldığında ekran, veriyi farklı perspektiflerden sunan **üç ana yatay panele** bölünür:

- **Paket Listesi Paneli (Packet List Pane - Üst Kısım):**
    
    Yakalanan tüm paketleri kronolojik sırayla listeler. Paket numarası (`No.`), zaman damgası (`Time`), kaynak IP (`Source`), hedef IP (`Destination`), protokol (`Protocol`), paket uzunluğu (`Length`) ve paket hakkında özet bilgi sunan `Info` sütunlarından oluşur.
    
- **Paket Detayları Paneli (Packet Details Pane - Orta Kısım):**
    
    Listeden seçilen tek bir paketin **OSI Model katmanlarına göre** ayrıştırılmış halini sunar *(Ağ Kartı $\rightarrow$ Ethernet $\rightarrow$ IP $\rightarrow$ TCP/UDP $\rightarrow$ Uygulama Katmanı)*. Her bir katmanın yanındaki ok simgesi genişletilerek paket başlığındaki (header) tüm bit, bayrak ve parametreler incelenebilir.
    
- **Paket Baytları Paneli (Packet Bytes Pane - Alt Kısım):**
    
    Seçilen paketin bilgisayar belleğindeki ham verisini **Hexadecimal (Onaltılık)** ve **ASCII (Metin)** formatında yan yana gösterir. Orta panelde seçilen bir alanın alt panelde hangi baytlara karşılık geldiği anlık olarak vurgulanır.
    

#### **Kurulum Adımları**

Kullandığınız Linux dağıtımına uygun komutla kurulumu gerçekleştirebilirsiniz:

- **Debian / Ubuntu:**Bash
    
    ```
    sudo apt update
    sudo apt install wireshark -y
    ```
    
- **RHEL / Fedora:**Bash
    
    ```
    sudo dnf install wireshark -y
    ```
    

#### **Kurulum Sonrası İzin ve Grup Ayarları**

Wireshark'ın `root` (yönetici) yetkisi olmadan canlı trafik yakalayabilmesi için mevcut kullanıcının `wireshark` grubuna eklenmesi gerekir:

- **Kullanıcıyı Gruba Ekleme:**Bash
    
    ```
    sudo usermod -aG wireshark $USER
    ```
    
    *(Not: `$USER` değişkeni terminalde mevcut kullanıcı adınızı otomatik olarak alır.)*
    
- **İzinleri Aktif Etme:**Bash
    
    Grup değişikliklerinin sistemde geçerli olması için oturumu kapatıp açabilir veya terminalde şu komutu çalıştırabilirsiniz:
    
    ```
    newgrp wireshark
    ```
    

> **Neden `wireshark` Grubuna Kullanıcı Ekliyoruz?**
> 
> 
> Linux sistemlerde ağ kartını ham dinleme moduna (Promiscuous Mode) almak doğrudan `root` yetkisi gerektirir.
> 
> - **Güvensiz Yöntem (`sudo wireshark`):** Wireshark'ı doğrudan `root` yetkileriyle çalıştırmak ciddi bir güvenlik riskidir. Wireshark yüzlerce farklı protokolü ayrıştırır (dissect eder); bu ayrıştırıcı kodlarda bulunabilecek olası bir zafiyet tüm sistemin ele geçirilmesine yol açabilir.
> - **Güvenli Yöntem (Grup Yetkilendirmesi):** Kullanıcıyı `wireshark` grubuna eklediğimizde, Wireshark arka planda sadece paket yakalama işini üstlenen küçük `dumpcap` aracına root yetkisi olmadan erişebilir. Böylece karmaşık grafik arayüzünü kendi standart kullanıcınızla, sisteminizi riske atmadan güvenle çalıştırabilirsiniz.

#### **Wireshark'ı Başlatma ve Analize Giriş**

Kurulum ve izin ayarları tamamlandıktan sonra uygulamayı terminal üzerinden başlatabilirsiniz:

Bash

```
wireshark
```

#### **Canlı Analiz Başlatma**

Wireshark açıldığında karşınıza gelen ana menüdeki aktif ağ arabirimlerinden birine çift tıklayarak ya da sol üst araç çubuğundaki **mavi köpekbalığı yüzgeci** sembolüne basarak canlı dinlemeyi başlatabilirsiniz.

#### **Kayıtlı `.pcap` Dosyası Açma Yöntemleri:**

Wireshark arayüzünde bir `.pcap` veya `.pcapng` dosyası açarak geçmiş trafiği incelemek için şu 4 yöntemden birini kullanabilirsiniz:

1. **Menü Kullanarak:** Upper Menu üzerinden `Dosya` $\rightarrow$ `Aç` (`File` $\rightarrow$ `Open`) adımlarını takip edin.
2. **Kısayol Tuşu:** `Ctrl + O` *(macOS için `Cmd + O`)* tuş kombinasyonuyla dosya seçim penceresini doğrudan açın.
3. **Sürükle - Bırak:** İncelemek istediğiniz `.pcap` dosyasını bilgisayarınızdan tutup doğrudan Wireshark penceresinin içine bırakın.
4. **Terminal Üzerinden:** İlgili dosyayı doğrudan terminalden parametre vererek çalıştırın:Bash
    
    ```
    wireshark /dosya/yolu/yakalama.pcap
    ```
    

#### **İnceleme ve Analiz Mantığı**

Arayüzde bir analiz dosyası açıldığında binlerce paketlik veri yığını ilk başta karmaşık görünebilir. Ancak Wireshark'taki analiz süreci; **Üst Paneldem** şüpheli hareketi/paketi seçip, **Orta Paneldem** ilgili protokol katmanının detayına inmek ve **Alt Paneldem** ham verinin içeriğini (payload) doğrulamak şeklinde bu 3 panel arasındaki ilişki kurularak yürütülür.

## Ana Ekran Panelleri ve Görevleri

Wireshark penceresi varsayılan olarak yukarıdan aşağıya üç bölüme ayrılır:

### A. Paket Listesi Paneli (Packet List - Üst Panel)

Yakalanan tüm paketlerin kronolojik olarak dizildiği alandır. Her satır bir paketi temsil eder.

- **No:** Paketin yakalanma sırası.
- **Time:** Paket yakalama işleminin başladığı andan itibaren geçen süre (veya tam tarih/saat).
- **Source & Destination:** Paketin çıktığı ve gittiği IP adresleri (veya MAC adresleri).
- **Protocol:** Paketin taşıdığı en üst düzey protokol (örneğin TCP, UDP, DNS, HTTP, TLS).
- **Length:** Paketin toplam bayt boyutu.
- **Info:** Paket hakkında özeti sunan kritik alan (örneğin TCP bayrakları `[SYN, ACK]`, DNS sorgu adı, HTTP istek metodu).

### B. Paket Detayları Paneli (Packet Details - Orta Panel)

Üst panelde seçtiğin tek bir paketin **OSI Modelindeki katman katman parçalanmış** halidir. Ok simgelerine tıklayarak katmanların içine girersin:

1. **Frame (Fiziksel Katman):** Paketin boyutu, yakalandığı arayüz ve zaman damgası bilgileri.
2. **Ethernet II (Veri Bağlantı Katmanı):** Kaynak ve Hedef MAC (Hardware) adresleri.
3. **Internet Protocol (Ağ Katmanı - IPv4/IPv6):** Kaynak/Hedef IP adresleri, TTL (Time to Live) değeri ve IP başlık bilgileri.
4. **Transmission Control / User Datagram Protocol (Taşıma Katmanı - TCP/UDP):** Kaynak/Hedef Port numaraları, TCP Sıra/Onay numaraları (Seq/Ack), Bayraklar (Flags).
5. **Uygulama Katmanı (Application Layer):** Eğer paket şifresiz bir protokolsə (HTTP, DNS, FTP, SMTP vb.), burada doğrudan uygulamanın taşıdığı veriyi görürsün.

### C. Paket Baytları Paneli (Packet Bytes - Alt Panel)

Seçili paketin bellek üzerindeki ham görüntüsüdür.

- **Sol taraf:** Hexadecimal (Onaltılık) kodlar.
- **Sağ taraf:** Bu kodların ASCII metin karşılıkları.
- *İpucu:* Orta panelde bir alana (örneğin IP adresine) tıkladığında, alt panelde o veriye karşılık gelen baytlar otomatik olarak vurgulanır.

### Genel Trafik Haritasını Çıkarmak

Analize başlamadan önce trafikte neyin ağırlıkta olduğunu görmek için menüdeki araçlar kullanılır:

- **`Statistics -> Protocol Hierarchy`:** Ağda en çok hangi protokolün (HTTP, DNS, TLS) kullanıldığını yüzde olarak gösterir.
- **`Statistics -> Conversations`:** Hangi iki IP adresinin birbiriyle en çok veri alışverişi yaptığını ortaya çıkarır.

### Görüntüleme Filtreleri (Display Filters) ile Süzme

Binlerce paket arasından hedefe odaklanmak için en üstteki yeşil filtre çubuğu kullanılır:

- **IP'ye göre:** `ip.addr == 192.168.1.50`
- **Porta göre:** `tcp.port == 80` veya `udp.port == 53`
- **Protokole göre:** `http`, `dns`, `arp`, `icmp`
- **İçeriğe göre:** `http.request.method == "POST"`

### Akışı Takip Etmek (Follow Stream)

Paketleri tek tek incelemek yerine bir iletişimin tüm hikayesini görmek için:

1. İlgili pakete sağ tıkla.
2. **`Follow -> TCP Stream`** (veya HTTP Stream) seçeneğini tıkla.
3. Wireshark, istemci ile sunucu arasındaki tüm karşılıklı konuşmayı (istemci kırmızı, sunucu mavi renkte olacak şekilde) tek bir metin penceresinde birleştirir.

### Renk Kodlarını Anlamak

Wireshark paketleri türlerine göre renklendirir:

- **Açık Mavi:** UDP trafiği (Genellikle DNS).
- **Açık Yeşil:** HTTP trafiği.
- **Koyu Mavi:** DNS trafiği.
- **Siyah Metin / Kırmızı Arka Plan:** Hatalı paketler, retransmission (yeniden iletim) veya kesilmiş TCP bağlantıları (RST).

Ağ analizi ve canlı paket yakalama süreçlerinde **Yakalama Öncesi Filtreleme (Capture Filtering)**, trafiği kaydetmeye başlamadan önce disk, CPU ve bellek (RAM) kullanımını optimize etmek amacıyla uygulanan en temel yöntemdir.

Paket cihaza ulaştıktan sonra yapılan görüntüleme filtrelemesinin (**Display Filter**) aksine; Capture Filter, gelen ham veriyi henüz **işletim sistemi çekirdeği (Kernel) / BPF (Berkeley Packet Filter) seviyesinde** süzer. Filtre kuralıyla eşleşmeyen paketleri tamamen düşürerek **disk üzerine hiç yazmaz ve belleğe almaz.**

![image.png](/blogs/img/ag-trafik-analizi/image3.png)

## BPF (Berkeley Packet Filter) Sözdizimi Yapısı

Yakalama filtreleri (hem `tcpdump` hem de Wireshark yakalama pencerelerinde) BPF mimarisini kullanır. BPF mantığı üç ana bileşenden oluşur:

1. **Tür (Primitive):** `host`, `net`, `port`, `portrange`
2. **Yön (Direction):** `src`, `dst`, `src or dst`
3. **Protokol (Protocol):** `ip`, `ether`, `tcp`, `udp`, `icmp`

## Temel Yakalama Filtresi Örnekleri

### IP / Ana Bilgisayar Bazlı Filtreleme

- **Tek bir IP adresini yakalamak:**Plaintext
    
    ```
    host 192.168.1.50
    ```
    
- **Sadece belirli bir kaynaktan gelen trafiği yakalamak:**Plaintext
    
    ```
    src host 10.0.0.15
    ```
    
- **Tüm bir alt ağı (Subnet) yakalamak:**Plaintext
    
    ```
    net 192.168.1.0/24
    ```
    

### Port ve Protokol Bazlı Filtreleme

- **Sadece HTTP ve HTTPS trafiğini yakalamak:**Plaintext
    
    ```
    port 80 or port 443
    ```
    
- **Sadece DNS sorgularını (UDP 53) yakalamak:**Plaintext
    
    ```
    udp port 53
    ```
    
- **Belirli bir port aralığını yakalamak:**Plaintext
    
    ```
    portrange 1000-1500
    ```
    

### Mantıksal Operatörler Kullanarak İstisnalar Oluşturma

- **SSH (Port 22) trafiği HARİÇ tüm trafiği yakalamak:***(Gelişmiş analizlerde analizcinin kendi uzaktan bağlantı trafiğini gizlemek için sıklıkla kullanılır.)*Plaintext
    
    ```
    not port 22
    ```
    
- **Belirli bir IP'den gelen sadece HTTP trafiğini yakalamak:**Plaintext
    
    ```
    src host 192.168.1.10 and port 80
    ```
    

## Araçlarda Nasıl Uygulanır?

- **Wireshark Üzerinde:**
Wireshark açıldığında ağ arabirimlerinin üstünde yer alan **"Enter a capture filter..."** (Bir yakalama filtresi girin...) yeşil çubuğuna BPF ifadesi yazılarak dinleme başlatılır.
- **`tcpdump` Üzerinde:**
Komutun sonuna doğrudan kural eklenerek çalıştırılır:Bash
    
    ```
    sudo tcpdump -i eth0 -w yakalama.pcap 'tcp port 80 and src host 192.168.1.50'
    ```
    

End…Umarım faydalı olmuştur.
