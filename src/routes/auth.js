
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const users = require("../data/users");
const logSecurityEvent = require("../middleware/securityLogger");

require("dotenv").config();

const router = express.Router();

// Geçici geliştirme anahtarı.
// Bir sonraki aşamada bunu .env dosyasına taşıyacağız.
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET .env dosyasında tanımlanmalıdır.");
}

// Kullanıcı kaydı
router.post("/register", async (req, res) => {
  const { username, password } = req.body;

  if (
    typeof username !== "string" ||
    username.trim() === "" ||
    typeof password !== "string" ||
    password.length < 8
  ) {
    return res.status(400).json({
      success: false,
      message: "Kullanıcı adı zorunludur; parola en az 8 karakter olmalıdır."
    });
  }

  const normalizedUsername = username.trim().toLowerCase();

  const existingUser = users.find(
    (user) => user.username === normalizedUsername
  );

  if (existingUser) {
    return res.status(409).json({
      success: false,
      message: "Bu kullanıcı adı zaten kayıtlı."
    });
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const newUser = {
    id: users.length > 0
      ? Math.max(...users.map((user) => user.id)) + 1
      : 1,
    username: normalizedUsername,
    passwordHash,
    role: "user"
  };

  users.push(newUser);

  return res.status(201).json({
    success: true,
    message: "Kullanıcı başarıyla oluşturuldu.",
    data: {
      id: newUser.id,
      username: newUser.username,
      role: newUser.role
    }
  });
});

// Kullanıcı girişi
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (
    typeof username !== "string" ||
    typeof password !== "string" ||
    username.trim() === "" ||
    password === ""
  ) {
    return res.status(400).json({
      success: false,
      message: "Kullanıcı adı ve parola zorunludur."
    });
  }

  const normalizedUsername = username.trim().toLowerCase();

  const user = users.find(
    (item) => item.username === normalizedUsername
  );

  
if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
  logSecurityEvent({
    type: "LOGIN_FAILED",
    username: normalizedUsername,
    ip: req.ip
  });

  return res.status(401).json({
    success: false,
    message: "Kullanıcı adı veya parola hatalı."
  });
}
logSecurityEvent({
  type: "LOGIN_SUCCESS",
  username: normalizedUsername,
  userId: user.id,
  ip: req.ip
});

  const token = jwt.sign(
    {
      sub: String(user.id),
      role: user.role
    },
    JWT_SECRET,
    { expiresIn: "90d" }
  );

  return res.json({
    success: true,
    message: "Giriş başarılı.",
    token
  });
});

module.exports = router;
