const mongoose = require("mongoose"); // ORM -> mongodb
const config = require("./config");

async function connectDB() {
  try {
    await mongoose.connect(config.MONGO_URI);
    console.log("Conectado a MongoDB: Correctamente");
  } catch (error) {
    // Manejo de errores crudo: solo logueamos y matamos el proceso.
    console.log("Error al conectar a MongoDB:", error.message);
    process.exit(1);
  }
}

module.exports = connectDB;
