# Bulut Güvenliği: AWS IAM Temelleri ve Sık Yapılan Yapılandırma Hataları (Misconfigurations)

Geleneksel ağ güvenliğinde güvenlik duvarları (Firewalls) ve IP tabanlı koruma hatları ana savunma mekanizmasını oluştururken, bulut bilişim (Cloud Computing) ile birlikte güvenlik paradigması kökten bir değişime uğramıştır. Günümüz bulut mimarilerinde **"Identity is the new perimeter"** (Yeni güvenlik çevresi kimliktir) ilkesi geçerlidir. 

Amazon Web Services (AWS) ekosisteminde erişim denetiminin kalbi olan **IAM (Identity and Access Management)**, doğru yapılandırılmadığında tüm bulut altyapısını saldırganların erişimine açık hale getirebilir. Cloud Security Alliance (CSA) ve güvenlik araştırmalarına göre, bulut ortamlarındaki veri ihlallerinin büyük çoğunluğu sıfırıncı gün (zero-day) açıklarından değil, **hatalı yapılandırmalardan (misconfigurations)** ve **aşırı yetkilendirilmiş (over-privileged) kimliklerden** kaynaklanmaktadır.

Bu yazıda, AWS IAM mimarisini, en sık karşılaşılan kritik IAM misconfiguration türlerini, IAM Privilege Escalation (Yetki Yükseltme) tekniklerini ve bu zafiyetlerin önüne geçmek için uygulanması gereken sıkılaştırma (hardening) yöntemlerini teknik ayrıntılarıyla inceleyeceğiz.

![AWS IAM Cloud Security](/blogs/img/aws-iam-cloud-security-misconfigurations/banner.png)

---

## 1. AWS IAM Temel Mimarisi ve Çalışma Prensipleri

AWS IAM, kaynaklara kimin (Authentication - Kimlik Doğrulama) ve hangi yetkilerle (Authorization - Yetkilendirme) erişebileceğini belirleyen servistir. IAM mimarisi dört ana bileşen üzerine kuruludur:

![AWS IAM Architecture](/blogs/img/aws-iam-cloud-security-misconfigurations/iam-architecture.png)

1. **IAM Users & Groups**: İnsan veya servis temsilcileri. Kullanıcılar doğrudan yetkilendirilebileceği gibi, sürdürülebilirlik açısından gruplara atanıp yetkileri gruplar üzerinden almalıdır.
2. **IAM Roles**: Belirli bir kimliğe kalıcı olarak bağlı olmayan, geçici güvenlik kimlik bilgileri (Temporary Credentials) sağlayan mekanizmadır. EC2, Lambda veya dış sistemler (cross-account) bir IAM Role üstlenerek (AssumeRole) işlem yapar.
3. **IAM Policies**: JSON formatında yazılan yetki tanımlarıdır. İki tür policy bulunur:
   - **Identity-based Policies**: User, Group veya Role'e bağlanan politikalar.
   - **Resource-based Policies**: S3 Bucket Policy, KMS Key Policy veya SQS Queue Policy gibi doğrudan kaynağa bağlanan politikalar.
4. **Trust Policies**: Bir IAM Role'ün kimler tarafından üstlenebileceğini (AssumeRole) belirleyen özel resource-based politikalardır.

### Bir IAM Policy Anatomy Örneği:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowS3ReadAccess",
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::my-company-confidential-bucket",
        "arn:aws:s3:::my-company-confidential-bucket/*"
      ],
      "Condition": {
        "Bool": {
          "aws:SecureTransport": "true"
        }
      }
    }
  ]
}
```

AWS yetkilendirme mantığına (Evaluation Logic) göre:
- Varsayılan olarak tüm istekler **Implicit Deny** (zımni ret) durumundadır.
- Açık bir **Allow** yoksa istek reddedilir.
- Herhangi bir seviyede tek bir **Explicit Deny** (açık ret) varsa, diğer tüm Allow kurallarını ezerek isteği kesin olarak engeller.

---

## 2. Kritik IAM Misconfigurations ve İstismar Vektörleri

Bulut altyapılarında en yaygın ve tehlikeli IAM yapılandırma hataları şunlardır:

### A. Over-privileged Roles ve Wildcard (`*`) Kullanımı

En sık yapılan geliştirici hatası, "işler hızlı yürüsün" mantığıyla politikalara `*` (wildcard) vermektir. 

**Hatalı Yapılandırma Örneği:**
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "*",
      "Resource": "*"
    }
  ]
}
```
Veya daha sinsi bir örnek olarak `Action: "s3:*"` vermek. Bu durum sadece Okuma/Yazma değil, Bucket Policy silme (`s3:DeleteBucketPolicy`), Public yapma (`s3:PutBucketPolicy`) ve hatta logları yok etme yetkisi verir.

