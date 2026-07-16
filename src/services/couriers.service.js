const CourierRepository = require("./../repositories/couriers.repository");
const AppError = require("./../errors/AppError");

const { ERROR_CODES } = require("./../errors/error-codes");

class CourierService {
  static async create({ name, zone, available }) {
    if (!name || !zone || typeof available !== "boolean") {
      console.log(name, zone, available);
      throw new AppError(
        ERROR_CODES.VALIDATION_ERROR,
        "Faltan campos requeridos",
      );
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
    if (!allCouriers) {
      throw new Error(
        ERROR_CODES.ROUTE_NOT_FOUND,
        "no se encontraron couriers",
      );
    }
    return allCouriers;
  }

  static async getOne({ id }) {
    if (!id) {
      throw new Error(
        ERROR_CODES.VALIDATION_ERROR,
        "no proporcionaste ningun id",
      );
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
