# QR Kodun Arkasında Ne Var? Quishing Saldırıları Nasıl Çalışır?

![QR kodun sahte giriş sayfasına yönlendirdiği quishing saldırı akışı](/blogs/img/qr-kodlar-ve-quishing/quishing-flow.svg)

Bir restoranda menüyü açmak, otopark ücretini ödemek veya Wi-Fi ağına bağlanmak için QR kod taratıyoruz. Kareli görüntüyü görünce genelde sorgulamadan kamerayı açıyoruz; çünkü QR kodun kendisi bize ne güvenli ne de tehlikeli görünüyor. Zaten asıl problem de bu: **arkasında ne olduğunu gözümüzle okuyamıyoruz.**

Saldırganlar bu alışkanlığı phishing ile birleştirdiğinde ortaya **quishing** çıkıyor. İsim, “QR” ve “phishing” kelimelerinin birleşiminden geliyor. Ama saldırının mantığı yeni değil: kullanıcıyı sahte bir sayfaya götür, gerçek bir işlem yaptığına inandır ve parola ya da kart bilgisi gibi verileri kendi eliyle girmesini sağla.

Bu yazıda QR kodun gerçekte ne taşıdığını, quishing saldırısının adım adım nasıl işlediğini, neden klasik phishing'den daha ikna edici olabildiğini ve bir kodu taramadan önce hangi kontrolleri yapabileceğini anlatacağım.

---

## QR kod aslında nedir?

QR kod, metni makinenin hızlı okuyabileceği iki boyutlu bir barkoda dönüştürür. İçinde şunlardan biri bulunabilir:

- Bir web adresi
- Düz metin
- Telefon numarası
- E-posta adresi
- Wi-Fi ağ adı ve parolası
- Konum veya iletişim bilgisi

Yani QR kod kendi başına sihirli bir işlem yapmaz. Telefonun kamerası kareleri çözer, içindeki veriyi okur ve sana bir eylem önerir. Veri bir URL ise tarayıcıyı açmak, telefon numarasıysa aramak, Wi-Fi bilgisi ise ağa katılmak gibi.

Basit bir örnek düşünelim. QR kodun içinde yalnızca şu adres olsun:

```text
https://ornek.com/menu
```

Kamera bunu okuduğunda ekranda bağlantıyı gösterir. Sorun şu ki aşağıdaki kötü niyetli adres de dışarıdan bakıldığında aynı siyah-beyaz karelerden oluşur:

```text
https://ornek-giris.example/login
```

İnsan gözü iki kod arasındaki farkı anlayamaz. Güven kararı, kodun görüntüsüne değil **çözüldükten sonra gösterilen hedefe** göre verilmelidir.

## Quishing nasıl çalışır?

Quishing tek bir teknikten çok, QR kodun bağlantıyı gizleme özelliğini kullanan bir sosyal mühendislik akışıdır.

### 1. İnandırıcı bir bahane hazırlanır

Saldırgan önce kullanıcıyı kodu taramaya ikna edecek bir hikâye kurar:

- “Hesabınızın oturumu sona erdi, tekrar doğrulayın.”
- “Kargonuz teslim edilemedi, adresi güncelleyin.”
- “Otopark ödemenizi tamamlamak için tarayın.”
- “Bu belgeyi mobil cihazınızdan görüntüleyin.”
- “MFA kaydınızı yenilemeniz gerekiyor.”

Hikâyenin ortak noktası aciliyettir. Kullanıcının bağlantıyı incelemeden hızlıca hareket etmesi istenir.

### 2. QR kod güvenilir bir yere yerleştirilir

Kod bir e-postanın gövdesine, PDF dosyasına, afişe, masa üzerindeki menüye veya otopark sayacına yapıştırılabilir. Fiziksel saldırıda gerçek QR kodun üstüne saldırganın hazırladığı başka bir etiket yapıştırması bile yeterlidir.

