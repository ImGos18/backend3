const express = require("express");
const router = express.Router();
const CouriersController = require("./../controller/couriers.controller");

// POST /api/couriers -> crea un repartidor
router.post("/", CouriersController.create);

// GET /api/couriers -> lista repartidores
router.get("/", CouriersController.getAll);

// GET /api/couriers/:id -> obtiene un repartidor por id
router.get("/:id", CouriersController.getOne);

module.exports = router;
