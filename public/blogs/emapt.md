# Siber Güvenlik Sertifikaları #3: eMAPT Sınavının Anatomisi

![eMAPT Banner](/blogs/img/emapt/emapt.png)

Bugüne kadar okuduğunuz “eMAPT sertifikasını nasıl aldım?” temalı, kişisel deneyimlere dayanan bir yazı olmayacak bu seri önden söyleyeyim bu seride hiçbir sertifikaya sahip olmayan biri olarak değerlendireceğim.

Seride tamamen Siber güvenlik dünyasındaki en popüler sertifikaları resmi verilerle masaya yatırıyor, aklınızda tek bir soru işareti bırakmayacak şekilde tüm detaylarını açıklayıp ve yazımızın en sonunda 10 üzerinden puanlıyoruz.

Serimizin üçüncü konuğu, mobil cihazların derinliklerine götüren, sektördeki en niş alanlardan birinin temsilcisi: **eMAPT (eLearnSecurity Mobile Application Penetration Tester)**.

---

## 1. eMAPT Nedir? Kimler İçin Uygundur?

**eMAPT**, INE (Internetwork Expert) platformu tarafından sunulan, hem **Android** hem de **iOS** platformlarındaki gerçek dünya mobil uygulamalarındaki zafiyetleri değerlendirme ve istismar etme yeteneğinizi kanıtlayan profesyonel bir sertifikadır.

* **Kimler Almalı?** Mobil tarafa genişlemek isteyen Pentester’lar, mobil tehdit tespiti yapan güvenlik analistleri, kendi kodlarını güvenli yazmak isteyen mobil geliştiriciler.
* **Sektörel Geçerlilik:** Mobil uygulama güvenliği sektörde çok büyük bir ihtiyaç olmasına rağmen, bu alanda yetkin uzman sayısı diğer siber güvenlik taraflarına göre çok daha azdır. eMAPT, bu aranan uzman açığını kapatmak için %100 pratik bir kanıt sunar.

---

## 2. eMAPT Müfredat Kontrol Listesi (Domains & Objectives)

Sınav, Android APK’larından iOS IPA’larına kadar geniş bir yelpazede statik ve dinamik analizi kapsar. Resmi INE sayfasından alınan ağırlıklar ve hedefler şu şekildedir:

### A. Dinamik Test ve Runtime (Çalışma Zamanı) Manipülasyonu (%20)
* WebViews, IPC (Inter-Process Communication) ve loglar dahil olmak üzere sistem etkileşimlerini analiz etmek.
* **SSL Pinning**, Root/Jailbreak tespiti ve Anti-Debugging (Hata ayıklama karşıtı) mekanizmalarını atlatmak (Bypass).
* **Frida, Objection ve Xposed** gibi araçları kullanarak çalışma zamanında (runtime) uygulama mantığını hook’lamak ve manipüle etmek.

### B. Keşif ve Statik Analiz (%20)
* Android ve iOS uygulamalarında manifest/plist dosyalarını ve izin bildirimlerini analiz etmek.
* Kod karıştırma (obfuscation) içeren APK/IPA dosyalarını decompile edip inceleyerek hardcoded (koda gömülü) sırları, mantık hatalarını ve yanlış yapılandırmaları bulmak.

### C. API ve Backend Güvenlik Testleri (%15)
* Arka planda çalışan dokümante edilmemiş API uç noktalarını bulmak.
* BOLA/BFLA, token manipülasyonu ve güvensiz veri işleme zafiyetlerini test etmek.
* Sertifika sabitlemeyi (Certificate Pinning) atlatarak Man-in-the-Middle (MITM) testleri ile şifreli trafiği ve kimlik doğrulamayı değerlendirmek.

### D. Tersine Mühendislik (Reverse Engineering) & Deobfuscation (%10)
* Android ve iOS binary (ikili) dosyalarını (DEX, OAT, Mach-O) tersine mühendislikle analiz edip kodu çıkarmak.
* Uygulama geliştiricilerin kodu gizlemek için kullandığı obfuscation tekniklerini alt etmek.

### E. Tehdit Modelleme ve Temeller (%20)
* Android ve iOS arasındaki mimari farklılıkların tehditlere nasıl etki ettiğini anlamak.
* PTES, OWASP MSTG ve MASVS metodolojilerini kullanarak mobil odaklı tehdit modelleri oluşturmak ve uygulamalara bir saldırgan gözüyle yaklaşmak.

### F. Mobil Malware (Zararlı Yazılım) Analizi (%10)
* Statik ve dinamik yöntemlerle mobil malware davranışlarını, anti-analiz ve kaçınma (evasion) tekniklerini analiz etmek.
* Gerçek dünya mobil APT (Gelişmiş Sürekli Tehdit) kampanyalarını değerlendirmek.

