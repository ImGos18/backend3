const express = require("express");
const router = express.Router();
const MocksController = require("./../controller/mocks.controller");
const OrderService = require("../services/orders.service");

router.use("/Users", MocksController.mockUsers);

router.use("/Products", MocksController.mockProducts);

router.use("/Couriers", MocksController.mockCouriers);

router.use("/Orders", MocksController.mockOrders);

router.use("/Deliveries", MocksController.mockDeliveries);

module.exports = router;
