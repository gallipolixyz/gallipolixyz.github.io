# Case-Insensitive Routing Bypass in Express.js Application

![](/blogs/img/case-insensitive-routing-bypass/1.png)
Merhaba arkadaşlar, bu görevdeki zafiyet, case-insensitive routing ile case-sensitive erişim kontrolü arasındaki tutarsızlıktan kaynaklanan bir Authentication Bypass örneğidir.

Express framework’ü varsayılan olarak URL path’lerini büyük/küçük harf duyarlılığı olmadan eşleştirirken, uygulama seviyesinde yapılan güvenlik kontrolü path’i case-sensitive şekilde doğrulamaktadır.




![](/blogs/img/case-insensitive-routing-bypass/2.png)

Bu nedenle, /admin, /ADMİN, /AdMiN vb. yönlendirmeler aynı uç noktaya sahip olacaktır. Öte yandan, /admin uç noktasını koruması gereken kimlik doğrulama ara yazılımı büyük/küçük harf duyarlıdır ve yalnızca rota tam olarak /admin ile başladığında belirteci kontrol eder. Bu nedenle, /admin veya farklı bir büyük/küçük harf kullanımıyla herhangi bir başka biçime başvurmak, erişim kontrolünü atlamak için yeterlidir, çünkü kimlik doğrulama yapılmasa bile Express isteği yine de doğru şekilde yönlendirecektir.



![](/blogs/img/case-insensitive-routing-bypass/3.png)

## Doğru Yaklaşım:

### 1- Path Normalizasyonu
![](/blogs/img/case-insensitive-routing-bypass/4.png)


`Bu sayede: /admin , /Admin , /AdmiN , /ADMIN/settings tamamı engellenir.`


### 2- Regex ile Sınırlandırma
![](/blogs/img/case-insensitive-routing-bypass/5.png)


`Bu sayede: /admin , /admin/ , /Admin , /admin/settings tamamı engellenir.`

### Referans:

` https://www.invicti.com/web-application-vulnerabilities/case-insensitive-routing-bypass-in-express-js-application `

` https://intersog.com/blog/code/how-to-address-key-vulnerabilities-in-the-mean-stack/ `



