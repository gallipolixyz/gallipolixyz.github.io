# Android Security 101: Analiz Yöntemleri ve Araçları

|  |  |  |  |  | ![](/blogs/img/android-101/1.png) |
|--|--|--|--|--|:--:|

Mobil uygulama güvenliğinde başarı, doğru analiz yöntemlerini ve araçlarını etkin kullanmaktan geçer. Android Security 101 serisinin devamı niteliğindeki bu yazıda, analiz sürecini Statik ve Dinamik olmak üzere iki ana başlık altında inceliyoruz.
## A. Statik İnceleme

Statik incelemeyi en yalın haliyle ‘kaynak kod analizi’ olarak tanımlayabiliriz. Android tabanlı bir uygulamanın kaynak koduna erişmek için çeşitli araçlar yardımıyla tersine mühendislik (reverse engineering) yöntemlerini kullanırız.

İlk adımımız her zaman uygulamanın hangi dille (Native, React Native, Flutter vb.) yazıldığını tespit etmektir.

Bu tespit, mobil uygulama güvenliğinde ‘Saldırı Yüzeyini’ (Attack Surface) belirlemenin en kritik aşamasıdır. Analiz sürecinde APKiD gibi araçlar kullanarak veya manuel dosya yapısı kontrolleriyle (lib/ ve assets/ klasörlerinin incelenmesi) uygulamanın adeta bir ‘Parmak İzi’ çıkarılır. Elde edilen bu parmak izi, kullanacağımız tersine mühendislik stratejisini doğrudan belirler.

Örneğin; Java/Kotlin tabanlı bir yapıyla karşılaştığımızda, JADX gibi araçlarla statik kod analizine ve mantıksal zafiyetlere odaklanırız. Ancak karşımızda React Native mimarisi varsa, analiz vektörümüz tamamen değişir; bu kez index.android.bundle dosyası üzerinden JavaScript kodunun incelenmesine (gerekirse Hermes bytecode çözümlemesiyle) ve hassas verilerin ifşasına yöneliriz. Dolayısıyla doğru dil tespiti, körlemesine bir kod incelemesi yapmak yerine, uygulamanın iş mantığının saklandığı gerçek konuma (Native Library, Smali Code veya JS Bundle) nokta atışı yapmamızı sağlar.

Ayrıca bu süreçte araçlar her zaman mutlak bir zorunluluk değildir (jadx da çıkan zaafiyet); araçların asıl işlevi, karmaşık tersine mühendislik çıktılarını bize daha düzenli ve okunabilir bir şekilde sunmaktır.

Örneğin, karmaşık toollara girmeden bile manuel olarak yapabileceğimiz basit kontroller vardır: Bir Android paket dosyası (APK), teknik olarak sıkıştırılmış bir ZIP dosyasından başka bir şey değildir. Bir APK dosyasının uzantısını .zip olarak değiştirip klasörü açtığınızda, karşınızda beliren dosya hiyerarşisi bile uygulamanın mimarisi hakkında size pek çok fikir verebilir.

Örnek :

![Allsafe apk](/blogs/img/android-101/2.png)

APK dosyalarını unzip ederek açmak yeterli değildir; çünkü bazı dosyalar bu şekilde rahat okunamaz durumda kalır.

Statik İnceleme İçin Bazı Araçlar:

### Apktool

Apktool, Android uygulama paketlerini (APK) açmak (unpack etmek) için kullanılan bir araçtır.

```bash
apktool d name.apk -o analiz_klasoru
```

Bu komut çalıştırıldığında Apktool;

AndroidManifest.xml dosyasını ikili (binary) formdan metin tabanlı XML formatına çözümler (decode eder), Uygulamaya ait resource dosyalarını (layout, values, drawable vb.) dışarı çıkarır, .DEX dosyalarını smali koduna çevirerek disassemble eder. Bu sayede uygulamanın izinleri, bileşenleri (Activity, Service, Receiver), hardcoded değerleri ve potansiyel güvenlik zaafiyetleri statik analiz ile incelenebilir hale gelir.

Ayrıca Apktool yalnızca APK açmak için değil, decode edilmiş kaynakları tekrar binary APK/JAR haline getirmek için de kullanılabilir.Hatta kodu veya kaynak dosyalarını değiştirdikten sonra, imzalayarak uygulamayı tekrar çalıştırılabilir bir APK haline getirebiliriz .

### Apksigner

ApkSigner, doğrudan kaynak kodu incelemek için kullanılan bir araç değildir. Bu bölüm write-up içinde bilgilendirici olması amacıyla eklenmiştir.

