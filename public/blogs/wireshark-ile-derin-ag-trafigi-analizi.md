# Wireshark ile Derin Ağ Trafiği Analizi: Paket Paket Güvenlik İncelemesi

Wireshark, bilgisayar ağları üzerinde iletilen verileri paket düzeyinde yakalayan ve okunabilir hale getiren ücretsiz, açık kaynaklı bir ağ protokol analizörüdür. Hem eğitim süreçlerinde hem de profesyonel siber güvenlik operasyonlarında temel bir araç olarak kullanılır. Ağ üzerinde gerçekleşen veri alışverişini detaylı bir şekilde çözümler ve şüpheli paketlerin tespit edilmesini sağlar.

Ağ üzerindeki sistemler birbirleriyle haberleşirken verileri küçük parçalara, yani "paketlere" bölerek iletirler. Wireshark, bu paketlerin içeriğine inerek verinin hangi IP adresinden çıktığını, hangi hedefe gittiğini ve iletişim sırasında hangi protokollerin kullanıldığını yapısal olarak gösterir.

Bu yazıda aktif bir ağ üzerinden canlı trafik analizi yapmayacağız. Bunun yerine, eğitim amacıyla daha önceden oluşturulmuş bir ağ trafik kaydını (PCAP dosyası) inceleyeceğiz. Amacımız, ağ üzerinde çoktan olup bitmiş bir saldırının teknik kayıtlarını açmak ve zararlı aktivitenin adımlarını paket düzeyinde geriye dönük olarak analiz etmektir.

## Paket, Protokol, PCAP

- **Paket:** Ağ üzerinde veriler tek bir bütün halinde dolaşmaz. Bunun yerine "paket" dediğimiz küçük mantıksal veri bloklarına parçalanarak iletilir. Bu veri bloklarının her birinin başlık (header) kısmında kaynak IP adresi, hedef IP adresi ve port numaraları gibi yönlendirme bilgileri yer alır. Kısacası, internette veya yerel bir ağda cihazlar arasında gönderilen verinin en temel yapı taşıdır.
- **Protokol:** Bilgisayarların ve ağ cihazlarının birbiriyle sorunsuz, hatasız ve güvenli bir şekilde iletişim kurmasını sağlayan standart kurallar bütünüdür. Sistemlerin kendi aralarında nasıl haberleşeceğinin çerçevesini çizer. TCP, UDP, IP, DNS veya HTTP gibi isimler aslında bu farklı iletişim kurallarını belirtir ve ağ üzerinde her bir protokolün üstlendiği spesifik bir teknik görev vardır.
- **PCAP:** "Packet Capture" (Paket Yakalama) teriminin kısaltmasıdır. Teknik olarak, ağ trafiğinin dökümünü tutan dosya formatını (.pcap) ve işletim sisteminin ağ kartından veri yakalamasına imkân tanıyan altyapıyı ifade eder. Siber güvenlik analizlerinde ve ağ sorunlarının giderilmesinde sistemin "kara kutu" kaydı olarak kullanılır.

## PCAP Dosyası Açma

Eğer daha önce kaydedilmiş bir ağ trafiği dosyanız varsa (.pcap veya .pcapng uzantılı), bunu **File → Open** menüsüyle açabilirsiniz. Bu yöntem, özellikle eğitim amaçlı veya olay sonrası inceleme yaparken çok kullanışlıdır.

## Wireshark Arayüzü

Wireshark'ı açıp elimizdeki PCAP dosyasını içeri aktardığımızda, ekranda beliren binlerce satır ilk bakışta tam bir kaos gibi görünebilir. Ancak bu durum gözünüzü korkutmasın; filtreleme mantığını öğrendiğiniz an o karmaşa yerini tamamen odaklanmış, net bir analiz ortamına bırakacak.

![Wireshark arayüzünün üç ana paneli: paket listesi, paket detayları ve hex dökümü](   /blogs/img/wireshark-ile-derin-ag-trafigi-analizi/01-wireshark-arayuz_png)

Çalışma alanı, veriyi okumamızı kolaylaştırmak için görsel olarak temelde üç ana panele ayrılır:

