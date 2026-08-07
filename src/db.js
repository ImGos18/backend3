const mongoose = require("mongoose"); // ORM -> mongodb
const config = require("./config");
const logger = require("./config/logger");
const { log } = require("winston");

async function connectDB() {
  try {
    await mongoose.connect(config.MONGO_URI);
    logger.info("Conectado a MongoDB: Correctamente");
  } catch (error) {
    // Manejo de errores crudo: solo logueamos y matamos el proceso.

    if (error.name == "MongoParseError") {
      logger.fatal("el link de conexion es invalido", error.stack);
      process.exitCode = 1;
    }
    logger.fatal("Error al conectar a MongoDB:", error.message);
    // process.exit(1);
    process.exitCode = 1;
  }
}

module.exports = connectDB;
