const express = require("express");
const router = express.Router();

const User = require("../models/user");

const UserController = require("../controller/user.controller");

// POST /api/users -> crea un cliente
router.post("/", UserController.create);

// GET /api/users -> lista clientes
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    console.log("Error al listar users:", error.message);
    res.status(500).send("Error del servidor");
  }
});

// GET /api/users/:id -> obtiene un cliente por id
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).send("Usuario no encontrado");
    }
    res.json(user);
  } catch (error) {
    console.log("Error al buscar user:", error.message);
    res.status(500).send("Error del servidor");
  }
});

module.exports = router;
