# Saldırganın Yol Haritası

Bu yazı, bir savunma uzmanının gözünden, saldırganın sistemde atabileceği adımları ve bu adımları nasıl tespit edebileceğimizi anlamak amacıyla hazırlanmıştır. Aynı zamanda her aşamada uygulanabilecek savunma ve tehdit avcılığı taktiklerine de yer verilmektedir.

## **İlk Erişim (Initial Access)**

Saldırganların sistemlere sızmak için kullandığı birçok farklı ilk erişim taktiği bulunmaktadır. Bu taktikler arasında kimlik avı gibi sosyal mühendislik yöntemleri, sistemdeki güvenlik açıklarından yararlanma, kötü amaçlı yazılım yükleme ya da sürücü aracılığıyla uzaktan kod yürütme gibi yöntemler yer alır.

İşte bizim için önemli olan, saldırgan bu ilk adımı attığında onu erken aşamada yakalayabilmektir. Bu noktada, tehdit avı sürecinin ilk adımı saldırganın davranışlarını anlamaya çalışarak bu erişim girişimlerini tespit etmektir.

Bu anlayışı oluşturabilmek için, üç farklı senaryo üzerinden ilerleyeceğiz.

![image1](/blogs/img/saldirganin-yol-haritasi/image1.png)

**Kimlik Doğrulama Sürecinde Deneme Yanılma**

Bu tür saldırıların çoğunda, saldırgan geçerli bir kimlik bilgisi elde etmeden önce birçok başarısız giriş gerçekleştirir. Bu yüzden ilk dikkat edilmesi gereken nokta, kimlik doğrulama kayıtlarıdır.

Eğer bir sorgu diliyle analiz yapılacak olsaydı, bu sorgu tüm başarısız oturum açma denemelerini listeleyen bir komut olurdu. Böylece belirli bir IP adresinden, belirli bir zaman dilimi içerisinde art arda yapılan başarısız giriş denemeleri tespit edilebilir. Bu durum, sistemin bir brute force saldırısına maruz kaldığını gösterebilir.

Ancak burada atlanmaması gereken önemli bir detay daha var: Eğer saldırgan birçok başarısız girişin ardından bir şekilde başarılı olduysa?

Bunu görebilmek için, saldırı yapan IP adreslerine ait başarısız ve başarılı giriş kayıtlarını birlikte analiz etmek gerekir. Böylece yalnızca denemelerde kalmış mı, yoksa sisteme erişim sağlayabilmiş mi bunu anlamış oluruz.

## **Web Uygulamalarına Yönelik Saldırılar**

Başka yaygın saldırı vektörü de web uygulamalarıdır. Bu tür saldırılar genellikle şu adımlarla ilerler: Hedef sistem hakkında bilgi toplama (kullanılan teknolojiler, açık endpoint’ler vb.), güvenlik açıklarının tespiti, bu açıklardan faydalanarak sisteme sızma girişimi.  
Eğer elimizde bir web sunucusu varsa ve bu sunucuya yönelik taramalar gerçekleştirilmişse, örneğin kullanıcı bilgileri tahmin edilerek giriş yapılmışsa, sıradaki aşama bilgi toplama (enumeration) olacaktır. 

Bu süreçte yapılan isteklerin çoğu HTTP üzerinden gerçekleştiği için filtreleme sorgularında genellikle http protokolü ve 80 numaralı port referans alınır. 

Bu analiz sırasında, sunucudan alınan HTTP cevapları oldukça anlamlı hale gelir. Özellikle şu durumlara dikkat edilmelidir:

404 : Bu kod, saldırganın rastgele dizinleri deneyerek sistemdeki endpoint’leri keşfetmeye çalıştığını gösterir.

200 / 301 / 302 : Bu kodlar, erişim sağlanan kaynakların bulunduğunu ya da yönlendirme yapıldığını belirtir. Eğer saldırgan birçok denemenin ardından bu tür cevaplar almaya başladıysa, sistemde belirli endpoint’lere ulaşmış olabilir.

Bu yüzden analiz sürecinde önce 404 sayılarındaki artış, ardından başarılı yanıt (200, 301, 302\) kodlarının olup olmadığı incelenmelidir.

![image2](/blogs/img/saldirganin-yol-haritasi/image2.png)

