# Android Native Katmanı: ELF ve Dinamik Linker

![](/blogs/img/everNote/blog.jpg)

Bu yazıda Android uygulamalarının native (C/C++) katmanını baştan sona inceleyeceğiz. Konuya hiçbir ön bilgiyle başlamıyoruz: C bilmiyor olabilirsiniz, linklemenin ne olduğunu bilmiyor olabilirsiniz, hatta “native kod” teriminin tam olarak neye karşılık geldiğini bilmiyor olabilirsiniz - yine de bu yazıyı rahatlıkla takip edebilirsiniz.

Bu yazıyı, kendi çalışma sürecimde hazırladığım ders notlarını derleyerek oluşturdum. Özellikle **Android reverse engineering, mobil uygulama güvenliği ve native analiz** çalışmalarında ihtiyaç duyulan temel kavramları anlaşılır bir şekilde açıklamayı amaçladım.

---

## Ön Bilgiler

### Bir Android uygulaması nelerden oluşur?

APK dosyası aslında bir **zip arşividir**. Uzantısını `.zip` olarak değiştirip doğrudan açabilirsiniz. İçinde şunları bulursunuz:

```
app.apk
├── AndroidManifest.xml    → uygulamanın kimlik bilgileri, izinler
├── classes.dex            → Java/Kotlin kodunun derlenmiş hali
├── classes2.dex           → (kod büyükse birden fazla olur)
├── resources.arsc         → metinler, renkler, boyutlar
├── res/                   → görseller, layout dosyaları
├── assets/                → geliştiricinin koyduğu ham dosyalar
├── lib/                   → NATIVE KÜTÜPHANELER — bizim konumuz
│   ├── arm64-v8a/
│   │   └── libnative-lib.so
│   ├── armeabi-v7a/
│   └── x86_64/
└── META-INF/              → imza dosyaları
```

Bizi asıl ilgilendiren yer `lib/` klasörüdür.

### Neden bir uygulamada C/C++ kodu olur?

Java ve Kotlin, Android’in ana dilleridir. Ama bazı durumlarda geliştiriciler C veya C++ tercih eder ve bunun dört temel sebebi vardır.

Birincisi **performans**tır: video işleme, oyun motorları, ses kodekleri, görüntü işleme gibi işler Java’da yavaş kalır. İkincisi, **mevcut bir kütüphaneyi kullanma** ihtiyacıdır — OpenSSL, FFmpeg, SQLite gibi kütüphaneler zaten C ile yazılmıştır; yeniden yazmak yerine olduğu gibi bağlanır. Üçüncüsü **platformlar arası kod paylaşımı**dır: aynı C++ kodu hem Android’de hem iOS’ta çalışabilir. Dördüncüsü ise bizi asıl ilgilendiren sebeptir: **kod gizleme**.

> **Neden önemli?** Java/Kotlin kodu `.dex` içinde durur ve `jadx` gibi araçlarla neredeyse kaynak koda geri çevrilebilir. Native kod ise makine diline derlenmiştir; geri çevirmek çok daha zordur. Bu yüzden şifreleme anahtarları, imza üretme algoritmaları, kök tespiti (root detection) ve lisans kontrolü gibi hassas mantık genellikle native tarafa taşınır. Yani bir uygulamanın en değerli sırlarını çoğu zaman `.so` dosyalarının içinde buluruz.
> 

### JNI: Java ile C arasındaki köprü

Java kodu doğrudan bir C fonksiyonunu çağıramaz; arada bir çeviri katmanına ihtiyaç vardır. Bu katmanın adı **JNI**’dır (Java Native Interface).

Java tarafında bir metod “native” olarak işaretlenir:

```java
public class Crypto {
    // Gövdesi yok — kodu C tarafında
    public native String imzaUret(String veri);

    static {
        System.loadLibrary("native-lib");  // .so dosyasını yükle
    }
}
```

C tarafındaki karşılığı ise şöyle görünür:

```c
JNIEXPORT jstring JNICALL
Java_com_ornek_Crypto_imzaUret(JNIEnv *env, jobject thiz, jstring veri) {
    // gerçek iş burada
}
```

Fonksiyon isminin yapısına dikkat etmekte fayda var: `Java_` + paket adı + sınıf adı + metod adı. Bu isimlendirme kuralı sayesinde sistem, Java’daki `imzaUret` çağrısının hangi C fonksiyonuna gideceğini bilir.

> **Neden önemli?** Bir `.so` dosyasında `Java_` ile başlayan sembol isimleri görüyorsanız, Java tarafından hangi fonksiyonların çağrıldığını doğrudan okuyabiliyorsunuz demektir. Bu, analize başlamak için mükemmel bir giriş noktasıdır. Bunu gizlemenin de bir yolu vardır; dinamik kayıt yöntemini ileride ele alacağız.
> 

### Kaynak koddan çalışan programa: derleme ve linkleme

C kodu yazıldığında iki aşamalı bir süreç işler. Birinci aşama **derlemedir** (compile): her `.c` dosyası ayrı ayrı makine koduna çevrilir, çıktı olarak `.o` (object) dosyaları elde edilir.

Ama burada bir sorun ortaya çıkar. Diyelim ki `main.c` içinde `printf()` çağırdınız. Derleyici `printf`’in kodunu bilmez - o başka bir yerdedir. Derleyici bu noktaya “buraya `printf`’in adresi gelecek, şimdilik boş bırakıyorum” diye bir not düşer.

İkinci aşama ise **linklemedir** (link). Linker bütün `.o` dosyalarını ve kütüphaneleri toplar, boş bırakılan yerleri gerçek adreslerle doldurur.

```
main.c ──derle──> main.o ──┐
                            ├──linkle──> program
util.c ──derle──> util.o ──┘
```

### Statik ve dinamik linkleme farkı

Linkleme iki şekilde yapılabilir.

**Statik linklemede** kütüphanenin kodu doğrudan programın içine kopyalanır. Bunu bir kitap yazarken başka bir kitaptan alıntı yapmaya benzetebiliriz: o sayfaların fotokopisini çekip kendi kitabınıza yapıştırırsınız, artık o kitaba ihtiyacınız kalmaz. Avantajı, programın tek başına çalışması, hiçbir şeye bağımlı olmamasıdır. Dezavantajı ise dosya boyutunun büyümesidir - aynı kütüphaneyi kullanan 50 program varsa, aynı kod 50 kez tekrarlanmış olur.

