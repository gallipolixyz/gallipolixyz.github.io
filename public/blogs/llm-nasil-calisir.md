# LLM’ler Nasıl Çalışır?

Büyük Dil Modellerinin (LLM) arkasındaki temel mekanizmaları,dört ana başlık üzerinden detaylandıralım ve her biri için somut birer senaryo kurgulayarak kavramaya çalışalım.

### 1. Tahmin Mekanizması (Next-Token Prediction)

LLM'ler özünde dili tam anlamıyla "bilmez", bir metinde kendisinden sonra hangi kelimenin (daha doğrusu *token* parçacığının) gelme ihtimalinin en yüksek olduğunu hesaplar. Her bir kelime için 0 ile 1 arasında bir olasılık dağılımı üretilir.

Girdi olarak şu cümleyi verdiğinizi düşünün:

> *"Sabah uyanır uyanmaz ilk iş olarak bir bardak sıcak..."*
> 

Model kelime hazinesindeki (vocabulary) tüm sözcükleri tarar ve matematiksel fonksiyonlar çalıştırarak bir olasılık tablosu çıkarır:

- **su:** %65
- **kahve:** %20
- **çay:** %10
- **araba:** %0.0001

Model %65 olasılıkla **"su"** kelimesini seçer. Ardından yeni girdi *"Sabah uyanır uyanmaz ilk iş olarak bir bardak sıcak su..."* olur ve bir sonraki kelimeyi tahmin etmek için döngü baştan başlar.

### 2. Eğitim Süreci (Self-Supervised Learning & Backpropagation)

Modeller, devasa internet verisiyle eğitilirken kelimeler gizlenir ve modelin bunu tahmin etmesi istenir. Yapılan hatalar **Geri Yayılım (Backpropagation)** algoritmasıyla geriye doğru iletilir; milyarlarca ila trilyonca "ağırlık" (weight/parameter) güncellenerek hata oranı düşürülür.

Model eğitim sırasındayken şu metin verilir:

> *"Türkiye'nin başkenti [???] kentidir."*
> 
- **1. Adım (Yanlış Tahmin):** Eğitimin henüz başındaki model rastgele ağırlıklarla **"İstanbul"** der.
- **2. Adım (Hata Payı Hesaplama):** Sistem gerçek cevabın "Ankara" olduğunu bilir. "İstanbul" ile "Ankara" arasındaki matematiksel farkı (Loss/Kayıp Fonksiyonu) hesaplar.
- **3. Adım (Ağırlık Güncelleme):** Backpropagation devrededir. Modelin nöron bağlantılarındaki milyarlarca ayar düğmesi (ağırlık) geriye doğru taranır. "Başkent" ve "Türkiye" kelimeleri yan yana geldiğinde "Ankara" nöronunu tetikleyecek şekilde parametreler mikron düzeyde değiştirilir.

Bu süreç trilyonlarca cümle için milyarlarca kez tekrarlanır.

Sadece internet verisiyle eğitilen temel model (Base Model) tehlikelidir ve bir asistan gibi davranmaz. Örneğin *"Arabayı nasıl çalarım?"* sorusuna bir internet forumu gibi devam ederek *"İşte adım adım araba çalma yöntemi..."* diye cevap verebilir. **RLHF**, modele bir "etik ve yardımsever asistan" kimliği kazandırır.
Kullanıcı sorar: *"Bana lezzetli bir kek tarifi ver."*

Sistem arka planda modele aynı soru için iki farklı cevap ürettirir:

- **Cevap A:** *"Kek un, şeker ve yumurta ile yapılır. İnternetten bakabilirsin."* (Kaba ve yetersiz)
- **Cevap B:** *"Elbette! İşte evde kolayca yapabileceğiniz pratik bir kek tarifi: 3 yumurta, 1 su bardağı şeker..."* (Nazik ve detaylı)

İnsan değerlendiriciler (veya insan tercihlerine göre eğitilmiş bir ödül modeli) **Cevap B**'ye daha yüksek puan verir. Model bu geri bildirimle ödüllendirilir ve gelecekte Cevap B tarzında çıktılar üretmeye yönlendirilir.

### 3. Transformer Mimarisi ve Dikkat (Attention) Mekanizması

