const express = require("express");
const router = express.Router();
const UserController = require("../controller/user.controller");
const upload = require("./../middlewares/upload.middleware");

// router.get("/test", OrderController.create);

// POST /api/users -> crea un cliente
router.post("/", UserController.create);

// GET /api/users -> lista clientes
router.get("/", UserController.getAll);

// GET /api/users/:id -> obtiene un cliente por id
router.get("/:id", UserController.getOne);

//sube un documento a un cliente
router.post(
  "/:id/documents",
  upload.single("document"),
  UserController.uploadUserDocument,
);

module.exports = router;
