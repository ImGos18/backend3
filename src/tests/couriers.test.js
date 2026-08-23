const request = require("supertest");
const { expect } = require("chai");
const app = require("../app");
const CourierModel = require("../models/courier");
const fillCourierData = require("./../../mocks/couriersMock");
const logger = require("../config/logger");

describe("Couriers API", () => {
  it("deberia crear un nuevo courier", async () => {
    const courierData = fillCourierData();
    const response = await request(app).post("/api/couriers").send(courierData);
    expect(response.status).to.equal(201);
    expect(response.body).to.have.property("status", "sucess");
    expect(response.body).to.have.property("data");
    expect(response.body.data).to.have.property("name", courierData.name);
    expect(response.body.data).to.have.property("zone", courierData.zone);
    await CourierModel.findByIdAndDelete(response.body.data._id);
    logger.info(
      `se elimino correctamente el courier ${response.body.data._id} despues de la prueba de crear courier`,
    );
  });

  it("deberia devolver un error si faltan campos requeridos al crear courier", async () => {
    const response = await request(app).post("/api/couriers").send({});
    expect(response.status).to.equal(400);
    expect(response.body).to.have.property("status", "error");
    expect(response.body).to.have.property("error", "MISSING_REQUIRED_FIELDS");
  });

  it("deberia devolver todos los couriers", async () => {
    const response = await request(app).get("/api/couriers");
    expect(response.status).to.equal(200);
    expect(response.body).to.have.property("status", "sucess");
    expect(response.body).to.have.property("data");
    expect(response.body.data).to.be.an("array");
    expect(response.body.data.length).to.be.at.least(1);
  });

  it("deberia devolver un courier por id", async () => {
    const courierData = fillCourierData();
    const courier = await CourierModel.create(courierData);
    const response = await request(app).get(`/api/couriers/${courier._id}`);
    expect(response.status).to.equal(200);
    expect(response.body).to.have.property("status", "sucess");
    expect(response.body).to.have.property("data");
    expect(response.body.data).to.be.an("object");
    expect(response.body.data).to.have.property("_id", courier._id.toString());

    await CourierModel.findByIdAndDelete(courier._id);
    logger.info(
      `se elimino el courier ${courier._id} despues de la prueba de busqueda por id`,
    );
  });

  it("deberia devolver un error si el id de courier es invalido", async () => {
    const response = await request(app).get("/api/couriers/invalidId");
    expect(response.status).to.equal(400);
    expect(response.body).to.have.property("status", "error");
    expect(response.body).to.have.property("error", "INVALID_OBJECT_ID");
  });

  it("deberia devolver un error si no se encuentra el courier con el id Proporcionado", async () => {
    const response = await request(app).get(
      "/api/couriers/64b8e5f6e5f6e5f6e5f6e5f6",
    );

    expect(response.status).to.equal(404);
    expect(response.body).to.have.property("status", "error");
    expect(response.body).to.have.property("error", "COURIER_NOT_FOUND");
  });
});
