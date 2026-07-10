const { faker } = require("@faker-js/faker");
const UserService = require("../src/services/users.service");
const CourierService = require("../src/services/couriers.service");
const {
  PROD_STATES,
  ORDER_STATUS,
  ORDER_PRIORITY,
} = require("./../src/constants/index");

async function fillOrderData() {
  const [user] = await UserService.getRandom();
  const [courier] = await CourierService.getRandom();

  return {
    customerName: user.name,
    customer: user._id,
    address: `${faker.location.street()} ${faker.number.int({ min: 10, max: 12000 })}`,
    weight: faker.number.int({ min: 5, max: 25 }),
    status: faker.helpers.objectValue(ORDER_STATUS),
    priority: faker.helpers.objectValue(ORDER_PRIORITY),
    items: [
      {
        name: faker.commerce.product(),
        quantity: faker.number.int({ min: 1, max: 5 }),
        price: faker.number.int({ min: 10, max: 40 }),
      },
      {
        name: faker.commerce.product(),
        quantity: faker.number.int({ min: 1, max: 5 }),
        price: faker.number.int({ min: 10, max: 40 }),
      },
    ],
    courierId: courier._id,
  };
}

module.exports = fillOrderData;
