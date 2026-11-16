const employees = require("../data/employees");

const allowedStatuses = ["pending", "in-progress", "completed"];
const allowedPriorities = ["low", "medium", "high"];
const allowedFields = ["title", "description", "status", "priority", "assigneeId"];

function validateTask(options = {}) {
  return (req, res, next) => {
    const body = req.body;

    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return res.status(400).json({
        success: false,
        message: "İstek gövdesi JSON nesnesi olmalıdır."
      });
    }

    const invalidFields = Object.keys(body).filter(
      (field) => !allowedFields.includes(field)
    );

    if (invalidFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Görev için geçersiz alan gönderildi.",
        fields: invalidFields
      });
    }

    if (options.requireTitle && (typeof body.title !== "string" || body.title.trim() === "")) {
      return res.status(400).json({
        success: false,
        message: "Görev başlığı boş olamaz."
      });
    }

    if (body.title !== undefined && (typeof body.title !== "string" || body.title.trim() === "")) {
      return res.status(400).json({
        success: false,
        message: "Görev başlığı boş olamaz."
      });
    }

    if (body.description !== undefined && typeof body.description !== "string") {
      return res.status(400).json({
        success: false,
        message: "Görev açıklaması metin olmalıdır."
      });
    }

    if (body.status !== undefined && !allowedStatuses.includes(body.status)) {
      return res.status(400).json({
        success: false,
        message: "Geçersiz görev durumu."
      });
    }

    if (body.priority !== undefined && !allowedPriorities.includes(body.priority)) {
      return res.status(400).json({
        success: false,
        message: "Geçersiz görev önceliği."
      });
    }

    if (body.assigneeId !== undefined && body.assigneeId !== null) {
      const employeeExists = Number.isInteger(body.assigneeId) &&
        employees.some((employee) => employee.id === body.assigneeId);

      if (!employeeExists) {
        return res.status(400).json({
          success: false,
          message: "Atanan çalışan bulunamadı."
        });
      }
    }

    next();
  };
}

module.exports = validateTask;