### G. Raporlama ve İletişim (%5)
* Bulunan zafiyetleri teknik ve teknik olmayan kitleler için OWASP MASVS ve PTES çerçevelerinde belgelendirmek.

---

## 3. Nasıl Çalışılmalı?

* **Statik Analizi Özümseyin:** `jadx-gui` gibi araçlarla uygulamaların kaynak kodlarını okumaya alışın. Bir uygulamanın nasıl çalıştığını statik olarak anlamadan, dinamik tarafta nereye vuracağınızı bilemezsiniz.
* **Hooking Sanatında Ustalaşın:** Müfredatın kalbi çalışma zamanı manipülasyonudur. Emülatörünüzü ayağa kaldırın, cihaz mimarisini tespit edin ve **Frida** ile pratik yapın. Mobil dünyada “random” değerleri sabitlemek, PID’leri yakalayıp fonksiyonların içine sızmak (hooking) en kritik yetenektir.
* **Lab ve CTF Önerisi:** Sadece eğitim videolarıyla yetinmeyin. **OWASP UnCrackable (Level 1, 2 vb.)** serisi veya **Challange001/002.apk** gibi mobil odaklı Android CTF’leri çözebilirsiniz. Bu labların çözümleri profilimde bulunuyor. Bu uygulamaları kurup Frida ile root kontrollerini ve SSL pinning mekanizmalarını ezmeye çalışmak sizi sınava %100 hazırlayacaktır.

**💡 Uygulamalı Çözüm Rehberlerim (Write-Up’lar)**
Eğer laboratuvar ortamında takılırsanız veya “Frida ile hooking pratikte nasıl yapılır?” sorusunun cevabını adım adım görmek isterseniz, bu CTF’ler için kendi yazdığım Türkçe çözüm rehberlerime mutlaka göz atın:
* [Challange001.apk Frida ile Çözümü](https://medium.com/@ocolhak4/challange001-apk-frida-ile-%C3%A7%C3%B6z%C3%BCm%C3%BC-abf03366fea7)
* [Challange002.apk Frida ile Çözümü](https://medium.com/@ocolhak4/hallange002-frida-ile-%C3%A7%C3%B6z%C3%BCm%C3%BC-6dc5c16255f5)
* [OWASP UnCrackable Level 1 Çözümü](https://medium.com/@ocolhak4/uncrackable-level1-%C3%A7%C3%B6z%C3%BCm%C3%BC-a723032de5db)
* [OWASP UnCrackable Level 2 Çözümü](https://medium.com/@ocolhak4/uncrackable-level-2-%C3%A7%C3%B6z%C3%BCm%C3%BC-d3bbba96154d)
* [OWASP UnCrackable Level 2 — Frida ile Çözümü](https://medium.com/@ocolhak4/uncrackable-l2-frida-ile-%C3%A7%C3%B6z%C3%BCm%C3%BC-b92f20695284)

---

## 4. Sınav Formatı ve Süreç Detayları

Eski tip raporlamalara veda eden INE, mobil güvenlik sınavını da otomatize etmiş durumda. İşte sınavın resmi lojistik detayları:

| Parametre | Resmi Detay |
| :--- | :--- |
| **Sınav Tipi** | **%100 Uygulamalı (Hands-on).** Gerçek bir Android ve iOS uygulamasında zafiyet arayacağınız laboratuvar ortamı. |
| **Süre** | Sınav talimatlarında belirtilen **ayrılmış süre (allotted time)** içinde tamamlanmalıdır. |
| **Raporlama** | **Yok.** Uzun uzun manuel pentest raporları yazma devri bitti. |
| **Değerlendirme** | **Otomatik Derecelendirme (Auto-graded).** Sınavı tamamladıktan sonra birkaç saat içinde, her bölümdeki performansınızı gösteren detaylı bir karne alırsınız. |
| **Ücretsiz Tekrar (Retake)** | Başarısızlık durumunda 14 gün içinde kullanılabilecek **1 adet ücretsiz tekrar hakkı** mevcuttur. |

---

## 5. Sertifikayı Puanlama ve Kapanış

Sektörde mobil uygulamaları pentest edebiliyorum diyebilmek, masaya çok ciddi ve nadir bulunan bir yetenek seti koymak demektir. Bu da sizi mülakatlarda veya projelerde anında birkaç adım öne çıkarır.

Müfredat, günümüz mobil güvenlik ihtiyaçlarını (API arka planı, Malware analizi, Reverse Engineering) gerçekten çok sağlam bir şekilde kapsıyor. Bugünün fiyatıyla sertifikanın ücreti 450 dolar. Yılın belirli bölümlerinde yüzde 50 ye varan indirimler olabiliyor. Mobil ekosistemine göre mantıklı bir sertifika olabileceğini düşünüyorum.

> **GENEL PUAN: 8.5 / 10**