Android uygulamalarında kod üzerinde değişiklik yaptıktan sonra (örneğin apktool ile smali veya resource düzenlemeleri yapıldığında), uygulamanın tekrar çalıştırılabilir bir APK haline getirilmesi gerekir. İşte bu noktada ApkSigner devreye girer. Düzenlenmiş ve tekrar derlenmiş(apktool b(build edilmiş)) APK dosyasını imzalar.Dağınık haldeki build çıktısını tek bir APK haline getirir ve uygulamanın emülatör veya gerçek cihazda çalıştırılabilmesini sağlar.

Bu nedenle ApkSigner genellikle apktool ile yapılan reverse engineering çalışmalarının son adımında kullanılır. Yani analiz → değişiklik → yeniden derleme → imzalama akışının imzalama kısmını üstlenir.

Basic Kullanım:
```bash
java -jar uber-apk-signer.jar - apk /path/to/apk
```

### Jadx — Dex’ten Java’ya Dönüştürücü (Decompiler)

Olduça sık kullanılan reverse araçlarından biride Jadx dır. JADX (Dex to Java Decompiler), Android uygulamalarında bulunan .DEX dosyalarını Java kaynak koduna dönüştürmek için kullanılan bir decompiler aracıdır. Hem komut satırı hem de GUI sürümü bulunur.
![](/blogs/img/android-101/3.png)

Statik analiz sırasında JADX ve apktool genellikle birbirini tamamlayacak şekilde kullanılabilir.

### Ghidra

Ghidra; Android ve iOS uygulamalarında yer alan native binary’leri (ör. .so dosyaları) analiz etmek için sıkça tercih edilir. Jadx veya Apktool gibi araçlar Java/Smali katmanında çalışırken, geliştiricilerin performans veya güvenlik (obfuscation) amacıyla C/C++ ile yazdığı kodlara erişmekte yetersiz kalır. İşte bu “Java seviyesinin ötesine geçilmesi gereken” durumlarda (JNI, native kontroller, anti-debug mekanizmaları vb.) Ghidra devreye girer.
Bu araç, derlenmiş makine kodunu (Assembly) analiz ederek, orijinal C koduna çok yakın (pseudo-code), okunabilir bir yapıya dönüştürür (Decompile işlemi).
Analiz sürecinde genellikle APK’nın lib klasörüne odaklanılır, ancak burada seçici olmak gerekir:

-İncelenmesi Gerekenler: Özellikle libnative-lib.so veya uygulamanın adını taşıyan (ör. lib[uygulama_adı].so) dosyalar hedeftir. Uygulamanın özel iş mantığı, gizli şifreleme anahtarları veya root tespiti kodları genellikle bu dosyalara gömülür.

-Vakit Kaybı Olanlar: libflutter.so veya libunity.so gibi dosyalar genellikle hazır framework motorlarıdır. İçlerinde uygulamaya özgü bir sır barındırmadıkları için analiz sırasında bu dosyalara öncelik verilmez.

### MOBSF

MobSF; Android ve iOS uygulamalarının güvenlik analizinde, manuel incelemeye başlamadan önce uygulamanın “röntgenini çekmek” için kullanılan, hepsi bir arada (all-in-one) otomatik bir pentest çatısıdır. Kod tabanlı (statik) analizler için MobSF tüm bu süreci tek bir web arayüzünde birleştirir.

MobSF de sızma testinin keşif (reconnaissance) aşamasında kritiktir. Uygulamanın manifest dosyası, izinleri, kaynak kod içine gömülü (hardcoded) hassas verileri ve API anahtarları saniyeler içinde raporlanır.

![](/blogs/img/android-101/4.png)



## Dinamik Analiz

Yanlızca uygulamanın kaynak kodunu okumak (statik analiz ) yeterli değildir çünkü modern zararlılar ve güvenli uygulamalar kodlarını gizler (obfuscation) veya şifreler (packing). Kod ancak çalıştığı anda (Runtime) bellekte (RAM) çözülür ve gerçek yüzünü gösterir. Dinamik analiz tam olarak bu “maskenin düştüğü” anı yakalar.Dinamik Analiz ,manipülasyon ve hooking,trafik analizi, dosya ve log izleme gibi eylemler için oldukça gereklidir.

### ADB

Android SDK ile birlikte gelen ADB (Android Debug Bridge), bilgisayarınız ile Android cihazınız arasında köprü görevi gören temel bir araçtır. Genellikle emülatör, USB veya Wi-Fi üzerinden bağlı cihazlarda uygulama testi ve hata ayıklama işlemleri için kullanılır. Bağlı cihazları listelemek için adb devices komutunu, cihazlar hakkında daha detaylı bilgi almak için ise -l parametresini kullanabilirsiniz.

