const app = require("./app");
const config = require("./config");
const logger = require("./config/logger");
const connectDB = require("./db");

async function startServer() {
  await connectDB();

  return app.listen(config.PORT, () => {
    logger.info(`ShipNow escuchando en el puerto ${config.PORT}`);
  });
}

if (require.main === module) {
  startServer().catch((error) => {
    logger.fatal("No se pudo iniciar ShipNow", error);
    process.exitCode = 1;
  });
}

module.exports = startServer;
