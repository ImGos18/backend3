const { ERROR_CODES } = require("../errors/error-codes");
const config = require("../config/index");

exports.notFoundHandler = (req, res, next) => {
  const error = new Error("La ruta solicitada no existe");
  error.code = ERROR_CODES.ROUTE_NOT_FOUND;
  error.statusCode = 404;
  error.isOperational = true;
  next(error);
};

exports.errorHandler = (error, req, res, next) => {
  const statusCode = error.statusCode || 500;
  const errorCode = error.code || ERROR_CODES.INTERNAL_SERVER_ERROR;

  const response = {
    status: "error",
    error: errorCode,
    message: error.message || "ocurrio un error interno en el servidor",
  };

  if (config.NODE_ENV === "development" && error.details) {
    response.details = error.details;
  }

  res.status(statusCode).json(response);
};
