const USER_ROLES = {
  ADMIN: "admin",
  USER: "user",
};

const PROD_STATES = ["AVAILABLE", "OUT_OF_STOCK"];

Object.freeze(PROD_STATES);
Object.freeze(USER_ROLES);

module.exports = {
  USER_ROLES,
  PROD_STATES,
};