**Dinamik linklemede** ise kütüphanenin kodu ayrı bir dosyada kalır ve program çalışırken bulunup belleğe getirilir. Bunu da kitabınızda “bu konu için X kitabının 42. sayfasına bakın” yazmaya benzetebiliriz: okuyucu o kitabı kütüphaneden almak zorundadır. Kitabınız küçük kalır ama okuyucunun o kütüphaneye erişimi olması şarttır. Avantajı küçük dosya boyutu ve bellek paylaşımıdır - 50 program aynı kütüphaneyi paylaşabilir, kütüphane güncellenince herkes bundan faydalanır. Dezavantajı ise çalışma anında ekstra bir işlem gerektirmesidir; bu işlemi yapan bileşene **dinamik linker** diyoruz.

> **Tanım:** Android’de `.so` uzantılı dosyalar **paylaşımlı kütüphanelerdir** (shared object) ve dinamik olarak linklenirler. `.so` kısaltması da buradan gelir: shared object.
> 

### Sembol nedir?

> **Tanım:** **Sembol**, bir fonksiyonun veya global değişkenin isim etiketidir. `printf`, `malloc`, `JNI_OnLoad` — bunların hepsini birer sembol olarak sayabiliriz.
> 

Bir kütüphane iki tür sembol listesi tutar. **Dışa açık semboller** (exported), “ben bu fonksiyonları sunuyorum, başkaları çağırabilir” anlamına gelir. **İhtiyaç duyulan semboller** (undefined/imported) ise “bu fonksiyonlara ihtiyacım var ama bende yok, başka bir yerden gelmeli” demektir.

Linker’ın işi, ikinci listedeki her şeyi başka birinin birinci listesinde bulmaktır. Bulamazsa şöyle bir hata verir:

```
dlopen failed: cannot locate symbol "SSL_new" referenced by "libnative-lib.so"
```

Bu hatayı sıkça görebilirsiniz. Anlamı şudur: “Bu kütüphane `SSL_new` istiyor ama onu sunan kimseyi bulamadım.”

### Sanal bellek ve mmap

Program çalışırken kodu bellekte durur, ama burada kritik bir ayrımı netleştirmemiz gerekiyor.

> **Tanım:** Her process kendi **sanal adres alanına** sahiptir. Process 0x7000 adresini okuduğunda, bu fiziksel RAM’deki 0x7000 değildir - işletim sistemi araya girip çeviriyi yapar. Her process kendi izole dünyasında yaşar.
> 

> **Tanım:** **mmap**, bir dosyayı belleğe “eşleme” işlemidir. Dosyayı okuyup kopyalamak yerine, “bu dosyanın şu bölgesi, bellekte şu adrese karşılık gelsin” deriz. İşletim sistemi gerçek okumayı, biz o adrese eriştiğimizde yapar.
> 

Kütüphaneler belleğe tam olarak böyle gelir. Linker `.so` dosyasını okuyup RAM’e kopyalamaz, `mmap` ile eşler. Bu sayede aynı kütüphaneyi kullanan 20 uygulama, aynı fiziksel bellek sayfalarını paylaşabilir.

---

Bu temel kavramları netleştirdikten sonra ELF dosya formatının kendisine - header’ına, iki farklı görünümüne (segment ve section) ve strip/packer oyunlarına - geçebiliriz.

---

## ELF Dosya Formatı

### ELF nedir?

> **Tanım:** **ELF** (Executable and Linkable Format), Linux ve Android’de çalıştırılabilir dosyaların ve kütüphanelerin standart formatıdır.
> 

Windows’ta bu işi `.exe` ve `.dll` dosyalarının formatı olan PE üstlenir; Linux ve Android’in karşılığı ise ELF’tir. Android’de ELF olan şeyleri şöyle sıralayabiliriz: APK içindeki `.so` kütüphaneleri, `/system/bin/` altındaki komutlar (`ls`, `ping`, `dumpsys`…) ve dinamik linker’ın kendisi. ELF, aslında belirli bir düzene göre dizilmiş byte’lardan oluşan bir dosya formatıdır.

### ELF header: dosyanın kimlik kartı

Her ELF dosyasının ilk 64 byte’ı (64-bit sistemlerde) header’dır ve dosyanın temel bilgilerini taşır. Örneğin bir `libc.so` üzerinde `llvm-readelf -h` çalıştırdığımızda şöyle bir çıktı görürüz:

```
ELF Header:
  Magic:   7f 45 4c 46 02 01 01 00 ...
```

İlk 4 byte `7f 45 4c 46`’dır; ASCII karşılığı `\x7f` `E` `L` `F`’dir. Buna **magic number** denir - “bu dosya bir ELF’tir” imzasıdır. Her ELF bu dört byte ile başlar.

```
  Class:                             ELF64
```

Bu satır dosyanın 64-bit mi yoksa 32-bit mi olduğunu gösterir. `arm64-v8a` kütüphaneleri ELF64, `armeabi-v7a` olanlar ise ELF32’dir.

```
  Type:                              DYN (Shared object file)
```

Dosyanın türünü belirtir. Karşılaşabileceğiniz değerleri şöyle özetleyebiliriz:

| Değer | Anlamı |
| --- | --- |
| `REL` | Object dosyası (`.o`) — henüz linklenmemiş |
| `EXEC` | Sabit adrese yüklenen çalıştırılabilir (Android’de artık kullanılmıyor) |
| `DYN` | Paylaşımlı kütüphane veya konumdan bağımsız çalıştırılabilir |

> **Neden önemli?** Android 5.0’dan beri bütün çalıştırılabilirler `DYN` olmak zorundadır. Sebebi **PIE**’dir (Position Independent Executable) - programın her çalıştığında farklı bir bellek adresine yüklenebilmesidir. Bu, **ASLR**’nin (Address Space Layout Randomization) temelini oluşturur: saldırgan bellekteki adresleri önceden tahmin edemez. Bu detay ile relocation konusunda tekrar karşılaşacağız.
> 

```
  Machine:                           AArch64
```

Hangi işlemci mimarisi için derlendiğini gösterir. `AArch64` = arm64-v8a, `ARM` = armeabi-v7a.

```
  Entry point address:               0x0
```

Programın başlangıç adresidir. Kütüphanelerde anlamsızdır (0 olur), çünkü kütüphanenin “başlangıcı” yoktur - fonksiyonları dışarıdan çağrılır.

```
  Start of program headers:          64 (bytes into file)
  Start of section headers:          1245680 (bytes into file)
```

### Aynı dosyanın iki farklı görünümü

ELF’in en kritik ve en çok kafa karıştıran özelliği şudur: bir ELF dosyası aynı içeriği iki farklı şekilde tarif eder.

|  | Program header’lar (Phdr) | Section header’lar (Shdr) |
| --- | --- | --- |
| Başka adı | Segmentler | Bölümler |
| Kim kullanır? | Kernel ve linker (çalışma anında) | Derleyici, linker, analiz araçları |
| Ne zaman? | Program çalışırken | Derleme sırasında ve analiz sırasında |
| Ayrıntı | Kaba (5-8 kalem) | Detaylı (20-30 kalem) |
| Silinebilir mi? | Hayır, program çalışmaz | **Evet, program yine çalışır** |

