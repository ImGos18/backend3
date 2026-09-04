const logger = require("../config/logger");
const asyncHandler = require("../utils/asyncHandler");
const responseFormat = require("../utils/responseFormat");
const OrderService = require("./../services/orders.service");

exports.create = asyncHandler(async (req, res, next) => {
  const orderCreated = await OrderService.create(req.body);

  logger.info(`orden creada con exito: ${orderCreated}`);

  responseFormat(req, res, 201, orderCreated);
});
exports.getOne = asyncHandler(async (req, res, next) => {
  const order = await OrderService.getOne(req.params);

  responseFormat(req, res, 200, order);
});

exports.getAll = asyncHandler(async (req, res, next) => {
  const page = req.query.page || 1;
  const limit = req.query.limit || 10;
  const orders = await OrderService.getAll({ page, limit });
  responseFormat(req, res, 200, orders);
});

exports.updateStatus = asyncHandler(async (req, res, next) => {
  const orderUpdated = await OrderService.updateStatus(req.params, req.body);
  responseFormat(req, res, 200, orderUpdated);
});

exports.uploadOrderProof = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const updatedOrder = await OrderService.addProof(
    id,
    req.file,
    req.documentType,
  );

  logger.info("Comprobante asociado a una orden", {
    orderId: id,
    fileName: req.file.filename,
    documentType: req.documentType,
  });
  responseFormat(req, res, 200, updatedOrder);
});
