# SENTINEL OPS — Güvenlik ve Görev Yönetimi REST API

## Projenin Amacı

SENTINEL OPS’u, güvenlik olaylarını ve tehdit uyarılarını takip etmeye yönelik bir REST API projesi olarak geliştiriyorum. Node.js ve Express.js kullandığım bu projede backend geliştirme, API tasarımı, CRUD işlemleri, kimlik doğrulama, yetkilendirme ve Postman testleri konularında öğrendiklerimi uyguluyorum.

## Proje Senaryosu

Bir güvenlik ekibinin karşılaştığı şüpheli olayları kaydedip takip etmesini hedefliyorum. Olayları önem derecesine ve inceleme durumuna göre listeliyorum. Olayların takibi için görevler oluşturuyor, bu görevleri çalışanlara atıyor ve tamamlanma durumlarını izliyorum.

## Proje Özellikleri

- Güvenlik olayı oluşturma ve olayları önem derecesi veya duruma göre listeleme
- REST API uç noktaları üzerinden JSON veri alışverişi
- Görevler için oluşturma, listeleme, detay görüntüleme, güncelleme ve silme işlemleri
- Görevleri çalışanlara atama
- Görevleri durum, öncelik, çalışan ve metin aramasına göre filtreleme
- Görevleri sayfalama ve oluşturulma zamanına göre sıralama
- İstek verilerini doğrulama ve HTTP isteklerini kaydetme
- Başarısız giriş ve yetkisiz erişim gibi güvenlik olaylarını kaydetme
- JWT ile kimlik doğrulama; güvenlik kayıtlarını görüntülemek için yönetici yetkisi
- Görev durumlarına göre rapor oluşturma

## Teknolojiler ve Veri Saklama

Projede Node.js, Express.js ve JavaScript kullanıyorum. API istek ve yanıtlarını JSON biçiminde hazırladım. Kullanıcı, çalışan, görev ve güvenlik olayı verileri bu sürümde bellekte tutuluyor; sunucu yeniden başlatıldığında başlangıç verilerine dönüyor. Güvenlik loglarını `logs/security.log` dosyasına yazıyorum.

## Kurulum ve Çalıştırma

Proje klasöründe bağımlılıkları `npm.cmd install` komutuyla yüklüyorum. `.env` dosyasında `JWT_SECRET`, `ADMIN_USERNAME` ve `ADMIN_PASSWORD` değerlerini tanımladıktan sonra sunucuyu `npm.cmd start` komutuyla başlatıyorum. API `http://localhost:3000` adresinde çalışıyor. Giriş için `/auth/login` uç noktasını kullanıyor, dönen JWT’yi korumalı isteklerde Bearer Token olarak gönderiyorum.

## Projenin Kapsamı

Bu sürümde SENTINEL OPS’un kapsamını REST API, kimlik doğrulama, güvenlik kayıtları, güvenlik olayı takibi, görev atama ve raporlama oluşturuyor. Projede web arayüzü bulunmuyor.