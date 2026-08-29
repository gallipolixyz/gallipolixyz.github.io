# Git Cheat Sheet: Günlük Geliştirmede İhtiyacınız Olan Git Komutları

![](/blogs/img/git-cheat-sheet/git.png)

Git kullanmaya yeni başlayanların en sık karşılaştığı problemlerden biri, Git komutlarının sayısının zamanla göz korkutucu hale gelmesidir. `git add`, `git commit`, `git push` gibi temel komutlar kısa sürede öğrenilse de branch yönetimi, değişiklikleri geri alma, commit geçmişini inceleme veya farklı branch'leri birleştirme gibi konular devreye girdiğinde hangi komutun ne işe yaradığını hatırlamak zorlaşabilir.

Tam da bu noktada **Git Cheat Sheet**, geliştiriciler için oldukça kullanışlı bir başvuru kaynağı haline geliyor.

Git'in resmî web sitesinde bulunan Cheat Sheet; repository oluşturmadan commit almaya, branch yönetiminden `rebase` işlemlerine, remote repository ile çalışmaktan Git yapılandırmasına kadar günlük Git kullanımında ihtiyaç duyulan pek çok komutu tek bir sayfada topluyor.

> Git Cheat Sheet'e [git-scm.com/cheat-sheet]([https://git-scm.com/cheat-sheet]%28https://git-scm.com/cheat-sheet%29) adresinden ulaşabilirsiniz.

Bu yazıda Git komutlarını ezberlemek yerine, **hangi durumda hangi Git komutunu kullanmanız gerektiğini** anlamaya çalışacağız.

---

## Git Cheat Sheet Neden Kullanışlı?

Git oldukça geniş bir komut setine sahip. Resmî Git dokümantasyonu; repository oluşturma, snapshot alma, branch ve merge işlemleri, remote repository'lerle çalışma ve değişiklikleri inceleme gibi birçok farklı komut kategorisi sunuyor.

Ancak günlük yazılım geliştirme sürecinde bu komutların tamamını sürekli kullanmayız.

Çoğu geliştiricinin günlük iş akışı kabaca şöyle ilerler:

```text
Projeyi al
   ↓
Değişiklik yap
   ↓
git status
   ↓
git add
   ↓
git commit
   ↓
git push
```

Bazen buna branch işlemleri eklenir:

```text
main
 │
 ├── feature/login
 ├── feature/payment
 └── bugfix/header
```

İşler biraz daha karmaşık hale geldiğinde ise `merge`, `rebase`, `stash`, `reset`, `restore` veya `cherry-pick` gibi komutlara ihtiyaç duyabiliriz.

Git Cheat Sheet'in en büyük avantajı, bütün bu komutları tek bir yerde hızlıca bulabilmemizi sağlamaktır.

---

# 1. Yeni Bir Git Repository Oluşturmak

![](/blogs/img/git-cheat-sheet/repository.png)

Sıfırdan bir proje oluşturuyorsanız ilk kullanacağınız komutlardan biri:

```bash
git init
```

Bu komut bulunduğunuz klasörü bir Git repository'sine dönüştürür.

Örneğin:

```bash
mkdir my-project
cd my-project
git init
```

Bundan sonra Git, proje içerisindeki değişiklikleri takip etmeye başlayabilir.

Eğer zaten Git repository'si olan bir projeyi bilgisayarınıza almak istiyorsanız:

```bash
git clone <url>
```

Örneğin:

```bash
git clone [https://github.com/example/project.git](https://github.com/example/project.git)
```

Buradaki temel fark oldukça basit:

* `git init` → mevcut klasörde yeni repository oluşturur.
* `git clone` → mevcut bir repository'nin kopyasını indirir.

---

# 2. Değişiklikleri Görmek: `git status`

Git kullanırken en sık başvurmanız gereken komutlardan biri:

```bash
git status
```

Bu komut çalışma alanınızın mevcut durumunu gösterir.

Örneğin yeni bir dosya oluşturduğunuzda:

```bash
touch index.html
git status
```

Git size `index.html` dosyasının henüz takip edilmediğini gösterebilir.

Bu nedenle `git status` komutunu Git'in **durum göstergesi** gibi düşünebilirsiniz.

Bir işlem yapmadan önce:

```bash
git status
```

çalıştırmak çoğu zaman iyi bir alışkanlıktır.

Git Cheat Sheet de `git status` komutunu commit hazırlığı bölümünde konumlandırıyor.

---

# 3. Değişiklikleri Stage Etmek: `git add`

Bir dosyada değişiklik yaptığınızda Git'e bu değişikliği bir sonraki commit'e dahil etmek istediğinizi söylemek için `git add` kullanabilirsiniz.

