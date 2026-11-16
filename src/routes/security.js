const express = require("express");
const fs = require("fs");
const path = require("path");
const authenticateToken = require("../middleware/authMiddleware");
const requireAdmin = require("../middleware/adminMiddleware");
const incidents = require("../data/incidents");

const router = express.Router();
const logFile = path.join(__dirname, "../../logs/security.log");

const allowedSeverities = ["low", "medium", "high", "critical"];
const allowedStatuses = ["open", "investigating", "contained", "resolved"];



// Günlük güvenlik kayıtlarını yalnızca yöneticinin görüntülemesini sağlıyorum.
router.get("/events", authenticateToken, requireAdmin, (req, res) => {
  fs.readFile(logFile, "utf8", (error, content) => {
    if (error) {
      if (error.code === "ENOENT") {
        return res.json({
          success: true,
          count: 0,
          data: []
        });
      }

      return res.status(500).json({
        success: false,
        message: "Güvenlik kayıtları okunamadı."
      });
    }

    const events = content
      .split("\n")
      .filter((line) => line.trim() !== "")
      .map((line) => {
        try {
          return JSON.parse(line);
        } catch {
          return null;
        }
      })
      .filter((event) => event !== null)
      .reverse();

    return res.json({
      success: true,
      count: events.length,
      data: events
    });
  });
});

// SOC olaylarını listeliyorum; önem derecesi ve durumla filtreleyebiliyorum.
router.get("/incidents", authenticateToken, (req, res) => {
  const { severity, status } = req.query;

  if (severity && !allowedSeverities.includes(severity)) {
    return res.status(400).json({
      success: false,
      message: "Geçersiz önem derecesi filtresi."
    });
  }

  if (status && !allowedStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      message: "Geçersiz olay durumu filtresi."
    });
  }

  let results = [...incidents];

  if (severity) {
    results = results.filter((incident) => incident.severity === severity);
  }

  if (status) {
    results = results.filter((incident) => incident.status === status);
  }

  return res.json({
    success: true,
    count: results.length,
    data: results
  });
});

// Yeni bir SOC olayı oluşturuyorum.
router.post("/incidents", authenticateToken, (req, res) => {
  const { title, description, sourceIp, severity, status = "open" } = req.body;

  if (
    typeof title !== "string" ||
    title.trim() === "" ||
    typeof description !== "string" ||
    description.trim() === "" ||
    typeof sourceIp !== "string" ||
    sourceIp.trim() === ""
  ) {
    return res.status(400).json({
      success: false,
      message: "Başlık, açıklama ve kaynak IP alanları zorunludur."
    });
  }

  if (!allowedSeverities.includes(severity)) {
    return res.status(400).json({
      success: false,
      message: "Önem derecesi low, medium, high veya critical olmalıdır."
    });
  }

  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      message: "Durum open, investigating, contained veya resolved olmalıdır."
    });
  }

  const now = new Date().toISOString();

  const newIncident = {
    id: incidents.length > 0
      ? Math.max(...incidents.map((incident) => incident.id)) + 1
      : 1,
    title: title.trim(),
    description: description.trim(),
    sourceIp: sourceIp.trim(),
    severity,
    status,
    assigneeId: null,
    createdAt: now,
    updatedAt: now
  };

  incidents.push(newIncident);

  return res.status(201).json({
    success: true,
    message: "Güvenlik olayı oluşturuldu.",
    data: newIncident
  });
});

module.exports = router;