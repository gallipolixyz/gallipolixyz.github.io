# Windows Güvenlik Logları ile Ransomware Taraması

Fidye yazılımı (ransomware) vakalarında sadece şifrelenmiş dosyalara bakmak, saldırının kök nedenini anlamak için yeterli değildir. Sistemler kilitlenip ortamda kaos yaşanırken bile, Windows olay günlükleri arka planda sistemdeki tüm hareketleri kaydetmeyi sürdürür.

Saldırının nereden başladığı, hangi hesabın ele geçirildiği ve şifreleme öncesi sistemde hangi hazırlıkların yapıldığı bu günlüklerde yer alır. Doğru analiz edildiğinde bu kayıtlar, saldırganın ağa nasıl sızdığını ve içerideki ilerleyişini net bir şekilde ortaya çıkarır.

Windows Security günlüğü; oturum açma, süreç (process) oluşturma ve hesap yönetimi gibi kritik olayları tutar. `Get-WinEvent` gibi PowerShell komutları ise bu büyük veri yığınını filtreleyerek, doğrudan ihtiyacımız olan anlamlı verileri hızla ayıklamamızı sağlar.

## Ransomware Saldırısı Genellikle Nasıl Gelişir?

Bir ransomware saldırısının tüm aşamaları her vakada birebir aynı görünmese de, saldırganların izlediği yol haritası genellikle aynı adımları takip eder:

Tipik bir saldırı şu adımları izler:

1. **İlk Erişim:** Phishing e-postası, ele geçirilmiş RDP veya zafiyetli servis üzerinden ağa sızılır.
2. **Yetki Yükseltme:** Sınırlı yetkili hesaptan admin haklarına çıkılmaya çalışılır.
3. **Keşif:** Ağ yapısı, kritik sunucular ve güvenlik ürünleri sessizce taranır.
4. **Kalıcılık:** Yeni hesaplar, zamanlanmış görevler veya servisler ile kalıcı erişim sağlanır.
5. **Yanal Hareket:** SMB/RDP ile diğer makinelere yayılır.
6. **Veri Sızdırma:** Şifrelemeden önce hassas veriler dışarı aktarılır (çifte şantaj).
7. **Şifreleme:** Loglar temizlenir, Shadow Copies silinir, dosyalar kilitlenir.

Basit saldırı akışı:

![Phishing veya ele geçirilmiş RDP ile başlayan yedi adımlık saldırı zinciri](/blogs/img/windows-loglari-ransomware-taramasi/01-saldiri-akisi.png)

## İz Sürme Adımı 1: Logları Korumak ve İlk Erişimi Bulmak

Sorguya dalmadan önce günlüklerin bir kopyasını almak şart. Bunun neden yapılması gerekiyor? Çünkü canlı makinede kurcaladıkça eski kayıtlar yenilerinin altında kalıyor; bir de üstüne yanlışlıkla bir şey değiştirirseniz delil bozuluyor. Analiz hep kopya üzerinden yürümeli. Aşağıdaki sorgu, yönetici olarak açtığınız PowerShell'de Security ve System günlüklerini dosyaya yazar, sonra da o dosyaların parmak izini (hash) çıkarır:

```powershell
New-Item -Path C:\IR -ItemType Directory -Force | Out-Null
wevtutil epl Security C:\IR\Security.evtx /ow:true
wevtutil epl System   C:\IR\System.evtx   /ow:true
Get-ChildItem C:\IR | Select-Object Name, Length, LastWriteTime | Format-Table -AutoSize
Get-FileHash C:\IR\Security.evtx, C:\IR\System.evtx -Algorithm SHA256 | Format-List
```

![wevtutil ile dışa aktarılan günlükler ve SHA-256 parmak izleri](/blogs/img/windows-loglari-ransomware-taramasi/02-wevtutil-hash.png)

Pratikte akış şöyle:

1. `wevtutil epl` ile logu dışa aktar.
2. `Get-FileHash` ile hash'i al, not et (tutanağa yaz, imzala).
3. İhtiyaç oldukça dosyayı tekrar hashle, ilk kayıtla karşılaştır; eşleşiyorsa delil temiz.

Kendi makinemde çalıştırdığımda iki dosyanın boyutu birebir aynı çıktı (ikisi de 21041152 bayt) ama hash'leri tamamen farklıydı. Yani "boyutu aynı, demek aynı dosya" diye düşünmeyin; parmak izi boyutla değil, o hex satırıyla doğrulanır.

> ⚠️ **Uyarı:** Security günlüğünün varsayılan boyutu çoğu kurulumda küçüktür ve sınır aşıldığında en eski kayıtların üzerine yazar. Sorguya başlamadan önce günlüğün kopyasını mutlaka alın; doğrudan canlı sistem üzerinde analiz yapmak, inceleme sürecinde yapılabilecek en kritik hatalardan biridir.

