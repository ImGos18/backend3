const mongoose = require("mongoose"); // ORM -> mongodb
const config = require("./config");
const logger = require("./config/logger");

async function connectDB() {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  try {
    await mongoose.connect(config.MONGO_URI, {
      serverSelectionTimeoutMS: config.NODE_ENV === "test" ? 15000 : 30000,
    });
    logger.info("Conectado a MongoDB: Correctamente");
    return mongoose.connection;
  } catch (error) {
    logger.fatal("Error al conectar a MongoDB:", error.message);
    throw error;
  }
}

module.exports = connectDB;
