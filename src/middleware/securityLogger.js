
const fs = require("fs");
const path = require("path");

const logFile = path.join(__dirname, "../../logs/security.log");

function logSecurityEvent(event) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    ...event
  };

  fs.appendFile(
    logFile,
    JSON.stringify(logEntry) + "\n",
    "utf8",
    (error) => {
      if (error) {
        console.error("Güvenlik olayı kaydedilemedi:", error.message);
      }
    }
  );
}

module.exports = logSecurityEvent;