### Program header’lar (segmentler)

`llvm-readelf -lW libc.so` çalıştırdığımızda karşımıza şu segment türleri çıkar:

**`PT_LOAD`** — belleğe yüklenecek bölgedir. Genelde iki tane olur: biri kod için (okunur+çalıştırılır, `R E`), biri veri için (okunur+yazılır, `RW`).

**`PT_INTERP`** — “bu dosyayı çalıştıracak program şudur” bilgisini taşır. İçinde linker’ın yolu yazar: `/system/bin/linker64`. Sadece çalıştırılabilirlerde bulunur.

**`PT_DYNAMIC`** — linker’a verilen talimatların bulunduğu tablonun yeridir; bir sonraki başlıkta detaylı bakacağız.

**`PT_GNU_RELRO`** — “yükleme bittikten sonra bu bölgeyi salt-okunur yap” talimatıdır. Bir güvenlik önlemidir; anlamını relocation bölümünde göreceğiz.

**`PT_TLS`** — thread’e özel veri şablonudur.

Çıktıda `Flags` sütununa dikkat etmek gerekir:

```
  Type     Offset   VirtAddr  FileSiz  MemSiz   Flg Align
  LOAD     0x000000 0x000000  0x0a1234 0x0a1234 R E 0x1000
  LOAD     0x0a2000 0x0a3000  0x004521 0x008000 RW  0x1000
```

`R E` okunabilir + çalıştırılabilir anlamına gelir ve burası koddur; `RW` ise okunabilir + yazılabilir anlamına gelir ve burası veridir.

> **Neden önemli?** Hiçbir segment aynı anda hem `W` hem `E` olmamalıdır — yani kod bölgesi yazılabilir olmamalıdır. Buna **W^X** (write xor execute) prensibi denir. Bir `.so` dosyasında `RWE` bir segment görürseniz, bu güvenlik açısından raporlanması gereken bir bulgudur.
> 

`MemSiz` ile `FileSiz` arasındaki farka da dikkat etmekte fayda var. İkinci satırda `FileSiz` 0x4521 ama `MemSiz` 0x8000’dir. Aradaki fark, sıfırla dolu değişkenler için ayrılan alandır (`.bss`) — dosyada yer kaplamaz, bellekte kaplar.

### Section header’lar (bölümler)

`llvm-readelf -SW libc.so` çıktısında tanımamız gereken section’lar şunlardır:

| Section | İçeriği |
| --- | --- |
| `.text` | Fonksiyonların makine kodu |
| `.rodata` | Salt-okunur veri: sabit stringler, tablolar |
| `.data` | Başlangıç değeri olan global değişkenler |
| `.bss` | Başlangıç değeri sıfır olan global değişkenler |
| `.dynsym` | Dışa açık sembol tablosu |
| `.dynstr` | O sembollerin isimlerinin metni |
| `.got` | Global Offset Table |
| `.plt` | Procedure Linkage Table |
| `.init_array` | Kütüphane yüklenince otomatik çalışacak fonksiyonlar |
| `.rela.dyn` | Relocation tablosu |

> **Dikkat:** String’ler `.text`’te değil `.rodata`’da durur; `.text` sadece komut kodudur.
> 

### Strip ve packer’ların oyunu

> **Tanım:** **strip**, bir binary’den analiz için gerekli ama çalışma için gereksiz bilgileri silme işlemidir.
> 

Section header’lar çalışma anında kullanılmaz — linker sadece program header’lara bakar. Dolayısıyla section bilgilerini silseniz bile program çalışmaya devam eder; sadece analiz işiniz zorlaşır.

Bazı **packer’lar** (uygulamayı korumak için kodu gizleyen ticari araçlar) bir adım daha ileri gider ve ELF header’daki `e_shoff` alanını sıfırlar. Bu alan “section tablosu dosyanın neresinde” bilgisini tutar. Sıfırlanınca `objdump` ve benzeri araçlar hata verir veya boş çıktı üretir; ama linker hiçbir şey fark etmez, çünkü zaten oraya bakmıyordur.

> **Neden önemli?** `objdump` çalışmadığında “bu dosya bozuk” sonucuna varmamak gerekir. Program header’lar hâlâ sağlam olabilir; `llvm-readelf -l` ile segment tarafından bakmayı deneyebilirsiniz.
> 

### `.dynamic`: linker’a bırakılan not

`PT_DYNAMIC` segmenti, anahtar-değer çiftlerinden oluşan bir tablodur; linker’ın okuyacağı talimat listesidir. `llvm-readelf -dW libc.so` çalıştırdığımızda en önemli girdileri görürüz:

| Etiket | Anlamı |
| --- | --- |
| `DT_NEEDED` | “Şu kütüphaneye ihtiyacım var” |
| `DT_SONAME` | “Benim resmi adım şu” |
| `DT_INIT_ARRAY` | “Yükleyince şu fonksiyonları çağır” |
| `DT_FINI_ARRAY` | “Kapatırken şunları çağır” |
| `DT_FLAGS` | Davranış bayrakları (`BIND_NOW`, `SYMBOLIC`) |
| `DT_RELA` / `DT_RELR` | Relocation tablolarının yeri |

> **Neden önemli?** `DT_NEEDED` satırları bir kütüphane hakkında ilk beş dakikada söylenebilecek en çok şeyi verir. `libssl.so` bağlıysa sistem TLS’ini kullanıyor demektir. Hiçbir SSL kütüphanesi bağlı değilken kod içinde şifreleme yapıyorsa, kendi statik kopyasını gömmüştür - bu da sertifika pinlemesini atlatmayı zorlaştırır. `liblog.so` bağlıysa logcat’e bir şeyler yazıyor olabilir; oradan bilgi sızabilir.
> 

---

## Dinamik Linker

### Linker nedir, nerede yaşar?

> **Tanım:** **Dinamik linker**, çalışma anında kütüphaneleri bulup belleğe getiren, bağımlılıkları çözen ve adresleri düzelten programdır.
> 

Android’de adı ve yeri şöyledir:

```
/system/bin/linker64        (64-bit)
/system/bin/linker          (32-bit)
```

Modern sürümlerde APEX üzerinden de gelir:

```
/apex/com.android.runtime/bin/linker64
```

Android’in C kütüphanesinin adı **Bionic**’tir (glibc’nin Android karşılığı). Linker, Bionic’in bir parçasıdır.

> **Dikkat:** İki farklı “linker” olduğunu karıştırmamak gerekir. **Derleme zamanı linker’ı** (`ld`, `lld`) programı üretirken çalışır. **Dinamik linker** ise program çalışırken devreye girer - bu bölümde konuştuğumuz ikincisidir.
> 

