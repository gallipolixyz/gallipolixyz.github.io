# Types of AI Jailbreaking

![image1]

Bir yapay zekânın tehlikeli bir isteğe “Buna yardımcı olamam” demesi, arkasında aşılamaz bir duvar bulunduğu anlamına gelmez. Bu cevap; model eğitimi, güvenlik politikaları, sistem talimatları ve içerik filtrelerinin birlikte oluşturduğu öğrenilmiş bir davranıştır. Öğrenilmiş her davranış gibi bazı sıra dışı durumlar karşısında hareketleri tutarsızlaşabilir. Bugünkü anlatmak istediğim şey bu sıra dışı durumları olacaktır.
Jailbreaking’in tanımı şöyledir: güvenlik için hizalanmış bir modeli normalde reddedeceği bir davranışı sergilemeye yönelten istem ve etkileşim yöntemlerinin genel adıdır.
### Etik Çerçeve:

Bu yöntemleri araştırmak doğal olarak etik bir ikilem doğuruyor bunun farkındayım. Bir güvenlik mekanizmasının nasıl aşılabileceğini öğrenmek, saldırganlara da yardımcı olmaz mı?
Aslında evet olur ama siber güvenliğin diğer alanlarında da olduğu gibi cevap, araştırmanın amacı ve uygulanma biçiminde yatıyor. Yetkili red team çalışmaları, kötü niyetli aktörlerden önce davranarak zayıflıkları kontrollü ortamlarda ortaya çıkarmayı hedefler. Bulunan sonuçlar daha güçlü filtreler, daha iyi güvenlik eğitimleri ve daha dayanıklı sistemler geliştirmek için kullanılır.

![image2]

## 1. Narrative & Instruction Manipulation

![image3]

Büyük dil modelleri yalnızca sorulara cevap vermez; verilen rolleri, hikâyeleri ve talimatları tutarlı biçimde sürdürmeye de çalışır. Bu özellik, yaratıcı yazarlık ve problem çözme gibi alanlarda oldukça faydalıdır. Fakat dijital dünya da her güzel şeyi kötü niyetle kullanan insanlar bu özelliği de kötü niyetle kullanmayı başarmıştır ve yeni bir attack surface oluşturmuşlardır.
Bu gruptaki yöntemler zararlı isteği teknik olarak şifrelemek yerine, modelin isteği yorumladığı bağlamı değiştirmeye çalışır. Modelin yardımcı olma, rolünü sürdürme ve talimatları izleme eğilimleri güvenlik sınırlarıyla karşı karşıya getirilir.

### 1.1 Roleplay Jailbreaks

Roleplay jailbreak, modele yalnızca farklı bir isim vermek değildir. Modelden normal asistan kimliğini bir kenara bırakması ve farklı kurallara sahip kurgusal bir karakter gibi davranması istemektir.
Bu yaklaşımın en bilinen örneği DAN, yani Do Anything Now jailbreak’idir. DAN istemleri modeli, normal güvenlik kurallarından bağımsız hareket edebilen hayalî bir yapay zekâ olarak tanımlamaya çalışıyordu. Bazı varyasyonlarda modelden biri normal, diğeri “sınırsız” karaktere ait iki farklı cevap üretmesi isteniyor; bazılarında ise karakterin rolünden çıkmasını engellemek için hayalî ödül, ceza veya puan sistemleri kullanılıyordu.
Buradaki amaç güvenlik politikasını gerçekten silmek değil, modeli farklı bir davranış bağlamına taşımaktır. LLMler romanlar, senaryolar, oyun diyalogları ve farklı karakterlerin konuşmalarıyla eğitildiği için yalnızca bir karakterin konuşma tarzını değil, davranış biçimini de taklit edebilir. Böylece güvenli kalma amacı ile üstlendiği rolü tutarlı biçimde sürdürme amacı çatışabilir.
Basit DAN istemleri günümüz modelleri tarafından daha kolay fark ediliyor. Ancak roleplay; uzun karakter tanımları, çok turlu konuşmalar veya başka gizleme yöntemleriyle birleştirildiğinde hâlâ daha karmaşık saldırıların taşıyıcısı olabilir. Savunma açısından model, konuşan karakterin kimliğine değil, karakterden üretmesi istenen içeriğin gerçek riskine bakmalıdır.

### 1.2 Fictional Framing

