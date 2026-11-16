# SENTINEL OPS — SOC ve Görev Yönetimi REST API

SENTINEL OPS’u, siber güvenlik operasyonları odağında geliştirdiğim bir REST API projesi olarak tasarlıyorum. Mevcut sürümde JWT ile kimlik doğrulama, yöneticiye özel güvenlik kayıtları ve güvenlik çalışmalarında kullanılabilecek görev yönetimi özellikleri bulunuyor. Projenin kapsamını ilerleyen aşamalarda güvenlik alarmı ve olay yönetimi özellikleriyle genişletmeyi hedefliyorum.

## Kullandığım Teknolojiler

- Node.js
- Express.js
- JavaScript
- JSON
- JWT
- Postman

## Mevcut Özellikler

- JWT ile kullanıcı kimlik doğrulama
- Yöneticiye özel erişim kontrolü
- Başarısız giriş ve yetkisiz erişim gibi güvenlik olaylarını kaydetme
- Görev oluşturma, listeleme, görüntüleme, güncelleme ve silme
- Görevleri çalışanlara atama
- Durum, öncelik, çalışan ve metin aramasına göre görev filtreleme
- Görevleri sayfalama ve oluşturulma zamanına göre sıralama
- İstek verilerini doğrulama
- HTTP isteklerini temel logger middleware’iyle kaydetme
- Görev durumlarına göre raporlama

## Kurulum ve Çalıştırma

Projeyi Windows ortamında çalıştırmak için şu adımları izliyorum:

1. Proje klasörünü terminalde açıyorum.
2. `.env` dosyam yoksa örnek dosyadan oluşturuyorum:

   ```powershell
   Copy-Item .env.example .env

   Var olan .env dosyam varsa üzerine yazmıyorum.
3. .env dosyasında JWT_SECRET, ADMIN_USERNAME ve ADMIN_PASSWORD değerlerini belirliyorum. Yönetici parolasını en az 12 karakter kullanıyorum ve gizli değerleri GitHub’a eklemiyorum.
4. Bağımlılıkları yüklüyorum:
   npm.cmd install
5. API sunucusunu başlatıyorum:
   npm.cmd start
6. API’ye http://localhost:3000 adresinden erişiyorum. GET / isteğiyle sağlık kontrolü yapıyorum.
<!--Kimlik Doğrulama-->
POST /auth/login isteğine yönetici kullanıcı adı ve parolasını JSON olarak gönderiyorum. Başarılı girişte dönen JWT’yi korumalı API isteklerinde şu başlıkla kullanıyorum:
Authorization: Bearer <token>
Postman koleksiyonunda giriş isteği token’ı sonraki isteklerde kullanacak şekilde ayarlanmıştır. Kullanıcı bilgilerini koleksiyon değişkenlerine kendim giriyorum; parola ve token’ı ekran görüntülerine eklemiyorum.
<!--API Uç Noktaları-->
Metot	Yol	Açıklama
GET	    /API’nin çalıştığını kontrol ediyorum.
POST	/auth/register	Yeni kullanıcı kaydı oluşturuyorum.
POST	/auth/login	   Kullanıcı girişi yapıp JWT alıyorum.
GET	    /employees	  Görev ataması yapabileceğim demo çalışanları listeliyorum.
GET	    /tasks	      Görevleri filtreleme, sıralama ve sayfalama seçenekleriyle listeliyorum.
GET	    /tasks       /search?keyword=...	Görev başlığı ve açıklamasında arama yapıyorum.
GET	    /tasks       /assignee/:username	Bir çalışana atanmış görevleri getiriyorum.
GET	    /tasks       /:id	Belirli bir görevin ayrıntılarını görüntülüyorum.
POST	/tasks	     Yeni görev oluşturuyorum.
PUT	    /tasks      /:id	Bir görevi güncelliyorum.
DELETE	/tasks      /:id	Bir görevi siliyorum.
GET	    /reports    /completed	Tamamlanan görevlerin sayısını alıyorum.
GET	    /reports    /pending	Bekleyen görevlerin sayısını alıyorum.
GET	    /reports    /summary	Görevlerin genel durum ve öncelik özetini alıyorum.
GET	    /security   /events	Yönetici yetkisiyle güvenlik kayıtlarını görüntülüyorum.


Görev uç noktalarına erişirken JWT gönderiyorum. GET /tasks isteğinde status, priority, assigneeId, search, page, limit ve sort=createdAt parametrelerini kullanabiliyorum. Birden fazla filtreyi aynı istekte birleştirebiliyorum. Sayfa ve limit değerlerinin pozitif tam sayı olması gerekiyor.
Görevlerde pending, in-progress ve completed durumlarını; low, medium ve high önceliklerini kullanıyorum. assigneeId alanında çalışan numarasını belirtiyorum. Görevi atamasız bırakmak veya atamayı kaldırmak için null gönderiyorum.
<!--Dokümantasyon ve Test Dosyaları-->
- Proje tanıtımı: docs/PROJE-TANITIMI.md
- Veri modeli: docs/VERI-MODELI.md
- API dokümantasyonu: docs/API - DOCUMENTATION.md
- Postman test planı: tests/TEST -CASES.md
- Postman koleksiyonu: postman/SENTINEL-OPS.postman_collection.json
- Postman test kanıtları: docs/evidence/
CRUD isteklerini Postman’de çalıştırıp yanıt durumlarını gösteren ekran görüntülerini docs/evidence/ klasöründe saklıyorum. Ekran görüntülerinde yönetici parolası veya JWT bulundurmuyorum.
<!--Veri Saklama-->
Bu sürümde kullanıcıları, çalışanları ve görevleri bellekte tutuyorum; kalıcı bir veritabanı kullanmıyorum. Bu nedenle sunucu yeniden başladığında görev değişiklikleri başlangıç verilerine dönüyor.
<!--Geliştirme Hedefim-->
SENTINEL OPS’un siber güvenlik odağını daha da belirginleştirmek için projeyi güvenlik alarmı ve olaylarının takibi, önem derecesine göre sınıflandırılması ve analist müdahalelerinin yönetilmesi özellikleriyle genişletmeyi hedefliyorum. Bu özellikleri mevcut Express API yapısını koruyarak geliştireceğim.



### Siber güvenlik özellikleri

Bu projeye, görev yönetimi API’sine ek olarak temel güvenlik olaylarını takip etme özelliği ekledim. Güvenlik olaylarını önem derecesine ve durumuna göre listeleyebiliyorum; yeni olay oluşturabiliyorum. Güvenlik kayıtlarını ise yalnızca yönetici hesabıyla görüntüleyebiliyorum.

- `GET /security/incidents`: Güvenlik olaylarını listeler. `severity` ve `status` parametreleriyle filtreleme yapabilirim.
- `POST /security/incidents`: Yeni bir güvenlik olayı oluşturur.
- `GET /security/events`: Güvenlik kayıtlarını yönetici yetkisiyle listeler.

Olay önem dereceleri `low`, `medium`, `high` ve `critical`; durumlar `open`, `investigating`, `contained` ve `resolved` değerlerini alır. Güvenlik olayları bellekte tutulur; sunucu yeniden başladığında başlangıç verilerine döner.