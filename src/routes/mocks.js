const express = require("express");
const router = express.Router();
const MocksController = require("./../controller/mocks.controller");
const OrderService = require("../services/orders.service");
const asyncHandler = require("../utils/asyncHandler");

router.use("/Users", asyncHandler(MocksController.mockUsers));

router.use("/Products", asyncHandler(MocksController.mockProducts));

router.use("/Couriers", asyncHandler(MocksController.mockCouriers));

router.use("/Orders", asyncHandler(MocksController.mockOrders));

router.use("/Deliveries", asyncHandler(MocksController.mockDeliveries));

module.exports = router;
