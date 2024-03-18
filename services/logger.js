const winston = require("winston");
const { combine, timestamp, json } = winston.format;
const logger = winston.createLogger({
  level: "info",
  format: combine(
    json(),
    timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
  ),
  defaultMeta: { service: "users-service" },
  transports: [new winston.transports.File({ filename: "webapp.log" })],
});

module.exports = logger;
