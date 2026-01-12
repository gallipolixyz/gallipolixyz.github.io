# Android Runtime: Dalvik ve ART Mimarileri

|  |  |  |  |  | ![](/blogs/img/android-runTime/1.png) |
|--|--|--|--|--|:--:|


Mobil teknolojilerin hızla geliştiği günümüzde, Android işletim sistemi; uygulama performansı, enerji verimliliği ve güvenlik açısından kullanıcı deneyimini iyileştirmek için birçok yapısal değişikliğe gitmiştir. Bu dönüşümün merkezinde ise Android Runtime (ART) yer almaktadır. Android’in temel yapı taşlarından biri olan bu çalışma zamanı ortamı, uygulamaların derlenmesi, yürütülmesi ve bellek yönetimi gibi birçok görevi üstlenmektedir. Bu yazı, Android’in erken döneminde kullanılan Dalvik Virtual Machine (VM) ile günümüzdeki Android Runtime (ART) mimarisini kapsamlı biçimde karşılaştırmakta ve bu iki sistemin mimari yapıları, performans etkileri ile donanım üzerindeki sonuçlarını detaylandırmaktadır.

Android Runtime, Android cihazlardaki Java tabanlı uygulama kodlarının çalıştırılmasını sağlayan bir altyapıdır. Uygulama çalıştırma süreci yalnızca kod yürütmeyle sınırlı değildir; aynı zamanda bellek tahsisi, çöp toplama, işlem yalıtımı ve hata ayıklama gibi görevleri de kapsar.

Android Runtime, uygulama kodlarını cihazın işlemcisi tarafından çalıştırılabilir hâle getirmek için iki temel derleme yaklaşımını destekler: Just-In-Time (JIT) ve Ahead-Of-Time (AOT). Dalvik yalnızca JIT kullanırken, ART her iki yöntemi hibrit olarak kullanarak esneklik ve verimlilik sağlar.

## 2.Dalvik ve Android Runtime (ART): Çalışma Prensipleri

|  |  |  |  |  | ![](/blogs/img/android-runTime/2.png) |
|--|--|--|--|--|:--:|


### 2.1 Dalvik Virtual Machine (DVM)

Dalvik, Android’in ilk sürümlerinde kullanılan özel bir sanal makinedir. Java kodlarını .dex (Dalvik Executable) formatına dönüştürerek çalıştırır. Just-In-Time (JIT) derleme tekniği sayesinde, uygulama çalıştırılmadan önce değil; çalışırken ihtiyaç duyulan kısımlar derlenir. Bu yöntem başlangıçta hızlı yükleme sağlar, ancak uzun vadede uygulama performansında dalgalanmalara ve pil tüketiminde artışa neden olabilir.

### 2.2 Android Runtime (ART)

Android 5.0 (Lollipop) sürümünden itibaren Dalvik’in yerini alan ART, uygulama kodlarını cihaz kurulum aşamasında derleyerek çalıştırmaya hazır hâle getirir (Ahead-Of-Time). AOT sayesinde uygulamalar hızlı başlar, işlemciye daha az yük biner ve enerji tüketimi azalır. ART aynı zamanda JIT ile birlikte çalışarak, kullanıcı alışkanlıklarını analiz edip sık kullanılan kod parçalarını daha da optimize eder. Bu hibrit yaklaşım, hem performansı hem de kaynak kullanımını dengeler.

### 3. Dalvik ve ART Mimarileri Arasındaki Temel Farklılıklar

|  |  |  |  |  | ![](/blogs/img/android-runTime/3.png) |
|--|--|--|--|--|:--:|



#### Derleme Türü

Dalvik VM: Just-In-Time (JIT) derleme yöntemini kullanır. Kod, çalıştırma anında derlenir.

ART (Android Runtime): Ahead-Of-Time (AOT) ve JIT derleme yöntemlerinin birleşimini kullanır. Kodun büyük bir kısmı yükleme sırasında derlenir.

#### Kod Formatı

Her iki mimari de .dex (Dalvik Executable) dosya formatını kullanır.

#### Uygulama Başlangıç Süresi

Dalvik: Uygulamalar ilk çalıştırmada daha kısa sürede açılır.

ART: Uygulamalar sonraki çalıştırmalarda çok daha hızlı başlatılır.

#### Bellek Kullanımı

