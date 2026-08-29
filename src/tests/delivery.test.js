const app = require("../app");
const request = require("supertest");
const { expect } = require("chai");
const mongoose = require("mongoose");
const UserModel = require("../models/user");
const OrderModel = require("../models/order");
const CourierModel = require("../models/courier");
const DeliveryModel = require("../models/delivery");
const fillUserData = require("../../mocks/userMocks");
const fillCourierData = require("../../mocks/couriersMock");

describe("Delivery API", () => {
  let order;
  let courier;

  beforeEach(async () => {
    const user = await UserModel.create(fillUserData());
    courier = await CourierModel.create(fillCourierData());
    order = await OrderModel.create({
      customerName: user.name,
      customer: user._id,
      address: "Calle de testing 123",
      weight: 5,
      cost: 50,
      priority: "normal",
      items: [{ name: "Paquete de prueba", quantity: 1, price: 100 }],
      courierId: courier._id,
    });

    trackTestDocument(UserModel, user._id);
    trackTestDocument(CourierModel, courier._id);
    trackTestDocument(OrderModel, order._id);
  });

  async function createDelivery() {
    const response = await request(app)
      .post("/api/deliveries")
      .send({ orderId: order._id, courierId: courier._id });

    trackTestDocument(DeliveryModel, response.body.data?._id);
    return response;
  }

  it("deberia crear un delivery", async () => {
    const response = await createDelivery();

    expect(response.status).to.equal(201);
    expect(response.body).to.have.property("status", "sucess");
    expect(response.body).to.have.property("data");
    expect(response.body.data).to.have.property("orderId", order._id.toString());
    expect(response.body.data).to.have.property(
      "courierId",
      courier._id.toString(),
    );
    expect(response.body.data).to.have.property("status");
    expect(response.body.data).to.have.property("assignedAt");
  });

  it("deberia devolver un error al crear si falta algun campo requerido", async () => {
    const response = await request(app)
      .post("/api/deliveries")
      .send({ orderId: "" });

    expect(response.status).to.equal(400);
    expect(response.body).to.have.property("status", "error");
    expect(response.body).to.have.property("error", "MISSING_REQUIRED_FIELDS");
  });

  it("deberia devolver todos los delivery", async () => {
    await createDelivery();
    const response = await request(app).get("/api/deliveries");

    expect(response.status).to.equal(200);
    expect(response.body).to.have.property("status", "sucess");
    expect(response.body).to.have.property("results");
    expect(response.body.results).to.be.at.least(1);
    expect(response.body.data).to.be.an("array");
  });

  it("deberia devolver un delivery por ID", async () => {
    const created = await createDelivery();
    const response = await request(app).get(
      `/api/deliveries/${created.body.data._id}`,
    );

    expect(response.status).to.equal(200);
    expect(response.body).to.have.property("status", "sucess");
    expect(response.body).to.have.property("data");
  });

  it("deberia devolver un error si no encuentra el pedido por id", async () => {
    const response = await request(app).get(
      `/api/deliveries/${new mongoose.Types.ObjectId()}`,
    );

    expect(response.status).to.equal(404);
    expect(response.body).to.have.property("status", "error");
    expect(response.body).to.have.property("error", "DELIVERY_NOT_FOUND");
  });

  it("deberia actualizar el status de un pedido", async () => {
    const created = await createDelivery();
    const response = await request(app)
      .patch(`/api/deliveries/${created.body.data._id}/status`)
      .send({ status: "in_transit" });

    expect(response.status).to.equal(200);
    expect(response.body).to.have.property("status", "sucess");
    expect(response.body).to.have.property("data");
    expect(response.body.data).to.have.property("_id", created.body.data._id);
    expect(response.body.data).to.have.property("status", "in_transit");
  });

  it("deberia devolver error si el status no es valido", async () => {
    const created = await createDelivery();
    const response = await request(app)
      .patch(`/api/deliveries/${created.body.data._id}/status`)
      .send({ status: "asdf" });

    expect(response.status).to.equal(400);
    expect(response.body).to.have.property("status", "error");
    expect(response.body).to.have.property("error", "INVALID_DELIVERY_STATUS");
  });
});