### Bir kütüphane nasıl yüklenir? Zincirin tamamı

Java tarafında şu satırı yazdığınızda:

```java
System.loadLibrary("native-lib");
```

arka planda şu zincir işler:

```
System.loadLibrary("native-lib")
    │
    ├─ Runtime.loadLibrary0()
    │      "lib" + isim + ".so" birleştirilir → libnative-lib.so
    │
    ├─ nativeLoad()                          [ART çalışma zamanı]
    │
    ├─ android_dlopen_ext()                  [LINKER DEVREYE GİRİYOR]
    │      │
    │      ├─ 1. Namespace kontrolü
    │      │      "Bu process bu kütüphaneyi görmeye yetkili mi?"
    │      │
    │      ├─ 2. Bağımlılıkları yükle
    │      │      DT_NEEDED listesindeki her kütüphane için aynı işlem
    │      │      (özyinelemeli)
    │      │
    │      ├─ 3. Segmentleri mmap et
    │      │      PT_LOAD segmentleri belleğe eşlenir
    │      │
    │      ├─ 4. Relocation uygula
    │      │      Boş bırakılmış adresler doldurulur
    │      │
    │      ├─ 5. RELRO uygula
    │      │      PT_GNU_RELRO bölgesi salt-okunur yapılır
    │      │
    │      └─ 6. Constructor'ları çağır
    │             .init_array içindeki fonksiyonlar çalışır
    │
    └─ JNI_OnLoad()                          [ART çağırır]
```

Şimdi her adımı tek tek açalım.

### Segmentleri belleğe eşleme

Linker `PT_LOAD` segmentlerini `mmap` ile belleğe eşler; kod segmenti `r-xp` (oku+çalıştır), veri segmenti `rw-p` (oku+yaz) izinleriyle eşlenir.

Bunu cihazda `/proc/<PID>/maps` çıktısına bakarak görebiliriz:

```
7b4c2a1000-7b4c2f3000 r-xp 00000000 fd:03 1442  /apex/.../libc.so
7b4c2f3000-7b4c2f5000 rw-p 00051000 fd:03 1442  /apex/.../libc.so
```

İlk satır kod (`r-xp`), ikinci satır veri (`rw-p`) — aynı dosya, iki farklı izinle eşlenmiştir.

> **Tanım:** Kütüphanenin belleğe yüklendiği ilk adrese **base address** (taban adres) denir. Yukarıdaki örnekte `0x7b4c2a1000`’dir. ASLR sayesinde bu adres her çalıştırmada değişir.
> 

### Relocation:

**Problem şudur:** kütüphane derlenirken hangi adrese yükleneceği bilinmez. ASLR yüzünden her seferinde farklı bir adrese gidecektir. Peki kod içinde adres kullanan yerler ne olacaktır?

Örneğin şu C kodunu düşünelim:

```c
static const char *mesaj = "merhaba";

void yaz() {
    printf("%s\n", mesaj);
}
```

`mesaj` değişkeni bir adres tutar — `"merhaba"` string’inin adresini. Ama derleme sırasında bu adres bilinmez, çünkü kütüphanenin nereye yükleneceği belli değildir.

**Çözüm** ise şudur: derleyici o alanı boş bırakır ve bir not düşer: “bu konuma, taban adrese 0x1234 eklenmiş değer yazılacak.” Bu nota **relocation** denir.

> **Tanım:** **Relocation**, çalışma anında bellekteki bazı değerlerin, kütüphanenin gerçek yükleme adresine göre düzeltilmesi işlemidir.
> 

Bunu bir kitap analojisiyle açıklayabiliriz: bir kitap yazdınız, içinde “detaylar için sayfa 42’ye bakın” gibi çapraz referanslar var. Sonra bu kitap 200 sayfalık bir derlemenin ortasına, 150. sayfadan itibaren konuluyor. Artık bütün referansları güncellemeniz gerekir: 42 → 192, 58 → 208. Relocation tam olarak budur.

Relocation tablosunu `llvm-readelf --relocations libc.so` ile görebiliriz. arm64’te karşımıza çıkan ana türler şunlardır:

| Tür | Anlamı |
| --- | --- |
| `R_AARCH64_RELATIVE` | En yaygın. “Taban adrese şu sabiti ekle.” |
| `R_AARCH64_GLOB_DAT` | Bir global değişkenin adresini çöz |
| `R_AARCH64_JUMP_SLOT` | Bir fonksiyonun adresini çöz |
| `R_AARCH64_ABS64` | Mutlak adres yaz |

### GOT ve PLT: dış fonksiyonlara nasıl gidilir?

**Problem:** kütüphaneniz `printf` çağırıyor. Ama `printf` başka bir kütüphanede (`libc.so`) bulunur ve onun adresi de çalışma anında belli olur. Kodun içine sabit bir adres yazamazsınız. Üstelik kod segmenti **salt-okunur** olmalıdır (W^X kuralı), yani çalışma anında kodun içine adres yazamazsınız bile.

**Çözüm dolaylı çağrıdır.** Kod, adresi doğrudan kullanmak yerine bir tablodan okur.

> **Tanım:** **GOT** (Global Offset Table), dış fonksiyon ve değişken adreslerinin tutulduğu tablodur. Veri segmentindedir, dolayısıyla yazılabilirdir.
> 

Bunu bir telefon rehberine benzetebiliriz: kodun içine “0532 xxx” yazmak yerine “rehberdeki 5 numaralı kayıt” yazarsınız; numara değişince kodu değil rehberi güncellersiniz. Böylece kod segmenti hiç değişmez - sadece veri segmentindeki GOT güncellenir.

> **Tanım:** **PLT** (Procedure Linkage Table), GOT’a erişimi yöneten küçük kod parçalarıdır.
> 

PLT’nin varlık sebebi bir optimizasyondur: **lazy binding.** Bir kütüphane yüzlerce dış fonksiyon çağırabilir, ama çalışma sırasında belki onda birini kullanır; hepsinin adresini baştan çözmek zaman kaybı olur. Lazy binding’de her fonksiyon **ilk çağrıldığında** çözülür: kod `printf`’i çağırır ve PLT’ye gider; PLT GOT’a bakar, henüz çözülmemişse linker’ın çözücüsüne yönlendirir; linker `printf`’i bulur ve adresi GOT’a yazar; ikinci çağrıdan itibaren doğrudan GOT üzerinden gidilir.

GOT, çalışma boyunca yazılabilir kalır. Bir saldırgan GOT’a yazabilirse, program akışını istediği yere yönlendirebilir.