Dalvik: Anlık ve dinamik derleme yaptığı için daha fazla bellek tüketebilir.

ART: Uygulamaları önceden derlediği için belleği daha verimli kullanır.

#### Pil Tüketimi

Dalvik: İşlem anında derleme yaptığı için daha fazla enerji tüketebilir.

ART: Daha az işlemci kullanımı sayesinde daha az pil tüketir.

#### Güncelleme Süresi

Dalvik: Uygulama güncellemeleri daha hızlı yüklenebilir.

ART: İlk yüklemede uygulamayı derlediği için daha uzun sürebilir.

## 4. Donanım Üzerindeki Etkileri
|  |  |  |  |  | ![](/blogs/img/android-runTime/4.png) |
|--|--|--|--|--|:--:|

#### 4.1 İşlemci & Bellek Kullanımı

Dalvik, uygulamaları çalıştırırken anlık olarak derlediğinden işlemciye yoğun yük bindirir. Bu durum düşük donanımlı cihazlarda performans sorunları doğurabilir. ART ise uygulamayı önceden derlediği için işlemcinin yükünü önemli ölçüde azaltır. Ancak AOT derleme işlemi sırasında cihazın belleği ve depolama alanı daha yoğun kullanılır.

#### 4.2 Enerji Verimliliği

Dalvik, sürekli JIT derleme yaptığı için işlemcinin aktif kalmasına neden olur ve bu da pil ömrünü olumsuz etkiler. ART ise AOT yaklaşımıyla çalışma zamanında derleme ihtiyacını büyük ölçüde ortadan kaldırır, böylece pil ömrünü artırır. Özellikle hibrit derleme sayesinde, sık kullanılan işlemlerin önceden optimize edilmesi, enerji tüketimini daha da azaltır.

#### 4.3 Güncelleme ve Kurulum Süresi

Dalvik ile uygulamalar daha hızlı yüklenir ancak çalıştırma sırasında yavaşlık gözlemlenebilir. ART ise uygulamaları kurulum sırasında derlediği için yükleme süresi biraz daha uzundur, fakat bu tek seferlik gecikme, uygulama kullanımında elde edilen performansla fazlasıyla telafi edilir.

## 5. Sonuç

Android işletim sisteminin teknik altyapısında Dalvik’ten ART’a geçiş, yalnızca mimari bir değişiklik değil; aynı zamanda Android ekosisteminin daha hızlı, kararlı ve kullanıcı dostu hâle gelmesini sağlayan bir evrimdir. Dalvik, ilk nesil mobil cihazların sınırlı donanımına uygun olarak geliştirilmiş olsa da zamanla yetersiz kalmış, özellikle yüksek işlem gücü ve verimlilik beklentileri karşısında geri planda kalmıştır.

ART ise bu eksiklikleri kapatan ve modern ihtiyaçlara cevap veren güçlü bir çözüm olarak konumlanmıştır. Ahead-Of-Time (AOT) derleme sayesinde uygulamalar daha hızlı başlatılırken, hibrit yapı ile uygulama içi performans sürekli olarak iyileştirilmektedir. Bu yapı, sadece kullanıcı deneyimini artırmakla kalmaz; aynı zamanda donanım kaynaklarını daha etkin kullanarak cihazların daha uzun ömürlü olmasına katkı sağlar.

Özetle, Android Runtime (ART) mimarisi yalnızca Dalvik’in yerine geçen bir sistem değil; Android’in modern dünyadaki başarısını mümkün kılan temel yapı taşlarından biridir. Yüksek performans, düşük enerji tüketimi, verimli bellek yönetimi ve güvenli yürütme ortamı gibi avantajlarıyla, ART; Android ekosisteminin sürdürülebilirliğini ve ölçeklenebilirliğini garantileyen bir teknolojik dönüşümün adıdır.



#### Kaynakça;

-Android Developers , ART & Dalvik. https://source.android.com/devices/tech/dalvik/

-Google Developers. (2014). Introducing ART: A New Android Runtime. https://android developers.googleblog.com/2014/10/introducing-art.html

-Stack Overflow Community. (n.d.). What is the difference between Dalvik and ART? https://stackoverflow.com/questions/21389450/what-is-the-difference-between-dalvik-and-art

-https://developer.android.com/topic/performance/dalvik

