
const jwt = require("jsonwebtoken");
const logSecurityEvent = require("./securityLogger");

function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;

 if (!authHeader || !authHeader.startsWith("Bearer ")) {
  logSecurityEvent({
    type: "UNAUTHORIZED_ACCESS",
    path: req.originalUrl,
    method: req.method,
    ip: req.ip
  });

  return res.status(401).json({
    success: false,
    message: "Erişim reddedildi. Giriş tokenı gerekli."
  });
}

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) 
  { logSecurityEvent({
  type: "INVALID_TOKEN",
  path: req.originalUrl,
  method: req.method,
  ip: req.ip
});
    return res.status(401).json({
      success: false,
      message: "Token geçersiz veya süresi dolmuş."
    });
  }
}

module.exports = authenticateToken;
