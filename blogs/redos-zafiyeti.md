# ReDoS (Regular Expression Denial of Service) Zafiyeti

## **Giriş**

Regular Expression Denial of Service (ReDoS) saldırıları, modern web uygulamalarında sıkça karşılaşılan ancak genellikle gözden kaçırılan kritik güvenlik açıklarından biridir. Bu yazıda ReDoS zafiyetinin teknik detaylarını, matematiksel temellerini ve gerçek dünya örneklerini inceleyeceğiz.

## **Regex Nedir?**

Regex (Regular Expression), metin içinde arama yapmak, desenleri bulmak ve metinleri işlemek için kullanılan güçlü bir araçtır.

**Örnek kullanım alanları:**
- Email validasyonu
- Telefon numarası formatı kontrolü
- Metin içinde arama/değiştirme
- Log dosyası analizi
- Veri temizleme

## **Regex Motoru Nedir?** 

**Regex Motoru (Regex Engine)**, yazdığınız regex desenini (pattern) kullanarak bir metin üzerinde arama yapan veya doğrulama gerçekleştiren arka plandaki yazılım bileşenidir. Regex motorları, metin üzerinde eşleşme ararken farklı çalışma prensiplerine sahip olabilir:

| Regex Motoru Türü                           | Açıklama                                                                                   | ReDoS Riski |
| ------------------------------------------- | ------------------------------------------------------------------------------------------ | ----------- |
| **NFA (Non-deterministic Finite Automata)** | Çoğu modern dilde kullanılan motor tipidir (JavaScript, Python, Perl). Backtracking yapar. | ✅ Var       |
| **DFA (Deterministic Finite Automata)**     | Google RE2, Rust regex gibi motorlar DFA tabanlıdır. Tüm girdiyi bir kerede işler.         | ❌ Yok       |

- **NFA tabanlı motorlar** esnek ama savunmasızdır.  
- **DFA motorları** ise hızlı ve güvenlidir, ancak bazı regex özelliklerini desteklemez (örneğin, lookbehind).

## **Temel Karakterler**

### 1. Literal Karakterler

Normal karakterler aynen eşleşir:

```text
pattern = "Gallipoli "
text = "Gallipoli Community"
# Eşleşir: "Gallipoli "
```

### 2. Nokta (.) – Herhangi Bir Karakter

Nokta (.) herhangi bir karakteri (yeni satır hariç) temsil eder:

```text
pattern = "g.ll.p.li"
# Eşleşir: "gallipoli"
```

### 3. Escape Karakterleri

