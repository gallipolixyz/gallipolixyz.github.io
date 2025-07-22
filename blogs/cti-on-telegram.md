# Telegram Üzerinden Siber Tehdit İstihbaratı (CTI)

Siber güvenlik dünyasında açık kaynak istihbaratı (OSINT), günümüz dijital tehdit ortamında hayati bir rol oynuyor. Özellikle Telegram, son yıllarda sadece sıradan kullanıcıların değil, siber suçluların, hacktivistlerin ve devlet destekli aktörlerin de gözdesi haline geldi. Platformun sunduğu gizlilik ve anonimlik özellikleri, onu tehdit istihbaratı çalışmaları için altın değerinde bir kaynak yapıyor.

Bu yazıda, Telegram’da yürütülen siber tehdit faaliyetlerini nasıl izleyeceğinizi, veri toplayacağınızı ve analiz edeceğinizi adım adım keşfedeceğiz.

## 1. Telegram’ın Tehdit İstihbaratı Ekosistemi

**1.1. Neden Telegram?**

- **Anonimlik vadediyor:** Kullanıcılar telefon numarası gizlenerek hesap açabiliyor.
- **Kanallar ve gruplar:** 200.000+ üyeli dev topluluklar bilgi paylaşımı için kullanılıyor.
- **Self-destruct mesajlar:** Kaybolan mesajlar, suç delillerini yok etmek için ideal.

**1.2. Tehdit Aktörlerinin Kullandığı Başlıca Yöntemler**

Telegram’daki yasa dışı faaliyetler, genellikle belirli kalıplar etrafında dönüyor:

- **Malware pazarları:** Ransomware, spyware ve exploitler açık artırmayla satılıyor.
- **Data leak kanalları:** Ele geçirilen kredi kartları, kimlik belgeleri ve giriş bilgileri, belirli gruplar aracılığıyla servis ediliyor.
- **Phishing koordinasyon:** Hedefli oltalama saldırılarının planlandığı, kitlerin ve senaryoların paylaşıldığı özel kanallar mevcut.

***Örnek Vaka:*** 2023’te bir finans kurumuna yönelik ransomware saldırısının planları, bir Telegram kanalında tespit edilmişti.

Bu yapı, Telegram’ı dijital tehditlerin organize edildiği bir alan haline getiriyor. Dolayısıyla bu platformda yapılacak analizler, ciddi güvenlik içgörüleri sunabiliyor.

## 2. Telegram Verilerini Toplamak: Telegram-Tracker Aracı

Telegram’daki mesajları otomatik olarak toplamak için pratik yöntemlerden biri, Python tabanlı *Telegram-Tracker* aracını kullanmak. Bu araç, Telegram API üzerinden belirlenen kanal veya gruplardaki verileri çekip JSON formatında dışa aktarır.

**Adım 1: Ortamınızı Hazırlayın**

1. **Python 3.x ve Git** kurulu olduğundan emin olun.
2. Terminale aşağıdaki komutları sırayla yazın:

```bash
git clone https://github.com/estebanpdl/telegram-api.git
cd telegram-api
pip install -r requirements.txt
```
*Not:* Kurulum sırasında hata alırsanız, Python sürümünüzü kontrol edin.

**Adım 2: Hedef Kanalı Belirleyin**

İncelemek istediğiniz Telegram kanalının adresini alın (örnek: darkweb\_leaks).

**Adım 3: Verileri Çekin**

Aşağıdaki komutu çalıştırarak kanal mesajlarını JSON formatında kaydedin:
```bash
python main.py --telegram-channel <kanal\_adresi>
```
*İşlem tamamlandığında:*

- channel\_data.json dosyası oluşacak.
- Büyük kanallarda işlem 10–15 dakika sürebilir.

**Adım 4: CSV’ye Dönüştürün**

JSON dosyasını analiz için daha kullanışlı bir formata çevirin:
```bash
python build-datasets.py
```
  *Sonuç:*
- output/data/msg\_dataset.csv dosyası oluşacak.
- CSV’yi Excel’de açarak ilk incelemelerinizi yapabilirsiniz.