Saldırının başarıya ulaşıp ulaşmadığını gösteren en güçlü ipuçlarından biri de, saldırganın sisteme girdikten sonra çalıştırdığı komutlardır. Özellikle şu parametrelerin geçtiği log kayıtları dikkatle incelenmelidir: whoami,id,ifconfig,hostname…

Bu komutlar, saldırganın sistem içi haklarını anlamaya çalıştığını ve sistem hakkında bilgi topladığını gösterir.

Buraya kadar, saldırganların ilk erişim adımlarını nasıl gerçekleştirdiğini ve bu adımların loglar ve sorgular aracılığıyla nasıl tespit edilebileceğini örnek senaryolarla açıklamaya çalıştım.Tehdit avcılığı sürecinde, bu erken işaretleri fark edebilmek büyük önem taşır. Çünkü saldırganın sistemde yayılmadan önceki ilk adımında fark edilmesi, bütün saldırı zincirini boşa çıkarabilir.

Saldırı zincirinde bir diğer yaygın ilk erişim yöntemi de zararlı yazılımların (malware) kullanıcı tarafından indirilmesi veya açılmasıdır. Bu tür dosyalar çoğunlukla bir e-posta eki şeklinde ya da bir web tarayıcısı üzerinden kullanıcıya ulaştırılır.

![image3](/blogs/img/saldirganin-yol-haritasi/image3.png)

Zararlı yazılım, hedef sistemde çalıştırılmadan önce genellikle e-posta istemcisi veya tarayıcı üzerinden indirilir. Bu gibi olayları izlemek için Windows sistemlerde kullanılan önemli loglardan biri de Sysmon Loglarinda EventID 11 ’dir. Bu event, bir dosyanın sisteme yazıldığını yani oluşturulduğunu veya indirildiğini ifade eder.

Bu kayıt sayesinde; Kullanıcının manuel olarak bir dosya indirip indirmediği, arka planda çalışan bir uygulamanın sessizce zararlı bir dosya bırakıp bırakmadığı gibi davranışlar gözlemlenebilir.

Bu noktada yapılacak ilk adım, Sysmon Loglarinda EventID 11 üzerinden bir filtreleme gerçekleştirmektir. Bu filtreleme ile birlikte, sisteme son zamanlarda indirilen ya da oluşturulan dosyalar listelenir. Eğer saldırganın hedef makineye malware bırakma girişimi varsa, bu kayıtlar genellikle ilk ipuçlarını barındırır.

Analizin bir sonraki aşamasında ise bu dosyaların ne gibi aktiviteler tetiklediği araştırılır. Özellikle şüpheli dosyaların çalıştırılmasıyla oluşabilecek: Yeni oluşturulmuş alt işlemler (child processes), gerçekleşen ağ bağlantıları (network connections) yakından izlenmelidir.

Örneğin; `.lnk` (kısayol) uzantılı dosyalar genellikle zararlı amaçlarla kullanılır. Bu dosyalar görünüşte zararsız bir kısayol gibi görünse de, arka planda komut çalıştırabilir ya da başka bir dosya indirme mekanizması tetikleyebilir.

Bu tür dosyaların davranışlarını analiz etmek, saldırının sadece tespit edilmesini değil, aynı zamanda sistemde hangi aşamaya geldiğinin anlaşılmasını da sağlar.

## **Yürütme (Execution)**

Bu aşama, saldırganın artık sistem içerisinde bir şekilde kod çalıştırabildiği ve daha fazla erişim sağlamak için aktif eylemlere geçtiği adımdır. Başka bir ifadeyle: Saldırgan artık içeridedir.

Hedefinde, ya sistemin kontrolünü ele geçirmek ya da bir sonraki adım olan yanal hareket (lateral movement) için ortam hazırlamak vardır.

Yürütme aşamasında saldırganın başvurabileceği birkaç temel teknik bulunmaktadır. Bu tekniklerin her biri, farklı sistem bileşenlerini kullanarak zararlı kodların çalıştırılmasına olanak tanır. Bunlardan bazılarını sizler için derledim:

### **1\) Komut Satırı Araçları ile Yürütme**

Saldırganlar genellikle `cmd.exe` ya da `powershell.exe` gibi komut satırı araçları üzerinden sistemde komut yürütürler. Bu araçlar kullanılarak normal dışı davranışlar sergilenebilir; örneğin:

* Şüpheli komutların çalıştırılması

* Çok sayıda ardışık komut kullanımı

