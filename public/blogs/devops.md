# DevOps Rehberi

> Yazılım geliştirme (**Development**) ve operasyon (**Operations**) ekiplerini tek bir kültür, süreç ve araç zinciri etrafında buluşturma yaklaşımı.

![DevOps - Development ve Operations'ı bir araya getirmek](/blogs/img/devops/D_1.jpeg)

---

## İçindekiler

1. [DevOps Nedir?](#1-devops-nedir)
2. [Neden DevOps?](#2-neden-devops)
3. [DevOps Yaşam Döngüsü](#3-devops-yaşam-döngüsü)
4. [Temel Prensipler](#4-temel-prensipler)
5. [CI/CD](#5-cicd)
6. [Altyapı ve Bulut Operasyonları](#6-altyapı-ve-bulut-operasyonları)
7. [DevOps Ekosistemi ve Araçlar](#7-devops-ekosistemi-ve-araçlar)
8. [DevSecOps: Sürekli Güvenlik](#8-devsecops-sürekli-güvenlik)
9. [Metrikler (DORA)](#9-metrikler-dora)
10. [Başlangıç Yol Haritası](#10-başlangıç-yol-haritası)

---

## 1. DevOps Nedir?

DevOps, **Development** (Geliştirme) ve **Operations** (Operasyon) kelimelerinin birleşiminden doğan bir kültür ve pratikler bütünüdür. Amaç; yazılımı **daha hızlı, daha güvenilir ve daha sürekli** biçimde üretmek, yayına almak ve işletmektir.

Geleneksel modelde geliştiriciler kodu yazıp "duvarın üzerinden" operasyon ekibine atardı. DevOps bu duvarı kaldırır:

| Geleneksel Model | DevOps Modeli |
|---|---|
| Ayrı, silolaşmış ekipler | Ortak sorumluluk, tek ekip kültürü |
| Manuel dağıtım | Otomatik dağıtım |
| Nadir ve büyük sürümler | Sık ve küçük sürümler |
| Hata geç fark edilir | Erken ve sürekli geri bildirim |
| "Bende çalışıyordu" | Tekrarlanabilir ortamlar |

---

## 2. Neden DevOps?

- **Hızlı teslimat:** Yeni özellikler günler/haftalar yerine saatler içinde canlıya çıkabilir.
- **Yüksek kalite:** Otomatik testler hataları erken yakalar.
- **Güvenilirlik:** Otomasyon, insan kaynaklı hataları azaltır.
- **Ölçeklenebilirlik:** Altyapı kodla yönetildiği için büyümek kolaylaşır.
- **Daha iyi iş birliği:** Ekipler aynı hedef için çalışır.
- **Hızlı iyileşme:** Sorunlar izleme sayesinde hızlıca tespit edilir ve geri alınabilir.

---

## 3. DevOps Yaşam Döngüsü

DevOps, sonsuzluk (∞) işaretiyle gösterilir; çünkü süreç hiç bitmeyen bir **geri bildirim döngüsüdür**. Sol taraf *Development*, sağ taraf *Operations* sürecini temsil eder.

![DevOps sonsuzluk döngüsü](/blogs/img/D_1.jpeg)

### Development (Geliştirme) Tarafı

| Aşama | Açıklama |
|---|---|
| **Planlama & Kodlama (Coding)** | Gereksinimler belirlenir, kod yazılır ve Git gibi sistemlerle versiyonlanır. |
| **Derleme (Building)** | Kod derlenir, bağımlılıklar çözülür, artifact/imaj üretilir. |
| **Test (Testing)** | Birim, entegrasyon ve uçtan uca testler otomatik çalışır. |

### Operations (Operasyon) Tarafı

| Aşama | Açıklama |
|---|---|
| **Yayınlama (Deploying)** | Uygulama test/staging/production ortamlarına dağıtılır. |
| **İşletme (Operating)** | Uygulama canlı ortamda çalıştırılır ve yönetilir. |
| **İzleme (Monitoring)** | Performans, hata ve kullanıcı davranışı gözlemlenir. |
| **Bakım (Maintaining)** | Güncellemeler, yamalar ve iyileştirmeler yapılır. |

### Köprü Kavramlar

- **Continuous Integration (Sürekli Entegrasyon)** – Kodun sık sık birleştirilip otomatik doğrulanması.
- **Continuous Delivery (Sürekli Teslimat)** – Doğrulanmış kodun her an yayına hazır tutulması.
- **Collaboration (İş Birliği)** – Ekipler arası ortak sorumluluk.
- **Automation (Otomasyon)** – Tekrarlayan işlerin makineye devredilmesi.
- **Feedback (Geri Bildirim)** – Operasyondan gelen verinin geliştirmeye geri akması.

---

## 4. Temel Prensipler

Sıkça **CALMS** çerçevesiyle özetlenir:

| Harf | Anlamı | Açıklama |
|---|---|---|
| **C** | Culture (Kültür) | Güven, şeffaflık, suçlamayan hata kültürü |
| **A** | Automation (Otomasyon) | Build, test, deploy, altyapı otomasyonu |
| **L** | Lean | Küçük partiler, israfı azaltma, akışı hızlandırma |
| **M** | Measurement (Ölçüm) | Her şeyi ölç, veriye göre karar ver |
| **S** | Sharing (Paylaşım) | Bilgi, araç ve sorumluluk paylaşımı |

---

## 5. CI/CD

**CI/CD**, DevOps'un omurgasıdır.

```
Kod → Commit → Build → Test → Artifact → Deploy (Staging) → Onay/Test → Deploy (Production)
        └──────── CI ────────┘            └────────────── CD ──────────────┘
```

- **CI (Continuous Integration):** Geliştiriciler kodu sık sık ortak depoya gönderir; her push otomatik build ve testten geçer.
- **Continuous Delivery:** Kod her zaman yayına hazırdır, canlıya çıkış manuel onayla yapılır.
- **Continuous Deployment:** Testleri geçen her değişiklik otomatik olarak canlıya alınır.

### Örnek: GitHub Actions ile Basit CI Hattı

```yaml
name: CI

on:
  push:
    branches: [ main ]
  pull_request:

jobs:
  build-and-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm test
      - run: npm run build
```

---

## 6. Altyapı ve Bulut Operasyonları

Modern DevOps, ölçeklenebilir bulut altyapısı üzerinde çalışır. Aşağıdaki görsel; geliştirme, otomasyon ve operasyon katmanlarının bir "komuta merkezi" altında birleşmesini temsil eder.

![DevOps Command Center - Ölçeklenebilir Bulut Altyapısı](/blogs/img/devops/D_2.jpeg)

### Görselde Öne Çıkan Bileşenler

| Bileşen | Açıklama |
|---|---|
| **Container Orchestration** | Konteynerlerin (Docker) Kubernetes gibi araçlarla yönetilmesi, ölçeklenmesi ve iyileştirilmesi. |
| **Continuous Integration & Testing** | Kodun otomatik derlenip test edilmesi. |
| **Automation (Otomasyon hattı)** | Konveyör bandı gibi çalışan CI/CD pipeline'ı. |
| **Continuous Delivery & Monitoring** | Yayın sonrası sürekli izleme ve teslimat. |
| **Logging & Metrics** | Log toplama ve metrik analizi (gözlemlenebilirlik). |
| **Security Scanning** | Kod, bağımlılık ve imaj güvenlik taraması. |
| **Global Cloud Operations Hub** | Tüm operasyonların merkezi yönetimi. |

### Infrastructure as Code (IaC)

Altyapı, elle değil **kodla** tanımlanır. Böylece sürümlenebilir, tekrarlanabilir ve denetlenebilir hale gelir.

```hcl
# Terraform örneği
resource "aws_instance" "web" {
  ami           = "ami-0abcdef1234567890"
  instance_type = "t3.micro"

  tags = {
    Name = "devops-web"
  }
}
```

### Gözlemlenebilirliğin Üç Sütunu

1. **Logs (Kayıtlar)** – Ne oldu?
2. **Metrics (Metrikler)** – Ne kadar / ne sıklıkla?
3. **Traces (İzler)** – İstek sistemde nereden geçti?

---

## 7. DevOps Ekosistemi ve Araçlar

DevOps tek bir araç değil, birbirine entegre çalışan geniş bir **ekosistemdir**. Üçüncü görsel; harici entegrasyonları, küresel çok bulutlu ağları ve sürekli güvenliği bir bütün olarak gösterir.

![DevOps Universe - Entegre Sistemler](/blogs/img/devops/D_3.jpeg)

### Görselde Öne Çıkan Bileşenler

- **External Integrations:** Üçüncü parti araçlar ve API'ler (Jenkins, Git, Terraform vb.).
- **Global Ecosystem:** Dağıtık ağlar ve çoklu bulut (multi-cloud) mimarisi.
- **Continuous Security:** Pipeline içine gömülü güvenlik taraması.
- **Monitoring Drones:** Sistemi 7/24 izleyen otomatik gözlemleme ajanları.

### Kategorilere Göre Popüler Araçlar

| Kategori | Araçlar |
|---|---|
| **Versiyon Kontrol** | Git, GitHub, GitLab, Bitbucket |
| **CI/CD** | Jenkins, GitHub Actions, GitLab CI, CircleCI, Argo CD |
| **Konteynerleştirme** | Docker, Podman |
| **Orkestrasyon** | Kubernetes, Docker Swarm, Nomad |
| **IaC** | Terraform, Pulumi, AWS CloudFormation |
| **Konfigürasyon Yönetimi** | Ansible, Chef, Puppet |
| **İzleme & Log** | Prometheus, Grafana, ELK Stack, Datadog |
| **Güvenlik** | Trivy, SonarQube, Snyk, HashiCorp Vault |
| **Bulut Sağlayıcıları** | AWS, Azure, Google Cloud |

---

## 8. DevSecOps: Sürekli Güvenlik

Güvenlik, sürecin sonunda eklenen bir adım değil, **tüm yaşam döngüsüne yayılan** bir sorumluluktur ("Shift Left").

| Aşama | Güvenlik Uygulaması |
|---|---|
| Kodlama | Secret taraması, güvenli kodlama standartları |
| Build | SAST (statik analiz), bağımlılık taraması |
| Test | DAST (dinamik analiz), sızma testleri |
| Deploy | İmaj taraması, politika kontrolleri |
| Operasyon | Çalışma zamanı izleme, erişim denetimi, anomali tespiti |

---

## 9. Metrikler (DORA)

DevOps başarısı **DORA metrikleri** ile ölçülür:

| Metrik | Ne Ölçer? |
|---|---|
| **Deployment Frequency** | Ne sıklıkla canlıya çıkılıyor? |
| **Lead Time for Changes** | Commit'ten canlıya geçiş süresi |
| **Change Failure Rate** | Değişikliklerin yüzde kaçı hataya yol açıyor? |
| **Time to Restore Service (MTTR)** | Bir arıza ne kadar sürede düzeliyor? |

---

## 10. Başlangıç Yol Haritası

1. **Temelleri öğren:** Linux, ağ temelleri, bir programlama/script dili (Bash, Python).
2. **Git'te ustalaş:** Branch, merge, pull request akışları.
3. **CI/CD kur:** Basit bir projeye GitHub Actions veya GitLab CI ekle.
4. **Docker öğren:** Uygulamanı konteynerleştir.
5. **Bulut platformu seç:** AWS, Azure veya GCP ile başla.
6. **Kubernetes'e geç:** Orkestrasyon ve ölçekleme.
7. **IaC uygula:** Terraform ve Ansible ile altyapıyı kodla.
8. **İzleme ekle:** Prometheus + Grafana ile gözlemlenebilirlik kur.
9. **Güvenliği entegre et:** Pipeline'a tarama adımları ekle.
10. **Sürekli iyileştir:** Metrikleri takip et, geri bildirimle geliştir.

---

## Özet

> **DevOps = Kültür + Otomasyon + Ölçüm + Paylaşım**
>
> Amaç; yazılımı daha hızlı, daha güvenli ve daha güvenilir biçimde sürekli olarak teslim etmek ve bu süreci geri bildirimle durmadan iyileştirmektir.

---

*Not: Görseller `images/` klasöründedir; `devops.md` ile aynı dizinde tutulduğunda Markdown görüntüleyicilerde (GitHub, VS Code, Typora vb.) doğru şekilde görünür.*
