const express = require("express");
const router = express.Router();

const Order = require("../models/order");
const sendNotification = require("../services/notifications");

// POST /api/orders -> crea un envio
router.post("/", async (req, res) => {
  try {
    const { customerName, customer, address, weight, courierId, items, priority } =
      req.body;

    if (!customerName || !address || !weight) {
      return res.status(400).send("Faltan datos obligatorios del envio");
    }
    if (typeof weight !== "number" || weight <= 0) {
      return res.status(400).send("El peso debe ser un numero mayor a 0");
    }

    const shippingCost = weight * 10;

    const order = await Order.create({
      customerName,
      customer: customer || null,
      address,
      weight,
      cost: shippingCost,
      status: "pending",
      priority: priority || "normal",
      items: items || [],
      courierId: courierId || null,
    });

    sendNotification(
      "Nuevo envio creado para " + customerName + " por $" + shippingCost
    );

    console.log("Order creada:", order._id);
    res.status(201).json(order);
  } catch (error) {
    console.log("Error al crear order:", error.message);
    res.status(500).send("Error del servidor");
  }
});

// GET /api/orders -> lista todos los envios
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (error) {
    console.log("Error al listar orders:", error.message);
    res.status(500).send("Error del servidor");
  }
});

// GET /api/orders/:id -> obtiene un envio por id
router.get("/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).send("Envio no encontrado");
    }
    res.json(order);
  } catch (error) {
    console.log("Error al buscar order:", error.message);
    res.status(500).send("Error del servidor");
  }
});

// PATCH /api/orders/:id/status -> cambia el estado de un envio
router.patch("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).send("Falta el status");
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).send("Envio no encontrado");
    }

    order.status = status;
    await order.save();

    console.log("Order actualizada:", order._id, "->", status);
    res.json(order);
  } catch (error) {
    console.log("Error al actualizar order:", error.message);
    res.status(500).send("Error del servidor");
  }
});

module.exports = router;