### Oturum Açma İzleri: 4625 ve 4624

Başarısız giriş denemeleri öncelikle kaynak IP adresine göre gruplandırılmalıdır. Tek bir 4625 olayı sıradan bir kullanıcı hatası olabilir; ancak aynı IP adresinden, özellikle mesai saatleri dışında yüzlerce başarısız giriş kaydediliyorsa, bu durum net bir kaba kuvvet (brute-force) saldırısı şüphesi oluşturur.

```powershell
Get-WinEvent -FilterHashtable @{LogName='Security'; Id=4625; StartTime=(Get-Date).AddDays(-3)} |
  Group-Object {$_.Properties[19].Value} | Sort-Object Count -Descending |
  Select-Object Count, Name
```

`Properties[19]` denemenin geldiği adresi gösteriyor. Çıktıda tek satırda üç haneli bir sayı görürseniz, o adres kapıyı defalarca yoklamış demektir. Bu komut kendi makinemde bomboş döndü; çünkü kendinize (127.0.0.1) yaptığınız denemeler çoğu kurulumda 4625 olayını üretmiyor ve denetim kapalıysa kayıt loglara hiç düşmüyor. Yani karşınıza çıkan boş ekran bile aslında "bu makinede bu denetim kaydedilmiyor" diyen bir bulgudur. Gerçek bir sunucuda ise aynı komutu çalıştırdığınızda ekran kayıtlarla dolar.

İşin başarılı oturum açma tarafına geçtiğimizde, odak noktamız artık Logon Type değerine kayıyor. Aşağıdaki sorgu da doğrudan Logon Type 10'u, yani çoğunlukla RDP (Uzak Masaüstü) oturumlarını hedef alarak bu kayıtları ayıklıyor.

```powershell
Get-WinEvent -FilterHashtable @{LogName='Security'; Id=4624; StartTime=(Get-Date).AddDays(-3)} |
  Where-Object {$_.Properties[8].Value -eq 10} |
  Select-Object TimeCreated, @{n='Kullanici';e={$_.Properties[5].Value}}, @{n='KaynakIP';e={$_.Properties[18].Value}}
```

Burada `Properties[8]` oturum türünü, `Properties[5]` giriş yapan kullanıcıyı, `Properties[18]` ise kaynak adresi gösteriyor. Çıktıyı bir olay zinciri gibi okuyun: az önce yığınla 4625 hatası üreten bir adres, birkaç dakika sonra Logon Type 10 ile içeri girmişse, elinizde oldukça güçlü bir ilk erişim (initial access) adayı var demektir.

## İz Sürme Adımı 2: Kalıcılık, Process ve İz Silme

İçeri giren genelde önce bir hesap açıp (4720) hemen ardından onu yönetici grubuna ekler (4732). Kendi makinemde `dfir_test` diye bir kullanıcı açıp yönetici yaptım ve ikisini tek komutta çektim:

```powershell
Get-WinEvent -FilterHashtable @{LogName='Security'; Id=4720,4732} |
  Select-Object TimeCreated, Id, Message | Sort-Object TimeCreated |
  Select-Object -Last 4 | Format-List
```

![4720 olayı: dfir_test adlı test hesabının oluşturulması](/blogs/img/windows-loglari-ransomware-taramasi/03-4720-hesap.png)

4720 olayında, işlemi gerçekleştiren kişi "Konu" tarafında, açılan yeni hesap ise "Yeni Hesap" tarafında durur. Sahada asıl sormamız gereken soru ise şudur: o saatte normalde hesap açma yetkisi olmaması gereken biri, bu log satırını üretmiş mi?

![4732 olayı: aynı hesabın yerel Administrators grubuna eklenmesi](/blogs/img/windows-loglari-ransomware-taramasi/04-4732-grup.png)

Hesabı yönetici yapınca 4732 olayı düştü; hem de 4720'den yalnızca on üç saniye sonra. Bu kadar dip dibe gelen iki kayıt, otomatik bir işlem zincirinin net bir imzasıdır. Burada dikkat edilmesi gereken kritik bir detay var: eklenen üyenin adı boş (tire) gelmiş olsa da hemen yanında hesabın değişmeyen kimlik numarası olan SID yer alıyor. Bir önceki görseldeki `dfir_test` kullanıcısının SID'i neyse, buradaki de tam olarak o. Yani isim kısmı boş geldi diye sakın "kayıt bozuk" deyip geçmeyin; SID değeri elinizde olduğu sürece izi sürmeye devam edebilirsiniz.

