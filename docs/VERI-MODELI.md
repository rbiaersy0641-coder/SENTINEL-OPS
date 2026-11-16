<!--Çalışan (Employee)-->
'ALAN'        |      TÜR               |         AÇIKLAMA

`id`          |      number            |         çalışana verdiğim benzersiz numara
`username`    |      string            |         API’de çalışanı tanımlamak için kullandığım ad
`displayname` |      string            |         Çalışanın ekranda gösterilen adı




| Alan          | Tür                  | Zorunluluk       | Açıklama

| `id`          | number               | Sistem üretir    | Her görev için otomatik oluşturulan benzersiz numara
| `title`       | string               | Evet             | Görev başlığı; boş bırakılamaz
| `description` | string               | Hayır            | Görevle ilgili açıklama
| `status`      | string               | Hayır            | Görev durumu: `pending`, `in-progress` veya `completed`; varsayılan değer `pending`
| `priority`    | string               | Hayır            | Görev önceliği: `low`, `medium` veya `high`; varsayılan değer `medium`
| `assigneeId`  | number veya null     | Hayır            | Atanan çalışanın numarası; `null` ise görev bir çalışana atanmamıştır
| `createdAt`   | ISO tarih metni      | Sistem üretir    | Görevin oluşturulduğu tarih ve saat






<!--İlişkiler ve Doğrulama-->
Bir çalışana birden fazla görev atanabilmesini sağladım; her göreve ise en fazla bir çalışan atanabiliyor. assigneeId değeri çalışan listesindeki bir çalışanın id değeri olmalı. Görevi atamasız bırakmak veya mevcut atamayı kaldırmak için null kullanıyorum.
Görev doğrulama middleware’i ile başlığın boş olup olmadığını, açıklamanın metin biçiminde gönderilip gönderilmediğini ve durum ile öncelik değerlerinin izin verilen seçeneklerden biri olup olmadığını kontrol ediyorum. Ayrıca istekte tanımlamadığım alanların gönderilmesini engelliyorum.

<!--Verilerin Saklanması-->
Bu sürümde çalışan ve görev verilerini JavaScript dizilerinde tutuyorum. Henüz kalıcı bir veritabanı kullanmadığım için sunucu yeniden başlatıldığında görevlerde yaptığım değişiklikler başlangıç verilerine dönüyor.

## Güvenlik olayı (`Incident`)

Güvenlik olaylarını `incidents` adlı JavaScript dizisinde tutuyorum. Her olayda şu alanlar bulunur:

| Alan | Tür | Açıklama |

| `id`          | number           | Olay oluşturulurken API’nin verdiği benzersiz numara        |
| `title`       | string           | Olay başlığı                                                |
| `description` | string           | Olayın açıklaması                                           |
| `sourceIp`    | string           | Olayla ilişkili kaynak IP adresi                            |
| `severity`    | string           | `low`, `medium`, `high` veya `critical` önem derecesi       |
| `status`      | string           | `open`, `investigating`, `contained` veya `resolved` durumu |
| `assigneeId`  | number veya null | Sorumlu çalışan numarası; ilk oluşturulduğunda `null`       |
| `createdAt`   | ISO tarih metni  | Oluşturulma zamanı                                          |
| `updatedAt`   | ISO tarih metni  | Son güncellenme zamanı                                      |

Yeni bir güvenlik olayı oluştururken `title`, `description` ve `sourceIp` alanlarını gönderiyorum. Olay numarasını ve tarihleri API oluşturuyor. Eğitim sürümünde olay kayıtlarını kalıcı bir veritabanında saklamadığım için sunucu yeniden başladığında yeni eklenen olaylar bellekte tutulmaz.