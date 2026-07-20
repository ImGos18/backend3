const AppError = require("../errors/AppError");
const { ERROR_CODES } = require("../errors/error-codes");
const ProductRepository = require("../repositories/products.repository");
const { PROD_STATES } = require("./../constants/index");

class ProductService {
  static async create({ name, price, stock, status }) {
    if (!name || !price || !stock || !status) {
      throw new AppError(400, "Faltan datos obligatorios del producto");
    }

    if (!PROD_STATES[status.toUpperCase()]) {
      throw new AppError(
        404,
        `valor de status fuera de rango, debe ser ${Object.values(PROD_STATES).join(" o ")}`,
      );
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
    if (!id)
      throw new AppError(
        ERROR_CODES.VALIDATION_ERROR,
        "no ingresaste ningun id",
      );
    const product = await ProductRepository.getOne({ id: id });

    if (!product)
      throw new AppError(
        ERROR_CODES.PRODUCT_NOT_FOUND,
        "no se encontro ningun producto",
      );

    return product;
  }
}

module.exports = ProductService;
