const swaggerJSDoc = require("swagger-jsdoc");

const swaggeroptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Shipment API",
      version: "1.0.0",
      description:
        "Documentacion de la API ShipNow para gestion de usuarios, pedidos, entregas, mocks, errores y logging",
    },
    servers: [
      {
        url: "http://localhost:8080",
        description: "Servidor local",
      },
    ],
  },
  apis: ["./src/docs/**/*.yaml"],
};
module.exports = swaggerJSDoc(swaggeroptions);
