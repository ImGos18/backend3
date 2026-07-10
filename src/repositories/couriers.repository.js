const Courier = require("./../models/courier");

class CourierRepository {
  static async create({ name, zone, available }) {
    const courier = await Courier.create({ name, zone, available });

    return courier;
  }

  static async getAll() {
    const allCouriers = await Courier.find();

    return allCouriers;
  }
  static async getOne({ id }) {
    const courier = Courier.findById(id);
    return courier;
  }
  static async getRandom() {
    const CouriersRandom = Courier.aggregate([
      { $sample: { size: 1 } },
      { $project: { _id: 1 } },
    ]);

    return CouriersRandom;
  }
}

module.exports = CourierRepository;
