const app = require("./../app");
const UserModel = require("./../models/user");
const OrderModel = require("./../models/order");
const { USER_ROLES } = require("./../constants/index");

const request = require("supertest");
const { expect } = require("chai");

describe("Orders API", () => {
  it("Deberia responder con una lista de Ordenes", async () => {
    const response = await request(app).get("/api/orders");

    expect(response.status).to.equal(200);
    expect(response.body).to.have.property("status");
    expect(response.body.status).to.equal("sucess");
    expect(response.body).to.have.property("results");
    expect(response.body.results).to.be.a("number");
    expect(response.body).to.have.property("data");
    expect(response.body.data).to.be.an("array");
  });

  it("deberia crear un pedido correctamente", async () => {
    const user = await UserModel.create({
      name: "test",
      email: `test-${Math.random() * 1000}@test.com`,
      role: USER_ROLES.CUSTOMER,
    });

    const response = await request(app)
      .post("/api/orders")
      .send({
        customerName: "August Moore",
        customer: user._id,
        address: "Calle Falsa 123",
        weight: 5,
        priority: "normal",
        items: [{ name: "Caja chica", quantity: 2, price: 100 }],
        courierId: "6a5109685f77fee3c1b0bda8",
      });

    expect(response.status).to.equal(201);
    expect(response.body.status).to.equal("sucess");
    expect(response.body).to.have.property("results");
    expect(response.body.results).to.equal(1);
    expect(response.body).to.have.property("data");
    expect(response.body.data).to.have.property("_id");

    await UserModel.findByIdAndDelete(user._id);
    await OrderModel.findByIdAndDelete(response.body.data._id);
  });

  it("deberia devolver un error si falta algun campo requerido", async () => {
    const user = await UserModel.create({
      name: "test",
      email: `test-${Math.random() * 1000}@test.com`,
      role: USER_ROLES.CUSTOMER,
    });

    const response = await request(app).post("/api/orders").send({
      customer: user._id.toString(),
      address: "av siempreviva 700",
    });

    expect(response.status).to.equal(400);
    expect(response.body).to.have.property("status");
    expect(response.body.status).to.equal("error");
    expect(response.body).to.have.property("error");
    expect(response.body.error).to.equal("MISSING_REQUIRED_FIELDS");
    expect(response.body).to.have.property("message");

    await UserModel.findByIdAndDelete(user._id);
  });

  it("deberia responder con un error si no encuentra la orden", async () => {
    const response = await request(app).get(
      "/api/orders/6a510a52f572b727993cb7d2",
    );

    expect(response.status).to.equal(404);
    expect(response.body).to.have.property("status");
    expect(response.body.status).to.equal("error");
    expect(response.body).to.have.property("error");
    expect(response.body.error).to.equal("ORDER_NOT_FOUND");
    expect(response.body).to.have.property("message");
    expect(response.body.message).to.equal(
      "No se encontro el pedido solicitado",
    );
  });

  it("deberia responder con un error si el id ingresado no es valido para mongoDB", async () => {
    const response = await request(app).get("/api/orders/2");

    expect(response.status).to.equal(400);
    expect(response.body).to.have.property("status", "error");
    expect(response.body).to.have.property("error", "INVALID_OBJECT_ID");
  });
});
