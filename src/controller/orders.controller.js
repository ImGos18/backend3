const asyncHandler = require("../utils/asyncHandler");
const responseFormat = require("../utils/responseFormat");
const OrderService = require("./../services/orders.service");

exports.create = asyncHandler(async (req, res, next) => {
  const orderCreated = await OrderService.create(req.body);

  console.log("orden creada con exito:", orderCreated);
  responseFormat(req, res, 201, orderCreated);
});
exports.getOne = asyncHandler(async (req, res, next) => {
  const order = await OrderService.getOne(req.params);

  responseFormat(req, res, 200, order);
});

exports.getAll = asyncHandler(async (req, res, next) => {
  const orders = await OrderService.getAll();
  responseFormat(req, res, 200, orders);
});

exports.updateStatus = asyncHandler(async (req, res, next) => {
  const orderUpdated = await OrderService.updateStatus(req.params, req.body);
  responseFormat(req, res, 200, orderUpdated);
});