### B. IAM Privilege Escalation (Yetki Yükseltme) Yolları

Kısıtlı yetkiye sahip bir IAM kullanıcısı veya servis rolü, hatalı izinler yüzünden `AdministratorAccess` yetkisine ulaşabilir. En kritik yetki yükseltme teknikleri şunlardır:

![IAM Privilege Escalation Attack Flow](/blogs/img/aws-iam-cloud-security-misconfigurations/iam-privesc.png)

#### 1. `iam:CreatePolicyVersion` & `iam:SetDefaultPolicyVersion`
Eğer bir kullanıcının mevcut bir policy üzerinde yeni bir versiyon oluşturma yetkisi varsa:
```bash
aws iam create-policy-version \
  --policy-arn arn:aws:iam::123456789012:policy/MyRestrictedPolicy \
  --policy-document file://admin-bypass.json \
  --set-as-default
```
Saldırgan, var olan kısıtlı politikaya `Action: "*"` ekleyerek anında admin yetkisi kazanır.

#### 2. `iam:PassRole` + EC2 / Lambda İstismarı
Eğer saldırgan kısıtlı bir IAM yetkisine sahipse ancak `iam:PassRole` ve `ec2:RunInstances` (veya `lambda:CreateFunction`) yetkilerine izin verildiyse:
- Saldırgan, içinde `AdministratorAccess` rolü bulunan bir IAM Role'ü (`iam:PassRole` ile) yeni oluşturacağı bir EC2 örneğine veya Lambda fonksiyonuna bağlar.
- Ardından Lambda fonksiyonunu tetikleyerek veya EC2 Instance Metadata servisinden geçici admin yetkilerini (AccessKey, SecretKey, SessionToken) çekerek hesabı ele geçirir.

#### 3. `iam:AttachUserPolicy` veya `iam:AttachRolePolicy`
Bir kullanıcının kendi hesabına veya kontrol edebildiği bir role politika bağlama yetkisi bulunması durumunda:
```bash
aws iam attach-user-policy \
  --user-name low-priv-user \
  --policy-arn arn:aws:iam::aws:policy/AdministratorAccess
```

---

## 3. EC2 Instance Metadata Service (IMDS) ve SSRF Tehlikesi

EC2 örnekleri üstlendikleri IAM Role kimlik bilgilerini yerel bir metadata endpoint'i üzerinden alır: `http://169.254.169.254/latest/meta-data/iam/security-credentials/<role-name>`.

### IMDSv1 Zafiyeti ve SSRF (Server-Side Request Forgery)
IMDSv1 sürümünde metadata sunucusuna atılan basit bir `GET` isteği yeterlidir:

```bash
# Web uygulamasındaki SSRF açığı üzerinden 169.254.169.254 adresine istek atıldığında:
curl http://169.254.169.254/latest/meta-data/iam/security-credentials/EC2-Admin-Role
```
**Çıktı:**
```json
{
  "Code" : "Success",
  "LastUpdated" : "2026-07-26T18:00:00Z",
  "Type" : "AWS-HMAC",
  "AccessKeyId" : "ASIA...",
  "SecretAccessKey" : "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY",
  "Token" : "IQoJb3JpZ2luX2Vj...",
  "Expiration" : "2026-07-27T00:00:00Z"
}
```
Saldırgan bu `AccessKeyId`, `SecretAccessKey` ve `Token` değerlerini alıp kendi bilgisayarındaki `aws-cli` aracında tanımlayarak EC2 sunucusunun sahip olduğu tüm IAM yetkileriyle AWS API'sine erişir!

### Çözüm: IMDSv2 (Token-Based Authentication)
IMDSv2, metadata erişiminde `PUT` isteği ile zaman sınırlı bir Session Token alınmasını ve `GET` isteğinde `X-aws-ec2-metadata-token` başlığının (header) gönderilmesini zorunlu kılar. SSRF zafiyetlerinde saldırganlar genellikle özel HTTP başlığı ekleyemediği veya `PUT` isteği atamadığı için IMDSv2 SSRF ile credential sızdırılmasını engeller.

```bash
# 1. Aşama: Session token al
TOKEN=`curl -X PUT "http://169.254.169.254/latest/api/token" -H "X-aws-ec2-metadata-token-ttl-seconds: 21600"`

# 2. Aşama: Token ile metadata oku
curl -H "X-aws-ec2-metadata-token: $TOKEN" http://169.254.169.254/latest/meta-data/iam/security-credentials/
```

