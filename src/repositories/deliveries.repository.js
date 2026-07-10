const Delivery = require("./../models/delivery");

class DeliveriesRepository {
  static async create({ orderId, courierId, status }) {
    const delivery = await Delivery.create({ orderId, courierId, status });
    return delivery;
  }
  static async getAll() {
    const deliveries = await Delivery.find();
    return deliveries;
  }
  static async getOne({ id }) {
    const delivery = await Delivery.findById(id);

    return delivery;
  }
  static async updateStatus({ id, status }) {
    const deliveryUpdated = await Delivery.findByIdAndUpdate(id, {
      status: status,
    });

    return deliveryUpdated;
  }
}

module.exports = DeliveriesRepository;
