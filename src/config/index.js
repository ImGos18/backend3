const dotenv = require("dotenv");

dotenv.config({ path: ".env.example" });

const REQUIRES_ENV_VARS = ["PORT", "SECRET", "MONGO_URI", "NODE_ENV"];

for (const key of REQUIRES_ENV_VARS) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

const config = {
  PORT: process.env.PORT,
  SECRET: process.env.SECRET,
  MONGO_URI: process.env.MONGO_URI,
};

module.exports = config;
