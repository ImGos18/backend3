const dotenv = require("dotenv");

dotenv.config({ quiet: true });

const NODE_ENV = process.env.NODE_ENV || "development";
const TEST_DEFAULTS = {
  PORT: "3000",
  SECRET: "test_secret",
  MONGO_URI: "mongodb://127.0.0.1:27017/shipnow_test",
};
const REQUIRES_ENV_VARS = ["PORT", "SECRET", "MONGO_URI", "NODE_ENV"];

const environment = {
  PORT: process.env.PORT || (NODE_ENV === "test" ? TEST_DEFAULTS.PORT : 8080),
  SECRET:
    process.env.SECRET ||
    (NODE_ENV === "test" ? TEST_DEFAULTS.SECRET : "default_secret"),
  MONGO_URI:
    process.env.MONGO_TEST_URI ||
    process.env.MONGO_URI ||
    (NODE_ENV === "test" ? TEST_DEFAULTS.MONGO_URI : undefined),
  NODE_ENV,
};

for (const key of REQUIRES_ENV_VARS) {
  if (!environment[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

module.exports = environment;