* Ağ bağlantısı kuran betikler

![image4](/blogs/img/saldirganin-yol-haritasi/image4.png)

Bu aktiviteleri tespit etmek için, log verileri üzerinde `cmd.exe` ve `powershell.exe` içeren process event kayıtlarını filtrelemek gerekir.

Filtreleme sonrasında elde edilen veri büyük olabilir. Ancak endişelenmeye gerek yok — odaklanmamız gereken şey, dikkat çeken anormalliklerdir. Aşağıdaki ifadeler genellikle şüpheli yürütmelerin işaretçisidir:

* invoke, invoke-expression, iex

* \-enc, \-encodedcommand

* \-noprofile, \-nop, bypass

* \-c, \-command, executionpolicy, \-ep

* webrequest, download, iwr, curl

Bu ifadelerden birkaçı dahi bir arada geçiyorsa, saldırgan muhtemelen uzaktan kod çalıştırmaya çalışıyordur.

###  **2\) Yerleşik Sistem Araçlarının Kötüye Kullanımı**

Yürütme sadece komut satırı araçlarıyla sınırlı değildir. Saldırganlar, işletim sistemiyle birlikte gelen bazı yerleşik sistem araçlarını da kötü amaçlarla kullanabilir.

Bu durumda sistem dosyaları, tıpkı bir ebeveyn–çocuk (parent-child) ilişkisi içinde çalışır. Yani ana süreç (örneğin `svchost.exe`) tarafından başlatılan başka bir alt süreç (`malware.exe`) zararlı olabilir.

Bu ilişkiyi analiz etmek için process tree (süreç ağacı) incelenmeli ve anormal parent-child kombinasyonları tespit edilmelidir. Örneğin, `winword.exe` → `powershell.exe` zinciri şüpheli olabilir.

###  **3\) Exploitation for Client Execution**

Bu teknik, saldırganın sistemdeki bir uygulama zafiyetinden faydalanarak komut yürütmesidir.

En bilinen örneği, zararlı makro içeren bir Word belgesinin açılmasıdır. Kullanıcı belgeyi açtığında arka planda powershell ya da benzeri bir araç çalıştırılır.

###  **4\) Inter-Process Communication**

Bazı saldırganlar, doğrudan yürütme yerine başka bir sürece müdahale ederek çalışmayı tercih eder. Bu teknik, bir işlem içerisine kod enjekte edilerek (CreateRemoteThread, DLL Injection gibi yöntemlerle) yürütme gerçekleştirilmesi anlamına gelir.

###  

### **5\) User Execution (Kullanıcı Tetikli Yürütme)**

Bu teknik, saldırının kullanıcı etkileşimiyle tetiklenmesi üzerine kuruludur. Örneğin:

* Kullanıcının zararlı bir .exe, .lnk ya da Office dosyasını açması

* Bir e-posta içeriğindeki zararlı bağlantıya tıklaması

Bu durumda saldırgan, doğrudan kullanıcıyı kullanarak kod çalıştırmış olur.

###  **6\) Signed Binary Proxy Execution**

Burada saldırganlar, sistemde güvenilir olarak imzalanmış dosyaları zararlı kodları yürütmek için araç olarak kullanır. Bu dosyalar genellikle güvenlik sistemlerinden kaçabilen dosyalardır. Örnekler:

* rundll32.exe

* regsvr32.exe

* wmic.exe

* mshta.exe

Bu binary dosyalar zararsız görünse de, arkalarında zararlı bir komutu taşıyor olabilirler.

### **7\) Native API Kullanımı**

Saldırganlar bazen doğrudan Windows Native API'lerini kullanarak yürütme gerçekleştirebilir. Örneğin WinExec(), CreateProcess() gibi işlevler, işletim sistemine doğrudan sistem düzeyinde komut çalıştırma talimatı verir.

Bu teknik daha çok gelişmiş saldırganlar tarafından tercih edilir ve genellikle EDR sistemleri tarafından tespit edilmesi daha zordur.

### **8\) Scripting ve Programlama Araçlarının Kullanımı**

Bazı sistemlerde önceden yüklü gelen programlama ortamları (Python, Perl, vb.) ya da scripting araçları (örneğin PowerShell ISE, Visual Studio Tools) saldırganlar tarafından yürütme için kullanılabilir.

