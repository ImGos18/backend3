const logger = require("../config/logger");
const DeliveriesService = require("../services/deliveries.service");
const asyncHandler = require("../utils/asyncHandler");
const responseFormat = require("../utils/responseFormat");

exports.create = asyncHandler(async (req, res, next) => {
  const delivery = await DeliveriesService.create(req.body);

  logger.info(`Delivery creada: ${delivery._id}`);

  responseFormat(req, res, 201, delivery);
});
exports.getAll = asyncHandler(async (req, res, next) => {
  const page = req.query.page || 1;
  const limit = req.query.limit || 10;
  const deliveries = await DeliveriesService.getAll({ page, limit });
  responseFormat(req, res, 200, deliveries);
});
exports.getOne = asyncHandler(async (req, res, next) => {
  const delivery = await DeliveriesService.getOne(req.params);
  responseFormat(req, res, 200, delivery);
});
exports.updateStatus = asyncHandler(async (req, res, next) => {
  const delivery = await DeliveriesService.updateStatus(req.params, req.body);

  logger.info(`Delivery actualizada: ${delivery._id} -> ${delivery.status}`);
  responseFormat(req, res, 200, delivery);
});
