# SS7 Açığı Nedir? Telefonlarımız Bizi Nasıl Ele Veriyor?

![kapak](/blogs/img/SS7-Acigi/kapak.png)

## Giriş

Bankanıza giriş yaparken telefonunuza gelen o 6 haneli güvenlik kodunu (SMS) düşünün. Telefonunuz yanınızda. Kendinizi güvende hissediyorsunuz. Peki ya dünyanın öbür ucundaki bir bilgisayar korsanı o SMS'i sizinle aynı anda okuyabiliyorsa? Hatta sizin haberiniz olmadan çağrılarınızı dinliyor ve anlık konumunuzu haritadan takip edebiliyorsa?

Bütün bunlar bir bilim kurgu filmi senaryosu değil. Bugün telekomünikasyon dünyasının en büyük ve en eski baş ağrılarından biri olan SS7 Açığı sayesinde mümkün olan gerçekler.

Peki ama nasıl olur? Hiçbir teknik bilginiz olmasa bile bu büyük güvenlik açığının ne olduğunu, nasıl işlediğini ve kendimizi nasıl koruyabileceğimizi adım adım inceleyelim.

## SS7 (Signalling System No. 7) Nedir?

**SS7 (Sinyalizasyon Sistemi No. 7)**, basitçe söylemek gerekirse, küresel telefon ağlarının sinir sistemidir.

1970'li yıllarda geliştirilen bu protokol, dünyanın neresinde olursanız olun telefon aramalarını başlatmayı, bitirmeyi, SMS'leri göndermeyi, faturalandırmayı ve operatörler arasında geçiş yapmayı sağlayan evrensel bir dildir.

### Neden Geliştirildi?
1970'lerden önce telefon ağları, "bant içi" (in-band) sinyalizasyon adı verilen bir yöntem kullanıyordu. Yani sesiniz ile çağrıyı yönlendiren kontrol sinyalleri aynı hattan gidiyordu. Bu durum, o dönemde bazı uyanıkların, örneğin özel frekanslar üreten "mavi kutular" kullanarak, sistemi kandırıp bedava aramalar yapmasına neden oluyordu. SS7, kontrol sinyallerini ses hattından ayırarak, yani bant dışı (out-of-band), bu sorunu çözmek için harika bir yenilik olarak ortaya çıktı.

## Sistem Nasıl Çalışır? (Postane Örneği)

SS7 ağının nasıl çalıştığını büyük bir küresel postane ağına benzetebiliriz. Sistem, temelde birkaç ana aktörden oluşur:

1. **SSP (Sinyal Anahtarlama Noktası):** Sizin telefonunuzdan çıkan çağrı ya da mesajı ilk karşılayan yerel santraldir.
2. **STP (Sinyal Transfer Noktası):** Mesajların doğru ülkeye veya şehre gitmesini sağlayan büyük kavşaklar ya da yönlendiricilerdir.
3. **HLR (Ana Konum Kaydedici):** Sistem için merkezdir. Telefon numaranızın sahibini ve şu anda hangi ülke ya da baz istasyonunda olduğunuzu kaydeden büyük bir rehberdir.

Birini aradığınızda, SS7 ağı bu merkezler arasında çok kısa sürede iletişim kurar. "Bu numara nerede? Hattı meşgul mü?" diye sorar ve çağrıyı bağlar.

## Sorun Nerede? "Güven" Üzerine Kurulu Bir Sistem

Her şey bu kadar güzelken sorun nerede başlıyor? Sorun, SS7'nin tasarlandığı yılların (1970'ler) dünyasında bulunuyor.

O yıllarda SS7 ağına sadece devlet destekli ve büyük telekomünikasyon şirketleri erişebiliyordu. Bu yüzden sistem, "Bu ağa bağlı olan herkes güvenilirdir" düşüncesiyle kuruldu.

- **Kimlik Doğrulama Yoktur:** Sistem, gelen bir komutun gerçekten yetkili bir operatörden gelip gelmediğini kontrol etmez.
- **Şifreleme Yoktur:** İletişim, herkesin okuyabileceği düz metin (plaintext) formatında yapılır.

Bugün internetin gelişmesi ve SIGTRAN teknolojisinin ortaya çıkmasıyla birlikte, binlerce büyük ve küçük operatör ortaya çıktı. Bu yüzden bu kapalı ağa erişmek artık çok kolay. Kötü niyetli biri bu ağa girdiğinde, sistem ona bir operatör gibi tamamen güvenir.

## Saldırganlar SS7 Açığı ile Neler Yapabilir?

![phone-attack](/blogs/img/SS7-Acigi/phone-attack.jpg)

Saldırganlar, SS7 açığını kullanarak telefon görüşmelerini ve mesajlarını dinleyebilir. Ayrıca, konum bilgisine erişebilirler. Banka şifreleri gibi önemli bilgileri ele geçirebilirler. Kısacası, bu açık sayesinde telefon kullanıcılarının gizliliği tehlikeye girer.

Bir saldırgan (veya casusluk yazılımları) SS7 ağına eriştiğinde sistemin bu "körü körüne güvenme" zafiyetini kullanarak şunları yapabilir:

### 1. SMS ve Çağrıları Yönlendirme (Dinleme ve Çalma)

SMS ve çağrıları yönlendirme, kullanıcıya gelen mesajların veya aramaların başka bir numaraya aktarılmasını sağlar. Bu özellik, örneğin telefonunuz kapalıyken veya başka bir cihazdayken iletişimi sürdürmenize yardımcı olur. Dinleme işleviyle, yönlendirilmiş mesajları ya da çağrıları okuyabilir ya da dinleyebilirsiniz. Çalma fonksiyonu ise, yönlendirilmiş çağrıları otomatik olarak cevaplayıp çalmasını sağlar. Bu özellikler sayesinde, önemli mesajları veya çağrıları kaçırmazsınız.