Özellikle bu araçlar üzerinden cmd.exe başlatılıp belirli bir IP adresine ağ bağlantısı kuruluyorsa bu durum, tipik bir reverse shell davranışı olabilir.

Bu gibi durumları tespit etmek için process.name ya da parent.name filtreleri kullanılarak süreçlerin kim tarafından başlatıldığı kontrol edilmelidir.

### **Savunmadan Kaçınma / Defense Evasion**

![image5](/blogs/img/saldirganin-yol-haritasi/image5.png)

Buraya kadar saldırganın sistem üzerinde gerçekleştirdiği faaliyetlere odaklandık. Bu bölümde ise saldırganın izini nasıl gizlemeye çalıştığına ve bu girişimlerin nasıl tespit edilebileceğine değineceğim.

Saldırgan, yürütme adımında kullandığı komutlar ya da zararlı yazılımlar sayesinde sisteme sızdıktan sonra, bu faaliyetlerinin tespit edilmesini önlemek amacıyla bazı savunma mekanizmalarını devre dışı bırakma yoluna gider. Örneğin, Windows Defender gibi güvenlik çözümleri hedef alınabilir. Bu tür durumları analiz edebilmek için, savunma mekanizmalarının devre dışı bırakılıp bırakılmadığını kontrol etmek gerekir. Özellikle gerçek zamanlı taramanın kapatılıp kapatılmadığını izlemek bu noktada kritik bir göstergedir.

Bir diğer yaygın savunmadan kaçınma yöntemi, olay günlüklerinin silinmesidir. Sistem üzerinde çalışan güvenlik araçlarının oluşturduğu log kayıtları, saldırgan davranışlarının tespiti için büyük önem taşır. Bu nedenle saldırganlar, faaliyetlerini gizlemek amacıyla bu kayıtları silmeye çalışabilir. Bu durumu analiz etmek için, Windows Event ID 1102 (günlük silme işlemleri) ile filtreleme yaparak sistemde logların silinip silinmediğini tespit edebiliriz.

Son olarak, saldırganın kötü amaçlı kodunu doğrudan çalıştırmak yerine, güvenilir görünen bir sürecin içine gizleyerek çalıştırma tekniğinden bahsedelim. Bu tür tekniklerde zararlı kod, explorer.exe, svchost.exe veya chrome.exe gibi sık kullanılan sistem süreçlerine enjekte edilir. Burada amaç, zararlı işlemi sistemin doğal bir davranışı gibi göstermek ve tespit edilmekten kaçınmaktır. Bu tür aktiviteleri izlemek için Sysmon’un CreateRemoteThread etkinliği kullanılabilir. Çünkü bir işlem, başka bir işlem içerisinde thread açtığında bu durum loglanır. Bu loglar Sysmon Loglarında Event ID 8 ile izlenebilir.

### 

### 

### **Kalıcılık (Persistence)**

![image6](/blogs/img/saldirganin-yol-haritasi/image6.png)

Bir saldırgan, erişim sağladığı bir sistem ya da ağ üzerinde etkinliğini sürdürebilmek için kalıcılığını sağlamak zorundadır. Aksi takdirde, sistem yeniden başlatıldığında veya kullanıcı oturumu kapattığında bağlantısı kesilecektir. Bu nedenle saldırganlar, kalıcılığı sağlamak adına çeşitli teknikler kullanırlar. Bu adım genellikle ilk yürütme işlemlerinden hemen sonra gerçekleştirilir.

Kullanılan yöntemlerden biri zamanlanmış görevler (Scheduled Tasks) oluşturmaktır. Bu görevler, belirli komutların ya da betik dosyalarının belli bir zamanda ya da belirli bir tetikleyici gerçekleştiğinde otomatik olarak çalıştırılmasını sağlar. Saldırganlar da bu mekanizmayı kötüye kullanarak sisteme olağandışı görevler ekler. Böylece belirli bir zamanda sisteme yeniden bağlanabilir ya da kötü amaçlı yazılımını otomatik olarak çalıştırabilir. Bu tür durumları tespit etmek için güvenlik analistleri, log verilerini Windows Event ID 4698 üzerinden ve komut satırında schtasks sorgusuyla filtreleyerek incelerler. Bu şekilde sistemde alışılmadık bir zamanlanmış görev olup olmadığı anlaşılabilir.

