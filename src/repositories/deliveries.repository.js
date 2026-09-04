const Delivery = require("./../models/delivery");
const {
  create,
  getAll,
  getOne,
} = require("./../utils/repositoriesStandardFunctions");

class DeliveriesRepository {
  static async create({ orderId, courierId, status }) {
    const delivery = await create(Delivery, { orderId, courierId, status });
    return delivery;
  }
  static async getAll({ page, limit }) {
    const deliveries = await getAll(Delivery, page, limit);
    return deliveries;
  }
  static async getOne({ id }) {
    const delivery = await getOne(Delivery, id);

    return delivery;
  }
  static async updateStatus({ id, status }) {
    const deliveryUpdated = await Delivery.findByIdAndUpdate(
      id,
      {
        status: status,
      },
      { new: true },
    );

    return deliveryUpdated;
  }
}

module.exports = DeliveriesRepository;
