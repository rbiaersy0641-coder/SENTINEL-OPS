`SENTINEL OPS — Postman Test Planı`
<!--Test Ortamı-->
- API adresi: http://localhost:3000
- Önce /auth/login üzerinden giriş yapıyorum. Korumalı isteklere dönen token’ı Bearer Token olarak ekliyorum.
- Güvenlik için yönetici parolasını ve JWT’yi ekran görüntülerime eklemiyorum.
<!--Zorunlu CRUD Kanıtları-->
ID	İşlem	İstek	Beklenen
TC-01	API sağlık kontrolü	               GET /200; JSON yanıtında status: success
TC-02	Görev listeleme	                   GET /tasks	200; görev listesi
TC-03	Görev detayı	                   GET /tasks/1	200; görev bilgileri
TC-04	Olmayan görev	                   GET /tasks/9999	404
TC-05	Görev oluşturma	Geçerli JSON ile   POST /tasks	201; yeni görev ve id
TC-06	Görev güncelleme	               PUT /tasks/{yeniId}	200; güncellenmiş görev
TC-07	Görev silme	                       DELETE /tasks/{yeniId}	200


TC-05’te oluşturduğum görevin id değerini TC-06 ve TC-07 isteklerinde kullanıyorum. Böylece başlangıç görevlerimi değiştirmeden CRUD akışını test ediyorum.
<!--İsteğe Bağlı Özellik Kontrolleri-->
ID	İşlem	Beklenen
TC-08	GET /employees	200; çalışan listesi
TC-09	GET /tasks?priority=high&assigneeId=1	200; filtreye uyan görevler
TC-10	GET /tasks/search?keyword=API	200; arama sonucundaki görevler
TC-11	GET /tasks/assignee/calisan1	200; çalışana atanmış görevler
TC-12	GET /tasks?sort=createdAt	200; en yeni görev ilk sırada
TC-13	GET /reports/completed	200; sayısal count değeri
TC-14	GET /reports/pending	200; sayısal count değeri
TC-15	GET /reports/summary	200; toplam görev sayısı ve durum özeti
TC-16	Boş görev başlığıyla POST /tasks	400
TC-17	Bilinmeyen assigneeId ile POST /tasks	400
TC-18	Geçersiz alan veya durumla görev isteği	400


<!--Ekran Görüntüsü Kanıtları-->
Zorunlu CRUD isteklerini Postman’de çalıştırıp başarılı yanıtları ve HTTP durum kodlarını gösteren ekran görüntülerini docs/evidence/ klasörüne kaydediyorum. Bu görüntüler test planından ayrı kanıt niteliğindedir. Sadece planın bulunması, testlerin çalıştırıldığını kanıtlamaz.

## Siber güvenlik testleri

Bu bölümde güvenlik olaylarını listeleme, filtreleme, oluşturma ve yetki kontrollerini sınayacağım. Korumalı isteklerde yönetici girişiyle aldığım Bearer Token’ı kullanacağım. Parolayı ve token’ı ekran görüntülerine eklemeyeceğim.

| ID    | İşlem                                    | İstek                                                         | Beklenen |

| TC-19 | Güvenlik olaylarını listeleme            | `GET /security/incidents`                                     | `200 OK`; olay listesi döner |
| TC-20 | Önem derecesine göre filtreleme          | `GET /security/incidents?severity=high`                       | `200 OK`; yalnızca `high` önem dereceli olaylar döner |
| TC-21 | Duruma göre filtreleme                   | `GET /security/incidents?status=investigating`                | `200 OK`; yalnızca `investigating` durumundaki olaylar döner |
| TC-22 | Birden fazla filtre kullanma             | `GET /security/incidents?severity=medium&status=investigating`| `200 OK`; iki koşula da uyan olaylar döner |
| TC-23 | Geçersiz filtre gönderme                 | `GET /security/incidents?severity=urgent`                     | `400 Bad Request`; geçersiz filtre mesajı döner |
| TC-24 | Güvenlik olayı oluşturma                 | `POST /security/incidents` geçerli JSON ile                   | `201 Created`; yeni olay ve `id` değeri döner |
| TC-25 | Oluşturulan olayı listede bulma          | `GET /security/incidents?severity=low`                        | `200 OK`; test sırasında oluşturduğum olay listede görünür |
| TC-26 | Geçersiz önem derecesiyle olay oluşturma | `POST /security/incidents` içinde `severity: "urgent"`        | `400 Bad Request`; izin verilen önem dereceleri belirtilir |
| TC-27 | Tokensız olay listesi isteği | Bearer Token olmadan `GET /security/incidents`                            | `401 Unauthorized` | 
| TC-28 | Yönetici güvenlik kayıtlarını listeleme | Yönetici token’ıyla `GET /security/events`                     | `200 OK`; güvenlik kayıtları döner |

`TC-24` ve `TC-25` testlerini aynı sunucu çalışırken art arda yaparım; çünkü güvenlik olayları bu eğitim sürümünde bellekte tutulur. Test planındaki beklenen sonuçlar, tek başına testlerin çalıştırıldığına dair kanıt sayılmaz. Kanıt için Postman yanıtlarını ayrıca `docs/evidence/` klasörüne kaydederim.