const { ERROR_CODES } = require("../errors/error-codes");
const UserRepository = require("../repositories/users.repository");
const mongoose = require("mongoose");
const { USER_ROLES, DOCUMENT_TYPES } = require("./../constants/index");
const AppError = require("./../errors/AppError");
const validateFields = require("../utils/validateFields");
const logger = require("../config/logger");
class UserService {
  static async create({ name, email, role = USER_ROLES.USER }) {
    const requiredFields = ["name", "email", "role"];

    validateFields({ name, email, role }, requiredFields);

    //validar rol si es correcto
    if (!Object.values(USER_ROLES).includes(role)) {
      throw new AppError(ERROR_CODES.VALIDATION_ERROR, "el rol no es valido");
    }

    const user = await UserRepository.create({ name, email, role });

    return user;
  }
  static async getAll() {
    const users = await UserRepository.getAll();
    if (!users) {
      throw new AppError(
        ERROR_CODES.USER_NOT_FOUND,
        "no se encontraton usuarios",
      );
    }
    return users;
  }
  static async getOne({ id }) {
    if (!id) throw new AppError(ERROR_CODES.MISSING_OBJECT_ID);

    if (!mongoose.isValidObjectId(id)) {
      throw new AppError(ERROR_CODES.INVALID_OBJECT_ID);
    }

    const user = await UserRepository.getOne({ id });
    if (!user) throw new AppError(ERROR_CODES.USER_NOT_FOUND);
    return user;
  }
  static async getRandom() {
    const usersRandom = UserRepository.getRandom();
    return usersRandom;
  }

  static async addDocument(id, file, type) {
    if (!file) {
      throw new AppError(ERROR_CODES.MISSING_FILE);
    }

    const user = await UserRepository.getOne({ id });
    if (!user) {
      throw new AppError(ERROR_CODES.USER_NOT_FOUND);
    }

    const document = {
      originalName: file.originalname,
      fileName: file.filename,
      path: file.path,
      mimeType: file.mimetype,
      size: file.size,
      type,
      uploadedAt: new Date(),
    };

    user.documents.push(document);

    const updatedUser = await UserRepository.update(
      { id },
      { documents: user.documents },
    );

    logger.info("Documento de usuario cargado correctamente", {
      userId: id,
      type,
    });
    return updatedUser;
  }
}

module.exports = UserService;
