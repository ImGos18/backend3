const { faker } = require("@faker-js/faker");
const CourierService = require("./../services/couriers.service");
const fillCourierData = require("./../../mocks/couriersMock");

class CourierController {
  static async create(req, res) {
    try {
      const courier = await CourierService.create(req.body);

      console.log("courier creado:", courier._id);

      res.status(201).json({ courier });
    } catch (err) {
      console.log("algo ha salido mal:", err.message);
      res.status(500).send("error del servidor ");
    }
  }
  static async getAll(req, res) {
    try {
      const allCouriers = await CourierService.getAll();

      res.status(200).json({
        status: "sucess",
        results: allCouriers.length,
        data: allCouriers,
      });
    } catch (err) {
      console.log("error al generar lista: ", err.message);
      res.status(500).send("error del servidor ");
    }
  }
  static async getOne(req, res) {
    try {
      const { id } = req.params;
      const courier = await CourierService.getOne({ id });

      res.status(200).json({ status: "sucess", data: courier });
    } catch (err) {
      console.log(
        "algo salio mal al cargar el courier o no existe:",
        err.message,
      );
      res.status(500).send("error del servidor");
    }
  }
}

module.exports = CourierController;
