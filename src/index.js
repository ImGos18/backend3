const express = require("express");
const config = require("./config");
const connectDB = require("./db");

const ordersRouter = require("./routes/orders");
const usersRouter = require("./routes/users");
const couriersRouter = require("./routes/couriers");
const productsRouter = require("./routes/products");
const deliveriesRouter = require("./routes/deliveries");
const mocksRouter = require("./routes/mocks");
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
  res.send("ShipNow API v1 - corriendo");
});
if (config.NODE_ENV !== "production") {
  app.use("/api/mocks", mocksRouter);
}

// Conectamos a la base y levantamos el server.
connectDB();

app.listen(config.PORT, () => {
  console.log("ShipNow escuchando en el puerto " + config.PORT);
});

app.use(notFoundHandler);
app.use(errorHandler);
