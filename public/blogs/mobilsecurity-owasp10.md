# Mobil Uygulama Güvenliği Neden Önemlidir? Günlük Hayatımızdaki Riskler ve Örnekler

|  |  |  |  |  | ![](/blogs/img/mobilsecurity-owasp/resim1.png) |
|--|--|--|--|--|:--:|


Mobil uygulamalar, günlük yaşamın vazgeçilmez bir parçası hâline gelmiştir. Bankacılık, sağlık ve alışveriş gibi birçok hizmete kolay erişim sağlayarak kullanıcı deneyimini artırsa da, bu uygulamaların işlediği hassas ve kişisel veriler nedeniyle güvenlik konusu büyük önem taşımaktadır. Yapılan araştırmalar, hem ücretsiz hem de ücretli uygulamaların ciddi güvenlik açıkları barındırdığını ortaya koymaktadır. Bu açıklar genellikle kötü tasarım, API bilgisindeki eksiklikler ve üçüncü taraf kütüphanelerin kontrolsüz kullanımı gibi nedenlere dayanmaktadır.

Üstelik bu güvenlik zafiyetleri yalnızca az bilinen veya düşük kaliteli uygulamalarda değil, popüler ve yaygın olarak kullanılan uygulamalarda da görülmektedir. Örneğin, Starbucks’ın iOS uygulamasında tespit edilen ve geniş yankı uyandıran bir açık, kullanıcı kimlik bilgilerinin düz metin olarak saklanmasına neden olmuş; bu durum potansiyel veri hırsızlığı riskini artırmıştır.

Benzer şekilde, Microsoft Threat Intelligence tarafından yapılan son açıklamalarda, Google Play Store’da barındırılan birçok popüler Android uygulamasında path traversal türünde bir güvenlik açığı tespit edilmiştir. Bu açık, kötü niyetli uygulamaların, savunmasız uygulamaların ana dizinlerindeki dosyaların üzerine yazmasına olanak tanımaktadır.

Mobil uygulama güvenliği üzerine yapılan bir başka çalışmada ise, 140 ücretsiz popüler Android ve iOS uygulaması MobilAppScrutinator adlı analiz platformu kullanılarak incelenmiş; bu uygulamaların üçüncü taraflara kişisel tanımlayıcı bilgiler (Wi-Fi MAC adresi, Android ID, IMEI gibi) sızdırdığı ortaya konmuştur. Bu sızıntıların bazıları, man-in-the-middle (MITM) saldırıları yoluyla gerçekleşmiştir.

## Güvenli Mobil Hizmetin Bileşenleri

Mobil hizmetlerin güvenli bir şekilde sunulabilmesi için, mobil ofis mimarisi genellikle dört ana bileşen üzerinden değerlendirilmektedir:

İçerik Alanı: Mobil uygulamalar, e-postalar ve reklamlar gibi kullanıcı terminaline aktarılan tüm içerikleri kapsar. Kullanıcıların ilk temas kurduğu alan olması nedeniyle kritik öneme sahiptir.

Terminal Alanı: Akıllı telefonlar ve tabletler gibi kullanıcıya ait cihazlar ile bu cihazların işletim sistemleri bu alanda yer alır.

Ağ Alanı: Terminal ile hizmet sağlayıcı sunucusu arasındaki iletişimi sağlayan 4G, Wi-Fi gibi bağlantı türlerini içerir.

Sunucu Alanı: Hizmetlerin barındırıldığı ve kullanıcıya sunulduğu sunucu altyapısını ifade eder. Genellikle hizmet sağlayıcı kurumların veri merkezlerini kapsar.

Güvenli bir mobil hizmet ortamı, bu dört alanın her birinin ayrı ayrı güvenliğinin sağlanmasının yanı sıra, aralarındaki iletişimin de korunmasıyla oluşturulabilir.

## OWASP MOBİLE TOP 10 & Örnek Saldırı Senaryoları

### M1: Uygunsuz Kimlik Bilgisi Kullanımı

Mobil uygulamanın, işletim sisteminin sunduğu güvenlik özelliklerini yanlış, eksik veya kötü bir şekilde kullanmasıdır. Bu durum, platforma özgü güvenlik mekanizmalarının (örneğin Android’de KeyStore, iOS’ta Keychain, izin yönetimi, WebView kullanımı gibi) ihmal edilmesi ya da hatalı uygulanması sonucu oluşur.

