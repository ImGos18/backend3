const OrderService = require("./orders.service");
const CourierService = require("./couriers.service");
const DeliveriesRepository = require("./../repositories/deliveries.repository");
const AppError = require("./../errors/AppError");
const { ORDER_STATUS } = require("./../constants/index");
const { ERROR_CODES } = require("../errors/error-codes");

class DeliveriesService {
  static async create(data) {
    const { orderId, courierId, status } = data;

    if (!orderId || !courierId) {
      throw new AppError(
        ERROR_CODES.VALIDATION_ERROR,
        "Faltan orderId o courierId",
      );
    }

    const order = await OrderService.getOne({ id: orderId });
    if (!order) {
      throw new AppError(ERROR_CODES.ORDER_NOT_FOUND, "Order no encontrada");
    }
    const courier = await CourierService.getOne({ id: courierId });
    if (!courier) {
      throw new AppError(
        ERROR_CODES.COURIER_NOT_FOUND,
        "Courier no encontrado",
      );
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
    return deliveries;
  }
  static async getOne({ id }) {
    if (!id) {
      throw new AppError(
        ERROR_CODES.VALIDATION_ERROR,
        "no proporcionaste ningun id",
      );
    }
    console.log(id);
    const delivery = await DeliveriesRepository.getOne({ id });
    if (!delivery) {
      throw new AppError(
        ERROR_CODES.DELIVERY_NOT_FOUND,
        "no se encontro el Delivery",
      );
    }
    return delivery;
  }
  static async updateStatus({ id }, { status }) {
    if (!id) {
      throw new AppError(
        ERROR_CODES.VALIDATION_ERROR,
        "debes ingresar un id de orden para actualizar su status",
      );
    }
    if (!status || !ORDER_STATUS[status.toUpperCase()]) {
      throw new AppError(
        ERROR_CODES.VALIDATION_ERROR,
        "el status ingresado no existe o es invalido",
      );
    }
    const deliveryUpdated = await DeliveriesRepository.updateStatus({
      id,
      status,
    });

    return deliveryUpdated;
  }
}

module.exports = DeliveriesService;
