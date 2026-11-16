const express = require("express");
const tasks = require("./data/tasks");
const employees = require("./data/employees");
const logger = require("./middleware/logger");
const validateTask = require("./middleware/validateTask");
require("dotenv").config();
const bcrypt = require("bcryptjs");
const users = require("./data/users");
const authRoutes = require("./routes/auth");
const authenticateToken = require("./middleware/authMiddleware");
const securityRoutes = require("./routes/security");

const app = express();
const PORT = 3000;
const allowedStatuses = ["pending", "in-progress", "completed"];
const allowedPriorities = ["low", "medium", "high"];

// İlk yönetici hesabını oluştur
async function setupAdmin() {
  const adminUsername = process.env.ADMIN_USERNAME?.trim().toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminUsername || !adminPassword) {
    throw new Error("ADMIN_USERNAME ve ADMIN_PASSWORD .env dosyasında tanımlanmalıdır.");
  }

  if (adminPassword.length < 12) {
    throw new Error("Yönetici parolası en az 12 karakter olmalıdır.");
  }

  const existingAdmin = users.find((user) => user.username === adminUsername);

  if (existingAdmin) {
    existingAdmin.role = "admin";
    return;
  }

  const passwordHash = await bcrypt.hash(adminPassword, 12);

  users.push({
    id: users.length > 0 ? Math.max(...users.map((user) => user.id)) + 1 : 1,
    username: adminUsername,
    passwordHash,
    role: "admin"
  });

  console.log("Yönetici hesabı hazırlandı.");
}

// Genel middleware ve mevcut API grupları
app.use(express.json());
app.use(logger);
app.use("/auth", authRoutes);
app.use("/security", securityRoutes);



// API sağlık kontrolü
app.get("/", (req, res) => {
  res.json({
    message: "SENTINEL OPS API çalışıyor!",
    status: "success"
  });
});

// Atama yapılabilecek çalışanları getir
app.get("/employees", authenticateToken, (req, res) => {
  res.json({
    success: true,
    count: employees.length,
    data: employees
  });
});

// Anahtar kelimeyle görev ara
app.get("/tasks/search", authenticateToken, (req, res) => {
  const keyword = req.query.keyword;

  if (typeof keyword !== "string" || keyword.trim() === "") {
    return res.status(400).json({
      success: false,
      message: "Arama için keyword parametresi gereklidir."
    });
  }

  const normalizedKeyword = keyword.trim().toLowerCase();
  const results = tasks.filter((task) =>
    `${task.title} ${task.description}`.toLowerCase().includes(normalizedKeyword)
  );

  res.json({ success: true, count: results.length, data: results });
});

// Bir çalışana atanmış görevleri getir
app.get("/tasks/assignee/:username", authenticateToken, (req, res) => {
  const username = req.params.username.toLowerCase();
  const employee = employees.find((item) => item.username === username);

  if (!employee) {
    return res.status(404).json({
      success: false,
      message: "Çalışan bulunamadı."
    });
  }

  const assignedTasks = tasks.filter((task) => task.assigneeId === employee.id);
  res.json({ success: true, count: assignedTasks.length, data: assignedTasks });
});

// Görevleri filtrele, sırala ve sayfala
app.get("/tasks", authenticateToken, (req, res) => {
  const { status, priority, assigneeId, search, page = 1, limit = 5, sort } = req.query;
  const pageNumber = Number(page);
  const limitNumber = Number(limit);

  if (!Number.isInteger(pageNumber) || pageNumber < 1 || !Number.isInteger(limitNumber) || limitNumber < 1) {
    return res.status(400).json({
      success: false,
      message: "Sayfa ve limit değerleri pozitif tam sayı olmalıdır."
    });
  }

  if (sort !== undefined && sort !== "createdAt") {
    return res.status(400).json({
      success: false,
      message: "Sıralama için yalnızca createdAt kullanılabilir."
    });
  }

  if (status !== undefined && !allowedStatuses.includes(status)) {
    return res.status(400).json({ success: false, message: "Geçersiz görev durumu filtresi." });
  }

  if (priority !== undefined && !allowedPriorities.includes(priority)) {
    return res.status(400).json({ success: false, message: "Geçersiz öncelik filtresi." });
  }

  let filteredTasks = [...tasks];

  if (status) {
    filteredTasks = filteredTasks.filter((task) => task.status === status);
  }

  if (priority) {
    filteredTasks = filteredTasks.filter((task) => task.priority === priority);
  }

  if (assigneeId !== undefined) {
    const assigneeNumber = Number(assigneeId);
    if (!Number.isInteger(assigneeNumber) || assigneeNumber < 1) {
      return res.status(400).json({ success: false, message: "Çalışan numarası pozitif tam sayı olmalıdır." });
    }
    filteredTasks = filteredTasks.filter((task) => task.assigneeId === assigneeNumber);
  }

  if (search !== undefined) {
    if (typeof search !== "string") {
      return res.status(400).json({ success: false, message: "Arama metni geçerli olmalıdır." });
    }
    const keyword = search.trim().toLowerCase();
    filteredTasks = filteredTasks.filter((task) =>
      `${task.title} ${task.description}`.toLowerCase().includes(keyword)
    );
  }

  if (sort === "createdAt") {
    filteredTasks.sort((first, second) =>
      new Date(second.createdAt) - new Date(first.createdAt)
    );
  }

  const startIndex = (pageNumber - 1) * limitNumber;
  const paginatedTasks = filteredTasks.slice(startIndex, startIndex + limitNumber);

  res.json({
    success: true,
    count: filteredTasks.length,
    page: pageNumber,
    limit: limitNumber,
    data: paginatedTasks
  });
});