- **Üst (Paket Listesi):** Ağ trafiğinin kronolojik zaman çizelgesidir; tüm iletişim burada alt alta sıralanır.
- **Orta (Paket Detayları):** Seçtiğiniz paketin kapsüllenme (encapsulation) mimarisini gösterir. Verinin iç içe geçmiş protokol katmanlarını (örneğin Ethernet → IP → TCP → HTTP hiyerarşisini) adım adım burada inceleriz.
- **Alt (Paket Baytları):** Verinin ağ donanımından geçen en saf halidir; yani arka plandaki onaltılık (hex) dökümüdür. İleri seviye bir inceleme yapılmadığı sürece, başlangıç aşamasında bu bölüm şimdilik görmezden gelinebilir.

## Paket Katmanları

Wireshark üzerinde bir ağ paketini incelediğinizde, hiyerarşik olarak şu katmanları görürsünüz:

- **Frame (Paket Meta Verisi):** Yakalanan paketin boyutu, zamanı ve yapısı gibi temel meta verilerini özetler.
- **Ethernet II (Veri Bağlantı Katmanı):** Ağ içindeki cihazlar arası donanımsal iletişimi sağlar. Kaynak ve hedef MAC adreslerini barındırır.
- **Internet Protocol Version 4 (Ağ Katmanı):** Paketin ağlar arası mantıksal yönlendirmesini yapar. Kaynak ve hedef IP adreslerini içerir.
- **Transmission Control Protocol (Taşıma Katmanı):** Uçtan uca veri iletimini yönetir. Port numaralarını ve bağlantı durum bayraklarını (flags) gösterir.
- **Application Layer (Uygulama Katmanı):** Servisin ürettiği asıl veriyi taşır. HTTP, DNS veya SSH gibi protokollere ait içerikler burada incelenir.

## Filtreleme Teknikleri

Wireshark'ta yüksek hacimli ağ trafiğini anlamlandırabilmek için iki temel filtreleme yöntemi kullanılır:

- **Yakalama Filtreleri (Capture Filters):** Paketler ağ arayüzünden kaydedilirken çalışır ve BPF (Berkeley Packet Filter) sözdizimini temel alır. Eşleşmeyen paketler diske hiç yazılmayacağı için veri kaybı yaratır; bu nedenle güvenlik analizlerinde çok dar filtreler kullanmaktan kaçınılmalıdır.

```
host 192.168.1.1
port 80
net 192.168.1.0/24
not port 22
host 192.168.1.1 and port 80
```

- **Görüntüleme Filtreleri (Display Filters):** Paketler yakalanıp kaydedildikten sonra çalışan bu filtreler, Wireshark'ın kendi sözdizimini kullanır. Arka plandaki veriyi kesinlikle silmez; yalnızca belirlediğiniz kriterlere uyan paketleri ekranda gösterir. Veri kaybına yol açmadığı için kullanımı son derece güvenlidir.

> ⚠️ Güvenlik analizlerindeki temel kural şudur: Kayıt aşamasında trafiği daraltmak bazı verilerin tamamen kaybolmasına neden olurken, görüntülemeyi daraltmak sadece incelemek istediğiniz paketlere odaklanmanızı sağlar.

## Örnek PCAP Analizi: Şüpheli DNS ve HTTP Trafiğinin Tespiti

Gerçek saldırı trafiklerini incelemek için *malware-traffic-analysis.net* üzerinden aldığım bir PCAP dosyasını adım adım analiz ettim. Ham trafiğe filtresiz baktığımda karmaşık bir veri yığınıyla karşılaştım. Ancak sırasıyla dns ve http filtrelerini uyguladığımda şüpheli aktiviteleri görüntüledim:

- **dns Filtresi:** Ağdaki alan adı sorgularını incelediğimde, normal bir kullanıcının asla yönelmeyeceği oldukça şüpheli bir domain sorgusu dikkatimi çekti.
- **http Filtresi:** Şifrelenmemiş web isteklerini filtrelediğimde, phishing saldırılarında fatura eki gibi maskelenerek indirilen .exe veya .zip uzantılı zararlı bir dosyanın indirme isteğini yakaladım.

> http filtresi uygulandığında, 153.92.1.49 IP adresine yönelen bir **POST** isteği (No. 24601) görülmektedir. Bu paket, Lumma Stealer zararlısının topladığı verileri komuta kontrol sunucusuna (whitepepper.su) aktardığı bağlantıdır.

![153.92.1.49 IP adresine yapılan şüpheli POST isteği](   /blogs/img/wireshark-ile-derin-ag-trafigi-analizi/02-supheli-akis.png)

