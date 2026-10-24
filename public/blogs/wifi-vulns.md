# Bir Hacker, Aynı Wi-Fi Ağındaki İnsanlar Hakkında Ne Kadar Bilgi Edinebilir?

![](/blogs/img/wifi-vulns/wifi_attacks.png)

Ücretsiz Wi-Fi ağlarına bağlanmak neredeyse herkesin yaptığı bir şey. Kahveni yudumlarken sosyal medyayı kontrol ediyorsun, biraz haber okuyorsun, mailine göz atıyorsun. Bütün bunlar olurken, farkında bile olmadan veri paketleri havada uçuşuyor. Peki, aynı kafedeki bir başka müşteri — yani art niyetli biri — bunlardan ne kadarını görebilir?

Ziyaret ettiğin siteleri öğrenebilir mi? Gönderdiğin mesajlara ulaşabilir mi? Telefonunun IP ve MAC adresini, hangi uygulamaları kullandığını ya da oturum açtığın yerlere kadar görebilir mi? Ve en klasik soru: “Ben zaten HTTPS kullanıyorum, o yüzden tamamen güvende değil miyim?”

Tek kelimelik cevaplarla özetlemek mümkün değil. Hangi bilgilerin açığa çıktığını anlamak için, ağda verinin nasıl aktığını, cihazların nasıl iletişim kurduğunu — ve tabii ki saldırganın tam olarak nerede devreye girdiğini — bilmek şart.

Şimdi gel, birlikte bakalım: Aynı Wi-Fi ağında biri, senin etkinliklerinden tam olarak neye erişebilir, neleri göremez ve bunlar hangi durumlarda değişir?

![](/blogs/img/wifi-vulns/wifi.jpeg)

## 1. Wi-Fi ağına bağlanınca ne olur?

Wi-Fi, bildiğin gibi, cihazları kablosuz olarak bir yerel ağa bağlıyor. Sen telefonunu kafedeki Wi-Fi’ya bağladığında, internete yönlendirici üzerinden ulaşırsın. Ama aynı ağa bağlı diğer cihazların senin verine doğrudan ulaşması genellikle mümkün değil.

Bir siteye bağlandığında, veri paketleri önce yerel ağda dolaşır, sonra internete gider. Bu paketler, IP, TCP ve HTTPS gibi farklı protokollerle taşınır. Hangi protokolün ne yaptığına girmeye gerek yok, ama burada kritik bir detay var: Aynı Wi-Fi’ya bağlanmak, herkesin herkesin verisini otomatikman görebileceği anlamına gelmiyor. Modern ağlarda istemci izolasyonu, şifreleme ve anahtarlama gibi yöntemler, başkalarının trafiğine direkt erişimi sınırlıyor.

Yani, saldırgan sadece “aynı ağa girince her şeyi görebilir” diye bir şey yok. Elbette ağın kötü yapılandırılması ya da özel saldırı teknikleri bazı kapıları aralayabilir, ama burası öyle her şeyin ortalığa döküldüğü bir ortam değil.

![](/blogs/img/wifi-vulns/ip_address.jpeg)

## 2. IP adresleri — ilk öğrenilebilen bilgiler

Yerel ağda her cihaza bir IP adresi verilir. Seninki mesela 192.168.1.25 olur, yönlendiricinin adresi de genellikle 192.168.1.1’dir. Saldırgan, ağda olup biteni izlerken senin bu IP’ni görme şansı olur. Yani, “şu cihaz bu adreste çalışıyor” diyebilir.

Ama gerçek hayatta, IP adresiyle bir insanın kim olduğunu doğrudan öğrenemezsin. Bunu gerçek bir kişiyle ilişkilendirmek için fazlasına ihtiyaç var. Ayrıca, bu adresler çoğunlukla sadece yerel ağ içinde anlamlıdır. Yani, korkulacak kadar kişiye özel bilgi çıkarılamaz.

![](/blogs/img/wifi-vulns/mac.jpeg)

## 3. MAC adresleri — yerelde cihazları eşleştirmek