## 3. Veri Analizi: Voyant Tools ile Görsel Keşif
![voyant](/blogs/img/voyant.png)
Verileri analiz etmek için kullanabileceğiniz etkili araçlardan biri de web tabanlı *Voyant Tools*. Bu platform, yüklediğiniz metin dosyaları üzerinden kelime sıklıkları, grafikler ve ilişkisel haritalar üretir.

**Adım 1: Veriyi Yükleyin**

1. [Voyant Tools](https://voyant-tools.org/) sitesine gidin.
1. **Upload** butonuna tıklayarak msg\_dataset.csv dosyasını seçin.

**Adım 2: Temel Analiz Araçlarını Kullanın**

- **Kelime Bulutu (Cirrus):** En sık geçen terimleri görselleştirin.

*Örnek:* “phishing”, “exploit” gibi terimlere odaklanın.

- **Trendler (Trends):** Belirli kelimelerin zaman içindeki kullanım sıklığını analiz edin.
- **Bağlam Analizi (Contexts):** Şüpheli terimlerin hangi cümlelerde geçtiğini inceleyin.
![filter](/blogs/img/filter-word.png)

**Adım 3: Sonuçların Görselleştirilmesi ve Dışa Aktarılması**

Voyant, görselleştirdiği verileri dışa aktarabilir. Bu sayede, elde edilen veriler daha etkili bir şekilde raporlanabilir ve paylaşılabilir.
![export](/blogs/img/word-export.png)

## Sonuç

Telegram üzerinde siber tehditleri tespit etmek, aslında bu tür tehditlere karşı daha güçlü bir savunma geliştirmek için büyük bir adım. Telegram-Tracker ve Voyant Tools gibi araçlarla, Telegram’daki gruplarda yer alan zararlı içerikleri hızlı bir şekilde tespit edebilir, bu tehditlere karşı daha proaktif bir yaklaşım geliştirebilirsiniz. 

Bu yöntemler, yalnızca tehditlerin tespit edilmesinde değil, aynı zamanda kurumların siber güvenlik duruşunu güçlendirmede de etkili olabilir. Her geçen gün daha fazla tehdit aktörü, Telegram gibi platformları kullanarak faaliyet gösteriyor, bu yüzden bu araçları kullanarak, potansiyel tehlikelere karşı her zaman bir adım önde olabilirsiniz.

## Kaynakça

Aşağıda, bu rehberde kullanılan araçların ve yöntemlerin detaylı dokümantasyonlarını bulabilirsiniz. Bu kaynaklar, çalışmalarınızı derinleştirmek ve güncel bilgilere ulaşmak için idealdir:

**1. Telegram-Tracker Aracı**

- **GitHub Reposu:<https://github.com/estebanpdl/telegram-api>**\
  *Açıklama:* Telegram API üzerinden veri çekmek için kullanılan Python tabanlı açık kaynak araç. Kurulum, kullanım ve örnek komutlar için resmi dokümantasyon.

**2. Voyant Tools**

- **Resmi Web Sitesi: <https://voyant-tools.org/>**\
  *Açıklama:* Metin analizi ve görselleştirme için kullanılan web tabanlı araç. CSV yükleme, kelime bulutu oluşturma ve filtreleme gibi temel işlevlerin adım adım anlatımı.

**3. Telegram API Dokümantasyonu**

- **Geliştirici Kaynakları: <https://core.telegram.org/api>**\
  *Açıklama:* Telegram’ın resmi API dokümantasyonu. Mesaj çekme, kanal yönetimi ve gizlilik politikaları hakkında teknik detaylar.

**4. OSINT (Açık Kaynak İstihbaratı) İçin Ek Kaynaklar**

- **OSINT Framework: <https://osintframework.com/>**\
  *Açıklama:* Siber tehdit avcılığı ve veri toplama için kullanılabilecek araçların kategorize edildiği kapsamlı bir rehber.
-----
***NOT*:** Bu tür çalışmaları yaparken her zaman yerel yasaları ve etik kuralları göz önünde bulundurun. Veri toplama sınırlarını aşmayın ve kişisel mahremiyete saygı gösterin.

-----
[My LinkedIn](https://www.linkedin.com/in/aysebyrktr/)
