<!--Genel Bilgiler-->
- Temel adres: http://localhost:3000
- Veri biçimi: JSON
- Korumalı istekler: Authorization: Bearer <token> başlığını kullanıyorum.
- Görev ve çalışan verilerini bu sürümde bellekte tutuyorum.
<!--Kimlik Doğrulama-->
Metot	Uç nokta	Açıklama
POST	/auth/register	Yeni kullanıcı kaydı oluşturuyorum.
POST	/auth/login	Kullanıcı bilgilerini doğrulayıp JWT döndürüyorum.


<!--Sistem ve Çalışanlar-->
Metot	Uç nokta	Yetki	Açıklama
GET	/	Yok	API’nin çalışıp çalışmadığını kontrol ediyorum.
GET	/employees	Giriş gerekli	Görev ataması yapabileceğim çalışanları listeliyorum.


<!--Görevler-->
Metot	Uç nokta	Açıklama
GET	/ tasks	Görevleri listeliyorum; filtreleme, sıralama ve sayfalama uygulayabiliyorum.
GET	/tasks/search?keyword=...	Başlık ve açıklamalarda arama yapıyorum.
GET	/tasks/assignee/:username	Seçtiğim çalışana atanmış görevleri getiriyorum.
GET	/tasks/:id	Belirli bir görevin ayrıntılarını getiriyorum.
POST	/tasks	Yeni görev oluşturuyorum.
PUT	/tasks/:id	Var olan bir görevi güncelliyorum.
DELETE	/tasks/:id	Bir görevi siliyorum.


Görev uç noktalarına erişmek için giriş yapıp JWT göndermek gerekiyor. GET /tasks isteğinde status, priority, assigneeId, search, page, limit ve sort parametrelerini kullanabiliyorum.
GET /tasks?status=pending&priority=high&assigneeId=1&page=1&limit=5
GET /tasks?sort=createdAt
GET /tasks/search?keyword=backend
GET /tasks/assignee/calisan1
sort=createdAt kullandığımda görevler en yeniden en eskiye doğru sıralanıyor. page ve limit değerlerinin pozitif tam sayı olması gerekiyor. Sıralama için yalnızca createdAt değerini kabul ediyorum.
<!--Görev Oluşturma Örneği-->
{
  "title": "API testlerini tamamla",
  "description": "Görev uçlarını Postman ile kontrol et",
  "status": "pending",
  "priority": "high",
  "assigneeId": 1
}
assigneeId alanında çalışan numarasını kullanıyorum. Bir çalışan atamazsam bu alan null oluyor. Atamayı kaldırmak için güncelleme isteğinde null gönderebiliyorum. Var olmayan bir çalışan numarası gönderildiğinde 400 Bad Request yanıtı dönüyor.
Durum için pending, in-progress veya completed; öncelik için low, medium veya high değerlerini kabul ediyorum. Görev doğrulama middleware’im boş başlığı, geçersiz alanları ve uygun olmayan değerleri 400 Bad Request yanıtıyla reddediyor.
<!--Raporlar-->
Metot	Uç nokta	Açıklama
GET	/reports/completed	Tamamlanan görevlerin sayısını döndürüyorum.
GET	/reports/pending	Bekleyen görevlerin sayısını döndürüyorum.
GET	/reports/summary	Toplam görev sayısını ve durum/öncelik özetini döndürüyorum.


Rapor uç noktalarına erişmek için giriş yapmak gerekiyor. Genel özette total, pending, inProgress, completed ve highPriority sayılarını döndürüyorum.
<!--Güvenlik Olayları-->
Metot	Uç nokta	Yetki	Açıklama
GET	/security/events	Yönetici	Kaydedilen güvenlik olaylarını listeliyorum.


<!--Başlıca HTTP Durum Kodları-->
- 200 OK: Listeleme, detay görüntüleme, güncelleme, silme veya rapor isteği başarılı olduğunda dönüyor.
- 201 Created: Yeni görev oluşturduğumda dönüyor.
- 400 Bad Request: Geçersiz veri, filtre veya sayfalama değeri gönderildiğinde dönüyor.
- 401 Unauthorized: Giriş yapılmadığında veya token geçersiz olduğunda dönüyor.
- 403 Forbidden: İstek için yönetici yetkisi gerektiğinde dönüyor.
- 404 Not Found: İstenen görev veya çalışan bulunamadığında dönüyor.

## Siber güvenlik uç noktaları

Bu projeye güvenlik olaylarını takip edebilmek için iki uç nokta ekledim. Güvenlik olaylarını listeleme ve oluşturma işlemleri Bearer Token gerektirir. Güvenlik kayıtlarını listeleme işlemini yalnızca yönetici hesabına açtım.

| Metot | Uç nokta              | Yetki         | Açıklama                                                 |

| GET   | `/security/events`    | Yönetici      | Kimlik doğrulama ve güvenlikle ilgili kayıtları listeler |
| GET   | `/security/incidents` | Giriş gerekli | Güvenlik olaylarını listeler                             |
| POST  | `/security/incidents` | Giriş gerekli | Yeni bir güvenlik olayı oluşturur                        |

`GET /security/incidents` isteğinde `severity` ve `status` parametreleriyle filtreleme yapabilirim. Önem dereceleri `low`, `medium`, `high` ve `critical`; durumlar `open`, `investigating`, `contained` ve `resolved` değerlerini alır. Geçersiz filtre gönderildiğinde API `400 Bad Request` döndürür.

Örnek filtreli istek:

```http
GET /security/incidents?severity=high&status=open
```

Yeni olay oluştururken `title`, `description` ve `sourceIp` alanlarını gönderirim. `severity` ve `status` alanları da izin verilen değerlerden seçilmelidir. Olayın `id`, `assigneeId`, `createdAt` ve `updatedAt` değerlerini API oluşturur.

```json
{
  "title": "Şüpheli giriş denemeleri",
  "description": "Kısa sürede art arda başarısız giriş denemeleri tespit edildi.",
  "sourceIp": "203.0.113.10",
  "severity": "high",
  "status": "open"
}
```

Güvenlik olayları bu eğitim sürümünde bellekte tutulur; sunucu yeniden başladığında yeni oluşturduğum olaylar başlangıç verilerine döner. Güvenlik kayıtlarını ise `logs/security.log` dosyasından okuyorum.