![](/blogs/img/android-101/5.png)

ADB ile yapılabilecek en iyi şeylerden biri logları incelemektir.

### ADB LOGCAT

Cihaz bağlantısını sağladığımıza göre, ADB yi kullanabiliriz .ADB’nin güvenlik analizlerinde en sık başvurulan özelliklerinden biri Logcat’tir.

Android sisteminin ve uygulamaların çalışma zamanındaki (Runtime) davranışlarını izlemek için kullanılan Logcat, dinamik analizin en önemli bilgi kaynaklarından biridir. Geliştiriciler bazen hata ayıklama (debug) sırasında kullandıkları hassas verileri (API tokenları, kullanıcı bilgileri veya şifrelenmemiş metinleri) log kayıtlarında unutabilirler.

Bu loglara Android Studio arayüzünden görsel olarak erişilebildiği gibi, genellikle terminal üzerinden adb logcat komutuyla erişilebilir.

Ancak bu komut çalıştırıldığında terminale binlerce satırlık sistem akışı düşer ve hedefi kaybetmek işten bile değildir. Bu gürültüyü engellemek ve sadece hedef uygulamaya ait logları izole etmek için şöyle bir filtreleme zinciri kullanabiliriz:

```bash
adb logcat --pid=$(adb shell pidof -s infosecadventures.allsafe)"
```

Bu komut zinciri, çalışan uygulamanın İşlem Kimliğini (PID) dinamik olarak tespit eder ve sadece o uygulamaya ait logları temiz bir şekilde karşınıza getirir. Böylece samanlıkta iğne aramak yerine, doğrudan uygulamanın ürettiği verilere odaklanabilirsiniz.

Örneğin:
![](/blogs/img/android-101/6.png)

### ADB İle Çalışma Zamanı (Runtime) Analizi: /data/data Klasörü

Logcat ile uygulamanın anlık verilerini gördük. Şimdi ise uygulamanın “hafızasına”, yani verilerini kalıcı olarak sakladığı yere odaklanacağız. Android dosya sisteminin en kritik dizini şüphesiz /data/data klasörüdür.

Her Android uygulaması yüklendiğinde, sistem bu dizin altında o uygulamaya özel (Sandbox) bir klasör oluşturur (Örn: /data/data/com.whatsapp/). Amacımız bu dizine erişmek ve içeride saklanan verileri okumaktır.

#### Klasör içeriği:

-shared_prefers: Uygulamanın ayarlarının tutulduğu xml dosyalarıdır.Örneğin geliştiriciler bazen kullanıcı şifrelerini, API anahtarlarını veya oturum token’larını şifrelemeden (cleartext) buraya yazar. İlk bakılacak yerdir.

-databases : Uygulamanın yerel veritabanları (SQLite .db dosyaları) burada durur.Örneğin sohbet geçmişleri, kullanıcı bilgileri vb. burada olabilir. sqlite3 aracı ile içeriği okunabilir.

-files: Uygulamanın indirdiği veya oluşturduğu genel dosyalar.

-cache: Geçici önbellek verileridir. Bazen hassas görsellerin veya verilerin kopyaları burada unutulabilir.

-lib: Uygulamanın kullandığı native kütüphaneler (.so dosyaları).

#### Bu Klasöre Nasıl Erişilir?

Yöntem 1: Root Yetkisi ile Erişim

Eğer root erişimine sahipseniz dizini takip ederek erişebilirsiniz.

```bash
adb shell
su
cd /data/data/com.hedef.uygulama
ls -al
```

Yöntem 2: Debug Modu ile Erişim (run-as)

Cihaz rootlu değilse her şey bitmiş sayılmaz. Eğer hedef uygulama geliştirme aşamasındaysa ve AndroidManifest.xml dosyasında debuggable="true" bayrağı unutulmuşsa, run-as komutu inceleyebilirsiniz.

```bash
adb shell
run-as com.hedef.uygulama
cd /data/data/com.hedef.uygulama
ls

```

Özetle ; Android uygulamasını incelerken“Insecure Data Storage” (Güvensiz Veri Depolama) açıklarını aramak için ilk bakacağınız yer /data/data klasörüdür.

### BurpSuite

Analiz sürecinin bir sonraki adımında ağ trafiği analizi ile uygulamanın dış dünyayla (sunucuyla) olan etkileşimini inceleyebiliriz.

