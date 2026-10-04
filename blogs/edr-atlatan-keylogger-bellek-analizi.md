# EDR Alarm Vermediğinde Keylogger'ı Bellek Dökümünde Aramak

![EDR alarm vermediğinde keylogger'ı bellek dökümünde aramak](/blogs/img/edr-atlatan-keylogger-bellek-analizi/00-kapak.png)

Endpoint Detection and Response (Uç Nokta Tespit ve Yanıt) - EDR çözümleri, modern uç nokta güvenliğinin merkezinde yer almaktadır. Bu sistemler; süreçleri, dosya işlemlerini, kayıt defteri değişikliklerini, sürücü yüklemelerini, ağ bağlantılarını ve API davranışlarını izleyerek şüpheli aktiviteleri tespit etmeye çalışmaktadır. Ancak bir EDR çözümünün alarm üretmemesi, sistemde herhangi bir zararlı aktivite bulunmadığı anlamına gelmemektedir. Zira bir saldırgan, user-mode hook'larını (kancalarını) atlayabilir, meşru bir sürecin içerisine zararlı kod enjekte edebilir, sistemde fileless olarak çalışabilir veya tespit mekanizmalarını kısmen körleştirerek telemetri akışını bozabilir.

Tam bu noktada bellek analizi ihtiyacı doğmaktadır. Saldırının en net ve güncel hali doğrudan RAM üzerinde çalıştığı için yalnızca diskteki dosyalara, Event Log'lara veya EDR konsoluna bakmak her zaman yeterli olmamaktadır. Alınan bir memory dump (bellek dökümü); sistemin o anki süreçlerinin, yüklenmiş modüllerinin, sanal bellek bölgelerinin, ağ soketlerinin ve bir keylogger'ın bellekte tuttuğu geçici buffer alanlarının açıkça incelenebilmesini mümkün kılmaktadır.

![EDR'ın gördüğü ile belleğin gördüğü](/blogs/img/edr-atlatan-keylogger-bellek-analizi/01-edr-vs-memory.png)

Bu yazıda, "EDR alarmı üretmeyen bir keylogger bellek dökümünde nasıl bulunur?" sorusu, gerçek bir laboratuvar çalışması üzerinden ele alınmaktadır. Çalışma kapsamında; Windows 11 25H2 (build 26100) sürümü çalışan ve internete kapalı olan bir sanal makine üzerinde zararsız bir "Silenci" simülatörü çalıştırılmış, ardından sistemin memory dump'ı alınarak Volatility 3 aracı ile izler tespit edilmiştir. Metnin temel amacı okuyucuya yalnızca standart bir komut listesi sunmak değil; elde edilen hangi bulgunun neyi kanıtlayıp neyi kanıtlamadığını, analiz sırasında karşılaşılan gerçek sorunları ve bir güvenlik analistinin bulgular arasında neden korelasyon yapması gerektiğini göstermektir.

## Çerçevenin Netleştirilmesi: Bypass (Atlatma) Kavramı

Analize geçmeden önce başlıkta yer alan "EDR atlatan" ifadesinin teknik olarak detaylandırılması gerekmektedir. Zira bu bağlamda karşılaşılabilecek üç farklı senaryo bulunmaktadır:

- EDR'ın alarm üretmemesi: Zararlı davranışın, sistemdeki mevcut detection rules (tespit kuralları) setine takılmaması durumu.
- EDR'ın engelleme yapmaması: Zararlı aktivitenin tespit edilmesine rağmen, sistemdeki mevcut policy yapılandırması gereği sensörün allow/audit (izin ver/denetle) modunda bulunması.
- EDR sensörünün bozulması veya kör edilmesi: Sistemdeki hook'ların (kancaların) kaldırılması, ETW/AMSI/telemetri veri akışlarının bastırılması veya doğrudan kernel seviyesinde koruma mekanizmalarına müdahale edilmesi.

Bellek analizi tek başına, "EDR neden alarm vermedi?" sorusuna kesin bir yanıt sunmamaktadır. Ancak, "sistemde o an şüpheli bir input-capture (girdi yakalama) izi bulunup bulunmadığı" sorusuna son derece güçlü yanıtlar verebilmektedir.

Bu noktada önemli bir ayrımın da vurgulanması gerekmektedir: Bir keylogger aktivitesi, yalnızca SetWindowsHookEx kullanımı anlamına gelmemektedir. Windows işletim sistemlerinde klavye verilerine erişebilmek için birden fazla yöntem bulunmaktadır:

- SetWindowsHookEx aracılığıyla low-level keyboard hook (düşük seviyeli klavye kancası) kurmak.
- GetAsyncKeyState ve GetKeyState gibi API'ler aracılığıyla polling (sürekli sorgulama) işlemleri gerçekleştirmek.
- RegisterHotKey kullanılarak global hotkey (genel kısayol tuşu) kaydı oluşturmak.
- Raw Input API (Ham Girdi API'si) aracılığıyla HID (Human Interface Device - İnsan Arayüz Cihazı) donanımlarından doğrudan veri toplamak.
- Kernel seviyesinde klavye driver stack (sürücü yığını) yapılarına müdahale etmek.

![Klavye verisine erişim mekanizmaları](/blogs/img/edr-atlatan-keylogger-bellek-analizi/02-keylogger-mechanisms.png)

Dolayısıyla, bellek dökümünde tek bir hook bulmak kesin bir keylogger kanıtı sayılmayacağı gibi; herhangi bir hook bulunamaması da sistemde bir keylogger olmadığı anlamına gelmemektedir.

## Senaryo: Windows 11 VM Üzerinde "Silenci"

Laboratuvar ortamının gerçekçi tutulması hedeflenmiştir. Bu doğrultuda hedef VM olarak Windows 11 25H2 (build 26100, 64-bit, 2 vCPU) kurulmuş ve sistemin internet bağlantısı kesilerek host-only (VMnet1) ağ yapılandırması kullanılmıştır. Bu yaklaşım, gerçek incident response süreçlerindeki "izole edilmiş / air-gapped makine" senaryosunu simüle etmekte ve "internete çıkamayan bir makinede bellek analizi nasıl yapılır?" sorusu üzerinden çalışmaya ek bir bağlam kazandırmaktadır.

Analiz için gerekli araçlar (Python 3.14.7, Volatility 3 2.28.2, WinPMEM), host makinede bir ISO dosyası haline getirilerek paketlenmiş ve VM'e sanal CD olarak bağlanmıştır. Offline kurulumların tamamlanmasının ardından, senaryoyu canlandırmak üzere "silenci_sim.py" adında zararsız bir Python simülatörü hazırlanmıştır.

### Simülatörün Yaptıkları

Hazırlanan script (betik), herhangi bir zararlı davranış sergilememekte; yalnızca bellek üzerinde analiz için gerekli izleri bırakmaktadır. Söz konusu simülatörün gerçekleştirdiği temel işlemler şunlardır:

1. VirtualAlloc fonksiyonu aracılığıyla 4 KB boyutunda PAGE_EXECUTE_READWRITE (RWX) yetkilerine sahip bir bellek alanı tahsis edilmektedir; bu işlem klasik bir injection izini temsil etmektedir.
2. Tahsis edilen bu bellek alanına, "MZ" karakterleriyle başlayan sahte bir PE başlığı ve aşağıdaki sahte keylogger satırları yazılmaktadır:

   ```text
   [2026-10-04 14:23:01] Chrome - Online Banking
   u s e r n a m e @ e x a m p l e . c o m
   P a s s w 0 r d ! 2 3
   [2026-10-04 14:23:47] Outlook - Inbox
   ```

3. 127.0.0.1:8443 adresi üzerinde dinleme yapan bir TCP soketi açılarak komuta kontrol (C2) sunucusu taklit edilmektedir.
4. Çalışan sürecin PID değeri ekrana yazdırılmakta ve 5 dakika boyunca beklenmektedir; memory dump bu süre zarfında alınmaktadır.

![Silenci saldırı zinciri](/blogs/img/edr-atlatan-keylogger-bellek-analizi/03-silenci-attack-chain.png)

Çalışma sırasında karşılaşılan ilk teknik sorun, script'in 64-bit Python ortamında bir "access violation" (erişim ihlali) hatası vererek çökmesi olmuştur. Bu hatanın temel sebebi, ctypes kütüphanesinin varsayılan davranış olarak VirtualAlloc fonksiyonunun dönüş değerini 32-bit tamsayı olarak kabul etmesidir. Bu eksik tanımlama nedeniyle 64-bitlik bellek adresi kırpılmakta ve memmove fonksiyonu geçersiz bir bellek adresine veri yazmaya çalışmaktadır.

Söz konusu hatanın giderilmesi ve bellek adresinin doğru işlenebilmesi için koda aşağıdaki tanımlamalar eklenmiştir:

```python
kernel32.VirtualAlloc.restype = ctypes.c_void_p
kernel32.VirtualAlloc.argtypes = [ctypes.c_void_p, ctypes.c_size_t, ctypes.c_ulong, ctypes.c_ulong]
ctypes.memmove(ctypes.c_void_p(ptr), fake_data, len(fake_data))
```

Düzeltilmiş script çalıştı ve Hedef PID: 9268 yazdı.

## Bellek Dökümü ve Sembol Sorunu

Simülatör çalışırken WinPMEM ile bellek dökümü alınmıştır: `C:\Users\1\Desktop\dump.raw` (~5.4 GB). Döküm zamanı: 2026-10-03 22:24:07 UTC (TR saatiyle 4 Ekim 01:24).

Burada karşılaşılan ikinci büyük sorun, Volatility aracının Windows çekirdeğini çözümlemek için Microsoft'un sembol sunucusundan PDB indirmek istemesi; ancak VM'de internet olmadığı için bu işlemin başarısız olmasıdır.

Çözüm olarak çevrimdışı sembol hazırlama adımları uygulanmıştır:

1. VM'deki `C:\Windows\System32\ntoskrnl.exe` dosyasının PE debug bölümünden PDB kimliği okunmuştur: ntkrnlmp.pdb, GUID C29EBFB06B78B3C020DCA66D99713F9E, age 1.
2. İnternete açık başka bir makinede bu PDB Microsoft sembol sunucusundan indirilmiş ve Volatility'nin pdbconv aracıyla ISF JSON formatına çevrilmiştir (ntkrnlmp.json).
3. JSON, ISO ile VM'e taşınmış ve `%USERPROFILE%\vol_symbols\windows\` altına konmuştur.
4. Volatility `-s "%USERPROFILE%\vol_symbols"` ile çalıştırılmıştır.

Aynı işlem tcpip.sys için de yapılmıştır (tcpip.pdb → tcpip.json), çünkü ağ bağlantılarını gösteren eklenti bu sembole ihtiyaç duymaktadır.

**Pratik ders**: İnternetsiz makinede analiz yapılacaksa semboller önceden hazırlanmalıdır. Bu, gerçek olay müdahalesinde sık karşılaşılan bir durumdur.

## Volatility 3 ile Analiz

Analiz işlemi, bellek dökümü dışarı taşınmadan doğrudan VM içerisinde gerçekleştirilmiştir. Windows işletim sisteminde vol kısayolunun argümanları bozması nedeniyle komutlar tam yol belirtilerek (`"C:\Program Files\Python314\Scripts\vol.exe" ...`) çalıştırılmıştır.

### 1. Dökümün Doğrulanması

```text
vol -f dump.raw -s "%USERPROFILE%\vol_symbols" windows.info
```

İlgili komutun çıktısında 64-bit mimari, Major/Minor 15.26100 sürümü ve 2 işlemci bilgisi teyit edilmiş olup, sembollerin başarıyla yüklendiği görülmüştür. Bu bulgular bellek dökümünün sağlam olduğunu doğrulamaktadır.

### 2. Süreç Ağacı

```text
vol -f dump.raw -s "%USERPROFILE%\vol_symbols" windows.pstree
```

Tespit edilen şüpheli süreç zinciri aşağıdaki gibidir:

```text
explorer.exe (5512)
├─ cmd.exe (9668) "C:\WINDOWS\System32\cmd.exe" /C "D:\CALISTIR.bat" 2026-10-03 22:22:50 UTC
│  └─ python.exe (9268) python "C:\Users\1\Desktop\silenci_sim.py" 2026-10-03 22:22:50 UTC
└─ cmd.exe (1736) /C "D:\DUMP_AL.bat" 22:24:06 UTC
   └─ winpmem.exe (8536) "D:\winpmem.exe" "C:\Users\1\Desktop\dump.raw" 22:24:07 UTC
```

![Volatility pstree çıktısı](/blogs/img/edr-atlatan-keylogger-bellek-analizi/04-volatility-pstree.png)

Bulgular yorumlandığında; python.exe sürecinin, CD sürücüsünden (D:) çalıştırılan bir batch dosyası aracılığıyla başlatıldığı ve komut satırı argümanlarında masaüstündeki script'in açıkça yer aldığı tespit edilmiştir. Aynı süreç ağacındaki winpmem.exe süreci ise bellek dökümünün alındığı anı göstermektedir (bu süreç analistin sistemde bıraktığı kendi izidir ve analiz raporunda açıkça belirtilmesi gerekmektedir).

### 3. Ağ Bağlantıları

Bu aşamada analizi zorlaştıran üçüncü bir problem ortaya çıkmıştır: windows.netscan eklentisi kullanılan Windows sürümünde (build 26100) boş sonuç döndürmüştür. Log kayıtlarında yer alan "Unable to find exact matching symbol file, going with latest: netscan-win10-20348-x64" uyarısından da anlaşılacağı üzere; Volatility üzerinde build 26100 sürümü için hazır bir yapı tanımı bulunmamakta, araç en yakın sürümle deneme yapmasına rağmen eşleşme sağlayamamaktadır.

Bu durum üzerine alternatif olarak windows.netstat eklentisi denenmiştir. İlk çalıştırmada "Unable to locate symbols for the memory image's tcpip module" hatası alınmış; ancak önceki adımlarda hazırlanan tcpip.pdb sembolü araca tanıtıldıktan sonra eklenti başarıyla çalışmış ve bellekten aşağıdaki kaydı çıkarmıştır:

```text
TCPv4 127.0.0.1 8443 0.0.0.0 0 LISTENING 9268 python.exe 2026-10-03 22:22:50 UTC
```

![Volatility netstat çıktısı](/blogs/img/edr-atlatan-keylogger-bellek-analizi/05-volatility-netstat.png)

Bulgular değerlendirildiğinde; süreç ağacında tespit edilen PID (9268) ve zaman damgası ile birebir örtüşen bu kayıt, simülatörün açtığı dinleme soketini bellek dökümü üzerinden kesin olarak doğrulamaktadır.

Buradan çıkarılabilecek pratik ders; yeni Windows sürümlerinde (24H2/25H2) Volatility'nin netscan gibi bazı eklentilerinin henüz desteklenmeyebileceği ve analiz sürecinin tıkanmaması adına netstat gibi alternatif eklentilerin denenmesi gerektiğidir.

### 4. Şüpheli Bellek Bölgeleri

Sürecin bellek alanlarındaki şüpheli bölgeleri tespit etmek amacıyla windows.malfind eklentisi kullanılarak aşağıdaki komut çalıştırılmıştır:

```text
vol -f dump.raw -s "%USERPROFILE%\vol_symbols" windows.malfind --pid 9268
```

Yapılan tarama sonucunda ilgili sürece ait iki adet şüpheli bellek bölgesi tespit edilmiştir:

```text
PID   Process     Start VPN       End VPN         Tag   Protection              Notes
9268  python.exe  0x1c2293a0000   0x1c2293a0fff   VadS  PAGE_EXECUTE_READWRITE  N/A
9268  python.exe  0x1c2293c0000   0x1c2293c0fff   VadS  PAGE_EXECUTE_READWRITE  MZ header
```

![Volatility malfind çıktısı](/blogs/img/edr-atlatan-keylogger-bellek-analizi/06-volatility-malfind.png)

Tespit edilen bölgeler incelendiğinde; 0x1c2293c0000 adresli bellek bölgesinin 4d 5a ("MZ") karakterleriyle başladığı görülmektedir. Dosyaya bağlı olmayan (VadS) özel ve PAGE_EXECUTE_READWRITE (RWX) yetkilerine sahip bir bellek bölgesinde PE başlığının bulunması; enjekte edilmiş kod veya reflective loading tekniklerinin tipik bir göstergesi olarak kabul edilmektedir.

Bu aşamada analistlerin dikkat etmesi gereken önemli bir false positive durumu bulunmaktadır: malfind taraması tüm süreçler üzerinde gerçekleştirildiğinde, MsMpEng.exe (Windows Defender, PID 3264) süreci için de RWX bölgelerinin listelendiği görülmektedir. Bu durum, Defender tarama motorunun normal çalışma yapısından kaynaklanan bilinen bir false positive vakasıdır ve analiz sürecinde doğru bir şekilde elenmesi gerekmektedir.

Buradan çıkarılabilecek temel pratik ders; yalnızca malfind bulgusuna rastlamanın, sistemde kesin bir keylogger bulunduğu anlamına gelmediğidir. JIT derleyiciler, güvenlik yazılımları ve erişilebilirlik araçları da meşru nedenlerle RWX bellek bölgeleri oluşturabilmektedir. Dolayısıyla, elde edilen bulguların mutlaka doğru bir bağlam içerisinde değerlendirilmesi şarttır.

### 5. Bellek Bölgesinden String Çıkarma

Klasik analiz rehberlerinde sıklıkla atıf yapılan windows.procdump eklentisinin, Volatility 3'ün güncel sürümünde bulunmadığı tespit edilmiştir. Bu durum karşısında alternatif bir yöntem izlenerek `windows.malfind --pid 9268 --dump` komutu çalıştırılmış ve şüpheli bellek bölgesi `pid.9268.vad.0x1c2293c0000-0x1c2293c0fff.dmp` isimli bir dosya olarak dışarı aktarılmıştır.

Elde edilen bu döküm dosyası üzerinde string araması gerçekleştirilmiştir. Bu aşamada dikkat edilmesi gereken önemli bir analitik detay ortaya çıkmaktadır: Bellekteki sahte şifre verisi `P a s s w 0 r d` formatında, harflerin arasında boşluklar bulunacak şekilde yer aldığından, standart bir `grep password` komutu bu veriyi eşleştirememektedir. Bu durumu aşmak amacıyla, arama desenine boşluklu yapıya uygun olan `p a s s` dizilimi de eklenmiştir.

Yapılan detaylı arama sonucunda bellekteki şu dört satırlık veriye ulaşılmıştır:

```text
[2026-10-04 14:23:01] Chrome - Online Banking
u s e r n a m e @ e x a m p l e . c o m
P a s s w 0 r d ! 2 3
[2026-10-04 14:23:47] Outlook - Inbox
```

![Bellek bölgesinden çıkarılan string kanıtları](/blogs/img/edr-atlatan-keylogger-bellek-analizi/07-strings-buffer-evidence.png)

İlgili dosyanın hexdump görünümü incelendiğinde, toplanan bu verilerin bellek alanında doğrudan "MZ" başlığının hemen arkasında (0x66 offset adresinden itibaren) açık bir şekilde konumlandığı doğrulanmıştır.

Bu adımdan çıkarılabilecek temel pratik ders; Volatility 3 mimarisinde procdump eklentisinin artık yer almadığı ve sürecin veya bellek bölgesinin dışarı aktarılması gerektiğinde amaca uygun olarak `malfind --dump`, `vadinfo --dump` veya `pslist --dump` parametrelerinin kullanılması gerektiğidir.

## Klavye Yakalama Mekanizmasının Araştırılması

Kullanılan simülatör gerçek bir keylogger olmadığından ve yalnızca bellek üzerinde sahte veriler tuttuğundan, windows.messagehooks komutu herhangi bir bulgu döndürmemiştir. Ancak bu durum, gerçek bir saldırı senaryosunda hook yapısına rastlanmayacağı anlamına gelmemektedir.

Sistemde klasik hook tabanlı bir keylogger bulunması durumunda, windows.messagehooks eklentisi aracılığıyla WH_KEYBOARD veya WH_KEYBOARD_LL gibi doğrudan klavye ile ilişkili hook türlerinin aranması gerekmektedir.

Bu noktada Microsoft dokümantasyonunda belirtilen önemli bir nüans öne çıkmaktadır: WH_KEYBOARD_LL yapısı (low-level keyboard hook), hedef uygulamaya enjekte edilen bir mekanizma değildir. Söz konusu hook, doğrudan onu kuran thread'in bağlamında çağrılmaktadır. Dolayısıyla, analiz sırasında yalnızca "tarayıcı sürecinin içerisinde şüpheli DLL (Dynamic Link Library - Dinamik Bağlantı Kitaplığı) aramak" her zaman yeterli bir yaklaşım olmayacaktır.

Ek olarak, bir low-level hook yapısı zaman aşımına uğradığı takdirde Windows işletim sistemi tarafından sessizce kaldırılabilmektedir. Bu sistem davranışı, bellek dökümünün alındığı an itibarıyla herhangi bir hook görünmemesinin, geçmişte sisteme hiç hook kurulmadığı anlamına gelmediğini açıkça göstermektedir.

Eğer messagehooks eklentisinin çıktısı temiz çıkarsa, sistemde kesinlikle bir keylogger bulunmadığı yargısına varılamamaktadır. Zira zararlı yazılımlar veri toplamak için şu alternatif yöntemlerden birini kullanıyor olabilir:

1. GetAsyncKeyState gibi API'ler kullanılarak periyodik polling işlemlerinin yapılması,
2. RegisterHotKey fonksiyonu aracılığıyla sistemde anormal sayıda global hotkey kaydının oluşturulması,
3. Raw Input API üzerinden doğrudan HID seviyesinde klavye verilerinin dinlenmesi,
4. Kernel tarafında doğrudan klavye sürücü yığınına (driver stack) müdahale edilmesi.

![Hook, polling ve Raw Input karşılaştırması](/blogs/img/edr-atlatan-keylogger-bellek-analizi/08-hook-vs-polling-vs-rawinput.png)

Bu noktada vurgulanması gereken en önemli husus; Volatility aracı içerisinde tüm bu farklı veri yakalama tekniklerini tek bir komutla tespit edebilecek sihirli bir plugin bulunmadığıdır. Dolayısıyla başarılı bir bellek analizi, elde edilen tüm bulgular arasında detaylı bir davranışsal korelasyon kurulmasını zorunlu kılmaktadır.

## Bulgu ≠ Kanıt: Korelasyon Tablosu

Aşağıdaki tablo, bellek analizinde en sık düşülen hatayı özetlemektedir: tek bir bulguyu kesin kanıt sanmak. Bu tablo okuyucuya şu mesajı vermektedir: Bellek analizi bir dedektiflik işidir; tek bir parmak izi yeterli olmamakta, parmak izinin zaman, hareket ve motif (güdü) bağlamıyla birleştirilmesi gerekmektedir.

| Gözlem | Desteklediği Yorum | Tek Başına Kanıtlamadığı Şey |
| :--- | :--- | :--- |
| `malfind` ile RWX/private bellek bölgesi | Sonradan yazılmış/enjekte edilmiş kod olasılığı | Keylogger davranışı |
| `netstat` ile dinleyen soket | Sürecin ağ üzerinden iletişim kurduğu | Tuş verisinin sızdırıldığı |
| `WH_KEYBOARD_LL` hook kaydı | Klavye olaylarını görme mekanizması | Kötü amaçlı kayıt yapıldığı |
| `GetAsyncKeyState` referansı | Tuş durumu sorgulama olasılığı | Gerçekten log tutulduğu |
| Bellekte pencere başlığı + tuş dizisi | Input-capture tamponu güçlü göstergesi | Verinin dışarı gönderildiği |
| İmzasız/Temp altında süreç | Şüpheli yürütme bağlamı | Zararlı olduğu |
| `dlllist` ile modül tutarsızlığı | Loader'dan gizlenmiş modül olasılığı | Enjeksiyonun amacı |

## Sonuç: Dört Kanıt, Aynı PID, Aynı Zaman

Tek bir bellek dökümünden, disk yüzeyine hiç bakılmadan şu bulgular kanıtlanmıştır:

- **Süreç:** python.exe (PID 9268) sürecinin, bir batch dosyası üzerinden başlatıldığı doğrulanmıştır (pstree).
- **Ağ:** İlgili sürecin 127.0.0.1:8443 portu üzerinde dinleme yaptığı tespit edilmiştir (netstat).
- **Enjeksiyon İzi:** Süreç içerisinde "MZ" başlıklı, PAGE_EXECUTE_READWRITE (RWX) yetkilerine sahip ve dosyaya bağlı olmayan özel bir bellek bölgesi bulunduğu görülmüştür (malfind).
- **Çalınan Veri:** İlgili bellek bölgesinin içerisinde sahte keylogger kayıtlarının ve kimlik bilgilerinin yer aldığı ortaya çıkarılmıştır (malfind --dump ve strings).

Elde edilen bu dört kanıt da aynı PID (9268) ve aynı zaman damgasıyla (2026-10-03 22:22:50 UTC) birbirine bağlanmaktadır. Bu durum, bellek analizinin potansiyel gücünü açıkça ortaya koymaktadır.

## Çıkarımlar

Gerçekleştirilen laboratuvar çalışmasından elde edilen pratik notlar şu şekildedir:

- Yeni Windows sürümlerinde (24H2/25H2) Volatility aracının bazı eklentileri (netscan) henüz tam olarak desteklenmediğinden, süreç tıkanıklıklarını aşmak için alternatif eklentilerin (netstat) denenmesi gerekmektedir.
- İnternet erişimi bulunmayan izole makinelerde analiz yapılacağı durumlarda, sembol dosyaları önceden hazırlanmalıdır (PDB GUID değerinin okunması, ilgili PDB dosyasının harici bir kaynaktan indirilmesi ve pdbconv aracı ile JSON formatına çevrilmesi işlemleri gibi).
- 64-bit Windows sistemlerinde ctypes kütüphanesi ile API çağrıları gerçekleştirilirken, adres kırpılmalarını önlemek adına dönüş tiplerinin (restype) tanımlanması şarttır.
- Volatility 3 mimarisinde procdump eklentisi bulunmadığı için, bellek döküm işlemlerinde malfind --dump, vadinfo --dump veya pslist --dump komutları kullanılmalıdır.
- Kullanılan analiz araçları (örneğin winpmem) bellek dökümünde kendi süreç izlerini bırakmaktadır; karışıklığı önlemek adına bu durumun analiz raporunda açıkça belirtilmesi elzemdir.
- malfind eklentisi false positive sonuçlar üretebilmektedir; zira Windows Defender gibi meşru güvenlik süreçleri de normal davranışları gereği RWX bölgeleri oluşturabilmektedir.

Çalışmadan çıkarılabilecek en temel sonuç şudur: "Dosyasız" veya "EDR atlatan" zararlı yazılımlar gerçekte tamamen izsiz değildir; yalnızca izlerini disk üzerinde değil, doğrudan bellek üzerinde bırakmaktadırlar. Volatility 3 gibi analiz araçları, bu izlerin okunabilmesi için bir mercek görevi görmektedir. Ancak bu merceğin doğru yapılandırılmadığı takdirde (sembollerin doğru ayarlanması, uygun eklenti seçimi ve false positive elemesi gibi adımlar eksik bırakıldığında) analiste net bir görüntü sunamayacağı unutulmamalıdır.
