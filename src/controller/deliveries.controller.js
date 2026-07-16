const DeliveriesService = require("../services/deliveries.service");
const asyncHandler = require("../utils/asyncHandler");
const responseFormat = require("../utils/responseFormat");

exports.create = asyncHandler(async (req, res, next) => {
  const delivery = await DeliveriesService.create(req.body);

  console.log("Delivery creada:", delivery._id);
  responseFormat(req, res, 200, delivery);
});
exports.getAll = asyncHandler(async (req, res, next) => {
  const deliveries = await DeliveriesService.getAll();
  responseFormat(req, res, 200, deliveries);
});
exports.getOne = asyncHandler(async (req, res, next) => {
  const delivery = await DeliveriesService.getOne(req.params);
  responseFormat(req, res, 200, delivery);
});
exports.updateStatus = asyncHandler(async (req, res, next) => {
  const delivery = await DeliveriesService.updateStatus(req.params, req.body);

  console.log("Delivery actualizada:", delivery._id, "->", delivery.status);
  responseFormat(req, res, 200, delivery);
});
