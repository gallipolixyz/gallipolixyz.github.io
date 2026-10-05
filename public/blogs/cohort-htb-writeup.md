# Cohort — SSRF'den Root'a Bir HTB Yolculuğu

Bu yazıda HTB üzerinde çözdüğüm **Cohort** adlı makineyi anlatıyorum. Makine, "Cohort Analytics" adında bir abonelik/analitik şirketinin web sitesi ve bu sitenin arkasında çalışan birkaç iç servis etrafında kurulmuş. Hikâyenin özeti şu: sitedeki zararsız görünen bir "URL doğrulama" formu aslında sunucunun kendi iç ağına istek atmasını sağlıyor (SSRF), bu sayede dışarıdan görünmeyen bir not defteri (notebook) uygulamasını buluyoruz, o uygulamadaki güncel bir zafiyetten faydalanıp sisteme giriyoruz, sonra da işletim sisteminin paket yöneticisindeki bir zafiyetle root oluyoruz.

Amaç sadece "flag'i almak" değil, her adımda *neden* o komutu çalıştırdığımı ve *ne bulduğumu* anlamak, bu yüzden aşağıda her adımı mümkün olduğunca sade anlatmaya çalıştım.

---

## 1. Keşif: Nmap Taraması

Her sızma testinde olduğu gibi işe hedefi tanımakla başlıyorum. Makineye IP üzerinden erişebiliyorum, ilk işim açık portları ve bu portlarda ne çalıştığını öğrenmek:

```
sudo nmap -sS -sV -sC -T4 -Pn 10.129.155.85
```

- `-sS`: SYN taraması, portların açık olup olmadığını hızlıca anlamamı sağlıyor.
- `-sV`: Açık portlardaki servislerin versiyon bilgisini çekiyor.
- `-sC`: Nmap'in hazır (varsayılan) script'lerini çalıştırıp ekstra bilgi (SSL sertifikası, HTTP başlıkları vb.) topluyor.
- `-T4`: Taramayı biraz hızlandırıyor.
- `-Pn`: Hedefin ping'e cevap vermediği durumlarda bile taramaya devam et diyor.

![Nmap taraması sonucu](/blogs/img/cohort-htb-writeup/01-nmap.jpeg)

Sonuçta karşıma şunlar çıktı:

- **22/tcp** — SSH (OpenSSH 9.6p1)
- **80/tcp** — Nginx, `http://cohort.htb` adresine yönlendiriyor
- **443/tcp** — Nginx üzerinde HTTPS, sertifikada `commonName=cohort.htb` ve dikkat çekici bir detay: **`Subject Alternative Name: DNS:cohort.htb, DNS:*.cohort.htb`**

Buradaki `*.cohort.htb` kısmı önemli bir ipucu: sertifika, `cohort.htb`'nin *herhangi bir alt alan adını* (subdomain) da kapsayacak şekilde ayarlanmış. Bu da bana "bu alan adının altında, henüz bilmediğim başka alt siteler/servisler olabilir" dedirtiyor. Bunu aklımda not ediyorum.

`cohort.htb` ve `*.cohort.htb` için `/etc/hosts` dosyama hedefin IP adresini ekleyip tarayıcıdan erişime hazır hâle getiriyorum.

---

## 2. Siteyi Keşfetme

Tarayıcıdan `https://cohort.htb` adresine gidiyorum. Karşıma "Cohort Analytics" adında, abonelik/retention verileri üzerine danışmanlık yapan sahte bir şirket sitesi çıkıyor — standart bir kurumsal tanıtım sayfası.

![Cohort Analytics ana sayfası](/blogs/img/cohort-htb-writeup/02-anasayfa.jpeg)

Burada normal akışımı izliyorum: sayfada gezinip menüleri, linkleri kontrol ediyorum, sonra dizin ve dosya taraması (`gobuster`/`ffuf` gibi araçlarla) yaparak sitede görünmeyen ama var olan sayfa/dizinleri arıyorum. Klasik dizin taramasında başta elime çok bir şey geçmiyor, ama site içinde dolaşırken **`portal.html`** adında bir sayfa buluyorum.

