const mongoose = require("mongoose");

// Modelo de Courier (repartidor).
const courierSchema = new mongoose.Schema({
  name: { type: String, required: true },
  zone: { type: String, required: true },
  available: { type: Boolean, default: true },
});

module.exports = mongoose.model("Courier", courierSchema);
