const logSecurityEvent = require("./securityLogger");

function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== "admin") {
    logSecurityEvent({
      type: "ADMIN_ACCESS_DENIED",
      username: req.user?.username,
      userId: req.user?.sub,
      path: req.originalUrl,
      method: req.method,
      ip: req.ip
    });

    return res.status(403).json({
      success: false,
      message: "Bu işlem için yönetici yetkisi gerekli."
    });
  }

  next();
}

module.exports = requireAdmin;