const express = require("express");
const router = express.Router();
const ProductController = require("./../controller/product.controller");
const config = require("./../config/index");
const product = require("../models/product");

// POST /api/products -> crea un producto
router.post("/", ProductController.create);

// GET /api/products -> lista productos
router.get("/", ProductController.getAll);

// GET /api/products/:id -> obtiene un producto por id
router.get("/:id", ProductController.getOne);

module.exports = router;
