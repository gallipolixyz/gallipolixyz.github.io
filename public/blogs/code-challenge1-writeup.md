# Code Challenge Write-Up: Broken Object Level Authorization (BOLA)

Referans: OWASP API1:2023 — Broken Object Level Authorization

Bu challenge, basit görünen bir API endpoint’i soruyor: bu endpoint güvenli mi? Cevap hayır. Arkasındaki zafiyet, OWASP API Security Top 10 listesinin birinci sırasındaki BOLA (Broken Object Level Authorization).

Aşağıda sırayla şunları göreceğiz: zafiyetin ne olduğu, OWASP’ın onu nasıl değerlendirdiği, neden bu kadar yaygın olduğu, genel olarak nasıl önlendiği, bu challenge’da tam olarak nerede saklandığı, nasıl sömürüldüğü ve nasıl düzeltileceği.

## Challenge

Elimizde örneğin bir bankanın API’sine ait bir endpoint var. Görevi, bir hesaba ait bir ekstreyi (statement) döndürmek.

![](/blogs/img/codechallenge/challenge1_1.jpg)

# Object-Level Authorization Nedir?

Object-level authorization, bir kullanıcının yalnızca erişim yetkisi olan objelere erişebildiğini doğrulayan, tipik olarak kod seviyesinde uygulanan bir erişim kontrol mekanizmasıdır.

Kuralı şu: bir objenin ID’sini alan ve o obje üzerinde herhangi bir işlem yapan **her** API endpoint’i, object-level authorization kontrolü içermelidir. Bu kontrol, oturum açmış kullanıcının, istenen obje üzerinde istenen işlemi yapmaya yetkili olup olmadığını doğrulamalıdır.

“Her endpoint” ve “her işlem” ifadeleri burada önemlidir. Çünkü BOLA’nın kaynağı çoğu zaman tek bir unutulan endpoint oluyor.  Bu mekanizmadaki bir hata tipik olarak tüm verinin yetkisiz ifşasına, değiştirilmesine veya silinmesine yol açabilir.

Peki bizim challenge’da bir object-level authorization var mı? Var, ama `account` objesi için. `statement` objesi için yok. Ve dönen veri `statement`. 

## OWASP Anatomisi: Tehdit, Zayıflık, Etki

OWASP güvenlik açıklarını tehdit, zayıflık ve etki eksenlerinde değerlendirir. BOLA bu üç eksende de dikkat çekici bir risk profiline sahip.

**Sömürülebilirlik: Kolay.** Saldırgan, isteklerdeki object ID’lerini değiştirerek farklı objelere erişmeyi deneyebilir. Bu ID’ler URL’de, query parametrelerinde, header’da veya request body içinde bulunabilir.

**Yaygınlık ve tespit edilebilirlik: Yüksek.** API tabanlı uygulamalarda sunucunun erişim kontrolünü istemciden gelen ID’lere dayandırması BOLA riskini artırır. Yanıtlar da çoğu zaman saldırının başarılı olup olmadığını açıkça gösterir.

**Etki: Orta ile kritik arası.** Yetkisiz veri erişimi, veri manipülasyonu veya veri kaybına yol açabilir; bazı durumlarda hesap ele geçirmeye (account takeover) kadar ilerleyebilir.

Özetle BOLA; tespit edilmesi ve sömürülmesi kolay, etkisi ise bağlama göre kritik olabilen yaygın bir yetkilendirme zafiyetidir.

## BOLA Neden Bu Kadar Yaygın?

Bu sıklık tesadüf değil; modern API mimarisinin doğasından kaynaklanıyor.

Klasik, session ağırlıklı web uygulamalarında sunucu istemci hakkında çok şey hatırlardı. Ama REST ve GraphQL API’leri stateless olacak şekilde tasarlanır: her istek kendi kendine yeterlidir ve sunucu istemcinin bağlamını istekler arasında taşımaz. Peki sunucu “bu istekte hangi objeye erişilecek?” sorusuna nasıl cevap verir? İstemcinin gönderdiği object ID’lerine bakarak. Yani hangi verinin döneceğini büyük ölçüde istemcinin söylediği belirler.

Dikkatimizi buraya verelim : object ID’ler istemcinin kontrolündedir. Sunucu her istek için “bu principal gerçekten bu objeye erişebilir mi?” diye bağımsız bir doğrulama yapmazsa, istemci ID’yi değiştirdiğinde sunucu itiraz etmeden başkasının verisini getirir. Sunucu, istemcinin niyetini değil, istemcinin girdisini takip ediyordur.

