# Siber Güvenlik Sertifikaları #1: eWPT (eLearnSecurity Web Application Penetration Tester)

![eWPT Banner](/blogs/img/ewpt/ewpt.png)

Bugüne kadar okuduğunuz “eWPT sertifikasını nasıl aldım?” temalı, kişisel deneyimlere dayanan bir yazı olmayacak bu seri bunu önden söyleyeyim bu seride hiçbir sertifikaya sahip olmayan biri olarak değerlendireceğim. Seride tamamen siber güvenlik dünyasındaki en popüler sertifikaları resmi verilerle masaya yatırıyor, aklınızda tek bir soru işareti bırakmayacak şekilde tüm detaylarını açıklayıp yazımızın en sonunda **10 üzerinden puanlıyoruz.**

Serimizin ilk konuğu, web güvenliği dünyasına giriş yapmak isteyenlerin ana durağı: **eWPT (eLearnSecurity Web Application Penetration Tester)**.

---

## 1. eWPT Nedir? Kimler İçin Uygundur?

**eWPT**, eLearnSecurity tarafından sunulan ve günümüzde **INE (Internetwork Expert)** platformu üzerinden eğitimleri verilen bir web sızma testi sertifikasıdır.

* **Kimler Almalı?** Siber güvenlik öğrencileri, Jr. Pentesterlar, web geliştiriciler ve uygulama güvenliği (AppSec) alanına geçiş yapmak isteyen profesyoneller.
* **Geçerlilik:** Siber güvenlik sektöründe geçerli bir sertifikadır. Bir üstü olan eWPTx bu sertifikanın extreme versiyonudur. Bir sonraki serimizde onu da inceleyeceğiz. Doğal olarak zorluk arttığı için extreme olan sertifika daha popüler.

![eWPTvsEWPTX](/blogs/img/ewpt/ewptx.png)

---

## 2. eWPT Müfredat Kontrol Listesi (Domains & Objectives)

Sınava hazırlanırken odaklanmanız gereken yedi ana alan ve bu alanların sınavdaki ağırlıkları resmi olarak INE orijinal sayfasından alınmış şekliyle aşağıdadır. Bu listeyi bir çalışma check-list’i olarak kullanabilirsiniz:

### A. Metodoloji ve Keşif (%20)
* **%10 — Web Sızma Testi Süreçleri ve Metodolojileri:** Bir web uygulamasını endüstri standartlarına (örneğin *OWASP Web Security Testing Guide*) ve metodolojik en iyi uygulamalara göre doğru şekilde değerlendirmek.
* **%10 — Bilgi Toplama ve Keşif (Reconnaissance):**
  * Pasif keşif ve OSINT (Açık Kaynak İstihbaratı) tekniklerini kullanarak web sitelerinden bilgi çıkarma.
  * Hedef organizasyonun alan adları, alt alan adları ve IP adresleri hakkında bilgi toplama.
  * Web sunucusu meta dosyalarını (`robots.txt`, `sitemap.xml` vb.) bilgi sızıntısı açısından inceleme.

### B. Analiz ve Zafiyet Değerlendirme (%25)
* **%10 — Web Uygulama Analizi ve İncelemesi:**
  * Web sunucusu teknolojisinin türünü ve versiyonunu tespit etme.
  * Kullanılan spesifik teknolojileri veya framework’leri (örneğin React, Angular, Django) belirleme.
  * Uygulama yapısını analiz ederek potansiyel saldırı vektörlerini tespit etme.
  * Normal tarama ile erişilemeyen gizli dosya ve dizinleri bulma.
  * HTTP yöntemlerinin (PUT, DELETE vb.) hatalı uygulanmasından kaynaklanan zafiyetleri tespit etme ve istismar etme.
* **%15 — Web Uygulama Zafiyet Değerlendirmesi:**
  * Web sunucularındaki yaygın yanlış yapılandırmaları (misconfigurations) tespit etme ve istismar etme.
  * Uygulamaları varsayılan kimlik bilgileri ve zayıf şifreler açısından test etme.
  * Zayıf veya bozuk kimlik doğrulama (authentication) mekanizmalarını baypas etme.
  * Bilgi sızıntısı (information disclosure) zafiyetlerini tespit etme.

