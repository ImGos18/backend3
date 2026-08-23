const app = require("../app");
const request = require("supertest");
const { expect } = require("chai");
const logger = require("./../config/logger");
const OrderModel = require("../models/order");
const CourierModel = require("../models/courier");
const DeliveryModel = require("./../models/delivery");
const fillOrderData = require("../../mocks/ordersMock");
const fillCourierData = require("../../mocks/couriersMock");
const fillDeliveryData = require("../../mocks/deliveryMocks");

describe("Delivery API", () => {
  it("deberia crear un delivery", async () => {
    const orderData = await fillOrderData();
    const courierData = fillCourierData();

    const order = await OrderModel.create(orderData);
    const courier = await CourierModel.create(courierData);

    const response = await request(app)
      .post("/api/deliveries")
      .send({ orderId: order._id, courierId: courier._id });
    expect(response.status).to.equal(201);
    expect(response.body).to.have.property("status", "sucess");
    expect(response.body).to.have.property("data");
    expect(response.body.data).to.have.property(
      "orderId",
      order._id.toString(),
    );
    expect(response.body.data).to.have.property(
      "courierId",
      courier._id.toString(),
    );
    expect(response.body.data).to.have.property("status");
    expect(response.body.data).to.have.property("assignedAt");

    await OrderModel.findByIdAndDelete(order._id);
    await CourierModel.findByIdAndDelete(courier._id);
    await DeliveryModel.findByIdAndDelete(response.body.data._id);

    logger.info(
      `se elimino la orden: ${order._id} despues de los tests de crear delivery`,
    );
    logger.info(
      `se elimino el courier: ${courier._id} despues de los tests de crear delivery`,
    );

    logger.info(
      `se elimino el delivery: ${response.body.data._id._id} despues de los tests de crear delivery`,
    );
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
    const response = await request(app).get("/api/deliveries");
    expect(response.status).to.equal(200);
    expect(response.body).to.have.property("status", "sucess");
    expect(response.body).to.have.property("results");
    expect(response.body.results).to.be.at.least(1);
    expect(response.body).to.have.property("data");
  });

  it("deberia devolver un delivery por ID", async () => {
    const orderData = await fillOrderData();
    const courierData = fillCourierData();

    const order = await OrderModel.create(orderData);
    const courier = await CourierModel.create(courierData);

    const response = await request(app)
      .post("/api/deliveries")
      .send({ orderId: order._id, courierId: courier._id });

    const response2 = await request(app).get(
      `/api/deliveries/${response.body.data._id}`,
    );

    expect(response2.status).to.equal(200);
    expect(response2.body).to.have.property("status", "sucess");
    expect(response2.body).to.have.property("data");

    await OrderModel.findByIdAndDelete(order._id);
    await CourierModel.findByIdAndDelete(courier._id);
    await DeliveryModel.findByIdAndDelete(response.body.data._id);

    logger.info(
      `se elimino la orden: ${order._id} despues de los tests de obtener un delivery por id delivery`,
    );
    logger.info(
      `se elimino el courier: ${courier._id} despues de los tests de obtener un delivery por id delivery`,
    );

    logger.info(
      `se elimino el delivery: ${response.body.data._id} despues de los tests de obtener un delivery por id delivery`,
    );
  });

  it("deberia devolver un error si no encuentra el pedido por id", async () => {
    const response = await request(app).get(
      "/api/deliveries/60d5f8b9c9c9c9c9c9c9c9c9",
    );
    expect(response.status).to.equal(404);
    expect(response.body).to.have.property("status", "error");
    expect(response.body).to.have.property("error", "DELIVERY_NOT_FOUND");
  });

  it("deberia actualizar el status de un pedido", async () => {
    const orderData = await fillOrderData();
    const courierData = fillCourierData();

    const order = await OrderModel.create(orderData);
    const courier = await CourierModel.create(courierData);

    const response = await request(app)
      .post("/api/deliveries")
      .send({ orderId: order._id, courierId: courier._id });

    const response2 = await request(app)
      .patch(`/api/deliveries/${response.body.data._id}/status`)
      .send({ status: "in_transit" });

    expect(response2.status).to.equal(200);
    expect(response2.body).to.have.property("status", "sucess");
    expect(response2.body).to.have.property("data");
    expect(response2.body.data).to.have.property("_id", response.body.data._id);
    expect(response2.body.data).to.have.property("status", "in_transit");

    await OrderModel.findByIdAndDelete(order._id);
    await CourierModel.findByIdAndDelete(courier._id);
    await DeliveryModel.findByIdAndDelete(response.body.data._id);

    logger.info(
      `se elimino la orden: ${order._id} despues de los tests de cambiar el status de un delivery`,
    );
    logger.info(
      `se elimino el courier: ${courier._id} despues de los tests de cambiar el status de un delivery`,
    );

    logger.info(
      `se elimino el delivery: ${courier._id} despues de los tests de cambiar el status de un delivery`,
    );
  });

  it("deberia devolver error si al actualizar el status de un pedido se ingresa un status no valido", async () => {
    const orderData = await fillOrderData();
    const courierData = fillCourierData();

    const order = await OrderModel.create(orderData);
    const courier = await CourierModel.create(courierData);

    const response = await request(app)
      .post("/api/deliveries")
      .send({ orderId: order._id, courierId: courier._id });

    const response2 = await request(app)
      .patch(`/api/deliveries/${response.body.data._id}/status`)
      .send({ status: "asdf" });

    expect(response2.status).to.equal(400);
    expect(response2.body).to.have.property("status", "error");
    expect(response2.body).to.have.property("error", "INVALID_DELIVERY_STATUS");

    await OrderModel.findByIdAndDelete(order._id);
    await CourierModel.findByIdAndDelete(courier._id);
    await DeliveryModel.findByIdAndDelete(response.body.data._id);

    logger.info(
      `se elimino la orden: ${order._id} despues de los tests de cambiar el status de un delivery`,
    );
    logger.info(
      `se elimino el courier: ${courier._id} despues de los tests de cambiar el status de un delivery`,
    );

    logger.info(
      `se elimino el delivery: ${response.body.data._id} despues de los tests de cambiar el status de un delivery`,
    );
  });
});
