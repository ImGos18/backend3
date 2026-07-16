const express = require("express");
const router = express.Router();
const OrderController = require("./../controller/orders.controller");

// POST /api/orders -> crea un envio
router.post("/", OrderController.create);

// GET /api/orders -> lista todos los envios
router.get("/", OrderController.getAll);

// GET /api/orders/:id -> obtiene un envio por id
router.get("/:id", OrderController.getOne);

// PATCH /api/orders/:id/status -> cambia el estado de un envio
router.patch("/:id/status", OrderController.updateStatus);

module.exports = router;
