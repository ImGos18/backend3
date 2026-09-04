const Courier = require("./../models/courier");
const {
  create,
  getAll,
  getOne,
} = require("./../utils/repositoriesStandardFunctions");

class CourierRepository {
  static async create({ name, zone, available }) {
    const courier = await create(Courier, { name, zone, available });

    return courier;
  }

  static async getAll({ page, limit }) {
    const Couriers = await getAll(Courier, page, limit);

    return Couriers;
  }
  static async getOne({ id }) {
    const courier = getOne(Courier, id);
    return courier;
  }
  static async getRandom() {
    const CouriersRandom = Courier.aggregate([
      { $sample: { size: 1 } },
      { $project: { _id: 1 } },
    ]);

    return CouriersRandom;
  }
  static async update(id, data) {
    const courierUpdated = await Courier.findByIdAndUpdate(id, data, {
      new: true,
    });
    return courierUpdated;
  }
}

module.exports = CourierRepository;
