const logger = require("../config/logger");

exports.loggerTest = (req, res) => {
  logger.info("Mensaje de prueba de info");
  logger.warning("Mensaje de prueba de warning");
  logger.error("Mensaje de prueba de error");
  logger.fatal("Mensaje de prueba de fatal");

  res.json({ message: "Prueba de logger completada" });
};
