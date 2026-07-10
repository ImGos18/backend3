const { faker } = require("@faker-js/faker");

function fillCourierData() {
  return {
    name: `${faker.location.city()} ${faker.helpers.arrayElement([
      "pickup",
      "express",
      "delivery",
    ])}`,
    zone: faker.helpers.arrayElement(["centro", "nacional", "internacional"]),
    available: faker.helpers.arrayElement([true, false]),
  };
}

module.exports = fillCourierData;
