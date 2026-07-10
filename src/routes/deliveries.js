const express = require("express");
const router = express.Router();
const DeliveriesController = require("../controller/deliveries.controller");

// POST /api/deliveries -> crea una entrega vinculando order + courier
router.post("/", DeliveriesController.create);

// GET /api/deliveries -> lista entregas
router.get("/", DeliveriesController.getAll);

// GET /api/deliveries/:id -> obtiene una entrega por id (actua como tracking)
router.get("/:id", DeliveriesController.getOne);

// PATCH /api/deliveries/:id/status -> actualiza el estado de una entrega
router.patch("/:id/status", DeliveriesController.updateStatus);

module.exports = router;
