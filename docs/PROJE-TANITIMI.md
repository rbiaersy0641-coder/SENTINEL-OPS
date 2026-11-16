<!--projenin amacı-->
SENTINEL OPS’u, güvenlik olaylarını ve tehdit uyarılarını takip edebileceğim bir SOC projesi olarak geliştiriyorum. Projem Node.js ve Express.js ile hazırladığım bir REST API’dir. Bu projede backend geliştirme, API tasarımı, CRUD işlemleri, kimlik doğrulama, yetkilendirme ve Postman testleri konularında öğrendiklerimi uyguluyorum.
<!--Proje senaryosu-->
Bir güvenlik ekibinin karşılaştığı şüpheli olayları kaydedip takip edebilmesini hedefliyorum. Olayları önem derecesine göre sınıflandırmak, inceleme durumlarını izlemek ve gerektiğinde müdahale görevleri oluşturmak istiyorum. Ayrıca olaylara yönelik görevleri çalışanlara atayarak bu görevlerin tamamlanma sürecini takip ediyorum.
<!--Proje özellikleri-->
- Güvenlik olaylarını ve tehdit uyarılarını takip etme
- REST API uç noktaları üzerinden JSON veri alışverişi
- Güvenlik olayları ve görevler için oluşturma, listeleme, detay görüntüleme, güncelleme ve silme işlemleri
- Görevleri çalışanlara atama
- Görevleri durum, öncelik, çalışan ve metin aramasına göre filtreleme
- Görevleri sayfalama ve oluşturulma zamanına göre sıralama
- İstek verilerini doğrulama
- Gelen HTTP isteklerini kaydetme
- Başarısız giriş ve yetkisiz erişim gibi güvenlik olaylarını kaydetme
- JWT ile kimlik doğrulama ve yöneticiye özel erişim
- Görevlerin durumuna göre rapor oluşturma
Teknolojiler ve veri saklama
Projede Node.js, Express.js ve JavaScript kullanıyorum. API istek ve yanıtlarını JSON biçiminde hazırladım. Bu sürümde kullanıcı, çalışan ve görev verileri bellekte tutuluyor; sunucu yeniden başlatıldığında görev değişiklikleri başlangıç durumuna dönüyor.
<!--Projeyi çalıştırma-->
1. Proje klasöründe npm install komutunu çalıştırıyorum.
2. .env dosyasında JWT_SECRET, ADMIN_USERNAME ve ADMIN_PASSWORD değerlerini tanımlıyorum. Yönetici parolasını en az 12 karakter belirliyorum ve gizli bilgileri paylaşmıyorum.
3. Sunucuyu npm start komutuyla başlatıyorum. API http://localhost:3000 adresinde çalışıyor.
4. /auth/login uç noktasından giriş yapıyorum. Dönen JWT’yi korumalı isteklerde Authorization: Bearer <token> başlığıyla kullanıyorum.
<!--Projenin kapsamı-->
Bu sürümde SENTINEL OPS’un temelini REST API, kimlik doğrulama, güvenlik kayıtları, görev atama ve raporlama özellikleri oluşturuyor. SOC paneli arayüzünü eklediğimde, API ile çalışan görsel bir katman olarak projeye dahil edeceğim.

Görev yönetimi özelliklerine ek olarak projeye temel bir siber güvenlik katmanı da ekledim. JWT ile kimlik doğrulaması yapıyorum; güvenlik olaylarını önem derecesi ve durum bilgisiyle listeleyip yeni olay oluşturabiliyorum. Kimlik doğrulama ve güvenlik kayıtlarını yalnızca yönetici yetkisiyle görüntülenebilir hâle getirdim. Bu katman, REST API’nin bir parçasıdır; projede web arayüzü bulunmaz.
