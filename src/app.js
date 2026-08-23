const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerSpecs = require("./docs/swagger.config");
const config = require("./config/index");
const logger = require("./config/logger");
const connectDB = require("./db");
const healthCheckHTML = require("./utils/healthCheck");

const ordersRouter = require("./routes/orders");
const usersRouter = require("./routes/users");
const couriersRouter = require("./routes/couriers");
const productsRouter = require("./routes/products");
const deliveriesRouter = require("./routes/deliveries");

const {
  errorHandler,
  notFoundHandler,
} = require("./middlewares/error.middleware");
const app = express();

// Middleware para parsear JSON.
app.use(express.json());

// Montamos los routers. Toda la logica vive adentro de las rutas (controllers gordos).
app.use("/api/orders", ordersRouter);
app.use("/api/users", usersRouter);
app.use("/api/couriers", couriersRouter);
app.use("/api/products", productsRouter);
app.use("/api/deliveries", deliveriesRouter);

// Ruta de health check basica.
app.get("/", (req, res) => {
  const responseJSON = {
    status: "up",
    message: "shipNow corriendo correctamente",
  };
  res.status(200).json(responseJSON);
});
if (config.NODE_ENV === "development") {
  const mocksRouter = require("./routes/mocks");
  const loggerTest = require("./routes/loggerTest");
  app.use("/api/mocks", mocksRouter);
  app.use("/api/loggerTest", loggerTest);
}

// Conectamos a la base y levantamos el server.
connectDB();

app.listen(config.PORT, () => {
  logger.info("ShipNow escuchando en el puerto " + config.PORT);
});
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs));
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
