const express = require("express");
const router = express.Router();
const UserController = require("../controller/user.controller");

router.get("/fillUsers", UserController.fillDB);

module.exports = router;