Bu aşamada web ve mobil uygulama güvenliği testlerinin ‘İsviçre Çakısı’ kabul edilen Burp Suite, mobil cihaz ile sunucu arasına bir Proxy (vekil sunucu) gibi yerleşerek trafiği kendi üzerinden geçirir. ‘Man-in-the-Middle’ olarak adlandırılan budurum, normal şartlarda doğrudan sunucuya giden veri paketlerinin önce bizim kontrolümüze girmesini sağlar; böylece uygulamadan çıkan istekleri (Request) yakalayıp değiştirebilir, sunucudan dönen cevapları (Response) manipüle edebilir ve uygulamanın arka plandaki tüm API uç noktalarını (Endpoints) şeffaf bir şekilde keşfedebiliriz.

#### Mobilde Kullanım Adımları(Sertifikanın Emülatöre Eklenmesi):

ADB ROOT lu emülatör

Android 7.0 (Nougat) ve sonrası sürümlerde, uygulamalar varsayılan olarak kullanıcı tarafından yüklenen sertifikalara (User Certificate) güvenmez. Bu nedenle Burp Suite sertifikasını doğrudan sistem kök dizinine (System Certificate) yüklememiz gerekir.

İlk adımda sertifikayı indirmeliyiz .Bunun için yerel ağda 8080 portunda (veya yapılandırdığınız portta) dinleme yapan Burp Suite servisinin web arayüzüne http://burp üzerinden erişiyoruz. Buradaki CA Certificate bağlantısı aracılığıyla sertifikayı lokalimize indiriyoruz.

![](/blogs/img/android-101/7.png)

Daha sonra sertifikayı emülatörümüze yüklemek için formatını düzenlememiz gerekiyor.Çünkü Android sistemi, sertifikaları tanımak için özel bir isimlendirme formatı (Hash Değeri) ve .0 uzantısı talep eder. İndirdiğimiz .der uzantılı sertifikayı sistemin anlayacağı dile çevirmemiz gerekiyor.

Bunun için terminalde openssl kullanacğaız.(openssl hash değeri üretmek için kullanabilceğimiz şifreleme (cryptography) işlemleri için kullanılan açık kaynaklı, çok güçlü ve yaygın bir araçtır)

Adım 1: DER formatını PEM formatına çevirelim ;İndirdiğimiz sertifikayı okunabilir PEM formatına dönüştürüyoruz:
```bash
openssl x509 -inform DER -in cacert.der -out cacert.pem
```

2. Sertifikanın Hash değerini öğrenin: Android sisteminin dosyayı tanıması için dosya adının, sertifikanın “Subject Hash” değeri olması gerekir.
```bash
openssl x509 -inform PEM -subject_hash_old -in cacert.pem | head -1
```

3. Dosyayı yeniden isimlendirin: Çıkan hash değerini alıp sonuna .0 ekleyerek dosya ismini değiştiriyoruz. (Örneğin hash 9a5ba575 çıktıysa dosya adı 9a5ba575.0 olmalı)
```bash
mv cacert.pem 9a5ba575.0
```
Bir sonraki adımda Elimizde hazır olan 9a5ba575.0 dosyasını sistem dizinine (/system/etc/security/cacerts/) taşımamız gerekiyor.

Bunun için dosyayı önce cihazın geçici hafızasına atıp, oradan sistem klasörüne taşıyoruz ve kritik olan “izin” (permission) ayarlarını yapıyoruz:
```bash
# Dosyayı cihaza yükle
adb push 9a5ba575.0 /sdcard/

# Shell üzerinden sistem klasörüne taşı
adb shell
mv /sdcard/9a5ba575.0 /system/etc/security/cacerts/# Sertifikanın sistem tarafından okunabilmesi için 644 iznini verin
chmod 644 /system/etc/security/cacerts/9a5ba575.0
```
terminalden kontrol ettiğimizde dosya üzerindeki izinleri böyle gözükmeli, eğer bu izni vermezseniz sistem sertifikayı okuyamaz.

![](/blogs/img/android-101/8.png)

Sertifikanın yüklenişini doğrulamak için emülatörümüzden ; Settings > Security & Privacy > More… > Encryption & Credentials > Trusted Credentials > SYSTEM takip edersek sertifikayı görmemiz gerekir.

![](/blogs/img/android-101/9.png)

Sertifikamızı sisteme tanıttıktan sonra, Android emülatör üzerinden yapılan ağ trafiğini bilgisayarımızdaki Burp Suite aracılığıyla analiz edebiliriz. Bunun için Burp Suite ve emülatör tarafında uygun proxy yapılandırmasının yapılması yeterlidir.

