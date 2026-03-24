# Bug Bounty Rapor Analizi : 2 click Remote Code execution in Evernote Android
![](/blogs/img/everNote/1.png)
Bug bounty sürecinde, bir zafiyetin giderildiği bildirildikten sonra aynı etkiye farklı bir root cause üzerinden yeniden ulaşılabildiği durumlar yaşanır. Bu, uygulamadaki attack surface'in tam olarak güvenli hale getirilmediğinin ve fix'in sadece belirli bir entry point'i kapattığının göstergesidir.

Bu yazıda tam olarak böyle bir senaryoyu inceleyeceğiz: **hulkvision_** tarafından HackerOne platformunda Evernote'a raporlanan ve path traversal zafiyetinin remote code execution (RCE) ile sonuçlandığı bu bulguyu detaylıca inceleyeceğiz.

## Arka Plan: İlk Zafiyet ve Fix'in Yetersizliği

Araştırmacı daha önce Evernote'a bir path traversal zafiyeti raporlamıştı. İlk rapordaki ana sebep şuydu:

> Evernote Android uygulaması, `content://` URI'sinden gelen provider'ın `_display_name` değerini sanitize etmiyordu. Bu da arbitrary code execution'a (ACE) yol açıyordu.

Evernote bu zafiyeti fix ettikten sonra araştırmacı, aynı impact'e farklı bir root cause ile ulaşılabileceğini fark etti. İşte bu yazının konusu olan ikinci rapor tam da bu noktada ortaya çıkıyor.

## Uygulama Mimarisi: Hibrit Yapı

Bu zafiyeti anlamak için Evernote Android uygulamasının mimarisini bilmek önemlidir. Uygulama hibrit bir yapıya sahip:

- Bazı bölümler Java ile yazılmış (native Android)
- Bazı bölümler React Native ile yazılmış (JavaScript tabanlı, Hermes bytecode'a compile edilmiş)

Bu ayrım kritiktir çünkü zafiyetin bulunduğu attachment download logic'i React Native tarafında yer alıyor ve Hermes JavaScript bytecode'a compile edilmiş durumda. Bu da araştırmacının zafiyetli kodu reverse ile göstermesini zorlaştırıyor — ilk raporunda Java tarafında bunu yapabilmişken, bu sefer source code seviyesinde kanıt sunamaması, zafiyetin anlaşılırlığını zorlaştırmıştır.

## Zafiyet Detayı: Content-Disposition Header'dan Path Traversal

### Normal Akış

Evernote'ta bir note'a attachment eklenebilir. Bu attachment'lar diğer kullanıcılarla paylaşılabilir. Bir kullanıcı attachment'a tıkladığında, dosya şu path'e indirilir:

```
/data/data/com.evernote/cache/preview/<UUID>/
```

Bu, uygulamanın kendi sandboxının içinde güvenli bir lokasyondur.

### Zafiyetli Akış

Evernote, eklenen attachment'ların yeniden adlandırılmasına (rename) izin veriyor. Araştırmacı, rename işleminde santizasyon olmadığını keşfetti. Bu sayede bir dosya şu şekilde yeniden adlandırılabiliyordu:

```
Orijinal filename:  libjnigraphics.so
Yeni filename:      ../../../lib-1/libjnigraphics.so
```

Ve işte kritik nokta: Evernote Android uygulaması, indirilen dosyanın filename'ini HTTP response header'ındaki Content-Disposition header'ından alıyor:

```
Content-Disposition: attachment; filename="../../../lib-1/libjnigraphics.so"
```

Uygulama bu filename'i hiçbir sanitization yapmadan doğrudan file path'de kullanıyor. Sonuç olarak, dosya beklenen cache directory'si yerine şu path'e yazılıyor:

```
/data/data/com.evernote/lib-1/libjnigraphics.so
```

Bu klasik bir path traversal zafiyetidir — `../` sequence'ları ile hedef directory'nin dışına çıkılarak, uygulamanın native library directory'sine yazma yapılabiliyor.

## Exploitation: Path Traversal'dan RCE'ye

Path traversal tek başına bir dosya yazma primitive'idir. Bunu RCE'ye çevirmek için araştırmacı akıllıca bir teknik kullanıyor: **native library hijacking**.

### Attack Chain

1. **Malicious native library hazırlama:** Araştırmacı, `libjnigraphics.so` adında bir ARM64 architecture native library (ELF shared object) hazırlıyor. Bu library, uygulama tarafından runtime'da yüklenen meşru bir system library'nin adını taşıyor.
2. **Note'a ekleme:** Bu `.so` dosyası bir Evernote note'una attachment olarak ekleniyor.
3. **Path traversal ile rename:** Attachment, `../../../lib-1/libjnigraphics.so` olarak yeniden adlandırılıyor.
4. **Victim'e gönderme:** Note, victim ile paylaşılıyor (invite veya internal link ile).
5. **Victim'in tıklaması:** Victim note'u açıp attachment'a tıkladığında, malicious `.so` dosyası path traversal sayesinde uygulamanın native library directory'sine (`/data/data/com.evernote/lib-1/`) yazılıyor.
6. **Code execution:** Victim uygulamayı kapatıp yeniden açtığında, uygulama runtime'da bu library'yi yüklüyor ve saldırganın kodu execute ediliyor.
7. **Kalıcılık:** Bu exploitation'ın en tehlikeli yönlerinden biri kalıcılık sağlamasıdır. Çünkü native library bir kez yazıldıktan sonra, uygulama her başlatıldığında zararlı kod yeniden çalışır, kullanıcı fark etmedikçe kalıcı erişim sürer ve kod internal storage'da bulunduğu için görünmez.

## Sonuç

Aynı zafiyet sınıfı, sistemdeki farklı entry point'ler üzerinden defalarca exploit edilebilir. Bir bug'ı yamamak için tek bir noktaya fix atmak asla yeterli değildir; arka planda kapsamlı bir root cause analizi yapılmalı ve tüm veri akışları güvence altına alınmalıdır. Evernote örneğinde gördüğümüz gibi, gözden kaçan basit bir sanitizasyon eksikliği, Native Library Hijacking üzerinden sistemde kalıcılık sağlayan tam yetkili bir RCE'ye dönüşebilir.

---

*Bu analiz, **hulkvision_** tarafından HackerOne üzerinden raporlanan ve kamuya açıklanan Evernote güvenlik raporuna dayanmaktadır. Orijinal rapora HackerOne'daki sayfasından ulaşabilirsiniz:* [https://hackerone.com/reports/3475626](https://hackerone.com/reports/3475626)