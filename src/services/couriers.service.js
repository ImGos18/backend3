const CourierRepository = require("./../repositories/couriers.repository");

class CourierService {
  static async create({ name, zone, available }) {
    if (!name || !zone || typeof available !== "boolean") {
      console.log(name, zone, available);
      throw new Error("Faltan campos requeridos");
    }

    const courierData = {
      name,
      zone,
      available,
    };
    const courier = await CourierRepository.create(courierData);

    return courier;
  }

  static async getAll() {
    const allCouriers = await CourierRepository.getAll();
    return allCouriers;
  }

  static async getOne({ id }) {
    if (!id) {
      throw new Error("no proporcionaste ningun id");
    }

    const courier = await CourierRepository.getOne({ id });

    return courier;
  }
  static async getRandom() {
    const CouriersRandom = CourierRepository.getRandom();
    return CouriersRandom;
  }
}

module.exports = CourierService;
