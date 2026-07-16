const AppError = require("../errors/AppError");
const { ERROR_CODES } = require("../errors/error-codes");
const CourierService = require("./../services/couriers.service");
const asyncHandler = require("./../utils/asyncHandler");
const responseFormat = require("./../utils/responseFormat");

exports.create = asyncHandler(async (req, res, next) => {
  const courier = await CourierService.create(req.body);

  console.log("courier creado:", courier._id);

  responseFormat(req, res, 201, courier);
});
exports.getAll = asyncHandler(async (req, res, next) => {
  const allCouriers = await CourierService.getAll();

  if (!allCouriers) {
    throw new AppError(ERROR_CODES.ROUTE_NOT_FOUND);
  }

  responseFormat(req, res, 200, allCouriers);
});
exports.getOne = asyncHandler(async (req, res, next) => {
  const courier = await CourierService.getOne(req.params);

  responseFormat(req, res, 200, courier);
});
