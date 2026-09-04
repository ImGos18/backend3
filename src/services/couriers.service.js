const CourierRepository = require("./../repositories/couriers.repository");
const AppError = require("./../errors/AppError");
const { ERROR_CODES } = require("./../errors/error-codes");
const validateFields = require("../utils/validateFields");
const mongoose = require("mongoose");
const { DOCUMENT_TYPES } = require("../constants");
const createFileMetadata = require("../utils/fileMetadata");
const logger = require("../config/logger");

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

  static async getAll({ page, limit }) {
    const allCouriers = await CourierRepository.getAll({ page, limit });
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

    if (!courier) {
      throw new AppError(ERROR_CODES.COURIER_NOT_FOUND);
    }

    return courier;
  }
  static async getRandom() {
    const CouriersRandom = CourierRepository.getRandom();
    return CouriersRandom;
  }

  static async uploadDocument(id, file, type) {
    if (!file) {
      throw new AppError(ERROR_CODES.FILE_REQUIRED);
    }
    if (!mongoose.isValidObjectId(id)) {
      throw new AppError(ERROR_CODES.INVALID_OBJECT_ID);
    }
    if (type !== DOCUMENT_TYPES.DRIVER_LICENSE) {
      throw new AppError(ERROR_CODES.INVALID_DOCUMENT_TYPE);
    }
    const courier = await CourierRepository.getOne({ id });
    if (!courier) {
      throw new AppError(ERROR_CODES.COURIER_NOT_FOUND);
    }
    try {
      const licence = createFileMetadata(file, type);
      courier.documents.push(licence);

      return await CourierRepository.update(id, {
        documents: courier.documents,
      });
    } catch (error) {
      logger.error("No se pudieron guardar los metadatos de la licencia", {
        courierId: id,
        error: error.message,
      });
      throw new AppError(ERROR_CODES.UPLOAD_ERROR);
    }
  }
}

module.exports = CourierService;