---

## 3. `portal.html`: Gizli SSRF Açığı

`cohort.htb/portal.html` sayfası bir "Kaynak URL'si Doğrula" (Validate source) aracı sunuyor. Mantığı şöyle: siteye bir URL veriyorsun, site o URL'yi **kendi sunucusundan** çekip (fetch) sana önizlemesini gösteriyor — sanki "bu rapor/veri linkin çalışıyor mu kontrol edelim" demek istiyor.

Sayfada ayrıca şöyle bir not var: *"Güvenlik için iç ağ (internal) ve loopback (127.0.0.1 gibi kendi kendine işaret eden) adresler reddediliyor."* Yani geliştiriciler, birinin bu formu kötüye kullanıp sunucunun kendi iç ağına (örneğin `127.0.0.1`) istek attıramayacağını düşünmüşler ve bunu engellemeye çalışmışlar.

Burada aklıma gelen açık türü **SSRF (Server-Side Request Forgery)**: eğer bu formu kandırıp sunucuyu kendi iç ağına (dışarıdan erişemeyeceğim servislere) istek atmaya zorlayabilirsem, normalde göremeyeceğim iç servisleri bu form üzerinden "gözetleyebilirim".

Filtrenin `127.0.0.1` yazısını yakaladığını düşünerek, aynı adresi farklı yazarak denemeye karar veriyorum. `127.1` aslında `127.0.0.1` ile tamamen aynı adrese karşılık geliyor (IP adresleri kısaltılmış şekilde de yazılabiliyor), ama filtre muhtemelen sadece tam `127.0.0.1` metnini arıyor, `127.1` yazısını tanımıyor.

**Deneme 1 — `http://127.1`:**

![127.1 adresini deniyorum](/blogs/img/cohort-htb-writeup/03-portal-deneme1.jpeg)

Form isteği kabul ediyor ve "Reachable, HTTP 200" diyerek sitenin kendi ana sayfasının HTML'ini geri döndürüyor. Bu, SSRF açığının gerçekten çalıştığının kanıtı: form, `127.0.0.1`'i (yani sunucunun kendisini) reddetmesi gerekirken `127.1` yazımını tanımadığı için isteği gönderiyor.

**Deneme 2 — `http://127.1/status`:**

Madem sunucu üzerinden kendi iç ağına istek atabiliyorum, mantıklı bir sonraki adım olası bir "durum/status" ya da yapılandırma uç noktasını denemek oluyor.

![127.1/status isteği, iç servisleri ifşa ediyor](/blogs/img/cohort-htb-writeup/04-portal-status.jpeg)

Bu sefer JSON formatında bir cevap geliyor ve bu cevap altın değerinde:

```json
{
  "service": "cohort-edge",
  "status": "ok",
  "upstreams": [
    {"name": "marketing", "host": "cohort.htb", "root": "/var/www/cohort"},
    {"name": "insights-api", "host": "cohort.htb", "path": "/api/", "target": "127.0.0.1:5000"},
    {"name": "notebooks", "host": "nb-1be3782a8afd3ad5.cohort.htb", "target": "127.0.0.1:8888", "note": "internal analyst workspace, not for external use"}
  ]
}
```

Burada sunucunun arkasında aslında üç ayrı servis çalıştığını öğreniyorum:

1. `marketing` — gördüğümüz tanıtım sitesi
2. `insights-api` — iç ağda `127.0.0.1:5000` portunda çalışan bir API
3. **`notebooks`** — `nb-1be3782a8afd3ad5.cohort.htb` adında, dışarıdan erişilmemesi gereken ("not for external use") ve iç ağda `127.0.0.1:8888` portuna karşılık gelen bir "analist çalışma alanı"

