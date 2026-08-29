const mongoose = require("mongoose");
const documentSchema = require("./../schemas/documents");

// Modelo de Courier (repartidor).
const courierSchema = new mongoose.Schema({
  name: { type: String, required: true },
  zone: { type: String, required: true },
  available: { type: Boolean, default: true },
  documents: {
    type: [documentSchema],
    default: [],
  },
});

module.exports = mongoose.model("Courier", courierSchema);
