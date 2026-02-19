# Code Challenge 5 Write-Up (Information Disclosure)

Bu challenge’da Ruby on Rails ile yazılmış bir JWT token servisinde
hassas bilgilerin token içerisine gömülmesi incelenmektedir.

Uygulamanın amacı, kullanıcı doğrulaması sonrası bir JWT üretmek
ve bu token üzerinden kimlik doğrulama sağlamaktır.

Ancak token payload’ına gereksiz ve hassas veriler eklendiği için
Sensitive Information Disclosure zafiyeti oluşmaktadır.

---

## Kaynak Kod

![](/blogs/img/code-challenge_5/carbon.png)

---

## Zafiyet Türü

Sensitive Information Disclosure via JWT  
Insecure Token Design

---

## Zafiyet Analizi

Token üretim fonksiyonu:

```ruby
def self.generate_token(user, password)
  payload = {
    sub: user.id,
    email: user.email,
    roles: user.roles.pluck(:name),
    department: user.department,
    iat: Time.now.to_i,
    password: password,
    exp: 8.hours.from_now.to_i,
    iss: 'authbridge'
  }

  JWT.encode(payload, SECRET_KEY, ALGORITHM)
end
```
JWT payload içerisine aşağıdaki bilgiler eklenmektedir:

- Kullanıcı ID
- Email
- Roller
- Department
- Password
- Issuer bilgisi

JWT yapısı gereği payload şifrelenmez, yalnızca imzalanır.

Bu nedenle:
- Token ele geçirildiğinde, Base64 decode edilerek içeriği herkes tarafından okunabilir. Özellikle password alanının token içerisine konulması
ciddi bir güvenlik hatasıdır.


# Exploit

JWT token üç bölümden oluşur:

```ruby
HEADER.PAYLOAD.SIGNATURE

{
  "sub": 12,
  "email": "user@example.com",
  "roles": ["employee"],
  "department": "finance",
  "password": "PlainTextPassword",
  "iat": 1710000000,
  "exp": 1710028800,
  "iss": "authbridge"
}
```

Saldırgan:

- Token’ı ele geçirir (XSS, log sızıntısı, local storage, network capture vs.)
- Payload’ı decode eder
- Kullanıcının açık şekilde şifresini elde eder
- JWT imzası doğrulanmadan bile payload okunabilir.
- Bu nedenle zafiyet exploitation için SECRET_KEY bilinmesine gerek yoktur.

# Sonuç

- Kullanıcı şifreleri token içinde taşınmaktadır
- JWT şifrelenmediği için payload herkes tarafından okunabilir
- Token sızıntısı doğrudan credential sızıntısına yol açar
- Aynı şifre başka sistemlerde kullanılıyorsa zincirleme ihlal oluşabilir
- Rol ve departman bilgileri de gereksiz şekilde ifşa edilmektedir

# Güvenli Çözüm

- JWT içerisine hassas veri konulmamalıdır
- Özellikle password asla token payload’ında yer almamalıdır
- Token minimal claim prensibi ile oluşturulmalıdır

Örnek güvenli payload:
```ruby
payload = {
  sub: user.id,
  roles: user.roles.pluck(:name),
  iat: Time.now.to_i,
  exp: 8.hours.from_now.to_i,
  iss: 'authbridge'
}
```
- JWT yalnızca kimlik doğrulama amacıyla kullanılmalı, hassas veri taşıma aracı olarak kullanılmamalıdır.