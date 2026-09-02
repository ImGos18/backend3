const app = require("./../app.js");
const ProductModel = require("./../models/product");
const request = require("supertest");
const fillProductData = require("./../../mocks/productsMock");
const { expect } = require("chai");
const mongoose = require("mongoose");

describe("Product API", () => {
  it("deberia crear un producto", async () => {
    const productData = fillProductData();
    const response = await request(app).post("/api/products").send(productData);
    trackTestDocument(ProductModel, response.body.data?._id);

    expect(response.status).to.equal(201);
    expect(response.body).to.have.property("data");
    expect(response.body.data).to.have.property("name", productData.name);
    expect(response.body.data).to.have.property("price", productData.price);
    expect(response.body.data).to.have.property("stock", productData.stock);
  });

  it("deberia devolver un error si faltan campos al crear el producto", async () => {
    const productData = fillProductData();
    productData.name = undefined;
    productData.price = undefined;
    const response = await request(app).post("/api/products").send(productData);
    trackTestDocument(ProductModel, response.body.data?._id);

    expect(response.status).to.equal(400);

    expect(response.body).to.have.property("status", "error");
    expect(response.body).to.have.property("error", "MISSING_REQUIRED_FIELDS");
  });

  it("deberia devolver todos los productos", async () => {
    const response = await request(app).get("/api/products");
    expect(response.status).to.equal(200);
    expect(response.body).to.have.property("status", "success");
    expect(response.body).to.have.property("results");
    expect(response.body).to.have.property("data");
    expect(response.body.data).to.be.an("array");
  });

  it("deberia devolver un solo producto por ID", async () => {
    const product = await ProductModel.create(fillProductData());
    trackTestDocument(ProductModel, product._id);
    const response = await request(app).get(`/api/products/${product._id}`);
    expect(response.status).to.equal(200);
    expect(response.body).to.have.property("status", "success");
  });

  it("deberia devolver error si el id ingresado no es valido", async () => {
    const response = await request(app).get("/api/products/invalidId");
    expect(response.status).to.equal(400);
    expect(response.body).to.have.property("status", "error");
    expect(response.body).to.have.property("error", "INVALID_OBJECT_ID");
  });

  it("deberia devolver un error si no se encuentra el producto", async () => {
    const response = await request(app).get(
      `/api/products/${new mongoose.Types.ObjectId()}`,
    );
    expect(response.status).to.equal(404);
    expect(response.body).to.have.property("status", "error");
    expect(response.body).to.have.property("error", "PRODUCT_NOT_FOUND");
  });
});
