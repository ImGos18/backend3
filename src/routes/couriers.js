const express = require("express");
const router = express.Router();
const CouriersController = require("./../controller/couriers.controller");
const { uploadCourierLicense } = require("../middlewares/upload.middleware");

// POST /api/couriers -> crea un repartidor
router.post("/", CouriersController.create);

// GET /api/couriers -> lista repartidores
router.get("/", CouriersController.getAll);

// GET /api/couriers/:id -> obtiene un repartidor por id
router.get("/:id", CouriersController.getOne);

//POST /api/couriers/:id/documents -> sube la licencia de conducir al repartidor
router.post(
  "/:id/documents",
  uploadCourierLicense,
  CouriersController.uploadDocument,
);

module.exports = router;