Saldırgan, sistemdeki HLR (rehber) noktasına sahte bir mesaj gönderir. Bu mesajda, "Bu numara artık benim bulunduğum baz istasyonunda, ona gelen mesajları ve çağrıları bana yönlendir" diyebilir. Sistem bunu doğrulamaz. Bu yüzden kabul eder.

**Gerçek Hayat Örneği:** 2017 yılında Almanya'da bilgisayar korsanları, kurbanların banka hesaplarına girmek için bu açığı kullandı. Banka, kurbanın telefonuna SMS doğrulama (2FA) kodları gönderdi. Korsanlar, SS7 açığı ile bu kodları kendi telefonlarına yönlendirdi. Böylece banka hesaplarını boşalttılar.

### 2. Gerçek Zamanlı Konum Takibi

Gerçek zamanlı konum takibi, bir nesnenin ya da kişinin bulunduğu yeri anlık olarak izlemeye yarar. GPS, Wi-Fi ve hücresel ağlar gibi teknolojilerle çalışır. Bu yöntem, lojistikte araçların takibi, güvenlik uygulamaları ve akıllı telefonlarda konum tabanlı hizmetler için kullanılır. Konum verileri sürekli güncellenir. Kullanıcılar ya da sistemler, bu bilgilerle hareketleri izleyebilir ya da yönlendirme yapabilir.

Saldırganlar sisteme bir "Abone Bilgisi Sağla" (Provide Subscriber Information) komutu gönderir. Ağ, hedef kişinin şu an dünya üzerinde hangi baz istasyonuna bağlı olduğunu anında saldırgana bildirir. Bu yöntem genellikle üst düzey yetkililerin, gazetecilerin veya aktivistlerin takibinde kullanılır.

### 3. SigPloit Gibi Araçların Tehlikesi

SigPloit gibi araçlar, telekomünikasyon sistemlerine karşı siber saldırıları kolaylaştırır. Bu tür araçlar sayesinde saldırganlar, SS7, Diameter ve GTP gibi çekirdek ağ protokollerindeki açıkları kullanabilir. Sonuç olarak, gizlilik ihlalleri, bilgi sızıntısı ve dolandırıcılık gibi ciddi riskler ortaya çıkar. Ayrıca bu araçlar, saldırıları otomatikleştirdiği için hem teknik bilgisi az olan hem de deneyimli saldırganlar tarafından rahatça kullanılabilir. Bu durum, tehditlerin yaygınlaşmasına ve telekomünikasyon altyapısının daha savunmasız hale gelmesine yol açar.

Eskiden bu saldırıları yapmak zordu ve pahalıydı. Ancak günümüzde SigPloit gibi siber güvenlik uzmanlarının ağları test etmek için geliştirdiği açık kaynaklı yazılımlar sayesinde, SS7 ağına erişimi olan kötü niyetli kişiler araya girme (Man-in-the-Middle) ve sahte düğüm (spoofing) saldırılarını çok daha kolay ve otomatik bir şekilde yapabiliyor.

## Madem Bu Kadar Tehlikeli, Neden Hâlâ Kullanılıyor?

Aklınıza "Böyle bir açık varsa neden hemen yeni bir sisteme geçmiyoruz?" sorusu gelebilir. Cevabı şudur: **Geriye Dönük Uyumluluk.**

Bugün 4G veya 5G gibi daha güvenli protokoller kullansak bile, dünyanın herhangi bir yerinde eski bir 2G veya 3G ağı bulunan bir ülkeye seyahat ettiğinizde ya da oradan birini aradığınızda, sistemlerin birbiriyle iletişim kurabilmesi için ortak dil olarak SS7'yi kullanmak zorundayız. Milyarlarca dolarlık küresel altyapıyı bir gecede değiştirmek ne yazık ki mümkün değil.

## Kendimizi Nasıl Koruyabiliriz?

Altyapıdaki bu açık telekom operatörlerinin çözmesi gereken bir sorun olsa da, son kullanıcı olarak kendimizi korumak için alabileceğimiz çok güçlü ve basit önlemler var:

**1. SMS ile İki Adımlı Doğrulamayı (2FA) Bırakın:**
Banka ya da sosyal medya hesaplarınızı korumak için SMS kullanmak artık güvenli değil. Bunun yerine Google Authenticator, Microsoft Authenticator, Authy gibi şifre üreten uygulamalar ya da YubiKey gibi fiziksel güvenlik anahtarları kullanın. Bu yöntemler SS7 üzerinden değil, doğrudan cihazınızda çalışır. Bu yüzden kırılamazlar.

**2. Uçtan uca şifreli iletişim uygulamaları kullanın:**
Normal telefon aramalarınız ve operatör üzerinden attığınız SMS'ler SS7 üzerinden gider ve şifresizdir. Ancak WhatsApp, Signal, Telegram (Gizli Sohbet), iMessage gibi uygulamalar internet verisi üzerinden "uçtan uca şifreli" iletişim kurar. SS7 altyapısı bu mesajların sadece "şifreli bir veri yığını" olduğunu görür. İçeriğini asla okuyamaz.

## Sonuç

SS7 açığı, modern dijital dünyamızın eski bir temele dayanmasından kaynaklanan büyük bir sorun. Küresel altyapı yenilenene kadar, dijital güvenliğimizi kendimiz korumalı ve SMS'e olan güvenimizi hemen bırakmalıyız.
