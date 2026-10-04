# Adli Bilişimde Dijital Delil Bütünlüğü Nasıl Sağlanır?

![adli1](/blogs/img/adli_delil_butunlugu/1.jpeg)

Bir siber saldırı, veri sızıntısı ya da dijital ortamda işlenen bir suç olduğunda, olayı ortaya çıkaran en önemli şeyler dijital delillerdir. Fakat dijital veriler yapısı gereği çok hassastır. Yanlışlıkla açılan bir dosya, takılan bir USB bellek ya da sisteme yapılan küçük bir müdahale bile delilin yapısını değiştirebilir. Mahkemelerde ya da resmi soruşturmalarda bir verinin “delil” sayılması için ilk günkü haliyle, hiç değişmeden korunmuş olması gerekir.

Peki, adli bilişim (digital forensics) uzmanları bu kırılgan verilerin bütünlüğünü mahkemede reddedilemeyecek düzeyde nasıl garanti altına alır? İşte dijital delil bütünlüğünü korumanın temel teknik adımları:

---

## 1. Yazma Engelleyiciler (Write Blockers)

![write-blocker](/blogs/img/adli_delil_butunlugu/2.jpeg)

Dijital bir depolama birimini, yani sabit disk, USB bellek veya SD kartı standart bir işletim sistemine bağladığınızda, siz hiçbir şey yapmasanız bile işletim sistemi arka planda diske veri yazar. Dosya erişim tarihleri (Last Accessed Time) güncellenir. Geçici dosyalar oluşur ve delilin orijinalliği hemen bozulur.

Bunu önlemek için Yazma Engelleyiciler (Write Blockers) kullanılır.

* **Donanımsal Yazma Engelleyiciler:** İnceleme yapılacak disk ile bilgisayar arasına fiziksel olarak bağlanan cihazlardır. Bilgisayardan diske giden tüm “yazma” (write) komutlarını fiziksel devrede keser. Sadece “okuma” (read) komutlarına izin verir.
* **Yazılımsal Yazma Engelleyiciler:** İşletim sistemi seviyesinde diske yazmayı engelleyen özel yazılım veya kayıt defteri (registry) ayarlarıdır. Ancak adli bilişim standartlarında donanımsal engelleyiciler her zaman en iyi seçenek olarak görülür.

---

## 2. Orijinal Delil Üzerinde Değil, “Adli Kopya” Üzerinde Çalışmak

![adli3](/blogs/img/adli_delil_butunlugu/3.jpeg)

Adli bilişim çalışmalarında, doğrudan orijinal delil üzerinde işlem yapmak yerine, delilin değişmesini veya zarar görmesini önlemek için öncelikle bir “adli kopya” alınır. Bu kopya, orijinal verinin birebir aynısıdır. Uzmanlar, analiz ve inceleme işlemlerini bu kopya üzerinde yürütür. Böylece orijinal delil bozulmaz ve mahkemede geçerliliğini korur.

Adli bilişimin en temel kuralı, orijinal delil üzerinde asla analiz yapmamaktır. Orijinal medya yalnızca bir kez sisteme bağlanır. Bu işlem sadece kopyasını çıkarmak içindir. Ancak bu kopya, bilgisayarda yaptığımız basit bir kopyala-yapıştır işlemi gibi değildir.

* **Bit-Stream (Birebir) Kopyalama:** Orijinal medyadaki her bir “0” ve “1”i, boş alanlar, silinmiş dosyalar ve gizli bölümler dahil olmak üzere hedef medyaya kopyalama işlemidir.
* **Adli İmaj Formatları:** Alınan bu birebir kopya, genellikle Raw (DD) veya E01 (EnCase Image Format) gibi özel adli bilişim formatlarında kaydedilir. Özellikle E01 formatı, kopyanın içine metadata, delil numarası, kopyayı alan uzman, tarih gibi bilgiler ve sıkıştırma algoritmaları ekler. Bu sayede bütünlüğü korur.

---

## 3. Kriptografik Özet (Hash) Değerleri ile Doğrulama