Ağların bir de MAC adresi denen bir hikayesi var. Kısaca, her ağ cihazına fiziksel bir adres atanır. Yerel ağda, yine bu adresler tespit edilebilir. Ama internete çıkınca MAC adresin görünmez olur — dış dünyada kimse bunu göremez.

Ayrıca, çoğu modern telefon ve dizüstü, MAC adresini rastgeleleştirebilir. Yani her bağlandığında, farklı bir adresle görünür. Bu da takip edilmeni çok zorlaştırır.

![](/blogs/img/wifi-vulns/wireshark1.jpg)

## 4. Paket analizi — “Wireshark” ve gerçekler

Biraz teknik konuşalım. Wireshark gibi analiz araçlarıyla ağ trafiği incelenebilir. Ama bu araçlar, yakalanabilen trafiğe bakar — hepsi bu. Çoğu zaman, bilgisayarından yalnızca yerel ağa ait kendi trafiğini analiz edersin. Teknik olarak, ağdaki diğer herkesin trafiğine ulaşmak öyle kolay değil. Cihazlar, ağdaki yapı, erişim noktası ayarları… bunların hepsi yakalanabilecek bilgiyi etkiler.

![](/blogs/img/wifi-vulns/dns.png)

## 5. DNS sorguları: Hangi siteye bağlandığını görebilirler mi?

DNS, site adlarını alıp IP adresine çeviren sistem. DNS trafiği çoğu zaman şifrelenmez. Yani bir gözlemci, senin “example.com”a bağlandığını görebilir. Tabii DoH ya da DoT (DNS sorgularında şifreleme) kullanıyorsan, bunlardan korunursun.

Yine de, DNS’te “hangi sayfadasın, tam olarak ne yapıyorsun” bilinemez. Yalnızca “example.com’la bir iletişim var” tespit edilir.

![](/blogs/img/wifi-vulns/https.png)

## 6. HTTPS: Saldırgan mesajlarını okuyabilir mi?

Geldik can alıcı noktaya: HTTPS gerçekten korur mu? Evet! HTTPS sayesinde, bir banka sitesine, sosyal medyaya, e-postana girince mesajların, oturum bilgilerinin ya da formların içeriği şifrelenir. Aynı ağdaki saldırgan, bu içerikleri paket şeklinde görüp anlamlandıramaz. Bilginin içeriğine ulaşamaz.


Ama iletişimin üstverileri hâlâ dışarıdan görülebilir: Hangi IP’ye bağlandın, ne zaman başladın, ne kadar veri aktardın gibi. DNS’in şifrelenmemişse, gittiğin alan adı da görünebilir.

HTTPS ile içerik korunur ama tamamen görünmezliğin garantisi yok.

![](/blogs/img/wifi-vulns/arp_spoofing.png)

## 7. ARP Spoofing: Yerel ağda yolunu şaşırtmak

Yerel ağlarda ARP denilen bir teknoloji sayesinde cihazlar, “kim kimdir” bilgisini tespit eder. ARP spoofing’le saldırganlar, ağdaki cihazları şaşırtıp trafiği kendi üstünden geçirmeye çalışabilir. Yani, veri sana ulaşmadan önce saldırganın cihazına uğrar.

Ama bu her zaman mümkün değil. Ağ yapılandırması, kullanılan donanım ve yazılım, güvenlik seviyeleri, bunların hepsi bu saldırının işe yarayıp yaramayacağını belirler. Ayrıca, HTTPS kullandığın sürece saldırgan senin bilgilerini okuyamaz, çünkü hâlâ şifreli biçimde taşınıyorlar.

![](/blogs/img/wifi-vulns/mitm.png)

## 8. Man-in-the-middle: Arada bir “dinleyici”

MitM olarak bilinen saldırı türü, iki taraf arasına girip veri alışverişini izlemeye ya da değiştirmeye yarar. Ama bu saldırı modeli her zaman aynı şekilde işlemiyor. HTTP (şifresiz) kullanılıyorsa, saldırgan içerikleri değiştirebilir, okuyabilir. HTTPS’te ise, doğru sertifika doğrulaması varsa, bu saldırı içerideki metni ortaya çıkarmaz.

