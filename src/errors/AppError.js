const { ERROR_CODES } = require("./error-codes");
const { errorsDictionary } = require("./errors.dictionary");

class AppError extends Error {
  constructor(
    code = ERROR_CODES.INTERNAL_SERVER_ERROR,
    customMessage,
    details,
  ) {
    const errorDefinition =
      errorsDictionary[code] || errorsDictionary.INTERNAL_SERVER_ERROR;

    super(customMessage || errorDefinition.message);
    this.code = code;
    this.statusCode = errorDefinition.statusCode;
    this.details = details;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
