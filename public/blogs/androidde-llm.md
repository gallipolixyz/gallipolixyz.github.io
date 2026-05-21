# LLM Modellerini Android Uygulama Güvenliğinde Nasıl Kullanırız?
![](/blogs/img/blog-images/1.png)

Son zamanlarda güvenlik araçlarına LLM eklenmesi giderek yaygınlaşıyor. Burp eklentilerinde, recon araçlarında, SAST tarayıcılarında bu yaklaşımı sık görüyoruz. Ben LLM modellerinin iyi birer analiz asistanı olabileceğini düşünüyorum, ama asıl merak ettiğim soru daha somut bir şeydi: bir LLM, Frida gibi bir dinamik analiz aracına nasıl entegre edilir, ve bunu yaparken koda hiç bakmadan, sadece runtime'dan topladığı veriyle çalışabilir mi?
 
Bu soruyu test etmek için bir vakaya ihtiyacım vardı. SSL pinning bypass'ini seçtim. Android uygulama güvenliğinde araştırma yaparken, bir uygulamanın internet trafiğini incelemek istediğimizde sık sık pinning ile karşılaşırız: uygulama sunucuyla konuşurken sertifikayı sabitliyor ve araya bir proxy koyduğunuzda bağlantıyı reddediyor. Bu kontrolü atlatmanın klasik yolu, uygulamayı decompile edip trafiği denetleyen fonksiyonları bulmak ve onları Frida ile hooklamak.
 
Pinning'i deney alanı olarak seçmemin iki sebebi vardı. Birincisi, Frida ile yaptığımız işlerin en sık tekrarlananlarından biri olması — yani bildiğim, oturmuş bir problem. İkincisi, bilinen ve çalışan çözümlerin zaten var olması. Bu ikincisi benim için kritikti: ortada hazır bir baseline varsa, LLM'in ürettiği çözümün doğru olup olmadığını bu baseline ile karşılaştırarak ölçebilirdim. Yani amacım pinning'i daha iyi atlatan bir tool yapmak değildi; amacım, LLM entegrasyonu fikrinin çalışıp çalışmadığını, sonucu kıyaslayabileceğim güvenli bir zeminde denemekti.
 
## Fikir: Decompile Etmeden, Runtime'dan Gitmek
 
SSL pinning bypass'i normalde statik analizle başlar: APK'yı aç, kodu oku, pinning yapan sınıfları bul. Ben bunun yerine şunu denemek istedim — uygulamanın trafiğini kesen fonksiyonları, uygulama çalışırken tespit edip, runtime'da gördüğüm gerçek fonksiyonları baz alarak Frida hook'u oluşturmak. Böylece koda derinlemesine bakmaya gerek kalmayacaktı.
 
Buradaki asıl motivasyonum, statik analiz sırasında obfuscation uygulanmış kodlardan anlam çıkarmaya çalışırken oluşan token maliyetini düşürmekti. Bir LLM'e tüm decompile çıktısını vermek yerine, runtime sırasında toplanmış daha küçük ve yapılandırılmış veriler sunmanın hem daha düşük maliyetli hem de daha hedef odaklı sonuçlar sağlayabileceğini düşündüm.
 
FridAI bu fikrin somut hali oldu. Tool, uygulama çalışırken pinning ile ilgili fonksiyonları tespit ediyor, bunları nasıl hooklayabileceğini Claude'a (ya da başka bir LLM modeline) iletiyor. Model uygun Frida script'ini hazırlıyor. Script'i deniyoruz; çalışmazsa, ortaya çıkan hata çıktısıyla birlikte tekrar modele gönderiliyor ve düzeltilmiş versiyon isteniyor. Bu döngü, SSL sertifikası bypass edilene kadar sürüyor.
 
## Nasıl Çalışıyor ?
 
Tool üç fazdan oluşuyor: önce recon, sonra LLM ile hook üretimi, en son injection. Burada Frida'yı subprocess olarak çağırıyorum.
 
Recon kısmı APK'yı decompile etmiyor, doğrudan runtime'da çalışıyor. Uygulamayı spawn ediyor ve Frida'nın Java.enumerateLoadedClasses() ile Process.enumerateModules() API'larını kullanarak beş katmanda bilgi topluyor.
 
İlk katman, pinning ile ilgili interface'leri kullanan sınıfları buluyor: X509TrustManager, HostnameVerifier ve CertificatePinner. Buradaki avantaj şu: Sınıf isimleri obfuscate edilmiş olsa bile interface yapısı korunuyor. Çünkü Android runtime'ı bu sınıfları interface üzerinden çağırıyor. Yani adı a.b.c olsa bile, eğer X509TrustManager implement ediyorsa bunu yine tespit edebiliyoruz.
 
