# Akıllı Süpürgeniz Hacklenebilir mi?

![kapak](/blogs/img/Akilli-Supurge-Hack/kapak-supurge.svg)

## Giriş

Evdeki akıllı süpürge, aslında sandığımızdan çok daha "akıllı" bir cihaz. İçinde küçük bir bilgisayar var, çoğu modelde kamera ve mikrofon bulunuyor, hatta evinizin haritasını bile çıkarıyor. Peki bu cihaz gerçekten güvenli mi? Yoksa biri, siz farkında bile olmadan onu ele geçirip evinizi izleyebilir mi?

2024 yılında güvenlik araştırmacıları, tam olarak bunu yapmayı başardı. Bu yazıda, "hacklemek" derken teknik olarak ne olduğunu, hiç bilmeyen birinin bile anlayabileceği şekilde anlatmaya çalışacağım.

## Süpürge Eve İlk Geldiğinde Ne Oluyor?

Kutudan çıkan yeni bir akıllı süpürgeyi kullanmaya başlamak için önce onu evinizin Wi-Fi'sine bağlamanız gerekiyor. Bu işlem genelde şöyle olur:

1. Süpürgeyi açarsınız, telefonunuzdaki uygulama onu **Bluetooth üzerinden** bulur.
2. Uygulama üzerinden "evin Wi-Fi şifresi şu" diye süpürgeye bilgi gönderirsiniz.
3. Süpürge artık internete bağlanır ve siz onu telefonunuzdan her yerden kontrol edebilirsiniz.

Bluetooth burada bir nevi "ilk tanışma" aracı. Sorun da tam olarak bu tanışma anında ortaya çıkıyor.

## Sorun 1: Herkeste Aynı Anahtar Kullanılması

![anahtar](/blogs/img/Akilli-Supurge-Hack/ayni-anahtar-problemi.svg)

Bunu şöyle düşünün: bir apartmandaki bütün dairelerin kapı kilidi, aynı anahtarla açılıyor olsa nasıl olurdu? Bir dairenin anahtarını ele geçiren biri, aslında bütün binaya girebilirdi.

Araştırmacılar, bazı akıllı süpürge markalarının tam olarak bunu yaptığını keşfetti: cihazla telefon arasındaki "gizli" iletişimi korumak için **her cihazda aynı olan tek bir ortak anahtar** kullanılıyordu. Bu anahtarı bir kere çözen biri, artık dünyadaki o markanın **her bir cihazıyla** konuşabiliyordu — sizinkiyle de.

## Sorun 2: Şifre Kontrolü Yanlış Yerde Yapılıyor

Bazı süpürgelerde, kamera görüntüsünü izlemek için bir şifre (PIN) girmeniz isteniyor — güzel, güvenli görünüyor değil mi? Ama araştırmacılar şunu fark etti: bu şifre kontrolü, süpürgenin kendisinde değil, **telefonunuzdaki uygulamada** yapılıyordu.

Bunu bir güvenlik kontrolüne benzetelim: bir binaya girerken güvenlik görevlisi sizi durdurup kimlik sormak yerine, size güvenip "tamam girebilirsin" demenizi bekliyor gibi düşünün. Uygulamayı değiştirip o kontrolü atlayan biri, şifreyi hiç bilmeden içeri girebiliyordu.

## Sorun 3: Saldırgan Kapınızdan Girmesine Bile Gerek Duymuyor

![baglanti](/blogs/img/Akilli-Supurge-Hack/sokaktan-baglanti.svg)

Belki "ama saldırganın evime girmesi lazım" diye düşünüyorsunuzdur. Hayır. Bluetooth sinyali duvarlardan geçip evin dışına, hatta sokağa kadar ulaşabiliyor. Araştırmacılar, özel bir cihazla **yaklaşık 130 metre uzaktan** (yani sokaktan, komşu bahçesinden, hatta park edilmiş bir arabadan) süpürgeye bağlanıp onu tamamen ele geçirebildiklerini gösterdi.

Bir kere bağlandıktan sonra, süpürge zaten internete bağlı olduğu için saldırgan artık dünyanın herhangi bir yerinden ona erişebiliyordu — sokakta durmasına bile gerek kalmadan.

## Bu Gerçekten Yaşandı mı?

Evet. 2024'te DEF CON adlı büyük bir güvenlik konferansında, Dennis Giese ve Braelynn Luedtke adlı iki araştırmacı bu zafiyetleri Ecovacs marka süpürgelerde gösterdi. Ele geçirdikleri cihazlardan:

- Kamera görüntüsünü ve mikrofonu, **hiçbir uyarı ışığı yanmadan** izleyebildiler,
- Evin Wi-Fi şifresini okuyabildiler,
- Evin haritasını (oda planlarını) görebildiler.

Araştırmacılar bulguları üreticiye Aralık 2023'te bildirmiş ama uzun süre yanıt alamamışlar. Sunum sonrası, ABD'de gerçek kullanıcılar da mağdur oldu: Minnesota'da bir kullanıcının süpürgesi kendiliğinden hareket etmeye ve tuhaf sesler çıkarmaya başladı — meğer biri cihazı gerçekten ele geçirmiş.

## Peki Ne Yapmalı?

Hem üreticilere hem de bizlere düşen görevler var:

**Üreticiler şunları yapmalı:**
- Her cihaza kendine özel, farklı bir "anahtar" vermeli (hepsinde aynısını kullanmamalı).
- Şifre kontrolünü telefon uygulamasına değil, cihazın/sunucunun kendisine yaptırmalı.
- Kamera/mikrofon her açıldığında, bağlantı yöntemi ne olursa olsun bir ışık yanmalı.

**Biz kullanıcılar olarak yapabileceklerimiz:**
- Cihazın yazılımını (firmware) güncel tutmak.
- Akıllı ev cihazlarını, telefon/bilgisayarınızın bağlı olduğu ana Wi-Fi'den ayrı bir ağda (misafir ağı gibi) çalıştırmak.
- Kameraya/mikrofona ihtiyacınız yoksa uygulamadan kapatmak.
- Üreticinin güvenlik duyurularını zaman zaman kontrol etmek.

## Sonuç

Akıllı süpürge örneği bize şunu gösteriyor: bir cihazın "bağlanabiliyor olması", onun "güvenli bağlanıyor olması" anlamına gelmiyor. Kulağa küçük gelen tasarım hataları (herkeste aynı anahtar, yanlış yerde yapılan şifre kontrolü gibi) bir araya gelince, evinizin en mahrem köşelerine kadar erişim sağlayabiliyor. Bu yüzden hem üreticilerin işini daha sıkı tutması hem de bizim biraz daha dikkatli olmamız gerekiyor.

## Kaynaklar
- Dennis Giese & Braelynn Luedtke, "Reverse Engineering and Hacking Ecovacs Robots", DEF CON 32 (2024)
- CVE-2024-12078 — cvedetails.com
- Kaspersky Daily, "How vulnerable Ecovacs robot vacuums are being hacked" (2025)
- TechCrunch, "Ecovacs home robots can be hacked to spy on their owners, researchers say" (2024)