İşte daha önce nmap sonucunda gördüğüm `*.cohort.htb` joker (wildcard) sertifikasının anlamı ortaya çıkıyor: bu `nb-1be3782a8afd3ad5` gibi rastgele/gizli alt alan adları da aynı sertifikayı kullanabiliyormuş. Bu bilgiyi SSRF sayesinde, hiçbir dizin taraması yapmadan, doğrudan sunucunun kendi yapılandırmasından öğrenmiş oldum.

**Deneme 3 — `http://127.1:8888/api/version`:**

8888 portunda bir "notebook" uygulaması çalıştığını öğrendiğime göre, bu uygulamanın ne olduğunu ve hangi versiyonda olduğunu anlamak istiyorum. Çoğu web uygulamasında `/api/version` gibi bir uç nokta versiyon bilgisini verir, bunu deniyorum:

![8888 portundaki uygulamanın versiyonu ortaya çıkıyor](/blogs/img/cohort-htb-writeup/05-portal-version.jpeg)

Cevap olarak sade bir şekilde **`0.20.4`** geliyor. Bu versiyon numarasını not ediyorum, az sonra işime yarayacak.

---

## 4. Gizli Subdomain'e Erişim: `marimo` Notebook

Artık `nb-1be3782a8afd3ad5.cohort.htb` adında gizli bir alt alan adım ve bu adresin arkasında 8888 portunda çalışan, versiyonu `0.20.4` olan bir uygulama olduğunu biliyorum. Bu adresi de `/etc/hosts` dosyama ekleyip tarayıcıdan doğrudan ziyaret ediyorum.

![nb-1be3782a8afd3ad5.cohort.htb giriş ekranı](/blogs/img/cohort-htb-writeup/06-notebooks-login.jpeg)

Karşıma "Access Token / Password" isteyen bir giriş ekranı çıkıyor. Buradan anlıyorum ki bu, **marimo** adında bir Python notebook (Jupyter benzeri interaktif kod çalıştırma) uygulaması — isim ve arayüz stili bunu gösteriyor. Elimde şifre/token olmadığı için normal girişten devam edemiyorum; bunun yerine versiyonu bildiğim bu uygulamanın (marimo 0.20.4) bilinen bir güvenlik açığı olup olmadığını araştırmaya yöneliyorum.

---

## 5. CVE-2026-39987: Marimo'da Kimlik Doğrulamasız Uzaktan Kod Çalıştırma

`marimo 0.20.4 exploit` şeklinde arama yaptığımda GitHub'da halka açık bir PoC (Proof of Concept) buluyorum: **CVE-2026-39987**.

