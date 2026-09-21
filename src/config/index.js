const dotenv = require("dotenv");

dotenv.config({ quiet: true });

const NODE_ENV = process.env.NODE_ENV;
const isTest = NODE_ENV === "test";
const TEST_DEFAULTS = {
  PORT: "3000",
  SECRET: "test_secret",
  MONGO_URI: "mongodb://127.0.0.1:27017/shipnow_test",
};

const environment = {
  PORT: process.env.PORT || (isTest ? TEST_DEFAULTS.PORT : undefined),

  SECRET: process.env.SECRET || (isTest ? TEST_DEFAULTS.SECRET : undefined),

  MONGO_URI: isTest
    ? process.env.MONGO_TEST_URI || TEST_DEFAULTS.MONGO_URI
    : process.env.MONGO_URI,
  NODE_ENV,
};

const REQUIRES_ENV_VARS = ["PORT", "SECRET", "MONGO_URI", "NODE_ENV"];

for (const key of REQUIRES_ENV_VARS) {
  if (!environment[key]) {
    throw new Error(`Faltan variables de entorno obligatorias: ${key}`);
  }
}

const VALID_ENVIROMENTS = ["development", "test", "production"];

if (!VALID_ENVIROMENTS.includes(environment.NODE_ENV)) {
  throw new Error("NODE_ENV debe ser development, test o production");
}

module.exports = environment;
