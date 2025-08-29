# Oltalama E-postası Analizi

Siber güvenlik dünyasında en çok karşılaşılan saldırılardan biri şüphesiz oltalama (phishing) e-postaları. Belki hepimizin posta kutusuna zaman zaman bu tür şüpheli e-postalar düşüyor: sahte fatura bildirimleri, hesap giriş bildirimleri, banka uyarıları ya da kargo takip mesajları…

Bu yazıda, Rakunların eski bir üyesi olarak hazırladığım 30 dakikalık videoya paralel olarak, bir oltalama e-postasının nasıl analiz edildiğini teknik terimlerle sade bir dille özetlemek istiyorum.


## 1. E-Posta Başlık (Header) Analizi

Her e-postanın arka planında, gönderenin kimliğini ve mesajın hangi sunuculardan geçtiğini gösteren header bilgileri vardır. Burada dikkat edilen bazı noktalar:

- **Return-Path**: Mesajın gerçekten kimden geldiğini ortaya çıkarır. Sahte e-postalarda genellikle alan adı ile gönderen adı uyuşmaz. Reply dediğinizde gönderen domain ile cevap dönecek olan domain farklı olabilir. Ama saldırganlar bunuda değiştirebilmektedir.

- **Received-SPF/DKIM/DMARC**: Mail’in doğrulama mekanizmalarından geçip geçmediğini anlamamızı sağlar. `Fail` sonucu güvenilmez bir kaynağa işaret eder.
```json
SPF/DKIM/DMARC: {
  "SPF": "Sender Policy Framework olarak bilinir. Aslında bir tür `izin listesi`. Alan adının sahibi, DNS üzerinden `benim adıma şu şu IP adresleri e-posta gönderebilir` diye bir kayıt tutuyor. Örneğin Gallipoli ekibi olarak `gallipolixyz.com` alan adına sahipsek, sadece kendi mail sunucumuz veya belirlediğimiz servis sağlayıcı üzerinden gönderilen mailler geçerli sayılmasını sağlıyoruz. Eğer bir saldırgan `gallipolixyz.com` gibi görünerek sahte bir mail göndermeye çalışırsa, SPF kontrolü başarısız oluyor. (fail sonucu)",
  "DKIM": "DomainKeys Identified Mail olarak bilinir. Gönderilen e-postaya bir dijital imza ekliyor. Bu imza, alıcı tarafta gönderenin DNS’inde bulunan açık anahtarla doğrulanıyor. Böylece mail ile oynanıp oynanmadığını anlamamızı sağlıyor. Eğer imza geçerliyse, mailin gerçekten o alan adı sahibi tarafından gönderildiğine daha çok güveniyoruz. ",
  "DMARC": "Domain-based Message Authentication, Reporting and Conformance olarak bilinir. Aslında SPF ve DKIM’in sonuçlarını bir araya getirip politika uyguluyor. Alan adı sahibi, “Eğer SPF veya DKIM başarısız olursa bu maili reddet” ya da “karantina altına al” gibi kurallar belirleyebiliyor. Raporlama özelliği sayesinde, kimler benim adıma sahte mail göndermeye çalışıyor diye düzenli rapor alabiliyorsun."
} 
```
Bir e-postada `SPF`, `DKIM` ve `DMARC` testlerinin sonucu genelde header’da şu şekilde görülür:

```json
PhishingEmail: {
"Return-Path":"<support@google.com>",
"X-Original-To": "gallipoli-phishing@proton.me",
"Delivered-To": "gallipoli-phishing@proton.me",
"From": "Google Security TR <support@google.com>",
"Reply-To": "support@microsoft.com",
"Message-Id": "<20250806051317.1093F3B4A@emkei.cz>",
"Received": "from emkei.cz (emkei.cz [114.29.236.247]) by mailin051.protonmail.ch (Postfix) with ESMTPS",
"Authentication-Results": "mail.protonmail.ch; spf=fail smtp.mailfrom=google.com",
"Authentication-Results": "mail.protonmail.ch; dkim=none",
"Authentication-Results": "mail.protonmail.ch; dmarc=fail (p=reject dis=none) header.from=google.com"
} 
```
Eğer böyle bir tablo görüyorsak, büyük ihtimalle elimizde sahte bir e-posta var demektir. Bu yüzden oltalama analizi yaparken bu üç kontrol saldırının en net kanıtlarını sunar.

**Message-Id**: Her e-posta gönderildiğinde, gönderen mail sunucusu tarafından oluşturulan benzersiz bir kimliktir. Normal dururumlarda  `Message-ID` alanı, gönderenin domaini ile uyumlu olur. Yukarıda ki örnekte'de gördüğünüz gibi uyum bozulmuştur.

**Received**: E-postanın geçtiği her mail sunucusu, header’a bir `Received` satırı ekler. Böylece mailin izlediği yol görülebilir.


## 2. Mail İçeriğinin Analizi

Metin içerisinde kullanılan dil, görseller ve linkler kritik öneme sahiptir. 

- **URL**: Genellikle görünürde güvenilir bir bağlantı (örneğin banka adresi) gösterilir, ancak tıklayınca sahte bir domaine yönlendirir. Burada href ile görünen linkin uyuşup uyuşmadığını kontrol ederiz.

- **PunyCode**: Bazen saldırganlar punycode kullanarak göze legal domain gibi gelen ama tıklandığında başbaşka domaine dönüşebilen teknikler kullanırlar.

- **Ekler (Attachment)**: Saldırganlar, kullanıcıyı zararlı yazılım çalıştırmaya zorlamak için genellikle .zip, .docm veya makro içeren dosyalar gönderir.

`Yazıda teoriksel olarak terimlerden bahsettim, aşağıda ki videoyu izleyerek ma hazırladığım senaryolar üzerinden analiz için kullandığım tooları, mail sisteminin nasıl çalıştığını görebilirsiniz. Resime tıklamanız yeterli. Sorularınız için telegram kanalımızdan yazabilirsiniz. Daha ayrıntılı video isterseniz onuda çekebilirim. İyi öğrenmeler :)` 

[![Video](/blogs/img/EmailAnaliz.png)](https://youtu.be/GhIVMuJB0fk)