### C. İstismar ve Güvenlik Testleri (%55)
*Sınavın en ağır ve en kritik bölümü. Buradaki zafiyetleri hem tespit etmeli hem de manuel olarak istismar edebilmelisiniz.*

* **%25 — Web Uygulama Güvenlik Testleri:**
  * **Directory Traversal:** Bilgi sızıntısı için dizin atlama zafiyetlerini istismar etme.
  * **File Upload:** Uzaktan kod çalıştırma (RCE) için dosya yükleme zafiyetlerini istismar etme.
  * **LFI/RFI:** Local File Inclusion (LFI) ve Remote File Inclusion (RFI) zafiyetlerini istismar etme.
  * **Oturum Yönetimi:** Zayıf oturum yönetimi zafiyetlerini istismar etme.
  * Zafiyetli ve güncel olmayan bileşenleri istismar etme.
  * Giriş formlarına karşı Brute Force (kaba kuvvet) saldırıları gerçekleştirme.
  * **Command Injection:** Uzaktan kod çalıştırma için komut enjeksiyonu zafiyetlerini istismar etme.
* **%20 — Yaygın Web Uygulama Zafiyetlerinin Manuel İstismarı:**
  * **Reflected ve Stored XSS:** Reflected XSS ve Stored XSS zafiyetlerini istismar etme.
  * **SQL Injection:** SQL Injection zafiyetlerini istismar etme.
  * **CMS Zafiyetleri:** İçerik Yönetim Sistemlerindeki (WordPress, Joomla vb.) zafiyetleri istismar etme.
  * Arka uç veritabanlarından (backend databases) bilgi ve kimlik bilgisi sızdırma.
* **%10 — Web Servis Güvenlik Testleri:**
  * Web servislerinden (API’ler, SOAP/REST) bilgi toplama ve numaralandırma (enumeration).
  * Zafiyetli web servislerini istismar etme.

---

## 3. Nasıl Çalışılmalı?

### Not Tutma (Notion/Obsidian)
Teknikleri unutmamak için kendi Cheat Sheet'inizi oluşturun. Her *Section* için kendi "Attack Map"inizi ve "One-Liner" (tek satırlık komut) listenizi yapın. Örneğin: *"Filtreli bir PHP formunda SQLi denerken izlenecek 5 adım"* gibi algoritmalar oluşturmak işe yarayacaktır. Ama bu en etkili yöntem değildir.

### Lab Odaklı İlerleme
INE’deki videoları sadece izlemeyin. Videodaki her bir saldırıyı, INE’nin kendi lablarında veya **PortSwigger / TryHackMe / HackTheBox** gibi platformlardaki web makinelerinde bizzat deneyin. Burada benim favorim **PortSwigger**. Direkt web açıklıklarına yöneldiği için bence daha etkili bir platform.

---

## 4. Sınav Formatı ve Süreç Detayları

* **Sınav Süresi:** 10 Saat
* **Soru Sayısı:** Toplam 50 Soru
* **Soru Dağılımı:** 11–13 adet hedef makine üzerinden zafiyet sömürerek bulunacak Flag (Bayrak) sorusu ve 37 adet makine içindeki işlemlerle ilgili pratik odaklı çoktan seçmeli soru.
* **Raporlama:** Uzun rapor yazma zorunluluğu yok, sonuçlar otomatik (auto-graded) değerlendiriliyor.

![Sınav Dashboard](/blogs/img/ewpt/sinavsistemi.png)

---

## 5. Sertifikayı Puanlama ve Kapanış

eWPT, web güvenliği temellerini atmak için alınabilecek başlangıç sertifikalarından biridir, bunu anladığımızı düşünüyorum bu yazıda. 

Ben bu yazıyı yazdığımda mevcut fiyatı **450 dolar**dı. Her şeyi göz önünde bulundurduğumuzda eWPT, web sızma testleri için muazzam bir temel atsa da, fiyatlandırma politikası ve temel müfredatı sebebiyle 10 üzerinden 7'lik bir sertifika. Pratik yapısı harika, ancak bütçenizi tek bir sınava ayıracaksanız bence gözünüz eWPTx’te olmalı.

> **Puan: 7 / 10**