Somuta bağlarsak ;  bizim kodda sunucu `statement_id`’yi istemciden alıyor ve o ID’li ekstreyi getiriyor. `statement_id`’nin isteği yapan kişiye ait olup olmadığını bağımsız olarak doğrulamıyor.

## Nasıl Önlenir?

OWASP’ın 4 Temel İlkesine göre açıklayalım 

**1. Merkezi ve politika tabanlı yetkilendirme uygulayın.** Yetkilendirme kontrollerini dağınık `if` blokları yerine merkezi bir mekanizma üzerinden yönetin. İhtiyaca göre ownership, RBAC (rol tabanlı) veya ABAC (öznitelik tabanlı) kullanın. Temel prensip: deny by default. Yani kontrol açıkça “evet” demediği sürece cevap “hayır” olmalı.

**2. Her nesne erişiminde yetki kontrolü yapın.** İstemciden gelen ID ile erişilen her nesne için kullanıcının yetkisini doğrulayın. En güvenli yaklaşım, yetkilendirmeyi veri erişiminin içine dahil etmektir:

```python
statement = Statement.query.filter_by(
    id=statement_id,
    account_id=account_id
).first()
if statement is None:
    return jsonify(error="Not found"), 404
```

Bu yaklaşımda sorgu doğrudan kullanıcının hesabına scope edilir; ayrı bir yetkilendirme kontrolünün unutulma riski ortadan kalkar. Bu challenge’ın çözümü de tam olarak bu; detayını Fix bölümünde açıyoruz.

**3. Tahmin edilmesi zor ID’ler kullanın.** UUID/GUID kullanımı enumeration riskini azaltır, ancak yetkilendirme kontrolünün yerine geçmez. Defense-in-depth katmanı olarak değerlendirilmelidir. ID tahmin edilemez olsa bile bir yolla sızarsa (loglar, referrer header’ı, paylaşılan link, başka bir endpoint), asıl yetki kontrolü yoksa erişim yine çalışır.

**4. Yetkilendirmeyi otomatik testlerle doğrulayın.** Cross-tenant erişim senaryolarını test edin. Bir kullanıcının başka bir kullanıcıya ait nesneye erişim denemesi 403 veya uygun durumlarda 404 ile sonuçlanmalı. Bu testleri CI/CD sürecine dahil ederek, yetkilendirme kontrollerinin bozulmasını production’a çıkmadan yakalayın.

## Challenge’ın Çözümü

![](/blogs/img/codechallenge/challenge1_2.png)

Bu challenge’da authorization kontrolü doğru objenin üzerinde yapılıyor gibi görünüyor, ama aslında yanlış objeyi koruyor.

`statement_id` bir direct object reference. `Statement.get(statement_id)` onu global ID’siyle çekiyor; o statement’ın gerçekten bu `account_id`’ye ait olup olmadığına dair sıfır kontrol var. Ownership check parent (account) seviyesinde duruyor, ama asıl hassas veri child (statement) seviyesinde dönüyor ve bu ikisi birbirine hiç bağlanmıyor. Yani `account.owner_id == user.id` satırı sahte bir güven veriyor.

## Exploit

Saldırgan kendi hesabıyla auth olur, URL’de kendi `account_id`’sini kullanır ve `statement_id` yerine başkasının statement ID’sini verir. `Statement.get()` o statement’ı döndürür ve sistemdeki herhangi bir kullanıcının hesap ekstresi sızar.

```
GET /api/v1/accounts/1000/statements/55
     │                        │
     │                        └── 55: kurbanın ekstresi (2000 numaralı hesaba ait)
     └── 1000: saldırganın kendi hesabı (ownership check geçer)
```

`55` yerine `56, 57, 58...` yazarak saldırgan tüm ekstreleri sırayla çekebilir.

## Fix

Fix’i baştan sona, her kararın nedenini açarak gidelim. Önce tam halini koyayım, çünkü fix aslında iki kontrolün birlikte çalışmasıyla tamamlanıyor:

```python
@app.route("/api/v1/accounts/<account_id>/statements/<statement_id>")
def get_statement(account_id, statement_id):
    user = require_auth(request)

    account = Account.get(account_id)
    if account is None or account.owner_id != user.id:      # ① + guard
        return jsonify(error="Not found"), 404               # ③ 403 değil 404

    statement = Statement.query.filter_by(                   # ② scope'lu sorgu
        id=statement_id, account_id=account_id
    ).first()
    if statement is None:
        return jsonify(error="Not found"), 404

    return jsonify(statement.to_dict())
```