Örnek Senaryo :

Bir saldırgan, bir kullanıcının mobil cihazına fiziksel erişim sağlar. Uygulama geliştiricisi, oturum anahtarı, kullanıcı adı veya şifre gibi kimlik bilgilerini güvenli olmayan bir şekilde (örneğin düz metinle yerel depolamada) saklamıştır.
Saldırgan, cihazdan bu verileri kolayca çıkarır ve kullanıcının hesabına yetkisiz erişim elde eder. Bu durum, kullanıcı verilerinin sızmasına veya sistemin kötüye kullanılmasına yol açabilir.

### M2:Yetersiz Yazılım

Mobil uygulama geliştirme sürecinde kullanılan harici bileşenler (kütüphaneler, SDK’lar, paket yöneticileri, üçüncü taraf servisler) yeterince doğrulanmaz, denetlenmez veya güncellenmezse, bu durum tedarik zinciri kaynaklı güvenlik açıklarına yol açar.
Bu açık, uygulamanın içine farkında olmadan zararlı kodların eklenmesine veya güvenliği zayıf bir bileşenin uygulamanın genel güvenliğini tehlikeye atmasına neden olabilir.

Örnek Senaryo:

Bir saldırgan, geliştirme aşamasında popüler bir mobil uygulamaya kötü amaçlı yazılım (malware) enjekte eder. Daha sonra bu uygulamayı geçerli bir sertifika ile imzalar ve uygulama mağazasına yükler, mağazanın güvenlik kontrollerini aşarak dağıtıma sokar.
Kullanıcılar bu zararlı uygulamayı indirip kurar ve uygulama, onların oturum bilgilerini ve diğer hassas verilerini çalar. Saldırgan, elde ettiği bu verileri dolandırıcılık veya kimlik hırsızlığı yapmak için kullanır. Bu durum, mağdurlar için ciddi mali kayıplara ve uygulama sağlayıcısı için itibar kaybına neden olur.

### M3:Güvensiz Kimlik Doğrulama/Yetkilendirme

Mobil uygulamanın kullanıcıların kimliğini doğrulama (authentication) ve kaynaklara erişimini kontrol etme (authorization) işlemlerini yetersiz, hatalı veya güvensiz yollarla gerçekleştirmesidir. Bu durum, kötü niyetli kişilerin kullanıcı hesabına yetkisiz erişim sağlamasına veya erişim sınırlarını aşmasına olanak tanır.

Örnek Senaryo :

Bir kullanıcı, arka uçta bulunan bir REST API’ye bir API uç noktası isteği yapar. Bu istek, bir OAuth bearer token ile birlikte kullanıcının ait olduğu LDAP gruplarının listesini içeren bir başlık içerir. Arka uç sistemi, bearer token’ını doğruladıktan sonra, gelen LDAP gruplarını inceleyerek doğru grup üyeliğini kontrol eder ve ardından hassas işlevselliğe devam eder. Ancak, arka uç sistemi LDAP grup üyeliğini bağımsız olarak doğrulamaz ve bunun yerine kullanıcının gönderdiği LDAP bilgisini kabul eder. Kullanıcı, gelen başlığı değiştirerek kendisini herhangi bir LDAP grubunun üyesi olarak gösterebilir ve yönetici işlevselliğini yerine getirebilir.

### M4:Yetersiz Girdi/Çıktı Doğrulaması

Mobil uygulamalar, kullanıcıdan veya başka bir kaynaktan gelen verileri doğru şekilde doğrulamaz veya filtrelemezse, bu durum güvenlik açıklarına yol açar. Yetersiz girdi/çıktı doğrulaması, kötü niyetli bir kullanıcının uygulama sistemine zararlı veri göndermesini veya sistemden hassas veri çekmesini kolaylaştırabilir.

Örnek Senaryo:

Bir saldırgan, yetersiz çıktı doğrulaması ve sanitasyonu olan bir mobil uygulamayı tespit eder. Kullanıcı tarafından üretilen içerik veya güvenilmeyen verilerin işlendiği bir giriş noktasından faydalanır. Zararlı girdi içeren (örneğin, HTML, JavaScript, SQL gibi) özel olarak hazırlanmış verilerle, çıktı doğrulamasının eksikliğinden faydalanır. Bu özel hazırlanmış girdiyi kullanıcı etkileşimiyle gönderdiğinde, uygulama bunu doğrulamaz veya temizlemez, bu da enjekte edilen kodun veya istenmeyen işlemlerin çalışmasına olanak tanır. Saldırgan, cross-site scripting (XSS) veya SQL enjeksiyonu gibi enjeksiyon tabanlı saldırıları başarıyla gerçekleştirir, böylece uygulamanın bütünlüğünü bozar ve hassas bilgilere erişim sağlar.

