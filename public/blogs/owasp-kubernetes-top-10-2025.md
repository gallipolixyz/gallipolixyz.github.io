---
title: "OWASP Kubernetes Top 10 (2025): Kubernetes Cluster’larını Gerçekten Güvenli Hale Getirmek"
description: "OWASP Kubernetes Top 10 (2025) maddelerini pratik örnekler, güvenli yapılandırmalar ve lab yaklaşımıyla inceleyen teknik rehber."
---

# OWASP Kubernetes Top 10 (2025)

> **Kubernetes Cluster’larını Gerçekten Güvenli Hale Getirmek**

Kubernetes güvenliğini yalnızca teorik riskler üzerinden değil, **zayıf yapılandırma → saldırı yüzeyi → saldırı etkisi → güvenli yapılandırma → tekrar test** yaklaşımıyla ele alan pratik bir rehber.

## 📚 İçindekiler

- [Giriş](#owasp-kubernetes-top-10-2025)
- [1. Kubernetes'te İzolasyon](#1-önce-kuberneteste-izolasyonun-ne-anlama-geldiğini-anlayalım)
- [2. K01 – Insecure Workload Configurations](#2-k01--insecure-workload-configurations)
- [3. K01 için Secure Deployment](#3-k01-için-örnek-secure-deployment)
- [4. Blast Radius](#4-aynı-uygulama-farklı-blast-radius)
- [5. K02 – Overly Permissive Authorization Configurations](#5-k02--overly-permissive-authorization-configurations)
- [6. K03 – Secrets Management Failures](#6-k03--secrets-management-failures)
- [7. K04 – Lack Of Cluster Level Policy Enforcement](#7-k04--lack-of-cluster-level-policy-enforcement)
- [8. K05 – Missing Network Segmentation Controls](#8-k05--missing-network-segmentation-controls)
- [9. Ingress ve Egress](#9-ingress-ve-egress-neden-önemli)
- [10. K06 – Overly Exposed Kubernetes Components](#10-k06--overly-exposed-kubernetes-components)
- [11. K07 – Misconfigured And Vulnerable Cluster Components](#11-k07--misconfigured-and-vulnerable-cluster-components)
- [12. K08 – Cluster To Cloud Lateral Movement](#12-k08--cluster-to-cloud-lateral-movement)
- [13. K09 – Broken Authentication Mechanisms](#13-k09--broken-authentication-mechanisms)
- [14. K10 – Inadequate Logging And Monitoring](#14-k10--inadequate-logging-and-monitoring)
- [15. Top 10'u Tek Bir Saldırı Zincirinde Düşünmek](#15-bütün-top-10u-tek-bir-saldırı-zincirinde-düşünmek)
- [16. Güvenli Deployment Baseline](#16-güvenli-bir-deployment-için-minimum-baseline)
- [17. Gerçek Bir Lab'a Dönüştürmek](#17-bu-yazıyı-gerçek-bir-laba-dönüştürmek)
- [18. K01 + K02 + K05](#18-k01--k02--k05-birlikte-neden-daha-güçlü)
- [19. Kubernetes Security Checklist](#19-kubernetes-security-checklist)
- [Sonuç](#sonuç)
- [Kaynakça ve İleri Okuma](#kaynakça-ve-ileri-okuma)

---

Kubernetes kullanmaya başladığınızda ilk fark ettiğiniz şeylerden biri, bir uygulamayı çalıştırmanın ne kadar kolay olduğudur. Birkaç YAML dosyası, `kubectl apply` ve uygulama cluster üzerinde çalışmaya başlar.

Asıl problem ise bundan sonra başlıyor.

Çünkü Kubernetes'in sunduğu esneklik, güvenlik tarafında doğru yapılandırılmadığında oldukça geniş bir saldırı yüzeyi oluşturabiliyor. Bir container'ın root olarak çalışması, gereksiz Linux capability'lerinin açık bırakılması, bir ServiceAccount'a ihtiyaç duyduğundan çok daha fazla yetki verilmesi veya Pod'ların birbirleriyle sınırsız konuşabilmesi; tek başına küçük bir yapılandırma problemi gibi görünse de bir saldırganın eline geçtiğinde zincirleme bir saldırıya dönüşebilir.

OWASP, Kubernetes ortamlarında bu problemleri daha sistematik ele almak amacıyla 2025 yılında Kubernetes Top 10 listesini güncelledi.

2025 listesi şu şekilde:

1. **K01 – Insecure Workload Configurations**
2. **K02 – Overly Permissive Authorization Configurations**
3. **K03 – Secrets Management Failures**
4. **K04 – Lack Of Cluster Level Policy Enforcement**
5. **K05 – Missing Network Segmentation Controls**
6. **K06 – Overly Exposed Kubernetes Components**
7. **K07 – Misconfigured And Vulnerable Cluster Components**
8. **K08 – Cluster To Cloud Lateral Movement**
9. **K09 – Broken Authentication Mechanisms**
10. **K10 – Inadequate Logging And Monitoring**

Bu yazıda amacım bu maddeleri sadece teorik olarak anlatmak değil. Aynı zamanda bunların Kubernetes üzerinde nasıl ortaya çıktığını ve küçük bir lab ortamında nasıl gözlemleyebileceğimizi göstermek.

Özellikle şu mantığı kullanacağız:

**Vulnerable configuration → saldırı yüzeyi → saldırı etkisi → güvenli configuration → tekrar test**

Böylece “bu ayar neden önemli?” sorusunun cevabı doğrudan cluster üzerinde görülebilecek.

> **Not:** Aşağıdaki örnekler eğitim amaçlıdır. Bilinçli olarak zayıf yapılandırmalar yalnızca lokal Minikube gibi izole ortamlarda denenmelidir.

# 1. Önce Kubernetes'te izolasyonun ne anlama geldiğini anlayalım

Kubernetes'te bir Pod'un container içinde çalışması, onun otomatik olarak tamamen güvenli olduğu anlamına gelmez.

Örneğin aşağıdaki gibi bir workload düşünelim:

```yaml
containers:
  - name: webapp
    image: vulnerable-app:latest
```

Bu Pod'un:

* hangi kullanıcıyla çalıştığı,
* hangi Linux capability'lerine sahip olduğu,
* dosya sistemine yazıp yazamadığı,
* host namespace'lerine erişip erişemediği,
* ServiceAccount token kullanıp kullanmadığı,
* CPU ve RAM'i ne kadar tüketebileceği,
* hangi Pod'larla iletişim kurabileceği

ayrıca belirlenmelidir.

OWASP'ın K01 için özellikle dikkat çektiği alanlardan bazıları root kullanıcı, privileged container, Linux capabilities, ServiceAccount token'ları, Seccomp ve resource limit'leridir.

Burada önemli bir prensip var:

> **Container güvenliği, uygulamanın güvenli olduğu anlamına gelmez; uygulama ele geçirilse bile saldırganın hareket alanını sınırlamak gerekir.**

Bu yaklaşım Kubernetes güvenliğinin temelini oluşturuyor.

# 2. K01 – Insecure Workload Configurations

K01'i anlamanın en kolay yolu aynı uygulamayı iki farklı Pod konfigürasyonuyla çalıştırmak.

Birinci Pod:

🔴 root
🔴 privileged
🔴 writable filesystem
🔴 gereksiz capabilities
🔴 hostPath
🔴 resource limit yok

İkinci Pod:

🟢 non-root
🟢 `privileged: false`
🟢 read-only filesystem
🟢 capabilities yok
🟢 hostPath yok
🟢 CPU/RAM limitleri var

Uygulamanın kendisi aynı.

Değişen tek şey Kubernetes konfigürasyonu.

## 2.1 Root olarak çalıştırmak neden problem?

Örneğin insecure Pod:

```yaml
securityContext:
  runAsUser: 0
```

UID `0`, Linux'ta root kullanıcısıdır.

Güvenli tarafta ise kullanıcıyı açıkça belirlemek daha doğru:

```yaml
securityContext:
  runAsNonRoot: true
  runAsUser: 1000
  runAsGroup: 1000
```

Burada özellikle UID değerini manifest içerisinde açıkça belirtmek faydalı.

Böylece:

```text
UID 0    → root
UID 1000 → uygulama kullanıcısı
```

gibi bir ayrım doğrudan manifestten görülebiliyor.

OWASP da workload'ların mümkün olduğunca root yerine belirli bir UID/GID ile çalıştırılmasını öneriyor.

## 2.2 “Pod benim bilgisayarımdaki dosyalara erişemesin”

Kubernetes güvenliğinde önemli bir hedef de budur.

Örneğin şu yapı çok riskli olabilir:

```yaml
volumes:
  - name: host-files
    hostPath:
      path: /
```

ve container:

```yaml
volumeMounts:
  - name: host-files
    mountPath: /host
```

Bu durumda container içerisinde `/host` üzerinden node'un dosya sistemine erişim sağlanmış olur.

Eğitim lab'ında bu yapılandırma saldırının etkisini göstermek için kullanılabilir; ancak gerçek bir workload için mümkün olduğunca `hostPath` kullanılmamalıdır.

Güvenli Pod'da ise:

```yaml
volumes: []
```

ve herhangi bir host filesystem mount'ı bulunmamalıdır.

Burada önemli bir ayrım var:

> **“Container'da hostPath yok” demek, container'ın her durumda host'a erişemeyeceği anlamına gelmez.**

Bu yüzden güvenli workload'ta yalnızca hostPath'i kaldırmak yeterli değildir. `privileged`, `hostNetwork`, `hostPID`, `hostIPC` gibi host namespace erişimlerini de gereksiz yere açmamak gerekir.

# 3. K01 için örnek Secure Deployment

Basit bir güvenli workload şu şekilde başlayabilir:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: secure-webapp
spec:
  replicas: 1

  selector:
    matchLabels:
      app: secure-webapp

  template:
    metadata:
      labels:
        app: secure-webapp

    spec:
      automountServiceAccountToken: false

      securityContext:
        runAsNonRoot: true
        runAsUser: 1000
        runAsGroup: 1000
        seccompProfile:
          type: RuntimeDefault

      containers:
        - name: webapp
          image: example/webapp:1.0

          securityContext:
            privileged: false
            allowPrivilegeEscalation: false
            readOnlyRootFilesystem: true

            capabilities:
              drop:
                - ALL

          resources:
            requests:
              cpu: "100m"
              memory: "128Mi"

            limits:
              cpu: "500m"
              memory: "256Mi"
```

Burada birkaç savunma katmanı aynı anda devreye giriyor.

### `runAsNonRoot`

Container'ın root olarak başlamasını engellemeye yardımcı olur.

### `runAsUser: 1000`

Çalışan process'in UID'sini açıkça belirler.

### `runAsGroup: 1000`

Process'in grup kimliğini de belirgin hale getirir.

### `allowPrivilegeEscalation: false`

Process'in parent process'inden daha fazla privilege kazanmasını engellemek için Linux `no_new_privs` mekanizmasını devreye sokar.

### `readOnlyRootFilesystem: true`

Container'ın root filesystem'ine yazmayı engeller.

Bu özellikle saldırganın container içine araç bırakması, shell yüklemesi veya persistence oluşturması gibi senaryolarda önemli bir bariyerdir.

### `capabilities.drop: ALL`

Container'a gereksiz Linux capabilities verilmesini engeller.

### `seccompProfile`

Container'ın gerçekleştirebileceği system call'ları runtime seviyesinde sınırlandırmak için `RuntimeDefault` kullanılabilir.

### `resources.limits`

Bir container'ın node üzerindeki CPU ve RAM kaynaklarını sınırsız tüketmesini engellemeye yardımcı olur.

OWASP da resource limit'lerinin eksikliğini K01 kapsamında önemli bir risk olarak ele alıyor.

# 4. Aynı uygulama, farklı blast radius

K01'in asıl anlatmak istediği nokta burada ortaya çıkıyor.

Uygulamanın içerisinde command injection gibi bir açık olduğunu düşünelim.

Saldırgan:

```text
; id
```

gibi bir payload çalıştırabiliyor.

İki Pod'da da uygulama açığı mevcut.

Ama sonuç aynı olmayabilir.

| Kontrol        | Insecure Pod  | Secure Pod     |
| -------------- | ------------- | -------------- |
| Kullanıcı      | root / UID 0  | UID 1000       |
| Privileged     | Açık          | Kapalı         |
| Capability     | Varsayılanlar | ALL drop       |
| Root FS        | Writable      | Read-only      |
| HostPath       | Var           | Yok            |
| Seccomp        | Belirsiz      | RuntimeDefault |
| Resource limit | Yok           | Var            |
| SA token       | Açık olabilir | Kapalı         |

Burada amaç “secure Pod'a saldırı yapılamaz” demek değil.

Amaç şudur:

> **Uygulama açığı kaçınılmaz olarak gerçekleşse bile saldırganın elde ettiği yetkiyi ve hareket alanını minimumda tutmak.**

Bu, Kubernetes güvenliğinde **defense in depth** yaklaşımının doğrudan karşılığıdır.

# 5. K02 – Overly Permissive Authorization Configurations

K01'de container'ın Linux seviyesindeki yetkilerini ele aldık.

K02'de ise başka bir katmana geçiyoruz:

**Kubernetes API yetkileri.**

Kubernetes'te bir Pod'un ServiceAccount'ı üzerinden API'ye erişim sağlanabilir.

Problem, bu ServiceAccount'a gereğinden fazla yetki verilmesiyle başlıyor.

Örneğin:

```yaml
roleRef:
  name: cluster-admin
```

Bu, lab ortamında saldırının etkisini göstermek için oldukça iyi bir örnektir.

Çünkü `cluster-admin`, cluster kaynaklarına çok geniş erişim sağlar. OWASP da `cluster-admin`, secrets üzerinde `list/watch`, `impersonate`, `bind` ve `escalate` gibi yetkilerin özellikle dikkatle ele alınması gerektiğini belirtiyor.

## 5.1 Kötü senaryo

Pod ele geçirildi:

```text
Application RCE
      ↓
Pod shell
      ↓
ServiceAccount token
      ↓
Kubernetes API
      ↓
Secret / Pod / Deployment erişimi
      ↓
Cluster compromise
```

Bu yüzden bir uygulamanın Kubernetes API'ye gerçekten ihtiyacı var mı sorusunu sormak gerekir.

İhtiyacı yoksa:

```yaml
automountServiceAccountToken: false
```

çok değerli bir güvenlik katmanıdır.

İhtiyacı varsa ise özel bir ServiceAccount ve yalnızca gerekli kaynaklara izin veren Role kullanılmalıdır.

Örneğin:

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: webapp-reader
rules:
  - apiGroups: [""]
    resources:
      - configmaps
    verbs:
      - get
```

Burada:

```text
*
```

kullanmak yerine gereken kaynak ve gereken action açıkça tanımlanıyor.

OWASP'ın K02 için temel yaklaşımı da **least privilege**.

# 6. K03 – Secrets Management Failures

Kubernetes'te Secret kullanmak, secret'ı otomatik olarak güvenli hale getirmez.

Örneğin şu yapılandırma kötü bir yaklaşım:

```yaml
env:
  - name: DB_PASSWORD
    value: "SuperSecret123"
```

Daha da kötüsü:

```dockerfile
ENV AWS_SECRET_ACCESS_KEY=...
```

veya:

```python
PASSWORD = "SuperSecret123"
```

gibi değerlerin Git repository'sine girmesidir.

OWASP K03 kapsamında container image'larının, ConfigMap'lerin ve uzun ömürlü credential'ların secret sızıntısı açısından değerlendirilmesini öneriyor.

## 6.1 Kubernetes Secret kullanalım

Örneğin:

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: db-secret
type: Opaque
stringData:
  DB_PASSWORD: change-me
```

Deployment:

```yaml
env:
  - name: DB_PASSWORD
    valueFrom:
      secretKeyRef:
        name: db-secret
        key: DB_PASSWORD
```

Ancak burada da bir yanlış anlaşılma var.

Kubernetes Secret kullanmak:

> “Secret artık tamamen güvenli.”

anlamına gelmez.

Secret'lara erişimi RBAC ile sınırlandırmak, gerektiğinde etcd encryption-at-rest kullanmak ve üretim ortamlarında harici secret manager / workload identity gibi yöntemleri değerlendirmek gerekir.

Örneğin daha olgun bir mimaride:

```text
Pod
 │
 ├── Kubernetes ServiceAccount
 │
 └── Workload Identity
          │
          ↓
     Cloud Secret Manager
```

yaklaşımı, uzun ömürlü statik credential'ların kullanımını azaltabilir.

# 7. K04 – Lack Of Cluster Level Policy Enforcement

Burada problem artık tek bir YAML dosyası değil.

Bir cluster'da 50 ekip ve binlerce deployment olduğunu düşünelim.

Bir geliştirici:

```yaml
privileged: true
```

yazabilir.

Başka bir ekip:

```yaml
runAsUser: 0
```

kullanabilir.

Bir diğeri:

```yaml
image: random-registry/example:latest
```

deploy edebilir.

Her şeyi manuel code review ile kontrol etmek kısa vadede mümkün görünse de ölçek büyüdükçe sürdürülebilir değildir.

K04'ün temel problemi burada ortaya çıkıyor:

> **Güvenlik kuralları sadece dokümantasyonda bulunmamalı, cluster tarafından da uygulanabilmeli.**

OWASP bu noktada özellikle Admission Controller, Pod Security Admission ve Validating Admission Policy gibi mekanizmaları öne çıkarıyor.

## 7.1 Pod Security Admission

Örneğin namespace seviyesinde:

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: secure-app
  labels:
    pod-security.kubernetes.io/enforce: restricted
    pod-security.kubernetes.io/audit: restricted
    pod-security.kubernetes.io/warn: restricted
```

Böylece namespace'e deploy edilen workload'ların belirlenen Pod Security Standard seviyesine uyması zorunlu hale getirilebilir.

Daha ileri senaryolarda:

* Kyverno
* OPA Gatekeeper
* Kubewarden
* Validating Admission Policy

gibi mekanizmalarla şirketin kendi güvenlik kuralları enforce edilebilir.

Örneğin:

```text
Her deployment:

✓ non-root olmalı
✓ privileged olmamalı
✓ approved registry kullanmalı
✓ resource limit içermeli
✓ latest tag kullanmamalı
```

gibi kurallar merkezi hale getirilebilir.

# 8. K05 – Missing Network Segmentation Controls

Kubernetes'te varsayılan network davranışı oldukça açıktır.

NetworkPolicy uygulanmayan bir namespace'te Pod'lar arasında trafik kısıtlanmış değildir. Kubernetes dokümantasyonuna göre policy bulunmadığında ingress ve egress trafiği varsayılan olarak izinlidir.

Bu durum saldırgan açısından önemli.

Bir web uygulamasında SSRF olduğunu düşünelim:

```text
Attacker
   ↓
Web Application
   ↓
SSRF
   ↓
Internal Service
   ↓
Database
```

Network segmentation yoksa uygulama içerisindeki SSRF, cluster içerisindeki başka servisleri keşfetmek için kullanılabilir.

# 9. Ingress ve Egress neden önemli?

NetworkPolicy'de iki yönü ayrı düşünmek gerekiyor.

### Ingress

Bir Pod'a **kimler bağlanabilir?**

```text
frontend → backend
```

### Egress

Bir Pod **nereye bağlanabilir?**

```text
backend → database
backend → external internet
backend → metadata service
```

Sadece ingress kontrol etmek yeterli değildir.

Örneğin saldırgan webapp'i ele geçirdiyse:

```text
Ingress policy:
"Kim webapp'e girebilir?"
```

sorusunu cevaplar.

Ama saldırgan zaten webapp'in içerisindeyse artık daha önemli soru:

```text
Egress policy:
"Webapp buradan nereye çıkabilir?"
```

olur.

Bu nedenle production ortamlarında mümkün olduğunca **default-deny + explicit allow** yaklaşımı kullanılmalıdır. OWASP K05 de network policy'lerin default-deny yaklaşımıyla başlamasını öneriyor.

## 9.1 Default deny

Örneğin:

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: default-deny-all
spec:
  podSelector: {}

  policyTypes:
    - Ingress
    - Egress
```

Bu manifest namespace'teki Pod'lar için hem gelen hem giden trafiği izole etmeye başlar.

Sonrasında gerekli trafik tek tek açılır.

Örneğin yalnızca frontend'in backend'e erişmesini istiyorsak:

```yaml
ingress:
  - from:
      - podSelector:
          matchLabels:
            app: frontend
    ports:
      - protocol: TCP
        port: 8080
```

Egress için de benzer şekilde:

```yaml
egress:
  - to:
      - podSelector:
          matchLabels:
            app: database
    ports:
      - protocol: TCP
        port: 5432
```

Bu model:

```text
Her şey açık
     ↓
Her şey kapalı
     ↓
Sadece gereken iletişim açık
```

mantığıyla çalışır.

## 9.2 DNS'i unutmayın

Default-deny egress uygulandığında çok sık karşılaşılan bir problem DNS'in çalışmamasıdır.

Çünkü Pod artık CoreDNS'e de erişemeyebilir.

Sonuç:

```bash
curl http://database
```

çalışmaz.

Bu nedenle egress policy tasarlanırken DNS için gerekli UDP/TCP 53 trafiğinin CoreDNS'e izin verilmesi gerekir. Kubernetes dokümantasyonu da default-deny egress'in DNS çözümlemesini engelleyebileceğine özellikle dikkat çekiyor.

# 10. K06 – Overly Exposed Kubernetes Components

Kubernetes API server, kubelet ve etcd gibi bileşenler normal bir web uygulaması gibi internete açılmamalıdır.

Örneğin:

```text
Internet
   │
   ├── Kubernetes API
   ├── Kubelet
   └── etcd
```

gibi bir mimari ciddi risk yaratır.

OWASP K06 kapsamında Kubernetes API'lerinin doğrudan internete açık olmasının hem bilgi sızıntısı hem de ele geçirilmiş credential'ların kötüye kullanılması açısından risk oluşturduğu belirtiliyor.

Özellikle:

```text
Public API
+
Stolen credential
+
Weak RBAC
=
Cluster compromise
```

gibi bir zincir oluşabilir.

Bu nedenle:

* API Server erişimi güvenilir network'lerle sınırlandırılmalı,
* Kubelet portları internete açılmamalı,
* etcd public erişime kapalı tutulmalı,
* yönetim endpoint'leri private network/VPN üzerinden erişilebilir olmalı.

# 11. K07 – Misconfigured And Vulnerable Cluster Components

Kubernetes yalnızca Pod'lardan oluşmuyor.

Arka planda:

```text
kube-apiserver
kubelet
etcd
scheduler
controller-manager
container runtime
CNI
CSI
Ingress Controller
Operators
```

gibi birçok bileşen var.

Bunlardan herhangi birinin yanlış yapılandırılması veya güncel olmayan bir sürüm kullanması cluster güvenliğini etkileyebilir.

OWASP K07 de özellikle cluster bileşenlerinin güvenli yapılandırılması, node hardening ve patch management konularına dikkat çekiyor.

Bu nedenle sadece:

```bash
kubectl apply -f secure-deployment.yaml
```

demek yeterli değil.

Aynı zamanda:

```text
Kubernetes version
CNI
Ingress Controller
Container Runtime
CSI plugins
Operators
Helm charts
Node OS
```

gibi katmanların da düzenli olarak kontrol edilmesi gerekiyor.

Burada Trivy gibi araçlar manifest ve image taraması için kullanılabilir:

```bash
trivy config k8s/
```

ve container image'ları için:

```bash
trivy image example/webapp:1.0
```

gibi kontroller CI/CD sürecine eklenebilir.

# 12. K08 – Cluster To Cloud Lateral Movement

Kubernetes cloud üzerinde çalışıyorsa saldırı yüzeyi cluster ile bitmiyor.

Örneğin AWS üzerinde:

```text
Attacker
   ↓
Compromised Pod
   ↓
Node IAM Role
   ↓
AWS API
   ↓
S3 / RDS / EC2 / Secrets
```

şeklinde bir zincir oluşabilir.

Buradaki kritik problem, Pod'un aslında sadece Kubernetes'e erişmesi gerekirken node'un sahip olduğu cloud yetkilerini miras alabilmesidir.

OWASP K08 bu riski doğrudan cluster-to-cloud lateral movement olarak ele alıyor.

En doğru yaklaşımlardan biri workload'a özel cloud identity kullanmaktır.

Örneğin:

```text
Pod
 │
 └── ServiceAccount
          │
          ↓
    Workload Identity
          │
          ↓
      Cloud IAM
```

Böylece:

```text
Node = S3'e erişebilir
```

yerine:

```text
Webapp Pod = yalnızca gerekli S3 bucket'a erişebilir
```

gibi daha granüler bir model oluşturulur.

Ayrıca metadata service erişimi de sınırlandırılmalıdır.

Örneğin AWS EC2 metadata adresi:

```text
169.254.169.254
```

için NetworkPolicy ile erişim engellenebilir.

Statik cloud credential'larını Pod içine koymak yerine kısa ömürlü ve workload'a özel kimlik mekanizmaları tercih edilmelidir.

# 13. K09 – Broken Authentication Mechanisms

RBAC bize:

> “Kim ne yapabilir?”

sorusunun cevabını verir.

Authentication ise:

> “Bu kişi gerçekten kim?”

sorusunu cevaplar.

Kubernetes API'ye erişim için:

* certificates,
* tokens,
* OIDC,
* JWT

gibi mekanizmalar kullanılabilir.

Ancak yanlış yapılandırılmış authentication mekanizması cluster'ın ilk savunma hattını zayıflatır.

Örneğin uzun ömürlü credential:

```text
Credential
   ↓
Leak
   ↓
Attacker
   ↓
API Server
   ↓
Credential expire olmuyor
```

gibi bir problem oluşturabilir.

OWASP K09 kapsamında mümkün olduğunca güçlü identity provider'lar, MFA, kısa ömürlü token'lar ve production ortamlarında uygun OIDC/JWT tabanlı authentication yaklaşımları öneriliyor.

Ayrıca Pod'un Kubernetes API'ye ihtiyacı yoksa:

```yaml
automountServiceAccountToken: false
```

kullanmak önemli bir hardening adımıdır.

# 14. K10 – Inadequate Logging And Monitoring

Son madde biraz farklı.

Çünkü önceki maddelerde:

```text
Saldırıyı nasıl engellerim?
```

diye soruyorduk.

K10 ise:

> **Saldırı olduğunda bunu nasıl fark ederim?**

sorusunu soruyor.

Kubernetes dinamik bir ortam olduğu için bu özellikle önemli.

Bir Pod bugün:

```text
node-1
```

üzerinde olabilir.

Yarın:

```text
node-3
```

üzerine taşınabilir.

Bir deployment:

```text
webapp-5d8f7
```

iken yeni rollout sonrasında tamamen farklı Pod isimleriyle çalışabilir.

Bu nedenle logların yalnızca container filesystem'inde tutulması yeterli değildir.

## 14.1 Hangi logları takip etmeliyiz?

En azından:

```text
Application Logs
        ↓
Container Logs
        ↓
Node Logs
        ↓
Kubernetes Audit Logs
        ↓
Security Monitoring
        ↓
Alerting / SIEM
```

katmanlarını düşünmek gerekir.

Özellikle Kubernetes Audit Logs çok önemlidir.

Örneğin:

```text
Secret oluşturuldu
ServiceAccount oluşturuldu
ClusterRoleBinding değiştirildi
Pod exec edildi
Deployment değiştirildi
```

gibi olaylar güvenlik açısından ciddi sinyaller olabilir.

OWASP K10, Kubernetes API audit logging'in yanı sıra node ve workload loglarının da merkezi şekilde toplanmasını ve log kaybına karşı dayanıklı bir mimari kurulmasını öneriyor.

# 15. Bütün Top 10'u tek bir saldırı zincirinde düşünmek

Bu maddeleri birbirinden tamamen bağımsız düşünmek yerine bir saldırı zinciri olarak görmek daha doğru.

Örneğin:

```text
              INTERNET
                  │
                  ▼
        K06 - Exposed API
                  │
                  ▼
        K09 - Authentication
                  │
                  ▼
        K02 - Excessive RBAC
                  │
                  ▼
        K01 - Insecure Workload
                  │
                  ▼
        K05 - Flat Network
                  │
                  ▼
       Internal Service / DB
                  │
                  ▼
        K03 - Exposed Secrets
                  │
                  ▼
        K08 - Cloud IAM Abuse
                  │
                  ▼
          Cloud Resources
```

Ve bütün bu süreç:

```text
K10 - Logging & Monitoring
```

tarafından görülmeli.

K04 ise bütün bu yapılandırmaların cluster genelinde gerçekten uygulanmasını sağlamaya çalışıyor.

Bu yüzden Kubernetes güvenliği tek bir YAML dosyasına indirgenemez.

# 16. Güvenli bir Deployment için minimum baseline

K01 tarafında hazırladığımız örneği biraz daha genel hale getirirsek, production workload'larında başlangıç noktası olarak şu kontrolleri düşünebiliriz:

```yaml
spec:
  automountServiceAccountToken: false

  securityContext:
    runAsNonRoot: true
    runAsUser: 1000
    runAsGroup: 1000

    seccompProfile:
      type: RuntimeDefault

  containers:
    - name: app

      securityContext:
        privileged: false
        allowPrivilegeEscalation: false
        readOnlyRootFilesystem: true

        capabilities:
          drop:
            - ALL

      resources:
        requests:
          cpu: "100m"
          memory: "128Mi"

        limits:
          cpu: "500m"
          memory: "256Mi"
```

Buna ek olarak:

```text
❌ hostPath kullanma
❌ hostNetwork kullanma
❌ hostPID kullanma
❌ hostIPC kullanma
❌ privileged kullanma
❌ gereksiz capabilities bırakma
❌ root olarak çalıştırma
❌ gereksiz ServiceAccount token mount etme
❌ limitsiz workload çalıştırma
```

ve:

```text
✅ NetworkPolicy
✅ RBAC least privilege
✅ Pod Security Admission
✅ image scanning
✅ secret management
✅ audit logging
✅ monitoring
```

gibi kontroller eklenebilir.

# 17. Bu yazıyı gerçek bir lab'a dönüştürmek

Bu konuyu sadece teoride bırakmak yerine küçük bir repository şeklinde çalışmak çok daha öğretici olur.

Örneğin proje yapısı:

```text
k8s-top10-security-lab/
│
├── README.md
├── attacks.md
│
├── app/
│   ├── app.py
│   ├── requirements.txt
│   └── Dockerfile
│
├── k01-workload/
│   ├── insecure.yaml
│   └── secure.yaml
│
├── k02-rbac/
│   ├── bad.yaml
│   └── good.yaml
│
├── k03-secrets/
│   ├── insecure.yaml
│   └── secure.yaml
│
├── k04-policy/
│   └── policy.yaml
│
├── k05-network/
│   ├── default-deny.yaml
│   ├── ingress.yaml
│   └── egress.yaml
│
├── k06-exposure/
│   └── hardened-api.yaml
│
├── k07-components/
│   └── checks.md
│
├── k08-cloud/
│   └── metadata-policy.yaml
│
├── k09-auth/
│   └── authentication.md
│
└── k10-monitoring/
    └── audit-policy.yaml
```

Her bölümün aynı mantıkta ilerlemesi okunabilirliği ciddi şekilde artırır:

```text
1. Vulnerable configuration
2. Deploy
3. Observe
4. Attack / verify
5. Apply security control
6. Repeat
7. Explain the difference
```

Örneğin K01:

```text
insecure.yaml
     ↓
kubectl apply
     ↓
UID 0 / writable FS / privilege
     ↓
Test
     ↓
secure.yaml
     ↓
UID 1000 / read-only / no capabilities
     ↓
Test again
```

K03:

```text
cluster-admin
     ↓
API access
     ↓
Secret okunabiliyor
     ↓
least privilege RBAC
     ↓
403 Forbidden
```

K05:

```text
NetworkPolicy yok
     ↓
webapp → database
     ↓
SSRF başarılı
     ↓
default deny
     ↓
explicit allow
     ↓
SSRF → database erişimi engellendi
```

Bu yaklaşım, konuyu “OWASP maddelerini ezberlemekten” çıkarıp gerçekten anlamaya dönüştürüyor.

# 18. K01 + K02 + K05 birlikte neden daha güçlü?

Aslında Kubernetes güvenliğinde tek bir kontrol hiçbir zaman yeterli değil.

Örneğin uygulamada RCE olduğunu düşünelim.

### Sadece K01 uygulanıyorsa

Saldırgan:

```text
RCE
 ↓
non-root shell
```

elde edebilir.

Ama RBAC aşırı genişse:

```text
non-root shell
 ↓
ServiceAccount token
 ↓
Kubernetes API
 ↓
Secret / Pod / Deployment
```

şeklinde ilerleyebilir.

NetworkPolicy de yoksa:

```text
Compromised Pod
 ↓
Internal Network
 ↓
Database
 ↓
Redis
 ↓
Internal API
```

gibi lateral movement başlayabilir.

Bu yüzden:

```text
K01 → Container'ı sınırla
K02 → API yetkisini sınırla
K05 → Network'ü sınırla
K03 → Secret'ı sınırla
K04 → Kuralları merkezi enforce et
K10 → Olanları izle
```

şeklinde katmanlı bir güvenlik modeli oluşturmak daha doğru.

# 19. Kubernetes Security Checklist

Bir workload'u production'a almadan önce en azından şu sorular sorulabilir:

### Workload

```text
[ ] Container root olarak çalışıyor mu?
[ ] runAsNonRoot kullanılıyor mu?
[ ] runAsUser açıkça belirlenmiş mi?
[ ] privileged kapalı mı?
[ ] allowPrivilegeEscalation false mu?
[ ] capabilities drop ALL mı?
[ ] readOnlyRootFilesystem aktif mi?
[ ] Seccomp RuntimeDefault kullanılıyor mu?
[ ] hostPath gerekli mi?
[ ] hostNetwork / hostPID / hostIPC gerekli mi?
[ ] CPU ve memory limitleri var mı?
```

### Kubernetes API / RBAC

```text
[ ] ServiceAccount gerçekten gerekli mi?
[ ] automountServiceAccountToken kapatılabilir mi?
[ ] cluster-admin kullanılıyor mu?
[ ] Wildcard (*) permissions var mı?
[ ] Secret list/watch yetkisi gerçekten gerekli mi?
[ ] Role yerine gereksiz ClusterRole kullanılmış mı?
```

### Network

```text
[ ] Namespace'te NetworkPolicy var mı?
[ ] Default deny uygulanıyor mu?
[ ] Ingress kuralları açıkça tanımlı mı?
[ ] Egress kuralları açıkça tanımlı mı?
[ ] DNS erişimi düşünülmüş mü?
[ ] Database sadece gerekli Pod'lardan erişilebilir mi?
[ ] Cloud metadata endpoint'i engellenmiş mi?
```

### Secrets

```text
[ ] Secret Git'e girmiş mi?
[ ] Secret image içine gömülmüş mü?
[ ] ConfigMap içerisinde credential var mı?
[ ] Secret erişimleri RBAC ile sınırlandırılmış mı?
[ ] Secret rotation yapılıyor mu?
[ ] Mümkünse workload identity kullanılıyor mu?
```

### Cluster

```text
[ ] API Server public erişime açık mı?
[ ] Kubelet internete açık mı?
[ ] etcd erişimi sınırlandırılmış mı?
[ ] Kubernetes güncel mi?
[ ] Node OS güncel mi?
[ ] CNI güncel mi?
[ ] Ingress Controller güncel mi?
[ ] Admission policy mevcut mu?
```

### Monitoring

```text
[ ] Kubernetes audit logging açık mı?
[ ] Container logları merkezi toplanıyor mu?
[ ] Node logları izleniyor mu?
[ ] Şüpheli kubectl exec aktiviteleri izleniyor mu?
[ ] RBAC değişiklikleri izleniyor mu?
[ ] Secret erişimleri izleniyor mu?
[ ] Alerting mekanizması var mı?
```

# Sonuç

OWASP Kubernetes Top 10'un 2025 versiyonuna baktığımızda maddelerin aslında tek bir ortak noktaya bağlandığını görebiliriz:

**Bir saldırganın ilk erişimden sonra ne kadar ileri gidebileceğini sınırlandırmak.**

Bir uygulamada güvenlik açığı olabilir.

Bu gerçekçi bir varsayım.

Asıl soru:

> **Uygulama ele geçirildiğinde saldırganın eline ne kadar yetki geçiyor?**

Eğer container root olarak çalışıyorsa, filesystem writable ise, hostPath mount edilmişse ve gereksiz capabilities açıksa K01 problemi büyüyor.

ServiceAccount `cluster-admin` ise saldırgan Kubernetes API'ye doğru ilerleyebiliyor.

NetworkPolicy yoksa başka Pod'ları keşfedebiliyor.

Secret yönetimi zayıfsa credential'lara ulaşabiliyor.

Cloud IAM yanlış tasarlanmışsa Kubernetes'ten cloud hesabına sıçrayabiliyor.

Ve bütün bunlar loglanmıyorsa olaydan sonra ne olduğunu anlamak bile zorlaşıyor.

Bu yüzden Kubernetes güvenliğini:

```text
                APPLICATION
                     │
              ┌──────▼──────┐
              │     K01     │
              │  Workload   │
              └──────┬──────┘
                     │
          ┌──────────▼──────────┐
          │        K02         │
          │    RBAC / IAM      │
          └──────────┬──────────┘
                     │
          ┌──────────▼──────────┐
          │        K05         │
          │ Network Segments   │
          └──────────┬──────────┘
                     │
          ┌──────────▼──────────┐
          │        K03         │
          │      Secrets       │
          └──────────┬──────────┘
                     │
          ┌──────────▼──────────┐
          │        K08         │
          │   Cloud Identity   │
          └──────────┬──────────┘
                     │
          ┌──────────▼──────────┐
          │        K10         │
          │ Logging / Alerting │
          └────────────────────┘
```

şeklinde katmanlı düşünmek daha doğru.

En önemlisi ise şu:

**Secure Kubernetes, “hiçbir saldırı gerçekleşmez” demek değildir. Secure Kubernetes, bir saldırı gerçekleştiğinde saldırganın hareket alanının mümkün olduğunca küçük kalmasıdır.**

---

## 🙏 Teşekkürler

Kubernetes güvenliği üzerine bu yazıyı hazırlarken Raconf'da aldığım eğitimden ve araştırıp öğrendiğim bilgilerden faydalandım. Bu süreçte bilgi ve deneyimlerini paylaşarak katkı sağlayan **Kadir Arslan Hocama** teşekkür ederim.

## Kaynakça

* [OWASP Kubernetes Top 10 – 2025](https://owasp.org/www-project-kubernetes-top-ten/?utm_source=chatgpt.com)
* [OWASP K01 – Insecure Workload Configurations](https://owasp.org/www-project-kubernetes-top-ten/2025/en/src/K01-Insecure-Workload-Configurations?utm_source=chatgpt.com)
* [OWASP K02 – Overly Permissive Authorization Configurations](https://owasp.org/www-project-kubernetes-top-ten/2025/en/src/K02-Overly-Permissive-Authorization-Configurations?utm_source=chatgpt.com)
* [OWASP K03 – Secrets Management Failures](https://owasp.org/www-project-kubernetes-top-ten/2025/en/src/K03-Secrets-Management-Failures.html?utm_source=chatgpt.com)
* [OWASP K04 – Lack Of Cluster Level Policy Enforcement](https://owasp.org/www-project-kubernetes-top-ten/2025/en/src/K04-Lack-Of-Cluster-Level-Policy-Enforcement?utm_source=chatgpt.com)
* [OWASP K05 – Missing Network Segmentation Controls](https://owasp.org/www-project-kubernetes-top-ten/2025/en/src/K05-Missing-Network-Segmentation-Controls?utm_source=chatgpt.com)
* [OWASP K06 – Overly Exposed Kubernetes Components](https://owasp.org/www-project-kubernetes-top-ten/2025/en/src/K06-Overly-Exposed-Kubernetes-Components?utm_source=chatgpt.com)
* [OWASP K07 – Misconfigured And Vulnerable Cluster Components](https://owasp.org/www-project-kubernetes-top-ten/2025/en/src/K07-Misconfigured-And-Vulnerable-Cluster-Components.html?utm_source=chatgpt.com)
* [OWASP K08 – Cluster-To-Cloud Lateral Movement](https://owasp.org/www-project-kubernetes-top-ten/2025/en/src/K08-Cluster-To-Cloud-Lateral-Movement?utm_source=chatgpt.com)
* [OWASP K09 – Broken Authentication Mechanisms](https://owasp.org/www-project-kubernetes-top-ten/2025/en/src/K09-Broken-Authentication-Mechanisms?utm_source=chatgpt.com)
* [OWASP K10 – Inadequate Logging And Monitoring](https://owasp.org/www-project-kubernetes-top-ten/2025/en/src/K10-Inadequate-Logging-And-Monitoring.html?utm_source=chatgpt.com)
* [Kubernetes – Security Context](https://kubernetes.io/docs/tasks/configure-pod-container/security-context/?utm_source=chatgpt.com)
* [Kubernetes – Network Policies](https://kubernetes.io/docs/concepts/services-networking/network-policies/?utm_source=chatgpt.com)
* [RaConf 2026 Kubernetes Security Training – örnek lab/repository](https://github.com/KadirArslan/RaConf-2026-Kubernetes-Security-Training?utm_source=chatgpt.com)