### Asıl fix: authorization’ı sorgunun içine gömmek.

Orijinal kodun arkasındaki SQL sorgusu şu olabilir:

```sql
SELECT * FROM statements WHERE id = <statement_id>
```

Yeni sorgu iki koşulu birden şart koşuyor:

```sql
SELECT * FROM statements WHERE id = <statement_id> AND account_id = <account_id> LIMIT 1
```

Buradaki `account_id`, bir üstte sahipliğini zaten doğruladığımız hesap. Yani sorgu artık şunu diyor: “Bu ID’li ekstreyi ver, ama sadece sahibi olduğunu kanıtladığın hesaba aitse.” Yetki kontrolü artık ayrı bir `if` satırı değil; verinin çekilme koşulunun kendisi. Objeyi, yetki şartını sağlamadan elde etmen mümkün değil.

### ② Neden “fetch-then-check”ten iyi?

Alternatif şu olurdu:

```python
statement = Statement.get(statement_id)      # önce çek
if statement.account_id != account_id:       # sonra kontrol et
    return ..., 404
```

Bu da çalışır, ama authorization ayrı ve unutulabilir bir adım olarak duruyor. Bir gün biri refactor yaparken o `if`'i kaldırabilir, yerini değiştirebilir ya da yeni bir kod yolu ekleyip kontrolü atlayabilir; açık geri gelir. Scope'lu sorguda ise atlanacak ayrı bir kontrol yok. Buna "secure by construction" denir: güvenliği sonradan eklenen bir katman değil, kodun yapısının doğal sonucu yaparsın. Ayrık kontroller unutulur; `WHERE` şartını atlamak zordur.

### Kritik nokta: iki kontrol birlikte "ownership chain"i tamamlıyor

Scope'lu sorgu tek başına yeterli değil; account kontrolüyle birlikte çalışması gerekiyor. Account kontrolü `account_id`'nin kullanıcıya, scope'lu sorgu da statement'ın o `account_id`'ye ait olduğunu doğruluyor; sonuç olarak statement kullanıcıya ait oluyor. Account kontrolünü atarsan saldırgan başkasının `account_id`'sini ve o hesaba ait gerçek bir `statement_id`'yi yazar, sorgu tutar ve veri sızar. Zincirin bir halkası eksikse yetki kontrolü tutmaz.

(Bu zinciri tek sorguda da kurabilirsin: `Statement`'ı `Account` ile join'leyip `Account.owner_id == user.id` şartını aynı `WHERE`'e koyarak. İki adımlı versiyon daha okunaklı.)

### ① `account` için `None` guard'ı

`Account.get(account_id)` olmayan bir hesap için `None` dönerse, `account.owner_id` satırı `AttributeError` fırlatır ve kullanıcıya 500 döner. `account is None or ...` ile baştan kesiyoruz.

### ② `.first()` ve `None` kontrolü

`.first()` eşleşme yoksa `None` döner. Faydalı ayrıntı: "ekstre yok" ile "ekstre var ama senin değil" durumları aynı `None`'a iniyor, yani saldırgan cevaba bakarak ikisini ayırt edemiyor. `if statement is None` ile de `None` üzerinde `.to_dict()` çağırıp 500 vermeyi engelliyoruz.

### ③ `403` yerine `404`: resource enumeration

`403 Forbidden`, "bu var ama sana yasak" diyerek objenin varlığını onaylar; saldırgan ID'leri deneyip 403/404 farkına bakarak hangi ID'lerin var olduğunu haritalayabilir. `404` ise sana ait olmayanı hiç yokmuş gibi gösterir ve bu ipucunu vermez; cross-tenant objelerde bu yüzden 404 tercih edilir. (Kendi organizasyonun içinde "rolün yetmiyor" demek istediğinde 403 bilinçli bir tercih olabilir.)

## Özet

Zafiyet, object-level authorization'ın yanlış objeye uygulanmasıydı: kontrol account'ta, dönen veri statement'taydı ve ikisi bağlanmıyordu. Fix bunu üç şekilde kapatıyor: yetkiyi sorguya gömerek (atlanamaz), ownership chain'in iki halkasını da bağlayarak (account→kullanıcı, statement→account) ve hata davranışını enumeration sızdırmayacak şekilde ayarlayarak.

Genel ders: object ID'si alan her endpoint'te, server tarafında, veri erişimine gömülü ve deny-by-default çalışan bir yetki kontrolü uygula; bunu cross-tenant testlerle sürekli doğrula.