**Hypertext Transfer Protocol** detaylarında şu bilgiler öne çıkar:

- **POST /api/set_agent?id=…:** Saldırganın API uç noktasına (endpoint) yapılan veri iletimi.
- **Host: whitepepper.su:** Saldırganın komuta kontrol (C2) sunucusu.
- **Content-Length: 8023 bytes:** Dışarı sızdırılan verinin boyutu (şifreler, cüzdan bilgileri vb.).
- **User-Agent: Mozilla/5.0…:** Zararlı yazılımın trafik analizi araçlarını atlatmak için kendini meşru bir tarayıcı gibi göstermesi.

Şifrelenmemiş HTTP trafiği, paket içeriğinin (payload) düz metin olarak okunmasını sağlar; bu sayede sızdırılan veriler doğrudan incelenebilir.

## Filtreleme Örnekleri ve Pratik Uygulamalar

Wireshark'ta filtreleme yaparken kullanabileceğiniz yüzlerce farklı operatör ve parametre bulunur. Ancak günlük analizlerde en sık ihtiyaç duyacağınız filtreler şunlardır:

**IP Tabanlı Filtreler**

Belirli bir cihazın trafiğini izlemek istediğinizde:

```
ip.addr == 192.168.1.100   # Hem kaynak hem hedef
ip.src == 192.168.1.100    # Sadece kaynak IP
ip.dst == 192.168.1.100    # Sadece hedef IP
ip.version == 4            # Sadece IPv4
ip.ttl > 64                 # TTL değeri 64'ten büyük
```

**Port ve Protokol Filtreleri**

Belirli servisleri veya protokolleri izlemek için:

```
tcp.port == 80    # HTTP trafiği
tcp.port == 443   # HTTPS trafiği
udp.port == 53    # DNS sorguları
dns               # Tüm DNS trafiği
http              # Tüm HTTP trafiği
tls               # TLS/SSL trafiği
```

**Mantıksal Operatörlerle Karmaşık Filtreler**

![ip.addr == 153.92.1.49 filtresi ile daraltılmış TCP/TLS trafiği](   /blogs/img/wireshark-ile-derin-ag-trafigi-analizi/03-filtre-ornekleri.png)

```
ip.addr == 192.168.1.100 and tcp.port == 443
dns.qry.name contains "malware" or http.host contains "suspicious"
tcp.flags.syn == 1 and tcp.flags.ack == 0   # Sadece SYN paketleri
```

## İstatistikler ve Raporlama

Wireshark, yakalanan ağ trafiği üzerinde kapsamlı istatistikler sunar. Çok sayıda paket arasında kaybolmamak için analize başlamadan önce **Statistics** menüsünü kullanarak trafiğin genel bir özetini çıkarabilirsiniz.

## Capture File Properties (Yakalama Dosyası Özellikleri)

Analize başlarken ilk adım olarak **Statistics → Capture File Properties** sekmesini inceleyin. Bu ekran, dosyaya ait şu temel bilgileri sunar:

![Capture File Properties penceresi: dosya, süre, arayüz ve istatistik bilgileri](   /blogs/img/wireshark-ile-derin-ag-trafigi-analizi/04-capture-file-properties.png)

- Dosya adı ve boyutu
- Hash değerleri (SHA256, SHA1 - veri bütünlüğünü doğrulamak için kritik)
- İlk ve son paketin zaman bilgisi ile toplam süre
- Yakalanan toplam paket sayısı
- Kayıt aşamasında kullanılan filtreler (varsa)

## Protocol Hierarchy (Protokol Hiyerarşisi)

**Statistics → Protocol Hierarchy** sekmesi, yakalanan trafiğin protokol dağılımını hiyerarşik bir yapıda sunar. Bu görünüm sayesinde, ağ üzerinde hangi protokollerin yoğunlukta olduğunu hızlıca tespit edip analiz edebilirsiniz.

```
Frame                                    100.0%  167 pkts
└─ Ethernet                              100.0%  167 pkts
   └─ Internet Protocol Version 4        100.0%  167 pkts
      ├─ Transmission Control Protocol   100.0%  167 pkts
      │  ├─ Transport Layer Security      47.9%   80 pkts
      │  └─ HTTP                           1.1%    2 pkts
      └─ DNS                               2.4%    4 pkts
```

Herhangi bir protokol üzerine sağ tıklayıp "Apply as Filter" diyerek, sadece o protokole ait trafiği filtreleyebilirsiniz.

