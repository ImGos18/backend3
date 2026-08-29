const mongoose = require("mongoose");
const { USER_ROLES } = require("./../constants/index");
const documentSchema = require("./../schemas/documents");

// Modelo de User (cliente).
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  role: { type: String, default: USER_ROLES.USER }, // customer | admin
  documents: {
    type: [documentSchema],
    default: [],
  },
});

module.exports = mongoose.model("User", userSchema);