Özel karakterleri literal olarak kullanmak için `\` kullanın:

```text
pattern = "3\\.14"  # Nokta karakterini literal olarak kullanma
text = "Pi sayısı 3.14"
# Eşleşir: "3.14"
```

**Özel Karakterler:** `. + * ? ^ $ { } [ ] \ | ( )`

## **Karakter Sınıfları**

### 1. Köşeli Parantezler [ ] – Karakter Seti

Belirtilen karakterlerden herhangi biri:

```text
[aeiou]     # Herhangi bir sesli harf  
[0-9]       # Herhangi bir rakam  
[a-z]       # Herhangi bir küçük harf  
[A-Z]       # Herhangi bir büyük harf  
[a-zA-Z]    # Herhangi bir harf  
[0-9a-f]    # Hex rakamlar
```

### 2. Negatif Karakter Sınıfı [^]

Belirtilen karakterler dışında herhangi biri:

```text
[^0-9]      # Rakam olmayan karakter  
[^aeiou]    # Sesli harf olmayan karakter  
[^a-z]      # Küçük harf olmayan karakter
```

### 3. Önceden Tanımlı Karakter Sınıfları

| Kısaltma | Açıklama                   | Eşdeğeri            |
|----------|----------------------------|---------------------|
| \d       | Herhangi bir rakam         | [0-9]               |
| \D       | Rakam olmayan karakter     | [^0-9]              |
| \w       | Kelime karakteri           | [a-zA-Z0-9_]        |
| \W       | Kelime karakteri olmayan   | [^a-zA-Z0-9_]       |
| \s       | Boşluk karakteri           | [ \t\n\r\f\v ]      |
| \S       | Boşluk olmayan karakter    | [^ \t\n\r\f\v ]     |

**Örnekler:**

```text
\d+         # Bir veya daha fazla rakam  
\w+         # Bir veya daha fazla kelime karakteri  
\s+         # Bir veya daha fazla boşluk
```

## **Niceleyiciler (Quantifiers)**

Niceleyiciler bir karakterin veya grubun kaç kez tekrarlanacağını belirtir.

### 1. Temel Niceleyiciler

| Niceleyici | Açıklama           | Örnek                   |
|------------|-------------------|-------------------------|
| *          | 0 veya daha fazla | a* → "", "a", "aa"      |
| +          | 1 veya daha fazla | a+ → "a", "aa", "aaa"   |
| ?          | 0 veya 1 (opsiyonel) | a? → "", "a"        |

### 2. Sayısal Niceleyiciler

| Niceleyici | Açıklama      | Örnek                      |
|------------|--------------|----------------------------|
| {n}        | Tam n kez    | a{3} → "aaa"               |
| {n,}       | En az n kez  | a{2,} → "aa", "aaa"        |
| {n,m}      | n ile m arası| a{2,4} → "aa", "aaa", "aaaa" |

### 3. Greedy vs Non-Greedy

**Greedy:** Mümkün olduğunca çok eşleşme

```text
pattern = "a+"
text = "aaabbb"
# Eşleşir: "aaa" (tüm a'lar)
```

**Non-Greedy:** Mümkün olduğunca az eşleşme
```text
pattern = "a+?"
text = "aaabbb"
# Eşleşir: "a" (sadece ilk a)
```

**Non-Greedy Niceleyiciler:**
```text
*? – 0 veya daha fazla (non-greedy)
+? – 1 veya daha fazla (non-greedy)
?? – 0 veya 1 (non-greedy)
{n,m}? – n ile m arası (non-greedy)
```
## **Konumsal Belirteçler (Anchors)**

Konumsal belirteçler, eşleşmenin nerede olacağını belirtir.

### 1. Satır Başı/Sonu

| Belirteç | Açıklama   | Örnek                       |
|----------|------------|-----------------------------|
| ^        | Satır başı | ^hello → "hello world" ✓    |
| $        | Satır sonu | world$ → "hello world" ✓    |
| ^...$    | Tam satır  | ^hello$ → "hello" ✓, "hello world" ✗ |

### 2. String Başı/Sonu

| Belirteç | Açıklama     |
|----------|--------------|
| \A     | String başı  |
| \Z     | String sonu  |

### 3. Kelime Sınırları

| Belirteç | Açıklama             | Örnek                                  |
|----------|----------------------|----------------------------------------|
| \b       | Kelime sınırı        | \btest\b → "test case" ✓, "testing" ✗  |
| \B       | Kelime sınırı olmayan| \Btest\B → "contest" ✓, "test" ✗       |

Daha detaylı bilgi için [regex cheat sheet](https://regexlib.com/CheatSheet.aspx)’ini inceleyebilirsiniz.

## **ReDoS Nedir?**

ReDoS, özellikle *backtracking* yapan regex motorlarında, kötü amaçlı olarak hazırlanmış bir girdiyle **çok fazla işlem yapılmasını sağlayarak** sistem kaynaklarını tüketen bir saldırıdır. Regex motorunun, eşleşme olup olmadığını anlamaya çalışırken **muazzam sayıda kombinasyon** denemesi gerekir ve bu da CPU’yu tüketebilir.

## **ReDoS'un Matematiği: Karmaşıklık Nerede?**

### Exponential Backtracking

**Exponential Backtracking (Üstel Geri İzleme)**, regex motorunun başarısız oldukça geri dönüp farklı seçenekleri denediği ve işlem sayısının katlanarak arttığı bir durumdur.

Bazı regex yapıları, özellikle şu kalıplar: `(a+)+` gibi **nested quantifiers** (iç içe tekrarlar), kötü amaçlı bir girdiyle birleştirildiğinde regex motorunu **üstel zamanlı** bir arama yapmaya zorlayabilir.

#### Örnek:

```text
Regex: (a+)+$
Girdi: aaaaaaaaaaaaaaaaX
```

Bu durumda regex motoru aşağıdaki gibi denemeler yapar:

- `a`'leri gruplandırarak farklı şekillerde parçalar (örneğin: (a)(a...a), (aa)(a...a) gibi)
- Her olası parçalama kombinasyonunu dener
- Son karakter `X` eşleşmediğinde **geri dönüp yeni kombinasyonlar dener**

Bu süreç, toplam `n` uzunluğundaki `a` karakterleri için **O(2^n)** zaman karmaşıklığına yol açar. Bu, **ReDoS'un matematiksel temelidir**.

## **Teknik Analiz: NFA vs DFA**

### NFA (Non-deterministic Finite Automata)

Çoğu modern regex motoru (Perl, JavaScript, Python) [NFA tabanlıdır](https://en.wikipedia.org/wiki/Nondeterministic_finite_automaton) ve **backtracking** yapar. Bu da ReDoS’a karşı savunmasız olmalarına neden olur.

### DFA (Deterministic Finite Automata)

DFA tabanlı regex motorları (örneğin RE2, Rust’un regex kütüphanesi) tüm girdiyi bir defada işler ve **sabit zamanlı** davranır. ReDoS riski taşımazlar ama bazı regex özelliklerini (lookbehind gibi) desteklemezler.

## **ReDoS Saldırı Senaryoları**

### Senaryo 1 – Web Formu Donması

Kullanıcı adı doğrulamak için aşağıdaki regex kullanılıyor:

```regex
^([a-zA-Z]+)+$
```

**Saldırgan input:**

```text
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaX
```

**Sonuç:**
- Web formu yanıt veremez hale gelir.
- Sunucu CPU’su aşırı yüklenir.

### Senaryo 2 – Zafiyetli Email Doğrulama ile ReDoS Saldırısı

Bu örnekte, kötü tasarlanmış bir **email doğrulama regex’i** kullanılarak sistemin nasıl **ReDoS (Regular Expression Denial of Service)** saldırısına açık hale geldiğini göstereceğiz.

#### Zafiyetli Regex

Aşağıdaki email doğrulama regex kalıbı, yüzeyde doğru çalışıyor gibi görünse de yapısal olarak **karmaşık** ve **hatalı niceleyici kullanımı** içerdiğinden ReDoS'a açıktır:

```regex
^([a-zA-Z0-9])(([\-.]|[_]+)?([a-zA-Z0-9]+))*(@){1}[a-z0-9]+[.]{1}(([a-z]{2,3})|([a-z]{2,3}[.]{1}[a-z]{2,3}))$
```

🔎 **Neden Tehlikeli?**
- Birden fazla iç içe geçmiş niceleyici (`*`, `+` ve `?`) içeriyor.
- Karmaşık grup kullanımı nedeniyle motor backtracking yapmaya zorlanıyor.
- Regex motoru, yanlış bir girdi geldiğinde farklı kombinasyonları denemeye başlıyor ve bu işlem CPU tüketimini patlatabiliyor.

### Python İle ReDoS Demonstrasyonu

```python
import re
import time

