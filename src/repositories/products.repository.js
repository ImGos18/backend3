const Product = require("./../models/product");

class ProductRepository {
  static async create({ name, price, stock, status }) {
    const product = await Product.create({
      name: name,
      price: price,
      stock: stock,
      status: status, // available | out_of_stock
    });

    return product;
  }
  static async findAll() {
    const products = await Product.find();

    return products;
  }

  static async getOne({ id }) {
    const product = await Product.findById(id);

    return product;
  }
}

module.exports = ProductRepository;