Buna karşı önlem **BIND_NOW** ve **RELRO**’dur. `BIND_NOW` bayrağı “ bütün sembolleri yüklerken çöz” der. `RELRO` ise çözüm bitince GOT’un olduğu bölgeyi `mprotect` ile salt-okunur yapar. İkisi birlikte **full RELRO** denen korumayı oluşturur. Bir kütüphanenin RELRO durumunu `llvm-readelf -dW libc.so | grep -E "BIND_NOW|FLAGS"` ve `llvm-readelf -lW libc.so | grep GNU_RELRO` komutlarıyla kontrol edebilirsiniz; ikisi de varsa full RELRO var demektir.

> **Neden önemli?** Bu bilgi sadece savunma tarafında değil, saldırı tarafında da kritiktir. Bir kütüphanede full RELRO varsa, GOT’a hook koymak isteyen bir araç önce `mprotect` ile o bölgeyi yazılabilir yapmak zorunda kalır. Bu da savunma tarafından tespit edilebilen bir davranıştır.
> 

### `.init_array`: ilk çalışan kod

Bu bölümün en önemli tek cümlesi: **`.init_array` içindeki fonksiyonlar, `JNI_OnLoad`’dan önce çalışır.**

C++’ta global bir nesnenin constructor’ı, program başlamadan çalışmalıdır. C’de aynı şeyi `__attribute__((constructor))` ile yaparsınız. Derleyici bu fonksiyonların adreslerini `.init_array` section’ına yazar; linker de yükleme bitince onları sırayla çağırır.

Bunu bir örnekle kanıtlayabiliriz. Aşağıdaki gibi bir constructor ve `JNI_OnLoad` tanımlayan bir kütüphaneyi çalıştırıp logcat çıktısına baktığımızda:

```c
#include<jni.h>
#include<android/log.h>

#define LOG(...) __android_log_print(ANDROID_LOG_INFO,"SIRA", __VA_ARGS__)

__attribute__((constructor))
static void ilk_calisan() {
    LOG("1 -> .init_array constructor calisti");
}

extern "C" JNIEXPORT jint JNICALL
JNI_OnLoad(JavaVM *vm, void *reserved) {
    LOG("2 -> JNI_OnLoad calisti");
    return JNI_VERSION_1_6;
}
```

şu çıktıyı görürüz:

```
I/SIRA: 1 -> .init_array constructor calisti
I/SIRA: 2 -> JNI_OnLoad calisti
```

Sıra her zaman böyledir ve değiştirilemez.

> **Neden önemli?** Bu, bütün bölümün en pratik sonucudur. Uygulamaları koruyan araçlar (packer’lar), kök tespiti, hata ayıklayıcı tespiti, string çözme rutinleri - bunların çoğu constructor’lara konur. Sebebi basittir: analiz eden kişinin müdahale edebileceği ilk noktadan **önce** çalışmak isterler. Analize `JNI_OnLoad`’a breakpoint koyarak başlarsanız, uygulama sizi çoktan tespit etmiş, belki sahte veri döndürmeye başlamış olur .
> 

Doğru yaklaşım zinciri daha yukarıdan yakalamaktır. Frida ile `android_dlopen_ext` fonksiyonuna hook koyarsanız, kütüphane yüklenmeden haberdar olursunuz. Ve mutlaka **spawn** modunda başlatmak gerekir:

```bash
frida -U -f com.hedef.app -l script.js
```

- `f` bayrağı uygulamayı Frida’nın başlatması demektir. Uygulama zaten çalışırken `n` ile bağlanılırsa (attach), constructor’lar çoktan çalışmış olur.

---

## Android’e Özgü Konular

### Linker namespace’leri

Android 7.0 ile gelen bir izolasyon mekanizmasıdır.

**Problem:** Eskiden uygulamalar `dlopen()` ile herhangi bir sistem kütüphanesini açabiliyordu. Uygulamalar Google’ın “iç” kütüphanelerine bel bağlamaya başladı; o kütüphaneler değişince uygulamalar bozuldu. Ayrıca güvenlik açısından da gereksiz bir yüzeydi.

**Çözüm:** Kütüphaneler artık **namespace** denen gruplara ayrıldı. Her process belirli bir namespace içinde çalışır ve sadece o namespace’ten görünen kütüphanelere erişebilir.

Uygulamalar `classloader-namespace` içinde çalışır. Bu namespace’ten platform kütüphanelerinin sadece `/system/etc/public.libraries.txt` listesinde olanları görünür. Bunun somut sonucu şudur:

```c
// Bir uygulama içinden:
void *h = dlopen("libart.so", RTLD_NOW);
// h == NULL, hata: "library libart.so is not accessible for the namespace"
```

> **Neden önemli?** Java tarafındaki “gizli API kısıtlaması”nı duymuş olabilirsiniz. Namespace izolasyonu onun native karşılığıdır. Eski hooking framework’lerinin modern Android’de neden çalışmadığının cevabı da genelde budur - sistem kütüphanelerine erişemezler.
> 

Namespace yapılandırması `/system/etc/ld.config.*.txt` dosyasında tanımlıdır ve içinde şu alanları barındırır: `search_paths` (nerelerde aranacağı), `permitted_paths` (nerelerden yüklenebileceği), `isolated` (izole olup olmadığı), `links` ve `shared_libs` (hangi namespace’ten ne görüneceği). Bir uygulama standart dışı bir yoldan kütüphane yüklemek isterse `android_create_namespace()` ve `android_link_namespaces()` fonksiyonlarını kullanır.

> **Neden önemli?** Bir uygulamada bu çağrıları görüyorsanız, uygulama kendi kod yükleme yüzeyini genişletiyor demektir. Dinamik özellik modülleri veya çalışma anında yama (patch) sistemleri böyle çalışır. Güvenlik değerlendirmesinde not edilmesi gereken bir davranıştır: uygulama, kurulum sonrasında dışarıdan kod yükleyebiliyor olabilir.
> 

### APK’nın içinden doğrudan yükleme

Eskiden APK kurulurken `.so` dosyaları çıkarılıp diske yazılırdı; bu, aynı verinin iki kez yer kaplaması demekti.

`AndroidManifest.xml` içinde `<application android:extractNativeLibs="false">` ayarı varsa, kütüphaneler çıkarılmaz. APK içinde sıkıştırılmadan ve hizalı olarak durur; linker doğrudan zip’in içindeki o bölgeyi `mmap` eder.

Bunun analiz açısından sonucu önemlidir. `/proc/<pid>/maps` çıktısında şunu görürüz:

```
7b4c2a1000-7b4c2f3000 r-xp 00a41000 fd:03 1442  /data/app/~~xY.../base.apk
```

Dosya adı `.so` değil, **`base.apk`**’dır.

> **Dikkat:**  `maps` çıktısında `.so` uzantısı arayıp bulamayınca “kütüphane yüklenmemiş” sanmaktır. Aslında yüklenmiştir - sadece arkasındaki dosya APK’nın kendisidir. Dördüncü sütundaki offset değeri (`00a41000`), APK içindeki konumu gösterir.
> 

