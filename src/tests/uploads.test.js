const request = require("supertest");
const { expect } = require("chai");
const fs = require("fs/promises");
const path = require("path");
const mongoose = require("mongoose");
const app = require("./../app");
const UserModel = require("../models/user");
const CourierModel = require("../models/courier");
const OrderModel = require("../models/order");
const fillUserData = require("../../mocks/userMocks");
const fillCourierData = require("../../mocks/couriersMock");
const { MAX_FILE_SIZE } = require("../middlewares/upload.middleware");

const testFileOptions = {
  filename: "document.txt",
  contentType: "text/plain",
};

function testFile() {
  return Buffer.from("Documento generado para una prueba de upload.");
}

async function expectStoredFile(metadata) {
  const fileStats = await fs.stat(path.resolve(metadata.path));
  expect(fileStats.isFile()).to.equal(true);
  expect(fileStats.size).to.equal(metadata.size);
  expect(metadata).to.have.property("fileName").that.is.not.empty;
  expect(metadata).to.have.property("uploadedAt");
}

describe("Uploads API", () => {
  it("Deberia subir un documento", async () => {
    const user = await UserModel.create(fillUserData());
    trackTestDocument(UserModel, user._id);

    const response = await request(app)
      .post(`/api/users/${user._id}/documents`)
      .field("type", "user_document")
      .attach("document", testFile(), testFileOptions);

    trackTestFile(response.body.data?.documents?.[0]?.path);

    expect(response.status).to.equal(200);
    expect(response.body).to.have.property("status", "success");
    expect(response.body.data.documents).to.have.lengthOf(1);
    expect(response.body.data.documents[0]).to.include({
      originalName: "document.txt",
      mimeType: "text/plain",
      type: "user_document",
    });
    await expectStoredFile(response.body.data.documents[0]);
  });

  it("Deberia subir una licencia de conducir a un courier", async () => {
    const courier = await CourierModel.create(fillCourierData());
    trackTestDocument(CourierModel, courier._id);

    const response = await request(app)
      .post(`/api/couriers/${courier._id}/documents`)
      .field("type", "driver_license")
      .attach("license", testFile(), testFileOptions);

    const license = response.body.data?.documents?.[0];
    trackTestFile(license?.path);

    expect(response.status).to.equal(200);
    expect(response.body).to.have.property("status", "success");
    expect(response.body.data.documents).to.have.lengthOf(1);
    expect(license).to.include({
      originalName: "document.txt",
      mimeType: "text/plain",
      type: "driver_license",
    });
    await expectStoredFile(license);
  });

  it("Deberia subir un comprobante de entrega a una orden", async () => {
    const courier = await CourierModel.create(fillCourierData());
    trackTestDocument(CourierModel, courier._id);

    const order = await OrderModel.create({
      customerName: "Cliente de prueba",
      address: "Calle de testing 123",
      weight: 5,
      cost: 50,
      courierId: courier._id,
      items: [{ name: "Paquete de prueba", quantity: 1, price: 100 }],
    });
    trackTestDocument(OrderModel, order._id);

    const response = await request(app)
      .post(`/api/orders/${order._id}/proof`)
      .field("type", "delivery_proof")
      .attach("proof", testFile(), testFileOptions);

    const proof = response.body.data?.proof;
    trackTestFile(proof?.path);

    expect(response.status).to.equal(200);
    expect(response.body).to.have.property("status", "success");
    expect(proof).to.include({
      originalName: "document.txt",
      mimeType: "text/plain",
      type: "delivery_proof",
    });
    await expectStoredFile(proof);
  });

  it("deberia devolver error cuando falta el archivo", async () => {
    const user = await UserModel.create(fillUserData());
    trackTestDocument(UserModel, user._id);

    const response = await request(app)
      .post(`/api/users/${user._id}/documents`)
      .field("type", "user_document");

    expect(response.status).to.equal(400);
    expect(response.body).to.include({
      status: "error",
      error: "FILE_REQUIRED",
    });
  });

  it("deberia devolver error cuando el tipo de documento es invalido", async () => {
    const user = await UserModel.create(fillUserData());
    trackTestDocument(UserModel, user._id);

    const response = await request(app)
      .post(`/api/users/${user._id}/documents`)
      .field("type", "tipo_inexistente")
      .attach("document", testFile(), testFileOptions);

    expect(response.status).to.equal(400);
    expect(response.body).to.include({
      status: "error",
      error: "INVALID_DOCUMENT_TYPE",
    });
  });

  it("deberia devolver error cuando el MIME no esta permitido", async () => {
    const user = await UserModel.create(fillUserData());
    trackTestDocument(UserModel, user._id);

    const response = await request(app)
      .post(`/api/users/${user._id}/documents`)
      .field("type", "user_document")
      .attach("document", testFile(), {
        filename: "script.js",
        contentType: "application/javascript",
      });

    expect(response.status).to.equal(400);
    expect(response.body).to.include({
      status: "error",
      error: "INVALID_FILE_TYPE",
    });
  });

  it("deberia devolver error cuando el archivo supera 5MB", async () => {
    const user = await UserModel.create(fillUserData());
    trackTestDocument(UserModel, user._id);

    const response = await request(app)
      .post(`/api/users/${user._id}/documents`)
      .field("type", "user_document")
      .attach("document", Buffer.alloc(MAX_FILE_SIZE + 1), testFileOptions);

    expect(response.status).to.equal(413);
    expect(response.body).to.include({
      status: "error",
      error: "FILE_TOO_LARGE",
    });
  });

  it("deberia devolver error cuando el campo de archivo no coincide", async () => {
    const user = await UserModel.create(fillUserData());
    trackTestDocument(UserModel, user._id);

    const response = await request(app)
      .post(`/api/users/${user._id}/documents`)
      .field("type", "user_document")
      .attach("archivo", testFile(), testFileOptions);

    expect(response.status).to.equal(400);
    expect(response.body).to.include({
      status: "error",
      error: "INVALID_FILE_FIELD",
    });
  });

  it("deberia eliminar el comprobante si la orden no existe", async () => {
    const proofDirectory = path.resolve("uploads/proofs");
    const filesBefore = new Set(await fs.readdir(proofDirectory));

    const response = await request(app)
      .post(`/api/orders/${new mongoose.Types.ObjectId()}/proof`)
      .field("type", "delivery_proof")
      .attach("proof", testFile(), testFileOptions);

    const filesAfter = new Set(await fs.readdir(proofDirectory));

    expect(response.status).to.equal(404);
    expect(response.body).to.include({
      status: "error",
      error: "ORDER_NOT_FOUND",
    });
    expect(filesAfter).to.deep.equal(filesBefore);
  });
});