Yani pratikte, “aynı ağda herkesin trafiği tamamen izlenebilir” demek mantıklı değil.

![](/blogs/img/wifi-vulns/websites.jpeg)

## 9. Ziyaret ettiğin web sitelerini görebilirler mi?

Ne yazık ki kesin bir yanıt yok. Eğer DNS sorguları şifrelenmemişse veya IP adresi dışarıdan görünüyorsa, ziyaret edilen sitenin alan adını öğrenmek mümkün. Ama sayfa yolu (örnek: /account/settings), form içerikleri veya parolalar görülemez. Bazen trafik hacminden ya da zamanlamadan bazı tahminler yapılabilir ama bunlar yüzde yüz kesin olmaz.

![](/blogs/img/wifi-vulns/leak_infos.png)

## 10. HTTPS kullansan da açığa çıkan bilgiler neler?

Genel tablo şöyle: Hedef IP adresin, bağlantı zamanların ve trafiğin kabaca hacmi bir şekilde görünür durumda kalır. Şifrelenmemiş DNS varsa alan adların da açığa çıkar. Ama bunlarla saldırgan senin klavyeye yazdığın her şeyi, tam gezinme geçmişini ya da hesap şifreni öğrenemez.

Ama üstveri önemli. Hangi servise, ne zaman, ne sıklıkla bağlandığını görebilen biri, bunu başka bilgilerle birleştirip ciddi mahremiyet sıkıntısına yol açabilir.

![](/blogs/img/wifi-vulns/public_wifi.jpg)

## 11. Ortak Wi-Fi ağlarında asıl risk nerede?

Kafe, restoran gibi yerlerde kullanılan Wi-Fi ağlarında herkesin dikkatli olması şart, çünkü ağın sahibi kim, cihazlar nasıl korunuyor bilmiyorsun. Bazen saldırganlar sahte ağlar kurar, gerçekmiş gibi gösterip insanları tuzağa çekerler. Bir web sayfasında HTTPS hakkında sertifika uyarısı görüyorsan, büyük ihtimalle biri araya girmeye çalışıyordur — burada durmak lazım.

Bir başka risk de, fark etmeden HTTP (yani şifresiz) sitelere gitmek. Buralardaki tüm bilgiler havada, saldırgana hediye gibi gider.

Bazı kafeler, giriş ekranı olarak karşılama sayfalarına yönlendirme yapar (captive portal). Bunlar çoğu zaman güvenlidir, ama sosyal medya ya da e-posta parolası isteyen tuhaf giriş ekranları görürsen oradan uzaklaş.

Kısacası, gerçek risk tek başına başka birinin aynı ağa bağlı olması değil; ağda kullanılan güvenlik ayarları, uygulamalar, bağlantı şeklin ve senin alışkanlıkların tümüyle alakalı.

![](/blogs/img/wifi-vulns/wireshark.jpeg)

## 12. Wireshark ile trafiği incelemek

Ağ güvenliğini anlamanın en iyi yollarından biri, Wireshark gibi araçlarla kendi trafiğini analiz etmek. Elbette sadece kendi laboratuvarında veya yazılı izin alınmış ortamlarda! Wireshark’la hangi protokolün ne yaptığını, DNS trafiğinin nasıl göründüğünü, HTTPS’in kattığı farkları gözlemleyebilirsin.

![](/blogs/img/wifi-vulns/conclusion.png)

## Sonuç

Bütün bunları özetleyecek olursak: Aynı Wi-Fi ağına bağlanmak, saldırgana her istediğini vermez ama risk sıfır da değildir. HTTPS hayat kurtarır, ama sihirli bir pelerin de değildir. Bilgilerin ne kadarını paylaştığını ve ağın sana neler vadettiğini aklından çıkarma. Dikkatli olmak, bu işin anahtarı.