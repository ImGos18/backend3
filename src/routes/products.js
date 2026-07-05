const express = require("express");
const router = express.Router();

const Product = require("../models/product");

// CRUD basico de productos. Misma deuda tecnica que el resto:
// validacion manual + acceso directo a DB dentro de la ruta, sin service/repository.

// POST /api/products -> crea un producto
router.post("/", async (req, res) => {
  try {
    const { name, price, stock, status } = req.body;

    // Validacion manual inline.
    if (!name || price === undefined) {
      return res.status(400).send("Faltan datos obligatorios del producto");
    }
    if (typeof price !== "number" || price < 0) {
      return res.status(400).send("El precio debe ser un numero mayor o igual a 0");
    }

    const product = await Product.create({
      name,
      price,
      stock: stock !== undefined ? stock : 0,
      status: status || "available",
    });

    console.log("Product creado:", product._id);
    res.status(201).json(product);
  } catch (error) {
    console.log("Error al crear product:", error.message);
    res.status(500).send("Error del servidor");
  }
});

// GET /api/products -> lista productos
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    console.log("Error al listar products:", error.message);
    res.status(500).send("Error del servidor");
  }
});

// GET /api/products/:id -> obtiene un producto por id
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).send("Producto no encontrado");
    }
    res.json(product);
  } catch (error) {
    console.log("Error al buscar product:", error.message);
    res.status(500).send("Error del servidor");
  }
});

module.exports = router;
