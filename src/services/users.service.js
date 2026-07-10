const UserRepository = require("../repositories/users.repository");
const { USER_ROLES } = require("./../constants/index");

class UserService {
  static async create({ name, email, role = USER_ROLES.USER }) {
    if (!name || !email) {
      throw new Error("Faltan datos obligatorios del usuario");
    }

    //validar rol si es correcto
    if (!Object.values(USER_ROLES).includes(role)) {
      throw new Error("el rol no es valido");
    }

    const user = await UserRepository.create({ name, email, role });

    return user;
  }
  static async getAll() {
    const users = await UserRepository.getAll();
    return users;
  }
  static async getOne({ id }) {
    if (!id) throw new Error("no ingresaste ningun id");
    const user = await UserRepository.getOne({ id });
    return user;
  }
  static async getRandom() {
    const usersRandom = UserRepository.getRandom();
    return usersRandom;
  }
}

module.exports = UserService;
