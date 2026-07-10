const User = require("../models/user");

class UserRepository {
  static async create({ name, email, role }) {
    const user = await User.create({
      name,
      email,
      role: role,
    });

    return user;
  }
  static async getAll() {
    const users = await User.find();
    return users;
  }
  static async getOne({ id }) {
    const users = await User.findById(id);
    return users;
  }
  static async getRandom() {
    const usersRandom = User.aggregate([
      { $sample: { size: 1 } },
      { $project: { _id: 1, name: 1 } },
    ]);

    return usersRandom;
  }
}

module.exports = UserRepository;
