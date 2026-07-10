const ProductService = require("../services/products.service");

class ProductController {
  static async create(req, res) {
    try {
      const { name, price, stock, status } = req.body;

      const product = await ProductService.create({
        name: name,
        price: price,
        stock: stock,
        status: status,
      });

      console.log("producto creado:", product._id);
      res.status(201).json(product);
    } catch (error) {
      console.log("Error al crear producto:", error.message);
      res.status(500).send("Error del servidor");
    }
  }

  static async getAll(req, res) {
    try {
      const products = await ProductService.findAll();

      res.status(200).json({ status: "success", products });
    } catch (error) {
      console.log("Error al obtener los productos:", error.message);
      res.status(500).send("Error del servidor");
    }
  }

  static async getOne(req, res) {
    const { id } = req.params;
    const product = await ProductService.getOne({ id: id });

    res.status(200).json({ product });
    try {
    } catch (error) {
      console.log(`error al cargar el producto: ${error.message}`);
      res.status(500).send("Error en el servidor");
    }
  }
}

module.exports = ProductController;