![GitHub'da CVE-2026-39987 exploit kodu](/blogs/img/cohort-htb-writeup/07-cve-2026-39987-github.jpeg)

Script'in mantığını incelediğimde şunu görüyorum: marimo, tarayıcı arayüzü ile arka plandaki Python motoru arasında bir **WebSocket** bağlantısı (`/terminal/ws` yolu) üzerinden konuşuyor. Bu script, giriş ekranından (login) hiç geçmeden doğrudan bu WebSocket uç noktasına bağlanıp, oraya komut gönderip cevabı okuyor — yani giriş sayfasını tamamen atlayan, kimlik doğrulaması gerektirmeyen bir arka kapı gibi davranıyor. Script basitçe WebSocket'e bağlanıyor, kullanıcıdan komut alıyor (`input()`), komutu WebSocket üzerinden gönderiyor ve gelen cevabı ekrana basıyor; yani uzaktaki makinede interaktif bir terminal gibi çalışıyor.

Exploit'i indirip çalıştırıyorum:

```
python3 CVE-2026-39987.py nb-1be3782a8afd3ad5.cohort.htb -i --any-ssl
```

- `nb-1be3782a8afd3ad5.cohort.htb`: hedef adres
- `-i`: interaktif mod, yani komutları elle yazıp anlık cevap alacağım
- `--any-ssl`: hedefin kullandığı SSL sertifikası kendinden imzalı (self-signed) olduğu için sertifika doğrulamasını atla diyorum

![Marimo üzerinden shell alıp user.txt'yi okuyorum](/blogs/img/cohort-htb-writeup/08-marimo-shell-user-flag.jpeg)

Script "Connected" diyor ve bana gerçek bir komut satırı veriyor. `whoami` yazdığımda **`marimo`** kullanıcısı olduğumu görüyorum — yani notebook uygulamasının çalıştığı Linux kullanıcısının yetkilerini kazanmış oluyorum. `ls -la` ile ev dizinine bakıp `user.txt` dosyasını görüyorum, `cat user.txt` ile okuyup ilk flag'i (user flag) elde ediyorum.

---

## 6. Yetki Yükseltme Araştırması: Linpeas ve PackageKit

`marimo` kullanıcısı olarak sisteme girdikten sonra hedefim artık **root** olmak. Bunun için ilk yaptığım şey, sistemdeki olası zafiyetleri ve yanlış yapılandırmaları otomatik tarayan popüler bir script olan **LinPEAS**'i (`linpeas.sh`) hedef makineye indirip çalıştırmak. LinPEAS, sistemdeki şüpheli SUID dosyalarından güncel olmayan paketlere kadar birçok şeyi listeleyip olası zafiyet adaylarını renklendirerek gösteriyor.

Çıktıyı incelerken dikkatimi **PackageKit** servisi çekiyor; sistemdeki paket yöneticisi arka plan servisi olan PackageKit'in sürümünün oldukça eski olduğunu fark ediyorum. Bunu doğrulamak için paket versiyonuna bakıyorum:

```
dpkg -l | grep packagekit
```

![packagekit paketlerinin versiyonları](/blogs/img/cohort-htb-writeup/11-dpkg-packagekit.jpeg)

Çıktıda dikkat çekici bir detay var: `packagekit` paketinin kendisi `1.2.8-2ubuntu1.2` sürümünde dururken, ona bağlı diğer kütüphaneler (`packagekit-glib`, `packagekit-tools` vb.) daha yeni `1.2.8-2ubuntu1.5` sürümünde. Yani sistemdeki diğer her şey güncellenmiş ama PackageKit'in kendisi eski bırakılmış — bu, bilinçli ya da bilinçsiz bir güvenlik açığı adayı.

Bu versiyon bilgisiyle `packagekit CVE` diye arama yapıyorum ve Ubuntu'nun kendi güvenlik sayfasında **CVE-2026-41651**'i buluyorum:

![CVE-2026-41651 — Ubuntu güvenlik sayfası](/blogs/img/cohort-htb-writeup/12-cve-2026-41651-ubuntu.jpeg)

Sayfadaki açıklamaya göre bu, PackageKit'in **1.0.2 ile 1.3.4** arasındaki sürümlerini etkileyen, 1.3.5'te düzeltilen bir **TOCTOU (Time-Of-Check to Time-Of-Use)** zafiyeti. Yetkisiz (root olmayan) bir kullanıcının root yetkisiyle paket kurdurabilmesine, hatta bu paketlerin içindeki script'leri (scriptlet) root olarak çalıştırtabilmesine izin veriyor. Elimizdeki `1.2.8` sürümü bu aralığın tam içinde, yani sistem savunmasız.

Zafiyetin iç mantığını araştırırken bulduğum bir kaynakta konuyu şöyle özetliyor:

![Zafiyetin çalışma mantığının özeti](/blogs/img/cohort-htb-writeup/13-exploit-mantigi.jpeg)

Kısaca anlatmak gerekirse: PackageKit, bir paket kurulum isteğini önce "kontrol ediyor" (bu istek güvenli mi, yetkili mi?), sonra "uyguluyor" (paketi gerçekten kuruyor). TOCTOU açığı, tam bu iki adım arasındaki küçük zaman farkından faydalanıyor: düşük yetkili bir kullanıcı, kontrol ile uygulama arasındaki o kısacık boşlukta işlem bayraklarını (transaction flags) değiştirerek sistemi kandırabiliyor ve kimlik doğrulaması istenmeden sahte/zararlı bir paket root yetkisiyle kurulabiliyor. Paket kurulurken otomatik çalışan script'ler de root olarak tetiklendiği için, bu script'in içine istediğimiz komutu koyarsak doğrudan root yetkisi kazanıyoruz.

---

## 7. Root Olmak: CVE-2026-41651 Exploit'i

Bu CVE için de halka açık bir PoC buluyorum, hedef makineye indirip çalıştırılabilir hale getiriyorum:

```
chmod +x cve-2026-41651
./cve-2026-41651
```

![Exploit'i çalıştırmadan önce dizin ve dosyalar](/blogs/img/cohort-htb-writeup/09-exploit-calisma-oncesi.jpeg)

Exploit çalışırken arka planda şunları yapıyor: sahte bir "dummy" paket ile içine zararlı komutumuzu koyduğumuz bir "payload" paketi (.deb) hazırlıyor, sonra PackageKit'e bu paketleri kurdurmak için bir işlem (transaction) başlatıyor. Normalde bu işlem için kimlik doğrulama (authentication) istenmesi gerekiyor ("PK error 48: Failed to obtain authentication" satırı bunu gösteriyor), ama script tam bu noktada TOCTOU açığını kullanarak işlem bayraklarını değiştirip kimlik doğrulama adımını atlatmaya çalışıyor; "payload=exists dpkg_lock=free suid=not yet" gibi satırlar, script'in hazırlığın tamamlanmasını ve doğru anı (uygun koşulların bir araya gelmesini) beklediğini gösteriyor.

Script başarılı olduğunda, kurdurduğu paket sayesinde **SUID bitli bir bash** (`.suid_bash`) dosyası oluşturuyor — yani normal bir kullanıcı çalıştırsa bile dosya sahibinin (root'un) yetkileriyle çalışan bir shell.

![Root yetkisiyle shell ve root.txt](/blogs/img/cohort-htb-writeup/10-root-flag.jpeg)

`./.suid_bash-5.2` ile bu shell'i çalıştırıyorum ve `whoami` yazdığımda karşıma **`root`** çıkıyor. `cd /root` ile root'un ev dizinine geçip `cat root.txt` ile son flag'i (root flag) okuyarak makineyi tamamlamış oluyorum.

---

## 8. Özet

Cohort makinesinin akışını kısaca toparlarsak:

1. **Nmap** ile 22/80/443 portlarını ve sertifikadaki `*.cohort.htb` joker alan adı ipucunu buluyoruz.
2. Sitede gezinirken **`portal.html`** adlı gizli bir sayfa buluyoruz; bu sayfadaki "URL doğrulama" özelliği aslında bir **SSRF** açığı barındırıyor.
3. `127.0.0.1` filtresini `127.1` yazarak atlatıp, sunucunun iç ağına istek attırıyoruz; `/status` uç noktasından iç servisleri ve gizli bir subdomain'i (`nb-1be3782a8afd3ad5.cohort.htb`) öğreniyoruz, `/api/version` ile bu servisin **marimo 0.20.4** olduğunu buluyoruz.
4. Marimo'nun **CVE-2026-39987** zafiyetini kullanarak giriş ekranını atlayıp WebSocket üzerinden kimlik doğrulamasız komut çalıştırma elde ediyor, `marimo` kullanıcısı olarak **user.txt**'yi alıyoruz.
5. **LinPEAS** ile sistemi tararken eski sürümde kalmış **PackageKit**'i fark ediyor, bunun **CVE-2026-41651** (TOCTOU race condition) zafiyetine açık olduğunu doğruluyoruz.
6. Bu zafiyetin PoC'unu çalıştırarak root yetkili bir SUID shell elde ediyor ve **root.txt**'yi okuyarak makineyi bitiriyoruz.

Bu makinenin bana en çok şey öğrettiği kısım, SSRF'in sadece "sunucuya bir istek attırmak" değil, doğru uç noktaları denediğinizde size **sistemin kendi iç haritasını** çizdirebilecek kadar güçlü olabileceğiydi.