Bir diğer kalıcılık yöntemi ise kayıt defteri (Registry) üzerinde yapılan değişikliklerdir. Registry, işletim sistemi ayarlarının ve kullanıcı yapılandırmalarının tutulduğu kritik bir veri tabanıdır. Örneğin, sistem açıldığında hangi programların otomatik olarak çalıştırılacağı gibi ayarlar burada yer alır. Saldırganlar, kötü amaçlı yazılımlarını bu otomatik başlangıç noktalarına ekleyerek, her sistem açıldığında zararlı yazılımlarını başlatmayı hedefler.

Bu tür kayıt defteri değişiklikleri, Sysmon ile izlenebilir. Sysmon, Registry üzerindeki önemli değişiklikleri Sysmon Loglarında Event ID 13 ile kaydeder. Bu veriler üzerinden yapılacak analiz, sistemde saldırganın kalıcılık sağlamaya çalışıp çalışmadığını anlamak açısından oldukça değerlidir.

### **Komuta ve Kontrol (Command and Control – C2)**

![image7](/blogs/img/saldirganin-yol-haritasi/image7.png)

Saldırgan sisteme sızdı, kötü amaçlı yazılımlarını yerleştirdi ve kalıcılık sağlamayı başardı. Artık sistemle iletişim kurması gerekmektedir. Bu iletişim, saldırganın daha fazla güvenlik ihlali gerçekleştirmesini ve nihai hedeflerine ulaşmasını sağlar. Kurulan bu bağlantı, saldırgan ile hedef sistem arasında bir "yaşam hattı" işlevi görür. Komut gönderme, veri alma veya sistem üzerindeki eylemleri uzaktan kontrol etme işlemleri bu kanal aracılığıyla gerçekleştirilir.

Saldırganlar bu iletişimi kurmak için genellikle DNS, ICMP, HTTP/HTTPS gibi standart ve meşru görünen protokolleri tercih ederler. Bu protokoller üzerinden geçen trafik, çoğu zaman normal kullanıcı etkinliklerine benzediği için tespit edilmesi zor olabilir. Ayrıca bu iletişim, bulut tabanlı ve şifreli özel sunucular üzerinden de yürütülebilir. Örneğin, HTTPS üzerinden yapılan C2 trafiği şifreli olduğundan içeriği doğrudan görüntülemek mümkün değildir.

Bu nedenle bir savunmacı olarak dikkat edilmesi gereken temel nokta; düzenli ağ trafiği arasında gizli iletişim kanallarını tespit edebilmektir. Standart protokoller kullanılsa da, trafik hacmindeki anormallikler, yönlendirilen veri miktarındaki artış veya olağandışı saatlerde gerçekleşen bağlantılar gibi ipuçları, bir C2 bağlantısına işaret edebilir.

#### **Örnek: DNS Tabanlı C2**

Bazı saldırganlar, C2 iletişimini DNS protokolü üzerinden gizlemeye çalışır. Bu yöntemde, çok sayıda benzersiz domain sorgusu oluşturularak zararlı iletişimler yürütülür. Bu sorgular genellikle rastgele oluşturulan alt domainler içerir. Savunmacı, bu gibi olağandışı ve yüksek hacimli DNS sorgularını gözlemleyerek potansiyel C2 iletişimini fark edebilir. Eğer bağlantı kurulmuşsa, geriye dönük analiz yapılarak bağlantı öncesindeki aktiviteler de incelenebilir.

#### **Örnek: Bulut Uygulamaları Üzerinden C2**

Saldırganlar, ağ güvenlik önlemlerini atlatmak için Google Drive, Discord, Telegram gibi yasal ve sık kullanılan bulut uygulamalarını da kötüye kullanabilir. Bu teknik, C2 bağlantısını tipik bir web bağlantısı gibi gizler. Bu durumda savunmacılar, log verileri üzerinde bu uygulamaların trafiklerini analiz ederek olağandışı bir iletişim olup olmadığını tespit etmeye çalışırlar. Örneğin, belirli bir kullanıcıdan gelen sürekli ve yoğun Telegram trafiği şüphe uyandırabilir.

#### **Örnek: HTTP/HTTPS (80/443) Üzerinden C2**

Komuta ve kontrol iletişimi çoğu zaman HTTP ya da HTTPS protokolleri üzerinden gerçekleşir. Bu yöntemde saldırgan, kendi kontrolündeki domainleri kullanarak komut ve veri alışverişini gerçekleştirir. HTTPS trafiği şifreli olduğundan içerik doğrudan görülemez, ancak olağandışı domain adları veya yüksek miktarda veri transferi gibi anomaliler savunma ekipleri için önemli sinyallerdir. Bu nedenle proxy ve firewall logları, tespit açısından büyük önem taşır.

