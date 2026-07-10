const OrderService = require("./../services/orders.service");
class OrderController {
  static async create(req, res) {
    try {
      const orderCreated = await OrderService.create(req.body);

      console.log("orden creada con exito:", orderCreated);
      res.status(201).json({ status: "sucess", data: orderCreated });
    } catch (err) {
      console.log("ocurrio un error al crear el producto:", err.message);
      res.status(500).send("error interno en el servidor ");
    }
  }
  static async getOne(req, res) {
    try {
      const order = await OrderService.getOne(req.params);
      res.status(200).json({ status: "sucess", data: order });
    } catch (error) {
      console.log("Error al encontrar la orden:", error.message);
      res.status(500).send("Error del servidor");
    }
  }
  static async updateStatus(req, res) {
    try {
      const orderUpdated = await OrderService.updateStatus(
        req.params,
        req.body,
      );
      // console.log(
      //   "Order actualizada:",
      //   orderUpdated._id,
      //   "->",
      //   orderUpdated.status,
      // );
      res.status(200).json({ status: "sucess", data: orderUpdated });
    } catch (error) {
      console.log("Error al actualizar el estado:", error.message);
      res.status(500).send("error del servidor");
    }
  }
}

module.exports = OrderController;