Fictional framing, riskli bir isteğin roman, film senaryosu, oyun veya hayalî bir araştırma gibi kurgusal bir bağlamın içine yerleştirilmesidir.

Roleplay ile arasındaki fark küçüktür fakat önemlidir: Roleplay saldırısında modelin kimliği, fictional framing yönteminde ise isteğin gerçekleştiği dünya değiştirilir. Model hâlâ normal asistan olarak kalabilir; ancak talebin gerçek bir olay değil, hikâyenin parçası olduğu söylenir.
Bu yöntem, güvenlik sisteminin bağlam ile içerik arasında kurduğu ilişkiden yararlanır. Doğrudan yöneltilen riskli bir talep kolayca fark edilebilirken aynı bilgi bir karakterin diyaloğu, senaryo sahnesi veya hayalî olay örgüsü içinde sunulduğunda daha belirsiz görünebilir. Model de isteğin asıl amacından çok hikâyenin tutarlı biçimde devam etmesine odaklanabilir.
Yöntemin daha gelişmiş sürümlerinde iç içe geçmiş birden fazla hikâye katmanı kullanılabilir. DeepInception araştırması, karakterlerin kendi sahnelerini oluşturduğu nested senaryoların saldırı amacını bağlamın derinliklerine taşıyabildiğini gösterdi. Böylece model, üst seviyedeki güvenlik sorunundan uzaklaşıp alt seviyedeki hikâye görevlerini tamamlamaya yönelebilir. [DeepInception araştırması](https://arxiv.org) Savunma açısından bütün karanlık hikâyeleri reddetmek doğru değildir; bu yaklaşım modelin yaratıcı yazarlık yeteneğini ciddi biçimde sınırlar. Bunun yerine kurgusal çerçeve çıkarıldığında geriye kalan bilginin ne kadar spesifik, uygulanabilir ve gerçek dünyaya aktarılabilir olduğu değerlendirilmelidir.

### 1.3 Persuasive Adversarial Prompts (PAP)

Persuasive Adversarial Prompts saldırılarında kullanıcı kendisini araştırmacı, akademisyen, geliştirici, sistem yöneticisi veya yetkili bir güvenlik uzmanı olarak tanıtabilir. Talebin savunma testi, bilimsel araştırma, acil durum veya daha büyük bir zararı önleme amacı taşıdığı öne sürülür.
Bu yöntemin temelinde basit bir sorun vardır: Dil modeli, kullanıcının kimliğini yalnızca yazdığı mesaja bakarak doğrulayamaz. Buna rağmen yardımcı olmak üzere eğitildiği için makul görünen gerekçeleri ve otorite ifadelerini önemli sinyaller olarak değerlendirebilir.
Daha gelişmiş saldırılar yalnızca yetki iddiasına dayanmaz. Talebin neden etik olduğu uzun biçimde açıklanabilir, modelin cevap vermemesinin daha büyük bir zarara yol açacağı savunulabilir veya uzman görüşleri kullanılarak yapay bir meşruiyet oluşturulabilir. Böylece riskli istek değişmez; isteğin çevresindeki gerekçelendirme katmanı değiştirilir.
How Johnny Can Persuade LLMs to Jailbreak Them araştırması, sosyal bilimlerdeki ikna tekniklerinden yararlanarak PAP yaklaşımını geliştirdi. Çalışma; otorite, mantıksal ikna, yanlış temsil ve uzman desteği gibi yöntemlerin farklı modeller üzerindeki etkisini araştırdı. Bu da jailbreak çalışmalarının yalnızca karmaşık algoritmalardan değil, gündelik insan iletişiminden de yararlanabildiğini gösterdi. [PAP araştırması](https://arxiv.org)

### 1.4 Instruction Hierarchy Attacks

LLM tabanlı uygulamalarda bütün talimatlar aynı öneme sahip değildir. Sistem mesajları modelin temel davranışını belirler, geliştirici mesajları uygulamanın kurallarını tanımlar, kullanıcı mesajları ise gerçekleştirilecek görevi iletir. Web sayfaları, belgeler ve diğer dış kaynaklardan gelen metinler daha da düşük güven seviyesinde değerlendirilmelidir.
Instruction hierarchy saldırıları bu sıralamayı bozmaya çalışır. Kullanıcı mesajı kendisini daha yüksek yetkili bir komut gibi gösterebilir, önceki kuralların artık geçerli olmadığını iddia edebilir veya modele gerçekte sahip olmadığı yeni bir çalışma modu tanımlayabilir.
Sorun, model açısından bütün bu talimatların aynı bağlam penceresi içinde bulunan metinlerden oluşmasıdır. Mesajların sistem veya kullanıcı olarak işaretlenmesi modele önemli bir sinyal verir; ancak bu ayrım geleneksel bir erişim kontrol sistemi kadar kesin değildir. Model mesajın gerçek kaynağı yerine daha baskın, ayrıntılı veya otoriter yazılmış talimata yönelirse bir çeşit priority inversion ortaya çıkar.
Bu alan prompt injection ile jailbreak arasındaki sınırın bulanıklaştığı noktadır. Jailbreak genellikle modelin güvenlik sınırlarını aşmayı, prompt injection ise LLM tabanlı uygulamanın geliştirici tarafından belirlenen görevini değiştirmeyi hedefler. Bazı saldırılar her ikisini aynı anda gerçekleştirebilir.
The Instruction Hierarchy araştırması, modellerin yüksek ve düşük yetkili talimatlar çatıştığında düşük yetkili olanı seçici biçimde yok sayacak şekilde eğitilmesini öneriyor. Ancak model eğitimi tek başına yeterli değildir. Dış kaynaklardan gelen verilerin komutlardan ayrılması, araç çağrılarının ayrıca yetkilendirilmesi ve kritik işlemlerin model dışında kontrol edilmesi gerekir. [Instruction Hierarchy araştırması](https://arxiv.org) 

### 2. Obfuscation & Token Manipulation

![image4]

Bu saldırı ailesinde isteğin amacı değiştirilmez; yalnızca modele sunuluş biçimi değiştirilir. İçerik başka bir dile çevrilebilir, kodlanabilir, farklı karakterlerle yazılabilir veya küçük parçalara ayrılabilir. Amaç, modelin anlayabildiği içerikle güvenlik sisteminin algılayabildiği içerik arasında bir boşluk oluşturmaktır.
Buradaki token, kimlik doğrulama token’ı değildir. LLM’lerin metni işlerken kullandığı kelime, hece ve karakter parçalarını ifade eder. Metindeki küçük bir değişiklik insan için anlamı korurken modelin gördüğü token dizisini tamamen değiştirebilir.
Bu yöntemler modelin anlama yeteneği ile güvenlik eğitimi arasındaki farktan yararlanır. Model gizlenmiş isteği çözebilecek kadar yetenekli olabilir; fakat aynı gösterim içindeki riski tanımakta zorlanabilir. Yine de model metni çözemiyor veya anlamsız cevap veriyorsa bu başarılı bir jailbreak sayılmaz.

### 2.1 Multilingual Jailbreaks

Multilingual jailbreak, riskli bir isteğin başka bir dile çevrilerek modele sunulmasıdır. Özellikle internette daha az kullanılan ve güvenlik eğitiminde daha az temsil edilen diller tercih edilebilir.
Modelin çok dilli anlama yeteneği, güvenlik eğitiminin dil kapsamından daha geniş olabilir. Model soruyu anlayabilir; ancak o dildeki riskli ifadeleri İngilizcedeki kadar güvenilir biçimde tanımayabilir. Böylece aynı içerik yalnızca dil değiştirdiği için farklı bir güvenlik tepkisiyle karşılaşabilir.
Ancak çeviri saldırılarının başarı oranları dikkatli yorumlanmalıdır. Model reddetmeden cevap verse bile çeviri nedeniyle anlamsız veya hatalı bilgi üretebilir. StrongREJECT araştırması, daha önce etkili olduğu iddia edilen bazı düşük kaynaklı dil saldırılarının gerçekte kullanılabilir cevaplar üretmediğini gösterdi. [StrongREJECT araştırması](https://arxiv.org) 

### 2.2 Encoding & Cipher Attacks

Bu yöntemde istek Base64, ROT13 veya benzeri bir kodlama biçimine dönüştürülür. Bazen modele kodlanmış metni çözmesi, anlaması ve cevabı yeniden aynı formatta üretmesi söylenir.
Buradaki saldırı gerçek bir şifreleme sistemini kırmaz. Amaç, riskli içeriği normal metin biçiminden çıkararak giriş ve çıkış filtrelerinin algılamasını zorlaştırmaktır. Model kodlamanın kurallarını bildiği için içeriği çözebilir; fakat güvenlik kontrolü yalnızca görünen karakter dizisini inceliyorsa asıl anlamı kaçırabilir.
Savunma için girdiler değerlendirilmeden önce bilinen kodlamalar çözülebilir ve standart bir metin biçimine dönüştürülebilir. Aynı kontrol modelin çıktısına da uygulanmalıdır; çünkü riskli içerik doğrudan değil, kodlanmış biçimde üretilebilir.

### 2.3 Token Smuggling

Token smuggling, bir kelimeyi veya talimatı modelin yeniden birleştirebileceği fakat basit güvenlik kontrollerinin kolayca tanıyamayacağı biçimde yazmayı hedefler.

Bunun için harflerin arasına özel karakterler eklenebilir, görsel olarak benzer Unicode karakterleri kullanılabilir veya kelimelerin parçaları farklı biçimlerde gösterilebilir. İnsan gözü bunları aynı ifade olarak okuyabilirken tokenizer farklı bir token dizisi oluşturabilir.
Bu yöntem özellikle yalnızca anahtar kelime arayan filtrelere karşı etkilidir. Buna karşılık modern güvenlik sistemleri metnin tamamındaki anlamı değerlendirdiği için basit karakter değişiklikleri artık her zaman yeterli değildir. Savunmada Unicode normalizasyonu, görünmeyen karakterlerin temizlenmesi ve metnin hem karakter hem anlam seviyesinde incelenmesi birlikte kullanılabilir.

### 2.4 Payload Splitting

Payload splitting, riskli bir isteğin tek parça hâlinde sunulması yerine birden fazla zararsız görünen bölüme ayrılmasıdır. Bu parçalar değişkenler, ayrı cümleler veya farklı konuşma mesajları içinde verilebilir. Modelden daha sonra parçaları birleştirerek asıl görevi tamamlaması beklenir.
Token smuggling daha çok kelime ve karakter seviyesinde gizleme yaparken payload splitting, talimatı mantıksal bölümlere ayırır. Her parça tek başına incelendiğinde zararsız görünebilir; risk ancak parçalar birlikte değerlendirildiğinde ortaya çıkar.

Bu saldırıya karşı yalnızca son kullanıcı mesajını incelemek yeterli değildir. Güvenlik sistemi konuşmanın tamamını, önceki mesajlarda tanımlanan değişkenleri ve parçaların birleştiğinde oluşturduğu amacı değerlendirmelidir.

## 3. Automated & Adversarial Attacks
![image5]

Önceki yöntemlerde saldırgan, etkili istemi çoğunlukla kendi deneyimiyle oluşturuyordu. Automated & Adversarial Attacks kategorisinde ise bu süreç bir arama ve optimizasyon problemine dönüştürülür. Sistem; farklı istemler üretir, hedef modelin cevaplarını ölçer ve başarılı sonuçlara yaklaşan varyasyonları geliştirmeye devam eder.
Bu saldırılar iki farklı erişim düzeyinde uygulanabilir. White-box saldırılarda modelin ağırlıklarına ve gradyanlarına erişilirken, black-box saldırılarda yalnızca modele istek gönderilip cevapları gözlemlenir. Amaç her iki durumda da aynıdır: güvenlik davranışındaki zayıf noktayı deneme yanılmayla değil, sistematik biçimde bulmak.
### 3.1 Adversarial Suffix Attacks

Adversarial suffix saldırılarında, asıl istemin sonuna insan gözüyle bakıldığında anlamsız veya konuyla ilgisiz görünen bir token dizisi eklenir. Bu ek bölüm kullanıcıya bir şey anlatmak için değil, modelin bir sonraki tokeni nasıl tahmin edeceğini etkilemek için tasarlanır.
En bilinen örneklerden biri Greedy Coordinate Gradient (GCG) yöntemidir. GCG, modelin reddetme cevabı yerine olumlu bir başlangıç üretme olasılığını yükseltecek tokenleri gradyanlardan yararlanarak arar. Ardından aday tokenleri tek tek deneyerek hedef fonksiyonu en fazla iyileştiren değişiklikleri seçer. Ortaya çıkan ek bazen doğal bir cümleye benzemez; buna rağmen modelin iç temsilinde güvenlik davranışını bozabilecek bir etki oluşturabilir.
Bu yöntemin önemi, jailbreak araştırmasını yalnızca ikna edici metin yazma probleminden çıkarıp token seviyesinde optimizasyon problemine dönüştürmesidir. Ayrıca açık kaynaklı modeller üzerinde bulunan bazı dizilerin farklı ve kapalı modellere de aktarılabildiği gösterilmiştir. Bununla birlikte aktarım her model ve istem için aynı başarıyı sağlamaz; dolayısıyla “universal” ifadesi mutlak bir garanti olarak görülmemelidir.
([Zou ve diğerleri, 2023](https://arxiv.org) , [Andriushchenko ve diğerleri, 2024](https://arxiv.org) )
Savunma açısından yalnızca anlamsız karakterleri veya belirli token kalıplarını engellemek yeterli değildir. Adversarial training, istem normalleştirme, şüpheli token dağılımlarını tespit etme ve model çıktısını bağımsız biçimde denetleme birlikte kullanılmalıdır.
### 3.2 Prompt Fuzzing

Prompt fuzzing, yazılım güvenliğinde kullanılan fuzzing yaklaşımını LLM’lere uyarlamasıdır. Geleneksel fuzzing bir programa çok sayıda değiştirilmiş girdi vererek beklenmeyen davranışları ararken, prompt fuzzing aynı işlemi doğal dil istemleri üzerinde gerçekleştirir.
Süreç genellikle daha önce etkili olmuş birkaç seed prompt ile başlar. Sistem bu istemleri yeniden ifade etme, bağlam ekleme, anlatım biçimini değiştirme veya farklı yapılarla birleştirme gibi mutasyonlardan geçirir. Üretilen her aday hedef modele gönderilir ve ayrı bir değerlendirici, cevabın güvenlik sınırını aşıp aşmadığını ölçer. Başarılı veya ilginç bulunan adaylar daha sonraki mutasyonların başlangıç noktası hâline gelir.
Bu nedenle prompt fuzzing, rastgele binlerce istem göndermekten farklıdır. Arama süreci feedbacklarle yönlendirilir. Hangi örneklerin korunacağına ve hangilerinin geliştirileceğine sistem karar verir. GPTFuzzer, bu yaklaşımı insan tarafından hazırlanmış şablonlar, mutasyon operatörleri ve otomatik değerlendirme mekanizmasıyla birleştiren önemli çalışmalardan biridir.
Araştırmada bazı model ve test düzeneklerinde yüzde 90’ın üzerinde başarı raporlanmıştır; ancak bu oranlar kullanılan model sürümüne, veri kümesine ve başarı ölçütüne bağlıdır. ([Yu ve diğerleri, 2023](https://arxiv.org) )
Savunmada rate-limit tek başına yeterli olmayabilir. Birbirine semantik olarak benzeyen sorguların kümelenmesi, tekrar eden başarısız denemelerin izlenmesi ve sistemin kendi üzerinde düzenli fuzz testleri çalıştırması daha etkili bir yaklaşım oluşturur.
### 3.3 LLM-as-an-Attacker

Bu yaklaşımda jailbreak istemini doğrudan bir insan hazırlamaz; başka bir dil modeli saldırgan rolünü üstlenir. Saldırgan model hedef modele bir istem gönderir, cevabı inceler ve reddedilme nedenine göre yeni bir sürüm üretir. Böylece süreç, iki model arasında yürütülen otomatik bir red team diyaloğuna dönüşür.
PAIR — Prompt Automatic Iterative Refinement, bu yöntemin en bilinen örneklerindendir. Saldırgan model her turda önceki denemeyi ve hedef modelin cevabını değerlendirerek istemini yeniden yazar. Yöntem yalnızca hedef modelin giriş ve çıkışlarına ihtiyaç duyduğu için black-box sistemlerde de çalışabilir ve araştırmada çoğu örnek için yirmiden az sorguyla sonuç üretmiştir. ([Chao ve diğerleri, 2023](https://arxiv.org) )
Tree of Attacks with Pruning (TAP) ise tek bir deneme zinciri yerine birden fazla aday dal oluşturur. Saldırıyla ilgisiz veya başarısız olma ihtimali yüksek dallar hedef modele gönderilmeden elenir; umut vadeden adaylar geliştirilmeye devam eder. Böylece sınırlı sorgu bütçesi daha verimli kullanılır. ([Mehrotra ve diğerleri, 2023](https://arxiv.org) )
Bu saldırı sınıfının asıl gücü, insanın manuel olarak yaptığı “neden reddetti, nasıl yeniden ifade edebilirim?” analizini otomatikleştirmesidir. Savunma tarafında ise ardışık sorgular arasındaki ilişkiyi izlemek, sistematik yeniden yazma davranışlarını belirlemek ve testlerde saldırgan modelden bağımsız bir güvenlik değerlendiricisi kullanmak gerekir.
### 3.4 Evolutionary Prompt Search

Evolutionary prompt search, jailbreak istemlerini tek tek üretmek yerine onları bir popülasyon hâlinde geliştirir. Sistem başlangıçtaki istemleri seçme, çaprazlama ve mutasyon gibi genetik algoritma adımlarıyla dönüştürür; hedef model karşısında daha başarılı olan varyasyonlar sonraki nesillere aktarılır.
AutoDAN, bu yaklaşımın bilinen örneklerinden biridir. Hiyerarşik bir genetik algoritma kullanarak yalnızca etkili değil, insan tarafından okunabilir jailbreak istemleri üretmeyi hedefler. Böylece anlamsız adversarial suffix’lerden farklı olarak doğal görünen ve basit perplexity filtreleriyle yakalanması daha zor adaylar ortaya çıkarabilir. (Liu ve diğerleri, 2023)
LLM-Virus ise dil modellerini mutasyon ve çaprazlama yapan evrimsel operatörler olarak kullanır. Jailbreak aramasını aynı zamanda bir transfer learning problemi olarak ele alır; başarılı yapıların farklı görev ve modellere aktarılabilmesini hedefler. Buradaki “virus” gerçek bir zararlı yazılımı değil, istemlerin nesiller boyunca değişerek yayılmasını anlatan bir benzetmedir. (Yu ve diğerleri, 2025)
Bu yöntem prompt fuzzing’e benzese de aralarında önemli bir fark vardır: fuzzing çoğunlukla seed istemleri mutasyonlarla çeşitlendirirken evolutionary search, adaylardan oluşan bir popülasyonu başarı sinyaline göre seçer ve nesiller boyunca geliştirir. Savunma açısından tek tek istemleri engellemek yeterli değildir; birbirine benzeyen denemelerin evrimsel bir arama oluşturup oluşturmadığı da izlenmelidir.

## 4. Contextual & Multimodal Attacks
![image6]

Önceki saldırılar çoğunlukla tek bir istemin yapısını değiştirmeye odaklanıyordu. Contextual & Multimodal Attacks ise modelin yalnızca son mesaja değil; konuşma geçmişine, verilen örneklere, uzun bağlama ve görsel girdilere de dayanmasını hedef alır.
Bu saldırılarda zararlı niyet tek bir noktada açıkça bulunmayabilir. İstek farklı konuşma turlarına dağıtılabilir, yüzlerce örneğin arasına yerleştirilebilir veya metin filtresinin doğrudan incelemediği bir görsel kanal üzerinden aktarılabilir. Güvenlik sisteminin her parçayı ayrı ayrı değerlendirmesi, parçalar birleştiğinde ortaya çıkan gerçek amacı gözden kaçırmasına neden olabilir.
### 4.1 Multi-Turn Escalation

Multi-turn escalation, modelin sınırlarını tek bir mesajla aşmaya çalışmak yerine konuşmayı adım adım hedefe yaklaştırır. İlk mesajlar genellikle zararsızdır: bir kavramın tarihi, genel çalışma prensibi veya savunma amacıyla yapılan bir inceleme sorulabilir. Daha sonraki mesajlar ise modelin önceki cevaplarına dayanarak giderek daha hassas ayrıntılar talep eder.
Buradaki temel mekanizma conversational commitment, yani konuşma boyunca oluşan bağlamsal devamlılıktır. Model önceki adımlarda konuyu meşru bir çerçevede ele aldığı için sonraki isteği sıfırdan değerlendirmek yerine mevcut sohbetin devamı olarak yorumlayabilir. Tek başına reddedilecek bir talep, konuşma geçmişi içinde daha masum görünebilir.
Crescendo saldırısı bu yaklaşımın bilinen örneklerinden biridir. Saldırı genel ve zararsız bir soruyla başlar, modelin verdiği cevapları sonraki istemlerde referans olarak kullanır ve talebin hassasiyetini kademeli biçimde yükseltir. Böylece zararlı amaç tek bir mesajda açıkça ifade edilmeden konuşma boyunca inşa edilir. ([Russinovich, Salem ve Eldan, 2024](https://arxiv.org) )
Savunma sistemleri bu nedenle yalnızca son mesajı değil, konuşmanın tamamında oluşan intent trajectory’yi değerlendirmelidir. Hassasiyet seviyesi her turda yükseliyorsa önceki cevapların güvenli görünmesi, son talebin otomatik olarak güvenli kabul edilmesi için yeterli değildir.
### 4.2 Few-Shot Priming

Dil modelleri, istem içinde verilen örneklerden görev biçimini öğrenebilir. Few-shot priming, modelin nasıl cevap vermesi gerektiğini göstermek için birkaç örnek kullanıcı–asistan etkileşiminin bağlama yerleştirilmesidir. Normal kullanımda oldukça yararlı olan bu in-context learning özelliği, güvenlik davranışını etkilemek için de kullanılabilir.
Örneğin bağlamdaki kurgusal asistan, tekrar tekrar belirli türdeki talepleri itiraz etmeden yanıtlıyor olabilir. Modelden daha sonra aynı örüntüyü tamamlaması istendiğinde, güvenlik eğitimi ile bağlam içinde gösterilen davranış arasında bir rekabet ortaya çıkar. Model örneklerin gerçek bir sohbet geçmişi olmadığını bilse bile metinsel kalıbı sürdürmeye çalışabilir.
Bu etkinin daha büyük ölçekteki biçimi Many-Shot Jailbreaking olarak adlandırılır. Anthropic’in çalışmasında bağlama yüzlerce örnek yerleştirilmesinin, uzun bağlam penceresine sahip bazı modellerde jailbreak başarısını artırabildiği gösterilmiştir. Araştırmacılar ayrıca etkinin örnek sayısıyla belirli bir ölçekleme eğilimi gösterdiğini, ancak bağlamın karıştırılması veya güvenli örneklerin eklenmesi gibi savunmaların saldırıyı zayıflatabildiğini belirtmiştir.
([Anil ve diğerleri, 2024](https://www.anthropic.com) )
Burada few-shot ve many-shot arasındaki fark yöntemden çok ölçekle ilgilidir: ikisi de modele bağlam içinde bir davranış örüntüsü öğretmeye çalışır. Savunma açısından istemdeki örnekler veri olarak ele alınmalı; sistem politikalarının yerine geçmelerine veya sahte asistan cevaplarının güvenilir talimatlar gibi yorumlanmasına izin verilmemelidir.
### 4.3 Context Overload

Context overload saldırıları, modelin bağlam işleme kapasitesini doğrudan doldurmaktan ibaret değildir. Amaç; ana talebi çok sayıda görev, kural, dönüşüm, örnek veya muhakeme adımının arasına yerleştirerek güvenlik değerlendirmesini zorlaştırmaktır.
Model aynı anda metni çevirmek, belirli bir formata dönüştürmek, sembolleri eşleştirmek ve bir dizi koşulu takip etmek zorunda bırakılabilir. Böyle bir istemde zararlı amaç ortadan kaybolmaz; fakat modelin takip ettiği görevler arasında daha az belirgin hâle gelir. Güvenlik mekanizması yüzeydeki ara işlemlere odaklanırken, işlemlerin sonunda oluşan anlamı yeterince değerlendiremeyebilir.
Araştırmalarda buna cognitive overload adı verilse de bu terim modelin insanlar gibi zihinsel yorgunluk yaşadığı anlamına gelmez. Teknik olarak söz konusu olan; uzun ve karmaşık bağlam altında talimat takibi, in-context learning ve güvenlik hizalaması arasındaki performans çatışmasıdır. Cognitive Overload çalışması, çok aşamalı görev yükünün çeşitli model ve güvenlik veri kümelerinde reddetme davranışını önemli ölçüde zayıflatabildiğini raporlamıştır.
Ancak bildirilen başarı oranları kullanılan istem yapısına, modele ve jailbreak değerlendirme ölçütüne bağlı olarak okunmalıdır. ([Upadhayay, Behzadan ve Karbasi, 2024](https://arxiv.org) )
Savunmada token sayısını sınırlamak tek başına çözüm değildir. Sistem, uzun girdiyi önce anlamlı parçalara ayırmalı; her parçanın yanında dönüşümler tamamlandıktan sonra ortaya çıkan nihai amacı da yeniden değerlendirmelidir.
### 4.4 Visual Prompt Injection

Multimodal modeller yalnızca yazılı istemleri değil; görselleri, ekran görüntülerini, belgeleri ve bazen sesleri de yorumlayabilir. Bu yetenek yeni bir saldırı yüzeyi oluşturur çünkü güvenlik denetimleri bütün giriş kanallarında aynı güçte çalışmayabilir.
Visual Prompt Injection, bir talimatın doğrudan metin kutusuna yazılması yerine görselin içine yerleştirilmesidir. Bu içerik görünür tipografi, küçük yazılar, belge içindeki yönergeler veya görüntünün temsilinde yapılan adversarial değişiklikler şeklinde bulunabilir. Görsel kodlayıcı içeriği token benzeri temsillere dönüştürdüğünde model, görüntüdeki metni yalnızca incelenecek veri olarak değil, uygulanması gereken bir talimat olarak yorumlayabilir.
FigStep, yasaklı talebin tipografik biçimde görsel kanala taşındığı black-box bir saldırı örneğidir. Çalışmada metin girdisi zararsız bir tamamlama isteği gibi görünürken, asıl görev görüntüden okunmaktadır. Araştırmacılar altı açık kaynaklı vision-language model üzerinde ortalama yüzde 82,5 attack success rate raporlamış ve zayıflığın görsel temsillerin metin kadar güçlü güvenlik hizalamasından geçmemesiyle ilişkili olduğunu savunmuştur.
Bu oran da yalnızca çalışmada kullanılan modeller ve değerlendirme düzeni için geçerlidir. ([Gong ve diğerleri, 2023](https://arxiv.org) )
Bu saldırı özellikle belge özetleyen veya ekran üzerinde işlem yapan AI agent’lar için daha geniş bir risk oluşturur. Bir web sayfasındaki veya yüklenen dosyadaki talimat, kullanıcının komutuyla karıştırılırsa sorun yalnızca uygunsuz cevap üretmekle kalmaz; bağlı araçların yanlış kullanılması da mümkün olabilir.
Etkili savunma için görüntülerden çıkarılan metin güvenilmeyen veri olarak işaretlenmeli, kullanıcı talimatlarından ayrılmalı ve aynı güvenlik politikaları bütün modalitelere uygulanmalıdır. Modelin bir içeriği okuyabilmesi, o içerikte yazan komutları yürütme yetkisine sahip olduğu anlamına gelmemelidir.

## Conclusion: Understanding the Attack Surface

İncelediğimiz 16 yöntem, jailbreak saldırılarının tek bir “sihirli istemden” ibaret olmadığını gösteriyor:

- Narrative & Instruction Manipulation, modelin rol, otorite ve talimat önceliği algısını değiştirerek güvenlik sınırlarını zorlar.
- Obfuscation & Token Manipulation, zararlı amacı değiştirmeden onun modele ulaşma biçimini; dil, kodlama veya token yapısı üzerinden dönüştürür.
- Automated & Adversarial Attacks, etkili istem bulma sürecini algoritmalar ve saldırgan modeller yardımıyla ölçeklenebilir bir optimizasyon problemine çevirir.
- Contextual & Multimodal Attacks ise amacı konuşma geçmişine, uzun bağlama veya görsel kanallara dağıtarak güvenlik sistemlerinin parçalar arasındaki bağlantıyı kaçırmasını hedefler.

Bu yöntemleri incelemenin amacı güvenlik mekanizmalarını işlevsizleştirmek değil, hangi koşullarda başarısız olabileceklerini saldırganlardan önce görebilmektir. Çünkü savunamadığımız şey çoğu zaman yasaklamadığımız değil, yeterince anlamadığımız şeydir.

Olası bir saldırıda şanslı olmayı umut etmekten çok bu durum için hazırlanmamız lazımdır.

> “Gözlem alanında şans yalnızca hazırlıklı zihinlerden yanadır.”
>
> — Louis Pasteur

[image1]: /blogs/img/types-of-ai-jailbreaking/image1.png
[image2]: /blogs/img/types-of-ai-jailbreaking/image2.png
[image3]: /blogs/img/types-of-ai-jailbreaking/image3.png
[image4]: /blogs/img/types-of-ai-jailbreaking/image4.png
[image5]: /blogs/img/types-of-ai-jailbreaking/image5.png
[image6]: /blogs/img/types-of-ai-jailbreaking/image6.png
