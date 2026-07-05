const { faker } = require("@faker-js/faker");

const { USER_ROLES } = require("./../src/constants/index");

function fillUserData() {
  return {
    name: `${faker.person.firstName()} ${faker.person.lastName()}`,
    email: faker.internet.email(),
    role: faker.helpers.enumValue(USER_ROLES), // customer | admin
  };
}

module.exports = fillUserData;
