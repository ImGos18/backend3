const { default: mongoose } = require("mongoose");
const AppError = require("../errors/AppError");
const { ERROR_CODES } = require("../errors/error-codes");
const ProductRepository = require("../repositories/products.repository");
const { PROD_STATES } = require("./../constants/index");
const validateFields = require("../utils/validateFields");

class ProductService {
  static async create({ name, price, stock, status }) {
    const requiredFields = ["name", "price", "stock", "status"];

    validateFields({ name, price, stock, status }, requiredFields);

    if (!PROD_STATES[status.toUpperCase()]) {
      throw new AppError(ERROR_CODES.INVALID_PRODUCT_STATE);
    }

    const product = await ProductRepository.create({
      name,
      price,
      stock,
      status,
    });

    return product;
  }
  static async findAll() {
    const products = await ProductRepository.findAll();
    if (!products)
      throw new AppError(
        ERROR_CODES.PRODUCT_NOT_FOUND,
        "no se encontro ningun producto",
      );

    return products;
  }

  static async getOne({ id }) {
    if (!id) throw new AppError(ERROR_CODES.MISSING_OBJECT_ID);

    if (!mongoose.isValidObjectId(id))
      throw new AppError(ERROR_CODES.INVALID_OBJECT_ID);

    const product = await ProductRepository.getOne({ id });

    if (!product) throw new AppError(ERROR_CODES.PRODUCT_NOT_FOUND);

    return product;
  }
}

module.exports = ProductService;
