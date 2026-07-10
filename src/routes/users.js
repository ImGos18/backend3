const express = require("express");
const router = express.Router();
const UserController = require("../controller/user.controller");

// router.get("/test", OrderController.create);

// POST /api/users -> crea un cliente
router.post("/", UserController.create);

// GET /api/users -> lista clientes
router.get("/", UserController.getAll);

// GET /api/users/:id -> obtiene un cliente por id
router.get("/:id", UserController.getOne);

// router.get("/randomUser", async (req, res) => {
//   try {
//     const randomUser = await User.aggregate([
//       { $sample: { size: 1 } },
//       { $project: { _id: 1 } },
//     ]);
//     console.log(randomUser[0]._id.toString());
//     res.status(200).json(randomUser[0]);
//   } catch (err) {
//     console.log("ocurrio un error:", err.message);
//     res.status(500).json(err);
//   }
// });

module.exports = router;
