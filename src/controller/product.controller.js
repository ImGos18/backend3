const logger = require("../config/logger");
const ProductService = require("../services/products.service");
const asyncHandler = require("../utils/asyncHandler");
const responseFormat = require("../utils/responseFormat");

exports.create = asyncHandler(async (req, res, next) => {
  const product = await ProductService.create(req.body);

  logger.info(`producto creado: ${product._id}`);
  responseFormat(req, res, 201, product);
});

exports.getAll = asyncHandler(async (req, res, next) => {
  const page = req.query.page || 1;
  const limit = req.query.limit || 10;
  const products = await ProductService.findAll({ page, limit });

  responseFormat(req, res, 200, products);
});

exports.getOne = asyncHandler(async (req, res, next) => {
  const product = await ProductService.getOne(req.params);

  responseFormat(req, res, 200, product);
});
