const OrderRepository = require("./../repositories/orders.repository");
const validateFields = require("./../utils/validateFields");
const { ORDER_STATUS } = require("./../constants/index");
const AppError = require("../errors/AppError");
const { ERROR_CODES } = require("./../errors/error-codes");
const { default: mongoose, mongo } = require("mongoose");

class OrderService {
  static async create(data) {
    const requestedFields = [
      "customerName",
      "address",
      "weight",
      "courierId",
      "items",
    ];

    validateFields(data, requestedFields);

    const {
      customerName,
      customer,
      address,
      weight,
      courierId,
      items,
      priority,
    } = data;

    if (typeof weight !== "number" || weight <= 0) {
      throw new AppError(
        ERROR_CODES.VALIDATION_ERROR,
        "El peso debe ser un numero mayor a 0",
      );
    }

    const shippingCost = weight * 10;

    const order = await OrderRepository.create({
      customerName,
      customer: customer || null,
      address,
      weight,
      cost: shippingCost,
      priority: priority || "normal",
      items: items || [],
      courierId: courierId || null,
    });

    return order;
  }

  static async getOne({ id }) {
    if (!id) {
      throw new AppError(ERROR_CODES.MISSING_OBJECT_ID);
    }

    if (!mongoose.isValidObjectId(id)) {
      throw new AppError(ERROR_CODES.INVALID_OBJECT_ID);
    }
    const order = await OrderRepository.getOne(id);

    if (!order) {
      throw new AppError(ERROR_CODES.ORDER_NOT_FOUND);
    }
    return order;
  }

  static async getAll() {
    const orders = await OrderRepository.getAll();
    if (!orders) throw new AppError(ERROR_CODES.ORDER_NOT_FOUND);

    return orders;
  }

  static async updateStatus({ id }, { status }) {
    const requiredFields = ["id", "status"];
    validateFields({ id, status }, requiredFields);

    if (!mongoose.isValidObjectId(id)) {
      throw new AppError(ERROR_CODES.INVALID_OBJECT_ID);
    }

    if (!ORDER_STATUS[status.toUpperCase()]) {
      throw new AppError(ERROR_CODES.INVALID_ORDER_STATUS);
    }

    const orderUpdated = await OrderRepository.updateStatus(id, status);
    return orderUpdated;
  }
  static async getRandom() {
    const randomOrder = await OrderRepository.getRandom();
    return randomOrder;
  }
}

module.exports = OrderService;