### 

### 

### 

### 

### 

### 

### 

### 

### **Yetki Yükseltme (Privilege Escalation)**

![image8](/blogs/img/saldirganin-yol-haritasi/image8.png)

Privilege escalation, saldırganın sistemde sahip olduğu mevcut yetki seviyesinden daha yüksek bir yetki elde etmesi anlamına gelir. Bu süreçte saldırgan;

* Sistemdeki açıklardan (zafiyetlerden) faydalanabilir,

* Hatalı yapılandırılmış erişim izinlerini kötüye kullanabilir,

* Servis veya host yapılandırmalarındaki eksiklikleri istismar edebilir.

Amaç, genellikle sistem yöneticisi (administrator/root) yetkilerine ulaşıp daha geniş erişim kazanmak ve sistemde kalıcılığı sağlamaktır.

#### **Örnek: PrintSpoofer**

Saldırgan, sisteme düşük yetkili bir kullanıcı hesabıyla sızar ve beraberinde PrintSpoofer.exe adlı bir aracı getirir. Bu araç, sistemde hatalı yapılandırılmış bir servis olan Print Spoofer'ın istismar edilmesiyle çalışır.  
Saldırgan bu dosyayı çalıştırdığında, sistemde normalde yalnızca yüksek yetkili kullanıcılar tarafından çalıştırılabilecek işlemleri başlatabilir. Böylece kendisini yüksek yetkili bir kullanıcı gibi sistem tarafından tanıtmayı başarır. Bu, bir anlamda “yetki kimliği değişimi” ya da “kılık değiştirme” gibidir.

Savunma ekiplerinin bu tür yetki yükseltme girişimlerini tespit edebilmesi için dikkat etmesi gereken bazı temel noktalar vardır:

* Hangi araçlar çalıştırıldı ve bu araçlar kim tarafından başlatıldı?

* Bir işlem, yetki seviyesini beklenmedik şekilde artırdı mı?

* Sistem servislerinde olağandışı davranışlar var mı?

* Normalde sadece admin tarafından çalıştırılması gereken işlemler, standart kullanıcı hesapları tarafından mı tetiklendi?

Bu sorulara verilecek doğru cevaplar, yetki yükseltme saldırılarının erken safhada tespit edilmesini sağlayabilir.

### **Kimlik Bilgilerine Erişim (Credential Access)**

![image9](/blogs/img/saldirganin-yol-haritasi/image9.png)

Credential Access, saldırganların sistemde daha fazla yetki kazanmak amacıyla kullanıcı adı, parola ve parola hash’leri gibi kimlik bilgilerini ele geçirmeye çalıştıkları taktikleri kapsar.  
Bu bilgiler sayesinde saldırgan, sisteme yetkili bir kullanıcı gibi giriş yapabilir ve ayrıca yanal hareket (lateral movement) için yeni sistemlere erişim sağlar.

Saldırganlar bu taktik için farklı teknikler kullanabilir:

#### 

#### 

#### 

#### **1\) LSASS Dumping (RAM’den Şifre Çekme)**

LSASS (Local Security Authority Subsystem Service), oturum açmış kullanıcıların kimlik bilgilerini RAM üzerinde geçici olarak saklar.  
Saldırganlar bu belleği hedef alarak, kimlik bilgilerini dump edebilirler.

Saldırganın amacı, hedef sistemde kimlik bilgilerini ele geçirmektir. Bu kapsamda, Windows işletim sisteminde oturum açmış kullanıcıların parolalarını veya parola hash’lerini bellekte tutan lsass.exe süreci hedef alınır.

Bu süreçte, saldırgan Mimikatz adlı aracı kullanarak LSASS’ın belleğinin bir kopyasını alır. Bellek dökümü genellikle lsass.dmp adlı bir dosya olarak kaydedilir.

Daha sonra bu döküm dosyası üzerinden analiz yapılarak, sistemde oturum açmış kullanıcıların kimlik bilgileri (özellikle NTLM hash’leri) elde edilir.

#### **2\) DCSync Saldırısı (Active Directory Hash Çalma)**