## Conversations (Konuşmalar)

**Statistics → Conversations** menüsü, ağ üzerindeki cihazların karşılıklı iletişimini listeler. Bu ekranda şu detaylar yer alır:

- Kaynak ve hedef adres çiftleri (IP/MAC)
- İletilen toplam paket sayısı
- Transfer edilen veri hacmi (Bayt)

Veri sızıntısı şüphesi bulunan durumlarda, "Bytes" sütununa göre sıralama yaparak ağdaki en büyük veri transferlerini hızlıca tespit edebilirsiniz.

![Conversations sekmesinde IPv4 uç noktaları arasındaki veri hacmi](   /blogs/img/wireshark-ile-derin-ag-trafigi-analizi/05-conversations.png)

Özellikle dış ağa doğru gerçekleşen tek yönlü ve yüksek hacimli veri akışları, bir veri sızıntısının temel göstergelerinden biridir.

## HTTP Analizleri

Statistics → HTTP altında çeşitli analiz araçları bulunur:

**Packet Counter:** HTTP istek ve yanıtlarının dağılımı

```
Total HTTP Packets: 7340

HTTP Request Packets: 3843 (52.36%)
- GET: 13
- POST: 3454
- SEARCH: 321

HTTP Response Packets: 3497 (47.64%)
- 2xx Success: 3489 (99.77%)
- 4xx Client Error: 0
- 5xx Server Error: 0
```

**Requests:** Ziyaret edilen web sitelerinin listesini sunar. Listeden herhangi bir URL'ye tıklayarak, o adrese ait ağ trafiğini ve veri yükleme aşamalarını ayrıntılı olarak analiz edebilirsiniz.

## Follow TCP Stream: TCP İletişiminin Analizi

Bir TCP akışının (stream) tamamını incelemek için ilgili pakete sağ tıklayıp **Follow → TCP Stream** seçeneğini kullanabilirsiniz. Wireshark, ilgili akıştaki tüm paketleri birleştirerek veri içeriğini (payload) tek parça halinde sunar.

Özellikle şifrelenmemiş HTTP trafiğinde; indirilen dosya adları, iletilen parolalar veya komut satırı girdileri doğrudan düz metin olarak okunabilir. Bu özellik, olay incelemelerinde sistem kayıtlarının (log) ötesine geçerek zararlı aktivitelerin doğrudan ağ trafiği üzerinden analiz edilmesini sağlar.

Lumma Stealer örneğinde, whitepepper.su sunucusuna yapılan POST isteğine ait veri akışının tamamını inceleyebiliriz.

![Follow TCP Stream penceresinde renklendirilmiş istek/yanıt akışı](   /blogs/img/wireshark-ile-derin-ag-trafigi-analizi/06-tcp-stream.png)

Wireshark, "Follow TCP Stream" penceresinde bu iletişimi renklendirerek sunar:

- **Kırmızı Metin:** İstemciden (enfekte sistemden) saldırganın sunucusuna aktarılan, yani sızdırılan veri yükünü temsil eder.
- **Mavi Metin:** Saldırganın sunucusundan (komuta kontrol) dönen yanıtı gösterir.

Bu veri akışını incelediğimizde; dışarı sızdırılan sistem bilgileri, tarayıcı geçmişi, kayıtlı parolalar ve kripto cüzdan dosyaları gibi hassas içerikleri doğrudan düz metin olarak okuyabiliyoruz.

## Export Objects: Trafik İçindeki Dosyaları Kurtarmak

Wireshark analizlerinde, ağ trafiği üzerinden aktarılan dosyaları (objeleri) dışa aktarmanız (export) gerekebilir. Özellikle HTTP, FTP veya SMB gibi protokoller üzerinden taşınan dosyaları doğrudan sisteminize kaydederek detaylıca inceleyebilirsiniz.

Bu işlem için sırasıyla şu adımları izleyebilirsiniz:

1. **File → Export Objects** menüsüne gidin.
2. Dosyanın aktarıldığı protokolü (HTTP, SMB, FTP vb.) seçin.
3. Açılan pencerede, dışa aktarmak istediğiniz spesifik dosyayı belirleyin.
4. **Save** butonuna tıklayarak dosyayı sisteminize kaydedin.

![Export Objects listesinde HTTP üzerinden aktarılan dosyalar](   /blogs/img/wireshark-ile-derin-ag-trafigi-analizi/07-export-objects.png)

