const request = require("supertest");
const { expect } = require("chai");
const app = require("../app");
const CourierModel = require("../models/courier");
const fillCourierData = require("./../../mocks/couriersMock");
const mongoose = require("mongoose");

describe("Couriers API", () => {
  let existingCourier;

  beforeEach(async () => {
    existingCourier = await CourierModel.create(fillCourierData());
    trackTestDocument(CourierModel, existingCourier._id);
  });

  it("deberia crear un nuevo courier", async () => {
    const courierData = fillCourierData();
    const response = await request(app).post("/api/couriers").send(courierData);
    trackTestDocument(CourierModel, response.body.data?._id);

    expect(response.status).to.equal(201);
    expect(response.body).to.have.property("status", "sucess");
    expect(response.body).to.have.property("data");
    expect(response.body.data).to.have.property("name", courierData.name);
    expect(response.body.data).to.have.property("zone", courierData.zone);
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
    const response = await request(app).get(
      `/api/couriers/${existingCourier._id}`,
    );
    expect(response.status).to.equal(200);
    expect(response.body).to.have.property("status", "sucess");
    expect(response.body).to.have.property("data");
    expect(response.body.data).to.be.an("object");
    expect(response.body.data).to.have.property(
      "_id",
      existingCourier._id.toString(),
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
      `/api/couriers/${new mongoose.Types.ObjectId()}`,
    );

    expect(response.status).to.equal(404);
    expect(response.body).to.have.property("status", "error");
    expect(response.body).to.have.property("error", "COURIER_NOT_FOUND");
  });
});
