const DeliveriesService = require("../services/deliveries.service");

class DeliveriesController {
  static async create(req, res) {
    try {
      const delivery = await DeliveriesService.create(req.body);

      console.log("Delivery creada:", delivery._id);
      res.status(201).json(delivery);
    } catch (err) {
      console.log("Error al crear delivery:", err.message);
      res.status(500).send("error del servidor");
    }
  }
  static async getAll(req, res) {
    try {
      const deliveries = await DeliveriesService.getAll();
      res.status(200).json({
        status: "sucess",
        results: deliveries.length,
        data: deliveries,
      });
    } catch (err) {
      console.log("Error al Obtener deliveries:", err.message);
      res.status(500).send("error del servidor");
    }
  }

  static async getOne(req, res) {
    try {
      const delivery = await DeliveriesService.getOne(req.params);

      res.json({
        delivery,
        tracking: { status: delivery.status },
      });
    } catch (error) {
      console.log("Error al buscar delivery:", error.message);
      res.status(500).send("Error del servidor");
    }
  }
  static async updateStatus(req, res) {
    try {
      const delivery = await DeliveriesService.updateStatus(
        req.params,
        req.body,
      );

      console.log("Delivery actualizada:", delivery._id, "->", delivery.status);
      res.json(delivery);
    } catch (error) {
      console.log("Error al actualizar delivery:", error.message);
      res.status(500).send("Error del servidor");
    }
  }
}

module.exports = DeliveriesController;
