# NTDS.dit Nedir? Active Directory Veritabanının Güvenlik Önemi


> ⚠️ Bu yazı **eğitim ve savunma** amaçlıdır. Buradaki bilgileri yalnızca kendi sahip olduğunuz veya yazılı izin aldığınız sistemlerde deneyin.

---





## Active Directory nedir?

Bir şirketin 500 çalışanı, 500 bilgisayarı ve onlarca sunucusu olduğunu düşünün. Şu sorulara birinin cevap vermesi gerekir:

- Bu kişi gerçekten çalışan mı?
- Parolası doğru mu?
- Bu dosyaya girmeye yetkisi var mı?

İşte bu işi **Active Directory (AD)** yapar. Microsoft'un geliştirdiği AD, şirket ağının **"kimlik ve yetki merkezi"dir**. Kapıdaki güvenlik görevlisi gibi, herkesin kimliğini kontrol eder ve kimin nereye girebileceğine karar verir.

Peki bu "kimlik kayıtları" fiziksel olarak nerede duruyor?

---

## NTDS.dit nedir?

AD'yi bir şehrin **nüfus müdürlüğü** gibi düşünün. Müdürlüğün binası var, memurları var, ama en önemli şey **kayıt defteri**dir. Herkes kim, hangi kayıt kime ait, orada yazar.

![Active Directory nüfus müdürlüğü, NTDS.dit ise onun defteridir](/blogs/img/ntds-dit-active-directory/01-nufus-mudurlugu.png)

İşte **`NTDS.dit`** bu defterdir. Teknik olarak Active Directory'nin **veritabanı dosyasıdır**.

İsmi nereden geliyor?

- **NTDS** = *NT Directory Services* (NT Dizin Hizmetleri)
- **dit** = *Directory Information Tree* (Dizin Bilgi Ağacı)

Önemli birkaç bilgi:

| Konu | Açıklama |
|---|---|
| **Kimde bulunur?** | Domain Controller (DC) denen sunucularda. DC, AD'nin çalıştığı ana sunucudur. |
| **Dosya türü** | ESE adlı bir veritabanı motoru kullanır (Microsoft Exchange de aynısını kullanır). |
| **Çalışırken** | Sistem açıkken dosya "kilitli" tutulur, sıradan bir kopyala-yapıştırla alınamaz. |
| **Kopyaları** | Şirkette birden fazla DC varsa hepsinde aynı defterin bir kopyası vardır ve kendi aralarında sürekli eşitlenir. |

---

## Nerede duruyor?

Varsayılan olarak Domain Controller'ın şu klasöründe bulunur:

```
C:\Windows\NTDS\ntds.dit
```

Aynı klasörde yardımcı dosyalar da vardır:

| Dosya | Ne işe yarar? (basitçe) |
|---|---|
| `ntds.dit` | Asıl defter |
| `edb.log` | "Yapılan değişikliklerin not defteri". Elektrik kesilirse defterin bozulmasını önler |
| `edb.chk` | "Şu ana kadar nereye kadar işledik?" işareti |
| `temp.edb` | Geçici çalışma dosyası |
| `res1.log`, `res2.log` | Disk dolarsa güvenli kapanış için ayrılmış yedek alan |

Gerçek konumu kendi DC'nizde şu komutla görebilirsiniz:

```powershell
Get-ItemProperty "HKLM:\SYSTEM\CurrentControlSet\Services\NTDS\Parameters" |
    Select-Object "DSA Database file", "Database log files path"
```

---

## Defterin içinde neler yazıyor?

Defter bir **dosya dolabı** gibidir. Çekmecelerinde şirketin tüm kimlik bilgileri bulunur:

![NTDS.dit içindeki bilgiler: kullanıcılar, bilgisayarlar, gruplar, parola izleri ve yetkiler](/blogs/img/ntds-dit-active-directory/02-defterin-icinde-ne-var.png)

- **Kullanıcılar:** Kim var? Hesap adı, hesabın açık mı kapalı mı olduğu...
- **Bilgisayarlar:** Ağa bağlı tüm bilgisayar ve sunucular.
- **Gruplar:** Kim hangi ekipte? (Örneğin "Muhasebe", "Yöneticiler")
- **Parola izleri:** Parolaların kendisi değil, **karıştırılmış hâli** (bir sonraki bölümde anlatıyoruz).
- **Yetkiler:** Kim hangi dosyayı açabilir, hangi ayarı değiştirebilir?