```bash
git add index.html
```

Birden fazla dosyayı eklemek için:

```bash
git add .
```

Burada önemli bir kavram var: **staging area**.

Git'te dosyanın değiştirilmiş olması ile commit'e hazır olması aynı şey değildir.

Basitçe şöyle düşünebiliriz:

```text
Working Directory
       ↓
    git add
       ↓
Staging Area
       ↓
   git commit
       ↓
Repository
```

Daha kontrollü bir staging işlemi yapmak istediğinizde ise:

```bash
git add -p
```

kullanabilirsiniz.

Bu komut, bir dosyanın yalnızca belirli bölümlerini stage etmenize olanak tanır. Git Cheat Sheet'te bu kullanım özellikle belirtiliyor.

---

# 4. Commit Atmak

![](/blogs/img/git-cheat-sheet/commit.jpg)

Stage ettiğiniz değişiklikleri repository geçmişine kaydetmek için:

```bash
git commit -m "Login sayfası eklendi"
```

kullanabilirsiniz.

Örneğin:

```bash
git add .
git commit -m "Add login page"
```

Buradaki commit mesajının anlaşılır olması önemlidir.

Şöyle bir mesaj:

```text
update
```

yerine:

```text
Add login validation
```

gibi yapılan işi anlatan bir mesaj tercih etmek proje geçmişini çok daha okunabilir hale getirir.

Git Cheat Sheet'te ayrıca:

```bash
git commit
```

ve

```bash
git commit -am "message"
```

gibi farklı commit kullanımları da yer alıyor.

---

# 5. Branch Oluşturmak

Modern yazılım geliştirme süreçlerinde branch kullanımı neredeyse standart hale gelmiştir.

Örneğin `main` branch'ine doğrudan kod yazmak yerine yeni bir özellik için:

```bash
git switch -c feature/login
```

komutunu kullanabilirsiniz.

Bu komut yeni bir branch oluşturur ve aynı zamanda o branch'e geçiş yapar.

Mevcut branch'leri görmek için:

```bash
git branch
```

kullanabilirsiniz.

Branch değiştirmek için:

```bash
git switch main
```

Yeni Git kullanımında `git switch`, branch işlemleri için daha anlaşılır bir seçenek sunar. Git Cheat Sheet'te `git switch` ile birlikte eski `git checkout` kullanımı da gösteriliyor.

---

# 6. Değişiklikleri Karşılaştırmak: `git diff`

"Tam olarak neyi değiştirdim?" sorusunun cevabı için:

```bash
git diff
```

kullanabilirsiniz.

Stage edilmiş değişiklikleri görmek için:

```bash
git diff --staged
```

Tüm stage edilmiş ve edilmemiş değişiklikleri HEAD'e göre görmek için:

```bash
git diff HEAD
```

oldukça kullanışlıdır.

Özellikle commit atmadan önce:

```bash
git diff
```

çalıştırmak, yanlışlıkla commit etmek istemediğiniz değişiklikleri fark etmenize yardımcı olabilir.

---

# 7. Commit Geçmişini İncelemek

Git'in en güçlü özelliklerinden biri, projenin geçmişini inceleyebilmemizdir.

Temel olarak:

```bash
git log
```

kullanabilirsiniz.

Daha kısa bir görünüm için:

```bash
git log --oneline
```

Branch yapısını grafik şeklinde görmek için:

```bash
git log --graph
```

kullanabilirsiniz.

Örneğin:

```text
* 91a2f31 Add payment validation
* 72bc123 Add login page
* 54aa912 Initial commit
```

gibi bir çıktı elde edebilirsiniz.

Belirli bir dosyanın geçmişini incelemek için:

```bash
git log <file>
```

kullanabilirsiniz.

Dosyanın geçmişinde yapılan rename işlemlerini de takip etmek istiyorsanız:

```bash
git log --follow <file>
```

oldukça kullanışlıdır. Bu komutlar Git Cheat Sheet'in "Code Archaeology" bölümünde yer alıyor.

---

# 8. `HEAD` Nedir?

Git kullanırken sık sık `HEAD` ifadesiyle karşılaşacaksınız.

Basitçe `HEAD`, üzerinde bulunduğunuz mevcut commit'i ifade eder.

Örneğin:

```text
A --- B --- C
          ↑
         HEAD
```

Bir önceki commit'e referans vermek için:

```bash
HEAD^
```

veya:

```bash
HEAD~1
```

kullanabilirsiniz.

Üç commit önceye gitmek için:

```bash
HEAD~3
```

kullanılabilir.

Git Cheat Sheet'te commit referansları arasında branch, tag, commit ID, remote branch ve `HEAD~3` gibi göreli referanslar da açıklanıyor.

