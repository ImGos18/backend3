const { faker } = require("@faker-js/faker");
const UserService = require("./../services/users.service");
const ProductService = require("../services/products.service");
const CourierService = require("../services/couriers.service");
const OrderService = require("./../services/orders.service");
const DeliveriesService = require("./../services/deliveries.service");
const fillUserData = require("./../../mocks/userMocks");
const fillProdData = require("./../../mocks/productsMock");
const fillOrderData = require("./../../mocks/ordersMock");
const fillCourierData = require("./../../mocks/couriersMock");
const randomNumber = require("./../utils/randomNumber");
const fillDeliveryData = require("../../mocks/deliveryMocks");
const { DEV_TESTING_VALUES } = require("./../constants/index");

class MockController {
  static async mockUsers(req, res) {
    try {
      let users = [];
      for (let i = 0; i < DEV_TESTING_VALUES.mockResults; i++) {
        const userData = fillUserData();

        if (req.method === "POST") {
          const user = await UserService.create(userData);
        }
        users.push(userData);
      }
      res.status(201).json({ status: "ok", results: users.length, users });
    } catch (error) {
      console.log("Error al crear user:", error.message);
      res.status(500).send("Error del servidor");
    }
  }

  static async mockProducts(req, res) {
    try {
      let prods = [];
      for (let i = 0; i < DEV_TESTING_VALUES.mockResults; i++) {
        const productData = fillProdData();
        if (!req.method === "POST") {
          const product = await ProductService.create(productData);
        }
        prods.push(productData);
      }
      res.status(201).json({
        status: "data filled",
        results: prods.length,
        data: prods,
      });
    } catch (error) {
      console.log("Error al crear producto:", error.message);
      res.status(500).send("Error del servidor");
    }
  }

  static async mockCouriers(req, res) {
    try {
      let couriers = [];

      for (let i = 0; i < DEV_TESTING_VALUES.mockResults; i++) {
        const courierData = fillCourierData();
        if (req.method === "POST") {
          const courier = await CourierService.create(courierData);
        }
        couriers.push(courierData);
      }

      res.status(201).json({
        status: "data filled",
        results: couriers.length,
        data: couriers,
      });
    } catch (err) {
      console.log("algo ha salido mal:", err.message);
      res.status(500).send("algo salio mal");
    }
  }

  static async mockOrders(req, res) {
    try {
      const orders = [];

      for (let i = 0; i < DEV_TESTING_VALUES.mockResults; i++) {
        const orderData = await fillOrderData();
        if (req.method === "POST") {
          const order = await OrderService.create(orderData);
        }
        orders.push(orderData);
      }

      res.status(200).json({ orders });
    } catch (err) {
      console.log("ocurrio un error al crear la orden:", err.message);
      res.status(400).send("error interno del servidor");
    }
  }
  static async mockDeliveries(req, res) {
    try {
      const deliveries = [];

      for (let i = 0; i < DEV_TESTING_VALUES.mockResults; i++) {
        const deliveryData = await fillDeliveryData();

        if (req.method === "POST") {
          const delivery = await DeliveriesService.create(deliveryData);
        }

        deliveries.push(deliveryData);
      }

      res.status(201).json({
        status: "ordenes creadas",
        results: deliveries.length,
        deliveries,
      });
    } catch (err) {
      console.log(
        "ocurrio un error al crear las deliveries de prueba:",
        err.message,
      );
      console.log(err);
      res.status(500).send("error del servidor");
    }
  }
}

module.exports = MockController;