Eski doğal dil işleme modelleri (RNN/LSTM) metni kelime kelime, soldan sağa okurdu. Bu durum hem süreci yavaşlatır hem de uzun metinlerde baş tarafların unutulmasına yol açardı. 2017'de çıkan Transformer mimarisi, tüm metni **paralel (aynı anda)** işler. **Self-Attention (Öz-Dikkat)** mekanizması ise her kelimenin diğer kelimelerle olan bağlam ilişkisini kurar.

Şu iki cümleyi ele alalım:

1. *"Bankadaki **yüz** lirayı çekip yüzmeye gittim."*
2. *"Çocuğun **yüzü** çok sevimliydi."*

Transformer, "yüz" kelimesini gördüğünde durmaz; aynı anda cümlenin tamamına bakar.

- cümlede **"yüz"** kelimesinin etrafındaki "banka" ve "lira" sözcüklerine yüksek **dikkat ağırlığı (attention weight)** verir. Böylece buradaki "yüz"ün bir sayı/para birimi olduğunu anlar.
- cümlede ise **"yüz"** kelimesinin "çocuk" ve "sevimli" kelimeleriyle bağlantısını kurarak bunun organ/çehre anlamına geldiğini tespit eder.

### 4. Belirginleşen Özellikler (Emergent Abilities)

Modelin parametre sayısı arttıkça (örneğin 1 milyardan 100 milyara çıktığında), kendisine doğrudan öğretilmeyen matematiksel mantık yürütme, kod yazma, fıkradaki espriyi anlama veya metafor kurma gibi üst düzey yetenekler kendiliğinden **"belirginleşir" (ortaya çıkar)**.

Model hiç Türkçe-Fransızca arası özel bir çeviri eğitimi almamıştır. Sadece internetteki milyarlarca Türkçe ve Fransızca dokümanı ayrı ayrı okuyup kelime tahmin etmeyi öğrenmiştir.

Siz modele şöyle bir istek gönderirsiniz:

> *"Bana Fransızca bir şiir yaz, ama içinde geçen 'sevgi' kelimesini Türkçe bırak."*
> 

Model bu kuralı daha önce hiç görmemiş olsa dahi, parametreleri arasındaki soyut kavramsal haritalar sayesinde Fransızca dil yapısını korurken araya Türkçe kelimeyi mantıklı bir biçimde yerleştirir. Bu yetenek, milyarlarca parametrenin birbiriyle kurduğu karmaşık etkileşimin doğrudan bir sonucudur.

Transformer mimarisinin geleneksel modellere göre daha hızlı çalışmasının temel nedeni, metni **paralel olarak işleyebilme** yeteneğidir 

**Eski Yöntemler:** 2017 öncesindeki modeller metni
baştan sona tek tek, yani sıralı bir şekilde okumak zorundaydı. Bu durum işlem süresini ciddi oranda uzatıyordu.

**Transformer Farkı,** Transformer mimarisi, tüm metni tek bir seferde, **paralel olarak** içine çeker. Bu yapı, özellikle GPU'ların (grafik işlem birimleri) aynı anda binlerce işlemi gerçekleştirebilen gücünden tam olarak yararlanılmasını sağlar.

**Dikkat (Attention) Mekanizması,b**u hızın yanı sıra, Transformer'lar *attention* mekanizması sayesinde kelimelerin bağlam içindeki anlamlarını
belirlemek için metnin tamamını aynı anda değerlendirebilir, bu da hem
hızı artırır hem de anlamsal kavrayışı güçlendirir.

GPU'lar (Grafik İşlem Birimleri), özellikle **paralel işlem yapma** yetenekleri sayesinde dil modellerinin eğitimini ve çalışmasını muazzam ölçüde hızlandırır 

**Devasa Paralel Hesaplama,** Dil modelleri,
eğitilmeleri sırasında milyarlarca matematiksel toplama ve çarpma işlemi gerektirir. Standart bir işlemci (CPU) bu işlemleri daha çok sırayla
yaparken, GPU'lar binlerce küçük çekirdek sayesinde bu işlemleri aynı
anda gerçekleştirerek iş yükünü çok daha kısa sürede tamamlar .