Ayrıca iki özel kayıt daha var: **`krbtgt` hesabı** (şirketin "dijital pasaport basma makinesi" diyebiliriz, birazdan göreceğiz) ve **güven ilişkileri** (başka şirket ağlarına hangi izinlerle bağlı olduğumuz).

**Önemli nokta:** Bu bilgilerin **hepsi tek bir yerde** durur. Bu, işimizi kolaylaştırır ama aynı zamanda bu dosyayı çok değerli yapar.

---

## Parolalar nasıl saklanır?

Güvenlik açısından ilk kural: Parolalar **düz yazı olarak saklanmaz**. Eğer saklansaydı, defteri açan herkes tüm parolaları okuyabilirdi.

Bunun yerine şu olur:

![Parola karıştırıcıdan geçip hash'e dönüşür, üstüne bir kilit daha vurulur](/blogs/img/ntds-dit-active-directory/03-parola-nasil-saklanir.png)

1. Kullanıcı parolasını yazar (örneğin `Parolam123`).
2. Parola bir **karıştırıcıdan** geçer. Buna **hash** denir. Çıkan sonuç `8f3a9c1e...` gibi anlamsız bir harf-rakam dizisidir. Bu işlem **tek yönlüdür**: Parolayı hash'e çevirmek kolay, hash'ten parolayı geri bulmak çok zordur.
3. Çıkan iz, defterde saklanmadan önce **bir kilitle daha korunur**. Bu kilit, sunucunun başka bir dosyasında (SYSTEM kayıt defteri) saklanan **boot key** adlı anahtarla açılır.

Kulağa çok güvenli geliyor, değil mi? Ama şu detaya dikkat:

> **Kilit ile defter aynı sunucuda durur.** Yani sunucuya yönetici yetkisiyle giren biri, hem defteri hem de kilidin anahtarını alabilir. Bu koruma, defterin yanlışlıkla bir yere sızmasına karşı bir önlemdir. **Yetkili bir saldırganı durdurmak için tasarlanmamıştır.**

Üstelik bir hash ele geçirilse bile saldırgan onu **tahmin yoluyla kırmayı** deneyebilir. Bazı durumlarda ise hash'in kendisi, parolanın yerine geçebilir (buna *Pass-the-Hash* denir). Yani hash'in ele geçmesi bile başlı başına risktir.

---

## Defter çalınırsa neden büyük sorun?

Şöyle düşünün: Defterin bir kopyası kötü birinin eline geçti. Bu, **binadaki bütün kapılara uyan bir anahtar demeti** vermek gibidir.

![Defterin kopyası, ağdaki tüm hesapların anahtarı gibidir](/blogs/img/ntds-dit-active-directory/04-ana-anahtar.png)

Bunun üç büyük sonucu olur:

### 1. Hepsi birden ifşa olur
Tek tek bilgisayarlara sızmaya gerek kalmaz. Yöneticiler, normal çalışanlar, servis hesapları... Hepsinin parola izleri tek seferde eline geçer.

### 2. Kalıcı olur
Önceki bölümde bahsettiğimiz **`krbtgt`** hesabı, ağdaki "dijital pasaportları" (Kerberos biletleri) imzalayan hesaptır. Saldırgan bu hesabın anahtarını ele geçirirse **kendi sahte pasaportunu basabilir** (buna *Golden Ticket*, "altın bilet" denir). Üstelik kullanıcılar parolalarını değiştirse bile bu bilet, `krbtgt` yenilenene kadar çalışmaya devam edebilir.

### 3. Domain tamamen ele geçirilir
Her hesabı kontrol eden biri için artık ağın tamamı açık demektir. Bu durumdan çıkmak çok zordur: Tüm parolaların yenilenmesi gerekir, kötü senaryoda ağın baştan kurulması gerekebilir. Bu da çok pahalı ve uzun bir süreçtir.

---

## Saldırgan defteri nasıl ele geçirmeye çalışır?

Savunmayı iyi kurmak için karşı tarafın ne denediğini bilmek gerekir. Bu davranış, siber güvenlik dünyasında **MITRE ATT&CK** kataloğunda **T1003.003** (NTDS) ve **T1003.006** (DCSync) başlıkları altında anlatılır.

Çok basitleştirirsek üç ana yol vardır:

![Saldırganın defteri ele geçirmek için denediği üç yol](/blogs/img/ntds-dit-active-directory/05-saldirgan-yollari.png)

| Yol | Benzetme | Gerçekte ne olur? |
|---|---|---|
| **Yedeği çalmak** | Müdürlüğün arşiv odasından defterin fotokopisini almak | DC'nin yedek dosyalarına ulaşmak. Yedekler genelde daha az korunur. |
| **Sanal disk kopyası** | Defterin durduğu dolabın komple fotoğrafını çekmek | Sanal DC'lerde sanal diskin (VHD/VMDK) kopyasını almak |
| **Sahte memur (DCSync)** | Telefon açıp "ben başka şubenin memuruyum, bana kayıtları gönderin" demek | Saldırgan, DC gibi davranarak başka bir DC'den kimlik bilgilerini "eşitleme" bahanesiyle ister. **Dosyaya hiç dokunmaz.** |

Hepsinin ortak noktası: **Yüksek yetki gerektirir.** Yani saldırgan genellikle bu aşamaya gelmeden önce başka bir yerde yönetici yetkisi kazanmış olmalıdır. Bu bizim için iyi haber: **O noktaya gelene kadar onu yakalama şansımız var.**

> 💡 Üçüncü yolda dosyaya dokunulmadığı için "dosyayı koruyorum, güvendeyim" demek yetmez. **Kimin "eşitleme isteme" hakkı olduğunu** da kontrol etmek gerekir. Bu konuya aşağıda döneceğiz.

---

## Nasıl korunuruz?

Tek bir kilit yerine **katman katman** düşünmek en sağlıklısıdır. Soğan gibi: Dıştan içe doğru her katman, saldırganın işini zorlaştırır.

![Savunma halkaları: az yetki, güvenli yedek, sağlam sunucu, güçlü parola, izleme](/blogs/img/ntds-dit-active-directory/06-savunma-halkalari.png)

### 1. Az yetki (en dış halka)
- **Domain Admins**, **Enterprise Admins**, **Backup Operators** gibi güçlü grupların üye sayısını olabildiğince az tutun.
- Yöneticiler günlük işler (e-posta, internet) için **ayrı, yetkisiz bir hesap** kullansın. Yönetim işi için ayrı hesap kullansın.
- **Tier modeli** uygulayın: Çok kritik sunucuları (DC gibi) yöneten hesaplar, yalnızca kritik makinelerde oturum açsın. Bir yönetici, sıradan bir iş istasyonunda oturum açarsa o bilgisayar da risk altına girer.

**Bonus kontrol:** "Eşitleme isteme" haklarına kimin sahip olduğunu görün. Bu haklar normalde yalnızca DC'lerde olmalıdır:

```powershell
Import-Module ActiveDirectory

$domainDN = (Get-ADDomain).DistinguishedName
$replGuids = @(
    '1131f6aa-9c07-11d1-f79f-00c04fc2dcd2',  # Replikasyon: değişiklikleri al
    '1131f6ad-9c07-11d1-f79f-00c04fc2dcd2'   # Replikasyon: tüm değişiklikleri al
)

(Get-Acl "AD:$domainDN").Access |
    Where-Object { $replGuids -contains $_.ObjectType.ToString() } |
    Select-Object IdentityReference, ActiveDirectoryRights, AccessControlType
```

Listede **tanımadığınız** bir kullanıcı veya grup görürseniz bu ciddi bir bulgudur. Bu komut sadece okuma yapar, hiçbir şeyi değiştirmez.

### 2. Güvenli yedekler ve sanal diskler
- DC yedekleri, içinde defterin kopyasını barındırır. Yedek sunucusunu **DC kadar önemli** kabul edip koruyun: erişimi kısıtlayın, yedekleri şifreleyin.
- Sanal DC'lerde, sanal sunucuyu yöneten kişi (hipervizör yöneticisi) aslında DC'nin de yöneticisi sayılır. Bu erişimi dar tutun.
- Fiziksel DC'lerde (özellikle şube ofislerinde) **BitLocker** ile disk şifreleme kullanın.

### 3. Sağlam sunucu (DC)
- DC'de yalnızca gerekli roller çalışsın. Tarayıcı, ofis programı, gereksiz servis olmasın.
- Güncellemeleri zamanında yapın.
- Uzaktan erişimi yalnızca yönetim ağından ve özel yönetim bilgisayarlarından kabul edin.
- Antivirüs / EDR çözümü DC'lerde de çalışsın.

### 4. Güçlü parolalar
- **Uzun** parolalar (14+ karakter, yöneticiler için daha uzun) kullanın.
- Her bilgisayarda **farklı** yerel yönetici parolası için **Windows LAPS** kullanın. Böylece bir bilgisayardan çalınan parola diğerlerinde işe yaramaz.
- Servis hesapları için elle parola yerine **gMSA** (otomatik yönetilen hesap) tercih edin.
- `krbtgt` parolası **düzenli aralıklarla** yenilenmeli, olası bir ihlalde **iki kez arka arkaya** sıfırlanmalıdır. Bunu Microsoft'un resmi yönergelerine göre yapın, elle yapılan hatalar kesintiye yol açabilir.

### 5. İzleme ve alarm (en iç halka)
Tüm önlemlere rağmen bir şey ters giderse **fark etmemiz** gerekir. Bu da bir sonraki bölümün konusu.

---

## Nasıl fark ederiz?

Hırsızı kapıda durduramazsanız bile, **güvenlik kamerasından** yakalayabilirsiniz. Windows'un tuttuğu **olay günlükleri** bu kameranın görevini görür.

![Kayıt defterindeki şüpheli olaylar alarm üretir](/blogs/img/ntds-dit-active-directory/07-alarm-ve-izleme.png)

İzlenmesi gereken başlıca olaylar:

| Olay (Event ID) | Ne anlama gelir? | Neden önemli? |
|---|---|---|
| **4662** (Security) | Dizin nesnesine bir işlem yapıldı. İçinde yukarıdaki "eşitleme" GUID'leri geçiyorsa biri kopya istiyor demektir. | **DC olmayan** bir hesaptan geliyorsa şüphelidir (DCSync belirtisi). |
| **8222** (Security) | Sunucunun **gölge kopyası** (anlık görüntüsü) alındı. | Defter kilitli olduğu için saldırganlar genelde bu yolla kopyalar. |
| **4688** (Security) / Sysmon 1 | Bir program çalıştırıldı. `ntdsutil`, `vssadmin`, `diskshadow`, `wbadmin` gibi araçlar kopya almak için kullanılabilir. | Bu araçların **ne zaman ve kim tarafından** çalıştığına bakın. (Komut satırı kaydını açmayı unutmayın.) |
| **325 / 327 / 330** (Application, ESENT) | Yeni bir veritabanı oluşturuldu veya ayrıldı. | Defterin kopyalandığına işaret edebilir. |

Her şeyi tek tek elle izlemek zor olduğu için genellikle şunlar kullanılır:

- **SIEM:** Logları tek yerde toplayıp alarm kuralları yazdığınız sistem
- **Microsoft Defender for Identity:** Eşitleme taklidi gibi saldırıları kendisi yakalayıp uyarı verir
- **Sigma kuralları:** Topluluğun hazırladığı hazır tespit kuralları

Bu olayların kaydedilip kaydedilmediğini görmek için DC'de şu komutu çalıştırabilirsiniz:

```powershell
auditpol /get /category:"DS Access"
```

---

## Özet ve kontrol listesi

**NTDS.dit**, Active Directory'nin büyük defteridir. Ağdaki herkesin kimliği, grup üyelikleri, yetkileri ve parola izleri orada durur. Eline geçen biri için bu, **bütün kapılara uyan bir anahtar demeti** demektir.

Unutmamamız gereken tek cümle:

> **NTDS.dit'i korumak, yalnızca bir dosyayı korumak değildir. Onu okuyabilecek yetkileri, yedekleri, sanal diskleri ve "eşitleme isteme" haklarını da korumaktır.**

**Kontrol listesi:**

- ☐ Yetkili grupların üye listesini gözden geçirdim ve kısalttım
- ☐ Yöneticilerin günlük işler için ayrı hesabı var
- ☐ "Eşitleme isteme" haklarına sahip hesapları kontrol ettim
- ☐ DC'lerde gereksiz program ve servis yok, güncellemeler yapılıyor
- ☐ DC yedekleri ve sanal diskleri korunuyor
- ☐ LAPS ve uzun parola politikası uygulanıyor
- ☐ `krbtgt` parolası için bir yenileme planım var
- ☐ 4662, 8222, 4688 olayları izleniyor
- ☐ Bir uyarı sistemi (SIEM / Defender for Identity) ile şüpheli işlemler yakalanıyor

---

## Kaynaklar

- MITRE ATT&CK, T1003.003 (NTDS): <https://attack.mitre.org/techniques/T1003/003/>
- MITRE ATT&CK, T1003.006 (DCSync): <https://attack.mitre.org/techniques/T1003/006/>
- Microsoft Learn, Best Practices for Securing Active Directory: <https://learn.microsoft.com/en-us/windows-server/identity/ad-ds/plan/security-best-practices/best-practices-for-securing-active-directory>
- ADSecurity.org, Active Directory güvenliği üzerine araştırmalar: <https://adsecurity.org>

---


