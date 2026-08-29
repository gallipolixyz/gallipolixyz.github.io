# USB Bellek Çıkarıldıktan Sonra Windows'ta Kalan İzler

![Boş USB portundan çıkarılmış bir bellek; makinede kalan dijital iz](/blogs/img/usb-bellek-windows-dijital-izler/00-kapak.jpg)

Bir USB bellek Windows sisteme takıldığında, Windows'un "Tak ve Çalıştır" (Plug-and-Play) mimarisi cihazı tanımak ve sürücülerini yüklemek için sistemin derinliklerine kalıcı kayıtlar işler. Cihaz fiziksel olarak yok edilse veya formatlansa bile, host bilgisayarda kalan bu izler dijital adli bilişim (forensics) açısından altın değerindedir.

**Bir USB bellek bilgisayardan çıkarıldıktan sonra Windows, bu cihaz hakkında hangi bilgileri saklamaya devam eder?**

Bu dijital kalıntıları analiz etmek için disk imajlarına veya karmaşık adli bilişim yazılımlarına gerek yoktur. Yalnızca Windows'un yerleşik araçlarıyla (Aygıt Yöneticisi, Kayıt Defteri, PowerShell) cihazın donanım kimliği ve bağlantı zaman damgaları okunur. Dosyanın kopyalanıp kopyalanmadığı bu izlerin konusu değildir.

Bu yazıda, bir USB cihazın sistemde bıraktığı beklenen donanım kayıtları ve arka planda sessizce tutulan veri izleri (artifacts) incelenmektedir.

## Windows bu bilgiyi neden tutar?

Gözetim için değil; hız için.

İlk takılışta sistem cihazı tanır, sürücüyü seçer, kurar, sürücü harfi atar. Bu işlem birkaç saniye sürer. Windows bu emeği her seferinde baştan yapmak istemez: kimliği ve kurulan sürücüyü not eder. Aynı bellek ikinci kez takıldığında sistem onu tanır ve neredeyse anında bağlar.

Windows, aynı cihaz tekrar takıldığında sürücü yükleme işlemini atlamak için donanım bilgilerini USBSTOR anahtarında önbellekler (PnP Cache). Bu yapının asıl amacı güvenlik logu tutmak değil, işletim sistemine hız ve verimlilik sağlamaktır. Delil diye tutulmadığı için silinmesi de çoğu zaman akla gelmez.

## Cihaz takılıyken ne görünür?

Windows'un öğrendiği temel bilgiler şunlardır: üretici (Vendor), ürün (Product), revizyon (Rev), arayüzdeki ad (Friendly Name) ve cihazı o sistemde ayıran **Device Instance ID**.

Aygıt Yöneticisi'nde **Disk sürücüleri** altında cihaza çift tıklanır; Ayrıntılar → **Aygıt örneği yolu** seçilir. Satır kabaca şöyledir:

```text
USBSTOR\Disk&Ven_XXXX&Prod_YYYY&Rev_1.00\0123456789ABCDEF&0
```

Tek satırda sınıf (`USBSTOR`), üretici, ürün, revizyon ve en sonda örnek kimliği durur. Microsoft'a göre bu kimlik, PnP yöneticisinin aygıt düğümüne verdiği, o sistemde benzersiz ve yeniden başlatmalar arasında kalıcı olan dizedir.

Aynı bilgi PowerShell'den, yönetici yetkisi olmadan da okunur:

```powershell
Get-PnpDevice -PresentOnly |
  Where-Object { $_.InstanceId -like 'USBSTOR*' } |
  Select-Object Status, Class, FriendlyName, InstanceId |
  Format-List
```

`PresentOnly` parametresi geçmişi değil, yalnızca şu an fiziksel olarak takılı olan cihazları listeler. `USBSTOR*` filtresi klasik flash bellekleri yakalar. Ancak yeni nesil USB 3.x UASP destekli harici SSD'ler sistemde genellikle USBSTOR yerine SCSI sınıfında görünür. Bir cihazın bu sorgudan dönmemesi, sisteme hiç takılmadığı anlamına gelmez.

