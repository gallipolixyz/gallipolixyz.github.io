# SSRF: Sunucuyu Kendi Silahına Çevirmek

Web güvenliğinde en çok yanlış anlaşılan zafiyetlerden biri SSRF'dir — çünkü ilk bakışta "zararsız" görünür. Kullanıcıdan bir URL alıp o adrese istek atan her özellik (bir önizleme aracı, bir webhook sistemi, bir PDF oluşturucu, bir resim indirme özelliği) potansiyel bir SSRF kapısıdır. Bu yazıda SSRF'nin ne olduğunu, neden özellikle cloud ortamlarında bu kadar yıkıcı hale geldiğini ve nasıl savunulacağını ele alıyorum.

---

## 1. SSRF Nedir?

**Server-Side Request Forgery (SSRF)**, bir saldırganın, hedef sunucuyu kendi adına — sunucunun kendi ağ konumundan ve kendi kimliğiyle — istek atmaya zorlamasıdır. Saldırgan doğrudan iç ağa erişemez, ama sunucuyu bir vekil (proxy) gibi kullanarak dolaylı yoldan erişir.

![SSRF temel akışı: saldırgan, zafiyetli sunucu üzerinden iç servislere ulaşır](/blogs/img/ssrf-sunucuyu-silahlandirmak/ssrf-basic-flow.svg)
*Saldırgan iç ağa doğrudan giremez, ama sunucuyu araç olarak kullanarak dolaylı erişim sağlar.*

Klasik örnek şu şekilde işler: bir uygulamada "profil fotoğrafını URL'den yükle" gibi bir özellik var. Sunucu, verdiğiniz URL'ye gidip görseli indiriyor. Eğer sunucu bu URL'nin nereye gittiğini kontrol etmiyorsa, siz ona bir görsel adresi yerine `http://localhost:8080/admin` ya da iç ağdaki bir servisin adresini verebilirsiniz — sunucu bunu da aynı şekilde "indirmeye" çalışır.

---

## 2. Neden Bu Kadar Tehlikeli? Cloud Metadata Servisleri

SSRF'nin asıl yıkıcı hale geldiği yer, cloud ortamlarıdır. AWS, GCP, Azure gibi bulut sağlayıcıları, her sanal makineye **metadata servisi** adında özel bir iç adres tanımlar: `169.254.169.254`. Bu adres sadece o makinenin kendisinden erişilebilir ve üzerinde makinenin geçici IAM kimlik bilgileri (access key, secret key, token) gibi son derece hassas veriler bulunur.

Eğer bir web uygulaması SSRF'e açıksa ve saldırgan sunucuyu bu adrese istek atmaya zorlayabiliyorsa, teorik olarak o makinenin bulut hesabındaki yetkilerini ele geçirebilir. 2019'da Capital One'da yaşanan büyük veri sızıntısının kök nedeni de tam olarak buydu: bir SSRF açığı, saldırganın AWS metadata servisi üzerinden geçici kimlik bilgilerine ulaşmasını ve oradan yüz milyonlarca müşteri kaydına erişmesini sağladı.

---

## 3. Basic vs Blind SSRF

SSRF'i pratikte bulmak, her zaman kolay değil. İki temel tür var:

![Basic SSRF ile Blind SSRF karşılaştırması](/blogs/img/ssrf-sunucuyu-silahlandirmak/ssrf-blind-vs-basic.svg)
*Basic SSRF'de yanıtı doğrudan görürsün; Blind SSRF'de zaman farkı veya kendi sunucuna gelen isteği izlemen gerekir.*

- **Basic (görünür) SSRF:** Sunucunun attığı isteğin yanıtı, bir şekilde sana geri döner (örneğin sayfada gösterilir). Tespit etmesi kolaydır.
- **Blind (kör) SSRF:** Yanıt hiçbir şekilde görünmez. Bu durumda ya isteğin ne kadar sürdüğüne (yanıt süresi farkı) bakılır ya da kendi kontrolündeki bir sunucuya (Burp Collaborator gibi bir out-of-band aracına) istek gelip gelmediği izlenir. Eğer sunucu senin verdiğin adrese bir şekilde bağlandıysa, kendi loglarında bu isteği görürsün — işte SSRF'in kanıtı budur.

---

## 4. Zafiyetli Bir Örnek

Eğitim amaçlı, basitleştirilmiş bir örnek üzerinden bakalım. Aşağıdaki gibi bir Node.js uç noktası düşünelim:

```javascript
app.get('/fetch-preview', async (req, res) => {
  const targetUrl = req.query.url;       // kullanıcıdan doğrudan geliyor
  const response = await fetch(targetUrl); // hiçbir kontrol yok
  const body = await response.text();
  res.send(body);
});
```

Bu uç nokta, kullanıcının verdiği herhangi bir URL'ye sunucu üzerinden istek atıyor ve sonucu geri döndürüyor. Burada hiçbir doğrulama olmadığı için:

```
GET /fetch-preview?url=http://169.254.169.254/latest/meta-data/iam/security-credentials/
```

gibi bir istek, sunucunun bulunduğu makinenin cloud kimlik bilgilerini doğrudan saldırgana sızdırabilir. `localhost`, `127.0.0.1`, iç ağ IP aralıkları (`10.0.0.0/8`, `192.168.0.0/16` gibi) veya `file://` şeması ile yerel dosya sistemine erişim de benzer şekilde denenebilir.

---

## 5. Savunma: Nasıl Önlenir?

SSRF'e karşı tek bir "sihirli" çözüm yok; katmanlı bir savunma gerekiyor:

**Allowlist kullan, blocklist değil.** Hangi domain veya IP aralıklarına istek atılabileceğini açıkça tanımla; her şeyi yasaklayıp istisna aramaktansa, sadece izin verilenlere izin ver.

**DNS rebinding'e dikkat et.** Bir domain'in IP adresini kontrol edip sonra tekrar çözümleme (resolve) yapmak arasında saldırgan DNS kaydını değiştirebilir — bu yüzden kontrol ettiğin IP ile gerçekten bağlandığın IP'nin aynı olduğundan emin ol.

**Metadata servisine erişimi ağ seviyesinde kısıtla.** AWS'de IMDSv2 zorunlu kılınabilir (token tabanlı, SSRF ile kötüye kullanımı çok daha zorlaştırır); güvenlik grupları ile de bu adrese erişim sınırlandırılabilir.

**Yönlendirmeleri (redirect) takip etme veya sınırla.** Saldırgan, önce izinli görünen bir adrese yönlendirme koyup sunucuyu yasaklı bir adrese yönlendirebilir.

**Ayrı bir ağ segmentinden istek attır.** Dış URL'lere istek atan servisleri, iç kritik sistemlerden ayrı, izole bir ağda çalıştırmak, SSRF'in etki alanını daraltır.

---

## 6. Sonuç

SSRF, "sunucuya bir URL veriyorum, o da gidip getiriyor" gibi masum görünen her özellikte pusuda bekler. Zararı, çoğu zaman zafiyetin kendisinden değil, sunucunun eriştiği iç kaynakların ne kadar hassas olduğundan gelir — özellikle cloud metadata servisleri söz konusu olduğunda, tek bir filtrelenmemiş `url` parametresi bütün bir hesabın ele geçirilmesine yol açabilir. Bu yüzden SSRF'i test ederken sadece "istek gidiyor mu" diye değil, "bu istek sunucunun adına nereye kadar gidebilir" diye sormak gerekir.
