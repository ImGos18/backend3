const OrderRepository = require("./../repositories/orders.repository");
const validateFields = require("./../utils/validateFields");
const { ORDER_STATUS } = require("./../constants/index");
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
      return res.status(400).send("El peso debe ser un numero mayor a 0");
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
      throw new Error("debes ingresar un id valido");
    }
    const order = await OrderRepository.getOne(id);

    return order;
  }

  static async updateStatus({ id }, { status }) {
    if (!id || !status) {
      throw new Error("falta el id o el estaod a actualizar");
    }
    if (!ORDER_STATUS[status.toUpperCase()]) {
      throw new Error("el valor de status esta fuera de rango");
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