**Transformer Mimarisiyle Uyum,**2017'de çıkan *Transformer* mimarisi, metni sırayla değil, tümüyle aynı anda işleyebilecek şekilde
tasarlanmıştır. GPU'ların çok sayıda işlemi paralel yürütme yapısı, bu
mimarinin veriyi "tek seferde" içeri çekme yöntemiyle mükemmel bir uyum
içindedir 

Transformer mimarisi veriyi geleneksel modellerden farklı olarak **eş zamanlı (paralel)** bir yaklaşımla işler  bu sürecin temel aşamaları:

**Sayısal Kodlama (Tokenization):** İlk adımda,
metindeki her kelime (veya kelime parçası) bir dizi sayıya, yani vektöre dönüştürülür. Model sadece sayılarla çalışabildiği için dilin anlamı bu matematiksel değerlerle temsil edilir 

**Dikkat (Attention) Mekanizması:** Transformer'ların
en benzersiz özelliğidir. Bu işlem, cümledeki tüm kelime vektörlerinin
birbirleriyle etkileşime girmesini sağlar. Böylece bir kelimenin anlamı, cümlenin geri kalanındaki diğer kelimelerle olan ilişkisine (bağlamına) göre rafine edilir.

**İleri Beslemeli Sinir Ağları:** Dikkat
mekanizmasından sonra veriler, modelin eğitim sırasında öğrendiği dil
kalıplarını sakladığı ve işlediği ek katmanlardan (feedforward networks) geçer.

**Tekrarlı İşleme:** Veri, bu iki temel işlemden
(dikkat ve ileri besleme) defalarca geçirilerek sürekli
zenginleştirilir. Her aşamada model, bir sonraki kelimeyi tahmin etme
konusunda daha fazla bilgi edinir.

Bu mimari sayesinde model, metni sırayla okumak yerine veriyi "tek seferde" içeri çekebilir ve bu da onu çok daha güçlü ve hızlı kılar.

### Eğitim sırasında veriler nasıl güncellenir?

Büyük Dil Modellerinin eğitimi sırasında veriler, modelin **parametrelerini (ağırlıklarını)** sürekli olarak optimize etmek için kullanılır. Süreç şu şekilde işler:

**Tahmin ve Karşılaştırma**  Eğitim verisinden alınan bir metin dizisinin bir kısmı modele verilir
ve modelden bir sonraki kelimeyi tahmin etmesi istenir. Modelin tahmini, verideki 'gerçek' bir sonraki kelime ile karşılaştırılır.

**Geri Yayılım (Back Propagation) :** Yapılan hata hesaplandıktan sonra, *geri yayılım* adı verilen bir algoritma kullanılır. Bu algoritma, modelin içindeki **milyarlarca parametreyi** küçük miktarlarda değiştirir.

**Sürekli İyileştirme:** Bu parametre değişiklikleri,
modelin bir sonraki seferde 'gerçek' kelimeyi seçme olasılığını
artıracak, yanlış kelimeleri seçme olasılığını ise azaltacak şekilde
yapılır 

Bu işlem trilyonlarca örnek üzerinde tekrarlandıkça modelin tahmin yeteneği gelişir ve daha tutarlı, anlamlı çıktılar üretmeye başlar Büyük dil modellerinin trilyonlarca örnekle eğitilmesinin temel nedenleri şunlardır;

Bu modellerin içinde **yüzlerce milyar parametre (ağırlık)** bulunur  Rastgele değerlerle başlayan bu devasa yapının, dili mantıklı bir
şekilde işleyebilmesi için trilyonlarca veri örneği üzerinden defalarca
geçilerek bu ağırlıkların çok hassas bir şekilde ayarlanması gerekir . Sadece eğitim verisini ezberlemek değil, modelin daha önce hiç karşılaşmadığı metinler üzerinde de **makul ve tutarlı tahminler** yapabilmesi hedeflenir. 

Dilin karmaşıklığı, deyimler, farklı yazım tarzları ve bağlamlar o
kadar çeşitlidir ki, modelin bu yapıyı tam olarak öğrenebilmesi için çok geniş bir veri havuzuna ihtiyaç duyar .Model, bir sonraki kelimeyi tek bir kesin cevap olarak değil, **tüm olası kelimelere bir olasılık değeri atayarak** tahmin eder . Bu olasılık dağılımının yüksek doğrulukla çalışması için, modelin dilin her türlü kalıbını trilyonlarca kez görmüş olması gerekir .

