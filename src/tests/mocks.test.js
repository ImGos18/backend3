const app = require("./../app");
const { expect } = require("chai");
const request = require("supertest");

describe("Mocks API", () => {
  it("Deberia devolver 5 usuarios mock", async () => {
    const response = await request(app).get("/api/mocks/Users").send({
      mockResults: 5,
    });
    expect(response.status).to.be.oneOf([200, 201]);
    expect(response.body).to.have.property("results");
    expect(response.body.results).to.equal(5);
    expect(response.body).to.have.property("status");
    expect(response.body.status).to.equal("ok");
    expect(response.body).to.have.property("users");
    expect(response.body.users).to.be.an("array");
    expect(response.body.users.length).to.equal(5);
  });

  it("deberia responder con un error si el numero de mock es invalido", async () => {
    const response = await request(app).get("/api/mocks/Users").send({
      mockResults: "asdasd",
    });
    expect(response.status).to.equal(400);
    expect(response.body).to.have.property("status");
    expect(response.body.status).to.equal("error");
    expect(response.body).to.have.property("error");
    expect(response.body.error).to.equal("INVALID_MOCK_RESULTS");
  });
});