![hash](/blogs/img/adli_delil_butunlugu/4.jpg)

Kriptografik özet (hash) değerleri, bir verinin küçük ve sabit uzunlukta bir temsilini oluşturmak için kullanılır. Orijinal veri ne kadar büyük olursa olsun, özet değeri her zaman aynı uzunluktadır. Bu değerler, verinin bütünlüğünü korumak için kullanılır. Bir dosya veya mesaj değiştiğinde, hash değeri de değişir. Bu yüzden, bir verinin değişip değişmediğini anlamak için hash değerleri karşılaştırılır.

Doğrulama işlemlerinde, genellikle SHA-256 veya SHA-512 gibi güvenli hash algoritmaları kullanılır. Bu algoritmalar, farklı girişler için benzersiz hashler üretir. Aynı veriye tekrar hash işlemi uygulandığında, her seferinde aynı sonuç elde edilir. Fakat, en küçük bir değişiklik bile farklı bir hash değeri oluşturur. Bu özellik, verinin değiştirilip değiştirilmediğini anlamada önemli bir avantaj sağlar.

Hash değerleri, dijital imzalar ve parola saklama gibi birçok güvenlik uygulamasında da yer alır. Özellikle, dosya bütünlüğünü doğrulamak için hash değerlerinden yararlanılır.

1 terabaytlık bir diskte, sadece tek bir metin belgesinin içindeki tek bir harf bile değişirse, diskin hash değeri tamamen değişir. Bu matematiksel kesinlik, mahkemelerde delilin değiştirilmediğinin en büyük kanıtıdır.

---

## 4. Mobil Deliller İçin Faraday Kafesi (Faraday Bags)

![faraday-bag](/blogs/img/adli_delil_butunlugu/5.jpg)

Akıllı telefonlar, tabletler veya akıllı saatler gibi internete bağlanabilen cihazlar ele geçirildiğinde, dışarıdan gelebilecek uzaktan silme komutlarına karşı büyük bir risk taşır. Şüpheli, bulut hesabı üzerinden cihazdaki tüm verileri saniyeler içinde silebilir.

Bu durumu önlemek için cihazlar ele geçirilir alınmaz Faraday Çantalarına konur. Bu çantalar, elektromanyetik sinyalleri engelleyen özel metal ağlardan yapılır. Cihazın Wi-Fi, Bluetooth, Hücresel Veri ve GPS ile bağlantısı tamamen kesilir. Böylece delilin uzaktan değiştirilmesi veya yok edilmesi mümkün olmaz.

---

## 5. Delil Zinciri (Chain of Custody)

![coc](/blogs/img/adli_delil_butunlugu/6.png)

Teknik önlemler ne kadar güçlü olursa olsun, delilin kimin elinden kime geçtiği kaydedilmezse bütünlük hukuken bozulabilir. Gözetim Zinciri, delilin olay yerinde ilk bulunduğu andan mahkemeye sunulduğu ana kadar geçen süredeki tüm fiziksel ve dijital yaşam döngüsünü belgelemektir.

* Delili kim buldu?
* İmajı hangi uzman, ne zaman ve hangi yazılımla aldı?
* Orijinal delil fiziki olarak nerede, hangi kilitli kasada saklanıyor?
* Delili inceleyen analist kimdi, analizi ne zaman bitirdi?

Bu soruların her biri için ıslak imzalı ya da dijital olarak doğrulanmış log kayıtları tutulması, delilin değiştirilmediğini gösteren idari ve hukuki bütünlüğü sağlar.

Dijital dünyada sıfırlar ve birler çok kolay değiştirilebilir gibi görünse de, adli bilişim yöntemlerinin uygulandığı bir ortamda verinin bütünlüğünü bozmak ve bunu gizli tutmak matematiksel olarak neredeyse imkansızdır. Doğru donanım, kriptografik doğrulama ve sıkı kayıt işlemleri bir araya geldiğinde dijital deliller en güvenilir tanıklara dönüşür.