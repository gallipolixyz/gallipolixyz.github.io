# Off-Path Saldırılarda Sequence Number Neden Kritik?

Bir TCP paketinde kaynak IP, hedef IP ve portlar doğruysa paket otomatik olarak kabul edilir mi?
Hayır. TCP'nin güvenilir görünmesinin nedenlerinden biri, her bağlantının yalnızca adreslerden
ibaret olmamasıdır. Bağlantı boyunca gönderilen baytların nerede olduğunu da takip eder. Bu
takibin merkezinde **sequence number** bulunur.

![TCP üçlü el sıkışması ve off-path saldırganın bağlantıyı görememesi](/blogs/img/off-path-saldirilarda-sequence-numberin-onemi/off-path-tcp-sequence-diagram.png)

Bu ayrıntı özellikle *off-path* (kör) saldırılarda önem kazanır. Saldırgan hedef ile istemci
arasındaki trafiği göremiyorsa; doğru IP ve port değerlerini bilse bile, alıcının o anda
beklediği TCP durumunu tahmin etmek zorundadır. Sequence number'ın öngörülemez olması, bu
tahmini pratikte çok zorlaştırır.

## TCP sadece "kimden geldi?" diye bakmaz

TCP bağlantısı çoğu zaman şu dört değerle anlatılır:

```text
kaynak IP : kaynak port → hedef IP : hedef port
```

Bu dört değer bağlantıyı tanımlar; fakat tek başına paketin geçerli olduğunu kanıtlamaz.
TCP, güvenilir ve sıralı bir bayt akışı sunmak için gönderilen her bayta sıra numarası verir.
Alıcı, gelen segmentin sıra numarasını kendi beklediği aralıkla karşılaştırır. Uygun değilse
segment yararlı veri olarak işlenmez.

Basitleştirilmiş bir örnek düşünelim. Bir alıcı sıradaki bayt için `5000` değerini bekliyor
olsun. `5000` ile başlayan ve pencere içinde kalan bir segment anlamlı olabilir; çok eski ya da
çok ilerideki bir değer ise bağlantının mevcut durumu ile uyuşmaz. ACK numarası da karşı tarafın
hangi bayta kadar ulaştığını ifade ederek bu iki yönlü muhasebenin parçası olur.

Bu mekanizma sadece performans için yoktur. Kayıp, yinelenmiş ve sırası değişmiş paketlerin
doğru ele alınmasını sağlar. TCP'nin tanımında sıra numaraları; sıralamayı korumak ve tekrarları
ayıklamak için kullanılır. Aynı özellik, bağlantı durumunu bilmeyen birinin geçerli segment
üretmesini zorlaştıran bir bariyere dönüşür.

## On-path ve off-path farkı

Bir saldırıyı anlamak için önce saldırganın ne görebildiğini ayırmak gerekir.

- **On-path saldırgan**, trafiğin üzerinden geçtiği yerde bulunur veya trafiği gözlemleyebilir.
  Geçerli sequence ve ACK değerlerini paketlerden okuyabilir. Bu yüzden problem tahmin değil,
  trafiğe erişim ve zamanlamadır.
- **Off-path saldırgan**, iki uç arasındaki paketleri göremez. Hedefe paket gönderebilir ama
  kurbanın son aldığı paketi, bağlantının hangi aşamada olduğunu ve güncel sıra değerini
  doğrudan bilemez.

İkinci durumda IP adresi ve portu taklit etmek yeterli değildir. Saldırganın, hedef TCP
yığınının kabul edeceği bir sequence-number penceresine denk gelmesi gerekir. 32 bitlik sıra
numarası uzayı, rastgele denemeyi kötü bir bahis hâline getirir. Kabul penceresi büyüdükçe tek
bir kör tahminin şansı artar; yine de doğru değeri görmek yerine tahmin etmek, saldırının
temel kısıtıdır.

Burada önemli bir nüans var: Sequence number bir kimlik doğrulama mekanizması değildir. TCP
tasarlanırken hedef, paket teslimini güvenilir kılmaktı. Ancak öngörülemez başlangıç sıra
numaraları, kör sahteciliğe karşı anlamlı ek direnç sağlar. Bu nedenle modern öneriler başlangıç
sıra numaralarının tahmin edilemez üretilmesini özellikle vurgular.

## Üçlü el sıkışma bu resimde nereye oturuyor?

TCP bağlantısı kurulurken üçlü el sıkışma gerçekleşir:

```text
İstemci → Sunucu: SYN, seq = x
Sunucu  → İstemci: SYN-ACK, seq = y, ack = x + 1
İstemci → Sunucu: ACK, ack = y + 1
```

Buradaki `x` ve `y`, iki tarafın başlangıç sequence number'larıdır. Her iki taraf da bundan
sonra karşı tarafın akışında hangi baytı beklediğini bilir. Trafiği gören biri bu değerleri
okuyabilir; görmeyen biri için ise bağlantı durumunun önemli bir kısmı karanlıktır.

