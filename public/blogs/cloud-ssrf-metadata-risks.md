# SSRF Bulutta Neden Bu Kadar Tehlikeli? — Metadata Servislerinin Anatomisi ve Bulut Ele Geçirme Senaryoları

## SSRF Mantığı ve Bulut Ekosistemindeki Yeri

Server-Side Request Forgery (SSRF), bir web uygulamasının kullanıcıdan gelen girdilerle harici veya dahili kaynaklara HTTP isteği göndermesini sağlayan kritik bir güvenlik açığıdır. Geleneksel mimarilerde SSRF genellikle dahili ağdaki port taramaları veya servis keşifleriyle sınırlıyken, bulut (cloud) ortamlarında bu açık doğrudan tüm altyapının ele geçirilmesine kapı aralar. Bulut sağlayıcılarının sanal makinelerle (VM/EC2) haberleşmek için kullandığı özel yönetim servisleri, SSRF zafiyetlerinin etki alanını üstel düzeyde artırır.

## AWS Instance Metadata Service (IMDS) Mimarisi

Amazon Web Services (AWS) üzerinde koşan her EC2 örneği, kendi yapılandırma verilerine, ağ ayarlarına ve güvenlik kimlik bilgilerine erişmek için 169.254.169.254 IP adresine sahip dahili bir meta veri servisine (IMDS) sahiptir. Bu adres yalnızca ilgili sanal makinenin içinden erişilebilen link-local bir IP'dir. Uygulama katmanında çalışan bir SSRF zafiyeti, dış dünyadan erişilemeyen bu IP adresine istek atılmasını sağlayarak hassas verilerin sızdırılmasına yol açar.

## IMDSv1 ile IMDSv2 Arasındaki Güvenlik Farkı

IMDSv1 (Statik İstekler): Standart bir HTTP GET isteği ile çalışır. İstek başlıklarında herhangi bir doğrulama mekanizması aranmaz. Bu durum, basit URL parametresi manipülasyonlarına dayanan SSRF zafiyetlerinden doğrudan etkilenmesine neden olur.

IMDSv2 (Oturum Tabanlı Koruma): Kriptografik token mekanizması kullanır. Veriye erişmeden önce PUT metodu ile özel bir oturum token'ı (X-aws-ec2-metadata-token) alınması zorunludur. Basit SSRF saldırıları header manipülasyonu yapamadığı için IMDSv2 büyük ölçüde engellenir.

## Credential Ele Geçirilmesi ve Yetki Yükseltme

Bulut ortamlarındaki IAM (Identity and Access Management) rolleri, geçici güvenlik kimlik bilgileri (AccessKeyId, SecretAccessKey, Token) üretir. Zafiyetli bir uygulamada SSRF kullanılarak http://169.254.169.254/latest/meta-data/iam/security-credentials/rol-adi adresine ulaşıldığında, bu geçici anahtarlar açık metin olarak elde edilir. Saldırgan bu anahtarları kendi yerel terminaline tanımlayarak bulut ortamında yetkili bir kullanıcı gibi hareket etmeye başlar.

## Uçtan Uca Örnek Saldırı Senaryosu

Zafiyetin Keşfi: Web uygulamasının profil resmi yükleme veya harici URL önizleme özelliğinde, kullanıcının girdiği URL'yi sunucu tarafında fetch eden bir mantık bulunur.

Metadata Hedefleme: Girdi alanına http://169.254.169.254/latest/meta-data/iam/security-credentials/ verilerek örnek üzerinde tanımlı IAM rolünün adı (admin-role vb.) tespit edilir.

Kimlik Bilgisi Çekme: http://169.254.169.254/latest/meta-data/iam/security-credentials/admin-role endpoint'i üzerinden JSON formatındaki geçici kimlik bilgileri okunur.

Bulut Altyapısının Ele Geçirilmesi: Elde edilen anahtarlar AWS_ACCESS_KEY_ID ve AWS_SECRET_ACCESS_KEY olarak export edilir. AWS CLI üzerinden aws s3 ls veya aws iam list-users komutlarıyla tüm kaynaklar listelenir, veriler dışarı sızdırılır veya kalıcılık sağlamak için yeni arka kapı kullanıcıları oluşturulur.

## Stratejik Savunma ve Sertleştirme (Hardening) Yöntemleri

Bulut altyapılarında eski IMDSv1 desteği tamamen kapatılmalı ve IMDSv2 zorunlu hale getirilmelidir.

Uygulama kodunda harici HTTP istekleri yapan kütüphaneler sıkı bir beyaz liste (whitelist) doğrulamasından geçirilmeli, RFC 3986 standartlarına uygun IP ve alan adı filtrelemesi uygulanmalıdır.

IAM rolleri En Az Yetki Prensibi (Least Privilege) ilkesiyle yapılandırılmalı; EC2 rollerine gereğinden fazla AWS servis yetkisi verilmemelidir.

Ağ seviyesinde egress filtering uygulanarak sunucuların gereksiz dış ve dahili IP bloklarına (özellikle 169.254.169.254 adresine) yaptığı yetkisiz HTTP çıkışları firewall kurallarıyla bloklanmalıdır.

Gerçek sistemlerde, sistem sahibinin açık izni olmadan güvenlik testi yapılmamalıdır.