---

# 9. Yanlış Değişiklikleri Geri Almak

![](/blogs/img/git-cheat-sheet/restore.jpg)

Git kullanırken en çok ihtiyaç duyulan konulardan biri de değişiklikleri geri almaktır.

Henüz commit etmediğiniz bir dosyadaki değişikliği geri almak için:

```bash
git restore <file>
```

kullanabilirsiniz.

Örneğin:

```bash
git restore index.html
```

Ancak burada dikkatli olmak gerekir. Bu işlem yaptığınız yerel değişiklikleri kaybetmenize neden olabilir.

Daha tehlikeli komutlardan biri ise:

```bash
git reset --hard
```

komutudur.

Bu nedenle Git'te "geri alma" komutlarını kullanmadan önce hangi değişikliklerin silineceğini anlamak önemlidir.

---

# 10. `git stash`: Değişiklikleri Geçici Olarak Kenara Koymak

Bazen üzerinde çalıştığınız kod henüz commit edilecek durumda değildir fakat başka bir branch'e geçmeniz gerekir.

Örneğin:

```text
feature/login
```

üzerinde çalışıyorsunuz.

Tam o sırada production'da kritik bir hata olduğunu fark ettiniz ve:

```text
main
```

branch'ine geçmeniz gerekiyor.

Değişikliklerinizi commit etmek istemiyorsanız:

```bash
git stash
```

kullanabilirsiniz.

Daha sonra değişikliklerinizi geri almak için:

```bash
git stash pop
```

kullanabilirsiniz.

Bunu, çalışma masanızdaki dosyaları geçici olarak bir çekmeceye koymak gibi düşünebilirsiniz.

---

# 11. `merge` ve `rebase`

Git öğrenirken en çok kafa karıştıran konulardan biri `merge` ve `rebase` arasındaki farktır.

Örneğin:

```text
main
 A---B---C
      \
       D---E
       feature
```

Feature branch'ini `main` ile birleştirmek için:

```bash
git switch main
git merge feature
```

kullanabilirsiniz.

Alternatif olarak feature branch'inde:

```bash
git switch feature
git rebase main
```

yapabilirsiniz.

Basit bir ifadeyle:

* **merge** → branch'lerin geçmişini birleştirir.
* **rebase** → branch'in commit'lerini başka bir temel üzerine yeniden konumlandırır.

Git Cheat Sheet, `merge`, `rebase`, squash merge ve `cherry-pick` işlemlerini ayrı bir bölümde gösteriyor.

Özellikle ekip çalışmasında rebase kullanırken ortak branch'lerin geçmişini değiştirebileceği için ne yaptığınızı bilmeniz önemlidir.

---

# 12. `cherry-pick`: Tek Bir Commit'i Taşımak

Bazen bir branch'teki bütün değişiklikleri değil, yalnızca tek bir commit'i başka bir branch'e almak isteyebilirsiniz.

Bunun için:

```bash
git cherry-pick <commit>
```

kullanılır.

Örneğin:

```text
feature
 A---B---C

main
 A---D
```

`C` commit'indeki değişikliği `main` branch'ine taşımak istediğinizi düşünelim.

Bu durumda:

```bash
git switch main
git cherry-pick C
```

kullanabilirsiniz.

Bu özellik özellikle belirli bir bug fix'i başka bir branch'e taşımak gerektiğinde oldukça işe yarar.

---

# 13. Remote Repository ile Çalışmak

Git yalnızca bilgisayarınızdaki repository'den ibaret değildir. Takım çalışmasında GitHub, GitLab veya benzeri servislerde bulunan remote repository'lerle de çalışırız.

Bir remote eklemek için:

```bash
git remote add origin <url>
```

Sonrasında değişikliklerinizi göndermek için:

```bash
git push origin main
```

veya tracking branch tanımlandıysa:

```bash
git push
```

kullanabilirsiniz.

Yeni oluşturduğunuz bir branch'i ilk kez göndermek için:

```bash
git push -u origin feature/login
```

kullanabilirsiniz.

---

# 14. `git fetch` ve `git pull` Arasındaki Fark

Bu iki komut sık sık birbirine karıştırılır.

```bash
git fetch
```

remote repository'deki değişiklikleri alır ancak mevcut local branch'inizi doğrudan değiştirmez.

```bash
git pull
```

ise remote'daki değişiklikleri alıp mevcut branch'inizle birleştirme veya rebase etme sürecini de gerçekleştirir.

Örneğin:

```bash
git fetch origin main
```

ve:

```bash
git pull --rebase
```

Git Cheat Sheet'te bu iki yaklaşım ayrı ayrı gösteriliyor.

---