İkinci katman, bu sınıfların method imzalarını çıkarıyor. Return type ve parametre bilgileri önemli çünkü LLM'in doğru overload() çağrısını yapabilmesi gerekiyor. Örneğin verify(String, SSLSession) ile verify(String) farklı method'lar ve yanlış olanı hooklamak runtime hatasına neden oluyor.
 
Üçüncü katman, OkHttp, Conscrypt, TrustKit ve Cronet gibi bilinen kütüphaneleri tespit ediyor. Dördüncü katman, libssl.so gibi yüklü native modülleri ve export edilen fonksiyonları listeliyor. Beşinci katman ise APK içindeki network_security_config.xml dosyasını okuyarak ağ güvenliği yapılandırmasını inceliyor.
 
Recon çıktısı yapılandırılmış olarak Claude API'ye gidiyor. Prompt özetle şunu söylüyor: "Bu uygulamada şu pinning sınıfları var, şu method signature'larına sahipler; bypass için bir Frida hook'u yaz." Geri dönen JavaScript ise Frida'nın inject edebileceği bir script.
 
Injection fazında hook uygulanıyor, birkaç saniye bekleniyor, sonra çıktı parse ediliyor. TypeError gibi runtime hataları yakalanırsa Claude'a feedback gönderiliyor: "Şu hook'u yazmıştın, şu hatayı verdi, düzelt." gibi. Bu modele yapılandırılmış geri bildirim veren basit bir retry mekanizması.
 
## Çalıştığında
 
Test için tech.httptoolkit.pinning_demo uygulamasını seçtim. Açık kaynak, pinning'i göstermek için yazılmış bir app; içinde OkHttp CertificatePinner ve TrustKit OkHostnameVerifier var. İlk denemede native module hook'larında parametre sayısı yanlış olduğu için TypeError: not a function aldım. İkinci denemede Java tarafı temizlendi. Üçüncü denemede log'larda şunu gördüm:
 
```
[HOOK] NetworkSecurityTrustManager.checkPins - bypassing pin check
[HOOK] OkHostnameVerifier.verify(String, SSLSession): sha256.badssl.com
```
 
Java tarafındaki pinning bypass başarılı olduğunu gözlemledim.Native hook'ların bir kısmı ise hâlâ çalışmıyordu.Aslında bu, LLM ile ilgili bir mesele değil runtime tarafındaki bazı eksikliklerden kaynaklanıyor. Ne kadar iyi prompt yazarsam yazayım, şuanda çözülecek bir şey değildi.
 
## Sınırları
 
Tool'u şimdilik sadece pinning demo'su üzerinde test ettim burada oldukça başarılı olsada ; gerçek bir production uygulaması üzerinde denemedim. Demo app pinning'i göstermek için yazıldığından, daha karmaşık ve obfuscated uygulamalarda pipeline'ın aynı rahatlıkla çalışacağını söyleyemem. Bunu bir eksiklik olarak değil, projenin bir sonraki adımı olarak görüyorum.
 
## Bu Projenin Bana Öğrettikleri
 
İlki, LLM çıktısının kalitesinin büyük ölçüde ona verilen yapılandırılmış veriye bağlı olması.Bu nedenle recon aşamasının oldukça önemli olduğunu düşünüyorum.
 
İkincisi, runtime introspection'ın LLM için ne kadar zengin bir kaynak olduğunu gördüm. Statik analizde obfuscated kod okunmaz hale gelirken, Frida runtime'da gerçeği görüyor — bir sınıfın adı obfuscate edilebilir ama hangi interface'i implement ettiği runtime'da gizlenemez. Bu, modelin tahminlerini somut kanıtlara dayandırmasını sağlıyor ve başta hedeflediğim "az veriyle, düşük maliyetle çalışma" fikrini de büyük ölçüde karşılıyor.
 
Üçüncüsü, kullandığım self-healing loop — hook'u dene, hatayı yakala, modele geri besle, tekrar dene — aslında pinning'e özgü değil. Aynı yapı başka problemlerde de işe yarayabilir.
 
## Sonuç
 
Sonuç olarak FridAI bir araştırma projesi olarak başladı ve öyle kaldı; iddialı bir tool değil ama bana sormak istediğim soruyu cevaplattı. Başta sorduğum şey şuydu: bir LLM, koda hiç bakmadan, sadece runtime'dan toplanan az ama doğru veriyle çalışan bir hook üretebilir mi? Bu demo özelinde cevap evet oldu — model, runtime recon verisinden Java tarafındaki pinning'i bypass eden bir hook üretebildi ve bunu hazır script'lerin sonucuyla doğrulayabildim. Bu, LLM'i dinamik analiz araçlarına entegre etmenin güzel bir yolu.
 
Tool'u incelemek isterseniz GitHub linki : github.com/simge-yigit/FridAI
