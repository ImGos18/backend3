const app = require("./../app");
const UserModel = require("./../models/user");
const request = require("supertest");
const fillUserData = require("./../../mocks/userMocks");
const { expect } = require("chai");
const mongoose = require("mongoose");

describe("Users endpoints", () => {
  it("deberia crear un usuario en base de datos", async () => {
    const user = fillUserData();
    const response = await request(app).post("/api/users").send(user);
    trackTestDocument(UserModel, response.body.data?._id);

    expect(response.status).to.equal(201);
    expect(response.body).to.have.property("status", "sucess");
    expect(response.body).to.have.property("data");
    expect(response.body.data).to.have.property("_id");
  });

  it("deberia devolver un error si falta nombre o email", async () => {
    const user = fillUserData();
    user.email = "";

    const response = await request(app).post("/api/users").send(user);
    expect(response.status).to.equal(400);
    expect(response.body).to.have.property("status", "error");
    expect(response.body).to.have.property("error", "MISSING_REQUIRED_FIELDS");
  });

  it("deberia buscar un usuario por id", async () => {
    const user = await UserModel.create(fillUserData());
    trackTestDocument(UserModel, user._id);

    const response = await request(app).get(`/api/users/${user._id}`);

    expect(response.status).to.equal(200);
    expect(response.body).to.have.property("status", "sucess");
    expect(response.body).to.have.property("results");
    expect(response.body).to.have.property("data");
    expect(response.body.data).to.have.property("_id");
  });

  it("deberia devolver error si el id proporcionado no es valido", async () => {
    const response = await request(app).get("/api/users/6a5108f9c32d0");

    expect(response.status).to.equal(400);
    expect(response.body).to.have.property("status", "error");
    expect(response.body).to.have.property("error", "INVALID_OBJECT_ID");
  });

  it("deberia devolver error si el usuario no existe", async () => {
    const response = await request(app).get(
      `/api/users/${new mongoose.Types.ObjectId()}`,
    );

    expect(response.status).to.equal(404);
    expect(response.body).to.have.property("status", "error");
    expect(response.body).to.have.property("error", "USER_NOT_FOUND");
  });
});
