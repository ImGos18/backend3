const OrderService = require("./orders.service");
const CourierService = require("./couriers.service");
const DeliveriesRepository = require("./../repositories/deliveries.repository");
const { ORDER_STATUS } = require("./../constants/index");

class DeliveriesService {
  static async create(data) {
    const { orderId, courierId, status } = data;

    if (!orderId || !courierId) {
      return res.status(400).send("Faltan orderId o courierId");
    }

    const order = await OrderService.getOne({ id: orderId });
    if (!order) {
      throw new Error("Order no encontrada");
    }
    const courier = await CourierService.getOne({ id: courierId });
    if (!courier) {
      throw new Error("Courier no encontrado");
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
      throw new Error("no proporcionaste ningun id");
    }
    console.log(id);
    const delivery = await DeliveriesRepository.getOne({ id });
    if (!delivery) {
      throw new Error("Delivery no encontrada");
    }
    return delivery;
  }
  static async updateStatus({ id }, { status }) {
    if (!id) {
      throw new Error(
        "debes ingresar un id de orden para actualizar su status",
      );
    }
    if (!status || !ORDER_STATUS[status.toUpperCase()]) {
      throw new Error("el status ingresado no existe o es invalido");
    }
    console.log(id, status);
    const deliveryUpdated = await DeliveriesRepository.updateStatus({
      id,
      status,
    });

    return deliveryUpdated;
  }
}

module.exports = DeliveriesService;
