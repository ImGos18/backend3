const { faker } = require("@faker-js/faker");
const OrderService = require("./../src/services/orders.service");
const { ORDER_STATUS, TRACKING_STATES } = require("./../src/constants/index");

async function fillDeliveryData() {
  const [order] = await OrderService.getRandom();
  return {
    orderId: order._id,
    courierId: order.courierId,
    status: faker.helpers.objectValue(TRACKING_STATES),
  };
}

module.exports = fillDeliveryData;