### Sıkıştırılmış relocation tabloları

PIE kod çok sayıda `R_AARCH64_RELATIVE` relocation üretir; büyük bir kütüphanede yüz binlerce girdi olabilir ve dosya boyutunun kayda değer bir kısmını kaplayabilir.

Android bunu iki formatla çözmüştür: **`DT_ANDROID_RELA`**, Android’e özgü ve sleb128 ile sıkıştırılmış bir formattır; **`DT_RELR`** ise sonradan standartlaşan, bitmap tabanlı bir kodlamadır ve modern NDK build’lerinin varsayılanıdır.

> **Dikkat:** Eski `readelf` sürümleri ve bazı statik analiz araçları bu tabloları çözemez; çıktıda hiç relocation yokmuş gibi görünür veya araç doğrudan hata verir. Bu durumda “bu dosyada relocation yok” sonucuna varmamak, aracın formatı tanımadığını düşünmek gerekir. Çözüm, GNU binutils yerine LLVM araçlarını (`llvm-readelf --relocations`) kullanmaktır.
> 

### 16 KB sayfa boyutu

İşletim sistemleri belleği **sayfa** denen bloklar halinde yönetir. Android uzun süre 4 KB sayfa kullandı; yeni cihazlar artık 16 KB sayfa boyutuyla da gelebiliyor.

4 KB varsayımıyla derlenmiş bir `.so`, 16 KB sayfalı bir cihazda yüklenemez. Bunu `llvm-readelf -lW libtarget.so | grep LOAD` çıktısındaki `Align` sütunundan kontrol edebiliriz: `0x1000` (4096) eski varsayımı, `0x4000` (16384) ise 16 KB uyumluluğunu gösterir. Build tarafındaki karşılığı `-Wl,-z,max-page-size=16384` bayrağıdır.

> **Neden önemli?** Bu bir güvenlik açığı değil, bir uyumluluk bulgusudur. Bir değerlendirme raporunda “uygulamanın şu kütüphanesi yeni nesil cihazlarda yüklenemeyecek” demek, teknik yetkinliği gösteren ve müşterinin gerçekten ilgilendiği türden bir tespittir.
> 

### Text relocation yasağı

> **Tanım:** **Text relocation**, kod segmentinin (`.text`) çalışma anında değiştirilmesini gerektiren relocation türüdür. `.dynamic` tablosunda `DT_TEXTREL` girdisiyle işaretlenir.
> 

Bu, kod segmentinin yazılabilir olmasını gerektirir - yani W^X kuralının ihlalidir.

Android 6.0 (API 23) itibarıyla linker, `DT_TEXTREL` içeren kütüphaneleri **reddeder** ve yüklemez. Bunun sonucu olarak `.text` üzerinden kendini değiştiren eski nesil packer’lar artık çalışmaz. Bugünkü packer’lar aynı şeyi çalışma anında `mprotect` çağırarak yapar — ki bu, izlenebilir ve tespit edilebilir bir davranıştır.

---

## İleri Konular

Bu bölümdeki konuları ilk okumada tam kavrayamasanız sorun değil; önceki bölümleri sindirdikten sonra buraya dönebilirsiniz. Buradaki konular, “neden çalışmıyor?” sorusunun cevabını aradığınızda işinize yarayacaktır.

### Sembol arama sırası

Aynı isimli sembolü iki farklı kütüphane tanımlıyorsa hangisi kazanır? Linker’ın arama düzeni şöyledir: önce **global grup** (`RTLD_GLOBAL` ile açılanlar ve `DF_1_GLOBAL` bayraklı olanlar), sonra **yerel grup** (kütüphanenin kendi bağımlılık ağacı), ardından `DT_NEEDED` listesi üzerinde **genişlik öncelikli** (BFS) bir gezinme yapılır. Somut sonuç şudur: kazanan, yükleme sırasına göre belirlenir.

> **Neden önemli?** Bu, “sembol ele geçirme” (symbol interposition) tekniğinin temelidir. Hedef kütüphaneden önce yüklenen bir kütüphane, aynı isimli bir fonksiyon tanımlarsa çağrıları kendine çekebilir. Buna karşı önlem, kütüphanenin `-Bsymbolic` ile derlenmesidir (veya `DT_SYMBOLIC` bayrağının bulunmasıdır) — bu durumda kütüphane kendi sembollerini önce kendi içinde çözer ve bu tekniğe kapanır.
> 

### IFUNC: memcpy hook’unun neden çalışmadığı

Bionic, işlemcinin desteklediği özelliklere göre çalışma anında en hızlı `memcpy`, `strlen`, `memset` varyantını seçer.

Mekanizma şöyle işler: `R_AARCH64_IRELATIVE` relocation’ı ve bir **resolver** fonksiyonu kullanılır. Linker resolver’ı çağırır, resolver “bu CPU’da şu varyantı kullan” diyerek bir adres döner, linker o adresi GOT’a yazar. Sonuç olarak `memcpy`’nin `.dynsym` içindeki adresi, gerçekten çalışan koda işaret etmeyebilir:

```jsx
// Bu bazen sessizce hiçbir şey yakalamaz:
Interceptor.attach(Module.findExportByName("libc.so", "memcpy"), { ... });
```

Doğru hedef, resolver’ın GOT’a yazdığı adrestir.

> **Neden önemli?** Burada frida bozuk değildir - sembol tablosundaki adres hedeflenir, ama çalışan kod başka bir adrestedir.
> 

### `.gnu_debugdata`: “strip’li” dosyanın gizli sembolleri

Android sistem kütüphaneleri strip’lidir - ama tam olarak değil.

**MiniDebugInfo** denen bir mekanizma vardır: strip edilirken, sadece fonksiyon sembollerini içeren minik bir ELF üretilip xz ile sıkıştırılır ve ana dosyaya `.gnu_debugdata` adlı bir section olarak gömülür. Amacı, crash raporlarındaki backtrace’lerin okunabilir kalmasıdır. Yani ortada **ELF içinde ELF** vardır.

Bu gizli sembolleri `llvm-objcopy --dump-section .gnu_debugdata=dbg.xz libc.so` ile dosyaya döküp, `xz -d dbg.xz` ile açıp, `llvm-nm dbg` ile listeleyebiliriz. Dışa açık sembol sayısıyla (`llvm-nm -D libc.so | wc -l`) karşılaştırdığımızda, ikinci sayının çok daha büyük olduğunu görürüz. Aradaki fark, `dlsym`’in asla göremeyeceği yerel fonksiyon isimleridir.

> **Neden önemli?** “Bu kütüphane strip’lenmiş, sembol yok” demeden önce buraya bakmakta fayda var. `xdl` gibi modern hooking kütüphaneleri tam olarak bunu yapar: `dlsym`’in bulamadığı sembolleri diskteki dosyadan ve `.gnu_debugdata`’dan okur.
> 

