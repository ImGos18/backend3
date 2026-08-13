const router = require("express").Router();
const errorController = require("../controller/loggerTest.controller");

router.get("/", errorController.loggerTest);

module.exports = router;
