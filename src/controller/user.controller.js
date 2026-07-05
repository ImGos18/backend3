const UserService = require("../services/users.service");
const fillUserData = require("./../../mocks/userMocks");

class UserController {
  static async create(req, res) {
    try {
      const { name, email, role } = req.body;

      const user = await UserService.create({ name, email, role });

      console.log("User creado:", user._id);
      res.status(201).json(user);
    } catch (error) {
      console.log("Error al crear user:", error.message);
      res.status(500).send("Error del servidor");
    }
  }
  static async fillDB(req, res) {
    try {
      let users = [];
      for (let i = 0; i < 100; i++) {
        const user = await UserService.create(fillUserData());
        users.push(user);
      }
      res.status(201).json({ status: "ok", users });
    } catch (error) {
      console.log("Error al crear user:", error.message);
      res.status(500).send("Error del servidor");
    }
  }
}

module.exports = UserController;