İşin süreç (process) tarafına geçtiğimizde ise gözler 4688 olay kimliğine, yani `powershell.exe`, `vssadmin delete shadows` veya `wevtutil cl` gibi zararlı kalıplara çevriliyor. Eğer komut satırı loglama ilkesi olaydan önce açıksa bu komutların detayı dolu gelir; aksi hâlde o alanın boş olması bile başlı başına incelenmesi gereken bir yapılandırma bulgusudur.

Saldırganların yanal hareket (lateral movement) için sıkça başvurduğu servis kurma işleminin izi, Security yerine System günlüğünde 7045 olay kimliğiyle tutulur. Özellikle Temp veya ProgramData dizinlerinden başlatılan rastgele isimli servisler güçlü bir şüphe kaynağıdır; ancak sistem güncellemelerinin de meşru servisler oluşturabileceği unutulmamalıdır. Bu nedenle hatalı bir kanıya varmamak için 7045 olayını tek başına değerlendirmemeli, mutlaka aynı saatlerdeki RDP ve süreç (process) kayıtlarıyla birlikte analiz etmelisiniz.

Zincirin ucunda 1102 durur: günlük temizlense bile "log silindi" kaydı günlüğün başına yeni satır olarak düşer ve temizliği yapan hesabı ele verir.

```powershell
Get-WinEvent -FilterHashtable @{LogName='Security'; Id=1102} | Select-Object TimeCreated, Message
```

1102 olay kimliğinin görünmemesi, logların "temizlenmediği" anlamına gelmez; kayıtlar henüz merkeze ulaşamadan silinmiş olabilir. Merkezi log toplama sistemlerinin asıl değeri tam da bu noktada ortaya çıkar.

## Zaman Çizelgesi Örneği

| Saat | Olay |
| --- | --- |
| 23:26 | 4625 – Dış IP'den art arda başarısız RDP denemeleri |
| 23:31 | 4624 – Aynı IP'den Logon Type 10 ile başarılı oturum |
| 23:44 | 4688 – Kodlanmış parametreli powershell.exe |
| 00:12 | 4720 / 4732 – Yeni hesap açıldı ve Administrators'a eklendi |
| 00:41 | 7045 – Temp dizininden çalışan şüpheli servis |
| 01:03 | 4688 – vssadmin delete shadows |
| 01:05 | 1102 – Security günlüğü temizlendi, ardından şifreleme |

Bu olay çizelgesinin (timeline) doğru kurgulanabilmesi, kayıtların temizlenmeden önce merkezi sisteme aktarılmış olmasına bağlıdır. Burada kritik bir gereksinim daha karşımıza çıkar: incelenen makinelerin saat dilimleri kesinlikle birbiriyle senkronize olmalıdır; aksi hâlde olaylar yanlış sıraya dizilir ve tüm analiz zinciri bozulur.

## Nasıl Korunuruz?

- **Günlükleri Merkeze Taşıyın:** Saldırganların yerel logları silme ihtimaline karşı, WEF veya SIEM kullanarak kayıtları anında uç noktalardan uzaklaştırıp güvenli bir merkeze aktarın.
- **Denetimi Olaydan Önce Açın:** Process Creation (4688) ve komut satırı loglama ilkeleri kapalıysa analizleriniz kör kalır. Görünürlüğü olay yaşanmadan önce sağlayın.
- **Uzak Erişimi Daraltın:** RDP'yi doğrudan internete kapatın. Tüm erişimleri VPN ve MFA arkasına alıp, kaba kuvvet (brute-force) saldırılarına karşı hesap kilitleme kuralları uygulayın.
- **Yedekleri İzole Edin:** Çevrimdışı ve değiştirilemez yedekler alın. Fidye yazılımlarının ilk adımı olan `vssadmin` veya `bcdedit` gibi araçların çalıştırılmasına mutlaka anlık alarmlar yazın.

## Sonuç

Windows olay günlükleri, bir ransomware vakasında saldırganın arkasında bıraktığı en konuşkan delil kaynağıdır. 4625'teki deneme yığını, 4624'teki şüpheli oturumlar, 4720 ve 4732'deki hesap oyunları, 7045'teki şüpheli servis kurulumu ve 1102'deki iz temizleme girişimi bir araya geldiğinde; o gecenin tablosu neredeyse kendi kendine yazılır.

Yine de bu tablonun okunabilmesi iki temel şarta bağlıdır: günlüklerin olay anında eksiksiz tutuluyor olması ve sonrasında üzerine yazılmadan (veya silinmeden) korunması. Bu iki temel yapı taşı eksikse, yazacağınız en iyi sorgu bile sadece boş bir ekrana bakar. Yani olay müdahalesinin (Incident Response) yarısı sahadaki analizse, diğer yarısı bu kayıtların varlığını çok önceden garanti altına alan o stratejik hazırlıktır.
