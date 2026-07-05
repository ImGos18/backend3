const express = require("express");
const router = express.Router();

const Courier = require("../models/courier");

// CRUD basico de repartidores. Misma deuda tecnica que el resto:
// validacion + acceso a DB dentro de la ruta, sin service/repository.

// POST /api/couriers -> crea un repartidor
router.post("/", async (req, res) => {
  try {
    const { name, zone, available } = req.body;

    // Validacion manual inline.
    if (!name || !zone) {
      return res.status(400).send("Faltan datos obligatorios del repartidor");
    }

    const courier = await Courier.create({
      name,
      zone,
      available: available !== undefined ? available : true,
    });

    console.log("Courier creado:", courier._id);
    res.status(201).json(courier);
  } catch (error) {
    console.log("Error al crear courier:", error.message);
    res.status(500).send("Error del servidor");
  }
});

// GET /api/couriers -> lista repartidores
router.get("/", async (req, res) => {
  try {
    const couriers = await Courier.find();
    res.json(couriers);
  } catch (error) {
    console.log("Error al listar couriers:", error.message);
    res.status(500).send("Error del servidor");
  }
});

// GET /api/couriers/:id -> obtiene un repartidor por id
router.get("/:id", async (req, res) => {
  try {
    const courier = await Courier.findById(req.params.id);
    if (!courier) {
      return res.status(404).send("Repartidor no encontrado");
    }
    res.json(courier);
  } catch (error) {
    console.log("Error al buscar courier:", error.message);
    res.status(500).send("Error del servidor");
  }
});

module.exports = router;
