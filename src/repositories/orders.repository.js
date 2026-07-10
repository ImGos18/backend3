const Order = require("../models/order");

class OrderRepository {
  static async create(data) {
    const orderCreated = await Order.create(data);

    return orderCreated;
  }
  static async getOne(id) {
    const order = await Order.findById(id);
    return order;
  }
  static async updateStatus(id, status) {
    const orderUpdated = await Order.findByIdAndUpdate(
      id,
      { status: status },
      { returnDocument: "after" },
    );

    return orderUpdated;
  }
  static async getRandom() {
    const order = await Order.aggregate([
      { $sample: { size: 1 } },
      { $project: { _id: 1, courierId: 1 } },
    ]);

    return order;
  }
}

module.exports = OrderRepository;
