# Letter - TryHackMe Writeup

![](/blogs/img/letter-thm-osint-writeup/img1.jpg)

- **Oda Adı:** Letter
- **Zorluk Seviyesi:** Easy
- **Kategori:** OSINT / Forensics / Hikaye Tabanlı İnceleme
- **Oda Açıklaması:** Bu oda, posta dağıtıcısı temalı bir senaryo üzerinden ilerleyen, zip dosyası içinde gelen ipuçlarının (gazete küpürü ve el yazısı not) analiz edilerek hedef kişinin kimliğine ve yaşına ulaşılmasını amaçlayan eğlenceli, beginner-friendly bir OSINT meydan okumasıdır.

---

## Senaryo Özeti

Pazartesi sabahı posta dağıtım rutini sırasında fırtınadan çıkmış gibi delik deşik ve ıslanmış gizemli bir mektupla karşılaşmamızla hikaye başlar. İş arkadaşları mektubu önemsemese de merakımıza yenik düşüp zarfı açarız. İçinden yırtılmış, su hasarı almış bir gazete küpürü ve kişisel bir el yazısı not çıkar.

Temel amacımız, bu materyallerdeki parçaları birleştirerek mektupta adı geçen kişinin tam adını ve yaşını bulmak ve `THM{Ad_Soyad_Yas}` formatındaki bayrağa ulaşmaktır.

---

## Soru 1: What is the postal code of the delivery address on the envelope?

![](/blogs/img/letter-thm-osint-writeup/img2.jpg)

Zarftaki turuncu bir yapı gözüme çarptı. Bu yapı, Fransa'daki posta servislerinin adresleri makinelerle otomatik okutmak için kullandığı barkod sistemi olan özel bir kodlama mantığına dayanıyor.

Elimdeki tabloyu kullanarak çizgileri tek tek rakamlara dönüştürdüm:

- İlk baştaki `..|||||` ifadesi başlangıç çubuğu olduğu için dikkate almadım.
- `|.||.|` → 6
- `||..||` → 7
- `|||..|` → 9
- `.||.||` → 2

Bu işlem sonucunda elime `06792` gibi bir dizi geçti. Fransız posta kodlarının sağdan sola okunduğu kuralını uygulayıp bu sayıyı ters çevirdiğimde, mektubun hedef posta koduna ulaştım.

**Cevap:** `29760`

---

## Soru 2: What is the flag?

Flag formatı `THM{Name_Surname_age}` açıklama kısmında ipucu olarak verilmişti.

![](/blogs/img/letter-thm-osint-writeup/img3.jpg)

### note.txt İçeriği (Türkçe Çevirisi)

> Sevgili Édouard,
> Bugün büyükannemlerin tavanarasını toplarken bu eski gazete küpürüne rastladım. Büyük büyükbaban, o gün kahramanlık gösterdiğinde ehliyet alma yaşındayken bile değildi. Ekibin en genciydi ve kesinlikle en cesur olmayanlar arasında da değildi.
> Senin de şimdi suda olduğunu görmekten çok gurur duyardı.
> Tüm sevgilerimle, Audette

### Analiz Süreci

![](/blogs/img/letter-thm-osint-writeup/img4.jpg)

1. **Gazete küpürünün kaynağı:** Gazetedeki *"Amundsen-t-il atteint le pôle Nord?"* başlığını görünce hemen bu konuyu araştırmaya başladım. Küpürün Fransız **L'Ouest-Éclair** gazetesine ait olduğunu bu sayede çözdüm.
2. **Tarih tespiti:** Amundsen'in Kuzey Kutbu maceralarının haberlerine bakınca, olayların **22-24 Mayıs 1925** tarihleri arasında yaşandığını net bir şekilde yakaladım.
3. **Olay detayı:** Gazetenin bu bölümünde, 23 Mayıs'ta **Audierne limanı** açıklarında fırtınaya yakalanan 17 kişilik **Sainte-Barbe** teknesinin alabora olduğu ve kazada bir kişinin boğulduğu detayları yer alıyor.
4. **Arşiv araştırması:** Gazetedeki bu facia haberinden yola çıkarak, **Finistère** bölgesinin tarihi kayıtlarını barındıran **KBC PENMARC'H** arşivlerine yöneldim.
5. **Kişi tespiti:** Kayıtlardaki 23 Mayıs 1925 tarihli felaket listesini incelediğimde, notta geçen "ehliyet yaşının altında olma" ve "ekibin en genci olma" ipuçlarını sağlayan tek kişinin **15 yaşındaki Yves-Marie Gourlaouen** olduğunu net bir şekilde gördüm.

![](/blogs/img/letter-thm-osint-writeup/img5.jpg)

### Kanıt Zinciri Özeti

| Adım | Kanıt | Sonuç |
|---|---|---|
| 1 | Gazete başlığı | L'Ouest-Éclair gazetesi |
| 2 | Amundsen haberleri | 22-24 Mayıs 1925 tarih aralığı |
| 3 | Facia haberi | Audierne limanı, Sainte-Barbe teknesi kazası |
| 4 | Bölgesel arşiv | KBC PENMARC'H, Finistère kayıtları |
| 5 | Not ipuçları (yaş küçük, ekibin en genci) | Yves-Marie Gourlaouen, 15 yaşında |

**Cevap:** `THM{Yves-Marie_Gourlaouen_15}`

![](/blogs/img/letter-thm-osint-writeup/img6.jpg)

---

## Sonuç

Bu oda, fiziksel bir kanıt parçasından (barkod) dijital/tarihsel araştırmaya (gazete arşivi, bölgesel kayıtlar) uzanan klasik bir OSINT metodolojisini güzel bir şekilde örnekliyor. Zarftaki posta kodu barkodunun çözümü teknik bir beceri gerektirirken, ikinci soru büyük ölçüde tarihsel araştırma ve çıkarım yeteneği istiyor. Fransız posta tarihi ve 1925 Amundsen kutup seferi haberlerinin bilinmesi (ya da araştırılması) çözümün anahtarı oldu.