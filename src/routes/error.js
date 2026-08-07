const router = require("express").Router();
const errorController = require("../controller/error.controller");

router.get("/", errorController.loggerTest);

module.exports = router;
