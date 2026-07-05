const mongoose = require("mongoose");

const { USER_ROLES } = require("./../constants/index");

// Modelo de User (cliente).
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  role: { type: String, default: USER_ROLES.USER }, // customer | admin
});

module.exports = mongoose.model("User", userSchema);