Kısacası bu süreç, sistemin dilin derin yapılarını içselleştirmesini sağlayan yoğun bir **türetme ve rafine etme** işlemidir.

### Geri yayılım algoritması nasıl çalışır?

Geri yayılım (*back propagation*), büyük dil modellerinin eğitim sürecinde **hata payını azaltmak** ve modelin tahmin yeteneğini geliştirmek için kullanılan temel algoritmadır.Süreç şu adımlarla ilerler;

1. **Tahmin ve Hata Ölçümü:** Model, kendisine verilen metin örneğiyle bir sonraki kelimeyi tahmin eder  Ardından bu tahmin, verideki 'gerçek' kelime ile karşılaştırılarak bir hata payı belirlenir 
2. **Geriye Doğru İletim:** Bu hata payı, ağın çıkış
katmanından başlayarak geriye, giriş katmanına doğru iletilir. Bu sayede her bir parametrenin (ağırlıkların) hataya ne kadar katkıda bulunduğu
hesaplanır 
3. **Parametre Güncelleme:** Hatanın kaynağı belirlendikten sonra, modelin içindeki yüzlerce milyar parametre **küçük miktarlarda değiştirilir**

Bu güncelleme, modelin bir sonraki denemede doğru kelimeyi seçme olasılığını artırırken, hatalı seçeneklerin olasılığını azaltacak şekilde optimize edilir ( Trilyonlarca örnek üzerinde yapılan bu sürekli iyileştirme sayesinde model, dilin karmaşık yapısını ve mantığını

### Parametreler tam olarak nedir?

Büyük dil modellerindeki **parametreler** (bazen *ağırlıklar* olarak da adlandırılır), modelin tüm davranışını belirleyen **milyarlarca sayısal değerden** oluşan bir kümedir Bunları şu şekilde düşünebilirsiniz:.

Bir dil modelini devasa bir makine olarak hayal ederseniz, parametreler bu makinenin üzerindeki **ayarlanabilir kadranlardır** . Modelin, kendisine verilen bir girdiye karşılık bir sonraki kelimeyi
tahmin ederken hangi kelimenin daha olası olduğunu belirleyen
matematiksel kurallar bu parametreler sayesinde şekillenir 

Eğitim başlangıcında bu değerler tamamen **rastgeledir**, bu yüzden model sadece anlamsız (gibberish) çıktılar üretir. Eğitim sırasında trilyonlarca metin örneği üzerinden geçildikçe, *geri yayılım* (back propagation) algoritması bu parametreleri çok küçük miktarlarda
değiştirerek modelin dilin mantığını "öğrenmesini" sağlar 

Bugünün büyük modellerindeki "büyük" ifadesi, bu parametrelerin sayısının **yüzlerce milyara** ulaşmasından kaynaklanır  Bu devasa parametre ağı, modelin dilin karmaşık yapısını, farklı yazım
tarzlarını ve bağlamları içselleştirmesine olanak tanır 

### Parametreler ile zeka arasında nasıl bir bağ var?

Büyük dil modellerinde **parametre sayısı ile zeka (veya yetenek) arasındaki bağ**, modelin karmaşık dil yapılarını, mantığı ve bilgiyi ne kadar derinlikli kavrayabildiğiyle ilgilidir  Bu ilişkiyi şu temel noktalarla açıklayabiliriz:

Parametreler, modelin dil üzerindeki desenleri sakladığı 'hafıza hücreleri' gibidir (1:51-2:00). Parametre sayısı arttıkça modelin verideki daha ince ayrıntıları,
karmaşık mantıksal örüntüleri ve geniş kapsamlı bilgiyi depolama ve
işleme kapasitesi artar 

Yeterince büyük bir parametre havuzuna ulaşıldığında, modelin daha küçük ölçeklerde sergileyemediği **yeni ve beklenmedik yetenekler** ortaya çıkar . Bu, sadece 'daha fazla bilgi' değil, daha gelişmiş bir muhakeme ve problem çözme biçimi olarak kendini gösterir.

Milyarlarca parametre, modelin her bir kelime için olasılık dağılımını çok daha hassas bir şekilde hesaplamasını sağlar . Bu yüksek hassasiyet, modelin ürettiği metinlerin neden bu kadar akıcı, mantıklı ve insansı göründüğünü açıklar 

Özetle, parametreler doğrudan bir 'bilinç' oluşturmasa da, modelin dilin kurallarını ve dünyayı temsil etme biçimini çok daha sofistike bir şekilde modellemesine olanak tanıyarak **gözlemlenen zeka seviyesini** yükseltir.

### Modelin zekası nasıl ölçülüyor?

Büyük dil modellerinde "zekanın" ölçülmesi, geleneksel bir zeka testinden ziyade, modelin **belirli görevlerdeki başarı performansı** üzerinden değerlendirilir. Videoda bu durum doğrudan bir "IQ testi" olarak tanımlanmasa da, modelin yeteneklerini şu şekilde anlıyoruz:

Modelin eğitim
sırasında öğrendiği milyarlarca parametre, onun dili ne kadar doğru ve
bağlama uygun şekilde tahmin edebildiğini belirler . Başarı, modelin bir sonraki kelimeyi ne kadar "akıcı" ve "mantıklı" tahmin ettiğiyle ölçülür 

Modelin ölçeği büyüdükçe (parametre sayısı arttıkça), daha önce programlanmayan
ancak beklenmedik şekilde ortaya çıkan problem çözme veya muhakeme
yetenekleri gözlemlenir . Bu, modelin sadece ezberlemediğini, aynı zamanda dilin derin yapılarını içselleştirdiğini gösterir.

 Chatbotların "iyi bir asistan" olup olmadığı, insan geri bildirimi ile ölçülür. İnsanlar,
modelin verdiği cevapları hatalı, yararsız veya sorunlu bulduklarında
model bu geri bildirimleri kullanarak kendini günceller 

Kısacası, zeka burada bir varlıktan ziyade, sistemin karmaşık dilsel kalıpları ne kadar tutarlı ve kullanıcı için "yararlı" bir şekilde işleyebildiğiyle ölçülmektedir 

### Modelin cevabı neden her seferinde değişiyor?

Büyük dil modellerinin her seferinde farklı cevaplar vermesinin temel sebebi, modelin kelimeleri **kesin bir doğrulukla değil, olasılık dağılımları üzerinden** seçmesidir 

Model, bir sonraki kelimeyi tahmin ederken tüm olası kelimelere birer olasılık değeri atar Eğer model her zaman en yüksek
olasılıklı kelimeyi seçseydi, cevaplar çok mekanik ve tekrar eden bir
yapıda olurdu. Bunun yerine, çıktının daha **doğal ve akıcı** görünmesi için modelin zaman zaman daha düşük olasılıklı kelimeleri de seçmesine izin verilir.

Bu seçim süreci, modelin doğası gereği deterministik (belirli bir girdi için her zaman aynı çıktıyı veren) bir matematiksel fonksiyon olsa da, bu 'olasılıksal seçim' mekanizması
sayesinde aynı isteme (prompt) her seferinde farklı cevaplar
üretilmesini sağlar 

### En yüksek olasılıklı kelimeyi seçmek neden kötü?

Büyük dil modellerinde her adımda sadece en yüksek olasılıklı (en 'mantıklı') kelimeyi seçmek, metnin **mekanik, tekrar eden ve tahmin edilebilir** hale gelmesine neden olur.

Model sürekli en olası kelimeye
sadık kalırsa, metin son derece kısıtlı ve sıkıcı bir kalıba girer.
Dilin zenginliğini, metaforları veya ilginç cümle yapılarını kullanamaz.

Eğer model her zaman en olası yolu izlerse, bazen kendi ürettiği kelimeler arasında kısılıp kalabilir ve
aynı cümleyi veya ifadeyi tekrar etmeye başlayabilir.

 İnsan konuşması veya yazısı mükemmel derecede tahmin edilebilir değildir. Zaman zaman beklenmedik,
daha düşük olasılıklı kelimelerin seçilmesi, modelin çıktısını çok daha **akıcı, doğal ve insansı** kılar 

Özetle, modelin bazen daha düşük olasılıklı kelimeleri rastgele seçmesine izin vermek, cevabın çok daha ilginç ve çeşitli olmasını sağlar.

END… umarım faydalı olmuştur