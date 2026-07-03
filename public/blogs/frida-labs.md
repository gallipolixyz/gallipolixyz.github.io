# Frida ile Android Uygulama Hooking — Lab 0x1: Method Hooking

Bu yazı, [DERE'nin Frida-Labs](https://github.com/DERE-ad2001/Frida-Labs) CTF serisini temel alan bir yazı dizisinin ilk parçasıdır.Bu ilk yazıda, hepsinin üzerine kurulduğu en temel becerilerle başlıyoruz: bir method'u hook'lamak ve çözüme farklı yollarla erişebilmek.

## Kavramsal Zemin

Devam etmeden önce, yazı boyunca sık geçecek üç kavramı netleştirelim :

**Frida**, bir *dynamic instrumentation* aracıdır. Dynamic instrumentation, çalışan bir programın davranışını — kaynak koduna sahip olmadan ve programı yeniden derlemeden — runtime'da gözlemleme ve değiştirme tekniğidir. Klasik bir debugger gibi programı durdurup incelemekle sınırlı kalmaz; çalışırken araya kendi kodunu enjekte etmene izin verir.

**ART (Android Runtime)**, Android cihazlarda uygulama kodunu çalıştıran runtime ortamıdır. Java veya Kotlin kaynağından derlenen DEX bytecode'unu yürütür. Frida, çalışan bir uygulamanın ART instance'ına dışarıdan bağlanır ve o uygulamanın method'larına müdahale eder. Bu yazıdaki her işlem, aslında ART üzerinde çalışan bir uygulamaya dokunmaktan ibarettir.

**Hooking**, bir method çağrısını araya girerek yakalama ve — istenirse — davranışını değiştirme işlemidir. Bir method'u hook'ladığında, o method her çağrıldığında kontrol önce senin koduna geçer. Bu noktada dört şey yapabilirsin: orijinal method'u olduğu gibi çağırmak, argümanlarını okumak, dönüş değerini değiştirmek veya method'u tamamen kendi implementasyonunla değiştirmek. Bu yazının tamamı, bu dört seçeneğin pratikte nasıl kullanıldığını gösteriyor.

> **Başlamadan önce:** Aşağıdaki komutlar, sisteminde `frida-tools`'un kurulu ve hedef cihazda uyumlu bir `frida-server`'ın çalışır durumda olduğunu varsayar. Kurulum bu yazının kapsamı dışında; kısaca, client tarafı `pip install frida-tools` ile kurulur, server tarafı cihaz mimarisine uygun binary olarak `/data/local/tmp` altına push edilip çalıştırılır. Ayrıca statik inceleme için root'lu bir cihaz (veya emülatör), `adb` ve jadx aşinalığı gerekir. **jadx**, bir APK içindeki DEX bytecode'unu okunabilir Java koduna geri çeviren (decompile eden) araçtır; hedef uygulamanın mantığını çalıştırmadan anlamak için kullanacağız.

## Frida'nın Zihinsel Modeli — `Java.perform` ve `Java.use`

Lab'a geçmeden önce, dört çözümde de kullanacağımız iki temel yapı taşını oturtalım. Frida'nın Java tarafıyla yaptığın hemen her iş bu ikisi üzerinden yürür.

```javascript
Java.perform(function() {
    var ref = Java.use("<package_name>.<class>");
    // ref üzerinden: method hook'lama, method çağırma, field okuma/yazma
});
```

**`Java.perform(fn)`**, script'ini ART runtime'ının Java tarafına bağlayan giriş kapısıdır. Frida'nın kendi thread'ini VM'e attach eder ve içine yazdığın kodun uygulamanın Java class'larına erişebilmesini sağlar. Java ile etkileşecek her satırı bu fonksiyonun içine yazmak zorundasın; dışarıda çağrılan bir `Java.use`, henüz kurulmamış bir bağlam üzerinden çalışmaya kalkacağı için hata verir.

**`Java.use("<package>.<class>")`**, belirtilen class için bir **wrapper** (sarmalayıcı) döndürür. Bu wrapper üzerinden static method çağırabilir, field okuyup yazabilir, `.implementation` ile bir method'u hook'layabilir veya `$new()` ile o class'tan bir instance oluşturabilirsin. Buradaki kritik nokta şudur: `Java.use` sana gerçek Java `Class` objesini vermez, ART'taki class'ı saran bir JavaScript proxy'si verir. Sen bu proxy üzerinden konuşursun, Frida arkada bu çağrıları gerçek ART çağrılarına tercüme eder.

Peki bir method'a `.implementation` atadığında ne oluyor? Frida, o method'un ART'taki giriş noktasını (entry point) kendi araya-girme koduna yönlendirir. Bu yönlendirme koduna **trampoline** denir (İng. tramplen): method çağrıldığında akış önce trampoline'e, oradan da senin JavaScript implementasyonuna sıçrar. Bu işlem *ART method redirection* olarak bilinir. Önemli olan, orijinal method'un kodunun diskte ve bellekte olduğu gibi durmasıdır; sen kodu silmiyor veya değiştirmiyorsun, yalnızca VM o method'u her çağırdığında kontrolün önce sana düşmesini sağlıyorsun. Bu ayrım, birazdan orijinal method'u kendi hook'umuzun içinden yeniden çağırabilmemizin de sebebidir.

## Lab 0x1 — Method Hooking

### Uygulamanın statik analizi

Uygulama bizden bir sayı istiyor; yanlış bir değer girdiğimizde "Try again" yanıtını veriyor. Doğru sayının ne olduğunu anlamak için APK'yı jadx ile açıp `onClick` metoduna bakalım:

```java
public void onClick(View view) {
    String obj = editText.getText().toString();
    if (TextUtils.isDigitsOnly(obj)) {
        MainActivity.this.check(i, Integer.parseInt(obj));
    }
}
```

Girdiğimiz sayı, `check()` metoduna **ikinci** argüman olarak geçiyor. Peki ilk argüman olan `i` nedir? Uygulama açılışında bir kez üretilen bir rastgele sayı:

```java
int get_random() {
    return new Random().nextInt(100);
}
```

`check()` metodunun içindeki kontrol ise şu:

```java
void check(int i, int i2) {
    if ((i * 2) + 4 == i2) {
        // flag decode edilir ve TextView'e yazılır
    }
}
```

Buradaki mantık nettir: girdiğimiz sayının (`i2`), rastgele sayının iki katının dört fazlasına — yani `(random * 2) + 4` değerine — eşit olması gerekiyor. Rastgele sayı 0–100 aralığında ve uygulama açılışında yalnızca bir kez üretiliyor; sonrasında sabit kalıyor. Dolayısıyla bu değeri ele geçirebilirsek doğru girdiyi hesaplayabilir ve flag'i elde edebiliriz.

Bu problemi Frida ile çözmenin birden fazla yolu var. Aşağıda dördünü de ayrı ayrı ele alacağız; her biri hooking'in farklı bir yönünü gösterir.

### Yol 1 — `get_random()`'ı hook'layıp dönüş değerini sabitlemek

İlk yaklaşım şu gözleme dayanıyor: rastgele sayıyı biz belirlersek, tatmin etmemiz gereken değeri de baştan biliriz. `get_random()` metodunu hook'layıp, orijinal davranışını görmezden gelerek her zaman `5` döndürmesini sağlayalım:

```javascript
Java.perform(function() {
    var a = Java.use("com.ad2001.frida0x1.MainActivity");
    a.get_random.implementation = function() {
        console.log("get_random() hooked");
        console.log("Returning 5");
        return 5;
    };
});
```

Burada dikkat edilmesi gereken kritik bir **timing** problemi var. `get_random()` metodu uygulama açılışında yalnızca bir kez tetikleniyor. Eğer script'i uygulama zaten açıldıktan *sonra* Frida console'una yapıştırırsak, metot çoktan çalışmış ve rastgele sayı çoktan üretilmiş olur; hook'umuz artık hiçbir işe yaramaz.

Bunu anlamak için Frida'nın bir uygulamaya bağlanmasının iki yolunu ayırmak gerekir. **Attach**, zaten çalışan bir process'e sonradan bağlanmaktır. **Spawn** ise uygulamayı Frida'nın başlatmasıdır; böylece uygulamanın daha ilk kod satırı çalışmadan hook'larımızı yerleştirebiliriz. Erken çalışan `get_random()` gibi bir metodu yakalamanın tek yolu spawn'dır. Bunun için script'i bir dosyaya kaydedip, uygulamayı başlatırken `-l` bayrağıyla yüklüyoruz — `-f` bayrağı uygulamayı spawn eder, `-l` ise başlatma anında script'i enjekte eder:

```bash
frida -U -f com.ad2001.frida0x1 -l script.js
```

Peki `return 5` satırı neden zorunlu? `.implementation` atadığında metodun orijinal gövdesini tamamen kendi kodunla değiştirmiş olursun. `get_random()` imzası gereği bir `int` döndürmek zorundadır ve bu dönüş değeri, çağıran tarafta `check()`'e giden `i` değişkenine atanır. Eğer implementasyonunda hiçbir şey `return` etmezsen, ART tarafında beklenen dönüş değeri gelmez ve uygulama çöker. İlk denemende `return`'ü unutursan alacağın hata tam olarak budur. Bu, hooking'in genel bir kuralıdır: bir metodu implementasyonuyla değiştirdiğinde, orijinalin sözleşmesini (imzasını ve dönüş tipini) korumak senin sorumluluğundadır.

Artık `get_random()` her zaman `5` döndürüyor. Kontrol `5 * 2 + 4 = 14` olduğundan, uygulamaya `14` girdiğimizde flag'i elde ederiz.

### Yol 2 — Orijinal `get_random()`'ı çağırıp gerçek değeri sızdırmak

İlk yolda rastgele override ederek  problemi kendi lehimize çevirdik. Ancak bazen amaç değeri ezmek değil, uygulamanın gerçekten ürettiği değeri **öğrenmektir**. Bunun için hook'umuzun içinden orijinal metodu çağırabiliriz:

```javascript
Java.perform(function() {
    var a = Java.use("com.ad2001.frida0x1.MainActivity");
    a.get_random.implementation = function() {
        var ret_val = this.get_random();            // orijinali çağır
        console.log("Gerçek random: " + ret_val);
        console.log("Bypass değeri: " + (ret_val * 2 + 4));
        return ret_val;                             // gerçek değeri geri döndür
    };
});
```

Buradaki anahtar `this.get_random()` çağrısıdır. Metodu hook'lamış olsak da, Frida orijinal implementasyonun pointer'ını korur — yani gerçek kod hâlâ erişilebilir durumdadır. `this.<method>()` çağrısı senin trampoline'ini atlayıp doğrudan bu orijinal koda gider ve onun ürettiği gerçek dönüş değerini sana verir. Böylece hem araya girip değeri loglayabiliyor, hem de orijinal davranışı bozmadan sürdürebiliyoruz. "Logla, orijinali çağır, dönüşü olduğu gibi ilet" deseni, dinamik analizde en sık başvurulan yapıdır; çünkü uygulamanın normal akışını kesintiye uğratmadan içine bakmanı sağlar.

Script'i çalıştırdığında console'da gerçek rastgele sayıyı ve doğrudan hesaplanmış bypass değerini görürsün. Bu değeri uygulamaya girdiğinde flag gelir.

### Yol 3 — `check()`'i hook'layıp argümanları dump etmek

Rastgele sayı, `check()` metoduna zaten birinci argüman olarak geçiyor. O hâlde `get_random()` yerine doğrudan `check()`'i hook'layıp argümanlarını okuyabiliriz. Ancak `check(int, int)` argüman aldığı için burada yeni bir kavram devreye giriyor: `overload`.

```javascript
Java.perform(function() {
    var a = Java.use("com.ad2001.frida0x1.MainActivity");
    a.check.overload('int', 'int').implementation = function(random, input) {
        console.log("Random sayı: " + random);
        console.log("Kullanıcı girdisi: " + input);
        this.check(random, input);   // orijinali çağır ki flag akışı bozulmasın
    };
});
```

`overload` neden gerekli? Java, *method overloading*'e izin verir: aynı isimde ama farklı parametre listesine sahip birden çok metot tanımlanabilir (örneğin `check(int)`, `check(int, int)`, `check(String)` aynı anda var olabilir). ART bu metotları isimleriyle değil, **imzalarıyla** (method signature — yani parametre tipleri ve sırasıyla) birbirinden ayırt eder. Frida'ya "bu isimdeki metotlardan hangisini kastediyorum" diye tam imzayı bildirmezsen, birden fazla overload bulunduğunda hangisine bağlanacağını belirleyemez. `.overload('int', 'int')` ifadesi tam olarak bunu söyler: "iki `int` argüman alan versiyonu hook'la." Uygulamada tek bir overload olsa bile, argüman alan metotlarda imzayı açıkça vermek hem daha okunabilir hem de ileride hataya kapalı bir alışkanlıktır.

`check()` yalnızca butona basıldığında çalıştığı için — uygulama açılışında değil — bu script'i spawn anında yüklemene gerek yoktur; uygulamaya attach edip çalıştırman yeterlidir:

```bash
frida -U -f com.ad2001.frida0x1
```

Butona bastığında console'da rastgele sayıyı (örneğin `12`) görürsün. Buradan `12 * 2 + 4 = 28` değerini hesaplayıp girdiğinde flag gelir.

### Yol 4 — `check()`'i doğrudan geçerli argümanlarla çağırmak

Son ve en farklı yaklaşım, problemi tersinden okumaya dayanıyor. Madem koşul `input == (random * 2) + 4`, o hâlde rastgele sayıyla hiç uğraşmayabiliriz: `check()` metodunu, bu koşulu baştan sağlayan iki sayıyla kendimiz çağırırız. Rastgele sayının gerçek değeri bu durumda tamamen önemsiz hâle gelir, çünkü metoda geçilecek her iki değeri de biz kontrol ediyoruz:

```javascript
Java.perform(function() {
    var a = Java.use("com.ad2001.frida0x1.MainActivity");
    a.check.overload('int', 'int').implementation = function(random, input) {
        this.check(8, 20);   // 8 * 2 + 4 == 20 →  koşul sağlanır
    };
});
```

`check()` her çağrıldığında, uygulamanın gerçekte gönderdiği argümanları görmezden gelip orijinal metodu bizim seçtiğimiz `8` ve `20` değerleriyle çağırıyoruz. `8 * 2 + 4 = 20` olduğundan koşul sağlanır ve butona basar basmaz flag gelir.

## Sonuç
 
`frida0x1` yüzeyde basit bir challenge gibi görünse de, method hooking'in tüm temel gramerini tek örnekte topluyor. Aynı hedefe dört ayrı yoldan gitmemiz tesadüf değil; her yol, bir metotla runtime'da kurabileceğimiz farklı bir ilişkiyi temsil ediyor: davranışı `.implementation` ile bütünüyle değiştirmek, dönüş değerini override etmek, `this.method()` ile orijinali çağırıp yalnızca gözlemlemek ve `overload(...)` ile doğru imzayı hedefleyip argümanları okumak.Bu dört kalıp, ileride karşılaşabileceğimiz çoğu şeyin temeli.
