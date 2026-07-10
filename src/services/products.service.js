const ProductRepository = require("../repositories/products.repository");
const { PROD_STATES } = require("./../constants/index");

class ProductService {
  static async create({ name, price, stock, status }) {
    if (!name || !price || !stock || !status) {
      throw new Error("Faltan datos obligatorios del producto");
    }

    if (!PROD_STATES[status.toUpperCase()]) {
      throw new Error(
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

    return products;
  }

  static async getOne({ id }) {
    const product = await ProductRepository.getOne({ id: id });

    return product;
  }
}

module.exports = ProductService;