### M5:Güvensiz İletişim

Mobil uygulamanın, veri iletimi sırasında güvenli iletişim protokollerini kullanmaması veya hatalı yapılandırmasıdır. Bu, hassas verilerin (örneğin, kullanıcı bilgileri, oturum anahtarları, ödeme verileri vb.) şifrelenmeden veya güvenli olmayan yollarla iletilmesi durumunda ortaya çıkar. Sonuç olarak, saldırganlar, man-in-the-middle (MITM) saldırıları gibi tekniklerle bu iletilen verileri dinleyebilir, değiştirebilir veya çalabilir.

Örnek Senaro:

Mobil uygulama ve bir uç nokta başarılı bir şekilde bağlantı kurar ve bağlantı el sıkışması (handshake) sırasında bir şifreleme takımı (cipher suite) üzerinde anlaşmaya varır. İstemci, sunucu ile zayıf bir şifreleme takımı kullanmak üzere başarılı bir şekilde anlaşır ve bu da, rakip tarafından kolayca çözülebilecek zayıf bir şifrelemeye yol açar. Bu durum, mobil uygulama ile uç nokta arasındaki kanalın gizliliğini tehlikeye atar.

### M6:Yetersiz Gizlilik Kontrolleri

Mobil uygulamalar, kullanıcıların kişisel bilgilerini ve gizlilik verilerini doğru şekilde korumaz ve kontrol etmezse, bu durum gizlilik ihlallerine ve kullanıcı bilgileri üzerindeki denetimsizlik sorunlarına yol açabilir. Yetersiz gizlilik kontrolleri, uygulamanın kullanıcı verilerini toplama, depolama, işleme ve paylaşma süreçlerinde şeffaflık eksiklikleri, gereksiz veri toplama veya kötü veri koruma uygulamaları ile karakterizedir.

Örnek Senaryo :

Logların ve istisnaların raporlanması, üretken bir uygulamanın kalite güvencesi için oldukça önemlidir. Çökme raporları ve diğer kullanım verileri, geliştiricilerin hataları düzeltmelerine ve uygulamalarının nasıl kullanıldığını öğrenmelerine yardımcı olur. Ancak, loglar ve hata mesajları, geliştiriciler bu verileri log veya hata mesajlarına dahil etmeyi tercih etmişse, kişisel tanımlanabilir bilgiler (PII) içerebilir. Ayrıca, üçüncü taraf kütüphaneler de hata mesajlarında ve loglarında PII içerebilir. Yaygın bir sorun örneği, veritabanı istisnalarının sorgunun veya sonucun bir kısmını açığa çıkarmasıdır. Bu, crash raporlarını toplamak ve değerlendirmek için kullanılan herhangi bir platform sağlayıcısına görünür hale gelebilir. Ayrıca, hata ekranında görüntülenirse kullanıcıya veya cihaz loglarını okuyabilen saldırganlara da görünür olabilir. Geliştiriciler, neyi logladıklarına özellikle dikkat etmelidir ve istisna mesajlarının kullanıcıya gösterilmeden veya bir sunucuya raporlanmadan önce temizlenmiş olmasını sağlamalıdır.

### M7: Yetersiz Binaries Koruması

Mobil uygulamanın kaynak kodunun veya uygulama ikili dosyasının (binary) kötü niyetli kişiler tarafından dekompile edilmesi, tersine mühendislik yapılması veya modifikasyonlar yapılması gibi güvenlik zafiyetlerini ifade eder. Uygulamalar, genellikle apk dosyası (Android) veya ipa dosyası (iOS) gibi ikili dosyalarda korunur, ancak bu dosyalar, yeterli güvenlik önlemleri alınmadığında kolayca deşifre edilebilir ve kötü amaçlarla kullanılabilir.

Örnek Senaryo:

