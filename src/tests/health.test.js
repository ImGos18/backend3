const { expect } = require("chai");
const request = require("supertest");
const app = require("../app.js");

describe("Health Check", () => {
  it("deberia devolver un json indicando que el servidor esta arriba", async () => {
    const response = await request(app).get("/");
    expect(response.status).to.equal(200);
    expect(response.body).to.have.property("status").that.equals("up");
  });
});

describe("ruta no encontrada", () => {
  it("Deberia responder con un error 404 si una ruta no existe", async () => {
    const response = await request(app).get("/api/ruta-inexistente");

    expect(response.body).to.have.property("status");
    expect(response.body.status).to.equal("error");
    expect(response.body).to.have.property("error");
    expect(response.body.error).to.equal("ROUTE_NOT_FOUND");
    expect(response.body).to.have.property("message");
    expect(response.body.message).to.equal("la ruta no existe");
  });
});

describe("Docs API", () => {
  it("deberia servir la documentacion con swagger", async () => {
    const response = await request(app).get("/api/docs");
    expect(response.status).to.be.oneOf([200, 301, 302]);
  });
});