class ReDoSDemo:
    def measure_time(self, func, *args):
        start = time.time()
        result = func(*args)
        end = time.time()
        return result, end - start

def vulnerable_email_validation():
    """Zafiyetli email validasyon regex'i ile ReDoS örneği"""
    vulnerable_pattern = r'^([a-zA-Z0-9])(([\-.]|[_]+)?([a-zA-Z0-9]+))*(@){1}[a-z0-9]+[.]{1}(([a-z]{2,3})|([a-z]{2,3}[.]{1}[a-z]{2,3}))$'
    
    normal_email = "user@example.com"
    malicious_payload = "a" * 30 + "!"

    demo = ReDoSDemo()

    print(f"Normal email test: {normal_email}")
    result, exec_time = demo.measure_time(re.match, vulnerable_pattern, normal_email)
    print(f"Sonuç: {bool(result)}, Süre: {exec_time:.6f} saniye")

    print(f"\nSaldırı payload'u: {malicious_payload}")
    print("DİKKAT: Bu işlem uzun sürebilir! (Ctrl+C ile durdurabilirsiniz)")

    try:
        result, exec_time = demo.measure_time(re.match, vulnerable_pattern, malicious_payload)
        print(f"Sonuç: {bool(result)}, Süre: {exec_time:.6f} saniye")
    except KeyboardInterrupt:
        print("İşlem manuel olarak durduruldu!")