## Asıl kalıntı: USBSTOR

Takılan USB depolama cihazlarının kaydı şurada durur:

```text
HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Enum\USBSTOR
```

Bu dizin iki katmanlı bir yapıdadır: önce cihaz modeli (`Disk&Ven_...&Prod_...&Rev_...`) listelenir, onun altında ise cihaza ait spesifik örnek bulunur.

![Kayıt Defteri'nde USBSTOR altında ASMT 2105 USB Device kaydı](/blogs/img/usb-bellek-windows-dijital-izler/01-regedit-usbstor.png)

Yogesh Khatri'nin 2013'te belgelediği üzere, Windows 8'den itibaren zaman damgaları şu özelliklerde tutulur:

| Anahtar | Resmî ad | Anlamı |
|---|---|---|
| 0064 | InstallDate | Son kurulum / sürücü güncellemesi |
| 0065 | FirstInstallDate | Bu makinede ilk tanınma |
| 0066 | LastArrivalDate | Son takılma |
| 0067 | LastRemovalDate | Son çıkarılma |

Registry'de ham 64-bit FILETIME (UTC) formatında duran bu veri, PowerShell ile doğrudan okunabilir biçimde çekilir. `InstallDate`, sürücü güncellemesi sonrasında değişebileceği için ilk karşılaşma zamanı olarak `FirstInstallDate` ile karıştırılmamalıdır.

```powershell
$id = (Get-PnpDevice -PresentOnly |
  Where-Object { $_.InstanceId -like 'USBSTOR*' }).InstanceId

Get-PnpDeviceProperty -InstanceId $id -KeyName `
  DEVPKEY_Device_FirstInstallDate, `
  DEVPKEY_Device_LastArrivalDate, `
  DEVPKEY_Device_LastRemovalDate |
  Select-Object KeyName, Data
```

![PowerShell çıktısı: FirstInstallDate, LastArrivalDate ve boş LastRemovalDate](/blogs/img/usb-bellek-windows-dijital-izler/02-deviceproperty.png)

## Sistem davranışları

Zaman damgası davranışları pratikte şöyledir:

- Cihaz **takılınca** LastArrivalDate yazılır, LastRemovalDate **silinir**.
- Cihaz **çıkarılınca** (güvenli kaldırılsa da kablosu doğrudan çekilse de) LastRemovalDate yazılır. Bu damga cihazın "temiz çıkarıldığını" kanıtlamaz.
- USB takılıyken makine kapanırsa LastRemovalDate güncellenmez.
- USB takılıyken bilgisayar yeniden başlatılırsa, Windows bunu yeni bir varış sayar ve LastArrivalDate yenilenir.

Yani "son takılma" her zaman belleğin fiziken el ile takıldığı an değildir; eğer sistemin boot edilme zamanına çok yakınsa, cihaz zaten önceden takılı olabilir.

## İlk tanınma: setupapi.dev.log

Registry "şu an ne bilindiğini" gösterir. SetupAPI günlüğü "bunun ne zaman öğrenildiğini" anlatır.

Microsoft'a göre PnP yöneticisi cihaz ve sürücü kurulumunu şu düz metin dosyaya yazar:

```text
C:\Windows\INF\setupapi.dev.log
```

Dosya Not Defteri ile açılır. Zaman damgaları **yerel saat**tir — Registry'deki UTC'den farklıdır.

```powershell
Select-String -Path C:\Windows\INF\setupapi.dev.log -Pattern 'USBSTOR' -Context 2,6 |
  Select-Object -Last 3
```

![setupapi.dev.log içinde USBSTOR kurulum kaydı, 22:35:58.585](/blogs/img/usb-bellek-windows-dijital-izler/03-setupapi-dev-log.png)

## Küçük bir deney: tak, çıkar, bak

Sistemde hiçbir şey silinmez, hiçbir ayar değiştirilmez. Yalnızca arka planda olan bitene bakılır.

**1. USB takılı değilken:** Öncelikle USB bellek bilgisayara takılı değilken PowerShell üzerinden şu iki komut çalıştırılır:

```powershell
Get-PnpDevice -PresentOnly |
  Where-Object { $_.InstanceId -like 'USBSTOR*' } |
  Select-Object FriendlyName, InstanceId

Get-ChildItem 'HKLM:\SYSTEM\CurrentControlSet\Enum\USBSTOR' |
  Select-Object PSChildName
```

![USB takılı değilken USBSTOR dizininde duran cihaz listesi](/blogs/img/usb-bellek-windows-dijital-izler/04-usbstor-listesi.png)

Birinci komut yalnızca *şu an fiziksel olarak bağlı olan* cihazları listeler. İkinci komut ise Registry'den bu makineye *bir zamanlar* tanıtılmış USB depolama cihazı **modellerini** döker; spesifik örnek kimlikleri her modelin altındaki alt anahtarlardadır. Bu listede adını hiç tanımadığınız cihazların çıkması son derece sık görülen bir durumdur.

**2. Temas anı:** Bellek takılır ve içindeki dosyalara kesinlikle dokunulmaz. Sadece sürücü harfi gelene kadar beklenir. Eğer cihaz çok hızlı bağlanıp hazır hale geldiyse, Windows bu cihazı zaten tanıyor demektir.

**3. Zaman damgalarının gözlemlenmesi:** Yukarıdaki komutlar ve daha önce bahsedilen zaman damgası sorguları tekrar çalıştırılır. Cihaz şu an sisteme bağlı olduğu için LastArrivalDate (son takılma) damgası az önceki saati göstermelidir. Cihaz hâlâ takılı olduğu için LastRemovalDate (son çıkarılma) kısmı çoğu zaman boştur; sisteme takılınca bu geçmiş bilginin silinmesi beklenen bir durumdur.

**4. Ayrılış:** Donanım "Güvenle Kaldır" seçeneğiyle (veya kablosu doğrudan çekilerek) sistemden çıkarılır. Çıkarıldığı saat bir kenara not edilir.

**5. Geçmişin kanıtı:** USB bellek artık takılı değildir ve `PresentOnly` parametresi onu doğal olarak göstermez. Fakat cihazın o eşsiz kimliği (Instance ID) üzerinden Registry listesinde arama yapıldığında, LastRemovalDate hâlâ oradadır:

```powershell
Get-ChildItem 'HKLM:\SYSTEM\CurrentControlSet\Enum\USBSTOR' |
  Select-Object PSChildName

Get-PnpDeviceProperty -InstanceId 'BURAYA_KENDI_INSTANCE_ID' -KeyName `
  DEVPKEY_Device_LastRemovalDate |
  Select-Object KeyName, Data
```

![USB çıkarıldıktan sonra duran LastRemovalDate kaydı, 23.08.2026 00:35:22](/blogs/img/usb-bellek-windows-dijital-izler/05-lastremovaldate.png)

Bu kayıt orada durur, çünkü bu bir bağlantı durumu değil, bir **kurulum kaydıdır**. Cihazın fiziksel varlığı bu kaydı ilgilendirmez. `setupapi.dev.log` için de aynı kural geçerlidir: sistem günlükleri geçmişi silmek için yazılmaz.

FirstInstallDate ile SetupAPI aynı saniyeyi gösteriyor: 22:35:58. Yaklaşık bir saat sonra bellek yeniden takılmış (23:38:26); gece yarısından hemen sonra çıkarılmış (00:35:22). USBSTOR'da bugün dokunulmayan Cruzer Blade ve Hitachi kayıtları da duruyor — cihaz gitmiş, dizin duruyor.

## USBSTOR neyi söyler, neyi saklar?

Olay müdahalesinde (Incident Response) USBSTOR altındaki bu kayıtlar, analistin zaman çizelgesini oluştururken sorduğu üç kritik soruya doğrudan karşılık gelir:

- **Bilinmeyen cihaz (politika ihlali):** Kurum politikası harici bellekleri yasaklıyorsa, USBSTOR dizininde envanter dışı bir kimliğin görülmesi doğrudan bir ihlaldir. Burada odak nokta cihazın içinde ne olduğu veya ne yaptığı değil, yasaklı donanım sınıfının sisteme fiziksel olarak temas etmiş olmasıdır.
- **Zaman çizelgesinin (timeline) inşası:** LastArrivalDate ve LastRemovalDate damgaları, Windows Olay Günlüklerindeki oturum açma (Event ID: 4624) ve oturum kapatma (Event ID: 4634) loglarının arasına çakılan iki sağlam çivi gibidir. Cihazın takıldığı an, oturum hareketleriyle eşleştirilir.
- **Veri kopyalama şüphesi:** Bir veri sızıntısı şüphesinde bakılacak ilk duraktır. Ancak USB takıldığının ispatlanması, tek başına verinin kopyalandığını **kanıtlamaz**.

## Tek bir iz bütün olayı aydınlatmaz

Kayıt Defteri'ndeki USBSTOR dizini yalnızca şu somut gerçeği söyler: *"Bu kimliğe sahip bir donanım, bu bilgisayarda tam olarak şu saatte tanındı."*

Ancak şunları **asla söylemez**:

- Hangi dosyaların açıldığını veya kopyalandığını,
- Cihaza herhangi bir veri yazılıp yazılmadığını,
- O an klavyenin başında fiziksel olarak kimin oturduğunu.

Bir veri hırsızlığı iddiasını tam olarak kanıtlayabilmek için **.lnk (kısayol)** dosyaları, **Jump List** kayıtları, dosya sistemi kalıntıları veya **DLP** (veri kaybı önleme) günlükleri gibi diğer kanıtlarla desteklenmesi gerekir. Sistem analizinde tek bir kalıntı bütün bir hikâye olamaz; o hikâyenin sadece bir cümlesidir.

## İzler sonsuza kadar kalır mı?

Sanılanın aksine, bu izler ölümsüz değildir ve sistemin olağan akışı içinde yok olabilirler:

- **Sistem güncellemeleri:** Ilya Kobzar'ın 2021'de yaptığı testlerin gösterdiği üzere, büyük bir Windows 10 özellik güncellemesi `Enum\USBSTOR` dizinini tamamen sıfırlayabilir ve eski bağlantı kayıtlarını `Setup\Upgrade\...\DeviceMigration` yolunun altına taşıyabilir.
- **Otomatik temizlik:** David Cowen'ın 2017 tarihli notlarına göre, Windows 8.1 ve erken Windows 10 sürümlerinde bulunan "Plug and Play Cleanup" (PnP temizliği) görevi, çok uzun süre boyunca makineye takılmamış olan cihazların PnP kayıtlarını otomatik olarak silebilmektedir.

Sonuç olarak; aradığınız donanım kimliği listede yok diye, o USB belleğin bu makineye hiç takılmadığını kesin olarak iddia edemezsiniz. Olay müdahalesinin altın kuralı değişmez: **Kanıtın yokluğu, yokluğun kanıtı değildir.**

## Sonuç

Bir USB depolama cihazı bilgisayardan fiziksel olarak sökülüp çıkarıldığında, bu kayıtlar silinmez. Cihazın eşsiz kimliği USBSTOR kayıtlarında, sistemle ilk tanıştığı an `setupapi.dev.log` içinde, son takılma ve çıkarılma saatleri ise Properties altında (Registry) beklemeye devam eder. Tüm bu geçmişi gün yüzüne çıkarmak için harici bir yazılıma gerek yoktur; Windows'un kendi yerleşik araçları (PowerShell ve Regedit) yeterlidir.

Donanım ortadan kaybolmuş olsa da işletim sisteminin hafızasındaki o soğuk kanıt yaşamaya devam eder. Ancak bir adli analizcinin asıl zorluğu bu izi bulmak değil; izin nerede **sustuğunu** bilmektir.

Sistem çok net, saniyesi saniyesine bir saat verebilir; fakat tek başına bu saat, o an klavyenin başında ne olduğuna, hangi verilerin kopyalandığına veya nelerin çalındığına dair hiçbir şey söylemez. Hikâyenin geri kalanını yazmak, sistemin diğer derinliklerindeki kanıtları birleştirmeye kalır.