DCSync, saldırganın kendisini bir domain controller (DC) gibi göstermesiyle gerçekleştirdiği bir saldırı türüdür.  
Bu teknik sayesinde saldırgan, kullanıcıların hash'lerini domain controller’dan çeker.

Saldırgan, etki alanındaki (domain) kullanıcı hesap bilgilerini ele geçirmek amacıyla Mimikatz aracını kullanır. Bu araç içerisinde yer alan dcsync modülü sayesinde, doğrudan Domain Controller üzerinden kullanıcıların kimlik bilgilerine ait veriler çekilebilir.

Bu teknikle saldırgan, Active Directory replikasyon özelliğini taklit ederek sanki başka bir Domain Controller’mış gibi davranır ve kullanıcı hesaplarına ait NTLM hash’lerini elde eder.

Özellikle hedeflenenler arasında Domain Admin gibi yüksek ayrıcalıklara sahip hesaplar yer alır. Bu hesapların kimlik bilgileri ele geçirildiğinde, saldırgan etki alanı (domain) genelinde tam yetkiyle hareket edebilir.

Genel olarak bu tür saldırıları tespit etmek için, LSASS sürecine dışarıdan erişim olup olmadığı kontrol edilmelidir. Ayrıca, DCSync gibi yöntemlerle yapılan yetki dışı domain replikasyon talepleri dikkatle izlenebilir.

Bununla birlikte, sistemde Mimikatz gibi kimlik bilgisi çıkarımına yönelik araçların çalıştırıldığına dair işaretler loglar üzerinden araştırılacaktır. Özellikle Windows Event ID 4624  ve Windows Event ID 4688 üzerinde analiz yapılması faydalı olacaktır.

### 

### 

### **Yanal Hareket (Lateral Movement)**

![image10](/blogs/img/saldirganin-yol-haritasi/image10.png)
Saldırganların bir sistemden başka sistemlere geçiş yaparak iç ağda yatay olarak ilerlemesini ifade eder. Bu taktik genellikle, daha önce elde edilen kimlik bilgileri (Credential Access) kullanılarak gerçekleştirilir.

Bu aşamada daha fazla sisteme erişim sağlamak, daha hassas/verimli hedeflere ulaşmak (dosya sunucuları, veritabanları…), kalıcılık sağlamak gibi hedefleri amaçlarlar.

Bu hareketlilik sırasında genellikle sistem yöneticileri tarafından kullanılan meşru araçlar kötüye kullanılır. Bu nedenle tespit edilmesi oldukça zordur.  
Yaygın Kullanılan Araçlar: PowerShell Remoting, PsExec,WM,Remote Desktop Protocol (RDP)

Bu araçlar sayesinde saldırgan, dikkat çekmeden komut çalıştırabilir veya dosya transferi yapabilir.

WMI ile bir örnek vermek istersek : Bir saldırgan daha önce ele geçirdiği bir kullanıcı hesabıyla sisteme eriştiğini varsayalım. İç ağda yanal hareket gerçekleştirmek için WMI (Windows Management Instrumentation) aracını kullanabilir. WMI, sistem yöneticileri tarafından uzaktan komut çalıştırmak için yaygın olarak kullanılan bir araçtır. Bu durum saldırgan tarafından kötüye kullanılabilir.

Yanal hareket genellikle iç ağda ve sistemler arası gerçekleştiği için, geleneksel güvenlik çözümleriyle fark edilmesi zordur. Ancak şu adımlar takip edilebilir: Uzak komut çalıştırma işlemlerine dair loglar (PowerShell, WMI, PsExec gibi), beklenmedik zamanlarda veya beklenmedik sistemler arası bağlantılar, belirli kullanıcıların olağandışı yetkilerle sistemlere erişim denemeleri…

**Sonuç**

Bütün bu anlatılanlar içerisinde daha karmaşık bir süreçtir. Bu süreçte her bir adım, hem saldırganlar için bir fırsat hem de savunmacılar için iyi bir tespit noktasıdır. Bu yazıda ki her taktik, bir savunma uzmanının, sistemi koruma refleksini güçlendirmesi adına somut bir rehber olabilir. Unutulmamalıdır ki, bir saldırganı en erken safhada durdurabilmek, sistemin genel güvenliği açısından en kritik avantajı sağlar. Tehditleri öngörebilmek için saldırgan gibi düşünmeli, ancak savunmacı gibi hareket etmeliyiz.