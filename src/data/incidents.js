const incidents = [
  {
    id: 1,
    title: "Şüpheli başarısız giriş denemeleri",
    description: "Bir kullanıcı hesabına kısa sürede art arda başarısız giriş denemeleri yapıldı.",
    sourceIp: "192.0.2.45",
    severity: "high",
    status: "open",
    assigneeId: null,
    createdAt: "2026-10-24T08:30:00.000Z",
    updatedAt: "2026-10-24T08:30:00.000Z"
  },
  {
    id: 2,
    title: "Beklenmeyen API istek yoğunluğu",
    description: "Bir kaynaktan kısa süre içinde normalden fazla API isteği alındı.",
    sourceIp: "198.51.100.24",
    severity: "medium",
    status: "investigating",
    assigneeId: 1,
    createdAt: "2026-10-24T09:15:00.000Z",
    updatedAt: "2026-10-24T09:30:00.000Z"
  }
];

module.exports = incidents;