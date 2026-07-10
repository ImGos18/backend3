const USER_ROLES = {
  ADMIN: "admin",
  CUSTOMER: "customer",
};

const PROD_STATES = { AVAILABLE: "available", OUT_OF_STOCK: "out_of_stock" };

const ORDER_STATUS = {
  PENDING: "pending",
  IN_TRANSIT: "in_transit",
  DELIVERED: "delivered",
};

const ORDER_PRIORITY = { NORMAL: "normal", HIGH: "high" };

const TRACKING_STATES = {
  ASSIGNED: "assigned",
  IN_TRANSIT: "in_transit",
  OUT_FOR_DELIVERY: "out_for_delivery",
  DELIVERED: "delivered",
};
const DEV_TESTING_VALUES = {
  mockResults: 100,
};

Object.freeze(PROD_STATES);
Object.freeze(USER_ROLES);
Object.freeze(ORDER_STATUS);
Object.freeze(ORDER_PRIORITY);

module.exports = {
  USER_ROLES,
  PROD_STATES,
  ORDER_STATUS,
  ORDER_PRIORITY,
  DEV_TESTING_VALUES,
  TRACKING_STATES,
};