### CFI, BTI, ShadowCallStack

Modern Android’in bellek güvenliği önlemleridir; hooking yaparken doğrudan karşımıza çıkarlar.

**CFI (Control Flow Integrity)** dolaylı fonksiyon çağrılarını doğrular: “bu fonksiyon pointer’ı gerçekten geçerli bir hedefi mi gösteriyor?” Geçersizse process `SIGILL` ile ölür.

**BTI (Branch Target Identification)** armv8.5+ işlemcilerde, dolaylı dallanmanın gideceği adreste `bti` komutunun bulunmasını zorunlu kılar; yoksa işlemci hata üretir.

**ShadowCallStack** fonksiyon dönüş adreslerini, normal yığının yanında ayrı bir “gölge yığında” da tutar (`x18` yazmacı üzerinden); ikisi uyuşmazsa process ölür.

> **Neden önemli?** “Hook’um bazı cihazlarda çalışıyor, bazılarında uygulama çöküyor” durumunun cevabı çoğu zaman bu üçünden biridir - kodunuzdaki bir hata değil. Cihazın işlemci nesli ve kütüphanenin derlenme bayrakları belirleyicidir.
> 

### soinfo ve görünmeyen kütüphaneler

Linker, yüklediği her kütüphaneyi `soinfo` adlı bir yapıda tutar ve bunları bağlı liste halinde saklar. `dl_iterate_phdr()` ve `dladdr()` fonksiyonları bu listeyi gezer; Frida’nın `Process.enumerateModules()` çağrısı da nihayetinde buraya dayanır.

Gelişmiş packer’lar sistem linker’ını **tamamen atlar**: ELF’i kendileri parse eder, segmentleri kendileri `mmap` eder, relocation’ları kendileri uygular. Buna **manuel map’leme** denir. Sonuçları şunlardır: kütüphane `dl_iterate_phdr` listesinde **yoktur**; `/proc/self/maps` içinde isimsiz bir `r-xp` bölge olarak görünür; `Module.findExportByName` işe yaramaz; bazıları bellekteki `\x7fELF` magic’ini de siler, böylece basit bellek taramaları da atlanır.

> **Neden önemli?** Bir uygulamada modül listesinde göremediğiniz kod çalışıyorsa panik yapmamak gerekir - muhtemelen manuel map’lenmiştir. Bu durumda kullanılacak araçlar değişir: `Memory.scan` ile desen arama, isimsiz `r-xp` bölgeleri dump edip ELF header’ını elle yeniden kurma, ya da kütüphaneyi **unidbg** ile cihaz dışında emüle etme gibi yollara başvurulabilir.
> 

---

Bütün bu mekanizmayı anladıktan sonra sıra, bunların güvenlik değerlendirmesinde pratikte nasıl kullanıldığına geldi.

---

## Güvenlik Uygulamaları

### Hooking nedir?

> **Tanım:** **Hooking**, çalışan bir programda bir fonksiyonun davranışını dışarıdan değiştirme tekniğidir. Fonksiyon çağrıldığında önce sizin kodunuz çalışır; parametreleri görebilir, değiştirebilir, dönüş değerini değiştirebilir veya fonksiyonu hiç çalıştırmayabilirsiniz.
> 

Mobil güvenlikte kullanım alanlarını şöyle sıralayabiliriz: sertifika pinlemesini atlatma, kök tespitini devre dışı bırakma, şifreleme fonksiyonlarının girdi/çıktısını görme, lisans kontrolünü atlama.

### Üç hooking yöntemi

| Yöntem | Nasıl çalışır | Zayıf noktası |
| --- | --- | --- |
| **PLT/GOT hook** | GOT tablosundaki adresi değiştirir | Full RELRO varsa `mprotect` gerekir; sadece kütüphaneler arası çağrıları yakalar, iç çağrıları yakalayamaz |
| **Inline hook** | Fonksiyonun ilk komutlarını atlama komutuyla değiştirir | `.text` bütünlük kontrolleri, BTI, kısa fonksiyonlarda yer sıkıntısı |
| **Sembol ele geçirme** | Aynı isimli sembolü önce tanımlar | Namespace izolasyonu ve `-Bsymbolic` ile büyük ölçüde kapandı |

Hangisini seçeceğinizi belirleyen ilk bilgi, hedefin RELRO durumudur. `llvm-readelf -dW libtarget.so | grep -E "BIND_NOW|FLAGS"` ve `llvm-readelf -lW libtarget.so | grep GNU_RELRO` komutlarıyla kontrol edebiliriz; ikisi de varsa GOT salt-okunur olacaktır ve PLT hook’u `mprotect` çağırmak zorunda kalacaktır.

### Savunma tarafı: ne işe yarar, ne yaramaz

Native sıklaştırma konusunda gerçekçi olmakta fayda var: **hiçbir şey reverse edilemez değildir.** Hepsi sadece maliyeti ve harcanan süreyi artırır. Yine de bazıları diğerlerinden çok daha iyi yatırımdır.

Değerli olanları şöyle sıralayabiliriz: kritik kontrolleri `.init_array` içinde erken çalıştırmak (analistin müdahale penceresini daraltır), `-fvisibility=hidden` ile dışa açık sembol sayısını azaltmak, full RELRO + `-z noexecstack` + strip kombinasyonu, bütünlük kontrolünü tek noktada değil dağıtık ve gecikmeli yapmak, ve en önemlisi **sunucu tarafı doğrulama** - sonuçta tek gerçek savunma budur.

Sadece gürültü olanlar ise şunlardır: tek bir yere konmuş `ptrace(PTRACE_TRACEME)` kontrolü, `/proc/self/maps` içinde sabit “frida” metni aramak, bütün kök tespitini tek bir `if` bloğunda toplamak.

> **Neden önemli?** OWASP MASTG’nin dayanıklılık testleri de tam olarak bu ayrımı ölçer: kontrolün **var olup olmadığını** değil, **tek noktadan atlatılıp atlatılamadığını**. Bir raporda “root detection mevcut” yazmak yetersizdir; “root detection mevcut ancak tek bir fonksiyona hook koyarak atlatılabiliyor” doğru tespittir.
> 

---

## Pratik Rutin

Elinize yeni bir APK geldiğinde native taraf için izlenebilecek sabit bir sıra vardır. Her adımda hangi komutun çalıştırıldığını ve çıktıda neye bakılması gerektiğini birlikte görelim.

**Birinci adım, hangi kütüphanelerin bulunduğunu görmektir:**

```bash
unzip -l app.apk | grep '\.so$'
```

