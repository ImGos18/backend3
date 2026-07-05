const mongoose = require("mongoose");

// Modelo de Order (envio/pedido).
const orderSchema = new mongoose.Schema({
  customerName: { type: String, required: true }, // se mantiene del v1 original
  customer: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  address: { type: String, required: true },
  weight: { type: Number, required: true },
  cost: { type: Number }, // se calcula en la ruta: cost = weight * 10
  status: { type: String, default: "pending" }, // pending | in_transit | delivered
  priority: { type: String, default: "normal" }, // normal | high
  items: [
    {
      name: { type: String },
      quantity: { type: Number },
      price: { type: Number },
    },
  ],
  courierId: { type: mongoose.Schema.Types.ObjectId, ref: "Courier" },
});

module.exports = mongoose.model("Order", orderSchema);
