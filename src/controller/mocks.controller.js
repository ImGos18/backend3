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
const AppError = require("../errors/AppError");
const { ERROR_CODES } = require("../errors/error-codes");

class MockController {
  static async mockUsers(req, res) {
    const { mockResults } = req.body;

    if (!mockResults) {
      throw new AppError(
        ERROR_CODES.VALIDATION_ERROR,
        "debes enviar mockResults con el numero de resultados esperado ",
      );
    }

    if (mockResults <= 0 || typeof mockResults !== "number") {
      throw new AppError(ERROR_CODES.INVALID_MOCK_RESULTS);
    }

    let users = [];
    for (let i = 0; i < mockResults; i++) {
      const userData = fillUserData();

      if (req.method === "POST") {
        const user = await UserService.create(userData);
      }
      users.push(userData);
    }
    res.status(201).json({ status: "ok", results: users.length, users });
  }

  static async mockProducts(req, res) {
    const { mockResults } = req.body;

    if (!mockResults) {
      throw new AppError(
        ERROR_CODES.VALIDATION_ERROR,
        "debes enviar mockResults con el numero de resultados esperado ",
      );
    }

    if (mockResults <= 0 || typeof mockResults !== "number") {
      throw new AppError(ERROR_CODES.INVALID_MOCK_RESULTS);
    }

    let prods = [];
    for (let i = 0; i < mockResults; i++) {
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
  }

  static async mockCouriers(req, res) {
    const { mockResults } = req.body;

    if (!mockResults) {
      throw new AppError(
        ERROR_CODES.VALIDATION_ERROR,
        "debes enviar mockResults con el numero de resultados esperado ",
      );
    }

    if (mockResults <= 0 || typeof mockResults !== "number") {
      throw new AppError(ERROR_CODES.INVALID_MOCK_RESULTS);
    }
    let couriers = [];

    for (let i = 0; i < mockResults; i++) {
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
  }

  static async mockOrders(req, res) {
    const { mockResults } = req.body;

    if (!mockResults) {
      throw new AppError(
        ERROR_CODES.VALIDATION_ERROR,
        "debes enviar mockResults con el numero de resultados esperado ",
      );
    }

    if (mockResults <= 0 || typeof mockResults !== "number") {
      throw new AppError(ERROR_CODES.INVALID_MOCK_RESULTS);
    }
    const orders = [];

    for (let i = 0; i < mockResults; i++) {
      const orderData = await fillOrderData();
      if (req.method === "POST") {
        const order = await OrderService.create(orderData);
      }
      orders.push(orderData);
    }

    res.status(200).json({ orders });
  }
  static async mockDeliveries(req, res) {
    const { mockResults } = req.body;

    if (!mockResults) {
      throw new AppError(
        ERROR_CODES.VALIDATION_ERROR,
        "debes enviar mockResults con el numero de resultados esperado ",
      );
    }

    if (mockResults <= 0 || typeof mockResults !== "number") {
      throw new AppError(ERROR_CODES.INVALID_MOCK_RESULTS);
    }
    const deliveries = [];

    for (let i = 0; i < mockResults; i++) {
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
  }
}

module.exports = MockController;
