const User = require("../models/user");
const {
  create,
  getAll,
  getOne,
} = require("./../utils/repositoriesStandardFunctions");

class UserRepository {
  static async create({ name, email, role }) {
    const user = await create(User, {
      name,
      email,
      role: role,
    });

    return user;
  }
  static async getAll({ page, limit }) {
    // const users = await User.find();
    const users = getAll(User, page, limit);
    return users;
  }
  static async getOne({ id }) {
    const users = await getOne(User, id);
    return users;
  }
  static async getRandom() {
    const usersRandom = User.aggregate([
      { $sample: { size: 1 } },
      { $project: { _id: 1, name: 1 } },
    ]);

    return usersRandom;
  }
  static async update({ id }, updateObject) {
    const userUpdated = await User.findByIdAndUpdate(id, updateObject, {
      new: true,
    });
    return userUpdated;
  }
}

module.exports = UserRepository;