# 15. Commit'i Değiştirmek: `git commit --amend`

Bir commit attınız fakat küçük bir dosyayı eklemeyi unuttunuz.

Yeni bir commit oluşturmak yerine son commit'i değiştirmek için:

```bash
git add forgotten-file.js
git commit --amend
```

kullanabilirsiniz.

Commit mesajını da değiştirmek istiyorsanız:

```bash
git commit --amend -m "Add missing validation"
```

gibi bir kullanım tercih edebilirsiniz.

Ancak daha önce remote'a push edilmiş commit'lerde `amend` kullanırken dikkatli olmak gerekir.

---

# 16. `git reflog`: "Git'te Kaybolan" Commit'leri Bulmak

Git'te yanlış bir `reset`, `rebase` veya başka bir history işlemi yaptığınızda işler bir anda korkutucu görünebilir.

İşte bu noktada:

```bash
git reflog
```

çok değerli bir araçtır.

`reflog`, HEAD'in ve branch referanslarının geçmişte nerelerde bulunduğunu görmenize yardımcı olur.

Örneğin yanlışlıkla bir rebase yaptıysanız reflog üzerinden eski commit'i bulup:

```bash
git reset --hard <commit>
```

ile geri dönmek mümkün olabilir.

Git Cheat Sheet de başarısız bir rebase sonrasında `reflog` kullanarak doğru commit'in bulunabileceğini gösteriyor.

---

# Günlük Kullanım İçin Mini Git Cheat Sheet

Bütün bu komutları bir arada görmek isterseniz, günlük geliştirme sürecinde en çok ihtiyaç duyacağınız komutları şöyle özetleyebiliriz:

```bash
# Repository oluştur
git init

# Repository klonla
git clone <url>

# Durumu kontrol et
git status

# Dosya ekle
git add <file>

# Tüm değişiklikleri ekle
git add .

# Commit oluştur
git commit -m "message"

# Branch'leri listele
git branch

# Yeni branch oluştur ve geç
git switch -c feature/example

# Branch değiştir
git switch main

# Değişiklikleri karşılaştır
git diff

# Stage edilmiş değişiklikleri karşılaştır
git diff --staged

# Commit geçmişini gör
git log --oneline

# Değişikliği geçici olarak sakla
git stash

# Stash'i geri getir
git stash pop

# Branch'leri birleştir
git merge <branch>

# Branch'i rebase et
git rebase <branch>

# Remote ekle
git remote add origin <url>

# Değişiklikleri gönder
git push

# Remote değişiklikleri getir
git fetch

# Değişiklikleri getir ve entegre et
git pull

# Son commit'i düzenle
git commit --amend

# Commit geçmişindeki referansları incele
git reflog
```

---

# Sonuç: Git'te Her Komutu Ezberlemek Gerekmiyor

Git öğrenirken yapılan en büyük hatalardan biri, onlarca komutu ezberlemeye çalışmaktır.

Aslında önemli olan komutları ezberlemekten çok, **Git'in çalışma mantığını anlamaktır**.

Şu akışı kavradığınızda Git'in büyük bir kısmı çok daha kolay hale gelir:

```text
Working Directory
       ↓
    git add
       ↓
Staging Area
       ↓
   git commit
       ↓
 Local Repository
       ↓
    git push
       ↓
Remote Repository
```

Bunun üzerine branch mantığını, `merge` ve `rebase` farkını, `stash` kullanımını ve Git geçmişini incelemeyi eklediğinizde günlük yazılım geliştirme süreçlerinin büyük bölümünü rahatlıkla yönetebilirsiniz.

Git'in resmî **Cheat Sheet** sayfası da tam olarak bu noktada hızlı bir referans olarak kullanılabilir. Sayfada repository oluşturma, staging ve commit işlemleri, branch yönetimi, diff, history, merge/rebase, remote işlemleri ve Git konfigürasyonu gibi başlıklar tek bir yerde toplanıyor.

Daha kapsamlı öğrenmek isteyenler için Git'in resmî **Learn** sayfasında ayrıca *Pro Git* kitabı, başlangıç videoları ve diğer öğrenme kaynakları da bulunuyor.

Kısacası Git Cheat Sheet'i bir "Git komutlarını ezberleme listesi" olarak değil, **çalışırken ihtiyaç duyduğunuz komutu hızlıca bulabileceğiniz bir referans** olarak düşünmek çok daha doğru.

> **Git Cheat Sheet:** [https://git-scm.com/cheat-sheet](https://git-scm.com/cheat-sheet)

Git kullanırken her şeyi hatırlamanız gerekmiyor. Önemli olan, ihtiyaç duyduğunuzda doğru komuta ulaşabilmek.
