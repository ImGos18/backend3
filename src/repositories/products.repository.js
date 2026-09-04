const Product = require("./../models/product");
const {
  create,
  getAll,
  getOne,
} = require("../utils/repositoriesStandardFunctions");

class ProductRepository {
  static async create({ name, price, stock, status }) {
    const product = await create(Product, {
      name: name,
      price: price,
      stock: stock,
      status: status, // available | out_of_stock
    });

    return product;
  }
  static async findAll({ page, limit }) {
    const products = await getAll(Product, page, limit);

    return products;
  }

  static async getOne({ id }) {
    const product = await getOne(Product, id);

    return product;
  }
}

module.exports = ProductRepository;
