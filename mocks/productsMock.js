const { faker } = require("@faker-js/faker");

const { PROD_STATES } = require("../src/constants/index");

function fillProdData() {
  return {
    name: faker.commerce.productName(),
    price: faker.number.int({ min: 10, max: 100 }),
    stock: faker.number.int({ min: 10, max: 100 }),
    status: faker.helpers.objectValue(PROD_STATES), // customer | admin
  };
}

module.exports = fillProdData;