Bu özellik, özellikle malware analizi yaparken, zararlı yazılımın indirdiği dosyaları incelemek için çok kullanışlıdır.

## Zararlı Aktivite Tespiti: Güvenlik İncelemelerinde Wireshark

Ağ güvenliği, yalnızca saldırıları tespit etmekle kalmaz, aynı zamanda gerçek zamanlı izleme ve loglama ile ağ trafiğini sürekli olarak izlemeyi de içerir. Wireshark, bu süreçte kullanıcılara güçlü bir altyapı sağlar.

## ARP Spoofing (ARP Cache Poisoning) Tespiti

ARP (Address Resolution Protocol) Spoofing, yerel ağdaki (LAN) veri trafiğini ele geçirmek için kullanılan bir saldırı yöntemidir. Saldırgan, ağa sahte ARP yanıtları göndererek cihazların IP ve MAC adresi eşleşmelerini manipüle eder. Bu sayede cihazları yanıltarak ağ trafiğini kendi sistemi üzerinden geçmeye zorlar ve hedef sistemler arasındaki iletişimi doğrudan izleyebilir.

**Wireshark ile ARP Spoofing Tespiti:**

- **a) ARP Paketlerini Analiz Etmek:** `arp` filtresi, ağda geçen tüm ARP paketlerini gösterir.
- **b) Çift IP-MAC Eşleşmesi:** Wireshark üzerinde, aynı IP adresine ait birden fazla MAC adresinin tespit edilmesi, ARP spoofing saldırısının belirtisi olabilir.

## DNS Poisoning Tespiti

DNS poisoning, saldırganların ağdaki DNS sunucusunu manipüle ederek kullanıcıları zararlı sitelere yönlendirdiği bir saldırı türüdür.

**Wireshark ile DNS Poisoning Tespiti:**

a) DNS Trafiğini İzlemek:

```
dns
```

![dns.qry.name contains "whitepepper" filtresi ile şüpheli DNS sorguları](   /blogs/img/wireshark-ile-derin-ag-trafigi-analizi/08-supheli-dns.png)

b) Şüpheli DNS Yanıtları:

Özellikle bilinmeyen veya şüpheli IP adreslerine yapılan DNS yönlendirmeleri, DNS poisoning'in tipik bir belirtisidir.

## Port Tarama (Port Scanning) Tespiti

SYN Taraması Tespiti:

```
tcp.flags.syn == 1 and tcp.flags.ack == 0
```

Bu filtre, sadece SYN bayrağı taşıyan paketleri gösterir. Eğer bir IP adresinden kısa sürede çok sayıda farklı porta SYN paketi geliyorsa, bu port taraması işareti olabilir.

## Veri Sızıntısı (Data Exfiltration) Tespiti

Veri sızıntısı incelemelerinde disk kayıtları hangi verilerin kopyalandığını, ağ trafiği ise bu verilerin nereye aktarıldığını gösterir. Örneğin, bir çalışanın müşteri listesini kopyalaması disk üzerinde iz bırakır; ancak bu dosyanın kurum ağı dışına sızdırılıp sızdırılmadığı yalnızca ağ trafiği analiziyle doğrulanabilir.

### İzlenmesi Gereken Trafik Desenleri

- **Büyük Veri Transferleri:** Olası veri sızıntılarını tespit etmek için **Statistics → Conversations** menüsü üzerinden kayıtları aktarılan veri boyutuna (bayt) göre sıralayın. Bu işlem, ağ dışına tek yönlü olarak çıkarılan yüksek hacimli şüpheli transferleri saptamanızı sağlar.
- **Düzenli Aralıklı Küçük Paketler (Beaconing):** Zararlı yazılımların komuta kontrol (C2) sunucularıyla kurduğu iletişimin temel göstergesidir. Enfekte olmuş sistemin, saldırgana "aktifim" mesajı vermek amacıyla periyodik olarak gönderdiği düşük boyutlu ağ paketlerini ifade eder.

```
tcp.len < 200
```

- **Alışılmadık Portta TLS:** Şifreli ağ iletişiminin (TLS) standart olarak 443 numaralı port üzerinden gerçekleşmesi beklenir. Eğer 4444 veya 8080 gibi standart dışı portlarda TLS trafiği tespit ederseniz, bu durum genellikle zararlı yazılımların güvenlik duvarlarını atlatmak ve komuta kontrol (C2) bağlantısını gizlemek amacıyla trafiğini şifrelediğinin güçlü bir göstergesidir.