Tarihsel olarak TCP sequence number'larının tahmin edilebilir olması ciddi bir problemdi.
1990'lardaki Kevin Mitnick vakası, IP sahteciliği ile TCP sıra numarası tahmininin güvenlik
tarihindeki en bilinen örneklerinden biridir. Buradaki ders "TCP kırıldı" değildir. Ders,
protokoldeki küçük ve tahmin edilebilir durum değerlerinin; güven ilişkileri veya zayıf ağ
varsayımlarıyla birleşince büyük etki yaratabilmesidir.

DNS'teki Kaminsky sınıfı saldırılar da aynı düşünceyi başka bir protokole taşır: Saldırganın
doğru anda doğru tahmin edilemez değeri tutturması gerekir. DNS'te bu genellikle transaction
ID ve kaynak port kombinasyonuydu; TCP'de bağlantının sıra durumu kritik değerlerden biridir.
Protokoller farklıdır, ama savunma sezgisi aynıdır: Tahmin edilmesi gereken alanın entropisini
artırmak saldırganın işini zorlaştırır.

## Sequence number neden tek başına yeterli değil?

Bir paketin kabulü TCP state machine'e bağlıdır. Bağlantının durumu, bayraklar (`SYN`, `ACK`,
`RST`, `FIN`), sequence number, ACK number ve alıcının penceresi birlikte değerlendirilir.
Dolayısıyla "doğru sequence number = her şey mümkün" gibi bir sonuç doğru değildir.

Öte yandan sırayı doğru tahmin etmek, bazı kör paket sahteciliği senaryolarında en zor
parçalardan biri olabilir. Özellikle bağlantıyı bozmayı hedefleyen sahte `RST` paketleri veya
akışa veri yerleştirme girişimleri, alıcının kabul koşullarına çarpar. Bu koşullar işletim
sistemi ve RFC güncellemeleriyle daha sıkı hâle getirilmiştir.

RFC 5961, TCP'nin kör *in-window* saldırılara karşı dayanıklılığını artırmak için ek davranışlar
tanımlar. Örneğin şüpheli reset segmentlerini doğrudan kabul etmek yerine bağlantının diğer
ucundan doğrulama istemeyi önerir. Bu, bir doğru tahminin etkisini her durumda sıfırlamaz;
ancak tek paketlik kör denemelerin bağlantıyı kolayca koparmasını zorlaştırır.

## Savunma tarafında ne yapılır?

Sequence number güvenliği tek başına yapılandırılan bir özellik değildir; işletim sistemi TCP
yığını, ağ mimarisi ve uygulama katmanı birlikte rol oynar.

1. **Güncel TCP yığını kullan.** Modern işletim sistemleri başlangıç sıra numaralarını
   öngörülemez üretme ve anormal reset davranışlarını sıkılaştırma konusunda eski
   uygulamalardan daha iyi durumdadır. Eski veya destek dışı ağ cihazları bu nedenle ayrıca
   risk değerlendirmesine girmelidir.
2. **Şifreleme ve uç doğrulama kullan.** TLS, TCP akışına anlamlı uygulama verisi enjekte
   edilmesini çok daha zorlaştırır; saldırgan geçerli bir TCP segmentine denk gelse bile
   uygulama katmanındaki bütünlük kontrolünü aşması gerekir. Bu, TCP reset kaynaklı hizmet
   engelleme etkisini tamamen çözmez ama veri gizliliği ve bütünlüğü için kritiktir.
3. **Saldırı yüzeyini küçült.** Gereksiz açık servisler, düz metin yönetim protokolleri ve
   geniş ağ erişimi hem gözlem hem de sahtecilik fırsatlarını artırır. Segmentasyon, güvenlik
   duvarı kuralları ve yönetim düzlemini ayırmak burada temel kontrollerdir.
4. **Anomaliyi izle.** Beklenmeyen TCP reset artışları, kısa ömürlü bağlantı patlamaları veya
   normal profilin dışındaki oturum kesintileri incelenmelidir. Tek başına bir RST saldırı
   kanıtı değildir; ağ görünürlüğü, sunucu logları ve uygulama hataları birlikte okunmalıdır.


## Sonuç

Off-path saldırganın en büyük problemi, hedef bağlantının içine bakamamasıdır. TCP sequence
number'ları bu görünmezliği saldırgan aleyhine kullanır: Doğru IP ve port bilgisi, geçerli bir
TCP segmenti üretmeye yetmez; segmentin bağlantının o anki durumuyla da uyuşması gerekir.

Bu yüzden sequence number'ı yalnızca CCNA'da ezberlenen bir header alanı gibi görmemek lazım.
TCP'nin güvenilirlik mekanizmasının parçasıdır; aynı zamanda kör paket sahteciliğine karşı
savunmanın da önemli bir katmanıdır. Modern TCP davranışı, TLS, ağ segmentasyonu ve izleme
birlikte kullanıldığında bu tür saldırıların hem olasılığı hem de etkisi ciddi biçimde azalır.

## Kaynaklar

- [RFC 9293 — Transmission Control Protocol](https://www.rfc-editor.org/rfc/rfc9293)
- [RFC 6528 — Defending against Sequence Number Attacks](https://www.rfc-editor.org/rfc/rfc6528)
- [RFC 5961 — Improving TCP's Robustness to Blind In-Window Attacks](https://www.rfc-editor.org/rfc/rfc5961)