Bir sağlık uygulaması düşünün, bu uygulama, kullanıcıların sesli ya da serbest metin girişleriyle verdikleri istekleri yanıtlamak için bir yapay zeka (YZ) özelliğine sahip. Bu uygulama, çevrimdışı erişimi sağlamak ve kendi indirme sunucularını barındırmaktan kaçınmak amacıyla özel ve kaliteli bir YZ modelini kaynak koduna dahil etmiştir. Bu YZ modeli, uygulamanın en değerli varlığıdır ve geliştirilmesi birçok kişisel yıl almıştır. Bir saldırgan, bu modelin kaynak kodundan çıkarılmaya çalışılabilir ve rakiplere satılabilir. Eğer uygulama ikili dosyası yeterince korunmazsa, saldırgan yalnızca YZ modeline erişmekle kalmaz, aynı zamanda modelin nasıl kullanıldığını öğrenebilir ve bu bilgiyi YZ eğitim parametreleriyle birlikte satabilir.

### M8: Güvenlik Yapılandırma Hataları

Mobil uygulamaların veya sistemlerin güvenlik ayarlarının yanlış yapılandırılması sonucu ortaya çıkan bir güvenlik açığıdır. Bu tür hatalar, uygulamanın veya sistemin güvenlik özelliklerinin yanlış bir şekilde yapılandırılması, gereksiz hizmetlerin etkinleştirilmesi, güvenlik açıklarının fark edilmemesi veya yetersiz erişim kontrolleri gibi durumları içerir. Güvenlik yapılandırma hataları, genellikle varsayılan ayarların değiştirilmemesi, gereksiz izinlerin verilmesi veya yanlış yapılandırılmış güvenlik protokollerinin kullanılmasıyla ortaya çıkar.

Örnek Senaryo:

Bir mobil uygulama, dışa aktarılan bir dosya içerik sağlayıcısında kök yolunu açığa çıkarır ve böylece diğer uygulamaların kaynaklarına erişmesine izin verir.

### M9: Güvensiz Veri Depolama

Mobil uygulamalar veya sistemlerin, kullanıcı verilerini güvensiz bir şekilde saklaması durumudur. Bu, verilerin şifrelenmeden veya koruma önlemleri alınmadan cihazda depolanması anlamına gelir. Güvensiz veri depolama, verilerin yetkisiz erişimlere, çalınmalara veya kötüye kullanımına açık olmasına neden olabilir. Özellikle kişisel veriler, kimlik bilgileri, şifreler veya ödeme bilgileri gibi hassas verilerin güvenli bir şekilde saklanmaması, büyük güvenlik riskleri yaratır.

Örnek Senaryo:

Mobil uygulama, kişisel olarak tanımlanabilir bilgileri (PII) gibi hassas kullanıcı verilerini, doğru erişim kontrolleri veya şifreleme kullanmadan cihazda yerel olarak saklar. Bu, cihaza fiziksel erişimi olan herhangi birinin veriyi çıkarıp görüntülemesine olanak tanır.

### M10: Yetersiz Kriptografi

bir mobil uygulamanın veya sistemin veri güvenliğini sağlamak için yeterli kriptografik yöntemleri kullanmaması durumunu ifade eder. Bu, verilerin şifrelenmemesi veya zayıf şifreleme algoritmaları kullanılması anlamına gelir. Yetersiz kriptografi, verilerin gizliliğini ve bütünlüğünü tehlikeye atar ve saldırganların veriyi okumasına veya değiştirmesine olanak tanır. Özellikle hassas veriler, şifreler, kimlik doğrulama bilgileri veya ödeme bilgileri gibi kritik bilgiler için uygun kriptografik yöntemler kullanılmalıdır.

Örnek Senaryo:

Zayıf kriptografi, mobil uygulamanın kendisindeki uygulama hatalarından da kaynaklanabilir. Bu hatalar, kriptografik kütüphanelerin yanlış kullanımı, güvensiz anahtar üretimi, yanlış rastgele sayı üretimi veya şifreleme ile ilgili fonksiyonların güvensiz bir şekilde işlenmesi gibi durumları içerebilir. Saldırganlar, bu hataları kullanarak şifreleme korumalarını atlatabilir veya zayıflatabilir.


Kaynaklar :

Peruma, A., Huo, T., Araújo, A. C., & Imanaka, J. A developer-centric study exploring mobile application security practices and challenges

Li, Z. (Yıl). Mobile application software security protection: A comprehensive analysis

OWASP (2024) — OWASP mobile top 10