if __name__ == "__main__":
    vulnerable_email_validation()
```

#### Deneyin ve Gözlemleyin:
- Normal email girdisi → Regex hızlı çalışır.
- Saldırgan girdisi (`aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa!`) → Regex motoru eşleşme ararken boğulur, işlem süresi dramatik şekilde uzar.

### Gerçek Dünya Senaryosu

Bir saldırgan, email doğrulama yapan herhangi bir form alanına aşağıdaki gibi özel hazırlanmış bir input gönderdiğinde:

```text
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa!
```

- Sunucu, sadece regex eşleşmesi kontrolü yaparken CPU’sunu tüketir.
- Uygulama yanıt veremez hale gelir.
- Tüm sistem etkilenebilir.

## **ReDoS'tan Korunma Yöntemleri**

- Basitleştirilmiş regex kullanın.
- Karmaşık, iç içe niceleyicilerden kaçının.
- Mümkünse **DFA tabanlı regex motorları** tercih edin (Google RE2, Rust regex gibi).
- Regex işlemleri için **işlem süresi sınırı (timeout)** uygulayın.
- Regex analizi için [güvenlik araçları](https://www.regextester.com/) kullanın.

## **Sonuç**

ReDoS, küçük bir input ile büyük zarar verebilen sessiz bir tehdittir. Regex kalıpları yazarken sadece doğru eşleşmeye odaklanmak yeterli değildir; **performans ve güvenlik** her zaman göz önünde bulundurulmalıdır.

Kötü yazılmış bir regex, sadece yazılımsal bir hata değil; doğrudan **bir güvenlik zafiyeti** olabilir. Regex motorunun nasıl çalıştığını anlamak, performans sorunlarını ve ReDoS saldırılarını önlemek için kritik önem taşır.

Regex kalıbınızı analiz edin:

**"Ne kadar karmaşıksa, o kadar tehlikelidir."**

## **Ek Kaynaklar**

- [OWASP: Regular Expression Denial of Service - ReDoS](https://owasp.org/www-community/attacks/Regular_expression_Denial_of_Service_-_ReDoS)
- [Imperva: Regular Expression Denial of Service](https://www.imperva.com/learn/ddos/regular-expression-denial-of-service-redos/)
- [Wikipedia: Nondeterministic Finite Automaton](https://en.wikipedia.org/wiki/Nondeterministic_finite_automaton)
- [RegexLib](https://regexlib.com/Default.aspx)
- [OWASP Validation Regex Repository](https://wiki.owasp.org/index.php/OWASP_Validation_Regex_Repository)
- [DZone: Regular Expressions Denial](https://dzone.com/articles/regular-expressions-denial)
- [Vebilisim: Regex Nedir?](https://vebilisim.com.tr/regex-nedir/)
- [Clicksus: Regex Nedir? Ayrıntılı Rehber](https://www.clicksus.com/regex-nedir-ayrintili-rehber)
- [GeeksforGeeks: Regular Expression to DFA](https://www.geeksforgeeks.org/compiler-design/regular-expression-to-dfa/)

---

If you’re interested in discussing these techniques or collaborating on similar research, feel free to join our community on Telegram: [https://t.me/gallipolixyz](https://t.me/gallipolixyz)

[My LinkedIn](https://www.linkedin.com/in/hilalavsar/)