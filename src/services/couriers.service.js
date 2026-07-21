const CourierRepository = require("./../repositories/couriers.repository");
const AppError = require("./../errors/AppError");
const { ERROR_CODES } = require("./../errors/error-codes");
const validateFields = require("../utils/validateFields");
const { default: mongoose, isValidObjectId } = require("mongoose");

class CourierService {
  static async create(data) {
    const requiredFields = ["name", "zone", "available"];

    validateFields(data, requiredFields);

    const { name, zone, available } = data;

    const courierData = {
      name,
      zone,
      available,
    };

    if (typeof available !== "boolean") {
      throw new AppError(
        ERROR_CODES.VALIDATION_ERROR,
        "las disponobilidad debe ser un valor booleano",
      );
    }

    const courier = await CourierRepository.create(courierData);

    return courier;
  }

  static async getAll() {
    const allCouriers = await CourierRepository.getAll();
    if (!allCouriers) {
      throw new Error(ERROR_CODES.COURIER_NOT_FOUND);
    }
    return allCouriers;
  }

  static async getOne({ id }) {
    if (!id) {
      throw new Error(ERROR_CODES.MISSING_OBJECT_ID);
    }

    if (!mongoose.isValidObjectId(id)) {
      throw new AppError(ERROR_CODES.INVALID_OBJECT_ID);
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
