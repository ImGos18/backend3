const Order = require("../models/order");
const {
  create,
  getAll,
  getOne,
} = require("./../utils/repositoriesStandardFunctions");

class OrderRepository {
  static async create(data) {
    const orderCreated = await create(Order, data);

    return orderCreated;
  }
  static async getOne(id) {
    const order = await getOne(Order, id);
    return order;
  }

  static async getAll({ page, limit }) {
    const orders = await getAll(Order, page, limit);
    return orders;
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

  static async update(id, data) {
    const orderUpdated = await Order.findByIdAndUpdate(id, data, {
      new: true,
    });
    return orderUpdated;
  }
}

module.exports = OrderRepository;