#### Bu konfigürasyon için

Öncelikle Burp Suite üzerinde proxy ayarını yapılandırıyoruz:

Proxy > Proxy Settings > Add

Bind to address: All interfaces

Port: 8081

Bu ayar, Burp Suite’in emülatörden gelecek HTTP/HTTPS trafiğini dinlemesini sağlar.
![](/blogs/img/android-101/10.png)

Android emülatörde proxy yapılandırmasını aşağıdaki şekilde yapıyoruz:

Settings >Advanced options > Proxy

Proxy type: Manual

Proxy hostname:127.0.0.1

Proxy port: 8081
![](/blogs/img/android-101/11.png)

Son olarak Tüneli Oluşturun: Terminal üzerinden emülatörün 8081 portunu, bilgisayarınızın 8081 portuna bağlayın:

```bash
adb reverse tcp:8081 tcp:8081
```

bu şekilde bağlantıyı kurmuş olduk.Artık burpsuite üzerinden trafiği inceleyebiliriz.

## FRİDA
![](/blogs/img/android-101/12.png)
Frida, çalışan bir uygulamayı runtime sırasında enjekte ederek analiz etmeye ve manipüle etmeye yarayan dinamik enstrümantasyon aracıdır. Frida’nın çalışma mantığını anlamak için sistemi üç temel bileşen üzerinden düşünmek gerekir: Client, Server ve iletişim katmanı.

### Frida Client

Frida Client, analiz işlemini başlatan taraftır ve genellikle host makinede (bilgisayarımızda) çalışır.
CLI (frida, frida-ps) veya Python API üzerinden uygulamaya hook atma, fonksiyonları izleme ve script çalıştırma işlemleri client tarafından gerçekleştirilir.

Client, doğrudan uygulamayla değil, cihaz üzerinde çalışan Frida Server ile iletişim kurar.

### Frida Server

Frida Server, Android emülatör veya fiziksel cihaz üzerinde çalışan bileşendir.
Root yetkisi gerektirir ve hedef uygulamanın belleğine enjekte olarak:

-Fonksiyon hook’lama

-Method override

-Native / Java katmanı izleme

işlemlerini mümkün kılar.

Varsayılan olarak Frida Server, TCP 27042 portu üzerinden bağlantı kabul eder.

### Frida Client — Server İletişimi (D-Bus Benzeri IPC Mantığı)

Frida’nın client–server iletişimi, mimari olarak IPC (Inter-Process Communication) mantığına dayanır. Linux sistemlerde bu yapı sıklıkla D-Bus benzeri bir yaklaşım olarak açıklanır.

Özetle:

Client → Server’a komut gönderir

Server → hedef proses içinde enjekte edilmiş ajan üzerinden bu komutları uygular

Yanıtlar tekrar client’a iletilir

Bu iletişim, Frida’nın kendi protokolü üzerinden TCP soketi aracılığıyla sağlanır.

Frida’nın çalışma mantığını anlamak için bu üç kavramı (Client, Server, D-Bus) bir bütünün parçaları olarak düşünmek gerekir.
Frida’yı Android Emülatöre Kurma

#### Frida Server’ı emülatöre eklemek için:

Öncelikle emülatörünüzün işlemci mimarisini (genellikle x86_64) kontrol edin ve uygun frida-server sürümünü Frida GitHub sayfasından indirin.

Frida-Server’ı Emülatöre Gönderme ve Çalıştırma

Dosyayı Cihaza Yükleyin:
```bash
adb push frida-server /data/local/tmp/
```
Gerekli İzinleri Verin:
```bash
adb shell "chmod 755 /data/local/tmp/frida-server"
```
Frida-Server’ı Başlatın:
```bash
adb shell "/data/local/tmp/frida-server &"
```
Bağlantıyı Doğrulama:
```bash
frida-ps -Uai
```


Eğer listede yüklü uygulamaları görebiliyorsanız, frida başarılı bir şekilde kurulmuş demektir.

Özetle, Android uygulama güvenliği tek bir araca veya sihirli bir komuta indirgenebilecek bir alan değil; doğru analiz yöntemlerini, doğru noktada ve birlikte kullanabilmeyi gerektiriyor. Bu yazıda ele aldığımız statik ve dinamik analiz teknikleri, bir Android uygulamasını gerçekten “anlamanın” ve yüzeyin altında saklanan güvenlik problemlerini ortaya çıkarmanın temelini oluşturuyor. Android Security 101 serisinin devamında ise bu temelin üzerine daha derin bypass ve lab senaryoları ekleyeceğiz.