---

## 4. Cross-Account Yetkilendirme Hataları ve "Confused Deputy" Problemi

Farklı AWS hesapları arasında güven ilişkisi (Trust Relationship) kurulurken `AssumeRole` mekanizması kullanılır. 

**Yanlış Yapılandırılmış Trust Policy Örneği:**
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::999999999999:root"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
```
Eğer 999999999999 numaralı hesap bir SaaS hizmeti veriyorsa ve siz role şart koşmaksızın erişim izni verdiyseniz, başka bir SaaS müşterisi kendi hesabından sizin rolünüzü `sts:AssumeRole` ile üstlenebilir (**Confused Deputy Attack**).

### Çözüm: `sts:ExternalId` Kullanımı
Cross-account rollerde güvenliği sağlamak için `Condition` bloğunda rastgele ve gizli bir `ExternalId` doğrulanmalıdır:

```json
"Condition": {
  "StringEquals": {
    "sts:ExternalId": "UniqueSecretClientKey12345"
  }
}
```

---

## 5. AWS IAM Sıkılaştırma ve Güvenlik Best Practice'leri

AWS ortamınızdaki IAM misconfiguration risklerini minimize etmek için uygulanması gereken kritik adımlar:

![Most Common Cloud Misconfigurations](/blogs/img/aws-iam-cloud-security-misconfigurations/misconfigurations-table.png)

1. **En Az Yetki Prensibi (Principle of Least Privilege - PoLP)**:
   - Kullanıcılara ve servislere yalnızca ihtiyaç duydukları aksiyon ve kaynaklar tanımlanmalıdır.
   - **AWS IAM Access Analyzer** ve **CloudTrail** logları kullanılarak kullanılmayan yetkiler tespit edilmeli ve temizlenmelidir.

2. **IMDSv2'ye Geçişi Zorunlu Kılın**:
   - Tüm EC2 örneklerinde IMDSv1 devre dışı bırakılmalıdır:
   ```bash
   aws ec2 modify-instance-metadata-options \
     --instance-id i-1234567890def \
     --http-tokens required \
     --http-endpoint enabled
   ```

3. **SCP (Service Control Policies) ve Permission Boundaries Kullanımı**:
   - AWS Organizations seviyesinde Service Control Policy (SCP) tanımlayarak, alt hesaplarda root kullanıcısı dahil belirli kritik aksiyonların (örneğin `CloudTrail` loglarını kapatma, `GuardDuty` devre dışı bırakma) yapılmasını engelleyin.

4. **Kök Kullanıcı (Root User) Güvenliği & MFA**:
   - Root hesabı günlük işlemler için asla kullanılmamalı, donanımsal MFA (MFA Hardware Key) ile korunmalı ve Access Key oluşturulmamalıdır.
   - Tüm IAM kullanıcıları için zorunlu MFA politikası (Force MFA Policy) uygulanmalıdır.

5. **Geçici Kimlik Bilgilerine (Temporary Credentials) Geçiş**:
   - Uzun ömürlü IAM Access Key kullanımı sonlandırılmalı, AWS IAM Identity Center (Single Sign-On - SSO), AWS Secrets Manager ve Kubernetes için IRSA (IAM Roles for Service Accounts) kullanılmalıdır.

6. **Otomatik Güvenlik Taramaları (CSPM & Static Code Analysis)**:
   - IaC (Terraform, CloudFormation) kodlarınızı dağıtmadan önce `checkov`, `tfsec` veya `trivy` ile tarayın.
   - AWS hesabınızda **AWS Security Hub**, **GuardDuty** ve **Prowler** gibi CSPM araçlarını sürekli çalıştırın.

---

## Sonuç

Bulut güvenliğinde en büyük risk, karmaşık IAM mimarilerinde gözden kaçan tek bir hatalı wildcard veya aşırı yetkili bir role seçimidir. Saldırganlar bulut altyapılarına sızmak için genellikle karmaşık zero-day açıklarına ihtiyaç duymazlar; açıkta unutulmuş bir S3 bucket, IMDSv1 üzerinden sızdırılan bir EC2 rolü veya kısıtlanmamış bir `iam:PassRole` yetkisi tüm altyapının kontrolünü ele geçirmek için yeterlidir.

Güvenli bir bulut altyapısı inşa etmek; sürekli izleme, sıkılaştırılmış IAM politikaları, duyarlı erişim denetimleri ve otomatize edilmiş güvenlik taramaları ile mümkündür.