Burada kaç ABI olduğuna, kütüphane isimlerinin tanıdık olup olmadığına (`libflutter.so`, `libreactnativejni.so` gibi framework izlerine) ve hangi isimlerin bilinmediğine bakmak gerekir.

**İkinci adım kütüphaneyi çıkarmaktır:**

```bash
unzip app.apk 'lib/arm64-v8a/*' -d ./cikti
cd cikti/lib/arm64-v8a
```

arm64 seçilmesinin sebebi, modern cihazların çoğunun bu mimaride çalışması ve genelde en güncel derlemenin bu olmasıdır.

**Üçüncü adım temel profili çıkarmaktır:**

```bash
llvm-readelf -hW libtarget.so
```

`Type` alanının `DYN` olup olmadığına, `Machine`’in doğru olup olmadığına ve `Start of section headers` değerinin sıfır olup olmadığına (packer belirtisi) bakılır.

**Dördüncü adım bağımlılıkları incelemektir:**

```bash
llvm-readelf -dW libtarget.so | grep NEEDED
```

Şifreleme kütüphanesinin bağlı olup olmadığına ya da kendi kopyasının gömülüp gömülmediğine, `liblog.so`’nun bulunup bulunmadığına (log sızıntısı olasılığı) bakılır.

**Beşinci adım dışa açık sembol yüzeyine bakmaktır:**

```bash
llvm-nm -D --defined-only libtarget.so | grep ' T '
```

`T` işareti tanımlanmış ve dışa açık bir fonksiyon anlamına gelir. Kaç sembol olduğuna, azsa `-fvisibility=hidden` kullanılmış olabileceğine, isimlerin anlamlı mı yoksa karıştırılmış mı olduğuna bakılır.

**Altıncı adım constructor’ları incelemektir:**

```bash
llvm-readelf -xW .init_array libtarget.so
```

Kaç adres olduğuna bakılır; sıfır değilse, `JNI_OnLoad`’dan önce çalışan kod var demektir ve analize başlarken buraya bakmak gerekecektir.

**Yedinci adım JNI kayıt yöntemini belirlemektir:**

```bash
llvm-nm -D libtarget.so | grep -E 'JNI_OnLoad|Java_'
```

Üç olasılık vardır: `Java_` ile başlayan semboller varsa statik kayıt kullanılmıştır ve fonksiyon isimlerinden hangi Java metoduna karşılık geldiği doğrudan okunabilir — en kolay durumdur. Sadece `JNI_OnLoad` varsa ve `Java_` yoksa, dinamik kayıt (`RegisterNatives`) kullanılmıştır; isimler kaybolmuştur ve `RegisterNatives`’e hook koyup `JNINativeMethod` dizisini dökmek gerekecektir. İkisi de yoksa, kütüphane muhtemelen JNI arayüzü sunmuyordur; başka bir kütüphane tarafından kullanılan yardımcı bir kütüphanedir.

> **Neden önemli?** Bu tek gözlem saatler kazandırır. İkinci durum erken fark edilmezse, olmayan sembolleri aramakla vakit harcanır.
> 

**Sekizinci adım sıklaştırma durumunu kontrol etmektir:**

```bash
llvm-readelf -lW libtarget.so | grep -E 'GNU_RELRO|GNU_STACK'
llvm-readelf -dW libtarget.so | grep BIND_NOW
```

RELRO’nun olup olmadığına, `GNU_STACK` satırında `E` bayrağının bulunup bulunmadığına bakılır.

**Dokuzuncu adım hızlı bir metin taramasıdır:**

```bash
llvm-strings -n 8 libtarget.so | grep -Ei 'http|token|key|secret|password'
```

Sabit kodlanmış URL’lere, API anahtarlarına, test sunucusu adreslerine bakılır. Sonuç genelde gürültülüdür ama bazen doğrudan bir bulgu çıkar.

**Onuncu ve son adım, ileri seviye bir teknik olan cihaz dışı analizdir.** İzole edilebilir bir fonksiyonu (imza üretimi, şifreleme rutini) incelemek gerektiğinde **unidbg** ile kütüphane JVM içinde emüle edilebilir. Cihazda hook’la uğraşmaktan çok daha hızlı sonuç verebilir.

## Konuyu Öğrenirken Sık Yaptığım Hatalar

**`.text` içinde string aramak.** String sabitleri `.rodata`’da durur, `.text`’te değil.

**`objdump` hata verince “dosya bozuk” demek.** Section header’lar silinmiş olabilir; segment tarafından (`llvm-readelf -l`) bakmayı denemek gerekir.

**`maps` çıktısında `.so` uzantısı aramak.** `extractNativeLibs=false` ise dosya adı `base.apk` olarak görünür.

**Frida’ya attach modunda bağlanmak.** Bu noktada constructor’lar çoktan çalışmış olur; `-f` ile spawn etmek gerekir.

**`JNI_OnLoad`’a breakpoint koyup analize başlamak.** İlk çalışan kod `.init_array`’dedir.

**“Sembol yok” demeden önce `.gnu_debugdata`’ya bakmamak.**

**`armeabi-v7a` kütüphanesinde Thumb bitini unutmak.** 32-bit ARM’de fonksiyon adresinin en düşük biti mod bilgisidir, adresin parçası değildir.

## Nereden Devam Edilmeli

Buraya kadar geldiyseniz, sıradaki adımları şöyle sıralayabiliriz:

**OWASP MASTG** mobil güvenlik testlerinin standart referansıdır; özellikle native binary ve dayanıklılık (MASVS-RESILIENCE) bölümlerine bakılabilir. 

**Bionic linker kaynak kodu** (`linker.cpp` ve `linker_soinfo.cpp`) okuması zor olsa da bu yazıdaki her şeyin kaynağıdır. 

**Frida dokümantasyonu**, özellikle `Interceptor`, `Module`, `Memory` API’leri, ileri seviye hooking için gereklidir. 

**Ghidra vs.** , `.so` dosyalarını decompile etmek için kullanılır - bu yazı “dosya nasıl yükleniyor” sorusunu cevapladı, Ghidra ise “içinde ne yazıyor” sorusunu cevaplar. 

Son olarak **kendi aracınızı yazmak** da değerli bir adımdır: Python ve `pyelftools` ile bu yazıdaki triyaj adımlarını otomatikleştirmeye çalışmayı elbette bir sonraki yazıda ele alacağız.

## Özetin Özeti

Her şey unutulsa bile şu üçü akılda kalmalı:

**`.init_array`, `JNI_OnLoad`’dan önce çalışır.** Analize başlama noktası burasıdır.

**Strip’lenmiş olmak sembolsüz olmak anlamına gelmez.** `.gnu_debugdata`’ya bakmakta fayda var.

**Modül listesinde görünmeyen kod, olmayan kod değildir.** Manuel map’leme yaygın bir tekniktir.