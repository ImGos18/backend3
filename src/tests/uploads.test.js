const request = require("supertest");
const { expect } = require("chai");
const app = require("./../app");
const UserModel = require("../models/user");
const CourierModel = require("../models/courier");
const OrderModel = require("../models/order");
const fillUserData = require("../../mocks/userMocks");
const fillCourierData = require("../../mocks/couriersMock");

const testFileOptions = {
  filename: "document.txt",
  contentType: "text/plain",
};

function testFile() {
  return Buffer.from("Documento generado para una prueba de upload.");
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
    expect(response.body).to.have.property("status", "sucess");
    expect(response.body.data.documents).to.have.lengthOf(1);
    expect(response.body.data.documents[0]).to.include({
      originalName: "document.txt",
      mimeType: "text/plain",
      type: "user_document",
    });
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
    expect(response.body).to.have.property("status", "sucess");
    expect(response.body.data.documents).to.have.lengthOf(1);
    expect(license).to.include({
      originalName: "document.txt",
      mimeType: "text/plain",
      type: "driver_license",
    });
  });

  it("Deberia subir un comprobante de entrega a una orden", async () => {
    const courier = await CourierModel.create(fillCourierData());
    const order = await OrderModel.create({
      customerName: "Cliente de prueba",
      address: "Calle de testing 123",
      weight: 5,
      cost: 50,
      courierId: courier._id,
      items: [{ name: "Paquete de prueba", quantity: 1, price: 100 }],
    });
    trackTestDocument(CourierModel, courier._id);
    trackTestDocument(OrderModel, order._id);

    const response = await request(app)
      .post(`/api/orders/${order._id}/proof`)
      .field("type", "delivery_proof")
      .attach("proof", testFile(), testFileOptions);

    const proof = response.body.data?.proof;
    trackTestFile(proof?.path);

    expect(response.status).to.equal(200);
    expect(response.body).to.have.property("status", "sucess");
    expect(proof).to.include({
      originalName: "document.txt",
      mimeType: "text/plain",
      type: "delivery_proof",
    });
  });
});
