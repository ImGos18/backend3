const request = require("supertest");
const { expect } = require("chai");
const app = require("../app.js");

describe("Logger API", () => {
  it("Deberia responder con un mensaje indicando que se generaron los logs correctamente", async () => {
    const response = await request(app).get("/api/loggerTest");

    expect(response.status).to.equal(200);
    expect(response.body).to.have.property("message");
    expect(response.body.message).to.equal("Prueba de logger completada");
  });
});
