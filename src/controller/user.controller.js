const user = require("../models/user");
const UserService = require("../services/users.service");
const fillUserData = require("./../../mocks/userMocks");

class UserController {
  static async create(req, res) {
    try {
      const user = await UserService.create(req.body);

      console.log("User creado:", user._id);
      res.status(201).json(user);
    } catch (error) {
      console.log("Error al crear user:", error.message);
      res.status(500).send("Error del servidor");
    }
  }
  static async getAll(req, res) {
    try {
      const users = await UserService.getAll();
      res
        .status(200)
        .json({ status: "sucess", results: users.length, data: users });
    } catch (err) {
      console.log("algo salio mal al obtener los usuarios", err.message);
      res.status(500).send("error del servidor ");
    }
  }
  static async getOne(req, res) {
    try {
      console.log(req.params);
      const user = await UserService.getOne(req.params);
      res.status(200).json({ status: "sucess", data: user });
    } catch (err) {
      console.log("algo salio mal al obtener el usuario", err.message);
      res.status(500).send("error del servidor ");
    }
  }
}

module.exports = UserController;
