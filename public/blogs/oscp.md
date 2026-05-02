# Siber Güvenlik Sertifikaları #4: OSCP+ Sınavının Anatomisi

![OSCP Banner](/blogs/img/oscp/oscp.png)

Sertifika serimizin dördüncü durağında siber güvenlik dünyasının güçlü olarak kabul edilen o meşhur noktaya geldik: **OSCP+**. Serinin ilk üç yazısında olduğu gibi; bu incelemeyi de herhangi bir sertifika sahibi olmayan, tamamen dışarıdan ve tarafsız bir gözle OffSec’in güncel verilerine dayanarak yapıyorum.

## 1. OSCP+ Nedir? Kimler İçin Uygundur?

OSCP+, OffSec tarafından sunulan PEN-200 (Penetration Testing with Kali Linux) kursunun başarıyla tamamlanmasıyla elde edilen, %100 uygulamalı bir sızma testi sertifikasıdır. Bu sertifika, sadece araç kullanmayı değil; keşif, istismar ve kanıt toplama metodolojisini ne kadar içselleştirdiğinizi ölçer.

*   **OSCP ve OSCP+ Ayrımı:** Sınavı geçtiğinizde ömür boyu geçerli olan klasik **OSCP** sertifikasını alırsınız. Ancak, bilginizin güncel olduğunu kanıtlayan **OSCP+** unvanı, alındığı tarihten itibaren 3 yıl boyunca geçerlidir.
*   **Kariyer Etkisi:** OSCP+, siber güvenlik uzmanlarının sadece teorik konuşmadığını, baskı altında gerçek sistemleri sızdırabildiğini gösteren en net kanıttır. Sektörde sızma testi uzmanı, güvenlik analisti veya saldırgan operasyonlar uzmanı olmak isteyenler için en temel gereksinimlerden biri olarak kabul edilir.

## 2. PEN-200 Müfredatının Derinlikleri

Eğitim süreci (PEN-200), 321 saatten fazla içerik ve 20'den fazla modül sunan, oldukça yoğun bir programdır. OffSec, bu müfredatla sizi sadece bir “hacker” değil, metodolojik bir profesyonel yapmayı hedefler.

**Müfredat şu kritik teknik alanları kapsar:**
*   **Keşif ve Bilgi Toplama:** Nmap gibi araçlarla servis keşfi, zafiyet tarama ve manuel değerlendirme süreçleri.
*   **Web Uygulama İstismarı:** XSS, SQL Injection, Directory Traversal, Command Injection ve File Upload gibi kritik zafiyetlerin manuel olarak sömürülmesi.
*   **Active Directory (AD) Operasyonları:** AD kimlik doğrulama mekanizmalarına saldırı, yetki yükseltme ve ağ içerisinde lateral movement (yatay hareket) teknikleri.
*   **Yetki Yükseltme (PrivEsc):** Hem Windows hem de Linux işletim sistemlerinde, kısıtlı bir kullanıcıdan en yetkili kullanıcıya (Root/System) geçiş yolları.
*   **Modern Altyapılar:** AWS bulut altyapılarına yönelik keşif ve saldırı teknikleri ile modern koruma mekanizmalarını (Anti-Virus Evasion vb.) atlatma.
*   **Profesyonel Araç Kullanımı:** Metasploit, Burp Suite, Hydra, Nessus ve sqlmap gibi araçların endüstriyel standartlarda kullanımı.

## 3. Çalışma Stratejisi

OSCP+ sadece bir sınav değil, bir zihniyet değişimidir. OffSec’in bu felsefesi, sorunları parçalara ayırmayı, planlar başarısız olduğunda soğukkanlı kalmayı ve azimle devam etmeyi öğretir.

*   **Challenge Labları:** Modülleri bitirdikten sonra karşınıza çıkan 9 adet Challenge Lab, gerçek dünya senaryolarını simüle eder. Bunlardan üçü, doğrudan OSCP+ sınav ortamını taklit edecek şekilde tasarlanmıştır.
*   **Yöntem Odaklılık:** Sınavda makineler “CTF tarzı” bulmacalarla değil, profesyonel bir sızma testi uzmanının karşılaşabileceği mantıksal hatalar ve zafiyetlerle doludur. Metodik yaklaşımdan ödün vermeyen kazanır.

## 4. Sınav Formatı: 24 Saatlik Maraton

OSCP+ sınavı, VPN üzerinden erişilen ve OffSec yetkilileri tarafından canlı olarak gözetlenen (proctored) bir ortamda gerçekleşir. 24 saatlik uygulama süresinin ardından, bulgularınızı içeren profesyonel bir rapor sunmanız beklenir.
![OSCP Banner](/blogs/img/oscp/tablo.png)


## 5. Sertifikayı Puanlama ve Kapanış

OSCP+, bir siber güvenlik uzmanının baskı altında, gerçek kısıtlamalarla nasıl performans gösterdiğini ölçen nadir standartlardan biridir. Sınavın sadece teknik beceriyi değil, aynı zamanda fiziksel ve zihinsel dayanıklılığı (ne zaman mola vereceğini bilmek gibi) test etmesi onu bu kadar değerli kılmaktadır.

Maliyet açısından, PEN-200 kursu ve sınav giriş hakkını içeren paketler şuan **1.749$’dan** başlamaktadır (sadece sınav giriş hakkı ise 1.699$). Fiyatı oldukça yüksek, bunu kabul ediyorum ve puan kırmamın temel sebebi de bu; ancak sektördeki güvenilirliği ve işe alım süreçlerindeki ağırlığı düşünüldüğünde, siber güvenlik kariyerinde bir yatırım yapılacaksa yapılabilecek en sağlam yatırımların başında gelir.

> **GENEL PUAN: 9.5 / 10**