// Tek bir görevin ayrıntısını getir
app.get("/tasks/:id", authenticateToken, (req, res) => {
  const id = Number(req.params.id);
  const task = tasks.find((item) => item.id === id);

  if (!task) {
    return res.status(404).json({ success: false, message: "Görev bulunamadı." });
  }

  res.json({ success: true, data: task });
});

// Yeni görev oluştur
app.post("/tasks", authenticateToken, validateTask({ requireTitle: true }), (req, res) => {
  const { title, description = "", status = "pending", priority = "medium", assigneeId = null } = req.body;
  const newTask = {
    id: tasks.length > 0 ? Math.max(...tasks.map((task) => task.id)) + 1 : 1,
    title: title.trim(),
    description,
    status,
    priority,
    assigneeId,
    createdAt: new Date().toISOString()
  };

  tasks.push(newTask);
  return res.status(201).json({ success: true, message: "Görev başarıyla oluşturuldu.", data: newTask });
});

// Görevi güncelle
app.put("/tasks/:id", authenticateToken, validateTask(), (req, res) => {
  const id = Number(req.params.id);
  const taskIndex = tasks.findIndex((task) => task.id === id);

  if (taskIndex === -1) {
    return res.status(404).json({ success: false, message: "Görev bulunamadı." });
  }

  tasks[taskIndex] = { ...tasks[taskIndex], ...req.body };
  if (typeof req.body.title === "string") {
    tasks[taskIndex].title = req.body.title.trim();
  }

  res.json({ success: true, message: "Görev başarıyla güncellendi.", data: tasks[taskIndex] });
});

// Görevi sil
app.delete("/tasks/:id", authenticateToken, (req, res) => {
  const id = Number(req.params.id);
  const taskIndex = tasks.findIndex((task) => task.id === id);

  if (taskIndex === -1) {
    return res.status(404).json({ success: false, message: "Görev bulunamadı." });
  }

  const deletedTask = tasks.splice(taskIndex, 1)[0];
  res.json({ success: true, message: "Görev başarıyla silindi.", data: deletedTask });
});

// Tamamlanan görev sayısını getir
app.get("/reports/completed", authenticateToken, (req, res) => {
  const count = tasks.filter((task) => task.status === "completed").length;
  res.json({ success: true, count });
});

// Bekleyen görev sayısını getir
app.get("/reports/pending", authenticateToken, (req, res) => {
  const count = tasks.filter((task) => task.status === "pending").length;
  res.json({ success: true, count });
});

// Genel görev özeti
app.get("/reports/summary", authenticateToken, (req, res) => {
  const summary = {
    total: tasks.length,
    pending: tasks.filter((task) => task.status === "pending").length,
    inProgress: tasks.filter((task) => task.status === "in-progress").length,
    completed: tasks.filter((task) => task.status === "completed").length,
    highPriority: tasks.filter((task) => task.priority === "high").length
  };

  res.json({ success: true, data: summary });
});

// Yönetici hesabını hazırla ve API sunucusunu başlat
setupAdmin()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`SENTINEL OPS sunucusu http://localhost:${PORT} adresinde çalışıyor.`);
    });
  })
  .catch((error) => {
    console.error("Sunucu başlatılamadı:", error.message);
    process.exit(1);
  });
