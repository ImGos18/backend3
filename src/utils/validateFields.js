const { ERROR_CODES } = require("../errors/error-codes");
const AppError = require("./../errors/AppError");

function validateFields(data, requiredFields) {
  const missingFields = requiredFields.filter(
    (field) =>
      data[field] === undefined || data[field] === null || data[field] === "",
  );
  if (missingFields.length > 0) {
    throw new AppError(
      ERROR_CODES.MISSING_REQUIRED_FIELDS,
      `faltan los siguientes campos: ${missingFields.join(", ")}`,
    );
  }
}

module.exports = validateFields;