[FTC'nin QR kod dolandırıcılığı uyarısı](https://consumer.ftc.gov/consumer-alerts/2023/12/scammers-hide-harmful-links-qr-codes-steal-your-information), saldırganların otopark sayaçlarındaki kodların üstünü kendi kodlarıyla kapatabildiğini ve e-posta ya da mesaj üzerinden acil işlem bahanesiyle kod gönderebildiğini anlatıyor.

### 3. Kod sahte siteye yönlendirir

Kullanıcı kodu taradığında banka, Microsoft 365, kargo şirketi veya otopark ödeme sayfasına benzeyen bir site açılır. Logo, renkler ve form tasarımı kopyalandığı için sayfa ilk bakışta gerçek görünebilir.

Alan adı ise genellikle küçük bir farklılık taşır:

```text
Gerçek: https://login.example.com
Sahte:  https://login-example.com
```

Bazen QR kod önce bir URL kısaltma veya yönlendirme servisine gider. Bu da kameranın önizlemesinde son hedefi görmeyi zorlaştırır.

### 4. Kullanıcı bilgiyi kendisi teslim eder

Sahte forma girilen kullanıcı adı, parola, kart bilgisi veya tek kullanımlık doğrulama kodu saldırgana gönderilir. Ardından kurban şüphelenmesin diye gerçek siteye yönlendirilebilir ve yalnızca “Bir hata oluştu” mesajı görebilir.

Burada önemli ayrım şu: **QR kodu taramak tek başına parolanı saldırgana vermez.** Asıl zarar çoğu senaryoda açılan sayfaya bilgi girmek, ödeme yapmak, dosya indirmek veya bir uygulama/profil kurmakla oluşur. Bu ayrımı bilmek, yanlışlıkla kod tarandığında panik yerine doğru adımı atmayı sağlar.

## Neden normal phishing bağlantısından daha etkili olabilir?

### Hedef bağlantı başta görünmez

E-postadaki klasik bir bağlantının üstüne fareyle geldiğinde hedef adresi görebilirsin. QR kodda ise bağlantı bir görüntünün içine gömülüdür. Kod çözülmeden alan adını değerlendiremezsin.

### Kontrol bilgisayardan telefona geçer

İş bilgisayarına gelen e-postadaki QR kod genellikle telefonla taranır. Böylece kullanıcı, kurumsal cihazdaki bazı e-posta ve web güvenliği kontrollerinden farklı bir ortama geçer. Küçük ekranda tam alan adını görmek de daha zordur.

[Microsoft'un phishing eğilimleri dokümanı](https://learn.microsoft.com/en-us/defender-endpoint/malware/phishing-trends), quishing saldırılarında QR kodun e-posta gövdesine, görsele, PDF'e veya Word belgesine yerleştirilerek kullanıcıyı kimlik bilgisi toplayan bir siteye götürebildiğini belirtiyor.

### Fiziksel ortam güven hissi verir

Bir otopark cihazı, restoran masası veya resmi görünümlü afiş üzerinde duran kodun güvenilir olduğunu varsaymak kolaydır. Oysa saldırgan için bazen gereken tek şey, mevcut kodun üzerine yeni bir etiket yapıştırmaktır.

### QR kod “teknolojik” göründüğü için sorgulanmaz

Kullanıcılar yazım hatalı bir bağlantıdan şüphelenebilir ama QR kodda okunacak bir kelime yoktur. Teknoloji burada güvenlik kanıtı değil, sadece verinin farklı gösterimidir.

## Sık görülen quishing senaryoları

### Sahte hesap doğrulama

E-postada hesabın kapanacağı söylenir ve “telefonla doğrulama” için QR kod sunulur. Açılan sayfa kurumsal giriş ekranını taklit eder. Amaç kullanıcı adı, parola ve mümkünse MFA kodunu almaktır.

### Otopark ve ödeme etiketi

Gerçek ödeme kodunun üzerine sahte QR etiketi yapıştırılır. Kullanıcı araç plakasını ve kart bilgilerini saldırganın sayfasına girer. Sayfa gerçek ödeme sistemine benzediği için hata ancak ödeme sonrasında fark edilebilir.

### Teslim edilemeyen kargo

Kullanıcıya küçük bir “yeniden teslimat ücreti” ödemesi gerektiği söylenir. Düşük tutar, şüpheyi azaltmak için kullanılır; asıl hedef kart bilgileridir.

### Beklenmeyen paket içindeki kod

Göndericisi belli olmayan bir paketin içinden “Kim gönderdiğini öğrenmek için tara” notu çıkabilir. [FTC, beklenmeyen paketlerdeki QR kodlar hakkında](https://consumer.ftc.gov/consumer-alerts/2025/01/scam-alert-qr-code-unexpected-package) bu yöntemin kullanıcıları kişisel bilgi toplayan phishing sitelerine götürebileceği konusunda uyarıyor.

## Bir QR kodu taramadan önce neye bakmalıyız?

### 1. Önce bağlamı sorgula

Bu kodu taramanı kim istiyor? Böyle bir işlem bekliyor muydun? Hesap kapatma, ceza, son ödeme veya kargo sorunu gibi acil bir iddia varsa mesajdaki yöntemi kullanmak yerine kurumun uygulamasını ya da bildiğin resmî adresini kendin aç.

### 2. Fiziksel etiketi kontrol et

Kod başka bir etiketin üzerine yapıştırılmış mı? Kenarlarında kabarma, farklı baskı kalitesi veya sökülmüş etiket izi var mı? Özellikle ödeme cihazlarında bu küçük fiziksel işaretler önemlidir.

### 3. Kameranın URL önizlemesini oku

Telefon bağlantıyı açmadan önce hedefi gösteriyorsa birkaç saniye ayırıp alan adına bak:

- Marka adı doğru yazılmış mı?
- Alan adı beklediğin kurumun gerçek alan adı mı?
- Garip tireler, ek kelimeler veya anlamsız karakterler var mı?
- Bağlantı kısaltılmışsa neden doğrudan resmî adrese gitmiyor?

`https` ve kilit simgesi tek başına güven kanıtı değildir. Bunlar yalnızca telefon ile açılan site arasındaki bağlantının şifreli olduğunu gösterir; sitenin dürüst olduğunu göstermez.

### 4. QR üzerinden giriş ve ödeme yapma konusunda daha katı ol

Menü açmak ile banka parolası girmek aynı riskte değildir. Kod senden parola, kart bilgisi, kimlik bilgisi veya MFA kodu istiyorsa işlemi durdur. İlgili uygulamayı kendin aç veya adresi tarayıcıya kendin yaz.

### 5. MFA kullan ama sınırını bil

MFA, çalınan parolanın tek başına kullanılmasını zorlaştırır. Ancak saldırgan sahte sayfada anlık doğrulama kodunu da isteyebilir. Mümkün olduğunda sahte siteye bağlı olmayan **passkey/FIDO2 gibi phishing'e dayanıklı yöntemler** daha güçlü koruma sağlar.

## Kodu taradıysan ne yapmalısın?

Yalnızca kodu tarayıp sayfayı açtıysan, herhangi bir bilgi girmediysen ve dosya ya da uygulama yüklemediysen çoğu durumda sayfayı kapatmak yeterlidir. Tarayıcı geçmişindeki adresi güvenlik ekibine veya ilgili kuruma bildirmen de başkalarının etkilenmesini önleyebilir.

Bilgi girdiysen hızlı davran:

1. Parolanı, QR koddan değil kurumun bildiğin resmî uygulaması veya adresi üzerinden değiştir.
2. Aynı parolayı kullandığın diğer hesapları da değiştir.
3. Açık oturumları kapat ve MFA'yı etkinleştir.
4. Kart bilgisi verdiysen bankanla iletişime geç ve hareketleri kontrol et.
5. Bir uygulama, sertifika veya yönetim profili kurduysan cihazı ağdan ayırıp güvenilir bir destek kanalından incelet.
6. İş hesabı söz konusuysa güvenlik ekibine olayı saklamadan bildir; erken bildirim hasarı ciddi biçimde azaltabilir.

## Sonuç

QR kod güvenli ya da zararlı değildir; yalnızca veriyi insan gözünden gizleyen bir taşıyıcıdır. Quishing'i etkili yapan şey özel bir exploit değil, kullanıcının kareli görüntüyü güven işareti sanması ve hedef bağlantıyı kontrol etmeden telefona geçmesidir.

Bir kodu tararken asıl soru “QR kod gerçek görünüyor mu?” değil, **“Bu işlem neden QR kodla başlatılıyor ve beni hangi alan adına götürüyor?”** olmalıdır. Özellikle parola, ödeme veya kimlik bilgisi isteniyorsa en güvenli hareket kodu kullanmamak, kurumun uygulamasını ya da resmî sitesini kendin açmaktır.

Kısacası QR kodu, görünmeyen bir bağlantı gibi düşün. Normalde tıklamayacağın bir linki, karelere dönüştüğü için de tarama.

---

**Kaynaklar / ileri okuma:**

- [FTC — Scammers hide harmful links in QR codes to steal your information](https://consumer.ftc.gov/consumer-alerts/2023/12/scammers-hide-harmful-links-qr-codes-steal-your-information)
- [FTC — Scam alert: QR code on an unexpected package](https://consumer.ftc.gov/consumer-alerts/2025/01/scam-alert-qr-code-unexpected-package)
- [Microsoft Learn — Phishing trends and techniques](https://learn.microsoft.com/en-us/defender-endpoint/malware/phishing-trends)
- [Microsoft Security — How Defender for Office 365 addresses QR code phishing](https://www.microsoft.com/en-us/security/blog/2024/11/04/how-microsoft-defender-for-office-365-innovated-to-address-qr-code-phishing-attacks/)
