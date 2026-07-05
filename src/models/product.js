const mongoose = require("mongoose");

// Modelo de Product (producto del catalogo).
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, default: 0 },
  status: { type: String, default: "available" }, // available | out_of_stock
});

module.exports = mongoose.model("Product", productSchema);
