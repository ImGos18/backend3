const express = require("express");
const router = express.Router();

const Delivery = require("../models/delivery");
const Order = require("../models/order");
const Courier = require("../models/courier");
const { getTrackingStatus } = require("../services/trackingProvider");

// CRUD basico de entregas (deliveries). Misma deuda tecnica que el resto:
// validacion manual + acceso directo a DB dentro de la ruta, sin service/repository.

// POST /api/deliveries -> crea una entrega vinculando order + courier
router.post("/", async (req, res) => {
  try {
    const { orderId, courierId, status } = req.body;

    // Validacion manual inline.
    if (!orderId || !courierId) {
      return res.status(400).send("Faltan orderId o courierId");
    }

    // Verificamos que existan haciendo las consultas DIRECTO en la ruta (sucio a proposito).
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).send("Order no encontrada");
    }
    const courier = await Courier.findById(courierId);
    if (!courier) {
      return res.status(404).send("Courier no encontrado");
    }

    const delivery = await Delivery.create({
      orderId,
      courierId,
      status: status || "assigned",
      assignedAt: new Date(),
    });

    console.log("Delivery creada:", delivery._id);
    res.status(201).json(delivery);
  } catch (error) {
    console.log("Error al crear delivery:", error.message);
    res.status(500).send("Error del servidor");
  }
});

// GET /api/deliveries -> lista entregas
router.get("/", async (req, res) => {
  try {
    const deliveries = await Delivery.find();
    res.json(deliveries);
  } catch (error) {
    console.log("Error al listar deliveries:", error.message);
    res.status(500).send("Error del servidor");
  }
});

// GET /api/deliveries/:id -> obtiene una entrega por id (actua como tracking)
router.get("/:id", async (req, res) => {
  try {
    const delivery = await Delivery.findById(req.params.id);
    if (!delivery) {
      return res.status(404).send("Delivery no encontrada");
    }

    // Llamada INLINE al "proveedor externo" de tracking (sin abstraccion, a proposito).
    const trackingStatus = getTrackingStatus(delivery._id);

    res.json({
      delivery,
      tracking: { status: trackingStatus },
    });
  } catch (error) {
    console.log("Error al buscar delivery:", error.message);
    res.status(500).send("Error del servidor");
  }
});

// PATCH /api/deliveries/:id/status -> actualiza el estado de una entrega
router.patch("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).send("Falta el status");
    }

    const delivery = await Delivery.findById(req.params.id);
    if (!delivery) {
      return res.status(404).send("Delivery no encontrada");
    }

    delivery.status = status;
    await delivery.save();

    console.log("Delivery actualizada:", delivery._id, "->", status);
    res.json(delivery);
  } catch (error) {
    console.log("Error al actualizar delivery:", error.message);
    res.status(500).send("Error del servidor");
  }
});

module.exports = router;