```
tls && !(tcp.port == 443)
```

- **DNS Tünelleme (DNS Tunneling):** Güvenlik duvarlarını atlatmak amacıyla, sızdırılan verilerin veya zararlı yazılım iletişiminin standart DNS sorguları içine gizlenerek aktarılmasıdır. Trafikte, anlamsız karakter dizilerinden oluşan ve anormal uzunluktaki alt alan adlarına (subdomain) sahip yoğun DNS istekleri görmek bu saldırı tekniğinin temel belirtisidir.

```
dns.qry.name.len > 50
```

Normal DNS sorguları kısa olur. 50 karakterden uzun sorgular şüphelidir.

## Gerçek Zamanlı İzleme ve Loglama

Ağ güvenliği, yalnızca saldırıları tespit etmekle kalmaz, aynı zamanda gerçek zamanlı izleme ve loglama ile ağ trafiğini sürekli olarak izlemeyi de içerir. Gerçek zamanlı izleme, ağdaki anormal aktiviteleri hemen fark etmenizi sağlar.

## PCAP Kaydetme ve Otomatik Raporlama

**PCAP Dosyası Kaydetme:**

1. Capture → Start butonuna tıklayarak ağ trafiğini yakalayın.
2. File → Save As seçeneğiyle PCAP formatında kaydedin.

**Filtreler ile PCAP Kaydetme:**

Filtreleme yaparak yalnızca ilginç veriyi kaydedebilirsiniz. Örneğin, yalnızca HTTP trafiğini kaydetmek için:

```
tcp.port == 80
```

**Otomatik Raporlama:**

Wireshark, kaydedilen ağ trafiğini analiz ederken otomatik raporlar oluşturabilir. Bu raporlar, ağ trafiği hakkında özet bilgiler sunar ve potansiyel tehditlerin hızlıca tespit edilmesini sağlar.

## Wireshark Dahili Araçlar

Wireshark ile birlikte kurulu gelen bazı ek araçlar bulunur:

**Mergecap:** İki farklı pcap dosyasını birleştirebilmek için kullanılır. Birden fazla ağ segmentinden veya farklı zaman dilimlerinden yakalanan trafiği tek bir dosyada birleştirerek bütünsel analiz yapabilirsiniz.

**capinfos:** Elinizde bulunan pcap dosyaları hakkında bilgi toplamak için kullanılır:

- Dosya tipi
- Dosya boyutu
- Paket sayısı
- İlk ve son paket zamanları
- Toplam süre
- Ortalama paket boyutu ve hızı

## Pratik İpuçları

**1. Hedefe Odaklanın:** Bütün ağı dinlemek yerine sadece şüpheli veya kritik sistemlerin trafiğini izlemek işinizi çok kolaylaştırır.

**2. Zaman Damgalarına (Timestamp) Dikkat Edin:** Olayların hangi sırayla gerçekleştiğini ve aralarındaki gecikmeleri net olarak anlamak için paketlerin geliş zamanlarını her zaman referans alın.

**3. Kayıtları Güvenle Saklayın:** PCAP dosyalarını olay müdahalesi ve güvenlik analizleri için mutlaka arşivleyin. Unutmayın: İlk başta yakalayıp diske yazmadığınız bir paketi sonradan geri getiremezsiniz.

**4. Şifreli Trafikte Üstveriyi (Metadata) Kullanın:** HTTPS gibi şifreli bir trafikte içeriği okumak için TLS/SSL şifresini çözmek (decryption) gerekebilir. Ancak buna her zaman gerek yok; çoğunlukla sadece şu detaylara bakarak da hedefi analiz edebilirsiniz:

- SNI (Server Name Indication)
- Sertifika bilgileri
- JA3/JA4 istemci parmak izleri
- Paketlerin veri hacmi ve zamanlama düzeni

**5. İstatistiklerle İlerleyin:** Paketleri baştan aşağı tek tek okumaya çalışmak ciddi bir vakit kaybıdır. Bunun yerine şu sırayla genelden özele doğru gidin:

- **Genel durumu görün:** Statistics → Capture File Properties
- **Protokol dağılımına bakın:** Statistics → Protocol Hierarchy
- **Kim kiminle haberleşmiş inceleyin:** Statistics → Conversations
- **İsim çözümlemelerini kontrol edin:** Statistics → DNS (veya dns filtresi)
- **İçeriği okuyun:** Şüpheli paket → Sağ Tık → Follow → TCP Stream
- **Dosyaları dışarı aktarın:** File → Export Objects

**6. Capture Filter ve Display Filter Farkını Bilin:**

- **Capture Filter:** Daha kayıt aşamasında devreye girer (BPF sözdizimi ile). Kurala uymayan paketler diske hiç yazılmaz, doğrudan kaybolur.
- **Display Filter:** Kaydı aldıktan sonra, analiz sırasında çalışır (Wireshark sözdizimi ile). Veriyi silmez, sadece ekrandaki kalabalığı gizler.
- **Kural:** Güvenlik olaylarını incelerken geniş yakalayın, dar görüntüleyin. Kayıt anında filtre uygulamak veri kaybına neden olabilir, bu yüzden filtrelemeyi sadece analiz ekranında yapmak en iyisidir.

**7. Veri Bütünlüğünü Sağlayın (Hash Alın):** Ağ trafiğini kaydettikten sonra PCAP dosyalarının mutlaka hash değerini (örn. SHA256) hesaplayıp not edin. Bu kayıtlar inceleme süreçleri için kritiktir, bu yüzden dosyanın analiz boyunca hiç değiştirilmediğini bu hash değeriyle doğrulayabilmemiz gerekir.

## Ekstra Notlar

**Wireshark şifreli trafiği çözebilir mi?** Elinizde anahtar yoksa, hayır. Şifreyi çözebilmek için sunucunun özel anahtarına (private key) veya tarayıcının ürettiği oturum anahtarı kayıtlarına (SSLKEYLOGFILE) ihtiyacınız vardır. Bu dosyalara da genellikle sadece kendi kurduğunuz test ortamlarında erişebilirsiniz.

**tcpdump ile Wireshark arasındaki fark nedir?** tcpdump komut satırında çalışır ve özellikle grafik arayüzü olmayan sunucularda trafiği yakalamak için çok pratiktir. Wireshark ise grafik arayüz üzerinden detaylı analiz yapmak için kullanılır. Sektördeki en yaygın pratik şudur: Trafiği sunucuda tcpdump ile yakala, oluşan PCAP dosyasını kendi bilgisayarına al ve Wireshark ile incele.

**Ne kadar PCAP saklamalıyım?** Ağdaki her paketi eksiksiz kaydetmek diskte devasa bir yer kaplar. Bu yüzden genellikle sadece en kritik sistemlerin trafiği kısa süreli tam paket kaydı (full packet capture) olarak tutulur. Ağın geri kalanı için, sadece bağlantı detaylarını gösteren ve daha az yer kaplayan uzun süreli akış (flow) kayıtları saklanır.

**Güvenlik olaylarını incelerken PCAP tek başına yeterli mi?** Hayır, tek başına yeterli değildir. Ağ kayıtları size verinin nereye gittiğini gösterir ancak tam bir sonuca varmak için ağ verisinin, disk kayıtları ve bellek (RAM) dökümleriyle birleştirilip çapraz analiz edilmesi gerekir.

**Wireshark öğrenmek için ağ bilgisi şart mı?** Evet. Temel seviyede TCP/IP mantığını bilmeniz gerekir. Ekranda gördüğünüz paketleri doğru analiz edebilmek için, arka planda o protokollerin (TCP, UDP, DNS, HTTP vb.) nasıl iletişim kurduğunu ve kurallara nasıl uyduğunu bilmek zorunludur.

## Sonuç

Toparlamak gerekirse; Wireshark, ağ trafiğini analiz etmek ve zararlı aktiviteleri tespit etmek için elimizdeki en net araç. Temel filtreleme mantığını kavradığınızda; ARP Spoofing veya DNS Poisoning gibi trafiği manipüle eden saldırıları doğrudan paket seviyesinde yakalayabiliyorsunuz. Trafiği anlık izleyebilmek ve detaylı kayıt tutabilmek de ağdaki anormal hareketleri hızlıca fark edip aksiyon almayı sağlıyor.

İşin özü aslında şu: Ağ üzerinde göremediğiniz bir tehdidi engelleyemezsiniz. Wireshark, trafiği görünür kılarak hem test süreçlerinde hem de canlı operasyonlarda bu kör noktaları tamamen ortadan kaldırıyor.
