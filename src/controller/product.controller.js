const ProductService = require("../services/products.service");
const asyncHandler = require("../utils/asyncHandler");
const responseFormat = require("../utils/responseFormat");

exports.create = asyncHandler(async (req, res, next) => {
  const product = await ProductService.create(req.body);

  console.log("producto creado:", product._id);
  responseFormat(req, res, 201, product);
});

exports.getAll = asyncHandler(async (req, res, next) => {
  const products = await ProductService.findAll();

  responseFormat(req, res, 200, products);
});

exports.getOne = asyncHandler(async (req, res, next) => {
  const product = await ProductService.getOne(req.params);

  responseFormat(req, res, 200, product);
});
