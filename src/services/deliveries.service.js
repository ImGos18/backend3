const OrderService = require("./orders.service");
const CourierService = require("./couriers.service");
const DeliveriesRepository = require("./../repositories/deliveries.repository");
const AppError = require("./../errors/AppError");
const { ORDER_STATUS, TRACKING_STATES } = require("./../constants/index");
const { ERROR_CODES } = require("../errors/error-codes");
const validateFields = require("../utils/validateFields");
const { default: mongoose } = require("mongoose");

class DeliveriesService {
  static async create(data) {
    const requiredFields = ["orderId", "courierId", "status"];
    validateFields(data, requiredFields);

    const { orderId, courierId, status } = data;

    if (!TRACKING_STATES[status.toUpperCase()]) {
      throw new AppError(ERROR_CODES.INVALID_DELIVERY_STATUS);
    }

    if (
      !mongoose.isValidObjectId(courierId) ||
      !mongoose.isValidObjectId(orderId)
    ) {
      throw new AppError(
        ERROR_CODES.INVALID_OBJECT_ID,
        "el id de la orden o de el courier no tienen un formato valido",
      );
    }

    const order = await OrderService.getOne({ id: orderId });
    if (!order) {
      throw new AppError(ERROR_CODES.ORDER_NOT_FOUND);
    }
    const courier = await CourierService.getOne({ id: courierId });
    if (!courier) {
      throw new AppError(ERROR_CODES.COURIER_NOT_FOUND);
    }

    const delivery = await DeliveriesRepository.create({
      orderId,
      courierId,
      status,
    });

    return delivery;
  }
  static async getAll() {
    const deliveries = await DeliveriesRepository.getAll();

    if (!deliveries) {
      throw new AppError(
        ERROR_CODES.DELIVERY_NOT_FOUND,
        "no se encontraron deliveries",
      );
    }

    return deliveries;
  }
  static async getOne({ id }) {
    if (!id) {
      throw new AppError(ERROR_CODES.MISSING_OBJECT_ID);
    }

    if (!mongoose.isValidObjectId(id)) {
      throw new AppError(ERROR_CODES.INVALID_OBJECT_ID);
    }

    const delivery = await DeliveriesRepository.getOne({ id });
    if (!delivery) {
      throw new AppError(ERROR_CODES.DELIVERY_NOT_FOUND);
    }
    return delivery;
  }
  static async updateStatus({ id }, { status }) {
    const requiredFields = ["id", "status"];
    validateFields({ id, status }, requiredFields);

    if (!mongoose.isValidObjectId(id)) {
      throw new AppError(ERROR_CODES.INVALID_OBJECT_ID);
    }

    if (!TRACKING_STATES[status.toUpperCase()]) {
      throw new AppError(ERROR_CODES.INVALID_DELIVERY_STATUS);
    }
    const deliveryUpdated = await DeliveriesRepository.updateStatus({
      id,
      status,
    });

    return deliveryUpdated;
  }
}

module.exports = DeliveriesService;
